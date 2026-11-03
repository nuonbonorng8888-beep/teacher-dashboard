# -*- coding: utf-8 -*-
from PIL import Image
import pytesseract
import sys

sys.stdout.reconfigure(encoding='utf-8')

for p in ['extracted_p0_banner.png', 'extracted_p2_sig.png']:
    im = Image.open(p)
    print(f"{p}: {im.size}")

