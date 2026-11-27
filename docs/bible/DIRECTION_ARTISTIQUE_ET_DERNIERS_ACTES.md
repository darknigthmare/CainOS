# Direction artistique et conclusions de duel

## Identité, anatomie et statut des références

La cible conserve des silhouettes nettes, des compositions 2D de haute définition et les proportions propres à chaque personnage. « Fidélité 1:1 » signifie fidélité à une référence d’identité et d’apparence identifiée ; ce n’est pas une consigne d’image carrée. Une image exportée, un test technique ou un agrandissement ne certifie pas cette fidélité.

Les [associations de personnages](character-associations.json) conservent la provenance fournie par le jeu. Les attributions d’archive incertaines ne deviennent pas officielles. Les crossovers Hommage/Résident/Fusion sont des créations Encore ; ils ne transmettent pas automatiquement les pouvoirs des œuvres invitées.

Queenie ne reçoit ni bras ni épaules humains inventés. Bubble reste sphérique et s’exprime par corps, bouche et regard ; un geste écrit ne lui ajoute pas de main. Gloink Queen conserve son volume et ses appendices. Chinese Room ne reçoit ni poings humains ni biographie nouvelle. Les abstractions gardent leur forme : une conclusion ne les guérit pas et ne les transforme pas en humain.

## Vocabulaire de bible

| Terme | Fonction |
| --- | --- |
| super | Action pendant le combat, peut contribuer au KO. |
| lastAct | Dernier Acte : nom éditorial original pour conclusion après KO acquis. |
| friendly | Rappel : alternative amicale originale. |
| victory | Présentation courte du vainqueur. |
| outro | Résolution narrative d’une route ou campagne. |

« Dernier Acte » et « Rappel » sont des appellations éditoriales proposées pour Encore. Le catalogue conserve ses 192 finales, leurs IDs `impact/special/super`, leurs titres et ses 64 numéros d’amitié. Le mot `super` dans l’ID d’une finale ne confond pas la présentation après verdict avec le coup de jauge exécuté pendant le combat.

## Contrat des conclusions

Utiliser les conditions actuelles de finishers.mjs ; un futur déclenchement manuel demande sa propre commande, distance et validation. Aucun dégât ajouté après le verdict.

| Morphologie cible | Règle de mise en scène |
| --- | --- |
| humanoid | Respecter tenue, visage et accessoires ; cadrer une conséquence de spectacle. |
| limbless-or-small | Aucun poing, bras, épaule ou prise au cou inventé ; placer un accessoire ou un cadre autour de la silhouette. |
| giant | Élargir le plan, préserver le gabarit ; remplacer la saisie par un effet de décor compatible. |
| abstract-or-composite | Conserver yeux, fragments et volume ; aucune guérison, recomposition humaine ou traduction arbitraire des gestes. |

Trois temps écrits, support statique ou séquence existante ; nouvelle animation différée. Si cible incompatible : image d’arrêt et annonce de victoire, sans modifier le résultat.

Le joueur doit pouvoir abréger la présentation selon le mode ; en local, aucun contrôle anticipé d’un seul côté. Retour vers résultat/revanche par le cycle existant.

Les adaptations morphologiques et alternatives décrites ici sont des critères pour les futures mises en scène ; leur présence dans la bible ne certifie pas que chaque combinaison de cibles a été testée. Tous les nouveaux titres sont des propositions originales de bible, pas des noms officiels de la série.

### Exemple relié au catalogue : Encore debout

ID `pomni.impact`, 180 ticks de présentation, soit 3 secondes à 60 Hz ; il ne s’agit pas de 180 fichiers image. Les portes sont des accessoires de scène. Elles ne téléportent pas Pomni et ne lui permettent pas de quitter le cirque.

| Tick de présentation | Temps | Action décrite |
| --- | --- | --- |
| 0 | Un pas de trop | Une porte portant EXIT et une flèche au sol se dévoilent derrière le tableau. |
| 60 | Est-ce terminé ? | Le panneau reste un accessoire fermé ; la composition laisse Pomni entièrement visible. |
| 120 | Reprendre son souffle | La porte et la flèche se stabilisent tandis que la pose de résultat existante conclut la scène. |

Les 192 finales sont reliées dans [l’index des personnages](ASSOCIATIONS_PERSONNAGES.md). Cet exemple utilise le titre déjà livré ; il ne crée pas une scène officielle de la série.

## Production d’images et contrôle

Un sprite demandé détouré exige un alpha réel, son orientation native, ses ancrages et ses marges. Un fichier de portrait et un fichier de garde constituent le lot d’une base statique ; les dessins d’action et cycles complets ne sont pas annoncés comme produits lorsqu’ils sont absents. Les scènes narratives peuvent réunir plusieurs acteurs mais gardent une action claire, un cadrage et les sous-titres hors image.

Chaque source conserve son ID, ses dimensions natives, sa provenance, son SHA-256 et son usage. La revue vérifie silhouette, membres, asymétries, tenue, accessoires, lisibilité et taille dans le jeu. Les nouvelles scènes de campagne sont des briefs ; leurs illustrations restent à créer. Les 104 peintures intro/outro existantes et 280 compositions sont à relire avant de décider d’un remplacement.

Les nouveaux cycles d’animation, voix et cinématiques animées attendent une phase dédiée. Les éléments déjà présents sont conservés, sans nouvelle certification artistique globale dans cette livraison.

Sources : [guide fourni, fiches B/D/F/J](references/Combat_Games_Guide_General_v1.0.txt), [catalogue des finales](../../combat/finisher-catalog.mjs), [numéros d’amitié](../../combat/friendship-catalog.mjs), [règles de déclenchement](../../combat/finishers.mjs), [fidélité](../../combat/fidelity.mjs), [illustrations](../../combat/illustrations.mjs).
