# -*- coding: utf-8 -*-
import fitz
from PIL import Image, ImageDraw, ImageFont
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Open original 8_1_1 PDF
doc = fitz.open("កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf")
p0 = doc[0]
p4 = doc[4]
pageH0 = p0.rect.height
pageH4 = p4.rect.height

# --- 1. COVER PAGE ---
# Whiteout only AFTER the colon (x >= 236.0)
p0.add_redact_annot(fitz.Rect(236.0, 78.1, 450.0, 98.1), fill=(1, 1, 1))
p0.add_redact_annot(fitz.Rect(236.0, 141.1, 550.0, 161.1), fill=(1, 1, 1))
p0.add_redact_annot(fitz.Rect(236.0, 162.1, 550.0, 182.1), fill=(1, 1, 1))
p0.apply_redactions()

# --- 2. SIGNATURE PAGE ---
min_y = 30.0
sig_w = 500.0
sig_h = 150.0
p4.add_redact_annot(fitz.Rect(65.0, min_y, 65.0 + sig_w, min_y + sig_h), fill=(1, 1, 1))
p4.apply_redactions()

# Create clean signature image via PIL using Khmer fonts
img_w, img_h = 1200, 360
sig_img = Image.new('RGB', (img_w, img_h), (255, 255, 255))
draw = ImageDraw.Draw(sig_img)

# Try to load Khmer fonts installed on Windows
font_siemreap_path = "C:/Windows/Fonts/khmer-os-siemreap.ttf"
if not fitz.os.path.exists(font_siemreap_path):
    font_siemreap_path = "C:/Windows/Fonts/KhmerOSsiemreap.ttf"
if not fitz.os.path.exists(font_siemreap_path):
    font_siemreap_path = "C:/Windows/Fonts/NaoSansKhmer-Regular.ttf"

try:
    font_date = ImageFont.truetype("C:/Windows/Fonts/KhmerOSsiemreap.ttf", 24)
    font_muol = ImageFont.truetype("C:/Windows/Fonts/KhmerOSmuollight.ttf", 26)
    font_reg = ImageFont.truetype("C:/Windows/Fonts/KhmerOSsiemreap.ttf", 22)
    font_name = ImageFont.truetype("C:/Windows/Fonts/KhmerOSsiemreap.ttf", 26)
except Exception:
    font_date = ImageFont.truetype("arial.ttf", 24)
    font_muol = font_date
    font_reg = font_date
    font_name = font_date

col_left = 220
col_mid = 600
col_right = 980

# Date
draw.text((col_right, 40), "រាជធានីភ្នំពេញ ថ្ងៃទី ២៩ ខែ តុលា ឆ្នាំ ២០២៦", fill=(0,0,0), font=font_date, anchor="ms")

# Headers
draw.text((col_left, 85), "បានឃើញ និងឯកភាព", fill=(0,0,0), font=font_muol, anchor="ms")
draw.text((col_mid, 85), "បានឃើញ និងពិនិត្យ", fill=(0,0,0), font=font_muol, anchor="ms")
draw.text((col_right, 85), "គ្រូបង្រៀន", fill=(0,0,0), font=font_muol, anchor="ms")

# Roles
draw.text((col_left, 125), "ជ.គណៈគ្រប់គ្រងសាលារៀនជំនាន់ថ្មី", fill=(0,0,0), font=font_reg, anchor="ms")
draw.text((col_mid, 125), "ប្រធានក្រុមបច្ចេកទេស", fill=(0,0,0), font=font_reg, anchor="ms")

# Teacher Name
draw.text((col_right, 300), "អ្នកគ្រូ ថោង សុភារី", fill=(0,0,0), font=font_name, anchor="ms")

sig_img.save("scratch/test_sig_table_clean.png")

# Insert into PDF
p4.insert_image(fitz.Rect(65.0, min_y, 65.0 + sig_w, min_y + sig_h), filename="scratch/test_sig_table_clean.png")

doc.save("scratch/test_g8_perfect_output.pdf")
print("Saved scratch/test_g8_perfect_output.pdf successfully!")
