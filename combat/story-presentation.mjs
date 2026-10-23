import { FIGHTERS, getStage } from './data.mjs';
import { CombatRenderer, drawPortrait } from './render.mjs';
import { STORY_NOTICE, STORY_REFERENCE_NOTICE, STORY_REFERENCES, getStoryRoute } from './stories.mjs';

/** The reader is presentation only: it owns no profile, match or award state. */
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const fighter = id => FIGHTERS.find(item => item.id === id);
const layouts = new Set(['solo', 'duet', 'focus-left', 'focus-right', 'ensemble', 'wide', 'archive']);

export function createStoryPresentation(fighterId, kind = 'prologue', chapterIndex = 0) {
  const route = getStoryRoute(fighterId);
  if (!route || !['prologue', 'epilogue', 'chapter'].includes(kind)) return null;
  if (kind === 'chapter' && (!Number.isInteger(chapterIndex) || !route.chapters[chapterIndex])) return null;
  let panels;
  if (kind === 'chapter') {
    const chapter = route.chapters[chapterIndex];
    panels = [
      ...(chapterIndex === 0 ? route.prologue.map(item => ({ ...item, kind:'prologue' })) : []),
      { ...chapter, id:`${fighterId}-chapter-${chapterIndex + 1}`, kind:'chapter', composition:'duet', cast:[fighterId, chapter.opponentId], intro:chapterIndex === 0 ? route.intro : '' }
    ];
  } else panels = route[kind].map(item => ({ ...item, kind }));
  return Object.freeze({ fighterId, kind, chapterIndex, index:0, panels:Object.freeze(panels.map(item => Object.freeze({ ...item, cast:Object.freeze([...item.cast]) }))) });
}

/** Reading cannot pass either end or mutate the shared route data. */
export function stepStoryPresentation(reader, delta) {
  if (!reader || ![-1, 1].includes(delta)) return reader;
  const index = Math.max(0, Math.min(reader.panels.length - 1, reader.index + delta));
  return index === reader.index ? reader : Object.freeze({ ...reader, index });
}

export function skipStoryPresentation(reader) {
  if (!reader || reader.kind !== 'chapter') return null;
  return Object.freeze({ ...reader, index:reader.panels.length - 1 });
}

export function storyPresentationMarkup(reader, { leaveLabel = 'Retour à l’affiche' } = {}) {
  if (!reader) return '';
  const route = getStoryRoute(reader.fighterId), item = reader.panels[reader.index];
  const isChapter = item.kind === 'chapter', last = reader.index === reader.panels.length - 1;
  const heading = isChapter ? `Chapitre ${reader.chapterIndex + 1}/${route.chapters.length}` : item.kind === 'epilogue' ? 'Épilogue' : 'Prologue';
  const stage = getStage(item.stageId), layout = layouts.has(item.composition) ? item.composition : 'duet';
  const cast = item.cast.map(fighter).filter(Boolean);
  const referenceMarkup = route.referenceIds.map(id => STORY_REFERENCES[id]).filter(Boolean).map(source => `<li><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)} <span aria-hidden="true">↗</span></a></li>`).join('');
  return `<article class="story-page" data-story-kind="${item.kind}" data-story-id="${item.id}" aria-labelledby="modal-title">
    <header class="story-header"><div><span class="ticket-label">HISTOIRE · ${heading.toLocaleUpperCase('fr')}</span><p class="story-route-title">${escapeHTML(route.title)}</p></div><p class="story-counter" aria-live="polite">Tableau ${reader.index + 1}/${reader.panels.length}</p></header>
    <figure class="story-tableau"><div class="story-visual story-layout-${layout}" role="img" aria-label="${escapeHTML(`${stage.name} · ${cast.map(actor => actor.name).join(', ')}`)}" aria-busy="true"><canvas class="story-backdrop" width="1280" height="720" aria-hidden="true"></canvas><div class="story-cast">${cast.map((actor, index) => `<canvas class="story-actor story-actor-${index}" data-story-actor="${actor.id}" width="400" height="460" aria-hidden="true"></canvas>`).join('')}</div><span class="story-location">${escapeHTML(stage.name)}</span></div><figcaption>Tableau original d’Encore · ${escapeHTML(cast.map(actor => actor.name).join(' / '))}</figcaption></figure>
    <div class="story-copy"><h2 id="modal-title" tabindex="-1">${escapeHTML(item.title)}</h2>${item.intro ? `<p class="story-intro">${escapeHTML(item.intro)}</p>` : ''}<p class="result-copy story-narration">${escapeHTML(item.summary)}</p>
    ${item.dialogue.length ? `<div class="story-dialogue">${item.dialogue.map(line => `<blockquote><strong>${escapeHTML(line.speaker)}</strong><p>${escapeHTML(line.text)}</p></blockquote>`).join('')}</div>` : '<p class="story-silence">Tableau sans dialogue.</p>'}
    <p class="story-notice">${escapeHTML(STORY_NOTICE)} · Répliques originales, sans doublage.</p>
    <div class="story-actions"><button class="secondary" data-action="story-prev" ${reader.index === 0 ? 'disabled' : ''}>← Précédent</button>${isChapter ? '<button class="primary" data-action="story-start">ENTRER EN SCÈNE ↗</button>' : last ? '<button class="primary" data-action="story-done">Terminer la lecture ✓</button>' : '<button class="primary" data-action="story-next">Continuer →</button>'}${!isChapter ? `<button class="text-button" data-action="story-skip">${reader.kind === 'chapter' ? 'Passer le prologue' : 'Passer la lecture'}</button>` : ''}<button class="text-button" data-action="story-leave">${escapeHTML(leaveLabel)}</button></div>
    <p class="story-keyboard">← / → : changer de tableau · Échap : ${escapeHTML(leaveLabel.toLocaleLowerCase('fr'))}</p>
    <details class="fidelity-details story-references"><summary>Écriture originale et références</summary><div class="fidelity-copy"><p>${escapeHTML(STORY_REFERENCE_NOTICE)}</p><p>${escapeHTML(route.writingApproach)}</p><ul class="fidelity-sources">${referenceMarkup}</ul></div></details></div>
  </article>`;
}

/** Compose existing scenery and atlas portraits; no new bitmap art or ticker. */
export async function paintStoryPresentation(root, item) {
  const visual = root?.querySelector('.story-visual');
  if (!visual) return;
  let unavailable = false;
  try {
    new CombatRenderer(visual.querySelector('.story-backdrop')).render(null, { stage:getStage(item.stageId), reducedMotion:true });
    const results = await Promise.all([...visual.querySelectorAll('[data-story-actor]')].map(canvas => drawPortrait(canvas, fighter(canvas.dataset.storyActor), { glow:false })));
    unavailable = results.some(result => !result);
  } catch { unavailable = true; }
  if (!visual.isConnected) return;
  visual.setAttribute('aria-busy', 'false');
  if (unavailable) {
    const message = document.createElement('p');
    message.className = 'story-art-status'; message.setAttribute('role', 'status');
    message.textContent = 'Une illustration est indisponible. La scène reste lisible ci-dessous.';
    visual.after(message);
  }
}
