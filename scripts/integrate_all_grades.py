# scripts/integrate_all_grades.py
import fitz, json, os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

# 1. Load existing Grade 8 plans from js/lesson-plans-data.js
current_data_text = open('js/lesson-plans-data.js', encoding='utf-8').read()
raw_json = current_data_text[current_data_text.find('['):current_data_text.rfind(']')+1]
all_existing = json.loads(raw_json)

g8_plans = [p for p in all_existing if p.get('grade') in ['ថ្នាក់ទី ៨', 'ថ្នាក់ទី 8']]
print(f"Extracted Grade 8 plans: {len(g8_plans)}")

# 2. Build Grade 11 plans (10 plans)
g11_meta = json.load(open('scripts/g11_sliced_metadata.json', encoding='utf-8'))
g11_plans = []

for idx, m in enumerate(g11_meta):
    # Read text from cover page of sliced file
    doc = fitz.open(m['pdf_file'])
    t0 = doc[0].get_text()
    
    # Extract Objectives
    k_match = re.search(r'វិជ្ជាសម្?បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    s_match = re.search(r'បំណិនសម្?បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    a_match = re.search(r'[ចឆ]រិយាសម្?បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    
    knowledge = [k_match.group(1).strip()] if k_match and k_match.group(1).strip() else [f"កំណត់ និងយល់ច្បាស់ពីសញ្ញាណ និងរូបមន្ត {m['les_title']} (ម៉ោងទី {m['hour']})។"]
    skills = [s_match.group(1).strip()] if s_match and s_match.group(1).strip() else [f"ចេះអនុវត្តដោះស្រាយលំហាត់ និងអនុវត្តរូបមន្តគណនា {m['les_title']} បានត្រឹមត្រូវ។"]
    attitude = a_match.group(1).strip() if a_match and a_match.group(1).strip() else "បណ្តុះស្មារតីស្រឡាញ់មុខវិជ្ជាគណិតវិទ្យា ការគិតស៊ីជម្រៅ និងការធ្វើការជាក្រុម។"

    # Extract Content points
    c_match = re.search(r'២\.\s*ខ្លឹមសារ\s*[:៖]?\s*([^\n\r]+)', t0)
    c_point = c_match.group(1).strip() if c_match else f"{m['les_title']} - ម៉ោងទី {m['hour']}"
    
    plan_obj = {
        "id": f"plan_g11_{m['ch_code'].split('_')[-1].replace('l','')}_{m['hour']}",
        "num": len(g8_plans) + idx + 1,
        "ch_lesson_num": m['hour'],
        "chapter": m['les_title'],
        "chapter_code": f"g11_l{m['ch_code'].split('_')[-1].replace('l','')}",
        "grade": "ថ្នាក់ទី ១១",
        "class_name": "11NGS_P1 & 11NGS_C2",
        "lesson_title": m['les_title'],
        "topic": f"{m['les_title']} (ម៉ោងទី {m['hour']})",
        "duration": "៩០ នាទី",
        "date": "2026-10-19",
        "date_khmer": "ថ្ងៃចន្ទ ទី១៩ ខែតុលា ឆ្នាំ២០២៦",
        "teacher": "នួន បូណង",
        "school": "វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)",
        "score": 50,
        "status": "បានផ្ទៀងផ្ទាត់",
        "pdf_file": m['pdf_file'],
        "page_count": m['page_count'],
        "cover_page_index": 0,
        "class_x": 215.0,
        "class_y0": 196.7,
        "teacher_x": 215.0,
        "teacher_y0": 218.4,
        "date_x": 215.0,
        "box_y0": 240.1,
        "objectives": {
            "knowledge": knowledge,
            "skills": skills,
            "attitude": attitude
        },
        "content_points": [c_point],
        "materials": {
            "teacher": "សៀវភៅសិក្សាគោលគណិតវិទ្យាថ្នាក់ទី១១, GeoGebra, ស្លាយបង្រៀន, បន្ទាត់",
            "student": "សៀវភៅពុម្ព, សៀវភៅសរសេរ, ម៉ាស៊ីនគិតលេខ Scientific, ប៊ិច"
        },
        "methods": "វិធីសាស្ត្របង្រៀន 5E (Engage, Explore, Explain, Elaborate, Evaluate) និងការដោះស្រាយបញ្ហា PISA",
        "steps": {
            "step1": "រដ្ឋបាលថ្នាក់ (៣-៥ នាទី)៖ ពិនិត្យវត្តមាន អនាម័យ និងត្រួតពិនិត្យឯកសណ្ឋានសិស្ស។",
            "step2": "រំឭកមេរៀនចាស់ (៧-១០ នាទី)៖ សួរសំណួរគន្លឹះ និងដោះស្រាយលំហាត់រំឭកចំណេះដឹងពីម៉ោងមុន។",
            "step3": "មេរៀនថ្មី (៥៥-៦០ នាទី)៖ ដំណើរការតាមវិធីសាស្ត្រ 5E បង្រៀនទ្រឹស្តី គំរូលំហាត់ PISA និងសកម្មភាពក្រុម។",
            "step4": "ពង្រឹងចំណេះដឹង (១០ នាទី)៖ សង្ខេបចំណុចសំខាន់ៗ និងឱ្យសិស្សឆ្លើយសំណួរផ្ទៀងផ្ទាត់ការយល់ដឹង។",
            "step5": "បណ្តាំផ្ញើ & កិច្ចការផ្ទះ (៣-៥ នាទី)៖ ដាក់កិច្ចការផ្ទះ ណែនាំរំឭកមេរៀន និងស្វ័យសិក្សា។"
        }
    }
    g11_plans.append(plan_obj)

print(f"Built Grade 11 plans: {len(g11_plans)}")

# 3. Build Grade 12 plans (113 plans)
g12_meta = json.load(open('scripts/g12_sliced_metadata.json', encoding='utf-8'))
g12_plans = []

for idx, m in enumerate(g12_meta):
    doc = fitz.open(m['pdf_file'])
    t0 = doc[0].get_text()
    
    # Extract Objectives
    k_match = re.search(r'វិជ្ជាសម្?បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    s_match = re.search(r'បំណិនសម្?បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    a_match = re.search(r'[ចឆ]រិយាសម្?បទា\s*[:៖]?\s*([^\n\r•▪]+)', t0)
    
    knowledge = [k_match.group(1).strip()] if k_match and k_match.group(1).strip() else [f"កំណត់ និងយល់ច្បាស់ពីទ្រឹស្តី និងរូបមន្ត {m['chapter']} ({m['lesson_title']})។"]
    skills = [s_match.group(1).strip()] if s_match and s_match.group(1).strip() else [f"ចេះអនុវត្តដោះស្រាយលំហាត់ និងគណនា {m['topic']} បានត្រឹមត្រូវ។"]
    attitude = a_match.group(1).strip() if a_match and a_match.group(1).strip() else "បណ្តុះស្មារតីចង់ដឹងចង់ឃើញ ភាពហ្មត់ចត់ និងការត្រៀមប្រឡងបាក់ឌុប។"

    plan_obj = {
        "id": f"plan_g12_{m['ch_num']}_{m['ch_plan_counter']}",
        "num": len(g8_plans) + len(g11_plans) + idx + 1,
        "ch_lesson_num": m['ch_plan_counter'],
        "chapter": m['chapter'],
        "chapter_code": f"g12_c{m['ch_num']}",
        "grade": "ថ្នាក់ទី ១២",
        "class_name": "១២A & ១២B",
        "lesson_title": m['lesson_title'],
        "topic": m['topic'] if m['topic'] else f"{m['lesson_title']} (ម៉ោងទី {m['ch_plan_counter']})",
        "duration": m['duration'] if m['duration'] else "៤៥ នាទី",
        "date": "2026-10-19",
        "date_khmer": "ថ្ងៃចន្ទ ទី១៩ ខែតុលា ឆ្នាំ២០២៦",
        "teacher": "នួន បូណង",
        "school": "វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)",
        "score": 50,
        "status": "បានផ្ទៀងផ្ទាត់",
        "pdf_file": m['pdf_file'],
        "page_count": m['page_count'],
        "cover_page_index": 0,
        "class_x": 238.0,
        "class_y0": 99.2,
        "date_x": 238.0,
        "box_y0": 172.3,
        "teacher_x": 238.0,
        "teacher_y0": 190.5,
        "objectives": {
            "knowledge": knowledge,
            "skills": skills,
            "attitude": attitude
        },
        "content_points": [m['topic'] if m['topic'] else m['lesson_title']],
        "materials": {
            "teacher": "សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២ (NGS), GeoGebra, ស្លាយបង្រៀន, បន្ទាត់",
            "student": "សៀវភៅពុម្ពគណិតវិទ្យាថ្នាក់ទី១២, សៀវភៅសរសេរ, ម៉ាស៊ីនគិតលេខ Casio/Scientific, ប៊ិច"
        },
        "methods": "វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល (5E), អនុវត្តលំហាត់ប្រឡងបាក់ឌុប និង Think-Pair-Share",
        "steps": {
            "step1": "រដ្ឋបាលថ្នាក់ (៣ នាទី)៖ ពិនិត្យវត្តមាន អនាម័យ និងត្រួតពិនិត្យឯកសណ្ឋានសិស្ស។",
            "step2": "រំឭកមេរៀនចាស់ (៧ នាទី)៖ សួរសំណួរគន្លឹះ និងដោះស្រាយលំហាត់រំឭកចំណេះដឹងពីម៉ោងមុន។",
            "step3": "មេរៀនថ្មី (២៥ នាទី)៖ ពន្យល់ទ្រឹស្តី ផ្តល់ឧទាហរណ៍ជាក់ស្តែង និងលំហាត់គំរូបាក់ឌុប។",
            "step4": "ពង្រឹងចំណេះដឹង (៨ នាទី)៖ ឱ្យសិស្សអនុវត្តលំហាត់ជាក្រុម និងបំពេញសន្លឹកកិច្ចការ។",
            "step5": "បណ្តាំផ្ញើ & កិច្ចការផ្ទះ (២ នាទី)៖ ដាក់កិច្ចការផ្ទះ ណែនាំរំឭកមេរៀន និងស្វ័យសិក្សា។"
        }
    }
    g12_plans.append(plan_obj)

print(f"Built Grade 12 plans: {len(g12_plans)}")

total_plans = g8_plans + g11_plans + g12_plans
print(f"Total unified plans: {len(total_plans)} (G8: {len(g8_plans)}, G11: {len(g11_plans)}, G12: {len(g12_plans)})")

# Renumber sequentially
for idx, p in enumerate(total_plans):
    p['num'] = idx + 1

# Write to js/lesson-plans-data.js
output_js = "// NGS High School Lesson Plans Data (Grades 8, 11, and 12)\n"
output_js += "// Auto-generated master dataset for Preah Yukunthor High School (NGS)\n"
output_js += "window.NGS_LESSON_PLANS_DATA = "
output_js += json.dumps(total_plans, indent=2, ensure_ascii=False)
output_js += ";\n"

with open('js/lesson-plans-data.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print("Successfully wrote js/lesson-plans-data.js!")

