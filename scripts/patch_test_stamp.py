# -*- coding: utf-8 -*-
with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = '      this.render();\n      this.bindEvents();'
replacement = """      this.render();
      this.bindEvents();

      if (typeof window !== 'undefined' && window.location.search.includes('test_stamp=true')) {
        setTimeout(async () => {
          try {
            const p = this.plans.find(x => x.id === 'plan_g8_1');
            p.class_name = '8NGS_B2';
            p.date_khmer = 'ថ្ងៃព្រហស្បតិ៍ ទី៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦';
            p.teacher = 'ថោង សុភារី';

            const res = await fetch(p.pdf_file);
            const bytes = await res.arrayBuffer();
            const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });

            await this.applyPdfCustomStamps(doc, p);
            const modified = await doc.save();

            await fetch('/upload_pdf', {
              method: 'POST',
              body: modified,
              headers: { 'Content-Type': 'application/pdf' }
            });
            console.log('TEST_STAMP_DONE');
          } catch (err) {
            console.error('TEST_STAMP_ERR', err);
          }
        }, 500);
      }"""

# Normalize \r\n
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')
text_norm = text.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm, 1)
    with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print('Added test_stamp handler to js/lesson-plans.js')
else:
    print('Target not found')
