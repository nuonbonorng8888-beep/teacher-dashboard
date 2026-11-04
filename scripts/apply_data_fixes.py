import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Update js/lesson-plans-data.js
with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace plan_g8_6 sig_y0
text = re.sub(
    r'("id":\s*"plan_g8_6".*?"sig_y0":\s*)50\.0',
    r'\g<1>640.0',
    text,
    flags=re.DOTALL
)

# Replace plan_g8_35 sig_y0
text = re.sub(
    r'("id":\s*"plan_g8_35".*?"sig_y0":\s*)50\.0',
    r'\g<1>215.0',
    text,
    flags=re.DOTALL
)

with open('js/lesson-plans-data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated js/lesson-plans-data.js successfully!")

# Verify changes in js/lesson-plans-data.js
start = text.find('[')
end = text.rfind(']') + 1
data = json.loads(text[start:end])

p6 = next(d for d in data if d['id'] == 'plan_g8_6')
p35 = next(d for d in data if d['id'] == 'plan_g8_35')
print(f"plan_g8_6 sig_page_index={p6['sig_page_index']}, sig_y0={p6['sig_y0']}")
print(f"plan_g8_35 sig_page_index={p35['sig_page_index']}, sig_y0={p35['sig_y0']}")

