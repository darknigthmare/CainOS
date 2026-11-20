# Reprise du classeur du 20 novembre 2026

**État : `export_blocked_memory`. Aucun nouveau XLSX n’a été publié.**

Les quatre fichiers installés du suivi sont conservés à octets identiques à la
révision des apparences `ce7ceeb7` (commit local équivalent `bdeb7f2`). Le rapport
`workbook-review.json` contient leurs empreintes, les commandes et les limites
observées. L’ancien reçu
`../cast-continuation-20261120/workbook-review.json` reste un constat historique
distinct et n’a pas été réécrit.

## Ce qui a été préparé

La reprise lit les parties XML du fichier existant sans les modifier. Elle
extrait les valeurs avec leurs types, les formules, les styles effectifs, les
dimensions, les volets, les dix tables, les validations et les règles de couleur.
Elle refuse les propriétés natives qu’elle ne sait pas conserver. Le fichier est
ensuite recréé exclusivement par les API publiques de `@oai/artifact-tool`, avec
`Workbook.create()` ; aucune autre bibliothèque n’écrit de classeur.

Le plan contraint **78 606 cellules historiques**. Les seules modifications
autorisées viennent du checkpoint des apparences : **15 lignes Production,
cinq constats QA, 15 références**, les cellules de Synthèse indiquées dans le
plan, la portée de la référence hors ligne et le déplacement du pied de
Références. Le modèle préparé contient **11 feuilles, dix tables, 42 formules,
3 115 lignes Production, 2 265 lignes QA et 135 références**. Les valeurs des
42 formules sont calculées indépendamment ; une modification temporaire de
statut a fait varier les totaux attendus, puis a été annulée.

La portée de ce modèle est la passe des apparences `ce7ceeb7`. Il conserve les
**5 485 images** de cette passe. Les six accessoires intégrés ensuite, portant
le manifeste à **5 491 images et 2 724 652 669 octets**, ne sont pas ajoutés à
ce modèle. Leur preuve distincte se trouve dans
`../props-integration-20261120/verification.json`. Une nouvelle petite mise à
jour du suivi reste nécessaire après la récupération de l’export.

## Pourquoi la publication reste bloquée

La recréation et sa sérialisation publique réussissent, avec un pic de
**335 876 Kio**. `Workbook.load()` recharge ensuite ce modèle avec environ
**229 Mo de RSS et 71 Mo de tas V8** avant l’export. Ce chargement du modèle
public n’est pas une réimportation du fichier XLSX.

Le sérialiseur XLSX dépasse encore les ressources disponibles :

| Tentative | Résultat réel | Pic RSS |
| --- | --- | ---: |
| Recréation puis export direct, tas 176 Mo | Erreur mémoire V8 pendant l’export | 402 660 Kio |
| Recréation puis sérialisation publique, tas 256 Mo | Réussite ; modèle conservé | 335 876 Kio |
| Chargement du modèle puis export, tas 256 Mo | Erreur mémoire V8 | 485 456 Kio |
| Chargement du modèle puis export, tas 320 Mo | Processus tué par `SIGKILL` | 534 064 Kio |

La dernière tentative utilisait déjà `--max-semi-space-size=1`,
`--optimize-for-size`, `--no-wasm-tier-up`, `--expose-gc` et
`MALLOC_ARENA_MAX=2`. Le JSON intermédiaire était libéré et le ramasse-miettes
appelé juste avant l’export. Aucun nouvel essai identique n’a été effectué.

En l’absence d’un XLSX exporté, la comparaison native du fichier sauvegardé,
sa réimportation et la revue visuelle de cet export **n’ont pas été exécutées**.
Le statut de réussite présent dans certains enregistrements QA du compagnon
préparé décrit le résultat visé par le générateur ; il ne constitue pas une
preuve de publication. Les fichiers comprimés de ce dossier sont des entrées
de reprise, jamais des remplaçants validés des documents installés.

## Reprendre sans réimporter le fichier source

Utiliser un environnement disposant d’une marge mémoire supérieure, avec le
runtime principal et les mêmes sources. Ne pas supprimer de lignes, de notes,
de styles ou de tables pour contourner la limite.

1. Vérifier les empreintes des quatre fichiers installés, du checkpoint initial,
   du modèle comprimé, du JSON compagnon préparé et des scripts dans le reçu.
2. Créer un dossier temporaire privé contenant une copie du générateur et un
   lien `node_modules` vers `$CODEX_PRIMARY_RUNTIME_NODE_MODULES`. Choisir un
   dossier de sorties distinct du dépôt.
3. Exécuter le lecteur Python en mode `extract` sur le XLSX installé vers
   `native-source` dans ce dossier de sorties, puis le générateur principal
   en mode `--prepare-only`. Le plan et les douze empreintes de `native-target`
   doivent correspondre au reçu.
4. Décompresser `recreated-model.json.gz` vers `recreated-model.json` dans ce
   dossier de sorties, sans modifier son JSON. Lancer le générateur copié avec
   `$CODEX_PRIMARY_RUNTIME_NODE`, `--repo-root`, `--output-dir` et
   `--export-model`. Ce mode ne remplace aucun fichier installé.
5. Si l’export aboutit, lire ce XLSX avec le lecteur en mode `extract` vers
   `native-export`, puis comparer `native-target` à `native-export` en mode
   `compare`. La comparaison doit couvrir toutes les cellules et propriétés
   prises en charge, pas seulement les totaux.
6. Exécuter `--reimport`. Son reçu borne explicitement son contrôle aux
   42 formules/valeurs de Synthèse et aux effectifs des trois tables étendues.
   Il complète la comparaison native et ne la remplace pas.
7. Exécuter `--render` et lire les quatorze vues du plan à une taille lisible.
   Les rendus utilisant `Workbook.load()` doivent être identifiés comme des
   rendus du modèle public ; toute limite de réimport du XLSX reste explicite.
8. Appliquer ensuite la mise à jour distincte des six accessoires à partir de
   leur preuve datée, recalculer, exporter et vérifier à nouveau les cellules
   concernées. Le suivi final doit distinguer les 401 tests Node réussis et
   l’absence d’assertion navigateur locale de cette passe.
9. Publier seulement après succès des contrôles requis, avec
   `scripts/workbook-publication.mjs` et les règles de
   `docs/COMBAT_WORKBOOK_PUBLICATION.md`. Les scripts de récupération ne
   contiennent aucune publication automatique et n’affaiblissent aucun gate
   de création d’archive du jeu.

Le script de lecture se trouve dans
`scripts/inspect-combat-workbook-native.py`. Le générateur se trouve dans
`scripts/recover-combat-workbook-native.mjs`. Les modes de sérialisation ajoutés
à l’ancien updater restent documentés, mais son import du fichier source est
lui aussi limité par la mémoire dans cet environnement.
