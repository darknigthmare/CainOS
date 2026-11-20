# Revue de référence — Zooble Café

Date : 20 novembre 2026. Relecteur : `root`.

## Source et distinction

La référence de costume est l’illustration officielle DECOTTO / Animate Café × The Amazing Digital Circus, publiée dans le [communiqué Animate sur PR TIMES](https://prtimes.jp/main/html/rd/p/000008857.000016756.html). La copie examinée est `references/animate-press-main.jpg`, SHA-256 `135cc4a9f9a02c4ed0b9358c98754ab5339a054520c6ad53c9dd2a02323f397b`.

La tête triangulaire rose, l’œil jaune spiralé, l’œil blanc à pupille noire, l’antenne cyan, l’antenne spiralée noire et blanche et la petite aile rose sont conservés. La tenue associe un gilet violet, un petit nœud papillon sombre, un plastron blanc, des manches blanches courtes et un long tablier bleu nuit bordé de violet. Le bras vert se termine par une main jaune ; le bras rouge par une pince grise. Les deux terminaisons inférieures restent distinctes : spirale jaune et chaussure fermée bleu nuit.

Cette famille diffère de `noirzooble`, dont la palette corporelle est grise, le tablier clair et les pieds différents. Le verre et son contenu présents sur l’affiche sont des accessoires de présentation : ils ne sont pas ajoutés aux poses de combat. Les attaches dissimulées par le vêtement et les vues arrière sont des adaptations sobres, sans prétention de nouvelle rotation canonique.

## Génération et conservation native

La définition figée est `definitions/cafezooble.json`, SHA-256 `f6cbef6ee7b484a505bbef70f6f45fcacf8f17d2c8c222b867a914e3ba0f8407`. Les onze jobs et reçus conservent les prompts exacts, les références ordonnées et leurs empreintes. Chaque dessin provient d’un appel distinct à `image_gen.imagegen` avec transparence native.

La première sélection comportait un petit détail doré de chaussure non repris de l’affiche. Une nouvelle génération a corrigé ce détail et affiné le cadrage. La première sortie est archivée dans `generated/cafezooble/attempts/selection-halo/`. Le nom de ce dossier reflète une première inquiétude sur l’aperçu brut, ensuite corrigée : les couleurs hors silhouette étaient stockées dans des pixels transparents, et les composites ne montraient pas de halo visible. Ce diagnostic corrigé figure dans le reçu de tentative.

La sélection corrigée sert de référence aux dix poses suivantes. Aucun retournement, découpage, recoloriage, redimensionnement ou réencodage n’a été utilisé pour produire les PNG livrables. Les onze archives sont des copies exactes des fichiers natifs ; les diagnostics JPG sont séparés.

## Revue visuelle

| Slot | Lecture de la pose |
| --- | --- |
| selection | Présentation entière et attitude nonchalante |
| stance | Garde ouverte, membres asymétriques lisibles |
| intro | Salut avec la pince grise levée |
| attack | Frappe orientée à droite |
| heavy | Attaque lourde étendue |
| hit | Recul après réception d’un coup |
| walk | Pas ample avec opposition des membres |
| jump | Saut groupé |
| crouch | Garde basse avec tablier replié |
| victory | Mains ouvertes, attitude nonchalante |
| defeat | Défaite au sol, membres identifiables |

Les onze images ont été observées sur fond clair et sombre. Le personnage reste entier, sans lueur visible hors silhouette. Les deux yeux, les antennes, les couleurs des membres et les deux pieds distincts restent reconnaissables. Les limites alpha > 12 sont toutes internes au canevas. Certaines marges sont modestes et nécessitent la revue d’échelle et de placement dans le renderer.

## Portée

Ces dessins adaptent une tenue officielle à des poses originales du fan-game. Ils ne certifient ni une apparition en épisode, ni une reproduction 1:1 de toutes les vues. Onze images statiques par famille ne constituent pas des cycles d’animation complets. Les vérifications d’intégration Canvas, de catalogue, de paquets et de navigateur sont consignées séparément dans le bilan de la vague C.
