# Revue indépendante : sélection et décors

Revue effectuée le 27 novembre 2026 depuis le lot Kaufmo, en lecture du code
de sélection et des tests de décors. Les empreintes de chaque fichier relu et
le périmètre exact sont enregistrés dans
[independent-code-review.json](independent-code-review.json).

## Résultat

Aucun défaut bloquant supplémentaire n’a été trouvé dans la logique de choix,
le retour indépendant de chaque côté, les jetons de portrait ou les changements
de contexte. Trois défauts de couverture ou de préparation des tests, puis un
décalage entre le portrait Max du codex et sa nouvelle fiche de provenance, ont
été signalés et corrigés avant la prochaine campagne CI.

| Défaut constaté | Conséquence | Correction observée |
| --- | --- | --- |
| `grounds` servait d’étape intermédiaire dans les tests de cache alors qu’il fait désormais partie des treize scènes reconstruites. | Sa peinture complète restait en cache ; son scénario d’échec ne pouvait plus observer la requête réseau attendue. | Les deux boucles utilisent `visitTraining()`, hors de la liste des scènes reconstruites. |
| Les deux scénarios qui retardent un portrait n’excluaient pas le service worker. | Le worker intercepte les images du manifeste avant `page.route`, empêchant le test d’attendre la réponse voulue. | Les contextes desktop concernés déclarent `serviceWorkers: 'block'`. La suite hors ligne demeure enregistrée séparément. |
| La nouvelle suite ciblée de sélection n’était pas dans la liste partagée de CI. | Son existence seule n’en imposait pas l’exécution ni la présence dans le classeur de preuves. | Ajout à `scripts/combat-ci-suites.mjs`, consommé par l’orchestrateur et le classeur. |
| La nouvelle fiche illustrée de Max accompagnait encore son portrait issu de l’atlas dans le codex. | Le texte décrivant la silhouette violette et les PNG illustrés était associé au sprite vert historique. | `paintPortrait` demande aussi le PNG de sélection pour Max dans le codex ; les autres fiches gardent leur comportement existant. |

Le comportement de routage est documenté par la source primaire
[Playwright — page.route](https://playwright.dev/docs/api/class-page#page-route).
Le worker local appelle `clients.claim()` et répond aux chemins `ART_FILES` ;
ce contrôle est donc nécessaire pour le scénario de réponse retardée.

## Points relus

Les choix logiques sont immédiats. Chaque emplacement conserve uniquement son
choix précédent, y compris l’identifiant exact du costume. L’autre emplacement
et le décor restent indépendants. Réactiver un choix identique ne remplace pas
l’historique et ne répète pas l’annonce accessible.

Les fins de chargement utilisent un jeton monotone propre à l’emplacement. Le
code exige aussi que le Canvas soit encore connecté et que le menu de sélection
soit actif. Une réponse ancienne dessine dans son ancien Canvas détaché et ne
peut modifier l’état de la carte actuellement affichée.

La navigation, le changement de mode et le départ en combat effacent cet état
temporaire. La lecture d’un replay passe par la même entrée de combat ;
l’importation du profil revient aux réglages. Aucun historique de sélection
n’entre dans les profils ou replays. Les deux badges restent présents dans un
miroir, et l’annulation rend le focus à la carte de l’artiste rétabli.

Les tests de décor conservent les contrôles de perte de fichier, de reprise, de
cache, de composition sans anciennes couches et de caméra à mouvement réduit
pour les treize peintures et les quatorze scènes en trois plans.

La nouvelle provenance illustrée de Max est isolée de son registre d’atlas et
décrit les limites des anciens PNG. Le complément de documentation
`staticSelectionContinuation` distingue le sous-ensemble de menu réalisé des
128 briefs de gestes d’entrée et de sortie, qui ne sont pas déclarés produits.

## Vérification réellement exécutée

Un contrôle Node du catalogue CI a réussi : **22 configurations**, les **21
configurations antérieures conservées exactement**, des libellés uniques et
des fichiers présents pour chaque configuration. `run-combat-ci.mjs` et le
générateur du classeur importent la même liste ; aucune liste parallèle n’a été
ajoutée et aucun contrôle d’accessibilité des 64 artistes n’a été retiré.

Les onze tests unitaires de sélection réussis sont consignés par l’agent
propriétaire dans le dossier `selection/`. Ils n’ont pas été rejoués au titre de
cette revue. Les tentatives locales de navigateur déjà interrompues par SIGKILL
restent des tentatives incomplètes. Aucun Chromium n’a été relancé ici. Les
corrections de tests et l’enregistrement en CI ne prouvent pas leur exécution
réussie : cette preuve doit venir de la campagne portant sur le commit publié
correspondant.
