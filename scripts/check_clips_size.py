# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

img0 = Image.open("C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/verified_browser_page0_top.png")
img4 = Image.open("C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/verified_browser_page4_signatures.png")

print("Page 0 clip size:", img0.size)
print("Page 4 clip size:", img4.size)
