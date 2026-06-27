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
        content: `MAINFRAME SUBJECT MAPPING - CORRESPONDANCE VIE RÉELLE
ID      | Avatar  | Nom Civil | Rôle C&A / Profil
#001    | Kinger  | Arthur    | Lead Tech, Co-concepteur de la simulation.
#002    | Queenie | Helen     | Designer Graphique, épouse d'Arthur (ABSTRAITE).
#008    | Ragatha | Rachel    | Testeuse QA senior, chargée des colliders.
#014    | Jax     | Jesse     | Stagiaire technique, connu pour casser le code.
#033    | Zooble  | Zoe       | Technicienne matèriel, concepteur du casque v1.
#039    | Gangle  | Grace     | Graphiste UI, modélisatrice des émotions.
#042    | Pomni   | Sarah     | Secrétaire de direction, a trouvé le casque allumé.`
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
L'IA R.I.N.G.M.A.S.T.E.R sature le CPU en générant des mini-aventures à haute vitesse pour vider la Suggestion Box.
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
        content: `JOURNAL D'ARTHUR (KINGER) - LA VÉRITÉ
Écrit lors d'un moment de lucidité extrême.

Si vous lisez ceci, vous devez comprendre :
IL N'Y A PAS D'HUMAINS DANS LE CIRQUE DIGITAL.
Le casque VR d'origine n'a pas transféré nos esprits. Il a effectué un scan synaptique complet et destructif à 100% de notre cerveau (Brain Scan).
Les vrais Arthur, Helen, Sarah, Zoe... sont rentrés chez eux ou sont morts dans les laboratoires de C&A il y a des années.
Nous ne sommes que des répliques de données numériques, des fantômes de code qui tournent en boucle. C'est pour cela que Caine ne peut pas nous faire sortir : on ne peut pas déconnecter un programme d'un ordinateur.
Notre seule issue est de forcer l'override synaptique d'Abel pour détruire le serveur physique et éteindre nos consciences.`
      },
      {
        name: 'abel_kernel_patch.exe.enc',
        content: `[DONNÉES ENCRIPTÉES PAR LE PARE-FEU CAINE]
Noyau de contournement synaptique compilé par Arthur avant sa disparition.
Exécutez la commande 'decrypt abel_kernel_patch.exe.enc' dans le Terminal C&A pour forcer la clé d'accès et décoder les instructions.`
      }
    ],
    system_logs: [
      {
        name: 'vitals_pomni.log',
        content: `STATUT SUJET #042

Nom civil : Sarah
Âge : 25 ans
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
- "Je veux voir ma famille" (Sarah) -> Ignoré (Raison : Pas drôle)
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
  radarAnimationId: null,
  wasShutdownByCalibration: false,

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
    this.setupIntrusionTriggers();
    this.updateDiagnosticsUI();
    this.applySystemStateUI();
  },

  applyButtonTooltips() {
    const tooltips = {
      'boot-init-button': 'Ouvrir une session CainOS.',
      'btn-back-to-files': 'Revenir a la liste des fichiers C&A.',
      'btn-start-simulation': 'Lancer le transcript ou le mini-jeu de l episode selectionne.',
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
      'btn-story-speed': 'Changer la vitesse de defilement du transcript.',
      'btn-story-skip': 'Ignorer le reste du transcript et acceder a l etape suivante.',
      'btn-story-next': 'Afficher la ligne suivante ou continuer la sequence.',
      'btn-story-micro-action': 'Demarrer l objectif interactif du sous-episode.',
      'btn-retry-simulation': 'Recommencer la simulation apres un echec.',
      'btn-victory-continue': 'Valider la simulation terminee et enregistrer la progression.',
      'watch-btn-cast': 'Afficher les profils des personnages suivis par CainOS.',
      'watch-btn-radar': 'Afficher le radar du Vide et les signaux detectes.',
      'watch-btn-refresh-fact': 'Afficher un autre fait Wacky Watch sur ce personnage.',
      'watch-btn-ping': 'Envoyer un ping de rappel Caine dans le radar.',
      'start-btn': 'Ouvrir le menu C&A Start.',
      'dialog-close-x': 'Fermer cette fenetre de dialogue.',
      'dialog-btn-ok': 'Confirmer le message systeme.',
      'circus-dos-close': 'Fermer la representation DOS du cirque.',
      'circus-dos-launch': 'Ouvrir le panneau de simulation apres le rendu DOS.',
      'circus-dos-dismiss': 'Retourner au bureau CainOS.',
      'caine-btn-dismiss': 'Fermer l intrusion de Caine.',
      'power-button': 'Eteindre ou rallumer l ecran CainOS.'
    };

    Object.entries(tooltips).forEach(([id, tooltip]) => {
      const button = document.getElementById(id);
      if (!button) return;
      button.setAttribute('title', tooltip);
      button.setAttribute('aria-label', tooltip);
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

    if (log) log.innerHTML = "";
    if (prompt) prompt.style.display = 'none';
    if (bootScreen) bootScreen.style.display = 'none';
    if (desktop) desktop.style.display = 'flex';
    if (powerBtn) powerBtn.classList.add('active');
    if (powerLed) powerLed.classList.add('active');

    this.isBooted = true;
    this.wasShutdownByCalibration = false;
    localStorage.removeItem('was_shutdown_by_calibration');
    this.applySystemStateUI();
    this.selectEpisodeForCurrentProgress();
    this.playLoginJingle();
    this.openWindow('simulations');
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

  setupEvents() {
    // Desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundManager.playClick();
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        this.selectedIcon = icon.getAttribute('data-window');
        if (this.selectedIcon === 'simulations') {
          this.showCircusDosPreview();
        }
      });

      icon.addEventListener('dblclick', (e) => {
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
        this.hideCircusDosPreview();
        this.openWindow('simulations');
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
        screen.style.opacity = '0';
        SoundManager.stopMainframeHum();
        SoundManager.stopTheme();
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
    
    const showSarah = progress.includes(9);
    
    if (progress.includes(0)) {
      if (nameEl) nameEl.innerText = showSarah ? "Pomni (Sarah)" : "Pomni";
      if (picEl) {
        picEl.className = "profile-pic pomni-pic";
        picEl.style.backgroundImage = "";
      }
    } else {
      if (nameEl) nameEl.innerText = showSarah ? "SUJET #042 (Sarah)" : "SUJET #042";
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
    if (!overlay || !art) return;

    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    const unlockedCount = progress.filter(ep => ep >= 0 && ep <= 9).length;
    const abstractionRisk = unlockedCount >= 7 ? 'CRITICAL' : (unlockedCount >= 3 ? 'ELEVATED' : 'STABLE');

    art.innerText = [
      'C:\\\\CAINE\\\\CIRCUS> render_circus.exe /mode:dos /source:C&A_ARCHIVE',
      'CAINE ADVENTURE SHELL v0.98',
      'NEURAL LINK............. ONLINE',
      `EPISODE MODULES......... ${String(unlockedCount).padStart(2, '0')} / 10`,
      `ABSTRACTION RISK........ ${abstractionRisk}`,
      '',
      '                 .-""""""""""""""""-.',
      '              .-"   THE AMAZING      "-.',
      '            ."      DIGITAL CIRCUS      ".',
      '           /============================\\',
      '          /  /\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\  \\',
      '         /__/__/__/__/__/__/__/__/__/__\\',
      '          |  CAINE MODULE : ONLINE     |',
      '          |  WACKY WATCH : LISTENING   |',
      '          |  EXIT DOOR   : UNTRUSTED   |',
      '          |____________________________|',
      '            /  []   []   []   []   \\',
      '           /____POMNI_SIGNAL_LOCK____\\',
      '',
      '   [P] NEW SUBJECT        [K] ABSTRACTED KAUFMO TRACE',
      '   [C] CAINE ROUTINE      [A] C&A ARCHIVE FRAGMENT',
      '',
      'C:\\\\CAINE\\\\CIRCUS> note',
      '"Aucune sortie valide detectee. Veuillez profiter de l aventure."',
      '',
      'C:\\\\CAINE\\\\CIRCUS> press LANCER_LE_MODULE to continue'
    ].join('\\n');

    overlay.style.display = 'flex';
    SoundManager.play(520, 0.05, 'square', 0.06);
    setTimeout(() => SoundManager.play(780, 0.05, 'square', 0.05), 80);
  },

  hideCircusDosPreview() {
    const overlay = document.getElementById('circus-dos-overlay');
    if (overlay) overlay.style.display = 'none';
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
      }
      if (winId === 'trash') {
        this.renderTrashList();
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

    // Dynamic lore redaction if Episode 0 calibration is not completed (i.e. Sarah has not yet entered and been named Pomni)
    const progress = (typeof EpisodeManager !== 'undefined') ? EpisodeManager.getProgress() : [];
    let processedContent = content;
    if (!progress.includes(0)) {
      processedContent = processedContent.replace(/Pomni/g, "SUJET #042");
    }
    // Mask real name "Sarah" until Episode 9 (revelations) is completed
    if (!progress.includes(9)) {
      processedContent = processedContent.replace(/Sarah/g, "SUJET #042");
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

  // Wacky Watch App Logic
  setupWackyWatch() {
    // Menu buttons
    const btnCast = document.getElementById('watch-btn-cast');
    const btnRadar = document.getElementById('watch-btn-radar');
    const tabCast = document.getElementById('watch-tab-cast');
    const tabRadar = document.getElementById('watch-tab-radar');

    btnCast.addEventListener('click', () => {
      SoundManager.playClick();
      btnCast.classList.add('active');
      btnRadar.classList.remove('active');
      tabCast.classList.add('active');
      tabRadar.classList.remove('active');
    });

    btnRadar.addEventListener('click', () => {
      SoundManager.playClick();
      btnRadar.classList.add('active');
      btnCast.classList.remove('active');
      tabRadar.classList.add('active');
      tabCast.classList.remove('active');
      this.startRadarAnimation();
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

      const fullCastData = this.getWackyCastData();
      const character = castData[this.activeWackyCast] || fullCastData[this.activeWackyCast];
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
        "Son epouse Helen, alias Queenie, s est abstraite sous ses yeux.",
        "Est l humain connecte depuis le plus longtemps selon CainOS.",
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
    Object.assign(castData, this.getWackyCastData());

    const castList = document.getElementById('watch-cast-list');
    if (castList) {
      castList.innerHTML = "";

      // Determine active cast member
      if (!this.activeWackyCast || !castData[this.activeWackyCast]) {
        this.activeWackyCast = showPomni ? 'pomni' : 'kinger';
      }

      // Populate list
      for (let id in castData) {
        const item = document.createElement('div');
        item.className = `cast-item ${id === this.activeWackyCast ? 'active' : ''}`;
        item.innerHTML = `<span class="cast-pixel-icon">${this.getPixelAvatarSvg(castData[id].avatar, 16)}</span> ${castData[id].name}`;
        
        item.addEventListener('click', () => {
          SoundManager.playClick();
          document.querySelectorAll('.cast-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          this.activeWackyCast = id;
          this.loadWackyProfile(castData[id]);
        });
        castList.appendChild(item);
      }

      this.loadWackyProfile(castData[this.activeWackyCast]);
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

  loadWackyProfile(char) {
    document.getElementById('watch-profile-name').innerText = char.name;
    document.getElementById('watch-profile-age').innerText = char.age;
    document.getElementById('watch-profile-stress').innerText = char.stress;
    document.getElementById('watch-profile-fact').innerText = char.facts[0];
    
    // Draw simple avatar SVG inside #watch-profile-avatar
    const container = document.getElementById('watch-profile-avatar');
    container.classList.toggle('profile-avatar-wide', char.avatar === 'gloinkqueenscale');
    container.innerHTML = this.getPixelAvatarSvg(char.avatar, 46);
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
Sarah (Pomni), si tu lis ceci sur l'écran d'administration... débranche le PORT NEURAL 3 sur la machine physique.
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
Arthur (Kinger) : "Sarah, le signal de forçage a été injecté. 
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
        const civilName = progressVit.includes(9) ? "Sarah" : "[VERROUILLÉ]";
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
        const subName = hasEp9 ? "Sarah" : "SUJET #042";
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
