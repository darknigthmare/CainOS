import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FIGHTERS, ARCHIVE } from '../combat/data.mjs';

// The standalone keeps the same relative paths as CainOS. No OS runtime is needed.
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist-combat');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'combat'), path.join(output, 'combat'), { recursive: true });
const files = new Set([...ARCHIVE.map(item => item.sprite.src), ...FIGHTERS.map(f => f.sprite.src), ...FIGHTERS.filter(f => f.animation).map(f => f.animation.src)]);
for (const source of files) {
  const relative = path.normalize(path.join('combat', source));
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Invalid asset path: ${source}`);
  const destination = path.join(output, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, relative), destination);
}
fs.writeFileSync(path.join(output, 'index.html'), '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Digital Circus — Encore</title><script>location.replace("./combat/index.html?standalone=1"+location.hash)</script><body><a href="combat/index.html?standalone=1">Jouer à Digital Circus — Encore</a></body></html>');
fs.writeFileSync(path.join(output, 'README.txt'), 'Digital Circus — Encore 0.1.0\n\nVersion autonome : aucun chargement de CainOS nécessaire.\nServir ce dossier via un serveur HTTP statique, puis ouvrir index.html.\nExemple : python3 -m http.server 8080\n\nLes modules JavaScript nécessitent HTTP ; le double-clic file:// ne convient pas.\nHébergement statique : sélectionner ce dossier comme sortie.\nSur le même domaine, les profils sont partagés avec CainOS. Sur un autre\ndomaine, utiliser Exporter/Importer le profil dans les Réglages.\n\nLes assets proviennent de CainOS ; les techniques sont des adaptations\nde fan-game. Réseau et cloud ne sont pas nécessaires au combat.\n');
console.log(`Standalone ready: dist-combat/ (${files.size} original sprite sheets).`);
