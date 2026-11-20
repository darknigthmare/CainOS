# Classeur récupéré et suivi réconcilié — 20 novembre 2026

**Le fichier XLSX a été exporté, vérifié puis installé avec son JSON compagnon et
son reçu de vérification.** Le blocage mémoire décrit dans le
[checkpoint de récupération](../workbook-recovery-20261120/README.md) est résolu
dans cet environnement. Le checkpoint historique reste inchangé ; ce dossier
consigne la reprise effectivement achevée.

## Contenu du suivi installé

| Élément | Total vérifié |
| --- | ---: |
| Feuilles / tableaux natifs | 11 / 10 |
| Formules de Synthèse | 42 |
| Combattants / techniques / arènes communes | 54 / 540 / 22 |
| Costumes équipables | 464 |
| Tenues Circus additionnelles / PNG correspondants | 35 / 385 |
| Lignes Production / QA / Références | 3 134 / 2 281 / 149 |
| Images du manifeste hors ligne | 5 722 |
| Octets des images du manifeste | 3 015 349 314 |

Les compteurs proviennent des modules du jeu et des tableaux recalculés, liés à
la [revue](workbook-review.json) par SHA-256. Depuis le classeur installé avant
cette reprise, le suivi rattrape **27 tenues** : les six tenues achevées du
checkpoint bloqué, les neuf préparations désormais complètes, les dix tenues du
lot suivant, puis Anime Ribbit et Jax-Suit Ribbit. Les huit ajouts déjà présents
portent le total à 35. Les 385 fichiers sont des PNG natifs distincts, présents
dans le manifeste et contrôlés à l’octet près.

La reprise ajoute au total **34 lignes Production, 21 lignes QA et 29
références** par rapport aux fichiers installés au départ. La Production couvre
les 27 tenues, les six accessoires récupérés et une candidate distincte :
`RIBBIT28-maidribbit-reference`, conservée **À vérifier**. Les pieds et le bas du
costume Maid restent insuffisamment documentés ; cette candidate ne compte
comme aucun costume achevé ni PNG actif. Les neuf lignes préparées `CIRCUS27-`
gardent leurs identifiants et passent de Partiel à Implémenté après contrôle des
99 fichiers actifs de leur lot.

## Récupération et conservation

Le modèle public gelé a d’abord été rechargé et exporté avec le runtime
principal `@oai/artifact-tool`. Les **24 fichiers des snapshots source et cible**
correspondent exactement aux empreintes du checkpoint conservé. Le premier
export récupéré a passé une comparaison native de **78 876 cellules sans
différence**, puis une réimportation des 42 formules et des effectifs attendus.
Ces résultats sont intégrés au [plan de réconciliation](reconciliation-plan.json).

La mise à jour finale utilise exclusivement les API publiques de ce même
runtime pour écrire le XLSX. Le lecteur XML Python inspecte les fichiers et
compare les propriétés ; il n’écrit pas de classeur. L’export final a abouti
avec **1 051 115 520 octets de RSS relevés après export**. Cette mesure ponctuelle
n’est pas présentée comme un pic mémoire. Aucun tableau, style, note ou ligne
n’a été supprimé pour réduire la mémoire.

Le plan contraint les 78 876 cellules du checkpoint et énumère ses 88
changements de contenu autorisés. Les IDs, l’ordre des lignes préexistantes et
les notes utilisateur sont conservés. Les cellules ajoutées gardent la palette,
les colonnes de notes jaunes et les validations existantes. Les hauteurs
nécessaires au texte sont augmentées ; aucune hauteur historique ne diminue.
La légende de Références est décalée avec ses cellules et ses styles.

Le statut préparé `CAST27-workbook` annonçait la réussite visée alors que son
reçu décrivait encore un export bloqué. Il est publié avec **Non exécuté** et une
explication historique. Sa ligne originale reste archivée dans le JSON
compagnon. La réussite actuelle figure séparément dans
`TRACKER28-reconciliation`.

## Contrôles effectivement exécutés

- [Comparaison native](native-comparison.json) : **79 280 cellules, zéro
  différence** entre le plan contraint et le XLSX enregistré, pour les types,
  valeurs, formules, styles effectifs et propriétés natives prises en charge.
  Les tables, dimensions, volets, validations et règles de couleur sont
  conservés. Les empreintes des douze fichiers du snapshot cible sont incluses.
- [Calcul et export](authoring-result.json) : **42 formules sans erreur**,
  comparées à un calcul scalaire indépendant. Une modification temporaire de
  statut a fait varier les deux compteurs attendus avant d’être annulée. Le
  [scan d’erreurs](formula-error-scan.ndjson) ne relève aucune cellule en erreur.
- [Réimportation](reimport-result.json) : ouverture du fichier XLSX enregistré,
  vérification des 42 formules et valeurs, de toutes les lignes des neuf tables
  représentées dans le JSON compagnon et du dixième tableau **Extension PNJ**
  contre son snapshot natif préservé.
- [Revue visuelle](visual-review.json) : **33 vues rendues depuis le XLSX
  enregistré**, toutes inspectées. Elles couvrent les deux parties de Synthèse,
  toutes les lignes Production et QA rattrapées ou ajoutées, toutes les nouvelles
  références, la source hors ligne et la légende déplacée. Les textes longs et
  les liens restent lisibles, les statuts sont distincts et les colonnes de
  notes sont conservées.

La réconciliation importe les résultats datés des lots du jeu après contrôle
des fichiers de preuve et des empreintes des assets. Elle ne les additionne pas
comme des tests exécutés par le générateur de classeur. Le dernier lot Ribbit
atteste **405 tests Node réussis, zéro échec, deux builds réussis et 40 contrôles
Canvas sans fichier manquant**. Sa tentative Chromium s’est arrêtée avant
navigation et n’a exécuté aucune assertion de l’application ; la ligne
correspondante demeure Non exécuté.

Les dessins sont des repères statiques adaptés au fan-game. Les cycles complets,
la comparaison canonique plan par plan et les essais physiques restent ouverts.
La revue ne revendique pas de session Excel desktop. Les champs
`releaseReviewed`, `fullCiExecuted` et `canonicalVisualApproval` restent `false` ;
aucune condition de création de l’archive du jeu n’a été affaiblie.

## Publication et reproduction

Le [reçu de publication](publication.json) donne les empreintes effectivement
installées de `DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx`, `combat-tracker-data.json` et
`combat-workbook-verification.json`. Ils sont remplacés ensemble par
`publishWorkbookArtifacts`, selon le
[protocole existant](../../COMBAT_WORKBOOK_PUBLICATION.md). Le fichier historique
`combat-qa-evidence-0.7.0.json` conserve exactement ses octets.

Le script [reconcile-combat-workbook-20261120.mjs](../../../scripts/reconcile-combat-workbook-20261120.mjs)
sépare préparation, export, réimportation, rendu et publication. Sur une copie de
la **base dont les empreintes figurent dans le plan**, après restauration du
checkpoint décrit dans le dossier de récupération :

1. Créer une copie privée du script avec un lien `node_modules` vers
   `$CODEX_PRIMARY_RUNTIME_NODE_MODULES` et des sorties hors des documents
   installés.
2. Utiliser `$CODEX_PRIMARY_RUNTIME_NODE --max-old-space-size=4096 --expose-gc`,
   `--repo-root`, puis les modes `--prepare --with-ribbit` et `--build`.
3. Exécuter `inspect-combat-workbook-native.py extract` sur le XLSX exporté, puis
   `compare` entre `native-target` et `native-export`.
4. Exécuter `--reimport`, puis `--render`, et inspecter les 33 vues avant de
   rédiger une nouvelle revue visuelle contenant leurs empreintes.
5. Exécuter `--publish`. Ce mode refuse une base, un manifeste, une preuve, un
   snapshot cible ou un export différent de ceux qui ont été vérifiés.

Le script est volontairement lié à cette reprise datée. Une nouvelle évolution
du contenu demande un nouveau plan sur les fichiers alors installés, pas une
réutilisation des reçus de réussite de cette passe.
