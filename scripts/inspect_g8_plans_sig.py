# -*- coding: utf-8 -*-
import sys
import os
import fitz
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find every Grade 8 plan and check its PDF
pattern = r'\{\s*"id":\s*"(plan_g8_\d+)"[^}]+?"pdf_file":\s*"([^"]+)"'
matches = list(re.finditer(pattern, text, re.DOTALL))
print(f"Total Grade 8 plan matches: {len(matches)}")

updates = {}
for m in matches:
    plan_id = m.group(1)
    pdf_path = m.group(2)
    if os.path.exists(pdf_path):
        doc = fitz.open(pdf_path)
        total = len(doc)
        sig_pno = None
        for pno in range(total):
            txt = doc[pno].get_text()
            if any(k in txt for k in ['ព.ស', 'រាជធ្ននី', 'រាជធានី', 'ឯកភាេ', 'េិនិែយ']):
                sig_pno = pno
                break
        if sig_pno is None:
            # fallback to total - 2 or total - 1
            sig_pno = max(0, total - 2) if total > 1 else 0
        updates[plan_id] = (sig_pno, total)

print(f"Updates mapped for {len(updates)} plans.")
print("Sample 5:", list(updates.items())[:5])

