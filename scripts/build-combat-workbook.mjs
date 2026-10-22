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
let evidence = {};
try { evidence = JSON.parse(await fs.readFile(path.join(root, 'docs/combat-qa-evidence.json'), 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) throw new Error('QA evidence must be a JSON object');
const { GAME, FIGHTERS, MOVES, STAGES, ROSTER_ARCHIVE, VARIANTS, SOURCES, MOVE_SLOTS, SLOT_LABELS } = await import(pathToFileURL(path.join(root, 'combat/data.mjs')));
if (evidence.gameVersion && evidence.gameVersion !== GAME.version) throw new Error(`QA evidence belongs to ${evidence.gameVersion}, not the current ${GAME.version}`);
const { MODES, CHALLENGES, REPLAY_VERSIONS } = await import(pathToFileURL(path.join(root, 'combat/session.mjs')));
const { STORY_ROUTES, STORY_NOTICE } = await import(pathToFileURL(path.join(root, 'combat/stories.mjs')));
const { AUDIO_THEMES, AUDIO_EFFECT_IDS, AUDIO_EFFECT_ALIASES } = await import(pathToFileURL(path.join(root, 'combat/audio.mjs')));
const { ART_FILES, ART_BYTES } = await import(pathToFileURL(path.join(root, 'combat/offline-manifest.mjs')));
const { FIDELITY_SOURCES } = await import(pathToFileURL(path.join(root, 'combat/fidelity.mjs')));
const { ANIMATION_REGISTRATION } = await import(pathToFileURL(path.join(root, 'combat/render-poses.mjs')));
const fidelitySources = new Map([...SOURCES, ...FIDELITY_SOURCES].map(source => [source.id, source]));
const fidelityHeaders = ['Références de fidélité', 'Repères observés', 'Adaptation du combat', 'État de la revue', 'Périmètre de revue'];
const fidelityWidths = [95, 88, 95, 28, 95];
const costumeHeaders = ['Revue technique du costume', 'Repères visibles dans notre sprite', 'Identité et rattachement', 'Cadrage du sprite', 'Transparence du sprite', 'Proportions du sprite', 'Points à revoir', 'Capture ou repère de revue'];
const costumeWidths = [30, 85, 80, 75, 75, 80, 85, 65];
function fidelityCells(record, id) {
  if (!record || !Array.isArray(record.sourceIds) || !Array.isArray(record.observedTraits)) throw new Error(`Missing fidelity record: ${id}`);
  if (record.sourceIds.some(sourceId => typeof sourceId !== 'string' || !sourceId.trim()) || new Set(record.sourceIds).size !== record.sourceIds.length) throw new Error(`Invalid fidelity source IDs: ${id}`);
  if (record.observedTraits.some(trait => typeof trait !== 'string' || !trait.trim())) throw new Error(`Invalid observed fidelity traits: ${id}`);
  if (!record.sourceIds.length && record.observedTraits.length) throw new Error(`Observed fidelity traits require a primary source: ${id}`);
  for (const field of ['combatAdaptation', 'reviewStatus', 'reviewScope']) if (typeof record[field] !== 'string' || !record[field].trim()) throw new Error(`Missing fidelity ${field}: ${id}`);
  const references = record.sourceIds.map(sourceId => {
    const source = fidelitySources.get(sourceId);
    if (!source?.url || !/^https:\/\//.test(source.url)) throw new Error(`Missing fidelity reference URL: ${id} / ${sourceId}`);
    return `${sourceId} : ${source.url}`;
  });
  const referenceText = references.join('\n') || (record.reviewStatus === 'Création originale' ? 'Sans référence canonique : création originale' : 'Aucune source primaire rattachée');
  return [referenceText, record.observedTraits.join('\n') || 'Aucun repère visuel consigné dans cette revue.', record.combatAdaptation, record.reviewStatus, record.reviewScope];
}
function costumeCells(variant) {
  const review = variant.fidelity?.assetReview;
  if (!review || !Array.isArray(review.visibleTraits) || !Array.isArray(review.issues)) throw new Error(`Missing costume asset review: ${variant.id}`);
  for (const field of ['status', 'identityEvidence', 'framing', 'transparency', 'proportions', 'captureId']) if (typeof review[field] !== 'string' || !review[field].trim()) throw new Error(`Missing costume asset review ${field}: ${variant.id}`);
  for (const field of ['visibleTraits', 'issues']) if (review[field].some(value => typeof value !== 'string' || !value.trim())) throw new Error(`Invalid costume asset review ${field}: ${variant.id}`);
  const capture = review.captureId.match(/^([a-zA-Z0-9._-]+)#([a-zA-Z0-9_-]+)$/);
  if (!capture || capture[2] !== variant.id) throw new Error(`Untraceable costume capture: ${variant.id}`);
  const crop = variant.sprite.sourceRect;
  const framing = crop ? `${review.framing}\nRectangle actif : x ${crop.x}, y ${crop.y}, largeur ${crop.width}, hauteur ${crop.height} px source. Les coordonnées de grille restent historiques.` : review.framing;
  return [review.status, review.visibleTraits.join('\n'), review.identityEvidence, framing, review.transparency, review.proportions, review.issues.join('\n') || 'Aucun point supplémentaire consigné dans cette revue.', `${review.captureId}\nPlanche : docs/images/${capture[1]}.png`, ...fidelityCells(variant.fidelity, variant.id)];
}
const contentDateLabel = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${GAME.contentDate}T00:00:00Z`));
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
  ['INT-07','Intégration','Installation web du standalone','Implémenté','P2','combat/manifest.webmanifest / combat/offline.mjs','Manifest, icônes et commande d’installation lorsque le navigateur la propose.','L’installation dépend des capacités du navigateur. Les paquets natifs restent des tâches séparées.'],
  ['INT-08','Intégration','Installeur natif Windows / Linux','Prévu','P3','','Produire et vérifier un paquet natif autonome.','Le standalone livré est une application statique de navigateur.'],
  ['INT-09','Intégration','Application mobile native','Prévu','P3','','Produire et tester les paquets natifs.'],
  ['INT-10','Intégration','Déploiement public séparé','Prévu','P2','','Publier le standalone sur une URL dédiée.','La PR contient les sources et le build séparé.'],
  ['INT-11','Intégration','Préparation et jeu hors ligne','Implémenté','P1','combat/offline.mjs / combat/sw.js',`Télécharger ${ART_FILES.length} planches (${ART_BYTES.toLocaleString('fr-FR')} octets) à la demande, afficher la progression puis recharger le jeu sans réseau.`,'La première préparation requiert le réseau et assez de stockage. Le service worker reste limité au jeu. Une mise à jour du code préserve un pack d’illustrations inchangé.'],
  ['INT-12','Intégration','Reprise après échec de première installation','À vérifier','P0','combat/offline.mjs / combat/app.mjs','Afficher un échec explicite si la première installation du service worker échoue, libérer les attentes et permettre une nouvelle tentative depuis les réglages.','Le jeu en ligne reste accessible. La réussite hors ligne exige une installation et une préparation effectivement terminées.'],
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
  ['CQC-23','Moteur','Tournoi à tableau','Implémenté','P2','combat/progression.mjs / combat/app.mjs','Huit participants distincts, sept rencontres de tableau et trois victoires joueur pour gagner. Graine et résultats reconstruisent le tournoi à la reprise.','Les rencontres sans le joueur sont simulées et affichées comme telles. Une défaite élimine le joueur.'],
  ['CQC-24','Moteur','Finishers cinématiques propres','Prévu','P2','','Trois à cinq finales visuelles distinctes par personnage.','La technique super actuelle est jouable, les cinématiques dédiées restent à produire.'],
  ['MOD-01','Modes','Versus libre contre CPU','Implémenté','P0',U,'Choisir deux personnages et une arène sans objectif imposé.'],
  ['MOD-02','Modes','Duel local à deux','Implémenté','P0',I,'Deux jeux d’entrées indépendants contrôlent les deux combattants.'],
  ['MOD-03','Modes','Arcade en six matchs','Implémenté','P0',S,'Le résultat mène au match suivant jusqu’à Caine.'],
  ['MOD-04','Modes','Boss rush','Implémenté','P1',S,'Enchaîner la reine, The Fudge, l’abstraction et Caine.'],
  ['MOD-05','Modes','Survie en dix vagues','Implémenté','P1','combat/app.mjs / combat/session.mjs','La vie restante est reportée avec une récupération de 1 200 PV après victoire, plafonnée à 10 000.'],
  ['MOD-06','Modes','Entraînement configurable','Implémenté','P0',U,'Tester les actions contre un dummy avec remise à zéro.'],
  ['MOD-07','Modes','Six défis mesurables','Implémenté','P1',S,'Chaque défi possède un objectif et un résultat.'],
  ['MOD-08','Modes','Campagne scénarisée par épisode','Prévu','P2','','Routes, dialogues, combats et événements propres à chaque épisode.'],
  ['MOD-09','Modes','Histoire et fin par combattant','Implémenté','P2','combat/stories.mjs / combat/progression.mjs','Quatorze routes individuelles : introduction, quatre rencontres avec dialogues et arènes propres, puis conclusion.','Scénarios originaux de fan-game. Les campagnes par épisode restent distinctes.'],
  ['MOD-10','Modes','Coopération contre boss','Prévu','P2','','Deux joueurs actifs contre un adversaire commun.'],
  ['CTL-01','Commandes','Clavier AZERTY / QWERTY','Implémenté','P0',I,'Commandes affichées en fonction du clavier.'],
  ['CTL-02','Commandes','Directions relatives des spéciaux','Implémenté','P0',I,'Avant et arrière changent avec l’orientation du personnage.'],
  ['CTL-03','Commandes','Commandes tactiles','Implémenté','P0',I,'Maintiens multiples et relâchements fonctionnent.'],
  ['CTL-04','Commandes','Manettes standard','Implémenté','P1',I,'Les axes et boutons commandent les deux joueurs locaux.','Vérification matérielle réelle encore à mener.'],
  ['CTL-05','Commandes','Remappage individuel des touches','Implémenté','P2','combat/bindings.mjs / combat/input.mjs / combat/app.mjs','Éditer les liaisons des deux joueurs, refuser les conflits et sauvegarder le réglage. Les libellés affichés suivent les touches effectives.'],
  ['CTL-06','Commandes','Annulation des touches au blur','Implémenté','P0',I,'Aucune direction ne reste enfoncée après changement de fenêtre.'],
  ['CTL-07','Commandes','Pause et reprise explicites','Implémenté','P0',U,'Le temps et le combat sont figés pendant la pause.'],
  ['CTL-08','Commandes','Navigation intégrale au clavier','Partiel','P1','combat/index.html','Parcourir et activer toutes les vues et options sans souris.','Audit d’accessibilité complet requis.'],
  ['PRE-01','Présentation','Sélection de 14 combattants','Implémenté','P0','combat/data.mjs','Chaque combattant a une silhouette et un kit distincts.'],
  ['PRE-02','Présentation','Douze arènes thématiques','Implémenté','P0',R,'Chaque arène a une composition visuelle identifiable et un aperçu synchronisé avec la sélection.','Les douze aperçus sont distincts. La comparaison aux visuels officiels est limitée aux trois vues du chapiteau, du cellier et du Vide consignées dans QA.'],
  ['PRE-03','Présentation','Variantes visuelles existantes','Implémenté','P1','combat/data.mjs / combat/app.mjs',`Choisir les ${VARIANTS.length} variantes sans changer les mécaniques ; prévisualiser les apparences de J1/J2 et comparer le costume à sa base dans la garde-robe.`,'La classification de l’identité, le contrôle du sprite et la comparaison au canon ont chacun une portée distincte. Les autres archives conservent leur statut sans kit.'],
  ['PRE-04','Présentation','Catalogue de 179 apparences','Implémenté','P1','combat/sprite-catalog.mjs','Chaque atlas CainOS est listé et localisable.'],
  ['PRE-05','Présentation','Sprites de combat dédiés','Partiel','P1','combat/render.mjs / combat/render-poses.mjs','Chaque action possède des images cohérentes avec ses frames, une silhouette lisible et un ancrage stable.','Les poses composées ou les transformations du rendu restent distinctes des sprites dédiés. Le détail des états et des cellules effectivement vérifiés figure dans QA ; les nouvelles poses dessinées restent à produire.'],
  ['PRE-06','Présentation','Décors finalisés par artiste','Partiel','P2',R,'Valider les décors et chaque couche de parallaxe.','Les arènes restent des recompositions procédurales. Trois vues sont comparées aux images GLITCH ; le couloir des résidents et la finition complète restent à revoir.'],
  ['PRE-07','Présentation','Effets de contact et projectiles','Implémenté','P1','combat/render.mjs / combat/render-presentation.mjs',`Lire impacts, gardes, parades et objets du kit : ${MOVES.filter(move=>move.kind==='projectile').length} définitions de projectile et ${MOVES.filter(move=>move.kind==='trap').length} pièges.`,'Les motifs identifient les accessoires du fan-game, y compris après réflexion. Ils ne certifient aucune capacité de combat canonique.'],
  ['PRE-08','Présentation','Bruitages de combat','Partiel','P1','combat/audio.mjs',`${AUDIO_EFFECT_IDS.length} motifs synthétiques livrés ; finaliser les effets encore partagés et vérifier le mixage sur plusieurs appareils.`,'Les impacts léger/lourd et certains événements utilisent le même motif. Aucune voix officielle importée.'],
  ['PRE-09','Présentation','Musique originale par arène','Implémenté','P2','combat/audio.mjs',`${Object.keys(AUDIO_THEMES).length} thèmes procéduraux originaux, un par arène, avec mélodie, basse, rythme et tempo propres. Réglages musique et bruitages séparés.`,'Musique optionnelle, silencieuse par défaut. Le menu adapte le thème du chapiteau. Validation du mixage matériel encore requise.'],
  ['PRE-10','Présentation','Voix et dialogues de combat','Prévu','P2','','Banque de voix autorisée et dialogues originaux cohérents.'],
  ['PRE-11','Présentation','Réduction des mouvements','Implémenté','P1',R,'Le réglage limite les effets non essentiels.'],
  ['PRE-12','Présentation','Palette et lecture daltonisme','Prévu','P2','','Les signaux critiques sont distincts sans dépendre seulement des couleurs.'],
  ['PRE-13','Présentation','Données de techniques dans le jeu','Implémenté','P1',U,'Afficher coût, portée, timing et effet des techniques.'],
  ['PRE-14','Présentation','Échelle et collisions cohérentes','Implémenté','P0','combat/engine.mjs / combat/render.mjs / combat/render-poses.mjs','Conserver les proportions des sprites et les ancrages du rendu, tout en gardant les corps de collision propres aux colosses et à Bubble.','Les dimensions de simulation, la mise en place du sprite et les proportions canoniques sont trois contrôles distincts. Une correction de présentation ne modifie pas les règles du duel.'],
  ['PRE-15','Présentation','Références consultables dans les fiches du jeu','À vérifier','P1','combat/app.mjs / combat/fidelity.mjs / combat/costume-fidelity.mjs','Consulter les sources et limites du combattant, de chaque costume et de l’arène ; distinguer l’inspection de nos sprites des repères canoniques.','L’interface indique le périmètre de revue ; un lien officiel ne constitue pas à lui seul une validation de l’image rendue.'],
  ['PRO-01','Progression','Profil local versionné','Implémenté','P0',S,'Les paramètres et statistiques persistent localement.'],
  ['PRO-02','Progression','Import et export de sauvegarde','Implémenté','P0',S,'Refuser les formats invalides et restaurer les données valides.'],
  ['PRO-03','Progression','Historique de matchs','Implémenté','P1',S,'Garder un historique borné des derniers résultats.'],
  ['PRO-04','Progression','Défis et médailles','Implémenté','P1',S,'Sauvegarder les défis réellement accomplis.'],
  ['PRO-05','Progression','Replays déterministes locaux','Implémenté','P1',S,'Relire les entrées avec la même graine et les règles de leur version.',`Les replays ${REPLAY_VERSIONS.join(', ')} sont distingués ; les détails de compatibilité sont vérifiés dans QA.`],
  ['PRO-06','Progression','Synchronisation cloud des combats','Prévu','P2','','Conflits et synchronisation de profils gérés.','Le compte cloud CainOS existant ne suffit pas à établir cette fonctionnalité.'],
  ['PRO-07','Progression','Déblocages et économie','Prévu','P2','','Définir des conditions de déblocage lisibles et sans perte de contenu.'],
  ['PRO-08','Progression','Personnalisation de profils','Prévu','P3','','Noms, emblèmes et préférences par joueur.'],
  ['PRO-09','Progression','Reprise des programmes en cours','Implémenté','P0','combat/progression.mjs / combat/session.mjs','Arcade, boss, survie, histoire et tournoi reprennent la rencontre courante avec la même graine, les mêmes règles et la santé de départ enregistrée.','Le point de reprise est le début du duel, sans restauration d’une frame de simulation intermédiaire.'],
  ['PRO-10','Progression','Récupération du profil après checkpoint invalide','À vérifier','P0','combat/session.mjs / combat/app.mjs','Au chargement local, abandonner uniquement le programme actif invalide et conserver les réglages, statistiques, défis, médailles, fins narratives et historique encore valides.','La prochaine sauvegarde conserve le profil normalisé. L’import manuel reste strict et refuse le fichier invalide sans remplacer le profil courant.'],
  ['PRD-01','Production','Excel relié aux données du jeu','Implémenté','P0','scripts/build-combat-workbook.mjs','Régénérer les onglets depuis les définitions et conserver les preuves.'],
  ['PRD-02','Production','Inventaire reproductible des sprites','Implémenté','P0','scripts/build-combat-catalog.mjs','Extraction de toutes les entrées sans exécuter CainOS.'],
  ['PRD-03','Production','Tests déterministes du moteur','Implémenté','P0','tests/combat-engine.test.mjs','Les cas automatisés doivent tous passer dans le commit publié.'],
  ['PRD-04','Production','Contrôles navigateur OS / autonome','À vérifier','P0','docs/combat-qa-evidence.json','Vérifier les parcours réels et consigner les résultats.'],
  ['PRD-05','Production','Validation de lore du catalogue étendu','Partiel','P1','combat/data.mjs','Lier chaque entrée étendue à une source primaire vérifiée.','Les anciens textes CainOS restent identifiés comme archives du projet.'],
  ['PRD-06','Production','Revue visuelle de chaque costume','À vérifier','P1','combat/costume-fidelity.mjs / combat/sprite-catalog.mjs',`Consigner les repères visibles, l’identité, le cadre, la transparence, les proportions, les points à revoir et la capture de chacune des ${VARIANTS.length} variantes.`,'Une revue technique achevée peut signaler des défauts restants. Elle ne valide pas automatiquement le costume au regard de la série.'],
  ['PRD-07','Production','Tests matériels mobiles','À vérifier','P1','','Tester les gestes sur téléphone et tablette physiques.'],
  ['PRD-08','Production','Tests multi-manettes matériels','À vérifier','P1','','Tester deux manettes et leur déconnexion.'],
  ['PRD-09','Production','Parité de tous les modules CQC','Partiel','P2',E,'Comparer explicitement chaque module du CQC de référence.','Le moteur et la structure sont repris. Toutes les extensions MGS ne sont pas portées.'],
  ['PRD-10','Production','Classement explicite de toutes les apparences','Implémenté','P0','combat/data.mjs / tests/combat-catalog.test.mjs',`Réconcilier ${FIGHTERS.length} combattants, ${VARIANTS.length} variantes compatibles et ${ROSTER_ARCHIVE.length-FIGHTERS.length-VARIANTS.length} archives sans kit, soit ${ROSTER_ARCHIVE.length} entrées conservées.`,'Tout nouvel identifiant reste sans kit tant que sa classification n’a pas été revue.'],
  ['PRD-11','Production','Références et adaptations de chaque fiche','À vérifier','P0','combat/fidelity.mjs / combat/costume-fidelity.mjs / combat/data.mjs',`Documenter ${FIGHTERS.length} combattants, ${MOVES.length} techniques, ${STAGES.length} arènes et ${VARIANTS.length} costumes : références disponibles, repères observés, adaptations et sources manquantes ou créations originales.`,'Les observations sur nos sprites restent séparées des repères officiels. Le périmètre est conservé par fiche, sans certification graphique globale.'],
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
const stages = STAGES.map(s => [s.id, s.name, 'Implémenté', 'Partiel', s.theme, s.width, s.floor, s.bounds.left, s.bounds.right, 'Aucune collision de décor', 'Prévu', s.sourceId, `${s.description}\nMusique : ${AUDIO_THEMES[s.id]?.title || 'À produire'} · ${AUDIO_THEMES[s.id]?.bpm || '—'} BPM.`, s.sourceStatus || 'Décor adapté pour le duel', '']);
for (const [index, row] of roster.entries()) row.splice(-1, 0, ...fidelityCells(FIGHTERS[index].fidelity, FIGHTERS[index].id));
for (const [index, row] of moveRows.entries()) row.splice(-1, 0, ...fidelityCells(MOVES[index].fidelity, MOVES[index].id));
for (const [index, row] of stages.entries()) row.splice(-1, 0, ...fidelityCells(STAGES[index].fidelity, STAGES[index].id));
const variantsById = new Map(VARIANTS.map(variant => [variant.id, variant]));
const variantIds = new Set(variantsById.keys());
const atlas = ROSTER_ARCHIVE.map(a => {
  const variant=variantIds.has(a.id), priority=['max','chad','queenie','kaufmo','ghostly','angel','marthamildenhall','orbsman'].includes(a.id)?'P1':'P2';
  const nextAction = a.playable ? 'Finaliser poses et équilibrage. Consulter les repères et limites de la fiche Combattants.' : variant ? 'Traiter les points de la revue technique, puis comparer individuellement ce costume à ses références. La fiche du personnage parent ne valide pas cette apparence.' : 'Valider le rôle narratif ou décoratif avant toute nouvelle intégration.';
  const review = variant ? costumeCells(variantsById.get(a.id)) : [a.playable ? 'Voir la fiche Combattants' : 'Archive sans kit — hors revue costume', ...Array(costumeHeaders.length + fidelityHeaders.length - 1).fill('')];
  return [a.id, a.name, a.playable ? 'Combattant jouable' : variant ? 'Variante visuelle' : 'Archive consultable', a.baseFighterId || '', a.playable || variant ? 'Implémenté' : 'Partiel', 'À vérifier', a.sprite.sheet, a.sprite.src.replace('../',''), a.sprite.cols, a.sprite.rows, a.sprite.col, a.sprite.row, a.sourceAge, a.provenance, a.source, a.playable?'10 techniques':variant?'Kit du personnage parent':'Aucun kit', a.playable||variant?'Animation dédiée à produire':'Aucune animation de combat attribuée', `${a.classificationReason} ${nextAction}`, a.playable?'P1':priority, ...review, ''];
});

const production = [];
const poses = [
  ['idle','Attente','Boucle de respiration avec proportions stables et ancrage au sol.'], ['walk','Marche','Cycle lisible sans glissement des pieds ni variation involontaire de hauteur.'], ['jump','Saut','Départ, montée, descente et réception distincts ; ancrage cohérent avec la position en l’air.'], ['crouch','Accroupissement','Pose basse lisible sans écrasement non uniforme de la silhouette ; position au sol et volume apparent à contrôler. Les règles de hurtbox restent séparées.'], ['dash','Dash','Mouvement avant et arrière lisible ; proportions et ancrage préservés.'],
  ['light','Coup léger','Démarrage, contact et retour correspondent aux frames.'], ['heavy','Coup fort','Préparation ample et retour distinct.'], ['low','Coup bas','Contact visuel à la hauteur effective.'], ['throw','Saisie','Aligner les deux corps pendant la projection.'], ['special','Spécial neutre','Préparation et départ du projectile ou de l’effet.'], ['specialDown','Spécial bas','Pose propre à la mécanique de piège ou de protection.'], ['specialForward','Spécial avant','Mouvement cohérent avec le déplacement.'], ['specialBack','Spécial arrière','Parade ou esquive lisible et distincte.'], ['super','Finale','Animation dédiée et effets adaptés au personnage.'], ['utility','Récupération','Pose de récupération et point d’interruption lisibles.'], ['hurt','Impact reçu','Réaction visible sans perdre les proportions ni l’ancrage des pieds.'], ['guard','Garde','Blocages haut et bas distincts sans étirer le personnage.'], ['ko','KO','Chute et pose finale lisibles, sans enfoncement involontaire dans le sol.'], ['victory','Victoire','Pose ou animation originale de fin de match, stable au sol.'], ['voice','Voix','Lignes originales enregistrées avec autorisation.']
];
for (const f of FIGHTERS) for (const [id,name,accept] of poses) {
  const available = f.animation && ['idle','walk','hurt'].includes(id);
  const partial = !available && id !== 'voice';
  const registration = ANIMATION_REGISTRATION[f.id];
  const reused = available ? `Planche existante réutilisée${registration ? ` ; ${registration.anchors.length} cellules avec racine et appui source` : ''}` : id === 'voice' ? 'À créer' : id === 'crouch' ? registration?.crouchRig ? `Pose basse composée depuis idle : segments rigides, baisse de ${registration.crouchRig.drop} px source ; aucune pose dédiée dessinée` : 'Dessin intact ; pose basse dédiée non disponible pour cette morphologie' : 'État composé à partir des cellules ou du sprite existant ; aucun nouveau dessin dédié';
  production.push([`ART-${f.id}-${id}`, 'Personnage', f.name, name, available ? 'Implémenté' : partial ? 'Partiel' : 'Prévu', id === 'voice' ? 'P2' : ['light','heavy','low','throw','super'].includes(id) ? 'P1' : 'P2', available ? f.animation.src.replace('../','') : id !== 'voice' ? 'combat/render.mjs / combat/render-poses.mjs' : '', reused, accept, '']);
}
for (const s of STAGES) for (const [kind,label,accept] of [
  ['background','Fond et profondeur','Comparer composition et couleurs aux références de la fiche Arènes, puis consigner les vues réellement revues.'],['floor','Sol jouable','Aligner les pieds, ombres et ligne de combat.'],['foreground','Premier plan','Ajouter des détails sans masquer les attaques.'],['ambience','Ambiance sonore','Boucle originale sans coupure audible.'],['music','Musique de l’arène','Composition originale avec boucle et mixage.']
]) {
  const music = kind === 'music' ? AUDIO_THEMES[s.id] : null;
  production.push([`ART-${s.id}-${kind}`, 'Arène', s.name, label, music ? 'Implémenté' : kind === 'ambience' ? 'Prévu' : 'Partiel', 'P2', music ? 'combat/audio.mjs' : kind === 'ambience' ? '' : R, music ? `${music.title} · ${music.bpm} BPM · ${music.provenance}` : kind === 'ambience' ? 'Ambiance dédiée à produire' : 'Dessin procédural livré', music ? 'Boucle procédurale avec mélodie, basse et rythme ; pause et volume séparé. Mixage à écouter sur appareils réels.' : accept, '']);
}
const soundTasks = {
  light: ['damage', true], heavy: ['damage', true], guard: ['block', false], break: ['guardBreak', false],
  parry: ['parry', false], throw: ['damage', true], tech: ['throwTech', true], dash: ['dash', false], jump: ['jump', false],
  projectile: ['special', false], trap: [null, false], super: ['super', false], ko: [null, false], round: ['start', false],
  victory: ['win', false], loss: ['lose', false], menu: ['select', false], confirm: ['select', true],
};
for (const [id,name] of [['light','Impact léger'],['heavy','Impact lourd'],['guard','Blocage'],['break','Brisure de garde'],['parry','Parade'],['throw','Saisie'],['tech','Déchope'],['dash','Dash'],['jump','Saut'],['projectile','Projectile numérique'],['trap','Piège'],['super','Finale'],['ko','KO'],['round','Annonce de manche'],['victory','Victoire'],['loss','Défaite'],['menu','Navigation menu'],['confirm','Validation']]) {
  const [sound, shared] = soundTasks[id];
  production.push([`SFX-${id}`, 'Audio', 'Commun', name, sound ? shared ? 'Partiel' : 'Implémenté' : 'Prévu', 'P1', sound ? 'combat/audio.mjs' : '', sound ? `Motif ${AUDIO_EFFECT_ALIASES[sound] || sound}${shared ? ' partagé avec un autre événement' : ' disponible'}` : 'Motif spécifique à produire', 'Créer un son distinct et vérifier son volume dans le mix. Les essais sur appareils physiques restent séparés du fonctionnement du module.', '']);
}
const effectLabels = { damage: 'Impact', block: 'Blocage', parry: 'Parade', guardBreak: 'Brisure de garde', jump: 'Saut', dash: 'Dash', special: 'Spécial', super: 'Finale', start: 'Début de rencontre', win: 'Victoire', lose: 'Défaite', select: 'Sélection', back: 'Retour', denied: 'Action refusée', recover: 'Récupération', explosion: 'Explosion' };
for (const id of AUDIO_EFFECT_IDS) production.push([`SYNTH-${id}`, 'Motif sonore', 'Commun', effectLabels[id] || id, 'Implémenté', 'P1', 'combat/audio.mjs', `Synthèse originale ; alias : ${Object.entries(AUDIO_EFFECT_ALIASES).filter(([,target])=>target===id).map(([alias])=>alias).join(', ') || 'aucun'}`, 'Oscillateurs bornés, enveloppe courte, volume indépendant et arrêt à la pause. Un motif peut servir plusieurs événements.', '']);
production.push(['MUSIC-menu', 'Audio', 'Menu', 'Arrangement du menu', 'Implémenté', 'P2', 'combat/audio.mjs', `${AUDIO_THEMES.bigtop.title} · ${AUDIO_THEMES.bigtop.bpm * .8} BPM · arrangement allégé`, 'Le menu utilise le thème du chapiteau ralenti et sans la section rythmique du combat.', '']);
for (const f of FIGHTERS) {
  const route = STORY_ROUTES[f.id];
  production.push([`NAR-${f.id}`, 'Narration', f.name, 'Introduction, quatre scènes et fin', route ? 'Implémenté' : 'Prévu', 'P2', route ? 'combat/stories.mjs' : '', route ? `${route.title} · ${route.chapters.length} rencontres écrites` : 'À écrire', 'Route originale avec introduction, dialogues avant chaque rencontre et conclusion. Les événements ne sont pas présentés comme canoniques.', '']);
}

const scenarioRows = CHALLENGES.map(c => [`CH-${c.id}`, 'Défi jouable', c.name, c.text, c.metric, c.goal, c.dummy, 'Implémenté', 'P1', S, '']);
scenarioRows.push(...MODES.filter(m=>['arcade','boss','survival'].includes(m.id)).map(m => [`RUN-${m.id}`, 'Parcours jouable', m.name, m.description, m.id === 'survival' ? 'Vagues' : 'Matchs', m.id === 'arcade' ? 6 : m.id === 'boss' ? 4 : 10, 'CPU', 'Implémenté', 'P1', S, '']));
const fighterName = id => FIGHTERS.find(f => f.id === id)?.name || id;
const stageName = id => STAGES.find(s => s.id === id)?.name || id;
for (const f of FIGHTERS) {
  const route = STORY_ROUTES[f.id];
  if (!route || route.chapters.length !== 4) throw new Error(`Incomplete authored story route: ${f.id}`);
  scenarioRows.push([`STORY-${f.id}`, 'Route individuelle', `${f.name} · ${route.title}`, `Introduction : ${route.intro}\nConclusion : ${route.ending}`, 'Rencontres', route.chapters.length, route.chapters.map(c => fighterName(c.opponentId)).join(' → '), 'Implémenté', 'P1', 'combat/stories.mjs / combat/progression.mjs', '']);
  for (const [i, chapter] of route.chapters.entries()) scenarioRows.push([
    `STORY-${f.id}-${i+1}`, 'Chapitre jouable', `${i+1}. ${chapter.title}`,
    `${chapter.summary}\nArène : ${stageName(chapter.stageId)}.\n${chapter.dialogue.map(line => `${line.speaker} : ${line.text}`).join('\n')}`,
    'Victoire', 1, fighterName(chapter.opponentId), 'Implémenté', 'P1', 'combat/stories.mjs', '',
  ]);
}
scenarioRows.push(['RUN-tournament', 'Tournoi à tableau', MODES.find(mode=>mode.id==='tournament')?.name || 'Le tournoi à huit', 'Huit participants, quarts de finale, demi-finales et finale. Il faut trois victoires jouées pour gagner ; les rencontres sans le joueur sont simulées et indiquées comme telles. Une égalité relance la même rencontre. Une défaite élimine le joueur et le tableau détermine le champion restant.', 'Tours du joueur', 3, '7 adversaires tirés avec graine', 'Implémenté', 'P1', 'combat/progression.mjs', '']);
for (const [n,title] of [[1,'Pilot'],[2,'Candy Carrier Chaos!'],[3,'The Mystery Of Mildenhall Manor'],[4,'Fast Food Masquerade']]) scenarioRows.push([`ARC-EP${n}`, 'Arc narratif prévu', title, 'Adapter les lieux et situations en rencontres de combat distinctes.', 'Rencontres', null, 'À écrire', 'Prévu', 'P2', `ep${n}`, '']);
scenarioRows.push(['ARC-LATE','Archives à vérifier','Épisodes et archives tardives CainOS','Vérifier les sources primaires avant d’écrire les routes tardives.','Rencontres',null,'À vérifier','À vérifier','P1','cainos','']);

const qa = [];
const coreSuites = [
  { key: 'engine', prefix: 'ENG', area: 'Moteur automatisé', file: 'tests/combat-engine.test.mjs', expected: 'Vérification déterministe de mécanique' },
  { key: 'session', prefix: 'SES', area: 'Session automatisée', file: 'tests/combat-session.test.mjs', expected: 'Vérification de parcours, entrées ou persistance' },
];
const suiteInfo = {
  catalog: ['CAT', 'Classification du catalogue', '179 archives préservées ; identités, costumes et exclusions explicitement validés'],
  bindings: ['BIND', 'Commandes personnalisables', 'Liaisons indépendantes, conflits rejetés et entrées cohérentes après remappage'],
  progression: ['PROG', 'Programmes et reprise', 'Routes, tournoi déterministe et points de reprise validés'],
  audio: ['AUD', 'Audio synthétique', 'Thèmes et effets définis ; cycle de vie du son vérifié'],
  fidelity: ['FID', 'Références de fidélité', 'Sources, repères observés et adaptations distingués pour chaque fiche'],
  render: ['RENDER', 'Détourage et objets du kit', 'Transparence et couleurs préservées ; identité visuelle des objets vérifiée dans le périmètre du test'],
  'render-matte': ['MATTE', 'Palette et pixels des costumes', 'Correction locale des rubans de Gangle, protection des régions exclues et conservation RGBA explicite des trois cellules Shadow'],
  'render-poses': ['POSE', 'Silhouettes, ancrages et états', 'Racines source, articulation rigide limitée et échelle uniforme ; la présentation ne modifie ni les règles ni les données de simulation'],
  replay: ['REPLAY', 'Compatibilité des replays', 'Version et règles de lecture vérifiées sans altérer le profil'],
  offline: ['OFFLINE', 'Installation web', 'Échecs explicites, nouvelle tentative, délais bornés et ressources libérées'],
  pwa: ['PWA', 'Distribution hors ligne', 'Cache, portée et reprise hors ligne vérifiés'],
};
const discoveredSuites = (await fs.readdir(path.join(root, 'tests'))).filter(name => /^combat-.*\.test\.mjs$/.test(name) && !['combat-engine.test.mjs', 'combat-session.test.mjs'].includes(name)).sort().map(name => {
  const key = name.slice(7, -9), [prefix, area, expected] = suiteInfo[key] || [key.toUpperCase(), 'Contrat automatisé', 'Vérification automatique du module livré'];
  return { key, prefix, area, expected, file: `tests/${name}` };
});
const nodeSuites = [...coreSuites, ...discoveredSuites];
for (const suite of nodeSuites) {
  let testText;
  try { testText = await fs.readFile(path.join(root, suite.file), 'utf8'); } catch (error) { if (error.code === 'ENOENT' && suite.key === 'session') continue; throw error; }
  const names = evidence[`${suite.key}TestNames`] || [...testText.matchAll(/test\('([^']+)'/g)].map(m => m[1]);
  const passed = evidence[`${suite.key}Passed`] === true;
  if (passed && (!Array.isArray(names) || !names.length || !/^[0-9a-f]{64}$/.test(evidence[`${suite.key}SourceSha256`] || '') || !evidence[`${suite.key}Proof`])) throw new Error(`Successful QA evidence requires test names, source digest and proof for ${suite.file}`);
  if (passed && evidence[`${suite.key}SourceSha256`] && createHash('sha256').update(testText).digest('hex') !== evidence[`${suite.key}SourceSha256`]) throw new Error(`QA evidence does not match current ${suite.file}`);
  if (passed && evidence[`${suite.key}Count`] !== names.length) throw new Error(`QA evidence is stale for ${suite.file}: ${evidence[`${suite.key}Count`]} reported / ${names.length} defined`);
  for (const [i,name] of names.entries()) qa.push([`QA-${suite.prefix}-${String(i+1).padStart(2,'0')}`, suite.area, name, passed ? 'Réussi' : 'Non exécuté', 'P0', `node ${suite.file}`, passed ? evidence[`${suite.key}Proof`] || 'Exécution Node rapportée' : '', suite.expected, '']);
}
const reviewCases = [
  ['boot','Intégration','Démarrer CainOS et ouvrir le combat','P0','Le bureau et les applications existantes restent utilisables.'],
  ['standalone','Intégration','Ouvrir le standalone sans CainOS','P0','Le menu et le combat se chargent directement.'],
  ['pause-window','Intégration','Réduire et fermer la fenêtre Combat','P0','Le combat et le son se mettent en pause.'],
  ['reopen','Intégration','Rouvrir la fenêtre Combat','P0','Reprise contrôlée, aucune boucle doublée.'],
  ['roster','Présentation','Choisir chacun des 14 combattants','P0','Le nom, le sprite et le kit correspondent.'],
  ['costumes','Présentation',`Vérifier les ${VARIANTS.length} variantes`,'P1','Chaque costume a une revue du sprite et une capture traçable ; cadrage, transparence, proportions et défauts sont consignés. Les aperçus J1/J2 et la garde-robe montrent la bonne apparence avec ses limites de revue.'],
  ['stages','Présentation','Vérifier les 12 arènes','P1','Décors distincts, aucun combattant masqué.'],
  ['local','Commandes','Jouer un duel local complet','P0','Deux joueurs et résultat sans conflit d’entrées.'],
  ['arcade','Parcours','Terminer un arcade de six matchs','P1','Progression et fin de parcours fonctionnelles.'],
  ['boss','Parcours','Terminer le boss rush','P1','Tous les adversaires prévus apparaissent.'],
  ['survival','Parcours','Vérifier le report de vie en survie','P0','Le prochain match conserve les PV restants + 1 200 de récupération, sans dépasser 10 000.'],
  ['story','Parcours','Jouer une route narrative jusqu’à sa conclusion','P0','Les quatre rencontres suivent leurs arènes, dialogues et adversaires ; la fin correspond au combattant choisi.'],
  ['tournament','Parcours','Terminer un tournoi et vérifier son tableau','P0','Huit participants, quatre quarts, deux demies et une finale ; les résultats joués et simulés sont distingués.'],
  ['program-resume','Persistance','Recharger puis reprendre un programme actif','P0','Le même combat recommence au point de reprise documenté, avec sa graine, son adversaire et sa santé de départ.'],
  ['profile-recovery','Persistance','Récupérer un profil local dont le programme est invalide','P0','Seul le checkpoint invalide est abandonné ; les autres données valides survivent aux réglages, au rechargement et aux événements inter-onglets. L’import manuel demeure strict.'],
  ['bindings','Commandes','Remapper les deux joueurs et refuser un conflit','P0','Une touche personnalisée fonctionne en combat ; les doublons sont refusés ; les réglages survivent au rechargement.'],
  ['offline','Distribution','Recharger le standalone sans réseau après préparation','P0','Après mise en cache réussie, le menu et un combat chargé restent disponibles hors ligne sans l’environnement CainOS.'],
  ['offline-install-recovery','Distribution','Échouer puis relancer la première installation hors ligne','P0','Un téléchargement essentiel en erreur produit un état explicite ; Réessayer démarre une nouvelle installation après retour du réseau, sans attente ni écouteur abandonné.'],
  ['audio','Présentation','Vérifier thèmes, mixage et pause sonore','P1','Chaque arène possède son thème ; la musique suit le réglage, se suspend pendant la pause et n’empile pas de boucles à la reprise.'],
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
  ['tracker-proof','Production du suivi','Refuser une preuve corrompue avant génération','P0','JSON invalide, type invalide et erreurs de lecture sont rejetés ; le fichier Excel existant est préservé.'],
  ['fidelity-sources','Références','Relier chaque fiche à ses sources et adaptations','P0','Combattants, techniques, arènes et costumes exposent leurs références disponibles, repères et portée de revue. Les observations techniques de nos sprites sont séparées des repères officiels ; les sources manquantes et créations originales restent explicites.'],
  ['fidelity-ui','Présentation','Consulter les sources depuis les fiches du jeu','P1','Le codex, les costumes de la garde-robe et l’aperçu d’arène présentent leurs propres repères, adaptations et URL, sans débordement des vues vérifiées.'],
  ['fidelity-render','Présentation','Vérifier silhouettes, ancrages, états et objets','P0','Les captures et assertions précisent les personnages, costumes, cellules, états et objets effectivement vérifiés. Proportions, transparence et ancrage du rendu sont distingués des collisions et de la comparaison au canon.'],
  ['fidelity-canon','Présentation','Comparer le rendu aux plans officiels cités','P1','Chaque validation précise le plan source, le personnage ou le lieu et la pose comparée. Une capture du jeu seule ne certifie pas la fidélité à la série.'],
];
for (const [id,area,name,priority,expected] of reviewCases) {
  const q = evidence.cases?.[id];
  if (q && (!qaStatuses.includes(q.status) || (q.status === 'Réussi' && !q.proof))) throw new Error(`Invalid or unsupported QA evidence: ${id}`);
  qa.push([`QA-${id}`, area, name, q?.status || 'Non exécuté', priority, q?.method || 'Parcours navigateur ou matériel réel', q?.proof || '', expected, '']);
}
for (const q of evidence.additionalCases || []) {
  if (!q.id || !qaStatuses.includes(q.status) || (q.status === 'Réussi' && !q.proof)) throw new Error('Additional QA evidence requires an ID, valid status and proof for success');
  qa.push([`QA-${q.id}`, q.area || 'Navigateur automatisé', q.name, q.status, q.priority || 'P1', q.method || 'Parcours navigateur automatisé', q.proof || '', q.expected || '', '']);
}
if (new Set(qa.map(row => row[0])).size !== qa.length) throw new Error('Duplicate QA evidence IDs');
const verifiedNodeCount = nodeSuites.reduce((sum,suite)=>sum+(evidence[`${suite.key}Passed`]?evidence[`${suite.key}Count`]||0:0),0);
const verifiedBrowserCount = (evidence.additionalCases || []).filter(check => check.status === 'Réussi').length;
if (evidence.nodeTestCount !== undefined && evidence.nodeTestCount !== verifiedNodeCount) throw new Error(`QA Node total does not match its suites: ${evidence.nodeTestCount} / ${verifiedNodeCount}`);
if (evidence.browserCheckCount !== undefined && evidence.browserCheckCount !== verifiedBrowserCount) throw new Error(`QA browser total does not match its cases: ${evidence.browserCheckCount} / ${verifiedBrowserCount}`);

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
    const lines=Math.max(1,...values.map((value,c)=>String(value??'').split('\n').reduce((sum,line)=>sum+Math.max(1,Math.ceil(line.length/((widths[c]||22)*1.1))),0)));
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
makeTable('Combattants','Combattants jouables','Les fiches séparent les repères officiels, leur adaptation en duel et la portée de la revue visuelle.', ['ID','Nom','Style','Jouable','Gameplay','Graphismes','Test moteur','État global','Techniques','PV','Puissance','Vitesse','Portée','Sprite','Animation source','Référence','Contexte','Corps de collision','Simulation et ressource','Chaînes après impact',...fidelityHeaders,'Notes utilisateur'],roster,{widths:[24,28,20,12,18,18,24,18,14,12,12,12,12,65,31,16,46,46,80,90,...fidelityWidths,40],statusCols:[5,6,8],numericCols:[9,10,11,12,13],inputCols:[26]});
sheets['Combattants'].getRange(`K6:M${roster.length+5}`).setNumberFormat('0.00');
makeTable('Techniques','Techniques et données de combat','60 Hz. Dégâts et portées adaptés au duel. Les références ne certifient pas les statistiques ou pouvoirs attribués par le jeu.', ['ID','Combattant','Emplacement','Technique','Mécanique','Début (frames)','Actif (frames)','Retour (frames)','Dégâts base','Portée (px)','Stabilité','Jauge finale','Paramètres actifs','Mécanique livrée','Équilibrage','Référence','Utilisation',...fidelityHeaders,'Notes utilisateur'],moveRows,{widths:[37,27,22,31,18,15,15,16,15,15,13,14,95,20,18,16,80,...fidelityWidths,40],statusCols:[14,15],numericCols:[6,7,8,9,10,11,12],inputCols:[23]});
makeTable('Arènes','Arènes de combat','Les repères officiels et les adaptations du terrain jouable sont distincts de la validation artistique finale.', ['ID','Arène','Jouable','Art final','Thème','Largeur (px)','Sol Y (px)','Borne gauche','Borne droite','Collisions du décor','Dangers','Référence','Description et musique','Provenance',...fidelityHeaders,'Notes utilisateur'],stages,{widths:[17,29,18,18,18,17,17,17,17,32,18,16,83,70,...fidelityWidths,40],statusCols:[3,4,11],numericCols:[6,7,8,9],inputCols:[20]});
makeTable('Atlas','Inventaire des apparences CainOS',`${VARIANTS.length} costumes possèdent leur revue technique et leurs limites canoniques. Les ${ROSTER_ARCHIVE.length} entrées et leurs sources historiques restent conservées.`, ['ID atlas','Nom du projet','Usage combat','Combattant parent','Intégration','Validation canon','Planche','Fichier','Colonnes','Lignes','Colonne (0)','Ligne (0)','Libellé historique CainOS','Provenance','Source','Kit de combat','Animations dédiées','Prochaine action','Priorité',...costumeHeaders,...fidelityHeaders,'Notes utilisateur'],atlas,{widths:[30,39,26,25,18,20,24,70,13,13,15,15,55,95,95,29,36,95,13,...costumeWidths,...fidelityWidths,40],statusCols:[5,6],numericCols:[9,10,11,12],inputCols:[33]});
makeTable('Production','Production graphique, sonore et narrative','Une pose réutilisée compte comme partielle. Les nouveaux assets possèdent chacun un critère de finition.', ['ID','Domaine','Personnage ou lieu','Élément','Statut','Priorité','Fichier actuel','État des ressources','Critère de finition','Notes utilisateur'],production,{widths:[40,18,31,29,18,12,70,46,94,40],statusCols:[5],inputCols:[10]});
makeTable('Scénarios','Défis, histoires et tournoi',`${Object.keys(STORY_ROUTES).length} routes · ${Object.values(STORY_ROUTES).reduce((sum,r)=>sum+r.chapters.length,0)} chapitres. ${STORY_NOTICE}.`, ['ID','Type','Nom','Objectif et texte livré','Mesure','Cible','Adversaire','Statut','Priorité','Preuve ou source','Notes utilisateur'],scenarioRows,{widths:[31,31,43,97,19,13,36,18,12,46,40],statusCols:[8],numericCols:[6],inputCols:[11]});
makeTable('QA','Validation du jeu','Un résultat réussi exige une exécution consignée. Les essais matériels restent identifiés séparément.', ['ID','Domaine','Cas de contrôle','Résultat','Priorité','Méthode','Preuve d’exécution','Résultat attendu','Notes utilisateur'],qa,{widths:[27,22,110,20,12,68,95,100,40],qaCols:[4],inputCols:[9]});

const refs=sheets['Références'];
const trackerSources=[...fidelitySources.values(),
  {id:'fidelity',title:'Encore — repères officiels et adaptations',kind:'Registre de fidélité',url:'combat/fidelity.mjs',scope:'Sources officielles, repères observés et adaptations du duel pour chaque combattant, technique et arène. La portée de revue reste explicite ; aucune équivalence graphique globale n’est déduite des tests fonctionnels.'},
  {id:'costume-reviews',title:'Encore — revue des costumes existants',kind:'Revue technique des sprites',url:'combat/costume-fidelity.mjs',scope:`${VARIANTS.length} revues individuelles : identité, repères visibles, cadrage, transparence, proportions, points à revoir et capture. Les observations de nos sprites restent distinctes de leurs références canoniques.`},
  {id:'costume-review-report',title:'Encore — mesures et preuves des costumes',kind:'Rapport de revue du projet',url:'docs/combat-costume-review.json',scope:'Relevés de cadrage, pixels et captures de la revue finale des 51 variantes ; les données techniques ne certifient pas leurs dessins canoniques.'},
  {id:'pose-registration',title:'Encore — ancrages et poses composées',kind:'Présentation des sprites existants',url:'combat/render-poses.mjs',scope:`${Object.values(ANIMATION_REGISTRATION).reduce((count,item)=>count+item.anchors.length,0)} cellules source ancrées dans ${Object.keys(ANIMATION_REGISTRATION).length} planches. Trois poses basses composées de base ; les costumes et autres morphologies gardent leur dessin intact. Aucun nouveau sprite de combat dédié ni mesure de proportions canoniques.`},
  ...[...new Set(VARIANTS.map(variant=>variant.fidelity.assetReview.captureId.split('#')[0]))].map(id=>({id,title:`Costumes — planche de revue ${id.match(/page-(\d+)$/)?.[1] || id}`,kind:'Capture des sprites du projet',url:`docs/images/${id}.png`,scope:'Planche de contact livrée dans la PR. Le fragment après # dans Atlas identifie la variante correspondante ; cette capture documente nos sprites et ne constitue pas une référence canonique.'})),
  {id:'gangle-palette-review',title:'Gangle — palette locale avant et après',kind:'Comparaison des sprites du projet',url:`docs/images/gangle-palette-${GAME.version}.png`,scope:'Correction ciblée des rubans. Les mesures du rapport distinguent la couleur modifiée, les régions protégées, l’alpha et la géométrie ; elles ne valident pas le dessin complet au regard du canon.'},
  {id:'shadow-preservation-review',title:'Shadow — conservation de la source RGBA',kind:'Comparaison des sprites du projet',url:`docs/images/shadow-preservation-${GAME.version}.png`,scope:'Pomni, Ragatha et Caine : conservation explicite de la cellule source entière. Le fond opaque est inclus et reste une limite connue ; aucune séparation du corps ni correction canonique n’est déduite de cette égalité.'},
  {id:'stories',title:'Encore — routes narratives originales',kind:'Création pour le jeu',url:'combat/stories.mjs',scope:STORY_NOTICE},
  {id:'music',title:'Encore — thèmes et effets originaux',kind:'Création pour le jeu',url:'combat/audio.mjs',scope:`${Object.keys(AUDIO_THEMES).length} thèmes synthétiques par arène et ${AUDIO_EFFECT_IDS.length} motifs sonores. Aucun enregistrement ni musique de la série.`},
  {id:'offline',title:'Encore — inventaire du téléchargement hors ligne',kind:'Manifest généré du build',url:'combat/offline-manifest.mjs / scripts/build-combat-offline.mjs',scope:`${ART_FILES.length} planches, ${ART_BYTES.toLocaleString('fr-FR')} octets. La préparation explicite du pack est séparée de la sauvegarde des profils.`},
  {id:'classification',title:'Revue des identités et apparences',kind:'Contrat de données',url:'combat/data.mjs / tests/combat-catalog.test.mjs',scope:`${FIGHTERS.length} kits propres, ${VARIANTS.length} apparences autorisées, ${ROSTER_ARCHIVE.length-FIGHTERS.length-VARIANTS.length} autres archives conservées. Les liens ne sont jamais déduits du texte des identifiants.`},
];
const referenceRows=trackerSources.map(s=>[s.id,s.title,s.kind,s.url,s.scope]);
makeTable('Références','Références et méthode',`Dates et état du contenu : ${contentDateLabel}. Les sources de fiction ne valident pas les statistiques du jeu.`, ['ID','Référence','Type','URL ou fichier','Périmètre'],referenceRows,{widths:[18,58,24,110,110]});
const refStart=referenceRows.length+9;
refs.getRange(`A${refStart}:E${refStart+10}`).values=[
  ['Lecture du suivi','Définition','','',''],
  ['Implémenté','Présent dans le code livré. Consulter QA pour savoir quels parcours ont été effectivement exécutés.','','',''],
  ['Partiel','Une partie fonctionne. Le critère de finition précise le travail restant.','','',''],
  ['Prévu','Élément détaillé mais pas livré dans cette PR.','','',''],
  ['À vérifier','Il manque une validation ou une preuve suffisante.','','',''],
  ['Hors périmètre','Élément explicitement exclu du périmètre de cette version.','','',''],
  ['Lore','La revue technique d’un sprite ne valide pas sa fidélité canonique. Chaque costume possède ses propres références et limites.','','',''],
  ['Actualiser','Régénérer après les changements des registres combat/fidelity.mjs et combat/costume-fidelity.mjs, des données et des preuves QA.','','',''],
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
summary.getRange('A3').values=[[`Suivi du combat intégré à CainOS et du standalone · ${MODES.length} modes jouables`]];summary.getRange('A3').format.font={italic:true,color:colors.gray};
summary.getRange('H2').values=[[`Version ${GAME.version} · ${contentDateLabel}`]];
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
summary.getRange('H12:H16').values=[['Preuves disponibles'],[`${verifiedNodeCount} tests Node dans ${nodeSuites.filter(suite=>evidence[`${suite.key}Passed`]).length} suites exécutées`],[`${verifiedBrowserCount} contrôles navigateur réussis`],['Le total QA inclut les objectifs de revue.'],['Leurs assertions peuvent se recouper.']];
summary.getRange('H12').format.font={bold:true,color:colors.purple};
summary.getRange('H18').values=[['Contenu de cette version']];summary.getRange('H18').format.font={bold:true,color:colors.purple};
summary.getRange('H19').formulas=[[`=COUNTIFS('Scénarios'!B6:B${scenarioRows.length+5},"Route individuelle")&" routes originales"`]];
summary.getRange('H20').formulas=[[`=COUNTIFS('Scénarios'!B6:B${scenarioRows.length+5},"Chapitre jouable")&" rencontres scénarisées"`]];
summary.getRange('H21').formulas=[[`=COUNTIFS('Production'!B6:B${production.length+5},"Arène",'Production'!D6:D${production.length+5},"Musique de l’arène")&" thèmes musicaux d’arènes"`]];
summary.getRange('H22').formulas=[[`=COUNTIFS('Production'!B6:B${production.length+5},"Motif sonore")&" motifs sonores synthétiques"`]];
summary.getRange('H24:H28').values=[['Fidélité aux références'],[`${FIGHTERS.length + MOVES.length + STAGES.length + VARIANTS.length} fiches, dont ${VARIANTS.length} costumes`],['Revue technique et canon séparés'],['Portée de revue dans chaque fiche'],['Fidélité globale restant à valider']];
summary.getRange('H24').format.font={bold:true,color:colors.purple};
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
const storyCount=Object.keys(STORY_ROUTES).length, chapterCount=Object.values(STORY_ROUTES).reduce((sum,r)=>sum+r.chapters.length,0);
const expectedRelease=[`${storyCount} routes originales`,`${chapterCount} rencontres scénarisées`,`${Object.keys(AUDIO_THEMES).length} thèmes musicaux d’arènes`,`${AUDIO_EFFECT_IDS.length} motifs sonores synthétiques`];
const releaseSummary=summary.getRange('H19:H22').values.flat();
if(releaseSummary.some((value,i)=>value!==expectedRelease[i]))throw new Error(`Story/audio summary mismatch: ${JSON.stringify(releaseSummary)} / ${JSON.stringify(expectedRelease)}`);
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
  const detailRange=name==='QA'?`A${Math.max(5,qa.length-4)}:D${qa.length+5}`:name==='Techniques'?'I5:Q15':name==='Combattants'?'N5:T11':name==='Atlas'?'P125:S134':name==='Scénarios'?'A15:H19':name==='Arènes'?'M5:N12':name==='Production'?`A${production.length-7}:I${production.length-4}`:name==='Références'?'D5:E10':null;
  if(detailRange){const detail=await workbook.render({sheetName:name,range:detailRange,scale:1,format:'png'});await fs.writeFile(path.join(previewDir,`${name.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}-details.png`),new Uint8Array(await detail.arrayBuffer()));}
  const fidelityRange={Combattants:'U5:W9',Techniques:'R5:T9',Arènes:'O5:Q9'}[name];
  const reviewRange={Combattants:'X5:Y9',Techniques:'U5:V9',Arènes:'R5:S9'}[name];
  for(const [range,label] of [[fidelityRange,'fidelite'],[reviewRange,'revue']])if(range){
    const detail=await workbook.render({sheetName:name,range,scale:1,format:'png'});
    await fs.writeFile(path.join(previewDir,`${name.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}-${label}.png`),new Uint8Array(await detail.arrayBuffer()));
  }
  if(name==='Atlas'){
    const firstVariantRow=atlas.findIndex(row=>variantIds.has(row[0]))+6;
    for(const [start,end,label] of [['T','V','costumes-identite'],['W','Y','costumes-cadre'],['Z','AA','costumes-limites'],['AB','AD','costumes-references'],['AE','AF','costumes-canon']]){
      const detail=await workbook.render({sheetName:name,range:`${start}${firstVariantRow}:${end}${firstVariantRow+2}`,scale:1,format:'png'});
      await fs.writeFile(path.join(previewDir,`Atlas-${label}.png`),new Uint8Array(await detail.arrayBuffer()));
    }
  }
  if(name==='Fonctionnalités')for(const [id,label] of [['INT-12','installation'],['PRO-10','profil'],['PRD-11','fidelite'],['PRE-15','sources-ui'],['PRE-03','costumes-ui'],['PRD-06','costumes-revue']]){
    const row=features.findIndex(feature=>feature[0]===id)+6;
    const detail=await workbook.render({sheetName:name,range:`A${row}:H${row}`,scale:1,format:'png'});
    await fs.writeFile(path.join(previewDir,`Fonctionnalites-${label}.png`),new Uint8Array(await detail.arrayBuffer()));
  }
  if(name==='Production'){
    const detail=await workbook.render({sheetName:name,range:'C6:I10',scale:1,format:'png'});
    await fs.writeFile(path.join(previewDir,'Production-poses.png'),new Uint8Array(await detail.arrayBuffer()));
  }
  if(name==='QA')for(const [prefix,label] of [['QA-REC-','installation'],['QA-RPRO-','profil'],['QA-FIDUI-','fidelite-ui'],['QA-FIDREN-','fidelite-rendu'],['QA-COSTUME-','costumes-ui'],['QA-POSEUI-','poses-ui']]){
    const indices=qa.map((row,index)=>row[0].startsWith(prefix)?index+6:null).filter(row=>row!==null);
    if(!indices.length)continue;
    const detail=await workbook.render({sheetName:name,range:`A${indices[0]}:G${indices.at(-1)}`,scale:1,format:'png'});
    await fs.writeFile(path.join(previewDir,`QA-${label}.png`),new Uint8Array(await detail.arrayBuffer()));
  }
}
const file=await SpreadsheetFile.exportXlsx(workbook);
await file.save(path.join(out,'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx'));
const qaSummary=Object.fromEntries(qaStatuses.map(status=>[status,qa.filter(row=>row[3]===status).length]));
const data={version:GAME.version,asOf:GAME.contentDate,counts:{fighters:FIGHTERS.length,moves:MOVES.length,stages:STAGES.length,modes:MODES.length,atlas:ROSTER_ARCHIVE.length,variants:VARIANTS.length,archiveOnly:ROSTER_ARCHIVE.length-FIGHTERS.length-VARIANTS.length,storyRoutes:storyCount,storyChapters:chapterCount,musicThemes:Object.keys(AUDIO_THEMES).length,soundEffects:AUDIO_EFFECT_IDS.length,offlineImages:ART_FILES.length,offlineBytes:ART_BYTES,features:features.length,production:production.length,scenarios:scenarioRows.length,qa:qa.length},qaSummary,features,roster,moves:moveRows,stages,atlas,production,scenarios:scenarioRows,qa,sources:trackerSources};
await fs.writeFile(path.join(out,'combat-tracker-data.json'),JSON.stringify(data,null,2)+'\n');
const sourceDigests={};
const combatSources=(await fs.readdir(path.join(root,'combat'))).filter(name=>/\.(?:m?js|html|css|svg|webmanifest)$/.test(name)).sort().map(name=>`combat/${name}`);
const testSources=(await fs.readdir(path.join(root,'tests'))).filter(name=>/^combat-.*\.mjs$/.test(name)).sort().map(name=>`tests/${name}`);
for(const name of [...combatSources,...testSources,'docs/combat-qa-evidence.json','scripts/build-combat-workbook.mjs']){
  try{sourceDigests[name]=createHash('sha256').update(await fs.readFile(path.join(root,name))).digest('hex');}catch(error){if(error.code!=='ENOENT')throw error;}
}
for(const name of ['docs/combat-costume-review.json',`docs/images/gangle-palette-${GAME.version}.png`,`docs/images/shadow-preservation-${GAME.version}.png`,...new Set(VARIANTS.map(variant=>`docs/images/${variant.fidelity.assetReview.captureId.split('#')[0]}.png`))]) sourceDigests[name]=createHash('sha256').update(await fs.readFile(path.join(root,name))).digest('hex');
const fidelityRecords=[...FIGHTERS.map(({id,fidelity})=>({kind:'fighter',id,fidelity})),...MOVES.map(({id,fidelity})=>({kind:'move',id,fidelity})),...STAGES.map(({id,fidelity})=>({kind:'stage',id,fidelity})),...VARIANTS.map(({id,fidelity})=>({kind:'costume',id,fidelity}))];
const costumeReviewStatuses=Object.fromEntries([...new Set(VARIANTS.map(variant=>variant.fidelity.assetReview.status))].map(status=>[status,VARIANTS.filter(variant=>variant.fidelity.assetReview.status===status).length]));
const fidelityCoverage={fighters:roster.length,moves:moveRows.length,stages:stages.length,costumes:VARIANTS.length,documented:fidelityRecords.length,withPrimaryReference:fidelityRecords.filter(item=>item.fidelity.sourceIds.length).length,withoutPrimaryReference:fidelityRecords.filter(item=>!item.fidelity.sourceIds.length).map(item=>({kind:item.kind,id:item.id,reviewStatus:item.fidelity.reviewStatus})),costumeReviews:{documented:VARIANTS.length,technicalStatuses:costumeReviewStatuses,withRecordedIssues:VARIANTS.filter(variant=>variant.fidelity.assetReview.issues.length).length,withPrimaryReferences:VARIANTS.filter(variant=>variant.fidelity.sourceIds.length).length,withObservedPrimaryTraits:VARIANTS.filter(variant=>variant.fidelity.observedTraits.length).length,canonicalSourceRequiredForCertification:true},sourceIds:FIDELITY_SOURCES.map(source=>source.id),globalVisualCertification:false};
await fs.writeFile(path.join(out,'combat-workbook-verification.json'),JSON.stringify({createdAt:new Date().toISOString(),counts:data.counts,qaSummary,verifiedSummary:actualCounts,verifiedReleaseSummary:expectedRelease,fidelityCoverage,formulaErrors:0,statusMutationRecalculated:true,renderedSheets:renderSheets.length?renderSheets:Object.keys(sheets),qaEvidencePresent:!!Object.keys(evidence).length,sourceDigests},null,2)+'\n');
console.log(JSON.stringify({file:path.join(out,'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx'),counts:data.counts,previews:previewDir},null,2));
