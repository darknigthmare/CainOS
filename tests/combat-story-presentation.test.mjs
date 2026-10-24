import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { STORY_ROUTES, STORY_REFERENCES, STORY_REFERENCE_NOTICE } from '../combat/stories.mjs';
import { createStoryPresentation, stepStoryPresentation, skipStoryPresentation, storyPresentationMarkup } from '../combat/story-presentation.mjs';
import { createProgram, recordProgramResult, validateProgram } from '../combat/progression.mjs';

const fighterIds = FIGHTERS.map(fighter => fighter.id);
const stageIds = STAGES.map(stage => stage.id);
const signature = panel => JSON.stringify([panel.stageId, panel.composition, panel.cast]);

test('fourteen routes contain eighty-four authored prologue and epilogue tableaux with valid existing assets', () => {
  const ids = [], titles = [], summaries = [];
  for (const id of fighterIds) for (const kind of ['prologue', 'epilogue']) {
    const panels = STORY_ROUTES[id][kind];
    assert.equal(panels.length, 3, `${id}: ${kind}`);
    for (const panel of panels) {
      ids.push(panel.id); titles.push(panel.title); summaries.push(panel.summary);
      assert.ok(stageIds.includes(panel.stageId));
      assert.ok(panel.cast.length >= 1 && panel.cast.length <= 3);
      assert.ok(panel.cast.every(actor => fighterIds.includes(actor)));
      assert.ok(panel.summary.length > 60);
      assert.ok(panel.dialogue.every(line => typeof line.speaker === 'string' && line.text.length > 10));
    }
  }
  assert.equal(ids.length, 84);
  for (const values of [ids, titles, summaries]) assert.equal(new Set(values).size, 84);
});

test('each route opens and closes with distinct stage and cast compositions', () => {
  const intros = [], endings = [];
  for (const id of fighterIds) {
    const route = STORY_ROUTES[id];
    intros.push(signature(route.prologue[0])); endings.push(signature(route.epilogue[0]));
    assert.notEqual(signature(route.prologue[0]), signature(route.epilogue[0]), id);
    assert.equal(new Set([...route.prologue, ...route.epilogue].map(signature)).size, 6, `${id}: six separately composed tableaux`);
  }
  assert.equal(new Set(intros).size, 14); assert.equal(new Set(endings).size, 14);
});

test('narrative references are official, scoped, immutable and do not give Baron or Kaufmo new dialogue', () => {
  assert.match(STORY_REFERENCE_NOTICE, /créations pour Encore/);
  for (const route of Object.values(STORY_ROUTES)) {
    assert.ok(route.writingApproach.length > 50);
    assert.ok(route.referenceIds.length);
    for (const id of route.referenceIds) {
      assert.ok(Object.hasOwn(STORY_REFERENCES, id));
      assert.ok(['www.glitchprod.com', 'www.youtube.com', 'glitchproductions.store'].includes(new URL(STORY_REFERENCES[id].url).hostname));
    }
    for (const panel of [...route.prologue, ...route.chapters, ...route.epilogue]) {
      assert.ok(panel.dialogue.every(line => !/Baron|Kaufmo/i.test(line.speaker)));
      assert.ok(Object.isFrozen(panel.dialogue));
    }
  }
  assert.match(STORY_ROUTES.abstractedkaufmo.writingApproach, /aucune guérison/);
  assert.match(STORY_ROUTES.baronmildenhall.writingApproach, /distincte de Martha/);
  assert.match(STORY_ROUTES.gummigoo.writingApproach, /sans retour canonique/);
  assert.throws(() => { STORY_ROUTES.jax.prologue[0].dialogue[0].text = 'changed'; }, TypeError);
});

test('reader bounds, backward navigation and skips cannot start combat or escape to another route', () => {
  for (const id of fighterIds) {
    const reader = createStoryPresentation(id, 'chapter', 0);
    assert.equal(reader.panels.length, 4);
    assert.equal(reader.panels[0].kind, 'prologue');
    assert.equal(reader.panels[3].kind, 'chapter');
    assert.equal(stepStoryPresentation(reader, -1), reader);
    assert.equal(stepStoryPresentation(reader, 3), reader);
    const skipped = skipStoryPresentation(reader);
    assert.equal(skipped.index, 3);
    assert.equal(skipped.panels[3].title, STORY_ROUTES[id].chapters[0].title);
    assert.equal(stepStoryPresentation(skipped, 1), skipped);
    assert.equal(stepStoryPresentation(skipped, -1).index, 2);
    assert.equal(reader.index, 0);
    assert.throws(() => { reader.panels[3].cast.push('jax'); }, TypeError);
    const ending = createStoryPresentation(id, 'epilogue');
    assert.equal(skipStoryPresentation(ending), null);
    assert.equal(ending.panels.length, 3);
  }
});

test('only the initial encounter has a prologue; every resumed checkpoint starts at its own briefing', () => {
  for (const id of fighterIds) for (let chapter = 1; chapter < 4; chapter++) {
    const reader = createStoryPresentation(id, 'chapter', chapter);
    assert.equal(reader.panels.length, 1);
    assert.equal(reader.panels[0].kind, 'chapter');
    assert.equal(reader.panels[0].stageId, STORY_ROUTES[id].chapters[chapter].stageId);
    assert.equal(reader.panels[0].intro, '');
    assert.match(storyPresentationMarkup(reader), /data-action="story-start"/);
    assert.doesNotMatch(storyPresentationMarkup(reader), /data-action="story-skip"/);
  }
});

test('reader rejects malformed route and chapter requests, with no unsafe object-property fallback', () => {
  for (const id of ['__proto__', 'constructor', 'missing', {}, null]) assert.equal(createStoryPresentation(id), null);
  for (const kind of ['constructor', 'missing', null]) assert.equal(createStoryPresentation('pomni', kind), null);
  for (const chapter of [-1, 4, 0.5, '0', null]) assert.equal(createStoryPresentation('pomni', 'chapter', chapter), null);
  assert.equal(storyPresentationMarkup(null), '');
});

test('the existing fourteen encounter schedules and four-win checkpoints remain unchanged', () => {
  const schedules = {
    pomni:'ragatha:bigtop,jax:backstage,gummigoo:candy,caine:training',
    jax:'gangle:spudsy,zooble:grounds,ragatha:backstage,caine:bigtop',
    ragatha:'pomni:bigtop,bubble:lake,gloinkqueen:gloink,zooble:grounds',
    gangle:'ragatha:backstage,zooble:training,jax:spudsy,caine:bigtop',
    zooble:'bubble:lake,kinger:grounds,jax:spudsy,caine:training',
    kinger:'pomni:cellar,baronmildenhall:manor,gangle:backstage,caine:bigtop',
    caine:'bubble:lake,zooble:training,jax:grounds,pomni:bigtop',
    bubble:'zooble:lake,loolilalu:kingdom,fudge:candy,caine:bigtop',
    gummigoo:'loolilalu:kingdom,fudge:candy,pomni:grounds,caine:training',
    loolilalu:'gummigoo:kingdom,fudge:candy,gloinkqueen:gloink,jax:bigtop',
    gloinkqueen:'bubble:gloink,ragatha:grounds,zooble:training,caine:bigtop',
    fudge:'gummigoo:candy,loolilalu:kingdom,bubble:lake,caine:bigtop',
    abstractedkaufmo:'ragatha:backstage,kinger:cellar,pomni:void,caine:training',
    baronmildenhall:'kinger:manor,pomni:cellar,jax:backstage,caine:bigtop'
  };
  for (const id of fighterIds) {
    let run = createProgram('story', id, FIGHTERS, STAGES, { seed:20261023 });
    assert.equal(run.opponents.map((opponent, index) => `${opponent}:${run.stages[index]}`).join(','), schedules[id]);
    for (let chapter = 0; chapter < 4; chapter++) {
      const before = JSON.stringify(run);
      const reading = createStoryPresentation(id, 'chapter', chapter);
      storyPresentationMarkup(skipStoryPresentation(reading));
      assert.equal(JSON.stringify(run), before, 'presentation never alters the checkpoint');
      run = validateProgram(JSON.parse(JSON.stringify(recordProgramResult(run, { won:true, health:6000 }))));
    }
    assert.equal(run.status, 'complete'); assert.equal(run.results.length, 4);
    storyPresentationMarkup(createStoryPresentation(id, 'epilogue'));
    assert.throws(() => recordProgramResult(run, { won:true, health:6000 }), /terminé/);
  }
});
