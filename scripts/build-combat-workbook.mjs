/**
 * Rebuild the complete production tracker from the shipped combat definitions.
 * Run this file with the Codex primary Node runtime from a temporary directory
 * containing a node_modules symlink to CODEX_PRIMARY_RUNTIME_NODE_MODULES.
 * --repo-root specifies this checkout. --output-dir defaults to docs.
 * Optional docs/combat-qa-evidence.json supplies actually executed QA results.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const args = process.argv.slice(2);
function flag(name, fallback) { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; }
const root = path.resolve(flag('--repo-root', process.cwd()));
const out = path.resolve(flag('--output-dir', path.join(root, 'docs')));
const previewDir = path.resolve(flag('--preview-dir', path.join(out, 'combat-workbook-previews')));
const renderSheets = flag('--render-sheets', '').split(',').filter(Boolean);
const { GAME, FIGHTERS, MOVES, STAGES, ROSTER_ARCHIVE, VARIANTS, SOURCES, MOVE_SLOTS, SLOT_LABELS } = await import(pathToFileURL(path.join(root, 'combat/data.mjs')));
const { MODES, CHALLENGES } = await import(pathToFileURL(path.join(root, 'combat/session.mjs')));
let evidence = {};
try { evidence = JSON.parse(await fs.readFile(path.join(root, 'docs/combat-qa-evidence.json'), 'utf8')); } catch {}
const statuses = ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'];
const qaStatuses = ['Réussi', 'Échec', 'Non exécuté', 'À vérifier'];
const colors = { ink: '#23243B', purple: '#5B3D86', header: '#44335F', pink: '#C16B8E', light: '#F4F0F8', gray: '#717184', rule: '#D5CBDD', amber: '#FFF1C9', good: '#E4F1E9', warning: '#FCEED8', pending: '#EAE7F1', bad: '#FBE0E0' };
const features = [];
function feature(id, area, name, status, priority, proof, acceptance, note = '') { features.push([id, area, name, status, priority, proof, acceptance, note, '']); }
const E = 'combat/engine.mjs', U = 'combat/app.mjs', S = 'combat/session.mjs', I = 'combat/input.mjs', R = 'combat/render.mjs';
[
  ['INT-01','Intégration','Application dans CainOS','Implémenté','P0','index.html / app.js','Ouvrir la fenêtre Combat depuis le bureau.'],
  ['INT-02','Intégration','Accès par le menu Démarrer','Implémenté','P0','index.html','La même application se lance depuis le menu.'],
  ['INT-03','Intégration','Version autonome','Implémenté','P0','combat/index.html','Charger directement le jeu sans démarrer CainOS.'],
  ['INT-04','Intégration','Moteur partagé OS et autonome','Implémenté','P0',E,'Les deux accès chargent exactement les mêmes modules.'],
  ['INT-05','Intégration','Pause à la fermeture et réduction','Implémenté','P0','app.js / combat/app.mjs','Le combat cesse lorsque sa fenêtre est masquée.'],
  ['INT-06','Intégration','Assemblage autonome exportable','Implémenté','P0','scripts/build-combat.mjs','Un dossier de build autonome contient tous les fichiers requis.'],
  ['INT-07','Intégration','Manifest d’installation','Partiel','P2','combat/manifest.webmanifest','Manifest et icône présents. Vérification PWA réelle et hors ligne encore requise.'],
  ['INT-08','Intégration','Installeur natif Windows / Linux','Prévu','P3','','Produire et vérifier un paquet natif autonome.','Le standalone livré est une application statique de navigateur.'],
  ['INT-09','Intégration','Application mobile native','Prévu','P3','','Produire et tester les paquets natifs.'],
  ['INT-10','Intégration','Déploiement public séparé','Prévu','P2','','Publier le standalone sur une URL dédiée.','La PR contient les sources et le build séparé.'],
  ['CQC-01','Moteur','Port du moteur CQC réel','Implémenté','P0',E,'La provenance identifie le commit et les modules copiés.'],
  ['CQC-02','Moteur','Simulation à pas fixe 60 Hz','Implémenté','P0',E,'Résultats identiques à 30, 60 et 120 Hz de rendu.'],
  ['CQC-03','Moteur','Dix emplacements de techniques','Implémenté','P0','combat/data.mjs','Chaque combattant possède les dix actions CQC.'],
  ['CQC-04','Moteur','Démarrage, actif, récupération','Implémenté','P0',E,'Le contact ne cause des dégâts que pendant les frames actives.'],
  ['CQC-05','Moteur','Hitboxes et hurtboxes distinctes','Implémenté','P0',E,'La collision dépend du corps et du mouvement.'],
  ['CQC-06','Moteur','Garde haute et basse','Implémenté','P0',E,'La garde haute laisse passer les coups bas.'],
  ['CQC-07','Moteur','Brisure de garde','Implémenté','P0',E,'Une garde épuisée ouvre une fenêtre de punition.'],
  ['CQC-08','Moteur','Saisies et déchopes','Implémenté','P0',E,'La garde ne bloque pas une saisie. Une déchope juste annule la prise.'],
  ['CQC-09','Moteur','Parades et réflexion','Implémenté','P0',E,'Une parade activée annule la bonne catégorie d’attaque.'],
  ['CQC-10','Moteur','Projectiles à portée limitée','Implémenté','P0',E,'La distance parcourue reste bornée, même après réflexion.'],
  ['CQC-11','Moteur','Pièges temporaires','Implémenté','P1',E,'Armement, limite de poses, durée et collision sont effectifs.'],
  ['CQC-12','Moteur','Ressource et jauge de finale','Implémenté','P0',E,'Un coût insuffisant refuse l’action sans dépense supplémentaire.'],
  ['CQC-13','Moteur','Combos et annulations confirmées','Implémenté','P0',E,'Une annulation exige un impact et un lien autorisé.'],
  ['CQC-14','Moteur','Protection contre les boucles','Implémenté','P1',E,'Dégradation des combos et protections post-saisie empêchent les verrouillages simples.'],
  ['CQC-15','Moteur','Sauts, accroupissement, dash','Implémenté','P0',E,'Les changements de hauteur et de direction sont utilisables.'],
  ['CQC-16','Moteur','Rounds et victoire de match','Implémenté','P0',E,'Le nombre de manches choisies détermine la victoire.'],
  ['CQC-17','Moteur','Égalité et double KO','Implémenté','P0',E,'Une égalité n’accorde pas arbitrairement la victoire au joueur 1.'],
  ['CQC-18','Moteur','IA déterministe','Implémenté','P0',E,'Une graine et les mêmes entrées reproduisent la simulation.'],
  ['CQC-19','Moteur','Difficultés CPU','Implémenté','P1',E,'Trois réglages exposés et comportement effectif.'],
  ['CQC-20','Moteur','Équilibrage compétitif complet','Prévu','P1','','Mesurer les matchs de chaque paire et corriger les avantages excessifs.','Les statistiques livrées sont un premier réglage.'],
  ['CQC-21','Moteur','Réseau et rollback','Prévu','P2','','Synchronisation, latence et désynchronisations testées sur plusieurs machines.'],
  ['CQC-22','Moteur','Tag team et assists','Prévu','P2','','Gestion de remplaçants, entrées et jauges d’assistance.'],
  ['CQC-23','Moteur','Tournoi à tableau','Prévu','P2','','Tableau persistant avec progression et reprises.'],
  ['CQC-24','Moteur','Finishers cinématiques propres','Prévu','P2','','Trois à cinq finales visuelles distinctes par personnage.','La technique super actuelle est jouable, les cinématiques dédiées restent à produire.'],
  ['MOD-01','Modes','Versus libre contre CPU','Implémenté','P0',U,'Choisir deux personnages et une arène sans objectif imposé.'],
  ['MOD-02','Modes','Duel local à deux','Implémenté','P0',I,'Deux jeux d’entrées indépendants contrôlent les deux combattants.'],
  ['MOD-03','Modes','Arcade en six matchs','Implémenté','P0',S,'Le résultat mène au match suivant jusqu’à Caine.'],
  ['MOD-04','Modes','Boss rush','Implémenté','P1',S,'Enchaîner la reine, The Fudge, l’abstraction et Caine.'],
  ['MOD-05','Modes','Survie en dix vagues','Implémenté','P1','combat/app.mjs / combat/session.mjs','La vie restante est reportée avec une récupération de 1 200 PV après victoire, plafonnée à 10 000.'],
  ['MOD-06','Modes','Entraînement configurable','Implémenté','P0',U,'Tester les actions contre un dummy avec remise à zéro.'],
  ['MOD-07','Modes','Six défis mesurables','Implémenté','P1',S,'Chaque défi possède un objectif et un résultat.'],
  ['MOD-08','Modes','Campagne scénarisée par épisode','Prévu','P2','','Routes, dialogues, combats et événements propres à chaque épisode.'],
  ['MOD-09','Modes','Histoire et fin par combattant','Prévu','P2','','Introductions et conclusions originales clairement séparées du canon.'],
  ['MOD-10','Modes','Coopération contre boss','Prévu','P2','','Deux joueurs actifs contre un adversaire commun.'],
  ['CTL-01','Commandes','Clavier AZERTY / QWERTY','Implémenté','P0',I,'Commandes affichées en fonction du clavier.'],
  ['CTL-02','Commandes','Directions relatives des spéciaux','Implémenté','P0',I,'Avant et arrière changent avec l’orientation du personnage.'],
  ['CTL-03','Commandes','Commandes tactiles','Implémenté','P0',I,'Maintiens multiples et relâchements fonctionnent.'],
  ['CTL-04','Commandes','Manettes standard','Implémenté','P1',I,'Les axes et boutons commandent les deux joueurs locaux.','Vérification matérielle réelle encore à mener.'],
  ['CTL-05','Commandes','Remappage individuel des touches','Prévu','P2','','Éditer et sauvegarder chaque liaison sans conflit.'],
  ['CTL-06','Commandes','Annulation des touches au blur','Implémenté','P0',I,'Aucune direction ne reste enfoncée après changement de fenêtre.'],
  ['CTL-07','Commandes','Pause et reprise explicites','Implémenté','P0',U,'Le temps et le combat sont figés pendant la pause.'],
  ['CTL-08','Commandes','Navigation intégrale au clavier','Partiel','P1','combat/index.html','Parcourir et activer toutes les vues et options sans souris.','Audit d’accessibilité complet requis.'],
  ['PRE-01','Présentation','Sélection de 14 combattants','Implémenté','P0','combat/data.mjs','Chaque combattant a une silhouette et un kit distincts.'],
  ['PRE-02','Présentation','Douze arènes thématiques','Implémenté','P0',R,'Chaque arène a une composition visuelle identifiable.'],
  ['PRE-03','Présentation','Variantes visuelles existantes','Implémenté','P1','combat/data.mjs','Choisir les variantes compatibles sans changer les mécaniques.'],
  ['PRE-04','Présentation','Catalogue de 179 apparences','Implémenté','P1','combat/sprite-catalog.mjs','Chaque atlas CainOS est listé et localisable.'],
  ['PRE-05','Présentation','Sprites de combat dédiés','Partiel','P1',R,'Chaque action possède des images cohérentes avec ses frames.','Sept planches existantes. Pose d’interaction réutilisée pour attaquer.'],
  ['PRE-06','Présentation','Décors finalisés par artiste','Partiel','P2',R,'Valider les décors et chaque couche de parallaxe.','Les arènes actuelles sont dessinées procéduralement.'],
  ['PRE-07','Présentation','Effets de contact et projectiles','Implémenté','P1',R,'Lire impacts, gardes, parades et projectiles pendant le combat.'],
  ['PRE-08','Présentation','Bruitages de combat','Partiel','P1',U,'Effets distincts et mixage vérifiés sur plusieurs appareils.','Synthèse sonore ou effets provisoires, aucune voix officielle importée.'],
  ['PRE-09','Présentation','Musique originale par arène','Prévu','P2','','Douze pistes originales avec boucles propres.'],
  ['PRE-10','Présentation','Voix et dialogues de combat','Prévu','P2','','Banque de voix autorisée et dialogues originaux cohérents.'],
  ['PRE-11','Présentation','Réduction des mouvements','Implémenté','P1',R,'Le réglage limite les effets non essentiels.'],
  ['PRE-12','Présentation','Palette et lecture daltonisme','Prévu','P2','','Les signaux critiques sont distincts sans dépendre seulement des couleurs.'],
  ['PRE-13','Présentation','Données de techniques dans le jeu','Implémenté','P1',U,'Afficher coût, portée, timing et effet des techniques.'],
  ['PRE-14','Présentation','Échelle et collisions cohérentes','Implémenté','P0',E,'Les colosses et Bubble ont des corps de collision propres.'],
  ['PRO-01','Progression','Profil local versionné','Implémenté','P0',S,'Les paramètres et statistiques persistent localement.'],
  ['PRO-02','Progression','Import et export de sauvegarde','Implémenté','P0',S,'Refuser les formats invalides et restaurer les données valides.'],
  ['PRO-03','Progression','Historique de matchs','Implémenté','P1',S,'Garder un historique borné des derniers résultats.'],
  ['PRO-04','Progression','Défis et médailles','Implémenté','P1',S,'Sauvegarder les défis réellement accomplis.'],
  ['PRO-05','Progression','Replays déterministes locaux','Implémenté','P1',S,'Relire les entrées avec la même graine et la même version.'],
  ['PRO-06','Progression','Synchronisation cloud des combats','Prévu','P2','','Conflits et synchronisation de profils gérés.','Le compte cloud CainOS existant ne suffit pas à établir cette fonctionnalité.'],
  ['PRO-07','Progression','Déblocages et économie','Prévu','P2','','Définir des conditions de déblocage lisibles et sans perte de contenu.'],
  ['PRO-08','Progression','Personnalisation de profils','Prévu','P3','','Noms, emblèmes et préférences par joueur.'],
  ['PRD-01','Production','Excel relié aux données du jeu','Implémenté','P0','scripts/build-combat-workbook.mjs','Régénérer les onglets depuis les définitions et conserver les preuves.'],
  ['PRD-02','Production','Inventaire reproductible des sprites','Implémenté','P0','scripts/build-combat-catalog.mjs','Extraction de toutes les entrées sans exécuter CainOS.'],
  ['PRD-03','Production','Tests déterministes du moteur','Implémenté','P0','tests/combat-engine.test.mjs','Les cas automatisés doivent tous passer dans le commit publié.'],
  ['PRD-04','Production','Contrôles navigateur OS / autonome','À vérifier','P0','docs/combat-qa-evidence.json','Vérifier les parcours réels et consigner les résultats.'],
  ['PRD-05','Production','Validation de lore du catalogue étendu','Partiel','P1','combat/data.mjs','Lier chaque entrée étendue à une source primaire vérifiée.','Les anciens textes CainOS restent identifiés comme archives du projet.'],
  ['PRD-06','Production','Validation visuelle de chaque costume','À vérifier','P1','combat/sprite-catalog.mjs','Contrôler recadrage, transparence et lisibilité des 74 variantes.'],
  ['PRD-07','Production','Tests matériels mobiles','À vérifier','P1','','Tester les gestes sur téléphone et tablette physiques.'],
  ['PRD-08','Production','Tests multi-manettes matériels','À vérifier','P1','','Tester deux manettes et leur déconnexion.'],
  ['PRD-09','Production','Parité de tous les modules CQC','Partiel','P2',E,'Comparer explicitement chaque module du CQC de référence.','Le moteur et la structure sont repris. Toutes les extensions MGS ne sont pas portées.'],
].forEach(row => feature(...row));
if (evidence.featureStatuses) for (const row of features) if (statuses.includes(evidence.featureStatuses[row[0]])) row[3] = evidence.featureStatuses[row[0]];

const roster = FIGHTERS.map(f => [f.id, f.name, f.role, 'Oui', 'Implémenté', 'Partiel', evidence.enginePassed ? 'Automatique réussi' : 'À vérifier', 'Partiel', MOVE_SLOTS.length, f.stats.health, f.power, f.speed, f.reach, f.sprite.src.replace('../',''), f.animation ? '8 cases / 5 familles de poses' : 'Portrait existant', f.loreSource, [f.boss ? 'Boss jouable avec statistiques de versus' : f.archive ? 'Simulation d’archive' : 'Simulation de combat', f.scaleNote].filter(Boolean).join('. '), `${f.combat.simulationBody.width} × ${f.combat.simulationBody.height} px · accroupi ${f.combat.simulationBody.crouchHeight} px`, `Saut ${f.stats.jump} px/frame · Défense ×${f.stats.defense} · ${f.combat.resource.label} ${f.combat.resource.max}, régénération ${f.combat.resource.regen}/frame`, f.combat.links.map(chain=>chain.map(slot=>SLOT_LABELS[slot]).join(' → ')).join(' · '), '']);
function moveDetails(m) {
  const parts=[`Niveau : ${m.level}`, `Catégorie : ${m.tag}`];
  const add=(key,label,unit='')=>{if(m[key]!==undefined)parts.push(`${label} : ${m[key]}${unit}`);};
  add('cooldown','Recharge',' frames');
  if(m.lowProfile)parts.push('Profil bas');
  if(m.status){add('status','Statut');add('duration','Durée du statut',' frames');}
  if(m.kind==='projectile'){
    for(const [key,label,unit] of [['speed','Vitesse',' px/frame'],['life','Vie',' frames'],['height','Hauteur',' px'],['count','Projectiles',''],['interval','Intervalle',' frames'],['returnAt','Retour après',' frames'],['bounces','Rebonds',''],['fuse','Explosion après',' frames'],['radius','Rayon',' px']])add(key,label,unit);
  }
  if(['melee','mobility'].includes(m.kind)){add('travel','Déplacement',' px/frame');add('launch','Projection verticale',' px/frame');}
  if(m.kind==='mobility')add('blink','Décalage instantané',' px');
  if(m.kind==='parry')add('parryMode','Parade');
  if(m.kind==='trap'){add('arm','Armement',' frames');add('duration','Durée',' frames');add('maxTraps','Pièges simultanés');add('hp','PV du piège');}
  if(m.kind==='buff'){add('buff','Bonus');add('duration','Durée',' frames');add('hits','Impacts protégés');}
  if(m.kind==='heal')add('heal','Soins récupérables',' PV');
  if(m.kind==='recover')add('restore','Stabilité récupérée');
  return parts.join(' · ');
}
const moveRows = MOVES.map(m => [m.id, m.fighterName, SLOT_LABELS[m.slot], m.name, m.kind, m.startup, m.active, m.recovery, m.damage || 0, m.reach || 0, m.cost || 0, m.meter || 0, moveDetails(m), evidence.enginePassed ? 'Implémenté' : 'À vérifier', 'À vérifier', 'adaptation', m.description, '']);
const stages = STAGES.map(s => [s.id, s.name, 'Implémenté', 'Partiel', s.theme, s.width, s.floor, s.bounds.left, s.bounds.right, 'Aucune collision de décor', 'Prévu', s.sourceId, s.description, s.sourceStatus || 'Décor adapté pour le duel', '']);
const variantIds = new Set(VARIANTS.map(v => v.id));
const atlas = ROSTER_ARCHIVE.map(a => {
  const variant=variantIds.has(a.id), effect=/VFX|accessoire|objet|trace|mask|parts/i.test(a.sourceAge+' '+a.id), priority=['max','chad','queenie','kaufmo','ghostly','angel','marthamildenhall','orbsman'].includes(a.id)?'P1':'P2';
  return [a.id, a.name, a.playable ? 'Combattant jouable' : variant ? 'Variante visuelle' : 'Archive consultable', a.baseFighterId || '', a.playable || variant ? 'Implémenté' : 'Partiel', 'À vérifier', a.sprite.sheet, a.sprite.src.replace('../',''), a.sprite.cols, a.sprite.rows, a.sprite.col, a.sprite.row, a.sourceAge, a.provenance, a.source, a.playable?'10 techniques':variant?'Kit du personnage parent':'Aucun kit', 'Animation dédiée à produire', a.playable?'Finaliser poses et équilibrage':variant?'Vérifier canon et produire poses de costume':effect?'Valider comme effet ou accessoire, pas comme personnage autonome':'Valider source et rôle puis concevoir le moveset ou le support', a.playable?'P1':priority, ''];
});

const production = [];
const poses = [
  ['idle','Attente','Boucle de respiration et silhouette stable.'], ['walk','Marche','Cycle des pieds sans glissement.'], ['jump','Saut','Départ, montée, descente et réception distincts.'], ['crouch','Accroupissement','Pose alignée sur la hurtbox basse.'], ['dash','Dash','Mouvement avant et arrière lisible.'],
  ['light','Coup léger','Démarrage, contact et retour correspondent aux frames.'], ['heavy','Coup fort','Préparation ample et retour distinct.'], ['low','Coup bas','Contact visuel à la hauteur effective.'], ['throw','Saisie','Aligner les deux corps pendant la projection.'], ['special','Spécial neutre','Préparation et départ du projectile ou de l’effet.'], ['specialDown','Spécial bas','Pose propre à la mécanique de piège ou de protection.'], ['specialForward','Spécial avant','Mouvement cohérent avec le déplacement.'], ['specialBack','Spécial arrière','Parade ou esquive lisible et distincte.'], ['super','Finale','Animation dédiée et effets adaptés au personnage.'], ['utility','Récupération','Pose de récupération et point d’interruption lisibles.'], ['hurt','Impact reçu','Réaction visible sans perdre l’ancrage des pieds.'], ['guard','Garde','Blocage haut et bas distinct.'], ['ko','KO','Chute et pose finale lisibles.'], ['victory','Victoire','Pose ou animation originale de fin de match.'], ['voice','Voix','Lignes originales enregistrées avec autorisation.']
];
for (const f of FIGHTERS) for (const [id,name,accept] of poses) {
  const available = f.animation && ['idle','walk','hurt'].includes(id);
  const partial = !available && id !== 'voice';
  production.push([`ART-${f.id}-${id}`, 'Personnage', f.name, name, available ? 'Implémenté' : partial ? 'Partiel' : 'Prévu', id === 'voice' ? 'P2' : ['light','heavy','low','throw','super'].includes(id) ? 'P1' : 'P2', available ? f.animation.src.replace('../','') : id !== 'voice' ? 'combat/render.mjs' : '', available ? 'Planche existante réutilisée' : id === 'voice' ? 'À créer' : 'Transformation du sprite ou pose réutilisée', accept, '']);
}
for (const s of STAGES) for (const [kind,label,accept] of [
  ['background','Fond et profondeur','Valider composition, couleurs et fidélité du lieu.'],['floor','Sol jouable','Aligner les pieds, ombres et ligne de combat.'],['foreground','Premier plan','Ajouter des détails sans masquer les attaques.'],['ambience','Ambiance sonore','Boucle originale sans coupure audible.'],['music','Musique de l’arène','Composition originale avec boucle et mixage.']
]) production.push([`ART-${s.id}-${kind}`, 'Arène', s.name, label, ['ambience','music'].includes(kind) ? 'Prévu' : 'Partiel', 'P2', ['ambience','music'].includes(kind) ? '' : R, ['ambience','music'].includes(kind) ? 'À produire' : 'Dessin procédural livré', accept, '']);
for (const [id,name] of [['light','Impact léger'],['heavy','Impact lourd'],['guard','Blocage'],['break','Brisure de garde'],['parry','Parade'],['throw','Saisie'],['tech','Déchope'],['dash','Dash'],['jump','Saut'],['projectile','Projectile numérique'],['trap','Piège'],['super','Finale'],['ko','KO'],['round','Annonce de manche'],['victory','Victoire'],['loss','Défaite'],['menu','Navigation menu'],['confirm','Validation']]) {
  const reused=['light','heavy','guard','round','victory','loss'].includes(id);
  production.push([`SFX-${id}`, 'Audio', 'Commun', name, reused?'Partiel':'Prévu', 'P1', reused?U:'', reused?'Tonalité synthétique générique':'À produire', 'Créer un son distinct et vérifier son volume dans le mix.', '']);
}
for (const f of FIGHTERS) production.push([`NAR-${f.id}`, 'Narration', f.name, 'Introduction et fin arcade', 'Prévu', 'P2', '', 'À écrire', 'Écrire une route originale cohérente avec le caractère sans la présenter comme canon.', '']);

const scenarioRows = CHALLENGES.map(c => [`CH-${c.id}`, 'Défi jouable', c.name, c.text, c.metric, c.goal, c.dummy, 'Implémenté', 'P1', S, '']);
scenarioRows.push(...MODES.filter(m=>['arcade','boss','survival'].includes(m.id)).map(m => [`RUN-${m.id}`, 'Parcours jouable', m.name, m.description, m.id === 'survival' ? 'Vagues' : 'Matchs', m.id === 'arcade' ? 6 : m.id === 'boss' ? 4 : 10, 'CPU', 'Implémenté', 'P1', S, '']));
for (const f of FIGHTERS) scenarioRows.push([`STORY-${f.id}`, 'Route individuelle prévue', `Route ${f.name}`, 'Introduction, rivalités, défis propres et conclusion.', 'Chapitres', null, 'À définir', 'Prévu', 'P2', '', '']);
for (const [n,title] of [[1,'Pilot'],[2,'Candy Carrier Chaos!'],[3,'The Mystery Of Mildenhall Manor'],[4,'Fast Food Masquerade']]) scenarioRows.push([`ARC-EP${n}`, 'Arc narratif prévu', title, 'Adapter les lieux et situations en rencontres de combat distinctes.', 'Rencontres', null, 'À écrire', 'Prévu', 'P2', `ep${n}`, '']);
scenarioRows.push(['ARC-LATE','Archives à vérifier','Épisodes et archives tardives CainOS','Vérifier les sources primaires avant d’écrire les routes tardives.','Rencontres',null,'À vérifier','À vérifier','P1','cainos','']);

const qa = [];
for (const suite of [
  { key: 'engine', prefix: 'ENG', area: 'Moteur automatisé', file: 'tests/combat-engine.test.mjs', expected: 'Vérification déterministe de mécanique' },
  { key: 'session', prefix: 'SES', area: 'Session automatisée', file: 'tests/combat-session.test.mjs', expected: 'Vérification de parcours, entrées ou persistance' },
]) {
  let testText;
  try { testText = await fs.readFile(path.join(root, suite.file), 'utf8'); } catch (error) { if (error.code === 'ENOENT' && suite.key === 'session') continue; throw error; }
  const names = evidence[`${suite.key}TestNames`] || [...testText.matchAll(/test\('([^']+)'/g)].map(m => m[1]);
  const passed = evidence[`${suite.key}Passed`] === true;
  if (passed && evidence[`${suite.key}SourceSha256`] && createHash('sha256').update(testText).digest('hex') !== evidence[`${suite.key}SourceSha256`]) throw new Error(`QA evidence does not match current ${suite.file}`);
  if (passed && evidence[`${suite.key}Count`] !== names.length) throw new Error(`QA evidence is stale for ${suite.file}: ${evidence[`${suite.key}Count`]} reported / ${names.length} defined`);
  for (const [i,name] of names.entries()) qa.push([`QA-${suite.prefix}-${String(i+1).padStart(2,'0')}`, suite.area, name, passed ? 'Réussi' : 'Non exécuté', 'P0', `node ${suite.file}`, passed ? evidence[`${suite.key}Proof`] || 'Exécution Node rapportée' : '', suite.expected, '']);
}
const browserCases = [
  ['boot','Intégration','Démarrer CainOS et ouvrir le combat','P0','Le bureau et les applications existantes restent utilisables.'],
  ['standalone','Intégration','Ouvrir le standalone sans CainOS','P0','Le menu et le combat se chargent directement.'],
  ['pause-window','Intégration','Réduire et fermer la fenêtre Combat','P0','Le combat et le son se mettent en pause.'],
  ['reopen','Intégration','Rouvrir la fenêtre Combat','P0','Reprise contrôlée, aucune boucle doublée.'],
  ['roster','Présentation','Choisir chacun des 14 combattants','P0','Le nom, le sprite et le kit correspondent.'],
  ['costumes','Présentation','Vérifier les 74 variantes','P1','Silhouette complète, pas de bordure ni de recadrage incorrect.'],
  ['stages','Présentation','Vérifier les 12 arènes','P1','Décors distincts, aucun combattant masqué.'],
  ['local','Commandes','Jouer un duel local complet','P0','Deux joueurs et résultat sans conflit d’entrées.'],
  ['arcade','Parcours','Terminer un arcade de six matchs','P1','Progression et fin de parcours fonctionnelles.'],
  ['boss','Parcours','Terminer le boss rush','P1','Tous les adversaires prévus apparaissent.'],
  ['survival','Parcours','Vérifier le report de vie en survie','P0','Le prochain match conserve les PV restants + 1 200 de récupération, sans dépasser 10 000.'],
  ['training','Parcours','Tester chaque dummy d’entraînement','P1','Comportement, réglage et reset réels.'],
  ['challenges','Parcours','Terminer les six défis','P1','Chaque métrique déclenche uniquement son objectif.'],
  ['save','Persistance','Exporter puis importer un profil','P0','Les réglages et statistiques sont restaurés.'],
  ['replay','Persistance','Enregistrer puis relire un match','P0','Gagnant, vie et positions finales concordent.'],
  ['bad-save','Persistance','Importer JSON invalide et mauvais format','P0','Message clair, profil existant préservé.'],
  ['mobile-layout','Accessibilité','Parcourir le jeu en petit viewport','P1','Aucun contrôle essentiel hors écran.'],
  ['mobile-device','Matériel','Jouer sur téléphone physique','P1','Gestes multiples, rotation et volume fonctionnent.'],
  ['gamepads','Matériel','Jouer avec deux manettes physiques','P1','Assignation et déconnexion testées.'],
  ['focus','Accessibilité','Naviguer dans tous les menus au clavier','P1','Focus visible et ordre cohérent.'],
  ['motion','Accessibilité','Activer réduction des mouvements','P1','Effets réduits sans perte de signaux de combat.'],
  ['fps','Performance','Mesurer plusieurs matchs sur matériel modeste','P1','Cadence et mémoire stables après plusieurs reprises.'],
  ['build','Distribution','Servir les deux builds générés','P0','Aucune ressource requise absente.'],
  ['regression','Régression','Exécuter les audits CainOS existants','P0','Aucune régression des contrats existants.'],
];
for (const [id,area,name,priority,expected] of browserCases) {
  const q = evidence.cases?.[id];
  if (q && (!qaStatuses.includes(q.status) || (q.status === 'Réussi' && !q.proof))) throw new Error(`Invalid or unsupported QA evidence: ${id}`);
  qa.push([`QA-${id}`, area, name, q?.status || 'Non exécuté', priority, q?.method || 'Parcours navigateur ou matériel réel', q?.proof || '', expected, '']);
}
for (const q of evidence.additionalCases || []) {
  if (!q.id || !qaStatuses.includes(q.status) || (q.status === 'Réussi' && !q.proof)) throw new Error('Additional QA evidence requires an ID, valid status and proof for success');
  qa.push([`QA-${q.id}`, q.area || 'Navigateur automatisé', q.name, q.status, q.priority || 'P1', q.method || 'Parcours navigateur automatisé', q.proof || '', q.expected || '', '']);
}
if (new Set(qa.map(row => row[0])).size !== qa.length) throw new Error('Duplicate QA evidence IDs');

const workbook = Workbook.create();
const sheets = Object.fromEntries(['Synthèse','Fonctionnalités','Combattants','Techniques','Arènes','Atlas','Production','Scénarios','QA','Références'].map(name => [name,workbook.worksheets.add(name)]));
for (const sheet of Object.values(sheets)) sheet.showGridLines = false;
const tables = [];
function column(n) { let s=''; for(let x=n;x;x=Math.floor((x-1)/26))s=String.fromCharCode(65+(x-1)%26)+s; return s; }
function statusRules(range) {
  for (const [text,fill,color] of [['Implémenté',colors.good,'#23513D'],['Partiel',colors.warning,'#79501D'],['Prévu',colors.pending,'#56496D'],['À vérifier',colors.amber,'#805B00'],['Réussi',colors.good,'#23513D'],['Échec',colors.bad,'#A12A2A'],['Non exécuté',colors.pending,'#56496D']]) range.conditionalFormats.add('containsText',{text,format:{fill,font:{color}}});
}
function makeTable(name,title,subtitle,headers,rows,{widths=[],statusCols=[],qaCols=[],numericCols=[],percentCols=[],inputCols=[]}={}) {
  const sheet=sheets[name], last=rows.length+5, end=column(headers.length);
  sheet.getRange(`A1:${end}${last}`).format.font={name:'Arial',size:10,color:colors.ink};
  sheet.getRange(`A1:${end}${last}`).format.verticalAlignment='center';
  sheet.getRange(`A1:${end}${last}`).format.rowHeight=24;
  sheet.getRange('A2').values=[[title]];sheet.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:colors.purple};sheet.getRange('A2').format.rowHeight=31;
  sheet.getRange('A3').values=[[subtitle]];sheet.getRange('A3').format.font={name:'Arial',size:10,italic:true,color:colors.gray};
  sheet.getRange(`A4:${end}4`).format.borders={bottom:{style:'thin',color:colors.rule}};
  sheet.getRange(`A5:${end}${last}`).values=[headers,...rows];
  const table=sheet.tables.add(`A5:${end}${last}`,true,`Encore${name.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}`);
  table.style='TableStyleLight1';table.showFilterButton=true;
  sheet.getRange(`A5:${end}5`).format={fill:colors.header,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},rowHeight:34,wrapText:true,horizontalAlignment:'center',verticalAlignment:'center',borders:{insideVertical:{style:'thin',color:'#FFFFFF'}}};
  sheet.getRange(`A6:${end}${last}`).format.wrapText=true;
  rows.forEach((values,index)=>{
    const lines=Math.max(1,...values.map((value,c)=>Math.ceil(String(value??'').length/((widths[c]||22)*1.1))));
    const row=sheet.getRange(`A${index+6}:${end}${index+6}`);
    row.format.rowHeight=Math.max(29,lines*13+6);
    row.format.fill=index%2===0?colors.light:'#FFFFFF';
  });
  for(let c=1;c<=headers.length;c++)sheet.getRange(`${column(c)}5:${column(c)}${last}`).format.columnWidth=widths[c-1]||22;
  for(const c of numericCols){const range=sheet.getRange(`${column(c)}6:${column(c)}${last}`);range.setNumberFormat('#,##0');range.format.horizontalAlignment='right';}
  for(const c of percentCols)sheet.getRange(`${column(c)}6:${column(c)}${last}`).setNumberFormat('0.0%');
  for(const c of statusCols){const range=sheet.getRange(`${column(c)}6:${column(c)}${last}`);range.dataValidation={rule:{type:'list',values:statuses}};statusRules(range);}
  for(const c of qaCols){const range=sheet.getRange(`${column(c)}6:${column(c)}${last}`);range.dataValidation={rule:{type:'list',values:qaStatuses}};statusRules(range);}
  for(const c of inputCols)sheet.getRange(`${column(c)}6:${column(c)}${last}`).format.fill=colors.amber;
  sheet.freezePanes.freezeRows(5);sheet.freezePanes.freezeColumns(2);
  tables.push({name,rows:rows.length,last,headers});
  return sheet;
}
makeTable('Fonctionnalités','Fonctionnalités et écarts CQC','Statut modifiable. Les preuves désignent le code livré, sans remplacer les essais de l’onglet QA.', ['ID','Domaine','Fonction','Statut','Priorité','Preuve dans le dépôt','Critère de validation','Limite ou contexte','Notes utilisateur'],features,{widths:[14,18,44,18,12,42,84,80,40],statusCols:[4],inputCols:[9]});
makeTable('Combattants','Combattants jouables','Les techniques sont des adaptations de jeu. La finition graphique reste distincte du fonctionnement du moteur.', ['ID','Nom','Style','Jouable','Gameplay','Graphismes','Test moteur','État global','Techniques','PV','Puissance','Vitesse','Portée','Sprite','Animation source','Référence','Contexte','Corps de collision','Simulation et ressource','Chaînes après impact','Notes utilisateur'],roster,{widths:[24,28,20,12,18,18,24,18,14,12,12,12,12,65,31,16,46,46,80,90,40],statusCols:[5,6,8],numericCols:[9,10,11,12,13],inputCols:[21]});
sheets['Combattants'].getRange(`K6:M${roster.length+5}`).setNumberFormat('0.00');
makeTable('Techniques','Techniques et données de combat','60 Hz. Dégâts et portées de base avant coefficients du personnage. La portée de mêlée part du centre du corps.', ['ID','Combattant','Emplacement','Technique','Mécanique','Début (frames)','Actif (frames)','Retour (frames)','Dégâts base','Portée (px)','Stabilité','Jauge finale','Paramètres actifs','Mécanique livrée','Équilibrage','Référence','Utilisation','Notes utilisateur'],moveRows,{widths:[37,27,22,31,18,15,15,16,15,15,13,14,95,20,18,16,80,40],statusCols:[14,15],numericCols:[6,7,8,9,10,11,12],inputCols:[18]});
makeTable('Arènes','Arènes de combat','Douze compositions procédurales. Les dangers de scène et les assets artistiques finaux restent séparés.', ['ID','Arène','Jouable','Art final','Thème','Largeur (px)','Sol Y (px)','Borne gauche','Borne droite','Collisions du décor','Dangers','Référence','Description','Provenance','Notes utilisateur'],stages,{widths:[17,29,18,18,18,17,17,17,17,32,18,16,83,70,40],statusCols:[3,4,11],numericCols:[6,7,8,9],inputCols:[15]});
makeTable('Atlas','Inventaire des apparences CainOS','Chaque entrée de l’atlas est conservée. Le champ source historique est reproduit sans certifier ses affirmations de lore.', ['ID atlas','Nom du projet','Usage combat','Combattant parent','Intégration','Validation canon','Planche','Fichier','Colonnes','Lignes','Colonne (0)','Ligne (0)','Libellé historique CainOS','Provenance','Source','Kit de combat','Animations dédiées','Prochaine action','Priorité','Notes utilisateur'],atlas,{widths:[30,39,26,25,18,20,24,70,13,13,15,15,55,95,95,29,36,95,13,40],statusCols:[5,6],numericCols:[9,10,11,12],inputCols:[20]});
makeTable('Production','Production graphique, sonore et narrative','Une pose réutilisée compte comme partielle. Les nouveaux assets possèdent chacun un critère de finition.', ['ID','Domaine','Personnage ou lieu','Élément','Statut','Priorité','Fichier actuel','État des ressources','Critère de finition','Notes utilisateur'],production,{widths:[40,18,31,29,18,12,70,46,94,40],statusCols:[5],inputCols:[10]});
makeTable('Scénarios','Défis et parcours','Les parcours jouables et les futures routes narratives disposent de statuts séparés.', ['ID','Type','Nom','Objectif','Mesure','Cible','Adversaire','Statut','Priorité','Preuve ou source','Notes utilisateur'],scenarioRows,{widths:[31,31,43,97,19,13,20,18,12,40,40],statusCols:[8],numericCols:[6],inputCols:[11]});
makeTable('QA','Validation du jeu','Un résultat réussi exige une exécution consignée. Les essais matériels restent identifiés séparément.', ['ID','Domaine','Cas de contrôle','Résultat','Priorité','Méthode','Preuve d’exécution','Résultat attendu','Notes utilisateur'],qa,{widths:[27,22,110,20,12,68,95,100,40],qaCols:[4],inputCols:[9]});

const refs=sheets['Références'];
const referenceRows=SOURCES.map(s=>[s.id,s.title,s.kind,s.url,s.scope]);
makeTable('Références','Références et méthode','Dates et état du contenu : 21 octobre 2026. Les sources de fiction ne valident pas les statistiques du jeu.', ['ID','Référence','Type','URL ou fichier','Périmètre'],referenceRows,{widths:[18,58,24,110,110]});
const refStart=referenceRows.length+9;
refs.getRange(`A${refStart}:E${refStart+10}`).values=[
  ['Lecture du suivi','Définition','','',''],
  ['Implémenté','Présent dans le code livré. Consulter QA pour savoir quels parcours ont été effectivement exécutés.','','',''],
  ['Partiel','Une partie fonctionne. Le critère de finition précise le travail restant.','','',''],
  ['Prévu','Élément détaillé mais pas livré dans cette PR.','','',''],
  ['À vérifier','Il manque une validation ou une preuve suffisante.','','',''],
  ['Hors périmètre','Élément explicitement exclu du périmètre de cette version.','','',''],
  ['Lore','Les techniques et jauges sont adaptées pour le jeu. Les textes historiques du projet ne font pas autorité.','','',''],
  ['Actualiser','Régénérer après les changements de combat/data.mjs et des preuves QA.','','',''],
  ['Notes utilisateur','Les colonnes jaunes servent aux décisions manuelles. Les reporter avant de régénérer le fichier.','','',''],
  ['Progression','La synthèse compte les lignes par statut. Aucun taux global ne mélange techniques, sprites et fonctionnalités.','','',''],
  ['Limites QA','Les tests automatiques ne constituent pas une validation artistique ni une session sur appareil physique.','','',''],
];
refs.getRange(`A${refStart}:E${refStart+10}`).format.font={name:'Arial',size:10,color:colors.ink};
refs.getRange(`A${refStart}:E${refStart}`).format={fill:colors.light,font:{bold:true,color:colors.purple}};
refs.getRange(`A${refStart}:E${refStart+10}`).format.rowHeight=26;
refs.getRange(`B${refStart+1}:E${refStart+10}`).format.wrapText=false;

const summary=sheets['Synthèse'];summary.tabColor=colors.purple;
summary.getRange('A1:H34').format={font:{name:'Arial',size:10,color:colors.ink},verticalAlignment:'center',rowHeight:26};
summary.getRange('A1:A34').format.columnWidth=37;
summary.getRange('B1:F34').format.columnWidth=18;
summary.getRange('G1:G34').format.columnWidth=3;
summary.getRange('H1:H34').format.columnWidth=55;
summary.getRange('A2').values=[[GAME.name]];summary.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:colors.purple};summary.getRange('A2').format.rowHeight=33;
summary.getRange('A3').values=[['Suivi du combat intégré à CainOS et du standalone']];summary.getRange('A3').format.font={italic:true,color:colors.gray};
summary.getRange('H2').values=[['État du 21 octobre 2026']];
summary.getRange('A4:H4').format.borders={bottom:{style:'thin',color:colors.rule}};
summary.getRange('A6:F6').values=[['Contenu livré','Nombre','Art final','Équilibrage','Source','']];
summary.getRange('A7:A11').values=[['Combattants jouables'],['Techniques définies'],['Arènes jouables'],['Apparences inventoriées'],['Variantes compatibles']];
summary.getRange('B7').formulas=[[`=COUNTA('Combattants'!A6:A${roster.length+5})`]];
summary.getRange('B8').formulas=[[`=COUNTA('Techniques'!A6:A${moveRows.length+5})`]];
summary.getRange('B9').formulas=[[`=COUNTA('Arènes'!A6:A${stages.length+5})`]];
summary.getRange('B10').formulas=[[`=COUNTA('Atlas'!A6:A${atlas.length+5})`]];
summary.getRange('B11').formulas=[[`=COUNTIFS('Atlas'!C6:C${atlas.length+5},"Variante visuelle")`]];
summary.getRange('C7:F11').values=[['Partiel','À vérifier','Combattants',''],['Partiel','À vérifier','Techniques',''],['Partiel','À vérifier','Arènes',''],['Existant','n.a.','Atlas',''],['Existant','n.a.','Atlas','']];
summary.getRange('H6:H10').values=[['Priorités de finition'],['Animations de combat dédiées'],['Équilibrage des 14 kits'],['Validation des costumes et du lore'],['Essais tactiles et manettes réels']];
summary.getRange('H6').format.font={bold:true,color:colors.purple};
summary.getRange('H12:H16').values=[['Preuves disponibles'],[`${evidence.enginePassed?evidence.engineCount:0} tests moteur + ${evidence.sessionPassed?evidence.sessionCount:0} tests session`],[`${(evidence.additionalCases||[]).filter(q=>q.status==='Réussi').length} contrôles navigateur réussis`],['Le total QA inclut les objectifs de revue.'],['Leurs assertions peuvent se recouper.']];
summary.getRange('H12').format.font={bold:true,color:colors.purple};
summary.getRange('A14:F14').values=[['Suivi par domaine','Implémenté','Partiel','Prévu','À vérifier','Total']];
const metrics=[['Fonctionnalités','Fonctionnalités',4,features.length],['Production d’assets','Production',5,production.length],['Scénarios et parcours','Scénarios',8,scenarioRows.length],['Intégration des apparences','Atlas',5,atlas.length]];
metrics.forEach(([label,name,col,count],i)=>{
  const row=i+15;summary.getRange(`A${row}`).values=[[label]];
  for(let c=2;c<=5;c++)summary.getRange(`${column(c)}${row}`).formulas=[[`=COUNTIFS('${name}'!${column(col)}$6:${column(col)}$${count+5},${column(c)}$14)`]];
  summary.getRange(`F${row}`).formulas=[[`=COUNTA('${name}'!A6:A${count+5})`]];
});
summary.getRange('A21:F21').values=[['Validation','Réussi','Échec','Non exécuté','À vérifier','Total']];
summary.getRange('A22').values=[['Cas documentés']];
for(let c=2;c<=5;c++)summary.getRange(`${column(c)}22`).formulas=[[`=COUNTIFS('QA'!D6:D${qa.length+5},${column(c)}21)`]];
summary.getRange('F22').formulas=[[`=COUNTA('QA'!A6:A${qa.length+5})`]];
summary.getRange('A25').values=[['Prochaine revue']];summary.getRange('A25').format.font={bold:true,color:colors.purple};
summary.getRange('A26').values=[['Filtrer Fonctionnalités sur P0 puis sur les statuts incomplets.']];
summary.getRange('A27').values=[['Filtrer Production par personnage pour préparer ses animations.']];
summary.getRange('A28').values=[['Reporter les essais effectivement exécutés dans QA avec une preuve.']];
summary.getRange('A30').values=[['Les nombres décrivent le contenu du jeu, pas une certification de finition commerciale.']];summary.getRange('A30').format.font={italic:true,color:colors.gray};
for(const range of ['A6:F6','A14:F14','A21:F21'])summary.getRange(range).format={fill:colors.header,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},horizontalAlignment:'center',rowHeight:31};
for(const range of ['A7:F11','A15:F18','A22:F22'])summary.getRange(range).format.borders={bottom:{style:'thin',color:colors.rule}};
summary.getRange('B7:B11').setNumberFormat('#,##0');summary.getRange('B15:F18').setNumberFormat('#,##0');summary.getRange('B22:F22').setNumberFormat('#,##0');
statusRules(summary.getRange('C7:D11'));

await fs.mkdir(out,{recursive:true});await fs.mkdir(previewDir,{recursive:true});
workbook.recalculate();
const snapshot=await workbook.inspect({kind:'table',range:'Synthèse!A6:F22',include:'values,formulas',tableMaxRows:17,tableMaxCols:6,maxChars:7000});
console.log(snapshot.ndjson);
const errors=await workbook.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:40},summary:'Formula errors'});
console.log(errors.ndjson);
const expectedCounts=[FIGHTERS.length,MOVES.length,STAGES.length,ROSTER_ARCHIVE.length,VARIANTS.length];
const actualCounts=summary.getRange('B7:B11').values.flat();
if(actualCounts.some((n,i)=>n!==expectedCounts[i]))throw new Error(`Summary mismatch: ${actualCounts} / ${expectedCounts}`);
const formulaErrors=summary.getRange('A1:H34').values.flat().filter(value=>typeof value==='string'&&/^#(REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/.test(value));
if(formulaErrors.length)throw new Error(`Formula errors: ${formulaErrors.join(', ')}`);
// A real input change must update the summary. Restore before final export.
const oldFeature=sheets['Fonctionnalités'].getRange('D6').values[0][0];
const oldCount=summary.getRange('B15').values[0][0];
sheets['Fonctionnalités'].getRange('D6').values=[['Prévu']];workbook.recalculate();
if(oldFeature==='Implémenté'&&summary.getRange('B15').values[0][0]!==oldCount-1)throw new Error('Status summary did not recalculate');
sheets['Fonctionnalités'].getRange('D6').values=[[oldFeature]];workbook.recalculate();
for(const name of Object.keys(sheets).filter(name=>!renderSheets.length||renderSheets.includes(name))){
  const range=name==='Synthèse'?'A1:H31':name==='Références'?'A1:C12':name==='Techniques'?'A1:H12':name==='QA'?'A1:D12':name==='Production'?'A1:F12':name==='Atlas'?'A1:F12':'A1:F12';
  const preview=await workbook.render({sheetName:name,range,scale:1,format:'png'});
  await fs.writeFile(path.join(previewDir,`${name.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}.png`),new Uint8Array(await preview.arrayBuffer()));
  const detailRange=name==='QA'?`A${Math.max(5,qa.length-4)}:D${qa.length+5}`:name==='Techniques'?'I5:R15':name==='Combattants'?'N5:U11':name==='Atlas'?'P5:T11':null;
  if(detailRange){const detail=await workbook.render({sheetName:name,range:detailRange,scale:1,format:'png'});await fs.writeFile(path.join(previewDir,`${name.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}-details.png`),new Uint8Array(await detail.arrayBuffer()));}
}
const file=await SpreadsheetFile.exportXlsx(workbook);
await file.save(path.join(out,'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx'));
const qaSummary=Object.fromEntries(qaStatuses.map(status=>[status,qa.filter(row=>row[3]===status).length]));
const data={version:GAME.version,asOf:GAME.contentDate,counts:{fighters:FIGHTERS.length,moves:MOVES.length,stages:STAGES.length,atlas:ROSTER_ARCHIVE.length,variants:VARIANTS.length,features:features.length,production:production.length,scenarios:scenarioRows.length,qa:qa.length},qaSummary,features,roster,moves:moveRows,stages,atlas,production,scenarios:scenarioRows,qa,sources:SOURCES};
await fs.writeFile(path.join(out,'combat-tracker-data.json'),JSON.stringify(data,null,2)+'\n');
const sourceDigests={};
for(const name of ['combat/data.mjs','combat/sprite-catalog.mjs','combat/session.mjs','tests/combat-engine.test.mjs','tests/combat-session.test.mjs','docs/combat-qa-evidence.json','scripts/build-combat-workbook.mjs']){
  try{sourceDigests[name]=createHash('sha256').update(await fs.readFile(path.join(root,name))).digest('hex');}catch(error){if(error.code!=='ENOENT')throw error;}
}
await fs.writeFile(path.join(out,'combat-workbook-verification.json'),JSON.stringify({createdAt:new Date().toISOString(),counts:data.counts,qaSummary,verifiedSummary:actualCounts,formulaErrors:0,statusMutationRecalculated:true,renderedSheets:renderSheets.length?renderSheets:Object.keys(sheets),qaEvidencePresent:!!Object.keys(evidence).length,sourceDigests},null,2)+'\n');
console.log(JSON.stringify({file:path.join(out,'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx'),counts:data.counts,previews:previewDir},null,2));
