#!/usr/bin/env python3
"""Archive one native, individually reviewed NPC crossover image unchanged."""
import argparse
import hashlib
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/continuation-20261120-b/metarunner'
parser = argparse.ArgumentParser()
parser.add_argument('--job', required=True)
parser.add_argument('--source', required=True)
parser.add_argument('--accept', action='store_true')
parser.add_argument('--observation', action='append', default=[])
args = parser.parse_args()
job = json.loads((ROOT / args.job).read_text())
ident, slot = job['appearanceId'], job['slot']
assert re.fullmatch(r'glitch-[a-z0-9]+-[a-z0-9]+-(hommage|resident|fusion)', ident)
definition_path = WAVE / 'definitions' / (ident + '.json')
definition = json.loads(definition_path.read_text())
assert definition['id'] == ident and definition['fighterId'] == job['fighterId']
assert hashlib.sha256(definition_path.read_bytes()).hexdigest() == job['definitionSHA256']
assert definition['series'] == job['series'] and definition['style'] == job['style']
assert slot in definition['requiredSlots']
assert job['nativeFacing'] == 'right'
assert definition['canonicalCostumeClaim'] is False
assert not args.accept or args.observation, 'Acceptance requires an actual visual observation.'
sha = lambda b: hashlib.sha256(b).hexdigest()
source = Path(args.source)
data = source.read_bytes()
target = WAVE / definition['style'] / 'generated' / (slot + '.png')
target.parent.mkdir(parents=True, exist_ok=True)
if target.exists():
    assert target.read_bytes() == data, 'Different existing drawing: archive rejected attempts separately.'
else:
    shutil.copyfile(source, target)
assert target.read_bytes() == data
with Image.open(source) as im:
    im.load()
    assert im.mode == 'RGBA' and min(im.size) >= 768
    alpha = im.getchannel('A')
    extrema = alpha.getextrema()
    bounds = alpha.point(lambda v: 255 if v > 12 else 0).getbbox()
    assert extrema[0] == 0 and extrema[1] > 128
    assert bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < im.width and bounds[3] < im.height
    dimensions, zero = list(im.size), alpha.histogram()[0]
refs = []
for pos, rel in enumerate(job['referencePaths'], 1):
    path = (ROOT / rel).resolve()
    assert path.is_relative_to(ROOT), 'Reference must be portable within this repository.'
    b = path.read_bytes()
    refs.append({'position': pos, 'file': rel, 'sha256': sha(b), 'bytes': len(b)})
assert refs
receipt = {**job, 'schema': 'encore-native-npc-crossover/v1', 'id': ident + ':' + slot,
    'status': 'accepted_native' if args.accept else 'generated_pending_visual_review',
    'method': 'image_gen.imagegen', 'transparent_background': True,
    'file': str(target.relative_to(ROOT)),
    'targetFile': definition['spriteDirectory'] + '/' + slot + '.png',
    'nativeSourceFile': str(source), 'sourceGenerationId': source.stem,
    'definitionFile': str(definition_path.relative_to(ROOT)), 'definitionSHA256': sha(definition_path.read_bytes()),
    'portableReferences': refs, 'dimensions': dimensions, 'mode': 'RGBA',
    'alphaExtrema': list(extrema), 'alpha12Bounds': list(bounds),
    'alpha12BoundsThreshold': 'alpha > 12', 'fullyTransparentPixels': zero,
    'sha256': sha(data), 'bytes': len(data), 'nativeCopyVerified': True,
    'sourceKind': definition['sourceKind'], 'episodeFidelityClaim': False,
    'canonicalCostumeClaim': False, 'includedInRuntime': False,
    'createdAt': datetime.now(timezone.utc).isoformat(),
    'visualReview': {'status': 'accepted' if args.accept else 'pending',
        'reviewer': job.get('reviewer', 'root'),
        'observations': args.observation if args.accept else [],
        'scope': 'Original crossover identity, entire figure, costume continuity and readable game pose; no canonical costume or complete animation claim.'}}
target.with_suffix('.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'id':receipt['id'],'status':receipt['status'],'file':receipt['file'],
    'sha256':receipt['sha256'],'dimensions':dimensions,'alpha12Bounds':list(bounds)}, ensure_ascii=False))
