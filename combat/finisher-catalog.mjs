/**
 * Original Encore stage finales after a resolved match. The descriptions match
 * the procedural props in render-finishers.mjs; character art uses existing poses.
 * References identify comparison material, not canonical fighting powers.
 */
const deepFreeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;};
export const FINISHER_CATALOG_VERSION='encore-finisher-catalog-1';
export const FINISHER_VARIANTS=deepFreeze(['impact','special','super']);
export const FINISHER_NOTICE='Finales de spectacle créées pour Encore. Les motifs évoquent les personnages ; ils ne prouvent ni une scène ni un pouvoir canonique.';
const durations={impact:180,special:210,super:240};
const remainingArtWork='Dessins dédiés aux poses et accessoires, puis comparaison avec des plans primaires. Les illustrations et poses existantes sont conservées ; aucune animation 1:1 dessinée image par image n’est revendiquée.';
const performers={
  pomni:{motif:'exit',sourceIds:['ep1','glitch-cast','glitch-void','temmer-interview'],adaptation:'Les portes sont des accessoires de scène. Elles ne téléportent pas Pomni et ne lui permettent pas de quitter le cirque.'},
  jax:{motif:'trick',sourceIds:['ep1','glitch-cast','glitch-candy-court','temmer-interview'],adaptation:'Les clefs, cartes et rideaux sont une farce graphique originale. Ils ne prouvent aucun pouvoir magique ; le sourire utilise le dessin existant.'},
  ragatha:{motif:'stitch',sourceIds:['ep1','glitch-cast','temmer-interview'],adaptation:'Les coutures, fils et pièces de tissu décorent la scène. Ils ne réparent ni ne soignent les personnages ; le costume et son œil bouton restent intacts.'},
  gangle:{motif:'ribbon',sourceIds:['ep1','ep4','glitch-cast','temmer-interview'],adaptation:'Les rubans graphiques appartiennent au décor. Ils ne ligotent pas le rival et ne cassent ni ne remplacent le masque du costume choisi.'},
  zooble:{motif:'geometry',sourceIds:['ep1','glitch-cast'],adaptation:'Les formes géométriques sont des accessoires de scène. Aucune pièce du corps de Zooble n’est remplacée ou allongée.'},
  kinger:{motif:'chess',sourceIds:['ep1','ep3','glitch-cast'],adaptation:'Coussins, damier et couronne constituent un décor original. Ils ne téléportent personne, ne transforment pas le rival et n’invoquent pas d’armée.'},
  caine:{motif:'curtain',sourceIds:['ep1','glitch','glitch-cast'],adaptation:'Le rappel prolonge son rôle de maître de cérémonie par une composition originale. Il ne change pas réellement d’arène et ne supprime pas le rival.'},
  bubble:{motif:'bubble',sourceIds:['ep1'],adaptation:'Les anneaux et bulles sont des accessoires transparents. Ils ne sont pas des projectiles ; Bubble conserve son illustration et son alpha, sans éclatement imposé.'},
  gummigoo:{motif:'convoy',sourceIds:['ep2','glitch-undermap'],adaptation:'Les repères de route évoquent le convoi dans une scène originale. Ils n’invoquent pas de camion et ne réécrivent pas le destin du personnage.'},
  loolilalu:{motif:'crown',sourceIds:['ep2','glitch-candy-court'],adaptation:'Les couronnes et arches sont des accessoires de décor, pas de nouveaux éléments du costume ni un pouvoir de magie du sucre.'},
  gloinkqueen:{motif:'gloink',sourceIds:['ep1'],adaptation:'Les formes de Gloinks décorent la scène sans transformer le perdant ni démontrer une création de créatures. L’échelle reste celle du duel.'},
  fudge:{motif:'fudge',sourceIds:['ep2'],adaptation:'La matière chocolatée est une bordure de présentation. Elle ne crée aucun piège, dégât, ralentissement ou engloutissement après le match.'},
  abstractedkaufmo:{motif:'glitch',sourceIds:['ep1'],adaptation:'Les barres et panneaux sombres constituent une composition graphique sans stroboscope. Kaufmo reste abstrait, sans copie combattante, voix ni guérison ajoutée.'},
  baronmildenhall:{motif:'portrait',sourceIds:['ep3'],adaptation:'Les cadres et bougies évoquent le manoir par une scénographie originale. Ils n’ajoutent aucune arme, voix ou disparition canonique.'},
};
const rows=[
  ['pomni','impact','Encore debout',[
    ['Un pas de trop','Une porte portant EXIT et une flèche au sol se dévoilent derrière le tableau.'],
    ['Est-ce terminé ?','Le panneau reste un accessoire fermé ; la composition laisse Pomni entièrement visible.'],
    ['Reprendre son souffle','La porte et la flèche se stabilisent tandis que la pose de résultat existante conclut la scène.']]],
  ['pomni','special','La porte en carton',[
    ['Un nouveau panneau','Quatre encadrements de sortie emboîtés composent une perspective au fond de la piste.'],
    ['L’essai prudent','Les panneaux deviennent plus lisibles avec la lumière ; aucun passage ne change le lieu du duel.'],
    ['Rien derrière','La perspective reste figée autour de Pomni et du rival déjà vaincu.']]],
  ['pomni','super','Le rideau se referme',[
    ['La dernière ouverture','Deux portes EXIT, une ligne de parcours et des rideaux se dévoilent sur les côtés.'],
    ['Attendre le signal','Le parcours relie les deux panneaux derrière les silhouettes, sans déplacer le moteur de combat.'],
    ['Encore ici','Le rideau et les portes restent posés ; le tableau conserve les deux personnages dans l’arène.']]],
  ['jax','impact','La révérence de trop',[
    ['Il prend son temps','Une grande clef dorée et un petit socle composent l’accessoire de fin de numéro.'],
    ['Le public imaginaire','La clef demeure derrière la pose de résultat ; le sourire vient de l’illustration existante.'],
    ['Merci, vraiment','Le tableau se fixe autour de Jax, de la clef et du socle.']]],
  ['jax','special','La clef du numéro',[
    ['Un détail qui brille','Trois cartes inclinées et une petite clef se dévoilent au fond de la scène.'],
    ['Le mauvais indice','Les figures des cartes gardent des couleurs distinctes ; aucune carte n’est lancée sur le rival.'],
    ['Gardez-la','Les cartes et la clef restent en place pendant le dernier temps du numéro.']]],
  ['jax','super','C’était la blague',[
    ['La préparation','Des rideaux violets encadrent deux clefs dorées, au-dessus d’une bordure en damier.'],
    ['Le temps de comprendre','La scène gagne en clarté autour des clefs ; le centre reste réservé aux personnages.'],
    ['Le rappel moqueur','Le damier et les rideaux se stabilisent avec la pose finale existante de Jax.']]],
  ['ragatha','impact','On se relève',[
    ['Retrouver l’appui','Un large cadre cousu se dévoile derrière Ragatha et le rival.'],
    ['Vérifier la piste','Les points de couture deviennent visibles sur les quatre côtés du cadre.'],
    ['Toujours présente','Le cadre de tissu se pose autour des illustrations conservées.']]],
  ['ragatha','special','Un point après l’autre',[
    ['Le fil du numéro','Cinq fils de couleurs différentes traversent le décor, avec une pièce de tissu en bas.'],
    ['Raccorder les bords','Les fils forment des courbes derrière les silhouettes sans recoudre un personnage.'],
    ['Un salut discret','La pièce rapportée et les cinq fils restent visibles dans le tableau final.']]],
  ['ragatha','super','Le dernier raccord',[
    ['Les pièces du décor','Une bande de patchwork apparaît en haut, accompagnée de deux larges fils latéraux.'],
    ['Tenir ensemble','Les couleurs et coutures de la bordure se révèlent autour de Ragatha.'],
    ['Le spectacle tient','Le patchwork et les fils encadrent la pose de résultat sans modifier sa tenue.']]],
  ['gangle','impact','Une place sous la lumière',[
    ['Le bord du projecteur','Deux grands rubans rouges se dévoilent en haut et en bas de la composition.'],
    ['Oser rester','Les courbes laissent le masque du costume choisi lisible au premier plan.'],
    ['Une seconde de calme','Les rubans de scène restent posés autour de Gangle.']]],
  ['gangle','special','Le nœud du rappel',[
    ['Deux lignes rouges','Deux rubans sinueux longent les côtés et un troisième traverse le haut de la scène.'],
    ['Croisement de scène','Leur courbure ménage une ouverture pour les deux silhouettes du duel terminé.'],
    ['Le nœud reste au bord','Les lignes se stabilisent sans toucher ni ligoter le rival.']]],
  ['gangle','super','Toute la largeur du rideau',[
    ['Déployer la scène','Un grand nœud de ruban se dévoile derrière les personnages, avec deux longues extrémités.'],
    ['Laisser passer la lumière','Les boucles du nœud entourent la partie haute du tableau.'],
    ['Une révérence entière','Le nœud reste fixé au décor ; Gangle garde le masque choisi pour ce duel.']]],
  ['zooble','impact','Ça suffit',[
    ['Arrêt net','Un triangle, un carré incliné et un cercle de couleurs différentes se dévoilent dans le décor.'],
    ['Reprendre sa place','Les trois accessoires gardent leurs contours distincts derrière les personnages.'],
    ['Terminé','Le tableau se fixe sans réassembler le corps de Zooble.']]],
  ['zooble','special','Les pièces à leur place',[
    ['Un cadre en pièces','Sept formes géométriques se répartissent sur un grand arc elliptique.'],
    ['Les angles s’accordent','L’arc reste ouvert autour des illustrations ; les formes sont des accessoires indépendants.'],
    ['Assez bien comme ça','L’ellipse et ses formes se stabilisent autour de la pose de résultat.']]],
  ['zooble','super','Composition libre',[
    ['Le cadre se démonte','Un grand cadre asymétrique se dévoile avec cinq formes colorées en haut.'],
    ['Autre arrangement','Un carré incliné sur le côté complète la bordure volontairement dissymétrique.'],
    ['Sa propre place','Les pièces de décor se fixent ; l’assemblage du costume reste inchangé.']]],
  ['kinger','impact','Le roi tient encore',[
    ['Le dernier sursaut','Trois coussins composent un petit fort à l’arrière du tableau.'],
    ['Un instant immobile','Les deux coussins du bas et celui du sommet deviennent plus lisibles.'],
    ['Toujours sur la piste','Le fort reste posé derrière la scène et la pose de résultat existante.']]],
  ['kinger','special','Les cases du roi',[
    ['Tracer les cases','Un damier se dévoile sur le bas du décor, sous une couronne de scène.'],
    ['Garder le centre','Les cases restent des motifs plats ; elles ne déplacent aucun combattant.'],
    ['L’appui demeure','Le damier et la couronne se stabilisent dans le tableau final.']]],
  ['kinger','super','La dernière case',[
    ['Un plateau de théâtre','Deux tours de coussins apparaissent sur les côtés avec une bannière au fond.'],
    ['La case éclairée','Une petite couronne orne la bannière au-dessus de l’ouverture centrale.'],
    ['Fin de partie','Les tours et la bannière restent en place autour des deux personnages.']]],
  ['caine','impact','Mesdames et messieurs !',[
    ['Prendre la lumière','Deux rideaux encadrent un large faisceau lumineux au centre du tableau.'],
    ['Laisser applaudir','Le faisceau reste derrière les illustrations, dans une composition de rappel.'],
    ['Le salut','Les rideaux et le projecteur se stabilisent autour de la pose de résultat existante.']]],
  ['caine','special','Changement de numéro',[
    ['Les coulisses du cadre','Des rideaux s’accompagnent de deux faisceaux croisés de couleurs différentes.'],
    ['Le numéro suivant attend','Un ornement ovale relie les accents lumineux au-dessus de la scène.'],
    ['Rideau posé','Les projecteurs et les pans restent fixes ; le duel conserve son arène.']]],
  ['caine','super','Le grand rappel',[
    ['Ouvrir le grand cadre','De grands rideaux et une petite couronne de décor encadrent le rappel.'],
    ['Un dernier éclat','Des confettis colorés descendent légèrement dans les marges, sans clignotement.'],
    ['Le spectacle est terminé','Les confettis se posent dans la composition tandis qu’un anneau souligne le sol.']]],
  ['bubble','impact','Bulle au centre',[
    ['Un petit détour','Trois anneaux ovales se dévoilent au ras de la piste.'],
    ['Trouver le milieu','Les anneaux conservent des tailles différentes derrière les personnages.'],
    ['En suspension','La composition se stabilise ; la transparence native de Bubble reste conservée.']]],
  ['bubble','special','À fleur de piste',[
    ['Le premier cercle','Neuf petites bulles transparentes se répartissent en arc derrière le tableau.'],
    ['Des ronds qui se répondent','Leurs reflets restent discrets autour des illustrations existantes.'],
    ['La surface se calme','L’arc de bulles se fixe sans former de projectile ni emprisonner le rival.']]],
  ['bubble','super','Un rond dans le spectacle',[
    ['Élargir le cercle','Un grand anneau transparent encadre les personnages, accompagné de bulles latérales.'],
    ['Le numéro tourne court','L’ouverture de l’anneau garde les deux silhouettes visibles.'],
    ['Un dernier rond','Le tableau se stabilise sans imposer d’éclatement à Bubble.']]],
  ['gummigoo','impact','Le salut du convoyeur',[
    ['Arriver au bout','Une route en perspective se dévoile avec sa ligne centrale interrompue.'],
    ['Regarder la route','La route reste un motif de fond derrière Gummigoo et le rival.'],
    ['Un salut simple','Le repère de route se fixe autour de la pose de résultat existante.']]],
  ['gummigoo','special','Fin de trajet',[
    ['Les lignes du trajet','Deux poteaux rayés et une bannière « DERNIÈRE ÉTAPE » composent un point d’arrivée.'],
    ['Ralentir au terme','La bannière devient lisible au-dessus de l’espace occupé par les personnages.'],
    ['Le convoi peut attendre','Le point d’arrivée reste posé dans le même décor du duel.']]],
  ['gummigoo','super','Une place dans le cadre',[
    ['Ne plus être au bord','Un grand cadre de route et cinq chevrons colorés se dévoilent derrière la scène.'],
    ['Tenir cette place','Les chevrons jalonnent le haut du tableau et un repère souligne le sol.'],
    ['Présent pour ce numéro','La composition reste ouverte autour de Gummigoo jusqu’au dernier temps.']]],
  ['loolilalu','impact','La cour prend acte',[
    ['Recevoir le résultat','Une couronne de décor se dévoile au-dessus d’un anneau rose dessiné au sol.'],
    ['La révérence','Les ornements restent à distance du costume conservé de Loolilalu.'],
    ['Le calme de la cour','La couronne et l’anneau se stabilisent avec la pose de résultat existante.']]],
  ['loolilalu','special','Les marches du palais',[
    ['Le seuil du décor','Deux colonnes rayées de confiserie encadrent une couronne de scène.'],
    ['Un cadre de cour','Les colonnes et leurs chapiteaux laissent le centre du tableau dégagé.'],
    ['Le salut au seuil','Les ornements restent posés autour de Loolilalu sans modifier sa robe.']]],
  ['loolilalu','super','Le salut de la couronne',[
    ['Élargir la cour','Trois grandes arches et une couronne de décor se dévoilent derrière le tableau.'],
    ['Laisser porter le salut','Les arches gardent des contours clairs autour des silhouettes.'],
    ['Le décret du spectacle','Le décor de palais se stabilise ; aucun nouvel accessoire n’est ajouté au costume.']]],
  ['gloinkqueen','impact','La reine conserve sa place',[
    ['Le poids du dernier échange','Cinq formes colorées se dévoilent dans la partie basse du décor.'],
    ['Un recul de la scène','Les polygones restent séparés et laissent la silhouette de la reine au premier plan.'],
    ['La place est occupée','Les cinq formes se fixent autour du tableau de résultat.']]],
  ['gloinkqueen','special','Tout autour du nid',[
    ['Quelques formes au bord','Douze formes géométriques composent un large anneau elliptique.'],
    ['Le nid se dessine','Les couleurs s’alternent autour de l’ouverture réservée aux personnages.'],
    ['Le cercle reste ouvert','L’anneau de formes reste fixe sans absorber ni transformer le rival.']]],
  ['gloinkqueen','super','Le cercle des Gloinks',[
    ['Un cadre qui s’accumule','Deux grands hexagones emboîtés se dévoilent au fond de la scène.'],
    ['Autour de la reine','Sept petites formes colorées complètent le bas de la composition.'],
    ['Le nid au repos','Les hexagones et les formes restent posés autour de la reine.']]],
  ['fudge','impact','La masse retombe',[
    ['Le dernier élan','Une large forme chocolatée ovale se dévoile derrière les personnages.'],
    ['Reprendre du poids','Deux aplats bruns composent la surface du motif au ras du sol.'],
    ['Un arrêt lourd','La matière décorative se stabilise sans ajouter de collision ou de dégât.']]],
  ['fudge','special','Une trace sur la piste',[
    ['La bordure se charge','Une bordure chocolatée se dévoile en haut du tableau.'],
    ['Une coulée de décor','Treize coulures arrondies dessinent son contour au-dessus des personnages.'],
    ['La trace s’arrête','Les coulures et l’ovale de sol restent figés dans le décor final.']]],
  ['fudge','super','Le cadre déborde',[
    ['Retenir les bords','Deux colonnes chocolatées et une grande arche encadrent la scène.'],
    ['Le décor prend du poids','Une large forme brune souligne le sol derrière les silhouettes.'],
    ['La dernière goutte','L’arche et les colonnes se stabilisent sans engloutir les personnages.']]],
  ['abstractedkaufmo','impact','Signal interrompu',[
    ['L’impulsion restante','Neuf petites barres colorées se dévoilent à des endroits irréguliers du décor.'],
    ['Le signal se retient','Leurs contours restent stables, sans clignotement ni secousse répétée.'],
    ['La forme demeure','Les barres s’immobilisent autour de la forme abstraite conservée de Kaufmo.']]],
  ['abstractedkaufmo','special','Contour hors registre',[
    ['Un bord décalé','Neuf panneaux sombres avec un motif d’œil se dévoilent au fond du tableau.'],
    ['Retrouver un contour','Les panneaux gardent leur grille et leurs contours clairs derrière les silhouettes.'],
    ['Le registre se fixe','La grille reste fixe ; elle ne crée aucune copie combattante.']]],
  ['abstractedkaufmo','super','Le noir sous les couleurs',[
    ['Les couleurs aux marges','Cinq panneaux sombres inclinés et leurs motifs d’yeux se dévoilent derrière la scène.'],
    ['Une dernière impulsion','Une ligne anguleuse souligne le bas de la composition sans effet de stroboscope.'],
    ['Le signal reste là','Les panneaux se stabilisent ; Kaufmo conserve sa forme abstraite.']]],
  ['baronmildenhall','impact','Le silence après l’écho',[
    ['L’échange est clos','Un portrait stylisé dans un cadre doré se dévoile à côté de deux bougies.'],
    ['Le temps du silence','Le cadre et les bougies restent des accessoires derrière les illustrations.'],
    ['Le regard du cadre','Le portrait se stabilise sans ajouter d’arme ou de réplique au Baron.']]],
  ['baronmildenhall','special','Le cadre du manoir',[
    ['Un portrait en attente','Un grand cadre de portrait se dévoile au milieu du décor.'],
    ['Le bois se rejoint','Six bougies espacées composent une rangée sous le portrait.'],
    ['Le silence encadré','Le portrait et les bougies restent fixes pendant la pose de résultat.']]],
  ['baronmildenhall','super','Dernier portrait',[
    ['Ouvrir la grande bordure','Quatre portraits stylisés occupent les côtés de la composition.'],
    ['La lumière se retire','Deux bougies et un trait au sol relient les ornements du tableau.'],
    ['Un dernier arrêt','Les portraits se stabilisent autour du Baron et du rival déjà vaincu.']]],
];
export const FINISHER_CATALOG=deepFreeze(rows.map(([fighterId,variant,title,panels])=>({
  id: fighterId+'.'+variant,fighterId,variant,title,durationFrames:durations[variant],
  beats:panels.map(([title,description],index)=>({frame:index*durations[variant]/3,title,description})),
  motif:performers[fighterId].motif,sourceIds:performers[fighterId].sourceIds,
  adaptation:performers[fighterId].adaptation,remainingArtWork,
})));
