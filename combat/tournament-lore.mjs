/**
 * Original Encore fan-fiction for "La coupe du cirque".
 * The cup is a show prize, never a promise to leave the circus. Kaufmo's
 * abstraction and the Baron's archive silhouette remain mute: no new voice,
 * memory, return or canonical event is invented for them.
 */
import { STORY_RIVALS } from './stories.mjs';
import { FIGHTERS } from './data.mjs';
import { EXPANSION_DEFS } from './roster-expansion.mjs';
import { ABSTRACTION_DEFS } from './abstractions-content.mjs';
import { buildAbstractionTournament } from './abstractions-narrative.mjs';

export const TOURNAMENT_SIZE = 8;
export const TOURNAMENT_WINS = 3;
export const TOURNAMENT_NOTICE = 'Tournoi original pour Encore · huit artistes, trois duels joués. La coupe récompense un rôle dans le spectacle ; elle ne promet aucune sortie du cirque.';

export const TOURNAMENT_RIVALS = STORY_RIVALS;

const say = (speakerId, speaker, text) => ({ speakerId, speaker, text });
const entry = (rivalId, title, summary, dialogue, endingTitle, ending, prize) => ({
  rivalId, wins: TOURNAMENT_WINS,
  intro: { title, summary, dialogue },
  endingTitle, ending, prize,
});

const lore = {
  pomni: entry('jax', 'La porte du haut', 'Caine suspend une « loge du haut » au-dessus de l’arène. Le tableau place Jax dans l’autre moitié : la finale passe par lui.', [
    say('caine', 'Caine', 'La coupe du cirque ! Trois duels, une loge privée et un tirage parfaitement équitable !'),
    say('jax', 'Jax', 'Une loge, c’est une porte avec plus de poussière et moins de sortie.'),
    say('pomni', 'Pomni', 'Alors je vais aller vérifier ce qu’il y a derrière. Et cette fois, je monte les marches moi-même.')
  ], 'La clef de la loge', 'Pomni ouvre la loge du haut avec la clef du prix. La pièce est petite, calme, et donne sur le chapiteau. Elle laisse la porte entrouverte pour les autres et garde la clef : ce n’est pas une sortie, mais c’est une pièce où elle peut décider qui entre.', 'Une loge privée, sans serrure extérieure.'),
  jax: entry('zooble', 'Le programme du vainqueur', 'Le prix annoncé est le droit de composer l’ordre du prochain spectacle. Jax voit déjà son nom partout ; Zooble est placée dans l’autre moitié du tableau.', [
    say('caine', 'Caine', 'Le vainqueur choisira l’ordre des numéros ! Plus aucun artiste ne pourra se plaindre du programme !'),
    say('jax', 'Jax', 'Enfin un rôle où je peux placer mon numéro avant tout le monde.'),
    say('zooble', 'Zooble', 'Tu devras surtout le terminer devant tout le monde.')
  ], 'Le dernier numéro', 'Jax gagne le programme et inscrit son propre gag en dernier, après les autres. Il prétend que c’était pour mieux les entendre échouer. Gangle rit avant lui, et il range les fiches sans rien dire.', 'L’ordre du prochain spectacle — et l’obligation de le terminer.'),
  ragatha: entry('pomni', 'La pause officielle', 'Caine promet au vainqueur une pause inscrite au programme. Ragatha accepte de jouer, à condition de ne pas transformer la coupe en nouvelle corvée.', [
    say('caine', 'Caine', 'Une pause officielle, chronométrée et applaudie ! Le public adore les gens qui s’arrêtent !'),
    say('pomni', 'Pomni', 'Tu n’es pas obligée de tout porter pour arriver jusqu’ici.'),
    say('ragatha', 'Ragatha', 'Je vais essayer de gagner sans oublier de m’arrêter à la fin.')
  ], 'Vingt minutes sans fiche', 'Ragatha remporte la coupe et s’assoit sur les marches du décor avec les autres. Caine prépare une nouvelle tâche ; elle montre la pause inscrite au programme. Le chapiteau continue sans elle pendant vingt minutes entières.', 'Une pause de vingt minutes, une fois par représentation.'),
  gangle: entry('jax', 'L’affiche à son nom', 'La coupe promet une affiche peinte pour le vainqueur. Jax explique déjà comment la rendre plus drôle ; Gangle préfère dessiner la sienne.', [
    say('caine', 'Caine', 'Une affiche immense ! Des lettres dorées ! Un sous-titre que personne n’aura validé !'),
    say('jax', 'Jax', 'Une affiche, c’est mieux quand les gens peuvent la lire sans se moquer.'),
    say('gangle', 'Gangle', 'Alors je vais écrire la mienne. Et je garderai les ratures visibles.')
  ], 'L’affiche avec les ratures', 'Gangle gagne et accroche son affiche sans effacer les traits de crayon. Jax cherche une remarque, puis reconnaît que le mouvement se lit de loin. Le sous-titre reste celui qu’elle a choisi.', 'Une affiche peinte par l’artiste, ratures comprises.'),
  zooble: entry('jax', 'Le costume sur mesure', 'Le prix est un costume conçu par Caine. Zooble veut vérifier qui choisit les pièces avant de monter sur scène.', [
    say('caine', 'Caine', 'Un costume sur mesure ! Avec assez de manches pour tout le monde !'),
    say('jax', 'Jax', 'Et assez de poches pour y cacher les affaires des autres.'),
    say('zooble', 'Zooble', 'Je préfère choisir moi-même les coutures. Et pouvoir changer d’avis après le premier essayage.')
  ], 'Le droit de refus', 'Zooble gagne et demande un droit de refus écrit sur la fiche du costume. Caine ajoute la clause en petits caractères. Zooble porte la tenue du jour, puis en change une pièce avant le salut, simplement parce que c’est encore possible.', 'Un costume modifiable, avec droit de refus.'),
  kinger: entry('pomni', 'Le projecteur personnel', 'Caine offre un projecteur qui suit le vainqueur partout. Kinger se demande surtout s’il pourra l’éteindre.', [
    say('caine', 'Caine', 'Un projecteur personnel ! Impossible de se perdre dans le noir !'),
    say('pomni', 'Pomni', 'Tu n’as pas besoin de le garder allumé tout le temps.'),
    say('kinger', 'Kinger', 'Je vais essayer de me rappeler où est l’interrupteur. Et de laisser la lumière aux autres quand ils en ont besoin.')
  ], 'La veilleuse du chapiteau', 'Kinger gagne et dirige le projecteur vers l’entrée des couloirs plutôt que vers lui. Il le laisse allumé pour ceux qui cherchent leur chemin, puis s’installe près de son fort de coussins. Personne ne lui demande d’éteindre.', 'Un projecteur personnel, réglable et partageable.'),
  caine: entry('jax', 'Le numéro du maître de piste', 'Caine s’inscrit lui-même au tournoi pour prouver qu’il peut gagner son propre programme. Le prix : animer le prochain numéro sans interrompre les artistes.', [
    say('caine', 'Caine', 'Le vainqueur animera le prochain numéro ! Avec une écoute exceptionnellement prolongée !'),
    say('jax', 'Jax', 'Enfin un rôle où tu devras attendre la fin des phrases.'),
    say('caine', 'Caine', 'Je vais écouter au moins la première. Peut-être la deuxième si elle est courte !')
  ], 'La trompette posée', 'Caine remporte sa propre coupe et commence le numéro suivant en laissant sa trompette sur le pupitre. Il écoute trois phrases entières avant d’annoncer quoi que ce soit. Les artistes en profitent pour finir leurs saluts.', 'Animer un numéro en écoutant chaque réponse.'),
  bubble: entry('zooble', 'Le chariot neuf', 'Le prix est un chariot de service flambant neuf. Zooble rappelle la seule règle qui compte : demander avant de déplacer.', [
    say('caine', 'Caine', 'Un chariot neuf ! Assez grand pour ranger tout ce qui traîne sur la scène !'),
    say('zooble', 'Zooble', 'Demande avant de le remplir. Et ne range personne dedans.'),
    say('bubble', 'Bubble', 'Je vais demander ! À qui ? Et est-ce que la question peut être très courte ?')
  ], 'Une étiquette sur le chariot', 'Bubble gagne le chariot et colle une étiquette : « demander d’abord ». Il la lit à voix haute avant chaque déplacement. Le spectacle commence avec tous les accessoires encore à leur place, et Bubble trouve cela très reposant.', 'Un chariot neuf avec une étiquette de demande.'),
  gummigoo: entry('fudge', 'La carte officielle', 'Caine remet au vainqueur une carte du cirque, avec les coulisses et les décors. Fudge espère y trouver le buffet ; Gummigoo veut surtout y voir le chemin du retour.', [
    say('caine', 'Caine', 'Une carte officielle ! Tous les décors, toutes les entrées, et un itinéraire secret vers le buffet !'),
    say('fudge', 'Fudge', 'Le buffet est la seule destination qui mérite un itinéraire secret.'),
    say('gummigoo', 'Gummigoo', 'Cette carte indiquera aussi le retour. Un trajet sans retour, ce n’est pas une carte, c’est une promesse en l’air.')
  ], 'La route du retour', 'Gummigoo gagne et complète la carte avec les chemins de retour et une place à côté de chaque chariot. Fudge obtient son itinéraire vers le buffet, à condition de laisser les autres arriver avant de servir.', 'Une carte du cirque avec les retours indiqués.'),
  loolilalu: entry('gloinkqueen', 'La réception du vainqueur', 'Le prix est une réception donnée en l’honneur du champion. La Gloink Queen compte déjà les assiettes ; Loolilalu compte les chaises.', [
    say('caine', 'Caine', 'Une réception officielle ! Avec un gâteau, des discours et une file d’attente très décorative !'),
    say('gloinkqueen', 'Gloink Queen', 'Le nid viendra avec ses assiettes. Et peut-être avec celles des autres.'),
    say('loolilalu', 'Loolilalu', 'Alors prévoyez une chaise de plus. Une réception ne se ferme pas après le premier invité.')
  ], 'La chaise de plus', 'Loolilalu gagne et garde une chaise libre au bout de la table. Les Gloinks repartent avec les miettes, pas avec la vaisselle. Quand Jax arrive en retard, il trouve encore une place et un dessert intact.', 'Une réception avec une chaise toujours libre.'),
  gloinkqueen: entry('zooble', 'Le coffre du nid', 'Caine offre un coffre de trophée que les Gloinks convoitent déjà. Zooble vérifie qu’il ne contient ni accessoire essentiel ni personne.', [
    say('caine', 'Caine', 'Un coffre de vainqueur ! Détachable ! Remplaçable ! Légèrement plus grand que prévu !'),
    say('zooble', 'Zooble', 'Pas avec des gens dedans. Et pas avec les attaches du décor.'),
    say('gloinkqueen', 'Gloink Queen', 'Le nid sait reconnaître une pièce qui refuse. Il prendra ce qui est laissé.')
  ], 'Le coffre des chutes', 'La reine gagne et fait remplir le coffre avec les chutes abandonnées pendant les répétitions. Les attaches des décors restent en place. Pour une fois, le trésor du nid est composé de choses que personne ne cherchait.', 'Un coffre de trophée rempli des chutes du spectacle.'),
  fudge: entry('loolilalu', 'Le banquet du vainqueur', 'Caine promet un banquet dont le champion choisit le menu. Fudge entend « banquet » ; Loolilalu entend « choix » et rappelle les places des autres invités.', [
    say('caine', 'Caine', 'Le banquet du vainqueur ! Un menu illimité ! Enfin, dans la limite de ce qui reste après le service !'),
    say('loolilalu', 'Loolilalu', 'Une place réservée, pas toute la table. Les autres invités doivent encore pouvoir manger.'),
    say('fudge', 'Fudge', 'Je vais essayer de laisser un dessert aux autres. Par curiosité.')
  ], 'Le dessert laissé', 'Fudge gagne et compose un menu à sa taille. Il laisse un dessert entier de côté, puis surveille la table pour vérifier que quelqu’un le prend. Le chariot repart avant qu’il ne change d’avis, ce qui est déjà une forme de politesse.', 'Un banquet à sa mesure, avec une part laissée aux autres.'),
  abstractedkaufmo: entry('ragatha', 'L’écho et la coupe', 'Encore propose un tournoi autour de la construction d’archive de Kaufmo. Ragatha rappelle qu’il ne s’agit ni d’un retour ni d’une guérison.', [
    say('caine', 'Caine', 'Le tournoi de l’écho ! La coupe restera dans l’arène, avec les artistes qui l’ont traversée !'),
    say('ragatha', 'Ragatha', 'On garde nos distances. Personne ne joue cette scène seul.'),
    say('narration', 'Narration', 'La construction abstraite avance sans parole. Les artistes suivent les repères de lumière jusqu’au dernier passage.')
  ], 'La coupe laissée aux artistes', 'La construction d’archive s’arrête à la limite de l’arène. Ragatha reçoit la coupe au nom des artistes qui ont maintenu le passage ouvert. Aucune voix nouvelle, aucun retour et aucune révélation ne sont ajoutés à l’histoire de Kaufmo.', 'La coupe reste exposée avec les repères de la répétition.'),
  baronmildenhall: entry('kinger', 'Le trophée de la visite', 'Encore organise un tournoi dans le manoir d’archive. La silhouette du Baron reste muette ; Kinger veille à ce que la visite garde une sortie visible.', [
    say('caine', 'Caine', 'Un trophée pour la meilleure visite du manoir ! Tous les couloirs sont ouverts, même ceux qui ne devraient pas !'),
    say('kinger', 'Kinger', 'On peut gagner sans réveiller le manoir. Et sans perdre la sortie.'),
    say('narration', 'Narration', 'La silhouette d’archive marque le dernier passage. Le cadre reste silencieux.')
  ], 'La sortie indiquée', 'Kinger remporte la coupe et la pose près du panneau de sortie, pas dans le salon d’archive. Les visiteurs repartent par le chemin indiqué. Le Baron demeure une figure de décor, sans nouvelle réplique ni nouvelle fin.', 'Un trophée posé près de la sortie de la visite.')
};

const nameOf = id => FIGHTERS.find(fighter => fighter.id === id)?.name || id;
const mute = new Set(['abstractedkaufmo', 'baronmildenhall', 'kaufmo']);
for (const def of EXPANSION_DEFS) {
  const rivalName = nameOf(def.rivalId);
  const rivalLine = mute.has(def.rivalId)
    ? say('narration', 'Narration', `${rivalName} reste une figure silencieuse du tableau ; aucun dialogue ne lui est attribué.`)
    : say(def.rivalId, rivalName, `La coupe passera par moi, ${def.name}. Le tableau n’a pas prévu d’autre finale.`);
  const playerLine = mute.has(def.id)
    ? say('narration', 'Narration', `${def.name} marque le passage sans réplique. Le parcours reste une scène d’Encore.`)
    : say(def.id, def.name, `Alors je vais jouer mes trois duels. Et je verrai ce que la coupe contient vraiment.`);
  lore[def.id] = entry(def.rivalId, `La coupe de ${def.name}`,
    `Caine inscrit ${def.name} au tableau à huit. Son rival ${rivalName} est placé dans l’autre moitié ; la finale ne peut passer que par lui.`,
    [say('caine', 'Caine', `La coupe du cirque accueille ${def.name} ! Trois duels, un tableau et un prix qui reste dans le chapiteau !`), rivalLine, playerLine],
    `${def.name} et la coupe`,
    `${def.name} remporte trois duels et soulève la coupe. Le prix est un rôle dans le prochain spectacle, pas une sortie : ${def.title.toLowerCase()} devient un numéro à part entière, avec ${rivalName} dans le public.`,
    `Un rôle de ${def.role.toLowerCase()} dans le prochain spectacle.`);
}
for (const def of ABSTRACTION_DEFS) lore[def.id] = buildAbstractionTournament(def, FIGHTERS);
const freeze = value => {
  if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); }
  return value;
};

export const TOURNAMENT_LORE = freeze(lore);

export function getTournamentRival(playerId) {
  return typeof playerId === 'string' && Object.hasOwn(TOURNAMENT_RIVALS, playerId) ? TOURNAMENT_RIVALS[playerId] : null;
}

export function getTournamentLore(playerId) {
  return typeof playerId === 'string' && Object.hasOwn(TOURNAMENT_LORE, playerId) ? TOURNAMENT_LORE[playerId] : null;
}
