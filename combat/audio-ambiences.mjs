/**
 * Quiet original stage atmospheres. No episode recording, dialogue or score.
 * These textures describe the game's spaces; they are not canonical sound cues.
 * Each cycle is finite and uses at most four voices. There is no engine RNG.
 */
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const tone = (from, to, duration, delay, waveform = 'sine', level = .018) => ({
  kind: 'tone', from, to, duration, delay, waveform, level,
});
const air = (from, to, duration, delay, filter = 'lowpass', level = .025, q = .7) => ({
  kind: 'noise', from, to, duration, delay, filter, level, q,
});
const ambience = (id, title, description, periodSeconds, layers) => ({
  id, title, description, periodSeconds, layers,
  provenance: 'Ambiance procédurale originale Encore ; aucun enregistrement de la série.',
});
export const AUDIO_AMBIENCES = freeze({
  bigtop: ambience('bigtop', 'Toile et charpente', 'Un souffle sous la toile et un léger grincement de charpente.', 7.4, [
    air(340, 570, 1.9, 0, 'lowpass', .020), tone(116, 83, .38, 2.2, 'triangle', .014), air(720, 390, 1.3, 4.5, 'bandpass', .016, .6),
  ]),
  candy: ambience('candy', 'Air du canyon', 'Un souffle sec et deux petits éclats de confiserie.', 8.2, [
    air(1250, 540, 1.7, 0, 'bandpass', .018, .4), tone(1920, 1560, .11, 2.7, 'sine', .012), tone(1260, 1040, .15, 5.1, 'sine', .009),
  ]),
  manor: ambience('manor', 'Bois et courant d’air', 'Des craquements espacés au milieu d’un courant d’air grave.', 9.1, [
    tone(87, 53, .55, 0, 'triangle', .014), air(280, 160, 2.4, 1.8, 'lowpass', .025), tone(146, 77, .32, 5.6, 'triangle', .010),
  ]),
  spudsy: ambience('spudsy', 'Ventilation du comptoir', 'Ventilation, vibration basse et tintement métallique discret.', 6.8, [
    air(360, 340, 2.1, 0, 'lowpass', .022), tone(110, 110, 1.6, .1, 'sine', .011), tone(1740, 1680, .18, 3.8, 'sine', .009),
  ]),
  cellar: ambience('cellar', 'Souffle du cellier', 'Un souffle étouffé et des résonances numériques espacées.', 10.3, [
    air(180, 95, 2.2, 0, 'lowpass', .024), tone(72, 64, 1.1, 2.8, 'sine', .013), tone(630, 470, .22, 6.2, 'triangle', .008),
  ]),
  void: ambience('void', 'Résonance du Vide', 'Deux résonances très faibles traversent un souffle filtré.', 11.2, [
    air(1600, 2100, 2.4, 0, 'highpass', .006), tone(198, 196, 2.2, 1.4, 'sine', .009), tone(301, 297, 1.8, 5.8, 'sine', .007),
  ]),
  lake: ambience('lake', 'Rive numérique', 'Une vague filtrée et deux gouttes synthétiques ; création pour le décor CainOS.', 8.7, [
    air(420, 1050, 1.8, 0, 'bandpass', .023, .5), tone(1360, 590, .09, 2.8, 'sine', .013), tone(980, 460, .12, 4.3, 'sine', .010), air(970, 390, 1.5, 5.6, 'bandpass', .018, .5),
  ]),
  training: ambience('training', 'Repère de calibration', 'Deux impulsions douces et espacées pour la salle de répétition.', 6.4, [
    tone(520, 520, .075, 0, 'sine', .010), tone(780, 780, .06, .21, 'sine', .007),
  ]),
  gloink: ambience('gloink', 'Petites formes en mouvement', 'Trois chocs légers et irréguliers évoquent les formes du décor.', 7.9, [
    tone(330, 140, .10, 0, 'triangle', .019), tone(610, 270, .085, 1.4, 'triangle', .014), tone(450, 180, .12, 4.2, 'triangle', .016),
  ]),
  kingdom: ambience('kingdom', 'Échos de sucre', 'Air calme sous les arches et tintements espacés.', 9.7, [
    air(680, 430, 1.6, 0, 'bandpass', .014, .5), tone(1450, 1440, .27, 2.9, 'sine', .010), tone(2160, 2110, .20, 5.3, 'sine', .007),
  ]),
  grounds: ambience('grounds', 'Brise des terrains', 'Une brise de pelouse numérique et un léger bruit de toile.', 8.9, [
    air(520, 860, 2.3, 0, 'lowpass', .021), air(1400, 760, 1.1, 3.2, 'bandpass', .012, .4), tone(240, 175, .20, 5.8, 'triangle', .007),
  ]),
  backstage: ambience('backstage', 'Bois du couloir', 'Une porte travaille doucement, suivie de deux petits craquements.', 10.1, [
    tone(178, 98, .42, 0, 'triangle', .011), tone(260, 130, .09, 2.5, 'triangle', .012), air(480, 280, 1.3, 4.6, 'lowpass', .014), tone(330, 220, .07, 6.4, 'triangle', .008),
  ]),
});
export const AMBIENCE_STAGE_IDS = Object.freeze(Object.keys(AUDIO_AMBIENCES));
