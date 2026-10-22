# CainOS

CainOS is a retro C&A mainframe-style interactive web app inspired by The Amazing Digital Circus.

## Digital Circus — Encore

CainOS now includes **Circus Combat — Encore**, a shared combat application and
standalone game adapted from the real CQC engine of `shadow-codec-ops`.
The playable game version is **0.3.0**.

- In CainOS: complete the existing first-use calibration, then launch **Circus
  Combat** from the desktop or Start menu.
- Direct game: open **`/combat/`** on the same static server.
- Independent distribution: run **`npm run build:combat`**, then serve the
  **`dist-combat/`** directory. It includes the game and its original sprite assets.
- Production tracker: **[DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx](docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx)**.
- Architecture, controls, provenance and known remaining work:
  **[Digital Circus — Encore](docs/DIGITAL_CIRCUS_ENCORE.md)**.

The current release contains **14 fighters, 140 authored techniques, 12 arenas,
9 modes, 51 explicitly reviewed costumes and 179 searchable archive entries**.
Fighters, costumes and the 114 remaining archive records have separate identities
in [combat/data.mjs](combat/data.mjs). Combat capabilities and stories are original
fan-game adaptations.

### Visual fidelity and traceable references

The 0.3.0 pass preserves abstracted Kaufmo’s dark body when removing atlas
backgrounds, and redraws the big top, cellar and Void from the official GLITCH
stills actually reviewed. Named projectiles and traps receive distinct readable
shapes. The selector previews each arena, including the first chapter’s actual
stage in story mode.

[combat/fidelity.mjs](combat/fidelity.mjs) is the shared source register for the
codex and the workbook: **14 fighter, 140 technique and 12 arena records**. Each
entry separates observed visual traits, original combat adaptations and the
remaining review scope. Sources can be opened from optional disclosures in the
codex and arena selector. Existing illustrations, dedicated fight poses, the
residents’ corridor and all 51 costumes still need further visual comparison;
this pass does not certify a complete 1:1 reproduction of the series.

### Programmes and saved progress

The nine modes are CPU versus, local versus, six-match arcade, four-match boss
rush, ten-wave survival, training, six challenges, individual stories and an
eight-participant tournament. [combat/stories.mjs](combat/stories.mjs) provides
**14 routes and 56 chapters**, with introductions, pre-fight dialogue and endings.
The tournament requires **three player victories**; its other CPU matches are
seeded simulations labelled in the seven-match bracket.

All five multi-match programmes save the start of the current encounter, including
rules, seed, costume and starting health. Reloading preserves earlier victories;
it does not restore a simulation frame in the middle of a duel. Story/arcade/boss
allow retrying the lost encounter, while survival/tournament restart an attempt.
See [combat/progression.mjs](combat/progression.mjs).

### Controls, sound and compatibility

Both players can remap their physical keyboard keys, with optional alternatives,
conflict checks and AZERTY/QWERTY labels. Standard gamepads support combat and menu
navigation; touch controls support multiple simultaneous holds. The sound module
provides **12 original procedural arena themes and 16 effect motifs**, with
independent volumes. Music is off by default and WebAudio waits for a user gesture.
Sources: [bindings.mjs](combat/bindings.mjs), [input.mjs](combat/input.mjs) and
[audio.mjs](combat/audio.mjs).

Existing version-one profiles migrate with safe defaults. Replays from **0.1.0,
0.2.0 and 0.3.0** remain accepted, and playback adds no results to the profile.
Older recordings keep their original fighter rules and version when exported;
0.3.0 gives Pomni and abstracted Kaufmo continuous physical retreats. JSON export
includes custom controls and the programme checkpoint. CainOS and the standalone
share profiles on the same origin; another origin requires export/import.
See [combat/session.mjs](combat/session.mjs).

### Install and play offline

On HTTPS or localhost, open **Réglages → Télécharger le spectacle** and wait for
all **42 sprite sheets** to be available. The illustration pack is
**47,345,031 bytes**, as recorded in
[combat/offline-manifest.mjs](combat/offline-manifest.mjs). Installation is offered
when supported by the browser. Use the installed shortcut or the direct
`/combat/index.html?standalone=1` address for an offline visit.

Updates are offered explicitly in settings. A code-only update preserves the
unchanged illustration pack; changed artwork requires preparing the new pack.
A failed or timed-out first offline installation displays an error and a retry
action. Initialization waits at most twenty seconds and keeps an existing active
worker usable while an update installs. Reading local storage discards only an
incompatible checkpoint, preserving the rest of the profile; explicit imports
remain strict.

Clearing illustrations leaves the profile and custom controls intact. The worker
controls only the combat path: the rest of CainOS and the standalone root redirect
are outside its offline cache. See [offline.mjs](combat/offline.mjs),
[sw.js](combat/sw.js) and [manifest.webmanifest](combat/manifest.webmanifest).

The tracker separates delivered features from remaining production work: dedicated
combat animation, final art and sound mixing, competitive balancing, networking,
tag/assists, cooperation, episode campaigns, combat cloud sync and native packages.
Real-device, accessibility and full costume art reviews remain distinct from the
automated browser checks.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The default build now includes the combat application, `cloud-account.js` and the
favicon referenced by the OS. The separate combat build needs no OS runtime.

## Verification

```bash
npm run qa
```

This runs the existing CainOS audits, combat behavioral tests, syntax checks,
offline-manifest generation and both static builds. The recorded Node result for
0.3.0 is **166 passing tests** across nine suites: engine, session, catalog,
bindings, progression, audio, offline initialization, fidelity and rendering.
The new suites verify the source register, unchanged legacy combat rules,
continuous retreats, conservative matte removal and object presentation.

The story/tournament browser suite has **8 passing checks and 9 played duels**.
The controls/audio/offline suite has **11 passing checks**, including a cold
offline reload and preservation of the art pack across a code update. The
progression/replay/standalone suite has **10 passing checks**, and the
UI/integration suite has **11 passing checks**. The profile-recovery suite adds
**5 passing checks**, including changes from another tab and a challenge completed
with an incompatible stored checkpoint. Offline installation recovery adds
**3 passing checks** after a real HTTP 503, followed by a successful retry and
offline reload. The fidelity UI/replay suite adds **9 passing checks**; the rendering suite adds
**7 passing checks**, including atlas pixels and all projectile/trap definitions.
The eight final reports total **64 passing browser checks**, with no recorded
JavaScript errors. These checks do not certify full canonical 1:1 visual fidelity.
See the [combat documentation](docs/DIGITAL_CIRCUS_ENCORE.md) and
[QA evidence](docs/combat-qa-evidence.json) for exact scope, requirements and limits.
