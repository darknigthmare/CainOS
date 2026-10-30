/** Verify the pinned, unmodified gamedev reference snapshot and project links. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const defaultRoot = fileURLToPath(new URL('../', import.meta.url));
const prefix = 'docs/gamedev/upstream/';
const sourceRepository = 'https://github.com/gamedev-skills/awesome-gamedev-agent-skills';

export async function auditGamedevGuides(root = defaultRoot) {
  root = path.resolve(root);
  const errors = [];
  const checked = new Set();
  const fail = message => errors.push(message);
  const local = name => {
    if (typeof name !== 'string' || name.includes('\\') || path.posix.isAbsolute(name)
        || name.split('/').includes('..')) throw new Error('Invalid repository path: ' + name);
    return path.join(root, name);
  };
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(local('docs/gamedev/manifest.json'), 'utf8'));
  } catch (error) {
    return { pass: false, errors: ['Cannot read guide manifest: ' + error.message] };
  }
  if (manifest.schema !== 'cainos-gamedev-snapshot/v1') fail('Unknown guide snapshot schema.');
  if (manifest.upstreamRepository !== sourceRepository) fail('Unexpected upstream repository.');
  if (!/^[a-f0-9]{40}$/.test(manifest.upstreamCommit || '')) fail('Upstream commit must be a full Git SHA.');
  if (manifest.license !== 'Apache-2.0') fail('Snapshot license must retain the upstream attribution.');
  const files = Array.isArray(manifest.files) ? manifest.files : [];
  const selection = Array.isArray(manifest.selection) ? manifest.selection : [];
  if (!files.length || !selection.length) fail('The snapshot and guide selection must be populated.');
  let verifiedBytes = 0;
  for (const entry of files) {
    try {
      if (!entry.path?.startsWith(prefix)) throw new Error('File is outside the snapshot.');
      if (entry.path !== prefix + entry.upstreamPath) throw new Error('Upstream path mapping differs.');
      if (checked.has(entry.path)) throw new Error('Duplicate manifest path.');
      checked.add(entry.path);
      if (entry.modified !== false) throw new Error('Snapshot files must remain unchanged.');
      const url = sourceRepository + '/blob/' + manifest.upstreamCommit + '/' + entry.upstreamPath;
      if (entry.sourceUrl !== url) throw new Error('Source URL is not pinned to the recorded commit.');
      const file = local(entry.path), stat = await fs.lstat(file);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Expected a regular snapshot file.');
      const bytes = await fs.readFile(file);
      if (bytes.length !== entry.bytes) throw new Error('Byte length differs from upstream.');
      const hash = createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
      if (hash !== entry.gitBlobSha1) throw new Error('Git blob differs from upstream.');
      verifiedBytes += bytes.length;
    } catch (error) { fail((entry.path || '<unnamed>') + ': ' + error.message); }
  }
  for (const notice of ['licensePath', 'noticePath']) {
    if (!checked.has(manifest[notice])) fail('Required attribution file is absent: ' + notice);
  }
  const names = new Set();
  for (const guide of selection) {
    try {
      if (names.has(guide.name)) throw new Error('Duplicate selected guide.');
      names.add(guide.name);
      if (!checked.has(guide.path) || !guide.path.endsWith('/SKILL.md')) throw new Error('Guide is not a recorded SKILL.md.');
      const body = await fs.readFile(local(guide.path), 'utf8');
      const actualName = body.match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
      if (actualName !== guide.name) throw new Error('Guide name differs from frontmatter.');
    } catch (error) { fail((guide.name || '<unnamed guide>') + ': ' + error.message); }
  }
  if (!names.has('router')) fail('The selected reference router is missing.');
  async function visit(folder) {
    for (const item of await fs.readdir(local(folder), { withFileTypes: true })) {
      const name = folder + '/' + item.name;
      if (item.isDirectory()) await visit(name);
      else if (!item.isFile() || !checked.has(name)) fail('Unrecorded snapshot entry: ' + name);
    }
  }
  try { await visit(prefix.slice(0, -1)); } catch (error) { fail('Snapshot inventory: ' + error.message); }

  let localLinks = 0;
  for (const document of ['AGENTS.md', 'docs/GAMEDEV_WORKFLOW.md']) {
    try {
      const body = await fs.readFile(local(document), 'utf8');
      for (const [, target] of body.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
        if (/^(https?:|#)/.test(target)) continue;
        const relative = path.posix.normalize(path.posix.join(path.posix.dirname(document), target.split('#')[0]));
        await fs.access(local(relative));
        localLinks++;
      }
    } catch (error) { fail(document + ': ' + error.message); }
  }
  return {
    pass: errors.length === 0, upstreamCommit: manifest.upstreamCommit,
    guides: selection.length, files: files.length, verifiedBytes, localLinks, errors,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await auditGamedevGuides();
  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exitCode = 1;
}
