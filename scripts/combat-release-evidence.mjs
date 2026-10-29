/** Compare reviewed and fresh execution coverage while allowing independent runs. */
import assert from 'node:assert/strict';

const nonempty = value => typeof value === 'string' && value.length > 0;
const order = (left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right));

function signatures(reports, kind) {
  assert.ok(Array.isArray(reports) && reports.length > 0, `Missing ${kind} execution reports.`);
  const identities = new Set();
  return reports.map(report => {
    assert.ok(nonempty(report.file) && nonempty(report.label), `Invalid ${kind} suite identity.`);
    const identity = JSON.stringify([report.file, report.label]);
    assert.ok(!identities.has(identity), `Duplicate ${kind} suite identity: ${identity}`);
    identities.add(identity);
    assert.match(report.sourceSha256 || '', /^[a-f0-9]{64}$/, `Invalid ${kind} test source digest.`);
    assert.equal(report.passed, true, `Unsuccessful ${kind} execution: ${report.label}`);
    assert.equal(report.exitCode, 0); assert.equal(report.timedOut, false);
    assert.equal(report.sourceUnchanged, true);
    assert.equal(report.sourceSha256After, report.sourceSha256);

    let cases;
    if (kind === 'Node') {
      assert.ok(Array.isArray(report.testNames) && report.testNames.length > 0, 'Missing Node case names.');
      assert.ok(report.testNames.every(nonempty), 'Invalid Node case name.');
      assert.equal(report.count, report.testNames.length);
      assert.equal(report.passedCount, report.count);
      cases = [...report.testNames].sort();
    } else {
      assert.ok(Array.isArray(report.checks) && report.checks.length > 0, 'Missing browser checks.');
      cases = report.checks.map(check => {
        const name = check.name || check.label || check.title;
        assert.ok(nonempty(name), 'Invalid browser check name.');
        assert.equal(check.pass, true, `Unsuccessful browser check: ${name}`);
        return [name, check.pass];
      }).sort(order);
    }
    // Preserve repeated case names. Distinct suite labels also preserve multiple
    // browser journeys executed from one file (for example storage recovery).
    return [report.file, report.label, report.sourceSha256, cases];
  }).sort(order);
}

export function assertReviewedTestCoverage(reviewed, current) {
  assert.equal(reviewed.schema, 'encore-ci-evidence/v1');
  assert.equal(current.schema, 'encore-ci-evidence/v1');
  assert.ok(nonempty(reviewed.gameVersion));
  assert.equal(reviewed.gameVersion, current.gameVersion);
  for (const [key, kind] of [['nodeReports', 'Node'], ['browserReports', 'Browser']]) {
    assert.deepEqual(signatures(reviewed[key], kind), signatures(current[key], kind),
      `Reviewed ${kind} sources, suite identities or case names differ from current collection.`);
  }
}
