import pymupdf
import sys
import os
import shutil

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf'
doc = pymupdf.open(pdf_path)

p3 = doc[3] # Page 4 in print
p4 = doc[4] # Page 5 in print

# 1. On Page 3: Whiteout item 3 area below y = 637.0 and draw clean bottom line
p3.draw_rect(pymupdf.Rect(25.0, 637.0, 585.0, 720.0), color=(1,1,1), fill=(1,1,1))
p3.draw_line(pymupdf.Point(70.6, 637.0), pymupdf.Point(574.9, 637.0), color=(0,0,0), width=0.8)

# 2. On Page 4: Whiteout from y=20.0 to 380.0 across full width x=25..585
p4.draw_rect(pymupdf.Rect(25.0, 20.0, 585.0, 380.0), color=(1,1,1), fill=(1,1,1))

# Insert perfect browser-rendered Item 3 table image
box_x0 = 70.6
box_x1 = 574.9
box_y0 = 55.0
box_y1 = 135.0
p4.insert_image(pymupdf.Rect(box_x0, box_y0, box_x1, box_y1), filename='scratch/perfect_item3_table.png')

# Save updated 8_1_1 PDF
out_8_1_1 = 'scratch/clean_baked_8_1_1.pdf'
doc.save(out_8_1_1)
doc.close()

shutil.copy2(out_8_1_1, pdf_path)
print(f"Successfully baked perfect Item 3 table into {pdf_path}!")

# Render preview of page 4
vdoc = pymupdf.open(pdf_path)
pix = vdoc[4].get_pixmap(dpi=150)
artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pix.save(os.path.join(artifacts_dir, "preview_fixed_item3_p5.png"))
print("Rendered preview_fixed_item3_p5.png")

