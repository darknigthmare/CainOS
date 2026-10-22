export const KEY_LABELS = {
  azerty: ['Z Q S D', 'J', 'K', 'U', 'I', 'O', 'L', 'Maj gauche', 'E'],
  qwerty: ['W A S D', 'J', 'K', 'U', 'I', 'O', 'L', 'Left Shift', 'E']
};
const KEY_MAPS = [
  { left:['KeyA'],right:['KeyD'],down:['KeyS'],jump:['KeyW','Space'],guard:['ShiftLeft'],dash:['KeyE'],light:['KeyJ'],heavy:['KeyK'],throw:['KeyU'],special:['KeyI'],super:['KeyO'],utility:['KeyL'] },
  { left:['ArrowLeft'],right:['ArrowRight'],down:['ArrowDown'],jump:['ArrowUp'],guard:['ShiftRight','Numpad0'],dash:['ControlRight','NumpadDecimal'],light:['KeyB','Numpad1'],heavy:['KeyN','Numpad2'],throw:['KeyV','Numpad4'],special:['KeyM','Numpad5'],super:['Comma','Numpad6'],utility:['Period','Numpad3'] }
];
const CONSUMED_KEYS = new Set(Object.values(KEY_MAPS[0]).flat().concat(Object.values(KEY_MAPS[1]).flat()));
export class InputController {
  constructor({ enabled, onPause, onHelp }) {
    this.enabled = enabled; this.onPause = onPause; this.onHelp = onHelp;
    this.keys = new Set(); this.tapped = new Set(); this.touch = new Map(); this.touchTaps = new Set(); this.padPrevious = [[], []];
    document.addEventListener('keydown', e => {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.code === 'Escape' && !e.repeat && this.enabled()) { e.preventDefault(); this.onPause(); return; }
      if (e.code === 'F1' && this.enabled()) { e.preventDefault(); this.onHelp(); return; }
      if (!this.enabled() || !CONSUMED_KEYS.has(e.code)) return;
      e.preventDefault();
      if (!this.keys.has(e.code)) this.tapped.add(e.code);
      this.keys.add(e.code);
    });
    // A short press may begin and end between two animation frames. The queued
    // edge belongs to the next poll; releasing only changes held movement.
    document.addEventListener('keyup', e => { this.keys.delete(e.code); });
    window.addEventListener('blur', () => this.clear());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.clear(); });
  }
  clear() { this.keys.clear(); this.tapped.clear(); this.touch.clear(); this.touchTaps.clear(); document.querySelectorAll('[data-control].pressed').forEach(el => el.classList.remove('pressed')); }
  bindTouch(container) {
    container.querySelectorAll('[data-control]').forEach(button => {
      const action = button.dataset.control;
      button.addEventListener('pointerdown', e => {
        if (!this.enabled()) return;
        e.preventDefault(); button.setPointerCapture(e.pointerId); button.classList.add('pressed');
        this.touch.set(e.pointerId, action); this.touchTaps.add(action);
      });
      const release = e => { this.touch.delete(e.pointerId); if (![...this.touch.values()].includes(action)) button.classList.remove('pressed'); };
      button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
      button.addEventListener('contextmenu', e => e.preventDefault());
    });
  }
  poll(fighters = [], local = false) {
    const pads = [...(navigator.getGamepads?.() || [])].filter(Boolean).slice(0, 2);
    const result = [0,1].map(index => {
      const map = KEY_MAPS[index], pad = pads[index];
      const held = key => map[key]?.some(code => this.keys.has(code)) || (index === 0 && [...this.touch.values()].includes(key));
      const tap = key => map[key]?.some(code => this.tapped.has(code)) || (index === 0 && this.touchTaps.has(key));
      const btn = n => !!pad?.buttons[n]?.pressed;
      const pressed = n => btn(n) && !this.padPrevious[index]?.[n];
      const input = {left:!!held('left') || (pad?.axes[0] ?? 0)<-.35 || btn(14),right:!!held('right') || (pad?.axes[0] ?? 0)>.35 || btn(15),down:!!held('down') || (pad?.axes[1] ?? 0)>.45 || btn(13),guard:!!held('guard')||btn(4)||btn(6),jump:!!tap('jump')||pressed(0)||pressed(12),dash:!!tap('dash')||pressed(7),tech:false,slot:null};
      const actions = {light:tap('light')||pressed(2),heavy:tap('heavy')||pressed(3),throw:tap('throw')||pressed(5),special:tap('special')||pressed(1),super:tap('super')||pressed(10),utility:tap('utility')||pressed(11)};
      for (const key of ['super','throw','utility','special','heavy','light']) {
        if (!actions[key]) continue;
        const face = fighters[index]?.face ?? (index ? -1 : 1);
        input.slot = key === 'light' && input.down ? 'low' : key === 'special' ? input.down ? 'specialDown' : (face > 0 ? input.right : input.left) ? 'specialForward' : (face > 0 ? input.left : input.right) ? 'specialBack' : 'special' : key;
        break;
      }
      // Generic touch light/special follow the same directional resolution as
      // keyboard/gamepad. Only explicit alternate-technique buttons override it.
      if (index === 0) for (const key of ['low', 'specialDown', 'specialForward', 'specialBack']) if (this.touchTaps.has(key)) input.slot = key;
      input.tech = input.slot === 'throw' || !!tap('tech');
      if (pressed(9)) this.onPause();
      this.padPrevious[index] = pad?.buttons.map(b => b.pressed) || [];
      return index === 1 && !local ? {} : input;
    });
    this.tapped.clear(); this.touchTaps.clear();
    return result;
  }
}
