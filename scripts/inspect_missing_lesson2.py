# -*- coding: utf-8 -*-
import sys, re, json, os

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse JSON inside window.NGS_LESSON_PLANS_DATA = [ ... ];
m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[.*?\]);', text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    g8_plans = [p for p in data if p.get('grade') == 'ថ្នាក់ទី ៨']
    print(f"Total Grade 8 plans: {len(g8_plans)}")
    
    chapters = []
    for p in g8_plans:
        ch = p.get('chapter')
        code = p.get('chapter_code')
        if (ch, code) not in chapters:
            chapters.append((ch, code))
    
    print("Grade 8 chapters:")
    for ch, code in chapters:
        count = sum(1 for p in g8_plans if p.get('chapter_code') == code)
        print(f"  {code}: {ch} ({count} plans)")
else:
    print("Could not parse data")

