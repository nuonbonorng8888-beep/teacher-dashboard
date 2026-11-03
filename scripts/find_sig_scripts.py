# -*- coding: utf-8 -*-
import os, sys

sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.py'):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8') as fl:
                    content = fl.read()
                    if 'test_perfect_sig' in content or 'sig_y0' in content or 'sig_page_index' in content:
                        print(f"Found match in {p}")
            except Exception:
                pass
