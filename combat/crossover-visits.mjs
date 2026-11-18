/** Short Encore exhibitions. The world and the two costume IDs also drive the actual fight. */
export const CROSSOVER_VISITS = [
  {
    "world": "metarunner",
    "stage": "silicacity",
    "fighters": [
      "pomni",
      "zooble"
    ],
    "title": "Le dernier relais",
    "intro": "À Silica City, un immeuble disparaît du tableau des scores. Pomni branche son bras sur la dernière borne. Zooble défend la liaison de secours jusqu’au signal de départ.",
    "ending": "Les étages se rallument un à un. Sur le toit d’en face, une fenêtre répond en bleu. Zooble y branche la dernière pièce et laisse à Pomni le premier point."
  },
  {
    "world": "sunsetparadise",
    "stage": "portaurora",
    "fighters": [
      "gummigoo",
      "loolilalu"
    ],
    "title": "La régate des lanternes",
    "intro": "Les lanternes de la régate dérivent hors du port. Gummigoo retient la dernière amarre avec son chapeau. Loolilalu lance un défi sur le quai pour décider qui ouvrira la parade.",
    "ending": "Les lanternes entrent dans le port au coucher du soleil. Gummigoo récupère son chapeau sur la première bouée. Loolilalu y a épinglé la fleur du carnaval."
  },
  {
    "world": "murderdrones",
    "stage": "coppernine",
    "fighters": [
      "jax",
      "abstractedkaufmo"
    ],
    "title": "Le sas dans la neige",
    "intro": "Jax voit deux voyants violets dans la neige de Copper 9. Quand le sas se bloque, il en compte une douzaine. Kaufmo se découpe dans la lumière de secours.",
    "ending": "Du givre tombe des gonds et le sas s’ouvre enfin. Jax regarde la neige fondre sur ses gants. De l’autre côté de la vitre, les yeux de Kaufmo s’éteignent un à un dans la tempête."
  },
  {
    "world": "gaslightdistrict",
    "stage": "gaslightwharf",
    "fighters": [
      "baronmildenhall",
      "fudge"
    ],
    "title": "La cloche des marées",
    "intro": "La cloche du quai sonne alors que la marée descend. Le Baron suit la corde jusqu’au ponton. The Fudge s’y est emmêlé et défend sa place sous la seule lanterne encore allumée.",
    "ending": "La corde libérée retombe dans l’eau. Le Baron remet la lanterne d’aplomb. The Fudge se glisse sous le ponton au passage d’une barque et la cloche sonne une seule fois."
  },
  {
    "world": "knightsofguinevere",
    "stage": "parkplanet",
    "fighters": [
      "ragatha",
      "kinger"
    ],
    "title": "Le cheval sans cavalier",
    "intro": "Au-dessus des nuages, un cheval du carrousel tourne à vide. Ragatha veut réparer sa selle avant l’ouverture. Kinger tient la clé du manège et demande une répétition générale.",
    "ending": "À la première note, le cheval se met à monter et descendre. Ragatha range son aiguille. Kinger, dans la nacelle suivante, salue le public avec ses deux gants."
  },
  {
    "world": "gameoverse",
    "stage": "gameoverse",
    "fighters": [
      "gloinkqueen",
      "bubble"
    ],
    "title": "Le point de retour",
    "intro": "Un point de sauvegarde clignote au bord du vide. Bubble flotte au-dessus du socle. La Reine des Gloinks enroule ses deux extrémités autour de la plate-forme qui commence à se séparer.",
    "ending": "Le point de retour tient enfin en place. Les deux extrémités de la Reine se reflètent dans le cristal. Une petite bulle y laisse une trace ronde avant de repartir vers la planète."
  },
  {
    "world": "lackadaisy",
    "stage": "littledaisy",
    "fighters": [
      "gangle",
      "caine"
    ],
    "title": "Le dernier rappel",
    "intro": "Sous le Little Daisy Café, un étui à violon reste ouvert sur une chaise. Gangle prend la lumière dans son costume de scène. Caine attend la levée du rideau pour lui disputer le dernier rappel.",
    "ending": "Une dernière note traverse la salle vide. Gangle replie ses rubans près de l’étui. Caine laisse un œillet blanc sur le couvercle et éteint la rampe."
  },
  {
    "world": "smg4",
    "stage": "showgrounds",
    "fighters": [
      "caine",
      "jax"
    ],
    "title": "Une prise avant la nuit",
    "intro": "Sur le parvis du château, une seule bobine reste dans la caméra. Caine annonce une dernière prise. Jax vérifie les tapis de cascade et subtilise discrètement le clap.",
    "ending": "La grande roue s’allume sur la dernière image. Caine déroule un morceau de pellicule devant le ciel. Dans chaque photogramme, Jax tient le clap à l’envers."
  },
  {
    "world": "ultrajumpmania",
    "stage": "simpleflipisland",
    "fighters": [
      "pomni",
      "gummigoo"
    ],
    "title": "La noix du sommet",
    "intro": "Une noix de coco roule de plate-forme en plate-forme jusqu’au lagon. Pomni saute après elle. Gummigoo, qui connaît le courant, lui donne rendez-vous sur la dernière corniche.",
    "ending": "La noix se fend au sommet de l’île. Une jeune pousse se déplie dans la lumière. Pomni dépose une clochette près de la racine et Gummigoo repart sur son radeau."
  }
].map(visit => Object.freeze({ ...visit, fighters: Object.freeze(visit.fighters) }));

export function visitIllustration(world, scene) {
  return new URL(`../assets/encore/escales/${world}/${scene}.webp`, import.meta.url).href;
}

export function visitCostumes(visit) {
  return visit.fighters.map((fighter, side) => `glitch-${visit.world}-${fighter}-${side ? 'resident' : 'hommage'}`);
}
