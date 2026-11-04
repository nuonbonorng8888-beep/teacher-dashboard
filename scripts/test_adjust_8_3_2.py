import pymupdf
from PIL import Image, ImageDraw, ImageFont
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('scratch', exist_ok=True)
pdf_path = 'កិច្ចការតែងការទី៨/8_3_2_មេរៀនទី៣_ទំហំសមាមាត្រនិងភាគរយ.pdf'
doc = pymupdf.open(pdf_path)

# Page 4
p4 = doc[4]
page_w, page_h = p4.rect.width, p4.rect.height

# Render page 4 to high-res image
pix = p4.get_pixmap(dpi=200)
pix.save('scratch/orig_8_3_2_p4.png')
img = Image.open('scratch/orig_8_3_2_p4.png')
w_px, h_px = img.size

# Scale factor: 200 dpi / 72 pt = 2.7777777777777777 px/pt
scale = w_px / page_w

# The content rectangle on Page 4 in points:
# x: 55.0 to 545.0
# y: 52.0 to 715.0
crop_x0 = int(55.0 * scale)
crop_x1 = int(545.0 * scale)
crop_y0 = int(52.0 * scale)
crop_y1 = int(716.0 * scale)

content_img = img.crop((crop_x0, crop_y0, crop_x1, crop_y1))

# We want the content to end at y = 633.0 pt
target_y0 = 52.0
target_y1 = 633.0
target_h_pt = target_y1 - target_y0
target_h_px = int(target_h_pt * scale)

# Resize content vertically to target_h_px
resized_content = content_img.resize((crop_x1 - crop_x0, target_h_px), Image.Resampling.LANCZOS)

# Create a clean white page image for Page 4
new_page_img = Image.new('RGB', (w_px, h_px), (255, 255, 255))
new_page_img.paste(resized_content, (crop_x0, int(target_y0 * scale)))

# Save adjusted page image
new_page_img.save('scratch/adjusted_8_3_2_p4.png')

# Now create a modified PDF with this adjusted Page 4
# Clear page 4 and insert adjusted image
p4.draw_rect(pymupdf.Rect(0, 0, page_w, page_h), color=(1, 1, 1), fill=(1, 1, 1))
p4.insert_image(pymupdf.Rect(0, 0, page_w, page_h), filename='scratch/adjusted_8_3_2_p4.png')

test_out = 'scratch/test_adjusted_8_3_2.pdf'
doc.save(test_out)
doc.close()

print(f"Saved {test_out}. Content now fits from y=52 to y=633 pt!")
print(f"Blank space available from y=635 to 808 pt (height: {808-635} pt). Signature block is 145 pt!")
