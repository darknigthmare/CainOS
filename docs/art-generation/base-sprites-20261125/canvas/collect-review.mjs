import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CONTINUATION_BASE_DEFINITIONS } from '../../../../combat/base-sprite-continuation-20261125.mjs';

const output = fileURLToPath(new URL('.', import.meta.url));
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = async name => JSON.parse(await fs.readFile(path.join(output, name), 'utf8'));
const inspectedAt = '2026-11-25';
// These observations record the separate visual inspection of every full sheet.
// They are not inferred by this aggregation script or a pixel comparison.
const observations = {
  bunnyjax: ['Bunny Jax', 'Lapin mauve, grandes oreilles et nœud rose entiers ; portrait distinct et profil de garde inversé proprement.'],
  maidribbit: ['Ribbit · soubrette', 'Coiffe blanche, grands yeux verts, tablier et mains entièrement visibles dans les trois vues.'],
  ghostlyvacuum: ['Ghostly · aspirateur', 'Fantôme turquoise et appareil avec tuyaux entièrement visibles ; les deux gardes conservent tous les accessoires.'],
  mingtrophy: ['Ming · trophée', 'Couronne de laurier, figurine et socle entiers. La garde gauche inverse aussi les inscriptions du socle, conséquence attendue du miroir statique.'],
  disappearingguymicrophone: ['Disappearing Guy · micro', 'Chapeau, corps rouge, micro et pied entiers ; nativeFacing −1 corrigé, micro orienté à droite dans la garde droite.'],
  'glitch-murderdrones-queenie-hommage': ['Queenie · Murder Drones · hommage', 'Couronne bois, gilet violet sans manches, robe et gants détachés complets ; portrait et garde distincts.'],
  'glitch-murderdrones-queenie-resident': ['Queenie · Murder Drones · résidente', 'Lentille, col clair, manteau de travail, sacoches, lampe et mains flottantes visibles ; aucun membre humain ajouté.'],
  'glitch-murderdrones-queenie-fusion': ['Queenie · Murder Drones · fusion', 'Couronne bronze, yeux de verre, robe mécanique, gants robotiques et base circulaire complets.'],
  'glitch-metarunner-queenie-hommage': ['Queenie · Meta Runner · hommage', 'Gilet bleu et blanc sans manches, emblème de canard, gant cybernétique, gant blanc et robe entièrement visibles.'],
  'glitch-metarunner-queenie-resident': ['Queenie · Meta Runner · résidente', 'Manteau turquoise, blanc et bordeaux, liserés magenta et écran de poignet conservés ; silhouette de reine entière.'],
  'glitch-metarunner-queenie-fusion': ['Queenie · Meta Runner · fusion', 'Corps de reine bleu, cyan et cuivre, mains mécaniques détachées et base entière ; sélection aux mains jointes distincte de la garde.'],
  'glitch-sunsetparadise-queenie-hommage': ['Queenie · Sunset Paradise · hommage', 'Lunettes, tenue blanche à accents orange, robe et mains détachées entières dans les gardes ; portrait distinct.'],
  'glitch-sunsetparadise-queenie-resident': ['Queenie · Sunset Paradise · résidente', 'Cape verte, foulard bordeaux, boutons dorés, robe crème et gants flottants complets.'],
  'glitch-sunsetparadise-queenie-fusion': ['Queenie · Sunset Paradise · fusion', 'Couronne de corail, robe marine, bijoux turquoise, gants et base en coquille entièrement visibles.'],
};

const progress = await readJson('batch-progress.json');
assert.equal(progress.complete, true);
assert.equal(CONTINUATION_BASE_DEFINITIONS.length, 14);
assert.deepEqual(progress.execution.map(row => row.id), CONTINUATION_BASE_DEFINITIONS.map(row => row.id));
let report;
for (const definition of CONTINUATION_BASE_DEFINITIONS) {
  const part = await readJson('families/' + definition.id + '.json');
  assert.equal(part.selectedId, definition.id);
  assert.equal(part.summary.pass, true);
  assert.equal(part.authoredDrawings, 2);
  assert.equal(part.appearances.length, 1);
  assert.equal(progress.execution.find(row => row.id === definition.id).status, 0);
  if (!report) report = { ...part, selectedId: null, createdAt: new Date().toISOString(), authoredDrawings: 0, appearances: [], sheets: [],
    scope: 'Exactly the fourteen CONTINUATION_BASE_DEFINITIONS added on 2026-11-25.',
    collection: 'Fourteen sequential Node workers, each with --expose-gc --max-old-space-size=128. No simultaneous native-image workers. The overview decodes only finished JPEG review sheets.' };
  assert.deepEqual(part.sources, report.sources, 'Sources changed between workers');
  assert.equal(part.offlineVersion, report.offlineVersion);
  const row = part.appearances[0];
  assert.equal(row.drawChecks.length, 20);
  assert.equal(row.portraitSourceVerified, true);
  assert.equal(row.uniqueRequestedFiles, 2);
  for (const file of Object.values(row.files)) {
    const bytes = await fs.readFile(path.join(root, file.file));
    assert.equal(bytes.length, file.bytes);
    assert.equal(sha(bytes), file.sha256, 'Native asset bytes changed: ' + file.file);
  }
  assert.ok(observations[row.id], 'Missing individual visual observation');
  row.visualReview = {
    inspectedAt, sheet: part.sheets[0], method: 'Individual full-sheet visual inspection after production rendering.',
    portrait: 'pass', guardRight: 'pass', guardLeft: 'pass', clipping: 'none_observed', sourceMismatch: 'none_observed',
    observations: observations[row.id][1],
  };
  report.authoredDrawings += part.authoredDrawings;
  report.appearances.push(row);
  report.sheets.push(...part.sheets);
  progress.execution.find(item => item.id === definition.id).peakRSSBytes = part.summary.peakRSSBytes;
}
for (const [file, hash] of Object.entries(report.sources)) {
  assert.equal(sha(await fs.readFile(path.join(root, file))), hash, 'Current source differs from rendered source: ' + file);
}

let skia;
try { skia = await import('@napi-rs/canvas'); }
catch { skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')).href); }
const overview = skia.createCanvas(1280, Math.ceil(report.appearances.length / 4) * 292 + 72);
const ctx = overview.getContext('2d');
ctx.fillStyle = '#202737'; ctx.fillRect(0, 0, overview.width, overview.height);
ctx.fillStyle = '#2b3548';
for (let y=0; y<overview.height; y+=24) for (let x=0; x<overview.width; x+=24) if ((x/24+y/24)%2) ctx.fillRect(x,y,24,24);
ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 25px sans-serif';
ctx.fillText('14 apparences · portraits et gardes', 18, 31);
ctx.font = '15px sans-serif';
ctx.fillText('Rendu Canvas de production · 28 dessins de base · aucune animation ajoutée', 18, 56);
for (const [index, row] of report.appearances.entries()) {
  const image = await skia.loadImage(path.join(output, 'base-' + row.id + '.jpg'));
  const ox = index % 4 * 320, oy = Math.floor(index / 4) * 292 + 72;
  ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText(observations[row.id][0], ox + 8, oy + 18, 304);
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#c7d0df';
  ctx.fillText(row.id, ox + 8, oy + 34, 304);
  const pb = row.files.selection.bounds, ps = Math.min(252 / pb.width, 290 / pb.height);
  const stanceScale = Math.min(1, 285 / row.visibleHeight, 318 / row.visibleWidth);
  const views = [
    { cx: 144, floor: 373, w: pb.width * ps, h: pb.height * ps, center: ox + 80 },
    { cx: 474, floor: 374, w: row.visibleWidth * stanceScale, h: row.visibleHeight * stanceScale, center: ox + 238 },
  ];
  for (const view of views) {
    const sw = view.w + 12, sh = view.h + 12, scale = Math.min(150 / sw, 225 / sh);
    ctx.drawImage(image, view.cx - view.w / 2 - 6, view.floor - view.h - 6, sw, sh,
      view.center - sw * scale / 2, oy + 274 - sh * scale, sw * scale, sh * scale);
  }
  ctx.getImageData(0,0,1,1); globalThis.gc?.();
}
await fs.writeFile(path.join(output, 'bases-overview.jpg'), overview.toBuffer('image/jpeg', 90));
report.sheets.push('bases-overview.jpg');
report.execution = progress.execution;
report.summary = {
  appearances: report.appearances.length, authoredDrawings: report.authoredDrawings,
  sourceAndFacingChecks: report.appearances.reduce((sum, row) => sum + row.drawChecks.length, 0),
  actualStateDraws: report.appearances.reduce((sum, row) => sum + row.drawChecks.length * 3, 0),
  portraits: report.appearances.length, visuallyReviewedSheets: report.appearances.length,
  peakWorkerRSSBytes: Math.max(...progress.execution.map(row => row.peakRSSBytes)),
  sourceFilesCurrentAndIdentical: Object.keys(report.sources).length, nativeAssetHashesVerified: 28, pass: true,
};
assert.equal(report.summary.sourceAndFacingChecks, 280);
assert.equal(report.summary.actualStateDraws, 840);
report.sheetHashes = {};
for (const sheet of report.sheets) report.sheetHashes[sheet] = sha(await fs.readFile(path.join(output, sheet)));
report.visualReview = { status: 'pass', inspectedAt, individualSheets: 14, clipping: 'none_observed', sourceMismatch: 'none_observed',
  notes: ['Ming left-facing pedestal lettering is mirrored with the static image; no independent lettering redraw is provided.',
    'Disappearing Guy has nativeFacing -1, verified by the production transformation and the microphone direction.',
    'All nine Queenie redesigns retain the chess-queen body and detached hands, without humanoid legs.'] };
await fs.writeFile(path.join(output, 'base-canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
await fs.writeFile(path.join(output, 'batch-progress.json'), JSON.stringify({ schema: 'encore-static-base-canvas-batch/v1', ...progress }, null, 2) + '\n');
const readme = `# Bases statiques — revue Canvas du 25 novembre 2026

**14 apparences, 28 dessins de base, 280 contrôles état/direction et 840 appels de dessin réels : tous réussis.** Les 14 portraits sont aussi vérifiés et les 14 planches complètes ont été inspectées individuellement. Aucune découpe visible ni mauvaise source relevée.

[Aperçu compact](bases-overview.jpg) · [Rapport détaillé et empreintes SHA-256](base-canvas-review.json)

## Périmètre et méthode

Le périmètre contient exactement les 14 définitions ajoutées par \`CONTINUATION_BASE_DEFINITIONS\`, sous la version hors ligne \`${report.offlineVersion}\`. Chaque famille a été rendue par le renderer Canvas2D de production, dans son propre processus Node séquentiel, avec \`--expose-gc --max-old-space-size=128\`.

Pour chaque apparence, les dix états (garde, introduction, attaque, attaque lourde, coup reçu, marche, saut, accroupissement, victoire et défaite) sont contrôlés dans les deux directions. Chaque combinaison est réellement dessinée au temps 0, au temps 600, puis au temps 600 avec mouvements réduits : 14 × 10 × 2 × 3 = 840 appels. Les deux fichiers demandés, leurs empreintes, le portrait dédié, l'échelle uniforme, l'ancre et la garde statique inchangée sont vérifiés. Aucun ancien atlas ni dessin de pose n'est demandé.

Les 12 empreintes de sources sont identiques entre tous les workers et correspondent encore aux fichiers au moment de l'agrégation. Les 28 PNG natifs sont inchangés et leurs empreintes ont été revérifiées. L'aperçu est assemblé uniquement à partir des JPEG de revue.

## Revue visuelle

Les portraits, la garde droite et la garde gauche ont été vus pour chacune des 14 planches. Le micro de Disappearing Guy est du bon côté après application de \`nativeFacing: -1\`. Les inscriptions du trophée de Ming sont inversées avec l'image dans la garde gauche ; c'est la conséquence du miroir statique. Les neuf Queenie gardent leur anatomie de pièce d'échecs et leurs mains détachées.

| Apparence | Planche et résultat |
| --- | --- |
${report.appearances.map(row => '| ' + observations[row.id][0] + ' | [' + row.id + '](base-' + row.id + '.jpg) — conforme |').join('\n')}

## Limites

Cette preuve native Skia ne remplace pas les tests navigateur, clavier, audio, service worker ou sur appareil physique. Réutiliser une garde ne crée pas neuf dessins d'action supplémentaires et ne constitue pas une animation. Cette revue contrôle le rendu et les sources ; elle ne certifie pas une fidélité canonique 1:1 ou une anatomie cachée.

Le script \`collect-review.mjs\` reconstitue ce rapport à partir des résultats individuels existants. Les observations visuelles consignées proviennent de la revue séparée, pas d'une comparaison automatisée de pixels.
`;
await fs.writeFile(path.join(output, 'README.md'), readme);
console.log(JSON.stringify({ output, ...report.summary, continuationSourceSha256: report.sources['combat/base-sprite-continuation-20261125.mjs'], reportSha256: sha(await fs.readFile(path.join(output, 'base-canvas-review.json'))) }));
