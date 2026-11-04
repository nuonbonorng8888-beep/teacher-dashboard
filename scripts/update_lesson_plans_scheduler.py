# update_lesson_plans_scheduler.py
import re

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update constructor
target_constr = """      // Schedule settings
      this.savedStartDate = localStorage.getItem('ngs_custom_start_date') || '2026-11-05';
      this.savedSigDate = localStorage.getItem('ngs_custom_sig_date') || '2026-10-29';
      this.savedClass = localStorage.getItem('ngs_custom_class') || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_C1 & 8NGS_C2' : '១២A');
      this.savedCadence = localStorage.getItem('ngs_custom_cadence') || '2_days_skip_weekend';"""

repl_constr = """      // Schedule settings (Defaulting to Semester 1: 19 Oct 2026 to 20 Feb 2027)
      const rawStart = localStorage.getItem('ngs_custom_start_date');
      this.savedStartDate = (!rawStart || rawStart === '2026-11-05') ? '2026-10-19' : rawStart;
      this.savedEndDate = localStorage.getItem('ngs_custom_end_date') || '2027-02-20';
      const rawSig = localStorage.getItem('ngs_custom_sig_date');
      this.savedSigDate = (!rawSig || rawSig === '2026-10-29') ? '2026-10-12' : rawSig;
      this.savedClass = localStorage.getItem('ngs_custom_class') || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_C1 & 8NGS_C2' : '១២A');
      this.savedCadence = localStorage.getItem('ngs_custom_cadence') || 'auto_fit_range';"""

assert target_constr in content, "Target constructor not found"
content = content.replace(target_constr, repl_constr, 1)

# 2. Update init()
target_init = """        this.savedStartDate = localStorage.getItem('ngs_custom_start_date') || '2026-11-05';
        this.savedSigDate = localStorage.getItem('ngs_custom_sig_date') || '2026-10-29';
        this.savedClass = localStorage.getItem('ngs_custom_class') || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_C1 & 8NGS_C2' : '១២A');
        this.savedCadence = localStorage.getItem('ngs_custom_cadence') || '2_days_skip_weekend';"""

repl_init = """        const rawStart = localStorage.getItem('ngs_custom_start_date');
        this.savedStartDate = (!rawStart || rawStart === '2026-11-05') ? '2026-10-19' : rawStart;
        this.savedEndDate = localStorage.getItem('ngs_custom_end_date') || '2027-02-20';
        const rawSig = localStorage.getItem('ngs_custom_sig_date');
        this.savedSigDate = (!rawSig || rawSig === '2026-10-29') ? '2026-10-12' : rawSig;
        this.savedClass = localStorage.getItem('ngs_custom_class') || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_C1 & 8NGS_C2' : '១២A');
        this.savedCadence = localStorage.getItem('ngs_custom_cadence') || 'auto_fit_range';"""

assert target_init in content, "Target init not found"
content = content.replace(target_init, repl_init, 1)

# 3. Update onStartDateChange and add onEndDateChange, setSemesterPreset, setCadencePreset
target_dates = """    onStartDateChange(val) {
      if (!val) return;
      this.savedStartDate = val;
      const parts = val.split('-');
      const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) - 7);
      const sy = dt.getFullYear();
      const sm = String(dt.getMonth() + 1).padStart(2, '0');
      const sd = String(dt.getDate()).padStart(2, '0');
      const sigInput = document.getElementById('batchSigDate');
      if (sigInput) {
        sigInput.value = `${sy}-${sm}-${sd}`;
      }
    }"""

repl_dates = """    onStartDateChange(val) {
      if (!val) return;
      this.savedStartDate = val;
      try {
        localStorage.setItem('ngs_custom_start_date', val);
      } catch (e) {}
      const parts = val.split('-');
      const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) - 7);
      const sy = dt.getFullYear();
      const sm = String(dt.getMonth() + 1).padStart(2, '0');
      const sd = String(dt.getDate()).padStart(2, '0');
      const sigInput = document.getElementById('batchSigDate');
      if (sigInput) {
        sigInput.value = `${sy}-${sm}-${sd}`;
        this.savedSigDate = sigInput.value;
        try { localStorage.setItem('ngs_custom_sig_date', this.savedSigDate); } catch (e) {}
      }
    }

    onEndDateChange(val) {
      if (!val) return;
      this.savedEndDate = val;
      try {
        localStorage.setItem('ngs_custom_end_date', val);
      } catch (e) {}
    }

    setSemesterPreset(startStr, endStr, cadence = 'auto_fit_range') {
      this.savedStartDate = startStr;
      this.savedEndDate = endStr;
      this.savedCadence = cadence;
      const parts = startStr.split('-');
      const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) - 7);
      const sy = dt.getFullYear();
      const sm = String(dt.getMonth() + 1).padStart(2, '0');
      const sd = String(dt.getDate()).padStart(2, '0');
      this.savedSigDate = `${sy}-${sm}-${sd}`;

      try {
        localStorage.setItem('ngs_custom_start_date', this.savedStartDate);
        localStorage.setItem('ngs_custom_end_date', this.savedEndDate);
        localStorage.setItem('ngs_custom_sig_date', this.savedSigDate);
        localStorage.setItem('ngs_custom_cadence', this.savedCadence);
      } catch (e) {}
      this.render();
      this.applyBatchSchedule();
    }

    setCadencePreset(cadence) {
      this.savedCadence = cadence;
      try {
        localStorage.setItem('ngs_custom_cadence', cadence);
      } catch (e) {}
      const sel = document.getElementById('batchStepDays');
      if (sel) sel.value = cadence;
      this.applyBatchSchedule();
    }"""

assert target_dates in content, "Target dates not found"
content = content.replace(target_dates, repl_dates, 1)

# 4. Update saveCustomizations and resetCustomizations
target_save = """        if (this.savedStartDate) {
          localStorage.setItem('ngs_custom_start_date', this.savedStartDate);
        }
        if (this.savedSigDate) {
          localStorage.setItem('ngs_custom_sig_date', this.savedSigDate);
        }"""

repl_save = """        if (this.savedStartDate) {
          localStorage.setItem('ngs_custom_start_date', this.savedStartDate);
        }
        if (this.savedEndDate) {
          localStorage.setItem('ngs_custom_end_date', this.savedEndDate);
        }
        if (this.savedSigDate) {
          localStorage.setItem('ngs_custom_sig_date', this.savedSigDate);
        }"""

assert target_save in content, "Target save not found"
content = content.replace(target_save, repl_save, 1)

target_reset = """        localStorage.removeItem('ngs_custom_start_date');
        localStorage.removeItem('ngs_custom_sig_date');
        localStorage.removeItem('ngs_custom_class');
        localStorage.removeItem('ngs_custom_class_g8');
        localStorage.removeItem('ngs_custom_class_g12');
        localStorage.removeItem('ngs_custom_cadence');
        this.savedStartDate = '2026-11-05';
        this.savedSigDate = '2026-10-29';
        this.savedCadence = '2_days_skip_weekend';"""

repl_reset = """        localStorage.removeItem('ngs_custom_start_date');
        localStorage.removeItem('ngs_custom_end_date');
        localStorage.removeItem('ngs_custom_sig_date');
        localStorage.removeItem('ngs_custom_class');
        localStorage.removeItem('ngs_custom_class_g8');
        localStorage.removeItem('ngs_custom_class_g12');
        localStorage.removeItem('ngs_custom_cadence');
        this.savedStartDate = '2026-10-19';
        this.savedEndDate = '2027-02-20';
        this.savedSigDate = '2026-10-12';
        this.savedCadence = 'auto_fit_range';"""

assert target_reset in content, "Target reset not found"
content = content.replace(target_reset, repl_reset, 1)

# 5. Replace applyBatchSchedule and insert calculateScheduleDates
# Let's locate applyBatchSchedule()
old_batch_block_start = "    // Batch update dates, cadence, weekend exclusions, class, and teacher\n    applyBatchSchedule() {"
old_batch_block_end = "      this.saveCustomizations(false);\n      this.render();\n      if (window.showToast) {\n        window.showToast(`✓ បានកំណត់កាលវិភាគ ${formatKhmerDate(startDateStr)} (លើកលែងសៅរ៍-អាទិត្យ) ជូន ${visiblePlans.length} មេរៀន សម្រាប់ ${selectedClass} (${teacherName}) រួចរាល់! 🎉`, 'success');\n      }\n    }"

new_batch_block = """    // Helper: calculate schedule dates strictly excluding weekends (Saturday & Sunday)
    calculateScheduleDates(startDateStr, endDateStr, cadenceMode, count) {
      if (count <= 0) return [];
      const sStr = startDateStr || this.savedStartDate || '2026-10-19';
      const sParts = sStr.split('-');
      let sDate = new Date(parseInt(sParts[0], 10), parseInt(sParts[1], 10) - 1, parseInt(sParts[2], 10));
      // Strict weekend exclusion on start date
      if (sDate.getDay() === 6) sDate.setDate(sDate.getDate() + 2); // Saturday -> Monday
      else if (sDate.getDay() === 0) sDate.setDate(sDate.getDate() + 1); // Sunday -> Monday

      let eDate = null;
      const eStr = endDateStr || this.savedEndDate || '2027-02-20';
      if (eStr) {
        const eParts = eStr.split('-');
        eDate = new Date(parseInt(eParts[0], 10), parseInt(eParts[1], 10) - 1, parseInt(eParts[2], 10));
        if (eDate.getDay() === 6) eDate.setDate(eDate.getDate() - 1); // Saturday -> Friday
        else if (eDate.getDay() === 0) eDate.setDate(eDate.getDate() - 2); // Sunday -> Friday
      }

      const toYMD = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      // 1. Auto-fit Range: spread uniformly across all school days between sDate and eDate
      if (cadenceMode === 'auto_fit_range' && eDate && eDate >= sDate) {
        const schoolDays = [];
        let cur = new Date(sDate);
        while (cur <= eDate) {
          const dow = cur.getDay();
          if (dow !== 0 && dow !== 6) {
            schoolDays.push(toYMD(cur));
          }
          cur.setDate(cur.getDate() + 1);
        }

        if (schoolDays.length === 0) {
          return Array(count).fill(toYMD(sDate));
        }
        if (count === 1) {
          return [schoolDays[0]];
        }
        if (schoolDays.length <= count) {
          const res = [];
          for (let i = 0; i < count; i++) {
            res.push(schoolDays[Math.min(i, schoolDays.length - 1)]);
          }
          return res;
        }

        const res = [];
        for (let i = 0; i < count; i++) {
          const idx = Math.round((i * (schoolDays.length - 1)) / (count - 1));
          res.push(schoolDays[idx]);
        }
        return res;
      }

      // 2. Step-based Cadence (with strict weekend skip)
      const result = [];
      let cur = new Date(sDate);
      let stepToggle = 0;

      for (let i = 0; i < count; i++) {
        result.push(toYMD(cur));
        if (i < count - 1) {
          if (cadenceMode === '1_day_skip_weekend' || cadenceMode === 'daily_weekdays') {
            cur.setDate(cur.getDate() + 1);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else if (cadenceMode === '2_days_skip_weekend') {
            cur.setDate(cur.getDate() + 2);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else if (cadenceMode === '3_days_skip_weekend') {
            cur.setDate(cur.getDate() + 3);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else if (cadenceMode === 'alt_1_2_days') {
            const step = (stepToggle % 2 === 0) ? 1 : 2;
            stepToggle++;
            cur.setDate(cur.getDate() + step);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else if (cadenceMode === 'mon_wed_fri') {
            do {
              cur.setDate(cur.getDate() + 1);
            } while (![1, 3, 5].includes(cur.getDay()));
          } else if (cadenceMode === 'tue_thu') {
            do {
              cur.setDate(cur.getDate() + 1);
            } while (![2, 4].includes(cur.getDay()));
          } else if (cadenceMode === 'weekly') {
            cur.setDate(cur.getDate() + 7);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          } else {
            cur.setDate(cur.getDate() + 2);
            if (cur.getDay() === 6) cur.setDate(cur.getDate() + 2);
            else if (cur.getDay() === 0) cur.setDate(cur.getDate() + 1);
          }
        }
      }

      return result;
    }

    // Batch update dates, cadence, weekend exclusions, class, and teacher
    applyBatchSchedule() {
      const classInput = document.getElementById('batchClassInput');
      const dateInput = document.getElementById('batchStartDate');
      const endDateInput = document.getElementById('batchEndDate');
      const sigInput = document.getElementById('batchSigDate');
      const stepInput = document.getElementById('batchStepDays');
      const teacherInput = document.getElementById('batchTeacherSelect');

      const selectedClass = classInput ? classInput.value.trim() : (this.savedClass || '8NGS_C1 & 8NGS_C2');
      const startDateStr = dateInput ? dateInput.value : (this.savedStartDate || '2026-10-19');
      const endDateStr = endDateInput ? endDateInput.value : (this.savedEndDate || '2027-02-20');
      const cadenceMode = stepInput ? stepInput.value : (this.savedCadence || 'auto_fit_range');
      const teacherName = teacherInput ? teacherInput.value : (this.savedTeacher || 'នួន បូណង');

      let selectedSigDate = sigInput ? sigInput.value : (this.savedSigDate || '2026-10-12');
      if (!selectedSigDate && startDateStr) {
        const p = startDateStr.split('-');
        const sD = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10) - 7);
        const sy = sD.getFullYear();
        const sm = String(sD.getMonth() + 1).padStart(2, '0');
        const sd = String(sD.getDate()).padStart(2, '0');
        selectedSigDate = `${sy}-${sm}-${sd}`;
      }

      if (!startDateStr) {
        alert('សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម!');
        return;
      }

      const visiblePlans = this.getFilteredPlans();
      if (visiblePlans.length === 0) {
        alert('មិនមានកិច្ចតែងការដើម្បីកំណត់!');
        return;
      }

      // Save custom start date, end date, signature date, class, teacher, and cadence into memory & localStorage
      this.savedStartDate = startDateStr;
      this.savedEndDate = endDateStr;
      this.savedSigDate = selectedSigDate;
      this.savedClass = selectedClass;
      this.savedCadence = cadenceMode;
      this.savedTeacher = teacherName;

      try {
        localStorage.setItem('ngs_custom_start_date', startDateStr);
        localStorage.setItem('ngs_custom_end_date', endDateStr);
        localStorage.setItem('ngs_custom_sig_date', selectedSigDate);
        localStorage.setItem('ngs_custom_class', selectedClass);
        if (this.selectedGrade === 'ថ្នាក់ទី ៨') {
          localStorage.setItem('ngs_custom_class_g8', selectedClass);
        } else if (this.selectedGrade === 'ថ្នាក់ទី ១២') {
          localStorage.setItem('ngs_custom_class_g12', selectedClass);
        }
        localStorage.setItem('ngs_custom_cadence', cadenceMode);
        localStorage.setItem('ngs_custom_teacher', teacherName);
      } catch (e) {}

      // Calculate schedule dates with strict weekend exclusion (Saturday & Sunday skipped)
      const dateList = this.calculateScheduleDates(startDateStr, endDateStr, cadenceMode, visiblePlans.length);

      visiblePlans.forEach((p, idx) => {
        p.class_name = selectedClass;
        p.teacher = teacherName;
        p.date = dateList[idx] || dateList[dateList.length - 1];
        p.date_khmer = formatKhmerDate(p.date, true);
        p.sig_date = selectedSigDate;
        p.sig_date_khmer = formatKhmerDate(selectedSigDate, false);
      });

      this.saveCustomizations(false);
      this.render();
      if (window.showToast) {
        const firstD = dateList[0] ? formatKhmerDate(dateList[0], true) : '';
        const lastD = dateList[dateList.length - 1] ? formatKhmerDate(dateList[dateList.length - 1], true) : '';
        window.showToast(`✓ បានកំណត់កាលវិភាគ ${firstD} ដល់ ${lastD} (លើកលែងសៅរ៍-អាទិត្យ) ជូន ${visiblePlans.length} មេរៀន សម្រាប់ ${selectedClass} (${teacherName}) រួចរាល់! 🎉`, 'success');
      }
    }"""

# Find applyBatchSchedule block
pos_start = content.find(old_batch_block_start)
assert pos_start != -1, "old_batch_block_start not found"
pos_end = content.find(old_batch_block_end, pos_start)
assert pos_end != -1, "old_batch_block_end not found"
pos_end += len(old_batch_block_end)

content = content[:pos_start] + new_batch_block + content[pos_end:]

# 6. Update Toolbar HTML in render()
# Locate Controls Grid
grid_start = "            <!-- Controls Grid: Teacher, Multi-Class, Start Date, Signature Date, Cadence -->\n            <div class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end pt-1\">"
grid_end = "            <!-- Helpful Information Badge -->\n            <div class=\"mt-2 pt-2 border-t border-purple-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2\">\n              <span>💡 <strong>របៀបគណនា៖</strong> លើកលែងថ្ងៃសៅរ៍ និងអាទិត្យដោយស្វ័យប្រវត្តិ (ថ្ងៃសុក្រ នឹងរំលងទៅថ្ងៃចន្ទវិញ រួចទៅពុធ...)។ ឈ្មោះគ្រូ៖ <strong>${this.savedTeacher}</strong>។</span>\n              ${this.savedStartDate ? `<span class=\"bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded-lg border border-purple-200\">📌 ចាប់ផ្តើម៖ ${formatKhmerDate(this.savedStartDate)} · ចុះហត្ថលេខា៖ ${formatKhmerDate(this.savedSigDate || '2026-10-29', false)}</span>` : ''}\n            </div>"

new_toolbar = """            <!-- Controls Grid: Teacher, Class, Start Date, End Date, Signature Date, Cadence -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end pt-1">
              
              <!-- 1. Teacher Selector (Nuon Bonorng or Thaong Sophary) -->
              <div>
                <label class="block text-[11px] font-bold text-purple-800 dark:text-purple-300 mb-1">
                  👨‍🏫 គ្រូបង្រៀន (Teacher Switcher):
                </label>
                <select id="batchTeacherSelect" onchange="window.lessonPlansManager.setTeacher(this.value)"
                  class="w-full px-3 py-2 rounded-xl border border-purple-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
                  <option value="នួន បូណង" ${this.savedTeacher === 'នួន បូណង' ? 'selected' : ''}>👨‍🏫 លោកគ្រូ នួន បូណង (070 794 729)</option>
                  <option value="ថោង សុភារី" ${this.savedTeacher === 'ថោង សុភារី' ? 'selected' : ''}>👩‍🏫 អ្នកគ្រូ ថោង សុភារី (096 75 74 005)</option>
                </select>
                <div class="mt-1 text-[10px] text-purple-700 dark:text-purple-300 font-semibold flex items-center justify-between">
                  <span>📞 <strong class="underline">${this.getTeacherPhone()}</strong></span>
                  <span class="text-slate-400">|</span>
                  <span>${this.getTeacherFullTitle()}</span>
                </div>
              </div>

              <!-- 2. Class Selector & Multi-Class Customizer -->
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  🎓 ថ្នាក់បង្រៀន (១, ២ ឬ ៣ ថ្នាក់):
                </label>
                <div class="relative">
                  <input type="text" id="batchClassInput" value="${this.savedClass || (isGrade8 ? '8NGS_C1 & 8NGS_C2' : '១២A')}"
                    oninput="window.lessonPlansManager.onBatchClassChange(this.value)"
                    onchange="window.lessonPlansManager.onBatchClassChange(this.value)"
                    class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500"
                    placeholder="ឧ. 8NGS_B2 ឬ 8NGS_C1 & 8NGS_C2">
                </div>
              </div>

              <!-- 3. Start Date Picker -->
              <div>
                <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  📅 ថ្ងៃចាប់ផ្តើម (ក្បាលកិច្ច - លើ):
                </label>
                <input type="date" id="batchStartDate" value="${this.savedStartDate || '2026-10-19'}"
                  onchange="window.lessonPlansManager.onStartDateChange(this.value)"
                  class="w-full px-3 py-1.5 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
              </div>

              <!-- 4. End Date Picker -->
              <div>
                <label class="block text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                  🏁 ថ្ងៃបញ្ចប់ (ចុងកាលវិភាគ):
                </label>
                <input type="date" id="batchEndDate" value="${this.savedEndDate || '2027-02-20'}"
                  onchange="window.lessonPlansManager.onEndDateChange(this.value)"
                  class="w-full px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-slate-600 bg-indigo-50/40 dark:bg-slate-700 text-xs font-bold text-indigo-900 dark:text-indigo-200 shadow-sm focus:outline-none focus:border-indigo-500">
              </div>

              <!-- 5. Signature Date Picker -->
              <div>
                <label class="block text-[11px] font-bold text-purple-700 dark:text-purple-300 mb-1">
                  ✍️ ថ្ងៃចុះហត្ថលេខា (ផ្នែកក្រោម):
                </label>
                <input type="date" id="batchSigDate" value="${this.savedSigDate || '2026-10-12'}"
                  class="w-full px-3 py-1.5 rounded-xl border border-purple-300 dark:border-slate-600 bg-purple-50/50 dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
              </div>

              <!-- 6. Cadence Step with Weekend Exclusions & Auto-Fit -->
              <div>
                <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  ⏱️ គម្លាតថ្ងៃ (Cadence & លើកលែង):
                </label>
                <select id="batchStepDays" class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500">
                  <option value="auto_fit_range" ${this.savedCadence === 'auto_fit_range' ? 'selected' : ''}>
                    🎯 លៃតម្រឹមស្វ័យប្រវត្តិ (Auto-distribute ក្នុងចន្លោះ)
                  </option>
                  <option value="2_days_skip_weekend" ${this.savedCadence === '2_days_skip_weekend' ? 'selected' : ''}>
                    ⚡ ២ ថ្ងៃម្តង (រំលង សៅរ៍-អាទិត្យ · សុក្រទៅចន្ទ)
                  </option>
                  <option value="3_days_skip_weekend" ${this.savedCadence === '3_days_skip_weekend' ? 'selected' : ''}>
                    ⚡ ៣ ថ្ងៃម្តង (រំលង សៅរ៍-អាទិត្យ)
                  </option>
                  <option value="daily_weekdays" ${this.savedCadence === 'daily_weekdays' ? 'selected' : ''}>
                    ⚡ រាល់ថ្ងៃចន្ទ ដល់ សុក្រ (រំលង ១ ថ្ងៃ · គ្មានសៅរ៍-អាទិត្យ)
                  </option>
                  <option value="alt_1_2_days" ${this.savedCadence === 'alt_1_2_days' ? 'selected' : ''}>
                    រំលង ១ថ្ងៃ ផង ២ថ្ងៃ ផង (រំលង សៅរ៍-អាទិត្យ)
                  </option>
                  <option value="mon_wed_fri" ${this.savedCadence === 'mon_wed_fri' ? 'selected' : ''}>
                    ចន្ទ - ពុធ - សុក្រ (៣ ថ្ងៃ/សប្តាហ៍)
                  </option>
                  <option value="tue_thu" ${this.savedCadence === 'tue_thu' ? 'selected' : ''}>
                    អង្គារ - ព្រហស្បតិ៍ (២ ថ្ងៃ/សប្តាហ៍)
                  </option>
                  <option value="weekly" ${this.savedCadence === 'weekly' ? 'selected' : ''}>
                    រៀងរាល់ ១ សប្តាហ៍ម្តង (+៧ ថ្ងៃ)
                  </option>
                </select>
              </div>
            </div>

            <!-- Quick Class Selectors & Preset Action -->
            <div class="space-y-2 pt-1 border-t border-purple-100/80 dark:border-slate-700/60">
              <!-- Row A: Quick Class Pills -->
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="font-bold text-slate-500 dark:text-slate-400 text-[11px]">ថ្នាក់រហ័ស៖</span>
                  ${isGrade8 ? `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      8NGS_C1
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      8NGS_C2
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      8NGS_B
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      8NGS_B2
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1 & 8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                      8NGS_C1 & 8NGS_C2 (២ ថ្នាក់)
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1, 8NGS_C2 & 8NGS_B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                      8NGS_C1, 8NGS_C2 & 8NGS_B (៣ ថ្នាក់)
                    </button>
                  ` : `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      ១២A
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      ១២B
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A & ១២B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                      ១២A & ១២B (២ ថ្នាក់)
                    </button>
                  `}
                </div>

                <!-- Apply Button -->
                <div>
                  <button onclick="window.lessonPlansManager.applyBatchSchedule()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> បំពេញស្វ័យប្រវត្តិតាមកាលវិភាគ
                  </button>
                </div>
              </div>

              <!-- Row B: Quick Schedule Presets -->
              <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span class="font-bold text-indigo-700 dark:text-indigo-300 text-[11px] flex items-center gap-1">
                  <i class="fa-solid fa-calendar-check"></i> កាលវិភាគគំរូរហ័ស៖
                </span>
                <button type="button" onclick="window.lessonPlansManager.setSemesterPreset('2026-10-19', '2027-02-20', 'auto_fit_range')"
                  class="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 hover:bg-indigo-200 text-indigo-900 dark:text-indigo-200 border border-indigo-300 font-extrabold text-[11px] transition shadow-xs">
                  🗓️ ឆមាសទី១ (១៩ តុលា ២០២៦ - ២០ កុម្ភៈ ២០២៧)
                </button>
                <button type="button" onclick="window.lessonPlansManager.setCadencePreset('2_days_skip_weekend')"
                  class="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                  ⚡ រំលង ២ ថ្ងៃ (សុក្រ-ចន្ទ)
                </button>
                <button type="button" onclick="window.lessonPlansManager.setCadencePreset('3_days_skip_weekend')"
                  class="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                  ⚡ រំលង ៣ ថ្ងៃ
                </button>
                <button type="button" onclick="window.lessonPlansManager.setCadencePreset('daily_weekdays')"
                  class="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                  ⚡ រំលង ១ ថ្ងៃ (ចន្ទ-សុក្រ)
                </button>
                <button type="button" onclick="window.lessonPlansManager.setCadencePreset('auto_fit_range')"
                  class="px-2 py-1 rounded-lg bg-purple-50 dark:bg-slate-700 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-600 font-bold text-[11px] transition">
                  🎯 Auto-distribute ពេញចន្លោះ
                </button>
              </div>
            </div>

            <!-- Helpful Information Badge -->
            <div class="mt-2 pt-2 border-t border-purple-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
              <span>💡 <strong>របៀបគណនា៖</strong> លើកលែងថ្ងៃសៅរ៍ និងអាទិត្យជាដាច់ខាត (ថ្ងៃសុក្រ នឹងរំលងទៅថ្ងៃចន្ទវិញ)។ រយៈពេលកំណត់៖ <strong>${formatKhmerDate(this.savedStartDate)}</strong> ដល់ <strong>${formatKhmerDate(this.savedEndDate || '2027-02-20')}</strong>。 គ្រូបង្រៀន៖ <strong>${this.savedTeacher}</strong> (${this.getTeacherPhone()})។</span>
              ${this.savedStartDate ? `<span class="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded-lg border border-purple-200">📌 ចាប់ផ្តើម៖ ${formatKhmerDate(this.savedStartDate)} · ចុះហត្ថលេខា៖ ${formatKhmerDate(this.savedSigDate || '2026-10-12', false)}</span>` : ''}
            </div>"""

p_grid_start = content.find(grid_start)
assert p_grid_start != -1, "grid_start not found"
p_grid_end = content.find(grid_end, p_grid_start)
assert p_grid_end != -1, "grid_end not found"
p_grid_end += len(grid_end)

content = content[:p_grid_start] + new_toolbar + content[p_grid_end:]

# 7. Update downloadMergedPdf to use calculateScheduleDates
old_pdf_dates_start = "        // Auto-sequence dates (2 school days, strictly skipping Sat & Sun) and apply selected class & teacher"
old_pdf_dates_end = "            curDate.setDate(curDate.getDate() + 2);\n            if (curDate.getDay() === 6) curDate.setDate(curDate.getDate() + 2);\n            else if (curDate.getDay() === 0) curDate.setDate(curDate.getDate() + 1);\n          }"

new_pdf_dates = """        // Auto-sequence dates (strictly skipping Sat & Sun) and apply selected class & teacher
        const currentTeacher = this.savedTeacher || (this.selectedTeacher ? this.selectedTeacher : (plans[0].teacher || 'នួន បូណង'));
        const currentClass = this.savedClass || plans[0].class_name || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_B2' : '១២A');
        const startDateStr = this.savedStartDate || plans[0].date || '2026-10-19';
        const endDateStr = this.savedEndDate || '2027-02-20';
        const cadenceMode = this.savedCadence || 'auto_fit_range';
        const selectedSigDate = this.savedSigDate || plans[0].sig_date || '2026-10-12';

        const dateList = this.calculateScheduleDates(startDateStr, endDateStr, cadenceMode, plans.length);

        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          plan.teacher = currentTeacher;
          plan.class_name = currentClass;

          plan.date = dateList[i] || dateList[dateList.length - 1];
          plan.date_khmer = formatKhmerDate(plan.date, true);
          plan.sig_date = selectedSigDate;
          plan.sig_date_khmer = formatKhmerDate(selectedSigDate, false);"""

p_pdf_start = content.find(old_pdf_dates_start)
assert p_pdf_start != -1, "old_pdf_dates_start not found"
p_pdf_end = content.find(old_pdf_dates_end, p_pdf_start)
assert p_pdf_end != -1, "old_pdf_dates_end not found"
p_pdf_end += len(old_pdf_dates_end)

content = content[:p_pdf_start] + new_pdf_dates + content[p_pdf_end:]

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated js/lesson-plans.js!")
