import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FIGHTERS, MOVES, MOVE_SLOTS, ALL_STAGES, STAGES, DEDICATED_STAGES, COSTUMES } from '../combat/data.mjs';
import { STORY_ROUTES, getStoryRival, STORY_REFERENCES } from '../combat/stories.mjs';
import { FINISHER_CATALOG } from '../combat/finisher-catalog.mjs';
import { FRIENDSHIP_CATALOG } from '../combat/friendship-catalog.mjs';
import { PROJECTILE_ART, projectileArtSpec } from '../combat/projectile-art.mjs';
import { ART_FILES } from '../combat/offline-manifest.mjs';
import { FIDELITY_SOURCES } from '../combat/fidelity.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JSON_OUTPUT = 'docs/bible/character-associations.json';
const MD_OUTPUT = 'docs/bible/ASSOCIATIONS_PERSONNAGES.md';
const INPUTS = [
  'combat/data.mjs', 'combat/stories.mjs', 'combat/roster-expansion.mjs',
  'combat/abstractions-content.mjs', 'combat/abstractions-narrative.mjs',
  'combat/finisher-catalog.mjs', 'combat/friendship-catalog.mjs',
  'combat/projectile-art.mjs', 'combat/render-presentation.mjs',
  'combat/offline-manifest.mjs', 'combat/illustrations.mjs', 'combat/fidelity.mjs',
];
const GUIDE_SECTIONS = ['EN-G02', 'EN-G03', 'EN-G04', 'EN-G05', 'EN-G06', 'EN-G07',
  'EN-G08', 'EN-G10', 'EN-G16', 'EN-G17', 'EN-G18', 'EN-G20', 'EN-G22', 'EN-G25', 'EN-G27'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const published = new Set(ART_FILES);
const image = stem => [stem + '.webp', stem + '.png'].find(item => published.has(item)) || null;
const repoAsset = value => value?.replace(/^\.\.\//, '') || null;
const md = value => String(value ?? '—').replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
const refs = ['combat/data.mjs', 'combat/stories.mjs', 'combat/finisher-catalog.mjs',
  'combat/friendship-catalog.mjs', 'combat/projectile-art.mjs', 'combat/illustrations.mjs'];

/** Read the current catalog; this does not certify art or execute a game session. */
export function buildCharacterAssociations({ repoRoot = ROOT, design } = {}) {
  assert.equal(path.resolve(repoRoot), ROOT, 'Runtime imports and requested repository must match');
  design ||= JSON.parse(readFileSync(path.join(ROOT, 'docs/bible/guide-design.json'), 'utf8'));
  const fighterIds = new Set(FIGHTERS.map(fighter => fighter.id));
  const stageIds = new Set(ALL_STAGES.map(stage => stage.id));
  const designSections = new Set(design.sections.map(section => section.id));
  const names = new Map(FIGHTERS.map(fighter => [fighter.id, fighter.name]));
  assert.equal(fighterIds.size, FIGHTERS.length, 'Duplicate fighter IDs');
  assert.equal(fighterIds.size, 64, 'Review the expected roster before regenerating');
  assert.equal(Object.keys(STORY_ROUTES).length, fighterIds.size, 'Unexpected story population');
  GUIDE_SECTIONS.forEach(id => assert(designSections.has(id), `Missing guide section: ${id}`));
  const seenMoveIds = new Set(), seenPanelIds = new Set(), seenFinisherIds = new Set();
  const runtimeCastIssues = [];
  const characters = FIGHTERS.map(fighter => {
    const { id, name } = fighter;
    const route = STORY_ROUTES[id], rival = getStoryRival(id);
    assert(route && rival && fighterIds.has(rival.id), `Missing route or rival: ${id}`);
    assert.equal(route.chapters.length, 4, `Expected four chapters: ${id}`);
    const chapters = route.chapters.map((chapter, index) => {
      assert(fighterIds.has(chapter.opponentId), `Unknown chapter opponent: ${id}/${index}`);
      assert(stageIds.has(chapter.stageId), `Unknown chapter stage: ${id}/${index}`);
      return { associationId: `EN-ROUTE-${id}-${index + 1}`, order: index + 1,
        runtimeLocator: `STORY_ROUTES.${id}.chapters[${index}]`, ...clone(chapter) };
    });
    const panels = ['prologue', 'epilogue'].flatMap(kind => {
      assert.equal(route[kind].length, 3, `Expected three ${kind} panels: ${id}`);
      return route[kind].map((panel, index) => {
        assert(!seenPanelIds.has(panel.id), `Duplicate panel ID: ${panel.id}`);
        seenPanelIds.add(panel.id);
        assert(stageIds.has(panel.stageId), `Unknown panel stage: ${panel.id}`);
        panel.cast.forEach(member => assert(fighterIds.has(member), `Unknown cast: ${panel.id}/${member}`));
        const proposedCast = [...new Set(panel.cast)];
        if (proposedCast.length !== panel.cast.length) runtimeCastIssues.push({
          id: `EN-CAST-${panel.id}`, fighterId: id, panelId: panel.id,
          observedCast: [...panel.cast], proposedUniqueCast: proposedCast,
          status: 'runtime-correction-pending', source: 'combat/stories.mjs',
          note: 'Le cast observé est conservé. La déduplication proposée n’est pas appliquée au jeu par ce document.',
        });
        const artwork = image(`../assets/encore/campaign/${id}/${panel.id}`);
        return { ...clone(panel), kind, order: index + 1,
          runtimeLocator: `STORY_ROUTES.${id}.${kind}[${index}]`,
          artwork: { status: artwork ? 'dedicated-image-listed-in-manifest' : 'stage-and-cast-composition',
            path: repoAsset(artwork), newImageProduced: false,
            review: 'Raccord de données ; aucune nouvelle revue visuelle effectuée par ce générateur.' } };
      });
    });
    const moves = MOVES.filter(move => move.fighterId === id).map(move => {
      assert(!seenMoveIds.has(move.id), `Duplicate move ID: ${move.id}`);
      seenMoveIds.add(move.id);
      assert(MOVE_SLOTS.includes(move.slot), `Unknown slot: ${move.id}`);
      return { ...clone(move), source: 'combat/data.mjs', evidence: 'current-runtime-definition' };
    });
    assert.equal(moves.length, MOVE_SLOTS.length, `Wrong move count: ${id}`);
    assert.deepEqual(moves.map(move => move.slot), MOVE_SLOTS, `Wrong slot order: ${id}`);
    const finishers = FINISHER_CATALOG.filter(item => item.fighterId === id).map(item => {
      assert(!seenFinisherIds.has(item.id), `Duplicate finale ID: ${item.id}`);
      seenFinisherIds.add(item.id);
      return { ...clone(item), source: 'combat/finisher-catalog.mjs',
        titleStatus: 'existing-encore-title-not-official-series-name' };
    });
    assert.deepEqual(finishers.map(item => item.variant), ['impact', 'special', 'super'], `Wrong finales: ${id}`);
    const friendships = FRIENDSHIP_CATALOG.filter(item => item.fighterId === id);
    assert.equal(friendships.length, 1, `Wrong friendship count: ${id}`);
    const dedicated = DEDICATED_STAGES.filter(stage => stage.dedicatedTo === id);
    assert.equal(dedicated.length, 1, `Wrong dedicated arrangement count: ${id}`);
    const stage = dedicated[0];
    const sourceStageIds = STAGES.filter(item => item.theme === stage.theme).map(item => item.id);
    assert(sourceStageIds.length, `Unresolved dedicated arrangement theme: ${id}`);
    const projectiles = moves.filter(move => move.kind === 'projectile').map(move => {
      const spec = projectileArtSpec({ def: move }, { f: fighter });
      assert(spec && PROJECTILE_ART[spec.id], `Unresolved projectile art: ${move.id}`);
      assert(published.has(spec.src), `Unpublished projectile art: ${move.id}`);
      return { moveId: move.id, slot: move.slot, name: move.name, motifId: spec.id,
        imagePath: repoAsset(spec.src), drawingWidth: spec.width, drawingHeight: spec.height,
        presentationMotion: spec.motion,
        reflection: 'Le propriétaire change ; le motif de la technique d’origine reste celui résolu par projectileArtSpec.',
        source: 'combat/projectile-art.mjs', narrativeStatus: 'original-encore-gameplay-accessory' };
    });
    const directory = fighter.sprite?.crossoverDirectory;
    const portrait = image(directory ? `${directory}/selection` : `../assets/encore/selection/${id}`);
    const stance = image(directory ? `${directory}/stance` : `../assets/encore/stance/${id}`);
    assert(portrait && stance, `Missing cataloged portrait or stance: ${id}`);
    const costumes = COSTUMES.filter(costume => costume.fighterId === id || costume.baseFighterId === id);
    const plannedCampaignRoles = design.campaign.chapters.flatMap(chapter => {
      const roles = [];
      if (chapter.playerId === id) roles.push('jouable');
      if (chapter.opponentId === id) roles.push('adversaire');
      const sceneIds = chapter.scenes.filter(scene => scene.cast.includes(id)).map(scene => scene.id);
      if (sceneIds.length && !roles.length) roles.push('présence en scène');
      return roles.length ? [{ campaignId: design.campaign.id, chapterId: chapter.id,
        roles, sceneIds, status: 'planned-not-integrated' }] : [];
    });
    return {
      id, name, associationId: `EN-CHAR-${id}`, title: fighter.title, gameplayRole: fighter.role,
      guideSectionIds: [...GUIDE_SECTIONS],
      sourceRefs: refs.map(source => ({ path: source, fighterId: id })),
      identityEvidence: {
        runtimeSourceKind: fighter.sourceKind || fighter.fidelity?.sourceKind || 'not-classified-in-runtime',
        runtimeProvenance: fighter.provenance, runtimeLoreSourceId: fighter.loreSource || null,
        runtimeFidelity: clone(fighter.fidelity || null),
        currentReview: 'Données et incertitudes du dépôt recopiées ; aucune nouvelle attestation canonique ni certification visuelle 1:1.',
      },
      simulation: { stats: clone(fighter.stats), body: clone(fighter.combat.simulationBody),
        resource: clone(fighter.combat.resource), passive: clone(fighter.combat.passive), links: clone(fighter.combat.links) },
      assets: { portraitPath: repoAsset(portrait), stancePath: repoAsset(stance),
        fallbackSprite: clone(fighter.sprite), visualProfile: clone(fighter.visual),
        reviewStatus: 'manifest-reference-only', newImagesProduced: 0 },
      costumeIds: costumes.map(costume => costume.id), moves, projectiles,
      route: { title: route.title, intro: route.intro, ending: route.ending,
        referenceIds: [...(route.referenceIds || [])], writingApproach: route.writingApproach || null,
        narrativeStatus: 'existing-original-encore-route',
        rival: { fighterId: rival.id, name: rival.name, chapterOrder: rival.index + 1,
          reasonInCurrentRoute: rival.scene.summary, canonStatus: 'game-route-pairing-not-canonical-hostility' },
        chapters, panels },
      finales: finishers,
      friendship: { ...clone(friendships[0]), source: 'combat/friendship-catalog.mjs',
        titleStatus: 'existing-encore-title-not-official-series-name' },
      dedicatedStage: { id: stage.id, name: stage.name, theme: stage.theme,
        sourceStageIds, status: 'existing-arrangement-reusing-scenery' },
      plannedCampaignRoles,
      statusAxes: {
        lore: 'existing-evidence-and-uncertainties-preserved', design: 'current-runtime-linked',
        assets: 'manifest-paths-resolved-not-visually-recertified', integration: 'existing-runtime',
        validation: 'catalog-reference-validation-only', publication: 'baseline-runtime-already-on-pr-14',
      },
    };
  });
  assert.equal(seenMoveIds.size, MOVES.length, 'Orphaned moves');
  assert.equal(seenFinisherIds.size, FINISHER_CATALOG.length, 'Orphaned finales');
  const panels = characters.flatMap(character => character.route.panels);
  const sourceHashes = Object.fromEntries(INPUTS.map(file => [file, hash(readFileSync(path.join(ROOT, file)))]));
  return {
    schema: 'encore-guide-character-associations/v1', version: '1.0.0',
    asOf: design.asOf, baselineCommit: design.baselineCommit,
    source: 'scripts/build-combat-guide-associations.mjs', sourceHashes,
    notice: 'Associations calculées à partir du jeu existant. Le guide propose des compléments ; ce registre ne modifie ni les combats, ni les scènes, ni les assets. Les textes de fidélité conservés peuvent décrire une revue historique : ils ne constituent pas une nouvelle validation.',
    counts: {
      fighters: characters.length, moves: seenMoveIds.size, routes: characters.length,
      chapters: characters.reduce((sum, item) => sum + item.route.chapters.length, 0),
      panels: panels.length,
      dedicatedPanelImages: panels.filter(panel => panel.artwork.path).length,
      composedPanels: panels.filter(panel => !panel.artwork.path).length,
      finishers: seenFinisherIds.size, friendships: characters.length,
      dedicatedStageArrangements: characters.length,
      projectileMoves: characters.reduce((sum, item) => sum + item.projectiles.length, 0),
      usedProjectileMotifs: new Set(characters.flatMap(item => item.projectiles.map(projectile => projectile.motifId))).size,
      runtimeCastIssues: runtimeCastIssues.length, newImagesProduced: 0,
      plannedGlobalChapters: design.campaign.chapters.length,
      plannedGlobalScenes: design.campaign.chapters.reduce((sum, chapter) => sum + chapter.scenes.length, 0),
    },
    fidelitySourcesFromRuntime: clone(FIDELITY_SOURCES), storyReferencesFromRuntime: clone(STORY_REFERENCES),
    runtimeCastIssues, characters,
  };
}

export function renderCharacterAssociations(data) {
  const c = data.counts;
  const names = new Map(data.characters.map(character => [character.id, character.name]));
  const rows = data.characters.map(character => {
    const global = character.plannedCampaignRoles.map(role => `${role.chapterId.replace('EN-CAM-CH', '')} : ${role.roles.join(', ')}`).join(' ; ') || 'Aucun rôle prévu dans ce premier arc';
    return `| \`${character.id}\` | ${md(character.name)} | ${md(character.route.rival.name)} · ch. ${character.route.rival.chapterOrder} | ${md(character.route.title)} | ${character.moves.length} / ${character.finales.length} / 1 | \`${character.dedicatedStage.id}\` | ${md(global)} |`;
  });
  const issues = data.runtimeCastIssues.map(issue => `| \`${issue.panelId}\` | ${issue.observedCast.map(id => md(names.get(id) || id)).join(' · ')} | ${issue.proposedUniqueCast.map(id => md(names.get(id) || id)).join(' · ')} | À corriger dans le runtime |`);
  return `# Associations des personnages au guide de combat

État documentaire du ${data.asOf}, à partir du runtime de la PR #14, commit \`${data.baselineCommit}\`.

Le [registre détaillé](character-associations.json) relie les **${c.fighters} combattants** aux rubriques de la bible, à leurs **${c.moves} techniques**, **${c.chapters} affrontements de route**, **${c.panels} tableaux**, **${c.finishers} finales**, **${c.friendships} amitiés** et **${c.dedicatedStageArrangements} arrangements de décor**. Les identifiants du jeu restent l’autorité. Les noms de coups, ressources, rivalités de parcours et scènes sont des adaptations ou créations Encore.

Ce document est un raccord avec le catalogue publié. Il n’ajoute aucun dessin ni animation et ne certifie pas la fidélité canonique 1:1. Les notices de référence et de revue du runtime sont conservées avec leur portée, y compris leurs incertitudes ou leur caractère historique.

## Lire les associations

- **Jeu existant** : données exactes de [data.mjs](../../combat/data.mjs), [stories.mjs](../../combat/stories.mjs), [finisher-catalog.mjs](../../combat/finisher-catalog.mjs), [friendship-catalog.mjs](../../combat/friendship-catalog.mjs) et [projectile-art.mjs](../../combat/projectile-art.mjs).
- **Guide** : chaque personnage est associé aux sections fidélité, roster, combat, movesets, conclusions, relations, routes, scènes, projectiles, art, présentation, entraînement, accessibilité, statistiques et fiches types. Voir la [matrice](COMBAT_GAMES_GUIDE_INTEGRATION.md).
- **Scènes** : ${c.dedicatedPanelImages} tableaux de prologue/épilogue ont une image dédiée inscrite au manifeste ; les ${c.composedPanels} autres utilisent une composition de décor et de personnages. Cette différence n’établit pas une panne. Les images de briefing de chapitre constituent un autre inventaire.
- **Projet de campagne globale** : les rôles ci-dessous viennent de [La Répétition impossible](CAMPAGNE_GLOBALE.md), conçue dans la bible et non intégrée au jeu. Ses ${c.plannedGlobalScenes} scènes sont des briefs, sans nouvelles images produites.
- **Chiffres des techniques** : les valeurs et propriétés présentes sont copiées telles quelles ; un champ absent n’est pas remplacé par un zéro. Aucune frame advantage n’est déduite de la seule récupération.

## Index du roster

Dans « coups / finales / amitié », les finales correspondent aux trois variantes existantes impact, special et super ; elles ne désignent pas trois nouveaux pouvoirs canoniques.

| ID | Personnage | Rival dans la route | Route existante | Coups / finales / amitié | Arrangement | Campagne globale : chapitres proposés |
| --- | --- | --- | --- | --- | --- | --- |
${rows.join('\n')}

## Écarts de cast constatés

**${c.runtimeCastIssues} tableaux contiennent deux fois le même rival dans le cast.** Les valeurs observées restent inchangées dans le registre. La colonne proposée retire seulement le doublon ; ce correctif de runtime n’est pas livré par l’intégration documentaire.

| Tableau | Cast observé | Cast unique proposé | État |
| --- | --- | --- | --- |
${issues.join('\n')}

## Contrat de régénération

Depuis la racine du dépôt :

\`\`\`sh
node scripts/build-combat-guide-associations.mjs
node scripts/build-combat-guide-associations.mjs --check
\`\`\`

Le contrôle exige un roster unique, dix slots par combattant, quatre affrontements et six tableaux par route, des adversaires et décors résolus, trois finales et une amitié par combattant, un arrangement dédié, des portraits/gardes et des motifs de projectile inscrits au manifeste. Il vérifie aussi que les fichiers générés correspondent exactement aux sources courantes. Il ne charge pas les images, ne lance pas de partie et ne remplace pas les tests de jeu, les revues artistiques ou les parcours navigateur.
`;
}

export function writeCharacterAssociations({ check = false, design } = {}) {
  const data = buildCharacterAssociations({ design });
  const outputs = new Map([[JSON_OUTPUT, `${JSON.stringify(data, null, 2)}\n`], [MD_OUTPUT, renderCharacterAssociations(data)]]);
  for (const [file, content] of outputs) {
    const target = path.join(ROOT, file);
    if (check) assert(existsSync(target) && readFileSync(target, 'utf8') === content, `Stale generated file: ${file}`);
    else { mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, content); }
  }
  return data;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = writeCharacterAssociations({ check: process.argv.includes('--check') });
  console.log(JSON.stringify({ status: 'ok', mode: process.argv.includes('--check') ? 'check' : 'write', counts: data.counts }));
}
