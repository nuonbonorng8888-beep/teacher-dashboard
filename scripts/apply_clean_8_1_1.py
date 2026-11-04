import pymupdf
from PIL import Image, ImageDraw, ImageFont
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf'
doc = pymupdf.open(pdf_path)

p3 = doc[3] # Page 3 (renders as page 4)
p4 = doc[4] # Page 4 (renders as page 5)

# 1. On Page 3: Whiteout item 3 area below y = 637.0
# Clear item 3 completely
p3.draw_rect(pymupdf.Rect(25.0, 637.0, 585.0, 720.0), color=(1,1,1), fill=(1,1,1))
# Close bottom border of table
p3.draw_line(pymupdf.Point(70.6, 637.0), pymupdf.Point(574.9, 637.0), color=(0,0,0), width=0.8)

# 2. On Page 4: Whiteout EVERYTHING from y=20.0 to 380.0 across the full page width
p4.draw_rect(pymupdf.Rect(25.0, 20.0, 585.0, 380.0), color=(1,1,1), fill=(1,1,1))

# Box coordinates for Item 3 continuation
box_x0 = 70.6
box_x1 = 574.9
box_y0 = 55.0
box_y1 = 135.0

# Draw table outline & dividers
p4.draw_rect(pymupdf.Rect(box_x0, box_y0, box_x1, box_y1), color=(0,0,0), width=0.8)
p4.draw_line(pymupdf.Point(241.4, box_y0), pymupdf.Point(241.4, box_y1), color=(0,0,0), width=0.8)
p4.draw_line(pymupdf.Point(430.4, box_y0), pymupdf.Point(430.4, box_y1), color=(0,0,0), width=0.8)

font_khmer = ImageFont.truetype('C:/Windows/Fonts/KhmerOSsiemreap.ttf', 24)

# Render Left Cell
c_left = Image.new('RGB', (500, 220), (255, 255, 255))
d_left = ImageDraw.Draw(c_left)
d_left.text((15, 28), "-កត់លំហាត់លើក្តារខៀន", fill=(0,0,0), font=font_khmer)
d_left.text((15, 75), "និងឲ្យសិស្សមើលខ្លឹមបន្ត", fill=(0,0,0), font=font_khmer)
c_left.save('scratch/c_left_cell.png')
p4.insert_image(pymupdf.Rect(box_x0 + 1, box_y0 + 1, 241.4 - 1, box_y1 - 1), filename='scratch/c_left_cell.png')

# Render Middle Cell (Item 3 math text & fractions)
# Let's render crisp Item 3 text
c_mid = Image.new('RGB', (600, 250), (255, 255, 255))
d_mid = ImageDraw.Draw(c_mid)
font_mid = ImageFont.truetype('C:/Windows/Fonts/KhmerOSsiemreap.ttf', 22)
d_mid.text((10, 15), "3. ចូររៀបចំនួនសនិទានខាងក្រោមតាមលំដាប់កើនឡើង៖", fill=(0,0,0), font=font_mid)
d_mid.text((10, 60), "ក.  3/4 , 4/5 , 7/8 , 0.75", fill=(0,0,0), font=font_mid)
d_mid.text((10, 105), "ខ.  3/4 , 5/6 , 11/12 , 8/9", fill=(0,0,0), font=font_mid)
c_mid.save('scratch/c_mid_cell.png')
p4.insert_image(pymupdf.Rect(241.4 + 1, box_y0 + 1, 430.4 - 1, box_y1 - 1), filename='scratch/c_mid_cell.png')

# Render Right Cell
c_right = Image.new('RGB', (430, 220), (255, 255, 255))
d_right = ImageDraw.Draw(c_right)
d_right.text((15, 45), "-ចម្លងលំហាត់ទុក", fill=(0,0,0), font=font_khmer)
c_right.save('scratch/c_right_cell.png')
p4.insert_image(pymupdf.Rect(430.4 + 1, box_y0 + 1, box_x1 - 1, box_y1 - 1), filename='scratch/c_right_cell.png')

# Save updated 8_1_1 PDF
out_8_1_1 = 'scratch/clean_baked_8_1_1.pdf'
doc.save(out_8_1_1)
doc.close()

# Replace original
import shutil
shutil.copy2(out_8_1_1, pdf_path)
print(f"Successfully baked clean Item 3 on Page 4 of {pdf_path}!")

# Render test pixmap
vdoc = pymupdf.open(pdf_path)
vdoc[3].get_pixmap(dpi=150).save('C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/verified_8_1_1_p3.png')
vdoc[4].get_pixmap(dpi=150).save('C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/verified_8_1_1_p4.png')
print("Rendered verified_8_1_1_p3.png and verified_8_1_1_p4.png")
