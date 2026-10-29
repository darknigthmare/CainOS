/** The browser coverage required by Encore's collector and workbook publisher. */
export const BROWSER_SUITES = Object.freeze([
  ['tests/combat-browser.mjs', 'audit-combat/browser-report.json'],
  ['tests/combat-finishers-browser.mjs', 'audit-combat/finishers-0.7.0/browser-report.json'],
  ['tests/combat-audio-ambiences-browser.mjs', 'audit-combat/audio-ambiences-0.7.0/browser-report.json'],
  ['tests/combat-training-browser.mjs', 'audit-combat/training-browser-report.json'],
  ['tests/combat-profile-recovery-browser.mjs', 'audit-combat/profile-recovery-browser-report.json'],
  ['tests/combat-profile-backup-browser.mjs', 'audit-combat/profile-backup-browser-report.json'],
  ['tests/combat-encore-browser.mjs', 'audit-combat/encore-browser-report.json'],
  ['tests/combat-progression-browser.mjs', 'audit-combat/progression-browser-report.json'],
  ['tests/combat-progression-browser.mjs', 'audit-combat/storage-browser-report.json', { COMBAT_TEST_SCOPE: 'storage' }, 'storage'],
  ['tests/combat-story-presentation-browser.mjs', 'audit-combat/story-presentation-browser-report.json'],
  ['tests/combat-roster-browser.mjs', 'audit-combat/roster-browser-report.json'],
  ['tests/combat-reduced-motion-browser.mjs', 'audit-combat/reduced-motion-browser-report.json'],
  ['tests/combat-offline-browser.mjs', 'audit-combat/offline-browser-report.json'],
  ['tests/combat-accessibility-browser.mjs', 'audit-combat/accessibility-browser-report.json'],
  ['tests/combat-input-browser.mjs', 'audit-combat/input-browser-report.json'],
].map(row => Object.freeze(row)));

export const browserSuiteLabel = ([file, , , suffix = '']) => file + (suffix ? '-' + suffix : '');
