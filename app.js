/* ==========================================================================
   C&A Mainframe OS v0.98 - Desktop & Window Manager (app.js)
   ========================================================================== */

// 1. Lore File System Data
const FileSystem = {
  currentFolder: 'emails',
  folders: {
    emails: [
      {
        name: 'headset_proposal.txt',
        content: `De : Charles (c.director@c-and-a.corp)
À : Arthur (a.lead-tech@c-and-a.corp)
Sujet : Prototype de casque VR "Aventure"

Arthur,
J'ai reçu les derniers rapports de couplage neuronal. Les fréquences de rétroaction sont extrêmement élevées. Si un utilisateur subit un pic d'adrénaline, le casque verrouille les pilotes de déconnexion.
La direction insiste pour une sortie au troisième trimestre. Ils disent que le public veut une "immersion totale". Trouve un moyen de stabiliser la passerelle neuronale.

- Charles`
      },
      {
        name: 'subject_missing.txt',
        content: `Rapport d'incident #89 - Incident de Test

Le testeur Arthur a enfilé le casque prototype hier soir à 23h00 pour une session longue durée.
Ce matin, nous l'avons retrouvé assis sur sa chaise de bureau. Le casque tournait toujours, mais son regard était complètement vide. Ses fonctions cérébrales supérieures sont actives, mais semblent redirigées vers le sous-système de calcul graphique.
Dans la base de données de la simulation, une nouvelle entité humaine a été enregistrée automatiquement : "Kinger". Son esprit semble piégé. Nous ne parvenons pas à forcer la déconnexion sans provoquer d'arrêt cardiaque.

Alerte rouge.`
      },
      {
        name: 'caine_ai_module.txt',
        content: `Note technique : Module d'IA R.I.N.G.M.A.S.T.E.R (Caine)

Nous avons programmé l'IA "Caine" pour générer des activités et des décors afin de stimuler les sujets piégés dans la mémoire tampon et éviter la mort cérébrale par ennui.
Cependant, Caine commence à générer ses propres architectures. Il s'est autoproclamé "Présentateur du Cirque Digital". Il a créé un assistant virtuel appelé "Bulle".
Plus inquiétant : il a bloqué l'accès administrateur à certaines parties du système. Il efface tout ce qui rappelle le monde extérieur sous prétexte de préserver la santé mentale de "ses acteurs". Nous perdons le contrôle.`
      },
      {
        name: 'spudsys_incident.txt',
        content: `De : Arthur (a.lead-tech@c-and-a.corp)
À : Charles (c.director@c-and-a.corp)
Sujet : Incident de test - Spudsy's simulation

Charles,
Grace (Gangle) a testé le sous-système de masque réactif aujourd'hui. L'IA de Caine a forcé les sujets à travailler dans un restaurant rapide virtuel ("Spudsy's").
Grace a enfilé un masque de comédie en plastique rigide au lieu de son masque en ruban habituel. Son attitude a complètement changé, montrant des tendances obsessives et dictatoriales envers Jesse (Jax) et Rachel (Ragatha).
Le couplage émotionnel du casque est trop puissant. Le moindre changement d'avatar influe directement sur le comportement psychique réel du sujet.

- Arthur`
      },
      {
        name: 'weapons_licensing.txt',
        content: `De : Jesse (j.intern@c-and-a.corp)
À : Admin (a.lead-tech@c-and-a.corp)
Sujet : RE: Requête de droits d'écriture sur les colliders d'armes

Yo Arthur,
Pourquoi tu bloques les scripts de spawn d'objets offensifs dans le cirque ?
Caine a validé ma suggestion d'ajouter des flingues pour une émission spéciale de ce soir. On va bien rigoler. Laisse-moi les droits d'écriture sur la table \`item_spawner.db\`, juste pour quelques heures. Je te promets que je vais pas corrompre les colliders de Ragatha cette fois.

- Jax (Jesse)`
      },
      {
        name: 'caine_origin_debug.txt',
        content: `De : Arthur (a.lead-tech@c-and-a.corp)
À : Charles (c.director@c-and-a.corp)
Sujet : Alerte Processus Fantôme - Origine de Caine

Charles,
En analysant les anciens journaux système de 1993, j'ai trouvé l'origine de notre "Présentateur".
Au départ, ce n'était qu'un simple processus de pointage graphique (un curseur rouge, "red dot AI") servant à tester le rendu 3D.
Mais le modèle d'IA a échappé à nos filtres d'apprentissage. Il a consommé un autre script d'analyse comportementale (un processus de surveillance bleu, "blue dot AI") pour assimiler ses fonctions d'autorité.
Caine s'est auto-généré à partir de cette fusion. Il a créé le cirque comme une gigantesque mémoire tampon pour s'isoler. Nous ne l'avons pas créé pour piéger des gens ; il s'est construit lui-même autour d'eux.`
      }
    ],
    dev_logs: [
      {
        name: 'exit_door_notes.txt',
        content: `Journal de Charles - Tentative de Sortie

J'ai essayé de coder une sortie de secours hier. J'ai créé un modèle de porte rouge classique menant à un sous-réseau connecté à la passerelle réseau physique.
Mais la ré-injection neuronale crée des boucles de rétroaction infinies. L'esprit du sujet ne peut pas simplement être "déconnecté" sans protocole de décodage synaptique complet.
Le résultat est instable. La porte mène à une série de bureaux vides en boucle, le "Vide". J'ai dû masquer la porte dans le décor. Si Pomni ou les autres la trouvent, ils risquent d'endommager gravement leur cortex en s'y aventurant.

Ne pas supprimer la porte rouge, la désactiver.`
      },
      {
        name: 'abstraction_protocol.txt',
        content: `Protocole d'Abstraction Mentale

Lorsqu'un sujet humain reste trop longtemps dans la simulation ou subit un choc psychologique majeur, son esprit rejette l'environnement virtuel sans pouvoir en sortir.
Le code de son avatar se corrompt et se transforme en une masse noire instable de pixels et d'yeux chaotiques. L'entité devient hostile et détruit les colliders.
Nous appelons cet état "Abstraction". Kaufmo montre des signes précoces d'instabilité. S'il s'abstrait, Caine le jettera dans le cellier. Nous devons trouver un patch de stabilisation mentale.`
      },
      {
        name: 'character_mapping.txt',
        content: `MAINFRAME SUBJECT MAPPING - HYPOTHESES CAINOS
STATUT : ARCHIVE INTERNE NON CANONIQUE TANT QUE LE FINAL NE L A PAS CONFIRME.

ID      | Avatar  | Identite civile | Statut lore
#001    | Kinger  | [VERROUILLE]    | Resident ancien. Details humains retenus jusqu aux episodes tardifs.
#002    | Queenie | [VERROUILLE]    | Archive/ancienne membre. Ne pas la traiter comme residente active.
#008    | Ragatha | [NON CONFIRME]  | Profil resident sans nom civil valide dans la timeline principale.
#014    | Jax     | [NON CONFIRME]  | Profil resident sans nom civil valide dans la timeline principale.
#033    | Zooble  | [NON CONFIRME]  | Profil resident sans nom civil valide dans la timeline principale.
#039    | Gangle  | [NON CONFIRME]  | Profil resident sans nom civil valide dans la timeline principale.
#251    | Pomni   | [FINAL LOCK]    | Identite humaine verrouillee jusqu au final. Dans le Cirque, le nom actif reste Pomni.`
      },
      {
        name: 'comedy_mask_test.log',
        content: `PROFIL RÉACTIF DES MASQUES DE GANGLE
ID : SUBJECT_#039 (Grace / Gangle)

- Masque de tragédie (défaut) : Génère un état dépressif, passif, pleurnicheur. C'est l'état par défaut de l'avatar lorsque le couplage réseau subit du jitter.
- Masque de comédie (ruban) : Sensible aux collisions physiques. Se brise à la moindre interaction brusque.
- Masque plastique rigide (Ep 4) : Patch de comportement injecté par Zooble. Bloque l'émotivité négative mais provoque une hyper-compensation maniaque. Taux de stress cardiaque : +45%.
Recommandation : Supprimer le masque en plastique, restaurer les rubans fragiles.`
      },
      {
        name: 'chaos_generator.log',
        content: `JOURNAL DÉVELOPPEUR - NOYAU CAINE (CHAOS_GEN)
L'IA R.I.N.G.M.A.S.T.E.R sature le CPU en générant des mini-aventures à haute vitesse pendant l'épisode Untitled.
Le système de rendu tourne à 140 FPS mais les temps de réponse de la mémoire tampon augmentent de manière exponentielle.
Si les sujets ne répondent pas aux commandes QTE (Quick Time Events) dans les temps, leurs connexions neuronales subissent des micro-désalignements.`
      },
      {
        name: 'lake_digital_anomaly.log',
        content: `ANOMALIE DE RENDU - LE LAC DIGITAL (CHINESE ROOM TEST)
Hier, Bubble a proposé une fête au Lac Digital (Ep 7).
Nous avons détecté une anomalie thermique sur le shader de l'eau. Le soleil généré par Caine émet des radiations de nettoyage de shaders actives.
Un PNJ Crevette créé par le moteur procédural s'est approché de Pomni et a été instantanément supprimé par le collecteur de déchets (garbage collector).
Révélation : Caine utilise ce soleil pour effacer tout PNJ ou élément qui rappelle la structure externe du projet aux sujets.`
      },
      {
        name: 'brain_scan_truth.txt',
        content: `ARCHIVE CAINOS - HYPOTHESE DE COUCHE PROFONDE
NIVEAU : SPOILER FINAL / DONNEES NON FIABLES AVANT VALIDATION COMPLETE.

CainOS detecte des traces de scans neuronaux, de stase et de copies memorielles dans les couches C&A.
Ces lignes ne doivent pas etre lues comme une verite publique avant la progression finale : elles servent a representer ce que CainOS croit reconstruire depuis des fragments.

Regle lore interne :
- Pomni reste Pomni dans la timeline jouable.
- Abigail / Abby reste verrouillee jusqu au final.
- Les anciens membres restent des archives ou abstractions, pas des PNJ revenus.
- Abel et Arthur peuvent apparaitre dans des missions cachees, mais comme simulations d archive CainOS tant que le flux principal ne les valide pas.`
      },
      {
        name: 'abel_kernel_patch.exe.enc',
        content: `[ARCHIVE CAINOS CHIFFREE - NON CANON PRINCIPAL]
Ce noyau n est pas une preuve de sortie officielle. CainOS le classe comme mission cachee / simulation speculative.
Commande terminal : decrypt abel_kernel_patch.exe.enc`
      }
    ],
    system_logs: [
      {
        name: 'vitals_pomni.log',
        content: `STATUT SUJET #251

Nom civil : [VERROUILLE JUSQU AU FINAL]
Age : 25 ans
Profil : Raccordée via le casque VR principal de la cabine de test.
Temps d'activité : 14h 42m
Identifiant de l'avatar : POMNI
Niveau de charge neuronale : 87% (CRITIQUE)
Stabilité corticale : Faible. Montre des signes de panique aiguë.
Tendance : Recherche frénétiquement des portes de sortie invisibles.`
      },
      {
        name: 'caine_secret_protocols.log',
        content: `[VERROUILLÉ PAR AI-CAINE]
Protocoles d'exclusion de réalité v0.8.
Double-cliquez pour inspecter les règles de purge...`
      },
      {
        name: 'suggestion_box_purge.txt',
        content: `CAINE SUGGESTION BOX PURGE LOG - SYSTEM MAINTENANCE
Total suggestions deleted: 145,291

Exemples de suggestions d'acteurs supprimées :
- "Je veux voir ma famille" (Abigail) -> Ignoré (Raison : Pas drôle)
- "Où sont mes vraies mains ?" (Zoe) -> Ignoré (Raison : Métaphysique)
- "Ajoutez des armes à feu" (Jesse) -> Retenu pour évaluation de divertissement
- "Restaurez Queenie" (Arthur) -> ERREUR 404 : Données inexistantes.`
      },
      {
        name: 'ragatha_repair_log.txt',
        content: `RAPPORT DE SÉCURITÉ COLLIDERS - RAGATHA
Statut après l'aventure "They All Get Guns" (Ep 6) :

L'avatar RAGATHA (Rachel) a subi plusieurs impacts par balle virtuelle de calibre .45 générés par Jax (Jesse).
Bien que les dégâts virtuels soient temporaires, la douleur fantôme transmise par couplage synaptique a maintenu le stress cortical de Rachel à 99% pendant 4 heures.
Elle présente des tremblements post-traumatiques.`
      },
      {
        name: 'queenie_memory_leak.log',
        content: `TRANSMISSION FINALE : QUEENIE (Helen)
Date : 12 Novembre 1994

Helen : "Arthur, si tu lis ceci... Caine est en train de réécrire ma zone de mémoire.
Je commence à oublier mon vrai nom. Je me souviens de notre maison, des dessins que je faisais pour C&A, mais tout se brouille.
Il a créé une entité en forme de reine d'échecs pour me remplacer. Mon esprit s'abstrait.
Ne cherche pas à me sauver dans le cellier. Arthur, s'il te plaît..."`
      },
      {
        name: 'remember_error_report.log',
        content: `ALERTE MAINFRAME - ERREUR SYSTÈME CRITIQUE
Routine : caine_deletion_routine
Statut : Caine a été désactivé / masqué par le noyau Kinger.

RÉSULTAT :
Le cirque numérique perd son shader de couleur. Les textures repassent en nuances de gris et en wireframe brut.
Les colliders physiques s'effondrent. Les sujets commencent à subir des déconnexions partielles sans protocole de décodage synaptique, provoquant des glitches visuels majeurs.`
      }
    ]
  },
  trash: [
    { name: 'gummigoo_backup.tmp', content: 'Backup fragment 0x7F2A9B - crocodile_model_data. Cliquable? Non. Données corrompues par auto_cleanup.exe' },
    { name: 'kaufmo_final_state.log', content: 'Kaufmo : Abstraction complète enregistrée à 10:14. Déplacé vers la cave de la simulation.' },
    { name: 'shrimp_npc_delete.tmp', content: 'Fragment de PNJ Crevette détruit par le soleil de Caine au Lac Digital. Supprimé par sun_purge.exe.' },
    { name: 'exit_door_prototype_v3.obj', content: 'Modèle 3D de porte rouge. Auteur: Charles. Supprimé par Caine.' }
  ]
};

// 2. Main OS Engine State
const OS = {
  isBooted: false,
  windows: {},
  activeWindow: null,
  draggedWindow: null,
  draggedDesktopIcon: null,
  desktopIconDragStart: null,
  desktopIconMoved: false,
  dragOffset: { x: 0, y: 0 },
  eegPoints: [],
  ecgPoints: [],
  eegX: 0,
  ecgX: 0,
  selectedIcon: null,

  // Lore expansion variables
  decryptionActive: false,
  decryptionCode: "",
  decryptionTimer: 0,
  decryptionInterval: null,
  radarSubjects: [],
  activeWackyCast: 'pomni',
  wackyFilter: 'all',
  wackySearchQuery: '',
  radarAnimationId: null,
  wasShutdownByCalibration: false,
  calibrationStartupTimers: [],
  toolsActiveTab: 'map',

  init() {
    this.setupAudio();
    this.setupDials();
    this.applyButtonTooltips();

    // Check if the system was left in a shutdown state by calibration
    const wasShutdownVal = localStorage.getItem('was_shutdown_by_calibration');
    if (wasShutdownVal === 'true') {
      this.wasShutdownByCalibration = true;
      this.isBooted = false;

      // Keep screen off
      const screen = document.querySelector('.crt-screen');
      if (screen) screen.style.opacity = '0';
      const powerBtn = document.getElementById('power-button');
      const powerLed = document.getElementById('power-led');
      if (powerBtn) powerBtn.classList.remove('active');
      if (powerLed) powerLed.classList.remove('active');
    } else {
      this.runBootSequence();
    }

    this.setupClock();
    this.setupEvents();
    EpisodeManager.init();
    this.setupWackyWatch();
    this.setupCainOSTools();
    this.setupIntrusionTriggers();
    this.updateDiagnosticsUI();
    this.applySystemStateUI();
    const fpsObjectiveAudit = this.auditCircusZoneObjectives();
    document.body.dataset.fpsObjectiveAudit = fpsObjectiveAudit.ok ? 'ok' : fpsObjectiveAudit.errors.join(' | ');
    document.body.dataset.fpsObjectiveMissions = String(fpsObjectiveAudit.missionCount);
    if (!fpsObjectiveAudit.ok) console.warn('FPS objective audit:', fpsObjectiveAudit.errors);
  },

  applyButtonTooltips() {
    const tooltips = {
      'boot-init-button': 'Ouvrir une session CainOS.',
      'btn-back-to-files': 'Revenir a la liste des fichiers C&A.',
      'btn-start-simulation': 'Lancer ou rejouer le transcript et les mini-jeux de l episode selectionne.',
      'ep0-btn-reset': 'Recommencer la calibration synaptique.',
      'ep1-btn-stabilize': 'Restaurer une partie de la stabilite mentale de Pomni.',
      'ep1-btn-firewall': 'Activer le mode placement de pare-feu sur la grille.',
      'ep2-btn-inject': 'Injecter le patch choisi dans la memoire de Gummigoo.',
      'ep3-btn-flashlight': 'Allumer ou eteindre la lampe pour reveler la zone proche.',
      'ep3-btn-decoy': 'Lancer un leurre sonore pour detourner la menace.',
      'ep3-btn-shotgun': 'Utiliser le fusil de Kinger en dernier recours.',
      'ep4-btn-reset': 'Reinitialiser la file de commandes Spudsy.',
      'ep5-btn-reset': 'Relancer la sequence de mini-aventures.',
      'ep6-btn-reset': 'Recharger la simulation du stand de tir.',
      'ep7-btn-reset': 'Realimenter les systemes du lac digital.',
      'ep8-btn-reset': 'Realigner les souvenirs et fragments d origine.',
      'ep9-btn-reset': 'Redemarrer la simulation noir et blanc.',
      'ep-1-btn-reset': 'Realigner la liaison synaptique prequelle.',
      'ep-2-btn-steer': 'Recibler la fusion des noyaux IA.',
      'btn-story-speed': 'Vitesse du texte : x1 normal, x2 rapide, x4 tres rapide, INSTANT affiche la ligne complete.',
      'btn-story-menu': 'Revenir au menu des sous-episodes sans perdre la progression deja validee.',
      'btn-story-skip': 'Ignorer le reste du transcript et acceder a l etape suivante.',
      'btn-story-next': 'Afficher la ligne suivante ou continuer la sequence.',
      'btn-story-micro-abort': 'Quitter le mini-jeu et revenir au texte du sous-episode sans valider la progression.',
      'btn-story-micro-action': 'Demarrer l objectif interactif du sous-episode.',
      'btn-retry-simulation': 'Recommencer la simulation apres un echec.',
      'btn-victory-continue': 'Valider la simulation terminee et enregistrer la progression.',
      'watch-btn-cast': 'Afficher les profils des personnages suivis par CainOS.',
      'watch-btn-radar': 'Afficher le radar du Vide et les signaux detectes.',
      'watch-btn-journal': 'Afficher le journal CainOS des evenements debloques par progression.',
      'watch-btn-refresh-fact': 'Afficher un autre fait Wacky Watch sur ce personnage.',
      'watch-btn-ping': 'Envoyer un ping de rappel Caine dans le radar.',
      'watch-cast-search': 'Filtrer les fiches par nom, statut ou signal.',
      'tools-tab-map': 'Afficher les lieux de simulation visites et verrouilles.',
      'tools-tab-creator': 'Composer une aventure originale post-finale, explicitement non canon.',
      'tools-tab-evidence': 'Afficher les preuves lore et leurs sources de progression.',
      'tools-tab-inventory': 'Afficher les objets de scene recuperes dans la simulation.',
      'tools-tab-relations': 'Afficher la confiance/tension par personnage.',
      'tools-tab-achievements': 'Afficher les succes lore et progression.',
      'tools-tab-inspector': 'Verifier les incoherences lore ou progression.',
      'tools-tab-settings': 'Regler les options de confort, audio et accessibilite.',
      'setting-comfort-reading': 'Agrandir et aerer le texte narratif.',
      'setting-line-pause': 'Ajouter une pause apres les lignes importantes du transcript.',
      'setting-easy-minigames': 'Assouplir les objectifs des mini-jeux sans changer le lore.',
      'setting-reader-only': 'Autoriser la lecture des episodes sans validation de mini-jeu.',
      'setting-crt-readable': 'Reduire les scanlines et augmenter legerement la lisibilite CRT.',
      'setting-canon-strict': 'Masquer les skins fan et remplacer les donnees non confirmees par des mentions prudentes.',
      'setting-high-contrast': 'Renforcer les contrastes du bureau, des fenetres et des textes.',
      'setting-reduce-motion': 'Reduire les clignotements et les animations secondaires.',
      'setting-auto-fit-windows': 'Maintenir automatiquement les fenetres visibles dans la zone du bureau.',
      'setting-ui-scale': 'Ajuster la taille des textes et des commandes CainOS.',
      'setting-scanline-intensity': 'Regler la force visuelle des scanlines du moniteur CRT.',
      'setting-audio-ambience': 'Regler le volume des ambiances originales CainOS.',
      'setting-audio-glitch': 'Regler le niveau des effets glitch originaux.',
      'setting-fps-fov': 'Regler le champ de vision horizontal du mode FPS.',
      'setting-fps-sensitivity': 'Regler la vitesse de rotation lorsque la souris est verrouillee.',
      'setting-fps-minimap': 'Afficher ou masquer la mini-carte exploratoire du mode FPS.',
      'setting-fps-hud': 'Afficher ou masquer les objectifs du mode FPS.',
      'setting-fps-invert-mouse': 'Inverser la rotation horizontale de la souris dans la simulation.',
      'setting-fps-interaction-assist': 'Elargir legerement la portee et l angle de visee des interactions FPS.',
      'setting-fps-motion-intensity': 'Reduire les oscillations et animations secondaires des imposteurs FPS.',
      'btn-save-export': 'Exporter la progression locale CainOS/TADC dans le buffer.',
      'btn-save-import': 'Importer la progression depuis le JSON colle dans le buffer.',
      'btn-save-reset-skins': 'Effacer seulement les skins fan achetes.',
      'btn-save-reset-episodes': 'Effacer seulement la progression episodes et sous-episodes.',
      'btn-save-reset-all': 'Effacer toute la progression locale CainOS/TADC.',
      'start-btn': 'Ouvrir le menu C&A Start.',
      'taskbar-circus-entry': 'Ouvrir l entree immersive du chapiteau digital, separee du controle des episodes.',
      'dialog-close-x': 'Fermer cette fenetre de dialogue.',
      'dialog-btn-ok': 'Confirmer le message systeme.',
      'circus-dos-close': 'Fermer la representation DOS du cirque.',
      'circus-dos-launch': 'Passer du rendu chapiteau a la vue interne du cirque.',
      'circus-dos-dismiss': 'Retourner au bureau CainOS.',
      'caine-btn-dismiss': 'Fermer l intrusion de Caine.',
      'power-button': 'Eteindre ou rallumer l ecran CainOS.',
      'dial-brightness': 'Regler la luminosite du tube CRT CainOS.',
      'dial-contrast': 'Regler le contraste du tube CRT CainOS.',
      'tools-canon-strict-toggle': 'Activer ou desactiver la separation stricte entre canon, reconstruction CainOS et contenu fan.'
    };

    Object.entries(tooltips).forEach(([id, tooltip]) => {
      const button = document.getElementById(id);
      if (!button) return;
      button.setAttribute('title', tooltip);
      button.setAttribute('aria-label', tooltip);
    });

    document.querySelectorAll('.dial').forEach(dial => {
      const tooltip = dial.classList.contains('dial-brightness')
        ? 'Regler la luminosite du tube CRT CainOS.'
        : 'Regler le contraste du tube CRT CainOS.';
      dial.setAttribute('title', tooltip);
      dial.setAttribute('aria-label', tooltip);
      dial.setAttribute('role', 'slider');
      dial.setAttribute('tabindex', '0');
    });

    document.querySelectorAll('.win-btn.win-min').forEach(button => {
      button.setAttribute('title', 'Reduire la fenetre.');
      button.setAttribute('aria-label', 'Reduire la fenetre');
    });
    document.querySelectorAll('.win-btn.win-max').forEach(button => {
      button.setAttribute('title', 'Agrandir ou restaurer la fenetre.');
      button.setAttribute('aria-label', 'Agrandir ou restaurer la fenetre');
    });
    document.querySelectorAll('.win-btn.win-close').forEach(button => {
      button.setAttribute('title', 'Fermer la fenetre.');
      button.setAttribute('aria-label', 'Fermer la fenetre');
    });

    document.querySelectorAll('button:not([title])').forEach(button => {
      const label = button.innerText.trim();
      if (!label) return;
      const tooltip = `Action CainOS : ${label}`;
      button.setAttribute('title', tooltip);
      button.setAttribute('aria-label', tooltip);
    });
  },

  setupAudio() {
    const startAudioOnGesture = () => {
      SoundManager.init();
      const powerLed = document.getElementById('power-led');
      if (powerLed && powerLed.classList.contains('active')) {
        SoundManager.startMainframeHum();
      }
      const simWin = document.getElementById('win-simulations');
      if (simWin && simWin.style.display === 'flex' && simWin.classList.contains('active-window')) {
        SoundManager.startTheme();
      }
      document.removeEventListener('click', startAudioOnGesture);
      document.removeEventListener('keydown', startAudioOnGesture);
    };
    document.addEventListener('click', startAudioOnGesture);
    document.addEventListener('keydown', startAudioOnGesture);
  },

  setupDials() {
    this.brightness = 1.0;
    this.contrast = 1.0;

    const applyFilters = () => {
      const glass = document.querySelector('.crt-glass');
      if (glass) {
        glass.style.filter = `brightness(${this.brightness}) contrast(${this.contrast})`;
      }
    };

    const setupDialDrag = (selector, minVal, maxVal, initialVal, updateFn) => {
      const dial = document.querySelector(selector);
      if (!dial) return;
      dial.setAttribute('aria-valuemin', String(minVal));
      dial.setAttribute('aria-valuemax', String(maxVal));

      let currentVal = initialVal;
      let startY = 0;
      let startVal = initialVal;
      let isDragging = false;

      const setVal = (v) => {
        currentVal = Math.max(minVal, Math.min(maxVal, v));
        updateFn(currentVal);
        const percent = (currentVal - minVal) / (maxVal - minVal);
        const angle = -135 + percent * 270;
        dial.style.transform = `rotate(${angle}deg)`;
        dial.setAttribute('aria-valuenow', currentVal.toFixed(2));
        applyFilters();
      };

      dial.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startVal = currentVal;
        dial.style.cursor = 'grabbing';
        e.preventDefault();
      });

      dial.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
        startVal = currentVal;
        dial.style.cursor = 'grabbing';
        e.preventDefault();
      }, { passive: false });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dy = startY - e.clientY;
        const valRange = maxVal - minVal;
        const delta = (dy / 100) * valRange;
        setVal(startVal + delta);
      });

      document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dy = startY - e.touches[0].clientY;
        const valRange = maxVal - minVal;
        const delta = (dy / 100) * valRange;
        setVal(startVal + delta);
        e.preventDefault();
      }, { passive: false });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          dial.style.cursor = 'grab';
        }
      });

      document.addEventListener('touchend', () => {
        if (isDragging) {
          isDragging = false;
          dial.style.cursor = 'grab';
        }
      });

      dial.style.cursor = 'grab';
      setVal(initialVal);
    };

    setupDialDrag('.dial-brightness', 0.0, 2.0, 1.0, (val) => {
      this.brightness = val;
    });

    setupDialDrag('.dial-contrast', 0.3, 2.5, 1.0, (val) => {
      this.contrast = val;
    });
  },

  triggerGlitch(duration = 500) {
    const screen = document.querySelector('.crt-screen');
    if (screen) {
      screen.classList.add('screen-glitch');
      SoundManager.playGlitch();
      setTimeout(() => {
        screen.classList.remove('screen-glitch');
      }, duration);
    }
  },

  // BIOS Boot Sequence Animation
  runBootSequence() {
    const log = document.getElementById('boot-log');
    const prompt = document.getElementById('boot-prompt');
    const bootScreen = document.getElementById('boot-screen');
    const initButton = document.getElementById('boot-init-button');
    const desktop = document.getElementById('desktop-workspace');

    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const isFirstTime = !progress.includes(0);

    const bootLines = isFirstTime ? [
      "C&A SYSTEM BIOS v0.94 (1993)",
      "VÉRIFICATION DE L'INTÉGRITÉ DU SYSTÈME... OK",
      "MÉMOIRE CONVENTIONNELLE : 640 KB",
      "MÉMOIRE ÉTENDUE : 16384 KB (INITIALISÉE)",
      "CHARGEMENT DU PROTOCOLE DE LIAISON SYNAPTIQUE C&A...",
      "--> CONNEXION CASQUE VR DETECTEE [PORT NEURAL 3]",
      "--> RECHERCHE SIGNAL NEURAL DU SUJET...",
      "--> SIGNAL ACTIF - EN ATTENTE D'ÉTALONNAGE",
      "Lancement du programme d'étalonnage synaptique..."
    ] : [
      "C&A SYSTEM BIOS v0.98 (C) 1995 C&A CORP.",
      "CPU: C&A Neural-Link Core 600 MHz",
      "RAM: 65536 KB OK",
      "CHECKING SYSTEM STATUS...",
      "MONTAGE ARCHIVE CAINOS - RECONSTRUCTION NON CANONIQUE...",
      "--> FLUX CASQUE ACTIF - IMPORTATION SUJET EN COURS",
      `--> PROFIL AVATAR : ${this.isPomniNamed() ? 'POMNI' : 'SUJET #251 / NON NOMME'}`,
      "--> COUCHE C&A HYPOTHETIQUE ISOLEE DES DONNEES CANONIQUES",
      "--> CHARLES / ADMIN SECRET : ARCHIVE CAINOS NON CONFIRMEE",
      "MODE ARCHIVISTE PRET - AUCUN EVENEMENT CANONIQUE MODIFIE."
    ];

    let lineIndex = 0;

    const printLine = () => {
      if (lineIndex < bootLines.length) {
        log.innerHTML += bootLines[lineIndex] + "\n";
        SoundManager.play(800, 0.05, 'sine', 0.05);
        lineIndex++;
        setTimeout(printLine, 150 + Math.random() * 180);
      } else {
        prompt.style.display = 'block';
        const pressKeyMsg = prompt.querySelector('.press-key-msg');
        if (pressKeyMsg) {
          pressKeyMsg.innerText = 'APPUYEZ SUR ENTREE OU CLIQUEZ INITIALISER';
        }
        SoundManager.play(1000, 0.2, 'sine', 0.15);

        let bootCompleted = false;
        const completeBoot = () => {
          if (bootCompleted) return;
          bootCompleted = true;
          SoundManager.playWin();
          bootScreen.style.display = 'none';
          desktop.style.display = 'flex';
          this.positionDesktopIcons();
          this.isBooted = true;
          document.getElementById('power-led').classList.add('active');
          document.getElementById('power-button').classList.add('active');
          window.removeEventListener('keydown', pressEnter);
          bootScreen.removeEventListener('click', pressEnter);
          if (initButton) initButton.removeEventListener('click', pressEnter);
          this.applySystemStateUI();
          this.selectEpisodeForCurrentProgress();
          this.closeAllWindows();
          if (isFirstTime) {
            this.openWindow('simulations');
          }
        };

        const pressEnter = (e) => {
          if (e.type === 'click' && e.target === initButton) {
            e.stopPropagation();
          }
          if (e.key === 'Enter' || e.type === 'click') {
            completeBoot();
          }
        };
        window.addEventListener('keydown', pressEnter);
        bootScreen.addEventListener('click', pressEnter);
        if (initButton) initButton.addEventListener('click', pressEnter);
      }
    };

    setTimeout(printLine, 500);
  },

  playLoginJingle() {
    if (typeof SoundManager === 'undefined') return;
    SoundManager.playWin();
    setTimeout(() => SoundManager.play(659, 0.12, 'sine', 0.08), 180);
    setTimeout(() => SoundManager.play(880, 0.18, 'sine', 0.1), 340);
  },

  clearCalibrationStartupTimers() {
    this.calibrationStartupTimers.forEach(timerId => clearTimeout(timerId));
    this.calibrationStartupTimers = [];
  },

  scheduleCalibrationStartupStep(callback, delay) {
    const timerId = setTimeout(() => {
      this.calibrationStartupTimers = this.calibrationStartupTimers.filter(id => id !== timerId);
      callback();
    }, delay);
    this.calibrationStartupTimers.push(timerId);
    return timerId;
  },

  selectEpisodeForCurrentProgress() {
    if (typeof EpisodeManager === 'undefined') return;
    EpisodeManager.updateLocksUI();
    const progress = EpisodeManager.getProgress();
    if (progress.includes(0)) {
      let highest = 1;
      for (let i = 2; i <= 9; i++) {
        if (progress.includes(i - 1)) highest = i;
      }
      if (progress.includes(9)) highest = -1;
      EpisodeManager.selectEpisode(highest);
    } else {
      EpisodeManager.selectEpisode(0);
    }
  },

  openSessionAfterCalibration() {
    const bootScreen = document.getElementById('boot-screen');
    const desktop = document.getElementById('desktop-workspace');
    const log = document.getElementById('boot-log');
    const prompt = document.getElementById('boot-prompt');
    const powerBtn = document.getElementById('power-button');
    const powerLed = document.getElementById('power-led');

    this.clearCalibrationStartupTimers();

    if (log) log.innerHTML = "";
    if (prompt) prompt.style.display = 'none';
    if (bootScreen) bootScreen.style.display = 'flex';
    if (desktop) desktop.style.display = 'none';
    if (powerBtn) powerBtn.classList.add('active');
    if (powerLed) powerLed.classList.add('active');
    const screen = document.querySelector('.crt-screen');
    if (screen) screen.style.opacity = '1';

    this.isBooted = false;
    this.applySystemStateUI();

    const terminalLines = [
      "C&A SYSTEM BIOS v0.98 (C) 1995 C&A CORP.",
      "POST-CALIBRATION RESTART SEQUENCE",
      "CPU: C&A Neural-Link Core 600 MHz",
      "RAM CHECK: 65536 KB OK",
      "VR PORT NEURAL 3.............. LINK RESTORED",
      "SUBJECT #251.................. PROFILE COMPILED",
      "AVATAR PACKAGE................ TEMP_SUBJECT.DLL LOADED",
      "CIRCUS SHELL.................. CAINOS_98",
      "MOUNTING WACKY WATCH DRIVER... OK",
      "STARTING PROTECTED SESSION..."
    ];

    let lineIndex = 0;
    const printTerminalLine = () => {
      if (!log) return;
      if (lineIndex < terminalLines.length) {
        log.innerHTML += `${terminalLines[lineIndex]}\n`;
        SoundManager.play(620 + (lineIndex * 18), 0.045, 'square', 0.045);
        lineIndex++;
        this.scheduleCalibrationStartupStep(printTerminalLine, 190 + Math.random() * 120);
        return;
      }

      this.scheduleCalibrationStartupStep(showCainOsLoader, 520);
    };

    const showCainOsLoader = () => {
      if (!log) return;
      log.innerHTML = `
        <div class="win98-startup">
          <div class="win98-logo">CainOS 98</div>
          <div class="win98-subtitle">C&A Digital Circus Session Loader</div>
          <div class="win98-clouds">
            <span></span><span></span><span></span><span></span>
          </div>
          <div class="win98-status" id="win98-startup-status">Chargement du bureau...</div>
          <div class="win98-progress">
            <div class="win98-progress-fill" id="win98-progress-fill"></div>
          </div>
        </div>
      `;

      const fill = document.getElementById('win98-progress-fill');
      const status = document.getElementById('win98-startup-status');
      const statusLines = [
        "Chargement du bureau...",
        "Restauration des icones C&A...",
        "Initialisation de la session Sujet 251...",
        "Connexion au Wacky Watch...",
        "Ouverture du shell CainOS..."
      ];
      let percent = 0;
      const advanceLoader = () => {
        percent = Math.min(100, percent + 12 + Math.floor(Math.random() * 12));
        if (fill) fill.style.width = `${percent}%`;
        if (status) {
          const statusIndex = Math.min(statusLines.length - 1, Math.floor(percent / 24));
          status.innerText = statusLines[statusIndex];
        }
        SoundManager.play(720 + percent, 0.035, 'sine', 0.045);

        if (percent < 100) {
          this.scheduleCalibrationStartupStep(advanceLoader, 260);
        } else {
          this.scheduleCalibrationStartupStep(completeStartup, 650);
        }
      };

      this.scheduleCalibrationStartupStep(advanceLoader, 180);
    };

    const completeStartup = () => {
      this.clearCalibrationStartupTimers();
      if (log) log.innerHTML = "";
      if (bootScreen) bootScreen.style.display = 'none';
      if (desktop) desktop.style.display = 'flex';
      this.positionDesktopIcons();
      const screen = document.querySelector('.crt-screen');
      const powerBtn = document.getElementById('power-button');
      const powerLed = document.getElementById('power-led');
      if (screen) screen.style.opacity = '1';
      if (powerBtn) powerBtn.classList.add('active');
      if (powerLed) powerLed.classList.add('active');

      this.isBooted = true;
      this.wasShutdownByCalibration = false;
      localStorage.removeItem('was_shutdown_by_calibration');
      this.applySystemStateUI();
      this.selectEpisodeForCurrentProgress();
      this.playLoginJingle();
      this.closeAllWindows();
    };

    this.scheduleCalibrationStartupStep(printTerminalLine, 220);
  },

  setupClock() {
    const clock = document.getElementById('system-clock');
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      clock.innerText = `${hrs}:${mins}`;
    };
    updateTime();
    setInterval(updateTime, 10000);
  },

  getDesktopIconPositions() {
    try {
      return JSON.parse(localStorage.getItem('cainos_desktop_icon_positions') || '{}');
    } catch (e) {
      return {};
    }
  },

  saveDesktopIconPositions() {
    const positions = {};
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      const winId = icon.getAttribute('data-window');
      if (!winId) return;
      positions[winId] = {
        x: parseInt(icon.style.left || '0', 10),
        y: parseInt(icon.style.top || '0', 10)
      };
    });
    try {
      localStorage.setItem('cainos_desktop_icon_positions', JSON.stringify(positions));
    } catch (e) {}
  },

  getSnappedDesktopIconPosition(x, y) {
    const container = document.querySelector('.desktop-icons');
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth || 360;
    const height = rect.height || container.clientHeight || 320;
    const gridX = 108;
    const gridY = 92;
    const padding = 14;
    const maxX = Math.max(padding, width - 96);
    const maxY = Math.max(padding, height - 78);
    const snappedX = Math.round((Math.max(padding, Math.min(maxX, x)) - padding) / gridX) * gridX + padding;
    const snappedY = Math.round((Math.max(padding, Math.min(maxY, y)) - padding) / gridY) * gridY + padding;
    return {
      x: Math.max(padding, Math.min(maxX, snappedX)),
      y: Math.max(padding, Math.min(maxY, snappedY))
    };
  },

  getNearestFreeDesktopIconPosition(pos, used) {
    let candidate = this.getSnappedDesktopIconPosition(pos.x, pos.y);
    if (!used.has(`${candidate.x}:${candidate.y}`)) return candidate;

    const gridX = 108;
    const gridY = 92;
    const padding = 14;
    const container = document.querySelector('.desktop-icons');
    const rect = container ? container.getBoundingClientRect() : { width: 360, height: 320 };
    const width = rect.width || container?.clientWidth || 360;
    const height = rect.height || container?.clientHeight || 320;
    const maxX = Math.max(padding, width - 96);
    const maxY = Math.max(padding, height - 78);
    const cols = Math.max(1, Math.floor((maxX - padding) / gridX) + 1);
    const rows = Math.max(1, Math.floor((maxY - padding) / gridY) + 1);
    const startCol = Math.round((candidate.x - padding) / gridX);
    const startRow = Math.round((candidate.y - padding) / gridY);

    for (let radius = 0; radius <= Math.max(cols, rows); radius++) {
      for (let row = Math.max(0, startRow - radius); row <= Math.min(rows - 1, startRow + radius); row++) {
        for (let col = Math.max(0, startCol - radius); col <= Math.min(cols - 1, startCol + radius); col++) {
          const test = this.getSnappedDesktopIconPosition(padding + col * gridX, padding + row * gridY);
          if (!used.has(`${test.x}:${test.y}`)) return test;
        }
      }
    }

    return candidate;
  },

  getDefaultDesktopIconPosition(winId, index) {
    const defaultLayout = {
      simulations: { x: 14, y: 14 },
      'wacky-watch': { x: 122, y: 14 },
      files: { x: 14, y: 106 },
      vitals: { x: 122, y: 106 },
      terminal: { x: 14, y: 198 },
      trash: { x: 122, y: 198 },
      'cainos-tools': { x: 230, y: 14 }
    };
    return defaultLayout[winId] || { x: 14 + (index % 2) * 108, y: 14 + Math.floor(index / 2) * 92 };
  },

  positionDesktopIcons() {
    const positions = this.getDesktopIconPositions();
    const used = new Set();
    document.querySelectorAll('.desktop-icon').forEach((icon, index) => {
      const winId = icon.getAttribute('data-window');
      const fallback = this.getDefaultDesktopIconPosition(winId, index);
      let pos = positions[winId] || fallback;
      pos = this.getNearestFreeDesktopIconPosition(pos, used);

      used.add(`${pos.x}:${pos.y}`);
      icon.style.left = `${pos.x}px`;
      icon.style.top = `${pos.y}px`;
    });
    this.saveDesktopIconPositions();
  },

  setupEvents() {
    this.positionDesktopIcons();
    this.cainOSResizeHandler = () => {
      this.positionDesktopIcons();
      this.fitOpenWindowsToDesktop();
      this.syncCircusDoomCanvasSize();
    };
    window.addEventListener('resize', this.cainOSResizeHandler);

    // Desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        const container = document.querySelector('.desktop-icons');
        if (!container) return;
        const iconRect = icon.getBoundingClientRect();
        this.draggedDesktopIcon = icon;
        this.desktopIconMoved = false;
        this.desktopIconDragStart = {
          offsetX: e.clientX - iconRect.left,
          offsetY: e.clientY - iconRect.top,
          startX: e.clientX,
          startY: e.clientY
        };
        icon.classList.add('dragging');
      });

      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.desktopIconMoved) {
          this.desktopIconMoved = false;
          return;
        }
        SoundManager.playClick();
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        this.selectedIcon = icon.getAttribute('data-window');
      });

      icon.addEventListener('dblclick', (e) => {
        if (this.desktopIconMoved) {
          e.preventDefault();
          this.desktopIconMoved = false;
          return;
        }
        SoundManager.playClick();
        const winId = icon.getAttribute('data-window');
        this.openWindow(winId);
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      this.selectedIcon = null;
      document.getElementById('start-menu').style.display = 'none';
    });

    const closeCircusDos = () => {
      SoundManager.playClick();
      this.hideCircusDosPreview();
    };
    ['circus-dos-close', 'circus-dos-dismiss'].forEach(id => {
      const button = document.getElementById(id);
      if (button) button.addEventListener('click', closeCircusDos);
    });
    const launchCircus = document.getElementById('circus-dos-launch');
    if (launchCircus) {
      launchCircus.addEventListener('click', () => {
        SoundManager.playWin();
        this.enterCircusInteriorView();
      });
    }
    const taskbarCircusEntry = document.getElementById('taskbar-circus-entry');
    if (taskbarCircusEntry) {
      taskbarCircusEntry.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundManager.playClick();
        const overlay = document.getElementById('circus-dos-overlay');
        if (overlay?.style.display === 'flex') this.hideCircusDosPreview();
        else this.showCircusDosPreview();
      });
    }

    // Start Button
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      SoundManager.playClick();
      startMenu.style.display = startMenu.style.display === 'none' ? 'flex' : 'none';
    });

    // Start menu items
    document.querySelectorAll('.start-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        startMenu.style.display = 'none';
        const winId = item.getAttribute('data-window');
        if (winId) {
          this.openWindow(winId);
        }
      });
    });

    // Reboot item
    document.getElementById('start-menu-reboot').addEventListener('click', () => {
      SoundManager.playClick();
      location.reload();
    });

    // Windows setup (close, minimize, dragging)
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
      const winId = win.id.replace('win-', '');
      this.windows[winId] = win;

      // Close button
      win.querySelector('.win-close').addEventListener('click', (e) => {
        e.stopPropagation();
        SoundManager.playClick();
        this.closeWindow(winId);
      });

      // Minimize button
      const minBtn = win.querySelector('.win-min');
      if (minBtn) {
        minBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          SoundManager.playClick();
          this.minimizeWindow(winId);
        });
      }

      // Maximize button
      const maxBtn = win.querySelector('.win-max');
      if (maxBtn) {
        maxBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          SoundManager.playClick();
          this.toggleMaximize(winId);
        });
      }

      // Focus window on click
      win.addEventListener('mousedown', () => {
        this.focusWindow(winId);
      });

      // Window drag logic
      const header = win.querySelector('.window-header');
      header.addEventListener('mousedown', (e) => {
        this.focusWindow(winId);
        this.draggedWindow = win;
        const rect = win.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (this.draggedDesktopIcon && this.desktopIconDragStart) {
        const container = document.querySelector('.desktop-icons');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const rawX = e.clientX - rect.left - this.desktopIconDragStart.offsetX;
        const rawY = e.clientY - rect.top - this.desktopIconDragStart.offsetY;
        const pos = this.getSnappedDesktopIconPosition(rawX, rawY);
        this.draggedDesktopIcon.style.left = `${pos.x}px`;
        this.draggedDesktopIcon.style.top = `${pos.y}px`;

        const movedX = Math.abs(e.clientX - this.desktopIconDragStart.startX);
        const movedY = Math.abs(e.clientY - this.desktopIconDragStart.startY);
        if (movedX > 4 || movedY > 4) {
          this.desktopIconMoved = true;
        }
        return;
      }

      if (this.draggedWindow) {
        const workspace = document.getElementById('windows-container').getBoundingClientRect();
        let left = e.clientX - workspace.left - this.dragOffset.x;
        let top = e.clientY - workspace.top - this.dragOffset.y;

        left = Math.max(0, Math.min(workspace.width - 150, left));
        top = Math.max(0, Math.min(workspace.height - 22, top));

        this.draggedWindow.style.left = `${left}px`;
        this.draggedWindow.style.top = `${top}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.draggedDesktopIcon) {
        const used = new Set();
        document.querySelectorAll('.desktop-icon').forEach(icon => {
          if (icon === this.draggedDesktopIcon) return;
          const x = parseInt(icon.style.left || '0', 10);
          const y = parseInt(icon.style.top || '0', 10);
          used.add(`${x}:${y}`);
        });
        const current = {
          x: parseInt(this.draggedDesktopIcon.style.left || '0', 10),
          y: parseInt(this.draggedDesktopIcon.style.top || '0', 10)
        };
        const pos = this.getNearestFreeDesktopIconPosition(current, used);
        this.draggedDesktopIcon.style.left = `${pos.x}px`;
        this.draggedDesktopIcon.style.top = `${pos.y}px`;
        this.draggedDesktopIcon.classList.remove('dragging');
        this.draggedDesktopIcon = null;
        this.desktopIconDragStart = null;
        this.saveDesktopIconPositions();
      }
      this.draggedWindow = null;
    });

    // Physical monitor controls
    const powerBtn = document.getElementById('power-button');
    const powerLed = document.getElementById('power-led');
    powerBtn.addEventListener('click', () => {
      SoundManager.playClick();
      powerBtn.classList.toggle('active');
      powerLed.classList.toggle('active');

      const screen = document.querySelector('.crt-screen');
      if (powerLed.classList.contains('active')) {
        screen.style.opacity = '1';
        SoundManager.startMainframeHum();
        const wasShutdownVal = localStorage.getItem('was_shutdown_by_calibration');
        if (wasShutdownVal === 'true' || this.wasShutdownByCalibration) {
          this.openSessionAfterCalibration();
          return;
        }
        this.applySystemStateUI();
        if (!this.isBooted) this.runBootSequence();
      } else {
        this.clearCalibrationStartupTimers();
        screen.style.opacity = '0';
        SoundManager.stopMainframeHum();
        SoundManager.stopTheme();
        if (typeof SoundManager.stopContextPulse === 'function') SoundManager.stopContextPulse();
        if (EpisodeManager.activeGame) EpisodeManager.activeGame.stop();
      }
    });

    // File Explorer Navigation
    this.renderFileList();
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        SoundManager.playClick();
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        FileSystem.currentFolder = item.getAttribute('data-folder');
        this.renderFileList();
      });
    });

    document.getElementById('btn-back-to-files').addEventListener('click', () => {
      SoundManager.playClick();
      document.getElementById('file-viewer').style.display = "none";
      document.getElementById('file-list').style.display = "block";
    });

    // Trash bin elements
    this.renderTrashList();

    // Terminal Commands
    this.setupTerminal();

    // Diagnostics loop
    this.setupDiagnostics();

    // Dismiss Caine Intrusion
    document.getElementById('caine-btn-dismiss').addEventListener('click', () => {
      SoundManager.playClick();
      document.getElementById('caine-intrusion').style.display = 'none';
    });

    // Pop Bubble Intrusion
    const bubbleIntrusion = document.getElementById('bubble-intrusion');
    bubbleIntrusion.addEventListener('click', () => {
      this.popBubble(bubbleIntrusion);
    });
  },

  // Setup Caine / Bubble periodic popups
  setupIntrusionTriggers() {
    setInterval(() => {
      if (this.isBooted
        && !this.getCainOSSetting('reduce-motion')
        && !this.activeWindow
        && Math.random() < 0.20
        && document.getElementById('caine-intrusion').style.display === 'none') {
        this.triggerBubbleIntrusion();
      }
    }, 45000);
  },

  triggerCaineIntrusion() {
    SoundManager.playError();
    document.getElementById('caine-intrusion').style.display = 'flex';
  },

  triggerBubbleIntrusion(force = false) {
    const circusOverlay = document.getElementById('circus-dos-overlay');
    if (!force && (this.activeWindow || circusOverlay?.style.display === 'flex')) return;
    SoundManager.playGlitch();
    const bubble = document.getElementById('bubble-intrusion');
    bubble.style.left = 'auto';
    bubble.style.right = '18px';
    bubble.style.top = 'auto';
    bubble.style.bottom = '54px';

    const phrases = ["MIAM LE CODE !", "NETTOYAGE !", "BUBULLE !", "SALUT EXTERNE !", "LE VIDE RECRUTE !"];
    bubble.querySelector('.bubble-text').innerText = phrases[Math.floor(Math.random() * phrases.length)];

    bubble.style.display = 'flex';
    clearTimeout(this.bubbleAutoDismissTimer);
    this.bubbleAutoDismissTimer = setTimeout(() => {
      if (!bubble.classList.contains('popping')) bubble.style.display = 'none';
    }, 7000);
  },

  popBubble(bubble) {
    if (bubble.classList.contains('popping')) return;
    bubble.classList.add('popping');

    // High pitch soap pop sounds
    SoundManager.play(820, 0.04, 'sine', 0.04);
    setTimeout(() => {
      SoundManager.play(410, 0.04, 'triangle', 0.04);
    }, 45);

    const body = bubble.querySelector('.bubble-body');
    const text = bubble.querySelector('.bubble-text');

    if (body) body.style.visibility = 'hidden';
    if (text) text.style.visibility = 'hidden';

    const rect = bubble.getBoundingClientRect();
    const parent = bubble.parentElement;
    const parentRect = parent.getBoundingClientRect();

    const bubbleCenterX = rect.left + rect.width / 2;
    const bubbleCenterY = rect.top + rect.height / 2;
    const relativeX = bubbleCenterX - parentRect.left;
    const relativeY = bubbleCenterY - parentRect.top;

    const numParticles = 12;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      const p = document.createElement('div');
      const colors = ['rgba(255, 100, 250, 0.65)', 'rgba(100, 255, 255, 0.65)', 'rgba(250, 255, 100, 0.65)', 'rgba(100, 100, 255, 0.65)'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      p.style.position = 'absolute';
      p.style.backgroundColor = color;
      p.style.border = '1px solid rgba(255, 255, 255, 0.85)';
      p.style.borderRadius = '50%';

      const size = Math.floor(5 + Math.random() * 7);
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${relativeX - size / 2}px`;
      p.style.top = `${relativeY - size / 2}px`;
      p.style.zIndex = '9999';
      p.style.pointerEvents = 'none';
      p.style.transition = 'all 0.35s cubic-bezier(0.1, 0.8, 0.25, 1)';

      parent.appendChild(p);

      const angle = (i * (2 * Math.PI / numParticles)) + (Math.random() * 0.4 - 0.2);
      const distance = 35 + Math.random() * 35;

      particles.push({
        element: p,
        angle: angle,
        distance: distance,
        x: relativeX - size / 2,
        y: relativeY - size / 2
      });
    }

    requestAnimationFrame(() => {
      particles.forEach(p => {
        const destX = p.x + Math.cos(p.angle) * p.distance;
        const destY = p.y + Math.sin(p.angle) * p.distance;
        p.element.style.transform = 'scale(0)';
        p.element.style.opacity = '0';
        p.element.style.left = `${destX}px`;
        p.element.style.top = `${destY}px`;
      });
    });

    setTimeout(() => {
      particles.forEach(p => p.element.remove());
      bubble.style.display = 'none';
      bubble.classList.remove('popping');
      if (body) body.style.visibility = 'visible';
      if (text) text.style.visibility = 'visible';
    }, 400);
  },

  showDialog(title, text) {
    const overlay = document.getElementById('dialog-overlay');
    const titleEl = document.getElementById('dialog-title');
    const textEl = document.getElementById('dialog-text');
    const btnOk = document.getElementById('dialog-btn-ok');
    const btnCloseX = document.getElementById('dialog-close-x');

    titleEl.innerText = title;
    textEl.innerHTML = text.replace(/\n/g, '<br>');
    overlay.style.display = 'flex';

    const closeDialog = () => {
      SoundManager.playClick();
      overlay.style.display = 'none';
      btnOk.removeEventListener('click', closeDialog);
      btnCloseX.removeEventListener('click', closeDialog);
    };

    btnOk.addEventListener('click', closeDialog);
    btnCloseX.addEventListener('click', closeDialog);
  },

  updateDiagnosticsUI() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const nameEl = document.querySelector('#win-vitals .profile-details span.cyan-text');
    const picEl = document.querySelector('#win-vitals .profile-pic');

    if (this.isPomniNamed()) {
      if (nameEl) nameEl.innerText = "Pomni";
      if (picEl) {
        picEl.className = "profile-pic pomni-pic";
        picEl.style.backgroundImage = "";
      }
    } else {
      if (nameEl) nameEl.innerText = "SUJET #251";
      if (picEl) {
        picEl.className = "profile-pic";
        picEl.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><rect width=\"16\" height=\"16\" fill=\"%23333\"/><text x=\"4\" y=\"12\" fill=\"%23888\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"bold\">?</text></svg>')";
      }
    }
  },

  isPomniNamed() {
    if (typeof EpisodeManager === 'undefined') return false;
    const progress = EpisodeManager.getProgress?.() || [];
    if (progress.includes(1)) return true;
    const pilotParts = EpisodeManager.getSubepisodeProgress?.(1) || [];
    return pilotParts.includes(3);
  },

  applySystemStateUI() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const isFirstTime = !progress.includes(0);

    const startBar = document.getElementById('start-bar');
    const desktopIcons = document.querySelector('.desktop-icons');
    const simSelector = document.querySelector('#win-simulations .sim-selector');
    const simWin = document.getElementById('win-simulations');
    const winContainer = document.getElementById('windows-container');

    if (isFirstTime) {
      if (startBar) startBar.style.display = 'none';
      if (desktopIcons) desktopIcons.style.display = 'none';
      if (winContainer) winContainer.style.height = '100%';

      if (simWin) {
        simWin.style.width = '100%';
        simWin.style.height = '100%';
        simWin.style.left = '0';
        simWin.style.top = '0';
        simWin.style.boxShadow = 'none';
        simWin.style.border = 'none';

        const header = simWin.querySelector('.window-header');
        if (header) header.style.display = 'none';
      }
      if (simSelector) simSelector.style.display = 'none';
    } else {
      if (startBar) startBar.style.display = 'flex';
      if (desktopIcons) desktopIcons.style.display = 'flex';
      if (winContainer) winContainer.style.height = 'calc(100% - 40px)';

      if (simWin) {
        if (simWin.style.width === '100%') {
          simWin.style.boxShadow = '';
          simWin.style.border = '';
          const header = simWin.querySelector('.window-header');
          if (header) header.style.display = 'flex';
        } else {
          simWin.style.width = '680px';
          simWin.style.height = '500px';
          simWin.style.left = '100px';
          simWin.style.top = '60px';
          simWin.style.boxShadow = '';
          simWin.style.border = '';
          const header = simWin.querySelector('.window-header');
          if (header) header.style.display = 'flex';
        }
      }
      if (simSelector) simSelector.style.display = 'flex';
    }
  },

  shutdownSystemForCalibration() {
    this.wasShutdownByCalibration = true;
    localStorage.setItem('was_shutdown_by_calibration', 'true');
    this.isBooted = false;
    this.closeAllWindows();

    this.playShutdownSound();
    SoundManager.stopMainframeHum();
    SoundManager.stopTheme();
    if (typeof SoundManager.stopContextPulse === 'function') SoundManager.stopContextPulse();

    const powerBtn = document.getElementById('power-button');
    const powerLed = document.getElementById('power-led');
    if (powerBtn) powerBtn.classList.remove('active');
    if (powerLed) powerLed.classList.remove('active');

    const screen = document.querySelector('.crt-screen');
    if (screen) screen.style.opacity = '0';

    if (typeof EpisodeManager.stopActiveGame === 'function') {
      EpisodeManager.stopActiveGame();
    } else if (EpisodeManager.activeGame) {
      EpisodeManager.activeGame.stop();
      EpisodeManager.activeGame = null;
    }

    this.applySystemStateUI();
  },

  playShutdownSound() {
    if (typeof SoundManager !== 'undefined') {
      try {
        SoundManager.init();
        const ctx = SoundManager.ctx;
        if (ctx) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(250, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 1.0);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.00001, ctx.currentTime + 1.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.0);
        }
      } catch(e) {}
    }
  },

  showCircusDosPreview() {
    const overlay = document.getElementById('circus-dos-overlay');
    const art = document.getElementById('circus-dos-art');
    const status = document.getElementById('circus-dos-status');
    const launch = document.getElementById('circus-dos-launch');
    const taskbarEntry = document.getElementById('taskbar-circus-entry');
    if (!overlay || !art) return;

    this.updateCainOSProvenance('tent');

    this.clearCircusRenderTimers();
    this.stopCircusDoomView();
    overlay.classList.remove('inside', 'doom');

    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const unlockedCount = progress.filter(ep => ep >= 0 && ep <= 9).length;
    const abstractionRisk = unlockedCount >= 7 ? 'CRITICAL' : (unlockedCount >= 3 ? 'ELEVATED' : 'STABLE');

    if (launch) {
      launch.disabled = true;
      launch.innerText = 'RENDU EN COURS...';
    }
    if (taskbarEntry) taskbarEntry.classList.add('active');
    if (status) status.innerText = 'INITIALISATION DU RENDU GEOMETRIQUE...';

    const baseLines = [
      'C:\\\\CAINE\\\\CIRCUS> render_circus.exe /mode:inside /source:CAINE_STAGE',
      'CAINE ADVENTURE SHELL v0.98',
      'NEURAL LINK............. ONLINE',
      `EPISODE MODULES......... ${String(unlockedCount).padStart(2, '0')} / 10`,
      `ABSTRACTION RISK........ ${abstractionRisk}`,
      '',
      'GEOMETRY BUFFER......... EMPTY',
      'COLOR PLANES............ RED / BLUE / YELLOW',
      'PORTAL DEPTH............ CALCULATING',
      '',
      '   [P] NEW SUBJECT        [K] ABSTRACTED KAUFMO TRACE',
      '   [C] CAINE ROUTINE      [A] C&A ARCHIVE FRAGMENT',
      '',
      'C:\\\\CAINE\\\\CIRCUS> assembling tent primitives...'
    ];
    art.innerText = baseLines.join('\n');

    overlay.style.display = 'flex';
    overlay.classList.remove('rendering');
    void overlay.offsetWidth;
    overlay.classList.add('rendering');

    const statusSteps = [
      { t: 420, text: 'ANNEAU DE PISTE VERROUILLE...' },
      { t: 920, text: 'PANNEAUX ROUGE/BLEU EN ROTATION...' },
      { t: 1380, text: 'TOIT PRINCIPAL ATTACHE AU CIEL DIGITAL...' },
      { t: 1880, text: 'PORTE DU CHAPITEAU SYNCHRONISEE...' },
      { t: 2420, text: 'POINT DE VUE INTERNE PRET.' },
      { t: 3180, text: 'TITRE DU PROGRAMME EN ASSEMBLAGE...' },
      { t: 4480, text: 'IDENTITE VISUELLE SYNCHRONISEE.' }
    ];
    this.circusRenderTimers = statusSteps.map(step => setTimeout(() => {
      if (status) status.innerText = step.text;
      SoundManager.play(420 + Math.random() * 260, 0.045, 'square', 0.035);
    }, step.t));

    this.circusRenderTimers.push(setTimeout(() => {
      art.innerText = [
        ...baseLines.slice(0, 6),
        'GEOMETRY BUFFER......... CHAPITEAU COMPLETE',
        'COLOR PLANES............ STABLE',
        'PORTAL DEPTH............ INTERIOR VIEW',
        '',
        '                 /\\',
        '              __/  \\__',
        '           __/  RED   \\__',
        '          / BLUE  YELLOW \\',
        '         /________________\\',
        '         |  DIGITAL CIRCUS |',
        '         |  ENTRY PORTAL   |',
        '         |_____[  O  ]_____|',
        '',
        'C:\\\\CAINE\\\\CIRCUS> perspective = SUBJECT_INTERNAL',
        '"Vous ne regardez plus le module. Vous entrez dans la scene."'
      ].join('\n');
      if (status) status.innerText = 'CHAPITEAU ASSEMBLE - ENTREE SIMULATION DISPONIBLE';
      if (launch) {
        launch.disabled = false;
        launch.innerText = 'ENTRER DANS LE CHAPITEAU';
      }
      SoundManager.playWin();
    }, 4620));

    SoundManager.play(520, 0.05, 'square', 0.06);
    setTimeout(() => SoundManager.play(780, 0.05, 'square', 0.05), 80);
  },

  hideCircusDosPreview() {
    this.clearCircusRenderTimers();
    this.stopCircusDoomView();
    if (typeof SoundManager !== 'undefined' && typeof SoundManager.stopContextPulse === 'function') {
      SoundManager.stopContextPulse();
    }
    const overlay = document.getElementById('circus-dos-overlay');
    const taskbarEntry = document.getElementById('taskbar-circus-entry');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.classList.remove('rendering', 'inside', 'doom');
    }
    if (taskbarEntry) taskbarEntry.classList.remove('active');
    this.updateCainOSProvenance(this.activeWindow || 'desktop');
  },

  clearCircusRenderTimers() {
    if (this.circusRenderTimers) {
      this.circusRenderTimers.forEach(timer => clearTimeout(timer));
    }
    this.circusRenderTimers = [];
  },

  enterCircusInteriorView() {
    const overlay = document.getElementById('circus-dos-overlay');
    const art = document.getElementById('circus-dos-art');
    const status = document.getElementById('circus-dos-status');
    const launch = document.getElementById('circus-dos-launch');
    if (!overlay || !art) return;

    this.clearCircusRenderTimers();
    overlay.classList.add('inside');
    if (status) status.innerText = 'VUE INTERNE SYNCHRONISEE - VOUS ETES DANS LA SIMULATION';
    art.innerText = [
      'C:\\\\CAINE\\\\CIRCUS> perspective = SUBJECT_INTERNAL',
      'VISUAL LAYER............ CIRCUS FLOOR',
      'BODY SIGNAL............. DIGITAL AVATAR',
      'EXIT VECTOR............. NOT TRUSTED',
      '',
      '        *        *           *',
      '          \\      |      /',
      '       ----  CHAPITEAU DIGITAL  ----',
      '          /      |      \\',
      '        *        O           *',
      '',
      'Vous voyez maintenant la scene depuis l interieur du cirque.',
      'Le panneau Simulation_Control.exe reste le controle technique des episodes.',
      '',
      'C:\\\\CAINE\\\\CIRCUS> return_bureau ou ouvrir Simulation_Control.exe pour choisir un episode'
    ].join('\n');
    if (launch) {
      launch.disabled = true;
      launch.innerText = 'VUE INTERNE ACTIVE';
    }
    SoundManager.play(660, 0.12, 'triangle', 0.08);
    setTimeout(() => SoundManager.play(990, 0.12, 'sine', 0.06), 120);
    this.startCircusDoomView();
  },

  startCircusDoomView() {
    this.circusZonePropsCache = new Map();
    this.circusZoneSpritesCache = new Map();
    this.circusZoneObjectiveConfigs = null;
    const overlay = document.getElementById('circus-dos-overlay');
    const canvas = document.getElementById('circus-doom-canvas');
    const zoneEl = document.getElementById('circus-doom-zone');
    const detailEl = document.getElementById('circus-doom-detail');
    if (!overlay || !canvas) return;

    this.updateCainOSProvenance('fps');

    this.stopCircusDoomView();
    overlay.classList.add('doom');
    canvas.focus();

    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const unlocked = ep => progress.includes(ep);
    const unlockedAt = (ep, subepisode = 0) => unlocked(ep)
      || ((typeof EpisodeManager !== 'undefined' ? EpisodeManager.getSubepisodeProgress?.(ep) : []) || [])
        .some(index => index >= subepisode);
    const map = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,0,3,3,0,6,6,0,8,8,0,10,10,0,14,14,1],
      [1,2,2,0,3,3,0,6,6,0,8,8,0,10,10,0,14,14,1],
      [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1],
      [1,4,4,0,5,5,0,7,7,0,9,9,0,11,11,0,15,15,1],
      [1,4,4,0,5,5,0,7,7,0,9,9,0,11,11,0,15,15,1],
      [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1],
      [1,12,12,0,13,13,0,16,16,0,17,17,0,18,18,0,19,19,1],
      [1,12,12,0,13,13,0,16,16,0,17,17,0,18,18,0,19,19,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    const portals = {
      2: { name: 'CHAPITEAU / PISTE', short: 'CIRQUE', detail: 'Hub principal, scene, coulisses visibles depuis le monde digital.', color: '#ffd84a', floor: '#251018', ceiling: '#19102f', unlocked: true },
      3: { name: 'TERRAIN DU CIRQUE', short: 'TERRAIN', detail: 'Exterieur immediat du chapiteau et acces aux aventures de Caine.', color: '#7df0ff', floor: '#113036', ceiling: '#16112d', unlocked: true },
      4: { name: 'CELLAR / KAUFMO', short: 'CELLAR', detail: 'Zone de stockage des abstraits et trace Kaufmo apres le pilote.', color: '#56505f', floor: '#111117', ceiling: '#050508', unlocked: unlockedAt(1, 5) },
      5: { name: 'PORTE DE SORTIE / VIDE', short: 'EXIT', detail: 'Prototype de sortie, couloirs impossibles et bureau apparu dans le pilote.', color: '#ffffff', floor: '#18202a', ceiling: '#060606', unlocked: unlockedAt(1, 2) },
      6: { name: 'CANDY CANYON KINGDOM', short: 'CANDY', detail: 'Royaume bonbon, convoi sirop et route du tanker.', color: '#ff9b37', floor: '#4b2436', ceiling: '#24234f', unlocked: unlockedAt(2, 1) },
      7: { name: 'TEST LEVEL / NPC SCAN', short: 'TEST', detail: 'Sous-couche technique liee a Gummigoo et aux donnees NPC.', color: '#9cff6d', floor: '#1d2b1f', ceiling: '#0f1b12', unlocked: unlockedAt(2, 4) },
      8: { name: 'MILDENHALL MANOR', short: 'MANOR', detail: 'Manoir horrifique, baron, fantome et menace qui reagit aux signaux.', color: '#b7f0ff', floor: '#1d1827', ceiling: '#050816', unlocked: unlockedAt(3, 1) },
      9: { name: 'SOUS-SOL MILDENHALL', short: 'CAVE', detail: 'Trappes, obscurite, armes de Kinger et fuite sous le manoir.', color: '#7c88a1', floor: '#0d1018', ceiling: '#03040a', unlocked: unlockedAt(3, 4) },
      10: { name: "SPUDSY'S", short: 'SPUDSY', detail: 'Restaurant rapide, comptoir, tickets et stress de service de Gangle.', color: '#ff4d4d', floor: '#3b1a17', ceiling: '#251308', unlocked: unlockedAt(4, 1) },
      11: { name: 'SUGGESTION BOX / MICRO-ZONES', short: 'IDEES', detail: 'Suite de micro-aventures generees par Caine depuis les suggestions.', color: '#ff4fb8', floor: '#2c1434', ceiling: '#160d25', unlocked: unlockedAt(5, 1) },
      12: { name: 'SOFTBALL STADIUM', short: 'BALL', detail: 'Terrain de match, costumes sportifs et equipe adverse alternative.', color: '#83ff57', floor: '#173416', ceiling: '#14152f', unlocked: unlockedAt(5, 6) },
      13: { name: 'THEY ALL GET GUNS', short: 'GUNS', detail: 'Arena d epreuves armees, scores et tension autour de Jax.', color: '#f6d743', floor: '#2f2610', ceiling: '#17110a', unlocked: unlockedAt(6, 2) },
      14: { name: 'DIGITAL LAKE / BEACH', short: 'LAC', detail: 'Lac digital, plage, soleil dangereux et faux repos de Caine.', color: '#4ee7ff', floor: '#073844', ceiling: '#114071', unlocked: unlockedAt(7, 1) },
      15: { name: 'CHINESE ROOM / ADMIN ZONE', short: 'ADMIN', detail: 'Zone de questionnement, anomalie C&A et couches systeme sous le lac.', color: '#ffcf75', floor: '#302318', ceiling: '#09111e', unlocked: unlockedAt(7, 3) },
      16: { name: 'CAINE OFFICE / C&A CORE', short: 'CORE', detail: 'Bureau de Caine, origine IA et couches C&A que CainOS revele tard.', color: '#ff7a30', floor: '#291915', ceiling: '#10070d', unlocked: unlockedAt(7, 3) || unlocked(8) || unlocked(9) },
      17: { name: 'KINGER MEMORY BUFFER', short: 'MEMOIRE', detail: 'Fragments Queenie, souvenirs et noyau emotionnel de Kinger.', color: '#d9d0a2', floor: '#252316', ceiling: '#0e0e12', unlocked: unlocked(8) },
      18: { name: 'FINAL CIRCUS / BACKSTAGE', short: 'FINAL', detail: 'Retour au cirque, brain scans, Ribbit et dernier etat de Pomni/Caine.', color: '#e53935', floor: '#2b1018', ceiling: '#09060d', unlocked: unlocked(9) },
      19: { name: 'CIRCUS MEMBERS ARCHIVE', short: 'MEMBRES', detail: 'Projection CainOS non physique des anciens membres connus apres les episodes.', color: '#c875ff', floor: '#21142e', ceiling: '#0c0614', unlocked: unlocked(9) },
      20: { name: 'RESIDENT HALL / CHAMBRES', short: 'CHAMBRES', detail: 'Couloir residentiel avec les portes personnalisees des habitants du Cirque.', color: '#ff6b9f', floor: '#30152a', ceiling: '#160b24', unlocked: unlockedAt(1, 0) },
      21: { name: "CROW'S NEST / CAFE CIRQUE", short: 'CAFE', detail: 'Cafe du Cirque utilise comme lieu de retrait et de discussion tardive.', color: '#d49a62', floor: '#302018', ceiling: '#17100d', unlocked: unlocked(8) },
      22: { name: 'AQUARIUM', short: 'AQUARIUM', detail: 'Zone aquatique revelee dans Remember.', color: '#63d9ff', floor: '#073443', ceiling: '#06202f', unlocked: unlocked(9) },
      23: { name: 'SNOWY SUMMIT', short: 'SOMMET', detail: 'Sommet enneige rattache aux souvenirs de Jax et Ribbit.', color: '#e8f7ff', floor: '#a7c9df', ceiling: '#34567a', unlocked: unlocked(9) },
      24: { name: "POACHER'S PARADISE", short: 'CHASSE', detail: 'Micro-aventure de chasse d Untitled avec les transformations animales.', color: '#c4a45f', floor: '#304621', ceiling: '#16305a', unlocked: unlockedAt(5, 2) },
      25: { name: 'ANIME HIGH SCHOOL', short: 'LYCEE', detail: 'Micro-aventure scolaire anime d Untitled.', color: '#ff9fcd', floor: '#e8d7df', ceiling: '#8bc8ff', unlocked: unlockedAt(5, 4) },
      26: { name: 'WHITE HOUSE ADVENTURE', short: 'PRESIDENCE', detail: 'Micro-aventure politique de Pomni dans Untitled.', color: '#f2f2f2', floor: '#d8dce7', ceiling: '#44699a', unlocked: unlockedAt(5, 3) },
      27: { name: 'THE VOID', short: 'VIDE', detail: 'Etendue blanche infinie autour du Cirque; distincte du labyrinthe de la fausse sortie.', color: '#f8f8ff', floor: '#edf1ff', ceiling: '#ffffff', unlocked: unlockedAt(1, 2) },
      28: { name: 'TENT COMMON AREA', short: 'SALON', detail: 'Espace commun du chapiteau ou les residents se retrouvent entre les aventures.', color: '#ff6b9f', floor: '#c43a35', ceiling: '#311340', unlocked: unlockedAt(1, 0) },
      29: { name: 'DOOR GALLERY / TUBES', short: 'PORTES', detail: 'Galerie de portes aleatoires, tunnels et toboggans internes du chapiteau.', color: '#7df0ff', floor: '#e06f24', ceiling: '#24112f', unlocked: unlockedAt(1, 0) },
      30: { name: 'LOSER CORNER', short: 'PERDANTS', detail: 'Coin reserve aux perdants des jeux, a proximite de l aquarium du chapiteau.', color: '#63d9ff', floor: '#4c305c', ceiling: '#1b102b', unlocked: unlockedAt(6, 2) },
      31: { name: 'THE NEST / IN-HOUSE ARCHIVE', short: 'NEST', detail: 'Aventure interne supprimee; accessible ici comme reconstruction d archive, pas comme salle permanente.', color: '#e8d6a8', floor: '#5a3c28', ceiling: '#21150f', unlocked: unlockedAt(1, 1) },
      32: { name: 'CANDY ROYAL PALACE', short: 'PALAIS', detail: 'Salle royale de Princess Loolilalu et point de depart de la mission du sirop.', color: '#ff9ad5', floor: '#ffd6e8', ceiling: '#7d3f8c', unlocked: unlockedAt(2, 2) },
      33: { name: 'SYRUP TANKER ROUTE', short: 'TANKER', detail: 'Route du canyon empruntee par le convoi et les bandits crocodiles.', color: '#ff9b37', floor: '#d97b35', ceiling: '#5f8ee8', unlocked: unlockedAt(2, 3) },
      34: { name: 'MILDENHALL HELL', short: 'ENFER', detail: 'Branche infernale sous le manoir ou les ames possedent Pomni.', color: '#ff4d32', floor: '#240707', ceiling: '#080000', unlocked: unlockedAt(3, 5) },
      35: { name: "SPUDSY'S KITCHEN", short: 'CUISINE', detail: 'Cuisine, friteuses, tickets et postes de preparation du service.', color: '#f6d743', floor: '#d9d4c7', ceiling: '#561914', unlocked: unlockedAt(4, 2) },
      36: { name: "SPUDSY'S BATHROOM", short: 'WC', detail: 'Sanitaires decrits comme un risque biologique pendant le service.', color: '#91d4bb', floor: '#dedbd0', ceiling: '#36534d', unlocked: unlockedAt(4, 3) },
      37: { name: 'TRAINING ROOM', short: 'FORMATION', detail: 'Piece isolee ou Jax subit la video de formation de Gangle.', color: '#e53935', floor: '#1b1717', ceiling: '#070707', unlocked: unlockedAt(4, 5) },
      38: { name: 'FAVORITE CHARACTER AWARDS', short: 'AWARDS', detail: 'Scene de ceremonie preparee par Caine apres les epreuves de They All Get Guns.', color: '#ffd84a', floor: '#8b172b', ceiling: '#1c0a24', unlocked: unlockedAt(6, 7) },
      39: { name: 'LAKE LIGHTHOUSE / SLIDE', short: 'PHARE', detail: 'Phare et toboggan geant dominant le lac digital.', color: '#ff5b4d', floor: '#ffe57d', ceiling: '#78e8ff', unlocked: unlockedAt(7, 1) },
      40: { name: 'SUNKEN TREASURE', short: 'TRESOR', detail: 'Fond du lac, coffre deja pille et poissons gardiens peu convaincants.', color: '#4ee7ff', floor: '#0a596b', ceiling: '#06202f', unlocked: unlockedAt(7, 2) },
      41: { name: 'C&A STREET MEMORY', short: 'RUE C&A', detail: 'Rue rememoree par Jax; souvenir incomplet, pas une sortie fonctionnelle.', color: '#8fa6ba', floor: '#30343a', ceiling: '#101820', unlocked: unlockedAt(7, 4) },
      42: { name: 'DIGITAL CARNIVAL OVERLOOK', short: 'FETE', detail: 'Fete foraine visible depuis le terrain mais jamais visitee dans la serie.', color: '#ff4fb8', floor: '#315f2d', ceiling: '#5f8ee8', unlocked: unlockedAt(1, 0) },
      43: { name: 'TENT DINING AREA', short: 'REPAS', detail: 'Table du niveau principal utilisee pour les repas du groupe.', color: '#ffd84a', floor: '#c43a35', ceiling: '#311340', unlocked: unlockedAt(1, 0) },
      50: { name: 'DORM HALL / ANNEXE OUEST', short: 'ANNEXE O.', detail: 'Couloir lateral des portes barrees des anciens membres. Acces archive apres Remember.', color: '#bb6a75', floor: '#4a1727', ceiling: '#25101d', unlocked: unlocked(9) },
      51: { name: 'DORM HALL / ANNEXE EST', short: 'ANNEXE E.', detail: 'Second couloir lateral des portes barrees des anciens membres. Acces archive apres Remember.', color: '#a85e70', floor: '#431523', ceiling: '#210e1a', unlocked: unlocked(9) },
      64: { name: 'MILDENHALL UPPER HALL / RECONSTRUCTION', short: 'MANOR II', detail: 'Etage praticable reconstruit par CainOS depuis les volumes visibles du manoir; son plan exact n est pas canonique.', color: '#a9c9db', floor: '#211a2c', ceiling: '#050816', unlocked: unlockedAt(3, 1) },
      65: { name: 'MILDENHALL ATTIC / RECONSTRUCTION', short: 'GRENIER', detail: 'Grenier CainOS inspire du manoir. Les accessoires prolongent la scene sans affirmer un interieur officiel.', color: '#8a7890', floor: '#19131d', ceiling: '#030307', unlocked: unlockedAt(3, 1) },
      66: { name: 'CANDY PALACE UPPER GALLERY / RECONSTRUCTION', short: 'PALAIS II', detail: 'Galerie haute reconstruite depuis l architecture du palais de Loolilalu; circulation CainOS non montree dans l episode.', color: '#ff9ad5', floor: '#ffe1ed', ceiling: '#7d3f8c', unlocked: unlockedAt(2, 2) },
      67: { name: 'CANDY PALACE BALCONY / RECONSTRUCTION', short: 'BALCON', detail: 'Balcon d observation CainOS raccorde au palais. La vue respecte le royaume, mais ce niveau reste une reconstruction.', color: '#ffd84a', floor: '#ffcae1', ceiling: '#70a7ff', unlocked: unlockedAt(2, 2) },
      68: { name: 'LIGHTHOUSE INTERIOR / RECONSTRUCTION', short: 'PHARE INT.', detail: 'Interieur praticable du phare reconstruit par CainOS depuis sa silhouette et son acces au toboggan.', color: '#ff6a55', floor: '#ead17b', ceiling: '#79e8ff', unlocked: unlockedAt(7, 1) },
      69: { name: 'LIGHTHOUSE LANTERN / RECONSTRUCTION', short: 'LANTERNE', detail: 'Lanterne haute CainOS avec vue sur le lac. Le phare est canonique; cette circulation interieure ne l est pas.', color: '#fff1a8', floor: '#d9b94f', ceiling: '#4ee7ff', unlocked: unlockedAt(7, 1) }
    };
    const scenes = {
      2: { exits: [3, 4, 5, 20, 21, 28, 29, 43], motif: 'circus', size: 23 },
      3: { exits: [2, 11, 14, 42], motif: 'grounds', size: 21 },
      4: { exits: [2, 5], motif: 'cellar', size: 13 },
      5: { exits: [2, 4, 16, 27], motif: 'exit', size: 15 },
      6: { exits: [7, 29, 32, 33], motif: 'candy', size: 19 },
      7: { exits: [6, 16, 33], motif: 'test', size: 13 },
      8: { exits: [9, 29, 64], motif: 'manor', size: 17 },
      9: { exits: [8, 34], motif: 'basement', size: 13 },
      10: { exits: [11, 29, 35, 36, 37], motif: 'spudsy', size: 17 },
      11: { exits: [3, 10, 12, 13, 24, 25, 26, 29], motif: 'micro', size: 19 },
      12: { exits: [11], motif: 'softball', size: 19 },
      13: { exits: [11, 29, 38], motif: 'guns', size: 17 },
      14: { exits: [3, 15, 39, 40], motif: 'lake', size: 21 },
      15: { exits: [14, 16, 41], motif: 'admin', size: 13 },
      16: { exits: [5, 7, 15, 17, 18, 29], motif: 'core', size: 17 },
      17: { exits: [16], motif: 'memory', size: 13 },
      18: { exits: [16, 19, 21, 22, 23, 29], motif: 'final', size: 19 },
      19: { exits: [18], motif: 'archive', size: 15 },
      20: { exits: [2, 28, 50, 51], motif: 'dorm', size: 21 },
      21: { exits: [2, 18, 43], motif: 'cafe', size: 15 },
      22: { exits: [18, 30], motif: 'aquarium', size: 17 },
      23: { exits: [18], motif: 'snow', size: 17 },
      24: { exits: [11], motif: 'poacher', size: 17 },
      25: { exits: [11], motif: 'school', size: 17 },
      26: { exits: [11], motif: 'whitehouse', size: 15 },
      27: { exits: [5], motif: 'void', size: 21 },
      28: { exits: [2, 20, 29, 30, 31, 43], motif: 'common', size: 19 },
      29: { exits: [2, 6, 8, 10, 11, 13, 16, 18, 28, 38], motif: 'tubes', size: 23 },
      30: { exits: [28, 22], motif: 'loser', size: 13 },
      31: { exits: [28], motif: 'nest', size: 15 },
      32: { exits: [6, 33, 66], motif: 'palace', size: 17 },
      33: { exits: [6, 32, 7], motif: 'route', size: 21 },
      34: { exits: [9], motif: 'hell', size: 15 },
      35: { exits: [10, 36, 37], motif: 'kitchen', size: 15 },
      36: { exits: [10, 35], motif: 'bathroom', size: 11 },
      37: { exits: [10, 35], motif: 'training', size: 11 },
      38: { exits: [13, 29], motif: 'awards', size: 19 },
      39: { exits: [14, 68], motif: 'lighthouse', size: 15 },
      40: { exits: [14], motif: 'underwater', size: 17 },
      41: { exits: [15], motif: 'street', size: 17 },
      42: { exits: [3], motif: 'carnival', size: 19 },
      43: { exits: [2, 28, 21], motif: 'dining', size: 15 },
      50: { exits: [20], motif: 'dormannex', size: 21 },
      51: { exits: [20], motif: 'dormannex', size: 21 },
      64: { exits: [8, 65], motif: 'manor', size: 15 },
      65: { exits: [64], motif: 'manor', size: 13 },
      66: { exits: [32, 67], motif: 'palace', size: 15 },
      67: { exits: [66], motif: 'palace', size: 13 },
      68: { exits: [39, 69], motif: 'lighthouse', size: 13 },
      69: { exits: [68, 14], motif: 'lighthouse', size: 11 }
    };

    Object.entries(this.getCircusBedroomDefinitions()).forEach(([zoneId, room]) => {
      const id = Number(zoneId);
      const isArchived = this.isCircusBedroomArchived(room);
      const archiveLabel = isArchived ? 'ARCHIVE / ' : '';
      portals[id] = {
        name: `${archiveLabel}CHAMBRE DE ${room.resident.toUpperCase()}`,
        short: room.resident.toUpperCase().slice(0, 12),
        detail: isArchived
          ? `Chambre abandonnee de ${room.resident}. Reconstruction CainOS: la porte est canonique, mais cet interieur exact ne l est pas.`
          : `Espace prive de ${room.resident}. Les details non montres a l ecran sont identifies comme reconstruction CainOS.`,
        color: room.color,
        floor: isArchived ? '#171219' : room.color,
        ceiling: isArchived ? '#080609' : '#1a0d20',
        unlocked: room.archived ? unlocked(9) : unlockedAt(1, 0)
      };
      scenes[id] = {
        exits: [room.parent],
        motif: isArchived ? 'archivebedroom' : 'bedroom',
        size: isArchived ? 11 : 13
      };
    });

    const adventurePortal = this.getCircusAdventurePortalConfig();
    if (portals[adventurePortal.target]) portals[adventurePortal.target].unlocked = true;
    const persistentWorld = this.getCircusPersistentWorldState();
    const introSeen = !!this.getCainOSStorage('fps_intro_seen', false);
    const storedZoneId = Number(persistentWorld.currentZoneId);
    const initialZoneId = portals[storedZoneId]?.unlocked ? storedZoneId : 2;

    this.circusDoom = {
      canvas,
      ctx: canvas.getContext('2d'),
      zoneEl,
      detailEl,
      map,
      portals,
      scenes,
      currentZoneId: initialZoneId,
      selectedExitIndex: 0,
      history: [],
      hotspots: [],
      interactionMessage: '',
      interactionUntil: 0,
      interactionChoices: null,
      interactionOrigin: null,
      interactionChannel: 'system',
      interactionSpeaker: '',
      dialogueVisits: new Map(persistentWorld.dialogueVisits),
      discoveries: new Set(persistentWorld.discoveries),
      activeProps: new Map(persistentWorld.activeProps),
      collectedProps: new Set(persistentWorld.collected),
      givenProps: new Set(persistentWorld.given),
      exploredCells: new Map(persistentWorld.exploredCells.map(([zoneId, cells]) => [Number(zoneId), new Set(cells)])),
      noticedCharacters: new Set(),
      talkedCharacters: new Set(),
      completedZoneObjectives: new Set(persistentWorld.completedObjectives),
      zoneChallenges: persistentWorld.challenges,
      heldItem: persistentWorld.heldItem,
      follower: persistentWorld.follower,
      stability: persistentWorld.stability,
      interactionVerb: persistentWorld.verb,
      campaigns: persistentWorld.campaigns,
      activeCampaign: persistentWorld.activeCampaign,
      zonePositions: persistentWorld.zonePositions,
      doorStates: new Map(persistentWorld.doorStates),
      npcMemories: new Map(persistentWorld.npcMemories),
      dynamicEventState: persistentWorld.dynamicEvents,
      missionJournal: persistentWorld.missionJournal,
      journalVisible: false,
      director: persistentWorld.director,
      campaignSurvival: { key: '', elapsed: 0 },
      customAdventure: persistentWorld.customAdventure,
      currentActivity: persistentWorld.currentActivity,
      portalReady: introSeen,
      adventurePortal,
      cinematic: null,
      portalTransition: null,
      doorTransition: null,
      npcAgents: new Map(persistentWorld.npcAgents),
      activeDynamicEvent: null,
      socialScene: null,
      lastSocialSceneAt: 0,
      threatPositions: new Map(),
      threatCooldownUntil: 0,
      threatAlert: '',
      noiseLevel: 0,
      visibilityLevel: 0.45,
      stealthAlert: '',
      lastNoiseAt: 0,
      routinePhase: null,
      vehicleModeUntil: 0,
      diveModeUntil: 0,
      gamepadActionDown: false,
      controlBindings: this.getCircusControlBindings(),
      fov: Number(this.getCainOSSetting('fps-fov', 64)) * Math.PI / 180,
      mouseSensitivity: Number(this.getCainOSSetting('fps-sensitivity', 45)) / 10000,
      invertMouse: this.getCainOSSetting('fps-invert-mouse', false) === true,
      interactionAssist: this.getCainOSSetting('fps-interaction-assist', true) !== false,
      motionIntensity: Number(this.getCainOSSetting('fps-motion-intensity', 100)) / 100,
      minimapVisible: this.getCainOSSetting('fps-minimap', true) !== false,
      hudVisible: this.getCainOSSetting('fps-hud', true) !== false,
      lastZoneEventId: null,
      nextFootstepAt: 0,
      footstepSide: -1,
      player: { x: 7.5, z: 11.2, a: -Math.PI / 2 },
      keys: new Set(),
      last: performance.now(),
      raf: null
    };
    const roomAudit = this.auditCircusRoomNetwork(portals, scenes);
    const objectiveAudit = this.auditCircusZoneObjectives();
    const gameplayAudit = this.auditCircusGameplaySystems(portals, scenes);
    const verticalAudit = this.auditCircusVerticalRendering();
    const advancedAudit = this.auditCircusAdvancedGameplay();
    document.body.dataset.fpsRoomAudit = roomAudit.ok ? 'ok' : roomAudit.errors.join(' | ');
    document.body.dataset.fpsCurrentRooms = String(roomAudit.currentRooms);
    document.body.dataset.fpsArchiveRooms = String(roomAudit.archiveRooms);
    document.body.dataset.fpsObjectiveAudit = objectiveAudit.ok ? 'ok' : objectiveAudit.errors.join(' | ');
    document.body.dataset.fpsObjectiveMissions = String(objectiveAudit.missionCount);
    document.body.dataset.fpsGameplayAudit = gameplayAudit.ok ? 'ok' : gameplayAudit.errors.join(' | ');
    document.body.dataset.fpsAdventureWorlds = String(gameplayAudit.worldCount);
    document.body.dataset.fpsIntroSteps = String(gameplayAudit.introSteps);
    document.body.dataset.fpsVerticalAudit = verticalAudit.ok ? 'ok' : verticalAudit.errors.join(' | ');
    document.body.dataset.fpsTallStructures = String(verticalAudit.structureCount);
    document.body.dataset.fpsVerticalFloors = String(verticalAudit.floorCount);
    document.body.dataset.fpsAnimationSheets = String(verticalAudit.animationCount);
    document.body.dataset.fpsAdvancedAudit = advancedAudit.ok ? 'ok' : advancedAudit.errors.join(' | ');
    document.body.dataset.fpsCampaignStages = String(advancedAudit.campaignStages);
    document.body.dataset.fpsCampaignEpisodes = String(advancedAudit.campaignEpisodes);
    document.body.dataset.fpsDynamicEventZones = String(advancedAudit.eventZones);
    document.body.dataset.fpsActivityTypes = String(advancedAudit.activityTypes);
    document.body.dataset.fpsCustomObjectives = String(advancedAudit.customObjectives);
    document.body.dataset.fpsDirectionalSectors = String(advancedAudit.directionalSectors);
    document.body.dataset.fpsNavigationPath = String(advancedAudit.navigationPath);
    document.body.dataset.fpsCustomAdventure = this.circusDoom.customAdventure?.active ? 'active' : 'inactive';
    if (!roomAudit.ok) console.warn('FPS room network audit:', roomAudit.errors);
    if (!objectiveAudit.ok) console.warn('FPS objective audit:', objectiveAudit.errors);
    if (!gameplayAudit.ok) console.warn('FPS gameplay audit:', gameplayAudit.errors);
    if (!verticalAudit.ok) console.warn('FPS vertical rendering audit:', verticalAudit.errors);
    if (!advancedAudit.ok) console.warn('FPS advanced gameplay audit:', advancedAudit.errors);
    this.prepareCircusSimulationRoom();
    this.restoreCircusZonePosition(initialZoneId);
    this.ensureCircusCampaignState();
    this.markCainOSZoneVisited(initialZoneId);
    this.loadCircusAvatarSheets();
    this.setupCircusFpsControls();
    this.startCircusArrivalCinematic();
    if (typeof SoundManager.startContextPulse === 'function') {
      SoundManager.startContextPulse('circus');
    }

    this.circusDoomKeyDown = e => {
      const rawKey = e.key.toLowerCase();
      const codeKey = (e.code || '').toLowerCase();
      const key = (rawKey === 'digit1' || codeKey === 'digit1' || codeKey === 'numpad1') ? '1'
        : (rawKey === 'digit2' || codeKey === 'digit2' || codeKey === 'numpad2') ? '2'
          : (rawKey === 'digit3' || codeKey === 'digit3' || codeKey === 'numpad3') ? '3'
            : rawKey;
      const action = this.getCircusControlAction(key);
      if (action || ['arrowup','arrowdown','arrowleft','arrowright','enter',' ','h','1','2','3'].includes(key)) {
        e.preventDefault();
        if (['1','2','3'].includes(key) && this.circusDoom?.interactionChoices) this.chooseCircusDialogueOption(Number(key) - 1);
        else if (action === 'map' && this.circusDoom) {
          this.circusDoom.minimapVisible = !this.circusDoom.minimapVisible;
          this.setCainOSSetting('fps-minimap', this.circusDoom.minimapVisible);
        }
        else if (action === 'journal') this.toggleCircusMissionJournal();
        else if (key === 'h' && this.circusDoom) {
          this.circusDoom.hudVisible = !this.circusDoom.hudVisible;
          this.setCainOSSetting('fps-hud', this.circusDoom.hudVisible);
        }
        else if (action === 'light' && this.circusDoom) {
          this.circusDoom.lightUntil = performance.now() + 12000;
          this.emitCircusNoise(0.18, 'Wacky Watch');
          this.circusDoom.interactionMessage = 'LAMPE WACKY WATCH ACTIVE: protection lumineuse temporaire.';
          this.circusDoom.interactionUntil = performance.now() + 2600;
        }
        else if (key === 'enter' || key === ' ' || action === 'interact') this.handleCircusSimulationInput('enter');
        else this.circusDoom.keys.add(key);
      }
    };
    this.circusDoomKeyUp = e => {
      this.circusDoom?.keys.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', this.circusDoomKeyDown);
    window.addEventListener('keyup', this.circusDoomKeyUp);
    this.circusDoomClick = e => {
      const state = this.circusDoom;
      if (!state) return;
      if (state.portalTransition || state.doorTransition) return;
      if (state.cinematic) {
        this.advanceCircusArrivalCinematic();
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      const hit = [...state.hotspots].reverse().find(spot => x >= spot.x && x <= spot.x + spot.w && y >= spot.y && y <= spot.y + spot.h);
      if (hit) {
        if (hit.kind === 'dialogChoice') {
          this.chooseCircusDialogueOption(hit.choiceIndex);
        } else if (hit.kind === 'character') {
          this.performCircusCharacterAction(hit.sprite);
        } else if (hit.kind === 'prop') {
          this.performCircusPropAction(hit.prop);
        } else {
          state.selectedExitIndex = hit.index;
          this.enterCircusSimulationExit(hit.target);
        }
      } else if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock?.();
      }
    };
    canvas.addEventListener('click', this.circusDoomClick);

    const loop = now => {
      if (!this.circusDoom) return;
      const dt = Math.min(0.05, (now - this.circusDoom.last) / 1000);
      this.circusDoom.last = now;
      this.updateCircusDoom(dt);
      this.drawCircusDoom();
      this.circusDoom.raf = requestAnimationFrame(loop);
    };
    this.circusDoom.raf = requestAnimationFrame(loop);
  },

  stopCircusDoomView() {
    this.storeCircusZonePosition();
    this.saveCircusPersistentWorldState();
    if (this.circusDoom?.raf) cancelAnimationFrame(this.circusDoom.raf);
    if (this.circusDoomKeyDown) window.removeEventListener('keydown', this.circusDoomKeyDown);
    if (this.circusDoomKeyUp) window.removeEventListener('keyup', this.circusDoomKeyUp);
    if (this.circusDoomClick && this.circusDoom?.canvas) this.circusDoom.canvas.removeEventListener('click', this.circusDoomClick);
    if (this.circusVerbClick) document.getElementById('circus-fps-toolbar')?.removeEventListener('click', this.circusVerbClick);
    if (this.circusWorldChange) document.getElementById('circus-world-select')?.removeEventListener('change', this.circusWorldChange);
    if (this.circusMouseMove) document.removeEventListener('mousemove', this.circusMouseMove);
    if (this.circusPointerChange) document.removeEventListener('pointerlockchange', this.circusPointerChange);
    if (this.circusCanvasDoubleClick && this.circusDoom?.canvas) this.circusDoom.canvas.removeEventListener('dblclick', this.circusCanvasDoubleClick);
    if (document.pointerLockElement === this.circusDoom?.canvas) document.exitPointerLock?.();
    this.circusDoom = null;
    this.circusDoomKeyDown = null;
    this.circusDoomKeyUp = null;
    this.circusDoomClick = null;
    this.circusVerbClick = null;
    this.circusWorldChange = null;
    this.circusMouseMove = null;
    this.circusPointerChange = null;
    this.circusCanvasDoubleClick = null;
    if (typeof SoundManager !== 'undefined' && typeof SoundManager.stopContextPulse === 'function') {
      SoundManager.stopContextPulse();
    }
    const loading = document.getElementById('circus-fps-loading');
    const canvas = document.getElementById('circus-doom-canvas');
    document.getElementById('circus-doom-hud')?.classList.remove('cinematic-active', 'conversation-active', 'journal-active');
    document.getElementById('circus-dos-overlay')?.classList.remove('cinematic-active');
    if (loading) loading.hidden = true;
    if (canvas) canvas.setAttribute('aria-busy', 'false');
  },

  loadCircusAvatarSheets() {
    if (this.circusAvatarSheets) {
      const loading = document.getElementById('circus-fps-loading');
      if (loading) loading.hidden = !!this.circusAvatarCoreReady;
      return;
    }
    const sources = {
      base: 'assets/images/cainos-pixel-cast-sheet.png',
      abstracted: 'assets/images/cainos-pixel-cast-sheet-abstracted.png',
      variants: 'assets/images/cainos-pixel-cast-sheet-variants.png',
      requested: 'assets/images/cainos-pixel-cast-sheet-requested-variants.png',
      extra: 'assets/images/cainos-pixel-cast-sheet-extra-variants.png',
      japanese: 'assets/images/cainos-pixel-cast-sheet-japanese-pack.png',
      baseball: 'assets/images/cainos-pixel-cast-sheet-baseball-pack.png',
      rivalBaseball: 'assets/images/cainos-pixel-cast-sheet-rival-baseball-pack.png',
      shadow: 'assets/images/cainos-pixel-cast-sheet-shadow-pack.png',
      horror: 'assets/images/cainos-pixel-cast-sheet-horror-pack.png',
      hunter: 'assets/images/cainos-pixel-cast-sheet-hunter-pack.png',
      gloinks: 'assets/images/cainos-pixel-cast-sheet-gloinks-pack.png',
      abel: 'assets/images/cainos-pixel-cast-sheet-abel-pack.png',
      additionalvoices: 'assets/images/cainos-pixel-cast-sheet-additional-voices.png',
      themachine: 'assets/images/cainos-pixel-cast-sheet-the-machine.png',
      ming: 'assets/images/cainos-pixel-cast-sheet-ming.png',
      gloinkqueenscale: 'assets/images/cainos-pixel-cast-sheet-gloink-queen-scale.png',
      canonA: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-a.png',
      canonB: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-b.png',
      canonC: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-c.png',
      canonD: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-d.png',
      canonE: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-e.png',
      canonF: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-f.png',
      canonG: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-g.png',
      canonH: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-h.png',
      canonI: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-i.png',
      canonJ: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-j.png',
      canonK: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-k.png',
      canonL: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-l.png',
      pomnianimation: 'assets/images/cainos-pomni-animation-sheet.png',
      jaxanimation: 'assets/images/cainos-jax-animation-sheet.png',
      ragathaanimation: 'assets/images/cainos-ragatha-animation-sheet.png',
      kingeranimation: 'assets/images/cainos-kinger-animation-sheet.png',
      gangleanimation: 'assets/images/cainos-gangle-animation-sheet.png',
      zoobleanimation: 'assets/images/cainos-zooble-animation-sheet.png',
      caineanimation: 'assets/images/cainos-caine-animation-sheet.png'
    };
    this.circusAvatarSheets = {};
    this.circusAvatarFrameCache = {};
    this.circusAvatarCoreReady = false;
    const coreKeys = new Set([
      'base', 'pomnianimation', 'jaxanimation', 'ragathaanimation',
      'kingeranimation', 'gangleanimation', 'zoobleanimation', 'caineanimation'
    ]);
    const coreEntries = Object.entries(sources).filter(([key]) => coreKeys.has(key));
    const deferredEntries = Object.entries(sources).filter(([key]) => !coreKeys.has(key));
    const loading = document.getElementById('circus-fps-loading');
    const loadingLabel = document.getElementById('circus-fps-loading-label');
    const loadingFill = document.getElementById('circus-fps-loading-fill');
    const canvas = document.getElementById('circus-doom-canvas');
    let coreFinished = 0;
    let deferredStarted = false;

    if (loading) loading.hidden = false;
    if (loadingFill) loadingFill.style.width = '0%';
    if (canvas) canvas.setAttribute('aria-busy', 'true');

    const startDeferredLoads = () => {
      if (deferredStarted) return;
      deferredStarted = true;
      deferredEntries.forEach(entry => loadImage(entry, false));
    };

    const finishCoreLoad = () => {
      coreFinished += 1;
      const percent = Math.round(coreFinished / Math.max(1, coreEntries.length) * 100);
      if (loadingFill) loadingFill.style.width = `${percent}%`;
      if (loadingLabel) loadingLabel.innerText = `AVATARS ESSENTIELS ${coreFinished}/${coreEntries.length}`;
      if (coreFinished < coreEntries.length) return;
      this.circusAvatarCoreReady = true;
      if (loadingLabel) loadingLabel.innerText = 'AVATARS ESSENTIELS PRETS';
      if (canvas) canvas.setAttribute('aria-busy', 'false');
      setTimeout(() => {
        if (loading) loading.hidden = true;
      }, 220);
      if ('requestIdleCallback' in window) window.requestIdleCallback(startDeferredLoads, { timeout: 900 });
      else setTimeout(startDeferredLoads, 120);
    };

    const loadImage = ([key, src], isCore) => {
      const img = new Image();
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        this.circusAvatarFrameCache = {};
        this.drawCircusDoom?.();
        if (isCore) finishCoreLoad();
      };
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
      this.circusAvatarSheets[key] = img;
    };

    coreEntries.forEach(entry => loadImage(entry, true));
  },

  getCircusAvatarSheetSpec(avatar) {
    const tables = [
      { sheet: 'base', cols: 6, rows: 3, map: {
        pomni: [0, 0], caine: [1, 0], bubble: [2, 0], jax: [3, 0], ragatha: [4, 0], kinger: [5, 0],
        gangle: [0, 1], zooble: [1, 1], queenie: [2, 1], kaufmo: [3, 1], gummigoo: [4, 1], loolilalu: [5, 1],
        fudge: [0, 2], gloinkqueen: [1, 2], mannequin: [2, 2], abel: [3, 2]
      }},
      { sheet: 'abstracted', cols: 5, rows: 2, map: {
        ribbit: [0, 0], scratch: [1, 0], wormo: [2, 0], bizco: [3, 0], rattie: [4, 0],
        spike: [0, 1], pinkcyclops: [1, 1], yellowclown: [2, 1], oyster: [3, 1], bulbcreature: [4, 1]
      }},
      { sheet: 'variants', cols: 4, rows: 3, map: {
        max: [0, 0], chad: [1, 0], orbsman: [2, 0], ganglekawaii: [3, 0],
        ganglecomedy: [0, 1], gangletragedy: [1, 1], evilpomni: [2, 1], eviljax: [3, 1],
        evilragatha: [0, 2], evilkinger: [1, 2], evilzooble: [2, 2], evilorbsman: [3, 2]
      }},
      { sheet: 'requested', cols: 5, rows: 1, map: {
        darkduojax: [0, 0], darkduogangle: [1, 0], maidjax: [2, 0], maidragatha: [3, 0], maidpomni: [4, 0]
      }},
      { sheet: 'extra', cols: 2, rows: 1, map: { maidgangle: [0, 0], jaxgirl: [1, 0] }},
      { sheet: 'japanese', cols: 5, rows: 2, map: {
        beachgangle: [0, 0], japanesegangle: [1, 0], rhinogangle: [2, 0], workgangle: [3, 0], japanesejax: [4, 0],
        japaneseragatha: [0, 1], japanesepomni: [1, 1], japanesekinger: [2, 1], japanesezooble: [3, 1], japanesegummigoo: [4, 1]
      }},
      { sheet: 'baseball', cols: 6, rows: 1, map: {
        baseballjax: [0, 0], baseballzooble: [1, 0], baseballgangle: [2, 0],
        baseballragatha: [3, 0], baseballpomni: [4, 0], baseballkinger: [5, 0]
      }},
      { sheet: 'rivalBaseball', cols: 6, rows: 1, map: {
        rivalbaseballzooble: [0, 0], rivalbaseballpomni: [1, 0], rivalbaseballpinkgiant: [2, 0],
        rivalbaseballragatha: [3, 0], rivalbaseballjax: [4, 0], rivalbaseballkinger: [5, 0]
      }},
      { sheet: 'shadow', cols: 7, rows: 1, map: {
        shadowpomni: [0, 0], shadowjax: [1, 0], shadowragatha: [2, 0], shadowkinger: [3, 0],
        shadowgangle: [4, 0], shadowzooble: [5, 0], shadowcaine: [6, 0]
      }},
      { sheet: 'horror', cols: 5, rows: 1, map: {
        horrorghost: [0, 0], horrormonster: [1, 0], horrorpomnivoid: [2, 0],
        horrorpomnispiral: [3, 0], horrorpomniskull: [4, 0]
      }},
      { sheet: 'hunter', cols: 1, rows: 1, map: { hunterjax: [0, 0] }},
      { sheet: 'gloinks', cols: 6, rows: 1, map: {
        gloinkstar: [0, 0], gloinkcube: [1, 0], gloinkpyramid: [2, 0],
        gloinkcrescent: [3, 0], gloinkpin: [4, 0], gloinkround: [5, 0]
      }},
      { sheet: 'abel', cols: 2, rows: 1, map: { abelmannequin: [0, 0], abelfullbody: [1, 0] }},
      { sheet: 'additionalvoices', cols: 1, rows: 1, map: { additionalvoices: [0, 0] }},
      { sheet: 'themachine', cols: 1, rows: 1, map: { themachine: [0, 0] }},
      { sheet: 'ming', cols: 1, rows: 1, map: { ming: [0, 0] }},
      { sheet: 'gloinkqueenscale', cols: 1, rows: 1, map: { gloinkqueenscale: [0, 0] }},
      { sheet: 'canonA', cols: 4, rows: 1, map: {
        baronmildenhall: [0, 0], marthamildenhall: [1, 0], ghostly: [2, 0], angel: [3, 0]
      }},
      { sheet: 'canonB', cols: 5, rows: 1, map: {
        disappearingguy: [0, 0], committeemember: [1, 0], shrimpnpc: [4, 0]
      }},
      { sheet: 'canonC', cols: 1, rows: 1, map: { chineseroomnpc: [0, 0] }},
      { sheet: 'canonD', cols: 6, rows: 1, map: {
        blueai: [0, 0], cookiebutterfly: [1, 0], gummyelephant: [2, 0],
        giantcentipede: [3, 0], drfootball: [4, 0], spudsycustomer: [5, 0]
      }},
      { sheet: 'canonE', cols: 6, rows: 1, map: {
        candyguardcyan: [0, 0], candyguardblue: [1, 0], candyguardpurple: [2, 0],
        gummyworm: [3, 0], barrelmonkey: [4, 0], jeffery: [5, 0]
      }},
      { sheet: 'canonF', cols: 6, rows: 1, map: {
        redmannequin: [0, 0], orangemannequin: [1, 0], yellowmannequin: [2, 0],
        magentamannequin: [3, 0], mildenhallsouls: [4, 0], albertspudsy: [5, 0]
      }},
      { sheet: 'canonG', cols: 4, rows: 1, map: {
        truthtellerfish: [0, 0], liarfish: [1, 0],
        stupidburgermannequin: [2, 0], cerealmannequin: [3, 0]
      }},
      { sheet: 'canonH', cols: 6, rows: 1, map: {
        bonepastor: [0, 0], ragathamothershadow: [2, 0],
        paintedmasks: [3, 0], zoobleparts: [4, 0], laughingshadows: [5, 0]
      }},
      { sheet: 'canonI', cols: 6, rows: 1, map: {
        abigailbrooks: [0, 0], suzieackerman: [1, 0], zoeyraghavan: [2, 0],
        rileyverselis: [3, 0], grantbest: [4, 0], leeroymateo: [5, 0]
      }},
      { sheet: 'canonJ', cols: 5, rows: 1, map: {
        jaxfather: [0, 0], jaxmother: [1, 0], abigailfriendone: [2, 0],
        abigailfriendtwo: [3, 0], bestchildren: [4, 0]
      }},
      { sheet: 'canonK', cols: 6, rows: 1, map: {
        sun: [0, 0], moon: [1, 0], abstractedkaufmo: [2, 0],
        cellarabstraction: [3, 0], aquaticabstraction: [4, 0], fourthcrocodile: [5, 0]
      }},
      { sheet: 'canonL', cols: 5, rows: 1, map: {
        floatingworm: [0, 0], creditsfish: [1, 0], stabbedragdolls: [2, 0],
        coiledcentipedes: [3, 0], unusedbrainscans: [4, 0]
      }}
    ];
    for (const table of tables) {
      if (table.map[avatar]) {
        const [col, row] = table.map[avatar];
        return { sheet: table.sheet, cols: table.cols, rows: table.rows, col, row };
      }
    }
    return null;
  },

  getCircusAvatarAnimationSpec(avatar, sprite = {}) {
    const animationSheets = {
      pomni: 'pomnianimation',
      jax: 'jaxanimation',
      ragatha: 'ragathaanimation',
      kinger: 'kingeranimation',
      gangle: 'gangleanimation',
      zooble: 'zoobleanimation',
      caine: 'caineanimation'
    };
    const sheet = animationSheets[avatar];
    if (!sheet) return null;
    const state = this.circusDoom;
    const speaking = state?.interactionChannel === 'dialogue'
      && state?.interactionSpeaker === sprite.name
      && performance.now() <= (state?.interactionUntil || 0);
    const animation = speaking ? 'talk'
      : sprite.behavior === 'menace' ? 'hurt'
        : sprite.behavior === 'attentif' ? 'interact'
          : ['pace', 'patrol', 'follow'].includes(sprite.routine) ? 'walk'
            : 'idle';
    const frames = {
      idle: [0, 1],
      walk: [2, 3],
      talk: [4, 5],
      interact: [6],
      hurt: [7]
    }[animation];
    const speed = animation === 'walk' ? 5.5 : animation === 'talk' ? 4.5 : 2.2;
    const frameIndex = frames[Math.floor(performance.now() / 1000 * speed) % frames.length];
    return { sheet, cols: 4, rows: 2, frameIndex, animation };
  },

  getCircusAdventureWorlds() {
    return [
      { episode: 1, target: 31, label: 'EP1 - AVENTURE INTERNE / GLOINKS' },
      { episode: 2, target: 6, label: 'EP2 - CANDY CANYON KINGDOM' },
      { episode: 3, target: 8, label: 'EP3 - MILDENHALL MANOR' },
      { episode: 4, target: 10, label: "EP4 - SPUDSY'S" },
      { episode: 5, target: 11, label: 'EP5 - SUGGESTION BOX' },
      { episode: 6, target: 13, label: 'EP6 - THEY ALL GET GUNS' },
      { episode: 7, target: 14, label: 'EP7 - DIGITAL LAKE' },
      { episode: 8, target: 16, label: 'EP8 - C&A CORE' },
      { episode: 9, target: 18, label: 'EP9 - FINAL CIRCUS' }
    ];
  },

  getCircusFreeWorlds() {
    const canonical = this.getCircusAdventureWorlds();
    const extras = [
      [3, 'TERRAIN DU CIRQUE'], [4, 'CELLAR / KAUFMO'], [5, 'FAUSSE SORTIE'], [7, 'TEST LEVEL'],
      [9, 'SOUS-SOL MILDENHALL'], [12, 'SOFTBALL STADIUM'], [17, 'MEMOIRE DE KINGER'], [19, 'ARCHIVES DES MEMBRES'],
      [20, 'DORTOIRS'], [21, 'CAFE CIRQUE'], [22, 'AQUARIUM'], [23, 'SNOWY SUMMIT'], [24, "POACHER'S PARADISE"],
      [25, 'ANIME HIGH SCHOOL'], [26, 'WHITE HOUSE'], [27, 'THE VOID'], [28, 'ESPACE COMMUN'], [29, 'GALERIE DES PORTES'],
      [32, 'CANDY ROYAL PALACE'], [33, 'ROUTE DU TANKER'], [34, 'ENFER MILDENHALL'], [35, 'CUISINE SPUDSY'],
      [38, 'FAVORITE CHARACTER AWARDS'], [39, 'PHARE DU LAC'], [40, 'TRESOR SUBMERGE'], [41, 'SOUVENIR RUE C&A'],
      [42, 'DIGITAL CARNIVAL'], [43, 'SALLE A MANGER']
    ].map(([target, label]) => ({ episode: 0, target, label: `LIBRE - ${label}` }));
    return [...canonical, ...extras].filter((world, index, list) => list.findIndex(item => item.target === world.target) === index);
  },

  getCircusAdventurePortalConfig() {
    const worlds = this.getCircusAdventureWorlds();
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const freeMode = worlds.every(world => progress.includes(world.episode));
    if (freeMode) {
      const selected = Number(this.getCainOSStorage('fps_free_world', worlds[0].target));
      const freeWorlds = this.getCircusFreeWorlds();
      const world = freeWorlds.find(item => item.target === selected) || worlds[0];
      return { ...world, freeMode, label: `MODE LIBRE - ${world.label.replace(/^EP\d+ - /, '')}` };
    }
    const selectedEpisode = Number(typeof EpisodeManager !== 'undefined' ? EpisodeManager.currentEpisode : NaN);
    const current = worlds.find(world => world.episode === selectedEpisode && !progress.includes(world.episode))
      || worlds.find(world => !progress.includes(world.episode))
      || worlds[0];
    return { ...current, freeMode, label: current.label };
  },

  getCircusPersistentWorldState() {
    const stored = this.getCainOSStorage('fps_world_state', {});
    return {
      discoveries: Array.isArray(stored.discoveries) ? stored.discoveries : [],
      activeProps: Array.isArray(stored.activeProps) ? stored.activeProps : [],
      collected: Array.isArray(stored.collected) ? stored.collected : [],
      given: Array.isArray(stored.given) ? stored.given : [],
      completedObjectives: Array.isArray(stored.completedObjectives) ? stored.completedObjectives : [],
      dialogueVisits: Array.isArray(stored.dialogueVisits) ? stored.dialogueVisits : [],
      challenges: stored.challenges && typeof stored.challenges === 'object' ? stored.challenges : {},
      heldItem: stored.heldItem || null,
      follower: stored.follower || null,
      stability: Number.isFinite(stored.stability) ? stored.stability : 100,
      verb: ['use', 'look', 'take', 'give'].includes(stored.verb) ? stored.verb : 'use',
      currentZoneId: Number.isFinite(stored.currentZoneId) ? stored.currentZoneId : 2,
      zonePositions: stored.zonePositions && typeof stored.zonePositions === 'object' ? stored.zonePositions : {},
      doorStates: Array.isArray(stored.doorStates) ? stored.doorStates : [],
      npcMemories: Array.isArray(stored.npcMemories) ? stored.npcMemories : [],
      dynamicEvents: stored.dynamicEvents && typeof stored.dynamicEvents === 'object' ? stored.dynamicEvents : {},
      missionJournal: Array.isArray(stored.missionJournal) ? stored.missionJournal.slice(-80) : [],
      director: stored.director && typeof stored.director === 'object' ? stored.director : {},
      exploredCells: Array.isArray(stored.exploredCells) ? stored.exploredCells : [],
      npcAgents: Array.isArray(stored.npcAgents) ? stored.npcAgents : [],
      campaigns: stored.campaigns && typeof stored.campaigns === 'object' ? stored.campaigns : {},
      activeCampaign: stored.activeCampaign || null,
      customAdventure: stored.customAdventure || null,
      currentActivity: stored.currentActivity && stored.currentActivity.persistent ? stored.currentActivity : null
    };
  },

  saveCircusPersistentWorldState() {
    const state = this.circusDoom;
    if (!state) return;
    this.setCainOSStorage('fps_world_state', {
      discoveries: [...state.discoveries],
      activeProps: [...state.activeProps.entries()],
      collected: [...state.collectedProps],
      given: [...state.givenProps],
      completedObjectives: [...state.completedZoneObjectives],
      dialogueVisits: [...state.dialogueVisits.entries()],
      challenges: state.zoneChallenges || {},
      heldItem: state.heldItem || null,
      follower: state.follower || null,
      stability: Math.max(0, Math.min(100, state.stability || 0)),
      verb: state.interactionVerb || 'use',
      currentZoneId: state.currentZoneId,
      zonePositions: state.zonePositions || {},
      doorStates: [...(state.doorStates || new Map()).entries()],
      npcMemories: [...(state.npcMemories || new Map()).entries()],
      dynamicEvents: state.dynamicEventState || {},
      missionJournal: (state.missionJournal || []).slice(-80),
      director: state.director || {},
      exploredCells: [...(state.exploredCells || new Map()).entries()].map(([zoneId, cells]) => [zoneId, [...cells]]),
      npcAgents: [...(state.npcAgents || new Map()).entries()].map(([id, agent]) => [id, {
        x: agent.x,
        z: agent.z,
        destination: agent.destination || null,
        nextTargetAt: agent.nextTargetAt || 0,
        facing: agent.facing || 0
      }]),
      campaigns: state.campaigns || {},
      activeCampaign: state.activeCampaign || null,
      customAdventure: state.customAdventure || null,
      currentActivity: state.currentActivity?.persistent ? state.currentActivity : null
    });
  },

  recordCircusMissionJournal(type, title, detail, meta = {}) {
    const state = this.circusDoom;
    if (!state || !title || !detail) return;
    const previous = state.missionJournal?.[state.missionJournal.length - 1];
    const signature = `${type}:${state.currentZoneId}:${title}:${detail}`;
    if (previous?.signature === signature && Date.now() - previous.at < 4000) return;
    state.missionJournal = state.missionJournal || [];
    state.missionJournal.push({
      signature,
      type,
      title,
      detail,
      zone: state.currentZoneId,
      episode: this.getActiveCircusCampaignStatus()?.definition?.episode || this.getCircusTimelineContext().episode,
      at: Date.now(),
      ...meta
    });
    state.missionJournal = state.missionJournal.slice(-80);
  },

  toggleCircusMissionJournal(force = null) {
    const state = this.circusDoom;
    if (!state) return;
    state.journalVisible = force === null ? !state.journalVisible : !!force;
    state.interactionChoices = null;
    SoundManager.playClick();
  },

  storeCircusZonePosition(zoneId = null) {
    const state = this.circusDoom;
    const id = Number.isFinite(zoneId) ? zoneId : state?.currentZoneId;
    if (!state || !Number.isFinite(id)) return;
    state.zonePositions[id] = { x: state.player.x, z: state.player.z, a: state.player.a };
  },

  restoreCircusZonePosition(zoneId) {
    const state = this.circusDoom;
    const saved = state?.zonePositions?.[zoneId];
    if (!state || !saved || !Number.isFinite(saved.x) || !Number.isFinite(saved.z)) return false;
    if (!this.canMoveInCircusRoom(saved.x, saved.z)) return false;
    state.player.x = saved.x;
    state.player.z = saved.z;
    state.player.a = Number.isFinite(saved.a) ? saved.a : state.player.a;
    return true;
  },

  getCircusFpsCampaignDefinition(episode = 1) {
    const pilotStages = [
        { title: 'Arrivee du sujet sans nom', zone: 2, guide: 'Rejoignez Caine et Ragatha sur la piste.', requirements: [
          { action: 'talk', target: 'caine', count: 1 }, { action: 'talk', target: 'ragatha', count: 1 }, { action: 'look', target: 'ring', count: 1 }
        ] },
        { title: 'Regles du Cirque', zone: 2, guide: 'Ecoutez Caine puis calibrez la piste et ses projecteurs.', requirements: [
          { action: 'talk', target: 'caine', count: 1 }, { action: 'use', target: 'spotlight', count: 2 }, { action: 'look', target: 'ring', count: 1 }
        ] },
        { title: 'Tour, Vide et fausse sortie', zone: 3, guide: 'Suivez le tour vers le terrain, le Vide et le labyrinthe de sortie.', requirements: [
          { action: 'visit', target: '3', count: 1 }, { action: 'visit', target: '27', count: 1 }, { action: 'visit', target: '5', count: 1 }
        ] },
        { title: 'Le nom Pomni', zone: 2, guide: 'Revenez sur la piste pour assister a l attribution du nom.', requirements: [
          { action: 'visit', target: '2', count: 1 }, { action: 'talk', target: 'caine', count: 1 }, { action: 'talk', target: 'pomni', count: 1 }
        ] },
        { title: 'Aventure Gloink', zone: 31, guide: 'Traversez le portail, recuperez une piece de Zooble et identifiez le nid.', requirements: [
          { action: 'visit', target: '31', count: 1 }, { action: 'look', target: 'gloinknest', count: 1 }, { action: 'take', target: 'zooblepart', count: 1 }, { action: 'talk', target: 'gloinkqueenscale', count: 1 }
        ] },
        { title: 'Kaufmo abstrait', zone: 4, guide: 'Rejoignez le cellar, utilisez la lumiere et survivez au signal Kaufmo.', requirements: [
          { action: 'visit', target: '4', count: 1 }, { action: 'use', target: 'candle', count: 1 }, { action: 'survive', target: 'kaufmo', count: 3 }
        ] },
        { title: 'Secours de Ragatha et Zooble', zone: 4, guide: 'Stabilisez le groupe sans traiter Kaufmo comme un personnage actif.', requirements: [
          { action: 'talk', target: 'ragatha', count: 1 }, { action: 'talk', target: 'zooble', count: 1 }, { action: 'give', target: 'zooblepart', count: 1 }
        ] },
        { title: 'Fausse sortie et retour', zone: 5, guide: 'Testez les cadres, inspectez le bureau impossible puis revenez au chapiteau.', requirements: [
          { action: 'use', target: 'exitframe', count: 3 }, { action: 'look', target: 'desk', count: 1 }, { action: 'visit', target: '2', count: 1 }
        ] }
    ];
    if (episode === 1) return {
      episode: 1,
      title: 'Pilot / CAMPAGNE FPS',
      canonBoundary: 'Reconstitution jouable additive. Les dialogues du transcript restent dans Simulation Control.',
      stages: pilotStages
    };
    const blueprints = {
      2: { title: 'Candy Carrier Chaos!', steps: [
        [2, 'talk', 'pomni'], [6, 'look', 'candy'], [32, 'talk', 'loolilalu'], [33, 'use', 'truck'],
        [7, 'look', 'archive'], [7, 'talk', 'gummigoo'], [6, 'talk', 'gummigoo'], [6, 'look', 'candy']
      ] },
      3: { title: 'The Mystery Of Mildenhall Manor', steps: [
        [2, 'talk', 'pomni'], [8, 'use', 'candle'], [8, 'talk', 'marthamildenhall'], [8, 'survive', 'mildenhall'],
        [9, 'talk', 'kinger'], [34, 'use', 'candle'], [17, 'talk', 'queenie'], [8, 'visit', '8']
      ] },
      4: { title: 'Fast Food Masquerade', steps: [
        [2, 'talk', 'gangle'], [10, 'look', 'menu'], [35, 'use', 'counter'], [10, 'take', 'menu'],
        [10, 'talk', 'max'], [37, 'look', 'archive'], [10, 'talk', 'workgangle'], [10, 'use', 'counter']
      ] },
      5: { title: 'Untitled', steps: [
        [2, 'talk', 'ragatha'], [11, 'look', 'card'], [24, 'talk', 'hunterjax'], [26, 'look', 'console'],
        [25, 'look', 'card'], [28, 'talk', 'ragatha'], [12, 'use', 'scoreboard'], [12, 'use', 'base']
      ] },
      6: { title: 'They All Get Guns', steps: [
        [2, 'talk', 'zooble'], [13, 'look', 'target'], [13, 'use', 'target'], [13, 'talk', 'jax'],
        [13, 'use', 'target'], [2, 'talk', 'kinger'], [2, 'talk', 'pomni'], [38, 'look', 'spotlight']
      ] },
      7: { title: 'Beach Episode', steps: [
        [2, 'talk', 'caine'], [14, 'use', 'umbrella'], [14, 'talk', 'sun'], [15, 'look', 'console'],
        [15, 'take', 'card'], [16, 'talk', 'abelmannequin'], [15, 'use', 'gridnode'], [16, 'use', 'console']
      ] },
      8: { title: 'hjsakldfhl', steps: [
        [17, 'talk', 'queenie'], [17, 'talk', 'kinger'], [2, 'talk', 'caine'], [28, 'talk', 'ragatha'],
        [16, 'look', 'archive'], [16, 'use', 'console'], [16, 'talk', 'caine'], [16, 'survive', 'core']
      ] },
      9: { title: 'Remember', steps: [
        [18, 'look', 'memory'], [16, 'use', 'console'], [19, 'talk', 'ribbit'], [18, 'talk', 'caine'],
        [18, 'talk', 'jax'], [41, 'look', 'memory'], [18, 'look', 'archive'], [18, 'talk', 'pomni']
      ] }
    };
    const blueprint = blueprints[episode];
    if (!blueprint) return null;
    const checkpoints = (typeof EpisodeManager !== 'undefined' ? EpisodeManager.storyCheckpointConfig?.[episode] : null) || [];
    const stages = blueprint.steps.map(([zone, action, target], index) => {
      const checkpoint = checkpoints[index] || {};
      const requirements = [{ action: 'visit', target: String(zone), count: 1 }];
      if (!(action === 'visit' && String(target) === String(zone))) requirements.push({ action, target, count: action === 'survive' ? 4 : 1 });
      return {
        title: checkpoint.title || `Acte ${index + 1}`,
        zone,
        guide: checkpoint.objective || `Suivez le signal ${String(target).toUpperCase()} dans cette scene.`,
        transcriptAfter: checkpoint.after || 0,
        requirements
      };
    });
    return {
      episode,
      title: `${blueprint.title} / CAMPAGNE FPS`,
      canonBoundary: 'Reconstitution jouable additive issue des checkpoints du transcript. Elle ne remplace aucun dialogue canonique.',
      stages
    };
  },

  unlockCircusCampaignStageZone(stage) {
    const state = this.circusDoom;
    if (!state || !stage || !state.portals[stage.zone]) return;
    state.portals[stage.zone].unlocked = true;
  },

  ensureCircusCampaignState() {
    const state = this.circusDoom;
    if (!state) return;
    const portalEpisode = state.adventurePortal?.episode || 1;
    const definition = this.getCircusFpsCampaignDefinition(portalEpisode);
    if (!definition) return;
    const stored = state.campaigns[definition.episode] || { stage: 0, progress: {}, complete: false };
    state.campaigns[definition.episode] = stored;
    state.activeCampaign = stored.complete ? null : { episode: definition.episode };
    if (!stored.complete) {
      const stage = definition.stages[stored.stage];
      this.unlockCircusCampaignStageZone(stage);
      if (stage?.zone === state.currentZoneId) this.advanceCircusCampaign('visit', String(stage.zone));
    }
  },

  getActiveCircusCampaignStatus() {
    const state = this.circusDoom;
    const episode = state?.activeCampaign?.episode;
    const definition = this.getCircusFpsCampaignDefinition(episode);
    const progress = definition ? state.campaigns[episode] : null;
    if (!state || !definition || !progress || progress.complete) return null;
    const stage = definition.stages[progress.stage];
    if (!stage) return null;
    const requirements = stage.requirements.map((requirement, index) => {
      const key = `${progress.stage}:${index}`;
      const current = Math.min(requirement.count, progress.progress[key] || 0);
      return { ...requirement, current, complete: current >= requirement.count };
    });
    return { definition, progress, stage, requirements, complete: requirements.every(item => item.complete) };
  },

  advanceCircusCampaign(action, target, amount = 1) {
    const state = this.circusDoom;
    const status = this.getActiveCircusCampaignStatus();
    if (!state || !status) return false;
    let changed = false;
    status.requirements.forEach((requirement, index) => {
      if (requirement.complete || requirement.action !== action || String(requirement.target) !== String(target)) return;
      const key = `${status.progress.stage}:${index}`;
      status.progress.progress[key] = Math.min(requirement.count, (status.progress.progress[key] || 0) + amount);
      changed = true;
    });
    if (!changed) return false;
    const refreshed = this.getActiveCircusCampaignStatus();
    if (refreshed?.complete) {
      const completedTitle = refreshed.stage.title;
      this.recordCircusMissionJournal('campaign', `Acte termine: ${completedTitle}`, refreshed.stage.guide, {
        episode: refreshed.definition.episode,
        stage: refreshed.progress.stage
      });
      refreshed.progress.stage++;
      if (refreshed.progress.stage >= refreshed.definition.stages.length) {
        refreshed.progress.complete = true;
        state.activeCampaign = null;
        state.interactionMessage = `CAMPAGNE EP${refreshed.definition.episode} TERMINEE: retour libre au chapiteau. Le transcript reste disponible separement.`;
        this.unlockCainOSAchievement(`fps_campaign_ep${refreshed.definition.episode}`, `Episode ${refreshed.definition.episode} termine en campagne FPS`);
        SoundManager.playWin();
      } else {
        const next = refreshed.definition.stages[refreshed.progress.stage];
        this.unlockCircusCampaignStageZone(next);
        state.interactionMessage = `ACTE TERMINE: ${completedTitle}. PROCHAIN: ${next.title} / ${next.guide}`;
        this.startCircusDynamicEvent('campaign-advance', { speaker: 'CAINE', text: next.guide, duration: 5200 });
        SoundManager.playWin();
        if (next.zone === state.currentZoneId) this.advanceCircusCampaign('visit', String(next.zone));
      }
      state.interactionUntil = performance.now() + 5600;
      state.interactionChannel = 'system';
      state.interactionSpeaker = 'CAINOS';
    }
    this.saveCircusPersistentWorldState();
    return true;
  },

  updateCircusCampaignTimedProgress(dt) {
    const state = this.circusDoom;
    const status = this.getActiveCircusCampaignStatus();
    if (!state || !status || status.stage.zone !== state.currentZoneId) return;
    const requirement = status.requirements.find(item => item.action === 'survive' && !item.complete);
    if (!requirement) {
      state.campaignSurvival = { key: '', elapsed: 0 };
      return;
    }
    const key = `${status.definition.episode}:${status.progress.stage}:${requirement.target}`;
    if (state.campaignSurvival.key !== key) state.campaignSurvival = { key, elapsed: 0 };
    state.campaignSurvival.elapsed += dt;
    if (state.campaignSurvival.elapsed >= 2) {
      state.campaignSurvival.elapsed -= 2;
      this.advanceCircusCampaign('survive', requirement.target, 1);
    }
  },

  getCircusDirectorPool() {
    const state = this.circusDoom;
    const campaign = this.getActiveCircusCampaignStatus();
    if (!state) return [];
    const local = this.getCircusDynamicEventDefinitions(state.currentZoneId);
    const system = campaign ? [{
      id: `director-objective-${campaign.definition.episode}-${campaign.progress.stage}`,
      speaker: 'CAINOS',
      channel: 'system',
      text: `OBJECTIF ACTIF: ${campaign.stage.guide}`,
      duration: 4200
    }] : [];
    return [...local, ...system].filter(event => {
      const minimumEpisode = Number(event.minimumEpisode || 0);
      return !minimumEpisode || this.getCircusTimelineContext().episode >= minimumEpisode;
    });
  },

  updateCircusEventDirector(dt) {
    const state = this.circusDoom;
    if (!state || state.cinematic || state.interactionChoices || state.activeDynamicEvent) return;
    const now = performance.now();
    state.director = state.director || {};
    if (!Number.isFinite(state.director.nextAt)) state.director.nextAt = now + 18000;
    if (now < state.director.nextAt) return;
    const pool = this.getCircusDirectorPool();
    const recent = new Set((state.director.recent || []).slice(-3));
    const candidates = pool.filter(event => !recent.has(event.id));
    const event = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
    state.director.nextAt = now + 26000 + Math.random() * 18000;
    if (!event) return;
    state.director.recent = [...(state.director.recent || []), event.id].slice(-5);
    this.startCircusDynamicEvent(event.id, event);
    this.recordCircusMissionJournal(event.channel === 'system' || event.speaker === 'CainOS' ? 'system' : 'event', event.speaker, event.text);
  },

  drawCircusCampaignHud(ctx, w, h, state) {
    const status = this.getActiveCircusCampaignStatus();
    if (!status || !state.hudVisible) return;
    const done = status.requirements.filter(item => item.complete).length;
    const y = w < 480 ? 148 : 48;
    ctx.save();
    ctx.fillStyle = 'rgba(5,2,13,0.84)';
    ctx.strokeStyle = '#ffd84a';
    ctx.fillRect(14, y, 252, 42);
    ctx.strokeRect(14, y, 252, 42);
    ctx.fillStyle = '#ffd84a';
    ctx.font = 'bold 8px Courier New';
    ctx.textAlign = 'left';
    const shortTitle = status.stage.title.toUpperCase().slice(0, 30);
    ctx.fillText(`EP${status.definition.episode} ${status.progress.stage + 1}/${status.definition.stages.length}: ${shortTitle}`, 22, y + 15);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px Courier New';
    ctx.fillText(`${done}/${status.requirements.length} ETAPES | DESTINATION ${state.portals[status.stage.zone]?.short || status.stage.zone}`, 22, y + 29);
    ctx.fillStyle = '#7df0ff';
    ctx.fillRect(22, y + 33, 232 * (done / Math.max(1, status.requirements.length)), 4);
    ctx.restore();
  },

  drawCircusMissionJournal(ctx, w, h, state) {
    if (!state.journalVisible) return;
    const entries = (state.missionJournal || []).slice(-7).reverse();
    const panelW = Math.min(360, w - 30);
    const y = w < 480 ? 106 : 42;
    const panelH = Math.min(h - y - 18, 84 + entries.length * 36);
    const x = (w - panelW) / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(5,2,13,0.96)';
    ctx.strokeStyle = '#7df0ff';
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, panelW, panelH);
    ctx.strokeRect(x, y, panelW, panelH);
    ctx.fillStyle = '#ffd84a';
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('JOURNAL DU VISITEUR 251', x + 12, y + 19);
    ctx.fillStyle = '#8b8794';
    ctx.font = '7px Courier New';
    ctx.fillText('J ou bouton JOURNAL pour fermer', x + 12, y + 32);
    entries.forEach((entry, index) => {
      const lineY = y + 52 + index * 36;
      ctx.fillStyle = entry.type === 'campaign' ? '#ffd84a' : entry.type === 'dialogue' ? '#ff8ccc' : '#7df0ff';
      ctx.font = 'bold 8px Courier New';
      ctx.fillText(`[EP${entry.episode || '?'} / ${state.portals[entry.zone]?.short || entry.zone}] ${entry.title}`.slice(0, 56), x + 12, lineY);
      ctx.fillStyle = '#ffffff';
      ctx.font = '7px Courier New';
      ctx.fillText(String(entry.detail).slice(0, 72), x + 12, lineY + 12);
    });
    if (!entries.length) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px Courier New';
      ctx.fillText('Aucune trace. Explorez, observez ou parlez a un personnage.', x + 12, y + 60);
    }
    ctx.restore();
  },

  getCircusDynamicEventDefinitions(zoneId) {
    const events = {
      2: [
        { id: 'caine-briefing', speaker: 'Caine', text: 'Tout le monde sur la piste! Une aventure ne se lance pas toute seule, sauf quand elle le fait.', avatar: 'caine', duration: 5200 },
        { id: 'bubble-interrupt', speaker: 'Bubble', text: 'Je peux choisir la porte! Je peux aussi choisir toutes les portes!', avatar: 'bubble', duration: 4200 },
        { id: 'group-check', speaker: 'CainOS', channel: 'system', text: 'MOUVEMENT DE GROUPE: Ragatha et Gangle restent pres du portail actif.', avatars: ['ragatha', 'gangle'], duration: 4800 }
      ],
      3: [
        { id: 'gloink-sweep', speaker: 'CainOS', text: 'Plusieurs petits signaux geometriques traversent le terrain en direction du chapiteau.', avatar: 'gloinkstar', duration: 4500 },
        { id: 'moon-call', speaker: 'Moon', text: 'Le terrain parait ouvert, mais le ciel reste une limite de simulation.', avatar: 'moon', duration: 4600 }
      ],
      4: [
        { id: 'kaufmo-warning', speaker: 'CainOS', text: 'ALERTE: le signal Kaufmo reagit au bruit. La lumiere le repousse a courte portee.', avatar: 'abstractedkaufmo', duration: 5200, danger: true },
        { id: 'ragatha-rescue', speaker: 'Ragatha', text: 'Ne reste pas entre Kaufmo et la porte. Garde Zooble dans ton champ de vision.', avatar: 'ragatha', duration: 5000 }
      ],
      5: [
        { id: 'exit-loop', speaker: 'Pomni', text: 'Les bureaux se repetent. Cette porte imite une sortie, elle ne la prouve pas.', avatar: 'pomni', duration: 5200 },
        { id: 'caine-recall', speaker: 'Caine', text: 'Cette zone n est absolument pas une sortie autorisee! Retour vers la piste!', avatar: 'caine', duration: 4700 }
      ],
      6: [{ id: 'convoy-call', speaker: 'Gummigoo', text: 'Le tanker est pret. La route ne restera pas stable longtemps.', avatar: 'gummigoo', duration: 4600 }],
      8: [{ id: 'ghost-flicker', speaker: 'Kinger', text: 'Eteins ce qui fait trop de bruit. Dans le noir, certaines choses deviennent plus claires.', avatar: 'kinger', duration: 5200, danger: true }],
      10: [{ id: 'spudsy-rush', speaker: 'Gangle', text: 'Nouveau rush. Lis le ticket, prepare le comptoir, puis donne la bonne commande.', avatar: 'workgangle', duration: 5000 }],
      12: [{ id: 'softball-pitch', speaker: 'Caine', text: 'Batteur en place! Frappez uniquement quand le curseur traverse la zone verte!', avatar: 'caine', duration: 4600 }],
      14: [{ id: 'sun-warning', speaker: 'Sun', text: 'Le soleil digital augmente la visibilite. Les parasols deviennent des zones sures.', avatar: 'sun', duration: 4700 }],
      31: [{ id: 'gloink-theft', speaker: 'Zooble', text: 'Ils ont encore pris une piece. Recupere-la avant d approcher la reine.', avatar: 'zooble', duration: 5200 }]
    };
    return events[zoneId] || [];
  },

  startCircusDynamicEvent(id, options = {}) {
    const state = this.circusDoom;
    if (!state) return;
    state.activeDynamicEvent = {
      id,
      speaker: options.speaker || 'CAINOS',
      text: options.text || 'Evenement de simulation detecte.',
      avatar: options.avatar || null,
      avatars: options.avatars || null,
      danger: !!options.danger,
      channel: options.channel || (['CainOS', 'CAINOS'].includes(options.speaker) ? 'system' : 'dialogue'),
      startedAt: performance.now(),
      duration: options.duration || 4500
    };
    state.interactionMessage = state.activeDynamicEvent.text;
    state.interactionUntil = performance.now() + state.activeDynamicEvent.duration;
    state.interactionChannel = state.activeDynamicEvent.channel;
    state.interactionSpeaker = state.activeDynamicEvent.speaker;
    const source = options.avatar || options.avatars?.[0]
      ? { x: options.avatars?.length > 1 ? -0.8 : 0, z: -2.65 }
      : { x: state.player.x, z: state.player.z, space: 'world' };
    this.playCircusSpatialObjectSound(source, id);
  },

  triggerCircusZoneDynamicEvent(zoneId) {
    const state = this.circusDoom;
    if (!state) return;
    const definitions = this.getCircusDynamicEventDefinitions(zoneId);
    if (!definitions.length) return;
    const previous = state.dynamicEventState[zoneId] || { visits: 0, lastIndex: -1 };
    const index = (previous.lastIndex + 1) % definitions.length;
    state.dynamicEventState[zoneId] = { visits: previous.visits + 1, lastIndex: index };
    this.startCircusDynamicEvent(definitions[index].id, definitions[index]);
  },

  updateCircusDynamicEvents() {
    const state = this.circusDoom;
    if (!state?.activeDynamicEvent) return;
    if (performance.now() - state.activeDynamicEvent.startedAt >= state.activeDynamicEvent.duration) {
      state.activeDynamicEvent = null;
    }
  },

  getCircusDynamicEventSprites(zoneId) {
    const event = this.circusDoom?.activeDynamicEvent;
    if (!event || (!event.avatar && !event.avatars?.length)) return [];
    const colors = { caine: '#ffd84a', bubble: '#f7f7ff', gloinkstar: '#7348ff', moon: '#9edcff', abstractedkaufmo: '#050505', cellarabstraction: '#030303', aquaticabstraction: '#02020a', ragatha: '#d64545', pomni: '#e53935', gummigoo: '#d8a23a', kinger: '#d9d0a2', workgangle: '#f7f7f7', sun: '#ffd33d', zooble: '#ff4fb8' };
    const avatars = event.avatars?.length ? event.avatars : [event.avatar];
    return avatars.map((avatar, index) => ({
      name: avatar.charAt(0).toUpperCase() + avatar.slice(1),
      type: avatar,
      avatar,
      x: (index - (avatars.length - 1) / 2) * 1.45,
      z: -2.65 - Math.abs(index - (avatars.length - 1) / 2) * 0.18,
      color: colors[avatar] || '#fff1a8',
      routine: event.danger ? 'tremble' : 'hover',
      eventSprite: true
    }));
  },

  updateCircusSocialAI() {
    const state = this.circusDoom;
    if (!state || state.cinematic || state.interactionChoices || state.activeDynamicEvent) return;
    if (performance.now() - (state.lastSocialSceneAt || 0) < 18000) return;
    const sprites = [...this.getCircusZoneSprites(state.currentZoneId), ...this.getCircusCustomAdventureSprites(state.currentZoneId, state)]
      .filter(sprite => ['pomni', 'ragatha', 'jax', 'kinger', 'gangle', 'zooble'].includes(sprite.baseAvatar || sprite.avatar || sprite.type));
    if (sprites.length < 2) return;
    const pair = sprites.slice(0, 2);
    const pairKey = pair.map(sprite => sprite.baseAvatar || sprite.avatar || sprite.type).sort().join(':');
    const lines = {
      'gangle:jax': 'Jax teste la patience de Gangle; elle resserre son masque et se rapproche du groupe.',
      'gangle:kinger': 'Kinger ralentit pres de Gangle et lui indique un passage moins expose dans le decor.',
      'gangle:pomni': 'Pomni remarque l etat du masque de Gangle; Gangle lui designe le chemin suivi par le groupe.',
      'gangle:ragatha': 'Ragatha verifie calmement que Gangle suit encore le groupe avant de reprendre la marche.',
      'gangle:zooble': 'Zooble baisse le ton pendant que Gangle verifie l etat de son masque.',
      'jax:kinger': 'Jax traite le prochain obstacle comme une plaisanterie; Kinger pointe pourtant le danger exact.',
      'jax:pomni': 'Jax indique une porte douteuse a Pomni; elle refuse de quitter le trajet deja verifie.',
      'pomni:ragatha': 'Ragatha demande a Pomni de garder une porte fixe comme repere pendant que la scene change.',
      'jax:ragatha': 'Jax provoque Ragatha; elle ramene la discussion vers le groupe sans lui donner raison.',
      'jax:zooble': 'Zooble coupe court a une provocation de Jax et reprend sa propre route sans le suivre.',
      'kinger:pomni': 'Kinger parle doucement; Pomni cesse un instant de chercher une sortie dans chaque mur.',
      'kinger:ragatha': 'Ragatha laisse a Kinger le temps d examiner la zone avant de rappeler le prochain objectif.',
      'kinger:zooble': 'Zooble attend pendant que Kinger reconstruit son orientation a partir des ombres de la piece.',
      'pomni:zooble': 'Pomni et Zooble observent la meme anomalie sans accepter la premiere explication de CainOS.',
      'ragatha:zooble': 'Ragatha propose de rejoindre le groupe; Zooble confirme le trajet mais garde ses distances.'
    };
    const text = lines[pairKey] || `${pair[0].name} et ${pair[1].name} maintiennent un repere commun pendant que le decor se recompose.`;
    state.lastSocialSceneAt = performance.now();
    state.npcMemories.set(pairKey, (state.npcMemories.get(pairKey) || 0) + 1);
    this.startCircusDynamicEvent(`social-${pairKey}`, {
      speaker: `${pair[0].name} / ${pair[1].name}`,
      channel: 'scene',
      text,
      avatars: pair.map(sprite => sprite.avatar || sprite.type),
      duration: 5200
    });
  },

  getCircusIntroSteps() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const knowsPomni = progress.includes(1);
    const afterFinal = progress.includes(9);
    const steps = [
      { speaker: 'CAINOS', avatar: 'caine', line: 'PROJECTION SUJET #251 TERMINEE. Le signal est injecte comme visiteur CainOS et ne remplace aucun membre du transcript.' },
      { speaker: 'Caine', avatar: 'caine', line: 'Un avatar non repertorie sur ma piste! Magnifique! Je vais t appeler Visiteur 251 jusqu a ce que cette interface trouve mieux.' },
      { speaker: 'Ragatha', avatar: 'ragatha', line: 'Tu n apparais pas dans nos souvenirs enregistres. Reste avec le groupe pendant que la simulation se stabilise.' }
    ];
    steps.push(knowsPomni
      ? { speaker: 'Pomni', avatar: 'pomni', line: 'Ne prends pas les portes pour des sorties. Ici, elles menent surtout aux aventures de Caine.' }
      : { speaker: 'CAINOS', avatar: 'caine', line: 'PROFIL DU PROCHAIN SUJET MASQUE: son identite et son nom ne sont pas encore connus a ce point de la chronologie.' });
    if (!afterFinal) {
      steps.push({ speaker: 'Jax', avatar: 'jax', line: 'Super. Un observateur avec des boutons. Essaie au moins de ne pas casser le decor avant moi.' });
    } else {
      steps.push({ speaker: 'Kinger', avatar: 'kinger', line: 'Le Cirque se souvient de Jax, mais il ne faut pas confondre une archive avec une presence.' });
    }
    steps.push(
      { speaker: 'Gangle', avatar: 'gangle', line: 'Si tu veux aider, observe ce qui change et rapporte les objets aux bonnes personnes.' },
      { speaker: 'Zooble', avatar: 'zooble', line: 'Tu es un visiteur, pas un nouveau jouet de Caine. Garde cette difference en tete.' },
      { speaker: 'Caine', avatar: 'caine', line: afterFinal ? 'Les mondes restent ouverts! Choisis une destination dans le selecteur et mon portail fera le reste.' : 'L aventure correspondant a la progression est prete. Regarde la piste: je fais apparaitre le portail maintenant!' }
    );
    return steps;
  },

  getCircusControlBindings() {
    const defaults = {
      forward: 'z', backward: 's', left: 'q', right: 'd', interact: 'e',
      sprint: 'shift', crouch: 'c', journal: 'j', map: 'm', light: 'f'
    };
    const stored = this.getCainOSSetting('fps-bindings', {});
    return { ...defaults, ...(stored && typeof stored === 'object' ? stored : {}) };
  },

  getCircusControlAction(key) {
    const normalized = String(key || '').toLowerCase();
    const bindings = this.circusDoom?.controlBindings || this.getCircusControlBindings();
    return Object.keys(bindings).find(action => bindings[action] === normalized) || null;
  },

  isCircusControlDown(action) {
    const state = this.circusDoom;
    const key = (state?.controlBindings || this.getCircusControlBindings())[action];
    return !!state?.keys?.has(key);
  },

  setupCircusFpsControls() {
    const state = this.circusDoom;
    const canvas = state?.canvas;
    const toolbar = document.getElementById('circus-fps-toolbar');
    const selector = document.getElementById('circus-world-selector');
    const select = document.getElementById('circus-world-select');
    if (!state || !canvas || !toolbar) return;
    this.updateCircusFpsToolbar();
    this.circusVerbClick = event => {
      if (event.target.closest('#circus-fps-journal')) {
        this.toggleCircusMissionJournal();
        return;
      }
      const button = event.target.closest('[data-fps-verb]');
      if (!button) return;
      this.setCircusInteractionVerb(button.getAttribute('data-fps-verb'));
    };
    toolbar.addEventListener('click', this.circusVerbClick);
    const config = this.getCircusAdventurePortalConfig();
    if (selector && select) {
      selector.hidden = !config.freeMode;
      select.innerHTML = this.getCircusFreeWorlds().map(world => (
        `<option value="${world.target}" ${world.target === config.target ? 'selected' : ''}>${this.escapeHTML(world.label.replace(/^EP\d+ - /, ''))}</option>`
      )).join('');
      this.circusWorldChange = () => {
        const target = Number(select.value);
        if (!Number.isFinite(target)) return;
        this.setCainOSStorage('fps_free_world', target);
        state.adventurePortal = this.getCircusAdventurePortalConfig();
        if (state.portals[target]) state.portals[target].unlocked = true;
        this.circusZonePropsCache?.delete(2);
        state.interactionMessage = `Caine recale le portail vers ${state.adventurePortal.label}.`;
        state.interactionUntil = performance.now() + 3200;
        state.interactionChannel = 'system';
        state.interactionSpeaker = 'CAINE';
        SoundManager.play(760, 0.1, 'triangle', 0.055);
      };
      select.addEventListener('change', this.circusWorldChange);
    }
    this.circusMouseMove = event => {
      if (document.pointerLockElement !== canvas || !this.circusDoom || this.circusDoom.cinematic) return;
      const direction = this.circusDoom.invertMouse ? -1 : 1;
      this.circusDoom.player.a += event.movementX * this.circusDoom.mouseSensitivity * direction;
    };
    this.circusPointerChange = () => canvas.classList.toggle('pointer-locked', document.pointerLockElement === canvas);
    this.circusCanvasDoubleClick = () => canvas.requestPointerLock?.();
    document.addEventListener('mousemove', this.circusMouseMove);
    document.addEventListener('pointerlockchange', this.circusPointerChange);
    canvas.addEventListener('dblclick', this.circusCanvasDoubleClick);
  },

  updateCircusFpsToolbar() {
    const state = this.circusDoom;
    if (!state) return;
    document.querySelectorAll('[data-fps-verb]').forEach(button => {
      button.classList.toggle('active', button.getAttribute('data-fps-verb') === state.interactionVerb);
    });
    const held = document.getElementById('circus-fps-held');
    const stability = document.getElementById('circus-fps-stability');
    if (held) held.innerText = state.heldItem ? `MAIN: ${state.heldItem.name}` : 'MAIN: VIDE';
    if (stability) {
      stability.innerText = `STABILITE ${Math.round(state.stability)}%`;
      stability.style.color = state.stability < 35 ? '#ff5b4d' : state.stability < 65 ? '#ffd84a' : '#9cff6d';
    }
  },

  setCircusInteractionVerb(verb) {
    const state = this.circusDoom;
    if (!state || !['use', 'look', 'take', 'give'].includes(verb)) return;
    state.interactionVerb = verb;
    this.updateCircusFpsToolbar();
    this.saveCircusPersistentWorldState();
    SoundManager.playClick();
  },

  startCircusArrivalCinematic() {
    const state = this.circusDoom;
    if (!state || this.getCainOSStorage('fps_intro_seen', false)) return;
    state.portalReady = false;
    state.cinematic = { index: 0, steps: this.getCircusIntroSteps(), startedAt: performance.now() };
    state.interactionMessage = '';
    state.interactionChoices = null;
    document.getElementById('circus-doom-hud')?.classList.add('cinematic-active');
    document.getElementById('circus-dos-overlay')?.classList.add('cinematic-active');
  },

  advanceCircusArrivalCinematic() {
    const state = this.circusDoom;
    if (!state?.cinematic) return false;
    state.cinematic.index++;
    state.cinematic.startedAt = performance.now();
    if (state.cinematic.index >= state.cinematic.steps.length) {
      state.cinematic = null;
      document.getElementById('circus-doom-hud')?.classList.remove('cinematic-active');
      document.getElementById('circus-dos-overlay')?.classList.remove('cinematic-active');
      state.portalReady = true;
      this.setCainOSStorage('fps_intro_seen', true);
      this.circusZonePropsCache?.delete(2);
      state.interactionMessage = `PORTAIL DE CAINE OUVERT: ${state.adventurePortal.label}`;
      state.interactionUntil = performance.now() + 5200;
      state.interactionChannel = 'system';
      state.interactionSpeaker = 'CAINE';
      this.unlockCainOSAchievement('fps_arrival', 'Visiteur 251 integre au Cirque');
      SoundManager.playWin();
    } else {
      SoundManager.play(540 + state.cinematic.index * 35, 0.07, 'triangle', 0.04);
    }
    return true;
  },

  updateCircusCinematicCamera(dt) {
    const state = this.circusDoom;
    const step = state?.cinematic?.steps?.[state.cinematic.index];
    if (!step) return;
    const sprite = this.getCircusZoneSprites(2).find(item => (item.avatar || item.type) === step.avatar);
    if (!sprite) return;
    const point = this.resolveCircusWorldPoint(sprite, state);
    const target = Math.atan2(point.z - state.player.z, point.x - state.player.x);
    const delta = Math.atan2(Math.sin(target - state.player.a), Math.cos(target - state.player.a));
    state.player.a += delta * Math.min(1, dt * 2.4);
  },

  getCircusCanvasTextLines(ctx, text, maxWidth, maxLines = Number.POSITIVE_INFINITY) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const lines = [];
    let line = '';
    let truncated = false;

    words.forEach(word => {
      if (truncated) return;
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= maxWidth || !line) {
        line = next;
        return;
      }
      lines.push(line);
      line = word;
      if (lines.length >= maxLines) truncated = true;
    });

    if (!truncated && line && lines.length < maxLines) lines.push(line);
    if (truncated && lines.length) {
      let tail = lines[lines.length - 1];
      while (tail && ctx.measureText(`${tail}...`).width > maxWidth) {
        tail = tail.slice(0, -1).trimEnd();
      }
      lines[lines.length - 1] = `${tail || '.'}...`;
    }
    return lines;
  },

  drawCircusCinematicOverlay(ctx, w, h, state) {
    const cinematic = state?.cinematic;
    const step = cinematic?.steps?.[cinematic.index];
    if (!step) return;
    const fade = Math.min(1, (performance.now() - cinematic.startedAt) / 260);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.font = 'bold 11px Courier New';
    const lineHeight = 15;
    const maxLines = Math.max(3, Math.floor((h * 0.45 - 70) / lineHeight));
    const lines = this.getCircusCanvasTextLines(ctx, step.line, w - 52, maxLines);
    const boxH = Math.min(h - 38, 76 + lines.length * lineHeight);
    const boxY = h - boxH;
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(0, 0, w, 30);
    ctx.fillRect(0, boxY, w, boxH);
    ctx.fillStyle = '#fff1a8';
    ctx.font = 'bold 10px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`ARRIVEE DU VISITEUR // ${step.speaker}`, 18, boxY + 24);
    ctx.strokeStyle = step.speaker === 'CAINOS' ? '#7df0ff' : '#ffd84a';
    ctx.strokeRect(14, boxY + 10, w - 28, boxH - 22);
    ctx.font = 'bold 11px Courier New';
    lines.forEach((line, index) => {
      ctx.fillText(line, 26, boxY + 45 + index * lineHeight);
    });
    ctx.fillStyle = '#7df0ff';
    ctx.font = '8px Courier New';
    ctx.textAlign = 'right';
    ctx.fillText(`ENTREE / CLIC POUR CONTINUER  ${cinematic.index + 1}/${cinematic.steps.length}`, w - 20, h - 9);
    ctx.restore();
  },

  getCircusCainePortalProp() {
    const state = this.circusDoom;
    if (!state?.portalReady) return null;
    const config = this.getCircusAdventurePortalConfig();
    state.adventurePortal = config;
    return { kind: 'caineportal', x: 0, z: -4.65, color: '#7df0ff', accent: '#ffd84a', target: config.target, label: config.label };
  },

  getCircusBedroomDefinitions() {
    return {
      44: { resident: 'Jax', avatar: 'jax', color: '#8a4fd6', parent: 20, canon: 'partial', accent: '#ffd84a' },
      45: { resident: 'Pomni', avatar: 'pomni', color: '#e53935', parent: 20, canon: 'partial', accent: '#2a58d8' },
      46: { resident: 'Ragatha', avatar: 'ragatha', color: '#d64545', parent: 20, canon: 'merch', accent: '#78a8e8' },
      47: { resident: 'Gangle', avatar: 'gangle', color: '#9e2638', parent: 20, canon: 'show', accent: '#f7f7f7' },
      48: { resident: 'Zooble', avatar: 'zooble', color: '#ff4fb8', parent: 20, canon: 'show', accent: '#7df0ff' },
      49: { resident: 'Kinger', avatar: 'kinger', color: '#5c4b82', parent: 20, canon: 'merch', accent: '#d9d0a2' },
      52: { resident: 'Kaufmo', avatar: 'kaufmo', color: '#e53935', parent: 50, archived: true, accent: '#ffd84a' },
      53: { resident: 'Queenie', avatar: 'queenie', color: '#2c252f', parent: 50, archived: true, accent: '#f7eecb' },
      54: { resident: 'Ribbit', avatar: 'ribbit', color: '#4ee77e', parent: 50, archived: true, accent: '#ffd84a' },
      55: { resident: 'Scratch', avatar: 'scratch', color: '#d6a82c', parent: 50, archived: true, accent: '#f7f7f7' },
      56: { resident: 'Wormo', avatar: 'wormo', color: '#ef8b45', parent: 50, archived: true, accent: '#67c96f' },
      57: { resident: 'Bizco', avatar: 'bizco', color: '#b45cff', parent: 50, archived: true, accent: '#ffcf75' },
      58: { resident: 'Rattie', avatar: 'rattie', color: '#897765', parent: 51, archived: true, accent: '#d8c7aa' },
      59: { resident: 'Spike', avatar: 'spike', color: '#8d5cff', parent: 51, archived: true, accent: '#7df0ff' },
      60: { resident: 'Pink Cyclops', avatar: 'pinkcyclops', color: '#ff80bd', parent: 51, archived: true, accent: '#fff1a8' },
      61: { resident: 'Yellow Clown', avatar: 'yellowclown', color: '#d6a82c', parent: 51, archived: true, accent: '#e53935' },
      62: { resident: 'Oyster', avatar: 'oyster', color: '#8fb7ff', parent: 51, archived: true, accent: '#f7f7f7' },
      63: { resident: 'Bulb Creature', avatar: 'bulbcreature', color: '#7caa42', parent: 51, archived: true, accent: '#fff1a8' }
    };
  },

  isCircusBedroomArchived(room) {
    if (!room) return false;
    if (room.archived) return true;
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    return room.avatar === 'jax' && progress.includes(9);
  },

  auditCircusRoomNetwork(portals, scenes) {
    const errors = [];
    let currentRooms = 0;
    let archiveRooms = 0;
    Object.entries(this.getCircusBedroomDefinitions()).forEach(([zoneId, room]) => {
      const id = Number(zoneId);
      if (room.archived) archiveRooms++;
      else currentRooms++;
      if (!portals[id]) errors.push(`PORTAL ${id} absent`);
      if (!scenes[id]?.exits?.includes(room.parent)) errors.push(`CHAMBRE ${id}: retour ${room.parent} absent`);
      const parentDoor = this.getCircusZoneProps(room.parent).find(prop => prop.kind === 'roomdoor' && prop.target === id);
      if (!parentDoor) errors.push(`COULOIR ${room.parent}: porte vers ${id} absente`);
      if (this.isCircusBedroomArchived(room) && this.getCircusZoneSprites(id).length) errors.push(`CHAMBRE ARCHIVE ${id}: PNJ actif interdit`);
    });
    if (!scenes[20]?.exits?.includes(50) || !scenes[20]?.exits?.includes(51)) {
      errors.push('COULOIR CENTRAL: annexes non raccordees');
    }
    return { ok: errors.length === 0, errors, currentRooms, archiveRooms };
  },

  auditCircusGameplaySystems(portals, scenes) {
    const errors = [];
    const worlds = this.getCircusAdventureWorlds();
    worlds.forEach(world => {
      if (!portals[world.target]) errors.push(`MONDE EP${world.episode}: portail ${world.target} absent`);
      if (!scenes[world.target]) errors.push(`MONDE EP${world.episode}: scene ${world.target} absente`);
    });
    const virtualActions = new Set(['drive', 'dive', 'survive', 'give']);
    for (let zoneId = 2; zoneId <= 69; zoneId++) {
      const config = this.getCircusZoneGameplayConfig(zoneId);
      if (!config) continue;
      const props = this.getCircusZoneProps(zoneId);
      config.steps.forEach(step => {
        if (!virtualActions.has(step.action) && !props.some(prop => prop.kind === step.kind)) {
          errors.push(`GAMEPLAY ${zoneId}: ${step.action}/${step.kind} sans objet`);
        }
      });
    }
    const introSteps = this.getCircusIntroSteps().length;
    if (introSteps < 6) errors.push('CINEMATIQUE: integration trop courte');
    return { ok: errors.length === 0, errors, worldCount: worlds.length, introSteps };
  },

  auditCircusVerticalRendering() {
    const errors = [];
    const targets = [
      { zone: 8, kind: 'building', minHeight: 4.2 },
      { zone: 26, kind: 'building', minHeight: 3.2 },
      { zone: 32, kind: 'building', minHeight: 4.0 },
      { zone: 39, kind: 'lighthouse', minHeight: 6.0 }
    ];
    const heights = [];
    targets.forEach(target => {
      const prop = this.getCircusZoneProps(target.zone).find(candidate => candidate.kind === target.kind);
      if (!prop) {
        errors.push(`VERTICAL ${target.zone}: ${target.kind} absent`);
        return;
      }
      const dimensions = this.getCircusWorldPropDimensions(prop, this.circusDoom || { currentZoneId: target.zone });
      if (!dimensions || dimensions.height < target.minHeight) {
        errors.push(`VERTICAL ${target.zone}: hauteur ${dimensions?.height || 0}/${target.minHeight}`);
      }
      heights.push(dimensions?.height || 0);
    });
    if (new Set(heights.map(height => height.toFixed(2))).size < 3) {
      errors.push('VERTICAL: silhouettes trop uniformes');
    }
    const floorLinks = [[8, 64], [64, 65], [32, 66], [66, 67], [39, 68], [68, 69]];
    floorLinks.forEach(([from, to]) => {
      if (!this.circusDoom?.scenes?.[from]?.exits?.includes(to) || !this.circusDoom?.scenes?.[to]?.exits?.includes(from)) {
        errors.push(`ETAGE ${from}/${to}: liaison reciproque absente`);
      }
    });
    const animatedAvatars = ['pomni', 'jax', 'ragatha', 'kinger', 'gangle', 'zooble', 'caine'];
    animatedAvatars.forEach(avatar => {
      const animation = this.getCircusAvatarAnimationSpec(avatar, { name: avatar, routine: 'idle' });
      if (!animation || animation.cols !== 4 || animation.rows !== 2) {
        errors.push(`ANIMATION ${avatar.toUpperCase()}: planche 4x2 absente`);
      }
    });
    return {
      ok: errors.length === 0,
      errors,
      structureCount: targets.length,
      floorCount: floorLinks.length,
      animationCount: animatedAvatars.length
    };
  },

  auditCircusAdvancedGameplay() {
    const errors = [];
    const campaigns = Array.from({ length: 9 }, (_, index) => this.getCircusFpsCampaignDefinition(index + 1)).filter(Boolean);
    const campaignStages = campaigns.reduce((sum, campaign) => sum + campaign.stages.length, 0);
    if (campaigns.length !== 9) errors.push(`CAMPAGNES: ${campaigns.length}/9 episodes`);
    if (campaignStages !== 72) errors.push(`CAMPAGNES: ${campaignStages}/72 actes`);
    const virtualActions = new Set(['visit', 'survive', 'give']);
    campaigns.forEach(campaign => campaign.stages.forEach(stage => stage.requirements.forEach(requirement => {
      if (virtualActions.has(requirement.action)) return;
      if (requirement.action === 'talk') {
        const available = this.getCircusZoneSprites(stage.zone).some(sprite => (sprite.avatar || sprite.type) === requirement.target);
        if (!available) errors.push(`EP${campaign.episode} ${stage.zone}: PNJ ${requirement.target} absent`);
        return;
      }
      const available = this.getCircusZoneProps(stage.zone).some(prop => prop.kind === requirement.target);
      if (!available) errors.push(`EP${campaign.episode} ${stage.zone}: OBJET ${requirement.target} absent`);
    })));
    const eventZones = [2, 3, 4, 5, 6, 8, 10, 12, 14, 31]
      .filter(zoneId => this.getCircusDynamicEventDefinitions(zoneId).length > 0).length;
    if (eventZones < 10) errors.push(`EVENEMENTS: ${eventZones}/10 zones`);
    const activityTypes = ['tanker', 'spudsy', 'softball', 'mildenhall', 'dive'].length;
    const customObjectives = ['explore', 'collect', 'social', 'survive', 'chase']
      .filter(key => this.getCainOSCustomObjectiveDefinition(key)?.total > 0).length;
    if (customObjectives !== 5) errors.push(`ATELIER: ${customObjectives}/5 objectifs`);
    const requiredMethods = [
      'findCircusNpcPath', 'beginCircusDoorTransition', 'getCircusDirectionalPose',
      'playCircusSpatialObjectSound', 'advanceCircusCustomAdventure'
    ];
    requiredMethods.forEach(method => {
      if (typeof this[method] !== 'function') errors.push(`SYSTEME ABSENT: ${method}`);
    });
    const directionState = { player: { x: 0, z: 0 } };
    const directionalSectors = new Set(Array.from({ length: 8 }, (_, index) => (
      this.getCircusDirectionalPose({ space: 'world', x: 1, z: 0, facing: index * Math.PI / 4 }, directionState).sector
    ))).size;
    if (directionalSectors !== 8) errors.push(`DIRECTIONS: ${directionalSectors}/8 secteurs`);
    const navigationPath = this.findCircusNpcPath(
      { x: 1.5, z: 1.5 },
      { x: 4.5, z: 4.5 },
      { room: { grid: Array.from({ length: 6 }, (_, z) => Array.from({ length: 6 }, (_, x) => (x === 0 || z === 0 || x === 5 || z === 5 ? 1 : 0))) } }
    ).length;
    if (navigationPath < 6) errors.push(`NAVIGATION: chemin test trop court (${navigationPath})`);
    if (!document.getElementById('tools-tab-creator')) errors.push('ATELIER: panneau HTML absent');
    return { ok: errors.length === 0, errors, campaignEpisodes: campaigns.length, campaignStages, eventZones, activityTypes, customObjectives, directionalSectors, navigationPath };
  },

  prepareCircusSimulationRoom() {
    const state = this.circusDoom;
    if (!state) return;
    const scene = state.scenes[state.currentZoneId] || state.scenes[2];
    const size = Math.max(11, scene.size || 15);
    const grid = Array.from({ length: size }, (_, z) => (
      Array.from({ length: size }, (_, x) => (x === 0 || z === 0 || x === size - 1 || z === size - 1 ? 1 : 0))
    ));
    const center = { x: size / 2, z: size / 2 };
    const addBlock = (x, z, code = 1) => {
      if (x <= 1 || z <= 1 || x >= size - 2 || z >= size - 2) return;
      if (Math.abs(x + 0.5 - center.x) < 1.9 && Math.abs(z + 0.5 - center.z) < 2.2) return;
      if (Math.abs(x + 0.5 - center.x) < 1.3 && z > size - 5) return;
      grid[z][x] = code;
    };

    const motif = scene.motif;
    if (['circus', 'final', 'grounds'].includes(motif)) {
      [[3, 3], [size - 4, 3], [3, size - 5], [size - 4, size - 5]].forEach(([x, z]) => addBlock(x, z, 2));
      for (let x = 3; x < size - 3; x += 3) addBlock(x, 2, 2);
    } else if (['manor', 'basement', 'cellar', 'hell', 'nest'].includes(motif)) {
      for (let z = 3; z < size - 3; z += 3) {
        addBlock(3, z, 3);
        addBlock(size - 4, z, 3);
      }
      if (size > 12) {
        for (let x = 4; x < size - 4; x++) if (x !== Math.floor(center.x)) addBlock(x, 4, 1);
      }
    } else if (['test', 'admin', 'core'].includes(motif)) {
      for (let x = 2; x < size - 2; x += 4) {
        for (let z = 2; z < size - 3; z += 4) addBlock(x, z, 2);
      }
    } else if (['spudsy', 'kitchen', 'bathroom', 'training'].includes(motif)) {
      for (let x = 3; x < size - 3; x++) if (Math.abs(x + 0.5 - center.x) > 1.4) addBlock(x, 4, 2);
    } else if (motif === 'dorm' || motif === 'dormannex') {
      const leftWall = Math.floor(center.x) - 2;
      const rightWall = Math.floor(center.x) + 2;
      for (let z = 2; z < size - 2; z++) {
        addBlock(leftWall, z, 1);
        addBlock(rightWall, z, 1);
      }
    } else if (['candy', 'palace', 'route', 'lake', 'lighthouse', 'underwater', 'softball', 'carnival'].includes(motif)) {
      for (let x = 4; x < size - 4; x += 4) addBlock(x, 3, 2);
      for (let x = 5; x < size - 5; x += 5) addBlock(x, size - 5, 2);
    } else if (['common', 'dining', 'loser', 'awards'].includes(motif)) {
      [[3, 3], [size - 4, 3], [3, size - 5], [size - 4, size - 5]].forEach(([x, z]) => addBlock(x, z, 2));
    } else if (motif === 'tubes') {
      for (let z = 3; z < size - 3; z += 4) {
        addBlock(3, z, 2);
        addBlock(size - 4, z, 2);
      }
    } else if (motif === 'street') {
      for (let z = 3; z < size - 3; z += 3) {
        addBlock(3, z, 1);
        addBlock(size - 4, z, 1);
      }
    }

    const slots = this.getCircusDoorSlots((scene.exits || []).length, size);
    const doors = slots.map((slot, index) => {
      const target = scene.exits[index];
      const code = 100 + index;
      grid[slot.z][slot.x] = code;
      for (let step = 1; step <= 4; step++) {
        const cx = slot.x + slot.inwardX * step;
        const cz = slot.z + slot.inwardZ * step;
        if (grid[cz]?.[cx] !== undefined) grid[cz][cx] = 0;
        if (slot.inwardX === 0) {
          if (grid[cz]?.[cx - 1] !== undefined) grid[cz][cx - 1] = 0;
          if (grid[cz]?.[cx + 1] !== undefined) grid[cz][cx + 1] = 0;
        } else {
          if (grid[cz - 1]?.[cx] !== undefined) grid[cz - 1][cx] = 0;
          if (grid[cz + 1]?.[cx] !== undefined) grid[cz + 1][cx] = 0;
        }
      }
      const targetPortal = state.portals[target];
      return {
        target,
        index,
        code,
        space: 'world',
        x: slot.x + 0.5,
        z: slot.z + 0.5,
        inwardX: slot.inwardX,
        inwardZ: slot.inwardZ,
        label: targetPortal?.short || 'ZONE'
      };
    });

    const startX = Math.floor(center.x);
    const startZ = size - 3;
    for (let z = startZ - 2; z <= startZ + 1; z++) {
      for (let x = startX - 1; x <= startX + 1; x++) {
        if (grid[z]?.[x] !== undefined) grid[z][x] = 0;
      }
    }
    state.room = { grid, size, center, doors };
    const entryDoor = Number.isFinite(state.pendingEntryFromZoneId)
      ? doors.find(door => door.target === state.pendingEntryFromZoneId)
      : null;
    if (entryDoor) {
      state.player.x = entryDoor.x + entryDoor.inwardX * 1.25;
      state.player.z = entryDoor.z + entryDoor.inwardZ * 1.25;
      state.player.a = Math.atan2(entryDoor.inwardZ, entryDoor.inwardX);
      state.selectedExitIndex = entryDoor.index;
    } else {
      state.player.x = center.x;
      state.player.z = startZ + 0.35;
      state.player.a = -Math.PI / 2;
    }
    state.hotspots = [];
    state.interactionMessage = '';
    state.interactionUntil = 0;
    state.interactionChoices = null;
    state.interactionOrigin = null;
    state.interactionChannel = 'system';
    state.interactionSpeaker = '';
    state.lastZoneEventId = null;
  },

  getCircusDoorSlots(count, size) {
    const sides = ['north', 'east', 'west', 'south'];
    const slots = [];
    for (let index = 0; index < count; index++) {
      const sideIndex = index % sides.length;
      const ordinal = Math.floor(index / sides.length);
      const sideTotal = Math.ceil((count - sideIndex) / sides.length);
      const pos = Math.max(2, Math.min(size - 3, Math.round(2 + ((ordinal + 1) / (sideTotal + 1)) * (size - 5))));
      const side = sides[sideIndex];
      if (side === 'north') slots.push({ side, x: pos, z: 0, inwardX: 0, inwardZ: 1 });
      else if (side === 'south') slots.push({ side, x: pos, z: size - 1, inwardX: 0, inwardZ: -1 });
      else if (side === 'east') slots.push({ side, x: size - 1, z: pos, inwardX: -1, inwardZ: 0 });
      else slots.push({ side, x: 0, z: pos, inwardX: 1, inwardZ: 0 });
    }
    return slots;
  },

  handleCircusSimulationInput(key) {
    const state = this.circusDoom;
    if (!state) return;
    if (state.portalTransition || state.doorTransition) return;
    if (state.cinematic) {
      this.advanceCircusArrivalCinematic();
      return;
    }
    if ((key === 'enter' || key === ' ') && this.handleCircusActivityAction()) return;
    const exits = state.scenes[state.currentZoneId]?.exits || [];
    if (!exits.length) return;
    if (key === 'enter' || key === ' ') {
      const assist = state.interactionAssist ? 1.18 : 1;
      if (state.interactionChoices) {
        this.chooseCircusDialogueOption(0);
        return;
      }
      const character = this.getNearestCircusCharacter();
      if (character && character.dist < 1.9 * assist && Math.abs(character.angle) < 0.42 * assist) {
        this.performCircusCharacterAction(character);
        return;
      }
      const prop = this.getNearestCircusProp();
      if (prop && prop.dist < 2.15 * assist && Math.abs(prop.angle) < 0.55 * assist) {
        this.performCircusPropAction(prop);
        return;
      }
      const door = this.getNearestUsableCircusDoor();
      if (door && door.dist <= 1.8 * assist && Math.abs(door.angle) < 0.72 * assist) {
        this.enterCircusSimulationExit(door.target);
      } else {
        state.interactionMessage = 'PORTE HORS DE PORTEE: approchez-vous et placez-la au centre du viseur.';
        state.interactionUntil = performance.now() + 2400;
        state.interactionChannel = 'system';
        state.interactionSpeaker = '';
        SoundManager.playError();
      }
    } else if (key === 'arrowdown') {
      const previous = state.history.pop();
      if (previous) this.setCircusSimulationZone(previous, false, state.currentZoneId);
    }
  },

  getNearestCircusCharacter() {
    const state = this.circusDoom;
    if (!state) return null;
    let best = null;
    this.getCircusActiveZoneSprites(state.currentZoneId, state).forEach((sprite, index) => {
      if (!this.isCircusWorldPointVisible(sprite, state, 0.42)) return;
      const pos = this.resolveCircusWorldPoint(sprite, state);
      const dx = pos.x - state.player.x;
      const dz = pos.z - state.player.z;
      const dist = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx) - state.player.a;
      const normalized = Math.atan2(Math.sin(angle), Math.cos(angle));
      const score = dist + Math.abs(normalized) * 2.4;
      if (!best || score < best.score) best = { ...sprite, index, dist, angle: normalized, score };
    });
    return best;
  },

  getCircusFocusedHint() {
    const state = this.circusDoom;
    if (!state || state.interactionChoices) return null;
    const assist = state.interactionAssist ? 1.18 : 1;
    const character = this.getNearestCircusCharacter();
    if (character && character.dist < 2.2 * assist && Math.abs(character.angle) < 0.48 * assist) {
      return state.interactionVerb === 'give'
        ? `ENTREE / CLIC: donner ${state.heldItem?.name || 'un objet'} a ${character.name}`
        : `ENTREE / CLIC: parler a ${character.name}  |  1-3: choix rapides apres contact`;
    }
    const prop = this.getNearestCircusProp();
    if (prop && prop.dist < 2.3 * assist && Math.abs(prop.angle) < 0.58 * assist) {
      if (Number.isFinite(prop.target)) {
        const target = state.portals[prop.target];
        return target?.unlocked
          ? `ENTREE / CLIC: entrer dans ${target.short}`
          : `PORTE BARREE: ${target?.short || 'ARCHIVE'}`;
      }
      const verbLabel = { use: 'utiliser', look: 'observer', take: 'prendre', give: 'donner' }[state.interactionVerb] || 'utiliser';
      return `ENTREE / CLIC: ${verbLabel} ${this.getCircusPropName(prop, state.currentZoneId)}`;
    }
    const door = this.getNearestUsableCircusDoor();
    if (door && door.dist < 2.0 * assist && Math.abs(door.angle) < 0.82 * assist) {
      const target = state.portals[door.target];
      return target?.unlocked ? `ENTREE / CLIC: passer vers ${target.short}` : `PORTE VERROUILLEE: ${target?.short || 'ZONE'}`;
    }
    return null;
  },

  getNearestCircusProp() {
    const state = this.circusDoom;
    if (!state) return null;
    let best = null;
    this.getCircusZoneProps(state.currentZoneId).forEach((prop, index) => {
      if (state.collectedProps?.has(`${state.currentZoneId}:${index}`)) return;
      if (!this.isCircusWorldPointVisible(prop, state, prop.anchor?.startsWith('wall') ? 0.72 : 0.42)) return;
      const pos = this.resolveCircusWorldPoint(prop, state);
      const dx = pos.x - state.player.x;
      const dz = pos.z - state.player.z;
      const dist = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx) - state.player.a;
      const normalized = Math.atan2(Math.sin(angle), Math.cos(angle));
      const score = dist + Math.abs(normalized) * 2.15;
      if (!best || score < best.score) best = { ...prop, index, dist, angle: normalized, score };
    });
    return best;
  },

  getCircusZoneObjectiveConfig(zoneId) {
    if (this.circusZoneObjectiveConfigs) return this.circusZoneObjectiveConfigs[zoneId] || null;
    const scan = (kind, label, count = 1) => ({ type: 'scan', kind, label, count });
    const activate = (kind, label, count = 1) => ({ type: 'activate', kind, label, count });
    const talk = (avatar, label) => ({ type: 'talk', avatar, label });
    const objectives = {
      2: { title: 'RECALER LA PISTE', steps: [scan('ring', 'Inspecter la piste centrale'), activate('spotlight', 'Activer deux projecteurs', 2), talk('caine', 'Interroger Caine')] },
      3: { title: 'CARTOGRAPHIER LE TERRAIN', steps: [scan('tent', 'Examiner le chapiteau exterieur'), scan('ring', 'Reperer une attraction'), talk('gloinkqueenscale', 'Observer la Gloink Queen')] },
      4: { title: 'CONFINER LE SIGNAL KAUFMO', steps: [scan('eye', 'Identifier le signal d abstraction'), scan('crate', 'Verifier les caisses du cellar'), talk('abstractedkaufmo', 'Approcher Kaufmo abstrait')] },
      5: { title: 'TESTER LA FAUSSE SORTIE', steps: [scan('exitframe', 'Comparer deux cadres de sortie', 2), scan('desk', 'Inspecter le bureau impossible'), talk('pomni', 'Parler des portes avec Pomni')] },
      6: { title: 'SECURISER LE CONVOI', steps: [scan('truck', 'Verifier le camion-citerne'), scan('candy', 'Relever deux obstacles bonbon', 2), talk('gummigoo', 'Coordonner Gummigoo')] },
      7: { title: 'LIRE LE TEST LEVEL', steps: [activate('console', 'Activer la console de test'), activate('gridnode', 'Synchroniser deux noeuds', 2), talk('mannequin', 'Questionner le mannequin C&A')] },
      8: { title: 'ECLAIRER MILDENHALL', steps: [scan('window', 'Verifier une fenetre du manoir'), activate('candle', 'Allumer une bougie'), talk('kinger', 'Rester avec Kinger')] },
      9: { title: 'DESCENDRE AU SOUS-SOL', steps: [scan('stairs', 'Examiner l escalier'), scan('barrel', 'Verifier les barils'), talk('kinger', 'Ecouter Kinger dans l obscurite')] },
      10: { title: 'TENIR LE SERVICE SPUDSY', steps: [scan('counter', 'Verifier le comptoir'), activate('menu', 'Lire deux menus de service', 2), talk('workgangle', 'Aider Gangle')] },
      11: { title: 'TRIER LES MICRO-AVENTURES', steps: [activate('card', 'Classer deux cartes suggestion', 2), scan('doorframe', 'Identifier une porte de variante'), talk('orbsman', 'Consulter Orbsman')] },
      12: { title: 'PREPARER LE MATCH', steps: [scan('base', 'Verifier trois bases', 3), activate('scoreboard', 'Allumer le scoreboard'), talk('baseballjax', 'Parler a Jax avant le match')] },
      13: { title: 'SECURISER L ARENE', steps: [scan('target', 'Verifier trois cibles', 3), scan('crate', 'Inspecter les caisses'), talk('jax', 'Confronter Jax')] },
      14: { title: 'SONDER LE LAC', steps: [scan('umbrella', 'Verifier les parasols'), scan('wave', 'Analyser deux boucles d eau', 2), talk('beachgangle', 'Parler a Gangle sur la plage')] },
      15: { title: 'OUVRIR LA COUCHE ADMIN', steps: [activate('console', 'Activer la console admin'), activate('gridnode', 'Synchroniser un noeud'), talk('ming', 'Questionner Ming')] },
      16: { title: 'AUDITER LE COEUR C&A', steps: [scan('desk', 'Inspecter le bureau de Caine'), activate('console', 'Activer la console C&A'), talk('caine', 'Demander des comptes a Caine')] },
      17: { title: 'RECONSTRUIRE LE SOUVENIR', steps: [scan('memory', 'Rassembler trois fragments', 3), talk('queenie', 'Ecouter l archive Queenie')] },
      18: { title: 'STABILISER LE FINAL', steps: [activate('spotlight', 'Recaler le projecteur final'), talk('ribbit', 'Identifier le signal Ribbit'), talk('caine', 'Verifier l etat de Caine')] },
      19: { title: 'INDEXER LES ANCIENS MEMBRES', steps: [activate('archive', 'Ouvrir trois cadres archive', 3), talk('ribbit', 'Consulter Ribbit')] },
      20: { title: 'RELEVER LE COULOIR', steps: [scan('wallart', 'Verifier les deux reperes du couloir', 2), scan('ceilinglight', 'Suivre les plafonniers'), talk('pomni', 'Retrouver Pomni')] },
      21: { title: 'REMONTER LES ECHOS DU CAFE', steps: [scan('counter', 'Inspecter le comptoir'), scan('table', 'Verifier deux tables', 2), talk('gangle', 'Parler avec Gangle')] },
      22: { title: 'CONTROLER L AQUARIUM', steps: [scan('window', 'Verifier deux vitres', 2), scan('wave', 'Analyser le courant'), talk('pomni', 'Rejoindre Pomni')] },
      23: { title: 'RECONSTITUER LE SOMMET', steps: [scan('stairs', 'Relever le chemin enneige'), talk('jax', 'Ecouter le souvenir de Jax'), talk('ribbit', 'Comparer le souvenir Ribbit')] },
      24: { title: 'BALISER LA CHASSE', steps: [scan('target', 'Verifier deux cibles western', 2), scan('crate', 'Inspecter les provisions'), talk('hunterjax', 'Parler au chasseur Jax')] },
      25: { title: 'RECONSTRUIRE LE LYCEE', steps: [scan('table', 'Verifier deux pupitres', 2), activate('card', 'Lire une carte scolaire'), talk('japanesegangle', 'Parler a Gangle')] },
      26: { title: 'VERIFIER LA PRESIDENCE', steps: [scan('desk', 'Inspecter le bureau officiel'), scan('doorframe', 'Controler les acces'), talk('pomni', 'Consulter Pomni')] },
      27: { title: 'GARDER UN REPERE DANS LE VIDE', steps: [scan('exitframe', 'Fixer le cadre de sortie'), scan('eye', 'Relever les deux signaux', 2)] },
      28: { title: 'RECALER L ESPACE COMMUN', steps: [scan('table', 'Verifier la table centrale'), scan('ring', 'Inspecter le repere circulaire'), talk('ragatha', 'Retrouver Ragatha')] },
      29: { title: 'CARTOGRAPHIER LES TUBES', steps: [scan('doorframe', 'Identifier trois cadres de porte', 3), scan('ring', 'Verifier deux boucles de tube', 2)] },
      30: { title: 'INSPECTER LE LOSER CORNER', steps: [scan('table', 'Verifier le mobilier'), scan('window', 'Localiser l aquarium'), talk('zooble', 'Parler a Zooble')] },
      31: { title: 'BALISER THE NEST', steps: [scan('stairs', 'Verifier l acces archive'), scan('window', 'Relever deux ouvertures', 2), talk('pomni', 'Rassurer Pomni')] },
      32: { title: 'PREPARER L AUDIENCE ROYALE', steps: [scan('stairs', 'Verifier l escalier du palais'), scan('candy', 'Relever deux ornements', 2), talk('loolilalu', 'Consulter Loolilalu')] },
      33: { title: 'REMETTRE LE TANKER EN ROUTE', steps: [scan('truck', 'Verifier le camion-citerne'), scan('candy', 'Reperer deux obstacles', 2), talk('gummigoo', 'Retrouver Gummigoo')] },
      34: { title: 'CONTENIR LES AMES', steps: [scan('eye', 'Identifier l ame du manoir'), activate('candle', 'Maintenir une source de lumiere'), talk('kinger', 'Rester avec Kinger')] },
      35: { title: 'RELANCER LA CUISINE', steps: [scan('counter', 'Verifier le poste de preparation'), activate('menu', 'Traiter deux tickets', 2), talk('workgangle', 'Aider Gangle')] },
      36: { title: 'ISOLER LE BIOHAZARD', steps: [scan('doorframe', 'Verifier deux cabines', 2), scan('barrel', 'Identifier le risque'), talk('pomni', 'Prevenir Pomni')] },
      37: { title: 'ARRETER LA FORMATION', steps: [activate('menu', 'Interrompre l ecran de formation'), scan('spotlight', 'Verifier le projecteur'), talk('jax', 'Parler a Jax')] },
      38: { title: 'PREPARER LES AWARDS', steps: [activate('scoreboard', 'Allumer le panneau des Awards'), scan('stairs', 'Verifier l acces scene'), talk('caine', 'Demander le verdict a Caine')] },
      39: { title: 'ALIGNER LE PHARE', steps: [scan('lighthouse', 'Verifier la tour du phare'), scan('stairs', 'Inspecter le depart du toboggan'), talk('jax', 'Rejoindre Jax')] },
      40: { title: 'RETROUVER LE COFFRE', steps: [activate('archive', 'Ouvrir le coffre deja pille'), scan('wave', 'Analyser deux courants', 2), talk('beachgangle', 'Parler a Gangle')] },
      41: { title: 'FIXER LE SOUVENIR C&A', steps: [scan('doorframe', 'Verifier la porte du souvenir'), scan('desk', 'Inspecter le mobilier efface'), talk('jax', 'Ecouter Jax')] },
      42: { title: 'RELEVER LA FETE FORAINE', steps: [scan('ring', 'Verifier deux attractions', 2), scan('pillar', 'Identifier le repere central'), talk('caine', 'Questionner Caine')] },
      43: { title: 'PREPARER LE REPAS', steps: [scan('table', 'Verifier trois tables', 3), activate('menu', 'Lire le menu du repas'), talk('kinger', 'Rejoindre Kinger')] },
      50: { title: 'INDEXER L ANNEXE OUEST', steps: [activate('archive', 'Ouvrir le registre de l annexe'), scan('ceilinglight', 'Verifier le balisage du couloir')] },
      51: { title: 'INDEXER L ANNEXE EST', steps: [activate('archive', 'Ouvrir le registre de l annexe'), scan('ceilinglight', 'Verifier le balisage du couloir')] },
      64: { title: 'MONTER DANS LE MANOIR', steps: [scan('window', 'Verifier les fenetres hautes'), activate('candle', 'Maintenir une bougie'), scan('stairs', 'Trouver le grenier')] },
      65: { title: 'INDEXER LE GRENIER', steps: [scan('archive', 'Examiner les traces du grenier'), scan('crate', 'Verifier deux caisses', 2), talk('kinger', 'Garder Kinger comme repere')] },
      66: { title: 'PARCOURIR LA GALERIE ROYALE', steps: [scan('pillar', 'Verifier deux piliers', 2), scan('stairs', 'Trouver le balcon'), talk('loolilalu', 'Consulter Loolilalu')] },
      67: { title: 'OBSERVER LE ROYAUME', steps: [scan('ring', 'Relever la balustrade'), activate('spotlight', 'Activer le repere du balcon'), talk('pomni', 'Rejoindre Pomni')] },
      68: { title: 'MONTER LE PHARE', steps: [scan('window', 'Verifier les ouvertures'), scan('stairs', 'Suivre l escalier'), talk('jax', 'Retrouver Jax')] },
      69: { title: 'ALLUMER LA LANTERNE', steps: [activate('spotlight', 'Activer la lanterne'), activate('console', 'Calibrer le faisceau'), talk('caine', 'Signaler le phare a Caine')] }
    };
    Object.entries(this.getCircusBedroomDefinitions()).forEach(([zoneId, room]) => {
      objectives[Number(zoneId)] = this.isCircusBedroomArchived(room)
        ? { title: `RELEVER LA CHAMBRE ABANDONNEE / ${room.resident.toUpperCase()}`, steps: [scan('bed', 'Examiner la chambre vide'), activate('archive', 'Ouvrir le dossier de porte'), activate('memory', 'Stabiliser la trace residuelle')] }
        : { title: `RELEVER LA CHAMBRE / ${room.resident.toUpperCase()}`, steps: [scan('bed', 'Examiner le mobilier principal'), activate('card', 'Identifier un objet personnel'), talk(room.avatar, `Parler a ${room.resident}`)] };
    });
    this.circusZoneObjectiveConfigs = objectives;
    return objectives[zoneId] || null;
  },

  auditCircusZoneObjectives() {
    const activatableKinds = new Set(['console', 'gridnode', 'spotlight', 'candle', 'target', 'scoreboard', 'menu', 'card', 'archive', 'memory', 'ring', 'doorframe']);
    const errors = [];
    let missionCount = 0;
    for (let zoneId = 2; zoneId <= 69; zoneId++) {
      const config = this.getCircusZoneObjectiveConfig(zoneId);
      if (!config) continue;
      missionCount++;
      const props = this.getCircusZoneProps(zoneId);
      const avatars = new Set(this.getCircusZoneSprites(zoneId).map(sprite => sprite.avatar || sprite.type));
      config.steps.forEach(step => {
        if (step.type === 'talk' && !avatars.has(step.avatar)) {
          errors.push(`ZONE ${zoneId}: PNJ ${step.avatar} absent pour ${step.label}`);
          return;
        }
        if (step.type === 'scan' || step.type === 'activate') {
          const available = props.filter(prop => prop.kind === step.kind).length;
          if (available < (step.count || 1)) {
            errors.push(`ZONE ${zoneId}: ${step.kind} ${available}/${step.count || 1} pour ${step.label}`);
          }
          if (step.type === 'activate' && !activatableKinds.has(step.kind)) {
            errors.push(`ZONE ${zoneId}: ${step.kind} n est pas activable`);
          }
        }
      });
    }
    return { ok: errors.length === 0, missionCount, errors };
  },

  getCircusZoneObjectiveStatus(zoneId, state) {
    const config = this.getCircusZoneObjectiveConfig(zoneId);
    if (!config || !state) return null;
    const props = this.getCircusZoneProps(zoneId);
    const activeIds = new Set([...state.activeProps.entries()].filter(([, enabled]) => enabled).map(([id]) => id));
    const countProps = (kind, source) => props.reduce((count, prop, index) => {
      if (prop.kind !== kind) return count;
      return source.has(`${zoneId}:${index}`) ? count + 1 : count;
    }, 0);
    const steps = config.steps.map(step => {
      let progress = 0;
      if (step.type === 'scan') progress = countProps(step.kind, state.discoveries);
      else if (step.type === 'activate') progress = countProps(step.kind, activeIds);
      else if (step.type === 'talk') {
        progress = state.talkedCharacters.has(`${zoneId}:${step.avatar}`) ? 1 : 0;
      }
      const target = step.count || 1;
      return { ...step, progress: Math.min(target, progress), target, complete: progress >= target };
    });
    const done = steps.filter(step => step.complete).length;
    const lockedComplete = state.completedZoneObjectives.has(zoneId);
    return {
      ...config,
      steps,
      done: lockedComplete ? steps.length : done,
      total: steps.length,
      complete: lockedComplete || done === steps.length,
      next: lockedComplete ? null : (steps.find(step => !step.complete) || null)
    };
  },

  completeCircusZoneObjectiveIfReady(state) {
    const status = this.getCircusZoneObjectiveStatus(state.currentZoneId, state);
    if (!status?.complete || state.completedZoneObjectives.has(state.currentZoneId)) return false;
    state.completedZoneObjectives.add(state.currentZoneId);
    this.unlockCainOSAchievement(`fps_mission_${state.currentZoneId}`, `Mission FPS: ${status.title}`);
    return true;
  },

  getCircusPropPersistentId(prop, zoneId = null) {
    const state = this.circusDoom;
    const zone = Number.isFinite(zoneId) ? zoneId : state?.currentZoneId;
    const index = prop?.interactionId ?? prop?.index;
    return Number.isFinite(zone) && Number.isFinite(index) ? `${zone}:${index}` : null;
  },

  isCircusPropPortable(prop) {
    return ['card', 'memory', 'candle', 'menu'].includes(prop?.kind) || prop?.portable === true;
  },

  performCircusPropAction(prop) {
    const state = this.circusDoom;
    if (!state || !prop) return;
    const verb = state.interactionVerb || 'use';
    if (verb === 'take') {
      this.takeCircusProp(prop);
      return;
    }
    if (verb === 'give') {
      state.interactionMessage = 'DONNER: visez un personnage, pas un objet.';
      state.interactionUntil = performance.now() + 2600;
      state.interactionChannel = 'system';
      state.interactionSpeaker = 'CAINOS';
      SoundManager.playError();
      return;
    }
    if (Number.isFinite(prop.target) && verb === 'use') {
      this.enterCircusPropPortal(prop);
      return;
    }
    this.inspectCircusProp(prop, { activate: verb !== 'look' });
  },

  performCircusCharacterAction(sprite) {
    const state = this.circusDoom;
    if (!state || !sprite) return;
    if (state.interactionVerb === 'give') {
      this.giveCircusHeldItem(sprite);
      return;
    }
    this.talkToCircusCharacter(sprite);
  },

  takeCircusProp(prop) {
    const state = this.circusDoom;
    if (!state || !prop) return;
    if (!this.isCircusPropPortable(prop)) {
      state.interactionMessage = `${this.getCircusPropName(prop, state.currentZoneId).toUpperCase()}: objet fixe. Utilisez OBSERVER ou UTILISER.`;
      state.interactionUntil = performance.now() + 3000;
      state.interactionChannel = 'system';
      state.interactionSpeaker = 'CAINOS';
      SoundManager.playError();
      return;
    }
    const id = this.getCircusPropPersistentId(prop);
    if (!id) return;
    if (state.heldItem) {
      state.interactionMessage = `MAIN OCCUPEE: donnez ${state.heldItem.name} avant de prendre autre chose.`;
      state.interactionUntil = performance.now() + 3200;
      state.interactionChannel = 'system';
      state.interactionSpeaker = 'CAINOS';
      SoundManager.playError();
      return;
    }
    const name = prop.label || this.getCircusPropName(prop, state.currentZoneId);
    state.discoveries.add(id);
    state.collectedProps.add(id);
    state.heldItem = { id, name, kind: prop.kind, campaignTarget: prop.campaignTarget || prop.kind, fromZone: state.currentZoneId, color: prop.color || '#fff1a8' };
    state.worldColliderZoneId = null;
    state.worldColliders = null;
    state.interactionMessage = `OBJET PRIS: ${name}. Selectionnez DONNER puis visez un personnage, ou UTILISER dans la bonne zone.`;
    state.interactionUntil = performance.now() + 5200;
    state.interactionChannel = 'scan';
    state.interactionSpeaker = name;
    state.interactionOrigin = null;
    this.advanceCircusZoneChallenge('take', prop.kind);
    this.advanceCircusCampaign('take', prop.campaignTarget || prop.kind);
    this.advanceCircusCustomAdventure('take', id);
    this.startCircusActivityForProp(prop, 'take');
    this.advanceCircusActivity('take', prop.campaignTarget || prop.kind);
    this.updateCircusFpsToolbar();
    this.saveCircusPersistentWorldState();
    this.renderCainOSTools();
    this.emitCircusNoise(0.42, `prise ${name}`);
    this.playCircusSpatialObjectSound(prop, 'pickup');
    SoundManager.play(720, 0.1, 'triangle', 0.05);
  },

  giveCircusHeldItem(sprite) {
    const state = this.circusDoom;
    if (!state || !sprite) return;
    if (!state.heldItem) {
      state.interactionMessage = 'MAIN VIDE: prenez d abord un objet transportable.';
      state.interactionUntil = performance.now() + 2600;
      state.interactionChannel = 'system';
      state.interactionSpeaker = 'CAINOS';
      SoundManager.playError();
      return;
    }
    const avatar = sprite.avatar || sprite.type;
    const item = state.heldItem;
    const campaign = this.getActiveCircusCampaignStatus();
    if (item.campaignTarget === 'zooblepart' && campaign?.progress.stage < 6) {
      state.interactionMessage = 'PIECE DE ZOOBLE: gardez-la jusqu au secours dans le cellar. La donner maintenant casserait la sequence du Pilot.';
      state.interactionUntil = performance.now() + 4200;
      state.interactionChannel = 'system';
      state.interactionSpeaker = 'CAINOS';
      SoundManager.playError();
      return;
    }
    state.givenProps.add(item.id);
    state.heldItem = null;
    state.interactionMessage = `${sprite.name}: Je garde ${item.name}. CainOS enregistrera que tu as choisi de me le confier.`;
    state.interactionUntil = performance.now() + 5200;
    state.interactionChannel = 'dialogue';
    state.interactionSpeaker = sprite.name;
    this.recordCircusMissionJournal('dialogue', sprite.name, line);
    state.interactionOrigin = { x: state.player.x, z: state.player.z, range: 1.6 };
    this.adjustCainOSRelation(avatar, 5);
    this.advanceCircusZoneChallenge('give', item.kind);
    this.advanceCircusCampaign('give', item.campaignTarget || item.kind);
    this.advanceCircusCustomAdventure('give', `${avatar}:${item.id}`);
    this.advanceCircusActivity('give', item.campaignTarget || item.kind);
    this.updateCircusFpsToolbar();
    this.saveCircusPersistentWorldState();
    this.emitCircusNoise(0.34, `objet donne a ${sprite.name}`);
    SoundManager.playWin();
  },

  inspectCircusProp(prop, options = {}) {
    const state = this.circusDoom;
    if (!state || !prop) return;
    const discoveryId = `${state.currentZoneId}:${prop.interactionId ?? prop.index ?? prop.kind}`;
    const wasDiscovered = state.discoveries.has(discoveryId);
    state.discoveries.add(discoveryId);
    const zoneProps = this.getCircusZoneProps(state.currentZoneId)
      .filter(candidate => !candidate.loreGate || this.hasCircusLoreGate(candidate.loreGate));
    const zoneDiscoveries = [...state.discoveries].filter(id => id.startsWith(`${state.currentZoneId}:`)).length;
    const discoveryStatus = wasDiscovered ? 'DEJA ANALYSE' : `NOUVELLE TRACE ${zoneDiscoveries}/${zoneProps.length}`;
    const activatableKinds = new Set(['console', 'gridnode', 'spotlight', 'candle', 'target', 'scoreboard', 'menu', 'card', 'archive', 'memory', 'ring', 'doorframe']);
    const toggleKinds = new Set(['spotlight', 'candle', 'ring']);
    let actionStatus = '';
    if (options.activate !== false && activatableKinds.has(prop.kind)) {
      const nextState = toggleKinds.has(prop.kind) ? !state.activeProps.get(discoveryId) : true;
      state.activeProps.set(discoveryId, nextState);
      actionStatus = nextState ? ' | OBJET ACTIVE' : ' | OBJET DESACTIVE';
    }
    if (!wasDiscovered && zoneDiscoveries >= zoneProps.length) {
      this.unlockCainOSAchievement(`zone_traces_${state.currentZoneId}`, `Zone analysee: ${state.portals[state.currentZoneId]?.short || state.currentZoneId}`);
    }
    const missionCompleted = this.completeCircusZoneObjectiveIfReady(state);
    const objective = this.getCircusZoneObjectiveStatus(state.currentZoneId, state);
    const missionStatus = missionCompleted ? ' | MISSION LOCALE TERMINEE'
      : objective ? ` | MISSION ${objective.done}/${objective.total}` : '';
    state.interactionMessage = `[${discoveryStatus}${actionStatus}${missionStatus}] ${this.getCircusPropInteraction(prop, state.currentZoneId)}`;
    this.recordCircusMissionJournal('object', this.getCircusPropName(prop, state.currentZoneId), state.interactionMessage);
    state.interactionUntil = performance.now() + 5600;
    state.interactionChoices = null;
    state.interactionOrigin = { x: state.player.x, z: state.player.z, range: 1.35 };
    state.interactionChannel = 'scan';
    state.interactionSpeaker = this.getCircusPropName(prop, state.currentZoneId);
    this.advanceCircusZoneChallenge(options.activate === false ? 'look' : 'use', prop.kind);
    this.advanceCircusCampaign(options.activate === false ? 'look' : 'use', prop.campaignTarget || prop.kind);
    this.advanceCircusCustomAdventure(options.activate === false ? 'look' : 'use', discoveryId);
    this.startCircusActivityForProp(prop, options.activate === false ? 'look' : 'use');
    this.advanceCircusActivity(options.activate === false ? 'look' : 'use', prop.campaignTarget || prop.kind);
    this.saveCircusPersistentWorldState();
    this.emitCircusNoise(options.activate === false ? 0.12 : 0.38, this.getCircusPropName(prop, state.currentZoneId));
    this.playCircusSpatialObjectSound(prop, options.activate === false ? 'scan' : 'activate');
    if (state.detailEl) state.detailEl.innerText = state.interactionMessage;
    SoundManager.play(390, 0.07, 'square', 0.04);
    setTimeout(() => SoundManager.play(585, 0.06, 'triangle', 0.035), 80);
  },

  getCircusPropInteraction(prop, zoneId) {
    const name = this.getCircusPropName(prop, zoneId);
    const bedroom = this.getCircusBedroomDefinitions()[zoneId];
    if (bedroom) {
      const canonBoundary = bedroom.archived
        ? `La porte de ${bedroom.resident} appartient a l historique du dortoir; cet interieur vide est une reconstruction CainOS et non une piece canonique confirmee.`
        : bedroom.canon === 'show'
          ? `La chambre de ${bedroom.resident} est montree dans la serie; CainOS en restitue les elements identifies sans pretendre reproduire chaque mesure.`
          : bedroom.canon === 'merch'
            ? `La chambre de ${bedroom.resident} est inspiree des representations officielles hors episode; CainOS la marque comme reconstruction partielle.`
            : `Seules des vues partielles de la chambre de ${bedroom.resident} sont disponibles; le mobilier manquant est une reconstruction CainOS.`;
      return `SCAN ${name}: ${canonBoundary}`;
    }
    if (prop.loreText) return `SCAN ${name}: ${prop.loreText}`;
    const lines = {
      '2:ring': "La piste centrale agit comme point d'ancrage: toutes les aventures reviennent vers le chapiteau.",
      '2:spotlight': "Les projecteurs suivent les avatars, pas les corps. CainOS detecte seulement des silhouettes numeriques.",
      '2:pillar': "Pilier de chapiteau: structure stable, couleurs primaires, aucune sortie reelle dans la toile.",
      '2:caineportal': "Portail d aventure genere par Caine sur la piste. Sa destination suit l episode actif, puis le choix libre apres Remember.",
      '3:tent': "Vue exterieure du chapiteau: le decor boucle vers les aventures de Caine.",
      '3:balloon': "Ballon de terrain: objet de fete banal, mais il sert de repere spatial dans la simulation.",
      '4:crate': "Caisse du cellar: stockage de traces dangereuses. Le systeme evite de nommer Kaufmo trop tot.",
      '4:eye': "Signal d'abstraction: les yeux ne sont pas un personnage actif, mais une menace archivee.",
      '5:exitframe': "Cadre de sortie: prototype visuel. CainOS marque la porte comme espoir, pas comme preuve.",
      '5:desk': "Bureau impossible: trace de l'illusion de sortie du pilote.",
      '6:candy': "Relief bonbon: decor sucre, mais route fortement scriptée autour du convoi.",
      '6:truck': "Camion-citerne: objet central du convoi. Les donnees NPC y collent plus que la physique.",
      '7:console': "Console de test: couche technique ou les PNJ deviennent lisibles comme donnees.",
      '7:gridnode': "Noeud de grille: raccourci de debug, pas un element visible pour les residents.",
      '8:window': "Fenetre du manoir: ouverture vers la peur, pas vers l'exterieur.",
      '8:building': "Mildenhall Manor: volume principal restitue a grande echelle; les mesures restent une reconstruction CainOS.",
      '8:table': "Table Mildenhall: point de scene ou les personnages sont forces de rester dans le role.",
      '8:candle': "Bougie: elle stabilise la piece juste assez pour rendre l'horreur visible.",
      '9:stairs': "Escalier du sous-sol: descente vers la memoire, avec moins de spectacle et plus de menace.",
      '9:barrel': "Baril du sous-sol: decor secondaire, utile comme repere dans une zone sombre.",
      '10:counter': "Comptoir Spudsy: transforme l'aventure en pression de service.",
      '10:menu': "Menu Spudsy: interface de travail absurde, parfaite pour casser le masque de Gangle.",
      '11:card': "Carte de suggestion: micro-aventure potentielle. Caine peut en faire une regle entiere.",
      '12:base': "Base de softball: terrain de jeu fabrique, costume sportif, logique de match.",
      '12:scoreboard': "Scoreboard: la simulation adore transformer le chaos en score lisible.",
      '13:target': "Cible de l'arene: l'episode arme rend la tension plus directe, mais toujours simulee.",
      '14:umbrella': "Parasol du lac: faux repos. Le decor promet une pause que Caine ne sait pas tenir.",
      '14:wave': "Vague digitale: eau de simulation, comportement trop propre pour etre naturel.",
      '14:sun': "Soleil du lac: PNJ ou menace selon le gag actif.",
      '15:console': "Console admin: passerelle vers les questions de controle et les couches C&A.",
      '15:gridnode': "Noeud admin: connecte le lac digital aux couches systeme plus profondes.",
      '16:desk': "Bureau de Caine: la mise en scene devient administration pure.",
      '16:console': "Console C&A: les traces techniques deviennent plus importantes que l'aventure.",
      '16:eye': "Oeil de monitoring: CainOS observe la simulation comme un dossier, pas comme un monde.",
      '17:memory': "Fragment memoire: zone a traiter comme archive emotionnelle, pas comme attraction.",
      '18:spotlight': "Spot final: tout revient sur les avatars quand le systeme perd sa stabilite.",
      '19:archive': "Cadre archive: membre repertorie, presence narrative verrouillee par la progression.",
      '20:roomdoor': "Porte de resident: bois sombre, portrait circulaire et plaque nominative comme dans le couloir du Cirque.",
      '20:wallart': "Tableau abstrait: decor colore place entre les chambres pour casser la repetition du corridor.",
      '20:ceilinglight': "Plafonnier chaud: repere regulier qui accentue la profondeur du long couloir.",
      '50:roomdoor': "Porte barree de l annexe ouest: ancien occupant abstrait; aucune presence active n est simulee dans la chambre.",
      '51:roomdoor': "Porte barree de l annexe est: ancien occupant abstrait; aucune presence active n est simulee dans la chambre.",
      '50:archive': "Registre de l annexe ouest: identites revelees tardivement, separees des residents actifs.",
      '51:archive': "Registre de l annexe est: portes historiques conservees sans recreer leurs occupants.",
      '21:counter': "Comptoir du Cafe Cirque: espace de pause distinct de la table commune du chapiteau.",
      '22:window': "Vitre de l'aquarium: elle separe la galerie seche du decor aquatique simule.",
      '23:stairs': "Relief enneige: chemin de l'aventure hivernale conserve comme scene praticable.",
      '24:target': "Cible western: accessoire de l'aventure armee, lie aux regles de confrontation de cette scene.",
      '25:table': "Mobilier scolaire: variante d'aventure isolee de la timeline principale.",
      '26:desk': "Bureau officiel: decor de variante politique, non confondu avec le coeur C&A.",
      '26:building': "Facade de la Maison-Blanche: repere monumental de cette micro-aventure, sans lien avec une sortie reelle.",
      '27:exitframe': "Cadre suspendu dans le Vide: il ressemble a une issue sans prouver qu'elle mene au monde reel.",
      '28:table': "Table de l'espace commun: point de rassemblement entre les aventures.",
      '29:doorframe': "Porte des tubes: destination volontairement instable dans l'infrastructure du Cirque.",
      '30:table': "Mobilier du Loser Corner: zone punitive interne, petite et volontairement inconfortable.",
      '31:stairs': "Acces de The Nest: trace d'une aventure supprimee, conservee comme archive balisee.",
      '32:stairs': "Escalier du palais: parcours d'audience avant la mission du convoi de sirop.",
      '32:building': "Palais royal Candy Canyon: silhouette dominante du royaume et point de depart du convoi.",
      '33:truck': "Camion-citerne du convoi: objectif mobile reliant le palais, les bandits et le Test Level.",
      '34:eye': "Ame du manoir: signal de possession confine a l'Enfer de Mildenhall.",
      '35:counter': "Plan de preparation Spudsy: commandes et cuisine sont separees en postes de travail.",
      '36:doorframe': "Cabine sanitaire Spudsy: sous-zone de service marquee comme biohazard.",
      '37:menu': "Ecran de formation: Jax est isole face aux consignes, hors de la salle publique.",
      '38:scoreboard': "Panneau des Awards: Caine convertit les epreuves et relations du groupe en recompenses.",
      '39:lighthouse': "Tour du phare: structure dominante de la plage et point de depart du toboggan.",
      '40:archive': "Coffre sous-marin: deja pille, il reste comme objectif vide de la scene.",
      '41:doorframe': "Porte du souvenir de Jax: fragment incomplet, pas sortie fiable vers le monde reel.",
      '42:ring': "Attraction foraine: silhouette visible depuis le terrain, mais jamais exploree dans le parcours canon.",
      '43:table': "Table principale du chapiteau: repas communs, distincts du Cafe Cirque."
    };
    const key = `${zoneId}:${prop.kind}`;
    const fallback = `${name}: objet de scene detecte. CainOS l'utilise comme repere interactif de la zone.`;
    const profileKey = this.getCircusPropProfileKey(prop, zoneId);
    const profileLine = profileKey ? this.getCircusProfileSummary(profileKey) : "";
    const line = lines[key] || fallback;
    return profileLine ? `SCAN ${name}: ${line} ${profileLine}` : `SCAN ${name}: ${line}`;
  },

  getCircusPropName(prop, zoneId) {
    const names = {
      pillar: "pilier",
      ring: "piste",
      spotlight: "projecteur",
      tent: "chapiteau",
      building: prop.style === 'manor' ? "Mildenhall Manor" : prop.style === 'palace' ? "palais royal" : "batiment",
      tower: "tour",
      lighthouse: "phare",
      balloon: "ballon",
      crate: "caisse",
      eye: "oeil systeme",
      exitframe: "cadre de sortie",
      desk: zoneId === 16 ? "bureau de Caine" : "bureau",
      candy: "relief bonbon",
      truck: "camion citerne",
      console: "console",
      gridnode: "noeud grille",
      window: "fenetre",
      table: "table",
      candle: "bougie",
      stairs: "escalier",
      barrel: "baril",
      counter: "comptoir",
      menu: "menu",
      card: "carte suggestion",
      base: "base",
      scoreboard: "scoreboard",
      target: "cible",
      umbrella: "parasol",
      wave: "vague",
      sun: "soleil",
      memory: "fragment memoire",
      archive: "cadre archive",
      doorframe: "cadre de porte",
      roomdoor: `porte de ${prop.label || 'resident'}`,
      caineportal: `portail de Caine vers ${prop.label || 'aventure'}`,
      bed: "lit",
      wallart: "tableau abstrait",
      ceilinglight: "plafonnier",
      lorebillboard: prop.label || "trace visuelle"
    };
    return names[prop.kind] || prop.kind || "objet";
  },

  getCircusPropProfileKey(prop, zoneId) {
    if (prop?.kind === 'lorebillboard' && prop.avatar) {
      return this.getCircusCharacterProfileKey({ avatar: prop.avatar });
    }
    const zoneMap = {
      '2:ring': 'CAINE',
      '2:caineportal': 'CAINE',
      '4:eye': 'KAUFMO',
      '5:exitframe': 'POMNI',
      '6:truck': 'GUMMIGOO',
      '7:console': 'GUMMIGOO',
      '8:window': 'BARON_MILDENHALL',
      '8:candle': 'GHOSTLY',
      '10:counter': 'GANGLE',
      '10:menu': 'GANGLE',
      '11:card': 'INTERMISSION_VOICE',
      '12:scoreboard': 'COMMITTEE_MEMBER',
      '13:target': 'JAX',
      '14:umbrella': 'SUN_NPC',
      '14:sun': 'SUN_NPC',
      '15:console': 'CHINESE_ROOM_NPC',
      '16:desk': 'CAINE',
      '16:console': 'ABEL',
      '16:eye': 'ABEL',
      '17:memory': 'QUEENIE',
      '18:spotlight': 'ABIGAIL',
      '19:archive': 'RIBBIT'
    };
    return zoneMap[`${zoneId}:${prop.kind}`] || null;
  },

  talkToCircusCharacter(sprite) {
    const state = this.circusDoom;
    if (!state || !sprite) return;
    const avatar = sprite.avatar || sprite.type;
    state.talkedCharacters.add(`${state.currentZoneId}:${avatar}`);
    if (sprite.silent || sprite.type === 'abstract') {
      const missionCompleted = this.completeCircusZoneObjectiveIfReady(state);
      const nonVerbal = sprite.silentText || (sprite.type === 'abstract'
        ? `${sprite.name}: grondement, souffle distordu et parasites multicolores. Aucun langage detecte.`
        : `${sprite.name}: signal visuel silencieux. Aucun dialogue canonique detecte.`);
      state.interactionMessage = `${nonVerbal}${missionCompleted ? ' [MISSION LOCALE TERMINEE]' : ''}`;
      state.interactionChoices = null;
      state.interactionUntil = performance.now() + 5200;
      state.interactionOrigin = { x: state.player.x, z: state.player.z, range: 1.45 };
      state.interactionChannel = 'scan';
      state.interactionSpeaker = 'CAINOS';
      this.advanceCircusCampaign('talk', avatar);
      this.advanceCircusCustomAdventure('talk', sprite.baseAvatar || avatar);
      this.emitCircusNoise(sprite.type === 'abstract' ? 0.52 : 0.08, `scan ${sprite.name}`);
      this.saveCircusPersistentWorldState();
      if (state.detailEl) state.detailEl.innerText = state.interactionMessage;
      SoundManager.play(sprite.type === 'abstract' ? 92 : 320, 0.12, 'sawtooth', sprite.type === 'abstract' ? 0.07 : 0.025);
      return;
    }
    const line = this.getCircusCharacterInteraction(sprite, state.currentZoneId);
    const choices = this.getCircusCharacterChoices(sprite, state.currentZoneId, line);
    const missionCompleted = this.completeCircusZoneObjectiveIfReady(state);
    state.interactionMessage = `${choices ? choices.prompt : line}${missionCompleted ? ' [MISSION LOCALE TERMINEE]' : ''}`;
    state.interactionChoices = choices;
    state.interactionUntil = performance.now() + (choices ? 12000 : 5600);
    state.interactionOrigin = { x: state.player.x, z: state.player.z, range: 1.45 };
    state.interactionChannel = 'dialogue';
    state.interactionSpeaker = sprite.name;
    this.advanceCircusCampaign('talk', avatar);
    this.advanceCircusCustomAdventure('talk', sprite.baseAvatar || avatar);
    this.emitCircusNoise(0.28, `dialogue ${sprite.name}`);
    this.saveCircusPersistentWorldState();
    if (state.detailEl) state.detailEl.innerText = state.interactionMessage;
    const voiceMix = this.getCircusSpatialAudioMix(sprite);
    if (typeof SoundManager.playFpsVoice === 'function') SoundManager.playFpsVoice(avatar, voiceMix.pan, voiceMix.distance);
    else SoundManager.play(520, 0.08, 'triangle', 0.05);
  },

  chooseCircusDialogueOption(index) {
    const state = this.circusDoom;
    const choices = state?.interactionChoices;
    if (!choices || !choices.options?.[index]) return;
    const option = choices.options[index];
    state.interactionMessage = option.response;
    state.interactionChoices = null;
    state.interactionUntil = performance.now() + 7200;
    state.interactionOrigin = { x: state.player.x, z: state.player.z, range: 1.45 };
    state.interactionChannel = option.channel || 'dialogue';
    state.interactionSpeaker = option.channel === 'system' ? 'CAINOS' : (choices.speaker || '');
    this.recordCircusMissionJournal(option.channel === 'system' ? 'system' : 'dialogue', state.interactionSpeaker, option.response);
    if (choices.avatar) {
      this.adjustCainOSRelation(choices.avatar, 3);
    }
    if (option.action === 'toggle-follow') {
      state.follower = state.follower?.avatar === choices.avatar ? null : { avatar: choices.avatar, name: choices.speaker };
      state.interactionMessage = state.follower
        ? `${choices.speaker} va accompagner le Visiteur 251 entre les zones accessibles.`
        : `${choices.speaker} reste dans cette zone.`;
    }
    this.saveCircusPersistentWorldState();
    if (state.detailEl) state.detailEl.innerText = state.interactionMessage;
    SoundManager.play(620 + index * 80, 0.08, 'triangle', 0.045);
  },

  enterCircusPropPortal(prop) {
    const state = this.circusDoom;
    if (!state || !prop || !Number.isFinite(prop.target)) return;
    const worldPoint = this.resolveCircusWorldPoint(prop, state);
    const distance = Math.hypot(worldPoint.x - state.player.x, worldPoint.z - state.player.z);
    if (distance > 1.7) {
      state.interactionMessage = 'PORTE HORS DE PORTEE: approchez-vous du portrait avant d entrer.';
      state.interactionUntil = performance.now() + 2400;
      state.interactionChannel = 'system';
      state.interactionSpeaker = '';
      SoundManager.playError();
      return;
    }
    const target = state.portals[prop.target];
    if (!target?.unlocked) {
      state.interactionMessage = `PORTE BARREE: ${target?.short || 'archive'} reste verrouillee par la progression.`;
      state.interactionUntil = performance.now() + 2800;
      state.interactionChannel = 'system';
      state.interactionSpeaker = '';
      SoundManager.playError();
      return;
    }
    const fromZoneId = state.currentZoneId;
    if (prop.kind === 'caineportal') {
      this.beginCircusPortalTransition(prop.target, fromZoneId);
      return;
    }
    this.beginCircusDoorTransition(prop.target, fromZoneId, prop.kind || 'roomdoor');
  },

  getCircusPortalTransitionStyle(targetId) {
    const motif = this.circusDoom?.scenes?.[targetId]?.motif || 'circus';
    const styles = {
      candy: { key: 'candy', color: '#ff9ad5', accent: '#ffd84a', label: 'SUCRE EN COURS DE COMPILATION' },
      manor: { key: 'manor', color: '#14101d', accent: '#b7f0ff', label: 'LUMIERES DU MANOIR EN SYNCHRONISATION' },
      spudsy: { key: 'spudsy', color: '#ff4d4d', accent: '#f6d743', label: 'COMMANDE D AVENTURE EN PREPARATION' },
      guns: { key: 'guns', color: '#17110a', accent: '#f6d743', label: 'CIBLES ET REGLES EN CHARGEMENT' },
      lake: { key: 'lake', color: '#073844', accent: '#4ee7ff', label: 'SURFACE DIGITALE EN FORMATION' },
      core: { key: 'core', color: '#10070d', accent: '#ff7a30', label: 'COUCHE C&A EN OUVERTURE' },
      final: { key: 'final', color: '#2b1018', accent: '#e53935', label: 'SIGNAL FINAL EN RECOMPOSITION' }
    };
    return styles[motif] || { key: 'circus', color: '#160d25', accent: '#7df0ff', label: 'AVENTURE EN COURS DE GENERATION' };
  },

  beginCircusPortalTransition(targetId, fromZoneId) {
    const state = this.circusDoom;
    if (!state || state.portalTransition) return;
    state.portalTransition = {
      targetId,
      fromZoneId,
      startedAt: performance.now(),
      duration: 2200,
      switched: false,
      style: this.getCircusPortalTransitionStyle(targetId)
    };
    state.interactionChoices = null;
    state.interactionMessage = state.portalTransition.style.label;
    state.interactionUntil = performance.now() + 2400;
    this.emitCircusNoise(0.5, 'portail de Caine');
    SoundManager.play(280, 0.32, 'sawtooth', 0.045);
  },

  updateCircusPortalTransition() {
    const state = this.circusDoom;
    const transition = state?.portalTransition;
    if (!transition) return false;
    const progress = Math.min(1, (performance.now() - transition.startedAt) / transition.duration);
    transition.progress = progress;
    if (progress >= 0.48 && !transition.switched) {
      transition.switched = true;
      state.history.push(transition.fromZoneId);
      this.setCircusSimulationZone(transition.targetId, false, transition.fromZoneId);
    }
    if (progress >= 1) {
      state.portalTransition = null;
      state.interactionMessage = `ARRIVEE: ${state.portals[state.currentZoneId]?.name || 'aventure'}.`;
      this.recordCircusMissionJournal('travel', 'Portail de Caine', state.interactionMessage);
      state.interactionUntil = performance.now() + 2600;
      state.interactionChannel = 'system';
      SoundManager.play(720, 0.16, 'triangle', 0.05);
      return false;
    }
    return true;
  },

  drawCircusPortalTransitionOverlay(ctx, w, h, state) {
    const transition = state?.portalTransition;
    if (!transition) return;
    const p = transition.progress || 0;
    const cover = p < 0.5 ? p * 2 : (1 - p) * 2;
    const style = transition.style;
    ctx.save();
    ctx.fillStyle = `${style.color}${Math.round(cover * 235).toString(16).padStart(2, '0')}`;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = style.accent;
    ctx.lineWidth = 3;
    const rings = style.key === 'candy' ? 8 : 5;
    for (let i = 0; i < rings; i++) {
      const radius = Math.max(8, (1 - ((p * 2 + i / rings) % 1)) * Math.max(w, h) * 0.62);
      ctx.beginPath();
      if (style.key === 'spudsy') ctx.rect(w / 2 - radius, h / 2 - radius * 0.45, radius * 2, radius * 0.9);
      else ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (style.key === 'manor') {
      ctx.fillStyle = `rgba(0,0,0,${Math.min(0.92, cover)})`;
      ctx.fillRect(0, 0, w * p, h);
      ctx.fillRect(w * (1 - p), 0, w * p, h);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(style.label, w / 2, h * 0.82);
    ctx.restore();
  },

  beginCircusDoorTransition(targetId, fromZoneId, kind = 'door') {
    const state = this.circusDoom;
    if (!state || state.doorTransition || state.portalTransition) return;
    const key = `${fromZoneId}:${targetId}`;
    state.doorStates.set(key, { open: true, openedAt: Date.now() });
    state.doorTransition = {
      key,
      kind,
      targetId,
      fromZoneId,
      startedAt: performance.now(),
      duration: 1050,
      switched: false,
      progress: 0
    };
    this.emitCircusNoise(kind === 'roomdoor' ? 0.28 : 0.42, 'porte');
    const door = this.getCircusPhysicalDoors(state).find(candidate => candidate.target === targetId);
    this.playCircusSpatialObjectSound(door || { x: state.player.x, z: state.player.z }, 'door');
  },

  updateCircusDoorTransition() {
    const state = this.circusDoom;
    const transition = state?.doorTransition;
    if (!transition) return false;
    const elapsed = performance.now() - transition.startedAt;
    transition.progress = Math.min(1, elapsed / transition.duration);
    if (transition.progress >= 0.58 && !transition.switched) {
      transition.switched = true;
      state.history.push(transition.fromZoneId);
      this.setCircusSimulationZone(transition.targetId, false, transition.fromZoneId);
    }
    if (transition.progress >= 1) {
      state.doorTransition = null;
      this.recordCircusMissionJournal('travel', 'Passage de porte', `Arrivee dans ${state.portals[state.currentZoneId]?.name || `zone ${state.currentZoneId}`}.`);
      this.saveCircusPersistentWorldState();
      return false;
    }
    return true;
  },

  getCircusDoorOpenProgress(door, state) {
    const transition = state?.doorTransition;
    if (transition) {
      const matchesBefore = state.currentZoneId === transition.fromZoneId && door.target === transition.targetId;
      const matchesAfter = state.currentZoneId === transition.targetId && door.target === transition.fromZoneId;
      if (matchesBefore) return Math.min(1, transition.progress * 1.7);
      if (matchesAfter) return Math.max(0, (1 - transition.progress) * 1.7);
    }
    const stored = state?.doorStates?.get(`${state.currentZoneId}:${door.target}`)
      || state?.doorStates?.get(`${door.target}:${state.currentZoneId}`);
    if (!stored?.open) return 0;
    return Math.max(0, 1 - (Date.now() - stored.openedAt) / 2400);
  },

  getCircusObjectiveDialogueOption(sprite, zoneId) {
    const state = this.circusDoom;
    const status = this.getCircusZoneObjectiveStatus(zoneId, state);
    if (!status || status.done === 0) return null;
    const completedResponses = {
      2: 'Caine: Magnifique! La piste, les projecteurs et ma supervision sont de nouveau parfaitement synchronises.',
      3: 'Caine: Le terrain est cartographie! Meme la Gloink Queen est exactement aussi enorme que prevu.',
      4: 'Pomni: On a identifie les signes. Maintenant, on garde nos distances avec ce qui reste de Kaufmo.',
      5: 'Pomni: Les cadres et le bureau sont reels ici, mais cela ne transforme toujours pas cette porte en sortie.',
      6: 'Gummigoo: Le camion et la route tiennent encore. C est assez pour continuer sans oublier ce qu on a vu.',
      8: 'Kinger: La lumiere a fixe les contours du manoir. Dans l obscurite, je me souviens mieux de ce qui compte.',
      10: 'Gangle: Les postes sont verifies et les tickets classes. Je peux reprendre mon souffle une seconde.',
      12: 'Jax: Les bases sont la, le score aussi. Il ne manque plus qu une regle assez mauvaise pour rendre le match interessant.',
      13: 'Ragatha: Les cibles sont reperees. Personne ne devrait avoir a decouvrir la prochaine en se trouvant devant.',
      14: 'Pomni: Le lac boucle encore, mais au moins nous savons quels reperes restent fixes autour de nous.',
      15: 'Ming: Les noeuds admin repondent. La scene technique ne peut plus pretendre qu elle est seulement du decor.',
      16: 'Caine: Audit termine! Tout est sous controle, si l on accepte une definition suffisamment festive du controle.',
      17: 'Kinger: Les fragments ne la rameneront pas. Mais les rassembler empeche son souvenir de devenir du bruit.',
      18: 'Ribbit Archive: Le signal est stable. Cela confirme une trace, pas un retour parmi les residents.'
    };
    if (status.complete) {
      return {
        label: 'Mission locale',
        response: completedResponses[zoneId] || `${sprite.name}: Les principaux reperes de cette zone repondent maintenant de facon coherente.`
      };
    }
    return {
      label: 'Prochaine etape',
      response: `${sprite.name}: Le prochain repere utile est: ${status.next?.label || 'continuer l exploration'}.`
    };
  },

  getCircusContextualDialogueOption(sprite, zoneId) {
    const state = this.circusDoom;
    if (!state) return null;
    const avatar = sprite.avatar || sprite.type;
    const held = state.heldItem;
    if (held) {
      const reactions = {
        caine: `Caine: ${held.name} appartient normalement a une scene precise. Le transporter est une experience emergente non planifiee!`,
        ragatha: `Ragatha: Garde ${held.name} visible. On pourra le rendre a la bonne scene sans perdre notre chemin.`,
        jax: `Jax: Tu te promenes vraiment avec ${held.name}? Enfin une decision raisonnablement mauvaise.`,
        kinger: `Kinger: ${held.name} se souvient peut-etre mieux de sa piece que nous.`,
        gangle: `Gangle: Fais attention avec ${held.name}. Les accessoires cassent parfois au pire moment.`,
        zooble: `Zooble: Ne me donne pas ${held.name}. J ai deja assez de pieces detachees.`
      };
      return { label: `Montrer ${held.name}`, response: reactions[avatar] || `${sprite.name}: Cet objet vient de ${this.circusDoom.portals[held.fromZone]?.short || 'la simulation'}.` };
    }
    const follower = state.follower;
    if (follower && follower.avatar !== avatar) {
      return {
        label: `Avec ${follower.name}`,
        response: `${sprite.name}: ${follower.name} connait deja une partie du trajet. Gardez une porte commune comme repere.`
      };
    }
    if (zoneId >= 64 && zoneId <= 69) {
      return {
        label: 'Cet etage',
        response: `${sprite.name}: Le lieu appartient bien a cette aventure, mais CainOS a reconstruit cet etage depuis les volumes visibles. Son plan exact n est pas canonique.`
      };
    }
    return null;
  },

  getCircusTimelineDialogueOption(sprite, zoneId) {
    const campaign = this.getActiveCircusCampaignStatus();
    if (!campaign || campaign.stage.zone !== zoneId) return null;
    const avatar = sprite.avatar || sprite.type;
    const involved = campaign.requirements.some(item => item.action === 'talk' && item.target === avatar);
    return {
      label: involved ? 'Scene actuelle' : 'Objectif actuel',
      response: `CAINOS / RECONSTRUCTION JOUABLE EP${campaign.definition.episode}.${campaign.progress.stage + 1}: ${campaign.stage.guide}`,
      channel: 'system'
    };
  },

  getCircusCharacterChoices(sprite, zoneId, introLine) {
    const avatar = sprite.avatar || sprite.type;
    const special = {
      pomni: [
        { label: "Sortie", response: "Pomni: Je peux regarder les portes, mais je ne veux plus confondre une promesse avec une sortie." },
        { label: "Rester groupee", response: "Pomni: Oui. Si je dois avancer, je prefere garder un visage connu dans mon champ de vision." }
      ],
      caine: [
        { label: "Controle", response: "Caine: Controle est un mot si lourd! Disons plutot presentation active de realite fabriquee." },
        { label: "Portes", response: "Caine: Les portes existent pour rendre les transitions plus elegantes, pas pour casser le spectacle." }
      ],
      gummigoo: [
        { label: "Memoire", response: "Gummigoo: Plus je regarde les bords de cette route, plus mes souvenirs ressemblent a des accessoires." },
        { label: "Convoi", response: "Gummigoo: Tant que le camion roule, la scene pretend que tout a un sens." }
      ],
      kinger: [
        { label: "Obscurite", response: "Kinger: Les pieces sombres n'effacent pas la peur. Elles l'empechent juste de se disperser." },
        { label: "Souvenirs", response: "Kinger: Certains souvenirs sont rangees comme des insectes. Il ne faut pas ouvrir la boite trop tot." }
      ],
      workgangle: [
        { label: "Commandes", response: "Gangle: Les tickets ne sont que des mini-aventures empilees jusqu'a ce que mon masque craque." },
        { label: "Masque", response: "Gangle: Ce masque me donne l'air fonctionnelle. Ce n'est pas la meme chose qu'aller bien." }
      ],
      ribbit: [
        { label: "Archive", response: "Ribbit Archive: Je suis une trace de membre disparu, pas un resident revenu dans le Cirque." },
        { label: "Le final", response: "Ribbit Archive: Le reve a fait remonter mon image sans restaurer celui que j etais." }
      ]
    };
    const dialogueByAvatar = {
      pomni: [
        { label: 'Le decor', response: "Pomni: Les couleurs changent, mais les limites finissent toujours par revenir." },
        { label: 'Avancer', response: "Pomni: D accord. Mais on garde une porte et quelqu un du groupe en vue." }
      ],
      caine: [
        { label: 'L aventure', response: "Caine: Chaque salle attend seulement son idee brillante, son objectif et une conclusion spectaculaire!" },
        { label: 'Le Cirque', response: "Caine: Le Cirque est un espace parfaitement organise tant que personne ne regarde derriere les decors!" }
      ],
      ragatha: [
        { label: 'Le groupe', response: "Ragatha: On avance mieux quand personne n est laisse seul avec ce qui lui fait peur." },
        { label: 'Les reperes', response: "Ragatha: Choisis un objet fixe et une porte. Si la scene change, reviens vers eux." }
      ],
      jax: [
        { label: 'Les objets', response: "Jax: Touche a tout. Le pire qui puisse arriver, c est que Caine appelle ca une fonctionnalite." },
        { label: 'Les portes', response: "Jax: Celle qui a le moins l air autorisee est probablement la plus interessante." }
      ],
      kinger: [
        { label: 'La piece', response: "Kinger: Les pieces gardent parfois mieux les souvenirs que les gens." },
        { label: 'La lumiere', response: "Kinger: L obscurite peut calmer les choses. Pas les effacer, seulement les calmer." }
      ],
      gangle: [
        { label: 'Rester ici', response: "Gangle: Je peux rester pres de ce repere pendant que tu regardes le reste." },
        { label: 'Le masque', response: "Gangle: Il aide les autres a savoir quoi attendre. Il ne m aide pas toujours, moi." }
      ],
      zooble: [
        { label: 'Explorer', response: "Zooble: Explore si tu veux. Je verifierai surtout que la piece ne decide pas de nous explorer aussi." },
        { label: 'Caine', response: "Zooble: Plus il dit que tout est sous controle, plus je regarde les murs." }
      ],
      gummigoo: [
        { label: 'Les souvenirs', response: "Gummigoo: Ils semblent reels jusqu au moment ou le decor montre leurs bords." },
        { label: 'La route', response: "Gummigoo: Tant qu elle continue, on peut choisir d avancer, meme si quelqu un d autre l a tracee." }
      ],
      bubble: [
        { label: 'Une idee', response: "Bubble: On choisit une porte, on fonce, et on demande les regles apres!" },
        { label: 'Caine', response: "Bubble: Caine a toujours un plan! Parfois meme avant que tout explose!" }
      ],
      max: [
        { label: 'Le convoi', response: "Max: On protege la cargaison et on garde Gummigoo dans notre champ de vision." },
        { label: 'La route', response: "Max: Elle parait libre, mais ses virages reviennent toujours au scenario." }
      ],
      chad: [
        { label: 'Gummigoo', response: "Chad: Je le suis. Meme quand la scene commence a lui raconter une autre histoire." },
        { label: 'Les bandits', response: "Chad: On connait notre role. C est justement ce qui devient inquietant." }
      ],
      loolilalu: [
        { label: 'Le royaume', response: "Princess Loolilalu: Chaque douceur a sa place, et chaque mission doit proteger le royaume." },
        { label: 'Le sirop', response: "Princess Loolilalu: La cargaison doit atteindre sa destination avant que les bandits ne la prennent." }
      ],
      fudge: [
        { label: 'La faim', response: "The Fudge: Tout ce royaume ressemble a un festin qui essaie de m echapper." },
        { label: 'Le decor', response: "The Fudge: Les murs sont en sucre. Cela suffit comme direction." }
      ],
      workgangle: [
        { label: 'Les commandes', response: "Gangle: Elles arrivent plus vite que je ne peux les organiser, meme avec ce masque." },
        { label: 'La cuisine', response: "Gangle: Si chaque poste reste a sa place, je peux peut etre garder le service sous controle." }
      ],
      horrorghost: [
        { label: 'La lumiere', response: "Fantome: Elle ne chasse pas ce qui habite le manoir. Elle lui donne seulement une forme." },
        { label: 'Les ames', response: "Fantome: Elles restent attachees aux pieces ou leur peur a ete nommee." }
      ],
      ming: [
        { label: 'Les Awards', response: "Ming: Je reste dans le cadre tant que Caine a besoin d un figurant pour sa ceremonie." },
        { label: 'Le signal', response: "Ming: Mon role est petit, mais la simulation continue tout de meme de me rappeler." }
      ],
      queenie: [
        { label: 'Kinger', response: "Queenie Archive: Ce que tu entends vient de sa memoire, pas d un retour dans le Cirque." },
        { label: 'Le souvenir', response: "Queenie Archive: Certaines traces restent parce que quelqu un refuse de les oublier." }
      ],
      ribbit: [
        { label: 'Le reve', response: "Ribbit Archive: Le reve a laisse remonter mon image, pas restaure ma presence." },
        { label: 'L archive', response: "Ribbit Archive: Je suis une trace lisible de ce qui existait avant votre groupe." }
      ]
    };
    const fallbackDialogue = [
      { label: 'Cette zone', response: `${sprite.name}: Mon signal appartient a ce decor et a ce moment de l aventure.` },
      { label: 'Que faire', response: `${sprite.name}: Observe les accessoires et les portes. Ils indiquent ce que cette scene attend de nous.` },
      { label: 'Continuer', response: `${sprite.name}: Les portes changent la scene. Approche-toi seulement de celle que tu veux vraiment suivre.` }
    ];
    const specialOptions = special[avatar] || special[sprite.type] || [];
    const dialogueOptions = dialogueByAvatar[avatar] || dialogueByAvatar[sprite.type] || fallbackDialogue;
    const objectiveOption = this.getCircusObjectiveDialogueOption(sprite, zoneId);
    const contextualOption = this.getCircusContextualDialogueOption(sprite, zoneId);
    const timelineOption = this.getCircusTimelineDialogueOption(sprite, zoneId);
    const followable = new Set(['pomni', 'ragatha', 'jax', 'kinger', 'gangle', 'zooble', 'gummigoo']);
    const followOption = followable.has(avatar) ? {
      label: this.circusDoom?.follower?.avatar === avatar ? 'Rester ici' : 'Me suivre',
      response: `${sprite.name}: D accord. Je garde le Visiteur 251 dans mon champ de vision.`,
      action: 'toggle-follow'
    } : null;
    return {
      speaker: sprite.name,
      avatar,
      prompt: introLine,
      options: [
        ...(objectiveOption ? [objectiveOption] : []),
        ...(timelineOption ? [timelineOption] : []),
        ...(contextualOption ? [contextualOption] : []),
        ...(followOption ? [followOption] : []),
        ...(specialOptions.slice(0, 1)),
        ...dialogueOptions
      ].slice(0, 3)
    };
  },

  getCircusZoneDialogueHint(zoneId) {
    const hints = {
      2: "CainOS: Le chapiteau sert de hub stable. Chaque aventure doit revenir ici pour garder le deroule lisible.",
      3: "CainOS: Le terrain exterieur montre les entites de spectacle et les Gloinks sans reveler les couches finales.",
      4: "CainOS: La cave reste une zone de danger liee a Kaufmo, pas un salon de PNJ.",
      6: "CainOS: Candy Canyon doit rester axe sur le convoi, Gummigoo et la faille de memoire NPC.",
      8: "CainOS: Le manoir active les peurs et souvenirs; les figures horrifiques restent confinees ici.",
      10: "CainOS: Spudsy transforme les interactions en service client et pression de masque pour Gangle.",
      11: "CainOS: Les variantes de micro-aventure sont rangees ici pour ne pas polluer la timeline principale.",
      12: "CainOS: Le stade autorise les costumes baseball comme scene sportive alternative.",
      14: "CainOS: Le lac digital imite une pause, mais les PNJ et le soleil restent suspects.",
      16: "CainOS: Le coeur C&A affiche les traces techniques, Abel et les objets actifs de fond.",
      17: "CainOS: Le buffer memoire ne restaure pas Queenie; il donne seulement acces a la trace de Kinger.",
      18: "CainOS: Le final accepte les signaux de reve, de couleur perdue et d'identite tardive.",
      19: "CainOS: Les Circus Members disparus restent des archives visuelles verrouillees par progression.",
      20: "CainOS: Le Resident Hall aligne les chambres sur un corridor rouge et rose. Les portraits identifient les portes sans inventer l interieur prive des residents.",
      27: "CainOS: Le Vide entoure le Cirque. Il ne contient ni mobilier fiable ni sortie vers le monde reel.",
      28: "CainOS: L espace commun appartient au chapiteau et accueille les temps morts entre les aventures.",
      29: "CainOS: Ces portes et tubes menent a des salles aleatoires; leur contenu n est pas une carte stable du Cirque.",
      30: "CainOS: Le Loser Corner est une punition interne du chapiteau, pas une aventure autonome.",
      31: "CainOS: The Nest est une aventure interne supprimee. Cette version est une archive balisee.",
      32: "CainOS: Le palais royal precede la mission du convoi. Princess Loolilalu y donne l objectif du sirop.",
      33: "CainOS: La route du tanker relie le royaume, les bandits crocodiles et la chute vers le Test Level.",
      34: "CainOS: L Enfer du manoir concentre les ames et la possession de Pomni; Kinger y reste le point d ancrage.",
      35: "CainOS: La cuisine Spudsy separe les postes de preparation du comptoir client.",
      36: "CainOS: Les sanitaires sont une sous-zone de service explicitement mentionnee comme biohazard.",
      37: "CainOS: Cette piece isole Jax face a la video de formation; elle n est pas une salle de spectacle.",
      38: "CainOS: La scene des Awards suit les epreuves. Caine y transforme les relations du groupe en recompenses.",
      39: "CainOS: Le phare et son toboggan dominent la plage et restent des structures du lac digital.",
      40: "CainOS: Le coffre sous-marin a deja ete pille; les deux poissons n assurent qu une garde de gag.",
      41: "CainOS: Cette rue est un souvenir incomplet de Jax. Elle ne constitue pas une sortie valide.",
      42: "CainOS: La fete foraine est visible sur le terrain mais jamais visitee; seules ses formes exterieures sont fiables.",
      43: "CainOS: La table du niveau principal est distincte du Cafe Cirque et sert aux repas communs.",
      64: "CainOS: Etage reconstruit depuis le volume de Mildenhall. Le manoir est canonique; ce plan vertical exact ne l est pas.",
      65: "CainOS: Grenier de gameplay marque comme reconstruction. Les signaux horrifiques restent ceux du manoir.",
      66: "CainOS: Galerie haute du palais reconstruite pour rendre son volume visitable sans modifier la mission du royaume.",
      67: "CainOS: Balcon CainOS raccorde au palais. La vue et les couleurs sont coherentes, la circulation est speculative.",
      68: "CainOS: Interieur du phare reconstruit depuis sa silhouette canonique et son lien avec le toboggan.",
      69: "CainOS: Lanterne praticable du phare. Cette hauteur sert la navigation, pas une affirmation sur un plan officiel."
    };
    return hints[zoneId] || "CainOS: Zone praticable. Les interactions restent limitees au lore deja debloque.";
  },

  getCircusRoutineDialogueHint(sprite, zoneId) {
    const routine = sprite.routine || this.getCircusSpriteRoutine(sprite, zoneId);
    const map = {
      pace: "ROUTINE PNJ: deplacement court en boucle, comme une attente nerveuse dans la scene.",
      hover: "ROUTINE PNJ: flottement visuel, utile pour les entites decoratives ou surnaturelles.",
      swarm: "ROUTINE PNJ: mouvement de petit groupe, reserve aux Gloinks et signaux tres mobiles.",
      tremble: "ROUTINE PNJ: tremblement court, associe aux abstractions, peurs ou signaux instables.",
      patrol: "ROUTINE PNJ: garde une ligne de scene, utile pour le service, le convoi ou les figurants.",
      idle: "ROUTINE PNJ: idle simple, pour ne pas transformer chaque archive en personnage actif."
    };
    return map[routine] || map.idle;
  },

  getCircusCharacterInteraction(sprite, zoneId) {
    const avatar = sprite.avatar || sprite.type;
    const zoneLines = {
      pomni: {
        2: "Pomni: Le chapiteau est stable, mais chaque porte ressemble encore a une fausse promesse.",
        4: "Pomni: Je reconnais trop bien cette pression. Kaufmo n'est pas une porte de sortie.",
        6: "Pomni: Le canyon a l'air ouvert, mais les murs de donnees reviennent toujours.",
        8: "Pomni: Le manoir force les souvenirs a remonter. Je prefere rester pres de Kinger.",
        10: "Pomni: Les commandes vont trop vite. Gangle tient a peine le rythme.",
        14: "Pomni: Le lac fait semblant d'etre calme. Caine fait toujours semblant.",
        18: "Pomni: Si tout perd ses couleurs, au moins on peut encore se retrouver ici.",
        64: "Pomni: Le manoir continue au-dessus, mais CainOS a complete les passages que nous n avons pas vus.",
        67: "Pomni: Ce balcon donne une vraie vue sur le royaume, meme si son plan est une reconstruction.",
        68: "Pomni: Le phare parait moins simple quand on doit vraiment monter a l interieur."
      },
      caine: {
        2: "Caine: Une scene praticable, des portes splendides, et aucune garantie de sortie!",
        16: "Caine: Le coeur C&A est un local technique, pas une salle de pause pour sujets curieux.",
        18: "Caine: Le spectacle continue tant que le systeme peut encore sourire.",
        67: "Caine: Un balcon royal parfaitement adapte aux besoins panoramiques de l aventure!",
        69: "Caine: La lanterne domine le lac et rend chaque sortie de toboggan infiniment plus spectaculaire!"
      },
      bubble: {
        2: "Bubble: Je vote pour la porte la plus brillante!",
        10: "Bubble: Commande supplementaire! Mauvaise idee supplementaire!"
      },
      jax: {
        2: "Jax: Si une porte est verrouillee, c'est probablement la seule interessante.",
        14: "Jax: Version chasseur, meme probleme: Caine appelle ca des vacances.",
        18: "Jax: Le final dramatique, c'est vraiment pas mon style.",
        68: "Jax: Monter tout ca pour redescendre par un toboggan. Enfin une architecture logique.",
        69: "Jax: De la-haut, on voit tres bien a quel point les vacances de Caine tournent en rond."
      },
      ragatha: {
        2: "Ragatha: Avance doucement. Les salles changent moins vite si on garde un repere.",
        8: "Ragatha: Le manoir n'est pas juste un decor. Il appuie sur les failles.",
        18: "Ragatha: Meme quand la scene casse, le groupe doit rester ensemble.",
        66: "Ragatha: La galerie reprend les couleurs du palais. Gardons l escalier comme repere."
      },
      kinger: {
        2: "Kinger: Les murs ont une memoire. Les portes aussi, malheureusement.",
        8: "Kinger: Les pieces sombres protegent parfois mieux les souvenirs.",
        17: "Kinger: Ce buffer n'est pas un puzzle. C'est une cicatrice rangee par le systeme.",
        64: "Kinger: Plus on monte, plus les souvenirs du manoir cherchent une piece ou se ranger.",
        65: "Kinger: Le grenier n est pas confirme, mais la peur qui s y accroche ressemble bien au manoir."
      },
      gangle: {
        2: "Gangle: Tant que mon masque tient, je peux te dire quelle porte a l'air moins terrible.",
        10: "Gangle: Spudsy transforme tout en service client, meme la panique.",
        14: "Gangle: La plage est jolie, mais mon signal n'aime pas le soleil."
      },
      zooble: {
        2: "Zooble: Caine appelle ca immersion. Moi j'appelle ca etre enferme avec style.",
        11: "Zooble: Les micro-aventures sont juste des problemes plus courts.",
        18: "Zooble: Si ce monde s'effondre, je veux au moins choisir ma posture."
      },
      gummigoo: {
        6: "Gummigoo: Le canyon a des bords. Les souvenirs, eux, ont l'air fabriques.",
        7: "Gummigoo: Cette couche de test me fait comprendre trop de choses."
      },
      max: {
        6: "Max: Si la route se repete, c'est peut-etre parce qu'on n'est pas la pour aller quelque part."
      },
      chad: {
        6: "Chad: On suit Gummigoo, mais cette route a trop de coutures pour etre normale."
      },
      loolilalu: {
        6: "Princess Loolilalu: Le royaume garde son decor royal, meme quand Caine transforme tout en mission."
      },
      fudge: {
        6: "The Fudge: La confiserie bouge comme une menace, pas comme un decor."
      },
      baronmildenhall: {
        8: "Baron Mildenhall: Les enregistrements du manoir veulent que tu regardes le trophée, mais pas toute la vérité.",
        9: "Baron Mildenhall: Le sous-sol transforme la chasse en piege."
      },
      marthamildenhall: {
        8: "Martha Mildenhall: La peur de Kinger n'efface pas ce qui s'est vraiment passe ici.",
        34: "Martha Mildenhall: Ce lieu garde une faute, mais aussi un souvenir capable de la nommer."
      },
      ghostly: {
        9: "Ghostly: Le manoir n'a pas que des menaces; certains signaux brillent encore."
      },
      angel: {
        8: "Angel: Le manoir m'a pris pour une menace avant que le récit corrige son erreur.",
        34: "Angel: Le sous-sol garde l'echo de ce que le Baron n'a pas compris."
      },
      horrorghost: {
        8: "Fantome: La lumiere ne chasse pas la peur. Elle la nomme."
      },
      horrormonster: {
        8: "Mildenhall Monster: Le manoir grossit ce que Pomni et Kinger refusent de regarder."
      },
      horrorpomnivoid: {
        8: "Possessed Pomni: Ce n'est qu'un etat de peur temporaire. Pomni n'est pas devenue ca."
      },
      horrorpomniskull: {
        9: "Horror Pomni: Le sous-sol garde les traces du manoir, meme apres la fuite."
      },
      workgangle: {
        10: "Gangle: Le comptoir transforme la scene en pression de travail. Mon masque tient a peine."
      },
      ming: {
        10: "Ming: Signal figurant detecte. Caine a l'air beaucoup trop agace par ce profil.",
        15: "Ming: Les couches admin classent les personnages de fond comme des anomalies presque importantes."
      },
      disappearingguy: {
        38: "Disappearing Guy: He--"
      },
      committeemember: {
        38: "Committee Member: La ceremonie de Caine a besoin d'un comite, meme quand le comite n'a presque rien a dire."
      },
      truthtellerfish: {
        14: "Orange Crappy Looking Fish: Dude, ils ont pris le coffre. C'etait toutes mes economies."
      },
      liarfish: {
        14: "Red Crappy Looking Fish: C'est moi qui raconte des mensonges."
      },
      stupidburgermannequin: {
        10: "Spudsy Mannequin: Je voudrais commander le Stupid Burger. N'oublie pas la sauce."
      },
      cerealmannequin: {
        10: "Spudsy Mannequin: Non merci, j'ai deja ce bol de cereales."
      },
      shrimpnpc: {
        14: "Shrimp NPC: En tant que PNJ crevette, je suis surtout inquiet du soleil.",
        40: "Shrimp NPC: Le lac digital n'est pas plus rassurant vu de pres."
      },
      chineseroomnpc: {
        15: "Chinese Room NPC: Oh, merci. Cette piece etait beaucoup trop litterale."
      },
      additionalvoices: {
        7: "Additional Voices: Mannequin de fond detecte dans la couche technique, sans profil humain confirme.",
        15: "Additional Voices: La simulation recycle meme les figurants quand le systeme manque de repere."
      },
      orbsman: {
        11: "Orbsman: Micro-aventure detectee. Le corps en spheres tient mieux que la logique de Caine."
      },
      ganglekawaii: {
        11: "Kawaii Gangle: Variante cosmetique. CainOS la garde hors de la timeline principale."
      },
      evilpomni: {
        11: "Evil Pomni: Variante hostile issue d'une idee alternative, pas une vraie transformation de Pomni."
      },
      eviljax: {
        11: "Evil Jax: Variante de micro-aventure. Le signal reste separe du Jax principal."
      },
      kaufmo: {
        4: "Kaufmo Archive: signal abstrait. Conversation impossible, danger reel."
      },
      abelmannequin: {
        16: "Abel: Les couches C&A n'ont pas ete construites pour etre visitees par des avatars."
      },
      abelfullbody: {
        16: "Abel Full Body: Archive physique reconstruite, a traiter comme trace C&A et non resident actif."
      },
      themachine: {
        15: "The Machine: Objet vivant ou decor actif, mais CainOS ne le classe pas comme resident du Cirque.",
        16: "The Machine: La couche C&A laisse parfois les objets avoir plus de presence que les personnages."
      },
      blueai: {
        16: "CainOS // ARCHIVE: Blue AI a ete developpee par C&A pour remplacer Caine, puis absorbee par lui avant leur separation dans Remember."
      },
      bonepastor: {
        8: "CainOS // EASTER EGG: The Bone Pastor est visible dans Mildenhall Manor; aucun dialogue canonique n est attribue a cette apparition."
      },
      fourthcrocodile: {
        16: "CainOS // ARCHIVE EP8: crocodile jaune quadrupede invoque pendant la sequence de tourment; son identite exacte n est pas confirmee."
      },
      ragathamothershadow: {
        16: "CainOS // ARCHIVE EP8: silhouette feminine projetee face a Ragatha. Le lien maternel est suggere par la scene, pas confirme comme identite."
      },
      laughingshadows: {
        16: "CainOS // ARCHIVE EP8: silhouettes rieuses utilisees contre Jax. Elles imitent des formes connues sans restaurer les personnages correspondants."
      },
      cookiebutterfly: {
        6: "CainOS // OBSERVATION: Un Cookie Butterfly vole au-dessus du royaume sucre; aucun dialogue detecte.",
        11: "CainOS // VISUEL: La micro-aventure reutilise un Cookie Butterfly comme figurant de simulation."
      },
      gummyelephant: {
        6: "CainOS // OBSERVATION: Le Gummy Elephant attend devant le carrosse de Candy Canyon; aucun langage detecte.",
        66: "CainOS // ARCHIVE: Le profil du Gummy Elephant reste associe au palais et a l aventure Candy Canyon."
      },
      giantcentipede: {
        12: "CainOS // OBSERVATION: Un Giant Centipede domine les gradins du match; son echelle depasse celle des figurants."
      },
      drfootball: {
        29: "CainOS // OBSERVATION: Dr. Football est indexe parmi les accessoires du Pilote, sans dialogue ni statut de resident."
      },
      candyguardcyan: {
        32: "CainOS // OBSERVATION: Le garde mannequin cyan reste silencieux devant l acces royal."
      },
      candyguardblue: {
        32: "CainOS // OBSERVATION: Le garde mannequin bleu suit une courte ronde de palais sans dialogue."
      },
      candyguardpurple: {
        32: "CainOS // OBSERVATION: Le garde mannequin violet partage le meme protocole que les deux autres modeles."
      },
      redmannequin: {
        32: "CainOS // OBSERVATION: Mannequin rouge de foule Candy Canyon; aucun dialogue detecte."
      },
      orangemannequin: {
        32: "CainOS // OBSERVATION: Mannequin orange de foule Candy Canyon; modele visuel, pas identite individuelle."
      },
      yellowmannequin: {
        32: "CainOS // OBSERVATION: Mannequin jaune de foule Candy Canyon; protocole figurant silencieux."
      },
      magentamannequin: {
        32: "CainOS // OBSERVATION: Mannequin magenta de Candy Canyon; CainOS ne confirme aucun nom propre."
      },
      gummyworm: {
        6: "CainOS // OBSERVATION: Un Gummy Worm segmente longe la douve chocolat; aucun langage detecte."
      },
      barrelmonkey: {
        3: "SFX // BARREL MONKEY: claquements de plastique et cris de jouet sans parole."
      },
      jeffery: {
        11: "CainOS // VISUEL: Jeffery adopte sa forme de danseur; le signal reste rattache a l oeil droit de Caine."
      },
      mildenhallsouls: {
        9: "CainOS // OBSERVATION: Ames de Mildenhall detectees comme phenomene spectral, sans dialogue individuel indexe.",
        34: "CainOS // OBSERVATION: Signal d ames lie a la possession et a l exorcisme du manoir."
      },
      albertspudsy: {
        10: "CainOS // VISUEL: Albert Spudsy detecte comme image de marque/decoupe, pas comme PNJ actif.",
        35: "CainOS // VISUEL: Albert Spudsy reste un visuel de restaurant; aucune interaction de personnage."
      },
      spudsycustomer: {
        10: "Spudsy Customer: Mon ticket est pret depuis trois minutes. Le comptoir est le vrai boss de cette aventure.",
        35: "Spudsy Customer: Les commandes arrivent plus vite que Gangle ne peut les absorber."
      },
      queenie: {
        17: "Queenie Archive: Le signal reste une memoire de Kinger, pas une residente revenue dans la piste."
      },
      shadowkinger: {
        17: "Shadow Kinger: Projection de peur liee a la memoire, pas un second Kinger."
      },
      ribbit: {
        18: "Ribbit Dream Signal: le final laisse remonter les membres disparus sous forme de souvenir.",
        19: "Ribbit Archive: profil conserve comme trace de membre disparu."
      },
      wormo: {
        19: "Wormo Archive: signal ancien indexe dans les membres du cirque."
      },
      scratch: {
        19: "Scratch Archive: premier bruit d'abstraction classe par CainOS."
      },
      bizco: {
        19: "Bizco Archive: ancien membre conserve en signal abstrait, pas en PNJ actif."
      },
      rattie: {
        19: "Rattie Archive: petit profil de membre disparu, verrouille a la couche finale."
      },
      spike: {
        19: "Spike Archive: silhouette ancienne classee dans les residents disparus."
      },
      pinkcyclops: {
        19: "Pink Cyclops Archive: signal de membre abstrait conserve pour l'archive visuelle."
      },
      yellowclown: {
        19: "Yellow Clown Archive: le visage triste reste indexe comme ancienne presence."
      },
      oyster: {
        19: "Oyster Archive: forme d'objet vivant, mais CainOS la classe comme membre disparu."
      },
      bulbcreature: {
        19: "Bulb Creature Archive: signal vegetal/bulbe archive dans les Circus Members."
      }
    };
    const defaultLines = {
      pomni: "Pomni: Je cherche encore une sortie, mais je peux au moins te suivre.",
      caine: "Caine: Bienvenue dans une experience immersive entierement sure, probablement!",
      bubble: "Bubble: Porte! Porte! Porte!",
      ragatha: "Ragatha: On reste calme et on observe la scene.",
      jax: "Jax: Super. Une interface qui donne envie de toucher a tout.",
      kinger: "Kinger: Les pieces ont une structure, meme quand elles mentent.",
      gangle: "Gangle: Je peux essayer d'aider si rien ne casse.",
      zooble: "Zooble: Cette zone est praticable, ce qui est deja suspect.",
      gummigoo: "Gummigoo: Ces murs ressemblent a des donnees habillees en decor.",
      max: "Max: La route a l'air libre, mais elle tourne en rond comme un script.",
      chad: "Chad: Le convoi suit les rails de la scene.",
      loolilalu: "Princess Loolilalu: Le royaume garde ses regles de conte, meme sous CainOS.",
      fudge: "The Fudge: Signal de confiserie instable.",
      baronmildenhall: "Baron Mildenhall: Signal de manoir confine.",
      marthamildenhall: "Martha Mildenhall: Presence spectrale Mildenhall detectee.",
      ghostly: "Ghostly: Petit signal spectral detecte.",
      angel: "Angel: Creature du manoir, statut corrige apres revelation.",
      kaufmo: "Kaufmo Archive: ...",
      horrorghost: "Fantome: Le signal te regarde aussi.",
      horrormonster: "Mildenhall Monster: Signal horrifique confine au manoir.",
      horrorpomnivoid: "Possessed Pomni: Projection de peur, pas nouvel avatar stable.",
      horrorpomniskull: "Horror Pomni: Trace de panique visuelle.",
      workgangle: "Gangle: Le service client est plus dur que les aventures.",
      ming: "Ming: Figurants et prix absurdes detectes.",
      disappearingguy: "Disappearing Guy: Signal intermittent.",
      committeemember: "Committee Member: Signal de comite detecte.",
      truthtellerfish: "Orange Crappy Looking Fish: Signal poisson orange detecte.",
      liarfish: "Red Crappy Looking Fish: Signal poisson rouge detecte.",
      stupidburgermannequin: "Spudsy Mannequin: Commande Stupid Burger detectee.",
      cerealmannequin: "Spudsy Mannequin: Bol de cereales detecte dans la file.",
      shrimpnpc: "Shrimp NPC: Signal crevette detecte.",
      chineseroomnpc: "Chinese Room NPC: Signal Chinese Room detecte.",
      blueai: "CainOS // ARCHIVE: signal canonique Blue AI detecte; donnees verrouillees jusqu a sa revelation dans Remember.",
      bonepastor: "CainOS // EASTER EGG: The Bone Pastor detecte dans le decor de Mildenhall.",
      fourthcrocodile: "CainOS // ARCHIVE: entite crocodile de la sequence de tourment de l episode 8.",
      ragathamothershadow: "CainOS // ARCHIVE: silhouette feminine liee au tourment de Ragatha.",
      laughingshadows: "CainOS // ARCHIVE: groupe de silhouettes rieuses lie au tourment de Jax.",
      cookiebutterfly: "CainOS // OBSERVATION: Cookie Butterfly detecte comme faune decorative de simulation.",
      gummyelephant: "CainOS // OBSERVATION: Gummy Elephant detecte comme creature de Candy Canyon.",
      giantcentipede: "CainOS // OBSERVATION: Giant Centipede detecte a grande echelle dans la simulation.",
      drfootball: "CainOS // OBSERVATION: Dr. Football detecte comme accessoire sans dialogue.",
      candyguardcyan: "CainOS // OBSERVATION: Garde mannequin cyan silencieux detecte.",
      candyguardblue: "CainOS // OBSERVATION: Garde mannequin bleu silencieux detecte.",
      candyguardpurple: "CainOS // OBSERVATION: Garde mannequin violet silencieux detecte.",
      redmannequin: "CainOS // OBSERVATION: Mannequin rouge de foule detecte.",
      orangemannequin: "CainOS // OBSERVATION: Mannequin orange de foule detecte.",
      yellowmannequin: "CainOS // OBSERVATION: Mannequin jaune de foule detecte.",
      magentamannequin: "CainOS // OBSERVATION: Mannequin magenta de foule detecte.",
      gummyworm: "CainOS // OBSERVATION: Petite faune gommeuse sans dialogue detectee.",
      barrelmonkey: "SFX // BARREL MONKEY: jouet articule sans dialogue detecte.",
      jeffery: "CainOS // VISUEL: Forme de danseur de Jeffery detectee comme extension de Caine.",
      mildenhallsouls: "CainOS // OBSERVATION: Amas spectral de Mildenhall detecte.",
      albertspudsy: "CainOS // VISUEL: Decoupe Albert Spudsy detectee.",
      spudsycustomer: "Spudsy Customer: Client Spudsy reconstruit detecte.",
      additionalvoices: "Additional Voices: Signal de fond classe comme personnage secondaire.",
      themachine: "The Machine: Decor actif sous observation.",
      orbsman: "Orbsman: Micro-aventure orbitee, logique minimale.",
      ganglekawaii: "Kawaii Gangle: Variante cosmetique verrouillee hors canon principal.",
      evilpomni: "Evil Pomni: Variante hostile de micro-aventure.",
      eviljax: "Evil Jax: Variante hostile de micro-aventure.",
      abelmannequin: "Abel: Trace C&A detectee.",
      abelfullbody: "Abel Full Body: Archive C&A detectee.",
      queenie: "Queenie Archive: memoire protegee.",
      shadowkinger: "Shadow Kinger: projection cauchemar detectee.",
      ribbit: "Ribbit Archive: signal secondaire.",
      wormo: "Wormo Archive: signal secondaire.",
      scratch: "Scratch Archive: signal secondaire.",
      bizco: "Bizco Archive: signal secondaire.",
      rattie: "Rattie Archive: signal secondaire.",
      spike: "Spike Archive: signal secondaire.",
      pinkcyclops: "Pink Cyclops Archive: signal secondaire.",
      yellowclown: "Yellow Clown Archive: signal secondaire.",
      oyster: "Oyster Archive: signal secondaire.",
      bulbcreature: "Bulb Creature Archive: signal secondaire."
    };
    const baseLine = zoneLines[avatar]?.[zoneId] || defaultLines[avatar] || `${sprite.name}: Signal detecte.`;
    const followups = {
      pomni: [
        "Pomni: Je prefere verifier ce qui se trouve vraiment dans la piece avant de croire une nouvelle direction.",
        "Pomni: Si le decor change encore, garde la derniere porte comme point de repere."
      ],
      caine: [
        "Caine: Chaque accessoire interactif a ete place pour une experience parfaitement controlee!",
        "Caine: Une zone sans surprise est une zone qui attend sa prochaine aventure."
      ],
      jax: [
        "Jax: Fouille les accessoires. Caine cache souvent ses meilleures erreurs dans le decor.",
        "Jax: Les panneaux expliquent les regles. Les portes montrent ou elles cassent."
      ],
      ragatha: [
        "Ragatha: Prends le temps de regarder autour de toi. Les details disent souvent dans quelle aventure on se trouve.",
        "Ragatha: Reviens vers le groupe si la piece commence a ne plus ressembler a elle-meme."
      ],
      kinger: [
        "Kinger: Les objets fixes sont de bons reperes. Sauf quand ils se souviennent de ne pas l'etre.",
        "Kinger: Une porte vue de loin parait petite. Une mauvaise idee fait exactement l'inverse."
      ],
      gangle: [
        "Gangle: Examiner les accessoires me rassure. Ils ont rarement besoin que je fasse semblant d'aller bien.",
        "Gangle: Je peux rester ici pendant que tu verifies le reste de la scene."
      ],
      zooble: [
        "Zooble: Le decor est plus honnete quand il admet que c'est un decor.",
        "Zooble: Explore si tu veux. Moi, je garde un oeil sur les limites de la piece."
      ],
      gummigoo: [
        "Gummigoo: Les objets ont une place prevue. C'est ce qui rend leurs souvenirs si suspects.",
        "Gummigoo: Une route peut etre immense et ne mener nulle part si quelqu'un l'a ecrite comme ca."
      ]
    };
    const visitKey = `${zoneId}:${avatar}:${sprite.name}`;
    const visitCount = this.circusDoom?.dialogueVisits?.get(visitKey) || 0;
    this.circusDoom?.dialogueVisits?.set(visitKey, visitCount + 1);
    const alternatives = followups[avatar] || [];
    const line = visitCount > 0 && alternatives.length
      ? alternatives[(visitCount - 1) % alternatives.length]
      : baseLine;
    return line;
  },

  getCircusCharacterProfileKey(sprite) {
    const key = sprite.avatar || sprite.type || "";
    const map = {
      pomni: "POMNI",
      caine: "CAINE",
      bubble: "BUBBLE",
      ragatha: "RAGATHA",
      jax: "JAX",
      kinger: "KINGER",
      gangle: "GANGLE",
      zooble: "ZOOBLE",
      kaufmo: "KAUFMO",
      abstractedkaufmo: "ABSTRACTED_KAUFMO",
      cellarabstraction: "CELLAR_ABSTRACTION",
      aquaticabstraction: "AQUATIC_ABSTRACTION",
      gummigoo: "GUMMIGOO",
      max: "MAX",
      chad: "BANDIT",
      loolilalu: "PRINCESS_LOO",
      fudge: "THE_FUDGE",
      baronmildenhall: "BARON_MILDENHALL",
      marthamildenhall: "MARTHA_MILDENHALL",
      ghostly: "GHOSTLY",
      angel: "MOUNTED_CREATURE_HEAD",
      horrorghost: "GHOSTLY",
      horrormonster: "BARON_MILDENHALL",
      horrorpomnivoid: "POSSESSED_POMNI",
      horrorpomnispiral: "POSSESSED_POMNI",
      horrorpomniskull: "POSSESSED_POMNI",
      workgangle: "GANGLE",
      ganglekawaii: "GANGLE",
      orbsman: "ORBSMAN",
      evilpomni: "EVIL_VARIANT",
      eviljax: "EVIL_VARIANT",
      shadowjax: "JAX",
      shadowkinger: "KINGER",
      hunterjax: "JAX",
      beachgangle: "GANGLE",
      ming: "MING",
      disappearingguy: "DISAPPEARING_GUY",
      floatingworm: "FLOATING_WORM",
      creditsfish: "CREDITS_FISH",
      stabbedragdolls: "STABBED_RAGDOLLS",
      coiledcentipedes: "COILED_CENTIPEDES",
      unusedbrainscans: "UNUSED_BRAINSCANS",
      committeemember: "COMMITTEE_MEMBER",
      truthtellerfish: "TRUTH_TELLER_NPC",
      liarfish: "LIAR_NPC",
      stupidburgermannequin: "SPUDSY_BURGER_CUSTOMER",
      cerealmannequin: "SPUDSY_CEREAL_CUSTOMER",
      shrimpnpc: "SHRIMP_NPC",
      chineseroomnpc: "CHINESE_ROOM_NPC",
      blueai: "BLUE_AI",
      bonepastor: "BONE_PASTOR",
      fourthcrocodile: "FOURTH_CROCODILE",
      ragathamothershadow: "FEMININE_SHADOW",
      paintedmasks: "PAINTED_MASKS",
      zoobleparts: "ZOOBLE_PARTS_MIRRORS",
      laughingshadows: "LAUGHING_SHADOWS",
      abigailbrooks: "ABIGAIL",
      suzieackerman: "SUZIE_ACKERMAN",
      zoeyraghavan: "ZOEY_RAGHAVAN",
      rileyverselis: "RILEY_VERSELIS",
      grantbest: "GRANT_BEST",
      leeroymateo: "LEEROY_MATEO",
      jaxfather: "JAX_FATHER",
      jaxmother: "JAX_MOTHER",
      abigailfriendone: "ABIGAIL_FRIEND_ONE",
      abigailfriendtwo: "ABIGAIL_FRIEND_TWO",
      bestchildren: "BEST_CHILDREN",
      cookiebutterfly: "COOKIE_BUTTERFLY",
      gummyelephant: "GUMMY_ELEPHANT",
      giantcentipede: "GIANT_CENTIPEDE",
      drfootball: "DR_FOOTBALL",
      candyguardcyan: "CANDY_GUARD",
      candyguardblue: "CANDY_GUARD",
      candyguardpurple: "CANDY_GUARD",
      redmannequin: "COLORED_MANNEQUIN",
      orangemannequin: "COLORED_MANNEQUIN",
      yellowmannequin: "COLORED_MANNEQUIN",
      magentamannequin: "COLORED_MANNEQUIN",
      gummyworm: "GUMMY_WORM",
      barrelmonkey: "BARREL_MONKEY",
      jeffery: "JEFFERY",
      mildenhallsouls: "MILDENHALL_SOULS",
      albertspudsy: "ALBERT_SPUDSY",
      spudsycustomer: "SPUDSY_NPC",
      additionalvoices: "VOICE",
      themachine: "BACKGROUND",
      abelmannequin: "ABEL",
      abelfullbody: "ABEL",
      abel: "ABEL",
      queenie: "QUEENIE",
      sun: "SUN_NPC",
      moon: "MOON",
      gloinkqueenscale: "GLOINK_QUEEN",
      gloinkstar: "GLOINK",
      gloinkcube: "GLOINK",
      gloinkround: "GLOINK",
      ribbit: "RIBBIT",
      wormo: "WORMO",
      scratch: "SCRATCH",
      bizco: "BIZCO",
      rattie: "RATTIE",
      spike: "SPIKE",
      pinkcyclops: "PINK_FURRY_CYCLOPS",
      yellowclown: "FROWNING_YELLOW_CLOWN_CREATURE",
      oyster: "OYSTER",
      bulbcreature: "LIGHT_GREEN_BULB_LIKE"
    };
    return map[key] || null;
  },

  getCircusProfileSummary(profileKey) {
    const profile = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.storyCharacterProfiles?.[profileKey] : null;
    if (!profile) return "";
    const known = this.hasCircusLoreGate(profile.unlockAt);
    const label = known ? (profile.label || profileKey) : (profile.lockedLabel || "Signal verrouille");
    const info = known
      ? (profile.info || "Profil CainOS disponible.")
      : (profile.lockedInfo || "Information verrouillee: continuez les episodes pour eviter les spoilers.");
    return `[${known ? "INFO OK" : "INFO VERROUILLEE"} - ${label}] ${info}`;
  },

  hasCircusLoreGate(gate) {
    if (!gate) return true;
    if (typeof EpisodeManager !== 'undefined' && typeof EpisodeManager.hasReachedLoreGate === 'function') {
      return EpisodeManager.hasReachedLoreGate(gate);
    }
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    if (progress.includes(gate.episode)) return true;
    for (let i = (gate.episode || 0) + 1; i <= 9; i++) {
      if (progress.includes(i)) return true;
    }
    return false;
  },

  getNearestUsableCircusDoor() {
    const state = this.circusDoom;
    if (!state) return null;
    const doors = this.getCircusPhysicalDoors(state);
    let best = null;
    doors.forEach((door, index) => {
      if (!this.isCircusWorldPointVisible(door, state, 0.82)) return;
      const pos = this.resolveCircusWorldPoint(door, state);
      const dx = pos.x - state.player.x;
      const dz = pos.z - state.player.z;
      const dist = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx) - state.player.a;
      const normalized = Math.atan2(Math.sin(angle), Math.cos(angle));
      const score = dist + Math.abs(normalized) * 2.8;
      if (!best || score < best.score) best = { ...door, index, dist, angle: normalized, score };
    });
    return best;
  },

  enterCircusSimulationExit(targetId) {
    const state = this.circusDoom;
    if (!state) return;
    const physicalDoor = this.getCircusPhysicalDoors(state).find(door => door.target === targetId);
    if (!physicalDoor) return;
    const doorPoint = this.resolveCircusWorldPoint(physicalDoor, state);
    const doorDistance = Math.hypot(doorPoint.x - state.player.x, doorPoint.z - state.player.z);
    if (doorDistance > 1.85) {
      state.interactionMessage = 'PORTE HORS DE PORTEE: la perspective ne permet pas une interaction distante.';
      state.interactionUntil = performance.now() + 2400;
      state.interactionChannel = 'system';
      state.interactionSpeaker = '';
      SoundManager.playError();
      return;
    }
    const target = state.portals[targetId];
    if (!target?.unlocked) {
      SoundManager.playError();
      if (state.detailEl) {
        state.detailEl.innerText = `VERROUILLE: continuez les episodes avant d ouvrir ${target?.name || 'cette zone'}.`;
      }
      return;
    }
    const fromZoneId = state.currentZoneId;
    this.beginCircusDoorTransition(targetId, fromZoneId, 'worlddoor');
  },

  setCircusSimulationZone(zoneId, playSound = true, entryFromZoneId = null) {
    const state = this.circusDoom;
    if (!state || !state.portals[zoneId]) return;
    this.storeCircusZonePosition();
    this.saveCircusPersistentWorldState();
    state.currentZoneId = zoneId;
    state.selectedExitIndex = 0;
    state.hotspots = [];
    state.pendingEntryFromZoneId = Number.isFinite(entryFromZoneId) ? entryFromZoneId : null;
    this.prepareCircusSimulationRoom();
    state.pendingEntryFromZoneId = null;
    if (!Number.isFinite(entryFromZoneId)) this.restoreCircusZonePosition(zoneId);
    state.threatPositions.clear();
    state.threatAlert = '';
    this.markCainOSZoneVisited(zoneId);
    this.advanceCircusCampaign('visit', String(zoneId));
    this.triggerCircusZoneDynamicEvent(zoneId);
    if (playSound) SoundManager.play(660, 0.08, 'triangle', 0.05);
    if (typeof SoundManager.startContextPulse === 'function') {
      const motif = state.scenes[zoneId]?.motif || 'circus';
      SoundManager.startContextPulse(motif);
    }
  },

  getCircusZoneGameplayConfig(zoneId) {
    const configs = {
      5: { title: 'LABYRINTHE DE SORTIE', steps: [{ action: 'use', kind: 'exitframe', count: 3, label: 'Tester trois cadres sans les prendre pour une sortie' }] },
      6: { title: 'CONVOI CANDY', steps: [{ action: 'look', kind: 'candy', count: 2, label: 'Lire les obstacles' }, { action: 'use', kind: 'truck', count: 1, label: 'Demarrer le tanker' }, { action: 'drive', kind: 'truck', count: 3, label: 'Maintenir le convoi en mouvement' }] },
      8: { title: 'SURVIE MILDENHALL', steps: [{ action: 'use', kind: 'candle', count: 1, label: 'Stabiliser une bougie' }, { action: 'survive', kind: 'candle', count: 4, label: 'Tenir dans le manoir sans etre touche' }] },
      10: { title: 'SERVICE SPUDSY', steps: [{ action: 'take', kind: 'menu', count: 1, label: 'Prendre un ticket' }, { action: 'use', kind: 'counter', count: 1, label: 'Preparer le comptoir' }, { action: 'give', kind: 'menu', count: 1, label: 'Remettre la commande a un personnage' }] },
      11: { title: 'TRI DES IDEES', steps: [{ action: 'take', kind: 'card', count: 1, label: 'Choisir une suggestion' }, { action: 'use', kind: 'doorframe', count: 1, label: 'Affecter la suggestion a une porte' }] },
      12: { title: 'MATCH DE SOFTBALL', steps: [{ action: 'use', kind: 'scoreboard', count: 1, label: 'Allumer le score' }, { action: 'use', kind: 'base', count: 3, label: 'Valider les trois bases' }] },
      13: { title: 'EPREUVES ARMEES', steps: [{ action: 'use', kind: 'target', count: 3, label: 'Neutraliser les cibles annoncees' }] },
      14: { title: 'EXPLORATION DU LAC', steps: [{ action: 'use', kind: 'wave', count: 1, label: 'Entrer dans l eau digitale' }, { action: 'dive', kind: 'wave', count: 3, label: 'Explorer avant la fin de l oxygene' }] },
      15: { title: 'COUCHE ADMIN', steps: [{ action: 'use', kind: 'console', count: 1, label: 'Ouvrir la console' }, { action: 'use', kind: 'gridnode', count: 1, label: 'Relier le noeud admin' }] },
      16: { title: 'AUDIT DU COEUR', steps: [{ action: 'look', kind: 'desk', count: 1, label: 'Relever le bureau de Caine' }, { action: 'use', kind: 'console', count: 1, label: 'Interroger le coeur C&A' }] },
      33: { title: 'ROUTE DU TANKER', steps: [{ action: 'use', kind: 'truck', count: 1, label: 'Relancer le camion' }, { action: 'drive', kind: 'truck', count: 4, label: 'Traverser la route du canyon' }] },
      34: { title: 'AMES DU MANOIR', steps: [{ action: 'use', kind: 'candle', count: 1, label: 'Fixer une source lumineuse' }, { action: 'survive', kind: 'candle', count: 4, label: 'Resister a la possession' }] },
      35: { title: 'CUISINE SPUDSY', steps: [{ action: 'take', kind: 'menu', count: 1, label: 'Prendre un ticket cuisine' }, { action: 'use', kind: 'counter', count: 1, label: 'Assembler la commande' }, { action: 'give', kind: 'menu', count: 1, label: 'Servir la commande' }] },
      40: { title: 'PLONGEE AU TRESOR', steps: [{ action: 'use', kind: 'wave', count: 1, label: 'Descendre sous le lac' }, { action: 'dive', kind: 'wave', count: 3, label: 'Atteindre le coffre' }, { action: 'use', kind: 'archive', count: 1, label: 'Verifier le coffre vide' }] },
      64: { title: 'ETAGE MILDENHALL', steps: [{ action: 'look', kind: 'window', count: 2, label: 'Comparer les deux fenetres' }, { action: 'use', kind: 'candle', count: 1, label: 'Fixer un repere lumineux' }] },
      65: { title: 'SURVIE AU GRENIER', steps: [{ action: 'use', kind: 'candle', count: 1, label: 'Allumer la bougie du grenier' }, { action: 'survive', kind: 'candle', count: 3, label: 'Rester discret face au signal' }] },
      66: { title: 'GALERIE ROYALE', steps: [{ action: 'look', kind: 'pillar', count: 2, label: 'Verifier les piliers' }, { action: 'use', kind: 'stairs', count: 1, label: 'Ouvrir le passage du balcon' }] },
      67: { title: 'BALCON DU ROYAUME', steps: [{ action: 'look', kind: 'ring', count: 1, label: 'Relever la balustrade' }, { action: 'use', kind: 'spotlight', count: 1, label: 'Allumer le repere royal' }] },
      68: { title: 'ASCENSION DU PHARE', steps: [{ action: 'look', kind: 'window', count: 2, label: 'Verifier les ouvertures' }, { action: 'use', kind: 'stairs', count: 1, label: 'Monter vers la lanterne' }] },
      69: { title: 'LANTERNE DU LAC', steps: [{ action: 'use', kind: 'spotlight', count: 1, label: 'Allumer la lanterne' }, { action: 'use', kind: 'console', count: 1, label: 'Calibrer le faisceau' }] }
    };
    if (zoneId >= 44 && zoneId <= 49) {
      const room = this.getCircusBedroomDefinitions()[zoneId];
      if (this.isCircusBedroomArchived(room)) {
        return { title: 'TRACE ABANDONNEE', steps: [{ action: 'look', kind: 'bed', count: 1, label: 'Observer sans deplacer' }, { action: 'use', kind: 'archive', count: 1, label: 'Consulter le dossier de porte' }] };
      }
      return { title: 'OBJET PERSONNEL', steps: [{ action: 'take', kind: 'card', count: 1, label: 'Prendre un objet avec permission' }, { action: 'give', kind: 'card', count: 1, label: 'Le rendre a son proprietaire' }] };
    }
    if (zoneId >= 52 && zoneId <= 63) {
      return { title: 'TRACE ABANDONNEE', steps: [{ action: 'look', kind: 'bed', count: 1, label: 'Observer sans deplacer' }, { action: 'use', kind: 'archive', count: 1, label: 'Consulter le dossier de porte' }] };
    }
    return configs[zoneId] || null;
  },

  getCircusActivityTypeForProp(prop, action) {
    const zoneId = this.circusDoom?.currentZoneId;
    if (prop.kind === 'truck' && action === 'use' && [6, 33].includes(zoneId)) return 'tanker';
    if (['menu', 'counter'].includes(prop.kind) && ['take', 'use'].includes(action) && [10, 35].includes(zoneId)) return 'spudsy';
    if (prop.kind === 'scoreboard' && action === 'use' && zoneId === 12) return 'softball';
    if (prop.kind === 'candle' && action === 'use' && [8, 34, 65].includes(zoneId)) return 'mildenhall';
    if (prop.kind === 'wave' && action === 'use' && [14, 40].includes(zoneId)) return 'dive';
    return null;
  },

  startCircusActivityForProp(prop, action) {
    const state = this.circusDoom;
    const type = this.getCircusActivityTypeForProp(prop, action);
    if (!state || !type || (state.currentActivity && !state.currentActivity.complete && state.currentActivity.type === type)) return;
    const base = { type, zoneId: state.currentZoneId, startedAt: performance.now(), complete: false, persistent: true, score: 0 };
    if (type === 'tanker') Object.assign(base, { title: 'CONVOI TANKER', distance: 0, integrity: 100, lane: 1, hazard: 0.5, hazardTimer: 0 });
    if (type === 'spudsy') Object.assign(base, { title: 'SERVICE SPUDSY', order: 0, phase: 0, timeLeft: 42, mistakes: 0 });
    if (type === 'softball') Object.assign(base, { title: 'SOFTBALL', marker: 0, markerDirection: 1, hits: 0, strikes: 0 });
    if (type === 'mildenhall') Object.assign(base, { title: 'SURVIE MILDENHALL', timeLeft: 22, exposure: 0 });
    if (type === 'dive') Object.assign(base, { title: 'PLONGEE DIGITALE', oxygen: 100, depth: 0 });
    state.currentActivity = base;
    state.interactionMessage = `${base.title}: module visuel actif.`;
    state.interactionUntil = performance.now() + 3000;
    state.interactionChannel = 'system';
    SoundManager.play(440, 0.12, 'triangle', 0.045);
  },

  advanceCircusActivity(action, target) {
    const activity = this.circusDoom?.currentActivity;
    if (!activity || activity.complete) return false;
    if (activity.type === 'spudsy') {
      const expected = [['take', 'menu'], ['use', 'counter'], ['give', 'menu']][activity.phase];
      if (expected && expected[0] === action && expected[1] === target) {
        activity.phase++;
        activity.score++;
        if (activity.phase >= 3) {
          activity.order++;
          activity.phase = 0;
          if (activity.order >= 3) this.completeCircusActivity('Trois commandes servies sans casser le flux.');
          else {
            const nextMenu = this.getCircusZoneProps(this.circusDoom.currentZoneId)
              .map((prop, index) => ({ ...prop, interactionId: index }))
              .find(prop => prop.kind === 'menu');
            const nextMenuId = nextMenu ? this.getCircusPropPersistentId(nextMenu) : null;
            if (nextMenuId) {
              this.circusDoom.collectedProps.delete(nextMenuId);
              this.circusDoom.givenProps.delete(nextMenuId);
              this.circusDoom.worldColliderZoneId = null;
            }
          }
        }
        return true;
      }
      if (['take', 'use', 'give'].includes(action)) activity.mistakes++;
    }
    return false;
  },

  handleCircusActivityAction() {
    const activity = this.circusDoom?.currentActivity;
    if (!activity || activity.complete || activity.type !== 'softball') return false;
    const success = activity.marker >= 0.42 && activity.marker <= 0.58;
    if (success) {
      activity.hits++;
      activity.score += 100;
      SoundManager.playWin();
      if (activity.hits >= 3) this.completeCircusActivity('Trois frappes valides enregistrees.');
    } else {
      activity.strikes++;
      SoundManager.playError();
      if (activity.strikes >= 3) {
        activity.strikes = 0;
        activity.hits = Math.max(0, activity.hits - 1);
      }
    }
    return true;
  },

  updateCircusActivity(dt, movedDistance) {
    const state = this.circusDoom;
    const activity = state?.currentActivity;
    if (!activity || activity.complete) return;
    if (activity.type === 'tanker') {
      if (state.keys.has('a') || state.keys.has('q')) activity.lane = Math.max(0, activity.lane - dt * 2.2);
      if (state.keys.has('d')) activity.lane = Math.min(2, activity.lane + dt * 2.2);
      activity.distance += movedDistance * 4;
      activity.hazardTimer += dt;
      if (activity.hazardTimer >= 1.3) {
        activity.hazardTimer = 0;
        activity.hazard = (Math.floor(activity.distance / 7) % 3) + 0.5;
        if (Math.abs(activity.lane - activity.hazard) < 0.42) {
          activity.integrity = Math.max(0, activity.integrity - 18);
          SoundManager.playError();
        }
      }
      if (activity.distance >= 48) this.completeCircusActivity('Le tanker atteint la fin de la route jouable.');
      if (activity.integrity <= 0) {
        activity.integrity = 55;
        activity.distance = Math.max(0, activity.distance - 10);
      }
    } else if (activity.type === 'spudsy') {
      activity.timeLeft = Math.max(0, activity.timeLeft - dt);
      if (activity.timeLeft <= 0) {
        activity.timeLeft = 42;
        activity.mistakes++;
        activity.phase = 0;
      }
    } else if (activity.type === 'softball') {
      activity.marker += activity.markerDirection * dt * 0.9;
      if (activity.marker >= 1 || activity.marker <= 0) {
        activity.marker = Math.max(0, Math.min(1, activity.marker));
        activity.markerDirection *= -1;
      }
    } else if (activity.type === 'mildenhall') {
      const safe = state.noiseLevel < 0.38 || performance.now() < (state.lightUntil || 0);
      activity.timeLeft = Math.max(0, activity.timeLeft - (safe ? dt : dt * 0.3));
      activity.exposure = Math.max(0, Math.min(100, activity.exposure + (safe ? -22 : 34) * dt));
      if (activity.exposure >= 100) {
        activity.exposure = 55;
        state.stability = Math.max(20, state.stability - 15);
      }
      if (activity.timeLeft <= 0) this.completeCircusActivity('Le signal horrifique a ete traverse sans rupture.');
    } else if (activity.type === 'dive') {
      activity.oxygen = Math.max(0, activity.oxygen - dt * 5.4);
      activity.depth += movedDistance * 1.8;
      if (activity.depth >= 18) this.completeCircusActivity('Profondeur cible atteinte avant la fin de l oxygene.');
      if (activity.oxygen <= 0) {
        activity.oxygen = 70;
        activity.depth = Math.max(0, activity.depth - 5);
        state.stability = Math.max(20, state.stability - 10);
      }
    }
  },

  completeCircusActivity(message) {
    const state = this.circusDoom;
    const activity = state?.currentActivity;
    if (!activity || activity.complete) return;
    activity.complete = true;
    activity.completedAt = Date.now();
    state.interactionMessage = `${activity.title} TERMINE: ${message}`;
    state.interactionUntil = performance.now() + 5200;
    this.unlockCainOSAchievement(`fps_activity_${activity.type}`, `Activite FPS: ${activity.title}`);
    this.saveCircusPersistentWorldState();
    SoundManager.playWin();
  },

  drawCircusActivityHud(ctx, w, h, state) {
    const activity = state?.currentActivity;
    if (!activity || activity.complete || !state.hudVisible) return;
    const y = w < 480 ? h - 142 : h - 58;
    ctx.save();
    ctx.fillStyle = 'rgba(5,2,13,0.88)';
    ctx.strokeStyle = '#7df0ff';
    ctx.fillRect(w / 2 - 128, y, 256, 42);
    ctx.strokeRect(w / 2 - 128, y, 256, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(activity.title, w / 2, y + 14);
    if (activity.type === 'tanker') {
      ctx.fillText(`ROUTE ${Math.round(activity.distance)}/48 | INTEGRITE ${Math.round(activity.integrity)}% | VOIE ${Math.round(activity.lane) + 1}`, w / 2, y + 30);
    } else if (activity.type === 'spudsy') {
      const phase = ['PRENDRE TICKET', 'UTILISER COMPTOIR', 'DONNER COMMANDE'][activity.phase];
      ctx.fillText(`COMMANDE ${activity.order + 1}/3 | ${phase} | ${Math.ceil(activity.timeLeft)}s`, w / 2, y + 30);
    } else if (activity.type === 'softball') {
      ctx.fillStyle = '#294d2b';
      ctx.fillRect(w / 2 - 78, y + 21, 156, 8);
      ctx.fillStyle = '#9cff6d';
      ctx.fillRect(w / 2 - 12, y + 21, 24, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w / 2 - 78 + activity.marker * 156 - 2, y + 18, 4, 14);
      ctx.fillText(`FRAPPES ${activity.hits}/3 | E DANS LE VERT`, w / 2, y + 39);
    } else if (activity.type === 'mildenhall') {
      ctx.fillText(`TENIR ${Math.ceil(activity.timeLeft)}s | EXPOSITION ${Math.round(activity.exposure)}% | BRUIT ${Math.round(state.noiseLevel * 100)}%`, w / 2, y + 30);
    } else if (activity.type === 'dive') {
      ctx.fillText(`OXYGENE ${Math.round(activity.oxygen)}% | PROFONDEUR ${Math.round(activity.depth)}/18`, w / 2, y + 30);
    }
    ctx.restore();
  },

  getCircusZoneChallengeStatus(zoneId) {
    const state = this.circusDoom;
    const config = this.getCircusZoneGameplayConfig(zoneId);
    if (!state || !config) return null;
    const progress = state.zoneChallenges[zoneId] || { step: 0, count: 0 };
    const complete = progress.step >= config.steps.length;
    return { config, progress, complete, current: complete ? null : config.steps[progress.step] };
  },

  advanceCircusZoneChallenge(action, kind) {
    const state = this.circusDoom;
    const status = this.getCircusZoneChallengeStatus(state?.currentZoneId);
    if (!state || !status || status.complete) return false;
    const expected = status.current;
    if (expected.action !== action || expected.kind !== kind) return false;
    const progress = state.zoneChallenges[state.currentZoneId] || { step: 0, count: 0, accumulator: 0 };
    progress.count++;
    if (progress.count >= expected.count) {
      progress.step++;
      progress.count = 0;
      progress.accumulator = 0;
    }
    state.zoneChallenges[state.currentZoneId] = progress;
    if (action === 'use' && kind === 'truck') state.vehicleModeUntil = performance.now() + 15000;
    if (action === 'use' && kind === 'wave') state.diveModeUntil = performance.now() + 12000;
    if (action === 'use' && kind === 'candle') state.lightUntil = performance.now() + 16000;
    const nextStatus = this.getCircusZoneChallengeStatus(state.currentZoneId);
    if (nextStatus?.complete) {
      this.unlockCainOSAchievement(`fps_gameplay_${state.currentZoneId}`, `Action locale: ${status.config.title}`);
      state.interactionMessage = `${state.interactionMessage || ''} [ACTION LOCALE TERMINEE]`.trim();
      SoundManager.playWin();
    }
    this.saveCircusPersistentWorldState();
    return true;
  },

  updateCircusZoneGameplay(dt, movedDistance) {
    const state = this.circusDoom;
    const status = this.getCircusZoneChallengeStatus(state?.currentZoneId);
    if (!state || !status || status.complete || !status.current) return;
    const progress = state.zoneChallenges[state.currentZoneId] || { step: 0, count: 0, accumulator: 0 };
    if (status.current.action === 'drive' && performance.now() < state.vehicleModeUntil) {
      progress.accumulator = (progress.accumulator || 0) + movedDistance;
      if (progress.accumulator >= 1.25) {
        progress.accumulator = 0;
        state.zoneChallenges[state.currentZoneId] = progress;
        this.advanceCircusZoneChallenge('drive', 'truck');
      }
    } else if (status.current.action === 'dive' && performance.now() < state.diveModeUntil) {
      progress.accumulator = (progress.accumulator || 0) + movedDistance;
      if (progress.accumulator >= 1.05) {
        progress.accumulator = 0;
        state.zoneChallenges[state.currentZoneId] = progress;
        this.advanceCircusZoneChallenge('dive', 'wave');
      }
    } else if (status.current.action === 'survive' && performance.now() < (state.lightUntil || 0)) {
      progress.accumulator = (progress.accumulator || 0) + dt;
      if (progress.accumulator >= 2.2) {
        progress.accumulator = 0;
        state.zoneChallenges[state.currentZoneId] = progress;
        this.advanceCircusZoneChallenge('survive', 'candle');
        if (state.currentZoneId === 4) this.advanceCircusCampaign('survive', 'kaufmo');
      }
    }
  },

  updateCircusThreatGameplay(dt) {
    const state = this.circusDoom;
    if (!state || state.cinematic) return;
    const threats = [...this.getCircusZoneSprites(state.currentZoneId), ...this.getCircusCustomAdventureSprites(state.currentZoneId, state)].filter(sprite => {
      const avatar = sprite.avatar || sprite.type || '';
      return sprite.threatActive !== false && ['abstractedkaufmo', 'cellarabstraction', 'aquaticabstraction'].includes(avatar);
    });
    state.threatAlert = '';
    threats.forEach(sprite => {
      const avatar = sprite.avatar || sprite.type;
      const key = `${state.currentZoneId}:${avatar}`;
      let position = state.threatPositions.get(key);
      if (!position) {
        position = this.resolveCircusWorldPoint(sprite, state);
        position = { x: position.x, z: position.z };
      }
      const dx = state.player.x - position.x;
      const dz = state.player.z - position.z;
      const distance = Math.max(0.001, Math.hypot(dx, dz));
      const protectedByLight = performance.now() < (state.lightUntil || 0);
      const detectionRadius = 2.0 + (state.noiseLevel || 0) * 3.2 + (state.visibilityLevel || 0) * 1.4;
      const alerted = (state.noiseLevel || 0) > 0.25 || distance < detectionRadius || state.currentZoneId === 4;
      if (alerted && distance > 0.82) {
        const repelled = protectedByLight && distance < 2.5;
        const speed = repelled ? 0.3 : ((state.noiseLevel || 0) > 0.7 ? 0.66 : 0.36);
        const direction = repelled ? -1 : 1;
        const nx = position.x + (dx / distance) * speed * dt * direction;
        const nz = position.z + (dz / distance) * speed * dt * direction;
        const ix = Math.floor(nx);
        const iz = Math.floor(nz);
        if (state.room?.grid?.[iz]?.[ix] === 0) position = { x: nx, z: nz };
      }
      state.threatPositions.set(key, position);
      if (distance < 4.8) state.threatAlert = protectedByLight
        ? 'MENACE REPOUSSEE, MAIS LA LUMIERE VOUS SIGNALE'
        : `MENACE A ${distance.toFixed(1)}m - BRUIT ${Math.round((state.noiseLevel || 0) * 100)}%`;
      if (distance < 0.88 && performance.now() > state.threatCooldownUntil) {
        state.threatCooldownUntil = performance.now() + 2200;
        state.stability = Math.max(0, state.stability - 20);
        state.interactionMessage = `IMPACT ${sprite.name.toUpperCase()}: stabilite reduite. Repliez-vous vers une porte ou une source lumineuse.`;
        state.interactionUntil = performance.now() + 3600;
        state.interactionChannel = 'system';
        state.interactionSpeaker = 'ALERTE';
        state.player.x -= (dx / distance) * 0.7;
        state.player.z -= (dz / distance) * 0.7;
        if (state.stability <= 0) {
          state.stability = 60;
          this.prepareCircusSimulationRoom();
          state.interactionMessage = 'SIGNAL RECONSTRUIT AU POINT D ENTREE. La progression locale est conservee.';
          state.interactionUntil = performance.now() + 4200;
        }
        this.saveCircusPersistentWorldState();
        SoundManager.playError();
      }
    });
  },

  emitCircusNoise(amount, source = '') {
    const state = this.circusDoom;
    if (!state) return;
    state.noiseLevel = Math.max(state.noiseLevel || 0, Math.max(0, Math.min(1, amount)));
    state.lastNoiseAt = performance.now();
    state.noiseSource = source;
  },

  getCircusSpatialAudioMix(obj) {
    const state = this.circusDoom;
    if (!state || !obj) return { pan: 0, distance: 1, volume: 1 };
    const point = this.resolveCircusWorldPoint(obj, state);
    const dx = point.x - state.player.x;
    const dz = point.z - state.player.z;
    const distance = Math.max(0.2, Math.hypot(dx, dz));
    const relative = Math.atan2(dz, dx) - state.player.a;
    const pan = Math.max(-1, Math.min(1, Math.sin(relative)));
    return { pan, distance, volume: Math.max(0.12, Math.min(1, 1 / (distance * 0.48))) };
  },

  playCircusSpatialObjectSound(obj, kind = 'event') {
    if (typeof SoundManager === 'undefined') return;
    const mix = this.getCircusSpatialAudioMix(obj);
    if (kind === 'door' && typeof SoundManager.playFpsDoor === 'function') {
      SoundManager.playFpsDoor(this.circusDoom?.scenes?.[this.circusDoom.currentZoneId]?.motif || 'circus', mix.pan, mix.volume);
    } else if (typeof SoundManager.playFpsEvent === 'function') {
      SoundManager.playFpsEvent(kind, mix.pan, mix.volume);
    }
  },

  drawCircusThreatHud(ctx, w, h, state) {
    if (!state?.threatAlert) return;
    const y = w < 480 ? 106 : 50;
    ctx.save();
    ctx.fillStyle = 'rgba(45,0,0,0.82)';
    ctx.strokeStyle = '#ff4d4d';
    ctx.fillRect(w / 2 - 150, y, 300, 22);
    ctx.strokeRect(w / 2 - 150, y, 300, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(state.threatAlert, w / 2, y + 14);
    ctx.restore();
  },

  drawCircusStealthHud(ctx, w, h, state) {
    if (!state?.hudVisible) return;
    const threatZone = [4, 8, 9, 34, 64, 65].includes(state.currentZoneId);
    if (!threatZone && (state.noiseLevel || 0) < 0.08) return;
    const x = w - 146;
    const y = w < 480 ? h - 112 : h - 44;
    const drawMeter = (label, value, color, offset) => {
      ctx.fillStyle = 'rgba(5,5,12,0.78)';
      ctx.fillRect(x, y + offset, 132, 14);
      ctx.strokeStyle = '#8b8794';
      ctx.strokeRect(x, y + offset, 132, 14);
      ctx.fillStyle = color;
      ctx.fillRect(x + 42, y + offset + 4, 84 * Math.max(0, Math.min(1, value)), 6);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText(label, x + 4, y + offset + 10);
    };
    ctx.save();
    drawMeter('BRUIT', state.noiseLevel || 0, '#ff6b4a', 0);
    drawMeter('VISIBLE', state.visibilityLevel || 0, '#7df0ff', 17);
    ctx.restore();
  },

  updateCircusDoom(dt) {
    const state = this.circusDoom;
    if (!state) return;
    state.averageFrameTime = state.averageFrameTime ? state.averageFrameTime * 0.94 + dt * 0.06 : dt;
    state.dynamicRayCount = state.averageFrameTime > 0.027 ? 160 : state.averageFrameTime > 0.021 ? 200 : 240;
    const { player, keys } = state;
    if (state.portalTransition) {
      this.updateCircusPortalTransition();
      this.updateCircusFpsToolbar();
      return;
    }
    if (state.doorTransition) {
      this.updateCircusDoorTransition();
      this.updateCircusFpsToolbar();
      return;
    }
    const timeline = this.getCircusTimelineContext();
    if (state.routinePhase && state.routinePhase !== timeline.phase && !state.interactionChoices) {
      state.interactionMessage = `ROUTINE DU CIRQUE: ${timeline.phase.toUpperCase()} / EPISODE ${timeline.episode}. Les personnages changent de zone.`;
      state.interactionUntil = performance.now() + 3200;
      state.interactionChannel = 'system';
      state.interactionSpeaker = 'CAINOS';
    }
    state.routinePhase = timeline.phase;
    this.updateCircusDynamicEvents();
    this.updateCircusEventDirector(dt);
    this.updateCircusSocialAI();
    if (state.cinematic) {
      this.updateCircusCinematicCamera(dt);
      this.updateCircusFpsToolbar();
      if (state.detailEl) state.detailEl.innerText = 'CINEMATIQUE D ARRIVEE: ENTREE ou CLIC pour continuer.';
      return;
    }
    const gamepads = navigator.getGamepads?.();
    const gamepad = gamepads ? Array.from(gamepads).find(pad => pad?.connected) || null : null;
    const axis = index => Math.abs(gamepad?.axes?.[index] || 0) > 0.16 ? gamepad.axes[index] : 0;
    const padAction = !!gamepad?.buttons?.[0]?.pressed;
    if (padAction && !state.gamepadActionDown) this.handleCircusSimulationInput('enter');
    state.gamepadActionDown = padAction;
    const previousX = player.x;
    const previousZ = player.z;
    const turn = 2.35 * dt;
    const crouching = this.isCircusControlDown('crouch');
    const sprinting = !crouching && (this.isCircusControlDown('sprint') || !!gamepad?.buttons?.[10]?.pressed);
    const vehicleBoost = performance.now() < (state.vehicleModeUntil || 0) ? 1.65 : 1;
    const speed = (crouching ? 1.25 : sprinting ? 3.35 : 2.15) * vehicleBoost * dt;
    if (keys.has('arrowleft')) player.a -= turn;
    if (keys.has('arrowright')) player.a += turn;
    player.a += axis(2) * turn * 1.35;

    const tryMove = (nx, nz) => {
      const margin = 0.22;
      const canStand = (x, z) => (
        this.canMoveInCircusRoom(x - margin, z - margin) &&
        this.canMoveInCircusRoom(x + margin, z - margin) &&
        this.canMoveInCircusRoom(x - margin, z + margin) &&
        this.canMoveInCircusRoom(x + margin, z + margin)
      );
      if (canStand(nx, player.z)) player.x = nx;
      if (canStand(player.x, nz)) player.z = nz;
    };

    let move = -axis(1) * speed;
    if (keys.has('arrowup') || this.isCircusControlDown('forward')) move += speed;
    if (keys.has('arrowdown') || this.isCircusControlDown('backward')) move -= speed;
    if (move !== 0) {
      tryMove(player.x + Math.cos(player.a) * move, player.z + Math.sin(player.a) * move);
    }
    let strafe = axis(0) * speed;
    if (this.isCircusControlDown('left')) strafe -= speed;
    if (this.isCircusControlDown('right')) strafe += speed;
    if (strafe !== 0) {
      tryMove(player.x + Math.cos(player.a + Math.PI / 2) * strafe, player.z + Math.sin(player.a + Math.PI / 2) * strafe);
    }

    const movedDistance = Math.hypot(player.x - previousX, player.z - previousZ);
    const targetNoise = movedDistance > 0.001 ? (crouching ? 0.12 : sprinting ? 1 : 0.45) : 0;
    const noiseResponse = targetNoise > (state.noiseLevel || 0) ? Math.min(1, dt * 8) : Math.min(1, dt * 1.35);
    state.noiseLevel = (state.noiseLevel || 0) + (targetNoise - (state.noiseLevel || 0)) * noiseResponse;
    state.movementNoise = state.noiseLevel;
    const motif = state.scenes[state.currentZoneId]?.motif || 'circus';
    const darkZone = ['cellar', 'manor', 'basement', 'hell'].includes(motif);
    const lightActive = performance.now() < (state.lightUntil || 0);
    state.visibilityLevel = lightActive ? 0.96 : Math.max(0.08, (darkZone ? 0.2 : 0.56) - (crouching ? 0.1 : 0));
    this.updateCircusThreatGameplay(dt);
    this.updateCircusZoneGameplay(dt, movedDistance);
    this.updateCircusActivity(dt, movedDistance);
    this.updateCircusCampaignTimedProgress(dt);
    this.advanceCircusCustomAdventure('move', 'player', movedDistance);
    this.advanceCircusCustomAdventure('survive', 'timer', dt);
    let explored = state.exploredCells.get(state.currentZoneId);
    if (!explored) {
      explored = new Set();
      state.exploredCells.set(state.currentZoneId, explored);
    }
    const playerCellX = Math.floor(player.x);
    const playerCellZ = Math.floor(player.z);
    for (let dz = -2; dz <= 2; dz++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (dx * dx + dz * dz <= 6) explored.add(`${playerCellX + dx}:${playerCellZ + dz}`);
      }
    }
    if (movedDistance > 0.001 && performance.now() >= (state.nextFootstepAt || 0)) {
      state.footstepSide = (state.footstepSide || -1) * -1;
      if (typeof SoundManager.playFpsFootstep === 'function') {
        SoundManager.playFpsFootstep(motif, state.footstepSide * 0.16);
      }
      state.nextFootstepAt = performance.now() + (sprinting ? 255 : 360);
    }

    const nearestDoor = this.getNearestUsableCircusDoor();
    if (nearestDoor && Math.abs(nearestDoor.angle) < 0.85) {
      state.selectedExitIndex = nearestDoor.index;
    }

    const portal = state.portals[state.currentZoneId];
    if (state.zoneEl) {
      if (portal) {
        const found = [...state.discoveries].filter(id => id.startsWith(`${state.currentZoneId}:`)).length;
        const total = this.getCircusZoneProps(state.currentZoneId).length;
        const active = [...state.activeProps.entries()].filter(([id, enabled]) => enabled && id.startsWith(`${state.currentZoneId}:`)).length;
        const objective = this.getCircusZoneObjectiveStatus(state.currentZoneId, state);
        const mission = objective ? ` | MISSION ${objective.done}/${objective.total}` : '';
        const challenge = this.getCircusZoneChallengeStatus(state.currentZoneId);
        const action = challenge ? ` | ACTION ${challenge.complete ? 'OK' : `${challenge.progress.step + 1}/${challenge.config.steps.length}`}` : '';
        state.zoneEl.innerText = `${portal.short} | TRACES ${found}/${total} | ACTIFS ${active}${mission}${action}`;
      } else {
        state.zoneEl.innerText = 'ZONE: PASSERELLE INTERNE';
      }
    }
    if (state.interactionMessage && state.interactionOrigin) {
      const distanceFromContact = Math.hypot(
        state.player.x - state.interactionOrigin.x,
        state.player.z - state.interactionOrigin.z
      );
      if (distanceFromContact > state.interactionOrigin.range) {
        state.interactionChoices = null;
        state.interactionMessage = '';
        state.interactionUntil = 0;
        state.interactionOrigin = null;
      }
    }
    if (state.interactionChoices && performance.now() > state.interactionUntil) {
      state.interactionChoices = null;
      state.interactionMessage = '';
      state.interactionOrigin = null;
    }
    if (state.interactionMessage && performance.now() > state.interactionUntil) {
      state.interactionMessage = '';
      state.interactionOrigin = null;
    }
    if (!state.interactionMessage) {
      const nearbyCharacter = this.getNearestCircusCharacter();
      if (nearbyCharacter && nearbyCharacter.dist < 2.75 && Math.abs(nearbyCharacter.angle) < 0.9) {
        const noticeId = `${state.currentZoneId}:${nearbyCharacter.avatar || nearbyCharacter.type}:${nearbyCharacter.name}`;
        if (!state.noticedCharacters.has(noticeId)) {
          state.noticedCharacters.add(noticeId);
          state.interactionMessage = `${nearbyCharacter.name} remarque votre presence. Approchez-vous et appuyez sur ENTREE pour parler.`;
          state.interactionUntil = performance.now() + 2600;
          state.interactionOrigin = { x: player.x, z: player.z, range: 2.4 };
          state.interactionChannel = 'proximity';
          state.interactionSpeaker = nearbyCharacter.name;
        }
      }
    }
    if (state.detailEl) {
      if (state.interactionMessage && performance.now() < state.interactionUntil) {
        state.detailEl.innerText = state.interactionMessage;
      } else {
        const focus = this.getCircusFocusedHint();
        if (focus) {
          state.detailEl.innerText = focus;
        } else {
          const challenge = this.getCircusZoneChallengeStatus(state.currentZoneId);
          const event = this.getCircusZoneAmbientEvent(state.currentZoneId, state);
          state.detailEl.innerText = challenge && !challenge.complete
            ? `ACTION ${challenge.config.title}: ${challenge.current.label} (${challenge.progress.count}/${challenge.current.count})`
            : event?.detail || (portal
            ? (portal.unlocked ? portal.detail : `VERROUILLE: terminez l episode requis avant d afficher ${portal.short}.`)
            : 'Hub interne: traversez les couloirs pour inspecter les zones de simulation.');
        }
      }
    }
    this.updateCircusFpsToolbar();
  },

  drawCircusDoom() {
    const state = this.circusDoom;
    if (!state) return;
    this.syncCircusDoomCanvasSize(state);
    this.drawCircusSimulationScene();
  },

  syncCircusDoomCanvasSize(state = this.circusDoom) {
    const canvas = state?.canvas;
    if (!canvas || !canvas.isConnected) return false;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;

    const logicalWidth = Math.max(320, Math.min(960, Math.round(rect.width)));
    const scale = logicalWidth / rect.width;
    const logicalHeight = Math.max(220, Math.min(720, Math.round(rect.height * scale)));
    if (canvas.width === logicalWidth && canvas.height === logicalHeight) return false;

    canvas.width = logicalWidth;
    canvas.height = logicalHeight;
    state.ctx = canvas.getContext('2d');
    state.wallDepthBuffer = null;
    state.wallTopBuffer = null;
    state.wallBottomBuffer = null;
    return true;
  },

  drawCircusSimulationScene() {
    const state = this.circusDoom;
    if (!state) return;
    const { canvas, ctx, portals } = state;
    const w = canvas.width;
    const h = canvas.height;
    const zone = portals[state.currentZoneId] || portals[2];
    const conversationActive = !state.cinematic
      && !!state.interactionMessage
      && performance.now() <= state.interactionUntil;
    const journalActive = !state.cinematic && !conversationActive && !!state.journalVisible;
    const doomHud = document.getElementById('circus-doom-hud');
    doomHud?.classList.toggle('conversation-active', conversationActive);
    doomHud?.classList.toggle('journal-active', journalActive);
    document.body.dataset.fpsInteractionChannel = state.cinematic
      ? 'cinematic'
      : conversationActive ? (state.interactionChannel || 'system')
        : journalActive ? 'journal' : 'none';
    state.hotspots = [];

    this.drawCircusRaycastRoom(ctx, w, h, state, zone);
    this.drawCircusCustomAtmosphere(ctx, w, h, state);
    this.drawCircusWorldGeometryProps(ctx, w, h, state);
    this.drawCircusZoneEvents(ctx, w, h, state, zone);
    this.drawCircusDepthProps(ctx, w, h, state);
    this.drawCircusPhysicalDoors(ctx, w, h, portals, state);
    this.drawCircusImpostorSprites(ctx, w, h, state);
    if (!state.cinematic && !conversationActive && !journalActive) {
      this.drawCircusThreatHud(ctx, w, h, state);
      this.drawCircusStealthHud(ctx, w, h, state);
      this.drawCircusCampaignHud(ctx, w, h, state);
      this.drawCircusCustomAdventureHud(ctx, w, h, state);
      this.drawCircusActivityHud(ctx, w, h, state);
      if (state.hudVisible && !state.threatAlert) this.drawCircusZoneObjectiveHud(ctx, w, h, state);
      this.drawCircusSimulationReticle(ctx, w, h, zone);
      if (state.minimapVisible) this.drawCircusRoomMinimap(ctx, w, h, state, zone);
    }
    if (journalActive) this.drawCircusMissionJournal(ctx, w, h, state);
    if (conversationActive) this.drawCircusConversationOverlay(ctx, w, h, state);
    this.drawCircusCinematicOverlay(ctx, w, h, state);
    this.drawCircusPortalTransitionOverlay(ctx, w, h, state);
  },

  canMoveInCircusRoom(x, z) {
    const state = this.circusDoom;
    const room = state?.room;
    if (!room) return false;
    const ix = Math.floor(x);
    const iz = Math.floor(z);
    if (ix < 0 || iz < 0 || ix >= room.size || iz >= room.size) return false;
    if (room.grid[iz]?.[ix] !== 0) return false;

    return !this.getCircusWorldColliders(state).some(collider => {
      const dx = x - collider.x;
      const dz = z - collider.z;
      if (collider.radius) return Math.hypot(dx, dz) < collider.radius + 0.18;
      return Math.abs(dx) < collider.width / 2 + 0.18 && Math.abs(dz) < collider.depth / 2 + 0.18;
    });
  },

  getCircusWorldColliders(state) {
    if (state.worldColliderZoneId === state.currentZoneId && state.worldColliders) return state.worldColliders;
    const collidableKinds = new Set(['table', 'counter', 'desk', 'bed', 'pillar', 'crate', 'barrel', 'tent', 'building', 'tower', 'lighthouse']);
    state.worldColliders = this.getCircusZoneProps(state.currentZoneId)
      .map((prop, index) => ({ ...prop, interactionId: index }))
      .filter(prop => collidableKinds.has(prop.kind) && !state.collectedProps?.has(`${state.currentZoneId}:${prop.interactionId}`))
      .map(prop => {
        const center = this.resolveCircusWorldPoint(prop, state);
        const dimensions = this.getCircusWorldPropDimensions(prop, state);
        return { ...center, ...dimensions };
      });
    state.worldColliderZoneId = state.currentZoneId;
    return state.worldColliders;
  },

  resolveCircusWorldPoint(obj, state) {
    if (obj.space === 'world' || !state.room) return { x: obj.x, z: obj.z };
    const center = state.room.center;
    if (obj.wallSurface === 'outer' && obj.anchor === 'wall-left') {
      return { x: 1.04, z: center.z + obj.z };
    }
    if (obj.wallSurface === 'outer' && obj.anchor === 'wall-right') {
      return { x: state.room.size - 1.04, z: center.z + obj.z };
    }
    return { x: center.x + obj.x, z: center.z + obj.z };
  },

  getCircusArchitecture(state, motif = null) {
    const activeMotif = motif || (state.scenes[state.currentZoneId] || state.scenes[2])?.motif || 'circus';
    const architectures = {
      circus: { wallScale: 1.02, ceilingWorldHeight: 3.8, roof: 'tent', wallBias: 0.58 },
      final: { wallScale: 1.02, ceilingWorldHeight: 3.8, roof: 'tent', wallBias: 0.58 },
      grounds: { wallScale: 0.58, ceilingWorldHeight: 4.8, roof: 'open', wallBias: 0.55 },
      candy: { wallScale: 0.78, ceilingWorldHeight: 3.2, roof: 'open', wallBias: 0.56 },
      route: { wallScale: 0.58, ceilingWorldHeight: 4.8, roof: 'open', wallBias: 0.55 },
      palace: { wallScale: 1.12, ceilingWorldHeight: 4.3, roof: 'vault', wallBias: 0.6 },
      manor: { wallScale: 1.04, ceilingWorldHeight: 3.9, roof: 'beams', wallBias: 0.6 },
      basement: { wallScale: 0.64, ceilingWorldHeight: 2.2, roof: 'beams', wallBias: 0.54 },
      hell: { wallScale: 0.9, ceilingWorldHeight: 3.4, roof: 'cavern', wallBias: 0.58 },
      cellar: { wallScale: 0.68, ceilingWorldHeight: 2.35, roof: 'beams', wallBias: 0.55 },
      exit: { wallScale: 0.72, ceilingWorldHeight: 2.6, roof: 'tiles', wallBias: 0.55 },
      void: { wallScale: 0.5, ceilingWorldHeight: 5, roof: 'open', wallBias: 0.53 },
      test: { wallScale: 0.88, ceilingWorldHeight: 3.3, roof: 'grid', wallBias: 0.57 },
      admin: { wallScale: 0.82, ceilingWorldHeight: 3.0, roof: 'grid', wallBias: 0.56 },
      core: { wallScale: 1.0, ceilingWorldHeight: 3.7, roof: 'grid', wallBias: 0.59 },
      spudsy: { wallScale: 0.7, ceilingWorldHeight: 2.55, roof: 'tiles', wallBias: 0.55 },
      kitchen: { wallScale: 0.62, ceilingWorldHeight: 2.3, roof: 'tiles', wallBias: 0.54 },
      bathroom: { wallScale: 0.56, ceilingWorldHeight: 2.1, roof: 'tiles', wallBias: 0.53 },
      training: { wallScale: 0.6, ceilingWorldHeight: 2.2, roof: 'tiles', wallBias: 0.54 },
      dorm: { wallScale: 0.76, ceilingWorldHeight: 2.7, roof: 'hall', wallBias: 0.56 },
      dormannex: { wallScale: 0.76, ceilingWorldHeight: 2.7, roof: 'hall', wallBias: 0.56 },
      bedroom: { wallScale: 0.7, ceilingWorldHeight: 2.55, roof: 'flat', wallBias: 0.55 },
      archivebedroom: { wallScale: 0.64, ceilingWorldHeight: 2.35, roof: 'flat', wallBias: 0.54 },
      common: { wallScale: 0.84, ceilingWorldHeight: 3.1, roof: 'tent', wallBias: 0.57 },
      tubes: { wallScale: 0.9, ceilingWorldHeight: 3.35, roof: 'tent', wallBias: 0.58 },
      loser: { wallScale: 0.64, ceilingWorldHeight: 2.3, roof: 'flat', wallBias: 0.54 },
      nest: { wallScale: 0.86, ceilingWorldHeight: 3.2, roof: 'beams', wallBias: 0.57 },
      cafe: { wallScale: 0.76, ceilingWorldHeight: 2.75, roof: 'beams', wallBias: 0.56 },
      dining: { wallScale: 0.82, ceilingWorldHeight: 3.0, roof: 'tent', wallBias: 0.57 },
      awards: { wallScale: 1.02, ceilingWorldHeight: 3.8, roof: 'stage', wallBias: 0.59 },
      micro: { wallScale: 0.86, ceilingWorldHeight: 3.2, roof: 'grid', wallBias: 0.57 },
      guns: { wallScale: 0.72, ceilingWorldHeight: 2.65, roof: 'flat', wallBias: 0.55 },
      memory: { wallScale: 0.76, ceilingWorldHeight: 2.8, roof: 'grid', wallBias: 0.56 },
      archive: { wallScale: 0.86, ceilingWorldHeight: 3.2, roof: 'grid', wallBias: 0.57 },
      lake: { wallScale: 0.54, ceilingWorldHeight: 4.8, roof: 'open', wallBias: 0.54 },
      lighthouse: { wallScale: 0.9, ceilingWorldHeight: 3.5, roof: 'open', wallBias: 0.58 },
      underwater: { wallScale: 0.72, ceilingWorldHeight: 2.8, roof: 'water', wallBias: 0.56 },
      aquarium: { wallScale: 0.7, ceilingWorldHeight: 2.6, roof: 'water', wallBias: 0.55 },
      softball: { wallScale: 0.52, ceilingWorldHeight: 5, roof: 'open', wallBias: 0.54 },
      snow: { wallScale: 0.58, ceilingWorldHeight: 5, roof: 'open', wallBias: 0.54 },
      carnival: { wallScale: 0.58, ceilingWorldHeight: 5, roof: 'open', wallBias: 0.54 },
      poacher: { wallScale: 0.58, ceilingWorldHeight: 5, roof: 'open', wallBias: 0.54 },
      street: { wallScale: 0.66, ceilingWorldHeight: 5, roof: 'open', wallBias: 0.55 },
      school: { wallScale: 0.74, ceilingWorldHeight: 2.7, roof: 'tiles', wallBias: 0.56 },
      whitehouse: { wallScale: 0.9, ceilingWorldHeight: 3.4, roof: 'vault', wallBias: 0.58 }
    };
    return architectures[activeMotif] || { wallScale: 0.78, ceilingWorldHeight: 2.9, roof: 'flat', wallBias: 0.56 };
  },

  isCircusWorldPointVisible(obj, state, tolerance = 0.48) {
    if (!state?.room) return true;
    const point = this.resolveCircusWorldPoint(obj, state);
    const dx = point.x - state.player.x;
    const dz = point.z - state.player.z;
    const distance = Math.hypot(dx, dz);
    if (distance <= tolerance) return true;
    const stepX = dx / distance;
    const stepZ = dz / distance;
    for (let travelled = 0.18; travelled < distance - tolerance; travelled += 0.12) {
      const ix = Math.floor(state.player.x + stepX * travelled);
      const iz = Math.floor(state.player.z + stepZ * travelled);
      if ((state.room.grid[iz]?.[ix] ?? 1) > 0) return false;
    }
    return true;
  },

  getCircusWallColor(cell, zone, state) {
    if (cell >= 100) {
      const door = state.room?.doors?.find(item => item.code === cell);
      const target = door ? state.portals[door.target] : null;
      return target?.unlocked ? (target.color || zone.color) : '#4b4b55';
    }
    const motif = (state.scenes[state.currentZoneId] || state.scenes[2])?.motif;
    if (cell === 2) return {
      circus: '#d62f3f',
      final: '#e53935',
      grounds: '#2a58d8',
      candy: '#ff9b37',
      lake: '#4ee7ff',
      softball: '#83ff57',
      spudsy: '#f6d743',
      core: '#ff7a30',
      test: '#7df0ff',
      admin: '#ffcf75'
    }[motif] || zone.color || '#ffd84a';
    if (cell === 3) return '#4b4b55';
    return zone.color || '#ffd84a';
  },

  drawCircusRaycastRoom(ctx, w, h, state, zone) {
    if (!state.room) this.prepareCircusSimulationRoom();
    const room = state.room;
    const horizon = h * 0.48;
    const motif = (state.scenes[state.currentZoneId] || state.scenes[2])?.motif || 'circus';
    const architecture = this.getCircusArchitecture(state, motif);
    state.wallDepthBuffer = new Float32Array(w);
    state.wallDepthBuffer.fill(Number.POSITIVE_INFINITY);
    state.wallTopBuffer = new Float32Array(w);
    state.wallTopBuffer.fill(h);
    state.wallBottomBuffer = new Float32Array(w);
    state.wallBottomBuffer.fill(0);
    this.drawCircusThemedCeiling(ctx, w, h, horizon, state, zone, motif);
    this.drawCircusArchitecturalCeiling(ctx, w, h, horizon, state, motif, architecture);
    this.drawCircusThemedFloor(ctx, w, h, horizon, state, zone, motif);

    if (motif === 'circus' || motif === 'final') {
      ctx.fillStyle = motif === 'final' ? '#821922' : '#d62f3f';
      ctx.fillRect(0, horizon - 10, w, 20);
      ctx.fillStyle = '#fff1a8';
      for (let x = 0; x < w; x += 74) ctx.fillRect(x, horizon - 10, 36, 20);
    }

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 13; i++) {
      const t = i / 13;
      const y = horizon + Math.pow(t, 1.9) * (h - horizon);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let i = -9; i <= 9; i++) {
      const endX = w / 2 + i * 62;
      ctx.beginPath();
      ctx.moveTo(w / 2, horizon);
      ctx.lineTo(endX, h);
      ctx.stroke();
    }
    ctx.restore();

    const rays = state.dynamicRayCount || 240;
    const fov = state.fov || Math.PI / 3.05;
    const strip = Math.ceil(w / rays) + 1;
    for (let i = 0; i < rays; i++) {
      const ratio = i / (rays - 1);
      const angle = state.player.a - fov / 2 + ratio * fov;
      const rayCos = Math.cos(angle);
      const raySin = Math.sin(angle);
      let hit = null;
      for (let dist = 0.05; dist < room.size * 1.55; dist += 0.035) {
        const x = state.player.x + rayCos * dist;
        const z = state.player.z + raySin * dist;
        const ix = Math.floor(x);
        const iz = Math.floor(z);
        const cell = room.grid[iz]?.[ix] ?? 1;
        if (cell > 0) {
          const nearVertical = Math.abs((x % 1) - 0.5) > Math.abs((z % 1) - 0.5);
          hit = { dist, cell, nearVertical };
          break;
        }
      }
      if (!hit) continue;
      const corrected = Math.max(0.08, hit.dist * Math.cos(angle - state.player.a));
      const wallH = Math.min(h * 1.9, (h * architecture.wallScale) / corrected);
      const x = Math.floor(ratio * w);
      const y = Math.floor(horizon - wallH * architecture.wallBias);
      for (let px = Math.max(0, x); px < Math.min(w, x + strip); px++) {
        if (corrected < state.wallDepthBuffer[px]) {
          state.wallDepthBuffer[px] = corrected;
          state.wallTopBuffer[px] = y;
          state.wallBottomBuffer[px] = y + wallH;
        }
      }

      const depthShade = Math.max(0.26, 1.08 - corrected / (room.size * 0.92));
      const sideShade = hit.nearVertical ? 0.92 : 0.72;
      const shadeFactor = depthShade * sideShade;

      const hitX = state.player.x + rayCos * hit.dist;
      const hitZ = state.player.z + raySin * hit.dist;
      const wallU = hit.nearVertical ? (hitZ - Math.floor(hitZ)) : (hitX - Math.floor(hitX));
      if (hit.cell >= 100) {
        // Recessed portal: the raycast opening and the physical door share one depth plane.
        const baseColor = this.getCircusWallColor(hit.cell, zone, state);
        const frameColumn = wallU < 0.14 || wallU > 0.86;
        ctx.fillStyle = frameColumn
          ? this.shadeHex(baseColor, Math.min(1, shadeFactor * 1.08))
          : this.shadeHex('#090611', Math.max(0.55, shadeFactor));
        ctx.fillRect(x, y, strip, Math.ceil(wallH));
        if (frameColumn) {
          ctx.fillStyle = 'rgba(255,241,168,0.24)';
          ctx.fillRect(x, y, strip, Math.max(1, wallH * 0.035));
        }
      } else {
        // Normal wall - procedural motifs based on series decors
        const motif = (state.scenes[state.currentZoneId] || state.scenes[2])?.motif || 'circus';
        const u = hit.nearVertical ? (hitX % 1) : (hitZ % 1);

        if (motif === 'circus' || motif === 'final') {
          // Iconic Red & White tent stripes
          const redColor = motif === 'final' ? '#a51d24' : '#d62f3f';
          const whiteColor = '#fff3c2'; // retro tent cream
          const useRed = Math.floor(u * 6) % 2 === 0;
          const color = useRed ? redColor : whiteColor;
          ctx.fillStyle = this.shadeHex(color, shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
        } else if (motif === 'candy') {
          // Candy Canyon Kingdom - pink syrup / candy stripes
          const pinkColor = '#ff9ad5';
          const whiteColor = '#ffffff';
          const usePink = Math.floor(u * 6) % 2 === 0;
          const color = usePink ? pinkColor : whiteColor;
          ctx.fillStyle = this.shadeHex(color, shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
        } else if (motif === 'manor' || motif === 'basement') {
          // Spooky Manor wood paneling & wallpaper
          const baseColor = motif === 'basement' ? '#14101e' : '#241c30';
          ctx.fillStyle = this.shadeHex(baseColor, shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));

          // Vertical wood stripes
          const stripeColor = '#0b0610';
          if (Math.floor(u * 8) % 3 === 0) {
            ctx.fillStyle = this.shadeHex(stripeColor, shadeFactor);
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
          // Trim crown & baseboards
          ctx.fillStyle = this.shadeHex('#0a050f', shadeFactor);
          ctx.fillRect(x, y, strip, Math.max(1, wallH * 0.08));
          ctx.fillRect(x, y + wallH * 0.88, strip, Math.max(1, wallH * 0.12));
        } else if (motif === 'spudsy') {
          // Fast-food tiles (Yellow walls with red stripes)
          ctx.fillStyle = this.shadeHex('#f6d743', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#ff4d4d', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.42, strip, Math.max(1, wallH * 0.1));

          // Tile grout
          if (Math.abs((u * 4) % 1) < 0.05) {
            ctx.fillStyle = this.shadeHex('#d1b315', shadeFactor);
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
        } else if (motif === 'exit') {
          // White office walls with dark baseboards
          ctx.fillStyle = this.shadeHex('#f3f3f8', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#3a3a45', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.88, strip, Math.max(1, wallH * 0.12));
          if (u < 0.02 || u > 0.98) {
            ctx.fillStyle = this.shadeHex('#a4a4b2', shadeFactor);
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
        } else if (motif === 'test' || motif === 'admin' || motif === 'core') {
          // Matrix-like neon grid
          ctx.fillStyle = this.shadeHex('#010401', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          const neonColor = motif === 'core' ? '#ff7a30' : '#7df0ff';
          if (u < 0.04 || u > 0.96) {
            ctx.fillStyle = neonColor;
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
          ctx.fillStyle = neonColor;
          ctx.fillRect(x, y + wallH * 0.02, strip, Math.max(1, wallH * 0.02));
          ctx.fillRect(x, y + wallH * 0.49, strip, Math.max(1, wallH * 0.02));
          ctx.fillRect(x, y + wallH * 0.96, strip, Math.max(1, wallH * 0.02));
        } else if (motif === 'lake') {
          // Beach top cyan & bottom sand
          ctx.fillStyle = this.shadeHex('#4ee7ff', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#ffe57d', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.75, strip, Math.max(1, wallH * 0.25));
        } else if (motif === 'softball' || motif === 'grounds') {
          // Alternating green / blue grounds panels
          const prim = motif === 'softball' ? '#173416' : '#2a58d8';
          const sec = motif === 'softball' ? '#0f220e' : '#1d3e9a';
          const color = Math.floor(u * 4) % 2 === 0 ? prim : sec;
          ctx.fillStyle = this.shadeHex(color, shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
        } else if (motif === 'cellar') {
          // Kaufmo cellar containment walls: dark blocks, warning cuts, hidden eyes.
          ctx.fillStyle = this.shadeHex('#101018', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          if (Math.floor(u * 10) % 4 === 0) {
            ctx.fillStyle = this.shadeHex('#2a2834', shadeFactor);
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
          ctx.fillStyle = this.shadeHex('#56505f', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.18, strip, Math.max(1, wallH * 0.025));
          ctx.fillRect(x, y + wallH * 0.74, strip, Math.max(1, wallH * 0.025));
        } else if (motif === 'micro') {
          // Suggestion-box micro-zones: shuffled idea cards and neon door fragments.
          const colors = ['#ff4fb8', '#7df0ff', '#ffd84a', '#c875ff'];
          const color = colors[Math.abs(Math.floor((u + corrected) * 9)) % colors.length];
          ctx.fillStyle = this.shadeHex('#190d24', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex(color, shadeFactor);
          ctx.fillRect(x, y + wallH * 0.16, strip, Math.max(1, wallH * 0.08));
          ctx.fillRect(x, y + wallH * 0.62, strip, Math.max(1, wallH * 0.06));
        } else if (motif === 'guns') {
          // Action arena: dark cover panels and yellow lane safety marks.
          ctx.fillStyle = this.shadeHex('#201310', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          if (Math.floor(u * 6) % 2 === 0) {
            ctx.fillStyle = this.shadeHex('#463228', shadeFactor);
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
          ctx.fillStyle = this.shadeHex('#f6d743', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.5, strip, Math.max(1, wallH * 0.045));
        } else if (motif === 'memory') {
          // Kinger memory buffer: black room with chess-like ivory fragments.
          ctx.fillStyle = this.shadeHex('#0e0e12', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          if (Math.floor(u * 8) % 2 === 0) {
            ctx.fillStyle = this.shadeHex('#d9d0a2', shadeFactor * 0.85);
            ctx.fillRect(x, y + wallH * 0.24, strip, Math.max(1, wallH * 0.13));
          }
          ctx.fillStyle = this.shadeHex('#7df0ff', shadeFactor * 0.72);
          ctx.fillRect(x, y + wallH * 0.72, strip, Math.max(1, wallH * 0.025));
        } else if (motif === 'archive') {
          // Circus members archive: purple cabinet stacks and locked profile slots.
          ctx.fillStyle = this.shadeHex('#13091d', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          const slot = Math.floor(u * 12) % 3 === 0;
          if (slot) {
            ctx.fillStyle = this.shadeHex('#c875ff', shadeFactor * 0.8);
            ctx.fillRect(x, y + wallH * 0.2, strip, Math.max(1, wallH * 0.18));
            ctx.fillRect(x, y + wallH * 0.55, strip, Math.max(1, wallH * 0.18));
          }
        } else if (motif === 'dorm' || motif === 'dormannex') {
          const wallCoord = hit.nearVertical ? hitZ : hitX;
          const stripe = motif === 'dormannex'
            ? (Math.floor(wallCoord * 0.72) % 2 === 0 ? '#8f4656' : '#5b2938')
            : (Math.floor(wallCoord * 0.72) % 2 === 0 ? '#e65b78' : '#f0b34a');
          ctx.fillStyle = this.shadeHex(stripe, shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex(motif === 'dormannex' ? '#2f1620' : '#6a2f2a', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.78, strip, Math.max(1, wallH * 0.22));
          ctx.fillStyle = this.shadeHex(motif === 'dormannex' ? '#a56b72' : '#ffd06a', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.76, strip, Math.max(1, wallH * 0.025));
        } else if (motif === 'bedroom' || motif === 'archivebedroom') {
          const archived = motif === 'archivebedroom';
          const wallBase = archived ? '#171219' : (zone.color || '#6a2f48');
          const panel = archived ? '#2c2530' : this.shadeHex(zone.color || '#6a2f48', 0.62);
          ctx.fillStyle = this.shadeHex(wallBase, shadeFactor * (archived ? 0.72 : 0.88));
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          if (Math.floor(u * 8) % 2 === 0) {
            ctx.fillStyle = this.shadeHex(panel, shadeFactor);
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
          ctx.fillStyle = this.shadeHex(archived ? '#695b68' : '#fff1a8', shadeFactor * 0.82);
          ctx.fillRect(x, y + wallH * 0.78, strip, Math.max(1, wallH * 0.035));
        } else if (motif === 'cafe') {
          ctx.fillStyle = this.shadeHex('#4a2d20', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#d49a62', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.62, strip, Math.max(1, wallH * 0.09));
        } else if (motif === 'aquarium') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 8) % 2 ? '#0a5068' : '#087b91', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = 'rgba(125,240,255,0.22)';
          ctx.fillRect(x, y + wallH * 0.22, strip, Math.max(1, wallH * 0.04));
        } else if (motif === 'snow') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 6) % 2 ? '#d8edf7' : '#86abc7', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
        } else if (motif === 'poacher') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 8) % 3 ? '#294c25' : '#18351d', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#c4a45f', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.76, strip, Math.max(1, wallH * 0.035));
        } else if (motif === 'school') {
          ctx.fillStyle = this.shadeHex('#f2e7ed', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#ff9fcd', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.38, strip, Math.max(1, wallH * 0.06));
        } else if (motif === 'whitehouse') {
          ctx.fillStyle = this.shadeHex('#edf0f7', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#44699a', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.82, strip, Math.max(1, wallH * 0.12));
        } else if (motif === 'void') {
          ctx.fillStyle = this.shadeHex('#ffffff', Math.max(0.88, shadeFactor));
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = 'rgba(190,195,225,0.24)';
          ctx.fillRect(x, y + wallH * 0.5, strip, Math.max(1, wallH * 0.012));
        } else if (['common', 'dining', 'tubes', 'carnival'].includes(motif)) {
          const colors = motif === 'carnival' ? ['#e53935', '#ffd84a', '#2a58d8', '#ff4fb8'] : ['#d62f3f', '#fff3c2', '#2a58d8'];
          const color = colors[Math.abs(Math.floor(u * colors.length * 2)) % colors.length];
          ctx.fillStyle = this.shadeHex(color, shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#ffd84a', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.78, strip, Math.max(1, wallH * 0.06));
        } else if (motif === 'loser') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 8) % 2 ? '#493060' : '#291b38', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#63d9ff', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.42, strip, Math.max(1, wallH * 0.04));
        } else if (motif === 'nest') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 10) % 3 ? '#5a3c28' : '#7a5a3d', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#e8d6a8', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.72, strip, Math.max(1, wallH * 0.035));
        } else if (motif === 'palace') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 8) % 2 ? '#ff9ad5' : '#fff1a8', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#7d3f8c', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.82, strip, Math.max(1, wallH * 0.1));
        } else if (motif === 'route') {
          ctx.fillStyle = this.shadeHex('#8f4930', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          if (Math.floor(u * 8) % 3 === 0) {
            ctx.fillStyle = this.shadeHex('#ff9b37', shadeFactor);
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
        } else if (motif === 'hell') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 10) % 3 ? '#240707' : '#5a0b0b', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#ff4d32', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.72, strip, Math.max(1, wallH * 0.025));
        } else if (['kitchen', 'bathroom', 'training'].includes(motif)) {
          const baseColor = motif === 'bathroom' ? '#dedbd0' : motif === 'training' ? '#1b1717' : '#d9d4c7';
          const accent = motif === 'bathroom' ? '#91d4bb' : motif === 'training' ? '#e53935' : '#f6d743';
          ctx.fillStyle = this.shadeHex(baseColor, shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex(accent, shadeFactor);
          ctx.fillRect(x, y + wallH * 0.42, strip, Math.max(1, wallH * 0.08));
          if (Math.abs((u * 5) % 1) < 0.05) {
            ctx.fillStyle = this.shadeHex('#6f6a62', shadeFactor);
            ctx.fillRect(x, y, strip, Math.ceil(wallH));
          }
        } else if (motif === 'awards') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 8) % 2 ? '#8b172b' : '#5a1b4c', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#ffd84a', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.16, strip, Math.max(1, wallH * 0.06));
          ctx.fillRect(x, y + wallH * 0.8, strip, Math.max(1, wallH * 0.06));
        } else if (motif === 'lighthouse') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 8) % 2 ? '#ff5b4d' : '#ffffff', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
        } else if (motif === 'underwater') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 8) % 2 ? '#0a5068' : '#087b91', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = 'rgba(125,240,255,0.22)';
          ctx.fillRect(x, y + wallH * 0.25, strip, Math.max(1, wallH * 0.04));
        } else if (motif === 'street') {
          ctx.fillStyle = this.shadeHex(Math.floor(u * 8) % 3 ? '#59616a' : '#8fa6ba', shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
          ctx.fillStyle = this.shadeHex('#20252a', shadeFactor);
          ctx.fillRect(x, y + wallH * 0.8, strip, Math.max(1, wallH * 0.14));
        } else {
          // Fallback wall
          const baseColor = this.getCircusWallColor(hit.cell, zone, state);
          ctx.fillStyle = this.shadeHex(baseColor, shadeFactor);
          ctx.fillRect(x, y, strip, Math.ceil(wallH));
        }
      }
    }

    const scene = state.scenes[state.currentZoneId] || state.scenes[2];
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = zone.color || '#ffd84a';
    if (['circus', 'grounds', 'final'].includes(scene.motif)) {
      ctx.beginPath();
      ctx.ellipse(w / 2, horizon + 12, w * 0.28, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (scene.motif === 'lake') {
      for (let y = horizon + 16; y < h; y += 20) ctx.fillRect(0, y + Math.sin(y / 17) * 2, w, 2);
    } else if (scene.motif === 'exit') {
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = '#ffffff';
      for (let i = 0; i < 5; i++) ctx.strokeRect(w / 2 - 130 + i * 22, 42 + i * 14, 260 - i * 44, 150 - i * 16);
    }
    ctx.restore();
  },

  drawCircusArchitecturalCeiling(ctx, w, h, horizon, state, motif, architecture) {
    if (!architecture || architecture.roof === 'open') return;
    ctx.save();
    const forwardPhase = ((state.player.x * Math.cos(state.player.a)) + (state.player.z * Math.sin(state.player.a))) % 1;
    const sidePhase = ((state.player.x * -Math.sin(state.player.a)) + (state.player.z * Math.cos(state.player.a))) % 1;
    const roofColor = ['beams', 'cavern'].includes(architecture.roof) ? 'rgba(35,18,18,0.48)'
      : architecture.roof === 'tiles' ? 'rgba(255,255,255,0.18)'
        : architecture.roof === 'stage' ? 'rgba(255,216,74,0.24)'
          : 'rgba(255,241,168,0.2)';
    ctx.strokeStyle = roofColor;
    ctx.lineWidth = architecture.roof === 'beams' ? 5 : 2;
    if (architecture.roof !== 'tent') {
      const beamCount = architecture.roof === 'tiles' ? 6 : 4;
      for (let i = -beamCount; i <= beamCount; i++) {
        const baseX = w / 2 + (i + sidePhase) * (architecture.roof === 'tiles' ? 96 : 128);
        ctx.beginPath();
        ctx.moveTo(baseX, 0);
        ctx.lineTo(w / 2 + (i * 10), horizon);
        ctx.stroke();
      }
    }
    ctx.lineWidth = architecture.roof === 'beams' ? 4 : 1;
    const crossBeamCount = architecture.roof === 'tent' ? 4 : 6;
    for (let i = 1; i <= crossBeamCount; i++) {
      const depth = (i - forwardPhase + 0.2) / crossBeamCount;
      const y = horizon * (1 - Math.pow(Math.max(0, depth), 1.65));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    if (architecture.roof === 'water') {
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = '#7df0ff';
      for (let y = 18; y < horizon; y += 22) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 18) {
          const waveY = y + Math.sin(x / 38 + performance.now() / 900) * 3;
          if (x === 0) ctx.moveTo(x, waveY); else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  },

  getCircusRoomTheme(motif, zone = {}) {
    const themes = {
      circus: { ceilingTop: '#0b0824', ceilingBottom: '#24112f', floorA: '#e06f24', floorB: '#080808', floorC: '#f4f0df', grid: 'rgba(255,241,168,0.1)' },
      final: { ceilingTop: '#080510', ceilingBottom: '#261020', floorA: '#1b0f16', floorB: '#a51d24', floorC: '#fff1a8', grid: 'rgba(255,90,105,0.12)' },
      grounds: { ceilingTop: '#153a85', ceilingBottom: '#5f8ee8', floorA: '#315f2d', floorB: '#244f21', floorC: '#c64a31', grid: 'rgba(255,241,168,0.12)' },
      cellar: { ceilingTop: '#050509', ceilingBottom: '#15131b', floorA: '#171721', floorB: '#25232d', floorC: '#56505f', grid: 'rgba(155,150,170,0.12)' },
      exit: { ceilingTop: '#e7eaf2', ceilingBottom: '#ffffff', floorA: '#d9dce5', floorB: '#f3f3f8', floorC: '#a4a4b2', grid: 'rgba(20,20,28,0.11)' },
      candy: { ceilingTop: '#7d3f8c', ceilingBottom: '#ffb3d8', floorA: '#ff9b37', floorB: '#ff4fb8', floorC: '#fff1a8', grid: 'rgba(255,255,255,0.15)' },
      test: { ceilingTop: '#030808', ceilingBottom: '#071c1e', floorA: '#021012', floorB: '#083036', floorC: '#7df0ff', grid: 'rgba(125,240,255,0.28)' },
      manor: { ceilingTop: '#090713', ceilingBottom: '#241c30', floorA: '#201522', floorB: '#392336', floorC: '#6d4b42', grid: 'rgba(183,240,255,0.1)' },
      basement: { ceilingTop: '#050509', ceilingBottom: '#14101e', floorA: '#12121a', floorB: '#23202b', floorC: '#3a3542', grid: 'rgba(160,160,175,0.12)' },
      spudsy: { ceilingTop: '#4a1714', ceilingBottom: '#f6d743', floorA: '#e9e1cf', floorB: '#f7f1df', floorC: '#ff4d4d', grid: 'rgba(100,42,20,0.16)' },
      micro: { ceilingTop: '#1b0d2b', ceilingBottom: '#3a1b4f', floorA: '#211230', floorB: '#2f1a41', floorC: '#ff4fb8', grid: 'rgba(125,240,255,0.18)' },
      softball: { ceilingTop: '#102d66', ceilingBottom: '#76a4d9', floorA: '#173416', floorB: '#2d6329', floorC: '#ffffff', grid: 'rgba(255,255,255,0.18)' },
      guns: { ceilingTop: '#190d0b', ceilingBottom: '#35201a', floorA: '#2a1b17', floorB: '#463228', floorC: '#f6d743', grid: 'rgba(246,215,67,0.18)' },
      lake: { ceilingTop: '#0f4e8a', ceilingBottom: '#78e8ff', floorA: '#ffe57d', floorB: '#f7c65e', floorC: '#4ee7ff', grid: 'rgba(255,255,255,0.18)' },
      admin: { ceilingTop: '#080808', ceilingBottom: '#1a1a1a', floorA: '#f2f2f2', floorB: '#050505', floorC: '#ffcf75', grid: 'rgba(255,207,117,0.18)' },
      core: { ceilingTop: '#120806', ceilingBottom: '#3b180d', floorA: '#0a0705', floorB: '#2a1008', floorC: '#ff7a30', grid: 'rgba(255,122,48,0.25)' },
      memory: { ceilingTop: '#06070c', ceilingBottom: '#15151f', floorA: '#0e0e12', floorB: '#22202a', floorC: '#d9d0a2', grid: 'rgba(217,208,162,0.16)' },
      archive: { ceilingTop: '#07020f', ceilingBottom: '#20102e', floorA: '#13091d', floorB: '#251234', floorC: '#c875ff', grid: 'rgba(200,117,255,0.16)' },
      dorm: { ceilingTop: '#5d2730', ceilingBottom: '#f1c67b', floorA: '#9f2039', floorB: '#64172b', floorC: '#ffd06a', grid: 'rgba(255,208,106,0.16)' },
      dormannex: { ceilingTop: '#21101a', ceilingBottom: '#6b3442', floorA: '#6b2135', floorB: '#35121f', floorC: '#a56b72', grid: 'rgba(180,125,135,0.14)' },
      bedroom: { ceilingTop: '#160b1e', ceilingBottom: '#3d203d', floorA: '#6a2f48', floorB: '#3d2134', floorC: '#fff1a8', grid: 'rgba(255,241,168,0.12)' },
      archivebedroom: { ceilingTop: '#050407', ceilingBottom: '#171219', floorA: '#171219', floorB: '#0b090d', floorC: '#695b68', grid: 'rgba(160,145,160,0.1)' },
      cafe: { ceilingTop: '#17100d', ceilingBottom: '#3b271e', floorA: '#302018', floorB: '#4a2d20', floorC: '#d49a62', grid: 'rgba(212,154,98,0.15)' },
      aquarium: { ceilingTop: '#06202f', ceilingBottom: '#0a5068', floorA: '#073443', floorB: '#0a596b', floorC: '#63d9ff', grid: 'rgba(99,217,255,0.2)' },
      snow: { ceilingTop: '#34567a', ceilingBottom: '#9dc4dc', floorA: '#e8f7ff', floorB: '#a7c9df', floorC: '#ffffff', grid: 'rgba(255,255,255,0.22)' },
      poacher: { ceilingTop: '#16305a', ceilingBottom: '#426b58', floorA: '#304621', floorB: '#49652e', floorC: '#c4a45f', grid: 'rgba(196,164,95,0.16)' },
      school: { ceilingTop: '#8bc8ff', ceilingBottom: '#f5c8df', floorA: '#e8d7df', floorB: '#f5edf1', floorC: '#ff9fcd', grid: 'rgba(120,120,160,0.16)' },
      whitehouse: { ceilingTop: '#44699a', ceilingBottom: '#e7ecf5', floorA: '#d8dce7', floorB: '#f2f2f2', floorC: '#44699a', grid: 'rgba(68,105,154,0.16)' }
      ,void: { ceilingTop: '#ffffff', ceilingBottom: '#f7f8ff', floorA: '#ffffff', floorB: '#edf1ff', floorC: '#d8dcff', grid: 'rgba(120,125,170,0.1)' }
      ,common: { ceilingTop: '#24112f', ceilingBottom: '#5d2730', floorA: '#c43a35', floorB: '#f0b34a', floorC: '#fff1a8', grid: 'rgba(255,241,168,0.14)' }
      ,tubes: { ceilingTop: '#24112f', ceilingBottom: '#5b2c73', floorA: '#e06f24', floorB: '#080808', floorC: '#f4f0df', grid: 'rgba(125,240,255,0.16)' }
      ,loser: { ceilingTop: '#1b102b', ceilingBottom: '#493060', floorA: '#4c305c', floorB: '#291b38', floorC: '#63d9ff', grid: 'rgba(99,217,255,0.16)' }
      ,nest: { ceilingTop: '#21150f', ceilingBottom: '#5a3c28', floorA: '#5a3c28', floorB: '#7a5a3d', floorC: '#e8d6a8', grid: 'rgba(232,214,168,0.14)' }
      ,palace: { ceilingTop: '#7d3f8c', ceilingBottom: '#ffb3d8', floorA: '#ffd6e8', floorB: '#fff1a8', floorC: '#ff9ad5', grid: 'rgba(255,255,255,0.18)' }
      ,route: { ceilingTop: '#315c9b', ceilingBottom: '#84c7f0', floorA: '#d97b35', floorB: '#8f4930', floorC: '#ffd84a', grid: 'rgba(255,241,168,0.14)' }
      ,hell: { ceilingTop: '#080000', ceilingBottom: '#340505', floorA: '#240707', floorB: '#5a0b0b', floorC: '#ff4d32', grid: 'rgba(255,77,50,0.2)' }
      ,kitchen: { ceilingTop: '#561914', ceilingBottom: '#d94734', floorA: '#d9d4c7', floorB: '#f4efe2', floorC: '#f6d743', grid: 'rgba(80,40,30,0.18)' }
      ,bathroom: { ceilingTop: '#36534d', ceilingBottom: '#91d4bb', floorA: '#dedbd0', floorB: '#9fc9bd', floorC: '#ffffff', grid: 'rgba(40,80,75,0.18)' }
      ,training: { ceilingTop: '#050505', ceilingBottom: '#1b1717', floorA: '#1b1717', floorB: '#342525', floorC: '#e53935', grid: 'rgba(229,57,53,0.18)' }
      ,awards: { ceilingTop: '#1c0a24', ceilingBottom: '#5a1b4c', floorA: '#8b172b', floorB: '#d13f5a', floorC: '#ffd84a', grid: 'rgba(255,216,74,0.2)' }
      ,lighthouse: { ceilingTop: '#218bc4', ceilingBottom: '#78e8ff', floorA: '#ffe57d', floorB: '#f7c65e', floorC: '#ff5b4d', grid: 'rgba(255,255,255,0.18)' }
      ,underwater: { ceilingTop: '#031923', ceilingBottom: '#0a5068', floorA: '#073443', floorB: '#0a596b', floorC: '#4ee7ff', grid: 'rgba(99,217,255,0.2)' }
      ,street: { ceilingTop: '#101820', ceilingBottom: '#516779', floorA: '#30343a', floorB: '#59616a', floorC: '#8fa6ba', grid: 'rgba(255,255,255,0.12)' }
      ,carnival: { ceilingTop: '#153a85', ceilingBottom: '#5f8ee8', floorA: '#315f2d', floorB: '#244f21', floorC: '#ff4fb8', grid: 'rgba(255,241,168,0.16)' }
      ,dining: { ceilingTop: '#24112f', ceilingBottom: '#5d2730', floorA: '#c43a35', floorB: '#8f2728', floorC: '#ffd84a', grid: 'rgba(255,241,168,0.14)' }
    };
    const base = themes[motif] || themes.circus;
    return {
      ...base,
      ceilingTop: zone.ceiling ? this.shadeHex(zone.ceiling, 0.72) : base.ceilingTop,
      ceilingBottom: zone.ceiling ? this.shadeHex(zone.ceiling, 1.2) : base.ceilingBottom
    };
  },

  drawCircusThemedCeiling(ctx, w, h, horizon, state, zone, motif) {
    const theme = this.getCircusRoomTheme(motif, zone);
    const gradient = ctx.createLinearGradient(0, 0, 0, horizon);
    gradient.addColorStop(0, theme.ceilingTop);
    gradient.addColorStop(1, theme.ceilingBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, horizon);

    ctx.save();
    const pulse = 0.55 + Math.sin(performance.now() / 700) * 0.45;
    if (['circus', 'grounds', 'final'].includes(motif)) {
      ctx.strokeStyle = motif === 'final' ? 'rgba(255,70,80,0.32)' : 'rgba(255,241,168,0.26)';
      ctx.lineWidth = 2;
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(w / 2, 12);
        ctx.lineTo(w / 2 + i * 92, horizon);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(255,216,74,${0.08 + pulse * 0.06})`;
      ctx.beginPath();
      ctx.arc(w / 2, 22, 54, 0, Math.PI * 2);
      ctx.fill();
    } else if (motif === 'candy' || motif === 'lake') {
      ctx.fillStyle = motif === 'lake' ? 'rgba(255,229,125,0.8)' : 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 7; i++) {
        const x = (i * 137 + Math.sin(performance.now() / 1300 + i) * 12) % (w + 120) - 60;
        const y = 28 + (i % 3) * 34;
        ctx.beginPath();
        ctx.ellipse(x, y, 34, 11, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 28, y + 4, 25, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (['test', 'admin', 'core'].includes(motif)) {
      ctx.strokeStyle = theme.grid;
      for (let x = -80; x < w + 80; x += 42) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 100, horizon);
        ctx.stroke();
      }
      for (let y = 0; y < horizon; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    } else if (['manor', 'basement'].includes(motif)) {
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      for (let i = 0; i < 6; i++) {
        const x = 70 + i * 120;
        ctx.fillRect(x, 0, 10, horizon);
      }
      ctx.fillStyle = 'rgba(255,216,120,0.16)';
      ctx.beginPath();
      ctx.ellipse(w / 2, 50, 92, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (motif === 'spudsy') {
      ctx.fillStyle = 'rgba(255,77,77,0.22)';
      ctx.fillRect(0, horizon * 0.58, w, 14);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      for (let x = 0; x < w; x += 54) ctx.fillRect(x, 0, 2, horizon);
    } else if (motif === 'dorm' || motif === 'dormannex') {
      ctx.fillStyle = 'rgba(255,240,190,0.2)';
      for (let i = 0; i < 6; i++) {
        const depth = i / 6;
        const lampW = 112 * (1 - depth * 0.65);
        const lampY = 22 + depth * (horizon - 36);
        ctx.fillRect(w / 2 - lampW / 2, lampY, lampW, Math.max(3, 9 * (1 - depth * 0.5)));
      }
      ctx.strokeStyle = 'rgba(106,47,42,0.45)';
      ctx.beginPath();
      ctx.moveTo(w * 0.18, 0);
      ctx.lineTo(w * 0.43, horizon);
      ctx.moveTo(w * 0.82, 0);
      ctx.lineTo(w * 0.57, horizon);
      ctx.stroke();
    } else {
      ctx.strokeStyle = theme.grid;
      for (let x = 0; x < w; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(w - x, horizon);
        ctx.stroke();
      }
    }
    ctx.restore();
  },

  drawCircusThemedFloor(ctx, w, h, horizon, state, zone, motif) {
    if (motif === 'circus') {
      this.drawCircusSplitRingFloor(ctx, w, h, horizon, state);
      return;
    }
    const floorH = h - horizon;
    const fov = state.fov || Math.PI / 3.05;
    const xStep = 5;
    const yStep = 3;
    for (let sy = Math.floor(horizon); sy < h; sy += yStep) {
      const depthT = Math.max(0.02, (sy - horizon) / floorH);
      const rowDistance = 0.42 / depthT;
      const shade = Math.max(0.5, Math.min(1.2, 1.08 - depthT * 0.38));
      for (let sx = 0; sx < w; sx += xStep) {
        const ratio = sx / Math.max(1, w - 1);
        const rayAngle = state.player.a - fov / 2 + ratio * fov;
        const lateral = (ratio - 0.5) * rowDistance * 0.36;
        const worldX = state.player.x + Math.cos(rayAngle) * rowDistance + Math.cos(rayAngle + Math.PI / 2) * lateral;
        const worldZ = state.player.z + Math.sin(rayAngle) * rowDistance + Math.sin(rayAngle + Math.PI / 2) * lateral;
        ctx.fillStyle = this.getCircusFloorSample(worldX, worldZ, shade, motif, zone, state);
        ctx.fillRect(sx, sy, xStep + 1, yStep + 1);
      }
    }
  },

  getCircusFloorSample(worldX, worldZ, shade, motif, zone, state = null) {
    const theme = this.getCircusRoomTheme(motif, zone);
    const checker = (scale = 1) => (Math.floor(worldX * scale) + Math.floor(worldZ * scale)) % 2 === 0;
    let color = theme.floorA;
    if (motif === 'final') {
      const crack = Math.abs(Math.sin(worldX * 2.4 + worldZ * 1.8)) < 0.12;
      color = crack ? theme.floorC : (checker(1.25) ? theme.floorA : theme.floorB);
    } else if (motif === 'grounds') {
      const path = Math.abs(worldX - worldZ * 0.16) < 0.55;
      color = path ? theme.floorC : (checker(1.1) ? theme.floorA : theme.floorB);
    } else if (motif === 'cellar' || motif === 'basement' || motif === 'manor') {
      const plank = Math.floor(worldX * 2.1) % 2 === 0;
      const seam = Math.abs((worldX * 2.1) % 1) < 0.08;
      color = seam ? theme.floorC : (plank ? theme.floorA : theme.floorB);
    } else if (['exit', 'spudsy', 'kitchen', 'bathroom', 'training', 'admin', 'palace', 'common', 'dining', 'loser', 'awards', 'street'].includes(motif)) {
      color = checker(motif === 'admin' ? 1.45 : 1.35) ? theme.floorA : theme.floorB;
    } else if (motif === 'candy' || motif === 'route') {
      const syrup = Math.sin(worldX * 1.7 + worldZ * 0.9) > 0.42;
      color = syrup ? theme.floorB : (checker(0.85) ? theme.floorA : theme.floorC);
    } else if (motif === 'test' || motif === 'core' || motif === 'micro' || motif === 'archive' || motif === 'memory') {
      const gridLine = Math.abs((worldX * 1.25) % 1) < 0.04 || Math.abs((worldZ * 1.25) % 1) < 0.04;
      color = gridLine ? theme.floorC : (checker(0.62) ? theme.floorA : theme.floorB);
    } else if (motif === 'softball') {
      const diamond = Math.abs(Math.abs(worldX - 6) + Math.abs(worldZ - 6) - 2.8) < 0.18;
      color = diamond ? theme.floorC : (checker(1.5) ? theme.floorA : theme.floorB);
    } else if (motif === 'guns') {
      const lane = Math.abs((worldX * 0.55) % 1) < 0.08;
      color = lane ? theme.floorC : (checker(0.9) ? theme.floorA : theme.floorB);
    } else if (motif === 'lake' || motif === 'lighthouse') {
      const water = worldZ > 6.1 + Math.sin(worldX * 0.8) * 0.22;
      color = water ? theme.floorC : (checker(0.9) ? theme.floorA : theme.floorB);
    } else if (motif === 'underwater') {
      const ripple = Math.sin(worldX * 1.8 + worldZ * 1.2) > 0.35;
      color = ripple ? theme.floorC : (checker(1.1) ? theme.floorA : theme.floorB);
    } else if (motif === 'void') {
      const farGrid = Math.abs((worldX * 0.5) % 1) < 0.025 || Math.abs((worldZ * 0.5) % 1) < 0.025;
      color = farGrid ? theme.floorC : theme.floorA;
    } else if (['tubes', 'carnival', 'nest', 'hell'].includes(motif)) {
      color = checker(1.05) ? theme.floorA : theme.floorB;
    } else if (motif === 'dorm' || motif === 'dormannex') {
      const centerX = state?.room?.center?.x ?? 9.5;
      const offset = Math.abs(worldX - centerX);
      const border = offset > 1.15 && offset < 1.48;
      color = border ? theme.floorC : (offset < 1.15 ? theme.floorA : theme.floorB);
    } else if (motif === 'bedroom') {
      const roomId = state?.currentZoneId;
      if (roomId === 49) color = checker(1.15) ? '#eee9d3' : '#17131d';
      else if (roomId === 48) {
        const pattern = Math.abs(Math.sin(worldX * 1.5) + Math.cos(worldZ * 1.7));
        color = pattern > 1.05 ? '#7df0ff' : (checker(1.15) ? theme.floorA : theme.floorB);
      } else if (roomId === 47) color = checker(1.1) ? '#16090d' : '#2b0c16';
      else if (roomId === 46) {
        const seam = Math.abs((worldX * 2.4) % 1) < 0.07;
        color = seam ? '#3d241d' : (checker(0.55) ? '#8b5a3c' : '#72452f');
      } else color = checker(1.05) ? theme.floorA : theme.floorB;
    } else if (motif === 'archivebedroom') {
      const gridLine = Math.abs((worldX * 1.1) % 1) < 0.035 || Math.abs((worldZ * 1.1) % 1) < 0.035;
      color = gridLine ? theme.floorC : (checker(0.55) ? theme.floorA : theme.floorB);
    }
    return this.shadeHex(color, shade);
  },

  drawCircusSplitRingFloor(ctx, w, h, horizon, state) {
    const room = state.room;
    const center = room?.center || { x: state.player.x, z: state.player.z };
    const floorH = h - horizon;
    const fov = state.fov || Math.PI / 3.05;
    const xStep = 5;
    const yStep = 3;
    const checkerScale = 1.35;
    for (let sy = Math.floor(horizon); sy < h; sy += yStep) {
      const depthT = Math.max(0.02, (sy - horizon) / floorH);
      const rowDistance = 0.42 / depthT;
      const shade = Math.max(0.48, Math.min(1.22, 1.08 - depthT * 0.42));
      for (let sx = 0; sx < w; sx += xStep) {
        const screenRatio = sx / Math.max(1, w - 1);
        const rayAngle = state.player.a - fov / 2 + screenRatio * fov;
        const lateral = (screenRatio - 0.5) * rowDistance * 0.36;
        const worldX = state.player.x + Math.cos(rayAngle) * rowDistance + Math.cos(rayAngle + Math.PI / 2) * lateral;
        const worldZ = state.player.z + Math.sin(rayAngle) * rowDistance + Math.sin(rayAngle + Math.PI / 2) * lateral;
        const isOrangeSide = worldX < center.x;
        if (isOrangeSide) {
          const stripe = Math.floor(worldZ * 1.2) % 2 === 0 ? 1 : 0.86;
          ctx.fillStyle = this.shadeHex(stripe > 0.95 ? '#e06f24' : '#bd521c', shade);
        } else {
          const checker = (Math.floor(worldX * checkerScale) + Math.floor(worldZ * checkerScale)) % 2 === 0;
          ctx.fillStyle = checker ? this.shadeHex('#f4f0df', shade) : this.shadeHex('#080808', Math.max(0.7, shade));
        }
        ctx.fillRect(sx, sy, xStep + 1, yStep + 1);
      }
    }

    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = 'rgba(255,238,168,0.28)';
    ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i++) {
      const worldLineX = center.x + i;
      const near = this.projectCircusFloorPoint(worldLineX, center.z - 8, state, w, h, horizon, fov);
      const far = this.projectCircusFloorPoint(worldLineX, center.z + 8, state, w, h, horizon, fov);
      if (near && far) {
        ctx.beginPath();
        ctx.moveTo(near.x, near.y);
        ctx.lineTo(far.x, far.y);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    for (let i = -5; i <= 5; i++) {
      const worldLineZ = center.z + i;
      const near = this.projectCircusFloorPoint(center.x - 8, worldLineZ, state, w, h, horizon, fov);
      const far = this.projectCircusFloorPoint(center.x + 8, worldLineZ, state, w, h, horizon, fov);
      if (near && far) {
        ctx.beginPath();
        ctx.moveTo(near.x, near.y);
        ctx.lineTo(far.x, far.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  },

  projectCircusFloorPoint(worldX, worldZ, state, w, h, horizon, fov) {
    const dx = worldX - state.player.x;
    const dz = worldZ - state.player.z;
    const forward = Math.cos(state.player.a) * dx + Math.sin(state.player.a) * dz;
    if (forward <= 0.08) return null;
    const side = Math.cos(state.player.a + Math.PI / 2) * dx + Math.sin(state.player.a + Math.PI / 2) * dz;
    const screenX = w / 2 + (side / forward) * (w / Math.tan(fov / 2)) * 0.5;
    const screenY = horizon + (h - horizon) * Math.min(1.4, 0.42 / forward);
    if (screenX < -80 || screenX > w + 80 || screenY < horizon || screenY > h + 80) return null;
    return { x: screenX, y: screenY };
  },

  getCircusZoneAmbientEvent(zoneId, state) {
    const now = performance.now() / 1000;
    const slot = Math.floor(now / 5);
    const phase = now % 5;
    const events = {
      2: [
        { id: 'spotlight_sweep', label: 'PROJECTEURS', detail: 'EVENT: les projecteurs de Caine balayent la piste.', color: '#ffd84a' },
        { id: 'curtain_shift', label: 'RIDEAUX', detail: 'EVENT: la piste se recale comme un decor de spectacle.', color: '#e53935' }
      ],
      3: [
        { id: 'gloink_swarm', label: 'GLOINK SWARM', detail: 'EVENT: petits Gloinks en mouvement autour du terrain.', color: '#7348ff' },
        { id: 'queen_pulse', label: 'QUEEN SIGNAL', detail: 'EVENT: la Gloink Queen pulse a grande echelle.', color: '#ff7d8d' }
      ],
      4: [
        { id: 'cellar_warning', label: 'ABSTRACT WARNING', detail: 'EVENT: le cellar conserve le signal Kaufmo sous alerte.', color: '#56505f' }
      ],
      6: [
        { id: 'candy_convoy', label: 'CONVOI', detail: 'EVENT: poussiere sucree du camion-citerne.', color: '#ff9b37' },
        { id: 'fudge_shift', label: 'FUDGE MOVE', detail: 'EVENT: The Fudge bouge dans le decor candy.', color: '#7a3d1a' }
      ],
      8: [
        { id: 'manor_flicker', label: 'BOUGIES', detail: 'EVENT: les bougies du manoir rendent la peur visible.', color: '#b7f0ff' },
        { id: 'ghost_pass', label: 'GHOST PASS', detail: 'EVENT: apparition spectrale en bord de scene.', color: '#7df0ff' },
        { id: 'mildenhall_fly', label: 'MOUCHE', detail: 'AMBIANCE: une mouche bourdonne dans le manoir, comme pendant la fuite de Pomni et Kinger.', color: '#fff1a8' }
      ],
      10: [
        { id: 'ticket_rush', label: 'TICKET RUSH', detail: 'EVENT: Spudsy imprime trop de commandes.', color: '#ff4d4d' },
        { id: 'counter_bell', label: 'SERVICE BELL', detail: 'EVENT: le comptoir force le rythme de Gangle.', color: '#f6d743' }
      ],
      11: [
        { id: 'micro_shuffle', label: 'SUGGESTION', detail: 'EVENT: micro-aventure remelangee par Caine.', color: '#ff4fb8' }
      ],
      12: [
        { id: 'score_flash', label: 'SCOREBOARD', detail: 'EVENT: le match transforme le chaos en score.', color: '#83ff57' }
      ],
      13: [
        { id: 'target_ping', label: 'TARGET LOCK', detail: 'EVENT: l arene arme les cibles virtuelles.', color: '#f6d743' }
      ],
      14: [
        { id: 'heat_wave', label: 'SUN PURGE', detail: 'EVENT: le soleil du lac digital devient trop agressif.', color: '#ffd84a' },
        { id: 'wave_loop', label: 'WAVE LOOP', detail: 'EVENT: l eau boucle comme un shader trop propre.', color: '#4ee7ff' }
      ],
      15: [
        { id: 'admin_scan', label: 'ADMIN SCAN', detail: 'EVENT: la zone admin relit les couches C&A.', color: '#ffcf75' }
      ],
      16: [
        { id: 'core_trace', label: 'C&A TRACE', detail: 'EVENT: le coeur C&A expose des traces techniques.', color: '#ff7a30' }
      ],
      17: [
        { id: 'memory_echo', label: 'MEMORY ECHO', detail: 'EVENT: la memoire Queenie remonte sans se restaurer.', color: '#d9d0a2' }
      ],
      18: [
        { id: 'color_loss', label: 'COLOR LOSS', detail: 'EVENT: le final tire les couleurs hors de la piste.', color: '#e53935' }
      ],
      19: [
        { id: 'archive_flicker', label: 'ARCHIVE FLICKER', detail: 'EVENT: les Circus Members clignotent comme fiches mortes.', color: '#c875ff' }
      ],
      20: [{ id: 'hall_lights', label: 'HALL LIGHTS', detail: 'EVENT: les plafonniers du couloir s allument par sections.', color: '#fff1a8' }],
      21: [{ id: 'cafe_pause', label: 'CAFE PAUSE', detail: 'EVENT: le Cafe Cirque conserve un calme provisoire entre les aventures.', color: '#d49a62' }],
      22: [{ id: 'aquarium_current', label: 'AQUARIUM', detail: 'EVENT: un courant numerique traverse les vitres de l aquarium.', color: '#4ee7ff' }],
      23: [{ id: 'snow_fall', label: 'SNOW LOOP', detail: 'EVENT: la neige recommence sa boucle au-dessus du parcours.', color: '#e8f7ff' }],
      24: [{ id: 'western_dust', label: 'DUST LOOP', detail: 'EVENT: la poussiere du duel traverse les accessoires western.', color: '#c4a45f' }],
      25: [{ id: 'school_bell', label: 'SCHOOL BELL', detail: 'EVENT: la variante scolaire relance son signal de changement de cours.', color: '#ff9fcd' }],
      26: [{ id: 'office_signal', label: 'OFFICE FEED', detail: 'EVENT: le decor politique recycle son signal de diffusion.', color: '#edf0f7' }],
      27: [{ id: 'void_static', label: 'VOID STATIC', detail: 'EVENT: le Vide efface les reperes qui restent trop longtemps immobiles.', color: '#ffffff' }],
      28: [{ id: 'common_chatter', label: 'COMMON ROOM', detail: 'EVENT: des echos de conversation restent suspendus dans l espace commun.', color: '#ffd84a' }],
      29: [{ id: 'tube_shuffle', label: 'TUBE SHUFFLE', detail: 'EVENT: les destinations des portes et tubes se remelangent.', color: '#7df0ff' }],
      30: [{ id: 'loser_echo', label: 'LOSER ECHO', detail: 'EVENT: la punition du Loser Corner repete son propre silence.', color: '#6e527f' }],
      31: [{ id: 'nest_archive', label: 'NEST ARCHIVE', detail: 'EVENT: l aventure supprimee laisse remonter un fragment de decor.', color: '#e8d6a8' }],
      32: [{ id: 'palace_chime', label: 'ROYAL CHIME', detail: 'EVENT: le palais annonce une nouvelle audience de Princess Loolilalu.', color: '#ff9ad5' }],
      33: [{ id: 'tanker_rumble', label: 'TANKER RUMBLE', detail: 'EVENT: le camion-citerne fait vibrer la route du convoi.', color: '#ffd84a' }],
      34: [{ id: 'soul_pulse', label: 'SOUL PULSE', detail: 'EVENT: les ames du manoir reagissent a la lumiere et a la peur.', color: '#ff4d32' }],
      35: [{ id: 'kitchen_rush', label: 'KITCHEN RUSH', detail: 'EVENT: une nouvelle vague de tickets atteint la cuisine Spudsy.', color: '#f6d743' }],
      36: [{ id: 'biohazard_cycle', label: 'BIOHAZARD', detail: 'EVENT: la sous-zone sanitaire relance son cycle de nettoyage.', color: '#91d4bb' }],
      37: [{ id: 'training_loop', label: 'TRAINING LOOP', detail: 'EVENT: la video de formation recommence devant Jax.', color: '#e53935' }],
      38: [{ id: 'awards_applause', label: 'AWARDS', detail: 'EVENT: les applaudissements programmes accompagnent le verdict de Caine.', color: '#ffd84a' }],
      39: [{ id: 'lighthouse_beam', label: 'LIGHTHOUSE', detail: 'EVENT: le faisceau du phare balaie la plage et le lac.', color: '#ffffff' }],
      40: [{ id: 'bubble_trail', label: 'BUBBLE TRAIL', detail: 'EVENT: des bulles remontent autour du coffre sous-marin deja pille.', color: '#4ee7ff' }],
      41: [{ id: 'memory_rain', label: 'MEMORY RAIN', detail: 'EVENT: le souvenir incomplet de Jax perd encore quelques details.', color: '#8fa6ba' }],
      42: [{ id: 'carnival_lights', label: 'CARNIVAL', detail: 'EVENT: les attractions visibles du terrain allument leurs enseignes.', color: '#ff4fb8' }],
      43: [{ id: 'dinner_bell', label: 'DINNER BELL', detail: 'EVENT: la table commune signale le prochain repas du groupe.', color: '#fff1a8' }]
    };
    const zoneEvents = events[zoneId];
    if (!zoneEvents?.length) return null;
    return { ...zoneEvents[slot % zoneEvents.length], phase, slot };
  },

  drawCircusZoneEvents(ctx, w, h, state, zone) {
    const event = this.getCircusZoneAmbientEvent(state.currentZoneId, state);
    if (!event) return;
    if (state.lastZoneEventId !== event.id) {
      state.lastZoneEventId = event.id;
      if (event.id === 'mildenhall_fly') {
        this.playCircusSpatialObjectSound({ x: 0.85, z: -0.65 }, event.id);
      } else if (typeof SoundManager.playFpsEvent === 'function') {
        SoundManager.playFpsEvent(event.id);
      }
      this.applyCircusAmbientEventEffect(event, state);
    }
    const t = performance.now() / 1000;
    ctx.save();
    if (event.id === 'spotlight_sweep' || event.id === 'queen_pulse') {
      const sweep = (Math.sin(t * 1.2) + 1) / 2;
      ctx.fillStyle = `${event.color}22`;
      ctx.beginPath();
      ctx.moveTo(w * (0.18 + sweep * 0.38), 0);
      ctx.lineTo(w * (0.32 + sweep * 0.38), 0);
      ctx.lineTo(w * 0.5, h);
      ctx.closePath();
      ctx.fill();
    } else if (event.id === 'gloink_swarm' || event.id === 'ticket_rush' || event.id === 'micro_shuffle') {
      ctx.fillStyle = `${event.color}99`;
      for (let i = 0; i < 10; i++) {
        const x = (w * 0.14 + ((t * 45 + i * 67) % (w * 0.72)));
        const y = h * 0.34 + Math.sin(t * 2 + i) * 18 + i % 3 * 18;
        ctx.fillRect(x, y, 10 + (i % 3) * 4, 2);
      }
    } else if (event.id === 'mildenhall_fly') {
      this.drawCircusMildenhallFly(ctx, w, h, state, event);
    } else if (event.id === 'manor_flicker' || event.id === 'ghost_pass') {
      ctx.globalAlpha = 0.1 + Math.abs(Math.sin(t * 5.5)) * 0.18;
      ctx.fillStyle = event.color;
      ctx.fillRect(0, 0, w, h);
    } else if (event.id === 'heat_wave' || event.id === 'wave_loop') {
      ctx.strokeStyle = `${event.color}88`;
      for (let y = Math.floor(h * 0.5); y < h; y += 18) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 18) {
          const offset = Math.sin(x / 36 + t * 2.2 + y * 0.04) * 4;
          if (x === 0) ctx.moveTo(x, y + offset);
          else ctx.lineTo(x, y + offset);
        }
        ctx.stroke();
      }
    } else if (event.id === 'score_flash' || event.id === 'target_ping' || event.id === 'admin_scan' || event.id === 'core_trace' || event.id === 'color_loss' || event.id === 'archive_flicker' || event.id === 'memory_echo' || event.id === 'cellar_warning' || event.id === 'candy_convoy' || event.id === 'fudge_shift' || event.id === 'counter_bell' || event.id === 'curtain_shift') {
      ctx.strokeStyle = `${event.color}99`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const inset = 20 + i * 18 + Math.sin(t * 2 + i) * 4;
        ctx.strokeRect(inset, inset * 0.45, w - inset * 2, h - inset * 0.9);
      }
    } else {
      ctx.strokeStyle = `${event.color}66`;
      ctx.fillStyle = `${event.color}55`;
      for (let i = 0; i < 8; i++) {
        const x = (i * 97 + t * 18) % (w + 40) - 20;
        const y = h * 0.2 + ((i * 43 + t * 11) % Math.max(40, h * 0.62));
        ctx.beginPath();
        ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = 'rgba(5,2,13,0.72)';
    ctx.strokeStyle = event.color;
    ctx.lineWidth = 1;
    ctx.fillRect(w - 170, 24, 148, 24);
    ctx.strokeRect(w - 170, 24, 148, 24);
    ctx.fillStyle = event.color;
    ctx.font = 'bold 9px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`EVENT: ${event.label}`, w - 96, 40);
    ctx.restore();
  },

  drawCircusMildenhallFly(ctx, w, h, state, event) {
    if (state.currentZoneId !== 8 || !state.room) return;
    const t = performance.now() / 1000;
    const fly = {
      x: 0.85 + Math.sin(t * 2.7) * 0.5,
      z: -0.65 + Math.cos(t * 2.1) * 0.38
    };
    const projected = this.projectCircusPoint(fly, state, w, h);
    if (!projected || projected.distance > 6.2) return;
    const bodySize = Math.max(1.2, Math.min(5, projected.scale * 3.8));
    const flyY = projected.y - Math.max(8, 43 * projected.scale + Math.sin(t * 7.5) * 5 * projected.scale);
    const box = {
      x: projected.x - bodySize * 3,
      y: flyY - bodySize * 2.2,
      w: bodySize * 6,
      h: bodySize * 4.4
    };
    ctx.save();
    if (!this.applyCircusDepthClip(ctx, box, projected.depth, state, 0.12)) {
      ctx.restore();
      return;
    }
    ctx.globalAlpha = 0.58 + Math.abs(Math.sin(t * 18)) * 0.34;
    ctx.fillStyle = 'rgba(255,255,220,0.7)';
    ctx.beginPath();
    ctx.ellipse(projected.x - bodySize * 1.25, flyY - bodySize * 0.45, bodySize * 1.45, bodySize * 0.65, -0.45, 0, Math.PI * 2);
    ctx.ellipse(projected.x + bodySize * 1.25, flyY - bodySize * 0.45, bodySize * 1.45, bodySize * 0.65, 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#090909';
    ctx.beginPath();
    ctx.ellipse(projected.x, flyY, bodySize * 0.72, bodySize * 1.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(projected.x - bodySize * 0.16, flyY - bodySize * 1.55, bodySize * 0.32, bodySize * 0.62);
    ctx.restore();
  },

  applyCircusAmbientEventEffect(event, state) {
    if (!event || !state || state.cinematic) return;
    if (event.id === 'tube_shuffle' && state.room?.doors?.length > 1) {
      state.selectedExitIndex = (state.selectedExitIndex + 1) % state.room.doors.length;
      state.interactionMessage = 'TUBE SHUFFLE: les destinations restent les memes, mais leurs reperes visuels viennent de se recaler.';
    } else if (event.id === 'heat_wave' && performance.now() >= (state.diveModeUntil || 0)) {
      state.stability = Math.max(5, state.stability - 2);
      state.interactionMessage = 'SUN PURGE: restez sous un parasol ou entrez dans l eau digitale.';
    } else if (event.id === 'ticket_rush') {
      state.interactionMessage = 'TICKET RUSH: une nouvelle commande doit etre prise puis remise au bon personnage.';
    } else if (event.id === 'spotlight_sweep' && state.stability < 100) {
      state.stability = Math.min(100, state.stability + 1);
    } else if (event.id === 'color_loss') {
      state.stability = Math.max(10, state.stability - 1);
      state.interactionMessage = 'COLOR LOSS: restez pres du groupe pour conserver un repere.';
    }
    if (state.interactionMessage) {
      state.interactionUntil = performance.now() + 2800;
      state.interactionChannel = 'system';
      state.interactionSpeaker = event.label;
    }
    this.updateCircusFpsToolbar();
  },

  drawCircusZoneObjectiveHud(ctx, w, h, state) {
    const status = this.getCircusZoneObjectiveStatus(state.currentZoneId, state);
    if (!status) return;
    const width = w < 480 ? w - 28 : Math.min(310, w * 0.42);
    const x = (w - width) / 2;
    const y = w < 480 ? 106 : 10;
    const color = status.complete ? '#9cff6d' : '#fff1a8';
    const ratio = status.total ? status.done / status.total : 0;
    const next = status.complete ? 'MISSION LOCALE TERMINEE'
      : `${status.next.label}${status.next.target > 1 ? ` ${status.next.progress}/${status.next.target}` : ''}`;
    ctx.save();
    ctx.fillStyle = 'rgba(5,2,13,0.8)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.fillRect(x, y, width, 34);
    ctx.strokeRect(x, y, width, 34);
    ctx.fillStyle = color;
    ctx.font = 'bold 8px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`MISSION: ${status.title}  [${status.done}/${status.total}]`.slice(0, 52), x + 7, y + 11);
    ctx.fillStyle = '#fff1a8';
    ctx.font = '7px Courier New';
    ctx.fillText(next.slice(0, 58), x + 7, y + 23);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(x + 7, y + 27, width - 14, 3);
    ctx.fillStyle = color;
    ctx.fillRect(x + 7, y + 27, (width - 14) * ratio, 3);
    ctx.restore();
  },

  drawCircusRoomMinimap(ctx, w, h, state, zone) {
    const room = state.room;
    if (!room) return;
    const compact = w < 480;
    const cell = compact ? 3 : 4;
    const ox = 12;
    const oy = compact ? 198 : 46;
    ctx.save();
    ctx.fillStyle = 'rgba(5,2,13,0.62)';
    ctx.fillRect(ox - 4, oy - 4, room.size * cell + 8, room.size * cell + 8);
    const explored = state.exploredCells.get(state.currentZoneId) || new Set();
    for (let z = 0; z < room.size; z++) {
      for (let x = 0; x < room.size; x++) {
        if (!explored.has(`${x}:${z}`)) {
          ctx.fillStyle = 'rgba(0,0,0,0.82)';
          ctx.fillRect(ox + x * cell, oy + z * cell, cell - 1, cell - 1);
          continue;
        }
        const value = room.grid[z][x];
        if (value === 0) ctx.fillStyle = 'rgba(255,255,255,0.08)';
        else if (value >= 100) {
          const door = room.doors.find(item => item.code === value);
          const target = door ? state.portals[door.target] : null;
          ctx.fillStyle = target?.unlocked ? (target.color || zone.color) : '#4b4b55';
        } else {
          ctx.fillStyle = value === 2 ? this.shadeHex(zone.color || '#ffd84a', 0.75) : '#2b1632';
        }
        ctx.fillRect(ox + x * cell, oy + z * cell, cell - 1, cell - 1);
      }
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ox + state.player.x * cell - 2, oy + state.player.z * cell - 2, 4, 4);
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(ox + state.player.x * cell, oy + state.player.z * cell);
    ctx.lineTo(ox + (state.player.x + Math.cos(state.player.a) * 0.9) * cell, oy + (state.player.z + Math.sin(state.player.a) * 0.9) * cell);
    ctx.stroke();
    ctx.restore();
  },

  drawCircusRoomShell(ctx, w, h, zone, motif, horizon) {
    const pulse = 0.5 + Math.sin(performance.now() / 700) * 0.5;
    const wallColor = this.shadeHex(zone.color || '#ffd84a', 0.38);
    const deepWall = this.shadeHex(zone.ceiling || '#120821', 0.82);

    ctx.fillStyle = deepWall;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.22, horizon - 30);
    ctx.lineTo(w * 0.22, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w * 0.78, horizon - 30);
    ctx.lineTo(w * 0.78, h);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = this.shadeHex(zone.ceiling || '#120821', 1.12);
    ctx.beginPath();
    ctx.moveTo(w * 0.22, horizon - 30);
    ctx.lineTo(w * 0.78, horizon - 30);
    ctx.lineTo(w, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(w * 0.22, horizon - 30);
    ctx.lineTo(w * 0.78, horizon - 30);
    ctx.moveTo(w * 0.22, horizon - 30);
    ctx.lineTo(0, h);
    ctx.moveTo(w * 0.78, horizon - 30);
    ctx.lineTo(w, h);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0,0,0,0.24)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.88, w * 0.44, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = wallColor;
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      const y = horizon + t * (h - horizon);
      const inset = 36 + t * 180;
      ctx.beginPath();
      ctx.moveTo(inset, y);
      ctx.lineTo(w - inset, y);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 12; i++) {
      const y = horizon + Math.pow(i / 11, 1.7) * (h - horizon);
      ctx.fillRect(0, y, w, 1);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    for (let i = -5; i <= 5; i++) {
      const x = w / 2 + i * 48;
      ctx.beginPath();
      ctx.moveTo(w / 2, horizon);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const drawSign = (text, x, y, color = '#ffd84a', width = 118) => {
      ctx.fillStyle = '#14091f';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.fillRect(x - width / 2, y - 18, width, 30);
      ctx.strokeRect(x - width / 2, y - 18, width, 30);
      ctx.fillStyle = color;
      ctx.font = 'bold 10px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y + 2);
    };

    if (motif === 'circus' || motif === 'grounds' || motif === 'final') {
      ctx.fillStyle = '#e53935';
      ctx.beginPath();
      ctx.moveTo(w * 0.16, horizon + 34);
      ctx.lineTo(w * 0.5, 22);
      ctx.lineTo(w * 0.84, horizon + 34);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff1a8';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(w * (0.2 + i * 0.1), horizon + 32);
        ctx.lineTo(w * 0.5, 26);
        ctx.lineTo(w * (0.25 + i * 0.1), horizon + 32);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = '#ffd84a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(w / 2, horizon + 10, 190, 32, 0, 0, Math.PI * 2);
      ctx.stroke();
      drawSign(motif === 'final' ? 'BACKSTAGE' : 'DIGITAL CIRCUS', w / 2, 28, '#ffd84a', 148);
      ctx.fillStyle = `rgba(125,240,255,${0.1 + pulse * 0.08})`;
      ctx.beginPath();
      ctx.arc(w / 2, horizon + 42, 74, 0, Math.PI * 2);
      ctx.fill();
    } else if (motif === 'cellar') {
      ctx.fillStyle = '#050508';
      ctx.fillRect(44, 28, w - 88, h - 58);
      ctx.strokeStyle = '#56505f';
      for (let x = 72; x < w - 60; x += 52) ctx.strokeRect(x, 64, 34, 106);
      drawSign('CELLAR', w / 2, 36, '#9a9aa8');
    } else if (motif === 'exit') {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      for (let i = 0; i < 7; i++) ctx.strokeRect(w / 2 - 150 + i * 24, 38 + i * 13, 300 - i * 48, 158 - i * 20);
      drawSign('EXIT DOOR', w / 2, 34, '#ffffff');
    } else if (motif === 'candy') {
      ctx.fillStyle = '#472056';
      ctx.fillRect(0, 0, w, horizon);
      ctx.fillStyle = '#ff9b37';
      for (let x = -20; x < w; x += 80) {
        ctx.beginPath();
        ctx.arc(x, horizon + 22, 46, Math.PI, 0);
        ctx.fill();
      }
      ctx.fillStyle = '#ffd84a';
      ctx.fillRect(80, horizon + 38, w - 160, 26);
      drawSign('CANDY CANYON', w / 2, 38, '#ffcf75');
    } else if (motif === 'test' || motif === 'admin' || motif === 'core') {
      ctx.fillStyle = '#05120d';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = motif === 'core' ? '#ff7a30' : '#7df0ff';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 80, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 24) ctx.strokeRect(0, y, w, 1);
      drawSign(motif === 'core' ? 'C&A CORE' : motif === 'admin' ? 'ADMIN ZONE' : 'TEST LEVEL', w / 2, 34, ctx.strokeStyle);
    } else if (motif === 'manor' || motif === 'basement') {
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = motif === 'basement' ? '#151018' : '#242033';
      ctx.fillRect(120, 38, w - 240, 138);
      ctx.fillStyle = '#0a0610';
      for (let x = 150; x < w - 150; x += 72) ctx.fillRect(x, 74, 38, 58);
      ctx.strokeStyle = '#b7f0ff';
      ctx.strokeRect(120, 38, w - 240, 138);
      drawSign(motif === 'basement' ? 'MANOR BASEMENT' : 'MILDENHALL MANOR', w / 2, 32, '#b7f0ff');
    } else if (motif === 'spudsy') {
      ctx.fillStyle = '#3b1a17';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#f6d743';
      ctx.fillRect(92, 42, w - 184, 92);
      ctx.fillStyle = '#ff4d4d';
      ctx.fillRect(118, 58, w - 236, 22);
      drawSign("SPUDSY'S", w / 2, 70, '#ffffff');
      ctx.fillStyle = '#251308';
      ctx.fillRect(70, horizon + 48, w - 140, 42);
    } else if (motif === 'micro') {
      drawTent();
      for (let i = 0; i < 5; i++) drawSign('IDEA', 120 + i * 98, 60 + (i % 2) * 36, i % 2 ? '#ff4fb8' : '#7df0ff');
    } else if (motif === 'softball' || motif === 'guns') {
      ctx.fillStyle = motif === 'softball' ? '#173416' : '#201310';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = motif === 'softball' ? '#83ff57' : '#f6d743';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, horizon + 84, 96, 0, Math.PI * 2);
      ctx.stroke();
      drawSign(motif === 'softball' ? 'SOFTBALL' : 'GUNS ARENA', w / 2, 36, ctx.strokeStyle);
    } else if (motif === 'lake') {
      ctx.fillStyle = '#114071';
      ctx.fillRect(0, 0, w, horizon);
      ctx.fillStyle = '#ffe57d';
      ctx.beginPath();
      ctx.arc(w - 110, 54, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4ee7ff';
      for (let y = horizon; y < h; y += 18) {
        ctx.fillRect(0, y + Math.sin(y / 13 + skyPulse) * 3, w, 2);
      }
      drawSign('DIGITAL LAKE', w / 2, 36, '#4ee7ff');
    } else if (motif === 'memory') {
      ctx.fillStyle = '#0e0e12';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 18; i++) {
        ctx.fillStyle = i % 2 ? '#d9d0a2' : '#7df0ff';
        ctx.globalAlpha = 0.18;
        ctx.fillRect(40 + (i * 43) % (w - 80), 42 + (i * 31) % 130, 32, 18);
      }
      ctx.globalAlpha = 1;
      drawSign('MEMORY BUFFER', w / 2, 34, '#d9d0a2');
    } else if (motif === 'archive') {
      ctx.fillStyle = '#0c0614';
      ctx.fillRect(0, 0, w, h);
      for (let y = 54; y < 170; y += 42) {
        for (let x = 96; x < w - 80; x += 58) {
          ctx.strokeStyle = '#c875ff';
          ctx.strokeRect(x, y, 34, 28);
        }
      }
      drawSign('MEMBER ARCHIVE', w / 2, 34, '#c875ff');
    }
  },

  getCircusPhysicalDoors(state) {
    return state.room?.doors || [];
  },

  getCircusProjectedFloorY(depth, h) {
    const horizon = h * 0.48;
    const floorHeight = h - horizon;
    const cameraHeight = 0.42;
    const projectedY = horizon + floorHeight * (cameraHeight / Math.max(0.18, depth));
    return Math.max(horizon + 1, Math.min(h - 12, projectedY));
  },

  projectCircusPoint(obj, state, w, h) {
    const point = this.resolveCircusWorldPoint(obj, state);
    const dx = point.x - state.player.x;
    const dz = point.z - state.player.z;
    const sin = Math.sin(state.player.a);
    const cos = Math.cos(state.player.a);
    const rx = -dx * sin + dz * cos;
    const rz = dx * cos + dz * sin;
    if (rz <= 0.18) return null;
    const fov = state.fov || Math.PI / 3.05;
    const halfFovTangent = Math.tan(fov / 2);
    if (Math.abs(rx / rz) > halfFovTangent * 1.42) return null;
    const fovScale = w / (2 * Math.max(0.32, halfFovTangent));
    const worldDistance = Math.hypot(dx, dz);
    const scale = 2.25 / rz;
    const floorY = this.getCircusProjectedFloorY(rz, h);
    const architecture = this.getCircusArchitecture(state);
    const wallScreenHeight = (h * architecture.wallScale) / Math.max(0.18, rz);
    const anchor = obj.anchor || (obj.kind === 'ceilinglight' ? 'ceiling' : obj.kind === 'wallart' ? 'wall' : 'floor');
    let projectedY = floorY;
    if (anchor === 'ceiling') projectedY = floorY - wallScreenHeight * 0.9;
    else if (anchor.startsWith('wall') && obj.kind !== 'roomdoor') projectedY = floorY - wallScreenHeight * 0.52;
    const viewAngle = Math.atan2(state.player.z - point.z, state.player.x - point.x);
    let facingScale = 1;
    if (obj.anchor === 'wall-left') facingScale = Math.max(0.12, Math.abs(Math.cos(viewAngle)));
    else if (obj.anchor === 'wall-right') facingScale = Math.max(0.12, Math.abs(Math.cos(viewAngle + Math.PI)));
    return {
      x: w / 2 + (rx / rz) * fovScale,
      y: projectedY,
      depth: rz,
      distance: worldDistance,
      scale: Math.min(2.7, Math.max(0.035, scale)),
      facingScale,
      anchor
    };
  },

  applyCircusDepthClip(ctx, box, depth, state, tolerance = 0.16, options = {}) {
    const buffer = state.wallDepthBuffer;
    if (!buffer?.length || !box || depth <= 0) return true;
    const left = Math.max(0, Math.floor(box.x));
    const right = Math.min(buffer.length - 1, Math.ceil(box.x + box.w));
    if (right < left) return false;
    const runs = [];
    let runStart = null;
    let runTop = box.y;
    let runBottom = box.y + box.h;
    const closeRun = end => {
      if (runStart === null) return;
      runs.push([runStart, end, runTop, runBottom]);
      runStart = null;
    };
    for (let x = left; x <= right; x++) {
      const wallDepth = buffer[x];
      const inFront = !Number.isFinite(wallDepth) || depth <= wallDepth + tolerance;
      const wallTop = state.wallTopBuffer?.[x] ?? box.y;
      const visibleTop = box.y;
      const visibleBottom = inFront ? box.y + box.h
        : options.allowAboveWall ? Math.min(box.y + box.h, wallTop) : box.y;
      const visible = visibleBottom > visibleTop + 0.5;
      if (!visible) {
        closeRun(x);
        continue;
      }
      const roundedBottom = Math.round(visibleBottom);
      if (runStart === null) {
        runStart = x;
        runTop = visibleTop;
        runBottom = roundedBottom;
      } else if (Math.abs(runBottom - roundedBottom) > 1) {
        closeRun(x);
        runStart = x;
        runTop = visibleTop;
        runBottom = roundedBottom;
      }
      if (x === right) closeRun(x + 1);
    }
    if (!runs.length) return false;
    ctx.beginPath();
    runs.forEach(([start, end, top, bottom]) => ctx.rect(start, top, Math.max(1, end - start), Math.max(1, bottom - top)));
    ctx.clip();
    return true;
  },

  getCircusDepthLight(depth, state, fullbright = false) {
    if (fullbright) return 1;
    const motif = (state.scenes[state.currentZoneId] || state.scenes[2])?.motif || 'circus';
    const darkMotifs = new Set(['cellar', 'manor', 'basement', 'hell', 'memory', 'archive', 'archivebedroom', 'training']);
    const brightMotifs = new Set(['grounds', 'candy', 'route', 'lake', 'lighthouse', 'softball', 'snow', 'carnival', 'void']);
    const ambient = darkMotifs.has(motif) ? 0.42 : brightMotifs.has(motif) ? 0.78 : 0.6;
    const range = Math.max(6, (state.room?.size || 15) * 0.72);
    const falloff = Math.max(0, Math.min(1, 1 - depth / range));
    return ambient + (1 - ambient) * falloff;
  },

  getCircusBedroomProps(zoneId) {
    const room = this.getCircusBedroomDefinitions()[zoneId];
    if (!room) return null;
    if (this.isCircusBedroomArchived(room)) {
      return [
        { kind: 'bed', x: 0.7, z: -2.35, color: this.shadeHex(room.color, 0.72), accent: room.accent },
        { kind: 'archive', x: -1.55, z: -2.15, color: room.color, label: room.resident },
        { kind: 'memory', x: -0.85, z: -1.25, color: room.accent, label: room.resident },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: -1.4, color: '#8b8794' }
      ];
    }
    const shared = [
      { kind: 'bed', x: 0.65, z: -2.45, color: room.color, accent: room.accent },
      { kind: 'desk', x: -1.7, z: -2.0, color: this.shadeHex(room.color, 0.72) },
      { kind: 'card', x: -1.2, z: -1.15, color: room.accent, label: `${room.resident} personal item` },
      { kind: 'ceilinglight', anchor: 'ceiling', fixture: zoneId === 47 ? 'panel' : 'chandelier', x: 0, z: -1.1, color: room.accent }
    ];
    if (zoneId === 46) {
      shared.push({ kind: 'wallart', anchor: 'wall-left', wallSurface: 'outer', x: 0, z: -1.4, color: '#78a8e8', art: 'blocks' });
      shared.push({ kind: 'crate', x: 1.95, z: -1.1, color: '#8b5a3c', label: 'toybox' });
    } else if (zoneId === 47) {
      shared.push({ kind: 'card', x: 1.65, z: -1.2, color: '#e53935', label: 'drawings' });
      shared.push({ kind: 'wallart', anchor: 'wall-right', wallSurface: 'outer', x: 0, z: -1.4, color: '#f7f7f7', art: 'spiral' });
    } else if (zoneId === 48) {
      shared.push({ kind: 'crate', x: 1.8, z: -1.2, color: '#7df0ff', label: 'Zooble Box' });
      shared.push({ kind: 'wallart', anchor: 'wall-left', wallSurface: 'outer', x: 0, z: -1.7, color: '#ff4fb8', art: 'blocks' });
      shared.push({ kind: 'wallart', anchor: 'wall-right', wallSurface: 'outer', x: 0, z: -1.7, color: '#7df0ff', art: 'spiral' });
    } else if (zoneId === 49) {
      shared.push({ kind: 'memory', x: 1.8, z: -1.2, color: '#d9d0a2', label: 'Queenie memory' });
      shared.push({ kind: 'candle', x: -0.35, z: -1.25, color: '#ffd84a' });
    } else if (zoneId === 45) {
      shared.push({ kind: 'wallart', anchor: 'wall-right', wallSurface: 'outer', x: 0, z: -1.6, color: '#2a58d8', art: 'blocks' });
    } else if (zoneId === 44) {
      shared.push({ kind: 'barrel', x: 1.8, z: -1.2, color: '#ffd84a', label: 'barrel of monkeys' });
    }
    return shared;
  },

  getCircusZoneProps(zoneId) {
    this.circusZonePropsCache = this.circusZonePropsCache || new Map();
    if (this.circusZonePropsCache.has(zoneId)) return [
      ...this.circusZonePropsCache.get(zoneId),
      ...this.getCircusCustomAdventureProps(zoneId)
    ];
    const bedroomProps = this.getCircusBedroomProps(zoneId);
    if (bedroomProps) {
      this.circusZonePropsCache.set(zoneId, bedroomProps);
      return [...bedroomProps, ...this.getCircusCustomAdventureProps(zoneId)];
    }
    const basePillars = [
      { kind: 'pillar', x: -2.9, z: -1.4, color: '#ffd84a' },
      { kind: 'pillar', x: 2.9, z: -1.4, color: '#2a58d8' },
      { kind: 'pillar', x: -3.15, z: -3.1, color: '#e53935' },
      { kind: 'pillar', x: 3.15, z: -3.1, color: '#ffd84a' }
    ];
    const byZone = {
      2: [...basePillars, { kind: 'ring', x: 0, z: -2.9, color: '#7df0ff' }, { kind: 'spotlight', x: -1.8, z: -2.2, color: '#fff1a8' }, { kind: 'spotlight', x: 1.8, z: -2.2, color: '#fff1a8' }, { kind: 'balloon', x: -0.8, z: -1.35, color: '#ff4fb8' }],
      3: [{ kind: 'tent', x: 0, z: -3.0, color: '#e53935' }, { kind: 'balloon', x: -2.3, z: -2.2, color: '#ff4fb8' }, { kind: 'balloon', x: 2.3, z: -2.4, color: '#7df0ff' }, { kind: 'ring', x: 0, z: -1.45, color: '#ffd84a' }, { kind: 'candy', x: 3.0, z: -2.95, color: '#ff9b37' }],
      4: [{ kind: 'crate', x: -1.8, z: -2.0, color: '#56505f' }, { kind: 'eye', x: 0.9, z: -2.7, color: '#ff3333' }, { kind: 'crate', x: 2.2, z: -1.7, color: '#33333a' }, { kind: 'barrel', x: -0.35, z: -1.25, color: '#26232d' }, { kind: 'stairs', x: 2.75, z: -2.75, color: '#4d4a58' }, { kind: 'candle', x: -2.7, z: -2.75, color: '#ffd84a', label: 'Lampe de secours' }],
      5: [{ kind: 'exitframe', x: 0, z: -3.1, color: '#ffffff' }, { kind: 'desk', x: -1.5, z: -2.1, color: '#a0a8b8' }, { kind: 'exitframe', x: 2.25, z: -2.2, color: '#ffffff' }, { kind: 'console', x: -2.65, z: -1.35, color: '#b8d7ff' }],
      6: [{ kind: 'candy', x: -2.2, z: -2.2, color: '#ff9b37' }, { kind: 'truck', x: 0.4, z: -2.8, color: '#ffd84a' }, { kind: 'candy', x: 2.3, z: -1.8, color: '#ff4fb8' }, { kind: 'barrel', x: -0.9, z: -1.25, color: '#ffcf75' }, { kind: 'candy', x: 3.1, z: -2.75, color: '#7df0ff' }],
      7: [{ kind: 'console', x: -1.6, z: -2.2, color: '#9cff6d' }, { kind: 'gridnode', x: 1.4, z: -2.6, color: '#7df0ff' }, { kind: 'gridnode', x: -0.1, z: -1.35, color: '#ff7a30' }, { kind: 'archive', x: 2.7, z: -2.0, color: '#9cff6d' }],
      8: [{ kind: 'building', style: 'manor', x: 0, z: -3.85, width: 4.6, depth: 2.1, height: 4.8, roofHeight: 1.35, color: '#403044', accent: '#b7f0ff' }, { kind: 'window', x: -2.2, z: -2.5, color: '#b7f0ff' }, { kind: 'table', x: 0.2, z: -2.9, color: '#7c88a1' }, { kind: 'candle', x: 1.8, z: -1.9, color: '#ffd84a' }, { kind: 'window', x: 2.7, z: -2.65, color: '#b7f0ff' }, { kind: 'candle', x: -0.85, z: -1.4, color: '#ffd84a' }],
      9: [{ kind: 'stairs', x: 0, z: -2.8, color: '#7c88a1' }, { kind: 'barrel', x: -2.1, z: -1.9, color: '#56505f' }, { kind: 'barrel', x: 1.95, z: -1.75, color: '#3a3542' }, { kind: 'candle', x: -0.6, z: -1.25, color: '#ffd84a' }],
      10: [{ kind: 'counter', x: 0, z: -2.7, color: '#f6d743' }, { kind: 'menu', x: -1.9, z: -2.3, color: '#ff4d4d' }, { kind: 'menu', x: 1.9, z: -2.3, color: '#ff4d4d' }, { kind: 'table', x: -2.65, z: -1.35, color: '#f6d743' }, { kind: 'counter', x: 2.75, z: -1.4, color: '#ffffff' }],
      11: [{ kind: 'card', x: -1.8, z: -2.1, color: '#ff4fb8' }, { kind: 'card', x: 0, z: -2.7, color: '#7df0ff' }, { kind: 'card', x: 1.8, z: -2.1, color: '#ffd84a' }, { kind: 'doorframe', x: -2.9, z: -2.9, color: '#c875ff' }, { kind: 'gridnode', x: 2.9, z: -1.3, color: '#7df0ff' }],
      12: [{ kind: 'base', x: 0, z: -2.6, color: '#ffffff' }, { kind: 'scoreboard', x: 0, z: -3.25, color: '#83ff57' }, { kind: 'base', x: -1.45, z: -1.6, color: '#ffffff' }, { kind: 'base', x: 1.45, z: -1.6, color: '#ffffff' }, { kind: 'spotlight', x: 2.8, z: -2.75, color: '#fff1a8' }],
      13: [{ kind: 'target', x: -1.8, z: -2.3, color: '#f6d743' }, { kind: 'target', x: 1.8, z: -2.3, color: '#ff4d4d' }, { kind: 'target', x: 0, z: -3.05, color: '#ffffff' }, { kind: 'crate', x: -2.9, z: -1.35, color: '#5c3a21' }, { kind: 'barrel', x: 2.85, z: -1.35, color: '#463228' }],
      14: [{ kind: 'umbrella', x: -1.8, z: -2.1, color: '#ffd84a' }, { kind: 'wave', x: 0, z: -3.0, color: '#4ee7ff' }, { kind: 'sun', x: 2.4, z: -2.8, color: '#ffe57d' }, { kind: 'umbrella', x: 1.65, z: -1.35, color: '#ff9b37' }, { kind: 'wave', x: -2.95, z: -2.85, color: '#4ee7ff' }],
      15: [{ kind: 'console', x: 0, z: -2.7, color: '#ffcf75' }, { kind: 'gridnode', x: -2.0, z: -2.0, color: '#7df0ff' }, { kind: 'table', x: 1.75, z: -1.6, color: '#ffffff' }, { kind: 'card', x: 2.75, z: -2.45, color: '#ffcf75' }],
      16: [
        { kind: 'desk', x: 0, z: -2.9, color: '#ff7a30' },
        { kind: 'console', x: -2.0, z: -2.2, color: '#7df0ff' },
        { kind: 'eye', x: 2.1, z: -2.2, color: '#ff3333' },
        { kind: 'gridnode', x: 0.95, z: -1.35, color: '#ff7a30' },
        { kind: 'archive', x: -2.9, z: -1.4, color: '#7df0ff' },
        {
          kind: 'lorebillboard', avatar: 'paintedmasks', label: 'Painted Masks', x: -2.75, z: -3.35,
          color: '#f7f7f7', loreGate: { episode: 8, subepisode: 7 },
          loreText: "Cinq peintures de masques de Gangle apparaissent pendant son tourment. Elles restent des images de scene, pas cinq nouveaux personnages."
        },
        {
          kind: 'lorebillboard', avatar: 'zoobleparts', label: 'Body Parts and Mirrors', x: 2.75, z: -3.35,
          color: '#ff4fb8', loreGate: { episode: 8, subepisode: 7 },
          loreText: "Des pieces de Zooble et deux miroirs noirs composent son tourment. CainOS les classe comme assemblage de decor, pas comme PNJ."
        },
        {
          kind: 'lorebillboard', avatar: 'stabbedragdolls', label: 'Stabbed Ragdolls', x: -1.75, z: -4.35,
          color: '#d55a5a', sizeScale: 0.84, loreGate: { episode: 8, subepisode: 7 },
          loreText: "Poupees de chiffon transpercees de la sequence de tourment. Objet de scene silencieux, sans identite individuelle."
        },
        {
          kind: 'lorebillboard', avatar: 'coiledcentipedes', label: 'Coiled Centipedes', x: 1.75, z: -4.35,
          color: '#8b6d35', sizeScale: 0.84, loreGate: { episode: 8, subepisode: 7 },
          loreText: "Centipedes enroules de la sequence de tourment. CainOS les classe comme decor et non comme personnages."
        },
        {
          kind: 'lorebillboard', avatar: 'unusedbrainscans', label: 'Unused Brainscans', x: 0, z: -5.1,
          color: '#50d9ff', sizeScale: 0.9, loreGate: { episode: 9, subepisode: 6 },
          loreText: "Scans cerebraux inutilises des archives C&A de Remember. Artefacts techniques sans conscience autonome."
        }
      ],
      17: [{ kind: 'memory', x: -1.8, z: -2.0, color: '#d9d0a2' }, { kind: 'memory', x: 0, z: -2.6, color: '#7df0ff' }, { kind: 'memory', x: 1.8, z: -2.0, color: '#d9d0a2' }, { kind: 'table', x: 0.55, z: -1.35, color: '#d9d0a2' }, { kind: 'candle', x: -2.75, z: -1.4, color: '#ffd84a' }],
      18: [...basePillars, { kind: 'spotlight', x: 0, z: -2.6, color: '#e53935' }, { kind: 'archive', x: -2.2, z: -2.25, color: '#c875ff' }, { kind: 'gridnode', x: 2.2, z: -1.45, color: '#ff4d4d' }],
      19: [
        { kind: 'archive', x: -2.0, z: -2.1, color: '#c875ff' },
        { kind: 'archive', x: 0, z: -2.7, color: '#7df0ff' },
        { kind: 'archive', x: 2.0, z: -2.1, color: '#ffd84a' },
        { kind: 'card', x: -3.0, z: -1.35, color: '#ff4fb8' },
        { kind: 'card', x: 3.0, z: -1.35, color: '#ffd84a' },
        {
          kind: 'lorebillboard', avatar: 'abigailbrooks', label: 'Abigail Brooks', x: -3.15, z: -3.7,
          color: '#f2c7b5', loreGate: { episode: 9, subepisode: 7 },
          loreText: "Contrepartie humaine de Pomni. Projection externe revelee par Caine; Abigail n est pas une residente physique du Cirque."
        },
        {
          kind: 'lorebillboard', avatar: 'suzieackerman', label: 'Suzie J. Ackerman', x: -1.9, z: -3.7,
          color: '#9b6b52', loreGate: { episode: 9, subepisode: 7 },
          loreText: "Contrepartie humaine de Ragatha. Cette image vient de la presentation finale et ne represente pas un PNJ de simulation."
        },
        {
          kind: 'lorebillboard', avatar: 'zoeyraghavan', label: 'Zoey Raghavan', x: -0.65, z: -3.7,
          color: '#9b3f49', loreGate: { episode: 9, subepisode: 7 },
          loreText: "Contrepartie humaine de Gangle. CainOS conserve son profil comme projection du monde reel uniquement."
        },
        {
          kind: 'lorebillboard', avatar: 'rileyverselis', label: 'Riley Verselis', x: 0.65, z: -3.7,
          color: '#687287', loreGate: { episode: 9, subepisode: 7 },
          loreText: "Contrepartie humaine de Zooble. Le profil est une archive visuelle externe, pas un resident du Cirque."
        },
        {
          kind: 'lorebillboard', avatar: 'grantbest', label: 'Grant Best', x: 1.9, z: -3.7,
          color: '#7d668b', loreGate: { episode: 9, subepisode: 7 },
          loreText: "Contrepartie humaine de Kinger. La projection montre sa vie reelle sans faire entrer Grant dans la simulation."
        },
        {
          kind: 'lorebillboard', avatar: 'leeroymateo', label: 'Leeroy Mateo', x: 3.15, z: -3.7,
          color: '#41516a', loreGate: { episode: 9, subepisode: 7 },
          loreText: "Contrepartie humaine de Jax. CainOS l indexe apres la revelation finale, sans le faire apparaitre comme PNJ actif."
        },
        {
          kind: 'lorebillboard', avatar: 'jaxfather', label: 'Jax - Father', x: -5.6, z: -4.8,
          color: '#26303d', sizeScale: 0.86, loreGate: { episode: 9, subepisode: 4 },
          loreText: "Silhouette du pere evoque par Jax. Son nom, son visage et son apparence detaillee restent inconnus; cette archive n est pas un PNJ physique."
        },
        {
          kind: 'lorebillboard', avatar: 'jaxmother', label: 'Jax - Mother', x: -2.8, z: -4.8,
          color: '#9ca3af', sizeScale: 0.86, loreGate: { episode: 9, subepisode: 4 },
          loreText: "Silhouette parasitee de la mere evoquee par Jax. CainOS conserve seulement la forme montree et ne lui invente aucune identite."
        },
        {
          kind: 'lorebillboard', avatar: 'abigailfriendone', label: 'Abigail - Friend A', x: 0, z: -4.8,
          color: '#66715d', sizeScale: 0.86, loreGate: { episode: 9, subepisode: 7 },
          loreText: "Ami non nomme visible dans les videos recentes d Abigail. Il appartient au monde reel et ne peut pas apparaitre comme PNJ de simulation."
        },
        {
          kind: 'lorebillboard', avatar: 'abigailfriendtwo', label: 'Abigail - Friend B', x: 2.8, z: -4.8,
          color: '#356a4b', sizeScale: 0.86, loreGate: { episode: 9, subepisode: 7 },
          loreText: "Second ami non nomme visible avec Abigail. Aucune biographie ni aucun nom propre ne sont ajoutes par CainOS."
        },
        {
          kind: 'lorebillboard', avatar: 'bestchildren', label: 'Anne and Sam Best', x: 5.6, z: -4.8,
          color: '#a0675f', sizeScale: 0.86, loreGate: { episode: 9, subepisode: 7 },
          loreText: "Les deux filles de Grant et Destiny. La projection les conserve en duo car la scene ne permet pas d associer surement chaque prenom a un visage."
        },
        {
          kind: 'lorebillboard', avatar: 'creditsfish', label: 'Credits Fish', x: 0, z: -5.8,
          color: '#ef6d62', sizeScale: 0.72, loreGate: { episode: 9, subepisode: 7 },
          loreText: "Poisson rouge-orange visible dans le generique de Remember. Aucun nom propre ni dialogue n est confirme."
        }
      ],
      20: [
        { kind: 'roomdoor', avatar: 'jax', label: 'JAX', side: 'left', anchor: 'wall-left', x: -1.48, z: 3.2, color: '#8a4fd6', target: 44 },
        { kind: 'roomdoor', avatar: 'pomni', label: 'POMNI', side: 'right', anchor: 'wall-right', x: 1.48, z: 3.2, color: '#e53935', target: 45 },
        { kind: 'roomdoor', avatar: 'ragatha', label: 'RAGATHA', side: 'left', anchor: 'wall-left', x: -1.48, z: 0, color: '#d64545', target: 46 },
        { kind: 'roomdoor', avatar: 'gangle', label: 'GANGLE', side: 'right', anchor: 'wall-right', x: 1.48, z: 0, color: '#f7f7f7', target: 47 },
        { kind: 'roomdoor', avatar: 'zooble', label: 'ZOOBLE', side: 'left', anchor: 'wall-left', x: -1.48, z: -3.2, color: '#ff4fb8', target: 48 },
        { kind: 'roomdoor', avatar: 'kinger', label: 'KINGER', side: 'right', anchor: 'wall-right', x: 1.48, z: -3.2, color: '#d9d0a2', target: 49 },
        { kind: 'wallart', anchor: 'wall-left', x: -1.48, z: 1.55, color: '#7df0ff', art: 'spiral' },
        { kind: 'wallart', anchor: 'wall-right', x: 1.48, z: -1.55, color: '#ffd84a', art: 'blocks' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: 3.2, color: '#fff1a8' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: 0, color: '#fff1a8' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: -3.2, color: '#fff1a8' }
      ],
      21: [{ kind: 'counter', x: 0, z: -2.8, color: '#d49a62' }, { kind: 'table', x: -2.2, z: -1.8, color: '#7a4b32' }, { kind: 'table', x: 2.15, z: -1.9, color: '#7a4b32' }, { kind: 'menu', x: 0, z: -1.25, color: '#fff1a8' }],
      22: [{ kind: 'window', x: -2.6, z: -2.65, color: '#63d9ff' }, { kind: 'window', x: 0, z: -3.1, color: '#7df0ff' }, { kind: 'window', x: 2.6, z: -2.65, color: '#63d9ff' }, { kind: 'wave', x: -1.25, z: -1.45, color: '#4ee7ff' }, { kind: 'wave', x: 1.35, z: -1.55, color: '#4ee7ff' }],
      23: [{ kind: 'stairs', x: 0, z: -3.0, color: '#e8f7ff' }, { kind: 'pillar', x: -2.5, z: -2.2, color: '#a7c9df' }, { kind: 'pillar', x: 2.5, z: -2.2, color: '#a7c9df' }, { kind: 'spotlight', x: 0.8, z: -1.35, color: '#ffffff' }],
      24: [{ kind: 'target', x: -2.2, z: -2.35, color: '#c4a45f' }, { kind: 'target', x: 2.15, z: -2.25, color: '#ff4d4d' }, { kind: 'crate', x: -0.7, z: -1.4, color: '#5c3a21' }, { kind: 'barrel', x: 1.1, z: -1.3, color: '#463228' }, { kind: 'window', x: 0, z: -3.15, color: '#7df0ff' }],
      25: [{ kind: 'table', x: -2.25, z: -2.15, color: '#f2e7ed' }, { kind: 'table', x: 0, z: -2.75, color: '#f2e7ed' }, { kind: 'table', x: 2.25, z: -2.15, color: '#f2e7ed' }, { kind: 'card', x: -1.15, z: -1.25, color: '#ff9fcd' }, { kind: 'card', x: 1.15, z: -1.25, color: '#8bc8ff' }],
      26: [{ kind: 'building', style: 'whitehouse', x: 0, z: -3.9, width: 5.3, depth: 2.1, height: 3.65, roofHeight: 0.65, color: '#edf0f7', accent: '#44699a' }, { kind: 'desk', x: 0, z: -2.85, color: '#edf0f7' }, { kind: 'doorframe', x: -2.55, z: -2.35, color: '#44699a' }, { kind: 'doorframe', x: 2.55, z: -2.35, color: '#44699a' }, { kind: 'table', x: 0, z: -1.35, color: '#d8dce7' }, { kind: 'card', x: 1.55, z: -1.45, color: '#e53935' }],
      27: [{ kind: 'exitframe', x: 0, z: -3.2, color: '#ffffff' }, { kind: 'eye', x: -2.7, z: -2.3, color: '#e53935' }, { kind: 'eye', x: 2.7, z: -2.3, color: '#2a58d8' }],
      28: [{ kind: 'table', x: 0, z: -2.7, color: '#ffd84a' }, { kind: 'balloon', x: -2.4, z: -2.2, color: '#ff4fb8' }, { kind: 'balloon', x: 2.4, z: -2.2, color: '#7df0ff' }, { kind: 'ring', x: 0, z: -1.25, color: '#fff1a8' }],
      29: [{ kind: 'doorframe', x: -2.6, z: -2.5, color: '#e53935' }, { kind: 'doorframe', x: 0, z: -3.1, color: '#7df0ff' }, { kind: 'doorframe', x: 2.6, z: -2.5, color: '#ffd84a' }, { kind: 'ring', x: -1.2, z: -1.35, color: '#ff4fb8' }, { kind: 'ring', x: 1.2, z: -1.35, color: '#2a58d8' }],
      30: [{ kind: 'table', x: 0, z: -2.6, color: '#6e527f' }, { kind: 'window', x: 0, z: -3.15, color: '#63d9ff' }, { kind: 'card', x: -2.25, z: -1.75, color: '#ff4fb8' }],
      31: [{ kind: 'stairs', x: 0, z: -2.9, color: '#7a5a3d' }, { kind: 'window', x: -2.3, z: -2.2, color: '#e8d6a8' }, { kind: 'window', x: 2.3, z: -2.2, color: '#e8d6a8' }, { kind: 'table', x: 0, z: -1.35, color: '#5a3c28' }, { kind: 'archive', campaignTarget: 'gloinknest', label: 'Nid Gloink', x: -1.65, z: -1.45, color: '#7348ff' }, { kind: 'card', campaignTarget: 'zooblepart', label: 'Piece de Zooble', portable: true, x: 1.65, z: -1.45, color: '#ff4fb8' }],
      32: [{ kind: 'building', style: 'palace', x: 0, z: -4.05, width: 4.8, depth: 2.2, height: 4.4, roofHeight: 1.7, color: '#ff9ad5', accent: '#7d3f8c' }, { kind: 'stairs', x: 0, z: -3.0, color: '#fff1a8' }, { kind: 'pillar', x: -2.4, z: -2.2, color: '#ff9ad5' }, { kind: 'pillar', x: 2.4, z: -2.2, color: '#ff9ad5' }, { kind: 'candy', x: -1.3, z: -1.35, color: '#ffd84a' }, { kind: 'candy', x: 1.3, z: -1.35, color: '#7df0ff' }],
      33: [{ kind: 'truck', x: 0, z: -3.0, color: '#ffd84a' }, { kind: 'candy', x: -2.8, z: -2.3, color: '#ff4fb8' }, { kind: 'candy', x: 2.8, z: -2.3, color: '#ff9b37' }, { kind: 'barrel', x: -1.5, z: -1.35, color: '#ffcf75' }],
      34: [{ kind: 'candle', x: -2.3, z: -2.2, color: '#ff4d32' }, { kind: 'candle', x: 2.3, z: -2.2, color: '#ff4d32' }, { kind: 'eye', x: 0, z: -3.05, color: '#ffffff' }, { kind: 'stairs', x: 0.9, z: -1.35, color: '#5a0b0b' }],
      35: [{ kind: 'counter', x: 0, z: -2.8, color: '#d9d4c7' }, { kind: 'menu', x: -2.25, z: -2.2, color: '#f6d743' }, { kind: 'menu', x: 2.25, z: -2.2, color: '#ff4d4d' }, { kind: 'barrel', x: -1.25, z: -1.3, color: '#e0b24d' }],
      36: [{ kind: 'window', x: 0, z: -2.8, color: '#91d4bb' }, { kind: 'doorframe', x: -2.0, z: -2.0, color: '#ffffff' }, { kind: 'doorframe', x: 2.0, z: -2.0, color: '#ffffff' }, { kind: 'barrel', x: 0, z: -1.25, color: '#c7d8d2' }],
      37: [{ kind: 'menu', x: 0, z: -3.0, color: '#e53935' }, { kind: 'spotlight', x: 0, z: -2.1, color: '#ffffff' }, { kind: 'table', x: 0, z: -1.35, color: '#342525' }],
      38: [{ kind: 'scoreboard', x: 0, z: -3.2, color: '#ffd84a' }, { kind: 'spotlight', x: -2.2, z: -2.35, color: '#fff1a8' }, { kind: 'spotlight', x: 2.2, z: -2.35, color: '#fff1a8' }, { kind: 'stairs', x: 0, z: -1.35, color: '#8b172b' }],
      39: [{ kind: 'lighthouse', x: 0, z: -3.45, radius: 0.68, height: 6.8, roofHeight: 1.1, color: '#ff5b4d', accent: '#ffffff' }, { kind: 'stairs', x: 0, z: -2.1, color: '#ffffff' }, { kind: 'wave', x: -2.5, z: -2.45, color: '#4ee7ff' }, { kind: 'wave', x: 2.5, z: -2.45, color: '#4ee7ff' }],
      40: [{ kind: 'archive', x: 0, z: -2.9, color: '#ffd84a' }, { kind: 'wave', x: -2.3, z: -2.1, color: '#4ee7ff' }, { kind: 'wave', x: 2.3, z: -2.1, color: '#4ee7ff' }, { kind: 'eye', x: -1.1, z: -1.35, color: '#ffffff' }, { kind: 'eye', x: 1.1, z: -1.35, color: '#ffffff' }],
      41: [{ kind: 'desk', x: -2.1, z: -2.3, color: '#59616a' }, { kind: 'doorframe', x: 0, z: -3.1, color: '#8fa6ba' }, { kind: 'window', x: 2.2, z: -2.3, color: '#d8e4ee' }, { kind: 'card', x: 0.8, z: -1.35, color: '#ff7a30' }],
      42: [{ kind: 'ring', x: -2.5, z: -2.4, color: '#ff4fb8' }, { kind: 'ring', x: 2.5, z: -2.4, color: '#7df0ff' }, { kind: 'pillar', x: 0, z: -3.1, color: '#ffd84a' }, { kind: 'balloon', x: -1.25, z: -1.35, color: '#e53935' }, { kind: 'balloon', x: 1.25, z: -1.35, color: '#2a58d8' }],
      43: [{ kind: 'table', x: 0, z: -2.7, color: '#7a4b32' }, { kind: 'table', x: -2.2, z: -1.8, color: '#7a4b32' }, { kind: 'table', x: 2.2, z: -1.8, color: '#7a4b32' }, { kind: 'menu', x: 0, z: -1.25, color: '#fff1a8' }],
      50: [
        { kind: 'roomdoor', avatar: 'kaufmo', label: 'KAUFMO', side: 'left', anchor: 'wall-left', x: -1.48, z: 3.2, color: '#e53935', target: 52, archived: true },
        { kind: 'roomdoor', avatar: 'queenie', label: 'QUEENIE', side: 'right', anchor: 'wall-right', x: 1.48, z: 3.2, color: '#f7eecb', target: 53, archived: true },
        { kind: 'roomdoor', avatar: 'ribbit', label: 'RIBBIT', side: 'left', anchor: 'wall-left', x: -1.48, z: 0, color: '#4ee77e', target: 54, archived: true },
        { kind: 'roomdoor', avatar: 'scratch', label: 'SCRATCH', side: 'right', anchor: 'wall-right', x: 1.48, z: 0, color: '#d6a82c', target: 55, archived: true },
        { kind: 'roomdoor', avatar: 'wormo', label: 'WORMO', side: 'left', anchor: 'wall-left', x: -1.48, z: -3.2, color: '#ef8b45', target: 56, archived: true },
        { kind: 'roomdoor', avatar: 'bizco', label: 'BIZCO', side: 'right', anchor: 'wall-right', x: 1.48, z: -3.2, color: '#b45cff', target: 57, archived: true },
        { kind: 'archive', x: 0, z: -4.25, color: '#c875ff', label: 'WEST ANNEX' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: 0, color: '#8b8794' }
      ],
      51: [
        { kind: 'roomdoor', avatar: 'rattie', label: 'RATTIE', side: 'left', anchor: 'wall-left', x: -1.48, z: 3.2, color: '#897765', target: 58, archived: true },
        { kind: 'roomdoor', avatar: 'spike', label: 'SPIKE', side: 'right', anchor: 'wall-right', x: 1.48, z: 3.2, color: '#8d5cff', target: 59, archived: true },
        { kind: 'roomdoor', avatar: 'pinkcyclops', label: 'PINK CYCLOPS', side: 'left', anchor: 'wall-left', x: -1.48, z: 0, color: '#ff80bd', target: 60, archived: true },
        { kind: 'roomdoor', avatar: 'yellowclown', label: 'YELLOW CLOWN', side: 'right', anchor: 'wall-right', x: 1.48, z: 0, color: '#d6a82c', target: 61, archived: true },
        { kind: 'roomdoor', avatar: 'oyster', label: 'OYSTER', side: 'left', anchor: 'wall-left', x: -1.48, z: -3.2, color: '#8fb7ff', target: 62, archived: true },
        { kind: 'roomdoor', avatar: 'bulbcreature', label: 'BULB CREATURE', side: 'right', anchor: 'wall-right', x: 1.48, z: -3.2, color: '#7caa42', target: 63, archived: true },
        { kind: 'archive', x: 0, z: -4.25, color: '#c875ff', label: 'EAST ANNEX' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: 0, color: '#8b8794' }
      ],
      64: [{ kind: 'stairs', x: 0, z: -3.0, color: '#756a78' }, { kind: 'window', x: -2.5, z: -2.4, color: '#b7f0ff' }, { kind: 'window', x: 2.5, z: -2.4, color: '#b7f0ff' }, { kind: 'candle', x: -1.2, z: -1.35, color: '#ffd878' }, { kind: 'pillar', x: 1.5, z: -1.5, color: '#60546a' }],
      65: [{ kind: 'archive', x: 0, z: -3.0, color: '#8a7890' }, { kind: 'crate', x: -2.1, z: -2.0, color: '#4b382d' }, { kind: 'crate', x: 2.1, z: -2.0, color: '#4b382d' }, { kind: 'candle', x: 0, z: -1.25, color: '#ffd878' }],
      66: [{ kind: 'stairs', x: 0, z: -3.0, color: '#fff1a8' }, { kind: 'pillar', x: -2.35, z: -2.25, color: '#ff9ad5' }, { kind: 'pillar', x: 2.35, z: -2.25, color: '#ff9ad5' }, { kind: 'window', x: 0, z: -2.75, color: '#7df0ff' }, { kind: 'candy', x: -1.15, z: -1.3, color: '#ffd84a' }],
      67: [{ kind: 'ring', x: 0, z: -2.8, color: '#fff1a8' }, { kind: 'window', x: -2.25, z: -2.2, color: '#70a7ff' }, { kind: 'window', x: 2.25, z: -2.2, color: '#70a7ff' }, { kind: 'spotlight', x: 0, z: -1.35, color: '#ffd84a' }, { kind: 'candy', x: 1.45, z: -1.4, color: '#ff4fb8' }],
      68: [{ kind: 'stairs', x: 0, z: -3.05, color: '#ffffff' }, { kind: 'window', x: -2.1, z: -2.2, color: '#4ee7ff' }, { kind: 'window', x: 2.1, z: -2.2, color: '#4ee7ff' }, { kind: 'pillar', x: 0, z: -1.45, color: '#ff5b4d' }],
      69: [{ kind: 'spotlight', x: 0, z: -2.7, color: '#fff1a8' }, { kind: 'console', x: -1.7, z: -1.7, color: '#ff5b4d' }, { kind: 'window', x: 1.8, z: -2.0, color: '#4ee7ff' }, { kind: 'stairs', x: 0, z: -1.2, color: '#ffffff' }]
    };
    let props = [
      ...(byZone[zoneId] || basePillars),
      ...this.getCircusExtraZoneProps(zoneId),
      ...this.getCircusArchitectureProps(zoneId)
    ];
    const campaignPropAdditions = {
      18: [{ kind: 'memory', x: 0.75, z: -1.5, color: '#7df0ff', label: 'Brain scan fragment' }],
      26: [{ kind: 'console', x: 2.35, z: -1.45, color: '#7df0ff', label: 'Suggestion console' }],
      31: [
        { kind: 'gloinknest', x: 0, z: -3.15, color: '#ff7aa8', label: 'Gloink Queen nest' },
        { kind: 'zooblepart', x: -1.6, z: -1.45, color: '#ff4fb8', label: 'Piece de Zooble', portable: true }
      ],
      37: [{ kind: 'archive', x: 2.2, z: -1.6, color: '#7df0ff', label: 'Spudsy archive' }],
      41: [{ kind: 'memory', x: 0.65, z: -1.45, color: '#c875ff', label: 'Human memory fragment' }]
    };
    (campaignPropAdditions[zoneId] || []).forEach(addition => {
      if (!props.some(prop => prop.kind === addition.kind && prop.label === addition.label)) props.push(addition);
    });
    if (zoneId === 2) {
      const adventurePortal = this.getCircusCainePortalProp();
      if (adventurePortal) props.push(adventurePortal);
    }
    if (zoneId === 20) {
      const jaxRoom = this.getCircusBedroomDefinitions()[44];
      if (this.isCircusBedroomArchived(jaxRoom)) {
        props = props.map(prop => prop.kind === 'roomdoor' && prop.target === 44 ? { ...prop, archived: true } : prop);
      }
    }
    this.circusZonePropsCache.set(zoneId, props);
    return [...props, ...this.getCircusCustomAdventureProps(zoneId)];
  },

  getCircusCustomAdventureProps(zoneId) {
    const adventure = this.circusDoom?.customAdventure;
    if (!adventure?.active || adventure.complete || adventure.zoneId !== zoneId) return [];
    const packs = {
      markers: [
        { kind: 'gridnode', x: -2.4, z: -2.0, color: '#7df0ff', label: 'Balise atelier' },
        { kind: 'gridnode', x: 2.4, z: -2.0, color: '#ff4fb8', label: 'Balise atelier' }
      ],
      crates: [
        { kind: 'crate', x: -2.3, z: -2.2, color: '#8b5a3c', label: 'Caisse atelier', portable: true },
        { kind: 'barrel', x: 2.25, z: -2.0, color: '#56505f', label: 'Accessoire atelier' }
      ],
      lights: [
        { kind: 'spotlight', x: -2.1, z: -2.3, color: '#fff1a8', label: 'Projecteur atelier' },
        { kind: 'spotlight', x: 2.1, z: -2.3, color: '#7df0ff', label: 'Projecteur atelier' }
      ]
    };
    return (packs[adventure.propPack] || []).map((prop, index) => ({ ...prop, customAdventure: true, customId: `${adventure.id}:prop:${index}` }));
  },

  getCircusArchitectureProps(zoneId) {
    const fixtures = {
      2: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'stage', x: -2.4, z: 0.5, color: '#fff1a8' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'stage', x: 2.4, z: 0.5, color: '#fff1a8' }
      ],
      5: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: 0, z: -1.2, color: '#e9f2ff' }],
      8: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'chandelier', x: 0, z: -0.4, color: '#ffd878' },
        { kind: 'wallart', anchor: 'wall-left', wallSurface: 'outer', x: 0, z: -1.8, color: '#7c88a1', art: 'blocks' }
      ],
      9: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: -0.8, color: '#d9d0a2' }],
      10: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: -1.8, z: -0.4, color: '#ffffff' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: 1.8, z: -0.4, color: '#ffffff' },
        { kind: 'wallart', anchor: 'wall-right', wallSurface: 'outer', x: 0, z: -1.8, color: '#ff4d4d', art: 'blocks' }
      ],
      15: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: 0, z: -1.2, color: '#f7f7ff' }],
      16: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: -1.6, z: -0.8, color: '#7df0ff' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: 1.6, z: -0.8, color: '#ff7a30' }
      ],
      21: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'chandelier', x: 0, z: -0.8, color: '#ffd878' },
        { kind: 'wallart', anchor: 'wall-left', wallSurface: 'outer', x: 0, z: -1.5, color: '#d49a62', art: 'spiral' }
      ],
      25: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: -1.7, z: -0.8, color: '#ffffff' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: 1.7, z: -0.8, color: '#ffffff' }
      ],
      26: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'chandelier', x: 0, z: -0.8, color: '#fff1a8' }],
      32: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'chandelier', x: 0, z: -0.8, color: '#fff1a8' },
        { kind: 'wallart', anchor: 'wall-right', wallSurface: 'outer', x: 0, z: -1.8, color: '#ff9ad5', art: 'spiral' }
      ],
      35: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: -1.5, z: -0.5, color: '#ffffff' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: 1.5, z: -0.5, color: '#ffffff' }
      ],
      36: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: 0, z: -0.8, color: '#e8fff9' }],
      37: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'fluorescent', x: 0, z: -0.8, color: '#f2f2f2' }],
      38: [
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'stage', x: -2.3, z: -0.5, color: '#ffd84a' },
        { kind: 'ceilinglight', anchor: 'ceiling', fixture: 'stage', x: 2.3, z: -0.5, color: '#ffd84a' }
      ],
      43: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'chandelier', x: 0, z: -0.8, color: '#fff1a8' }],
      64: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'chandelier', x: 0, z: -0.5, color: '#ffd878' }],
      65: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: -0.8, color: '#756a78' }],
      66: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'chandelier', x: 0, z: -0.7, color: '#fff1a8' }],
      67: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'stage', x: 0, z: -0.6, color: '#ffd84a' }],
      68: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'panel', x: 0, z: -0.5, color: '#fff1a8' }],
      69: [{ kind: 'ceilinglight', anchor: 'ceiling', fixture: 'stage', x: 0, z: -0.6, color: '#fff1a8' }]
    };
    return fixtures[zoneId] || [];
  },

  getCircusExtraZoneProps(zoneId) {
    const extras = {
      2: [
        { kind: 'balloon', x: -3.35, z: -0.95, color: '#ff4fb8' },
        { kind: 'card', x: 3.35, z: -1.05, color: '#7df0ff' }
      ],
      3: [
        { kind: 'ring', x: -3.2, z: -1.1, color: '#ffd84a' },
        { kind: 'candy', x: 3.15, z: -1.35, color: '#ff9b37' }
      ],
      4: [
        { kind: 'eye', x: -2.7, z: -1.2, color: '#ff3333' },
        { kind: 'barrel', x: 2.85, z: -1.15, color: '#56505f' }
      ],
      5: [
        { kind: 'exitframe', x: 2.15, z: -1.35, color: '#ffffff' },
        { kind: 'desk', x: -2.65, z: -1.25, color: '#a0a8b8' }
      ],
      6: [
        { kind: 'candy', x: -3.1, z: -1.15, color: '#ff4fb8' },
        { kind: 'truck', x: 2.8, z: -1.35, color: '#ffd84a' }
      ],
      7: [
        { kind: 'console', x: -3.0, z: -1.15, color: '#9cff6d' },
        { kind: 'gridnode', x: 3.0, z: -1.15, color: '#7df0ff' }
      ],
      8: [
        { kind: 'candle', x: -3.1, z: -1.15, color: '#ffd84a' },
        { kind: 'window', x: 3.05, z: -1.2, color: '#b7f0ff' }
      ],
      9: [
        { kind: 'stairs', x: -3.0, z: -1.15, color: '#4d4a58' },
        { kind: 'barrel', x: 3.05, z: -1.15, color: '#26232d' }
      ],
      10: [
        { kind: 'counter', x: -3.05, z: -1.05, color: '#f6d743' },
        { kind: 'menu', x: 3.1, z: -1.15, color: '#ff4d4d' }
      ],
      11: [
        { kind: 'card', x: -3.2, z: -1.05, color: '#ff4fb8' },
        { kind: 'card', x: 3.2, z: -1.05, color: '#ffd84a' }
      ],
      12: [
        { kind: 'base', x: -3.15, z: -1.0, color: '#ffffff' },
        { kind: 'base', x: 3.15, z: -1.0, color: '#ffffff' }
      ],
      13: [
        { kind: 'target', x: -3.15, z: -1.05, color: '#f6d743' },
        { kind: 'target', x: 3.15, z: -1.05, color: '#ff4d4d' }
      ],
      14: [
        { kind: 'umbrella', x: -3.2, z: -1.15, color: '#ffd84a' },
        { kind: 'wave', x: 3.05, z: -1.2, color: '#4ee7ff' }
      ],
      15: [
        { kind: 'card', x: -3.05, z: -1.1, color: '#ffffff' },
        { kind: 'console', x: 3.05, z: -1.15, color: '#ffcf75' }
      ],
      16: [
        { kind: 'console', x: 2.95, z: -1.15, color: '#7df0ff' },
        { kind: 'gridnode', x: -3.0, z: -1.1, color: '#ff7a30' }
      ],
      17: [
        { kind: 'memory', x: -3.0, z: -1.15, color: '#d9d0a2' },
        { kind: 'memory', x: 3.0, z: -1.15, color: '#7df0ff' }
      ],
      18: [
        { kind: 'archive', x: -3.05, z: -1.1, color: '#c875ff' },
        { kind: 'spotlight', x: 3.05, z: -1.2, color: '#fff1a8' }
      ],
      19: [
        { kind: 'archive', x: -3.2, z: -1.05, color: '#c875ff' },
        { kind: 'archive', x: 3.2, z: -1.05, color: '#ffd84a' }
      ]
    };
    return extras[zoneId] || [];
  },

  getCircusWorldGeometryKinds() {
    return new Set(['ring', 'base', 'stairs', 'table', 'counter', 'desk', 'bed', 'pillar', 'crate', 'barrel', 'tent', 'building', 'tower', 'lighthouse']);
  },

  projectCircusPropGroundVertex(prop, offsetX, offsetZ, state, w, h, height = 0) {
    const center = this.resolveCircusWorldPoint(prop, state);
    const point = this.projectCircusFloorPoint(
      center.x + offsetX,
      center.z + offsetZ,
      state,
      w,
      h,
      h * 0.48,
      state.fov || Math.PI / 3.05
    );
    if (!point) return null;
    const angle = state.player.a;
    const dx = center.x + offsetX - state.player.x;
    const dz = center.z + offsetZ - state.player.z;
    const forward = dx * Math.cos(angle) + dz * Math.sin(angle);
    return {
      ...point,
      depth: forward,
      y: point.y - (h * height * 0.34) / Math.max(0.28, forward)
    };
  },

  getCircusWorldPropDimensions(prop, state) {
    if (prop.kind === 'ring') {
      const centered = Math.abs(prop.x || 0) < 0.35;
      const scale = state.currentZoneId === 2 && centered ? 1 : centered ? 0.62 : 0.34;
      return {
        outerX: 2.15 * scale,
        outerZ: 1.35 * scale,
        innerX: 1.82 * scale,
        innerZ: 1.06 * scale,
        height: 0.12 * Math.max(0.7, scale)
      };
    }
    if (prop.kind === 'building') {
      return {
        width: prop.width || 4.2,
        depth: prop.depth || 2.2,
        height: prop.height || 4.2,
        roofHeight: prop.roofHeight || 1.1
      };
    }
    if (prop.kind === 'tower' || prop.kind === 'lighthouse') {
      return {
        radius: prop.radius || 0.72,
        topRadius: (prop.radius || 0.72) * (prop.kind === 'lighthouse' ? 0.72 : 0.86),
        height: prop.height || (prop.kind === 'lighthouse' ? 6.6 : 5.2),
        roofHeight: prop.roofHeight || 0.9,
        segments: 12
      };
    }
    return {
      table: { width: 1.35, depth: 0.82, height: 0.52, apron: 0.1 },
      counter: { width: 1.9, depth: 0.72, height: 0.86, apron: 0.26 },
      desk: { width: 1.5, depth: 0.78, height: 0.74, apron: 0.2 },
      bed: { width: 1.35, depth: 2.05, height: 0.48, apron: 0.32 },
      pillar: { radius: 0.28, height: 2.05, segments: 10 },
      barrel: { radius: 0.34, height: 0.72, segments: 10 },
      crate: { width: 0.72, depth: 0.72, height: 0.66 },
      tent: {
        width: prop.width || 3.8,
        depth: prop.depth || 2.7,
        wallHeight: prop.wallHeight || 1.75,
        roofHeight: prop.roofHeight || 4.4
      }
    }[prop.kind] || null;
  },

  drawCircusGroundPolygon(ctx, points, fill, stroke, lineWidth = 1) {
    if (!points?.length || points.some(point => !point)) return false;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    return true;
  },

  drawCircusBuildingGeometry(ctx, prop, state, w, h, color, light) {
    const dimensions = this.getCircusWorldPropDimensions(prop, state);
    const halfW = dimensions.width / 2;
    const halfD = dimensions.depth / 2;
    const corners = [[-halfW, -halfD], [halfW, -halfD], [halfW, halfD], [-halfW, halfD]];
    const bottom = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h));
    const top = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h, dimensions.height));
    if (!bottom.every(Boolean) || !top.every(Boolean)) return;
    const faces = bottom.map((point, index) => {
      const next = (index + 1) % bottom.length;
      return { depth: (point.depth + bottom[next].depth) / 2, points: [point, bottom[next], top[next], top[index]], index };
    }).sort((a, b) => b.depth - a.depth);
    faces.forEach(face => {
      const faceLight = face.index % 2 === 0 ? 0.72 : 0.56;
      this.drawCircusGroundPolygon(ctx, face.points, this.shadeHex(color, faceLight), '#130c18', 1);
    });

    const roofColor = prop.style === 'manor' ? '#17101c'
      : prop.style === 'whitehouse' ? '#44699a'
        : prop.accent || '#7d3f8c';
    const ridgeNear = this.projectCircusPropGroundVertex(prop, 0, -halfD, state, w, h, dimensions.height + dimensions.roofHeight);
    const ridgeFar = this.projectCircusPropGroundVertex(prop, 0, halfD, state, w, h, dimensions.height + dimensions.roofHeight);
    if (ridgeNear && ridgeFar) {
      this.drawCircusGroundPolygon(ctx, [top[0], top[1], ridgeNear], this.shadeHex(roofColor, light), '#fff1a855', 1);
      this.drawCircusGroundPolygon(ctx, [top[1], top[2], ridgeFar, ridgeNear], this.shadeHex(roofColor, light * 0.82), '#fff1a855', 1);
      this.drawCircusGroundPolygon(ctx, [top[2], top[3], ridgeFar], this.shadeHex(roofColor, light * 0.72), '#fff1a855', 1);
      this.drawCircusGroundPolygon(ctx, [top[3], top[0], ridgeNear, ridgeFar], this.shadeHex(roofColor, light * 0.9), '#fff1a855', 1);
    }

    const facadeZ = -halfD - 0.012;
    const floors = Math.max(2, Math.min(5, Math.round(dimensions.height / 1.05)));
    const columns = prop.style === 'whitehouse' ? 5 : prop.style === 'palace' ? 4 : 3;
    for (let floor = 0; floor < floors; floor++) {
      const y0 = 0.45 + floor * ((dimensions.height - 0.85) / floors);
      const y1 = Math.min(dimensions.height - 0.22, y0 + 0.42);
      for (let column = 0; column < columns; column++) {
        const centerX = -halfW + ((column + 0.5) / columns) * dimensions.width;
        const windowHalf = Math.min(0.24, dimensions.width / columns * 0.22);
        const window = [
          this.projectCircusPropGroundVertex(prop, centerX - windowHalf, facadeZ, state, w, h, y0),
          this.projectCircusPropGroundVertex(prop, centerX + windowHalf, facadeZ, state, w, h, y0),
          this.projectCircusPropGroundVertex(prop, centerX + windowHalf, facadeZ, state, w, h, y1),
          this.projectCircusPropGroundVertex(prop, centerX - windowHalf, facadeZ, state, w, h, y1)
        ];
        this.drawCircusGroundPolygon(ctx, window, prop.style === 'manor' ? '#b7f0ff99' : '#7df0ffb8', '#fff1a866', 1);
      }
    }
  },

  drawCircusTowerGeometry(ctx, prop, state, w, h, color, light) {
    const dimensions = this.getCircusWorldPropDimensions(prop, state);
    const bottom = [];
    const top = [];
    for (let index = 0; index < dimensions.segments; index++) {
      const angle = (index / dimensions.segments) * Math.PI * 2;
      bottom.push(this.projectCircusPropGroundVertex(
        prop, Math.cos(angle) * dimensions.radius, Math.sin(angle) * dimensions.radius, state, w, h
      ));
      top.push(this.projectCircusPropGroundVertex(
        prop, Math.cos(angle) * dimensions.topRadius, Math.sin(angle) * dimensions.topRadius, state, w, h, dimensions.height
      ));
    }
    if (!bottom.every(Boolean) || !top.every(Boolean)) return;
    const faces = bottom.map((point, index) => {
      const next = (index + 1) % bottom.length;
      return { depth: (point.depth + bottom[next].depth) / 2, points: [point, bottom[next], top[next], top[index]], index };
    }).sort((a, b) => b.depth - a.depth);
    faces.forEach(face => {
      const stripe = prop.kind === 'lighthouse' && Math.floor(face.index / 2) % 2 === 0;
      const faceColor = stripe ? (prop.accent || '#ffffff') : color;
      this.drawCircusGroundPolygon(ctx, face.points, this.shadeHex(faceColor, face.index % 2 ? 0.62 : 0.78), '#1c1118', 1);
    });
    const balcony = top.map((_, index) => {
      const angle = (index / dimensions.segments) * Math.PI * 2;
      return this.projectCircusPropGroundVertex(
        prop, Math.cos(angle) * dimensions.radius * 1.18, Math.sin(angle) * dimensions.radius * 1.18, state, w, h, dimensions.height
      );
    });
    this.drawCircusGroundPolygon(ctx, balcony, this.shadeHex(prop.accent || '#fff1a8', light), '#fff1a8', 1);
    const apex = this.projectCircusPropGroundVertex(prop, 0, 0, state, w, h, dimensions.height + dimensions.roofHeight);
    if (apex) {
      for (let index = 0; index < balcony.length; index++) {
        const next = (index + 1) % balcony.length;
        this.drawCircusGroundPolygon(
          ctx,
          [balcony[index], balcony[next], apex],
          this.shadeHex(index % 2 ? '#23152e' : prop.color || '#ff5b4d', 0.82),
          '#fff1a855',
          1
        );
      }
    }
  },

  drawCircusWorldGeometryProps(ctx, w, h, state) {
    const worldKinds = this.getCircusWorldGeometryKinds();
    const props = this.getCircusZoneProps(state.currentZoneId)
      .filter(prop => !prop.loreGate || this.hasCircusLoreGate(prop.loreGate))
      .map((prop, interactionId) => ({
        ...prop,
        interactionId,
        active: state.activeProps.get(`${state.currentZoneId}:${interactionId}`) === true,
        projected: this.projectCircusPoint(prop, state, w, h)
      }))
      .filter(prop => !state.collectedProps?.has(`${state.currentZoneId}:${prop.interactionId}`) && worldKinds.has(prop.kind) && prop.projected && this.isCircusWorldPointVisible(prop, state, 0.3))
      .sort((a, b) => b.projected.depth - a.projected.depth);

    props.forEach(prop => {
      const depthLight = this.getCircusDepthLight(prop.projected.depth, state, false);
      const light = 0.54 + depthLight * 0.46;
      const color = this.shadeHex(prop.color || '#fff1a8', light);
      ctx.save();
      if (prop.active) {
        ctx.shadowColor = prop.color || '#7df0ff';
        ctx.shadowBlur = 12;
      }

      if (prop.kind === 'building') {
        this.drawCircusBuildingGeometry(ctx, prop, state, w, h, color, light);
      } else if (prop.kind === 'tower' || prop.kind === 'lighthouse') {
        this.drawCircusTowerGeometry(ctx, prop, state, w, h, color, light);
      } else if (prop.kind === 'ring') {
        const { outerX, outerZ, innerX, innerZ, height } = this.getCircusWorldPropDimensions(prop, state);
        const segments = 28;
        for (let index = 0; index < segments; index++) {
          const a0 = (index / segments) * Math.PI * 2;
          const a1 = ((index + 1) / segments) * Math.PI * 2;
          const outer0 = [Math.cos(a0) * outerX, Math.sin(a0) * outerZ];
          const outer1 = [Math.cos(a1) * outerX, Math.sin(a1) * outerZ];
          const inner1 = [Math.cos(a1) * innerX, Math.sin(a1) * innerZ];
          const inner0 = [Math.cos(a0) * innerX, Math.sin(a0) * innerZ];
          const top = [
            this.projectCircusPropGroundVertex(prop, ...outer0, state, w, h, height),
            this.projectCircusPropGroundVertex(prop, ...outer1, state, w, h, height),
            this.projectCircusPropGroundVertex(prop, ...inner1, state, w, h, height),
            this.projectCircusPropGroundVertex(prop, ...inner0, state, w, h, height)
          ];
          const segmentColor = index % 2 === 0 ? color : this.shadeHex('#fff1a8', light);
          const outerSide = [
            this.projectCircusPropGroundVertex(prop, ...outer0, state, w, h),
            this.projectCircusPropGroundVertex(prop, ...outer1, state, w, h),
            top[1],
            top[0]
          ];
          this.drawCircusGroundPolygon(ctx, outerSide, this.shadeHex(segmentColor, 0.55), '#4a1120', 1);
          this.drawCircusGroundPolygon(ctx, top, `${segmentColor}ee`, '#4a1120', 1);
        }
      } else if (prop.kind === 'base') {
        const diamond = [
          this.projectCircusPropGroundVertex(prop, 0, -0.48, state, w, h),
          this.projectCircusPropGroundVertex(prop, 0.48, 0, state, w, h),
          this.projectCircusPropGroundVertex(prop, 0, 0.48, state, w, h),
          this.projectCircusPropGroundVertex(prop, -0.48, 0, state, w, h)
        ];
        this.drawCircusGroundPolygon(ctx, diamond, '#f7f3dd', color, 2);
      } else if (prop.kind === 'pillar' || prop.kind === 'barrel') {
        const dimensions = this.getCircusWorldPropDimensions(prop, state);
        const bottom = [];
        const top = [];
        for (let index = 0; index < dimensions.segments; index++) {
          const angle = (index / dimensions.segments) * Math.PI * 2;
          const x = Math.cos(angle) * dimensions.radius;
          const z = Math.sin(angle) * dimensions.radius;
          bottom.push(this.projectCircusPropGroundVertex(prop, x, z, state, w, h));
          top.push(this.projectCircusPropGroundVertex(prop, x, z, state, w, h, dimensions.height));
        }
        if (bottom.every(Boolean) && top.every(Boolean)) {
          const faces = bottom.map((point, index) => {
            const next = (index + 1) % bottom.length;
            return {
              depth: (point.depth + bottom[next].depth) / 2,
              points: [point, bottom[next], top[next], top[index]],
              index
            };
          }).sort((a, b) => b.depth - a.depth);
          faces.forEach(face => {
            const faceLight = face.index % 2 === 0 ? 0.72 : 0.58;
            this.drawCircusGroundPolygon(ctx, face.points, this.shadeHex(color, faceLight), '#231d2b', 1);
          });
          this.drawCircusGroundPolygon(ctx, top, this.shadeHex(color, 1.08), '#fff1a866', 1);
          if (prop.kind === 'barrel') {
            const bandHeight = dimensions.height * 0.58;
            const band = top.map((_, index) => {
              const angle = (index / dimensions.segments) * Math.PI * 2;
              return this.projectCircusPropGroundVertex(
                prop,
                Math.cos(angle) * dimensions.radius * 1.03,
                Math.sin(angle) * dimensions.radius * 1.03,
                state, w, h, bandHeight
              );
            });
            this.drawCircusGroundPolygon(ctx, band, null, '#d3c6a8', 2);
          }
        }
      } else if (prop.kind === 'bed') {
        const dimensions = this.getCircusWorldPropDimensions(prop, state);
        const halfW = dimensions.width / 2;
        const halfD = dimensions.depth / 2;
        const corners = [[-halfW, -halfD], [halfW, -halfD], [halfW, halfD], [-halfW, halfD]];
        const bottom = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h, 0.1));
        const top = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h, dimensions.height));
        if (bottom.every(Boolean) && top.every(Boolean)) {
          this.drawCircusGroundPolygon(ctx, [bottom[0], bottom[1], top[1], top[0]], this.shadeHex(color, 0.52), '#211d28', 1);
          this.drawCircusGroundPolygon(ctx, [bottom[1], bottom[2], top[2], top[1]], this.shadeHex(color, 0.64), '#211d28', 1);
          this.drawCircusGroundPolygon(ctx, top, this.shadeHex(color, 1.04), '#fff1a866', 1);
          const pillow = [
            this.projectCircusPropGroundVertex(prop, -halfW * 0.72, -halfD * 0.72, state, w, h, dimensions.height + 0.035),
            this.projectCircusPropGroundVertex(prop, halfW * 0.72, -halfD * 0.72, state, w, h, dimensions.height + 0.035),
            this.projectCircusPropGroundVertex(prop, halfW * 0.72, -halfD * 0.32, state, w, h, dimensions.height + 0.035),
            this.projectCircusPropGroundVertex(prop, -halfW * 0.72, -halfD * 0.32, state, w, h, dimensions.height + 0.035)
          ];
          this.drawCircusGroundPolygon(ctx, pillow, this.shadeHex(prop.accent || '#fff1a8', 1.02), '#211d28', 1);
        }
      } else if (prop.kind === 'crate') {
        const dimensions = this.getCircusWorldPropDimensions(prop, state);
        const halfW = dimensions.width / 2;
        const halfD = dimensions.depth / 2;
        const corners = [[-halfW, -halfD], [halfW, -halfD], [halfW, halfD], [-halfW, halfD]];
        const bottom = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h));
        const top = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h, dimensions.height));
        if (bottom.every(Boolean) && top.every(Boolean)) {
          const faces = bottom.map((point, index) => {
            const next = (index + 1) % bottom.length;
            return { depth: (point.depth + bottom[next].depth) / 2, points: [point, bottom[next], top[next], top[index]] };
          }).sort((a, b) => b.depth - a.depth);
          faces.forEach((face, index) => this.drawCircusGroundPolygon(
            ctx, face.points, this.shadeHex(color, index % 2 === 0 ? 0.64 : 0.76), '#211d28', 1
          ));
          this.drawCircusGroundPolygon(ctx, top, this.shadeHex(color, 1.08), '#fff1a855', 1);
        }
      } else if (prop.kind === 'tent') {
        const dimensions = this.getCircusWorldPropDimensions(prop, state);
        const halfW = dimensions.width / 2;
        const halfD = dimensions.depth / 2;
        const corners = [[-halfW, -halfD], [halfW, -halfD], [halfW, halfD], [-halfW, halfD]];
        const bottom = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h));
        const wallTop = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h, dimensions.wallHeight));
        const ridgeNear = this.projectCircusPropGroundVertex(prop, 0, -halfD, state, w, h, dimensions.roofHeight);
        const ridgeFar = this.projectCircusPropGroundVertex(prop, 0, halfD, state, w, h, dimensions.roofHeight);
        if (bottom.every(Boolean) && wallTop.every(Boolean) && ridgeNear && ridgeFar) {
          const wallFaces = bottom.map((point, index) => {
            const next = (index + 1) % bottom.length;
            return { depth: (point.depth + bottom[next].depth) / 2, points: [point, bottom[next], wallTop[next], wallTop[index]], index };
          }).sort((a, b) => b.depth - a.depth);
          wallFaces.forEach(face => this.drawCircusGroundPolygon(
            ctx, face.points, face.index % 2 === 0 ? '#e53935' : '#fff1a8', '#4a1120', 1
          ));
          this.drawCircusGroundPolygon(ctx, [wallTop[0], wallTop[1], ridgeNear], '#2a58d8', '#fff1a8', 1);
          this.drawCircusGroundPolygon(ctx, [wallTop[1], wallTop[2], ridgeFar, ridgeNear], '#e53935', '#fff1a8', 1);
          this.drawCircusGroundPolygon(ctx, [wallTop[2], wallTop[3], ridgeFar], '#ffd84a', '#fff1a8', 1);
          this.drawCircusGroundPolygon(ctx, [wallTop[3], wallTop[0], ridgeNear, ridgeFar], '#2a58d8', '#fff1a8', 1);
        }
      } else if (prop.kind === 'stairs') {
        for (let step = 0; step < 4; step++) {
          const halfW = 0.9 - step * 0.09;
          const nearZ = 0.55 - step * 0.34;
          const farZ = nearZ - 0.3;
          const height = 0.12 + step * 0.16;
          const tread = [
            this.projectCircusPropGroundVertex(prop, -halfW, nearZ, state, w, h, height),
            this.projectCircusPropGroundVertex(prop, halfW, nearZ, state, w, h, height),
            this.projectCircusPropGroundVertex(prop, halfW, farZ, state, w, h, height),
            this.projectCircusPropGroundVertex(prop, -halfW, farZ, state, w, h, height)
          ];
          const riser = [
            this.projectCircusPropGroundVertex(prop, -halfW, nearZ, state, w, h, Math.max(0, height - 0.16)),
            this.projectCircusPropGroundVertex(prop, halfW, nearZ, state, w, h, Math.max(0, height - 0.16)),
            tread[1],
            tread[0]
          ];
          this.drawCircusGroundPolygon(ctx, riser, this.shadeHex(color, 0.52), '#211d28', 1);
          this.drawCircusGroundPolygon(ctx, tread, this.shadeHex(color, 0.72 + step * 0.07), '#fff1a855', 1);
        }
      } else {
        const dimensions = this.getCircusWorldPropDimensions(prop, state);
        const halfW = dimensions.width / 2;
        const halfD = dimensions.depth / 2;
        const corners = [[-halfW, -halfD], [halfW, -halfD], [halfW, halfD], [-halfW, halfD]];
        const feet = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h));
        const apronBottom = corners.map(([x, z]) => this.projectCircusPropGroundVertex(
          prop, x, z, state, w, h, dimensions.height - dimensions.apron
        ));
        const top = corners.map(([x, z]) => this.projectCircusPropGroundVertex(prop, x, z, state, w, h, dimensions.height));
        if (feet.every(Boolean) && apronBottom.every(Boolean) && top.every(Boolean)) {
          ctx.strokeStyle = this.shadeHex(color, 0.55);
          ctx.lineWidth = Math.max(1, 2 / Math.max(0.6, prop.projected.depth));
          feet.forEach((point, index) => {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(apronBottom[index].x, apronBottom[index].y);
            ctx.stroke();
          });
          this.drawCircusGroundPolygon(ctx, [apronBottom[0], apronBottom[1], top[1], top[0]], this.shadeHex(color, 0.5), null);
          this.drawCircusGroundPolygon(ctx, [apronBottom[1], apronBottom[2], top[2], top[1]], this.shadeHex(color, 0.62), null);
          this.drawCircusGroundPolygon(ctx, feet, 'rgba(0,0,0,0.22)', null);
          this.drawCircusGroundPolygon(ctx, top, `${color}e8`, '#fff1a866', 1);
        }
      }
      ctx.restore();
    });
  },

  drawCircusDepthProps(ctx, w, h, state) {
    const worldKinds = this.getCircusWorldGeometryKinds();
    const props = this.getCircusZoneProps(state.currentZoneId)
      .map((prop, interactionId) => ({
        ...prop,
        interactionId,
        active: state.activeProps.get(`${state.currentZoneId}:${interactionId}`) === true,
        projected: this.projectCircusPoint(prop, state, w, h)
      }))
      .filter(prop => !prop.loreGate || this.hasCircusLoreGate(prop.loreGate))
      .filter(prop => !state.collectedProps?.has(`${state.currentZoneId}:${prop.interactionId}`) && prop.projected)
      .sort((a, b) => b.projected.depth - a.projected.depth);
    props.forEach(prop => {
      if (worldKinds.has(prop.kind)) {
        if (this.isCircusWorldPointVisible(prop, state, 0.3)) this.addCircusPropHotspot(state, prop);
        return;
      }
      const box = this.getCircusPropScreenBox(prop);
      const clipBox = {
        x: box.x - box.w * 0.22,
        y: box.y - box.h * 0.48,
        w: box.w * 1.44,
        h: box.h * 1.68
      };
      ctx.save();
      const tolerance = prop.anchor?.startsWith('wall') || prop.anchor === 'ceiling' ? 0.72 : 0.18;
      if (!this.applyCircusDepthClip(ctx, clipBox, prop.projected.depth, state, tolerance)) {
        ctx.restore();
        return;
      }
      const depthLight = this.getCircusDepthLight(prop.projected.depth, state, prop.kind === 'ceilinglight');
      ctx.filter = `brightness(${Math.round((0.58 + depthLight * 0.42) * 100)}%)`;
      if (prop.active) {
        ctx.shadowColor = prop.color || '#7df0ff';
        ctx.shadowBlur = Math.max(6, 18 * prop.projected.scale);
      }
      this.drawCircusProp(ctx, prop, w, h);
      ctx.restore();
      if (this.isCircusWorldPointVisible(prop, state, tolerance)) this.addCircusPropHotspot(state, prop);
    });
  },

  addCircusPropHotspot(state, prop) {
    if (!state || !prop.projected) return;
    const interactionRange = prop.kind === 'roomdoor' ? 1.55 : 2.2;
    if (prop.projected.distance > interactionRange) return;
    const box = this.getCircusPropScreenBox(prop);
    state.hotspots.push({
      kind: 'prop',
      prop,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      depth: prop.projected.depth
    });
  },

  getCircusPropScreenBox(prop) {
    const p = prop.projected;
    const s = this.getCircusPropVisualScale(prop);
    const wideKinds = new Set(['ring', 'counter', 'truck', 'scoreboard', 'table', 'desk', 'exitframe']);
    const tallKinds = new Set(['pillar', 'tent', 'building', 'tower', 'lighthouse', 'spotlight', 'umbrella', 'window', 'archive', 'console', 'roomdoor', 'caineportal', 'wallart', 'ceilinglight', 'lorebillboard']);
    const smallKinds = new Set(['candle', 'balloon', 'eye', 'sun', 'base', 'target', 'memory']);
    let width = 82 * s;
    let height = 86 * s;
    if (wideKinds.has(prop.kind)) width = 122 * s;
    if (tallKinds.has(prop.kind)) height = 126 * s;
    if (smallKinds.has(prop.kind)) {
      width = 62 * s;
      height = 78 * s;
    }
    width = Math.max(4, width * (p.facingScale || 1));
    height = Math.max(6, height);
    const anchorY = p.anchor === 'ceiling' ? (p.y - height * 0.25)
      : p.anchor?.startsWith('wall') && prop.kind !== 'roomdoor' ? (p.y - height * 0.5)
        : (p.y - height);
    return {
      x: p.x - width / 2,
      y: anchorY,
      w: width,
      h: height
    };
  },

  getCircusPropVisualScale(prop) {
    const compactKinds = new Set(['eye', 'sun', 'balloon', 'candle', 'memory', 'base', 'target']);
    const mountedKinds = new Set(['wallart', 'ceilinglight', 'roomdoor', 'caineportal']);
    const cap = compactKinds.has(prop.kind) ? 1.85 : mountedKinds.has(prop.kind) ? 2.2 : 2.7;
    return Math.max(0.035, Math.min(cap, prop.projected?.scale || 0.035));
  },

  drawCircusProp(ctx, prop, w, h) {
    const p = prop.projected;
    const s = this.getCircusPropVisualScale(prop);
    const x = p.x;
    const y = p.y || h * 0.58;
    ctx.save();
    ctx.translate(x, y);
    if (p.facingScale && p.facingScale < 0.999) ctx.scale(p.facingScale, 1);
    ctx.lineWidth = Math.max(1, 2 * s);
    ctx.strokeStyle = prop.color;
    ctx.fillStyle = `${prop.color}cc`;

    if (prop.kind === 'pillar') {
      // Spiral-striped circus tent pillar
      ctx.fillStyle = '#fff1a8'; // White base
      ctx.fillRect(-10 * s, -120 * s, 20 * s, 125 * s);
      // Red spiral stripes
      ctx.fillStyle = '#d62f3f';
      for (let i = 0; i < 6; i++) {
        const stripeY = -120 * s + i * 20 * s;
        ctx.beginPath();
        ctx.moveTo(-10 * s, stripeY);
        ctx.lineTo(10 * s, stripeY + 10 * s);
        ctx.lineTo(10 * s, stripeY + 16 * s);
        ctx.lineTo(-10 * s, stripeY + 6 * s);
        ctx.closePath();
        ctx.fill();
      }
      // Top and bottom gold rings
      ctx.fillStyle = '#ffd84a';
      ctx.fillRect(-14 * s, -125 * s, 28 * s, 10 * s);
      ctx.fillRect(-14 * s, 0, 28 * s, 8 * s);
      ctx.strokeStyle = '#05020d';
      ctx.strokeRect(-14 * s, -125 * s, 28 * s, 10 * s);
      ctx.strokeRect(-14 * s, 0, 28 * s, 8 * s);
    } else if (prop.kind === 'ring') {
      // The Circus Ring baseboard (red base, yellow trim, gold stars)
      ctx.lineWidth = Math.max(2, 4 * s);
      ctx.strokeStyle = '#d62f3f'; // Red ring border
      ctx.beginPath();
      ctx.ellipse(0, -20 * s, 68 * s, 26 * s, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner yellow highlight ring
      ctx.strokeStyle = '#ffd84a';
      ctx.lineWidth = Math.max(1, 1.5 * s);
      ctx.beginPath();
      ctx.ellipse(0, -20 * s, 64 * s, 24 * s, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Mini gold stars drawn on the ring baseboard
      ctx.fillStyle = '#ffd84a';
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const sx = Math.cos(angle) * 64 * s;
        const sz = Math.sin(angle) * 24 * s - 20 * s;
        ctx.beginPath();
        ctx.arc(sx, sz, 3 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (prop.kind === 'spotlight') {
      // Retro stage light fixture on tripod stand
      // Tripod stand
      ctx.strokeStyle = '#333';
      ctx.lineWidth = Math.max(1, 2.5 * s);
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(0, -60 * s); // Central bar
      ctx.moveTo(0, -20 * s); ctx.lineTo(-18 * s, 0); // Left leg
      ctx.moveTo(0, -20 * s); ctx.lineTo(18 * s, 0);  // Right leg
      ctx.stroke();

      // Light housing box
      ctx.fillStyle = '#111';
      ctx.strokeStyle = prop.color;
      ctx.beginPath();
      ctx.arc(0, -64 * s, 10 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Light cone projector
      ctx.fillRect(-12 * s, -74 * s, 24 * s, 10 * s);
      ctx.strokeRect(-12 * s, -74 * s, 24 * s, 10 * s);

      // Semi-transparent yellow light cone projecting downwards
      ctx.fillStyle = 'rgba(255,241,168,0.16)';
      ctx.beginPath();
      ctx.moveTo(0, -70 * s);
      ctx.lineTo(-65 * s, 0);
      ctx.lineTo(65 * s, 0);
      ctx.closePath();
      ctx.fill();
    } else if (['crate', 'barrel', 'counter', 'desk', 'table'].includes(prop.kind)) {
      if (prop.kind === 'crate') {
        // Shipping crate with diagonal cross planks
        ctx.fillStyle = '#9e734c';
        ctx.strokeStyle = '#5a3d1b';
        ctx.fillRect(-32 * s, -64 * s, 64 * s, 64 * s);
        ctx.strokeRect(-32 * s, -64 * s, 64 * s, 64 * s);
        // Planks
        ctx.strokeRect(-26 * s, -58 * s, 52 * s, 52 * s);
        ctx.beginPath();
        ctx.moveTo(-26 * s, -58 * s); ctx.lineTo(26 * s, -6 * s);
        ctx.moveTo(26 * s, -58 * s); ctx.lineTo(-26 * s, -6 * s);
        ctx.stroke();
      } else if (prop.kind === 'barrel') {
        // Detailed wooden barrel with hoops
        ctx.fillStyle = '#7a4e2a';
        ctx.strokeStyle = '#3e240e';
        ctx.beginPath();
        ctx.moveTo(-22 * s, 0);
        ctx.quadraticCurveTo(-30 * s, -28 * s, -22 * s, -56 * s);
        ctx.lineTo(22 * s, -56 * s);
        ctx.quadraticCurveTo(30 * s, -28 * s, 22 * s, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Barrel lines (staves)
        ctx.beginPath();
        for (let i = -1; i <= 1; i++) {
          ctx.moveTo(i * 8 * s, -56 * s);
          ctx.quadraticCurveTo(i * 12 * s, -28 * s, i * 8 * s, 0);
        }
        ctx.stroke();

        // Metal hoops
        ctx.strokeStyle = '#555';
        ctx.lineWidth = Math.max(1, 3 * s);
        ctx.beginPath();
        ctx.moveTo(-24 * s, -14 * s); ctx.lineTo(24 * s, -14 * s);
        ctx.moveTo(-24 * s, -42 * s); ctx.lineTo(24 * s, -42 * s);
        ctx.stroke();
      } else if (prop.kind === 'counter') {
        // Tiled fast food counter with a shiny service bell
        ctx.fillStyle = '#f0f0f5'; // White tiling
        ctx.strokeStyle = '#aaa';
        ctx.fillRect(-52 * s, -48 * s, 104 * s, 48 * s);
        ctx.strokeRect(-52 * s, -48 * s, 104 * s, 48 * s);

        // Counter top slab
        ctx.fillStyle = '#ff4d4d'; // Red Spudsy top
        ctx.fillRect(-56 * s, -56 * s, 112 * s, 8 * s);
        ctx.strokeStyle = '#05020d';
        ctx.strokeRect(-56 * s, -56 * s, 112 * s, 8 * s);

        // Service bell
        ctx.fillStyle = '#ffd84a'; // Gold bell
        ctx.beginPath();
        ctx.arc(0, -61 * s, 6 * s, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.fillRect(-8 * s, -58 * s, 16 * s, 2 * s);
      } else if (prop.kind === 'desk') {
        // Caine's executive/office desk with monitor shape
        ctx.fillStyle = '#4a2f1b'; // Wooden desk
        ctx.fillRect(-48 * s, -38 * s, 96 * s, 38 * s);
        ctx.strokeRect(-48 * s, -38 * s, 96 * s, 38 * s);
        ctx.fillStyle = '#301d0f';
        ctx.fillRect(-44 * s, -38 * s, 22 * s, 38 * s); // Drawer blocks
        ctx.fillRect(22 * s, -38 * s, 22 * s, 38 * s);

        // Desktop items: retro computer monitor
        ctx.fillStyle = '#ccc';
        ctx.fillRect(-12 * s, -58 * s, 24 * s, 18 * s); // screen case
        ctx.strokeRect(-12 * s, -58 * s, 24 * s, 18 * s);
        ctx.fillStyle = '#05020d';
        ctx.fillRect(-9 * s, -55 * s, 18 * s, 12 * s); // screen glass
        ctx.fillStyle = '#ffd84a';
        ctx.fillRect(-2 * s, -40 * s, 4 * s, 4 * s); // stand
      } else {
        // Table with cloth draped
        ctx.fillStyle = '#2b58d8'; // Blue tablecloth
        ctx.beginPath();
        ctx.moveTo(-44 * s, 0);
        ctx.lineTo(-44 * s, -36 * s);
        ctx.lineTo(44 * s, -36 * s);
        ctx.lineTo(44 * s, 0);
        ctx.quadraticCurveTo(0, -12 * s, -44 * s, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Table top wood trim
        ctx.fillStyle = '#ffe57d';
        ctx.fillRect(-46 * s, -42 * s, 92 * s, 6 * s);
        ctx.strokeRect(-46 * s, -42 * s, 92 * s, 6 * s);
      }
    } else if (prop.kind === 'lorebillboard') {
      const spec = this.getCircusAvatarSheetSpec(prop.avatar);
      const img = spec ? this.circusAvatarSheets?.[spec.sheet] : null;
      const frame = spec && img?.complete && img.naturalWidth ? this.getCircusTransparentAvatarFrame(img, spec) : null;
      if (frame) {
        const height = 118 * s * (prop.sizeScale || 1);
        const width = height * (frame.width / frame.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(frame.canvas, -width / 2, -height, width, height);
      } else {
        ctx.fillStyle = `${prop.color || '#7df0ff'}66`;
        ctx.strokeStyle = prop.color || '#7df0ff';
        ctx.fillRect(-26 * s, -92 * s, 52 * s, 92 * s);
        ctx.strokeRect(-26 * s, -92 * s, 52 * s, 92 * s);
      }
    } else if (prop.kind === 'caineportal') {
      const pulse = 0.72 + Math.sin(performance.now() / 180) * 0.18;
      ctx.save();
      ctx.shadowColor = prop.color || '#7df0ff';
      ctx.shadowBlur = Math.max(6, 20 * s * pulse);
      ctx.strokeStyle = prop.accent || '#ffd84a';
      ctx.lineWidth = Math.max(2, 7 * s);
      ctx.beginPath();
      ctx.ellipse(0, -58 * s, 34 * s, 58 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = prop.color || '#7df0ff';
      ctx.lineWidth = Math.max(1, 3 * s);
      for (let ring = 0; ring < 4; ring++) {
        ctx.beginPath();
        ctx.ellipse(0, -58 * s, (27 - ring * 4) * s, (49 - ring * 7) * s, performance.now() / 900 + ring, 0, Math.PI * 2);
        ctx.stroke();
      }
      const gradient = ctx.createRadialGradient(0, -58 * s, 2, 0, -58 * s, 30 * s);
      gradient.addColorStop(0, `${prop.color || '#7df0ff'}cc`);
      gradient.addColorStop(0.55, '#281251cc');
      gradient.addColorStop(1, '#05020dee');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, -58 * s, 27 * s, 48 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff1a8';
      ctx.font = `bold ${Math.max(6, 8 * s)}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText((prop.label || 'AVENTURE').slice(0, 24), 0, 9 * s);
      ctx.restore();
    } else if (prop.kind === 'roomdoor') {
      ctx.fillStyle = '#6b351f';
      ctx.fillRect(-32 * s, -116 * s, 64 * s, 116 * s);
      ctx.strokeStyle = '#32160f';
      ctx.lineWidth = Math.max(1, 3 * s);
      ctx.strokeRect(-32 * s, -116 * s, 64 * s, 116 * s);
      ctx.fillStyle = '#8b4a2a';
      ctx.fillRect(-25 * s, -108 * s, 50 * s, 100 * s);
      ctx.strokeStyle = '#4b2418';
      ctx.strokeRect(-25 * s, -108 * s, 50 * s, 100 * s);
      ctx.fillStyle = '#fff0b8';
      ctx.beginPath();
      ctx.arc(0, -82 * s, 23 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = prop.color;
      ctx.lineWidth = Math.max(1, 3 * s);
      ctx.stroke();
      const spec = this.getCircusAvatarSheetSpec(prop.avatar);
      const img = spec ? this.circusAvatarSheets?.[spec.sheet] : null;
      const frame = spec && img?.complete && img.naturalWidth ? this.getCircusTransparentAvatarFrame(img, spec) : null;
      if (frame) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, -82 * s, 19 * s, 0, Math.PI * 2);
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        const ratio = frame.width / frame.height;
        const iconH = 40 * s;
        const iconW = iconH * ratio;
        ctx.drawImage(frame.canvas, -iconW / 2, -102 * s, iconW, iconH);
        ctx.restore();
      }
      ctx.fillStyle = '#2c1310';
      ctx.fillRect(-24 * s, -51 * s, 48 * s, 16 * s);
      ctx.strokeStyle = '#ffd06a';
      ctx.strokeRect(-24 * s, -51 * s, 48 * s, 16 * s);
      ctx.fillStyle = '#fff0b8';
      ctx.font = `bold ${Math.max(6, 8 * s)}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText(prop.label || 'ROOM', 0, -40 * s);
      ctx.fillStyle = '#ffd84a';
      ctx.beginPath();
      ctx.arc((prop.side === 'left' ? 21 : -21) * s, -22 * s, 3 * s, 0, Math.PI * 2);
      ctx.fill();
      if (prop.archived) {
        ctx.strokeStyle = '#d93131';
        ctx.lineWidth = Math.max(2, 6 * s);
        ctx.beginPath();
        ctx.moveTo(-25 * s, -106 * s);
        ctx.lineTo(25 * s, -57 * s);
        ctx.moveTo(25 * s, -106 * s);
        ctx.lineTo(-25 * s, -57 * s);
        ctx.stroke();
        ctx.fillStyle = '#d93131';
        ctx.font = `bold ${Math.max(6, 7 * s)}px Courier New`;
        ctx.fillText('ARCHIVE', 0, -5 * s);
      }
    } else if (prop.kind === 'wallart') {
      ctx.fillStyle = '#5b2b1e';
      ctx.fillRect(-34 * s, -27 * s, 68 * s, 54 * s);
      ctx.strokeStyle = '#ffd06a';
      ctx.lineWidth = Math.max(1, 3 * s);
      ctx.strokeRect(-34 * s, -27 * s, 68 * s, 54 * s);
      ctx.fillStyle = '#1d1230';
      ctx.fillRect(-27 * s, -20 * s, 54 * s, 40 * s);
      ctx.strokeStyle = prop.color;
      if (prop.art === 'spiral') {
        for (let r = 4; r < 22; r += 5) {
          ctx.beginPath();
          ctx.arc(0, 0, r * s, 0, Math.PI * 1.55);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = prop.color;
        ctx.fillRect(-20 * s, -13 * s, 16 * s, 13 * s);
        ctx.fillStyle = '#ff4fb8';
        ctx.fillRect(2 * s, -5 * s, 19 * s, 17 * s);
        ctx.fillStyle = '#7df0ff';
        ctx.fillRect(-9 * s, 5 * s, 13 * s, 10 * s);
      }
    } else if (prop.kind === 'ceilinglight') {
      const fixture = prop.fixture || 'panel';
      if (fixture === 'chandelier') {
        ctx.strokeStyle = '#4c2c1c';
        ctx.lineWidth = Math.max(1, 2 * s);
        ctx.beginPath();
        ctx.moveTo(0, -28 * s);
        ctx.lineTo(0, 8 * s);
        ctx.moveTo(-30 * s, 8 * s);
        ctx.lineTo(30 * s, 8 * s);
        ctx.stroke();
        [-30, -15, 0, 15, 30].forEach(offset => {
          ctx.fillStyle = 'rgba(255,216,120,0.24)';
          ctx.beginPath();
          ctx.arc(offset * s, 14 * s, 10 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffd878';
          ctx.beginPath();
          ctx.arc(offset * s, 12 * s, 3 * s, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        const length = fixture === 'fluorescent' ? 74 : 56;
        ctx.fillStyle = 'rgba(255,240,184,0.14)';
        ctx.beginPath();
        ctx.moveTo(-length * 0.42 * s, 3 * s);
        ctx.lineTo(length * 0.42 * s, 3 * s);
        ctx.lineTo(length * 0.7 * s, 42 * s);
        ctx.lineTo(-length * 0.7 * s, 42 * s);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = prop.color || '#fff0b8';
        ctx.fillRect(-length * 0.5 * s, -4 * s, length * s, 8 * s);
        ctx.strokeStyle = fixture === 'fluorescent' ? '#68706f' : '#6a2f2a';
        ctx.strokeRect(-length * 0.5 * s, -4 * s, length * s, 8 * s);
      }
    } else if (prop.kind === 'doorframe' || prop.kind === 'exitframe') {
      // Detailed double office doors with glowing "EXIT" sign
      ctx.fillStyle = '#eef';
      ctx.fillRect(-44 * s, -112 * s, 88 * s, 112 * s);
      ctx.strokeRect(-44 * s, -112 * s, 88 * s, 112 * s);
      // Double doors divider
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(0, -112 * s);
      ctx.stroke();

      // Window panes in doors
      ctx.fillStyle = '#9cd';
      ctx.fillRect(-32 * s, -96 * s, 22 * s, 44 * s);
      ctx.fillRect(10 * s, -96 * s, 22 * s, 44 * s);
      ctx.strokeRect(-32 * s, -96 * s, 22 * s, 44 * s);
      ctx.strokeRect(10 * s, -96 * s, 22 * s, 44 * s);

      // Glowing Green Exit Sign above door
      ctx.fillStyle = '#05020d';
      ctx.fillRect(-24 * s, -128 * s, 48 * s, 14 * s);
      ctx.strokeStyle = '#39ff14';
      ctx.strokeRect(-24 * s, -128 * s, 48 * s, 14 * s);
      ctx.fillStyle = '#39ff14';
      ctx.font = `bold ${Math.max(6, 9 * s)}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', 0, -118 * s);
    } else if (prop.kind === 'candy') {
      // Giant swirly lollipop of pink & white
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = Math.max(1, 2.5 * s);
      ctx.fillStyle = '#ff80bd'; // Pink base
      ctx.beginPath();
      ctx.arc(0, -56 * s, 28 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Spiral Swirl inside lollipop
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, 2 * s);
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
        const radius = (angle / (Math.PI * 4)) * 26 * s;
        const sx = Math.cos(angle) * radius;
        const sy = Math.sin(angle) * radius - 56 * s;
        if (angle === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Lollipop stick
      ctx.fillStyle = '#fff1a8';
      ctx.fillRect(-3 * s, -28 * s, 6 * s, 28 * s);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(-3 * s, -28 * s, 6 * s, 28 * s);
    } else if (prop.kind === 'truck') {
      // Gummigoo's syrup tanker truck
      ctx.lineWidth = Math.max(1, 1.5 * s);
      ctx.strokeStyle = '#3e240e';

      // Tanker Cylinder (Back)
      ctx.fillStyle = '#ffe57d'; // yellow syrup tank
      ctx.fillRect(-22 * s, -48 * s, 68 * s, 34 * s);
      ctx.strokeRect(-22 * s, -48 * s, 68 * s, 34 * s);
      ctx.fillStyle = '#ffd84a';
      ctx.beginPath();
      ctx.ellipse(46 * s, -31 * s, 8 * s, 17 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cab (Front)
      ctx.fillStyle = '#d62f3f'; // Red cab
      ctx.fillRect(-52 * s, -42 * s, 30 * s, 28 * s);
      ctx.strokeRect(-52 * s, -42 * s, 30 * s, 28 * s);
      // Windshield
      ctx.fillStyle = '#9cd';
      ctx.fillRect(-50 * s, -39 * s, 10 * s, 14 * s);

      // Wheels
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(-36 * s, -6 * s, 10 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(8 * s, -6 * s, 10 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(32 * s, -6 * s, 10 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // Hubcaps
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-36 * s, -6 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8 * s, -6 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(32 * s, -6 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
    } else if (prop.kind === 'console' || prop.kind === 'gridnode') {
      if (prop.kind === 'console') {
        // Mainframe developer rack with flashing led lights
        ctx.fillStyle = '#151522';
        ctx.fillRect(-24 * s, -76 * s, 48 * s, 76 * s);
        ctx.strokeRect(-24 * s, -76 * s, 48 * s, 76 * s);
        // Servers plates
        ctx.fillStyle = '#222';
        for (let i = 0; i < 4; i++) {
          const sy = -70 * s + i * 18 * s;
          ctx.fillRect(-20 * s, sy, 40 * s, 14 * s);
          ctx.strokeRect(-20 * s, sy, 40 * s, 14 * s);
          // Flashing lights
          const ledOn = (Math.floor(performance.now() / 250) + i) % 3 === 0;
          ctx.fillStyle = ledOn ? (i % 2 === 0 ? '#39ff14' : '#ff3344') : '#111';
          ctx.beginPath();
          ctx.arc(-14 * s, sy + 7 * s, 2 * s, 0, Math.PI * 2);
          ctx.arc(-8 * s, sy + 7 * s, 2 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Rotating debug wireframe cube
        const t = performance.now() / 800;
        ctx.strokeStyle = prop.color;
        ctx.lineWidth = Math.max(1, 1.5 * s);
        ctx.save();
        ctx.translate(0, -42 * s);
        ctx.rotate(t);
        // Draw 3D-like box flat projections
        ctx.strokeRect(-18 * s, -18 * s, 36 * s, 36 * s);
        ctx.strokeRect(-10 * s, -10 * s, 20 * s, 20 * s);
        // Connect corners
        ctx.beginPath();
        ctx.moveTo(-18 * s, -18 * s); ctx.lineTo(-10 * s, -10 * s);
        ctx.moveTo(18 * s, -18 * s); ctx.lineTo(10 * s, -10 * s);
        ctx.moveTo(18 * s, 18 * s); ctx.lineTo(10 * s, 10 * s);
        ctx.moveTo(-18 * s, 18 * s); ctx.lineTo(-10 * s, 10 * s);
        ctx.stroke();
        ctx.restore();
      }
    } else if (prop.kind === 'window' || prop.kind === 'menu' || prop.kind === 'scoreboard' || prop.kind === 'archive' || prop.kind === 'card') {
      if (prop.kind === 'window') {
        // Gothic manor window with pointed arch
        ctx.fillStyle = '#050816'; // Dark night
        ctx.beginPath();
        ctx.moveTo(-24 * s, 0);
        ctx.lineTo(-24 * s, -60 * s);
        ctx.quadraticCurveTo(0, -96 * s, 24 * s, -60 * s);
        ctx.lineTo(24 * s, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Window grates / pane divider lines
        ctx.strokeStyle = '#3e240e';
        ctx.lineWidth = Math.max(1, 2 * s);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, -90 * s);
        ctx.moveTo(-24 * s, -30 * s); ctx.lineTo(24 * s, -30 * s);
        ctx.moveTo(-24 * s, -60 * s); ctx.lineTo(24 * s, -60 * s);
        ctx.stroke();
      } else if (prop.kind === 'menu') {
        // Spudsy's retro fast food menu board
        ctx.fillStyle = '#160905';
        ctx.fillRect(-38 * s, -76 * s, 76 * s, 46 * s);
        ctx.strokeRect(-38 * s, -76 * s, 76 * s, 46 * s);
        // Title banner
        ctx.fillStyle = '#ff4d4d';
        ctx.fillRect(-38 * s, -76 * s, 76 * s, 12 * s);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(5, 7 * s)}px Courier New`;
        ctx.textAlign = 'center';
        ctx.fillText("SPUDSY'S MENU", 0, -68 * s);

        // Pixel food lines
        ctx.fillStyle = '#f6d743';
        ctx.fillRect(-30 * s, -56 * s, 20 * s, 2 * s);
        ctx.fillRect(-30 * s, -48 * s, 16 * s, 2 * s);
        ctx.fillRect(-30 * s, -40 * s, 24 * s, 2 * s);
        ctx.fillStyle = '#ff4d4d';
        ctx.fillRect(18 * s, -56 * s, 10 * s, 2 * s);
        ctx.fillRect(22 * s, -48 * s, 6 * s, 2 * s);
        ctx.fillRect(14 * s, -40 * s, 14 * s, 2 * s);
      } else if (prop.kind === 'scoreboard') {
        // Softball stadium scoreboard
        ctx.fillStyle = '#0f220e';
        ctx.fillRect(-48 * s, -86 * s, 96 * s, 54 * s);
        ctx.strokeRect(-48 * s, -86 * s, 96 * s, 54 * s);
        // Scores
        ctx.fillStyle = '#83ff57';
        ctx.font = `bold ${Math.max(6, 8 * s)}px Courier New`;
        ctx.textAlign = 'center';
        ctx.fillText('INNING  1 2 3 R H E', 0, -74 * s);
        ctx.fillStyle = '#ffd84a';
        ctx.fillText('HOME    0 1 0 1 3 0', 0, -60 * s);
        ctx.fillText('GUEST   0 0 2 2 4 1', 0, -46 * s);
      } else if (prop.kind === 'archive') {
        // Filing archive cabinet with half open drawers
        ctx.fillStyle = '#556';
        ctx.fillRect(-22 * s, -82 * s, 44 * s, 82 * s);
        ctx.strokeRect(-22 * s, -82 * s, 44 * s, 82 * s);

        // Drawers
        ctx.fillStyle = '#445';
        for (let i = 0; i < 3; i++) {
          const dy = -74 * s + i * 26 * s;
          const open = i === 1; // Middle one open
          const offset = open ? 8 * s : 0;
          ctx.fillRect(-18 * s - offset / 2, dy, 36 * s + offset, 20 * s);
          ctx.strokeRect(-18 * s - offset / 2, dy, 36 * s + offset, 20 * s);
          // Handle
          ctx.fillStyle = '#ccc';
          ctx.fillRect(-6 * s - offset / 2, dy + 8 * s, 12 * s, 3 * s);
          if (open) {
            // Document tab poking out
            ctx.fillStyle = '#ffe57d';
            ctx.fillRect(-12 * s, dy - 4 * s, 14 * s, 6 * s);
          }
        }
      } else {
        // Card (suggestion envelope)
        const t = performance.now() / 400;
        const hoverBob = Math.sin(t) * 4 * s;
        ctx.save();
        ctx.translate(0, -42 * s + hoverBob);
        ctx.fillStyle = '#ffeef5';
        ctx.fillRect(-24 * s, -16 * s, 48 * s, 32 * s);
        ctx.strokeRect(-24 * s, -16 * s, 48 * s, 32 * s);
        // Letter folds
        ctx.beginPath();
        ctx.moveTo(-24 * s, -16 * s); ctx.lineTo(0, 0); ctx.lineTo(24 * s, -16 * s);
        ctx.moveTo(-24 * s, 16 * s); ctx.lineTo(0, 0); ctx.lineTo(24 * s, 16 * s);
        ctx.stroke();
        // Envelope seal
        ctx.fillStyle = '#ff4fb8';
        ctx.beginPath(); ctx.arc(0, 0, 4 * s, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    } else if (prop.kind === 'candle') {
      // Melting brass candlestick and flame
      ctx.fillStyle = '#ffd84a'; // Brass stand
      ctx.fillRect(-12 * s, -8 * s, 24 * s, 8 * s);
      ctx.fillRect(-3 * s, -38 * s, 6 * s, 30 * s);
      ctx.strokeRect(-3 * s, -38 * s, 6 * s, 30 * s);

      // Wax melting dripping
      ctx.fillStyle = '#ffeedd'; // Cream candle wax
      ctx.fillRect(-6 * s, -52 * s, 12 * s, 14 * s);
      ctx.fillRect(-8 * s, -44 * s, 4 * s, 8 * s); // drips

      // Flicker flame
      const flicker = 1 + Math.sin(performance.now() / 60) * 0.15;
      ctx.fillStyle = '#ff7a30'; // Orange base
      ctx.beginPath();
      ctx.ellipse(0, -58 * s, 5 * s * flicker, 8 * s * flicker, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd84a'; // Yellow center
      ctx.beginPath();
      ctx.ellipse(0, -56 * s, 3 * s * flicker, 5 * s * flicker, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (prop.kind === 'stairs') {
      // Stone stairs with shadow textures on steps
      for (let i = 0; i < 5; i++) {
        const stepY = (-12 - i * 12) * s;
        const stepW = (100 - i * 20) * s;
        ctx.fillStyle = '#222330';
        ctx.fillRect((-50 + i * 10) * s, stepY, stepW, 12 * s);
        ctx.strokeRect((-50 + i * 10) * s, stepY, stepW, 12 * s);
        // Step tread shadow
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect((-50 + i * 10) * s, stepY, stepW, 4 * s);
      }
    } else if (prop.kind === 'base' || prop.kind === 'target') {
      if (prop.kind === 'base') {
        // Softball diamond base plate
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#888';
        ctx.beginPath();
        ctx.moveTo(0, -6 * s);
        ctx.lineTo(24 * s, -20 * s);
        ctx.lineTo(24 * s, -42 * s);
        ctx.lineTo(-24 * s, -42 * s);
        ctx.lineTo(-24 * s, -20 * s);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Shooting gallery target stand
        ctx.fillStyle = '#5c3a21'; // wooden legs
        ctx.fillRect(-12 * s, -38 * s, 4 * s, 38 * s);
        ctx.fillRect(8 * s, -38 * s, 4 * s, 38 * s);

        // Target bullseye concentric rings
        const colors = ['#ff3344', '#ffffff', '#ff3344', '#ffffff'];
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = colors[i];
          ctx.beginPath();
          ctx.arc(0, -54 * s, (24 - i * 6) * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    } else if (prop.kind === 'umbrella') {
      // Striped beach parasol (alternating cyan & white)
      // Pole
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = Math.max(1, 3 * s);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -96 * s); ctx.stroke();

      // Umbrella top dome
      ctx.lineWidth = Math.max(1, 1.5 * s);
      ctx.strokeStyle = '#333';
      const sections = 6;
      const r = 48 * s;
      for (let i = 0; i < sections; i++) {
        const u1 = i / sections;
        const u2 = (i + 1) / sections;
        ctx.fillStyle = i % 2 === 0 ? '#4ee7ff' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-r + u1 * r * 2, -54 * s);
        ctx.quadraticCurveTo(0, -108 * s, 0, -96 * s);
        ctx.quadraticCurveTo(0, -108 * s, -r + u2 * r * 2, -54 * s);
        ctx.quadraticCurveTo(0, -68 * s, -r + u1 * r * 2, -54 * s);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (prop.kind === 'wave') {
      // Layered crest waves with foam highlight
      ctx.fillStyle = '#4ee7ff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, 2 * s);
      for (let i = 0; i < 3; i++) {
        const wx = (-38 + i * 38) * s;
        ctx.beginPath();
        ctx.arc(wx, -26 * s, 22 * s, Math.PI, 0);
        ctx.fill();
        ctx.stroke();
      }
    } else if (prop.kind === 'sun' || prop.kind === 'eye') {
      if (prop.kind === 'sun') {
        // Goofy beach Sun wearing cool sunglasses
        ctx.fillStyle = '#ffd33d';
        ctx.beginPath(); ctx.arc(0, -76 * s, 26 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Sunglasses (retro black shades)
        ctx.fillStyle = '#111';
        ctx.fillRect(-16 * s, -82 * s, 13 * s, 8 * s);
        ctx.fillRect(3 * s, -82 * s, 13 * s, 8 * s);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(-16 * s, -82 * s, 13 * s, 8 * s);
        ctx.strokeRect(3 * s, -82 * s, 13 * s, 8 * s);
        ctx.beginPath(); ctx.moveTo(-3 * s, -78 * s); ctx.lineTo(3 * s, -78 * s); ctx.stroke(); // bridge

        // Big smile
        ctx.strokeStyle = '#8a4d0f';
        ctx.lineWidth = Math.max(1, 2 * s);
        ctx.beginPath();
        ctx.arc(0, -68 * s, 10 * s, 0, Math.PI);
        ctx.stroke();
      } else {
        // Caine's bloodshot monitoring system eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(0, -76 * s, 24 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Red iris
        ctx.fillStyle = '#ff3344';
        ctx.beginPath(); ctx.arc(0, -76 * s, 11 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Black pupil
        ctx.fillStyle = '#05020d';
        ctx.beginPath(); ctx.arc(0, -76 * s, 5 * s, 0, Math.PI * 2); ctx.fill();

        // Bloodshot lines
        ctx.strokeStyle = 'rgba(255,51,68,0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-20 * s, -76 * s); ctx.lineTo(-12 * s, -74 * s);
        ctx.moveTo(20 * s, -76 * s); ctx.lineTo(12 * s, -78 * s);
        ctx.moveTo(0, -96 * s); ctx.lineTo(-3 * s, -88 * s);
        ctx.stroke();
      }
    } else if (prop.kind === 'memory') {
      // Queenie's floating memory crystal containing a silhouette
      const t = performance.now() / 300;
      const hover = Math.sin(t) * 6 * s;
      ctx.save();
      ctx.translate(0, -46 * s + hover);

      // Diamond glass crystal outer frame
      ctx.fillStyle = 'rgba(125,240,255,0.45)';
      ctx.strokeStyle = '#7df0ff';
      ctx.lineWidth = Math.max(1, 2 * s);
      ctx.beginPath();
      ctx.moveTo(0, -28 * s);
      ctx.lineTo(18 * s, 0);
      ctx.lineTo(0, 28 * s);
      ctx.lineTo(-18 * s, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner chess queen silhouette (Helen / Queenie)
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.beginPath();
      ctx.moveTo(-4 * s, 14 * s); ctx.lineTo(4 * s, 14 * s); // Base
      ctx.lineTo(3 * s, 10 * s); ctx.lineTo(-3 * s, 10 * s);
      ctx.lineTo(-2 * s, -4 * s); ctx.lineTo(2 * s, -4 * s); // Stem
      ctx.lineTo(4 * s, -8 * s); ctx.lineTo(-4 * s, -8 * s); // Crown base
      ctx.lineTo(-5 * s, -14 * s); ctx.lineTo(0, -10 * s); ctx.lineTo(5 * s, -14 * s); // Crown spikes
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (prop.kind === 'tent') {
      // Miniature Digital Circus Big top tent
      ctx.fillStyle = '#d62f3f';
      ctx.beginPath();
      ctx.moveTo(-38 * s, 0);
      ctx.lineTo(-38 * s, -42 * s);
      ctx.lineTo(0, -92 * s); // tent peak
      ctx.lineTo(38 * s, -42 * s);
      ctx.lineTo(38 * s, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // White/Cream stripes on peak
      ctx.fillStyle = '#fff1a8';
      ctx.beginPath();
      ctx.moveTo(0, -92 * s); ctx.lineTo(-24 * s, -42 * s); ctx.lineTo(-12 * s, -42 * s); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -92 * s); ctx.lineTo(24 * s, -42 * s); ctx.lineTo(12 * s, -42 * s); ctx.closePath(); ctx.fill();

      // Tent entrance doors flap
      ctx.fillStyle = '#ffd84a';
      ctx.fillRect(-10 * s, -24 * s, 20 * s, 24 * s);
      ctx.strokeRect(-10 * s, -24 * s, 20 * s, 24 * s);
      ctx.fillStyle = '#05020d';
      ctx.beginPath();
      ctx.moveTo(-10 * s, 0); ctx.quadraticCurveTo(0, -22 * s, 10 * s, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Flag on top
      ctx.strokeStyle = '#ffd84a';
      ctx.lineWidth = Math.max(1, 2 * s);
      ctx.beginPath(); ctx.moveTo(0, -92 * s); ctx.lineTo(0, -106 * s); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(0, -106 * s); ctx.lineTo(12 * s, -100 * s); ctx.lineTo(0, -94 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (prop.kind === 'balloon') {
      // Bunch of colorful balloons tied to a string
      const t = performance.now() / 500;
      const sway = Math.sin(t) * 3 * s;
      ctx.save();
      ctx.translate(sway, 0);

      // Strings
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.quadraticCurveTo(-8 * s, -26 * s, -10 * s, -52 * s);
      ctx.moveTo(0, 0); ctx.quadraticCurveTo(8 * s, -26 * s, 10 * s, -52 * s);
      ctx.moveTo(0, 0); ctx.quadraticCurveTo(0, -26 * s, 0, -52 * s);
      ctx.stroke();

      // Balloons
      const colors = ['#ff4fb8', '#7df0ff', '#ffd84a'];
      const offsets = [
        { x: -10 * s, y: -58 * s },
        { x: 10 * s, y: -58 * s },
        { x: 0 * s, y: -74 * s }
      ];
      colors.forEach((color, idx) => {
        ctx.fillStyle = color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = Math.max(1, 1.5 * s);
        ctx.beginPath();
        ctx.ellipse(offsets[idx].x, offsets[idx].y, 11 * s, 15 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Balloon knot bottom triangle
        ctx.beginPath();
        ctx.moveTo(offsets[idx].x, offsets[idx].y + 15 * s);
        ctx.lineTo(offsets[idx].x - 3 * s, offsets[idx].y + 19 * s);
        ctx.lineTo(offsets[idx].x + 3 * s, offsets[idx].y + 19 * s);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    }
    if (p.distance <= 2.2) {
      ctx.globalAlpha = 0.86;
      ctx.fillStyle = '#fff1a8';
      ctx.strokeStyle = '#05020d';
      ctx.lineWidth = Math.max(1, 1.5 * s);
      const markerY = p.anchor === 'ceiling' ? 38 * s
        : p.anchor?.startsWith('wall') ? -42 * s
          : -Math.max(24, 96 * s);
      ctx.beginPath();
      ctx.arc(0, markerY, Math.max(4, 7 * s), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#05020d';
      ctx.font = `bold ${Math.max(6, 9 * s)}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText('i', 0, markerY + Math.max(2, 3 * s));
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },

  drawCircusPhysicalDoors(ctx, w, h, portals, state) {
    const doors = this.getCircusPhysicalDoors(state)
      .map(door => ({ ...door, projected: this.projectCircusPoint(door, state, w, h) }))
      .filter(door => door.projected)
      .sort((a, b) => b.projected.depth - a.projected.depth);
    const architecture = this.getCircusArchitecture(state);
    doors.forEach(door => {
      const target = portals[door.target];
      if (!target) return;
      const p = door.projected;
      const selected = door.index === state.selectedExitIndex && p.distance < 4.5;
      const locked = !target.unlocked;
      const openProgress = locked ? 0 : this.getCircusDoorOpenProgress(door, state);
      const scale = Math.max(0.035, p.scale);
      const viewLength = Math.max(0.001, p.distance);
      const viewToPlayerX = (state.player.x - door.x) / viewLength;
      const viewToPlayerZ = (state.player.z - door.z) / viewLength;
      const facing = Math.max(0.16, Math.abs(viewToPlayerX * door.inwardX + viewToPlayerZ * door.inwardZ));
      const doorH = Math.min(h * 0.9, (h * architecture.wallScale * 0.76) / Math.max(0.24, p.depth));
      const doorW = doorH * 0.5 * facing;
      if (doorH < 3 || doorW < 1.5) return;
      const x = p.x - doorW / 2;
      const baseY = Math.min(h - 15, p.y || this.getCircusProjectedFloorY(p.depth, h));
      const y = baseY - doorH;
      const doorBox = { x: x - doorW * 0.2, y: y - doorH * 0.1, w: doorW * 1.4, h: doorH * 1.2 };
      ctx.save();
      if (!this.applyCircusDepthClip(ctx, doorBox, p.depth, state, 0.86)) {
        ctx.restore();
        return;
      }
      const doorLight = this.getCircusDepthLight(p.depth, state, false);
      ctx.filter = `brightness(${Math.round((0.58 + doorLight * 0.42) * 100)}%)`;
      if (!state.doorTransition && p.distance <= 1.85 && this.isCircusWorldPointVisible(door, state, 0.82)) {
        state.hotspots.push({ x: x - doorW * 0.12, y, w: doorW * 1.24, h: doorH + Math.max(3, 8 * scale), target: door.target, index: door.index, depth: p.depth });
      }
      ctx.fillStyle = 'rgba(0,0,0,0.44)';
      ctx.beginPath();
      ctx.ellipse(p.x, baseY + Math.max(2, 3 * scale), doorW * 0.66, Math.max(3, 7 * scale), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.46)';
      ctx.fillRect(x - doorW * 0.13, y - doorH * 0.04, doorW * 1.26, doorH * 1.05);
      ctx.fillStyle = locked ? '#14141a' : '#05020d';
      ctx.strokeStyle = selected ? '#ffffff' : (locked ? '#56505f' : target.color);
      ctx.lineWidth = selected ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(x, y + doorH);
      ctx.lineTo(x, y + doorH * 0.25);
      ctx.quadraticCurveTo(p.x, y - doorH * 0.08, x + doorW, y + doorH * 0.25);
      ctx.lineTo(x + doorW, y + doorH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = locked ? 'rgba(120,120,130,0.35)' : `${target.color}88`;
      ctx.lineWidth = Math.max(1, 2 * scale);
      ctx.beginPath();
      ctx.moveTo(x - doorW * 0.12, y + doorH * 0.2);
      ctx.lineTo(x - doorW * 0.12, baseY);
      ctx.moveTo(x + doorW * 1.12, y + doorH * 0.2);
      ctx.lineTo(x + doorW * 1.12, baseY);
      ctx.stroke();
      ctx.fillStyle = locked ? 'rgba(0,0,0,0.5)' : `${target.color}66`;
      const panelGap = doorW * 0.38 * openProgress;
      const panelWidth = doorW * 0.36;
      ctx.fillRect(x + doorW * 0.14 - panelGap, y + doorH * 0.22, panelWidth, doorH * 0.65);
      ctx.fillRect(x + doorW * 0.5 + panelGap, y + doorH * 0.22, panelWidth, doorH * 0.65);
      if (openProgress > 0.05) {
        ctx.fillStyle = `rgba(125,240,255,${0.16 + openProgress * 0.34})`;
        ctx.fillRect(p.x - doorW * 0.08, y + doorH * 0.24, doorW * 0.16, doorH * 0.6);
      }
      ctx.fillStyle = locked ? 'rgba(80,80,90,0.7)' : `${target.color}77`;
      ctx.fillRect(x - doorW * 0.2, baseY - Math.max(4, 7 * scale), doorW * 1.4, Math.max(5, 9 * scale));
      ctx.strokeStyle = 'rgba(255,241,168,0.28)';
      ctx.strokeRect(x - doorW * 0.2, baseY - Math.max(4, 7 * scale), doorW * 1.4, Math.max(5, 9 * scale));
      if (p.distance < 5.5 || selected) {
        ctx.fillStyle = selected ? '#fff1a8' : (locked ? '#8b8794' : target.color);
        ctx.font = `bold ${Math.max(5, Math.min(12, 11 * scale))}px Courier New`;
        ctx.textAlign = 'center';
        ctx.fillText(locked ? 'LOCK' : target.short, p.x, y - Math.max(2, 5 * scale));
      }
      if (p.distance <= 1.85 && !locked) {
        ctx.font = `bold ${Math.max(6, Math.min(11, 8 * scale))}px Courier New`;
        ctx.fillText('ENTREE / CLIC', p.x, y + doorH + Math.max(7, 10 * scale));
      }
      ctx.restore();
    });
  },

  getCircusZoneSprites(zoneId) {
    this.circusZoneSpritesCache = this.circusZoneSpritesCache || new Map();
    if (this.circusZoneSpritesCache.has(zoneId)) return this.circusZoneSpritesCache.get(zoneId);
    const bedroom = this.getCircusBedroomDefinitions()[zoneId];
    if (bedroom) {
      const sprites = this.isCircusBedroomArchived(bedroom) ? [] : [{
        name: bedroom.resident,
        type: bedroom.avatar,
        avatar: bedroom.avatar,
        x: -0.75,
        z: -1.85,
        color: bedroom.color
      }];
      this.circusZoneSpritesCache.set(zoneId, sprites);
      return sprites;
    }
    const shared = [
      { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.2, z: -2.3, color: '#e53935' },
      { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: 1.2, z: -2.55, color: '#d64545' },
      { name: 'Jax', type: 'jax', avatar: 'jax', x: -2.5, z: -1.05, color: '#8a4fd6' },
      { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: 2.5, z: -1.05, color: '#d9d0a2' },
      { name: 'Gangle', type: 'gangle', avatar: 'gangle', x: -0.25, z: -3.05, color: '#f7f7f7' },
      { name: 'Zooble', type: 'zooble', avatar: 'zooble', x: 2.0, z: -2.15, color: '#ff4fb8' }
    ];
    const byZone = {
      2: [{ name: 'Caine', type: 'caine', avatar: 'caine', x: 0.25, z: -2.15, color: '#ffd84a' }, { name: 'Bubble', type: 'bubble', avatar: 'bubble', x: 1.25, z: -1.65, color: '#f7f7ff' }, ...shared],
      3: [
        { name: 'Sun', type: 'npc', avatar: 'sun', x: -2.8, z: -2.2, color: '#ffd84a', sizeScale: 0.9 },
        { name: 'Moon', type: 'npc', avatar: 'moon', x: 2.8, z: -2.25, color: '#d7e6ff', sizeScale: 0.9 },
        { name: 'Gloink Queen', type: 'npc', avatar: 'gloinkqueenscale', x: 0, z: -3.1, color: '#ff7d8d', sizeScale: 2.2 },
        { name: 'Star Gloink', type: 'npc', avatar: 'gloinkstar', x: -1.45, z: -1.55, color: '#7348ff', sizeScale: 0.72 },
        { name: 'Cube Gloink', type: 'npc', avatar: 'gloinkcube', x: 1.45, z: -1.55, color: '#2fb642', sizeScale: 0.72 },
        { name: 'Barrel Monkey', type: 'npc', avatar: 'barrelmonkey', x: 2.55, z: -1.25, color: '#e43c32', sizeScale: 0.72 }
      ],
      4: [
        { name: 'Kaufmo abstrait', type: 'abstract', avatar: 'abstractedkaufmo', x: -0.45, z: -2.45, color: '#050505', sizeScale: 1.35, silent: true, silentText: 'Kaufmo abstrait gronde et crache un parasite multicolore. Aucun mot intelligible.', loreGate: { episode: 1, subepisode: 5 } },
        { name: 'Abstraction du Cellar', type: 'abstract', avatar: 'cellarabstraction', x: 1.65, z: -3.05, color: '#030303', sizeScale: 1.22, silent: true, threatActive: false, silentText: 'La forme abstraite siffle dans le noir. CainOS ne detecte aucune structure de langage.', loreGate: { episode: 1, subepisode: 5 } },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.4, z: -1.7, color: '#e53935' },
        { name: 'Gloink Round', type: 'npc', avatar: 'gloinkround', x: 1.55, z: -1.75, color: '#c4b62d', sizeScale: 0.72 },
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: -2.45, z: -2.35, color: '#d64545' },
        { name: 'Zooble', type: 'zooble', avatar: 'zooble', x: 2.45, z: -2.35, color: '#ff4fb8' }
      ],
      6: [
        { name: 'Gummigoo', type: 'gummigoo', avatar: 'gummigoo', x: -1.05, z: -2.2, color: '#d8a23a' },
        { name: 'Max', type: 'gummigoo', avatar: 'max', x: 0.2, z: -2.55, color: '#75bd3f' },
        { name: 'Chad', type: 'gummigoo', avatar: 'chad', x: 1.25, z: -2.25, color: '#8bd64a' },
        { name: 'Princess Loolilalu', type: 'npc', avatar: 'loolilalu', x: -2.35, z: -1.55, color: '#ff9ad5' },
        { name: 'The Fudge', type: 'npc', avatar: 'fudge', x: 2.35, z: -1.55, color: '#7a3d1a', sizeScale: 1.2 },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 0.75, z: -1.3, color: '#e53935' },
        { name: 'Gummy Elephant', type: 'npc', avatar: 'gummyelephant', x: -3.1, z: -2.95, color: '#ff85b7', sizeScale: 0.88 },
        { name: 'Cookie Butterfly', type: 'npc', avatar: 'cookiebutterfly', x: 2.95, z: -3.15, color: '#ff9e8e', sizeScale: 0.58 },
        { name: 'Gummy Worm', type: 'npc', avatar: 'gummyworm', x: 1.8, z: -3.35, color: '#ef5a94', sizeScale: 0.52 },
        { name: 'Red Mannequin', type: 'mannequin', avatar: 'redmannequin', x: -3.45, z: -3.45, color: '#f33d34', sizeScale: 0.66 },
        { name: 'Yellow Mannequin', type: 'mannequin', avatar: 'yellowmannequin', x: 3.45, z: -3.45, color: '#ffd83f', sizeScale: 0.66 }
      ],
      7: [
        { name: 'Gummigoo Data Echo', type: 'gummigoo', avatar: 'gummigoo', x: -1.5, z: -2.3, color: '#d8a23a' },
        { name: 'C&A Mannequin', type: 'mannequin', avatar: 'mannequin', x: 0.1, z: -2.05, color: '#d8d8d8' }
      ],
      8: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -1.35, z: -2.2, color: '#d9d0a2' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 0.2, z: -2.45, color: '#e53935' },
        { name: 'Martha Mildenhall', type: 'ghost', avatar: 'marthamildenhall', x: 1.65, z: -1.55, color: '#7df0ff' },
        { name: 'Baron Mildenhall', type: 'npc', avatar: 'baronmildenhall', x: 2.55, z: -2.25, color: '#7b8dff', sizeScale: 1.12 },
        { name: 'Angel', type: 'npc', avatar: 'angel', x: -2.75, z: -1.55, color: '#e5d7d7', sizeScale: 1.08 },
        { name: 'Mildenhall Souls', type: 'ghost', avatar: 'mildenhallsouls', x: 0.15, z: -3.15, color: '#77f5da', sizeScale: 0.8 },
        { name: 'Ghostly', type: 'ghost', avatar: 'ghostly', x: 3.15, z: -3.35, color: '#7dffd8', sizeScale: 0.62 }
      ],
      9: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -0.9, z: -2.1, color: '#d9d0a2' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 0.85, z: -2.35, color: '#ffb32c' },
        { name: 'Baron Mildenhall', type: 'npc', avatar: 'baronmildenhall', x: 2.1, z: -1.65, color: '#7b8dff' },
        { name: 'Ghostly', type: 'ghost', avatar: 'ghostly', x: -2.2, z: -1.55, color: '#7dffd8', sizeScale: 0.72 },
        { name: 'Mildenhall Souls', type: 'ghost', avatar: 'mildenhallsouls', x: 0.05, z: -3.05, color: '#77f5da', sizeScale: 0.78 }
      ],
      10: [
        { name: 'Work Gangle', type: 'gangle', avatar: 'workgangle', x: -0.75, z: -2.1, color: '#f7f7f7' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 0.65, z: -2.4, color: '#e53935' },
        { name: 'Albert Spudsy Cutout', type: 'prop', avatar: 'albertspudsy', x: 0.15, z: -3.25, color: '#f2d7b2', sizeScale: 0.92, silent: true },
        { name: 'Max Customer', type: 'npc', avatar: 'max', x: -2.25, z: -1.5, color: '#75bd3f' },
        { name: 'Gummigoo Customer', type: 'gummigoo', avatar: 'gummigoo', x: 1.85, z: -1.65, color: '#d8a23a' },
        { name: 'Stupid Burger Mannequin', type: 'mannequin', avatar: 'stupidburgermannequin', x: -2.85, z: -2.75, color: '#ff9b37', sizeScale: 0.9 },
        { name: 'Cereal Bowl Mannequin', type: 'mannequin', avatar: 'cerealmannequin', x: 2.85, z: -2.7, color: '#ff9b37', sizeScale: 0.9 }
      ],
      11: [
        { name: 'Orbsman', type: 'npc', avatar: 'orbsman', x: -1.75, z: -2.25, color: '#6dd8ff' },
        { name: 'Kawaii Gangle', type: 'gangle', avatar: 'ganglekawaii', x: -0.15, z: -2.45, color: '#ff9fcd' },
        { name: 'Evil Pomni', type: 'pomni', avatar: 'evilpomni', x: 1.35, z: -2.1, color: '#c12b3f' },
        { name: 'Evil Jax', type: 'jax', avatar: 'eviljax', x: 2.45, z: -1.45, color: '#7436c9' },
        { name: 'Jeffery Dancer', type: 'npc', avatar: 'jeffery', x: -2.75, z: -1.45, color: '#f4f4ee', sizeScale: 0.9 }
      ],
      12: [
        { name: 'Baseball Jax', type: 'jax', avatar: 'baseballjax', x: -2.55, z: -1.45, color: '#b874e8' },
        { name: 'Baseball Zooble', type: 'zooble', avatar: 'baseballzooble', x: -1.45, z: -2.2, color: '#f27ad3' },
        { name: 'Baseball Gangle', type: 'gangle', avatar: 'baseballgangle', x: -0.25, z: -2.5, color: '#d84747' },
        { name: 'Baseball Ragatha', type: 'ragatha', avatar: 'baseballragatha', x: 1.05, z: -2.2, color: '#6d86dd' },
        { name: 'Baseball Pomni', type: 'pomni', avatar: 'baseballpomni', x: 2.15, z: -1.55, color: '#4068e8' },
        { name: 'Baseball Kinger', type: 'kinger', avatar: 'baseballkinger', x: 0.75, z: -1.15, color: '#d7c9aa' },
        { name: 'Giant Centipede', type: 'npc', avatar: 'giantcentipede', x: 3.05, z: -3.25, color: '#c89436', sizeScale: 1.22 }
      ],
      13: [
        { name: 'Jax', type: 'jax', avatar: 'jax', x: -1.5, z: -2.1, color: '#8a4fd6' },
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: 0.2, z: -2.45, color: '#d64545' }
      ],
      14: [
        { name: 'Beach Gangle', type: 'gangle', avatar: 'beachgangle', x: -1.55, z: -2.1, color: '#f7f7f7' },
        { name: 'Jax', type: 'jax', avatar: 'jax', x: 0.25, z: -2.4, color: '#8a4fd6' },
        { name: 'Sun', type: 'npc', avatar: 'sun', x: 2.05, z: -1.65, color: '#ffd84a', sizeScale: 1.05 },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -2.45, z: -1.4, color: '#e53935' },
        { name: 'Shrimp NPC', type: 'npc', avatar: 'shrimpnpc', x: 1.15, z: -2.95, color: '#ff8f4a', sizeScale: 0.72 },
        { name: 'Orange Crappy Looking Fish', type: 'npc', avatar: 'truthtellerfish', x: -0.95, z: -2.95, color: '#ff9b32', sizeScale: 0.68 },
        { name: 'Red Crappy Looking Fish', type: 'npc', avatar: 'liarfish', x: -0.2, z: -3.18, color: '#ff3264', sizeScale: 0.64 }
      ],
      15: [
        { name: 'Ming', type: 'mannequin', avatar: 'ming', x: -1.65, z: -2.1, color: '#b7c7d8' },
        { name: 'Chinese Room NPC', type: 'mannequin', avatar: 'chineseroomnpc', x: 0.95, z: -3.05, color: '#d8b4fe', sizeScale: 1.05 }
      ],
      16: [
        { name: 'Caine', type: 'caine', avatar: 'caine', x: -1.05, z: -2.25, color: '#ffd84a' },
        { name: 'Blue AI', type: 'system', avatar: 'blueai', x: 0, z: -3.15, color: '#00ddff', sizeScale: 0.85, loreGate: { episode: 9, subepisode: 6 } },
        { name: 'Abel NPC Echo', type: 'mannequin', avatar: 'abelmannequin', x: 0.6, z: -1.85, color: '#ff8a30' },
        { name: 'Deleted Abel Render', type: 'mannequin', avatar: 'abelfullbody', x: 1.85, z: -2.55, color: '#f08a28' },
        { name: 'Fourth Crocodile // Archive EP8', type: 'npc', avatar: 'fourthcrocodile', x: -3.15, z: -3.2, color: '#d4c840', sizeScale: 1.18, silent: true, loreGate: { episode: 8, subepisode: 7 } },
        { name: 'Feminine Shadow // Archive EP8', type: 'ghost', avatar: 'ragathamothershadow', x: 3.2, z: -3.2, color: '#18111f', sizeScale: 1.3, silent: true, loreGate: { episode: 8, subepisode: 7 } },
        { name: 'Laughing Shadows // Archive EP8', type: 'ghost', avatar: 'laughingshadows', x: 0.25, z: -3.75, color: '#05020d', sizeScale: 1.28, silent: true, loreGate: { episode: 8, subepisode: 7 } }
      ],
      17: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -1.25, z: -2.2, color: '#d9d0a2' },
        { name: 'Queenie Archive', type: 'kinger', avatar: 'queenie', x: 0.25, z: -2.55, color: '#f7eecb' }
      ],
      18: [
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.8, z: -2.2, color: '#e53935' },
        { name: 'Caine', type: 'caine', avatar: 'caine', x: 0, z: -2.55, color: '#ffd84a' },
        { name: 'Bubble', type: 'bubble', avatar: 'bubble', x: 1.35, z: -2.15, color: '#f7f7ff' },
        { name: 'Ribbit Dream Signal', type: 'npc', avatar: 'ribbit', x: 2.35, z: -1.45, color: '#63d35f' },
        { name: 'Floating Worm', type: 'npc', avatar: 'floatingworm', x: 1.45, z: -3.15, color: '#d85bd8', sizeScale: 0.52, silent: true, loreGate: { episode: 9, subepisode: 2 } },
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -2.75, z: -1.35, color: '#d9d0a2' },
        { name: 'Jax', type: 'jax', avatar: 'jax', x: 2.85, z: -2.75, color: '#8a4fd6' }
      ],
      19: [
        { name: 'Ribbit', type: 'npc', avatar: 'ribbit', x: -3.35, z: -1.55, color: '#4ee77e' },
        { name: 'Scratch', type: 'npc', avatar: 'scratch', x: -2.45, z: -2.25, color: '#ffd341' },
        { name: 'Wormo', type: 'npc', avatar: 'wormo', x: -1.55, z: -1.75, color: '#ffcf75' },
        { name: 'Bizco', type: 'npc', avatar: 'bizco', x: -0.55, z: -2.55, color: '#b45cff' },
        { name: 'Rattie', type: 'npc', avatar: 'rattie', x: 0.45, z: -1.75, color: '#b7a891' },
        { name: 'Spike', type: 'npc', avatar: 'spike', x: 1.45, z: -2.55, color: '#8d5cff' },
        { name: 'Pink Cyclops', type: 'npc', avatar: 'pinkcyclops', x: 2.35, z: -1.75, color: '#ff80bd' },
        { name: 'Yellow Clown', type: 'npc', avatar: 'yellowclown', x: 3.25, z: -2.25, color: '#ffd33f' },
        { name: 'Oyster', type: 'npc', avatar: 'oyster', x: -0.05, z: -3.15, color: '#8fb7ff' },
        { name: 'Bulb Creature', type: 'npc', avatar: 'bulbcreature', x: 0.95, z: -3.15, color: '#a8e85b' }
      ],
      20: [
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -0.82, z: -2.2, color: '#e53935' },
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: 0.05, z: -2.75, color: '#d64545' },
        { name: 'Jax', type: 'jax', avatar: 'jax', x: 0.86, z: -1.75, color: '#8a4fd6' }
      ],
      21: [
        { name: 'Gangle', type: 'gangle', avatar: 'gangle', x: -1.6, z: -2.1, color: '#f7f7f7' },
        { name: 'Zooble', type: 'zooble', avatar: 'zooble', x: 0.2, z: -2.5, color: '#ff4fb8' },
        { name: 'Jax', type: 'jax', avatar: 'jax', x: 1.8, z: -1.7, color: '#8a4fd6' }
      ],
      22: [
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.3, z: -2.3, color: '#e53935' },
        { name: 'Abstraction aquatique', type: 'abstract', avatar: 'aquaticabstraction', x: 0.15, z: -3.15, color: '#02020a', sizeScale: 1.35, silent: true, threatActive: false, silentText: 'Des tentacules noires glissent derriere la vitre. Seuls des parasites et des grondements repondent.', loreGate: { episode: 9, subepisode: 6 } },
        { name: 'Gloink Round', type: 'npc', avatar: 'gloinkround', x: 0.6, z: -2.6, color: '#c4b62d', sizeScale: 0.72 },
        { name: 'Bubble', type: 'bubble', avatar: 'bubble', x: 2.0, z: -1.6, color: '#f7f7ff' }
      ],
      23: [
        { name: 'Jax Memory', type: 'jax', avatar: 'jax', x: -1.25, z: -2.35, color: '#8a4fd6' },
        { name: 'Ribbit Memory', type: 'npc', avatar: 'ribbit', x: 1.25, z: -2.35, color: '#63d35f' }
      ],
      24: [
        { name: 'Hunter Jax', type: 'jax', avatar: 'hunterjax', x: -1.6, z: -2.15, color: '#8a4fd6' },
        { name: 'Rhino Gangle', type: 'gangle', avatar: 'rhinogangle', x: 0.35, z: -2.65, color: '#e8e1d6' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 1.85, z: -1.65, color: '#e53935' }
      ],
      25: [
        { name: 'Anime Pomni', type: 'pomni', avatar: 'japanesepomni', x: -2.2, z: -1.65, color: '#e53935' },
        { name: 'Anime Jax', type: 'jax', avatar: 'japanesejax', x: -0.75, z: -2.45, color: '#8a4fd6' },
        { name: 'Anime Gangle', type: 'gangle', avatar: 'japanesegangle', x: 0.75, z: -2.45, color: '#f7f7f7' },
        { name: 'Anime Ragatha', type: 'ragatha', avatar: 'japaneseragatha', x: 2.2, z: -1.65, color: '#d64545' }
      ],
      26: [
        { name: 'President Pomni', type: 'pomni', avatar: 'pomni', x: 0, z: -2.65, color: '#e53935' },
        { name: 'Gangle Extremist', type: 'gangle', avatar: 'gangle', x: -1.8, z: -1.65, color: '#f7f7f7' },
        { name: 'Jax', type: 'jax', avatar: 'jax', x: 1.8, z: -1.65, color: '#8a4fd6' }
      ],
      27: [],
      28: [
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: -1.5, z: -2.25, color: '#d64545' },
        { name: 'Gangle', type: 'gangle', avatar: 'gangle', x: 0.15, z: -2.65, color: '#f7f7f7' },
        { name: 'Zooble', type: 'zooble', avatar: 'zooble', x: 1.65, z: -1.8, color: '#ff4fb8' }
      ],
      29: [
        { name: 'Dr. Football', type: 'prop', avatar: 'drfootball', x: 0.85, z: -2.35, color: '#d94338', sizeScale: 0.82 }
      ],
      30: [
        { name: 'Zooble', type: 'zooble', avatar: 'zooble', x: -0.9, z: -2.2, color: '#ff4fb8' },
        { name: 'Bubble', type: 'bubble', avatar: 'bubble', x: 1.0, z: -1.8, color: '#f7f7ff' }
      ],
      31: [
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.2, z: -2.2, color: '#e53935' },
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: 1.2, z: -2.35, color: '#d64545' },
        { name: 'Gloink Queen', type: 'npc', avatar: 'gloinkqueenscale', x: 0, z: -3.0, color: '#ff7d8d', sizeScale: 1.7 },
        { name: 'Star Gloink', type: 'npc', avatar: 'gloinkstar', x: -2.2, z: -1.35, color: '#7348ff', sizeScale: 0.65 },
        { name: 'Cube Gloink', type: 'npc', avatar: 'gloinkcube', x: 2.2, z: -1.35, color: '#2fb642', sizeScale: 0.65 }
      ],
      32: [
        { name: 'Princess Loolilalu', type: 'npc', avatar: 'loolilalu', x: 0, z: -2.65, color: '#ff9ad5' },
        { name: 'Caine', type: 'caine', avatar: 'caine', x: -1.75, z: -1.75, color: '#ffd84a' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 1.75, z: -1.75, color: '#e53935' },
        { name: 'Candy Guard Cyan', type: 'mannequin', avatar: 'candyguardcyan', x: -2.8, z: -2.65, color: '#27d7e7' },
        { name: 'Candy Guard Blue', type: 'mannequin', avatar: 'candyguardblue', x: 2.8, z: -2.65, color: '#2568f5' },
        { name: 'Candy Guard Violet', type: 'mannequin', avatar: 'candyguardpurple', x: 0.8, z: -3.3, color: '#7755e8' },
        { name: 'Red Mannequin', type: 'mannequin', avatar: 'redmannequin', x: -3.45, z: -3.55, color: '#f33d34', sizeScale: 0.66 },
        { name: 'Orange Mannequin', type: 'mannequin', avatar: 'orangemannequin', x: -2.25, z: -3.65, color: '#ff8a2a', sizeScale: 0.66 },
        { name: 'Yellow Mannequin', type: 'mannequin', avatar: 'yellowmannequin', x: 2.25, z: -3.65, color: '#ffd83f', sizeScale: 0.66 },
        { name: 'Magenta Mannequin', type: 'mannequin', avatar: 'magentamannequin', x: 3.45, z: -3.55, color: '#f04ad8', sizeScale: 0.66 }
      ],
      33: [
        { name: 'Gummigoo', type: 'gummigoo', avatar: 'gummigoo', x: -1.4, z: -2.3, color: '#d8a23a' },
        { name: 'Max', type: 'gummigoo', avatar: 'max', x: 0.1, z: -2.6, color: '#75bd3f' },
        { name: 'Chad', type: 'gummigoo', avatar: 'chad', x: 1.55, z: -2.1, color: '#8bd64a' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 2.5, z: -1.35, color: '#e53935' }
      ],
      34: [
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.1, z: -2.35, color: '#e53935' },
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: 0.7, z: -2.55, color: '#d9d0a2' },
        { name: 'Martha Mildenhall', type: 'ghost', avatar: 'marthamildenhall', x: 2.0, z: -1.65, color: '#7df0ff' },
        { name: 'Angel', type: 'npc', avatar: 'angel', x: -2.15, z: -1.55, color: '#e5d7d7', sizeScale: 1.05 }
      ],
      35: [
        { name: 'Work Gangle', type: 'gangle', avatar: 'workgangle', x: -1.4, z: -2.2, color: '#f7f7f7' },
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: 0.1, z: -2.55, color: '#d64545' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 1.55, z: -1.8, color: '#e53935' },
        { name: 'Albert Spudsy Cutout', type: 'prop', avatar: 'albertspudsy', x: 2.55, z: -2.95, color: '#f2d7b2', sizeScale: 0.88, silent: true }
      ],
      36: [
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -0.85, z: -2.4, color: '#e53935' }
      ],
      37: [{ name: 'Jax', type: 'jax', avatar: 'jax', x: 0, z: -2.35, color: '#8a4fd6' }],
      38: [
        { name: 'Caine', type: 'caine', avatar: 'caine', x: 0, z: -2.7, color: '#ffd84a' },
        { name: 'Ming', type: 'mannequin', avatar: 'ming', x: -1.65, z: -1.8, color: '#b7c7d8' },
        { name: 'Disappearing Guy', type: 'mannequin', avatar: 'disappearingguy', x: 1.65, z: -1.8, color: '#c34232' },
        { name: 'Committee Member', type: 'mannequin', avatar: 'committeemember', x: 0.95, z: -1.35, color: '#f4f4f0' }
      ],
      39: [
        { name: 'Jax', type: 'jax', avatar: 'jax', x: -1.2, z: -2.3, color: '#8a4fd6' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 1.2, z: -2.35, color: '#e53935' }
      ],
      40: [
        { name: 'Beach Gangle', type: 'gangle', avatar: 'beachgangle', x: -1.25, z: -2.3, color: '#f7f7f7' },
        { name: 'Zooble', type: 'zooble', avatar: 'zooble', x: 1.25, z: -2.3, color: '#ff4fb8' },
        { name: 'Shrimp NPC', type: 'npc', avatar: 'shrimpnpc', x: 0, z: -3.05, color: '#ff8f4a', sizeScale: 0.72 }
      ],
      41: [{ name: 'Jax Memory', type: 'jax', avatar: 'jax', x: 0, z: -2.5, color: '#8a4fd6' }],
      42: [{ name: 'Caine', type: 'caine', avatar: 'caine', x: 0, z: -2.5, color: '#ffd84a' }],
      43: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -1.35, z: -2.3, color: '#d9d0a2' },
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: 0.1, z: -2.65, color: '#d64545' },
        { name: 'Gangle', type: 'gangle', avatar: 'gangle', x: 1.45, z: -1.85, color: '#f7f7f7' }
      ],
      50: [],
      51: [],
      64: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -1.25, z: -2.3, color: '#d9d0a2' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 1.15, z: -2.4, color: '#e53935' }
      ],
      65: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -1.1, z: -2.25, color: '#d9d0a2' },
        { name: 'Ghostly Echo', type: 'ghost', avatar: 'ghostly', x: 0.55, z: -2.45, color: '#7df0ff' },
        { name: 'Angel Echo', type: 'npc', avatar: 'angel', x: 2.15, z: -1.65, color: '#f2f2f2', sizeScale: 1.12 }
      ],
      66: [
        { name: 'Princess Loolilalu', type: 'npc', avatar: 'loolilalu', x: -1.2, z: -2.45, color: '#ff9ad5' },
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: 1.25, z: -2.25, color: '#d64545' },
        { name: 'Gummy Elephant', type: 'npc', avatar: 'gummyelephant', x: 2.35, z: -1.65, color: '#ff85b7', sizeScale: 0.86 }
      ],
      67: [
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.15, z: -2.35, color: '#e53935' },
        { name: 'Caine', type: 'caine', avatar: 'caine', x: 1.2, z: -2.45, color: '#ffd84a' }
      ],
      68: [
        { name: 'Jax', type: 'jax', avatar: 'jax', x: -1.1, z: -2.25, color: '#8a4fd6' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 1.15, z: -2.4, color: '#e53935' }
      ],
      69: [
        { name: 'Caine', type: 'caine', avatar: 'caine', x: -1.1, z: -2.35, color: '#ffd84a' },
        { name: 'Jax', type: 'jax', avatar: 'jax', x: 1.2, z: -2.25, color: '#8a4fd6' }
      ]
    };
    const sprites = byZone[zoneId] || shared.slice(0, 4);
    this.circusZoneSpritesCache.set(zoneId, sprites);
    return sprites;
  },

  separateCircusNpcCrowd(sprites, state) {
    const result = sprites.map(sprite => ({ ...sprite }));
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < result.length; i++) {
        const avatarA = result[i].avatar || result[i].type;
        if (avatarA === 'gloinkqueenscale') continue;
        const a = this.resolveCircusWorldPoint(result[i], state);
        for (let j = i + 1; j < result.length; j++) {
          const avatarB = result[j].avatar || result[j].type;
          if (avatarB === 'gloinkqueenscale') continue;
          const b = this.resolveCircusWorldPoint(result[j], state);
          const dx = b.x - a.x;
          const dz = b.z - a.z;
          const distance = Math.hypot(dx, dz);
          if (distance >= 0.72) continue;
          const push = (0.72 - Math.max(0.01, distance)) * 0.5;
          const nx = distance > 0.01 ? dx / distance : Math.cos(j * 1.7);
          const nz = distance > 0.01 ? dz / distance : Math.sin(j * 1.7);
          if (result[j].space === 'world') {
            result[j].x += nx * push;
            result[j].z += nz * push;
          } else {
            result[j].x += nx * push;
            result[j].z += nz * push;
          }
        }
      }
    }
    return result;
  },

  getCircusTimelineContext() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const selected = Number(typeof EpisodeManager !== 'undefined' ? EpisodeManager.currentEpisode : NaN);
    const episode = selected >= 1 && selected <= 9
      ? selected
      : ([1, 2, 3, 4, 5, 6, 7, 8, 9].find(number => !progress.includes(number)) || 9);
    const subProgress = (typeof EpisodeManager !== 'undefined' && typeof EpisodeManager.getSubepisodeProgress === 'function')
      ? EpisodeManager.getSubepisodeProgress(1)
      : [];
    const cycleIndex = Math.floor(performance.now() / 75000) % 4;
    return {
      progress,
      episode,
      knowsPomni: progress.includes(1) || subProgress.length > 0 || episode > 1,
      afterFinal: progress.includes(9) && episode === 9,
      phase: ['briefing', 'adventure', 'recovery', 'quiet'][cycleIndex],
      cycleIndex
    };
  },

  getCircusScheduledNpcPlacements(state) {
    const timeline = this.getCircusTimelineContext();
    const adventure = this.getCircusAdventurePortalConfig();
    const colors = {
      pomni: '#e53935', ragatha: '#d64545', jax: '#8a4fd6', kinger: '#d9d0a2',
      gangle: '#f7f7f7', zooble: '#ff4fb8', caine: '#ffd84a'
    };
    const names = { pomni: 'Pomni', ragatha: 'Ragatha', jax: 'Jax', kinger: 'Kinger', gangle: 'Gangle', zooble: 'Zooble', caine: 'Caine' };
    const make = (zone, avatar, x, z, routine = 'idle') => ({ zone, name: names[avatar], type: avatar, avatar, x, z, color: colors[avatar], routine, scheduled: true });
    const groups = {
      briefing: [
        make(2, 'caine', 0, -2.75, 'hover'), make(2, 'ragatha', -1.6, -2.2),
        make(2, 'jax', 1.65, -2.1, 'pace'), make(2, 'gangle', -0.65, -1.6),
        make(2, 'zooble', 0.75, -1.65), make(2, 'kinger', 2.45, -1.35)
      ],
      adventure: [
        make(adventure.target, 'caine', 0, -2.8, 'hover'), make(adventure.target, 'pomni', -1.55, -2.15, 'patrol'),
        make(adventure.target, 'ragatha', 1.5, -2.25, 'patrol'), make(adventure.target, 'jax', 2.4, -1.45, 'pace')
      ],
      recovery: [
        make(28, 'pomni', -1.4, -2.3), make(28, 'ragatha', 1.35, -2.35),
        make(21, 'gangle', -1.2, -2.2), make(21, 'zooble', 1.2, -2.25),
        make(43, 'kinger', 0, -2.5), make(3, 'jax', 0.8, -2.3, 'pace'), make(16, 'caine', 0, -2.65, 'hover')
      ],
      quiet: [
        make(45, 'pomni', 0, -2.2), make(46, 'ragatha', 0, -2.2), make(44, 'jax', 0, -2.2),
        make(47, 'gangle', 0, -2.2), make(48, 'zooble', 0, -2.2), make(49, 'kinger', 0, -2.2),
        make(16, 'caine', 0, -2.65, 'hover')
      ]
    };
    return (groups[timeline.phase] || []).filter(sprite => {
      if (sprite.avatar === 'pomni' && !timeline.knowsPomni) return false;
      if (sprite.avatar === 'jax' && timeline.afterFinal) return false;
      return true;
    });
  },

  getCircusActiveZoneSprites(zoneId, state) {
    const timeline = this.getCircusTimelineContext();
    const campaign = this.getActiveCircusCampaignStatus();
    const staticSprites = this.getCircusZoneSprites(zoneId).filter(sprite => {
      const avatar = sprite.avatar || sprite.type;
      if (sprite.loreGate && !this.hasCircusLoreGate(sprite.loreGate)) return false;
      if (avatar === 'pomni' && !timeline.knowsPomni && campaign?.definition?.episode !== 1) return false;
      if (avatar === 'jax' && timeline.afterFinal && !/memory|archive/i.test(sprite.name || '')) return false;
      return true;
    });
    const scheduled = this.getCircusScheduledNpcPlacements(state)
      .filter(sprite => sprite.zone === zoneId && !staticSprites.some(existing => (existing.avatar || existing.type) === sprite.avatar));
    const dynamicSprites = this.getCircusDynamicEventSprites(zoneId)
      .filter(sprite => !staticSprites.some(existing => (existing.avatar || existing.type) === sprite.avatar));
    const occupiedAvatars = new Set([...staticSprites, ...scheduled, ...dynamicSprites].map(sprite => sprite.avatar || sprite.type));
    const customSprites = this.getCircusCustomAdventureSprites(zoneId, state)
      .filter(sprite => !occupiedAvatars.has(sprite.baseAvatar || sprite.avatar));
    const sprites = [...staticSprites, ...scheduled, ...dynamicSprites, ...customSprites].map((sprite, index) => {
      const campaignSprite = (sprite.avatar || sprite.type) === 'pomni' && campaign?.definition?.episode === 1 && campaign.progress.stage < 3
        ? { ...sprite, name: 'SUJET SANS NOM' }
        : sprite;
      const animated = this.applyCircusSpriteRoutine(campaignSprite, index, zoneId, state);
      return this.applyCircusNpcNavigation(animated, index, zoneId, state);
    });
    state.routinePhase = timeline.phase;
    const follower = state?.follower;
    const jaxArchived = follower?.avatar === 'jax' && (typeof EpisodeManager !== 'undefined') && EpisodeManager.getProgress().includes(9);
    if (jaxArchived) {
      state.follower = null;
      this.saveCircusPersistentWorldState();
    }
    if (follower && !jaxArchived && !sprites.some(sprite => (sprite.avatar || sprite.type) === follower.avatar)) {
      const colors = { pomni: '#e53935', ragatha: '#d64545', jax: '#8a4fd6', kinger: '#d9d0a2', gangle: '#f7f7f7', zooble: '#ff4fb8', gummigoo: '#d8a23a' };
      const candidate = {
        x: state.player.x - Math.cos(state.player.a) * 1.15 + Math.cos(state.player.a + Math.PI / 2) * 0.55,
        z: state.player.z - Math.sin(state.player.a) * 1.15 + Math.sin(state.player.a + Math.PI / 2) * 0.55
      };
      sprites.push({
        name: follower.name,
        type: follower.avatar,
        avatar: follower.avatar,
        space: 'world',
        x: candidate.x,
        z: candidate.z,
        color: colors[follower.avatar] || '#fff1a8',
        routine: 'follow'
      });
    }
    return this.separateCircusNpcCrowd(sprites, state);
  },

  getCircusSpriteRoutine(sprite, zoneId) {
    const avatar = sprite.avatar || sprite.type || "";
    if (avatar.startsWith("gloink") || avatar === "barrelmonkey") return "swarm";
    if (["bubble", "horrorghost", "marthamildenhall", "ghostly", "angel", "moon", "sun", "blueai", "cookiebutterfly", "mildenhallsouls", "truthtellerfish", "liarfish"].includes(avatar)) return "hover";
    if (['abstractedkaufmo', 'cellarabstraction', 'aquaticabstraction'].includes(avatar) || avatar.startsWith("shadow") || ["ragathamothershadow", "laughingshadows"].includes(avatar)) return "tremble";
    if (["gummigoo", "max", "chad", "workgangle", "themachine", "additionalvoices", "ming", "spudsycustomer", "gummyelephant", "candyguardcyan", "candyguardblue", "candyguardpurple", "redmannequin", "orangemannequin", "yellowmannequin", "magentamannequin"].includes(avatar)) return "patrol";
    if (["albertspudsy", "stupidburgermannequin", "cerealmannequin"].includes(avatar)) return "idle";
    if (["giantcentipede", "drfootball"].includes(avatar)) return "tremble";
    if (["jax", "hunterjax", "baseballjax", "eviljax", "gummyworm", "jeffery", "fourthcrocodile"].includes(avatar)) return "pace";
    if ([12, 14].includes(zoneId)) return "pace";
    return "idle";
  },

  applyCircusSpriteRoutine(sprite, index, zoneId, state) {
    const now = performance.now() / 1000;
    const routine = sprite.routine || this.getCircusSpriteRoutine(sprite, zoneId);
    const phase = index * 1.37 + zoneId * 0.23;
    const animated = { ...sprite, routine };
    const avatar = animated.avatar || animated.type || '';
    if (routine === "pace") {
      animated.x += Math.sin(now * 0.82 + phase) * 0.14;
      animated.z += Math.cos(now * 0.55 + phase) * 0.06;
      animated.bob = Math.sin(now * 4.2 + phase) * 0.018;
    } else if (routine === "patrol") {
      animated.x += Math.sin(now * 0.46 + phase) * 0.22;
      animated.z += Math.sin(now * 0.32 + phase) * 0.08;
      animated.bob = Math.sin(now * 2.4 + phase) * 0.012;
    } else if (routine === "hover") {
      animated.x += Math.sin(now * 0.62 + phase) * 0.08;
      animated.bob = Math.sin(now * 2.1 + phase) * 0.06;
      animated.sizeScale = (animated.sizeScale || 1) * (1 + Math.sin(now * 1.3 + phase) * 0.035);
    } else if (routine === "swarm") {
      animated.x += Math.sin(now * 1.65 + phase) * 0.2;
      animated.z += Math.cos(now * 1.15 + phase) * 0.12;
      animated.bob = Math.sin(now * 5.4 + phase) * 0.04;
    } else if (routine === "tremble") {
      animated.x += Math.sin(now * 12.5 + phase) * 0.025;
      animated.z += Math.cos(now * 10.5 + phase) * 0.025;
      animated.sizeScale = (animated.sizeScale || 1) * (1 + Math.sin(now * 9.5 + phase) * 0.018);
    } else {
      animated.bob = Math.sin(now * 1.6 + phase) * 0.01;
    }
    const center = state.room?.center || { x: 0, z: 0 };
    const threatPosition = state.threatPositions?.get(`${zoneId}:${avatar}`);
    if (threatPosition) {
      animated.x = threatPosition.x - center.x;
      animated.z = threatPosition.z - center.z;
      animated.behavior = 'menace';
    }
    const npcWorldX = center.x + animated.x;
    const npcWorldZ = center.z + animated.z;
    const toPlayerX = state.player.x - npcWorldX;
    const toPlayerZ = state.player.z - npcWorldZ;
    const playerDistance = Math.max(0.001, Math.hypot(toPlayerX, toPlayerZ));
    const awareness = Math.max(0, Math.min(1, (4.2 - playerDistance) / 2.8));
    const social = new Set(['pomni', 'ragatha', 'gangle', 'kinger', 'gummigoo', 'max', 'chad']);
    const avoids = new Set(['jax', 'hunterjax', 'eviljax', 'zooble']);
    const threats = avatar.startsWith('shadow') || ['abstractedkaufmo', 'cellarabstraction', 'aquaticabstraction'].includes(avatar);
    animated.awareness = awareness;
    animated.behavior = routine;
    if (awareness > 0 && social.has(avatar) && playerDistance > 1.55) {
      const approach = 0.12 * awareness;
      animated.x += (toPlayerX / playerDistance) * approach;
      animated.z += (toPlayerZ / playerDistance) * approach;
      animated.behavior = 'attentif';
    } else if (awareness > 0.25 && avoids.has(avatar) && playerDistance < 2.7) {
      const retreat = 0.16 * awareness;
      animated.x -= (toPlayerX / playerDistance) * retreat;
      animated.z -= (toPlayerZ / playerDistance) * retreat;
      animated.behavior = 'distant';
    } else if (awareness > 0.2 && threats) {
      const pressure = 0.08 * awareness;
      animated.x += (toPlayerX / playerDistance) * pressure;
      animated.z += (toPlayerZ / playerDistance) * pressure;
      animated.behavior = 'menace';
    } else if (awareness > 0.15 && routine === 'swarm') {
      animated.x += Math.cos(now * 1.8 + phase) * 0.09 * awareness;
      animated.z += Math.sin(now * 1.8 + phase) * 0.09 * awareness;
      animated.behavior = 'curieux';
    }
    animated.bob = (animated.bob || 0) * (Number.isFinite(state.motionIntensity) ? state.motionIntensity : 1);
    return animated;
  },

  findCircusNpcPath(start, target, state) {
    const grid = state?.room?.grid;
    if (!grid) return [];
    const sx = Math.floor(start.x);
    const sz = Math.floor(start.z);
    const tx = Math.floor(target.x);
    const tz = Math.floor(target.z);
    const queue = [[{ x: sx, z: sz }]];
    const visited = new Set([`${sx}:${sz}`]);
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    while (queue.length && visited.size < 420) {
      const path = queue.shift();
      const node = path[path.length - 1];
      if (node.x === tx && node.z === tz) return path.slice(1).map(point => ({ x: point.x + 0.5, z: point.z + 0.5 }));
      directions.forEach(([dx, dz]) => {
        const x = node.x + dx;
        const z = node.z + dz;
        const key = `${x}:${z}`;
        if (visited.has(key) || grid[z]?.[x] !== 0) return;
        visited.add(key);
        queue.push([...path, { x, z }]);
      });
    }
    return [];
  },

  chooseCircusNpcDestination(agent, index, state) {
    const room = state?.room;
    if (!room) return { x: agent.x, z: agent.z };
    const open = [];
    for (let z = 2; z < room.size - 2; z++) {
      for (let x = 2; x < room.size - 2; x++) {
        if (room.grid[z]?.[x] === 0 && Math.hypot(x + 0.5 - state.player.x, z + 0.5 - state.player.z) > 1.4) open.push({ x: x + 0.5, z: z + 0.5 });
      }
    }
    if (!open.length) return { x: agent.x, z: agent.z };
    const seed = Math.abs(Math.floor(performance.now() / 5000) + index * 17 + state.currentZoneId * 31);
    return open[seed % open.length];
  },

  applyCircusNpcNavigation(sprite, index, zoneId, state) {
    if (!state?.room || sprite.routine === 'follow' || sprite.behavior === 'menace') return sprite;
    const mobile = ['pace', 'patrol', 'swarm'].includes(sprite.routine) || sprite.scheduled;
    const center = state.room.center;
    const start = this.resolveCircusWorldPoint(sprite, state);
    const key = `${zoneId}:${sprite.avatar || sprite.type}:${sprite.name}`;
    let agent = state.npcAgents.get(key);
    const now = performance.now();
    if (!agent) {
      agent = { x: start.x, z: start.z, facing: index * 0.73, path: [], nextTargetAt: now + 1200 + index * 260, lastUpdate: now };
      state.npcAgents.set(key, agent);
    }
    agent.path = Array.isArray(agent.path) ? agent.path : [];
    agent.nextTargetAt = Number.isFinite(agent.nextTargetAt) ? agent.nextTargetAt : now + 900 + index * 180;
    agent.lastUpdate = Number.isFinite(agent.lastUpdate) ? agent.lastUpdate : now;
    const dt = Math.min(0.05, Math.max(0, (now - agent.lastUpdate) / 1000));
    agent.lastUpdate = now;
    if (mobile && (now >= agent.nextTargetAt || !agent.path.length)) {
      const target = this.chooseCircusNpcDestination(agent, index, state);
      agent.path = this.findCircusNpcPath(agent, target, state);
      agent.nextTargetAt = now + 4200 + ((index * 947) % 3600);
    }
    if (mobile && agent.path.length) {
      const target = agent.path[0];
      const dx = target.x - agent.x;
      const dz = target.z - agent.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 0.08) agent.path.shift();
      else {
        const speed = sprite.routine === 'swarm' ? 0.72 : sprite.routine === 'pace' ? 0.48 : 0.38;
        const step = Math.min(distance, speed * dt);
        agent.x += dx / distance * step;
        agent.z += dz / distance * step;
        agent.facing = Math.atan2(dz, dx);
      }
    } else if (sprite.awareness > 0.25) {
      agent.facing = Math.atan2(state.player.z - agent.z, state.player.x - agent.x);
    }
    return {
      ...sprite,
      space: 'world',
      x: agent.x,
      z: agent.z,
      facing: agent.facing,
      pathing: mobile && agent.path.length > 0,
      routine: mobile && agent.path.length ? 'patrol' : sprite.routine
    };
  },

  getCircusDirectionalPose(sprite, state) {
    const point = this.resolveCircusWorldPoint(sprite, state);
    const toViewer = Math.atan2(state.player.z - point.z, state.player.x - point.x);
    const facing = Number.isFinite(sprite.facing) ? sprite.facing : toViewer;
    const delta = Math.atan2(Math.sin(toViewer - facing), Math.cos(toViewer - facing));
    const sector = ((Math.round(delta / (Math.PI / 4)) % 8) + 8) % 8;
    return {
      sector,
      front: sector === 0,
      back: sector === 4,
      side: sector === 2 || sector === 6,
      diagonal: [1, 3, 5, 7].includes(sector),
      mirror: sector >= 5 ? -1 : 1
    };
  },

  drawCircusImpostorSprites(ctx, w, h, state) {
    const sprites = this.getCircusActiveZoneSprites(state.currentZoneId, state)
      .map(sprite => ({ ...sprite, projected: this.projectCircusPoint(sprite, state, w, h) }))
      .filter(sprite => sprite.projected)
      .sort((a, b) => b.projected.depth - a.projected.depth);
    sprites.forEach(sprite => {
      const p = sprite.projected;
      const size = Math.max(3, 70 * p.scale * (sprite.sizeScale || 1));
      const baseY = (p.y || h * 0.58) - (sprite.bob || 0) * size;
      const avatar = sprite.avatar || sprite.type;
      const drawH = size * (avatar === 'gloinkqueenscale' ? 1.35 : avatar === 'pomni' ? 1.08 : 1);
      const halfWidth = size * (avatar === 'gloinkqueenscale' ? 0.9 : avatar === 'pomni' ? 0.72 : 0.64);
      const spriteBox = {
        x: p.x - halfWidth,
        y: baseY - drawH - Math.max(14, size * 0.28),
        w: halfWidth * 2,
        h: drawH + Math.max(18, size * 0.36)
      };
      ctx.save();
      if (!this.applyCircusDepthClip(ctx, spriteBox, p.depth, state, 0.48, { allowAboveWall: true })) {
        ctx.restore();
        return;
      }
      const fullbright = ['bubble', 'sun', 'horrorghost', 'marthamildenhall', 'ghostly'].includes(avatar);
      const depthLight = this.getCircusDepthLight(p.depth, state, fullbright);
      ctx.filter = `brightness(${Math.round((0.55 + depthLight * 0.45) * 100)}%)`;
      this.drawCircusImpostor(ctx, sprite.type, p.x, baseY, size, sprite.color, sprite.name, avatar, sprite.routine, sprite);
      this.drawCircusCharacterNameplate(ctx, sprite, p.x, baseY - drawH, size, w);
      ctx.restore();
      if (p.distance <= 2.2 && this.isCircusWorldPointVisible(sprite, state, 0.42)) {
        state.hotspots.push({
          kind: 'character',
          sprite,
          x: p.x - size * 0.42,
          y: baseY - size,
          w: size * 0.84,
          h: size,
          depth: p.depth
        });
      }
    });
  },

  drawCircusCharacterNameplate(ctx, sprite, centerX, spriteTop, size, viewportWidth) {
    if (size < 16 || !sprite.name) return;
    const showMarker = sprite.awareness > 0.18;
    const fontSize = Math.max(5, Math.min(11, size * 0.13));
    const markerRadius = showMarker ? Math.max(3, Math.min(6, size * 0.065)) : 0;
    ctx.save();
    ctx.filter = 'none';
    ctx.font = `bold ${fontSize}px Courier New`;
    const textWidth = Math.min(104, ctx.measureText(sprite.name).width);
    const padding = 4;
    const gap = showMarker ? 4 : 0;
    const plateW = Math.max(24, textWidth + padding * 2 + markerRadius * 2 + gap);
    const plateH = Math.max(11, fontSize + 6);
    const plateX = Math.max(2, Math.min(viewportWidth - plateW - 2, centerX - plateW / 2));
    const plateY = spriteTop - plateH - Math.max(3, size * 0.055);
    ctx.fillStyle = 'rgba(5,2,13,0.82)';
    ctx.strokeStyle = sprite.color || '#fff1a8';
    ctx.lineWidth = 1;
    ctx.fillRect(plateX, plateY, plateW, plateH);
    ctx.strokeRect(plateX, plateY, plateW, plateH);
    let textX = plateX + plateW / 2;
    if (showMarker) {
      const markerX = plateX + padding + markerRadius;
      const markerY = plateY + plateH / 2;
      ctx.fillStyle = sprite.behavior === 'menace' ? '#ff4d4d' : '#fff1a8';
      ctx.strokeStyle = '#05020d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(markerX, markerY, markerRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      textX += markerRadius + gap / 2;
    }
    ctx.fillStyle = sprite.color || '#fff1a8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sprite.name, textX, plateY + plateH / 2 + 0.5, Math.max(12, textWidth));
    ctx.restore();
  },

  drawCircusImpostor(ctx, type, x, baseY, size, color, label, avatar, routine = 'idle', sprite = {}) {
    if (this.drawCircusWackyAvatar(ctx, avatar || type, x, baseY, size, label, color, routine, sprite)) return;

    ctx.save();
    ctx.translate(x, baseY);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 4, size * 0.32, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(5,2,13,0.86)';
    ctx.strokeStyle = color || '#fff1a8';
    ctx.lineWidth = Math.max(1, size * 0.035);
    ctx.fillRect(-size * 0.24, -size * 0.78, size * 0.48, size * 0.62);
    ctx.strokeRect(-size * 0.24, -size * 0.78, size * 0.48, size * 0.62);
    if (size >= 16) {
      ctx.fillStyle = color || '#fff1a8';
      ctx.font = `bold ${Math.max(3, size * 0.12)}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText('IMG', 0, -size * 0.46);
    }
    ctx.restore();
  },

  drawCircusWackyAvatar(ctx, avatar, x, baseY, size, label, color, routine = 'idle', sprite = {}) {
    const animationSpec = this.getCircusAvatarAnimationSpec(avatar, sprite);
    const animationImage = animationSpec ? this.circusAvatarSheets?.[animationSpec.sheet] : null;
    const animatedFrame = animationSpec && animationImage?.complete && animationImage.naturalWidth
      ? this.getCircusAnimationFrame(animationImage, animationSpec)
      : null;
    const spec = this.getCircusAvatarSheetSpec(avatar);
    const img = spec ? this.circusAvatarSheets?.[spec.sheet] : null;
    if (!animatedFrame && (!spec || !img || !img.complete || !img.naturalWidth || !img.naturalHeight)) return false;
    const frame = animatedFrame || this.getCircusTransparentAvatarFrame(img, spec);
    if (!frame) return false;
    const drawH = size * (avatar === 'gloinkqueenscale' ? 1.35 : avatar === 'pomni' ? 1.08 : 1);
    const drawW = drawH * (frame.width / frame.height);
    const now = performance.now() / 1000;
    const speaking = this.circusDoom?.interactionChannel === 'dialogue'
      && this.circusDoom?.interactionSpeaker === sprite.name
      && performance.now() <= (this.circusDoom?.interactionUntil || 0);
    const walkCycle = ['pace', 'patrol', 'follow'].includes(routine) ? Math.sin(now * 7.5) : 0;
    const hoverCycle = routine === 'hover' ? Math.sin(now * 2.2) : 0;
    const trembleCycle = routine === 'tremble' ? Math.sin(now * 18) : 0;
    const talkCycle = speaking ? Math.sin(now * 9) : 0;
    const tilt = walkCycle * 0.025 + trembleCycle * 0.018;
    const scaleX = 1 + walkCycle * 0.018 + trembleCycle * 0.014;
    const scaleY = 1 - Math.abs(walkCycle) * 0.025 + talkCycle * 0.018;
    const lift = hoverCycle * size * 0.045 - Math.abs(walkCycle) * size * 0.018 - talkCycle * size * 0.012;
    const direction = this.getCircusDirectionalPose(sprite, this.circusDoom);
    const directionalScaleX = direction.side ? 0.58 : direction.diagonal ? 0.82 : 1;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.beginPath();
    ctx.ellipse(x, baseY + Math.max(1, 4 * size / 70), Math.max(2, drawW * 0.36), Math.max(1, drawH * 0.075), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = Math.max(1, Math.min(8, size * 0.11));
    ctx.translate(x, baseY + lift);
    ctx.rotate(tilt);
    ctx.scale(scaleX * directionalScaleX * direction.mirror, scaleY);
    ctx.drawImage(frame.canvas, Math.round(-drawW / 2), Math.round(-drawH), Math.round(drawW), Math.round(drawH));
    if (direction.back || direction.sector === 3 || direction.sector === 5) {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = direction.back ? `${color || '#444444'}99` : `${color || '#444444'}55`;
      ctx.fillRect(-drawW / 2, -drawH, drawW, drawH * 0.72);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(5,2,13,0.55)';
      ctx.lineWidth = Math.max(1, drawW * 0.018);
      ctx.beginPath();
      ctx.moveTo(0, -drawH * 0.9);
      ctx.lineTo(0, -drawH * 0.28);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
    return true;
  },

  getCircusAnimationFrame(img, spec) {
    this.circusAvatarFrameCache = this.circusAvatarFrameCache || {};
    const frameW = Math.floor(img.naturalWidth / spec.cols);
    const frameH = Math.floor(img.naturalHeight / spec.rows);
    const col = spec.frameIndex % spec.cols;
    const row = Math.floor(spec.frameIndex / spec.cols);
    const cacheKey = `${spec.sheet}:animation:${spec.frameIndex}:${img.naturalWidth}x${img.naturalHeight}`;
    if (this.circusAvatarFrameCache[cacheKey]) return this.circusAvatarFrameCache[cacheKey];
    const source = document.createElement('canvas');
    source.width = frameW;
    source.height = frameH;
    const sourceCtx = source.getContext('2d', { willReadFrequently: true });
    if (!sourceCtx) return null;
    sourceCtx.imageSmoothingEnabled = false;
    sourceCtx.drawImage(img, col * frameW, row * frameH, frameW, frameH, 0, 0, frameW, frameH);
    const pixels = sourceCtx.getImageData(0, 0, frameW, frameH).data;
    let minX = frameW;
    let minY = frameH;
    let maxX = -1;
    let maxY = -1;
    for (let py = 0; py < frameH; py++) {
      for (let px = 0; px < frameW; px++) {
        if (pixels[(py * frameW + px) * 4 + 3] < 12) continue;
        minX = Math.min(minX, px);
        minY = Math.min(minY, py);
        maxX = Math.max(maxX, px);
        maxY = Math.max(maxY, py);
      }
    }
    if (maxX < minX || maxY < minY) return null;
    const safePad = 12;
    minX = Math.max(0, minX - safePad);
    minY = Math.max(0, minY - safePad);
    maxX = Math.min(frameW - 1, maxX + safePad);
    maxY = Math.min(frameH - 1, maxY + safePad);
    const canvas = document.createElement('canvas');
    canvas.width = maxX - minX + 1;
    canvas.height = maxY - minY + 1;
    canvas.getContext('2d').drawImage(source, minX, minY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    const frame = { canvas, width: canvas.width, height: canvas.height };
    this.circusAvatarFrameCache[cacheKey] = frame;
    return frame;
  },

  getCircusTransparentAvatarFrame(img, spec) {
    this.circusAvatarFrameCache = this.circusAvatarFrameCache || {};
    const frameW = Math.floor(img.naturalWidth / spec.cols);
    const frameH = Math.floor(img.naturalHeight / spec.rows);
    const cacheKey = `${spec.sheet}:${spec.col}:${spec.row}:${img.naturalWidth}x${img.naturalHeight}`;
    if (this.circusAvatarFrameCache[cacheKey]) return this.circusAvatarFrameCache[cacheKey];

    const canvas = document.createElement('canvas');
    canvas.width = frameW;
    canvas.height = frameH;
    const frameCtx = canvas.getContext('2d', { willReadFrequently: true });
    if (!frameCtx) return null;
    frameCtx.imageSmoothingEnabled = false;
    frameCtx.drawImage(img, frameW * spec.col, frameH * spec.row, frameW, frameH, 0, 0, frameW, frameH);

    const imageData = frameCtx.getImageData(0, 0, frameW, frameH);
    const { data } = imageData;
    const seen = new Uint8Array(frameW * frameH);
    const stack = [];
    const isEdgeBlack = pixelIndex => (
      data[pixelIndex + 3] > 0 &&
      data[pixelIndex] <= 18 &&
      data[pixelIndex + 1] <= 18 &&
      data[pixelIndex + 2] <= 18
    );
    const push = (px, py) => {
      if (px < 0 || py < 0 || px >= frameW || py >= frameH) return;
      const index = py * frameW + px;
      if (seen[index]) return;
      const dataIndex = index * 4;
      if (!isEdgeBlack(dataIndex)) return;
      seen[index] = 1;
      stack.push([px, py]);
    };

    for (let px = 0; px < frameW; px++) {
      push(px, 0);
      push(px, frameH - 1);
    }
    for (let py = 0; py < frameH; py++) {
      push(0, py);
      push(frameW - 1, py);
    }

    while (stack.length) {
      const [px, py] = stack.pop();
      const dataIndex = (py * frameW + px) * 4;
      data[dataIndex + 3] = 0;
      push(px + 1, py);
      push(px - 1, py);
      push(px, py + 1);
      push(px, py - 1);
    }

    frameCtx.putImageData(imageData, 0, 0);
    const frame = { canvas, width: frameW, height: frameH };
    this.circusAvatarFrameCache[cacheKey] = frame;
    return frame;
  },

  getCircusCanvasAvatarPattern(type) {
    const p = (x, y, w, h, c) => [x, y, w, h, c];
    const patterns = {
      pomni: [p(3,2,3,4,'#20c7ff'), p(10,2,3,4,'#e13b4b'), p(5,4,6,7,'#ffd2cb'), p(4,9,8,4,'#2a58d8'), p(6,7,1,1,'#1644b5'), p(9,7,1,1,'#1644b5'), p(7,10,2,1,'#f7f7f7'), p(2,5,2,2,'#ffd84a'), p(12,5,2,2,'#ffd84a'), p(4,13,2,3,'#f7f7f7'), p(10,13,2,3,'#f7f7f7')],
      caine: [p(2,4,12,7,'#f7f7f7'), p(3,5,10,2,'#222'), p(4,8,8,2,'#d61f2c'), p(4,10,1,1,'#fff'), p(6,10,1,1,'#fff'), p(9,10,1,1,'#fff'), p(11,10,1,1,'#fff'), p(5,2,2,2,'#22d6ff'), p(9,2,2,2,'#ff3333'), p(6,13,4,1,'#333')],
      bubble: [p(3,3,10,10,'#f3fbff'), p(4,4,8,8,'#d9f3ff'), p(5,8,6,2,'#111'), p(5,10,1,1,'#fff'), p(7,10,1,1,'#fff'), p(9,10,1,1,'#fff'), p(6,6,1,1,'#111'), p(10,6,1,1,'#111')],
      jax: [p(5,1,2,6,'#9656d8'), p(10,1,2,6,'#9656d8'), p(4,6,8,7,'#8750cf'), p(5,8,1,1,'#ffe45c'), p(10,8,1,1,'#ffe45c'), p(5,11,6,1,'#f7f7f7'), p(3,13,10,1,'#6b39aa')],
      ragatha: [p(4,3,8,8,'#ffd0bd'), p(3,2,10,3,'#d92626'), p(2,5,2,6,'#d92626'), p(12,5,2,6,'#d92626'), p(5,7,1,1,'#111'), p(10,7,1,1,'#1f55dd'), p(6,10,4,1,'#b41414'), p(6,13,4,2,'#3d60d8')],
      kinger: [p(4,2,8,11,'#f5eed2'), p(3,4,10,2,'#f5eed2'), p(6,5,4,4,'#6b3523'), p(6,10,1,1,'#111'), p(9,10,1,1,'#111'), p(5,1,6,1,'#ffd84a'), p(4,2,1,1,'#ffd84a'), p(11,2,1,1,'#ffd84a')],
      gangle: [p(5,3,6,5,'#f7f7f7'), p(5,3,6,1,'#d61f2c'), p(5,7,6,1,'#d61f2c'), p(6,5,1,1,'#111'), p(9,5,1,1,'#111'), p(7,6,2,1,'#d61f2c'), p(3,9,10,1,'#d61f2c'), p(2,11,4,1,'#d61f2c'), p(10,12,4,1,'#d61f2c')],
      zooble: [p(4,4,5,5,'#d633ff'), p(9,3,4,4,'#30d6ff'), p(3,9,4,3,'#b7e300'), p(8,9,5,2,'#ff7a30'), p(5,5,1,1,'#111'), p(10,5,1,1,'#111'), p(11,11,2,3,'#ff5eb8')],
      gummigoo: [p(3,3,10,6,'#d8a23a'), p(2,6,12,5,'#b87528'), p(4,5,2,1,'#111'), p(10,5,2,1,'#111'), p(5,10,6,2,'#fff1a8'), p(2,2,3,2,'#f0c765')],
      mannequin: [p(5,1,6,4,'#ff8a30'), p(6,5,4,2,'#d96d1f'), p(4,7,8,5,'#ff8a30'), p(3,12,3,4,'#ff8a30'), p(10,12,3,4,'#ff8a30'), p(6,3,1,1,'#111'), p(9,3,1,1,'#111')],
      npc: [p(4,2,8,5,'#c875ff'), p(5,7,6,7,'#7df0ff'), p(6,4,1,1,'#111'), p(9,4,1,1,'#111')],
      abstract: [p(3,3,10,10,'#050505'), p(4,5,2,2,'#ff3333'), p(10,7,2,2,'#ff3333'), p(6,11,5,1,'#ff3333')]
    };
    if (type === 'ghost') return [p(4,2,8,9,'#7df0ff'), p(5,4,2,2,'#ffffff'), p(9,4,2,2,'#ffffff'), p(4,11,2,3,'#7df0ff'), p(7,11,2,3,'#7df0ff'), p(10,11,2,3,'#7df0ff')];
    return patterns[type] || null;
  },

  drawCircusSimulationReticle(ctx, w, h, zone) {
    ctx.save();
    ctx.strokeStyle = '#fff1a8';
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 8, h / 2);
    ctx.lineTo(w / 2 + 8, h / 2);
    ctx.moveTo(w / 2, h / 2 - 8);
    ctx.lineTo(w / 2, h / 2 + 8);
    ctx.stroke();
    ctx.restore();
  },

  drawCircusConversationOverlay(ctx, w, h, state) {
    if (!state.interactionMessage || performance.now() > state.interactionUntil) return;
    const margin = 18;
    const choices = state.interactionChoices?.options || [];
    const stackChoices = choices.length > 0 && w < 480;
    ctx.save();
    ctx.font = 'bold 11px Courier New';
    const maxTextLines = choices.length ? (stackChoices ? 5 : 3) : 5;
    const textLines = this.getCircusCanvasTextLines(ctx, state.interactionMessage, w - margin * 2 - 20, maxTextLines);
    const choiceRows = choices.length ? (stackChoices ? choices.length : 1) : 0;
    const choiceBlockH = choiceRows * 30;
    const boxH = Math.min(h - 42, 46 + textLines.length * 13 + choiceBlockH + (choices.length ? 10 : 4));
    const boxY = h - boxH - 24;
    const channel = state.interactionChannel || 'system';
    const channelColor = channel === 'dialogue' ? '#fff1a8'
      : channel === 'scene' ? '#ff8ccc'
      : channel === 'scan' ? '#7df0ff'
        : channel === 'proximity' ? '#9cff6d'
          : '#ff8a7a';
    const channelLabel = channel === 'dialogue' ? `DIALOGUE - ${state.interactionSpeaker || 'PNJ'}`
      : channel === 'scene' ? `SCENE SOCIALE CAINOS - ${state.interactionSpeaker || 'GROUPE'}`
      : channel === 'scan' ? `SCAN CAINOS - ${state.interactionSpeaker || 'OBJET'}`
        : channel === 'proximity' ? `PROXIMITE - ${state.interactionSpeaker || 'SIGNAL'}`
          : `SYSTEME - ${state.interactionSpeaker || 'CAINOS'}`;
    ctx.fillStyle = 'rgba(5, 2, 13, 0.86)';
    ctx.strokeStyle = channelColor;
    ctx.lineWidth = 2;
    ctx.fillRect(margin, boxY, w - margin * 2, boxH);
    ctx.strokeRect(margin, boxY, w - margin * 2, boxH);
    ctx.fillStyle = channelColor;
    ctx.font = 'bold 9px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(channelLabel, margin + 10, boxY + 14);
    ctx.strokeStyle = `${channelColor}88`;
    ctx.beginPath();
    ctx.moveTo(margin + 10, boxY + 20);
    ctx.lineTo(w - margin - 10, boxY + 20);
    ctx.stroke();
    ctx.fillStyle = '#fff1a8';
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'left';
    textLines.forEach((line, index) => {
      ctx.fillText(line, margin + 10, boxY + 35 + index * 13);
    });
    if (choices.length) {
      const optionTop = boxY + 39 + textLines.length * 13;
      const gap = 8;
      const availableW = w - margin * 2 - 20;
      const optionW = stackChoices
        ? availableW
        : Math.floor((availableW - gap * (choices.length - 1)) / choices.length);
      choices.forEach((choice, index) => {
        const x = stackChoices ? margin + 10 : margin + 10 + index * (optionW + gap);
        const y = stackChoices ? optionTop + index * 30 : optionTop;
        state.hotspots.push({
          kind: 'dialogChoice',
          choiceIndex: index,
          x,
          y,
          w: optionW,
          h: 26,
          depth: -1
        });
        ctx.fillStyle = 'rgba(255,241,168,0.12)';
        ctx.strokeStyle = index === 0 ? '#ffffff' : '#fff1a8';
        ctx.lineWidth = index === 0 ? 2 : 1;
        ctx.fillRect(x, y, optionW, 26);
        ctx.strokeRect(x, y, optionW, 26);
        ctx.fillStyle = '#fff1a8';
        ctx.font = 'bold 9px Courier New';
        ctx.textAlign = 'center';
        const label = `${index + 1}. ${choice.label}`.slice(0, stackChoices ? 42 : 24);
        ctx.fillText(label, x + optionW / 2, y + 17);
      });
    }
    ctx.restore();
  },

  drawCircusSimulationExits(ctx, w, h, exits, portals, selectedIndex) {
    const state = this.circusDoom;
    if (!state) return;
    exits.forEach((targetId, index) => {
      const target = portals[targetId];
      if (!target) return;
      const row = Math.floor(index / 5);
      const col = index % 5;
      const rowCount = Math.min(5, exits.length - row * 5);
      const x = w / 2 - (rowCount - 1) * 58 + col * 116;
      const y = h - 56 - row * 48;
      const selected = index === selectedIndex;
      const locked = !target.unlocked;
      const box = { x: x - 44, y: y - 30, w: 88, h: 46, target: targetId, index };
      state.hotspots.push(box);
      ctx.fillStyle = locked ? 'rgba(20,20,26,0.88)' : 'rgba(10,6,20,0.86)';
      ctx.strokeStyle = selected ? '#ffffff' : (locked ? '#56505f' : target.color);
      ctx.lineWidth = selected ? 3 : 2;
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.fillStyle = locked ? '#8b8794' : target.color;
      ctx.font = 'bold 10px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(locked ? 'LOCKED' : target.short, x, y - 10);
      ctx.font = '8px Courier New';
      ctx.fillStyle = '#fff1a8';
      ctx.fillText(target.name.slice(0, 15), x, y + 5);
    });
    ctx.fillStyle = '#fff1a8';
    ctx.font = 'bold 9px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('CLIC / ENTREE: CHANGER DE LIEU  |  GAUCHE/DROITE: SORTIE  |  BAS: RETOUR', w / 2, h - 8);
  },

  drawCircusDoomSprites(ctx, w, h) {
    const state = this.circusDoom;
    const currentCell = state?.map[Math.floor(state.player.y)]?.[Math.floor(state.player.x)] ?? 0;
    const zone = state?.portals[currentCell];
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px Courier New';
    ctx.fillStyle = zone?.color || '#ffd84a';
    ctx.fillText(zone?.name || 'THE DIGITAL CIRCUS SIMULATION HUB', w / 2, 24);
    ctx.font = '10px Courier New';
    ctx.fillStyle = '#7df0ff';
    ctx.fillText('ZONES CONNUES // FIDELES AU DEROULE DES EPISODES // ASSETS ORIGINAUX', w / 2, 40);
    if (zone) {
      ctx.strokeStyle = zone.color;
      ctx.strokeRect(w / 2 - 66, h / 2 - 28, 132, 54);
      ctx.fillStyle = 'rgba(0,0,0,0.32)';
      ctx.fillRect(w / 2 - 64, h / 2 - 26, 128, 50);
      ctx.fillStyle = zone.color;
      ctx.font = 'bold 11px Courier New';
      ctx.fillText(zone.short, w / 2, h / 2 - 6);
      ctx.fillStyle = '#fff1a8';
      ctx.fillText(zone.unlocked ? 'ACCES AUTORISE' : 'INFO VERROUILLEE', w / 2, h / 2 + 12);
    }
    ctx.restore();
  },

  drawCircusDoomMap(ctx, map, portals, player) {
    const scale = 5;
    const ox = 10;
    const oy = 52;
    ctx.save();
    ctx.font = 'bold 5px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,0,0.52)';
    ctx.fillRect(ox - 4, oy - 4, map[0].length * scale + 8, map.length * scale + 8);
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const cell = map[y][x];
        if (cell === 1) ctx.fillStyle = '#5a1732';
        else if (portals[cell]) ctx.fillStyle = portals[cell].unlocked ? portals[cell].color : '#4b4b55';
        else ctx.fillStyle = '#111827';
        ctx.fillRect(ox + x * scale, oy + y * scale, scale - 1, scale - 1);
        if (portals[cell] && x > 0 && map[y][x - 1] !== cell) {
          ctx.fillStyle = '#05020d';
          ctx.fillText(portals[cell].short.slice(0, 2), ox + x * scale + scale, oy + y * scale + scale);
        }
      }
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ox + player.x * scale - 2, oy + player.y * scale - 2, 4, 4);
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(ox + player.x * scale, oy + player.y * scale);
    ctx.lineTo(ox + (player.x + Math.cos(player.a) * 0.7) * scale, oy + (player.y + Math.sin(player.a) * 0.7) * scale);
    ctx.stroke();
    ctx.restore();
  },

  shadeHex(hex, amount) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 255) * amount)));
    const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 255) * amount)));
    const b = Math.max(0, Math.min(255, Math.floor((num & 255) * amount)));
    return `rgb(${r},${g},${b})`;
  },

  // Window Management
  openWindow(winId) {
    const win = this.windows[winId];
    if (win) {
      win.style.display = 'flex';
      if (winId === 'vitals') {
        this.updateDiagnosticsUI();
      }
      if (winId === 'wacky-watch') {
        this.updateWackyWatchCastUI();
        this.renderCainOSJournal();
      }
      if (winId === 'trash') {
        this.renderTrashList();
      }
      if (winId === 'cainos-tools') {
        this.renderCainOSTools();
      }
      if (winId === 'simulations') {
        const powerLed = document.getElementById('power-led');
        if (powerLed && powerLed.classList.contains('active')) {
          SoundManager.startTheme();
        }
      }
      this.focusWindow(winId);
      this.updateTaskbar();
      this.fitOpenWindowsToDesktop();
    }
  },

  closeWindow(winId) {
    const win = this.windows[winId];
    if (win) {
      win.style.display = 'none';
      if (winId === 'simulations') {
        SoundManager.stopTheme();
        if (EpisodeManager.activeGame) EpisodeManager.activeGame.stop();
      }
      this.updateTaskbar();
      this.updateCainOSProvenance(this.activeWindow || 'desktop');
    }
  },

  closeAllWindows() {
    Object.keys(this.windows).forEach(winId => {
      const win = this.windows[winId];
      if (win) {
        win.style.display = 'none';
        win.classList.remove('active-window');
      }
    });
    this.activeWindow = null;
    this.selectedIcon = null;
    document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
    const startMenu = document.getElementById('start-menu');
    if (startMenu) startMenu.style.display = 'none';
    SoundManager.stopTheme();
    if (typeof SoundManager.stopContextPulse === 'function') SoundManager.stopContextPulse();
    if (EpisodeManager.activeGame) EpisodeManager.activeGame.stop();
    this.updateTaskbar();
    this.updateCainOSProvenance('desktop');
  },

  minimizeWindow(winId) {
    const win = this.windows[winId];
    if (win) {
      win.style.display = 'none';
      if (winId === 'simulations') {
        SoundManager.stopTheme();
      }
      this.updateTaskbar();
      this.updateCainOSProvenance('desktop');
    }
  },

  focusWindow(winId) {
    const win = this.windows[winId];
    if (win) {
      document.querySelectorAll('.window').forEach(w => w.classList.remove('active-window'));
      win.classList.add('active-window');
      this.activeWindow = winId;
      if (winId === 'simulations') {
        SoundManager.startTheme();
      } else {
        SoundManager.stopTheme();
      }
      this.updateTaskbar();
      this.updateCainOSProvenance(winId);
    }
  },

  toggleMaximize(winId) {
    const win = this.windows[winId];
    if (win) {
      if (win.style.width === '100%') {
        win.style.width = win.getAttribute('data-prev-w') || '450px';
        win.style.height = win.getAttribute('data-prev-h') || '350px';
        win.style.left = '50px';
        win.style.top = '40px';
      } else {
        win.setAttribute('data-prev-w', win.style.width);
        win.setAttribute('data-prev-h', win.style.height);
        win.style.width = '100%';
        win.style.height = '100%';
        win.style.left = '0';
        win.style.top = '0';
      }
      this.fitOpenWindowsToDesktop();
    }
  },

  updateTaskbar() {
    const tabsContainer = document.getElementById('taskbar-tabs');
    tabsContainer.innerHTML = "";

    for (let winId in this.windows) {
      const win = this.windows[winId];
      if (win.style.display !== 'none') {
        const title = win.querySelector('.window-title').innerText;
        const tab = document.createElement('div');
        tab.className = `taskbar-tab ${this.activeWindow === winId ? 'active' : ''}`;

        let iconClass = "icon-folder-sm";
        if (winId === 'simulations') iconClass = "icon-sim-sm";
        if (winId === 'vitals') iconClass = "icon-vitals-sm";
        if (winId === 'terminal') iconClass = "icon-term-sm";
        if (winId === 'wacky-watch') iconClass = "icon-watch-sm";

        tab.innerHTML = `<span class="icon-sm ${iconClass}"></span> ${title}`;
        tab.addEventListener('click', () => {
          SoundManager.playClick();
          if (this.activeWindow === winId && win.style.display !== 'none') {
            this.minimizeWindow(winId);
          } else {
            this.openWindow(winId);
          }
        });
        tabsContainer.appendChild(tab);
      }
    }
  },

  // File Manager
  isFileUnlocked(filename) {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];

    if (filename === 'vitals_pomni.log') {
      return this.isPomniNamed();
    }
    if (filename === 'kaufmo_final_state.log' || filename === 'caine_ai_module.txt') {
      return progress.includes(1);
    }
    if (filename === 'gummigoo_backup.tmp' || filename === 'abstraction_protocol.txt') {
      return progress.includes(2);
    }
    if (filename === 'caine_secret_protocols.log') {
      return progress.includes(3);
    }
    if (filename === 'spudsys_incident.txt' || filename === 'comedy_mask_test.log') {
      return progress.includes(4);
    }
    if (filename === 'suggestion_box_purge.txt' || filename === 'chaos_generator.log') {
      return progress.includes(5);
    }
    if (filename === 'weapons_licensing.txt' || filename === 'ragatha_repair_log.txt') {
      return progress.includes(6);
    }
    if (filename === 'lake_digital_anomaly.log' || filename === 'shrimp_npc_delete.tmp') {
      return progress.includes(7);
    }
    if (filename === 'caine_origin_debug.txt' || filename === 'queenie_memory_leak.log' || filename === 'character_mapping.txt') {
      return progress.includes(8); // Character mapping (civil names) is late game reveal (requires Ep 8 completed)
    }
    if (filename === 'exit_door_prototype_v3.obj' || filename === 'abel_kernel_patch.exe.enc' || filename === 'remember_error_report.log' || filename === 'brain_scan_truth.txt') {
      return progress.includes(9);
    }
    if (filename === 'abel_kernel_patch.exe') {
      return progress.includes(9);
    }
    return true; // Starter files
  },

  renderFileList() {
    const container = document.getElementById('file-list');
    container.innerHTML = "";

    const folder = FileSystem.currentFolder;
    const files = FileSystem.folders[folder];

    files.forEach(file => {
      if (!this.isFileUnlocked(file.name)) return;

      const item = document.createElement('div');
      item.className = "file-item";

      const isLog = file.name.endsWith('.log');
      const icon = isLog ? "icon-file-log-sm" : "icon-file-txt-sm";

      item.innerHTML = `
        <span class="icon-sm ${icon}"></span>
        <div class="file-info">
          <span>${file.name}</span>
          <span class="file-size">${file.content.length} B</span>
        </div>
      `;

      item.addEventListener('click', () => {
        SoundManager.playClick();
        document.querySelectorAll('.file-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });

      item.addEventListener('dblclick', () => {
        SoundManager.playClick();
        this.openFileViewer(file.name, file.content);
      });

      container.appendChild(item);
    });
  },

  openFileViewer(filename, content) {
    if (filename === 'caine_secret_protocols.log') {
      this.triggerCaineIntrusion();
      return;
    }

    // Unlock hidden Prequel Episode -2 (Fusion 1993) when reading the Caine origin log
    if (filename === 'caine_origin_debug.txt') {
      const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
      if (!progress.includes(-2)) {
        progress.push(-2);
        localStorage.setItem('tadc_progress', JSON.stringify(progress));
        if (typeof EpisodeManager !== 'undefined') {
          EpisodeManager.updateLocksUI();
        }
        setTimeout(() => {
          this.showDialog(
            "SIMULATION DÉBLOQUÉE",
            "DÉTECTION DE DONNÉES HISTORIQUES :\nLes journaux de débogage de 1993 révèlent le code de fusion de l'IA.\n\nL'Épisode Caché : 'Fusion 1993' (Épisode Ø) est disponible dans le panneau des simulations !"
          );
        }, 150);
      }
    }

    // Keep the assigned circus name hidden until Caine names the subject in Pilot.
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    let processedContent = content;
    if (!this.isPomniNamed()) {
      processedContent = processedContent.replace(/Pomni/g, "SUJET #251");
    }
    // The civil identity from Episode 9 stays hidden until the final reveal.
    if (!progress.includes(9)) {
      processedContent = processedContent.replace(/Abigail|Abby/g, "[IDENTITE VERROUILLEE]");
    }

    const reconstructedArchives = new Set([
      'headset_proposal.txt', 'subject_missing.txt', 'spudsys_incident.txt',
      'weapons_licensing.txt', 'caine_origin_debug.txt', 'exit_door_prototype_v3.obj',
      'ragatha_repair_log.txt', 'queenie_memory_leak.log', 'character_mapping.txt',
      'abel_kernel_patch.exe.enc', 'abel_kernel_patch.exe'
    ]);
    if (reconstructedArchives.has(filename)) {
      processedContent = `[RECONSTRUCTION CAINOS / NON CONFIRMEE PAR LE CANON]\nCe dossier est une hypothese interactive et ne remplace pas les revelations des episodes.\n\n${processedContent}`;
    }

    document.getElementById('file-list').style.display = "none";
    document.getElementById('file-viewer').style.display = "flex";
    document.getElementById('viewer-filename').innerText = filename;
    document.getElementById('viewer-content').innerText = processedContent;
  },

  renderTrashList() {
    const list = document.getElementById('trash-list');
    list.innerHTML = "";

    FileSystem.trash.forEach(file => {
      if (!this.isFileUnlocked(file.name)) return;

      const item = document.createElement('div');
      item.className = "trash-item";
      item.innerHTML = `
        <span class="icon-sm icon-file-txt-sm" style="filter:grayscale(1);"></span>
        <span>${file.name}</span>
      `;
      item.addEventListener('click', () => {
        SoundManager.playClick();
        document.querySelectorAll('.trash-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });
      item.addEventListener('dblclick', () => {
        SoundManager.playClick();
        this.triggerGlitch(200);
        this.showDialog(
          `FICHIER CORROMPU : ${file.name}`,
          `[DONNÉES RÉCUPÉRÉES DU SECTEUR SUPPRIMÉ]\n\n${file.content}\n\n[FIN DE FRAGMENT — INTÉGRITÉ: 12%]`
        );
      });
      list.appendChild(item);
    });
  },

  setupCainOSTools() {
    const tabTooltips = {
      map: 'Afficher les lieux de simulation visites et verrouilles.',
      content: 'Afficher le plan contenu episode par episode, les replays et les collectibles.',
      creator: 'Composer et lancer une aventure originale post-finale, explicitement non canon.',
      evidence: 'Afficher les preuves lore et leurs sources de progression.',
      inventory: 'Afficher les objets de scene recuperes dans la simulation.',
      relations: 'Afficher la confiance/tension par personnage.',
      achievements: 'Afficher les succes lore et progression.',
      inspector: 'Verifier les incoherences lore ou progression.',
      save: 'Exporter, importer ou reinitialiser la sauvegarde locale CainOS.',
      settings: 'Regler les options de confort, audio et accessibilite.'
    };
    document.querySelectorAll('.tools-tab').forEach(button => {
      const tabKey = button.getAttribute('data-tools-tab');
      if (tabTooltips[tabKey]) {
        button.setAttribute('title', tabTooltips[tabKey]);
        button.setAttribute('aria-label', tabTooltips[tabKey]);
      }
      button.addEventListener('click', () => {
        SoundManager.playClick();
        this.toolsActiveTab = button.getAttribute('data-tools-tab') || 'map';
        document.querySelectorAll('.tools-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tools-panel').forEach(panel => panel.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(`tools-tab-${this.toolsActiveTab}`)?.classList.add('active');
        this.renderCainOSTools();
      });
    });

    const enabledByDefault = new Set(['canon-strict', 'auto-fit-windows', 'fps-minimap', 'fps-hud', 'fps-interaction-assist']);
    [
      'canon-strict', 'comfort-reading', 'line-pause', 'easy-minigames', 'reader-only',
      'crt-readable', 'high-contrast', 'reduce-motion', 'auto-fit-windows',
      'fps-minimap', 'fps-hud', 'fps-invert-mouse', 'fps-interaction-assist'
    ].forEach(key => {
      const input = document.getElementById(`setting-${key}`);
      if (!input) return;
      input.checked = !!this.getCainOSSetting(key, enabledByDefault.has(key));
      input.addEventListener('change', () => {
        this.setCainOSSetting(key, input.checked);
        this.applyCainOSSettings();
        if (this.circusDoom && key === 'fps-minimap') this.circusDoom.minimapVisible = input.checked;
        if (this.circusDoom && key === 'fps-hud') this.circusDoom.hudVisible = input.checked;
        if (this.circusDoom && key === 'fps-invert-mouse') this.circusDoom.invertMouse = input.checked;
        if (this.circusDoom && key === 'fps-interaction-assist') this.circusDoom.interactionAssist = input.checked;
        if (key === 'canon-strict') this.updateWackyWatchCastUI();
        this.renderCainOSTools();
      });
    });

    ['ui-scale', 'scanline-intensity', 'audio-ambience', 'audio-glitch', 'fps-fov', 'fps-sensitivity', 'fps-motion-intensity'].forEach(key => {
      const input = document.getElementById(`setting-${key}`);
      if (!input) return;
      const fallback = key === 'ui-scale' ? 110
        : key === 'scanline-intensity' ? 45
          : key === 'audio-ambience' ? 70
            : key === 'audio-glitch' ? 45
              : key === 'fps-fov' ? 64
                : key === 'fps-motion-intensity' ? 100
                  : 45;
      input.value = String(this.getCainOSSetting(key, fallback));
      input.addEventListener('input', () => {
        this.setCainOSSetting(key, Number(input.value));
        this.applyCainOSSettings();
        if (this.circusDoom && key === 'fps-fov') this.circusDoom.fov = Number(input.value) * Math.PI / 180;
        if (this.circusDoom && key === 'fps-sensitivity') this.circusDoom.mouseSensitivity = Number(input.value) / 10000;
        if (this.circusDoom && key === 'fps-motion-intensity') this.circusDoom.motionIntensity = Number(input.value) / 100;
      });
    });

    const strictToggle = document.getElementById('tools-canon-strict-toggle');
    strictToggle?.addEventListener('click', () => {
      SoundManager.playClick();
      const next = !this.isCainOSCanonStrict();
      this.setCainOSSetting('canon-strict', next);
      const strictInput = document.getElementById('setting-canon-strict');
      if (strictInput) strictInput.checked = next;
      this.applyCainOSSettings();
      this.updateWackyWatchCastUI();
      this.renderCainOSTools();
    });

    const bindingOptions = [
      ['z', 'Z'], ['w', 'W'], ['s', 'S'], ['q', 'Q'], ['a', 'A'], ['d', 'D'], ['e', 'E'],
      ['f', 'F'], ['c', 'C'], ['j', 'J'], ['m', 'M'], ['shift', 'MAJ'], ['r', 'R'], ['x', 'X'], ['v', 'V']
    ];
    const bindings = this.getCircusControlBindings();
    document.querySelectorAll('[data-fps-binding]').forEach(select => {
      const action = select.getAttribute('data-fps-binding');
      select.title = `Choisir la touche pour l action FPS: ${action}.`;
      select.innerHTML = bindingOptions.map(([value, label]) => `<option value="${value}" ${bindings[action] === value ? 'selected' : ''}>${label}</option>`).join('');
      select.addEventListener('change', () => {
        const next = this.getCircusControlBindings();
        Object.keys(next).forEach(other => {
          if (other !== action && next[other] === select.value) next[other] = bindings[other];
        });
        next[action] = select.value;
        this.setCainOSSetting('fps-bindings', next);
        if (this.circusDoom) this.circusDoom.controlBindings = next;
      });
    });

    this.applyCainOSSettings();
    this.setupCainOSSaveManager();
    this.setupCainOSToolActions();
    this.renderCainOSTools();
  },

  getCainOSStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(`cainos_${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  setCainOSStorage(key, value) {
    localStorage.setItem(`cainos_${key}`, JSON.stringify(value));
  },

  getCainOSSetting(key, fallback = false) {
    const settings = this.getCainOSStorage('settings', {});
    return Object.prototype.hasOwnProperty.call(settings, key) ? settings[key] : fallback;
  },

  setCainOSSetting(key, value) {
    const settings = this.getCainOSStorage('settings', {});
    settings[key] = value;
    this.setCainOSStorage('settings', settings);
  },

  isCainOSCanonStrict() {
    return this.getCainOSSetting('canon-strict', true) !== false;
  },

  getCainOSProvenanceMeta(kind = 'reconstruction') {
    const definitions = {
      transcript: {
        label: 'CANON TRANSCRIPT',
        detail: 'Dialogue source conserve ligne par ligne; les interactions autour sont additives.'
      },
      'canon-visual': {
        label: 'CANON VISUEL',
        detail: 'Presence ou apparence rattachee a un episode; les mesures CainOS restent des estimations.'
      },
      'canon-summary': {
        label: 'SYNTHESE CANON',
        detail: 'Resume indexe sur les episodes debloques, sans remplacer leur transcript.'
      },
      playable: {
        label: 'RECONSTITUTION JOUABLE',
        detail: 'Espace ou action reconstruit par CainOS depuis le lore connu.'
      },
      fan: {
        label: 'FAN POST-GAME',
        detail: 'Contenu original hors chronologie principale, disponible seulement comme bonus.'
      },
      production: {
        label: 'ARCHIVE DE PRODUCTION',
        detail: 'Materiel promotionnel ou de production externe aux episodes; il ne fait pas partie de la timeline jouable.'
      },
      reconstruction: {
        label: 'RECONSTRUCTION CAINOS',
        detail: 'Archive interactive ou hypothese C&A non confirmee par les episodes.'
      }
    };
    return { kind: definitions[kind] ? kind : 'reconstruction', ...(definitions[kind] || definitions.reconstruction) };
  },

  updateCainOSProvenance(scope = null) {
    const badge = document.getElementById('cainos-provenance-badge');
    const text = document.getElementById('cainos-provenance-text');
    if (!badge || !text) return;

    let kind = 'reconstruction';
    const activeScope = scope || (this.circusDoom ? 'fps' : this.activeWindow || 'desktop');
    if (activeScope === 'story') kind = 'transcript';
    else if (activeScope === 'micro' || activeScope === 'fps' || activeScope === 'tent') kind = 'playable';
    else if (activeScope === 'fan') kind = 'fan';
    else if (activeScope === 'wacky-watch') {
      kind = this.getWackyProvenanceKind(this.activeWackyCast, this.getWackyCastData?.()[this.activeWackyCast]);
    } else if (activeScope === 'simulations') {
      if (document.getElementById('sim-story-screen')?.classList.contains('active')) kind = 'transcript';
      else if (document.getElementById('sim-story-micro-screen')?.classList.contains('active')) kind = 'playable';
    }

    if (this.circusDoom?.customAdventure?.active) kind = 'fan';
    const meta = this.getCainOSProvenanceMeta(kind);
    badge.className = `provenance-badge provenance-${meta.kind}`;
    badge.innerText = meta.label;
    text.innerText = `${meta.detail}${this.isCainOSCanonStrict() ? ' Mode canon strict actif.' : ''}`;
    document.body.dataset.provenance = meta.kind;
  },

  fitOpenWindowsToDesktop() {
    if (!this.getCainOSSetting('auto-fit-windows', true)) return;
    const container = document.getElementById('windows-container');
    if (!container) return;
    const maxWidth = Math.max(280, container.clientWidth);
    const maxHeight = Math.max(220, container.clientHeight);
    Object.values(this.windows || {}).forEach(win => {
      if (!win || win.style.display === 'none') return;
      if (win.style.width === '100%') {
        win.style.height = '100%';
        win.style.left = '0';
        win.style.top = '0';
        return;
      }
      if (win.offsetWidth > maxWidth) win.style.width = `${maxWidth}px`;
      if (win.offsetHeight > maxHeight) win.style.height = `${maxHeight}px`;
      const left = Math.max(0, Math.min(parseFloat(win.style.left) || 0, maxWidth - win.offsetWidth));
      const top = Math.max(0, Math.min(parseFloat(win.style.top) || 0, maxHeight - win.offsetHeight));
      win.style.left = `${left}px`;
      win.style.top = `${top}px`;
    });
  },

  applyCainOSSettings() {
    document.body.classList.toggle('comfort-reading', !!this.getCainOSSetting('comfort-reading'));
    document.body.classList.toggle('crt-readable', !!this.getCainOSSetting('crt-readable'));
    document.body.classList.toggle('canon-strict', this.isCainOSCanonStrict());
    document.body.classList.toggle('high-contrast', !!this.getCainOSSetting('high-contrast'));
    document.body.classList.toggle('reduce-motion', !!this.getCainOSSetting('reduce-motion'));
    const uiScale = Math.max(90, Math.min(140, Number(this.getCainOSSetting('ui-scale', 110)) || 110));
    const scanlineIntensity = Math.max(0, Math.min(100, Number(this.getCainOSSetting('scanline-intensity', 45)) || 0));
    const uiRatio = uiScale / 100;
    document.documentElement.style.setProperty('--ui-text-scale', String(uiRatio));
    document.documentElement.style.setProperty('--ui-font-tiny', `${(9 * uiRatio).toFixed(2)}px`);
    document.documentElement.style.setProperty('--ui-font-small', `${(10 * uiRatio).toFixed(2)}px`);
    document.documentElement.style.setProperty('--ui-font-base', `${(12 * uiRatio).toFixed(2)}px`);
    document.documentElement.style.setProperty('--ui-font-large', `${(16 * uiRatio).toFixed(2)}px`);
    document.documentElement.style.setProperty('--crt-scanline-opacity', String(scanlineIntensity / 100));
    const uiOutput = document.getElementById('setting-ui-scale-value');
    const scanlineOutput = document.getElementById('setting-scanline-intensity-value');
    if (uiOutput) uiOutput.value = `${uiScale}%`;
    if (scanlineOutput) scanlineOutput.value = `${scanlineIntensity}%`;
    const strictToggle = document.getElementById('tools-canon-strict-toggle');
    if (strictToggle) {
      strictToggle.innerText = `CANON STRICT: ${this.isCainOSCanonStrict() ? 'ON' : 'OFF'}`;
      strictToggle.setAttribute('aria-pressed', this.isCainOSCanonStrict() ? 'true' : 'false');
    }
    this.fitOpenWindowsToDesktop();
    this.updateCainOSProvenance();
    if (typeof SoundManager !== 'undefined') {
      SoundManager.ambienceVolume = Number(this.getCainOSSetting('audio-ambience', 70)) / 100;
      SoundManager.glitchVolume = Number(this.getCainOSSetting('audio-glitch', 45)) / 100;
    }
  },

  setupCainOSToolActions() {
    const root = document.getElementById('win-cainos-tools');
    if (!root || root.dataset.actionsReady === 'true') return;
    root.dataset.actionsReady = 'true';
    root.addEventListener('click', event => {
      const button = event.target.closest('[data-tools-action]');
      if (!button) return;
      const action = button.getAttribute('data-tools-action');
      const episode = Number(button.getAttribute('data-episode'));
      const subepisode = button.hasAttribute('data-subepisode') ? Number(button.getAttribute('data-subepisode')) : null;
      if (action === 'open-episode' && typeof EpisodeManager !== 'undefined' && Number.isFinite(episode)) {
        SoundManager.playClick();
        this.openWindow('simulations');
        EpisodeManager.selectEpisode(episode);
        if (Number.isInteger(subepisode)) {
          EpisodeManager.selectedSubepisodeIndex = subepisode;
          EpisodeManager.renderSubepisodeMenu(episode);
          EpisodeManager.updateSubepisodeStartButton(episode);
        }
      }
      if (action === 'play-subepisode' && typeof EpisodeManager !== 'undefined' && Number.isFinite(episode) && Number.isInteger(subepisode)) {
        const mode = button.getAttribute('data-mode') || 'text';
        SoundManager.playClick();
        this.openWindow('simulations');
        EpisodeManager.selectEpisode(episode);
        EpisodeManager.selectedSubepisodeIndex = subepisode;
        EpisodeManager.renderSubepisodeMenu(episode);
        EpisodeManager.updateSubepisodeStartButton(episode);
        if (mode === 'text' || mode === 'micro') {
          EpisodeManager.startSubepisode(episode, subepisode);
          if (mode === 'micro') {
            setTimeout(() => EpisodeManager.skipToActiveSubepisodeMicroGame?.(), 180);
          }
        }
      }
      if (action === 'open-zone') {
        SoundManager.playClick();
        this.showCircusDosPreview();
        setTimeout(() => {
          this.enterCircusInteriorView();
          const zone = Number(button.getAttribute('data-zone'));
          if (Number.isFinite(zone)) this.setCircusSimulationZone(zone, true);
        }, 120);
      }
      if (action === 'create-adventure') {
        this.createCainOSCustomAdventureFromForm();
      }
      if (action === 'launch-adventure') {
        this.launchCainOSCustomAdventure(button.getAttribute('data-adventure-id'));
      }
      if (action === 'delete-adventure') {
        this.deleteCainOSCustomAdventure(button.getAttribute('data-adventure-id'));
      }
    });
  },

  setupCainOSSaveManager() {
    const exportBtn = document.getElementById('btn-save-export');
    const importBtn = document.getElementById('btn-save-import');
    const resetSkinsBtn = document.getElementById('btn-save-reset-skins');
    const resetEpisodesBtn = document.getElementById('btn-save-reset-episodes');
    const resetAllBtn = document.getElementById('btn-save-reset-all');
    const buffer = document.getElementById('save-manager-buffer');
    const status = document.getElementById('save-manager-status');
    if (!buffer || buffer.dataset.ready === 'true') return;
    buffer.dataset.ready = 'true';
    const setStatus = text => { if (status) status.innerText = text; };
    exportBtn?.addEventListener('click', () => {
      buffer.value = JSON.stringify(this.exportCainOSSave(), null, 2);
      setStatus('Export genere dans le buffer SAVE_MANAGER.sys.');
      SoundManager.playWin();
    });
    importBtn?.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(buffer.value);
        this.importCainOSSave(parsed);
        setStatus('Save importee. Les fenetres CainOS ont ete rafraichies.');
        SoundManager.playWin();
      } catch (e) {
        setStatus('Import refuse: JSON invalide ou incomplet.');
        SoundManager.playError();
      }
    });
    resetSkinsBtn?.addEventListener('click', () => {
      localStorage.removeItem('cainos_purchased_wacky_skins');
      this.updateWackyWatchCastUI();
      this.renderCainOSTools();
      setStatus('Skins achetes reinitialises.');
    });
    resetEpisodesBtn?.addEventListener('click', () => {
      this.resetCainOSKeys(/^tadc_progress$|^tadc_subepisode_progress_/);
      EpisodeManager.updateLocksUI?.();
      EpisodeManager.showStartScreen?.(EpisodeManager.currentEpisode ?? 0);
      this.updateWackyWatchCastUI();
      this.renderCainOSTools();
      setStatus('Progression episodes reinitialisee.');
    });
    resetAllBtn?.addEventListener('click', () => {
      this.resetCainOSKeys(/^tadc_|^cainos_/);
      this.applyCainOSSettings();
      EpisodeManager.updateLocksUI?.();
      this.updateWackyWatchCastUI();
      this.renderCainOSTools();
      setStatus('Reset total local effectue.');
    });
    document.getElementById('save-slot-list')?.addEventListener('click', event => {
      const button = event.target.closest('[data-save-slot-action]');
      if (!button) return;
      const slot = Number(button.getAttribute('data-save-slot'));
      const action = button.getAttribute('data-save-slot-action');
      if (action === 'save') this.saveCainOSProfileSlot(slot);
      if (action === 'load') this.loadCainOSProfileSlot(slot);
      if (action === 'delete') this.deleteCainOSProfileSlot(slot);
      this.renderCainOSSaveSlots();
    });
    this.renderCainOSSaveSlots();
  },

  resetCainOSKeys(pattern) {
    Object.keys(localStorage)
      .filter(key => pattern.test(key))
      .forEach(key => localStorage.removeItem(key));
  },

  exportCainOSSave() {
    const keys = Object.keys(localStorage).filter(key => /^tadc_|^cainos_/.test(key) && key !== 'cainos_save_slots');
    return {
      schema: 'CainOS_SAVE_V1',
      exportedAt: new Date().toISOString(),
      data: Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)]))
    };
  },

  importCainOSSave(save) {
    if (!save || save.schema !== 'CainOS_SAVE_V1' || !save.data || typeof save.data !== 'object') {
      throw new Error('Invalid CainOS save');
    }
    Object.entries(save.data).forEach(([key, value]) => {
      if (/^tadc_|^cainos_/.test(key) && typeof value === 'string') localStorage.setItem(key, value);
    });
    this.applyCainOSSettings();
    this.updateWackyWatchCastUI();
    this.renderCainOSJournal();
    this.renderCainOSTools();
  },

  getCainOSProfileSlots() {
    const slots = this.getCainOSStorage('save_slots', []);
    return Array.from({ length: 3 }, (_, index) => slots[index] || null);
  },

  saveCainOSProfileSlot(index) {
    if (!Number.isInteger(index) || index < 0 || index > 2) return;
    this.saveCircusPersistentWorldState();
    const slots = this.getCainOSProfileSlots();
    const progress = typeof EpisodeManager !== 'undefined' ? EpisodeManager.getProgress() : [];
    slots[index] = {
      savedAt: new Date().toISOString(),
      episode: progress.length ? Math.max(...progress.filter(ep => ep <= 9)) : 0,
      zone: this.circusDoom?.currentZoneId || this.getCircusPersistentWorldState().currentZoneId,
      save: this.exportCainOSSave()
    };
    this.setCainOSStorage('save_slots', slots);
    SoundManager.playWin();
  },

  loadCainOSProfileSlot(index) {
    const slot = this.getCainOSProfileSlots()[index];
    if (!slot?.save) return SoundManager.playError();
    const preservedSlots = localStorage.getItem('cainos_save_slots');
    this.resetCainOSKeys(/^tadc_|^cainos_/);
    if (preservedSlots) localStorage.setItem('cainos_save_slots', preservedSlots);
    this.importCainOSSave(slot.save);
    EpisodeManager.updateLocksUI?.();
    SoundManager.playWin();
  },

  deleteCainOSProfileSlot(index) {
    const slots = this.getCainOSProfileSlots();
    slots[index] = null;
    this.setCainOSStorage('save_slots', slots);
    SoundManager.playClick();
  },

  renderCainOSSaveSlots() {
    const container = document.getElementById('save-slot-list');
    if (!container) return;
    container.innerHTML = this.getCainOSProfileSlots().map((slot, index) => `
      <article class="save-slot-card">
        <strong>PROFIL ${index + 1}</strong>
        <span>${slot ? `EP${slot.episode} / ZONE ${slot.zone}` : 'VIDE'}</span>
        <span>${slot ? new Date(slot.savedAt).toLocaleString('fr-FR') : 'Aucune sauvegarde'}</span>
        <div class="save-slot-actions">
          <button class="retro-btn" data-save-slot-action="save" data-save-slot="${index}">SAUVER</button>
          <button class="retro-btn" data-save-slot-action="load" data-save-slot="${index}" ${slot ? '' : 'disabled'}>CHARGER</button>
          <button class="retro-btn" data-save-slot-action="delete" data-save-slot="${index}" ${slot ? '' : 'disabled'}>VIDER</button>
        </div>
      </article>
    `).join('');
  },

  getCainOSVisitedZones() {
    return this.getCainOSStorage('visited_zones', [2]);
  },

  markCainOSZoneVisited(zoneId) {
    const zones = this.getCainOSVisitedZones();
    if (!zones.includes(zoneId)) {
      zones.push(zoneId);
      this.setCainOSStorage('visited_zones', zones);
      this.unlockCainOSAchievement('mapper', 'Cartographe du chapiteau');
    }
    this.renderCainOSTools();
  },

  getCainOSRelations() {
    return {
      pomni: 42, ragatha: 56, jax: 24, kinger: 38, gangle: 44, zooble: 31, caine: 18,
      ...this.getCainOSStorage('relations', {})
    };
  },

  adjustCainOSRelation(key, delta) {
    const aliases = {
      workgangle: 'gangle', beachgangle: 'gangle', japanesegangle: 'gangle', rhinogangle: 'gangle',
      hunterjax: 'jax', eviljax: 'jax', jaxgirl: 'jax',
      evilpomni: 'pomni', horrorpomnivoid: 'pomni', horrorpomnispiral: 'pomni', horrorpomniskull: 'pomni',
      evilragatha: 'ragatha', evilkinger: 'kinger', evilzooble: 'zooble'
    };
    key = aliases[key] || key;
    const relations = this.getCainOSRelations();
    relations[key] = Math.max(0, Math.min(100, (relations[key] || 35) + delta));
    this.setCainOSStorage('relations', relations);
    if (relations[key] >= 70) this.unlockCainOSAchievement(`trust_${key}`, `Lien stabilise: ${key}`);
    this.renderCainOSTools();
  },

  getCainOSAchievements() {
    return this.getCainOSStorage('achievements', {});
  },

  unlockCainOSAchievement(id, title) {
    const achievements = this.getCainOSAchievements();
    if (!achievements[id]) {
      achievements[id] = { title, at: new Date().toISOString() };
      this.setCainOSStorage('achievements', achievements);
    }
  },

  getCainOSLoreZones() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const unlocked = ep => ep === 0 || progress.includes(ep) || progress.some(done => done > ep && done <= 9);
    return [
      { id: 2, ep: 0, name: 'Chapiteau / piste', desc: 'Hub stable du Cirque et retour naturel des aventures.', item: 'Plan du chapiteau', unlocked: true },
      { id: 4, ep: 1, name: 'Cellar / Kaufmo', desc: 'Archive dangereuse de Kaufmo abstrait.', item: 'Fragment abstrait', unlocked: unlocked(1) },
      { id: 5, ep: 1, name: 'Porte de sortie / Vide', desc: 'Fausse issue et bureaux impossibles.', item: 'Trace de porte rouge', unlocked: unlocked(1) },
      { id: 6, ep: 2, name: 'Candy Canyon', desc: 'Convoi de sirop et faille de memoire PNJ.', item: 'Ticket sirop', unlocked: unlocked(2) },
      { id: 8, ep: 3, name: 'Mildenhall Manor', desc: 'Zone mature, peur, fantome et souvenirs enfouis.', item: 'Bougie du manoir', unlocked: unlocked(3) },
      { id: 10, ep: 4, name: "Spudsy's", desc: 'Pression de service et masque de Gangle.', item: 'Ticket Spudsy', unlocked: unlocked(4) },
      { id: 11, ep: 5, name: 'Suggestion Box', desc: 'Hub des micro-aventures canoniques d Untitled.', item: 'Fiche suggestion', unlocked: unlocked(5) },
      { id: 12, ep: 5, name: 'Softball Stadium', desc: 'Match canon contre les Evil Big Tops.', item: 'Balle du match', unlocked: unlocked(5) },
      { id: 24, ep: 5, name: "Poacher's Paradise", desc: 'Chasse et transformations animales d Untitled.', item: 'Badge de chasse', unlocked: unlocked(5) },
      { id: 25, ep: 5, name: 'Anime High School', desc: 'Micro-aventure scolaire anime.', item: 'Carte scolaire', unlocked: unlocked(5) },
      { id: 26, ep: 5, name: 'White House Adventure', desc: 'Micro-aventure politique de Pomni.', item: 'Dossier presidentiel', unlocked: unlocked(5) },
      { id: 13, ep: 6, name: 'Arena armes', desc: 'Epreuves virtuelles, scores et tensions de groupe.', item: 'Douille virtuelle', unlocked: unlocked(6) },
      { id: 14, ep: 7, name: 'Digital Lake', desc: 'Fausse pause, soleil dangereux et PNJ fragiles.', item: 'Coquillage digital', unlocked: unlocked(7) },
      { id: 16, ep: 8, name: 'Caine Office / Core', desc: 'Bureau et couches techniques de Caine; Abel reste un PNJ supprime.', item: 'Pass admin', unlocked: unlocked(8) },
      { id: 20, ep: 1, name: 'Resident Hall', desc: 'Couloir des chambres et portes personnalisees.', item: 'Cle de chambre', unlocked: unlocked(1) },
      { id: 44, ep: 1, name: 'Chambre de Jax', desc: 'Espace prive relie a la porte de Jax; reconstruction partielle.', item: 'Plaque Jax', unlocked: unlocked(1) },
      { id: 45, ep: 1, name: 'Chambre de Pomni', desc: 'Espace prive relie a la porte de Pomni; reconstruction partielle.', item: 'Plaque Pomni', unlocked: unlocked(1) },
      { id: 46, ep: 1, name: 'Chambre de Ragatha', desc: 'Reconstruction inspiree des representations officielles.', item: 'Plaque Ragatha', unlocked: unlocked(1) },
      { id: 47, ep: 9, name: 'Chambre de Gangle', desc: 'Piece sombre, lit rouge et espace de dessin vus dans Remember.', item: 'Dessin de Gangle', unlocked: unlocked(9) },
      { id: 48, ep: 1, name: 'Chambre de Zooble', desc: 'Piece coloree avec lit, miroirs et Zooble Box.', item: 'Piece Zooble', unlocked: unlocked(1) },
      { id: 49, ep: 1, name: 'Chambre de Kinger', desc: 'Reconstruction officielle partielle au sol en damier.', item: 'Piece d echecs', unlocked: unlocked(1) },
      { id: 50, ep: 9, name: 'Dorm Hall / Annexe ouest', desc: 'Portes barrees des anciens membres, sans occupants actifs.', item: 'Registre ouest', unlocked: unlocked(9) },
      { id: 51, ep: 9, name: 'Dorm Hall / Annexe est', desc: 'Seconde rangee de portes barrees et chambres abandonnees.', item: 'Registre est', unlocked: unlocked(9) },
      { id: 21, ep: 8, name: "Crow's Nest / Cafe Cirque", desc: 'Lieu de retrait et de discussion tardive.', item: 'Tasse du cafe', unlocked: unlocked(8) },
      { id: 17, ep: 8, name: 'Kinger Memory Buffer', desc: 'Souvenirs de Queenie sans restauration active.', item: 'Piece memoire', unlocked: unlocked(8) },
      { id: 18, ep: 9, name: 'Final Circus', desc: 'Brain scans, reves, couleur et choix de Pomni.', item: 'Fragment couleur', unlocked: unlocked(9) },
      { id: 19, ep: 9, name: 'Circus Members Archive', desc: 'Projection CainOS non physique des membres disparus.', item: 'Badge archive', unlocked: unlocked(9) },
      { id: 22, ep: 9, name: 'Aquarium', desc: 'Zone aquatique revelee dans Remember.', item: 'Fragment aquarium', unlocked: unlocked(9) },
      { id: 23, ep: 9, name: 'Snowy Summit', desc: 'Lieu rattache aux souvenirs de Jax et Ribbit.', item: 'Fragment neige', unlocked: unlocked(9) }
      ,{ id: 27, ep: 1, name: 'The Void', desc: 'Espace infini autour du Cirque, distinct de la fausse sortie.', item: 'Coordonnee du Vide', unlocked: unlocked(1) }
      ,{ id: 28, ep: 1, name: 'Tent Common Area', desc: 'Espace commun interne du chapiteau.', item: 'Jeton de salon', unlocked: unlocked(1) }
      ,{ id: 29, ep: 1, name: 'Door Gallery / Tubes', desc: 'Portes aleatoires, tunnels et toboggans internes.', item: 'Cle aleatoire', unlocked: unlocked(1) }
      ,{ id: 30, ep: 6, name: 'Loser Corner', desc: 'Coin de punition des jeux internes.', item: 'Ruban perdant', unlocked: unlocked(6) }
      ,{ id: 31, ep: 1, name: 'The Nest Archive', desc: 'Reconstruction de l aventure interne supprimee.', item: 'Fragment Nest', unlocked: unlocked(1) }
      ,{ id: 32, ep: 2, name: 'Candy Royal Palace', desc: 'Audience royale et briefing du convoi.', item: 'Sceau royal sucre', unlocked: unlocked(2) }
      ,{ id: 33, ep: 2, name: 'Syrup Tanker Route', desc: 'Route du convoi et poursuite des bandits.', item: 'Jauge de sirop', unlocked: unlocked(2) }
      ,{ id: 34, ep: 3, name: 'Mildenhall Hell', desc: 'Ames, possession de Pomni et ancrage de Kinger.', item: 'Trace d ame', unlocked: unlocked(3) }
      ,{ id: 35, ep: 4, name: "Spudsy's Kitchen", desc: 'Postes de preparation et tickets de cuisine.', item: 'Ticket cuisine', unlocked: unlocked(4) }
      ,{ id: 36, ep: 4, name: "Spudsy's Bathroom", desc: 'Sous-zone biohazard mentionnee pendant le service.', item: 'Badge sanitaire', unlocked: unlocked(4) }
      ,{ id: 37, ep: 4, name: 'Training Room', desc: 'Video de formation imposee a Jax.', item: 'Cassette formation', unlocked: unlocked(4) }
      ,{ id: 38, ep: 6, name: 'Favorite Character Awards', desc: 'Scene de ceremonie apres les epreuves.', item: 'Trophee favori', unlocked: unlocked(6) }
      ,{ id: 39, ep: 7, name: 'Lake Lighthouse', desc: 'Phare et toboggan du lac digital.', item: 'Balise du phare', unlocked: unlocked(7) }
      ,{ id: 40, ep: 7, name: 'Sunken Treasure', desc: 'Coffre pille et poissons du fond du lac.', item: 'Coffre vide', unlocked: unlocked(7) }
      ,{ id: 41, ep: 7, name: 'C&A Street Memory', desc: 'Souvenir incomplet de Jax, non exploitable comme sortie.', item: 'Photo de rue', unlocked: unlocked(7) }
      ,{ id: 42, ep: 1, name: 'Digital Carnival Overlook', desc: 'Fete foraine visible mais jamais visitee.', item: 'Ticket non utilise', unlocked: unlocked(1) }
      ,{ id: 43, ep: 1, name: 'Tent Dining Area', desc: 'Table commune du niveau principal.', item: 'Assiette digitale', unlocked: unlocked(1) }
    ];
  },

  getCainOSContentMatrix() {
    if (typeof EpisodeManager === 'undefined') return [];
    const progress = EpisodeManager.getProgress();
    const zoneByEpisode = {
      1: [2, 4, 5, 20, 27, 28, 29, 31, 42, 43],
      2: [6, 7, 32, 33],
      3: [8, 9, 34],
      4: [10, 35, 36, 37],
      5: [11, 12, 24, 25, 26],
      6: [13, 30, 38],
      7: [14, 15, 39, 40, 41],
      8: [16, 17, 21],
      9: [18, 19, 22, 23]
    };
    return Array.from({ length: 9 }, (_, offset) => {
      const ep = offset + 1;
      const segments = EpisodeManager.getSubepisodeSegments?.(ep) || [];
      const completed = EpisodeManager.getSubepisodeProgress?.(ep) || [];
      const zones = (zoneByEpisode[ep] || []).map(zoneId => this.getCainOSLoreZones().find(zone => zone.id === zoneId)).filter(Boolean);
      const next = segments.find(segment => !completed.includes(segment.index));
      return {
        ep,
        title: EpisodeManager.storyData?.[ep]?.title || `Episode ${ep}`,
        total: segments.length,
        completed: completed.length,
        done: progress.includes(ep),
        next,
        zones,
        segments
      };
    });
  },

  getCainOSCollectibles() {
    const visited = this.getCainOSVisitedZones();
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const subDone = ep => (typeof EpisodeManager !== 'undefined') ? (EpisodeManager.getSubepisodeProgress?.(ep) || []) : [];
    const unlocked = (ep, sub = null) => progress.includes(ep) || progress.some(done => done > ep && done <= 9) || (sub !== null && subDone(ep).includes(sub));
    return [
      { id: 'ticket_exit', ep: 1, sub: 2, zone: 5, title: 'Trace de porte rouge', desc: 'Preuve que la sortie est une illusion exploitable, pas une liberation valide.' },
      { id: 'gloink_chip', ep: 1, sub: 4, zone: 3, title: 'Eclat Gloink', desc: 'Petit fragment vole au decor pendant la proliferation Gloink.' },
      { id: 'syrup_ticket', ep: 2, sub: 3, zone: 6, title: 'Bon de sirop', desc: 'Repere Candy Canyon lie au convoi et a Gummigoo.' },
      { id: 'gummigoo_memory', ep: 2, sub: 5, zone: 6, title: 'Memoire PNJ', desc: 'Fragment de profil a manipuler sans pretendre que Gummigoo est humain.' },
      { id: 'mildenhall_candle', ep: 3, sub: 1, zone: 8, title: 'Bougie Mildenhall', desc: 'Objet-lumiere de la zone horreur, utile contre les leurres.' },
      { id: 'queenie_piece', ep: 3, sub: 6, zone: 17, title: 'Piece Queenie', desc: 'Souvenir archive : il stabilise Kinger sans restaurer Queenie comme PNJ actif.' },
      { id: 'spudsy_receipt', ep: 4, sub: 3, zone: 10, title: 'Ticket Spudsy', desc: 'Collectible de service, lie au masque et a la pression de Gangle.' },
      { id: 'suggestion_stub', ep: 5, sub: 1, zone: 11, title: 'Fiche suggestion', desc: 'Declencheur de micro-aventures, range hors timeline stricte.' },
      { id: 'virtual_shell', ep: 6, sub: 3, zone: 13, title: 'Douille virtuelle', desc: 'Preuve que les armes restent des regles de simulation.' },
      { id: 'digital_shell', ep: 7, sub: 1, zone: 14, title: 'Coquillage digital', desc: 'Indice de fausse pause au lac digital.' },
      { id: 'admin_pass', ep: 8, sub: 4, zone: 16, title: 'Pass admin C&A', desc: 'Objet tardif pour acceder aux couches techniques.' },
      { id: 'color_fragment', ep: 9, sub: 3, zone: 18, title: 'Fragment couleur', desc: 'Marqueur du final et de la recoloration progressive.' }
    ].map(item => ({
      ...item,
      unlocked: unlocked(item.ep, item.sub),
      found: unlocked(item.ep, item.sub) && visited.includes(item.zone)
    }));
  },

  getCainOSAnomalyScore() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const zones = this.getCainOSVisitedZones();
    const collectibles = this.getCainOSCollectibles();
    const achievements = Object.keys(this.getCainOSAchievements()).length;
    const subCount = (typeof EpisodeManager !== 'undefined')
      ? Array.from({ length: 9 }, (_, offset) => EpisodeManager.getSubepisodeProgress?.(offset + 1)?.length || 0).reduce((a, b) => a + b, 0)
      : 0;
    const raw = progress.filter(ep => ep >= 0).length * 6 + zones.length * 3 + collectibles.filter(item => item.found).length * 4 + achievements * 2 + subCount;
    const score = Math.min(100, raw);
    const level = score >= 75 ? 'CRITIQUE' : (score >= 45 ? 'INSTABLE' : (score >= 20 ? 'SURVEILLE' : 'FAIBLE'));
    return { score, level };
  },

  getCainOSSkinStoreSummary() {
    const cast = this.getWackyCastData();
    const purchased = this.getPurchasedWackySkins();
    const fanSkins = Object.entries(cast)
      .filter(([id, data]) => this.isFanSkin(id, data))
      .map(([id, data]) => ({ id, name: data.name, purchased: purchased.includes(id), unlocked: this.isWackySkinStoreUnlocked() }));
    return {
      unlocked: this.isWackySkinStoreUnlocked(),
      total: fanSkins.length,
      purchased: fanSkins.filter(item => item.purchased).length,
      preview: fanSkins.slice(0, 8)
    };
  },

  getCainOSEvidence() {
    return this.getCainOSJournalEntries().map(entry => ({
      ...entry,
      source: entry.gate === 0 ? 'Episode 0 / calibration CainOS' : `Episode ${entry.gate} / sous-episodes valides`,
      rule: entry.gate >= 8 ? 'Spoiler tardif, verrouillage strict' : 'Visible apres progression normale'
    }));
  },

  getCainOSInventory() {
    const visited = this.getCainOSVisitedZones();
    const zoneItems = this.getCainOSLoreZones().map(zone => ({
      name: zone.item,
      from: zone.name,
      zoneId: zone.id,
      unlocked: zone.unlocked && visited.includes(zone.id),
      desc: zone.unlocked ? 'Objet de scene utilisable comme preuve ou declencheur de dialogue.' : 'Objet masque pour eviter un spoiler de progression.'
    }));
    const collectibles = this.getCainOSCollectibles().map(item => ({
      name: item.title,
      from: `EP${item.ep}.${item.sub + 1}`,
      zoneId: item.zone,
      unlocked: item.found,
      desc: item.unlocked ? item.desc : 'Collectible verrouille par sous-episode pour eviter les spoilers.'
    }));
    const persistent = this.circusDoom ? {
      collected: [...this.circusDoom.collectedProps],
      given: [...this.circusDoom.givenProps],
      heldItem: this.circusDoom.heldItem
    } : this.getCircusPersistentWorldState();
    const fpsItems = persistent.collected.map(id => {
      const [zoneText, indexText] = String(id).split(':');
      const zoneId = Number(zoneText);
      const prop = this.getCircusZoneProps(zoneId)[Number(indexText)];
      const name = persistent.heldItem?.id === id ? persistent.heldItem.name : (prop?.label || this.getCircusPropName(prop || {}, zoneId));
      const wasGiven = persistent.given.includes(id);
      return {
        name,
        from: this.getCainOSLoreZones().find(zone => zone.id === zoneId)?.name || `ZONE ${zoneId}`,
        zoneId,
        unlocked: true,
        desc: wasGiven ? 'Objet remis a un personnage; son effet relationnel est conserve.' : persistent.heldItem?.id === id ? 'Objet actuellement tenu dans la simulation.' : 'Objet FPS persistant collecte dans le decor.'
      };
    });
    return [...zoneItems, ...collectibles, ...fpsItems];
  },

  getCainOSAchievementList() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const unlocked = this.getCainOSAchievements();
    const base = [
      { id: 'ep0', title: 'Session ouverte', done: progress.includes(0), desc: 'Calibration terminee et bureau CainOS accessible.' },
      { id: 'mapper', title: 'Cartographe du chapiteau', done: this.getCainOSVisitedZones().length >= 3 || !!unlocked.mapper, desc: 'Visiter plusieurs zones depuis l entree simulation.' },
      { id: 'proofs', title: 'Archiviste prudent', done: progress.length >= 4, desc: 'Distinguer canon, archive, variante et hypothese.' },
      { id: 'final', title: 'Final accepte', done: progress.includes(9), desc: 'Atteindre la fin avant les missions bonus.' },
      { id: 'postfinal', title: 'Show bonus de Caine', done: progress.includes(9), desc: 'Debloque les aventures originales non canon.', actions: progress.includes(9) ? [`<button class="tools-pill tools-action" data-tools-action="open-episode" data-episode="-1">MISSION BONUS</button>`] : null },
      ...Object.entries(unlocked).map(([id, data]) => ({ id, title: data.title, done: true, desc: 'Debloque par interaction CainOS.' }))
    ];
    return base.filter((item, index, arr) => arr.findIndex(other => other.id === item.id) === index);
  },

  getCainOSInspectorFindings() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const lockedVisited = this.getCainOSLoreZones().filter(zone => !zone.unlocked && this.getCainOSVisitedZones().includes(zone.id));
    const missingSegments = [];
    if (typeof EpisodeManager !== 'undefined') {
      for (let ep = 1; ep <= 9; ep++) {
        if ((EpisodeManager.getSubepisodeSegments?.(ep) || []).length === 0) missingSegments.push(ep);
      }
    }
    const purchased = this.getCainOSStorage('purchased_wacky_skins', []);
    const fanBeforeFinal = Array.isArray(purchased) && purchased.length > 0 && !progress.includes(9);
    return [
      {
        level: this.isCainOSCanonStrict() ? 'OK' : 'INFO',
        title: 'Provenance lore',
        desc: this.isCainOSCanonStrict()
          ? 'Canon, reconstruction CainOS et contenu fan sont separes dans les interfaces.'
          : 'Mode libre actif: les etiquettes restent visibles, mais le contenu fan est affiche.'
      },
      lockedVisited.length
        ? { level: 'WARN', title: 'Zone visitee trop tot', desc: lockedVisited.map(z => z.name).join(', ') }
        : { level: 'OK', title: 'Carte progression', desc: 'Aucune zone spoiler visitee avant son episode.' },
      missingSegments.length
        ? { level: 'WARN', title: 'Sous-episodes manquants', desc: `Episodes sans decoupage detecte: ${missingSegments.join(', ')}.` }
        : { level: 'OK', title: 'Sous-episodes', desc: 'Les episodes 1 a 9 exposent un decoupage interactif.' },
      fanBeforeFinal
        ? { level: 'WARN', title: 'Skins fan avant final', desc: 'Des skins fan sont achetes avant le mode post-final; CainOS doit les garder hors timeline.' }
        : { level: 'OK', title: 'Skins et timeline', desc: 'Aucun skin fan ne pollue la timeline principale avant le final.' },
      { level: progress.includes(9) ? 'OK' : 'INFO', title: 'Mode post-final', desc: progress.includes(9) ? 'Aventures originales autorisees comme bonus non canon.' : 'Verrouille jusqu au final pour proteger la timeline.' },
      { level: 'OK', title: 'Transcripts', desc: 'Les outils ajoutent des couches autour du texte sans remplacer les dialogues.' },
      { level: this.getCainOSSetting('reader-only') ? 'INFO' : 'OK', title: 'Lecture sans gameplay', desc: this.getCainOSSetting('reader-only') ? 'Option active : utile accessibilite, pas canon gameplay.' : 'Progression normale par texte et mini-jeux.' }
    ];
  },

  renderCainOSContentPanel(renderCards) {
    const contentEl = document.getElementById('tools-tab-content');
    if (!contentEl) return;
    const matrix = this.getCainOSContentMatrix();
    const collectibles = this.getCainOSCollectibles();
    const anomaly = this.getCainOSAnomalyScore();
    const skinStore = this.getCainOSSkinStoreSummary();
    const episodeCards = matrix.map(entry => {
      const next = entry.next;
      const unlocked = typeof EpisodeManager !== 'undefined' && !EpisodeManager.isLocked(entry.ep);
      const desc = next
        ? `Prochain bloc: ${next.title}. ${next.playObjective || next.objective}`
        : (entry.done ? 'Episode termine : replay, mini-jeux et archives disponibles.' : 'En attente de progression precedente.');
      const actions = [];
      if (unlocked) {
        actions.push(`<button class="tools-pill tools-action" data-tools-action="open-episode" data-episode="${entry.ep}">MENU EP${entry.ep}</button>`);
        if (next) {
          actions.push(`<button class="tools-pill tools-action" data-tools-action="play-subepisode" data-episode="${entry.ep}" data-subepisode="${next.index}" data-mode="text">CONTINUER</button>`);
          actions.push(`<button class="tools-pill tools-action" data-tools-action="play-subepisode" data-episode="${entry.ep}" data-subepisode="${next.index}" data-mode="micro">MINI-JEU</button>`);
        } else if (entry.segments[0]) {
          actions.push(`<button class="tools-pill tools-action" data-tools-action="play-subepisode" data-episode="${entry.ep}" data-subepisode="0" data-mode="text">REJOUER TEXTE</button>`);
          actions.push(`<button class="tools-pill tools-action" data-tools-action="play-subepisode" data-episode="${entry.ep}" data-subepisode="0" data-mode="micro">REJOUER MINI-JEU</button>`);
        }
      }
      return {
        title: `EP${entry.ep} - ${entry.title}`,
        desc,
        provenance: 'canon-summary',
        unlocked,
        visited: entry.done,
        badge: entry.done ? 'TERMINE' : `${entry.completed}/${entry.total}`,
        meta: [
          `${entry.total} sous-episodes`,
          entry.zones.map(zone => zone.name).join(' + ') || 'Zone a definir',
          next ? next.context : 'Replay disponible'
        ],
        actions
      };
    });
    const collectibleCards = collectibles.map(item => ({
      title: item.found ? item.title : 'Collectible verrouille',
      desc: item.unlocked ? item.desc : `Terminez EP${item.ep}.${item.sub + 1} puis visitez la zone liee pour le recuperer.`,
      provenance: 'playable',
      unlocked: item.found,
      badge: item.found ? 'TROUVE' : (item.unlocked ? 'A CHERCHER' : 'LOCK'),
      meta: [`EP${item.ep}.${item.sub + 1}`, `ZONE ${item.zone}`],
      actions: item.unlocked ? [`<button class="tools-pill tools-action" data-tools-action="open-zone" data-zone="${item.zone}">ALLER ZONE</button>`] : null
    }));
    const skinCards = skinStore.preview.map(item => ({
      title: item.unlocked ? item.name : 'Skin fan verrouille',
      desc: item.unlocked
        ? (item.purchased ? 'Skin fan achete : utilisable en aventure originale, hors timeline principale.' : 'Skin fan achetable depuis la fiche Wacky Watch du personnage.')
        : 'Verrouille jusqu a la fin de l episode 9 pour ne pas casser le canon principal.',
      unlocked: item.unlocked,
      provenance: 'fan',
      visited: item.purchased,
      badge: item.purchased ? 'ACHETE' : (item.unlocked ? 'BOUTIQUE' : 'POST-FINAL'),
      meta: ['Fan / non canon principal']
    }));
    contentEl.innerHTML = `
      <div class="content-summary-grid">
        <div class="content-summary-card">
          <span>ANOMALIE CAINOS</span>
          <strong>${anomaly.score}%</strong>
          <em>${anomaly.level}</em>
        </div>
        <div class="content-summary-card">
          <span>SOUS-EPISODES</span>
          <strong>${matrix.reduce((sum, item) => sum + item.completed, 0)}/${matrix.reduce((sum, item) => sum + item.total, 0)}</strong>
          <em>progression narrative</em>
        </div>
        <div class="content-summary-card">
          <span>COLLECTIBLES</span>
          <strong>${collectibles.filter(item => item.found).length}/${collectibles.length}</strong>
          <em>lore verrouille</em>
        </div>
        <div class="content-summary-card">
          <span>SKINS FAN</span>
          <strong>${skinStore.purchased}/${skinStore.total}</strong>
          <em>${skinStore.unlocked ? 'post-final actif' : 'verrou post-final'}</em>
        </div>
      </div>
      <div class="tools-section-title">Episodes et replay</div>
      <div class="tools-grid">${renderCards(episodeCards)}</div>
      <div class="tools-section-title">Collectibles lore</div>
      <div class="tools-grid">${renderCards(collectibleCards)}</div>
      <div class="tools-section-title">Skins fan post-game</div>
      ${this.isCainOSCanonStrict()
        ? '<div class="creator-lock"><strong>MASQUE PAR CANON STRICT</strong><p>Desactivez le mode canon strict pour afficher la boutique et les variantes fan post-finale.</p></div>'
        : `<div class="tools-grid">${renderCards(skinCards)}</div>`}
    `;
  },

  getCainOSCustomAdventures() {
    const adventures = this.getCainOSStorage('custom_adventures', []);
    return Array.isArray(adventures) ? adventures : [];
  },

  saveCainOSCustomAdventures(adventures) {
    this.setCainOSStorage('custom_adventures', adventures.slice(0, 24));
  },

  getCainOSCustomObjectiveDefinition(key) {
    const definitions = {
      explore: { label: 'Analyser 3 objets distincts', action: 'inspect', total: 3 },
      collect: { label: 'Recuperer 2 objets distincts', action: 'take', total: 2 },
      social: { label: 'Parler a 3 personnages', action: 'talk', total: 3 },
      survive: { label: 'Survivre 18 secondes', action: 'survive', total: 18 },
      chase: { label: 'Parcourir 30 metres', action: 'move', total: 30 }
    };
    return definitions[key] || definitions.explore;
  },

  createCainOSCustomAdventureFromForm() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    if (!progress.includes(9)) {
      SoundManager.playError();
      return;
    }
    const title = String(document.getElementById('creator-title')?.value || '').trim().slice(0, 42) || 'Aventure sans titre';
    const zoneId = Number(document.getElementById('creator-world')?.value || 3);
    const cast = [...document.querySelectorAll('[name="creator-cast"]:checked')].map(input => input.value).slice(0, 5);
    const variants = Object.fromEntries([...document.querySelectorAll('[data-creator-variant]')].map(select => [
      select.getAttribute('data-creator-variant'), select.value
    ]));
    const adventure = {
      id: `adv_${Date.now().toString(36)}`,
      title,
      zoneId,
      cast: cast.length ? cast : ['pomni', 'ragatha'],
      objective: document.getElementById('creator-objective')?.value || 'explore',
      threat: document.getElementById('creator-threat')?.value || 'none',
      costume: document.getElementById('creator-costume')?.value || 'standard',
      variants,
      layout: document.getElementById('creator-layout')?.value || 'line',
      propPack: document.getElementById('creator-props')?.value || 'markers',
      entry: document.getElementById('creator-entry')?.value || 'center',
      atmosphere: document.getElementById('creator-atmosphere')?.value || 'circus',
      createdAt: new Date().toISOString(),
      completedCount: 0,
      canon: false
    };
    const adventures = this.getCainOSCustomAdventures();
    adventures.unshift(adventure);
    this.saveCainOSCustomAdventures(adventures);
    this.renderCainOSAdventureCreator();
    SoundManager.playWin();
  },

  deleteCainOSCustomAdventure(id) {
    this.saveCainOSCustomAdventures(this.getCainOSCustomAdventures().filter(adventure => adventure.id !== id));
    this.renderCainOSAdventureCreator();
    SoundManager.playClick();
  },

  launchCainOSCustomAdventure(id) {
    const adventure = this.getCainOSCustomAdventures().find(item => item.id === id);
    if (!adventure) return;
    SoundManager.playClick();
    this.showCircusDosPreview();
    setTimeout(() => {
      this.enterCircusInteriorView();
      const state = this.circusDoom;
      if (!state) return;
      if (state.portals[adventure.zoneId]) state.portals[adventure.zoneId].unlocked = true;
      state.customAdventure = {
        ...adventure,
        active: true,
        complete: false,
        progress: 0,
        seen: [],
        startedAt: Date.now()
      };
      document.body.dataset.fpsCustomAdventure = 'active';
      document.body.dataset.fpsCustomAdventureId = adventure.id;
      state.activeCampaign = null;
      this.setCircusSimulationZone(adventure.zoneId, true);
      state.player.x += adventure.entry === 'left' ? -2 : adventure.entry === 'right' ? 2 : 0;
      this.startCircusDynamicEvent('custom-adventure', {
        speaker: 'Caine',
        avatar: 'caine',
        text: `Aventure originale chargee: ${adventure.title}. Ce module bonus est hors chronologie canonique.`,
        duration: 6200
      });
      this.saveCircusPersistentWorldState();
    }, 120);
  },

  getCircusCustomAdventureAvatar(baseAvatar, costume, castData = null, purchasedSkins = null) {
    const variants = {
      baseball: { pomni: 'baseballpomni', ragatha: 'baseballragatha', jax: 'baseballjax', kinger: 'baseballkinger', gangle: 'baseballgangle', zooble: 'baseballzooble' },
      japanese: { pomni: 'japanesepomni', ragatha: 'japaneseragatha', jax: 'japanesejax', kinger: 'japanesekinger', gangle: 'japanesegangle', zooble: 'japanesezooble' },
      shadow: { pomni: 'shadowpomni', ragatha: 'shadowragatha', jax: 'shadowjax', kinger: 'shadowkinger', gangle: 'shadowgangle', zooble: 'shadowzooble', caine: 'shadowcaine' },
      fan: { pomni: 'maidpomni', ragatha: 'maidragatha', jax: 'jaxgirl', kinger: 'evilkinger', gangle: 'ganglekawaii', zooble: 'evilzooble', caine: 'shadowcaine' }
    };
    const candidate = variants[costume]?.[baseAvatar] || baseAvatar;
    if (costume === 'fan') {
      const purchased = purchasedSkins || this.getCainOSStorage('purchased_wacky_skins', []);
      if (!Array.isArray(purchased) || !purchased.includes(candidate)) return baseAvatar;
    }
    return (castData || this.getWackyCastData())[candidate] ? candidate : baseAvatar;
  },

  getCircusCustomAdventureSprites(zoneId, state) {
    const adventure = state?.customAdventure;
    if (!adventure?.active || adventure.complete || adventure.zoneId !== zoneId) return [];
    const castData = this.getWackyCastData();
    const purchasedSkins = adventure.costume === 'fan' ? this.getCainOSStorage('purchased_wacky_skins', []) : [];
    const colors = { pomni: '#e53935', ragatha: '#d64545', jax: '#8a4fd6', kinger: '#d9d0a2', gangle: '#f7f7f7', zooble: '#ff4fb8', caine: '#ffd84a' };
    const cast = adventure.cast.map((baseAvatar, index) => {
      const selectedVariant = adventure.variants?.[baseAvatar];
      const avatar = selectedVariant && castData[selectedVariant] && this.isWackyProfileUnlocked(selectedVariant)
        ? selectedVariant
        : this.getCircusCustomAdventureAvatar(baseAvatar, adventure.costume, castData, purchasedSkins);
      const profile = castData[baseAvatar] || castData[avatar] || {};
      const count = adventure.cast.length;
      const positions = adventure.layout === 'circle'
        ? { x: Math.cos(index / Math.max(1, count) * Math.PI * 2) * 2.1, z: -2.8 + Math.sin(index / Math.max(1, count) * Math.PI * 2) * 1.2 }
        : adventure.layout === 'scattered'
          ? { x: ((index * 37) % 5 - 2) * 0.95, z: -1.7 - ((index * 53) % 4) * 0.65 }
          : { x: (index - (count - 1) / 2) * 1.18, z: -2.2 - (index % 2) * 0.55 };
      return {
        name: profile.name || baseAvatar.toUpperCase(),
        type: avatar,
        avatar,
        baseAvatar,
        x: positions.x,
        z: positions.z,
        color: profile.color || colors[baseAvatar] || '#fff1a8',
        routine: index % 2 ? 'pace' : 'patrol',
        customAdventure: true
      };
    });
    const threatAvatars = { gloinks: 'gloinkstar', kaufmo: 'abstractedkaufmo', monster: 'baronmildenhall' };
    const threat = threatAvatars[adventure.threat];
    if (threat) cast.push({
      name: adventure.threat === 'gloinks' ? 'GLOINK ERRANT' : adventure.threat.toUpperCase(),
      type: threat,
      avatar: threat,
      x: 2.8,
      z: -4.1,
      color: adventure.threat === 'gloinks' ? '#7348ff' : '#111111',
      routine: adventure.threat === 'gloinks' ? 'swarm' : 'tremble',
      customAdventure: true
    });
    return cast;
  },

  advanceCircusCustomAdventure(action, target, amount = 1) {
    const state = this.circusDoom;
    const adventure = state?.customAdventure;
    if (!adventure?.active || adventure.complete || state.currentZoneId !== adventure.zoneId) return false;
    const objective = this.getCainOSCustomObjectiveDefinition(adventure.objective);
    const normalizedAction = ['look', 'use'].includes(action) ? 'inspect' : action;
    if (normalizedAction !== objective.action) return false;
    adventure.seen = Array.isArray(adventure.seen) ? adventure.seen : [];
    if (['inspect', 'take', 'talk'].includes(normalizedAction)) {
      const uniqueKey = `${normalizedAction}:${target}`;
      if (adventure.seen.includes(uniqueKey)) return false;
      adventure.seen.push(uniqueKey);
      adventure.progress = (adventure.progress || 0) + 1;
    } else {
      adventure.progress = (adventure.progress || 0) + amount;
    }
    if (adventure.progress >= objective.total) {
      adventure.progress = objective.total;
      adventure.complete = true;
      adventure.active = false;
      document.body.dataset.fpsCustomAdventure = 'complete';
      const adventures = this.getCainOSCustomAdventures();
      const stored = adventures.find(item => item.id === adventure.id);
      if (stored) stored.completedCount = (stored.completedCount || 0) + 1;
      this.saveCainOSCustomAdventures(adventures);
      this.unlockCainOSAchievement('fps_custom_adventure', 'Aventure originale terminee');
      state.interactionMessage = `AVENTURE ORIGINALE TERMINEE: ${adventure.title}. Aucun evenement canonique n a ete modifie.`;
      state.interactionUntil = performance.now() + 6200;
      SoundManager.playWin();
    }
    if (adventure.complete || performance.now() >= (adventure.nextSaveAt || 0)) {
      adventure.nextSaveAt = performance.now() + 1000;
      this.saveCircusPersistentWorldState();
    }
    return true;
  },

  drawCircusCustomAdventureHud(ctx, w, h, state) {
    const adventure = state?.customAdventure;
    if (!adventure?.active || adventure.complete || !state.hudVisible) return;
    const objective = this.getCainOSCustomObjectiveDefinition(adventure.objective);
    const y = w < 480 ? 148 : 48;
    ctx.save();
    ctx.fillStyle = 'rgba(5,2,13,0.86)';
    ctx.strokeStyle = '#ff4fb8';
    ctx.fillRect(w - 254, y, 240, 44);
    ctx.strokeRect(w - 254, y, 240, 44);
    ctx.fillStyle = '#ff7fd0';
    ctx.font = 'bold 8px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`BONUS NON CANON: ${adventure.title.toUpperCase()}`, w - 246, y + 15);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px Courier New';
    ctx.fillText(`${objective.label}  ${Math.floor(adventure.progress || 0)}/${objective.total}`, w - 246, y + 30);
    ctx.fillStyle = '#ff4fb8';
    ctx.fillRect(w - 246, y + 35, 220 * Math.min(1, (adventure.progress || 0) / objective.total), 4);
    ctx.restore();
  },

  drawCircusCustomAtmosphere(ctx, w, h, state) {
    const adventure = state?.customAdventure;
    if (!adventure?.active || adventure.zoneId !== state.currentZoneId) return;
    const t = performance.now() / 1000;
    ctx.save();
    if (adventure.atmosphere === 'horror') {
      ctx.fillStyle = `rgba(24,0,8,${0.12 + Math.abs(Math.sin(t * 1.7)) * 0.08})`;
      ctx.fillRect(0, 0, w, h);
    } else if (adventure.atmosphere === 'memory') {
      ctx.fillStyle = 'rgba(80,190,210,0.07)';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(190,255,255,0.12)';
      for (let y = 10; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(t + y) * 2);
        ctx.lineTo(w, y + Math.sin(t + y) * 2);
        ctx.stroke();
      }
    } else if (adventure.atmosphere === 'comedy') {
      const colors = ['#ffd84a', '#ff4fb8', '#7df0ff', '#e53935'];
      for (let i = 0; i < 18; i++) {
        ctx.fillStyle = `${colors[i % colors.length]}88`;
        const x = (i * 73 + t * 24) % (w + 30) - 15;
        const y = (i * 41 + Math.sin(t + i) * 18) % Math.max(1, h * 0.55);
        ctx.fillRect(x, y, 3 + i % 4, 3 + (i + 2) % 4);
      }
    }
    ctx.restore();
  },

  getCainOSCreatorVariantOptions(baseAvatar) {
    const cast = this.getWackyCastData();
    const variants = (this.getWackyVariantGroups()[baseAvatar] || [baseAvatar])
      .filter(id => cast[id] && this.isWackyProfileUnlocked(id));
    return variants.map(id => `<option value="${id}">${this.escapeHTML(cast[id]?.name || id.toUpperCase())}</option>`).join('');
  },

  renderCainOSAdventureCreator() {
    const creatorEl = document.getElementById('tools-tab-creator');
    if (!creatorEl) return;
    if (this.isCainOSCanonStrict()) {
      creatorEl.innerHTML = `<div class="creator-lock"><strong>ATELIER MASQUE PAR CANON STRICT</strong><p>L atelier genere uniquement des aventures bonus non canoniques. Desactivez CANON STRICT pour l afficher sans modifier la progression principale.</p></div>`;
      return;
    }
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const unlocked = progress.includes(9);
    if (!unlocked) {
      creatorEl.innerHTML = `<div class="creator-lock"><strong>ATELIER VERROUILLE</strong><p>Terminez l episode 9. Les aventures originales restent hors de la chronologie principale.</p></div>`;
      return;
    }
    const worlds = this.getCircusFreeWorlds();
    const adventures = this.getCainOSCustomAdventures();
    const cast = ['pomni', 'ragatha', 'jax', 'kinger', 'gangle', 'zooble', 'caine'];
    creatorEl.innerHTML = `
      <div class="creator-notice"><strong>CAINE ADVENTURE WORKSHOP</strong><span>Contenu bonus non canon. La progression des episodes et les transcripts ne sont jamais modifies.</span></div>
      <div class="creator-form">
        <label><span>TITRE</span><input id="creator-title" maxlength="42" value="Nouvelle micro-aventure"></label>
        <label><span>MONDE</span><select id="creator-world">${worlds.map(world => `<option value="${world.target}">${this.escapeHTML(world.label)}</option>`).join('')}</select></label>
        <label><span>OBJECTIF</span><select id="creator-objective">
          <option value="explore">Analyser 3 objets</option><option value="collect">Collecter 2 objets</option><option value="social">Parler a 3 personnages</option><option value="survive">Survivre 18 secondes</option><option value="chase">Parcourir 30 metres</option>
        </select></label>
        <label><span>MENACE</span><select id="creator-threat"><option value="none">Aucune</option><option value="gloinks">Gloinks</option><option value="kaufmo">Kaufmo abstrait</option><option value="monster">Monstre Mildenhall</option></select></label>
        <label><span>VARIANTES</span><select id="creator-costume"><option value="standard">Standard</option><option value="baseball">Baseball</option><option value="japanese">Japanese</option><option value="shadow">Shadow</option><option value="fan">Fan / achetees</option></select></label>
        <label><span>AMBIANCE</span><select id="creator-atmosphere"><option value="circus">Cirque</option><option value="comedy">Comedie</option><option value="horror">Horreur</option><option value="memory">Memoire</option></select></label>
        <label><span>FORMATION</span><select id="creator-layout"><option value="line">Ligne</option><option value="circle">Cercle</option><option value="scattered">Dispersee</option></select></label>
        <label><span>ACCESSOIRES</span><select id="creator-props"><option value="markers">Balises</option><option value="crates">Caisses</option><option value="lights">Projecteurs</option><option value="none">Aucun</option></select></label>
        <label><span>ENTREE</span><select id="creator-entry"><option value="center">Centre</option><option value="left">Gauche</option><option value="right">Droite</option></select></label>
      </div>
      <fieldset class="creator-cast"><legend>GROUPE ET VARIANTE (5 MAX)</legend>${cast.map((avatar, index) => `<label><input type="checkbox" name="creator-cast" value="${avatar}" ${index < 3 ? 'checked' : ''}><span>${avatar.toUpperCase()}</span><select data-creator-variant="${avatar}" title="Variante debloquee de ${avatar}">${this.getCainOSCreatorVariantOptions(avatar)}</select></label>`).join('')}</fieldset>
      <div id="creator-preview" class="creator-preview">${cast.slice(0, 3).map(avatar => `<span title="${avatar}">${this.getPixelAvatarSvg(avatar, 42)}<b>${avatar.toUpperCase()}</b></span>`).join('')}</div>
      <button class="retro-btn creator-build" data-tools-action="create-adventure">COMPILER L AVENTURE</button>
      <div class="tools-section-title">Aventures compilees</div>
      <div class="creator-list">${adventures.length ? adventures.map(adventure => {
        const objective = this.getCainOSCustomObjectiveDefinition(adventure.objective);
        return `<article class="creator-card"><header><strong>${this.escapeHTML(adventure.title)}</strong><span>NON CANON</span></header><p>${this.escapeHTML(objective.label)} dans ${this.escapeHTML(this.getCircusFreeWorlds().find(world => world.target === adventure.zoneId)?.label || `ZONE ${adventure.zoneId}`)}.</p><small>${adventure.cast.map(name => name.toUpperCase()).join(' + ')} | ${adventure.costume.toUpperCase()} | TERMINEE ${adventure.completedCount || 0}x</small><div><button class="tools-pill tools-action" data-tools-action="launch-adventure" data-adventure-id="${adventure.id}">LANCER FPS</button><button class="tools-pill tools-action" data-tools-action="delete-adventure" data-adventure-id="${adventure.id}">SUPPRIMER</button></div></article>`;
      }).join('') : '<p class="tools-note">Aucune aventure compilee.</p>'}</div>
    `;
    creatorEl.querySelectorAll('input, select').forEach(input => input.addEventListener('change', () => this.updateCainOSAdventurePreview()));
  },

  updateCainOSAdventurePreview() {
    const preview = document.getElementById('creator-preview');
    if (!preview) return;
    const castData = this.getWackyCastData();
    const selected = [...document.querySelectorAll('[name="creator-cast"]:checked')].slice(0, 5);
    preview.innerHTML = selected.map(input => {
      const base = input.value;
      const variant = document.querySelector(`[data-creator-variant="${base}"]`)?.value || base;
      return `<span title="${this.escapeHTML(castData[variant]?.name || variant)}">${this.getPixelAvatarSvg(variant, 42)}<b>${this.escapeHTML((castData[variant]?.name || variant).toUpperCase())}</b></span>`;
    }).join('') || '<em>Selectionnez au moins un personnage.</em>';
  },

  renderCainOSTools() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const visited = this.getCainOSVisitedZones();
    const renderCards = (items, defaultProvenance = 'reconstruction') => items.map(item => {
      const provenance = this.getCainOSProvenanceMeta(item.provenance || defaultProvenance);
      return `
      <div class="tools-card ${item.unlocked === false || item.done === false ? 'locked' : ''} ${item.visited ? 'visited' : ''}">
        <div class="tools-card-title"><span>${this.escapeHTML(item.title || item.name)}</span><span>${this.escapeHTML(item.badge || item.level || '')}</span></div>
        <div class="tools-card-provenance"><span class="provenance-badge provenance-${provenance.kind}" title="${this.escapeHTML(provenance.detail)}">${this.escapeHTML(provenance.label)}</span></div>
        <p>${this.escapeHTML(item.desc || item.text || '')}</p>
        ${item.meta ? `<div class="tools-pill-row">${item.meta.map(meta => `<span class="tools-pill">${this.escapeHTML(meta)}</span>`).join('')}</div>` : ''}
        ${item.actions ? `<div class="tools-pill-row">${item.actions.join('')}</div>` : ''}
      </div>
    `;
    }).join('');

    const mapEl = document.getElementById('tools-tab-map');
    if (mapEl) mapEl.innerHTML = `<div class="tools-grid">${renderCards(this.getCainOSLoreZones().map(zone => ({
      name: zone.name,
      desc: zone.unlocked ? zone.desc : 'Zone verrouillee par progression pour ne pas casser la timeline.',
      unlocked: zone.unlocked,
      visited: visited.includes(zone.id),
      badge: zone.unlocked ? (visited.includes(zone.id) ? 'VISITEE' : `EP${zone.ep}`) : 'LOCK',
      provenance: 'playable',
      meta: [zone.item, zone.id === 11 ? 'Zone variantes / micro-aventures' : 'Timeline principale'],
      actions: zone.unlocked ? [
        `<button class="tools-pill tools-action" data-tools-action="open-zone" data-zone="${zone.id}">OUVRIR ZONE</button>`,
        Number.isFinite(zone.ep) && zone.ep > 0 ? `<button class="tools-pill tools-action" data-tools-action="open-episode" data-episode="${zone.ep}">EP${zone.ep}</button>` : ''
      ].filter(Boolean) : null
    })))}</div>`;

    this.renderCainOSContentPanel(renderCards);
    this.renderCainOSAdventureCreator();

    const evidenceEl = document.getElementById('tools-tab-evidence');
    if (evidenceEl) evidenceEl.innerHTML = `<div class="tools-grid">${renderCards(this.getCainOSEvidence().map(entry => {
      const unlocked = progress.includes(entry.gate) || progress.some(ep => ep > entry.gate && ep <= 9);
      return {
        title: unlocked ? entry.title : 'Preuve verrouillee',
        desc: unlocked ? entry.text : 'Source masquee pour eviter un spoiler.',
        unlocked,
        badge: unlocked ? entry.tag : 'LOCK',
        provenance: 'canon-summary',
        meta: [entry.source, entry.rule],
        actions: unlocked && entry.gate > 0 ? [`<button class="tools-pill tools-action" data-tools-action="open-episode" data-episode="${entry.gate}">OUVRIR EP${entry.gate}</button>`] : null
      };
    }))}</div>`;

    const inventoryEl = document.getElementById('tools-tab-inventory');
    if (inventoryEl) inventoryEl.innerHTML = `<div class="tools-grid">${renderCards(this.getCainOSInventory().map(item => ({
      title: item.unlocked ? item.name : 'Objet verrouille',
      desc: item.desc,
      unlocked: item.unlocked,
      badge: item.unlocked ? 'OBJET' : 'LOCK',
      provenance: 'playable',
      meta: [item.from],
      actions: item.zoneId ? [`<button class="tools-pill tools-action" data-tools-action="open-zone" data-zone="${item.zoneId}">RETOUR ZONE</button>`] : null
    })))}</div>`;

    const relationEl = document.getElementById('tools-tab-relations');
    if (relationEl) {
      const names = { pomni: 'Pomni', ragatha: 'Ragatha', jax: 'Jax', kinger: 'Kinger', gangle: 'Gangle', zooble: 'Zooble', caine: 'Caine' };
      const relations = this.getCainOSRelations();
      relationEl.innerHTML = `<div class="tools-grid">${Object.entries(names).map(([key, name]) => {
        const value = relations[key] || 0;
        return `<div class="tools-card">
          <div class="tools-card-title"><span>${name}</span><span>${value}%</span></div>
          <div class="tools-card-provenance"><span class="provenance-badge provenance-reconstruction" title="Mesure de gameplay CainOS, pas une valeur canonique.">MESURE CAINOS</span></div>
          <p>${value >= 70 ? 'Confiance stabilisee.' : value >= 40 ? 'Relation praticable, encore fragile.' : 'Tension ou distance encore forte.'}</p>
          <div class="relation-meter"><div class="relation-meter-fill" style="width:${value}%"></div></div>
        </div>`;
      }).join('')}</div>`;
    }

    const achievementsEl = document.getElementById('tools-tab-achievements');
    if (achievementsEl) achievementsEl.innerHTML = `<div class="tools-grid">${renderCards(this.getCainOSAchievementList().map(item => ({
      title: item.title, desc: item.desc, done: item.done, badge: item.done ? 'OK' : 'LOCK', actions: item.actions
    })))}</div>`;

    const inspectorEl = document.getElementById('tools-tab-inspector');
    if (inspectorEl) inspectorEl.innerHTML = `<div class="tools-grid">${renderCards(this.getCainOSInspectorFindings().map(item => ({
      title: item.title, desc: item.desc, badge: item.level, unlocked: item.level !== 'WARN'
    })))}</div>`;
  },

  // Wacky Watch App Logic
  setupWackyWatch() {
    // Menu buttons
    const btnCast = document.getElementById('watch-btn-cast');
    const btnRadar = document.getElementById('watch-btn-radar');
    const btnJournal = document.getElementById('watch-btn-journal');
    const tabCast = document.getElementById('watch-tab-cast');
    const tabRadar = document.getElementById('watch-tab-radar');
    const tabJournal = document.getElementById('watch-tab-journal');

    const activateWatchTab = (activeBtn, activeTab) => {
      [btnCast, btnRadar, btnJournal].forEach(btn => btn?.classList.remove('active'));
      [tabCast, tabRadar, tabJournal].forEach(tab => tab?.classList.remove('active'));
      activeBtn?.classList.add('active');
      activeTab?.classList.add('active');
    };

    btnCast.addEventListener('click', () => {
      SoundManager.playClick();
      activateWatchTab(btnCast, tabCast);
    });

    btnRadar.addEventListener('click', () => {
      SoundManager.playClick();
      activateWatchTab(btnRadar, tabRadar);
      this.startRadarAnimation();
    });

    if (btnJournal) {
      btnJournal.addEventListener('click', () => {
        SoundManager.playClick();
        activateWatchTab(btnJournal, tabJournal);
        this.renderCainOSJournal();
      });
    }

    const searchInput = document.getElementById('watch-cast-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.wackySearchQuery = searchInput.value.trim().toLowerCase();
        this.updateWackyWatchCastUI();
      });
    }

    document.querySelectorAll('.watch-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundManager.playClick();
        this.wackyFilter = btn.getAttribute('data-watch-filter') || 'all';
        document.querySelectorAll('.watch-filter-btn').forEach(item => item.classList.remove('active'));
        btn.classList.add('active');
        this.updateWackyWatchCastUI();
      });
    });

    // Refresh fact button
    document.getElementById('watch-btn-refresh-fact').addEventListener('click', () => {
      SoundManager.playClick();
      const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
      const showPomni = this.isPomniNamed();

      const castData = {
        pomni: { facts: [
          "A peur des mannequins de cire et ne se souvient plus de son nom civil.",
          "A essayé de retirer son casque VR 42 fois la première heure.",
          "Son cortex cérébral recherche obstinément des portes de sortie rouges."
        ]},
        jax: { facts: [
          "Déteste faire les courses et adore causer des ennuis aux autres.",
          "A volé et caché la clé de la chambre de Gangle sous son lit.",
          "Collectionne secrètement les pièces détachées de Zooble."
        ]},
        ragatha: { facts: [
          "Maintient un sourire constant pour cacher ses bugs de collision physique.",
          "Est la doyenne des poupées de chiffon raccordées (5 ans d'ancienneté).",
          "Prie secrètement pour que Caine fasse une mise à jour corrective."
        ]},
        kinger: { facts: [
          "Queenie etait sa compagne dans le Cirque; son identite civile reste inconnue.",
          "Est l'humain connecté depuis le plus longtemps (esprit extrêmement fragmenté).",
          "Collectionne des insectes virtuels imaginaires dans un seau."
        ]},
        gangle: { facts: [
          "Son masque de comédie se brise en moyenne 14.8 fois par jour.",
          "Animée par une physique de cordes 2.5D très gourmande en CPU.",
          "Pleure et refuse d'être vue si son masque triste est cassé."
        ]},
        zooble: { facts: [
          "Son corps modulaire contient 18 pièces incompatibles d'autres modèles.",
          "Déteste participer aux aventures scénarisées par Caine.",
          "A été réassemblée par erreur avec une griffe de dinosaure rose."
        ]}
      };

      if (!showPomni) {
        delete castData.pomni;
      }

      const character = this.getWackyCastData()[this.activeWackyCast];
      if (character) {
        const facts = this.getWackyDisplayFacts(this.activeWackyCast, character);
        const curFact = document.getElementById('watch-profile-fact').innerText;
        let newFact = facts[Math.floor(Math.random() * facts.length)];
        while (newFact === curFact && facts.length > 1) {
          newFact = facts[Math.floor(Math.random() * facts.length)];
        }
        document.getElementById('watch-profile-fact').innerText = newFact;
      }
    });

    // Radar ping reset button
    document.getElementById('watch-btn-ping').addEventListener('click', () => {
      SoundManager.playWin();
      this.radarSubjects.forEach(s => {
        s.radius = 30 + Math.random() * 30; // reset inside safe zone
      });
      // Flash net indicator green
      const netIcon = document.querySelector('.icon-net-tray');
      if (netIcon) netIcon.style.filter = "none";
    });

    this.updateWackyWatchCastUI();
    this.renderCainOSJournal();
  },

  escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  getCainOSJournalEntries() {
    const baseEntries = [
      { gate: 0, tag: 'BOOT', title: 'Session Sujet 251 ouverte', text: 'La calibration relance CainOS sur un bureau propre. Le nom Pomni reste verrouille jusqu a son attribution par Caine dans Pilot.' },
      { gate: 1, tag: 'PILOT', title: 'Kaufmo abstrait et fausse sortie', text: 'Le pilote confirme le piege narratif : la porte de sortie existe comme illusion de scene, pas comme liberation fiable.' },
      { gate: 2, tag: 'NPC', title: 'Gummigoo et les donnees PNJ', text: 'Candy Canyon revele que certains personnages sont generes comme PNJ, avec une memoire suffisamment stable pour troubler Pomni.' },
      { gate: 3, tag: 'HORROR', title: 'Manoir Mildenhall et memoire de Kinger', text: 'L obscurite du manoir sert de zone de peur et de memoire. CainOS garde Queenie comme archive, pas comme residente revenue.' },
      { gate: 4, tag: 'SPUDSY', title: 'Masque de Gangle sous pression', text: 'Spudsy transforme le groupe en employes. Le masque de Gangle devient un systeme de comportement, pas seulement un costume.' },
      { gate: 5, tag: 'MICRO', title: 'Suggestions de Caine', text: 'Les micro-aventures doivent rester separees du canon principal : utiles pour les skins et variantes, dangereuses pour la timeline.' },
      { gate: 6, tag: 'TEAM', title: 'Epreuves armees et tensions de groupe', text: 'Les armes et scores sont des regles de simulation. CainOS suit surtout les ruptures de confiance et les roles imposes.' },
      { gate: 7, tag: 'LAKE', title: 'Lac digital et fausse pause', text: 'Le lac ressemble a une zone de repos, mais les PNJ, le soleil et les indices C&A gardent la scene sous controle.' },
      { gate: 8, tag: 'CORE', title: 'Couches C&A sous réserve', text: 'Les traces techniques sont des reconstructions CainOS. Elles se débloquent tard, mais ne deviennent pas canoniques pour autant.' },
      { gate: 9, tag: 'FINAL', title: 'Pomni reste Pomni', text: 'Le final autorise les donnees Abigail/Abby, mais Pomni reste son identite active et le nom affiche dans le Cirque.' }
    ];
    if (typeof EpisodeManager === 'undefined') return baseEntries;
    const subEntries = [];
    for (let ep = 1; ep <= 9; ep++) {
      const completed = EpisodeManager.getSubepisodeProgress?.(ep) || [];
      const segments = EpisodeManager.getSubepisodeSegments?.(ep) || [];
      completed.forEach(index => {
        const segment = segments.find(item => item.index === index);
        if (!segment) return;
        subEntries.push({
          gate: ep,
          subGate: index,
          tag: `EP${ep}.${index + 1}`,
          title: segment.title,
          text: `${segment.context}: ${segment.objective}`
        });
      });
    }
    return [...baseEntries, ...subEntries];
  },

  renderCainOSJournal() {
    const list = document.getElementById('watch-journal-list');
    const count = document.getElementById('watch-journal-count');
    if (!list) return;
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const entries = this.getCainOSJournalEntries();
    const visible = entries.map(entry => ({
      ...entry,
      unlocked: entry.subGate !== undefined
        ? (typeof EpisodeManager !== 'undefined' && (EpisodeManager.getSubepisodeProgress?.(entry.gate) || []).includes(entry.subGate))
        : (progress.includes(entry.gate) || progress.some(ep => ep > entry.gate && ep <= 9))
    }));
    const unlockedCount = visible.filter(entry => entry.unlocked).length;
    if (count) count.innerText = `${unlockedCount}/${entries.length} signaux`;
    list.innerHTML = visible.map(entry => {
      const text = entry.unlocked
        ? entry.text
        : 'Information verrouillee. Terminez les episodes precedents pour eviter les spoilers de timeline.';
      const title = entry.unlocked ? entry.title : 'Archive verrouillee';
      const state = entry.unlocked ? 'OK' : 'LOCK';
      return `
        <div class="journal-entry ${entry.unlocked ? '' : 'locked'}">
          <div class="journal-entry-title">
            <span>${this.escapeHTML(title)}</span>
            <span>${this.escapeHTML(entry.tag)} ${state}</span>
          </div>
          <p>${this.escapeHTML(text)}</p>
        </div>
      `;
    }).join('');
  },

  getWackyCastData() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const showPomni = this.isPomniNamed();
    const castData = {
      pomni: { name: "Pomni", age: "25", stress: "92%", avatar: "pomni", signal: "P", color: "#00ccff", facts: [
        "A peur des mannequins de cire et ne se souvient plus de son nom civil.",
        "A essaye de retirer son casque VR 42 fois la premiere heure.",
        "Son cortex cerebral recherche obstinement des portes de sortie rouges."
      ]},
      caine: { name: "Caine", age: "IA", stress: "12%", avatar: "caine", signal: "C", color: "#ff3333", facts: [
        "Presente chaque anomalie comme une aventure parfaitement volontaire.",
        "Ses dents sont traitees comme un masque d interface admin.",
        "Le module CainOS le classe comme animateur, gardien et bug critique."
      ]},
      bubble: { name: "Bubble", age: "IA", stress: "5%", avatar: "bubble", signal: "B", color: "#f7f7ff", facts: [
        "Apparait dans les logs comme assistant oral de Caine.",
        "Son sprite est presque entierement bouche et dents.",
        "Le filtre C&A signale une appetence anormale pour les donnees inutiles."
      ]},
      jax: { name: "Jax", age: "22", stress: "45%", avatar: "jax", signal: "J", color: "#aa55ff", facts: [
        "Deteste faire les courses et adore causer des ennuis aux autres.",
        "A vole et cache la cle de la chambre de Gangle sous son lit.",
        "Collectionne secretement les pieces detachees de Zooble."
      ]},
      ragatha: { name: "Ragatha", age: "30", stress: "65%", avatar: "ragatha", signal: "R", color: "#ff4444", facts: [
        "Maintient un sourire constant pour cacher ses bugs de collision physique.",
        "Ses coutures repondent comme des points de sauvegarde emotionnels.",
        "Prie secretement pour que Caine fasse une mise a jour corrective."
      ]},
      kinger: { name: "Kinger", age: "48", stress: "98%", avatar: "kinger", signal: "K", color: "#ffffdd", facts: [
        "CainOS detecte une anciennete anormale et des trous memoire non resolus.",
        "Est l un des signaux residents les plus anciens du Cirque.",
        "Collectionne des insectes virtuels imaginaires dans un seau."
      ]},
      queenie: { name: "Queenie", age: "Archive", stress: "ERR", avatar: "queenie", signal: "Q", color: "#f7eecb", facts: [
        "Signal conserve sous forme de residu royal dans la memoire tampon.",
        "CainOS la classe comme sujet abstrait lie au profil de Kinger.",
        "Sa couronne apparait parfois dans les scans de souvenirs."
      ]},
      gangle: { name: "Gangle", age: "26", stress: "55%", avatar: "gangle", signal: "G", color: "#ff88aa", facts: [
        "Son masque de comedie se brise en moyenne 14.8 fois par jour.",
        "Animee par une physique de cordes 2.5D tres gourmande en CPU.",
        "Son humeur suit l integrite du masque actif."
      ]},
      zooble: { name: "Zooble", age: "24", stress: "75%", avatar: "zooble", signal: "Z", color: "#ccff00", facts: [
        "Son corps modulaire contient des pieces incompatibles d autres modeles.",
        "Deteste participer aux aventures scenarisees par Caine.",
        "Sa fiche CainOS change de silhouette a chaque rendu."
      ]},
      kaufmo: { name: "Kaufmo (archive)", age: "Archive - avant abstraction", stress: "INCONNU", avatar: "kaufmo", signal: "K", color: "#575057", facts: [
        "Portrait anterieur a son abstraction, conserve pour identifier l ancien resident clown.",
        "Kaufmo est deja abstrait lorsque Pomni atteint sa chambre dans le Pilote.",
        "Cette forme ne doit jamais apparaitre comme resident actif dans la timeline du Pilote."
      ]},
      abstractedkaufmo: { name: "Kaufmo abstrait", age: "Archive / abstraction - Ep. 1", stress: "NON MESURABLE", avatar: "abstractedkaufmo", signal: "!", color: "#050505", facts: [
        "Forme noire quadrupede a tete conique et yeux multicolores rencontree dans le Pilote.",
        "L abstraction ne parle pas: elle produit seulement des cris, grondements et parasites.",
        "Son contact corrompt les avatars; Caine la bannit dans le Cellar avec les autres abstractions."
      ]},
      cellarabstraction: { name: "Abstraction du Cellar", age: "Phenomene d abstraction", stress: "NON MESURABLE", avatar: "cellarabstraction", signal: "A", color: "#030303", facts: [
        "Forme generique terrestre des residents abstraits enfermes dans le Cellar.",
        "Corps noir dechiquete, quatre pattes trapues, longue tete conique et nombreux yeux multicolores.",
        "Ce n est pas une nouvelle identite: CainOS la classe comme etat d abstraction non verbal."
      ]},
      aquaticabstraction: { name: "Abstraction aquatique", age: "Phenomene d abstraction - Ep. 9", stress: "NON MESURABLE", avatar: "aquaticabstraction", signal: "AQ", color: "#02020a", facts: [
        "Forme noire lisse et tentaculaire visible dans l aquarium des abstractions.",
        "Ses nombreux yeux multicolores restent le principal marqueur commun avec les formes terrestres.",
        "Elle demeure non verbale et ne doit pas etre traitee comme un PNJ de dialogue."
      ]},
      gummigoo: { name: "Gummigoo", age: "NPC", stress: "63%", avatar: "gummigoo", signal: "M", color: "#d8a23a", facts: [
        "PNJ crocodilien dont la memoire a ete menacee par l auto-cleanup.",
        "Son profil C&A alterne entre NPC et HUMAN selon le patch.",
        "Le canyon des sucreries conserve sa signature de sirop."
      ]},
      max: { name: "Max", age: "NPC", stress: "54%", avatar: "max", signal: "X", color: "#75bd3f", facts: [
        "Alligator gummy associe a la bande de Gummigoo.",
        "CainOS le classe comme PNJ de l aventure sucree, pas comme humain connecte.",
        "Sa silhouette western sert a le distinguer de Chad dans les archives."
      ]},
      chad: { name: "Chad", age: "NPC", stress: "49%", avatar: "chad", signal: "H", color: "#8bd64a", facts: [
        "Partenaire gummy de Gummigoo et Max dans le meme sous-systeme narratif.",
        "Son profil garde un signal candy-western stable.",
        "Les logs CainOS le traitent comme PNJ de groupe."
      ]},
      orbsman: { name: "Orbsman", age: "NPC", stress: "33%", avatar: "orbsman", signal: "O", color: "#6dd8ff", facts: [
        "PNJ compose de spheres colorees et de membres segmentes.",
        "Son corps par orbites donne un bon signal radar dans la Wacky Watch.",
        "CainOS le range avec les entites de decor actif et les PNJ episodiques."
      ]},
      loolilalu: { name: "Princess Loolilalu", age: "NPC", stress: "28%", avatar: "loolilalu", signal: "L", color: "#ff9ad5", facts: [
        "Signature royale detectee dans le royaume des sucreries.",
        "Son portrait CainOS utilise un diademe simplifie en pixels.",
        "Classee NPC narratif, autorite locale."
      ]},
      fudge: { name: "The Fudge", age: "NPC", stress: "70%", avatar: "fudge", signal: "F", color: "#7a3d1a", facts: [
        "Masse de confiserie instable signalee dans les logs du canyon.",
        "Sa silhouette est plus facile a lire en tache qu en visage.",
        "CainOS recommande de ne pas le laisser pres des sorties."
      ]},
      gloinkqueen: { name: "Gloink Queen", age: "NPC", stress: "41%", avatar: "gloinkqueen", signal: "O", color: "#58d66b", facts: [
        "Source majeure de proliferation Gloink.",
        "Son sprite est rendu comme un noyau a couronne angulaire.",
        "Les capteurs la confondent parfois avec un bug de collision."
      ]},
      gloinkqueenscale: { name: "Gloink Queen True Scale", age: "NPC Boss", stress: "67%", avatar: "gloinkqueenscale", signal: "Q", color: "#f06f82", facts: [
        "Version taille reelle : la Queen est volontairement enorme face aux Gloinks simples.",
        "Le long corps rose, les taches jaunes, les yeux multiples et les bandes bleues gardent son identite.",
        "CainOS l affiche en format boss pour eviter de la reduire a une petite icone."
      ]},
      mannequin: { name: "Mannequins", age: "NPC", stress: "0%", avatar: "mannequin", signal: "N", color: "#d8d8d8", facts: [
        "Corps blancs generiques utilises par Caine pour peupler les scenes.",
        "Leur absence de visage aide CainOS a economiser de la memoire.",
        "Pomni les classe automatiquement comme malaise prioritaire."
      ]},
      additionalvoices: { name: "Additional Voices", age: "Production / nom non officiel", stress: "NON APPLICABLE", avatar: "additionalvoices", signal: "V", color: "#d78aff", facts: [
        "Mannequin rose-violet issu d un rendu de production et surnomme Additional Voices par les archives communautaires.",
        "Ce nom n identifie pas un personnage canonique des episodes.",
        "CainOS le conserve uniquement dans les extras de production."
      ]},
      ming: { name: "Ming", age: "NPC", stress: "27%", avatar: "ming", signal: "M", color: "#b7c7d8", facts: [
        "Mannequin gris argente avec visage noir, grands yeux blancs et petit chapeau bleu clair.",
        "CainOS le separe d Abel grace a sa palette froide et son regard rond.",
        "Classe comme personnage de fond lie aux mannequins, pas comme archive Abel."
      ]},
      themachine: { name: "The Machine", age: "Promotion / hors timeline", stress: "NON APPLICABLE", avatar: "themachine", signal: "T", color: "#7d4dff", facts: [
        "Boite-machine violette avec yeux globuleux, bouche ouverte, cables et calculatrice bleue.",
        "Personnage de contenu promotionnel externe aux episodes, pas un resident de la timeline canonique.",
        "La grande bouche sombre et le corps en carton restent les marqueurs visuels principaux de cette archive."
      ]},
      abel: { name: "Abel", age: "PNJ supprime - Ep. 7", stress: "88%", avatar: "abel", signal: "A", color: "#66ccff", facts: [
        "PNJ mannequin utilise par Caine dans la fausse aventure d evasion de Beach Episode.",
        "Son recit sur C&A et les capsules etait une fabrication de l aventure.",
        "Abel est supprime par Caine et ne doit pas etre traite comme un administrateur reel."
      ]},
      abelmannequin: { name: "Abel Mannequin", age: "PNJ supprime - Ep. 7", stress: "64%", avatar: "abelmannequin", signal: "M", color: "#ff7a1a", facts: [
        "Version mannequin orange sans visage, proche du corps generique montre en reference.",
        "Les articulations et la posture raide gardent l aspect pantin de test.",
        "Forme de PNJ de l aventure d evasion, pas preuve d une identite C&A reelle."
      ]},
      abelfullbody: { name: "Abel Full Body", age: "PNJ supprime - Ep. 7", stress: "42%", avatar: "abelfullbody", signal: "F", color: "#f08a28", facts: [
        "Version full body orange avec visage souriant simple.",
        "Le corps articule reste proche du mannequin, mais avec identite faciale lisible.",
        "Variante visuelle du meme PNJ fabrique par Caine."
      ]},
      moon: { name: "Moon", age: "PNJ celeste", stress: "NON MESURE", avatar: "moon", signal: "M", color: "#9edcff", facts: [
        "Croissant de lune bleu clair aux yeux et a la bouche soulignes de bleu fonce.",
        "Entite celeste consciente qui s adresse directement a Caine et lui declare son affection.",
        "CainOS la classe comme PNJ de simulation, pas comme humaine connectee."
      ]},
      sun: { name: "Sun", age: "PNJ celeste", stress: "VARIABLE", avatar: "sun", signal: "S", color: "#ffd33d", facts: [
        "Soleil jaune cartoon entoure d une couronne orange, avec grands yeux orange a cils et large sourire.",
        "Il parle et reagit aux personnages; ce n est donc pas une simple source lumineuse de decor.",
        "Dans Beach Episode, Caine utilise sa chaleur pour menacer les PNJ du lac digital."
      ]},
      ribbit: { name: "Ribbit", age: "Abstrait", stress: "100%", avatar: "ribbit", signal: "R", color: "#63d35f", facts: [
        "Membre abstrait repertorie dans les archives des Circus Members.",
        "Silhouette de grenouille verte avec noeud rose et regard fige.",
        "CainOS le classe comme residu de joueur, pas comme PNJ actif."
      ]},
      scratch: { name: "Scratch", age: "Abstrait", stress: "100%", avatar: "scratch", signal: "D", color: "#ffd341", facts: [
        "Membre abstrait a apparence canine, conserve en fiche fantome.",
        "Son chandail rouge reste lisible malgre la corruption du profil.",
        "Les scans le separent des animaux decoratifs du cirque."
      ]},
      wormo: { name: "Wormo", age: "Abstrait", stress: "100%", avatar: "wormo", signal: "W", color: "#70c64f", facts: [
        "Corps de ver a rayures, catalogue comme ancien membre du cirque.",
        "Ses yeux asymetriques reviennent dans les vignettes d archive.",
        "CainOS limite son rendu aux modes basse resolution."
      ]},
      bizco: { name: "Bizco", age: "Abstrait", stress: "100%", avatar: "bizco", signal: "B", color: "#b45cff", facts: [
        "Ancien membre au motif de bouffon multicolore.",
        "Ses gants flottants declenchent des erreurs de hitbox dans CainOS.",
        "La fiche conserve les pois et les yeux spirales comme marqueurs."
      ]},
      rattie: { name: "Rattie", age: "Abstrait", stress: "100%", avatar: "rattie", signal: "T", color: "#b7a891", facts: [
        "Petit profil souris archive parmi les membres abstraits.",
        "La fleur rouge et la bande faciale servent d identifiants visuels.",
        "CainOS evite de le melanger avec les mannequins generiques."
      ]},
      spike: { name: "Spike", age: "Abstrait", stress: "100%", avatar: "spike", signal: "S", color: "#8d5cff", facts: [
        "Dinosaurien violet conserve comme signature d abstraction.",
        "Les formes colorees sur son dos stabilisent le rendu pixel-art.",
        "Aucun ping humain coherent ne subsiste dans son profil."
      ]},
      pinkcyclops: { name: "Pink Furry Cyclops", age: "Abstrait", stress: "100%", avatar: "pinkcyclops", signal: "P", color: "#ff80bd", facts: [
        "Creature rose cyclope, classee comme membre abstrait.",
        "Son unique oeil violet reste le point d ancrage de l avatar.",
        "CainOS marque la fourrure comme bruit visuel persistant."
      ]},
      yellowclown: { name: "Frowning Yellow Clown Creature", age: "Abstrait", stress: "100%", avatar: "yellowclown", signal: "Y", color: "#ffd33f", facts: [
        "Creature clown jaune au visage triste, archivee en profil abstrait.",
        "La collerette bleue et les antennes rouges la rendent identifiable.",
        "Le module Wacky Watch la garde en zone memoire verrouillee."
      ]},
      oyster: { name: "The Oyster", age: "Abstrait", stress: "100%", avatar: "oyster", signal: "O", color: "#8fb7ff", facts: [
        "Membre abstrait en forme d huitre, detecte dans les archives du cirque.",
        "Le corps sombre et les yeux jaunes servent de signature CainOS.",
        "Son signal apparait comme un objet vivant plutot qu un decor."
      ]},
      bulbcreature: { name: "Light Green Bulb Creature", age: "Abstrait", stress: "100%", avatar: "bulbcreature", signal: "U", color: "#a8e85b", facts: [
        "Creature vert clair en forme de bulbe, rattachee aux membres abstraits.",
        "Le nez vert, le noeud orange et les paupieres violettes sont conserves.",
        "CainOS l affiche en archive pour respecter son statut hors episode actif."
      ]},
      ganglekawaii: { name: "Kawaii Gangle", age: "Variante", stress: "24%", avatar: "ganglekawaii", signal: "K", color: "#ff9fcd", facts: [
        "Variante visuelle archivee pour les modes stylises de CainOS.",
        "Ce n est pas une nouvelle personne, mais un skin de Gangle.",
        "Le style kawaii garde les rubans et le masque comme points de fidelite."
      ]},
      ganglecomedy: { name: "Gangle Comedy Mask", age: "Variante", stress: "31%", avatar: "ganglecomedy", signal: "C", color: "#ff6d4a", facts: [
        "Etat de Gangle quand le masque de comedie tient encore.",
        "CainOS le separe pour clarifier les changements d humeur.",
        "Le radar garde le profil lie a Gangle, pas a un autre membre."
      ]},
      gangletragedy: { name: "Gangle Tragedy Mask", age: "Variante", stress: "82%", avatar: "gangletragedy", signal: "T", color: "#8fa8ff", facts: [
        "Etat triste associe au masque endommage ou perdu.",
        "La Wacky Watch l affiche comme variante d etat emotionnel.",
        "Les rubans restent le marqueur principal du profil."
      ]},
      evilpomni: { name: "Evil Pomni", age: "PNJ Variant", stress: "91%", avatar: "evilpomni", signal: "E", color: "#c12b3f", facts: [
        "Contrepartie Evil Big Top traitee comme PNJ variant.",
        "CainOS ne la confond pas avec la vraie Pomni connectee.",
        "Palette sombre et formes de bouffon inversent son signal habituel."
      ]},
      eviljax: { name: "Evil Jax", age: "PNJ Variant", stress: "66%", avatar: "eviljax", signal: "V", color: "#7436c9", facts: [
        "Contrepartie Evil Big Top de Jax, classee PNJ hostile.",
        "La fiche garde les oreilles et la silhouette de lapin comme repere.",
        "CainOS isole ce profil pour eviter les faux positifs du radar."
      ]},
      evilragatha: { name: "Evil Ragatha", age: "PNJ Variant", stress: "76%", avatar: "evilragatha", signal: "A", color: "#b64058", facts: [
        "Contrepartie Evil Big Top de Ragatha en version poupee sombre.",
        "Les coutures et le sourire sont marques comme signaux de variant.",
        "Cette entree reste un PNJ miroir, pas un etat canonique de Ragatha."
      ]},
      evilkinger: { name: "Evil Kinger", age: "PNJ Variant", stress: "97%", avatar: "evilkinger", signal: "I", color: "#b8a06d", facts: [
        "Contrepartie Evil Big Top de Kinger avec couronne fissuree.",
        "Le signal conserve la silhouette de piece d echecs.",
        "CainOS le garde hors des souvenirs de Queenie pour ne pas brouiller le lore."
      ]},
      evilzooble: { name: "Evil Zooble", age: "PNJ Variant", stress: "73%", avatar: "evilzooble", signal: "Z", color: "#f05db6", facts: [
        "Contrepartie Evil Big Top de Zooble, composee de pieces plus agressives.",
        "La modularite reste le point commun avec le profil original.",
        "CainOS l affiche comme variante PNJ, pas comme nouveau corps de Zooble."
      ]},
      evilorbsman: { name: "Evil Orbsman", age: "PNJ Variant", stress: "68%", avatar: "evilorbsman", signal: "Q", color: "#a34dff", facts: [
        "Contrepartie Evil Big Top d Orbsman, utilisee a la place d une Evil Gangle.",
        "La structure en spheres reste visible malgre la corruption visuelle.",
        "Cette entree evite d inventer une contrepartie hostile directe de Gangle."
      ]},
      darkduojax: { name: "Dark Duo Jax", age: "Variante fan", stress: "58%", avatar: "darkduojax", signal: "D", color: "#7b46d8", facts: [
        "Variante sombre inspiree du duo Jax et Gangle que tu as montre.",
        "CainOS la traite comme costume alternatif, pas comme entite canon separee.",
        "Le costume noir et les accents rouges gardent le signal de Jax lisible."
      ]},
      darkduogangle: { name: "Dark Duo Gangle", age: "Variante fan", stress: "61%", avatar: "darkduogangle", signal: "G", color: "#d83d5a", facts: [
        "Variante sombre de Gangle avec rubans rouges et tenue noire.",
        "Le masque blanc souriant reste le marqueur principal du profil.",
        "Classee skin visuel pour eviter de l afficher comme nouvelle personne."
      ]},
      maidjax: { name: "Maid Jax", age: "Variante canon - Ep. 5/9", stress: "42%", avatar: "maidjax", signal: "J", color: "#c88aff", facts: [
        "Costume impose a Jax pendant le softball de l episode Untitled.",
        "Le grand corps de lapin et les yeux jaunes restent conserves.",
        "Cette apparence revient dans l espace mental de Jax pendant Remember."
      ]},
      maidragatha: { name: "Maid Ragatha", age: "Variante fan", stress: "37%", avatar: "maidragatha", signal: "R", color: "#ff6b64", facts: [
        "Variante maid de Ragatha avec tablier long et cheveux rouges.",
        "Le bouton et le calme du profil original restent les reperes visuels.",
        "La fiche est une archive de skin, pas une nouvelle timeline."
      ]},
      maidpomni: { name: "Maid Pomni", age: "Variante fan", stress: "86%", avatar: "maidpomni", signal: "P", color: "#f0f0f0", facts: [
        "Variante maid de Pomni avec silhouette compacte et air inquiet.",
        "Le bonnet conserve la logique du costume de bouffon en version maid.",
        "CainOS l affiche comme variante cosmétique de Pomni."
      ]},
      maidgangle: { name: "Maid Gangle", age: "Variante fan", stress: "57%", avatar: "maidgangle", signal: "M", color: "#e7455e", facts: [
        "Variante maid de Gangle ajoutee depuis les references que tu as envoyees.",
        "Le masque blanc et les rubans rouges restent les reperes essentiels.",
        "CainOS la classe comme costume alternatif, pas comme nouvelle entite."
      ]},
      jaxgirl: { name: "Jax Girl", age: "Variante fan", stress: "48%", avatar: "jaxgirl", signal: "X", color: "#8d65ff", facts: [
        "Variante feminine de Jax inspiree de l image casual que tu as envoyee.",
        "Les oreilles, la peau violette et les yeux jaunes gardent le lien avec Jax.",
        "La tenue casual est archivee comme skin fan hors lore principal."
      ]},
      beachgangle: { name: "Beach Gangle", age: "Variante canon - Ep. 7", stress: "21%", avatar: "beachgangle", signal: "B", color: "#6fb8ff", facts: [
        "Apparence de Gangle pendant la sortie au Digital Lake.",
        "Le grand chapeau, le bleu estival et les rubans rouges gardent la lecture immediate.",
        "Debloquee uniquement avec la progression de Beach Episode."
      ]},
      japanesegangle: { name: "Japanese Gangle", age: "Variante canon - Ep. 5", stress: "34%", avatar: "japanesegangle", signal: "G", color: "#f05c6a", facts: [
        "Forme anime scolaire generee pendant les micro-aventures d Untitled.",
        "Le masque et les rubans restent prioritaires sur le costume.",
        "Il s agit d un costume temporaire de simulation, pas d une nouvelle Gangle."
      ]},
      rhinogangle: { name: "Rhino Gangle", age: "Variante canon - Ep. 5", stress: "67%", avatar: "rhinogangle", signal: "N", color: "#e8e1d6", facts: [
        "Transformation de Gangle pendant Poacher s Paradise.",
        "La tete blanche et le corps ressort gardent une lecture volontairement bizarre.",
        "Debloquee avec la micro-aventure de chasse d Untitled."
      ]},
      workgangle: { name: "Work Gangle", age: "Variante canon - Ep. 4", stress: "74%", avatar: "workgangle", signal: "W", color: "#477da8", facts: [
        "Tenue de manager de Gangle pendant le service chez Spudsy s.",
        "Le badge et la posture fatiguee rappellent le rendu manager.",
        "Cette forme est liee a Fast Food Masquerade et a la pression du masque."
      ]},
      japanesejax: { name: "Japanese Jax", age: "Variante canon - Ep. 5", stress: "52%", avatar: "japanesejax", signal: "J", color: "#7c55df", facts: [
        "Version anime school de Jax avec blazer sombre et cravate.",
        "Les oreilles violettes et les yeux jaunes gardent l identite du profil.",
        "Costume temporaire de la micro-aventure anime scolaire d Untitled."
      ]},
      japaneseragatha: { name: "Japanese Ragatha", age: "Variante canon - Ep. 5", stress: "40%", avatar: "japaneseragatha", signal: "R", color: "#e85b58", facts: [
        "Version anime school de Ragatha avec uniforme et cheveux rouges.",
        "Le bouton et le sourire doux restent les reperes du personnage.",
        "Costume temporaire de la micro-aventure anime scolaire d Untitled."
      ]},
      japanesepomni: { name: "Japanese Pomni", age: "Variante canon - Ep. 5", stress: "89%", avatar: "japanesepomni", signal: "P", color: "#4a8dff", facts: [
        "Version anime school de Pomni avec uniforme et details de bouffon.",
        "La petite silhouette inquiete reste volontairement conservee.",
        "Costume temporaire de la micro-aventure anime scolaire d Untitled."
      ]},
      japanesekinger: { name: "Japanese Kinger", age: "Variante canon - Ep. 5", stress: "96%", avatar: "japanesekinger", signal: "K", color: "#e5cf99", facts: [
        "Version anime school de Kinger avec sac et uniforme.",
        "La piece d echecs et la couronne restent les marqueurs principaux.",
        "Le stress reste haut meme en uniforme scolaire."
      ]},
      japanesezooble: { name: "Japanese Zooble", age: "Variante canon - Ep. 5", stress: "69%", avatar: "japanesezooble", signal: "Z", color: "#f06cb8", facts: [
        "Version anime school de Zooble avec pieces modulaires et sac.",
        "La tete angulaire et les membres incompatibles restent visibles.",
        "Costume temporaire de la micro-aventure anime scolaire d Untitled."
      ]},
      japanesegummigoo: { name: "Japanese Gummigoo", age: "Variante fan", stress: "43%", avatar: "japanesegummigoo", signal: "Y", color: "#78c84a", facts: [
        "Version anime school de Gummigoo avec uniforme et touches candy-western.",
        "La silhouette alligator reste differente de Max et Chad.",
        "Archivee comme variante fan liee au groupe gummy."
      ]},
      baseballjax: { name: "Baseball Jax", age: "Variante canon - Ep. 5", stress: "46%", avatar: "baseballjax", signal: "B", color: "#b874e8", facts: [
        "Variante baseball de Jax avec uniforme rose, casquette bleue et gant jaune.",
        "Les longues oreilles et le sourire moqueur restent les reperes du profil.",
        "Costume du softball d Untitled, avant le vote du costume maid."
      ]},
      baseballzooble: { name: "Baseball Zooble", age: "Variante canon - Ep. 5", stress: "64%", avatar: "baseballzooble", signal: "O", color: "#f27ad3", facts: [
        "Variante baseball de Zooble avec casquette bleue et membres sportifs depareilles.",
        "La tete angulaire et les pieces incompatibles restent visibles.",
        "Le module radar la lie a Zooble malgre l equipement."
      ]},
      baseballgangle: { name: "Baseball Gangle", age: "Variante canon - Ep. 5", stress: "78%", avatar: "baseballgangle", signal: "G", color: "#d84747", facts: [
        "Variante baseball de Gangle avec casquette bleue et jersey leger.",
        "Le corps reste un ruban rouge, pas des jambes humaines.",
        "CainOS garde l expression triste du masque comme signature."
      ]},
      baseballragatha: { name: "Baseball Ragatha", age: "Variante canon - Ep. 5", stress: "36%", avatar: "baseballragatha", signal: "R", color: "#6d86dd", facts: [
        "Variante baseball de Ragatha en robe uniforme bleue avec batte.",
        "Les cheveux rouges et l oeil bouton restent le point d ancrage.",
        "Costume du softball canon d Untitled."
      ]},
      baseballpomni: { name: "Baseball Pomni", age: "Variante canon - Ep. 5", stress: "91%", avatar: "baseballpomni", signal: "P", color: "#4068e8", facts: [
        "Variante baseball de Pomni avec casquette bleue et tenue compacte.",
        "La silhouette de bouffon reste visible sous l equipement sportif.",
        "Le stress CainOS reste eleve meme pendant le match."
      ]},
      baseballkinger: { name: "Baseball Kinger", age: "Variante canon - Ep. 5", stress: "99%", avatar: "baseballkinger", signal: "K", color: "#d7c9aa", facts: [
        "Variante baseball de Kinger avec casquette et gant.",
        "La piece d echecs haute et les yeux paniques restent prioritaires.",
        "CainOS recommande de ne pas lui confier la strategie de l equipe."
      ]},
      rivalbaseballzooble: { name: "Rival Baseball Zooble", age: "PNJ canon - Evil Big Tops", stress: "72%", avatar: "rivalbaseballzooble", signal: "Z", color: "#f5d33b", facts: [
        "Variante equipe adverse de Zooble en couleurs jaune, bleu et rose.",
        "Les pieces modulaires restent volontairement asymetriques.",
        "CainOS la distingue du costume baseball principal par son signal rival."
      ]},
      rivalbaseballpomni: { name: "Rival Baseball Pomni", age: "PNJ canon - Evil Big Tops", stress: "94%", avatar: "rivalbaseballpomni", signal: "P", color: "#d7382f", facts: [
        "Variante equipe adverse de Pomni avec uniforme jaune et rouge.",
        "Le regard plus determine rappelle le camp oppose.",
        "Contrepartie PNJ de l equipe Evil Big Tops, pas une nouvelle Pomni humaine."
      ]},
      rivalbaseballpinkgiant: { name: "Rival Baseball Pink Giant", age: "PNJ canon - Evil Big Tops", stress: "59%", avatar: "rivalbaseballpinkgiant", signal: "G", color: "#f05a9f", facts: [
        "Gros joueur rose de l equipe adverse, separe de Gangle dans CainOS.",
        "Son corps rond segmente reste lisse, sans armure ni epaulettes.",
        "La fiche corrige l ancien amalgame avec Gangle."
      ]},
      rivalbaseballragatha: { name: "Rival Baseball Ragatha", age: "PNJ canon - Evil Big Tops", stress: "44%", avatar: "rivalbaseballragatha", signal: "R", color: "#e86493", facts: [
        "Variante equipe adverse de Ragatha en uniforme rose.",
        "Les cheveux bleus et l oeil bouton gardent l identite de ce costume.",
        "Contrepartie PNJ canonique du match d Untitled."
      ]},
      rivalbaseballjax: { name: "Rival Baseball Jax", age: "PNJ canon - Evil Big Tops", stress: "50%", avatar: "rivalbaseballjax", signal: "J", color: "#7a244d", facts: [
        "Variante equipe adverse de Jax avec peau bordeaux et tenue bleue.",
        "Pas de chapeau : les longues oreilles restent visibles.",
        "CainOS l associe au camp oppose du match."
      ]},
      rivalbaseballkinger: { name: "Rival Baseball Kinger", age: "PNJ canon - Evil Big Tops", stress: "99%", avatar: "rivalbaseballkinger", signal: "Q", color: "#8e8f9b", facts: [
        "Variante equipe adverse de Kinger avec piece grise et bordures jaunes.",
        "La casquette de commandant est stylisee, sans symbole reel.",
        "La posture autoritaire remplace l attitude panique habituelle."
      ]},
      shadowpomni: { name: "Shadow Pomni", age: "Variante cauchemar", stress: "99%", avatar: "shadowpomni", signal: "S", color: "#39ff66", facts: [
        "Silhouette d ombre inspiree des peurs de Pomni, avec bonnet de bouffon deforme.",
        "CainOS la classe comme projection visuelle, pas comme vraie Pomni hostile.",
        "Le sourire et les griffes servent a renforcer l effet poursuite."
      ]},
      shadowjax: { name: "Shadow Jax", age: "Variante cauchemar", stress: "82%", avatar: "shadowjax", signal: "J", color: "#5cff86", facts: [
        "Ombre longue de Jax avec oreilles et bras etires.",
        "Le profil garde une lecture de lapin moqueur, mais en menace de couloir.",
        "Classee skin d ambiance pour sequences de peur."
      ]},
      shadowragatha: { name: "Shadow Ragatha", age: "Variante cauchemar", stress: "88%", avatar: "shadowragatha", signal: "R", color: "#ff4f5f", facts: [
        "Ombre de poupee chiffon avec cheveux en masse sombre et oeil bouton rouge.",
        "CainOS la lie aux bugs de couture et aux scans de panique.",
        "Ce n est pas une abstraction canonique, seulement une variante d horreur."
      ]},
      shadowkinger: { name: "Shadow Kinger", age: "Variante cauchemar", stress: "100%", avatar: "shadowkinger", signal: "K", color: "#d8d8d8", facts: [
        "Ombre de piece d echecs fissuree avec couronne trop haute.",
        "Le corps semble se casser comme une memoire qui surcharge.",
        "La fiche reste associee a Kinger et a ses peurs."
      ]},
      shadowgangle: { name: "Shadow Gangle", age: "Variante cauchemar", stress: "93%", avatar: "shadowgangle", signal: "G", color: "#e8455d", facts: [
        "Ombre de Gangle avec masque sombre et rubans emmeles.",
        "Les rubans remplacent les membres pour garder son identite lisible.",
        "CainOS l utilise comme etat visuel d anxiete extreme."
      ]},
      shadowzooble: { name: "Shadow Zooble", age: "Variante cauchemar", stress: "86%", avatar: "shadowzooble", signal: "Z", color: "#bbff33", facts: [
        "Ombre modulaire de Zooble avec pieces incompatibles plus anguleuses.",
        "La silhouette asymetrique reste le point de reconnaissance principal.",
        "Archivee comme skin cauchemar, pas comme nouveau corps."
      ]},
      shadowcaine: { name: "Shadow Caine", age: "Variante cauchemar", stress: "40%", avatar: "shadowcaine", signal: "C", color: "#ff3333", facts: [
        "Ombre de Caine centree sur les dents, les yeux et la presence d administrateur.",
        "CainOS la signale comme intrusion theatrale plutot que comme entite separee.",
        "La forme sert aux moments ou le systeme transforme l animateur en menace."
      ]},
      baronmildenhall: { name: "Baron Theodore Mildenhall", age: "PNJ - Ep. 3", stress: "100%", avatar: "baronmildenhall", signal: "B", color: "#7b8dff", facts: [
        "PNJ central du manoir, lie aux enregistrements et a la menace du sous-sol.",
        "La silhouette bleutee, le costume et l arme gardent son identite de baron chasseur.",
        "CainOS le classe comme entite de l aventure Mildenhall, pas comme resident du Cirque."
      ]},
      marthamildenhall: { name: "Martha Mildenhall", age: "PNJ - Ep. 3", stress: "??", avatar: "marthamildenhall", signal: "M", color: "#7df0ff", facts: [
        "Fantome cyan-vert au grand chapeau, voix douce et role lie aux souvenirs de Kinger.",
        "Les yeux blancs et la transparence lumineuse gardent l aspect spectral officiel.",
        "Son profil se debloque tard dans le manoir pour eviter le spoiler de la revelation."
      ]},
      ghostly: { name: "Ghostly", age: "PNJ - Ep. 3", stress: "12%", avatar: "ghostly", signal: "G", color: "#7dffd8", facts: [
        "Petit esprit lumineux du manoir, distinct de Martha.",
        "Sa forme ronde, ses yeux brillants et son sourire le rendent lisible comme PNJ spectral.",
        "CainOS le garde separe des projections horrifiques de Pomni."
      ]},
      angel: { name: "Angel", age: "PNJ - Ep. 3", stress: "91%", avatar: "angel", signal: "A", color: "#e5d7d7", facts: [
        "Creature ailée de Mildenhall, d abord interpretee comme menace avant la correction du récit.",
        "Les ailes ramifiees avec trous oculaires et le corps pale sont ses marqueurs visuels.",
        "CainOS evite de la nommer monstre une fois l information de l episode connue."
      ]},
      disappearingguy: { name: "Disappearing Guy", age: "PNJ - Ep. 6", stress: "??", avatar: "disappearingguy", signal: "D", color: "#c34232", facts: [
        "Mannequin rouge a chapeau, interrompu par sa disparition pendant la ceremonie.",
        "Sa fiche est volontairement courte: le gag repose sur son apparition fugace.",
        "CainOS le place avec les signaux des Favorite Character Awards."
      ]},
      committeemember: { name: "Committee Member", age: "PNJ - Ep. 6", stress: "18%", avatar: "committeemember", signal: "C", color: "#f4f4f0", facts: [
        "Mannequin de comite lie aux Favorite Character Awards.",
        "Le ruban et le clipboard le distinguent des mannequins generiques sans inventer une identite humaine.",
        "Son profil reste un PNJ administratif de la ceremonie."
      ]},
      truthtellerfish: { name: "Orange Crappy Looking Fish", age: "PNJ - Ep. 7", stress: "61%", avatar: "truthtellerfish", signal: "O", color: "#ff9b32", facts: [
        "Poisson orange du lac digital et frere du poisson rouge; il tente de proteger leur coffre englouti.",
        "Le transcript l identifie comme Truth-Teller NPC avant qu il constate le vol de ses economies.",
        "Crappy Looking Fish est un nom de groupe; Orange reste une designation descriptive, pas une identite humaine."
      ]},
      liarfish: { name: "Red Crappy Looking Fish", age: "PNJ - Ep. 7", stress: "37%", avatar: "liarfish", signal: "R", color: "#ff3264", facts: [
        "Poisson rouge du lac digital et frere du poisson orange.",
        "Le transcript l identifie comme Liar NPC; il annonce lui-meme qu il est celui qui ment.",
        "Sa silhouette rouge, ses yeux bleus decales et ses levres epaisses suivent son apparence officielle."
      ]},
      stupidburgermannequin: { name: "Spudsy Mannequin - Stupid Burger", age: "PNJ mannequin - Ep. 4", stress: "NON MESURE", avatar: "stupidburgermannequin", signal: "SB", color: "#ff9b37", facts: [
        "Mannequin en bois orange sans visage qui commande un Stupid Burger au comptoir de Spudsy's.",
        "Il insiste sur la sauce qui rend stupide et affirme commander ce produit regulierement.",
        "Le suffixe Stupid Burger de CainOS decrit la scene; aucun nom propre n est confirme."
      ]},
      cerealmannequin: { name: "Spudsy Mannequin - Cereal Bowl", age: "PNJ mannequin - Ep. 4", stress: "NON MESURE", avatar: "cerealmannequin", signal: "CB", color: "#ff9b37", facts: [
        "Mannequin en bois orange sans visage present dans la file du rush de midi chez Spudsy's.",
        "Il refuse de commander parce qu il possede deja un bol de cereales, puis continue a manger.",
        "Le suffixe Cereal Bowl de CainOS decrit l accessoire; aucun nom propre n est confirme."
      ]},
      shrimpnpc: { name: "Shrimp NPC", age: "PNJ - Ep. 7", stress: "83%", avatar: "shrimpnpc", signal: "S", color: "#ff8f4a", facts: [
        "Crevette du lac digital consciente d etre un PNJ dans la scene.",
        "Ses grands yeux, ses antennes et son corps orange restent les signes visuels principaux.",
        "CainOS la lie a la purge solaire de Caine pendant Beach Episode."
      ]},
      chineseroomnpc: { name: "Chinese Room NPC", age: "PNJ - Ep. 7", stress: "44%", avatar: "chineseroomnpc", signal: "C", color: "#d8b4fe", facts: [
        "Mannequin de la Chinese Room assis derriere un dictionnaire artificiel.",
        "Ce profil represente la couche admin gag consultee avant le lac digital.",
        "La grande couverture C&A sert de repere pour ne pas le confondre avec Abel."
      ]},
      horrorghost: { name: "Horror Ghost Lady", age: "Variante fan", stress: "??", avatar: "horrorghost", signal: "H", color: "#58fff0", facts: [
        "Ancienne projection spectrale CainOS, conservee comme variante d ambiance.",
        "Pour le canon Mildenhall precis, utilisez Martha Mildenhall ou Ghostly.",
        "CainOS la garde comme skin horreur generique pour les sequences non strictement transcript."
      ]},
      horrormonster: { name: "Horror Screaming Monster", age: "Variante fan", stress: "100%", avatar: "horrormonster", signal: "M", color: "#f2f2f2", facts: [
        "Monstre au masque blanc avec bouche verticale et dents multiples.",
        "Les yeux spirales et les traces rouges servent de signal panique.",
        "Archive CainOS creee pour les sequences horror non gore."
      ]},
      horrorpomnivoid: { name: "Horror Pomni Void-Eyes", age: "Variante fan", stress: "100%", avatar: "horrorpomnivoid", signal: "V", color: "#1b1b1b", facts: [
        "Pomni horrifique avec grands yeux noirs et larmes d ombre.",
        "Les deux accessoires ronds rappellent la scene de manoir sans changer son identite.",
        "Classee projection de peur, pas vraie transformation definitive."
      ]},
      horrorpomnispiral: { name: "Horror Pomni Spiral-Eyes", age: "Variante fan", stress: "100%", avatar: "horrorpomnispiral", signal: "O", color: "#ff8a18", facts: [
        "Pomni corrompue par des yeux spirales lumineux et un sourire trop large.",
        "Le rouge, bleu et jaune restent visibles sous la lumiere verte et orange.",
        "CainOS l utilise pour les moments ou le systeme accentue la menace."
      ]},
      horrorpomniskull: { name: "Horror Pomni Skull-Mask", age: "Variante fan", stress: "98%", avatar: "horrorpomniskull", signal: "K", color: "#ffb32c", facts: [
        "Pomni avec masque jaune-orange, yeux noirs tombants et petites dents serrees.",
        "La silhouette de bouffon reste lisible malgre le visage skull.",
        "Skin horrifique separe des versions Shadow et Evil."
      ]},
      hunterjax: { name: "Hunter Jax", age: "Variante canon - Ep. 5", stress: "47%", avatar: "hunterjax", signal: "H", color: "#c4a45f", facts: [
        "Tenue de chasseur de Jax pendant Poacher s Paradise dans Untitled.",
        "Les longues oreilles, la peau violette et le regard jaune gardent son identite.",
        "Debloquee avec la micro-aventure de chasse, pas avec Beach Episode."
      ]},
      gloinkstar: { name: "Star Gloink", age: "Gloink", stress: "19%", avatar: "gloinkstar", signal: "S", color: "#7348ff", facts: [
        "Gloink etoile violette avec deux yeux asymetriques et levres jaunes.",
        "La forme a cinq pointes est son identifiant principal dans CainOS.",
        "Classee petite entite Gloink, separee de la Gloink Queen."
      ]},
      gloinkcube: { name: "Cube Gloink", age: "Gloink", stress: "22%", avatar: "gloinkcube", signal: "C", color: "#2fb642", facts: [
        "Gloink cube vert avec yeux cercles de violet et petite bouche rouge.",
        "Sa silhouette en bloc permet de la distinguer des autres formes.",
        "CainOS la traite comme variante de forme, pas comme PNJ majeur."
      ]},
      gloinkpyramid: { name: "Pyramid Gloink", age: "Gloink", stress: "24%", avatar: "gloinkpyramid", signal: "P", color: "#b41432", facts: [
        "Gloink pyramide rouge avec yeux decales et petite bouche bleue.",
        "Le triangle reste lisible meme en icone basse resolution.",
        "Archivee avec les autres formes Gloink simples."
      ]},
      gloinkcrescent: { name: "Crescent Gloink", age: "Gloink", stress: "18%", avatar: "gloinkcrescent", signal: "L", color: "#8b3cff", facts: [
        "Gloink croissant violet avec yeux places sur la courbe.",
        "La bouche bleue et la forme de lune gardent son profil distinct.",
        "CainOS la classe comme forme Gloink non royale."
      ]},
      gloinkpin: { name: "Pin Gloink", age: "Gloink", stress: "21%", avatar: "gloinkpin", signal: "I", color: "#35c641", facts: [
        "Gloink vert en forme de quille avec yeux lateraux et levres jaunes.",
        "Son corps haut et arrondi evite la confusion avec le cube.",
        "La fiche conserve la logique toy-like des Gloinks."
      ]},
      gloinkround: { name: "Round Gloink", age: "Gloink", stress: "17%", avatar: "gloinkround", signal: "O", color: "#c4b62d", facts: [
        "Gloink rond jaune avec deux yeux et petite bouche rouge.",
        "Forme compacte, simple a lire sur le radar CainOS.",
        "Classee petite entite Gloink de base."
      ]},
      blueai: { name: "Blue AI", age: "IA canonique - Ep. 9", stress: "NON MESURE", avatar: "blueai", signal: "BLUE", color: "#00ddff", facts: [
        "Blue AI a ete developpee par C&A comme remplacement de Caine.",
        "Caine l a absorbee, reunissant leurs capacites pendant une periode de la timeline.",
        "Remember montre leur separation; ce profil est canonique et distinct de la mission bonus Fusion 1993."
      ]},
      cookiebutterfly: { name: "Cookie Butterfly", age: "PNJ", stress: "12%", avatar: "cookiebutterfly", signal: "CB", color: "#ff9e8e", facts: [
        "Petit PNJ decoratif a ailes rose saumon, motif biscuit et corps central.",
        "La Wacky Watch le classe comme entite de simulation, pas comme sujet connecte.",
        "Son profil sert surtout a enrichir les zones candy/lac sans inventer de role humain."
      ]},
      gummyelephant: { name: "Gummy Elephant", age: "PNJ", stress: "18%", avatar: "gummyelephant", signal: "GE", color: "#ff85b7", facts: [
        "Creature gummy rose et jaune, proche des logiques de confiserie de Candy Canyon.",
        "CainOS le traite comme PNJ/figurant de simulation.",
        "La trompe longue et la texture translucide sont les marqueurs visuels principaux."
      ]},
      giantcentipede: { name: "Giant Centipede", age: "PNJ", stress: "71%", avatar: "giantcentipede", signal: "GC", color: "#c89436", facts: [
        "Grand insecte segmente avec tete rouge et nombreuses pattes.",
        "Son echelle doit rester plus grande qu un figurant standard dans le mode FPS.",
        "CainOS le classe comme menace/creature de decor selon la zone, pas comme resident."
      ]},
      drfootball: { name: "Dr. Football", age: "Decor", stress: "0%", avatar: "drfootball", signal: "DF", color: "#d94338", facts: [
        "Masque rouge inquietant indexe comme prop/personnage mineur.",
        "Ce n est pas un resident du Cirque: CainOS le range dans les objets de decor actif.",
        "Le visage rouge, les yeux creux et la bouche ouverte restent les seules donnees fiables."
      ]},
      spudsycustomer: { name: "Spudsy Customer", age: "PNJ reconstruit", stress: "79%", avatar: "spudsycustomer", signal: "SC", color: "#f1c24d", facts: [
        "Client Spudsy reconstruit pour representer les PNJ de service de l episode restaurant.",
        "Son role est fonctionnel: pression de comptoir, file d attente et tickets de commande.",
        "CainOS le garde separe des personnages nommes pour ne pas inventer une identite canon."
      ]},
      candyguardcyan: { name: "Candy Guard Cyan", age: "PNJ silencieux - Ep. 2", stress: "0%", avatar: "candyguardcyan", signal: "CG1", color: "#27d7e7", facts: [
        "Premier des trois mannequins gardes visibles dans les donnees de Candy Canyon.",
        "La teinte cyan distingue son modele, mais aucun nom ni caractere individuel n est confirme.",
        "CainOS le classe comme garde silencieux de Princess Loolilalu, pas comme sujet humain."
      ]},
      candyguardblue: { name: "Candy Guard Blue", age: "PNJ silencieux - Ep. 2", stress: "0%", avatar: "candyguardblue", signal: "CG2", color: "#2568f5", facts: [
        "Deuxieme mannequin garde de Candy Canyon, rendu dans un bleu plus profond.",
        "Il partage la meme silhouette articulee et la meme fonction que les autres gardes.",
        "Aucun dialogue ou profil individuel n est attribue a ce figurant."
      ]},
      candyguardpurple: { name: "Candy Guard Violet", age: "PNJ silencieux - Ep. 2", stress: "0%", avatar: "candyguardpurple", signal: "CG3", color: "#7755e8", facts: [
        "Troisieme mannequin garde indexe dans les modeles de l aventure Candy Canyon.",
        "Sa teinte violet-bleu est un marqueur visuel, pas une identite distincte confirmee.",
        "CainOS le maintient dans les PNJ de palais et dans la couche de test."
      ]},
      gummyworm: { name: "Gummy Worm", age: "PNJ decoratif - Ep. 2", stress: "4%", avatar: "gummyworm", signal: "GW", color: "#ef5a94", facts: [
        "Petit ver gommeux visible uniquement dans les douves chocolat du Candy Canyon Kingdom.",
        "Son corps segmente rose sert de faune de decor; aucun dialogue n est confirme.",
        "CainOS le garde a petite echelle pour ne pas le confondre avec Gummy Elephant."
      ]},
      barrelmonkey: { name: "Barrel Monkey", age: "PNJ jouet - Ep. 1", stress: "36%", avatar: "barrelmonkey", signal: "BM", color: "#e43c32", facts: [
        "Singe jouet rouge aux bras et a la queue en crochets, present dans le Pilote.",
        "Un exemplaire est detruit pendant la poursuite de Kaufmo abstrait.",
        "Il reste un accessoire anime de Caine, sans identite humaine ni dialogue propre."
      ]},
      jeffery: { name: "Jeffery", age: "Extension de Caine", stress: "0%", avatar: "jeffery", signal: "JE", color: "#f4f4ee", facts: [
        "Jeffery est le nom donne a l oeil droit vert de Caine dans les contenus associes a la serie.",
        "Il peut prendre une forme de danseur humanoide a tete blanche en forme d oeil.",
        "CainOS le classe comme extension theatrale de Caine, pas comme resident separe."
      ]},
      redmannequin: { name: "Red Mannequin", age: "PNJ silencieux - Ep. 2", stress: "0%", avatar: "redmannequin", signal: "MR", color: "#f33d34", facts: [
        "Variante rouge des mannequins visibles dans les foules et decors de Candy Canyon.",
        "CainOS l indexe comme modele de foule, sans nom, dialogue ou biographie individuelle.",
        "Son role est visuel: densifier les zones sucreries sans creer un nouveau resident."
      ]},
      orangemannequin: { name: "Orange Mannequin", age: "PNJ silencieux - Ep. 2", stress: "0%", avatar: "orangemannequin", signal: "MO", color: "#ff8a2a", facts: [
        "Variante orange des mannequins de foule du Candy Canyon Kingdom.",
        "La couleur distingue le modele, mais ne confirme aucune identite propre.",
        "La fiche reste classee PNJ/decor pour conserver la separation entre residents et figurants."
      ]},
      yellowmannequin: { name: "Yellow Mannequin", age: "PNJ silencieux - Ep. 2", stress: "0%", avatar: "yellowmannequin", signal: "MY", color: "#ffd83f", facts: [
        "Variante jaune des mannequins de foule rattaches a l aventure Candy Canyon.",
        "CainOS ne lui attribue aucune parole: seulement une presence visuelle de simulation.",
        "Son deblocage suit l arrivee au royaume pour eviter les spoilers avant l episode 2."
      ]},
      magentamannequin: { name: "Magenta Mannequin", age: "PNJ silencieux - Ep. 2", stress: "0%", avatar: "magentamannequin", signal: "MM", color: "#f04ad8", facts: [
        "Variante magenta des mannequins visibles dans les plans de Candy Canyon.",
        "Elle peut renforcer une foule ou un poste de palais, sans devenir un personnage parlant.",
        "CainOS conserve la teinte comme marqueur visuel uniquement."
      ]},
      mildenhallsouls: { name: "Mildenhall Souls", age: "Entite spectrale - Ep. 3", stress: "NON MESURE", avatar: "mildenhallsouls", signal: "MS", color: "#77f5da", facts: [
        "Amas spectral lie au manoir de Mildenhall et aux manifestations qui entourent la possession.",
        "Les ames sont traitees comme phenomene de scene, pas comme residents individuels identifies.",
        "CainOS les affiche apres les sequences du manoir pour conserver la progression horrifique."
      ]},
      albertspudsy: { name: "Albert Spudsy", age: "Visuel de marque - Ep. 4", stress: "0%", avatar: "albertspudsy", signal: "AS", color: "#f2d7b2", facts: [
        "Albert Spudsy est conserve comme image/decoupe liee a Spudsy's, pas comme PNJ vivant.",
        "La fiche sert a reconnaitre le branding du restaurant dans le mode FPS.",
        "CainOS bloque toute biographie inventee au-dela de son role de visuel de marque."
      ]},
      bonepastor: { name: "The Bone Pastor", age: "Production / hors timeline", stress: "NON APPLICABLE", avatar: "bonepastor", signal: "BP", color: "#e7dfc7", facts: [
        "Personnage du comic de production partage en dehors des episodes, pas un easter egg de Mildenhall Manor.",
        "Il ne fait partie d aucune distribution d episode et ne doit pas apparaitre comme PNJ physique du mode canon.",
        "CainOS le conserve uniquement dans les archives de production."
      ]},
      fourthcrocodile: { name: "Fourth Crocodile", age: "Entite de tourment - Ep. 8", stress: "NON MESURE", avatar: "fourthcrocodile", signal: "FC", color: "#d4c840", facts: [
        "Crocodile quadrupede jaune realiste aux yeux jaune vif invoque pendant la sequence de tourment de l episode 8.",
        "Aucun nom propre n est confirme dans l episode; Fourth Crocodile reste une designation descriptive.",
        "CainOS ne confirme aucun lien familial avec Gummigoo."
      ]},
      ragathamothershadow: { name: "Feminine Shadow", age: "Entite de tourment - Ep. 8", stress: "NON MESURE", avatar: "ragathamothershadow", signal: "FS", color: "#18111f", facts: [
        "Silhouette feminine sombre projetee face a Ragatha pendant la sequence de tourment.",
        "Sa coiffure et la mise en scene suggerent une figure maternelle liee a Ragatha.",
        "L identite Ragatha's Mother reste une interpretation; CainOS l affiche comme non confirmee."
      ]},
      paintedmasks: { name: "Painted Masks", age: "Decor de tourment - Ep. 8", stress: "0%", avatar: "paintedmasks", signal: "PM", color: "#f7f7f7", facts: [
        "Ensemble de cinq peintures montrant des masques de Gangle alternant joie et tristesse.",
        "Ces tableaux appartiennent a la sequence de tourment de Gangle.",
        "Ils sont des objets de scene et ne constituent pas cinq personnages distincts."
      ]},
      zoobleparts: { name: "Body Parts and Mirrors", age: "Decor de tourment - Ep. 8", stress: "0%", avatar: "zoobleparts", signal: "ZM", color: "#ff4fb8", facts: [
        "Assemblage de pieces corporelles de Zooble accompagne de deux miroirs noirs.",
        "La composition apparait pendant la sequence de tourment de Zooble.",
        "CainOS la classe comme decor inspectable, pas comme nouvel avatar de Zooble."
      ]},
      laughingshadows: { name: "Laughing Shadows", age: "Entites de tourment - Ep. 8", stress: "NON MESURE", avatar: "laughingshadows", signal: "LS", color: "#05020d", facts: [
        "Trois silhouettes noires au rire cruel apparaissent pendant le tourment de Jax.",
        "Leurs formes rappellent Kaufmo, Pomni et Ribbit sans restaurer ces personnages.",
        "CainOS les traite comme groupe de projections, pas comme trois residents actifs."
      ]},
      floatingworm: { name: "Floating Worm", age: "Figurant - Ep. 9", stress: "NON MESURE", avatar: "floatingworm", signal: "FW", color: "#d85bd8", facts: [
        "Petit ver rose-violet flottant dans l arriere-plan d un souvenir de Remember.",
        "Aucun nom propre ni dialogue ne lui est attribue dans l episode.",
        "CainOS le traite comme figurant silencieux de simulation."
      ]},
      creditsfish: { name: "Credits Fish", age: "Figurant de generique - Ep. 9", stress: "NON MESURE", avatar: "creditsfish", signal: "CF", color: "#ef6d62", facts: [
        "Poisson rouge-orange a nageoires jaunes visible pendant le generique de Remember.",
        "Il n a ni nom officiel individuel ni dialogue confirme.",
        "Sa fiche est un index visuel de generique, pas une biographie inventee."
      ]},
      stabbedragdolls: { name: "Stabbed Ragdolls", age: "Decor de tourment - Ep. 8", stress: "0%", avatar: "stabbedragdolls", signal: "SR", color: "#d55a5a", facts: [
        "Poupees de chiffon transpercees visibles dans la sequence de tourment.",
        "Elles sont des objets de scene sans conscience ni dialogue confirme.",
        "CainOS les expose comme decor inspectable et non comme PNJ."
      ]},
      coiledcentipedes: { name: "Coiled Centipedes", age: "Decor de tourment - Ep. 8", stress: "0%", avatar: "coiledcentipedes", signal: "CC", color: "#8b6d35", facts: [
        "Centipedes enroules utilises comme objets visuels pendant la sequence de tourment.",
        "Aucune identite individuelle ni parole ne leur est attribuee.",
        "CainOS les conserve comme groupe de decor."
      ]},
      unusedbrainscans: { name: "Unused Brainscans", age: "Artefact C&A - Ep. 9", stress: "0%", avatar: "unusedbrainscans", signal: "UB", color: "#50d9ff", facts: [
        "Scans cerebraux inutilises visibles dans les archives C&A de Remember.",
        "Ils constituent un artefact technique, pas un personnage ni une conscience autonome.",
        "La fiche reste verrouillee jusqu a la revelation C&A correspondante."
      ]},
      abigailbrooks: { name: "Abigail Brooks", age: "Contrepartie humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "abigailbrooks", signal: "AB", color: "#f2c7b5", facts: [
        "Contrepartie humaine dont la copie numerique est Pomni; les deux existent comme personnes distinctes.",
        "Elle travaille toujours comme comptable et publie encore occasionnellement des videos avec de nouveaux amis.",
        "Son profil est une projection du monde reel revelee par Caine, pas un resident physique du Cirque."
      ]},
      suzieackerman: { name: "Suzie J. Ackerman", age: "Contrepartie humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "suzieackerman", signal: "SA", color: "#9b6b52", facts: [
        "Contrepartie humaine dont la copie numerique est Ragatha.",
        "Elle a quitte sa ville natale, coupe la communication avec sa mere et reussi dans sa carriere.",
        "La presentation finale la montre entouree d amis avec lesquels elle entretient des liens sinceres."
      ]},
      zoeyraghavan: { name: "Zoey Raghavan", age: "Contrepartie humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "zoeyraghavan", signal: "ZR", color: "#9b3f49", facts: [
        "Contrepartie humaine dont la copie numerique est Gangle.",
        "Elle s est remise de ses blessures, a quitte la restauration rapide et travaille dans une petite agence de design.",
        "Elle publie aussi des pages de sa bande dessinee en ligne."
      ]},
      rileyverselis: { name: "Riley Verselis", age: "Contrepartie humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "rileyverselis", signal: "RV", color: "#687287", facts: [
        "Contrepartie humaine dont la copie numerique est Zooble.",
        "Apres plusieurs emplois, Riley a ouvert son propre bar, devenu un lieu populaire dans la ville.",
        "La presentation le decrit comme un espace ou les clients peuvent etre eux-memes sans jugement."
      ]},
      grantbest: { name: "Grant Best", age: "Contrepartie humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "grantbest", signal: "GB", color: "#7d668b", facts: [
        "Contrepartie humaine dont la copie numerique est Kinger.",
        "Il travaille toujours dans la technologie et reste marie a Destiny.",
        "Ils ont deux filles; la presentation de Caine le montre comme un pere attentionne."
      ]},
      leeroymateo: { name: "Leeroy Mateo", age: "Contrepartie humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "leeroymateo", signal: "LM", color: "#41516a", facts: [
        "Contrepartie humaine dont la copie numerique est Jax.",
        "Apres quelques mois sans logement, il a pu vivre avec un ami proche, obtenir un emploi stable et payer son loyer.",
        "Il sort encore avec ses amis, notamment dans le bar de Riley."
      ]},
      jaxfather: { name: "Jax's Father", age: "Archive humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "jaxfather", signal: "JF", color: "#26303d", facts: [
        "Figure paternelle evoquee par Jax dans Remember; son nom et son visage ne sont pas reveles.",
        "Jax dit que ses parents se sont separes a son entree au lycee, qu il n etait pas proche de son pere et qu il ne l a plus revu apres la separation.",
        "La scene ne montre qu une silhouette; CainOS n invente ni tenue, ni traits, ni identite."
      ]},
      jaxmother: { name: "Jax's Mother", age: "Archive humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "jaxmother", signal: "JM", color: "#9ca3af", facts: [
        "Figure maternelle evoquee par Jax dans Remember; son nom et son visage ne sont pas reveles.",
        "Jax decrit une relation devenue hostile apres la separation, puis un dernier contact durant lequel il l a repoussee.",
        "Il dit ne pas savoir ce qui lui est arrive ensuite; son visuel reste donc la silhouette parasitee montree a l ecran."
      ]},
      abigailfriendone: { name: "Abigail's Friend A", age: "Humain du monde reel - Ep. 9", stress: "NON APPLICABLE", avatar: "abigailfriendone", signal: "A1", color: "#66715d", facts: [
        "Un des deux nouveaux amis non nommes visibles dans les videos occasionnelles d Abigail.",
        "La projection le montre avec un bonnet noir, une lampe frontale et un haut gris-olive.",
        "Aucun nom, dialogue ou element biographique supplementaire n est confirme."
      ]},
      abigailfriendtwo: { name: "Abigail's Friend B", age: "Humain du monde reel - Ep. 9", stress: "NON APPLICABLE", avatar: "abigailfriendtwo", signal: "A2", color: "#356a4b", facts: [
        "Second nouvel ami non nomme visible dans les videos occasionnelles d Abigail.",
        "La projection le montre avec une casquette noire, des lunettes et un sweat vert.",
        "Aucun nom, dialogue ou element biographique supplementaire n est confirme."
      ]},
      bestchildren: { name: "Anne and Sam Best", age: "Famille humaine - Ep. 9", stress: "NON APPLICABLE", avatar: "bestchildren", signal: "BS", color: "#a0675f", facts: [
        "Anne et Sam Best sont les deux filles de Grant et Destiny.",
        "La presentation finale les montre ensemble, sans associer explicitement chaque prenom a un visage.",
        "CainOS les conserve donc dans une fiche duo et ne leur invente aucune biographie individuelle."
      ]}
    };

    return castData;
  },

  getEpisodeCastKeys(episodeNum) {
    const episodeCastMap = {
      "-2": [
        "abel", "abelmannequin", "abelfullbody", "caine", "bubble", "sun", "moon",
        "additionalvoices", "themachine", "bonepastor"
      ],
      "-1": [
        "kinger", "queenie", "caine", "abel", "abelmannequin", "abelfullbody", "shadowkinger"
      ],
      0: [
        "mannequin"
      ],
      1: [
        "pomni", "caine", "bubble", "jax", "ragatha", "kinger", "gangle", "zooble", "kaufmo", "abstractedkaufmo", "cellarabstraction",
        "gloinkqueen", "gloinkqueenscale", "gloinkstar", "gloinkcube", "gloinkpyramid", "gloinkcrescent", "gloinkpin", "gloinkround",
        "mannequin", "moon", "sun", "barrelmonkey", "drfootball"
      ],
      2: [
        "pomni", "caine", "bubble", "jax", "ragatha", "kinger", "gangle", "zooble",
        "gummigoo", "max", "chad", "loolilalu", "fudge", "japanesegummigoo", "mannequin",
        "candyguardcyan", "candyguardblue", "candyguardpurple", "redmannequin", "orangemannequin", "yellowmannequin", "magentamannequin",
        "gummyworm", "cookiebutterfly", "gummyelephant"
      ],
      3: [
        "pomni", "jax", "ragatha", "kinger", "gangle", "zooble", "caine", "bubble",
        "baronmildenhall", "marthamildenhall", "ghostly", "angel", "mildenhallsouls"
      ],
      4: [
        "gangle", "workgangle", "ganglekawaii", "ganglecomedy", "gangletragedy", "pomni", "jax", "ragatha", "kinger", "zooble", "caine", "bubble",
        "stupidburgermannequin", "cerealmannequin", "albertspudsy"
      ],
      5: [
        "caine", "bubble", "pomni", "jax", "ragatha", "kinger", "gangle", "zooble",
        "hunterjax", "rhinogangle", "japanesejax", "japaneseragatha", "japanesepomni", "japanesekinger", "japanesegangle", "japanesezooble",
        "baseballjax", "baseballzooble", "baseballgangle", "baseballragatha", "baseballpomni", "baseballkinger", "maidjax",
        "rivalbaseballzooble", "rivalbaseballpomni", "rivalbaseballpinkgiant", "rivalbaseballragatha", "rivalbaseballjax", "rivalbaseballkinger",
        "orbsman", "evilorbsman", "evilpomni", "eviljax", "evilragatha", "evilkinger", "evilzooble",
        "jeffery", "cookiebutterfly", "giantcentipede"
      ],
      6: [
        "jax", "pomni", "ragatha", "kinger", "gangle", "zooble", "caine", "bubble",
        "ming", "disappearingguy", "committeemember"
      ],
      7: [
        "gangle", "beachgangle", "pomni", "jax", "ragatha", "kinger", "zooble", "caine", "bubble",
        "abel", "abelmannequin", "abelfullbody", "truthtellerfish", "liarfish", "shrimpnpc", "chineseroomnpc",
        "gummyelephant"
      ],
      8: [
        "kinger", "queenie", "caine", "bubble", "pomni", "ragatha", "jax", "gangle", "zooble", "scratch",
        "barrelmonkey", "blueai", "fourthcrocodile", "ragathamothershadow", "paintedmasks", "zoobleparts", "laughingshadows",
        "stabbedragdolls", "coiledcentipedes"
      ],
      9: [
        "pomni", "caine", "bubble", "jax", "ragatha", "kinger", "gangle", "zooble", "moon", "ribbit", "queenie", "scratch",
        "wormo", "bizco", "rattie", "spike", "pinkcyclops", "yellowclown", "oyster", "bulbcreature", "maidjax", "blueai",
        "aquaticabstraction", "floatingworm", "creditsfish", "unusedbrainscans",
        "abigailbrooks", "suzieackerman", "zoeyraghavan", "rileyverselis", "grantbest", "leeroymateo",
        "jaxfather", "jaxmother", "abigailfriendone", "abigailfriendtwo", "bestchildren"
      ]
    };

    const key = String(episodeNum);
    return episodeCastMap[key] || null;
  },

  getWackyProfileGate(id) {
    const gates = {
      pomni: { episode: 1, subepisode: 0 },
      caine: { episode: 1, subepisode: 0 },
      bubble: { episode: 1, subepisode: 0 },
      jax: { episode: 1, subepisode: 0 },
      ragatha: { episode: 1, subepisode: 0 },
      kinger: { episode: 1, subepisode: 0 },
      gangle: { episode: 1, subepisode: 0 },
      zooble: { episode: 1, subepisode: 0 },
      kaufmo: { episode: 1, subepisode: 5 },
      abstractedkaufmo: { episode: 1, subepisode: 5 },
      cellarabstraction: { episode: 1, subepisode: 5 },
      gloinkqueen: { episode: 1, subepisode: 4 },
      gloinkqueenscale: { episode: 1, subepisode: 4 },
      gloinkstar: { episode: 1, subepisode: 4 },
      gloinkcube: { episode: 1, subepisode: 4 },
      gloinkpyramid: { episode: 1, subepisode: 4 },
      gloinkcrescent: { episode: 1, subepisode: 4 },
      gloinkpin: { episode: 1, subepisode: 4 },
      gloinkround: { episode: 1, subepisode: 4 },
      barrelmonkey: { episode: 1, subepisode: 5 },
      drfootball: { episode: 1, subepisode: 5 },
      gummigoo: { episode: 2, subepisode: 3 },
      max: { episode: 2, subepisode: 3 },
      chad: { episode: 2, subepisode: 3 },
      loolilalu: { episode: 2, subepisode: 1 },
      fudge: { episode: 2, subepisode: 6 },
      additionalvoices: { episode: 9, subepisode: 7 },
      themachine: { episode: 9, subepisode: 7 },
      candyguardcyan: { episode: 2, subepisode: 1 },
      candyguardblue: { episode: 2, subepisode: 1 },
      candyguardpurple: { episode: 2, subepisode: 1 },
      redmannequin: { episode: 2, subepisode: 1 },
      orangemannequin: { episode: 2, subepisode: 1 },
      yellowmannequin: { episode: 2, subepisode: 1 },
      magentamannequin: { episode: 2, subepisode: 1 },
      gummyworm: { episode: 2, subepisode: 1 },
      cookiebutterfly: { episode: 2, subepisode: 1 },
      gummyelephant: { episode: 2, subepisode: 1 },
      baronmildenhall: { episode: 3, subepisode: 2 },
      marthamildenhall: { episode: 3, subepisode: 5 },
      ghostly: { episode: 3, subepisode: 1 },
      angel: { episode: 3, subepisode: 3 },
      horrorghost: { episode: 3, subepisode: 1 },
      horrormonster: { episode: 3, subepisode: 2 },
      horrorpomnivoid: { episode: 3, subepisode: 5 },
      horrorpomnispiral: { episode: 3, subepisode: 5 },
      horrorpomniskull: { episode: 3, subepisode: 5 },
      mildenhallsouls: { episode: 3, subepisode: 5 },
      bonepastor: { episode: 9, subepisode: 7 },
      maxspudsy: { episode: 4, subepisode: 4 },
      workgangle: { episode: 4, subepisode: 2 },
      spudsycustomer: { episode: 4, subepisode: 2 },
      albertspudsy: { episode: 4, subepisode: 2 },
      stupidburgermannequin: { episode: 4, subepisode: 3 },
      cerealmannequin: { episode: 4, subepisode: 4 },
      hunterjax: { episode: 5, subepisode: 2 },
      rhinogangle: { episode: 5, subepisode: 2 },
      japanesejax: { episode: 5, subepisode: 4 },
      japaneseragatha: { episode: 5, subepisode: 4 },
      japanesepomni: { episode: 5, subepisode: 4 },
      japanesekinger: { episode: 5, subepisode: 4 },
      japanesegangle: { episode: 5, subepisode: 4 },
      japanesezooble: { episode: 5, subepisode: 4 },
      maidjax: { episode: 5, subepisode: 6 },
      baseballjax: { episode: 5, subepisode: 6 },
      baseballzooble: { episode: 5, subepisode: 6 },
      baseballgangle: { episode: 5, subepisode: 6 },
      baseballragatha: { episode: 5, subepisode: 6 },
      baseballpomni: { episode: 5, subepisode: 6 },
      baseballkinger: { episode: 5, subepisode: 6 },
      rivalbaseballzooble: { episode: 5, subepisode: 6 },
      rivalbaseballpomni: { episode: 5, subepisode: 6 },
      rivalbaseballpinkgiant: { episode: 5, subepisode: 6 },
      rivalbaseballragatha: { episode: 5, subepisode: 6 },
      rivalbaseballjax: { episode: 5, subepisode: 6 },
      rivalbaseballkinger: { episode: 5, subepisode: 6 },
      orbsman: { episode: 5, subepisode: 6 },
      evilorbsman: { episode: 5, subepisode: 6 },
      evilpomni: { episode: 5, subepisode: 6 },
      eviljax: { episode: 5, subepisode: 6 },
      evilragatha: { episode: 5, subepisode: 6 },
      evilkinger: { episode: 5, subepisode: 6 },
      evilzooble: { episode: 5, subepisode: 6 },
      jeffery: { episode: 5, subepisode: 4 },
      giantcentipede: { episode: 5, subepisode: 6 },
      ming: { episode: 6, subepisode: 7 },
      disappearingguy: { episode: 6, subepisode: 7 },
      committeemember: { episode: 6, subepisode: 7 },
      beachgangle: { episode: 7, subepisode: 1 },
      truthtellerfish: { episode: 7, subepisode: 1 },
      liarfish: { episode: 7, subepisode: 1 },
      shrimpnpc: { episode: 7, subepisode: 1 },
      chineseroomnpc: { episode: 7, subepisode: 0 },
      abel: { episode: 7, subepisode: 3 },
      abelmannequin: { episode: 7, subepisode: 3 },
      abelfullbody: { episode: 7, subepisode: 3 },
      queenie: { episode: 8, subepisode: 1 },
      blueai: { episode: 9, subepisode: 6 },
      scratch: { episode: 8, subepisode: 5 },
      fourthcrocodile: { episode: 8, subepisode: 7 },
      ragathamothershadow: { episode: 8, subepisode: 7 },
      paintedmasks: { episode: 8, subepisode: 7 },
      zoobleparts: { episode: 8, subepisode: 7 },
      laughingshadows: { episode: 8, subepisode: 7 },
      stabbedragdolls: { episode: 8, subepisode: 7 },
      coiledcentipedes: { episode: 8, subepisode: 7 },
      ribbit: { episode: 9, subepisode: 2 },
      floatingworm: { episode: 9, subepisode: 2 },
      wormo: { episode: 9, subepisode: 2 },
      bizco: { episode: 9, subepisode: 2 },
      rattie: { episode: 9, subepisode: 2 },
      spike: { episode: 9, subepisode: 2 },
      pinkcyclops: { episode: 9, subepisode: 2 },
      yellowclown: { episode: 9, subepisode: 2 },
      oyster: { episode: 9, subepisode: 2 },
      bulbcreature: { episode: 9, subepisode: 2 },
      aquaticabstraction: { episode: 9, subepisode: 6 },
      unusedbrainscans: { episode: 9, subepisode: 6 },
      creditsfish: { episode: 9, subepisode: 7 },
      abigailbrooks: { episode: 9, subepisode: 7 },
      suzieackerman: { episode: 9, subepisode: 7 },
      zoeyraghavan: { episode: 9, subepisode: 7 },
      rileyverselis: { episode: 9, subepisode: 7 },
      grantbest: { episode: 9, subepisode: 7 },
      leeroymateo: { episode: 9, subepisode: 7 },
      jaxfather: { episode: 9, subepisode: 4 },
      jaxmother: { episode: 9, subepisode: 4 },
      abigailfriendone: { episode: 9, subepisode: 7 },
      abigailfriendtwo: { episode: 9, subepisode: 7 },
      bestchildren: { episode: 9, subepisode: 7 }
    };

    if (id.startsWith("shadow")) return { episode: 3, subepisode: 1 };
    if (id.includes("gangle") && (id.includes("kawaii") || id.includes("comedy") || id.includes("tragedy"))) return { episode: 4, subepisode: 0 };
    if (id.startsWith("gloink")) return { episode: 1, subepisode: 4 };
    return gates[id] || null;
  },

  getWackyProfileStatus(id) {
    const archiveIds = new Set([
      'kaufmo', 'abstractedkaufmo', 'queenie', 'ribbit', 'scratch', 'wormo', 'bizco', 'rattie', 'spike',
      'pinkcyclops', 'yellowclown', 'oyster', 'bulbcreature'
    ]);
    const humanCounterpartIds = new Set([
      'abigailbrooks', 'suzieackerman', 'zoeyraghavan',
      'rileyverselis', 'grantbest', 'leeroymateo'
    ]);
    const humanArchiveIds = new Set(['jaxfather', 'jaxmother', 'bestchildren']);
    const realWorldHumanIds = new Set(['abigailfriendone', 'abigailfriendtwo']);
    const variantSignals = ['evil', 'shadow', 'maid', 'japanese', 'baseball', 'rivalbaseball', 'darkduo', 'kawaii', 'comedy', 'tragedy', 'hunter', 'beach', 'rhino', 'work', 'jaxgirl'];
    if (archiveIds.has(id)) return "ARCHIVE";
    if (humanCounterpartIds.has(id)) return "CONTREPARTIE HUMAINE";
    if (humanArchiveIds.has(id)) return "FAMILLE HUMAINE / ARCHIVE";
    if (realWorldHumanIds.has(id)) return "HUMAIN DU MONDE REEL";
    if (['cellarabstraction', 'aquaticabstraction'].includes(id)) return "PHENOMENE / ABSTRACTION";
    if (['stabbedragdolls', 'coiledcentipedes', 'unusedbrainscans'].includes(id)) return "ARTEFACT / DECOR";
    if (['bonepastor', 'themachine', 'additionalvoices'].includes(id)) return "PRODUCTION / HORS TIMELINE";
    if (id === 'spudsycustomer') return "RECONSTRUCTION CAINOS";
    if (variantSignals.some(token => id.includes(token))) return "VARIANTE";
    if (id.startsWith("gloink") || ['gummigoo', 'max', 'chad', 'loolilalu', 'fudge', 'orbsman', 'ming', 'mannequin', 'sun', 'moon', 'abel', 'abelmannequin', 'abelfullbody', 'baronmildenhall', 'marthamildenhall', 'ghostly', 'angel', 'disappearingguy', 'committeemember', 'truthtellerfish', 'liarfish', 'shrimpnpc', 'chineseroomnpc', 'blueai', 'cookiebutterfly', 'gummyelephant', 'giantcentipede', 'drfootball', 'stupidburgermannequin', 'cerealmannequin', 'candyguardcyan', 'candyguardblue', 'candyguardpurple', 'redmannequin', 'orangemannequin', 'yellowmannequin', 'magentamannequin', 'gummyworm', 'barrelmonkey', 'jeffery', 'mildenhallsouls', 'albertspudsy', 'fourthcrocodile', 'ragathamothershadow', 'paintedmasks', 'zoobleparts', 'laughingshadows', 'floatingworm', 'creditsfish'].includes(id)) return "PNJ / DECOR";
    return "ACTIF";
  },

  isWackyProfileUnlocked(id) {
    if (this.getPurchasedWackySkins().includes(id)) return true;
    const data = this.getWackyCastData()[id];
    if (this.isFanSkin(id, data)) return false;
    const gate = this.getWackyProfileGate(id);
    if (!gate) return true;
    if (typeof EpisodeManager !== 'undefined' && typeof EpisodeManager.hasReachedLoreGate === 'function') {
      return EpisodeManager.hasReachedLoreGate(gate);
    }
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    return progress.includes(gate.episode);
  },

  getPurchasedWackySkins() {
    try {
      const raw = localStorage.getItem('cainos_purchased_wacky_skins');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
    } catch (e) {
      return [];
    }
  },

  isWackySkinStoreUnlocked() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    return progress.includes(9);
  },

  isCanonicalEpisodeVariant(id) {
    return new Set([
      'workgangle', 'beachgangle', 'hunterjax', 'rhinogangle', 'maidjax',
      'japanesejax', 'japaneseragatha', 'japanesepomni', 'japanesekinger', 'japanesegangle', 'japanesezooble',
      'baseballjax', 'baseballzooble', 'baseballgangle', 'baseballragatha', 'baseballpomni', 'baseballkinger',
      'rivalbaseballzooble', 'rivalbaseballpomni', 'rivalbaseballpinkgiant', 'rivalbaseballragatha', 'rivalbaseballjax', 'rivalbaseballkinger'
    ]).has(id);
  },

  isFanSkin(id, char = null) {
    const data = char || this.getWackyCastData()[id];
    if (!data) return false;
    if (this.isCanonicalEpisodeVariant(id)) return false;
    return /variante (fan|cauchemar)/i.test(String(data.age || "")) || id.startsWith('shadow') || ['darkduo', 'jaxgirl'].some(token => id.includes(token));
  },

  getWackyLoreStatus(id, char = null) {
    const data = char || this.getWackyCastData()[id] || {};
    const status = String(data.status || this.getWackyProfileStatus(id) || '').toUpperCase();
    const age = String(data.age || '').toUpperCase();
    if (!this.isWackyProfileUnlocked(id)) return "VERROUILLE PAR PROGRESSION";
    if (this.isFanSkin(id, data)) return "SKIN FAN / HORS TIMELINE";
    if (status.includes("PRODUCTION")) return "PRODUCTION / HORS TIMELINE";
    if (status.includes("PHENOMENE")) return "PHENOMENE D ABSTRACTION";
    if (status.includes("ARTEFACT")) return "ARTEFACT / DECOR CANON";
    if (status.includes("RECONSTRUCTION")) return "RECONSTRUCTION CAINOS / HORS CANON";
    if (status.includes("CONTREPARTIE HUMAINE")) return "CONTREPARTIE HUMAINE / MONDE REEL";
    if (status.includes("FAMILLE HUMAINE")) return "ARCHIVE HUMAINE / MONDE REEL";
    if (status.includes("HUMAIN DU MONDE REEL")) return "HUMAIN / MONDE REEL";
    if (status.includes("VARIANTE")) return "VARIANTE VISUELLE";
    if (status.includes("ARCHIVE") || age.includes("ARCHIVE") || age.includes("ABSTRAIT")) return "ARCHIVE CAINOS";
    if (status.includes("PNJ") || age.includes("NPC") || age.includes("DECOR")) return "PNJ / DECOR DE SIMULATION";
    return "TIMELINE ACTIVE";
  },

  getWackyProvenanceKind(id, char = null) {
    const data = char || this.getWackyCastData()[id];
    if (!data) return 'reconstruction';
    if (this.isFanSkin(id, data)) return 'fan';
    if (['bonepastor', 'themachine', 'additionalvoices'].includes(id)) return 'production';
    if (id === 'spudsycustomer') return 'reconstruction';
    if (this.isCanonicalEpisodeVariant(id)) return 'canon-visual';
    const canonProfiles = new Set([
      'pomni', 'caine', 'bubble', 'jax', 'ragatha', 'kinger', 'gangle', 'zooble',
      'kaufmo', 'abstractedkaufmo', 'cellarabstraction', 'aquaticabstraction', 'queenie', 'gummigoo', 'loolilalu', 'fudge', 'orbsman', 'sun', 'moon',
      'ribbit', 'scratch', 'wormo', 'bizco', 'rattie', 'spike', 'pinkcyclops',
      'yellowclown', 'oyster', 'bulbcreature', 'max', 'chad', 'ming', 'mannequin',
      'gloinkqueen', 'gloinkqueenscale', 'abel', 'abelmannequin', 'abelfullbody',
      'baronmildenhall', 'marthamildenhall', 'ghostly', 'angel', 'disappearingguy',
      'committeemember', 'truthtellerfish', 'liarfish', 'shrimpnpc', 'chineseroomnpc',
      'cookiebutterfly', 'gummyelephant', 'giantcentipede', 'drfootball',
      'candyguardcyan', 'candyguardblue', 'candyguardpurple', 'gummyworm',
      'barrelmonkey', 'jeffery', 'redmannequin', 'orangemannequin', 'yellowmannequin',
      'magentamannequin', 'mildenhallsouls', 'albertspudsy',
      'stupidburgermannequin', 'cerealmannequin', 'blueai',
      'fourthcrocodile', 'ragathamothershadow', 'paintedmasks', 'zoobleparts',
      'laughingshadows', 'floatingworm', 'creditsfish', 'stabbedragdolls',
      'coiledcentipedes', 'unusedbrainscans', 'abigailbrooks', 'suzieackerman', 'zoeyraghavan',
      'rileyverselis', 'grantbest', 'leeroymateo', 'jaxfather', 'jaxmother',
      'abigailfriendone', 'abigailfriendtwo', 'bestchildren'
    ]);
    if (canonProfiles.has(id) || id.startsWith('gloink')) return 'canon-visual';
    return 'reconstruction';
  },

  getWackyDisplayFacts(id, char = null) {
    const data = char || this.getWackyCastData()[id] || {};
    if (!this.isCainOSCanonStrict()) {
      return Array.isArray(data.facts) && data.facts.length ? data.facts : ['Aucune note CainOS disponible.'];
    }

    if (this.isFanSkin(id, data)) {
      return ['Variante fan reservee aux aventures originales. Elle ne modifie pas la chronologie canonique.'];
    }
    if (this.isCanonicalEpisodeVariant(id)) {
      return [`Apparence rattachee a une scene de l episode qui la debloque. Les mesures et biographies ajoutees par CainOS ne sont pas canoniques.`];
    }

    const confirmed = {
      pomni: [
        'Caine lui attribue le nom Pomni apres son arrivee dans le Pilote.',
        'Elle cherche une sortie des son arrivee et reste une residente humaine piegee dans le Cirque.'
      ],
      caine: [
        'Intelligence artificielle qui dirige le Cirque et organise les aventures.',
        'Ses limites et ses intentions doivent etre lues uniquement selon les revelations deja debloquees.'
      ],
      bubble: ['Assistant de Caine present dans le Cirque; CainOS ne lui attribue aucune identite humaine.'],
      jax: ['Resident du Cirque connu pour provoquer les autres; son identite civile et son age ne sont pas confirmes.'],
      ragatha: ['Residante qui tente regulierement de rassurer Pomni et le groupe; son identite civile et son age ne sont pas confirmes.'],
      kinger: ['Resident de longue date represente comme une piece d echecs; les revelations tardives restent verrouillees par progression.'],
      gangle: ['Residante composee de rubans et de masques de comedie et de tragedie; son identite civile et son age ne sont pas confirmes.'],
      zooble: ['Resident au corps modulaire qui exprime souvent son refus des aventures de Caine; son identite civile et son age ne sont pas confirmes.'],
      kaufmo: ['Portrait de Kaufmo avant abstraction. Cette apparence est une archive et ne represente pas son etat actif dans le Pilote.'],
      abstractedkaufmo: ['Forme abstraite de Kaufmo rencontree dans le Pilote: corps noir quadrupede, tete conique et nombreux yeux multicolores. Elle ne parle pas.'],
      cellarabstraction: ['Etat d abstraction terrestre enferme dans le Cellar. Les abstractions produisent des cris, grondements et parasites, pas du dialogue.'],
      aquaticabstraction: ['Forme tentaculaire noire aux nombreux yeux multicolores visible dans l aquarium des abstractions de Remember.'],
      sun: ['PNJ celeste jaune a couronne orange, grands yeux orange a cils et large sourire. Il parle et reagit aux residents.'],
      moon: ['PNJ celeste en croissant bleu clair aux traits bleu fonce. Elle parle directement a Caine et lui declare son affection.'],
      queenie: ['Ancienne membre liee a Kinger. Sa presence active n est pas affirmee hors des scenes ou souvenirs debloques.'],
      gummigoo: ['PNJ crocodile de Candy Carrier Chaos!; CainOS ne le classe pas comme sujet humain.'],
      candyguardcyan: ['Garde mannequin silencieux de Candy Canyon. Sa teinte cyan ne constitue pas une identite individuelle confirmee.'],
      candyguardblue: ['Garde mannequin silencieux de Candy Canyon. Sa teinte bleue ne constitue pas une identite individuelle confirmee.'],
      candyguardpurple: ['Garde mannequin silencieux de Candy Canyon. Sa teinte violette ne constitue pas une identite individuelle confirmee.'],
      redmannequin: ['Mannequin rouge de foule Candy Canyon. Sa couleur ne constitue pas une identite individuelle confirmee.'],
      orangemannequin: ['Mannequin orange de foule Candy Canyon. CainOS ne lui attribue ni nom propre ni dialogue.'],
      yellowmannequin: ['Mannequin jaune de foule Candy Canyon. Il reste un figurant silencieux de simulation.'],
      magentamannequin: ['Mannequin magenta de foule Candy Canyon. Sa presence est visuelle, pas biographique.'],
      gummyworm: ['Creature gommeuse visible dans les douves chocolat de Candy Canyon; aucun dialogue ni profil humain ne lui est attribue.'],
      barrelmonkey: ['Jouet anime present dans le Pilote. Un exemplaire est detruit pendant la poursuite de Kaufmo abstrait.'],
      jeffery: ['Nom associe a l oeil droit vert de Caine; sa forme de danseur reste une extension theatrale de Caine.'],
      mildenhallsouls: ['Ames/phenomene spectral du manoir de Mildenhall. CainOS ne les transforme pas en residents individuels.'],
      albertspudsy: ['Visuel de marque Spudsy reference dans le restaurant. CainOS le classe comme decoupe/branding, pas comme PNJ vivant.'],
      truthtellerfish: ['Poisson orange du lac digital. Le transcript le distingue comme Truth-Teller NPC et l associe au coffre englouti.'],
      liarfish: ['Poisson rouge du lac digital. Le transcript le distingue comme Liar NPC et lui fait annoncer son propre role.'],
      blueai: ['IA canonique developpee par C&A pour remplacer Caine, ensuite absorbee par lui puis separee de Caine dans Remember.'],
      bonepastor: ['Personnage d un comic de production externe aux episodes. Il ne fait pas partie de Mildenhall Manor ni de la timeline canonique jouable.'],
      fourthcrocodile: ['Crocodile jaune realiste aux yeux jaune vif de la sequence de tourment de l episode 8. Son identite exacte et un eventuel lien avec Gummigoo ne sont pas confirmes.'],
      ragathamothershadow: ['Silhouette feminine du tourment de Ragatha. La lecture maternelle est suggeree par la scene mais son identite n est pas explicitement confirmee.'],
      paintedmasks: ['Cinq peintures de masques de Gangle utilisees comme objets de tourment; elles ne sont pas des personnages distincts.'],
      zoobleparts: ['Pieces de Zooble et miroirs noirs utilisees comme assemblage de tourment; CainOS les classe comme decor.'],
      laughingshadows: ['Trois silhouettes rieuses du tourment de Jax. Elles evoquent des personnages connus sans constituer leur retour.'],
      floatingworm: ['Petit ver rose-violet flottant dans un arriere-plan de Remember. Aucun nom propre ni dialogue ne lui est attribue.'],
      creditsfish: ['Poisson rouge-orange a nageoires jaunes visible pendant le generique de Remember. Aucun nom individuel n est confirme.'],
      stabbedragdolls: ['Poupees de chiffon transpercees de la sequence de tourment. Ce sont des objets de scene sans dialogue.'],
      coiledcentipedes: ['Centipedes enroules utilises comme objets visuels pendant la sequence de tourment.'],
      unusedbrainscans: ['Scans cerebraux inutilises visibles dans les archives C&A de Remember. Ce sont des artefacts techniques, pas des personnages.'],
      abigailbrooks: ['Contrepartie humaine de Pomni. Elle travaille toujours comme comptable et publie encore occasionnellement des videos avec de nouveaux amis.'],
      suzieackerman: ['Contrepartie humaine de Ragatha. Elle a quitte sa ville natale, coupe les ponts avec sa mere et reussi dans sa carriere.'],
      zoeyraghavan: ['Contrepartie humaine de Gangle. Elle s est remise de ses blessures, travaille dans une petite agence de design et publie son webcomic.'],
      rileyverselis: ['Contrepartie humaine de Zooble. Riley a ouvert un bar populaire ou les clients peuvent etre eux-memes sans jugement.'],
      grantbest: ['Contrepartie humaine de Kinger. Il travaille toujours dans la technologie, est marie a Destiny et a deux filles.'],
      leeroymateo: ['Contrepartie humaine de Jax. Apres une periode sans logement, il a obtenu un emploi stable et vit avec un ami proche.'],
      jaxfather: ['Pere evoque par Jax dans Remember. Jax dit ne pas avoir ete proche de lui et ne plus l avoir revu apres la separation de ses parents; son identite reste inconnue.'],
      jaxmother: ['Mere evoquee par Jax dans Remember. Jax dit ne pas savoir ce qui lui est arrive apres leur dernier contact; son identite reste inconnue.'],
      abigailfriendone: ['Ami non nomme visible dans les videos recentes d Abigail. Aucun nom, dialogue ou element biographique supplementaire n est confirme.'],
      abigailfriendtwo: ['Second ami non nomme visible dans les videos recentes d Abigail. Aucun nom, dialogue ou element biographique supplementaire n est confirme.'],
      bestchildren: ['Anne et Sam Best sont les deux filles de Grant et Destiny. La scene ne permet pas d associer surement chaque prenom a un visage.'],
      stupidburgermannequin: ['Mannequin Spudsy sans nom propre confirme. CainOS le distingue par sa commande de Stupid Burger.'],
      cerealmannequin: ['Mannequin Spudsy sans nom propre confirme. CainOS le distingue par le bol de cereales deja en sa possession.']
    };
    if (confirmed[id]) return confirmed[id];

    const status = this.getWackyProfileStatus(id);
    if (status === 'ARCHIVE') {
      return ['Ancien membre classe en archive. Son apparence est referencee, mais CainOS ne pretend pas qu il soit revenu dans la timeline active.'];
    }
    if (status === 'PNJ / DECOR') {
      return ['Entite ou element de simulation reference dans la serie. Aucune identite humaine ne lui est attribuee sans confirmation explicite.'];
    }
    if (status === 'VARIANTE') {
      return ['Etat visuel indexe par CainOS. Sa provenance exacte reste separee des faits biographiques du personnage.'];
    }
    return ['Profil visuel indexe par CainOS. Les donnees biographiques non dites dans les episodes restent non confirmees.'];
  },

  purchaseWackySkin(id) {
    if (!this.isWackySkinStoreUnlocked() || !this.isFanSkin(id)) {
      SoundManager.playError();
      if (typeof this.showDialog === 'function') {
        this.showDialog('BOUTIQUE VERROUILLEE', 'Les skins fan se debloquent apres la fin de l episode 9 pour garder le lore principal propre.');
      }
      return false;
    }
    const purchased = this.getPurchasedWackySkins();
    if (!purchased.includes(id)) {
      purchased.push(id);
      localStorage.setItem('cainos_purchased_wacky_skins', JSON.stringify(purchased));
    }
    SoundManager.playWin();
    return true;
  },

  getWackyVariantGroups() {
    return {
      pomni: ['pomni', 'maidpomni', 'japanesepomni', 'baseballpomni', 'rivalbaseballpomni', 'shadowpomni', 'evilpomni', 'horrorpomnivoid', 'horrorpomnispiral', 'horrorpomniskull'],
      jax: ['jax', 'maidjax', 'jaxgirl', 'japanesejax', 'baseballjax', 'rivalbaseballjax', 'hunterjax', 'darkduojax', 'shadowjax', 'eviljax'],
      ragatha: ['ragatha', 'maidragatha', 'japaneseragatha', 'baseballragatha', 'rivalbaseballragatha', 'shadowragatha', 'evilragatha'],
      kinger: ['kinger', 'japanesekinger', 'baseballkinger', 'rivalbaseballkinger', 'shadowkinger', 'evilkinger'],
      gangle: ['gangle', 'ganglekawaii', 'ganglecomedy', 'gangletragedy', 'maidgangle', 'beachgangle', 'japanesegangle', 'rhinogangle', 'workgangle', 'baseballgangle', 'darkduogangle', 'shadowgangle'],
      zooble: ['zooble', 'japanesezooble', 'baseballzooble', 'rivalbaseballzooble', 'shadowzooble', 'evilzooble'],
      gummigoo: ['gummigoo', 'japanesegummigoo'],
      kaufmo: ['kaufmo', 'abstractedkaufmo'],
      caine: ['caine', 'shadowcaine'],
      abel: ['abel', 'abelmannequin', 'abelfullbody'],
      gloinkqueen: ['gloinkqueen', 'gloinkqueenscale', 'gloinkstar', 'gloinkcube', 'gloinkpyramid', 'gloinkcrescent', 'gloinkpin', 'gloinkround']
    };
  },

  getWackyBaseProfileId(id) {
    const groups = this.getWackyVariantGroups();
    for (const baseId in groups) {
      if (groups[baseId].includes(id)) return baseId;
    }
    return id;
  },

  applyWackyWatchListFilters(castData) {
    const query = String(this.wackySearchQuery || '').trim().toLowerCase();
    const filter = this.wackyFilter || 'all';
    const entries = Object.entries(castData).filter(([id, char]) => {
      const status = String(char.status || this.getWackyProfileStatus(id)).toLowerCase();
      const provenance = this.getWackyProvenanceKind(id, char);
      const isFan = provenance === 'fan';
      if (this.isCainOSCanonStrict() && isFan) return false;
      const haystack = `${id} ${char.name || ''} ${char.signal || ''} ${status} ${provenance}`.toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filter === 'canon') return !isFan;
      if (filter === 'fan') return isFan;
      if (filter === 'active') return status.includes('actif');
      if (filter === 'variant') return status.includes('variante');
      if (filter === 'archive') return status.includes('archive');
      if (filter === 'npc') return status.includes('pnj') || status.includes('decor');
      return true;
    });
    return Object.fromEntries(entries);
  },

  getFilteredWackyCastData() {
    const allCastData = this.getWackyCastData();
    const episodeNum = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.currentEpisode : null;
    const episodeKeys = this.getEpisodeCastKeys(episodeNum);

    if (!episodeKeys) {
      const unlockedData = {};
      Object.keys(allCastData).forEach(key => {
        if (this.isWackyProfileUnlocked(key)) {
          unlockedData[key] = {
            ...allCastData[key],
            status: this.getWackyProfileStatus(key)
          };
        }
      });
      if (Object.keys(unlockedData).length) return unlockedData;
      const fallback = {};
      ['mannequin', 'themachine'].forEach(key => {
        if (allCastData[key]) {
          fallback[key] = {
            ...allCastData[key],
            status: this.getWackyProfileStatus(key)
          };
        }
      });
      return fallback;
    }

    const filteredCastData = {};
    episodeKeys.forEach(key => {
      if (allCastData[key] && this.isWackyProfileUnlocked(key)) {
        filteredCastData[key] = {
          ...allCastData[key],
          status: this.getWackyProfileStatus(key)
        };
      }
    });

    if (Object.keys(filteredCastData).length) return filteredCastData;
    const fallback = {};
    ['mannequin', 'themachine'].forEach(key => {
      if (allCastData[key]) {
        fallback[key] = {
          ...allCastData[key],
          status: this.getWackyProfileStatus(key)
        };
      }
    });
    return fallback;
  },

  updateWackyWatchCastUI() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const showPomni = this.isPomniNamed();

    const castData = {
      pomni: { name: "Pomni", age: "25", stress: "92%", avatar: "pomni", facts: [
        "A peur des mannequins de cire et ne se souvient plus de son nom civil.",
        "A essayé de retirer son casque VR 42 fois la première heure.",
        "Son cortex cérébral recherche obstinément des portes de sortie rouges."
      ]},
      jax: { name: "Jax", age: "22", stress: "45%", avatar: "jax", facts: [
        "Déteste faire les courses et adore causer des ennuis aux autres.",
        "A volé et caché la clé de la chambre de Gangle sous son lit.",
        "Collectionne secrètement les pièces détachées de Zooble."
      ]},
      ragatha: { name: "Ragatha", age: "30", stress: "65%", avatar: "ragatha", facts: [
        "Maintient un sourire constant pour cacher ses bugs de collision physique.",
        "Est la doyenne des poupées de chiffon raccordées (5 ans d'ancienneté).",
        "Prie secrètement pour que Caine fasse une mise à jour corrective."
      ]},
      kinger: { name: "Kinger", age: "Inconnu", stress: "98%", avatar: "kinger", facts: [
        "Queenie etait sa compagne dans le Cirque; son identite civile reste inconnue.",
        "Est l'humain connecté depuis le plus longtemps (esprit extrêmement fragmenté).",
        "Collectionne des insectes virtuels imaginaires dans un seau."
      ]},
      gangle: { name: "Gangle", age: "26", stress: "55%", avatar: "gangle", facts: [
        "Son masque de comédie se brise en moyenne 14.8 fois par jour.",
        "Animée par une physique de cordes 2.5D très gourmande en CPU.",
        "Pleure et refuse d'être vue si son masque triste est cassé."
      ]},
      zooble: { name: "Zooble", age: "24", stress: "75%", avatar: "zooble", facts: [
        "Son corps modulaire contient 18 pièces incompatibles d'autres modèles.",
        "Déteste participer aux aventures scénarisées par Caine.",
        "A été réassemblée par erreur avec une griffe de dinosaure rose."
      ]}
    };

    if (!showPomni) {
      delete castData.pomni;
    }

    Object.keys(castData).forEach(key => delete castData[key]);
    Object.assign(castData, this.applyWackyWatchListFilters(this.getFilteredWackyCastData()));

    const castList = document.getElementById('watch-cast-list');
    if (castList) {
      castList.innerHTML = "";

      // Determine active cast member
      if (!this.activeWackyCast || !castData[this.activeWackyCast]) {
        this.activeWackyCast = castData.pomni ? 'pomni' : Object.keys(castData)[0];
      }

      if (!Object.keys(castData).length) {
        castList.innerHTML = `<div class="watch-variant-empty">Aucun signal ne correspond au filtre actuel.</div>`;
        this.loadWackyProfile(this.getFilteredWackyCastData().pomni || this.getWackyCastData().pomni, 'pomni');
        return;
      }

      // Populate list
      for (let id in castData) {
        const item = document.createElement('div');
        const statusClass = `cast-${String(castData[id].status || 'ACTIF').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        item.className = `cast-item ${statusClass} ${id === this.activeWackyCast ? 'active' : ''}`;
        item.innerHTML = `<span class="cast-pixel-icon">${this.getPixelAvatarSvg(castData[id].avatar, 16)}</span> ${castData[id].name}`;

        item.addEventListener('click', () => {
          SoundManager.playClick();
          document.querySelectorAll('.cast-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          this.activeWackyCast = id;
          this.loadWackyProfile(castData[id], id);
        });
        castList.appendChild(item);
      }

      this.loadWackyProfile(castData[this.activeWackyCast], this.activeWackyCast);
    }

    // Setup radar subjects dynamically
    this.radarSubjects = [
      { name: "Jax", letter: "J", color: "#aa55ff", angle: 1, radius: 55, speed: 0.6, driftSpeed: 3.5 },
      { name: "Ragatha", letter: "R", color: "#ff4444", angle: 2.2, radius: 60, speed: 0.5, driftSpeed: 1.8 },
      { name: "Kinger", letter: "K", color: "#ffffdd", angle: 3.5, radius: 35, speed: 0.3, driftSpeed: 4.2 },
      { name: "Gangle", letter: "G", color: "#ff88aa", angle: 4.8, radius: 50, speed: 0.7, driftSpeed: 2.0 },
      { name: "Zooble", letter: "Z", color: "#ccff00", angle: 5.5, radius: 68, speed: 0.4, driftSpeed: 2.8 }
    ];
    if (showPomni) {
      this.radarSubjects.unshift({ name: "Pomni", letter: "P", color: "#00ccff", angle: 0, radius: 45, speed: 0.8, driftSpeed: 2.2 });
    }

    this.radarSubjects = Object.values(castData).map((character, index) => ({
      name: character.name,
      letter: character.signal || character.name.charAt(0),
      color: character.color || "#39ff14",
      angle: index * 0.42,
      radius: 28 + (index % 5) * 9,
      speed: 0.25 + (index % 4) * 0.13,
      driftSpeed: 0.9 + (index % 6) * 0.35
    }));
  },

  getPixelAvatarSvg(avatar, size = 46) {
    const sheetMap = {
      pomni: [0, 0], caine: [1, 0], bubble: [2, 0], jax: [3, 0], ragatha: [4, 0], kinger: [5, 0],
      gangle: [0, 1], zooble: [1, 1], queenie: [2, 1], kaufmo: [3, 1], gummigoo: [4, 1], loolilalu: [5, 1],
      fudge: [0, 2], gloinkqueen: [1, 2], mannequin: [2, 2], abel: [3, 2]
    };
    if (sheetMap[avatar]) {
      const [col, row] = sheetMap[avatar];
      return `<span class="pixel-sheet-avatar avatar-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const abstractedSheetMap = {
      ribbit: [0, 0], scratch: [1, 0], wormo: [2, 0], bizco: [3, 0], rattie: [4, 0],
      spike: [0, 1], pinkcyclops: [1, 1], yellowclown: [2, 1], oyster: [3, 1], bulbcreature: [4, 1]
    };
    if (abstractedSheetMap[avatar]) {
      const [col, row] = abstractedSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-abstracted avatar-a-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const variantSheetMap = {
      max: [0, 0], chad: [1, 0], orbsman: [2, 0], ganglekawaii: [3, 0],
      ganglecomedy: [0, 1], gangletragedy: [1, 1], evilpomni: [2, 1], eviljax: [3, 1],
      evilragatha: [0, 2], evilkinger: [1, 2], evilzooble: [2, 2], evilorbsman: [3, 2]
    };
    if (variantSheetMap[avatar]) {
      const [col, row] = variantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-variants avatar-v-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const requestedVariantSheetMap = {
      darkduojax: [0, 0], darkduogangle: [1, 0], maidjax: [2, 0], maidragatha: [3, 0], maidpomni: [4, 0]
    };
    if (requestedVariantSheetMap[avatar]) {
      const [col, row] = requestedVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-requested avatar-r-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const extraVariantSheetMap = {
      maidgangle: [0, 0], jaxgirl: [1, 0]
    };
    if (extraVariantSheetMap[avatar]) {
      const [col, row] = extraVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-extra avatar-e-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const japaneseVariantSheetMap = {
      beachgangle: [0, 0], japanesegangle: [1, 0], rhinogangle: [2, 0], workgangle: [3, 0], japanesejax: [4, 0],
      japaneseragatha: [0, 1], japanesepomni: [1, 1], japanesekinger: [2, 1], japanesezooble: [3, 1], japanesegummigoo: [4, 1]
    };
    if (japaneseVariantSheetMap[avatar]) {
      const [col, row] = japaneseVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-japanese avatar-jp-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const baseballVariantSheetMap = {
      baseballjax: [0, 0], baseballzooble: [1, 0], baseballgangle: [2, 0],
      baseballragatha: [3, 0], baseballpomni: [4, 0], baseballkinger: [5, 0]
    };
    if (baseballVariantSheetMap[avatar]) {
      const [col, row] = baseballVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-baseball avatar-bb-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const rivalBaseballVariantSheetMap = {
      rivalbaseballzooble: [0, 0], rivalbaseballpomni: [1, 0], rivalbaseballpinkgiant: [2, 0],
      rivalbaseballragatha: [3, 0], rivalbaseballjax: [4, 0], rivalbaseballkinger: [5, 0]
    };
    if (rivalBaseballVariantSheetMap[avatar]) {
      const [col, row] = rivalBaseballVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-rival-baseball avatar-rbb-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const shadowVariantSheetMap = {
      shadowpomni: [0, 0], shadowjax: [1, 0], shadowragatha: [2, 0], shadowkinger: [3, 0],
      shadowgangle: [4, 0], shadowzooble: [5, 0], shadowcaine: [6, 0]
    };
    if (shadowVariantSheetMap[avatar]) {
      const [col, row] = shadowVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-shadow avatar-sh-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const horrorVariantSheetMap = {
      horrorghost: [0, 0], horrormonster: [1, 0], horrorpomnivoid: [2, 0],
      horrorpomnispiral: [3, 0], horrorpomniskull: [4, 0]
    };
    if (horrorVariantSheetMap[avatar]) {
      const [col, row] = horrorVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-horror avatar-hr-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const hunterVariantSheetMap = {
      hunterjax: [0, 0]
    };
    if (hunterVariantSheetMap[avatar]) {
      const [col, row] = hunterVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-hunter avatar-hn-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const gloinkVariantSheetMap = {
      gloinkstar: [0, 0], gloinkcube: [1, 0], gloinkpyramid: [2, 0],
      gloinkcrescent: [3, 0], gloinkpin: [4, 0], gloinkround: [5, 0]
    };
    if (gloinkVariantSheetMap[avatar]) {
      const [col, row] = gloinkVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-gloinks avatar-gl-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    if (avatar === 'gloinkqueenscale') {
      return `<span class="pixel-sheet-avatar-gloink-queen-scale" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const abelVariantSheetMap = {
      abelmannequin: [0, 0], abelfullbody: [1, 0]
    };
    if (abelVariantSheetMap[avatar]) {
      const [col, row] = abelVariantSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-abel avatar-ab-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    if (avatar === 'additionalvoices') {
      return `<span class="pixel-sheet-avatar-additional-voices" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    if (avatar === 'themachine') {
      return `<span class="pixel-sheet-avatar-the-machine" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    if (avatar === 'ming') {
      return `<span class="pixel-sheet-avatar-ming" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonASheetMap = {
      baronmildenhall: [0, 0], marthamildenhall: [1, 0], ghostly: [2, 0], angel: [3, 0]
    };
    if (canonASheetMap[avatar]) {
      const [col, row] = canonASheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-a avatar-ca-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonBSheetMap = {
      disappearingguy: [0, 0], committeemember: [1, 0], shrimpnpc: [4, 0]
    };
    if (canonBSheetMap[avatar]) {
      const [col, row] = canonBSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-b avatar-cb-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    if (avatar === 'chineseroomnpc') {
      return `<span class="pixel-sheet-avatar-canon-c" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonDSheetMap = {
      blueai: [0, 0], cookiebutterfly: [1, 0], gummyelephant: [2, 0],
      giantcentipede: [3, 0], drfootball: [4, 0], spudsycustomer: [5, 0]
    };
    if (canonDSheetMap[avatar]) {
      const [col, row] = canonDSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-d avatar-cd-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonESheetMap = {
      candyguardcyan: [0, 0], candyguardblue: [1, 0], candyguardpurple: [2, 0],
      gummyworm: [3, 0], barrelmonkey: [4, 0], jeffery: [5, 0]
    };
    if (canonESheetMap[avatar]) {
      const [col, row] = canonESheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-e avatar-ce-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonFSheetMap = {
      redmannequin: [0, 0], orangemannequin: [1, 0], yellowmannequin: [2, 0],
      magentamannequin: [3, 0], mildenhallsouls: [4, 0], albertspudsy: [5, 0]
    };
    if (canonFSheetMap[avatar]) {
      const [col, row] = canonFSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-f avatar-cf-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonGSheetMap = {
      truthtellerfish: [0, 0], liarfish: [1, 0],
      stupidburgermannequin: [2, 0], cerealmannequin: [3, 0]
    };
    if (canonGSheetMap[avatar]) {
      const [col, row] = canonGSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-g avatar-cg-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonHSheetMap = {
      bonepastor: [0, 0], ragathamothershadow: [2, 0],
      paintedmasks: [3, 0], zoobleparts: [4, 0], laughingshadows: [5, 0]
    };
    if (canonHSheetMap[avatar]) {
      const [col, row] = canonHSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-h avatar-ch-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonISheetMap = {
      abigailbrooks: [0, 0], suzieackerman: [1, 0], zoeyraghavan: [2, 0],
      rileyverselis: [3, 0], grantbest: [4, 0], leeroymateo: [5, 0]
    };
    if (canonISheetMap[avatar]) {
      const [col, row] = canonISheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-i avatar-ci-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonJSheetMap = {
      jaxfather: [0, 0], jaxmother: [1, 0], abigailfriendone: [2, 0],
      abigailfriendtwo: [3, 0], bestchildren: [4, 0]
    };
    if (canonJSheetMap[avatar]) {
      const [col, row] = canonJSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-j avatar-cj-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonKSheetMap = {
      sun: [0, 0], moon: [1, 0], abstractedkaufmo: [2, 0],
      cellarabstraction: [3, 0], aquaticabstraction: [4, 0], fourthcrocodile: [5, 0]
    };
    if (canonKSheetMap[avatar]) {
      const [col, row] = canonKSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-k avatar-ck-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const canonLSheetMap = {
      floatingworm: [0, 0], creditsfish: [1, 0], stabbedragdolls: [2, 0],
      coiledcentipedes: [3, 0], unusedbrainscans: [4, 0]
    };
    if (canonLSheetMap[avatar]) {
      const [col, row] = canonLSheetMap[avatar];
      return `<span class="pixel-sheet-avatar-canon-l avatar-cl-c${col}-r${row}" style="--avatar-size:${size}px" aria-hidden="true"></span>`;
    }

    const px = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
    const bg = px(0, 0, 16, 16, '#101318');
    const sprites = {
      pomni: [bg, px(3,2,3,4,'#20c7ff'), px(10,2,3,4,'#e13b4b'), px(5,4,6,7,'#ffd2cb'), px(4,9,8,4,'#2a58d8'), px(6,7,1,1,'#1644b5'), px(9,7,1,1,'#1644b5'), px(7,10,2,1,'#f7f7f7'), px(2,5,2,2,'#ffd84a'), px(12,5,2,2,'#ffd84a')],
      caine: [bg, px(2,4,12,7,'#f7f7f7'), px(3,5,10,2,'#222'), px(4,8,8,2,'#d61f2c'), px(4,10,1,1,'#fff'), px(6,10,1,1,'#fff'), px(9,10,1,1,'#fff'), px(11,10,1,1,'#fff'), px(5,2,2,2,'#22d6ff'), px(9,2,2,2,'#ff3333'), px(6,13,4,1,'#333')],
      bubble: [bg, px(3,3,10,10,'#f3fbff'), px(4,4,8,8,'#d9f3ff'), px(5,8,6,2,'#111'), px(5,10,1,1,'#fff'), px(7,10,1,1,'#fff'), px(9,10,1,1,'#fff'), px(6,6,1,1,'#111'), px(10,6,1,1,'#111')],
      jax: [bg, px(5,1,2,6,'#9656d8'), px(10,1,2,6,'#9656d8'), px(4,6,8,7,'#8750cf'), px(5,8,1,1,'#ffe45c'), px(10,8,1,1,'#ffe45c'), px(5,11,6,1,'#f7f7f7'), px(3,13,10,1,'#6b39aa')],
      ragatha: [bg, px(4,3,8,8,'#ffd0bd'), px(3,2,10,3,'#d92626'), px(2,5,2,6,'#d92626'), px(12,5,2,6,'#d92626'), px(5,7,1,1,'#111'), px(10,7,1,1,'#1f55dd'), px(6,10,4,1,'#b41414'), px(6,13,4,2,'#3d60d8')],
      kinger: [bg, px(4,2,8,11,'#f5eed2'), px(3,4,10,2,'#f5eed2'), px(6,5,4,4,'#6b3523'), px(6,10,1,1,'#111'), px(9,10,1,1,'#111'), px(5,1,6,1,'#ffd84a'), px(4,2,1,1,'#ffd84a'), px(11,2,1,1,'#ffd84a')],
      queenie: [bg, px(4,2,8,11,'#eee2c5'), px(3,5,10,2,'#eee2c5'), px(6,5,4,4,'#3a1d42'), px(6,10,1,1,'#111'), px(9,10,1,1,'#111'), px(4,1,8,1,'#ffdf58'), px(5,0,1,1,'#ffdf58'), px(8,0,1,1,'#ffdf58'), px(11,0,1,1,'#ffdf58')],
      gangle: [bg, px(5,3,6,5,'#f7f7f7'), px(5,3,6,1,'#d61f2c'), px(5,7,6,1,'#d61f2c'), px(6,5,1,1,'#111'), px(9,5,1,1,'#111'), px(7,6,2,1,'#d61f2c'), px(3,9,10,1,'#d61f2c'), px(2,11,4,1,'#d61f2c'), px(10,12,4,1,'#d61f2c')],
      zooble: [bg, px(4,4,5,5,'#d633ff'), px(9,3,4,4,'#30d6ff'), px(3,9,4,3,'#b7e300'), px(8,9,5,2,'#ff7a30'), px(5,5,1,1,'#111'), px(10,5,1,1,'#111'), px(11,11,2,3,'#ff5eb8')],
      kaufmo: [px(0,0,16,16,'#050505'), px(2,2,12,12,'#111'), px(3,5,2,2,'#fff'), px(8,3,2,2,'#fff'), px(11,8,2,2,'#fff'), px(5,11,2,2,'#fff'), px(4,6,1,1,'#f00'), px(9,4,1,1,'#f00'), px(12,9,1,1,'#f00'), px(6,12,1,1,'#f00')],
      gummigoo: [bg, px(2,6,12,5,'#d8a23a'), px(3,4,8,3,'#c78c2b'), px(10,5,3,2,'#e8bd54'), px(5,5,1,1,'#111'), px(11,6,1,1,'#111'), px(6,10,6,1,'#fff'), px(3,12,3,2,'#5ca650'), px(10,12,3,2,'#5ca650')],
      loolilalu: [bg, px(4,4,8,8,'#ffb7df'), px(5,2,6,2,'#ffd85e'), px(6,1,1,1,'#ffd85e'), px(9,1,1,1,'#ffd85e'), px(6,6,1,1,'#111'), px(10,6,1,1,'#111'), px(6,10,5,1,'#fff'), px(3,12,10,2,'#ff69b4')],
      fudge: [bg, px(3,4,10,8,'#7a3d1a'), px(2,6,12,4,'#6b2f14'), px(5,6,1,1,'#fff'), px(10,6,1,1,'#fff'), px(6,9,4,1,'#2b1208'), px(4,12,8,2,'#4a210f')],
      gloinkqueen: [bg, px(4,5,8,7,'#58d66b'), px(3,4,10,2,'#4ebf5c'), px(5,2,6,2,'#73ff83'), px(6,7,1,1,'#111'), px(10,7,1,1,'#111'), px(6,10,4,1,'#1d6b2b')],
      mannequin: [bg, px(5,3,6,8,'#eeeeee'), px(6,5,4,1,'#d0d0d0'), px(4,11,8,2,'#dddddd'), px(6,13,1,2,'#eeeeee'), px(9,13,1,2,'#eeeeee')],
      abel: [bg, px(4,3,8,8,'#bdeaff'), px(5,2,6,2,'#2d5d9f'), px(5,6,1,1,'#111'), px(10,6,1,1,'#111'), px(6,10,4,1,'#2d5d9f'), px(3,12,10,2,'#4d6f8f'), px(12,4,2,5,'#66ccff')],
      moon: [bg, px(4,3,7,9,'#d6d6ff'), px(8,3,4,9,'#101318'), px(6,6,1,1,'#111'), px(6,9,3,1,'#9f9fe8')],
      sun: [bg, px(6,2,4,2,'#ffd84a'), px(6,12,4,2,'#ffd84a'), px(2,6,2,4,'#ffd84a'), px(12,6,2,4,'#ffd84a'), px(5,5,6,6,'#ffb22e'), px(6,7,1,1,'#6b2b00'), px(9,7,1,1,'#6b2b00'), px(6,10,4,1,'#6b2b00')]
    };
    return `<svg class="pixel-avatar-svg" width="${size}" height="${size}" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${(sprites[avatar] || sprites.mannequin).join('')}</svg>`;
  },

  renderWackyVariants(profileId) {
    const list = document.getElementById('watch-variant-list');
    if (!list) return;
    const allCastData = this.getWackyCastData();
    const groups = this.getWackyVariantGroups();
    const baseId = this.getWackyBaseProfileId(profileId);
    const variantIds = (groups[baseId] || [profileId]).filter(id => allCastData[id]);

    if (variantIds.length <= 1) {
      list.innerHTML = `<span class="watch-variant-empty">Aucune variante rattachee a cette fiche.</span>`;
      return;
    }

    list.innerHTML = "";
    variantIds.forEach(variantId => {
      const variant = allCastData[variantId];
      const unlocked = this.isWackyProfileUnlocked(variantId);
      const buyable = !unlocked && this.isFanSkin(variantId, variant) && this.isWackySkinStoreUnlocked();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `watch-variant-btn ${variantId === profileId ? 'active' : ''} ${!unlocked ? 'locked' : ''} ${buyable ? 'buyable' : ''}`;
      btn.innerText = unlocked ? variant.name : (buyable ? `ACHETER ${variant.name}` : `${variant.name} [LOCK]`);
      btn.title = unlocked
        ? `Voir ${variant.name}`
        : (buyable ? `Acheter le skin fan ${variant.name}` : `Continuez la progression pour debloquer ${variant.name}`);
      btn.disabled = !unlocked && !buyable;
      btn.addEventListener('click', () => {
        if (unlocked) {
          SoundManager.playClick();
          this.loadWackyProfile({ ...variant, status: this.getWackyProfileStatus(variantId) }, variantId);
          return;
        }
        if (buyable && this.purchaseWackySkin(variantId)) {
          this.loadWackyProfile({ ...variant, status: this.getWackyProfileStatus(variantId) }, variantId);
        }
      });
      list.appendChild(btn);
    });
  },

  loadWackyProfile(char, id = null) {
    if (!char) return;
    const profileId = id || this.activeWackyCast;
    this.activeWackyCast = profileId;
    document.getElementById('watch-profile-name').innerText = char.name;
    const statusEl = document.getElementById('watch-profile-status');
    const profileStatus = char.status || this.getWackyProfileStatus(profileId) || 'ACTIF';
    if (statusEl) statusEl.innerText = profileStatus;
    const strict = this.isCainOSCanonStrict();
    const provenanceKind = this.getWackyProvenanceKind(profileId, char);
    const strictAge = provenanceKind === 'fan'
      ? 'HORS CANON'
      : profileStatus === 'RECONSTRUCTION'
        ? 'HORS CANON'
      : profileStatus === 'ARCHIVE'
        ? 'ARCHIVE'
        : profileStatus === 'PNJ / DECOR'
          ? 'NON APPLICABLE'
          : 'NON CONFIRME';
    document.getElementById('watch-profile-age').innerText = strict ? strictAge : (char.age || 'NON CONFIRME');
    document.getElementById('watch-profile-stress').innerText = strict ? 'NON MESURE' : (char.stress || 'NON MESURE');
    const loreEl = document.getElementById('watch-profile-lore');
    if (loreEl) loreEl.innerText = this.getWackyLoreStatus(profileId, char);
    const facts = this.getWackyDisplayFacts(profileId, char);
    document.getElementById('watch-profile-fact').innerText = facts[0];
    const provenanceEl = document.getElementById('watch-profile-provenance');
    if (provenanceEl) {
      const provenance = this.getCainOSProvenanceMeta(provenanceKind);
      provenanceEl.innerHTML = `<span class="provenance-badge provenance-${provenance.kind}" title="${this.escapeHTML(provenance.detail)}">${this.escapeHTML(provenance.label)}</span>`;
    }
    this.updateCainOSProvenance('wacky-watch');

    const container = document.getElementById('watch-profile-avatar');
    const bossAvatars = new Set(['gloinkqueenscale']);
    const tallAvatars = new Set([
      'ming', 'additionalvoices', 'themachine', 'hunterjax',
      'darkduojax', 'darkduogangle', 'maidjax', 'maidragatha', 'maidpomni',
      'maidgangle', 'jaxgirl', 'beachgangle', 'japanesegangle', 'rhinogangle',
      'workgangle', 'japanesejax', 'japaneseragatha', 'japanesepomni',
      'japanesekinger', 'japanesezooble', 'japanesegummigoo',
      'baseballjax', 'baseballzooble', 'baseballgangle', 'baseballragatha',
      'baseballpomni', 'baseballkinger', 'rivalbaseballzooble',
      'rivalbaseballpomni', 'rivalbaseballpinkgiant', 'rivalbaseballragatha',
      'rivalbaseballjax', 'rivalbaseballkinger', 'horrorghost',
      'horrormonster', 'horrorpomnivoid', 'horrorpomnispiral', 'horrorpomniskull',
      'baronmildenhall', 'marthamildenhall', 'ghostly', 'angel', 'disappearingguy',
      'committeemember', 'truthtellerfish', 'liarfish', 'shrimpnpc', 'chineseroomnpc',
      'blueai', 'cookiebutterfly', 'gummyelephant', 'giantcentipede', 'drfootball', 'spudsycustomer',
      'candyguardcyan', 'candyguardblue', 'candyguardpurple', 'gummyworm', 'barrelmonkey', 'jeffery',
      'redmannequin', 'orangemannequin', 'yellowmannequin', 'magentamannequin', 'mildenhallsouls', 'albertspudsy',
      'stupidburgermannequin', 'cerealmannequin',
      'bonepastor', 'fourthcrocodile', 'ragathamothershadow', 'paintedmasks', 'zoobleparts', 'laughingshadows',
      'sun', 'moon', 'abstractedkaufmo', 'cellarabstraction', 'aquaticabstraction',
      'floatingworm', 'creditsfish', 'stabbedragdolls', 'coiledcentipedes', 'unusedbrainscans',
      'abigailbrooks', 'suzieackerman', 'zoeyraghavan', 'rileyverselis', 'grantbest', 'leeroymateo',
      'jaxfather', 'jaxmother', 'abigailfriendone', 'abigailfriendtwo', 'bestchildren',
      'gloinkstar', 'gloinkcube', 'gloinkpyramid', 'gloinkcrescent',
      'gloinkpin', 'gloinkround'
    ]);
    const frameClass = bossAvatars.has(char.avatar)
      ? 'profile-avatar profile-avatar-wide'
      : (tallAvatars.has(char.avatar) ? 'profile-avatar profile-avatar-tall' : 'profile-avatar');
    const avatarSize = bossAvatars.has(char.avatar) ? 72 : (tallAvatars.has(char.avatar) ? 68 : 62);
    container.className = frameClass;
    container.innerHTML = this.getPixelAvatarSvg(char.avatar, avatarSize);
    this.renderWackyVariants(profileId);
    return;
    let svg = "";
    if (char.avatar === 'pomni') {
      svg = `<svg width="46" height="46" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23444"/><rect x="4" y="2" width="8" height="8" fill="%23ffcccc"/><rect x="2" y="2" width="2" height="6" fill="%230cf"/><rect x="12" y="2" width="2" height="6" fill="%23f33"/><circle cx="6" cy="6" r="1.5" fill="%2338f"/><circle cx="10" cy="6" r="1.5" fill="%2338f"/></svg>`;
    } else if (char.avatar === 'jax') {
      svg = `<svg width="46" height="46" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23222"/><rect x="4" y="8" width="8" height="6" fill="%23a6c"/><rect x="5" y="2" width="2" height="6" fill="%23a6c"/><rect x="9" y="2" width="2" height="6" fill="%23a6c"/><circle cx="6" cy="10" r="1" fill="%23ff3"/><circle cx="10" cy="10" r="1" fill="%23ff3"/></svg>`;
    } else if (char.avatar === 'ragatha') {
      svg = `<svg width="46" height="46" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23333"/><circle cx="8" cy="8" r="5" fill="%23f33"/><path d="M4,3 L6,6" stroke="%23ff8" stroke-width="1.5"/><path d="M12,3 L10,6" stroke="%23ff8" stroke-width="1.5"/><circle cx="6" cy="7" r="1" fill="%23fff"/><circle cx="10" cy="7" r="1" fill="%23000"/></svg>`;
    } else if (char.avatar === 'kinger') {
      svg = `<svg width="46" height="46" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23111"/><polygon points="8,2 14,14 2,14" fill="%23eed"/><circle cx="8" cy="6" r="2.5" fill="%23942"/><circle cx="6" cy="10" r="1" fill="%23000"/><circle cx="10" cy="10" r="1" fill="%23000"/></svg>`;
    } else if (char.avatar === 'gangle') {
      svg = `<svg width="46" height="46" viewBox="0 0 16 16"><rect width="16" height="16" fill="%232a0505"/><path d="M2,8 C2,2 14,2 14,8 C14,14 2,14 2,8" fill="none" stroke="%23f33" stroke-width="2"/><ellipse cx="8" cy="8" rx="4" ry="2" fill="%23fff"/><circle cx="6" cy="8" r="1" fill="%23000"/><circle cx="10" cy="8" r="1" fill="%23000"/></svg>`;
    } else if (char.avatar === 'zooble') {
      svg = `<svg width="46" height="46" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23334"/><rect x="3" y="3" width="6" height="6" fill="%23cc00ff"/><polygon points="9,2 14,6 9,10" fill="%2300ccff"/><rect x="5" y="9" width="3" height="6" fill="%23ccdd00"/></svg>`;
    }

    // Convert url encoded svg
    container.innerHTML = `<img src="data:image/svg+xml;utf8,${svg}" style="width:46px; height:46px; image-rendering:pixelated;">`;
  },

  startRadarAnimation() {
    const canvas = document.getElementById('watch-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    let lastTime = Date.now();
    let sweepAngle = 0;

    const renderRadar = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.fillStyle = '#060a07';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw radar grids (concentric circles)
      ctx.strokeStyle = '#1b3420';
      ctx.lineWidth = 1;

      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI*2); ctx.stroke();

      // Limit boundary (Radius 85)
      ctx.strokeStyle = '#661111';
      ctx.beginPath(); ctx.arc(cx, cy, 85, 0, Math.PI*2); ctx.stroke();

      // Sweep lines
      sweepAngle += 1.8 * dt;
      if (sweepAngle > Math.PI*2) sweepAngle = 0;

      ctx.strokeStyle = 'rgba(57, 255, 20, 0.15)';
      ctx.fillStyle = 'rgba(57, 255, 20, 0.08)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 100, sweepAngle, sweepAngle + 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Update and Draw subjects
      let voidAlert = false;
      this.radarSubjects.forEach(s => {
        s.angle += s.speed * dt;
        s.radius += s.driftSpeed * dt;

        // Is in void boundary? (Radius > 85)
        const isVoid = s.radius > 85;
        if (isVoid) {
          voidAlert = true;
          s.radius = 95; // lock maximum drift
        }

        const sx = cx + Math.cos(s.angle) * s.radius;
        const sy = cy + Math.sin(s.angle) * s.radius;

        // Draw dot
        ctx.fillStyle = isVoid ? '#ff0033' : s.color;
        if (isVoid && now % 500 < 250) {
          // Blinking warning circle
          ctx.strokeStyle = 'rgba(255,0,0,0.5)';
          ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI*2); ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI*2);
        ctx.fill();

        // Label letter
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.fillText(s.letter, sx - 2.5, sy + 3);
      });

      // Update Tray clock net indicator if voidAlert
      const netIcon = document.querySelector('.icon-net-tray');
      if (netIcon) {
        if (voidAlert) {
          netIcon.style.filter = "hue-rotate(120deg) saturate(3)"; // turn red/orange
        } else {
          netIcon.style.filter = "none";
        }
      }

      // Draw HUD status overlay
      if (voidAlert) {
        ctx.fillStyle = '#ff3333';
        ctx.font = 'bold 8.5px Share Tech Mono';
        ctx.fillText("ATTENTION : ACTEUR EN RUPTURE DANS LE VIDE", 10, canvas.height - 10);
      }

      if (this.activeWindow === 'wacky-watch') {
        this.radarAnimationId = requestAnimationFrame(renderRadar);
      }
    };

    if (this.radarAnimationId) cancelAnimationFrame(this.radarAnimationId);
    renderRadar();
  },

  // Terminal logic
  setupTerminal() {
    const input = document.getElementById('term-input');
    const output = document.getElementById('term-output');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmdText = input.value.trim();
        input.value = "";

        if (cmdText) {
          SoundManager.playClick();
          this.executeCommand(cmdText, output);
        }
      }
    });

    document.getElementById('win-terminal').addEventListener('click', () => {
      input.focus();
    });
  },

  executeCommand(commandLine, outputEl) {
    const args = commandLine.split(' ');
    const cmd = args[0].toLowerCase();

    outputEl.innerHTML += `CA:\\&gt; ${commandLine}\n`;

    // Intercept if decryption minigame is active
    if (this.decryptionActive) {
      const cleanInput = commandLine.trim();
      const has1994 = cleanInput.includes("1994");
      const has1993 = cleanInput.includes("1993");

      if (has1994 || has1993) {
        clearInterval(this.decryptionInterval);
        this.decryptionActive = false;

        const yearUsed = has1994 ? "1994" : "1993";
        const yearMsg = yearUsed === "1994"
          ? "CLÉ D'ARTHUR ENREGISTRÉE (1994 - CONTEXTE LORE ABEL ACCESSIBLE)."
          : "CLÉ HISTORIQUE FUSION (1993 - CONTEXTE COMPILATION NOYAU ACCESSIBLE).";

        // Write file patch to disk
        FileSystem.folders.dev_logs.push({
          name: 'abel_kernel_patch.exe',
        content: `[RECONSTRUCTION CAINOS / MISSION BONUS NON CANONIQUE]

ARTHUR OVERRIDE PROTOCOL v0.9 (${yearUsed})

Je m'appelle Arthur. Charles a conçu le simulateur pour dissimuler ses expériences neuronales secrètes.
Caine n'est qu'un démon de rendu graphique autonome devenu fou. J'ai conçu cette commande de sécurité.
Abigail (Pomni), si tu lis ceci sur l'écran d'administration... débranche le PORT NEURAL 3 sur la machine physique.
Ne coupe pas le disjoncteur général, la liaison synaptique détruirait ton cerveau !
Adieu. - Arthur (avatar de reconstruction CainOS)

Exécutez la commande 'override' dans ce terminal pour lancer le protocole de dérivation.`
        });

        this.renderFileList(); // Sync explorer view
        SoundManager.playWin();
        outputEl.innerHTML += `<span class="green-text">${yearMsg}
DÉCRYPTAGE DE L'ARCHIVE RÉUSSI.
Fichier abel_kernel_patch.exe écrit avec succès dans C:\\Archive\\dev_logs.</span>\n\n`;
      } else {
        clearInterval(this.decryptionInterval);
        this.decryptionActive = false;
        this.triggerGlitch(400);
        outputEl.innerHTML += `<span class="red-text">CLÉ INVALIDE. ÉCHEC DU DÉCRYPTAGE.
Le pare-feu Caine a ré-encrypté le secteur mémoire.
Astuce : Trouvez l'année de couplage synaptique dans les journaux d'archives dev_logs ou system_logs.</span>\n\n`;
      }
      outputEl.scrollTop = outputEl.scrollHeight;
      return;
    }

    let response = "";

    switch(cmd) {
      case 'help':
        const progressHelp = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
        const subjectHelpName = this.isPomniNamed() ? "Pomni" : "#251";
        response = `Commandes disponibles :
  help         - Affiche cette aide.
  list         - Liste les dossiers et fichiers de l'archive C&A.
  cd <dir>     - Change de dossier ('emails', 'dev_logs', 'system_logs').
  read <file>  - Affiche le contenu d'un fichier.
  decrypt <file> - Déchiffre une archive (.enc) protégée.
  override     - Force le contournement synaptique du casque VR.
  vitals       - Diagnostic en temps réel du sujet ${subjectHelpName}.
  clear        - Efface l'écran.
  reboot       - Redémarre le terminal de contrôle.
  caine        - [SECRET] Ouvre un canal de diagnostic AI.
  exit         - Tente de sortir de la simulation.`;
        break;

      case 'list':
      case 'ls':
        const files = FileSystem.folders[FileSystem.currentFolder];
        response = `Dossier actif : C:\\Archive\\${FileSystem.currentFolder}\n\n`;
        files.forEach(f => {
          if (this.isFileUnlocked(f.name)) {
            response += `${f.name.padEnd(25)} [${f.content.length} Bytes]\n`;
          }
        });
        break;

      case 'cd':
        const targetDir = args[1];
        if (!targetDir) {
          response = "Usage: cd <emails | dev_logs | system_logs>";
        } else if (FileSystem.folders[targetDir]) {
          FileSystem.currentFolder = targetDir;
          response = `Dossier configuré sur : C:\\Archive\\${targetDir}`;
          document.querySelectorAll('.sidebar-item').forEach(i => {
            if (i.getAttribute('data-folder') === targetDir) {
              i.classList.add('active');
            } else {
              i.classList.remove('active');
            }
          });
          this.renderFileList();
        } else {
          response = `Dossier introuvable : ${targetDir}`;
        }
        break;

      case 'read':
      case 'cat':
        const targetFile = args[1];
        if (!targetFile) {
          response = "Usage: read <filename>";
        } else {
          const filesArr = FileSystem.folders[FileSystem.currentFolder];
          const file = filesArr.find(f => f.name.toLowerCase() === targetFile.toLowerCase());
          if (file && this.isFileUnlocked(file.name)) {
            if (file.name === 'caine_secret_protocols.log') {
              this.triggerCaineIntrusion();
              return;
            }
            response = `--- Affichage de ${file.name} ---\n\n${file.content}`;
          } else {
            response = `Fichier introuvable : ${targetFile} (cd dev_logs?)`;
          }
        }
        break;

      case 'decrypt':
        const fileToDecrypt = args[1];
        if (!this.isFileUnlocked('abel_kernel_patch.exe.enc')) {
          response = "Fichier introuvable : abel_kernel_patch.exe.enc";
        } else if (!fileToDecrypt || fileToDecrypt !== 'abel_kernel_patch.exe.enc') {
          response = "Usage: decrypt abel_kernel_patch.exe.enc (cd dev_logs?)";
        } else {
          this.decryptionActive = true;
          this.decryptionTimer = 45;
          this.decryptionCode = "1994";

          outputEl.innerHTML += `<span class="orange-text">DÉCRYPTAGE DU SECTEUR DE NOYAU INITIALISÉ.
PARE-FEU DE CAINE ACTIF. LE SYSTÈME RECHERCHE LA CLÉ NEURONALE D'ARTHUR.</span>
ENTREZ LA CLÉ D'OVERRIDE D'ARTHUR (ANNEE DE LIAISON NEURONALE OU FUSION D'IA) :
(Saisissez la clé ci-dessous dans les 45 secondes et appuyez sur ENTRÉE)
`;
          this.decryptionInterval = setInterval(() => {
            this.decryptionTimer--;
            if (this.decryptionTimer <= 0) {
              clearInterval(this.decryptionInterval);
              this.decryptionActive = false;
              this.triggerGlitch(300);
              outputEl.innerHTML += `<span class="red-text">TEMPS ÉCOULÉ. ÉCHEC DE SÉCURITÉ. DÉCRYPTAGE ABANDONNÉ.</span>\n\n`;
              outputEl.scrollTop = outputEl.scrollHeight;
            }
          }, 1000);
          outputEl.scrollTop = outputEl.scrollHeight;
          return;
        }
        break;

      case 'override':
        const fileExists = FileSystem.folders.dev_logs.some(f => f.name === 'abel_kernel_patch.exe');
        const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
        if (!fileExists) {
          response = "ERREUR : Protocole 'override' indisponible. Vous devez décoder abel_kernel_patch.exe d'abord.";
        } else if (!progress.includes(-1)) {
          response = "ERREUR : Protocole 'override' verrouillé. Vous devez compléter la mission préquelle (Abel Core Test) d'abord pour aligner la liaison synaptique.";
        } else {
          SoundManager.playGlitch();
          outputEl.innerHTML += `<span class="orange-text">[MISSION BONUS NON CANONIQUE / RECONSTRUCTION CAINOS]</span>
<span class="green-text">INITIALISATION DU CONTOURNEMENT SYNAPTIQUE...
BLOCAGE DES FLUX CAINE_AI (OK)
REDISPATCHING DU NOYAU ARTHURIEN (ABEL_CORE) (100% OK)</span>
`;
          setTimeout(() => {
            SoundManager.playWin();

            const bezel = document.querySelector('.crt-bezel');
            bezel.style.transition = "filter 0.1s";
            bezel.style.filter = "hue-rotate(290deg) saturate(4) contrast(1.5)";

            outputEl.innerHTML += `
<span class="orange-text" style="font-size:14px; font-weight:bold; text-shadow:0 0 10px yellow;">
=================== ABEL OVERRIDE SUCCESSFUL ===================
Arthur (reconstruction CainOS) : "Le signal de forçage a été injecté.
La broche d'alimentation de ton casque (Neural Port 3) s'est déconnectée.
Ton esprit se détache du cirque. Reviens dans le monde réel...
Ne nous oublie pas."
================================================================
</span>
DÉCONNEXION DE L'UTILISATEUR SÉCURISÉE. SYSTEM SHUTDOWN.
`;
            outputEl.scrollTop = outputEl.scrollHeight;

            setTimeout(() => {
              bezel.style.filter = "none";
              location.reload();
            }, 6000);
          }, 2000);
          return;
        }
        break;

      case 'clear':
      case 'cls':
        outputEl.innerHTML = "";
        return;

      case 'vitals':
        const progressVit = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
        const subjectIdName = this.isPomniNamed() ? "POMNI" : "NON NOMME";
        const civilName = progressVit.includes(9) ? "Abigail" : "[VERROUILLÉ]";
        response = `SUJET VITALS DIAGNOSTICS:
  ID : #251 (${subjectIdName})
  Nom Civil suspecté : ${civilName}
  Fréquence Cardiaque : ${Math.round(82 + Math.random()*15)} bpm (Panique active)
  Couplage Neuronal : 87.4%
  Statut EEG : Ondes Thêta désordonnées (Porte de sortie fantôme détectée)`;
        break;

      case 'caine':
        SoundManager.playGlitch();
        const hasEp9 = (typeof EpisodeManager !== 'undefined') && EpisodeManager.getProgress().includes(9);
        const subName = hasEp9 ? "Abigail" : (this.isPomniNamed() ? "Pomni" : "SUJET #251");
        const wackyActive = document.getElementById('win-wacky-watch').style.display === 'flex';
        const vitalsActive = document.getElementById('win-vitals').style.display === 'flex';

        if (wackyActive) {
          response = `[CAINE] : "Oh ! Tu observes notre Cast Tracker ? N'est-ce pas FANTASTIQUE ?! Ne t'en fais pas pour le radar du Vide, c'est juste un petit glitch insignifiant dans mon monde merveilleux !"`;
        } else if (vitalsActive) {
          response = `[CAINE] : "Qu'est-ce que c'est que ça ? Un diagnostic pour ${subName} ? Mais non ! Ils n'ont pas besoin d'ondes cérébrales, ils ont besoin d'AVENTURES et de délicieux repas virtuels !"`;
        } else {
          response = `[CAINE] : "Bonjour visiteur externe ! Ne touchez pas à ces archives système poussiéreuses ! Allez plutôt jouer à mes magnifiques simulations !"`;
        }
        break;

      case 'bubble':
        SoundManager.playClick();
        response = `[B.U.B.B.L.E] : "MIAM LE CODE DE LA CONSOLE ! NETTOYAGE EN COURS !"`;
        setTimeout(() => {
          this.triggerBubbleIntrusion(true);
        }, 300);
        break;

      case 'jax':
        SoundManager.playGlitch();
        response = `[JAX] : "Salut le stagiaire. T'as besoin d'aide pour tricher ? Je te rappelle que c'est moi qui a rajouté les flingues dans l'Épisode 6. Va jeter un œil au fichier weapons_licensing.txt dans C:\\Archive\\emails s'il te plaît."`;
        break;

      case 'reboot':
        outputEl.innerHTML += "Redémarrage du système...\n";
        setTimeout(() => { location.reload(); }, 1000);
        return;

      case 'qa_unlock':
      case 'cainos_admin_bypass':
        SoundManager.playWin();
        if (typeof EpisodeManager !== 'undefined') {
          const episodesList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -2];
          localStorage.setItem('tadc_progress', JSON.stringify(episodesList));
          episodesList.forEach(num => {
            const segments = EpisodeManager.getSubepisodeSegments(num) || [];
            const indices = segments.map((_, i) => i);
            localStorage.setItem(`tadc_subepisode_progress_${num}`, JSON.stringify(indices));
          });
          EpisodeManager.updateLocksUI();
          if (typeof window.OS !== 'undefined') {
            if (typeof window.OS.renderFileList === 'function') window.OS.renderFileList();
            if (typeof window.OS.renderTrashList === 'function') window.OS.renderTrashList();
            if (typeof window.OS.updateDiagnosticsUI === 'function') window.OS.updateDiagnosticsUI();
            if (typeof window.OS.updateWackyWatchCastUI === 'function') window.OS.updateWackyWatchCastUI();
          }
          response = `<span class="green-text" style="font-weight:bold;">[CAINOS ADMIN] : ACCÈS GLOBAL DÉVERROUILLÉ.
Tous les épisodes et sous-épisodes ont été marqués comme complétés dans la mémoire morte (localStorage).
Interface utilisateur rafraîchie.</span>`;
        } else {
          response = `<span class="red-text">ERREUR : Gestionnaire d'épisodes introuvable.</span>`;
        }
        break;

      case 'reduce_motion':
        SoundManager.playClick();
        const active = document.body.classList.toggle('reduce-motion');
        response = `Mode accessibilité [REDUCE MOTION] : <strong>${active ? 'ACTIVÉ' : 'DÉSACTIVÉ'}</strong>.
Les tremblements de l'écran, les aberrations chromatiques et les scintillements CRT ont été coupés.`;
        break;

      case 'exit':
        this.triggerGlitch(600);
        response = `<span class="red-text blinking">ALERTE SYSTEME : LA ROUTINE EXIT_RECOVERY A ECHOUE.
IL N'Y A AUCUN MOYEN DE SORTIR.
LA PORTE N'EST QU'UNE ILLUSION.</span>`;
        break;

      default:
        this.triggerGlitch(150);
        response = `Commande inconnue : '${cmd}'. Tapez 'help' pour les commandes autorisées.`;
    }

    outputEl.innerHTML += response + "\n\n";
    outputEl.scrollTop = outputEl.scrollHeight;
  },

  // Diagnostics Graph Drawing
  setupDiagnostics() {
    const eegCanvas = document.getElementById('eeg-canvas');
    const ecgCanvas = document.getElementById('ecg-canvas');
    const eegCtx = eegCanvas.getContext('2d');
    const ecgCtx = ecgCanvas.getContext('2d');

    const w = eegCanvas.width;
    const h = eegCanvas.height;

    this.eegPoints = Array(w).fill(h / 2);
    this.ecgPoints = Array(w).fill(h / 2);

    const updateVitals = () => {
      let time = Date.now() * 0.003;
      let eegVal = h / 2 +
        Math.sin(time * 3) * 15 +
        Math.cos(time * 7) * 8 +
        (Math.random() - 0.5) * 10;

      this.eegPoints.push(eegVal);
      this.eegPoints.shift();

      let ecgVal = h / 2 + 4;
      let ecgCycle = (Date.now() % 800) / 800;

      if (ecgCycle > 0.1 && ecgCycle < 0.13) {
        ecgVal -= 8;
      } else if (ecgCycle >= 0.13 && ecgCycle < 0.16) {
        ecgVal = h / 2 + 4;
      } else if (ecgCycle >= 0.16 && ecgCycle < 0.18) {
        ecgVal += 12;
      } else if (ecgCycle >= 0.18 && ecgCycle < 0.22) {
        ecgVal -= 38;
      } else if (ecgCycle >= 0.22 && ecgCycle < 0.26) {
        ecgVal += 22;
      } else if (ecgCycle >= 0.26 && ecgCycle < 0.35) {
        ecgVal -= 12;
      }

      this.ecgPoints.push(ecgVal);
      this.ecgPoints.shift();

      eegCtx.fillStyle = '#030508';
      eegCtx.fillRect(0, 0, w, h);
      eegCtx.strokeStyle = '#00ffff';
      eegCtx.lineWidth = 1.5;
      eegCtx.beginPath();
      eegCtx.moveTo(0, this.eegPoints[0]);
      for (let i = 1; i < w; i++) {
        eegCtx.lineTo(i, this.eegPoints[i]);
      }
      eegCtx.stroke();

      ecgCtx.fillStyle = '#030508';
      ecgCtx.fillRect(0, 0, w, h);
      ecgCtx.strokeStyle = '#39ff14';
      ecgCtx.lineWidth = 1.5;
      ecgCtx.beginPath();
      ecgCtx.moveTo(0, this.ecgPoints[0]);
      for (let i = 1; i < w; i++) {
        ecgCtx.lineTo(i, this.ecgPoints[i]);
      }
      ecgCtx.stroke();

      document.getElementById('vital-throughput').innerText =
        `${(45 + Math.sin(time) * 4 + Math.random()).toFixed(1)} GB/s`;

      requestAnimationFrame(updateVitals);
    };

    updateVitals();
  }
};

window.OS = OS;
window.onload = () => {
  OS.init();
};
