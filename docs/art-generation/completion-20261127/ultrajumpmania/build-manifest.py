"""Measure unchanged native PNGs and declare the three Ultra Jump Mania bases."""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
BASE = 'cc972c8412bddb5278ef7c609dd82897325a2922'
URLS = ['https://glitchproductions.store/products/kaufmo-plush',
        'https://www.youtube.com/watch?v=HZoOzz1CrAk',
        'https://i.ytimg.com/vi/HZoOzz1CrAk/maxresdefault.jpg']
SCOPE = ('Création originale Encore guidée par Kaufmo officiel et la vignette du pilote Ultra Jump Mania. '
         'Un portrait de sélection et une garde statique distincts, un personnage par image. '
         'Aucune pose d’action, animation ou apparition canonique ajoutée. Aucune certification 1:1.')
FAMILIES = [
    ('hommage', 'Hommage · Theo', [
        'Visage blanc ovale, yeux noirs allongés, triangles noirs, sourire rouge, cône jaune à bande bleue et boule rouge, collerette bleue.',
        'Chemise jaune à fleurs blanches inspirée de Theo, trois boutons rouges, short rouge brun, ceinture brune, gants blancs et grandes chaussures rouges.'
    ], {'stance':'exec-0a40c695-6cee-4bc0-a2b1-e3f2908fd809.png', 'selection':'exec-48670017-42b3-4506-9e22-0ff825b689eb.png'}),
    ('resident', 'Résident · Cartographe de l’île', [
        'Identité ordinaire de Kaufmo conservée : tête blanche, maquillage noir et rouge, cône jaune, collerette bleue, gants et pieds de clown.',
        'Tunique ocre à col et rabats vert foncé, trois boutons rouges, short vert, ceinture et étui avec carte roulée. Le portrait finit au torse ; la carte reste visible sur la garde.'
    ], {'stance':'completion-ultrajumpmania-kaufmo-resident-stance.png — native tool bytes saved directly after automatic write unavailable', 'selection':'exec-1738316a-7be2-4a15-894d-e994f40d3f62.png'}),
    ('fusion', 'Fusion · Pantin des cocotiers', [
        'Corps réellement transformé : coque de noix de coco, membres en bois articulés, paumes crème végétales, poignets et chevilles feuillus, pieds rouges sculptés.',
        'Visage en chair de coco blanche avec yeux noirs, triangles et sourire rouge ; cône fibreux doré, boule-fruit rouge, feuilles vertes, collerette et bande de feuilles bleues, trois fruits rouges sur le torse.'
    ], {'stance':'exec-4812ba2c-0b0f-4902-a4c8-362a80b1830e.png', 'selection':'exec-6fb145d4-b3e5-4d84-83e6-ca54d6b82202.png'}),
]

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def measure(p):
    with Image.open(p) as im:
        assert im.mode == 'RGBA'
        a = im.getchannel('A'); hist = a.histogram()
        box = a.point(lambda v: 255 if v > 12 else 0).getbbox()
        assert hist[0] > 0 and box
        assert 0 < box[0] < box[2] < im.width and 0 < box[1] < box[3] < im.height
        return {'path':p.relative_to(ROOT).as_posix(), 'bytes':p.stat().st_size, 'sha256':sha(p),
                'width':im.width, 'height':im.height, 'mode':im.mode, 'alphaBounds12':list(box),
                'fullyTransparentPixels':hist[0], 'lowAlphaEdgePixels':sum(hist[1:13]),
                'visiblePixelsOver12':sum(hist[13:]), 'pixelsAtLeast240Alpha':sum(hist[240:]),
                'nativePixelsUnmodified':True}

def main():
    rows=[]; definitions=[]; reviews={}
    for style, label, traits, outputs in FAMILIES:
        identifier='glitch-ultrajumpmania-kaufmo-'+style
        directory='assets/encore/crossovers/ultrajumpmania/kaufmo/'+style
        files={slot:measure(ROOT/directory/(slot+'.png')) for slot in ['selection','stance']}
        assert files['selection']['sha256'] != files['stance']['sha256']
        rows.append({'id':identifier,'fighterId':'kaufmo','series':'ultrajumpmania','style':style,
                     'label':label,'traits':traits,'nativeOutputs':outputs,'files':files,'sourceUrls':URLS,
                     'authoredSlots':['selection','stance'],'canonicalCostumeClaim':False,
                     'visualReview':{'reviewed':True,'oneCharacterPerImage':True,'stanceFullBody':True,
                                     'selectionIntentionalPortrait':True,'identityAndCostumeMatch':True,'issues':[]}})
        definitions.append({'id':identifier,'fighterId':'kaufmo','name':'Ultra Jump Mania · '+label,
            'sourceId':'encore-kaufmo-ultrajumpmania-'+style+'-20261127-completion',
            'sourceTitle':'Encore — Kaufmo × Ultra Jump Mania : '+label,'sourceUrl':URLS[1],'sourceUrls':URLS,
            'sourceKind':'Création originale pour Encore avec références officielles',
            'sourceScope':'La vignette officielle documente Theo, sa chemise jaune fleurie et l’île ; le corps végétal de fusion et la tenue de cartographe sont des créations Encore.',
            'scope':SCOPE,'traits':traits,'directory':'../'+directory,'introducedOn':'2026-11-27',
            'nativeFacing':1,'crossover':{'series':'ultrajumpmania','style':style},
            'canonicalCostumeClaim':False,'visual':{'maxIllustratedWidth':210}})
        reviews[identifier]={'status':'verified-base-files','sha256':{s:files[s]['sha256'] for s in files},
            'captureId':'docs/art-generation/completion-20261127/ultrajumpmania/manifest.json',
            'visibleTraits':traits,'identityEvidence':'Kaufmo Plush officiel, garde Encore antérieure et vignette officielle du pilote Ultra Jump Mania inspectés.',
            'framing':'Garde entière vers la droite ; portrait séparé au torse ou à la taille, chapeau et mains entiers.',
            'transparency':'RGBA natifs ; bornes alpha et pixels transparents mesurés. Aucun nettoyage de pixels ni réencodage.',
            'proportions':'Proportions natives conservées ; contrôle dans le renderer consigné séparément.',
            'scope':SCOPE,'sourceUrls':URLS,'issues':[]}
    refs=[]
    for relative in ['docs/art-generation/recovery-20261127/kaufmo/references/kaufmo-plush-1.png',
                     'assets/encore/stance/kaufmo.png',
                     'docs/art-generation/completion-20261127/ultrajumpmania/references/official-pilot-thumbnail.jpg']:
        p=ROOT/relative; refs.append({'path':relative,'sha256':sha(p),'bytes':p.stat().st_size})
    manifest={'schema':'encore-static-base-completion/v1','date':'2026-11-27','baseCommit':BASE,
              'productionTool':'Built-in image_gen.imagegen, one image per asset',
              'phase':'static-bases-only','newNativeImages':6,'newAppearanceFamilies':3,
              'previousUnpublishedImagesRecovered':0,'canonicalOneToOneCertified':False,
              'references':refs,'families':rows,'scope':SCOPE}
    (HERE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    text='/** Native static bases; provenance and unchanged-file measurements in completion-20261127/ultrajumpmania/manifest.json. */\n'
    text+='export const COMPLETION_ULTRAJUMP_BASE_DEFINITIONS = Object.freeze('+json.dumps(definitions,ensure_ascii=False,indent=2)+');\n'
    text+='export const COMPLETION_ULTRAJUMP_BASE_REVIEWS = Object.freeze('+json.dumps(reviews,ensure_ascii=False,indent=2)+');\n'
    (ROOT/'combat/base-sprite-completion-20261127-ultrajumpmania.mjs').write_text(text)
    # This comparison sheet is a disposable review preview; the six runtime PNGs remain untouched.
    sheet=Image.new('RGB',(1800,1120),'#152135'); draw=ImageDraw.Draw(sheet)
    for col,row in enumerate(rows):
        draw.text((col*600+12,12),row['label'],fill='white')
        for index,slot in enumerate(['selection','stance']):
            with Image.open(ROOT/row['files'][slot]['path']) as im:
                im.thumbnail((540,510))
                sheet.paste(im,(col*600+(600-im.width)//2,50+index*530),im)
    sheet.save(HERE/'native-overview.jpg',quality=92)
    print(json.dumps({'families':3,'nativePngs':6,'bytes':sum(f['bytes'] for row in rows for f in row['files'].values())}))

if __name__ == '__main__':
    main()
