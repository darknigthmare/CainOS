const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');

const root = path.resolve(__dirname, '../../../..');
const folder = path.resolve(__dirname, '..');
const planPath = path.join(folder, 'appearance-plan.json');
const out = __dirname;
const slots = ['selection', 'stance', 'intro', 'walk', 'jump', 'crouch', 'attack', 'heavy', 'hit', 'victory', 'defeat'];
const labels = { selection: 'Sélection', stance: 'Garde', intro: 'Introduction', walk: 'Marche', jump: 'Saut', crouch: 'Accroupi', attack: 'Attaque', heavy: 'Attaque lourde', hit: 'Impact reçu', victory: 'Victoire', defeat: 'Défaite' };
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const W = 2360, H = 1440, CW = 360, CH = 590, GAP = 20, MARGIN = 50, TOP = 160, ROWGAP = 22;
const fontFamily = 'Review Noto';

function font(ctx, size, weight = 400) { ctx.font = `${weight} ${size}px "${fontFamily}"`; }
function roundBox(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
}
function fitText(ctx, text, maxWidth, initial, min = 20, weight = 700) {
  let size = initial; font(ctx, size, weight);
  while (size > min && ctx.measureText(text).width > maxWidth) { size--; font(ctx, size, weight); }
}
function cellPosition(index) {
  const row = index < 6 ? 0 : 1;
  const col = row === 0 ? index : index - 6;
  return { x: MARGIN + (row ? (CW + GAP) / 2 : 0) + col * (CW + GAP), y: TOP + row * (CH + ROWGAP) };
}

async function main() {
  GlobalFonts.registerFromPath('/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf', fontFamily);
  GlobalFonts.registerFromPath('/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf', fontFamily);
  const planRaw = await fs.readFile(planPath);
  const plan = JSON.parse(planRaw);
  const appearances = plan.appearances.filter(a => a.state === 'pending');
  if (appearances.length !== 9) throw new Error('Expected 9 pending appearances.');
  const generatedCount = appearances.reduce((n, a) => n + a.files.length, 0);
  if (generatedCount !== 36) throw new Error('Expected 36 preserved PNG sources.');
  const checks = [], boards = [];
  for (const a of appearances) {
    const files = new Map(a.files.map(f => [f.slot, f]));
    if (files.size !== a.files.length) throw new Error('Duplicate slot in ' + a.id);
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f5f8'; ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    ctx.fillStyle = '#192535'; fitText(ctx, a.name, 1610, 40); ctx.fillText(a.name, MARGIN, 61);
    ctx.fillStyle = '#9a5111'; font(ctx, 29, 700); ctx.fillText(`EN PRÉPARATION — ${a.files.length}/11`, MARGIN, 114);
    ctx.fillStyle = '#667183'; ctx.textAlign = 'right'; font(ctx, 19); ctx.fillText(a.id, W - MARGIN, 58);
    font(ctx, 20, 700); ctx.fillText('HORS RUNTIME', W - MARGIN, 111); ctx.textAlign = 'left';
    ctx.strokeStyle = '#d5dce5'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(MARGIN, 136); ctx.lineTo(W - MARGIN, 136); ctx.stroke();
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i], f = files.get(slot), pos = cellPosition(i), x = pos.x, y = pos.y;
      roundBox(ctx, x, y, CW, CH, 16, f ? '#ffffff' : '#f9fafc', '#d7dee8');
      ctx.fillStyle = '#243247'; font(ctx, 25, 700); ctx.fillText(labels[slot], x + 20, y + 35);
      ctx.fillStyle = '#738096'; font(ctx, 16); ctx.fillText(slot, x + 20, y + 58);
      if (f) {
        const sourcePath = path.join(root, f.file);
        const raw = await fs.readFile(sourcePath), before = sha(raw);
        if (before !== f.sha256) throw new Error('Source hash mismatch before: ' + f.file);
        const im = await loadImage(sourcePath);
        const box = { x: x + 20, y: y + 78, w: CW - 40, h: CH - 112 };
        const scale = Math.min(box.w / im.width, box.h / im.height);
        const dw = im.width * scale, dh = im.height * scale;
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(im, box.x + (box.w - dw) / 2, box.y + (box.h - dh) / 2, dw, dh);
        ctx.fillStyle = '#607086'; font(ctx, 15); ctx.fillText(`PNG conservé · ${im.width} × ${im.height}`, x + 20, y + CH - 14);
        checks.push({ appearanceId: a.id, slot, file: f.file, expectedSHA256: f.sha256, sha256Before: before, bytes: raw.length });
      } else {
        ctx.fillStyle = '#778395'; ctx.textAlign = 'center'; font(ctx, 30, 700);
        ctx.fillText('À générer', x + CW / 2, y + CH / 2 + 18); ctx.textAlign = 'left';
      }
    }
    ctx.fillStyle = '#58677c'; font(ctx, 18);
    ctx.fillText('Planche de revue — apparence conservée en préparation, absente du jeu actif.', MARGIN, 1402);
    ctx.textAlign = 'right'; ctx.fillText('PNG sources inchangés · composition Canvas / Skia', W - MARGIN, 1402); ctx.textAlign = 'left';
    const rawBoard = await canvas.encode('jpeg', 92), name = a.id + '.jpg';
    await fs.writeFile(path.join(out, name), rawBoard);
    boards.push({ appearanceId: a.id, name: a.name, file: name, available: a.files.length, missing: 11 - a.files.length, dimensions: [W, H], bytes: rawBoard.length, sha256: sha(rawBoard), slots: slots.map(slot => ({ slot, available: files.has(slot) })) });
  }
  for (const check of checks) {
    check.sha256After = sha(await fs.readFile(path.join(root, check.file)));
    check.unchanged = check.sha256Before === check.sha256After && check.sha256After === check.expectedSHA256;
    if (!check.unchanged) throw new Error('Source modified during rendering: ' + check.file);
  }
  const manifest = { schema: 'encore-pending-review/v1', createdAt: new Date().toISOString(), method: '@napi-rs/canvas (Skia), PNG compositing to JPEG', plan: '../appearance-plan.json', planSHA256: sha(planRaw), pendingAppearances: appearances.length, expectedSlots: 99, availableSources: 36, missingSlots: 63, includedInRuntime: false, sourcePolicy: 'All PNG bytes remain unchanged. Complete native image canvases are fitted into review cells without cropping. JPEGs are review compositions only, never game assets.', sourceHashesUnchanged: checks.every(c => c.unchanged), boards, sources: checks };
  await fs.writeFile(path.join(out, 'review-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  const rows = boards.map(b => `| [${b.name}](${b.file}) | ${b.available}/11 | ${b.missing} |`).join('\n');
  const readme = `# Galerie des apparences en préparation

Ces neuf apparences sont **absentes du runtime**. Elles conservent **36 PNG sur 99 attendus** ; **63 poses restent à générer**. Elles ne sont pas annoncées comme des familles terminées.

Chaque planche JPEG contient onze cases étiquetées : sélection, garde, introduction, marche, saut, accroupi, attaque, attaque lourde, impact reçu, victoire et défaite. Les PNG disponibles sont composés sur fond clair. Le contenu des cases manquantes est uniquement **« À générer »**. Chaque planche porte le titre **« EN PRÉPARATION — N/11 »**.

| Apparence | PNG conservés | Poses manquantes |
| --- | ---: | ---: |
${rows}
| **Total** | **36/99** | **63** |

## Portée de la revue

Le [plan gelé](../appearance-plan.json) distingue six familles complètes actives et neuf familles partielles archivées. La présente galerie montre uniquement ces neuf familles partielles. Les images disponibles restent dans le dossier **pending-assets** ; les chemins actifs prévus sont conservés dans les champs **targetFile** de leurs métadonnées.

Les JPEG sont des compositions de revue réalisées avec **Canvas / Skia** (module **@napi-rs/canvas**) à **2360 × 1440 pixels**. L’intégralité du canevas de chaque PNG est ajustée à sa case, sans recadrage. Aucune génération d’image et aucune modification, recompression ou transformation des PNG sources n’a eu lieu. Ces JPEG ne sont pas des sprites de jeu.

Les **36 empreintes SHA-256** ont été vérifiées avant et après la composition, et concordent avec le plan gelé. Le [manifeste de revue](review-manifest.json) conserve les chemins, empreintes avant/après et comptes par apparence. Le [script Canvas](render-pending-review.cjs) reproduit cette galerie.

Les poses de jeu sont des adaptations originales. Cette galerie permet d’examiner les silhouettes conservées et les manques ; elle ne certifie pas une fidélité 1:1 aux épisodes ou aux produits de référence.
`;
  await fs.writeFile(path.join(out, 'README.md'), readme);
  console.log(JSON.stringify({ boards: boards.length, availableSources: checks.length, expectedSlots: 99, missingSlots: 63, sourceHashesUnchanged: manifest.sourceHashesUnchanged, output: out }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });

