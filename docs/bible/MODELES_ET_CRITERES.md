# Fiches A–J et critères de livraison

Les formulaires complets restent dans le [guide source, section 27](references/Combat_Games_Guide_General_v1.0.txt). Cette page les associe à Encore ; elle n’invente pas de champs mécaniques absents. Chaque nouvelle fiche porte un ID, une version, une source ou justification, des dépendances et six états séparés : lore, conception, assets, intégration, test, publication.

## A — Projet

**Exemple :** digital-circus-encore. [Fichier associé](guide-design.json).

**À reprendre :** Identité, continuité, piliers, deux entrées, phases et périmètre sont renseignés. Les neuf modes et les comptes viennent du runtime.

**À compléter ou à vérifier :** Objectifs de performances à mesurer sur une configuration nommée ; plateformes supplémentaires et réseau différés.

## B — Personnage

**Exemple :** pomni puis les 63 autres IDs du roster. [Fichier associé](character-associations.json).

**À reprendre :** Identité, rôle, références existantes, dix actions, rival, route, finales, costumes, stage dédié et rôles globaux sont reliés.

**À compléter ou à vérifier :** Comparaison visuelle primaire, particularités anatomiques et qualité de chaque scène se valident individuellement ; aucun label global 1:1.

## C — Action ou projectile

**Exemple :** pomni / special ; motif juggle. [Fichier associé](../../combat/projectile-art.mjs).

**À reprendre :** Associer le propriétaire, le slot, la commande réelle et les champs startup/active/recovery, dégâts, coûts, portée et trajectoire effectivement définis.

**À compléter ou à vérifier :** Touche/garde/contre/échec, avantage, cancels et interactions sont à établir à partir du moteur ; absent reste absent, sans zéro inventé.

## D — Finisher

**Exemple :** pomni.impact ; pomni.friendship. [Fichier associé](DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md).

**À reprendre :** ID, titre existant, trois temps, durée et justification conservés. Conditions après verdict, morphologies, cadrage de remplacement et retour résultat sont encadrés.

**À compléter ou à vérifier :** Tester cible petite, géante, sans membres et composite ; ne pas déduire une mort ou une guérison du spectacle.

## E — Route individuelle

**Exemple :** STORY_ROUTES.pomni et les 63 autres routes. [Fichier associé](ASSOCIATIONS_PERSONNAGES.md).

**À reprendre :** Motivation, rival, quatre combats et six tableaux du jeu sont reliés. Les rôles globaux proposés restent séparés.

**À compléter ou à vérifier :** Approfondir les conséquences et la continuité visuelle ; toute réécriture de dialogue doit être intégrée et revue avant de remplacer le texte joué.

## F — Chapitre et scène narrative

**Exemple :** EN-CAM-CH01 / EN-CAM-CH01-INTRO. [Fichier associé](CAMPAGNE_GLOBALE.md).

**À reprendre :** Joueur, adversaire, lieu, objectif, révélation, conséquence, trois scènes, dialogues, costumes, lumière, cadrage, émotion et checkpoint sont spécifiés.

**À compléter ou à vérifier :** 36 images à produire puis lecteur et progression à intégrer ; les identifiants d’assets ne sont pas des fichiers livrés.

## G — Arène

**Exemple :** bigtop ; 26 autres stages. [Fichier associé](../../combat/data.mjs).

**À reprendre :** ID existant, nom, plans et repère 1280 × 720 reliés ; sol y=568 et limites x=65..1215. Les quatre axes de règles sont séparés.

**À compléter ou à vérifier :** Source de chaque lieu, lisibilité sur tous les corps, coûts mesurés et versions de présentation à contrôler ; les arrangements ne deviennent pas des lieux nouveaux.

## H — Événement, interaction ou transition

**Exemple :** EN-LINK-001 / EN-LINK-RULES-01. [Fichier associé](ARENES_TRANSITIONS_BOSS.md).

**À reprendre :** Départ, arrivée, côté, déclencheur, réponse, états, chrono, priorité KO, durée cible, chargement et replay sont définis.

**À compléter ou à vérifier :** Implémenter un lien complet, équilibrer les seuils puis vérifier les cas limites avant de décliner les six connexions.

## I — Boss

**Exemple :** gloinkqueen ; fudge ; abstractedkaufmo ; caine. [Fichier associé](ARENES_TRANSITIONS_BOSS.md).

**À reprendre :** Ordre du Boss Rush, gabarits, signaux, réponses et contrats de conclusion sont reliés au mode réel.

**À compléter ou à vérifier :** Déclencheurs et budgets chiffrés des phases à définir ; sélection Boss Combat et machine originale ne sont pas livrées.

## J — Asset et suivi

**Exemple :** en-global-ch01-intro, identifiant de brief. [Fichier associé](../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx).

**À reprendre :** Catégorie, propriétaire, référence, dimensions cibles, transparence selon usage, ancrages, dépendances et six statuts doivent être renseignés.

**À compléter ou à vérifier :** Pour un asset non produit : fichier source/intégré null, dimensions réelles et SHA absents. Après création : revue visuelle, preuve technique puis intégration testée.

## Quand une unité peut-elle être déclarée terminée ?

| Unité | Preuve minimale pour l’étape concernée |
| --- | --- |
| Fiche | ID stable, source et portée, associations existantes, inconnues explicites, six axes de statut, contrôle des liens. |
| Sprite fixe | Source native, dimensions/alpha, cadrage et anatomie contrôlés, aperçu à taille de jeu, intégration du portrait et de la garde. |
| Combattant | Identité/kit/ressource et dix slots reliés ; commandes, collisions, tailles adverses, états de résultat et costumes vérifiés. |
| Arène | Sol, limites, couches et signalétique lisibles ; quatre axes annoncés ; coût mesuré et parcours dans les deux entrées contrôlé. |
| Boss | Conditions/annonces/ouvertures et issues décrites ; chaque famille de combattant dispose d’une réponse ; reprise et résultat testés. |
| Route | Quatre rencontres cohérentes et six tableaux lisibles ; rival, dialogue, victoire/défaite, reprise, galerie et sources contrôlés. |
| Mode global | Douze chapitres jouables, sous-titres et passage des scènes, checkpoints, migration, difficulté et récompenses testés ; briefs seuls insuffisants. |
| Publication | Commit identifié, preuves liées à la version, état réel de PR indiqué ; une PR ouverte reste distincte d’une livraison de production. |

## Instruction pour la prochaine passe

Lire la [matrice d’intégration](COMBAT_GAMES_GUIDE_INTEGRATION.md), la [bible principale](../DIGITAL_CIRCUS_ENCORE.md), les associations et la preuve correspondant au lot. Choisir un ensemble d’IDs cohérent avec la phase statique. Compléter le contenu, relier ses sources et fichiers, vérifier le résultat demandé, puis mettre à jour uniquement les statuts effectivement prouvés. Conserver les notes utilisateur et les résultats historiques. Aucun décompte d’images, de lignes de bible ou de tests ne remplace une comparaison visuelle primaire.

Les contraintes de la session utilisateur priment sur le guide générique. Une demande documentaire ne déclenche pas implicitement réseau, refonte moteur, animation ou nouvelle production d’images.
