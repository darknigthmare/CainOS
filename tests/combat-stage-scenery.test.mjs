import test from 'node:test';
import assert from 'node:assert/strict';
import { drawStageScenery, REVIEWED_SCENERY_IDS, SCENERY_ANCHORS, SCENERY_FLOOR } from '../combat/render-stage-scenery.mjs';
import { stageMotion } from '../combat/render-stage-motion.mjs';
import { stageCamera, drawStagePlanes } from '../combat/stage-parallax.mjs';

function recorder() {
  const commands = [], stack = [];
  const context = new Proxy({}, {
    get(_, name) {
      if (name === 'createLinearGradient') return (...args) => {
        commands.push([name, ...args]);
        return { addColorStop: (...stop) => commands.push(['addColorStop', ...stop]) };
      };
      return (...args) => {
        if (name === 'save') stack.push(1);
        if (name === 'restore') assert.ok(stack.pop(), 'Canvas restore without matching save');
        for (const argument of args) if (typeof argument === 'number') assert.ok(Number.isFinite(argument), `${name} received a non-finite coordinate`);
        commands.push([name, ...args]);
      };
    },
    set(_, name, value) { commands.push(['set', name, typeof value === 'object' ? 'gradient' : value]); return true; },
  });
  return { context, commands, stack };
}

test('unknown scenery identifiers safely defer to the existing renderer without touching Canvas', () => {
  const context = new Proxy({}, { get() { throw new Error('Unknown scenery touched Canvas'); } });
  for (const value of [undefined, null, '', 'missing', '__proto__', 'constructor', 'toString', { id: 'backstage', theme: 'constructor' }]) assert.equal(drawStageScenery(context, value), false);
});

test('the three scene drawings are deterministic, finite and preserve frozen input objects', () => {
  for (const id of REVIEWED_SCENERY_IDS) {
    const first = recorder(), second = recorder(), stage = Object.freeze({ id, palette: Object.freeze({ floor: '#123456' }) });
    const before = JSON.stringify(stage);
    assert.equal(drawStageScenery(first.context, stage), true);
    assert.equal(drawStageScenery(second.context, id), true);
    assert.deepEqual(first.commands, second.commands);
    assert.equal(JSON.stringify(stage), before);
    assert.equal(first.stack.length, 0);
    assert.deepEqual(first.commands.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, 0, 1280, 568], ['clip']]);
    assert.deepEqual(first.commands.at(-1), ['restore']);
  }
  assert.equal(SCENERY_FLOOR, 568);
});

test('explicit stage themes select the same scenery as their named arena', () => {
  for (const theme of REVIEWED_SCENERY_IDS) {
    const themed = recorder(), direct = recorder();
    drawStageScenery(themed.context, { id: 'preview', theme }); drawStageScenery(direct.context, theme);
    assert.deepEqual(themed.commands, direct.commands);
  }
});

test('ambient sources stay attached to the corridor lights, cooking surface and existing manor candles', () => {
  for (const frame of [0, 123, 3600]) {
    const lights = stageMotion('backstage', frame).shapes;
    assert.equal(lights.length, SCENERY_ANCHORS.backstage.lights.length);
    lights.forEach((shape, index) => assert.deepEqual([shape.x, shape.y], SCENERY_ANCHORS.backstage.lights[index].slice(0, 2)));
    stageMotion('spudsy', frame).shapes.forEach((shape, index) => {
      const [x, y] = SCENERY_ANCHORS.spudsy.steam[index];
      assert.equal(shape.points[0][0], x);
      assert.ok(shape.points.every(point => point[1] < y && point[1] > y - 100));
    });
    const candleGlows = stageMotion('manor', frame).shapes.filter((_, index) => index % 2 === 0);
    assert.deepEqual(candleGlows.map(shape => [shape.x, shape.y]), SCENERY_ANCHORS.manor.candles);
  }
  assert.ok(Object.isFrozen(SCENERY_ANCHORS.backstage.lights[0]));
});


test('the camera follows the fighters together, preserves its limits and rests at centre in reduced motion', () => {
  assert.equal(stageCamera([{ x: 128 }, { x: 1152 }], false), 0);
  assert.equal(stageCamera([{ x: 0 }, { x: 240 }], false), -1);
  assert.equal(stageCamera([{ x: 1024 }, { x: 1280 }], false), 1);
  assert.equal(stageCamera([{ x: 0 }, { x: 240 }], true), 0);
  assert.equal(stageCamera([{ x: Infinity }], false), 0);
});

test('all three planes retain overscan and move by different distances behind the fighters', () => {
  const layers = ['far', 'mid', 'near'];
  const draws = [0, -1, 1].map(camera => {
    const commands = [];
    drawStagePlanes({ drawImage: (...args) => commands.push(args) }, layers, camera);
    return commands;
  });
  for (const commands of draws) {
    assert.deepEqual(commands.map(([layer]) => layer), layers);
    assert.ok(commands.every(([, x, y]) => x < 0 && x + 1344 >= 1280 && y < 0 && y + 756 >= 720));
  }
  assert.deepEqual(draws[1].map(([, x], i) => x - draws[0][i][1]), [6, 17, 31]);
  assert.deepEqual(draws[2].map(([, x], i) => x - draws[0][i][1]), [-6, -17, -31]);
});
