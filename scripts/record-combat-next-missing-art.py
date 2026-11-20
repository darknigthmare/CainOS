#!/usr/bin/env python3
"""Archive a native image result and inspect it without altering image bytes."""
import argparse
import hashlib
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/cast-next-missing-20261120'
parser = argparse.ArgumentParser()
parser.add_argument('--job', required=True)
parser.add_argument('--source', required=True)
parser.add_argument('--accept', action='store_true')
parser.add_argument('--observation', action='append', default=[])
args = parser.parse_args()
job = json.loads((ROOT / args.job).read_text())
source = Path(args.source)
data = source.read_bytes()
sha = lambda b: hashlib.sha256(b).hexdigest()
ident, slot = job['appearanceId'], job['slot']
assert re.fullmatch(r'[a-z][a-z0-9]+', ident)
definition = json.loads((WAVE / 'definitions' / (ident + '.json')).read_text())
assert definition['id'] == ident and definition.get('fighterId')
assert slot in ('selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat')
target = WAVE / 'generated' / ident / (slot + '.png')
target.parent.mkdir(parents=True, exist_ok=True)
if target.exists():
    assert target.read_bytes() == data, 'Archive already contains different bytes; use attempts first.'
else:
    shutil.copyfile(source, target)
assert target.read_bytes() == data
with Image.open(source) as im:
    im.load()
    assert im.mode == 'RGBA' and min(im.size) >= 768
    alpha = im.getchannel('A')
    extrema = alpha.getextrema()
    bounds = alpha.point(lambda value: 255 if value > 12 else 0).getbbox()
    assert extrema[0] == 0 and extrema[1] > 128
    assert bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < im.width and bounds[3] < im.height
    dimensions = list(im.size)
    zero = alpha.histogram()[0]
refs = []
for pos, rel in enumerate(job['referencePaths'], 1):
    b = (ROOT / rel).read_bytes()
    refs.append({'position': pos, 'file': rel, 'sha256': sha(b), 'bytes': len(b)})
assert refs
receipt = {**job,
    'schema': 'encore-native-next-missing-art/v1',
    'id': ident + ':' + slot,
    'status': 'accepted_native' if args.accept else 'generated_pending_visual_review',
    'method': 'image_gen.imagegen',
    'transparent_background': True,
    'file': str(target.relative_to(ROOT)),
    'targetFile': ('assets/encore/' + slot + '/' + ident + '.png' if slot in ('selection', 'stance') else 'assets/encore/poses/' + ident + '/' + slot + '.png'),
    'nativeSourceFile': str(source),
    'sourceGenerationId': source.stem,
    'portableReferences': refs,
    'dimensions': dimensions, 'mode': 'RGBA', 'alphaExtrema': list(extrema),
    'alpha12Bounds': list(bounds), 'alpha12BoundsThreshold': 'alpha > 12',
    'fullyTransparentPixels': zero,
    'sha256': sha(data), 'bytes': len(data), 'nativeCopyVerified': True,
    'nativeFacing': job.get('nativeFacing', 'right'),
    'sourceKind': definition.get('sourceKind', 'Produit dérivé officiel'), 'episodeFidelityClaim': False,
    'includedInRuntime': False,
    'createdAt': datetime.now(timezone.utc).isoformat(),
    'visualReview': {'status': 'accepted' if args.accept else 'pending',
                     'reviewer': job.get('reviewer', 'root'),
                     'observations': (args.observation or job.get('observations', [])) if args.accept else [],
                     'scope': 'Official costume comparison and original game pose; no episode or complete animation certification.'}}
target.with_suffix('.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'id':receipt['id'],'status':receipt['status'],'file':receipt['file'],'sha256':receipt['sha256'],'dimensions':dimensions,'alpha12Bounds':list(bounds)}, ensure_ascii=False))
