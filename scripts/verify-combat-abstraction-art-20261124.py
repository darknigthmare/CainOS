#!/usr/bin/env python3
"""Read-only validation of the 142 abstraction/projectile/stage PNG additions."""
from pathlib import Path
import argparse, hashlib, json, sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DOSSIER = ROOT / 'docs/art-generation/abstractions-20261124'
APPEARANCES = ['cellarabstraction', 'aquaticabstraction', 'abstractedjax',
    'abstractedqueenie', 'abstractedqueeniedark', 'abstractedribbit',
    'originalabstractedpomni', 'originalabstractedragatha', 'originalabstractedgangle',
    'originalabstractedkinger', 'originalabstractedzooble']
REUSED = set(APPEARANCES[:6])
SLOTS = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump',
    'crouch', 'victory', 'defeat']
PROJECTILES = ['juggle', 'key', 'button', 'comedy-mask', 'module', 'pellet',
    'confetti', 'bubble', 'candy', 'sugar', 'gloink', 'fudge', 'corruption',
    'spectral-shot', 'trick-box']
STAGES = ['memoryfracture', 'abstractionthreshold']

def sha(data):
    return hashlib.sha256(data).hexdigest()

def objects(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)

def receipt_index():
    paths = list((DOSSIER / 'receipts').glob('*.json'))
    paths += list((DOSSIER / 'originals').rglob('*.json'))
    paths += [DOSSIER / 'projectiles/generation-records.json']
    index = {}
    for receipt in sorted(set(paths)):
        if not receipt.exists() or receipt.name in {'asset-audit.json', 'github-blobs.json'}:
            continue
        data = json.loads(receipt.read_text())
        for rec in objects(data):
            native = next((rec.get(k) for k in
                ['path', 'source', 'nativePath', 'generatedPath', 'outputPath', 'sourcePath']
                if isinstance(rec.get(k), str) and '/generated_images/' in rec[k]
                and rec[k].endswith('.png')), None)
            if not native:
                continue
            identity = rec.get('id')
            slot = rec.get('slot') or rec.get('pose') or rec.get('state') or rec.get('plane')
            dest = rec.get('destination')
            if not isinstance(dest, str):
                if identity in APPEARANCES and slot in SLOTS:
                    dest = f'assets/encore/abstractions/{identity}/{slot}.png'
                elif identity in PROJECTILES:
                    dest = f'assets/encore/projectiles/{identity}.png'
                elif identity in STAGES and slot in ['far', 'mid', 'near']:
                    dest = f'assets/encore/stages/{identity}/{slot}.png'
                else:
                    continue
            index.setdefault(dest, []).append({
                'source': native, 'receipt': str(receipt.relative_to(ROOT)),
                'prompt': rec.get('prompt', ''),
                'recovery': rec.get('recovery') or rec.get('pass') or
                    ('retained native result' if rec.get('survived_executor_loss') else
                     'new rendering after executor loss' if rec.get('regeneration_after_executor_loss') else ''),
            })
    return index

def expected():
    for identity in APPEARANCES:
        for slot in SLOTS:
            yield ('character', identity, slot,
                f'assets/encore/abstractions/{identity}/{slot}.png')
    for identity in PROJECTILES:
        yield ('projectile', identity, 'projectile', f'assets/encore/projectiles/{identity}.png')
    for identity in STAGES:
        for slot in ['far', 'mid', 'near']:
            yield ('stage', identity, slot, f'assets/encore/stages/{identity}/{slot}.png')

def inspect_file(kind, identity, slot, relative, receipts, builds):
    p = ROOT / relative
    data = p.read_bytes()
    assert data[:8] == b'\x89PNG\r\n\x1a\n', 'Not a native PNG'
    digest = sha(data)
    reused = identity in REUSED and slot == 'selection'
    if reused:
        reference = ROOT / 'assets/encore/selection' / f'{identity}.png'
        assert sha(reference.read_bytes()) == digest, 'Published portrait was changed'
        provenance = {'kind': 'reused-published-portrait', 'source': str(reference.relative_to(ROOT))}
    else:
        matching = []
        for rec in receipts.get(relative, []):
            native = Path(rec['source'])
            if native.is_file() and sha(native.read_bytes()) == digest:
                matching.append(rec)
        assert matching, 'No extant native receipt matches runtime PNG bytes'
        provenance = {'kind': 'native-imagegen', **matching[-1]}
    with Image.open(p) as im:
        im.load()
        width, height, mode = im.width, im.height, im.mode
        assert width >= 512 and height >= 512, 'Unexpected low native resolution'
        rgba = im.convert('RGBA')
        alpha = rgba.getchannel('A')
        histogram = alpha.histogram()
        transparent = histogram[0] / (width * height)
        bounds = alpha.point(lambda v: 255 if v > 12 else 0).getbbox()
        assert bounds, 'No visible subject'
        if kind == 'stage' and slot == 'far':
            assert alpha.getextrema() == (255, 255), 'Far plane is not fully opaque'
        else:
            assert mode == 'RGBA' and transparent > .10, 'Missing usable native transparency'
            if kind != 'stage' and not reused:
                left, top, right, bottom = bounds
                assert min(left, top, width - right, height - bottom) > 0, 'Visible subject touches image edge'
        for directory in builds:
            built = directory / relative
            assert built.is_file() and sha(built.read_bytes()) == digest, f'Build bytes differ: {built}'
        return {'file': relative, 'kind': kind, 'id': identity, 'slot': slot,
            'bytes': len(data), 'sha256': digest,
            'gitBlobSha1': hashlib.sha1(f'blob {len(data)}\0'.encode() + data).hexdigest(),
            'width': width, 'height': height, 'mode': mode,
            'transparentFraction': transparent, 'visibleBoundsAlpha12': list(bounds),
            'nativeBytesVerified': True, 'provenance': provenance}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build', type=Path, action='append', default=[])
    parser.add_argument('--output', type=Path, default=DOSSIER / 'asset-inventory.json')
    args = parser.parse_args()
    receipts, assets, failures = receipt_index(), [], []
    for kind, identity, slot, relative in expected():
        try:
            assets.append(inspect_file(kind, identity, slot, relative, receipts, args.build))
        except (AssertionError, OSError, ValueError) as exc:
            failures.append({'file': relative, 'error': str(exc)})
    hashes = {}
    for asset in assets:
        hashes.setdefault(asset['sha256'], []).append(asset['file'])
    duplicates = [paths for paths in hashes.values() if len(paths) > 1]
    if duplicates:
        failures.append({'error': 'Duplicate PNG bytes among distinct additions', 'groups': duplicates})
    report = {'date': '2026-11-24', 'complete': not failures and len(assets) == 142,
        'counts': {'expected': 142, 'verified': len(assets), 'characters': 121,
            'projectiles': 15, 'stagePlanes': 6, 'newNativeAdditions': 136, 'reusedPortraits': 6},
        'totalBytes': sum(a['bytes'] for a in assets), 'buildsChecked': [str(p) for p in args.build],
        'limits': ['Technical native-PNG and byte checks do not certify canonical 1:1 fidelity.',
            'One drawing per state is not a complete frame-by-frame animation cycle.'],
        'assets': assets, 'failures': failures}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'complete': report['complete'], 'verified': len(assets),
        'bytes': report['totalBytes'], 'failures': len(failures), 'report': str(args.output)}))
    if failures:
        print(json.dumps(failures[:8], ensure_ascii=False, indent=2))
    return 0 if report['complete'] else 1

if __name__ == '__main__':
    sys.exit(main())

