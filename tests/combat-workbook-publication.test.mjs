import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { publishWorkbookArtifacts, WorkbookPublicationError } from '../scripts/workbook-publication.mjs';

const names = ['tracker.xlsx', 'data.json', 'verification.json'];
const oldBytes = names.map((name, index) => Buffer.from(`OLD ${name}\0${index}\nNotes: =literal; 0; false; relative formula\n`));
const newBytes = names.map((name, index) => Buffer.from(`NEW ${name}\0${index}\nvalidated generation\n`));
const fixtureTime = 1_600_000_000_000;

async function fixture(t, mask = 7) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'workbook-publication-test-'));
  t.after(() => fs.rm(base, { recursive: true, force: true }));
  const source = path.join(base, 'source');
  const output = path.join(base, 'output');
  await fs.mkdir(source); await fs.mkdir(output);
  const png = path.join(output, 'preview.png');
  const unrelated = path.join(output, 'unrelated.pending.json');
  await fs.writeFile(png, 'PNG sentinel'); await fs.writeFile(unrelated, 'unrelated sentinel');
  const files = [];
  for (const [index, name] of names.entries()) {
    const input = path.join(source, name), destination = path.join(output, name);
    await fs.writeFile(input, newBytes[index]);
    if (mask & (1 << index)) {
      await fs.writeFile(destination, oldBytes[index], { mode: 0o640 });
      await fs.utimes(destination, new Date(fixtureTime), new Date(fixtureTime));
    }
    files.push({ source: input, name });
  }
  return { base, source, output, mask, files, png, unrelated };
}

async function assertOriginals(f) {
  for (const [index, name] of names.entries()) {
    const destination = path.join(f.output, name);
    if (f.mask & (1 << index)) {
      assert.deepEqual(await fs.readFile(destination), oldBytes[index], name);
      const stat = await fs.stat(destination);
      assert.equal(stat.mode & 0o777, 0o640, name);
      assert.equal(stat.mtimeMs, fixtureTime, name);
    } else {
      await assert.rejects(fs.lstat(destination), { code: 'ENOENT' }, name);
    }
  }
}

async function assertPrivateFilesRemoved(f) {
  const actual = (await fs.readdir(f.output)).filter(name => name.startsWith('.workbook-publication'));
  assert.deepEqual(actual, []);
  assert.equal(await fs.readFile(f.png, 'utf8'), 'PNG sentinel');
  assert.equal(await fs.readFile(f.unrelated, 'utf8'), 'unrelated sentinel');
}

function ioFailure(message) {
  return Object.assign(new Error(message), { code: 'EIO' });
}

async function failingRenameMatrix(t, failurePosition) {
  const rename = fs.rename;
  for (let mask = 0; mask < 8; mask++) {
    const f = await fixture(t, mask);
    let replacements = 0, injected = false;
    const mocked = t.mock.method(fs, 'rename', async (source, destination) => {
      if (path.dirname(destination) === f.output && names.includes(path.basename(destination)) && !injected) {
        replacements++;
        if (replacements === failurePosition) {
          injected = true;
          throw ioFailure(`replacement ${failurePosition}`);
        }
      }
      return rename(source, destination);
    });
    try {
      await assert.rejects(publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }), error => {
        assert.ok(error instanceof WorkbookPublicationError);
        assert.equal(error.code, 'WORKBOOK_PUBLICATION_ROLLED_BACK');
        assert.equal(error.rollbackSucceeded, true);
        assert.equal(error.cause.message, `replacement ${failurePosition}`);
        return true;
      });
    } finally {
      mocked.mock.restore();
    }
    assert.equal(injected, true);
    await assertOriginals(f);
    await assertPrivateFilesRemoved(f);
  }
}

test('workbook publication commits every file for all eight previous presence combinations', async t => {
  for (let mask = 0; mask < 8; mask++) {
    const f = await fixture(t, mask);
    assert.deepEqual(await publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }), { published: names });
    for (const [index, name] of names.entries()) {
      assert.deepEqual(await fs.readFile(path.join(f.output, name)), newBytes[index]);
      if (mask & (1 << index)) assert.equal((await fs.stat(path.join(f.output, name))).mode & 0o777, 0o640);
      assert.deepEqual(await fs.readFile(f.files[index].source), newBytes[index]);
    }
    await assertPrivateFilesRemoved(f);
  }
});

test('failure of the first replacement restores every previous file or absence', async t => {
  await failingRenameMatrix(t, 1);
});

test('failure of the second replacement restores every previous file or absence', async t => {
  await failingRenameMatrix(t, 2);
});

test('failure of the third replacement restores every previous file or absence', async t => {
  await failingRenameMatrix(t, 3);
});

test('a partially copied source aborts before replacements and cleans only private files', async t => {
  const f = await fixture(t, 5), copyFile = fs.copyFile;
  const mocked = t.mock.method(fs, 'copyFile', async (source, destination, mode) => {
    if (source === f.files[1].source) {
      await fs.writeFile(destination, 'PARTIAL SOURCE COPY');
      throw ioFailure('staging copy');
    }
    return copyFile(source, destination, mode);
  });
  try {
    await assert.rejects(publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }), error => {
      assert.equal(error.code, 'WORKBOOK_PUBLICATION_PREPARE_FAILED');
      assert.equal(error.phase, 'staging');
      return true;
    });
  } finally { mocked.mock.restore(); }
  await assertOriginals(f); await assertPrivateFilesRemoved(f);
});

test('a partial backup failure preserves all originals and performs no replacement', async t => {
  const f = await fixture(t), copyFile = fs.copyFile, rename = fs.rename;
  let replacementCount = 0;
  const copyMock = t.mock.method(fs, 'copyFile', async (source, destination, mode) => {
    if (source === path.join(f.output, names[1])) {
      await fs.writeFile(destination, 'PARTIAL BACKUP');
      throw ioFailure('backup copy');
    }
    return copyFile(source, destination, mode);
  });
  const renameMock = t.mock.method(fs, 'rename', async (source, destination) => {
    if (path.dirname(destination) === f.output) replacementCount++;
    return rename(source, destination);
  });
  try {
    await assert.rejects(publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }), error => {
      assert.equal(error.code, 'WORKBOOK_PUBLICATION_PREPARE_FAILED');
      assert.equal(error.phase, 'backup');
      return true;
    });
  } finally { copyMock.mock.restore(); renameMock.mock.restore(); }
  assert.equal(replacementCount, 0);
  await assertOriginals(f); await assertPrivateFilesRemoved(f);
});

test('all originals are backed up and journaled before the first replacement', async t => {
  const f = await fixture(t), copyFile = fs.copyFile, rename = fs.rename;
  const backups = new Map();
  let inspected = false;
  const copyMock = t.mock.method(fs, 'copyFile', async (source, destination, mode) => {
    const result = await copyFile(source, destination, mode);
    if (path.dirname(source) === f.output && names.includes(path.basename(source))) backups.set(path.basename(source), destination);
    return result;
  });
  const renameMock = t.mock.method(fs, 'rename', async (source, destination) => {
    if (!inspected && path.dirname(destination) === f.output) {
      inspected = true;
      assert.equal(backups.size, 3);
      for (const [index, name] of names.entries()) assert.deepEqual(await fs.readFile(backups.get(name)), oldBytes[index]);
      const recovery = path.join(path.dirname(path.dirname(backups.get(names[0]))), 'recovery.json');
      const journal = JSON.parse(await fs.readFile(recovery, 'utf8'));
      assert.equal(journal.state, 'prepared'); assert.equal(journal.originals.length, 3);
      await assertOriginals(f);
    }
    return rename(source, destination);
  });
  try { await publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }); }
  finally { copyMock.mock.restore(); renameMock.mock.restore(); }
  assert.equal(inspected, true); await assertPrivateFilesRemoved(f);
});

test('a failed restoration retains every backup and blocks another writer', async t => {
  const f = await fixture(t), rename = fs.rename;
  let replacing = 0, rollback = false, error;
  const mocked = t.mock.method(fs, 'rename', async (source, destination) => {
    if (path.dirname(destination) === f.output && names.includes(path.basename(destination))) {
      if (!rollback && ++replacing === 3) { rollback = true; throw ioFailure('third replacement'); }
      if (rollback && path.basename(destination) === names[1]) throw ioFailure('restoring data');
    }
    return rename(source, destination);
  });
  try {
    await assert.rejects(publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }), caught => {
      error = caught;
      assert.equal(caught.code, 'WORKBOOK_ROLLBACK_INCOMPLETE');
      assert.equal(caught.rollbackSucceeded, false);
      assert.equal(caught.rollbackErrors.length, 1);
      return true;
    });
  } finally { mocked.mock.restore(); }
  for (const [index, name] of names.entries()) assert.deepEqual(await fs.readFile(path.join(error.recoveryDirectory, 'backups', name)), oldBytes[index]);
  assert.deepEqual(await fs.readFile(path.join(f.output, names[0])), oldBytes[0]);
  assert.deepEqual(await fs.readFile(path.join(f.output, names[1])), newBytes[1]);
  assert.deepEqual(await fs.readFile(path.join(f.output, names[2])), oldBytes[2]);
  const journal = JSON.parse(await fs.readFile(path.join(error.recoveryDirectory, 'recovery.json'), 'utf8'));
  assert.equal(journal.state, 'rollback-incomplete');
  assert.equal(journal.originals.length, 3);
  await assert.rejects(publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }), { code: 'WORKBOOK_PUBLICATION_LOCKED' });
  for (const [index, name] of names.entries()) assert.deepEqual(await fs.readFile(path.join(error.recoveryDirectory, 'backups', name)), oldBytes[index]);
  assert.equal(await fs.readFile(f.png, 'utf8'), 'PNG sentinel');
  assert.equal(await fs.readFile(f.unrelated, 'utf8'), 'unrelated sentinel');
});

test('failure to restore a prior absence retains recovery data and records that absence', async t => {
  const f = await fixture(t, 5), rename = fs.rename, rm = fs.rm;
  let replacing = 0, rollback = false, error;
  const renameMock = t.mock.method(fs, 'rename', async (source, destination) => {
    if (path.dirname(destination) === f.output && names.includes(path.basename(destination)) && !rollback && ++replacing === 3) {
      rollback = true; throw ioFailure('third replacement');
    }
    return rename(source, destination);
  });
  const rmMock = t.mock.method(fs, 'rm', async (target, options) => {
    if (rollback && target === path.join(f.output, names[1])) throw ioFailure('removing newly created file');
    return rm(target, options);
  });
  try {
    await assert.rejects(publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }), caught => {
      error = caught; assert.equal(caught.code, 'WORKBOOK_ROLLBACK_INCOMPLETE'); return true;
    });
  } finally { renameMock.mock.restore(); rmMock.mock.restore(); }
  const journal = JSON.parse(await fs.readFile(path.join(error.recoveryDirectory, 'recovery.json'), 'utf8'));
  assert.equal(journal.originals[1].existed, false); assert.equal(journal.originals[1].backup, null);
  for (const index of [0, 2]) assert.deepEqual(await fs.readFile(path.join(error.recoveryDirectory, 'backups', names[index])), oldBytes[index]);
  assert.deepEqual(await fs.readFile(path.join(f.output, names[1])), newBytes[1]);
});

test('destinations that are symlinks are rejected before any replacement', async t => {
  const f = await fixture(t, 5), outside = path.join(f.base, 'outside.json');
  await fs.writeFile(outside, 'outside sentinel');
  await fs.symlink(outside, path.join(f.output, names[1]));
  await assert.rejects(publishWorkbookArtifacts({ outputDirectory: f.output, files: f.files }), { code: 'WORKBOOK_PUBLICATION_PREPARE_FAILED' });
  assert.equal(await fs.readFile(outside, 'utf8'), 'outside sentinel');
  assert.equal((await fs.lstat(path.join(f.output, names[1]))).isSymbolicLink(), true);
  for (const index of [0, 2]) assert.deepEqual(await fs.readFile(path.join(f.output, names[index])), oldBytes[index]);
  await assertPrivateFilesRemoved(f);
});

test('invalid duplicate traversal and reserved filenames fail before filesystem changes', async t => {
  const f = await fixture(t);
  for (const invalid of [
    [...f.files, { source: f.files[0].source, name: names[0].toUpperCase() }],
    [{ source: f.files[0].source, name: '../outside.xlsx' }],
    [{ source: f.files[0].source, name: '.workbook-publication.lock' }],
  ]) await assert.rejects(publishWorkbookArtifacts({ outputDirectory: f.output, files: invalid }), TypeError);
  await assertOriginals(f); await assertPrivateFilesRemoved(f);
});
