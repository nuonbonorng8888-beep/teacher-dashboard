# -*- coding: utf-8 -*-
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'\{\s*"id":\s*"plan_g8_1".*?"sig_date_khmer":\s*"[^"]+"\s*\}', text, re.DOTALL)
if m:
    print(m.group(0))

