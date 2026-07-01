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
#042    | Pomni   | [FINAL LOCK]    | Identite humaine verrouillee jusqu au final. Dans le Cirque, le nom actif reste Pomni.`
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
        content: `STATUT SUJET #042

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
      'setting-audio-ambience': 'Regler le volume des ambiances originales CainOS.',
      'setting-audio-glitch': 'Regler le niveau des effets glitch originaux.',
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
      'dial-contrast': 'Regler le contraste du tube CRT CainOS.'
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
      "RESTAURATION SESSION ADMINISTRATEUR HACKÉE...",
      "--> FLUX CASQUE ACTIF - IMPORTATION SUJET EN COURS",
      "--> COMPILATION PROFIL AVATAR : SUJET #042 -> POMNI",
      "CHARGEMENT DU NOYAU D'ADMINISTRATION CHARLES...",
      "ACCÈS RECOUVRÉ - DEPASSEMENT DE PARE-FEU DE CAINE ACTIF",
      "SYSTEME PRÊT POUR L'ADMINISTRATION SECRÈTE."
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
          this.openWindow('simulations');
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
      "SUBJECT #042.................. PROFILE COMPILED",
      "AVATAR PACKAGE................ POMNI.DLL LOADED",
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
        "Initialisation de la session Pomni...",
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
        this.showCircusDosPreview();
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
        const workspace = document.getElementById('desktop-workspace').getBoundingClientRect();
        let left = e.clientX - workspace.left - this.dragOffset.x;
        let top = e.clientY - workspace.top - this.dragOffset.y;

        left = Math.max(0, Math.min(workspace.width - 150, left));
        top = Math.max(0, Math.min(workspace.height - 40, top));

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
      if (this.isBooted && Math.random() < 0.20 && document.getElementById('caine-intrusion').style.display === 'none') {
        this.triggerBubbleIntrusion();
      }
    }, 45000);
  },

  triggerCaineIntrusion() {
    SoundManager.playError();
    document.getElementById('caine-intrusion').style.display = 'flex';
  },

  triggerBubbleIntrusion() {
    SoundManager.playGlitch();
    const bubble = document.getElementById('bubble-intrusion');
    bubble.style.left = `${Math.floor(20 + Math.random() * 60)}%`;
    bubble.style.top = `${Math.floor(15 + Math.random() * 50)}%`;

    const phrases = ["MIAM LE CODE !", "NETTOYAGE !", "BUBULLE !", "SALUT EXTERNE !", "LE VIDE RECRUTE !"];
    bubble.querySelector('.bubble-text').innerText = phrases[Math.floor(Math.random() * phrases.length)];

    bubble.style.display = 'flex';
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

    const showAbigail = progress.includes(9);

    if (progress.includes(0)) {
      if (nameEl) nameEl.innerText = showAbigail ? "Pomni (Abigail)" : "Pomni";
      if (picEl) {
        picEl.className = "profile-pic pomni-pic";
        picEl.style.backgroundImage = "";
      }
    } else {
      if (nameEl) nameEl.innerText = showAbigail ? "SUJET #042 (Abigail)" : "SUJET #042";
      if (picEl) {
        picEl.className = "profile-pic";
        picEl.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><rect width=\"16\" height=\"16\" fill=\"%23333\"/><text x=\"4\" y=\"12\" fill=\"%23888\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"bold\">?</text></svg>')";
      }
    }
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

    if (EpisodeManager.activeGame) {
      EpisodeManager.activeGame.stop();
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
    art.innerText = baseLines.join('\\n');

    overlay.style.display = 'flex';
    overlay.classList.remove('rendering');
    void overlay.offsetWidth;
    overlay.classList.add('rendering');

    const statusSteps = [
      { t: 420, text: 'ANNEAU DE PISTE VERROUILLE...' },
      { t: 920, text: 'PANNEAUX ROUGE/BLEU EN ROTATION...' },
      { t: 1380, text: 'TOIT PRINCIPAL ATTACHE AU CIEL DIGITAL...' },
      { t: 1880, text: 'PORTE DU CHAPITEAU SYNCHRONISEE...' },
      { t: 2420, text: 'POINT DE VUE INTERNE PRET.' }
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
      ].join('\\n');
      if (status) status.innerText = 'CHAPITEAU ASSEMBLE - ENTREE SIMULATION DISPONIBLE';
      if (launch) {
        launch.disabled = false;
        launch.innerText = 'ENTRER DANS LE CHAPITEAU';
      }
      SoundManager.playWin();
    }, 2850));

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
    ].join('\\n');
    if (launch) {
      launch.disabled = true;
      launch.innerText = 'VUE INTERNE ACTIVE';
    }
    SoundManager.play(660, 0.12, 'triangle', 0.08);
    setTimeout(() => SoundManager.play(990, 0.12, 'sine', 0.06), 120);
    this.startCircusDoomView();
  },

  startCircusDoomView() {
    const overlay = document.getElementById('circus-dos-overlay');
    const canvas = document.getElementById('circus-doom-canvas');
    const zoneEl = document.getElementById('circus-doom-zone');
    const detailEl = document.getElementById('circus-doom-detail');
    if (!overlay || !canvas) return;

    this.stopCircusDoomView();
    overlay.classList.add('doom');
    canvas.focus();

    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const unlocked = ep => progress.includes(ep);
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
      4: { name: 'CELLAR / KAUFMO', short: 'CELLAR', detail: 'Zone de stockage des abstraits et trace Kaufmo apres le pilote.', color: '#56505f', floor: '#111117', ceiling: '#050508', unlocked: unlocked(1) },
      5: { name: 'PORTE DE SORTIE / VIDE', short: 'EXIT', detail: 'Prototype de sortie, couloirs impossibles et bureau apparu dans le pilote.', color: '#ffffff', floor: '#18202a', ceiling: '#060606', unlocked: unlocked(1) },
      6: { name: 'CANDY CANYON KINGDOM', short: 'CANDY', detail: 'Royaume bonbon, convoi sirop et route du tanker.', color: '#ff9b37', floor: '#4b2436', ceiling: '#24234f', unlocked: unlocked(2) },
      7: { name: 'TEST LEVEL / NPC SCAN', short: 'TEST', detail: 'Sous-couche technique liee a Gummigoo et aux donnees NPC.', color: '#9cff6d', floor: '#1d2b1f', ceiling: '#0f1b12', unlocked: unlocked(2) },
      8: { name: 'MILDENHALL MANOR', short: 'MANOR', detail: 'Manoir horrifique, baron, fantome et menace qui reagit aux signaux.', color: '#b7f0ff', floor: '#1d1827', ceiling: '#050816', unlocked: unlocked(3) },
      9: { name: 'SOUS-SOL MILDENHALL', short: 'CAVE', detail: 'Trappes, obscurite, armes de Kinger et fuite sous le manoir.', color: '#7c88a1', floor: '#0d1018', ceiling: '#03040a', unlocked: unlocked(3) },
      10: { name: "SPUDSY'S", short: 'SPUDSY', detail: 'Restaurant rapide, comptoir, tickets et stress de service de Gangle.', color: '#ff4d4d', floor: '#3b1a17', ceiling: '#251308', unlocked: unlocked(4) },
      11: { name: 'SUGGESTION BOX / MICRO-ZONES', short: 'IDEES', detail: 'Suite de micro-aventures generees par Caine depuis les suggestions.', color: '#ff4fb8', floor: '#2c1434', ceiling: '#160d25', unlocked: unlocked(5) },
      12: { name: 'SOFTBALL STADIUM', short: 'BALL', detail: 'Terrain de match, costumes sportifs et equipe adverse alternative.', color: '#83ff57', floor: '#173416', ceiling: '#14152f', unlocked: unlocked(5) },
      13: { name: 'THEY ALL GET GUNS', short: 'GUNS', detail: 'Arena d epreuves armees, scores et tension autour de Jax.', color: '#f6d743', floor: '#2f2610', ceiling: '#17110a', unlocked: unlocked(6) },
      14: { name: 'DIGITAL LAKE / BEACH', short: 'LAC', detail: 'Lac digital, plage, soleil dangereux et faux repos de Caine.', color: '#4ee7ff', floor: '#073844', ceiling: '#114071', unlocked: unlocked(7) },
      15: { name: 'CHINESE ROOM / ADMIN ZONE', short: 'ADMIN', detail: 'Zone de questionnement, anomalie C&A et couches systeme sous le lac.', color: '#ffcf75', floor: '#302318', ceiling: '#09111e', unlocked: unlocked(7) },
      16: { name: 'CAINE OFFICE / C&A CORE', short: 'CORE', detail: 'Bureau de Caine, origine IA et couches C&A que CainOS revele tard.', color: '#ff7a30', floor: '#291915', ceiling: '#10070d', unlocked: unlocked(8) || unlocked(9) },
      17: { name: 'KINGER MEMORY BUFFER', short: 'MEMOIRE', detail: 'Fragments Queenie, souvenirs et noyau emotionnel de Kinger.', color: '#d9d0a2', floor: '#252316', ceiling: '#0e0e12', unlocked: unlocked(8) },
      18: { name: 'FINAL CIRCUS / BACKSTAGE', short: 'FINAL', detail: 'Retour au cirque, brain scans, Ribbit et dernier etat de Pomni/Caine.', color: '#e53935', floor: '#2b1018', ceiling: '#09060d', unlocked: unlocked(9) },
      19: { name: 'CIRCUS MEMBERS ARCHIVE', short: 'MEMBRES', detail: 'Archives visuelles des membres secondaires connues apres les episodes.', color: '#c875ff', floor: '#21142e', ceiling: '#0c0614', unlocked: unlocked(9) }
    };
    const scenes = {
      2: { exits: [3, 4, 5, 6, 8, 10, 11, 14, 16], motif: 'circus', size: 17 },
      3: { exits: [2, 6, 11, 14], motif: 'grounds', size: 19 },
      4: { exits: [2, 5], motif: 'cellar', size: 11 },
      5: { exits: [2, 16], motif: 'exit', size: 13 },
      6: { exits: [2, 7], motif: 'candy', size: 17 },
      7: { exits: [6, 16], motif: 'test', size: 13 },
      8: { exits: [2, 9], motif: 'manor', size: 15 },
      9: { exits: [8], motif: 'basement', size: 11 },
      10: { exits: [2, 11], motif: 'spudsy', size: 13 },
      11: { exits: [2, 10, 12, 13], motif: 'micro', size: 15 },
      12: { exits: [11], motif: 'softball', size: 19 },
      13: { exits: [11], motif: 'guns', size: 15 },
      14: { exits: [2, 15], motif: 'lake', size: 19 },
      15: { exits: [14, 16], motif: 'admin', size: 13 },
      16: { exits: [2, 5, 15, 17, 18], motif: 'core', size: 15 },
      17: { exits: [16], motif: 'memory', size: 13 },
      18: { exits: [2, 16, 19], motif: 'final', size: 17 },
      19: { exits: [18], motif: 'archive', size: 15 }
    };

    this.circusDoom = {
      canvas,
      ctx: canvas.getContext('2d'),
      zoneEl,
      detailEl,
      map,
      portals,
      scenes,
      currentZoneId: 2,
      selectedExitIndex: 0,
      history: [],
      hotspots: [],
      interactionMessage: '',
      interactionUntil: 0,
      interactionChoices: null,
      lastZoneEventId: null,
      player: { x: 7.5, z: 11.2, a: -Math.PI / 2 },
      keys: new Set(),
      last: performance.now(),
      raf: null
    };
    this.prepareCircusSimulationRoom();
    this.markCainOSZoneVisited(2);
    this.loadCircusAvatarSheets();
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
      if (['arrowup','arrowdown','arrowleft','arrowright','enter',' ','w','a','s','d','z','q','1','2','3'].includes(key)) {
        e.preventDefault();
        if (['1','2','3'].includes(key) && this.circusDoom?.interactionChoices) this.chooseCircusDialogueOption(Number(key) - 1);
        else if (key === 'enter' || key === ' ') this.handleCircusSimulationInput(key);
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
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      const hit = [...state.hotspots].reverse().find(spot => x >= spot.x && x <= spot.x + spot.w && y >= spot.y && y <= spot.y + spot.h);
      if (hit) {
        if (hit.kind === 'dialogChoice') {
          this.chooseCircusDialogueOption(hit.choiceIndex);
        } else if (hit.kind === 'character') {
          this.talkToCircusCharacter(hit.sprite);
        } else if (hit.kind === 'prop') {
          this.inspectCircusProp(hit.prop);
        } else {
          state.selectedExitIndex = hit.index;
          this.enterCircusSimulationExit(hit.target);
        }
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
    if (this.circusDoom?.raf) cancelAnimationFrame(this.circusDoom.raf);
    if (this.circusDoomKeyDown) window.removeEventListener('keydown', this.circusDoomKeyDown);
    if (this.circusDoomKeyUp) window.removeEventListener('keyup', this.circusDoomKeyUp);
    if (this.circusDoomClick && this.circusDoom?.canvas) this.circusDoom.canvas.removeEventListener('click', this.circusDoomClick);
    this.circusDoom = null;
    this.circusDoomKeyDown = null;
    this.circusDoomKeyUp = null;
    this.circusDoomClick = null;
    if (typeof SoundManager !== 'undefined' && typeof SoundManager.stopContextPulse === 'function') {
      SoundManager.stopContextPulse();
    }
  },

  loadCircusAvatarSheets() {
    if (this.circusAvatarSheets) return;
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
      gloinkqueenscale: 'assets/images/cainos-pixel-cast-sheet-gloink-queen-scale.png'
    };
    this.circusAvatarSheets = {};
    this.circusAvatarFrameCache = {};
    Object.entries(sources).forEach(([key, src]) => {
      const img = new Image();
      img.onload = () => {
        this.circusAvatarFrameCache = {};
        this.drawCircusDoom?.();
      };
      img.src = src;
      this.circusAvatarSheets[key] = img;
    });
  },

  getCircusAvatarSheetSpec(avatar) {
    const tables = [
      { sheet: 'base', cols: 6, rows: 3, map: {
        pomni: [0, 0], caine: [1, 0], bubble: [2, 0], jax: [3, 0], ragatha: [4, 0], kinger: [5, 0],
        gangle: [0, 1], zooble: [1, 1], queenie: [2, 1], kaufmo: [3, 1], gummigoo: [4, 1], loolilalu: [5, 1],
        fudge: [0, 2], gloinkqueen: [1, 2], mannequin: [2, 2], abel: [3, 2], moon: [4, 2], sun: [5, 2]
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
      { sheet: 'gloinkqueenscale', cols: 1, rows: 1, map: { gloinkqueenscale: [0, 0] }}
    ];
    for (const table of tables) {
      if (table.map[avatar]) {
        const [col, row] = table.map[avatar];
        return { sheet: table.sheet, cols: table.cols, rows: table.rows, col, row };
      }
    }
    return null;
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
    } else if (['manor', 'basement', 'cellar'].includes(motif)) {
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
    } else if (motif === 'spudsy') {
      for (let x = 3; x < size - 3; x++) if (Math.abs(x + 0.5 - center.x) > 1.4) addBlock(x, 4, 2);
    } else if (motif === 'candy' || motif === 'lake' || motif === 'softball') {
      for (let x = 4; x < size - 4; x += 4) addBlock(x, 3, 2);
      for (let x = 5; x < size - 5; x += 5) addBlock(x, size - 5, 2);
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
    state.player.x = center.x;
    state.player.z = startZ + 0.35;
    state.player.a = -Math.PI / 2;
    state.hotspots = [];
    state.interactionMessage = '';
    state.interactionUntil = 0;
    state.interactionChoices = null;
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
    const exits = state.scenes[state.currentZoneId]?.exits || [];
    if (!exits.length) return;
    if (key === 'enter' || key === ' ') {
      if (state.interactionChoices) {
        this.chooseCircusDialogueOption(0);
        return;
      }
      const character = this.getNearestCircusCharacter();
      if (character && character.dist < 1.9 && Math.abs(character.angle) < 0.42) {
        this.talkToCircusCharacter(character);
        return;
      }
      const prop = this.getNearestCircusProp();
      if (prop && prop.dist < 2.15 && Math.abs(prop.angle) < 0.55) {
        this.inspectCircusProp(prop);
        return;
      }
      const door = this.getNearestUsableCircusDoor();
      this.enterCircusSimulationExit(door?.target ?? exits[state.selectedExitIndex]);
    } else if (key === 'arrowdown') {
      const previous = state.history.pop();
      if (previous) this.setCircusSimulationZone(previous, false);
    }
  },

  getNearestCircusCharacter() {
    const state = this.circusDoom;
    if (!state) return null;
    let best = null;
    this.getCircusActiveZoneSprites(state.currentZoneId, state).forEach((sprite, index) => {
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
    const character = this.getNearestCircusCharacter();
    if (character && character.dist < 2.2 && Math.abs(character.angle) < 0.48) {
      return `ENTREE / CLIC: parler a ${character.name}  |  1-3: choix rapides apres contact`;
    }
    const prop = this.getNearestCircusProp();
    if (prop && prop.dist < 2.3 && Math.abs(prop.angle) < 0.58) {
      return `ENTREE / CLIC: scanner ${this.getCircusPropName(prop, state.currentZoneId)}`;
    }
    const door = this.getNearestUsableCircusDoor();
    if (door && door.dist < 2.0 && Math.abs(door.angle) < 0.82) {
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

  inspectCircusProp(prop) {
    const state = this.circusDoom;
    if (!state || !prop) return;
    state.interactionMessage = this.getCircusPropInteraction(prop, state.currentZoneId);
    state.interactionUntil = performance.now() + 5600;
    state.interactionChoices = null;
    if (state.detailEl) state.detailEl.innerText = state.interactionMessage;
    SoundManager.play(390, 0.07, 'square', 0.04);
    setTimeout(() => SoundManager.play(585, 0.06, 'triangle', 0.035), 80);
  },

  getCircusPropInteraction(prop, zoneId) {
    const name = this.getCircusPropName(prop, zoneId);
    const lines = {
      '2:ring': "La piste centrale agit comme point d'ancrage: toutes les aventures reviennent vers le chapiteau.",
      '2:spotlight': "Les projecteurs suivent les avatars, pas les corps. CainOS detecte seulement des silhouettes numeriques.",
      '2:pillar': "Pilier de chapiteau: structure stable, couleurs primaires, aucune sortie reelle dans la toile.",
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
      '19:archive': "Cadre archive: membre repertorie, presence narrative verrouillee par la progression."
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
      archive: "cadre archive"
    };
    return names[prop.kind] || prop.kind || "objet";
  },

  getCircusPropProfileKey(prop, zoneId) {
    const zoneMap = {
      '2:ring': 'CAINE',
      '4:eye': 'KAUFMO',
      '5:exitframe': 'POMNI',
      '6:truck': 'GUMMIGOO',
      '7:console': 'GUMMIGOO',
      '8:window': 'BARON_MILDENHALL',
      '8:candle': 'GHOSTLY',
      '10:counter': 'GANGLE',
      '10:menu': 'TRAINING_VIDEO',
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
    const line = this.getCircusCharacterInteraction(sprite, state.currentZoneId);
    const choices = this.getCircusCharacterChoices(sprite, state.currentZoneId, line);
    state.interactionMessage = choices ? choices.prompt : line;
    state.interactionChoices = choices;
    state.interactionUntil = performance.now() + (choices ? 12000 : 5600);
    if (state.detailEl) state.detailEl.innerText = state.interactionMessage;
    SoundManager.play(520, 0.08, 'triangle', 0.05);
  },

  chooseCircusDialogueOption(index) {
    const state = this.circusDoom;
    const choices = state?.interactionChoices;
    if (!choices || !choices.options?.[index]) return;
    const option = choices.options[index];
    state.interactionMessage = option.response;
    state.interactionChoices = null;
    state.interactionUntil = performance.now() + 7200;
    if (choices.avatar) {
      const delta = option.label === 'Profil' ? 1 : option.label === 'Routine' ? 0 : 3;
      this.adjustCainOSRelation(choices.avatar, delta);
    }
    if (state.detailEl) state.detailEl.innerText = option.response;
    SoundManager.play(620 + index * 80, 0.08, 'triangle', 0.045);
  },

  getCircusCharacterChoices(sprite, zoneId, introLine) {
    const avatar = sprite.avatar || sprite.type;
    const profileKey = this.getCircusCharacterProfileKey(sprite);
    const profileLine = profileKey ? this.getCircusProfileSummary(profileKey) : "Aucun profil CainOS critique disponible pour ce signal.";
    const zoneHint = this.getCircusZoneDialogueHint(zoneId);
    const routineHint = this.getCircusRoutineDialogueHint(sprite, zoneId);
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
        { label: "Archive", response: "Ribbit Archive: CainOS conserve ce signal comme trace de membre disparu, pas comme resident revenu." },
        { label: "Final", response: "Ribbit Archive: Les reves et souvenirs du final laissent remonter les anciens profils sans les restaurer." }
      ]
    };
    const specialOptions = special[avatar] || special[sprite.type] || [];
    return {
      speaker: sprite.name,
      avatar,
      prompt: introLine,
      options: [
        ...(specialOptions.slice(0, 2)),
        { label: "Zone", response: zoneHint },
        { label: "Profil", response: profileLine },
        { label: "Routine", response: routineHint }
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
      19: "CainOS: Les Circus Members disparus restent des archives visuelles verrouillees par progression."
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
        18: "Pomni: Si tout perd ses couleurs, au moins on peut encore se retrouver ici."
      },
      caine: {
        2: "Caine: Une scene praticable, des portes splendides, et aucune garantie de sortie!",
        16: "Caine: Le coeur C&A est un local technique, pas une salle de pause pour sujets curieux.",
        18: "Caine: Le spectacle continue tant que le systeme peut encore sourire."
      },
      bubble: {
        2: "Bubble: Je vote pour la porte la plus brillante!",
        10: "Bubble: Commande supplementaire! Mauvaise idee supplementaire!"
      },
      jax: {
        2: "Jax: Si une porte est verrouillee, c'est probablement la seule interessante.",
        14: "Jax: Version chasseur, meme probleme: Caine appelle ca des vacances.",
        18: "Jax: Le final dramatique, c'est vraiment pas mon style."
      },
      ragatha: {
        2: "Ragatha: Avance doucement. Les salles changent moins vite si on garde un repere.",
        8: "Ragatha: Le manoir n'est pas juste un decor. Il appuie sur les failles.",
        18: "Ragatha: Meme quand la scene casse, le groupe doit rester ensemble."
      },
      kinger: {
        2: "Kinger: Les murs ont une memoire. Les portes aussi, malheureusement.",
        8: "Kinger: Les pieces sombres protegent parfois mieux les souvenirs.",
        17: "Kinger: Ce buffer n'est pas un puzzle. C'est une cicatrice rangee par le systeme."
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
      kaufmo: "Kaufmo Archive: ...",
      horrorghost: "Fantome: Le signal te regarde aussi.",
      horrormonster: "Mildenhall Monster: Signal horrifique confine au manoir.",
      horrorpomnivoid: "Possessed Pomni: Projection de peur, pas nouvel avatar stable.",
      horrorpomniskull: "Horror Pomni: Trace de panique visuelle.",
      workgangle: "Gangle: Le service client est plus dur que les aventures.",
      ming: "Ming: Figurants et prix absurdes detectes.",
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
    const line = zoneLines[avatar]?.[zoneId] || defaultLines[avatar] || `${sprite.name}: Signal detecte.`;
    const profileKey = this.getCircusCharacterProfileKey(sprite);
    const profileLine = profileKey ? this.getCircusProfileSummary(profileKey) : "";
    return profileLine ? `${line} ${profileLine}` : line;
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
      gummigoo: "GUMMIGOO",
      max: "MAX",
      chad: "BANDIT",
      loolilalu: "PRINCESS_LOO",
      fudge: "THE_FUDGE",
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
    const target = state.portals[targetId];
    if (!target?.unlocked) {
      SoundManager.playError();
      if (state.detailEl) {
        state.detailEl.innerText = `VERROUILLE: continuez les episodes avant d ouvrir ${target?.name || 'cette zone'}.`;
      }
      return;
    }
    state.history.push(state.currentZoneId);
    this.setCircusSimulationZone(targetId, true);
  },

  setCircusSimulationZone(zoneId, playSound = true) {
    const state = this.circusDoom;
    if (!state || !state.portals[zoneId]) return;
    state.currentZoneId = zoneId;
    state.selectedExitIndex = 0;
    state.hotspots = [];
    this.prepareCircusSimulationRoom();
    this.markCainOSZoneVisited(zoneId);
    if (playSound) SoundManager.play(660, 0.08, 'triangle', 0.05);
    if (typeof SoundManager.startContextPulse === 'function') {
      const motif = state.scenes[zoneId]?.motif || 'circus';
      SoundManager.startContextPulse(motif);
    }
  },

  updateCircusDoom(dt) {
    const state = this.circusDoom;
    if (!state) return;
    const { player, keys } = state;
    const turn = 2.35 * dt;
    const speed = 2.15 * dt;
    if (keys.has('arrowleft') || keys.has('q')) player.a -= turn;
    if (keys.has('arrowright') || keys.has('d')) player.a += turn;

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

    let move = 0;
    if (keys.has('arrowup') || keys.has('w') || keys.has('z')) move += speed;
    if (keys.has('arrowdown') || keys.has('s')) move -= speed;
    if (move !== 0) {
      tryMove(player.x + Math.cos(player.a) * move, player.z + Math.sin(player.a) * move);
      state.interactionChoices = null;
    }
    if (keys.has('a')) {
      tryMove(player.x + Math.cos(player.a - Math.PI / 2) * speed, player.z + Math.sin(player.a - Math.PI / 2) * speed);
      state.interactionChoices = null;
    }

    const nearestDoor = this.getNearestUsableCircusDoor();
    if (nearestDoor && Math.abs(nearestDoor.angle) < 0.85) {
      state.selectedExitIndex = nearestDoor.index;
    }

    const portal = state.portals[state.currentZoneId];
    if (state.zoneEl) {
      if (portal) {
        state.zoneEl.innerText = `ZONE: ${portal.name}`;
      } else {
        state.zoneEl.innerText = 'ZONE: PASSERELLE INTERNE';
      }
    }
    if (state.interactionChoices && performance.now() > state.interactionUntil) {
      state.interactionChoices = null;
      state.interactionMessage = '';
    }
    if (state.detailEl) {
      if (state.interactionMessage && performance.now() < state.interactionUntil) {
        state.detailEl.innerText = state.interactionMessage;
      } else {
        const focus = this.getCircusFocusedHint();
        if (focus) {
          state.detailEl.innerText = focus;
        } else {
          const event = this.getCircusZoneAmbientEvent(state.currentZoneId, state);
          state.detailEl.innerText = event?.detail || (portal
            ? (portal.unlocked ? portal.detail : `VERROUILLE: terminez l episode requis avant d afficher ${portal.short}.`)
            : 'Hub interne: traversez les couloirs pour inspecter les zones de simulation.');
        }
      }
    }
  },

  drawCircusDoom() {
    const state = this.circusDoom;
    if (!state) return;
    this.drawCircusSimulationScene();
  },

  drawCircusSimulationScene() {
    const state = this.circusDoom;
    if (!state) return;
    const { canvas, ctx, portals } = state;
    const w = canvas.width;
    const h = canvas.height;
    const zone = portals[state.currentZoneId] || portals[2];
    state.hotspots = [];

    this.drawCircusRaycastRoom(ctx, w, h, state, zone);
    this.drawCircusZoneEvents(ctx, w, h, state, zone);
    this.drawCircusDepthProps(ctx, w, h, state);
    this.drawCircusPhysicalDoors(ctx, w, h, portals, state);
    this.drawCircusImpostorSprites(ctx, w, h, state);
    this.drawCircusConversationOverlay(ctx, w, h, state);
    this.drawCircusSimulationReticle(ctx, w, h, zone);
    this.drawCircusRoomMinimap(ctx, w, h, state, zone);
  },

  canMoveInCircusRoom(x, z) {
    const room = this.circusDoom?.room;
    if (!room) return false;
    const ix = Math.floor(x);
    const iz = Math.floor(z);
    if (ix < 0 || iz < 0 || ix >= room.size || iz >= room.size) return false;
    return room.grid[iz]?.[ix] === 0;
  },

  resolveCircusWorldPoint(obj, state) {
    if (obj.space === 'world' || !state.room) return { x: obj.x, z: obj.z };
    const center = state.room.center;
    return { x: center.x + obj.x, z: center.z + obj.z };
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
    const ceilingGradient = ctx.createLinearGradient(0, 0, 0, horizon);
    ceilingGradient.addColorStop(0, this.shadeHex(zone.ceiling || '#120821', 0.65));
    ceilingGradient.addColorStop(1, this.shadeHex(zone.ceiling || '#120821', 1.24));
    ctx.fillStyle = ceilingGradient;
    ctx.fillRect(0, 0, w, horizon);

    const floorGradient = ctx.createLinearGradient(0, horizon, 0, h);
    floorGradient.addColorStop(0, this.shadeHex(zone.floor || '#24112f', 1.16));
    floorGradient.addColorStop(1, this.shadeHex(zone.floor || '#24112f', 0.52));
    ctx.fillStyle = floorGradient;
    ctx.fillRect(0, horizon, w, h - horizon);

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

    const rays = 240;
    const fov = Math.PI / 3.05;
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
      const wallH = Math.min(h * 1.9, (h * 0.72) / corrected);
      const x = Math.floor(ratio * w);
      const y = Math.floor(horizon - wallH * 0.52);

      const depthShade = Math.max(0.26, 1.08 - corrected / (room.size * 0.92));
      const sideShade = hit.nearVertical ? 0.92 : 0.72;
      const shadeFactor = depthShade * sideShade;

      if (hit.cell >= 100) {
        // Portal / Door wall base
        const baseColor = this.getCircusWallColor(hit.cell, zone, state);
        ctx.fillStyle = this.shadeHex(baseColor, shadeFactor);
        ctx.fillRect(x, y, strip, Math.ceil(wallH));
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        ctx.fillRect(x, y + wallH * 0.1, strip, Math.max(1, wallH * 0.04));
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fillRect(x, y + wallH * 0.46, strip, Math.max(1, wallH * 0.08));
      } else {
        // Normal wall - procedural motifs based on series decors
        const motif = (state.scenes[state.currentZoneId] || state.scenes[2])?.motif || 'circus';
        const hitX = state.player.x + rayCos * hit.dist;
        const hitZ = state.player.z + raySin * hit.dist;
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
        { id: 'ghost_pass', label: 'GHOST PASS', detail: 'EVENT: apparition spectrale en bord de scene.', color: '#7df0ff' }
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
      ]
    };
    const zoneEvents = events[zoneId];
    if (!zoneEvents?.length) return null;
    return { ...zoneEvents[slot % zoneEvents.length], phase, slot };
  },

  drawCircusZoneEvents(ctx, w, h, state, zone) {
    const event = this.getCircusZoneAmbientEvent(state.currentZoneId, state);
    if (!event) return;
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

  drawCircusRoomMinimap(ctx, w, h, state, zone) {
    const room = state.room;
    if (!room) return;
    const cell = 4;
    const ox = 12;
    const oy = 46;
    ctx.save();
    ctx.fillStyle = 'rgba(5,2,13,0.62)';
    ctx.fillRect(ox - 4, oy - 4, room.size * cell + 8, room.size * cell + 8);
    for (let z = 0; z < room.size; z++) {
      for (let x = 0; x < room.size; x++) {
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
    const lift = Math.min(h * 0.3, (1 / Math.max(0.2, depth)) * h * 0.28);
    return Math.min(h - 18, h * 0.6 + lift);
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
    const fovScale = w * 0.52;
    return {
      x: w / 2 + (rx / rz) * fovScale,
      y: this.getCircusProjectedFloorY(rz, h),
      depth: rz,
      scale: Math.min(2.2, Math.max(0.22, 2.25 / rz))
    };
  },

  getCircusZoneProps(zoneId) {
    const basePillars = [
      { kind: 'pillar', x: -2.9, z: -1.4, color: '#ffd84a' },
      { kind: 'pillar', x: 2.9, z: -1.4, color: '#2a58d8' },
      { kind: 'pillar', x: -3.15, z: -3.1, color: '#e53935' },
      { kind: 'pillar', x: 3.15, z: -3.1, color: '#ffd84a' }
    ];
    const byZone = {
      2: [...basePillars, { kind: 'ring', x: 0, z: -2.9, color: '#7df0ff' }, { kind: 'spotlight', x: -1.8, z: -2.2, color: '#fff1a8' }, { kind: 'spotlight', x: 1.8, z: -2.2, color: '#fff1a8' }],
      3: [{ kind: 'tent', x: 0, z: -3.0, color: '#e53935' }, { kind: 'balloon', x: -2.3, z: -2.2, color: '#ff4fb8' }, { kind: 'balloon', x: 2.3, z: -2.4, color: '#7df0ff' }],
      4: [{ kind: 'crate', x: -1.8, z: -2.0, color: '#56505f' }, { kind: 'eye', x: 0.9, z: -2.7, color: '#ff3333' }, { kind: 'crate', x: 2.2, z: -1.7, color: '#33333a' }],
      5: [{ kind: 'exitframe', x: 0, z: -3.1, color: '#ffffff' }, { kind: 'desk', x: -1.5, z: -2.1, color: '#a0a8b8' }],
      6: [{ kind: 'candy', x: -2.2, z: -2.2, color: '#ff9b37' }, { kind: 'truck', x: 0.4, z: -2.8, color: '#ffd84a' }, { kind: 'candy', x: 2.3, z: -1.8, color: '#ff4fb8' }],
      7: [{ kind: 'console', x: -1.6, z: -2.2, color: '#9cff6d' }, { kind: 'gridnode', x: 1.4, z: -2.6, color: '#7df0ff' }],
      8: [{ kind: 'window', x: -2.2, z: -2.5, color: '#b7f0ff' }, { kind: 'table', x: 0.2, z: -2.9, color: '#7c88a1' }, { kind: 'candle', x: 1.8, z: -1.9, color: '#ffd84a' }],
      9: [{ kind: 'stairs', x: 0, z: -2.8, color: '#7c88a1' }, { kind: 'barrel', x: -2.1, z: -1.9, color: '#56505f' }],
      10: [{ kind: 'counter', x: 0, z: -2.7, color: '#f6d743' }, { kind: 'menu', x: -1.9, z: -2.3, color: '#ff4d4d' }, { kind: 'menu', x: 1.9, z: -2.3, color: '#ff4d4d' }],
      11: [{ kind: 'card', x: -1.8, z: -2.1, color: '#ff4fb8' }, { kind: 'card', x: 0, z: -2.7, color: '#7df0ff' }, { kind: 'card', x: 1.8, z: -2.1, color: '#ffd84a' }],
      12: [{ kind: 'base', x: 0, z: -2.6, color: '#ffffff' }, { kind: 'scoreboard', x: 0, z: -3.25, color: '#83ff57' }],
      13: [{ kind: 'target', x: -1.8, z: -2.3, color: '#f6d743' }, { kind: 'target', x: 1.8, z: -2.3, color: '#ff4d4d' }],
      14: [{ kind: 'umbrella', x: -1.8, z: -2.1, color: '#ffd84a' }, { kind: 'wave', x: 0, z: -3.0, color: '#4ee7ff' }, { kind: 'sun', x: 2.4, z: -2.8, color: '#ffe57d' }],
      15: [{ kind: 'console', x: 0, z: -2.7, color: '#ffcf75' }, { kind: 'gridnode', x: -2.0, z: -2.0, color: '#7df0ff' }],
      16: [{ kind: 'desk', x: 0, z: -2.9, color: '#ff7a30' }, { kind: 'console', x: -2.0, z: -2.2, color: '#7df0ff' }, { kind: 'eye', x: 2.1, z: -2.2, color: '#ff3333' }],
      17: [{ kind: 'memory', x: -1.8, z: -2.0, color: '#d9d0a2' }, { kind: 'memory', x: 0, z: -2.6, color: '#7df0ff' }, { kind: 'memory', x: 1.8, z: -2.0, color: '#d9d0a2' }],
      18: [...basePillars, { kind: 'spotlight', x: 0, z: -2.6, color: '#e53935' }],
      19: [{ kind: 'archive', x: -2.0, z: -2.1, color: '#c875ff' }, { kind: 'archive', x: 0, z: -2.7, color: '#7df0ff' }, { kind: 'archive', x: 2.0, z: -2.1, color: '#ffd84a' }]
    };
    return [...(byZone[zoneId] || basePillars), ...this.getCircusExtraZoneProps(zoneId)];
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
      8: [
        { kind: 'candle', x: -3.1, z: -1.15, color: '#ffd84a' },
        { kind: 'window', x: 3.05, z: -1.2, color: '#b7f0ff' }
      ],
      10: [
        { kind: 'counter', x: -3.05, z: -1.05, color: '#f6d743' },
        { kind: 'menu', x: 3.1, z: -1.15, color: '#ff4d4d' }
      ],
      12: [
        { kind: 'base', x: -3.15, z: -1.0, color: '#ffffff' },
        { kind: 'base', x: 3.15, z: -1.0, color: '#ffffff' }
      ],
      14: [
        { kind: 'umbrella', x: -3.2, z: -1.15, color: '#ffd84a' },
        { kind: 'wave', x: 3.05, z: -1.2, color: '#4ee7ff' }
      ],
      16: [
        { kind: 'console', x: 2.95, z: -1.15, color: '#7df0ff' },
        { kind: 'gridnode', x: -3.0, z: -1.1, color: '#ff7a30' }
      ],
      18: [
        { kind: 'archive', x: -3.05, z: -1.1, color: '#c875ff' },
        { kind: 'spotlight', x: 3.05, z: -1.2, color: '#fff1a8' }
      ]
    };
    return extras[zoneId] || [];
  },

  drawCircusDepthProps(ctx, w, h, state) {
    const props = this.getCircusZoneProps(state.currentZoneId)
      .map(prop => ({ ...prop, projected: this.projectCircusPoint(prop, state, w, h) }))
      .filter(prop => prop.projected)
      .sort((a, b) => b.projected.depth - a.projected.depth);
    props.forEach(prop => {
      this.addCircusPropHotspot(state, prop);
      this.drawCircusProp(ctx, prop, w, h);
    });
  },

  addCircusPropHotspot(state, prop) {
    if (!state || !prop.projected) return;
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
    const s = Math.max(0.25, p.scale);
    const wideKinds = new Set(['ring', 'counter', 'truck', 'scoreboard', 'table', 'desk', 'exitframe']);
    const tallKinds = new Set(['pillar', 'tent', 'spotlight', 'umbrella', 'window', 'archive', 'console']);
    const smallKinds = new Set(['candle', 'balloon', 'eye', 'sun', 'base', 'target', 'memory']);
    let width = 82 * s;
    let height = 86 * s;
    if (wideKinds.has(prop.kind)) width = 122 * s;
    if (tallKinds.has(prop.kind)) height = 126 * s;
    if (smallKinds.has(prop.kind)) {
      width = 62 * s;
      height = 78 * s;
    }
    width = Math.max(22, width);
    height = Math.max(28, height);
    return {
      x: p.x - width / 2,
      y: (p.y || 0) - height,
      w: width,
      h: height
    };
  },

  drawCircusProp(ctx, prop, w, h) {
    const p = prop.projected;
    const s = Math.max(0.25, p.scale);
    const x = p.x;
    const y = p.y || h * 0.58;
    ctx.save();
    ctx.translate(x, y);
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
    if (p.depth < 6.2) {
      ctx.globalAlpha = 0.86;
      ctx.fillStyle = '#fff1a8';
      ctx.strokeStyle = '#05020d';
      ctx.lineWidth = Math.max(1, 1.5 * s);
      const markerY = -Math.max(50, 96 * s);
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
    doors.forEach(door => {
      const target = portals[door.target];
      if (!target) return;
      const p = door.projected;
      const selected = door.index === state.selectedExitIndex;
      const locked = !target.unlocked;
      const scale = Math.max(0.28, p.scale);
      const doorW = Math.max(24, 62 * scale);
      const doorH = Math.max(56, 136 * scale);
      const x = p.x - doorW / 2;
      const baseY = Math.min(h - 15, p.y || this.getCircusProjectedFloorY(p.depth, h));
      const y = baseY - doorH;
      state.hotspots.push({ x: x - doorW * 0.18, y, w: doorW * 1.36, h: doorH + Math.max(8, 12 * scale), target: door.target, index: door.index });
      ctx.fillStyle = 'rgba(0,0,0,0.44)';
      ctx.beginPath();
      ctx.ellipse(p.x, baseY + Math.max(2, 3 * scale), doorW * 0.66, Math.max(3, 7 * scale), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.34)';
      ctx.fillRect(x - doorW * 0.16, y - doorH * 0.05, doorW * 1.32, doorH * 1.08);
      ctx.fillStyle = locked ? '#14141a' : '#100020';
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
      ctx.fillStyle = locked ? 'rgba(0,0,0,0.5)' : `${target.color}44`;
      ctx.fillRect(x + doorW * 0.14, y + doorH * 0.22, doorW * 0.72, doorH * 0.65);
      ctx.fillStyle = locked ? 'rgba(80,80,90,0.7)' : `${target.color}77`;
      ctx.fillRect(x - doorW * 0.2, baseY - Math.max(4, 7 * scale), doorW * 1.4, Math.max(5, 9 * scale));
      ctx.strokeStyle = 'rgba(255,241,168,0.28)';
      ctx.strokeRect(x - doorW * 0.2, baseY - Math.max(4, 7 * scale), doorW * 1.4, Math.max(5, 9 * scale));
      ctx.fillStyle = selected ? '#fff1a8' : (locked ? '#8b8794' : target.color);
      ctx.font = `bold ${Math.max(7, 12 * scale)}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText(locked ? 'LOCK' : target.short, p.x, y - 6);
      if (p.depth < 1.25 && !locked) {
        ctx.font = 'bold 9px Courier New';
        ctx.fillText('ENTREE / CLIC', p.x, y + doorH + 12);
      }
    });
  },

  getCircusZoneSprites(zoneId) {
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
        { name: 'Cube Gloink', type: 'npc', avatar: 'gloinkcube', x: 1.45, z: -1.55, color: '#2fb642', sizeScale: 0.72 }
      ],
      4: [
        { name: 'Kaufmo', type: 'abstract', avatar: 'kaufmo', x: 0, z: -2.25, color: '#111111', sizeScale: 1.18 },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.4, z: -1.7, color: '#e53935' },
        { name: 'Gloink Round', type: 'npc', avatar: 'gloinkround', x: 1.55, z: -1.75, color: '#c4b62d', sizeScale: 0.72 }
      ],
      6: [
        { name: 'Gummigoo', type: 'gummigoo', avatar: 'gummigoo', x: -1.05, z: -2.2, color: '#d8a23a' },
        { name: 'Max', type: 'gummigoo', avatar: 'max', x: 0.2, z: -2.55, color: '#75bd3f' },
        { name: 'Chad', type: 'gummigoo', avatar: 'chad', x: 1.25, z: -2.25, color: '#8bd64a' },
        { name: 'Princess Loolilalu', type: 'npc', avatar: 'loolilalu', x: -2.35, z: -1.55, color: '#ff9ad5' },
        { name: 'The Fudge', type: 'npc', avatar: 'fudge', x: 2.35, z: -1.55, color: '#7a3d1a', sizeScale: 1.2 },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 0.75, z: -1.3, color: '#e53935' }
      ],
      7: [
        { name: 'Gummigoo Data Echo', type: 'gummigoo', avatar: 'gummigoo', x: -1.5, z: -2.3, color: '#d8a23a' },
        { name: 'C&A Mannequin', type: 'mannequin', avatar: 'mannequin', x: 0.1, z: -2.05, color: '#d8d8d8' },
        { name: 'Additional Voices', type: 'mannequin', avatar: 'additionalvoices', x: 1.65, z: -2.5, color: '#d78aff' }
      ],
      8: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -1.35, z: -2.2, color: '#d9d0a2' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 0.2, z: -2.45, color: '#e53935' },
        { name: 'Ghost', type: 'ghost', avatar: 'horrorghost', x: 1.65, z: -1.55, color: '#7df0ff' },
        { name: 'Mildenhall Monster', type: 'abstract', avatar: 'horrormonster', x: 2.55, z: -2.25, color: '#f2f2f2', sizeScale: 1.22 },
        { name: 'Possessed Pomni', type: 'pomni', avatar: 'horrorpomnivoid', x: -2.55, z: -1.45, color: '#1b1b1b' }
      ],
      9: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -0.9, z: -2.1, color: '#d9d0a2' },
        { name: 'Pomni', type: 'pomni', avatar: 'horrorpomniskull', x: 0.85, z: -2.35, color: '#ffb32c' },
        { name: 'Ghost', type: 'ghost', avatar: 'horrorghost', x: 2.1, z: -1.65, color: '#7df0ff' }
      ],
      10: [
        { name: 'Work Gangle', type: 'gangle', avatar: 'workgangle', x: -0.75, z: -2.1, color: '#f7f7f7' },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: 0.65, z: -2.4, color: '#e53935' },
        { name: 'Max Customer', type: 'npc', avatar: 'max', x: -2.25, z: -1.5, color: '#75bd3f' },
        { name: 'Ming', type: 'mannequin', avatar: 'ming', x: 1.85, z: -1.65, color: '#b7c7d8' }
      ],
      11: [
        { name: 'Orbsman', type: 'npc', avatar: 'orbsman', x: -1.75, z: -2.25, color: '#6dd8ff' },
        { name: 'Kawaii Gangle', type: 'gangle', avatar: 'ganglekawaii', x: -0.15, z: -2.45, color: '#ff9fcd' },
        { name: 'Evil Pomni', type: 'pomni', avatar: 'evilpomni', x: 1.35, z: -2.1, color: '#c12b3f' },
        { name: 'Evil Jax', type: 'jax', avatar: 'eviljax', x: 2.45, z: -1.45, color: '#7436c9' }
      ],
      12: [
        { name: 'Baseball Jax', type: 'jax', avatar: 'baseballjax', x: -2.55, z: -1.45, color: '#b874e8' },
        { name: 'Baseball Zooble', type: 'zooble', avatar: 'baseballzooble', x: -1.45, z: -2.2, color: '#f27ad3' },
        { name: 'Baseball Gangle', type: 'gangle', avatar: 'baseballgangle', x: -0.25, z: -2.5, color: '#d84747' },
        { name: 'Baseball Ragatha', type: 'ragatha', avatar: 'baseballragatha', x: 1.05, z: -2.2, color: '#6d86dd' },
        { name: 'Baseball Pomni', type: 'pomni', avatar: 'baseballpomni', x: 2.15, z: -1.55, color: '#4068e8' },
        { name: 'Baseball Kinger', type: 'kinger', avatar: 'baseballkinger', x: 0.75, z: -1.15, color: '#d7c9aa' }
      ],
      13: [
        { name: 'Jax', type: 'jax', avatar: 'jax', x: -1.5, z: -2.1, color: '#8a4fd6' },
        { name: 'Ragatha', type: 'ragatha', avatar: 'ragatha', x: 0.2, z: -2.45, color: '#d64545' },
        { name: 'Shadow Jax', type: 'jax', avatar: 'shadowjax', x: 1.75, z: -1.65, color: '#5cff86' }
      ],
      14: [
        { name: 'Beach Gangle', type: 'gangle', avatar: 'beachgangle', x: -1.55, z: -2.1, color: '#f7f7f7' },
        { name: 'Hunter Jax', type: 'jax', avatar: 'hunterjax', x: 0.25, z: -2.4, color: '#8a4fd6' },
        { name: 'Sun', type: 'npc', avatar: 'sun', x: 2.05, z: -1.65, color: '#ffd84a', sizeScale: 1.05 },
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -2.45, z: -1.4, color: '#e53935' }
      ],
      15: [
        { name: 'Ming', type: 'mannequin', avatar: 'ming', x: -1.65, z: -2.1, color: '#b7c7d8' },
        { name: 'The Machine', type: 'npc', avatar: 'themachine', x: 0.25, z: -2.55, color: '#7d4dff', sizeScale: 1.35 },
        { name: 'Additional Voices', type: 'mannequin', avatar: 'additionalvoices', x: 1.9, z: -1.65, color: '#d78aff' }
      ],
      16: [
        { name: 'Caine', type: 'caine', avatar: 'caine', x: -1.05, z: -2.25, color: '#ffd84a' },
        { name: 'Abel Mannequin', type: 'mannequin', avatar: 'abelmannequin', x: 0.6, z: -1.85, color: '#ff8a30' },
        { name: 'Abel Full Body', type: 'mannequin', avatar: 'abelfullbody', x: 1.85, z: -2.55, color: '#f08a28' },
        { name: 'The Machine', type: 'npc', avatar: 'themachine', x: -2.35, z: -1.45, color: '#7d4dff', sizeScale: 1.25 }
      ],
      17: [
        { name: 'Kinger', type: 'kinger', avatar: 'kinger', x: -1.25, z: -2.2, color: '#d9d0a2' },
        { name: 'Queenie Archive', type: 'kinger', avatar: 'queenie', x: 0.25, z: -2.55, color: '#f7eecb' },
        { name: 'Shadow Kinger', type: 'kinger', avatar: 'shadowkinger', x: 1.75, z: -1.75, color: '#d8d8d8' }
      ],
      18: [
        { name: 'Pomni', type: 'pomni', avatar: 'pomni', x: -1.8, z: -2.2, color: '#e53935' },
        { name: 'Caine', type: 'caine', avatar: 'caine', x: 0, z: -2.55, color: '#ffd84a' },
        { name: 'Bubble', type: 'bubble', avatar: 'bubble', x: 1.35, z: -2.15, color: '#f7f7ff' },
        { name: 'Ribbit Dream Signal', type: 'npc', avatar: 'ribbit', x: 2.35, z: -1.45, color: '#63d35f' },
        { name: 'Abel', type: 'mannequin', avatar: 'abelmannequin', x: -2.75, z: -1.35, color: '#ff8a30' }
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
      ]
    };
    return byZone[zoneId] || shared.slice(0, 4);
  },

  getCircusActiveZoneSprites(zoneId, state) {
    return this.getCircusZoneSprites(zoneId).map((sprite, index) => (
      this.applyCircusSpriteRoutine(sprite, index, zoneId, state)
    ));
  },

  getCircusSpriteRoutine(sprite, zoneId) {
    const avatar = sprite.avatar || sprite.type || "";
    if (avatar.startsWith("gloink")) return "swarm";
    if (["bubble", "horrorghost", "moon", "sun"].includes(avatar)) return "hover";
    if (avatar.includes("horror") || avatar.startsWith("shadow") || avatar === "kaufmo") return "tremble";
    if (["gummigoo", "max", "chad", "workgangle", "themachine", "additionalvoices", "ming"].includes(avatar)) return "patrol";
    if (["jax", "hunterjax", "baseballjax", "eviljax"].includes(avatar)) return "pace";
    if ([12, 14].includes(zoneId)) return "pace";
    return "idle";
  },

  applyCircusSpriteRoutine(sprite, index, zoneId, state) {
    const now = performance.now() / 1000;
    const routine = sprite.routine || this.getCircusSpriteRoutine(sprite, zoneId);
    const phase = index * 1.37 + zoneId * 0.23;
    const animated = { ...sprite, routine };
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
    return animated;
  },

  drawCircusImpostorSprites(ctx, w, h, state) {
    const sprites = this.getCircusActiveZoneSprites(state.currentZoneId, state)
      .map(sprite => ({ ...sprite, projected: this.projectCircusPoint(sprite, state, w, h) }))
      .filter(sprite => sprite.projected)
      .sort((a, b) => b.projected.depth - a.projected.depth);
    sprites.forEach(sprite => {
      const p = sprite.projected;
      const size = Math.max(16, 70 * p.scale * (sprite.sizeScale || 1));
      const baseY = (p.y || h * 0.58) - (sprite.bob || 0) * size;
      state.hotspots.push({
        kind: 'character',
        sprite,
        x: p.x - size * 0.42,
        y: baseY - size,
        w: size * 0.84,
        h: size,
        depth: p.depth
      });
      this.drawCircusImpostor(ctx, sprite.type, p.x, baseY, size, sprite.color, sprite.name, sprite.avatar, sprite.routine);
    });
  },

  drawCircusImpostor(ctx, type, x, baseY, size, color, label, avatar, routine = 'idle') {
    if (this.drawCircusWackyAvatar(ctx, avatar || type, x, baseY, size, label, color, routine)) return;

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
    ctx.fillStyle = color || '#fff1a8';
    ctx.font = `bold ${Math.max(6, size * 0.12)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText('IMG', 0, -size * 0.46);
    ctx.fillStyle = '#fff1a8';
    ctx.font = `${Math.max(6, size * 0.13)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -size * 1.05);
    ctx.fillStyle = '#7df0ff';
    ctx.font = `${Math.max(5, size * 0.09)}px Courier New`;
    ctx.fillText(`PNJ:${routine.toUpperCase()}`, 0, -size * 0.9);
    ctx.restore();
  },

  drawCircusWackyAvatar(ctx, avatar, x, baseY, size, label, color, routine = 'idle') {
    const spec = this.getCircusAvatarSheetSpec(avatar);
    const img = spec ? this.circusAvatarSheets?.[spec.sheet] : null;
    if (!spec || !img || !img.complete || !img.naturalWidth || !img.naturalHeight) return false;
    const frame = this.getCircusTransparentAvatarFrame(img, spec);
    if (!frame) return false;
    const drawH = size * (avatar === 'gloinkqueenscale' ? 1.35 : 1);
    const drawW = drawH * (frame.width / frame.height);
    const drawX = x - drawW / 2;
    const drawY = baseY - drawH;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.beginPath();
    ctx.ellipse(x, baseY + 4, Math.max(10, drawW * 0.36), Math.max(3, drawH * 0.075), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 8;
    ctx.drawImage(frame.canvas, Math.round(drawX), Math.round(drawY), Math.round(drawW), Math.round(drawH));
    ctx.shadowBlur = 0;
    ctx.fillStyle = color || '#fff1a8';
    ctx.font = `${Math.max(6, size * 0.13)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(label, x, drawY - 6);
    ctx.fillStyle = '#7df0ff';
    ctx.font = `${Math.max(5, size * 0.09)}px Courier New`;
    ctx.fillText(`PNJ:${routine.toUpperCase()}`, x, drawY + Math.max(5, size * 0.11));
    ctx.restore();
    return true;
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
    const boxH = choices.length ? 94 : 52;
    const boxY = h - boxH - 24;
    ctx.save();
    ctx.fillStyle = 'rgba(5, 2, 13, 0.86)';
    ctx.strokeStyle = '#fff1a8';
    ctx.lineWidth = 2;
    ctx.fillRect(margin, boxY, w - margin * 2, boxH);
    ctx.strokeRect(margin, boxY, w - margin * 2, boxH);
    ctx.fillStyle = '#fff1a8';
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'left';
    const text = state.interactionMessage;
    const words = text.split(' ');
    let line = '';
    let y = boxY + 17;
    let lineCount = 0;
    words.forEach(word => {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > w - margin * 2 - 20) {
        if (!choices.length || lineCount < 2) ctx.fillText(line, margin + 10, y);
        y += 13;
        lineCount++;
        line = word;
      } else {
        line = next;
      }
    });
    if (line && (!choices.length || lineCount < 3)) ctx.fillText(line, margin + 10, y);
    if (choices.length) {
      const optionTop = boxY + boxH - 38;
      const gap = 8;
      const optionW = Math.floor((w - margin * 2 - 20 - gap * (choices.length - 1)) / choices.length);
      choices.forEach((choice, index) => {
        const x = margin + 10 + index * (optionW + gap);
        state.hotspots.push({
          kind: 'dialogChoice',
          choiceIndex: index,
          x,
          y: optionTop,
          w: optionW,
          h: 26,
          depth: -1
        });
        ctx.fillStyle = 'rgba(255,241,168,0.12)';
        ctx.strokeStyle = index === 0 ? '#ffffff' : '#fff1a8';
        ctx.lineWidth = index === 0 ? 2 : 1;
        ctx.fillRect(x, optionTop, optionW, 26);
        ctx.strokeRect(x, optionTop, optionW, 26);
        ctx.fillStyle = '#fff1a8';
        ctx.font = 'bold 9px Courier New';
        ctx.textAlign = 'center';
        const label = `${index + 1}. ${choice.label}`.slice(0, 24);
        ctx.fillText(label, x + optionW / 2, optionTop + 17);
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
  },

  minimizeWindow(winId) {
    const win = this.windows[winId];
    if (win) {
      win.style.display = 'none';
      if (winId === 'simulations') {
        SoundManager.stopTheme();
      }
      this.updateTaskbar();
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
        win.style.height = 'calc(100% - 40px)';
        win.style.left = '0';
        win.style.top = '0';
      }
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
      return progress.includes(0); // Lock until Calibration Ep 0 completed (Pomni arrives in Ep 1)
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

    // Dynamic lore redaction if Episode 0 calibration is not completed (i.e. Abigail has not yet entered and been named Pomni)
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    let processedContent = content;
    if (!progress.includes(0)) {
      processedContent = processedContent.replace(/Pomni/g, "SUJET #042");
    }
    // Mask real name "Abigail" until Episode 9 (revelations) is completed
    if (!progress.includes(9)) {
      processedContent = processedContent.replace(/Abigail/g, "SUJET #042");
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

    ['comfort-reading', 'line-pause', 'easy-minigames', 'reader-only', 'crt-readable'].forEach(key => {
      const input = document.getElementById(`setting-${key}`);
      if (!input) return;
      input.checked = !!this.getCainOSSetting(key);
      input.addEventListener('change', () => {
        this.setCainOSSetting(key, input.checked);
        this.applyCainOSSettings();
        this.renderCainOSTools();
      });
    });

    ['audio-ambience', 'audio-glitch'].forEach(key => {
      const input = document.getElementById(`setting-${key}`);
      if (!input) return;
      input.value = String(this.getCainOSSetting(key, key === 'audio-ambience' ? 70 : 45));
      input.addEventListener('input', () => {
        this.setCainOSSetting(key, Number(input.value));
        this.applyCainOSSettings();
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

  applyCainOSSettings() {
    document.body.classList.toggle('comfort-reading', !!this.getCainOSSetting('comfort-reading'));
    document.body.classList.toggle('crt-readable', !!this.getCainOSSetting('crt-readable'));
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
      if (action === 'open-zone') {
        SoundManager.playClick();
        this.showCircusDosPreview();
        setTimeout(() => {
          this.enterCircusInteriorView();
          const zone = Number(button.getAttribute('data-zone'));
          if (Number.isFinite(zone)) this.setCircusSimulationZone(zone, true);
        }, 120);
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
  },

  resetCainOSKeys(pattern) {
    Object.keys(localStorage)
      .filter(key => pattern.test(key))
      .forEach(key => localStorage.removeItem(key));
  },

  exportCainOSSave() {
    const keys = Object.keys(localStorage).filter(key => /^tadc_|^cainos_/.test(key));
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
      { id: 11, ep: 5, name: 'Suggestion Box', desc: 'Micro-aventures et skins hors timeline principale.', item: 'Fiche suggestion', unlocked: unlocked(5) },
      { id: 13, ep: 6, name: 'Arena armes', desc: 'Epreuves virtuelles, scores et tensions de groupe.', item: 'Douille virtuelle', unlocked: unlocked(6) },
      { id: 14, ep: 7, name: 'Digital Lake', desc: 'Fausse pause, soleil dangereux et PNJ fragiles.', item: 'Coquillage digital', unlocked: unlocked(7) },
      { id: 16, ep: 8, name: 'C&A Core', desc: 'Couches techniques, Abel et origine tardive.', item: 'Pass admin', unlocked: unlocked(8) },
      { id: 17, ep: 8, name: 'Kinger Memory Buffer', desc: 'Souvenirs de Queenie sans restauration active.', item: 'Piece memoire', unlocked: unlocked(8) },
      { id: 18, ep: 9, name: 'Final Circus', desc: 'Brain scans, reves, couleur et choix de Pomni.', item: 'Fragment couleur', unlocked: unlocked(9) },
      { id: 19, ep: 9, name: 'Circus Members Archive', desc: 'Archives visuelles des membres disparus/secondaires.', item: 'Badge archive', unlocked: unlocked(9) }
    ];
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
    return this.getCainOSLoreZones().map(zone => ({
      name: zone.item,
      from: zone.name,
      zoneId: zone.id,
      unlocked: zone.unlocked && visited.includes(zone.id),
      desc: zone.unlocked ? 'Objet de scene utilisable comme preuve ou declencheur de dialogue.' : 'Objet masque pour eviter un spoiler de progression.'
    }));
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

  renderCainOSTools() {
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const visited = this.getCainOSVisitedZones();
    const renderCards = items => items.map(item => `
      <div class="tools-card ${item.unlocked === false || item.done === false ? 'locked' : ''} ${item.visited ? 'visited' : ''}">
        <div class="tools-card-title"><span>${this.escapeHTML(item.title || item.name)}</span><span>${this.escapeHTML(item.badge || item.level || '')}</span></div>
        <p>${this.escapeHTML(item.desc || item.text || '')}</p>
        ${item.meta ? `<div class="tools-pill-row">${item.meta.map(meta => `<span class="tools-pill">${this.escapeHTML(meta)}</span>`).join('')}</div>` : ''}
        ${item.actions ? `<div class="tools-pill-row">${item.actions.join('')}</div>` : ''}
      </div>
    `).join('');

    const mapEl = document.getElementById('tools-tab-map');
    if (mapEl) mapEl.innerHTML = `<div class="tools-grid">${renderCards(this.getCainOSLoreZones().map(zone => ({
      name: zone.name,
      desc: zone.unlocked ? zone.desc : 'Zone verrouillee par progression pour ne pas casser la timeline.',
      unlocked: zone.unlocked,
      visited: visited.includes(zone.id),
      badge: zone.unlocked ? (visited.includes(zone.id) ? 'VISITEE' : `EP${zone.ep}`) : 'LOCK',
      meta: [zone.item, zone.id === 11 ? 'Zone variantes / micro-aventures' : 'Timeline principale'],
      actions: zone.unlocked ? [
        `<button class="tools-pill tools-action" data-tools-action="open-zone" data-zone="${zone.id}">OUVRIR ZONE</button>`,
        Number.isFinite(zone.ep) && zone.ep > 0 ? `<button class="tools-pill tools-action" data-tools-action="open-episode" data-episode="${zone.ep}">EP${zone.ep}</button>` : ''
      ].filter(Boolean) : null
    })))}</div>`;

    const evidenceEl = document.getElementById('tools-tab-evidence');
    if (evidenceEl) evidenceEl.innerHTML = `<div class="tools-grid">${renderCards(this.getCainOSEvidence().map(entry => {
      const unlocked = progress.includes(entry.gate) || progress.some(ep => ep > entry.gate && ep <= 9);
      return {
        title: unlocked ? entry.title : 'Preuve verrouillee',
        desc: unlocked ? entry.text : 'Source masquee pour eviter un spoiler.',
        unlocked,
        badge: unlocked ? entry.tag : 'LOCK',
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
      const showPomni = progress.includes(0);

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
          "Son épouse Helen (Queenie) s'est abstraite sous ses yeux dans la cave.",
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

      const fullCastData = this.getFilteredWackyCastData();
      const character = fullCastData[this.activeWackyCast];
      if (character) {
        const facts = character.facts;
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
    return [
      { gate: 0, tag: 'BOOT', title: 'Session Pomni ouverte', text: 'Le protocole de calibration a ferme l ecran puis relance CainOS sur un bureau propre. Le Cirque devient accessible depuis la barre des taches.' },
      { gate: 1, tag: 'PILOT', title: 'Kaufmo abstrait et fausse sortie', text: 'Le pilote confirme le piege narratif : la porte de sortie existe comme illusion de scene, pas comme liberation fiable.' },
      { gate: 2, tag: 'NPC', title: 'Gummigoo et les donnees PNJ', text: 'Candy Canyon revele que certains personnages sont generes comme PNJ, avec une memoire suffisamment stable pour troubler Pomni.' },
      { gate: 3, tag: 'HORROR', title: 'Manoir Mildenhall et memoire de Kinger', text: 'L obscurite du manoir sert de zone de peur et de memoire. CainOS garde Queenie comme archive, pas comme residente revenue.' },
      { gate: 4, tag: 'SPUDSY', title: 'Masque de Gangle sous pression', text: 'Spudsy transforme le groupe en employes. Le masque de Gangle devient un systeme de comportement, pas seulement un costume.' },
      { gate: 5, tag: 'MICRO', title: 'Suggestions de Caine', text: 'Les micro-aventures doivent rester separees du canon principal : utiles pour les skins et variantes, dangereuses pour la timeline.' },
      { gate: 6, tag: 'TEAM', title: 'Epreuves armees et tensions de groupe', text: 'Les armes et scores sont des regles de simulation. CainOS suit surtout les ruptures de confiance et les roles imposes.' },
      { gate: 7, tag: 'LAKE', title: 'Lac digital et fausse pause', text: 'Le lac ressemble a une zone de repos, mais les PNJ, le soleil et les indices C&A gardent la scene sous controle.' },
      { gate: 8, tag: 'CORE', title: 'Couches C&A et origine tardive', text: 'Les traces techniques deviennent consultables seulement lorsque la progression rend ces informations moins spoiler.' },
      { gate: 9, tag: 'FINAL', title: 'Pomni choisit son nom actif', text: 'Le final autorise les donnees Abigail/Abby, mais la timeline jouable continue de traiter Pomni comme identite active dans le Cirque.' }
    ];
  },

  renderCainOSJournal() {
    const list = document.getElementById('watch-journal-list');
    const count = document.getElementById('watch-journal-count');
    if (!list) return;
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const entries = this.getCainOSJournalEntries();
    const visible = entries.map(entry => ({
      ...entry,
      unlocked: progress.includes(entry.gate) || progress.some(ep => ep > entry.gate && ep <= 9)
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
    const showPomni = progress.includes(0);
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
      kaufmo: { name: "Kaufmo", age: "Abstrait", stress: "100%", avatar: "kaufmo", signal: "!", color: "#111111", facts: [
        "Dernier etat connu : abstraction complete.",
        "La cave de Caine contient encore son empreinte de collision.",
        "Ses anciens marqueurs comiques ne repondent plus aux pings."
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
      additionalvoices: { name: "Additional Voices", age: "NPC", stress: "13%", avatar: "additionalvoices", signal: "V", color: "#d78aff", facts: [
        "Mannequin rose/violet sans visage, archive sous son nom de fiche : Additional Voices.",
        "Sa pose appuyee contre une console sert a le distinguer des mannequins blancs generiques.",
        "CainOS le classe comme personnage de fond, pas comme Abel."
      ]},
      ming: { name: "Ming", age: "NPC", stress: "27%", avatar: "ming", signal: "M", color: "#b7c7d8", facts: [
        "Mannequin gris argente avec visage noir, grands yeux blancs et petit chapeau bleu clair.",
        "CainOS le separe d Abel grace a sa palette froide et son regard rond.",
        "Classe comme personnage de fond lie aux mannequins, pas comme archive Abel."
      ]},
      themachine: { name: "The Machine", age: "NPC Objet", stress: "58%", avatar: "themachine", signal: "T", color: "#7d4dff", facts: [
        "Boite-machine violette avec yeux globuleux, bouche ouverte, cables et calculatrice bleue.",
        "CainOS la classe comme objet vivant de decor actif, pas comme mannequin.",
        "La grande bouche sombre et le corps en carton restent les marqueurs visuels principaux."
      ]},
      abel: { name: "Abel", age: "Archive", stress: "88%", avatar: "abel", signal: "A", color: "#66ccff", facts: [
        "Profil d acces lie aux archives finales du projet CainOS.",
        "Sa silhouette est volontairement rendue comme un avatar admin.",
        "Le terminal marque ses donnees comme reconstruites."
      ]},
      abelmannequin: { name: "Abel Mannequin", age: "Archive", stress: "64%", avatar: "abelmannequin", signal: "M", color: "#ff7a1a", facts: [
        "Version mannequin orange sans visage, proche du corps generique montre en reference.",
        "Les articulations et la posture raide gardent l aspect pantin de test.",
        "CainOS la classe comme forme physique archivee d Abel."
      ]},
      abelfullbody: { name: "Abel Full Body", age: "Archive", stress: "42%", avatar: "abelfullbody", signal: "F", color: "#f08a28", facts: [
        "Version full body orange avec visage souriant simple.",
        "Le corps articule reste proche du mannequin, mais avec identite faciale lisible.",
        "Archivee comme deuxieme rendu d Abel, separee du mannequin sans visage."
      ]},
      moon: { name: "Moon", age: "Decor", stress: "??", avatar: "moon", signal: "M", color: "#d6d6ff", facts: [
        "Entite celeste associee aux routines absurdes de Caine.",
        "CainOS la garde dans la section decor actif.",
        "Son visage est reduit a un croissant de pixels."
      ]},
      sun: { name: "Sun", age: "Decor", stress: "99%", avatar: "sun", signal: "S", color: "#ffd84a", facts: [
        "Source lumineuse agressive dans les logs du lac digital.",
        "Ses rayons peuvent etre interpretes comme routines de purge.",
        "Le rendu pixel-art garde un avertissement thermique."
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
      maidjax: { name: "Maid Jax", age: "Variante fan", stress: "42%", avatar: "maidjax", signal: "J", color: "#c88aff", facts: [
        "Variante maid de Jax basee sur la reference que tu as fournie.",
        "Le grand corps de lapin et les yeux jaunes restent conserves.",
        "CainOS la range dans les costumes, hors progression narrative."
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
      beachgangle: { name: "Beach Gangle", age: "Variante fan", stress: "21%", avatar: "beachgangle", signal: "B", color: "#6fb8ff", facts: [
        "Variante plage de Gangle inspiree de ta reference soleil et parasol.",
        "Le grand chapeau, le bleu estival et les rubans rouges gardent la lecture immediate.",
        "CainOS la marque comme skin vacances, hors aventure principale."
      ]},
      japanesegangle: { name: "Japanese Gangle", age: "Variante fan", stress: "34%", avatar: "japanesegangle", signal: "G", color: "#f05c6a", facts: [
        "Variante uniforme japonais de Gangle avec ambiance cerisiers.",
        "Le masque et les rubans restent prioritaires sur le costume.",
        "Archivee comme version anime/school, pas comme nouvel etat canon."
      ]},
      rhinogangle: { name: "Rhino Gangle", age: "Variante fan", stress: "67%", avatar: "rhinogangle", signal: "N", color: "#e8e1d6", facts: [
        "Variante rhino de Gangle basee sur la silhouette a corne que tu as montree.",
        "La tete blanche et le corps ressort gardent une lecture volontairement bizarre.",
        "CainOS la range dans les costumes experimentaux."
      ]},
      workgangle: { name: "Work Gangle", age: "Variante fan", stress: "74%", avatar: "workgangle", signal: "W", color: "#477da8", facts: [
        "Variante travail de Gangle en chemise bleue et pantalon sombre.",
        "Le badge et la posture fatiguee rappellent le rendu manager.",
        "Classee comme skin bureau, pas comme progression narrative."
      ]},
      japanesejax: { name: "Japanese Jax", age: "Variante fan", stress: "52%", avatar: "japanesejax", signal: "J", color: "#7c55df", facts: [
        "Version anime school de Jax avec blazer sombre et cravate.",
        "Les oreilles violettes et les yeux jaunes gardent l identite du profil.",
        "CainOS la lie a Jax comme costume alternatif."
      ]},
      japaneseragatha: { name: "Japanese Ragatha", age: "Variante fan", stress: "40%", avatar: "japaneseragatha", signal: "R", color: "#e85b58", facts: [
        "Version anime school de Ragatha avec uniforme et cheveux rouges.",
        "Le bouton et le sourire doux restent les reperes du personnage.",
        "Archivee comme variante scolaire fan."
      ]},
      japanesepomni: { name: "Japanese Pomni", age: "Variante fan", stress: "89%", avatar: "japanesepomni", signal: "P", color: "#4a8dff", facts: [
        "Version anime school de Pomni avec uniforme et details de bouffon.",
        "La petite silhouette inquiete reste volontairement conservee.",
        "CainOS la garde comme variante visuelle non canonique."
      ]},
      japanesekinger: { name: "Japanese Kinger", age: "Variante fan", stress: "96%", avatar: "japanesekinger", signal: "K", color: "#e5cf99", facts: [
        "Version anime school de Kinger avec sac et uniforme.",
        "La piece d echecs et la couronne restent les marqueurs principaux.",
        "Le stress reste haut meme en uniforme scolaire."
      ]},
      japanesezooble: { name: "Japanese Zooble", age: "Variante fan", stress: "69%", avatar: "japanesezooble", signal: "Z", color: "#f06cb8", facts: [
        "Version anime school de Zooble avec pieces modulaires et sac.",
        "La tete angulaire et les membres incompatibles restent visibles.",
        "Classee skin scolaire fan dans CainOS."
      ]},
      japanesegummigoo: { name: "Japanese Gummigoo", age: "Variante fan", stress: "43%", avatar: "japanesegummigoo", signal: "Y", color: "#78c84a", facts: [
        "Version anime school de Gummigoo avec uniforme et touches candy-western.",
        "La silhouette alligator reste differente de Max et Chad.",
        "Archivee comme variante fan liee au groupe gummy."
      ]},
      baseballjax: { name: "Baseball Jax", age: "Variante fan", stress: "46%", avatar: "baseballjax", signal: "B", color: "#b874e8", facts: [
        "Variante baseball de Jax avec uniforme rose, casquette bleue et gant jaune.",
        "Les longues oreilles et le sourire moqueur restent les reperes du profil.",
        "CainOS la classe comme costume sportif fan."
      ]},
      baseballzooble: { name: "Baseball Zooble", age: "Variante fan", stress: "64%", avatar: "baseballzooble", signal: "O", color: "#f27ad3", facts: [
        "Variante baseball de Zooble avec casquette bleue et membres sportifs depareilles.",
        "La tete angulaire et les pieces incompatibles restent visibles.",
        "Le module radar la lie a Zooble malgre l equipement."
      ]},
      baseballgangle: { name: "Baseball Gangle", age: "Variante fan", stress: "78%", avatar: "baseballgangle", signal: "G", color: "#d84747", facts: [
        "Variante baseball de Gangle avec casquette bleue et jersey leger.",
        "Le corps reste un ruban rouge, pas des jambes humaines.",
        "CainOS garde l expression triste du masque comme signature."
      ]},
      baseballragatha: { name: "Baseball Ragatha", age: "Variante fan", stress: "36%", avatar: "baseballragatha", signal: "R", color: "#6d86dd", facts: [
        "Variante baseball de Ragatha en robe uniforme bleue avec batte.",
        "Les cheveux rouges et l oeil bouton restent le point d ancrage.",
        "Archivee comme skin match, hors episode interactif principal."
      ]},
      baseballpomni: { name: "Baseball Pomni", age: "Variante fan", stress: "91%", avatar: "baseballpomni", signal: "P", color: "#4068e8", facts: [
        "Variante baseball de Pomni avec casquette bleue et tenue compacte.",
        "La silhouette de bouffon reste visible sous l equipement sportif.",
        "Le stress CainOS reste eleve meme pendant le match."
      ]},
      baseballkinger: { name: "Baseball Kinger", age: "Variante fan", stress: "99%", avatar: "baseballkinger", signal: "K", color: "#d7c9aa", facts: [
        "Variante baseball de Kinger avec casquette et gant.",
        "La piece d echecs haute et les yeux paniques restent prioritaires.",
        "CainOS recommande de ne pas lui confier la strategie de l equipe."
      ]},
      rivalbaseballzooble: { name: "Rival Baseball Zooble", age: "Variante fan", stress: "72%", avatar: "rivalbaseballzooble", signal: "Z", color: "#f5d33b", facts: [
        "Variante equipe adverse de Zooble en couleurs jaune, bleu et rose.",
        "Les pieces modulaires restent volontairement asymetriques.",
        "CainOS la distingue du costume baseball principal par son signal rival."
      ]},
      rivalbaseballpomni: { name: "Rival Baseball Pomni", age: "Variante fan", stress: "94%", avatar: "rivalbaseballpomni", signal: "P", color: "#d7382f", facts: [
        "Variante equipe adverse de Pomni avec uniforme jaune et rouge.",
        "Le regard plus determine rappelle le camp oppose.",
        "Le profil reste un skin fan, pas une nouvelle Pomni."
      ]},
      rivalbaseballpinkgiant: { name: "Rival Baseball Pink Giant", age: "Variante fan", stress: "59%", avatar: "rivalbaseballpinkgiant", signal: "G", color: "#f05a9f", facts: [
        "Gros joueur rose de l equipe adverse, separe de Gangle dans CainOS.",
        "Son corps rond segmente reste lisse, sans armure ni epaulettes.",
        "La fiche corrige l ancien amalgame avec Gangle."
      ]},
      rivalbaseballragatha: { name: "Rival Baseball Ragatha", age: "Variante fan", stress: "44%", avatar: "rivalbaseballragatha", signal: "R", color: "#e86493", facts: [
        "Variante equipe adverse de Ragatha en uniforme rose.",
        "Les cheveux bleus et l oeil bouton gardent l identite de ce costume.",
        "Archivee comme skin rival baseball."
      ]},
      rivalbaseballjax: { name: "Rival Baseball Jax", age: "Variante fan", stress: "50%", avatar: "rivalbaseballjax", signal: "J", color: "#7a244d", facts: [
        "Variante equipe adverse de Jax avec peau bordeaux et tenue bleue.",
        "Pas de chapeau : les longues oreilles restent visibles.",
        "CainOS l associe au camp oppose du match."
      ]},
      rivalbaseballkinger: { name: "Rival Baseball Kinger", age: "Variante fan", stress: "99%", avatar: "rivalbaseballkinger", signal: "Q", color: "#8e8f9b", facts: [
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
      horrorghost: { name: "Horror Ghost Lady", age: "Entite spectrale", stress: "??", avatar: "horrorghost", signal: "H", color: "#58fff0", facts: [
        "Fantome cyan a grand chapeau, archivee comme presence spectrale de manoir.",
        "Les yeux blancs et le contour lumineux gardent l aspect apparition.",
        "CainOS la traite comme entite d ambiance, pas comme membre du cirque."
      ]},
      horrormonster: { name: "Horror Screaming Monster", age: "Anomalie", stress: "100%", avatar: "horrormonster", signal: "M", color: "#f2f2f2", facts: [
        "Monstre au masque blanc avec bouche verticale et dents multiples.",
        "Les yeux spirales et les traces rouges servent de signal panique.",
        "Archive CainOS creee pour les sequences horror non gore."
      ]},
      horrorpomnivoid: { name: "Horror Pomni Void-Eyes", age: "Variante cauchemar", stress: "100%", avatar: "horrorpomnivoid", signal: "V", color: "#1b1b1b", facts: [
        "Pomni horrifique avec grands yeux noirs et larmes d ombre.",
        "Les deux accessoires ronds rappellent la scene de manoir sans changer son identite.",
        "Classee projection de peur, pas vraie transformation definitive."
      ]},
      horrorpomnispiral: { name: "Horror Pomni Spiral-Eyes", age: "Variante cauchemar", stress: "100%", avatar: "horrorpomnispiral", signal: "O", color: "#ff8a18", facts: [
        "Pomni corrompue par des yeux spirales lumineux et un sourire trop large.",
        "Le rouge, bleu et jaune restent visibles sous la lumiere verte et orange.",
        "CainOS l utilise pour les moments ou le systeme accentue la menace."
      ]},
      horrorpomniskull: { name: "Horror Pomni Skull-Mask", age: "Variante cauchemar", stress: "98%", avatar: "horrorpomniskull", signal: "K", color: "#ffb32c", facts: [
        "Pomni avec masque jaune-orange, yeux noirs tombants et petites dents serrees.",
        "La silhouette de bouffon reste lisible malgre le visage skull.",
        "Skin horrifique separe des versions Shadow et Evil."
      ]},
      hunterjax: { name: "Hunter Jax", age: "Variante fan", stress: "47%", avatar: "hunterjax", signal: "H", color: "#c4a45f", facts: [
        "Variante chasseur de Jax avec tenue beige, chapeau et posture de traque.",
        "Les longues oreilles, la peau violette et le regard jaune gardent son identite.",
        "CainOS la classe comme costume d aventure, pas comme nouveau Jax."
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
      ]}
    };

    return castData;
  },

  getEpisodeCastKeys(episodeNum) {
    const episodeCastMap = {
      "-2": [
        "abel", "abelmannequin", "abelfullbody", "caine", "bubble", "sun", "moon"
      ],
      "-1": [
        "kinger", "queenie", "caine", "abel", "abelmannequin", "abelfullbody", "shadowkinger"
      ],
      0: [
        "mannequin", "themachine"
      ],
      1: [
        "pomni", "caine", "bubble", "jax", "ragatha", "kinger", "gangle", "zooble", "kaufmo",
        "gloinkqueen", "gloinkqueenscale", "gloinkstar", "gloinkcube", "gloinkpyramid", "gloinkcrescent", "gloinkpin", "gloinkround",
        "mannequin", "moon", "sun"
      ],
      2: [
        "pomni", "caine", "bubble", "jax", "ragatha", "kinger", "gangle", "zooble",
        "gummigoo", "max", "chad", "loolilalu", "fudge", "japanesegummigoo"
      ],
      3: [
        "pomni", "jax", "ragatha", "kinger", "gangle", "zooble", "caine", "bubble",
        "horrorghost", "horrormonster", "horrorpomnivoid", "horrorpomnispiral", "horrorpomniskull",
        "shadowpomni", "shadowkinger", "shadowjax", "shadowcaine"
      ],
      4: [
        "gangle", "workgangle", "ganglekawaii", "ganglecomedy", "gangletragedy", "pomni", "jax", "ragatha", "kinger", "zooble", "caine", "bubble"
      ],
      5: [
        "caine", "bubble", "pomni", "jax", "ragatha", "kinger", "gangle", "zooble",
        "orbsman", "evilorbsman", "evilpomni", "eviljax", "evilragatha", "evilkinger", "evilzooble", "shadowcaine"
      ],
      6: [
        "jax", "hunterjax", "pomni", "ragatha", "kinger", "gangle", "zooble", "caine",
        "baseballjax", "baseballzooble", "baseballgangle", "baseballragatha", "baseballpomni", "baseballkinger",
        "rivalbaseballzooble", "rivalbaseballpomni", "rivalbaseballpinkgiant", "rivalbaseballragatha", "rivalbaseballjax", "rivalbaseballkinger"
      ],
      7: [
        "gangle", "beachgangle", "pomni", "jax", "hunterjax", "ragatha", "kinger", "zooble", "caine", "bubble"
      ],
      8: [
        "kinger", "queenie", "caine", "bubble", "pomni", "ragatha", "jax",
        "japanesekinger", "evilkinger", "shadowkinger", "horrorghost", "abel", "abelmannequin", "abelfullbody"
      ],
      9: [
        "pomni", "caine", "bubble", "abel", "abelmannequin", "abelfullbody", "mannequin", "additionalvoices", "ming", "themachine",
        "shadowpomni", "shadowcaine", "shadowjax", "shadowragatha", "shadowgangle", "shadowzooble"
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
      gloinkqueen: { episode: 1, subepisode: 4 },
      gloinkqueenscale: { episode: 1, subepisode: 4 },
      gloinkstar: { episode: 1, subepisode: 4 },
      gloinkcube: { episode: 1, subepisode: 4 },
      gloinkpyramid: { episode: 1, subepisode: 4 },
      gloinkcrescent: { episode: 1, subepisode: 4 },
      gloinkpin: { episode: 1, subepisode: 4 },
      gloinkround: { episode: 1, subepisode: 4 },
      gummigoo: { episode: 2, subepisode: 3 },
      max: { episode: 2, subepisode: 3 },
      chad: { episode: 2, subepisode: 3 },
      loolilalu: { episode: 2, subepisode: 1 },
      fudge: { episode: 2, subepisode: 6 },
      horrorghost: { episode: 3, subepisode: 1 },
      horrormonster: { episode: 3, subepisode: 2 },
      horrorpomnivoid: { episode: 3, subepisode: 5 },
      horrorpomnispiral: { episode: 3, subepisode: 5 },
      horrorpomniskull: { episode: 3, subepisode: 5 },
      maxspudsy: { episode: 4, subepisode: 4 },
      orbsman: { episode: 5, subepisode: 6 },
      evilorbsman: { episode: 5, subepisode: 6 },
      evilpomni: { episode: 5, subepisode: 6 },
      eviljax: { episode: 5, subepisode: 6 },
      evilragatha: { episode: 5, subepisode: 6 },
      evilkinger: { episode: 5, subepisode: 6 },
      evilzooble: { episode: 5, subepisode: 6 },
      ming: { episode: 6, subepisode: 7 },
      beachgangle: { episode: 7, subepisode: 1 },
      hunterjax: { episode: 7, subepisode: 1 },
      abel: { episode: 7, subepisode: 3 },
      abelmannequin: { episode: 7, subepisode: 3 },
      abelfullbody: { episode: 7, subepisode: 3 },
      queenie: { episode: 8, subepisode: 1 },
      scratch: { episode: 8, subepisode: 5 },
      ribbit: { episode: 9, subepisode: 2 },
      wormo: { episode: 9, subepisode: 2 },
      bizco: { episode: 9, subepisode: 2 },
      rattie: { episode: 9, subepisode: 2 },
      spike: { episode: 9, subepisode: 2 },
      pinkcyclops: { episode: 9, subepisode: 2 },
      yellowclown: { episode: 9, subepisode: 2 },
      oyster: { episode: 9, subepisode: 2 },
      bulbcreature: { episode: 9, subepisode: 2 }
    };

    if (id.includes("baseball") || id.includes("rivalbaseball")) return { episode: 6, subepisode: 1 };
    if (id.startsWith("shadow")) return { episode: 3, subepisode: 1 };
    if (id.startsWith("japanese")) return { episode: 3, subepisode: 0 };
    if (id.includes("gangle") && (id.includes("kawaii") || id.includes("comedy") || id.includes("tragedy"))) return { episode: 4, subepisode: 0 };
    if (id.includes("maid") || id.includes("jaxgirl") || id.includes("darkduo")) return { episode: 4, subepisode: 0 };
    if (id.startsWith("gloink")) return { episode: 1, subepisode: 4 };
    return gates[id] || null;
  },

  getWackyProfileStatus(id) {
    const archiveIds = new Set([
      'kaufmo', 'queenie', 'ribbit', 'scratch', 'wormo', 'bizco', 'rattie', 'spike',
      'pinkcyclops', 'yellowclown', 'oyster', 'bulbcreature', 'abel', 'abelmannequin', 'abelfullbody'
    ]);
    const variantSignals = ['evil', 'shadow', 'maid', 'japanese', 'baseball', 'rivalbaseball', 'darkduo', 'kawaii', 'comedy', 'tragedy', 'hunter', 'beach', 'rhino', 'work', 'jaxgirl'];
    if (archiveIds.has(id)) return "ARCHIVE";
    if (variantSignals.some(token => id.includes(token))) return "VARIANTE";
    if (id.startsWith("gloink") || ['gummigoo', 'max', 'chad', 'loolilalu', 'fudge', 'orbsman', 'ming', 'mannequin', 'additionalvoices', 'themachine', 'sun', 'moon'].includes(id)) return "PNJ / DECOR";
    return "ACTIF";
  },

  isWackyProfileUnlocked(id) {
    if (this.getPurchasedWackySkins().includes(id)) return true;
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

  isFanSkin(id, char = null) {
    const data = char || this.getWackyCastData()[id];
    if (!data) return false;
    return /variante fan/i.test(String(data.age || "")) || ['maid', 'japanese', 'baseball', 'rivalbaseball', 'darkduo', 'beach', 'rhino', 'work', 'jaxgirl', 'hunter'].some(token => id.includes(token));
  },

  getWackyLoreStatus(id, char = null) {
    const data = char || this.getWackyCastData()[id] || {};
    const status = String(data.status || this.getWackyProfileStatus(id) || '').toUpperCase();
    const age = String(data.age || '').toUpperCase();
    if (!this.isWackyProfileUnlocked(id)) return "VERROUILLE PAR PROGRESSION";
    if (this.isFanSkin(id, data)) return "SKIN FAN / HORS TIMELINE";
    if (status.includes("VARIANTE")) return "VARIANTE VISUELLE";
    if (status.includes("ARCHIVE") || age.includes("ARCHIVE") || age.includes("ABSTRAIT")) return "ARCHIVE CAINOS";
    if (status.includes("PNJ") || age.includes("NPC") || age.includes("DECOR")) return "PNJ / DECOR DE SIMULATION";
    return "TIMELINE ACTIVE";
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
      const haystack = `${id} ${char.name || ''} ${char.signal || ''} ${status}`.toLowerCase();
      if (query && !haystack.includes(query)) return false;
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
    const showPomni = progress.includes(0);

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
      kinger: { name: "Kinger", age: "48", stress: "98%", avatar: "kinger", facts: [
        "Son épouse Helen (Queenie) s'est abstraite sous ses yeux dans la cave.",
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
      fudge: [0, 2], gloinkqueen: [1, 2], mannequin: [2, 2], abel: [3, 2], moon: [4, 2], sun: [5, 2]
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
    const profileId = id || this.activeWackyCast;
    this.activeWackyCast = profileId;
    document.getElementById('watch-profile-name').innerText = char.name;
    const statusEl = document.getElementById('watch-profile-status');
    if (statusEl) statusEl.innerText = char.status || "ACTIF";
    document.getElementById('watch-profile-age').innerText = char.age;
    document.getElementById('watch-profile-stress').innerText = char.stress;
    const loreEl = document.getElementById('watch-profile-lore');
    if (loreEl) loreEl.innerText = this.getWackyLoreStatus(profileId, char);
    document.getElementById('watch-profile-fact').innerText = char.facts[0];

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
          content: `ARTHUR OVERRIDE PROTOCOL v0.9 (${yearUsed})

Je m'appelle Arthur. Charles a conçu le simulateur pour dissimuler ses expériences neuronales secrètes.
Caine n'est qu'un démon de rendu graphique autonome devenu fou. J'ai conçu cette commande de sécurité.
Abigail (Pomni), si tu lis ceci sur l'écran d'administration... débranche le PORT NEURAL 3 sur la machine physique.
Ne coupe pas le disjoncteur général, la liaison synaptique détruirait ton cerveau !
Adieu. - Arthur (Kinger)

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
        const subjectHelpName = progressHelp.includes(0) ? "Pomni" : "#042";
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
          outputEl.innerHTML += `<span class="green-text">INITIALISATION DU CONTOURNEMENT SYNAPTIQUE...
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
Arthur (Kinger) : "Abigail, le signal de forçage a été injecté.
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
        const subjectIdName = progressVit.includes(0) ? "POMNI" : "INCONNU";
        const civilName = progressVit.includes(9) ? "Abigail" : "[VERROUILLÉ]";
        response = `SUJET VITALS DIAGNOSTICS:
  ID : #042 (${subjectIdName})
  Nom Civil suspecté : ${civilName}
  Fréquence Cardiaque : ${Math.round(82 + Math.random()*15)} bpm (Panique active)
  Couplage Neuronal : 87.4%
  Statut EEG : Ondes Thêta désordonnées (Porte de sortie fantôme détectée)`;
        break;

      case 'caine':
        SoundManager.playGlitch();
        const hasEp9 = (typeof EpisodeManager !== 'undefined') && EpisodeManager.getProgress().includes(9);
        const subName = hasEp9 ? "Abigail" : "SUJET #042";
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
          this.triggerBubbleIntrusion();
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
