# CainOS development instructions

## Start from the existing game

Read `README.md`, `package.json` and the relevant files before editing. CainOS and
Digital Circus — Encore are an existing JavaScript ESM / Canvas application. The
combat implementation is shared by the CainOS entry and the standalone build;
keep one runtime and use its existing APIs.

The inspected baseline is CainOS commit
`146a68cc87ea088a4dbcf76694115118fc9ed775`: Encore 0.7.0, fixed simulation at
60 Hz and current replay rules 0.5.0. Read the live constants in
`combat/session.mjs` and `combat/engine.mjs`; preserve old recordings and profile
compatibility. A presentation or input fix does not automatically need new
simulation rules.

## Use the selected gamedev guides

The versioned reference snapshot lives in `docs/gamedev/upstream/`.
It contains the upstream router, nine cross-engine guides, their references and
the original license notices. These are repository development references.

At the beginning of a new kind of task:

1. Read `docs/gamedev/upstream/router/SKILL.md` and its
   `references/custom-engines.md` if this engine contract is new to you.
2. Read the applicable guide(s) from the table below. Open a guide's deeper
   references only when the current change needs them.
3. Map the concepts to the existing files and acceptance criteria in
   `docs/GAMEDEV_WORKFLOW.md`. Upstream Godot/Unity/Unreal code is illustrative;
   bind the concept to verified CainOS APIs.
4. Implement and verify a complete, focused change, then record actual evidence.

| Task | Guide under `docs/gamedev/upstream/skills/disciplines/` |
| --- | --- |
| Keyboard, touch, gamepads, remapping, interruption recovery | `input-systems/SKILL.md` |
| Fixed-step timing, collision, simulation/render separation | `physics-tuning/SKILL.md` |
| Impact feedback, camera shake, presentation timing | `game-feel/SKILL.md` |
| Menus, focus, HUD, responsive and accessible interaction | `game-ui-ux/SKILL.md` |
| Sprites, costumes, animation, scenery, transparency | `create-game-assets/SKILL.md` |
| Measured frame cost, memory and asset budgets | `performance-optimization/SKILL.md` |
| Effects, music, ambience, mix and sound lifecycle | `audio-design/SKILL.md` |
| Opponent decisions and difficulty | `game-ai/SKILL.md` |
| Profiles, saved programmes, imports and replay compatibility | `save-systems/SKILL.md` |

The collection has no fighting-game genre guide. Retain this project's explicit
startup/active/recovery phases, hit rules, cancel limits, replay semantics and
per-fighter definitions when applying the generic guides. Scope new input
buffering or hit-stop rules explicitly and verify them against replay behavior.

## Production and evidence

- Use existing tests for the affected behavior. Add a regression test when a
  reproduced defect or a new behavior needs coverage. Run the scoped browser
  path as well when changing UI, focus, touch, gamepad or visual presentation.
- Validate both entry paths when changing launch, lifecycle, storage or asset
  loading. Use `npm run qa` for repository checks and both builds;
  `node scripts/run-combat-ci.mjs` collects the configured browser evidence.
  Requirements and smaller commands are in `docs/GAMEDEV_WORKFLOW.md`.
- Keep generated files, workbook evidence and packaged runtime coherent.
  `scripts/build-combat-offline.mjs` owns the offline manifest; use its generator.
- Keep the current workbook's row IDs, ordering and user notes. Update completed
  tasks from executed checks and reviewed artifacts. Preserve unexecuted
  physical-device and canonical-comparison work as open work.
- Preserve character identity, proportions, costume and scale against named
  references. An image file, automated test or transformed pose alone does not
  establish canonical 1:1 fidelity. Label original fan-game adaptations clearly.
- Record a measured result for performance claims and a visible in-game review
  for art claims. Test counts must distinguish current executions from history.

## Maintain the reference snapshot

`docs/gamedev/manifest.json` pins the upstream revision and every original blob.
Run `node scripts/audit-gamedev-guides.mjs` after changing this integration.
Keep upstream files unchanged; write CainOS-specific decisions in
`docs/GAMEDEV_WORKFLOW.md`. To update the snapshot, inspect the upstream diff,
replace the selected files and manifest together, retain LICENSE/NOTICE, and
recheck affected instructions. Do not update dependencies or engines merely
because an upstream example uses a newer release.
