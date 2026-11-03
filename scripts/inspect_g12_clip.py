# -*- coding: utf-8 -*-
import fitz
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect g12_page0_clip.png vs g12 original
doc = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
p0 = doc[0]
rect = fitz.Rect(100, 80, 500, 220)
pix = p0.get_pixmap(clip=rect, dpi=150)
pix.save("g12_header_clip.png")
print("Saved g12_header_clip.png")

