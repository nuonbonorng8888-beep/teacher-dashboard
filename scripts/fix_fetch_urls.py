# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix downloadCustomPdf fetch
old_fetch_single = """        const pdfFileUrl = plan.pdf_file.startsWith('/') ? plan.pdf_file : ('/' + plan.pdf_file);
        const existingPdfBytes = await fetch(encodeURI(pdfFileUrl) + '?v=7.8&t=' + Date.now()).then(res => {
          if (!res.ok) throw new Error('Network error loading PDF');
          return res.arrayBuffer();
        });"""

new_fetch_single = """        let res = null;
        try {
          res = await fetch(plan.pdf_file);
        } catch (e1) {
          try { res = await fetch(encodeURI(plan.pdf_file)); } catch (e2) {}
        }
        if (!res || !res.ok) {
          try { res = await fetch(encodeURI(plan.pdf_file)); } catch (e3) {}
        }
        if (!res || !res.ok) throw new Error('Network error loading PDF: ' + plan.pdf_file);
        const existingPdfBytes = await res.arrayBuffer();"""

# 2. Fix downloadMergedPdf fetch
old_fetch_merged = """          try {
            const pdfFileUrl = plan.pdf_file.startsWith('/') ? plan.pdf_file : ('/' + plan.pdf_file);
            const res = await fetch(encodeURI(pdfFileUrl) + '?v=7.8&t=' + Date.now());
            if (!res.ok) {
              console.warn(`Could not load ${plan.pdf_file} (${res.status})`);
              continue;
            }"""

new_fetch_merged = """          try {
            let res = null;
            try {
              res = await fetch(plan.pdf_file);
            } catch (e1) {
              try { res = await fetch(encodeURI(plan.pdf_file)); } catch (e2) {}
            }
            if (!res || !res.ok) {
              try { res = await fetch(encodeURI(plan.pdf_file)); } catch (e3) {}
            }
            if (!res || !res.ok) {
              console.warn(`Could not load ${plan.pdf_file}`);
              continue;
            }"""

text = text.replace('\r\n', '\n')
old_fetch_single = old_fetch_single.replace('\r\n', '\n')
new_fetch_single = new_fetch_single.replace('\r\n', '\n')
old_fetch_merged = old_fetch_merged.replace('\r\n', '\n')
new_fetch_merged = new_fetch_merged.replace('\r\n', '\n')

if old_fetch_single in text:
    text = text.replace(old_fetch_single, new_fetch_single, 1)
    print("Fixed single PDF fetch: relative path, zero CORS/subpath break")
else:
    print("Warning: old_fetch_single not found")

if old_fetch_merged in text:
    text = text.replace(old_fetch_merged, new_fetch_merged, 1)
    print("Fixed merged PDF fetch: relative path, zero CORS/subpath break")
else:
    print("Warning: old_fetch_merged not found")

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved js/lesson-plans.js successfully!")
