# scripts/slice_g11_plans.py
import pymupdf as fitz
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/g11_extracted_plans.json', 'r', encoding='utf-8') as f:
    plans = json.load(f)

output_dir = "កិច្ចការតែងការទី១១"
sliced_plans = []

for idx, p in enumerate(plans):
    src_doc = fitz.open(p['path'])
    new_doc = fitz.open()
    
    # insert pages from start_page to end_page (inclusive)
    new_doc.insert_pdf(src_doc, from_page=p['start_page'], to_page=p['end_page'])
    
    ch_num = p['ch_code'].split('_')[-1].replace('l', '') # e.g. '1', '2', '3'
    hour = p['hour']
    safe_topic = p['les_title'].replace(' ', '_').replace('៖', '').replace(':', '')
    out_filename = f"11_{ch_num}_{hour}_{safe_topic}_ម៉ោងទី{hour}.pdf"
    out_path = os.path.join(output_dir, out_filename)
    
    new_doc.save(out_path)
    new_doc.close()
    src_doc.close()
    
    print(f"Saved: {out_filename} ({p['page_count']} pages)")
    p['pdf_file'] = out_path.replace('\\', '/')
    sliced_plans.append(p)

with open('scripts/g11_sliced_metadata.json', 'w', encoding='utf-8') as f:
    json.dump(sliced_plans, f, indent=2, ensure_ascii=False)
print("Grade 11 slicing complete!")

