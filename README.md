# CainOS

CainOS is a retro C&A mainframe-style interactive web app inspired by The Amazing Digital Circus.

## Digital Circus — Encore

CainOS includes **Circus Combat — Encore**, a shared combat application and
standalone game adapted from the real CQC engine of `shadow-codec-ops`.
The playable game version is **0.7.0**, completed in this branch on **24 October 2026**.

- In CainOS: complete the existing first-use calibration, then launch **Circus Combat**.
- Direct game: open **`/combat/`** on the same static server.
- Independent distribution: run **`npm run build:combat`**, then serve **`dist-combat/`**.
- Production tracker: **[DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx](docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx)**.
- Controls, architecture, references and remaining work: **[Digital Circus — Encore](docs/DIGITAL_CIRCUS_ENCORE.md)**.

The release contains **14 fighters, 140 authored techniques, 12 arenas, 9 modes,
51 selectable costumes and 179 searchable archive entries**. The remaining
114 archive entries do not automatically receive a combat kit. The combat
techniques and stories are original fan-game adaptations.

### Stage endings and arena audio in 0.7.0

- **42 theatrical endings**: three per fighter, selected after a real final KO.
  They present the already saved result and can be skipped or disabled.
- **Codex gallery**: preview all endings with the 51 costumes; pause, resume and
  replay without altering a profile, match or saved replay.
- **12 procedural arena ambience layers** with an independent volume and toggle,
  plus distinct trap and KO cues. Music and ambience remain separate.
- **Six distinct contact sounds** for light, heavy, low, throw, special and super
  hits. Blocking, parry and KO have priority over ordinary contact sounds.
- **Keyboard menus**: arrow keys and Home/End move through card groups; Tab,
  Enter and Space retain native controls. Rebuilt selections and dialogs preserve
  focus. Gamepad menus can open the reference details without getting trapped in
  search inputs; text entry uses the keyboard.
- **Control and gallery repairs**: held-key repetition after pause cannot start
  a ghost attack; player-two Ctrl-dash no longer suppresses either player's
  attacks; Space works on the fight toolbar. Hidden gallery time is discarded,
  and changing reduced motion refreshes even a stationary final frame.
- **Replay compatibility through 0.7**: releases 0.5, 0.6 and 0.7 share simulation
  rules 0.5. Earlier replay rules remain supported.
- **Gloink Queen's original appearance** now shares the existing isolated RGBA
  artwork with her refined costume. The opaque rectangle is removed from combat,
  portraits and the gallery; fighter identity and collision dimensions stay intact.
- **Reproducible CI evidence and delivery**: Node/Chromium verification, gallery
  contact sheets, an updated tracker and a standalone ZIP from the verified runtime.

These are original Encore compositions using existing character artwork. They do
not establish canonical 1:1 fidelity, new drawn combat poses, official voices or a
finished professional mix. See [the ending catalogue](docs/COMBAT_FINISHERS_0.7.0.md)
and the versioned CI evidence for the exact scope. Historical 0.6 evidence remains
separate from checks rerun on 0.7.

### Visual corrections in 0.6.0

**Twenty costumes now use five new native-alpha sheets.** Six comparisons to
inspected official GLITCH product images address Maid Jax, Work Gangle, Spudsy
Ragatha, Comedy Gangle, Tragedy Gangle and Anime Gangle. Their records explain the
visible changes and retain a partial-comparison label. Fourteen other replacements
repair technical presentation: seven Shadow bodies, three Horror Pomnis, Hunter
Jax, Rhino Gangle, Gloink Queen Scale and Inert Bubble. Dark bodies remain intact,
neighbouring figures and attached backgrounds are excluded, and Bubble has a
translucent centre. Original atlas files and archive identities are preserved.

There are **33 explicit costume rectangles** across the 51 costumes. The former
Gangle palette filter and the three opaque Shadow preservation overrides are no
longer used by those replaced appearances. Their 0.4 reports remain historical
records. See the [current review](docs/combat-costume-review-0.6.0.json),
[art brief](docs/COMBAT_ART_BRIEF_0.6.0.md) and
[twenty-costume sheet](docs/images/costumes-0.6.0.png).

**Three arena backgrounds have been reconstructed**: the residents' hallway with
doors and face medallions, the Spudsy counter and kitchen, and the Candy Kingdom
court. The hallway comparison uses two clearly attributed third-party copies of
pilot imagery; it still awaits confirmation against a primary source. Spudsy and
Candy Kingdom use inspected official imagery. All three remain adapted to a
horizontal fighting arena. Their floor artwork also follows the new composition; the combat plane and
collisions are unchanged. The other nine static backgrounds remain identical. See the [stage review](docs/combat-stage-review-0.6.0.json) and
[before/after sheet](docs/images/encore-stage-comparison-0.6.0.png).

The shared fidelity registers contain **217 records**: 14 fighters, 140 techniques,
12 arenas and 51 costumes. They separate technical checks, observed reference
traits, original adaptations and remaining discrepancies. **This release does not
claim complete canonical or pixel-exact 1:1 fidelity.**

### Stories and saved programmes

Fourteen original routes retain their four encounters each, with **56 pre-fight
scenes**. Each now also has a three-panel prologue and a three-panel epilogue:
**84 new narrative tableaux**. The reader composes existing stage art and portraits
with authored text. Previous, continue, skip and leave controls work with keyboard
navigation and gamepad-back; mobile and reduced-motion presentation are supported.
Endings can be reread after earning them without granting the reward again.
These are scene compositions, not 84 new raster illustrations or voiced cinematics.
See [stories.mjs](combat/stories.mjs), [story-presentation.mjs](combat/story-presentation.mjs)
and the [story review](docs/combat-story-review-0.6.0.json).

The nine modes are CPU versus, local versus, six-match arcade, four-match boss
rush, ten-wave survival, training, six challenges, individual stories and an
eight-participant tournament. The tournament needs three player victories; the
other CPU encounters are explicitly labelled seeded simulations. All five
multi-match programmes save the start of the current encounter. Reloading keeps
earlier victories, rather than a simulation frame in the middle of a duel.

### Training and presentation retained from 0.5.0

The laboratory provides freeze, single-frame advance, ×1/×0.5/×0.25 speed, attack
phases, twelve grouped inputs per player and a facing-relative dummy recording of
up to **600 frames**. Replay it once or in a loop. The six dummy behaviours, free
resource/finale, automatic healing and hitboxes remain independent. Training
awards no progression and does not replace a saved replay.

Each fighter has five finite procedural presentations, for **70 sequences**.
Results save immediately; ordinary result presentations last 2.2 seconds. The
new eligible KO endings last 3–4 seconds and can also be skipped. **Twelve stage-specific ambient layers** stay behind actors and above the
floor. The system preference or game setting independently enables reduced motion.
Jax keeps its transparent eight-cell 0.5 sheet; only Pomni and Zooble use the
existing shallow cutout rigs. Dedicated authored combat animation remains open.

### Controls, sound, profiles and replays

Both players can remap keyboard keys with alternatives, conflict checks and
AZERTY/QWERTY labels. Standard gamepads and multitouch controls are supported.
Audio includes **12 original procedural themes and 12 arena ambience layers**,
with separate volumes and distinct trap/KO cues. Music is off by default and
WebAudio waits for a user gesture.

Version-one profiles retain their format. Replays from **0.1.0 through 0.7.0** are
accepted and retain their original version when exported. **0.6.0 and 0.7.0 recordings
use the 0.5.0 simulation rules**: this release changes presentation and content,
with no new balance rules. Older versions keep their original behavior. Tests
retain all 56 frozen legacy CPU traces and verify fourteen 0.5/0.6/0.7 parity traces.
Playback adds no profile result. On different origins, use JSON export/import to
transfer the profile; CainOS and the standalone share storage on the same origin.

### Offline installation

On HTTPS or localhost, choose **Réglages → Télécharger le spectacle** and wait for
**44/44 illustrations**. The pack is **52,167,739 bytes**, with art version
**`05a3fc712a39e1d8`**. The exact 0.7 code build identity is generated in
[offline-manifest.mjs](combat/offline-manifest.mjs). Use the installed shortcut or
`/combat/index.html?standalone=1` for later offline visits.

Updates are explicitly offered in settings. Unchanged illustrations survive a
code-only update; changed art requires preparing the new pack. Failed or timed-out
installation offers a retry. Clearing illustrations preserves the profile and
controls. The worker covers the combat path, not the CainOS desktop or the
standalone root redirect. Static builds require HTTP; opening files directly with
`file://` is unsupported. Native application packages remain separate work.

## Guided development and input reliability — 29 October 2026

[AGENTS.md](AGENTS.md) and the [gamedev workflow](docs/GAMEDEV_WORKFLOW.md)
map nine selected cross-engine guides to Encore's existing Canvas/ESM runtime.
The upstream router, guides, references and original notices are pinned in
[the provenance manifest](docs/gamedev/manifest.json). They are development
references for this repository; the game keeps its shared runtime and replay rules.

This pass fixes interrupted input: cancelled touch contacts discard their pending
attack without cancelling another finger, two simultaneous controller Start presses
request one pause, and a controller held across an interruption must return to
neutral before driving combat again. Keyboard controls and the other controller
remain available. Normal short taps are preserved.

`npm run qa:gamedev` verifies the reference snapshot and audits the actual image
files against the sprite catalog, frame regions, native transparency and animation
registrations. The asset audit is technical evidence; canonical comparison,
silhouette review and dedicated combat drawings remain separate production work.

The [initial input validation record](docs/gamedev-validation-2026-10-29.json),
[asset report](docs/combat-asset-audit-gamedev-2026-10-29.json) and
[initial gamedev campaign](docs/combat-qa-evidence-gamedev-2026-10-29.json) describe
this pass. The original 0.7 evidence remains a historical record. The reviewed
workbook identifies the exact evidence used for delivery.

## Profile recovery and distinct confirmations — 29 October 2026

This guided follow-up applies `save-systems` and `audio-design` to the shared game.
The first successful profile save and later saves attempt to keep a complete
backup, after the primary write. A present but unreadable primary can recover
from that valid copy without rewriting storage during load. A persistent notice
on Home and Settings offers export or explicit repair; it explains that the copy
may be older. A deleted primary stays deleted, and corrupted cross-tab data cannot
erase an already valid in-memory profile or replace it with an older backup.
A separate notice identifies a retained live session; reward refresh also keeps
its newer progress. Rejected storage writes retain export
access and never claim a successful repair.

There are now **26 original sound motifs**. Escaping a throw has a dedicated cue,
and accepted settings/import/recovery actions and resuming play use a confirmation
cue distinct from selection. Both retain the existing mute, pause, voice limits
and cleanup behavior. Physical-device mixing and dedicated voices remain open.
Profile format v1 and replay rules are unchanged.

## Development and build

```bash
python3 -m pip install -r scripts/requirements-gamedev.txt
npm ci
npm run dev
npm run build
npm run build:combat
npm run qa
```

The default build includes CainOS, the combat app and the existing cloud-account
runtime. The separate combat build needs no OS runtime. `npm run qa` runs the
CainOS audits, behavioral tests, syntax checks, manifest generation and both builds.
It also runs the selected-guide and asset audits. These development checks use
Python 3.12 and Pillow as pinned in `scripts/requirements-gamedev.txt`; Python
and Pillow are not part of the browser game.

## Verification and tracker

The [current gamedev campaign](docs/combat-qa-evidence-gamedev-followup-2026-10-29.json)
records the tested commit, actual Node/Chromium results and runtime hashes. The tracker is authored
and checked in the primary spreadsheet runtime. CI packages the standalone only
when that reviewed tracker matches the current game and test hashes; it never
rewrites the workbook.

### Current audio and profile campaign — 29 October 2026

The complete [GitHub Actions campaign](https://github.com/darknigthmare/CainOS/actions/runs/40898388692)
passed **356 Node tests in 26 suites** and **259 Chromium checks in 15 suites**
on source commit `d1160465a6c980733df20a207b22a4c7a49e1240`.
The runtime and test hashes match the reviewed local checkout. This single complete
campaign supplies every current case; local and remote results are not combined.

The [targeted validation](docs/gamedev-followup-validation-2026-10-29.json)
records 40 audio unit cases, 27 audio browser checks, 63 profile/progression unit
cases and 19 recovery browser checks. These groups are included in the 356/259
totals. They cover distinct finite sound motifs, unsuccessful writes, explicit
deletion, startup recovery, preserved live progress, export and both game entries.

An independent local attempt encountered three timeouts (CainOS iframe, gallery
navigation and the progression process) and was stopped after the complete Actions
run succeeded on identical source and test hashes. Its partial report and failures
are preserved in `retryHistory`, outside the final totals. Their exact cause
is not established. An earlier intermediate-code attempt was also stopped
after reproducing the stale-backup rollback, which is fixed in the tested commit.

The current tracker contains **105 features, 689 production tasks, 85 scenarios
and 2,206 QA rows**. It retains all 1,587 earlier QA rows and adds the 615 current
campaign cases plus four overlapping targeted checks. Its statuses remain explicit:
2,202 passed, three not executed and one awaiting verification; the QA row count
is not an independent-test total. Production has 394 implemented, 281 partial
and 14 planned tasks. The audio feature remains partial while physical mixing
and voice work are still open.

All **39 formulas** were recalculated and checked without errors. Export and
reimport preserve **10 sheets, 9 native tables**, existing styles, row identities
and notes. Longer entries receive documented row-height adjustments.
See the [follow-up workbook review](docs/COMBAT_GAMEDEV_FOLLOWUP_2026-10-29.md)
and [workbook verification](docs/combat-workbook-verification.json) for the
reviewed tracking data, preserved history and remaining manual work.

### Historical gamedev input campaign — 29 October 2026

The initial gamedev campaign passed **340 Node tests in 25 suites** and
**240 Chromium checks in 14 suites**, on source commit
`6a80d1e5b25e74aa1b6012ff6b37e83cf25dd492`. Its 11 input unit cases and six browser input
checks are included in those totals. Runtime and test source hashes stayed unchanged.
The evidence retains the initial missing-build failure and the successful 15-check
progression rerun in `retryHistory`; each final case is counted once.

The technical asset audit passed for **44 PNGs, 235 unique source regions,
56 animation cells and 77 native-alpha references**, with zero violations.
The selected-guide audit verified **35 original files and 40 local links**.

The tracker for that input campaign contained **10 sheets, 9 native tables,
105 features, 686 production tasks, 85 scenarios and 1,587 QA rows**.
Those rows preserve 1,003 historical/review entries, record the
580 cases from that full campaign and add 4 targeted checks. The targeted checks
partly overlap the full campaign; QA row counts are not independent test totals.
All **39 formulas** were recalculated and checked with zero formula errors.
Native tables, existing row identities, notes and layout were preserved through export
and reimport. See the [workbook verification](docs/combat-workbook-verification.json).

### Historical 0.7 campaign

The original [0.7 campaign](docs/combat-qa-evidence-0.7.0.json) passed
**313 Node tests in 22 suites** and **238 Chromium
checks in 14 suites**, on source commit
`1073ce21525c771f598b56d7452eaeceb2ed9178`. Game and test files stayed unchanged
during execution. Browser coverage includes 100 ending/gallery checks, 22 audio
checks, 28 keyboard/accessibility checks, four input regressions and fourteen
complete roster duels. These are parts of the 238-check total, not extra tests.

The tracker accompanying that campaign contained **10 sheets, 9 native tables,
102 features, 683 production tasks, 85 scenarios and 1,003 QA rows**. Its 551
automated cases were separate from 452 retained historical/review rows. The
combined QA statuses were
999 passed, zero failed, three not executed and one awaiting verification.
All **39 formulas** were recalculated and checked. A separate sorted workbook
fixture preserved ten notes across eight sheets, including two relative formulas,
zero, false, literal `=` text and a custom row height; fixture notes are not shipped.

### Historical 0.6 campaign

The following totals describe the earlier 0.6 campaign.

The 0.6.0 evidence records **260 passing Node tests in 17 suites** and
**154 passing Chromium checks in 18 suites**. All fourteen pre-existing
browser suites were rerun on the new runtime, alongside costume refinements,
scenery, story presentation and complete roster duels. The evidence separates
actual played UI flows from rendering fixtures and deterministic simulations.
See [combat-qa-evidence.json](docs/combat-qa-evidence.json).

After PR review, Work Gangle’s identity description was corrected to match its
smiling, toothed mask. The final text correction was checked with **26 existing
Node cases**, **5 focused wardrobe checks** and **11 repeated offline checks**,
plus both rebuilt distributions. These are recorded separately from the full
260/154 baseline campaign; the entire campaign was not rerun for this text-only
change. The five image sheets and all other costume identity records are unchanged.

The historical 0.6 tracker contained **10 sheets, 9 tables, 101 features, 632 production tasks,
85 scenarios and 452 QA rows**. Its QA section included the 260 Node cases,
154 browser checks and 38 review objectives; overlapping objectives are not
additional independent tests. Its historical statuses were **447 passed,
1 awaiting verification and 4 not executed**. Canonical comparison and physical
device checks remain visible.

Workbook publication prepares all four current outputs and all prior-content backups
before replacement. On a caught publication error, it restores each old file or
its prior absence. Failed restoration retains recovery files and a lock rather
than deleting the backups. Eleven filesystem tests cover fault injection and
rollback. Notes survive by sheet and ID after sorting, including formula notes,
literal `=`, zero and false. Publication is not a simultaneous multi-file atomic
read or a guaranteed sudden-crash recovery. See
[COMBAT_WORKBOOK_PUBLICATION.md](docs/COMBAT_WORKBOOK_PUBLICATION.md).

Remaining production includes dedicated combat drawings, full canonical art
comparison, final sound mixing and voice work, competitive balance, networking,
tag/assists, cooperation, episode campaigns, combat cloud sync and native packages.
Physical-phone, two-physical-gamepad, screen-reader and low-end hardware
checks remain separate from the automated keyboard and virtual-gamepad coverage.
