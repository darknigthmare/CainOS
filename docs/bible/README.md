# Bible associée — Digital Circus — Encore

Le [guide général de combat v1.0](references/Combat_Games_Guide_General_v1.0.txt), l’[Extension 01](references/Combat_Games_Extension_01_Tag_Taunts_Bonus_v1.0.txt) et l’[Extension 02](references/Combat_Games_Extension_02_Slots_Verrouilles_Deblocages_Abonnes_v1.0.txt) sont associés à la [bible du jeu](../DIGITAL_CIRCUS_ENCORE.md), à ses sources actuelles et au [classeur de suivi](../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx). Les trois originaux sont conservés avec leurs [empreintes et provenance](references/combat-guides-provenance.json).

## Lire et poursuivre

| Document | Rôle |
| --- | --- |
| [Intégration du guide](COMBAT_GAMES_GUIDE_INTEGRATION.md) | 30 rubriques, 100 exigences, périmètre retenu, différé et preuves attendues. |
| [Intégration des deux extensions](EXTENSIONS_COMBAT_INTEGRATION.md) | 38 rubriques supplémentaires, 114 exigences et statuts séparés ; sources originales préservées. |
| [Personnalité, sélection et équipes](PERSONNALITE_SELECTION_ET_EQUIPES.md) | 64 taunts, 64 sélections, 64 désélections et 12 duos conçus ; aucune nouvelle animation ni règle tag intégrée. |
| [Bonus, Archives et récompenses](BONUS_ARCHIVES_ET_DEBLOCAGES.md) | 8 bonus, 5 salles reliées, 8 récompenses et 9 règles de déblocage conçus. |
| [Accès, verrous et sauvegarde](CONTRATS_DROITS_ET_SAUVEGARDE.md) | Découverte, droits, installation et mode séparés ; 22 cas futurs ; soutien externe spécifié mais désactivé. |
| [Associations des personnages](ASSOCIATIONS_PERSONNAGES.md) | 64 identités reliées aux techniques, rivaux, routes, tableaux, finales et rôles globaux. |
| [La Répétition impossible](CAMPAGNE_GLOBALE.md) | Campagne commune originale : 3 actes, 12 chapitres, 36 scènes fixes écrites, non intégrées. |
| [Arènes, connexions et boss](ARENES_TRANSITIONS_BOSS.md) | Quatre axes de stage, 6 liaisons proposées et 4 contrats de boss. |
| [Direction artistique et Derniers Actes](DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md) | Anatomie, fidélité, conclusions après verdict, cibles compatibles et production statique. |
| [Fiches A–J et critères](MODELES_ET_CRITERES.md) | Modèles associés au projet et définition de terminé pour chaque étape. |

## Périmètre de cette intégration

Les 64 combattants, 640 techniques, 575 costumes et 27 arènes sont ceux du runtime existant ; les 9 crossovers sont inclus dans les arènes. La campagne globale, les six connexions et les nouvelles phases de boss sont des propositions de conception. Cette passe produit de la documentation et du suivi, **zéro image, zéro nouvelle animation et zéro mode jouable supplémentaire**.

Le [focus Pomni, Caine et abstractions du 27 novembre](../art-generation/focus-20261127/README.md) est une production distincte : deux nouvelles familles statiques, dix motifs de projectile et vingt tableaux peints. Le dossier expose les références, les adaptations et les vérifications de cette tranche ; les 36 scènes proposées pour la campagne globale gardent leur propre statut de conception.

Le récit s’inspire du ton du Circus, tout en identifiant ses créations Encore. La fidélité canonique 1:1 n’est pas certifiée globalement. Les anciennes preuves de tests restent datées ; seuls les contrôles réellement exécutés dans cette passe sont rapportés comme courants.

## Sources de vérité

[guide-design.json](guide-design.json) porte les décisions rédigées ; [guide-integration.json](guide-integration.json) porte les comptes et empreintes ; [character-associations.json](character-associations.json) relie le contenu réel. Les valeurs de combat restent définies dans [combat/](../../combat/). Les textes générés se reconstruisent avec les scripts de bible, sans modifier le moteur.

Les extensions disposent de [leur matrice](extensions-design.json), [leurs 64 fiches d’artistes](extensions-characters.json), [leurs systèmes de duo et bonus](extensions-teams-bonus.json), [leurs contrats d’accès](extensions-access.json), [leur preuve documentaire](extensions-integration.json) et [leurs tables pour le classeur](extensions-workbook-data.json). Reconstruction : `node scripts/build-combat-extensions.mjs` ; contrôle : `node scripts/build-combat-extensions.mjs --check`. Les 18 scénarios d’équipe et 22 scénarios de droits sont écrits pour une future implémentation ; ils ne sont pas comptés comme des tests moteur exécutés.
