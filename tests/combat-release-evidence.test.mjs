import test from 'node:test';
import assert from 'node:assert/strict';
import { assertReviewedTestCoverage } from '../scripts/combat-release-evidence.mjs';

function fixture() {
  const run = (file, label, digest) => ({ file, label, sourceSha256: digest.repeat(64), sourceSha256After: digest.repeat(64),
    passed: true, sourceUnchanged: true, exitCode: 0, timedOut: false, elapsedSeconds: 1 });
  return {
    schema: 'encore-ci-evidence/v1', gameVersion: '0.7.0', sourceCommit: 'reviewed-commit',
    generatedAt: '2026-10-29T10:00:00Z', runUrl: 'https://example.test/reviewed-run', browserOrigin: 'http://127.0.0.1:4100',
    pass: true, runtimeUnchangedDuringTests: true, runtimeSourceHashes: { 'combat/input.mjs': 'a'.repeat(64) },
    totals: { nodeSuites: 1, nodeTests: 2, nodePassed: 2, browserSuites: 2, browserChecks: 3, browserPassed: 3 },
    nodeReports: [{ ...run('tests/combat-input.test.mjs', 'tests/combat-input.test.mjs', 'b'), count: 2, passedCount: 2,
      testNames: ['cancelled touch cannot attack', 'two Start presses pause once'] }],
    browserReports: [
      { ...run('tests/combat-input-browser.mjs', 'tests/combat-input-browser.mjs', 'c'),
        checks: [{ name: 'resume from pause', pass: true }, { label: 'fresh touch attacks', pass: true }] },
      { ...run('tests/combat-input-browser.mjs', 'tests/combat-input-browser.mjs-storage', 'c'),
        checks: [{ title: 'progress stays unchanged', pass: true }] },
    ],
  };
}

test('reviewed evidence accepts another run of the same sources and cases despite changed run metadata', () => {
  const reviewed = fixture(), current = structuredClone(reviewed);
  Object.assign(current, { sourceCommit: 'later-docs-commit', generatedAt: '2026-10-29T12:00:00Z',
    runUrl: 'https://example.test/fresh-ci-run', browserOrigin: 'http://127.0.0.1:5200' });
  current.nodeReports[0].testNames.reverse();
  current.nodeReports[0].elapsedSeconds = 5;
  current.browserReports[0].checks.reverse();
  current.browserReports[0].checks[0].detail = 'Independent timing and screenshot output.';
  current.browserReports.reverse();
  assert.doesNotThrow(() => assertReviewedTestCoverage(reviewed, current));
});

for (const key of ['nodeReports', 'browserReports']) {
  test(`reviewed evidence rejects older ${key} sources even when runtime and totals match`, () => {
    const reviewed = fixture(), current = structuredClone(reviewed);
    current[key][0].sourceSha256 = current[key][0].sourceSha256After = 'd'.repeat(64);
    assert.deepEqual(reviewed.runtimeSourceHashes, current.runtimeSourceHashes);
    assert.deepEqual(reviewed.totals, current.totals);
    assert.throws(() => assertReviewedTestCoverage(reviewed, current), /sources, suite identities or case names differ/);
  });
}

test('reviewed evidence rejects a replaced Node case with unchanged counts', () => {
  const reviewed = fixture(), current = structuredClone(reviewed);
  current.nodeReports[0].testNames[0] = 'another unrelated check';
  assert.deepEqual(reviewed.totals, current.totals);
  assert.throws(() => assertReviewedTestCoverage(reviewed, current), /Reviewed Node.*case names differ/);
});

test('reviewed evidence rejects a replaced browser case with unchanged counts', () => {
  const reviewed = fixture(), current = structuredClone(reviewed);
  current.browserReports[0].checks[0].name = 'another unrelated journey';
  assert.deepEqual(reviewed.totals, current.totals);
  assert.throws(() => assertReviewedTestCoverage(reviewed, current), /Reviewed Browser.*case names differ/);
});

test('an overall pass cannot conceal a failed browser check in the reviewed evidence', () => {
  const reviewed = fixture(), current = structuredClone(reviewed);
  reviewed.browserReports[0].checks[0].pass = false;
  assert.throws(() => assertReviewedTestCoverage(reviewed, current), /Unsuccessful browser check/);
});

test('reviewed evidence distinguishes two scoped journeys from the same browser test source', () => {
  const reviewed = fixture(), current = structuredClone(reviewed);
  current.browserReports[1].label = 'tests/combat-input-browser.mjs-other-scope';
  assert.throws(() => assertReviewedTestCoverage(reviewed, current), /suite identities or case names differ/);
  current.browserReports[1].label = current.browserReports[0].label;
  assert.throws(() => assertReviewedTestCoverage(reviewed, current), /Duplicate Browser suite identity/);
});

test('reviewed evidence rejects changed test sources during execution and missing case details', () => {
  const reviewed = fixture(), current = structuredClone(reviewed);
  reviewed.nodeReports[0].sourceSha256After = 'f'.repeat(64);
  assert.throws(() => assertReviewedTestCoverage(reviewed, current));
  reviewed.nodeReports[0].sourceSha256After = reviewed.nodeReports[0].sourceSha256;
  reviewed.nodeReports[0].testNames = [];
  assert.throws(() => assertReviewedTestCoverage(reviewed, current), /Missing Node case names/);
});
