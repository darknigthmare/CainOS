const fs = require('node:fs');
const path = require('node:path');

function physicalPath(target) {
  let ancestor = path.resolve(target);
  const suffix = [];
  while (!fs.existsSync(ancestor)) {
    const parent = path.dirname(ancestor);
    if (parent === ancestor) throw new Error(`Cannot resolve build output: ${target}`);
    suffix.unshift(path.basename(ancestor));
    ancestor = parent;
  }
  return path.resolve(fs.realpathSync(ancestor), ...suffix);
}

// Validate before either build removes its output. Resolve existing symlink
// parents as well as lexical '..' components to protect the source checkout.
function buildOutputPath(root, preferred, defaultName, variableName) {
  const output = path.resolve(preferred || path.join(root, defaultName));
  const source = physicalPath(root), destination = physicalPath(output);
  if (destination === path.parse(destination).root || destination === source ||
      source.startsWith(destination + path.sep) ||
      (destination.startsWith(source + path.sep) && destination !== path.join(source, defaultName))) {
    throw new Error(`${variableName} must be ${defaultName} or a directory outside the source checkout.`);
  }
  return output;
}

module.exports = { buildOutputPath };
