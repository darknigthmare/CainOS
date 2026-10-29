# Méthode de développement — CainOS / Digital Circus Encore

Cette méthode applique une sélection de
[awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills)
à l'architecture existante. Le snapshot documentaire est fixé au commit
[`19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9`](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/commit/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9)
du 28 octobre 2026. Les sources ont été récupérées et leurs blobs Git vérifiés
le 29 octobre 2026.

La sélection comprend le routeur et neuf guides : commandes, physique, sensations,
interface, assets, performances, audio, IA et sauvegardes. Leurs fichiers et
références sont conservés sans modification dans [gamedev/upstream](gamedev/upstream/).
Le [manifeste](gamedev/manifest.json) donne l'URL et l'empreinte de chaque fichier.
Les auteurs et contributeurs sont crédités dans le [NOTICE](gamedev/upstream/NOTICE)
et les fichiers amont restent sous [Apache-2.0](gamedev/upstream/LICENSE). Cette
licence concerne ces guides ; elle ne décrit pas les droits des contenus du jeu.

## Contrat du projet vérifié

Base inspectée : [CainOS `146a68c`](https://github.com/darknigthmare/CainOS/commit/146a68cc87ea088a4dbcf76694115118fc9ed775),
Encore 0.7.0. Les constantes présentes dans les sources restent la référence
lorsqu'une version ultérieure les fait évoluer.

| Responsabilité | Fichiers et points d'entrée constatés | Application des guides |
| --- | --- | --- |
| Application et cycle de vie | [combat/app.mjs](../combat/app.mjs) : `InputController`, `renderFight`, lancement des matchs et boucle d'affichage ; [combat/index.html](../combat/index.html) | Faire passer pause, fermeture et navigation par les chemins existants ; vérifier l'état et le focus au retour. |
| Simulation | [combat/engine.mjs](../combat/engine.mjs) : `CombatEngine`, `FIXED_DT = 1 / 60`, `ENGINE_RULES_VERSION` | Garder les règles dans le pas fixe ; relier les effets aux événements. Les durées de coups et fenêtres de combos appartiennent au combat. |
| Commandes | [combat/input.mjs](../combat/input.mjs) : `InputController.poll`, `pollMenu`, `clear` ; [combat/bindings.mjs](../combat/bindings.mjs) : `cleanBindings` | Traiter appui, maintien, annulation, changement de périphérique et interruptions comme des comportements distincts. |
| Contenu et identité | [combat/data.mjs](../combat/data.mjs), [combat/sprite-catalog.mjs](../combat/sprite-catalog.mjs), [combat/fidelity.mjs](../combat/fidelity.mjs), [combat/costume-fidelity.mjs](../combat/costume-fidelity.mjs) | Relier l'identifiant, la référence, l'état de comparaison et l'asset effectivement affiché. |
| Dessin et animations | [combat/render.mjs](../combat/render.mjs), [combat/render-poses.mjs](../combat/render-poses.mjs), [combat/render-stage-scenery.mjs](../combat/render-stage-scenery.mjs) | Contrôler dimensions, alpha, cadrage, échelle, points d'ancrage et continuité en mouvement à la résolution logique 1280 × 720. |
| Sons et effets | [combat/audio.mjs](../combat/audio.mjs), [combat/audio-ambiences.mjs](../combat/audio-ambiences.mjs), [combat/finishers.mjs](../combat/finishers.mjs) | Distinguer musique, ambiance et signaux de combat ; vérifier pause, répétition, fermeture et réduction des mouvements. |
| Profils et replays | [combat/session.mjs](../combat/session.mjs) : `validateProfile`, `packInput`, `replayRulesVersion` ; [combat/progression.mjs](../combat/progression.mjs) | Garder la version enregistrée et sélectionner ses règles. Les versions 0.5, 0.6 et 0.7 utilisent actuellement les règles 0.5. |
| Distribution | [scripts/build-static.js](../scripts/build-static.js), [scripts/build-combat.mjs](../scripts/build-combat.mjs), [scripts/build-combat-offline.mjs](../scripts/build-combat-offline.mjs) | Construire CainOS et l'autonome à partir du même dossier `combat/`. Régénérer le manifeste hors ligne après modification des sources concernées. |
| Vérification et suivi | [scripts/run-combat-ci.mjs](../scripts/run-combat-ci.mjs), [scripts/combat-ci-suites.mjs](../scripts/combat-ci-suites.mjs), [COMBAT_WORKBOOK_PUBLICATION.md](COMBAT_WORKBOOK_PUBLICATION.md) | Utiliser des résultats liés aux empreintes des fichiers ; publier le classeur avec ses données et preuves cohérentes. |

## Routage pratique

Lire le [routeur](gamedev/upstream/router/SKILL.md) et le
[guide des moteurs maison](gamedev/upstream/router/references/custom-engines.md)
pour établir le contrat, puis sélectionner les guides utiles au changement.
Les références externes à d'autres moteurs dans le snapshot décrivent aussi
l'ensemble du catalogue amont ; seuls les modules listés au manifeste sont
présents ici.

| Chantier | Guide local | Critères d'acceptation adaptés |
| --- | --- | --- |
| Clavier, tactile, manettes | [input-systems](gamedev/upstream/skills/disciplines/input-systems/SKILL.md) | Un appui discret produit l'action attendue ; une annulation ne produit pas de nouvelle action ; pause et focus ont des transitions explicites ; les deux joueurs restent indépendants. |
| Timings, collisions | [physics-tuning](gamedev/upstream/skills/disciplines/physics-tuning/SKILL.md) | Les résultats de simulation et replays restent cohérents avec leurs règles à plusieurs cadences d'affichage ; les limites de rattrapage sont respectées. |
| Impacts et présentation | [game-feel](gamedev/upstream/skills/disciplines/game-feel/SKILL.md) | Chaque réaction est liée à un événement et finit ; une secousse ne déplace pas les collisions ; la réduction des mouvements est respectée. |
| HUD, menus et navigation | [game-ui-ux](gamedev/upstream/skills/disciplines/game-ui-ux/SKILL.md) | Un contrôle reçoit le focus initial et le conserve après reconstruction ; retour et pause restent utilisables ; les éléments essentiels sont visibles aux tailles testées. |
| Personnages, costumes, animations et scènes | [create-game-assets](gamedev/upstream/skills/disciplines/create-game-assets/SKILL.md) | Identité, proportions, ancrage, état visuel et référence sont contrôlés dans le jeu ; les poses transformées et dessins dédiés sont identifiés séparément. |
| Cadence, mémoire et chargement | [performance-optimization](gamedev/upstream/skills/disciplines/performance-optimization/SKILL.md) | Une scène et une configuration reproduisent le coût ; les mesures avant/après portent sur les mêmes conditions ; les limites de mesure sont indiquées. |
| Effets sonores et musique | [audio-design](gamedev/upstream/skills/disciplines/audio-design/SKILL.md) | Les réglages restent indépendants, les sons de combat sont lisibles, et le cycle d'ouverture/fermeture ne laisse pas de son actif indésirable. |
| Adversaires et difficulté | [game-ai](gamedev/upstream/skills/disciplines/game-ai/SKILL.md) | Les décisions respectent ressources, cooldowns et règles ; les scénarios de référence restent reproductibles avec la même graine. |
| Progression, import et replays | [save-systems](gamedev/upstream/skills/disciplines/save-systems/SKILL.md) | Import/export et reprise préservent les données autorisées ; les anciennes versions reconnues gardent leur comportement ; la lecture d'un replay n'accorde pas de récompense. |

### Adaptations propres au combat

- Le pas de simulation actuel vaut 1/60 seconde. Une fenêtre d'entrée ou de
  combo se définit avec les règles du combat et ses tests ; les valeurs de saut
  ou de coyote time des exemples amont ne fixent pas ces paramètres.
- Le guide de sensations illustre parfois un ralentissement global. Dans CainOS,
  une pause d'impact doit préciser la portée de son horloge : simulation,
  présentation et menus. Vérifier les entrées pendant la pause et l'effet sur
  les replays avant de modifier les règles.
- La cadence de simulation et le débit d'affichage sont deux mesures distinctes.
  Un objectif de 60 images/s correspond à environ 16,67 ms par image affichée ;
  il demande une mesure sur une configuration nommée.
- Les guides ne fournissent pas un moteur de combat réseau ni un système de
  rollback. Un tel chantier nécessite son propre contrat et sa validation.
- La fidélité canonique nécessite une comparaison attribuée. Une validation
  technique du PNG, un nombre de tests ou une pose obtenue par transformation
  ne certifie pas à lui seul la fidélité 1:1.

## Un changement, de l'observation à la livraison

1. **Définir le résultat attendu.** Relier le chantier aux identifiants déjà
   présents dans le suivi. Lire le système existant et la preuve précédente.
2. **Observer le point de départ.** Pour une correction, reproduire le défaut.
   Pour un visuel, choisir la référence et l'afficher à l'échelle du jeu. Pour
   les performances, relever la scène, la machine et la mesure.
3. **Lire le guide utile et implémenter.** Faire une tranche complète et limitée
   du comportement ; utiliser les interfaces existantes. En travail parallèle,
   attribuer les fichiers et réunir les changements avant les vérifications.
4. **Vérifier le comportement touché.** Exécuter les tests existants pertinents,
   puis le parcours jouable concerné. Un test de régression supplémentaire doit
   protéger un défaut reproduit ou une règle nouvelle.
5. **Écrire la preuve.** Indiquer les commandes, résultats, fichiers/empreintes
   et limites. Les captures montrent l'état réellement exécuté.
6. **Mettre à jour le suivi et la livraison.** Conserver identifiants, ordre et
   notes ; distinguer création, intégration, vérification et comparaison
   visuelle. Utiliser les statuts existants, sans déclarer exécuté un essai
   matériel absent. Contrôler les deux distributions si la modification les
   affecte.

### Commandes existantes et portée

Les scripts ci-dessous viennent du projet inspecté. Les tests Node et builds
statiques utilisent Node ; le serveur local utilise Python 3. L'environnement de
développement Vite se prépare avec `npm ci`. La CI installe son runtime navigateur
selon [.github/workflows/encore-qa.yml](../.github/workflows/encore-qa.yml).
Le générateur du classeur nécessite le moteur tableur indiqué dans sa documentation.

| Besoin | Commande depuis la racine |
| --- | --- |
| Vérifier provenance et présence des guides | `node scripts/audit-gamedev-guides.mjs` |
| Vérifier les guides et les assets du jeu | `npm run qa:gamedev` |
| Auditer les PNG, régions, animations et transparences | `npm run audit:combat-assets` |
| Lancer les tests comportementaux du combat | `npm run test:combat` |
| Vérifier combat et distribution autonome | `npm run qa:combat` |
| Vérifier CainOS, combat et les deux builds | `npm run qa` |
| Exécuter et collecter les suites navigateur configurées | `node scripts/run-combat-ci.mjs` |
| Construire l'autonome à partir du runtime commun | `npm run build:combat` |
| Produire une livraison après revue cohérente du classeur | `node scripts/package-combat-release.mjs --if-reviewed` |

Exemples de tests ciblés à choisir selon les fichiers modifiés :

- Commandes : `tests/combat-bindings.test.mjs`,
  `tests/combat-input-browser.mjs`.
- Simulation et règles : `tests/combat-engine.test.mjs`,
  `tests/combat-rules.test.mjs`, `tests/combat-training.test.mjs`.
- Présentation : suites `combat-render*`, `combat-fidelity*` et
  `combat-costume*` ; inspection visuelle adaptée au contenu changé.
- Navigation et réduction des mouvements :
  `tests/combat-accessibility-browser.mjs`,
  `tests/combat-reduced-motion-browser.mjs`.
- Profil, progression, stockage et hors ligne : suites `combat-session*`,
  `combat-progression*`, `combat-profile-recovery*`, `combat-offline*`.
- Audio : suites `combat-audio*`.

Les scripts navigateur ciblés attendent un serveur HTTP et acceptent
`COMBAT_TEST_URL`. Le collecteur complet crée son propre serveur et vérifie qu'il
sert le runtime testé. Les tests automatisés de manettes virtuelles ne constituent
pas une vérification sur deux manettes physiques.

### Audit technique des assets

`scripts/audit-combat-assets.mjs` lit les catalogues du runtime et utilise
`spriteSourceRegion` pour calculer les régions effectivement sélectionnées.
Le contrôle couvre les sprites des combattants et des archives, les variantes
sélectionnables, les références de frames et chaque cellule des animations
enregistrées. Les dimensions, grilles et ancres sont comparées aux registrations
présentes dans `combat/render-poses.mjs`.

Le passage raster appelle les fonctions `inspect` et `alpha_stats` du guide
graphique conservé. Python ouvre les PNG en lecture seule, vérifie leur décodage
et inspecte les crops en mémoire. Il utilise Python 3/Pillow, avec la version
de dépendance fixée dans `scripts/requirements-gamedev.txt`. L'environnement
primaire est choisi par `CODEX_PRIMARY_RUNTIME_PYTHON` lorsqu'il est disponible ;
le choix par défaut est `python3`. L'import se fait sans cache Python écrit dans
le snapshot.

Le rapport déterministe `audit-combat/assets-report.json` conserve les SHA-256,
tailles, dimensions, régions, ancres et liens aux registres de fidélité existants.
Une région déclarée alpha natif doit comporter de la transparence réelle et des
pixels visibles au seuil du renderer. Les anciennes planches opaques utilisant
le détourage du moteur restent autorisées ; leur résultat après détourage relève
des tests de rendu. Le programme termine en erreur en cas de violation.

Les tests `tests/combat-assets.test.mjs` emploient de vrais petits PNG temporaires
pour vérifier les refus de crops hors atlas, frames invalides, alpha natif
opaque, contenu transparent vide, dimensions ou ancres incohérentes et PNG
endommagés. Ils vérifient aussi la stabilité du rapport et des octets sources.
L'audit technique ne prouve ni une fidélité canonique, ni l'absence de membre
coupé, ni la qualité de l'animation : ces points demandent la comparaison et
l'observation dans le jeu.

## Relier la preuve à l'Excel

Le classeur existant et ses données compagnons restent la source de suivi.
Réutiliser les colonnes prévues pour l'objectif, l'état, les dépendances, les
preuves et les notes ; ajouter une référence au guide pertinent dans la
description ou la preuve de la tâche. Conserver le sens des statuts établis.

| Nature du travail | Preuve utile |
| --- | --- |
| Correction de commande | Reproduction initiale, test de régression et parcours réel concerné |
| Animation ou costume | Source attribuée, aperçu en mouvement, ancrage et comparaison visuelle |
| Règle de combat | Cas de simulation, timings, interactions et compatibilité de replay |
| Interface | Parcours clavier/manette/tactile et résolutions effectivement vérifiées |
| Performance | Scène, configuration, outil et mesures comparables |
| Guides | Révision amont, empreintes des fichiers et contrat projet relu |

Les détails de publication, de restauration et de conservation des notes sont dans
[COMBAT_WORKBOOK_PUBLICATION.md](COMBAT_WORKBOOK_PUBLICATION.md).
Un historique réussi reste un historique ; une nouvelle passe indique ses propres
exécutions et les essais restant à faire.

## Mise à jour des guides

Les fichiers sous `gamedev/upstream/` sont des copies documentaires fidèles.
Conserver les décisions CainOS dans ce document. Pour une mise à jour amont :

1. Inspecter les changements entre la révision enregistrée et celle proposée.
2. Récupérer ensemble les dossiers sélectionnés, LICENSE et NOTICE.
3. Vérifier les octets avec les blobs du nouveau commit, puis mettre à jour le
   manifeste et les liens de provenance.
4. Relire les instructions qui touchent les systèmes du jeu et exécuter
   `node scripts/audit-gamedev-guides.mjs`.
5. Faire passer toute modification du comportement par le cycle de vérification
   du projet.

Aucune commande d'installation des guides n'est exécutée par cette intégration.
L'audit technique réutilise les deux fonctions de lecture décrites ci-dessus ;
les autres scripts d'assets du snapshot restent des outils optionnels à examiner
avant un usage ciblé.
