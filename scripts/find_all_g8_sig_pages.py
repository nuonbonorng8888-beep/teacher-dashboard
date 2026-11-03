# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

g8_dir = 'កិច្ចការតែងការទី៨'
files = [f for f in os.listdir(g8_dir) if f.endswith('.pdf')]
files.sort()

sig_map = {}
for f in files:
    doc = fitz.open(os.path.join(g8_dir, f))
    sig_pno = None
    for pno in range(len(doc)):
        txt = doc[pno].get_text()
        if any(k in txt for k in ['ព.ស', 'រាជធ្ននី', 'រាជធានី', 'ឯកភាេ', 'េិនិែយ']):
            sig_pno = pno
            break
    sig_map[f] = (len(doc), sig_pno)

print(f"Total checked: {len(sig_map)}")
print("Sample 10 files (total_pages, sig_page_idx):")
for f, (tot, sig) in list(sig_map.items())[:10]:
    print(f"  {f}: total={tot}, sig_page={sig}")

missing_sig = [f for f, (tot, sig) in sig_map.items() if sig is None]
print(f"Files without signature block found: {len(missing_sig)}")
if missing_sig:
    print("Missing:", missing_sig)
