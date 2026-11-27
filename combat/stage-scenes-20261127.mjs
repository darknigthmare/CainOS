/**
 * Reference-based full scenery reconstructions. These are static background
 * paintings, not three independently generated parallax layers. The historical
 * planes remain available as fallback when a new file is not in the art pack.
 */
import { COMPLETED_STAGE_SCENES } from './stage-scenes-completion-20261127.mjs';
export const REBUILT_STAGE_SCENES = Object.freeze({
  falseexit: Object.freeze({
    path: '../assets/encore/stages/falseexit/scene-20261127.png',
    sourceId: 'glitch-gallery-office-exit',
    sourceUrl: 'https://static.wixstatic.com/media/84ed6a_3fb3c4ec9e8947e5a659c4cf10657ecc~mv2.png',
  }),
  undermap: Object.freeze({
    path: '../assets/encore/stages/undermap/scene-20261127.png',
    sourceId: 'glitch-undermap',
    sourceUrl: 'https://static.wixstatic.com/media/84ed6a_0558e3b65a3146b5b04b7828da5b4d0e~mv2.png',
    // Measured wall/floor intersection in the native 1672 x 941 painting.
    // Place it behind the actors' fixed y=568 standing line, without stretching.
    groundAnchor: Object.freeze({ sourceFraction: 768 / 941, targetY: 520 }),
  }),
  kingdom: Object.freeze({
    path: '../assets/encore/stages/kingdom/scene-20261127.png',
    sourceId: 'glitch-candy-court',
    sourceUrl: 'https://static.wixstatic.com/media/84ed6a_bd08976f81644a659cbc9a8e112fb5dc~mv2.png',
  }),
  spudsy: Object.freeze({
    path: '../assets/encore/stages/spudsy/scene-20261127.png',
    sourceId: 'glitch-spudsy-episode4',
    sourceUrl: 'https://www.youtube.com/watch?v=Q9KWcWKo2T8',
  }),
  ...COMPLETED_STAGE_SCENES,
});
