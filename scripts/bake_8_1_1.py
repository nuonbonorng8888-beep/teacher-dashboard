# -*- coding: utf-8 -*-
import fitz
from PIL import Image, ImageDraw, ImageFont
import os, sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

p3 = doc[3] # Page 4
p4 = doc[4] # Page 5

# 1. On Page 4: Whiteout item 3 area below y = 637.0
# Clear item 3 completely
p3.draw_rect(fitz.Rect(70.0, 637.0, 575.5, 715.0), color=(1,1,1), fill=(1,1,1))
# Close bottom border of table
p3.draw_line(fitz.Point(70.6, 637.0), fitz.Point(574.9, 637.0), color=(0,0,0), width=0.5)

# 2. On Page 5: Whiteout everything above y = 350
p4.draw_rect(fitz.Rect(60.0, 20.0, 575.0, 350.0), color=(1,1,1), fill=(1,1,1))

# Box coordinates for Item 3 continuation
box_x0 = 70.6
box_x1 = 574.9
box_y0 = 55.0
box_y1 = 132.0

# Draw table outline & dividers
p4.draw_rect(fitz.Rect(box_x0, box_y0, box_x1, box_y1), color=(0,0,0), width=0.5)
p4.draw_line(fitz.Point(241.4, box_y0), fitz.Point(241.4, box_y1), color=(0,0,0), width=0.5)
p4.draw_line(fitz.Point(430.4, box_y0), fitz.Point(430.4, box_y1), color=(0,0,0), width=0.5)

font_khmer = ImageFont.truetype('C:/Windows/Fonts/KhmerOSsiemreap.ttf', 24)
font_muol = ImageFont.truetype('C:/Windows/Fonts/KhmerOSmuollight.ttf', 26)

# Render Left Cell
c_left = Image.new('RGBA', (500, 220), (255, 255, 255, 255))
d_left = ImageDraw.Draw(c_left)
d_left.text((15, 28), "-កត់លំហាត់លើក្តារខៀន", fill=(0,0,0), font=font_khmer)
d_left.text((15, 70), "និងឲ្យសិស្សមើលខ្លឹមបន្ត", fill=(0,0,0), font=font_khmer)
c_left.save('scratch/c_left_cell.png')
p4.insert_image(fitz.Rect(box_x0 + 1, box_y0 + 1, 241.4 - 1, box_y1 - 1), filename='scratch/c_left_cell.png')

# Render Middle Cell (Item 3 math clip)
clip_path = 'scratch/item3_orig_clip.png'
p4.insert_image(fitz.Rect(244.0, box_y0 + 3.0, 244.0 + (432.0 - 244.0), box_y0 + 3.0 + (706.0 - 636.0)), filename=clip_path)

# Render Right Cell
c_right = Image.new('RGBA', (430, 220), (255, 255, 255, 255))
d_right = ImageDraw.Draw(c_right)
d_right.text((15, 28), "-ចម្លងលំហាត់បិទ", fill=(0,0,0), font=font_khmer)
c_right.save('scratch/c_right_cell.png')
p4.insert_image(fitz.Rect(430.4 + 1, box_y0 + 1, box_x1 - 1, box_y1 - 1), filename='scratch/c_right_cell.png')

# 3. On Page 5: Draw Signature Block right below Item 3 at y = 145.0 to 290.0 pt
sig_canvas = Image.new('RGBA', (1200, 360), (255, 255, 255, 255))
sdraw = ImageDraw.Draw(sig_canvas)

# Date text above teacher signature
sdraw.text((980, 20), "រាជធានីភ្នំពេញ ថ្ងៃទី ២៩ ខែ តុលា ឆ្នាំ ២០២៦", fill=(0,0,0), font=font_khmer, anchor="ms")

# Column Titles
sdraw.text((200, 65), "បានឃើញ និងឯកភាព", fill=(0,0,0), font=font_muol, anchor="ms")
sdraw.text((600, 65), "បានឃើញ និងពិនិត្យ", fill=(0,0,0), font=font_muol, anchor="ms")
sdraw.text((980, 65), "គ្រូបង្រៀន", fill=(0,0,0), font=font_muol, anchor="ms")

# Column Subtitles
sdraw.text((200, 105), "ជ.គណៈគ្រប់គ្រងសាលារៀនជំនាន់ថ្មី", fill=(0,0,0), font=font_khmer, anchor="ms")
sdraw.text((600, 105), "ប្រធានក្រុមបច្ចេកទេស", fill=(0,0,0), font=font_khmer, anchor="ms")

# Teacher Name
sdraw.text((980, 275), "អ្នកគ្រូ ថោង សុភារី", fill=(0,0,0), font=font_khmer, anchor="ms")

sig_canvas.save('scratch/full_sig_baked.png')
sig_y = 145.0
p4.insert_image(fitz.Rect(65.0, sig_y, 65.0 + 490.0, sig_y + 145.0), filename='scratch/full_sig_baked.png')

# Save modified PDF
tmp_out = 'scratch/tmp_baked_8_1_1.pdf'
doc.save(tmp_out)
doc.close()

# Replace original file
os.replace(tmp_out, pdf_path)
print(f"Successfully baked Item 3 and Signatures into {pdf_path}!")

# Sync to all copies
for root, dirs, files in os.walk('.'):
    if 'scratch' in root or '.git' in root or 'brain' in root:
        continue
    for f in files:
        if '8_1_1' in f and f.endswith('.pdf'):
            full = os.path.join(root, f)
            if os.path.abspath(full) != os.path.abspath(pdf_path):
                import shutil
                shutil.copy2(pdf_path, full)
                print(f"Synced to {full}")

# Render previews for verification
vdoc = fitz.open(pdf_path)
vdoc[3].get_pixmap(dpi=150).save('scratch/verified_baked_p4.png')
vdoc[4].get_pixmap(dpi=150).save('scratch/verified_baked_p5.png')
print("Rendered scratch/verified_baked_p4.png and scratch/verified_baked_p5.png")
