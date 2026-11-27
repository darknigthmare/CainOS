#!/usr/bin/env node
/** Rebuild documentation only. No runtime, workbook or artwork is modified. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {FIGHTERS, COSTUMES, STAGES, DEDICATED_STAGES} from '../combat/data.mjs';
import {MODES, GAME_VERSION, SLOT_ORDER} from '../combat/session.mjs';
import {FIXED_DT, ENGINE_RULES_VERSION} from '../combat/engine.mjs';
import {FIGHTER_SEQUENCES, SEQUENCE_EVENTS} from '../combat/render-sequences.mjs';
import {AS_OF, BASELINE_COMMIT, SOURCE_DOCUMENTS, SECTION_BLUEPRINTS, TEAM_CONTRACT, SELECTION_CONTRACT, TAUNT_CONTRACT} from './combat-extensions-authoring.mjs';
import {CHARACTER_BRIEFS} from './combat-extensions-character-briefs.mjs';
import {TEAM_BRIEFS, BONUS_BRIEFS, HUB, ACCESS_CONTRACT, ACCESS_RULES, REWARDS, SUPPORT_BENEFITS, LOCK_VISUAL, RIGHTS_SCENARIOS, TEAM_SCENARIOS, CLASHES} from './combat-extensions-systems.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const targetDir='docs/bible';
const check=process.argv.includes('--check');
const validateOnly=process.argv.includes('--validate-only');
assert.ok(!(check&&validateOnly),'Choose either --check or --validate-only.');
const read=p=>fs.readFile(path.join(root,p),'utf8');
const json=value=>JSON.stringify(value,null,2)+'\n';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const cell=value=>String(value??'—').replaceAll('|','\\|').replace(/\r?\n/g,' ');
const table=(headers,rows)=>['| '+headers.map(cell).join(' | ')+' |','| '+headers.map(()=> '---').join(' | ')+' |',...rows.map(row=>'| '+row.map(cell).join(' | ')+' |')].join('\n');
const bullets=items=>items.map(item=>`- ${item}`).join('\n');
const names=new Map(FIGHTERS.map(f=>[f.id,f.name]));
const stageNames=new Map([...STAGES,...DEDICATED_STAGES].map(s=>[s.id,s.name]));
const associations=JSON.parse(await read(`${targetDir}/character-associations.json`));
const byAssociation=new Map(associations.characters.map(c=>[c.id,c]));
const sectionIds=Array.from({length:38},(_,i)=>String(i+30));
const documentationSections=new Set(['30','44','47','48','49','65','66','67']);
const stat=(assets='à produire',integration='non intégré',tests='à exécuter')=>({design:'spécifié',assets,integration,tests});
const designStatus=()=>({design:'specified',assets:'not-produced',integration:'not-implemented',tests:'not-executed'});
const namespace='encore-combat-extensions';
const base={version:'1.0',asOf:AS_OF,timezone:'Europe/Paris',observedBaselineCommit:BASELINE_COMMIT};
const staticSelectionContinuation={
  id:'EN-E1-STATIC-SELECTION-20261127',contractId:SELECTION_CONTRACT.id,requirementSection:'EN-G32',
  status:'implemented-static-subset',source:'combat/selection-presentation.mjs',
  evidence:'docs/art-generation/completion-20261127/selection/README.md',
  behaviors:['Choix immédiat et annulation du dernier changement indépendants pour J1 et J2.',
    'Jetons de portrait rejetant les réponses tardives ; choix conservé après une image indisponible.',
    'Annonce accessible unique, badges de miroir et retour du focus sur la carte rétablie.',
    'État temporaire effacé en quittant le menu ; aucun changement de profil, replay ou simulation.'],
  excluded:['Gestes individuels d’entrée et de sortie','Animation des huit états','Taunts','Sélection d’équipe','Droits commerciaux'],
  verification:{nodeSuite:'tests/combat-selection-presentation.test.mjs',browserSuite:'tests/combat-selection-browser.mjs',
    resultPolicy:'Consulter les preuves datées de la livraison ; une suite inscrite ne constitue pas une exécution réussie.'},
};

assert.equal(FIGHTERS.length,64,'Update authoring before expanding this roster.');
assert.deepEqual(SECTION_BLUEPRINTS.map(s=>s[0]),sectionIds);
assert.equal(CHARACTER_BRIEFS.length,FIGHTERS.length);
assert.deepEqual(CHARACTER_BRIEFS.map(b=>b.fighterId).sort(),FIGHTERS.map(f=>f.id).sort());
assert.equal(new Set(CHARACTER_BRIEFS.map(b=>b.title)).size,64);
assert.equal(new Set(CHARACTER_BRIEFS.map(b=>b.deselection)).size,64);
for(const source of SOURCE_DOCUMENTS){
  const bytes=await fs.readFile(path.join(root,source.path));
  assert.equal(bytes.length,source.bytes,source.filename);
  assert.equal(hash(bytes),source.sha256,source.filename);
}

const sections=SECTION_BLUEPRINTS.map(([section,title,priority,decision,observedStatus,adaptation,pairs])=>{
  const documentary=documentationSections.has(section);
  const related=Number(section)<50?'extensions-teams-bonus.json':'extensions-access.json';
  const links=[`docs/bible/references/${SOURCE_DOCUMENTS[Number(section)<50?1:2].filename}`,`docs/bible/${related}`];
  if(['31','32','44','45','48'].includes(section))links.push('docs/bible/extensions-characters.json');
  const requirementStatus=documentary?{design:'specified',assets:'not-applicable',integration:'documentation-only',tests:'document-checked-runtime-not-executed'}:designStatus();
  return {id:`EN-G${section}`,section,module:Number(section)<50?'Extension 01':'Extension 02',title,priority,decision,observedStatus,adaptation,
    sourceDocumentId:Number(section)<50?'extension01':'extension02',sourceSection:section,
    status:documentary?stat('sans objet','documentaire','validation documentaire'):stat('à produire / selon fiche','non intégré ; socle selon observation','à exécuter'),
    statusAxes:requirementStatus,
    requirements:pairs.map(([text,acceptance],i)=>({id:`EN-G${section}-${String(i+1).padStart(2,'0')}`,text,acceptance,status:{...requirementStatus}})),
    verification:pairs.map(([,criterion])=>criterion).join(' '),links,
  };
});
assert.equal(sections.flatMap(s=>s.requirements).length,114);

const characters=FIGHTERS.map(fighter=>{
  const brief=CHARACTER_BRIEFS.find(b=>b.fighterId===fighter.id),assoc=byAssociation.get(fighter.id);
  assert.ok(assoc,`Missing source association ${fighter.id}`);
  const abstract=fighter.id.includes('abstract')||fighter.id==='cellarabstraction'||fighter.id==='aquaticabstraction';
  const artScope= 'Références existantes du dépôt, non réévaluées visuellement dans cette passe ; aucun dessin ou cycle nouveau produit.';
  const common={fighterId:fighter.id,loreStatus:'original-compatible',sourceIds:assoc.identityEvidence.runtimeFidelity?.sourceIds??[],statusAxes:designStatus(),productionPhase:'static-base-assets-only',dialogue:null,
    sourceReferences:['combat/data.mjs','combat/render-sequences.mjs','combat/stories.mjs','docs/bible/character-associations.json'],fidelityGuard:brief.fidelityGuard};
  return {fighterId:fighter.id,name:fighter.name,role:fighter.role,associationId:assoc.associationId,
    identity:{sourceKind:assoc.identityEvidence.runtimeSourceKind,sourceId:assoc.identityEvidence.runtimeLoreSourceId,provenance:assoc.identityEvidence.runtimeProvenance,
      referenceTraits:assoc.identityEvidence.runtimeFidelity?.observedTraits??[],scope:artScope,identityNotReclassified:true},
    existing:{portraitPath:assoc.assets.portraitPath,stancePath:assoc.assets.stancePath,sequenceEventIds:Object.keys(FIGHTER_SEQUENCES[fighter.id]??{}),
      existingSequenceScope:'Procédural intro/résultats ; ne constitue pas une animation de sélection, de désélection ou de taunt.',utility:{slot:'utility',name:fighter.moves.utility.name,kind:fighter.moves.utility.kind},rivalId:assoc.route.rival.fighterId},
    taunt:{...common,id:`EN-E1-TAUNT-${fighter.id}`,title:brief.title,contractId:TAUNT_CONTRACT.id,type:'presentation',entry:brief.entry,hold:brief.hold,exit:brief.exit,
      expression:abstract?'Non verbale ; regards et posture uniquement.': 'Le geste et l’expression suivent le dessin du costume ; aucune citation ou voix officielle ajoutée.',
      contextualVariant:{rivalId:assoc.route.rival.fighterId,relationStatus:'existing-encore-route-pairing-not-canonical-hostility',behavior:`Diriger le regard de « ${brief.title} » vers ${names.get(assoc.route.rival.fighterId)}, sans prolonger le geste ni changer ses règles.`},
      assetsRequired:[`${fighter.id}:taunt-entry`,`${fighter.id}:taunt-hold`,`${fighter.id}:taunt-exit`],sound:'Signal facultatif original très bref ; pas de voix copiée ni de gain de ressource.',
      acceptance:['Référence et anatomie préservées dans les deux orientations.','Interruption par impact applique la réaction de combat normale.','Geste sans ressource, sans invulnérabilité et sans effacement de cooldown.','Version réduite lisible et retour à la stance sans saut d’ancrage.']},
    selection:{...common,id:`EN-E1-SELECT-${fighter.id}`,title:`Entrée de sélection · ${fighter.name}`,contractId:SELECTION_CONTRACT.id,brief:brief.selection,
      confirmation:`Achever le geste de ${fighter.name} puis tenir la pose sans retarder la validation logique.`,confirmedIdle:'Tenir l’image du costume avec mouvement facultatif réduit ; aucune boucle de gameplay.',
      costumeChange:'Conserver identité, proportions et accessoires de la nouvelle tenue ; ne pas appliquer un rig ou une pose d’un autre propriétaire.',
      states:SELECTION_CONTRACT.states.map(s=>s.id),assetsRequired:[`${fighter.id}:selection-entry`,`${fighter.id}:selection-confirm`,`${fighter.id}:selection-idle`],
      acceptance:['Portrait et nom correspondent à l’ID/costume réellement sélectionnés.','Choix confirmé immédiatement puis présenté ; accès et installation contrôlés.','Deux joueurs et réponses de chargement tardives restent indépendants.']},
    deselection:{...common,id:`EN-E1-DESELECT-${fighter.id}`,title:`Sortie de sélection · ${fighter.name}`,contractId:SELECTION_CONTRACT.id,brief:brief.deselection,
      rapidVersion:'Terminer sur la première pose de retrait lisible, puis retirer la famille complète en six ticks de présentation proposés.',
      cleanup:['portrait précédent','jeton de chargement précédent','voix locale','particules locales','compagnon d’aperçu','ombre et lumière propres'],
      endState:'focus',assetsRequired:[`${fighter.id}:selection-exit`],
      acceptance:['Sortie différente de la simple lecture à l’envers.','Le nouvel artiste reçoit le choix et le focus sans attendre la fin.','Aucun élément appartenant à l’ancien aperçu ne reste actif.']},
  };
});

const teams=TEAM_BRIEFS.map(team=>{
  assert.equal(team.members.length,2); assert.equal(new Set(team.members).size,2);
  for(const id of [...team.members,...team.dramaticOpponentIds])assert.ok(names.has(id),`${team.id}/${id}`);
  assert.ok(stageNames.has(team.stageId),team.id);
  const contribution=team.members.map((id,i)=>{
    const f=FIGHTERS.find(f=>f.id===id),slot=team.moveSlots[i]; assert.ok(f.moves[slot],`${team.id}/${slot}`);
    return {fighterId:id,slot,moveId:`${id}.${slot}`,moveName:f.moves[slot].name,kind:f.moves[slot].kind,source:'combat/data.mjs',status:'existing-move-referenced-for-future-team-choreography'};
  });
  return {...team,statusAxes:designStatus(),contributions:contribution,
    assist:{entry:'Arrivée depuis le bord arrière de l’actif, annonce visuelle de 24 ticks proposée, point le plus proche sans chevauchement.',
      attack:contribution[1],exit:'Sortie vers le bord d’arrivée ; si touché, réaction et retour de réserve après résolution.',lifePolicy:TEAM_CONTRACT.assist,cooldownPolicy:TEAM_CONTRACT.clock},
    super:{id:`${team.id}-SUPER`,title:team.title,activation:'Deux membres vivants, partenaire disponible, jauge suffisante, premier coup confirmé sur cible compatible.',choreography:team.choreography,
      whiffOrGuard:'Pas de scène longue ; récupération de l’amorce et coût déjà engagé selon contrat.',returnActiveId:team.members[0],morphologyFallback:'Impact à distance et retrait de scène pour sphère, géant, abstraction ou cible sans prise compatible.'},
    dramaticFinish:{id:`${team.id}-LAST-ACT`,title:`Dernier Acte · ${team.title}`,condition:{teamMembers:team.members,opponentIds:team.dramaticOpponentIds,stageId:team.stageId,partnerAlive:true,matchVerdict:'already-recorded',sceneGrantRequired:true},
      choreography:team.finale,branch:'original-encore-simulation',replacement:team.fallback,
      sceneId:`${team.id}-SCENE`,stillBrief:{cast:[...team.members],stageId:team.stageId,framing:'Plan latéral large montrant les deux contributions et la cible sans la fusionner aux silhouettes.',textSafeArea:'Bande inférieure dégagée de 18 % ; nom de scène original dans l’interface, jamais peint dans le décor.',imageStatus:'brief-only-not-produced'}},
    assetsRequired:['Pose de duo de sélection','Entrée et sortie du soutien','Amorce/liaison/impact/retour de super','Tableau de Dernier Acte','Réactions par famille morphologique','Signaux originaux VFX/SFX'],
  };
});

for(const b of BONUS_BRIEFS){assert.ok(stageNames.has(b.stageId));for(const id of b.fighterIds)assert.ok(names.has(id));assert.ok(REWARDS.some(r=>r.id===b.rewardId));}
const bonuses=BONUS_BRIEFS.map(b=>({...b,statusAxes:designStatus(),
  startingState:{health:'Vie complète du personnage choisi dans cette épreuve isolée.',kitResource:'Ressource intrinsèque pleine, puis coûts et limites normaux ; aucune munition ou entité ajoutée par la fiche.',superMeter:0,
    equipment:'Tenue sélectionnée compatible avec le kit ; les personnages autorisés de la fiche ne changent pas la difficulté par un bonus de statistique.',team:'Un personnage actif ; le défi de duo exige son futur contrat dédié.'},
  entryScene:{type:'still-brief',action:`Présenter ${b.title} dans ${stageNames.get(b.stageId)} et montrer les cibles sans masquer l’axe jouable.`,caption:b.objective,imageStatus:'not-produced'},
  exitScene:{type:'still-brief',action:'Montrer les objectifs réussis et restants, puis proposer réessayer ou poursuivre.',imageStatus:'not-produced'},
  nextStoryState:'Le succès accorde seulement sa récompense définie ; les HP et ressources de l’épreuve ne sont pas transférés ni exploités pour soigner le prochain duel. Le résultat est un événement de bonus distinct.',
  performanceGate:'Mesurer le plafond de cibles et les effets à la résolution logique 1280×720 sur une machine nommée avant validation. Aucun gain de performances n’est affirmé par ce brief.',
}));
const hubIds=new Set(HUB.zones.map(z=>z.id));
const adjacency=new Map([...hubIds].map(id=>[id,new Set()]));
for(const link of HUB.connections){
  assert.ok(hubIds.has(link.a)&&hubIds.has(link.b)&&link.a!==link.b);
  adjacency.get(link.a).add(link.b);adjacency.get(link.b).add(link.a);
  for(const key of ['aThreshold','bThreshold'])assert.ok(link[key].every(n=>n>=0&&n<=1)&&link[key].some(n=>n===0||n===1),`${link.id}/${key}`);
  for(const key of ['aArrival','bArrival'])assert.ok(link[key].every(n=>n>0&&n<1),`${link.id}/${key}`);
}
const visited=new Set(),todo=['EN-HUB-ACCUEIL'];while(todo.length){const id=todo.pop();if(visited.has(id))continue;visited.add(id);todo.push(...adjacency.get(id));}
assert.equal(visited.size,hubIds.size,'Hub must be connected.');
for(const zone of HUB.zones){assert.ok(stageNames.has(zone.stageReferenceId));for(const id of zone.rewardIds)assert.ok(REWARDS.some(r=>r.id===id));}

const objectKeys=['kind','startup','active','recovery','damage','cost','meter','life','speed','duration','arm','hp','maxTraps','fuse','radius','interval','count','return','parryMode','target'];
const entities=FIGHTERS.flatMap(f=>Object.entries(f.moves).filter(([,m])=>['projectile','trap'].includes(m.kind)).map(([slot,m])=>({
  id:`EN-E1-ENTITY-${f.id}-${slot}`,fighterId:f.id,moveId:`${f.id}.${slot}`,slot,name:m.name,kind:m.kind,
  runtimeFields:Object.fromEntries(objectKeys.filter(k=>Object.hasOwn(m,k)).map(k=>[k,m[k]])),
  originalOwner:f.id,visualIdentity:'Conserver le motif associé à la définition du coup même après réflexion.',
  futureTeamPolicy:m.kind==='trap'?'Persiste en réserve sans nouveau spawn ; nettoyage au KO propriétaire selon contrat.':'Termine sa durée bornée après passage en réserve ou KO ; crédit par propriétaire effectif.',
  source:'combat/data.mjs + combat/engine.mjs',status:'existing-runtime-definition-not-retested-in-this-pass',
}))); 

const existingCatalogue=[
  ...FIGHTERS.map(f=>({id:`fighter:${f.id}`,runtimeId:f.id,category:'fighter',title:f.name,dependencies:[],legacyOpen:true})),
  ...COSTUMES.map(c=>({id:`costume:${c.id}`,runtimeId:c.id,category:'costume',title:c.name,dependencies:[`fighter:${c.fighterId||c.baseFighterId}`],legacyOpen:true})),
  ...STAGES.map(s=>({id:`stage:${s.id}`,runtimeId:s.id,category:'stage',title:s.name,dependencies:[],legacyOpen:true})),
  ...DEDICATED_STAGES.map(s=>({id:`arrangement:${s.id}`,runtimeId:s.id,category:'stage-arrangement',title:s.name,dependencies:[`fighter:${s.dedicatedTo}`],legacyOpen:true})),
  ...MODES.map(m=>({id:`mode:${m.id}`,runtimeId:m.id,category:'mode',title:m.name,dependencies:[],legacyOpen:true})),
].map(c=>({...c,discovery:'identified',entitlement:'legacy-free',availability:'registered-in-current-runtime-not-reverified-here',accessRuleId:'EN-E2-RULE-LEGACY'}));
const catalogueIds=new Set(existingCatalogue.map(c=>c.id));assert.equal(catalogueIds.size,existingCatalogue.length);
for(const item of existingCatalogue)for(const dep of item.dependencies)assert.ok(catalogueIds.has(dep),`${item.id} -> ${dep}`);
const rewardIds=new Set(REWARDS.map(r=>r.id));
const leafTargets={
  'legacy-access':new Set(['published-before-extensions']),'story-complete':new Set(FIGHTERS.map(f=>f.id)),
  'bonus-complete':new Set(bonuses.map(b=>b.id)),'bonus-score':new Set(bonuses.map(b=>b.id)),
  'hub-discovered':hubIds,'verified-benefit':new Set(SUPPORT_BENEFITS.map(b=>b.id)),'mode-tutorial-complete':new Set(['future-duo-training'])
};
function checkCondition(node){
  assert.ok(node&&typeof node==='object'&&!Array.isArray(node));
  if(node.all||node.any){assert.equal(Number(!!node.all)+Number(!!node.any),1);const children=node.all||node.any;assert.ok(children.length>=2);children.forEach(checkCondition);return;}
  assert.ok(leafTargets[node.type]?.has(node.id),`Unknown condition ${node.type}/${node.id}`);
  if(Object.hasOwn(node,'value'))assert.ok(Number.isInteger(node.value)&&node.value>=0);
}
for(const rule of ACCESS_RULES){checkCondition(rule.condition);for(const id of rule.contentIds)assert.ok(id==='existing-runtime-catalogue'||rewardIds.has(id));}
for(const benefit of SUPPORT_BENEFITS){assert.equal(benefit.active,false);assert.equal(benefit.provider,null);for(const id of benefit.contentIds)assert.ok(rewardIds.has(id));}
assert.equal(RIGHTS_SCENARIOS.length,22);assert.equal(TEAM_SCENARIOS.length,18);

const design={schema:`${namespace}-design/v1`,...base,sources:SOURCE_DOCUMENTS,phase:'static-base-assets-and-documentation',
  interpretation:'Fidélité 1:1 = identité, silhouettes, proportions, accessoires, lieux et personnalité vérifiés contre sources. Aucune certification globale donnée par ces documents.',
  sections,contracts:{selection:SELECTION_CONTRACT,taunt:TAUNT_CONTRACT,team:TEAM_CONTRACT},
  staticSelectionContinuation,
  runtimeObservations:[
    {id:'EN-OBS-SELECT',path:'combat/app.mjs',symbols:['renderSelect','selectionArtist','refreshSelectionArtist'],observed:'Cartes, portraits, aperçu de costume et décor présents ; aucun cycle complet de désélection dédié observé au baseline.'},
    {id:'EN-OBS-STATIC-SELECT-20261127',path:'combat/selection-presentation.mjs',symbols:['SelectionPresentation','beginPortrait','finishPortrait','undo'],observed:'Continuation du 27 novembre : sous-ensemble statique de sélection intégré. Les cycles corporels complets et leur statut de production restent distincts.'},
    {id:'EN-OBS-PRESENT',path:'combat/render-sequences.mjs',symbols:['FIGHTER_SEQUENCES','SEQUENCE_EVENTS'],observed:'Cinq événements de présentation par combattant, pour intro et résultats ; distincts des nouveaux taunts et états de menu.'},
    {id:'EN-OBS-INPUT',path:'combat/session.mjs',symbols:['SLOT_ORDER','REPLAY_RULES'],observed:'Dix slots de techniques et replays 0.7.0 utilisant les règles 0.5.0 ; nouvelles actions tag à versionner.'},
    {id:'EN-OBS-ACCESS',path:'combat/session.mjs',symbols:['emptyProfile','validateProfile'],observed:'Progression de routes/défis/médailles présente ; pas de ledger de sources permanentes/temporaires dans le profil v1 du baseline.'},
    {id:'EN-OBS-SURVIVAL',path:'combat/progression.mjs',symbols:['createProgramForCatalog'],observed:'Survie existante = dix adversaires successifs ; elle ne prouve pas une horde simultanée.'},
    {id:'EN-OBS-OBJECTS',path:'combat/engine.mjs',symbols:['spawn','projectiles','traps','damage'],observed:'Projectiles, pièges et réflexion existants ; cycle sous tag non implémenté au baseline.'},
  ],
};
const characterData={schema:`${namespace}-characters/v1`,...base,scope:'64 briefs de taunt, 64 entrées de sélection et 64 sorties ; zéro nouvelle animation produite.',characters};
const systems={schema:`${namespace}-teams-bonus/v1`,...base,teamContract:TEAM_CONTRACT,teams,bonuses,hub:{...HUB,statusAxes:designStatus()},clashes:CLASHES,entities,acceptanceScenarios:TEAM_SCENARIOS};
systems.productionSheetMap={
  A:{title:'Taunt',file:'extensions-characters.json',records:'characters[].taunt',sharedContract:TAUNT_CONTRACT.id},
  B:{title:'Sélection/désélection',file:'extensions-characters.json',records:'characters[].selection + characters[].deselection',sharedContract:SELECTION_CONTRACT.id},
  C:{title:'Profil d’équipe',file:'extensions-teams-bonus.json',records:'teamContract'},
  D:{title:'Assistance/relais',file:'extensions-teams-bonus.json',records:'teams[].assist + teamContract.neutralTag/comboTag/rescueTag'},
  E:{title:'Super/finisher/fin dramatique',file:'extensions-teams-bonus.json',records:'teams[].super + teams[].dramaticFinish'},
  F:{title:'Clash/QTE',file:'extensions-teams-bonus.json',records:'clashes[]'},
  G:{title:'Entité/objet/projectile',file:'extensions-teams-bonus.json',records:'entities[] + teamContract.objectPolicy'},
  H:{title:'Stage bonus',file:'extensions-teams-bonus.json',records:'bonuses[]'},
  I:{title:'Lieu exploratoire/déblocages',file:'extensions-teams-bonus.json',records:'hub'},
  J:{title:'Condition/récompense',file:'extensions-access.json',records:'unlockRules[] + rewards[]'},
};
const access={schema:`${namespace}-access/v1`,...base,contract:ACCESS_CONTRACT,visualLanguage:LOCK_VISUAL,existingCatalogue,
  rewards:REWARDS,unlockRules:ACCESS_RULES,supportBenefits:SUPPORT_BENEFITS,acceptanceScenarios:RIGHTS_SCENARIOS,
  userFacingStates:[
    {id:'secret',label:'Artiste non révélé',when:'Découverte secret',action:'Consulter un indice générique'},
    {id:'locked',label:'À débloquer',when:'Aucune source valide et condition connue',action:'Voir les voies d’obtention'},
    {id:'claimable',label:'Récompense disponible',when:'Condition satisfaite et récupération requise',action:'Réclamer une fois'},
    {id:'permanent',label:'Acquis',when:'Au moins une source permanente valide',action:'Sélectionner si disponible'},
    {id:'temporary',label:'Accès temporaire actif',when:'Source temporaire valide seulement',action:'Voir la validité réelle'},
    {id:'install',label:'Installation nécessaire',when:'Droit valide, assets absents',action:'Installer ou choisir un contenu présent'},
    {id:'pending',label:'Vérification en cours',when:'Statut externe non confirmé',action:'Réessayer ou jouer les contenus permanents'},
    {id:'expired',label:'Accès terminé',when:'Fin confirmée de toutes les sources temporaires et aucune source permanente',action:'Voir les voies disponibles'},
    {id:'incompatible',label:'Indisponible dans ce mode',when:'Droit valide, règle de mode ou composition incompatible',action:'Afficher le motif et une alternative'},
    {id:'production',label:'Contenu en préparation',when:'Asset ou système non produit',action:'Consulter la fiche ; aucune fausse condition de déblocage'},
  ],
};
access.productionSheetMap={
  A:{title:'Contenu et slot',records:'existingCatalogue[] + rewards[] + visualLanguage'},
  B:{title:'Règle de déblocage',records:'unlockRules[]'},
  C:{title:'Avantage de soutien',records:'supportBenefits[]'},
  D:{title:'Charte des verrous',records:'visualLanguage'},
  E:{title:'Accès à un stage spécial',records:'rewards[EN-REWARD-STAGE-BIGTOP-NIGHT] + contract.stageParticipation'},
  F:{title:'Matrice des droits',records:'acceptanceScenarios[]'},
};
for(const observation of design.runtimeObservations){
  const contents=await read(observation.path);
  for(const symbol of observation.symbols)assert.ok(contents.includes(symbol),`${observation.id}: missing runtime symbol ${symbol}`);
}
const accessEvidence=await read(ACCESS_CONTRACT.baselineEvidence.file);
for(const symbol of ACCESS_CONTRACT.baselineEvidence.symbols)assert.ok(accessEvidence.includes(symbol),`Missing profile evidence ${symbol}`);

const profiles=[
  ...characters.flatMap(c=>[['taunt',c.taunt],['selection',c.selection],['deselection',c.deselection]].map(([type,p])=>({id:p.id,type,entity:c.name,title:p.title,
    description:type==='taunt'?`${p.entry} ${p.hold} ${p.exit}`:p.brief,status:stat(),source:`docs/bible/extensions-characters.json#${p.id}`}))),
  ...teams.map(t=>({id:t.id,type:'duo',entity:t.members.map(id=>names.get(id)).join(' + '),title:t.title,description:`${t.relationship} ${t.choreography}`,status:stat(),source:`docs/bible/extensions-teams-bonus.json#${t.id}`})),
  ...bonuses.map(b=>({id:b.id,type:'bonus',entity:stageNames.get(b.stageId),title:b.title,description:`${b.objective} ${b.failure}`,status:stat(),source:`docs/bible/extensions-teams-bonus.json#${b.id}`})),
  ...HUB.zones.map(z=>({id:z.id,type:'hub',entity:HUB.title,title:z.title,description:z.function,status:stat(),source:`docs/bible/extensions-teams-bonus.json#${z.id}`})),
  ...ACCESS_RULES.map(r=>({id:r.id,type:'regle-acces',entity:r.contentIds.join(', '),title:r.title,description:r.progress,status:stat('sans objet'),source:`docs/bible/extensions-access.json#${r.id}`})),
  ...SUPPORT_BENEFITS.map(b=>({id:b.id,type:'soutien-inactif',entity:'Aucun fournisseur raccordé',title:b.title,description:`${b.model}. ${b.expiration}`,status:stat('à produire selon lot','spécification ; désactivé'),source:`docs/bible/extensions-access.json#${b.id}`})),
  {id:LOCK_VISUAL.id,type:'charte-verrou',entity:'Interface Encore',title:'Fiches C&A et billets scellés',description:LOCK_VISUAL.metaphor,status:stat(),source:`docs/bible/extensions-access.json#${LOCK_VISUAL.id}`},
  ...RIGHTS_SCENARIOS.map(q=>({id:q.id,type:'test-droits',entity:'Extension 02',title:q.title,description:`${q.action} ${q.expected}`,status:stat('sans objet','scénario écrit','à exécuter'),source:`docs/bible/extensions-access.json#${q.id}`})),
  ...CLASHES.map(c=>({id:c.id,type:'clash',entity:c.members.map(id=>names.get(id)).join(' + '),title:c.title,description:`${c.trigger} ${c.input}`,status:stat(),source:`docs/bible/extensions-teams-bonus.json#${c.id}`})),
];
const workbook={schema:`${namespace}-workbook/v1`,...base,
  sections:sections.map(({id,section,module,title,adaptation,verification,status,links})=>({id,section,module,title,adaptation,verification,status,links})),profiles,
  notes:['Ces tables ajoutent des vues de conception ; elles ne changent aucun état historique du classeur.','Les scénarios de droits sont écrits, pas exécutés sur un moteur de droits.','Toute animation, aide, tag, bonus ou hub nouveau reste à produire et intégrer.'],
};
assert.equal(profiles.length,254);assert.equal(new Set(profiles.map(p=>p.id)).size,profiles.length);

const sourceFiles=['combat/data.mjs','combat/session.mjs','combat/engine.mjs','combat/progression.mjs','combat/render-sequences.mjs','combat/bindings.mjs','combat/stories.mjs','combat/app.mjs','combat/selection-presentation.mjs','combat/index.html','combat/style.css','docs/bible/character-associations.json'];
const sourceHashes={};for(const p of sourceFiles)sourceHashes[p]=hash(await fs.readFile(path.join(root,p)));
const counts={sections:sections.length,requirements:114,characterProfiles:characters.length,tauntBriefs:64,selectionBriefs:64,deselectionBriefs:64,
  teams:teams.length,teamSupers:teams.length,teamFinales:teams.length,bonusStages:bonuses.length,hubZones:HUB.zones.length,hubReciprocalLinks:HUB.connections.length,
  accessRules:ACCESS_RULES.length,proposedRewards:REWARDS.length,supportBenefitsInactive:SUPPORT_BENEFITS.length,clashContracts:CLASHES.length,
  documentedEntitySlots:entities.length,teamAcceptanceScenarios:18,rightsAcceptanceScenarios:22,workbookProfiles:profiles.length,
  imagesProducedByThisDocumentationPass:0,animationsProducedByThisDocumentationPass:0,newRuntimeModesImplementedByThisDocumentationPass:0};
const integration={schema:`${namespace}-integration/v1`,...base,sourceDocuments:SOURCE_DOCUMENTS,sourceHashes,counts,
  staticSelectionContinuation,
  runtimeInventoryAtGeneration:{scope:'Catalogue courant référencé uniquement ; aucune réécriture des chiffres historiques de livraison.',gameVersion:GAME_VERSION,rulesVersion:ENGINE_RULES_VERSION,
    simulationHz:1/FIXED_DT,fighters:FIGHTERS.length,costumes:COSTUMES.length,stages:STAGES.length,dedicatedArrangements:DEDICATED_STAGES.length,modes:MODES.length,
    sequenceEvents:SEQUENCE_EVENTS,existingPresentationSequences:Object.values(FIGHTER_SEQUENCES).reduce((n,events)=>n+Object.keys(events).length,0),techniqueSlots:SLOT_ORDER},
  validation:{sourceBytesAndHashes:true,sectionCoverage:true,uniqueRequirementIds:true,characterRosterCoverage:true,uniqueCharacterExits:true,teamMembersAndMovesResolved:true,
    bonusStageIdsResolved:true,hubConnectedAndThresholdsOnPerimeter:true,accessDependenciesResolved:true,conditionLeavesResolved:true,supportDisabled:true,
    runtimeScenariosExecuted:false,newArtVisuallyReviewed:false,canonicalFidelityCertified:false},
  limitations:['Les timings et coûts proposés sont des hypothèses à équilibrer.','Le sous-ensemble statique de sélection est raccordé séparément ; les cycles complets, équipes, bonus, hub et droits restent à intégrer.','Les 18+22 scénarios source restent à exécuter sur une future implémentation.','Les observations de base sont attachées au commit 6e44ab7 ; les comptes courants et la continuation statique du 27 novembre sont indiqués séparément.','Les formes, gestes, duos et lieux nouveaux restent des créations Encore ou des adaptations, sans attestation canonique supplémentaire.'],
};

const generated=new Map();
const add=(name,data)=>generated.set(`${targetDir}/${name}`,typeof data==='string'?data.trimEnd()+'\n':json(data));
add('extensions-design.json',design);add('extensions-characters.json',characterData);add('extensions-teams-bonus.json',systems);
add('extensions-access.json',access);add('extensions-integration.json',integration);add('extensions-workbook-data.json',workbook);
add('references/combat-guides-provenance.json',{schema:'encore-combat-guide-provenance/v1',asOf:AS_OF,documents:SOURCE_DOCUMENTS});

const matrix=table(['ID','Rubrique','Priorité','Décision','Observation à la base'],sections.map(s=>[s.id,s.title,s.priority,s.decision,s.observedStatus]));
add('EXTENSIONS_COMBAT_INTEGRATION.md',`# Extensions 01 et 02 — application à Encore

${AS_OF} · base observée [${BASELINE_COMMIT.slice(0,7)}](https://github.com/darknigthmare/CainOS/commit/${BASELINE_COMMIT}) · phase **sprites de base et documentation**.

Les deux textes originaux prolongent le guide déjà intégré : **38 rubriques, 114 exigences**, chacune avec résultat attendu et statuts séparés. Le [registre d’intégration](extensions-integration.json) et le [contrat structuré](extensions-design.json) sont reproductibles. Ce chantier documentaire ne livre aucune nouvelle animation, aucun tag ni accès commercial opérationnel.

La [continuation du menu statique du 27 novembre](../art-generation/completion-20261127/selection/README.md) implémente le choix immédiat, un retour indépendant par joueur, les réponses de portrait tardives et les annonces accessibles. Ce sous-ensemble est décrit dans \`staticSelectionContinuation\`. Les 128 briefs d’entrée et de sortie gardent leur statut de production pour les gestes individuels et le cycle complet ; leurs identifiants servent déjà de provenance au menu.

## Sources originales conservées

${table(['Document','Sections','Octets','Empreinte SHA-256'],SOURCE_DOCUMENTS.map(s=>['['+s.filename+'](references/'+s.filename+')',s.sections,s.bytes,s.sha256]))}

Le guide général est identique à la copie déjà présente ; il n’est pas dupliqué. Les extensions viennent de leurs fichiers Drive complets, pas d’un résumé reconstruit. [Provenance](references/combat-guides-provenance.json).

## Contenu concret de cette conception

${table(['Ensemble','Quantité','Portée'],[
 ['Personnages',64,'Un taunt, une sélection et une vraie désélection chacun : 192 fiches.'],
 ['Duos',12,'Intervention, contribution de chacun, super et Dernier Acte original.'],
 ['Bonus',8,'Objectif, score, échec, reprise, décor, assets et récompense.'],
 ['Archives des répétitions',5,'Cinq salles et quatre liens réciproques ; hub original non implémenté.'],
 ['Déblocages',9,'Règles ET/OU sur huit récompenses proposées et catalogue historique conservé.'],
 ['Soutien externe',3,'Trois modèles spécifiés, tous désactivés ; aucun fournisseur ou prix configuré.'],
 ['Validation future',40,'18 scénarios Extension 01 et 22 Extension 02, non exécutés sur les fonctions absentes.'],
])}

Les [fiches de personnalité](PERSONNALITE_SELECTION_ET_EQUIPES.md), les [bonus et Archives](BONUS_ARCHIVES_ET_DEBLOCAGES.md) et les [contrats de droits](CONTRATS_DROITS_ET_SAUVEGARDE.md) développent les décisions. Les techniques et relations de parcours restent des adaptations Encore. Les références d’identité existantes gardent leurs limites ; aucune fidélité canonique globale 1:1 n’est certifiée ici.

## Socle réellement observé

${table(['Source','Observation'],design.runtimeObservations.map(o=>['['+o.path+'](../../'+o.path+')',o.observed]))}

Une carte sélectionnable n’est pas un cycle de désélection. Une finale individuelle n’est pas une super d’équipe. Une survie en dix duels n’est pas une horde simultanée. Le jeu possède des projectiles et pièges ; leur durée sous un futur tag reste à implémenter. Le mode libre conserve tous les accès existants.

## Matrice des rubriques 30 à 67

${matrix}

${sections.map(s=>`## ${s.section} — ${s.title}\n\n**${s.id} · ${s.priority} · ${s.decision}**\n\n${s.adaptation}\n\n${table(['Axe','État'],Object.entries(s.status))}\n\n${s.requirements.map(r=>`### ${r.id}\n\n${r.text}\n\n**Acceptation :** ${r.acceptance}`).join('\n\n')}\n\n**Références :** ${s.links.map(p=>'['+p+'](../../'+p+')').join(' · ')}.`).join('\n\n')}

## Reconstruction

\`node scripts/build-combat-extensions.mjs\` reconstruit les JSON et textes de ce dossier. \`node scripts/build-combat-extensions.mjs --check\` contrôle leur cohérence et les sources. Le générateur ne modifie ni le moteur, ni les images, ni le classeur. [Tables pour le classeur](extensions-workbook-data.json).
`);

add('PERSONNALITE_SELECTION_ET_EQUIPES.md',`# Personnalité, sélection et équipes

**Conception Encore du ${AS_OF} — animations et règles nouvelles non produites ou non intégrées.** Les données complètes sont dans [extensions-characters.json](extensions-characters.json) et [extensions-teams-bonus.json](extensions-teams-bonus.json).

## Un taunt distinct de la récupération

Les 64 artistes reçoivent un geste original de présentation, sans bonus de ressource. Les actions \`utility\` conservent leurs effets actuels. Les noms de gestes ci-dessous sont créés pour Encore ; aucune réplique officielle n’est copiée. Les abstractions restent non verbales.

${table(['Contrat','Règle'],Object.entries(TAUNT_CONTRACT).filter(([key])=>!['id','status','timing'].includes(key)))}

Durées proposées : entrée ${TAUNT_CONTRACT.timing.entryTicks}, tenue ${TAUNT_CONTRACT.timing.holdTicks}, sortie ${TAUNT_CONTRACT.timing.exitTicks} ticks. Ces valeurs ne sont pas des timings du moteur livré et demandent équilibrage.

## Huit états de sélection

${table(['État','Comportement','Suite','Annulation'],SELECTION_CONTRACT.states.map(s=>[s.id,s.behavior,s.next,s.cancel]))}

${SELECTION_CONTRACT.input} ${SELECTION_CONTRACT.interruption} ${SELECTION_CONTRACT.reducedMotion}

## 64 fiches individuelles

Les portraits et poses de combat déjà inscrits au catalogue sont des références de continuité visuelle. Ils ne comptent pas comme une production des séquences proposées. Chaque fiche comporte des IDs de besoins d’assets sans chemin fictif de fichier livré.

${characters.map(c=>`### ${c.name} — ${c.fighterId}\n\n**Taunt ${c.taunt.id} · ${c.taunt.title}**\n\nEntrée : ${c.taunt.entry} Pose : ${c.taunt.hold} Sortie : ${c.taunt.exit}\n\n**Sélection ${c.selection.id} :** ${c.selection.brief}\n\n**Désélection ${c.deselection.id} :** ${c.deselection.brief}\n\n**Contrainte de fidélité :** ${c.taunt.fidelityGuard}\n\n**Lien au jeu :** rival de route ${names.get(c.existing.rivalId)} (relation de fan-game), utility existante « ${c.existing.utility.name} ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.`).join('\n\n')}

## Contrat des équipes

${table(['Responsabilité','Règle proposée'],Object.entries(TEAM_CONTRACT).filter(([key,value])=>!['id','status','loreStatus','name','proposedTuning'].includes(key)&&typeof value==='string'))}

${table(['Réglage initial','Valeur proposée'],Object.entries(TEAM_CONTRACT.proposedTuning).filter(([key])=>key!=='status'))}

Ces réglages sont des hypothèses, pas une modification du jeu ${GAME_VERSION}. Les jauges personnelles et les anciens replays restent sous leurs règles existantes. Les 12 duos utilisent les techniques effectivement présentes ; leurs chorégraphies et relations de scène sont originales.

${teams.map(t=>`### ${t.id} — ${t.title}\n\n**${t.members.map(id=>names.get(id)).join(' + ')} · ${stageNames.get(t.stageId)} · ${t.narrativeMode}**\n\n${t.relationship}\n\n**Super :** ${t.choreography}\n\n${table(['Participant','Technique existante','Fonction'],t.contributions.map(c=>[names.get(c.fighterId),c.moveName,c.kind]))}\n\n**Dernier Acte :** ${t.finale} Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (${t.dramaticOpponentIds.map(id=>names.get(id)).join(', ')}).\n\n**Limite narrative :** ${t.fidelityGuard}\n\n**Remplacement :** ${t.fallback}`).join('\n\n')}

## Entités et clashes

${entities.length} slots projectile/piège existants sont référencés avec leurs champs réels dans le JSON ; champ absent reste absent. La réflexion change l’attribution des dégâts, pas le motif graphique d’origine. Une entité du kit n’occupe pas implicitement un slot d’équipe.

${CLASHES.map(c=>`### ${c.id} — ${c.title}\n\n${c.trigger}\n\n**Éligibilité :** ${c.eligibility}\n\n**Commande :** ${c.input}\n\n**Arbitrage tiers :** ${c.thirdParty}\n\n**Horloges :** ${c.clock}\n\n**Interruption :** ${c.interruption}\n\n**Résultat :** ${c.result}\n\n**Retour :** ${c.return}\n\n${table(['Réglage initial','Valeur proposée'],Object.entries(c.tuning).filter(([key])=>key!=='status'))}`).join('\n\n')}

Les confrontations restent limitées aux futurs bonus solo indiqués, désactivées en versus. Ces réglages sont des hypothèses d’équilibrage. Les fiches de production A à J de l’extension sont reliées aux enregistrements précis par \`productionSheetMap\` dans [extensions-teams-bonus.json](extensions-teams-bonus.json).

## 18 situations à exécuter sur la future implémentation

${table(['ID','Situation','Action','Résultat attendu'],TEAM_SCENARIOS.map(q=>[q.id,q.title,q.action,q.expected]))}
`);

add('BONUS_ARCHIVES_ET_DEBLOCAGES.md',`# Bonus, Archives des répétitions et récompenses

${AS_OF} · **8 bonus et un hub de 5 salles conçus, non jouables dans cette livraison documentaire.** Les sources complètes sont dans [extensions-teams-bonus.json](extensions-teams-bonus.json). Les stages actuels restent les références de lieux ; les objets nouveaux sont listés séparément.

## Épreuves facultatives

${bonuses.map(b=>`### ${b.id} — ${b.title}\n\n**Lieu : ${stageNames.get(b.stageId)} · ${b.fighterIds.map(id=>names.get(id)).join(', ')} · ${b.kind}**\n\n${b.premise}\n\n**Objectif :** ${b.objective}\n\n**Score :** ${b.scoring}\n\n**Échec et reprise :** ${b.failure}\n\n**État initial :** ${b.startingState.health} ${b.startingState.kitResource} Super à ${b.startingState.superMeter}. ${b.startingState.equipment} ${b.startingState.team}\n\n**Présentation :** ${b.entryScene.action} ${b.exitScene.action} Deux tableaux à produire, sans nouvelle animation présumée.\n\n**Sortie vers le récit :** ${b.nextStoryState}\n\n**Paramètres proposés à équilibrer :** ${Object.entries(b.tuning).filter(([k])=>k!=='status').map(([k,v])=>k+' = '+(v??'sans chronomètre')).join(' ; ')}.\n\n**Assets à produire :** ${b.assets.join(' ; ')}.\n\n**Vérification de charge :** ${b.performanceGate}\n\n**Récompense proposée :** ${b.rewardId}. ${b.narrativeInsertion}`).join('\n\n')}

## Les Archives des répétitions

${HUB.location} ${HUB.format}

**Avatar :** ${HUB.avatar}

**Outils et navigation :** ${HUB.tools} ${HUB.navigation}

**Économie :** ${HUB.economy}

${table(['Salle','Fonction','Récompenses proposées'],HUB.zones.map(z=>[z.id+' · '+z.title,z.function,z.rewardIds.join(', ')]))}

### Connexions et placement des portes

${HUB.coordinateSystem}

${table(['Lien réciproque','Seuil A','Seuil B','Arrivée en A / B','Repère'],HUB.connections.map(l=>[l.a+' ↔ '+l.b,l.aThreshold.join(', '),l.bThreshold.join(', '),l.aArrival.join(', ')+' / '+l.bArrival.join(', '),l.landmark]))}

Les quatre connexions rejoignent l’accueil. Les points de seuil se trouvent sur les murs et les arrivées dans l’intérieur de chaque salle. Ces coordonnées décrivent un contrat de plan, pas un niveau déjà construit ; collisions et accès seront inspectés dans le prototype réel.

**Sauvegarde :** ${HUB.save}

## Huit récompenses proposées

${table(['ID','Contenu','Catégorie','État'],REWARDS.map(r=>[r.id,r.title,r.category,'Brief uniquement ; aucun asset livré par cette passe']))}

## Règles de déblocage

${table(['ID','Condition et progression','Attribution','Permanence','Rétroactivité'],ACCESS_RULES.map(r=>[r.id,r.progress,r.claim,r.permanence,r.retroactive]))}

Les arbres ET/OU exacts sont dans [extensions-access.json](extensions-access.json). Une voie gratuite et une voie de soutien sont des sources alternatives indépendantes, pas deux obligations cumulées. Les bonus et le hub ne retirent aucun accès à la distribution libre actuelle.
`);

add('CONTRATS_DROITS_ET_SAUVEGARDE.md',`# Accès, verrous et sauvegarde

**Spécification du ${AS_OF} — aucun compte Patreon, offre payante ou registre serveur raccordé.** Les [données complètes](extensions-access.json) comprennent le catalogue actuel, les récompenses proposées, les règles et les scénarios.

## Quatre axes indépendants

${table(['Axe','États'],Object.entries(ACCESS_CONTRACT.dimensions).map(([key,values])=>[key,values.join(' · ')]))}

${ACCESS_CONTRACT.permanence} ${ACCESS_CONTRACT.legacyPolicy}

## Charte originale Encore

${LOCK_VISUAL.metaphor}

${table(['Élément','Traitement'],['fighter','costume','stage','mode','accessible'].map(key=>[key,LOCK_VISUAL[key]]))}

${table(['État de présentation','Traitement'],Object.entries(LOCK_VISUAL.animations))}

Les icônes de verrou, de droits, d’installation et de vérification sont des besoins de production. Un contenu non produit n’est pas déguisé en récompense verrouillée. La scène ou le personnage secret utilise un emblème neutre si sa silhouette révélerait son identité.

## Priorité et transactions

${ACCESS_CONTRACT.priority.map((s,i)=>`${i+1}. ${s}`).join('\n')}

${ACCESS_CONTRACT.grants}

${ACCESS_CONTRACT.claimTransaction.map((s,i)=>`${i+1}. ${s}`).join('\n')}

**Échec d’écriture :** ${ACCESS_CONTRACT.failedWrite}

**Champs d’une source :** ${ACCESS_CONTRACT.sourceLedgerFields.join(', ')}.

## Migration du profil existant

${table(['Responsabilité','Contrat'],Object.entries(ACCESS_CONTRACT.migration).map(([key,value])=>[key,Array.isArray(value)?value.join(', '):value]))}

Les faits \`stories\`, \`challenges\` et \`medals\` sont connus du profil actuel. Un score de bonus jamais enregistré, une transaction de soutien ou une découverte du futur hub ne sont pas inventés à la migration. La suppression volontaire d’un profil ne doit pas restaurer silencieusement une ancienne sauvegarde.

## Incidents, modes et droits des participants

${table(['Contexte','Règle'],['offline','matchSnapshot','fallback','guest','replay','training','antiSpoiler','stageParticipation'].map(key=>[key,ACCESS_CONTRACT[key]]))}

## Trois modèles de soutien, désactivés

${SUPPORT_BENEFITS.map(b=>`### ${b.id} — ${b.title}\n\nModèle : **${b.model}** ; actif : **non** ; fournisseur, campagne, niveaux, prix et dates : **non configurés**.\n\n**Attribution :** ${b.grantEvent}\n\n**Fin :** ${b.expiration}\n\n**Remboursement :** ${b.refund}\n\n**Hors ligne :** ${b.offline}`).join('\n\n')}

Les références D01–D04 sont conservées dans l’original de l’Extension 02 ; elles devront être revérifiées au moment d’un raccord réel au fournisseur. Aucun secret d’API, token ou admissibilité commerciale n’est confié à une sauvegarde locale.

## Textes et action utile

${table(['Texte','Condition d’emploi','Action'],access.userFacingStates.map(s=>[s.label,s.when,s.action]))}

## 22 scénarios à exécuter

${table(['ID','Situation','Précondition','Action','Attendu'],RIGHTS_SCENARIOS.map(q=>[q.id,q.title,q.precondition,q.action,q.expected]))}

Le statut de ces scénarios est **à exécuter**. Les contrôles du générateur portent sur la documentation, les IDs, les dépendances et les empreintes ; ils ne remplacent ni un test de fournisseur réel, ni un parcours UI, ni un test de sauvegarde du futur système.
`);

const ids=sections.flatMap(s=>s.requirements.map(r=>r.id));assert.equal(new Set(ids).size,ids.length);
const stale=[];
for(const [target,contents] of generated){
  if(validateOnly)continue;
  if(check){if(await read(target).catch(()=>null)!==contents)stale.push(target);}
  else {await fs.mkdir(path.dirname(path.join(root,target)),{recursive:true});await fs.writeFile(path.join(root,target),contents);}
}
assert.deepEqual(stale,[],'Generated extension documentation differs; run the generator before checking.');
console.log(JSON.stringify({mode:validateOnly?'validate-only':check?'check':'write',generatedFiles:generated.size,counts,validation:integration.validation},null,2));
