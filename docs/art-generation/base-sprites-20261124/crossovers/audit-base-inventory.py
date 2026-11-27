#!/usr/bin/env python3
"""Audit native base-only crossover sprites without changing image bytes."""
from pathlib import Path
import hashlib, json
from PIL import Image

ROOT=Path('/workspace/scratch/e51b531817b1/CainOS-restored')
DOC=ROOT/'docs/art-generation/base-sprites-20261124/crossovers'
SERIES=['gaslightdistrict','knightsofguinevere','gameoverse','lackadaisy','smg4','ultrajumpmania']
STYLES=['hommage','resident','fusion']
STATES=['selection','stance']
records=[]
appearances=[]
missing=[]
errors=[]
for series in SERIES:
    for style in STYLES:
        pathbase=f'assets/encore/crossovers/{series}/ribbit/{style}'
        appearance={'id':f'glitch-{series}-ribbit-{style}','series':series,'style':style,
          'sourceKind':'original','baseOnly':True,'presentation':'static',
          'authoredSlots':STATES,'paths':{s:f'{pathbase}/{s}.png' for s in STATES},
          'framing':{'selection':'upper-body' if series=='ultrajumpmania' else 'full-body','stance':'full-body'}}
        states=[]
        for state in STATES:
            receipt=DOC/series/style/f'{state}.json'
            file=f'{pathbase}/{state}.png'
            if not receipt.exists() or not (ROOT/file).exists():
                missing.append(file); continue
            d=json.loads(receipt.read_text())
            raw=(ROOT/file).read_bytes()
            sha256=hashlib.sha256(raw).hexdigest()
            sha=hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
            native=Path(d['native_path'])
            checks={'nativeExists':native.is_file(),'sha256MatchesReceipt':sha256==d['sha256'],
              'gitSHAMatchesReceipt':sha==d['sha'],'nativeBytesVerified':native.is_file() and native.read_bytes()==raw,
              'visuallyAccepted':d.get('visualReview')=='accepted','sourceKindOriginal':d.get('sourceKind')=='original',
              'baseOnly':d.get('baseOnly') is True,'nativeFacingConfirmed':d.get('nativeFacing')=='right',
              'framingMatchesIntended':d.get('framing')==appearance['framing'][state]}
            with Image.open(ROOT/file) as im:
                im.load()
                checks['formatPNG']=im.format=='PNG'
                checks['modeRGBA']=im.mode=='RGBA'
                a=im.getchannel('A'); hist=a.histogram(); w,h=im.size
                bbox=a.point(lambda x:255 if x>=12 else 0).getbbox()
                margins=[bbox[0],bbox[1],w-bbox[2],h-bbox[3]]
                border=max(a.crop((0,0,w,1)).getextrema()[1],a.crop((0,h-1,w,h)).getextrema()[1],a.crop((0,0,1,h)).getextrema()[1],a.crop((w-1,0,w,h)).getextrema()[1])
                checks['genuineTransparency']=hist[0]>0 and sum(hist[240:])>0
                checks['positiveAlpha12Margins']=all(x>0 for x in margins)
                checks['noVisibleBorder']=border<12
                metrics={'width':w,'height':h,'alpha12BBox':list(bbox),'alpha12Margins':margins,'borderAlphaMax':border,'alphaZeroFraction':hist[0]/(w*h),'alpha240Fraction':sum(hist[240:])/(w*h)}
            for ref,expected in d.get('referencesSHA256',{}).items():
                p=Path(ref) if ref.startswith('/') else ROOT/ref
                if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=expected:
                    errors.append({'file':file,'referenceChanged':ref})
                    checks['referenceHashesUnchanged']=False
            checks.setdefault('referenceHashesUnchanged',True)
            record={k:d[k] for k in ['id','series','style','state','label','identity','sourceKind','baseOnly','references','referencesSHA256','sourceUrls','nativeFacing','native_path','result_store_key','prompt','framing','fullBodyVisible','visualReviewNotes'] if k in d}
            record.update({'file':file,'sha256':sha256,'sha':sha,'bytes':len(raw),'nativeBytesVerified':checks['nativeBytesVerified'],
              'noPostProcessing':True,'checks':checks,**metrics,'accepted':all(checks.values())})
            records.append(record);states.append(record)
            if not all(checks.values()): errors.append({'file':file,'failed':[k for k,v in checks.items() if not v]})
            appearance.setdefault('name',d.get('label',appearance['id']))
            appearance.setdefault('identity',d.get('identity'))
            appearance.setdefault('sourceUrls',d.get('sourceUrls',[]))
        extra=[p.name for p in (ROOT/pathbase).glob('*.png') if p.stem not in STATES]
        if extra:errors.append({'appearance':appearance['id'],'unexpectedStates':extra})
        appearance['nativeFacing']='right' if len(states)==2 and all(x.get('nativeFacing')=='right' for x in states) else None
        appearance['complete']=len(states)==2 and all(x['accepted'] for x in states)
        appearance['distinctImages']=len(states)==2 and len({x['sha256'] for x in states})==2
        appearances.append(appearance)
unique=len({x['sha256'] for x in records})
complete=len(records)==36 and unique==36 and not missing and not errors and all(x['complete'] and x['distinctImages'] for x in appearances)
manifest={'date':'2026-11-24','purpose':'36 original Encore Ribbit crossover base sprites','canonicalStatus':'Original fan-game designs; no official Ribbit crossover costume asserted.',
 'complete':complete,'baseOnly':True,'presentation':'static','authoredSlots':STATES,
 'expectedAppearances':18,'expectedFiles':36,'appearanceCount':len(appearances),'fileCount':len(records),'uniqueNativePNGs':unique,
 'totalBytes':sum(x['bytes'] for x in records),'appearances':appearances,'records':records,'missing':missing,'errors':errors,
 'framingSummary':{'fullBodyStances':sum(r['state']=='stance' and r.get('framing')=='full-body' for r in records),'fullBodySelections':sum(r['state']=='selection' and r.get('framing')=='full-body' for r in records),'upperBodySelections':sum(r['state']=='selection' and r.get('framing')=='upper-body' for r in records)},
 'framingExceptions':[{'id':f'glitch-ultrajumpmania-ribbit-{style}','state':'selection','framing':'upper-body','reason':'Intentional character-selection bust framing explicitly retained by root. The associated stance shows the whole body.'} for style in STYLES],
 'limitations':['Two static base drawings per appearance, not an animation cycle.','The sources establish universe and costume references, not canonical status of these original crossovers.','No pixel retouching, rescaling, compositing, cropping or alpha conversion was applied.','The three Ultra Jump Mania selections are intentionally drawn as upper-body portraits; all eighteen stances and the other fifteen selections show the whole body.']}
(DOC/'manifest-progress.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
if complete:(DOC/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for series in SERIES:
    subset=[r for r in records if r['series']==series]
    if len(subset)==6 and all(r['accepted'] for r in subset):
        part={'complete':True,'series':series,'baseOnly':True,'presentation':'static','authoredSlots':STATES,'count':6,
          'appearances':[a for a in appearances if a['series']==series],'records':subset}
        (DOC/f'manifest-{series}.json').write_text(json.dumps(part,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'complete':complete,'fileCount':len(records),'uniqueNativePNGs':unique,'accepted':sum(r['accepted'] for r in records),'missing':len(missing),'errors':errors},ensure_ascii=False))

