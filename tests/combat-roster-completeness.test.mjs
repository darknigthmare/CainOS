import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FIGHTERS, STAGES, DEDICATED_STAGES, ALL_STAGES, getDedicatedStage, getStage,
} from '../combat/data.mjs';
import { FINISHER_CATALOG } from '../combat/finisher-catalog.mjs';
import { FRIENDSHIP_CATALOG } from '../combat/friendship-catalog.mjs';
import { selectMatchFinisher, selectMatchFriendship, sampleFinisherPresentation } from '../combat/finishers.mjs';
import { STORY_ROUTES, STORY_RIVALS, STORY_REFERENCES, getStoryRival } from '../combat/stories.mjs';

const ids = new Set(FIGHTERS.map(fighter => fighter.id));
const sharedStageIds = new Set(STAGES.map(stage => stage.id));
function stateFor(fighterId, winner = 0) {
  const fighters = [{ f: { id: 'jax' }, life: 0 }, { f: { id: 'jax' }, life: 0 }];
  fighters[winner] = { f: { id: fighterId }, life: 7500 };
  return { phase: 'matchOver', frame: 240, winner, round: 2, fighters };
}
function damage(slot = 'light') {
  return { type: 'damage', frame: 240, actor: 0, target: 1, amount: 300, blocked: false, slot };
}

test('every playable artist owns a dedicated arrangement beside the shared and crossover arenas', () => {
  assert.equal(FIGHTERS.length, 54);
  assert.equal(sharedStageIds.size, STAGES.length);
  for (const id of ['bigtop','candy','manor','spudsy','cellar','void','lake','training','gloink','kingdom','grounds','backstage',
    'silicacity','portaurora','coppernine','gaslightwharf','parkplanet','gameoverse','littledaisy','showgrounds','simpleflipisland']) {
    assert.ok(sharedStageIds.has(id), id + ': shared arena retained');
  }
  for (const stage of STAGES) assert.equal(stage.dedicatedTo, undefined, stage.id);
  assert.equal(DEDICATED_STAGES.length, FIGHTERS.length);
  assert.equal(ALL_STAGES.length, STAGES.length + DEDICATED_STAGES.length);
  assert.equal(new Set(ALL_STAGES.map(stage => stage.id)).size, ALL_STAGES.length);
  const sourceThemes = {ep1:'bigtop',ep2:'candy',ep3:'manor',ep4:'spudsy',cainos:'lake',adaptation:'training'};
  for (const fighter of FIGHTERS) {
    const stage = getDedicatedStage(fighter.id);
    assert.equal(stage.theme, sourceThemes[fighter.loreSource] || 'bigtop', fighter.id + ': source episode scenery');
    assert.ok(stage, fighter.id + ': dedicated stage');
    assert.equal(stage.dedicatedTo, fighter.id);
    assert.equal(stage.id, 'home-' + fighter.id);
    assert.ok(sharedStageIds.has(stage.theme), fighter.id + ': dedicated stage reuses a reviewed series theme');
    assert.equal(stage.palette.accent, fighter.color);
    assert.equal(getStage(stage.id).id, stage.id, fighter.id + ': dedicated stage is selectable');
    assert.ok(stage.description.length > 60 && stage.provenance.length > 0);
    assert.ok(stage.fidelity && typeof stage.fidelity === 'object');
  }
});

test('every playable artist has one distinct friendship number replacing the finale on request', () => {
  assert.equal(FRIENDSHIP_CATALOG.length, FIGHTERS.length);
  assert.equal(new Set(FRIENDSHIP_CATALOG.map(entry => entry.id)).size, FRIENDSHIP_CATALOG.length);
  for (const fighter of FIGHTERS) {
    const entries = FRIENDSHIP_CATALOG.filter(entry => entry.fighterId === fighter.id);
    assert.equal(entries.length, 1, fighter.id);
    const entry = entries[0];
    assert.equal(entry.id, fighter.id + '.friendship');
    assert.equal(entry.variant, 'friendship');
    assert.equal(entry.presentation, 'friendship');
    assert.ok(Number.isInteger(entry.durationFrames) && entry.durationFrames > 0);
    assert.equal(entry.beats.length, 3);
    assert.equal(entry.beats[0].frame, 0);
    assert.ok(entry.beats[2].frame < entry.durationFrames);
    assert.ok(entry.title.length > 3 && entry.adaptation.length > 40 && entry.remainingArtWork.length > 20);
    assert.ok(entry.sourceIds.length && entry.motif);
    assert.ok(Object.isFrozen(entry) && Object.isFrozen(entry.beats));
    const settled = sampleFinisherPresentation(entry, entry.durationFrames);
    assert.equal(settled.done, true);
    assert.equal(settled.beatIndex, 2);
    const selected = selectMatchFriendship(stateFor(fighter.id), [damage()], { mode: 'versus', presentation: 'friendship' });
    assert.equal(selected?.id, entry.id, fighter.id);
    assert.equal(selected.trigger, 'friendship');
    assert.equal(selected.winnerIndex, 0);
    assert.equal(selected.loserIndex, 1);
  }
});

test('friendship selection is opt-in and never replaces the knockout finale by itself', () => {
  const state = stateFor('queenie');
  assert.equal(selectMatchFriendship(state, [damage()]), null);
  assert.equal(selectMatchFriendship(state, [damage()], { mode: 'versus', presentation: 'finale' }), null);
  assert.equal(selectMatchFriendship(state, [damage()], { mode: 'replay', presentation: 'friendship' }), null);
  assert.equal(selectMatchFriendship({ ...state, winner: -1 }, [damage()], { presentation: 'friendship' }), null);
  assert.equal(selectMatchFriendship(state, [], { presentation: 'friendship' }), null);
  assert.equal(selectMatchFriendship(state, [damage('utility')], { presentation: 'friendship' })?.trigger, 'friendship');
  for (const fighter of FIGHTERS) {
    assert.equal(selectMatchFinisher(stateFor(fighter.id), [damage('light')]).id, fighter.id + '.impact', fighter.id);
  }
  assert.equal(FINISHER_CATALOG.filter(entry => entry.fighterId === 'queenie').length, 3);
});

test('all fifty-four rivals belong to their own four-chapter route', () => {
  assert.equal(Object.keys(STORY_ROUTES).length, FIGHTERS.length);
  for (const fighter of FIGHTERS) {
    const rivalId = STORY_RIVALS[fighter.id];
    assert.ok(ids.has(rivalId), fighter.id + ': rival in roster');
    assert.notEqual(rivalId, fighter.id, fighter.id + ': rival is not the player');
    const rival = getStoryRival(fighter.id);
    assert.ok(rival, fighter.id + ': rival resolved');
    assert.equal(rival.id, rivalId);
    assert.ok(Number.isInteger(rival.index) && rival.index >= 0 && rival.index < 4);
    assert.equal(STORY_ROUTES[fighter.id].chapters[rival.index].opponentId, rivalId);
    assert.ok(rival.name && rival.name !== rivalId, fighter.id + ': rival has a display name');
  }
});

test('every story route ships four chapters plus intro and ending illustration lists', () => {
  for (const fighter of FIGHTERS) {
    const route = STORY_ROUTES[fighter.id];
    assert.ok(route, fighter.id);
    assert.equal(route.fighterId, fighter.id);
    assert.equal(route.chapters.length, 4, fighter.id + ': four chapters');
    for (const [index, chapter] of route.chapters.entries()) {
      assert.ok(ids.has(chapter.opponentId), `${fighter.id}: chapter ${index} opponent`);
      assert.ok(ALL_STAGES.some(stage => stage.id === chapter.stageId), `${fighter.id}: chapter ${index} stage`);
      assert.ok(chapter.title && chapter.summary.length > 40 && chapter.dialogue.length >= 1);
    }
    for (const kind of ['prologue', 'epilogue']) {
      assert.equal(route[kind].length, 3, `${fighter.id}: ${kind} illustrations`);
      for (const [index, panel] of route[kind].entries()) {
        assert.equal(panel.id, `${fighter.id}-${kind}-${index + 1}`);
        assert.ok(ALL_STAGES.some(stage => stage.id === panel.stageId), `${fighter.id}: ${kind} ${index} stage`);
        assert.ok(panel.cast.length >= 1 && panel.cast.every(id => ids.has(id)), `${fighter.id}: ${kind} ${index} cast`);
        assert.ok(panel.title && panel.summary.length > 30);
      }
    }
    assert.ok(route.intro.length > 60 && route.ending.length > 60);
    assert.ok(route.writingApproach.length > 40);
    assert.ok(route.referenceIds.length >= 1);
    for (const referenceId of route.referenceIds) assert.ok(STORY_REFERENCES[referenceId], `${fighter.id}: reference ${referenceId}`);
    assert.ok(getStoryRival(fighter.id).index < route.chapters.length);
  }
});
