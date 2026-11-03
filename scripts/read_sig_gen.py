# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

for p in ['scratch/generate_clean_sig.py', 'scratch/inspect_sig_img.py']:
    print(f"=== {p} ===")
    with open(p, 'r', encoding='utf-8') as f:
        print(f.read())
