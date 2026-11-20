#!/usr/bin/env python3
"""Validate both reviewed Ribbit families, then install their unaltered PNGs."""
import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/cast-ribbit-20261120'
IDS = ['animeribbit', 'jaxsuitribbit']
SLOTS = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']
read = lambda p: json.loads(p.read_text())
sha = lambda b: hashlib.sha256(b).hexdigest()
def write(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')

definitions, appearances, inventory = [], [], []
signatures = set()
for ident in IDS:
    definition = read(WAVE / 'definitions' / (ident + '.json'))
    assert definition['id'] == ident and definition['fighterId'] == 'ribbit'
    definitions.append(definition)
    rows = []
    for slot in SLOTS:
        source = WAVE / 'generated' / ident / (slot + '.png')
        receipt_path = source.with_suffix('.json')
        receipt = read(receipt_path)
        assert receipt['appearanceId'] == ident and receipt['slot'] == slot
        assert receipt['status'] == 'accepted_native'
        assert receipt['method'] == 'image_gen.imagegen'
        assert receipt['visualReview']['status'] == 'accepted'
        assert receipt['nativeFacing'] == 'right'
        data = source.read_bytes()
        digest = sha(data)
        assert digest == receipt['sha256'] and len(data) == receipt['bytes']
        assert digest not in signatures, 'Each slot must be an independent native drawing.'
        signatures.add(digest)
        with Image.open(source) as im:
            im.load()
            assert im.mode == 'RGBA' and min(im.size) >= 768
            alpha = im.getchannel('A')
            bounds = alpha.point(lambda v: 255 if v > 12 else 0).getbbox()
            assert alpha.getextrema()[0] == 0 and alpha.getextrema()[1] > 128
            assert bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < im.width and bounds[3] < im.height
            dimensions, extrema = list(im.size), list(alpha.getextrema())
        refs = receipt['portableReferences']
        assert refs
        for ref in refs:
            b = (ROOT / ref['file']).read_bytes()
            assert sha(b) == ref['sha256'] and len(b) == ref['bytes'], ref['file']
        target = (f'assets/encore/{slot}/{ident}.png' if slot in ['selection', 'stance'] else f'assets/encore/poses/{ident}/{slot}.png')
        assert receipt['targetFile'] == target
        row = {'appearanceId': ident, 'slot': slot, 'file': target,
               'archiveFile': str(source.relative_to(ROOT)),
               'receiptFile': str(receipt_path.relative_to(ROOT)),
               'sha256': digest, 'bytes': len(data), 'dimensions': dimensions,
               'mode': 'RGBA', 'alphaExtrema': extrema, 'alpha12Bounds': list(bounds),
               'nativeFacing': 'right', 'references': refs}
        rows.append(row)
        inventory.append(row)
    appearances.append({'id': ident, 'name': definition['name'], 'fighterId': 'ribbit', 'files': rows})

assert len(inventory) == 22 and len(signatures) == 22
# No runtime file is touched until every slot, receipt and reference has passed.
for row in inventory:
    source, target = ROOT / row['archiveFile'], ROOT / row['file']
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        assert target.read_bytes() == source.read_bytes(), 'Refuse to overwrite different artwork: ' + row['file']
    else:
        shutil.copyfile(source, target)
    assert sha(target.read_bytes()) == row['sha256']

(ROOT / 'combat/costume-ribbit-20261120.mjs').write_text(
    '/** Two official merchandise costumes, with original static poses for Encore. */\n'
    + 'export const COSTUME_RIBBIT_DEFINITIONS = ' + json.dumps(definitions, ensure_ascii=False, indent=2) + ';\n')
completion = {'schema': 'encore-ribbit-completion/v1', 'status': 'complete_active',
    'createdAt': datetime.now(timezone.utc).isoformat(),
    'baseCommit': 'f7b3b9a', 'baseTree': 'a2d454210d0659d8f93c144112fe9d3cb6193ad0',
    'publishedParent': 'a5341b8cf1ceecc22ccca13ba6b20a9f710bddb0',
    'order': IDS, 'slots': SLOTS, 'appearances': appearances,
    'counts': {'completeAppearances': 2, 'nativePngs': 22, 'newNativePngs': 22,
               'bytes': sum(row['bytes'] for row in inventory)},
    'limitations': ['Official merchandise appearance references do not certify an episode appearance.',
                    'Eleven separate static drawings per appearance are not full animation cycles.',
                    'Maid Ribbit remains unproduced because the examined references conceal the feet.']}
write(WAVE / 'generation-completion.json', completion)
write(WAVE / 'asset-inventory.json', inventory)
write(WAVE / 'native-facing.json', {ident: {slot: 'right' for slot in SLOTS} for ident in IDS})
print(json.dumps(completion['counts']))
