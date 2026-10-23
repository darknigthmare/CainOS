# Publication du classeur de suivi

Le générateur `scripts/build-combat-workbook.mjs` publie ensemble trois résultats validés :

- `DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx` ;
- `combat-tracker-data.json` ;
- `combat-workbook-verification.json`.

`scripts/workbook-publication.mjs` assure leur restauration si un remplacement échoue pendant l’exécution. Il est indépendant du moteur de calcul Excel : ses tests peuvent provoquer des pannes de fichiers sans reconstruire un classeur.

## Préparation et remplacement

Le générateur termine d’abord l’export XLSX, sa réimportation et la vérification des notes. Ses fichiers d’export intermédiaires restent dans un dossier privé `.tracker-*`, créé par `mkdtemp` dans le dossier des aperçus. Les PNG sont à l’extérieur de ce dossier.

La publication suit ensuite cet ordre :

1. Acquérir `.workbook-publication.lock` par création exclusive. Un second processus utilisant ce module ne peut pas publier dans le même dossier tant que ce verrou existe.
2. Créer un dossier privé `.workbook-publication-*` dans le dossier de sortie. Copier les trois nouvelles sorties dans son sous-dossier `staged`. Ces copies placent les remplacements sur le même système de fichiers que leurs destinations.
3. Examiner chacune des trois destinations. Un fichier régulier existant est copié dans `backups` ; une destination absente est enregistrée comme telle. Les liens symboliques et les répertoires sont refusés. Toutes les sauvegardes doivent réussir avant le premier remplacement.
4. Écrire `recovery.json`, avec les noms des fichiers, leur présence initiale, les chemins relatifs des sauvegardes et les modes et dates des fichiers existants.
5. Remplacer successivement les trois destinations par `rename`. Les permissions d’un fichier existant sont conservées sur son remplaçant.
6. Après succès, supprimer uniquement le dossier privé de cette publication et son verrou. Le générateur nettoie séparément son propre dossier privé d’export. Les PNG et les fichiers voisins restent en place.

Les noms de destination doivent être de simples noms de fichiers. Les doublons, y compris ceux qui ne diffèrent que par la casse, les chemins relatifs avec séparateurs et les noms réservés `.workbook-publication*` sont refusés avant toute écriture.

## Restauration après une erreur

Une erreur avant le premier remplacement laisse les contenus et la présence des sorties existantes inchangés. Une erreur pendant les remplacements déclenche une restauration de toutes les destinations, dans l’ordre inverse :

- Pour un fichier initialement présent, le module copie sa sauvegarde vers un fichier de restauration privé, restaure son mode et ses dates, puis renomme cette copie vers la destination. La sauvegarde elle-même n’est jamais déplacée ni consommée.
- Pour un fichier initialement absent, le module supprime uniquement cette destination, sans suppression récursive.
- Une erreur de restauration n’empêche pas les autres restaurations d’être tentées.

Si toutes les restaurations réussissent, les contenus binaires et les absences antérieures sont rétablis, puis les temporaires privés et le verrou sont nettoyés. Le générateur signale tout de même l’échec de publication ; il ne présente pas cette tentative comme une nouvelle génération réussie.

Si une restauration échoue, **toutes les sauvegardes, le dossier privé et le verrou sont conservés**. Le journal reçoit l’état `rollback-incomplete` et la liste des erreurs si son actualisation réussit. Si cette actualisation échoue elle aussi, le journal initial `prepared` et les sauvegardes restent disponibles. L’erreur retournée indique `recoveryDirectory` et `lockPath`. Le nettoyage du générateur n’efface jamais ce dossier de récupération.

| Code d’erreur | État des résultats et action à mener |
| --- | --- |
| `WORKBOOK_PUBLICATION_LOCKED` | Une autre exécution ou une récupération à terminer possède déjà le verrou. Examiner cette situation avant de relancer. |
| `WORKBOOK_PUBLICATION_PREPARE_FAILED` | Aucun remplacement final n’a commencé. Corriger la cause de préparation avant de relancer. |
| `WORKBOOK_PUBLICATION_ROLLED_BACK` | Les contenus et les absences antérieures ont été restaurés. La nouvelle génération n’a pas été publiée. |
| `WORKBOOK_ROLLBACK_INCOMPLETE` | L’état final peut être mélangé. Utiliser les sauvegardes conservées pour terminer la récupération avant toute nouvelle publication. |
| `WORKBOOK_PUBLICATION_CLEANUP_FAILED` | Les remplacements ont abouti, mais le nettoyage privé a échoué. Vérifier le champ `committed` et les chemins signalés avant de nettoyer. |

Une erreur de nettoyage secondaire est attachée à l’erreur principale ; elle ne masque pas les informations de récupération.

## Limites du système de fichiers

Chaque renommage est atomique sur le système de fichiers de destination. Les trois noms ne changent pas simultanément : un lecteur qui ouvre plusieurs fichiers pendant la courte phase de remplacement peut observer des générations différentes. Les consommateurs doivent utiliser les sorties après la fin réussie du générateur, ou attendre la disparition du verrou.

Cette procédure réagit aux erreurs de fichiers interceptées par le processus. Elle ne garantit pas une transaction résistante à une coupure de courant, à l’arrêt brutal du processus ou à une panne du support ; elle n’utilise pas de protocole de synchronisation durable des répertoires et fichiers. Un arrêt brutal peut laisser un verrou et un dossier privé à examiner. Aucun verrou ancien n’est supprimé automatiquement.

La restauration porte sur les octets, la présence ou l’absence, le mode et les dates enregistrées lorsque le système de fichiers permet leur rétablissement. Elle ne promet pas de conserver le numéro d’inode, les liens physiques, le propriétaire, les attributs étendus ou la date de changement de métadonnées. La lecture des fichiers peut modifier leur date d’accès. Les écritures externes qui ignorent le verrou ne sont pas coordonnées par ce module.

## Récupération manuelle si nécessaire

1. Arrêter les générateurs et vérifier qu’aucun processus ne publie encore dans le dossier concerné. Conserver le verrou et le dossier désigné par `recoveryDirectory` pendant toute la récupération.
2. Lire son `recovery.json`. Vérifier le dossier de sortie, les trois noms attendus et la présence de chaque sauvegarde déclarée. Un journal `prepared` peut également être celui d’une exécution interrompue ; il décrit l’état antérieur aux remplacements.
3. Pour chaque entrée dont `existed` vaut `true`, copier sa sauvegarde vers un nouveau fichier temporaire privé placé sur le système de fichiers de destination, lui appliquer les métadonnées enregistrées, puis le renommer vers le nom de sortie. Garder la sauvegarde intacte jusqu’à la vérification complète.
4. Pour chaque entrée dont `existed` vaut `false`, retirer seulement le fichier de sortie nommé dans cette entrée. Ne supprimer aucun répertoire de façon récursive pour réaliser cette étape.
5. Comparer les contenus restaurés à chaque sauvegarde et vérifier les absences enregistrées. En cas d’erreur, conserver toutes les sauvegardes et le verrou pour poursuivre la récupération.
6. Une fois la récupération complète vérifiée, retirer uniquement le dossier privé identifié et son verrou. Les aperçus PNG et les autres fichiers ne font pas partie de ce nettoyage. Relancer ensuite la génération complète.

## Vérifications automatisées

Les tests de fichiers utilisent des dossiers temporaires réels et les opérations Node de production. Ils injectent seulement l’échec de l’appel ciblé avec `node:test` ; le module livré n’a ni drapeau de panne ni branche de comportement réservée aux tests.

```sh
node tests/combat-workbook-publication.test.mjs
```

Les onze tests couvrent les huit combinaisons de présence initiale des trois résultats en cas de succès, puis les mêmes huit combinaisons après un échec du premier, du deuxième et du troisième remplacement. Ils vérifient aussi la copie partielle d’une nouvelle source, la sauvegarde partielle, l’existence de toutes les sauvegardes et du journal avant remplacement, l’échec d’une restauration, l’échec du rétablissement d’une absence, la conservation des sauvegardes et du verrou, le rejet des liens symboliques et la validation des noms. Les aperçus et des fichiers voisins témoins doivent rester identiques.

La suite est également incluse par le motif `tests/combat-*.test.mjs` de `npm run test:combat`. La conservation des notes Excel est vérifiée séparément avec des classeurs de test, en incluant les formules relatives, un texte commençant par `=`, la valeur `0` et le booléen `false`. Ces notes de test ne sont jamais ajoutées au classeur livré.
