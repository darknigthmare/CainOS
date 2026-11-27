"""Measure native Kaufmo Lackadaisy/SMG4 PNGs and emit declarations; no pixel edits."""
from pathlib import Path
from PIL import Image
import hashlib, json

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
SCOPE = ('Création originale de crossover pour Encore. Un portrait de sélection et une garde statique, '
         'un personnage par image. La même garde est réutilisée dans les états sans dessin dédié. '
         'Aucune animation ni apparition canonique ajoutée.')
KAUFMO = 'https://glitchproductions.store/products/kaufmo-plush'
FAMILIES = [
 ('lackadaisy','Lackadaisy','hommage','Hommage · Rocky Rickaby',[
  'Visage blanc, yeux noirs et triangles, sourire rouge, cône jaune à bord bleu et pompon rouge ; collerette bleue et trois boutons rouges.',
  'Manteau et pantalon bleu canard, gilet moutarde, chemise crème, cravate courte et broche violon dorée ; corps de clown conservé.']),
 ('lackadaisy','Lackadaisy','resident','Résident · Comédien du Little Daisy',[
  'Kaufmo garde sa tête de clown, son cône, sa collerette bleue, ses trois boutons rouges et ses gants blancs.',
  'Chemise crème à manches roulées, gilet et pantalon bruns à rayures, bretelles bordeaux, chaîne dorée et guêtres bordeaux au-dessus des chaussures rouges.']),
 ('lackadaisy','Lackadaisy','fusion','Fusion · Chat de revue',[
  'Véritable anatomie féline : tête blanche à fourrure, oreilles triangulaires, petit museau, truffe et moustaches, bras tigrés, pattes et longue queue attachée.',
  'Cône jaune à bord bleu, collerette et cravate bleues, gilet bleu canard à revers moutarde, trois boutons rouges ; jambes digitigrades dorées et chaussures rouges adaptées aux pattes.']),
 ('smg4','SMG4','hommage','Hommage · SMG4',[
  'Kaufmo conserve sa tête de clown, son cône jaune à bord bleu, son pompon rouge, sa collerette et ses trois boutons rouges.',
  'Chemise bleu roi et salopette blanche à deux attaches hexagonales dorées ; badge hexagonal blanc à S bleu sur le bord du chapeau et chaussures de clown rouges.']),
 ('smg4','SMG4','resident','Résident · Accessoiriste du studio',[
  'Clown original en chemise crème, gilet utilitaire bleu marine à liserés bleus et trois boutons rouges ; casque à microphone à gauche de l’image.',
  'Pantalon cargo ocre à genouillères bleues, ceinture à bobine orange et pochette bleue fermée, chaussures rouges ; aucun changement d’anatomie.']),
 ('smg4','SMG4','fusion','Fusion · Avatar de machinima',[
  'Corps entier reconstruit en volumes polygonaux : tête blanche facettée, mains en blocs, bras segmentés bleus et jambes blanches à surfaces cobalt.',
  'Cône pyramidal jaune, bord bleu à badge S, pompon rouge facetté, collerette d’ailettes triangulaires, trois boutons rouges hexagonaux, deux attaches dorées et pieds rouges prismatiques.']),
]
URLS = {
 'lackadaisy':[KAUFMO,'https://www.glitchprod.com/lackadaisy','https://lackadaisy.store/products/rocky-standee'],
 'smg4':[KAUFMO,'https://smg4.store/products/smg4-plush','https://smg4.store/collections/shop-all'],
}
PROMPTS = {
 ('lackadaisy','hommage','stance'):['lackadaisy-hommage-stance.txt'],
 ('smg4','hommage','stance'):['smg4-hommage-stance.txt'],
 ('lackadaisy','resident','selection'):['lack-resident-selection.txt','lack-resident-selection-fixed.txt'],
}
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def measure(p):
 with Image.open(p) as im:
  im.load(); assert im.mode == 'RGBA', str(p)
  a=im.getchannel('A'); hist=a.histogram(); bounds=a.point(lambda x:255 if x>12 else 0).getbbox()
  assert bounds and hist[0]>0 and 0<bounds[0]<bounds[2]<im.width and 0<bounds[1]<bounds[3]<im.height, (str(p),bounds,im.size)
  return {'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p),'width':im.width,'height':im.height,'mode':im.mode,'alphaBounds12':list(bounds),'fullyTransparentPixels':hist[0],'visiblePixelsOver12':sum(hist[13:]),'lowAlphaEdgePixels':sum(hist[1:13]),'nativePixelsUnmodified':True}
def main():
 rows=[];definitions=[];reviews={}
 for series,title,style,label,traits in FAMILIES:
  identifier=f'glitch-{series}-kaufmo-{style}'; directory=f'assets/encore/crossovers/{series}/kaufmo/{style}'
  files={slot:measure(ROOT/directory/(slot+'.png')) for slot in ['selection','stance']}
  assert files['selection']['sha256']!=files['stance']['sha256']
  short='lack' if series=='lackadaisy' else 'smg'
  prompts={slot:['prompts/'+p for p in PROMPTS.get((series,style,slot),[f'{short}-{style}-{slot}.txt'])] for slot in files}
  for paths in prompts.values():
   for p in paths: assert (HERE/p).exists(), p
  rows.append({'id':identifier,'fighterId':'kaufmo','series':series,'seriesTitle':title,'style':style,'label':label,'traits':traits,'files':files,'prompts':prompts,'sourceUrls':URLS[series],'canonicalCostumeClaim':False,'nativeFacing':1,'authoredSlots':['selection','stance'],'visualReview':{'reviewed':True,'oneCharacterPerImage':True,'stanceFullBody':True,'selectionIntentionalWaistPortrait':True,'identityAndCostumeMatch':True,'issues':[],'scope':'Fichiers natifs et cohérence des paires inspectés ; rendu de production vérifié séparément.'}})
  definitions.append({'id':identifier,'fighterId':'kaufmo','name':title+' · '+label,'sourceId':f'encore-kaufmo-{series}-{style}-20261127-completion','sourceTitle':f'Encore — Kaufmo × {title} : {label}','sourceUrl':URLS[series][1],'sourceUrls':URLS[series],'sourceKind':'Création originale pour Encore avec références officielles','sourceScope':'La peluche officielle Kaufmo et les produits dérivés officiels Rocky/SMG4 fournissent des repères de visage, couleurs et vêtements. Les poses, résidents et fusions sont des créations Encore, non des apparitions officielles.','scope':SCOPE,'traits':traits,'directory':'../'+directory,'introducedOn':'2026-11-27','nativeFacing':1,'crossover':{'series':series,'style':style},'canonicalCostumeClaim':False,'visual':{'maxIllustratedWidth':210}})
  reviews[identifier]={'status':'verified-base-files','sha256':{s:files[s]['sha256'] for s in files},'captureId':'docs/art-generation/completion-20261127/kaufmo-lackadaisy-smg4/manifest.json','visibleTraits':traits,'identityEvidence':'Peluche officielle Kaufmo et dessin Encore existant inspectés ; visage blanc, yeux et triangles noirs, sourire rouge, cône jaune à bord bleu, collerette bleue et trois boutons conservés. Les fusions transforment effectivement l’anatomie ou la matière.','framing':'Garde entière tournée à droite ; portrait séparé à la taille, chapeau et mains entièrement visibles.','transparency':'PNG RGBA natifs, transparence réelle et bornes alpha mesurées ; aucun réencodage des pixels. Les couleurs sous alpha nul n’appartiennent pas au rendu visible.','proportions':'Proportions illustrées d’Encore ; aucune mesure exacte du modèle 3D ni de la peluche. Échelle uniforme du renderer attendue.','scope':SCOPE,'sourceUrls':URLS[series],'issues':[]}
 refs=[]
 for p in [ROOT/'assets/encore/stance/kaufmo.png',ROOT/'assets/encore/selection/kaufmo.png',ROOT/'docs/art-generation/recovery-20261127/kaufmo/references/kaufmo-plush-1.png',*sorted((HERE/'references').glob('*.png'))]:
  refs.append({'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p),'reusedWithoutCopy':not p.is_relative_to(HERE)})
 manifest={'schema':'encore-kaufmo-lackadaisy-smg4-static-bases-completion/v1','date':'2026-11-27','baseCommit':'cc972c8412bddb5278ef7c609dd82897325a2922','productionTool':'Built-in image_gen.imagegen, one image per asset','phase':'static-bases-only','previousUnpublishedImagesRecovered':0,'newNativeImages':12,'newAppearanceFamilies':6,'generationCalls':13,'references':refs,'families':rows,'scope':SCOPE,'canonicalOneToOneCertified':False,'nativeBytes':sum(f['bytes'] for r in rows for f in r['files'].values()),'rejectedCandidate':{'generationKey':'kaufmo_lack_resident_selection','reason':'Quatre boutons rouges au lieu de trois ; correction native acceptée. Candidate non livré au runtime.'}}
 assert len({f['sha256'] for r in rows for f in r['files'].values()})==12
 (HERE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 module='/** Original Encore static bases; provenance: docs/art-generation/completion-20261127/kaufmo-lackadaisy-smg4/manifest.json. */\n'
 module+='export const COMPLETION_KAUFMO_LS_BASE_DEFINITIONS = Object.freeze('+json.dumps(definitions,ensure_ascii=False,indent=2)+');\n'
 module+='export const COMPLETION_KAUFMO_LS_BASE_REVIEWS = Object.freeze('+json.dumps(reviews,ensure_ascii=False,indent=2)+');\n'
 (ROOT/'combat/base-sprite-completion-20261127-kaufmo-lackadaisy-smg4.mjs').write_text(module)
 print(json.dumps({'families':6,'nativePngs':12,'nativeBytes':manifest['nativeBytes'],'uniqueHashes':12}))
if __name__=='__main__':main()
