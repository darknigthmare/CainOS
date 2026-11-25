"""Verify the 72 release PNGs against their actual local generation outputs.

This provenance check is for the authoring checkout: nativeSource paths are
recorded tool receipts, not dependencies of the packaged game.
"""
from pathlib import Path
import datetime
import hashlib
import json
import re
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
A = Path('docs/art-generation/base-sprites-20261125')
B = Path('docs/art-generation/base-sprites-20261125-b')

def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()

paths = set()
for folder in (ROOT / A, ROOT / B):
    for file in folder.rglob('*.json'):
        paths.update(re.findall(r'/workspace/scratch/[A-Za-z0-9_./-]+/generated_images/[A-Za-z0-9_.-]+\.png', file.read_text()))
native = {}
for source in sorted(paths):
    file = Path(source)
    if file.is_file():
        native.setdefault(digest(file), source)

assets = json.loads((ROOT / A / 'asset-inventory.json').read_text())['assets']
assets.extend(json.loads((ROOT / B / 'projectiles-manifest.json').read_text())['assets'])
for sub in ('completion-lackadaisy-ultra', 'completion-gaslight-knights', 'completion-gameoverse-smg4'):
    review_path = (B / sub / 'reviews.json').as_posix()
    for review in json.loads((ROOT / review_path).read_text())['appearances']:
        for slot, file in review['reviewedFiles'].items():
            assets.append({'id': review['id'], 'slot': slot, 'file': file,
                           'sha256': review['sha256'][slot], 'reviewPath': review_path})
assert len(assets) == 72 and len({a['file'] for a in assets}) == 72
for asset in assets:
    file = ROOT / asset['file']
    data = file.read_bytes()
    sha = hashlib.sha256(data).hexdigest()
    assert sha == asset['sha256'], asset['file']
    assert sha in native, 'Native output missing: ' + asset['file']
    original = Path(native[sha])
    assert data == original.read_bytes(), asset['file']
    with Image.open(file) as image:
        assert image.mode == 'RGBA'
        alpha = image.getchannel('A')
        bounds = alpha.point(lambda value: 255 if value >= 12 else 0).getbbox()
        extrema = alpha.getextrema()
        assert extrema[0] == 0 and extrema[1] >= 224
        asset.update({'bytes': len(data), 'width': image.width, 'height': image.height,
                      'mode': image.mode, 'alphaExtrema': list(extrema),
                      'visibleAlphaBounds': list(bounds),
                      'transparentFraction': alpha.histogram()[0] / (image.width * image.height)})
    recovered = Path('/workspace/scratch/0259e839f9d6/CainOS') / asset['file']
    origin = 'recovered' if recovered.is_file() and digest(recovered) == sha else 'generated-this-session'
    asset.update({'nativeSource': str(original), 'nativeBytesVerified': True,
                  'nativeVerificationPerformedThisSession': True, 'origin': origin,
                  'gitBlobSHA': hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()})
assert len({a['sha256'] for a in assets}) == 72
counts = {state: sum(a['origin'] == state for a in assets)
          for state in ('recovered', 'generated-this-session')}
assert counts == {'recovered': 43, 'generated-this-session': 29}, counts
report = {
    'schema': 'encore-static-base-assets/v2',
    'createdAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'baselineCommit': '616a585274506f20c54386d8be07a76e75e1f198',
    'complete': True, 'families': 32, 'characterImages': 64, 'projectileImages': 8,
    'animations': 0,
    'scope': 'Lot A recovered and lot B completed: 72 distinct individual native PNGs; no extra action drawings.',
    'assets': assets,
    'summary': {'files': 72, 'bytes': sum(a['bytes'] for a in assets),
                'nativeCopiesIdentical': 72, 'actualSourceFilesAvailableAndCompared': 72,
                'rgbaFiles': 72, **counts},
}
(ROOT / B / 'asset-inventory.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report['summary']))
