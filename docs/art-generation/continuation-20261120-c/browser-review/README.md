# Revue navigateur ciblée — Café Ragatha, Gangle et Zooble

## Périmètre

Le script `run-cafe-wardrobe.mjs` utilise Playwright avec un véritable Chromium, un contexte isolé et un serveur statique appartenant au processus. Il doit parcourir l’interface : choix du personnage et du costume, ouverture de la garde-robe, aperçu chargé, bouton « Essayer en entraînement », entrée en combat et attaque au clavier. Il n’écrit aucun fichier applicatif et ne modifie pas l’état de simulation par une API de test.

Les captures et résultats ne sont créés qu’après l’exécution correspondante. Une instrumentation de `drawImage` observe le chemin réellement dessiné dans le canevas de combat ; elle ne remplace pas le renderer. Les empreintes des modules et des 33 images relient le résultat au runtime inspecté.

## Commande préparée

Depuis la racine du dépôt :

```bash
node docs/art-generation/continuation-20261120-c/browser-review/run-cafe-wardrobe.mjs
```

## Précontrôle

Le précontrôle du lancement seul est enregistré dans `launch-preflight.json`. Il a échoué avant création de page : Chromium s’arrête sur `process_singleton_posix.cc:297`, `socket() failed: Operation not permitted (1)`, puis SIGABRT. Aucune navigation n’a été effectuée et aucun contrôle applicatif n’a réussi lors de ce précontrôle.

La tentative finale a été exécutée après intégration des trois familles et des 33 PNG. Chromium a reproduit la même erreur de socket avant création de page. Le bilan `browser-review.json` indique `attempted: true`, `status: not_executed`, zéro contrôle réussi et aucune capture. `report.json` contient l’erreur complète et les empreintes des 42 fichiers applicatifs et images inspectés ; ces empreintes sont restées identiques après la tentative. Le commit cité est la base locale, les empreintes identifient le runtime intégré non encore commité.

Aucune modification de sandbox ni escalade de permissions n’a été tentée. Les rendus Canvas restent des preuves séparées et ne constituent pas un parcours navigateur.
