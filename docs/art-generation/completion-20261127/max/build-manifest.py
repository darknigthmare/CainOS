"""Measure native Max PNGs and emit declarations; no pixel edits."""
from pathlib import Path
from PIL import Image
import hashlib, json

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
BASE = 'cc972c8412bddb5278ef7c609dd82897325a2922'
SCOPE = ('Création originale de crossover pour Encore. Un portrait de sélection et une garde statique, '
         'un personnage par image. La même garde est réutilisée dans les états sans dessin dédié. '
         'Aucune animation ni apparition canonique ajoutée.')
EPISODE = 'https://www.youtube.com/watch?v=4ofJpOEXrZs'
FAMILIES = [
 ('murderdrones','Murder Drones','hommage','Hommage · Uzi',[
  'Caïman violet et rose, museau long à dessous blanc en zigzag, œil blanc et chapeau melon brun à bande rouge.',
  'Hoodie charbon à capuche violette et motif blanc inspiré de la tenue officielle Uzi ; membres courts et queue de confiserie conservés.']),
 ('murderdrones','Murder Drones','resident','Résident · Convoyeur des abris',[
  'Identité de Max conservée : petit corps de caïman violet et rose, ventre blanc, membres courts et chapeau melon.',
  'Veste matelassée ocre, col crème, épaules charbon, bandes noires et jaunes, deux boîtiers attachés à la ceinture et voyant violet.']),
 ('murderdrones','Murder Drones','fusion','Fusion · Drone du convoi',[
  'Corps entièrement mécanique : tête reptilienne violette, visière noire à œil blanc-violet et mâchoire blanche en zigzag.',
  'Ventre blanc segmenté, articulations noires, petites mains mécaniques, pieds roses, queue de plaques, melon métallique brun riveté et voyant ambre.']),
 ('metarunner','Meta Runner','hommage','Hommage · Tari',[
  'Corps de Max violet et rose avec ventre blanc et chapeau melon brun à bande rouge ; bras courts et longue queue conservés.',
  'Hoodie cyan inspiré du vêtement officiel Tari : capuche et trim blancs, zigzags bleu marine aux épaules, panneaux blancs sous les bras, fermeture blanche et bordures sombres.']),
 ('metarunner','Meta Runner','resident','Résident · Courrier de Silica City',[
  'Caïman de confiserie violet et rose avec son melon, gilet bleu marine à bordure cyan et bande orange à l’épaule.',
  'Avant-bras et main à droite de l’image mécaniques blancs et cyan, autre main violette ; casque de communication et écran attaché à la ceinture.']),
 ('metarunner','Meta Runner','fusion','Fusion · Avatar du circuit',[
  'Corps numérique entièrement facetté : tête violette, mâchoire blanche en zigzag, œil blanc et chapeau melon polygonal cuivré à bande rouge.',
  'Torse blanc et cobalt, noyau hexagonal cyan, membres et queue anguleux, pistes cyan contenues dans les surfaces et pieds corail.']),
]
URLS = {
 'murderdrones':[EPISODE,'https://www.glitchprod.com/murder-drones','https://glitchproductions.store/products/uzi-v2-animatez'],
 'metarunner':[EPISODE,'https://www.glitchprod.com/meta-runner','https://glitchproductions.store/cdn/shop/files/Tari-Hoodie-Default.png?v=1701236208&width=1600','https://static.wixstatic.com/media/84ed6a_98410c9a4f234883a5602147648a42b4~mv2.png'],
}

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def measure(p):
 with Image.open(p) as im:
  im.load(); assert im.mode == 'RGBA'
  a=im.getchannel('A'); hist=a.histogram(); bounds=a.point(lambda x:255 if x>12 else 0).getbbox()
  assert bounds and hist[0]>0 and 0<bounds[0]<bounds[2]<im.width and 0<bounds[1]<bounds[3]<im.height
  return {'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p),'width':im.width,'height':im.height,'mode':im.mode,'alphaBounds12':list(bounds),'fullyTransparentPixels':hist[0],'visiblePixelsOver12':sum(hist[13:]),'lowAlphaEdgePixels':sum(hist[1:13]),'nativePixelsUnmodified':True}

def main():
 rows=[];definitions=[];reviews={}
 for series,title,style,label,traits in FAMILIES:
  identifier=f'glitch-{series}-max-{style}'; directory=f'assets/encore/crossovers/{series}/max/{style}'
  files={slot:measure(ROOT/directory/(slot+'.png')) for slot in ['selection','stance']}
  assert files['selection']['sha256'] != files['stance']['sha256']
  prompts={slot:[f'prompts/{series}-{style}-{slot}.txt'] for slot in files}
  if series=='murderdrones' and style=='hommage':prompts['selection'].append('prompts/murderdrones-hommage-selection-short-arms.txt')
  rows.append({'id':identifier,'fighterId':'max','series':series,'seriesTitle':title,'style':style,'label':label,'traits':traits,'files':files,'prompts':prompts,'sourceUrls':URLS[series],'canonicalCostumeClaim':False,'nativeFacing':1,'authoredSlots':['selection','stance'],'visualReview':{'reviewed':True,'oneCharacterPerImage':True,'stanceFullBody':True,'selectionIntentionalWaistPortrait':True,'identityAndCostumeMatch':True,'issues':[],'scope':'Fichiers natifs et cohérence des paires inspectés ; rendu de production vérifié séparément.'}})
  definitions.append({'id':identifier,'fighterId':'max','name':title+' · '+label,'sourceId':f'encore-max-{series}-{style}-20261127-completion','sourceTitle':f'Encore — Max × {title} : {label}','sourceUrl':URLS[series][1],'sourceUrls':URLS[series],'sourceKind':'Création originale pour Encore avec références officielles','sourceScope':'Les échantillons officiels de l’épisode 2 documentent la famille du caïman violet. Les portraits illustrés et crossovers sont des adaptations originales ; aucun costume officiel n’est affirmé.','scope':SCOPE,'traits':traits,'directory':'../'+directory,'introducedOn':'2026-11-27','nativeFacing':1,'crossover':{'series':series,'style':style},'canonicalCostumeClaim':False,'visual':{'maxIllustratedWidth':240}})
  reviews[identifier]={'status':'verified-base-files','sha256':{s:files[s]['sha256'] for s in files},'captureId':'docs/art-generation/completion-20261127/max/manifest.json','visibleTraits':traits,'identityEvidence':'Storyboards officiels GLITCH de Candy Carrier Chaos! (échantillons seulement), reproduction TVmaze et illustrations existantes relus. Museau blanc en zigzag, violet/rose et melon conservés dans ces nouvelles adaptations.','framing':'Garde entière tournée à droite ; portrait séparé cadré à la taille. Museau, chapeau et mains entièrement visibles.','transparency':'PNG RGBA natifs, transparence réelle et bornes alpha mesurées ; aucun réencodage des pixels.','proportions':'Petit corps et bras courts ; proportions illustrées de fan-game, non mesure exacte du modèle 3D. Échelle uniforme du renderer attendue.','scope':SCOPE,'sourceUrls':URLS[series],'issues':[]}
 refs=[]
 for p in [ROOT/'assets/encore/stance/max.png',ROOT/'assets/encore/selection/max.png',ROOT/'docs/art-generation/recovery-20261127/kaufmo/references/official-uzi-front.png',ROOT/'docs/art-generation/recovery-20261127/kaufmo/references/tari-hoodie-official.png',ROOT/'docs/art-generation/recovery-20261127/kaufmo/references/metarunner-official-still-01.png',*sorted((HERE/'references').glob('*.jpg'))]:
  refs.append({'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p),'reusedWithoutCopy':not p.is_relative_to(HERE)})
 manifest={'schema':'encore-max-static-bases-completion/v1','date':'2026-11-27','baseCommit':BASE,'productionTool':'Built-in image_gen.imagegen, one image per asset','phase':'static-bases-only','previousUnpublishedImagesRecovered':0,'newNativeImages':12,'newAppearanceFamilies':6,'generationCalls':13,'references':refs,'families':rows,'scope':SCOPE,'canonicalOneToOneCertified':False,'nativeBytes':sum(f['bytes'] for r in rows for f in r['files'].values()),'rejectedCandidate':{'generationKey':'max_md_hommage_selection','reason':'Bras levé trop long ; correction native acceptée avec main baissée. Candidate non livré au runtime.'}}
 (HERE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 module='/** Original Encore static bases, native source and references: docs/art-generation/completion-20261127/max/manifest.json. */\n'
 module+='export const COMPLETION_MAX_BASE_DEFINITIONS = Object.freeze('+json.dumps(definitions,ensure_ascii=False,indent=2)+');\n'
 module+='export const COMPLETION_MAX_BASE_REVIEWS = Object.freeze('+json.dumps(reviews,ensure_ascii=False,indent=2)+');\n'
 (ROOT/'combat/base-sprite-completion-20261127-max.mjs').write_text(module)
 print(json.dumps({'families':6,'nativePngs':12,'nativeBytes':manifest['nativeBytes']}))

if __name__=='__main__':main()
