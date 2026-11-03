# -*- coding: utf-8 -*-
import fitz
from PIL import Image, ImageDraw, ImageFont
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Open original 8_1_1 PDF
doc = fitz.open("កិច្ចការតែងការទី៨/8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf")
p0 = doc[0]
p4 = doc[4]

# --- 1. TEST COVER PAGE (Page 0) ---
# Whiteout only AFTER the colon (x >= 236.0)
pageH0 = p0.rect.height
# Class: y0 = 78.1
p0.add_redact_annot(fitz.Rect(236.0, 78.1, 450.0, 98.1), fill=(1, 1, 1))
# Date: y0 = 141.1
p0.add_redact_annot(fitz.Rect(236.0, 141.1, 550.0, 161.1), fill=(1, 1, 1))
# Teacher: y0 = 162.1
p0.add_redact_annot(fitz.Rect(236.0, 162.1, 550.0, 182.1), fill=(1, 1, 1))
p0.apply_redactions()

# Insert clean text starting after colon without extra ":"
# In PyMuPDF or Canvas:
# We will verify how Canvas renders it

# --- 2. TEST SIGNATURE PAGE (Page 4) ---
pageH4 = p4.rect.height
min_y = 30.0
max_y = 180.0
sig_h = max_y - min_y

# Redact entire signature area
p4.add_redact_annot(fitz.Rect(65.0, min_y, 565.0, max_y), fill=(1, 1, 1))
p4.apply_redactions()

# Save modified PDF to check whiteout cleanliness
doc.save("scratch/test_clean_whiteout_g8.pdf")
print("Saved scratch/test_clean_whiteout_g8.pdf")
