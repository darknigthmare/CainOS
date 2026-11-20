#!/usr/bin/env python3
"""Capture executed checks for the two Ribbit appearances, without image edits."""
import hashlib
import http.server
import json
import os
import re
import subprocess
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/cast-ribbit-20261120'
MODULES = ['combat/data.mjs', 'combat/costume-additions.mjs', 'combat/costume-ribbit-20261120.mjs',
           'combat/illustrations.mjs', 'combat/render.mjs', 'combat/render-poses.mjs', 'combat/offline-manifest.mjs']
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def write(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')
def sources():
    return {name: sha(ROOT / name) for name in MODULES}
def run(command, log, env=None, timeout=900):
    start = datetime.now(timezone.utc).isoformat()
    then = time.monotonic()
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open('w') as stream:
        try:
            code = subprocess.run(command, cwd=ROOT, env=env, stdout=stream, stderr=subprocess.STDOUT, timeout=timeout).returncode
        except subprocess.TimeoutExpired:
            code = 124
            stream.write('\nRecorded verification timeout.\n')
    return {'command': command, 'startedAt': start, 'endedAt': datetime.now(timezone.utc).isoformat(),
            'elapsedSeconds': round(time.monotonic() - then, 3), 'exitCode': code,
            'log': str(log.relative_to(ROOT)), 'sources': sources()}

mode = sys.argv[1]
if mode == 'qa':
    result = run(['npm', 'run', 'qa'], WAVE / 'qa.log')
    log = (WAVE / 'qa.log').read_text()
    result['testSummary'] = {key: int(re.findall(r'^(?:#|ℹ) ' + key + r' (\d+)$', log, re.M)[-1])
        for key in ['tests', 'pass', 'fail', 'skipped'] if re.findall(r'^(?:#|ℹ) ' + key + r' (\d+)$', log, re.M)}
    result['bothBuildsPassed'] = result['exitCode'] == 0
    write(WAVE / 'qa-result.json', result)
    print(json.dumps(result, ensure_ascii=False))
    sys.exit(result['exitCode'])
elif mode == 'canvas':
    results = []
    for ident in ['animeribbit', 'jaxsuitribbit']:
        out = WAVE / 'review' / ident
        result = run(['node', 'scripts/render-combat-character-review.mjs', '--costume-additions',
                      '--appearance', ident, '--output', str(out), '--report',
                      'docs/COMBAT_RIBBIT_CONTINUATION_2026-11-20.md'], out / 'render.log', timeout=180)
        assert result['exitCode'] == 0, result
        report = json.loads((out / 'character-canvas-review.json').read_text())
        results.append({'id': ident, 'run': result, 'counts': report['counts'], 'complete': report['complete'],
                        'report': str((out / 'character-canvas-review.json').relative_to(ROOT))})
        print(json.dumps({'id': ident, 'counts': report['counts']}), flush=True)
    summary = {'schema': 'encore-ribbit-canvas-summary/v1', 'complete': all(r['complete'] for r in results),
               'counts': {key: sum(r['counts'][key] for r in results) for key in
                          ['appearances', 'actions', 'stances', 'drawChecks', 'portraits', 'missing']},
               'runs': results, 'sources': sources(),
               'method': 'Production Canvas2D renderer under native Skia; no browser interaction.'}
    write(WAVE / 'canvas-summary.json', summary)
    print(json.dumps(summary['counts']))
elif mode == 'browser':
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw): super().__init__(*a, directory=str(ROOT), **kw)
        def log_message(self, *a): pass
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    env = os.environ.copy()
    env['COMBAT_TEST_URL'] = 'http://127.0.0.1:' + str(server.server_address[1])
    env['COMBAT_ACTION_ART_APPEARANCES'] = 'animeribbit,jaxsuitribbit'
    env['COMBAT_ACTION_ART_OUTPUT'] = str(WAVE / 'browser')
    if Path('/usr/bin/chromium').is_file(): env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'] = '/usr/bin/chromium'
    try:
        result = run(['node', 'tests/combat-action-art-browser.mjs'], WAVE / 'browser.log', env=env)
    finally:
        server.shutdown()
        server.server_close()
    log = (WAVE / 'browser.log').read_text()
    result['successfulChecks'] = len(re.findall(r'^PASS ', log, re.M))
    result['scope'] = ['animeribbit', 'jaxsuitribbit']
    result['status'] = ('passed' if result['exitCode'] == 0 else
                        'environment_blocked_before_navigation' if 'Operation not permitted' in log and result['successfulChecks'] == 0 else 'failed')
    write(WAVE / 'browser-result.json', result)
    print(json.dumps(result, ensure_ascii=False))
    sys.exit(result['exitCode'])
elif mode == 'integrity':
    completion = json.loads((WAVE / 'generation-completion.json').read_text())
    rows = [row for appearance in completion['appearances'] for row in appearance['files']]
    copies = []
    for build in ['dist', 'dist-combat']:
        for row in rows:
            assert sha(ROOT / build / row['file']) == row['sha256'], (build, row['file'])
            copies.append({'build': build, 'file': row['file'], 'sha256': row['sha256']})
        for name in MODULES:
            assert (ROOT / build / name).read_bytes() == (ROOT / name).read_bytes(), (build, name)
    previous = subprocess.check_output(['git', 'ls-tree', '-r', 'f7b3b9a', '--', 'assets/encore'], cwd=ROOT, text=True)
    historical = [(line.split('\t', 1)[1], line.split('\t', 1)[0].split()[2]) for line in previous.splitlines()]
    hashes = subprocess.check_output(['git', 'hash-object', '--stdin-paths'], cwd=ROOT,
        input=''.join(name + '\n' for name, _ in historical), text=True).splitlines()
    assert len(hashes) == len(historical)
    for (name, expected), actual in zip(historical, hashes): assert actual == expected, name
    result = {'status': 'passed', 'nativeAssetComparisons': len(copies), 'moduleComparisons': 2 * len(MODULES),
              'historicalEncoreFilesVerified': len(historical), 'copies': copies, 'sources': sources()}
    write(WAVE / 'build-integrity.json', result)
    print(json.dumps({k:v for k,v in result.items() if k not in ['copies','sources']}))
else:
    raise SystemExit('Expected qa, canvas, browser or integrity')
