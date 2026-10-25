/** DOM navigation shared by keyboard menus, gamepad menus and dialog refreshes. */
const selectable = 'button:not(:disabled),a[href],select:not(:disabled),input:not(:disabled):not([type=hidden]),summary';
const focusAttributes = ['data-bind-player','data-bind-action','data-bind-slot','data-finale-id','data-finale-fighter','data-finale-artist','data-appearance','data-try-appearance','data-fighter','data-side','data-stage','data-codex','data-page','data-action','data-setting','data-mode','data-challenge','data-nav'];

export function menuItems(scope, { gamepad = false } = {}) {
  return [...scope.querySelectorAll(selectable)].filter(element =>
    !element.hidden && !element.closest('[inert]') && element.tabIndex >= 0 &&
    (!gamepad || element.tagName !== 'INPUT' || ['range','checkbox','radio'].includes(element.type)) &&
    element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
}

export function rememberFocus(scope = document) {
  const element = document.activeElement;
  if (!element || !scope.contains(element) || !element.matches(selectable)) return null;
  const selector = element.id ? `#${CSS.escape(element.id)}` : focusAttributes
    .filter(name => element.hasAttribute(name))
    .map(name => `[${name}="${CSS.escape(element.getAttribute(name))}"]`).join('');
  return { element, selector };
}

export function restoreFocus(saved, scope = document) {
  if (!saved) return false;
  const element = saved.element.isConnected && scope.contains(saved.element)
    ? saved.element : saved.selector ? scope.querySelector(saved.selector) : null;
  if (!element || element.disabled || !element.getClientRects().length) return false;
  element.focus({ preventScroll: true });
  return document.activeElement === element;
}

export function moveMenuFocus(items, action) {
  if (!items.length) return false;
  const focused = document.activeElement, index = items.indexOf(focused);
  if (action === 'first' || action === 'last' || index < 0) {
    (action === 'last' ? items.at(-1) : items[0]).focus();
    return true;
  }
  const origin = focused.getBoundingClientRect();
  const x = origin.x + origin.width / 2, y = origin.y + origin.height / 2;
  const vertical = action === 'up' || action === 'down';
  const sign = action === 'up' || action === 'left' ? -1 : 1;
  const candidates = items.filter(element => element !== focused).map(element => {
    const box = element.getBoundingClientRect();
    const dx = box.x + box.width / 2 - x, dy = box.y + box.height / 2 - y;
    const ahead = (vertical ? dy : dx) * sign;
    return { element, ahead, score: ahead + Math.abs(vertical ? dx : dy) * 3 };
  }).filter(candidate => candidate.ahead > 3).sort((a, b) => a.score - b.score);
  (candidates[0]?.element || items[(index + (sign > 0 ? 1 : -1) + items.length) % items.length]).focus();
  return true;
}

/** Arrow keys move among cards. Native form controls keep their own key behavior. */
export function navigateKeyboardGroup(event) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;
  const action = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Home: 'first', End: 'last' }[event.key];
  if (!action || !event.target.matches('button')) return false;
  const group = event.target.closest('[data-menu-group]');
  if (!group) return false;
  event.preventDefault();
  return moveMenuFocus(menuItems(group), action);
}
