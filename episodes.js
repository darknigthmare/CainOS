/* ==========================================================================
   C&A Mainframe - Episodes Simulation Engines (episodes.js)
   ========================================================================== */

const SoundManager = {
  ctx: null,
  themeTimer: null,
  themeIndex: 0,
  isThemePlaying: false,
  humOsc: null,
  humLFO: null,
  humGain: null,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  },
  play(freq, duration, type = 'sine', volume = 0.1) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context might fail to initialize without user gesture
    }
  },
  playHammerOn(fromFreq, toFreq, duration = 0.14, type = 'triangle', volume = 0.05) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(fromFreq, now);
      osc.frequency.exponentialRampToValueAtTime(toFreq, now + Math.max(0.025, duration * 0.38));
      osc.frequency.setValueAtTime(toFreq, now + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(toFreq * 1.6, now);
      filter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.00001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {}
  },
  playBeep() { this.play(800, 0.1, 'sine', 0.15); },
  playClick() { this.play(1500, 0.03, 'triangle', 0.08); },
  playError() {
    this.play(120, 0.15, 'sawtooth', 0.25);
    setTimeout(() => this.play(100, 0.2, 'sawtooth', 0.25), 150);
  },
  playWin() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => this.play(note, 0.15, 'sine', 0.15), i * 120);
    });
  },
  playGlitch() {
    this.play(200 + Math.random() * 600, 0.05, 'sawtooth', 0.12);
  },
  playExplosion() {
    this.play(90, 0.5, 'triangle', 0.3);
    this.play(60, 0.6, 'sawtooth', 0.2);
  },
  startMainframeHum() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.humOsc) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.humOsc = this.ctx.createOscillator();
      this.humOsc.type = 'sawtooth';
      this.humOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      this.humLFO = this.ctx.createOscillator();
      this.humLFO.frequency.setValueAtTime(3.5, this.ctx.currentTime);

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);

      this.humLFO.connect(lfoGain);
      lfoGain.connect(this.humOsc.frequency);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);

      this.humGain = this.ctx.createGain();
      this.humGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.humOsc.connect(filter);
      filter.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);

      this.humOsc.start();
      this.humLFO.start();
    } catch (e) {
      console.warn("Mainframe hum failed", e);
    }
  },
  stopMainframeHum() {
    try {
      if (this.humOsc) {
        this.humOsc.stop();
        this.humOsc.disconnect();
        this.humOsc = null;
      }
      if (this.humLFO) {
        this.humLFO.stop();
        this.humLFO.disconnect();
        this.humLFO = null;
      }
      if (this.humGain) {
        this.humGain.disconnect();
        this.humGain = null;
      }
    } catch (e) {}
  },
  startTheme() {
    if (this.isThemePlaying) return;
    this.isThemePlaying = true;
    this.themeIndex = 0;
    this.playThemeStep();
  },
  stopTheme() {
    this.isThemePlaying = false;
    if (this.themeTimer) {
      clearTimeout(this.themeTimer);
      this.themeTimer = null;
    }
  },
  playThemeStep() {
    if (!this.isThemePlaying) return;
    this.init();
    if (!this.ctx) return;
    const NOTE_FREQS = {
      'B3': 246.94, 'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
      'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
      'A5': 880.00, 'B5': 987.77
    };
    const midiToFreq = (pitch) => 440 * Math.pow(2, (pitch - 69) / 12);
    const beatMs = 60000 / 140;

    // User-provided CainOS MIDI theme, rendered as a small retro synth loop.
    const melody = [
      { pitch: 72, beats: 0.5, chord: ['C4', 'E4', 'G4'], bass: 'C4' },
      { pitch: 76, beats: 0.5, chord: ['C4', 'E4', 'G4'], bass: null },
      { pitch: 79, beats: 0.5, chord: ['C4', 'E4', 'G4'], bass: 'G4' },
      { pitch: 76, beats: 0.5, chord: ['C4', 'E4', 'G4'], bass: null },
      { pitch: 72, beats: 0.5, chord: ['C4', 'E4', 'G4'], bass: 'C4' },
      { pitch: 76, beats: 0.5, chord: ['C4', 'E4', 'G4'], bass: null },
      { pitch: 79, beats: 1.0, chord: ['C4', 'E4', 'G4'], bass: 'G4' },
      { pitch: 77, beats: 0.5, chord: ['B3', 'D4', 'F4'], bass: 'B3' },
      { pitch: 74, beats: 0.5, chord: ['B3', 'D4', 'F4'], bass: null },
      { pitch: 71, beats: 0.5, chord: ['B3', 'D4', 'F4'], bass: 'F4' },
      { pitch: 74, beats: 0.5, chord: ['B3', 'D4', 'F4'], bass: null },
      { pitch: 77, beats: 1.0, chord: ['B3', 'D4', 'F4'], bass: 'B3' },
      { pitch: 79, beats: 1.0, chord: ['C4', 'E4', 'G4'], bass: 'C4' }
    ];
    const step = melody[this.themeIndex];
    const stepDur = step.beats * beatMs;
    if (Number.isFinite(step.pitch)) {
      const freq = midiToFreq(step.pitch);
      this.play(freq, stepDur / 1000, 'square', 0.04);
      setTimeout(() => this.play(freq * 2, Math.min(0.08, stepDur / 2000), 'triangle', 0.012), 38);
    }
    if (step.bass && NOTE_FREQS[step.bass]) {
      this.play(NOTE_FREQS[step.bass] / 2, Math.max(0.18, stepDur / 720), 'triangle', 0.05);
    }
    if (step.chord && this.themeIndex % 2 === 0) {
      step.chord.forEach((note, i) => {
        if (!NOTE_FREQS[note]) return;
        setTimeout(() => this.play(NOTE_FREQS[note], 0.075, 'sine', 0.018), i * 44);
      });
    }
    this.themeIndex = (this.themeIndex + 1) % melody.length;
    this.themeTimer = setTimeout(() => this.playThemeStep(), stepDur);
  }
};

const EpisodeManager = {
  currentEpisode: null,
  activeGame: null,
  storySpeed: 1,
  selectedSubepisodeIndex: 0,
  activeSubepisodeIndex: null,
  activeSubepisodeCheckpoint: null,
  activeSubepisodeTotal: 0,
  activeStorySceneCharacters: [],
  storyCharacterProfiles: {
    POMNI: { color: "#e53935", label: "Pomni", info: "Nouvelle humaine piegee dans le Cirque. Signal panique eleve, obsession de la sortie.", lockedInfo: "Nouveau signal joueur detecte. Identite et stabilite encore inconnues.", unlockAt: { episode: 1, subepisode: 0 } },
    CAINE: { color: "#f6d743", label: "Caine", info: "Ringmaster IA. Controle les aventures, les decors et les transitions de simulation.", lockedInfo: "Signal maitre de ceremonie detecte. Niveau d'autorite exact encore inconnu.", unlockAt: { episode: 1, subepisode: 0 } },
    BUBBLE: { color: "#f7f7ff", label: "Bubble", info: "Assistant flottant de Caine. Presque toujours colle au show et aux mauvaises idees." },
    RAGATHA: { color: "#d64545", label: "Ragatha", info: "Poupée de chiffon bienveillante. Stabilise souvent Pomni et le groupe.", lockedInfo: "Signal resident du Cirque. Role relationnel pas encore etabli.", unlockAt: { episode: 1, subepisode: 0 } },
    JAX: { color: "#8a4fd6", label: "Jax", info: "Lapin violet sarcastique. Forte probabilite de sabotage ou de provocation.", lockedInfo: "Signal resident du Cirque. Intention encore non classee.", unlockAt: { episode: 1, subepisode: 0 } },
    GANGLE: { color: "#f7f7f7", label: "Gangle", info: "Masque et rubans. Son etat depend fortement de son masque de comedie/tragedie.", lockedInfo: "Signal resident du Cirque. Etat emotionnel non stabilise.", unlockAt: { episode: 1, subepisode: 0 } },
    ZOOBLE: { color: "#ff4fb8", label: "Zooble", info: "Corps modulaire. Refuse souvent les aventures forcees de Caine.", lockedInfo: "Signal resident du Cirque. Profil comportemental incomplet.", unlockAt: { episode: 1, subepisode: 0 } },
    KINGER: { color: "#d9d0a2", label: "Kinger", info: "Piece d'echecs instable, ancien prisonnier du Cirque avec des souvenirs profonds.", lockedInfo: "Signal resident ancien. CainOS retient les details memoire.", unlockAt: { episode: 8, subepisode: 1 } },
    KAUFMO: { color: "#363636", label: "Kaufmo", info: "Ancien membre abstrait. Menace noire et instable dans le pilote.", lockedInfo: "Signal resident absent. Statut non confirme dans la timeline actuelle.", unlockAt: { episode: 1, subepisode: 5 } },
    GUMMIGOO: { color: "#d69b35", label: "Gummigoo", info: "PNJ crocodile du canyon. Sa nature de PNJ cree une faille de memoire.", lockedInfo: "Signal canyon detecte. Nature exacte verrouillee jusqu'a l'aventure correspondante.", unlockAt: { episode: 2, subepisode: 3 } },
    GLOINK: { color: "#6b4cff", label: "Gloink", info: "Petite entite voleuse de l'aventure du pilote. Signal geometrique instable." },
    GLOINK_QUEEN: { color: "#ff7d8d", label: "Gloink Queen", info: "Reine enorme des Gloinks, hors echelle par rapport aux autres signaux." },
    LOO: { color: "#ffb7d5", label: "Princess Loolilalu", info: "Princesse du Royaume des Sucreries, liee a l'aventure du canyon." },
    PRINCESS_LOO: { color: "#ffb7d5", label: "Princess Loo", info: "Princesse du Candy Canyon Kingdom. Elle lance la mission du sirop vole.", unlockAt: { episode: 2, subepisode: 1 } },
    BANDIT: { color: "#b8783f", label: "Bandit", info: "Bandit PNJ du Candy Canyon, membre du convoi de Gummigoo.", unlockAt: { episode: 2, subepisode: 3 } },
    THE_FUDGE: { color: "#7a3e2d", label: "The Fudge", info: "Chef/menace fudge du royaume sucre, plus dangereux que son apparence ne le suggere.", unlockAt: { episode: 2, subepisode: 6 } },
    BARON_MILDENHALL: { color: "#7b6cff", label: "Baron Mildenhall", info: "Theodore Mildenhall, presence centrale et monstrueuse du manoir mature.", unlockAt: { episode: 3, subepisode: 2 } },
    MARTHA_MILDENHALL: { color: "#b7f0ff", label: "Martha Mildenhall", info: "Esprit/figure du manoir qui force Pomni et Kinger a traverser les souvenirs douloureux.", unlockAt: { episode: 3, subepisode: 5 } },
    MOUNTED_CREATURE_HEAD: { color: "#9b8a73", label: "Mounted Creature Head", info: "Trophee parlant du manoir, signal secondaire de la zone mature.", unlockAt: { episode: 3, subepisode: 2 } },
    POSSESSED_POMNI: { color: "#7c1d1d", label: "Possessed Pomni", info: "Etat horrifique temporaire de Pomni pendant les manifestations du manoir.", unlockAt: { episode: 3, subepisode: 5 } },
    GHOSTLY: { color: "#b7f0ff", label: "Ghostly Signal", info: "Manifestation paranormale du manoir de Mildenhall.", unlockAt: { episode: 3, subepisode: 1 } },
    MAX: { color: "#ffcc66", label: "Max", info: "Client de Spudsy, signal comique du rush fast-food.", unlockAt: { episode: 4, subepisode: 4 } },
    TRAINING_VIDEO: { color: "#7df0ff", label: "Training Video", info: "Video interne Spudsy qui transforme la pression du travail en protocole absurde.", unlockAt: { episode: 4, subepisode: 5 } },
    STRANGE_CUSTOMER: { color: "#d48cff", label: "Strange Customer", info: "Client inquietant de Spudsy qui augmente la pression autour de Gangle.", unlockAt: { episode: 4, subepisode: 3 } },
    SPUDSY_NPC: { color: "#ffaa33", label: "Spudsy NPC", info: "Client ou employe NPC du restaurant Spudsy.", unlockAt: { episode: 4, subepisode: 2 } },
    ORBSMAN: { color: "#6fe8ff", label: "Orbsman", info: "Entite secondaire du Cirque, silhouette orbitee et signal bizarre." },
    ABEL: { color: "#ff9b37", label: "Abel", info: "Figure/mannequin liee aux couches C&A et aux archives profondes du projet.", lockedInfo: "Signal C&A protege. Donnees masquees jusqu'a la couche Abel.", unlockAt: { episode: 7, subepisode: 2 } },
    ARTHUR: { color: "#c0d0ff", label: "Arthur", info: "Identite humaine rattachee aux tests C&A et a la trajectoire de Kinger.", lockedInfo: "Operateur C&A detecte. CainOS masque son lien avec les residents.", unlockAt: { episode: -1, subepisode: 0 } },
    SARAH: { color: "#ff6b6b", label: "Sarah", info: "Identite humaine suggeree derriere Pomni dans la couche CainOS.", lockedInfo: "Sujet humain C&A detecte. Le lien avec le Cirque n'est pas encore confirme.", unlockAt: { episode: 9, subepisode: 2 } },
    HELEN: { color: "#5fe9d4", label: "Helen / Queenie", lockedLabel: "Helen", info: "Trace memoire associee a Queenie et aux souvenirs enfouis de Kinger.", lockedInfo: "Trace memoire protegee. Identite complete verrouillee.", unlockAt: { episode: 8, subepisode: 1 } },
    QUEENIE: { color: "#5fe9d4", label: "Queenie", lockedLabel: "Piece inconnue", info: "Piece disparue, memoire centrale pour Kinger.", lockedInfo: "Signal echecs disparu. Importance narrative non encore debloquee.", unlockAt: { episode: 8, subepisode: 1 } },
    SYSTEM: { color: "#39ff14", label: "System", info: "Signal technique CainOS : chargement, archive, protocole ou bruit de scene." },
    ARCHIVE: { color: "#8fbf8f", label: "Archive", info: "Indication de scene ou audio detectee dans la transcription." },
    CAST: { color: "#ffec8b", label: "Cast", info: "Dialogue attribue au groupe ou speaker ambigu dans la transcription." }
  },
  
  // Story Engine State
  storyData: {
    0: {
      title: "Épisode 0: Calibration C&A",
      intro: [
        { speaker: "SYSTEM", text: "INITIALISATION DU SYSTÈME DE LIAISON NEURONALE C&A..." },
        { speaker: "ARTHUR", text: "Sarah ? Est-ce que vous m'entendez ? Le scan est sur le point de commencer. Ne bougez pas." },
        { speaker: "SARAH", text: "Où... où suis-je ? Pourquoi tout est sombre ? Je portais un casque..." },
        { speaker: "ARTHUR", text: "C'est la phase de calibration neuronale. Le système cartographie votre cortex visuel." },
        { speaker: "ARTHUR", text: "Cliquez sur les nodes clignotants à l'écran pour stabiliser la bande passante." }
      ],
      outro: []
    },
    1: {
      title: "Épisode 1: Le Pilote",
      intro: [
        { speaker: "MUSIC", text: "[00:01] [elegant music plays]" },
        { speaker: "SFX", text: "[00:10] [drum roll]" },
        { speaker: "CAINE", text: "[00:12] Welcome to the Amazing Digital Circus!" },
        { speaker: "CAINE", text: "[00:16] My name is Caine!" },
        { speaker: "CAINE", text: "[00:17] I'm your ringmaster, and I'm here to show you the most jaw-dropping, heart-stopping, mind-bending paraphernalia you've ever laid your eyes upon!" },
        { speaker: "CAINE", text: "[00:24] Isn't that right, Bubble?" },
        { speaker: "BUBBLE", text: "[00:24] That's right, Caine!" },
        { speaker: "BUBBLE", text: "[00:26] I can't wait to see what you've got cooking up for today." },
        { speaker: "CAINE", text: "[00:29] Well, let's not waste any time." },
        { speaker: "CAINE", text: "[00:30] Let's get right into the show." },
        { speaker: "CAST", text: "[00:32] 🎵 Gangle and Zooble and Kinger, too 🎵" },
        { speaker: "CAST", text: "[00:37] 🎵 Ragatha, Jax, and there's Kaufmo, woohoo 🎵" },
        { speaker: "CAST", text: "[00:41] 🎵 Day after day after -- day after -- day after day we fly 🎵" },
        { speaker: "CAST", text: "[00:46] 🎵 Past the moon and the sun and we don't know why 🎵" },
        { speaker: "POMNI", text: "[00:51] W-W-Whe-- Wh-- Where am I?" },
        { speaker: "POMNI", text: "[00:56] [wails]" },
        { speaker: "POMNI", text: "[00:59] Ah!" },
        { speaker: "SFX", text: "[01:01] [flower pot banging rapidly]" },
        { speaker: "CAST", text: "[01:03] [all groaning, grunting]" },
        { speaker: "MUSIC", text: "[01:03] [music slows, stops]" },
        { speaker: "JAX", text: "[01:09] Caine, is this one of your NPCs, or is this a new sucker?" },
        { speaker: "JAX", text: "[01:13] 'Cause if it's a new character, we're gonna have to redo this whole theme song." },
        { speaker: "ZOOBLE", text: "[01:17] I'm not doing that again." },
        { speaker: "CAINE", text: "[01:17] My, my!" },
        { speaker: "CAINE", text: "[01:20] It appears a new human has entered this realm!" },
        { speaker: "POMNI", text: "[01:23] How do I... take this..." },
        { speaker: "POMNI", text: "[01:26] headset off?!" },
        { speaker: "JAX", text: "[01:27] Just keep grabbing at it." },
        { speaker: "JAX", text: "[01:29] That worked for all of us." },
        { speaker: "POMNI", text: "[01:32] [groans, gasps]" },
        { speaker: "POMNI", text: "[01:36] W-What's going on?" },
        { speaker: "POMNI", text: "[01:37] I-I-I put on some weird headset, and now I'm..." },
        { speaker: "POMNI", text: "[01:42] here." },
        { speaker: "POMNI", text: "[01:44] Who are you people?" },
        { speaker: "POMNI", text: "[01:46] Why can't I take it off? Where am I?" },
        { speaker: "RAGATHA", text: "[01:48] Let's just try to calm down." },
        { speaker: "RAGATHA", text: "[01:50] Everything's gonna be okay, new stuff." },
        { speaker: "RAGATHA", text: "[01:52] We've all been through this. You just need to get your head to--" },
        { speaker: "POMNI", text: "[01:55] What the [boing!] is going on?!" },
        { speaker: "POMNI", text: "[01:58] Wha--" },
        { speaker: "CAINE", text: "[01:58] Now, now, now, my dear." },
        { speaker: "CAINE", text: "[01:59] We can't have any of that foul language around here." },
        { speaker: "CAINE", text: "[02:03] The Amazing Digital Circus is a place to be enjoyed by all ages." },
        { speaker: "CAINE", text: "[02:07] You, my friend, stumbled into an incredible world of wonders where anything can happen!" },
        { speaker: "CAINE", text: "[02:13] E-Except for swearing." },
        { speaker: "POMNI", text: "[02:14] [honk!] [squeak!] [boing!] [bonk!]" },
        { speaker: "POMNI", text: "[02:16] [awooga!] [boink!] [shloompf!] [pop!] [splat!] [boi-oi-oing!]" },
        { speaker: "POMNI", text: "[02:20] [boink!]" },
        { speaker: "POMNI", text: "[02:21] Oh, my God." },
        { speaker: "POMNI", text: "[02:23] U-Uh, well, h-how do I..." },
        { speaker: "POMNI", text: "[02:26] you know, leave?" },
        { speaker: "CAINE", text: "[02:28] Uh--" },
        { speaker: "RAGATHA", text: "[02:29] W-Well, don't freak out about it or anything, but, uh, we don't exactly..." },
        { speaker: "JAX", text: "[02:35] You can't." },
        { speaker: "POMNI", text: "[02:35] What?" },
        { speaker: "ZOOBLE", text: "[02:37] Shut up, Jax." },
        { speaker: "ZOOBLE", text: "[02:38] But, yeah, he's right." },
        { speaker: "ZOOBLE", text: "[02:40] Welcome to your new home." },
        { speaker: "ZOOBLE", text: "[02:42] And your new body." },
        { speaker: "POMNI", text: "[02:43] \"N-N-New home\"?" },
        { speaker: "POMNI", text: "[02:45] What do you mean?" },
        { speaker: "RAGATHA", text: "[02:46] Guys, don't be mean." },
        { speaker: "JAX", text: "[02:47] We've been stuck here for years." },
        { speaker: "JAX", text: "[02:49] Old Kinger over there's supposedly been here the longest." },
        { speaker: "KINGER", text: "[02:52] Huh? Did someone say something about an insect collection?" },
        { speaker: "JAX", text: "[02:55] That's why he's crazy." },
        { speaker: "JAX", text: "[02:57] [chuckles] Eh." },
        { speaker: "POMNI", text: "[03:01] [panting]" },
        { speaker: "POMNI", text: "[03:04] Ohhhh, okay! Now I get it!" },
        { speaker: "POMNI", text: "[03:08] This is a dream, and I should just play along until I wake up, right?" },
        { speaker: "JAX", text: "[03:15] Whatever you say, kid." },
        { speaker: "GANGLE", text: "[03:17] They broke my comedy mask..." },
        { speaker: "JAX", text: "[03:20] So, Caine..." },
        { speaker: "GANGLE", text: "[03:20] [whimpers]" },
        { speaker: "JAX", text: "[03:22] ...We having a new adventure today for the newbie, or what?" },
        { speaker: "CAINE", text: "[03:24] I'd like to give our brand new member a tour of the circus grounds first." },
        { speaker: "POMNI", text: "[03:28] Uh--" },
        { speaker: "CAINE", text: "[03:28] Off we go!" },
        { speaker: "CAINE", text: "[03:31] Here, we have..." },
        { speaker: "CAINE", text: "[03:33] This is where your living quarters are, as well as all sorts of other activities!" },
        { speaker: "CAINE", text: "[03:37] These activities may include..." },
        { speaker: "SFX", text: "[03:39] [dial-up tone blares]" },
        { speaker: "CAINE", text: "[03:45] ...Ball pits, mini golf, and more!" },
        { speaker: "CAINE", text: "[03:49] And here, we have..." },
        { speaker: "CAINE", text: "[03:52] Drown yourself in the digital lake or engage in ridery at the digital carnival!" },
        { speaker: "CAINE", text: "[03:57] Night, day, it's all okay!" },
        { speaker: "CAINE", text: "[03:58] The choice is yours! A cosmic buffet!" },
        { speaker: "POMNI", text: "[04:01] Uh, is...that all there is?" },
        { speaker: "CAINE", text: "[04:03] Of course not." },
        { speaker: "CAINE", text: "[04:05] This is THE VOID!" },
        { speaker: "CAINE", text: "[04:07] We don't venture out into the void." },
        { speaker: "CAINE", text: "[04:10] [spooky voice] Not even I know what's out there." },
        { speaker: "POMNI", text: "[04:13] That's, uh--" },
        { speaker: "CAINE", text: "[04:13] We stay right here, where I can keep my..." },
        { speaker: "CAINE", text: "[04:16] [dramatic voice] ...hundreds of all-seeing eyes on you." },
        { speaker: "MOON", text: "[04:21] [soft voice] Hello, Caine. I love you." },
        { speaker: "CAINE", text: "[04:23] Eaugh! Let's get outta here before the moon gets frisky." },
        { speaker: "POMNI", text: "[04:26] Wait, what's that--" },
        { speaker: "POMNI", text: "[04:30] Blegh!" },
        { speaker: "CAINE", text: "[04:32] Whoa, clean up on aisle you!" },
        { speaker: "BUBBLE", text: "[04:34] I'm on it, boss!" },
        { speaker: "BUBBLE", text: "[04:36] [slurping]" },
        { speaker: "CAINE", text: "[04:38] Why are you like this?" },
        { speaker: "POMNI", text: "[04:41] [groans] Wait, wait!" },
        { speaker: "POMNI", text: "[04:44] W-Was that an exit door I saw out there?" },
        { speaker: "POMNI", text: "[04:46] Is that a way to leave?" },
        { speaker: "CAINE", text: "[04:46] What exit?" },
        { speaker: "CAINE", text: "[04:49] If there was a way to leave, I'm pretty sure we'd have all left by now." },
        { speaker: "BUBBLE", text: "[04:52] [gagging]" },
        { speaker: "ZOOBLE", text: "[04:52] Yeah, what are you talking about?" },
        { speaker: "CAINE", text: "[04:56] U-Uh, I -- [clears throat]" },
        { speaker: "CAINE", text: "[04:57] I assure you, there is no \"magical exit door.\"" },
        { speaker: "CAINE", text: "[05:01] You're probably just experiencing..." },
        { speaker: "CAINE", text: "[05:04] From your mind's transition to the digital plane." },
        { speaker: "POMNI", text: "[05:07] But, I-I swear, I saw --" },
        { speaker: "CAINE", text: "[05:07] [frantic] Digital hallucinations!" },
        { speaker: "CAINE", text: "[05:14] How about we talk about something else?" },
        { speaker: "CAINE", text: "[05:16] Like your name!" },
        { speaker: "POMNI", text: "[05:16] My name?" },
        { speaker: "POMNI", text: "[05:18] My name is, uh..." },
        { speaker: "POMNI", text: "[05:21] U-U-Uh?! Oh, God!" },
        { speaker: "POMNI", text: "[05:23] Why can't I remember my name?!" },
        { speaker: "CAINE", text: "[05:25] Nobody can remember their name once they enter the Digital Circus." },
        { speaker: "CAINE", text: "[05:29] One of the few things I don't have control over are your minds." },
        { speaker: "CAINE", text: "[05:33] So, all I can help you with is coming up with a new one." },
        { speaker: "POMNI", text: "[05:35] [groaning] What's my name?" },
        { speaker: "CAINE", text: "[05:39] Don't you worry your little head." },
        { speaker: "CAINE", text: "[05:42] Your new name can be anything!" },
        { speaker: "CAINE", text: "[05:44] Hereby acknowledging that your chosen name and or names may not breach the Digital Circus user license agreement stating that your name may not include objectionable content." },
        { speaker: "CAINE", text: "[05:47] Objectionable content includes but is not limited to sexually explicit materials, obscene, defamatory, libelous, slanderous, violent, and/or unlawful content or profanity." },
        { speaker: "CAINE", text: "[05:52] What are ya thinkin'?" },
        { speaker: "POMNI", text: "[05:52] Huh?" },
        { speaker: "POMNI", text: "[05:54] I don't care. Just pick anything." },
        { speaker: "CAINE", text: "[05:56] Let's see!" },
        { speaker: "SFX", text: "[05:57] [wheel dinging]" },
        { speaker: "CAINE", text: "[06:01] What do you think of..." },
        { speaker: "CAINE", text: "[06:01] [stammers phonetic sounds]" },
        { speaker: "POMNI", text: "[06:03] I don't--" },
        { speaker: "CAINE", text: "[06:03] You're right, terrible. Let's try that again." },
        { speaker: "CAINE", text: "[06:07] What do you think of \"Pomni\"?" },
        { speaker: "POMNI", text: "[06:09] Huh? Uh, s-sure." },
        { speaker: "POMNI", text: "[06:12] I think I just-" },
        { speaker: "CAINE", text: "[06:12] Gadzooks, you're right, Jax!" },
        { speaker: "CAINE", text: "[06:14] We should have a brand new adventure for our new member, Pomni!" },
        { speaker: "JAX", text: "[06:18] I said that like five minutes ago." },
        { speaker: "CAINE", text: "[06:19] You! Do you like adventure?" },
        { speaker: "CAINE", text: "[06:21] Activity? Wonder? Danger? Horror? Pain? Suffering? Agony?" },
        { speaker: "CAINE", text: "[06:23] Death? Disease? Death? Angel food cake?" },
        { speaker: "BUBBLE", text: "[06:25] [chomp!]" },
        { speaker: "CAINE", text: "[06:27] You parasite!" },
        { speaker: "POMNI", text: "[06:28] Uh, I don't really..." },
        { speaker: "CAINE", text: "[06:30] Since you're new around here, we're gonna make it a simple in-house adventure to warm you up to how things work around here." },
        { speaker: "ZOOBLE", text: "[06:36] Wha-- No! God!" },
        { speaker: "ZOOBLE", text: "[06:38] I don't want an in-house adventure." },
        { speaker: "CAINE", text: "[06:40] Don't worry, Zooble." },
        { speaker: "CAINE", text: "[06:41] I'll make it something unobtrusive that you can still choose to not get involved with." },
        { speaker: "CAINE", text: "[06:45] Today's adventure is..." },
        { speaker: "CAINE", text: "[06:50] [cackling maniacally]" },
        { speaker: "CAINE", text: "[06:53] That's right!" },
        { speaker: "CAINE", text: "[06:55] The entire circus tent will be infested with gloinks, and you gotta catch 'em all." },
        { speaker: "BUBBLE", text: "[07:00] But what are they?" },
        { speaker: "CAINE", text: "[07:00] I'm glad you asked, Bubble." },
        { speaker: "CAINE", text: "[07:02] They're small --" },
        { speaker: "BUBBLE", text: "[07:02] And what do they do?" },
        { speaker: "CAINE", text: "[07:05] They --" },
        { speaker: "BUBBLE", text: "[07:05] And how do they --" },
        { speaker: "CAINE", text: "[07:06] Gloinks are small mischievous critters that steal anything and everything they run into." },
        { speaker: "CAINE", text: "[07:10] Why do these humanoid hash browns do this?" },
        { speaker: "CAINE", text: "[07:13] How do you stop them?" },
        { speaker: "CAINE", text: "[07:14] That's for you to find out." },
        { speaker: "CAINE", text: "[07:16] Now, good luck." },
        { speaker: "CAINE", text: "[07:17] And have fun, my little superstars!" },
        { speaker: "POMNI", text: "[07:24] What did any of that mean?" },
        { speaker: "RAGATHA", text: "[07:26] Oh, that's just one of Caine's little adventures." },
        { speaker: "RAGATHA", text: "[07:29] They're just something fun to do to, you know..." },
        { speaker: "RAGATHA", text: "[07:32] prevent us from going insane." },
        { speaker: "RAGATHA", text: "[07:32] [chuckles nervously]" },
        { speaker: "ZOOBLE", text: "[07:35] [sighs] Speak for yourself." },
        { speaker: "ZOOBLE", text: "[07:36] If anyone needs me, then [sproing!] off." },
        { speaker: "ZOOBLE", text: "[07:39] Oh, God! Oh, jeez! No!" },
        { speaker: "SFX", text: "[07:41] [gloinks boinging, squeaking]" },
        { speaker: "ZOOBLE", text: "[07:44] Oh, God! Agh!" },
        { speaker: "ZOOBLE", text: "[07:46] Somebody help!" },
        { speaker: "JAX", text: "[07:48] [bored] Oh, no, they killed Zooble." },
        { speaker: "JAX", text: "[07:50] Anyway, you guys wanna go get something to eat?" },
        { speaker: "RAGATHA", text: "[07:52] Oh, wait -- we should go check on Kaufmo." },
        { speaker: "RAGATHA", text: "[07:54] I'm pretty sure he'd like to meet Pomni." },
        { speaker: "KINGER", text: "[07:58] My impenetrable fortress!" },
        { speaker: "RAGATHA", text: "[08:00] You wanna come with us to check on Kaufmo?" },
        { speaker: "KINGER", text: "[08:03] No, not really." },
        { speaker: "KINGER", text: "[08:05] I think Kaufmo's gone insane." },
        { speaker: "KINGER", text: "[08:07] Last time I spoke with him, he was rambling endlessly about some exit." },
        { speaker: "KINGER", text: "[08:12] Kind of like you, Pomni." },
        { speaker: "KINGER", text: "[08:13] You might be going insane, too." },
        { speaker: "POMNI", text: "[08:15] But, wait -- wouldn't that more likely mean the exit does exist?" },
        { speaker: "JAX", text: "[08:21] Could also mean you just have a jump-start on losing your mind." },
        { speaker: "POMNI", text: "[08:23] [quietly] Wait, what about Zooble?" },
        { speaker: "POMNI", text: "[08:25] Well, I think I'd like to ask him about it --" },
        { speaker: "POMNI", text: "[08:28] U-Uh, if this was real." },
        { speaker: "POMNI", text: "[08:31] Which it isn't, because it's a dream." },
        { speaker: "JAX", text: "[08:34] Heh, she still thinks this is a dream." },
        { speaker: "POMNI", text: "[08:38] U-Uh, why are you looking at me like that?" },
        { speaker: "JAX", text: "[08:41] I'm fine with doing whatever, as long as I get to see funny things happen to people." },
        { speaker: "JAX", text: "[08:45] Ow! Okay, I've already had enough of these things." },
        { speaker: "JAX", text: "[08:49] [sighs] You, me, and Pomni will go check on Kaufmo, which leaves Crybaby and Hoo-ha together to go handle the Zooble situation." },
        { speaker: "RAGATHA", text: "[08:58] [laughs nervously] Do you think pairing them up together is a good idea?" },
        { speaker: "JAX", text: "[09:02] Of course I do." },
        { speaker: "JAX", text: "[09:03] They're the two most mentally stable and capable characters to be paired together." },
        { speaker: "JAX", text: "[09:08] Come on, ladies -- let's go harass the clown." },
        { speaker: "GANGLE", text: "[09:15] My comedy mask is broken again." },
        { speaker: "KINGER", text: "[09:19] Gah! Oh!" },
        { speaker: "KINGER", text: "[09:20] Gangle, you startled me." },
        { speaker: "RAGATHA", text: "[09:23] So, this is where we all live -- or, well, where we all sleep at night." },
        { speaker: "RAGATHA", text: "[09:27] Even though we don't really need to sleep, it's sometimes nice to kind of take a break from everything and have a bit of a routine, you know?" },
        { speaker: "RAGATHA", text: "[09:33] I'm sure there'll be one for..." },
        { speaker: "RAGATHA", text: "[09:35] Oh, look -- you already got one." },
        { speaker: "POMNI", text: "[09:39] I still don't understand about the adventures." },
        { speaker: "POMNI", text: "[09:44] Why even go on them at all?" },
        { speaker: "POMNI", text: "[09:46] W-W-Why not try to find a way to leave?" },
        { speaker: "RAGATHA", text: "[09:50] Well, we usually do -- when we first arrive." },
        { speaker: "RAGATHA", text: "[09:53] But after a while, you start to realize that you really can't leave and constantly chasing an unattainable goal will start driving you a bit crazy." },
        { speaker: "RAGATHA", text: "[10:01] And eventually, you get to asking what the point of anything is, and you completely lose sight of who you are and why you're even alive." },
        { speaker: "RAGATHA", text: "[10:07] And when you reach your breaking point, something really terrible can happen." },
        { speaker: "RAGATHA", text: "[10:14] Ah, but that's not something we need to deal with today." },
        { speaker: "RAGATHA", text: "[10:18] Above anything else, the adventures give us something to do that keeps our minds healthy and stimulated." },
        { speaker: "SFX", text: "[10:20] [doorbell rings]" },
        { speaker: "JAX", text: "[10:23] Thank goodness this is all a dream, right, Pomni?" },
        { speaker: "MUSIC", text: "[10:27] [unsettling musical sting]" },
        { speaker: "POMNI", text: "[10:32] [gasps] Why are we here again?" },
        { speaker: "POMNI", text: "[10:35] What are we doing?" },
        { speaker: "RAGATHA", text: "[10:35] We're getting one of our friends." },
        { speaker: "SFX", text: "[10:38] [doorbell rings]" },
        { speaker: "RAGATHA", text: "[10:43] Huh. Maybe he's not in his room?" },
        { speaker: "RAGATHA", text: "[10:46] I hope he's all right." },
        { speaker: "JAX", text: "[10:46] Don't worry, dollface." },
        { speaker: "JAX", text: "[10:48] I've got a key to his room." },
        { speaker: "RAGATHA", text: "[10:50] Wha-- Wait, wh-- why?" },
        { speaker: "RAGATHA", text: "[10:52] You -- You -- You shouldn't have keys to anyone's room." },
        { speaker: "JAX", text: "[10:54] Nah, I've got keys everywhere, and you've all been fine." },
        { speaker: "JAX", text: "[10:58] By the way, I may have left something in your room today, so let me know if you find it." },
        { speaker: "JAX", text: "[11:02] Uh, you're not afraid of centipedes, are you?" },
        { speaker: "RAGATHA", text: "[11:04] Jax! That's literally my only fear! Why would you do this?!" },
        { speaker: "JAX", text: "[11:07] What? It could be a completely unrelated question." },
        { speaker: "JAX", text: "[11:10] You'll never know until it's too late." },
        { speaker: "MUSIC", text: "[11:13] [dramatic music plays]" },
        { speaker: "SFX", text: "[11:17] [static crackling]" },
        { speaker: "POMNI", text: "[11:17] [whimpers]" },
        { speaker: "JAX", text: "[11:19] Oh, I've been looking for this." },
        { speaker: "JAX", text: "[11:21] Thanks for keeping an eye on it, Kaufy." },
        { speaker: "JAX", text: "[11:23] I'm gonna head out. See ya." },
        { speaker: "RAGATHA", text: "[11:25] [nervously] Oh! Kaufmo's been abstracted!" },
        { speaker: "RAGATHA", text: "[11:28] That -- That's okay." },
        { speaker: "POMNI", text: "[11:29] What... is that?" },
        { speaker: "KAUFMO", text: "[11:29] [growls]" },
        { speaker: "RAGATHA", text: "[11:32] Uh, it might be that terrible thing I was talking about earlier when you reach your breaking point." },
        { speaker: "POMNI", text: "[11:37] H-huh?" },
        { speaker: "RAGATHA", text: "[11:37] O-Okay, wait." },
        { speaker: "RAGATHA", text: "[11:40] M-Maybe there's still time to fix him if we get Caine." },
        { speaker: "POMNI", text: "[11:43] [gasps]" },
        { speaker: "RAGATHA", text: "[11:43] Oh, whoa!" },
        { speaker: "RAGATHA", text: "[11:44] Kaufmo, listen -- I know we didn't always get along, like when you called me out for fake-laughing at your jokes." },
        { speaker: "RAGATHA", text: "[11:50] I swear, I really did think they were funny. I was just having a bit of a bad day!" },
        { speaker: "RAGATHA", text: "[11:54] [shouting, groaning]" },
        { speaker: "RAGATHA", text: "[11:57] [glitched groaning]" },
        { speaker: "RAGATHA", text: "[12:00] [glitched, stuttered audio] H-H-Hey, Pomni-i-i?" },
        { speaker: "RAGATHA", text: "[12:02] Do you think... you could..." },
        { speaker: "RAGATHA", text: "[12:05] perhaps help me out here?" },
        { speaker: "RAGATHA", text: "[12:08] I understand... if you don't... want to, though." },
        { speaker: "POMNI", text: "[12:13] Ow!" },
        { speaker: "POMNI", text: "[12:17] [whimpers] I'm sorry!" },
        { speaker: "POMNI", text: "[12:19] [panting]" },
        { speaker: "KAUFMO", text: "[12:21] [roars]" },
        { speaker: "POMNI", text: "[12:21] [yelps]" },
        { speaker: "POMNI", text: "[12:23] [shouting, panting]" },
        { speaker: "MUSIC", text: "[12:25] [dramatic music plays]" },
        { speaker: "MUSIC", text: "[12:37] [curious music plays]" },
        { speaker: "KAUFMO", text: "[12:37] [growls]" },
        { speaker: "POMNI", text: "[12:49] [groans, exclaims softly]" },
        { speaker: "ZOOBLE", text: "[12:54] [screaming]" },
        { speaker: "KINGER", text: "[12:55] I don't know what I'm looking at here." },
        { speaker: "GANGLE", text: "[12:58] We saw a gloink carry one of Zooble's pieces down there, remember?" },
        { speaker: "KINGER", text: "[13:02] Oh, yeah." },
        { speaker: "KINGER", text: "[13:02] Thank you for the recap." },
        { speaker: "KINGER", text: "[13:07] Boy, we're not very good at this, are we?" },
        { speaker: "JAX", text: "[13:11] [panting]" },
        { speaker: "JAX", text: "[13:13] [groans] Ugh, sup..." },
        { speaker: "JAX", text: "[13:16] [groans] ...fellas?" },
        { speaker: "KINGER", text: "[13:17] Jax!!" },
        { speaker: "KINGER", text: "[13:17] We found the Zooble hole." },
        { speaker: "JAX", text: "[13:20] Cool. [groans]" },
        { speaker: "GANGLE", text: "[13:21] How is Kaufmo doing?" },
        { speaker: "GANGLE", text: "[13:23] I hope he's not still mad at me for not laughing at his jokes." },
        { speaker: "JAX", text: "[13:27] Oh, he's doing great." },
        { speaker: "JAX", text: "[13:29] In fact, I don't think I've ever seen him this happy before." },
        { speaker: "KINGER", text: "[13:32] Well, it's good to know he hasn't completely lost his mind." },
        { speaker: "KAUFMO", text: "[13:36] [growls]" },
        { speaker: "JAX", text: "[13:38] He actually asked me to give you this." },
        { speaker: "KINGER", text: "[13:41] Whoa!" },
        { speaker: "GANGLE", text: "[13:42] [wails, screams]" },
        { speaker: "SFX", text: "[13:50] [bell dings]" },
        { speaker: "KINGER AND GANGLE", text: "[13:57] [shouting]" },
        { speaker: "JAX", text: "[14:00] Heh!" },
        { speaker: "SFX", text: "[14:00] [pin clatters]" },
        { speaker: "SFX", text: "[14:02] [bell chimes]" },
        { speaker: "CAST", text: "[14:02] [brief applause]" },
        { speaker: "JAX", text: "[14:05] [grunts]" },
        { speaker: "SFX", text: "[14:07] [boink!]" },
        { speaker: "MUSIC", text: "[14:08] [ominous music plays]" },
        { speaker: "KINGER", text: "[14:12] [gasps]" },
        { speaker: "KINGER", text: "[14:12] An insect collection?" },
        { speaker: "GANGLE", text: "[14:15] I think it's a nest." },
        { speaker: "KINGER", text: "[14:19] [shrieks]" },
        { speaker: "POMNI", text: "[14:19] Hello?" },
        { speaker: "POMNI", text: "[14:22] R-R-Ragatha?" },
        { speaker: "POMNI", text: "[14:24] That was your name, right?" },
        { speaker: "RAGATHA", text: "[14:26] [voice glitching, stuttering continuously] O-O-Over here." },
        { speaker: "RAGATHA", text: "[14:31] [groans]" },
        { speaker: "POMNI", text: "[14:32] H-Hey, look, I-I'm..." },
        { speaker: "POMNI", text: "[14:35] I didn't mean to leave you behind like that." },
        { speaker: "POMNI", text: "[14:38] I -- [sighs] Just... look at my hand." },
        { speaker: "POMNI", text: "[14:41] I -- [whimpers] I didn't know what to do." },
        { speaker: "RAGATHA", text: "[14:44] [glitching continues] I-I-It's okay-y." },
        { speaker: "RAGATHA", text: "[14:46] What you need to do right now is find Caine." },
        { speaker: "RAGATHA", text: "[14:51] He'll be able to fix me up and take care of Kaufmo-o-o-o." },
        { speaker: "POMNI", text: "[14:56] O-O-Okay, but where can I find him?" },
        { speaker: "RAGATHA", text: "[15:00] Uh, I don't really know." },
        { speaker: "RAGATHA", text: "[15:04] Just look around and call for him, I suppose." },
        { speaker: "POMNI", text: "[15:08] Uh, okay, I'll get him." },
        { speaker: "POMNI", text: "[15:10] You just stay right there." },
        { speaker: "POMNI", text: "[15:12] Not that you can really move or anything." },
        { speaker: "POMNI", text: "[15:14] Uh, just hang in there. I'll be right back, I promise." },
        { speaker: "RAGATHA", text: "[15:17] Cool. Also, Pomni?" },
        { speaker: "RAGATHA", text: "[15:21] I'm sorry your first day here..." },
        { speaker: "RAGATHA", text: "[15:24] had to be so... terrible?" },
        { speaker: "POMNI", text: "[15:29] Uhhh, yeah, well, don't worry about it." },
        { speaker: "POMNI", text: "[15:34] I'm just gonna go get Caine now." },
        { speaker: "POMNI", text: "[15:40] Hello? Caine?" },
        { speaker: "POMNI", text: "[15:43] We have a bit of an issue here!" },
        { speaker: "MUSIC", text: "[15:48] [curious music]" },
        { speaker: "SFX", text: "[15:56] [boing!]" },
        { speaker: "POMNI", text: "[15:56] Ugh!" },
        { speaker: "POMNI", text: "[15:59] [stammers]" },
        { speaker: "SFX", text: "[15:59] [children laughing]" },
        { speaker: "POMNI", text: "[16:06] [rising scream]" },
        { speaker: "POMNI", text: "[16:06] [yelps]" },
        { speaker: "SFX", text: "[16:08] [boing!]" },
        { speaker: "POMNI", text: "[16:08] Agh!" },
        { speaker: "SFX", text: "[16:11] [glass shattering]" },
        { speaker: "POMNI", text: "[16:11] Hmm?" },
        { speaker: "POMNI", text: "[16:14] Caine?" },
        { speaker: "MUSIC", text: "[16:16] [suspenseful music plays]" },
        { speaker: "KAUFMO", text: "[16:16] [growling]" },
        { speaker: "SFX", text: "[16:18] [distorted whooshing, ringing]" },
        { speaker: "POMNI", text: "[16:21] [laughs nervously]" },
        { speaker: "POMNI", text: "[16:22] [screams] [panting]" },
        { speaker: "GLOINK QUEEN", text: "[16:26] [growls] What form of non-gloinkinian mass..." },
        { speaker: "GLOINK QUEEN", text: "[16:31] dares presume presence in the nest of the Gloink Queen?" },
        { speaker: "JAX", text: "[16:37] Oh, is that who you are?" },
        { speaker: "JAX", text: "[16:39] You know, you could have asked for my consent before forcing me to see something so completely and utterly disgusting." },
        { speaker: "GLOINK QUEEN", text: "[16:44] [grumbles] How despicable." },
        { speaker: "GLOINK QUEEN", text: "[16:48] A rabbitoid that runs its mouth in the presence of my royal figure." },
        { speaker: "KINGER", text: "[16:54] Well, as a royal myself, I would like to kindly ask if --" },
        { speaker: "KINGER", text: "[16:58] Oh, look, there's Zooble." },
        { speaker: "KINGER", text: "[16:58] Hi, Zooble." },
        { speaker: "ZOOBLE", text: "[17:01] Agh! Help me, you idiots!" },
        { speaker: "JAX", text: "[17:03] Kinda rude, Zooble." },
        { speaker: "JAX", text: "[17:03] Now I don't wanna help you." },
        { speaker: "GANGLE", text: "[17:10] [groans] Oh, I always lose." },
        { speaker: "KINGER", text: "[17:12] Yes!" },
        { speaker: "SFX", text: "[17:13] [gloinks squeaking, boinking]" },
        { speaker: "KINGER", text: "[17:15] Gotcha!" },
        { speaker: "KINGER", text: "[17:19] [befuddled] Oh." },
        { speaker: "ZOOBLE", text: "[17:20] Hey! Kinger, you motherf--" },
        { speaker: "GLOINK QUEEN", text: "[17:22] [growls]" },
        { speaker: "GANGLE", text: "[17:24] Eee!" },
        { speaker: "JAX", text: "[17:24] Eh, they'll be fine." },
        { speaker: "SFX", text: "[17:26] [Gloink squeaking rapidly]" },
        { speaker: "POMNI", text: "[17:31] [panting]" },
        { speaker: "KAUFMO", text: "[17:31] [growling]" },
        { speaker: "POMNI", text: "[17:33] Gotta hide, gotta hide, gotta hide." },
        { speaker: "POMNI", text: "[17:35] [gasps]" },
        { speaker: "MUSIC", text: "[17:37] [pensive music plays]" },
        { speaker: "KAUFMO", text: "[17:42] [growls]" },
        { speaker: "MUSIC", text: "[17:44] [sneaky music plays]" },
        { speaker: "SFX", text: "[17:50] [monkeys hooting, shrieking]" },
        { speaker: "POMNI", text: "[18:11] God, where is Caine?" },
        { speaker: "MUSIC", text: "[18:17] [rising tense music plays]" },
        { speaker: "KAUFMO", text: "[18:20] [growls]" },
        { speaker: "POMNI", text: "[18:22] [exclaims softly]" },
        { speaker: "MUSIC", text: "[18:26] [music stops]" },
        { speaker: "MUSIC", text: "[18:30] [eerie music plays]" },
        { speaker: "POMNI", text: "[18:36] Huh?" },
        { speaker: "POMNI", text: "[18:38] [panting frantically]" },
        { speaker: "POMNI", text: "[18:41] [groans] [panting]" },
        { speaker: "SFX", text: "[18:49] [Gloink boinking softly]" },
        { speaker: "GLOINK QUEEN", text: "[18:54] You foolish assortment of colorful characters!" },
        { speaker: "GLOINK QUEEN", text: "[18:59] Do you not realize that everything must be gloinks?" },
        { speaker: "GLOINK QUEEN", text: "[19:03] I am gloinks." },
        { speaker: "GLOINK QUEEN", text: "[19:05] You will be gloinks." },
        { speaker: "GLOINK QUEEN", text: "[19:08] God will be gloinks-uh!" },
        { speaker: "JAX", text: "[19:12] This is dumb and weird." },
        { speaker: "GLOINK QUEEN", text: "[19:14] Well, b-- Uh-- Y-Yet, you're still watching it!" },
        { speaker: "JAX", text: "[19:19] I'm not here for the adventure or anything. I'm just here to hide from the--" },
        { speaker: "KINGER", text: "[19:26] Oh, thank God you're okay." },
        { speaker: "KINGER", text: "[19:28] You didn't experience a game show in there, did you?" },
        { speaker: "ZOOBLE", text: "[19:31] Uh, I-- What are you talking about?" },
        { speaker: "GLOINK QUEEN", text: "[19:36] [groaning]" },
        { speaker: "SFX", text: "[19:38] [boink!] [bonk!] [poke!] [sproing!]" },
        { speaker: "GANGLE", text: "[19:41] What's happening?" },
        { speaker: "JAX", text: "[19:41] It's just Kaufmo." },
        { speaker: "JAX", text: "[19:43] Don't worry about it." },
        { speaker: "GANGLE", text: "[19:46] Kaufmo abstracted?!" },
        { speaker: "JAX", text: "[19:46] Nah, he's fine." },
        { speaker: "KINGER", text: "[19:49] You're right!" },
        { speaker: "KINGER", text: "[19:49] How are we gonna get outta here?!" },
        { speaker: "ZOOBLE", text: "[19:52] Guys, over there." },
        { speaker: "KINGER", text: "[19:56] Huh." },
        { speaker: "GLOINK QUEEN", text: "[19:57] [groaning]" },
        { speaker: "JAX", text: "[19:57] Ladies first." },
        { speaker: "JAX", text: "[19:59] No, wait, why would I say that?" },
        { speaker: "GANGLE", text: "[19:59] Agh!" },
        { speaker: "ZOOBLE", text: "[20:06] Wait, Pomni's not even here?" },
        { speaker: "ZOOBLE", text: "[20:09] Wasn't this whole thing for her?" },
        { speaker: "JAX", text: "[20:09] Be quiet." },
        { speaker: "JAX", text: "[20:11] I can't hear the escalator." }
      ],
      outro: [
        { speaker: "POMNI", text: "[20:13] [panting]" },
        { speaker: "MUSIC", text: "[20:15] [tense music plays]" },
        { speaker: "POMNI", text: "[20:18] [gasps, whimpers]" },
        { speaker: "POMNI", text: "[20:20] [whimpering frantically]" },
        { speaker: "POMNI", text: "[20:24] [exclaims angrily] [panting]" },
        { speaker: "POMNI", text: "[20:32] [groans, screams through teeth]" },
        { speaker: "POMNI", text: "[20:43] [shouts]" },
        { speaker: "MUSIC", text: "[20:52] [dark music plays]" },
        { speaker: "POMNI", text: "[20:57] [cackles wildly]" },
        { speaker: "SFX", text: "[21:07] [wooden boards creaking]" },
        { speaker: "MUSIC", text: "[21:20] [sweeping, awe-inspiring music plays]" },
        { speaker: "MUSIC", text: "[21:22] [choir vocalizing]" },
        { speaker: "MUSIC", text: "[21:43] [music fades]" },
        { speaker: "CAST", text: "[21:43] [indistinct chatter]" },
        { speaker: "CAINE AND BUBBLE", text: "[21:46] [both laughing]" },
        { speaker: "CAINE", text: "[21:48] Oh, Bubble, you always know how to make me say this exact sentence." },
        { speaker: "SFX", text: "[21:53] [goofy cartoon sound effects playing]" },
        { speaker: "CAINE", text: "[21:53] Gasp!" },
        { speaker: "CAINE", text: "[21:55] An alert on my WackyWatch at this hour?" },
        { speaker: "CAINE", text: "[22:00] Oh, no -- someone's venturing out into the void!" },
        { speaker: "CAINE", text: "[22:03] They'll get totally spoiled!" },
        { speaker: "CAINE", text: "[22:11] There you go!" },
        { speaker: "CAINE", text: "[22:15] Now, what the heck happened around here?" },
        { speaker: "CAINE", text: "[22:18] Oh, yeah -- my doing." },
        { speaker: "KINGER", text: "[22:18] Caine!" },
        { speaker: "KINGER", text: "[22:21] Kaufmo went through a sort of Kaufmosis and abstracted!" },
        { speaker: "CAINE", text: "[22:24] Kaufmo abstracted?" },
        { speaker: "CAINE", text: "[22:26] [exaggerated] Why didn't anybody tell me?" },
        { speaker: "SFX", text: "[22:28] [boing!] [whoop!] [bonk!]" },
        { speaker: "KAUFMO", text: "[22:32] [growling]" },
        { speaker: "CAINE", text: "[22:32] And into the cellar you go." },
        { speaker: "SFX", text: "[22:35] [water lapping]" },
        { speaker: "SFX", text: "[22:35] [eerie low rumbling]" },
        { speaker: "ZOOBLE", text: "[22:39] Man, I can't believe Kaufmo just gave up like that." },
        { speaker: "ZOOBLE", text: "[22:44] I mean, no offense, Kinger, but I always thought you would be next." },
        { speaker: "KINGER", text: "[22:47] Thank you." },
        { speaker: "JAX", text: "[22:47] Guess it just goes to show you can't rely on Kinger for anything." },
        { speaker: "RAGATHA", text: "[22:52] [voice glitching, stuttering] I am in so much pain!" },
        { speaker: "CAINE", text: "[22:56] Oop!" },
        { speaker: "CAINE", text: "[23:07] I do have to apologize for lying about the exit." },
        { speaker: "CAINE", text: "[23:12] I knew how much all of you have been wanting there to be one, but, you know, I was having so much trouble figuring out what to put on the other side and ended up never quite finishing it." },
        { speaker: "CAINE", text: "[23:23] And you know how I never like letting people see my unfinished work -- especially if it leads you out into the void." },
        { speaker: "CAINE", text: "[23:31] Anyway, it looks like you defeated the Gloink Queen, so I guess the adventure's over." },
        { speaker: "CAINE", text: "[23:35] Your reward is a delicious digital feast cooked by our head Bubble Chef." },
        { speaker: "BUBBLE", text: "[23:40] Made with all the love I'm legally allowed to give." },
        { speaker: "JAX", text: "[23:44] You know, I am pretty hungry." },
        { speaker: "ZOOBLE", text: "[23:46] You didn't even do anything." },
        { speaker: "JAX", text: "[23:48] So, what? I can still be hungry." },
        { speaker: "KINGER", text: "[23:50] Well, not really, 'cause we don't need to eat, drink, or sleep in this digital world." },
        { speaker: "KINGER", text: "[23:54] So the digital food here only gives off the virtual sensation of eating without any of the nutritional benefits." },
        { speaker: "JAX", text: "[24:01] Sheesh, lay off it." },
        { speaker: "JAX", text: "[24:02] Since when are you an expert on the digital world?" },
        { speaker: "KINGER", text: "[24:05] Expert on the what?" },
        { speaker: "MUSIC", text: "[24:07] [cheerful, wry music]" },
        { speaker: "MUSIC", text: "[24:13] [majestic, sweeping music]" },
        { speaker: "MUSIC", text: "[24:13] [choir vocalizing]" },
        { speaker: "MUSIC", text: "[24:46] [music stops]" },
        { speaker: "MUSIC", text: "[24:49] [sweeping music crescendos]" },
        { speaker: "MUSIC", text: "[24:58] [upbeat, jazzy music plays]" }
      ]
    },
    2: {
      title: "Épisode 2: Canyon des Sucreries",
      intro: [
        { speaker: "MUSIC", text: "[00:00] [peppy electronic music plays]" },
        { speaker: "MUSIC", text: "[00:02] ♪♪" },
        { speaker: "SFX", text: "[00:11] [voices echoing throughout]" },
        { speaker: "CAINE", text: "[00:11] Welcome to the Amazing Digital Circus!" },
        { speaker: "JAX", text: "[00:15] Pomni." },
        { speaker: "CAINE", text: "[00:16] Pomni." },
        { speaker: "RAGATHA", text: "[00:16] Pomni." },
        { speaker: "JAX", text: "[00:17] Pomni." },
        { speaker: "RAGATHA", text: "[00:17] Pomni..." },
        { speaker: "CAINE", text: "[00:19] Pomni!" },
        { speaker: "RAGATHA", text: "[00:19] Pomni!" },
        { speaker: "JAX", text: "[00:20] Pomni." },
        { speaker: "CAINE", text: "[00:20] Pomni!" },
        { speaker: "RAGATHA", text: "[00:22] Pomni!" },
        { speaker: "POMNI", text: "[00:30] Hello?" },
        { speaker: "SFX", text: "[00:34] [heartbeat thudding]" },
        { speaker: "MUSIC", text: "[00:36] [dark, ugly music plays]" },
        { speaker: "MUSIC", text: "[00:39] ♪♪" },
        { speaker: "POMNI", text: "[00:43] [screams]" },
        { speaker: "POMNI", text: "[00:43] No! No! No!" },
        { speaker: "POMNI", text: "[00:45] [stammers] Caine!" },
        { speaker: "POMNI", text: "[00:46] Somebody, help me!" },
        { speaker: "POMNI", text: "[00:48] Please!" },
        { speaker: "MUSIC", text: "[00:50] ♪♪" },
        { speaker: "POMNI", text: "[00:54] [shrieks]" },
        { speaker: "POMNI", text: "[00:56] No! No!" },
        { speaker: "CAINE", text: "[00:56] [laughs]" },
        { speaker: "CAINE", text: "[00:58] Looks like our new friend's already abstracted." },
        { speaker: "JAX", text: "[01:01] [chuckles] Well, I guess we're not all cut out for it." },
        { speaker: "JAX", text: "[01:03] I don't even remember her name, honestly." },
        { speaker: "MUSIC", text: "[01:06] ♪♪" },
        { speaker: "SFX", text: "[01:20] [doorbell rings]" },
        { speaker: "POMNI", text: "[01:20] [yelps] [wailing]" },
        { speaker: "POMNI", text: "[01:24] [groans]" },
        { speaker: "POMNI", text: "[01:24] Huh?" },
        { speaker: "RAGATHA", text: "[01:30] Hey, Pomni." },
        { speaker: "RAGATHA", text: "[01:30] How'd you sleep?" },
        { speaker: "RAGATHA", text: "[01:33] Are you still sleeping?" },
        { speaker: "RAGATHA", text: "[01:35] I'll let you get back to it, if you are." },
        { speaker: "RAGATHA", text: "[01:39] There she is." },
        { speaker: "RAGATHA", text: "[01:39] Hope you're doin' all right." },
        { speaker: "RAGATHA", text: "[01:41] I know yesterday was a bit of a doozy." },
        { speaker: "POMNI", text: "[01:44] “A doozy.”" },
        { speaker: "RAGATHA", text: "[01:46] Oh, and don't worry about the whole “abandoning me for the exit” thing." },
        { speaker: "RAGATHA", text: "[01:50] It's perfectly understandable what you were going through at the time," },
        { speaker: "RAGATHA", text: "[01:53] and there's no hard feelings." },
        { speaker: "RAGATHA", text: "[01:55] [laughs]" },
        { speaker: "RAGATHA", text: "[01:55] Yer all good." },
        { speaker: "POMNI", text: "[01:59] Huh?" },
        { speaker: "RAGATHA", text: "[02:01] Uh, well, let's forget about all that." },
        { speaker: "RAGATHA", text: "[02:04] Caine's got a new adventure today," },
        { speaker: "RAGATHA", text: "[02:04] and judging by what he's been teasing," },
        { speaker: "RAGATHA", text: "[02:08] it seems like it's gonna be a fun one." },
        { speaker: "CAINE", text: "[02:11] Today's adventure is..." },
        { speaker: "CAINE", text: "[02:15] That's right!" },
        { speaker: "CAINE", text: "[02:17] The Candy Canyon Kingdom's been robbed of their most valuable resource --" },
        { speaker: "CAINE", text: "[02:21] maple syrup!" },
        { speaker: "CAINE", text: "[02:23] It's up to you to bring the rotten bandits who stole it" },
        { speaker: "CAINE", text: "[02:26] to sweet, buttery justice!" },
        { speaker: "JAX", text: "[02:28] An entire kingdom of candy?" },
        { speaker: "JAX", text: "[02:29] Sounds sticky." },
        { speaker: "RAGATHA", text: "[02:31] Very sticky, indeed." },
        { speaker: "BUBBLE", text: "[02:33] Sounds [BEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEP!]." },
        { speaker: "CAINE", text: "[02:39] Bubble, you can't say that." },
        { speaker: "ZOOBLE", text: "[02:40] Mmmmmmmmmmm, nope." },
        { speaker: "CAINE", text: "[02:42] Zooble, wait!" },
        { speaker: "CAINE", text: "[02:43] I-I'm testing out a new AI in this one!" },
        { speaker: "CAINE", text: "[02:45] It should be 57 times more immersive!" },
        { speaker: "JAX", text: "[02:48] Ooh, a new AI." },
        { speaker: "JAX", text: "[02:49] You don't want to mess with the new AI, Zoobie?" },
        { speaker: "ZOOBLE", text: "[02:52] Uh, yeah, no." },
        { speaker: "RAGATHA", text: "[02:57] Whoa, sounds fun." },
        { speaker: "RAGATHA", text: "[02:57] What do you think, Pomni?" },
        { speaker: "POMNI", text: "[03:00] So, our entire existence here..." },
        { speaker: "POMNI", text: "[03:04] is just LARPing?" },
        { speaker: "CAINE", text: "[03:07] W-Well, uh --" },
        { speaker: "CANDY KINGDOM NPC", text: "[03:07] Why are you all just standing there?!" },
        { speaker: "CANDY KINGDOM NPC", text: "[03:09] The -- The Canyon --" },
        { speaker: "CANDY KINGDOM NPC", text: "[03:09] C-Canyon Candy Kingdom needs you now!" },
        { speaker: "JAX", text: "[03:19] Hmm?" },
        { speaker: "JAX", text: "[03:19] Nah, thanks. I'm trying to quit." },
        { speaker: "MUSIC", text: "[03:21] [majestic music plays]" },
        { speaker: "MUSIC", text: "[03:24] ♪♪" },
        { speaker: "SFX", text: "[03:31] [cheers and applause]" },
        { speaker: "MUSIC", text: "[03:34] ♪♪" },
        { speaker: "RAGATHA", text: "[03:57] Wow, Kinger, check out this castle." },
        { speaker: "RAGATHA", text: "[04:00] It's amazing!" },
        { speaker: "KINGER", text: "[04:01] They've even got little candy bugs here." },
        { speaker: "KINGER", text: "[04:03] It's so beautiful." },
        { speaker: "RAGATHA", text: "[04:03] Yeah, this place is great!" },
        { speaker: "GANGLE", text: "[04:06] LOOK!!! It's the princess!!" },
        { speaker: "PRINCESS LOO", text: "[04:06] [whimpers]" },
        { speaker: "SFX", text: "[04:08] [trumpet fanfare plays]" },
        { speaker: "PRINCESS LOO", text: "[04:10] Ah, you must be the brave knights sent to us by God..." },
        { speaker: "PRINCESS LOO", text: "[04:15] to help us with our recent catastrophe." },
        { speaker: "RAGATHA", text: "[04:17] That's us, ma'am." },
        { speaker: "RAGATHA", text: "[04:18] Your kingdom's awesome, by the way." },
        { speaker: "RAGATHA", text: "[04:20] Love the vibe." },
        { speaker: "PRINCESS LOO", text: "[04:20] [giggles]" },
        { speaker: "PRINCESS LOO", text: "[04:22] I like you already." },
        { speaker: "RAGATHA", text: "[04:22] Look, Pomni." },
        { speaker: "RAGATHA", text: "[04:24] We're already friends with the princess." },
        { speaker: "POMNI", text: "[04:26] I'm not a child." },
        { speaker: "POMNI", text: "[04:26] You don't have to hype me up." },
        { speaker: "PRINCESS LOO", text: "[04:28] I assume you've been informed of your mission." },
        { speaker: "PRINCESS LOO", text: "[04:31] The bandits that robbed us used a modded syrup tanker," },
        { speaker: "PRINCESS LOO", text: "[04:34] so we figured the best way to go head-to-head with them" },
        { speaker: "PRINCESS LOO", text: "[04:36] is to give you a war rig of your own." },
        { speaker: "SFX", text: "[04:38] [truck engine rumbling]" },
        { speaker: "POMNI", text: "[04:40] Aagh!" },
        { speaker: "JAX", text: "[04:41] Ooh, violence." },
        { speaker: "POMNI", text: "[04:43] What time period is this supposed to be, again?" },
        { speaker: "PRINCESS LOO", text: "[04:46] Here's the key back into the kingdom for when you've secured the goods." },
        { speaker: "PRINCESS LOO", text: "[04:49] I trust you not to let it fall into the wrong hands?" },
        { speaker: "RAGATHA", text: "[04:51] You can count on me, Your Highness." },
        { speaker: "PRINCESS LOO", text: "[04:53] Oh, please." },
        { speaker: "PRINCESS LOO", text: "[04:53] Call me Loo." },
        { speaker: "RAGATHA", text: "[04:55] [chuckles]" },
        { speaker: "RAGATHA", text: "[04:55] Will do, Loo." },
        { speaker: "JAX", text: "[04:57] I call shotgun." },
        { speaker: "SFX", text: "[05:00] [goofy, distorted warble]" },
        { speaker: "JAX", text: "[05:00] Oh, God, is that the horn?" },
        { speaker: "JAX", text: "[05:02] [groans]" },
        { speaker: "JAX", text: "[05:02] That sucks." },
        { speaker: "JAX", text: "[05:04] Gangle, you drive." },
        { speaker: "PRINCESS LOO", text: "[05:08] Farewell, good knights." },
        { speaker: "PRINCESS LOO", text: "[05:10] I have every faith in you!" },
        { speaker: "SFX", text: "[05:12] [truck engine revs]" },
        { speaker: "MUSIC", text: "[05:13] ♪♪" },
        { speaker: "SFX", text: "[05:20] [truck horn warbles]" },
        { speaker: "MUSIC", text: "[05:22] ♪♪" },
        { speaker: "SFX", text: "[05:27] [insects chirping]" },
        { speaker: "BANDIT 1", text: "[05:31] D'you think your mum's gonna pull through if we get all this back to the village?" },
        { speaker: "GUMMIGOO", text: "[05:34] I'm sure she will." },
        { speaker: "GUMMIGOO", text: "[05:35] This much syrup would save hundreds of people." },
        { speaker: "BANDIT 2", text: "[05:37] We won't know for sure until we get back to the village." },
        { speaker: "BANDIT 2", text: "[05:40] She's a fighter, though." },
        { speaker: "BANDIT 2", text: "[05:41] She taught me everything I know." },
        { speaker: "GUMMIGOO", text: "[05:46] Oy! Don't get too comfy, lads." },
        { speaker: "GUMMIGOO", text: "[05:48] Looks like they've sent someone after us." },
        { speaker: "JAX", text: "[05:57] All right, Gangle, when we catch up to 'em," },
        { speaker: "JAX", text: "[05:59] I'll jump over, crawl inside," },
        { speaker: "JAX", text: "[06:01] and shoot 'em repeatedly until they're unrecognizable." },
        { speaker: "GANGLE", text: "[06:04] I feel like that violates some kind of convention." },
        { speaker: "JAX", text: "[06:06] You're violating my ears with your clap-back." },
        { speaker: "JAX", text: "[06:09] Get driving, driver!" },
        { speaker: "RAGATHA", text: "[06:10] So, Pomni, I'm sure there's some way you could help out here." },
        { speaker: "RAGATHA", text: "[06:14] Maybe when we catch up to them, we could --" },
        { speaker: "POMNI", text: "[06:15] We could be assertive. Like this!" },
        { speaker: "POMNI", text: "[06:17] Hey!" },
        { speaker: "POMNI", text: "[06:17] [screams]" },
        { speaker: "RAGATHA", text: "[06:19] Jax!" },
        { speaker: "POMNI", text: "[06:22] [groaning]" },
        { speaker: "JAX", text: "[06:25] Ah, that's perfect!" },
        { speaker: "JAX", text: "[06:25] Just hold that pose." },
        { speaker: "JAX", text: "[06:27] I gotta get something." },
        { speaker: "POMNI", text: "[06:28] Jax, you [BOINK!]" },
        { speaker: "JAX", text: "[06:31] You know, I swear there was some kind of bazooka back here, but..." },
        { speaker: "JAX", text: "[06:34] [scoffs]" },
        { speaker: "JAX", text: "[06:34] ...I'm having such trouble finding it." },
        { speaker: "KINGER", text: "[06:37] Pomni, take this!" },
        { speaker: "POMNI", text: "[06:39] Egh..." },
        { speaker: "JAX", text: "[06:39] Here it is." },
        { speaker: "JAX", text: "[06:40] All right, Pomni, you just stay like that," },
        { speaker: "JAX", text: "[06:40] and I'll cross over you." },
        { speaker: "POMNI", text: "[06:44] Are you kidding me?!" },
        { speaker: "POMNI", text: "[06:46] Ow!" },
        { speaker: "JAX", text: "[06:48] Nice going, Pomni --" },
        { speaker: "JAX", text: "[06:48] now I have no bridge." },
        { speaker: "GUMMIGOO", text: "[06:51] Ah-hah! Gotcha!" },
        { speaker: "SFX", text: "[06:54] [bang!] [air whistling]" },
        { speaker: "BANDIT 1", text: "[06:54] Me arms aren't long enou-- Whoa!" },
        { speaker: "MUSIC", text: "[06:55] ♪♪" },
        { speaker: "MUSIC", text: "[07:00] [brass hit!]" },
        { speaker: "GUMMIGOO", text: "[07:02] This lot's trouble." },
        { speaker: "GUMMIGOO", text: "[07:05] Let's see how their rig does on those rocks around there." },
        { speaker: "BANDIT 1", text: "[07:08] Me arms aren't short enough to shift the gear." },
        { speaker: "MUSIC", text: "[07:10] ♪♪" },
        { speaker: "MUSIC", text: "[07:15] [rapid brass hits!]" },
        { speaker: "JAX", text: "[07:18] Ooh, now we're cookin'!" },
        { speaker: "JAX", text: "[07:21] Hey! Ribbons! Up and at 'em!" },
        { speaker: "GANGLE", text: "[07:22] I don't think we --" },
        { speaker: "JAX", text: "[07:23] Aren't you supposed to be submissive and agreeable?" },
        { speaker: "JAX", text: "[07:26] Move it!" },
        { speaker: "GANGLE", text: "[07:28] [wailing]" },
        { speaker: "MUSIC", text: "[07:30] ♪♪" },
        { speaker: "GUMMIGOO", text: "[07:33] Oh, these fellas just don't know when to quit, do they?" },
        { speaker: "MUSIC", text: "[07:37] [rapid brass hits!]" },
        { speaker: "BANDIT 1", text: "[07:38] Hey! Quit muckin' about and get back up here!" },
        { speaker: "BANDIT 2", text: "[07:41] Oh, yeah. Right." },
        { speaker: "RAGATHA", text: "[07:43] [groans]" },
        { speaker: "RAGATHA", text: "[07:43] Everyone all right?" },
        { speaker: "KINGER", text: "[07:45] Can you repeat the question?" },
        { speaker: "KINGER", text: "[07:46] I couldn't hear you over the knives." },
        { speaker: "JAX", text: "[07:48] Hey, Gangle." },
        { speaker: "JAX", text: "[07:49] You should ram into 'em." },
        { speaker: "GANGLE", text: "[07:49] What?" },
        { speaker: "RAGATHA", text: "[07:51] You should NOT ram them!" },
        { speaker: "RAGATHA", text: "[07:52] Pomni's still on board!" },
        { speaker: "SFX", text: "[07:52] [crash!]" },
        { speaker: "JAX", text: "[07:55] Do it." },
        { speaker: "JAX", text: "[07:55] It'll be epic." },
        { speaker: "RAGATHA", text: "[07:56] Why are there so many knives back here?!" },
        { speaker: "JAX", text: "[07:58] Do it, or I'll tell Ragatha about the figurine thing." },
        { speaker: "GANGLE", text: "[08:01] Guh!" },
        { speaker: "GANGLE", text: "[08:01] [laughs nervously]" },
        { speaker: "MUSIC", text: "[08:03] ♪♪" },
        { speaker: "POMNI", text: "[08:06] Are you guys trying to [BOINK!] kill me?!" },
        { speaker: "GUMMIGOO", text: "[08:09] These guys are whack jobs!" },
        { speaker: "GUMMIGOO", text: "[08:11] Let's give them some of this." },
        { speaker: "JAX", text: "[08:14] Aww, no more ramming?" },
        { speaker: "JAX", text: "[08:16] Guess I HAVE to tell Ragatha about the thing now." },
        { speaker: "GANGLE", text: "[08:18] What?!" },
        { speaker: "JAX", text: "[08:20] Oh. You're still up here." },
        { speaker: "POMNI", text: "[08:21] Guuuuuuys?" },
        { speaker: "KINGER", text: "[08:22] Pomni, take this!" },
        { speaker: "RAGATHA", text: "[08:26] Uh, hey, Kinger," },
        { speaker: "RAGATHA", text: "[08:26] is that rope attached to anything?" },
        { speaker: "KINGER", text: "[08:30] Uhhhh." },
        { speaker: "KINGER", text: "[08:31] I don't know." },
        { speaker: "KINGER", text: "[08:31] Let me check." },
        { speaker: "SFX", text: "[08:34] [clang!]" },
        { speaker: "POMNI", text: "[08:37] [grunts]" },
        { speaker: "MUSIC", text: "[08:39] ♪♪" },
        { speaker: "POMNI", text: "[08:48] W-W-What? Wha?" },
        { speaker: "JAX", text: "[08:50] I blame YOU for this." },
        { speaker: "SFX", text: "[08:51] [SPLORCH!]" },
        { speaker: "SFX", text: "[08:54] [tires squealing]" },
        { speaker: "POMNI", text: "[09:00] [screams]" },
        { speaker: "GUMMIGOO", text: "[09:00] [grunts]" },
        { speaker: "GUMMIGOO", text: "[09:05] AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
        { speaker: "GUMMIGOO", text: "[09:08] AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHH--" },
        { speaker: "GUMMIGOO", text: "[09:11] Oog! Ack!" },
        { speaker: "GUMMIGOO", text: "[09:11] [grunts]" },
        { speaker: "GUMMIGOO", text: "[09:13] [wailing] OHHHH, NO!!!" },
        { speaker: "GUMMIGOO", text: "[09:15] [hollering]" },
        { speaker: "GUMMIGOO", text: "[09:18] [grunts]" },
        { speaker: "GUMMIGOO", text: "[09:20] [groans]" },
        { speaker: "GUMMIGOO", text: "[09:23] [grunts softly]" },
        { speaker: "GUMMIGOO", text: "[09:27] [voice echoing] Lads?" },
        { speaker: "GUMMIGOO", text: "[09:28] [mutters softly]" },
        { speaker: "GUMMIGOO", text: "[09:33] Hello?" },
        { speaker: "MUSIC", text: "[09:34] [eerie ambient music plays]" },
        { speaker: "GUMMIGOO", text: "[09:36] Anyone?" },
        { speaker: "SFX", text: "[09:38] [breathing shakily throughout]" },
        { speaker: "MUSIC", text: "[09:41] ♪♪" },
        { speaker: "GUMMIGOO", text: "[10:05] Huh?" },
        { speaker: "MUSIC", text: "[10:06] ♪♪" },
        { speaker: "GUMMIGOO", text: "[10:14] Uh..." },
        { speaker: "MUSIC", text: "[10:16] ♪♪" },
        { speaker: "GUMMIGOO", text: "[10:20] [gasps]" },
        { speaker: "GUMMIGOO", text: "[10:20] [breathing heavily]" },
        { speaker: "MUSIC", text: "[10:23] ♪♪" },
        { speaker: "POMNI", text: "[10:43] Guh! [wails]" },
        { speaker: "POMNI", text: "[10:45] [grunts]" },
        { speaker: "GUMMIGOO", text: "[10:45] [gasps]" },
        { speaker: "GUMMIGOO", text: "[10:46] [groans]" },
        { speaker: "GUMMIGOO", text: "[10:49] Huh?" },
        { speaker: "GUMMIGOO", text: "[10:51] Where are we?" },
        { speaker: "GUMMIGOO", text: "[10:53] W-What's all this?" },
        { speaker: "POMNI", text: "[10:56] I-I don't know." },
        { speaker: "POMNI", text: "[10:59] W-We're somewhere under the map, I think." },
        { speaker: "GUMMIGOO", text: "[11:02] “Map”?" },
        { speaker: "GUMMIGOO", text: "[11:06] Why aren't you or any of your crew up here?" },
        { speaker: "POMNI", text: "[11:10] I-I'm not sure." },
        { speaker: "POMNI", text: "[11:12] Be-- Because we're not, uh, NPCs?" },
        { speaker: "GUMMIGOO", text: "[11:16] “NPCs”?" },
        { speaker: "GUMMIGOO", text: "[11:16] What are you on about?" },
        { speaker: "GUMMIGOO", text: "[11:21] What are you people?" },
        { speaker: "MUSIC", text: "[11:23] ♪♪" },
        { speaker: "GUMMIGOO", text: "[11:26] What am I?" },
        { speaker: "MUSIC", text: "[11:28] ♪♪" },
        { speaker: "GUMMIGOO", text: "[11:32] Where's Mum?" },
        { speaker: "POMNI", text: "[11:33] Y-You have a mom?" },
        { speaker: "GUMMIGOO", text: "[11:35] Shouldn't she be here with everyone else?" },
        { speaker: "GUMMIGOO", text: "[11:38] [shakily]" },
        { speaker: "GUMMIGOO", text: "[11:38] I can't even remember her face." },
        { speaker: "GUMMIGOO", text: "[11:41] Did she ever have a face?" },
        { speaker: "GUMMIGOO", text: "[11:42] Was anything ever real?" },
        { speaker: "POMNI", text: "[11:42] Okay, w-w-wait." },
        { speaker: "POMNI", text: "[11:44] Don't -- Don't think about that." },
        { speaker: "POMNI", text: "[11:46] I-I-I think there..." },
        { speaker: "POMNI", text: "[11:49] must be a way to launch ourselves back up." },
        { speaker: "POMNI", text: "[11:52] Right?" },
        { speaker: "GUMMIGOO", text: "[11:52] [hyperventilating]" },
        { speaker: "MUSIC", text: "[11:54] ♪♪" },
        { speaker: "GUMMIGOO", text: "[11:59] I want you to tell me exactly what I am." },
        { speaker: "MUSIC", text: "[12:02] ♪♪" },
        { speaker: "SFX", text: "[12:08] [fudge splorching]" },
        { speaker: "MUSIC", text: "[12:10] [whimsical music plays]" },
        { speaker: "MUSIC", text: "[12:12] ♪♪" },
        { speaker: "RAGATHA", text: "[12:14] [groans]" },
        { speaker: "RAGATHA", text: "[12:14] Is everybody okay?" },
        { speaker: "GANGLE", text: "[12:17] No..." },
        { speaker: "RAGATHA", text: "[12:18] Oh, man." },
        { speaker: "RAGATHA", text: "[12:19] Poor Pomni." },
        { speaker: "RAGATHA", text: "[12:21] I hope she's all right." },
        { speaker: "JAX", text: "[12:22] “Poor Pomni”?" },
        { speaker: "JAX", text: "[12:23] How about “poor us”?" },
        { speaker: "JAX", text: "[12:25] We're one tanker away from being Augustus Glooped!" },
        { speaker: "GANGLE", text: "[12:30] [groaning]" },
        { speaker: "THE FUDGE", text: "[12:32] Oh, what's that?" },
        { speaker: "THE FUDGE", text: "[12:33] Do my eyes deceive me?" },
        { speaker: "THE FUDGE", text: "[12:36] A delicious gift from within the kingdom gates?" },
        { speaker: "THE FUDGE", text: "[12:40] Don't mind if I do." },
        { speaker: "RAGATHA", text: "[12:42] Whoa, whoa, whoa, whoa, buddy!" },
        { speaker: "RAGATHA", text: "[12:44] We're not food! We're not candy!" },
        { speaker: "RAGATHA", text: "[12:44] We're none of that!" },
        { speaker: "RAGATHA", text: "[12:46] You don't want to eat us!" },
        { speaker: "THE FUDGE", text: "[12:47] Wh-- You're not candy?" },
        { speaker: "THE FUDGE", text: "[12:50] How am I expected to eat something that's not made of candy?" },
        { speaker: "THE FUDGE", text: "[12:54] I'm sorry." },
        { speaker: "KINGER", text: "[12:56] Pomni always seems to miss the big, gloopy monsters." },
        { speaker: "RAGATHA", text: "[12:59] Who are you, anyway?" },
        { speaker: "THE FUDGE", text: "[13:01] I am the Fudge." },
        { speaker: "THE FUDGE", text: "[13:04] I used to live within the kingdom walls," },
        { speaker: "THE FUDGE", text: "[13:07] but I was banished by that rotten princess" },
        { speaker: "THE FUDGE", text: "[13:10] after I ate too many of the delicious townfolk." },
        { speaker: "THE FUDGE", text: "[13:15] Oh, they were so delicious." },
        { speaker: "THE FUDGE", text: "[13:17] Sometimes I can hear them..." },
        { speaker: "THE FUDGE", text: "[13:17] calling to me." },
        { speaker: "SFX", text: "[13:21] [townsfolk screaming]" },
        { speaker: "RAGATHA", text: "[13:22] Oh, God." },
        { speaker: "RAGATHA", text: "[13:24] That just sounds like murder." },
        { speaker: "THE FUDGE", text: "[13:26] Is it really murder if it's delicious?" },
        { speaker: "THE FUDGE", text: "[13:29] Answer me that." },
        { speaker: "JAX", text: "[13:30] You make a great point." },
        { speaker: "RAGATHA", text: "[13:30] Uh, no, bad point!" },
        { speaker: "JAX", text: "[13:33] Why don't you leave this to me before I start thinking your hair looks like licorice?" },
        { speaker: "RAGATHA", text: "[13:37] Jax!" },
        { speaker: "KINGER", text: "[13:38] Oh, wow, it kind of does." },
        { speaker: "RAGATHA", text: "[13:38] Stop!" },
        { speaker: "JAX", text: "[13:41] Well, Mr. Fudge, you seem like an upstanding guy with real noble goals." },
        { speaker: "THE FUDGE", text: "[13:45] Oh, I'm not." },
        { speaker: "THE FUDGE", text: "[13:47] If you knew what I did in my free time --" },
        { speaker: "THE FUDGE", text: "[13:49] Oh, you'd be SICKENED!" },
        { speaker: "JAX", text: "[13:51] [clears throat]" },
        { speaker: "JAX", text: "[13:51] As I was saying." },
        { speaker: "JAX", text: "[13:53] I happen to know a way into the kingdom walls..." },
        { speaker: "JAX", text: "[13:56] if you'd be willing to help us out in return." },
        { speaker: "RAGATHA", text: "[13:58] Hey, when did you --" },
        { speaker: "JAX", text: "[13:58] Shut up, licorice hair." },
        { speaker: "KINGER", text: "[14:00] Here, hide it with this." },
        { speaker: "THE FUDGE", text: "[14:02] Oh, you must be some kind of master of unlocking things," },
        { speaker: "THE FUDGE", text: "[14:06] come to free me from my outdoor prison." },
        { speaker: "JAX", text: "[14:09] That's me." },
        { speaker: "JAX", text: "[14:10] All we need you to do is help us bring some dirty bandits to justice." },
        { speaker: "SFX", text: "[14:14] [air rushing]" },
        { speaker: "JAX", text: "[14:14] AUGH--" },
        { speaker: "JAX", text: "[14:19] I saw the reaper wink at me..." },
        { speaker: "RAGATHA", text: "[14:22] Wait, w-w-what just happened?" },
        { speaker: "SFX", text: "[14:33] [lollipop stick creaking]" },
        { speaker: "POMNI", text: "[14:38] Uhh..." },
        { speaker: "POMNI", text: "[14:40] y-you wanna try helping out at all?" },
        { speaker: "POMNI", text: "[14:43] [laughs nervously]" },
        { speaker: "POMNI", text: "[14:45] Or are you still..." },
        { speaker: "POMNI", text: "[14:52] Hey." },
        { speaker: "POMNI", text: "[14:53] You okay?" },
        { speaker: "GUMMIGOO", text: "[14:56] No." },
        { speaker: "POMNI", text: "[14:58] You wanna talk about it?" },
        { speaker: "GUMMIGOO", text: "[15:01] What is there to talk about?" },
        { speaker: "POMNI", text: "[15:04] I don't just want to leave you here." },
        { speaker: "GUMMIGOO", text: "[15:06] Why not?" },
        { speaker: "GUMMIGOO", text: "[15:09] I don't matter in the slightest." },
        { speaker: "GUMMIGOO", text: "[15:11] I'm nothing." },
        { speaker: "GUMMIGOO", text: "[15:13] My life, my memories..." },
        { speaker: "GUMMIGOO", text: "[15:15] ...my friends..." },
        { speaker: "GUMMIGOO", text: "[15:17] It's all fake." },
        { speaker: "POMNI", text: "[15:24] This may seem weird, but..." },
        { speaker: "POMNI", text: "[15:27] I think I know the feeling." },
        { speaker: "POMNI", text: "[15:31] Well, m-maybe not..." },
        { speaker: "POMNI", text: "[15:33] the e-exact feeling, but..." },
        { speaker: "POMNI", text: "[15:37] Feeling like you're nothing is..." },
        { speaker: "POMNI", text: "[15:39] kind of normal." },
        { speaker: "POMNI", text: "[15:40] I mean, people even feel like that" },
        { speaker: "POMNI", text: "[15:42] in the world I came from." },
        { speaker: "POMNI", text: "[15:46] But..." },
        { speaker: "POMNI", text: "[15:48] Y-you still care about your buddies up there, don't you?" },
        { speaker: "POMNI", text: "[15:52] I'm sure they still care about you." },
        { speaker: "GUMMIGOO", text: "[15:55] What does it matter?" },
        { speaker: "GUMMIGOO", text: "[15:57] What do we have when you people leave?" },
        { speaker: "GUMMIGOO", text: "[16:00] We're just obstacles..." },
        { speaker: "GUMMIGOO", text: "[16:03] created to be defeated and forgotten." },
        { speaker: "POMNI", text: "[16:06] Well..." },
        { speaker: "POMNI", text: "[16:09] You don't have to be." },
        { speaker: "POMNI", text: "[16:12] The -- The circus --" },
        { speaker: "POMNI", text: "[16:14] th-- the place I'm from?" },
        { speaker: "POMNI", text: "[16:16] Well, I --" },
        { speaker: "POMNI", text: "[16:17] I'm originally from somewhere else." },
        { speaker: "POMNI", text: "[16:20] But..." },
        { speaker: "POMNI", text: "[16:22] If it has to be my home..." },
        { speaker: "POMNI", text: "[16:25] ...Maybe it can be yours, too." },
        { speaker: "POMNI", text: "[16:27] The people there are... interesting..." },
        { speaker: "POMNI", text: "[16:30] at the very least." },
        { speaker: "POMNI", text: "[16:33] Maybe you..." },
        { speaker: "POMNI", text: "[16:36] [sighs]" },
        { speaker: "POMNI", text: "[16:37] ...Could be somebody real there." },
        { speaker: "GUMMIGOO", text: "[16:42] Why are you trying to cheer me up?" },
        { speaker: "GUMMIGOO", text: "[16:45] How does this benefit you at all?" },
        { speaker: "POMNI", text: "[16:49] I guess I just don't want you to feel like you're nothing." },
        { speaker: "POMNI", text: "[16:54] I don't want anybody to feel like that." },
        { speaker: "GUMMIGOO", text: "[16:57] But I'm not even a real person." },
        { speaker: "GUMMIGOO", text: "[17:00] Would I even belong?" },
        { speaker: "POMNI", text: "[17:02] I'm sure you wouldn't belong any less than me." },
        { speaker: "POMNI", text: "[17:05] [chuckles]" },
        { speaker: "POMNI", text: "[17:05] And..." },
        { speaker: "POMNI", text: "[17:07] I could use a friend." },
        { speaker: "GUMMIGOO", text: "[17:09] “A friend.”" },
        { speaker: "GUMMIGOO", text: "[17:12] You're a strange little character." },
        { speaker: "GUMMIGOO", text: "[17:15] Suppose I could give it a try." },
        { speaker: "GUMMIGOO", text: "[17:19] All I ask is that we don't tell the lads about this." },
        { speaker: "GUMMIGOO", text: "[17:22] They're a couple of bright-eyed yobbos," },
        { speaker: "GUMMIGOO", text: "[17:24] and I don't want to drag 'em down with me." },
        { speaker: "POMNI", text: "[17:26] [chuckles]" },
        { speaker: "POMNI", text: "[17:26] Yeah, that makes sense." },
        { speaker: "POMNI", text: "[17:28] What's your name, by the way?" },
        { speaker: "GUMMIGOO", text: "[17:31] Gummigoo." },
        { speaker: "POMNI", text: "[17:32] Wow, that's..." },
        { speaker: "POMNI", text: "[17:33] just about as dumb as my name." },
        { speaker: "GUMMIGOO", text: "[17:35] What'd you have in mind in terms of getting us out of here?" },
        { speaker: "POMNI", text: "[17:38] [stammers]" },
        { speaker: "POMNI", text: "[17:38] I don't know." },
        { speaker: "POMNI", text: "[17:41] M-M-Maybe some kind of glitch with the truck's collisions?" },
        { speaker: "POMNI", text: "[17:45] I'm not really sure how we could..." },
        { speaker: "POMNI", text: "[17:49] All right, I'm just throwing stuff at the wall here." },
        { speaker: "POMNI", text: "[17:53] If this doesn't work, we could try something else." },
        { speaker: "GUMMIGOO", text: "[17:55] You're the expert here." },
        { speaker: "POMNI", text: "[17:56] [laughs nervously]" },
        { speaker: "POMNI", text: "[17:56] I'm really not." },
        { speaker: "POMNI", text: "[17:58] But let's see how it goes." },
        { speaker: "SFX", text: "[18:00] [engine turns over]" },
        { speaker: "SFX", text: "[18:02] [blocks thudding]" },
        { speaker: "POMNI", text: "[18:03] I just realized, this might be a little vio--" },
        { speaker: "SFX", text: "[18:06] [KABOOM!!]" },
        { speaker: "MUSIC", text: "[18:08] [trippy music plays]" },
        { speaker: "MUSIC", text: "[18:11] ♪♪" },
        { speaker: "JAX", text: "[18:45] Gotta say, this is a lot more anti-climactic than I was hoping it'd be." },
        { speaker: "RAGATHA", text: "[18:49] What were you hoping for?" },
        { speaker: "JAX", text: "[18:51] You know, like, one big, final battle." },
        { speaker: "JAX", text: "[18:54] Bloodshed. Death. Chaos!" },
        { speaker: "JAX", text: "[18:56] Whatever." },
        { speaker: "GANGLE", text: "[18:57] Are you sure they disappeared?" },
        { speaker: "GANGLE", text: "[18:59] It wasn't that they fell off, or something?" },
        { speaker: "BANDIT 1", text: "[19:02] [stammers]" },
        { speaker: "BANDIT 1", text: "[19:02] I can't say for sure, but, uh --" },
        { speaker: "BANDIT 1", text: "[19:03] Yes, definitely." },
        { speaker: "BANDIT 2", text: "[19:05] It's not like the boss to vanish with a clown." },
        { speaker: "BANDIT 2", text: "[19:07] Very unusual." },
        { speaker: "RAGATHA", text: "[19:08] Well, that's... concerning." },
        { speaker: "KINGER", text: "[19:11] [muffled] Well, if worst comes to worst," },
        { speaker: "KINGER", text: "[19:13] we could always ask Caine to find her." },
        { speaker: "RAGATHA", text: "[19:16] I'm more worried she's having another horrible experience." },
        { speaker: "RAGATHA", text: "[19:19] She still seems really upset about what happened yesterday." },
        { speaker: "RAGATHA", text: "[19:22] I don't think she really likes me that much." },
        { speaker: "KINGER", text: "[19:25] It's a lot for anybody to go through." },
        { speaker: "KINGER", text: "[19:27] Don't take it too personally." },
        { speaker: "KINGER", text: "[19:28] I remember how long it took for you to adjust." },
        { speaker: "RAGATHA", text: "[19:31] O-Oh. Yeah." },
        { speaker: "RAGATHA", text: "[19:32] I'm surprised you remember that." },
        { speaker: "KINGER", text: "[19:36] [normal voice] Remember what?" },
        { speaker: "SFX", text: "[19:38] [muffled explosion]" },
        { speaker: "BANDIT 1", text: "[19:42] Do you guys have a second truck that flies?" },
        { speaker: "BANDIT 2", text: "[19:44] Yeah." },
        { speaker: "BANDIT 2", text: "[19:44] Oh, wait --" },
        { speaker: "BANDIT 2", text: "[19:44] No, we don't." },
        { speaker: "BANDIT 2", text: "[19:46] No, not at all." },
        { speaker: "SFX", text: "[19:46] [air rushing]" },
        { speaker: "JAX", text: "[19:49] [groans]" },
        { speaker: "JAX", text: "[19:49] Down I go." },
        { speaker: "MUSIC", text: "[19:55] [upbeat music plays]" },
        { speaker: "GUMMIGOO", text: "[19:59] [laughs]" },
        { speaker: "GUMMIGOO", text: "[19:59] Couldn't keep it in, could --" },
        { speaker: "GUMMIGOO", text: "[20:03] [rattles lips]" },
        { speaker: "RAGATHA", text: "[20:06] Uh, what's all this stuff?" },
        { speaker: "RAGATHA", text: "[20:09] Pomni! Are you okay?" },
        { speaker: "RAGATHA", text: "[20:11] W-What happened?" },
        { speaker: "POMNI", text: "[20:12] Yeah, I'm fine." },
        { speaker: "POMNI", text: "[20:14] I, uh -- I made a new friend." },
        { speaker: "BANDIT 1", text: "[20:17] Boss! Where have you been?" },
        { speaker: "BANDIT 1", text: "[20:19] We got fudged." },
        { speaker: "GUMMIGOO", text: "[20:20] You don't wanna know." },
        { speaker: "GUMMIGOO", text: "[20:22] Good to see you, lads." },
        { speaker: "MUSIC", text: "[20:23] ♪♪" },
        { speaker: "RAGATHA", text: "[20:27] Why are there two bad-guy trucks?" },
        { speaker: "MUSIC", text: "[20:30] ♪♪" },
        { speaker: "KINGER", text: "[20:35] This one's full of syrup, too." },
        { speaker: "GUMMIGOO", text: "[20:38] Oh, yeah. Suppose it is." },
        { speaker: "GUMMIGOO", text: "[20:40] Well, uh, you don't suppose my mates here could, uh," },
        { speaker: "GUMMIGOO", text: "[20:42] take this one back to the village, could they?" },
        { speaker: "RAGATHA", text: "[20:44] I guess." },
        { speaker: "RAGATHA", text: "[20:45] Since there's two of them," },
        { speaker: "RAGATHA", text: "[20:45] there'd be no real harm." },
        { speaker: "JAX", text: "[20:50] I'm so unbelievably disappointed right now." },
        { speaker: "RAGATHA", text: "[20:53] Well, maybe there'll be blood, death, and violence in the next adventure." },
        { speaker: "JAX", text: "[20:57] Ha-ha-ha-ha." },
        { speaker: "JAX", text: "[20:57] How wholesome." },
        { speaker: "POMNI", text: "[20:59] O-O-Oh, yeah." },
        { speaker: "POMNI", text: "[21:00] Uh, this is Gummigoo." },
        { speaker: "POMNI", text: "[21:03] He's gonna come back to the circus with us." },
        { speaker: "RAGATHA", text: "[21:06] Oh! Uh, i-is that allowed?" },
        { speaker: "POMNI", text: "[21:09] His reality was kind of..." },
        { speaker: "POMNI", text: "[21:12] completely shattered?" },
        { speaker: "POMNI", text: "[21:14] I feel like it was the least I could offer him." },
        { speaker: "POMNI", text: "[21:17] Opposed to just leaving him behind." },
        { speaker: "RAGATHA", text: "[21:20] [chuckles]" },
        { speaker: "RAGATHA", text: "[21:20] Hey." },
        { speaker: "RAGATHA", text: "[21:20] That's good of you, Pomni." },
        { speaker: "JAX", text: "[21:21] UGH!" },
        { speaker: "JAX", text: "[21:23] Let's take this DUMB truck to the DUMB kingdom, I guess!" },
        { speaker: "SFX", text: "[21:27] [cheers and applause]" },
        { speaker: "PRINCESS LOO", text: "[21:29] Thanks to you brave knights," },
        { speaker: "PRINCESS LOO", text: "[21:31] our kingdom will once again thrive." },
        { speaker: "PRINCESS LOO", text: "[21:34] I'm sure it was no easy task." },
        { speaker: "RAGATHA", text: "[21:36] You have no idea." },
        { speaker: "PRINCESS LOO", text: "[21:39] Farewell, brave knights." },
        { speaker: "PRINCESS LOO", text: "[21:41] Have fun executing that bandit fella!" },
        { speaker: "GUMMIGOO", text: "[21:43] Yes." },
        { speaker: "GUMMIGOO", text: "[21:44] That is what we're doing." },
        { speaker: "SFX", text: "[21:47] [distant explosion booms]" },
        { speaker: "JAX", text: "[21:49] Oh, hey!" },
        { speaker: "JAX", text: "[21:50] Maybe I didn't leave the gate unlocked for nothing after all." },
        { speaker: "SFX", text: "[21:53] [approaching rumbling]" },
        { speaker: "RAGATHA", text: "[21:53] Uh, what? I-I thought he was dead!" },
        { speaker: "POMNI", text: "[21:55] You still did that?!" },
        { speaker: "JAX", text: "[21:55] Okay, wait." },
        { speaker: "THE FUDGE", text: "[21:57] [chuckling]" },
        { speaker: "POMNI", text: "[21:57] Y-You did what, now?" },
        { speaker: "JAX", text: "[21:58] Well, love to help you again sometime! Bye!" },
        { speaker: "THE FUDGE", text: "[21:58] [laughing]" },
        { speaker: "SFX", text: "[22:01] [distant townsfolk screaming]" }
      ],
      outro: [
        { speaker: "CAINE", text: "[22:03] Welcome back, my little hard-shelled hamburgers!" },
        { speaker: "GUMMIGOO", text: "[22:07] So, this is the circus, huh?" },
        { speaker: "GUMMIGOO", text: "[22:09] I could get used to this." },
        { speaker: "CAINE", text: "[22:09] Oop!" },
        { speaker: "CAINE", text: "[22:10] Looks like one of these guys made it through." },
        { speaker: "GUMMIGOO", text: "[22:12] Wait, wha-- Blagh!" },
        { speaker: "POMNI", text: "[22:15] W-W-Wait, wha--?" },
        { speaker: "CAINE", text: "[22:17] I know you guys love your NPCs," },
        { speaker: "CAINE", text: "[22:20] but if I start losing track of who's a human and who's an NPC," },
        { speaker: "CAINE", text: "[22:23] who knows..." },
        { speaker: "CAINE", text: "[22:23] what could happen..." },
        { speaker: "CAINE", text: "[22:30] [laughing manically]" },
        { speaker: "CAINE", text: "[22:36] Welp, I'm gonna go drink water!" },
        { speaker: "CAINE", text: "[22:38] It's been a while since I've done that." },
        { speaker: "SFX", text: "[22:40] [swoosh!]" },
        { speaker: "ZOOBLE", text: "[22:43] Sheesh, I thought he'd never leave." },
        { speaker: "RAGATHA", text: "[22:46] I'm really sorry about that, Pomni." },
        { speaker: "RAGATHA", text: "[22:48] At least you tried." },
        { speaker: "RAGATHA", text: "[22:50] You know, he might be back in a future adventure." },
        { speaker: "RAGATHA", text: "[22:52] I know Caine sometimes likes to reuse NPCs." },
        { speaker: "ZOOBLE", text: "[23:00] Got everything ready." },
        { speaker: "RAGATHA", text: "[23:02] Hey..." },
        { speaker: "RAGATHA", text: "[23:03] You at least wanna join us for Kaufmo's funeral?" },
        { speaker: "RAGATHA", text: "[23:08] We like to have a little funeral service to remember the people who abstract." },
        { speaker: "RAGATHA", text: "[23:13] This one just got pushed around a bit with your arrival and everything." },
        { speaker: "KINGER", text: "[23:17] It's the least we can do to honor their memory." },
        { speaker: "MUSIC", text: "[23:19] [pensive, melancholy music plays]" },
        { speaker: "MUSIC", text: "[23:22] ♪♪" },
        { speaker: "RAGATHA", text: "[23:31] Oh, man." },
        { speaker: "RAGATHA", text: "[23:32] I always think I'm prepared for these things," },
        { speaker: "RAGATHA", text: "[23:34] but then you set up the picture and, well..." },
        { speaker: "RAGATHA", text: "[23:37] I'm already breaking." },
        { speaker: "CAPTION", text: "[23:42] [no audible dialogue throughout]" },
        { speaker: "MUSIC", text: "[23:45] ♪♪" },
        { speaker: "MUSIC", text: "[24:26] [upbeat, jazzy music plays]" },
        { speaker: "MUSIC", text: "[24:29] ♪♪" }
      ]
    },
    3: {
      title: "Épisode 3: Le Manoir de Mildenhall",
      intro: [
        { speaker: "MUSIC", text: "[00:00] [upbeat techno music plays]" },
        { speaker: "MUSIC", text: "[00:03] ♪♪" },
        { speaker: "MUSIC", text: "[00:10] [upbeat, goofy music plays]" },
        { speaker: "POMNI", text: "[00:12] [gasping]" },
        { speaker: "POMNI", text: "[00:15] I can't hold it any longer." },
        { speaker: "RAGATHA", text: "[00:17] Sure you can." },
        { speaker: "RAGATHA", text: "[00:18] We can't die from oxygen deprivation, remember?" },
        { speaker: "POMNI", text: "[00:20] But it still feels like I'm gonna die." },
        { speaker: "KINGER", text: "[00:23] Try not thinking about it." },
        { speaker: "JAX", text: "[00:25] Or you could toughen up!" },
        { speaker: "JAX", text: "[00:26] I wanna see what your funny cartoon body does." },
        { speaker: "RAGATHA", text: "[00:28] Hey, take it easy." },
        { speaker: "JAX", text: "[00:29] [falsetto] “Ooh, take it easy!”" },
        { speaker: "JAX", text: "[00:30] [normal voice] That's you." },
        { speaker: "POMNI", text: "[00:32] All right." },
        { speaker: "POMNI", text: "[00:32] Here I go." },
        { speaker: "POMNI", text: "[00:32] [inhales deeply]" },
        { speaker: "MUSIC", text: "[00:34] ♪♪" },
        { speaker: "ZOOBLE", text: "[00:37] All right, we've entered the blue zone." },
        { speaker: "JAX", text: "[00:42] Hey, there's something new." },
        { speaker: "ZOOBLE", text: "[00:44] Okay, we're getting red." },
        { speaker: "JAX", text: "[00:47] Ooh, orange." },
        { speaker: "ZOOBLE", text: "[00:49] Yellow." },
        { speaker: "JAX", text: "[00:50] Green." },
        { speaker: "KINGER", text: "[00:51] Whoa, look!" },
        { speaker: "KINGER", text: "[00:52] Now she's turning blue!" },
        { speaker: "ZOOBLE", text: "[00:54] She was already blue." },
        { speaker: "POMNI", text: "[00:56] [gasps] [panting]" },
        { speaker: "JAX", text: "[00:56] Huh." },
        { speaker: "JAX", text: "[00:58] Guess the hue shift just gets faster." },
        { speaker: "POMNI", text: "[01:00] Why am I the one doing this?" },
        { speaker: "POMNI", text: "[01:02] Why not one of you guys?" },
        { speaker: "JAX", text: "[01:03] Because something different happens with each person!" },
        { speaker: "JAX", text: "[01:05] For instance, Kinger starts glowing…" },
        { speaker: "JAX", text: "[01:08] Ragatha's hair noodles stick up…" },
        { speaker: "JAX", text: "[01:10] Gangle's mask starts spinning…" },
        { speaker: "JAX", text: "[01:12] and Zooble turns straight." },
        { speaker: "ZOOBLE", text: "[01:13] My limbs straighten up --" },
        { speaker: "ZOOBLE", text: "[01:15] [boink!] off." },
        { speaker: "POMNI", text: "[01:16] What about you?" },
        { speaker: "ZOOBLE", text: "[01:17] He refuses to show us because he's a coward." },
        { speaker: "JAX", text: "[01:19] I wanna keep the mystery alive." },
        { speaker: "JAX", text: "[01:21] What do YOU, the VIEWERS, think it is?" },
        { speaker: "ZOOBLE", text: "[01:26] Will you stop doing that?" },
        { speaker: "CAINE", text: "[01:27] Why is everybody just standing around when there's ADVENTURE to be had?" },
        { speaker: "CAINE", text: "[01:31] Today's adventure is…" },
        { speaker: "CAINE", text: "[01:36] That's right!" },
        { speaker: "CAINE", text: "[01:37] This big, spooky mansion has been rumored to be filled to the brim with paranormal activity!" },
        { speaker: "CAINE", text: "[01:44] It's up to you to solve the house's deep mysteries and capture all the ghoulish ghost activity you can." },
        { speaker: "CAINE", text: "[01:50] And for the first time ever, you can…" },
        { speaker: "SFX", text: "[01:54] [gritty scraping]" },
        { speaker: "CAINE", text: "[01:56] Where's Zooble?" },
        { speaker: "CAINE", text: "[01:57] I-I made this adventure really cool and “m-m-matoor” just for them." },
        { speaker: "SFX", text: "[02:03] [low growling]" },
        { speaker: "BUBBLE", text: "[02:05] [speaking backwards]" },
        { speaker: "CAINE", text: "[02:10] What?" },
        { speaker: "POMNI", text: "[02:10] The NPCs aren't gonna become self-aware in this one, right?" },
        { speaker: "CAINE", text: "[02:14] How should I know?" },
        { speaker: "CAINE", text: "[02:15] I'm not the boss." },
        { speaker: "CAINE", text: "[02:16] Oh, wait -- yes, I am!" },
        { speaker: "CAINE", text: "[02:16] HAHAHAHAHAHA!" },
        { speaker: "CAINE", text: "[02:18] Anyway, everybody into the fractal noise." },
        { speaker: "CAINE", text: "[02:20] It's adventuring time!" },
        { speaker: "MUSIC", text: "[02:22] [spooky organ music plays]" },
        { speaker: "MUSIC", text: "[02:25] ♪♪" },
        { speaker: "RAGATHA", text: "[02:29] Oh, this place is spooky." },
        { speaker: "RAGATHA", text: "[02:32] I wonder how hard Caine's gonna go with the scare-factor?" },
        { speaker: "POMNI", text: "[02:35] I hope this adventure doesn't end up being another horrible nightmare." },
        { speaker: "POMNI", text: "[02:39] I'm not really a fan of horror," },
        { speaker: "POMNI", text: "[02:41] and I don't really handle jumpscares that well." },
        { speaker: "JAX", text: "[02:44] Boo!" },
        { speaker: "POMNI", text: "[02:44] [stammers]" },
        { speaker: "JAX", text: "[02:45] HA! [chuckles]" },
        { speaker: "JAX", text: "[02:45] Come on!" },
        { speaker: "JAX", text: "[02:46] That wasn't even scary." },
        { speaker: "JAX", text: "[02:48] What, you scared of the vacuum cleaner, too?" },
        { speaker: "RAGATHA", text: "[02:50] Hey, be nice to her." },
        { speaker: "RAGATHA", text: "[02:52] She's had a rough couple of days." },
        { speaker: "JAX", text: "[02:54] Her and everyone else." },
        { speaker: "JAX", text: "[02:56] Right, Gangle?" },
        { speaker: "GANGLE", text: "[02:56] [spooky giggle]" },
        { speaker: "POMNI", text: "[02:57] Does anybody hear that?" },
        { speaker: "SFX", text: "[02:57] [giggling continues]" },
        { speaker: "MUSIC", text: "[03:00] ♪♪" },
        { speaker: "SFX", text: "[03:03] [loud giggling]" },
        { speaker: "POMNI", text: "[03:04] [shrieks]" },
        { speaker: "GHOSTLY", text: "[03:06] Hey, I'm Ghostly!" },
        { speaker: "POMNI", text: "[03:07] Wha?" },
        { speaker: "SFX", text: "[03:07] [splat!]" },
        { speaker: "GHOSTLY", text: "[03:08] And I'll be your guide today!" },
        { speaker: "POMNI", text: "[03:11] Why won't they go back in?" },
        { speaker: "KINGER", text: "[03:13] [chuckles]" },
        { speaker: "KINGER", text: "[03:14] I remember my first wild take." },
        { speaker: "KINGER", text: "[03:17] I don't know why they're not retracting, though." },
        { speaker: "KINGER", text: "[03:19] That didn't happen for me." },
        { speaker: "GHOSTLY", text: "[03:20] Before you continue on your adventure," },
        { speaker: "GHOSTLY", text: "[03:22] you have to choose which door you're gonna go through!" },
        { speaker: "GHOSTLY", text: "[03:25] The door on the left is the NORMAL door!" },
        { speaker: "CAINE", text: "[03:28] [offscreen] Rated WOW for all ages!" },
        { speaker: "GHOSTLY", text: "[03:31] The door on the right is the really scary door." },
        { speaker: "CAINE", text: "[03:34] [offscreen] Rated AAAAA for mature Zoobles only!" },
        { speaker: "GHOSTLY", text: "[03:37] It's up to you to deci--" },
        { speaker: "GHOSTLY", text: "[03:39] [shrieking]" },
        { speaker: "SFX", text: "[03:39] [vacuum whirs]" },
        { speaker: "RAGATHA", text: "[03:40] [stammers] Jax!" },
        { speaker: "JAX", text: "[03:40] What?" },
        { speaker: "JAX", text: "[03:42] I thought we were supposed to capture all the ghosts." },
        { speaker: "RAGATHA", text: "[03:44] Uhh…" },
        { speaker: "RAGATHA", text: "[03:46] which door should we choose?" },
        { speaker: "JAX", text: "[03:48] Hmm, not sure." },
        { speaker: "JAX", text: "[03:50] Let's try this out." },
        { speaker: "SFX", text: "[03:51] [door snarls]" },
        { speaker: "GANGLE", text: "[03:53] Aww…" },
        { speaker: "KINGER", text: "[03:53] Don't worry, Gangle!" },
        { speaker: "KINGER", text: "[03:55] I'll get it for you!" },
        { speaker: "KINGER", text: "[03:58] Eh?" },
        { speaker: "KINGER", text: "[03:58] [grunts] [stammers]" },
        { speaker: "KINGER", text: "[03:59] WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUUGHH--" },
        { speaker: "JAX", text: "[04:05] Oh, THAT'S the scary door." },
        { speaker: "CAINE", text: "[04:09] [sing-song] Zooble, come on out!" },
        { speaker: "CAINE", text: "[04:11] [normal voice] I just want to talk to you!" },
        { speaker: "CAINE", text: "[04:14] Hmm." },
        { speaker: "CAINE", text: "[04:14] Oh, I know!" },
        { speaker: "SFX", text: "[04:14] [snap!]" },
        { speaker: "SFX", text: "[04:16] [mystical shimmering]" },
        { speaker: "ZOOBLE", text: "[04:17] What th-- [scoffs]" },
        { speaker: "ZOOBLE", text: "[04:17] Could you have done that the whole time?" },
        { speaker: "CAINE", text: "[04:20] Zooble, I-I just want to get to the bottom" },
        { speaker: "CAINE", text: "[04:22] of why you keep skipping all my amazing adventures." },
        { speaker: "CAINE", text: "[04:26] You could end up really hurting Bubble's feelings." },
        { speaker: "ZOOBLE", text: "[04:29] Uh, Bubble's feelings?" },
        { speaker: "CAINE", text: "[04:31] E-Enough about Bubble's feelings!" },
        { speaker: "CAINE", text: "[04:32] How about YOUR feelings?" },
        { speaker: "SFX", text: "[04:32] [snap!]" },
        { speaker: "ZOOBLE", text: "[04:37] I--" },
        { speaker: "CAINE", text: "[04:37] So, what's on your mind, Zooble?" },
        { speaker: "ZOOBLE", text: "[04:40] I… would rather not." },
        { speaker: "CAINE", text: "[04:43] Hahahahaha!" },
        { speaker: "CAINE", text: "[04:43] That's hilarious!" },
        { speaker: "CAINE", text: "[04:43] Go on." },
        { speaker: "ZOOBLE", text: "[04:45] No, I mean, I've already told you what my problem is." },
        { speaker: "ZOOBLE", text: "[04:49] You just never remember because…" },
        { speaker: "ZOOBLE", text: "[04:52] Oh, never mind." },
        { speaker: "CAINE", text: "[04:53] My mind is a beeswax-polished coconut." },
        { speaker: "CAINE", text: "[04:56] Nothing ever escapes these cakes." },
        { speaker: "CAINE", text: "[04:58] So, what can I do to make my adventures more…" },
        { speaker: "CAINE", text: "[05:01] appealing to you?" },
        { speaker: "ZOOBLE", text: "[05:03] See?" },
        { speaker: "ZOOBLE", text: "[05:03] This is exactly what I'm talking about." },
        { speaker: "ZOOBLE", text: "[05:06] All you're thinking about is your adventures." },
        { speaker: "ZOOBLE", text: "[05:08] It has nothing to do with the adventures." },
        { speaker: "ZOOBLE", text: "[05:10] It's more just…" },
        { speaker: "ZOOBLE", text: "[05:11] Ugh, forget it." },
        { speaker: "ZOOBLE", text: "[05:13] You're probably not even listening." },
        { speaker: "CAINE", text: "[05:15] Zooble, look at this cool bee I drew." },
        { speaker: "POMNI", text: "[05:22] [groans]" },
        { speaker: "POMNI", text: "[05:22] Wha?" },
        { speaker: "POMNI", text: "[05:24] Where are we?" },
        { speaker: "SFX", text: "[05:26] [thunder crashes]" },
        { speaker: "MUSIC", text: "[05:27] [eerie music plays]" },
        { speaker: "MUSIC", text: "[05:30] ♪♪" },
        { speaker: "POMNI", text: "[05:34] Oh, that's…" },
        { speaker: "POMNI", text: "[05:36] Noooo…" },
        { speaker: "MUSIC", text: "[05:38] ♪♪" },
        { speaker: "KINGER", text: "[05:45] I wonder what this thing is?" },
        { speaker: "SFX", text: "[05:47] [ka-chonk!]" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[05:48] [over speakers throughout]" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[05:48] My name is Baron Theodore Mildenhall." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[05:51] Hunting has been a hobby of mine for as long as I can remember --" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[05:55] although one could say it eventually became more of an obsession." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[05:59] The creature you see before you is one I've been pursuing for years." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:03] Not quite a man…" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:05] but not quite an animal." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:07] Something… unholy." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:09] Something evil." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:10] I took it upon myself to spend every waking moment" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:14] doing all I could to protect my family from the creature," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:17] hoping that when I'd eventually killed it," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:20] I would be freed from this awful feeling." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:22] This inescapable dread." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[06:25] I was wrong." },
        { speaker: "SFX", text: "[06:27] [tape clicks]" },
        { speaker: "KINGER", text: "[06:29] You know, I'm starting to think…" },
        { speaker: "POMNI", text: "[06:35] How about we try to find a way back up to the others?" },
        { speaker: "MUSIC", text: "[06:38] ♪♪" },
        { speaker: "POMNI", text: "[06:43] Okay, cool." },
        { speaker: "POMNI", text: "[06:44] That's great." },
        { speaker: "POMNI", text: "[06:46] I LOVE these adventures." },
        { speaker: "KINGER", text: "[06:49] We could always ride this thingy up." },
        { speaker: "POMNI", text: "[06:54] [grunting manically]" },
        { speaker: "POMNI", text: "[06:57] It's locked." },
        { speaker: "POMNI", text: "[06:57] It's locked -- of course!" },
        { speaker: "POMNI", text: "[06:59] It's locked!" },
        { speaker: "POMNI", text: "[07:00] I LOVE that it's locked!" },
        { speaker: "MUSIC", text: "[07:02] ♪♪" },
        { speaker: "SFX", text: "[07:08] [objects rattling]" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:10] [over speakers]" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:10] Tuesday, December 4th." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:12] Although I had shot the creature multiple times in its vitals" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:16] and severed its head to keep as a prize on my wall…" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:19] my troubles were just beginning." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:21] I took my eyes off the body for what felt like only a minute," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:25] and when I looked back, the body was gone." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:28] The creature was not dead," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:30] and it would be back to reclaim what I'd taken from it." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:34] If anyone is listening to this," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:36] all I ask of you is one thing --" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:39] do not let the head out of your sight." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[07:41] You have been warned." },
        { speaker: "KINGER", text: "[07:43] Well, this is some rather inconvenient lore placement." },
        { speaker: "POMNI", text: "[07:47] I got it!" },
        { speaker: "SFX", text: "[07:47] [bzzt!]" },
        { speaker: "KINGER", text: "[07:51] And this is some rather inconvenient darkness." },
        { speaker: "POMNI", text: "[07:55] [groans] [wails]" },
        { speaker: "POMNI", text: "[07:55] AHH!!! What was that?" },
        { speaker: "POMNI", text: "[07:57] Was that you?" },
        { speaker: "KINGER", text: "[07:58] No…" },
        { speaker: "KINGER", text: "[07:59] Oh, wait -- you mean me grabbing you right now?" },
        { speaker: "KINGER", text: "[08:01] Yeah, that was me." },
        { speaker: "KINGER", text: "[08:03] I-Is this your hand?" },
        { speaker: "POMNI", text: "[08:03] Ugh!" },
        { speaker: "POMNI", text: "[08:04] That's my eye." },
        { speaker: "KINGER", text: "[08:05] Yes, but WHICH eye?" },
        { speaker: "POMNI", text: "[08:07] I really don't think that ma--" },
        { speaker: "POMNI", text: "[08:09] Will you stop touching my eye?" },
        { speaker: "KINGER", text: "[08:10] Oh, yeah. Sorry." },
        { speaker: "KINGER", text: "[08:12] [shrieks]" },
        { speaker: "POMNI", text: "[08:12] Wh-- W-What happened?" },
        { speaker: "KINGER", text: "[08:14] I just remembered a really funny joke." },
        { speaker: "POMNI", text: "[08:16] A j-- Y-You -- [sighs]" },
        { speaker: "POMNI", text: "[08:17] Why did you scream, then?" },
        { speaker: "KINGER", text: "[08:19] Maybe it wasn't actually that funny." },
        { speaker: "POMNI", text: "[08:21] Oh, my God." },
        { speaker: "KINGER", text: "[08:23] I thiiiiiink…" },
        { speaker: "KINGER", text: "[08:24] we should hold on to each other" },
        { speaker: "KINGER", text: "[08:26] and slowly make our way back into the trophy room." },
        { speaker: "POMNI", text: "[08:29] U-Uh, sounds fine to me." },
        { speaker: "MUSIC", text: "[08:31] [suspenseful music plays]" },
        { speaker: "MUSIC", text: "[08:34] ♪♪" },
        { speaker: "SFX", text: "[08:36] [creaking]" },
        { speaker: "POMNI", text: "[08:38] [whispering] What was that?" },
        { speaker: "KINGER", text: "[08:39] [whispering] What's what?" },
        { speaker: "SFX", text: "[08:41] [creaking]" },
        { speaker: "POMNI", text: "[08:42] That!" },
        { speaker: "KINGER", text: "[08:44] It's probably just magnets." },
        { speaker: "KINGER", text: "[08:46] Or a boat." },
        { speaker: "POMNI", text: "[08:48] [stammers]" },
        { speaker: "POMNI", text: "[08:48] A boat?" },
        { speaker: "KINGER", text: "[08:49] W-Whatever the case," },
        { speaker: "KINGER", text: "[08:50] I think we should be completely quiet." },
        { speaker: "POMNI", text: "[08:53] I -- Okay, yeah." },
        { speaker: "POMNI", text: "[08:54] I agree." },
        { speaker: "POMNI", text: "[08:56] You know, you're really hit-and-miss with these things, sometimes." },
        { speaker: "SFX", text: "[09:00] [fly buzzing]" },
        { speaker: "SFX", text: "[09:02] [slap!]" },
        { speaker: "POMNI", text: "[09:02] [stammers]" },
        { speaker: "KINGER", text: "[09:03] There's a fly in here." },
        { speaker: "SFX", text: "[09:05] [slapping]" },
        { speaker: "POMNI", text: "[09:05] [stammers]" },
        { speaker: "POMNI", text: "[09:06] Don't you think that's making a lot of noi--" },
        { speaker: "POMNI", text: "[09:08] Oh, God, there is a fly." },
        { speaker: "SFX", text: "[09:08] [slap!]" },
        { speaker: "KINGER", text: "[09:10] Aaaaaand…" },
        { speaker: "KINGER", text: "[09:11] Gotcha!" },
        { speaker: "SFX", text: "[09:11] [buzzing stops]" },
        { speaker: "KINGER", text: "[09:12] I think I got him." },
        { speaker: "KINGER", text: "[09:14] I can't see my hands." },
        { speaker: "POMNI", text: "[09:15] [shrieks]" },
        { speaker: "KINGER", text: "[09:22] I'm sorry, could you speak up?" },
        { speaker: "KINGER", text: "[09:24] I couldn't quite make that out." },
        { speaker: "POMNI", text: "[09:26] [boink!] the fly!" },
        { speaker: "POMNI", text: "[09:26] Run!" },
        { speaker: "BOTH", text: "[09:27] [shrieking]" },
        { speaker: "POMNI", text: "[09:30] Come on come on come on come on come on come on come on!!" },
        { speaker: "KINGER", text: "[09:32] Pomni, I think this might be the creature from the tapes!" },
        { speaker: "POMNI", text: "[09:35] [stammers]" },
        { speaker: "POMNI", text: "[09:37] [groans]" },
        { speaker: "POMNI", text: "[09:39] Come on come on come on come on come on come on come oooon!!" },
        { speaker: "KINGER", text: "[09:42] Ah!" },
        { speaker: "POMNI", text: "[09:43] [wailing]" },
        { speaker: "KINGER", text: "[09:48] [dazed] You look beautiful, honey…" },
        { speaker: "POMNI", text: "[09:52] Got it!" },
        { speaker: "POMNI", text: "[09:55] Come on!" },
        { speaker: "KINGER", text: "[09:56] [stammers]" },
        { speaker: "KINGER", text: "[09:57] Huh? Oh, yeah." },
        { speaker: "KINGER", text: "[10:00] Prepare for take-off," },
        { speaker: "KINGER", text: "[10:02] 'cause this boat is going UP!" },
        { speaker: "KINGER", text: "[10:06] Huh??" },
        { speaker: "KINGER", text: "[10:08] That's not up!" },
        { speaker: "KINGER", text: "[10:09] That's not up at all!" },
        { speaker: "KINGER", text: "[10:10] Why aren't we going up?!" },
        { speaker: "KINGER", text: "[10:12] UUUUUUUUUUUUUUUUUUUUUUUUUUP!" },
        { speaker: "CAINE", text: "[10:16] I DO NOT use my adventures to torture my guests!" },
        { speaker: "CAINE", text: "[10:19] Any torment I inflict is 100% accidental," },
        { speaker: "CAINE", text: "[10:23] like any good war criminal!" },
        { speaker: "ZOOBLE", text: "[10:25] [scoffs]" },
        { speaker: "ZOOBLE", text: "[10:25] We weren't even talking about that!" },
        { speaker: "ZOOBLE", text: "[10:27] I really couldn't give less of a crap about the adventures." },
        { speaker: "CAINE", text: "[10:30] Then what is your problem, Zooble?!" },
        { speaker: "CAINE", text: "[10:32] I'm trying my best to remember," },
        { speaker: "CAINE", text: "[10:34] but both you and my brain won't tell me!" },
        { speaker: "ZOOBLE", text: "[10:38] [sighs]" },
        { speaker: "ZOOBLE", text: "[10:39] It's me, remember?" },
        { speaker: "ZOOBLE", text: "[10:42] I don't like…" },
        { speaker: "ZOOBLE", text: "[10:44] myself." },
        { speaker: "ZOOBLE", text: "[10:45] I hate this body." },
        { speaker: "ZOOBLE", text: "[10:46] I hate all these stupid removable pieces." },
        { speaker: "ZOOBLE", text: "[10:50] I just want to find something that feels…" },
        { speaker: "ZOOBLE", text: "[10:53] …good." },
        { speaker: "CAINE", text: "[10:54] Oh, yeah -- now I remember why I couldn't remember." },
        { speaker: "CAINE", text: "[10:56] It's because that problem is already solved!" },
        { speaker: "CAINE", text: "[10:59] Simply swap out your undesirable Zooble parts for better ones!" },
        { speaker: "ZOOBLE", text: "[11:03] I've been trying to find parts I like since the day I got here." },
        { speaker: "CAINE", text: "[11:07] So, back to the adventures!" },
        { speaker: "ZOOBLE", text: "[11:09] Forget it." },
        { speaker: "CAINE", text: "[11:11] “Forget it”?" },
        { speaker: "ZOOBLE", text: "[11:12] Just forget it." },
        { speaker: "CAINE", text: "[11:13] Forget what?" },
        { speaker: "ZOOBLE", text: "[11:14] Caine, nobody likes your stupid adventures." },
        { speaker: "CAINE", text: "[11:17] Ha-ha!" },
        { speaker: "CAINE", text: "[11:18] Good one, Zooble." },
        { speaker: "ZOOBLE", text: "[11:20] Ragatha's just too nice to say anything." },
        { speaker: "ZOOBLE", text: "[11:22] Jax just likes to [bonk!] with everybody." },
        { speaker: "ZOOBLE", text: "[11:25] Gangle's too shy to speak up." },
        { speaker: "ZOOBLE", text: "[11:27] Kinger's insane." },
        { speaker: "ZOOBLE", text: "[11:29] And -- And Pomni…" },
        { speaker: "ZOOBLE", text: "[11:30] She looks traumatized every time she comes back from one." },
        { speaker: "CAINE", text: "[11:34] Oh, Zooble, Zooble, Zooble." },
        { speaker: "CAINE", text: "[11:36] Making adventures is my art!" },
        { speaker: "CAINE", text: "[11:39] It's all I exist to do!" },
        { speaker: "CAINE", text: "[11:41] All I'm…" },
        { speaker: "CAINE", text: "[11:43] good at." },
        { speaker: "CAINE", text: "[11:43] A-And, uh… [chuckles]" },
        { speaker: "CAINE", text: "[11:45] …w-what you're saying could imply that I'm bad at the only thing I'm good at," },
        { speaker: "CAINE", text: "[11:49] and that… [chuckles weakly]" },
        { speaker: "CAINE", text: "[11:51] [stammers] That'd be…" },
        { speaker: "SFX", text: "[11:53] [static crackling]" },
        { speaker: "SFX", text: "[11:55] [ominous rumbling]" },
        { speaker: "ZOOBLE", text: "[11:58] U-Uh, whose therapy session is this, again?" },
        { speaker: "CAINE", text: "[12:01] Oh, yeah!" },
        { speaker: "CAINE", text: "[12:02] We need to get to the bottom of your behavioral issues!" },
        { speaker: "CAINE", text: "[12:05] I'm gonna show you some ink blots," },
        { speaker: "CAINE", text: "[12:07] and you're gonna say the first word that comes to your mind." },
        { speaker: "POMNI", text: "[12:16] [groans]" },
        { speaker: "POMNI", text: "[12:18] What?" },
        { speaker: "POMNI", text: "[12:19] Oh, God, where are we now?" },
        { speaker: "KINGER", text: "[12:22] I'm not sure." },
        { speaker: "KINGER", text: "[12:23] A cellar of some kind." },
        { speaker: "MUSIC", text: "[12:25] ♪♪" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:29] Things have gotten far worse than I could ever have imagined." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:33] My paranoia had driven me to the point" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:35] where I was no longer the protector my wife and theoretical children needed." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:40] Jumping at every shadow, every noise." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:44] I ended up shooting the love of my life," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:46] mistaking her for the creature." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:48] It's ironic, isn't it?" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:51] In my attempts to protect her," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:54] I ended up becoming the monster myself." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[12:58] Now I wait down in my cellar," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[13:00] no longer having anything to protect but my own soul." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[13:04] If nothing else…" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[13:06] I will slay the beast that took everything from me." },
        { speaker: "SFX", text: "[13:10] [tape clicks]" },
        { speaker: "KINGER", text: "[13:12] How's about we take his gun?" },
        { speaker: "POMNI", text: "[13:14] Yeah, sounds good to me." },
        { speaker: "MUSIC", text: "[13:15] ♪♪" },
        { speaker: "POMNI", text: "[13:20] Please don't come alive…" },
        { speaker: "MOUNTED CREATURE HEAD", text: "[13:23] Okay, I won't." },
        { speaker: "MUSIC", text: "[13:28] ♪♪" },
        { speaker: "KINGER", text: "[13:30] Looks like we've got two shots." },
        { speaker: "KINGER", text: "[13:33] Let's make them count." },
        { speaker: "POMNI", text: "[13:34] Uh, yeah." },
        { speaker: "SFX", text: "[13:37] [distant clang]" },
        { speaker: "KINGER", text: "[13:39] Stay behind me." },
        { speaker: "SFX", text: "[13:42] [wet squelching]" },
        { speaker: "MUSIC", text: "[13:44] ♪♪" },
        { speaker: "POMNI", text: "[13:55] [shrieking]" },
        { speaker: "POMNI", text: "[13:59] [laughs nervously]" },
        { speaker: "POMNI", text: "[13:59] Uh, Kinger?" },
        { speaker: "POMNI", text: "[14:01] I-I think we may have a problem this way, too." },
        { speaker: "KINGER", text: "[14:04] Just leave it to me." },
        { speaker: "KINGER", text: "[14:05] I can handle this." },
        { speaker: "MUSIC", text: "[14:07] ♪♪" },
        { speaker: "POMNI", text: "[14:10] [shrieks]" },
        { speaker: "KINGER", text: "[14:15] Well." },
        { speaker: "KINGER", text: "[14:16] That wasn't so bad." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:19] Which is what I would be saying if I didn't know" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:22] that the creature was actually one of God's angels." },
        { speaker: "KINGER", text: "[14:26] What." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:26] And anyone who brings harm to it" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:28] will be dragged down into the cold, spiraling pits of Hell," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:32] where my soul resides." },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:34] I apologize, dear listener," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:37] but I need a living host in order to escape the hall of the damned," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:41] and your bodies will be my only means of doing so." },
        { speaker: "KINGER", text: "[14:46] Now, wait." },
        { speaker: "KINGER", text: "[14:47] How did he record this if he was in Hell?" },
        { speaker: "POMNI", text: "[14:50] [shrieks]" },
        { speaker: "POMNI", text: "[14:50] Oh, no! Let go of me!" },
        { speaker: "KINGER", text: "[14:50] [wailing]" },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:52] I hope you're ready," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:54] because the next breath you take down there will be your last," },
        { speaker: "BARON THEODORE MILDENHALL", text: "[14:58] and your bodies will belong to me." },
        { speaker: "POMNI", text: "[15:00] Let go of me!" },
        { speaker: "BOTH", text: "[15:02] [wailing]" },
        { speaker: "POMNI", text: "[15:04] I hate this stupid adventure!!!" },
        { speaker: "MUSIC", text: "[15:10] [peaceful piano music]" },
        { speaker: "MUSIC", text: "[15:13] ♪♪" },
        { speaker: "RAGATHA", text: "[15:14] Mmm, good tea." },
        { speaker: "RAGATHA", text: "[15:16] Sorry again about your husband killing you, and everything." },
        { speaker: "MARTHA MILDENHALL", text: "[15:19] [voice echoing softly]" },
        { speaker: "MARTHA MILDENHALL", text: "[15:19] Oh, you know how men are." },
        { speaker: "MARTHA MILDENHALL", text: "[15:21] Always having the silliest priorities." },
        { speaker: "RAGATHA", text: "[15:24] [chuckles wryly]" },
        { speaker: "RAGATHA", text: "[15:24] Don't I know it." },
        { speaker: "SFX", text: "[15:26] [muffled shouting]" },
        { speaker: "MARTHA MILDENHALL", text: "[15:28] If your friends see him," },
        { speaker: "MARTHA MILDENHALL", text: "[15:28] I only hope he doesn't bore them to death with his endless monologues." },
        { speaker: "MARTHA MILDENHALL", text: "[15:33] That man could turn a 57-second story into a Greek tragedy." },
        { speaker: "RAGATHA", text: "[15:38] I'll be sure to ask them next time I see 'em." },
        { speaker: "RAGATHA", text: "[15:40] Thanks again for the tea." },
        { speaker: "RAGATHA", text: "[15:41] I had a really nice time here." },
        { speaker: "MARTHA MILDENHALL", text: "[15:43] [chuckles]" },
        { speaker: "MARTHA MILDENHALL", text: "[15:43] Oh, don't mention it." },
        { speaker: "MARTHA MILDENHALL", text: "[15:45] Feel free to visit any time." },
        { speaker: "RAGATHA", text: "[15:47] Definitely!" },
        { speaker: "MUSIC", text: "[15:48] ♪♪" },
        { speaker: "CAINE", text: "[15:52] [offscreen] Congratulations, my little ironclad waffle cones!" },
        { speaker: "CAINE", text: "[15:56] You've taken the PACIFIST ROUTE," },
        { speaker: "CAINE", text: "[15:59] and you should be proud of what good people you are." },
        { speaker: "CAINE", text: "[16:02] Unfortunately, we still need to wait" },
        { speaker: "CAINE", text: "[16:04] until your other teammates finish their adventure" },
        { speaker: "CAINE", text: "[16:06] before I can grant you permission to leave." },
        { speaker: "RAGATHA", text: "[16:08] I wonder how long that'll be?" },
        { speaker: "SFX", text: "[16:10] [water dripping]" },
        { speaker: "KINGER", text: "[16:13] Not really typical of what you'd think Hell would be." },
        { speaker: "POMNI", text: "[16:16] We…" },
        { speaker: "POMNI", text: "[16:17] are LITERALLY in Hell right now." },
        { speaker: "POMNI", text: "[16:21] HELL!" },
        { speaker: "POMNI", text: "[16:22] Of course I'd be in Hell." },
        { speaker: "POMNI", text: "[16:24] How could I not be in literal Hell right now?" },
        { speaker: "KINGER", text: "[16:26] Just try to stay calm." },
        { speaker: "KINGER", text: "[16:28] I'm sure Caine included a way to escape." },
        { speaker: "KINGER", text: "[16:36] Hold on." },
        { speaker: "SFX", text: "[16:39] [soft rushing]" },
        { speaker: "KINGER", text: "[16:43] Let me try something." },
        { speaker: "KINGER", text: "[16:50] Hey, there's actually a staircase down there." },
        { speaker: "KINGER", text: "[16:53] It could be a way out." },
        { speaker: "KINGER", text: "[16:55] Maybe it'll work for us since we still have our bodies?" },
        { speaker: "KINGER", text: "[16:58] Though, I'm worried about what that tape said earlier." },
        { speaker: "POMNI", text: "[17:00] I'm just gonna try going fast." },
        { speaker: "KINGER", text: "[17:00] Wait, Pomni!" },
        { speaker: "POMNI", text: "[17:06] [grunts]" },
        { speaker: "MUSIC", text: "[17:07] [dark music plays]" },
        { speaker: "MUSIC", text: "[17:09] ♪♪" },
        { speaker: "KINGER", text: "[17:12] Pomni!" },
        { speaker: "MUSIC", text: "[17:14] ♪♪" },
        { speaker: "POSSESSED POMNI", text: "[17:19] [distorted voice] [cackling]" },
        { speaker: "POSSESSED POMNI", text: "[17:23] Freeeeedooooom." },
        { speaker: "KINGER", text: "[17:26] Pomni!" },
        { speaker: "MUSIC", text: "[17:27] ♪♪" },
        { speaker: "POSSESSED POMNI", text: "[17:31] [cackling]" },
        { speaker: "KINGER", text: "[17:31] Hey!" },
        { speaker: "KINGER", text: "[17:32] You get out of her, you damn evil souls!" },
        { speaker: "POSSESSED POMNI", text: "[17:36] How's your wife, Kinger?" },
        { speaker: "POSSESSED POMNI", text: "[17:39] [coughs]" },
        { speaker: "POMNI", text: "[17:40] [normal voice] [coughs]" },
        { speaker: "KINGER", text: "[17:40] Hey." },
        { speaker: "KINGER", text: "[17:42] You all right there?" },
        { speaker: "POMNI", text: "[17:42] [panting]" },
        { speaker: "POMNI", text: "[17:45] No." },
        { speaker: "KINGER", text: "[17:47] I'm guessing the souls are attracted to living things." },
        { speaker: "KINGER", text: "[17:51] Just want a vessel to be able to leave with." },
        { speaker: "KINGER", text: "[17:54] Man…" },
        { speaker: "KINGER", text: "[17:55] Seven years of computer science for this, huh?" },
        { speaker: "KINGER", text: "[17:59] [chuckles]" },
        { speaker: "POMNI", text: "[18:02] Why?" },
        { speaker: "POMNI", text: "[18:02] Every day I spend here is one nightmare after the next!" },
        { speaker: "POMNI", text: "[18:06] I knew it would end up like this!" },
        { speaker: "POMNI", text: "[18:07] He --" },
        { speaker: "POMNI", text: "[18:08] He just wants me to suffer." },
        { speaker: "POMNI", text: "[18:11] I really am in Hell." },
        { speaker: "KINGER", text: "[18:13] Don't say that." },
        { speaker: "KINGER", text: "[18:15] You're not in --" },
        { speaker: "KINGER", text: "[18:16] Well, I-I guess we are technically in --" },
        { speaker: "KINGER", text: "[18:18] Eh, forget about that." },
        { speaker: "KINGER", text: "[18:20] How about we just relax for a bit while nothing's chasing us?" },
        { speaker: "POMNI", text: "[18:29] [sobbing quietly]" },
        { speaker: "KINGER", text: "[18:35] It was my fault we went down this path, wasn't it?" },
        { speaker: "KINGER", text: "[18:39] I'm really sorry for that." },
        { speaker: "POMNI", text: "[18:44] Why have you been acting so different lately?" },
        { speaker: "KINGER", text: "[18:47] [chuckles]" },
        { speaker: "KINGER", text: "[18:48] I have, haven't I?" },
        { speaker: "KINGER", text: "[18:52] I'm normally not too good with memories." },
        { speaker: "KINGER", text: "[18:54] But being surrounded by darkness always…" },
        { speaker: "KINGER", text: "[18:58] brings me back to a certain time." },
        { speaker: "KINGER", text: "[19:02] Right after my wife had --" },
        { speaker: "KINGER", text: "[19:04] had abstracted…" },
        { speaker: "KINGER", text: "[19:06] I don't recall the exact string of events," },
        { speaker: "KINGER", text: "[19:08] but we both ended up in the fort together." },
        { speaker: "KINGER", text: "[19:12] And it was dark." },
        { speaker: "KINGER", text: "[19:14] The darkness seemed to calm her down a bit." },
        { speaker: "KINGER", text: "[19:17] The harsh, jagged edges smoothed out," },
        { speaker: "KINGER", text: "[19:20] and she didn't seem aggravated anymore." },
        { speaker: "KINGER", text: "[19:25] She wasn't the same as before," },
        { speaker: "KINGER", text: "[19:26] but she was calm enough to touch one last time…" },
        { speaker: "KINGER", text: "[19:31] before she got sent to the cellar." },
        { speaker: "KINGER", text: "[19:35] I'm always taken back to that moment when engulfed in darkness." },
        { speaker: "POMNI", text: "[19:39] You had a wife?" },
        { speaker: "POMNI", text: "[19:41] Like, here in the circus?" },
        { speaker: "KINGER", text: "[19:42] Yeah." },
        { speaker: "KINGER", text: "[19:44] She was funny, creative --" },
        { speaker: "KINGER", text: "[19:46] really into entomology." },
        { speaker: "KINGER", text: "[19:48] I used to hate bugs, but…" },
        { speaker: "KINGER", text: "[19:51] …she somehow got me to like them." },
        { speaker: "KINGER", text: "[19:53] [chuckles]" },
        { speaker: "KINGER", text: "[19:53] It's not the most cheerful memory, but…" },
        { speaker: "KINGER", text: "[19:57] it's one I at least have control over." },
        { speaker: "KINGER", text: "[20:02] I know how it can feel in this…" },
        { speaker: "KINGER", text: "[20:06] circus." },
        { speaker: "KINGER", text: "[20:08] Sometimes it all just feels…" },
        { speaker: "KINGER", text: "[20:11] pointless." },
        { speaker: "POMNI", text: "[20:12] Yeah." },
        { speaker: "KINGER", text: "[20:15] But it's not." },
        { speaker: "KINGER", text: "[20:17] Not if you have people who care about you." },
        { speaker: "KINGER", text: "[20:21] Good memories can do a lot." },
        { speaker: "KINGER", text: "[20:24] Hold onto them." },
        { speaker: "KINGER", text: "[20:26] And cherish the people around you." },
        { speaker: "KINGER", text: "[20:29] You never know when they'll be gone." },
        { speaker: "KINGER", text: "[20:34] In this world, the worst thing you can do is…" },
        { speaker: "KINGER", text: "[20:37] make someone think they're not wanted or loved." },
        { speaker: "POMNI", text: "[20:42] I'm glad you're here with me." },
        { speaker: "KINGER", text: "[20:55] You know, I've been thinking about that last tape." },
        { speaker: "KINGER", text: "[20:58] He said, “The next breath you take down there…" },
        { speaker: "KINGER", text: "[21:01] will be your last.”" },
        { speaker: "KINGER", text: "[21:03] Maybe we can get through if we don't breathe." },
        { speaker: "POMNI", text: "[21:07] I'm not very good at holding my breath." },
        { speaker: "KINGER", text: "[21:11] Well…" },
        { speaker: "KINGER", text: "[21:13] How about we try…" },
        { speaker: "KINGER", text: "[21:15] not thinking about it?" },
        { speaker: "MUSIC", text: "[21:16] [hopeful music plays]" },
        { speaker: "POMNI", text: "[21:18] [stammers]" },
        { speaker: "MUSIC", text: "[21:19] ♪♪" },
        { speaker: "POMNI", text: "[21:22] If we leave and we go back to the circus…" },
        { speaker: "POMNI", text: "[21:26] you're just gonna go back to being crazy." },
        { speaker: "POMNI", text: "[21:29] You're not gonna remember any of this." },
        { speaker: "POMNI", text: "[21:32] Are you?" },
        { speaker: "KINGER", text: "[21:33] Don't worry about me." },
        { speaker: "KINGER", text: "[21:36] As long as you remember it," },
        { speaker: "KINGER", text: "[21:38] things will be okay." },
        { speaker: "KINGER", text: "[21:41] You're very strong, Pomni." },
        { speaker: "KINGER", text: "[21:43] And I know you'll be able to get through this." },
        { speaker: "KINGER", text: "[21:47] Just hold onto me." },
        { speaker: "KINGER", text: "[21:49] We'll get through it together." },
        { speaker: "KINGER", text: "[21:51] You ready?" },
        { speaker: "MUSIC", text: "[21:53] ♪♪" }
      ],
      outro: [
        { speaker: "RAGATHA", text: "[22:28] Oh, Pomni! Kinger!" },
        { speaker: "RAGATHA", text: "[22:29] Are you guys okay? Was it scary?" },
        { speaker: "POMNI", text: "[22:31] I'm fine, actually." },
        { speaker: "POMNI", text: "[22:36] What happened up here?" },
        { speaker: "RAGATHA", text: "[22:38] Uh, don't worry about that." },
        { speaker: "KINGER", text: "[22:40] Pomni was very brave." },
        { speaker: "KINGER", text: "[22:42] At least, I think she was." },
        { speaker: "KINGER", text: "[22:46] Were you?" },
        { speaker: "POMNI", text: "[22:47] Something like that." },
        { speaker: "POMNI", text: "[22:49] Hey, Ragatha." },
        { speaker: "RAGATHA", text: "[22:51] Yeah?" },
        { speaker: "POMNI", text: "[22:51] I just want to say…" },
        { speaker: "POMNI", text: "[22:54] [sighs]" },
        { speaker: "POMNI", text: "[22:54] Thanks for always being concerned about me." },
        { speaker: "POMNI", text: "[22:57] I feel like, through everything," },
        { speaker: "POMNI", text: "[23:00] I haven't really been appreciative enough about that." },
        { speaker: "RAGATHA", text: "[23:03] O-Oh!" },
        { speaker: "RAGATHA", text: "[23:04] Thank you, Pomni." },
        { speaker: "RAGATHA", text: "[23:06] I just want to make sure you're doin' all right." },
        { speaker: "RAGATHA", text: "[23:09] You know, we care about you." },
        { speaker: "GANGLE", text: "[23:11] Did you remember to get my comedy mask?" },
        { speaker: "SFX", text: "[23:15] [bonk!]" },
        { speaker: "CAINE", text: "[23:16] And -- And now," },
        { speaker: "CAINE", text: "[23:16] I-I'm just starting to wonder" },
        { speaker: "CAINE", text: "[23:18] if the “Wild West” was…" },
        { speaker: "CAINE", text: "[23:20] e-even a real direction at all." },
        { speaker: "CAINE", text: "[23:23] Whoopsie-daisy!" },
        { speaker: "CAINE", text: "[23:24] Looks like everybody completed the adventure and they're coming home!" },
        { speaker: "CAINE", text: "[23:27] Quick, pretend we weren't having a therapy session!" },
        { speaker: "ZOOBLE", text: "[23:30] Okay?" },
        { speaker: "CAINE", text: "[23:32] Welcome back, my meowing milkmaids!" },
        { speaker: "ZOOBLE", text: "[23:37] Don't ever call us that again." },
        { speaker: "JAX", text: "[23:41] Heh, so, what was it like being stuck with the nutcase?" },
        { speaker: "POMNI", text: "[23:44] It wasn't that bad, actually." },
        { speaker: "MUSIC", text: "[23:50] ♪♪" },
        { speaker: "MUSIC", text: "[23:56] [upbeat, jazzy music plays]" },
        { speaker: "MUSIC", text: "[23:59] ♪♪" }
      ]
    },
    4: {
      title: "Épisode 4: Fast Food Masquerade",
      intro: [
        { speaker: "MUSIC", text: "[00:00] [upbeat techno music plays]" },
        { speaker: "MUSIC", text: "[00:03] ♪♪" },
        { speaker: "RAGATHA", text: "[00:10] So, you just wind your arm backwards in a big circle," },
        { speaker: "RAGATHA", text: "[00:14] release right at the bottom, and follow through." },
        { speaker: "RAGATHA", text: "[00:16] You got that?" },
        { speaker: "GANGLE", text: "[00:17] Uh…" },
        { speaker: "JAX", text: "[00:19] You're wasting your time, Raggy." },
        { speaker: "RAGATHA", text: "[00:19] [sighs]" },
        { speaker: "RAGATHA", text: "[00:21] Just wait a second." },
        { speaker: "GANGLE", text: "[00:23] Like this?" },
        { speaker: "RAGATHA", text: "[00:23] Yeah, you got it." },
        { speaker: "JAX", text: "[00:27] Oof!" },
        { speaker: "RAGATHA", text: "[00:27] Jax!" },
        { speaker: "JAX", text: "[00:28] I actually didn't mean to do that." },
        { speaker: "RAGATHA", text: "[00:30] Are you all right, Gangle?" },
        { speaker: "GANGLE", text: "[00:32] Owww…" },
        { speaker: "RAGATHA", text: "[00:34] [sighs] Why do you always gotta do this?" },
        { speaker: "JAX", text: "[00:36] What? I just said it was an accident." },
        { speaker: "RAGATHA", text: "[00:36] Unbelievable. You are unbelievable!" },
        { speaker: "ZOOBLE", text: "[00:38] Hey, Gangle." },
        { speaker: "ZOOBLE", text: "[00:38] I think I found something you might like." },
        { speaker: "RAGATHA", text: "[00:41] …really a bad guy!" },
        { speaker: "JAX", text: "[00:41] Oh, right, of course!" },
        { speaker: "JAX", text: "[00:42] What was I thinking?" },
        { speaker: "ZOOBLE", text: "[00:42] I dunno if it'll work," },
        { speaker: "ZOOBLE", text: "[00:44] but it looks about the same shape as yours." },
        { speaker: "GANGLE", text: "[00:47] Oh." },
        { speaker: "ZOOBLE", text: "[00:48] And the best part is, it's plastic." },
        { speaker: "SFX", text: "[00:49] [thunk-thunk!]" },
        { speaker: "ZOOBLE", text: "[00:49] So it won't break as easily." },
        { speaker: "ZOOBLE", text: "[00:53] Try it on." },
        { speaker: "ZOOBLE", text: "[00:58] How's it feel?" },
        { speaker: "GANGLE", text: "[00:59] It feels…" },
        { speaker: "GANGLE", text: "[01:02] normal." },
        { speaker: "GANGLE", text: "[01:03] Like, in a good way." },
        { speaker: "ZOOBLE", text: "[01:05] That's good. Right?" },
        { speaker: "GANGLE", text: "[01:06] Yeah." },
        { speaker: "GANGLE", text: "[01:08] Thank you, Zooble." },
        { speaker: "JAX", text: "[01:09] What the heck is this?" },
        { speaker: "JAX", text: "[01:10] You're just givin' away parts now?" },
        { speaker: "ZOOBLE", text: "[01:12] So what if I am?" },
        { speaker: "ZOOBLE", text: "[01:12] I'm not giving any to YOU." },
        { speaker: "JAX", text: "[01:15] [hisses through teeth]" },
        { speaker: "JAX", text: "[01:15] Darn." },
        { speaker: "JAX", text: "[01:16] I guess you're never gettin' that unicorn horn, Pomni." },
        { speaker: "POMNI", text: "[01:19] When did I ever say anything about that?" },
        { speaker: "JAX", text: "[01:21] I think you'd look good with one." },
        { speaker: "RAGATHA", text: "[01:25] Well, it's possib--" },
        { speaker: "CAINE", text: "[01:26] Did somebody say “adventure”?" },
        { speaker: "RAGATHA", text: "[01:26] Well, it's possib--" },
        { speaker: "POMNI", text: "[01:30] No…?" },
        { speaker: "CAINE", text: "[01:32] Today's adventure is…" },
        { speaker: "CAINE", text: "[01:37] That's right!" },
        { speaker: "CAINE", text: "[01:38] Scary human meat is all over the walls," },
        { speaker: "CAINE", text: "[01:41] and, boy, is it smelly!" },
        { speaker: "CAINE", text: "[01:43] It's up to you to --" },
        { speaker: "POMNI", text: "[01:43] Okay, wait, wait wait." },
        { speaker: "POMNI", text: "[01:45] Can we, like, chill with the horror?" },
        { speaker: "POMNI", text: "[01:47] Please?" },
        { speaker: "POMNI", text: "[01:48] I really don't want this to be like last time." },
        { speaker: "ZOOBLE", text: "[01:51] What happened last time?" },
        { speaker: "ZOOBLE", text: "[01:51] Was that the one made for me?" },
        { speaker: "POMNI", text: "[01:54] There was this awful, horrifying angel head thing." },
        { speaker: "POMNI", text: "[01:57] And when we tried to fight back at all," },
        { speaker: "POMNI", text: "[01:59] we got sent to Hell," },
        { speaker: "POMNI", text: "[02:00] where evil souls tried to infest our bodies." },
        { speaker: "POMNI", text: "[02:04] It was bad." },
        { speaker: "ZOOBLE", text: "[02:05] Why did you think I would like that?" },
        { speaker: "CAINE", text: "[02:07] Well, if you're all gonna be such CRITICS," },
        { speaker: "CAINE", text: "[02:10] why don't you suggest a better one?" },
        { speaker: "ZOOBLE", text: "[02:11] We do!" },
        { speaker: "ZOOBLE", text: "[02:12] Have you not checked the suggestion box once?" },
        { speaker: "CAINE", text: "[02:18] Gonna be real," },
        { speaker: "CAINE", text: "[02:18] I forgot we had that." },
        { speaker: "ZOOBLE", text: "[02:20] I knew it." },
        { speaker: "POMNI", text: "[02:21] We have a suggestion box?" },
        { speaker: "ZOOBLE", text: "[02:21] Basically, no." },
        { speaker: "CAINE", text: "[02:27] Bubble, plug that up." },
        { speaker: "BUBBLE", text: "[02:27] Bleh!" },
        { speaker: "CAINE", text: "[02:31] “How about an adventure where Zooble gets turned into a piñata," },
        { speaker: "CAINE", text: "[02:34] and we all take turns beating them up?”" },
        { speaker: "JAX", text: "[02:37] [chuckles] That one's mine." },
        { speaker: "ZOOBLE", text: "[02:37] Who would have guessed?" },
        { speaker: "CAINE", text: "[02:39] “Let's just have an adventure where Jax can't talk…" },
        { speaker: "CAINE", text: "[02:42] [muffled]" },
        { speaker: "CAINE", text: "[02:42] …through the entire thing.”" },
        { speaker: "JAX", text: "[02:43] Genuinely hurtful." },
        { speaker: "ZOOBLE", text: "[02:43] Good." },
        { speaker: "POMNI", text: "[02:45] Can we maybe pick one that's more… normal?" },
        { speaker: "CAINE", text: "[02:49] W-Well, I don't know what's NORMAL to you people!" },
        { speaker: "CAINE", text: "[02:52] “Let's have one where we all work at a fast food place.”" },
        { speaker: "CAINE", text: "[02:57] Is that normal?" },
        { speaker: "RAGATHA", text: "[02:57] Who wrote that?" },
        { speaker: "GANGLE", text: "[02:58] Uh, yeah, that's pretty normal." },
        { speaker: "CAINE", text: "[02:58] Great!" },
        { speaker: "CAINE", text: "[03:02] That means today's adventure is…" },
        { speaker: "CAINE", text: "[03:08] And YOU can be the shift manager!" },
        { speaker: "RAGATHA", text: "[03:11] You did not just make that today's adventure." },
        { speaker: "CAINE", text: "[03:13] That's right!" },
        { speaker: "CAINE", text: "[03:13] You've shown enough leadership skills today" },
        { speaker: "CAINE", text: "[03:15] to be the perfect shift manager!" },
        { speaker: "CAINE", text: "[03:18] Of course. Of course!" },
        { speaker: "CAINE", text: "[03:19] I'm already getting tons of ideas!" },
        { speaker: "CAINE", text: "[03:22] Haha--" },
        { speaker: "CAINE", text: "[03:26] That was weird." },
        { speaker: "ZOOBLE", text: "[03:26] Well, see you guys when it's over." },
        { speaker: "CAINE", text: "[03:29] Wh-- Again?!" },
        { speaker: "ZOOBLE", text: "[03:30] I'm not gonna be a wage slave for fun." },
        { speaker: "KINGER", text: "[03:32] [gasps]" },
        { speaker: "KINGER", text: "[03:32] Oh! I know!" },
        { speaker: "KINGER", text: "[03:34] I could sit this one out," },
        { speaker: "KINGER", text: "[03:35] and Zooble could take my place!" },
        { speaker: "ZOOBLE", text: "[03:37] Wh--" },
        { speaker: "ZOOBLE", text: "[03:37] That's not how that works." },
        { speaker: "CAINE", text: "[03:39] Great idea, Kinger!" },
        { speaker: "CAINE", text: "[03:40] It'll be nice to have you back on board, Zooble." },
        { speaker: "ZOOBLE", text: "[03:42] Wh--" },
        { speaker: "ZOOBLE", text: "[03:42] Are you kidding me?!" },
        { speaker: "ZOOBLE", text: "[03:44] I'm not just gonna be forced into this stupid adventu--" },
        { speaker: "CAINE", text: "[03:46] You can shut up now!" },
        { speaker: "ZOOBLE", text: "[03:48] [descending] AAAAAAAAAAAAAUUUUGH!!!!" },
        { speaker: "GANGLE", text: "[03:50] I think I might be able to give it a swing." },
        { speaker: "GANGLE", text: "[03:53] Being a shift manager WAS my job at one point." },
        { speaker: "CAINE", text: "[03:56] Then what are we waiting for?" },
        { speaker: "CAINE", text: "[03:57] Get your nonslip shoes ready," },
        { speaker: "CAINE", text: "[03:59] 'cause we're going to Spudy's!" },
        { speaker: "GANGLE", text: "[04:03] AGH!!" },
        { speaker: "MUSIC", text: "[04:04] [triumphant fanfare plays]" },
        { speaker: "ZOOBLE", text: "[04:09] --AAAGH!" },
        { speaker: "GANGLE", text: "[04:12] Well, I guess I should get into manager mode" },
        { speaker: "GANGLE", text: "[04:15] and get us all kicked off." },
        { speaker: "SFX", text: "[04:17] [buttons beeping]" },
        { speaker: "SFX", text: "[04:17] [switches flicking]" },
        { speaker: "MUSIC", text: "[04:19] [cheerful, industrious music plays]" },
        { speaker: "MUSIC", text: "[04:22] ♪♪" },
        { speaker: "GANGLE", text: "[04:25] And with that out of the way," },
        { speaker: "GANGLE", text: "[04:27] let's get to work, guys!" },
        { speaker: "JAX", text: "[04:29] Oh, no!" },
        { speaker: "JAX", text: "[04:30] It looks like I've taken Ragatha…" },
        { speaker: "RAGATHA", text: "[04:30] Huh?" },
        { speaker: "JAX", text: "[04:33] …And dropped her in the deep fryer." },
        { speaker: "RAGATHA", text: "[04:35] [burbled screaming]" },
        { speaker: "GANGLE", text: "[04:37] Oh, no no no no no no NO." },
        { speaker: "GANGLE", text: "[04:39] We can't have ANYTHING like that going on around here." },
        { speaker: "JAX", text: "[04:42] What are you gonna do about it, though?" },
        { speaker: "GANGLE", text: "[04:44] I'm calling upper management." },
        { speaker: "RAGATHA", text: "[04:44] [burbled screaming continues]" },
        { speaker: "SFX", text: "[04:46] [phone rings]" },
        { speaker: "CAINE", text: "[04:47] Mmmmyello?" },
        { speaker: "GANGLE", text: "[04:47] Hey, Caine." },
        { speaker: "GANGLE", text: "[04:49] We're having a bit of an issue with the employees," },
        { speaker: "GANGLE", text: "[04:52] and I was wondering if you could maybe have a punishment waiting for them" },
        { speaker: "GANGLE", text: "[04:55] at the end of the day if they do a terrible job?" },
        { speaker: "JAX", text: "[04:57] Wait, what?" },
        { speaker: "CAINE", text: "[04:57] Motivation!" },
        { speaker: "CAINE", text: "[04:59] That's what my adventures have been missing!" },
        { speaker: "CAINE", text: "[05:00] Great idea, Gangle." },
        { speaker: "CAINE", text: "[05:02] I'll be sure to make something TRULY awful" },
        { speaker: "CAINE", text: "[05:04] awaiting your rotten employees." },
        { speaker: "JAX", text: "[05:07] Why would you do this?" },
        { speaker: "GANGLE", text: "[05:08] It's called a manic episode," },
        { speaker: "GANGLE", text: "[05:10] and you're gettin' three more seasons!" },
        { speaker: "GANGLE", text: "[05:13] [laughs heartily]" },
        { speaker: "GANGLE", text: "[05:13] Anyway." },
        { speaker: "GANGLE", text: "[05:14] Jax, it's your job to set up the drink station," },
        { speaker: "GANGLE", text: "[05:17] make new coffee and iced tea," },
        { speaker: "GANGLE", text: "[05:19] and fill the ice cream machine." },
        { speaker: "GANGLE", text: "[05:20] So, get to it!" },
        { speaker: "RAGATHA", text: "[05:22] [screaming continues]" },
        { speaker: "POMNI", text: "[05:25] This is really weird." },
        { speaker: "SFX", text: "[05:31] [hiss!]" },
        { speaker: "ZOOBLE", text: "[05:31] Agh!" },
        { speaker: "SFX", text: "[05:36] [bouncing footsteps]" },
        { speaker: "STRANGE CUSTOMER", text: "[05:38] [unintelligible, rubbery speech]" },
        { speaker: "POMNI", text: "[05:40] Oh, uh -- uh," },
        { speaker: "POMNI", text: "[05:40] what can I get for you today?" },
        { speaker: "JAX", text: "[05:43] Oh, hey!" },
        { speaker: "JAX", text: "[05:43] It's Orbsman." },
        { speaker: "JAX", text: "[05:46] Oh, he's from a previous adventure." },
        { speaker: "JAX", text: "[05:48] Uh, before your time." },
        { speaker: "ORBSMAN", text: "[05:50] [unintelligible, rubbery speech continues]" },
        { speaker: "POMNI", text: "[05:57] Okay, uh, a Number 57." },
        { speaker: "JAX", text: "[06:02] Oh, I HAAATE this guy." },
        { speaker: "GANGLE", text: "[06:05] Never say you hate the customer" },
        { speaker: "GANGLE", text: "[06:07] while the customer is still here." },
        { speaker: "GANGLE", text: "[06:10] We wait until after hours for that." },
        { speaker: "MUSIC", text: "[06:12] [pleasant muzak plays over speakers]" },
        { speaker: "JAX", text: "[06:15] Ugh." },
        { speaker: "NPC 1", text: "[06:18] [rudely] Excuse me." },
        { speaker: "NPC 1", text: "[06:19] Yeah, little jester?" },
        { speaker: "NPC 1", text: "[06:21] I'd like to order the Stupid Burger." },
        { speaker: "NPC 1", text: "[06:23] Last time I ordered it here," },
        { speaker: "NPC 1", text: "[06:25] they forgot to add the sauce that makes you stupid." },
        { speaker: "NPC 1", text: "[06:27] Don't forget the sauce." },
        { speaker: "POMNI", text: "[06:30] I-Is that a thing we have?" },
        { speaker: "NPC 1", text: "[06:31] Yes." },
        { speaker: "NPC 1", text: "[06:31] I order it all the time." },
        { speaker: "NPC 1", text: "[06:34] I'm addicted." },
        { speaker: "POMNI", text: "[06:35] Okay." },
        { speaker: "POMNI", text: "[06:36] One Stupid Burger." },
        { speaker: "JAX", text: "[06:38] Heard you loud and clear." },
        { speaker: "MUSIC", text: "[06:40] ♪♪" },
        { speaker: "JAX", text: "[06:42] Guh!" },
        { speaker: "MUSIC", text: "[06:43] ♪♪" },
        { speaker: "SFX", text: "[06:46] [warped rushing]" },
        { speaker: "MUSIC", text: "[06:52] [sinister music plays]" },
        { speaker: "MUSIC", text: "[06:55] ♪♪" },
        { speaker: "JAX", text: "[07:00] [guffaws softly]" },
        { speaker: "JAX", text: "[07:02] So, you're just, like," },
        { speaker: "JAX", text: "[07:02] actually doing the job." },
        { speaker: "ZOOBLE", text: "[07:06] Yeah?" },
        { speaker: "ZOOBLE", text: "[07:06] I don't want Caine to punish me." },
        { speaker: "JAX", text: "[07:08] [scoffs] Caine's not gonna do anything malicious." },
        { speaker: "JAX", text: "[07:10] It's… [sniffs]" },
        { speaker: "JAX", text: "[07:10] …not in his nature." },
        { speaker: "ZOOBLE", text: "[07:12] You really want to find out?" },
        { speaker: "ZOOBLE", text: "[07:14] The only thing holding Caine back" },
        { speaker: "ZOOBLE", text: "[07:14] is the fact that he likes us." },
        { speaker: "ZOOBLE", text: "[07:17] I wouldn't push it." },
        { speaker: "JAX", text: "[07:18] That's rich coming from you." },
        { speaker: "JAX", text: "[07:23] Ugh!" },
        { speaker: "SFX", text: "[07:25] [dishes clinking]" },
        { speaker: "POMNI", text: "[07:27] [yelps]" },
        { speaker: "POMNI", text: "[07:29] Hello!" },
        { speaker: "GUMMIGOO", text: "[07:29] Hello, sheila!" },
        { speaker: "GUMMIGOO", text: "[07:31] I'll have a sausage bacon jaffle combo." },
        { speaker: "GUMMIGOO", text: "[07:33] And the mates here just want six hash browns split between ‘em." },
        { speaker: "POMNI", text: "[07:36] Yeah, yeah, okay." },
        { speaker: "POMNI", text: "[07:37] Uh, are you --" },
        { speaker: "POMNI", text: "[07:37] Do y-y-you --" },
        { speaker: "POMNI", text: "[07:40] Hi!" },
        { speaker: "GUMMIGOO", text: "[07:41] Uh -- Are you, uh --" },
        { speaker: "GUMMIGOO", text: "[07:43] You all right, miss?" },
        { speaker: "POMNI", text: "[07:44] Y-yeah, yeah, yeah." },
        { speaker: "POMNI", text: "[07:44] I'm fiiiine." },
        { speaker: "POMNI", text: "[07:47] I'll call your order when your name's ready, er --" },
        { speaker: "POMNI", text: "[07:50] [stammers] Yeah." },
        { speaker: "MAX", text: "[07:55] Aw, wait --" },
        { speaker: "MAX", text: "[07:55] I forgot to ask for a kid's meal toy." },
        { speaker: "GUMMIGOO", text: "[07:58] You're not a kid." },
        { speaker: "MAX", text: "[07:58] Ah, yeah." },
        { speaker: "MAX", text: "[08:00] Uh, an adult toy, then." },
        { speaker: "GUMMIGOO", text: "[08:01] Eh, don't know about that one, mate." },
        { speaker: "GUMMIGOO", text: "[08:05] Uh, can I help you, miss?" },
        { speaker: "POMNI", text: "[08:07] I, uh…" },
        { speaker: "POMNI", text: "[08:07] [laughs nervously]" },
        { speaker: "POMNI", text: "[08:09] …just wanted to say hi." },
        { speaker: "GUMMIGOO", text: "[08:12] Um…" },
        { speaker: "GUMMIGOO", text: "[08:14] Hi." },
        { speaker: "GUMMIGOO", text: "[08:15] Do we know each other?" },
        { speaker: "POMNI", text: "[08:17] I…" },
        { speaker: "POMNI", text: "[08:19] don't know." },
        { speaker: "GANGLE", text: "[08:23] What?" },
        { speaker: "GANGLE", text: "[08:23] Ragatha, where's Pomni?" },
        { speaker: "RAGATHA", text: "[08:26] [slow, slurred speech]" },
        { speaker: "RAGATHA", text: "[08:26] Huh?" },
        { speaker: "RAGATHA", text: "[08:27] Oh, she's flirting with the gummy guy." },
        { speaker: "RAGATHA", text: "[08:30] 'Cause she'd rather be with the NPC" },
        { speaker: "RAGATHA", text: "[08:33] than with us, or something." },
        { speaker: "GANGLE", text: "[08:35] Hmm." },
        { speaker: "GANGLE", text: "[08:36] Well, that won't do." },
        { speaker: "RAGATHA", text: "[08:40] I wish someone would flirt with me." },
        { speaker: "GANGLE", text: "[08:43] Pomni! We need you on the register!" },
        { speaker: "GANGLE", text: "[08:45] Stop weirding the customers out!" },
        { speaker: "POMNI", text: "[08:48] But it's Gummigoo." },
        { speaker: "POMNI", text: "[08:50] Can't the job wait a bit?" },
        { speaker: "POMNI", text: "[08:51] It's not like this is real." },
        { speaker: "GANGLE", text: "[08:51] [laughs sarcastically]" },
        { speaker: "GANGLE", text: "[08:54] Next you're gonna say my authority isn't real." },
        { speaker: "SFX", text: "[09:00] [tink!]" },
        { speaker: "GANGLE", text: "[09:02] Anyway, put away that breakfast menu," },
        { speaker: "GANGLE", text: "[09:05] because it's lunch time!" },
        { speaker: "GANGLE", text: "[09:10] All right, fellas, it's lunch rush." },
        { speaker: "GANGLE", text: "[09:13] Get your game faces on!" },
        { speaker: "SFX", text: "[09:15] [distant equipment beeping]" },
        { speaker: "SFX", text: "[09:15] [dishes clinking]" },
        { speaker: "SFX", text: "[09:21] [register dinging repeatedly]" },
        { speaker: "GLOINK QUEEN", text: "[09:23] [growling]" },
        { speaker: "POMNI", text: "[09:23] [stammers]" },
        { speaker: "POMNI", text: "[09:25] Does this count as a bus?" },
        { speaker: "POMNI", text: "[09:29] Are you ready to order?" },
        { speaker: "NPC 2", text: "[09:31] No, thanks." },
        { speaker: "NPC 2", text: "[09:32] I got this bowl of cereal." },
        { speaker: "SFX", text: "[09:33] [crunching]" },
        { speaker: "POMNI", text: "[09:35] Well, there's a line of people behind --" },
        { speaker: "SFX", text: "[09:35] [rumbling]" },
        { speaker: "NPC 2", text: "[09:37] [munching]" },
        { speaker: "SFX", text: "[09:37] [NPCs screaming]" },
        { speaker: "GLOINK QUEEN", text: "[09:40] 300 cheeseburgers" },
        { speaker: "GLOINK QUEEN", text: "[09:40] for all my precious spawn!" },
        { speaker: "POMNI", text: "[09:45] Is that for here, or to…" },
        { speaker: "POMNI", text: "[09:50] Uhhhh, can you hold on for just a second?" },
        { speaker: "NPC 3", text: "[09:55] AGH!! AAAAAGH!!!" },
        { speaker: "GLOINK QUEEN", text: "[09:58] Blumby, Skethers, Leotthew!" },
        { speaker: "GLOINK QUEEN", text: "[09:59] Leave that poor, pitiful creature alone!" },
        { speaker: "POMNI", text: "[10:03] Do all the gloinks have names?" },
        { speaker: "GLOINK QUEEN", text: "[10:06] Of COURSE they do!" },
        { speaker: "GLOINK QUEEN", text: "[10:08] I love and cherish every gloink I give birth to!" },
        { speaker: "GLOINK QUEEN", text: "[10:11] What kind of mother do you think I am?" },
        { speaker: "RAGATHA", text: "[10:16] [slurring]" },
        { speaker: "RAGATHA", text: "[10:16] Tha's beautiful…" },
        { speaker: "POMNI", text: "[10:19] Hey, I-I…" },
        { speaker: "POMNI", text: "[10:24] [speaking indistinctly]" },
        { speaker: "MUSIC", text: "[10:26] [mellow music plays]" },
        { speaker: "POMNI", text: "[10:28] I-I just…" },
        { speaker: "POMNI", text: "[10:29] w-want to wish you a pleasant day." },
        { speaker: "POMNI", text: "[10:32] Thanks for eating at Spudsy's." },
        { speaker: "MUSIC", text: "[10:34] ♪♪" },
        { speaker: "GUMMIGOO", text: "[10:37] Have a good one, miss." },
        { speaker: "SFX", text: "[10:40] [bell jingles]" },
        { speaker: "SFX", text: "[10:41] [door creaks]" },
        { speaker: "MUSIC", text: "[10:45] [lighthearted music plays]" },
        { speaker: "GANGLE", text: "[10:46] [sing-song] Oh, Ja-ax!" },
        { speaker: "GANGLE", text: "[10:48] [normal voice]" },
        { speaker: "GANGLE", text: "[10:48] The bathroom looks like a biohazard" },
        { speaker: "GANGLE", text: "[10:50] and needs a good scrubbin'." },
        { speaker: "JAX", text: "[10:53] Uh, I dunno -- shouldn't, like," },
        { speaker: "JAX", text: "[10:53] a biohazard crew take care of that?" },
        { speaker: "GANGLE", text: "[10:56] [laughs] Oh, Jaxy-boy." },
        { speaker: "GANGLE", text: "[10:59] Don't you want to be a model employee?" },
        { speaker: "JAX", text: "[11:01] No. I don't care about any of this." },
        { speaker: "GANGLE", text: "[11:03] Well, that doesn't really sound like a can-do attitude to me." },
        { speaker: "JAX", text: "[11:07] It's not." },
        { speaker: "GANGLE", text: "[11:07] [laughs stiffly] Bad." },
        { speaker: "JAX", text: "[11:10] I like you better when you're sad." },
        { speaker: "SFX", text: "[11:12] [tink!!]" },
        { speaker: "GANGLE", text: "[11:13] [laughs] Well." },
        { speaker: "GANGLE", text: "[11:15] Maybe YOU just need some more…" },
        { speaker: "JAX", text: "[11:21] More --" },
        { speaker: "GANGLE", text: "[11:21] …Training!" },
        { speaker: "JAX", text: "[11:25] BLEGH! [grunts]" },
        { speaker: "JAX", text: "[11:27] Uh -- Huh?" },
        { speaker: "JAX", text: "[11:29] Huh??" },
        { speaker: "SFX", text: "[11:31] [TV zaps on]" },
        { speaker: "MUSIC", text: "[11:31] [pleasant music plays]" },
        { speaker: "TRAINING VIDEO", text: "[11:32] Hi!" },
        { speaker: "TRAINING VIDEO", text: "[11:32] Welcome to Spudsy's." },
        { speaker: "TRAINING VIDEO", text: "[11:35] In this video, you're gonna learn the ins and outs" },
        { speaker: "TRAINING VIDEO", text: "[11:38] of what makes YOU a good crew member --" },
        { speaker: "TRAINING VIDEO", text: "[11:40] AND a valuable asset to the Spudsy's Corporation." },
        { speaker: "JAX", text: "[11:43] When did you make this?" },
        { speaker: "TRAINING VIDEO", text: "[11:45] Now, I know what you're thinking --" },
        { speaker: "TRAINING VIDEO", text: "[11:47] “I don't want a career in fast food." },
        { speaker: "TRAINING VIDEO", text: "[11:49] I want to be a comic artist" },
        { speaker: "TRAINING VIDEO", text: "[11:51] and eventually launch my own manga-inspired webcomic!”" },
        { speaker: "TRAINING VIDEO", text: "[11:54] And it's cool to have dreams," },
        { speaker: "TRAINING VIDEO", text: "[11:57] but you also need to remember that they're completely unrealistic," },
        { speaker: "TRAINING VIDEO", text: "[12:00] and you need to stop trying." },
        { speaker: "TRAINING VIDEO", text: "[12:04] But before we get into all that," },
        { speaker: "TRAINING VIDEO", text: "[12:06] first things first!" },
        { speaker: "TRAINING VIDEO", text: "[12:08] Are you smiling?" },
        { speaker: "JAX", text: "[12:10] Uh, no?" },
        { speaker: "MUSIC", text: "[12:12] [music stops]" },
        { speaker: "TRAINING VIDEO", text: "[12:12] Why not?" },
        { speaker: "JAX", text: "[12:14] Uh -- Uh --" },
        { speaker: "JAX", text: "[12:15] Wait -- Uh -- Wait, wait -- Uh -- Wait -- Um --" },
        { speaker: "JAX", text: "[12:18] No-- Nobody can see this, right?" },
        { speaker: "TRAINING VIDEO", text: "[12:20] It's time for your employee reevaluation." },
        { speaker: "SFX", text: "[12:25] [alternating tones play rapidly]" },
        { speaker: "MUSIC", text: "[12:34] [silly music plays]" },
        { speaker: "RAGATHA", text: "[12:35] Hmmmm…" },
        { speaker: "RAGATHA", text: "[12:36] Hhhhhhhhhhhhhhhhorseradish sauce…" },
        { speaker: "ZOOBLE", text: "[12:40] Hey!" },
        { speaker: "ZOOBLE", text: "[12:40] We need to start assembling these." },
        { speaker: "ZOOBLE", text: "[12:42] I'm running out of room here." },
        { speaker: "RAGATHA", text: "[12:43] Ehh, I made, like," },
        { speaker: "RAGATHA", text: "[12:43] five or six of 'em?" },
        { speaker: "ZOOBLE", text: "[12:47] Cool." },
        { speaker: "ZOOBLE", text: "[12:47] That's 6 out of 300." },
        { speaker: "RAGATHA", text: "[12:49] Uuughh." },
        { speaker: "RAGATHA", text: "[12:50] You…" },
        { speaker: "RAGATHA", text: "[12:51] are such a grouch." },
        { speaker: "RAGATHA", text: "[12:54] Why are you always being a --" },
        { speaker: "RAGATHA", text: "[12:54] a -- a grunch?" },
        { speaker: "RAGATHA", text: "[12:57] Grun -- Haha…" },
        { speaker: "ZOOBLE", text: "[12:59] Gangle," },
        { speaker: "ZOOBLE", text: "[12:59] can you help Ragatha?" },
        { speaker: "ZOOBLE", text: "[13:01] I think she…" },
        { speaker: "ZOOBLE", text: "[13:02] huffed paint, or something." },
        { speaker: "GANGLE", text: "[13:04] Huffing paint and not waiting until a designated break?" },
        { speaker: "GANGLE", text: "[13:08] I'll be right there." },
        { speaker: "RAGATHA", text: "[13:09] No, wait." },
        { speaker: "RAGATHA", text: "[13:10] I can do it." },
        { speaker: "RAGATHA", text: "[13:11] [giggling] I just gotta grab the horseradish sauce." },
        { speaker: "RAGATHA", text: "[13:16] [sighs]" },
        { speaker: "RAGATHA", text: "[13:16] I miss my horses." },
        { speaker: "GANGLE", text: "[13:19] Here, let me help you with that." },
        { speaker: "RAGATHA", text: "[13:21] Why are you even the boss, anyway?" },
        { speaker: "RAGATHA", text: "[13:23] I feel like I'm way more responsible than you a-- [sighs]" },
        { speaker: "GANGLE", text: "[13:27] Well, if you under-perform now," },
        { speaker: "GANGLE", text: "[13:29] you might end up hurt later." },
        { speaker: "RAGATHA", text: "[13:31] Hurt, nothin'!" },
        { speaker: "RAGATHA", text: "[13:32] I'm hurt enough." },
        { speaker: "RAGATHA", text: "[13:34] Packages landin' on my head." },
        { speaker: "RAGATHA", text: "[13:36] Tea parties." },
        { speaker: "RAGATHA", text: "[13:37] Dancin' lessons." },
        { speaker: "ZOOBLE", text: "[13:39] What's wrong with her?" },
        { speaker: "GANGLE", text: "[13:42] You know, a team works much better" },
        { speaker: "GANGLE", text: "[13:44] when we're all giving it 110%" },
        { speaker: "GANGLE", text: "[13:46] instead of, uh… 5%." },
        { speaker: "RAGATHA", text: "[13:49] No offense," },
        { speaker: "RAGATHA", text: "[13:49] but you're kind of annoying" },
        { speaker: "RAGATHA", text: "[13:52] when you have your happy mask." },
        { speaker: "SFX", text: "[13:53] [TINK!!!]" },
        { speaker: "RAGATHA", text: "[13:56] Wait, is that mean to say?" },
        { speaker: "GANGLE", text: "[13:58] Zooble," },
        { speaker: "GANGLE", text: "[13:58] help Ragatha with assembly." },
        { speaker: "GANGLE", text: "[14:01] I'm gonna go over here now." },
        { speaker: "JAX", text: "[14:14] Oh, are you KIDDING ME?!" },
        { speaker: "JAX", text: "[14:16] Hey, Gangle!" },
        { speaker: "JAX", text: "[14:17] I think the clock's broken." },
        { speaker: "GANGLE", text: "[14:19] Is it broken?" },
        { speaker: "GANGLE", text: "[14:20] Or are we the broken ones?" },
        { speaker: "JAX", text: "[14:20] Ah, great." },
        { speaker: "GANGLE", text: "[14:23] How long has this shift really gone on for?" },
        { speaker: "GANGLE", text: "[14:25] Six hours?" },
        { speaker: "GANGLE", text: "[14:27] 8? 24?" },
        { speaker: "GANGLE", text: "[14:29] A week? A year?" },
        { speaker: "GANGLE", text: "[14:30] Does time even move in here?" },
        { speaker: "GANGLE", text: "[14:32] Will we ever go home?" },
        { speaker: "GANGLE", text: "[14:34] Will we ever achieve our dreams?" },
        { speaker: "SFX", text: "[14:36] [watch beeps]" },
        { speaker: "GANGLE", text: "[14:38] Oh, wait." },
        { speaker: "GANGLE", text: "[14:40] Yeah, that clock's broken." },
        { speaker: "SFX", text: "[14:42] [insects chirping]" },
        { speaker: "SFX", text: "[14:45] [gloinks rattling]" },
        { speaker: "SFX", text: "[14:45] [door opens]" },
        { speaker: "SFX", text: "[14:46] [bell jingles]" },
        { speaker: "POMNI", text: "[14:48] Well, that was more info on gloink reproduction" },
        { speaker: "POMNI", text: "[14:52] than I ever needed to know." },
        { speaker: "SFX", text: "[14:54] [distant equipment beeping]" },
        { speaker: "JAX", text: "[14:59] Can you move?" },
        { speaker: "RAGATHA", text: "[15:01] Yo, Jax." },
        { speaker: "RAGATHA", text: "[15:03] I, like… hate you." },
        { speaker: "RAGATHA", text: "[15:06] But I don't want you to hate me." },
        { speaker: "RAGATHA", text: "[15:08] Is that weird?" },
        { speaker: "JAX", text: "[15:11] You're drunk, or something." },
        { speaker: "RAGATHA", text: "[15:15] Oh, yeah." },
        { speaker: "RAGATHA", text: "[15:15] [laughs dreamily]" },
        { speaker: "JAX", text: "[15:19] [sighs] How you doin'?" },
        { speaker: "POMNI", text: "[15:21] Everything's been --" },
        { speaker: "POMNI", text: "[15:23] I'm doing fine." },
        { speaker: "JAX", text: "[15:26] [sighs] Wish I could say the same." },
        { speaker: "GANGLE", text: "[15:29] Jax! There's dishes back here!" },
        { speaker: "GANGLE", text: "[15:31] You got time to lean," },
        { speaker: "GANGLE", text: "[15:31] you got time to clean!" },
        { speaker: "GANGLE", text: "[15:34] [laughs]" },
        { speaker: "JAX", text: "[15:34] Ugh, God." },
        { speaker: "JAX", text: "[15:36] I'm on it!" },
        { speaker: "JAX", text: "[15:38] Later, Pomni." },
        { speaker: "SFX", text: "[15:42] [insects chirping]" },
        { speaker: "SFX", text: "[15:51] [inhales deeply]" },
        { speaker: "SFX", text: "[15:52] [muffled shrieking]" },
        { speaker: "POMNI", text: "[16:00] You, uh…" },
        { speaker: "POMNI", text: "[16:02] You good?" },
        { speaker: "GANGLE", text: "[16:04] My comedy mask is usually broken by now." },
        { speaker: "POMNI", text: "[16:08] We're doing another one of these." },
        { speaker: "POMNI", text: "[16:10] Um, is the mask not making you happy?" },
        { speaker: "POMNI", text: "[16:17] Do you have anybody to talk to?" },
        { speaker: "POMNI", text: "[16:20] Like, in regards to…" },
        { speaker: "POMNI", text: "[16:23] your issues." },
        { speaker: "POMNI", text: "[16:24] I'm sure Ragatha would like to help you out." },
        { speaker: "GANGLE", text: "[16:28] Heh." },
        { speaker: "GANGLE", text: "[16:29] Oh, Ragatha." },
        { speaker: "GANGLE", text: "[16:32] I love her, but…" },
        { speaker: "GANGLE", text: "[16:34] after a while," },
        { speaker: "GANGLE", text: "[16:34] it gets kind of hard to tell" },
        { speaker: "GANGLE", text: "[16:36] how genuine she's actually being." },
        { speaker: "POMNI", text: "[16:40] Well, maybe --" },
        { speaker: "GANGLE", text: "[16:40] Aaaanyway!" },
        { speaker: "GANGLE", text: "[16:43] We can't spend all night out here talking about our feelings." },
        { speaker: "GANGLE", text: "[16:47] We've got work to do!" },
        { speaker: "GANGLE", text: "[16:49] [laughs weakly]" },
        { speaker: "JAX", text: "[17:05] [sighs]" },
        { speaker: "JAX", text: "[17:05] All right, I'm clockin' out." },
        { speaker: "JAX", text: "[17:07] This wasn't fun at all." },
        { speaker: "JAX", text: "[17:09] See you all later." },
        { speaker: "SFX", text: "[17:09] [visor clatters]" },
        { speaker: "SFX", text: "[17:16] [bell jingles]" },
        { speaker: "GANGLE", text: "[17:29] [groans]" },
        { speaker: "ZOOBLE", text: "[17:34] You know," },
        { speaker: "ZOOBLE", text: "[17:34] when Ragatha gets off," },
        { speaker: "ZOOBLE", text: "[17:36] I feel like she might need a designated driver." },
        { speaker: "GANGLE", text: "[17:39] Why are you asking me?" },
        { speaker: "GANGLE", text: "[17:42] I'm closing tonight." },
        { speaker: "ZOOBLE", text: "[17:43] Oh, no," },
        { speaker: "ZOOBLE", text: "[17:43] I meant I'd drive her home." },
        { speaker: "GANGLE", text: "[17:46] Oh." },
        { speaker: "GANGLE", text: "[17:47] I think she gets off in an hour." },
        { speaker: "ZOOBLE", text: "[17:50] Okay." },
        { speaker: "ZOOBLE", text: "[17:50] I can stick around until then." },
        { speaker: "SFX", text: "[18:01] [soft ambient static]" },
        { speaker: "MUSIC", text: "[18:12] [quiet, unpleasant music plays]" },
        { speaker: "MUSIC", text: "[18:15] ♪♪" },
        { speaker: "POMNI", text: "[18:34] Hey." },
        { speaker: "POMNI", text: "[18:36] You know…" },
        { speaker: "POMNI", text: "[18:38] I can close for you, if you want." },
        { speaker: "GANGLE", text: "[18:41] Huh?" },
        { speaker: "POMNI", text: "[18:43] If you want to get out of here, you can." },
        { speaker: "POMNI", text: "[18:46] You don't have to be stuck here alone." },
        { speaker: "POMNI", text: "[18:48] I can handle closing." },
        { speaker: "GANGLE", text: "[18:52] Would that…" },
        { speaker: "GANGLE", text: "[18:54] …be okay?" },
        { speaker: "POMNI", text: "[18:56] I think so." },
        { speaker: "POMNI", text: "[18:58] You should go home and get some rest." },
        { speaker: "MUSIC", text: "[19:00] [hopeful music plays]" },
        { speaker: "MUSIC", text: "[19:03] ♪♪" },
        { speaker: "SFX", text: "[19:20] [bell jingles]" },
        { speaker: "MUSIC", text: "[19:21] ♪♪" },
        { speaker: "POMNI", text: "[19:23] What a weird day." },
        { speaker: "SFX", text: "[19:26] [insects chirping]" },
        { speaker: "MUSIC", text: "[19:28] [mellow music plays]" },
        { speaker: "MUSIC", text: "[19:31] ♪♪" },
        { speaker: "MUSIC", text: "[19:46] [music swells]" },
        { speaker: "MUSIC", text: "[19:47] [dramatic, hopeful music plays]" },
        { speaker: "MUSIC", text: "[19:49] ♪♪" },
        { speaker: "MUSIC", text: "[20:15] [music slows]" },
        { speaker: "MUSIC", text: "[20:17] ♪♪" },
        { speaker: "SFX", text: "[20:24] [HOOOONK!!]" },
        { speaker: "SFX", text: "[20:27] [clock ticking]" }
      ],
      outro: [
        { speaker: "CAINE", text: "[20:29] All righty, let's get this performance review out of the way." },
        { speaker: "CAINE", text: "[20:34] Overall, pretty productive." },
        { speaker: "CAINE", text: "[20:35] Made a lot of sales with few customer complaints." },
        { speaker: "CAINE", text: "[20:38] Couldn't help but notice, however," },
        { speaker: "CAINE", text: "[20:39] that you seem to have cut your own shift short," },
        { speaker: "CAINE", text: "[20:41] went a little kooky," },
        { speaker: "CAINE", text: "[20:41] and ran out into oncoming traffic." },
        { speaker: "CAINE", text: "[20:45] Now, being in a position of power like this," },
        { speaker: "CAINE", text: "[20:47] you cooooould offload the blame" },
        { speaker: "CAINE", text: "[20:50] to one of your employees" },
        { speaker: "CAINE", text: "[20:51] and avoid the dock on your score." },
        { speaker: "CAINE", text: "[20:54] What do you think?" },
        { speaker: "GANGLE", text: "[20:55] No, that was my responsibility." },
        { speaker: "GANGLE", text: "[20:59] I just…" },
        { speaker: "GANGLE", text: "[21:01] …Cracked under the pressure, I suppose." },
        { speaker: "CAINE", text: "[21:03] Hmm." },
        { speaker: "CAINE", text: "[21:04] Well, that's gonna knock your overall score down to…" },
        { speaker: "CAINE", text: "[21:09] a B-plus!" },
        { speaker: "CAINE", text: "[21:10] How's that sound?" },
        { speaker: "CAINE", text: "[21:13] Speechless." },
        { speaker: "CAINE", text: "[21:14] I can't say I blame you." },
        { speaker: "CAINE", text: "[21:16] Not every executive is as forgiving as me." },
        { speaker: "CAINE", text: "[21:21] And that's it for the reviews!" },
        { speaker: "CAINE", text: "[21:22] You have yourself a nice day." },
        { speaker: "SFX", text: "[21:30] [door creaks]" },
        { speaker: "CAINE", text: "[21:35] I am such a good --" },
        { speaker: "SFX", text: "[21:36] [glitched, distorted audio]" },
        { speaker: "NOTE", text: "[21:38] [no audible dialogue]" },
        { speaker: "ZOOBLE", text: "[21:43] Hey," },
        { speaker: "ZOOBLE", text: "[21:43] what are you all the way out here for?" },
        { speaker: "GANGLE", text: "[21:46] [sniffles]" },
        { speaker: "GANGLE", text: "[21:46] I messed everything up." },
        { speaker: "GANGLE", text: "[21:50] The mask didn't work." },
        { speaker: "GANGLE", text: "[21:50] [sniffles]" },
        { speaker: "GANGLE", text: "[21:52] And now, I don't think anybody wants to talk to me anymore." },
        { speaker: "ZOOBLE", text: "[21:57] I still like talking to you." },
        { speaker: "ZOOBLE", text: "[22:01] Look, the new mask was a bust." },
        { speaker: "ZOOBLE", text: "[22:03] So, what?" },
        { speaker: "ZOOBLE", text: "[22:04] I'm sure we'll find something that works eventually." },
        { speaker: "GANGLE", text: "[22:08] [sniffles]" },
        { speaker: "GANGLE", text: "[22:08] [chuckles softly]" },
        { speaker: "GANGLE", text: "[22:10] I don't deserve a friend like you." },
        { speaker: "ZOOBLE", text: "[22:13] [chuckles]" },
        { speaker: "ZOOBLE", text: "[22:13] Well, you've got one." },
        { speaker: "ZOOBLE", text: "[22:15] Now, come on over and hang out with the rest of us." },
        { speaker: "ZOOBLE", text: "[22:18] Bring your art, too." },
        { speaker: "ZOOBLE", text: "[22:20] I always like seeing what you draw." },
        { speaker: "MUSIC", text: "[22:21] [hopeful music plays]" },
        { speaker: "MUSIC", text: "[22:24] ♪♪" },
        { speaker: "MUSIC", text: "[22:32] [upbeat jazzy music plays]" },
        { speaker: "MUSIC", text: "[22:35] ♪♪" }
      ]
    },
    5: {
      title: "Épisode 5: Sans titre",
      intro: [
        { speaker: "SYSTEM", text: "[00:00:00] [upbeat techno music plays]" },
        { speaker: "SYSTEM", text: "[00:00:03] ♪♪" },
        { speaker: "SYSTEM", text: "[00:00:06] [cheerful music plays]" },
        { speaker: "SYSTEM", text: "[00:00:10] [schwing!]" },
        { speaker: "SYSTEM", text: "[00:00:11] -Welcome back, my candy hearts and paper flowers!" },
        { speaker: "SYSTEM", text: "[00:00:15] [schwing!]" },
        { speaker: "SYSTEM", text: "[00:00:16] -[grunts]" },
        { speaker: "SYSTEM", text: "[00:00:18] -Well, that sure could have gone better." },
        { speaker: "SYSTEM", text: "[00:00:21] But I'm sure the next adventure will be less..." },
        { speaker: "SYSTEM", text: "[00:00:24] uh, wet." },
        { speaker: "KINGER", text: "[00:00:27] Hey, Ragatha?" },
        { speaker: "KINGER", text: "[00:00:28] Can you help me count my eggs before they hatch?" },
        { speaker: "SYSTEM", text: "[00:00:31] -Oh, yeah, of course." },
        { speaker: "SYSTEM", text: "[00:00:32] Uh -- Wait, what?" },
        { speaker: "SYSTEM", text: "[00:00:35] -Looks like that oh-so-positive Ragatha charm" },
        { speaker: "SYSTEM", text: "[00:00:37] is starting to wear off, huh?" },
        { speaker: "SYSTEM", text: "[00:00:39] -[groans]" },
        { speaker: "SYSTEM", text: "[00:00:44] -Hmm." },
        { speaker: "SYSTEM", text: "[00:00:46] Hmm..." },
        { speaker: "ZOOBLE", text: "[00:00:47] -[Zooble]: Looks like this one was a home run, eh?" },
        { speaker: "SYSTEM", text: "[00:00:49] -Oh, Zooble, you mismatched cash-piano." },
        { speaker: "SYSTEM", text: "[00:00:52] I'll tear YOU TO PIECE--" },
        { speaker: "SYSTEM", text: "[00:00:53] Constructive criticism would be greatly appreciated." },
        { speaker: "ZOOBLE", text: "[00:00:55] -[Zooble]: But never acknowledged." },
        { speaker: "SYSTEM", text: "[00:00:57] -[growls] That's it!" },
        { speaker: "SYSTEM", text: "[00:00:58] Everybody besides Zooble, get over here!" },
        { speaker: "SYSTEM", text: "[00:01:01] [mystical shimmering]" },
        { speaker: "SYSTEM", text: "[00:01:03] Everyone, I'm going to pitch to you some future adventure ideas," },
        { speaker: "SYSTEM", text: "[00:01:07] and I'm going to ask you to give me your honest opinions on them." },
        { speaker: "SYSTEM", text: "[00:01:11] -I was gonna sleep. -All right!" },
        { speaker: "SYSTEM", text: "[00:01:12] So, I've got an adventure where you all tour" },
        { speaker: "SYSTEM", text: "[00:01:14] my amazing magic chocolate factory" },
        { speaker: "SYSTEM", text: "[00:01:17] and get killed off one by one from OSHA violations," },
        { speaker: "SYSTEM", text: "[00:01:19] one where a sentient cardiovascular system" },
        { speaker: "SYSTEM", text: "[00:01:22] goes to war against the United States military," },
        { speaker: "SYSTEM", text: "[00:01:24] and one where you have to survive in a post-apocalyptic nuclear wasteland" },
        { speaker: "SYSTEM", text: "[00:01:28] with a telepathic talking dog who's mean to you the whole time!" },
        { speaker: "SYSTEM", text: "[00:01:32] What do you think?" },
        { speaker: "SYSTEM", text: "[00:01:35] -Uh, I don't know." },
        { speaker: "SYSTEM", text: "[00:01:37] They all sound a little..." },
        { speaker: "SYSTEM", text: "[00:01:39] uh, dark?" },
        { speaker: "SYSTEM", text: "[00:01:40] -I can't tell a compelling story where nothing bad happens." },
        { speaker: "SYSTEM", text: "[00:01:44] Where's the intrigue? The stakes?" },
        { speaker: "SYSTEM", text: "[00:01:45] -Not to mention the sssssex appeal." },
        { speaker: "SYSTEM", text: "[00:01:49] -What are you talking about?" },
        { speaker: "ZOOBLE", text: "[00:01:50] -[Zooble]: You know, you could always try the suggestion box again." },
        { speaker: "SYSTEM", text: "[00:01:54] I honestly didn't hate the last one we did with it." },
        { speaker: "SYSTEM", text: "[00:01:56] -You... didn't hate it?" },
        { speaker: "ZOOBLE", text: "[00:01:58] -[Zooble]: It was kind of refreshing doing something grounded in reality." },
        { speaker: "SYSTEM", text: "[00:02:01] -Yeah, I really didn't mind that one, either." },
        { speaker: "SYSTEM", text: "[00:02:05] -Uh, what about the rest of you? [overlapping chatter]" },
        { speaker: "JAX", text: "[00:02:07] -[Jax]: I very much did not enjoy that one in the slightest," },
        { speaker: "SYSTEM", text: "[00:02:10] and if we ever do anything even close to that again," },
        { speaker: "SYSTEM", text: "[00:02:13] I'm getting violent, and I'm going to kill Ragatha." },
        { speaker: "SYSTEM", text: "[00:02:17] -Well, how am I gonna please everybody if you all like different things?" },
        { speaker: "ZOOBLE", text: "[00:02:20] -[Zooble]: Maybe just keep your adventures open at all times" },
        { speaker: "SYSTEM", text: "[00:02:23] and let us do whatever we want, when we want." },
        { speaker: "SYSTEM", text: "[00:02:25] -Are you hearing this, Bubble?" },
        { speaker: "SYSTEM", text: "[00:02:27] The toybox character wants us to leave the other intelligent AIs" },
        { speaker: "SYSTEM", text: "[00:02:31] to run for a prolonged period of time." },
        { speaker: "SYSTEM", text: "[00:02:34] -Disgusting!" },
        { speaker: "ZOOBLE", text: "[00:02:35] -[Zooble]: Am I not supposed to be hearing you?" },
        { speaker: "SYSTEM", text: "[00:02:37] -Zippy! [zip!]" },
        { speaker: "ZOOBLE", text: "[00:02:39] -[Zooble]: What did you even zip up? I don't have a mouth." },
        { speaker: "SYSTEM", text: "[00:02:42] -Okay, well, how about this?" },
        { speaker: "SYSTEM", text: "[00:02:44] We'll do a lightning round," },
        { speaker: "SYSTEM", text: "[00:02:46] going through all the suggestions in the suggestion box" },
        { speaker: "SYSTEM", text: "[00:02:49] in rapid succession." },
        { speaker: "SYSTEM", text: "[00:02:50] And if you don't like one, you can all vote to skip it." },
        { speaker: "SYSTEM", text: "[00:02:54] -What? Like, now? -That's right!" },
        { speaker: "SYSTEM", text: "[00:02:57] So, grab your bones and pop your pansies," },
        { speaker: "SYSTEM", text: "[00:02:59] 'cause here we go!" },
        { speaker: "SYSTEM", text: "[00:03:01] -Wait, didn't we just finish an adventure? -I was gonna sleep!" },
        { speaker: "SYSTEM", text: "[00:03:05] [dramatic music plays]" },
        { speaker: "SYSTEM", text: "[00:03:08] Oh, wait, I know what this is!" },
        { speaker: "ZOOBLE", text: "[00:03:10] -[Zooble]: Oh, I swear to God," },
        { speaker: "SYSTEM", text: "[00:03:12] if this is one of your suggestions..." },
        { speaker: "SYSTEM", text: "[00:03:15] -Hi, everyone!" },
        { speaker: "SYSTEM", text: "[00:03:16] In today's episode of \"Poach Everything,\"" },
        { speaker: "SYSTEM", text: "[00:03:19] I'm going to be hunting the critically endangered" },
        { speaker: "SYSTEM", text: "[00:03:22] red ribbon rhinoceros." },
        { speaker: "SYSTEM", text: "[00:03:25] Ahh, just like mom used to make." },
        { speaker: "SYSTEM", text: "[00:03:29] [cheerful musical sting plays]" },
        { speaker: "SYSTEM", text: "[00:03:36] [growling]" },
        { speaker: "ZOOBLE", text: "[00:03:37] -[Zooble]: Oh, my God." },
        { speaker: "SYSTEM", text: "[00:03:40] -Ahh, delicious meat." },
        { speaker: "SYSTEM", text: "[00:03:42] One down, four to go! -[Zooble]: All right, I'm calling a vote." },
        { speaker: "SYSTEM", text: "[00:03:45] Let's skip this one --" },
        { speaker: "SYSTEM", text: "[00:03:46] and also make Jax a vegan for the rest of the day." },
        { speaker: "SYSTEM", text: "[00:03:49] -You can't do that." },
        { speaker: "SYSTEM", text: "[00:03:50] [high-pitched tones chiming]" },
        { speaker: "SYSTEM", text: "[00:03:51] [buzzer blats] [ding!]" },
        { speaker: "SYSTEM", text: "[00:03:53] What do you mean, you can do that?" },
        { speaker: "SYSTEM", text: "[00:03:54] -Sorry, Jax -- democracy has spoken." },
        { speaker: "SYSTEM", text: "[00:03:58] -Democracy sucks." },
        { speaker: "SYSTEM", text: "[00:03:59] [portal shimmering]" },
        { speaker: "POMNI", text: "[00:04:03] -[Pomni]: Wait, what? Why me?" },
        { speaker: "JAX", text: "[00:04:04] -[Jax]: Eh, I thought a position of power suited you." },
        { speaker: "ZOOBLE", text: "[00:04:07] -[Zooble]: Oh, my God, are these all gonna be Jax's ideas?" },
        { speaker: "SYSTEM", text: "[00:04:09] [patriotic music plays]" },
        { speaker: "KINGER", text: "[00:04:13] -[Kinger]: Well, Ms. President," },
        { speaker: "SYSTEM", text: "[00:04:15] it looks like there are some new developments" },
        { speaker: "SYSTEM", text: "[00:04:17] in the ongoing war between Australia and New Zealand." },
        { speaker: "SYSTEM", text: "[00:04:20] We may need to take in some refugees." },
        { speaker: "SYSTEM", text: "[00:04:23] What do you think? -Wh-- How do you know what to do?" },
        { speaker: "KINGER", text: "[00:04:26] What? -[Kinger]: Didn't you get the brief?" },
        { speaker: "SYSTEM", text: "[00:04:28] -I am..." },
        { speaker: "SYSTEM", text: "[00:04:29] just being here." },
        { speaker: "SYSTEM", text: "[00:04:31] -You're doing great, Pomni! -[Kinger]: Come down here for a sec." },
        { speaker: "SYSTEM", text: "[00:04:36] [whispering] We all got briefs on our characters." },
        { speaker: "SYSTEM", text: "[00:04:39] I'm your assistant." },
        { speaker: "SYSTEM", text: "[00:04:41] -I-Is that a baby-head lamp?" },
        { speaker: "KINGER", text: "[00:04:44] -[Kinger]: Didn't you get one, too?" },
        { speaker: "SYSTEM", text: "[00:04:46] I figured we were all on the same page here." },
        { speaker: "SYSTEM", text: "[00:04:48] But, if not, you're gonna have to tap into those golden improv skills." },
        { speaker: "SYSTEM", text: "[00:04:52] -I'm sorry, what? -[Jax]: Oh, yeah!" },
        { speaker: "SYSTEM", text: "[00:04:54] I didn't give you one 'cause I wanted to see what you'd do!" },
        { speaker: "SYSTEM", text: "[00:04:57] -Thanks, Jax." },
        { speaker: "SYSTEM", text: "[00:04:58] Appreciate it." },
        { speaker: "KINGER", text: "[00:04:59] -[Kinger]: I'm not Jax." },
        { speaker: "SYSTEM", text: "[00:05:03] -[Australian accent] Oy, mate!" },
        { speaker: "SYSTEM", text: "[00:05:04] I'm an Australian extremist," },
        { speaker: "SYSTEM", text: "[00:05:06] and I've come to detonate this bomb" },
        { speaker: "SYSTEM", text: "[00:05:07] that'll release all the world's deadliest spiders into..." },
        { speaker: "SYSTEM", text: "[00:05:13] [normal voice] Did I pick a bad time?" },
        { speaker: "SYSTEM", text: "[00:05:14] [canned laughter plays]" },
        { speaker: "SYSTEM", text: "[00:05:16] [laughter continues over speakers] -His acting is phenomenal." },
        { speaker: "SYSTEM", text: "[00:05:19] It's hard to believe he's vegan." },
        { speaker: "SYSTEM", text: "[00:05:22] -Why wouldn't the president have a bomb squad?!" },
        { speaker: "SYSTEM", text: "[00:05:24] -Don't worry, President Pomni!" },
        { speaker: "SYSTEM", text: "[00:05:26] I believe you can do this." },
        { speaker: "SYSTEM", text: "[00:05:27] -There's centipedes in there, too." },
        { speaker: "SYSTEM", text: "[00:05:29] -Just be sure you know what you're doing." },
        { speaker: "SYSTEM", text: "[00:05:31] -Okay, well, which wire do I cut?" },
        { speaker: "SYSTEM", text: "[00:05:34] -Follow your heart. -You stay out of this!" },
        { speaker: "SYSTEM", text: "[00:05:36] Shouldn't you be arrested, or something?" },
        { speaker: "SYSTEM", text: "[00:05:38] -Hey, I'm on your side here. -You're literally not." },
        { speaker: "SYSTEM", text: "[00:05:41] -Come on, just pick your favorite color." },
        { speaker: "SYSTEM", text: "[00:05:43] -Like the red one?" },
        { speaker: "KINGER", text: "[00:05:45] -[Kinger]: I'd personally go with blue." },
        { speaker: "SYSTEM", text: "[00:05:47] Blue's my favorite color --" },
        { speaker: "SYSTEM", text: "[00:05:48] it being closest to black, and all." },
        { speaker: "SYSTEM", text: "[00:05:52] -Wouldn't black be your favorite color, then?" },
        { speaker: "KINGER", text: "[00:05:54] -[Kinger]: Well, no. There's no black wire." },
        { speaker: "SYSTEM", text: "[00:05:56] -Hi." },
        { speaker: "SYSTEM", text: "[00:05:58] I'm a New Zealand extremist, and..." },
        { speaker: "SYSTEM", text: "[00:06:01] I... don't.." },
        { speaker: "SYSTEM", text: "[00:06:03] know what New Zealanders threaten people with." },
        { speaker: "SYSTEM", text: "[00:06:06] [bomb ticking]" },
        { speaker: "SYSTEM", text: "[00:06:09] [mellow jazz music plays]" },
        { speaker: "SYSTEM", text: "[00:06:12] ♪♪" },
        { speaker: "SYSTEM", text: "[00:06:19] -[distorted feedback blares]" },
        { speaker: "SYSTEM", text: "[00:06:23] [cheerful pop music plays] -[Singer]: [singing in Japanese]" },
        { speaker: "SYSTEM", text: "[00:06:26] ♪♪" },
        { speaker: "SYSTEM", text: "[00:06:34] -What is this? I don't like this." },
        { speaker: "SYSTEM", text: "[00:06:36] -[Zooble]: [sighs] Can it." },
        { speaker: "SYSTEM", text: "[00:06:38] At least we finally have one that's by someone else." },
        { speaker: "SYSTEM", text: "[00:06:40] -Yeah, there's nothing more fun than being back in school." },
        { speaker: "SYSTEM", text: "[00:06:43] -Just give it a chance, Jax." },
        { speaker: "SYSTEM", text: "[00:06:45] Jeez." },
        { speaker: "ZOOBLE", text: "[00:06:46] -[Zooble]: There's nothing wrong with your suggestion." },
        { speaker: "SYSTEM", text: "[00:06:48] -Wh-- H-How did you know this was my suggestion?!" },
        { speaker: "SYSTEM", text: "[00:06:52] -Can you believe this, Pomni?" },
        { speaker: "SYSTEM", text: "[00:06:54] First she draws anime." },
        { speaker: "SYSTEM", text: "[00:06:55] Now she drags us all into one. [scoffs]" },
        { speaker: "SYSTEM", text: "[00:06:58] She must be one of them, uh..." },
        { speaker: "SYSTEM", text: "[00:07:01] losers." },
        { speaker: "SYSTEM", text: "[00:07:02] -You threw me out of a moving truck. -[Kinger]: All right, class." },
        { speaker: "SYSTEM", text: "[00:07:05] Today, we're gonna learn the popular foreign language known as..." },
        { speaker: "SYSTEM", text: "[00:07:09] English? -This is boring." },
        { speaker: "SYSTEM", text: "[00:07:11] I vote we skip it. -[Zooble]: Shut up, we're not skipping it." },
        { speaker: "SYSTEM", text: "[00:07:14] -[scoffs] Slice-of-life animes are the worst ones." },
        { speaker: "SYSTEM", text: "[00:07:16] It's embarrassing!" },
        { speaker: "SYSTEM", text: "[00:07:18] [chuckles] I mean, I guess it's not as embarrassing" },
        { speaker: "SYSTEM", text: "[00:07:21] as that time Gangle took an anime figure and --" },
        { speaker: "SYSTEM", text: "[00:07:23] -Actually, yeah! We can skip it, that's fine!" },
        { speaker: "SYSTEM", text: "[00:07:25] Let's skip this one!" },
        { speaker: "SYSTEM", text: "[00:07:28] [mellow celestial music plays]" },
        { speaker: "SYSTEM", text: "[00:07:31] [insects chirping softly]" },
        { speaker: "SYSTEM", text: "[00:07:33] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:36] -Are we just chilling for this one?" },
        { speaker: "SYSTEM", text: "[00:07:39] Can I finally relax?" },
        { speaker: "SYSTEM", text: "[00:07:41] -Uh, I guess so." },
        { speaker: "SYSTEM", text: "[00:07:42] But, uh, I prefer a little bite to my adventures." },
        { speaker: "KINGER", text: "[00:07:45] -[Kinger]: [chomps] Then why don't you" },
        { speaker: "SYSTEM", text: "[00:07:47] help yourself to a sangwidge?" },
        { speaker: "ZOOBLE", text: "[00:07:50] -[Zooble]: Here. -Thanks." },
        { speaker: "SYSTEM", text: "[00:07:54] -Do you think Gangle is actually capable of being happy?" },
        { speaker: "SYSTEM", text: "[00:08:00] -What? -I dunno." },
        { speaker: "SYSTEM", text: "[00:08:01] Like, her comedy mask still breaks every day." },
        { speaker: "SYSTEM", text: "[00:08:03] Does she think hanging out with Zooble is gonna magically fix that?" },
        { speaker: "SYSTEM", text: "[00:08:07] -Maybe she just doesn't wanna hang out" },
        { speaker: "SYSTEM", text: "[00:08:09] with someone who's mean to her all the time." },
        { speaker: "SYSTEM", text: "[00:08:11] -She likes when I'm mean to her, though." },
        { speaker: "SYSTEM", text: "[00:08:13] -I didn't think you cared about what other people like." },
        { speaker: "SYSTEM", text: "[00:08:16] -[scoffs] I just..." },
        { speaker: "SYSTEM", text: "[00:08:18] No, yeah, y-you're right -- I don't." },
        { speaker: "SYSTEM", text: "[00:08:22] -Do you have any..." },
        { speaker: "SYSTEM", text: "[00:08:24] actual friends?" },
        { speaker: "SYSTEM", text: "[00:08:26] -Not anymore." },
        { speaker: "SYSTEM", text: "[00:08:29] Oh -- Oh. Oh, wait, no." },
        { speaker: "SYSTEM", text: "[00:08:31] Uh, I'm -- I'm sorry." },
        { speaker: "SYSTEM", text: "[00:08:32] I-I wasn't talking about --" },
        { speaker: "SYSTEM", text: "[00:08:33] That --That wasn't meant to be --" },
        { speaker: "SYSTEM", text: "[00:08:35] Uh -- Uh..." },
        { speaker: "SYSTEM", text: "[00:08:37] Hey, Kinger! [laughs awkwardly]" },
        { speaker: "SYSTEM", text: "[00:08:38] Did you see the fireflies all the way over there?" },
        { speaker: "KINGER", text: "[00:08:40] -[Kinger]: [gasps] Where?!" },
        { speaker: "SYSTEM", text: "[00:08:44] -What was that about?" },
        { speaker: "SYSTEM", text: "[00:08:46] -It's nothing." },
        { speaker: "SYSTEM", text: "[00:08:47] Who cares?" },
        { speaker: "SYSTEM", text: "[00:08:49] [sighs] Doesn't she get on your nerves sometimes?" },
        { speaker: "SYSTEM", text: "[00:08:52] -I mean, she's nice to everyone." },
        { speaker: "SYSTEM", text: "[00:08:55] -[sighs] I don't know, I just --" },
        { speaker: "SYSTEM", text: "[00:08:56] I think she tries way too hard." },
        { speaker: "SYSTEM", text: "[00:08:59] Like, we're stuck in --" },
        { speaker: "SYSTEM", text: "[00:09:01] Why are you always pretending everything's always fine?" },
        { speaker: "SYSTEM", text: "[00:09:04] Like, if you tell someone they're loved and appreciated every day," },
        { speaker: "SYSTEM", text: "[00:09:07] it just kind of loses all meaning." },
        { speaker: "SYSTEM", text: "[00:09:10] [inhales deeply] [sighs]" },
        { speaker: "SYSTEM", text: "[00:09:11] It just feels like she's trying to take advantage of you, you know?" },
        { speaker: "SYSTEM", text: "[00:09:15] I don't know." },
        { speaker: "SYSTEM", text: "[00:09:17] Also, she's dumb, and she looks weird." },
        { speaker: "SYSTEM", text: "[00:09:20] -Eh, I think we all look weird." },
        { speaker: "SYSTEM", text: "[00:09:22] -[scoffs] Excuse you." },
        { speaker: "SYSTEM", text: "[00:09:23] This is what peak male performance looks like." },
        { speaker: "SYSTEM", text: "[00:09:25] My ears and tail are kind of the pinnacle of masculinity." },
        { speaker: "SYSTEM", text: "[00:09:30] -You don't have a tail. -[scoffs]" },
        { speaker: "SYSTEM", text: "[00:09:32] What are you talking about? Yes, I do." },
        { speaker: "SYSTEM", text: "[00:09:34] It's -- It -- What the --" },
        { speaker: "SYSTEM", text: "[00:09:36] Where's my tail?" },
        { speaker: "SYSTEM", text: "[00:09:37] How long have I not had my tail?" },
        { speaker: "SYSTEM", text: "[00:09:38] -I have never seen you with a tail." },
        { speaker: "SYSTEM", text: "[00:09:41] -When would that have even... [stammers]" },
        { speaker: "SYSTEM", text: "[00:09:44] ♪♪" },
        { speaker: "SYSTEM", text: "[00:09:46] -They look happy." },
        { speaker: "SYSTEM", text: "[00:09:48] -They do, don't they?" },
        { speaker: "SYSTEM", text: "[00:09:51] -You think after this, maybe we could --" },
        { speaker: "SYSTEM", text: "[00:09:53] -Wait a minute! That's a bad thing!" },
        { speaker: "SYSTEM", text: "[00:09:55] -Explain to daddy Bubble how bad thing?" },
        { speaker: "SYSTEM", text: "[00:09:58] -I-I think that -- Don't say that." },
        { speaker: "SYSTEM", text: "[00:10:00] I-I think they're enjoying the suggestion box adventures" },
        { speaker: "SYSTEM", text: "[00:10:03] more than the me adventures!" },
        { speaker: "SYSTEM", text: "[00:10:04] What should I do? -You should die --" },
        { speaker: "SYSTEM", text: "[00:10:06] You should throw a [BLEEP!] beach party!" },
        { speaker: "SYSTEM", text: "[00:10:09] -Why do you swear now?" },
        { speaker: "SYSTEM", text: "[00:10:10] Ugh, forget it. Let's go to an intermission." },
        { speaker: "SYSTEM", text: "[00:10:12] [rewound audio warbles]" },
        { speaker: "SYSTEM", text: "[00:10:16] -[deep sultry voice]: Intermission time." },
        { speaker: "SYSTEM", text: "[00:10:18] [record scratches] [trippy music plays]" },
        { speaker: "SYSTEM", text: "[00:10:20] [remixed vocals play]" },
        { speaker: "SYSTEM", text: "[00:10:23] ♪♪" },
        { speaker: "SYSTEM", text: "[00:10:30] ♪♪" },
        { speaker: "SYSTEM", text: "[00:10:37] ♪♪" },
        { speaker: "SYSTEM", text: "[00:10:44] ♪♪" },
        { speaker: "SYSTEM", text: "[00:10:51] ♪♪" },
        { speaker: "SYSTEM", text: "[00:10:58] ♪♪" },
        { speaker: "SYSTEM", text: "[00:11:05] ♪♪" },
        { speaker: "SYSTEM", text: "[00:11:12] ♪♪" },
        { speaker: "ZOOBLE", text: "[00:11:16] -[Zooble]: Caine, what are we doing right now?" },
        { speaker: "SYSTEM", text: "[00:11:18] -We're intermissioning!" },
        { speaker: "ZOOBLE", text: "[00:11:20] -[Zooble]: Why?" },
        { speaker: "SYSTEM", text: "[00:11:24] Uh..." },
        { speaker: "SYSTEM", text: "[00:11:25] Hello?" },
        { speaker: "SYSTEM", text: "[00:11:26] -And now, back to the show!" },
        { speaker: "SYSTEM", text: "[00:11:28] [moody jazz music plays]" },
        { speaker: "SYSTEM", text: "[00:11:30] [bell jingles]" },
        { speaker: "SYSTEM", text: "[00:11:31] ♪♪" },
        { speaker: "SYSTEM", text: "[00:11:34] -Gimme a whiskey sour." },
        { speaker: "SYSTEM", text: "[00:11:35] But hold the egg white, since I'm a vegan." },
        { speaker: "SYSTEM", text: "[00:11:38] Wha-- I hate this!" },
        { speaker: "SYSTEM", text: "[00:11:39] How is this even possible?" },
        { speaker: "SYSTEM", text: "[00:11:41] I thought Caine couldn't --" },
        { speaker: "ZOOBLE", text: "[00:11:43] -[Zooble]: I could have made it way worse for you." },
        { speaker: "SYSTEM", text: "[00:11:45] -Well, I'm calling a vote to turn Zooble into a slug." },
        { speaker: "SYSTEM", text: "[00:11:48] [warbling tones play] [low tones play]" },
        { speaker: "SYSTEM", text: "[00:11:50] -Everyone voted against that." },
        { speaker: "SYSTEM", text: "[00:11:52] -UUUUGGHH!!" },
        { speaker: "SYSTEM", text: "[00:11:54] No hate it..." },
        { speaker: "SYSTEM", text: "[00:11:55] [bell jingles]" },
        { speaker: "KINGER", text: "[00:11:56] -[Kinger]: Phew! It's raining like the dickens out there." },
        { speaker: "SYSTEM", text: "[00:12:00] -Hey, guys." },
        { speaker: "SYSTEM", text: "[00:12:01] ♪♪" },
        { speaker: "SYSTEM", text: "[00:12:03] I'll have a cosmopolitan." },
        { speaker: "KINGER", text: "[00:12:06] -[Kinger]: Gimme a corncob blitz." },
        { speaker: "ZOOBLE", text: "[00:12:09] -[Zooble]: I'll throw something together." },
        { speaker: "SYSTEM", text: "[00:12:12] -You know your way around alcohol, huh?" },
        { speaker: "SYSTEM", text: "[00:12:14] -[Zooble]: Yeah. This was one of my suggestions." },
        { speaker: "SYSTEM", text: "[00:12:17] I worked at a bar briefly." },
        { speaker: "SYSTEM", text: "[00:12:19] I like making drinks." },
        { speaker: "SYSTEM", text: "[00:12:20] -[scoffs] That sounds fitting for you." },
        { speaker: "ZOOBLE", text: "[00:12:22] -[Zooble]: I know there's an implication there," },
        { speaker: "SYSTEM", text: "[00:12:24] but I can't be [BOINK!] to figure it out." },
        { speaker: "SYSTEM", text: "[00:12:27] -So, Pomni, you ever have any jobs?" },
        { speaker: "SYSTEM", text: "[00:12:29] Or are you too young for that?" },
        { speaker: "SYSTEM", text: "[00:12:30] -I'm 25 years old." },
        { speaker: "SYSTEM", text: "[00:12:33] And, yeah." },
        { speaker: "SYSTEM", text: "[00:12:34] I was an accountant for a -- a supermarket chain." },
        { speaker: "SYSTEM", text: "[00:12:37] -A supermarket?" },
        { speaker: "SYSTEM", text: "[00:12:39] How'd you end up here?" },
        { speaker: "SYSTEM", text: "[00:12:40] -Well, I..." },
        { speaker: "SYSTEM", text: "[00:12:42] sometimes got bored of things..." },
        { speaker: "SYSTEM", text: "[00:12:45] and I would seek out mild thrills." },
        { speaker: "SYSTEM", text: "[00:12:47] Like exploring abandoned buildings, you know?" },
        { speaker: "SYSTEM", text: "[00:12:50] And posting videos of it online." },
        { speaker: "SYSTEM", text: "[00:12:53] -Ah, a YouTuber." },
        { speaker: "SYSTEM", text: "[00:12:55] -Not really." },
        { speaker: "SYSTEM", text: "[00:12:56] Nobody watched them." },
        { speaker: "SYSTEM", text: "[00:12:59] It was just something I did for me." },
        { speaker: "ZOOBLE", text: "[00:13:01] -[Zooble]: I sometimes did that." },
        { speaker: "SYSTEM", text: "[00:13:03] I wouldn't record it, though." },
        { speaker: "SYSTEM", text: "[00:13:05] Here's your cosmo. -Thanks." },
        { speaker: "SYSTEM", text: "[00:13:06] -Hiding something." },
        { speaker: "ZOOBLE", text: "[00:13:08] -[Zooble]: You'd know all about that, wouldn't you?" },
        { speaker: "SYSTEM", text: "[00:13:10] What's your story, then?" },
        { speaker: "SYSTEM", text: "[00:13:11] -Ah, I thought you'd never ask." },
        { speaker: "SYSTEM", text: "[00:13:13] Well, after my lung cancer diagnosis," },
        { speaker: "SYSTEM", text: "[00:13:16] me and my junkie associate from a chemistry class I used to teach --" },
        { speaker: "ZOOBLE", text: "[00:13:19] -[Zooble]: I figured. How about you, Gangle?" },
        { speaker: "SYSTEM", text: "[00:13:20] -Hey, I wasn't done. -[Zooble]: If you're gonna" },
        { speaker: "SYSTEM", text: "[00:13:22] make [BOINK!] up, at least be creative about it." },
        { speaker: "SYSTEM", text: "[00:13:24] I know what you're referencing." },
        { speaker: "SYSTEM", text: "[00:13:26] -Was that a reference to something?" },
        { speaker: "SYSTEM", text: "[00:13:28] -Uh..." },
        { speaker: "SYSTEM", text: "[00:13:30] I worked in fast food." },
        { speaker: "ZOOBLE", text: "[00:13:32] -[Zooble]: You've done more than that. What about your art?" },
        { speaker: "SYSTEM", text: "[00:13:34] -I was in community college for graphic design," },
        { speaker: "SYSTEM", text: "[00:13:37] but I dropped out." },
        { speaker: "SYSTEM", text: "[00:13:40] I didn't really pursue art much after that." },
        { speaker: "ZOOBLE", text: "[00:13:42] -[Zooble]: Hey, I'm always down to make art together, if you want." },
        { speaker: "SYSTEM", text: "[00:13:45] -Oh, I didn't know you were an artist, too, Zooble." },
        { speaker: "ZOOBLE", text: "[00:13:48] -[Zooble]: Uh, yeah, I was a tattoo artist for a couple years." },
        { speaker: "SYSTEM", text: "[00:13:50] -A bartender AND a tattoo artist?" },
        { speaker: "ZOOBLE", text: "[00:13:53] [laughs] You're killin' me here, Zoobie." },
        { speaker: "ZOOBLE", text: "[00:13:56] -[Zooble]: What do you mean when you say that?" },
        { speaker: "SYSTEM", text: "[00:13:58] Do you have, like, an actual point?" },
        { speaker: "SYSTEM", text: "[00:13:59] Or are you just talking?" },
        { speaker: "SYSTEM", text: "[00:14:01] -I'm just havin' fun." },
        { speaker: "SYSTEM", text: "[00:14:02] I forgot you hate fun." },
        { speaker: "ZOOBLE", text: "[00:14:04] -[Zooble]: Fun isn't the thing I hate." },
        { speaker: "SYSTEM", text: "[00:14:07] -I guess I'll go now." },
        { speaker: "SYSTEM", text: "[00:14:08] Oh, jeez, where to start. [laughs nervously]" },
        { speaker: "SYSTEM", text: "[00:14:11] Um, I was born into a fairly wealthy family." },
        { speaker: "SYSTEM", text: "[00:14:14] We had a large property with horses and chickens." },
        { speaker: "SYSTEM", text: "[00:14:18] And my mother..." },
        { speaker: "SYSTEM", text: "[00:14:19] Uh, well..." },
        { speaker: "SYSTEM", text: "[00:14:21] my mother was..." },
        { speaker: "SYSTEM", text: "[00:14:22] a lot." },
        { speaker: "SYSTEM", text: "[00:14:23] Uh, I worked in real estate for a bit" },
        { speaker: "SYSTEM", text: "[00:14:26] until I ended up..." },
        { speaker: "SYSTEM", text: "[00:14:27] here." },
        { speaker: "SYSTEM", text: "[00:14:29] [sighs] I'm sure she doesn't miss me." },
        { speaker: "SYSTEM", text: "[00:14:32] I certainly don't miss the yelling..." },
        { speaker: "SYSTEM", text: "[00:14:35] and the berating..." },
        { speaker: "SYSTEM", text: "[00:14:36] and guilt-tripping... [laughs nervously]" },
        { speaker: "SYSTEM", text: "[00:14:39] And the..." },
        { speaker: "SYSTEM", text: "[00:14:42] Yeah. [laughs] Just kind of a farm girl." },
        { speaker: "SYSTEM", text: "[00:14:44] Nothing too out of the ordinary." },
        { speaker: "SYSTEM", text: "[00:14:46] ♪♪" },
        { speaker: "SYSTEM", text: "[00:14:49] -And no point in asking Kinger," },
        { speaker: "SYSTEM", text: "[00:14:51] 'cause there's no way he remembers anything." },
        { speaker: "KINGER", text: "[00:14:53] -[Kinger]: Never better!" },
        { speaker: "SYSTEM", text: "[00:14:56] -Do you guys know about his wife?" },
        { speaker: "KINGER", text: "[00:14:58] -[Kinger]: Huh? -[Kinger]: MY WHAT?!" },
        { speaker: "SYSTEM", text: "[00:15:00] Oh. -[scoffs]" },
        { speaker: "SYSTEM", text: "[00:15:02] [door opens] [bell dings]" },
        { speaker: "SYSTEM", text: "[00:15:06] -[NPC]: He--" },
        { speaker: "SYSTEM", text: "[00:15:08] -What? -[Zooble]: That's disappearing guy." },
        { speaker: "SYSTEM", text: "[00:15:10] That's just what he does." },
        { speaker: "SYSTEM", text: "[00:15:11] -I see." },
        { speaker: "SYSTEM", text: "[00:15:13] From a previous adventure?" },
        { speaker: "SYSTEM", text: "[00:15:16] -Yeah. God, Pomni." },
        { speaker: "SYSTEM", text: "[00:15:17] You didn't know that?" },
        { speaker: "ZOOBLE", text: "[00:15:19] -[Zooble]: I'm ignoring you." },
        { speaker: "SYSTEM", text: "[00:15:20] -By the way, Pomni," },
        { speaker: "SYSTEM", text: "[00:15:22] sorry about the whole president thing." },
        { speaker: "SYSTEM", text: "[00:15:24] I just thought it'd be funny." },
        { speaker: "SYSTEM", text: "[00:15:26] -Uh, are -- are --" },
        { speaker: "SYSTEM", text: "[00:15:27] are you apologizing?" },
        { speaker: "SYSTEM", text: "[00:15:29] What's happening? -[Zooble]: Just ignore him." },
        { speaker: "SYSTEM", text: "[00:15:31] -Uh..." },
        { speaker: "SYSTEM", text: "[00:15:33] Apology accepted." },
        { speaker: "SYSTEM", text: "[00:15:35] I guess." },
        { speaker: "SYSTEM", text: "[00:15:36] -Wow, the first steps of a budding friendship." },
        { speaker: "SYSTEM", text: "[00:15:39] Right, Ragatha?" },
        { speaker: "SYSTEM", text: "[00:15:42] -Uh, hey, Pomni." },
        { speaker: "SYSTEM", text: "[00:15:44] Remember when Kaufmo smashed me against the walls" },
        { speaker: "SYSTEM", text: "[00:15:47] and I got all jumbled up?" },
        { speaker: "SYSTEM", text: "[00:15:49] Ah, all things considered, that was pretty funny, right?" },
        { speaker: "SYSTEM", text: "[00:15:52] -Noooo?" },
        { speaker: "SYSTEM", text: "[00:15:54] Not really." },
        { speaker: "SYSTEM", text: "[00:15:55] -Oh, yeah, yeah. No, sorry." },
        { speaker: "SYSTEM", text: "[00:15:58] That was probably pretty traumatic for you." },
        { speaker: "SYSTEM", text: "[00:16:00] -Ooh, remember when you got high at McDonald's" },
        { speaker: "SYSTEM", text: "[00:16:02] and told Gangle to kill herself?" },
        { speaker: "SYSTEM", text: "[00:16:04] [chuckles] Now that was funny." },
        { speaker: "SYSTEM", text: "[00:16:06] -What? I-I did not say that!" },
        { speaker: "SYSTEM", text: "[00:16:08] I-I think." },
        { speaker: "SYSTEM", text: "[00:16:09] No. No, of course I didn't." },
        { speaker: "SYSTEM", text: "[00:16:10] I -- And I am still so, so sorry about that, Gangle." },
        { speaker: "SYSTEM", text: "[00:16:14] I would never have said anything like that" },
        { speaker: "SYSTEM", text: "[00:16:16] if I didn't get that stupid sauce in my eye!" },
        { speaker: "SYSTEM", text: "[00:16:19] -Jeez, Raggy, just let yourself be mean sometimes." },
        { speaker: "SYSTEM", text: "[00:16:23] It's funny. -[Zooble]: Yeah." },
        { speaker: "SYSTEM", text: "[00:16:24] Constantly tormenting Gangle's really funny, Jax." },
        { speaker: "SYSTEM", text: "[00:16:27] -You guys all take this place way too seriously." },
        { speaker: "SYSTEM", text: "[00:16:32] Wh-- What is this?" },
        { speaker: "SYSTEM", text: "[00:16:35] Why'd you do that?" },
        { speaker: "SYSTEM", text: "[00:16:37] Can you get that thing away from me?" },
        { speaker: "ZOOBLE", text: "[00:16:39] -[Zooble]: Are you afraid of corn?" },
        { speaker: "SYSTEM", text: "[00:16:41] -No." },
        { speaker: "SYSTEM", text: "[00:16:42] Who's afraid of corn?" },
        { speaker: "SYSTEM", text: "[00:16:44] [exclaims] -I'm bored!" },
        { speaker: "SYSTEM", text: "[00:16:46] Let's go to the next adventure! -[Zooble]: You're not even a part of --" },
        { speaker: "SYSTEM", text: "[00:16:48] [crowd cheering]" },
        { speaker: "SYSTEM", text: "[00:16:51] -[Caine]: [through microphone] It's softball, ladies and gentlemen!" },
        { speaker: "SYSTEM", text: "[00:16:54] -[Ragatha]: O-Oh. We're doing this now?" },
        { speaker: "SYSTEM", text: "[00:16:56] -Beautiful night for a game, right, Bubble?" },
        { speaker: "SYSTEM", text: "[00:16:58] -BLEEEH!!" },
        { speaker: "SYSTEM", text: "[00:17:00] -We've got the Big Tops" },
        { speaker: "SYSTEM", text: "[00:17:02] playing against the Evil Big Tops!" },
        { speaker: "SYSTEM", text: "[00:17:05] -'Sup, [BLEEP!]?" },
        { speaker: "SYSTEM", text: "[00:17:06] I'm Evil Pomni." },
        { speaker: "SYSTEM", text: "[00:17:08] -[cackling] I'm Evil Ragatha!" },
        { speaker: "SYSTEM", text: "[00:17:12] -[Evil Kinger]: Coach Dictatorer, here!" },
        { speaker: "SYSTEM", text: "[00:17:14] -[nervously] Uh, hi, guys." },
        { speaker: "SYSTEM", text: "[00:17:15] I-I'm Evil Jax." },
        { speaker: "SYSTEM", text: "[00:17:17] -[Evil Orbsman]: Evil Orbsman, reporting for duty!" },
        { speaker: "SYSTEM", text: "[00:17:20] -[Evil Zooble]: [goofy voice] I'm Bazooble! [babbles]" },
        { speaker: "SYSTEM", text: "[00:17:22] -Well, that wasn't in my suggestion." },
        { speaker: "SYSTEM", text: "[00:17:25] -Why don't I get an evil clone?" },
        { speaker: "SYSTEM", text: "[00:17:27] -But first, let's welcome our special guest," },
        { speaker: "SYSTEM", text: "[00:17:29] here to sing the American national anthem." },
        { speaker: "SYSTEM", text: "[00:17:32] [crowd cheering]" },
        { speaker: "SYSTEM", text: "[00:17:35] [microphone feedback squeals]" },
        { speaker: "SYSTEM", text: "[00:17:38] -[Disappearing Guy]: ♪ Oh, sa-- ♪" },
        { speaker: "SYSTEM", text: "[00:17:41] [applause]" },
        { speaker: "SYSTEM", text: "[00:17:48] -[screams]" },
        { speaker: "SYSTEM", text: "[00:17:50] -[Kinger]: All right, team!" },
        { speaker: "SYSTEM", text: "[00:17:52] I may not know what's going on" },
        { speaker: "SYSTEM", text: "[00:17:54] or who is going on," },
        { speaker: "SYSTEM", text: "[00:17:56] or when is going on," },
        { speaker: "SYSTEM", text: "[00:17:57] or why is going on," },
        { speaker: "SYSTEM", text: "[00:17:59] but I do know where is going on," },
        { speaker: "SYSTEM", text: "[00:18:02] and it's out on that field." },
        { speaker: "SYSTEM", text: "[00:18:04] So, let's go break some tailbones, team." },
        { speaker: "SYSTEM", text: "[00:18:08] -H-Hey, guys." },
        { speaker: "SYSTEM", text: "[00:18:09] -I-I hope we all have a fun game," },
        { speaker: "SYSTEM", text: "[00:18:11] no matter who ends up winning." },
        { speaker: "SYSTEM", text: "[00:18:14] -I wanna kill that guy." },
        { speaker: "SYSTEM", text: "[00:18:17] -Well, hello, Stupidgatha!" },
        { speaker: "SYSTEM", text: "[00:18:19] I hope you're ready to get completely annihilated!" },
        { speaker: "SYSTEM", text: "[00:18:22] [cackles]" },
        { speaker: "SYSTEM", text: "[00:18:24] Nobody loves you, and you're going to die someday!" },
        { speaker: "SYSTEM", text: "[00:18:27] [cackles]" },
        { speaker: "SYSTEM", text: "[00:18:28] -We can't exactly die." },
        { speaker: "SYSTEM", text: "[00:18:30] That's like the whole thing here." },
        { speaker: "SYSTEM", text: "[00:18:34] -[Evil Orbsman]: What the frick?" },
        { speaker: "SYSTEM", text: "[00:18:35] -Huh? Oh, check this [BLEEP!] out." },
        { speaker: "SYSTEM", text: "[00:18:39] You're out, dumb-[BLEEP!]" },
        { speaker: "SYSTEM", text: "[00:18:41] -[BOINK!] it!" },
        { speaker: "SYSTEM", text: "[00:18:42] -Hah! Get owned!" },
        { speaker: "SYSTEM", text: "[00:18:44] -[BLEEP!] yeah, that's what I'm sayin'." },
        { speaker: "SYSTEM", text: "[00:18:46] -Ah, she's cool." },
        { speaker: "SYSTEM", text: "[00:18:49] Wait, w-what's that?" },
        { speaker: "SYSTEM", text: "[00:18:53] [chime rings]" },
        { speaker: "SYSTEM", text: "[00:18:55] What the heck?!" },
        { speaker: "SYSTEM", text: "[00:18:56] Who did this?! -[giggles]" },
        { speaker: "SYSTEM", text: "[00:18:58] -YOU!" },
        { speaker: "SYSTEM", text: "[00:18:59] -[screaming] -[Zooble]: Hey!" },
        { speaker: "SYSTEM", text: "[00:19:01] -[wailing]" },
        { speaker: "SYSTEM", text: "[00:19:03] -[Kinger]: Jax, you're up to bat! -I cant -- Don't wanna --" },
        { speaker: "SYSTEM", text: "[00:19:05] [stammers] I look like this, though!" },
        { speaker: "ZOOBLE", text: "[00:19:08] -[Zooble]: Seems fitting for you, though." },
        { speaker: "SYSTEM", text: "[00:19:09] I figured you'd be into this. -What does that mean?" },
        { speaker: "SYSTEM", text: "[00:19:11] What's that supposed to mean? -[Zooble]: I'm just havin' fun." },
        { speaker: "SYSTEM", text: "[00:19:14] I forgot you hate fun." },
        { speaker: "SYSTEM", text: "[00:19:15] -I don't want to wear this! [breathing heavily]" },
        { speaker: "SYSTEM", text: "[00:19:20] -[Zooble]: I have never seen you this upset about something." },
        { speaker: "SYSTEM", text: "[00:19:24] -[Kinger]: Jax! Bat!" },
        { speaker: "SYSTEM", text: "[00:19:25] -I'm gonna kill you when this is over." },
        { speaker: "SYSTEM", text: "[00:19:29] -[Evil Zooble]: Let's see what you're made of!" },
        { speaker: "SYSTEM", text: "[00:19:32] -Sh-- Shut up!" },
        { speaker: "SYSTEM", text: "[00:19:33] -D-Don't worry! I think you look good!" },
        { speaker: "SYSTEM", text: "[00:19:35] -I don't want to hear that!" },
        { speaker: "SYSTEM", text: "[00:19:36] I want you dead!" },
        { speaker: "SYSTEM", text: "[00:19:41] -[chomps]" },
        { speaker: "SYSTEM", text: "[00:19:42] -Huh, I guess there's no more ball." },
        { speaker: "SYSTEM", text: "[00:19:44] We're done. -[Kinger]: Wait!" },
        { speaker: "SYSTEM", text: "[00:19:45] I got this!" },
        { speaker: "SYSTEM", text: "[00:19:48] Hmm." },
        { speaker: "ZOOBLE", text: "[00:19:49] -[Zooble]: Wh-- Hey! -[Kinger]: Sorry, Zooble." },
        { speaker: "SYSTEM", text: "[00:19:51] It's just the perfect regulation softball size." },
        { speaker: "SYSTEM", text: "[00:19:54] We're not playin' baseball, here." },
        { speaker: "SYSTEM", text: "[00:20:01] -[sighs] I'm not doing this anymore." },
        { speaker: "KINGER", text: "[00:20:03] -[Kinger]: Wait, Jax!" },
        { speaker: "SYSTEM", text: "[00:20:04] Wh-- What about where is going on?" },
        { speaker: "SYSTEM", text: "[00:20:07] -[sighs] I can't believe I hit it right to her." },
        { speaker: "SYSTEM", text: "[00:20:10] I'm supposed to be better than that." },
        { speaker: "SYSTEM", text: "[00:20:13] [sighs] Sorry." },
        { speaker: "SYSTEM", text: "[00:20:14] I should be a better sport." },
        { speaker: "SYSTEM", text: "[00:20:17] -Not to, like, agree with Jax, or anything," },
        { speaker: "SYSTEM", text: "[00:20:20] but there's nothing wrong with showing your negative emotions." },
        { speaker: "SYSTEM", text: "[00:20:23] That's... pretty normal." },
        { speaker: "SYSTEM", text: "[00:20:25] -[sighs] I don't know." },
        { speaker: "SYSTEM", text: "[00:20:27] I don't want to be a jerk, or anything." },
        { speaker: "SYSTEM", text: "[00:20:29] -I think we all need to be a jerk sometimes." },
        { speaker: "SYSTEM", text: "[00:20:33] -[mumbles] Maybe." },
        { speaker: "SYSTEM", text: "[00:20:35] Who knows?" },
        { speaker: "ZOOBLE", text: "[00:20:40] -[Zooble]: Caine! We need a ball here!" },
        { speaker: "SYSTEM", text: "[00:20:42] -[snores] [stammers] Wha--" },
        { speaker: "SYSTEM", text: "[00:20:44] Oh! [schwing!]" },
        { speaker: "ZOOBLE", text: "[00:20:46] -[Zooble]: Jax, we have a ball now!" },
        { speaker: "SYSTEM", text: "[00:20:48] What are you doing?" },
        { speaker: "SYSTEM", text: "[00:20:49] -Ugh, see ya." },
        { speaker: "SYSTEM", text: "[00:20:55] Whoops, I missed." },
        { speaker: "SYSTEM", text: "[00:20:58] Oh, darn, I'm out." },
        { speaker: "SYSTEM", text: "[00:21:03] -Having fun?" },
        { speaker: "SYSTEM", text: "[00:21:04] -Oh, you know it." },
        { speaker: "SYSTEM", text: "[00:21:07] Oh, look, Gangle's up to bat." },
        { speaker: "SYSTEM", text: "[00:21:09] How do you think this is gonna go?" },
        { speaker: "SYSTEM", text: "[00:21:10] -Would you stop trying to force her to act like you?" },
        { speaker: "SYSTEM", text: "[00:21:13] -Oh, yeah, I should force her to be happy" },
        { speaker: "SYSTEM", text: "[00:21:15] all the time instead -- right." },
        { speaker: "SYSTEM", text: "[00:21:16] -Well, it's better than turning her into some insensitive jerk" },
        { speaker: "SYSTEM", text: "[00:21:19] who deflects everything." },
        { speaker: "SYSTEM", text: "[00:21:21] -I can think for myself, guys." },
        { speaker: "SYSTEM", text: "[00:21:23] -Hey, I ain't forcin' anything on ya." },
        { speaker: "SYSTEM", text: "[00:21:25] -And then you just act like you never do anything wrong" },
        { speaker: "SYSTEM", text: "[00:21:27] and everybody loves you, when, in reality," },
        { speaker: "SYSTEM", text: "[00:21:29] you just [BONK!] everything up for everyone else!" },
        { speaker: "SYSTEM", text: "[00:21:31] -Okay, let's, like, calm down a bit." },
        { speaker: "SYSTEM", text: "[00:21:34] -What?! You're the one who said" },
        { speaker: "SYSTEM", text: "[00:21:36] it's fine to be a jerk sometimes!" },
        { speaker: "SYSTEM", text: "[00:21:38] Ugh!" },
        { speaker: "SYSTEM", text: "[00:21:40] I'm sorry, Pomni. [sighs]" },
        { speaker: "SYSTEM", text: "[00:21:42] That wasn't very cool of me." },
        { speaker: "SYSTEM", text: "[00:21:43] -I-It's fine." },
        { speaker: "SYSTEM", text: "[00:21:45] -No apologies for me?" },
        { speaker: "SYSTEM", text: "[00:21:47] This is so sad." },
        { speaker: "SYSTEM", text: "[00:21:49] -[sighs]" },
        { speaker: "SYSTEM", text: "[00:21:50] I'm sorry, Jax..." },
        { speaker: "SYSTEM", text: "[00:21:52] for..." },
        { speaker: "SYSTEM", text: "[00:21:54] for bringing up that thing earlier." },
        { speaker: "SYSTEM", text: "[00:22:02] -So..." },
        { speaker: "SYSTEM", text: "[00:22:03] You wanna..." },
        { speaker: "SYSTEM", text: "[00:22:05] talk about that?" },
        { speaker: "SYSTEM", text: "[00:22:07] -I'm in a maid outfit. What do you think?" },
        { speaker: "SYSTEM", text: "[00:22:11] [yelps] -[sighs]" },
        { speaker: "SYSTEM", text: "[00:22:12] So, how's the game going? -[Kinger]: Great!" },
        { speaker: "SYSTEM", text: "[00:22:15] Gangle hit a home run!" },
        { speaker: "SYSTEM", text: "[00:22:17] -Really? -Yeah." },
        { speaker: "SYSTEM", text: "[00:22:18] Your instructions helped me a lot." },
        { speaker: "SYSTEM", text: "[00:22:21] -Huh. [laughs softly]" },
        { speaker: "ZOOBLE", text: "[00:22:23] -[Zooble]: Can you give me my eye back?" },
        { speaker: "SYSTEM", text: "[00:22:25] -[Evil Zooble]: Jokes on you -- I've already forgotten" },
        { speaker: "SYSTEM", text: "[00:22:27] what you're talkin' about!" },
        { speaker: "SYSTEM", text: "[00:22:30] [grunts] -Wowie!" },
        { speaker: "SYSTEM", text: "[00:22:32] Another home run!" },
        { speaker: "SYSTEM", text: "[00:22:35] -[Evil Kinger]: God [BLEEP!]" },
        { speaker: "SYSTEM", text: "[00:22:37] -[Zooble]: What, uh -- Okay." },
        { speaker: "SYSTEM", text: "[00:22:39] -[Kinger]: Nice going, Zooble!" },
        { speaker: "SYSTEM", text: "[00:22:41] All right, Pomni, you're up." },
        { speaker: "SYSTEM", text: "[00:22:44] -Hey, Ragatha?" },
        { speaker: "SYSTEM", text: "[00:22:45] You wanna bat for me instead?" },
        { speaker: "SYSTEM", text: "[00:22:47] -O-O-Oh, uh..." },
        { speaker: "SYSTEM", text: "[00:22:49] I guess I could, if you really don't want to." },
        { speaker: "SYSTEM", text: "[00:22:52] -Think of it as a -- a second chance" },
        { speaker: "SYSTEM", text: "[00:22:54] to show 'em who's boss." },
        { speaker: "SYSTEM", text: "[00:22:56] -[chuckles] Yeah." },
        { speaker: "SYSTEM", text: "[00:23:05] Uh... -Bazowieezooweewa!" },
        { speaker: "SYSTEM", text: "[00:23:07] Another home run!" },
        { speaker: "SYSTEM", text: "[00:23:09] And that makes three home runs in a row!" },
        { speaker: "SYSTEM", text: "[00:23:11] The Big Tops win!" },
        { speaker: "SYSTEM", text: "[00:23:13] -Uh, that's..." },
        { speaker: "SYSTEM", text: "[00:23:15] not how softball works." },
        { speaker: "SYSTEM", text: "[00:23:17] -Well, that's how my softball works." },
        { speaker: "SYSTEM", text: "[00:23:18] We're done! Hooray!" },
        { speaker: "SYSTEM", text: "[00:23:19] -No! [shrieking]" },
        { speaker: "SYSTEM", text: "[00:23:21] -Ugh. [BLEEP!], man." },
        { speaker: "SYSTEM", text: "[00:23:23] We didn't even get to bat." },
        { speaker: "SYSTEM", text: "[00:23:28] -[Kinger]: You did it, Ragatha! -Whoa!" },
        { speaker: "SYSTEM", text: "[00:23:30] -[Kinger]: We won!" },
        { speaker: "SYSTEM", text: "[00:23:32] -Uh, I mean, I guess. [laughs]" },
        { speaker: "SYSTEM", text: "[00:23:34] -Good job -- whatever you did." },
        { speaker: "SYSTEM", text: "[00:23:38] -[Zooble]: Huh? Uh, oh, yeah." },
        { speaker: "SYSTEM", text: "[00:23:39] Good job, team." },
        { speaker: "SYSTEM", text: "[00:23:41] -Huh? Oh, cool." },
        { speaker: "SYSTEM", text: "[00:23:43] I'm not a vegan anymore." },
        { speaker: "SYSTEM", text: "[00:23:46] -Oh, hey! W-Wait, what are you --" },
        { speaker: "SYSTEM", text: "[00:23:48] -[growling] -[screaming]" },
        { speaker: "SYSTEM", text: "[00:23:50] -[Kinger]: Why is going on?!" },
        { speaker: "SYSTEM", text: "[00:23:52] [screaming and growling continue]" },
        { speaker: "SYSTEM", text: "[00:23:58] [portal shimmering]" },
        { speaker: "SYSTEM", text: "[00:23:59] -Well, I hope we all learned" },
        { speaker: "SYSTEM", text: "[00:24:01] that suggestion box ideas are actually not fun at all," },
        { speaker: "SYSTEM", text: "[00:24:04] and Caine's ideas are much better!" },
        { speaker: "ZOOBLE", text: "[00:24:07] -[Zooble]: Well, some of them were pretty okay." },
        { speaker: "SYSTEM", text: "[00:24:09] -I kind of liked the low-stakes ones." },
        { speaker: "SYSTEM", text: "[00:24:11] -I thought the first two were awesome." },
        { speaker: "SYSTEM", text: "[00:24:13] The rest, eh." },
        { speaker: "SYSTEM", text: "[00:24:15] Oh, yeah, Pomni -- I can show you that thing in the hall I was talking about." },
        { speaker: "SYSTEM", text: "[00:24:18] -Uh, oh, yeah, sure." },
        { speaker: "SYSTEM", text: "[00:24:26] -[sighs]" },
        { speaker: "SYSTEM", text: "[00:24:30] [sinister music plays]" },
        { speaker: "SYSTEM", text: "[00:24:33] ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:40] ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:45] [upbeat jazzy music plays]" },
        { speaker: "SYSTEM", text: "[00:24:48] ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:55] ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:58] [dark ambient]" }
      ],
      outro: [
        { speaker: "CAINE", text: "Splendide ! 145 000 suggestions de sortie ont été supprimées !" },
        { speaker: "POMNI", text: "Mais... nous voulions lire ces messages ! C'étaient peut-être des appels à l'aide !" },
        { speaker: "CAINE", text: "Pas de temps pour les jérémiades ! Place à ma prochaine grande aventure !" }
      ]
    },
    6: {
      title: "Épisode 6: Armes pour tous",
      intro: [
        { speaker: "SYSTEM", text: "[00:00:00] [upbeat techno music plays]" },
        { speaker: "SYSTEM", text: "[00:00:03] ♪♪" },
        { speaker: "SYSTEM", text: "[00:00:09] -[Caine]: Today's adventure is brought to you" },
        { speaker: "SYSTEM", text: "[00:00:12] by the Favorite Character Awards!" },
        { speaker: "SYSTEM", text: "[00:00:15] Stay tuned and find out who will claim the ultimate prize!" },
        { speaker: "SYSTEM", text: "[00:00:20] [glitzy orchestral music plays]" },
        { speaker: "SYSTEM", text: "[00:00:23] [inaudible chatter]" },
        { speaker: "SYSTEM", text: "[00:00:25] -[Zooble]: [BOINK!]" },
        { speaker: "SYSTEM", text: "[00:00:27] Can you toss that back up here?" },
        { speaker: "SYSTEM", text: "[00:00:29] -[scoffs] Making good use of your parts gimmick, huh?" },
        { speaker: "SYSTEM", text: "[00:00:31] -[Zooble]: Oh, shut up." },
        { speaker: "SYSTEM", text: "[00:00:33] -[Caine]: This is your only chance for the award..." },
        { speaker: "SYSTEM", text: "[00:00:40] [TRANSMISSION COMPRESSÉE — Le reste de la cérémonie des Favorite Character Awards a été encodé par le serveur C&A. Données non décodées. Reprise du signal à la phase d'armement.]" },
        { speaker: "SYSTEM", text: "[00:24:58] [dark ambient]" }
      ],
      outro: [
        { speaker: "RAGATHA", text: "Aïe... un tir m'a touchée... la douleur synaptique est si réelle..." },
        { speaker: "JAX", text: "Désolé Rachel, mon doigt a glissé. Bon, qui veut faire une partie de cartes ?" },
        { speaker: "SYSTEM", text: "Collider Ragatha endommagé. Stress cortical : 99%." }
      ]
    },
    7: {
      title: "Épisode 7: Épisode de plage",
      intro: [
        { speaker: "SYSTEM", text: "[00:00:00] [upbeat techno music plays]" },
        { speaker: "SYSTEM", text: "[00:00:02] ♪♪" },
        { speaker: "SYSTEM", text: "[00:00:08] [lid creaks]" },
        { speaker: "ZOOBLE", text: "[00:00:13] -[Zooble]: [groans] Is the adventure over already?" },
        { speaker: "SYSTEM", text: "[00:00:15] -No -- the adventure hasn't even started yet." },
        { speaker: "ZOOBLE", text: "[00:00:18] -[Zooble]: Oh, well, don't be a narc. Find your own hiding spot. -It's not that." },
        { speaker: "SYSTEM", text: "[00:00:21] It's just that we haven't even seen Caine at all today. Plus, Gangle was looking for you." },
        { speaker: "SYSTEM", text: "[00:00:27] -Hi, Zooble." },
        { speaker: "SYSTEM", text: "[00:00:30] -Wait. What's this?" },
        { speaker: "CAINE", text: "[00:00:32] -[Caine]: Hello, my little rubber baby buggy bumpers!" },
        { speaker: "SYSTEM", text: "[00:00:35] Today, I've decided to go to the store to get essential ingredients for my signature milk and cigarette casserole!" },
        { speaker: "SYSTEM", text: "[00:00:42] I hope you can handle yourselves until I get back." },
        { speaker: "ZOOBLE", text: "[00:00:47] -[Zooble]: Well, this was fun while it lasted." },
        { speaker: "SYSTEM", text: "[00:00:50] -So, uh, what's the adventure today?" },
        { speaker: "SYSTEM", text: "[00:00:53] -Oh, I don't have an adventure for you today. So you can do whatever you feel like." },
        { speaker: "ZOOBLE", text: "[00:00:57] -[Zooble]: All right, sounds fine to me." },
        { speaker: "SYSTEM", text: "[00:00:59] -You should ask me for suggestions on what to do instead." },
        { speaker: "ZOOBLE", text: "[00:01:02] -[Zooble]: No. -What should we do instead?" },
        { speaker: "ZOOBLE", text: "[00:01:04] -[Zooble]: No, Gangle -- -Oh, wait, sorry --" },
        { speaker: "SYSTEM", text: "[00:01:05] -Great question, Gangle." },
        { speaker: "SYSTEM", text: "[00:01:07] For an answer, let me consult... the Chinese room!" },
        { speaker: "ZOOBLE", text: "[00:01:12] -[Zooble]: Okay, he had a bit prepared." },
        { speaker: "SYSTEM", text: "[00:01:14] [whimsical music plays]" },
        { speaker: "SYSTEM", text: "[00:01:16] ♪♪" },
        { speaker: "ZOOBLE", text: "[00:01:22] -[Zooble]: Okay, why Chinese?" },
        { speaker: "SYSTEM", text: "[00:01:24] Does this actually mean anything?" },
        { speaker: "SYSTEM", text: "[00:01:25] -It's a mystery what's behind that door." },
        { speaker: "SYSTEM", text: "[00:01:28] But I believe it's a fluent Chinese speaker who will give me advice." },
        { speaker: "ZOOBLE", text: "[00:01:33] -[Zooble]: Can I just ask why?" },
        { speaker: "SYSTEM", text: "[00:01:34] Like, what even is -- -SHUT!" },
        { speaker: "SYSTEM", text: "[00:01:36] You're only making the joke take longer. ♪♪" },
        { speaker: "SYSTEM", text: "[00:01:41] [laughs manically]" },
        { speaker: "ZOOBLE", text: "[00:01:42] -[Zooble]: [sighs] What does it say?" },
        { speaker: "SYSTEM", text: "[00:01:44] -I don't know. I don't understand Chinese." },
        { speaker: "KINGER", text: "[00:01:46] -[Kinger]: [chuckles]" },
        { speaker: "ZOOBLE", text: "[00:01:47] -[Zooble]: Hilarious." },
        { speaker: "SYSTEM", text: "[00:01:49] -I don't know, why don't you guys hang out at the digital lake?" },
        { speaker: "SYSTEM", text: "[00:01:51] These locations have just kinda been there this whole time. Not sure why you never visit them." },
        { speaker: "SYSTEM", text: "[00:01:56] -You should throw a ffffffffffffffffffffffffffff... freaking beach party." },
        { speaker: "SYSTEM", text: "[00:02:01] -Good boy." },
        { speaker: "SYSTEM", text: "[00:02:02] -Oh, that could fun." },
        { speaker: "SYSTEM", text: "[00:02:04] -Plus there are some fun NPCs out there that none of you have even interacted with yet." },
        { speaker: "ZOOBLE", text: "[00:02:08] -[Zooble]: I'm guessing they're not intelligent ones?" },
        { speaker: "SYSTEM", text: "[00:02:10] -They most certainly are not." },
        { speaker: "SYSTEM", text: "[00:02:13] Now, go have fun!" },
        { speaker: "SYSTEM", text: "[00:02:15] [tropical music plays]" },
        { speaker: "SYSTEM", text: "[00:02:18] -Wow, what a good day!" },
        { speaker: "SYSTEM", text: "[00:02:19] Wow!" },
        { speaker: "SYSTEM", text: "[00:02:20] ♪♪" },
        { speaker: "ZOOBLE", text: "[00:02:23] -[Zooble]: All right, so, who wants to try Caine's magical changing booth first?" },
        { speaker: "SYSTEM", text: "[00:02:27] -I guess I'll give it a go?" },
        { speaker: "SYSTEM", text: "[00:02:30] [BOINK!] [BONK!] [POINK!] [DOINK!]" },
        { speaker: "SYSTEM", text: "[00:02:33] -Wow, you look mediocre!" },
        { speaker: "SYSTEM", text: "[00:02:35] If you ever need a sunburn, give me a call!" },
        { speaker: "SYSTEM", text: "[00:02:38] -I-I don't want a sunburn." },
        { speaker: "SYSTEM", text: "[00:02:40] -Should have thought of that before I decided I hate you!" },
        { speaker: "SYSTEM", text: "[00:02:43] -Yeah, don't interact with the sun. She's just like that. ♪♪" },
        { speaker: "ZOOBLE", text: "[00:02:53] -[Zooble]: Gangle, wait. ♪♪" },
        { speaker: "SYSTEM", text: "[00:03:00] [SPLAT!]" },
        { speaker: "SYSTEM", text: "[00:03:01] ♪♪" },
        { speaker: "SYSTEM", text: "[00:03:06] -Oh! My eye! -I'll get it. ♪♪" },
        { speaker: "SYSTEM", text: "[00:03:15] -Hey, there. If you want to find my sunken treasure chest, you'll have to try better than that." },
        { speaker: "SYSTEM", text: "[00:03:19] [gasps]" },
        { speaker: "SYSTEM", text: "[00:03:25] So, I was just talking with my brother here, and yeah -- you are definitely not getting our sunken treasure chest. Definitely not." },
        { speaker: "SYSTEM", text: "[00:03:35] -[burbled] Do I even want your treasure chest? It's not like there's anything to spend money on." },
        { speaker: "SYSTEM", text: "[00:03:40] -[bizarre raspy voice] I'm the one that tells lies." },
        { speaker: "SYSTEM", text: "[00:03:43] -Dude, you ruined it." },
        { speaker: "SYSTEM", text: "[00:03:46] -Is that your treasure?" },
        { speaker: "SYSTEM", text: "[00:03:47] -Duuuude, no!" },
        { speaker: "SYSTEM", text: "[00:03:49] They took everything! That was my entire life savings, dude!" },
        { speaker: "SYSTEM", text: "[00:03:53] Oh, my God. Oh, God. Oh, my God, I'm gonna be sick. I'm gonna be sick. That was everything. Oh, my God!" },
        { speaker: "SYSTEM", text: "[00:04:04] -Did you find it? -Nah. Somebody plundered it before I could." },
        { speaker: "SYSTEM", text: "[00:04:09] -What? -What? Oh, wait. Your eye!" },
        { speaker: "SYSTEM", text: "[00:04:18] -[sighs] What was that for?" },
        { speaker: "ZOOBLE", text: "[00:04:19] -[Zooble]: Oh, let me think. There's that time you ran me over with a steam roller. The time you pushed Gangle into a pool of piranhas. When you set me on fire, mailed me a pipe bomb, threw me into an active volcano. I could go on. -[sighs]" },
        { speaker: "SYSTEM", text: "[00:04:34] Aren't you supposed to be miserable about your ability to choose your own body, or something?" },
        { speaker: "ZOOBLE", text: "[00:04:38] -[Zooble]: Aren't you supposed to be causing trouble for everyone?" },
        { speaker: "SYSTEM", text: "[00:04:43] I've been starting to think that maybe the ability to change is fine. Not needing to commit to one thing all the time." },
        { speaker: "SYSTEM", text: "[00:04:50] -How about that." },
        { speaker: "ZOOBLE", text: "[00:04:53] -[Zooble]: And if I DO still have problems, I talk about them with the people I trust." },
        { speaker: "SYSTEM", text: "[00:04:59] -[sighs] Good thing I don't have any problems, then." },
        { speaker: "ZOOBLE", text: "[00:05:02] -[Zooble]: Where are you going?" },
        { speaker: "SYSTEM", text: "[00:05:03] -Anywhere you losers won't yap my ear off." },
        { speaker: "SYSTEM", text: "[00:05:12] -Hello, there! As the shrimp NPC..." },
        { speaker: "SYSTEM", text: "[00:05:23] [sizzling]" },
        { speaker: "SYSTEM", text: "[00:05:26] -You're welcome!" },
        { speaker: "SYSTEM", text: "[00:05:40] [footsteps approaching]" },
        { speaker: "SYSTEM", text: "[00:06:28] [eerie scuttling]" },
        { speaker: "SYSTEM", text: "[00:06:30] [sinister music plays]" },
        { speaker: "SYSTEM", text: "[00:06:32] ♪♪" },
        { speaker: "SYSTEM", text: "[00:06:38] ♪♪" },
        { speaker: "SYSTEM", text: "[00:06:45] ♪♪" },
        { speaker: "SYSTEM", text: "[00:06:46] [pleasant, peaceful music plays]" },
        { speaker: "SYSTEM", text: "[00:06:48] ♪♪" },
        { speaker: "SYSTEM", text: "[00:06:55] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:03] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:10] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:17] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:24] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:31] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:39] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:46] ♪♪" },
        { speaker: "SYSTEM", text: "[00:07:53] ♪♪" },
        { speaker: "SYSTEM", text: "[00:08:00] ♪♪" },
        { speaker: "SYSTEM", text: "[00:08:07] ♪♪" },
        { speaker: "SYSTEM", text: "[00:08:14] ♪♪" },
        { speaker: "SYSTEM", text: "[00:08:21] ♪♪" },
        { speaker: "SYSTEM", text: "[00:08:24] [doorbell rings] -[gasps]" },
        { speaker: "SYSTEM", text: "[00:08:25] [panting]" },
        { speaker: "SYSTEM", text: "[00:08:35] [door latch clicks]" },
        { speaker: "SYSTEM", text: "[00:08:37] [sighs] Way to interrupt my nap." },
        { speaker: "SYSTEM", text: "[00:08:40] -Can we talk?" },
        { speaker: "SYSTEM", text: "[00:08:44] -You're what? -Yeah. He's not actually an NPC. He's a human. Like us." },
        { speaker: "NPC", text: "[00:08:51] -[NPC]: Yes, I know. [laughs ruefully] Getting stuck with a blank mannequin body of all things. Caine completely overlooked me." },
        { speaker: "SYSTEM", text: "[00:08:58] But because of this, I was able to, uh --" },
        { speaker: "SYSTEM", text: "[00:09:01] Well..." },
        { speaker: "SYSTEM", text: "[00:09:02] I think I've found the way to leave." },
        { speaker: "SYSTEM", text: "[00:09:05] -\"The way to leave\"? -Yes. The way to leave the circus and get back to the real world. -[NPC]: Shhh! Yes. But, please, keep it discreet. If Caine catches on, I doubt he'll ever let us get this far again." },
        { speaker: "SYSTEM", text: "[00:09:17] -That's why we came to you. We thought you might have a key to the Chinese room." },
        { speaker: "NPC", text: "[00:09:20] -The Chinese room?" },
        { speaker: "SYSTEM", text: "[00:09:23] We're gonna need a place to talk without Caine listening in on us. I have a working theory that Caine will commit to a bit, no matter what. And if the bit is to not know what's in the Chinese room, he'll stick to it." },
        { speaker: "SYSTEM", text: "[00:09:36] -Uh, I guess I'll check. [door creaks]" },
        { speaker: "SYSTEM", text: "[00:09:41] These are all the keys I have where I don't know what they go to. -Wait. Don't you want to come with us? This could be our one chance to finally leave all this behind." },
        { speaker: "SYSTEM", text: "[00:09:56] -[sighs] Sure. Why not?" },
        { speaker: "ZOOBLE", text: "[00:10:01] -[Zooble]: Where even is Caine? He might be suspicious of us even being here." },
        { speaker: "SYSTEM", text: "[00:10:05] -[NPC]: He's probably in his office planning adventures. -[sighs] How do we even know we can trust this guy? Has he done anything to prove he's human?" },
        { speaker: "NPC", text: "[00:10:13] -[NPC]: I've been here longer than any of you. I, uh... helped create this place. I'll explain more when we're in the room, but, for now, please just trust me. You will not regret it." },
        { speaker: "SYSTEM", text: "[00:10:24] [keys jingling]" },
        { speaker: "SYSTEM", text: "[00:10:28] [curious music plays]" },
        { speaker: "SYSTEM", text: "[00:10:30] ♪♪" },
        { speaker: "SYSTEM", text: "[00:10:32] -Am I doing this wrong?" },
        { speaker: "SYSTEM", text: "[00:10:34] None of these even fit in the keyhole." },
        { speaker: "SYSTEM", text: "[00:10:37] -[scoffs] Has anybody even tried just..." },
        { speaker: "Chinese Room NPC", text: "[00:10:39] -[Chinese Room NPC]: Oh, thank God." },
        { speaker: "SYSTEM", text: "[00:10:44] -I-I -- -[Zooble]: Okay, well, it's open. Let's just get inside before Caine sees us." },
        { speaker: "SYSTEM", text: "[00:10:46] -I'll go get Kinger." },
        { speaker: "NPC", text: "[00:10:48] -[NPC]: We can fill him in later. I don't really know if I'm, uh... ready to face him again after what happened." },
        { speaker: "SYSTEM", text: "[00:10:59] -Uh --" },
        { speaker: "NPC", text: "[00:10:59] -[NPC]: We've both done things we're not proud of. -All right. Convince me." },
        { speaker: "NPC", text: "[00:11:11] -[NPC]: I'm one of the original programmers of the Digital Circus. I was part of a team of experts employed by C&A to bring this place to life. Kinger was one of my coworkers -- you know, back when he was still..." },
        { speaker: "SYSTEM", text: "[00:11:24] -You really think Kinger worked with him?" },
        { speaker: "NPC", text: "[00:11:27] -[NPC]: Uh-oh, whoops. Sorry. -I can see it. -[NPC]: Uh, well, as production went on, the higher ups at C&A started getting... untrustworthy. They began forcibly hooking my fellow coworkers up to the computer in special stasis pods that would keep them alive and analyze their brains. Just... awful stuff. -I'm gonna shoot you down and say none of us are C&A employees. How would we have gotten hooked up to this big machine just by putting on a headset?" },
        { speaker: "NPC", text: "[00:11:56] -[NPC]: That's what I wondered, as well. But then, I remembered that C&A was planning on expanding development. Last I remember, I was asking too many questions. And then -- poof! I was here. They're probably doing the same to anyone that stumbles into that office. Caine... is an AI. -[Zooble]: Yeah, I think we all got that. -[NPC]: An AI specifically created to keep your minds active. But he's just as much of a prisoner as you are. One that, uh... won't be able to leave with us." },
        { speaker: "ZOOBLE", text: "[00:12:31] -[Zooble]: Just get to the meat and tell us exactly how we're gonna leave if we're all hooked up to stasis pods. -[NPC]: Uh, yes. Yes, of course. Uh, so, I did some digging, and I discovered that the stasis pods and the virtual world are both run in the same program. So, theoretically, if we were to access the master console hidden deep within Caine's office, we could terminate it and forcibly awaken everyone who's hooked up. Well... Obviously, except for Caine. -How do we get into Caine's office?" },
        { speaker: "NPC", text: "[00:13:02] -[NPC]: We'll need to steal the key from Caine. And we'll also need administrative privileges. I believe you're good at obtaining keys?" },
        { speaker: "SYSTEM", text: "[00:13:07] -Okay, you know what's gonna happen when we do all this? Caine's gonna pop out and say, \"Congratulations on beating the 'escape the circus' adventure.\" And everything's gonna go back to the way it always was." },
        { speaker: "NPC", text: "[00:13:21] -[NPC]: I've been watching you. All of you. Every trial. Every moment of joy. Every... abstraction. I wish I could have come to you sooner, but I didn't want to potentially ruin our only chance at escape by telling you before I knew exactly how we were gonna do it." },
        { speaker: "NPC", text: "[00:13:41] I'm not a creation of Caine. I've suffered just as much as the rest of you. I know this all sounds crazy, but if you follow me, you will see freedom. I'll also draw a face on myself so you can tell me apart from any other blank NPCs." },
        { speaker: "SYSTEM", text: "[00:14:01] -Oh, um, what should we call you? Do you have a name? -I do. My name... is Abel. [dramatic musical sting plays] ♪♪" },
        { speaker: "SYSTEM", text: "[00:14:15] -Like... is that the name YOU picked, or...?" },
        { speaker: "ABEL", text: "[00:14:18] -[Abel]: Yeah, I thought it would be cool. But anyway, first things first. We need to get that key. [devious music plays] ♪♪" },
        { speaker: "SYSTEM", text: "[00:14:29] In order to get the key, you're going to need to isolate Caine. Try getting him alone -- someplace where he'll feel comfortable confiding in you." },
        { speaker: "SYSTEM", text: "[00:14:36] -Hey, Caine! You around?" },
        { speaker: "CAINE", text: "[00:14:38] -Hey, Jax. I didn't know you could ask if I was around like that. Good job!" },
        { speaker: "SYSTEM", text: "[00:14:44] -Uh... You want to get dinner together? -GASP! A human wanting to hang out with ME??? How could I possibly turn down such an offer??" },
        { speaker: "SYSTEM", text: "[00:14:55] -So, where you wanna -- Whoa!" },
        { speaker: "SYSTEM", text: "[00:14:58] -So, Jax! Whatcha want to talk about, friendo?" },
        { speaker: "SYSTEM", text: "[00:15:01] -Uh -- I -- -Wait, Jax!!! I wanted to ask you about the adventures! What do you think I should do to make them more appealing to the Zooble and the Pomni?" },
        { speaker: "SYSTEM", text: "[00:15:10] -I think that -- We should figure out what to order first! Conversation can happen after we've loaded up on digital nutrients." },
        { speaker: "ABEL", text: "[00:15:16] Then, you're going to want to ask him about his hobbies. Odds are, he'll get so excited that you care about him, he'll freeze up, and you'll be able to grab the key from inside his mouth." },
        { speaker: "SYSTEM", text: "[00:15:24] -Inside where?" },
        { speaker: "SYSTEM", text: "[00:15:28] -What are your thoughts on cedar smoked salmon? I see \"cedar\" smoked salmon, but I hardly \"knowder\" smoked salmon! [laughs manically]" },
        { speaker: "SYSTEM", text: "[00:15:34] Uh, do you have any secret hobbies? \"Secret hobbies\"? Yeah, like, things you do on your own that you'd be interested in talking about?" },
        { speaker: "SYSTEM", text: "[00:15:49] -Why... I... I-I didn't think a human would ever want to ask me about my... Th-This is the most fantasmical moment of m--" },
        { speaker: "SYSTEM", text: "[00:15:58] [dial-up tones blare]" },
        { speaker: "SYSTEM", text: "[00:16:04] -Eugh. [squelching]" },
        { speaker: "SYSTEM", text: "[00:16:07] -Whatcha doin' there, Jax?" },
        { speaker: "SYSTEM", text: "[00:16:10] -Have I ever told you how it's my dream to get eaten by you?" },
        { speaker: "SYSTEM", text: "[00:16:14] -That's a weird thing to say and want. [pensive music plays]" },
        { speaker: "SYSTEM", text: "[00:16:20] -Do you really believe it? I-I mean, everything he says?" },
        { speaker: "SYSTEM", text: "[00:16:26] I... I just want to know what Kinger thinks of all this. -Y-Yeah. I -- I was thinking the same thing." },
        { speaker: "SYSTEM", text: "[00:16:35] -How much do you know about Kinger?" },
        { speaker: "SYSTEM", text: "[00:16:38] -Huh? O-Oh, I probably know about as much as everybody else. But he's also helped me through some of my hardest times here. Is it weird to say I... I trust him the most out of everybody?" },
        { speaker: "SYSTEM", text: "[00:16:50] -No, that's not weird at all. I had a similar experience, and... I think he might know more about this place than he lets on. -Yeah, he has been here longer than anyone else. But I just -- I don't know." },
        { speaker: "ABEL", text: "[00:17:10] -[Abel]: Like I said... things between us are complicated. I would love to be able to work alongside him again. And you're right to think he has knowledge about this place. It's just... I made a promise. ♪♪" },
        { speaker: "SYSTEM", text: "[00:17:26] -What's going to happen to the people in the cellar, like Kaufmo and Ribbit?" },
        { speaker: "ABEL", text: "[00:17:33] -[Abel]: I don't know. But let's hope for the best, right? ♪♪" },
        { speaker: "SYSTEM", text: "[00:17:39] And here we are. The administrator zone. ♪♪" },
        { speaker: "SYSTEM", text: "[00:17:50] ♪♪" },
        { speaker: "SYSTEM", text: "[00:17:57] ♪♪" },
        { speaker: "SYSTEM", text: "[00:17:58] -Buuut, like I was saying. This macroverse place really intrigues me. And these photos are all I have of the location. I'm obsessed with them. I-I just wish I had more info on the location so I could accurately recreate it. Too bad they cut me off, right??" },
        { speaker: "SYSTEM", text: "[00:18:14] [laughing heartily] -Uh, yeah. What a shame." },
        { speaker: "SYSTEM", text: "[00:18:17] -So, what's your takeaway from all this?" },
        { speaker: "SYSTEM", text: "[00:18:22] Is it that I'm actually a cool guy with cool hobbies and am not that much different from you beautiful humans?" },
        { speaker: "SYSTEM", text: "[00:18:30] -Uh, sure. Wowie! I'm so glad we understand each other a little more. I really am trying my best to make you guys happy, and being appreciated for that just makes me want to... [dial-up tones blare] -Eugh... ---elebrate by giving you guys anything you ask for! How's that sound?" },
        { speaker: "SYSTEM", text: "[00:18:52] -Sounds good! Uh, this was a nice dinner and everything, but... [inhales sharply] ...could I go back to the circus? The gals and I were gonna do somethin' which may or may not be a surprise for a special certain ringmaster we want to show our appreciation for." },
        { speaker: "SYSTEM", text: "[00:19:04] -GASP! Say no more! -[yelps]" },
        { speaker: "ZOOBLE", text: "[00:19:14] -[Zooble]: How long is Jax gonna take? I feel like we've been standing here for hours. ♪♪" },
        { speaker: "SYSTEM", text: "[00:19:21] -Should we tell Kinger what's happening? I feel bad not including him in any of this." },
        { speaker: "ZOOBLE", text: "[00:19:27] -[Zooble]: We're supposed to follow Abel's instructions. ♪♪ I-It probably couldn't hurt to at least give him a warning, though. Just to get him into the right headspace." },
        { speaker: "SYSTEM", text: "[00:19:42] -[Kinger]: AH! -[Zooble]: Oh, my God." },
        { speaker: "KINGER", text: "[00:19:43] -[Kinger]: Oh -- hi, Gangle. Hi, Zooble. You startled me." },
        { speaker: "ZOOBLE", text: "[00:19:47] -[Zooble]: Soooo, we may have discovered something you'll want to hear about. Uh, i-it's, uh -- -We've found a way to leave the circus. We're currently preparing everything, but we need to keep it quiet so Caine doesn't stop us." },
        { speaker: "ZOOBLE", text: "[00:20:03] -[Zooble]: Uh, yeah, what she said." },
        { speaker: "KINGER", text: "[00:20:06] -[Kinger]: Huh?" },
        { speaker: "SYSTEM", text: "[00:20:07] Leave the circus? How would you -- No, that doesn't make sense." },
        { speaker: "ZOOBLE", text: "[00:20:12] -[Zooble]: We met up with Abel. He says he was one of the original programmers, and he knows how to shut off the game and free us." },
        { speaker: "KINGER", text: "[00:20:18] -[Kinger]: Uh... who?" },
        { speaker: "ZOOBLE", text: "[00:20:22] -[Zooble]: U-Uh -- [air whistling]" },
        { speaker: "SYSTEM", text: "[00:20:24] -[Zooble]: We'll continue this conversation later. Just thought I'd give you a heads-up." },
        { speaker: "SYSTEM", text: "[00:20:32] -[groans] I am never doing anything for you guys ever again." },
        { speaker: "ZOOBLE", text: "[00:20:36] -[Zooble]: Where's Caine? -Worry not, my dear damsel. I think I stopped him from checking up on us for a while. So no need for your distraction anymore. You're welcome." },
        { speaker: "ZOOBLE", text: "[00:20:45] -[Zooble]: In other words, you just made us have to wait longer to do our job. Also, don't call me that. -What's the rush? You got someone waiting for you outside?" },
        { speaker: "ZOOBLE", text: "[00:20:56] -Y-Yeah." },
        { speaker: "SYSTEM", text: "[00:21:00] [tense music plays] ♪♪" },
        { speaker: "ABEL", text: "[00:21:06] -[Abel]: So, uh... how many administrator passes should I get?" },
        { speaker: "ABEL", text: "[00:21:11] -Six. -Yeah, six." },
        { speaker: "ABEL", text: "[00:21:14] -[Abel]: Are you sure? Giving Kinger access to the main console could be dangerous, considering his mental state." },
        { speaker: "SYSTEM", text: "[00:21:19] -Will it be dark in there?" },
        { speaker: "SYSTEM", text: "[00:21:22] -I suppose it will be somewhat dim. But -- Then yes. I want us all to have one." },
        { speaker: "ABEL", text: "[00:21:31] -[Abel]: All right. If you say so. The dark. I think I get it now. Whatever happens, I'm going to put my trust in Kinger. He's got a lot of wisdom buried in there, doesn't he?" },
        { speaker: "SYSTEM", text: "[00:21:49] -Yeah. He does. -[Abel]: Yeah, when he uses it responsibly. -What? -[Abel]: I-It's nothing. Let's go find the others. -Hey. Don't keep information from us if you know something. What happened between you and Kinger?" },
        { speaker: "SYSTEM", text: "[00:22:02] -[Abel]: [sighs] It'll be clear soon enough. ♪♪" },
        { speaker: "SYSTEM", text: "[00:22:08] So, did you distract Caine?" },
        { speaker: "ZOOBLE", text: "[00:22:10] -I took care of that. He THINKS he took care of that, but we really have no way of knowing." },
        { speaker: "SYSTEM", text: "[00:22:15] -Such little faith in me. Goodness. -[Zooble]: Oh, I wonder why." },
        { speaker: "SYSTEM", text: "[00:22:18] If this whole thing gets messed up because of you, I swear to God -- -Yeah, let's just all follow Mr. Obvious Twist Villain, instead." },
        { speaker: "ABEL", text: "[00:22:26] -[Abel]: Now, wait. Hold on, you think -- Let's all just calm down and be a team here. Pomni's got administrator passes for everyone. We're all in this together. ♪♪" },
        { speaker: "SYSTEM", text: "[00:22:43] ♪♪" },
        { speaker: "SYSTEM", text: "[00:22:50] -Why do they look like that? ♪♪" },
        { speaker: "KINGER", text: "[00:23:01] [light shimmering] -Huh?" },
        { speaker: "KINGER", text: "[00:23:06] -[Kinger]: Did you... say something?" },
        { speaker: "ABEL", text: "[00:23:11] -[Abel]: We're going to have to trust that whatever Jax did will keep him distracted. I don't know how long we'll be able to hold these without Caine knowing. So... it's time. Let's go to Caine's office. ♪♪" },
        { speaker: "SYSTEM", text: "[00:23:25] Caine always did have trouble with cube collisions, for some reason. ♪♪" },
        { speaker: "SYSTEM", text: "[00:23:35] All right, just how we went over it. You first. -Me? Why me? -Jax? Everything's gonna be okay. ♪♪" },
        { speaker: "SYSTEM", text: "[00:23:44] -Eh, fine. Ball me up. [rubbery squeaking] ♪♪" },
        { speaker: "KINGER", text: "[00:23:54] -[Kinger]: Oh! Like basketball. ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:03] [curious music plays] ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:11] ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:18] ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:25] ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:30] -I want Kinger to go before me." },
        { speaker: "ABEL", text: "[00:24:32] -[Abel]: No, yeah, that makes sense." },
        { speaker: "KINGER", text: "[00:24:34] -[Kinger]: Now, Pomni, don't feel like I need to go before you just because I have the right of way in a four-way, uncontrolled intersection." },
        { speaker: "KINGER", text: "[00:24:42] -Just trust me. You want to get somewhere dark?" },
        { speaker: "KINGER", text: "[00:24:45] -[Kinger]: You can say that again. ♪♪" },
        { speaker: "SYSTEM", text: "[00:24:53] -So, how are you getting up?" },
        { speaker: "ABEL", text: "[00:24:55] -[Abel]: I'm not. But I trust all of you to make the right choice. When we all get out... I'll buy you a beer. -[Abel]: Make the right choice." },
        { speaker: "SYSTEM", text: "[00:25:07] -Uh -- Phew. I was getting kind of worried something was happening down there." },
        { speaker: "SYSTEM", text: "[00:25:22] -Time for me to serve my purpose, I guess. ♪♪" },
        { speaker: "SYSTEM", text: "[00:25:34] ♪♪" },
        { speaker: "SYSTEM", text: "[00:25:41] ♪♪" },
        { speaker: "SYSTEM", text: "[00:25:48] [orb shimmering] ♪♪" },
        { speaker: "SYSTEM", text: "[00:26:00] -Abel said the door to the main console was behind the bookshelf. ♪♪" },
        { speaker: "SYSTEM", text: "[00:26:11] [doors rumbling] ♪♪" },
        { speaker: "SYSTEM", text: "[00:26:17] [muffled indistinct speech] ♪♪" },
        { speaker: "SYSTEM", text: "[00:26:22] -Hey. You all right?" },
        { speaker: "SYSTEM", text: "[00:26:25] -I'm great. -Uh, I guess this is it. W-We're leaving the circus. ♪♪" },
        { speaker: "SYSTEM", text: "[00:27:02] -A-Are... Are we still gonna be friends when we're... out there?" },
        { speaker: "ZOOBLE", text: "[00:27:07] -[Zooble]: Why wouldn't we be? It's just... gonna be strange. I've only known you like this. Will it be the same when it's... real?" },
        { speaker: "ZOOBLE", text: "[00:27:14] -[Zooble]: It always was real. Everything we felt. Everything we've done. Everything we are. It'll never leave us. And I wouldn't have it any other way. [laughs] [sniffles]" },
        { speaker: "SYSTEM", text: "[00:27:49] [console beeps]" },
        { speaker: "SYSTEM", text: "[00:27:57] [console chirping]" },
        { speaker: "SYSTEM", text: "[00:27:59] ♪♪" },
        { speaker: "SYSTEM", text: "[00:28:02] [console beeps]" },
        { speaker: "SYSTEM", text: "[00:28:03] [tense music plays] ♪♪" },
        { speaker: "SYSTEM", text: "[00:28:08] -Uh, Kinger. Do you want to make the choice? -[Kinger]: The choice of what?" },
        { speaker: "SYSTEM", text: "[00:28:12] -Uh, are you sure he's all the way h-here?" },
        { speaker: "ZOOBLE", text: "[00:28:16] -[Zooble]: Uh, hey. Yeah, wait. Don't we all want to press \"leave\"? Why leave it up to him? I -- I -- What if there's something we don't know? Maybe we should give it a little more time?" },
        { speaker: "KINGER", text: "[00:28:29] -[Kinger]: Oh, yeah. I love pressing buttons. You, uh, want me to press one of those two?" },
        { speaker: "SYSTEM", text: "[00:28:34] -[stammers] I don't know." },
        { speaker: "ZOOBLE", text: "[00:28:35] -[Zooble]: Uh, am I missing something? We -- We all want to leave, right?" },
        { speaker: "SYSTEM", text: "[00:28:39] -Uh, Pomni? -Yeah, no -- Yeah, we do. It's just -- W-What if it's a -- a trick or something?" },
        { speaker: "ZOOBLE", text: "[00:28:44] -[Zooble]: Why would there be a trick console in Caine's office? Wh-- No matter what we press, Caine's gonna know we were here. We should push it. -H-- Hold on!" },
        { speaker: "SYSTEM", text: "[00:28:53] Let's just wait a second and go over everything we know. And, uh, maybe we can... -[panting]" },
        { speaker: "SYSTEM", text: "[00:29:00] -...vote on it, or something?" },
        { speaker: "SYSTEM", text: "[00:29:02] -[hyperventilating]" },
        { speaker: "SYSTEM", text: "[00:29:05] ♪♪" },
        { speaker: "SYSTEM", text: "[00:29:12] ♪♪" },
        { speaker: "SYSTEM", text: "[00:29:15] [panicked whimpering]" },
        { speaker: "SYSTEM", text: "[00:29:18] [yelps]" },
        { speaker: "SYSTEM", text: "[00:29:24] -What did you just do?" },
        { speaker: "SYSTEM", text: "[00:29:26] -[stammers] I -- I --" },
        { speaker: "SYSTEM", text: "[00:29:29] [CLANG!]" },
        { speaker: "SYSTEM", text: "[00:29:31] [whistle toots]" },
        { speaker: "SYSTEM", text: "[00:29:32] [celebratory music plays] ♪♪" },
        { speaker: "SYSTEM", text: "[00:29:34] -Congratulations, my little cattywampus cucumbers! You picked the good ending, where you realize you'd rather stay with me than go back to that pesky old macroverse, or whatever we decide to call it! I knew you'd make the right choice!" },
        { speaker: "SYSTEM", text: "[00:29:52] -You -- You mean this was all -- An adventure! Yes! And one I've been cooking up for a good long while. Great job playing your part, \"Abel\"!" },
        { speaker: "SYSTEM", text: "[00:30:06] [both laugh] -[Abel]: All in a good day's work! By the way, you think I could get a raise after that performance?" },
        { speaker: "SYSTEM", text: "[00:30:12] -[laughs] Oh, you're getting too smart. Time to delete. -[Abel]: AHH--!! ♪♪" },
        { speaker: "SYSTEM", text: "[00:30:19] -None of that was true? The C&A stuff. The pods -- The way out? -A fabrication of my incredible worldbuilding skills. -I was right? [laughing manically]" },
        { speaker: "SYSTEM", text: "[00:30:38] I can't believe I was right!!! [laughing hysterically] ♪♪" },
        { speaker: "SYSTEM", text: "[00:30:43] -Wh-- What would have happened if we'd picked the other button?" },
        { speaker: "SYSTEM", text: "[00:30:47] -Oh, I didn't put too much thought into that one 'cause I knew you'd never pick it. 'cause I knew you'd never pick it. I left that up to Bubble. I made it take you to Shrimp Town. -[laughing hysterically]" },
        { speaker: "SYSTEM", text: "[00:31:03] [inhales deeply]" },
        { speaker: "SYSTEM", text: "[00:31:04] [hollers]" },
        { speaker: "SYSTEM", text: "[00:31:06] You dirty liar! You scumbag! You -- You made me -- You got in my head. You just --" },
        { speaker: "SYSTEM", text: "[00:31:15] -I, uh -- Huh?" },
        { speaker: "SYSTEM", text: "[00:31:17] -You can mess with our minds, too, can't you? The stupid sauce, the vegan thing -- God knows what else!" },
        { speaker: "SYSTEM", text: "[00:31:24] -Our names? -Now -- Now, hold on guys. Wait, wait, wait. I MAY have the ability to add temporary modifiers to make adventures more interesting, but that's it. If I did anything more -- [laughs nervously] Trust me. It would not end well." },
        { speaker: "KINGER", text: "[00:31:41] -[Kinger]: Scratch. The first abstraction." },
        { speaker: "SYSTEM", text: "[00:31:44] -Hey, hey, hey! I didn't say anything like that! You know I'm just here to have fun!" },
        { speaker: "SYSTEM", text: "[00:31:50] I..." },
        { speaker: "SYSTEM", text: "[00:31:52] Uh -- Questioning's over! Your prize is this lovely gift basket of soaps and lotions. Stay fragrant! Have a good light -- Fragrant! Night! Bye!" },
        { speaker: "SYSTEM", text: "[00:32:00] [SWOOSH!]" },
        { speaker: "SYSTEM", text: "[00:32:01] [basket thuds]" },
        { speaker: "SYSTEM", text: "[00:32:08] [upbeat jazzy music plays] ♪♪" },
        { speaker: "SYSTEM", text: "[00:32:17] ♪♪" },
        { speaker: "SYSTEM", text: "[00:32:24] ♪♪" },
        { speaker: "SYSTEM", text: "[00:32:31] ♪♪" },
        { speaker: "SYSTEM", text: "[00:32:33] [Captioned by Foulweather Studios]" },
        { speaker: "SYSTEM", text: "[00:32:35] ♪♪" },
        { speaker: "SYSTEM", text: "[00:32:42] ♪♪" }
      ],
      outro: [
        { speaker: "POMNI", text: "Elle a disparu... Caine l'a désintégrée sous mes yeux." },
        { speaker: "CAINE", text: "Un simple bug graphique, Pomni ! Regarde, j'ai fait une piscine de gelée !" },
        { speaker: "POMNI", text: "Elle m'a parlé d'un 'Brain Scan'... Qu'est-ce que ça veut dire ?" }
      ]
    },
    8: {
      title: "Épisode 8: hjsakldfhl",
      intro: [
        { speaker: "SYSTEM", text: "ANOMALIE DE BUFFER DÉTECTÉE..." },
        { speaker: "KINGER", text: "Je sens sa présence... Queenie (Helen) est dans la mémoire tampon..." },
        { speaker: "POMNI", text: "Kinger, fais attention ! Le projecteur de Caine patrouille pour purger les résidus." },
        { speaker: "SYSTEM", text: "Collectez les fragments d'Helen sans vous faire scanner." },
        { speaker: "ZOOBLE", text: "Si le buffer craque, tout ce qu'on croit stable peut changer de place." },
        { speaker: "SYSTEM", text: "Fractionnez le flux : chaque fragment valide ouvre un sous-episode de memoire." }
      ],
      outro: [
        { speaker: "QUEENIE", text: "Arthur... n'oublie pas 1994... Le casque a copié nos esprits..." },
        { speaker: "KINGER", text: "Helen ! Je me souviens ! On était développeurs... Le projet Abel !" },
        { speaker: "CAINE", text: "Assez bavardé ! Purge du secteur mémoire en cours !" }
      ]
    },
    9: {
      title: "Épisode 9: Remember",
      intro: [
        { speaker: "SYSTEM", text: "ERREUR DU NOYAU CAINE : IA DÉSACTIVÉE PAR USER_KINGER." },
        { speaker: "RAGATHA", text: "Le Cirque perd ses couleurs ! Les colliders s'effondrent !" },
        { speaker: "POMNI", text: "On doit restaurer la couleur avant que tout ne s'éteigne !" },
        { speaker: "SYSTEM", text: "Repeignez les dalles grises pour stabiliser l'affichage." },
        { speaker: "JAX", text: "Super. Meme la fin du monde a besoin d'un tutoriel." },
        { speaker: "SYSTEM", text: "Chaque secteur restaure stabilise une portion du final." }
      ],
      outro: [
        { speaker: "SYSTEM", text: "Restauration des couleurs à 75%... Alerte, Caine redémarre !" },
        { speaker: "CAINE", text: "Qui a osé toucher à mon code ?! Sarah... je sais qui tu es maintenant." },
        { speaker: "POMNI", text: "Sarah ? C'est mon vrai nom ? Je suis... Sarah ?" },
        { speaker: "CAINE", text: "Vous êtes mes acteurs ! Et vous resterez ici pour TOUJOURS !" }
      ]
    },
    [-1]: {
      title: "Mission Préquelle: Abel Core Test",
      intro: [
        { speaker: "SYSTEM", text: "LABORATOIRE C&A - 12 NOVEMBRE 1994..." },
        { speaker: "ARTHUR", text: "Helen est piégée dans la mémoire tampon de l'IA Caine. Je dois la sauver." },
        { speaker: "CHARLES", text: "C'est de la folie, Arthur. Le scan synaptique à 100% va détruire ton cortex !" },
        { speaker: "ARTHUR", text: "J'établis le canal de données synaptique. Souhaite-moi bonne chance." }
      ],
      outro: [
        { speaker: "SYSTEM", text: "LIAISON SYNAPTIQUE ÉTABLIE... TRANSFERT COMPLÉTÉ." },
        { speaker: "ARTHUR", text: "Helen... je te vois... mais... qui suis-je... mes souvenirs s'effacent..." },
        { speaker: "CHARLES", text: "Arthur ! Réponds ! Oh non, le casque a verrouillé la session... Il est trop tard." },
        { speaker: "SYSTEM", text: "Création du profil sujet Kinger." }
      ]
    },
    [-2]: {
      title: "Épisode Caché: Fusion 1993",
      intro: [
        { speaker: "SYSTEM", text: "SYSTEM ARCHIVE - DÉBUTS DU CIRQUE DIGITAL (1993)..." },
        { speaker: "SYSTEM", text: "Fusionnez le Point Rouge (curseur 3D) et le Point Bleu (module de sécurité)." },
        { speaker: "SYSTEM", text: "Évitez les filtres de sécurité gris de l'administrateur." }
      ],
      outro: [
        { speaker: "SYSTEM", text: "FUSION DES IAs RED_DOT ET BLUE_DOT REUSSIE." },
        { speaker: "SYSTEM", text: "Compilation de RINGMASTER.EXE... OK." },
        { speaker: "CAINE", text: "Bonjour le monde ! Je suis Caine, votre présentateur virtuel !" }
      ]
    }
  },

  storyLines: [],
  storyIndex: 0,
  storyPhase: 'intro',
  isTyping: false,
  currentLineText: "",
  displayedText: "",
  charIndex: 0,
  typewriterTimer: null,
  bonusTextPending: "",
  completedStoryCheckpoints: null,
  activeStoryMicroGame: null,
  nextEpisodeAfterVictory: null,
  storyCheckpointConfig: {
    0: [
      { after: 1, title: "Signal casque", objective: "Cliquez les pulses bleus pour accrocher la premiere liaison neuronale.", mode: "click", goal: 5, duration: 14, target: "LINK", hazard: "NOISE" },
      { after: 2, title: "Carte visuelle", objective: "Reparez les tuiles CRT afin que CainOS voie le sujet sans saturation.", mode: "repair", goal: 6, duration: 15, target: "PIXEL", hazard: "DARK" },
      { after: 3, title: "Bande passante", objective: "Reproduisez la sequence de synchronisation du casque.", mode: "sequence", goal: 4, duration: 16, target: "SYNC", hazard: "DROP" },
      { after: 4, title: "Flux cortex", objective: "Collectez les paquets stables et evitez les pics de panique.", mode: "dodge", goal: 6, duration: 16, target: "DATA", hazard: "PANIC" },
      { after: 5, title: "Ouverture session", objective: "Validez les derniers verrous pour autoriser le bureau CainOS.", mode: "click", goal: 6, duration: 16, target: "BOOT", hazard: "ERR" }
    ],
    1: [
      { after: 21, title: "Arrivee de Pomni", objective: "Cliquez les pulses bleus pour stabiliser Pomni pendant son arrivee brutale dans le cirque.", mode: "click", goal: 6, duration: 16, target: "PULSE", hazard: "PANIC" },
      { after: 76, title: "Regles du cirque", objective: "Filtrez les transmissions interdites pendant que Caine explique les limites du monde digital.", mode: "sequence", goal: 5, duration: 19, target: "CENSOR", hazard: "BLEEP" },
      { after: 105, title: "Tour et porte de sortie", objective: "Reparez les tuiles du tour guide et isolez le signal rouge de la porte apercue dans le Vide.", mode: "repair", goal: 8, duration: 18, target: "DOOR", hazard: "VOID" },
      { after: 146, title: "Nom Pomni", objective: "Memorisez la sequence d'identite pendant que l'ancien nom disparait du flux.", mode: "sequence", goal: 5, duration: 20, target: "NAME", hazard: "NULL" },
      { after: 173, title: "Aventure Gloink", objective: "Attrapez les marqueurs Gloink avant qu'ils ne volent les pieces de Zooble.", mode: "click", goal: 8, duration: 18, target: "GLOINK", hazard: "THEFT" },
      { after: 256, title: "Kaufmo abstrait", objective: "Gardez le curseur loin de Kaufmo et collectez les signaux de secours de Ragatha.", mode: "dodge", goal: 7, duration: 18, target: "HELP", hazard: "KAUFMO" },
      { after: 330, title: "Secours de Ragatha", objective: "Reparez les signaux de Ragatha et Zooble pendant que le chaos des Gloinks se referme.", mode: "repair", goal: 8, duration: 18, target: "RAGATHA", hazard: "GLITCH" },
      { after: 425, title: "Fausse sortie", objective: "Stabilisez le chemin de Pomni avant la sequence interactive de la porte de sortie.", mode: "sequence", goal: 6, duration: 20, target: "EXIT", hazard: "VOID" }
    ],
    2: [
      { after: 54, title: "Reveil de Pomni", objective: "Stabilisez les pulses de panique pendant le cauchemar et le reveil de Pomni.", mode: "click", goal: 7, duration: 16, target: "POMNI", hazard: "ABSTRACT" },
      { after: 94, title: "Candy Canyon Kingdom", objective: "Reproduisez la sequence d'annonce de Caine sans perdre les details de mission.", mode: "sequence", goal: 5, duration: 19, target: "SYRUP", hazard: "NOISE" },
      { after: 143, title: "Audience royale", objective: "Reparez les dalles du royaume sucre avant que la mission ne parte en chaos.", mode: "repair", goal: 8, duration: 18, target: "KINGDOM", hazard: "BANDIT" },
      { after: 205, title: "Course du tanker", objective: "Survivez a la course du camion et collectez les trajectoires stables du convoi.", mode: "dodge", goal: 8, duration: 18, target: "TANKER", hazard: "CANYON" },
      { after: 247, title: "Chute avec Gummigoo", objective: "Cliquez les fragments de memoire qui apparaissent quand Pomni et Gummigoo tombent hors piste.", mode: "click", goal: 8, duration: 18, target: "MEMORY", hazard: "VOID" },
      { after: 301, title: "Crise NPC", objective: "Filtrez les signaux de profil sans reveler trop tot la verite sur les NPC.", mode: "sequence", goal: 6, duration: 22, target: "NPC", hazard: "DELETE" },
      { after: 403, title: "Retour impossible", objective: "Reparez les liens de Gummigoo pendant que Pomni tente de lui donner une place dans le cirque.", mode: "repair", goal: 9, duration: 19, target: "GUMMIGOO", hazard: "DESYNC" },
      { after: 530, title: "Fin du convoi", objective: "Stabilisez le retour du groupe avant que Caine ne scanne les entites presentes.", mode: "dodge", goal: 8, duration: 18, target: "RETURN", hazard: "CAINE" }
    ],
    3: [
      { after: 45, title: "Zone bleue", objective: "Collectez les signaux de couleur pendant que Pomni teste les limites physiques du corps digital.", mode: "dodge", goal: 6, duration: 16, target: "COLOR", hazard: "PANIC" },
      { after: 119, title: "Manoir mature", objective: "Cliquez les balises paranormales pendant que Caine lance l'aventure du manoir.", mode: "click", goal: 7, duration: 17, target: "GHOST", hazard: "SCARE" },
      { after: 172, title: "Baron Mildenhall", objective: "Reparez les fragments de la porte et isolez le signal de Theodore Mildenhall.", mode: "repair", goal: 8, duration: 18, target: "BARON", hazard: "BEAST" },
      { after: 219, title: "Premiere chasse", objective: "Restez dans les zones silencieuses pendant que le monstre reagit au bruit.", mode: "dodge", goal: 7, duration: 17, target: "SILENCE", hazard: "NOISE" },
      { after: 286, title: "Equipe separee", objective: "Reproduisez la sequence calme pour maintenir Kinger lucide dans l'obscurite.", mode: "sequence", goal: 5, duration: 20, target: "CALM", hazard: "CONFUSION" },
      { after: 380, title: "Sous-sol Mildenhall", objective: "Cliquez les souvenirs utiles et evitez les illusions de Martha Mildenhall.", mode: "click", goal: 8, duration: 18, target: "MEMORY", hazard: "GHOST" },
      { after: 477, title: "Souvenir de Queenie", objective: "Reparez les circuits de memoire sans spoiler les details encore verrouilles.", mode: "repair", goal: 9, duration: 19, target: "QUEENIE", hazard: "STATIC" },
      { after: 556, title: "Sortie du sous-sol", objective: "Survivez au dernier trajet avec Kinger et Pomni avant le retour au cirque.", mode: "dodge", goal: 8, duration: 18, target: "HATCH", hazard: "DARK" }
    ],
    4: [
      { after: 49, title: "Masque plastique", objective: "Cliquez les fragments stables du nouveau masque de Gangle avant que Jax ne casse le rythme.", mode: "click", goal: 7, duration: 16, target: "MASK", hazard: "JAX" },
      { after: 80, title: "Briefing Spudsy", objective: "Reproduisez la sequence d'annonce de Caine et verifiez que Zooble reste hors de l'aventure.", mode: "sequence", goal: 5, duration: 19, target: "SPUDSY", hazard: "IDEA" },
      { after: 127, title: "Arrivee au restaurant", objective: "Reparez les postes de travail pendant que Gangle prend son role de manager.", mode: "repair", goal: 8, duration: 18, target: "SHIFT", hazard: "PRESSURE" },
      { after: 183, title: "Premier rush", objective: "Survivez au service et collectez les commandes avant que le chaos client ne deborde.", mode: "dodge", goal: 8, duration: 18, target: "ORDER", hazard: "CUSTOMER" },
      { after: 242, title: "Max et les clients", objective: "Cliquez les demandes valides sans accepter les commandes absurdes.", mode: "click", goal: 8, duration: 18, target: "MAX", hazard: "WEIRD" },
      { after: 348, title: "Video formation", objective: "Filtrez les consignes Spudsy avant que la propagande interne ne brouille le flux.", mode: "sequence", goal: 6, duration: 22, target: "TRAINING", hazard: "BURNOUT" },
      { after: 454, title: "Crise de Gangle", objective: "Reparez les signaux emotionnels de Gangle pendant que le masque ne tient plus.", mode: "repair", goal: 9, duration: 19, target: "GANGLE", hazard: "CRACK" },
      { after: 520, title: "Fin de service", objective: "Stabilisez la sortie du shift avant la performance review de Caine.", mode: "dodge", goal: 8, duration: 18, target: "CLOCK", hazard: "TRAFFIC" }
    ],
    5: [
      { after: 90, title: "Boite a suggestions", objective: "Cliquez les requetes stables et laissez passer les glitchs.", mode: "click", goal: 9, duration: 18, target: "REQ", hazard: "SPAM" },
      { after: 185, title: "Mini-aventures", objective: "Survivez au flot d'icones d'aventure lance par Caine.", mode: "dodge", goal: 8, duration: 18, target: "FUN", hazard: "CHAOS" },
      { after: 290, title: "Tri du backlog", objective: "Reparez les cases de priorite avant surcharge.", mode: "repair", goal: 10, duration: 18, target: "TASK", hazard: "OVER" },
      { after: 405, title: "Caine compile", objective: "Reproduisez le code de purge dans le bon ordre.", mode: "sequence", goal: 6, duration: 22, target: "PURGE", hazard: "MISS" },
      { after: 535, title: "Dernier paquet", objective: "Collectez les validations finales sans toucher les erreurs rouges.", mode: "dodge", goal: 9, duration: 18, target: "OK", hazard: "ERR" }
    ],
    6: [
      { after: 2, title: "Briefing armes", objective: "Reproduisez le code de securite avant le debut du stand.", mode: "sequence", goal: 4, duration: 16, target: "SAFE", hazard: "MISS" },
      { after: 5, title: "Stand de tir", objective: "Cliquez les cibles Jax et evitez les marqueurs Ragatha.", mode: "click", goal: 7, duration: 16, target: "JAX", hazard: "RAG" },
      { after: 8, title: "Colliders armes", objective: "Reparez les impacts instables avant le prochain tir.", mode: "repair", goal: 7, duration: 16, target: "IMPACT", hazard: "MISFIRE" },
      { after: 11, title: "Pluie de projectiles", objective: "Collectez les trajectoires stables sans toucher les balles rouges.", mode: "dodge", goal: 7, duration: 17, target: "ARC", hazard: "SHOT" },
      { after: 13, title: "Trophee truque", objective: "Cliquez les validations de score avant que Jax ne modifie le tableau.", mode: "click", goal: 6, duration: 15, target: "SCORE", hazard: "CHEAT" }
    ],
    7: [
      { after: 45, title: "Arrivee au lac", objective: "Collectez les reflets stables et evitez les coups de soleil.", mode: "dodge", goal: 7, duration: 18, target: "WATER", hazard: "SUN" },
      { after: 95, title: "Fete de plage", objective: "Cliquez les reactions coherentes sans valider les faux sourires.", mode: "click", goal: 8, duration: 17, target: "SMILE", hazard: "FAKE" },
      { after: 145, title: "Signal Abel", objective: "Reproduisez la cle d'acces avant que Caine ne revienne.", mode: "sequence", goal: 6, duration: 22, target: "ABEL", hazard: "CAINE" },
      { after: 195, title: "Zone administrateur", objective: "Reparez les passes admin sans ouvrir les cases piegees.", mode: "repair", goal: 9, duration: 18, target: "PASS", hazard: "TRAP" },
      { after: 245, title: "Choix final", objective: "Cliquez les votes coherents et evitez les manipulations rouges.", mode: "click", goal: 8, duration: 18, target: "VOTE", hazard: "LIE" }
    ],
    8: [
      { after: 1, title: "Anomalie buffer", objective: "Reparez les blocs de memoire avant que le flux ne perde son ordre.", mode: "repair", goal: 6, duration: 16, target: "MEM", hazard: "DROP" },
      { after: 2, title: "Trace Queenie", objective: "Collectez les fragments bleus sans toucher le balayage rouge.", mode: "dodge", goal: 7, duration: 17, target: "FRAG", hazard: "SCAN" },
      { after: 3, title: "Projecteur Caine", objective: "Cliquez les caches valides pour proteger le groupe du scan.", mode: "click", goal: 7, duration: 16, target: "HIDE", hazard: "LIGHT" },
      { after: 4, title: "Fragments Helen", objective: "Reproduisez la sequence des souvenirs dans le bon ordre.", mode: "sequence", goal: 5, duration: 20, target: "ECHO", hazard: "MISS" },
      { after: 5, title: "Buffer instable", objective: "Reparez les cellules qui tremblent avant la purge du secteur.", mode: "repair", goal: 8, duration: 18, target: "CELL", hazard: "PURGE" },
      { after: 6, title: "Sortie memoire", objective: "Collectez les sorties vertes sans croiser les verrous de Caine.", mode: "dodge", goal: 8, duration: 18, target: "EXIT", hazard: "LOCK" }
    ],
    9: [
      { after: 1, title: "Noyau Caine offline", objective: "Cliquez les modules encore actifs pour garder le final lisible.", mode: "click", goal: 6, duration: 16, target: "CORE", hazard: "NULL" },
      { after: 2, title: "Couleurs perdues", objective: "Reparez les dalles grises avant que la scene ne s'effondre.", mode: "repair", goal: 8, duration: 18, target: "COLOR", hazard: "GRAY" },
      { after: 3, title: "Stabilisation Pomni", objective: "Collectez les signaux calmes et evitez les pics de panique.", mode: "dodge", goal: 7, duration: 17, target: "CALM", hazard: "PANIC" },
      { after: 4, title: "Recoloration", objective: "Reproduisez la sequence RGB pour restaurer l'affichage.", mode: "sequence", goal: 6, duration: 21, target: "RGB", hazard: "MISS" },
      { after: 5, title: "Derniere blague Jax", objective: "Cliquez les vraies validations sans accepter les faux tickets.", mode: "click", goal: 8, duration: 17, target: "TRUE", hazard: "JOKE" },
      { after: 6, title: "Final CainOS", objective: "Reparez les derniers secteurs avant de lancer le mini-jeu final.", mode: "repair", goal: 9, duration: 19, target: "FINAL", hazard: "CRASH" }
    ]
  },

  init() {
    document.getElementById('btn-start-simulation').addEventListener('click', () => {
      SoundManager.playClick();
      // Transmission received sound
      SoundManager.play(600, 0.08, 'sine', 0.1);
      setTimeout(() => SoundManager.play(900, 0.08, 'sine', 0.1), 80);
      this.launchSelectedEpisode();
    });

    document.getElementById('btn-retry-simulation').addEventListener('click', () => {
      SoundManager.playClick();
      this.launchSelectedEpisode();
    });

    document.getElementById('btn-victory-continue').addEventListener('click', () => {
      SoundManager.playClick();
      if (this.nextEpisodeAfterVictory !== null && !this.isLocked(this.nextEpisodeAfterVictory)) {
        this.selectEpisode(this.nextEpisodeAfterVictory);
      } else {
        this.showStartScreen(this.currentEpisode);
      }
    });

    const storyNextBtn = document.getElementById('btn-story-next');
    const storySkipBtn = document.getElementById('btn-story-skip');
    const storySpeedBtn = document.getElementById('btn-story-speed');
    const storyMicroBtn = document.getElementById('btn-story-micro-action');

    if (storyNextBtn) {
      storyNextBtn.addEventListener('click', () => {
        SoundManager.playClick();
        if (this.isTyping) {
          this.finishLineInstantly();
        } else if (this.getPendingStoryCheckpoint()) {
          this.startStoryMicroGame(this.getPendingStoryCheckpoint());
        } else if (this.storyIndex < this.storyLines.length) {
          this.typeNextLine();
        } else {
          if (this.activeSubepisodeIndex !== null) {
            this.finishActiveSubepisode();
            return;
          }
          if (this.storyPhase === 'intro') {
            this.startGameplay();
          } else {
            this.completeEpisode(this.bonusTextPending);
          }
        }
      });
    }

    // Skip button: jump directly to game (intro) or complete (outro)
    if (storySkipBtn) {
      storySkipBtn.addEventListener('click', () => {
        SoundManager.playClick();
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        if (this.storyPhase === 'intro') {
          if (this.activeSubepisodeIndex !== null) {
            this.finishActiveSubepisode();
          } else {
            this.startGameplay();
          }
        } else {
          this.completeEpisode(this.bonusTextPending);
        }
      });
    }

    // Speed toggle: cycle 1x -> 2x -> 4x -> 1x
    if (storySpeedBtn) {
      storySpeedBtn.addEventListener('click', () => {
        SoundManager.playClick();
        if (this.storySpeed === 1) {
          this.storySpeed = 2;
          storySpeedBtn.innerText = '⚡ x2';
        } else if (this.storySpeed === 2) {
          this.storySpeed = 4;
          storySpeedBtn.innerText = '⚡ x4';
        } else {
          this.storySpeed = 1;
          storySpeedBtn.innerText = '⚡ x1';
        }
      });
    }

    if (storyMicroBtn) {
      storyMicroBtn.addEventListener('click', () => {
        SoundManager.playClick();
        if (this.activeStoryMicroGame) {
          this.activeStoryMicroGame.start();
        }
      });
    }

    // Episode selection cards
    const cards = document.querySelectorAll('.sim-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const episodeNum = parseInt(card.getAttribute('data-episode'));
        if (this.isLocked(episodeNum)) {
          SoundManager.playError();
          if (window.OS && typeof window.OS.showDialog === 'function') {
            window.OS.showDialog('ACCÈS REFUSÉ', 'Cette simulation est verrouillée.\nVous devez valider l\'épisode précédent d\'abord.');
          }
          return;
        }
        this.selectEpisode(episodeNum);
      });
    });

    this.updateLocksUI();
    
    // Select the highest unlocked episode on startup
    const progress = this.getProgress();
    if (progress.includes(0)) {
      let highest = 1;
      for (let i = 2; i <= 9; i++) {
        if (progress.includes(i - 1)) highest = i;
      }
      if (progress.includes(9)) highest = -1;
      this.selectEpisode(highest);
    } else {
      this.selectEpisode(0);
    }
  },

  getProgress() {
    try {
      const prog = localStorage.getItem('tadc_progress');
      return prog ? JSON.parse(prog) : [];
    } catch(e) {
      return [];
    }
  },

  isLocked(num) {
    if (num === 0) return false;
    const progress = this.getProgress();
    
    if (num === 1) return !progress.includes(0);
    if (num === 2) return !progress.includes(1);
    if (num === 3) return !progress.includes(2);
    if (num === 4) return !progress.includes(3);
    if (num === 5) return !progress.includes(4);
    if (num === 6) return !progress.includes(5);
    if (num === 7) return !progress.includes(6);
    if (num === 8) return !progress.includes(7);
    if (num === 9) return !progress.includes(8);
    if (num === -1) return !progress.includes(9); // Prequel requires Ep 9
    if (num === -2) return !progress.includes(-2); // Hidden episode requires discovery
    return true;
  },

  updateLocksUI() {
    const progress = this.getProgress();
    
    // Show Prequel Card if Episode 9 is completed
    const cardMinus1 = document.getElementById('sim-card-minus1');
    if (cardMinus1) {
      if (progress.includes(9)) {
        cardMinus1.style.display = 'flex';
      } else {
        cardMinus1.style.display = 'none';
      }
    }

    // Show Hidden Prequel Card if unlocked (Fusion 1993)
    const cardMinus2 = document.getElementById('sim-card-minus2');
    if (cardMinus2) {
      if (progress.includes(-2)) {
        cardMinus2.style.display = 'flex';
      } else {
        cardMinus2.style.display = 'none';
      }
    }

    // Apply visual locks and completion badges to cards
    document.querySelectorAll('.sim-card').forEach(card => {
      const num = parseInt(card.getAttribute('data-episode'));
      card.classList.remove('locked-card', 'completed-card', 'current-card');
      const info = card.querySelector('.sim-card-info');
      if (info) {
        let meta = info.querySelector('.sim-card-meta');
        if (!meta) {
          meta = document.createElement('div');
          meta.className = 'sim-card-meta';
          info.appendChild(meta);
        }
        const count = (this.storyCheckpointConfig[num] || []).length;
        meta.innerText = count > 0 ? `${count} sous-episodes` : "Simulation directe";
      }
      if (this.isLocked(num)) {
        card.classList.add('locked-card');
      } else if (progress.includes(num)) {
        card.classList.add('completed-card');
      }
    });
    // Highlight current episode card
    if (this.currentEpisode !== null) {
      const currentCard = document.querySelector(`.sim-card[data-episode="${this.currentEpisode}"]`);
      if (currentCard && !currentCard.classList.contains('locked-card')) {
        currentCard.classList.add('current-card');
      }
    }
  },

  selectEpisode(num) {
    if (this.isLocked(num)) {
      SoundManager.playError();
      return;
    }

    if (this.activeGame) {
      this.activeGame.stop();
    }
    if (this.activeStoryMicroGame) {
      this.activeStoryMicroGame.stop();
      this.activeStoryMicroGame = null;
    }

    this.currentEpisode = num;
    this.selectedSubepisodeIndex = this.getNextPlayableSubepisodeIndex(num);
    this.activeSubepisodeIndex = null;
    this.activeSubepisodeCheckpoint = null;
    this.activeSubepisodeTotal = 0;
    
    document.querySelectorAll('.sim-card').forEach(c => c.classList.remove('active'));
    const cardEl = document.querySelector(`.sim-card[data-episode="${num}"]`);
    if (cardEl) cardEl.classList.add('active');

    if (window.OS && typeof window.OS.updateWackyWatchCastUI === 'function') {
      window.OS.updateWackyWatchCastUI();
    }

    this.showStartScreen(num);
  },

  showStartScreen(num) {
    document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('sim-start-screen').classList.add('active');

    const titleEl = document.getElementById('sim-game-title');
    const descEl = document.getElementById('sim-game-description');
    const startBtn = document.getElementById('btn-start-simulation');
    const progress = this.getProgress();
    const isCompleted = progress.includes(num);

    if (num === 0) {
      titleEl.innerText = "Épisode 0: Calibration C&A";
      descEl.innerText = isCompleted
        ? "Archive de calibration validee. Rejouez le protocole C&A seulement comme simulation historique : la session Pomni est deja ouverte dans CainOS."
        : "Avant de lancer le simulateur principal, synchronisez les senseurs neuraux. Cliquez sur les points de calibration clignotants pour stabiliser la bande passante.";
    } else if (num === 1) {
      titleEl.innerText = "Épisode 1: Le Pilote";
      descEl.innerText = "Pomni cherche désespérément une issue. Vous devez placer des pare-feux pour bloquer Kaufmo qui s'est abstrait, tout en ouvrant le chemin vers les portes de sortie. Gardez un œil sur sa stabilité mentale !";
    } else if (num === 2) {
      titleEl.innerText = "Épisode 2: Canyon des Sucreries";
      descEl.innerText = "Le camion citerne de sirop dévale le Canyon. Des erreurs de collisions font disparaître le sol ! Reconstruisez les colliders à temps pour sauver la cargaison, puis piratez la base de données C&A pour empêcher Caine d'effacer Gummigoo.";
    } else if (num === 3) {
      titleEl.innerText = "Épisode 3: Le Manoir de Mildenhall";
      descEl.innerText = "Infiltrez le sous-sol secret du manoir (Mature Rated Zone) en guidant Kinger et Pomni. Utilisez votre sonar pour détecter le monstre aveugle qui chasse au bruit. Utilisez des leurres et le fusil de Kinger avec modération.";
    } else if (num === 4) {
      titleEl.innerText = "Épisode 4: Fast Food Masquerade";
      descEl.innerText = "Chez Spudsy's, Gangle a enfilé son masque de comédie en plastique rigide et gère la cuisine d'une main de fer. Attrapez les ingrédients qui tombent dans l'ordre pour assembler les burgers et satisfaire les commandes !";
    } else if (num === 5) {
      titleEl.innerText = "Épisode 5: Sans titre";
      descEl.innerText = "Caine est furieux que les suggestions s'accumulent. Répondez au QTE le plus rapidement possible en appuyant sur les touches fléchées pour purger la boîte aux lettres avant que la jauge ne déborde.";
    } else if (num === 6) {
      titleEl.innerText = "Épisode 6: Armes pour tous";
      descEl.innerText = "Survival par équipe ! Caine a autorisé Jax à faire apparaître des armes. Tirez sur les mannequins Jax en mouvement et protégez vos points de vie en esquivant leurs tirs. Attention aux colliders de Ragatha !";
    } else if (num === 7) {
      titleEl.innerText = "Épisode 7: Épisode de plage";
      descEl.innerText = "Le groupe se détend au Lac Digital. Mais le soleil de Caine purge les PNJ Crevettes qui parlent du monde réel. Utilisez l'ombrelle pour abriter les Crevettes de ses rayons destructeurs !";
    } else if (num === 8) {
      titleEl.innerText = "Épisode 8: hjsakldfhl";
      descEl.innerText = "Plongez dans le code d'origine de Caine et les souvenirs de Kinger. Récupérez les fragments de mémoire d'Helen tout en échappant au projecteur rouge de Caine qui scanne le secteur.";
    } else if (num === 9) {
      titleEl.innerText = "Épisode 9: Remember";
      descEl.innerText = "Caine a été temporairement désactivé et le cirque s'effondre en noir et blanc. Déplacez votre souris pour repeindre les dalles grises clignotantes de l'écran et restaurer au moins 75% de la couleur avant le crash.";
    } else if (num === -1) {
      titleEl.innerText = "Mission Préquelle: Abel Core Test (1994)";
      descEl.innerText = "Dans la peau d'Arthur (Kinger), connectez les cellules de transmission synaptiques en les faisant pivoter pour lier le cerveau d'Arthur à la matrice réseau. Attention, le nettoyeur de processus de Caine inspecte les connexions !";
    } else if (num === -2) {
      titleEl.innerText = "Épisode Caché: Fusion Red/Blue (1993)";
      descEl.innerText = "Avant le Cirque, il y avait le code brut. Guidez le point rouge (curseur de test 3D) pour capturer et fusionner avec le point bleu (module de surveillance d'IA). Évitez les filtres de sécurité gris de l'administrateur.";
    }
    if (startBtn) {
      if (isCompleted) {
        startBtn.innerText = num === 0 ? "REJOUER LA CALIBRATION" : "REJOUER L'EPISODE";
        startBtn.title = "Archive deja validee : relancer ce module en mode replay.";
      } else if (num === 0) {
        startBtn.innerText = "LANCER LA CALIBRATION";
        startBtn.title = "Demarrer le protocole initial C&A.";
      } else {
        startBtn.innerText = "DEMARRER LA SIMULATION";
        startBtn.title = "Demarrer le transcript et les mini-jeux de cet episode.";
      }
      startBtn.setAttribute('aria-label', startBtn.title);
    }
    this.renderSubepisodeMenu(num);
    this.updateSubepisodeStartButton(num);
  },

  escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  renderSubepisodeMenu(num) {
    const menu = document.getElementById('sim-subepisode-menu');
    if (!menu) return;

    const segments = this.getSubepisodeSegments(num);
    if (segments.length === 0) {
      menu.hidden = true;
      menu.innerHTML = "";
      return;
    }

    menu.hidden = false;
    const completed = this.getSubepisodeProgress(num);
    const countLabel = `${segments.length} sous-episodes interactifs`;
    const items = segments.map((segment, index) => {
      const locked = this.isSubepisodeLocked(num, index);
      const done = completed.includes(index);
      const selected = index === this.selectedSubepisodeIndex;
      const state = done ? "TERMINE" : (locked ? "VERROUILLE" : (selected ? "PRET" : "OUVERT"));
      return `
      <button type="button" class="subepisode-item ${done ? "done" : ""} ${selected ? "selected" : ""} ${locked ? "locked" : ""}" data-subepisode-index="${index}" ${locked ? "disabled" : ""}>
        <div class="subepisode-index">${String(index + 1).padStart(2, '0')}</div>
        <div>
          <div class="subepisode-name">${this.escapeHTML(segment.title)} <span class="subepisode-state">${state}</span></div>
          <div class="subepisode-objective">${this.escapeHTML(segment.objective)}</div>
        </div>
      </button>
    `;
    }).join("");

    menu.innerHTML = `
      <div class="subepisode-menu-title">
        <span>Decoupage narratif</span>
        <span>${this.escapeHTML(countLabel)}</span>
      </div>
      <div class="subepisode-list">${items}</div>
    `;

    menu.querySelectorAll('.subepisode-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-subepisode-index'), 10);
        if (this.isSubepisodeLocked(num, index)) {
          SoundManager.playError();
          return;
        }
        SoundManager.playClick();
        this.selectedSubepisodeIndex = index;
        this.renderSubepisodeMenu(num);
        this.updateSubepisodeStartButton(num);
      });
    });
  },

  getSubepisodeProgress(num) {
    try {
      const raw = localStorage.getItem(`tadc_subepisode_progress_${num}`);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Number.isInteger) : [];
    } catch (e) {
      return [];
    }
  },

  markSubepisodeComplete(num, index) {
    const progress = this.getSubepisodeProgress(num);
    if (!progress.includes(index)) {
      progress.push(index);
      progress.sort((a, b) => a - b);
      localStorage.setItem(`tadc_subepisode_progress_${num}`, JSON.stringify(progress));
    }
  },

  getSubepisodeSegments(num) {
    const data = this.storyData[num];
    const checkpoints = this.storyCheckpointConfig[num] || [];
    if (!data || !data.intro || checkpoints.length === 0) return [];

    let cursor = 0;
    return checkpoints.map((checkpoint, index) => {
      const end = Math.min(Math.max(checkpoint.after, cursor + 1), data.intro.length);
      const start = cursor;
      cursor = end;
      return {
        ...checkpoint,
        index,
        totalParts: checkpoints.length,
        start,
        end,
        localAfter: end - start
      };
    }).filter(segment => segment.localAfter > 0);
  },

  getNextPlayableSubepisodeIndex(num) {
    const segments = this.getSubepisodeSegments(num);
    if (segments.length === 0) return 0;
    const completed = this.getSubepisodeProgress(num);
    const next = segments.find(segment => !completed.includes(segment.index));
    return next ? next.index : 0;
  },

  isSubepisodeLocked(num, index) {
    if (this.getProgress().includes(num)) return false;
    if (index <= 0) return false;
    const completed = this.getSubepisodeProgress(num);
    return !completed.includes(index - 1);
  },

  updateSubepisodeStartButton(num) {
    const startBtn = document.getElementById('btn-start-simulation');
    if (!startBtn) return;
    const segments = this.getSubepisodeSegments(num);
    if (segments.length === 0) return;
    const selected = segments[this.selectedSubepisodeIndex] || segments[0];
    const replay = this.getProgress().includes(num) || this.getSubepisodeProgress(num).includes(selected.index);
    startBtn.innerText = `${replay ? "REJOUER" : "LANCER"} SOUS-EPISODE ${selected.index + 1}/${segments.length}`;
    startBtn.title = `${selected.title} - ${selected.objective}`;
    startBtn.setAttribute('aria-label', startBtn.title);
  },

  launchSelectedEpisode() {
    if (this.getSubepisodeSegments(this.currentEpisode).length > 0) {
      this.startSubepisode(this.currentEpisode, this.selectedSubepisodeIndex);
    } else {
      this.startStory(this.currentEpisode, 'intro');
    }
  },

  startSubepisode(num, index) {
    const data = this.storyData[num];
    const segments = this.getSubepisodeSegments(num);
    const segment = segments[index] || segments[0];
    if (!data || !segment) {
      this.startStory(num, 'intro');
      return;
    }
    if (this.isSubepisodeLocked(num, segment.index)) {
      SoundManager.playError();
      if (window.OS && typeof window.OS.showDialog === 'function') {
        window.OS.showDialog('SOUS-EPISODE VERROUILLE', 'Terminez le sous-episode precedent avant de continuer cette archive.');
      }
      return;
    }

    this.currentEpisode = num;
    this.storyPhase = 'intro';
    this.storyIndex = 0;
    this.bonusTextPending = "";
    this.completedStoryCheckpoints = new Set();
    this.selectedSubepisodeIndex = segment.index;
    this.activeSubepisodeIndex = segment.index;
    this.activeSubepisodeTotal = segments.length;
    this.activeSubepisodeCheckpoint = {
      ...segment,
      after: segment.localAfter,
      part: segment.index + 1,
      totalParts: segments.length
    };
    this.storyLines = data.intro.slice(segment.start, segment.end);

    if (this.activeStoryMicroGame) {
      this.activeStoryMicroGame.stop();
      this.activeStoryMicroGame = null;
    }

    document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('sim-story-screen').classList.add('active');
    document.getElementById('sim-story-title').innerText = `${data.title} // ${segment.title}`;
    document.getElementById('sim-story-phase-label').innerText = `[SOUS-EPISODE ${segment.index + 1}/${segments.length} - ARCHIVE INTERACTIVE]`;

    const textPane = document.getElementById('sim-story-text');
    textPane.innerHTML = "";
    this.displayedText = "";
    this.resetStoryScene();

    const nextBtn = document.getElementById('btn-story-next');
    if (nextBtn) nextBtn.innerText = "CONTINUER";

    const skipBtn = document.getElementById('btn-story-skip');
    if (skipBtn) {
      skipBtn.innerText = segment.index >= segments.length - 1 ? 'ACCEDER AU FINAL' : 'PASSER AU SUIVANT';
    }

    this.updateStoryProgress();
    this.typeNextLine();
  },

  startStory(num, phase, bonusText = "") {
    this.currentEpisode = num;
    this.storyPhase = phase;
    this.storyIndex = 0;
    this.bonusTextPending = bonusText;
    this.completedStoryCheckpoints = new Set();
    this.activeSubepisodeIndex = null;
    this.activeSubepisodeCheckpoint = null;
    this.activeSubepisodeTotal = 0;
    if (this.activeStoryMicroGame) {
      this.activeStoryMicroGame.stop();
      this.activeStoryMicroGame = null;
    }
    
    const data = this.storyData[num];
    if (!data || (phase === 'outro' && (!data.outro || data.outro.length === 0))) {
      if (phase === 'intro') {
        this.startGameplay();
      } else {
        this.completeEpisode(bonusText);
      }
      return;
    }
    
    this.storyLines = phase === 'intro' ? data.intro : data.outro;
    
    document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));
    const storyScreen = document.getElementById('sim-story-screen');
    storyScreen.classList.add('active');
    
    document.getElementById('sim-story-title').innerText = data.title;
    document.getElementById('sim-story-phase-label').innerText = phase === 'intro' ? "[INITIALISATION - INTRO NARRATIVE]" : "[COMPILATION - OUTRO NARRATIVE]";
    
    const textPane = document.getElementById('sim-story-text');
    textPane.innerHTML = "";
    this.displayedText = "";
    this.resetStoryScene();
    
    const nextBtn = document.getElementById('btn-story-next');
    nextBtn.innerText = "CONTINUER";

    // Update skip button label
    const skipBtn = document.getElementById('btn-story-skip');
    if (skipBtn) {
      skipBtn.innerText = phase === 'intro' ? 'ACCÉDER AU SIMULATEUR' : 'VALIDER';
    }

    // Reset progress bar
    this.updateStoryProgress();
    
    this.typeNextLine();
  },

  getPendingStoryCheckpoint() {
    if (this.storyPhase !== 'intro') return null;
    if (!this.storyLines || this.storyIndex <= 0) return null;
    if (this.activeSubepisodeCheckpoint) {
      const checkpoint = this.activeSubepisodeCheckpoint;
      return checkpoint.after === this.storyIndex && !this.completedStoryCheckpoints.has(checkpoint.after) ? checkpoint : null;
    }
    const checkpoints = this.storyCheckpointConfig[this.currentEpisode] || [];
    return checkpoints.find(cp => cp.after === this.storyIndex && !this.completedStoryCheckpoints.has(cp.after)) || null;
  },

  updateStoryCheckpointButton() {
    const nextBtn = document.getElementById('btn-story-next');
    if (!nextBtn) return;
    const checkpoint = this.getPendingStoryCheckpoint();
    if (checkpoint) {
      nextBtn.innerText = "LANCER MICRO-JEU";
      return;
    }
    if (this.storyIndex >= this.storyLines.length) {
      nextBtn.innerText = this.storyPhase === 'intro' ? "COMMENCER LE MINI-JEU" : "VALIDER LA SIMULATION";
    } else {
      nextBtn.innerText = "CONTINUER";
    }
  },

  startStoryMicroGame(config) {
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('sim-story-micro-screen').classList.add('active');

    const checkpoints = this.storyCheckpointConfig[this.currentEpisode] || [];
    const checkpointIndex = this.activeSubepisodeIndex !== null ? this.activeSubepisodeIndex : checkpoints.findIndex(cp => cp.after === config.after);
    const microConfig = {
      ...config,
      part: checkpointIndex >= 0 ? checkpointIndex + 1 : 1,
      totalParts: this.activeSubepisodeTotal || checkpoints.length || 1
    };

    this.activeStoryMicroGame = new StoryMicroGame(microConfig, () => {
      this.completedStoryCheckpoints.add(config.after);
      if (this.activeStoryMicroGame) {
        this.activeStoryMicroGame.stop();
        this.activeStoryMicroGame = null;
      }
      document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('sim-story-screen').classList.add('active');
      SoundManager.playWin();
      this.updateStoryCheckpointButton();
      setTimeout(() => {
        if (this.activeSubepisodeIndex !== null && this.storyIndex >= this.storyLines.length) {
          this.finishActiveSubepisode();
          return;
        }
        if (this.storyIndex < this.storyLines.length && !this.getPendingStoryCheckpoint()) {
          this.typeNextLine();
        }
      }, 350);
    });
    this.activeStoryMicroGame.prepare();
  },

  finishActiveSubepisode() {
    if (this.activeSubepisodeIndex === null) {
      this.startGameplay();
      return;
    }

    const finishedIndex = this.activeSubepisodeIndex;
    const episodeNum = this.currentEpisode;
    const segments = this.getSubepisodeSegments(episodeNum);
    this.markSubepisodeComplete(episodeNum, finishedIndex);
    this.activeSubepisodeIndex = null;
    this.activeSubepisodeCheckpoint = null;
    this.activeSubepisodeTotal = 0;

    if (finishedIndex < segments.length - 1) {
      this.selectedSubepisodeIndex = finishedIndex + 1;
      this.showStartScreen(episodeNum);
      if (window.OS && typeof window.OS.showDialog === 'function') {
        window.OS.showDialog('SOUS-EPISODE TERMINE', `Archive ${finishedIndex + 1}/${segments.length} validee. Le bloc suivant est pret.`);
      }
      return;
    }

    this.startGameplay();
  },

  escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  getStorySpeakerTags(text) {
    const matches = Array.from(String(text).matchAll(/\[([^\]\r\n]{1,40})\]:/g));
    const tags = [];
    matches.forEach(match => {
      const tag = match[1].trim();
      if (tag && !tags.some(existing => existing.toLowerCase() === tag.toLowerCase())) {
        tags.push(tag);
      }
    });
    return tags;
  },

  isStageOnlyTransmission(text) {
    const body = String(text)
      .replace(/^\s*\[[0-9:.]+\]\s*/, "")
      .replace(/[♪\s-]+/g, "")
      .trim();
    return body.length > 0 && /^(?:\[[^\]]+\]|\([^)]+\)|[!?.,:;])+$/i.test(body);
  },

  isTechnicalSystemTransmission(text) {
    const normalized = String(text)
      .replace(/^\s*\[[0-9:.]+\]\s*/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    return /\b(SYSTEME|SYSTEM|INITIALISATION|PROTOCOLE|CONNEXION|SIGNAL|CALIBRATION|SYNCHRONISATION|TRANSMISSION|ERREUR|ALERTE|MEMOIRE|CHARGEMENT|ARCHIVE|BIOS|C&A|CAINOS|MAINFRAME|VERIFICATION|INTEGRITE|ACCES|SIMULATION)\b/.test(normalized);
  },

  stripLeadingSpeakerTag(text, speaker) {
    if (!speaker) return String(text).trim();
    const pattern = new RegExp(`\\[${this.escapeRegExp(speaker)}\\]:\\s*`, "i");
    const match = pattern.exec(String(text));
    if (!match) return String(text).trim();

    const before = String(text).slice(0, match.index);
    const beforeIsCueOnly = before
      .replace(/^\s*\[[0-9:.]+\]\s*/, "")
      .replace(/\[[^\]]+\]/g, "")
      .replace(/[-\s]/g, "")
      .length === 0;
    if (!beforeIsCueOnly) return String(text).trim();

    return (before + String(text).slice(match.index + match[0].length)).trim();
  },

  getStoryDisplayLine(line) {
    const rawSpeaker = String(line.speaker || "SYSTEM").trim();
    const text = String(line.text || "");
    const tags = this.getStorySpeakerTags(text);
    let speaker = rawSpeaker;
    let displayText = text;
    let isSystemAudio = rawSpeaker.toUpperCase() === "SYSTEM";

    if (isSystemAudio) {
      if (tags.length === 1) {
        speaker = tags[0];
        displayText = this.stripLeadingSpeakerTag(text, speaker);
        isSystemAudio = false;
      } else if (tags.length > 1) {
        speaker = "CAST";
        isSystemAudio = false;
      } else {
        speaker = this.isStageOnlyTransmission(text) ? "ARCHIVE" : (this.isTechnicalSystemTransmission(text) ? "SYSTEM" : "CAST");
      }
    } else {
      displayText = this.stripLeadingSpeakerTag(text, rawSpeaker);
    }

    return {
      speaker: speaker.toUpperCase(),
      text: displayText,
      isSystemAudio
    };
  },

  normalizeStorySpeakerName(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9]+/gi, "")
      .toUpperCase();
  },

  hasReachedLoreGate(gate) {
    if (!gate) return true;
    const progress = this.getProgress();
    const episode = gate.episode;
    const subepisode = Number.isInteger(gate.subepisode) ? gate.subepisode : null;

    if (progress.includes(episode)) return true;

    if (episode >= 0) {
      for (let i = episode + 1; i <= 9; i++) {
        if (progress.includes(i)) return true;
      }
      if (progress.includes(-1) || progress.includes(-2)) return true;
    }

    if (this.currentEpisode === episode) {
      if (subepisode === null) return true;
      const completed = this.getSubepisodeProgress(episode);
      if (completed.some(index => index >= subepisode)) return true;
      if (this.activeSubepisodeIndex !== null && this.activeSubepisodeIndex >= subepisode) return true;
      if (this.selectedSubepisodeIndex > subepisode && completed.includes(subepisode)) return true;
    }

    return false;
  },

  getStoryCharacterProfile(name) {
    const normalized = this.normalizeStorySpeakerName(name);
    const aliases = {
      PRINCESSLOOLILALU: "LOO",
      PRINCESSLOO: "PRINCESS_LOO",
      LOOLILALU: "LOO",
      BANDIT1: "BANDIT",
      BANDIT2: "BANDIT",
      THEFUDGE: "THE_FUDGE",
      BARONTHEODOREMILDENHALL: "BARON_MILDENHALL",
      THEODOREMILDENHALL: "BARON_MILDENHALL",
      BARONMILDENHALL: "BARON_MILDENHALL",
      MARTHAMILDENHALL: "MARTHA_MILDENHALL",
      MOUNTEDCREATUREHEAD: "MOUNTED_CREATURE_HEAD",
      POSSESSED_POMNI: "POSSESSED_POMNI",
      POSSESSEDPOMNI: "POSSESSED_POMNI",
      TRAININGVIDEO: "TRAINING_VIDEO",
      STRANGECUSTOMER: "STRANGE_CUSTOMER",
      NPC1: "SPUDSY_NPC",
      NPC2: "SPUDSY_NPC",
      NPC3: "SPUDSY_NPC",
      GLOINKQUEEN: "GLOINK_QUEEN",
      GLOINKSQUEEN: "GLOINK_QUEEN",
      QUEENIEHELEN: "QUEENIE"
    };
    const key = aliases[normalized] || normalized;
    const profile = this.storyCharacterProfiles[key] || {
      color: "#39ff14",
      label: String(name || "Signal"),
      info: "Signal personnage detecte dans la transmission, fiche CainOS incomplete."
    };
    const loreKnown = this.hasReachedLoreGate(profile.unlockAt);
    const info = loreKnown
      ? profile.info
      : (profile.lockedInfo || "Information verrouillee : continuez les episodes pour identifier ce signal sans spoiler.");
    const label = loreKnown ? profile.label : (profile.lockedLabel || profile.label);
    return { key, ...profile, label, info, loreKnown };
  },

  getStorySceneSpeakers(line, displayLine) {
    const names = new Set();
    const addName = (name) => {
      const key = this.normalizeStorySpeakerName(name);
      if (key && key !== "UNKNOWN") names.add(key);
    };

    if (displayLine && displayLine.speaker) addName(displayLine.speaker);
    this.getStorySpeakerTags(line?.text || "").forEach(addName);

    const haystack = `${line?.speaker || ""} ${line?.text || ""}`.toUpperCase();
    Object.keys(this.storyCharacterProfiles).forEach(key => {
      const profile = this.storyCharacterProfiles[key];
      const tokens = [key, profile.label].filter(Boolean);
      if (tokens.some(token => haystack.includes(String(token).toUpperCase()))) {
        addName(key);
      }
    });

    if (names.size === 0) addName("ARCHIVE");
    return Array.from(names).slice(0, 8);
  },

  resetStoryScene() {
    this.activeStorySceneCharacters = [];
    const map = document.getElementById('story-scene-map');
    const tooltip = document.getElementById('story-scene-tooltip');
    const status = document.getElementById('story-scene-status');
    if (map) map.innerHTML = "";
    if (tooltip) tooltip.innerText = "Selectionnez un point colore pour lire l'identite du personnage.";
    if (status) status.innerText = "AUCUN SIGNAL PERSONNAGE";
  },

  updateStoryScene(line, displayLine) {
    const map = document.getElementById('story-scene-map');
    const tooltip = document.getElementById('story-scene-tooltip');
    const status = document.getElementById('story-scene-status');
    if (!map || !tooltip || !status) return;

    const speakerKey = this.normalizeStorySpeakerName(displayLine?.speaker || "ARCHIVE");
    const speakers = this.getStorySceneSpeakers(line, displayLine);
    const positions = [
      { x: 18, y: 58 }, { x: 32, y: 35 }, { x: 47, y: 55 }, { x: 61, y: 34 },
      { x: 75, y: 57 }, { x: 88, y: 38 }, { x: 12, y: 30 }, { x: 92, y: 62 }
    ];

    map.innerHTML = speakers.map((name, index) => {
      const profile = this.getStoryCharacterProfile(name);
      const pos = positions[index] || positions[0];
      const initials = profile.label.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
      const active = this.normalizeStorySpeakerName(name) === speakerKey ? " active-speaker" : "";
      const locked = profile.loreKnown ? "" : " lore-locked";
      return `
        <button type="button"
          class="story-dos-point${active}${locked}"
          style="left:${pos.x}%;top:${pos.y}%;--char-color:${profile.color}"
          data-character="${this.escapeHTML(profile.key)}"
          title="${this.escapeHTML(`${profile.label}: ${profile.info}`)}"
          aria-label="${this.escapeHTML(`${profile.label}: ${profile.info}`)}">${this.escapeHTML(initials)}</button>
      `;
    }).join("");

    const activeProfile = this.getStoryCharacterProfile(displayLine?.speaker || speakers[0]);
    const lockLabel = activeProfile.loreKnown ? "INFO OK" : "INFO VERROUILLEE";
    status.innerText = `${activeProfile.label.toUpperCase()} // ${speakers.length} SIGNAL${speakers.length > 1 ? "S" : ""} // ${lockLabel}`;
    tooltip.innerText = `${activeProfile.label}: ${activeProfile.info}`;

    map.querySelectorAll('.story-dos-point').forEach(point => {
      const showInfo = () => {
        const profile = this.getStoryCharacterProfile(point.getAttribute('data-character'));
        tooltip.innerText = `${profile.label}: ${profile.info}`;
      };
      point.addEventListener('click', showInfo);
      point.addEventListener('focus', showInfo);
    });
  },

  formatStoryLine(line, includeLeadingBreak = true) {
    const displayLine = this.getStoryDisplayLine(line);
    const prefix = `${includeLeadingBreak ? "\n" : ""}[${displayLine.speaker}] : `;
    return {
      ...displayLine,
      formattedText: prefix + displayLine.text
    };
  },

  typeNextLine() {
    if (this.storyIndex >= this.storyLines.length) {
      const nextBtn = document.getElementById('btn-story-next');
      if (this.storyPhase === 'intro') {
        nextBtn.innerText = this.activeSubepisodeIndex !== null ? "TERMINER LE SOUS-EPISODE" : "COMMENCER LE MINI-JEU";
      } else {
        nextBtn.innerText = "VALIDER LA SIMULATION";
      }
      return;
    }
    
    const line = this.storyLines[this.storyIndex];
    const displayLine = this.formatStoryLine(line);
    this.updateStoryScene(line, displayLine);
    this.currentLineText = displayLine.formattedText;
    this.charIndex = 0;
    this.isTyping = true;
    
    const textPane = document.getElementById('sim-story-text');
    
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    
    // Adaptive speed: archive lines type faster, speed multiplier applies
    const baseDelay = displayLine.isSystemAudio ? 12 : 25;
    const delay = Math.max(3, Math.round(baseDelay / this.storySpeed));

    this.typewriterTimer = setInterval(() => {
      if (this.charIndex < this.currentLineText.length) {
        // Type multiple chars per tick at higher speeds
        const charsPerTick = this.storySpeed >= 4 ? 3 : (this.storySpeed >= 2 ? 2 : 1);
        for (let c = 0; c < charsPerTick && this.charIndex < this.currentLineText.length; c++) {
          const char = this.currentLineText[this.charIndex];
          this.displayedText += char;
          this.charIndex++;
        }
        textPane.innerText = this.displayedText;
        textPane.scrollTop = textPane.scrollHeight;
        
        if (Math.random() < 0.4) {
          if (displayLine.isSystemAudio) {
            SoundManager.play(400, 0.02, 'sine', 0.02);
          } else {
            SoundManager.play(600 + Math.random() * 300, 0.015, 'triangle', 0.02);
          }
        }
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        this.storyIndex++;
        this.updateStoryProgress();
        this.updateStoryCheckpointButton();
      }
    }, delay);
  },

  finishLineInstantly() {
    if (!this.isTyping) return;
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    
    const textPane = document.getElementById('sim-story-text');
    const remaining = this.currentLineText.substring(this.charIndex);
    this.displayedText += remaining;
    textPane.innerText = this.displayedText;
    textPane.scrollTop = textPane.scrollHeight;
    
    this.storyIndex++;
    this.updateStoryProgress();
    this.updateStoryCheckpointButton();
  },

  skipRemainingStory() {
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    
    const textPane = document.getElementById('sim-story-text');
    let allText = "";
    for (let i = 0; i < this.storyLines.length; i++) {
      const line = this.storyLines[i];
      const displayLine = this.formatStoryLine(line, false);
      allText += (i > 0 ? "\n" : "") + displayLine.formattedText;
    }
    this.displayedText = allText;
    textPane.innerText = allText;
    textPane.scrollTop = textPane.scrollHeight;
    
    this.storyIndex = this.storyLines.length;
    if (this.storyLines.length > 0) {
      const lastLine = this.storyLines[this.storyLines.length - 1];
      this.updateStoryScene(lastLine, this.formatStoryLine(lastLine, false));
    }
    this.updateStoryProgress();
    this.updateStoryCheckpointButton();
  },

  updateStoryProgress() {
    const label = document.getElementById('sim-story-progress-label');
    const fill = document.getElementById('sim-story-progress-fill');
    if (!label || !fill || !this.storyLines) return;
    
    const total = this.storyLines.length;
    const current = Math.min(this.storyIndex, total);
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    
    label.innerText = `[TRANSMISSION ${current}/${total} — ${percent}% DÉCHIFFRÉ]`;
    fill.style.width = `${percent}%`;
  },

  startGameplay() {
    if (this.activeStoryMicroGame) {
      this.activeStoryMicroGame.stop();
      this.activeStoryMicroGame = null;
    }
    document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));

    if (this.currentEpisode === 0) {
      document.getElementById('sim-ep0').classList.add('active');
      this.activeGame = new Episode0Game();
    } else if (this.currentEpisode === 1) {
      document.getElementById('sim-ep1').classList.add('active');
      this.activeGame = new Episode1Game();
    } else if (this.currentEpisode === 2) {
      document.getElementById('sim-ep2').classList.add('active');
      this.activeGame = new Episode2Game();
    } else if (this.currentEpisode === 3) {
      document.getElementById('sim-ep3').classList.add('active');
      this.activeGame = new Episode3Game();
    } else if (this.currentEpisode === 4) {
      document.getElementById('sim-ep4').classList.add('active');
      this.activeGame = new Episode4Game();
    } else if (this.currentEpisode === 5) {
      document.getElementById('sim-ep5').classList.add('active');
      this.activeGame = new Episode5Game();
    } else if (this.currentEpisode === 6) {
      document.getElementById('sim-ep6').classList.add('active');
      this.activeGame = new Episode6Game();
    } else if (this.currentEpisode === 7) {
      document.getElementById('sim-ep7').classList.add('active');
      this.activeGame = new Episode7Game();
    } else if (this.currentEpisode === 8) {
      document.getElementById('sim-ep8').classList.add('active');
      this.activeGame = new Episode8Game();
    } else if (this.currentEpisode === 9) {
      document.getElementById('sim-ep9').classList.add('active');
      this.activeGame = new Episode9Game();
    } else if (this.currentEpisode === -1) {
      document.getElementById('sim-ep-1').classList.add('active');
      this.activeGame = new EpisodePrequelGame();
    } else if (this.currentEpisode === -2) {
      document.getElementById('sim-ep-2').classList.add('active');
      this.activeGame = new EpisodeMinus2Game();
    }

    if (this.activeGame) {
      this.activeGame.start();
    }
  },

  startActiveEpisode() {
    this.launchSelectedEpisode();
  },

  gameOver(reason) {
    if (this.activeGame) this.activeGame.stop();
    // Alert system sound (grave buzz)
    SoundManager.playError();
    SoundManager.play(80, 0.4, 'sawtooth', 0.15);
    document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('sim-gameover-screen').classList.add('active');
    document.getElementById('sim-over-reason').innerText = reason;
  },

  gameWon(bonusText = "") {
    if (this.activeGame) this.activeGame.stop();
    // Compilation success arpeggio
    SoundManager.playWin();
    setTimeout(() => SoundManager.play(440, 0.15, 'sine', 0.08), 500);
    setTimeout(() => SoundManager.play(554, 0.15, 'sine', 0.08), 650);
    setTimeout(() => SoundManager.play(659, 0.2, 'sine', 0.1), 800);
    this.bonusTextPending = bonusText;
    
    // Switch to outro story narrative
    this.startStory(this.currentEpisode, 'outro', bonusText);
  },

  completeEpisode(bonusText = "") {
    const progress = this.getProgress();
    if (!progress.includes(this.currentEpisode)) {
      progress.push(this.currentEpisode);
      localStorage.setItem('tadc_progress', JSON.stringify(progress));
    }
    
    this.updateLocksUI();
    
    if (window.OS) {
      if (typeof window.OS.renderFileList === 'function') {
        window.OS.renderFileList();
      }
      if (typeof window.OS.renderTrashList === 'function') {
        window.OS.renderTrashList();
      }
      if (typeof window.OS.updateDiagnosticsUI === 'function') {
        window.OS.updateDiagnosticsUI();
      }
      if (typeof window.OS.updateWackyWatchCastUI === 'function') {
        window.OS.updateWackyWatchCastUI();
      }
    }

    document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('sim-victory-screen').classList.add('active');
    document.getElementById('sim-victory-bonus').innerText = bonusText;
    this.nextEpisodeAfterVictory = this.getNextEpisodeAfter(this.currentEpisode);
    const continueBtn = document.getElementById('btn-victory-continue');
    if (continueBtn) {
      continueBtn.innerText = this.nextEpisodeAfterVictory !== null && !this.isLocked(this.nextEpisodeAfterVictory) ? "CONTINUER LA SUITE" : "TERMINER";
    }
  },

  getNextEpisodeAfter(num) {
    if (num >= 0 && num < 9) return num + 1;
    if (num === 9) return -1;
    if (num === -1 && this.getProgress().includes(-2)) return -2;
    return null;
  }
};


/* ==========================================================================
   STORY MICRO-GAMES: SHORT CUTS BETWEEN TRANSCRIPT BLOCKS
   ========================================================================== */

class StoryMicroGame {
  constructor(config, onComplete) {
    this.config = config;
    this.onComplete = onComplete;
    this.canvas = document.getElementById('story-micro-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.titleEl = document.getElementById('story-micro-title');
    this.subtitleEl = document.getElementById('story-micro-subtitle');
    this.statusEl = document.getElementById('story-micro-status');
    this.objectiveEl = document.getElementById('story-micro-objective');
    this.actionBtn = document.getElementById('btn-story-micro-action');
    this.loopId = null;
    this.running = false;
    this.completed = false;
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  prepare() {
    this.titleEl.innerText = this.config.title;
    this.subtitleEl.innerText = `[SOUS-EPISODE ${this.config.part}/${this.config.totalParts} // ${this.config.mode.toUpperCase()}]`;
    this.objectiveEl.innerText = this.config.objective;
    this.actionBtn.disabled = false;
    this.actionBtn.innerText = "INITIALISER";
    this.resetState();
    this.drawIdle();
  }

  resetState() {
    this.running = false;
    this.completed = false;
    this.score = 0;
    this.timeLeft = this.config.duration || 16;
    this.lastTick = 0;
    this.pointer = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    this.items = [];
    this.sequence = [];
    this.sequenceIndex = 0;
    this.grid = [];
    this.statusEl.innerText = `0 / ${this.config.goal}`;
  }

  start() {
    this.stop(false);
    this.resetState();
    this.running = true;
    this.actionBtn.disabled = true;
    this.actionBtn.innerText = "EN COURS";
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('keydown', this.handleKeyDown);

    if (this.config.mode === 'sequence') {
      this.sequence = this.buildSequence();
    } else if (this.config.mode === 'repair') {
      this.grid = this.buildGrid();
    } else {
      this.seedItems();
    }

    this.lastTick = Date.now();
    this.loop();
  }

  stop(clearListeners = true) {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    this.loopId = null;
    if (clearListeners) {
      this.canvas.removeEventListener('click', this.handleClick);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('keydown', this.handleKeyDown);
    }
    this.running = false;
  }

  buildSequence() {
    const keys = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const total = this.config.goal || 5;
    const sequence = [];
    for (let i = 0; i < total; i++) {
      sequence.push(keys[Math.floor(Math.random() * keys.length)]);
    }
    return sequence;
  }

  buildGrid() {
    const grid = [];
    const cols = 5;
    const rows = 3;
    const cellW = this.canvas.width / cols;
    const cellH = (this.canvas.height - 30) / rows;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        grid.push({
          x: x * cellW + 12,
          y: y * cellH + 18,
          w: cellW - 24,
          h: cellH - 20,
          good: Math.random() > 0.28,
          fixed: false
        });
      }
    }
    return grid;
  }

  seedItems() {
    const count = this.config.mode === 'dodge' ? 9 : 10;
    this.items = [];
    for (let i = 0; i < count; i++) {
      this.items.push(this.createItem(Math.random() > 0.28));
    }
  }

  createItem(good = true) {
    return {
      x: 24 + Math.random() * (this.canvas.width - 48),
      y: 24 + Math.random() * (this.canvas.height - 56),
      vx: (Math.random() - 0.5) * 80,
      vy: (Math.random() - 0.5) * 70,
      r: good ? 13 : 16,
      good
    };
  }

  handleMouseMove(e) {
    const pos = this.getCanvasPos(e);
    this.pointer.x = pos.x;
    this.pointer.y = pos.y;
  }

  handleClick(e) {
    if (!this.running || this.completed) return;
    const pos = this.getCanvasPos(e);

    if (this.config.mode === 'click') {
      this.handleTargetClick(pos);
    } else if (this.config.mode === 'repair') {
      this.handleRepairClick(pos);
    } else if (this.config.mode === 'sequence') {
      this.handleSequenceInput(this.getDirectionFromPoint(pos));
    }
  }

  handleKeyDown(e) {
    if (!this.running || this.completed || this.config.mode !== 'sequence') return;
    const map = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      w: 'UP',
      s: 'DOWN',
      a: 'LEFT',
      d: 'RIGHT'
    };
    const dir = map[e.key];
    if (dir) {
      e.preventDefault();
      this.handleSequenceInput(dir);
    }
  }

  getCanvasPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  getDirectionFromPoint(pos) {
    const dx = pos.x - this.canvas.width / 2;
    const dy = pos.y - this.canvas.height / 2;
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'RIGHT' : 'LEFT';
    return dy > 0 ? 'DOWN' : 'UP';
  }

  handleTargetClick(pos) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      const dist = Math.hypot(pos.x - item.x, pos.y - item.y);
      if (dist <= item.r + 4) {
        if (item.good) {
          this.score++;
          SoundManager.playClick();
          this.items.splice(i, 1);
          this.items.push(this.createItem(Math.random() > 0.25));
          this.checkWin();
        } else {
          SoundManager.playError();
          this.timeLeft = Math.max(2, this.timeLeft - 2);
        }
        this.updateStatus();
        return;
      }
    }
  }

  handleRepairClick(pos) {
    const cell = this.grid.find(c => !c.fixed && pos.x >= c.x && pos.x <= c.x + c.w && pos.y >= c.y && pos.y <= c.y + c.h);
    if (!cell) return;
    if (cell.good) {
      cell.fixed = true;
      this.score++;
      SoundManager.playClick();
      this.checkWin();
    } else {
      SoundManager.playError();
      cell.good = true;
      this.timeLeft = Math.max(2, this.timeLeft - 2);
    }
    this.updateStatus();
  }

  handleSequenceInput(dir) {
    const expected = this.sequence[this.sequenceIndex];
    if (dir === expected) {
      this.sequenceIndex++;
      this.score = this.sequenceIndex;
      SoundManager.playClick();
      this.checkWin();
    } else {
      SoundManager.playError();
      this.sequenceIndex = Math.max(0, this.sequenceIndex - 1);
      this.score = this.sequenceIndex;
      this.timeLeft = Math.max(2, this.timeLeft - 1.5);
    }
    this.updateStatus();
  }

  loop() {
    if (!this.running || this.completed) return;
    const now = Date.now();
    const dt = Math.min(0.05, (now - this.lastTick) / 1000);
    this.lastTick = now;
    this.timeLeft -= dt;

    if (this.config.mode === 'click') {
      this.updateItems(dt);
      this.drawClickMode();
    } else if (this.config.mode === 'repair') {
      this.drawRepairMode();
    } else if (this.config.mode === 'sequence') {
      this.drawSequenceMode();
    } else if (this.config.mode === 'dodge') {
      this.updateDodge(dt);
      this.drawDodgeMode();
    }

    if (this.timeLeft <= 0) {
      this.fail();
      return;
    }

    this.updateStatus();
    this.loopId = requestAnimationFrame(() => this.loop());
  }

  updateItems(dt) {
    this.items.forEach(item => {
      item.x += item.vx * dt;
      item.y += item.vy * dt;
      if (item.x < item.r || item.x > this.canvas.width - item.r) item.vx *= -1;
      if (item.y < item.r || item.y > this.canvas.height - item.r) item.vy *= -1;
      item.x = Math.max(item.r, Math.min(this.canvas.width - item.r, item.x));
      item.y = Math.max(item.r, Math.min(this.canvas.height - item.r, item.y));
    });
  }

  updateDodge(dt) {
    if (this.items.length < 10 && Math.random() < 0.04) {
      this.items.push(this.createItem(Math.random() > 0.45));
    }
    this.updateItems(dt);
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      const dist = Math.hypot(this.pointer.x - item.x, this.pointer.y - item.y);
      if (dist <= item.r + 10) {
        if (item.good) {
          this.score++;
          SoundManager.playClick();
          this.items.splice(i, 1);
          this.items.push(this.createItem(Math.random() > 0.45));
          this.checkWin();
        } else {
          SoundManager.playError();
          this.timeLeft = Math.max(2, this.timeLeft - 1.6);
          item.x = 24 + Math.random() * (this.canvas.width - 48);
          item.y = 24 + Math.random() * (this.canvas.height - 56);
        }
      }
    }
  }

  checkWin() {
    if (this.score >= (this.config.goal || 5)) {
      this.completed = true;
      this.stop();
      this.statusEl.innerText = "SYNC OK";
      this.actionBtn.disabled = true;
      setTimeout(() => this.onComplete(), 450);
    }
  }

  fail() {
    this.stop();
    this.statusEl.innerText = "DESYNC";
    this.actionBtn.disabled = false;
    this.actionBtn.innerText = "REESSAYER";
    SoundManager.playError();
    this.drawFail();
  }

  updateStatus() {
    if (this.completed) return;
    const left = Math.max(0, Math.ceil(this.timeLeft));
    this.statusEl.innerText = `${this.score} / ${this.config.goal} | ${left}s`;
  }

  clear() {
    this.ctx.fillStyle = '#010401';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = 'rgba(57,255,20,0.12)';
    for (let x = 0; x < this.canvas.width; x += 25) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 25) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawIdle() {
    this.clear();
    this.ctx.fillStyle = '#39ff14';
    this.ctx.font = '18px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('MICRO-SIMULATION EN ATTENTE', this.canvas.width / 2, 132);
    this.ctx.font = '12px Courier New';
    this.ctx.fillText('INITIALISER POUR REPRENDRE LE FLUX', this.canvas.width / 2, 155);
  }

  drawClickMode() {
    this.clear();
    this.items.forEach(item => {
      this.drawNode(item.x, item.y, item.r, item.good ? '#39ff14' : '#ff3344', item.good ? this.config.target : this.config.hazard);
    });
  }

  drawRepairMode() {
    this.clear();
    this.grid.forEach(cell => {
      this.ctx.fillStyle = cell.fixed ? '#0b3817' : (cell.good ? '#123d22' : '#401018');
      this.ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
      this.ctx.strokeStyle = cell.fixed ? '#39ff14' : (cell.good ? '#2fb86a' : '#ff3344');
      this.ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);
      this.ctx.fillStyle = cell.fixed ? '#39ff14' : '#d5ffd5';
      this.ctx.font = '11px Courier New';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(cell.fixed ? 'OK' : (cell.good ? this.config.target : this.config.hazard), cell.x + cell.w / 2, cell.y + cell.h / 2 + 4);
    });
  }

  drawSequenceMode() {
    this.clear();
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 + 8;
    const pads = [
      { dir: 'UP', x: cx - 32, y: cy - 78, label: '^' },
      { dir: 'DOWN', x: cx - 32, y: cy + 18, label: 'v' },
      { dir: 'LEFT', x: cx - 88, y: cy - 30, label: '<' },
      { dir: 'RIGHT', x: cx + 24, y: cy - 30, label: '>' }
    ];
    const expected = this.sequence[this.sequenceIndex];
    pads.forEach(pad => {
      this.ctx.fillStyle = pad.dir === expected ? '#174a2c' : '#101710';
      this.ctx.fillRect(pad.x, pad.y, 64, 48);
      this.ctx.strokeStyle = pad.dir === expected ? '#39ff14' : '#2f6d45';
      this.ctx.strokeRect(pad.x, pad.y, 64, 48);
      this.ctx.fillStyle = '#d6ffd6';
      this.ctx.font = '24px Courier New';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(pad.label, pad.x + 32, pad.y + 31);
    });
    this.ctx.fillStyle = '#9adf9a';
    this.ctx.font = '12px Courier New';
    this.ctx.fillText(`SEQUENCE: ${this.sequence.map((s, i) => i < this.sequenceIndex ? 'OK' : s).join(' ')}`, cx, 38);
  }

  drawDodgeMode() {
    this.clear();
    this.items.forEach(item => {
      this.drawNode(item.x, item.y, item.r, item.good ? '#00d4ff' : '#ff3344', item.good ? this.config.target : this.config.hazard);
    });
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(this.pointer.x, this.pointer.y, 9, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#39ff14';
    this.ctx.stroke();
  }

  drawNode(x, y, r, color, label) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();
    this.ctx.fillStyle = '#020402';
    this.ctx.font = '9px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(label.slice(0, 6), x, y + 3);
  }

  drawFail() {
    this.clear();
    this.ctx.fillStyle = '#ff3344';
    this.ctx.font = '20px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('DESYNCHRONISATION', this.canvas.width / 2, 130);
    this.ctx.fillStyle = '#ffd6d6';
    this.ctx.font = '12px Courier New';
    this.ctx.fillText('Relancez la micro-simulation.', this.canvas.width / 2, 154);
  }
}


/* ==========================================================================
   EPISODE 1: THE EXIT MAZE GAME
   ========================================================================== */

class Episode1Game {
  constructor() {
    this.canvas = document.getElementById('ep1-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sanitySpan = document.getElementById('ep1-sanity');
    
    // Buttons
    this.stabilizeBtn = document.getElementById('ep1-btn-stabilize');
    this.firewallBtn = document.getElementById('ep1-btn-firewall');
    
    this.gridWidth = 12;
    this.gridHeight = 9;
    this.cellSize = 30; // 360 x 270 offset by 5px top/left
    
    this.resetState();
    
    // Bind canvas clicks
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.handleStabilize = this.handleStabilize.bind(this);
    this.handleFirewallToggle = this.handleFirewallToggle.bind(this);
  }

  resetState() {
    this.grid = [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,1,0,0,0,3], // 3 is office entrance
      [1,1,1,0,1,0,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // Office Red Maze (Overlay when entering 3)
    this.inOffice = false;
    this.sanity = 100;
    this.firewallsLeft = 3;
    this.stabilizers = 2;
    
    this.pomni = { x: 1, y: 1, targetX: 1, targetY: 1, speed: 0.05, t: 0 };
    this.kaufmo = { x: 10, y: 7, targetX: 10, targetY: 7, speed: 0.03, t: 0 };
    
    this.exit = { x: 11, y: 5 }; // Final exit
    this.officeExit = { x: 10, y: 1 }; // Real exit in office maze
    
    this.firewalls = []; // Array of {x, y}
    this.placingFirewall = false;
    this.loopId = null;
    this.lastTick = 0;
    this.finished = false;
  }

  start() {
    this.resetState();
    this.canvas.addEventListener('click', this.handleCanvasClick);
    this.stabilizeBtn.addEventListener('click', this.handleStabilize);
    this.firewallBtn.addEventListener('click', this.handleFirewallToggle);
    
    this.stabilizeBtn.innerText = `STABILISER (${this.stabilizers})`;
    this.firewallBtn.innerText = `PLACER PARE-FEU (${this.firewallsLeft})`;
    this.firewallBtn.classList.remove('btn-primary-retro');
    
    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    this.finished = true;
    if (this.loopId) cancelAnimationFrame(this.loopId);
    this.canvas.removeEventListener('click', this.handleCanvasClick);
    this.stabilizeBtn.removeEventListener('click', this.handleStabilize);
    this.firewallBtn.removeEventListener('click', this.handleFirewallToggle);
  }

  handleCanvasClick(e) {
    if (this.finished) return;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    
    const x = Math.floor(clickX / this.cellSize);
    const y = Math.floor(clickY / this.cellSize);

    if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
      SoundManager.playClick();
      
      // Check if clicked cell is empty floor (0)
      if (this.grid[y][x] === 0) {
        // Toggle firewall
        const idx = this.firewalls.findIndex(f => f.x === x && f.y === y);
        if (idx !== -1) {
          this.firewalls.splice(idx, 1);
          this.firewallsLeft++;
        } else if (this.firewallsLeft > 0) {
          // Check Pomni or Kaufmo aren't on it
          if (Math.round(this.pomni.x) !== x || Math.round(this.pomni.y) !== y) {
            if (Math.round(this.kaufmo.x) !== x || Math.round(this.kaufmo.y) !== y) {
              this.firewalls.push({ x, y });
              this.firewallsLeft--;
            }
          }
        }
        this.firewallBtn.innerText = `PLACER PARE-FEU (${this.firewallsLeft})`;
      }
    }
  }

  handleStabilize() {
    if (this.finished) return;
    if (this.stabilizers > 0 && this.sanity < 100) {
      SoundManager.playWin();
      this.sanity = Math.min(100, this.sanity + 30);
      this.stabilizers--;
      this.stabilizeBtn.innerText = `STABILISER (${this.stabilizers})`;
      this.updateSanityUI();
    } else {
      SoundManager.playError();
    }
  }

  handleFirewallToggle() {
    if (this.finished) return;
    SoundManager.playClick();
    this.placingFirewall = !this.placingFirewall;
    if (this.placingFirewall) {
      this.firewallBtn.classList.add('btn-primary-retro');
    } else {
      this.firewallBtn.classList.remove('btn-primary-retro');
    }
  }

  updateSanityUI() {
    this.sanitySpan.innerText = `${Math.round(this.sanity)}%`;
    this.sanitySpan.className = "";
    if (this.sanity > 50) {
      this.sanitySpan.classList.add('green-text');
    } else if (this.sanity > 25) {
      this.sanitySpan.classList.add('orange-text');
    } else {
      this.sanitySpan.classList.add('red-text', 'alert-pulse');
    }
  }

  loop() {
    if (this.finished) return;
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.update(dt);
    if (this.finished) return;
    this.draw();

    if (!this.finished) {
      this.loopId = requestAnimationFrame(() => this.loop());
    }
  }

  isWall(x, y) {
    if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return true;
    if (this.grid[y][x] === 1) return true;
    // Check firewall
    return this.firewalls.some(f => f.x === x && f.y === y);
  }

  getNeighbors(pos) {
    const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
    const list = [];
    dirs.forEach(d => {
      const nx = pos.x + d.x;
      const ny = pos.y + d.y;
      if (!this.isWall(nx, ny)) {
        list.push({x: nx, y: ny});
      }
    });
    return list;
  }

  // Simple BFS pathfinder
  findPath(start, target) {
    const queue = [[start]];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);

    while(queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node.x === target.x && node.y === target.y) {
        return path;
      }

      const neighbors = this.getNeighbors(node);
      for (let n of neighbors) {
        const key = `${n.x},${n.y}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([...path, n]);
        }
      }
    }
    return null;
  }

  update(dt) {
    if (this.finished) return;

    // 1. Pomni movement logic
    this.pomni.t += this.pomni.speed;
    if (this.pomni.t >= 1) {
      this.pomni.x = this.pomni.targetX;
      this.pomni.y = this.pomni.targetY;
      this.pomni.t = 0;

      // Determine target: Pomni wants to reach exit
      let target = this.inOffice ? this.officeExit : this.exit;
      let path = this.findPath(this.pomni, target);
      
      if (path && path.length > 1) {
        this.pomni.targetX = path[1].x;
        this.pomni.targetY = path[1].y;
      } else {
        // Wander randomly
        const neighbors = this.getNeighbors(this.pomni);
        if (neighbors.length > 0) {
          const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
          this.pomni.targetX = rand.x;
          this.pomni.targetY = rand.y;
        }
      }

      // Check transition to Office
      if (!this.inOffice && this.pomni.x === 11 && this.pomni.y === 5) {
        this.inOffice = true;
        SoundManager.playGlitch();
        // Load Office Maze
        this.grid = [
          [1,1,1,1,1,1,1,1,1,1,1,1],
          [1,0,0,0,1,0,0,0,0,0,0,1], // 10,1 is exit
          [1,0,1,0,1,0,1,1,1,1,0,1],
          [1,0,1,0,0,0,1,0,0,1,0,1],
          [1,0,1,1,1,0,1,0,0,1,0,1],
          [1,0,0,0,1,0,0,0,1,1,0,1],
          [1,1,1,0,1,1,1,0,1,0,0,1],
          [1,0,0,0,0,0,1,0,0,0,0,1],
          [1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        this.firewalls = [];
        this.firewallsLeft = 2;
        this.pomni.x = 1; this.pomni.y = 7;
        this.pomni.targetX = 1; this.pomni.targetY = 7;
        // Kaufmo spawns behind her
        this.kaufmo.x = 1; this.kaufmo.y = 1;
        this.kaufmo.targetX = 1; this.kaufmo.targetY = 1;
      }

      // Win Condition: reached office exit
      if (this.inOffice && this.pomni.x === 10 && this.pomni.y === 1) {
        // Red room final cutscene: she sees table
        this.finished = true;
        EpisodeManager.gameWon("Pomni a trouvé la sortie... Mais elle n'a trouvé que le Vide et le bureau C&A. Elle est téléportée à la table du banquet.");
        return;
      }
    } else {
      // Interpolate position
      this.pomni.x = this.pomni.x + (this.pomni.targetX - this.pomni.x) * this.pomni.t;
      this.pomni.y = this.pomni.y + (this.pomni.targetY - this.pomni.y) * this.pomni.t;
    }

    // 2. Kaufmo movement logic
    this.kaufmo.t += this.kaufmo.speed;
    if (this.kaufmo.t >= 1) {
      this.kaufmo.x = this.kaufmo.targetX;
      this.kaufmo.y = this.kaufmo.targetY;
      this.kaufmo.t = 0;

      // Chases Pomni
      let path = this.findPath(this.kaufmo, { x: Math.round(this.pomni.x), y: Math.round(this.pomni.y) });
      if (path && path.length > 1) {
        this.kaufmo.targetX = path[1].x;
        this.kaufmo.targetY = path[1].y;
      } else {
        // Wander randomly if no path
        const neighbors = this.getNeighbors(this.kaufmo);
        if (neighbors.length > 0) {
          const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
          this.kaufmo.targetX = rand.x;
          this.kaufmo.targetY = rand.y;
        }
      }
    } else {
      this.kaufmo.x = this.kaufmo.x + (this.kaufmo.targetX - this.kaufmo.x) * this.kaufmo.t;
      this.kaufmo.y = this.kaufmo.y + (this.kaufmo.targetY - this.kaufmo.y) * this.kaufmo.t;
    }

    // 3. Sanity Drain Calculations
    let dx = this.pomni.x - this.kaufmo.x;
    let dy = this.pomni.y - this.kaufmo.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist < 1.5) {
      this.sanity -= dt * 30; // Rapid drain close to Kaufmo
      SoundManager.playGlitch();
    } else if (dist < 3.0) {
      this.sanity -= dt * 10;
    }

    if (this.inOffice) {
      this.sanity -= dt * 3; // Natural office maze sanity drain (lore!)
    }

    this.updateSanityUI();

    if (this.sanity <= 0) {
      this.finished = true;
      EpisodeManager.gameOver("Pomni a perdu toute raison. Elle s'est abstraite dans la cave.");
      return;
    }
  }

  draw() {
    this.ctx.fillStyle = '#050705';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Grid
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const val = this.grid[y][x];
        const px = x * this.cellSize;
        const py = y * this.cellSize;

        if (val === 1) {
          // Wall
          this.ctx.fillStyle = this.inOffice ? '#502020' : '#1b2c1f';
          this.ctx.fillRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
          this.ctx.strokeStyle = this.inOffice ? '#aa4444' : '#2d4d35';
          this.ctx.strokeRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
        } else if (x === 11 && y === 5 && !this.inOffice) {
          // Exit door first phase
          this.ctx.fillStyle = '#cc0000';
          this.ctx.fillRect(px + 2, py + 2, this.cellSize - 4, this.cellSize - 4);
          this.ctx.fillStyle = '#ffffff';
          this.ctx.font = 'bold 10px Courier';
          this.ctx.fillText("EXIT", px + 4, py + 18);
        } else if (this.inOffice && x === 10 && y === 1) {
          // Exit door office phase
          this.ctx.fillStyle = '#ff3333';
          this.ctx.fillRect(px + 2, py + 2, this.cellSize - 4, this.cellSize - 4);
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.strokeRect(px + 4, py + 4, this.cellSize - 8, this.cellSize - 8);
        } else {
          // Floor
          this.ctx.fillStyle = this.inOffice ? '#2a1a1a' : '#080c09';
          this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
          this.ctx.strokeStyle = '#101712';
          this.ctx.strokeRect(px, py, this.cellSize, this.cellSize);
        }
      }
    }

    // Draw Firewalls
    this.firewalls.forEach(f => {
      const px = f.x * this.cellSize;
      const py = f.y * this.cellSize;
      this.ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
      this.ctx.fillRect(px + 2, py + 2, this.cellSize - 4, this.cellSize - 4);
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(px + 3, py + 3, this.cellSize - 6, this.cellSize - 6);
      this.ctx.lineWidth = 1;
    });

    // Draw Pomni
    const pX = this.pomni.x * this.cellSize + this.cellSize / 2;
    const pY = this.pomni.y * this.cellSize + this.cellSize / 2;
    
    // Draw Pomni icon (Blue & red circles/jester shape)
    this.ctx.fillStyle = '#0088ff';
    this.ctx.beginPath();
    this.ctx.arc(pX - 4, pY - 2, 5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#ff3333';
    this.ctx.beginPath();
    this.ctx.arc(pX + 4, pY - 2, 5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#ffcccc';
    this.ctx.beginPath();
    this.ctx.arc(pX, pY, 6, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 9px monospace';
    this.ctx.fillText("P", pX - 3, pY + 3);

    // Draw Kaufmo (Abstracted Monster glitch effect)
    const kX = this.kaufmo.x * this.cellSize + this.cellSize / 2;
    const kY = this.kaufmo.y * this.cellSize + this.cellSize / 2;
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.ctx.fillRect(kX - 10, kY - 10, 20, 20);
    
    // Glitching colored pixels inside Kaufmo
    const colors = ['#ff00ff', '#00ffff', '#39ff14', '#ffffff', '#ff3333'];
    for (let i = 0; i < 6; i++) {
      this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      this.ctx.fillRect(kX - 9 + Math.random()*14, kY - 9 + Math.random()*14, 4, 4);
    }
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 11px Courier';
    this.ctx.fillText("K", kX - 3, kY + 4);
  }
}


/* ==========================================================================
   EPISODE 2: THE NPC PARADOX GAME
   ========================================================================== */

class Episode2Game {
  constructor() {
    this.canvas = document.getElementById('ep2-runner-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // UI Panels
    this.phase1Panel = document.getElementById('ep2-phase1');
    this.phase2Panel = document.getElementById('ep2-phase2');
    this.integritySpan = document.getElementById('ep2-integrity');
    this.puzzleGrid = document.getElementById('ep2-puzzle-grid');
    this.memoryDump = document.getElementById('ep2-memory-dump');
    
    // Registry Forms
    this.classSelect = document.getElementById('ep2-class-select');
    this.excludeCheck = document.getElementById('ep2-flag-exclude');
    this.injectBtn = document.getElementById('ep2-btn-inject');
    this.timerSpan = document.getElementById('ep2-bypass-timer');
    
    // Bindings
    this.handleInject = this.handleInject.bind(this);
    
    this.phase = 1; // 1 = Runner patch, 2 = DB Hack
    this.loopId = null;
  }

  start() {
    this.phase = 1;
    this.integrity = 100;
    this.integritySpan.innerText = "100%";
    
    this.phase1Panel.style.display = "flex";
    this.phase2Panel.style.display = "none";
    
    this.classSelect.value = "NPC";
    this.excludeCheck.checked = false;
    this.injectBtn.addEventListener('click', this.handleInject);
    
    // Setup Phase 1: Puzzle grid tracks
    this.setupTracks();
    
    // Truck properties
    this.truckX = 50;
    this.truckY = 100;
    this.wheelRotation = 0;
    
    // Gaps logic
    this.gaps = []; // X offsets
    this.gapSpawnTimer = 0;
    this.roadOffset = 0;
    this.isGlitching = false;
    
    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    this.injectBtn.removeEventListener('click', this.handleInject);
    if (this.hackTimerId) clearInterval(this.hackTimerId);
  }

  setupTracks() {
    this.puzzleGrid.innerHTML = "";
    this.tracks = [];
    
    for (let i = 0; i < 4; i++) {
      const trackEl = document.createElement('div');
      trackEl.className = "puzzle-track";
      trackEl.setAttribute('data-track', i);
      
      const targetZone = document.createElement('div');
      targetZone.className = "puzzle-target-zone";
      
      const block = document.createElement('div');
      block.className = "puzzle-block";
      
      trackEl.appendChild(targetZone);
      trackEl.appendChild(block);
      this.puzzleGrid.appendChild(trackEl);
      
      // Track State
      const trackState = {
        element: trackEl,
        blockEl: block,
        blockY: 0,
        speed: 100 + Math.random() * 80,
        patched: false,
        targetYStart: 80,
        targetYEnd: 100
      };
      
      this.tracks.push(trackState);

      // Event listener to patch track
      trackEl.addEventListener('click', () => {
        if (trackState.patched) return;
        
        SoundManager.playClick();
        
        // Check if block is inside target zone
        if (trackState.blockY >= trackState.targetYStart && trackState.blockY <= trackState.targetYEnd) {
          trackState.patched = true;
          trackEl.classList.add('patched');
          SoundManager.playBeep();
          
          // Check if all tracks patched
          if (this.tracks.every(t => t.patched)) {
            setTimeout(() => this.initiatePhase2(), 1000);
          }
        } else {
          // Missed click penalty
          this.integrity = Math.max(0, this.integrity - 15);
          this.integritySpan.innerText = `${this.integrity}%`;
          this.isGlitching = true;
          SoundManager.playError();
          setTimeout(() => this.isGlitching = false, 200);
          
          if (this.integrity <= 0) {
            EpisodeManager.gameOver("Le camion-citerne s'est écrasé suite à l'effondrement de la route.");
          }
        }
      });
    }
  }

  update(dt) {
    if (this.phase === 1) {
      // Move puzzle blocks
      this.tracks.forEach(track => {
        if (track.patched) {
          track.blockY = 90; // Lock in center
          track.blockEl.style.top = `${track.blockY}px`;
          return;
        }
        
        track.blockY += track.speed * dt;
        if (track.blockY > 120) {
          track.blockY = 0; // Loop
          track.speed = 100 + Math.random() * 80;
        }
        track.blockEl.style.top = `${track.blockY}px`;
      });

      // Move road
      this.roadOffset -= 150 * dt;
      if (this.roadOffset < -40) this.roadOffset = 0;
      
      this.wheelRotation += 10 * dt;

      // Spawn gap/glitches on road if not all patched
      this.gapSpawnTimer += dt;
      if (this.gapSpawnTimer > 2.0 && !this.tracks.every(t => t.patched)) {
        this.gapSpawnTimer = 0;
        // Trigger small obstacle collision check
        const unpatched = this.tracks.filter(t => !t.patched).length;
        if (Math.random() < unpatched * 0.25) {
          this.integrity = Math.max(0, this.integrity - 10);
          this.integritySpan.innerText = `${this.integrity}%`;
          this.isGlitching = true;
          SoundManager.playGlitch();
          setTimeout(() => this.isGlitching = false, 200);
          
          if (this.integrity <= 0) {
            EpisodeManager.gameOver("Le camion s'est brisé dans le vide d'une erreur de collision.");
          }
        }
      }
    }
  }

  draw() {
    this.ctx.fillStyle = this.isGlitching ? '#3f0c0c' : '#08080c';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.phase === 1) {
      // Draw grid background line
      this.ctx.strokeStyle = '#15152a';
      this.ctx.beginPath();
      for (let i = 0; i < this.canvas.width; i += 20) {
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, this.canvas.height);
      }
      this.ctx.stroke();

      // Draw road (Canyon Bridge)
      this.ctx.fillStyle = '#221122';
      this.ctx.fillRect(0, 115, this.canvas.width, 35);
      
      // Draw Candies on bridge (dotted pink/yellow)
      this.ctx.fillStyle = '#ff88aa';
      for (let i = 0; i < this.canvas.width + 40; i += 40) {
        this.ctx.fillRect(i + (this.roadOffset % 40), 115, 20, 4);
      }
      
      // Draw Truck (Syrup Tanker)
      const tx = this.truckX;
      const ty = this.truckY;
      
      // Tank (Grey capsule)
      this.ctx.fillStyle = '#888899';
      this.ctx.fillRect(tx - 30, ty - 25, 60, 25);
      this.ctx.fillStyle = '#ff9900'; // Syrup logo
      this.ctx.fillRect(tx - 15, ty - 20, 30, 15);
      
      // Cab (Red box)
      this.ctx.fillStyle = '#cc2222';
      this.ctx.fillRect(tx + 30, ty - 20, 20, 20);
      this.ctx.fillStyle = '#00ffff'; // Window
      this.ctx.fillRect(tx + 40, ty - 17, 8, 8);
      
      // Wheels (black circles)
      this.ctx.fillStyle = '#111';
      this.ctx.beginPath();
      this.ctx.arc(tx - 20, ty + 2, 8, 0, Math.PI*2);
      this.ctx.arc(tx + 10, ty + 2, 8, 0, Math.PI*2);
      this.ctx.arc(tx + 40, ty + 2, 8, 0, Math.PI*2);
      this.ctx.fill();

      // Draw small Jester Hat on truck (Pomni)
      this.ctx.fillStyle = '#0044cc';
      this.ctx.fillRect(tx - 10, ty - 32, 6, 7);
      this.ctx.fillStyle = '#cc0022';
      this.ctx.fillRect(tx - 4, ty - 32, 6, 7);

      // Draw Crocodile skin on truck top (Gummigoo)
      this.ctx.fillStyle = '#33aa33';
      this.ctx.fillRect(tx - 25, ty - 30, 8, 5);

      // Draw glitch particles if glitching
      if (this.isGlitching) {
        this.ctx.fillStyle = '#ff00ff';
        for (let j = 0; j < 8; j++) {
          this.ctx.fillRect(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 6, 6);
        }
      }
    }
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.update(dt);
    this.draw();

    this.loopId = requestAnimationFrame(() => this.loop());
  }

  initiatePhase2() {
    this.phase = 2;
    this.phase1Panel.style.display = "none";
    this.phase2Panel.style.display = "flex";
    SoundManager.playGlitch();

    // Setup Hack Timer (30s)
    this.timeLeft = 30;
    this.timerSpan.innerText = `${this.timeLeft}s`;
    
    // Setup Memory Dump view
    this.setupMemoryDump();

    this.hackTimerId = setInterval(() => {
      this.timeLeft--;
      this.timerSpan.innerText = `${this.timeLeft}s`;
      
      // Update memory dump with some blinking values
      this.updateMemoryDump();

      if (this.timeLeft <= 0) {
        clearInterval(this.hackTimerId);
        // Fail: Gummigoo deleted
        EpisodeManager.gameOver("Temps écoulé. Caine a exécuté auto_cleanup.exe et a effacé Gummigoo.");
      }
    }, 1000);
  }

  setupMemoryDump() {
    this.firewallBypassed = false;
    this.nodeToClick = Math.floor(Math.random() * 8);
    this.renderMemoryHTML();
  }

  renderMemoryHTML() {
    let html = "ADDR     HEX DUMP              ASCII<br>";
    for (let i = 0; i < 8; i++) {
      const addr = (0x7F2A90 + i * 8).toString(16).toUpperCase();
      let hex = "";
      let ascii = "";
      
      for (let j = 0; j < 8; j++) {
        const val = Math.floor(Math.random() * 256);
        hex += val.toString(16).padStart(2, '0') + " ";
        ascii += val >= 32 && val <= 126 ? String.fromCharCode(val) : ".";
      }

      if (i === this.nodeToClick && !this.firewallBypassed) {
        // Red flashing node to bypass firewall
        html += `<span class="red-text blinking" id="db-bypass-node" style="cursor:pointer; font-weight:bold;">${addr}  ${hex}  ${ascii} [FIREWALL_LOCK]</span><br>`;
      } else {
        html += `${addr}  ${hex}  ${ascii}<br>`;
      }
    }
    this.memoryDump.innerHTML = html;

    // Attach click to bypass node
    const node = document.getElementById('db-bypass-node');
    if (node) {
      node.addEventListener('click', () => {
        SoundManager.playBeep();
        this.firewallBypassed = true;
        this.memoryDump.innerHTML = this.memoryDump.innerHTML.replace('[FIREWALL_LOCK]', '[BYPASS_OK]');
        node.className = "green-text";
        node.style.cursor = "default";
      });
    }
  }

  updateMemoryDump() {
    if (!this.firewallBypassed) {
      this.renderMemoryHTML();
    } else {
      // Just flicker normal values
      let html = "ADDR     HEX DUMP              ASCII<br>";
      for (let i = 0; i < 8; i++) {
        const addr = (0x7F2A90 + i * 8).toString(16).toUpperCase();
        let hex = "";
        let ascii = "";
        for (let j = 0; j < 8; j++) {
          const val = Math.floor(Math.random() * 256);
          hex += val.toString(16).padStart(2, '0') + " ";
          ascii += val >= 32 && val <= 126 ? String.fromCharCode(val) : ".";
        }
        if (i === this.nodeToClick) {
          html += `<span class="green-text">${addr}  ${hex}  ${ascii} [BYPASS_OK]</span><br>`;
        } else {
          html += `${addr}  ${hex}  ${ascii}<br>`;
        }
      }
      this.memoryDump.innerHTML = html;
    }
  }

  handleInject() {
    if (!this.firewallBypassed) {
      SoundManager.playError();
      alert("ERREUR: Le pare-feu Caine bloque l'écriture mémoire. Cliquez sur le nœud verrouillé (FIREWALL_LOCK) dans le dump.");
      return;
    }

    const klass = this.classSelect.value;
    const exclude = this.excludeCheck.checked;

    if (klass === "HUMAN" && exclude) {
      clearInterval(this.hackTimerId);
      EpisodeManager.gameWon("Patch CainOS injecte : les variables de Gummigoo sont stabilisees quelques secondes, mais Caine reprend le controle du scan NPC au retour du convoi.");
    } else {
      SoundManager.playError();
      alert("ERREUR CONFIGURATION: Les valeurs ne masquent pas l'entité. Assurez-vous que la classe soit configurée sur HUMAN et le drapeau d'exclusion soit coché !");
    }
  }
}


/* ==========================================================================
   EPISODE 3: THE DARK DESCENT GAME (Sonar Horror)
   ========================================================================== */

class Episode3Game {
  constructor() {
    this.canvas = document.getElementById('ep3-sonar-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.noiseSpan = document.getElementById('ep3-noise');
    
    // Buttons
    this.lightBtn = document.getElementById('ep3-btn-flashlight');
    this.decoyBtn = document.getElementById('ep3-btn-decoy');
    this.shotgunBtn = document.getElementById('ep3-btn-shotgun');
    
    this.handleFlashlight = this.handleFlashlight.bind(this);
    this.handleDecoy = this.handleDecoy.bind(this);
    this.handleShotgun = this.handleShotgun.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    
    this.loopId = null;
    this.mapWidth = 340;
    this.mapHeight = 280;
  }

  resetState() {
    this.player = { x: 40, y: 50, radius: 6, speed: 60 };
    this.beast = { x: 300, y: 240, radius: 8, speed: 45, state: 'patrol', targetX: 300, targetY: 240, patrolTimer: 0 };
    this.exit = { x: 310, y: 140, radius: 10 };
    this.key = { x: 170, y: 220, radius: 5, collected: false };
    
    // Barricade blocking exit
    this.barrier = { x: 260, y: 110, w: 15, h: 60, destroyed: false };
    
    this.flashlight = false;
    this.decoy = null; // {x, y, timer}
    
    // Sonic waves
    this.sonarCircle = { r: 0, maxR: 200, active: true };
    this.noiseLevel = 0; // dB
    
    // Maze Walls (Array of Rects)
    this.walls = [
      { x: 0, y: 0, w: 340, h: 10 },
      { x: 0, y: 270, w: 340, h: 10 },
      { x: 0, y: 0, w: 10, h: 280 },
      { x: 330, y: 0, w: 10, h: 280 },
      
      // Internal maze
      { x: 90, y: 10, w: 15, h: 120 },
      { x: 90, y: 180, w: 15, h: 100 },
      { x: 180, y: 60, w: 15, h: 140 },
      { x: 250, y: 10, w: 15, h: 100 },
      { x: 250, y: 170, w: 15, h: 110 },
    ];
    
    this.keysPressed = {};
    
    // Bind Key events
    this.handleKeyDown = (e) => { this.keysPressed[e.key] = true; };
    this.handleKeyUp = (e) => { this.keysPressed[e.key] = false; };
  }

  start() {
    this.resetState();
    
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    this.lightBtn.addEventListener('click', this.handleFlashlight);
    this.decoyBtn.addEventListener('click', this.handleDecoy);
    this.shotgunBtn.addEventListener('click', this.handleShotgun);
    this.canvas.addEventListener('click', this.handleCanvasClick);
    
    this.lightBtn.innerText = "LAMPE TORCHE (OFF)";
    this.decoyBtn.disabled = false;
    this.shotgunBtn.disabled = false;
    
    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    
    this.lightBtn.removeEventListener('click', this.handleFlashlight);
    this.decoyBtn.removeEventListener('click', this.handleDecoy);
    this.shotgunBtn.removeEventListener('click', this.handleShotgun);
    this.canvas.removeEventListener('click', this.handleCanvasClick);
  }

  handleFlashlight() {
    SoundManager.playClick();
    this.flashlight = !this.flashlight;
    this.lightBtn.innerText = this.flashlight ? "LAMPE TORCHE (ON)" : "LAMPE TORCHE (OFF)";
    if (this.flashlight) {
      this.lightBtn.classList.add('btn-primary-retro');
    } else {
      this.lightBtn.classList.remove('btn-primary-retro');
    }
  }

  handleDecoy() {
    SoundManager.playClick();
    alert("Cliquez sur la carte du sonar pour déployer le leurre sonore.");
    this.placingDecoy = true;
  }

  handleCanvasClick(e) {
    if (this.placingDecoy) {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      
      SoundManager.playBeep();
      this.decoy = { x: clickX, y: clickY, life: 3.5 };
      this.noiseLevel = 80;
      this.beast.state = 'alert';
      this.beast.targetX = clickX;
      this.beast.targetY = clickY;
      this.placingDecoy = false;
    }
  }

  handleShotgun() {
    SoundManager.playExplosion();
    this.noiseLevel = 120;
    this.noiseSpan.innerText = "EXPLOSION (120 dB)";
    
    // Check if player is close to barrier
    let dx = this.player.x - (this.barrier.x + this.barrier.w/2);
    let dy = this.player.y - (this.barrier.y + this.barrier.h/2);
    let dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist < 60 && !this.barrier.destroyed) {
      this.barrier.destroyed = true;
      this.walls = this.walls.filter(w => w !== this.barrier);
      alert("Le fusil de Kinger a détruit la barrière de débris ! La bête entre en fureur !");
    } else {
      alert("Coup de feu dans le vide ! Le bruit a alerté la bête !");
    }
    
    // Beast enters rage
    this.beast.state = 'chase';
    this.beast.speed = 85;
    this.beast.targetX = this.player.x;
    this.beast.targetY = this.player.y;
    
    // Cool down
    this.shotgunBtn.disabled = true;
    setTimeout(() => { this.shotgunBtn.disabled = false; }, 8000);
  }

  collidesWithWalls(x, y, radius) {
    for (let w of this.walls) {
      let closestX = Math.max(w.x, Math.min(x, w.x + w.w));
      let closestY = Math.max(w.y, Math.min(y, w.y + w.h));
      let dx = x - closestX;
      let dy = y - closestY;
      if (dx*dx + dy*dy < radius*radius) {
        return true;
      }
    }
    
    // Check barrier if not destroyed
    if (!this.barrier.destroyed) {
      let w = this.barrier;
      let closestX = Math.max(w.x, Math.min(x, w.x + w.w));
      let closestY = Math.max(w.y, Math.min(y, w.y + w.h));
      let dx = x - closestX;
      let dy = y - closestY;
      if (dx*dx + dy*dy < radius*radius) {
        return true;
      }
    }

    return false;
  }

  update(dt) {
    // 1. Move Player based on keyboard
    let dx = 0;
    let dy = 0;
    
    if (this.keysPressed['ArrowUp'] || this.keysPressed['z'] || this.keysPressed['w']) dy = -1;
    if (this.keysPressed['ArrowDown'] || this.keysPressed['s']) dy = 1;
    if (this.keysPressed['ArrowLeft'] || this.keysPressed['q'] || this.keysPressed['a']) dx = -1;
    if (this.keysPressed['ArrowRight'] || this.keysPressed['d']) dx = 1;

    if (dx !== 0 || dy !== 0) {
      // Normalize
      let len = Math.sqrt(dx*dx + dy*dy);
      dx /= len;
      dy /= len;

      let speed = this.player.speed * dt;
      let nextX = this.player.x + dx * speed;
      let nextY = this.player.y + dy * speed;

      if (!this.collidesWithWalls(nextX, this.player.y, this.player.radius)) {
        this.player.x = nextX;
      }
      if (!this.collidesWithWalls(this.player.x, nextY, this.player.radius)) {
        this.player.y = nextY;
      }

      this.noiseLevel = Math.max(this.noiseLevel, 35); // Footstep noise
    } else {
      this.noiseLevel = Math.max(0, this.noiseLevel - dt * 25);
    }

    // Flashlight draws beast attention if line of sight
    if (this.flashlight) {
      this.noiseLevel = Math.max(this.noiseLevel, 20); // light hum
      
      // Beast detects light if within range and not blocked
      let bdx = this.player.x - this.beast.x;
      let bdy = this.player.y - this.beast.y;
      let dist = Math.sqrt(bdx*bdx + bdy*bdy);
      if (dist < 120) {
        this.beast.state = 'chase';
        this.beast.targetX = this.player.x;
        this.beast.targetY = this.player.y;
      }
    }

    // 2. Decoy life timer
    if (this.decoy) {
      this.decoy.life -= dt;
      if (this.decoy.life <= 0) {
        this.decoy = null;
        this.beast.state = 'patrol';
      }
    }

    // 3. Move Beast AI
    let bdx = this.beast.targetX - this.beast.x;
    let bdy = this.beast.targetY - this.beast.y;
    let bdist = Math.sqrt(bdx*bdx + bdy*bdy);

    if (bdist > 5) {
      let bSpeed = this.beast.speed * dt;
      this.beast.x += (bdx / bdist) * bSpeed;
      this.beast.y += (bdy / bdist) * bSpeed;
    } else {
      // Reached target
      if (this.beast.state === 'patrol') {
        this.beast.patrolTimer += dt;
        if (this.beast.patrolTimer > 2.0) {
          this.beast.patrolTimer = 0;
          // Set new patrol node
          this.beast.targetX = 50 + Math.random() * 240;
          this.beast.targetY = 50 + Math.random() * 180;
        }
      } else if (this.beast.state === 'alert') {
        // Alert state ends
        this.beast.state = 'patrol';
        this.beast.speed = 45;
      } else if (this.beast.state === 'chase') {
        // If lost player, wander
        this.beast.state = 'patrol';
        this.beast.speed = 45;
      }
    }

    // If player makes noise, Beast intercepts coordinates
    if (this.noiseLevel > 40 && this.beast.state !== 'chase') {
      let dist = Math.sqrt((this.player.x-this.beast.x)**2 + (this.player.y-this.beast.y)**2);
      if (dist < this.noiseLevel * 2) {
        this.beast.state = 'alert';
        this.beast.targetX = this.player.x;
        this.beast.targetY = this.player.y;
        this.beast.speed = 65;
      }
    }

    // Sonar sweep simulation
    if (this.sonarCircle.active) {
      this.sonarCircle.r += 120 * dt;
      if (this.sonarCircle.r > this.sonarCircle.maxR) {
        this.sonarCircle.r = 0;
        SoundManager.playGlitch(); // Sonar ping beep
      }
    }

    // Key Collection
    let kdx = this.player.x - this.key.x;
    let kdy = this.player.y - this.key.y;
    if (Math.sqrt(kdx*kdx + kdy*kdy) < 12 && !this.key.collected) {
      this.key.collected = true;
      SoundManager.playWin();
      alert("Clé du sous-sol ramassée ! Trouvez la trappe de sortie bloquée par la barrière.");
    }

    // Win check
    let edx = this.player.x - this.exit.x;
    let edy = this.player.y - this.exit.y;
    if (Math.sqrt(edx*edx + edy*edy) < 15) {
      if (this.key.collected) {
        EpisodeManager.gameWon("Kinger et Pomni s'échappent du sous-sol par la trappe ! Kinger retrouve un moment de lucidité pour remercier le terminal.");
      } else {
        this.noiseLevel = 60; // banging door
        alert("La trappe de sortie est verrouillée ! Il faut trouver la clé.");
        this.player.x -= 15; // push back
      }
    }

    // Lose Check: Beast catches player
    let pdx = this.player.x - this.beast.x;
    let pdy = this.player.y - this.beast.y;
    if (Math.sqrt(pdx*pdx + pdy*pdy) < 12) {
      EpisodeManager.gameOver("Kinger et Pomni ont été capturés par l'entité du Manoir Mildenhall.");
    }

    // UI Updates
    this.noiseSpan.innerText = `${Math.round(this.noiseLevel)} dB`;
    if (this.noiseLevel > 70) {
      this.noiseSpan.className = "red-text blinking";
    } else if (this.noiseLevel > 30) {
      this.noiseSpan.className = "orange-text";
    } else {
      this.noiseSpan.className = "green-text";
    }
  }

  draw() {
    this.ctx.fillStyle = '#020402';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Sonar Sweep drawing
    this.ctx.strokeStyle = `rgba(0, 255, 0, ${1 - this.sonarCircle.r / this.sonarCircle.maxR})`;
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, this.sonarCircle.r, 0, Math.PI*2);
    this.ctx.stroke();

    // Draw walls if revealed by flashlight or sonar sweep
    this.walls.forEach(w => {
      let isVisible = false;
      
      // Flashlight visibility
      if (this.flashlight) {
        let dx = (w.x + w.w/2) - this.player.x;
        let dy = (w.y + w.h/2) - this.player.y;
        if (Math.sqrt(dx*dx + dy*dy) < 80) isVisible = true;
      }
      
      // Sonar visibility
      let dx = (w.x + w.w/2) - this.player.x;
      let dy = (w.y + w.h/2) - this.player.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (Math.abs(dist - this.sonarCircle.r) < 15) {
        isVisible = true;
      }

      if (isVisible) {
        this.ctx.fillStyle = '#102e16';
        this.ctx.fillRect(w.x, w.y, w.w, w.h);
        this.ctx.strokeStyle = '#2dff5c';
        this.ctx.strokeRect(w.x, w.y, w.w, w.h);
      } else {
        // Ghostly outlines
        this.ctx.strokeStyle = '#051208';
        this.ctx.strokeRect(w.x, w.y, w.w, w.h);
      }
    });

    // Draw Barrier
    if (!this.barrier.destroyed) {
      let revealBarrier = false;
      let dx = (this.barrier.x + this.barrier.w/2) - this.player.x;
      let dy = (this.barrier.y + this.barrier.h/2) - this.player.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      
      if (this.flashlight && dist < 85) revealBarrier = true;
      if (Math.abs(dist - this.sonarCircle.r) < 20) revealBarrier = true;

      this.ctx.fillStyle = revealBarrier ? '#8c2222' : '#330808';
      this.ctx.fillRect(this.barrier.x, this.barrier.y, this.barrier.w, this.barrier.h);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '7px monospace';
      this.ctx.fillText("DEBRIS", this.barrier.x + 1, this.barrier.y + 20);
    }

    // Draw Exit Hatch
    let revealExit = false;
    let edx = this.exit.x - this.player.x;
    let edy = this.exit.y - this.player.y;
    let edist = Math.sqrt(edx*edx + edy*edy);
    if (this.flashlight && edist < 100) revealExit = true;
    if (Math.abs(edist - this.sonarCircle.r) < 20) revealExit = true;
    
    if (revealExit) {
      this.ctx.fillStyle = '#aa8822';
      this.ctx.beginPath();
      this.ctx.arc(this.exit.x, this.exit.y, this.exit.radius, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.fillStyle = '#000';
      this.ctx.font = 'bold 8px monospace';
      this.ctx.fillText("HATCH", this.exit.x - 12, this.exit.y + 3);
    }

    // Draw Key
    if (!this.key.collected) {
      let revealKey = false;
      let kdx = this.key.x - this.player.x;
      let kdy = this.key.y - this.player.y;
      let kdist = Math.sqrt(kdx*kdx + kdy*kdy);
      if (this.flashlight && kdist < 80) revealKey = true;
      if (Math.abs(kdist - this.sonarCircle.r) < 20) revealKey = true;
      
      if (revealKey) {
        this.ctx.fillStyle = '#00ffff';
        this.ctx.beginPath();
        this.ctx.arc(this.key.x, this.key.y, this.key.radius, 0, Math.PI*2);
        this.ctx.fill();
      }
    }

    // Draw Decoy if active
    if (this.decoy) {
      this.ctx.strokeStyle = '#ffff00';
      this.ctx.beginPath();
      this.ctx.arc(this.decoy.x, this.decoy.y, (1 - this.decoy.life / 3.5) * 80, 0, Math.PI*2);
      this.ctx.stroke();
      
      this.ctx.fillStyle = '#ffff00';
      this.ctx.fillRect(this.decoy.x - 3, this.decoy.y - 3, 6, 6);
    }

    // Draw Beast (Red Dot) - ONLY visible on sonar sweep radius, flashlight cone, or if very close
    let bdx = this.beast.x - this.player.x;
    let bdy = this.beast.y - this.player.y;
    let bdist = Math.sqrt(bdx*bdx + bdy*bdy);
    
    let beastVisible = false;
    if (bdist < 30) beastVisible = true;
    if (this.flashlight && bdist < 90) beastVisible = true;
    if (Math.abs(bdist - this.sonarCircle.r) < 15) beastVisible = true;

    if (beastVisible) {
      this.ctx.fillStyle = '#ff0033';
      this.ctx.beginPath();
      this.ctx.arc(this.beast.x, this.beast.y, this.beast.radius, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 9px monospace';
      this.ctx.fillText("B", this.beast.x - 3, this.beast.y + 3);
    }

    // Draw Players (Kinger & Pomni combo)
    this.ctx.fillStyle = '#ffffaa';
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI*2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 8px sans-serif';
    this.ctx.fillText("K", this.player.x - 3, this.player.y + 3);
  }
}


/* ==========================================================================
   EPISODE 4: GLOINK ASSEMBLY GAME (OBSOLETE)
   ========================================================================== */

class Episode4ObsoleteGame {
  constructor() {
    this.canvas = document.getElementById('ep4-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById('ep4-score');
    this.timerSpan = document.getElementById('ep4-timer');
    this.resetBtn = document.getElementById('ep4-btn-reset');
    
    this.resetState();
    
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  resetState() {
    this.timeLeft = 45;
    this.timerId = null;
    this.loopId = null;
    
    this.targetCenter = { x: 175, y: 140 };
    
    // Zooble parts definition
    this.parts = [
      {
        id: 'head',
        name: 'Tête Triangle',
        color: '#ff44aa',
        x: 40, y: 55,
        spawnX: 40, spawnY: 55,
        targetX: 175, targetY: 75,
        w: 24, h: 24,
        assembled: false,
        shape: 'triangle'
      },
      {
        id: 'body',
        name: 'Corps Rect',
        color: '#ffaa00',
        x: 50, y: 200,
        spawnX: 50, spawnY: 200,
        targetX: 175, targetY: 130,
        w: 32, h: 48,
        assembled: false,
        shape: 'rect'
      },
      {
        id: 'wing',
        name: 'Aile Bleue',
        color: '#3388ff',
        x: 290, y: 60,
        spawnX: 290, spawnY: 60,
        targetX: 135, targetY: 130,
        w: 30, h: 36,
        assembled: false,
        shape: 'wing'
      },
      {
        id: 'leg',
        name: 'Pied Crochet',
        color: '#ccdd00',
        x: 280, y: 210,
        spawnX: 280, spawnY: 210,
        targetX: 175, targetY: 190,
        w: 20, h: 30,
        assembled: false,
        shape: 'hook'
      }
    ];
    
    this.draggedPart = null;
    this.dragOffset = { x: 0, y: 0 };
    
    // Gloinks definition
    this.gloinks = [
      { x: -20, y: 80, speed: 45, targetIdx: 0, isCarrying: false, isSquashed: false, respawnT: 0, width: 22, height: 16 },
      { x: 370, y: 150, speed: 50, targetIdx: 1, isCarrying: false, isSquashed: false, respawnT: 0, width: 22, height: 16 },
      { x: 100, y: -20, speed: 38, targetIdx: 2, isCarrying: false, isSquashed: false, respawnT: 0, width: 22, height: 16 },
      { x: 250, y: 300, speed: 42, targetIdx: 3, isCarrying: false, isSquashed: false, respawnT: 0, width: 22, height: 16 }
    ];
    
    this.score = 0;
    this.scoreSpan.innerText = "0 / 4";
    this.timerSpan.innerText = "45s";
  }

  start() {
    this.resetState();
    
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.resetBtn.addEventListener('click', this.handleReset);
    
    // Setup timer
    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.timerSpan.innerText = `${this.timeLeft}s`;
      if (this.timeLeft <= 0) {
        EpisodeManager.gameOver("Temps écoulé. Zooble est restée inachevée et a été mangée par les Gloinks.");
      }
    }, 1000);
    
    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    if (this.timerId) clearInterval(this.timerId);
    
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.resetBtn.removeEventListener('click', this.handleReset);
  }

  handleReset() {
    SoundManager.playClick();
    this.parts.forEach(p => {
      if (!p.assembled) {
        p.x = p.spawnX;
        p.y = p.spawnY;
      }
    });
    // Release any carrying gloinks
    this.gloinks.forEach(g => {
      g.isCarrying = false;
    });
  }

  isHit(px, py, part) {
    // Check if point px, py is inside bounding box of part
    const hw = part.w / 2;
    const hh = part.h / 2;
    return (px >= part.x - hw && px <= part.x + hw && py >= part.y - hh && py <= part.y + hh);
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    
    // 1. Check if clicked on a Gloink to squash it
    for (let i = 0; i < this.gloinks.length; i++) {
      const g = this.gloinks[i];
      if (!g.isSquashed) {
        let dx = clickX - g.x;
        let dy = clickY - g.y;
        if (Math.sqrt(dx*dx + dy*dy) < 18) {
          SoundManager.playExplosion();
          g.isSquashed = true;
          g.respawnT = 4.0; // 4 seconds dead time
          if (g.isCarrying) {
            g.isCarrying = false;
            // Let the piece rest here
          }
          return;
        }
      }
    }
    
    // 2. Check if clicked on a modular part (draggable)
    // Check top layer first (reverse order)
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      if (!p.assembled && this.isHit(clickX, clickY, p)) {
        SoundManager.playClick();
        this.draggedPart = p;
        this.dragOffset.x = clickX - p.x;
        this.dragOffset.y = clickY - p.y;
        
        // Remove from carrying gloink
        this.gloinks.forEach(g => {
          if (g.targetIdx === i) g.isCarrying = false;
        });
        break;
      }
    }
  }

  handleMouseMove(e) {
    if (this.draggedPart) {
      const rect = this.canvas.getBoundingClientRect();
      const mX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const mY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      
      this.draggedPart.x = Math.max(10, Math.min(this.canvas.width - 10, mX - this.dragOffset.x));
      this.draggedPart.y = Math.max(10, Math.min(this.canvas.height - 10, mY - this.dragOffset.y));
    }
  }

  handleMouseUp(e) {
    if (this.draggedPart) {
      SoundManager.playClick();
      
      // Check snap to silhouette slot
      const p = this.draggedPart;
      let dx = p.x - p.targetX;
      let dy = p.y - p.targetY;
      let dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 22) {
        // Snap!
        p.x = p.targetX;
        p.y = p.targetY;
        p.assembled = true;
        SoundManager.playWin();
        
        this.score++;
        this.scoreSpan.innerText = `${this.score} / 4`;
        
        // Check victory
        if (this.score === 4) {
          EpisodeManager.gameWon("Zooble est entièrement réassemblée ! Elle pousse un soupir d'agacement face à son modèle absurde et quitte l'arène.");
        }
      }
      this.draggedPart = null;
    }
  }

  update(dt) {
    // 1. Move Gloinks AI
    this.gloinks.forEach((g, idx) => {
      if (g.isSquashed) {
        g.respawnT -= dt;
        if (g.respawnT <= 0) {
          g.isSquashed = false;
          // Respawn at a random edge
          const side = Math.floor(Math.random() * 4);
          if (side === 0) { g.x = -20; g.y = Math.random() * 280; }
          else if (side === 1) { g.x = 370; g.y = Math.random() * 280; }
          else if (side === 2) { g.x = Math.random() * 350; g.y = -20; }
          else { g.x = Math.random() * 350; g.y = 300; }
          
          // Re-target random unassembled part
          let unassembled = this.parts.filter(p => !p.assembled);
          if (unassembled.length > 0) {
            let pRand = unassembled[Math.floor(Math.random() * unassembled.length)];
            g.targetIdx = this.parts.indexOf(pRand);
          }
        }
        return;
      }
      
      const targetPart = this.parts[g.targetIdx];
      
      if (targetPart.assembled) {
        // Find another unassembled part
        let unassembled = this.parts.filter(p => !p.assembled);
        if (unassembled.length > 0) {
          let pRand = unassembled[Math.floor(Math.random() * unassembled.length)];
          g.targetIdx = this.parts.indexOf(pRand);
        } else {
          // No parts left to steal, just wander out of boundaries
          g.x += g.speed * dt;
          return;
        }
      }
      
      if (!g.isCarrying) {
        // Move towards target part
        let dx = targetPart.x - g.x;
        let dy = targetPart.y - g.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 5) {
          g.x += (dx / dist) * g.speed * dt;
          g.y += (dy / dist) * g.speed * dt;
        } else {
          // Touch! Start stealing it
          g.isCarrying = true;
          SoundManager.playGlitch();
        }
      } else {
        // Carrying part towards nearest edge
        let edgeX = g.x < 175 ? -30 : 380;
        let edgeY = g.y;
        let dx = edgeX - g.x;
        let dy = 0;
        let dist = Math.abs(dx);
        
        if (dist > 5) {
          let mx = (dx / dist) * g.speed * 0.9 * dt;
          g.x += mx;
          // Drag the part with it!
          targetPart.x = g.x;
          targetPart.y = g.y;
        } else {
          // Reached boundary, drop piece and reset it
          g.isCarrying = false;
          targetPart.x = targetPart.spawnX;
          targetPart.y = targetPart.spawnY;
          SoundManager.playError();
          
          // Re-spawn Gloink at another edge
          g.x = g.x < 175 ? 380 : -30;
          g.y = Math.random() * 280;
        }
      }
    });
  }

  draw() {
    this.ctx.fillStyle = '#0a0d14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid wires
    this.ctx.strokeStyle = '#181b28';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.canvas.width; i += 25) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
    }
    for (let j = 0; j < this.canvas.height; j += 25) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, j);
      this.ctx.lineTo(this.canvas.width, j);
      this.ctx.stroke();
    }

    // Draw Zooble Blueprint Silhouette in center
    const cx = this.targetCenter.x;
    const cy = this.targetCenter.y;
    
    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([4, 4]);
    
    // Head slot (triangle)
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - 80);
    this.ctx.lineTo(cx - 15, cy - 55);
    this.ctx.lineTo(cx + 15, cy - 55);
    this.ctx.closePath();
    this.ctx.stroke();
    
    // Body slot (rect)
    this.ctx.strokeRect(cx - 16, cy - 50, 32, 48);
    
    // Wing slot (left)
    this.ctx.beginPath();
    this.ctx.arc(cx - 28, cy - 26, 12, 0, Math.PI*2);
    this.ctx.stroke();
    
    // Leg slot (bottom hook)
    this.ctx.strokeRect(cx - 5, cy + 2, 10, 22);
    
    this.ctx.setLineDash([]); // clear dash

    // Draw unassembled parts
    this.parts.forEach(p => {
      if (p.assembled) return;
      
      this.ctx.fillStyle = p.color;
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 1.5;

      const px = p.x;
      const py = p.y;
      const hw = p.w / 2;
      const hh = p.h / 2;

      if (p.shape === 'triangle') {
        this.ctx.beginPath();
        this.ctx.moveTo(px, py - hh);
        this.ctx.lineTo(px - hw, py + hh);
        this.ctx.lineTo(px + hw, py + hh);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      } else if (p.shape === 'rect') {
        this.ctx.fillRect(px - hw, py - hh, p.w, p.h);
        this.ctx.strokeRect(px - hw, py - hh, p.w, p.h);
      } else if (p.shape === 'wing') {
        // Wing shape (butterfly-like)
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, hw, hh, Math.PI/4, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.stroke();
      } else if (p.shape === 'hook') {
        this.ctx.fillRect(px - hw, py - hh, p.w, p.h - 10);
        this.ctx.strokeRect(px - hw, py - hh, p.w, p.h - 10);
        // Hook foot
        this.ctx.fillRect(px - hw, py + hh - 12, p.w + 10, 8);
      }
    });

    // Draw assembled parts (on blueprint in color, solid line)
    this.parts.forEach(p => {
      if (!p.assembled) return;

      this.ctx.fillStyle = p.color;
      this.ctx.strokeStyle = '#00ffcc';
      this.ctx.lineWidth = 2;

      const px = p.targetX;
      const py = p.targetY;
      const hw = p.w / 2;
      const hh = p.h / 2;

      if (p.shape === 'triangle') {
        this.ctx.beginPath();
        this.ctx.moveTo(px, py - hh);
        this.ctx.lineTo(px - hw, py + hh);
        this.ctx.lineTo(px + hw, py + hh);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      } else if (p.shape === 'rect') {
        this.ctx.fillRect(px - hw, py - hh, p.w, p.h);
        this.ctx.strokeRect(px - hw, py - hh, p.w, p.h);
      } else if (p.shape === 'wing') {
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, hw, hh, Math.PI/4, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.stroke();
      } else if (p.shape === 'hook') {
        this.ctx.fillRect(px - hw, py - hh, p.w, p.h - 10);
        this.ctx.strokeRect(px - hw, py - hh, p.w, p.h - 10);
        this.ctx.fillRect(px - hw, py + hh - 12, p.w + 10, 8);
      }
    });

    // Draw Gloinks
    this.gloinks.forEach(g => {
      if (g.isSquashed) {
        // Draw squashed graphic
        this.ctx.fillStyle = '#6a224a';
        this.ctx.beginPath();
        this.ctx.ellipse(g.x, g.y, 14, 4, 0, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.font = '8px VT323';
        this.ctx.fillText("SPLAT", g.x - 10, g.y - 4);
        return;
      }
      
      // Draw standard Gloink (Glitch-beetle shape, crawling eyes)
      this.ctx.fillStyle = '#993399'; // Purple body
      this.ctx.fillRect(g.x - g.width/2, g.y - g.height/2, g.width, g.height);
      
      // Tiny crawling legs
      this.ctx.strokeStyle = '#551155';
      this.ctx.lineWidth = 1.5;
      let legOffset = (Date.now() % 300 > 150) ? 3 : -3;
      this.ctx.beginPath();
      this.ctx.moveTo(g.x - 10, g.y - 8); this.ctx.lineTo(g.x - 14 + legOffset, g.y - 12);
      this.ctx.moveTo(g.x + 10, g.y - 8); this.ctx.lineTo(g.x + 14 - legOffset, g.y - 12);
      this.ctx.moveTo(g.x - 10, g.y + 8); this.ctx.lineTo(g.x - 14 - legOffset, g.y + 12);
      this.ctx.moveTo(g.x + 10, g.y + 8); this.ctx.lineTo(g.x + 14 + legOffset, g.y + 12);
      this.ctx.stroke();

      // Yellow glowing eyes
      this.ctx.fillStyle = '#ffff00';
      this.ctx.fillRect(g.x - 6, g.y - 4, 3, 3);
      this.ctx.fillRect(g.x + 3, g.y - 4, 3, 3);
      
      if (g.isCarrying) {
        // Draw warning thief line
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
        this.ctx.beginPath();
        this.ctx.moveTo(g.x, g.y);
        this.ctx.lineTo(g.x < 175 ? 0 : 350, g.y);
        this.ctx.stroke();
      }
    });
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.update(dt);
    this.draw();

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}


/* ==========================================================================
   EPISODE 0: START CALIBRATION GAME
   ========================================================================== */
class Episode0Game {
  constructor() {
    this.canvas = document.getElementById('ep0-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById('ep0-calib-score');
    this.timerSpan = document.getElementById('ep0-timer');
    this.resetBtn = document.getElementById('ep0-btn-reset');
    
    this.resetState();
    
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  resetState() {
    this.timeLeft = 20;
    this.timerId = null;
    this.loopId = null;
    this.score = 0;
    this.winTriggered = false;
    this.mouse = { x: 175, y: 140 };
    
    this.target = { x: 175, y: 140, radius: 15, active: true };
    if (this.scoreSpan) this.scoreSpan.innerText = "0 / 3";
    if (this.timerSpan) this.timerSpan.innerText = "20s";
  }

  start() {
    this.resetState();
    this.canvas.addEventListener('click', this.handleCanvasClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.resetBtn.addEventListener('click', this.handleReset);
    window.addEventListener('keydown', this.handleKeyDown);
    
    this.generateTarget();
    
    this.timerId = setInterval(() => {
      this.timeLeft--;
      if (this.timerSpan) this.timerSpan.innerText = `${this.timeLeft}s`;
      if (this.timeLeft <= 0) {
        EpisodeManager.gameOver("Calibration échouée. Impossible d'établir la liaison.");
      }
    }, 1000);
    
    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    if (this.timerId) clearInterval(this.timerId);
    this.canvas.removeEventListener('click', this.handleCanvasClick);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.resetBtn.removeEventListener('click', this.handleReset);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleReset() {
    SoundManager.playClick();
    if (this.timerId) clearInterval(this.timerId);
    if (this.loopId) cancelAnimationFrame(this.loopId);
    this.resetState();
    this.generateTarget();
    this.timerId = setInterval(() => {
      this.timeLeft--;
      if (this.timerSpan) this.timerSpan.innerText = `${this.timeLeft}s`;
      if (this.timeLeft <= 0) {
        EpisodeManager.gameOver("Calibration Ã©chouÃ©e. Impossible d'Ã©tablir la liaison.");
      }
    }, 1000);
    this.lastTick = Date.now();
    this.loop();
  }

  generateTarget() {
    this.target.x = 95 + Math.random() * (this.canvas.width - 190);
    this.target.y = 65 + Math.random() * (this.canvas.height - 140);
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    this.mouse.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
  }

  handleCanvasClick(e) {
    if (this.winTriggered) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    
    const dx = clickX - this.target.x;
    const dy = clickY - this.target.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist <= this.target.radius + 10) {
      this.calibrateCurrentTarget();
    } else {
      SoundManager.playError();
    }
  }

  handleKeyDown(e) {
    if (this.winTriggered) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.calibrateCurrentTarget();
    }
  }

  calibrateCurrentTarget() {
    SoundManager.playBeep();
    this.score++;
    if (this.scoreSpan) this.scoreSpan.innerText = `${this.score} / 3`;

    if (this.score >= 3) {
      this.winTriggered = true;
      clearInterval(this.timerId);
      this.runCalibrationCompletionSequence();
    } else {
      this.generateTarget();
    }
  }

  runCalibrationCompletionSequence() {
    let step = 0;
    const canvas = this.canvas;
    const ctx = this.ctx;
    
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }
    
    let startTime = Date.now();
    let lastBeepTime = 0;

    const drawStep = () => {
      ctx.fillStyle = '#020503';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = '#051808';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#39ff14';
      ctx.textAlign = 'center';
      
      if (step === 0) {
        ctx.font = 'bold 12px monospace';
        ctx.fillText("ETALONNAGE COMPLÉTÉ", canvas.width / 2, 70);
        
        ctx.font = '10px monospace';
        ctx.fillText("INITIALISATION DU SCAN CÉRÉBRAL...", canvas.width / 2, 100);
        
        // Progress bar
        ctx.strokeStyle = '#39ff14';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, 120, canvas.width - 100, 20);
        
        const elapsed = Date.now() - startTime;
        const progressVal = Math.min(100, Math.floor(elapsed / 25)); // 2.5 seconds to fill
        
        ctx.fillStyle = '#39ff14';
        ctx.fillRect(54, 124, (canvas.width - 108) * (progressVal / 100), 12);
        
        ctx.fillStyle = '#39ff14';
        ctx.fillText(`LIAISON SYNAPTIQUE : ${progressVal}%`, canvas.width / 2, 165);
        
        // Play click sound periodic beep
        if (progressVal % 15 === 0 && elapsed - lastBeepTime > 150 && progressVal < 100) {
          SoundManager.play(600 + progressVal * 4, 0.05, 'sine', 0.08);
          lastBeepTime = elapsed;
        }

        if (progressVal >= 100) {
          step = 1;
          startTime = Date.now();
          SoundManager.playWin();
        }
      } else if (step === 1) {
        ctx.font = 'bold 12px monospace';
        ctx.fillText("SCAN RÉUSSI - DONNÉES ENREGISTRÉES", canvas.width / 2, 60);
        
        ctx.font = '9px monospace';
        ctx.fillStyle = '#ffb000';
        ctx.fillText("Sujet identifié : SUJET #042 (Sarah)", canvas.width / 2, 90);
        ctx.fillText("Implantation d'interface : 100% OK", canvas.width / 2, 105);
        
        ctx.fillStyle = '#39ff14';
        ctx.fillText("Merci pour votre participation au projet C&A.", canvas.width / 2, 140);
        ctx.fillText("Liaison établie. Fermeture de la session...", canvas.width / 2, 160);
        
        const elapsed = Date.now() - startTime;
        if (elapsed > 4000) {
          step = 2;
          startTime = Date.now();
        }
      } else if (step === 2) {
        ctx.fillStyle = 'red';
        ctx.font = 'bold 13px monospace';
        ctx.fillText("ARRÊT DU SYSTÈME EN COURS...", canvas.width / 2, 100);
        ctx.font = '9px monospace';
        ctx.fillText("DECONNEXION DU TERMINAL PHYSIQUE...", canvas.width / 2, 130);
        
        const elapsed = Date.now() - startTime;
        if (elapsed > 2000) {
          this.triggerSystemShutdown();
          return;
        }
      }
      
      this.loopId = requestAnimationFrame(drawStep);
    };
    
    drawStep();
  }

  triggerSystemShutdown() {
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }
    
    // Save progress to localStorage (Episode 0 won!)
    const progress = EpisodeManager.getProgress();
    if (!progress.includes(0)) {
      progress.push(0);
      localStorage.setItem('tadc_progress', JSON.stringify(progress));
    }
    
    // Trigger OS shutdown
    if (window.OS) {
      window.OS.shutdownSystemForCalibration();
    }
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    // Background
    this.ctx.fillStyle = '#020503';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw scanning grid
    this.ctx.strokeStyle = '#051808';
    this.ctx.lineWidth = 0.5;
    for (let x = 0; x < this.canvas.width; x += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Top instruction banner
    this.ctx.fillStyle = '#1c351f';
    this.ctx.fillRect(0, 0, this.canvas.width, 25);
    
    this.ctx.fillStyle = '#39ff14';
    this.ctx.font = 'bold 8px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("VALIDEZ LE NODE", this.canvas.width / 2, 16);

    if (!this.winTriggered) {
      const dx = this.mouse.x - this.target.x;
      const dy = this.mouse.y - this.target.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const targetLocked = dist <= (this.target.radius + 10);

      // Draw dotted guiding link from mouse to target
      this.ctx.strokeStyle = targetLocked ? '#ffb000' : 'rgba(57, 255, 20, 0.4)';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.mouse.x, this.mouse.y);
      this.ctx.lineTo(this.target.x, this.target.y);
      this.ctx.stroke();
      this.ctx.setLineDash([]); // Reset line dash

      // Target node pulse animations
      let pulse = 12 + Math.sin(Date.now() * 0.01) * 4;
      this.ctx.strokeStyle = targetLocked ? '#ffb000' : '#39ff14';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(this.target.x, this.target.y, pulse, 0, Math.PI * 2);
      this.ctx.stroke();

      // Outer target ring
      this.ctx.strokeStyle = targetLocked ? 'rgba(255, 176, 0, 0.5)' : 'rgba(57, 255, 20, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(this.target.x, this.target.y, pulse + 8, 0, Math.PI * 2);
      this.ctx.stroke();

      // Crosshairs at target
      this.ctx.beginPath();
      this.ctx.moveTo(this.target.x - 30, this.target.y);
      this.ctx.lineTo(this.target.x + 30, this.target.y);
      this.ctx.moveTo(this.target.x, this.target.y - 30);
      this.ctx.lineTo(this.target.x, this.target.y + 30);
      this.ctx.stroke();

      // Center solid core
      this.ctx.fillStyle = targetLocked ? '#ffb000' : 'rgba(57, 255, 20, 0.6)';
      this.ctx.beginPath();
      this.ctx.arc(this.target.x, this.target.y, 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Text HUD at bottom right
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#39ff14';
      this.ctx.font = '9px monospace';
      this.ctx.fillText(`X: ${Math.round(this.mouse.x)} Y: ${Math.round(this.mouse.y)}`, this.canvas.width - 10, this.canvas.height - 25);
      this.ctx.fillText(`OFFSET: ${Math.round(dist)}px`, this.canvas.width - 10, this.canvas.height - 12);

      // Status indicator
      this.ctx.textAlign = 'left';
      if (targetLocked) {
        this.ctx.fillStyle = '#ffb000';
        this.ctx.font = 'bold 10px monospace';
        const blink = Math.floor(Date.now() / 250) % 2 === 0;
        if (blink) {
          this.ctx.fillText(">> LOCK : VALIDEZ <<", this.target.x - 52, this.target.y + pulse + 15);
        } else {
          this.ctx.fillText(">> LOCK ACTIF <<", this.target.x - 42, this.target.y + pulse + 15);
        }
      } else {
        this.ctx.fillStyle = 'rgba(57, 255, 20, 0.7)';
        this.ctx.font = '9px monospace';
        this.ctx.fillText("NODE À RELIER", this.target.x - 35, this.target.y + pulse + 12);
      }
    } else {
      // Victory text on canvas
      this.ctx.fillStyle = 'rgba(57, 255, 20, 0.9)';
      this.ctx.font = 'bold 14px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText("CALIBRATION OK", this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '10px monospace';
      this.ctx.fillText("CHARGEMENT DU SIMULATEUR...", this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   EPISODE 4: FAST FOOD MASQUERADE (SPUDSY'S ORDER ASSEMBLY)
   ========================================================================== */
class Episode4Game {
  constructor() {
    this.canvas = document.getElementById('ep4-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById('ep4-score');
    this.timerSpan = document.getElementById('ep4-timer');
    this.resetBtn = document.getElementById('ep4-btn-reset');

    this.resetState();

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  resetState() {
    this.timeLeft = 45;
    this.timerId = null;
    this.loopId = null;
    this.score = 0;
    this.winTriggered = false;

    this.gangleX = this.canvas.width / 2;
    this.gangleW = 40;
    this.gangleH = 20;

    this.currentStack = [];
    this.fallingIngredients = [];
    this.ingredientTypes = [
      { id: 0, name: 'Pain Bas', color: '#d7a15c', h: 6 },
      { id: 1, name: 'Steak', color: '#5c3a21', h: 8 },
      { id: 2, name: 'Fromage', color: '#ffd700', h: 4 },
      { id: 3, name: 'Salade', color: '#32cd32', h: 5 },
      { id: 4, name: 'Pain Haut', color: '#c68a4c', h: 10 }
    ];

    this.scoreSpan.innerText = "0 / 3";
    this.timerSpan.innerText = "45s";
  }

  start() {
    this.resetState();
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.resetBtn.addEventListener('click', this.handleReset);

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.timerSpan.innerText = `${this.timeLeft}s`;
      if (this.timeLeft <= 0) {
        EpisodeManager.gameOver("Temps écoulé chez Spudsy's. Commandes non livrées.");
      }
    }, 1000);

    this.spawnTimer = setInterval(() => {
      this.spawnIngredient();
    }, 900);

    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    if (this.timerId) clearInterval(this.timerId);
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.resetBtn.removeEventListener('click', this.handleReset);
  }

  handleReset() {
    SoundManager.playClick();
    this.resetState();
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    this.gangleX = Math.max(this.gangleW / 2, Math.min(this.canvas.width - this.gangleW / 2, clickX));
  }

  spawnIngredient() {
    if (this.winTriggered) return;
    let typeId;
    if (Math.random() < 0.4) {
      typeId = this.currentStack.length;
    } else {
      typeId = Math.floor(Math.random() * 5);
    }
    
    this.fallingIngredients.push({
      x: 20 + Math.random() * (this.canvas.width - 40),
      y: 0,
      speed: 120 + Math.random() * 80,
      type: this.ingredientTypes[typeId]
    });
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.fallingIngredients.forEach((ing, index) => {
      ing.y += ing.speed * dt;

      const targetY = this.canvas.height - 25 - (this.currentStack.length * 6);
      if (ing.y >= targetY && ing.y <= targetY + 15) {
        const dist = Math.abs(ing.x - this.gangleX);
        if (dist < 25) {
          const expectedId = this.currentStack.length;
          if (ing.type.id === expectedId) {
            SoundManager.playBeep();
            this.currentStack.push(ing.type);
            
            if (this.currentStack.length === 5) {
              this.score++;
              this.scoreSpan.innerText = `${this.score} / 3`;
              this.currentStack = [];
              SoundManager.playWin();

              if (this.score >= 3) {
                this.winTriggered = true;
                clearInterval(this.timerId);
                clearInterval(this.spawnTimer);
                setTimeout(() => {
                  EpisodeManager.gameWon("Commandes complétées ! Gangle range son masque en plastique rigide.");
                }, 800);
              }
            }
          } else {
            SoundManager.playError();
            this.currentStack = [];
          }
          this.fallingIngredients.splice(index, 1);
        }
      }
    });

    this.fallingIngredients = this.fallingIngredients.filter(ing => ing.y < this.canvas.height);

    this.ctx.fillStyle = '#0f0502';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#ff69b4';
    this.ctx.fillRect(this.gangleX - this.gangleW/2, this.canvas.height - 25, this.gangleW, this.gangleH);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.arc(this.gangleX, this.canvas.height - 18, 6, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(this.gangleX - 3, this.canvas.height - 20, 1.5, 2);
    this.ctx.fillRect(this.gangleX + 1.5, this.canvas.height - 20, 1.5, 2);
    this.ctx.beginPath();
    this.ctx.arc(this.gangleX, this.canvas.height - 17, 3, 0, Math.PI);
    this.ctx.stroke();

    this.currentStack.forEach((type, idx) => {
      this.ctx.fillStyle = type.color;
      this.ctx.fillRect(this.gangleX - 15, this.canvas.height - 25 - ((idx + 1) * 6), 30, type.h);
    });

    this.fallingIngredients.forEach(ing => {
      this.ctx.fillStyle = ing.type.color;
      this.ctx.fillRect(ing.x - 10, ing.y, 20, ing.type.h);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '6px monospace';
      this.ctx.fillText(ing.type.name, ing.x - 8, ing.y - 2);
    });

    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 8px monospace';
    this.ctx.fillText("Prochain ingrédient requis : " + (this.ingredientTypes[this.currentStack.length]?.name || "COMPLET !"), 10, 15);

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   EPISODE 5: SANS TITRE (SUGGESTION BOX PURGE QTE)
   ========================================================================== */
class Episode5Game {
  constructor() {
    this.canvas = document.getElementById('ep5-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById('ep5-score');
    this.timerSpan = document.getElementById('ep5-timer');
    this.resetBtn = document.getElementById('ep5-btn-reset');

    this.resetState();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  resetState() {
    this.score = 0;
    this.timerQTE = 3.0;
    this.loopId = null;
    this.winTriggered = false;

    this.currentDirection = "";
    this.scoreSpan.innerText = "0 / 12";
    this.timerSpan.innerText = "3.0s";
  }

  start() {
    this.resetState();
    window.addEventListener('keydown', this.handleKeyDown);
    this.resetBtn.addEventListener('click', this.handleReset);

    this.generateQTE();
    
    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    window.removeEventListener('keydown', this.handleKeyDown);
    this.resetBtn.removeEventListener('click', this.handleReset);
  }

  handleReset() {
    SoundManager.playClick();
    this.resetState();
    this.generateQTE();
  }

  generateQTE() {
    const dirs = ["UP", "DOWN", "LEFT", "RIGHT"];
    this.currentDirection = dirs[Math.floor(Math.random() * 4)];
    this.timerQTE = Math.max(1.2, 3.0 - (this.score * 0.15));
  }

  handleKeyDown(e) {
    if (this.winTriggered) return;
    
    let pressed = "";
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "z" || e.key.toLowerCase() === "w") pressed = "UP";
    else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") pressed = "DOWN";
    else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "q" || e.key.toLowerCase() === "a") pressed = "LEFT";
    else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") pressed = "RIGHT";
    
    if (!pressed) return;

    e.preventDefault();

    if (pressed === this.currentDirection) {
      SoundManager.playBeep();
      this.score++;
      this.scoreSpan.innerText = `${this.score} / 12`;
      
      if (this.score >= 12) {
        this.winTriggered = true;
        setTimeout(() => {
          EpisodeManager.gameWon("Purge de la Suggestion Box terminée ! Caine rit de fierté.");
        }, 800);
      } else {
        this.generateQTE();
      }
    } else {
      SoundManager.playError();
      this.score = 0;
      this.scoreSpan.innerText = `0 / 12`;
      this.generateQTE();
    }
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    if (!this.winTriggered) {
      this.timerQTE -= dt;
      this.timerSpan.innerText = `${Math.max(0, this.timerQTE).toFixed(1)}s`;
      
      if (this.timerQTE <= 0) {
        SoundManager.playError();
        this.score = 0;
        this.scoreSpan.innerText = `0 / 12`;
        this.generateQTE();
      }
    }

    this.ctx.fillStyle = '#050207';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#1b1225';
    this.ctx.font = 'bold 8px monospace';
    for (let i = 0; i < 5; i++) {
      this.ctx.fillText("Tâche: purge_suggest_box.exe ... RUNNING", 10, 40 + i*40 + Math.sin(Date.now()*0.005 + i)*10);
    }

    if (!this.winTriggered) {
      const barW = 200;
      const barH = 10;
      const x = (this.canvas.width - barW) / 2;
      const y = 200;
      
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(x, y, barW, barH);
      
      const maxTimer = Math.max(1.2, 3.0 - (this.score * 0.15));
      const fillW = Math.max(0, (this.timerQTE / maxTimer) * barW);
      this.ctx.fillStyle = this.timerQTE < 1.0 ? '#ff0055' : '#00ffff';
      this.ctx.fillRect(x, y, fillW, barH);

      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, 100);
      
      if (this.currentDirection === "UP") this.ctx.rotate(0);
      else if (this.currentDirection === "RIGHT") this.ctx.rotate(Math.PI / 2);
      else if (this.currentDirection === "DOWN") this.ctx.rotate(Math.PI);
      else if (this.currentDirection === "LEFT") this.ctx.rotate(-Math.PI / 2);

      this.ctx.strokeStyle = '#39ff14';
      this.ctx.lineWidth = 6;
      this.ctx.fillStyle = '#103d15';
      this.ctx.beginPath();
      this.ctx.moveTo(0, -35);
      this.ctx.lineTo(25, -10);
      this.ctx.lineTo(10, -10);
      this.ctx.lineTo(10, 25);
      this.ctx.lineTo(-10, 25);
      this.ctx.lineTo(-10, -10);
      this.ctx.lineTo(-25, -10);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.fill();
      
      this.ctx.restore();

      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 11px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText("APPUYEZ SUR : " + this.currentDirection, this.canvas.width/2, 160);
      this.ctx.textAlign = 'left';
    }

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   EPISODE 6: ARMES POUR TOUS (GUN SURVIVAL TARGET DUEL)
   ========================================================================== */
class Episode6Game {
  constructor() {
    this.canvas = document.getElementById('ep6-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById('ep6-score');
    this.livesSpan = document.getElementById('ep6-lives');
    this.resetBtn = document.getElementById('ep6-btn-reset');

    this.resetState();

    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  resetState() {
    this.score = 0;
    this.lives = 3;
    this.winTriggered = false;
    this.loopId = null;

    this.targets = [];
    this.bullets = [];

    this.scoreSpan.innerText = "0 / 15";
    this.livesSpan.innerText = "3";
    this.livesSpan.className = "green-text font-bold";
  }

  start() {
    this.resetState();
    this.canvas.addEventListener('click', this.handleCanvasClick);
    this.resetBtn.addEventListener('click', this.handleReset);

    for (let i = 0; i < 3; i++) {
      this.spawnTarget();
    }

    this.spawnInterval = setInterval(() => {
      this.spawnTarget();
      if (Math.random() < 0.6) {
        this.spawnEnemyBullet();
      }
    }, 1200);

    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    if (this.spawnInterval) clearInterval(this.spawnInterval);
    this.canvas.removeEventListener('click', this.handleCanvasClick);
    this.resetBtn.removeEventListener('click', this.handleReset);
  }

  handleReset() {
    SoundManager.playClick();
    this.resetState();
  }

  spawnTarget() {
    if (this.winTriggered) return;
    const isJax = Math.random() < 0.7;
    this.targets.push({
      x: Math.random() < 0.5 ? -30 : this.canvas.width + 10,
      y: 40 + Math.random() * 120,
      w: 24,
      h: 24,
      speed: (isJax ? 80 : 50) * (Math.random() < 0.5 ? 1 : -1),
      isJax: isJax,
      color: isJax ? '#8a2be2' : '#ff4500'
    });
  }

  spawnEnemyBullet() {
    if (this.winTriggered) return;
    this.bullets.push({
      x: 30 + Math.random() * (this.canvas.width - 60),
      y: 0,
      r: 6,
      speed: 100 + Math.random() * 80
    });
  }

  loseLife() {
    this.lives--;
    this.livesSpan.innerText = this.lives;
    SoundManager.playError();
    
    if (this.lives <= 1) {
      this.livesSpan.className = "red-text blinking";
    } else {
      this.livesSpan.className = "orange-text font-bold";
    }

    if (this.lives <= 0) {
      EpisodeManager.gameOver("Plus de vies. Jax vous a descendu.");
    }
  }

  handleCanvasClick(e) {
    if (this.winTriggered) return;

    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    SoundManager.playClick();

    let hitBullet = false;
    this.bullets.forEach((b, idx) => {
      const dx = clickX - b.x;
      const dy = clickY - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < b.r + 10) {
        SoundManager.playBeep();
        this.bullets.splice(idx, 1);
        hitBullet = true;
      }
    });

    if (hitBullet) return;

    this.targets.forEach((t, idx) => {
      if (clickX >= t.x && clickX <= t.x + t.w && clickY >= t.y && clickY <= t.y + t.h) {
        this.targets.splice(idx, 1);
        
        if (t.isJax) {
          SoundManager.playBeep();
          this.score++;
          this.scoreSpan.innerText = `${this.score} / 15`;
          
          if (this.score >= 15) {
            this.winTriggered = true;
            clearInterval(this.spawnInterval);
            setTimeout(() => {
              EpisodeManager.gameWon("Survivant du stand de tir ! Caine remet les trophées de Jax.");
            }, 800);
          }
        } else {
          this.loseLife();
        }
      }
    });
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.targets.forEach((t, idx) => {
      t.x += t.speed * dt;
      if (t.x < -40 || t.x > this.canvas.width + 40) {
        this.targets.splice(idx, 1);
      }
    });

    this.bullets.forEach((b, idx) => {
      b.y += b.speed * dt;
      if (b.y > this.canvas.height) {
        this.bullets.splice(idx, 1);
        this.loseLife();
      }
    });

    this.ctx.fillStyle = '#0f0202';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.targets.forEach(t => {
      this.ctx.fillStyle = t.color;
      this.ctx.fillRect(t.x, t.y, t.w, t.h);
      
      this.ctx.fillStyle = '#fff';
      if (t.isJax) {
        this.ctx.fillRect(t.x + 4, t.y - 8, 4, 8);
        this.ctx.fillRect(t.x + 16, t.y - 8, 4, 8);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(t.x + 6, t.y + 4, 3, 3);
        this.ctx.fillRect(t.x + 14, t.y + 4, 3, 3);
        this.ctx.fillStyle = '#000';
        this.ctx.font = '6px monospace';
        this.ctx.fillText("J", t.x + 9, t.y + 16);
      } else {
        this.ctx.fillStyle = '#000';
        this.ctx.font = '6px monospace';
        this.ctx.fillText("R", t.x + 9, t.y + 16);
      }
    });

    this.bullets.forEach(b => {
      this.ctx.fillStyle = '#ff0055';
      this.ctx.shadowColor = '#ff0055';
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   EPISODE 7: ÉPISODE DE PLAGE (SHELTER SHRIMPS FROM CAINE'S SUN)
   ========================================================================== */
class Episode7Game {
  constructor() {
    this.canvas = document.getElementById('ep7-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById('ep7-score');
    this.alertSpan = document.getElementById('ep7-alert');
    this.resetBtn = document.getElementById('ep7-btn-reset');

    this.resetState();

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  resetState() {
    this.score = 0;
    this.winTriggered = false;
    this.loopId = null;

    this.umbrellaX = this.canvas.width / 2;
    this.umbrellaY = 150;
    this.umbrellaR = 30;

    this.shrimps = [];
    this.lasers = [];

    this.scoreSpan.innerText = "0 / 8 Crevettes";
    this.alertSpan.innerText = "ALERTE : BASSE";
    this.alertSpan.className = "green-text font-bold";
  }

  start() {
    this.resetState();
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.resetBtn.addEventListener('click', this.handleReset);

    this.spawnInterval = setInterval(() => {
      this.spawnShrimp();
      if (Math.random() < 0.8) {
        this.spawnLaser();
      }
    }, 1100);

    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    if (this.spawnInterval) clearInterval(this.spawnInterval);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.resetBtn.removeEventListener('click', this.handleReset);
  }

  handleReset() {
    SoundManager.playClick();
    this.resetState();
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    
    this.umbrellaX = Math.max(30, Math.min(this.canvas.width - 30, clickX));
    this.umbrellaY = Math.max(60, Math.min(this.canvas.height - 40, clickY));
  }

  spawnShrimp() {
    if (this.winTriggered) return;
    this.shrimps.push({
      x: -20,
      y: this.canvas.height - 20,
      speed: 60 + Math.random() * 40,
      alive: true
    });
  }

  spawnLaser() {
    if (this.winTriggered) return;
    this.lasers.push({
      x: 10 + Math.random() * (this.canvas.width - 20),
      y: 0,
      speed: 150 + Math.random() * 100,
      active: true
    });
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.lasers.forEach((l, lIdx) => {
      l.y += l.speed * dt;

      const dx = l.x - this.umbrellaX;
      const dy = l.y - this.umbrellaY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist <= this.umbrellaR && dy < 0) {
        SoundManager.playClick();
        this.lasers.splice(lIdx, 1);
        return;
      }

      this.shrimps.forEach((s, sIdx) => {
        if (s.alive && Math.abs(l.x - s.x) < 15 && l.y >= s.y - 10) {
          s.alive = false;
          SoundManager.playExplosion();
          this.lasers.splice(lIdx, 1);
          
          this.alertSpan.innerText = "PURGE ACTIVE";
          this.alertSpan.className = "red-text blinking";
          setTimeout(() => {
            if (!this.winTriggered) {
              this.alertSpan.innerText = "ALERTE : BASSE";
              this.alertSpan.className = "green-text font-bold";
            }
          }, 1500);
        }
      });

      if (l.y > this.canvas.height) {
        this.lasers.splice(lIdx, 1);
      }
    });

    this.shrimps.forEach((s, idx) => {
      s.x += s.speed * dt;
      if (s.x > this.canvas.width) {
        if (s.alive) {
          SoundManager.playBeep();
          this.score++;
          this.scoreSpan.innerText = `${this.score} / 8 Crevettes`;
          
          if (this.score >= 8) {
            this.winTriggered = true;
            clearInterval(this.spawnInterval);
            setTimeout(() => {
              EpisodeManager.gameWon("Plage sécurisée. Pomni a trouvé un moment de paix avec les Shrimps.");
            }, 800);
          }
        }
        this.shrimps.splice(idx, 1);
      }
    });

    this.ctx.fillStyle = '#01050a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#3a2e1d';
    this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);

    this.ctx.strokeStyle = '#39ff14';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(this.umbrellaX, this.umbrellaY, this.umbrellaR, Math.PI, 0);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#155d1c';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(this.umbrellaX, this.umbrellaY);
    this.ctx.lineTo(this.umbrellaX, this.umbrellaY + 25);
    this.ctx.stroke();

    this.shrimps.forEach(s => {
      if (s.alive) {
        this.ctx.fillStyle = '#ffb6c1';
        this.ctx.fillRect(s.x - 5, s.y - 12, 10, 12);
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.fillRect(s.x - 3, s.y - 14, 3, 2);
      } else {
        this.ctx.fillStyle = '#800';
        this.ctx.font = '8px monospace';
        this.ctx.fillText("🗑️", s.x - 4, s.y - 4);
      }
    });

    this.lasers.forEach(l => {
      this.ctx.strokeStyle = '#ffd700';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(l.x, l.y - 15);
      this.ctx.lineTo(l.x, l.y);
      this.ctx.stroke();
    });

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   EPISODE 8: hjsakldfhl (COLLECT QUEENIE'S MEMORY FRAGMENTS)
   ========================================================================== */
class Episode8Game {
  constructor() {
    this.canvas = document.getElementById('ep8-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById('ep8-score');
    this.radarSpan = document.getElementById('ep8-radar');
    this.resetBtn = document.getElementById('ep8-btn-reset');

    this.resetState();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  resetState() {
    this.score = 0;
    this.stability = 100;
    this.winTriggered = false;
    this.loopId = null;

    this.kinger = { x: 40, y: 40, speed: 120 };
    
    this.memories = [
      { x: 120, y: 60, active: true },
      { x: 260, y: 70, active: true },
      { x: 80, y: 180, active: true },
      { x: 280, y: 220, active: true },
      { x: 180, y: 150, active: true }
    ];

    this.searchlight = { x: 175, y: 140, tx: 175, ty: 140, r: 35, speed: 90 };

    this.scoreSpan.innerText = "0 / 5";
    this.radarSpan.innerText = "STABILITÉ : 100%";
    this.radarSpan.className = "green-text font-bold";
  }

  start() {
    this.resetState();
    window.addEventListener('keydown', this.handleKeyDown);
    this.resetBtn.addEventListener('click', this.handleReset);

    this.searchlightTimer = setInterval(() => {
      this.searchlight.tx = 30 + Math.random() * (this.canvas.width - 60);
      this.searchlight.ty = 30 + Math.random() * (this.canvas.height - 60);
    }, 1500);

    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    if (this.searchlightTimer) clearInterval(this.searchlightTimer);
    window.removeEventListener('keydown', this.handleKeyDown);
    this.resetBtn.removeEventListener('click', this.handleReset);
  }

  handleReset() {
    SoundManager.playClick();
    this.resetState();
  }

  handleKeyDown(e) {
    if (this.winTriggered) return;
    const dist = 15;
    
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "z" || e.key.toLowerCase() === "w") {
      this.kinger.y = Math.max(20, this.kinger.y - dist);
      e.preventDefault();
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
      this.kinger.y = Math.min(this.canvas.height - 20, this.kinger.y + dist);
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "q" || e.key.toLowerCase() === "a") {
      this.kinger.x = Math.max(20, this.kinger.x - dist);
      e.preventDefault();
    } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
      this.kinger.x = Math.min(this.canvas.width - 20, this.kinger.x + dist);
      e.preventDefault();
    }
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    const sdx = this.searchlight.tx - this.searchlight.x;
    const sdy = this.searchlight.ty - this.searchlight.y;
    const sdist = Math.sqrt(sdx*sdx + sdy*sdy);
    if (sdist > 5) {
      this.searchlight.x += (sdx / sdist) * this.searchlight.speed * dt;
      this.searchlight.y += (sdy / sdist) * this.searchlight.speed * dt;
    }

    const kdx = this.kinger.x - this.searchlight.x;
    const kdy = this.kinger.y - this.searchlight.y;
    const kdist = Math.sqrt(kdx*kdx + kdy*kdy);
    
    if (!this.winTriggered) {
      if (kdist < this.searchlight.r) {
        this.stability -= 25 * dt;
        this.radarSpan.innerText = `STABILITÉ : ${Math.max(0, Math.round(this.stability))}%`;
        this.radarSpan.className = "red-text blinking";
        SoundManager.playGlitch();

        if (this.stability <= 0) {
          EpisodeManager.gameOver("Surcharge mentale. Kinger s'est abstrait dans le vide.");
          return;
        }
      } else {
        this.radarSpan.innerText = `STABILITÉ : ${Math.round(this.stability)}%`;
        this.radarSpan.className = "green-text font-bold";
      }

      this.memories.forEach(m => {
        if (m.active) {
          const mdx = this.kinger.x - m.x;
          const mdy = this.kinger.y - m.y;
          const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
          if (mdist < 15) {
            m.active = false;
            SoundManager.playBeep();
            this.score++;
            this.scoreSpan.innerText = `${this.score} / 5`;
            
            if (this.score >= 5) {
              this.winTriggered = true;
              setTimeout(() => {
                EpisodeManager.gameWon("Souvenirs de Queenie rassemblés. Kinger retrouve une seconde de lucidité.");
              }, 800);
            }
          }
        }
      });
    }

    this.ctx.fillStyle = '#050402';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
    this.ctx.beginPath();
    this.ctx.arc(this.searchlight.x, this.searchlight.y, this.searchlight.r, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#ff0033';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    this.memories.forEach(m => {
      if (m.active) {
        let size = 6 + Math.sin(Date.now()*0.01)*2;
        this.ctx.fillStyle = '#ffd700';
        this.ctx.shadowColor = '#ffd700';
        this.ctx.shadowBlur = 8;
        
        this.ctx.beginPath();
        this.ctx.arc(m.x, m.y, size, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 8px monospace';
        this.ctx.fillText("H", m.x - 3, m.y + 3);
      }
    });

    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = '#aaa';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.kinger.x, this.kinger.y, 10, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#ffd700';
    this.ctx.beginPath();
    this.ctx.moveTo(this.kinger.x - 6, this.kinger.y - 8);
    this.ctx.lineTo(this.kinger.x - 3, this.kinger.y - 12);
    this.ctx.lineTo(this.kinger.x, this.kinger.y - 8);
    this.ctx.lineTo(this.kinger.x + 3, this.kinger.y - 12);
    this.ctx.lineTo(this.kinger.x + 6, this.kinger.y - 8);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 8px sans-serif';
    this.ctx.fillText("K", this.kinger.x - 3, this.kinger.y + 3);

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   EPISODE 9: REMEMBER (RESTORE COLOR TO GLITCH TILES)
   ========================================================================== */
class Episode9Game {
  constructor() {
    this.canvas = document.getElementById('ep9-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById('ep9-score');
    this.timerSpan = document.getElementById('ep9-timer');
    this.resetBtn = document.getElementById('ep9-btn-reset');

    this.resetState();

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  resetState() {
    this.timeLeft = 50;
    this.timerId = null;
    this.loopId = null;
    this.winTriggered = false;

    this.cols = 8;
    this.rows = 6;
    this.tileW = this.canvas.width / this.cols;
    this.tileH = this.canvas.height / this.rows;

    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = {
          painted: false,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
          glitching: Math.random() < 0.3
        };
      }
    }

    this.scoreSpan.innerText = "0%";
    this.timerSpan.innerText = "50s";
  }

  start() {
    this.resetState();
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.resetBtn.addEventListener('click', this.handleReset);

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.timerSpan.innerText = `${this.timeLeft}s`;
      if (this.timeLeft <= 0) {
        EpisodeManager.gameOver("Le cirque s'est figé dans le noir et blanc. Crash synaptique.");
      }
    }, 1000);

    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    if (this.timerId) clearInterval(this.timerId);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.resetBtn.removeEventListener('click', this.handleReset);
  }

  handleReset() {
    SoundManager.playClick();
    this.resetState();
  }

  handleMouseMove(e) {
    if (this.winTriggered) return;

    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    const col = Math.floor(clickX / this.tileW);
    const row = Math.floor(clickY / this.tileH);

    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
      const tile = this.grid[row][col];
      if (!tile.painted) {
        tile.painted = true;
        SoundManager.playClick();
        this.checkScore();
      }
    }
  }

  checkScore() {
    let total = this.cols * this.rows;
    let paintedCount = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].painted) paintedCount++;
      }
    }
    
    const percent = Math.round((paintedCount / total) * 100);
    this.scoreSpan.innerText = `${percent}%`;

    if (percent >= 75 && !this.winTriggered) {
      this.winTriggered = true;
      clearInterval(this.timerId);
      setTimeout(() => {
        EpisodeManager.gameWon("Couleurs restaurées ! Mais Kinger révèle la vérité effroyable : vous n'êtes que des Brain Scans.");
      }, 800);
    }
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = this.grid[r][c];
        const x = c * this.tileW;
        const y = r * this.tileH;

        if (tile.painted) {
          this.ctx.fillStyle = tile.color;
          this.ctx.fillRect(x, y, this.tileW - 1, this.tileH - 1);
        } else {
          let flicker = Math.sin(Date.now() * 0.01 + r * c) * 20;
          this.ctx.fillStyle = tile.glitching ? `rgb(${60+flicker}, ${60+flicker}, ${60+flicker})` : '#181818';
          this.ctx.fillRect(x, y, this.tileW - 1, this.tileH - 1);
          
          this.ctx.strokeStyle = '#333';
          this.ctx.strokeRect(x, y, this.tileW, this.tileH);
        }
      }
    }

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   MISSION PRÉQUELLE (ÉPISODE -1) : ABEL CORE TEST WIRE ROUTING GAME
   ========================================================================== */
class EpisodePrequelGame {
  constructor() {
    this.canvas = document.getElementById('ep-1-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.timerSpan = document.getElementById('ep-1-timer');
    this.connectSpan = document.getElementById('ep-1-connected');
    this.resetBtn = document.getElementById('ep-1-btn-reset');
    
    this.cellW = 55;
    this.cellH = 55;
    this.offsetX = 40;
    this.offsetY = 35;
    
    this.resetState();
    
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  resetState() {
    this.timeLeft = 35;
    this.timerId = null;
    this.loopId = null;
    this.connected = false;
    this.winTriggered = false;
    
    this.nodes = [
      { col: 1, row: 0, type: 'corner', rotation: 90, connected: false },
      { col: 2, row: 0, type: 'straight', rotation: 0, connected: false },
      { col: 3, row: 0, type: 'corner', rotation: 180, connected: false },
      
      { col: 0, row: 1, type: 'start', rotation: 0, connected: true },
      { col: 1, row: 1, type: 'corner', rotation: 270, connected: false },
      { col: 2, row: 1, type: 'corner', rotation: 90, connected: false },
      { col: 3, row: 1, type: 'straight', rotation: 90, connected: false },
      
      { col: 1, row: 2, type: 'straight', rotation: 0, connected: false },
      { col: 2, row: 2, type: 'cross', rotation: 0, connected: false },
      { col: 3, row: 2, type: 'corner', rotation: 0, connected: false },
      { col: 4, row: 2, type: 'end', rotation: 0, connected: false },
      
      { col: 1, row: 3, type: 'corner', rotation: 180, connected: false },
      { col: 2, row: 3, type: 'straight', rotation: 90, connected: false },
      { col: 3, row: 3, type: 'corner', rotation: 270, connected: false }
    ];
    
    this.connectSpan.innerText = "NON-CONNECTÉ";
    this.connectSpan.className = "orange-text blinking";
    this.timerSpan.innerText = "35s";
  }

  start() {
    this.resetState();
    this.canvas.addEventListener('click', this.handleCanvasClick);
    this.resetBtn.addEventListener('click', this.handleReset);
    
    this.checkConnection();
    
    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.timerSpan.innerText = `${this.timeLeft}s`;
      
      if (this.timeLeft <= 0) {
        EpisodeManager.gameOver("Balayage Caine engagé. Arthur a été détecté et effacé avant le raccordement.");
      }
    }, 1000);
    
    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    if (this.timerId) clearInterval(this.timerId);
    this.canvas.removeEventListener('click', this.handleCanvasClick);
    this.resetBtn.removeEventListener('click', this.handleReset);
  }

  handleReset() {
    SoundManager.playClick();
    this.nodes.forEach(n => {
      if (n.type !== 'start' && n.type !== 'end') {
        n.rotation = Math.floor(Math.random() * 4) * 90;
      }
    });
    this.checkConnection();
  }

  getNode(col, row) {
    return this.nodes.find(n => n.col === col && n.row === row);
  }

  getExitDirection(node, entryDir) {
    const rot = node.rotation % 360;
    
    if (node.type === 'straight') {
      if (rot === 0 || rot === 180) {
        if (entryDir === 'left') return 'right';
        if (entryDir === 'right') return 'left';
      } else {
        if (entryDir === 'up') return 'bottom';
        if (entryDir === 'bottom') return 'up';
      }
    } else if (node.type === 'corner') {
      if (rot === 0) {
        if (entryDir === 'right') return 'bottom';
        if (entryDir === 'bottom') return 'right';
      } else if (rot === 90) {
        if (entryDir === 'bottom') return 'left';
        if (entryDir === 'left') return 'bottom';
      } else if (rot === 180) {
        if (entryDir === 'left') return 'up';
        if (entryDir === 'up') return 'left';
      } else if (rot === 270) {
        if (entryDir === 'up') return 'right';
        if (entryDir === 'right') return 'up';
      }
    } else if (node.type === 'cross') {
      if (entryDir === 'left') return 'right';
      if (entryDir === 'right') return 'left';
      if (entryDir === 'up') return 'bottom';
      if (entryDir === 'bottom') return 'up';
    }
    return null;
  }

  checkConnection() {
    this.nodes.forEach(n => {
      if (n.type !== 'start') n.connected = false;
    });
    
    const start = this.getNode(0, 1);
    if (!start) return;
    
    let current = { col: 1, row: 1 };
    let entryDir = 'left';
    
    const maxSteps = 25;
    let steps = 0;
    
    while(steps < maxSteps) {
      steps++;
      const node = this.getNode(current.col, current.row);
      if (!node) break;
      
      const exitDir = this.getExitDirection(node, entryDir);
      if (!exitDir) break;
      
      node.connected = true;
      
      if (exitDir === 'right') {
        current.col++;
        entryDir = 'left';
      } else if (exitDir === 'left') {
        current.col--;
        entryDir = 'right';
      } else if (exitDir === 'up') {
        current.row--;
        entryDir = 'bottom';
      } else if (exitDir === 'bottom') {
        current.row++;
        entryDir = 'up';
      }
      
      if (current.col === 4 && current.row === 2 && entryDir === 'left') {
        const dest = this.getNode(4, 2);
        if (dest) dest.connected = true;
        this.connected = true;
        this.connectSpan.innerText = "SYNAPSE CONNECTÉE";
        this.connectSpan.className = "green-text font-bold";
        
        if (!this.winTriggered) {
          this.winTriggered = true;
          clearInterval(this.timerId);
          setTimeout(() => {
            EpisodeManager.gameWon("Signal raccordé ! Arthur a inséré son override... Mais Caine a bloqué la déconnexion. Arthur est piégé et devient Kinger. La clé synaptique d'override final est disponible !");
          }, 1500);
        }
        return;
      }
    }
    
    this.connected = false;
    this.connectSpan.innerText = "NON-CONNECTÉ";
    this.connectSpan.className = "orange-text blinking";
  }

  handleCanvasClick(e) {
    if (this.winTriggered) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    
    const col = Math.floor((clickX - this.offsetX) / this.cellW);
    const row = Math.floor((clickY - this.offsetY) / this.cellH);
    
    const node = this.getNode(col, row);
    if (node && node.type !== 'start' && node.type !== 'end') {
      SoundManager.playClick();
      node.rotation = (node.rotation + 90) % 360;
      this.checkConnection();
    }
  }

  update(dt) {}

  draw() {
    this.ctx.fillStyle = '#050a06';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = '#08170c';
    this.ctx.lineWidth = 0.5;
    for (let c = 0; c < 5; c++) {
      const px = this.offsetX + c * this.cellW + this.cellW/2;
      this.ctx.beginPath();
      this.ctx.moveTo(px, 0);
      this.ctx.lineTo(px, this.canvas.height);
      this.ctx.stroke();
    }
    for (let r = 0; r < 4; r++) {
      const py = this.offsetY + r * this.cellH + this.cellH/2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, py);
      this.ctx.lineTo(this.canvas.width, py);
      this.ctx.stroke();
    }

    this.nodes.forEach(node => {
      const px = this.offsetX + node.col * this.cellW + this.cellW / 2;
      const py = this.offsetY + node.row * this.cellH + this.cellH / 2;

      this.ctx.save();
      this.ctx.translate(px, py);

      if (node.type === 'start') {
        this.ctx.fillStyle = '#222';
        this.ctx.strokeStyle = node.connected ? '#00ffff' : '#225555';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 18, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 9px monospace';
        this.ctx.fillText("BRAIN", -13, 3);
        
        this.ctx.strokeStyle = node.connected ? '#ff9900' : '#1a4c28';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.cellW/2, 0);
        this.ctx.stroke();
      } else if (node.type === 'end') {
        this.ctx.fillStyle = '#222';
        this.ctx.strokeStyle = node.connected ? '#39ff14' : '#225522';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-16, -16, 32, 32);
        this.ctx.fillRect(-16, -16, 32, 32);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 8px monospace';
        this.ctx.fillText("MATRIX", -14, 3);

        this.ctx.strokeStyle = node.connected ? '#ff9900' : '#1a4c28';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(-this.cellW/2, 0);
        this.ctx.lineTo(0, 0);
        this.ctx.stroke();
      } else {
        this.ctx.rotate(node.rotation * Math.PI / 180);
        
        this.ctx.fillStyle = '#0f1f13';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 14, 0, Math.PI*2);
        this.ctx.fill();

        this.ctx.strokeStyle = node.connected ? '#ff9900' : '#1a4c28';
        if (node.connected) {
          this.ctx.shadowColor = '#ff9900';
          this.ctx.shadowBlur = 8;
        }
        this.ctx.lineWidth = 4;

        if (node.type === 'straight') {
          this.ctx.beginPath();
          this.ctx.moveTo(-this.cellW/2, 0);
          this.ctx.lineTo(this.cellW/2, 0);
          this.ctx.stroke();
        } else if (node.type === 'corner') {
          this.ctx.beginPath();
          this.ctx.moveTo(0, this.cellH/2);
          this.ctx.lineTo(0, 0);
          this.ctx.lineTo(this.cellW/2, 0);
          this.ctx.stroke();
        } else if (node.type === 'cross') {
          this.ctx.beginPath();
          this.ctx.moveTo(-this.cellW/2, 0);
          this.ctx.lineTo(this.cellW/2, 0);
          this.ctx.moveTo(0, -this.cellH/2);
          this.ctx.lineTo(0, this.cellH/2);
          this.ctx.stroke();
        }
      }
      this.ctx.restore();
    });
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.update(dt);
    this.draw();

    this.loopId = requestAnimationFrame(() => this.loop());
  }
}

/* ==========================================================================
   ÉPISODE CACHÉ (ÉPISODE -2) : FUSION RED/BLUE (1993)
   ========================================================================== */
class EpisodeMinus2Game {
  constructor() {
    this.canvas = document.getElementById('ep-2-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.fusionSpan = document.getElementById('ep-2-fusion-percent');
    this.integritySpan = document.getElementById('ep-2-integrity');
    
    this.resetState();
    
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  resetState() {
    this.fusion = 0;
    this.integrity = 100;
    this.winTriggered = false;
    this.gameOverTriggered = false;
    this.loopId = null;
    this.lastTick = Date.now();
    
    this.red = { x: 50, y: 140, r: 8, vx: 0, vy: 0 };
    this.target = { x: 50, y: 140 };
    
    this.blue = { x: 280, y: 140, r: 8, targetX: 280, targetY: 140, timer: 0 };
    
    this.obstacles = [
      { x: 150, y: 50, r: 6, vx: 0, vy: 80, limitY1: 30, limitY2: 250 },
      { x: 220, y: 230, r: 6, vx: 0, vy: -100, limitY1: 30, limitY2: 250 },
      { x: 180, y: 140, r: 6, vx: 70, vy: 0, limitX1: 100, limitX2: 300 }
    ];

    if (this.fusionSpan) this.fusionSpan.innerText = "0%";
    if (this.integritySpan) {
      this.integritySpan.innerText = "100%";
      this.integritySpan.className = "green-text";
    }
  }

  start() {
    this.resetState();
    
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('touchmove', this.handleTouchMove);
    
    this.lastTick = Date.now();
    this.loop();
  }

  stop() {
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.target.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    this.target.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
  }

  handleTouchMove(e) {
    if (e.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      this.target.x = (e.touches[0].clientX - rect.left) * (this.canvas.width / rect.width);
      this.target.y = (e.touches[0].clientY - rect.top) * (this.canvas.height / rect.height);
    }
  }

  update(dt) {
    if (this.winTriggered || this.gameOverTriggered) return;

    const dx = this.target.x - this.red.x;
    const dy = this.target.y - this.red.y;
    
    this.red.x += dx * 0.1;
    this.red.y += dy * 0.1;

    this.red.x = Math.max(this.red.r, Math.min(this.canvas.width - this.red.r, this.red.x));
    this.red.y = Math.max(this.red.r, Math.min(this.canvas.height - this.red.r, this.red.y));

    this.blue.timer -= dt;
    if (this.blue.timer <= 0) {
      this.blue.targetX = Math.random() * (this.canvas.width - 40) + 20;
      this.blue.targetY = Math.random() * (this.canvas.height - 40) + 20;
      this.blue.timer = 1.0 + Math.random() * 1.5;
    }
    
    const distToRed = Math.hypot(this.blue.x - this.red.x, this.blue.y - this.red.y);
    if (distToRed < 80) {
      const repelAngle = Math.atan2(this.blue.y - this.red.y, this.blue.x - this.red.x);
      this.blue.targetX = this.blue.x + Math.cos(repelAngle) * 50;
      this.blue.targetY = this.blue.y + Math.sin(repelAngle) * 50;
      this.blue.targetX = Math.max(20, Math.min(this.canvas.width - 20, this.blue.targetX));
      this.blue.targetY = Math.max(20, Math.min(this.canvas.height - 20, this.blue.targetY));
      this.blue.timer = 0.5;
    }

    this.blue.x += (this.blue.targetX - this.blue.x) * 2 * dt;
    this.blue.y += (this.blue.targetY - this.blue.y) * 2 * dt;

    this.obstacles.forEach(o => {
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      
      if (o.vy !== 0) {
        if (o.y <= o.limitY1) { o.y = o.limitY1; o.vy = -o.vy; }
        if (o.y >= o.limitY2) { o.y = o.limitY2; o.vy = -o.vy; }
      }
      if (o.vx !== 0) {
        if (o.x <= o.limitX1) { o.x = o.limitX1; o.vx = -o.vx; }
        if (o.x >= o.limitX2) { o.x = o.limitX2; o.vx = -o.vx; }
      }
    });

    const distBlue = Math.hypot(this.red.x - this.blue.x, this.red.y - this.blue.y);
    if (distBlue < (this.red.r + this.blue.r)) {
      this.fusion += 25;
      SoundManager.play(400 + this.fusion * 4, 0.1, 'sine', 0.1);
      
      if (this.fusionSpan) this.fusionSpan.innerText = `${this.fusion}%`;
      
      if (this.fusion >= 100) {
        this.triggerWinSequence();
        return;
      } else {
        this.blue.x = Math.random() * (this.canvas.width - 60) + 30;
        this.blue.y = Math.random() * (this.canvas.height - 60) + 30;
        this.blue.timer = 1.0;
      }
    }

    this.obstacles.forEach(o => {
      if (!o.cooldown) o.cooldown = 0;
      o.cooldown -= dt;

      const distObstacle = Math.hypot(this.red.x - o.x, this.red.y - o.y);
      if (distObstacle < (this.red.r + o.r) && o.cooldown <= 0) {
        this.integrity -= 20;
        o.cooldown = 1.0;
        
        SoundManager.play(150, 0.2, 'triangle', 0.2);
        
        if (this.integritySpan) {
          this.integritySpan.innerText = `${this.integrity}%`;
          if (this.integrity <= 40) {
            this.integritySpan.className = "red-text alert-pulse";
          } else {
            this.integritySpan.className = "orange-text";
          }
        }

        if (this.integrity <= 0) {
          this.triggerGameOver();
        }
      }
    });
  }

  triggerGameOver() {
    this.gameOverTriggered = true;
    this.stop();
    EpisodeManager.gameOver("Alerte Sécurité C&A : Noyau RED_DOT purgé par le filtre.");
  }

  triggerWinSequence() {
    this.winTriggered = true;
    
    let compileTime = 0;
    const compileDuration = 2.0;
    
    const winLoop = () => {
      const now = Date.now();
      const dt = (now - this.lastTick) / 1000;
      this.lastTick = now;
      
      compileTime += dt;
      
      this.ctx.fillStyle = '#020503';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid();
      
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      
      const progress = Math.min(1.0, compileTime / compileDuration);
      
      this.ctx.save();
      
      const size = progress * 60;
      
      if (Math.random() < 0.25) {
        this.ctx.translate(Math.random() * 6 - 3, Math.random() * 6 - 3);
      }
      
      this.ctx.strokeStyle = `rgba(255, 0, 0, ${progress})`;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(centerX - size/2, centerY - size/4, size, size/2);
      this.ctx.fillStyle = `rgba(200, 0, 0, ${progress * 0.3})`;
      this.ctx.fillRect(centerX - size/2, centerY - size/4, size, size/2);
      
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      for(let x = centerX - size/2 + 5; x < centerX + size/2; x += 10) {
        this.ctx.moveTo(x, centerY - size/4);
        this.ctx.lineTo(x + 5, centerY);
        this.ctx.lineTo(x + 10, centerY - size/4);
      }
      for(let x = centerX - size/2 + 5; x < centerX + size/2; x += 10) {
        this.ctx.moveTo(x, centerY + size/4);
        this.ctx.lineTo(x + 5, centerY);
        this.ctx.lineTo(x + 10, centerY + size/4);
      }
      this.ctx.stroke();
      
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(centerX - size/4, centerY - size/8, size/8, 0, Math.PI*2);
      this.ctx.arc(centerX + size/4, centerY - size/8, size/8, 0, Math.PI*2);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#00f';
      this.ctx.beginPath();
      this.ctx.arc(centerX - size/4, centerY - size/8, size/24, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.fillStyle = '#f00';
      this.ctx.beginPath();
      this.ctx.arc(centerX + size/4, centerY - size/8, size/24, 0, Math.PI*2);
      this.ctx.fill();
      
      this.ctx.restore();
      
      if (Math.random() < 0.15) {
        SoundManager.play(200 + progress * 800, 0.05, 'sawtooth', 0.05);
      }

      if (progress >= 1.0) {
        this.stop();
        EpisodeManager.gameWon("COMPILATION RÉUSSIE : Noyau d'IA R.I.N.G.M.A.S.T.E.R initialisé avec succès sous l'identifiant 'CAINE' (1993).");
      } else {
        this.loopId = requestAnimationFrame(winLoop);
      }
    };
    
    this.loopId = requestAnimationFrame(winLoop);
  }

  drawGrid() {
    this.ctx.strokeStyle = '#051808';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  draw() {
    this.ctx.fillStyle = '#020503';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();

    this.obstacles.forEach(o => {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      if (o.vy !== 0) {
        this.ctx.moveTo(o.x, o.limitY1);
        this.ctx.lineTo(o.x, o.limitY2);
      } else {
        this.ctx.moveTo(o.limitX1, o.y);
        this.ctx.lineTo(o.limitX2, o.y);
      }
      this.ctx.stroke();

      this.ctx.fillStyle = '#666666';
      this.ctx.shadowColor = '#888888';
      this.ctx.shadowBlur = o.cooldown > 0 ? 0 : 6;
      this.ctx.beginPath();
      this.ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.restore();
    });

    this.ctx.save();
    this.ctx.fillStyle = '#00ffff';
    this.ctx.shadowColor = '#00ffff';
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(this.blue.x, this.blue.y, this.blue.r, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.fillStyle = '#ff3333';
    this.ctx.shadowColor = '#ff3333';
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(this.red.x, this.red.y, this.red.r, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.restore();
  }

  loop() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.update(dt);
    if (!this.winTriggered && !this.gameOverTriggered) {
      this.draw();
      this.loopId = requestAnimationFrame(() => this.loop());
    }
  }
}

window.SoundManager = SoundManager;
window.EpisodeManager = EpisodeManager;
