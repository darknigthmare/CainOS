#!/usr/bin/env python3
"""Validate the complete recovered wave before installing byte-identical PNGs."""
import hashlib, json, shutil, subprocess
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[1]
WAVE = REPO / 'docs/art-generation/cast-next-20261120'
IDS = ['jaxsuitpomni', 'noirribbit', 'kaufmosuitribbit', 'intermissioncaine',
       'showtimepomni', 'bowlingpinragatha', 'ringmastercaine', 'strongmanorbsman',
       'stagehandbubble', 'bugtamerkinger']
SLOTS = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk',
         'jump', 'crouch', 'victory', 'defeat']
BASE = '6ea3e8041f71789f858ed724ceeb49a3e5efacff'
sha = lambda data: hashlib.sha256(data).hexdigest()
read = lambda path: json.loads(path.read_text())
def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

preload = read(WAVE / 'recovery/preuploaded-file-inventory.json')
preserved = {row['path']: row for row in preload['files']}
original_defeats = {
    'showtimepomni': 'aff64f2b1fbf4294cc916399c1af418078632d731514c8eb3172cbcb987a0b44',
    'bugtamerkinger': '4e1e853ec0eae434b2d08fd7877079e28b9c14d37b4222dcd2b0a22050389d66',
}
definitions, appearances, inventory, missing = [], [], [], []
signatures = set()
for ident in IDS:
    definition_path = WAVE / 'definitions' / (ident + '.json')
    if not definition_path.exists():
        missing.append(str(definition_path.relative_to(REPO))); continue
    definition = read(definition_path)
    assert definition['id'] == ident and definition['introducedOn'] == '2026-11-20'
    definitions.append(definition)
    files = []
    for slot in SLOTS:
        png = WAVE / 'generated' / ident / (slot + '.png')
        receipt_path = png.with_suffix('.json')
        if not png.exists() or not receipt_path.exists():
            missing.append(ident + '/' + slot); continue
        receipt = read(receipt_path)
        assert receipt['appearanceId'] == ident and receipt['slot'] == slot, receipt_path
        assert receipt['status'] == 'accepted_native', receipt_path
        assert receipt['method'] == 'image_gen.imagegen', receipt_path
        assert receipt.get('visualReview', {}).get('status') == 'accepted', receipt_path
        assert receipt['nativeFacing'] in ('left', 'right'), receipt_path
        data = png.read_bytes(); digest = sha(data)
        assert digest == receipt['sha256'] and len(data) == receipt['bytes'], png
        assert digest not in signatures, 'Independent drawings required: ' + str(png)
        signatures.add(digest)
        target = (f'assets/encore/{slot}/{ident}.png' if slot in ('selection','stance')
                  else f'assets/encore/poses/{ident}/{slot}.png')
        assert receipt['targetFile'] == target, receipt_path
        rel = str(png.relative_to(REPO))
        if rel in preserved:
            old = preserved[rel]
            assert digest == old['sha256'] and len(data) == old['bytes'], png
            receipt_old = preserved[str(receipt_path.relative_to(REPO))]
            assert sha(receipt_path.read_bytes()) == receipt_old['sha256'], receipt_path
            recovery = 'exact_preuploaded_git_blob'
        elif slot == 'defeat' and ident in original_defeats:
            assert digest == original_defeats[ident], png
            recovery = 'exact_persisted_tool_result'
        else:
            assert ident in original_defeats, 'Unexpected regenerated family'
            recovery = 'new_native_after_environment_loss'
            native = Path(receipt['nativeSourceFile'])
            # Native tool paths are ephemeral; the archived bytes and receipt remain portable.
            if native.is_file():
                assert native.read_bytes() == data, native
        with Image.open(png) as im:
            im.load()
            assert im.mode == 'RGBA' and min(im.size) >= 768, png
            assert list(im.size) == receipt['dimensions'], png
            alpha = im.getchannel('A'); extrema = list(alpha.getextrema())
            assert extrema[0] == 0 and extrema[1] > 128, png
            bounds = alpha.point(lambda value: 255 if value >= 12 else 0).getbbox()
            assert bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < im.width and bounds[3] < im.height, (png, bounds)
            dimensions = list(im.size)
        refs = []
        for ref in receipt.get('portableReferences', []):
            path = REPO / ref['file']
            verified = path.is_file() and sha(path.read_bytes()) == ref['sha256'] and path.stat().st_size == ref['bytes']
            if recovery == 'new_native_after_environment_loss':
                assert verified, ('New generation reference must be present and exact', path)
            refs.append({**ref, 'currentVerification': 'exact' if verified else 'historical_bytes_unavailable_after_environment_loss'})
        if recovery == 'new_native_after_environment_loss':
            assert refs, ('Missing portable reference record', png)
        row = dict(appearanceId=ident, slot=slot, file=target, archiveFile=rel,
                   receiptFile=str(receipt_path.relative_to(REPO)), sha256=digest,
                   bytes=len(data), dimensions=dimensions, mode='RGBA', alphaExtrema=extrema,
                   alpha12Bounds=list(bounds), nativeFacing=receipt['nativeFacing'],
                   recovery=recovery, references=refs)
        files.append(row); inventory.append(row)
    appearances.append(dict(id=ident, name=definition['name'], fighterId=definition['fighterId'], files=files))
if missing:
    print(json.dumps({'status':'waiting_for_complete_wave', 'missing':missing, 'validatedFiles':len(inventory)}, ensure_ascii=False)); raise SystemExit(2)
assert len(inventory) == 110 and len(definitions) == 10
assert sum(row['recovery'] == 'new_native_after_environment_loss' for row in inventory) == 20
unavailable_refs = [ref for row in inventory for ref in row['references']
                    if ref['currentVerification'] != 'exact']
for row in inventory:
    destination = REPO / row['file']
    if destination.exists(): assert sha(destination.read_bytes()) == row['sha256'], destination
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(REPO / row['archiveFile'], destination)
    assert sha(destination.read_bytes()) == row['sha256']
completion = dict(schema='encore-cast-discovery-completion/v1', status='complete_active',
    createdAt=datetime.now(timezone.utc).isoformat(), baseCommit=BASE, order=IDS,
    counts=dict(appearances=10, files=110, uniqueNativePngs=110,
                nativeBytes=sum(row['bytes'] for row in inventory),
                exactlyRecovered=90, regeneratedAfterEnvironmentLoss=20,
                unavailableHistoricalReferenceLinks=len(unavailable_refs)),
    appearances=appearances,
    limitations=['Original static fan-game poses; no new fighter identities or simulation rules.',
                 'Official merchandise sources do not certify an episode appearance.',
                 'Absolute historical execution paths may be obsolete; portable reference files are verified separately.']
                 + (['Some historical reference bytes are unavailable; their original receipt hashes are preserved.']
                    if unavailable_refs else []))
write(WAVE/'generation-completion.json', completion)
write(WAVE/'asset-inventory.json', inventory)
write(WAVE/'native-facing.json', {item['id']:{r['slot']:r['nativeFacing'] for r in item['files']} for item in appearances})
(REPO/'combat/costume-discoveries-20261120.mjs').write_text(
    '/** Ten original fan-game appearance families based on named official merchandise. */\n'
    + 'export const COSTUME_DISCOVERY_DEFINITIONS = ' + json.dumps(definitions, ensure_ascii=False, indent=2) + ';\n')
print(json.dumps(completion['counts'], ensure_ascii=False))
