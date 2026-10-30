/** Interrupted device input must never become a later gameplay command. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { InputController } from '../combat/input.mjs';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { FIGHTERS } from '../combat/data.mjs';

class Surface {
  constructor() { this.handlers = new Map(); }
  addEventListener(type, listener) {
    const handlers = this.handlers.get(type) || [];
    handlers.push(listener); this.handlers.set(type, handlers);
  }
  emit(type, props = {}) {
    const event = { target: { tagName: 'CANVAS' }, repeat: false, preventDefault() {}, ...props };
    for (const listener of this.handlers.get(type) || []) listener(event);
  }
}

function withDevices(run) {
  const originals = Object.fromEntries(['document', 'window', 'navigator'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const document = new Surface(), window = new Surface(), pads = [], buttons = [];
  document.hidden = false; document.activeElement = { tagName: 'BUTTON' };
  document.querySelectorAll = () => buttons.filter(button => button.classes.has('pressed'));
  for (const [key, value] of Object.entries({ document, window, navigator: { getGamepads: () => pads } })) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  let enabled = true, pauses = 0;
  const controls = new InputController({ enabled: () => enabled, onPause: () => { pauses++; } });
  const touch = action => {
    const button = new Surface(); button.dataset = { control: action }; button.classes = new Set();
    button.classList = { add: value => button.classes.add(value), remove: value => button.classes.delete(value) };
    button.setPointerCapture = () => {};
    buttons.push(button); controls.bindTouch({ querySelectorAll: () => [button] }); return button;
  };
  const engine = new CombatEngine({ fighters: [FIGHTERS[0], FIGHTERS[1]], cpu: [false, false], mode: 'local', skipIntro: true });
  const step = () => engine.step(FIXED_DT, controls.poll(engine.state.fighters, true));
  try { return run({ controls, document, window, pads, touch, engine, step, pauses: () => pauses, setEnabled: value => { enabled = value; } }); }
  finally {
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];
    }
  }
}

const pad = index => ({ index, connected: true, axes: [0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false })) });

for (const interruption of ['pointercancel', 'lostpointercapture']) {
  test(`${interruption} before a tick discards a queued touch attack`, () => withDevices(({ touch, engine, step }) => {
    const light = touch('light');
    light.emit('pointerdown', { pointerId: 1 });
    light.emit(interruption, { pointerId: 1 });
    step();
    assert.equal(engine.state.a.stats.starts, 0, 'The interrupted contact must not attack.');
    assert.equal(light.classes.has('pressed'), false);
    light.emit('pointerdown', { pointerId: 2 }); step();
    assert.equal(engine.state.a.stats.starts, 1, 'A new contact is still actionable.');
  }));
}

test('ordinary pointerup followed by lost capture preserves a short tap exactly once', () => withDevices(({ touch, engine, step }) => {
  const light = touch('light');
  light.emit('pointerdown', { pointerId: 3 });
  light.emit('pointerup', { pointerId: 3 });
  light.emit('lostpointercapture', { pointerId: 3 });
  for (let frame = 0; frame < 90; frame++) step();
  assert.equal(engine.state.a.stats.starts, 1);
}));

test('cancelling one finger preserves a second finger on the same action', () => withDevices(({ controls, touch }) => {
  const light = touch('light');
  light.emit('pointerdown', { pointerId: 4 }); light.emit('pointerdown', { pointerId: 5 });
  light.emit('pointercancel', { pointerId: 4 });
  assert.equal(light.classes.has('pressed'), true);
  light.emit('pointerup', { pointerId: 5 }); light.emit('lostpointercapture', { pointerId: 5 });
  assert.equal(controls.poll()[0].slot, 'light');
  assert.equal(controls.poll()[0].slot, null);
  assert.equal(light.classes.has('pressed'), false);
}));

test('cancelling all fingers on one action leaves no queued attack', () => withDevices(({ touch, engine, step }) => {
  const light = touch('light');
  light.emit('pointerdown', { pointerId: 6 }); light.emit('pointerdown', { pointerId: 7 });
  light.emit('pointercancel', { pointerId: 6 }); light.emit('lostpointercapture', { pointerId: 7 });
  step(); assert.equal(engine.state.a.stats.starts, 0);
}));

test('touch cancellation preserves a separate keyboard attack and held touch direction', () => withDevices(({ controls, document, touch }) => {
  const light = touch('light'), right = touch('right');
  right.emit('pointerdown', { pointerId: 8 });
  light.emit('pointerdown', { pointerId: 9 }); light.emit('pointercancel', { pointerId: 9 });
  document.emit('keydown', { code: 'KeyK' }); document.emit('keyup', { code: 'KeyK' });
  const input = controls.poll()[0];
  assert.equal(input.slot, 'heavy'); assert.equal(input.right, true);
}));

test('two simultaneous gamepad Start presses request one pause and consume that tick', () => withDevices(({ controls, document, pads, touch, pauses }) => {
  pads.push(pad(0), pad(1)); controls.poll([], true);
  for (const device of pads) { device.buttons[9].pressed = true; device.buttons[2].pressed = true; }
  document.emit('keydown', { code: 'KeyJ' }); document.emit('keydown', { code: 'KeyB' });
  touch('super').emit('pointerdown', { pointerId: 10 });
  const pausedInputs = controls.poll([], true);
  assert.equal(pauses(), 1);
  assert.deepEqual(pausedInputs, [{}, {}]);
  assert.equal(controls.poll([], true).some(input => input.slot), false);
  assert.equal(pauses(), 1, 'Held Start cannot request a second pause.');
  for (const device of pads) device.buttons.forEach(button => { button.pressed = false; });
  controls.poll([], true); pads[1].buttons[9].pressed = true; controls.poll([], true);
  assert.equal(pauses(), 2, 'A fresh Start press still pauses.');
}));

for (const interruption of ['blur', 'visibilitychange']) {
  test(`${interruption} clears held gamepad actions until the device returns to neutral`, () => withDevices(({ controls, document, window, pads, engine, step }) => {
    pads.push(pad(0)); controls.poll();
    pads[0].axes[0] = .8; pads[0].buttons[2].pressed = true; pads[0].buttons[4].pressed = true;
    if (interruption === 'blur') window.emit('blur');
    else { document.hidden = true; document.emit('visibilitychange'); document.hidden = false; }
    const x = engine.state.a.x;
    for (let frame = 0; frame < 3; frame++) step();
    assert.equal(engine.state.a.stats.starts, 0); assert.equal(engine.state.a.x, x); assert.equal(engine.state.a.block, false);
    pads[0].axes[0] = 0; pads[0].buttons.forEach(button => { button.pressed = false; }); step();
    pads[0].axes[0] = .8; pads[0].buttons[2].pressed = true; step();
    assert.equal(engine.state.a.stats.starts, 1);
    assert.equal(controls.poll()[0].right, true, 'A fresh stick movement remains available.');
  }));
}

test('a neutral wait after reset is per device and never blocks keyboard input', () => withDevices(({ controls, document, pads }) => {
  pads.push(pad(0), pad(1)); controls.poll([], true);
  pads[0].axes[0] = .8; controls.clear();
  pads[1].buttons[2].pressed = true; document.emit('keydown', { code: 'KeyK' });
  const inputs = controls.poll([], true);
  assert.equal(inputs[0].right, false); assert.equal(inputs[0].slot, 'heavy'); assert.equal(inputs[1].slot, 'light');
}));

test('disconnecting a suspended controller does not block its replacement or move player two', () => withDevices(({ controls, pads }) => {
  pads.push(pad(0), pad(1)); controls.poll([], true);
  pads[0].axes[0] = .8; controls.clear();
  pads[0] = null; controls.poll([], true);
  pads[2] = pad(2); pads[2].axes[0] = -.8; pads[1].buttons[2].pressed = true;
  const inputs = controls.poll([], true);
  assert.equal(inputs[0].left, true); assert.equal(inputs[1].slot, 'light');
}));
