# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

im = Image.open("scratch/full_yukunthor_header_banner.png")
w, h = im.size
right_half = im.crop((w // 2, 0, w, h - 10)) # exclude bottom line
bbox = right_half.getbbox()
print("Bounding box of right half (excluding bottom line):", bbox)

