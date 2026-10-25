/**
 * Reproducible pull-request verification. Every reported case comes from a
 * completed process on the checked-out runtime; historical evidence stays separate.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { GAME_VERSION } from '../combat/session.mjs';
import { BROWSER_SUITES, browserSuiteLabel } from './combat-ci-suites.mjs';

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
  expectedBrowserSuites: BROWSER_SUITES.map(browserSuiteLabel),
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
  const sourceSha256 = sha(await fs.readFile(file));
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
  const sourceSha256After = sha(await fs.readFile(file)), sourceUnchanged = sourceSha256After === sourceSha256;
  return { file, label, exitCode, passed: exitCode === 0 && !timedOut && sourceUnchanged, timedOut, elapsedSeconds: (Date.now() - started) / 1000, sourceSha256, sourceSha256After, sourceUnchanged, log: path.relative(root, logFile), transcript };
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
  const browserSuites = BROWSER_SUITES;
  // Let the OS assign an unused port. Only our child can announce the bound
  // listener; another checkout already serving 4178 cannot satisfy readiness.
  const serverCode = [
    'from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler',
    'server = ThreadingHTTPServer(("127.0.0.1", 0), SimpleHTTPRequestHandler)',
    'print("ENCORE_PORT " + str(server.server_address[1]), flush=True)',
    'server.serve_forever()',
  ].join('\n');
  const server = spawn('python3', ['-u', '-c', serverCode], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  let serverError = null, serverStderr = '';
  server.on('error', error => { serverError = error; });
  server.stderr.on('data', chunk => { serverStderr=(serverStderr+chunk).slice(-4000); });
  try {
    const origin = await new Promise((resolve, reject) => {
      let stdout='',finished=false;
      const timer=setTimeout(()=>finish(new Error('Owned static server startup timed out. '+serverStderr)),10000);
      const finish=(error,value)=>{
        if(finished)return;finished=true;clearTimeout(timer);
        server.stdout.off('data',onData);server.off('error',onError);server.off('exit',onExit);
        if(error)reject(error);else resolve(value);
      };
      const onData=chunk=>{
        stdout+=chunk;
        const line=stdout.match(/^ENCORE_PORT (\d+)\r?\n/);
        if(line){const port=Number(line[1]);if(port>0&&port<=65535)finish(null,'http://127.0.0.1:'+port);else finish(new Error('Invalid server port'));}
        else if(stdout.length>1000||stdout.includes('\n'))finish(new Error('Unexpected server startup output'));
      };
      const onError=error=>finish(error);
      const onExit=(code,signal)=>finish(new Error(`Owned static server exited before readiness (${code??signal}). ${serverStderr}`));
      server.stdout.on('data',onData);server.once('error',onError);server.once('exit',onExit);
      if(serverError)finish(serverError);
      else if(server.exitCode!==null||server.signalCode!==null)onExit(server.exitCode,server.signalCode);
    });
    const served = await fetch(origin+'/combat/session.mjs');
    if(!served.ok||sha(Buffer.from(await served.arrayBuffer()))!==report.runtimeSourceHashes['combat/session.mjs'])throw new Error('Owned server did not serve the tested checkout.');
    report.browserOrigin=origin;report.ownedStaticServer=true;
    for (const [file, outputFile, env = {}, suffix = ''] of browserSuites) {
      if(serverError||server.exitCode!==null||server.signalCode!==null)throw serverError||new Error('Owned static server stopped during browser checks.');
      // A suite that exits without writing its report must not inherit an old pass.
      await fs.rm(outputFile, { force: true });
      const result = await run(file, { COMBAT_TEST_URL: origin, ...env }, file + (suffix ? '-' + suffix : ''));
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
    await new Promise(resolve => { if (server.exitCode !== null || server.signalCode !== null || !server.pid) resolve(); else { server.once('exit', resolve); setTimeout(resolve, 3000).unref(); } });
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
report.pass = !report.failure && report.runtimeUnchangedDuringTests && report.nodeReports.every(row => row.passed) && report.browserReports.length === BROWSER_SUITES.length && report.browserReports.every(row => row.passed);
report.completedAt = new Date().toISOString();
await save();
console.log('ENCORE_CI_SUMMARY ' + JSON.stringify({ pass: report.pass, sourceCommit: report.sourceCommit, totals: report.totals, report: path.relative(root, reportFile) }));
if (!report.pass) process.exitCode = 1;
