#!/usr/bin/env python3
"""Install the two reviewed Cafe families without changing the 472-costume prefix.

This dated installation step runs before the Meta Runner append. --check-only
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
BASELINE = WAVE.parent / 'workbook/costume-prefix-baseline.json'
BASELINE_SHA = 'a069c06ef34541b965169f12db4169e40fe16fbbf2381bbffa99b32ce29058cd'
BASE_COMMIT = '38e8000cad61f4b229ad300877f44c31356343fa'
ORDER_BASELINE_SHA = 'fe651d9b8da55a5dc4e1f1e58c8e50a369fd93f149743ac1beaf411ada61e827'
IDS = ['cafekinger', 'cafepomni']
OWNERS = {'cafekinger': 'kinger', 'cafepomni': 'pomni'}
DEFINITION_SHA = {
    'cafekinger': 'a88213cffa6774258b1dc53c8e2c0e2aed5eaa2764993b79693deb9fd1a8308a',
    'cafepomni': '93b2acb2d0b4fb269727a18e0f16460ee610979089227acb8dbaa7d39720014c',
}
SLOTS = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']
MODULE = ROOT / 'combat/costume-continuation-20261120-b.mjs'
ENTRY = ROOT / 'combat/costume-additions.mjs'
ORDER = ROOT / 'combat/costume-order.mjs'
IMPORT = "import { COSTUME_CONTINUATION_B_DEFINITIONS } from './costume-continuation-20261120-b.mjs';\n"
SPREAD = '  ...COSTUME_CONTINUATION_B_DEFINITIONS,\n'
ORDER_OLD = '  "glitch-murderdrones-ribbit-fusion"\n]);'
ORDER_NEW = '  "glitch-murderdrones-ribbit-fusion",\n  "cafekinger",\n  "cafepomni"\n]);'
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
import {COSTUMES,COSTUME_ADDITIONS} from './combat/data.mjs';
import {COSTUME_EXTENSION_ORDER} from './combat/costume-order.mjs';
import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
console.log(JSON.stringify({costumeIds:COSTUMES.map(x=>x.id),
  costumeCount:COSTUMES.length,appearanceIds:COSTUME_ADDITIONS.map(x=>x.id),
  costumePrefixSHA256:hash(COSTUMES.slice(0,472)),
  extensionOrder:COSTUME_EXTENSION_ORDER,
  owners:Object.fromEntries(COSTUMES.map(x=>[x.id,x.fighterId]))}));
"""
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def verify_runtime(value, baseline, active):
    require(value['costumeIds'][:472] == baseline['costumeIds'], 'Historical costume order changed')
    require(value['costumePrefixSHA256'] == baseline['costumesSHA256'], 'Historical costume objects changed')
    require(value['appearanceIds'][:40] == baseline['circusAdditionIds'], 'Historical Circus order changed')
    require(value['extensionOrder'][:43] == baseline['publishedExtensionIds'], 'Historical extension order changed')
    require(value['costumeCount'] == (474 if active else 472), 'This Cafe installer must precede the next NPC append')
    require(value['appearanceIds'][40:] == (IDS if active else []), 'Unexpected Cafe appearance append')
    require(value['extensionOrder'][43:] == (IDS if active else []), 'Unexpected extension append')
    if active:
        require(value['costumeIds'][472:] == IDS, 'Cafe costumes must follow the complete published prefix')
        for ident in IDS:
            require(value['owners'][ident] == OWNERS[ident], 'Wrong costume owner: ' + ident)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    require(sha(BASELINE.read_bytes()) == BASELINE_SHA, 'Frozen costume baseline changed')
    baseline = read(BASELINE)
    require(baseline['localCommit'] == BASE_COMMIT and baseline['costumeCount'] == 472, 'Wrong published baseline')
    entry_before, order_before = ENTRY.read_text(), ORDER.read_text()
    active = IMPORT in entry_before
    require((SPREAD in entry_before) == active, 'Partial Cafe import/spread')
    require(sha(entry_before.replace(IMPORT, '').replace(SPREAD, '').encode()) == baseline['sourceDigests']['combat/costume-additions.mjs'], 'Aggregator changed beyond the Cafe append')
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
    require(len(inventory) == len(signatures) == len(generation_ids) == 22, 'Both complete independent families are required')
    module_text = '/** Official Animate Cafe outfits; original static poses retain the existing Kinger and Pomni kits. */\n'
    module_text += 'export const COSTUME_CONTINUATION_B_DEFINITIONS = ' + json.dumps(definitions, ensure_ascii=False, indent=2) + ';\n'
    require(not MODULE.exists() or MODULE.read_text() == module_text, 'Refuse different active definitions')
    if args.check_only:
        print(json.dumps({'status': 'ready', 'accepted': 22, 'order': IDS,
                          'nativeBytes': sum(x['bytes'] for x in inventory), 'historicalCostumesPreserved': 472,
                          'historicalExtensionIdsPreserved': 43, 'runtimeTouched': False}, ensure_ascii=False))
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
        import_anchor = "import { COSTUME_NEXT_WAVE_DEFINITIONS } from './costume-next-wave-20261120.mjs';\n"
        spread_anchor = '  ...COSTUME_NEXT_WAVE_DEFINITIONS,\n'
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
              'costumesPreserved': 472, 'circusAppearancesPreserved': 40, 'extensionIdsPreserved': 43,
              'costumesSHA256': after['costumePrefixSHA256'], 'definitionsAndOrderPreserved': True}
    completion = {'schema': 'encore-continuation-b-cafe-completion/v1', 'status': 'complete_active',
                  'createdAt': now, 'baseCommit': BASE_COMMIT, 'order': IDS, 'slots': SLOTS, 'appearances': appearances,
                  'counts': {'completeAppearances': 2, 'nativePngs': 22, 'newNativePngs': 22,
                             'bytes': sum(x['bytes'] for x in inventory), 'cumulativeAppearances': 42,
                             'cumulativeAppearancePngs': 462, 'equipableCostumesAtCafeActivation': after['costumeCount'],
                             'imagegenCalls': 24, 'nativeOutputs': 23, 'rejectedNativeOutputs': 1, 'blockedCallsWithoutOutput': 1},
                  'historicalPrefix': prefix,
                  'limitations': ['Official commercial illustration comparison and original fan-game static poses; no episode or 1:1 certification.',
                                  'Kinger floating gloves use established anatomy; source poster does not clearly show his hands.',
                                  'Partly hidden Pomni bib and unshown backs remain described in the frozen definitions.',
                                  'Eleven independent static images per family are not full animation cycles or browser validation.',
                                  'Maid Ribbit Pendantz remains a separate unqualified candidate.',
                                  'Offline manifest, global QA, builds and workbook reconciliation are later independent steps.']}
    write(WAVE / 'generation-completion.json', completion)
    write(WAVE / 'asset-inventory.json', inventory)
    write(WAVE / 'native-facing.json', {ident: {slot: 'right' for slot in SLOTS} for ident in IDS})
    write(WAVE / 'integration-proof.json', {'schema': 'encore-cafe-native-integration-proof/v1', 'createdAt': now,
          'status': 'passed', 'before': before, 'after': after, 'historicalPrefix': prefix,
          'nativeCopiesVerified': 22, 'nativeReferencesAndJobsVerified': True, 'pixelTransforms': 0,
          'orderingFunctionPreserved': True, 'originalOrderFileSHA256': ORDER_BASELINE_SHA,
          'script': str(Path(__file__).relative_to(ROOT)), 'scriptSHA256': sha(Path(__file__).read_bytes()),
          'runtimeFiles': [{'file': str(p.relative_to(ROOT)), 'sha256': sha(p.read_bytes())} for p in [MODULE, ENTRY, ORDER]],
          'offlineManifestRebuilt': False, 'globalTestsRun': False, 'workbookEdited': False})
    print(json.dumps({'status': 'complete_active', **completion['counts'], 'historicalPrefixPreserved': True}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
