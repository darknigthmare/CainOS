# Extensions 01 et 02 — application à Encore

2026-11-27 · base observée [6e44ab7](https://github.com/darknigthmare/CainOS/commit/6e44ab75b9c82b4d6fe62a0051287275abc97753) · phase **sprites de base et documentation**.

Les deux textes originaux prolongent le guide déjà intégré : **38 rubriques, 114 exigences**, chacune avec résultat attendu et statuts séparés. Le [registre d’intégration](extensions-integration.json) et le [contrat structuré](extensions-design.json) sont reproductibles. Ce chantier documentaire ne livre aucune nouvelle animation, aucun tag ni accès commercial opérationnel.

## Sources originales conservées

| Document | Sections | Octets | Empreinte SHA-256 |
| --- | --- | --- | --- |
| [Combat_Games_Guide_General_v1.0.txt](references/Combat_Games_Guide_General_v1.0.txt) | 00–29 | 55172 | 4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7 |
| [Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) | 30–49 | 60589 | 330fb7485a7a52b2a20f855646c940aaac0fcd9510032bc84b2e17c518edd25f |
| [Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) | 50–67 | 47334 | 08b57ea542e83c487fef3276997a612d4657f2ee9ed4f8e46b0bf65a2778038b |

Le guide général est identique à la copie déjà présente ; il n’est pas dupliqué. Les extensions viennent de leurs fichiers Drive complets, pas d’un résumé reconstruit. [Provenance](references/combat-guides-provenance.json).

## Contenu concret de cette conception

| Ensemble | Quantité | Portée |
| --- | --- | --- |
| Personnages | 64 | Un taunt, une sélection et une vraie désélection chacun : 192 fiches. |
| Duos | 12 | Intervention, contribution de chacun, super et Dernier Acte original. |
| Bonus | 8 | Objectif, score, échec, reprise, décor, assets et récompense. |
| Archives des répétitions | 5 | Cinq salles et quatre liens réciproques ; hub original non implémenté. |
| Déblocages | 9 | Règles ET/OU sur huit récompenses proposées et catalogue historique conservé. |
| Soutien externe | 3 | Trois modèles spécifiés, tous désactivés ; aucun fournisseur ou prix configuré. |
| Validation future | 40 | 18 scénarios Extension 01 et 22 Extension 02, non exécutés sur les fonctions absentes. |

Les [fiches de personnalité](PERSONNALITE_SELECTION_ET_EQUIPES.md), les [bonus et Archives](BONUS_ARCHIVES_ET_DEBLOCAGES.md) et les [contrats de droits](CONTRATS_DROITS_ET_SAUVEGARDE.md) développent les décisions. Les techniques et relations de parcours restent des adaptations Encore. Les références d’identité existantes gardent leurs limites ; aucune fidélité canonique globale 1:1 n’est certifiée ici.

## Socle réellement observé

| Source | Observation |
| --- | --- |
| [combat/app.mjs](../../combat/app.mjs) | Cartes, portraits, aperçu de costume et décor présents ; aucun cycle complet de désélection dédié observé au baseline. |
| [combat/render-sequences.mjs](../../combat/render-sequences.mjs) | Cinq événements de présentation par combattant, pour intro et résultats ; distincts des nouveaux taunts et états de menu. |
| [combat/session.mjs](../../combat/session.mjs) | Dix slots de techniques et replays 0.7.0 utilisant les règles 0.5.0 ; nouvelles actions tag à versionner. |
| [combat/session.mjs](../../combat/session.mjs) | Progression de routes/défis/médailles présente ; pas de ledger de sources permanentes/temporaires dans le profil v1 du baseline. |
| [combat/progression.mjs](../../combat/progression.mjs) | Survie existante = dix adversaires successifs ; elle ne prouve pas une horde simultanée. |
| [combat/engine.mjs](../../combat/engine.mjs) | Projectiles, pièges et réflexion existants ; cycle sous tag non implémenté au baseline. |

Une carte sélectionnable n’est pas un cycle de désélection. Une finale individuelle n’est pas une super d’équipe. Une survie en dix duels n’est pas une horde simultanée. Le jeu possède des projectiles et pièges ; leur durée sous un futur tag reste à implémenter. Le mode libre conserve tous les accès existants.

## Matrice des rubriques 30 à 67

| ID | Rubrique | Priorité | Décision | Observation à la base |
| --- | --- | --- | --- | --- |
| EN-G30 | Portée et rattachement au guide général | P0 | retenue | documentation |
| EN-G31 | Taunts : personnalité et réactions | P1 | retenue | absent-dedicated-action |
| EN-G32 | Sélection, confirmation et désélection | P1 | retenue | static-selection-present |
| EN-G33 | Profils d’équipe et catégories de partenaires | P1 | retenue-conception | not-implemented |
| EN-G34 | Commandes, jauges et disponibilité | P0 | retenue-conception | not-implemented |
| EN-G35 | Assistances ponctuelles | P1 | retenue-conception | not-implemented |
| EN-G36 | Tag : transfert réel du contrôle | P1 | retenue-conception | not-implemented |
| EN-G37 | Techniques combinées et supers d’équipe | P1 | retenue-conception | not-implemented |
| EN-G38 | Finishers d’équipe et fins dramatiques | P1 | retenue-conception | solo-finales-present |
| EN-G39 | Clashes et confrontations avec QTE | P2 | adaptée | not-implemented |
| EN-G40 | Entités indépendantes et objets placés | P1 | adaptée | projectiles-and-traps-present |
| EN-G41 | Projectiles persistants et attribution | P0 | adaptée | projectile-runtime-present |
| EN-G42 | Stages bonus et épreuves narratives | P1 | retenue-conception | sequential-survival-present-no-bonus-stage |
| EN-G43 | Espace d’exploration et de déblocage | P1 | retenue-conception | archive-menu-present-no-hub |
| EN-G44 | Relations, période et compatibilités | P0 | retenue | source-annotations-present |
| EN-G45 | Assets, animation, son et mise en scène | P1 | retenue | static-base-production-phase |
| EN-G46 | Interface, apprentissage et réseau | P0 | adaptée | local-training-and-replays-present |
| EN-G47 | Validation, statistiques et ordre d’intégration | P0 | retenue | documentation |
| EN-G48 | Dix fiches de production complémentaires | P1 | retenue | documentation |
| EN-G49 | Instruction d’intégration et références | P0 | retenue | documentation |
| EN-G50 | Portée du système de déblocage | P0 | retenue-conception | no-access-catalogue-at-baseline |
| EN-G51 | Découverte, droits, installation et compatibilité | P0 | retenue-conception | not-implemented |
| EN-G52 | Langage visuel des verrous | P1 | retenue-conception | not-implemented |
| EN-G53 | Slots d’artistes et de partenaires | P1 | retenue-conception | all-roster-selectable-at-baseline |
| EN-G54 | Tenues, palettes et dépendances | P1 | retenue-conception | wardrobe-present-no-entitlements |
| EN-G55 | Stages, variantes et destinations | P1 | retenue-conception | stage-catalogue-present |
| EN-G56 | Modes et parcours verrouillés | P1 | adaptée | all-nine-modes-free-at-baseline |
| EN-G57 | Conditions, progression et attribution | P0 | retenue-conception | stories-challenges-medals-present |
| EN-G58 | Exploration, récompenses et révélation | P1 | retenue-conception | hub-not-implemented |
| EN-G59 | Soutiens et modèles d’acquisition | P2 | retenue-specification-inactive | no-provider-integration |
| EN-G60 | Liaison à Patreon ou équivalent | P2 | différée-intégration | no-provider-integration |
| EN-G61 | Expiration, incidents et hors ligne | P0 | retenue-conception | local-profile-present |
| EN-G62 | Local, multijoueur, entraînement et replays | P0 | retenue-conception | local-and-replay-present |
| EN-G63 | Textes, accessibilité et surprises | P0 | retenue-conception | accessible-menu-foundations-present |
| EN-G64 | Production, sauvegarde et validation des droits | P0 | retenue-conception | versioned-profile-present-no-entitlement-ledger |
| EN-G65 | Six fiches d’accès et de droits | P1 | retenue | documentation |
| EN-G66 | Instruction d’intégration au projet | P0 | retenue | documentation |
| EN-G67 | Références et vocabulaire des droits | P0 | retenue | documentation |

## 30 — Portée et rattachement au guide général

**EN-G30 · P0 · retenue**

Prolonger les identifiants EN-G00…29 par EN-G30…67 ; conserver le duel existant et la phase de bases fixes.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | sans objet |
| integration | documentaire |
| tests | validation documentaire |

### EN-G30-01

Conserver les deux originaux et leur provenance avec le guide général déjà présent.

**Acceptation :** Les trois tailles et SHA-256 correspondent aux fichiers Drive ; le guide général n’est pas dupliqué.

### EN-G30-02

Relier chaque rubrique aux contrats Encore, aux sources du runtime et aux tâches restantes.

**Acceptation :** Les 38 sections existent une fois et leurs exigences disposent d’identifiants uniques et de critères.

### EN-G30-03

Séparer documenté, asset produit, moteur intégré et scénario exécuté.

**Acceptation :** Aucun statut de conception ne ferme un test de tag, de dessin, de déblocage ou de fidélité.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 31 — Taunts : personnalité et réactions

**EN-G31 · P1 · retenue**

Une provocation silencieuse de présentation par combattant ; la récupération utility actuelle garde ses règles et son nom.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G31-01

Associer 64 gestes avec entrée, pose, sortie, vulnérabilité et limites de personnalité.

**Acceptation :** Chaque ID du roster possède un brief unique ; les abstractions ne parlent pas et aucun souvenir inédit n’est affirmé.

### EN-G31-02

Créer ultérieurement une action TAUNT distincte de utility, sans gain de ressource par défaut.

**Acceptation :** Une commande refusée ne dépense rien ; un coup interrompt le geste ; aucun bonus de dégâts n’est accordé par la pose.

### EN-G31-03

Prévoir une variante envers le rival et une option de fréquence des voix.

**Acceptation :** La variante utilise la relation de route étiquetée fan-game ; voix répétées et mouvements réduits n’altèrent pas le contrôle.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json) · [docs/bible/extensions-characters.json](../../docs/bible/extensions-characters.json).

## 32 — Sélection, confirmation et désélection

**EN-G32 · P1 · retenue**

Conserver les portraits existants ; spécifier huit états de présentation et une sortie propre par artiste.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G32-01

Distinguer focus, aperçu, confirmation, attente, tenue, désélection, équipe et départ.

**Acceptation :** Le modèle d’états indique une transition et une action d’annulation pour chaque état.

### EN-G32-02

Écrire 64 désélections spécifiques, abrégées sur navigation rapide sans inverser arbitrairement l’entrée.

**Acceptation :** Le choix logique est immédiat ; la sortie nettoie particules, voix et compagnon de l’aperçu abandonné.

### EN-G32-03

Maintenir deux joueurs indépendants et des textes accessibles sans spoiler.

**Acceptation :** Deux curseurs, deux costumes du même artiste et une annulation simultanée ne volent ni focus ni choix.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json) · [docs/bible/extensions-characters.json](../../docs/bible/extensions-characters.json).

## 33 — Profils d’équipe et catégories de partenaires

**EN-G33 · P1 · retenue-conception**

Définir une future Répétition en duo à deux membres, distincte des neuf modes du catalogue existant.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G33-01

Retenir un actif et une réserve avec vie propre ; l’équipe perd après deux KO.

**Acceptation :** Un premier KO déclenche l’entrée du survivant sans jauge et sans réanimation du membre éliminé.

### EN-G33-02

Séparer profil assistance, tag et hybride avec rôles affichés avant le match.

**Acceptation :** Une assistance ne devient pas contrôlable ; une entité de kit ne consomme pas automatiquement un slot.

### EN-G33-03

Interdire les doublons d’identité ou de version dans un duo scénarisé.

**Acceptation :** Personnage et abstraction du même personnage sont refusés en histoire ; le mode simulation explicite peut les autoriser.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 34 — Commandes, jauges et disponibilité

**EN-G34 · P0 · retenue-conception**

Réserver des actions remappables séparées pour taunt, aide, relais et super ; aucun détournement des dix slots historiques.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G34-01

Proposer une jauge de duo distincte des ressources intrinsèques et du super individuel.

**Acceptation :** Le contrat fixe capacité, coût, recharge, horloge, réservations et remboursement ; les valeurs sont marquées à équilibrer.

### EN-G34-02

Tester disponibilité du partenaire avant de réserver ou débiter la jauge.

**Acceptation :** Un partenaire engagé, KO ou en récupération refuse l’action avec un motif ; deux actions ne dépensent jamais le même crédit.

### EN-G34-03

Versionner l’encodage d’entrées avant toute intégration de commandes supplémentaires.

**Acceptation :** Un replay 0.5/0.7 garde SLOT_ORDER et le résultat historique ; la nouvelle règle porte sa propre version.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 35 — Assistances ponctuelles

**EN-G35 · P1 · retenue-conception**

Chaque intervention réutilise une technique du partenaire référencée par son slot ; aucune aptitude officielle nouvelle n’est déduite.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G35-01

Décrire appel, arrivée, action, sortie, récupération et interruption pour les duos prioritaires.

**Acceptation :** L’entrée est annoncée, le soutien reste punissable et un second appel attend sa sortie complète.

### EN-G35-02

Conserver les dégâts subis par la réserve et l’historique partagé du combo.

**Acceptation :** Toucher actif et soutien ne double pas la jauge gagnée ; les deux pertes de vie sont attribuées une fois.

### EN-G35-03

Définir l’échec sur mur, transition, KO et géant incompatible.

**Acceptation :** Le soutien quitte proprement la scène ; la réserve n’est ni téléportée dans un mur ni réanimée par un rappel.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 36 — Tag : transfert réel du contrôle

**EN-G36 · P1 · retenue-conception**

Le relais est une future règle de simulation, distincte d’une permutation de portrait ou d’une composition de scène.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G36-01

Spécifier relais neutre, après confirmation, secours, KO et relais de scénario séparément.

**Acceptation :** Chaque forme possède coût, fenêtre, invulnérabilité éventuelle, point de contrôle et résolution en échec.

### EN-G36-02

Conserver vie, munitions, récupérations, états et limites du combo à travers le switch.

**Acceptation :** Aucun reset de rebond, piège, jauge ou cooldown n’est obtenu en alternant les deux membres.

### EN-G36-03

Fixer la cible des projectiles et le sort des entités lors du départ.

**Acceptation :** Les IDs de propriétaire restent stables ; un projectile ne suit pas un nouveau membre sans propriété de ciblage annoncée.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 37 — Techniques combinées et supers d’équipe

**EN-G37 · P1 · retenue-conception**

Douze compositions reçoivent un numéro original avec contribution visible de chacun et aucun nouveau pouvoir canonique.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G37-01

Lier chaque super à deux membres, deux slots existants et une justification de rencontre.

**Acceptation :** Les 12 duos référencent des combattants distincts et des techniques présentes dans le catalogue.

### EN-G37-02

Engager la chorégraphie longue uniquement sur une confirmation compatible.

**Acceptation :** Garde, raté, interruption et cible géante disposent d’une résolution courte sans victoire forcée.

### EN-G37-03

Bloquer appels concurrents et définir sortie, placement et continuation.

**Acceptation :** Les deux participants redeviennent disponibles selon le même état de simulation après séquence complète ou abrégée.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 38 — Finishers d’équipe et fins dramatiques

**EN-G38 · P1 · retenue-conception**

Nom éditorial retenu : Derniers Actes en duo. Les finales individuelles existantes restent inchangées.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G38-01

Séparer super de combat, conclusion collective et tableau conditionnel.

**Acceptation :** Une finale après verdict ne modifie ni le vainqueur, ni la progression, ni les dégâts déjà enregistrés.

### EN-G38-02

Définir les conditions de chaque duo : adversaire, décor, versions, partenaire vivant et contexte.

**Acceptation :** Les scènes mémorielles ne passent jamais pour un retour canonique ; un partenaire KO entraîne la solution individuelle.

### EN-G38-03

Fixer priorité et variantes pour morphologies incompatibles.

**Acceptation :** Fin dramatique spécifique, finale duo, finale solo puis victoire normale sont évaluées une seule fois dans cet ordre.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 39 — Clashes et confrontations avec QTE

**EN-G39 · P2 · adaptée**

Limiter les clashes interactifs aux défis et chapitres solo ; les versus compétitifs conservent des règles déterministes sans QTE.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G39-01

Créer deux familles de clash originales : accessoires opposés et poussée contre décor simulé.

**Acceptation :** Seules les paires de techniques inscrites dans la table peuvent déclencher le clash ; aucun choc automatique universel.

### EN-G39-02

Prévoir commande maintenue ou pression unique, sans martelage obligatoire.

**Acceptation :** Réussite, échec, égalité, absence de réponse, pause et déconnexion sont définis ; option automatique disponible en solo.

### EN-G39-03

Résoudre le résultat du clash avant la conclusion du duel.

**Acceptation :** La scène ne renverse pas une victoire déjà attribuée ; seuils et résultat sont enregistrés dans la future version de replay.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 40 — Entités indépendantes et objets placés

**EN-G40 · P1 · adaptée**

S’appuyer sur projectiles et pièges existants ; ne pas transformer un motif illustré en compagnon autonome.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G40-01

Indexer les slots projectile et trap par propriétaire et règles réelles.

**Acceptation :** Chaque enregistrement garde ID, slot, coût, durée, cap et champs absents comme absents ; aucun pouvoir supposé.

### EN-G40-02

Spécifier le budget actif et le cycle d’une entité native distincte de la réserve.

**Acceptation :** Invocation, ordres, neutralisation et fin de vie sont bornés ; une ressource de kit demeure liée à son propriétaire.

### EN-G40-03

Définir comportement en KO, réserve, interruption et changement d’arène.

**Acceptation :** Les objets périmés ne survivent pas à une nouvelle manche ; leurs anciens propriétaires restent identifiables pour les replays.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 41 — Projectiles persistants et attribution

**EN-G41 · P0 · adaptée**

Prolonger le contrat actuel de réflexion sans changer le motif visuel de l’attaque d’origine.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G41-01

Séparer propriétaire initial, propriétaire de dégâts, cible et identité graphique.

**Acceptation :** La clef de Jax réfléchie ne devient pas un projectile de Kinger ; le crédit de dégâts suit les règles de réflexion.

### EN-G41-02

Borner nombre, durée, rebonds, fréquence de touche et nettoyage de chaque famille.

**Acceptation :** Un projectile ou piège ne permet pas une boucle infinie entre relais, contre et transition.

### EN-G41-03

Conserver forme, collision et lisibilité avec les costumes crossover.

**Acceptation :** Un skin ne modifie pas portée ni délai ; tout écart visible est documenté avant publication.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 42 — Stages bonus et épreuves narratives

**EN-G42 · P1 · retenue-conception**

Huit épreuves situées dans les lieux du jeu : camion de répétition, convoi, nid, service Spudsy, manoir, softball, balises et silhouettes.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G42-01

Donner objectif mesurable, échec non bloquant, score, reprise et récompense à chaque bonus.

**Acceptation :** Les huit fiches possèdent limites, contrôle d’entrée/sortie et condition de victoire ; une défaite ne ferme pas la campagne.

### EN-G42-02

Distinguer horde simultanée et survie actuelle à dix duels successifs.

**Acceptation :** Le statut de horde reste non intégré tant que plusieurs ennemis réellement simultanés ne sont pas pris en charge.

### EN-G42-03

Utiliser le décor réel associé, sa perspective latérale et des objets séparés.

**Acceptation :** Aucun fond générique de scène de théâtre ne remplace Candy Canyon, le restaurant, le manoir ou le terrain de softball.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 43 — Espace d’exploration et de déblocage

**EN-G43 · P1 · retenue-conception**

Les Archives des répétitions sont un hub original de simulation Encore, séparé du menu Archives existant et de la géographie canonique.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G43-01

Décrire cinq salles et quatre connexions réciproques avec seuils aux murs.

**Acceptation :** Le graphe est accessible depuis l’accueil ; chaque arrivée reste hors collision et ne place aucune porte au centre d’une salle.

### EN-G43-02

Relier coffres ciblés aux récompenses, sans tirage payant ni perte de clé après interruption.

**Acceptation :** Chaque coffre possède un contenu stable et une transaction idempotente ; retour au hub conserve son état.

### EN-G43-03

Prévoir carte, journal, raccourci et alternative par menu accessible.

**Acceptation :** Un joueur peut consulter les conditions et réclamer une récompense sans devoir réussir une manipulation de déplacement.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 44 — Relations, période et compatibilités

**EN-G44 · P0 · retenue**

Les duos, dialogues et fins écrits ici sont des propositions Encore ; les fiches de référence gardent leur niveau d’incertitude.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | sans objet |
| integration | documentaire |
| tests | validation documentaire |

### EN-G44-01

Classer personnages, scènes et costumes selon les cinq statuts de fidélité.

**Acceptation :** Un libellé d’archive ou une illustration générée ne devient pas une preuve canonique.

### EN-G44-02

Conserver les disparus dans une répétition mémorielle ou une simulation explicite.

**Acceptation :** Queenie, Kaufmo et Gummigoo n’obtiennent pas une résurrection ou une chronologie nouvelle présentée comme officielle.

### EN-G44-03

Éviter toute parole ou guérison des abstractions.

**Acceptation :** Les 11 formes abstraites utilisent des réactions non verbales ; les cinq formes inventées restent étiquetées originales.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json) · [docs/bible/extensions-characters.json](../../docs/bible/extensions-characters.json).

## 45 — Assets, animation, son et mise en scène

**EN-G45 · P1 · retenue**

Consigner les besoins d’animation et de son sans les produire pendant cette phase de sprites de base.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G45-01

Identifier les poses fixes, futurs cycles, sons et effets par fiche et par propriétaire.

**Acceptation :** Un portrait existant, une pose réutilisée et un cycle inédit ne sont pas comptés comme trois animations livrées.

### EN-G45-02

Préserver silhouettes, proportions, accessoires, alpha et ancrages du modèle de référence.

**Acceptation :** La revue compare chaque variante à ses références et au rendu natif ; un contrôle technique ne certifie pas le 1:1.

### EN-G45-03

Prévoir sorties courtes, sons originaux et réduction des mouvements.

**Acceptation :** Aucun son ne reste actif après abandon de l’aperçu ; aucun flash ou doublage imité n’est obligatoire.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json) · [docs/bible/extensions-characters.json](../../docs/bible/extensions-characters.json).

## 46 — Interface, apprentissage et réseau

**EN-G46 · P0 · adaptée**

Étendre l’entraînement local avant tout jeu en ligne ; le protocole tag/entités doit précéder un futur réseau.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G46-01

Afficher actif, réserve, vie, disponibilité et coût sans surcharger le HUD.

**Acceptation :** La raison d’un refus est visible par texte et icône ; information identique au clavier, tactile et manette.

### EN-G46-02

Ajouter exercices d’appel, de relais, de punition et de conservation de combo.

**Acceptation :** Une séquence peut être enregistrée, rejouée et réinitialisée sans accorder de récompense de progression.

### EN-G46-03

Définir déterminisme, version d’entrée et snapshot avant une implémentation réseau.

**Acceptation :** Le jeu en ligne et le rollback restent différés ; aucune connectivité n’est revendiquée par une fiche.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 47 — Validation, statistiques et ordre d’intégration

**EN-G47 · P0 · retenue**

Mesurer séparément couverture documentaire, assets, intégration et scénarios réussis, sans pourcentage de livraison synthétique trompeur.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | sans objet |
| integration | documentaire |
| tests | validation documentaire |

### EN-G47-01

Associer les 18 cas de l’extension aux contrats de test du projet.

**Acceptation :** Chaque cas indique préconditions, action, résultat attendu et statut à exécuter.

### EN-G47-02

Livrer par tranche : sélection/taunt, aide/relais, entités, duo, bonus/hub, extension du contenu.

**Acceptation :** Une tranche conserve une preuve des deux entrées CainOS et standalone avant changement de statut runtime.

### EN-G47-03

Préserver identifiants, ordre et notes du classeur historique.

**Acceptation :** Les nouvelles feuilles utilisent les IDs EN-G30…67 ; aucune ancienne ligne n’est remplacée par un état déduit.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 48 — Dix fiches de production complémentaires

**EN-G48 · P1 · retenue**

Instancier les modèles A–J dans les JSON de personnages, duos, clashes, entités, bonus, hub et récompenses.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | sans objet |
| integration | documentaire |
| tests | validation documentaire |

### EN-G48-01

Fournir 64 fiches A et B avec transitions spécifiques et contrôles communs.

**Acceptation :** Les 64 IDs runtime sont couverts sans doublon ; chaque sortie est un texte propre au personnage.

### EN-G48-02

Renseigner les fiches C–G pour les profils, interventions, supers, clashes et entités.

**Acceptation :** Chaque fiche réfère un contrat partagé et ses exceptions ; aucun champ requis n’est remplacé par une promesse vague.

### EN-G48-03

Renseigner H–J pour les huit bonus, cinq zones et règles de récompense.

**Acceptation :** Les IDs des règles, contenus et zones existent ; les conditions sont interprétables sans relire une conversation.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json) · [docs/bible/extensions-characters.json](../../docs/bible/extensions-characters.json).

## 49 — Instruction d’intégration et références

**EN-G49 · P0 · retenue**

Rendre l’intégration reproductible par un générateur dédié et conserver la référence complète à chaque section.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | sans objet |
| integration | documentaire |
| tests | validation documentaire |

### EN-G49-01

Conserver les références officielles du guide comme références de mécanique, sans importer leur fiction.

**Acceptation :** Mortal Kombat, Tekken ou FighterZ restent des inspirations de système ; leurs termes ne sont pas attribués au Circus.

### EN-G49-02

Documenter comment reconstruire les JSON, Markdown et tables Excel.

**Acceptation :** Le mode --check détecte toute dérive des fichiers générés ou de la provenance.

### EN-G49-03

Inscrire les limites d’implémentation et de fidélité à côté des comptes.

**Acceptation :** Les douze duos et huit bonus sont comptés comme spécifiés ; les anciens tests moteur restent historiques.

**Références :** [docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) · [docs/bible/extensions-teams-bonus.json](../../docs/bible/extensions-teams-bonus.json).

## 50 — Portée du système de déblocage

**EN-G50 · P0 · retenue-conception**

Appliquer les mêmes dimensions aux artistes, aides, tenues, scènes et nouveaux modes, sans retirer les accès existants.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G50-01

Créer un catalogue de contenu aux identifiants distincts de ses noms traduits.

**Acceptation :** Chaque ID actuel est relié à sa catégorie et à ses dépendances ; les contenus proposés portent un préfixe distinct.

### EN-G50-02

Distinguer absence d’asset et véritable condition d’accès.

**Acceptation :** Un asset manquant affiche une indisponibilité technique et ne demande jamais de progression ni de paiement.

### EN-G50-03

Définir les fonctions retenues, différées et non activées.

**Acceptation :** Le soutien externe est spécifié et désactivé ; le mode libre historique reste accessible.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 51 — Découverte, droits, installation et compatibilité

**EN-G51 · P0 · retenue-conception**

Le moteur de droits cible combine quatre axes ; aucun booléen unique unlocked ne remplace ces dimensions.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G51-01

Séparer secret/indice/identifié du droit permanent/temporaire/en attente.

**Acceptation :** Un costume peut être acquis sans propriétaire découvert ; un droit actif n’impose pas la révélation du nom.

### EN-G51-02

Évaluer installation et restrictions du mode après la résolution des sources de droit.

**Acceptation :** Acquis mais non installé, incompatible ou incomplet reçoivent trois explications différentes.

### EN-G51-03

Déterminer une action utile et tous les obstacles secondaires.

**Acceptation :** Le focus révèle le prochain objectif ou l’installation requise sans faux message d’abonnement.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 52 — Langage visuel des verrous

**EN-G52 · P1 · retenue-conception**

Charte originale : fiche de distribution C&A, billet perforé et volet de rideau ; ces motifs sont une interface Encore, pas des artefacts canoniques.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G52-01

Utiliser silhouette noire contrastée et sceau de billet pour les identités déjà révélables.

**Acceptation :** Le contour reste lisible sur fonds sombres et ne cache ni focus ni condition courte.

### EN-G52-02

Employer un symbole neutre pour les secrets complets.

**Acceptation :** Nom, alt, titre, voix, catégorie de tenue et miniature ne révèlent pas le personnage.

### EN-G52-03

Prévoir focus, refus bref, récompense prête et révélation à mouvement réduit.

**Acceptation :** Les états se distinguent par forme et texte ; aucune révélation ne bloque la navigation ou ne force des flashes.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 53 — Slots d’artistes et de partenaires

**EN-G53 · P1 · retenue-conception**

La distribution existante reste libre. Les futurs prêts scénarisés et récompenses sont portés par des droits supplémentaires.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G53-01

Permettre le focus d’un slot verrouillé et ouvrir une fiche explicative à confirmation.

**Acceptation :** Un joueur ne peut confirmer un contenu indisponible ni être bloqué dans une boucle d’erreur.

### EN-G53-02

Séparer droit de l’artiste, rôle d’assistance, compatibilité du duo et scène débloquée.

**Acceptation :** Posséder deux membres ne prouve pas la compatibilité narrative ou l’obtention d’une fin dramatique.

### EN-G53-03

Inclure les entités indispensables au kit dans l’accès du combattant.

**Acceptation :** Aucun piège, projectile ou compagnon nécessaire n’est vendu ou verrouillé séparément.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 54 — Tenues, palettes et dépendances

**EN-G54 · P1 · retenue-conception**

Les tenues actuelles conservent leur accès ; les futures récompenses exposent propriétaire, période, découverte et permanence.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G54-01

Conserver une tenue acquise avant son propriétaire et expliquer sa dépendance.

**Acceptation :** Une récompense de costume survit au rechargement ; aucun faux verrou d’abonnement ne remplace le personnage manquant.

### EN-G54-02

Préserver kit, collisions, portée et ressources pour une apparence cosmétique.

**Acceptation :** Les dix slots équipés sont identiques à ceux du combattant ; un changement de règle impose une variante explicite.

### EN-G54-03

Documenter aperçu, équipement, doublons et restrictions de campagne.

**Acceptation :** Le menu peut montrer une tenue sans l’équiper ; une scène de période imposée utilise sa tenue annoncée.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 55 — Stages, variantes et destinations

**EN-G55 · P1 · retenue-conception**

Conserver le catalogue et ses arrangements ; séparer droit de sélection, participation, confort et destination reliée.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G55-01

Inclure versions statique et vivante dans le même accès lorsque seule la présentation change.

**Acceptation :** Réduire les mouvements n’exige aucune acquisition supplémentaire et ne change pas les collisions.

### EN-G55-02

Autoriser la participation à une arène cosmétique d’un partenaire sans accorder son choix permanent.

**Acceptation :** Les deux clients disposent des assets avant le match ; l’invité ne reçoit pas un achat fictif.

### EN-G55-03

Préparer les destinations de transition avant le départ.

**Acceptation :** Un droit manquant n’entraîne jamais un chargement bloqué au milieu d’un combat ; remplacement annoncé avant match.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 56 — Modes et parcours verrouillés

**EN-G56 · P1 · adaptée**

Ne pas verrouiller rétroactivement les neuf modes existants ; réserver les conditions à des nouveaux défis et parcours optionnels.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G56-01

Laisser entraînement, réglages et apprentissage accessibles.

**Acceptation :** Aucun prérequis d’un mode ne dépend exclusivement de ce même mode.

### EN-G56-02

Décrire les nouvelles tuiles avec objectif, condition, reprise et route alternative.

**Acceptation :** Une tuile non implémentée est annoncée en préparation, sans chaîne de déblocage fictive.

### EN-G56-03

Conserver progression et récompenses après fin d’un éventuel accès temporaire.

**Acceptation :** Retour d’accès restaure les étapes connues ; la sauvegarde n’est pas effacée.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 57 — Conditions, progression et attribution

**EN-G57 · P0 · retenue-conception**

Créer des expressions ET/OU sur les événements validés : routes terminées, défis, bonus, coffre ciblé et source externe vérifiée.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G57-01

Écrire chaque condition en arbre typé avec compteur, cible et périmètre.

**Acceptation :** Les alternatives gratuites restent visibles ; ET et OU donnent des résultats distincts sur les jeux de données de référence.

### EN-G57-02

Rendre la transaction d’attribution idempotente avec un identifiant d’événement.

**Acceptation :** Deux notifications ou deux clics n’accordent ni deux clés, ni deux lots, ni une nouvelle expiration.

### EN-G57-03

Prévoir rétroactivité uniquement pour les événements réellement conservés.

**Acceptation :** Les stories, medals et challenges présents sont migrés ; une performance non enregistrée n’est pas supposée.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 58 — Exploration, récompenses et révélation

**EN-G58 · P1 · retenue-conception**

Les coffres des Archives accordent des récompenses ciblées ; la révélation suit l’attribution sauvegardée et peut être abrégée.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G58-01

Décrire découverte, condition, réclamation, sauvegarde et présentation comme étapes distinctes.

**Acceptation :** Une interruption après attribution retrouve le contenu acquis, même si la révélation n’a pas été vue.

### EN-G58-02

Ne débiter la ressource qu’avec l’écriture du lot accordé.

**Acceptation :** Échec d’écriture n’efface aucune clé ; relance n’effectue pas un second débit.

### EN-G58-03

Proposer une liste accessible des coffres prêts et des conditions.

**Acceptation :** La voie menu produit exactement le même événement que l’interaction dans le hub.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 59 — Soutiens et modèles d’acquisition

**EN-G59 · P2 · retenue-specification-inactive**

Prévoir uniquement des apparences ou ambiances originales dédiées ; l’offre, les tarifs et les niveaux n’existent pas dans cette livraison.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G59-01

Distinguer avantage permanent, catalogue temporaire et lot par période.

**Acceptation :** Chaque avantage nomme explicitement son modèle et ne transforme pas une annulation en retrait automatique d’un acquis permanent.

### EN-G59-02

Prévoir une voie gratuite explicite pour les exemples de récompense retenus.

**Acceptation :** La condition défi OU soutien est exposée et le code de droit conserve deux sources indépendantes.

### EN-G59-03

Éviter avantage compétitif, camouflage supérieur et changement de géométrie.

**Acceptation :** Tenue et scène de soutien conservent les règles communes ; le confort reste accessible sans soutien.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 60 — Liaison à Patreon ou équivalent

**EN-G60 · P2 · différée-intégration**

Contrat serveur futur seulement. Aucun bouton d’achat, secret, token ni rôle d’abonné fabriqué côté client.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G60-01

Résoudre le compte et vérifier l’admissibilité côté service autorisé avant attribution.

**Acceptation :** Un profil local modifié ne crée aucun droit externe ; seuls des événements validés deviennent des sources.

### EN-G60-02

Traiter liaison, déliaison, baisse de niveau, annulation, retard et webhooks désordonnés.

**Acceptation :** La source concernée est mise à jour selon sa version d’événement ; une source permanente indépendante reste valable.

### EN-G60-03

Réviser les champs/API officiels lors de l’implémentation et afficher les conditions réelles.

**Acceptation :** Aucune URL d’offre ni durée commerciale n’est annoncée sans configuration effective et testée.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 61 — Expiration, incidents et hors ligne

**EN-G61 · P0 · retenue-conception**

Une erreur réseau donne un état inconnu ; les acquisitions permanentes locales restent utilisables et le match autorisé se termine.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G61-01

Résoudre l’union des sources valides sans révoquer un acquis par simple expiration d’abonnement.

**Acceptation :** La matrice inclut permanent+temporaire expiré, remboursement d’une source et seconde source valide.

### EN-G61-02

Appliquer une expiration confirmée au prochain écran de sélection.

**Acceptation :** Aucun costume, stage ou membre ne disparaît en plein combo ; le snapshot du match reste immuable.

### EN-G61-03

Définir une tolérance hors ligne uniquement pour un justificatif serveur daté.

**Acceptation :** Une date absente n’est pas inventée ; le hors ligne conserve les acquisitions sans valider une nouvelle admissibilité.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 62 — Local, multijoueur, entraînement et replays

**EN-G62 · P0 · retenue-conception**

Les politiques futures distinguent consultation, sélection, participation et essai ; les replays historiques ne sont pas réécrits.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G62-01

Définir profil principal, invité local et compte connecté séparément.

**Acceptation :** Un invité peut participer sans copier les achats dans sa collection ; les droits sont attribués au bon profil.

### EN-G62-02

Valider composition, version et installation avant match.

**Acceptation :** Lancement impossible produit une solution annoncée ; aucune paire ne commence avec un membre indisponible.

### EN-G62-03

Garder les références visuelles nécessaires aux replays sans leur faire accorder de récompense.

**Acceptation :** Lecture seule, anciennes règles et accès à l’affichage sont distincts des droits de sélection actuels.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 63 — Textes, accessibilité et surprises

**EN-G63 · P0 · retenue-conception**

Utiliser des textes courts associés au billet C&A et un détail consultable ; les identités secrètes restent secrètes dans le DOM accessible.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G63-01

Rendre tous les états compréhensibles par texte, forme, focus et progression.

**Acceptation :** La grille reste navigable à la manette ; aucun état ne dépend seulement de couleur, de son ou d’animation.

### EN-G63-02

Masquer nom, alt, tooltip, voix, miniature et conditions trop révélatrices selon la découverte.

**Acceptation :** Le lecteur d’écran ne révèle pas un artiste secret ni un costume nommant son propriétaire.

### EN-G63-03

Ne pas confondre service indisponible et abonnement terminé.

**Acceptation :** Les messages de référence ont une condition d’emploi vérifiable et une action utile.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 64 — Production, sauvegarde et validation des droits

**EN-G64 · P0 · retenue-conception**

Ajouter ultérieurement un registre versionné des sources, sans supprimer l’ancien profil ni son mécanisme de secours.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | à produire / selon fiche |
| integration | non intégré ; socle selon observation |
| tests | à exécuter |

### EN-G64-01

Prévoir migration, copie de secours, validation bornée et restauration.

**Acceptation :** Les anciens réglages, résultats, routes, programme actif et replays restent inchangés après migration.

### EN-G64-02

Associer les 22 cas d’acceptation source à des scénarios Encore.

**Acceptation :** Chaque cas décrit données, action, message, droit et persistance attendus ; son statut reste à exécuter.

### EN-G64-03

Compter séparément contenu livré, règle conçue et scénario réellement réussi.

**Acceptation :** Une silhouette prête n’ajoute pas un combattant produit ; la collection du joueur n’est pas un indicateur de production.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 65 — Six fiches d’accès et de droits

**EN-G65 · P1 · retenue**

Fournir modèles A–F instanciés par le catalogue, les règles, l’avantage inactif, la charte, la scène et les scénarios de validation.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | sans objet |
| integration | documentaire |
| tests | validation documentaire |

### EN-G65-01

Renseigner contenu/slot, condition de déblocage et dépendances.

**Acceptation :** Chaque ID est stable, chaque condition a un texte et un arbre, chaque dépendance existe.

### EN-G65-02

Renseigner avantage de soutien, charte visuelle et scène spéciale.

**Acceptation :** Les trois modèles séparent politique proposée et offre réellement activée ; le stage possède sélection et participation distinctes.

### EN-G65-03

Renseigner la matrice des droits avec toutes ses sources et états.

**Acceptation :** Les cas n’utilisent jamais un faux booléen unique pour perte de réseau, expiration et asset manquant.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 66 — Instruction d’intégration au projet

**EN-G66 · P0 · retenue**

L’index de bible devient le point d’entrée des trois textes et de leurs adaptations ; aucune fonction n’est implicite.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | sans objet |
| integration | documentaire |
| tests | validation documentaire |

### EN-G66-01

Raccorder extensions au guide, aux personnages, campagnes et futurs lots de production.

**Acceptation :** Les liens relatifs et IDs sont résolus par le générateur ; les deux sources sont consultables intégralement.

### EN-G66-02

Préparer des tables Excel avec ordre stable et colonnes de statut séparées.

**Acceptation :** Le jeu de données feuille conserve un identifiant par ligne, sans déplacer les historiques existants.

### EN-G66-03

Afficher clairement les fonctions encore à intégrer.

**Acceptation :** Taunts dédiés, tag, hub, bonus et offre de soutien ne sont pas annoncés comme jouables par ces documents.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## 67 — Références et vocabulaire des droits

**EN-G67 · P0 · retenue**

Conserver le lexique du guide ; les liens Patreon sont des sources à revalider quand une intégration sera effectivement programmée.

| Axe | État |
| --- | --- |
| design | spécifié |
| assets | sans objet |
| integration | documentaire |
| tests | validation documentaire |

### EN-G67-01

Distinguer acquis, accès temporaire, admissible, installé, compatible et découvert.

**Acceptation :** Les textes du menu et les schémas emploient les mêmes définitions sans confondre droit et visibilité.

### EN-G67-02

Conserver les références D01–D04 dans l’original sans en certifier une relecture réseau.

**Acceptation :** La provenance porte sa date et le statut de vérification actuelle ; aucune règle financière n’est improvisée.

### EN-G67-03

Vérifier les empreintes et les références de tous les fichiers générés.

**Acceptation :** Le générateur --check termine sans dérive, et les fichiers restent reconstructibles depuis leurs sources éditoriales.

**Références :** [docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt](../../docs/bible/references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) · [docs/bible/extensions-access.json](../../docs/bible/extensions-access.json).

## Reconstruction

`node scripts/build-combat-extensions.mjs` reconstruit les JSON et textes de ce dossier. `node scripts/build-combat-extensions.mjs --check` contrôle leur cohérence et les sources. Le générateur ne modifie ni le moteur, ni les images, ni le classeur. [Tables pour le classeur](extensions-workbook-data.json).
