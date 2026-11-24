from pathlib import Path
import json,hashlib
ROOT=Path('/workspace/scratch/e51b531817b1/CainOS-restored')
D=ROOT/'docs/art-generation/base-sprites-20261124/crossovers'
m=json.loads((D/'manifest.json').read_text())
assert m['complete'] and len(m['records'])==36
byfile={r['file']:r for r in m['records']}
blobs=[]
for series in ['gaslightdistrict','knightsofguinevere','gameoverse','lackadaisy','smg4','ultrajumpmania']:
 b=json.loads((D/f'github-blobs-{series}.json').read_text())
 assert b['complete'] and b['count']==6
 for row in b['records']:
  expected=byfile[row['file']]
  assert row['sha']==expected['sha'] and row['sha256']==expected['sha256'] and row['bytes']==expected['bytes']
  assert row['nativeBytesVerified'] and row['gitBlobSHAEqualsLocal']
  blobs.append(row)
assert len(blobs)==36 and len({r['file'] for r in blobs})==36 and set(r['file'] for r in blobs)==set(byfile)
merged={'complete':True,'repository':'darknigthmare/CainOS','count':36,'uniqueGitBlobs':len({r['sha'] for r in blobs}),'totalBytes':sum(r['bytes'] for r in blobs),'allNativeBytesVerified':True,'noTreeRefOrCommitCreatedByThisUploadProcess':True,'records':sorted(blobs,key=lambda r:r['file'])}
(D/'github-blobs.json').write_text(json.dumps(merged,ensure_ascii=False,indent=2)+'\n')
review=[]
for row in m['records']:
 p=D/row['series']/row['style']/(row['state']+'.json');d=json.loads(p.read_text())
 review.append({'file':row['file'],'id':row['id'],'series':row['series'],'style':row['style'],'state':row['state'],'sha256':row['sha256'],'bytes':row['bytes'],'accepted':True,'nativeFacing':'right','framing':row['framing'],'fullBodyVisible':row['fullBodyVisible'],'visuallyInspectedBy':'original_abstraction_art','nativeBytesVerified':row['nativeBytesVerified'],'alpha12Margins':row['alpha12Margins'],'borderAlphaMax':row['borderAlphaMax'],'notes':d.get('visualReviewNotes','Verified original Encore base drawing.')})
result={'date':'2026-11-24','complete':True,'reviewer':'original_abstraction_art','imagesInspected':36,'appearancesReviewed':18,'allAccepted':True,'sourceKind':'original','baseOnly':True,'authoredSlots':['selection','stance'],'framingSummary':m['framingSummary'],'framingExceptions':m['framingExceptions'],'sources':'references/reference-catalog.json','sourceCatalogSHA256':hashlib.sha256((D/'references/reference-catalog.json').read_bytes()).hexdigest(),'manifestSHA256':hashlib.sha256((D/'manifest.json').read_bytes()).hexdigest(),'findings':['All eighteen full-body stances retain the core Ribbit eyes, cheeks, mouth and pink bow motif.','Each universe has visibly distinct homage clothing, resident adaptation and a physical fusion design.','The fifteen full-body selection drawings use an upright greeting distinct from the associated guard.','The three Ultra Jump Mania selections intentionally present upper-body portraits based on the associated complete stance design.','All native files retain real transparency and positive alpha-12 margins. Some native margins are narrower than requested but no intended silhouette is visibly cut by the canvas border.','The thirty-six authored files are distinct native PNGs; no sprite sheet, derived montage or processed duplicate is used as an asset.'],'limits':['Visual source fidelity is assessed as an original Encore adaptation, not proof of an official crossover costume.','This review covers base drawings; it does not attest any animation or additional action drawing.','Runtime rendering and left/right placement are reviewed separately by runtime_audit.'],'records':review}
(D/'visual-review-final.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(D/'visual-review-progress.json').write_text(json.dumps({'date':'2026-11-24','complete':True,'supersededBy':'visual-review-final.json','imagesInspected':36},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'manifestSHA256':result['manifestSHA256'],'manifestBytes':(D/'manifest.json').stat().st_size,'nativeFiles':36,'nativeTotalBytes':m['totalBytes'],'allAccepted':result['allAccepted'],'uniqueGitBlobs':merged['uniqueGitBlobs'],'framing':m['framingSummary'],'minAlpha12Margin':min(min(r['alpha12Margins']) for r in m['records']),'maxBorderAlpha':max(r['borderAlphaMax'] for r in m['records'])}))

