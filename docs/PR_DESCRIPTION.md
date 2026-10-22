## Pourquoi

CainOS possède déjà ses simulations et ses archives, mais aucun jeu de combat
comparable au CQC du projet Metal Gear. Cette modification ajoute **Digital Circus
— Encore / Le Grand Duel**, utilisable dans le bureau CainOS et comme jeu de
navigateur autonome, avec une seule base de code et un classeur de production.

## Ce qui change

- Nouvelle icône **Circus Combat**, entrée du menu Démarrer et fenêtre intégrée.
  Le chargement est différé ; réduire ou masquer la fenêtre suspend le combat.
- Port substantiel du noyau CQC réel, enveloppé en module indépendant à 60 Hz :
  garde haute/basse, saisies/déchopes, combos, parades, projectiles, ressources,
  effets d’état, IA déterministe et manches.
- **14 combattants, 140 techniques, 12 arènes, 74 variantes et 179 apparences**
  archivées. Les techniques sont des adaptations de fan-game.
- Sept modes : Versus CPU, duel local, Arcade de six rencontres, Boss de quatre
  rencontres, Survie de dix vagues, entraînement et six défis mesurables.
- Clavier AZERTY/QWERTY, commandes tactiles et API Gamepad ; profils versionnés,
  import/export JSON et replay déterministe sans ajout de résultats à la lecture.
- `npm run build:combat` produit `dist-combat/`, distribuable sans runtime CainOS.
  `npm run build` conserve l’application de combat dans la distribution de l’OS.
- Le build existant copie également `cloud-account.js` et le favicon référencés.
- Classeur **docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx** : dix feuilles, inventaires,
  fonctionnalités, production, scénarios, QA et références. Les statuts distinguent
  les éléments livrés, partiels, prévus et restant à vérifier.

## Corrections apportées au port

La garde maintenue reste active après le blockstun ; une annulation refusée ne
supprime plus la récupération ; déchope, dash arrière et portée des projectiles
sont bornés correctement. Les touches brèves sont conservées jusqu’au tick suivant.
Les portées de la reine correspondent à son corps allongé. Les résultats restent
exportables si le stockage échoue, et Échap ne ferme plus les dialogues terminaux
contenant les actions de poursuite.

## Références de départ

- CainOS `main` : `4926834a2f063028903d6431e77f0bece859e671`.
- CQC : `42279c1c884769873e66bbda0b6fe849bcd2f1a2`, branche
  `codex/cqc-p38-archive-projectile-range`, intégrant la garde-robe P39.
- Provenance précise du moteur et architecture : `docs/DIGITAL_CIRCUS_ENCORE.md`.

## Validation effectuée

- `npm run qa` : audits CainOS existants, syntaxe, **40 tests moteur et 23 tests
  session/commandes**, puis les deux builds : réussite.
- `tests/combat-browser.mjs` : **11 parcours** réussis, dont calibration CainOS,
  lancement dans le bureau, pause à la réduction, commandes J2 et tactile à 390 px.
- `tests/combat-progression-browser.mjs` : **9 vérifications** réussies, dont match
  réel, snapshot final du replay identique, premières transitions Arcade/Boss/
  Survie, persistance, imports invalides et build autonome sur une seconde origine.
- Régression ciblée `COMBAT_TEST_SCOPE=storage` : deux défis réellement accomplis
  avec écritures de stockage refusées, export exact et dialogues maintenus après
  Échap. La suite complète comporte désormais dix vérifications ; seuls ces
  correctifs ont été revérifiés après la précédente exécution complète.
- Aucune erreur JavaScript/HTTP lors des parcours consignés. Les 140 techniques
  et les six défis sont couverts par les tests comportementaux.
- Excel : dix feuilles, neuf tableaux filtrables, trente formules, listes de
  validation, recalcul contrôlé et aucune cellule en erreur.

Les preuves et leurs limites sont conservées dans `docs/combat-qa-evidence.json`
et `docs/combat-workbook-verification.json`.

## Limites explicites

Le standalone livré est une application statique de navigateur. Les animations
actuelles réutilisent les planches et poses CainOS ; animations de combat dédiées,
musique complète, équilibrage compétitif, réseau et paquets natifs restent suivis
dans le classeur. Les essais de manettes et de téléphones physiques, les 74 costumes
en revue visuelle complète et les parcours jusqu’à toutes les médailles ne sont
pas déclarés validés.
