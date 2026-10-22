/** Physical keyboard bindings shared by settings, imports and the input loop. */
export const BINDING_ACTIONS = Object.freeze([
  ['left', 'Gauche'], ['right', 'Droite'], ['down', 'Accroupissement'],
  ['jump', 'Saut'], ['guard', 'Garde'], ['dash', 'Dash'],
  ['light', 'Attaque légère'], ['heavy', 'Attaque forte'], ['throw', 'Saisie / déchope'],
  ['special', 'Spécial'], ['super', 'Finale'], ['utility', 'Ressource'],
].map(([id, label]) => Object.freeze({ id, label })));

const defaults = [
  { left:['KeyA'],right:['KeyD'],down:['KeyS'],jump:['KeyW','Space'],guard:['ShiftLeft'],dash:['KeyE'],light:['KeyJ'],heavy:['KeyK'],throw:['KeyU'],special:['KeyI'],super:['KeyO'],utility:['KeyL'] },
  { left:['ArrowLeft'],right:['ArrowRight'],down:['ArrowDown'],jump:['ArrowUp'],guard:['ShiftRight','Numpad0'],dash:['ControlRight','NumpadDecimal'],light:['KeyB','Numpad1'],heavy:['KeyN','Numpad2'],throw:['KeyV','Numpad4'],special:['KeyM','Numpad5'],super:['Comma','Numpad6'],utility:['Period','Numpad3'] },
];
export const DEFAULT_BINDINGS = Object.freeze(defaults.map(map => Object.freeze(Object.fromEntries(
  Object.entries(map).map(([action, codes]) => [action, Object.freeze(codes)])
))));
const actionIds = new Set(BINDING_ACTIONS.map(action => action.id));
const allowedCodes = new Set([
  ...Array.from({ length:26 }, (_, index) => `Key${String.fromCharCode(65+index)}`),
  ...Array.from({ length:10 }, (_, index) => `Digit${index}`),
  ...Array.from({ length:10 }, (_, index) => `Numpad${index}`),
  'ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight','ControlLeft','ControlRight',
  'Minus','Equal','BracketLeft','BracketRight','Backslash','IntlBackslash','Semicolon','Quote','Backquote','Comma','Period','Slash',
  'NumpadDecimal','NumpadAdd','NumpadSubtract','NumpadMultiply','NumpadDivide',
]);
export function isBindableCode(code) { return typeof code === 'string' && allowedCodes.has(code); }
const cloneDefaults = () => DEFAULT_BINDINGS.map(map => Object.fromEntries(Object.entries(map).map(([action,codes])=>[action,[...codes]])));

/**
 * Imports may omit actions, but every final action must remain reachable and
 * every physical key belongs to exactly one action/player. An invalid complete
 * assignment returns the safe default map instead of stealing another action.
 */
export function cleanBindings(value) {
  if (!Array.isArray(value) || value.length !== 2) return cloneDefaults();
  const result = cloneDefaults();
  for (let player=0; player<2; player++) {
    if (!value[player] || typeof value[player] !== 'object' || Array.isArray(value[player])) return cloneDefaults();
    for (const { id } of BINDING_ACTIONS) {
      if (!Object.hasOwn(value[player],id)) continue;
      const codes=value[player][id];
      if (!Array.isArray(codes) || !codes.length || codes.length>2 || !codes.every(isBindableCode) || new Set(codes).size!==codes.length) return cloneDefaults();
      result[player][id]=[...codes];
    }
  }
  const seen = new Set();
  for (const map of result) for (const codes of Object.values(map)) for (const code of codes) {
    if (seen.has(code)) return cloneDefaults();
    seen.add(code);
  }
  return result;
}

export function bindingConflict(bindings, code, player, action, slot=0) {
  for (let owner=0; owner<2; owner++) for (const entry of BINDING_ACTIONS) {
    const index=bindings[owner]?.[entry.id]?.indexOf(code) ?? -1;
    if (index>=0 && !(owner===player && entry.id===action && index===slot)) {
      return { player:owner, action:entry.id, slot:index, label:entry.label };
    }
  }
  return null;
}

/** Replace one binding without mutating the saved settings or silently swapping. */
export function rebindAction(value, player, action, code, slot=0) {
  const bindings=cleanBindings(value);
  if (![0,1].includes(player) || !actionIds.has(action) || ![0,1].includes(slot)) return { ok:false, bindings, error:'Commande inconnue.' };
  if ((code===null || code==='') && slot===1) {
    bindings[player][action]=bindings[player][action].slice(0,1);
    return { ok:true, bindings };
  }
  if (!isBindableCode(code)) return { ok:false, bindings, error:'Cette touche est réservée à la navigation ou au navigateur. Choisis une lettre, une direction ou une touche du pavé numérique.' };
  const conflict=bindingConflict(bindings,code,player,action,slot);
  if (conflict) return { ok:false, bindings, conflict, error:`Cette touche commande déjà « ${conflict.label} » pour le joueur ${conflict.player+1}.` };
  bindings[player][action][slot]=code;
  return { ok:true, bindings };
}

const commonLabels = {
  ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',Space:'Espace',
  ShiftLeft:'Maj gauche',ShiftRight:'Maj droite',ControlLeft:'Ctrl gauche',ControlRight:'Ctrl droite',
  NumpadDecimal:'Pavé .',NumpadAdd:'Pavé +',NumpadSubtract:'Pavé −',NumpadMultiply:'Pavé ×',NumpadDivide:'Pavé /',
  IntlBackslash:'<',
};
const punctuation = {
  qwerty:{Minus:'−',Equal:'=',BracketLeft:'[',BracketRight:']',Backslash:'\\',Semicolon:';',Quote:"'",Backquote:'`',Comma:',',Period:'.',Slash:'/'},
  azerty:{KeyA:'Q',KeyQ:'A',KeyW:'Z',KeyZ:'W',KeyM:',',Minus:')',Equal:'=',BracketLeft:'^',BracketRight:'$',Backslash:'*',Semicolon:'M',Quote:'ù',Backquote:'²',Comma:';',Period:':',Slash:'!',Digit1:'1 (&)',Digit2:'2 (é)',Digit3:'3 (")',Digit4:"4 (')",Digit5:'5 (()',Digit6:'6 (−)',Digit7:'7 (è)',Digit8:'8 (_)',Digit9:'9 (ç)',Digit0:'0 (à)'},
};
export function keyLabel(code, layout='azerty') {
  if (!isBindableCode(code)) return '—';
  return commonLabels[code] || punctuation[layout==='qwerty'?'qwerty':'azerty'][code]
    || (code.startsWith('Key')?code.slice(3):code.startsWith('Digit')?code.slice(5):code.startsWith('Numpad')?`Pavé ${code.slice(6)}`:code);
}
export function formatBinding(bindings, player, action, layout='azerty') {
  const map=Array.isArray(bindings)?bindings:DEFAULT_BINDINGS;
  return (map[player]?.[action] || DEFAULT_BINDINGS[player]?.[action] || []).map(code=>keyLabel(code,layout)).join(' / ');
}
