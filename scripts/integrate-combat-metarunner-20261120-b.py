#!/usr/bin/env python3
"""Activate the three complete, reviewed Ribbit × Meta Runner native families.

The two Cafe outfits must already be active immediately after the immutable
472-costume prefix. Existing NPC definitions and order-module bytes are retained;
only the three new definitions and their three order IDs are appended. No image
is transformed and no global manifest, workbook, build or QA is generated here.
"""
import argparse
import hashlib
import json
import os
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/continuation-20261120-b/metarunner'
BASELINE = ROOT / 'docs/art-generation/continuation-20261120-b/workbook/costume-prefix-baseline.json'
BASELINE_SHA = 'a069c06ef34541b965169f12db4169e40fe16fbbf2381bbffa99b32ce29058cd'
BASE_COMMIT = '38e8000cad61f4b229ad300877f44c31356343fa'
MODULE = ROOT / 'combat/crossover-npc-additions.mjs'
ORDER_MODULE = ROOT / 'combat/costume-order.mjs'
NODE = os.environ.get('CODEX_PRIMARY_RUNTIME_NODE', 'node')
STYLES = ['hommage', 'resident', 'fusion']
SLOTS = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']
CAFE_IDS = ['cafekinger', 'cafepomni']
IDS = ['glitch-metarunner-ribbit-' + style for style in STYLES]
sha = lambda data: hashlib.sha256(data).hexdigest()
read = lambda path: json.loads(path.read_text())


def require(value, message):
    if not value:
        raise ValueError(message)


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    atomic_bytes(path, (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode())


def portable(name):
    path = (ROOT / name).resolve()
    require(path.is_relative_to(ROOT), 'Nonportable input: ' + name)
    return path


def relative(path):
    return str(path.relative_to(ROOT))


def exact_job(style, slot, receipt):
    """A corrected drawing keeps its actual correction job and archived inputs."""
    matches = []
    for path in sorted((WAVE / style / 'jobs').glob('*.json')):
        job = read(path)
        if job.get('appearanceId') == receipt['appearanceId'] and job.get('slot') == slot:
            if all(receipt.get(key) == value for key, value in job.items()):
                matches.append((path, job))
    require(len(matches) == 1, 'Expected one exact recorded job for ' + style + '/' + slot + ', found ' + str(len(matches)))
    return matches[0]


def atomic_bytes(path, data):
    """Replace one runtime file; the caller restores both on a caught failure."""
    descriptor, temporary = tempfile.mkstemp(prefix='.' + path.name + '-', dir=path.parent)
    temporary = Path(temporary)
    try:
        with os.fdopen(descriptor, 'wb') as stream:
            stream.write(data)
        os.chmod(temporary, (path.stat().st_mode & 0o777) if path.exists() else 0o644)
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def catalogue():
    code = """
import {COSTUMES,CROSSOVER_COSTUMES} from './combat/data.mjs';
import {NPC_CROSSOVER_DEFINITIONS} from './combat/crossover-npc-additions.mjs';
import {COSTUME_EXTENSION_ORDER} from './combat/costume-order.mjs';
import {createHash} from 'node:crypto';
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const prefix=COSTUMES.slice(0,472), byId=new Map(prefix.map(value=>[value.id,value]));
const historical=CROSSOVER_COSTUMES.slice(0,381);
console.log(JSON.stringify({costumeIds:COSTUMES.map(value=>value.id),
  prefixSHA256:sha(prefix), crossoverIds:CROSSOVER_COSTUMES.map(value=>value.id),
  historicalCrossoverSHA256:sha(historical),
  historicalCrossoversMatchPrefix:JSON.stringify(historical)===JSON.stringify(historical.map(value=>byId.get(value.id))),
  cafeHashes:Object.fromEntries(COSTUMES.filter(value=>['cafekinger','cafepomni'].includes(value.id)).map(value=>[value.id,sha(value)])),
  npcDefinitions:NPC_CROSSOVER_DEFINITIONS, extensionOrder:COSTUME_EXTENSION_ORDER}));
"""
    return json.loads(subprocess.check_output([NODE, '--input-type=module', '-e', code], cwd=ROOT, text=True))


def verify_prefix(current, baseline, historical_definitions):
    require(current['costumeIds'][:472] == baseline['costumeIds'], 'Historical 472-costume order changed')
    require(current['prefixSHA256'] == baseline['costumesSHA256'], 'Historical 472-costume JSON changed')
    require(current['crossoverIds'][:381] == baseline['crossoverIds'], 'Historical 381-crossover order changed')
    require(current['historicalCrossoversMatchPrefix'], 'Historical crossover fields differ from the preserved wardrobe')
    require(current['npcDefinitions'][:3] == historical_definitions, 'Historical Murder Drones definitions changed')
    require(current['extensionOrder'][:43] == baseline['publishedExtensionIds'], 'Published extension order changed')
    require(len(set(current['costumeIds'])) == len(current['costumeIds']), 'Duplicate runtime costume ID')


def historical_module(baseline):
    content = subprocess.check_output(['git', 'show', BASE_COMMIT + ':combat/crossover-npc-additions.mjs'], cwd=ROOT)
    require(sha(content) == baseline['sourceDigests']['combat/crossover-npc-additions.mjs'], 'Independent NPC source hash changed')
    marker = b'export const NPC_CROSSOVER_DEFINITIONS = Object.freeze('
    require(content.count(marker) == 1, 'Unexpected historical NPC declaration')
    array = content.split(marker, 1)[1].split(b'.map(entry => Object.freeze(entry)));', 1)[0]
    definitions = json.loads(array)
    require(len(definitions) == 3, 'Expected three historical NPC definitions')
    require([entry['id'] for entry in definitions] == baseline['npcCrossoverIds'], 'Wrong historical NPC IDs')
    return content, definitions


def append_npc_module(original, entries):
    suffix = b'\n].map(entry => Object.freeze(entry)));\n'
    require(original.endswith(suffix), 'Unexpected historical NPC closing syntax')
    prefix = original[:-len(suffix)]
    new_entries = json.dumps(entries, ensure_ascii=False, indent=2)[2:-2].encode()
    result = prefix + b',\n' + new_entries + suffix
    require(result.startswith(prefix), 'Historical NPC bytes must stay identical')
    return result, sha(prefix)


def append_order_module(original):
    marker = b'export const COSTUME_EXTENSION_ORDER = Object.freeze(['
    require(original.count(marker) == 1, 'Unexpected order declaration')
    opening = original.index(marker) + len(marker)
    closing = original.index(b'\n]);', opening)
    prefix = original[:closing]
    tail = prefix.rstrip()
    require(tail.rstrip(b',').endswith((b'"cafepomni"', b"'cafepomni'")), 'Cafe IDs must be the current order suffix')
    extra = (b'\n' if tail.endswith(b',') else b',\n') + b',\n'.join(('  ' + json.dumps(ident)).encode() for ident in IDS)
    return prefix + extra + original[closing:]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    missing = []
    for style in STYLES:
        for slot in SLOTS:
            source = WAVE / style / 'generated' / (slot + '.png')
            if not source.is_file() or not source.with_suffix('.json').is_file():
                missing.append(style + '/' + slot)
            elif read(source.with_suffix('.json')).get('status') != 'accepted_native':
                missing.append(style + '/' + slot + ': not accepted')
    if missing:
        print(json.dumps({'status': 'waiting_for_complete_families', 'accepted': 33 - len(missing),
                          'required': 33, 'missing': missing, 'runtimeTouched': False}))
        return 2

    require(sha(BASELINE.read_bytes()) == BASELINE_SHA, 'Independent 472-costume fixture changed')
    baseline = read(BASELINE)
    require(baseline['localCommit'] == BASE_COMMIT and baseline['costumeCount'] == 472, 'Wrong historical baseline')
    original_module, historical_definitions = historical_module(baseline)
    before = catalogue()
    verify_prefix(before, baseline, historical_definitions)
    expected_before = baseline['costumeIds'] + CAFE_IDS
    already_active = before['costumeIds'] == expected_before + IDS
    require(already_active or before['costumeIds'] == expected_before, 'Integrate Cafe Kinger and Cafe Pomni first, in that exact suffix order')
    require(before['extensionOrder'] == baseline['publishedExtensionIds'] + CAFE_IDS + (IDS if already_active else []), 'Unexpected extension order')
    require(before['crossoverIds'] == baseline['crossoverIds'] + (IDS if already_active else []), 'Unexpected crossover suffix')
    require(len(before['npcDefinitions']) == (6 if already_active else 3), 'Unexpected NPC definition count')
    require(set(before['cafeHashes']) == set(CAFE_IDS), 'Both Cafe costumes must be active')

    module_before, order_before = MODULE.read_bytes(), ORDER_MODULE.read_bytes()
    verified = {BASELINE: BASELINE_SHA}
    cafe_files = {}
    for ident in CAFE_IDS:
        for slot in SLOTS:
            target = ROOT / ('assets/encore/' + (slot + '/' + ident if slot in ['selection', 'stance'] else 'poses/' + ident + '/' + slot) + '.png')
            require(target.is_file(), 'Missing prerequisite Cafe image: ' + relative(target))
            data = target.read_bytes()
            require(data.startswith(b'\x89PNG\r\n\x1a\n'), 'Cafe prerequisite must be a native PNG')
            cafe_files[target] = sha(data)
    entries, appearances, inventory = [], [], []
    signatures, generations = set(), set()
    for style in STYLES:
        ident = 'glitch-metarunner-ribbit-' + style
        definition_path = WAVE / 'definitions' / (ident + '.json')
        definition = read(definition_path)
        definition_sha = sha(definition_path.read_bytes())
        require(definition['id'] == ident and definition['fighterId'] == 'ribbit', 'Wrong definition owner')
        require(definition['series'] == 'metarunner' and definition['style'] == style, 'Wrong definition collection')
        require(definition['canonicalCostumeClaim'] is False and definition['episodeFidelityClaim'] is False, 'Original-design scope required')
        require(definition['requiredSlots'] == SLOTS and definition['nativeFacing'] == 'right', 'Definition slots or facing changed')
        require(definition['spriteDirectory'] == 'assets/encore/crossovers/metarunner/ribbit/' + style, 'Wrong native directory')
        verified[definition_path] = definition_sha
        entries.append({key: definition[key] for key in ['id', 'fighterId', 'series', 'style', 'name', 'introducedOn', 'sourceKind']})
        entries[-1]['format'] = 'png'
        rows = []
        for slot in SLOTS:
            source = WAVE / style / 'generated' / (slot + '.png')
            receipt_path = source.with_suffix('.json')
            receipt = read(receipt_path)
            job_path, job = exact_job(style, slot, receipt)
            for key, value in {'appearanceId': ident, 'fighterId': 'ribbit', 'series': 'metarunner', 'style': style,
                               'slot': slot, 'nativeFacing': 'right', 'definitionSHA256': definition_sha}.items():
                require(job.get(key) == value and receipt.get(key) == value, 'Wrong job/receipt ' + key + ': ' + style + '/' + slot)
            require(isinstance(job.get('prompt'), str) and job['prompt'].strip(), 'Recorded prompt required')
            require(isinstance(job.get('referencePaths'), list) and job['referencePaths'], 'Job references required')
            for key, value in job.items():
                require(receipt.get(key) == value, 'Receipt no longer matches its job: ' + key)
            require(receipt['definitionFile'] == relative(definition_path), 'Wrong definition receipt path')
            require(receipt['file'] == relative(source), 'Wrong native archive receipt path')
            require(receipt['status'] == 'accepted_native' and receipt['visualReview']['status'] == 'accepted', 'Accepted visual review required')
            require(receipt['visualReview']['observations'], 'Actual visual observations required')
            require(receipt['method'] == 'image_gen.imagegen' and receipt['nativeCopyVerified'] is True, 'Native generation required')
            require(receipt['transparent_background'] is True and receipt['mode'] == 'RGBA', 'Native transparency required')
            require(receipt['canonicalCostumeClaim'] is False and receipt['episodeFidelityClaim'] is False, 'Receipt must retain original-design scope')
            data = source.read_bytes()
            digest = sha(data)
            require(digest == receipt['sha256'] and len(data) == receipt['bytes'], 'Native bytes changed: ' + style + '/' + slot)
            generation = receipt['sourceGenerationId']
            require(isinstance(generation, str) and generation, 'Generation identifier required')
            require(digest not in signatures and generation not in generations, 'All 33 slots must be distinct native drawings')
            signatures.add(digest)
            generations.add(generation)
            native = Path(receipt['nativeSourceFile'])
            require(native.stem == generation, 'Generation identifier differs from the recorded native source')
            if native.exists():
                require(native.read_bytes() == data, 'Archive differs from native imagegen output')
            with Image.open(source) as image:
                image.load()
                require(image.format == 'PNG' and image.mode == 'RGBA' and min(image.size) >= 768, 'Expected native RGBA PNG')
                alpha = image.getchannel('A')
                extrema = list(alpha.getextrema())
                bounds = alpha.point(lambda value: 255 if value > 12 else 0).getbbox()
                require(extrema[0] == 0 and extrema[1] > 128, 'Real transparency required')
                require(bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < image.width and bounds[3] < image.height, 'Drawing touches the visible edge')
                dimensions = list(image.size)
                require(dimensions == receipt['dimensions'] and list(bounds) == receipt['alpha12Bounds'], 'Image measurements changed')
                require(extrema == receipt['alphaExtrema'] and alpha.histogram()[0] == receipt['fullyTransparentPixels'], 'Alpha measurements changed')
            refs = receipt['portableReferences']
            require([ref['file'] for ref in refs] == job['referencePaths'], 'Receipt references differ from the job')
            require([ref['position'] for ref in refs] == list(range(1, len(refs) + 1)), 'Reference order changed')
            for ref in refs:
                path = portable(ref['file'])
                content = path.read_bytes()
                require(sha(content) == ref['sha256'] and len(content) == ref['bytes'], 'Input reference changed: ' + ref['file'])
                verified[path] = sha(content)
            target = definition['spriteDirectory'] + '/' + slot + '.png'
            require(receipt['targetFile'] == target, 'Wrong active PNG destination')
            destination = portable(target)
            require(not destination.exists() or destination.read_bytes() == data, 'Refuse to overwrite different artwork: ' + target)
            verified[source], verified[receipt_path], verified[job_path] = digest, sha(receipt_path.read_bytes()), sha(job_path.read_bytes())
            rows.append({'appearanceId': ident, 'slot': slot, 'file': target,
                         'archiveFile': relative(source), 'receiptFile': relative(receipt_path), 'jobFile': relative(job_path),
                         'definitionFile': relative(definition_path), 'definitionSHA256': definition_sha,
                         'sha256': digest, 'bytes': len(data), 'dimensions': dimensions, 'mode': 'RGBA',
                         'alphaExtrema': extrema, 'alpha12Bounds': list(bounds), 'nativeFacing': 'right',
                         'sourceGenerationId': generation, 'references': refs})
        appearances.append({'id': ident, 'name': definition['name'], 'fighterId': 'ribbit', 'series': 'metarunner', 'style': style, 'files': rows})
        inventory.extend(rows)

    module_after, historical_prefix_sha = append_npc_module(original_module, entries)
    if already_active:
        require(module_before == module_after, 'Active NPC module differs from the expected append')
        require(before['npcDefinitions'][3:] == entries, 'Active Meta Runner definitions changed')
        order_after = order_before
    else:
        require(module_before == original_module, 'Historical NPC module bytes changed')
        order_after = append_order_module(order_before)
    counts = {'families': 3, 'nativePNG': 33, 'bytes': sum(row['bytes'] for row in inventory)}
    completion = {'schema': 'encore-npc-crossover-completion/v1', 'status': 'integrated_native',
                  'baselineSHA256': BASELINE_SHA, 'order': IDS, 'slots': SLOTS, 'appearances': appearances, 'counts': counts,
                  'historicalWardrobePrefixPreserved': 472, 'historicalCrossoversPreserved': 381,
                  'historicalNpcDefinitionsPreserved': 3, 'historicalNpcPrefixSHA256': historical_prefix_sha,
                  'cafePrerequisiteIds': CAFE_IDS, 'canonicalCostumeClaim': False, 'completeAnimationClaim': False}
    completion_path, inventory_path = WAVE / 'generation-completion.json', WAVE / 'asset-inventory.json'
    if completion_path.exists():
        previous = read(completion_path)
        require({key: value for key, value in previous.items() if key != 'createdAt'} == completion, 'Existing completion differs before activation')
        verified[completion_path] = sha(completion_path.read_bytes())
    if inventory_path.exists():
        require(read(inventory_path) == {'assets': inventory}, 'Existing inventory differs before activation')
        verified[inventory_path] = sha(inventory_path.read_bytes())
    existing_integration = WAVE / 'integration-receipt.json'
    if existing_integration.exists():
        previous = read(existing_integration)
        require(already_active, 'An integration receipt exists without its active costumes')
        require(previous['baselineSHA256'] == BASELINE_SHA and previous['counts'] == counts, 'Existing integration receipt differs')
        require(previous['runtimeAfter'] == {relative(MODULE): sha(module_before), relative(ORDER_MODULE): sha(order_before)}, 'Active runtime differs from its integration receipt')
        verified[existing_integration] = sha(existing_integration.read_bytes())
    if args.check_only:
        print(json.dumps({'status': 'ready', **counts, 'alreadyActive': already_active, 'runtimeTouched': False}))
        return 0

    # All inputs and both runtime files are rechecked before the first mutation.
    for path, digest in {**verified, **cafe_files}.items():
        require(sha(path.read_bytes()) == digest, 'Input changed during preflight: ' + relative(path))
    require(MODULE.read_bytes() == module_before and ORDER_MODULE.read_bytes() == order_before, 'Runtime changed during preflight')
    for row in inventory:
        destination = ROOT / row['file']
        if not destination.exists():
            destination.parent.mkdir(parents=True, exist_ok=True)
            atomic_bytes(destination, (ROOT / row['archiveFile']).read_bytes())
        require(sha(destination.read_bytes()) == row['sha256'], 'Native copy failed')
    try:
        if not already_active:
            atomic_bytes(MODULE, module_after)
            atomic_bytes(ORDER_MODULE, order_after)
        current = catalogue()
        verify_prefix(current, baseline, historical_definitions)
        require(current['costumeIds'] == expected_before + IDS, 'New costumes must follow both Cafe outfits')
        require(current['crossoverIds'] == baseline['crossoverIds'] + IDS, 'Unexpected Meta Runner crossover order')
        require(current['npcDefinitions'] == historical_definitions + entries, 'NPC definitions changed during activation')
        require(current['historicalCrossoverSHA256'] == before['historicalCrossoverSHA256'], 'Historical crossover JSON changed')
        require(current['cafeHashes'] == before['cafeHashes'], 'Cafe records changed during activation')
        require(current['extensionOrder'] == baseline['publishedExtensionIds'] + CAFE_IDS + IDS, 'Wrong appended order IDs')
        for path, digest in cafe_files.items():
            require(sha(path.read_bytes()) == digest, 'Cafe image changed during activation')
    except Exception:
        if not already_active:
            atomic_bytes(MODULE, module_before)
            atomic_bytes(ORDER_MODULE, order_before)
        raise

    for row in inventory:
        path = ROOT / row['receiptFile']
        receipt = read(path)
        if receipt.get('includedInRuntime') is not True:
            receipt['includedInRuntime'] = True
            write_json(path, receipt)
    if completion_path.exists():
        previous = read(completion_path)
        require({key: value for key, value in previous.items() if key != 'createdAt'} == completion, 'Existing completion differs from verified native files')
    else:
        write_json(completion_path, {**completion, 'createdAt': datetime.now(timezone.utc).isoformat()})
    if inventory_path.exists():
        require(read(inventory_path) == {'assets': inventory}, 'Existing inventory differs from verified native files')
    else:
        write_json(inventory_path, {'assets': inventory})
    receipt_path = WAVE / 'integration-receipt.json'
    if not receipt_path.exists():
        write_json(receipt_path, {'schema': 'encore-metarunner-integration/v1', 'createdAt': datetime.now(timezone.utc).isoformat(),
                   'status': 'integrated_native', 'baselineSHA256': BASELINE_SHA, 'counts': counts,
                   'costumes': len(current['costumeIds']), 'crossovers': len(current['crossoverIds']),
                   'historicalWardrobePrefixSHA256': current['prefixSHA256'],
                   'historicalCrossoverSHA256': current['historicalCrossoverSHA256'],
                   'historicalNpcPrefixSHA256': historical_prefix_sha,
                   'runtimeBefore': {relative(MODULE): sha(module_before), relative(ORDER_MODULE): sha(order_before)},
                   'runtimeAfter': {relative(MODULE): sha(MODULE.read_bytes()), relative(ORDER_MODULE): sha(ORDER_MODULE.read_bytes())},
                   'preflightEvidenceSHA256': {relative(path): digest for path, digest in verified.items()},
                   'cafeImagesSHA256': {relative(path): digest for path, digest in cafe_files.items()},
                   'offlineManifestRegenerated': False, 'globalQaExecuted': False, 'workbookExported': False})
    print(json.dumps({'status': 'already_integrated' if already_active else 'integrated_native', **counts,
                      'costumes': len(current['costumeIds']), 'crossovers': len(current['crossoverIds'])}))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
