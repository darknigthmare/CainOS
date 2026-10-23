/**
 * Package a verified Encore build; no repository write credential is used here.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { GAME_VERSION } from '../combat/session.mjs';
const root=process.cwd(), evidencePath=path.join(root,'audit-combat/ci/evidence-0.7.0.json');
const evidence=JSON.parse(await fs.readFile(evidencePath,'utf8'));
assert.equal(GAME_VERSION,'0.7.0');
assert.equal(evidence.gameVersion,GAME_VERSION);
assert.equal(evidence.pass,true,'Only a fully verified runtime may be packaged.');
assert.equal(evidence.runtimeUnchangedDuringTests,true);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const [file,expected] of Object.entries(evidence.runtimeSourceHashes)) assert.equal(sha(await fs.readFile(file)),expected,'Runtime changed: '+file);
execFileSync('python3',['scripts/build-combat-workbook-delta.py','--repo-root',root,'--evidence',evidencePath],{stdio:'inherit'});
const verification=JSON.parse(await fs.readFile('docs/combat-workbook-verification.json','utf8'));
assert.equal(verification.gameVersion,GAME_VERSION,'Workbook and game version differ.');
execFileSync(process.execPath,['scripts/build-combat.mjs'],{stdio:'inherit'});
const bundle=path.join(root,'dist-combat'),release=path.join(root,'release'),generated=path.join(root,'audit-combat/generated-files');
await fs.mkdir(release,{recursive:true}); await fs.mkdir(generated,{recursive:true});
await fs.cp(path.join(root,'docs'),path.join(bundle,'docs'),{recursive:true});
const launcher=[
  '#!/usr/bin/env python3',
  '"""Serve Encore over loopback HTTP; requires Python 3 and a modern browser."""',
  'from functools import partial',
  'from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler',
  'from pathlib import Path',
  'import argparse',
  'import threading',
  'import webbrowser',
  'parser = argparse.ArgumentParser(description="Digital Circus — Encore 0.7.0")',
  'parser.add_argument("--port", type=int, default=4178)',
  'args = parser.parse_args()',
  'directory = Path(__file__).resolve().parent',
  'handler = partial(SimpleHTTPRequestHandler, directory=str(directory))',
  'try:',
  '    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)',
  'except OSError as error:',
  '    raise SystemExit("Port indisponible. Relancer avec --port 4180. " + str(error))',
  'url = "http://127.0.0.1:%d/combat/index.html?standalone=1" % args.port',
  'print("Encore : " + url + "\\nCtrl+C pour arrêter le serveur.")',
  'threading.Timer(0.5, lambda: webbrowser.open(url)).start()',
  'try:',
  '    server.serve_forever()',
  'except KeyboardInterrupt:',
  '    pass',
  'finally:',
  '    server.server_close()',''
].join('\n');
await fs.writeFile(path.join(bundle,'LANCER_ENCORE.py'),launcher);
await fs.writeFile(path.join(bundle,'LANCER_ENCORE.sh'),'#!/usr/bin/env sh\nset -eu\ncd "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"\nexec python3 LANCER_ENCORE.py "$@"\n');
await fs.writeFile(path.join(bundle,'LANCER_ENCORE.cmd'),'@echo off\r\ncd /d "%~dp0"\r\nwhere py >nul 2>nul\r\nif %errorlevel%==0 (\r\n  py -3 LANCER_ENCORE.py %*\r\n) else (\r\n  python LANCER_ENCORE.py %*\r\n)\r\npause\r\n');
await fs.chmod(path.join(bundle,'LANCER_ENCORE.sh'),0o755);await fs.chmod(path.join(bundle,'LANCER_ENCORE.py'),0o755);
const readme=[
  'DIGITAL CIRCUS — ENCORE 0.7.0','',
  'Décompresser entièrement cette archive avant de lancer le jeu.',
  'Windows : LANCER_ENCORE.cmd ; macOS/Linux : sh LANCER_ENCORE.sh.',
  'Python 3 et un navigateur moderne sont nécessaires. Le serveur reste local.',
  'Autre méthode : python3 LANCER_ENCORE.py --port 4180.',
  'Le double-clic sur index.html ne charge pas les modules : utiliser le lanceur.','',
  '0.7.0 ajoute 42 finales de spectacle et 12 ambiances sonores procédurales.',
  'Dans le Codex, ouvrir les finales puis choisir un tableau ou une tenue.',
  'Réglages : finales, ambiances et volume indépendant ; mouvement réduit pris en compte.',
  'Les règles de simulation restent 0.5 ; replays 0.1 à 0.7 compatibles.','',
  'Le fichier docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx contient le suivi détaillé.',
  'Les preuves sont dans docs/combat-qa-evidence-0.7.0.json.',
  'Les finales sont des adaptations Encore avec les dessins existants.',
  'La fidélité canonique générale 1:1 et les dessins de combat dédiés restent ouverts.','',
  'Validation : CI Linux, Node et Chromium. Les lanceurs Windows/macOS ne sont',
  'pas présentés comme testés sur ces systèmes ni comme des paquets natifs.',
  'Téléphone et manettes physiques restent à vérifier.','',
  'Hors ligne : dans les Réglages, télécharger complètement le spectacle avant',
  'de couper le réseau. Garder le même hôte et le même port pour retrouver le profil.',
  'Exporter le profil avant de changer de navigateur, de domaine ou de port.',''
].join('\n');
await fs.writeFile(path.join(bundle,'LIRE-MOI.txt'),readme);await fs.writeFile(path.join(release,'LIRE-MOI.txt'),readme);
execFileSync('python3',['-c','import ast,pathlib; ast.parse(pathlib.Path("dist-combat/LANCER_ENCORE.py").read_text())'],{stdio:'inherit'});
execFileSync('sh',['-n',path.join(bundle,'LANCER_ENCORE.sh')],{stdio:'inherit'});
const copies=[
  ['docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx','docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx'],
  ['docs/combat-tracker-data.json','docs/combat-tracker-data.json'],
  ['docs/combat-workbook-verification.json','docs/combat-workbook-verification.json'],
  ['docs/combat-qa-evidence-0.7.0.json','docs/combat-qa-evidence-0.7.0.json'],
  ['combat/offline-manifest.mjs','combat/offline-manifest.mjs'],
  ['audit-combat/finishers-0.7.0/contact-sheet-1.jpg','docs/images/finishers-0.7.0-a.jpg'],
  ['audit-combat/finishers-0.7.0/contact-sheet-2.jpg','docs/images/finishers-0.7.0-b.jpg']
];
const generatedFiles=[];
for(const [source,target] of copies){
  const data=await fs.readFile(source),destination=path.join(generated,target);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,data);
  generatedFiles.push({path:target,bytes:data.length,sha256:sha(data)});
  if(target.startsWith('docs/images/')){const copy=path.join(bundle,target);await fs.mkdir(path.dirname(copy),{recursive:true});await fs.writeFile(copy,data);}
}
for(const [file,expected] of Object.entries(evidence.runtimeSourceHashes)){
  assert.equal(sha(await fs.readFile(file)),expected,'Packaging altered the runtime: '+file);
  assert.equal(sha(await fs.readFile(path.join(bundle,file))),expected,'Standalone differs: '+file);
}
await fs.copyFile('docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx',path.join(release,'DIGITAL_CIRCUS_COMBAT_TRACKER_0.7.0.xlsx'));
const archive=path.join(release,'Digital_Circus_Encore_0.7.0.zip');
const zipper=[
  'from pathlib import Path',
  'from zipfile import ZipFile, ZIP_DEFLATED',
  'import sys',
  'root = Path(sys.argv[1]); destination = Path(sys.argv[2])',
  'with ZipFile(destination, "w", compression=ZIP_DEFLATED, compresslevel=6) as output:',
  '    for file in sorted(root.rglob("*")):',
  '        if file.is_file(): output.write(file, Path("Digital_Circus_Encore_0.7.0") / file.relative_to(root))',
  'with ZipFile(destination) as result:',
  '    bad = result.testzip()',
  '    if bad: raise RuntimeError("Archive corrompue: " + bad)',
  '    names = result.namelist()',
  '    for name in ["combat/app.mjs", "LANCER_ENCORE.py", "LANCER_ENCORE.sh", "LANCER_ENCORE.cmd", "docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx"]:',
  '        assert "Digital_Circus_Encore_0.7.0/" + name in names, name',
  'print("Archive verified:", len(names), "files")'
].join('\n');
execFileSync('python3',['-c',zipper,bundle,archive],{stdio:'inherit'});
const files=[];
for(const name of ['Digital_Circus_Encore_0.7.0.zip','DIGITAL_CIRCUS_COMBAT_TRACKER_0.7.0.xlsx']){
  const data=await fs.readFile(path.join(release,name));files.push({file:name,bytes:data.length,sha256:sha(data)});
}
const delivery={
  schema:'encore-release/v1',gameVersion:GAME_VERSION,sourceCommit:evidence.sourceCommit,runUrl:evidence.runUrl,generatedAt:new Date().toISOString(),
  files,generatedFiles,tests:evidence.totals,runtimeSourceHashes:evidence.runtimeSourceHashes,
  packaging:{archiveIntegrity:true,standaloneRuntimeIdentical:true,pythonLauncherParsed:true,posixLauncherSyntax:true,nativeWindowsTested:false,nativeMacOSTested:false},
  limits:['Finales et audio procéduraux Encore ; fidélité canonique générale 1:1 non certifiée.','Téléphone et manettes physiques non testés dans cette CI.']
};
await fs.writeFile(path.join(release,'delivery-0.7.0.json'),JSON.stringify(delivery,null,2)+'\n');
await fs.writeFile('audit-combat/ci/delivery-0.7.0.json',JSON.stringify(delivery,null,2)+'\n');
await fs.writeFile(path.join(release,'SHA256SUMS.txt'),files.map(row=>row.sha256+'  '+row.file).join('\n')+'\n');
console.log('ENCORE_DELIVERY '+JSON.stringify(delivery));
