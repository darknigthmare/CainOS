# CainOS Lore Audit - The Amazing Digital Circus

Date: 2026-06-28

## Sources checked

- Local CainOS transcripts in `episodes.js` for episodes 1-9.
- Fandom pages:
  - https://tadc.fandom.com/wiki/Home
  - https://tadc.fandom.com/wiki/Episode_Guide
  - https://tadc.fandom.com/wiki/Circus_Members
  - https://tadc.fandom.com/wiki/Abstraction
  - https://tadc.fandom.com/wiki/Caine
  - https://tadc.fandom.com/wiki/Pomni
  - https://tadc.fandom.com/wiki/Ribbit
  - https://tadc.fandom.com/wiki/Remember

## Current status

- Episodes 1-9 now use speaker-separated transcript data instead of generic system narration.
- Sub-episodes exist for every imported full transcript and are gated sequentially.
- DOS scene tooltips are spoiler-gated through `hasReachedLoreGate`.
- The DOS scene now keeps a visible recent cast and renders character-like DOS icons instead of a single generic point.

## Lore alignment that is currently good

- The project treats the cast as digital simulations/avatars based on real human brain scans, which matches the final reveal.
- Caine is represented as the ringmaster AI whose adventures are both entertainment and a way to keep minds active.
- Abstraction is handled as psychological collapse rather than a normal enemy state.
- Queenie, Ribbit, Kaufmo, Scratch, Wormo, Bizco, Rattie, Spike, and other former members should remain in the lore as abstracted or former Circus Members, not ordinary NPCs.
- Episode 8 correctly keeps Kinger/Queenie/Caine as deep memory/core lore.
- Episode 9 correctly unlocks Abigail/Abby late, after the final transcript has exposed that identity.

## Issues to fix next

1. Episode 6 title should be reviewed.
   Fandom's episode navigation lists Episode 6 as `They All Get Guns`, while CainOS currently labels it `Team Adventure Awards`. If the local transcript is the guns/baseball/awards episode, the title should be normalized to the canonical episode title while keeping the transcript text intact.

2. Episode 5 title should stay close to canon.
   CainOS currently uses `Episode 5: Suggestion Box`. The Fandom navigation uses `Untitled`; the app can keep `Suggestion Box` as a content subtitle, but the visible title should probably become `Episode 5: Untitled` or `Episode 5: Untitled - Suggestion Box`.

3. Episode 9 identity lore needs careful wording.
   CainOS still has an older `Sarah` profile from Episode 0. Episode 9 now adds `Abigail / Abby`. Keep `Sarah` as CainOS prequel/speculative local lore only if Episode 0 is intentionally non-canon; otherwise migrate the final identity text to Abigail.

4. Abstracted characters should not be presented as active cast after their abstraction point.
   For Kaufmo, Queenie, Ribbit, Scratch, Wormo, Bizco, Rattie, Spike, the pink cyclops, yellow clown, oyster, and green bulb-like member, UI entries should unlock as archive/abstracted profiles, not as current participants.

5. Mini-games should mirror transcript events more tightly.
   The current generic micro-games work for pacing, but each sub-episode should eventually get an event-specific variant: vote/skip for Episode 5, admin-pass/trust for Episode 7, memory/code stabilization for Episode 8, and brain-scan/rebuild/dream traversal for Episode 9.

## Recommended progression gates

- Pilot: unlock Pomni, Caine, Bubble, Ragatha, Jax, Gangle, Zooble, Kinger, Kaufmo, Gloinks.
- Episode 2: unlock Candy Canyon NPC truth and Gummigoo's NPC nature.
- Episode 3: unlock Mildenhall, Angel, darkness calming abstraction, Queenie hints.
- Episode 4: unlock Gangle mask/work-pressure lore.
- Episode 5: unlock suggestion box, Jax/Pomni bonding, opposite-personality variants.
- Episode 6: unlock guns/softball/award-event material after canonical title review.
- Episode 7: unlock Abel as adventure deception, C&A false hope, Sun/Shrimp/Liar/Truth-Teller NPCs.
- Episode 8: unlock Kinger as Caine-linked programmer, Queenie memory, Caine rage form, accidental deletion.
- Episode 9: unlock brain scans, Ribbit/Jax abstraction, Abigail/Abby, final free-will status.
