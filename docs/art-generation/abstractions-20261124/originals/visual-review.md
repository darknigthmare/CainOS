# Visual review of the five original abstraction families

Reviewed 2026-11-24 after recovery, against the runtime Canvas action boards in ../canvas/characters/actions-originalabstracted{name}.jpg. This review supplements the native PNG/alpha/hash audit; it does not establish canonical fidelity.

Each action board presents nine different combat states. All forty-five board poses were visually inspected. The five stance seeds and five selection portraits were also inspected during creation. The resulting fifty-five drawings keep complete silhouettes and readable hands, feet and identity fragments. No material clipping, disruptive halo, involuntary body deformation or obvious duplicated pose was observed at the rendered board scale. Changes of articulation, expression and body compression distinguish each state. Minor variation in painted facets and small embedded eyes is inherent in these separately generated drawings.

| Family | Identity and continuity observations |
| --- | --- |
| Pomni | Obsidian clawed body, two bell-tipped jester points, red/blue pinwheel eyes and red/blue cloth fragments remain readable across standing, airborne and compressed poses. |
| Ragatha | Faceted heavy limbs, blue face button, red yarn, stitched seams and blue bow remain coherent; the body genuinely folds for crouch and defeat. |
| Gangle | The coiled red/black ribbon body and two pale broken mask plates persist; lash, raised and collapsed states differ visibly. |
| Kinger | Chess crown/cross, black angular body and purple robe with spotted trim remain consistent through all nine action states. |
| Zooble | Triangular head, asymmetrical horns, block arm, spring arm and mismatched legs remain identifiable with distinct gestures and a convincing collapsed state. |

All five families are original hypothetical complete abstractions for Encore. These are individual state illustrations, not complete animation cycles or a claim of official series designs. No additional regeneration is requested from this visual review.

## Follow-up: common-scale runtime boards

The five updated boards were inspected again after the visual width cap was introduced. They now include the stance reference plus nine action states. Crouch and defeat appear lower and avoid the previous expansion of horizontal silhouettes; all extremities remain within their cells. A residual difference was reported to the integration agents: original Pomni in intro, hit, victory and heavy has a smaller-looking head and claws than its stance/walk/jump, and Ragatha's heavy has a smaller-looking body. This appears related to fitting a taller raised-arm posture to a shared total height. A per-pose runtime scale factor could improve anatomical continuity without changing any native PNG. The review does not claim exact anatomical scale across these separately generated state illustrations.

## Final targeted pose calibration

The two corrected production-Canvas preview boards were opened and inspected after the five uniform height factors below were applied before the existing width ceiling. Both previews keep a common scale per family and include the stance reference. Pomni's head, pinwheel eye and claws now have a consistent perceived size across stance and the four previously undersized poses. Ragatha's heavy now retains the button size and body mass of the stance. Raised postures correctly occupy more height than the low quadrupedal stance. All extremities remain whole and inside their cells, with no visible stretching, clipping or displaced floor anchor. The five factors are accepted and frozen; no image regeneration or source-image edit is requested.

| Family | Pose | Uniform height factor | Estimated landmark length before / after | Stance landmark |
| --- | --- | ---: | ---: | ---: |
| Pomni | intro | 1.45 | 36.87 / 53.46 px | 52.87 px |
| Pomni | hit | 1.40 | 37.45 / 52.42 px | 52.87 px |
| Pomni | victory | 1.55 | 33.74 / 52.30 px | 52.87 px |
| Pomni | heavy | 1.40 | 37.69 / 52.77 px | 52.87 px |
| Ragatha | heavy | 1.35 | 43.60 / 58.86 px | 58.84 px |

The native landmark regions, masks, component dimensions, source SHA-256 hashes and calculations are recorded in `pose-height-measurements.json`, reproducible with `audit_pose_height.py`. Pomni uses the horizontal extent of the larger red/blue pinwheel pupil; Ragatha uses the long axis of the blue face button. These are approximate visual-size guides: projection and separately painted anatomical details still vary. Actual final draw matrices and anchors are verified independently by the runtime review. Native PNG bytes, combat bodies and other family poses remain unchanged by this calibration.

Reviewed previews: `/workspace/scratch/e51b531817b1/pose-height-preview/originalabstractedpomni/actions-originalabstractedpomni.jpg` and `/workspace/scratch/e51b531817b1/pose-height-preview/originalabstractedragatha/actions-originalabstractedragatha.jpg`. The final runtime action boards belong in the shared `../canvas/characters/` review set.

