const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dist = path.join(root, 'dist');
const files = ['index.html', 'index.css', 'app.js', 'episodes.js'];

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
