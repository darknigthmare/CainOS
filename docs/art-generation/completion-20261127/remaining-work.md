# Travaux ouverts après contrôle du complément du 27 novembre

## Corrections vérifiées de ce lot précis

Les six familles Kaufmo × Lackadaisy / SMG4 sont agrégées, le manifeste hors
ligne est régénéré et les 27 nouvelles familles sont exposées. Le recontrôle
figé constate 573 costumes et 6 281 images. Les 29 tests Node ciblés réussissent
sans changement de sources pendant l'exécution. La conservation vérifie les
546 costumes et 6 218 images historiques, avec deux corrections d'alias
documentaires déclarées précisément dans le rapport.

L'[essai initial](qa/preservation-before-integration.log) reste conservé, ainsi
que le [recontrôle réussi](qa/catalog-preservation.json). La preuve distingue
91 définitions déclarées de 89 familles réellement actives : les deux nouvelles
définitions du focus suivant ont leurs revues vides.

## Terminer la validation et la publication

1. Relier les captures Canvas et les parcours navigateur réellement accomplis
   au même état des sources. Ne pas transférer les résultats du commit
   `cc972c8` au nouveau lot.
2. Vérifier les deux distributions avant de publier la version finalisée dans
   la PR. Le classeur est synchronisé au jalon 573 costumes / 6 281 images,
   avec conservation des 14 feuilles et des 42 formules, contrôle de 96 713
   cellules historiques et revue visuelle de 19 plages. Sa
   [preuve propre](../../combat-completion-workbook-verification.json) ne vaut
   pas validation des distributions du jeu.

Les étapes restantes doivent être attestées dans leurs preuves propres, sans
réécrire les journaux historiques.

## Contenu à poursuivre séparément

- Le focus suivant demandé par l'utilisateur concerne **Pomni, Caine et les
  abstractions** : il doit partir des variantes déjà présentes et des références
  attribuées, afin d'éviter de recréer une famille déjà livrée.
- Les autres collections de Max et les garde-robes des PNJ non couverts restent
  des possibilités de crossover original. Ce ne sont pas des apparences
  officielles manquantes à inventer.
- Les quatorze arènes qui conservent les compositions historiques en trois
  plans peuvent nécessiter une comparaison aux lieux de la série. Leur nombre
  ne prouve pas que quatorze nouvelles peintures soient requises.
- Les gestes de sélection/désélection, les animations complètes, les mécaniques
  de tag, les supers d'équipe, les épreuves bonus et les contrats de déblocage
  gardent leur propre état de production. La présente tranche fournit des
  bases statiques et ne les déclare pas achevés.
- Les tests sur appareils physiques et la comparaison canonique de chaque
  asset restent distincts de l'intégrité des PNG et des tests automatisés.

Les références officielles, produits dérivés officiels et adaptations
originales doivent rester identifiés séparément dans le suivi et dans le jeu.
