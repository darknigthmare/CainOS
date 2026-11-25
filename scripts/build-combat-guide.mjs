#!/usr/bin/env node
/** Deterministic documentation bridge. It does not alter the combat runtime. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { FIGHTERS, MOVES, STAGES, ALL_STAGES, DEDICATED_STAGES, COSTUMES, ROSTER_ARCHIVE, VARIANTS, CROSSOVER_COSTUMES } from '../combat/data.mjs';
import { CROSSOVER_STAGES } from '../combat/crossover-stages.mjs';
import { STORY_ROUTES } from '../combat/stories.mjs';
import { FINISHER_CATALOG } from '../combat/finisher-catalog.mjs';
import { FRIENDSHIP_CATALOG } from '../combat/friendship-catalog.mjs';
import { PROJECTILE_ART } from '../combat/projectile-art.mjs';
import { MODES, GAME_VERSION, DEFAULT_SETTINGS, makeRun } from '../combat/session.mjs';
import { FIXED_DT, ENGINE_RULES_VERSION, ARENA } from '../combat/engine.mjs';
import { ART_FILES, ART_BYTES, ART_VERSION, OFFLINE_VERSION } from '../combat/offline-manifest.mjs';
import { campaignIllustration } from '../combat/illustrations.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = 'docs/bible';
const check = process.argv.includes('--check');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = p => fs.readFile(path.join(root, p), 'utf8');
const design = JSON.parse(await read(`${dir}/guide-design.json`));
const guideBytes = await fs.readFile(path.join(root, design.sourceGuide));
const associations = JSON.parse(await read(`${dir}/character-associations.json`));
const fighters = new Map(FIGHTERS.map(f => [f.id, f]));
const stages = new Map(ALL_STAGES.map(s => [s.id, s]));
const name = id => id === 'narration' ? 'Narration' : fighters.get(id)?.name ?? id;
const stageName = id => stages.get(id)?.name ?? id;
const cell = value => String(value ?? 'À définir').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const table = (headers, rows) => ['| ' + headers.map(cell).join(' | ') + ' |', '| ' + headers.map(() => '---').join(' | ') + ' |', ...rows.map(row => '| ' + row.map(cell).join(' | ') + ' |')].join('\n');
const list = rows => rows.map(x => `- ${x}`).join('\n');
const link = p => `[${p}](../../${p})`;
const json = data => JSON.stringify(data, null, 2) + '\n';
const generated = new Map();
const outputs = ['README.md', 'COMBAT_GAMES_GUIDE_INTEGRATION.md', 'CAMPAGNE_GLOBALE.md', 'ARENES_TRANSITIONS_BOSS.md', 'DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md', 'MODELES_ET_CRITERES.md', 'guide-integration.json'].map(f => `${dir}/${f}`);
const outputSet = new Set(outputs);
const add = (name, content) => generated.set(`${dir}/${name}`, content.trimEnd() + '\n');

assert.equal(design.schema, 'encore-general-guide-design/v1');
assert.equal(design.sections.length, 30);
assert.deepEqual(design.sections.map(s => s.section), Array.from({ length: 30 }, (_, i) => String(i).padStart(2, '0')));
const requirements = design.sections.flatMap(s => s.requirements);
assert.equal(requirements.length, 100);
assert.equal(new Set(requirements.map(r => r.id)).size, requirements.length);
for (const section of design.sections) {
  for (const key of ['id', 'title', 'decision', 'priority', 'runtimeStatus', 'adaptation', 'verification']) assert.ok(section[key], `${section.id}: ${key}`);
  for (const r of section.requirements) assert.ok(r.id.startsWith(`${section.id}-`) && r.text, r.id);
  for (const p of section.links) if (!outputSet.has(p)) await fs.access(path.join(root, p));
}
const campaign = design.campaign;
assert.equal(campaign.status, 'designed-not-integrated');
assert.equal(campaign.chapters.length, 12);
assert.deepEqual(campaign.chapters.map(c => c.order), Array.from({ length: 12 }, (_, i) => i + 1));
const scenes = campaign.chapters.flatMap(c => c.scenes);
assert.equal(scenes.length, 36);
assert.equal(new Set(scenes.map(s => s.id)).size, 36);
assert.equal(new Set(scenes.map(s => s.assetId)).size, 36);
for (const chapter of campaign.chapters) {
  assert.ok(fighters.has(chapter.playerId) && fighters.has(chapter.opponentId) && stages.has(chapter.stageId), chapter.id);
  assert.equal(chapter.implementation, 'not-integrated');
  assert.equal(chapter.scenes.length, 3);
  assert.ok(campaign.acts.find(a => a.id === chapter.act)?.chapters.includes(chapter.order), chapter.id);
  for (const scene of chapter.scenes) {
    assert.ok(stages.has(scene.stageId), scene.id);
    assert.equal(scene.status, 'brief-only-image-not-produced');
    assert.equal(new Set(scene.cast).size, scene.cast.length, scene.id);
    for (const id of scene.cast) assert.ok(fighters.has(id), `${scene.id}/${id}`);
    for (const line of scene.dialogue) assert.ok(scene.cast.includes(line.speakerId) || line.speakerId === 'narration', `${scene.id}/${line.speakerId}`);
    for (const key of ['action', 'framing', 'emotion', 'continuity', 'light', 'costumes', 'textSafeArea', 'nativeFormat', 'soundIntent']) assert.ok(scene[key], `${scene.id}/${key}`);
  }
}
assert.equal(design.stageLinks.length, 6);
assert.equal(new Set(design.stageLinks.map(l => l.id)).size, 6);
for (const l of design.stageLinks) {
  assert.ok(stages.has(l.fromStageId) && stages.has(l.toStageId) && l.fromStageId !== l.toStageId, l.id);
  assert.equal(l.ruleContract, design.transitionRules.id);
  assert.equal(l.status, 'design-only-not-integrated');
}
assert.deepEqual(design.bosses.map(b => b.fighterId), makeRun('boss', 'pomni', FIGHTERS, STAGES).opponents);
assert.equal(associations.characters.length, FIGHTERS.length);
assert.deepEqual(associations.characters.map(c => c.fighterId ?? c.id).sort(), FIGHTERS.map(f => f.id).sort());

const routes = Object.values(STORY_ROUTES);
const panels = routes.flatMap(r => [...r.prologue, ...r.epilogue]);
const dedicatedPanelPaintings = routes.reduce((n, r) => n + [...r.prologue, ...r.epilogue].filter(p => campaignIllustration(r.fighterId, p.id)).length, 0);
const runtime = {
  gameVersion: GAME_VERSION, rulesVersion: ENGINE_RULES_VERSION, simulationHz: 1 / FIXED_DT,
  arena: ARENA, defaultSettings: { seconds: DEFAULT_SETTINGS.seconds, roundsToWin: DEFAULT_SETTINGS.rounds, difficulty: DEFAULT_SETTINGS.difficulty },
  counts: {
    fighters: FIGHTERS.length, moves: MOVES.length, modes: MODES.length, archiveEntries: ROSTER_ARCHIVE.length,
    costumes: COSTUMES.length, archiveCostumes: VARIANTS.length, additionalCircusCostumes: COSTUMES.filter(c => !VARIANTS.some(v => v.id === c.id) && !CROSSOVER_COSTUMES.some(v => v.id === c.id)).length,
    crossoverCostumes: CROSSOVER_COSTUMES.length, stages: STAGES.length,
    nonCrossoverStages: STAGES.length - CROSSOVER_STAGES.length, crossoverStages: CROSSOVER_STAGES.length,
    dedicatedArrangements: DEDICATED_STAGES.length, allStageDefinitions: ALL_STAGES.length,
    storyRoutes: routes.length, storyEncounters: routes.reduce((n, r) => n + r.chapters.length, 0), storyPanels: panels.length,
    dedicatedIntroOutroPaintings: dedicatedPanelPaintings, composedIntroOutroPanels: panels.length - dedicatedPanelPaintings,
    finishers: FINISHER_CATALOG.length, friendships: FRIENDSHIP_CATALOG.length, projectileMotifs: Object.keys(PROJECTILE_ART).length,
    imagesDeclaredInOfflineManifest: ART_FILES.length, bytesDeclaredInOfflineManifest: ART_BYTES
  },
  offlineVersion: OFFLINE_VERSION, artVersion: ART_VERSION,
  inventoryScope: 'Comptage des définitions et du manifeste publiés ; aucune nouvelle inspection de tous les fichiers image ou mesure de performances dans cette passe.',
  modes: MODES.map(({ id, name, description }) => ({ id, name, description })),
  stages: STAGES.map(s => ({ id: s.id, name: s.name, class: CROSSOVER_STAGES.some(c => c.id === s.id) ? 'crossover' : 'non-crossover' }))
};
const sourceFiles = ['combat/data.mjs', 'combat/session.mjs', 'combat/engine.mjs', 'combat/stories.mjs', 'combat/abstractions-narrative.mjs', 'combat/finisher-catalog.mjs', 'combat/friendship-catalog.mjs', 'combat/projectile-art.mjs', 'combat/crossover-stages.mjs', 'combat/illustrations.mjs', 'combat/offline-manifest.mjs'];
const sourceHashes = {};
for (const f of sourceFiles) sourceHashes[f] = sha(await fs.readFile(path.join(root, f)));
const counts = { sections: design.sections.length, requirements: requirements.length, characterAssociations: associations.characters.length, globalCampaigns: 1, globalChapters: campaign.chapters.length, globalSceneBriefs: scenes.length, plannedStageLinks: design.stageLinks.length, bossContracts: design.bosses.length, generatedImages: 0, implementedNewModes: 0, implementedStageLinks: 0 };
const integration = {
  schema: 'encore-guide-integration/v1', version: design.version, asOf: design.asOf, timezone: design.timezone,
  baselineCommit: design.baselineCommit,
  sourceGuide: { path: design.sourceGuide, sha256: sha(guideBytes), bytes: guideBytes.length, preservedVerbatim: true },
  counts, runtime, sourceHashes,
  associationFile: `${dir}/character-associations.json`, designFile: `${dir}/guide-design.json`,
  sections: design.sections, stageLinkIds: design.stageLinks.map(l => l.id), campaignId: campaign.id,
  statusAxes: {
    lore: 'Références du dépôt conservées avec leurs limites ; nouveaux récits, connexions et termes éditoriaux originaux Encore ; fidélité 1:1 non certifiée.',
    design: '30 décisions de rubrique, 100 exigences, 12 chapitres/36 briefs et six connexions spécifiés.',
    assets: 'Zéro image produite ; les chemins du manifeste existant sont inventoriés sans nouvelle revue de tous les visuels.',
    integration: 'Documentation, associations et suivi ; aucun nouveau mode, lien de stage ou changement de simulation.',
    tests: 'Validation documentaire et références vérifiées par les générateurs ; preuve du classeur dans combat-guide-workbook-verification.json ; historique des tests moteur conservé comme historique.',
    publication: 'Fichiers destinés à la branche de PR ; la présence dans un commit ne constitue pas une fusion ou une mise en production.'
  },
  limitations: ['Les seuils et durées de transition sont des propositions à équilibrer.', 'Les phases spécifiques de boss restent à détailler et intégrer.', 'Les champs de combat absents des données ne reçoivent pas de valeur fictive.', 'Les doublons de cast observés restent des écarts du runtime tant qu’une correction distincte n’est pas livrée.'],
  sources: design.sources
};
add('guide-integration.json', json(integration));

const statRows = [
  ['Combattants / techniques', `${runtime.counts.fighters} / ${runtime.counts.moves}`, 'Définitions jouables'],
  ['Modes standards', runtime.counts.modes, 'Les Escales GLITCH sont des visites supplémentaires'],
  ['Costumes / archives', `${runtime.counts.costumes} / ${runtime.counts.archiveEntries}`, 'Identités, apparences et entrées d’archive distinctes'],
  ['Arènes du catalogue', `${runtime.counts.stages} = ${runtime.counts.nonCrossoverStages} + ${runtime.counts.crossoverStages}`, 'Les neuf crossovers sont déjà inclus dans 27'],
  ['Arrangements dédiés', runtime.counts.dedicatedArrangements, 'Décors réutilisés ; 91 définitions de stage au total'],
  ['Routes / rencontres / tableaux', `${runtime.counts.storyRoutes} / ${runtime.counts.storyEncounters} / ${runtime.counts.storyPanels}`, 'Histoires individuelles déjà présentes'],
  ['Peintures intro/outro / compositions', `${dedicatedPanelPaintings} / ${runtime.counts.composedIntroOutroPanels}`, 'Comptage via le sélecteur réel et le manifeste ; une composition ne signifie pas une image cassée'],
  ['Finales / amitiés / motifs de projectile', `${runtime.counts.finishers} / ${runtime.counts.friendships} / ${runtime.counts.projectileMotifs}`, 'Adaptations de spectacle existantes'],
  ['Illustrations déclarées', runtime.counts.imagesDeclaredInOfflineManifest, 'Inventaire du paquet existant, pas une nouvelle production']
];
const sectionMatrix = table(['ID', 'Rubrique', 'Priorité', 'Décision', 'État observé'], design.sections.map(s => [s.id, s.title, s.priority, s.decision, s.runtimeStatus]));
const sectionDetails = design.sections.map(s => `## ${s.section} — ${s.title}\n\n**${s.id} · ${s.priority} · ${s.decision} · ${s.runtimeStatus}**\n\n${s.adaptation}\n\n${list(s.requirements.map(r => `**${r.id}** — ${r.text}`))}\n\n**Acceptation :** ${s.verification}\n\n**Associations :** ${s.links.map(link).join(' ; ')}.`).join('\n\n');
add('COMBAT_GAMES_GUIDE_INTEGRATION.md', `# Guide général de combat — application à Digital Circus — Encore

Révision ${design.version} · ${design.asOf} · phase **bases et illustrations fixes**.

Le [guide utilisateur v1.0](references/Combat_Games_Guide_General_v1.0.txt) est intégré comme cadre de conception de la [bible principale](../DIGITAL_CIRCUS_ENCORE.md). Ses 30 rubriques sont reliées à 100 exigences identifiables, aux sources actuelles du jeu et aux contrats ci-dessous. Il ne déclenche pas automatiquement la réalisation de toutes les fonctionnalités qu’il cite.

## Décisions qui structurent Encore

Le jeu reste un duel latéral Canvas, partagé entre CainOS et l’entrée autonome. La comédie psychologique surréaliste décrite par [GLITCH](https://www.glitchprod.com/digital-circus) guide le ton : identité reconnaissable, humour inquiet, enjeux situés et conséquences de spectacle. Les chiffres de combat, intrigues jouables et croisements d’univers sont des adaptations ou créations Encore, sans attestation de pouvoirs officiels.

Les routes personnelles existantes conservent leur identité. Une [campagne commune](CAMPAGNE_GLOBALE.md) est maintenant écrite comme proposition distincte : trois actes, douze chapitres et 36 briefs de scènes fixes. Les [six liaisons d’arène et quatre contrats de boss](ARENES_TRANSITIONS_BOSS.md) sont des conceptions à intégrer ultérieurement. Les [Derniers Actes et Rappels](DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md) encadrent la présentation des conclusions ; ces noms éditoriaux ne renomment pas les titres du runtime.

La production reste en phase statique : aucun nouveau cycle d’animation, aucune voix ni image n’est créé par cette intégration. Réseau, tag, hub explorable et machine originale combattable restent différés. Les animations et présentations déjà présentes conservent leur statut existant.

## État de référence vérifié

Base : [${design.baselineCommit.slice(0, 7)}](https://github.com/darknigthmare/CainOS/commit/${design.baselineCommit}) ; jeu ${GAME_VERSION}, règles ${ENGINE_RULES_VERSION}, simulation ${1 / FIXED_DT} Hz. Les valeurs ci-dessous viennent des modules du jeu. Les réglages de menu par défaut sont ${DEFAULT_SETTINGS.seconds} secondes, ${DEFAULT_SETTINGS.rounds} manches gagnantes et difficulté ${DEFAULT_SETTINGS.difficulty} ; ils sont distincts d’un éventuel défaut interne du constructeur du moteur.

${table(['Population', 'Compte', 'Interprétation'], statRows)}

Le total de 36 arènes figurant dans certaines synthèses antérieures comptait deux fois les neuf crossovers. Le compte courant est corrigé à 27. Les rapports de validation datés restent des preuves historiques de leur propre lot ; leurs nombres de tests ne sont pas revendiqués comme exécutés dans cette passe.

## Lecture des statuts

${table(['Axe', 'Preuve attendue'], Object.entries(integration.statusAxes))}

« Existant » indique un système trouvé dans les sources ; cela ne ferme pas toutes les exigences de sa rubrique. « Partiel » exige encore un travail identifié. « Conçu, non intégré » désigne une spécification, sans fonctionnalité jouable supplémentaire. Aucune moyenne de ces états ne devient un pourcentage de livraison.

## Matrice des 30 rubriques

${sectionMatrix}

${sectionDetails}

## Fiches et prochaines passes

Les [64 associations de personnages](ASSOCIATIONS_PERSONNAGES.md) relient les identités, dix slots, routes, rivaux, tableaux, finales, costumes et rôles globaux. Les [modèles A–J et critères de livraison](MODELES_ET_CRITERES.md) indiquent les champs connus, les champs à compléter et la preuve requise avant de changer un statut.

Prochaine tranche proposée : vérifier une identité et ses bases fixes, puis relire une route représentative et le premier chapitre global. Une éventuelle transition commence par un seul lien jouable, avant les autres connexions. Chaque tranche reprend les IDs ouverts et garde les niveaux lore/conception/assets/intégration/test/publication séparés.

## Traçabilité

L’original est conservé sans modification : SHA-256 \`${sha(guideBytes)}\`, ${guideBytes.length} octets. [guide-design.json](guide-design.json) contient les décisions et les scènes ; [guide-integration.json](guide-integration.json) conserve les comptages et empreintes des sources. Le [classeur](../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) ajoute la feuille **Guide combat** et conserve les notes historiques.

Reconstruction : \`node scripts/build-combat-guide-associations.mjs\`, puis \`node scripts/build-combat-guide.mjs\`. Contrôle sans écriture : les mêmes commandes avec \`--check\`. Le résultat du classeur est contrôlé séparément par sa preuve de publication. Les fichiers de combat et le manifeste hors ligne ne sont pas modifiés par ces générateurs.
`);

const sharedArt = scenes[0];
const chapterText = campaign.chapters.map(c => `## ${String(c.order).padStart(2, '0')} — ${c.title}\n\n**${c.id} · Acte ${c.act} · conçu, non intégré**\n\n**Duel :** ${name(c.playerId)} contre ${name(c.opponentId)} — ${stageName(c.stageId)} (\`${c.stageId}\`).\n\n**Objectif :** ${c.objective}\n\n**Pourquoi se battre :** ${c.whyFight}\n\n**Révélation :** ${c.revelation}\n\n**Conséquence :** ${c.consequence}\n\n${table(['Règle de parcours', 'Contrat cible'], Object.entries(c.gameplay))}\n\n${c.scenes.map(s => `### ${s.role} — ${s.id}\n\n**Acteurs :** ${s.cast.map(name).join(', ')}. **Asset prévu :** \`${s.assetId}\` — brief écrit, image non produite.\n\n**Action :** ${s.action}\n\n**Cadrage :** ${s.framing}\n\n**Émotion :** ${s.emotion}\n\n**Dialogues proposés :**\n\n${list(s.dialogue.map(l => `**${name(l.speakerId)} :** « ${l.text} »`))}\n\n**Raccord :** ${s.continuity}\n\n**Son :** ${s.soundIntent}`).join('\n\n')}`).join('\n\n');
add('CAMPAGNE_GLOBALE.md', `# La Répétition impossible

**${campaign.id} · proposition originale Encore · conçue, non intégrée**

[Retour à l’intégration](COMBAT_GAMES_GUIDE_INTEGRATION.md) · [Associations des personnages](ASSOCIATIONS_PERSONNAGES.md)

## Intention et continuité

${campaign.continuity}

${campaign.premise}

${campaign.conflict}

Cette campagne forme un parcours commun avec points de vue alternés. Elle ne remplace ni les 64 histoires personnelles de quatre combats ni l’Arcade de six matchs. Ses dialogues, connexions dramatiques et résolutions sont des créations Encore. Les revenants sont annoncés comme instances de simulation ; aucune scène ne rétablit une vie humaine, une mémoire officielle ou une guérison d’abstraction.

## Les trois actes

${table(['Acte', 'Intention', 'Chapitres'], campaign.acts.map(a => [a.id, a.title, a.chapters.join(', ')]))}

${table(['Chapitre', 'Point de vue', 'Adversaire', 'Lieu'], campaign.chapters.map(c => [`${c.order}. ${c.title}`, name(c.playerId), name(c.opponentId), stageName(c.stageId)]))}

## Direction commune des 36 scènes fixes

${list([sharedArt.light, sharedArt.costumes, sharedArt.textSafeArea, sharedArt.nativeFormat, 'Une illustration raconte une action précise ; les scènes collectives restent possibles. Aucun de ces 36 identifiants ne désigne un fichier déjà généré.', 'Au chapitre 4, le Gloink qui dépose le marqueur est un figurant secondaire du brief, hors du cast principal Zooble/Gloink Queen ; il ne devient pas un combattant supplémentaire.'])}

${chapterText}

## Sauvegarde et reprise à intégrer

Espace proposé : \`${campaign.saveContract.newNamespace}\`, schéma ${campaign.saveContract.proposedSchema}. Champs : ${campaign.saveContract.fields.map(f => `\`${f}\``).join(', ')}.

${campaign.saveContract.migration}

${campaign.saveContract.exit}

${campaign.saveContract.rewards}

**Critères avant de déclarer le mode jouable :**\n\n${list(campaign.saveContract.acceptance)}

Les contrôles de cette livraison valident les identifiants et le document. Les tests de parcours, de sauvegarde et de scènes ci-dessus restent à exécuter sur une future implémentation.
`);

const ruleLabels = { coordinateSystem: 'Repère', allowedModes: 'Modes futurs admissibles', disabledModes: 'Modes sans liaison', activation: 'Activation', thresholds: 'Seuil proposé', priority: 'Priorités', presentation: 'Durée et confort', state: 'État du duel', arrival: 'Arrivée', recovery: 'Reprise de contrôle', loading: 'Chargement', replay: 'Replay' };
const transitions = design.stageLinks.map(l => `### ${l.id} — ${l.name}\n\n**${stageName(l.fromStageId)} → ${stageName(l.toStageId)}** · côté ${l.side} · une direction par match. Géographie originale Encore, non intégrée.\n\n**Déclencheur :** ${l.trigger}\n\n**Réponse adverse :** ${l.counterplay}\n\n**Repère d’arrivée :** ${l.arrivalLandmark}\n\n**Assets à prévoir :** ${l.assetsRequired.join(' ; ')}. Contrat commun : \`${l.ruleContract}\`.`).join('\n\n');
const bosses = design.bosses.map(b => `### ${name(b.fighterId)} — \`${b.fighterId}\`\n\n**Existant :** duel du Boss Rush actuel. ${b.role}\n\n**Évolution proposée :** ${b.proposedPhases}\n\n**Annonce :** ${b.telegraph}\n\n**Réponse adverse :** ${b.counterplay}\n\n**Conclusion :** ${b.finish}\n\n**Validation future :** ${b.checks.join(' ; ')}.`).join('\n\n');
add('ARENES_TRANSITIONS_BOSS.md', `# Arènes, connexions et boss

**Contrats de conception Encore — aucune connexion ni phase de boss nouvelle intégrée.**

## Catalogue réel et quatre axes séparés

Le jeu possède ${STAGES.length} arènes : ${STAGES.length - CROSSOVER_STAGES.length} hors crossovers et ${CROSSOVER_STAGES.length} escales GLITCH, plus ${DEDICATED_STAGES.length} arrangements dédiés. Une étape de route change de décor entre deux combats ; elle ne prouve pas une connexion utilisable au milieu d’un duel.

${table(['Axe', 'Question', 'État courant / cible'], [
  ['Présentation', 'Le fond bouge-t-il ?', 'Ambiances et reducedMotion présents ; options vivant/statique/réduit à préciser.'],
  ['Interactions', 'Un objet répond-il à une action ?', 'Contrat à définir par objet ; aucun interrupteur global nouvellement livré.'],
  ['Dangers', 'Le décor change-t-il les dégâts ou collisions ?', 'Le duel courant garde sa surface sans danger aléatoire ; dangers futurs désactivés par défaut.'],
  ['Transitions', 'Peut-on changer de stage pendant le duel ?', 'Six liens conçus ci-dessous, zéro intégré.']
])}

${table(['Profil cible', 'Présentation', 'Interactions', 'Dangers', 'Transitions'], design.stageProfiles.map(p => [p.name, p.presentation, p.interactions, p.hazards, p.transitions]))}

Le confort modifie la présentation, pas silencieusement les règles du match. Ces profils sont des contrats cibles ; aucun nouveau menu n’est revendiqué.

## Six connexions originales

${transitions}

## ${design.transitionRules.id} — contrat commun

${table(['Responsabilité', 'Règle proposée'], Object.entries(ruleLabels).map(([key, label]) => [label, Array.isArray(design.transitionRules[key]) ? design.transitionRules[key].join(', ') : design.transitionRules[key]]))}

Les deux impacts de rupture, 90 ticks de présentation et 30 ticks de reprise sont des paramètres de départ à équilibrer. Ils ne décrivent pas le comportement actuel du moteur. Aucun de ces liens n’impose une géographie canonique.

**Situations à tester avant intégration :**\n\n${list(design.transitionRules.verification)}

## Boss : conserver l’existant et spécifier les écarts

Le Boss Rush actuel suit l’ordre ${design.bosses.map(b => name(b.fighterId)).join(' → ')}. Choisir un de ces personnages en Versus ne crée pas une rencontre à phases. Une sélection autonome **Boss Combat** et les déclencheurs de phases restent à concevoir et à intégrer.

${bosses}

## Extensions différées

${table(['ID', 'Extension', 'Motif'], design.deferred.map(d => [d.id, d.item, d.reason]))}

## Sources et association

[Données et contrats éditoriaux](guide-design.json) · [Matrice 00–29](COMBAT_GAMES_GUIDE_INTEGRATION.md) · [Moteur](../../combat/engine.mjs) · [Modes et Boss Rush](../../combat/session.mjs) · [Catalogue d’arènes](../../combat/data.mjs).
`);

const f = design.finisherContract;
const finaleSample = FINISHER_CATALOG.find(x => x.id === 'pomni.impact');
add('DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md', `# Direction artistique et conclusions de duel

## Identité, anatomie et statut des références

La cible conserve des silhouettes nettes, des compositions 2D de haute définition et les proportions propres à chaque personnage. « Fidélité 1:1 » signifie fidélité à une référence d’identité et d’apparence identifiée ; ce n’est pas une consigne d’image carrée. Une image exportée, un test technique ou un agrandissement ne certifie pas cette fidélité.

Les [associations de personnages](character-associations.json) conservent la provenance fournie par le jeu. Les attributions d’archive incertaines ne deviennent pas officielles. Les crossovers Hommage/Résident/Fusion sont des créations Encore ; ils ne transmettent pas automatiquement les pouvoirs des œuvres invitées.

Queenie ne reçoit ni bras ni épaules humains inventés. Bubble reste sphérique et s’exprime par corps, bouche et regard ; un geste écrit ne lui ajoute pas de main. Gloink Queen conserve son volume et ses appendices. Chinese Room ne reçoit ni poings humains ni biographie nouvelle. Les abstractions gardent leur forme : une conclusion ne les guérit pas et ne les transforme pas en humain.

## Vocabulaire de bible

${table(['Terme', 'Fonction'], Object.entries(f.terms))}

« Dernier Acte » et « Rappel » sont des appellations éditoriales proposées pour Encore. Le catalogue conserve ses ${FINISHER_CATALOG.length} finales, leurs IDs \`impact/special/super\`, leurs titres et ses ${FRIENDSHIP_CATALOG.length} numéros d’amitié. Le mot \`super\` dans l’ID d’une finale ne confond pas la présentation après verdict avec le coup de jauge exécuté pendant le combat.

## Contrat des conclusions

${f.conditions}

${table(['Morphologie cible', 'Règle de mise en scène'], f.morphologies.map(m => [m.id, m.rule]))}

${f.presentation}

${f.skip}

Les adaptations morphologiques et alternatives décrites ici sont des critères pour les futures mises en scène ; leur présence dans la bible ne certifie pas que chaque combinaison de cibles a été testée. ${f.nameStatus}

### Exemple relié au catalogue : ${finaleSample.title}

ID \`${finaleSample.id}\`, ${finaleSample.durationFrames} ticks de présentation, soit ${finaleSample.durationFrames / 60} secondes à 60 Hz ; il ne s’agit pas de ${finaleSample.durationFrames} fichiers image. ${finaleSample.adaptation}

${table(['Tick de présentation', 'Temps', 'Action décrite'], finaleSample.beats.map(b => [b.frame, b.title, b.description]))}

Les ${FINISHER_CATALOG.length} finales sont reliées dans [l’index des personnages](ASSOCIATIONS_PERSONNAGES.md). Cet exemple utilise le titre déjà livré ; il ne crée pas une scène officielle de la série.

## Production d’images et contrôle

Un sprite demandé détouré exige un alpha réel, son orientation native, ses ancrages et ses marges. Un fichier de portrait et un fichier de garde constituent le lot d’une base statique ; les dessins d’action et cycles complets ne sont pas annoncés comme produits lorsqu’ils sont absents. Les scènes narratives peuvent réunir plusieurs acteurs mais gardent une action claire, un cadrage et les sous-titres hors image.

Chaque source conserve son ID, ses dimensions natives, sa provenance, son SHA-256 et son usage. La revue vérifie silhouette, membres, asymétries, tenue, accessoires, lisibilité et taille dans le jeu. Les nouvelles scènes de campagne sont des briefs ; leurs illustrations restent à créer. Les ${dedicatedPanelPaintings} peintures intro/outro existantes et ${runtime.counts.composedIntroOutroPanels} compositions sont à relire avant de décider d’un remplacement.

Les nouveaux cycles d’animation, voix et cinématiques animées attendent une phase dédiée. Les éléments déjà présents sont conservés, sans nouvelle certification artistique globale dans cette livraison.

Sources : [guide fourni, fiches B/D/F/J](references/Combat_Games_Guide_General_v1.0.txt), [catalogue des finales](../../combat/finisher-catalog.mjs), [numéros d’amitié](../../combat/friendship-catalog.mjs), [règles de déclenchement](../../combat/finishers.mjs), [fidélité](../../combat/fidelity.mjs), [illustrations](../../combat/illustrations.mjs).
`);

const templates = [
 ['A — Projet', 'digital-circus-encore', 'guide-design.json', 'Identité, continuité, piliers, deux entrées, phases et périmètre sont renseignés. Les neuf modes et les comptes viennent du runtime.', 'Objectifs de performances à mesurer sur une configuration nommée ; plateformes supplémentaires et réseau différés.'],
 ['B — Personnage', 'pomni puis les 63 autres IDs du roster', 'character-associations.json', 'Identité, rôle, références existantes, dix actions, rival, route, finales, costumes, stage dédié et rôles globaux sont reliés.', 'Comparaison visuelle primaire, particularités anatomiques et qualité de chaque scène se valident individuellement ; aucun label global 1:1.'],
 ['C — Action ou projectile', 'pomni / special ; motif juggle', '../../combat/projectile-art.mjs', 'Associer le propriétaire, le slot, la commande réelle et les champs startup/active/recovery, dégâts, coûts, portée et trajectoire effectivement définis.', 'Touche/garde/contre/échec, avantage, cancels et interactions sont à établir à partir du moteur ; absent reste absent, sans zéro inventé.'],
 ['D — Finisher', 'pomni.impact ; pomni.friendship', 'DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md', 'ID, titre existant, trois temps, durée et justification conservés. Conditions après verdict, morphologies, cadrage de remplacement et retour résultat sont encadrés.', 'Tester cible petite, géante, sans membres et composite ; ne pas déduire une mort ou une guérison du spectacle.'],
 ['E — Route individuelle', 'STORY_ROUTES.pomni et les 63 autres routes', 'ASSOCIATIONS_PERSONNAGES.md', 'Motivation, rival, quatre combats et six tableaux du jeu sont reliés. Les rôles globaux proposés restent séparés.', 'Approfondir les conséquences et la continuité visuelle ; toute réécriture de dialogue doit être intégrée et revue avant de remplacer le texte joué.'],
 ['F — Chapitre et scène narrative', 'EN-CAM-CH01 / EN-CAM-CH01-INTRO', 'CAMPAGNE_GLOBALE.md', 'Joueur, adversaire, lieu, objectif, révélation, conséquence, trois scènes, dialogues, costumes, lumière, cadrage, émotion et checkpoint sont spécifiés.', '36 images à produire puis lecteur et progression à intégrer ; les identifiants d’assets ne sont pas des fichiers livrés.'],
 ['G — Arène', 'bigtop ; 26 autres stages', '../../combat/data.mjs', 'ID existant, nom, plans et repère 1280 × 720 reliés ; sol y=568 et limites x=65..1215. Les quatre axes de règles sont séparés.', 'Source de chaque lieu, lisibilité sur tous les corps, coûts mesurés et versions de présentation à contrôler ; les arrangements ne deviennent pas des lieux nouveaux.'],
 ['H — Événement, interaction ou transition', 'EN-LINK-001 / EN-LINK-RULES-01', 'ARENES_TRANSITIONS_BOSS.md', 'Départ, arrivée, côté, déclencheur, réponse, états, chrono, priorité KO, durée cible, chargement et replay sont définis.', 'Implémenter un lien complet, équilibrer les seuils puis vérifier les cas limites avant de décliner les six connexions.'],
 ['I — Boss', 'gloinkqueen ; fudge ; abstractedkaufmo ; caine', 'ARENES_TRANSITIONS_BOSS.md', 'Ordre du Boss Rush, gabarits, signaux, réponses et contrats de conclusion sont reliés au mode réel.', 'Déclencheurs et budgets chiffrés des phases à définir ; sélection Boss Combat et machine originale ne sont pas livrées.'],
 ['J — Asset et suivi', 'en-global-ch01-intro, identifiant de brief', '../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx', 'Catégorie, propriétaire, référence, dimensions cibles, transparence selon usage, ancrages, dépendances et six statuts doivent être renseignés.', 'Pour un asset non produit : fichier source/intégré null, dimensions réelles et SHA absents. Après création : revue visuelle, preuve technique puis intégration testée.']
];
const gates = [
 ['Fiche', 'ID stable, source et portée, associations existantes, inconnues explicites, six axes de statut, contrôle des liens.'],
 ['Sprite fixe', 'Source native, dimensions/alpha, cadrage et anatomie contrôlés, aperçu à taille de jeu, intégration du portrait et de la garde.'],
 ['Combattant', 'Identité/kit/ressource et dix slots reliés ; commandes, collisions, tailles adverses, états de résultat et costumes vérifiés.'],
 ['Arène', 'Sol, limites, couches et signalétique lisibles ; quatre axes annoncés ; coût mesuré et parcours dans les deux entrées contrôlé.'],
 ['Boss', 'Conditions/annonces/ouvertures et issues décrites ; chaque famille de combattant dispose d’une réponse ; reprise et résultat testés.'],
 ['Route', 'Quatre rencontres cohérentes et six tableaux lisibles ; rival, dialogue, victoire/défaite, reprise, galerie et sources contrôlés.'],
 ['Mode global', 'Douze chapitres jouables, sous-titres et passage des scènes, checkpoints, migration, difficulté et récompenses testés ; briefs seuls insuffisants.'],
 ['Publication', 'Commit identifié, preuves liées à la version, état réel de PR indiqué ; une PR ouverte reste distincte d’une livraison de production.']
];
add('MODELES_ET_CRITERES.md', `# Fiches A–J et critères de livraison

Les formulaires complets restent dans le [guide source, section 27](references/Combat_Games_Guide_General_v1.0.txt). Cette page les associe à Encore ; elle n’invente pas de champs mécaniques absents. Chaque nouvelle fiche porte un ID, une version, une source ou justification, des dépendances et six états séparés : lore, conception, assets, intégration, test, publication.

${templates.map(([title, example, target, present, remaining]) => `## ${title}\n\n**Exemple :** ${example}. [Fichier associé](${target}).\n\n**À reprendre :** ${present}\n\n**À compléter ou à vérifier :** ${remaining}`).join('\n\n')}

## Quand une unité peut-elle être déclarée terminée ?

${table(['Unité', 'Preuve minimale pour l’étape concernée'], gates)}

## Instruction pour la prochaine passe

Lire la [matrice d’intégration](COMBAT_GAMES_GUIDE_INTEGRATION.md), la [bible principale](../DIGITAL_CIRCUS_ENCORE.md), les associations et la preuve correspondant au lot. Choisir un ensemble d’IDs cohérent avec la phase statique. Compléter le contenu, relier ses sources et fichiers, vérifier le résultat demandé, puis mettre à jour uniquement les statuts effectivement prouvés. Conserver les notes utilisateur et les résultats historiques. Aucun décompte d’images, de lignes de bible ou de tests ne remplace une comparaison visuelle primaire.

Les contraintes de la session utilisateur priment sur le guide générique. Une demande documentaire ne déclenche pas implicitement réseau, refonte moteur, animation ou nouvelle production d’images.
`);

add('README.md', `# Bible associée — Digital Circus — Encore

Le [guide général de combat v1.0](references/Combat_Games_Guide_General_v1.0.txt) est désormais associé à la [bible du jeu](../DIGITAL_CIRCUS_ENCORE.md), à ses sources actuelles et au [classeur de suivi](../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx).

## Lire et poursuivre

${table(['Document', 'Rôle'], [
  ['[Intégration du guide](COMBAT_GAMES_GUIDE_INTEGRATION.md)', '30 rubriques, 100 exigences, périmètre retenu, différé et preuves attendues.'],
  ['[Associations des personnages](ASSOCIATIONS_PERSONNAGES.md)', '64 identités reliées aux techniques, rivaux, routes, tableaux, finales et rôles globaux.'],
  ['[La Répétition impossible](CAMPAGNE_GLOBALE.md)', 'Campagne commune originale : 3 actes, 12 chapitres, 36 scènes fixes écrites, non intégrées.'],
  ['[Arènes, connexions et boss](ARENES_TRANSITIONS_BOSS.md)', 'Quatre axes de stage, 6 liaisons proposées et 4 contrats de boss.'],
  ['[Direction artistique et Derniers Actes](DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md)', 'Anatomie, fidélité, conclusions après verdict, cibles compatibles et production statique.'],
  ['[Fiches A–J et critères](MODELES_ET_CRITERES.md)', 'Modèles associés au projet et définition de terminé pour chaque étape.']
])}

## Périmètre de cette intégration

Les ${FIGHTERS.length} combattants, ${MOVES.length} techniques, ${COSTUMES.length} costumes et ${STAGES.length} arènes sont ceux du runtime existant ; les ${CROSSOVER_STAGES.length} crossovers sont inclus dans les arènes. La campagne globale, les six connexions et les nouvelles phases de boss sont des propositions de conception. Cette passe produit de la documentation et du suivi, **zéro image, zéro nouvelle animation et zéro mode jouable supplémentaire**.

Le récit s’inspire du ton du Circus, tout en identifiant ses créations Encore. La fidélité canonique 1:1 n’est pas certifiée globalement. Les anciennes preuves de tests restent datées ; seuls les contrôles réellement exécutés dans cette passe sont rapportés comme courants.

## Sources de vérité

[guide-design.json](guide-design.json) porte les décisions rédigées ; [guide-integration.json](guide-integration.json) porte les comptes et empreintes ; [character-associations.json](character-associations.json) relie le contenu réel. Les valeurs de combat restent définies dans [combat/](../../combat/). Les textes générés se reconstruisent avec les scripts de bible, sans modifier le moteur.
`);

assert.equal(generated.size, outputs.length);
const stale = [];
for (const [target, contents] of generated) {
  if (check) {
    const current = await read(target).catch(() => null);
    if (current !== contents) stale.push(target);
  } else {
    await fs.mkdir(path.dirname(path.join(root, target)), { recursive: true });
    await fs.writeFile(path.join(root, target), contents);
  }
}
assert.deepEqual(stale, [], 'Generated bible files differ; rebuild before checking.');
console.log(JSON.stringify({ status: check ? 'checked' : 'written', ...counts, runtimeCounts: runtime.counts, sourceGuideSha256: sha(guideBytes), files: [...generated.keys()] }, null, 2));
