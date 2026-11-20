#!/usr/bin/env python3
"""Install three reviewed Cafe families without changing the 477-costume prefix.

This dated installation step follows the Meta Runner append. --check-only
validates every native copy and reference but does not activate or copy assets.
No pixel transform, offline-manifest rebuild, global QA, or workbook edit occurs.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
WAVE = Path(__file__).resolve().parent
BASELINE = WAVE.parent / 'baseline.json'
BASELINE_SHA = '2493bf0950134d03a63a6ab925c773fd97ecce20860a3ff5954c32a44d442387'
BASE_COMMIT = 'd0b1c092120b2c472354b67ffbf136f6a58004c5'
ORDER_BASELINE_SHA = 'f053e51f49a81c7a340ab246d85f4945260d14ed7c7630dfd002feb2d6e6d5f7'
AGGREGATOR_BASELINE_SHA = '6ca423daada66954c5b7760f021d38b047516afb68c1f3dd873567288db8789d'
IDS = ['caferagatha', 'cafegangle', 'cafezooble']
OWNERS = {'caferagatha': 'ragatha', 'cafegangle': 'gangle', 'cafezooble': 'zooble'}
DEFINITION_SHA = {
    'caferagatha': '7e7e4089742816d9ae310404d10ecc7ed0fd526e8be1452e604dfbbf979de654',
    'cafegangle': '67d8e5543ce2904c4a97c025f3f97a112320e7eba941863cbeffae53bd1f6d9e',
    'cafezooble': 'f6cbef6ee7b484a505bbef70f6f45fcacf8f17d2c8c222b867a914e3ba0f8407',
}
SLOTS = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']
MODULE = ROOT / 'combat/costume-continuation-20261120-c.mjs'
ENTRY = ROOT / 'combat/costume-additions.mjs'
ORDER = ROOT / 'combat/costume-order.mjs'
IMPORT = "import { COSTUME_CONTINUATION_C_DEFINITIONS } from './costume-continuation-20261120-c.mjs';\n"
SPREAD = '  ...COSTUME_CONTINUATION_C_DEFINITIONS,\n'
ORDER_OLD = '  "glitch-metarunner-ribbit-fusion"\n]);'
ORDER_NEW = '  "glitch-metarunner-ribbit-fusion",\n  "caferagatha",\n  "cafegangle",\n  "cafezooble"\n]);'
sha = lambda value: hashlib.sha256(value).hexdigest()
read = lambda path: json.loads(path.read_text())


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def require(condition, message):
    if not condition:
        raise ValueError(message)


def portable(value):
    path = (ROOT / value).resolve()
    require(path.is_relative_to(ROOT), 'Reference leaves repository: ' + value)
    return path


def runtime_catalog():
    code = """
import {COSTUMES,COSTUME_ADDITIONS,FIGHTERS,STAGES} from './combat/data.mjs';
import {COSTUME_EXTENSION_ORDER} from './combat/costume-order.mjs';
import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
console.log(JSON.stringify({costumeIds:COSTUMES.map(x=>x.id),
  costumeCount:COSTUMES.length,appearanceIds:COSTUME_ADDITIONS.map(x=>x.id),
  costumePrefixSHA256:hash(COSTUMES.slice(0,477)),
  extensionOrder:COSTUME_EXTENSION_ORDER,
  rosterSHA256:hash(FIGHTERS),stagesSHA256:hash(STAGES),
  owners:Object.fromEntries(COSTUMES.map(x=>[x.id,x.fighterId]))}));
"""
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def verify_runtime(value, baseline, active):
    require(value['costumeIds'][:477] == baseline['costumeIds'], 'Historical costume order changed')
    require(value['costumePrefixSHA256'] == baseline['costumesSHA256'], 'Historical costume objects changed')
    require(value['rosterSHA256'] == baseline['rosterSHA256'], 'Fighter definitions changed')
    require(value['stagesSHA256'] == baseline['stagesSHA256'], 'Stage definitions changed')
    require(value['appearanceIds'][:42] == baseline['circusAdditionIds'], 'Historical Circus order changed')
    require(value['extensionOrder'][:48] == baseline['publishedExtensionIds'], 'Historical extension order changed')
    require(value['costumeCount'] == (480 if active else 477), 'This Cafe installer must follow the existing 477-costume catalogue')
    require(value['appearanceIds'][42:] == (IDS if active else []), 'Unexpected Cafe appearance append')
    require(value['extensionOrder'][48:] == (IDS if active else []), 'Unexpected extension append')
    if active:
        require(value['costumeIds'][477:] == IDS, 'Cafe costumes must follow the complete published prefix')
        for ident in IDS:
            require(value['owners'][ident] == OWNERS[ident], 'Wrong costume owner: ' + ident)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    require(sha(BASELINE.read_bytes()) == BASELINE_SHA, 'Frozen costume baseline changed')
    baseline = read(BASELINE)
    require(baseline['localCommit'] == BASE_COMMIT and baseline['costumeCount'] == 477, 'Wrong published baseline')
    entry_before, order_before = ENTRY.read_text(), ORDER.read_text()
    active = IMPORT in entry_before
    require((SPREAD in entry_before) == active, 'Partial Cafe import/spread')
    require(sha(entry_before.replace(IMPORT, '').replace(SPREAD, '').encode()) == AGGREGATOR_BASELINE_SHA, 'Aggregator changed beyond the Cafe append')
    expected_order = order_before.replace(ORDER_NEW, ORDER_OLD) if active else order_before
    require(sha(expected_order.encode()) == ORDER_BASELINE_SHA, 'Existing extension table or ordering function changed')
    require((ORDER_NEW in order_before) == active, 'Partial Cafe order append')
    before = runtime_catalog()
    verify_runtime(before, baseline, active)
    definitions, appearances, inventory = [], [], []
    signatures, generation_ids, verified_inputs = set(), set(), {}
    missing = []
    for ident in IDS:
        for slot in SLOTS:
            source = WAVE / 'generated' / ident / (slot + '.png')
            receipt_path = source.with_suffix('.json')
            if not source.exists() or not receipt_path.exists():
                missing.append(ident + '/' + slot)
            elif read(receipt_path).get('status') != 'accepted_native':
                missing.append(ident + '/' + slot)
    if missing:
        print(json.dumps({'status': 'waiting_for_complete_wave', 'missing': missing, 'runtimeTouched': False}))
        return 2
    for ident in IDS:
        definition_path = WAVE / 'definitions' / (ident + '.json')
        definition = read(definition_path)
        require(sha(definition_path.read_bytes()) == DEFINITION_SHA[ident], 'Frozen definition changed')
        require(definition['id'] == ident and definition['fighterId'] == OWNERS[ident], 'Definition owner mismatch')
        definitions.append(definition)
        verified_inputs[definition_path] = DEFINITION_SHA[ident]
        rows = []
        for slot in SLOTS:
            source = WAVE / 'generated' / ident / (slot + '.png')
            receipt_path = source.with_suffix('.json')
            receipt = read(receipt_path)
            require(receipt['appearanceId'] == ident and receipt['slot'] == slot, 'Receipt identity mismatch')
            require(receipt.get('fighterId', OWNERS[ident]) == OWNERS[ident], 'Receipt owner mismatch')
            require(receipt['status'] == 'accepted_native' and receipt['visualReview']['status'] == 'accepted', 'Unreviewed PNG')
            require(receipt['method'] == 'image_gen.imagegen' and receipt['nativeCopyVerified'] is True, 'Native generation evidence missing')
            require(receipt['definitionSha256'] == DEFINITION_SHA[ident], 'Receipt definition mismatch')
            require(receipt['nativeFacing'] == 'right', 'Unreviewed runtime direction')
            data = source.read_bytes()
            digest = sha(data)
            require(digest == receipt['sha256'] and len(data) == receipt['bytes'], 'Native archive differs from receipt')
            native = Path(receipt['nativeSourceFile'])
            require(native.is_file() and native.read_bytes() == data, 'Original native output differs from archive')
            verified_inputs[native] = digest
            require(digest not in signatures, 'Duplicate drawing')
            signatures.add(digest)
            generation_id = receipt['sourceGenerationId']
            require(generation_id and generation_id not in generation_ids, 'Separate native generation required per pose')
            generation_ids.add(generation_id)
            with Image.open(source) as im:
                im.load()
                require(im.mode == 'RGBA' and min(im.size) >= 768, 'Invalid native RGBA size')
                alpha = im.getchannel('A')
                bounds = alpha.point(lambda x: 255 if x > 12 else 0).getbbox()
                dimensions, extrema = list(im.size), list(alpha.getextrema())
                require(extrema[0] == 0 and extrema[1] > 128, 'Missing native transparency')
                require(bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < im.width and bounds[3] < im.height, 'Native silhouette touches frame')
            require(dimensions == receipt['dimensions'] and list(bounds) == receipt['alpha12Bounds'] and extrema == receipt['alphaExtrema'], 'Image measurements differ')
            refs = receipt['portableReferences']
            require(refs, 'Portable references missing')
            for ref in refs:
                path = portable(ref['file'])
                content = path.read_bytes()
                require(sha(content) == ref['sha256'] and len(content) == ref['bytes'], 'Reference changed: ' + ref['file'])
                require(receipt['expectedReferenceSHA256'][ref['file']] == ref['sha256'], 'Expected reference hash differs')
                verified_inputs[path] = ref['sha256']
            job_path = portable(receipt.get('jobPath', str((WAVE / 'generated' / ident / 'jobs' / (slot + '.json')).relative_to(ROOT))))
            job = read(job_path)
            require(job['prompt'] == receipt['prompt'] and job['referencePaths'] == receipt['referencePaths'], 'Exact job or input order differs')
            require(job['expectedReferenceSHA256'] == receipt['expectedReferenceSHA256'], 'Exact job reference hashes differ')
            verified_inputs[job_path] = sha(job_path.read_bytes())
            target = f'assets/encore/{slot}/{ident}.png' if slot in ['selection', 'stance'] else f'assets/encore/poses/{ident}/{slot}.png'
            require(receipt['targetFile'] == target and receipt['file'] == str(source.relative_to(ROOT)), 'Incorrect native archive or target path')
            destination = ROOT / target
            require(not destination.exists() or destination.read_bytes() == data, 'Refuse differing destination: ' + target)
            verified_inputs[source] = digest
            verified_inputs[receipt_path] = sha(receipt_path.read_bytes())
            row = {'appearanceId': ident, 'slot': slot, 'file': target,
                   'archiveFile': str(source.relative_to(ROOT)), 'receiptFile': str(receipt_path.relative_to(ROOT)),
                   'sha256': digest, 'bytes': len(data), 'dimensions': dimensions, 'mode': 'RGBA',
                   'alphaExtrema': extrema, 'alpha12Bounds': list(bounds), 'nativeFacing': 'right',
                   'sourceGenerationId': generation_id, 'references': refs,
                   'jobFile': str(job_path.relative_to(ROOT)), 'jobSHA256': sha(job_path.read_bytes())}
            rows.append(row)
            inventory.append(row)
        appearances.append({'id': ident, 'name': definition['name'], 'fighterId': OWNERS[ident], 'files': rows})
    require(len(inventory) == len(signatures) == len(generation_ids) == 33, 'Three complete independent families are required')
    module_text = '/** Official Animate Cafe outfits; original static poses retain the existing Ragatha, Gangle and Zooble kits. */\n'
    module_text += 'export const COSTUME_CONTINUATION_C_DEFINITIONS = ' + json.dumps(definitions, ensure_ascii=False, indent=2) + ';\n'
    require(not MODULE.exists() or MODULE.read_text() == module_text, 'Refuse different active definitions')
    if args.check_only:
        print(json.dumps({'status': 'ready', 'accepted': 33, 'order': IDS,
                          'nativeBytes': sum(x['bytes'] for x in inventory), 'historicalCostumesPreserved': 477,
                          'historicalExtensionIdsPreserved': 48, 'runtimeTouched': False}, ensure_ascii=False))
        return 0
    for path, digest in verified_inputs.items():
        require(sha(path.read_bytes()) == digest, 'Input changed during installation preflight: ' + str(path))
    require(ENTRY.read_text() == entry_before and ORDER.read_text() == order_before, 'Runtime changed during preflight')
    for row in inventory:
        target = ROOT / row['file']
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists():
            shutil.copyfile(ROOT / row['archiveFile'], target)
        require(sha(target.read_bytes()) == row['sha256'], 'Native copy differs after installation')
    MODULE.write_text(module_text)
    if not active:
        import_anchor = "import { COSTUME_CONTINUATION_B_DEFINITIONS } from './costume-continuation-20261120-b.mjs';\n"
        spread_anchor = '  ...COSTUME_CONTINUATION_B_DEFINITIONS,\n'
        require(entry_before.count(import_anchor) == entry_before.count(spread_anchor) == 1, 'Append anchor mismatch')
        require(order_before.count(ORDER_OLD) == 1, 'Extension order append anchor mismatch')
        ENTRY.write_text(entry_before.replace(import_anchor, import_anchor + IMPORT).replace(spread_anchor, spread_anchor + SPREAD))
        ORDER.write_text(order_before.replace(ORDER_OLD, ORDER_NEW))
    after = runtime_catalog()
    verify_runtime(after, baseline, True)
    now = datetime.now(timezone.utc).isoformat()
    for row in inventory:
        receipt_path = ROOT / row['receiptFile']
        receipt = read(receipt_path)
        if receipt.get('includedInRuntime') is not True:
            receipt['includedInRuntime'] = True
            receipt['runtimeIntegration'] = {'activatedAt': now, 'targetFile': row['file'], 'sha256': row['sha256'],
                                            'method': 'Byte-identical copy after complete native review and frozen-prefix checks'}
            write(receipt_path, receipt)
        row['receiptSHA256'] = sha(receipt_path.read_bytes())
    prefix = {'manifest': str(BASELINE.relative_to(ROOT)), 'sha256': BASELINE_SHA,
              'costumesPreserved': 477, 'circusAppearancesPreserved': 42, 'extensionIdsPreserved': 48,
              'costumesSHA256': after['costumePrefixSHA256'], 'definitionsAndOrderPreserved': True}
    completion = {'schema': 'encore-continuation-c-cafe-completion/v1', 'status': 'complete_active',
                  'createdAt': now, 'baseCommit': BASE_COMMIT, 'order': IDS, 'slots': SLOTS, 'appearances': appearances,
                  'counts': {'completeAppearances': 3, 'nativePngs': 33, 'newNativePngs': 33,
                             'bytes': sum(x['bytes'] for x in inventory), 'cumulativeAppearances': 45,
                             'cumulativeAppearancePngs': 495, 'equipableCostumesAtCafeActivation': after['costumeCount'],
                             'acceptedImagegenOutputs': 33, 'archivedSupersededOutputs': 2},
                  'historicalPrefix': prefix,
                  'limitations': ['Official commercial illustration comparison and original fan-game static poses; no episode or 1:1 certification.',
                                  'The unshown backs, partly hidden attachments and small Gangle hand details remain original adaptations described in the frozen definitions.',
                                  'Eleven independent static images per family are not full animation cycles or browser validation.',
                                  'Maid Ribbit Pendantz remains a separate unqualified candidate.',
                                  'Offline manifest, global QA, builds and workbook reconciliation are later independent steps.']}
    write(WAVE / 'generation-completion.json', completion)
    write(WAVE / 'asset-inventory.json', inventory)
    write(WAVE / 'native-facing.json', {ident: {slot: 'right' for slot in SLOTS} for ident in IDS})
    write(WAVE / 'integration-proof.json', {'schema': 'encore-cafe-native-integration-proof/v1', 'createdAt': now,
          'status': 'passed', 'before': before, 'after': after, 'historicalPrefix': prefix,
          'nativeCopiesVerified': 33, 'nativeReferencesAndJobsVerified': True, 'pixelTransforms': 0,
          'orderingFunctionPreserved': True, 'originalOrderFileSHA256': ORDER_BASELINE_SHA,
          'script': str(Path(__file__).relative_to(ROOT)), 'scriptSHA256': sha(Path(__file__).read_bytes()),
          'runtimeFiles': [{'file': str(p.relative_to(ROOT)), 'sha256': sha(p.read_bytes())} for p in [MODULE, ENTRY, ORDER]],
          'offlineManifestRebuilt': False, 'globalTestsRun': False, 'workbookEdited': False})
    print(json.dumps({'status': 'complete_active', **completion['counts'], 'historicalPrefixPreserved': True}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
