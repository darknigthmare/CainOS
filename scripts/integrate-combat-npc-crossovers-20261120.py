#!/usr/bin/env python3
"""Activate only the complete, reviewed Ribbit × Murder Drones native families.

No image is transformed. Every receipt, reference, destination and historical
wardrobe entry is checked before any runtime file is written.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/npc-crossovers-next-wave-20261120'
STYLES = ['hommage', 'resident', 'fusion']
SLOTS = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']
BASELINE_SHA = '1bea46363a8b121b71db75eb2da67f21b7db55254bc85eda5d242bb15e23acbf'
MODULE = ROOT / 'combat/crossover-npc-additions.mjs'
sha = lambda b: hashlib.sha256(b).hexdigest()
read = lambda p: json.loads(p.read_text())


def require(value, message):
    if not value:
        raise ValueError(message)


def write(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


def portable(name):
    path = (ROOT / name).resolve()
    require(path.is_relative_to(ROOT), 'Nonportable input: ' + name)
    return path


def catalogue():
    code = """
import {COSTUMES,CROSSOVER_COSTUMES} from './combat/data.mjs';
import {createHash} from 'node:crypto';
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
console.log(JSON.stringify({costumeIds:COSTUMES.map(x=>x.id),
prefixSHA256:sha(COSTUMES.slice(0,468)),
costumeHashes:Object.fromEntries(COSTUMES.map(x=>[x.id,sha(x)])),
crossoverIds:CROSSOVER_COSTUMES.map(x=>x.id)}));
"""
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def verify_prefix(current, baseline):
    require(current['costumeIds'][:468] == baseline['costumeIds'], 'Historical wardrobe order changed')
    require(current['prefixSHA256'] == baseline['costumesSHA256'], 'Historical wardrobe definitions changed')
    require(current['crossoverIds'][:378] == baseline['crossoverIds'], 'Historical crossover order changed')
    for ident, digest in baseline['costumeHashes'].items():
        require(current['costumeHashes'].get(ident) == digest, 'Historical costume changed: ' + ident)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    missing = []
    for style in STYLES:
        for slot in SLOTS:
            path = WAVE / style / 'generated' / (slot + '.png')
            if not path.exists() or not path.with_suffix('.json').exists():
                missing.append(style + '/' + slot)
            elif read(path.with_suffix('.json')).get('status') != 'accepted_native':
                missing.append(style + '/' + slot + ': not accepted')
    if missing:
        print(json.dumps({'status': 'waiting_for_complete_families', 'accepted': 33-len(missing),
                          'required': 33, 'missing': missing, 'runtimeTouched': False}))
        return 2

    baseline_path = WAVE / 'integration-baseline.json'
    require(sha(baseline_path.read_bytes()) == BASELINE_SHA, 'Independent baseline changed')
    baseline = read(baseline_path)
    require(baseline['baseCommit'] == '570fdb31512cdd2a2d5ba5e2c26d7c10b47ae063', 'Wrong historical base')
    verify_prefix(catalogue(), baseline)
    for filename in ['combat/crossover-designs.mjs', 'combat/crossover-fusions.mjs', 'combat/illustrations.mjs']:
        require(sha((ROOT / filename).read_bytes()) == baseline['sourceHashes'][filename], 'Unrelated historical module changed: ' + filename)

    entries, appearances, inventory, verified, signatures, generations = [], [], [], {}, set(), set()
    for style in STYLES:
        ident = 'glitch-murderdrones-ribbit-' + style
        definition_path = WAVE / 'definitions' / (ident + '.json')
        definition = read(definition_path)
        require(definition['id'] == ident and definition['fighterId'] == 'ribbit', 'Wrong owner')
        require(definition['series'] == 'murderdrones' and definition['style'] == style, 'Wrong crossover')
        require(definition['canonicalCostumeClaim'] is False and definition['episodeFidelityClaim'] is False, 'Original design must be labeled')
        require(definition['requiredSlots'] == SLOTS, 'Required native slots changed')
        verified[definition_path] = sha(definition_path.read_bytes())
        entries.append({key: definition[key] for key in ['id','fighterId','series','style','name','introducedOn','sourceKind']})
        entries[-1]['format'] = 'png'
        rows = []
        for slot in SLOTS:
            source = WAVE / style / 'generated' / (slot + '.png')
            receipt_path = source.with_suffix('.json')
            receipt = read(receipt_path)
            require(receipt['appearanceId'] == ident and receipt['slot'] == slot, 'Wrong receipt identity')
            require(receipt['fighterId'] == 'ribbit' and receipt['style'] == style, 'Wrong receipt owner/style')
            require(receipt['status'] == 'accepted_native' and receipt['visualReview']['status'] == 'accepted', 'Visual review required')
            require(receipt['visualReview']['observations'], 'Actual visual observation required')
            require(receipt['method'] == 'image_gen.imagegen' and receipt['nativeCopyVerified'] is True, 'Native generation required')
            require(receipt['nativeFacing'] == 'right', 'Reviewed facing must match runtime')
            require(receipt['definitionSHA256'] == verified[definition_path], 'Definition changed after generation')
            data = source.read_bytes()
            digest = sha(data)
            require(digest == receipt['sha256'] and len(data) == receipt['bytes'], 'Native bytes changed: ' + slot)
            require(digest not in signatures and receipt['sourceGenerationId'] not in generations, 'Every slot must be a distinct drawing')
            signatures.add(digest)
            generations.add(receipt['sourceGenerationId'])
            native = Path(receipt['nativeSourceFile'])
            if native.exists():
                require(native.read_bytes() == data, 'Archive differs from native output')
            with Image.open(source) as im:
                im.load()
                require(im.mode == 'RGBA' and min(im.size) >= 768, 'Expected native RGBA image')
                alpha = im.getchannel('A')
                bounds = alpha.point(lambda v: 255 if v > 12 else 0).getbbox()
                require(alpha.getextrema()[0] == 0 and alpha.getextrema()[1] > 128, 'Real transparency required')
                require(bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < im.width and bounds[3] < im.height, 'Drawing touches edge')
                require(list(im.size) == receipt['dimensions'] and list(bounds) == receipt['alpha12Bounds'], 'Image measurements changed')
                dimensions, extrema = list(im.size), list(alpha.getextrema())
            for ref in receipt['portableReferences']:
                path = portable(ref['file'])
                b = path.read_bytes()
                require(sha(b) == ref['sha256'] and len(b) == ref['bytes'], 'Input reference changed: ' + ref['file'])
                verified[path] = sha(b)
            require(receipt['portableReferences'], 'Input references required')
            target = definition['spriteDirectory'] + '/' + slot + '.png'
            require(receipt['targetFile'] == target, 'Wrong native destination')
            destination = portable(target)
            require(not destination.exists() or destination.read_bytes() == data, 'Refuse to overwrite different artwork: ' + target)
            verified[source] = digest
            verified[receipt_path] = sha(receipt_path.read_bytes())
            rows.append({'appearanceId': ident, 'slot': slot, 'file': target,
                'archiveFile': str(source.relative_to(ROOT)), 'receiptFile': str(receipt_path.relative_to(ROOT)),
                'sha256': digest, 'bytes': len(data), 'dimensions': dimensions, 'mode': 'RGBA',
                'alphaExtrema': extrema, 'alpha12Bounds': list(bounds), 'nativeFacing': 'right',
                'sourceGenerationId': receipt['sourceGenerationId'], 'references': receipt['portableReferences']})
        appearances.append({'id': ident, 'name': definition['name'], 'fighterId': 'ribbit', 'series': 'murderdrones', 'style': style, 'files': rows})
        inventory.extend(rows)
    if args.check_only:
        print(json.dumps({'status': 'ready', 'nativeImages': len(inventory), 'bytes': sum(x['bytes'] for x in inventory), 'runtimeTouched': False}))
        return 0

    # All checks finish before the first copy; recheck inputs before activation.
    for path, digest in verified.items():
        require(sha(path.read_bytes()) == digest, 'Input changed during preflight: ' + str(path))
    for row in inventory:
        destination = ROOT / row['file']
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / row['archiveFile'], destination)
        require(sha(destination.read_bytes()) == row['sha256'], 'Native copy failed')
    module = '// Reviewed original NPC crossover designs. Generated by the dated installer.\n'
    module += '// Only complete native families are exposed by the wardrobe.\n'
    module += 'export const NPC_CROSSOVER_DEFINITIONS = Object.freeze(' + json.dumps(entries, ensure_ascii=False, indent=2) + '.map(entry => Object.freeze(entry)));\n'
    MODULE.write_text(module)
    current = catalogue()
    verify_prefix(current, baseline)
    ids = [entry['id'] for entry in entries]
    require(current['crossoverIds'][378:] == ids, 'Unexpected new crossover order')
    require(current['costumeIds'][-3:] == ids, 'New crossovers must be appended')
    for row in inventory:
        path = ROOT / row['receiptFile']
        receipt = read(path)
        receipt['includedInRuntime'] = True
        write(path, receipt)
    completion = {'schema': 'encore-npc-crossover-completion/v1', 'status': 'integrated_native',
        'createdAt': datetime.now(timezone.utc).isoformat(), 'baselineSHA256': BASELINE_SHA,
        'order': ids, 'slots': SLOTS, 'appearances': appearances,
        'counts': {'families': 3, 'nativePNG': 33, 'bytes': sum(row['bytes'] for row in inventory)},
        'historicalWardrobePrefixPreserved': 468, 'historicalCrossoversPreserved': 378,
        'canonicalCostumeClaim': False, 'completeAnimationClaim': False}
    write(WAVE / 'generation-completion.json', completion)
    write(WAVE / 'asset-inventory.json', {'assets': inventory})
    print(json.dumps({'status': 'integrated_native', **completion['counts'], 'costumes': len(current['costumeIds'])}))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
