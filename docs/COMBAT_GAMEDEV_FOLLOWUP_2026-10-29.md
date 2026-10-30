# Suite gamedev : sons de validation et récupération du profil

Date : 29 octobre 2026. Jeu : Digital Circus — Encore 0.7.0.
Sources vérifiées : [`d1160465a6c980733df20a207b22a4c7a49e1240`](https://github.com/darknigthmare/CainOS/commit/d1160465a6c980733df20a207b22a4c7a49e1240).

Cette passe prolonge la sélection de guides déjà intégrée. Le guide audio est
appliqué aux événements de déchope et de validation. Le guide sauvegarde est
appliqué à la copie de secours locale, à la récupération et à son information
dans l’interface. CainOS et l’autonome conservent le même runtime de combat.

## Comportements livrés

La déchope possède le motif `throwTech`, distinct de la parade. La validation
possède le motif `confirm`, distinct de la sélection. Le catalogue compte
26 motifs synthétiques. Les validations acceptées des réglages, liaisons,
imports, restauration et reprise utilisent le signal de confirmation. Les actions
refusées gardent leur signal de refus ; le lancement de rencontre conserve son
signal de départ. Les enveloppes, temporisations et ressources sont bornées.

Après une sauvegarde primaire réussie, le même profil validé est copié dans une
clé de secours. Une lecture valide du primaire reste prioritaire. Si le primaire
est corrompu, notamment vide, tronqué ou incompatible, une copie de secours
compatible peut être chargée au démarrage. La lecture n’écrit aucune clé. L’interface explique
la récupération et propose de conserver le profil ou d’en exporter une copie.

Une clé primaire supprimée ne fait pas réapparaître un ancien secours. Un
checkpoint de programme invalide est retiré sans réinitialiser les autres données
compatibles. Les imports manuels restent stricts. Un événement de stockage
invalide, inaccessible ou retombant sur un secours plus ancien conserve le profil déjà en mémoire. Le rafraîchissement utilisé pour les récompenses applique la même règle. La notice distingue le profil récupéré au démarrage du profil de session conservé. Le schéma de profil
v1 et les règles de simulation des replays restent identiques.

L’échec d’écriture du primaire préserve le secours. Si seule la copie de secours
échoue, le primaire réussi reste exploitable et le secours peut être plus ancien.
La copie locale dépend du même navigateur et du même site ; l’export constitue
une copie indépendante.

## Vérifications exécutées

| Vérification | Résultat |
| --- | --- |
| Node | 356/356 réussis, 26 suites |
| Chromium | 259/259 réussis, 15 suites |
| Contrôle ciblé audio Node | 40/40 réussis |
| Contrôle ciblé audio navigateur | 27/27 réussis |
| Contrôle ciblé sauvegarde Node | 63/63 réussis |
| Contrôle ciblé sauvegarde navigateur | 19/19 réussis |

Les 615 cas courants proviennent de l’unique
[campagne GitHub Actions 40898388692](https://github.com/darknigthmare/CainOS/actions/runs/40898388692).
Les empreintes des sources et des tests correspondent à celles de la copie
locale. L’archive de preuves porte le SHA-256
`f65749118e089474fbfb6350b92dec8c0021fd59c9506a978d1d00f9ab68fcb4`.

Une tentative locale indépendante a rencontré trois dépassements de délai avant
son interruption. Son état d’avancement, ses échecs et les références de ses
journaux sont conservés dans `retryHistory`.
Leur cause exacte n’est pas établie. Ces résultats partiels restent hors du
décompte de la campagne complète retenue.

Preuve complète : [campagne GDF26](combat-qa-evidence-gamedev-followup-2026-10-29.json).
Preuves ciblées et comparaison initiale : [audio et sauvegarde](gamedev-followup-validation-2026-10-29.json).

Les cas de la campagne actuelle sont décomptés une fois chacun. Les quatre
contrôles ciblés renvoient à des vérifications qui recoupent cette campagne.
Les campagnes précédentes restent dans leurs fichiers et dans les lignes
existantes du classeur.

## Mise à jour du classeur

Le classeur conserve ses 10 feuilles, ses 9 tableaux natifs et les identifiants
existants. Les notes utilisateur restent liées à ces identifiants.

| Élément suivi | Résultat |
| --- | --- |
| Fonctionnalités | 105, nombre inchangé |
| Tâches de production | 689, dont trois nouvelles |
| Motifs sonores | 26 |
| Lignes QA historiques conservées | 1 587 |
| Cas de la campagne actuelle | 615 |
| Contrôles ciblés de cette passe | 4 |
| Lignes QA au total | 2 206 |
| Références | 66 |

`SFX-tech` et `SFX-confirm` passent de Partiel à Implémenté sur la portée
technique vérifiée. `SYNTH-throwTech`, `SYNTH-confirm` et
`GDF26-PROFILE-BACKUP` sont ajoutés à Production. Les critères de
`PRE-08`, `PRO-01` et `PRO-10` sont actualisés. `SYNTH-parry`
indique que la déchope n’est plus un alias de la parade.

`PRE-08` reste Partiel : les voix dédiées et l’écoute du mixage sur plusieurs
appareils restent ouvertes. Les fonctionnalités de personnalisation de profil,
de synchronisation cloud et de lecture des couleurs ne sont pas déclarées terminées
par cette passe.

Les 39 formules ont été recalculées et les 39 valeurs de synthèse ont été
comparées aux données. Aucun défaut de calcul n’a été détecté. Une modification
temporaire de statut a fait évoluer le total attendu, puis a été restaurée.
L’export et sa réimportation conservent les données, identifiants, formules et
9 tableaux natifs. Les colonnes de notes utilisateur sont conservées ; aucune
note utilisateur n’était renseignée dans le classeur initial.

La comparaison avec le classeur du commit `f9f5356` porte sur 34 136 cellules
d’origine. Elle ne relève aucune modification de style de cellule, aucune valeur
changée hors des éditions prévues, ni aucune modification des largeurs de
colonnes, des vues ou du format global des feuilles. Aucune hauteur existante
n’est réduite. Les descriptions modifiées disposent de hauteurs adaptées.
La légende des références est conservée après un décalage d’une ligne.

Les 1 587 anciennes lignes QA restent identiques. Cette mise à jour modifie
19 cellules de données existantes, ajoute trois tâches de production, 619 lignes
QA et une référence. Les 619 lignes QA correspondent à 615 cas de campagne et
quatre contrôles ciblés. Dix vues des cinq feuilles modifiées ont été inspectées
visuellement ; aucun texte coupé n’a été relevé dans ces vues.

Une seconde génération isolée à partir du résultat n’ajoute aucune ligne et ne
modifie aucune cellule de données. Son JSON de suivi est identique octet à octet.
La publication reprend ensuite les quatre fichiers vérifiés sans recalcul ni
réécriture de leur contenu.

Empreinte SHA-256 du classeur livré :
`e5c586336eb9ce82d9f9189f649926768174752b008e63de9a8b8165f2dfbf33`.

Empreinte SHA-256 des données de suivi :
`f4ff027439920ec2054b1a14de508b39804b8648019eb7aa48857e12d5177a41`.

Le générateur est
[`update-combat-workbook-gamedev-followup.mjs`](../scripts/update-combat-workbook-gamedev-followup.mjs).
Il importe le classeur existant, valide les sources des preuves, applique les
modifications par identifiant, recalcule et exporte avant de publier les quatre
fichiers compagnons avec sauvegardes et restauration sur erreur interceptée.
La procédure de publication est décrite dans
[COMBAT_WORKBOOK_PUBLICATION.md](COMBAT_WORKBOOK_PUBLICATION.md).

## Portée de la vérification

Les preuves audio utilisent les assertions Node et WebAudio dans Chromium.
Les mesures PCM établissent que les motifs exécutés sont distincts et finis ;
elles ne remplacent pas l’écoute sur casque ou haut-parleurs physiques.

Les parcours de sauvegarde sont exécutés dans le navigateur, y compris
l’interface autonome et l’application Combat ouverte depuis CainOS. Les tailles
d’écran mobiles sont simulées. Téléphones, tablettes et manettes physiques
conservent leurs tâches de vérification.

Le classeur est recalculé, rendu et réimporté avec le moteur tableur disponible.
Aucune ouverture dans Excel de bureau n’est déclarée. La comparaison artistique
canonique, les voix dédiées et les nouveaux dessins de combat restent ouverts.
