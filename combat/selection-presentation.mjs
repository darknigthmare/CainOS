/**
 * Static subset of EN-E1-SELECTION-CONTRACT: choices commit immediately, each
 * side can undo its last change, and only its latest portrait request may finish.
 * This is ephemeral menu state. It never changes simulation, profiles or replays.
 * The authored character entrance/exit gestures remain separate future artwork.
 */
const normalize = choice => {
  if (!choice || typeof choice.fighterId !== 'string' || !choice.fighterId) throw new TypeError('A fighter ID is required.');
  return { fighterId: choice.fighterId, variantId: typeof choice.variantId === 'string' ? choice.variantId : '' };
};
const equal = (a, b) => a.fighterId === b.fighterId && a.variantId === b.variantId;

export class SelectionPresentation {
  #slots = [];
  #sequence = 0;

  constructor(choices) { this.reset(choices); }

  #slot(side) {
    if (side !== 0 && side !== 1) throw new RangeError('Selection side must be 0 or 1.');
    return this.#slots[side];
  }

  #invalidate(slot) {
    slot.request = ++this.#sequence;
    slot.portrait = 'idle';
  }

  reset(choices) {
    if (!Array.isArray(choices) || choices.length !== 2) throw new TypeError('Two selection choices are required.');
    const current = choices.map(normalize);
    this.#slots = current.map(choice => ({ current: choice, previous: null, request: ++this.#sequence, portrait: 'idle' }));
  }

  /** External routes may select an artist directly. Do not retain unrelated undo. */
  reconcile(choices) {
    if (!Array.isArray(choices) || choices.length !== 2) throw new TypeError('Two selection choices are required.');
    const current = choices.map(normalize);
    current.forEach((choice, side) => {
      const slot = this.#slot(side);
      if (equal(slot.current, choice)) return;
      slot.current = choice; slot.previous = null; this.#invalidate(slot);
    });
  }

  choose(side, choice) {
    const slot = this.#slot(side), next = normalize(choice);
    if (equal(slot.current, next)) return false;
    slot.previous = { ...slot.current }; slot.current = next; this.#invalidate(slot);
    return true;
  }

  undo(side) {
    const slot = this.#slot(side);
    if (!slot.previous) return null;
    slot.current = slot.previous; slot.previous = null; this.#invalidate(slot);
    return { ...slot.current };
  }

  beginPortrait(side, choice) {
    const slot = this.#slot(side);
    if (!equal(slot.current, normalize(choice))) return null;
    slot.request = ++this.#sequence; slot.portrait = 'loading';
    return slot.request;
  }

  finishPortrait(side, request, available) {
    const slot = this.#slot(side);
    if (request === null || slot.request !== request || slot.portrait !== 'loading') return false;
    slot.portrait = available ? 'ready' : 'unavailable';
    return true;
  }

  snapshot(side) {
    const slot = this.#slot(side);
    return { current: { ...slot.current }, previous: slot.previous && { ...slot.previous }, portrait: slot.portrait,
      selectionBriefId: `EN-E1-SELECT-${slot.current.fighterId}`, deselectionBriefId: `EN-E1-DESELECT-${slot.current.fighterId}` };
  }
}

export function selectionPortraitStatus(portrait) {
  if (portrait === 'loading') return 'Choix retenu · Préparation du portrait…';
  if (portrait === 'unavailable') return 'Portrait indisponible · Choix conservé';
  return 'Choix retenu';
}
