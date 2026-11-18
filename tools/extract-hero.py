from PIL import Image, ImageDraw, ImageChops
from pathlib import Path
# Frame 12 has a complete crown, unlike frame 1. Boundaries follow ingredient contours.
src=Image.open('assets/hero/burger (12).webp').crop((700,0,1200,680))
paths=[[(0,166),(500,166)],[(0,384),(55,384),(100,388),(150,384),(205,386),(250,389),(290,380),(345,384),(400,386),(500,384)],[(0,550),(75,550),(120,555),(175,555),(225,548),(280,536),(325,521),(365,512),(400,515),(500,560)]]
remaining=src.getchannel('A')
for i in range(4):
    if i<3:
        mask=Image.new('L',src.size); ImageDraw.Draw(mask).polygon([(0,0),(500,0)]+list(reversed(paths[i])),fill=255)
        alpha=ImageChops.multiply(remaining,mask)
        remaining=ImageChops.subtract(remaining,alpha)
    else: alpha=remaining
    layer=src.copy(); layer.putalpha(alpha); layer.save(f'assets/hero/layers/layer-{i}.webp',quality=94)
src.save('assets/hero/layers/exploded.webp',quality=94)
