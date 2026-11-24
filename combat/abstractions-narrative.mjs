import { ABSTRACTION_DEFS } from './abstractions-content.mjs';

const narration = text => ({ speakerId: 'narration', speaker: 'Narration', text });
const nameOf = (fighters, id) => fighters.find(fighter => fighter.id === id)?.name || id;

/** Narrated Encore simulations. No voice, recovered memory or cure is invented. */
export function buildAbstractionStory(def, index, fighters, legacyIds) {
  const rivalName = nameOf(fighters, def.rivalId);
  const pool = legacyIds.filter(id => id !== def.id && id !== def.rivalId);
  const used = new Set([def.id, def.rivalId]);
  const pick = start => {
    for (let step = 0; step < pool.length; step++) {
      const id = pool[(start + step) % pool.length];
      if (!used.has(id)) { used.add(id); return id; }
    }
    throw new Error('Insufficient opponents for abstraction story: ' + def.id);
  };
  const opponents = [pick(index + 2), pick(index * 3 + 5), def.rivalId, pick(index * 7 + 11)];
  const stageIds = [def.homeStage, 'cellar', 'memoryfracture', 'abstractionthreshold'];
  const stages = ['Le premier repère', 'La lumière du passage', 'Le vis-à-vis', 'La fermeture du tableau'];
  const chapters = opponents.map((opponentId, chapterIndex) => ({
    title: def.name + ' · ' + stages[chapterIndex],
    opponentId, stageId: stageIds[chapterIndex],
    summary: def.story.premise + ' Le ' + (chapterIndex + 1) + 'e passage met en scène ' + nameOf(fighters, opponentId) + ' pour ' + def.story.aim + '.',
    dialogue: [
      narration('La simulation de ' + def.name + ' occupe le repère ; ' + nameOf(fighters, opponentId) + ' garde une distance visible.'),
      narration(chapterIndex === 3 ? def.story.ending : 'La scène progresse sans parole attribuée à la forme abstraite. Les effets et les règles de combat appartiennent à Encore.'),
    ],
  }));
  const prologue = [
    { title: 'La forme de la simulation', stageId: def.homeStage, composition: 'archive', cast: [def.id], summary: def.story.premise,
      dialogue: [narration(def.story.premise)] },
    { title: 'Des repères avant le duel', stageId: 'cellar', composition: 'focus-left', cast: [def.id, def.rivalId],
      summary: 'Quatre repères sont disposés pour ' + def.story.aim + '. ' + rivalName + ' demeure à l’extérieur de la zone.',
      dialogue: [narration('Le programme présente un exercice de placement. Il ne cherche ni souvenir caché ni origine supplémentaire à la silhouette.')] },
    { title: 'Une entrée sans voix', stageId: 'abstractionthreshold', composition: 'wide', cast: [def.id],
      summary: 'Le seuil s’ouvre sur le premier passage de ' + def.name + '. La route restera racontée par la narration.',
      dialogue: [narration('Les projecteurs fixent les limites de la piste. Aucun dialogue nouveau n’est attribué à la forme abstraite.')] },
  ];
  const epilogue = [
    { title: 'La dernière marque', stageId: 'memoryfracture', composition: 'focus-right', cast: [def.id, def.rivalId],
      summary: def.story.ending, dialogue: [narration(def.story.ending)] },
    { title: 'La distance conservée', stageId: 'cellar', composition: 'duet', cast: [def.id, def.rivalId],
      summary: rivalName + ' retrouve le passage libre tandis que la reconstruction de ' + def.name + ' reste dans son tableau.',
      dialogue: [narration('Le résultat du match ne guérit personne, ne rétablit aucune ancienne apparence et ne modifie pas l’histoire officielle.')] },
    { title: 'Le tableau se referme', stageId: 'abstractionthreshold', composition: 'archive', cast: [def.id],
      summary: 'Le programme ferme la scène de ' + def.title.toLowerCase() + '. Les silhouettes et les archives conservent leurs identités distinctes.',
      dialogue: [narration('La fin de ce parcours appartient au fan-game Encore. Elle ne promet ni sortie du cirque, ni retour, ni événement canonique.')] },
  ];
  for (const [kind, panels] of Object.entries({ prologue, epilogue })) {
    panels.forEach((panel, panelIndex) => { panel.id = def.id + '-' + kind + '-' + (panelIndex + 1); panel.kind = kind; });
  }
  return {
    fighterId: def.id, title: def.title + ' — ' + def.name, intro: def.story.premise,
    chapters, ending: def.story.ending, prologue, epilogue, sourceKind: def.sourceKind,
    referenceIds: def.sourceKind === 'original-encore' ? [] : def.sourceIds.includes('ep3') ? ['manor'] : def.sourceIds.includes('ep1') ? ['pilot'] : ['series'],
    writingApproach: 'Scénario original d’Encore entièrement narré. Identité ' + (def.sourceKind === 'official-identity' ? 'officielle, illustrations de combat adaptées' : def.sourceKind === 'archive-attribution' ? 'attribuée par les archives et à confirmer sur des plans primaires' : 'et design inventés pour le fan-game') + '. Aucun dialogue de la forme abstraite, aucune guérison et aucun retour canonique ne sont revendiqués.',
  };
}

export function buildAbstractionTournament(def, fighters) {
  const rival = nameOf(fighters, def.rivalId);
  return {
    rivalId: def.rivalId, wins: 3,
    intro: {
      title: 'Le tableau de ' + def.name,
      summary: def.story.premise + ' Le tirage à huit place ' + rival + ' dans la moitié opposée.',
      dialogue: [
        narration('La simulation de ' + def.name + ' traverse trois duels pour ' + def.story.aim + '.'),
        narration(rival + ' marque l’autre moitié du tableau. Les silhouettes abstraites restent silencieuses.'),
        narration('La coupe est un accessoire du spectacle. Elle ne guérit pas une abstraction et ne promet pas de sortie.'),
      ],
    },
    endingTitle: 'La coupe reste un accessoire',
    ending: def.story.ending + ' La coupe demeure au bord de la piste, près du repère de ' + rival + '.',
    prize: 'Une coupe de scène, sans guérison, réversion ni nouvel événement canonique.',
  };
}

export const ABSTRACTION_FINALE_WORK = 'Composition procédurale : les décors peints propres à ces nouvelles finales et les cycles animés image par image restent à produire. Aucune finale ni fidélité canonique 1:1 n’est revendiquée.';
export function buildAbstractionFinales(def) {
  const performer = {
    motif: 'glitch', sourceIds: [...def.sourceIds], sourceKind: def.sourceKind,
    adaptation: 'Les cadres sombres et motifs d’yeux sont des accessoires de présentation de ' + def.name + '. Ils ne changent ni le résultat, ni les collisions, ni l’état abstrait et n’ajoutent aucune voix ou guérison.',
    remainingArtWork: ABSTRACTION_FINALE_WORK,
  };
  const labels = [['impact', 'Le contour stabilisé'], ['special', 'Les regards au repos'], ['super', 'La fermeture du seuil']];
  const rows = labels.map(([variant, label]) => [def.id, variant, def.name + ' · ' + label, [
    ['Le signal du résultat', 'Des panneaux sombres et des repères d’yeux se composent derrière ' + def.name + ', sans remplacer son illustration.'],
    ['La distance reste visible', 'Les contours se stabilisent autour de la piste et laissent le rival déjà vaincu entièrement visible.'],
    ['Le tableau demeure muet', def.story.ending],
  ]]);
  return { performer, rows };
}

export function abstractionFriendship(fighterId) {
  const def = ABSTRACTION_DEFS.find(item => item.id === fighterId);
  if (!def) return null;
  return {
    title: 'Le passage libre de ' + def.name,
    beats: [
      ['Les limites du tableau', 'La scène de ' + def.name + ' ralentit ses motifs et laisse un passage visible au rival.'],
      ['Une distance partagée', 'Les deux silhouettes restent à distance. Aucun contact, parole ou geste humain n’est inventé pour la forme abstraite.'],
      ['La trêve de la simulation', 'Le rideau referme cette pause de fan-game. La silhouette reste abstraite et personne n’est abandonné au sol.'],
    ],
    adaptation: 'Trêve de présentation originale pour Encore, entièrement non verbale. Elle n’atteste ni amitié canonique, ni guérison, ni réversion de ' + def.name + '.',
  };
}

