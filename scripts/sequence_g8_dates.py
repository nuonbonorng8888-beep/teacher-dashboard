# -*- coding: utf-8 -*-
import sys, re, datetime

sys.stdout.reconfigure(encoding='utf-8')

# Khmer date helper
KH_DAYS = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍']
KH_MONTHS = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
KH_NUMS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']

def to_kh_num(num):
    return ''.join(KH_NUMS[int(d)] if d.isdigit() else d for d in str(num))

def format_khmer_date(d, include_day_name=True):
    day_name = KH_DAYS[d.isoweekday() % 7]
    d_num = to_kh_num(d.day)
    m_name = KH_MONTHS[d.month - 1]
    y_num = to_kh_num(d.year)
    if include_day_name:
        return f"ថ្ងៃ{day_name} ទី{d_num} ខែ{m_name} ឆ្នាំ{y_num}"
    return f"ថ្ងៃទី {d_num} ខែ {m_name} ឆ្នាំ {y_num}"

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Generate sequential dates starting from 2026-11-05
cur_date = datetime.date(2026, 11, 5) # Thursday

# Sequence 72 plans
new_text = text
for i in range(1, 73):
    plan_id = f"plan_g8_{i}"
    y_str = cur_date.strftime("%Y-%m-%d")
    kh_date = format_khmer_date(cur_date, True)
    
    # Replace in plan object
    # Find block for this plan
    idx = new_text.find(f'"id": "{plan_id}"')
    if idx != -1:
        next_idx = new_text.find('"id": "plan_g8_', idx + 10)
        if next_idx == -1:
            next_idx = new_text.find('];', idx)
        block = new_text[idx:next_idx]
        
        # Replace date and date_khmer inside this block
        block_new = re.sub(r'"date":\s*"[^"]*"', f'"date": "{y_str}"', block, count=1)
        block_new = re.sub(r'"date_khmer":\s*"[^"]*"', f'"date_khmer": "{kh_date}"', block_new, count=1)
        new_text = new_text[:idx] + block_new + new_text[next_idx:]
    
    # Advance cur_date by 2 days, skipping Saturday (5) & Sunday (6) in python weekday
    cur_date += datetime.timedelta(days=2)
    if cur_date.weekday() == 5: # Saturday -> Monday (+2)
        cur_date += datetime.timedelta(days=2)
    elif cur_date.weekday() == 6: # Sunday -> Monday (+1)
        cur_date += datetime.timedelta(days=1)

with open('js/lesson-plans-data.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Successfully sequenced dates for all Grade 8 lesson plans in js/lesson-plans-data.js!")

# Print first 5 plans
for i in range(1, 6):
    plan_id = f"plan_g8_{i}"
    idx = new_text.find(f'"id": "{plan_id}"')
    sub = new_text[idx:idx+450]
    d_m = re.search(r'"date":\s*"([^"]*)"', sub)
    dk_m = re.search(r'"date_khmer":\s*"([^"]*)"', sub)
    print(f"Plan {i}: {d_m.group(1) if d_m else 'N/A'} -> {dk_m.group(1) if dk_m else 'N/A'}")

