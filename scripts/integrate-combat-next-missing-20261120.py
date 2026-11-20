#!/usr/bin/env python3
"""Install four complete reviewed families; preserve all historical outfit data.

--check-only reports readiness without touching runtime files or manifests.
The default install refuses partial generations and preflights every destination
before copying any native image. It never rebuilds the offline pack or workbook.
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
WAVE = ROOT / 'docs/art-generation/cast-next-missing-20261120'
IDS = ['watermelongangle', 'aquablasterpomni', 'ptocaine', 'freakjax']
OWNERS = dict(zip(IDS, ['gangle', 'pomni', 'caine', 'jax']))
SLOTS = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']
BASE_COMMIT = '3858f03bba652fa56bdf422b5566dea86dbdcb9b'
BASE_TREE = '4c188436954490cf09e8d2c0345f4511ce22ccea'
PUBLISHED_PARENT = '3bd83cdf2e63e93275c8478795d5e2af32313f41'
BASELINE_SHA256 = '88da0348cde24375ded30c72ea3a1636896fc77097ad6bcb78550d2c7481d379'
MODULE = ROOT / 'combat/costume-next-missing-20261120.mjs'
ENTRY = ROOT / 'combat/costume-additions.mjs'
IMPORT = "import { COSTUME_NEXT_MISSING_DEFINITIONS } from './costume-next-missing-20261120.mjs';\n"
SPREAD = '  ...COSTUME_NEXT_MISSING_DEFINITIONS,\n'
sha = lambda data: hashlib.sha256(data).hexdigest()
read = lambda path: json.loads(path.read_text())


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def require(condition, message):
    if not condition:
        raise ValueError(message)


def within_repo(value):
    path = (ROOT / value).resolve()
    require(path.is_relative_to(ROOT), 'Reference must remain portable in the repository: ' + value)
    return path


def runtime_catalog():
    code = """
import {COSTUME_ADDITIONS,COSTUMES} from './combat/data.mjs';
import {createHash} from 'node:crypto';
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
console.log(JSON.stringify({appearanceIds:COSTUME_ADDITIONS.map(v=>v.id),
appearanceHashes:Object.fromEntries(COSTUME_ADDITIONS.map(v=>[v.id,sha(v)])),
costumeIds:COSTUMES.map(v=>v.id),costumesPrefixSHA256:sha(COSTUMES.slice(0,464))}));
"""
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def verify_prefix(current, baseline, expected_count):
    require(current['appearanceIds'][:35] == baseline['appearanceIds'], 'Historical appearance order changed')
    require(len(current['appearanceIds']) == expected_count, 'Unexpected active appearance count')
    require(current['costumeIds'][:464] == baseline['costumeIds'], 'Historical costume order changed')
    require(current['costumesPrefixSHA256'] == baseline['costumesSHA256'], 'Historical costume definitions changed')
    for ident, digest in baseline['appearanceHashes'].items():
        require(current['appearanceHashes'].get(ident) == digest, 'Historical appearance changed: ' + ident)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    missing, ready = [], []
    for ident in IDS:
        for slot in SLOTS:
            source = WAVE / 'generated' / ident / (slot + '.png')
            receipt_path = source.with_suffix('.json')
            if not source.exists() or not receipt_path.exists():
                missing.append({'appearanceId': ident, 'slot': slot, 'reason': 'missing PNG or receipt'})
                continue
            receipt = read(receipt_path)
            if receipt.get('status') != 'accepted_native' or receipt.get('visualReview', {}).get('status') != 'accepted':
                missing.append({'appearanceId': ident, 'slot': slot, 'reason': 'visual review not accepted'})
            else:
                ready.append(ident + '/' + slot)
    if missing:
        print(json.dumps({'status': 'waiting_for_complete_wave', 'accepted': len(ready), 'required': 44,
                          'missing': missing, 'runtimeTouched': False}, ensure_ascii=False))
        return 2

    baseline_path = WAVE / 'integration-baseline.json'
    require(sha(baseline_path.read_bytes()) == BASELINE_SHA256, 'Pre-addition baseline was changed')
    baseline = read(baseline_path)
    require(baseline['baseCommit'] == BASE_COMMIT and baseline['baseTree'] == BASE_TREE, 'Wrong baseline')
    require(baseline['appearanceCount'] == 35 and baseline['costumeCount'] == 464, 'Wrong prefix size')
    entry_before = ENTRY.read_text()
    already_active = IMPORT in entry_before
    require((SPREAD in entry_before) == already_active, 'Partial runtime import/spread')
    current = runtime_catalog()
    verify_prefix(current, baseline, 39 if already_active else 35)
    if already_active:
        require(current['appearanceIds'][35:] == IDS, 'Unexpected active continuation order')
    else:
        require(not any(ident in current['costumeIds'] for ident in IDS), 'New ID collides with an existing costume')
    # Only our explicit append is allowed in the historical aggregator. All
    # prior definition modules must still match their independently saved bytes.
    original_entry = entry_before.replace(IMPORT, '').replace(SPREAD, '')
    require(sha(original_entry.encode()) == baseline['sourceHashes']['combat/costume-additions.mjs'], 'Historical aggregator edited beyond the append')
    for file, digest in baseline['sourceHashes'].items():
        if file != 'combat/costume-additions.mjs':
            require(sha((ROOT / file).read_bytes()) == digest, 'Previous definition module changed: ' + file)

    definitions, appearances, inventory = [], [], []
    signatures, generation_ids, verified_inputs = set(), set(), {}
    for ident in IDS:
        definition_path = WAVE / 'definitions' / (ident + '.json')
        definition = read(definition_path)
        require(definition['id'] == ident and definition['fighterId'] == OWNERS[ident], 'Appearance ownership mismatch: ' + ident)
        require(definition['introducedOn'] == '2026-11-20', 'Unexpected introduction date')
        definitions.append(definition)
        verified_inputs[definition_path] = sha(definition_path.read_bytes())
        rows = []
        for slot in SLOTS:
            source = WAVE / 'generated' / ident / (slot + '.png')
            receipt_path = source.with_suffix('.json')
            receipt = read(receipt_path)
            require(receipt['appearanceId'] == ident and receipt['slot'] == slot, 'Receipt identity mismatch')
            # The shared recorder permits older jobs without fighterId; their
            # reviewed definition is the owner authority. An explicit mismatch
            # in a richer receipt must still be rejected.
            require(receipt.get('fighterId', definition['fighterId']) == OWNERS[ident], 'Receipt owner mismatch')
            require(receipt['status'] == 'accepted_native' and receipt['visualReview']['status'] == 'accepted', 'Unaccepted receipt')
            require(receipt['method'] == 'image_gen.imagegen' and receipt['nativeCopyVerified'] is True, 'Native generation evidence required')
            require(receipt['nativeFacing'] == 'right', 'Default runtime direction requires reviewed right-facing art')
            data = source.read_bytes()
            digest = sha(data)
            require(digest == receipt['sha256'] and len(data) == receipt['bytes'], 'Native bytes differ from receipt')
            require(digest not in signatures, 'Every slot must be an independent drawing')
            signatures.add(digest)
            generation_id = receipt.get('sourceGenerationId')
            require(isinstance(generation_id, str) and generation_id and generation_id not in generation_ids, 'Separate generation receipt required for each slot')
            generation_ids.add(generation_id)
            with Image.open(source) as image:
                image.load()
                require(image.mode == 'RGBA' and min(image.size) >= 768, 'Expected complete native RGBA drawing')
                alpha = image.getchannel('A')
                bounds = alpha.point(lambda value: 255 if value > 12 else 0).getbbox()
                require(alpha.getextrema()[0] == 0 and alpha.getextrema()[1] > 128, 'Expected native transparent pixels')
                require(bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < image.width and bounds[3] < image.height, 'Drawing touches frame edge')
                dimensions, extrema = list(image.size), list(alpha.getextrema())
            require(dimensions == receipt['dimensions'] and list(bounds) == receipt['alpha12Bounds'], 'Receipt image measurements changed')
            refs = receipt['portableReferences']
            require(bool(refs), 'Portable input references required')
            for ref in refs:
                path = within_repo(ref['file'])
                content = path.read_bytes()
                require(sha(content) == ref['sha256'] and len(content) == ref['bytes'], 'Reference changed: ' + ref['file'])
                verified_inputs[path] = sha(content)
            target = (f'assets/encore/{slot}/{ident}.png' if slot in ['selection', 'stance'] else f'assets/encore/poses/{ident}/{slot}.png')
            require(receipt['targetFile'] == target, 'Wrong installation target')
            require(receipt['file'] == str(source.relative_to(ROOT)), 'Wrong portable source path')
            destination = ROOT / target
            require(not destination.exists() or destination.read_bytes() == data, 'Refuse to overwrite different artwork: ' + target)
            verified_inputs[source] = digest
            verified_inputs[receipt_path] = sha(receipt_path.read_bytes())
            row = {'appearanceId': ident, 'slot': slot, 'file': target,
                   'archiveFile': str(source.relative_to(ROOT)), 'receiptFile': str(receipt_path.relative_to(ROOT)),
                   'sha256': digest, 'bytes': len(data), 'dimensions': dimensions, 'mode': 'RGBA',
                   'alphaExtrema': extrema, 'alpha12Bounds': list(bounds), 'nativeFacing': 'right',
                   'sourceGenerationId': generation_id, 'references': refs}
            rows.append(row)
            inventory.append(row)
        appearances.append({'id': ident, 'name': definition['name'], 'fighterId': OWNERS[ident], 'files': rows})
    require(len(inventory) == len(signatures) == len(generation_ids) == 44, 'Whole wave must contain 44 independent accepted PNGs')
    module_text = '/** Four official merchandise appearances; original static poses preserve the existing kits. */\n'
    module_text += 'export const COSTUME_NEXT_MISSING_DEFINITIONS = ' + json.dumps(definitions, ensure_ascii=False, indent=2) + ';\n'
    if MODULE.exists():
        require(MODULE.read_text() == module_text, 'Refuse to replace different continuation definitions')
    if args.check_only:
        print(json.dumps({'status': 'ready', 'accepted': 44, 'order': IDS, 'nativeBytes': sum(row['bytes'] for row in inventory),
                          'runtimeTouched': False, 'historicalAppearancesPreserved': 35}, ensure_ascii=False))
        return 0
    # Recheck every verified source before any mutation. Sources may still be
    # reviewed by another collaborator; installation must use the same snapshot.
    for file, digest in verified_inputs.items():
        require(sha(file.read_bytes()) == digest, 'Source changed during preflight: ' + str(file))
    require(ENTRY.read_text() == entry_before, 'Aggregator changed during preflight')
    for row in inventory:
        source, target = ROOT / row['archiveFile'], ROOT / row['file']
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists():
            shutil.copyfile(source, target)
        require(sha(target.read_bytes()) == row['sha256'], 'Installed bytes differ')
    MODULE.write_text(module_text)
    if not already_active:
        import_anchor = "import { COSTUME_RIBBIT_DEFINITIONS } from './costume-ribbit-20261120.mjs';\n"
        spread_anchor = '  ...COSTUME_RIBBIT_DEFINITIONS,\n'
        require(entry_before.count(import_anchor) == entry_before.count(spread_anchor) == 1, 'Append anchor mismatch')
        ENTRY.write_text(entry_before.replace(import_anchor, import_anchor + IMPORT).replace(spread_anchor, spread_anchor + SPREAD))
    installed = runtime_catalog()
    verify_prefix(installed, baseline, 39)
    require(installed['appearanceIds'][35:] == IDS and len(installed['costumeIds']) == 468, 'Installation order/count mismatch')
    completion = {'schema': 'encore-next-missing-completion/v1', 'status': 'complete_active',
        'createdAt': datetime.now(timezone.utc).isoformat(), 'baseCommit': BASE_COMMIT, 'baseTree': BASE_TREE,
        'publishedParent': PUBLISHED_PARENT, 'order': IDS, 'slots': SLOTS, 'appearances': appearances,
        'counts': {'completeAppearances': 4, 'nativePngs': 44, 'newNativePngs': 44,
                   'bytes': sum(row['bytes'] for row in inventory), 'cumulativeAppearances': 39,
                   'cumulativeAppearancePngs': 429, 'equipableCostumes': 468},
        'historicalPrefix': {'manifest': str(baseline_path.relative_to(ROOT)), 'sha256': sha(baseline_path.read_bytes()),
                             'appearancesPreserved': 35, 'costumesPreserved': 464, 'definitionsAndOrderPreserved': True},
        'limitations': ['Official merchandise appearance references do not certify episode appearances.',
                        'Eleven independent static drawings per appearance are not full animation cycles.',
                        'Owners, combat kits and statistics are unchanged; source-specific visibility limits remain in each definition.',
                        'Offline manifest, global builds/QA and workbook reconciliation are separate steps.']}
    write(WAVE / 'generation-completion.json', completion)
    write(WAVE / 'asset-inventory.json', inventory)
    write(WAVE / 'native-facing.json', {ident: {slot: 'right' for slot in SLOTS} for ident in IDS})
    print(json.dumps({'status': completion['status'], **completion['counts'], 'historicalPrefixPreserved': True}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
