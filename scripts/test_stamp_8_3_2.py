import pymupdf
from PIL import Image, ImageDraw, ImageFont
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open('scratch/test_adjusted_8_3_2.pdf')
p4 = doc[4]
page_w, page_h = p4.rect.width, p4.rect.height

# Render 3-column signature block
sig_w = 545.0
sig_h = 145.0
sig_x = 28.0
sig_y0 = 640.0

sig_canvas = Image.new('RGB', (1200, 360), (255, 255, 255))
sdraw = ImageDraw.Draw(sig_canvas)

font_khmer = ImageFont.truetype('C:/Windows/Fonts/KhmerOSsiemreap.ttf', 24)
font_muol = ImageFont.truetype('C:/Windows/Fonts/KhmerOSmuollight.ttf', 26)

# Date text (right)
sdraw.text((980, 20), "រាជធានីភ្នំពេញ ថ្ងៃទី ១២ ខែ តុលា ឆ្នាំ ២០២៦", fill=(0,0,0), font=font_khmer, anchor="ms")

# Column Titles
sdraw.text((200, 65), "បានឃើញ និងឯកភាព", fill=(0,0,0), font=font_muol, anchor="ms")
sdraw.text((600, 65), "បានឃើញ និងពិនិត្យ", fill=(0,0,0), font=font_muol, anchor="ms")
sdraw.text((980, 65), "គ្រូបង្រៀន", fill=(0,0,0), font=font_muol, anchor="ms")

# Subtitles
sdraw.text((200, 105), "ជ.គណៈគ្រប់គ្រងសាលារៀនជំនាន់ថ្មី", fill=(0,0,0), font=font_khmer, anchor="ms")
sdraw.text((600, 105), "ប្រធានក្រុមបច្ចេកទេស", fill=(0,0,0), font=font_khmer, anchor="ms")

# Teacher Name
sdraw.text((980, 275), "អ្នកគ្រូ ថោង សុភារី", fill=(0,0,0), font=font_khmer, anchor="ms")

sig_canvas.save('scratch/test_sig_canvas.png')

# Whiteout & Stamp
p4.draw_rect(pymupdf.Rect(sig_x, sig_y0, sig_x + sig_w, sig_y0 + sig_h), color=(1, 1, 1), fill=(1, 1, 1))
p4.insert_image(pymupdf.Rect(sig_x, sig_y0, sig_x + sig_w, sig_y0 + sig_h), filename='scratch/test_sig_canvas.png')

# Running footer
p4.draw_line(pymupdf.Point(65.0, page_h - 34.0), pymupdf.Point(547.0, page_h - 34.0), color=(0,0,0), width=0.8)

doc.save('scratch/stamped_adjusted_8_3_2.pdf')
pix = p4.get_pixmap(dpi=150)
pix.save('C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/verified_8_3_2_p4.png')
print("Rendered verified_8_3_2_p4.png successfully!")
