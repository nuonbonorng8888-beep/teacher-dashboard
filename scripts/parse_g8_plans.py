import os, sys, re, json, zipfile, xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

dst = 'កិច្ចការតែងការទី៨'
files = os.listdir(dst)
docx_files = [f for f in files if f.endswith('.docx')]

pattern = re.compile(r'^8_(\d+)_(\d+)_(.+)\.docx$')

def to_khmer_num(num):
    kh_digits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
    return ''.join([kh_digits[int(d)] if d.isdigit() else d for d in str(num)])

# Chapter names dictionary
chapter_titles = {
    1: 'មេរៀនទី ១ ៖ ចំនួនសនិទាន',
    3: 'មេរៀនទី ៣ ៖ ទំហំសមាមាត្រនិងភាគរយ',
    4: 'មេរៀនទី ៤ ៖ រង្វាស់រង្វាល់',
    5: 'មេរៀនទី ៥ ៖ កន្សោមពីជគណិត',
    6: 'មេរៀនទី ៦ ៖ កន្សោមសនិទាន',
    7: 'មេរៀនទី ៧ ៖ សមីការដឺក្រេទី១មានមួយអញ្ញាត',
    8: 'មេរៀនទី ៨ ៖ វិសមីការដឺក្រេទី១មានមួយអញ្ញាត',
    9: 'មេរៀនទី ៩ ៖ ប្លង់កូអរដោនេនិងក្រាប',
    10: 'មេរៀនទី ១០ ៖ ស្ថិតិ',
    11: 'មេរៀនទី ១១ ៖ ប្រូបាប',
    12: 'មេរៀនទី ១២ ៖ ការប្រៀបធៀបត្រីកោណ',
    13: 'មេរៀនទី ១៣ ៖ ចតុកោណ',
    14: 'មេរៀនទី ១៤ ៖ ទ្រឹស្ដីបទពីតាគ័រ',
    15: 'មេរៀនទី ១៥ ៖ ផ្ទៃក្រឡាពហុកោណ',
    16: 'មេរៀនទី ១៦ ៖ រង្វង់',
    17: 'មេរៀនទី ១៧ ៖ បន្ទាត់និងអង្កត់ពិសេសជួបគ្នាក្នុងត្រីកោណ',
    18: 'មេរៀនទី ១៨ ៖ រូបធរណីមាត្រដែលមានវិមាត្របី',
    19: 'មេរៀនទី ១៩ ៖ មាត្រដ្ឋាន'
}

def clean_text(t):
    return ' '.join(t.replace('\xa0', ' ').replace('\u200b', '').split())

def parse_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            paras = []
            for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                p_text = ''.join([t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text])
                c = clean_text(p_text)
                if c:
                    paras.append(c)
                if len(paras) > 60:
                    break
            
            # Find lesson title and duration
            lesson_title = ''
            duration = '៨៥ នាទី'
            
            for p in paras[:20]:
                if 'មេរៀនទី' in p:
                    lesson_title = p.split('មេរៀនទី')[-1].strip(' ៖:0123456789០១២៣៤៥៦៧៨៩_\t\n')
                if 'រយៈពេល' in p or 'ម៉ោង' in p:
                    for d in ['៨៥នាទី', '៨៥ នាទី', '៤៥នាទី', '៤៥ នាទី', '៩០នាទី', '៩០ នាទី']:
                        if d in p:
                            duration = d
                            break

            # Objectives
            know = []
            skills = []
            attitude = ''
            for p in paras[:35]:
                if 'វិជ្ជាសម្បទា' in p:
                    val = p.split('វិជ្ជាសម្បទា')[-1].strip(' ៖:\t\n')
                    if val and val not in know: know.append(val)
                elif 'បំណិនសម្បទា' in p:
                    val = p.split('បំណិនសម្បទា')[-1].strip(' ៖:\t\n')
                    if val and val not in skills: skills.append(val)
                elif 'ចរិយាសម្បទា' in p:
                    attitude = p.split('ចរិយាសម្បទា')[-1].strip(' ៖:\t\n')

            # Content points
            content_points = []
            in_content = False
            for p in paras[:45]:
                if '២. ខ្លឹមសារមេរៀន' in p or ('ខ្លឹមសារមេរៀន' in p and 'សកម្មភាព' not in p):
                    in_content = True
                    val = p.split('ខ្លឹមសារមេរៀន')[-1].strip(' ៖:\t\n')
                    if val: content_points.append(val)
                elif in_content:
                    if any(stop_kw in p for stop_kw in ['៣.', 'សម្ភារ', 'វិធីសាស្រ្ត', '៥. ដំណើរការ']):
                        in_content = False
                    elif p.strip() and len(p.strip()) > 2:
                        content_points.append(p.strip())
            
            topic = ' · '.join(content_points[:3]) if content_points else ''
            
            # Materials
            materials = {
                'teacher': 'សៀវភៅសិក្សាគោល, បណ្ណបង្ហាញ, AI Gemini, Google, ស្លាយបង្រៀន',
                'student': 'សៀវភៅពុម្ព, សៀវភៅកត់ត្រា, ប៊ិច, បន្ទាត់'
            }
            for p in paras[:40]:
                if 'សម្ភារ' in p:
                    val = p.split('សម្ភារៈឧបទេស')[-1].split('សម្ភារឧបទេស')[-1].strip(' ៖:\t\n')
                    if val and len(val) > 4:
                        materials['teacher'] = val

            # Teaching steps
            steps = {
                'step1': 'រដ្ឋបាលថ្នាក់ (៣ នាទី)៖ ពិនិត្យវត្តមាន អនាម័យ និងសណ្តាប់ធ្នាប់ក្នុងថ្នាក់។',
                'step2': 'រំលឹកមេរៀនចាស់ (៧ នាទី)៖ សួរសំណួរគន្លឹះ និងដោះស្រាយលំហាត់រំលឹកពីម៉ោងមុន។',
                'step3': 'មេរៀនថ្មី (៦៥ នាទី)៖ ដំណើរការតាមវិធីសាស្ត្រ 5E (Engage, Explore, Explain, Elaborate, Evaluate)។',
                'step4': 'ពង្រឹងពុទ្ធិ (៧ នាទី)៖ សង្ខេបចំណុចសំខាន់ៗ និងឲ្យសិស្សឆ្លើយសំណួរបញ្ជាក់ការយល់ដឹង។',
                'step5': 'កិច្ចការផ្ទះ & បណ្តាំផ្ញើ (៣ នាទី)៖ ដាក់កិច្ចការផ្ទះ ណែនាំរំលឹកមេរៀន និងស្វ័យសិក្សា។'
            }

            return {
                'lesson_title': lesson_title,
                'topic': topic,
                'duration': duration,
                'knowledge': know,
                'skills': skills,
                'attitude': attitude,
                'content_points': content_points,
                'materials': materials,
                'steps': steps
            }
    except Exception as e:
        print(f"Error parsing {docx_path}: {e}")
        return None

matched_files = []
for f in docx_files:
    m = pattern.match(f)
    if m:
        ch_num = int(m.group(1))
        lesson_num = int(m.group(2))
        rest = m.group(3)
        pdf_name = f.replace('.docx', '.pdf')
        has_pdf = os.path.exists(os.path.join(dst, pdf_name))
        matched_files.append((ch_num, lesson_num, rest, f, pdf_name if has_pdf else f))

matched_files.sort(key=lambda x: (x[0], x[1]))

all_plans = []
plan_counter = 1

for ch_num, lesson_num, rest, docx_f, pdf_f in matched_files:
    fpath = os.path.join(dst, docx_f)
    meta = parse_docx(fpath) or {}
    
    # Clean rest to get good fallback title
    title_from_rest = rest
    if 'មេរៀនទី' in title_from_rest:
        parts = title_from_rest.split('_')
        title_from_rest = parts[-1] if len(parts) > 1 else title_from_rest
    
    ltitle = meta.get('lesson_title') or title_from_rest
    topic = meta.get('topic') or ltitle
    ch_full_title = chapter_titles.get(ch_num, f'មេរៀនទី {to_khmer_num(ch_num)}')
    
    know = meta.get('knowledge', [])
    skills = meta.get('skills', [])
    attitude = meta.get('attitude', '')
    if not attitude:
        attitude = 'មានទម្លាប់ក្នុងការសិក្សាជាក្រុម ចូលរួមពិភាក្សា និងចែករំលែកចំណេះដឹងរវាងមិត្តរួមថ្នាក់។'
    if not know:
        know = [f'យល់ច្បាស់ពីនិយមន័យ និងទ្រឹស្តីបទនៃ{ltitle} តាមរយៈការពន្យល់ និងការអនុវត្តជាក់ស្តែង។']
    if not skills:
        skills = [f'ចេះដោះស្រាយលំហាត់ និងអនុវត្តរូបមន្តនៃ{ltitle} បានត្រឹមត្រូវ និងរហ័សរហួន។']
        
    cpoints = meta.get('content_points', [])
    if not cpoints:
        cpoints = [topic]

    plan_obj = {
        'id': f'plan_g8_{plan_counter}',
        'num': plan_counter,
        'ch_lesson_num': lesson_num,
        'chapter': ch_full_title,
        'chapter_code': f'g8_l{ch_num}',
        'grade': 'ថ្នាក់ទី ៨',
        'class_name': '8NGS_C1',
        'lesson_title': ltitle,
        'topic': topic,
        'duration': meta.get('duration', '៨៥ នាទី'),
        'date': '2026-11-05',
        'date_khmer': 'ថ្ងៃព្រហស្បតិ៍ ទី៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
        'teacher': 'នួន បូណង',
        'school': 'វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)',
        'score': 50,
        'status': 'បានផ្ទៀងផ្ទាត់',
        'pdf_file': f'កិច្ចការតែងការទី៨/{pdf_f}',
        'docx_file': f'កិច្ចការតែងការទី៨/{docx_f}',
        'drive_url': 'https://drive.google.com/',
        'objectives': {
            'knowledge': know,
            'skills': skills,
            'attitude': attitude
        },
        'content_points': cpoints,
        'materials': meta.get('materials', {
            'teacher': 'សៀវភៅសិក្សាគោល, បណ្ណបង្ហាញ, AI Gemini, Google, ស្លាយបង្រៀន',
            'student': 'សៀវភៅពុម្ព, សៀវភៅកត់ត្រា, ប៊ិច, បន្ទាត់'
        }),
        'methods': 'វិធីសាស្ត្រ 5E (Engage, Explore, Explain, Elaborate, Evaluate)',
        'steps': meta.get('steps', {
            'step1': 'រដ្ឋបាលថ្នាក់ (៣ នាទី)៖ ពិនិត្យវត្តមាន អនាម័យ និងសណ្តាប់ធ្នាប់ក្នុងថ្នាក់។',
            'step2': 'រំលឹកមេរៀនចាស់ (៧ នាទី)៖ សួរសំណួរគន្លឹះ និងដោះស្រាយលំហាត់រំលឹកពីម៉ោងមុន។',
            'step3': 'មេរៀនថ្មី (៦៥ នាទី)៖ ដំណើរការតាមវិធីសាស្ត្រ 5E (Engage, Explore, Explain, Elaborate, Evaluate)។',
            'step4': 'ពង្រឹងពុទ្ធិ (៧ នាទី)៖ សង្ខេបចំណុចសំខាន់ៗ និងឲ្យសិស្សឆ្លើយសំណួរបញ្ជាក់ការយល់ដឹង។',
            'step5': 'កិច្ចការផ្ទះ & បណ្តាំផ្ញើ (៣ នាទី)៖ ដាក់កិច្ចការផ្ទះ ណែនាំរំលឹកមេរៀន និងស្វ័យសិក្សា។'
        }),
        'cover_page_index': 0,
        'box_y0': 172.0,
        'class_y0': 99.2,
        'sig_page_index': 2,
        'sig_y0': 583.8,
        'sig_h': 128.2,
        'sig_date': '2026-10-29',
        'sig_date_khmer': 'ថ្ងៃទី ២៩ ខែ តុលា ឆ្នាំ ២០២៦'
    }
    all_plans.append(plan_obj)
    plan_counter += 1

with open('g8_lesson_plans.json', 'w', encoding='utf-8') as f:
    json.dump(all_plans, f, ensure_ascii=False, indent=2)

print(f'Successfully generated {len(all_plans)} Grade 8 lesson plans into g8_lesson_plans.json!')
