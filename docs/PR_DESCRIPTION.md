## Pourquoi

La version 0.5 laissait vingt apparences avec des détails erronés, des fonds attachés ou des extractions imparfaites, trois architectures de décor trop génériques et des introductions/fins d’histoire peu composées. La publication du classeur pouvait aussi mélanger un nouvel Excel et d’anciens JSON si un renommage intermédiaire échouait.

Cette PR livre **Encore 0.6.0** depuis `main` au commit `4a56f6358000cd7ad0838e45f5385ec516432514`, après la fusion de la PR #3. Les modifications sont partagées entre CainOS et le standalone.

## Changements

- **20 costumes / 5 planches RGBA** : six corrections de détails d’après des photos de produits officiels GLITCH ; quatorze réparations techniques. Les corps noirs des sept Shadows restent intacts, la reine est isolée, les fonds et socles attachés sont retirés, Bubble devient réellement translucide. Les PNG historiques et les 179 identités d’archive sont conservés.
- **3 décors reconstruits** : couloir des résidents, comptoir/cuisine Spudsy et cour du palais de sucre. Leurs sols visuels sont recomposés ; la ligne de combat `y=568` et les collisions sont inchangées. Les neuf autres fonds statiques restent identiques à 0.5. Les ambiances préservent les pixels des sols courants.
- **84 tableaux narratifs** : trois panneaux de prologue et trois d’épilogue pour chacune des 14 routes, plus 56 briefings composés avec les décors et portraits existants. Navigation, passage et sortie, mobile, mouvement réduit et relecture des fins gagnées sans double récompense. Les quatre adversaires et checkpoints de chaque route sont conservés.
- **Replays versionnés** : 0.1 à 0.6 acceptés ; les fichiers 0.6 utilisent explicitement les règles 0.5 et conservent leur version exportée. Aucun changement d’équilibrage dans cette livraison.
- **Publication Excel avec restauration** : préparation des trois sorties et sauvegardes avant remplacement ; restauration des octets ou de l’absence antérieure sur erreur interceptée. Sauvegardes, journal et verrou conservés si la restauration échoue. Corrige le point restant de la PR #3 (`PRRT_kwDOTG4CcM6vhSuD`).
- **Suivi mis à jour** : 10 onglets, 9 tableaux, 101 fonctionnalités, 632 tâches de production, 85 scénarios et 452 lignes QA. Notes utilisateur conservées par ID après tri.

## Validation

| Contrôle | Résultat |
| --- | --- |
| `npm run qa` | Audits CainOS, contrats, syntaxe et deux builds réussis |
| Node | **260/260**, 17 suites ; comptes et noms issus des sorties TAP |
| Navigateur | **154/154**, 18 suites ; les 14 suites historiques sont toutes rejouées sur le runtime 0.6 figé |
| Roster complet | **14 vrais duels CPU**, 14 sauvegardes/rechargements exacts ; historique borné à 12 ; dernier replay exporté/importé et état terminal exact |
| Costumes révisés | **20 garde-robes → entraînements → attaques clavier** ; marges, noir préservé, composantes et alpha partiel contrôlés |
| Narration dédiée | **84 tableaux affichés/capturés**, 4 victoires réelles de Jax ; reprise, fin et relecture sans récompense doublée |
| Régression programmes | 21 résultats de progression (local + Arcade 6 + Boss 4 + Survie 10) ; 9 duels histoire/tournoi supplémentaires, dont deux défaites/reprises |
| Publication Excel | **11 tests filesystem** : huit combinaisons de présence, 24 pannes de renommage et échecs de copie/sauvegarde/rollback |
| Notes Excel | **10 notes / 8 feuilles**, formules R1C1 et valeurs `=`, `0`, `false` ; **9 rejets** avant écrasement et **3 contrôles de nettoyage** |
| Classeur final | **37 formules**, aucune erreur ; 92 empreintes concordantes ; onglets inspectés |
| Hors ligne | **45 images / 54 085 802 octets**, manifeste `0.6.0-8745f15f4c42` ; installation, reprise et recharge sans réseau |

Les 452 lignes du classeur comprennent 260 cas Node, 154 contrôles navigateur et 38 objectifs de revue : **447 réussies, 1 à vérifier, 4 non exécutées**. Ces objectifs peuvent recouper les cas automatisés ; ce total n’est pas un nombre de tests indépendants.

Les tests de cache historique ont été adaptés à leurs fixtures d’origine : la nouvelle Gangle possède déjà son alpha et ses rubans rouges. Les assertions de différence des pixels et de séparation du cache sont conservées. Les premières tentatives échouées des collecteurs restent archivées ; les rapports finaux sont tous réussis.

## Documents et captures

Le guide, le classeur et les preuves sont dans `docs/` : `DIGITAL_CIRCUS_ENCORE.md`, `DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx`, `combat-qa-evidence.json`, `combat-tracker-data.json`, `combat-workbook-verification.json`, les trois revues visuelles 0.6 et `COMBAT_WORKBOOK_PUBLICATION.md`.

Les captures de `docs/images/` comprennent les vingt costumes, l’avant/après des trois décors, les douze arènes, le couloir et la narration sur bureau/mobile. Les rapports conservent les sources, leurs empreintes et la portée des observations.

## Limites

La comparaison canonique générale **1:1 reste ouverte**. Les six corrections de détails de costumes s’appuient sur des produits officiels, sans certifier toutes les proportions ou scènes. Les quatorze autres réparations n’ajoutent pas de source canonique aux variantes d’archive. Le couloir utilise deux copies attribuées au pilote sur des sites tiers et attend une confirmation primaire. Spudsy repose sur une miniature officielle de résolution limitée. Le lac manque encore de référence primaire et la calibration est une création du jeu.

Les 84 tableaux sont des compositions de dessins existants, sans 84 nouvelles illustrations ni doublage. Jax est la route narrative entièrement jouée ; les treize autres routes sont couvertes par contrats et inspection des tableaux. Les dessins de combat dédiés, voix/mixage final, équilibrage compétitif, 114 archives sans kit, réseau/rollback, tag/assists, coopération, campagnes par épisode, finishers, cloud et paquets natifs restent suivis.

Les quatre essais non exécutés concernent téléphone physique, deux manettes physiques, parcours clavier exhaustif et matériel modeste. Les tests Chromium ne les remplacent pas. La publication du classeur n’est pas une lecture atomique simultanée de trois fichiers ni une garantie de récupération après arrêt brutal ; ses limites et la récupération sont documentées.
