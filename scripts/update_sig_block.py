import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """      if (sigPage && typeof plan.sig_y0 === 'number') {
        const pageH = sigPage.getHeight();
        const min_y = Math.max(plan.sig_y0, 52.0);
        const sig_w = 500.0;
        const sig_h = 145.0;
        const sig_y_bottom = pageH - min_y - sig_h;
        const sig_x = 65.0;

        // 1. Redact / Whiteout the ENTIRE old signature region cleanly
        sigPage.drawRectangle({
          x: sig_x,
          y: sig_y_bottom,
          width: sig_w,
          height: sig_h,
          color: PDFLib.rgb(1, 1, 1),
        });

        // 2. Render dynamic high-res 3-column signature block via Canvas
        const sigCanvas = document.createElement('canvas');
        sigCanvas.width = 1200;
        sigCanvas.height = 360;
        const sctx = sigCanvas.getContext('2d');
        sctx.fillStyle = '#ffffff';
        sctx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);

        // Date text
        const cleanSigDate = plan.sig_date_khmer
          ? plan.sig_date_khmer.replace(/^(\\u179a\\u17b6\\u1787\\u1792\\u17b6\\u1793\\u17b8\\u1797\\u17d2\\u1793\\u17c6\\u1796\\u17c1\\u1789[\\s,]*)?/, '')
          : (plan.date_khmer ? plan.date_khmer : '');
        const sigDateText = cleanSigDate.startsWith('ថ្ងៃទី')
          ? `រាជធានីភ្នំពេញ ${cleanSigDate}`
          : `រាជធានីភ្នំពេញ ថ្ងៃទី ${cleanSigDate}`;

        const colLeft = 200;
        const colMid = 600;
        const colRight = 980;

        // A. Date above teacher signature (Right column)
        sctx.fillStyle = '#000000';
        sctx.textAlign = 'center';
        sctx.font = '24px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
        sctx.fillText(sigDateText, colRight, 38);

        // B. Column Titles (Khmer OS Muol Light)
        sctx.font = 'bold 26px "Khmer OS Muol Light", "Khmer OS Muol", "Khmer OS Siemreap", sans-serif';
        sctx.fillText('បានឃើញ និងឯកភាព', colLeft, 80);
        sctx.fillText('បានឃើញ និងពិនិត្យ', colMid, 80);
        sctx.fillText(isGrade8 ? 'គ្រូបង្រៀន' : 'គ្រូបង្រៀនគណិតវិទ្យា', colRight, 80);

        // C. Roles & Subtitles
        sctx.font = '22px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
        sctx.fillText(isGrade8 ? 'ជ.គណៈគ្រប់គ្រងសាលារៀនជំនាន់ថ្មី' : 'នាយករងទទួលបន្ទុកសាលារៀនជំនាន់ថ្មី', colLeft, 118);
        sctx.fillText('ប្រធានក្រុមបច្ចេកទេស', colMid, 118);

        // D. Teacher Name (Under signature space)
        if (plan.teacher) {
          sctx.font = 'bold 26px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
          sctx.fillText(teacherFullName, colRight, 310);
        }

        const sigBlockImg = await doc.embedPng(b64ToUint8(sigCanvas.toDataURL('image/png')));

        // Stamp clean authentic signature block onto the page
        sigPage.drawImage(sigBlockImg, {
          x: sig_x,
          y: sig_y_bottom,
          width: sig_w,
          height: sig_h,
        });
      }"""

replacement = """      if (sigPage && typeof plan.sig_y0 === 'number') {
        const pageH = sigPage.getHeight();
        const min_y = Math.max(plan.sig_y0, 30.0);
        const sig_w = 545.0;
        const sig_h = 145.0;
        const sig_y_bottom = Math.max(pageH - min_y - sig_h, 38.0);
        const sig_x = 28.0;

        // 1. Redact / Whiteout the ENTIRE old signature region cleanly across the page (covers x=28..573)
        sigPage.drawRectangle({
          x: sig_x,
          y: sig_y_bottom,
          width: sig_w,
          height: sig_h,
          color: PDFLib.rgb(1, 1, 1),
        });

        // 2. Render dynamic high-res 3-column signature block via Canvas
        const sigCanvas = document.createElement('canvas');
        sigCanvas.width = 1200;
        sigCanvas.height = 360;
        const sctx = sigCanvas.getContext('2d');
        sctx.fillStyle = '#ffffff';
        sctx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);

        // Date text
        const cleanSigDate = plan.sig_date_khmer
          ? plan.sig_date_khmer.replace(/^(\\u179a\\u17b6\\u1787\\u1792\\u17b6\\u1793\\u17b8\\u1797\\u17d2\\u1793\\u17c6\\u1796\\u17c1\\u1789[\\s,]*)?/, '')
          : (plan.date_khmer ? plan.date_khmer : '');
        const sigDateText = cleanSigDate.startsWith('ថ្ងៃទី')
          ? `រាជធានីភ្នំពេញ ${cleanSigDate}`
          : `រាជធានីភ្នំពេញ ថ្ងៃទី ${cleanSigDate}`;

        const colLeft = 200;
        const colMid = 600;
        const colRight = 1000;

        // A. Date above teacher signature (Right column)
        sctx.fillStyle = '#000000';
        sctx.textAlign = 'center';
        sctx.font = '24px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
        sctx.fillText(sigDateText, colRight, 38);

        // B. Column Titles (Khmer OS Muol Light)
        sctx.font = 'bold 26px "Khmer OS Muol Light", "Khmer OS Muol", "Khmer OS Siemreap", sans-serif';
        sctx.fillText('បានឃើញ និងឯកភាព', colLeft, 80);
        sctx.fillText('បានឃើញ និងពិនិត្យ', colMid, 80);
        sctx.fillText(isGrade8 ? 'គ្រូបង្រៀន' : 'គ្រូបង្រៀនគណិតវិទ្យា', colRight, 80);

        // C. Roles & Subtitles
        sctx.font = '22px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
        sctx.fillText(isGrade8 ? 'ជ.គណៈគ្រប់គ្រងសាលារៀនជំនាន់ថ្មី' : 'នាយករងទទួលបន្ទុកសាលារៀនជំនាន់ថ្មី', colLeft, 118);
        sctx.fillText('ប្រធានក្រុមបច្ចេកទេស', colMid, 118);

        // D. Teacher Name (Under signature space)
        if (plan.teacher) {
          sctx.font = 'bold 26px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
          sctx.fillText(teacherFullName, colRight, 310);
        }

        const sigBlockImg = await doc.embedPng(b64ToUint8(sigCanvas.toDataURL('image/png')));

        // Stamp clean authentic signature block onto the page
        sigPage.drawImage(sigBlockImg, {
          x: sig_x,
          y: sig_y_bottom,
          width: sig_w,
          height: sig_h,
        });
      }"""

# Normalize line endings
text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    new_text = text_norm.replace(target_norm, replacement_norm, 1)
    with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Successfully replaced signature block in js/lesson-plans.js!")
else:
    print("ERROR: Target block not found in text_norm!")
    # Debug snippet
    idx = text_norm.find('if (sigPage && typeof plan.sig_y0 ===')
    print("Found around idx:", repr(text_norm[idx:idx+200]))

