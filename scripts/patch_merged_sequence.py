# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update downloadCustomPdf cachebuster
old_fetch_single = "const existingPdfBytes = await fetch(plan.pdf_file).then(res => {"
new_fetch_single = """const pdfFileUrl = plan.pdf_file.startsWith('/') ? plan.pdf_file : ('/' + plan.pdf_file);
        const existingPdfBytes = await fetch(encodeURI(pdfFileUrl) + '?v=7.8&t=' + Date.now()).then(res => {"""

text = text.replace('\r\n', '\n')
old_fetch_single = old_fetch_single.replace('\r\n', '\n')
new_fetch_single = new_fetch_single.replace('\r\n', '\n')

if old_fetch_single in text:
    text = text.replace(old_fetch_single, new_fetch_single, 1)
    print("Updated downloadCustomPdf fetch with cachebuster")
else:
    print("Warning: old_fetch_single not found")

# 2. Update downloadMergedPdf to auto-sequence dates and bypass cache
old_merged_loop = """      try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        let successfulCount = 0;

        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          try {
            const res = await fetch(plan.pdf_file);
            if (!res.ok) {
              console.warn(`Could not load ${plan.pdf_file} (${res.status})`);
              continue;
            }"""

new_merged_loop = """      try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        let successfulCount = 0;

        // Auto-sequence dates (2 school days, strictly skipping Sat & Sun) and apply selected class & teacher
        const currentTeacher = this.savedTeacher || (this.selectedTeacher ? this.selectedTeacher : (plans[0].teacher || 'នួន បូណង'));
        const currentClass = this.savedClass || plans[0].class_name || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_B2' : '១២A');
        const startDateStr = this.savedStartDate || plans[0].date || '2026-11-05';
        const cadenceMode = this.savedCadence || '2_days_skip_weekend';
        const selectedSigDate = this.savedSigDate || plans[0].sig_date || '2026-10-29';

        const parts = startDateStr.split('-');
        let curDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (curDate.getDay() === 6) curDate.setDate(curDate.getDate() + 2);
        else if (curDate.getDay() === 0) curDate.setDate(curDate.getDate() + 1);

        let stepToggle = 0;

        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          plan.teacher = currentTeacher;
          plan.class_name = currentClass;

          const y = curDate.getFullYear();
          const m = String(curDate.getMonth() + 1).padStart(2, '0');
          const d = String(curDate.getDate()).padStart(2, '0');
          plan.date = `${y}-${m}-${d}`;
          plan.date_khmer = formatKhmerDate(plan.date, true);
          plan.sig_date = selectedSigDate;
          plan.sig_date_khmer = formatKhmerDate(selectedSigDate, false);

          // Advance date for next plan
          if (cadenceMode === '2_days_skip_weekend') {
            curDate.setDate(curDate.getDate() + 2);
            if (curDate.getDay() === 6) curDate.setDate(curDate.getDate() + 2);
            else if (curDate.getDay() === 0) curDate.setDate(curDate.getDate() + 1);
          } else if (cadenceMode === 'alt_1_2_days') {
            const step = (stepToggle % 2 === 0) ? 1 : 2;
            stepToggle++;
            curDate.setDate(curDate.getDate() + step);
            if (curDate.getDay() === 6) curDate.setDate(curDate.getDate() + 2);
            else if (curDate.getDay() === 0) curDate.setDate(curDate.getDate() + 1);
          } else if (cadenceMode === 'daily_weekdays') {
            curDate.setDate(curDate.getDate() + 1);
            if (curDate.getDay() === 6) curDate.setDate(curDate.getDate() + 2);
            else if (curDate.getDay() === 0) curDate.setDate(curDate.getDate() + 1);
          } else {
            curDate.setDate(curDate.getDate() + 2);
            if (curDate.getDay() === 6) curDate.setDate(curDate.getDate() + 2);
            else if (curDate.getDay() === 0) curDate.setDate(curDate.getDate() + 1);
          }

          try {
            const pdfFileUrl = plan.pdf_file.startsWith('/') ? plan.pdf_file : ('/' + plan.pdf_file);
            const res = await fetch(encodeURI(pdfFileUrl) + '?v=7.8&t=' + Date.now());
            if (!res.ok) {
              console.warn(`Could not load ${plan.pdf_file} (${res.status})`);
              continue;
            }"""

old_merged_loop = old_merged_loop.replace('\r\n', '\n')
new_merged_loop = new_merged_loop.replace('\r\n', '\n')

if old_merged_loop in text:
    text = text.replace(old_merged_loop, new_merged_loop, 1)
    print("Updated downloadMergedPdf with auto-sequence dates and fresh fetch")
else:
    print("Warning: old_merged_loop not found")

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved js/lesson-plans.js successfully!")

