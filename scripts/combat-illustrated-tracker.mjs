/** Refresh existing production rows from the images that ship with this build. */
export function updateIllustratedTracker(data, { ART_FILES, ART_BYTES }) {
  const files = new Set(ART_FILES.map(name => name.replace(/^\.\.\//, '')));
  const imagePath = stem => [stem + '.webp', stem + '.png'].find(file => files.has(file));
  const art = 'assets/encore/';
  const production = new Map(data.production.map(row => [row[0], row]));
  const features = new Map(data.features.map(row => [row[0], row]));
  const poses = new Map();
  const counts = { selection: 0, stance: 0, campaign: 0, finales: 0, stages: 0, poses: 0 };
  for (const file of files) {
    if (!file.startsWith(art)) continue;
    const [family, id, pose] = file.slice(art.length).split('/');
    if (!Object.hasOwn(counts, family)) continue;
    counts[family]++;
    if (family === 'poses') {
      if (!poses.has(id)) poses.set(id, []);
      poses.get(id).push(pose.replace(/\.(?:webp|png)$/i, ''));
    }
  }
  if (!counts.poses && !counts.stages && !counts.finales) return;
  const update = (map, id, cells) => {
    const row = map.get(id);
    if (row) Object.assign(row, cells);
  };
  const assetRow = (id, file, detail, status) => {
    file = imagePath(file.replace(/\.(?:webp|png)$/i, ''));
    if (!files.has(file)) return;
    update(production, id, { 6: file, 7: detail, ...(status ? { 4: status } : {}) });
  };
  const poseList = id => (poses.get(id) || []).sort().join(', ');
  for (const row of data.roster) {
    const id = row[0], stance = art+'stance/'+id+'.webp', directory = art+'poses/'+id+'/';
    if (poses.has(id)) row[14] = 'Dessins individuels : '+poseList(id)+'. '+directory;
    for (const state of ['idle','guard']) assetRow('ART-'+id+'-'+state, stance, 'Garde illustrée individuelle, adaptée à l’état du combattant.', 'Implémenté');
    for (const [task, pose] of [['walk','walk'],['jump','jump'],['crouch','crouch'],['hurt','hit'],['victory','victory']]) {
      assetRow('ART-'+id+'-'+task, directory+pose+'.webp', 'Dessin dédié au repère '+pose+'. Le moteur règle la durée et les transitions.');
    }
    assetRow('ART-'+id+'-light', directory+'attack.webp', 'Pose d’attaque légère en phase active et au début de la récupération. Les autres techniques suivent leur propre présentation.');
    for (const phase of ['intro','roundVictory','matchVictory','roundDefeat','matchDefeat']) {
      const pose = phase === 'intro' ? phase : phase.endsWith('Victory') ? 'victory' : 'defeat';
      const file = imagePath(directory+pose);
      if (files.has(file)) update(production, 'SEQ-'+id+'-'+phase, { 6: file+' · combat/render-sequences.mjs' });
    }
  }
  for (const row of data.atlas) {
    if (poses.has(row[0])) row[16] = 'Dessins individuels : '+poseList(row[0])+'. '+art+'poses/'+row[0]+'/';
  }
  for (const stage of data.stages) {
    const id = stage[0], dir = art+'stages/'+id+'/';
    if (!['far','mid','near'].every(plane => imagePath(dir+plane))) continue;
    stage[3] = 'Implémenté';
    stage[13] = 'Trois plans illustrés pour le duel · '+dir;
    assetRow('ART-'+id+'-background', dir+'far.webp', 'Fond et plan médian séparés. '+imagePath(dir+'mid'), 'Implémenté');
    assetRow('ART-'+id+'-foreground', dir+'near.webp', 'Premier plan détouré et défilement différentiel.', 'Implémenté');
    update(production, 'ANIM-'+id+'-ambience', { 6: dir+' · combat/stage-parallax.mjs · combat/render-stage-motion.mjs' });
  }
  for (const row of data.production) {
    const finale = /^FIN-(\w+)\.(impact|special|super)$/.exec(row[0]);
    if (finale) {
      const file = imagePath(art+'finales/'+finale[1]+'/'+finale[2]);
      if (files.has(file)) {
        row[6] = file+' · combat/render-finishers.mjs';
        row[8] = row[8].split(/\n(?:Travail artistique restant|Décor de finale illustré)/)[0]
          +'\nDécor de finale illustré utilisé après le KO et dans la galerie. Les poses animées image par image et la comparaison aux références primaires restent ouvertes.';
      }
    }
    const panel = /^(?:BOARD|BRIEF)-((\w+)-(?:prologue|epilogue|chapter)-\d+)$/.exec(row[0]);
    if (panel) {
      const file = imagePath(art+'campaign/'+panel[2]+'/'+panel[1]);
      if (files.has(file)) row[6] = file+' · combat/story-presentation.mjs';
    }
  }
  if (counts.finales) update(features,'CQC-24',{ 5: art+'finales/ · combat/render-finishers.mjs', 7: counts.finales+' décors individuels. Les artistes et leurs tenues sont composés devant le dessin. Voix et comparaison canonique restent ouvertes.' });
  if (counts.stages) {
    update(features,'PRE-06',{ 5: art+'stages/ · combat/stage-parallax.mjs', 7: counts.stages+' illustrations pour les plans de profondeur. Les références de lieux et leurs limites sont consignées dans Arènes.' });
    update(features,'PRE-17',{ 5: 'combat/stage-parallax.mjs · combat/render-stage-motion.mjs', 7: 'Trois profondeurs et leurs effets de scène. Le réglage de mouvement réduit fige la parallaxe.' });
  }
  if (counts.campaign) update(features,'PRE-20',{ 5: art+'campaign/ · combat/story-presentation.mjs', 7: counts.campaign+' tableaux illustrés. Les dialogues et les mises en scène sont des adaptations françaises pour Encore.' });
  if (counts.selection) update(features,'PRE-01',{ 5: art+'selection/ · combat/app.mjs', 7: counts.selection+' portraits individuels et '+counts.stance+' gardes, apparences originales et tenues équipables comprises.' });
  data.counts.offlineImages = files.size;
  data.counts.offlineBytes = ART_BYTES;
  data.illustratedAssets = counts;
  const offline = data.sources.find(source => source.id === 'offline');
  if (offline) offline.scope = files.size+' images dans le pack hors ligne, '+ART_BYTES+' octets.';
}
