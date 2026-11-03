# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's crop the text area on Page 0 and Page 4
img0 = Image.open("C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/verified_browser_page0_top.png")
img4 = Image.open("C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/verified_browser_page4_signatures.png")

# Save crops to inspect
crop0 = img0.crop((200, 100, 1100, 420))
crop0.save("scratch/crop0_check.png")

crop4 = img4.crop((100, 50, 1180, 420))
crop4.save("scratch/crop4_check.png")

print("Saved crop0_check.png and crop4_check.png")
