/** Nine full scenic paintings, with references and native pixels recorded in
 * docs/art-generation/completion-20261127/stages/. Camera recomposition is an
 * Encore adaptation; source stills do not certify a complete canonical map.
 */
const source = {
  bigtop: ['glitch-cast', 'https://static.wixstatic.com/media/84ed6a_e3bac825d5c140a4a665ba898b3ff51b~mv2.png'],
  candy: ['glitch-canyon-storyboards-20261127', 'https://www.youtube.com/watch?v=4ofJpOEXrZs&t=420'],
  manor: ['glitch-manor-storyboards-20261127', 'https://www.youtube.com/watch?v=bKjfw77cxeQ&t=180'],
  cellar: ['glitch-cellar', 'https://static.wixstatic.com/media/84ed6a_de54a5d816fe4ba0966cc96385ab8f8b~mv2.jpg'],
  void: ['glitch-void', 'https://static.wixstatic.com/media/84ed6a_9f2c0f92fcc340fea405c155a304e362~mv2.png'],
  lake: ['glitch-pilot-locations-20261127', 'https://www.youtube.com/watch?v=HwAPLk_sQ3w&t=230'],
  gloink: ['glitch-pilot-locations-20261127', 'https://www.youtube.com/watch?v=HwAPLk_sQ3w&t=990'],
  grounds: ['glitch-pilot-locations-20261127', 'https://www.youtube.com/watch?v=HwAPLk_sQ3w&t=230'],
  backstage: ['glitch-pilot-locations-20261127', 'https://www.youtube.com/watch?v=HwAPLk_sQ3w&t=740'],
};
export const COMPLETED_STAGE_SCENES = Object.freeze(Object.fromEntries(
  Object.entries(source).map(([id, [sourceId, sourceUrl]]) => [id, Object.freeze({
    path: `../assets/encore/stages/${id}/scene-20261127.png`, sourceId, sourceUrl,
  })]),
));
