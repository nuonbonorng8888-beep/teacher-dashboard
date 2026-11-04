# -*- coding: utf-8 -*-
import sys, json, re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[.*?\]);', text, re.DOTALL)
data = json.loads(m.group(1))

# Check sample plan 1 and plan 6
print("Plan 1 (8_1_1):")
print(json.dumps(data[37], ensure_ascii=False, indent=2))
print("\nPlan 6 (8_3_2):")
print(json.dumps(data[42], ensure_ascii=False, indent=2))

