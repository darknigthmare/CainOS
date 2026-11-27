# Original complete abstractions — 2026-11-24

This collection contains five **original, hypothetical fan-game abstraction designs** for Digital Circus — Encore. These are not official or canonical character forms, and the collection does not establish canonical 1:1 fidelity.

## Collection

Each family has eleven requested full-body states: `selection`, `stance`, `intro`, `attack`, `heavy`, `hit`, `walk`, `jump`, `crouch`, `victory`, and `defeat`. Runtime PNGs live under `assets/encore/abstractions/originalabstracted<name>/`.

| Family | Preserved identity markers |
| --- | --- |
| Pomni | Two bell-tipped jester horns, red-and-blue pinwheel eyes, torn jester colors, four clawed obsidian limbs. |
| Ragatha | Blue four-hole face button, red yarn strands, stitched black limbs, blue bow and lavender cloth scraps. |
| Gangle | Flat black and red ribbon anatomy, coiled supports, separate broken comedy and tragedy porcelain mask plates. |
| Kinger | Chess-king crown and cross, black faceted multipod body, connected mitten forelimbs, purple robe and spotted ermine trim. |
| Zooble | Asymmetric geometric construction, triangular horned head, spring arm and pronged claw, block arm, segmented and zigzag legs, pastel insets. |

## Generation and provenance

All character drawings use the built-in `image_gen__imagegen` tool with `transparent_background: true`. Each state is a separately generated articulated drawing. No runtime asset is a montage, sprite sheet, programmatic redraw, resized duplicate, recoloring, or transformed reuse of an existing pose. Generated PNG bytes are copied unchanged from the native tool output; no pixel extraction, alpha cleanup, or external image generation SDK is used.

Reference seeds are visually inspected before their use. Pose prompts preserve a family's visual identity and request a mostly side-on view facing right, a complete silhouette, and blank transparent margins. Shape and eye placement may still vary between generated poses; this is a hand-reviewed illustration set rather than a rigged model with mathematically fixed proportions.

Each per-state JSON receipt records the exact prompt, reference path when used, native output path, authentic tool output hint, and the key used to retain the complete tool result in session memory. `recovery-batch-jobs.json` records the queued regeneration prompts before execution. The final audit records dimensions, SHA-256, actual alpha bounds, and equality between runtime and native bytes.

## Executor-loss recovery

The initial generation pass was interrupted by loss of the executor filesystem during disk exhaustion on 2026-11-24. Pomni's and Ragatha's `jump.png` survived unchanged and provide visual references for their resumed families. The other 53 requested assets are regenerated in the resumed pass; **they are not byte-identical restorations of the lost drawings**. The three other families receive new seeds using the original identity constraints.

Files prefixed `incident-` are historical recovery records made immediately after that incident. Their availability counts describe that earlier moment, not the current collection. The first Pomni seed recovered from a stored tool result had already been superseded before the incident and is not installed as a runtime asset.

## Animation and fidelity limits

These eleven images per family are distinct **state illustrations**, not complete frame-by-frame walk, jump, attack, or hit animation cycles. Runtime pose switching, timing, scaling, anchors, and effects are separate engine behavior. A complete in-game presentation review is performed by the integrating task; transparent PNG validity alone does not prove animation quality or official-model accuracy.
