import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import helpers from '../scripts/build-output.cjs';
const { buildOutputPath } = helpers;

test('build output accepts the default and an external destination without creating them', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'encore-build-output-'));
  try {
    const root = path.join(base, 'source'); fs.mkdirSync(root);
    assert.equal(buildOutputPath(root, '', 'dist', 'OUT'), path.join(root, 'dist'));
    const external = path.join(base, 'delivery', 'missing');
    assert.equal(buildOutputPath(root, external, 'dist', 'OUT'), external);
    assert.equal(fs.existsSync(external), false);
    for (const bad of [root, base, path.parse(base).root, path.join(root, 'combat'), path.join(root, 'assets', 'missing')]) {
      assert.throws(() => buildOutputPath(root, bad, 'dist', 'OUT'), /outside the source checkout/);
    }
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});

test('build output rejects aliases and symlink parents that resolve into the source', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'encore-build-alias-'));
  try {
    const root = path.join(base, 'source'), alias = path.join(base, 'alias');
    fs.mkdirSync(path.join(root, 'combat'), { recursive: true });
    fs.mkdirSync(path.join(root, 'assets'));
    fs.symlinkSync(root, alias, 'dir');
    for (const bad of [alias, path.join(alias, 'combat'), path.join(alias, 'assets', 'missing')]) {
      assert.throws(() => buildOutputPath(root, bad, 'dist', 'OUT'), /outside the source checkout/);
    }
    assert.throws(() => buildOutputPath(alias, root, 'dist', 'OUT'), /outside the source checkout/);
    assert.equal(fs.existsSync(path.join(root, 'combat')), true);
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});
