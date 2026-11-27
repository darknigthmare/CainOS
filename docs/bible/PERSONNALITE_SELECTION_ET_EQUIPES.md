# Personnalité, sélection et équipes

**Conception Encore du 2026-11-27 — animations et règles nouvelles non produites ou non intégrées.** Les données complètes sont dans [extensions-characters.json](extensions-characters.json) et [extensions-teams-bonus.json](extensions-teams-bonus.json).

## Un taunt distinct de la récupération

Les 64 artistes reçoivent un geste original de présentation, sans bonus de ressource. Les actions `utility` conservent leurs effets actuels. Les noms de gestes ci-dessous sont créés pour Encore ; aucune réplique officielle n’est copiée. Les abstractions restent non verbales.

| Contrat | Règle |
| --- | --- |
| action | taunt |
| type | presentation-no-resource-bonus |
| entry | Au sol et neutre uniquement ; refus en stun, garde, projection, assistance, relais, super ou phase de résultat. |
| vulnerability | Hurtbox actuelle conservée ; aucune armure, invulnérabilité, esquive gratuite ni suppression de ciblage. |
| interruption | Un impact applique immédiatement la réaction normale. Annulation volontaire vers garde/déplacement à partir de la sortie ; la sortie ne gomme pas les ticks d’exposition. |
| recovery | Retour à la stance propre au costume ; pas de recharge de stabilité ni de jauge par le geste. |
| existingUtility | Les actions utility actuelles de récupération/buff restent distinctes et conservent coût, effet, cooldown et encodage de replay. |
| abstraction | Réactions non verbales de posture et de regards ; jamais de guérison, de pensée révélée ni de voix humaine. |

Durées proposées : entrée 12, tenue 24, sortie 18 ticks. Ces valeurs ne sont pas des timings du moteur livré et demandent équilibrage.

## Huit états de sélection

| État | Comportement | Suite | Annulation |
| --- | --- | --- | --- |
| focus | Consulter le slot sans modifier le choix confirmé. | preview | back |
| preview | Afficher identité et costume autorisés, avec une pose fixe actuelle. | confirm | deselect |
| confirm | Enregistrer immédiatement le choix valide ; lancer la réaction après. | confirmed-idle | deselect |
| confirmed-idle | Tenir une pose lisible en attendant le second choix. | team-ready | deselect |
| costume-change | Charger le nouveau visuel puis remplacer atomiquement l’aperçu. | preview | deselect |
| deselect | Libérer le choix, nettoyer ses éléments, jouer une sortie courte. | focus | focus |
| team-ready | Afficher actif/réserve et compatibilités, sans promettre une scène non débloquée. | depart | deselect |
| depart | Valider droits, assets et règles avant le versus. | match-intro | team-ready |

Les deux joueurs possèdent leur curseur et leur jeton d’aperçu. Les réponses asynchrones n’écrasent pas un jeton plus récent. Nouvelle sélection ou retour : invalider l’ancien jeton, arrêter voix/particules/compagnon/ombre puis afficher le nouvel aperçu. Aucune attente de fin de séquence pour accepter l’entrée. Pose finale fixe pour confirmation ; fondu facultatif très court pour sortie. Même contenu, mêmes droits et mêmes commandes.

## 64 fiches individuelles

Les portraits et poses de combat déjà inscrits au catalogue sont des références de continuité visuelle. Ils ne comptent pas comme une production des séquences proposées. Chaque fiche comporte des IDs de besoins d’assets sans chemin fictif de fichier livré.

### Pomni — pomni

**Taunt EN-E1-TAUNT-pomni · Vous avez vérifié la sortie ?**

Entrée : Les mains remontent près du col, puis un regard glisse hors du cadre. Pose : Un index hésitant désigne la direction déjà indiquée dans le décor ; sourire tendu. Sortie : L’index se replie, les deux mains retrouvent la garde.

**Sélection EN-E1-SELECT-pomni :** Un demi-pas prudent entre dans le cadre, regard vers le joueur puis vers la piste.

**Désélection EN-E1-DESELECT-pomni :** Un dernier regard vers la piste, recul latéral et mains ramenées contre le corps.

**Contrainte de fidélité :** Ne pas ouvrir un portail, téléporter Pomni ou promettre une sortie réelle.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Reprendre son souffle ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Jax — jax

**Taunt EN-E1-TAUNT-jax · Après vous, vraiment**

Entrée : Le menton s’incline et une main s’ouvre vers l’adversaire. Pose : Salut exagérément courtois, sourire de défi ; oreilles et gants restent ceux de la tenue. Sortie : La main revient dans une poche ou près du torse selon la tenue compatible.

**Sélection EN-E1-SELECT-jax :** Entrée désinvolte, léger appui sur une jambe, salut bref sans changer ses proportions.

**Désélection EN-E1-DESELECT-jax :** Le salut se transforme en geste d’au revoir, pivot puis départ à pas lents.

**Contrainte de fidélité :** La moquerie est une écriture Encore ; aucune clef magique ou nouveau pouvoir n’est ajouté.

**Lien au jeu :** rival de route Zooble (relation de fan-game), utility existante « Air innocent ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Ragatha — ragatha

**Taunt EN-E1-TAUNT-ragatha · On peut faire une pause**

Entrée : Les paumes se lèvent lentement à hauteur de poitrine. Pose : Sourire rassurant mais un peu crispé, épaules tournées vers son partenaire. Sortie : Les mains se referment doucement puis reprennent la garde.

**Sélection EN-E1-SELECT-ragatha :** Salut chaleureux, vérification du nœud et déplacement mesuré jusqu’à la marque.

**Désélection EN-E1-DESELECT-ragatha :** Le salut baisse, elle accompagne du regard le nouveau choix puis sort sur le côté.

**Contrainte de fidélité :** Conserver œil bouton, cheveux, couture et proportions ; ne pas convertir ce geste en soin.

**Lien au jeu :** rival de route Pomni (relation de fan-game), utility existante « Petite réparation ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Gangle — gangle

**Taunt EN-E1-TAUNT-gangle · Le masque tient encore**

Entrée : Un ruban vient soutenir le bas du masque sans le changer. Pose : Petite révérence ; la forme et l’expression du masque suivent le costume équipé. Sortie : Le ruban relâche le masque et reprend sa longueur de repos.

**Sélection EN-E1-SELECT-gangle :** Le corps de rubans se rassemble, le masque se redresse et les mains saluent brièvement.

**Désélection EN-E1-DESELECT-gangle :** Révérence de clôture puis retrait des rubans derrière le même bord de cadre.

**Contrainte de fidélité :** Ne pas remplacer automatiquement tragédie par comédie ni annoncer une émotion guérie.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Ajuster le masque ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Zooble — zooble

**Taunt EN-E1-TAUNT-zooble · C’est bon, on a compris**

Entrée : La tête tourne vers le duel avant un soupir visuel. Pose : Un bras marque une impatience courte ; les pièces restent dans la configuration choisie. Sortie : Le bras reprend son ancrage sans échange de pièce.

**Sélection EN-E1-SELECT-zooble :** Contrôle visuel de l’assemblage affiché, pose stable et regard direct.

**Désélection EN-E1-DESELECT-zooble :** Haussement d’épaule puis départ, sans démontage imposé du corps.

**Contrainte de fidélité :** Respecter asymétrie et choix de pièces ; aucun corps supposé définitif.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Réassembler ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Kinger — kinger

**Taunt EN-E1-TAUNT-kinger · J’avais une idée…**

Entrée : Les mains se rapprochent comme pour expliquer, puis s’arrêtent. Pose : Le regard se fixe sur un petit détail de la piste ; posture calme, jamais folie forcée. Sortie : Les mains redescendent et le regard retrouve l’adversaire.

**Sélection EN-E1-SELECT-kinger :** La silhouette royale entre prudemment, s’arrête sur la marque et lève une main.

**Désélection EN-E1-DESELECT-kinger :** La main fait un petit signe, la pièce recule sans tourner sa base de manière impossible.

**Contrainte de fidélité :** Pas de souvenir inventé, de révélation ni de guérison ; maintenir forme de pièce d’échecs.

**Lien au jeu :** rival de route Pomni (relation de fan-game), utility existante « Moment de lucidité ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Caine — caine

**Taunt EN-E1-TAUNT-caine · Une petite présentation !**

Entrée : Les bras s’écartent pour annoncer le numéro. Pose : Grand geste de maître de piste, chapeau et mâchoire dans leurs positions de référence. Sortie : Un salut réduit l’amplitude puis ramène les bras au repos.

**Sélection EN-E1-SELECT-caine :** Annonce muette au centre du cadre avec un geste vers la piste, sans modifier le choix du joueur.

**Désélection EN-E1-DESELECT-caine :** Le geste se conclut, le chapeau accompagne un salut et Caine quitte le cadre.

**Contrainte de fidélité :** Ne pas confondre toute-puissance de mise en scène et invincibilité de combat.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Préparer le prochain numéro ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Bubble — bubble

**Taunt EN-E1-TAUNT-bubble · Je regarde aussi**

Entrée : La sphère monte légèrement dans l’espace de présentation autorisé. Pose : Inclinaison du regard et sourire incongru, sans bras ou jambes ajoutés. Sortie : Retour à la hauteur de garde ; diamètre inchangé.

**Sélection EN-E1-SELECT-bubble :** Arrivée en flottement, arrêt net et regard vers le second portrait.

**Désélection EN-E1-DESELECT-bubble :** Départ flotté vers le bord choisi ; aucune explosion obligatoire.

**Contrainte de fidélité :** Conserver la sphère, bouche et dents ; pas de membre humain pour mimer les autres taunts.

**Lien au jeu :** rival de route Zooble (relation de fan-game), utility existante « Se regonfler ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Gummigoo — gummigoo

**Taunt EN-E1-TAUNT-gummigoo · À toi de montrer**

Entrée : Un bras ouvre une invitation brève tandis que le corps reste de trois quarts. Pose : Sourire réservé et appui de convoyeur, accessoires du costume conservés. Sortie : Le bras retrouve la garde et le centre de gravité reste stable.

**Sélection EN-E1-SELECT-gummigoo :** Entrée décidée, regard vers son compagnon puis salut à la piste.

**Désélection EN-E1-DESELECT-gummigoo :** Signe bref de la tête et retrait vers le convoi suggéré hors champ.

**Contrainte de fidélité :** Présence présentée comme simulation Encore ; ni résurrection ni souvenir nouveau officiel.

**Lien au jeu :** rival de route The Fudge (relation de fan-game), utility existante « Pause du convoyeur ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Loolilalu — loolilalu

**Taunt EN-E1-TAUNT-loolilalu · La cour attend**

Entrée : La posture se redresse et une main invite à avancer. Pose : Petit salut royal, expression ferme et couronne stable. Sortie : La main revient près du corps avant la garde.

**Sélection EN-E1-SELECT-loolilalu :** Révérence sobre, visage levé et pose de présentation sans trône ajouté.

**Désélection EN-E1-DESELECT-loolilalu :** Salut de clôture puis départ dans le prolongement du tapis de l’aperçu.

**Contrainte de fidélité :** Geste royal original ; ne pas attribuer de magie de soin ou d’autorité sur tout le Circus.

**Lien au jeu :** rival de route Gloink Queen (relation de fan-game), utility existante « Rétablir l’ordre ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Gloink Queen — gloinkqueen

**Taunt EN-E1-TAUNT-gloinkqueen · Le nid a son avis**

Entrée : Le corps se redresse dans les limites de sa morphologie existante. Pose : Bouche et regard se portent vers la cible ; aucune minion supplémentaire n’apparaît. Sortie : Retour au volume de repos sans réduire la taille pour le cadre.

**Sélection EN-E1-SELECT-gloinkqueen :** Le cadrage s’adapte au gabarit de la reine, dont la silhouette reste entière.

**Désélection EN-E1-DESELECT-gloinkqueen :** Retrait du corps vers le bord d’arrivée, jusqu’au dernier appendice visible.

**Contrainte de fidélité :** Ne pas humaniser l’anatomie ni créer des Gloinks offensifs à partir d’une simple pose.

**Lien au jeu :** rival de route Zooble (relation de fan-game), utility existante « Réorganiser le nid ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### The Fudge — fudge

**Taunt EN-E1-TAUNT-fudge · Une bouchée d’attention**

Entrée : La masse de chocolat s’incline lentement vers l’avant. Pose : Un arrêt menaçant met en valeur la bouche et les volumes sans nouveau membre. Sortie : La masse revient à sa silhouette de garde.

**Sélection EN-E1-SELECT-fudge :** Arrivée pesante et arrêt lisible ; ancrage au sol maintenu.

**Désélection EN-E1-DESELECT-fudge :** Recul compact, puis sortie de toute la masse sans traînée persistante de gameplay.

**Contrainte de fidélité :** Le volume peut être expressif mais ne change ni hitbox ni pouvoir de régénération.

**Lien au jeu :** rival de route Loolilalu (relation de fan-game), utility existante « Se rassembler ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Kaufmo — abstraction — abstractedkaufmo

**Taunt EN-E1-TAUNT-abstractedkaufmo · Regard sans réponse**

Entrée : La silhouette abstraite se ramasse légèrement. Pose : Les regards se fixent sur la cible ; aucun masque de clown humain réapparaît. Sortie : Les appuis reprennent la stance abstraite existante.

**Sélection EN-E1-SELECT-abstractedkaufmo :** La forme entre silencieusement et suspend ses regards dans le cadre.

**Désélection EN-E1-DESELECT-abstractedkaufmo :** Les regards se détournent avant le retrait intégral des appuis.

**Contrainte de fidélité :** Réaction non verbale ; aucune pensée, guérison ou identité humaine restaurée.

**Lien au jeu :** rival de route Ragatha (relation de fan-game), utility existante « Réinitialisation partielle ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Baron Mildenhall — baronmildenhall

**Taunt EN-E1-TAUNT-baronmildenhall · Le silence du chasseur**

Entrée : La silhouette s’oriente avec précision vers la piste. Pose : Maintien d’une posture de visée abaissée ou de présence selon l’asset de référence. Sortie : L’accessoire visible revient à sa position de repos.

**Sélection EN-E1-SELECT-baronmildenhall :** Apparition d’archive sobre, sans dialogue, conservant costume et équipement visibles.

**Désélection EN-E1-DESELECT-baronmildenhall :** L’orientation se ferme puis la silhouette se retire sans scène de résurrection.

**Contrainte de fidélité :** Archive du Baron distincte de Martha ; ne pas inventer de voix ni de nouvelle mémoire.

**Lien au jeu :** rival de route Kinger (relation de fan-game), utility existante « Préparer la cartouche ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Queenie — queenie

**Taunt EN-E1-TAUNT-queenie · Un salut de répétition**

Entrée : La silhouette royale de l’archive se tourne légèrement. Pose : Petit signe silencieux de la main, sans regard impliquant un passé inédit. Sortie : Retour à la pose de la pièce avec base stable.

**Sélection EN-E1-SELECT-queenie :** L’archive se présente entièrement, puis s’immobilise dans une révérence discrète.

**Désélection EN-E1-DESELECT-queenie :** La révérence se referme et la pièce recule dans son cadre d’archive.

**Contrainte de fidélité :** Séquence mémorielle de fan-game ; ne pas présenter Queenie vivante comme retour canonique.

**Lien au jeu :** rival de route Kinger (relation de fan-game), utility existante « Récupération de Queenie ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Kaufmo — kaufmo

**Taunt EN-E1-TAUNT-kaufmo · Le numéro attendra**

Entrée : Une main prépare un salut de clown, puis marque un temps. Pose : Posture de présentation tenue, sourire selon le dessin de référence. Sortie : Le salut se clôt sans changement de visage ou d’état.

**Sélection EN-E1-SELECT-kaufmo :** Entrée d’archive, salut unique et arrêt en pose entière.

**Désélection EN-E1-DESELECT-kaufmo :** Salut interrompu par un signe de clôture, puis sortie avec le costume intact.

**Contrainte de fidélité :** Le clown d’avant est une reconstruction Encore ; pas d’histoire officielle ajoutée.

**Lien au jeu :** rival de route Ragatha (relation de fan-game), utility existante « Récupération de Kaufmo ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Ribbit — ribbit

**Taunt EN-E1-TAUNT-ribbit · Un bond d’avance**

Entrée : Le poids se déplace vers un appui, avant un petit rebond de présentation. Pose : Mains ouvertes et pose amphibienne liée au dessin, sans langue offensive. Sortie : Repose des deux appuis et retour à la garde.

**Sélection EN-E1-SELECT-ribbit :** Petit bond d’entrée suivi d’un arrêt souple au centre de la marque.

**Désélection EN-E1-DESELECT-ribbit :** Repli court, regard latéral puis bond vers le bord de sortie.

**Contrainte de fidélité :** Chorégraphie originale ; attribution et proportions de l’archive restent à confirmer par source.

**Lien au jeu :** rival de route Pomni (relation de fan-game), utility existante « Récupération de Ribbit ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Scratch — scratch

**Taunt EN-E1-TAUNT-scratch · Le défi du chien jaune**

Entrée : La tête s’incline tandis que l’appui avant se présente. Pose : Regard de défi et corps retenu, sans aboiement prétendument officiel. Sortie : L’appui se retire et le corps revient dans son axe.

**Sélection EN-E1-SELECT-scratch :** Arrivée attentive, tête inclinée puis pose entière.

**Désélection EN-E1-DESELECT-scratch :** Dernier coup d’œil vers la piste et départ en suivant son axe naturel.

**Contrainte de fidélité :** Pas de nouveaux crocs, collier ou arme ajoutés à l’archive.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Récupération de Scratch ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Wormo — wormo

**Taunt EN-E1-TAUNT-wormo · Un petit détour**

Entrée : Le corps souple forme une courbe plus lisible dans son plan. Pose : La tête reste élevée, le reste du volume demeure ancré. Sortie : La courbe s’aplanit progressivement vers la stance.

**Sélection EN-E1-SELECT-wormo :** Entrée courbe sans raccourcir le corps pour rentrer dans le portrait.

**Désélection EN-E1-DESELECT-wormo :** Retrait en courbe inverse de direction, sans retourner l’animation d’entrée.

**Contrainte de fidélité :** Morphologie de ver conservée ; aucune jambe ou main inventée.

**Lien au jeu :** rival de route Gangle (relation de fan-game), utility existante « Récupération de Wormo ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Bizco — bizco

**Taunt EN-E1-TAUNT-bizco · Dur à émietter**

Entrée : Le biscuit redresse sa silhouette et avance un appui. Pose : Geste de défi compact, texture et bords inchangés. Sortie : Recul de l’appui et reprise de la pose.

**Sélection EN-E1-SELECT-bizco :** Petit salut de biscuit, contour entier visible.

**Désélection EN-E1-DESELECT-bizco :** Le salut baisse puis la silhouette sort avec ses bords intacts.

**Contrainte de fidélité :** Ne pas détacher un morceau du corps comme ressource ou projectile supplémentaire.

**Lien au jeu :** rival de route Zooble (relation de fan-game), utility existante « Récupération de Bizco ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Rattie — rattie

**Taunt EN-E1-TAUNT-rattie · Juste à côté**

Entrée : Le regard glisse vers un côté, accompagné d’un léger pivot. Pose : Geste bref de main et posture vive, queue conservée si visible dans la référence. Sortie : La main revient et le poids se recentre.

**Sélection EN-E1-SELECT-rattie :** Entrée rapide puis immobilité précise sur la marque.

**Désélection EN-E1-DESELECT-rattie :** Pivot propre et retrait jusqu’à disparition du dernier détail de silhouette.

**Contrainte de fidélité :** Aucun gadget ou nouveau trait d’identité déduit du nom.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Récupération de Rattie ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Spike — spike

**Taunt EN-E1-TAUNT-spike · La pointe de l’attente**

Entrée : La silhouette piquante incline son axe vers la cible. Pose : Pose ramassée, pointes lisibles dans le contour. Sortie : L’axe revient à la verticale de garde.

**Sélection EN-E1-SELECT-spike :** Entrée mesurée pour laisser toutes les pointes dans le cadre.

**Désélection EN-E1-DESELECT-spike :** Recul par le bord d’arrivée sans rotation qui couperait les extrémités.

**Contrainte de fidélité :** Le nom ne prouve aucun tir de piques ; les pointes restent décoratives dans ce geste.

**Lien au jeu :** rival de route Gloink Queen (relation de fan-game), utility existante « Récupération de Spike ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Pink Furry Cyclops — pinkcyclops

**Taunt EN-E1-TAUNT-pinkcyclops · Un seul regard suffit**

Entrée : Le grand corps s’approche de sa marque sans agrandir l’œil. Pose : L’œil unique se fixe ; geste de défi avec les membres réellement visibles. Sortie : Le corps reprend ses appuis de garde.

**Sélection EN-E1-SELECT-pinkcyclops :** La caméra de présentation accueille le grand gabarit sans recadrer sa tête.

**Désélection EN-E1-DESELECT-pinkcyclops :** Le regard se détourne et le corps recule en entier.

**Contrainte de fidélité :** Un seul œil, fourrure et proportions conservés ; pas de rayon oculaire inventé.

**Lien au jeu :** rival de route The Fudge (relation de fan-game), utility existante « Récupération de Pink Furry Cyclops ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Frowning Yellow Clown — yellowclown

**Taunt EN-E1-TAUNT-yellowclown · Toujours pas amusé**

Entrée : Le clown ouvre un bras vers la piste puis suspend le geste. Pose : Expression contrariée du dessin, posture retenue. Sortie : Le bras redescend sans transformer le visage en sourire.

**Sélection EN-E1-SELECT-yellowclown :** Présentation droite et regard sceptique, sans réplique officielle.

**Désélection EN-E1-DESELECT-yellowclown :** Petit signe de refus puis départ sans gag imposé.

**Contrainte de fidélité :** L’expression de référence prime sur une convention de clown souriant.

**Lien au jeu :** rival de route Caine (relation de fan-game), utility existante « Récupération de Frowning Yellow Clown ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### The Oyster — oyster

**Taunt EN-E1-TAUNT-oyster · La réponse reste fermée**

Entrée : La coquille change légèrement son inclinaison sans révéler d’anatomie cachée. Pose : Ouverture seulement si le dessin retenu l’atteste ; sinon coque tenue. Sortie : Retour à la position de garde de la coquille.

**Sélection EN-E1-SELECT-oyster :** Présentation complète du volume avec bord et ouverture de référence lisibles.

**Désélection EN-E1-DESELECT-oyster :** La coquille se réoriente puis sort ; aucun claquement offensif ajouté.

**Contrainte de fidélité :** Aucune perle, langue ou membre caché n’est inventé pour compléter le geste.

**Lien au jeu :** rival de route Bubble (relation de fan-game), utility existante « Récupération de The Oyster ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Light Green Bulb Creature — bulbcreature

**Taunt EN-E1-TAUNT-bulbcreature · Une idée en suspens**

Entrée : La tête en bulbe se penche légèrement vers le côté. Pose : Le contour du bulbe est mis en valeur, sans augmentation de luminosité agressive. Sortie : Retour à l’axe de repos.

**Sélection EN-E1-SELECT-bulbcreature :** Entrée douce et arrêt pour exposer le bulbe et sa couleur.

**Désélection EN-E1-DESELECT-bulbcreature :** Inclinaison inverse puis retrait sans effet de flash.

**Contrainte de fidélité :** L’allure de bulbe n’autorise pas un pouvoir électrique ou lumineux nouveau.

**Lien au jeu :** rival de route Gangle (relation de fan-game), utility existante « Récupération de Light Green Bulb Creature ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Abel — abel

**Taunt EN-E1-TAUNT-abel · Le programme patiente**

Entrée : Un salut contenu accompagne une légère avancée. Pose : Pose d’attente, accessoires strictement liés à l’apparence sélectionnée. Sortie : Le salut se range et le corps reprend sa garde.

**Sélection EN-E1-SELECT-abel :** Entrée d’archive lisible, présentation de la tenue courante.

**Désélection EN-E1-DESELECT-abel :** Geste de clôture puis sortie ; le chariot éventuel suit sa propre fiche de costume.

**Contrainte de fidélité :** Ne pas conclure de parenté ou d’origine avec Caine à partir du nom.

**Lien au jeu :** rival de route Pomni (relation de fan-game), utility existante « Récupération de Abel ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Max — max

**Taunt EN-E1-TAUNT-max · Le convoi ne s’arrête pas**

Entrée : Un bras désigne brièvement l’arrière du cadre. Pose : Appui sûr, tête relevée vers l’adversaire. Sortie : Le bras se replie et retrouve la garde.

**Sélection EN-E1-SELECT-max :** Entrée de convoyeur et signe bref à un partenaire hors champ.

**Désélection EN-E1-DESELECT-max :** Le signe devient un appel de départ puis sortie vers le même bord.

**Contrainte de fidélité :** Simulation de fan-game ; aucun véhicule ou pouvoir absent n’est invoqué.

**Lien au jeu :** rival de route Gummigoo (relation de fan-game), utility existante « Récupération de Max ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Chad — chad

**Taunt EN-E1-TAUNT-chad · Toute la largeur**

Entrée : Le corps ouvre sa posture avec les pieds dans sa base réelle. Pose : Défi par la présence, sans gonfler artificiellement la musculature. Sortie : Retour à la largeur de garde.

**Sélection EN-E1-SELECT-chad :** Arrivée pesante puis pose de trois quarts conservant son volume.

**Désélection EN-E1-DESELECT-chad :** Recentrage des appuis et départ sans écraser le décor.

**Contrainte de fidélité :** Conserver silhouette gommeuse et costume ; pas de croissance en taille.

**Lien au jeu :** rival de route The Fudge (relation de fan-game), utility existante « Récupération de Chad ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Orbsman — orbsman

**Taunt EN-E1-TAUNT-orbsman · Tout tient ensemble**

Entrée : Les volumes du corps s’orientent ensemble, sans se séparer. Pose : Salut compact mettant en valeur les orbes visibles. Sortie : Retour des volumes à leurs emplacements de référence.

**Sélection EN-E1-SELECT-orbsman :** Entrée de la silhouette entière et regard vers le second artiste.

**Désélection EN-E1-DESELECT-orbsman :** Rotation douce du groupe de volumes puis sortie unifiée.

**Contrainte de fidélité :** Ne pas détacher une orbite ni attribuer une nouvelle entité autonome.

**Lien au jeu :** rival de route Kinger (relation de fan-game), utility existante « Récupération de Orbsman ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Ming — ming

**Taunt EN-E1-TAUNT-ming · Prête pour le repère**

Entrée : Un petit signe de main accompagne une pose d’équilibre. Pose : Expression et tenue suivent le visuel équipé ; trophée uniquement s’il appartient au costume. Sortie : La main reprend sa position de repos.

**Sélection EN-E1-SELECT-ming :** Entrée vive, arrêt bref et présentation de la tenue.

**Désélection EN-E1-DESELECT-ming :** Geste d’au revoir et départ sans laisser l’accessoire en place.

**Contrainte de fidélité :** Pas de palmarès ou de victoire canonique déduit de l’apparence au trophée.

**Lien au jeu :** rival de route Zooble (relation de fan-game), utility existante « Récupération de Ming ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Martha Mildenhall — marthamildenhall

**Taunt EN-E1-TAUNT-marthamildenhall · La maison écoute**

Entrée : La silhouette se tourne vers un bruit suggéré par le regard. Pose : Maintien silencieux de la présence dans le costume de référence. Sortie : Le regard revient vers la piste.

**Sélection EN-E1-SELECT-marthamildenhall :** Entrée calme et pose distincte de celle du Baron.

**Désélection EN-E1-DESELECT-marthamildenhall :** Légère inclinaison puis retrait de la silhouette entière.

**Contrainte de fidélité :** Ne pas fusionner Martha et le Baron ni inventer une scène de leur passé.

**Lien au jeu :** rival de route Baron Mildenhall (relation de fan-game), utility existante « Récupération de Martha Mildenhall ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Ghostly — ghostly

**Taunt EN-E1-TAUNT-ghostly · Encore ici**

Entrée : Le volume spectral se penche hors de son axe. Pose : Une suspension attentive, sans disparition de la hurtbox. Sortie : Retour à la hauteur de repos.

**Sélection EN-E1-SELECT-ghostly :** Flottement d’entrée et arrêt ; aspirateur seulement avec la tenue correspondante.

**Désélection EN-E1-DESELECT-ghostly :** Retrait flotté ; accessoire et éventuel effet décoratif quittent ensemble l’aperçu.

**Contrainte de fidélité :** La transparence de présentation n’accorde aucune invulnérabilité.

**Lien au jeu :** rival de route Ragatha (relation de fan-game), utility existante « Récupération de Ghostly ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Angel — angel

**Taunt EN-E1-TAUNT-angel · Un signe discret**

Entrée : Les membres réellement présents s’ouvrent légèrement. Pose : Salut silencieux encadré par le contour du personnage. Sortie : Les membres reviennent au repos.

**Sélection EN-E1-SELECT-angel :** Présentation entière avec les éléments du dessin conservés.

**Désélection EN-E1-DESELECT-angel :** Les éléments ouverts se rassemblent puis le corps se retire.

**Contrainte de fidélité :** Le nom Angel ne suffit pas à donner guérison, résurrection ou protection divine.

**Lien au jeu :** rival de route Loolilalu (relation de fan-game), utility existante « Récupération de Angel ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Disappearing Guy — disappearingguy

**Taunt EN-E1-TAUNT-disappearingguy · Vous m’aviez vu ?**

Entrée : La silhouette se décale juste assez pour jouer avec le bord du cadre. Pose : Pause à demi détournée ; aucune invisibilité de gameplay. Sortie : Retour au centre de garde.

**Sélection EN-E1-SELECT-disappearingguy :** Entrée claire puis petit regard de côté, micro seulement dans la tenue associée.

**Désélection EN-E1-DESELECT-disappearingguy :** Départ derrière le bord réel de l’aperçu, suivi du nettoyage complet des effets.

**Contrainte de fidélité :** Ne pas faire passer une ellipse de menu pour un pouvoir canonique attesté.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Récupération de Disappearing Guy ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Committee Member — committeemember

**Taunt EN-E1-TAUNT-committeemember · Point suivant**

Entrée : Un geste mesuré invite à poursuivre. Pose : Posture d’attente officielle dans les seuls habits du dessin. Sortie : Le geste s’achève et les mains retournent au repos.

**Sélection EN-E1-SELECT-committeemember :** Entrée posée, puis présentation de profil léger.

**Désélection EN-E1-DESELECT-committeemember :** Signe de clôture et départ ; aucun document canonique inventé.

**Contrainte de fidélité :** Le rôle de comité reste attribution d’archive, pas une nouvelle autorité du Circus.

**Lien au jeu :** rival de route Caine (relation de fan-game), utility existante « Récupération de Committee Member ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Shrimp NPC — shrimpnpc

**Taunt EN-E1-TAUNT-shrimpnpc · Petite présence**

Entrée : Le corps se relève selon sa courbe naturelle. Pose : Les appendices attestés dessinent une attente courte. Sortie : Les appuis reviennent sur la marque.

**Sélection EN-E1-SELECT-shrimpnpc :** Entrée latérale, contour de crevette lisible.

**Désélection EN-E1-DESELECT-shrimpnpc :** Retrait latéral jusqu’au dernier appendice, sans ajout de jambe.

**Contrainte de fidélité :** Conserver la petite morphologie ; ne pas agrandir le personnage pour le normaliser.

**Lien au jeu :** rival de route Bubble (relation de fan-game), utility existante « Récupération de Shrimp NPC ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Chinese Room NPC — chineseroomnpc

**Taunt EN-E1-TAUNT-chineseroomnpc · La consigne est prête**

Entrée : Le personnage pointe la zone de jeu avec un geste neutre. Pose : Attente silencieuse, aucun signe culturel inventé. Sortie : Le geste se range proprement.

**Sélection EN-E1-SELECT-chineseroomnpc :** Présentation sobre du modèle d’archive sans décor cliché.

**Désélection EN-E1-DESELECT-chineseroomnpc :** Salut de clôture puis sortie sur le bord d’arrivée.

**Contrainte de fidélité :** L’intitulé d’archive ne justifie ni accent, ni caricature, ni accessoire absent.

**Lien au jeu :** rival de route Zooble (relation de fan-game), utility existante « Récupération de Chinese Room NPC ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Blue AI — blueai

**Taunt EN-E1-TAUNT-blueai · En attente de choix**

Entrée : L’axe du corps se redresse et le regard se fixe. Pose : Pose d’attente bleue, sans scanner offensif ni écran ajouté. Sortie : Retour au volume de garde.

**Sélection EN-E1-SELECT-blueai :** Entrée régulière et arrêt net, accent sur la silhouette.

**Désélection EN-E1-DESELECT-blueai :** Geste bref puis retrait ; aucun effacement de mémoire raconté.

**Contrainte de fidélité :** L’attribution IA ne prouve aucun accès privilégié au programme.

**Lien au jeu :** rival de route Caine (relation de fan-game), utility existante « Récupération de Blue AI ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Cookie Butterfly — cookiebutterfly

**Taunt EN-E1-TAUNT-cookiebutterfly · Un battement de patience**

Entrée : Les ailes visibles s’ouvrent dans leur articulation prévue. Pose : Pause légère, motif biscuit conservé. Sortie : Les ailes reviennent à la pose de garde.

**Sélection EN-E1-SELECT-cookiebutterfly :** Arrivée volante courte et centrage du contour entier.

**Désélection EN-E1-DESELECT-cookiebutterfly :** Départ en courbe avec les deux ailes visibles jusqu’au bord.

**Contrainte de fidélité :** Pas de poudre magique ni de transformation déduite du motif papillon.

**Lien au jeu :** rival de route Loolilalu (relation de fan-game), utility existante « Récupération de Cookie Butterfly ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Gummy Elephant — gummyelephant

**Taunt EN-E1-TAUNT-gummyelephant · Le passage est occupé**

Entrée : Le grand corps se tourne légèrement vers la cible. Pose : Défi par les volumes du dessin ; trompe seulement dans sa mobilité attestée. Sortie : Retour aux appuis de garde.

**Sélection EN-E1-SELECT-gummyelephant :** Entrée large sans compresser le gabarit pour le portrait.

**Désélection EN-E1-DESELECT-gummyelephant :** Retrait calme, contour entier conservé jusqu’à la sortie.

**Contrainte de fidélité :** La force du kit reste une adaptation ; aucune croissance ou nouvelle anatomie.

**Lien au jeu :** rival de route Gummigoo (relation de fan-game), utility existante « Récupération de Gummy Elephant ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Giant Centipede — giantcentipede

**Taunt EN-E1-TAUNT-giantcentipede · Un temps de plus**

Entrée : La tête se relève, les segments suivent une courbe régulière. Pose : Maintien des segments existants, sans ajouter de pattes. Sortie : Retour à la courbe de garde.

**Sélection EN-E1-SELECT-giantcentipede :** Entrée segmentée limitée au cadre et à la longueur enregistrée.

**Désélection EN-E1-DESELECT-giantcentipede :** La tête quitte le cadre puis les derniers segments suivent sans coupe brutale.

**Contrainte de fidélité :** Pas de queue, mandibule ou segment supplémentaire créé pour fermer le dessin.

**Lien au jeu :** rival de route The Fudge (relation de fan-game), utility existante « Récupération de Giant Centipede ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Spudsy Customer — spudsycustomer

**Taunt EN-E1-TAUNT-spudsycustomer · Ma commande ?**

Entrée : Une main se lève comme pour attirer l’attention. Pose : Posture d’attente impatiente sans nouvel objet consommable. Sortie : La main redescend et le regard retourne au duel.

**Sélection EN-E1-SELECT-spudsycustomer :** Entrée de client et regard vers le comptoir suggéré hors champ.

**Désélection EN-E1-DESELECT-spudsycustomer :** Un dernier geste d’attente puis retrait vers le bord de l’aperçu.

**Contrainte de fidélité :** Réaction originale liée au contexte Spudsy ; aucune réplique de série affirmée.

**Lien au jeu :** rival de route The Fudge (relation de fan-game), utility existante « Récupération de Spudsy Customer ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Candy Guard Cyan — candyguardcyan

**Taunt EN-E1-TAUNT-candyguardcyan · Le seuil est gardé**

Entrée : L’équipement visible est remis dans son axe de repos. Pose : Salut de garde compact, couleur cyan conservée. Sortie : Retour à une garde lisible sans attaque.

**Sélection EN-E1-SELECT-candyguardcyan :** Entrée mesurée et salut orienté vers la piste.

**Désélection EN-E1-DESELECT-candyguardcyan :** Salut achevé puis retrait en gardant l’équipement près du corps.

**Contrainte de fidélité :** Ne pas inventer rang, arme ou pouvoir distinct sans référence de variante.

**Lien au jeu :** rival de route Loolilalu (relation de fan-game), utility existante « Récupération de Candy Guard Cyan ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Candy Guard Blue — candyguardblue

**Taunt EN-E1-TAUNT-candyguardblue · La ligne reste droite**

Entrée : Le corps marque un petit pivot de contrôle. Pose : Pose précise mettant en valeur la couleur bleue. Sortie : Retour sur la ligne de garde.

**Sélection EN-E1-SELECT-candyguardblue :** Arrivée sur une trajectoire droite et arrêt propre.

**Désélection EN-E1-DESELECT-candyguardblue :** Pivot de sortie puis marche jusqu’au bord, équipement conservé.

**Contrainte de fidélité :** La couleur ne constitue pas une preuve de hiérarchie ou de technique canonique.

**Lien au jeu :** rival de route Gloink Queen (relation de fan-game), utility existante « Récupération de Candy Guard Blue ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Candy Guard Violet — candyguardpurple

**Taunt EN-E1-TAUNT-candyguardpurple · Veuillez patienter**

Entrée : Une paume ou l’appendice disponible indique un arrêt. Pose : Geste de contrôle bref avec tenue violette inchangée. Sortie : Le geste se range et l’axe se recentre.

**Sélection EN-E1-SELECT-candyguardpurple :** Entrée puis geste de contrôle de la piste.

**Désélection EN-E1-DESELECT-candyguardpurple :** Le geste devient une invitation au prochain choix puis retrait.

**Contrainte de fidélité :** Pas de magie royale, de grade ou d’arme ajouté à l’archive.

**Lien au jeu :** rival de route Loolilalu (relation de fan-game), utility existante « Récupération de Candy Guard Violet ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Gummy Worm — gummyworm

**Taunt EN-E1-TAUNT-gummyworm · Encore un virage**

Entrée : Le corps gommeux décrit une courbe basse. Pose : Tête tournée vers la cible, texture conservée. Sortie : La courbe revient sans rebond élastique excessif.

**Sélection EN-E1-SELECT-gummyworm :** Entrée au ras du sol, longueur du dessin maintenue.

**Désélection EN-E1-DESELECT-gummyworm :** Retrait par courbe latérale jusqu’au dernier segment.

**Contrainte de fidélité :** Aucun membre humain ou projectile organique supplémentaire.

**Lien au jeu :** rival de route Gummigoo (relation de fan-game), utility existante « Récupération de Gummy Worm ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Barrel Monkey — barrelmonkey

**Taunt EN-E1-TAUNT-barrelmonkey · Le prochain numéro**

Entrée : Le personnage ajuste son appui autour du tonneau visible. Pose : Petit salut ; tonneau fixe et intact. Sortie : Retour au contact prévu avec le tonneau.

**Sélection EN-E1-SELECT-barrelmonkey :** Entrée du personnage et de son accessoire comme une seule famille de présentation.

**Désélection EN-E1-DESELECT-barrelmonkey :** Salut refermé puis retrait commun du personnage et du tonneau.

**Contrainte de fidélité :** Ne pas créer une arme explosive ou un animal supplémentaire dans l’accessoire.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Récupération de Barrel Monkey ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Jeffery — jeffery

**Taunt EN-E1-TAUNT-jeffery · Je suis toujours là**

Entrée : Un léger déplacement ouvre sa silhouette vers la piste. Pose : Salut réservé, visage fidèle au dessin d’archive. Sortie : Retour à la posture de repos.

**Sélection EN-E1-SELECT-jeffery :** Entrée sans effet spectaculaire, puis regard direct.

**Désélection EN-E1-DESELECT-jeffery :** Petit signe silencieux et départ simple.

**Contrainte de fidélité :** La discrétion est un choix de mise en scène Encore, pas une personnalité officielle documentée.

**Lien au jeu :** rival de route Pomni (relation de fan-game), utility existante « Récupération de Jeffery ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Mildenhall Souls — mildenhallsouls

**Taunt EN-E1-TAUNT-mildenhallsouls · Un souffle à distance**

Entrée : Le groupe de formes spectrales s’oriente dans un même sens. Pose : Suspension non verbale, pas de visage humain nouveau. Sortie : Les formes reviennent à leur composition de repos.

**Sélection EN-E1-SELECT-mildenhallsouls :** Apparition d’archive groupée avec limites et nombre de formes du dessin.

**Désélection EN-E1-DESELECT-mildenhallsouls :** Retrait commun sans laisser un esprit autonome dans le menu.

**Contrainte de fidélité :** Pas de noms, de mémoire ou de résurrection attribués aux âmes.

**Lien au jeu :** rival de route Baron Mildenhall (relation de fan-game), utility existante « Récupération de Mildenhall Souls ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Red Mannequin — redmannequin

**Taunt EN-E1-TAUNT-redmannequin · Repère rouge**

Entrée : Le mannequin pivote légèrement sur sa marque. Pose : Geste de défi géométrique, sans visage animé ajouté. Sortie : Retour aux articulations de repos.

**Sélection EN-E1-SELECT-redmannequin :** Présentation en deux appuis, accent rouge conservé.

**Désélection EN-E1-DESELECT-redmannequin :** Rotation de sortie et départ, sans chute ou dommage.

**Contrainte de fidélité :** Conserver l’aspect de mannequin ; aucune identité humaine suggérée.

**Lien au jeu :** rival de route Ragatha (relation de fan-game), utility existante « Récupération de Red Mannequin ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Orange Mannequin — orangemannequin

**Taunt EN-E1-TAUNT-orangemannequin · Repère orange**

Entrée : Le mannequin se redresse de façon mécanique. Pose : Pause symétrique montrant le contour orange. Sortie : Recentrage des articulations.

**Sélection EN-E1-SELECT-orangemannequin :** Entrée lente suivie d’un arrêt stable.

**Désélection EN-E1-DESELECT-orangemannequin :** Bras ramenés près du corps puis marche de sortie.

**Contrainte de fidélité :** La mécanique est une chorégraphie de simulation, pas une fonction canonique ajoutée.

**Lien au jeu :** rival de route Gangle (relation de fan-game), utility existante « Récupération de Orange Mannequin ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Yellow Mannequin — yellowmannequin

**Taunt EN-E1-TAUNT-yellowmannequin · Repère jaune**

Entrée : Un bras désigne une ligne imaginaire du ring. Pose : Pose de contrôle, contour jaune entier visible. Sortie : Le bras revient sans déformation des articulations.

**Sélection EN-E1-SELECT-yellowmannequin :** Entrée latérale et pose ouverte vers le duel.

**Désélection EN-E1-DESELECT-yellowmannequin :** La pose se ferme puis le mannequin recule.

**Contrainte de fidélité :** Ne pas ajouter de visage, de parole ou de rang au mannequin.

**Lien au jeu :** rival de route Zooble (relation de fan-game), utility existante « Récupération de Yellow Mannequin ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Magenta Mannequin — magentamannequin

**Taunt EN-E1-TAUNT-magentamannequin · Repère magenta**

Entrée : Le mannequin tourne la tête ou son volume supérieur vers la cible. Pose : Une pose précise dans l’axe, sans mécanisme interne révélé. Sortie : Retour au repère neutre.

**Sélection EN-E1-SELECT-magentamannequin :** Présentation de trois quarts, contours magenta inchangés.

**Désélection EN-E1-DESELECT-magentamannequin :** Un pas de côté précède le retrait derrière le cadre.

**Contrainte de fidélité :** Les articulations suivent le dessin existant, sans anatomie cachée inventée.

**Lien au jeu :** rival de route Pomni (relation de fan-game), utility existante « Récupération de Magenta Mannequin ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Abstraction du cellier — cellarabstraction

**Taunt EN-E1-TAUNT-cellarabstraction · Les regards se rassemblent**

Entrée : Les appuis se resserrent dans la masse du cellier. Pose : Regards orientés ensemble, sans visage humain ou intention verbalisée. Sortie : Retour aux appuis répartis de la stance.

**Sélection EN-E1-SELECT-cellarabstraction :** Entrée silencieuse de toute la masse, cadrage adapté au gabarit.

**Désélection EN-E1-DESELECT-cellarabstraction :** Les regards quittent la cible avant le retrait de la masse entière.

**Contrainte de fidélité :** Aucune identité individuelle donnée à l’abstraction collective.

**Lien au jeu :** rival de route Kaufmo — abstraction (relation de fan-game), utility existante « Abstraction du cellier · Rassembler le signal ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Abstraction aquatique — aquaticabstraction

**Taunt EN-E1-TAUNT-aquaticabstraction · Le ressac attend**

Entrée : Les appendices aquatiques se replient dans leur contour. Pose : Suspension de courant, reflets sans flash. Sortie : Les appendices reviennent à leurs positions d’ancrage.

**Sélection EN-E1-SELECT-aquaticabstraction :** Entrée horizontale laissant visibles les longs appendices.

**Désélection EN-E1-DESELECT-aquaticabstraction :** Retrait dans le même plan, sans coupe ni transformation en liquide.

**Contrainte de fidélité :** L’attribution aquatique de l’archive reste à confirmer ; pas d’origine inventée.

**Lien au jeu :** rival de route Bubble (relation de fan-game), utility existante « Abstraction aquatique · Ralentir le courant ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Jax — abstraction — abstractedjax

**Taunt EN-E1-TAUNT-abstractedjax · Le contour s’arrête**

Entrée : La grande silhouette abstraite se fige après une inclinaison. Pose : Regards fixes et silence ; aucun sourire humain restauré. Sortie : Les appuis reprennent la pose abstraite.

**Sélection EN-E1-SELECT-abstractedjax :** Entrée oblique contenue, jamais de réplique de Jax humain.

**Désélection EN-E1-DESELECT-abstractedjax :** Le contour se détourne puis quitte entièrement le cadre.

**Contrainte de fidélité :** Identité issue des références du dépôt ; aucune guérison ou suite de série inventée.

**Lien au jeu :** rival de route Pomni (relation de fan-game), utility existante « Jax — abstraction · Retenir le signal ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Queenie — abstraction — abstractedqueenie

**Taunt EN-E1-TAUNT-abstractedqueenie · La veille silencieuse**

Entrée : Le corps s’abaisse légèrement sans modifier sa morphologie. Pose : Regards retenus ; luminosité adaptée à la tenue calme ou de base. Sortie : Retour à la stance de la forme abstraite choisie.

**Sélection EN-E1-SELECT-abstractedqueenie :** Entrée basse et lente, sans reconstitution de la pièce humaine.

**Désélection EN-E1-DESELECT-abstractedqueenie :** Repli calme, regards détournés et retrait continu.

**Contrainte de fidélité :** L’apparence calme ne signifie ni réversion ni restitution de mémoire.

**Lien au jeu :** rival de route Kinger (relation de fan-game), utility existante « Queenie — abstraction · Calmer le signal ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Ribbit — abstraction — abstractedribbit

**Taunt EN-E1-TAUNT-abstractedribbit · Le bond suspendu**

Entrée : Les appuis de l’archive se ramassent. Pose : Une suspension basse prépare un mouvement qui ne frappe pas. Sortie : Les appuis reprennent la distance de garde.

**Sélection EN-E1-SELECT-abstractedribbit :** Entrée au gabarit abstrait puis arrêt complet.

**Désélection EN-E1-DESELECT-abstractedribbit :** Repli des appuis et départ latéral, sans retour à la grenouille de base.

**Contrainte de fidélité :** Attribution d’archive à vérifier ; aucune parole ni souvenir de Ribbit.

**Lien au jeu :** rival de route Jax (relation de fan-game), utility existante « Ribbit — abstraction · Fixer les appuis ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Pomni — abstraction originale — originalabstractedpomni

**Taunt EN-E1-TAUNT-originalabstractedpomni · Le détour immobile**

Entrée : Les arches abstraites se tournent autour d’un vide de composition. Pose : Regards distribués autour du contour, pas de véritable portail. Sortie : Les appuis se réalignent sur la stance.

**Sélection EN-E1-SELECT-originalabstractedpomni :** La forme originale entre en laissant son contour entier visible.

**Désélection EN-E1-DESELECT-originalabstractedpomni :** Les arches se détournent et sortent sans faire disparaître un autre personnage.

**Contrainte de fidélité :** Création Encore entièrement originale, jamais présentée comme futur officiel de Pomni.

**Lien au jeu :** rival de route Pomni (relation de fan-game), utility existante « Pomni — abstraction originale · Retrouver un repère ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Ragatha — abstraction originale — originalabstractedragatha

**Taunt EN-E1-TAUNT-originalabstractedragatha · Les fils retiennent**

Entrée : Les fils sombres se tendent dans le contour du dessin. Pose : Pause de tension sans attacher la cible. Sortie : La tension se relâche vers la stance.

**Sélection EN-E1-SELECT-originalabstractedragatha :** Entrée lente de la masse de fils et de volumes.

**Désélection EN-E1-DESELECT-originalabstractedragatha :** Les fils reviennent au corps puis toute la masse se retire.

**Contrainte de fidélité :** Création Encore ; pas de couture canonique ni de transformation imposée à Ragatha.

**Lien au jeu :** rival de route Ragatha (relation de fan-game), utility existante « Ragatha — abstraction originale · Retendre le fil ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Gangle — abstraction originale — originalabstractedgangle

**Taunt EN-E1-TAUNT-originalabstractedgangle · Le ruban refuse**

Entrée : Les lanières se rassemblent dans un axe vertical. Pose : Boucle suspendue, aucun masque humain retrouvé. Sortie : La boucle revient aux courbes de repos.

**Sélection EN-E1-SELECT-originalabstractedgangle :** Entrée en courbes distinctes sans couper les rubans au bord.

**Désélection EN-E1-DESELECT-originalabstractedgangle :** Retombée maîtrisée puis retrait des lanières dans leur ensemble.

**Contrainte de fidélité :** Création Encore séparée des apparences officielles partielles.

**Lien au jeu :** rival de route Gangle (relation de fan-game), utility existante « Gangle — abstraction originale · Rassembler les rubans ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Kinger — abstraction originale — originalabstractedkinger

**Taunt EN-E1-TAUNT-originalabstractedkinger · Le bastion observe**

Entrée : La masse verticale se redresse sur sa base. Pose : Regards distribués, silence et volume fixe. Sortie : Retour à l’ancrage du bastion.

**Sélection EN-E1-SELECT-originalabstractedkinger :** Arrivée pesante avec toute la hauteur de la forme originale.

**Désélection EN-E1-DESELECT-originalabstractedkinger :** Le bastion pivote puis se retire sans réduire sa hauteur.

**Contrainte de fidélité :** Aucun avenir ou passé canonique de Kinger déduit de ce bastion inventé.

**Lien au jeu :** rival de route Kinger (relation de fan-game), utility existante « Kinger — abstraction originale · Rallumer un repère ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

### Zooble — abstraction originale — originalabstractedzooble

**Taunt EN-E1-TAUNT-originalabstractedzooble · Les fragments patientent**

Entrée : Les fragments visibles se replacent dans l’assemblage enregistré. Pose : Asymétrie tenue, sans ajout ni suppression de pièce. Sortie : Retour aux ancrages de la stance originale.

**Sélection EN-E1-SELECT-originalabstractedzooble :** Entrée oblique, contours et points d’attache conservés.

**Désélection EN-E1-DESELECT-originalabstractedzooble :** L’assemblage se détourne et sort sans abandonner de fragment autonome.

**Contrainte de fidélité :** Forme originale Encore ; ne remplace aucune configuration officielle de Zooble.

**Lien au jeu :** rival de route Zooble (relation de fan-game), utility existante « Zooble — abstraction originale · Stabiliser les fragments ». Statuts : conçu ; assets à produire ; non intégré ; tests de comportement à exécuter.

## Contrat des équipes

| Responsabilité | Règle proposée |
| --- | --- |
| health | Vie propre conservée pour chaque membre ; aucune régénération passive dans le premier prototype. |
| defeat | Deux membres KO ; le relais après premier KO est automatique et gratuit. |
| identity | ID de membre stable, indépendant du slot actif ; le corps de simulation suit le membre, jamais le portrait. |
| clock | 60 ticks de simulation ; jauge et cooldowns arrêtés en pause, présentation et fin de manche. Les scènes abrégées ne font pas avancer ces ressources. |
| economics | Valider les deux membres et leur état, réserver une transaction, puis prélever à l’engagement. Refus préalable sans coût ; interruption après engagement sans remboursement. Gain des impacts partagé et borné par événement. |
| neutralTag | Autorisé au sol, hors touche/garde/projection/cinématique. Actif exposé pendant la sortie ; entrant contrôlable au tick 18 proposé, face vers l’adversaire, placement valide le plus proche. |
| comboTag | Uniquement après confirmation d’une attaque inscrite dans la table de cancels ; garde et whiff refusent. Scaling, rebonds et capture déjà utilisés sont conservés. |
| rescueTag | Option future de défi solo d’abord ; aucune invulnérabilité implicite. Réserve disponible, ressource et fenêtre explicite requises ; interdit pendant une projection ou un super confirmé. |
| assist | Un partenaire de roster temporaire par équipe. Il reçoit les dégâts sur sa propre vie, ne garde pas et peut être puni. Son KO n’interrompt pas une attaque déjà résolue mais bloque tout rappel. |
| duoSuper | Longue séquence après hit-confirm seulement ; les deux membres sont réservés jusqu’à la sortie. Garde/raté : récupération de l’amorce sans scène. Pas de nouveau pouvoir ajouté au kit canonique. |
| comboHistory | Un registre de combo par défenseur et équipe attaquante ; changer d’actif ne remet à zéro ni réduction, ni OTG, ni rebond, ni compteur de secours. |
| objectPolicy | À la réserve, projectiles déjà partis terminent leur vie bornée, pièges continuent leurs ticks sans nouveau spawn. Au KO du propriétaire, supprimer ses pièges au tick suivant ; projectile déjà parti termine sa vie. En nouvelle manche, tout nettoyer. |
| stageTransition | Réserver destination et assets avant match ; pendant transition : gel de simulation, nouveaux appels refusés, partenaires temporaires retirés et cooldowns conservés. Les objets ne sont pas transférés sauf contrat explicite. |
| morphology | Les prises humanoïdes ont une variante de repousse pour géants, sphères et abstractions ; aucune contorsion forcée d’un sprite pour rendre une prise possible. |
| narrative | Duo libre = simulation affichée. Duo de campagne = versions et événement approuvés par chapitre. Les duos mémoriels ne restaurent pas les personnes disparues. |
| replay | Nouvelle version requise pour les nouvelles actions et membres. Les anciens replays gardent les règles 0.5.0 et leur catalogue historique ; aucun champ ne leur est injecté. |

| Réglage initial | Valeur proposée |
| --- | --- |
| teamMeterMax | 100 |
| initialTeamMeter | 50 |
| passiveGainPerSimulationTick | 0.05 |
| assistCost | 25 |
| neutralTagCost | 15 |
| comboTagCost | 35 |
| rescueTagCost | 60 |
| duoSuperCost | 75 |
| assistCooldownTicks | 480 |
| tagCooldownTicks | 240 |
| assistEntryTicks | 24 |
| assistExitTicks | 30 |
| controlTransferTick | 18 |
| rescueInvulnerabilityTicks | 0 |
| finalScenePresentationTicks | 180 |

Ces réglages sont des hypothèses, pas une modification du jeu 0.7.0. Les jauges personnelles et les anciens replays restent sous leurs règles existantes. Les 12 duos utilisent les techniques effectivement présentes ; leurs chorégraphies et relations de scène sont originales.

### EN-E1-DUO-pomni-ragatha — Un pas ensemble

**Pomni + Ragatha · La grande piste · explicit-encore-simulation**

Entente de répétition inspirée de leur présence dans le groupe ; scène originale.

**Super :** Pomni crée une ouverture par sa course de kit ; Ragatha enchaîne avec son bouton déjà défini.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Pomni | Course vers EXIT | melee |
| Ragatha | Bouton lancé | projectile |

**Dernier Acte :** Le rideau du numéro se ferme sur une cible repoussée hors de la marque ; les deux artistes se saluent. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Jax).

**Limite narrative :** Une répétition partagée, pas une attaque combinée attestée.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-pomni-kinger — Le repère dans le noir

**Pomni + Kinger · Mildenhall Manor · explicit-encore-simulation**

Duo de parcours inspiré du contexte du manoir ; coopération écrite pour Encore.

**Super :** La balle de Pomni marque le départ ; Kinger avance sur le repère ouvert avec son coup existant.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Pomni | Balle de jonglerie | projectile |
| Kinger | Sortie du fort | melee |

**Dernier Acte :** Les deux silhouettes restent près d’un repère lumineux du décor pendant que la cible quitte le plan. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Baron Mildenhall).

**Limite narrative :** Aucune guérison, mémoire révélée ou lumière magique nouvelle.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-pomni-gummigoo — La route gardée

**Pomni + Gummigoo · Candy Canyon · explicit-encore-simulation**

Rencontre simulée de Candy Canyon, explicitement extérieure à une suite canonique.

**Super :** Pomni traverse la marque ; Gummigoo ferme l’espace avec son coup fort de kit.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Pomni | Course vers EXIT | melee |
| Gummigoo | Coup de queue | melee |

**Dernier Acte :** Un espace libre reste entre les personnages et le décor ; un salut termine la répétition. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (The Fudge).

**Limite narrative :** Ne pas ressusciter Gummigoo ni lui attribuer la connaissance de ce qui suit son épisode.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-zooble-gangle — Le cadre choisi

**Zooble + Gangle · La grande piste · explicit-encore-simulation**

Coordination de deux artistes, sans imposer identité ou émotion.

**Super :** Zooble ouvre un angle avec son heavy ; Gangle ferme la ligne avec son projectile existant.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Zooble | Bras allongé | melee |
| Gangle | Masque de comédie | projectile |

**Dernier Acte :** Gangle conserve son masque équipé, Zooble son assemblage ; les deux sortent côte à côte. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Caine).

**Limite narrative :** Aucun masque réparé miraculeusement, aucune forme définitive de Zooble.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-caine-bubble — Le numéro n’est pas fini

**Caine + Bubble · La grande piste · explicit-encore-simulation**

Partenaires de présentation ; technique collective originale du fan-game.

**Super :** La salve de Caine ouvre une diagonale ; Bubble traverse avec son déplacement offensif déjà présent.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Caine | Confettis numériques | projectile |
| Bubble | Bulle-bélier | melee |

**Dernier Acte :** Caine annonce silencieusement le rappel tandis que Bubble traverse la composition, sans toucher le verdict. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Pomni).

**Limite narrative :** Le présentateur n’obtient ni contrôle des choix ni victoire automatique.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-gummigoo-max — Le premier relais du convoi

**Gummigoo + Max · Candy Canyon · explicit-encore-simulation**

Duo de convoyeurs dans une répétition de l’aventure.

**Super :** Gummigoo avance, Max frappe au point d’arrêt avec son heavy de kit.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Gummigoo | Convoi lancé | melee |
| Max | Coup fort de Max | melee |

**Dernier Acte :** Les deux regardent le chemin du convoi ; la cible reste hors de ce passage. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Loolilalu).

**Limite narrative :** Convoi original de répétition ; ne pas lui attribuer une nouvelle livraison officielle.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-gummigoo-chad — Le couloir du convoi

**Gummigoo + Chad · Candy Canyon · explicit-encore-simulation**

Association des convoyeurs dans le cadre de simulation.

**Super :** Le projectile de Gummigoo fixe la distance ; l’avancée de Chad termine l’ouverture.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Gummigoo | Bonbon ricochet | projectile |
| Chad | Avancée de Chad | melee |

**Dernier Acte :** Le groupe se remet en route après la sortie de la cible du cadre du numéro. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (The Fudge).

**Limite narrative :** Pas de véhicule supplémentaire invoqué par la super.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-max-chad — Les deux côtés du chargement

**Max + Chad · Candy Canyon · explicit-encore-simulation**

Répartition de rôles du convoi, écriture originale.

**Super :** Max prend la ligne avant et Chad ferme la seconde avec son coup fort.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Max | Avancée de Max | melee |
| Chad | Coup fort de Chad | melee |

**Dernier Acte :** Ils gardent deux repères du décor avant de les libérer ensemble. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Gloink Queen).

**Limite narrative :** Ne pas faire du décor un nouvel ennemi ou changer l’alliance canonique par ce duel libre.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-loolilalu-candyguardcyan — La réception de la cour

**Loolilalu + Candy Guard Cyan · Le palais de sucre · explicit-encore-simulation**

Association de la souveraine et d’une garde du même catalogue, chorégraphie inventée.

**Super :** Loolilalu projette son motif de sucre ; la garde avance selon son kit.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Loolilalu | Éclat de sucre | projectile |
| Candy Guard Cyan | Avancée de Candy Guard Cyan | melee |

**Dernier Acte :** Salut royal et poste de garde se clôturent après le verdict. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Gummigoo).

**Limite narrative :** La garde cyan n’est pas nommée capitaine et ne reçoit pas de rang inédit.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-candyguardblue-candyguardpurple — Deux marques au palais

**Candy Guard Blue + Candy Guard Violet · Le palais de sucre · explicit-encore-simulation**

Coordination de gardes, sans hiérarchie déduite des couleurs.

**Super :** La garde bleue ouvre la ligne au contact ; la garde violette utilise son projectile de kit.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Candy Guard Blue | Coup fort de Candy Guard Blue | melee |
| Candy Guard Violet | Projectile de Candy Guard Violet | projectile |

**Dernier Acte :** Deux saluts distincts encadrent l’arrêt du numéro. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (The Fudge).

**Limite narrative :** Les armes et accessoires restent ceux des références ; pas de magie commune inventée comme canon.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-ragatha-kaufmo — Le salut de l’archive

**Ragatha + Kaufmo · Le chapiteau des souvenirs brisés · explicit-memory-simulation**

Répétition mémorielle alternative, jamais un retour dans la chronologie de la série.

**Super :** Ragatha avance sur une marque de répétition ; la reconstruction de Kaufmo complète le numéro.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Ragatha | Rattrapage | melee |
| Kaufmo | Coup fort de Kaufmo | melee |

**Dernier Acte :** Les deux silhouettes sont replacées dans leurs cadres d’archive à la fin du tableau. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Kaufmo — abstraction).

**Limite narrative :** La scène n’empêche ni ne répare l’abstraction ; la confrontation est une simulation affichée.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

### EN-E1-DUO-kinger-queenie — Deux pièces de mémoire

**Kinger + Queenie · Le chapiteau des souvenirs brisés · explicit-memory-simulation**

Tableau mémoriel de fan-game, présenté comme archive dès la sélection.

**Super :** Le projectile de Kinger précède l’avancée de la reconstruction de Queenie.

| Participant | Technique existante | Fonction |
| --- | --- | --- |
| Kinger | Écho du manoir | projectile |
| Queenie | Avancée de Queenie | melee |

**Dernier Acte :** Deux pièces demeurent côte à côte dans le cadre de mémoire, puis la répétition s’arrête. Conditions : scène obtenue, deux membres vivants, arène indiquée, verdict déjà enregistré et adversaire compatible (Abstraction du cellier).

**Limite narrative :** Ni résurrection de Queenie, ni restauration de ses souvenirs, ni guérison de son abstraction.

**Remplacement :** Si partenaire KO, contexte incompatible, cible non prise en charge ou scène verrouillée : finale individuelle existante, puis victoire normale si nécessaire.

## Entités et clashes

133 slots projectile/piège existants sont référencés avec leurs champs réels dans le JSON ; champ absent reste absent. La réflexion change l’attribution des dégâts, pas le motif graphique d’origine. Une entité du kit n’occupe pas implicitement un slot d’équipe.

### EN-E1-CLASH-ACCESSORIES — Les accessoires se croisent

Deux projectiles compatibles entrent dans une zone de clash explicitement placée dans le défi ; désactivé en versus.

**Éligibilité :** Phases actives, contact réel des deux projectiles, orientations opposées, dans le périmètre du défi ; un événement par paire d’attaques.

**Commande :** Une pression unique dans une fenêtre annoncée ; alternative maintien et résolution automatique solo.

**Arbitrage tiers :** Un impact tiers qui touche avant validation annule le clash ; à tick égal, résoudre d’abord dégâts/KO puis éligibilité, dans un ordre indépendant du côté joueur.

**Horloges :** Pendant la confrontation, chrono du bonus, projectiles, pièges et assistances gelés ; entrées du QTE utilisent une horloge dédiée bornée.

**Interruption :** Pause suspend la fenêtre ; déconnexion ou absence de réponse résout un échec neutre sans dégâts bonus ; version solo automatique proposée avant départ.

**Résultat :** Succès = cible de défi validée ; échec = projectile retiré ; égalité = séparation neutre. Aucun verdict de duel déjà enregistré n’est inversé.

**Retour :** Projectiles de clash consommés une seule fois ; personnages sur leurs positions sûres précédentes, ressources conservées hors coûts explicitement engagés.

| Réglage initial | Valeur proposée |
| --- | --- |
| simultaneityTicks | 3 |
| responseWindowTicks | 36 |
| maximumPresentationTicks | 120 |
| cooldownTicks | 600 |
| maxPerBonusAttempt | 2 |

### EN-E1-CLASH-PUSH — La marque de poussée

Les deux actions autorisées atteignent une même caisse de répétition pendant le bonus camion.

**Éligibilité :** Les deux heavy inscrits contactent la même caisse active, sur des bords opposés et sans projection/KO en cours ; aucun autre couple ne déclenche la scène.

**Commande :** Maintien bref plafonné, aucun martelage ; pause et déconnexion annulent vers un état sûr.

**Arbitrage tiers :** Annuler si une autre cible ou attaque détruit la caisse au tick de validation ; le résultat de destruction reste prioritaire et unique.

**Horloges :** Horloge du bonus et acteurs tiers suspendus pendant la résolution courte ; mêmes valeurs au retour avec présentation réduite.

**Interruption :** Maintien configurable ou pression unique ; absence d’entrée, égalité ou déconnexion laisse la caisse à sa place et rend le contrôle.

**Résultat :** Déplacer la caisse à un repère valide ou la laisser à sa place ; coût et résultats enregistrés une fois.

**Retour :** Arrivée au repère libre le plus proche, jamais derrière une paroi ; coûts engagés conservés, aucun remplissage de ressource.

| Réglage initial | Valeur proposée |
| --- | --- |
| simultaneityTicks | 4 |
| responseWindowTicks | 48 |
| maximumPresentationTicks | 120 |
| cooldownTicks | 600 |
| maxPerBonusAttempt | 1 |

Les confrontations restent limitées aux futurs bonus solo indiqués, désactivées en versus. Ces réglages sont des hypothèses d’équilibrage. Les fiches de production A à J de l’extension sont reliées aux enregistrements précis par `productionSheetMap` dans [extensions-teams-bonus.json](extensions-teams-bonus.json).

## 18 situations à exécuter sur la future implémentation

| ID | Situation | Action | Résultat attendu |
| --- | --- | --- | --- |
| EN-E1-QA-01 | Confirmation et désélection | Choisir puis retirer un artiste pendant son entrée. | Le choix logique et le focus changent immédiatement ; aucune voix ni particule résiduelle. |
| EN-E1-QA-02 | Taunt interrompu | Toucher une cible au milieu de son geste. | Réaction normale, pas d’armure, bonus ni coût effacé. |
| EN-E1-QA-03 | Appel indisponible | Appeler réserve occupée ou en récupération. | Motif annoncé et aucun débit. |
| EN-E1-QA-04 | Impacts simultanés | Toucher actif et soutien avec une même attaque. | Deux vies affectées selon règle ; événement de jauge partagé non dupliqué. |
| EN-E1-QA-05 | Relais gratuit après KO | Vider jauge puis mettre actif KO. | Entrée du survivant sans réanimation ou blocage de ressource. |
| EN-E1-QA-06 | Double KO | Mettre deux membres KO dans le même tick. | Ordre déterministe et égalité selon règle annoncée. |
| EN-E1-QA-07 | Super en garde ou ratée | Engager amorce sans hit-confirm. | Récupération courte, aucune scène longue ni dégâts garantis. |
| EN-E1-QA-08 | Composition incompatible | Choisir des versions incompatibles pour une scène. | Scène refusée, combat libre encore possible avec conclusion de remplacement. |
| EN-E1-QA-09 | Priorité des conclusions | Satisfaire scène dramatique, duo et solo à la fois. | Une seule scène selon priorité ; verdict inchangé. |
| EN-E1-QA-10 | Clash et absence de réponse | Tester réussite/échec/égalité/déconnexion. | Chaque branche bornée, pas de martelage obligatoire, pas de victoire attribuée deux fois. |
| EN-E1-QA-11 | Entité et propriétaire KO | Passer réserve puis KO avec piège et projectile actifs. | Cycle appliqué selon contrat ; attribution et nettoyage stables. |
| EN-E1-QA-12 | Transition et objet posé | Déclencher transition pendant combo et piège. | Historique du combo et horloges conservés ; objet traité selon contrat explicite. |
| EN-E1-QA-13 | Réflexion et attribution | Réfléchir le projectile de Jax puis conclure le duel. | Motif original conservé ; dégâts et condition de finale crédités au propriétaire effectif. |
| EN-E1-QA-14 | Boucle infinie | Alterner pièges, tag et assistance dans un coin. | Caps, réduction et cooldowns empêchent prolongation infinie. |
| EN-E1-QA-15 | Horde au plafond | Atteindre six cibles et envoyer une nouvelle vague. | Cap respecté, entrées lisibles, sortie accessible et coût mesuré avant validation. |
| EN-E1-QA-16 | Bonus réussi ou raté | Terminer puis rater une épreuve facultative. | Progression et récompense correctes ; aucune branche de campagne bloquée. |
| EN-E1-QA-17 | Attribution et reprise | Réclamer récompense puis recharger. | Acquisition unique et persistante ; source et résultat conservés. |
| EN-E1-QA-18 | Scène abrégée | Comparer séquence complète et version abrégée. | État de combat, vies, ressources et résultat identiques ; seul le temps de présentation change. |
