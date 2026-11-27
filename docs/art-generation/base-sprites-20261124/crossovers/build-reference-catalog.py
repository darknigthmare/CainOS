from pathlib import Path
import json,hashlib
ROOT=Path('/workspace/scratch/e51b531817b1/CainOS-restored')
D=ROOT/'docs/art-generation/base-sprites-20261124/crossovers'
specs=[
('gaslightdistrict-official-banner.png','gaslightdistrict','https://www.glitchprod.com/gaslight-district','https://static.wixstatic.com/media/84ed6a_0c73f396bbad4f968b8d2f71de4c4a3e~mv2.png','context-only'),
('gaslightdistrict-official-cast.png','gaslightdistrict','https://www.glitchprod.com/gaslight-district','https://static.wixstatic.com/media/84ed6a_902a9c84f20c4a3787deb6bade19922e~mv2.png','context-only'),
('gaslightdistrict-mel-official-figure.png','gaslightdistrict','https://glitchproductions.store/products/mel-animatez','https://glitchproductions.store/cdn/shop/files/mel-animatez-1.png?v=1762499001&width=1600','hommage-clothing-reference'),
('knightsofguinevere-official-banner.png','knightsofguinevere','https://www.glitchprod.com/knights-of-guinevere','https://static.wixstatic.com/media/84ed6a_a745ee15cacb44778910aedb35ba5973~mv2.png','hommage-clothing-reference'),
('gameoverse-kit-official.png','gameoverse','https://www.glitchprod.com/gameoverse','https://static.wixstatic.com/media/b48361_3ffd772159bd425dab8ab5affcc2b78d~mv2.png','hommage-clothing-reference'),
('lackadaisy-official-banner.png','lackadaisy','https://www.glitchprod.com/lackadaisy','https://static.wixstatic.com/media/1d8dbc_305d38e6dbdd41d195620a954d8b451a~mv2.png','context-only'),
('lackadaisy-rocky-official-standee.png','lackadaisy','https://lackadaisy.store/products/rocky-standee','https://lackadaisy.store/cdn/shop/files/Rokcy-Standee_01.png?v=1719547589&width=640','hommage-clothing-reference'),
('smg4-official-2023-model.jpg','smg4','https://steamcommunity.com/sharedfiles/filedetails/?id=2949486881','https://images.steamusercontent.com/ugc/2050865991864388257/A90483F426FED5A90991342887AF1DB4AB127165/','hommage-clothing-reference-left-blue-figure'),
('ultrajumpmania-official-pilot-thumbnail.jpg','ultrajumpmania','https://www.youtube.com/watch?v=HZoOzz1CrAk','https://i.ytimg.com/vi/HZoOzz1CrAk/maxresdefault.jpg','hommage-clothing-and-fusion-motif-reference')]
records=[]
for name,series,page,url,role in specs:
 p=D/'references'/name;raw=p.read_bytes()
 records.append({'file':str(p.relative_to(ROOT)),'series':series,'sourcePage':page,'url':url,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'referenceKind':'primary-public-source','viewed':True,'role':role,'canonicalEvidenceForRibbitCostume':False})
families=[]
for series,owner in [('gaslightdistrict','gummigoo'),('knightsofguinevere','pomni'),('gameoverse','pomni'),('lackadaisy','jax'),('smg4','jax'),('ultrajumpmania','gummigoo')]:
 files=[]
 for style,state in [('hommage','selection'),('resident','stance'),('fusion','stance')]:
  p=ROOT/f'assets/encore/crossovers/{series}/{owner}/{style}/{state}.webp'
  raw=p.read_bytes();files.append({'file':str(p.relative_to(ROOT)),'style':style,'state':state,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'viewed':True})
 families.append({'series':series,'owner':owner,'role':'existing Encore style and materials reference, not canonical evidence','files':files})
identity=[]
for state in ['selection','stance']:
 p=ROOT/f'assets/encore/{state}/ribbit.png';raw=p.read_bytes()
 identity.append({'file':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'viewed':True,'role':'published Ribbit identity and proportions'})
catalog={'date':'2026-11-24','scope':'Six new original Encore Ribbit crossover base families','publicSources':records,'existingEncoreFamilies':families,'ribbitIdentityReferences':identity,'referencePolicy':'Primary sources ground world and clothing cues; all resulting crossovers remain original Encore designs. Later portraits reference the newly validated stance only.','fidelityLimit':'No official Ribbit crossover costume or animation is asserted.'}
(D/'references/reference-catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
(D/'references/official-source-downloads.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'primaryFiles':len(records),'historicalFamilyFiles':sum(len(x['files']) for x in families),'identityFiles':len(identity),'primaryBytes':sum(x['bytes'] for x in records)}))

