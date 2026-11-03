# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/browser_stamped_8_1_1.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")

# Page 0 top & bottom
p0 = doc[0]
rect_top0 = fitz.Rect(50, 0, 560, 60)
p0.get_pixmap(clip=rect_top0, dpi=150).save("scratch/browser_p0_top.png")

rect_bot0 = fitz.Rect(50, p0.rect.height - 50, 560, p0.rect.height)
p0.get_pixmap(clip=rect_bot0, dpi=150).save("scratch/browser_p0_bot.png")

# Page 1 top & bottom
p1 = doc[1]
p1.get_pixmap(clip=rect_top0, dpi=150).save("scratch/browser_p1_top.png")
p1.get_pixmap(clip=rect_bot0, dpi=150).save("scratch/browser_p1_bot.png")

# Page 4 (sig page)
p4 = doc[4]
p4.get_pixmap(clip=rect_top0, dpi=150).save("scratch/browser_p4_top.png")
p4.get_pixmap(clip=rect_bot0, dpi=150).save("scratch/browser_p4_bot.png")

print("Saved all inspection clips successfully!")

