/**
 * Reproducible pull-request verification. Every reported case comes from a
 * completed process on the checked-out runtime; historical evidence stays separate.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { GAME_VERSION } from '../combat/session.mjs';

const root = process.cwd(), output = path.join(root, 'audit-combat/ci');
await fs.mkdir(output, { recursive: true });
const sha = data => createHash('sha256').update(data).digest('hex');
async function files(folder) {
  const rows = [];
  for (const item of await fs.readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, item.name);
    if (item.isDirectory()) rows.push(...await files(file)); else rows.push(file);
  }
  return rows.sort();
}
async function runtimeHashes() {
  const sourceFiles = (await files(path.join(root, 'combat'))).filter(file => /\.(mjs|js|css|html|svg|webmanifest|png)$/.test(file));
  const result = {};
  for (const file of sourceFiles) result[path.relative(root, file).replaceAll(path.sep, '/')] = sha(await fs.readFile(file));
  return result;
}
const report = {
  schema: 'encore-ci-evidence/v1', gameVersion: GAME_VERSION,
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  generatedAt: new Date().toISOString(),
  runUrl: process.env.GITHUB_RUN_ID ? 'https://github.com/' + process.env.GITHUB_REPOSITORY + '/actions/runs/' + process.env.GITHUB_RUN_ID : null,
  runtime: { node: process.version, platform: process.platform, arch: process.arch },
  runtimeSourceHashes: await runtimeHashes(), nodeReports: [], browserReports: [],
  limitations: [
    'Canonical 1:1 art, voice acting and final sound mix remain unverified.',
    'Browser checks use Chromium and virtual clocks where explicitly recorded; physical phones, two physical controllers and low-end hardware are not exercised.',
    'Historical before/after artwork suites are not rerun: the source PNG assets are unchanged in 0.7.',
    'Gallery previews are not earned combat victories. Played matches are recorded separately by the roster and story suites.'
  ]
};
const reportFile = path.join(output, 'evidence-' + GAME_VERSION + '.json');
async function save() { await fs.writeFile(reportFile, JSON.stringify(report, null, 2) + '\n'); }
async function run(file, extraEnv = {}, label = file) {
  const started = Date.now();
  const args = file.endsWith('.test.mjs') ? ['--test', '--test-reporter=tap', file] : [file];
  const child = spawn(process.execPath, args, { cwd: root, env: { ...process.env, ...extraEnv }, stdio: ['ignore', 'pipe', 'pipe'] });
  let transcript = '', timedOut = false;
  const append = chunk => { transcript += chunk; process.stdout.write(chunk); };
  child.stdout.on('data', append); child.stderr.on('data', append);
  const timer = setTimeout(() => { timedOut = true; child.kill('SIGTERM'); setTimeout(() => child.kill('SIGKILL'), 3000).unref(); }, 420000);
  let exitCode;
  try { exitCode = await new Promise((resolve, reject) => { child.on('error', reject); child.on('close', code => resolve(code ?? 1)); }); }
  finally { clearTimeout(timer); }
  const name = label.replace(/[^a-z0-9.-]+/gi, '_');
  const logFile = path.join(output, name + '.log');
  await fs.writeFile(logFile, transcript);
  return { file, label, exitCode, passed: exitCode === 0 && !timedOut, timedOut, elapsedSeconds: (Date.now() - started) / 1000, sourceSha256: sha(await fs.readFile(file)), log: path.relative(root, logFile), transcript };
}

const nodeFiles = (await fs.readdir('tests')).filter(name => /^combat-.*\.test\.mjs$/.test(name)).sort();
for (const name of nodeFiles) {
  const result = await run('tests/' + name);
  const testNames = [...result.transcript.matchAll(/^# Subtest: (.+)$/gm)].map(match => match[1]);
  const count = Number(result.transcript.match(/^# tests (\d+)$/m)?.[1] ?? testNames.length);
  const passedCount = Number(result.transcript.match(/^# pass (\d+)$/m)?.[1] ?? 0);
  const { transcript, ...metadata } = result;
  report.nodeReports.push({ ...metadata, count, passedCount, testNames, passed: metadata.passed && count > 0 && count === passedCount && testNames.length === count });
  await save();
}
if (report.nodeReports.some(row => !row.passed)) {
  report.pass = false; report.failure = 'A Node suite failed; browser execution did not start.';
  await save(); process.exitCode = 1;
} else {
  const browserSuites = [
    ['tests/combat-browser.mjs', 'audit-combat/browser-report.json'],
    ['tests/combat-finishers-browser.mjs', 'audit-combat/finishers-0.7.0/browser-report.json'],
    ['tests/combat-audio-ambiences-browser.mjs', 'audit-combat/audio-ambiences-0.7.0/browser-report.json'],
    ['tests/combat-training-browser.mjs', 'audit-combat/training-browser-report.json'],
    ['tests/combat-profile-recovery-browser.mjs', 'audit-combat/profile-recovery-browser-report.json'],
    ['tests/combat-encore-browser.mjs', 'audit-combat/encore-browser-report.json'],
    ['tests/combat-progression-browser.mjs', 'audit-combat/progression-browser-report.json'],
    ['tests/combat-progression-browser.mjs', 'audit-combat/storage-browser-report.json', { COMBAT_TEST_SCOPE: 'storage' }, 'storage'],
    ['tests/combat-story-presentation-browser.mjs', 'audit-combat/story-presentation-browser-report.json'],
    ['tests/combat-roster-browser.mjs', 'audit-combat/roster-browser-report.json'],
    ['tests/combat-reduced-motion-browser.mjs', 'audit-combat/reduced-motion-browser-report.json'],
    ['tests/combat-offline-browser.mjs', 'audit-combat/offline-browser-report.json']
  ];
  const server = spawn('python3', ['-m', 'http.server', '4178', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  let serverError = null; server.on('error', error => { serverError = error; });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      if (serverError) throw serverError;
      try { if ((await fetch('http://127.0.0.1:4178/combat/')).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!ready) throw new Error('Static server did not become ready.');
    for (const [file, outputFile, env = {}, suffix = ''] of browserSuites) {
      const result = await run(file, { COMBAT_TEST_URL: 'http://127.0.0.1:4178', ...env }, file + (suffix ? '-' + suffix : ''));
      const { transcript, ...metadata } = result;
      let detail;
      try { detail = JSON.parse(await fs.readFile(outputFile, 'utf8')); }
      catch (error) { detail = { failure: 'Missing or invalid report: ' + error.message, checks: [] }; }
      const checks = Array.isArray(detail.checks) ? detail.checks : [];
      report.browserReports.push({
        ...metadata, reportFile: outputFile, reportSha256: sha(JSON.stringify(detail)),
        checks, passed: metadata.passed && checks.length > 0 && checks.every(check => check.pass === true) && !detail.failure && !detail.error && !(detail.errors?.length),
        report: detail
      });
      await save();
    }
  } catch (error) {
    report.failure = error.stack || String(error);
  } finally {
    server.kill('SIGTERM');
    await new Promise(resolve => { if (server.exitCode !== null) resolve(); else { server.once('exit', resolve); setTimeout(resolve, 3000).unref(); } });
  }
}
report.runtimeSourceHashesAfter = await runtimeHashes();
report.runtimeUnchangedDuringTests = JSON.stringify(report.runtimeSourceHashesAfter) === JSON.stringify(report.runtimeSourceHashes);
report.totals = {
  nodeSuites: report.nodeReports.length,
  nodeTests: report.nodeReports.reduce((sum, row) => sum + row.count, 0),
  nodePassed: report.nodeReports.reduce((sum, row) => sum + (row.passed ? row.count : 0), 0),
  browserSuites: report.browserReports.length,
  browserChecks: report.browserReports.reduce((sum, row) => sum + row.checks.length, 0),
  browserPassed: report.browserReports.reduce((sum, row) => sum + (row.passed ? row.checks.length : 0), 0)
};
report.pass = !report.failure && report.runtimeUnchangedDuringTests && report.nodeReports.every(row => row.passed) && report.browserReports.length === 12 && report.browserReports.every(row => row.passed);
report.completedAt = new Date().toISOString();
await save();
console.log('ENCORE_CI_SUMMARY ' + JSON.stringify({ pass: report.pass, sourceCommit: report.sourceCommit, totals: report.totals, report: path.relative(root, reportFile) }));
if (!report.pass) process.exitCode = 1;
