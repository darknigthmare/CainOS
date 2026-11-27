# Accès, verrous et sauvegarde

**Spécification du 2026-11-27 — aucun compte Patreon, offre payante ou registre serveur raccordé.** Les [données complètes](extensions-access.json) comprennent le catalogue actuel, les récompenses proposées, les règles et les scénarios.

## Quatre axes indépendants

| Axe | États |
| --- | --- |
| discovery | secret · hint · identified |
| entitlement | none · claimable · permanent · temporary-active · pending-verification · expired · revoked |
| availability | installed-compatible · installation-required · update-required · production-incomplete · service-unavailable |
| context | allowed · mode-restricted · composition-conflict · dependency-missing |

La sélection est autorisée si au moins une source permanente non révoquée OU une source temporaire admissible est valide, puis si les dépendances, assets et règles de partie le permettent. Les 64 artistes, les tenues, stages, arrangements et neuf modes déjà accessibles restent libres. Un futur mode Collection facultatif peut suivre sa propre découverte sans retirer ces accès au mode libre.

## Charte originale Encore

Fiche de distribution C&A avec billet perforé et volet de rideau, métaphore d’interface originale.

| Élément | Traitement |
| --- | --- |
| fighter | Silhouette noire sur fond clair délimité, billet scellé et condition courte ; emblème neutre si secret. |
| costume | Miniature masquée selon politique de découverte, parent indiqué seulement s’il est découvert. |
| stage | Vignette obscurcie ou cadre neutre, volet de rideau ; une porte n’est dessinée que sur un seuil cohérent du hub. |
| mode | Affiche de programme fermée, résumé et chemin vers l’épreuve préalable. |
| accessible | Contour de focus, icône + texte, condition courte et panneau détaillé ; nom générique et aucun aria-label révélateur pour secret. |

| État de présentation | Traitement |
| --- | --- |
| focus | Cadre accentué |
| refusal | Billet qui résiste légèrement puis reste lisible |
| claimable | Marque stable, sans clignotement |
| unlock | Volet qui s’ouvre après sauvegarde confirmée |
| reducedMotion | Changement de cadre et apparition immédiate du portrait autorisé |

Les icônes de verrou, de droits, d’installation et de vérification sont des besoins de production. Un contenu non produit n’est pas déguisé en récompense verrouillée. La scène ou le personnage secret utilise un emblème neutre si sa silhouette révélerait son identité.

## Priorité et transactions

1. resolve-all-grant-sources
2. resolve-dependencies
3. resolve-installation-and-version
4. resolve-mode-and-composition
5. apply-discovery-policy-to-text-and-images

Dédupliquer par sourceEventId et contentId. Une révocation touche son grantId uniquement ; jamais toutes les sources du contenu.

1. valider condition et dépendances de réclamation
2. préparer ID stable de transaction
3. écrire coût et grants dans un seul enregistrement cohérent
4. confirmer l’écriture
5. jouer la révélation ou sa version réduite

**Échec d’écriture :** Aucun coût définitivement débité, aucune récompense annoncée comme sauvegardée ; reprise par la même transaction.

**Champs d’une source :** grantId, contentId, sourceKind, sourceEventId, sourceVersion, permanence, validFrom, validUntil, verifiedAt, verificationState, revocationReason.

## Migration du profil existant

| Responsabilité | Contrat |
| --- | --- |
| from | circus-encore-profile version 1 |
| target | future-encore-collection version 1 alongside validated profile |
| preserve | settings, stats, stories, challenges, medals, program, history, replays |
| initialGrant | Grant permanent legacy-access pour les contenus de la distribution historique ; ne dépend ni de l’abonnement ni de la visite du hub. |
| oldSaveBehavior | Ancien profil valide chargé normalement ; extension absente initialise les seuls droits de base. Version d’extension future inconnue conservée sans application destructive. |
| backup | Écrire un enregistrement validé séparé, garder la dernière copie valide, n’annoncer le succès qu’après écriture ; ne pas écraser le profil original durant la conversion. |

Les faits `stories`, `challenges` et `medals` sont connus du profil actuel. Un score de bonus jamais enregistré, une transaction de soutien ou une découverte du futur hub ne sont pas inventés à la migration. La suppression volontaire d’un profil ne doit pas restaurer silencieusement une ancienne sauvegarde.

## Incidents, modes et droits des participants

| Contexte | Règle |
| --- | --- |
| offline | Les grants permanents restent utilisables. Les accès temporaires exigent un justificatif validé avec échéance connue ; une tolérance future est une durée explicite de politique, jamais calculée depuis une simple erreur réseau. |
| matchSnapshot | Geler artistes, tenues, scènes, versions et droits de participation au lancement ; appliquer changements confirmés avant le match suivant. |
| fallback | Garder la préférence du joueur ; proposer l’apparence de base ou le stage training disponible et annoncer ce remplacement avant départ. |
| guest | Invité local participe aux contenus chargés du profil hôte sans recevoir un grant ; en ligne futur, la possession n’est pas copiée entre comptes. |
| replay | Afficher les contenus connus avec leurs anciennes références ou un remplacement annoncé ; la lecture n’accorde ni grant, ni bonus, ni médaille. |
| training | Le futur entraînement doit permettre l’apprentissage des règles admises dans la compétition ; l’équipement cosmétique garde son droit de collection distinct. |
| antiSpoiler | En secret complet, utiliser un ID technique opaque côté journal, un symbole neutre et un nom générique côté UI. Aucun alt, tooltip, texte de condition ou nom de costume ne doit révéler le propriétaire. |
| stageParticipation | L’hôte peut sélectionner une ambiance autorisée ; l’autre joueur participe si les assets sont présents, sans acquérir le droit de sélection. Transitions et versions confort incluses dans le paquet du match. |

## Trois modèles de soutien, désactivés

### EN-SUPPORT-PERMANENT-ARCHIVE — Lot d’archive permanent — proposition

Modèle : **permanent-grant** ; actif : **non** ; fournisseur, campagne, niveaux, prix et dates : **non configurés**.

**Attribution :** Admissibilité confirmée par le futur serveur ; un événement unique accorde le contenu durablement.

**Fin :** La fin normale de l’abonnement ne retire pas ce grant permanent.

**Remboursement :** Révocation éventuelle de cette source selon politique réelle documentée ; autre source gratuite conservée.

**Hors ligne :** Une acquisition permanente déjà validée reste accessible hors ligne.

### EN-SUPPORT-TEMPORARY-AMBIENCE — Catalogue d’ambiances temporaire — proposition

Modèle : **temporary-catalogue** ; actif : **non** ; fournisseur, campagne, niveaux, prix et dates : **non configurés**.

**Attribution :** Admissibilité et échéance validées par le futur serveur ; aucune date déduite de la seule annulation.

**Fin :** Retrait de la seule source temporaire à échéance confirmée, avant la partie suivante.

**Remboursement :** Réexaminer cette source uniquement ; préférences et accès permanent gagné ailleurs sont conservés.

**Hors ligne :** Justificatif daté et politique de tolérance explicite requises ; valeur non choisie avant service réel.

### EN-SUPPORT-PERIODIC — Lot périodique — modèle de réserve

Modèle : **periodic-delivery** ; actif : **non** ; fournisseur, campagne, niveaux, prix et dates : **non configurés**.

**Attribution :** Une livraison identifiée par période et compte, idempotente ; catalogue et permanence de chaque lot à fixer avant activation.

**Fin :** La fin d’admissibilité arrête les futurs lots ; elle ne redéfinit pas la permanence des lots déjà accordés.

**Remboursement :** Politique par lot à définir, sans retrait global implicite.

**Hors ligne :** Aucune nouvelle livraison non vérifiée hors ligne.

Les références D01–D04 sont conservées dans l’original de l’Extension 02 ; elles devront être revérifiées au moment d’un raccord réel au fournisseur. Aucun secret d’API, token ou admissibilité commerciale n’est confié à une sauvegarde locale.

## Textes et action utile

| Texte | Condition d’emploi | Action |
| --- | --- | --- |
| Artiste non révélé | Découverte secret | Consulter un indice générique |
| À débloquer | Aucune source valide et condition connue | Voir les voies d’obtention |
| Récompense disponible | Condition satisfaite et récupération requise | Réclamer une fois |
| Acquis | Au moins une source permanente valide | Sélectionner si disponible |
| Accès temporaire actif | Source temporaire valide seulement | Voir la validité réelle |
| Installation nécessaire | Droit valide, assets absents | Installer ou choisir un contenu présent |
| Vérification en cours | Statut externe non confirmé | Réessayer ou jouer les contenus permanents |
| Accès terminé | Fin confirmée de toutes les sources temporaires et aucune source permanente | Voir les voies disponibles |
| Indisponible dans ce mode | Droit valide, règle de mode ou composition incompatible | Afficher le motif et une alternative |
| Contenu en préparation | Asset ou système non produit | Consulter la fiche ; aucune fausse condition de déblocage |

## 22 scénarios à exécuter

| ID | Situation | Précondition | Action | Attendu |
| --- | --- | --- | --- | --- |
| EN-E2-QA-01 | Secret complet | Contenu non découvert, aucun grant. | Focaliser puis confirmer le slot. | Nom et silhouette neutres, fiche générique ; aucune sélection ni fuite par alt ou voix. |
| EN-E2-QA-02 | Slot verrouillé | Identité révélable, condition incomplète. | Naviguer clavier/manette et confirmer. | Focus conservé, condition courte puis détail ; pas de blocage de navigation. |
| EN-E2-QA-03 | Réclamation | Conditions remplies, attribution manuelle. | Réclamer puis recharger. | Une acquisition persistante ; révélation une fois, choix possible si dépendances prêtes. |
| EN-E2-QA-04 | Conditions ET/OU | Route Ragatha acquise, bonus camion absent, aucun soutien. | Évaluer puis ajouter bonus ; réévaluer avec seulement soutien vérifié. | Première situation verrouillée ; les deux autres autorisées par leur source propre. |
| EN-E2-QA-05 | Transaction répétée | Même événement de bonus ou même clic reçu deux fois. | Attribuer, interrompre l’écriture simulée, reprendre. | Une transaction confirmée, aucun double débit ni double lot. |
| EN-E2-QA-06 | Tenue avant personnage | Tenue permanente acquise, propriétaire indisponible dans un futur mode Collection. | Sauvegarder puis ouvrir le dressing. | Tenue conservée, dépendance expliquée ; pas de faux verrou de paiement. |
| EN-E2-QA-07 | Permanent et temporaire | Grant gratuit permanent + accès temporaire expiré. | Résoudre les sources. | Contenu encore acquis et sélectionnable si installé ; seule la source temporaire est expirée. |
| EN-E2-QA-08 | Catalogue expiré | Seul grant temporaire avec échéance confirmée passée. | Revenir au menu après résultat. | Accès terminé, préférence conservée, alternative disponible proposée avant prochaine partie. |
| EN-E2-QA-09 | Annulation anticipée | Annulation connue mais justificatif encore valable. | Resynchroniser le compte. | Accès conservé jusqu’à échéance validée ; aucune révocation avant cette date. |
| EN-E2-QA-10 | Service indisponible | Dernier justificatif connu, requête en erreur. | Ouvrir le menu hors ligne. | Vérification indisponible ; application de politique connue, jamais affirmation d’expiration sans preuve. |
| EN-E2-QA-11 | Assets absents | Grant permanent valide, fichiers non installés. | Confirmer le contenu. | Installation nécessaire ; pas de demande d’achat ou de victoire. |
| EN-E2-QA-12 | Remboursement isolé | Grant soutien retiré, grant défi permanent valide. | Révoquer le seul grant de soutien. | Accès conservé par la source défi ; ledger garde les deux provenances. |
| EN-E2-QA-13 | Stage et invité | Hôte autorisé, invité sans grant, assets compatibles. | Lancer l’ambiance spéciale en local. | Participation de l’invité autorisée sans acquisition de son droit de sélection. |
| EN-E2-QA-14 | Destination reliée | Arène autorisée mais destination non installée. | Préparer le match avec transition. | Préchargement requis ou remplacement annoncé avant match ; aucun blocage à la transition. |
| EN-E2-QA-15 | Expiration pendant duel | Snapshot autorisé, expiration arrive à mi-match. | Résoudre résultat puis retourner au menu. | Aucune mutation de tenue/stage/équipe pendant duel ; droits actualisés avant match suivant. |
| EN-E2-QA-16 | Équipement devenu inaccessible | Préférence pour tenue ou réserve désormais invalide. | Charger composition enregistrée. | Préférence conservée ; remplacement demandé pour l’élément concerné seulement. |
| EN-E2-QA-17 | Confort du décor | Stage acquis, joueur demande version statique. | Activer réduction des mouvements. | Présentation statique accessible, même géométrie et mêmes règles ; aucun abonnement supplémentaire. |
| EN-E2-QA-18 | Mode et prérequis | Défi avancé requiert tutoriel gratuit. | Parcourir le graphe puis reprendre après interruption. | Aucune boucle ; entraînement toujours accessible ; étapes conservées. |
| EN-E2-QA-19 | Profil et invité | Deux profils ou double liaison reçus. | Attribuer un événement au compte vérifié. | Grant au bon profil une seule fois ; aucun transfert implicite à l’invité. |
| EN-E2-QA-20 | Événements désordonnés | Webhook récent valide puis ancien événement de baisse de niveau. | Appliquer selon version/source. | Ancien état n’écrase pas le nouveau ; événement dupliqué sans nouvelle livraison. |
| EN-E2-QA-21 | Accessibilité | Secret, acquis, attente et verrou dans la même grille. | Naviguer clavier/manette/lecteur d’écran avec mouvement réduit. | Chaque état compris sans couleur ni son seul, focus stable, aucune identité secrète révélée. |
| EN-E2-QA-22 | Migration et restauration | Profil v1 avec histoires, réglages, programme et ancien replay. | Initialiser extension, corrompre sa copie principale puis restaurer. | Profil historique intact, acquisitions issues des faits connus, copie valide récupérable, replay inchangé. |

Le statut de ces scénarios est **à exécuter**. Les contrôles du générateur portent sur la documentation, les IDs, les dépendances et les empreintes ; ils ne remplacent ni un test de fournisseur réel, ni un parcours UI, ni un test de sauvegarde du futur système.
