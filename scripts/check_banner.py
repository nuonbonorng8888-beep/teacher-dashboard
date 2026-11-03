# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

im = Image.open("scratch/full_yukunthor_header_banner.png")
print("size:", im.size)

# Crop first 500 px
c = im.crop((0, 0, 800, im.height))
c.save("scratch/check_banner_crop.png")
print("Saved scratch/check_banner_crop.png")

