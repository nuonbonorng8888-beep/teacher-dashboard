# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

im = Image.open("scratch/full_yukunthor_header_banner.png")
print("im size:", im.size)
# Let's save a resized version to artifact to inspect
im_thumb = im.resize((1000, int(im.height * 1000 / im.width)))
im_thumb.save("C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/full_header_banner_thumb.png")
print("Saved full_header_banner_thumb.png")
