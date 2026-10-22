# CainOS

CainOS is a retro C&A mainframe-style interactive web app inspired by The Amazing Digital Circus.

## Digital Circus — Encore

CainOS now includes **Circus Combat — Encore**, a shared combat application and
standalone game adapted from the real CQC engine of `shadow-codec-ops`.

- In CainOS: complete the existing first-use calibration, then launch **Circus
  Combat** from the desktop or Start menu.
- Direct game: open **`/combat/`** on the same static server.
- Independent distribution: run **`npm run build:combat`**, then serve the
  **`dist-combat/`** directory. It includes the game and its original sprite assets.
- Production tracker: **[DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx](docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx)**.
- Architecture, controls, provenance and known remaining work:
  **[Digital Circus — Encore](docs/DIGITAL_CIRCUS_ENCORE.md)**.

The first playable release contains 14 fighters, 140 authored techniques, 12
arenas, seven modes, 74 costume mappings and a searchable archive of 179 existing
CainOS appearances. Combat capabilities are fan-game adaptations.

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

This runs the existing CainOS audits, meaningful combat/session behavioral tests,
syntax checks and both static builds. Browser journey scripts are provided under
`tests/`; see the combat documentation for their runtime requirements and results.
