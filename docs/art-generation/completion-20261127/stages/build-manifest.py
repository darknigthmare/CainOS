"""Inventory nine complete native paintings and the exact references used."""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
REFERENCE_FILES = {
    'void':['void-primary.png'], 'cellar':['cellar-primary.jpg'], 'bigtop':['bigtop-primary.png'],
    'backstage':['backstage-wide.png','backstage-front.png'],
    'candy':['candy-road.png','candy-route-500.png'],
    'gloink':['gloink-wide.png','gloink-side.png'],
    'manor':['manor-hall.png','manor-walls.png'],
    'grounds':['grounds-wide.png','grounds-second.png'], 'lake':['grounds-wide.png','grounds-second.png'],
}
OUTPUTS = {
    'void':'exec-f9e11661-04e5-46d9-b14e-e844512c87a6.png',
    'cellar':'exec-a2b2c930-f8cb-4f6a-851c-fb2719ada666.png',
    'bigtop':'exec-eccba837-ebb7-47cb-8a5f-228939e65625.png',
    'backstage':'exec-62b8f3dd-2a06-4408-b410-45ca0f70d4aa.png',
    'candy':'exec-26104ea4-1015-4bd0-bd4b-9edc1994f08e.png',
    'gloink':'exec-73bf41bf-e088-45d5-8e19-65c0a0747f7c.png',
    'manor':'exec-9a0e54e4-856d-4799-8dcc-9cd1c2e02763.png',
    'grounds':'exec-57d239be-fd19-43bb-a974-91e1da907929.png',
    'lake':'exec-81b2a0ce-82cf-4243-809c-dcbe7942a031.png',
}
PRIMARY_URLS = {
    'void-primary.png':'https://static.wixstatic.com/media/84ed6a_9f2c0f92fcc340fea405c155a304e362~mv2.png',
    'cellar-primary.jpg':'https://static.wixstatic.com/media/84ed6a_de54a5d816fe4ba0966cc96385ab8f8b~mv2.jpg',
    'bigtop-primary.png':'https://static.wixstatic.com/media/84ed6a_e3bac825d5c140a4a665ba898b3ff51b~mv2.png',
}

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    selection=HERE/'references/selected-frames.json'
    frames=json.loads(selection.read_text())
    if not any(row['id']=='candy-route-520' for row in frames):
        frames.append({'id':'candy-route-520','source':'docs/art-generation/completion-20261127/stages/references/canyon-L3-M5.jpg',
            'path':'docs/art-generation/completion-20261127/stages/references/candy-route-500.png',
            'page':5,'cellIndexZero':7,'approxTimestampSeconds':520,'crop':[320,360,320,180],
            'purpose':'Unaltered source pixels cropped for inspection, not a runtime asset',
            'filenameCaveat':'Historical local filename says 500; page 5 / cell 7 corresponds to approximately 520 seconds.'})
    for row in frames:
        row['usedForGeneration']=Path(row['path']).name in {name for names in REFERENCE_FILES.values() for name in names}
        row['sha256']=sha(ROOT/row['path'])
    selection.write_text(json.dumps(frames,ensure_ascii=False,indent=2)+'\n')
    pages=json.loads((HERE/'references/storyboard-downloads.json').read_text())
    reference_rows=[]
    for name in sorted({n for names in REFERENCE_FILES.values() for n in names}):
        p=HERE/'references'/name
        row={'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)}
        if name in PRIMARY_URLS:
            row.update({'url':PRIMARY_URLS[name],'publisherPage':'https://www.glitchprod.com/digital-circus',
                        'kind':'Official GLITCH promotional still'})
        else:
            frame=next(f for f in frames if Path(f['path']).name==name)
            page=next(x for x in pages if Path(x['path']).name==Path(frame['source']).name)
            row.update({'kind':'Official YouTube storyboard cell, original pixels cropped for reference',
                        'episodeUrl':page['episodeUrl'],'sourcePageUrl':page['url'],
                        'sourcePageSha256':page['sha256'],'approxTimestampSeconds':frame['approxTimestampSeconds'],
                        'crop':frame['crop'],'cellDimensions':[320,180]})
        reference_rows.append(row)
    prompts=json.loads((HERE/'prompts.json').read_text())
    rows=[]
    for item in prompts:
        identifier=item['id']; p=ROOT/item['output']
        with Image.open(p) as im:
            alpha=im.convert('RGBA').getchannel('A')
            assert alpha.getextrema()==(255,255),identifier
            rows.append({'id':identifier,'path':item['output'],'bytes':p.stat().st_size,'sha256':sha(p),
                'width':im.width,'height':im.height,'mode':im.mode,'fullyOpaque':True,'nativePixelsUnmodified':True,
                'nativeOutput':OUTPUTS[identifier],'sourceId':item['sourceId'],
                'references':[next(r for r in reference_rows if Path(r['path']).name==name) for name in REFERENCE_FILES[identifier]],
                'visualReview':{'reviewed':True,'oneCompletePainting':True,'charactersRemoved':True,
                    'clearContinuousForeground':True,'hiddenContinuityIsOriginalAdaptation':True},
                'cameraAdaptation':'Viewpoint, field of view and cleared foreground adapted for Encore; no surveyed geography or canonical 1:1 claim.'})
    report={'schema':'encore-complete-stage-completion/v1','date':'2026-11-27',
        'baseCommit':'cc972c8412bddb5278ef7c609dd82897325a2922',
        'productionTool':'Built-in image_gen.imagegen, one complete painting per asset',
        'newNativePaintings':9,'newNativeBytes':sum(r['bytes'] for r in rows),
        'previousUnpublishedImagesRecovered':0,'canonicalOneToOneCertified':False,
        'references':reference_rows,'stages':rows,
        'referenceLimitations':['Storyboard images are 320 × 180 source cells, not the full video stream.',
            'The episode 7 beach was inspected and rejected for lake; the final lake derives from the pilot panorama.',
            'candy-route-wide.png at 450 seconds was inspected but not used; the second candy reference is the 520-second cell.',
            'Characters and occluding objects are removed; hidden walls, ground and widened camera continuity are Encore adaptations.'],
        'superseded':[{'path':'docs/art-generation/completion-20261127/stages/backstage-first-candidate.png',
            'reason':'At the outer edges the wall/floor junction sat below the playable foot line. A native imagegen correction raised the junction and extended the carpet.',
            'runtimeUsed':False}]}
    (HERE/'manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    sheet=Image.new('RGB',(1800,1134),'#152135'); draw=ImageDraw.Draw(sheet)
    for index,row in enumerate(rows):
        x=index%3*600;y=index//3*378
        draw.text((x+10,y+12),row['id'],fill='white')
        with Image.open(ROOT/row['path']) as im:
            im.thumbnail((590,333));sheet.paste(im,(x+5,y+38))
    sheet.save(HERE/'native-overview.jpg',quality=91)
    print(json.dumps({'scenes':len(rows),'bytes':report['newNativeBytes'],'references':len(reference_rows)}))

if __name__=='__main__': main()
