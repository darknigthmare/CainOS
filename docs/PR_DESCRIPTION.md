## Pourquoi

Cette PR poursuit Encore depuis `main` au commit `4a56f6358000cd7ad0838e45f5385ec516432514` et livre la version **0.7.0**, partagée entre l’application CainOS et le jeu autonome. Elle conserve les corrections visuelles et narratives 0.6, termine la livraison des finales et des ambiances 0.7, puis corrige les commandes, le focus et la traçabilité du suivi.

La dernière version de la branche possédait déjà le catalogue des finales, mais sa vérification navigateur échouait sur un sélecteur de navigation ambigu ; l’Excel et l’archive correspondants n’étaient pas publiés. Le parcours clavier perdait aussi le focus lors de certains changements d’écran, et trois défauts d’entrée pouvaient perturber une rencontre locale.

## Ce que change la PR

- **Finales et galerie** : 42 présentations de KO, trois par combattant, et consultation des 51 costumes. Le résultat est enregistré avant la présentation ; passage, désactivation et mouvement réduit sont pris en charge. Le temps passé dans un onglet ou une fenêtre CainOS masqués n’avance plus la galerie ; un changement de mouvement réduit rafraîchit aussi une image finale arrêtée.
- **Audio** : 12 ambiances procédurales avec réglage indépendant, signaux de piège et de KO, et 24 motifs d’effets au total. Six sons distinguent les contacts léger, lourd, bas, saisie, spécial et super. Le choix suit les événements réellement résolus, avec priorité aux résultats critiques et à la garde.
- **Navigation** : flèches et Début/Fin dans les groupes de choix, conservation du focus après sélection ou filtrage, retour au déclencheur après fermeture d’une boîte de dialogue, états accessibles pour les choix actifs. La manette peut ouvrir les références et parcourir leurs liens ; les champs de recherche ne piègent plus son parcours.
- **Commandes en combat** : une répétition automatique après une pause ne relance plus une attaque ; le dash de J2 sur Ctrl droite ne bloque plus les attaques des deux joueurs ; Espace et Entrée activent la barre d’outils sans provoquer de saut.
- **Gloink Queen** : l’apparence originale réutilise maintenant la planche transparente de sa variante corrigée. Le rectangle opaque disparaît des portraits, du combat et de la galerie. Les identifiants, les costumes et les collisions sont conservés ; l’ancienne image reste dans le dépôt.
- **Suivi et livraison** : génération du classeur avec le moteur tableur principal, conservation des notes par identifiant après tri, preuves versionnées et archive autonome. La CI vérifie le classeur déjà revu ; elle ne le réécrit pas. Le code, les tests, l’Excel, ses données JSON et les preuves sont liés par SHA-256. Le collecteur démarre son propre serveur et contrôle les sources avant et après exécution.
- **Contenu conservé depuis 0.6** : 20 costumes corrigés sur cinq planches RGBA, trois décors reconstruits, 84 tableaux narratifs et 56 briefings. Les 14 combattants, 140 techniques, 12 arènes, neuf modes, 51 costumes et 179 identités d’archive sont préservés.

Les règles de simulation restent **0.5.0**. Les replays **0.1.0 à 0.7.0** conservent leur version d’origine et leur comportement ; cette livraison n’introduit pas de nouvelles règles d’équilibrage.

## Validation de la version 0.7

Les preuves de cette campagne portent sur le code de `1073ce21525c771f598b56d7452eaeceb2ed9178`. Les dernières modifications de livraison concernent le suivi et la documentation ; les empreintes du jeu et des tests doivent rester identiques.

| Contrôle | Résultat |
| --- | --- |
| `npm run qa` | Audits CainOS, contrats, syntaxe et deux distributions construits avec succès |
| Node | **313 tests réussis dans 22 suites** ; noms et comptes issus des sorties TAP |
| Navigateur | **238 contrôles réussis dans 14 suites** ; code du jeu et sources de test inchangés pendant la campagne |
| Finales / galerie | **100 contrôles** : 42 finales, 51 costumes, lecture/pause/reprise, arrêt final et conservation du profil |
| Audio | **22 contrôles** : 12 ambiances distinctes, six contacts plus piège/KO distincts, réglages et cycle de vie WebAudio |
| Clavier / manette simulée | **28 contrôles réussis**, navigation, focus, formulaires natifs, manette virtuelle et largeur mobile de 390 px |
| Commandes de combat | **Quatre parcours réussis** avec les vraies entrées clavier ; profil et replay conservés |
| Roster et programmes | **14 duels de roster**, 20 victoires Arcade/Boss/Survie, neuf duels histoire/tournoi et vérification des sauvegardes |
| Classeur | **39 formules recalculées, aucune erreur**, 10 feuilles et 9 tableaux natifs conservés ; export et réimport vérifiés |
| Notes et tri | Fixture séparée : **10 notes / 8 feuilles**, deux formules relatives, `0`, `false`, texte `=`, tri et hauteur utilisateur conservés |
| Protection de la livraison | Un classeur périmé empêche l’archive et retire l’ancien ZIP ; un JSON compagnon altéré est rejeté par le mode strict |
| Archive | Intégrité ZIP vérifiée, runtime du standalone identique aux sources testées, lanceurs Python/POSIX analysés |
| Hors ligne | **44 images / 52 167 739 octets** ; manifeste `0.7.0-62e762f53b55` |

Les suites navigateur distinguent les combats réellement joués par l’interface, les simulations de classement et les scènes de rendu. Les vérifications de galerie ne valent pas 42 nouveaux dessins corporels ni une validation canonique exhaustive. Trois compositions finales statiques ont aussi été inspectées visuellement : Jax super, Gangle super et Bubble impact, sans défaut majeur dans cet échantillon.

Les preuves historiques 0.6 restent dans `combat-qa-evidence.json`. Elles ne sont pas additionnées aux résultats 0.7. Les objectifs de revue du classeur peuvent recouper les tests automatisés : le nombre de lignes QA n’est donc pas un nombre de tests indépendants.

Le suivi contient **102 fonctionnalités, 683 tâches de production, 85 scénarios et 1 003 lignes QA**. Ces dernières réunissent 551 cas automatisés de cette passe et 452 lignes historiques ou objectifs de revue conservés : **999 réussies, zéro échec, trois non exécutées et une à vérifier**. Le classeur réel ne contenait aucune note ; les notes de la fixture ne sont pas livrées. Les fonctions restent classées en **81 implémentées, six partielles, treize prévues et deux à vérifier**.

## Documents et utilisation

Le guide est dans `docs/DIGITAL_CIRCUS_ENCORE.md`. Le suivi comprend `DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx`, `combat-tracker-data.json`, `combat-workbook-verification.json` et `combat-qa-evidence-0.7.0.json`. Le catalogue des finales et les planches de capture sont également dans `docs/`.

Les contrôles séparés de notes et de refus de livraison sont conservés dans `docs/combat-workbook-notes-0.7.0.json` et `docs/combat-package-gates-0.7.0.json`. La comparaison de Gloink Queen est dans `docs/COMBAT_GLOINK_QUEEN_0.7.0.md`.

La CI fournit les preuves et, lorsque le classeur correspond exactement au code vérifié, l’archive **Digital_Circus_Encore_0.7.0.zip**. Elle contient le jeu autonome, les documents et trois lanceurs locaux. Après extraction complète : `LANCER_ENCORE.cmd` sous Windows ou `sh LANCER_ENCORE.sh` sous macOS/Linux. **Python 3 et un navigateur moderne sont nécessaires.** Les lanceurs ne constituent pas des paquets natifs.

## Travaux encore ouverts

- Dessins et animations de combat dédiés, comparaison canonique générale **1:1**, détails et proportions encore non vérifiés. Les finales réutilisent les illustrations existantes avec accessoires et mise en scène procéduraux.
- Voix, finition sonore et mixage sur appareils physiques ; les sons actuels sont des créations d’Encore.
- Équilibrage compétitif, 114 entrées d’archive sans kit de combat, réseau/rollback, tag/assists, coopération et campagnes par épisode.
- Synchronisation cloud du profil de combat, économie/déblocages, personnalisation et paquets natifs.
- Essais sur téléphone physique, deux manettes physiques, matériel modeste et lecteur d’écran. Les contrôles Chromium du clavier et des manettes simulées ne remplacent pas ces essais.

La publication du classeur restaure les anciens fichiers sur erreur interceptée, mais ne garantit ni une lecture simultanément atomique de tous les fichiers ni une récupération après arrêt brutal. Le protocole et ses limites sont détaillés dans `docs/COMBAT_WORKBOOK_PUBLICATION.md`.
