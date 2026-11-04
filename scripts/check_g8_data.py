import json, sys
sys.stdout.reconfigure(encoding='utf-8')

content = open('js/lesson-plans-data.js', encoding='utf-8').read()
raw_json = content[content.find('['):content.rfind(']')+1]
data = json.loads(raw_json)

g8 = [p for p in data if p.get('grade') in ['ថ្នាក់ទី ៨', 'ថ្នាក់ទី 8']]
print(f"Total Grade 8 plans: {len(g8)}")

# Check chapters/lessons
lessons = {}
for p in g8:
    ch = p.get('chapter')
    lessons[ch] = lessons.get(ch, 0) + 1

for l, c in lessons.items():
    print(f"  {l}: {c} plans")
