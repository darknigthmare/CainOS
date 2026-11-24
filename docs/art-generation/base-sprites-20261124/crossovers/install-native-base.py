#!/usr/bin/env python3
"""Install a builtin image generation result byte-for-byte and record its audit."""
from pathlib import Path
import hashlib, json, shutil, sys
from PIL import Image
root=Path("/workspace/scratch/e51b531817b1/CainOS-restored")
doc=root/"docs/art-generation/base-sprites-20261124/crossovers"
receipt_path=Path(sys.argv[1])
r=json.loads(receipt_path.read_text())
native=Path(r["native_path"])
raw=native.read_bytes()
with Image.open(native) as im:
    im.load()
    if im.format!="PNG" or im.mode!="RGBA": raise ValueError("Native result must be RGBA PNG")
    alpha=im.getchannel("A"); hist=alpha.histogram()
    bbox=alpha.point(lambda v:255 if v>=12 else 0).getbbox()
    if not bbox or hist[0]==0 or hist[255]==0: raise ValueError("Genuine transparent and opaque pixels required")
    w,h=im.size
    border=[alpha.crop(box).getextrema()[1] for box in ((0,0,w,1),(0,h-1,w,h),(0,0,1,h),(w-1,0,w,h))]
    r.update(width=w,height=h,mode=im.mode,format=im.format,alpha12BBox=bbox,alpha12Margins=[bbox[0],bbox[1],w-bbox[2],h-bbox[3]],alphaZeroFraction=hist[0]/(w*h),alphaOpaqueFraction=hist[255]/(w*h),borderAlphaMax=max(border))
rel=f'assets/encore/crossovers/{r["series"]}/ribbit/{r["style"]}/{r["state"]}.png'
dst=root/rel
dst.parent.mkdir(parents=True,exist_ok=True)
if dst.exists() and dst.read_bytes()!=raw: raise FileExistsError(f"Existing different asset: {dst}")
if not dst.exists(): shutil.copyfile(native,dst)
if dst.read_bytes()!=raw: raise ValueError("Byte mismatch after copy")
r.update(file=rel,bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest(),sha=hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest(),nativeBytesVerified=True,visualReview="pending")
r["referencesSHA256"]={str(Path(x).relative_to(root)) if Path(x).is_relative_to(root) else x: hashlib.sha256(Path(x).read_bytes()).hexdigest() for x in r["references"]}
r["auditPass"]=r["borderAlphaMax"]<12 and min(r["alpha12Margins"])>0
receipt_path.write_text(json.dumps(r,ensure_ascii=False,indent=2)+"\n")
current=receipt_path.parent/(r["state"]+".json")
current.write_text(json.dumps(r,ensure_ascii=False,indent=2)+"\n")
print(json.dumps({k:r[k] for k in ["file","bytes","sha","sha256","width","height","alpha12Margins","alphaZeroFraction","borderAlphaMax","nativeBytesVerified","auditPass"]}))
