# -*- coding: utf-8 -*-
import fitz
from PIL import Image, ImageDraw, ImageFont
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf")
logo_img = "images/yukunthor-logo.jpg"

print(f"Total pages: {len(doc)}")

# Load fonts
try:
    font_header = ImageFont.truetype("C:/Windows/Fonts/KhmerOSmuollight.ttf", 28)
    font_footer = ImageFont.truetype("C:/Windows/Fonts/KhmerOSsiemreap.ttf", 22)
except Exception:
    font_header = ImageFont.truetype("arial.ttf", 28)
    font_footer = ImageFont.truetype("arial.ttf", 22)

# Generate Header Text Image
h_canvas = Image.new("RGBA", (1000, 80), (255, 255, 255, 0))
h_draw = ImageDraw.Draw(h_canvas)
h_draw.text((0, 20), "វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)", fill=(0, 0, 0), font=font_header)
h_canvas.save("scratch/test_header_text.png")

# For each page, stamp Header & Footer
for pIdx, page in enumerate(doc):
    pageH = page.rect.height
    pageW = page.rect.width

    # 1. Redact top and bottom
    page.add_redact_annot(fitz.Rect(60, 10, 555, 48), fill=(1, 1, 1))
    page.add_redact_annot(fitz.Rect(60, pageH - 42, 555, pageH - 10), fill=(1, 1, 1))
    page.apply_redactions()

    # 2. Draw Header
    # Logo
    page.insert_image(fitz.Rect(65.0, 14.0, 93.0, 42.0), filename=logo_img)
    # Text
    page.insert_image(fitz.Rect(98.0, 18.0, 98.0 + 240.0, 18.0 + 20.0), filename="scratch/test_header_text.png")
    # Dividing line
    page.draw_line(fitz.Point(65.0, 45.0), fitz.Point(547.0, 45.0), color=(0, 0, 0), width=0.8)

    # 3. Draw Footer
    # Dividing line
    page.draw_line(fitz.Point(65.0, pageH - 35.0), fitz.Point(547.0, pageH - 35.0), color=(0, 0, 0), width=0.8)

    # Create page-specific footer image
    f_canvas = Image.new("RGBA", (1400, 60), (255, 255, 255, 0))
    f_draw = ImageDraw.Draw(f_canvas)
    f_draw.text((0, 15), "បង្រៀនដោយ៖ អ្នកគ្រូ ថោង សុភារី", fill=(0, 0, 0), font=font_footer, anchor="ls")
    f_draw.text((700, 15), f"- {pIdx + 1} -", fill=(0, 0, 0), font=font_footer, anchor="ms")
    f_draw.text((1400, 15), "លេខទូរស័ព្ទ៖ 096 75 74 005", fill=(0, 0, 0), font=font_footer, anchor="rs")
    f_path = f"scratch/test_f_{pIdx}.png"
    f_canvas.save(f_path)

    # Insert footer image
    page.insert_image(fitz.Rect(65.0, pageH - 32.0, 547.0, pageH - 14.0), filename=f_path)

doc.save("scratch/test_header_footer_result.pdf")
print("Saved scratch/test_header_footer_result.pdf successfully!")

