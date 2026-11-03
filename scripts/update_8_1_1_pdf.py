# -*- coding: utf-8 -*-
import fitz
from PIL import Image, ImageDraw, ImageFont
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Find exact file
for f in os.listdir('.'):
    if 'កិច្ចការតែងការទី៨' in f:
        folder = f
        break

pdf_path = os.path.join(folder, '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

p3 = doc[3]
p4 = doc[4]

# 1. Capture visual clip of Item 3 from Page 3 at 300 DPI
item3_rect = fitz.Rect(244, 636, 432, 706)
pix_item3 = p3.get_pixmap(clip=item3_rect, dpi=300)
clip_path = 'scratch/item3_orig_clip.png'
pix_item3.save(clip_path)

# 2. On Page 3: Whiteout item 3 area below y = 637
p3.draw_rect(fitz.Rect(70.0, 637.0, 575.5, 712.0), color=(1,1,1), fill=(1,1,1))
p3.draw_line(fitz.Point(70.6, 637.0), fitz.Point(574.9, 637.0), color=(0,0,0), width=0.5)

# 3. On Page 4: Whiteout old header area
p4.draw_rect(fitz.Rect(60, 20, 560, 220), color=(1,1,1), fill=(1,1,1))

# Box coordinates for Item 3 continuation
box_x0 = 70.6
box_x1 = 574.9
box_y0 = 55.0
box_y1 = 132.0

# Draw table outline & dividers
p4.draw_rect(fitz.Rect(box_x0, box_y0, box_x1, box_y1), color=(0,0,0), width=0.5)
p4.draw_line(fitz.Point(241.4, box_y0), fitz.Point(241.4, box_y1), color=(0,0,0), width=0.5)
p4.draw_line(fitz.Point(430.4, box_y0), fitz.Point(430.4, box_y1), color=(0,0,0), width=0.5)

# Load Khmer font
try:
    font_khmer = ImageFont.truetype('C:/Windows/Fonts/KhmerOSsiemreap.ttf', 24)
except:
    font_khmer = ImageFont.load_default()

# Render Left Cell
c_left = Image.new('RGBA', (500, 220), (255, 255, 255, 255))
d_left = ImageDraw.Draw(c_left)
d_left.text((15, 28), "-កត់លំហាត់លើក្តារខៀន", fill=(0,0,0), font=font_khmer)
d_left.text((15, 70), "និងឲ្យសិស្សមើលខ្លឹមបន្ត", fill=(0,0,0), font=font_khmer)
c_left_path = 'scratch/c_left_cell.png'
c_left.save(c_left_path)
p4.insert_image(fitz.Rect(box_x0 + 1, box_y0 + 1, 241.4 - 1, box_y1 - 1), filename=c_left_path)

# Render Middle Cell (Item 3 math clip)
p4.insert_image(fitz.Rect(244.0, box_y0 + 3.0, 244.0 + (432.0 - 244.0), box_y0 + 3.0 + (706.0 - 636.0)), filename=clip_path)

# Render Right Cell
c_right = Image.new('RGBA', (430, 220), (255, 255, 255, 255))
d_right = ImageDraw.Draw(c_right)
d_right.text((15, 28), "-ចម្លងលំហាត់បិទ", fill=(0,0,0), font=font_khmer)
c_right_path = 'scratch/c_right_cell.png'
c_right.save(c_right_path)
p4.insert_image(fitz.Rect(430.4 + 1, box_y0 + 1, box_x1 - 1, box_y1 - 1), filename=c_right_path)

# Save to temp and replace
tmp_out = 'scratch/tmp_8_1_1.pdf'
doc.save(tmp_out)
doc.close()

os.replace(tmp_out, pdf_path)
print(f'Successfully updated {pdf_path}!')

# Sync to backup copy if exists
for root, dirs, files in os.walk('.'):
    for f in files:
        if '8_1_1' in f and f.endswith('.pdf'):
            full = os.path.join(root, f)
            if os.path.abspath(full) != os.path.abspath(pdf_path):
                import shutil
                shutil.copy2(pdf_path, full)
                print(f'Synced to {full}')
