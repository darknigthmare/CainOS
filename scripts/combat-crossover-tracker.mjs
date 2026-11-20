import { AUDIO_THEMES } from '../combat/audio.mjs';
import { AUDIO_AMBIENCES } from '../combat/audio-ambiences.mjs';
import { STAGE_AMBIENCES } from '../combat/render-stage-motion.mjs';
import { CROSSOVER_STAGES, CROSSOVER_STAGE_SOURCES } from '../combat/crossover-stages.mjs';
import { CROSSOVER_VISITS } from '../combat/crossover-visits.mjs';

const states = ['selection','stance','attack','victory','intro','walk','jump','crouch','hit','defeat'];

const stateLabels = {
  selection: 'sélection', stance: 'garde', attack: 'attaque', victory: 'victoire', intro: 'entrée', walk: 'marche',
  jump: 'saut', crouch: 'accroupi', hit: 'impact', defeat: 'défaite', heavy: 'coup fort',
};

/** Track gallery entries only when their real files are present in the published manifest. */
export function updateCrossoverTracker(data, offline, { FIGHTERS, VARIANTS, COSTUMES = VARIANTS, STAGES }) {
  const art = new Set(offline.ART_FILES.map(path => path.replace(/^\.\.\//, '')));
  const imagePath = stem => [stem + '.webp', stem + '.png'].find(path => art.has(path));
  const productions = new Map(data.production.map(row => [row[0], row]));
  const stages = new Map(data.stages.map(row => [row[0], row]));
  const scenarios = new Map(data.scenarios.map(row => [row[0], row]));
  const sources = new Map(data.sources.map(item => [item.id, item]));
  const original = new Map(FIGHTERS.map(fighter => [fighter.id, fighter]));
  const publishRow = (table, map, row) => {
    const previous = map.get(row[0]);
    if (previous) previous.splice(1, previous.length - 2, ...row.slice(1,-1));
    else { table.push(row); map.set(row[0], row); }
  };
  let outfits = 0, costumeDrawings = 0, heavies = 0, layers = 0, panels = 0;
  const collections = new Set();
  for (const costume of COSTUMES.filter(item => item.crossover)) {
    const directory = costume.sprite.crossoverDirectory.replace(/^\.\.\//, '');
    const fusion = costume.crossover.style === 'fusion';
    const published = [...states, 'heavy'].filter(key => imagePath(directory+'/'+key));
    if (!published.includes('selection') || !published.includes('stance')) continue;
    const missing = states.filter(key => !published.includes(key));
    costumeDrawings += published.length;
    publishRow(data.production,productions,[
      'COST-'+costume.id,'Costume crossover',original.get(costume.fighterId).name,costume.name,
      missing.length ? 'Partiel' : 'Implémenté','P1',directory+'/',
      (fusion ? 'Corps reconçu pour cet univers. ' : '') +
        published.length + ' dessins individuels. ' + published.map(key => stateLabels[key]).join(', ') + '.',
      missing.length
        ? 'À illustrer en priorité : ' + missing.map(key => stateLabels[key]).join(', ') + '. Le moteur conserve la garde de cette apparence.'
        : 'Les techniques et les statistiques sont celles du combattant. Références dans docs/COMBAT_CROSSOVERS_GLITCH.md.', '',
    ]);
    collections.add(costume.crossover.series); outfits++;
  }
  for (const fighter of FIGHTERS) {
    const path = imagePath('assets/encore/poses/'+fighter.id+'/heavy');
    if (!art.has(path)) continue;
    const row = productions.get('ART-'+fighter.id+'-heavy');
    if (row) {
      row[6]=path; row[7]='Dessin individuel du coup fort « '+fighter.moves.heavy.name+' », utilisé en phase active et au début de la récupération.';
    }
    heavies++;
  }
  for (const guest of CROSSOVER_STAGES) {
    const stage=STAGES.find(item=>item.id===guest.id);
    if(!stage)continue;
    const dir='assets/encore/stages/'+stage.id+'/';
    if (!['far','mid','near'].every(key=>imagePath(dir+key))) continue;
    const source=CROSSOVER_STAGE_SOURCES.find(item=>item.id===stage.sourceId);
    if(source && !sources.has(source.id)){data.sources.push(source);sources.set(source.id,source);}
    const f=stage.fidelity;
    publishRow(data.stages,stages,[
      stage.id,stage.name,'Implémenté','Implémenté',stage.theme,stage.width,stage.floor,stage.bounds.left,stage.bounds.right,
      'Aucune collision de décor','Prévu',stage.sourceId,stage.description,'Trois plans illustrés pour le duel · '+dir,
      source?.url || '',f.observedTraits.join('\n'),f.combatAdaptation,f.reviewStatus,f.reviewScope,'',
    ]);
    publishRow(data.production,productions,[
      'BG-'+stage.id+'-crossover','Arène',stage.name,'Plans de parallaxe crossover','Implémenté','P1',dir,
      'Trois WebP en 3840 × 2160. Fond opaque, plans médian et proche transparents.',
      'Comparer les accessoires et le placement du sol à la fiche Arènes.','',
    ]);
    const music=AUDIO_THEMES[stage.id], ambience=AUDIO_AMBIENCES[stage.id];
    if(music)publishRow(data.production,productions,[
      'ART-'+stage.id+'-music','Arène',stage.name,'Musique de l’arène','Implémenté','P2','combat/audio.mjs',
      music.title+' · '+music.bpm+' BPM',music.provenance,'',
    ]);
    if(ambience)publishRow(data.production,productions,[
      'ART-'+stage.id+'-ambience','Arène',stage.name,'Ambiance sonore','Implémenté','P2','combat/audio-ambiences.mjs',
      ambience.title+' · '+ambience.periodSeconds+' s · '+ambience.layers.length+' couches',ambience.description+' '+ambience.provenance,'',
    ]);
    if(STAGE_AMBIENCES[stage.id])publishRow(data.production,productions,[
      'ANIM-'+stage.id+'-ambience','Animation d’arène',stage.name,'Ambiance visuelle animée','Implémenté','P1',
      dir+' · combat/stage-parallax.mjs · combat/render-stage-motion.mjs',STAGE_AMBIENCES[stage.id],
      'La parallaxe et les particules suivent le réglage de mouvements réduits.','',
    ]);
    layers+=3;
  }
  for(const visit of CROSSOVER_VISITS){
    const stage=STAGES.find(item=>item.id===visit.stage);
    if(!stage)continue;
    const [player,rival]=visit.fighters.map(id=>original.get(id).name);
    const dir='assets/encore/escales/'+visit.world+'/';
    for(const [id,title] of [['intro','Introduction'],['ending','Fin']]){
      const file=imagePath(dir+id);
      if(!art.has(file))continue;
      publishRow(data.production,productions,[
        'ESCALE-'+visit.world+'-'+id,'Escales GLITCH',stage.name,title+' · '+visit.title,'Implémenté','P1',file,
        visit[id],player+' · '+rival,'',
      ]);panels++;
    }
    if(imagePath(dir+'intro') && imagePath(dir+'ending'))publishRow(data.scenarios,scenarios,[
      'VISIT-'+visit.world,'Escale crossover',visit.title,visit.intro+'\n\n'+visit.ending,'Victoire',1,rival,
      'Implémenté','P1','combat/crossover-visits.mjs · '+dir,'',
    ]);
  }
  if (!outfits && !heavies && !layers && !panels) return;
  if(panels===2*CROSSOVER_VISITS.length)publishRow(data.features,new Map(data.features.map(row=>[row[0],row])),[
    'MOD-11','Modes','Escales GLITCH','Implémenté','P1','combat/crossover-visits.mjs · combat/app.mjs',
    'Depuis l’accueil, choisir une des '+CROSSOVER_VISITS.length+' escales, lire son introduction et jouer le duel pour découvrir son épilogue.',
    'Chaque escale impose son arène et ses deux tenues. Les rencontres et leurs illustrations figurent dans Scénarios et Production.','',
  ]);
  data.counts.features=data.features.length;
  data.counts.stages=data.stages.length;
  data.counts.scenarios=data.scenarios.length;
  data.counts.archiveVariants=VARIANTS.length; data.counts.variants=VARIANTS.length+outfits;
  data.counts.production=data.production.length;
  data.crossoverArt={collections:collections.size,outfits,costumeDrawings,heavyAttacks:heavies,stageLayers:layers,escalePanels:panels};
  data.illustratedAssets.crossovers=costumeDrawings;
  data.illustratedAssets.escales=panels;
  data.counts.musicThemes=Object.keys(AUDIO_THEMES).length;
  data.counts.audioAmbiences=Object.keys(AUDIO_AMBIENCES).length;
  data.counts.animatedStages=Object.keys(STAGE_AMBIENCES).length;
  const features=new Map(data.features.map(row=>[row[0],row]));
  const stageFeature=features.get('PRE-02');
  if(stageFeature)stageFeature[2]=data.counts.stages+' arènes thématiques';
  const musicFeature=features.get('PRE-09');
  if(musicFeature)musicFeature[6]=data.counts.musicThemes+' thèmes originaux de synthèse, un par arène, avec leur tempo et leur mélodie. Les réglages de musique et de bruitages sont indépendants.';
  const motionFeature=features.get('PRE-17');
  if(motionFeature)motionFeature[6]=data.counts.animatedStages+' ambiances derrière les combattants. Le réglage de mouvements réduits fige les effets.';
  const ambienceFeature=features.get('PRE-21');
  if(ambienceFeature)ambienceFeature[6]=data.counts.audioAmbiences+' ambiances originales avec volume indépendant, arrêt à la pause et changement d’arène.';
  const references=features.get('PRD-11');
  if(references)references[6]='Documenter '+FIGHTERS.length+' combattants, '+data.counts.moves+' techniques, '+data.counts.stages+' arènes, '+VARIANTS.length+' tenues historiques et '+outfits+' tenues crossover avec leurs repères et sources.';
  const musicSource=sources.get('music');
  if(musicSource)musicSource.scope=data.counts.soundEffects+' motifs synthétiques et '+data.counts.musicThemes+' thèmes originaux composés pour Encore.';
  const visualSource=sources.get('stage-ambiences');
  if(visualSource)visualSource.scope=data.counts.animatedStages+' ambiances visuelles derrière les combattants. Le réglage de mouvements réduits fige leurs effets.';
  const ambientSource=sources.get('audio-ambiences-07');
  if(ambientSource)ambientSource.title='Encore — '+data.counts.audioAmbiences+' ambiances sonores';
  const selection=data.features.find(row=>row[0]==='PRE-01');
  if(selection && outfits)selection[7]=(data.illustratedAssets.selection+outfits)+' portraits de sélection et '+(data.illustratedAssets.stance+outfits)+' gardes, apparences originales et tenues comprises.';
  const feature=data.features.find(row=>row[0]==='PRE-03');
  if(feature && outfits){
    feature[5]='combat/data.mjs · combat/crossovers.mjs · combat/app.mjs';
    feature[6]=data.counts.variants+' tenues équipables, dont '+outfits+' crossovers en '+collections.size+' collections. Le joueur et le rival peuvent utiliser des apparences différentes.';
    feature[7]='Les fiches de production identifient les hommages, les rôles d’habitants et les fusions originales. Les 51 tenues historiques conservent leurs fiches d’archive.';
  }
}
