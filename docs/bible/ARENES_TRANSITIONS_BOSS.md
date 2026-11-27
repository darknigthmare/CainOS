# Arènes, connexions et boss

**Contrats de conception Encore — aucune connexion ni phase de boss nouvelle intégrée.**

## Catalogue réel et quatre axes séparés

Le jeu possède 27 arènes : 18 hors crossovers et 9 escales GLITCH, plus 64 arrangements dédiés. Une étape de route change de décor entre deux combats ; elle ne prouve pas une connexion utilisable au milieu d’un duel.

| Axe | Question | État courant / cible |
| --- | --- | --- |
| Présentation | Le fond bouge-t-il ? | Ambiances et reducedMotion présents ; options vivant/statique/réduit à préciser. |
| Interactions | Un objet répond-il à une action ? | Contrat à définir par objet ; aucun interrupteur global nouvellement livré. |
| Dangers | Le décor change-t-il les dégâts ou collisions ? | Le duel courant garde sa surface sans danger aléatoire ; dangers futurs désactivés par défaut. |
| Transitions | Peut-on changer de stage pendant le duel ? | Six liens conçus ci-dessous, zéro intégré. |

| Profil cible | Présentation | Interactions | Dangers | Transitions |
| --- | --- | --- | --- | --- |
| Compétition | au choix local, vivant/statique/réduit | false | false | false |
| Spectacle | au choix local | selon contrat d’objet annoncé | désactivés par défaut ; chaque danger futur a une fiche | uniquement liens déclarés et version de règles compatible |
| Confort / performance | statique ou réduit | hérite du profil de match | hérite du profil de match, signaux fixes équivalents | hérite du profil de match, présentation réduite équivalente |

Le confort modifie la présentation, pas silencieusement les règles du match. Ces profils sont des contrats cibles ; aucun nouveau menu n’est revendiqué.

## Six connexions originales

### EN-LINK-001 — Derrière le rideau

**La grande piste → Le couloir des portes** · côté droite · une direction par match. Géographie originale Encore, non intégrée.

**Déclencheur :** Rupture du panneau latéral signalé par deux impacts admissibles dirigés à droite.

**Réponse adverse :** Garder l’impact, reculer de la zone ou changer de côté avant la frappe.

**Repère d’arrivée :** Couloir des portes, entrée dégagée à gauche.

**Assets à prévoir :** rideau source statique ; cadre d’arrivée ; signal fixe de rupture. Contrat commun : `EN-LINK-RULES-01`.

### EN-LINK-002 — Au pied du chapiteau

**La grande piste → Les terrains du cirque** · côté gauche · une direction par match. Géographie originale Encore, non intégrée.

**Déclencheur :** Ouverture du passage de toile marqué après deux impacts vers la gauche.

**Réponse adverse :** Défendre ou ramener le duel au centre.

**Repère d’arrivée :** Pelouse avec chapiteau en fond, sol continu.

**Assets à prévoir :** passage de toile ; repère au sol ; vignette de raccord. Contrat commun : `EN-LINK-RULES-01`.

### EN-LINK-003 — La porte mal étiquetée

**Le couloir des portes → La fausse sortie** · côté droite · une direction par match. Géographie originale Encore, non intégrée.

**Déclencheur :** Porte de décor préparée pour un transfert, jamais présentée comme la vraie sortie.

**Réponse adverse :** Éviter la zone et contrer l’attaque admissible.

**Repère d’arrivée :** Bureaux gris, porte rouge au fond hors collision.

**Assets à prévoir :** porte de spectacle ; panneau sans texte peint ; état ouvert du cadre. Contrat commun : `EN-LINK-RULES-01`.

### EN-LINK-004 — La trappe de répétition

**Le couloir des portes → Le cellier** · côté gauche · une direction par match. Géographie originale Encore, non intégrée.

**Déclencheur :** Paroi de scène qui révèle une trappe de spectacle ; transfert par séquence, sans chute libre jouable.

**Réponse adverse :** Bloquer l’attaque de rupture ; la trappe n’a pas d’activation au simple contact.

**Repère d’arrivée :** Lumière centrale du cellier, deux acteurs déjà debout.

**Assets à prévoir :** trappe fermée/ouverte en deux images ; signal de bord ; arrivée sous lumière. Contrat commun : `EN-LINK-RULES-01`.

### EN-LINK-005 — Sous le parcours

**Candy Canyon → Sous la carte** · côté droite · une direction par match. Géographie originale Encore, non intégrée.

**Déclencheur :** Découpe originale du plancher de répétition après impacts signalés ; aucune géographie physique canonique revendiquée.

**Réponse adverse :** Garde ou sortie de zone ; effet de faille purement visuel jusqu’au transfert validé.

**Repère d’arrivée :** Sol quadrillé bleu sous la carte, ancrages au même niveau.

**Assets à prévoir :** fragment de sol sans acteur ; vignette verticale de passage ; repères quadrillés d’arrivée. Contrat commun : `EN-LINK-RULES-01`.

### EN-LINK-006 — Le seuil du dernier numéro

**Le chapiteau des souvenirs brisés → Le seuil de l’abstraction** · côté droite · une direction par match. Géographie originale Encore, non intégrée.

**Déclencheur :** Cadre de miroir original qui s’ouvre après rupture contrôlée.

**Réponse adverse :** Défendre la frappe, rester au centre ou utiliser le profil sans transitions.

**Repère d’arrivée :** Passerelle minérale horizontale, regard au fond.

**Assets à prévoir :** cadre de miroir intact/rompu ; signal fixe lumineux ; raccord de passerelle. Contrat commun : `EN-LINK-RULES-01`.

## EN-LINK-RULES-01 — contrat commun

| Responsabilité | Règle proposée |
| --- | --- |
| Repère | Repère logique existant 1280 × 720, sol y=568, limites actuelles x=65..1215. |
| Modes futurs admissibles | future-global-campaign, future-spectacle-versus, future-stage-training |
| Modes sans liaison | current-all-modes, future-competition-default, legacy-replays |
| Activation | Proposition : une attaque autorisée touche en direction de la liaison, dans la zone signalée. L’attaque doit être gardable/esquivable ; aucun simple contact involontaire avec le bord ne transfère. |
| Seuil proposé | Compteur de rupture par liaison, cible initiale 2 impacts admissibles. Paramètre de conception à équilibrer, distinct des valeurs actuelles. |
| Priorités | Résoudre collision/dégâts puis KO ou temps écoulé avant de considérer le transfert. Un seul événement de transfert par tick ; départ simultané opposé annule les deux transferts et laisse le duel au même stage. |
| Durée et confort | Durée cible 90 ticks de simulation d’événement (1,5 s), horloge de combat et acteurs gelés. Mode réduit : coupe fondue discrète de même durée, mêmes états et mêmes signaux. |
| État du duel | Conserver vie, ressources, manches, statistiques et RNG ; vider hitboxes actives, projectiles, pièges et contacts persistants au transfert. Le combo est clos sans dégâts supplémentaires. Ces règles ne sont pas implémentées. |
| Arrivée | Replacer les deux acteurs au sol, centres initiaux x=420 et x=860, face à face. Ajuster les centres au gabarit si les hurtboxes se recouvrent ; prouver aucune intersection avec les limites. |
| Reprise de contrôle | 30 ticks de neutralisation partagée après l’arrivée ; puis contrôle simultané. Transfert consommé pour le match, pas de retour dans la même manche. |
| Chargement | Précharger la destination avant le round. Si elle est indisponible, désactiver la liaison avant le départ et afficher l’état ; aucun chargement bloquant après impact. |
| Replay | Nouvelle version de règles et format de replay obligatoires pour les liens actifs ; les anciennes versions restent sans transition. |

Les deux impacts de rupture, 90 ticks de présentation et 30 ticks de reprise sont des paramètres de départ à équilibrer. Ils ne décrivent pas le comportement actuel du moteur. Aucun de ces liens n’impose une géographie canonique.

**Situations à tester avant intégration :**

- garde et esquive
- coin gauche/droit
- corps géant et petit
- KO sur impact de rupture
- chrono expirant au même tick
- double déclenchement
- pause et périphérique débranché
- destination indisponible
- match rejoué à l’identique
- aucune boucle retirant indéfiniment le contrôle

## Boss : conserver l’existant et spécifier les écarts

Le Boss Rush actuel suit l’ordre Gloink Queen → The Fudge → Kaufmo — abstraction → Caine. Choisir un de ces personnages en Versus ne crée pas une rencontre à phases. Une sélection autonome **Boss Combat** et les déclencheurs de phases restent à concevoir et à intégrer.

### Gloink Queen — `gloinkqueen`

**Existant :** duel du Boss Rush actuel. Contrôle de l’espace et grand gabarit.

**Évolution proposée :** Projet P1 : 3 phases lisibles par palette d’arène et actions déjà identifiées, à équilibrer ; aucune phase nouvelle livrée.

**Annonce :** Distinguer préparation de charge, occupation de sol et récupération du corps.

**Réponse adverse :** Laisser une ouverture visible après l’engagement ; ne pas immuniser toutes les prises sans alternative.

**Conclusion :** Résultat de duel standard ; Dernier Acte par cadrage compatible, sans détruire ni guérir le personnage.

**Validation future :** petit gabarit ; grande hitbox ; approche courte portée ; projectile ; projections compatibles selon moteur ; défaite/reprise ; victoire/retour au menu.

### The Fudge — `fudge`

**Existant :** duel du Boss Rush actuel. Pression lourde et portée.

**Évolution proposée :** Projet P1 : pression puis ralentissement après action lourde ; aucun changement de kit compétitif.

**Annonce :** Masse, direction de mouvement et départ du projectile annoncés séparément.

**Réponse adverse :** Approche par fenêtres de récupération ; coût et durée des barrières observables.

**Conclusion :** Résultat de duel standard ; Dernier Acte par cadrage compatible, sans détruire ni guérir le personnage.

**Validation future :** petit gabarit ; grande hitbox ; approche courte portée ; projectile ; projections compatibles selon moteur ; défaite/reprise ; victoire/retour au menu.

### Kaufmo — abstraction — `abstractedkaufmo`

**Existant :** duel du Boss Rush actuel. Portée et menace de la forme abstraite.

**Évolution proposée :** Projet P1 : variations de rythme dans une simulation bornée ; aucun retour à une forme normale après le duel.

**Annonce :** Yeux et silhouette visibles ; flashs réduits possibles sans masquer la préparation.

**Réponse adverse :** Pouvoir punir une action manquée ; éviter une accumulation d’effets rendant les pieds illisibles.

**Conclusion :** Résultat de duel standard ; Dernier Acte par cadrage compatible, sans détruire ni guérir le personnage.

**Validation future :** petit gabarit ; grande hitbox ; approche courte portée ; projectile ; projections compatibles selon moteur ; défaite/reprise ; victoire/retour au menu.

### Caine — `caine`

**Existant :** duel du Boss Rush actuel. Maître du dernier numéro, duel de contrôle.

**Évolution proposée :** Projet P1 : fermer les séquences annoncées une à une, puis duel final normalisé ; les exceptions doivent appartenir à une configuration de campagne séparée.

**Annonce :** Accessoire ou annonce courte avant chaque pattern supplémentaire envisagé.

**Réponse adverse :** Toute mise en scène de pouvoir laisse un signal, une durée et une réponse ; aucune victoire automatique narrative.

**Conclusion :** Résultat de duel standard ; Dernier Acte par cadrage compatible, sans détruire ni guérir le personnage.

**Validation future :** petit gabarit ; grande hitbox ; approche courte portée ; projectile ; projections compatibles selon moteur ; défaite/reprise ; victoire/retour au menu.

## Extensions différées

| ID | Extension | Motif |
| --- | --- | --- |
| EN-P2-NET | Rollback, matchmaking et crossplay | Services et contrat de synchronisation non retenus pour cette livraison. |
| EN-P2-TAG | Tag, assistance et coopération simultanée | Nouveaux systèmes de combat, distincts du duel existant. |
| EN-P2-HUB | Exploration libre, avatar et équipement RPG | La campagne globale proposée reste en chapitres de duels ; coût et déplacement à décider avant extension. |
| EN-P2-MACHINE | Machine de spectacle originale combattable | Aucune machine autonome canonique justifiée dans le roster actuel ; éventuel boss original à spécifier séparément. |
| EN-ANIM-NEXT | Nouveaux cycles d’animation, voix et cinématiques animées | Production actuelle demandée : sprites et scènes fixes. |

## Sources et association

[Données et contrats éditoriaux](guide-design.json) · [Matrice 00–29](COMBAT_GAMES_GUIDE_INTEGRATION.md) · [Moteur](../../combat/engine.mjs) · [Modes et Boss Rush](../../combat/session.mjs) · [Catalogue d’arènes](../../combat/data.mjs).
