import test, {before, after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {deflateSync} from 'node:zlib';
import {auditCombatAssets} from '../scripts/audit-combat-assets.mjs';
import {FIGHTERS} from '../combat/data.mjs';
import {ANIMATION_REGISTRATION, POSE_PRESENTATION} from '../combat/render-poses.mjs';

// Small actual PNG files exercise decoding and crop alpha, not fabricated reports.
const crc32 = bytes => {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
};
const chunk = (name, bytes) => {
  const type = Buffer.from(name), size = Buffer.alloc(4), crc = Buffer.alloc(4);
  size.writeUInt32BE(bytes.length); crc.writeUInt32BE(crc32(Buffer.concat([type,bytes])));
  return Buffer.concat([size,type,bytes,crc]);
};
function png(width, height, pixel, alpha = true) {
  const channels = alpha ? 4 : 3, data = Buffer.alloc((width * channels + 1) * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const values = pixel(x,y), offset = y * (width * channels + 1) + 1 + x * channels;
    for (let channel = 0; channel < channels; channel++) data[offset+channel] = values[channel];
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=alpha?6:2;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(data)),chunk('IEND',Buffer.alloc(0))]);
}
let root;
const image = name => '../assets/images/' + name + '.png';
const entry = (id, name, extra={}) => ({id, sprite:{src:image(name),cols:1,rows:1,...extra}});
const run = options => auditCombatAssets({root,fighters:[],archive:[],variants:[],registrations:{},presentation:{},sources:[],...options});
before(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(),'encore-asset-tests-'));
  const folder = path.join(root,'assets/images');await fs.mkdir(path.join(folder,'bad'),{recursive:true});
  const files = {
    'valid.png': png(8,8,(x,y)=>[255,60,30,x>=2&&x<6&&y>=2&&y<6?255:0]),
    'opaque.png': png(8,8,()=>[255,60,30,255]),
    'legacy.png': png(8,8,()=>[255,60,30],false),
    'empty.png': png(8,8,()=>[255,60,30,0]),
    'crop-trap.png': png(8,8,x=>[255,60,30,x<4?255:0]),
    'cainos-jax-animation-sheet-0.5.0.png': png(1536,1024,(x,y)=>[255,60,30,x%384>40&&x%384<340&&y%512>40&&y%512<450?255:0]),
    'bad/cainos-jax-animation-sheet-0.5.0.png': png(1535,1024,(x,y)=>[255,60,30,x%384>40&&x%384<340&&y%512>40&&y%512<450?255:0]),
  };
  for (const [name,bytes] of Object.entries(files)) await fs.writeFile(path.join(folder,name),bytes);
});
after(async () => {await fs.rm(root,{recursive:true,force:true});});

test('native alpha is checked inside the chosen crop, and opaque legacy atlases remain allowed', async () => {
  const valid = await run({archive:[entry('native','valid',{matteMode:'native-alpha'}),entry('legacy','legacy')]});
  assert.equal(valid.pass,true,JSON.stringify(valid.errors));
  assert.equal(valid.references.find(ref=>ref.entityId==='legacy').alpha.has_alpha,false);
  assert.equal(valid.references.find(ref=>ref.entityId==='native').alpha.visible_pixels,16);
  const cropped = await run({archive:[entry('crop','crop-trap',{matteMode:'native-alpha',sourceRect:{x:0,y:0,width:4,height:8}})]});
  assert(cropped.images[0].raster.transparent_pixels>0,'The full atlas is transparent.');
  assert(cropped.errors.some(error=>error.code==='opaque-native-alpha'&&error.subject==='archive:crop:sprite'));
});

test('fully opaque RGBA and fully transparent selected regions fail for different reasons', async () => {
  const report = await run({archive:[entry('opaque','opaque',{matteMode:'native-alpha'}),entry('empty','empty',{matteMode:'native-alpha'})]});
  assert.equal(report.pass,false);
  assert(report.errors.some(error=>error.code==='opaque-native-alpha'&&error.subject==='archive:opaque:sprite'));
  assert(report.errors.some(error=>error.code==='empty-region'&&error.subject==='archive:empty:sprite'));
  assert.equal(report.references.find(ref=>ref.entityId==='opaque').alpha.has_alpha,true,'An alpha channel alone must not pass.');
});

test('out-of-atlas crops are rejected before Pillow can pad them with transparent pixels', async () => {
  const report = await run({archive:[entry('outside','valid',{sourceRect:{x:7,y:0,width:2,height:8}})]});
  assert.equal(report.pass,false);
  assert(report.errors.some(error=>error.code==='invalid-crop'&&error.subject==='archive:outside:sprite'));
  assert.equal(report.references[0].alpha,undefined,'An invalid rectangle is not decoded as a padded valid crop.');
});

const animated = overrides => {
  const fighter=structuredClone(FIGHTERS.find(item=>item.id==='jax'));
  fighter.sprite=entry('unused','valid').sprite;delete fighter.fidelity;
  return {...fighter,...overrides};
};
const animationOptions = fighter => ({fighters:[fighter],registrations:{jax:structuredClone(ANIMATION_REGISTRATION.jax)},presentation:{jax:structuredClone(POSE_PRESENTATION.jax)}});

test('invalid frame references in state lists and presentation mappings fail even when all atlas cells exist', async () => {
  const fighter=animated(), options=animationOptions(fighter);
  fighter.animation.frames.attack=[8];
  options.presentation.jax.melee=[2,-1];
  const report=await run(options);
  assert.equal(report.pass,false);
  assert(report.errors.some(error=>error.code==='invalid-frame'&&error.subject==='jax:animation.attack'));
  assert(report.errors.some(error=>error.code==='invalid-frame'&&error.subject==='jax:presentation.melee'));
});

test('changed sheet dimensions cannot silently fall back to unregistered animation geometry', async () => {
  const fighter=animated();
  fighter.animation.src='../assets/images/bad/cainos-jax-animation-sheet-0.5.0.png';
  const report=await run(animationOptions(fighter));
  assert.equal(report.pass,false);
  assert(report.errors.some(error=>error.code==='unregistered-animation'));
});

test('changed anchors are rejected if outside a crop or inconsistent with the runtime registration', async () => {
  const options=animationOptions(animated());
  options.registrations.jax.anchors[0].x=1000;
  options.registrations.jax.anchors[1].x+=1;
  const report=await run(options);
  assert.equal(report.pass,false);
  assert(report.errors.some(error=>error.code==='invalid-anchor'&&error.subject==='fighter:jax:frame:0'));
  assert(report.errors.some(error=>error.code==='anchor-mismatch'&&error.subject==='fighter:jax:frame:1'));
});

test('missing images and damaged PNG data are reported as failures without claiming a valid asset', async () => {
  const corrupt=path.join(root,'assets/images/damaged.png');
  const bytes=await fs.readFile(path.join(root,'assets/images/valid.png'));
  bytes[bytes.length-17]^=255;await fs.writeFile(corrupt,bytes);
  const report=await run({archive:[entry('missing','missing'),entry('damaged','damaged')]});
  assert.equal(report.pass,false);
  assert(report.errors.some(error=>error.code==='unreadable-image'&&error.subject==='archive:missing'));
  assert(report.errors.some(error=>error.code==='raster-decode'&&error.subject==='assets/images/damaged.png'));
});

test('repeated inspection produces deterministic evidence and never changes source PNG bytes', async () => {
  const file=path.join(root,'assets/images/valid.png'), before=await fs.readFile(file);
  const options={archive:[entry('native','valid',{matteMode:'native-alpha'})]};
  const first=await run(options),second=await run(options);
  assert.equal(first.pass,true);assert.deepEqual(second,first);
  assert.deepEqual(await fs.readFile(file),before);
});
