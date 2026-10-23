# CainOS

CainOS is a retro C&A mainframe-style interactive web app inspired by The Amazing Digital Circus.

## Digital Circus — Encore

CainOS includes **Circus Combat — Encore**, a shared combat application and
standalone game adapted from the real CQC engine of `shadow-codec-ops`.
The playable game version is **0.6.0**, documented on **23 October 2026**.

- In CainOS: complete the existing first-use calibration, then launch **Circus Combat**.
- Direct game: open **`/combat/`** on the same static server.
- Independent distribution: run **`npm run build:combat`**, then serve **`dist-combat/`**.
- Production tracker: **[DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx](docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx)**.
- Controls, architecture, references and remaining work: **[Digital Circus — Encore](docs/DIGITAL_CIRCUS_ENCORE.md)**.

The release contains **14 fighters, 140 authored techniques, 12 arenas, 9 modes,
51 selectable costumes and 179 searchable archive entries**. The remaining
114 archive entries do not automatically receive a combat kit. The combat
techniques and stories are original fan-game adaptations.

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
Results save immediately; the final presentation lasts 2.2 seconds and can be
skipped. **Twelve stage-specific ambient layers** stay behind actors and above the
floor. The system preference or game setting independently enables reduced motion.
Jax keeps its transparent eight-cell 0.5 sheet; only Pomni and Zooble use the
existing shallow cutout rigs. Dedicated authored combat animation remains open.

### Controls, sound, profiles and replays

Both players can remap keyboard keys with alternatives, conflict checks and
AZERTY/QWERTY labels. Standard gamepads and multitouch controls are supported.
Audio comprises **12 original procedural themes and 16 effect motifs**, with
separate volumes. Music is off by default and WebAudio waits for a user gesture.

Version-one profiles retain their format. Replays from **0.1.0 through 0.6.0** are
accepted and retain their original version when exported. A **0.6.0 recording
uses the 0.5.0 simulation rules**: this release changes presentation and content,
with no new balance rules. Older versions keep their original behavior. Tests
retain all 56 frozen legacy CPU traces and verify fourteen 0.5/0.6 parity traces.
Playback adds no profile result. On different origins, use JSON export/import to
transfer the profile; CainOS and the standalone share storage on the same origin.

### Offline installation

On HTTPS or localhost, choose **Réglages → Télécharger le spectacle** and wait for
**45/45 illustrations**. The pack is **54,085,802 bytes**, with offline build
**`0.6.0-8745f15f4c42`** and art version **`4ca4a56c5bace07b`**, recorded in
[offline-manifest.mjs](combat/offline-manifest.mjs). Use the installed shortcut or
`/combat/index.html?standalone=1` for later offline visits.

Updates are explicitly offered in settings. Unchanged illustrations survive a
code-only update; changed art requires preparing the new pack. Failed or timed-out
installation offers a retry. Clearing illustrations preserves the profile and
controls. The worker covers the combat path, not the CainOS desktop or the
standalone root redirect. Static builds require HTTP; opening files directly with
`file://` is unsupported. Native application packages remain separate work.

## Development and build

```bash
npm install
npm run dev
npm run build
npm run build:combat
npm run qa
```

The default build includes CainOS, the combat app and the existing cloud-account
runtime. The separate combat build needs no OS runtime. `npm run qa` runs the
CainOS audits, behavioral tests, syntax checks, manifest generation and both builds.

## Verification and tracker

The 0.6.0 evidence records **260 passing Node tests in 17 suites** and
**154 passing Chromium checks in 18 suites**. All fourteen pre-existing
browser suites were rerun on the new runtime, alongside costume refinements,
scenery, story presentation and complete roster duels. The evidence separates
actual played UI flows from rendering fixtures and deterministic simulations.
See [combat-qa-evidence.json](docs/combat-qa-evidence.json).

The tracker contains **10 sheets, 9 tables, 101 features, 632 production tasks,
85 scenarios and 452 QA rows**. QA includes the 260 Node cases,
154 browser checks and 38 review objectives; overlapping objectives are not
additional independent tests. Current statuses are **447 passed,
1 awaiting verification and 4 not executed**. Canonical comparison and physical
device checks remain visible.

Workbook publication prepares all three outputs and all prior-content backups
before replacement. On a caught publication error, it restores each old file or
its prior absence. Failed restoration retains recovery files and a lock rather
than deleting the backups. Eleven filesystem tests cover fault injection and
rollback. Notes survive by sheet and ID after sorting, including formula notes,
literal `=`, zero and false. Publication is not a simultaneous three-file atomic
read or a guaranteed sudden-crash recovery. See
[COMBAT_WORKBOOK_PUBLICATION.md](docs/COMBAT_WORKBOOK_PUBLICATION.md).

Remaining production includes dedicated combat drawings, full canonical art
comparison, final sound mixing and voice work, competitive balance, networking,
tag/assists, cooperation, episode campaigns, combat cloud sync and native packages.
Physical-phone, two-physical-gamepad, exhaustive keyboard and low-end hardware
checks remain separate from automated browser coverage.
