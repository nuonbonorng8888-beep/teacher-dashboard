# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')

p3 = doc[3]
p4 = doc[4]

# 1. Capture the visual clip of Item 3 from Page 3
# Bounding box of item 3: x from 240 to 435, y from 636 to 706
item3_rect = fitz.Rect(244, 636, 432, 706)
pix_item3 = p3.get_pixmap(clip=item3_rect, dpi=300)
pix_item3.save('scratch/item3_clip.png')

# 2. On Page 3: Whiteout item 3 area (y >= 637 to 706)
# Left border is at 70.6, Right border is at 574.9
p3.draw_rect(fitz.Rect(70.0, 637.0, 575.5, 710.0), color=(1,1,1), fill=(1,1,1))
# Draw bottom border of table on Page 3 at y=637
p3.draw_line(fitz.Point(70.6, 637.0), fitz.Point(574.9, 637.0), color=(0,0,0), width=0.5)

# 3. On Page 4:
# Whiteout old signature text at top (y from 40 to 180)
p4.draw_rect(fitz.Rect(60, 40, 560, 200), color=(1,1,1), fill=(1,1,1))

# Draw a continuation box for Step 5 / Item 3 at top of Page 4 (y from 55 to 135)
box_x0 = 70.6
box_x1 = 574.9
box_y0 = 55.0
box_y1 = 132.0

# Draw table outline
p4.draw_rect(fitz.Rect(box_x0, box_y0, box_x1, box_y1), color=(0,0,0), width=0.5)
# Draw column divider (at x=241.4, same as table on p3)
p4.draw_line(fitz.Point(241.4, box_y0), fitz.Point(241.4, box_y1), color=(0,0,0), width=0.5)
# Draw second column divider (at x=430.4)
p4.draw_line(fitz.Point(430.4, box_y0), fitz.Point(430.4, box_y1), color=(0,0,0), width=0.5)

# Insert item 3 image into middle cell
# Item 3 clip is inserted at (x=244, y=58, width=188, height=70)
p4.insert_image(fitz.Rect(244, box_y0 + 3, 244 + (432-244), box_y0 + 3 + (706-636)), filename='scratch/item3_clip.png')

# In left cell: insert text
p4.insert_text(fitz.Point(box_x0 + 8, box_y0 + 25), "ជំហានទី៥ (ត)", fontsize=11, fontname="helv", color=(0,0,0))
p4.insert_text(fitz.Point(box_x0 + 8, box_y0 + 45), "-កត់លំហាត់លើក្តារខៀន", fontsize=9, fontname="helv", color=(0,0,0))

# In right cell: insert text
p4.insert_text(fitz.Point(438, box_y0 + 25), "-ចម្លងលំហាត់បិទ", fontsize=9, fontname="helv", color=(0,0,0))

# 4. Save and inspect
doc.save('scratch/test_item3_moved.pdf')
print('Successfully created scratch/test_item3_moved.pdf!')

# Render page 3 and 4 to see results
doc[3].get_pixmap(dpi=150).save('scratch/preview_p3_moved.png')
doc[4].get_pixmap(dpi=150).save('scratch/preview_p4_moved.png')
print('Rendered scratch/preview_p3_moved.png and scratch/preview_p4_moved.png')

