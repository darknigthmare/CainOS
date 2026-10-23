import fs from 'node:fs/promises';
import path from 'node:path';
import { constants } from 'node:fs';

export class WorkbookPublicationError extends Error {
  constructor(message, details) {
    super(message, { cause: details.cause });
    this.name = 'WorkbookPublicationError';
    Object.assign(this, details);
  }
}

const errorDetails = error => ({ message: error.message, code: error.code || null });

async function restoreOriginals(entries) {
  const errors = [];
  for (const entry of [...entries].reverse()) {
    try {
      if (entry.existed) {
        // Never consume a backup: another restoration may still fail.
        await fs.copyFile(entry.backup, entry.restore, constants.COPYFILE_EXCL);
        await fs.chmod(entry.restore, entry.mode);
        await fs.utimes(entry.restore, new Date(entry.atimeMs), new Date(entry.mtimeMs));
        await fs.rename(entry.restore, entry.destination);
      } else {
        await fs.rm(entry.destination, { force: true });
      }
    } catch (error) {
      errors.push({ name: entry.name, error });
    }
  }
  return errors;
}

/**
 * Publish validated files with rollback on a caught replacement failure.
 * All sources are staged on the destination filesystem and all originals are
 * backed up before the first replacement. Each rename is atomic; the group is
 * not atomically visible to readers and is not a power-loss transaction.
 *
 * A failed rollback retains every backup, its recovery journal and the writer
 * lock. Callers must not remove recoveryDirectory in their own finally blocks.
 * See docs/COMBAT_WORKBOOK_PUBLICATION.md for the guarantees and recovery steps.
 */
export async function publishWorkbookArtifacts({ outputDirectory, files }) {
  const output = path.resolve(outputDirectory);
  if (!Array.isArray(files) || !files.length) throw new TypeError('Publication requires at least one file');
  const names = new Set();
  const entries = files.map(({ source, name }) => {
    if (typeof name !== 'string' || !name || name === '.' || name === '..' || /[\\/]/.test(name) || name.toLowerCase().startsWith('.workbook-publication')) {
      throw new TypeError('Publication names must be plain filenames');
    }
    const key = name.toLowerCase();
    if (names.has(key)) throw new TypeError(`Duplicate publication name: ${name}`);
    names.add(key);
    if (typeof source !== 'string' || !source) throw new TypeError(`Missing publication source: ${name}`);
    return { name, source: path.resolve(source), destination: path.join(output, name) };
  });
  const lockPath = path.join(output, '.workbook-publication.lock');
  let lockOwned = false;
  let transactionDirectory;
  let commitStarted = false;
  let committed = false;
  let retainRecovery = false;
  let phase = 'lock';
  let failure;
  let journal;

  try {
    const lock = await fs.open(lockPath, 'wx', 0o600);
    lockOwned = true;
    try {
      await lock.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }) + '\n');
    } finally {
      await lock.close();
    }

    phase = 'staging';
    transactionDirectory = await fs.mkdtemp(path.join(output, '.workbook-publication-'));
    for (const directory of ['staged', 'backups', 'restore']) {
      await fs.mkdir(path.join(transactionDirectory, directory));
    }
    for (const entry of entries) {
      entry.staged = path.join(transactionDirectory, 'staged', entry.name);
      entry.backup = path.join(transactionDirectory, 'backups', entry.name);
      entry.restore = path.join(transactionDirectory, 'restore', entry.name);
      if (!(await fs.lstat(entry.source)).isFile()) throw new Error(`Publication source is not a regular file: ${entry.source}`);
      await fs.copyFile(entry.source, entry.staged, constants.COPYFILE_EXCL);
    }

    phase = 'backup';
    for (const entry of entries) {
      let stat;
      try {
        stat = await fs.lstat(entry.destination);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      entry.existed = !!stat;
      if (!stat) continue;
      if (!stat.isFile()) throw new Error(`Publication destination is not a regular file: ${entry.destination}`);
      entry.mode = stat.mode & 0o7777;
      entry.atimeMs = stat.atimeMs;
      entry.mtimeMs = stat.mtimeMs;
      await fs.copyFile(entry.destination, entry.backup, constants.COPYFILE_EXCL);
      await fs.chmod(entry.backup, entry.mode);
      await fs.utimes(entry.backup, new Date(entry.atimeMs), new Date(entry.mtimeMs));
      // Replacing a private tracker must not broaden its existing permissions.
      await fs.chmod(entry.staged, entry.mode);
    }

    phase = 'journal';
    journal = {
      version: 1,
      state: 'prepared',
      outputDirectory: output,
      createdAt: new Date().toISOString(),
      originals: entries.map(entry => ({
        name: entry.name,
        existed: entry.existed,
        backup: entry.existed ? `backups/${entry.name}` : null,
        ...(entry.existed ? { mode: entry.mode, atimeMs: entry.atimeMs, mtimeMs: entry.mtimeMs } : {}),
      })),
    };
    await fs.writeFile(path.join(transactionDirectory, 'recovery.json'), JSON.stringify(journal, null, 2) + '\n', { flag: 'wx', mode: 0o600 });

    phase = 'replacement';
    commitStarted = true;
    for (const entry of entries) await fs.rename(entry.staged, entry.destination);
    committed = true;
  } catch (cause) {
    if (commitStarted) {
      // Retain recovery data until every restoration has positively succeeded.
      retainRecovery = true;
      const rollbackErrors = await restoreOriginals(entries);
      if (rollbackErrors.length) {
        const recoveryJournal = {
          ...journal,
          state: 'rollback-incomplete',
          publicationError: errorDetails(cause),
          rollbackErrors: rollbackErrors.map(({ name, error }) => ({ name, ...errorDetails(error) })),
        };
        try {
          const pendingJournal = path.join(transactionDirectory, 'recovery.pending.json');
          await fs.writeFile(pendingJournal, JSON.stringify(recoveryJournal, null, 2) + '\n', { mode: 0o600 });
          await fs.rename(pendingJournal, path.join(transactionDirectory, 'recovery.json'));
        } catch (error) {
          // The prepared journal and all backups still describe the old state.
          rollbackErrors.push({ name: 'recovery.json', error });
        }
        failure = new WorkbookPublicationError(`Publication failed and rollback is incomplete. Recovery files retained at ${transactionDirectory}`, {
          cause, code: 'WORKBOOK_ROLLBACK_INCOMPLETE', phase, committed: false,
          rollbackSucceeded: false, rollbackErrors, recoveryDirectory: transactionDirectory, lockPath,
        });
      } else {
        retainRecovery = false;
        failure = new WorkbookPublicationError('Publication failed; every original file or prior absence was restored', {
          cause, code: 'WORKBOOK_PUBLICATION_ROLLED_BACK', phase, committed: false, rollbackSucceeded: true,
        });
      }
    } else {
      const locked = phase === 'lock' && cause.code === 'EEXIST' && !lockOwned;
      failure = new WorkbookPublicationError(locked
        ? `Workbook publication is already locked; check the active run or retained recovery files: ${lockPath}`
        : 'Workbook publication preparation failed before any destination was replaced', {
        cause, code: locked ? 'WORKBOOK_PUBLICATION_LOCKED' : 'WORKBOOK_PUBLICATION_PREPARE_FAILED',
        phase, committed: false, ...(locked ? { lockPath } : {}),
      });
    }
  } finally {
    if (!retainRecovery) {
      const cleanupErrors = [];
      if (transactionDirectory) {
        try { await fs.rm(transactionDirectory, { recursive: true, force: true }); }
        catch (error) { cleanupErrors.push(error); }
      }
      if (lockOwned) {
        try { await fs.unlink(lockPath); }
        catch (error) { cleanupErrors.push(error); }
      }
      if (cleanupErrors.length) {
        if (failure) failure.cleanupErrors = cleanupErrors;
        else failure = new WorkbookPublicationError('Workbook files were published, but private temporary files could not all be removed', {
          cause: cleanupErrors[0], code: 'WORKBOOK_PUBLICATION_CLEANUP_FAILED', phase: 'cleanup', committed,
          cleanupErrors, recoveryDirectory: transactionDirectory,
        });
      }
    }
  }
  if (failure) throw failure;
  return { published: entries.map(entry => entry.name) };
}
