#!/usr/bin/env python3
"""Create a separate alpha review diagnostic; never change native asset bytes."""
from pathlib import Path
from PIL import Image, ImageDraw
import argparse, hashlib, json
p=argparse.ArgumentParser()
p.add_argument('--id', required=True)
p.add_argument('--slot', required=True)
args=p.parse_args()
root=Path(__file__).resolve().parents[4]
wave=Path(__file__).resolve().parent
source=wave/'generated'/args.id/(args.slot+'.png')
im=Image.open(source).convert('RGBA')
alpha=im.getchannel('A')
panels=[]
for bg in [(240,242,247,255),(30,34,48,255)]:
 panel=Image.new('RGBA', im.size, bg)
 panel.alpha_composite(im)
 panel=panel.convert('RGB')
 panel.thumbnail((550,800))
 panels.append(panel)
preview=Image.new('RGB',(sum(p.width for p in panels),max(p.height for p in panels)+35),'#808080')
draw=ImageDraw.Draw(preview)
draw.text((10,10),args.id+' '+args.slot+' | alpha composite diagnostic',fill='white')
x=0
for panel in panels:
 preview.paste(panel,(x,35))
 x+=panel.width
target=wave/'review'/args.id/(args.slot+'-alpha.jpg')
target.parent.mkdir(parents=True,exist_ok=True)
preview.save(target,quality=94)
bounds=alpha.point(lambda value:255 if value>12 else 0).getbbox()
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
print(json.dumps({'id':args.id,'slot':args.slot,'source':str(source.relative_to(root)),'sha256':sha(source),'dimensions':list(im.size),'alphaExtrema':list(alpha.getextrema()),'alpha12Bounds':list(bounds),'bytes':source.stat().st_size,'preview':str(target),'previewSHA256':sha(target)},ensure_ascii=False))
