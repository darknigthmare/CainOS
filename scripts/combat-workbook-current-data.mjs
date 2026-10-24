/** Validate execution evidence and prepare the current tracker without editing XLSX. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { BROWSER_SUITES, browserSuiteLabel } from './combat-ci-suites.mjs';

export const TRACKER_SHEETS = Object.freeze({
  'Fonctionnalités':'features', 'Combattants':'roster', 'Techniques':'moves', 'Arènes':'stages',
  'Atlas':'atlas', 'Production':'production', 'Scénarios':'scenarios', 'QA':'qa',
});
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const QA_STATUSES = ['Réussi','Échec','Non exécuté','À vérifier'];
const hasValue = value => value !== null && value !== undefined && value !== '';

export async function prepareCurrentTracker({ root, priorData, evidence }) {
  root = path.resolve(root);
  const readModule = relative => import(pathToFileURL(path.join(root, relative)));
  const [content, session, finales, audio, ambience, offline] = await Promise.all([
    readModule('combat/data.mjs'), readModule('combat/session.mjs'), readModule('combat/finisher-catalog.mjs'),
    readModule('combat/audio.mjs'), readModule('combat/audio-ambiences.mjs'), readModule('combat/offline-manifest.mjs'),
  ]);
  const { GAME, FIGHTERS, MOVES, STAGES, VARIANTS, ROSTER_ARCHIVE } = content;
  assert.equal(GAME.version, '0.7.0'); assert.equal(session.GAME_VERSION, GAME.version);
  assert.equal(evidence.schema, 'encore-ci-evidence/v1'); assert.equal(evidence.gameVersion, GAME.version);
  assert.equal(evidence.pass, true, 'All configured suites must pass before publication');
  assert.equal(evidence.runtimeUnchangedDuringTests, true);
  assert.deepEqual(evidence.runtimeSourceHashesAfter, evidence.runtimeSourceHashes);
  assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(), evidence.sourceCommit, 'Evidence commit changed');
  const fileDigest = async relative => {
    const target = path.resolve(root, relative);
    assert(target.startsWith(root + path.sep), 'Source path escapes checkout');
    return sha256(await fs.readFile(target));
  };
  for (const [file, digest] of Object.entries(evidence.runtimeSourceHashes)) assert.equal(await fileDigest(file), digest, 'Runtime drift: ' + file);
  const tests = (await fs.readdir(path.join(root,'tests'))).filter(name=>/^combat-.*\.test\.mjs$/.test(name)).map(name=>'tests/'+name).sort();
  assert.deepEqual(evidence.nodeReports.map(row=>row.file).sort(), tests, 'Node suite coverage differs from checkout');
  assert.deepEqual(evidence.browserReports.map(row=>row.label).sort(), BROWSER_SUITES.map(browserSuiteLabel).sort(), 'Browser suite coverage differs from configured coverage');
  assert.equal(finales.FINISHER_CATALOG.length, FIGHTERS.length * 3);
  assert.equal(Object.keys(ambience.AUDIO_AMBIENCES).length, STAGES.length);

  const data = structuredClone(priorData), freshQa = [], occurrences = new Map();
  const addQa = (kind, report, name, expected) => {
    assert(typeof name === 'string' && name, 'A verified check must have a name');
    const key = `${report.file}\0${report.label}\0${name}`, occurrence = (occurrences.get(key)||0)+1;
    occurrences.set(key, occurrence);
    const id = `CI07-${kind}-${sha256(`${key}\0${occurrence}`).slice(0,16)}`;
    freshQa.push([id, `CI 0.7 · ${kind==='N'?'Node':'Chromium'}`, name, 'Réussi', 'P0',
      `node ${report.file}`,
      `Exécution du ${evidence.completedAt}\n${evidence.runUrl||'Exécution locale'}\nCommit de base ${evidence.sourceCommit}\nSource SHA-256 ${report.sourceSha256}\nJournal ${report.log}`,
      expected, '']);
  };
  for (const report of evidence.nodeReports) {
    assert.equal(report.passed,true); assert.equal(report.exitCode,0); assert.equal(report.timedOut,false);
    assert.equal(report.sourceUnchanged,true); assert.equal(report.sourceSha256After,report.sourceSha256);
    assert.equal(report.count,report.passedCount); assert.equal(report.count,report.testNames.length); assert(report.count>0);
    assert.equal(await fileDigest(report.file),report.sourceSha256,'Test source drift: '+report.file);
    for (const name of report.testNames) addQa('N',report,name,'Assertions exécutées par la suite Node. Aucun essai matériel ni contrôle canonique implicite.');
  }
  for (const report of evidence.browserReports) {
    assert.equal(report.passed,true); assert.equal(report.exitCode,0); assert.equal(report.timedOut,false);
    assert.equal(report.sourceUnchanged,true); assert.equal(report.sourceSha256After,report.sourceSha256);
    assert.equal(await fileDigest(report.file),report.sourceSha256,'Test source drift: '+report.file);
    assert.equal(sha256(JSON.stringify(report.report)),report.reportSha256,'Browser report digest mismatch');
    assert.deepEqual(report.checks,report.report.checks); assert(report.checks.length>0);
    for (const check of report.checks) {
      assert.equal(check.pass,true);
      addQa('B',report,check.name||check.label||check.title,String(check.expected||check.description||'Portée limitée aux assertions et au navigateur consignés dans le rapport.'));
    }
  }
  const nodeCount=evidence.nodeReports.reduce((n,r)=>n+r.count,0), browserCount=evidence.browserReports.reduce((n,r)=>n+r.checks.length,0);
  const totals={nodeSuites:tests.length,nodeTests:nodeCount,nodePassed:nodeCount,browserSuites:BROWSER_SUITES.length,browserChecks:browserCount,browserPassed:browserCount};
  assert.deepEqual(evidence.totals, totals, 'Evidence totals do not match the actual reports');
  const upsert=(rows,replacement)=>{
    const existing=rows.find(row=>row[0]===replacement[0]);
    if(existing){replacement[replacement.length-1]=existing[existing.length-1];rows[rows.indexOf(existing)]=replacement;}
    else rows.push(replacement);
  };
  const updateFeature=(id,changes)=>{const row=data.features.find(row=>row[0]===id);assert(row,'Missing feature '+id);for(const [index,value]of Object.entries(changes))row[+index]=value;};
  updateFeature('CQC-24',{3:'Partiel',5:'combat/finisher-catalog.mjs / combat/finishers.mjs / combat/render-finishers.mjs',6:'42 présentations de KO, trois par artiste, après un vrai KO final. Passage volontaire, galerie et mouvements réduits.',7:'Compositions procédurales avec les dessins existants. Dessins dédiés, voix et comparaison canonique 1:1 restent à produire ou vérifier.'});
  updateFeature('PRO-05',{7:'Versions prises en charge : '+session.REPLAY_VERSIONS.join(', ')+'. Les règles de simulation restent versionnées.'});
  updateFeature('PRD-01',{5:'scripts/build-combat-workbook.mjs / scripts/build-combat-workbook-current.mjs / scripts/workbook-publication.mjs',6:'Importer le classeur, conserver ses notes par ID, recalculer et publier le classeur, les données, la vérification et les preuves ensemble.',7:'Sauvegardes avant remplacement, restauration sur échec intercepté. Les quatre fichiers ne sont pas simultanément atomiques. Récupération après arrêt brutal manuelle.'});
  updateFeature('PRD-04',{3:'Implémenté',5:'docs/combat-qa-evidence-0.7.0.json',7:'Rapports 0.7 et historique 0.6 séparés. Les anciennes captures ne sont pas considérées comme de nouveaux essais.'});
  updateFeature('PRE-08',{3:'Partiel',5:'combat/audio.mjs / tests/combat-audio-cues.test.mjs',6:`${audio.AUDIO_EFFECT_IDS.length} motifs synthétiques, dont six impacts distincts : léger, lourd, bas, saisie, spécial et super.`,7:'Les impacts suivent les dégâts réels ; garde et KO restent prioritaires. Voix dédiées et mixage sur plusieurs appareils restent à produire ou vérifier.'});
  const queen=FIGHTERS.find(fighter=>fighter.id==='gloinkqueen'),queenRow=data.roster.find(row=>row[0]==='gloinkqueen');
  assert(queen&&queenRow,'Missing Gloink Queen fighter');
  queenRow[13]=queen.sprite.src.replace(/^\.\.\//,'');
  queenRow[16]=['Boss jouable avec statistiques de versus',queen.scaleNote].filter(Boolean).join('. ');
  upsert(data.features,['PRE-21','Présentation','Ambiances sonores propres aux arènes','Implémenté','P1','combat/audio-ambiences.mjs / combat/audio.mjs','Douze ambiances originales, volume indépendant, arrêt à la pause et changement propre d’arène.','Synthèse locale originale. Mixage sur appareils physiques à vérifier.','']);
  // Menu accessibility is tracked separately from physical controller validation.
  if (evidence.browserReports.some(r=>r.file==='tests/combat-accessibility-browser.mjs'&&r.passed)) {
    updateFeature('CTL-08',{3:'Implémenté',5:'combat/menu-navigation.mjs / combat/app.mjs / tests/combat-accessibility-browser.mjs',6:'Parcourir les groupes avec flèches, début et fin ; conserver le focus après reconstruction d’une liste ou fermeture d’un dialogue. Tab natif et navigation des menus à la manette.',7:'Clavier et manette virtuelle vérifiés dans Chromium. Périmètre exact dans QA. Essais avec technologies d’assistance et manettes physiques à poursuivre.'});
  }
  if(evidence.browserReports.some(r=>r.file==='tests/combat-input-browser.mjs'&&r.passed))updateFeature('CTL-06',{6:'Annuler les entrées au blur et à la pause ; attendre une nouvelle pression réelle après reprise. Ctrl droit de J2 ne bloque pas les attaques de J1. Les commandes de la barre d’outils ne provoquent pas de saut.',7:'Quatre parcours Chromium et trois régressions Node ciblées. Aucun changement des règles du moteur ni des replays.'});
  const fighterNames=new Map(FIGHTERS.map(f=>[f.id,f.name])),stageNames=new Map(STAGES.map(s=>[s.id,s.name]));
  for(const entry of finales.FINISHER_CATALOG) upsert(data.production,[`FIN-${entry.id}`,'Finition visuelle',fighterNames.get(entry.fighterId),entry.title,'Implémenté','P1','combat/finisher-catalog.mjs / combat/finishers.mjs / combat/render-finishers.mjs',
    `${entry.durationFrames} frames de présentation.\n`+entry.beats.map(beat=>`${beat.frame} f · ${beat.title} : ${beat.description}`).join('\n'),
    `${entry.adaptation}\nTravail artistique restant : ${entry.remainingArtWork}\nRéférences à comparer : ${entry.sourceIds.join(', ')}`,'']);
  for(const [id,entry]of Object.entries(ambience.AUDIO_AMBIENCES)) upsert(data.production,[`ART-${id}-ambience`,'Arène',stageNames.get(id),'Ambiance sonore','Implémenté','P2','combat/audio-ambiences.mjs / combat/audio.mjs',`${entry.title} · ${entry.periodSeconds} s · ${entry.layers.length} couches`,`${entry.description} ${entry.provenance} Mixage sur appareils physiques à vérifier.`,'']);
  const effects=new Set(audio.AUDIO_EFFECT_IDS);
  const labels={trap:'Piège',ko:'KO',impactLight:'Impact léger',impactHeavy:'Impact lourd',impactLow:'Impact bas',impactThrow:'Impact de saisie',impactSpecial:'Impact spécial',impactSuper:'Impact de super'};
  for(const [id,label]of Object.entries(labels)) if(effects.has(id)) {
    upsert(data.production,[`SYNTH-${id}`,'Motif sonore','Commun',label,'Implémenté','P1','combat/audio.mjs',`Synthèse originale distincte : ${id}.`,'Enveloppe et ressources bornées. Arrêt à la pause. Écoute du mixage sur matériel réel à poursuivre.','']);
    const taskId={impactLight:'light',impactHeavy:'heavy',impactLow:'low',impactThrow:'throw',impactSpecial:'projectile',impactSuper:'super'}[id]||id;
    upsert(data.production,[`SFX-${taskId}`,'Audio','Commun',label,'Implémenté','P1','combat/audio.mjs',`Motif synthétique distinct ${id}. Les impacts utilisent le dernier événement de dégâts valide ; garde et KO gardent leurs signaux prioritaires.`,'Volume et déclenchement vérifiés dans le périmètre des rapports. Écoute sur matériel réel à poursuivre.','']);
  }
  assert.deepEqual(data.production.filter(row=>row[1]==='Motif sonore').map(row=>row[0].slice('SYNTH-'.length)).sort(),[...effects].sort(),'Every audio effect must have one tracked synthesis task');
  const activeIds=new Set(freshQa.map(row=>row[0]));
  for(const row of data.qa) if(!activeIds.has(row[0])&&['Réussi','Échec'].includes(row[3])&&!row[1].startsWith('Historique ')) {
    const version=row[0].startsWith('CI07-')?'0.7.0':'0.6.0';row[1]=`Historique ${version} · ${row[1]}`;
    row[6]=`Historique ${version}. Ce cas ne constitue pas une nouvelle exécution de cette passe.\n${row[6]}`;
  }
  for(const row of freshQa)upsert(data.qa,row);
  const accessibilityReport=evidence.browserReports.find(report=>report.file==='tests/combat-accessibility-browser.mjs'&&report.passed);
  if(accessibilityReport){
    const review=data.qa.find(row=>row[0]==='QA-focus');assert(review,'Missing keyboard review objective');
    review[1]='Revue 0.7 · Accessibilité';review[3]='Réussi';
    review[5]='tests/combat-accessibility-browser.mjs';
    review[6]=`Objectif couvert par les ${accessibilityReport.checks.length} contrôles Chromium de cette passe. Voir les lignes CI07 et docs/combat-qa-evidence-0.7.0.json. Cette revue n’est pas un test indépendant supplémentaire.`;
    review[7]='Parcours clavier, focus visible et conservé, commandes natives et menus à la manette virtuelle vérifiés. Lecteur d’écran et matériel physique non testés.';
  }
  const extraSources=[
    {id:'finishers-07',title:'Encore — 42 présentations de KO',kind:'Création de fan-game',url:'combat/finisher-catalog.mjs',scope:finales.FINISHER_NOTICE},
    {id:'audio-ambiences-07',title:'Encore — douze ambiances sonores',kind:'Synthèse originale',url:'combat/audio-ambiences.mjs',scope:'Compositions originales. Aucune captation de la série ni validation du mixage sur matériel physique.'},
    {id:'ci-evidence-07',title:'Encore — preuves 0.7',kind:'Exécutions automatiques',url:'docs/combat-qa-evidence-0.7.0.json',scope:'Processus, sources SHA-256 et assertions exécutées. Historique 0.6 conservé séparément.'},
  ];
  const sourceMap=new Map(data.sources.map(s=>[s.id,s]));for(const source of extraSources)sourceMap.set(source.id,source);data.sources=[...sourceMap.values()];
  data.version=GAME.version; data.asOf=GAME.contentDate;
  Object.assign(data.counts,{fighters:FIGHTERS.length,moves:MOVES.length,stages:STAGES.length,modes:session.MODES.length,atlas:ROSTER_ARCHIVE.length,variants:VARIANTS.length,archiveOnly:ROSTER_ARCHIVE.length-FIGHTERS.length-VARIANTS.length,soundEffects:effects.size,offlineImages:offline.ART_FILES.length,offlineBytes:offline.ART_BYTES,finishers:finales.FINISHER_CATALOG.length,audioAmbiences:Object.keys(ambience.AUDIO_AMBIENCES).length,features:data.features.length,production:data.production.length,scenarios:data.scenarios.length,qa:data.qa.length});
  data.qaSummary=Object.fromEntries(QA_STATUSES.map(s=>[s,data.qa.filter(row=>row[3]===s).length]));
  data.qaSummaryScope='Historique conservé, objectifs de revue et cas de cette passe. Toutes ces lignes ne sont pas des tests indépendants de la version courante.';
  data.currentQa={gameVersion:GAME.version,sourceCommit:evidence.sourceCommit,runUrl:evidence.runUrl,totals,rowIds:[...activeIds].sort(),evidence:'docs/combat-qa-evidence-0.7.0.json'};
  data.historicalQaRows=data.qa.length-activeIds.size;
  for(const key of Object.values(TRACKER_SHEETS)){const ids=data[key].map(row=>row[0]);assert(ids.every(hasValue));assert.equal(new Set(ids).size,ids.length,'Duplicate IDs in '+key);}
  return {data,totals,fileDigest,offline};
}
