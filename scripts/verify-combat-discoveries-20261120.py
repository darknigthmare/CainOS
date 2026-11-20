#!/usr/bin/env python3
import hashlib, http.server, json, os, re, subprocess, sys, threading, time
from datetime import datetime, timezone
from pathlib import Path
REPO=Path(__file__).resolve().parents[1]
WAVE=REPO/'docs/art-generation/cast-next-20261120'
def write(path,obj):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def sources():
    return {name:hashlib.sha256((REPO/name).read_bytes()).hexdigest() for name in [
      'combat/costume-additions.mjs','combat/costume-resumption-20261120.mjs',
      'combat/costume-discoveries-20261120.mjs','combat/offline-manifest.mjs',
      'tests/combat-costume-additions.test.mjs','scripts/render-combat-character-review.mjs']}
def run(command,log,env=None,timeout=None):
    start=datetime.now(timezone.utc).isoformat(); then=time.monotonic()
    log.parent.mkdir(parents=True,exist_ok=True)
    with log.open('w') as out:
        try:
            code=subprocess.run(command,cwd=REPO,stdout=out,stderr=subprocess.STDOUT,env=env,timeout=timeout).returncode
        except subprocess.TimeoutExpired:
            code=124; out.write('\nVerification exceeded the recorded time limit.\n')
    return dict(command=command,startedAt=start,endedAt=datetime.now(timezone.utc).isoformat(),
                elapsedSeconds=round(time.monotonic()-then,3),exitCode=code,log=str(log.relative_to(REPO)))
mode=sys.argv[1]
if mode=='qa':
    result=run(['npm','run','qa'],WAVE/'qa.log')
    log=(WAVE/'qa.log').read_text()
    # Node selects the TAP or spec reporter according to its runtime version.
    result['testSummary']={key:int(re.findall(r'^(?:#|ℹ) '+key+r' (\d+)$',log,re.M)[-1])
        for key in ['tests','pass','fail','skipped']
        if re.findall(r'^(?:#|ℹ) '+key+r' (\d+)$',log,re.M)}
    result['bothBuildsPassed']=result['exitCode']==0
    result['sources']=sources(); write(WAVE/'qa-result.json',result)
    print(json.dumps(result,ensure_ascii=False)); sys.exit(result['exitCode'])
elif mode=='browser':
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(REPO),**kwargs)
        def log_message(self,*args): pass
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),QuietHandler)
    thread=threading.Thread(target=server.serve_forever,daemon=True); thread.start()
    env=os.environ.copy(); env['COMBAT_TEST_URL']='http://127.0.0.1:'+str(server.server_address[1])
    if Path('/usr/bin/chromium').is_file(): env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH']='/usr/bin/chromium'
    try: result=run(['node','tests/combat-action-art-browser.mjs'],WAVE/'browser-action-art.log',env=env,timeout=900)
    finally: server.shutdown(); server.server_close()
    log=(WAVE/'browser-action-art.log').read_text()
    result['successfulChecks']=len(re.findall(r'^PASS ',log,re.M))
    result['status']='passed' if result['exitCode']==0 else ('environment_blocked_before_navigation' if 'Operation not permitted' in log and result['successfulChecks']==0 else 'failed')
    result['sources']=sources(); write(WAVE/'browser-result.json',result)
    print(json.dumps(result,ensure_ascii=False)); sys.exit(result['exitCode'])
elif mode=='canvas':
    completion=json.loads((WAVE/'generation-completion.json').read_text()); results=[]
    for ident in completion['order']:
        directory=WAVE/'review'/ident
        result=run(['node','scripts/render-combat-character-review.mjs','--costume-additions','--introduced-on','2026-11-20','--appearance',ident,'--output',str(directory),'--report','docs/COMBAT_CAST_DISCOVERIES_2026-11-20.md'],directory/'render.log',timeout=180)
        if result['exitCode']:
            write(WAVE/'canvas-failure.json',result); print(json.dumps(result)); sys.exit(result['exitCode'])
        report=json.loads((directory/'character-canvas-review.json').read_text())
        results.append(dict(id=ident,run=result,counts=report['counts'],complete=report['complete'],report=str((directory/'character-canvas-review.json').relative_to(REPO))))
        print(json.dumps({'id':ident,'counts':report['counts'],'complete':report['complete']}),flush=True)
    summary=dict(schema='encore-catalog-canvas-summary/v1',createdAt=datetime.now(timezone.utc).isoformat(),
      method='Production Canvas2D modules executed under native Skia, separately for each appearance.',
      counts={key:sum(r['counts'][key] for r in results) for key in ['appearances','expectedActions','actions','stances','drawChecks','portraits','expectedPortraits','missing']},
      complete=all(r['complete'] for r in results),runs=results,sources=sources(),
      limitations=['Not a browser test or frame-by-frame animation review.','Visual fidelity is reviewed separately against the named merchandise reference.'])
    write(WAVE/'canvas-summary.json',summary); print(json.dumps({'complete':summary['complete'],'counts':summary['counts']}))
elif mode=='integrity':
    completion=json.loads((WAVE/'generation-completion.json').read_text())
    files=[row for family in completion['appearances'] for row in family['files']]
    modules=['combat/data.mjs','combat/costume-additions.mjs',
      'combat/costume-continuation-20261120.mjs','combat/costume-resumption-20261120.mjs',
      'combat/costume-discoveries-20261120.mjs','combat/illustrations.mjs',
      'combat/render.mjs','combat/render-poses.mjs','combat/offline-manifest.mjs']
    copies=[]
    for build in ['dist','dist-combat']:
        for row in files:
            target=REPO/build/row['file']
            data=target.read_bytes()
            assert hashlib.sha256(data).hexdigest()==row['sha256'], target
            copies.append(dict(build=build,file=row['file'],sha256=row['sha256'],bytes=len(data)))
        for name in modules:
            assert (REPO/build/name).read_bytes()==(REPO/name).read_bytes(), (build,name)
    preserved=json.loads((WAVE/'preserved-tracker-and-checkpoints.json').read_text())
    for row in preserved['files']:
        assert hashlib.sha256((REPO/row['file']).read_bytes()).hexdigest()==row['sha256'], row['file']
    tree=subprocess.check_output(['git','ls-tree','-r',completion['baseCommit'],'--','assets/encore'],cwd=REPO,text=True)
    historical=[(line.split('\t',1)[1],line.split('\t',1)[0].split()[2]) for line in tree.splitlines()]
    hashes=subprocess.check_output(['git','hash-object','--stdin-paths'],cwd=REPO,
        input=''.join(name+'\n' for name,_ in historical),text=True).splitlines()
    assert len(hashes)==len(historical)
    for (name,expected),actual in zip(historical,hashes):
        assert actual==expected, ('Historical asset changed',name)
    result=dict(schema='encore-catalog-build-integrity/v1',createdAt=datetime.now(timezone.utc).isoformat(),
        status='passed',nativeAssetComparisons=len(copies),moduleComparisons=2*len(modules),
        historicalEncoreFilesVerified=len(historical),trackerAndCheckpointsVerified=len(preserved['files']),
        copies=copies,sources=sources())
    write(WAVE/'build-integrity.json',result)
    print(json.dumps({key:value for key,value in result.items() if key not in ['copies','sources']}))
else: raise SystemExit('Expected qa, browser, canvas or integrity')
