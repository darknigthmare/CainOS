#!/usr/bin/env python3
"""Execute and archive the concrete checks for Café, NPC crossovers and Barnoir."""
import hashlib
import json
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/next-wave-20261120'
NPC = ROOT / 'docs/art-generation/npc-crossovers-next-wave-20261120'
CAFE = ROOT / 'docs/art-generation/cast-next-wave-20261120'
STAGE = ROOT / 'docs/art-generation/stage-next-wave-20261120'
BASE = '570fdb31512cdd2a2d5ba5e2c26d7c10b47ae063'
IDS = ['caferibbit'] + ['glitch-murderdrones-ribbit-' + s for s in ['hommage','resident','fusion']]
MODULES = ['combat/data.mjs','combat/costume-additions.mjs','combat/costume-next-wave-20261120.mjs',
    'combat/crossovers.mjs','combat/crossover-npc-additions.mjs','combat/illustrations.mjs',
    'combat/render.mjs','combat/render-poses.mjs','combat/offline-manifest.mjs',
    'combat/fidelity.mjs','combat/audio.mjs','combat/audio-ambiences.mjs',
    'combat/progression.mjs','combat/stories.mjs','combat/render-stage-motion.mjs',
    'combat/stage-parallax.mjs','combat/engine.mjs','combat/session.mjs']
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text())


def write(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


def sources():
    return {name: sha(ROOT / name) for name in MODULES}


def run(command, log, timeout=900):
    start, then = datetime.now(timezone.utc).isoformat(), time.monotonic()
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open('w') as stream:
        try:
            code = subprocess.run(command, cwd=ROOT, stdout=stream, stderr=subprocess.STDOUT, timeout=timeout).returncode
        except subprocess.TimeoutExpired:
            code = 124
            stream.write('\nVerification timeout recorded.\n')
    return {'command': command, 'startedAt': start, 'endedAt': datetime.now(timezone.utc).isoformat(),
        'elapsedSeconds': round(time.monotonic()-then, 3), 'exitCode': code,
        'log': str(log.relative_to(ROOT)), 'sources': sources()}


mode = sys.argv[1]
if mode == 'collect':
    cafe, npc = read(CAFE/'generation-completion.json'), read(NPC/'generation-completion.json')
    appearances = cafe['appearances'] + npc['appearances']
    assert [a['id'] for a in appearances] == IDS
    rows = [row for a in appearances for row in a['files']]
    assert len(rows) == 44 and len({r['sha256'] for r in rows}) == 44
    for row in rows:
        assert sha(ROOT/row['file']) == row['sha256'] == sha(ROOT/row['archiveFile'])
        receipt = read(ROOT/row['receiptFile'])
        assert receipt['status'] == 'accepted_native' and receipt['visualReview']['status'] == 'accepted'
    result = {'schema':'encore-next-wave-completion/v1','status':'complete_active',
        'createdAt':datetime.now(timezone.utc).isoformat(),'order':IDS,'slots':npc['slots'],
        'appearances':appearances,'counts':{'families':4,'nativePNG':44,'bytes':sum(r['bytes'] for r in rows)},
        'sourceManifests':{str(p.relative_to(ROOT)):sha(p) for p in [CAFE/'generation-completion.json',NPC/'generation-completion.json']},
        'scope':'One officially illustrated café outfit adapted for the game; three original crossover designs. No canonical 1:1 or complete animation certification.'}
    write(WAVE/'generation-completion.json', result)
    write(WAVE/'asset-inventory.json', {'assets':rows})
    print(json.dumps(result['counts']))
elif mode == 'qa':
    result = run(['npm','run','qa'], WAVE/'qa.log')
    log = (WAVE/'qa.log').read_text()
    result['testSummary'] = {key:int(re.findall(r'^(?:#|ℹ) '+key+r' (\d+)$',log,re.M)[-1])
        for key in ['tests','pass','fail','skipped'] if re.findall(r'^(?:#|ℹ) '+key+r' (\d+)$',log,re.M)}
    result['bothBuildsPassed'] = result['exitCode'] == 0
    write(WAVE/'qa-result.json', result)
    print(json.dumps(result, ensure_ascii=False))
    sys.exit(result['exitCode'])
elif mode == 'canvas':
    results = []
    for ident in IDS:
        output = WAVE/'review'/ident
        flag = '--costume-additions' if ident == 'caferibbit' else '--crossovers'
        result = run(['node','--expose-gc','scripts/render-combat-character-review.mjs',flag,
            '--appearance',ident,'--output',str(output),'--report','docs/COMBAT_NEXT_WAVE_2026-11-20.md'], output/'render.log',180)
        assert result['exitCode'] == 0, result
        report = read(output/'character-canvas-review.json')
        assert report['complete'] and report['counts'].get('aliasedActions',0) == 0
        results.append({'id':ident,'run':result,'counts':report['counts'],'complete':report['complete'],
            'report':str((output/'character-canvas-review.json').relative_to(ROOT))})
        print(json.dumps({'id':ident,'counts':report['counts']}),flush=True)
    result = {'schema':'encore-next-wave-canvas-summary/v1','complete':all(r['complete'] for r in results),
        'counts':{key:sum(r['counts'].get(key,0) for r in results) for key in ['appearances','actions','stances','drawChecks','portraits','missing','aliasedActions']},
        'runs':results,'sources':sources(),'method':'Production Canvas2D renderer under native Skia, with exact decoded sources; no browser interaction.'}
    write(WAVE/'canvas-summary.json',result)
    print(json.dumps(result['counts']))
elif mode == 'counts':
    code = """
import {FIGHTERS,MOVES,COSTUMES,COSTUME_ADDITIONS,CROSSOVER_COSTUMES,STAGES,DEDICATED_STAGES,ARCHIVE} from './combat/data.mjs';
import {ART_FILES,ART_BYTES,CORE_FILES,ART_VERSION,OFFLINE_VERSION} from './combat/offline-manifest.mjs';
const ownerCount=id=>CROSSOVER_COSTUMES.filter(c=>c.fighterId===id).length;
console.log(JSON.stringify({fighters:FIGHTERS.length,techniques:MOVES.length,costumes:COSTUMES.length,
additionalAppearances:COSTUME_ADDITIONS.length,crossovers:CROSSOVER_COSTUMES.length,
fullyCoveredCrossoverFighters:FIGHTERS.filter(f=>ownerCount(f.id)===27).length,
partiallyCoveredCrossoverFighters:FIGHTERS.filter(f=>ownerCount(f.id)>0 && ownerCount(f.id)<27).length,
fightersWithoutCrossovers:FIGHTERS.filter(f=>ownerCount(f.id)===0).length,
crossoverDrawings:ART_FILES.filter(f=>f.includes('/crossovers/')).length,
stages:STAGES.length,dedicatedArrangements:DEDICATED_STAGES.length,archive:ARCHIVE.length,
offlineImages:ART_FILES.length,offlineBytes:ART_BYTES,coreFiles:CORE_FILES.length,artVersion:ART_VERSION,offlineVersion:OFFLINE_VERSION}));
"""
    result = json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))
    expected = {'fighters':54,'techniques':540,'costumes':472,'additionalAppearances':40,'crossovers':381,
        'fullyCoveredCrossoverFighters':14,'partiallyCoveredCrossoverFighters':1,'fightersWithoutCrossovers':39,
        'crossoverDrawings':3814,'stages':24,'dedicatedArrangements':54,'archive':179,'offlineImages':5816}
    for key,value in expected.items():
        assert result[key] == value,(key,result[key],value)
    write(WAVE/'runtime-counts.json',result)
    print(json.dumps(result))
elif mode == 'integrity':
    complete = read(WAVE/'generation-completion.json')
    rows = [row for appearance in complete['appearances'] for row in appearance['files']]
    stage_rows = read(STAGE/'asset-inventory.json')
    if isinstance(stage_rows,dict):
        stage_rows = stage_rows['assets']
    assert len(rows) == 44 and len(stage_rows) == 3
    copies = []
    for build in ['dist','dist-combat']:
        for row in rows+stage_rows:
            filename = row.get('file') or row.get('activePath') or row['path']
            assert sha(ROOT/filename) == row['sha256'] == sha(ROOT/build/filename),(build,filename)
            copies.append({'build':build,'file':filename,'sha256':row['sha256']})
        for filename in MODULES:
            assert (ROOT/build/filename).read_bytes() == (ROOT/filename).read_bytes(),(build,filename)
    historical = read(NPC/'historical-assets.json')
    assert historical['baseCommit'] == BASE and historical['count'] == 5725
    for row in historical['files']:
        assert sha(ROOT/row['file']) == row['sha256'],row['file']
    preserved = {}
    for filename in ['combat/engine.mjs','combat/session.mjs','combat/stories.mjs','combat/stage-parallax.mjs']:
        original = subprocess.check_output(['git','show',BASE+':'+filename],cwd=ROOT)
        assert original == (ROOT/filename).read_bytes(),filename
        preserved[filename] = sha(ROOT/filename)
    result = {'schema':'encore-next-wave-build-integrity/v1','status':'passed','complete':True,
        'baseCommit':BASE,'newNativePNG':47,'newNativeBytes':sum(r['bytes'] for r in rows+stage_rows),
        'nativeBuildCopies':len(copies),'copies':copies,'moduleComparisons':len(MODULES)*2,
        'nativeAssetComparisons':len(copies),'costumeComparisons':len(rows)*2,'stageComparisons':len(stage_rows)*2,
        'historicalAssetsCompared':historical['count'],'historicalAssetsUnchanged':True,
        'historicalEncoreFilesVerified':historical['count'],
        'preservedRuntimeModules':preserved,'sources':sources()}
    write(WAVE/'build-integrity.json',result)
    print(json.dumps({k:v for k,v in result.items() if k not in ['copies','sources']}))
elif mode == 'summary':
    names=['generation-completion','runtime-counts','qa-result','canvas-summary','build-integrity']
    reports={name:read(WAVE/(name+'.json')) for name in names}
    assert reports['qa-result']['exitCode'] == 0
    assert reports['canvas-summary']['complete'] and reports['build-integrity']['complete']
    visual, independent = read(WAVE/'visual-review.json'), read(WAVE/'independent-visual-review.json')
    assert visual['status'] == 'accepted_with_stated_scope'
    assert independent['status'] == 'accepted_with_stated_scope'
    result={'schema':'encore-next-wave-verification/v1','status':'local_qa_canvas_and_integrity_passed_browser_not_reexecuted',
        'createdAt':datetime.now(timezone.utc).isoformat(),'counts':reports['runtime-counts'],
        'runtimeCounts':reports['runtime-counts'],
        'generation':{'manifest':'generation-completion.json','manifestSha256':sha(WAVE/'generation-completion.json'),
            **reports['generation-completion']['counts']},
        'qa':reports['qa-result']['testSummary'],'bothBuildsPassed':True,
        'canvas':reports['canvas-summary']['counts'],
        'integrity':{k:v for k,v in reports['build-integrity'].items() if k not in ['copies','sources']},
        'reports':{name:{'file':str((WAVE/(name+'.json')).relative_to(ROOT)),'sha256':sha(WAVE/(name+'.json'))} for name in names},
        'stageReport':str((STAGE/'verification.json').relative_to(ROOT)),
        'visualReview':{'evidence':'visual-review.json','sha256':sha(WAVE/'visual-review.json'),
            'independentEvidence':'independent-visual-review.json','independentSha256':sha(WAVE/'independent-visual-review.json')},
        'browser':{'status':'not_executed_final_manifest','assertionsExecuted':0,
            'stageAttempt':'docs/art-generation/stage-next-wave-20261120/browser-result.json',
            'scope':'Current stage attempt stopped before navigation; no successful final browser run or physical-device test claimed.'},
        'canonicalFidelity':'Café references qualified; crossover bodies, poses and three-digit harmonization are original game designs. No 1:1 or complete animation certification.',
        'sources':sources()}
    write(WAVE/'verification.json',result)
    print(json.dumps({'status':result['status'],'qa':result['qa'],'canvas':result['canvas'],'counts':result['counts']}))
else:
    raise SystemExit('Expected collect, qa, canvas, counts, integrity or summary')
