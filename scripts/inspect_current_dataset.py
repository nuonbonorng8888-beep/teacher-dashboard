# scripts/inspect_current_dataset.py
import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Match the JS array: window.NGS_LESSON_PLANS_DATA = [ ... ];
m = re.search(r'window\.NGS_LESSON_PLANS_DATA\s*=\s*(\[[\s\S]*?\]);\s*$', text.strip())
if not m:
    # Try finding first [ and last ]
    start = text.find('[')
    end = text.rfind(']')
    json_str = text[start:end+1]
else:
    json_str = m.group(1)

data = json.loads(json_str)
print(f"Total plans in dataset: {len(data)}")

grades = {}
for p in data:
    g = p.get('grade')
    ch = p.get('chapter', p.get('chapter_code'))
    if g not in grades:
        grades[g] = {}
    if ch not in grades[g]:
        grades[g][ch] = 0
    grades[g][ch] += 1

for g, chs in grades.items():
    total_g = sum(chs.values())
    print(f"\nGrade: {g} (Total: {total_g} plans)")
    for ch, count in chs.items():
        print(f"  - {ch}: {count} plans")
