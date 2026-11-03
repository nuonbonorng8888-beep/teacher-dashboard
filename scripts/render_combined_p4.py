# -*- coding: utf-8 -*-
import fitz
from PIL import Image, ImageDraw, ImageFont
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Open the modified PDF where page 3 and 4 are adjusted
doc = fitz.open('scratch/test_item3_moved.pdf')
p4 = doc[4]
pageH = p4.rect.height
pageW = p4.rect.width

# 1. Clean the left and right cell text in the item 3 box
box_x0 = 70.6
box_x1 = 574.9
box_y0 = 55.0
box_y1 = 132.0

# Redraw clean cells
p4.draw_rect(fitz.Rect(box_x0, box_y0, 241.4, box_y1), color=(1,1,1), fill=(1,1,1))
p4.draw_rect(fitz.Rect(430.4, box_y0, box_x1, box_y1), color=(1,1,1), fill=(1,1,1))

# Re-outline table
p4.draw_rect(fitz.Rect(box_x0, box_y0, box_x1, box_y1), color=(0,0,0), width=0.5)
p4.draw_line(fitz.Point(241.4, box_y0), fitz.Point(241.4, box_y1), color=(0,0,0), width=0.5)
p4.draw_line(fitz.Point(430.4, box_y0), fitz.Point(430.4, box_y1), color=(0,0,0), width=0.5)

# Render Left Cell Khmer text via PIL
try:
    font_khmer = ImageFont.truetype('C:/Windows/Fonts/KhmerOSsiemreap.ttf', 24)
except:
    font_khmer = ImageFont.load_default()

c_left = Image.new('RGBA', (500, 220), (255, 255, 255, 255))
d_left = ImageDraw.Draw(c_left)
d_left.text((15, 30), "-កត់លំហាត់លើក្តារខៀន", fill=(0,0,0), font=font_khmer)
d_left.text((15, 75), "និងឲ្យសិស្សមើលខ្លឹមបន្ត", fill=(0,0,0), font=font_khmer)
c_left.save('scratch/c_left.png')
p4.insert_image(fitz.Rect(box_x0 + 1, box_y0 + 1, 241.4 - 1, box_y1 - 1), filename='scratch/c_left.png')

c_right = Image.new('RGBA', (430, 220), (255, 255, 255, 255))
d_right = ImageDraw.Draw(c_right)
d_right.text((15, 30), "-ចម្លងលំហាត់បិទ", fill=(0,0,0), font=font_khmer)
c_right.save('scratch/c_right.png')
p4.insert_image(fitz.Rect(430.4 + 1, box_y0 + 1, box_x1 - 1, box_y1 - 1), filename='scratch/c_right.png')

# 2. Draw Signature Block right below at y = 145 pt
# In test_clean_sig_table.py, we created the 3-column signature block
try:
    font_muol = ImageFont.truetype('C:/Windows/Fonts/KhmerOSmuollight.ttf', 26)
except:
    font_muol = font_khmer

sig_canvas = Image.new('RGBA', (1200, 360), (255, 255, 255, 255))
sdraw = ImageDraw.Draw(sig_canvas)

# Date
sdraw.text((980, 20), "រាជធានីភ្នំពេញ ថ្ងៃទី ២៩ ខែ តុលា ឆ្នាំ ២០២៦", fill=(0,0,0), font=font_khmer, anchor="ms")

# Titles
sdraw.text((200, 65), "បានឃើញ និងឯកភាព", fill=(0,0,0), font=font_muol, anchor="ms")
sdraw.text((600, 65), "បានឃើញ និងពិនិត្យ", fill=(0,0,0), font=font_muol, anchor="ms")
sdraw.text((980, 65), "គ្រូបង្រៀន", fill=(0,0,0), font=font_muol, anchor="ms")

# Subtitles
sdraw.text((200, 105), "ជ.គណៈគ្រប់គ្រងសាលារៀនជំនាន់ថ្មី", fill=(0,0,0), font=font_khmer, anchor="ms")
sdraw.text((600, 105), "ប្រធានក្រុមបច្ចេកទេស", fill=(0,0,0), font=font_khmer, anchor="ms")

# Teacher Name
sdraw.text((980, 275), "អ្នកគ្រូ ថោង សុភារី", fill=(0,0,0), font=font_khmer, anchor="ms")
sig_canvas.save('scratch/full_sig_test.png')

# Insert signature block
sig_y = 145.0
p4.insert_image(fitz.Rect(65.0, sig_y, 65.0 + 490.0, sig_y + 145.0), filename='scratch/full_sig_test.png')

# 3. Draw Running Header (at top y=14)
p4.insert_image(fitz.Rect(65.0, 14.0, 93.0, 42.0), filename='images/yukunthor-logo.jpg')
p4.draw_line(fitz.Point(65.0, 45.0), fitz.Point(547.0, 45.0), color=(0,0,0), width=0.8)
# Title
h_canvas = Image.new('RGBA', (1000, 80), (255, 255, 255, 255))
hdraw = ImageDraw.Draw(h_canvas)
hdraw.text((10, 40), "វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)", fill=(0,0,0), font=font_muol, anchor="lm")
h_canvas.save('scratch/h_text_test.png')
p4.insert_image(fitz.Rect(98.0, 18.0, 98.0 + 240.0, 18.0 + 20.0), filename='scratch/h_text_test.png')

# 4. Draw Running Footer (at bottom y=pageH - 35)
p4.draw_line(fitz.Point(65.0, pageH - 35.0), fitz.Point(547.0, pageH - 35.0), color=(0,0,0), width=0.8)
p4.insert_image(fitz.Rect(65.0, pageH - 30.0, 547.0, pageH - 14.0), filename='scratch/test_proportional_footer.png')

# Save and render full page 4
doc.save('scratch/final_preview_p4.pdf')
p4.get_pixmap(dpi=150).save('scratch/final_preview_p4.png')
print('Rendered scratch/final_preview_p4.png successfully!')

