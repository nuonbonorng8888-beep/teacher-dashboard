# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

im = Image.open("scratch/full_yukunthor_header_banner.png")
w, h = im.size
print("Width:", w, "Height:", h)
im_left = im.crop((0, 0, 1000, h))
im_right = im.crop((1000, 0, w, h))
im_left.save("scratch/banner_left.png")
im_right.save("scratch/banner_right.png")
print("Saved banner_left.png and banner_right.png")
