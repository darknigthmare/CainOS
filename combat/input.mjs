import { cleanBindings } from './bindings.mjs';

export const KEY_LABELS = {
  azerty: ['Z Q S D', 'J', 'K', 'U', 'I', 'O', 'L', 'Maj gauche', 'E'],
  qwerty: ['W A S D', 'J', 'K', 'U', 'I', 'O', 'L', 'Left Shift', 'E']
};
const editing = target => !!target && (/^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName) || target.isContentEditable);
// The menu owns select/slider/checkbox changes. Text editors retain their native
// focus and shortcuts; key-capture dialogs use the explicit disabled flag.
const menuEditing = target => !!target && (target.isContentEditable || target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' && !['range','checkbox','radio'].includes(target.type));
// Use the same gameplay thresholds for returning a suspended pad to neutral.
const padActive = pad => !!pad && (pad.buttons?.some(button => button.pressed) || Math.abs(pad.axes?.[0] ?? 0) > .35 || Math.abs(pad.axes?.[1] ?? 0) > .45);
export class InputController {
  constructor({ enabled, onPause=()=>{}, onHelp=()=>{}, getBindings=()=>undefined, onNavigate=()=>{} }) {
    this.enabled = enabled; this.onPause = onPause; this.onHelp = onHelp; this.getBindings=getBindings; this.onNavigate=onNavigate;
    this.keys = new Set(); this.tapped = new Set(); this.touch = new Map(); this.touchTaps = new Map(); this.padPrevious = [[], []];
    this.bindingSource=Symbol('initial'); this.bindings=cleanBindings(); this.consumedKeys=new Set();
    this.padSlots=[null,null]; this.padNeedsNeutral=[false,false]; this.lastPollMode='menu'; this.menuNeedsNeutral=false; this.menuDirection=null; this.menuNextAt=0;
    this.refreshBindings();
    document.addEventListener('keydown', e => {
      if (editing(e.target) || e.metaKey || e.altKey) return;
      this.refreshBindings();
      // Ctrl can itself be an authored gameplay key (J2's default dash). When
      // its initial press was consumed by the game, other mapped keys remain
      // usable for both players. Uncaptured Ctrl chords stay browser shortcuts.
      const controlCodes = ['ControlLeft','ControlRight'];
      if (e.ctrlKey && !controlCodes.includes(e.code) && !controlCodes.some(code => this.keys.has(code))) return;
      if (e.code === 'Escape' && !e.repeat && this.enabled()) { e.preventDefault(); this.onPause(); return; }
      if (e.code === 'F1' && !e.repeat && this.enabled()) { e.preventDefault(); this.onHelp(); return; }
      const activationControl = e.target?.closest?.('button,a[href],summary');
      if (['Space','Enter','NumpadEnter'].includes(e.code) && activationControl && !activationControl.hasAttribute('data-control')) return;
      if (!this.enabled() || !this.consumedKeys.has(e.code)) return;
      e.preventDefault();
      // Held keys already live in `keys`. A repeat must never resurrect an
      // input cleared by pause, focus loss or a binding change: only a fresh
      // physical press can start another attack or movement after that reset.
      if (e.repeat) return;
      if (!this.keys.has(e.code)) this.tapped.add(e.code);
      this.keys.add(e.code);
    });
    // A short press may begin and end between two animation frames. The queued
    // edge belongs to the next poll; releasing only changes held movement.
    document.addEventListener('keyup', e => { this.keys.delete(e.code); });
    window.addEventListener('blur', () => this.clear());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.clear(); });
  }
  refreshBindings() {
    let source; try { source=this.getBindings(); } catch { source=undefined; }
    if (source===this.bindingSource) return;
    this.bindingSource=source; this.bindings=cleanBindings(source);
    this.consumedKeys=new Set(this.bindings.flatMap(map=>Object.values(map).flat()));
    this.clear();
  }
  gamepads() {
    let snapshot=[]; try { snapshot=[...(navigator.getGamepads?.() || [])]; } catch { /* Gamepad permission is optional. */ }
    const connected=new Map(snapshot.map((pad,index)=>[pad?.index??index,pad]).filter(([,pad])=>pad && pad.connected!==false));
    for(let index=0;index<2;index++) if(this.padSlots[index]!==null&&!connected.has(this.padSlots[index])) { this.padSlots[index]=null; this.padPrevious[index]=[]; this.padNeedsNeutral[index]=false; }
    for(const key of connected.keys()) if(!this.padSlots.includes(key)){const free=this.padSlots.indexOf(null);if(free>=0)this.padSlots[free]=key;}
    return this.padSlots.map(key=>connected.get(key));
  }
  rememberPads(pads) { this.padPrevious=pads.map(pad=>pad?.buttons?.map(button=>!!button.pressed)||[]); }
  clear() {
    this.keys.clear(); this.tapped.clear(); this.touch.clear(); this.touchTaps.clear();
    document.querySelectorAll('[data-control].pressed').forEach(el => el.classList.remove('pressed'));
    // A stick or button held across pause/focus loss must be released before it
    // drives combat again. Menu navigation still reads the raw pads separately.
    const pads=this.gamepads();
    this.padNeedsNeutral=pads.map(padActive); this.rememberPads(pads);
  }
  bindTouch(container) {
    container.querySelectorAll('[data-control]').forEach(button => {
      const action = button.dataset.control;
      button.addEventListener('pointerdown', e => {
        if (!this.enabled()) return;
        e.preventDefault(); button.setPointerCapture(e.pointerId); button.classList.add('pressed');
        this.touch.set(e.pointerId, action); this.touchTaps.set(e.pointerId, action);
      });
      const release = (e, cancelled=false) => {
        // Normal pointerup keeps its short tap until the next tick. Capture is
        // then lost automatically; only an interrupted, still-held contact is
        // cancelled. Tracking taps by pointer preserves another valid finger.
        if(cancelled && this.touch.has(e.pointerId))this.touchTaps.delete(e.pointerId);
        this.touch.delete(e.pointerId);
        if (![...this.touch.values()].includes(action)) button.classList.remove('pressed');
      };
      button.addEventListener('pointerup', e => release(e));
      button.addEventListener('pointercancel', e => release(e,true));
      button.addEventListener('lostpointercapture', e => release(e,true));
      button.addEventListener('contextmenu', e => e.preventDefault());
    });
  }
  poll(fighters = [], local = false) {
    this.refreshBindings();
    const pads = this.gamepads();
    if(!this.enabled()){this.clear();this.rememberPads(pads);return [{},{}];}
    this.lastPollMode='combat';
    // Pause belongs to the whole encounter, even when both players press Start
    // on the same tick. Consume it before producing either player's commands.
    if(pads.some((pad,index)=>pad?.buttons?.[9]?.pressed&&!this.padPrevious[index]?.[9])) {
      this.clear(); this.rememberPads(pads); this.onPause(); return [{},{}];
    }
    const touchTaps=new Set(this.touchTaps.values());
    const result = [0,1].map(index => {
      const map = this.bindings[index];
      let pad = pads[index];
      if(this.padNeedsNeutral[index]) {
        if(!padActive(pad))this.padNeedsNeutral[index]=false;
        pad=undefined;
      }
      const held = key => map[key]?.some(code => this.keys.has(code)) || (index === 0 && [...this.touch.values()].includes(key));
      const tap = key => map[key]?.some(code => this.tapped.has(code)) || (index === 0 && touchTaps.has(key));
      const btn = n => !!pad?.buttons?.[n]?.pressed;
      const pressed = n => btn(n) && !this.padPrevious[index]?.[n];
      const input = {left:!!held('left') || (pad?.axes?.[0] ?? 0)<-.35 || btn(14),right:!!held('right') || (pad?.axes?.[0] ?? 0)>.35 || btn(15),down:!!held('down') || (pad?.axes?.[1] ?? 0)>.45 || btn(13),guard:!!held('guard')||btn(4)||btn(6),jump:!!tap('jump')||pressed(0)||pressed(12),dash:!!tap('dash')||pressed(7),tech:false,slot:null};
      const actions = {light:tap('light')||pressed(2),heavy:tap('heavy')||pressed(3),throw:tap('throw')||pressed(5),special:tap('special')||pressed(1),super:tap('super')||pressed(10),utility:tap('utility')||pressed(11)};
      for (const key of ['super','throw','utility','special','heavy','light']) {
        if (!actions[key]) continue;
        const face = fighters[index]?.face ?? (index ? -1 : 1);
        input.slot = key === 'light' && input.down ? 'low' : key === 'special' ? input.down ? 'specialDown' : (face > 0 ? input.right : input.left) ? 'specialForward' : (face > 0 ? input.left : input.right) ? 'specialBack' : 'special' : key;
        break;
      }
      // Generic touch light/special follow the same directional resolution as
      // keyboard/gamepad. Only explicit alternate-technique buttons override it.
      if (index === 0) for (const key of ['low', 'specialDown', 'specialForward', 'specialBack']) if (touchTaps.has(key)) input.slot = key;
      input.tech = input.slot === 'throw' || !!tap('tech');
      this.padPrevious[index] = pads[index]?.buttons?.map(b => !!b.pressed) || [];
      return index === 1 && !local ? {} : input;
    });
    this.tapped.clear(); this.touchTaps.clear();
    return result;
  }
  /** Menu navigation is opt-in; the UI retains focus, click and Back semantics. */
  pollMenu(now=performance.now(), { disabled=false }={}) {
    // Calling the optional menu poll from a shared RAF must not consume combat
    // button edges or change controller ownership while a fight is active.
    if(this.enabled())return null;
    const pads=this.gamepads(), time=Number.isFinite(now)?now:0;
    const states=pads.map((pad,index)=>{
      const button=n=>!!pad?.buttons?.[n]?.pressed;
      const edge=n=>button(n)&&!this.padPrevious[index]?.[n];
      const dx=Number(button(15))-Number(button(14)),dy=Number(button(13))-Number(button(12));
      const x=dx||((Math.abs(pad?.axes?.[0]||0)>.55)?pad.axes[0]:0);
      const y=dy||((Math.abs(pad?.axes?.[1]||0)>.55)?pad.axes[1]:0);
      const direction=(x||y)?Math.abs(y)>=Math.abs(x)?(y<0?'up':'down'):(x<0?'left':'right'):null;
      return { direction, back:edge(1), select:edge(0)||edge(9), active:!!direction||button(0)||button(1)||button(9) };
    });
    const busy=states.some(state=>state.active);
    if(this.lastPollMode==='combat')this.menuNeedsNeutral=busy;
    this.lastPollMode='menu';
    this.rememberPads(pads);
    if(disabled||document.hidden||menuEditing(document.activeElement)){
      this.menuNeedsNeutral=busy;this.menuDirection=null;return null;
    }
    if(this.menuNeedsNeutral){if(!busy)this.menuNeedsNeutral=false;this.menuDirection=null;return null;}
    let action=states.some(state=>state.back)?'back':states.some(state=>state.select)?'select':null;
    const direction=states.find(state=>state.direction)?.direction || null;
    if(!action && direction){
      if(direction!==this.menuDirection){action=direction;this.menuNextAt=time+350;}
      else if(time>=this.menuNextAt){action=direction;this.menuNextAt=time+140;}
    }
    this.menuDirection=direction;
    if(action)this.onNavigate(action);
    return action;
  }
}
