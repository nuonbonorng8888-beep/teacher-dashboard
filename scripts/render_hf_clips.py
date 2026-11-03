# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("scratch/test_header_footer_result.pdf")
p0 = doc[0]
rect_top = fitz.Rect(50, 5, 560, 60)
pix_top = p0.get_pixmap(clip=rect_top, dpi=150)
pix_top.save("scratch/test_rendered_top_header.png")

rect_bot = fitz.Rect(50, p0.rect.height - 50, 560, p0.rect.height - 5)
pix_bot = p0.get_pixmap(clip=rect_bot, dpi=150)
pix_bot.save("scratch/test_rendered_bottom_footer.png")

print("Saved clips successfully!")

