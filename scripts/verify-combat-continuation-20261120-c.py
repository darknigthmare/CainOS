#!/usr/bin/env python3
"""Record the executed counts, native-copy integrity and final Cafe C evidence."""
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/continuation-20261120-c'
BASE = 'd0b1c092120b2c472354b67ffbf136f6a58004c5'
BASELINE_SHA = '2493bf0950134d03a63a6ab925c773fd97ecce20860a3ff5954c32a44d442387'
IDS = ['caferagatha', 'cafegangle', 'cafezooble']
MODULES = ['combat/data.mjs', 'combat/costume-additions.mjs', 'combat/costume-order.mjs',
    'combat/costume-continuation-20261120-c.mjs', 'combat/crossovers.mjs',
    'combat/crossover-npc-additions.mjs', 'combat/illustrations.mjs', 'combat/render.mjs',
    'combat/render-poses.mjs', 'combat/offline-manifest.mjs', 'combat/fidelity.mjs',
    'combat/audio.mjs', 'combat/audio-ambiences.mjs', 'combat/progression.mjs',
    'combat/stories.mjs', 'combat/render-stage-motion.mjs', 'combat/stage-parallax.mjs',
    'combat/engine.mjs', 'combat/session.mjs']
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
read = lambda path: json.loads(path.read_text())


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def sources():
    return {file: sha(ROOT / file) for file in MODULES}


def report(file):
    return {'file': str(file.relative_to(ROOT)), 'sha256': sha(file)}


assert sha(WAVE / 'baseline.json') == BASELINE_SHA
baseline = read(WAVE / 'baseline.json')
assert baseline['localCommit'] == BASE and baseline['costumeCount'] == 477
mode = sys.argv[1]
if mode == 'counts':
    code = """
import {FIGHTERS,MOVES,COSTUMES,COSTUME_ADDITIONS,CROSSOVER_COSTUMES,STAGES,DEDICATED_STAGES,ARCHIVE} from './combat/data.mjs';
import {ART_FILES,ART_BYTES,CORE_FILES,ART_VERSION,OFFLINE_VERSION} from './combat/offline-manifest.mjs';
import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const owned=id=>CROSSOVER_COSTUMES.filter(c=>c.fighterId===id).length;
console.log(JSON.stringify({fighters:FIGHTERS.length,techniques:MOVES.length,costumes:COSTUMES.length,
additionalAppearances:COSTUME_ADDITIONS.length,additionalAppearancePNGs:COSTUME_ADDITIONS.length*11,
crossovers:CROSSOVER_COSTUMES.length,crossoverDrawings:ART_FILES.filter(f=>f.includes('/crossovers/')).length,
fullyCoveredCrossoverFighters:FIGHTERS.filter(f=>owned(f.id)===27).length,
partiallyCoveredCrossoverFighters:FIGHTERS.filter(f=>owned(f.id)>0&&owned(f.id)<27).length,
fightersWithoutCrossovers:FIGHTERS.filter(f=>owned(f.id)===0).length,
remainingCrossoverCostumes:FIGHTERS.reduce((sum,f)=>sum+27-owned(f.id),0),
stages:STAGES.length,dedicatedArrangements:DEDICATED_STAGES.length,archive:ARCHIVE.length,
historicalCostumePrefixCount:477,historicalCostumePrefixSHA256:hash(COSTUMES.slice(0,477)),
rosterSHA256:hash(FIGHTERS),stagesSHA256:hash(STAGES),
offlineImages:ART_FILES.length,offlineBytes:ART_BYTES,coreFiles:CORE_FILES.length,
artVersion:ART_VERSION,offlineVersion:OFFLINE_VERSION}));
"""
    value = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))
    expected = {'fighters': 54, 'techniques': 540, 'costumes': 480, 'additionalAppearances': 45,
        'additionalAppearancePNGs': 495, 'crossovers': 384, 'crossoverDrawings': 3847,
        'fullyCoveredCrossoverFighters': 14, 'partiallyCoveredCrossoverFighters': 1,
        'fightersWithoutCrossovers': 39, 'remainingCrossoverCostumes': 1074,
        'stages': 25, 'dedicatedArrangements': 54, 'archive': 179, 'offlineImages': 5907,
        'historicalCostumePrefixSHA256': baseline['costumesSHA256'],
        'rosterSHA256': baseline['rosterSHA256'], 'stagesSHA256': baseline['stagesSHA256']}
    for key, expected_value in expected.items():
        assert value[key] == expected_value, (key, value[key], expected_value)
    write(WAVE / 'runtime-counts.json', value)
    print(json.dumps(value))
elif mode == 'integrity':
    assert read(WAVE / 'qa-execution.json')['exitCode'] == 0
    rows = read(WAVE / 'cafe/asset-inventory.json')
    assert len(rows) == 33 and len({r['sha256'] for r in rows}) == 33
    copies = []
    for row in rows:
        assert sha(ROOT / row['file']) == row['sha256'] == sha(ROOT / row['archiveFile'])
        assert sha(ROOT / row['receiptFile']) == row['receiptSHA256']
        receipt = read(ROOT / row['receiptFile'])
        assert receipt['status'] == 'accepted_native' and receipt['includedInRuntime']
        assert receipt['visualReview']['status'] == 'accepted'
        assert Path(receipt['nativeSourceFile']).read_bytes() == (ROOT / row['file']).read_bytes()
    for build in ['dist', 'dist-combat']:
        for row in rows:
            assert sha(ROOT / build / row['file']) == row['sha256'], (build, row['file'])
            copies.append({'build': build, 'file': row['file'], 'sha256': row['sha256']})
        for file in MODULES:
            assert (ROOT / build / file).read_bytes() == (ROOT / file).read_bytes(), (build, file)
    tree = subprocess.check_output(['git', 'ls-tree', '-rz', BASE, '--', 'assets/encore/'], cwd=ROOT)
    historical = []
    for entry in tree.split(b'\0'):
        if not entry:
            continue
        metadata, raw_path = entry.split(b'\t', 1)
        mode_text, kind, blob = metadata.decode().split()
        assert kind == 'blob'
        file = raw_path.decode()
        payload = (ROOT / file).read_bytes()
        actual = hashlib.sha1(b'blob ' + str(len(payload)).encode() + b'\0' + payload).hexdigest()
        assert actual == blob, 'Historical asset changed: ' + file
        historical.append({'file': file, 'gitBlobSHA1': blob})
    assert len(historical) == 5830
    history = {'schema': 'encore-historical-assets-baseline/v1', 'baseCommit': BASE,
        'count': len(historical), 'assets': historical}
    write(WAVE / 'historical-assets-baseline.json', history)
    preserved = {}
    for file in ['combat/engine.mjs', 'combat/session.mjs', 'combat/stories.mjs',
                 'combat/stage-parallax.mjs', 'combat/crossovers.mjs', 'combat/crossover-npc-additions.mjs']:
        assert subprocess.check_output(['git', 'show', BASE + ':' + file], cwd=ROOT) == (ROOT / file).read_bytes(), file
        preserved[file] = sha(ROOT / file)
    value = {'schema': 'encore-continuation-c-build-integrity/v1', 'status': 'passed', 'complete': True,
        'baseCommit': BASE, 'newNativePNG': 33, 'newNativeBytes': sum(r['bytes'] for r in rows),
        'nativeBuildCopies': len(copies), 'nativeAssetComparisons': len(copies),
        'moduleComparisons': len(MODULES) * 2, 'copies': copies,
        'historicalAssetsCompared': len(historical), 'historicalAssetsUnchanged': True,
        'historicalInventorySHA256': sha(WAVE / 'historical-assets-baseline.json'),
        'preservedRuntimeModules': preserved, 'sources': sources()}
    write(WAVE / 'build-integrity.json', value)
    print(json.dumps({k: v for k, v in value.items() if k not in ['copies', 'sources']}))
elif mode == 'summary':
    runtime = read(WAVE / 'runtime-counts.json')
    qa = read(WAVE / 'qa-execution.json')
    qa_log = (WAVE / 'qa.log').read_text()
    for key in ['tests', 'pass', 'fail', 'skipped']:
        qa[key] = int(re.findall(r'^(?:#|ℹ) ' + key + r' (\d+)$', qa_log, re.M)[-1])
    assert qa['exitCode'] == 0 and qa['tests'] == qa['pass'] >= 432 and qa['fail'] == qa['skipped'] == 0
    assert 'Standalone ready: dist-combat/' in qa_log and 'copied combat -> dist/combat' in qa_log
    qa['bothBuildsPassed'] = True
    write(WAVE / 'qa-result.json', qa)
    canvas = read(WAVE / 'canvas/canvas-review.json')
    assert canvas['complete'] and canvas['counts']['drawChecks'] == 60 and canvas['counts']['missing'] == 0
    for file, digest in canvas['sources'].items():
        assert sha(ROOT / file) == digest, 'Canvas source changed: ' + file
    integrity = read(WAVE / 'build-integrity.json')
    assert integrity['status'] == 'passed' and integrity['nativeAssetComparisons'] == 66
    visual = read(WAVE / 'canvas/visual-review.json')
    assert visual['status'] == 'accepted_with_stated_scope'
    assert visual['canvasReportSHA256'] == sha(WAVE / 'canvas/canvas-review.json')
    for artifact in visual['reviewedArtifacts']:
        assert sha(ROOT / artifact['file']) == artifact['sha256'], 'Reviewed artifact changed'
    browser = read(WAVE / 'browser-review/browser-review.json')
    assert browser['status'] == 'not_executed' and browser['successfulChecks'] == 0
    completion = read(WAVE / 'cafe/generation-completion.json')
    assert completion['status'] == 'complete_active' and completion['counts']['nativePngs'] == 33
    for file, digest in integrity['sources'].items():
        assert sha(ROOT / file) == digest, 'Source changed after verification: ' + file
    names = ['runtime-counts.json', 'qa-result.json', 'build-integrity.json',
        'cafe/generation-completion.json', 'cafe/integration-proof.json', 'canvas/canvas-review.json',
        'browser-review/browser-review.json', 'root-visual-review.json']
    value = {'schema': 'encore-continuation-c-verification/v1', 'status': 'passed_with_documented_limits',
        'createdAt': datetime.now(timezone.utc).isoformat(), 'counts': runtime, 'runtimeCounts': runtime,
        'generation': {'manifest': 'cafe/generation-completion.json',
            'manifestSHA256': sha(WAVE / 'cafe/generation-completion.json'), **completion['counts']},
        'qa': qa, 'canvas': canvas['counts'],
        'integrity': {k: v for k, v in integrity.items() if k not in ['copies', 'sources']},
        'browser': browser, 'visualReview': report(WAVE / 'canvas/visual-review.json'),
        'reports': {file: report(WAVE / file) for file in names}, 'sources': sources(),
        'limitations': ['Official commercial outfits adapted into original static fan-game poses; no 1:1 certification.',
            'Eleven static images per family do not constitute complete animation cycles.',
            'Local Chromium failed before navigation; no browser or physical-device success claimed.']}
    write(WAVE / 'verification.json', value)
    print(json.dumps({'status': value['status'], 'qa': qa, 'canvas': value['canvas']}))
else:
    raise SystemExit('Expected counts, integrity or summary')
