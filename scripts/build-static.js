const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { buildOutputPath } = require('./build-output.cjs');

const root = process.cwd();
execFileSync(process.execPath, [path.join(root, 'scripts/build-combat-offline.mjs')], { stdio: 'inherit' });
const dist = buildOutputPath(root, process.env.CAINOS_BUILD_OUTPUT, 'dist', 'CAINOS_BUILD_OUTPUT');
const files = ['index.html', 'index.css', 'app.js', 'episodes.js', 'cloud-account.js', 'favicon.png'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
  console.log(`copied ${file} -> dist/${file}`);
}

const assetsDir = path.join(root, 'assets');
if (fs.existsSync(assetsDir)) {
  fs.cpSync(assetsDir, path.join(dist, 'assets'), { recursive: true });
  console.log('copied assets -> dist/assets');
}

fs.cpSync(path.join(root, 'combat'), path.join(dist, 'combat'), { recursive: true });
console.log('copied combat -> dist/combat');
console.log(`CainOS ready: ${dist}`);
