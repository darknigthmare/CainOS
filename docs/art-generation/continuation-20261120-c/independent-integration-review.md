# Revue ciblée indépendante — intégration Café C

**Résultat : aucun défaut bloquant identifié dans le périmètre examiné.** Cette revue de code, de schémas et de provenance a lu le runtime intégré, les scripts, les modifications de tests et les 33 reçus. Elle a seulement écrit ce document et son équivalent JSON. Aucune QA, intégration, reconstruction ou tentative navigateur n’a été relancée.

## Constats vérifiés directement

| Contrôle | Résultat |
|---|---|
| Préfixe historique | Les **477 objets costume**, leur ordre, les 42 apparences Circus et les 48 identifiants d’extension historiques sont conservés. Le SHA-256 des 477 objets reste `fe0cc2b77e851e5a2df45c6682c180148fd60a13d40488b12ad2e292e084419d`. |
| Activation | **480 identifiants uniques**, avec uniquement `caferagatha`, `cafegangle`, `cafezooble` ajoutés, dans cet ordre, aux bons propriétaires. Les trois définitions actives correspondent exactement aux JSON gelés. |
| Copies natives | **33 PNG / 42 202 157 octets** : égalité binaire de chaque sortie originale imagegen, archive et fichier runtime. 33 empreintes et 33 identifiants de génération distincts. |
| Reçus et jobs | 33 reçus acceptés et activés ; prompts, identités, orientation, définitions, chemins et empreintes de référence concordants avec les 33 jobs. **66 occurrences de références** vérifiées contre les fichiers présents. |
| Format d’image | 33 fichiers RGBA ; dimensions, extrema alpha et bornes `alpha > 12` concordants. Transparence présente et silhouettes internes aux cadres. |
| Manifeste offline | **5907 images** : ajout exact des 33 PNG, aucun retrait, ordre historique préservé et aucune image en double. Ajout du seul module `costume-continuation-20261120-c.mjs` ; augmentation des octets égale à la somme des nouveaux PNG. |
| Portée moteur | `data.mjs`, `engine.mjs`, `session.mjs`, `stories.mjs`, `stage-parallax.mjs`, `crossovers.mjs` et `crossover-npc-additions.mjs` identiques au commit de base. Empreintes des combattants et stages inchangées. |

## Revue du code et des tests

`cafe/integrate-native.py` exige les trois familles complètes, verrouille le manifeste de référence et les définitions, contrôle les reçus, les jobs, les références et les originaux. Il revérifie les entrées avant la copie, conserve les octets natifs et vérifie le catalogue actif après l’ajout. Les modifications de l’agrégateur et de l’ordre se limitent à l’import, à l’extension et aux trois identifiants prévus.

`scripts/verify-combat-continuation-20261120-c.py` sépare les comptes, les copies natives et de build, la préservation historique, les résultats QA, les rendus Canvas et le statut navigateur. Les différents statuts observés sont compatibles ; la preuve d’installation garde explicitement son périmètre antérieur à la QA et aux builds. Aucun défaut de schéma ou de portée bloquant n’a été trouvé pour cette exécution datée.

Les tests de costumes gardent leurs contrôles antérieurs, ajoutent les trois apparences aux parcours replay/campagne existants et figent le préfixe historique de 477 objets. La correction de `combat-fidelity.test.mjs` ajoute seulement les trois identifiants de source Animate Café et les expressions de portée spécifiques à chaque costume. Elle ne généralise pas l’acceptation des domaines ou des sources. Le changement du script de revue Canvas ajoute uniquement le nouveau module à son inventaire d’empreintes.

Le journal QA final a été **consulté, sans relance** : **432 tests réussis sur 432, 0 échec, 0 ignoré, code de sortie 0**. Les empreintes de ce journal, des fichiers examinés et des 33 reçus/jobs sont consignées dans `independent-integration-review.json`.

## Limites de cette revue

Cette passe ne refait pas la revue visuelle des 33 dessins : elle vérifie la cohérence des reçus et des observations existantes. Son auteur a auparavant produit la famille Gangle ; l’indépendance porte ici sur les vérifications de l’intégration et la lecture du code du parent, pas sur une seconde approbation artistique indépendante de Gangle.

L’égalité binaire atteste la préservation des sorties natives. Elle ne certifie ni une fidélité canonique 1:1, ni les parties cachées des costumes, ni des cycles d’animation complets. Le contrôle mécanique des bornes alpha ne remplace pas une appréciation visuelle.

Le navigateur reste **`not_executed`**, avec **0 contrôle réussi**, après l’échec de Chromium avant navigation. Aucune validation de garde-robe ou de combat dans un navigateur n’est déduite des contrôles statiques ou Canvas. Les 5830 anciens assets et les deux builds sont couverts par le rapport d’intégrité séparé du parent ; cette revue ciblée a directement comparé le préfixe de 477 objets, les sept modules cités et les 33 nouvelles copies natives.
