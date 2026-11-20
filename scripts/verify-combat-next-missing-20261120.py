#!/usr/bin/env python3
"""Record executed checks for four costumes and Undermap, without editing artwork."""
import hashlib
import json
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/cast-next-missing-20261120'
STAGE = ROOT / 'docs/art-generation/stage-next-missing-20261120'
BASE = '3858f03bba652fa56bdf422b5566dea86dbdcb9b'
IDS = ['watermelongangle', 'aquablasterpomni', 'ptocaine', 'freakjax']
MODULES = [
    'combat/data.mjs', 'combat/costume-additions.mjs', 'combat/costume-next-missing-20261120.mjs',
    'combat/illustrations.mjs', 'combat/render.mjs', 'combat/render-poses.mjs',
    'combat/offline-manifest.mjs', 'combat/fidelity.mjs', 'combat/audio.mjs',
    'combat/audio-ambiences.mjs', 'combat/progression.mjs', 'combat/stories.mjs',
    'combat/render-stage-motion.mjs', 'combat/stage-parallax.mjs',
    'combat/engine.mjs', 'combat/session.mjs',
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


def sources():
    return {name: sha(ROOT / name) for name in MODULES}


def run(command, log, timeout=900):
    start = datetime.now(timezone.utc).isoformat()
    then = time.monotonic()
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open('w') as stream:
        try:
            code = subprocess.run(command, cwd=ROOT, stdout=stream,
                                  stderr=subprocess.STDOUT, timeout=timeout).returncode
        except subprocess.TimeoutExpired:
            code = 124
            stream.write('\nRecorded verification timeout.\n')
    return {'command': command, 'startedAt': start,
            'endedAt': datetime.now(timezone.utc).isoformat(),
            'elapsedSeconds': round(time.monotonic() - then, 3), 'exitCode': code,
            'log': str(log.relative_to(ROOT)), 'sources': sources()}


mode = sys.argv[1]
if mode == 'qa':
    result = run(['npm', 'run', 'qa'], WAVE / 'qa.log')
    log = (WAVE / 'qa.log').read_text()
    result['testSummary'] = {key: int(re.findall(r'^(?:#|ℹ) ' + key + r' (\d+)$', log, re.M)[-1])
        for key in ['tests', 'pass', 'fail', 'skipped']
        if re.findall(r'^(?:#|ℹ) ' + key + r' (\d+)$', log, re.M)}
    result['bothBuildsPassed'] = result['exitCode'] == 0
    write(WAVE / 'qa-result.json', result)
    print(json.dumps(result, ensure_ascii=False))
    sys.exit(result['exitCode'])
elif mode == 'canvas':
    results = []
    for ident in IDS:
        out = WAVE / 'review' / ident
        result = run(['node', 'scripts/render-combat-character-review.mjs', '--costume-additions',
                      '--appearance', ident, '--output', str(out), '--report',
                      'docs/COMBAT_NEXT_MISSING_2026-11-20.md'], out / 'render.log', timeout=180)
        assert result['exitCode'] == 0, result
        report = json.loads((out / 'character-canvas-review.json').read_text())
        results.append({'id': ident, 'run': result, 'counts': report['counts'],
                        'complete': report['complete'],
                        'report': str((out / 'character-canvas-review.json').relative_to(ROOT))})
        print(json.dumps({'id': ident, 'counts': report['counts']}), flush=True)
    summary = {'schema': 'encore-next-missing-canvas-summary/v1',
               'complete': all(r['complete'] for r in results),
               'counts': {key: sum(r['counts'][key] for r in results) for key in
                          ['appearances', 'actions', 'stances', 'drawChecks', 'portraits', 'missing']},
               'runs': results, 'sources': sources(),
               'method': 'Production Canvas2D renderer under native Skia; no browser interaction.'}
    write(WAVE / 'canvas-summary.json', summary)
    print(json.dumps(summary['counts']))
elif mode == 'counts':
    command = """
import {FIGHTERS,MOVES,COSTUMES,COSTUME_ADDITIONS,STAGES,DEDICATED_STAGES,ARCHIVE} from './combat/data.mjs';
import {ART_FILES,ART_BYTES,CORE_FILES,ART_VERSION,OFFLINE_VERSION} from './combat/offline-manifest.mjs';
console.log(JSON.stringify({fighters:FIGHTERS.length,techniques:MOVES.length,costumes:COSTUMES.length,
  additionalAppearances:COSTUME_ADDITIONS.length,stages:STAGES.length,
  dedicatedArrangements:DEDICATED_STAGES.length,archive:ARCHIVE.length,offlineImages:ART_FILES.length,
  offlineBytes:ART_BYTES,coreFiles:CORE_FILES.length,artVersion:ART_VERSION,offlineVersion:OFFLINE_VERSION}));
"""
    result = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', command], cwd=ROOT, text=True))
    for key, expected in {'fighters': 54, 'techniques': 540, 'costumes': 468,
                          'additionalAppearances': 39, 'stages': 23,
                          'dedicatedArrangements': 54, 'archive': 179,
                          'offlineImages': 5769}.items():
        assert result[key] == expected, (key, result[key], expected)
    write(WAVE / 'runtime-counts.json', result)
    print(json.dumps(result))
elif mode == 'integrity':
    completion = json.loads((WAVE / 'generation-completion.json').read_text())
    rows = [row for appearance in completion['appearances'] for row in appearance['files']]
    assert len(rows) == 44
    stage_rows = json.loads((STAGE / 'asset-inventory.json').read_text())
    if isinstance(stage_rows, dict):
        stage_rows = stage_rows['assets']
    assert len(stage_rows) == 3
    all_rows = rows + stage_rows
    copies = []
    for build in ['dist', 'dist-combat']:
        for row in all_rows:
            filename = row.get('file') or row['activePath']
            assert sha(ROOT / filename) == row['sha256'], filename
            assert sha(ROOT / build / filename) == row['sha256'], (build, filename)
            copies.append({'build': build, 'file': filename, 'sha256': row['sha256']})
        for name in MODULES:
            assert (ROOT / build / name).read_bytes() == (ROOT / name).read_bytes(), (build, name)
    previous = subprocess.check_output(['git', 'ls-tree', '-r', BASE, '--', 'assets/encore'], cwd=ROOT, text=True)
    historical = [(line.split('\t', 1)[1], line.split('\t', 1)[0].split()[2]) for line in previous.splitlines()]
    hashes = subprocess.check_output(['git', 'hash-object', '--stdin-paths'], cwd=ROOT,
        input=''.join(name + '\n' for name, _ in historical), text=True).splitlines()
    assert len(hashes) == len(historical)
    for (name, expected), actual in zip(historical, hashes):
        assert actual == expected, name
    result = {'status': 'passed', 'baseCommit': BASE, 'nativeAssetComparisons': len(copies),
              'costumeComparisons': 2 * len(rows), 'stageComparisons': 2 * len(stage_rows),
              'moduleComparisons': 2 * len(MODULES),
              'historicalEncoreFilesVerified': len(historical), 'copies': copies, 'sources': sources()}
    write(WAVE / 'build-integrity.json', result)
    print(json.dumps({k: v for k, v in result.items() if k not in ['copies', 'sources']}))
else:
    raise SystemExit('Expected qa, canvas, counts or integrity')
