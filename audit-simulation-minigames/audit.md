# Audit mini-jeux simulation CainOS

Date: 2026-06-28

## Surface auditee

- Lecteur de sous-episodes interactifs.
- Moteur `StoryMicroGame` dans `episodes.js`.
- Difference attendue: phase OS = manipulation systeme CainOS, phase simulation = vrai mini-jeu visuel dans l'aventure.

## Limite de capture

La capture navigateur locale n'a pas pu etre finalisee via l'in-app browser: le serveur local a ete demarre, mais la navigation a ete bloquee/refusee pendant la tentative de screenshot. L'audit ci-dessous s'appuie donc sur l'inspection du code runtime et sur le build local. Les checks executables ont ete faits apres correction.

## Constat avant correction

1. Phase OS et phase simulation utilisaient la meme structure de jeu.
   - Meme canvas.
   - Meme boucle `click`, `repair`, `sequence`, `dodge`.
   - Meme logique de score et de collisions.
   - La phase simulation ne faisait que changer le decor/couleurs.

2. La simulation ne ressemblait pas assez aux vrais mini-jeux d'episode.
   - Les jeux existants comme `Episode1Game` ou `Episode2Game` ont un gameplay propre: labyrinthe, camion, colliders, runner, gestion de risque.
   - `StoryMicroGame` restait trop abstrait: noeuds, tuiles, directions, signaux.

3. Le lore et le contexte etaient lisibles, mais pas incarnes.
   - Les checkpoints contenaient bien `Candy Canyon`, `Gummigoo`, `Spudsy`, `Mildenhall`, `Queenie`, etc.
   - Le moteur ne transformait pas assez ces contextes en actions de scene.

4. Risque UX principal.
   - Le joueur pouvait avoir l'impression de faire deux mini-jeux OS a la suite.
   - Le changement de phase etait informatif, pas ludique.

## Correction appliquee

1. Ajout d'une branche gameplay dediee a la phase simulation.
   - `StoryMicroGame.loop()` route maintenant la phase simulation vers `updateSimulationGame()` et `drawSimulationGame()`.
   - `handleClick()` route aussi les clics vers `handleSimulationClick()` quand la phase est en simulation.

2. Ajout de scenes de simulation par contexte.
   - `truck`: route + camion citerne Candy Canyon.
   - `restaurant`: comptoir Spudsy + Gangle + commandes.
   - `beach`: plage + parasol + crevettes/soleil.
   - `manor`: manoir sombre + lampe + Pomni.
   - `arena`: terrain/arene + Jax + cibles.
   - `memory`: fragments de souvenir + Kinger.
   - `office`: bureau C&A + terminal/mannequin.
   - `circus`: fallback cirque.

3. Ajout de gameplay simulation distinct.
   - Runner horizontal pour camion/cirque/memoire.
   - Catch vertical pour Spudsy.
   - Protection au curseur pour plage.
   - Click-target pour manoir/office/arene.
   - Entites bonnes/mauvaises avec collisions et penalites.

4. Ajout de sprites pixel-art simples.
   - Camion, cactus, Gangle, burger, parasol, crevette, Pomni, Jax, cible, Kinger, terminal, mannequin, etoile.

## Evaluation apres correction

1. OS vs simulation
   - Sain: la phase OS garde les noeuds/tuiles/sequences systeme.
   - Sain: la phase simulation a maintenant une boucle de jeu separee.

2. Coherence lore
   - Sain pour episode 2: Candy Canyon et Gummigoo declenchent `truck`.
   - Sain pour episode 4: Spudsy/Gangle/commandes declenchent `restaurant`.
   - Sain pour episode 7: beach/sun/shrimp/lake declenchent `beach`.
   - Sain pour episode 3: ghost/horror/Mildenhall declenchent `manor`.
   - A surveiller: certains sous-episodes hybrides peuvent tomber sur `circus` si leurs mots-clefs ne sont pas assez explicites.

3. Coherence application
   - Sain: le moteur reste centralise, sans dupliquer un jeu complet par checkpoint.
   - Sain: la progression et les retries restent relies a `StoryMicroGame`.
   - A surveiller: le rendu est encore canvas-code; il faudra idealement remplacer certains sprites par assets pixel art dedicies quand la direction visuelle sera stabilisee.

4. Amusement
   - Ameliore: la phase simulation demande maintenant une action differente de l'OS.
   - Ameliore: le type de mini-jeu change selon le contexte.
   - A ameliorer ensuite: ajouter des objectifs plus uniques par sous-episode, pas seulement par famille de scene.

## Verification technique

- `node --check episodes.js`: OK.
- `git diff --check`: OK.
- `cmd /c npm run build`: OK apres arret du serveur local qui verrouillait `dist`.

## Recommandations suivantes

1. Ajouter un champ explicite dans chaque checkpoint: `simulationGame`.
   - Exemple: `truck-runner`, `spudsy-catch`, `manor-flashlight`, `beach-shield`.
   - Cela evitera de deviner la scene par mots-clefs.

2. Donner un mini-jeu unique aux sous-episodes majeurs.
   - Episode 1: labyrinthe/portes/exit office.
   - Episode 2: camion/convoi/collision/canyon.
   - Episode 3: lampe/ombre/possession.
   - Episode 4: commandes/manager/burnout.
   - Episode 5: roulette de suggestion box.
   - Episode 6: tir/cibles/awards.
   - Episode 7: plage/soleil/crevettes.
   - Episode 8: souvenirs/Queenie/Kinger.
   - Episode 9: noir et blanc/recolorisation/identite.

3. Remplacer progressivement les sprites canvas par les assets pixel art CainOS deja crees.

4. Faire un vrai passage screenshot apres stabilisation du navigateur local.

## Mise a jour - mapping par sous-episode

Correction ajoutee le 2026-06-28:

- Chaque sous-episode des episodes 1 a 9 a maintenant une specification de mini-jeu de simulation explicite dans `StoryMicroGame.getSimulationGameSpec()`.
- Le moteur n'utilise plus seulement des mots-clefs pour choisir l'action de simulation.
- Les objectifs, instructions, labels bons et labels dangereux viennent de cette specification.
- Verification de couverture: 72 checkpoints d'episodes, 72 specifications, 0 manque, 0 doublon.
