"""Measure native image bytes and publish static-base declarations; never edits PNGs."""
from pathlib import Path
from PIL import Image
import hashlib, json

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
BASE_COMMIT = '6e44ab75b9c82b4d6fe62a0051287275abc97753'
SCOPE = ('Création originale de crossover pour Encore. Un portrait de sélection et une garde statique, '
         'un seul personnage par image. La même garde sert aux états de combat sans dessin dédié. '
         'Aucune pose d’action ni animation ajoutée ; aucune apparition canonique affirmée.')
SOURCE_URLS_BY_SERIES = {
    'murderdrones': ['https://glitchproductions.store/products/kaufmo-plush',
                     'https://glitchproductions.store/products/uzi-v2-animatez',
                     'https://www.glitchprod.com/murder-drones'],
    'metarunner': ['https://glitchproductions.store/products/kaufmo-plush',
                   'https://glitchproductions.store/cdn/shop/files/Tari-Hoodie-Default.png?v=1701236208&width=1600',
                   'https://www.glitchprod.com/meta-runner',
                   'https://static.wixstatic.com/media/84ed6a_98410c9a4f234883a5602147648a42b4~mv2.png']
}
IDENTITY_EVIDENCE = {
    'murderdrones': 'Kaufmo Plush officiel et garde Encore publiée relus ; référence Uzi pour les codes de Murder Drones. Crossover original.',
    'metarunner': 'Kaufmo Plush officiel et garde Encore publiée relus ; hoodie officiel Tari et image promotionnelle Meta Runner pour les vêtements, prothèses et avatars numériques. Crossover original.'
}

FAMILIES = [
    {'series':'murderdrones','seriesTitle':'Murder Drones','style':'hommage','label':'Hommage · Uzi',
     'traits':[
       'Visage blanc ovale de Kaufmo, yeux noirs allongés, triangles, sourire rouge, cône jaune à bord bleu et pompon rouge.',
       'Sweat noir à capuche violette, motif blanc inspiré de la tenue Uzi, trois pompons rouges et collerette bleue.',
       'Pantalon jaune, gants blancs et chaussures de clown rouges à lacets violets ; anatomie de l’avatar conservée.'],
     'nativeOutputs':{'stance':'exec-76751604-8c61-432e-ade0-821a1e27f5b8.png',
                      'selection':'Tool result data:image/png;base64 saved directly after automatic disk write failed'},
     'prompts':{'stance':['hommage-stance-prompt.txt'],'selection':['hommage-selection-prompt.txt']}},
    {'series':'murderdrones','seriesTitle':'Murder Drones','style':'resident','label':'Résident · Technicien des abris',
     'traits':[
       'Identité de Kaufmo et cône jaune, bord bleu, pompon rouge conservés.',
       'Veste isolante ocre à épaules bleues, trois boutons rouges, bandes de sécurité noires et jaunes.',
       'Sacoche et câble bleu fixés à la ceinture, pantalon graphite, genouillères et bottes rouges ; avatar simulé non canonique.'],
     'nativeOutputs':{'stance':'exec-1d29694c-5c5d-4e37-875f-9b206be9a6e6.png',
                      'selection':'exec-de501dfc-0414-4429-8240-b85db4b7dfb0.png'},
     'prompts':{'stance':['resident-stance-prompt.txt'],'selection':['resident-selection-prompt.txt','resident-selection-cleanup-prompt.txt']}},
    {'series':'murderdrones','seriesTitle':'Murder Drones','style':'fusion','label':'Fusion · Drone de parade',
     'traits':[
       'Véritable corps de drone original : coque jaune, bras et jambes métalliques, articulations noires et mains mécaniques.',
       'Tête ovale céramique à visière noire, yeux ovales violets, triangles clairs et sourire rouge reprenant l’identité de Kaufmo.',
       'Cône antenne jaune riveté, anneau et collerette métalliques bleus, trois voyants rouges et pieds mécaniques rouges.'],
     'nativeOutputs':{'stance':'exec-6fba6552-08d6-4ee1-8a12-4145b97b21ac.png',
                      'selection':'exec-c6eecef5-542f-4199-860e-5c10b18f255e.png'},
     'prompts':{'stance':['fusion-stance-prompt.txt'],'selection':['fusion-selection-prompt.txt']}},
    {'series':'metarunner','seriesTitle':'Meta Runner','style':'hommage','label':'Hommage · Tari',
     'traits':[
       'Visage blanc de Kaufmo, yeux ovales noirs, triangles, sourire rouge, cône jaune à bord bleu et pompon rouge.',
       'Hoodie cyan inspiré du vêtement officiel Tari : capuche et bordure blanche, zigzags bleu marine aux épaules, panneaux blancs sous les bras et fermeture blanche.',
       'Trois pompons rouges, collerette bleue, gants de clown ordinaires ; pantalon graphite et chaussures rouges à panneaux bleus et blancs.'],
     'nativeOutputs':{'stance':'exec-35daa645-d69d-4042-9f1d-cdae185012f0.png',
                      'selection':'exec-7ef89ce2-e435-44d2-b9a5-36f9a23bf362.png'},
     'prompts':{'stance':['meta-hommage-stance-prompt.txt'],'selection':['meta-hommage-selection-prompt.txt']}},
    {'series':'metarunner','seriesTitle':'Meta Runner','style':'resident','label':'Résident · Technicien des replays',
     'traits':[
       'Visage et chapeau ordinaires de Kaufmo, avec collerette bleue ; avatar original de technicien dans une simulation de crossover.',
       'Gilet technique bleu marine à liserés cyan, trois contrôles rouges, ceinture et lecteur de replays bleu.',
       'Avant-bras et main sur la droite de l’image mécaniques blancs et cyan, main opposée en gant souple ; pantalon graphite et chaussures de clown rouges.'],
     'nativeOutputs':{'stance':'exec-00eea8cd-079e-4929-9ca0-809464a89db6.png',
                      'selection':'exec-577276fa-aac1-4bdd-9a3e-0884fb9881c9.png'},
     'prompts':{'stance':['meta-resident-stance-prompt.txt'],'selection':['meta-resident-selection-prompt.txt']}},
    {'series':'metarunner','seriesTitle':'Meta Runner','style':'fusion','label':'Fusion · Avatar de synchronisation',
     'traits':[
       'Corps entièrement numérique et géométrique, opaque : torse bleu cobalt, membres blancs anguleux et articulations sombres.',
       'Panneau central cyan à trois nœuds rouges, pistes de circuits contenues dans le corps, interface cyan sur l’avant-bras à gauche de l’image.',
       'Tête blanche facettée conservant les yeux noirs, triangles et sourire de Kaufmo ; cône doré, bord bleu, sphère rouge cristalline, collerette polygonale et pieds rouges.'],
     'nativeOutputs':{'stance':'exec-780ff6ba-0cf5-4617-8c69-fda3469d51d0.png',
                      'selection':'exec-f8c0789c-c0a8-43d3-a9ec-b8faa31190a8.png'},
     'prompts':{'stance':['meta-fusion-stance-prompt.txt'],'selection':['meta-fusion-selection-prompt.txt']}},
]

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def measure(p):
    with Image.open(p) as im:
        im.load()
        if im.mode != 'RGBA': raise ValueError(f'{p}: native RGBA required')
        alpha = im.getchannel('A'); hist = alpha.histogram()
        bounds = alpha.point(lambda x: 255 if x > 12 else 0).getbbox()
        assert bounds and hist[0] > 0
        assert 0 < bounds[0] < bounds[2] < im.width and 0 < bounds[1] < bounds[3] < im.height
        return {'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,
                'sha256':sha(p),'width':im.width,'height':im.height,'mode':im.mode,
                'alphaBounds12':list(bounds),'fullyTransparentPixels':hist[0],
                'lowAlphaEdgePixels':sum(hist[1:13]),'visiblePixelsOver12':sum(hist[13:]),
                'pixelsAtLeast240Alpha':sum(hist[240:]),'nativePixelsUnmodified':True}

def main():
    rows=[]; definitions=[]; reviews={}
    for fam in FAMILIES:
        source_urls = SOURCE_URLS_BY_SERIES[fam['series']]
        identifier=f"glitch-{fam['series']}-kaufmo-{fam['style']}"
        directory=f"assets/encore/crossovers/{fam['series']}/kaufmo/{fam['style']}"
        files={slot:measure(ROOT/directory/(slot+'.png')) for slot in ['selection','stance']}
        assert files['selection']['sha256'] != files['stance']['sha256']
        row={**fam,'id':identifier,'fighterId':'kaufmo','files':files,
             'sourceUrls':source_urls,'sourceKind':'Original Encore crossover using official identity and universe references',
             'canonicalCostumeClaim':False,'nativeFacing':1,'authoredSlots':['selection','stance'],
             'visualReview':{'reviewed':True,'oneCharacterPerImage':True,'stanceFullBody':True,
                            'selectionIntentionalWaistPortrait':True,'identityAndCostumeMatch':True,
                            'issues':[],'scope':'Native files inspected. In-engine presentation is verified separately by the main integration.'}}
        rows.append(row)
        definitions.append({'id':identifier,'fighterId':'kaufmo','name':f"{fam['seriesTitle']} · {fam['label']}",
            'sourceId':f"encore-kaufmo-{fam['series']}-{fam['style']}-20261127",
            'sourceTitle':f"Encore — Kaufmo × {fam['seriesTitle']} : {fam['label']}",
            'sourceUrl':source_urls[2],'sourceUrls':source_urls,
            'sourceKind':'Création originale pour Encore avec références officielles',
            'sourceScope':'Les sources documentent Kaufmo et l’univers visuel. Ce crossover est une création de fan-game, pas une apparition officielle.',
            'scope':SCOPE,'traits':fam['traits'],'directory':'../'+directory,
            'introducedOn':'2026-11-27','nativeFacing':1,'crossover':{'series':fam['series'],'style':fam['style']},
            'canonicalCostumeClaim':False,'visual':{'maxIllustratedWidth':210}})
        reviews[identifier]={'status':'verified-base-files','sha256':{s:files[s]['sha256'] for s in files},
             'captureId':'docs/art-generation/recovery-20261127/kaufmo/manifest.json',
             'visibleTraits':fam['traits'],'identityEvidence':IDENTITY_EVIDENCE[fam['series']],
             'framing':'Garde complète orientée à droite ; portrait cadré intentionnellement à la taille. Chapeau et mains entièrement visibles.',
             'transparency':'PNG RGBA natifs ; pixels transparents et bornes alpha > 12 mesurés. Aucune retouche ou réencodage des pixels.',
             'proportions':'Proportions natives conservées ; échelle uniforme attendue du renderer existant.',
             'scope':SCOPE,'sourceUrls':source_urls,'issues':[]}
    refs=[]
    for name,source in [('kaufmo-plush-1.png','docs/art-generation/base-sprites-20261124/archive-references/kaufmo-plush-1.png'),
                        ('official-uzi-front.png','docs/art-generation/npc-crossovers-next-wave-20261120/hommage/references/official-uzi-front.png'),
                        ('game-kaufmo-stance.png','assets/encore/stance/kaufmo.png'),
                        ('tari-hoodie-official.png','docs/art-generation/continuation-20261120-b/metarunner/references/tari-hoodie-official.png'),
                        ('metarunner-official-still-01.png','docs/art-generation/continuation-20261120-b/metarunner/references/metarunner-official-still-01.png')]:
        p=HERE/'references'/name
        refs.append({'path':p.relative_to(ROOT).as_posix(),'copiedUnchangedFrom':source,'sourceCommit':BASE_COMMIT,'sha256':sha(p),'bytes':p.stat().st_size})
    manifest={'schema':'encore-kaufmo-native-base-recovery/v1','date':'2026-11-27','baseCommit':BASE_COMMIT,
              'productionTool':'Built-in image_gen.imagegen, one image per asset','phase':'static-bases-only',
              'previousUnpublishedImagesRecovered':0,'newNativeImages':sum(len(r['files']) for r in rows),
              'newAppearanceFamilies':len(rows),'references':refs,'families':rows,
              'scope':SCOPE,'canonicalOneToOneCertified':False,
              'reviewStatus':'Native PNG files and pair consistency inspected; runtime presentation must be checked separately',
              'alternativeCandidates':[{'path':'docs/art-generation/recovery-20261127/kaufmo/candidates/resident-selection-glow.png',
                 'status':'Superseded by native transparency-focused image edit; not used by runtime'}]}
    (HERE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    module='/** Native static bases generated and reviewed on 27 November 2026.\n * Original Encore crossover designs; never claimed as canonical appearances.\n * Source pixels, prompts and measurements: docs/art-generation/recovery-20261127/kaufmo/manifest.json\n */\n'
    module+='export const CONTINUATION_20261127_BASE_DEFINITIONS = Object.freeze('+json.dumps(definitions,ensure_ascii=False,indent=2)+');\n'
    module+='export const CONTINUATION_20261127_BASE_REVIEWS = Object.freeze('+json.dumps(reviews,ensure_ascii=False,indent=2)+');\n'
    (ROOT/'combat/base-sprite-continuation-20261127.mjs').write_text(module)
    print(json.dumps({'families':len(rows),'nativePngs':sum(len(r['files']) for r in rows),'bytes':sum(f['bytes'] for r in rows for f in r['files'].values())}))

if __name__ == '__main__': main()
