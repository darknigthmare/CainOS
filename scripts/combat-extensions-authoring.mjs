/** Editorial source for the two user-supplied combat extensions.
 * Every new rule, scene and gesture below is an Encore design proposal.
 * This module is consumed by documentation tooling, never by the game runtime.
 */
export const AS_OF = '2026-11-27';
export const BASELINE_COMMIT = '6e44ab75b9c82b4d6fe62a0051287275abc97753';
export const SOURCE_DOCUMENTS = [
  ['general', 'Combat_Games_Guide_General_v1.0.txt', '14o_RrgXucs8Km-x1LQJtMK7rol6mENKy', 55172, '4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7', '00–29'],
  ['extension01', 'Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt', '1rYxKLIbz67L1sstmJWsga76uK7cX2mXF', 60589, '330fb7485a7a52b2a20f855646c940aaac0fcd9510032bc84b2e17c518edd25f', '30–49'],
  ['extension02', 'Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt', '1qr8hgvvjFqdWzcGaf1DPeKromk75bBn0', 47334, '08b57ea542e83c487fef3276997a612d4657f2ee9ed4f8e46b0bf65a2778038b', '50–67'],
].map(([id, filename, driveFileId, bytes, sha256, sections]) => ({
  id, filename, path: `docs/bible/references/${filename}`, driveFileId,
  url: `https://drive.google.com/file/d/${driveFileId}/view`, bytes, sha256, sections,
  preservedVerbatim: true, retrievedAt: AS_OF, provenance: 'Original fourni par le propriétaire du projet dans son Drive ; aucune reconstruction du texte.'
}));

// section, title, priority, decision, observed status, adaptation,
// three pairs of [requirement, observable acceptance criterion].
export const SECTION_BLUEPRINTS = [
  ['30', 'Portée et rattachement au guide général', 'P0', 'retenue', 'documentation',
    'Prolonger les identifiants EN-G00…29 par EN-G30…67 ; conserver le duel existant et la phase de bases fixes.', [
      ['Conserver les deux originaux et leur provenance avec le guide général déjà présent.', 'Les trois tailles et SHA-256 correspondent aux fichiers Drive ; le guide général n’est pas dupliqué.'],
      ['Relier chaque rubrique aux contrats Encore, aux sources du runtime et aux tâches restantes.', 'Les 38 sections existent une fois et leurs exigences disposent d’identifiants uniques et de critères.'],
      ['Séparer documenté, asset produit, moteur intégré et scénario exécuté.', 'Aucun statut de conception ne ferme un test de tag, de dessin, de déblocage ou de fidélité.'],
    ]],
  ['31', 'Taunts : personnalité et réactions', 'P1', 'retenue', 'absent-dedicated-action',
    'Une provocation silencieuse de présentation par combattant ; la récupération utility actuelle garde ses règles et son nom.', [
      ['Associer 64 gestes avec entrée, pose, sortie, vulnérabilité et limites de personnalité.', 'Chaque ID du roster possède un brief unique ; les abstractions ne parlent pas et aucun souvenir inédit n’est affirmé.'],
      ['Créer ultérieurement une action TAUNT distincte de utility, sans gain de ressource par défaut.', 'Une commande refusée ne dépense rien ; un coup interrompt le geste ; aucun bonus de dégâts n’est accordé par la pose.'],
      ['Prévoir une variante envers le rival et une option de fréquence des voix.', 'La variante utilise la relation de route étiquetée fan-game ; voix répétées et mouvements réduits n’altèrent pas le contrôle.'],
    ]],
  ['32', 'Sélection, confirmation et désélection', 'P1', 'retenue', 'static-selection-present',
    'Conserver les portraits existants ; spécifier huit états de présentation et une sortie propre par artiste.', [
      ['Distinguer focus, aperçu, confirmation, attente, tenue, désélection, équipe et départ.', 'Le modèle d’états indique une transition et une action d’annulation pour chaque état.'],
      ['Écrire 64 désélections spécifiques, abrégées sur navigation rapide sans inverser arbitrairement l’entrée.', 'Le choix logique est immédiat ; la sortie nettoie particules, voix et compagnon de l’aperçu abandonné.'],
      ['Maintenir deux joueurs indépendants et des textes accessibles sans spoiler.', 'Deux curseurs, deux costumes du même artiste et une annulation simultanée ne volent ni focus ni choix.'],
    ]],
  ['33', 'Profils d’équipe et catégories de partenaires', 'P1', 'retenue-conception', 'not-implemented',
    'Définir une future Répétition en duo à deux membres, distincte des neuf modes du catalogue existant.', [
      ['Retenir un actif et une réserve avec vie propre ; l’équipe perd après deux KO.', 'Un premier KO déclenche l’entrée du survivant sans jauge et sans réanimation du membre éliminé.'],
      ['Séparer profil assistance, tag et hybride avec rôles affichés avant le match.', 'Une assistance ne devient pas contrôlable ; une entité de kit ne consomme pas automatiquement un slot.'],
      ['Interdire les doublons d’identité ou de version dans un duo scénarisé.', 'Personnage et abstraction du même personnage sont refusés en histoire ; le mode simulation explicite peut les autoriser.'],
    ]],
  ['34', 'Commandes, jauges et disponibilité', 'P0', 'retenue-conception', 'not-implemented',
    'Réserver des actions remappables séparées pour taunt, aide, relais et super ; aucun détournement des dix slots historiques.', [
      ['Proposer une jauge de duo distincte des ressources intrinsèques et du super individuel.', 'Le contrat fixe capacité, coût, recharge, horloge, réservations et remboursement ; les valeurs sont marquées à équilibrer.'],
      ['Tester disponibilité du partenaire avant de réserver ou débiter la jauge.', 'Un partenaire engagé, KO ou en récupération refuse l’action avec un motif ; deux actions ne dépensent jamais le même crédit.'],
      ['Versionner l’encodage d’entrées avant toute intégration de commandes supplémentaires.', 'Un replay 0.5/0.7 garde SLOT_ORDER et le résultat historique ; la nouvelle règle porte sa propre version.'],
    ]],
  ['35', 'Assistances ponctuelles', 'P1', 'retenue-conception', 'not-implemented',
    'Chaque intervention réutilise une technique du partenaire référencée par son slot ; aucune aptitude officielle nouvelle n’est déduite.', [
      ['Décrire appel, arrivée, action, sortie, récupération et interruption pour les duos prioritaires.', 'L’entrée est annoncée, le soutien reste punissable et un second appel attend sa sortie complète.'],
      ['Conserver les dégâts subis par la réserve et l’historique partagé du combo.', 'Toucher actif et soutien ne double pas la jauge gagnée ; les deux pertes de vie sont attribuées une fois.'],
      ['Définir l’échec sur mur, transition, KO et géant incompatible.', 'Le soutien quitte proprement la scène ; la réserve n’est ni téléportée dans un mur ni réanimée par un rappel.'],
    ]],
  ['36', 'Tag : transfert réel du contrôle', 'P1', 'retenue-conception', 'not-implemented',
    'Le relais est une future règle de simulation, distincte d’une permutation de portrait ou d’une composition de scène.', [
      ['Spécifier relais neutre, après confirmation, secours, KO et relais de scénario séparément.', 'Chaque forme possède coût, fenêtre, invulnérabilité éventuelle, point de contrôle et résolution en échec.'],
      ['Conserver vie, munitions, récupérations, états et limites du combo à travers le switch.', 'Aucun reset de rebond, piège, jauge ou cooldown n’est obtenu en alternant les deux membres.'],
      ['Fixer la cible des projectiles et le sort des entités lors du départ.', 'Les IDs de propriétaire restent stables ; un projectile ne suit pas un nouveau membre sans propriété de ciblage annoncée.'],
    ]],
  ['37', 'Techniques combinées et supers d’équipe', 'P1', 'retenue-conception', 'not-implemented',
    'Douze compositions reçoivent un numéro original avec contribution visible de chacun et aucun nouveau pouvoir canonique.', [
      ['Lier chaque super à deux membres, deux slots existants et une justification de rencontre.', 'Les 12 duos référencent des combattants distincts et des techniques présentes dans le catalogue.'],
      ['Engager la chorégraphie longue uniquement sur une confirmation compatible.', 'Garde, raté, interruption et cible géante disposent d’une résolution courte sans victoire forcée.'],
      ['Bloquer appels concurrents et définir sortie, placement et continuation.', 'Les deux participants redeviennent disponibles selon le même état de simulation après séquence complète ou abrégée.'],
    ]],
  ['38', 'Finishers d’équipe et fins dramatiques', 'P1', 'retenue-conception', 'solo-finales-present',
    'Nom éditorial retenu : Derniers Actes en duo. Les finales individuelles existantes restent inchangées.', [
      ['Séparer super de combat, conclusion collective et tableau conditionnel.', 'Une finale après verdict ne modifie ni le vainqueur, ni la progression, ni les dégâts déjà enregistrés.'],
      ['Définir les conditions de chaque duo : adversaire, décor, versions, partenaire vivant et contexte.', 'Les scènes mémorielles ne passent jamais pour un retour canonique ; un partenaire KO entraîne la solution individuelle.'],
      ['Fixer priorité et variantes pour morphologies incompatibles.', 'Fin dramatique spécifique, finale duo, finale solo puis victoire normale sont évaluées une seule fois dans cet ordre.'],
    ]],
  ['39', 'Clashes et confrontations avec QTE', 'P2', 'adaptée', 'not-implemented',
    'Limiter les clashes interactifs aux défis et chapitres solo ; les versus compétitifs conservent des règles déterministes sans QTE.', [
      ['Créer deux familles de clash originales : accessoires opposés et poussée contre décor simulé.', 'Seules les paires de techniques inscrites dans la table peuvent déclencher le clash ; aucun choc automatique universel.'],
      ['Prévoir commande maintenue ou pression unique, sans martelage obligatoire.', 'Réussite, échec, égalité, absence de réponse, pause et déconnexion sont définis ; option automatique disponible en solo.'],
      ['Résoudre le résultat du clash avant la conclusion du duel.', 'La scène ne renverse pas une victoire déjà attribuée ; seuils et résultat sont enregistrés dans la future version de replay.'],
    ]],
  ['40', 'Entités indépendantes et objets placés', 'P1', 'adaptée', 'projectiles-and-traps-present',
    'S’appuyer sur projectiles et pièges existants ; ne pas transformer un motif illustré en compagnon autonome.', [
      ['Indexer les slots projectile et trap par propriétaire et règles réelles.', 'Chaque enregistrement garde ID, slot, coût, durée, cap et champs absents comme absents ; aucun pouvoir supposé.'],
      ['Spécifier le budget actif et le cycle d’une entité native distincte de la réserve.', 'Invocation, ordres, neutralisation et fin de vie sont bornés ; une ressource de kit demeure liée à son propriétaire.'],
      ['Définir comportement en KO, réserve, interruption et changement d’arène.', 'Les objets périmés ne survivent pas à une nouvelle manche ; leurs anciens propriétaires restent identifiables pour les replays.'],
    ]],
  ['41', 'Projectiles persistants et attribution', 'P0', 'adaptée', 'projectile-runtime-present',
    'Prolonger le contrat actuel de réflexion sans changer le motif visuel de l’attaque d’origine.', [
      ['Séparer propriétaire initial, propriétaire de dégâts, cible et identité graphique.', 'La clef de Jax réfléchie ne devient pas un projectile de Kinger ; le crédit de dégâts suit les règles de réflexion.'],
      ['Borner nombre, durée, rebonds, fréquence de touche et nettoyage de chaque famille.', 'Un projectile ou piège ne permet pas une boucle infinie entre relais, contre et transition.'],
      ['Conserver forme, collision et lisibilité avec les costumes crossover.', 'Un skin ne modifie pas portée ni délai ; tout écart visible est documenté avant publication.'],
    ]],
  ['42', 'Stages bonus et épreuves narratives', 'P1', 'retenue-conception', 'sequential-survival-present-no-bonus-stage',
    'Huit épreuves situées dans les lieux du jeu : camion de répétition, convoi, nid, service Spudsy, manoir, softball, balises et silhouettes.', [
      ['Donner objectif mesurable, échec non bloquant, score, reprise et récompense à chaque bonus.', 'Les huit fiches possèdent limites, contrôle d’entrée/sortie et condition de victoire ; une défaite ne ferme pas la campagne.'],
      ['Distinguer horde simultanée et survie actuelle à dix duels successifs.', 'Le statut de horde reste non intégré tant que plusieurs ennemis réellement simultanés ne sont pas pris en charge.'],
      ['Utiliser le décor réel associé, sa perspective latérale et des objets séparés.', 'Aucun fond générique de scène de théâtre ne remplace Candy Canyon, le restaurant, le manoir ou le terrain de softball.'],
    ]],
  ['43', 'Espace d’exploration et de déblocage', 'P1', 'retenue-conception', 'archive-menu-present-no-hub',
    'Les Archives des répétitions sont un hub original de simulation Encore, séparé du menu Archives existant et de la géographie canonique.', [
      ['Décrire cinq salles et quatre connexions réciproques avec seuils aux murs.', 'Le graphe est accessible depuis l’accueil ; chaque arrivée reste hors collision et ne place aucune porte au centre d’une salle.'],
      ['Relier coffres ciblés aux récompenses, sans tirage payant ni perte de clé après interruption.', 'Chaque coffre possède un contenu stable et une transaction idempotente ; retour au hub conserve son état.'],
      ['Prévoir carte, journal, raccourci et alternative par menu accessible.', 'Un joueur peut consulter les conditions et réclamer une récompense sans devoir réussir une manipulation de déplacement.'],
    ]],
  ['44', 'Relations, période et compatibilités', 'P0', 'retenue', 'source-annotations-present',
    'Les duos, dialogues et fins écrits ici sont des propositions Encore ; les fiches de référence gardent leur niveau d’incertitude.', [
      ['Classer personnages, scènes et costumes selon les cinq statuts de fidélité.', 'Un libellé d’archive ou une illustration générée ne devient pas une preuve canonique.'],
      ['Conserver les disparus dans une répétition mémorielle ou une simulation explicite.', 'Queenie, Kaufmo et Gummigoo n’obtiennent pas une résurrection ou une chronologie nouvelle présentée comme officielle.'],
      ['Éviter toute parole ou guérison des abstractions.', 'Les 11 formes abstraites utilisent des réactions non verbales ; les cinq formes inventées restent étiquetées originales.'],
    ]],
  ['45', 'Assets, animation, son et mise en scène', 'P1', 'retenue', 'static-base-production-phase',
    'Consigner les besoins d’animation et de son sans les produire pendant cette phase de sprites de base.', [
      ['Identifier les poses fixes, futurs cycles, sons et effets par fiche et par propriétaire.', 'Un portrait existant, une pose réutilisée et un cycle inédit ne sont pas comptés comme trois animations livrées.'],
      ['Préserver silhouettes, proportions, accessoires, alpha et ancrages du modèle de référence.', 'La revue compare chaque variante à ses références et au rendu natif ; un contrôle technique ne certifie pas le 1:1.'],
      ['Prévoir sorties courtes, sons originaux et réduction des mouvements.', 'Aucun son ne reste actif après abandon de l’aperçu ; aucun flash ou doublage imité n’est obligatoire.'],
    ]],
  ['46', 'Interface, apprentissage et réseau', 'P0', 'adaptée', 'local-training-and-replays-present',
    'Étendre l’entraînement local avant tout jeu en ligne ; le protocole tag/entités doit précéder un futur réseau.', [
      ['Afficher actif, réserve, vie, disponibilité et coût sans surcharger le HUD.', 'La raison d’un refus est visible par texte et icône ; information identique au clavier, tactile et manette.'],
      ['Ajouter exercices d’appel, de relais, de punition et de conservation de combo.', 'Une séquence peut être enregistrée, rejouée et réinitialisée sans accorder de récompense de progression.'],
      ['Définir déterminisme, version d’entrée et snapshot avant une implémentation réseau.', 'Le jeu en ligne et le rollback restent différés ; aucune connectivité n’est revendiquée par une fiche.'],
    ]],
  ['47', 'Validation, statistiques et ordre d’intégration', 'P0', 'retenue', 'documentation',
    'Mesurer séparément couverture documentaire, assets, intégration et scénarios réussis, sans pourcentage de livraison synthétique trompeur.', [
      ['Associer les 18 cas de l’extension aux contrats de test du projet.', 'Chaque cas indique préconditions, action, résultat attendu et statut à exécuter.'],
      ['Livrer par tranche : sélection/taunt, aide/relais, entités, duo, bonus/hub, extension du contenu.', 'Une tranche conserve une preuve des deux entrées CainOS et standalone avant changement de statut runtime.'],
      ['Préserver identifiants, ordre et notes du classeur historique.', 'Les nouvelles feuilles utilisent les IDs EN-G30…67 ; aucune ancienne ligne n’est remplacée par un état déduit.'],
    ]],
  ['48', 'Dix fiches de production complémentaires', 'P1', 'retenue', 'documentation',
    'Instancier les modèles A–J dans les JSON de personnages, duos, clashes, entités, bonus, hub et récompenses.', [
      ['Fournir 64 fiches A et B avec transitions spécifiques et contrôles communs.', 'Les 64 IDs runtime sont couverts sans doublon ; chaque sortie est un texte propre au personnage.'],
      ['Renseigner les fiches C–G pour les profils, interventions, supers, clashes et entités.', 'Chaque fiche réfère un contrat partagé et ses exceptions ; aucun champ requis n’est remplacé par une promesse vague.'],
      ['Renseigner H–J pour les huit bonus, cinq zones et règles de récompense.', 'Les IDs des règles, contenus et zones existent ; les conditions sont interprétables sans relire une conversation.'],
    ]],
  ['49', 'Instruction d’intégration et références', 'P0', 'retenue', 'documentation',
    'Rendre l’intégration reproductible par un générateur dédié et conserver la référence complète à chaque section.', [
      ['Conserver les références officielles du guide comme références de mécanique, sans importer leur fiction.', 'Mortal Kombat, Tekken ou FighterZ restent des inspirations de système ; leurs termes ne sont pas attribués au Circus.'],
      ['Documenter comment reconstruire les JSON, Markdown et tables Excel.', 'Le mode --check détecte toute dérive des fichiers générés ou de la provenance.'],
      ['Inscrire les limites d’implémentation et de fidélité à côté des comptes.', 'Les douze duos et huit bonus sont comptés comme spécifiés ; les anciens tests moteur restent historiques.'],
    ]],
  ['50', 'Portée du système de déblocage', 'P0', 'retenue-conception', 'no-access-catalogue-at-baseline',
    'Appliquer les mêmes dimensions aux artistes, aides, tenues, scènes et nouveaux modes, sans retirer les accès existants.', [
      ['Créer un catalogue de contenu aux identifiants distincts de ses noms traduits.', 'Chaque ID actuel est relié à sa catégorie et à ses dépendances ; les contenus proposés portent un préfixe distinct.'],
      ['Distinguer absence d’asset et véritable condition d’accès.', 'Un asset manquant affiche une indisponibilité technique et ne demande jamais de progression ni de paiement.'],
      ['Définir les fonctions retenues, différées et non activées.', 'Le soutien externe est spécifié et désactivé ; le mode libre historique reste accessible.'],
    ]],
  ['51', 'Découverte, droits, installation et compatibilité', 'P0', 'retenue-conception', 'not-implemented',
    'Le moteur de droits cible combine quatre axes ; aucun booléen unique unlocked ne remplace ces dimensions.', [
      ['Séparer secret/indice/identifié du droit permanent/temporaire/en attente.', 'Un costume peut être acquis sans propriétaire découvert ; un droit actif n’impose pas la révélation du nom.'],
      ['Évaluer installation et restrictions du mode après la résolution des sources de droit.', 'Acquis mais non installé, incompatible ou incomplet reçoivent trois explications différentes.'],
      ['Déterminer une action utile et tous les obstacles secondaires.', 'Le focus révèle le prochain objectif ou l’installation requise sans faux message d’abonnement.'],
    ]],
  ['52', 'Langage visuel des verrous', 'P1', 'retenue-conception', 'not-implemented',
    'Charte originale : fiche de distribution C&A, billet perforé et volet de rideau ; ces motifs sont une interface Encore, pas des artefacts canoniques.', [
      ['Utiliser silhouette noire contrastée et sceau de billet pour les identités déjà révélables.', 'Le contour reste lisible sur fonds sombres et ne cache ni focus ni condition courte.'],
      ['Employer un symbole neutre pour les secrets complets.', 'Nom, alt, titre, voix, catégorie de tenue et miniature ne révèlent pas le personnage.'],
      ['Prévoir focus, refus bref, récompense prête et révélation à mouvement réduit.', 'Les états se distinguent par forme et texte ; aucune révélation ne bloque la navigation ou ne force des flashes.'],
    ]],
  ['53', 'Slots d’artistes et de partenaires', 'P1', 'retenue-conception', 'all-roster-selectable-at-baseline',
    'La distribution existante reste libre. Les futurs prêts scénarisés et récompenses sont portés par des droits supplémentaires.', [
      ['Permettre le focus d’un slot verrouillé et ouvrir une fiche explicative à confirmation.', 'Un joueur ne peut confirmer un contenu indisponible ni être bloqué dans une boucle d’erreur.'],
      ['Séparer droit de l’artiste, rôle d’assistance, compatibilité du duo et scène débloquée.', 'Posséder deux membres ne prouve pas la compatibilité narrative ou l’obtention d’une fin dramatique.'],
      ['Inclure les entités indispensables au kit dans l’accès du combattant.', 'Aucun piège, projectile ou compagnon nécessaire n’est vendu ou verrouillé séparément.'],
    ]],
  ['54', 'Tenues, palettes et dépendances', 'P1', 'retenue-conception', 'wardrobe-present-no-entitlements',
    'Les tenues actuelles conservent leur accès ; les futures récompenses exposent propriétaire, période, découverte et permanence.', [
      ['Conserver une tenue acquise avant son propriétaire et expliquer sa dépendance.', 'Une récompense de costume survit au rechargement ; aucun faux verrou d’abonnement ne remplace le personnage manquant.'],
      ['Préserver kit, collisions, portée et ressources pour une apparence cosmétique.', 'Les dix slots équipés sont identiques à ceux du combattant ; un changement de règle impose une variante explicite.'],
      ['Documenter aperçu, équipement, doublons et restrictions de campagne.', 'Le menu peut montrer une tenue sans l’équiper ; une scène de période imposée utilise sa tenue annoncée.'],
    ]],
  ['55', 'Stages, variantes et destinations', 'P1', 'retenue-conception', 'stage-catalogue-present',
    'Conserver le catalogue et ses arrangements ; séparer droit de sélection, participation, confort et destination reliée.', [
      ['Inclure versions statique et vivante dans le même accès lorsque seule la présentation change.', 'Réduire les mouvements n’exige aucune acquisition supplémentaire et ne change pas les collisions.'],
      ['Autoriser la participation à une arène cosmétique d’un partenaire sans accorder son choix permanent.', 'Les deux clients disposent des assets avant le match ; l’invité ne reçoit pas un achat fictif.'],
      ['Préparer les destinations de transition avant le départ.', 'Un droit manquant n’entraîne jamais un chargement bloqué au milieu d’un combat ; remplacement annoncé avant match.'],
    ]],
  ['56', 'Modes et parcours verrouillés', 'P1', 'adaptée', 'all-nine-modes-free-at-baseline',
    'Ne pas verrouiller rétroactivement les neuf modes existants ; réserver les conditions à des nouveaux défis et parcours optionnels.', [
      ['Laisser entraînement, réglages et apprentissage accessibles.', 'Aucun prérequis d’un mode ne dépend exclusivement de ce même mode.'],
      ['Décrire les nouvelles tuiles avec objectif, condition, reprise et route alternative.', 'Une tuile non implémentée est annoncée en préparation, sans chaîne de déblocage fictive.'],
      ['Conserver progression et récompenses après fin d’un éventuel accès temporaire.', 'Retour d’accès restaure les étapes connues ; la sauvegarde n’est pas effacée.'],
    ]],
  ['57', 'Conditions, progression et attribution', 'P0', 'retenue-conception', 'stories-challenges-medals-present',
    'Créer des expressions ET/OU sur les événements validés : routes terminées, défis, bonus, coffre ciblé et source externe vérifiée.', [
      ['Écrire chaque condition en arbre typé avec compteur, cible et périmètre.', 'Les alternatives gratuites restent visibles ; ET et OU donnent des résultats distincts sur les jeux de données de référence.'],
      ['Rendre la transaction d’attribution idempotente avec un identifiant d’événement.', 'Deux notifications ou deux clics n’accordent ni deux clés, ni deux lots, ni une nouvelle expiration.'],
      ['Prévoir rétroactivité uniquement pour les événements réellement conservés.', 'Les stories, medals et challenges présents sont migrés ; une performance non enregistrée n’est pas supposée.'],
    ]],
  ['58', 'Exploration, récompenses et révélation', 'P1', 'retenue-conception', 'hub-not-implemented',
    'Les coffres des Archives accordent des récompenses ciblées ; la révélation suit l’attribution sauvegardée et peut être abrégée.', [
      ['Décrire découverte, condition, réclamation, sauvegarde et présentation comme étapes distinctes.', 'Une interruption après attribution retrouve le contenu acquis, même si la révélation n’a pas été vue.'],
      ['Ne débiter la ressource qu’avec l’écriture du lot accordé.', 'Échec d’écriture n’efface aucune clé ; relance n’effectue pas un second débit.'],
      ['Proposer une liste accessible des coffres prêts et des conditions.', 'La voie menu produit exactement le même événement que l’interaction dans le hub.'],
    ]],
  ['59', 'Soutiens et modèles d’acquisition', 'P2', 'retenue-specification-inactive', 'no-provider-integration',
    'Prévoir uniquement des apparences ou ambiances originales dédiées ; l’offre, les tarifs et les niveaux n’existent pas dans cette livraison.', [
      ['Distinguer avantage permanent, catalogue temporaire et lot par période.', 'Chaque avantage nomme explicitement son modèle et ne transforme pas une annulation en retrait automatique d’un acquis permanent.'],
      ['Prévoir une voie gratuite explicite pour les exemples de récompense retenus.', 'La condition défi OU soutien est exposée et le code de droit conserve deux sources indépendantes.'],
      ['Éviter avantage compétitif, camouflage supérieur et changement de géométrie.', 'Tenue et scène de soutien conservent les règles communes ; le confort reste accessible sans soutien.'],
    ]],
  ['60', 'Liaison à Patreon ou équivalent', 'P2', 'différée-intégration', 'no-provider-integration',
    'Contrat serveur futur seulement. Aucun bouton d’achat, secret, token ni rôle d’abonné fabriqué côté client.', [
      ['Résoudre le compte et vérifier l’admissibilité côté service autorisé avant attribution.', 'Un profil local modifié ne crée aucun droit externe ; seuls des événements validés deviennent des sources.'],
      ['Traiter liaison, déliaison, baisse de niveau, annulation, retard et webhooks désordonnés.', 'La source concernée est mise à jour selon sa version d’événement ; une source permanente indépendante reste valable.'],
      ['Réviser les champs/API officiels lors de l’implémentation et afficher les conditions réelles.', 'Aucune URL d’offre ni durée commerciale n’est annoncée sans configuration effective et testée.'],
    ]],
  ['61', 'Expiration, incidents et hors ligne', 'P0', 'retenue-conception', 'local-profile-present',
    'Une erreur réseau donne un état inconnu ; les acquisitions permanentes locales restent utilisables et le match autorisé se termine.', [
      ['Résoudre l’union des sources valides sans révoquer un acquis par simple expiration d’abonnement.', 'La matrice inclut permanent+temporaire expiré, remboursement d’une source et seconde source valide.'],
      ['Appliquer une expiration confirmée au prochain écran de sélection.', 'Aucun costume, stage ou membre ne disparaît en plein combo ; le snapshot du match reste immuable.'],
      ['Définir une tolérance hors ligne uniquement pour un justificatif serveur daté.', 'Une date absente n’est pas inventée ; le hors ligne conserve les acquisitions sans valider une nouvelle admissibilité.'],
    ]],
  ['62', 'Local, multijoueur, entraînement et replays', 'P0', 'retenue-conception', 'local-and-replay-present',
    'Les politiques futures distinguent consultation, sélection, participation et essai ; les replays historiques ne sont pas réécrits.', [
      ['Définir profil principal, invité local et compte connecté séparément.', 'Un invité peut participer sans copier les achats dans sa collection ; les droits sont attribués au bon profil.'],
      ['Valider composition, version et installation avant match.', 'Lancement impossible produit une solution annoncée ; aucune paire ne commence avec un membre indisponible.'],
      ['Garder les références visuelles nécessaires aux replays sans leur faire accorder de récompense.', 'Lecture seule, anciennes règles et accès à l’affichage sont distincts des droits de sélection actuels.'],
    ]],
  ['63', 'Textes, accessibilité et surprises', 'P0', 'retenue-conception', 'accessible-menu-foundations-present',
    'Utiliser des textes courts associés au billet C&A et un détail consultable ; les identités secrètes restent secrètes dans le DOM accessible.', [
      ['Rendre tous les états compréhensibles par texte, forme, focus et progression.', 'La grille reste navigable à la manette ; aucun état ne dépend seulement de couleur, de son ou d’animation.'],
      ['Masquer nom, alt, tooltip, voix, miniature et conditions trop révélatrices selon la découverte.', 'Le lecteur d’écran ne révèle pas un artiste secret ni un costume nommant son propriétaire.'],
      ['Ne pas confondre service indisponible et abonnement terminé.', 'Les messages de référence ont une condition d’emploi vérifiable et une action utile.'],
    ]],
  ['64', 'Production, sauvegarde et validation des droits', 'P0', 'retenue-conception', 'versioned-profile-present-no-entitlement-ledger',
    'Ajouter ultérieurement un registre versionné des sources, sans supprimer l’ancien profil ni son mécanisme de secours.', [
      ['Prévoir migration, copie de secours, validation bornée et restauration.', 'Les anciens réglages, résultats, routes, programme actif et replays restent inchangés après migration.'],
      ['Associer les 22 cas d’acceptation source à des scénarios Encore.', 'Chaque cas décrit données, action, message, droit et persistance attendus ; son statut reste à exécuter.'],
      ['Compter séparément contenu livré, règle conçue et scénario réellement réussi.', 'Une silhouette prête n’ajoute pas un combattant produit ; la collection du joueur n’est pas un indicateur de production.'],
    ]],
  ['65', 'Six fiches d’accès et de droits', 'P1', 'retenue', 'documentation',
    'Fournir modèles A–F instanciés par le catalogue, les règles, l’avantage inactif, la charte, la scène et les scénarios de validation.', [
      ['Renseigner contenu/slot, condition de déblocage et dépendances.', 'Chaque ID est stable, chaque condition a un texte et un arbre, chaque dépendance existe.'],
      ['Renseigner avantage de soutien, charte visuelle et scène spéciale.', 'Les trois modèles séparent politique proposée et offre réellement activée ; le stage possède sélection et participation distinctes.'],
      ['Renseigner la matrice des droits avec toutes ses sources et états.', 'Les cas n’utilisent jamais un faux booléen unique pour perte de réseau, expiration et asset manquant.'],
    ]],
  ['66', 'Instruction d’intégration au projet', 'P0', 'retenue', 'documentation',
    'L’index de bible devient le point d’entrée des trois textes et de leurs adaptations ; aucune fonction n’est implicite.', [
      ['Raccorder extensions au guide, aux personnages, campagnes et futurs lots de production.', 'Les liens relatifs et IDs sont résolus par le générateur ; les deux sources sont consultables intégralement.'],
      ['Préparer des tables Excel avec ordre stable et colonnes de statut séparées.', 'Le jeu de données feuille conserve un identifiant par ligne, sans déplacer les historiques existants.'],
      ['Afficher clairement les fonctions encore à intégrer.', 'Taunts dédiés, tag, hub, bonus et offre de soutien ne sont pas annoncés comme jouables par ces documents.'],
    ]],
  ['67', 'Références et vocabulaire des droits', 'P0', 'retenue', 'documentation',
    'Conserver le lexique du guide ; les liens Patreon sont des sources à revalider quand une intégration sera effectivement programmée.', [
      ['Distinguer acquis, accès temporaire, admissible, installé, compatible et découvert.', 'Les textes du menu et les schémas emploient les mêmes définitions sans confondre droit et visibilité.'],
      ['Conserver les références D01–D04 dans l’original sans en certifier une relecture réseau.', 'La provenance porte sa date et le statut de vérification actuelle ; aucune règle financière n’est improvisée.'],
      ['Vérifier les empreintes et les références de tous les fichiers générés.', 'Le générateur --check termine sans dérive, et les fichiers restent reconstructibles depuis leurs sources éditoriales.'],
    ]],
];

export const TEAM_CONTRACT = {
  id: 'EN-E1-TEAM-CONTRACT', name: 'Répétition en duo', status: 'designed-not-implemented',
  loreStatus: 'original-compatible', modes: ['future-duo-versus', 'future-duo-local', 'future-duo-training', 'scripted-campaign-only'],
  members: 2, active: 1, reserve: 1, health: 'Vie propre conservée pour chaque membre ; aucune régénération passive dans le premier prototype.',
  defeat: 'Deux membres KO ; le relais après premier KO est automatique et gratuit.',
  identity: 'ID de membre stable, indépendant du slot actif ; le corps de simulation suit le membre, jamais le portrait.',
  proposedTuning: { status: 'initial-balancing-hypotheses-not-runtime', teamMeterMax: 100, initialTeamMeter: 50, passiveGainPerSimulationTick: 0.05,
    assistCost: 25, neutralTagCost: 15, comboTagCost: 35, rescueTagCost: 60, duoSuperCost: 75,
    assistCooldownTicks: 480, tagCooldownTicks: 240, assistEntryTicks: 24, assistExitTicks: 30, controlTransferTick: 18,
    rescueInvulnerabilityTicks: 0, finalScenePresentationTicks: 180 },
  clock: '60 ticks de simulation ; jauge et cooldowns arrêtés en pause, présentation et fin de manche. Les scènes abrégées ne font pas avancer ces ressources.',
  economics: 'Valider les deux membres et leur état, réserver une transaction, puis prélever à l’engagement. Refus préalable sans coût ; interruption après engagement sans remboursement. Gain des impacts partagé et borné par événement.',
  availability: ['reserve-ready', 'entering', 'assisting', 'exiting', 'cooldown', 'active', 'stunned', 'ko'],
  commandPriority: ['forced-ko-tag', 'resolved-match-verdict', 'rescue-tag', 'duo-super', 'combo-tag', 'neutral-tag', 'assist', 'taunt'],
  neutralTag: 'Autorisé au sol, hors touche/garde/projection/cinématique. Actif exposé pendant la sortie ; entrant contrôlable au tick 18 proposé, face vers l’adversaire, placement valide le plus proche.',
  comboTag: 'Uniquement après confirmation d’une attaque inscrite dans la table de cancels ; garde et whiff refusent. Scaling, rebonds et capture déjà utilisés sont conservés.',
  rescueTag: 'Option future de défi solo d’abord ; aucune invulnérabilité implicite. Réserve disponible, ressource et fenêtre explicite requises ; interdit pendant une projection ou un super confirmé.',
  assist: 'Un partenaire de roster temporaire par équipe. Il reçoit les dégâts sur sa propre vie, ne garde pas et peut être puni. Son KO n’interrompt pas une attaque déjà résolue mais bloque tout rappel.',
  duoSuper: 'Longue séquence après hit-confirm seulement ; les deux membres sont réservés jusqu’à la sortie. Garde/raté : récupération de l’amorce sans scène. Pas de nouveau pouvoir ajouté au kit canonique.',
  comboHistory: 'Un registre de combo par défenseur et équipe attaquante ; changer d’actif ne remet à zéro ni réduction, ni OTG, ni rebond, ni compteur de secours.',
  objectPolicy: 'À la réserve, projectiles déjà partis terminent leur vie bornée, pièges continuent leurs ticks sans nouveau spawn. Au KO du propriétaire, supprimer ses pièges au tick suivant ; projectile déjà parti termine sa vie. En nouvelle manche, tout nettoyer.',
  stageTransition: 'Réserver destination et assets avant match ; pendant transition : gel de simulation, nouveaux appels refusés, partenaires temporaires retirés et cooldowns conservés. Les objets ne sont pas transférés sauf contrat explicite.',
  morphology: 'Les prises humanoïdes ont une variante de repousse pour géants, sphères et abstractions ; aucune contorsion forcée d’un sprite pour rendre une prise possible.',
  narrative: 'Duo libre = simulation affichée. Duo de campagne = versions et événement approuvés par chapitre. Les duos mémoriels ne restaurent pas les personnes disparues.',
  replay: 'Nouvelle version requise pour les nouvelles actions et membres. Les anciens replays gardent les règles 0.5.0 et leur catalogue historique ; aucun champ ne leur est injecté.',
};

export const SELECTION_CONTRACT = {
  id: 'EN-E1-SELECTION-CONTRACT', status: 'designed-not-implemented',
  states: [
    ['focus', 'Consulter le slot sans modifier le choix confirmé.', 'preview', 'back'],
    ['preview', 'Afficher identité et costume autorisés, avec une pose fixe actuelle.', 'confirm', 'deselect'],
    ['confirm', 'Enregistrer immédiatement le choix valide ; lancer la réaction après.', 'confirmed-idle', 'deselect'],
    ['confirmed-idle', 'Tenir une pose lisible en attendant le second choix.', 'team-ready', 'deselect'],
    ['costume-change', 'Charger le nouveau visuel puis remplacer atomiquement l’aperçu.', 'preview', 'deselect'],
    ['deselect', 'Libérer le choix, nettoyer ses éléments, jouer une sortie courte.', 'focus', 'focus'],
    ['team-ready', 'Afficher actif/réserve et compatibilités, sans promettre une scène non débloquée.', 'depart', 'deselect'],
    ['depart', 'Valider droits, assets et règles avant le versus.', 'match-intro', 'team-ready'],
  ].map(([id, behavior, next, cancel]) => ({id, behavior, next, cancel})),
  timing: {status:'presentation-hypotheses-not-runtime', selectionTicks:42, confirmTicks:30, deselectionTicks:36, rapidExitTicks:6},
  input: 'Les deux joueurs possèdent leur curseur et leur jeton d’aperçu. Les réponses asynchrones n’écrasent pas un jeton plus récent.',
  interruption: 'Nouvelle sélection ou retour : invalider l’ancien jeton, arrêter voix/particules/compagnon/ombre puis afficher le nouvel aperçu. Aucune attente de fin de séquence pour accepter l’entrée.',
  reducedMotion: 'Pose finale fixe pour confirmation ; fondu facultatif très court pour sortie. Même contenu, mêmes droits et mêmes commandes.',
  audio: 'Pas de voix copiée. Les répliques éventuelles sont des textes originaux identifiés ; lecteur d’écran annonce le choix logique une seule fois.',
};

export const TAUNT_CONTRACT = {
  id:'EN-E1-TAUNT-CONTRACT', status:'designed-not-implemented', action:'taunt', type:'presentation-no-resource-bonus',
  timing:{status:'initial-balancing-hypotheses-not-runtime',entryTicks:12,holdTicks:24,exitTicks:18,repeatCooldownTicks:180,voiceCooldownTicks:600},
  entry:'Au sol et neutre uniquement ; refus en stun, garde, projection, assistance, relais, super ou phase de résultat.',
  vulnerability:'Hurtbox actuelle conservée ; aucune armure, invulnérabilité, esquive gratuite ni suppression de ciblage.',
  interruption:'Un impact applique immédiatement la réaction normale. Annulation volontaire vers garde/déplacement à partir de la sortie ; la sortie ne gomme pas les ticks d’exposition.',
  recovery:'Retour à la stance propre au costume ; pas de recharge de stabilité ni de jauge par le geste.',
  existingUtility:'Les actions utility actuelles de récupération/buff restent distinctes et conservent coût, effet, cooldown et encodage de replay.',
  abstraction:'Réactions non verbales de posture et de regards ; jamais de guérison, de pensée révélée ni de voix humaine.',
};
