# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

im = Image.open("scratch/full_yukunthor_header_banner.png")
# Check right half
w, h = im.size
right_half = im.crop((w // 2, 0, w, h))
right_half.save("scratch/banner_right_half.png")

# Check bounding box of non-white pixels in right half
import numpy as np
arr = np.array(right_half)
# non-white
non_white = np.any(arr < 250, axis=2)
print("Any non-white pixels in right half?", np.any(non_white))
