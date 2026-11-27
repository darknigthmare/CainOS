"""Read public official episode storyboard stills for source inspection only."""
from pathlib import Path
import concurrent.futures
import hashlib
import json
import urllib.request
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent
out = root / 'references'
pages = {'pilot-page': list(range(18)), 'canyon-page': list(range(2, 12)),
         'manor-page': [2, 3, 4, 5], 'lake-page': [1, 2, 3, 4, 5]}
tasks = []
for row in json.loads((out / 'retrieval-initial.json').read_text()):
    if row['id'] not in pages:
        continue
    parts = row['storyboardSpecs'][0].split('|')
    level = len(parts) - 2
    width, height, count, columns, rows, interval, pattern, signature = parts[-1].split('#')
    for page in pages[row['id']]:
        name = pattern.replace('$M', str(page))
        url = parts[0].replace('$L', str(level)).replace('$N', name) + '&sigh=' + signature
        tasks.append({'id': row['id'].replace('-page', ''), 'page': page,
                      'episodeUrl': row['url'], 'url': url, 'level': level,
                      'cellWidth': int(width), 'cellHeight': int(height),
                      'columns': int(columns), 'rows': int(rows),
                      'intervalSeconds': int(interval) / 1000,
                      'firstTimestampSeconds': page * int(columns) * int(rows) * int(interval) / 1000})

def fetch(row):
    path = out / (row['id'] + '-L' + str(row['level']) + '-M' + str(row['page']) + '.jpg')
    try:
        response = urllib.request.urlopen(urllib.request.Request(row['url'], headers={'User-Agent': 'Mozilla/5.0'}), timeout=25)
        data = response.read()
        path.write_bytes(data)
        with Image.open(path) as image:
            image.verify()
        return {**row, 'path': str(path.relative_to(root)), 'status': response.status,
                'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
    except Exception as error:
        return {**row, 'error': str(error)}

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
    results = list(executor.map(fetch, tasks))
(out / 'storyboard-downloads.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
for episode in pages:
    name = episode.replace('-page', '')
    images = [row for row in results if row['id'] == name and row.get('status') == 200]
    sheet = Image.new('RGB', (960, 294 * ((len(images) + 1) // 2)), '#101725')
    draw = ImageDraw.Draw(sheet)
    for index, row in enumerate(images):
        image = Image.open(root / row['path']).convert('RGB')
        image.thumbnail((480, 270))
        x, y = (index % 2) * 480, (index // 2) * 294
        draw.text((x + 8, y + 4), name + ' M' + str(row['page']) + ' / from ' + str(int(row['firstTimestampSeconds'])) + 's', fill='white')
        sheet.paste(image, (x, y + 24))
    sheet.save(out / (name + '-inspection.jpg'), quality=92)
print(json.dumps({'downloaded': sum(row.get('status') == 200 for row in results), 'requested': len(tasks), 'failures': [row for row in results if row.get('error')]}, ensure_ascii=False))
