# -*- coding: utf-8 -*-
"""
Python script to apply the comprehensive Print & Save PDF Hub to js/lesson-plans.js
"""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update constructor
constructor_target = """      this.savedCadence = localStorage.getItem('ngs_custom_cadence') || '2_days_skip_weekend';
      this.selectedWeekdays = JSON.parse(localStorage.getItem('ngs_custom_weekdays') || '[1, 3, 5]'); // Mon, Wed, Fri
    }"""

constructor_replacement = """      this.savedCadence = localStorage.getItem('ngs_custom_cadence') || '2_days_skip_weekend';
      this.selectedWeekdays = JSON.parse(localStorage.getItem('ngs_custom_weekdays') || '[1, 3, 5]'); // Mon, Wed, Fri

      // Print & Save PDF Hub state
      this.printHubActiveTab = 'single';
      this.printHubSelectedSingleChapter = null;
      this.printHubSelectedChapters = new Set();
    }"""

if constructor_target in code:
    code = code.replace(constructor_target, constructor_replacement, 1)
    print("1. Constructor updated successfully.")
else:
    print("WARNING: Constructor target not found!")

# 2. Add Print Hub button to the Chapter Filter Tabs row (next to Official Files)
tabs_target = """            <!-- Official Chapter Files Download Hub -->
            <div class="flex items-center gap-2 shrink-0">"""

tabs_replacement = """            <!-- Print & Save PDF Hub Trigger Button -->
            <div class="flex items-center gap-2 shrink-0">
              <button onclick="window.lessonPlansManager.openPrintHub()"
                class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition">
                <i class="fa-solid fa-print"></i> <span>🖨️ បោះពុម្ព & Save PDF Hub</span>
              </button>
            </div>

            <!-- Official Chapter Files Download Hub -->
            <div class="flex items-center gap-2 shrink-0">"""

if tabs_target in code:
    code = code.replace(tabs_target, tabs_replacement, 1)
    print("2. Filter Tabs toolbar updated with Print Hub button.")
else:
    print("WARNING: Filter tabs target not found!")

# 3. Add #printLessonPlansModal right below #lessonPlanModal
modal_target = """        <!-- Modal Viewer for Lesson Plan -->
        <div id="lessonPlanModal" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm hidden flex items-center justify-center p-3 md:p-6 overflow-y-auto">"""

modal_hub_code = """        <!-- Print & Save PDF Hub Modal -->
        <div id="printLessonPlansModal" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm hidden flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="p-4 md:p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg shadow-inner">
                  🖨️
                </div>
                <div>
                  <h3 class="font-extrabold text-sm md:text-base leading-tight">បោះពុម្ព & Save PDF Hub</h3>
                  <p class="text-xs text-emerald-200">ម្តង ១ មេរៀន · លើសពី ១ មេរៀន · ១ កម្រិតថ្នាក់ទាំងមូល</p>
                </div>
              </div>
              <button onclick="window.lessonPlansManager.closePrintHub()" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Modal Content (Dynamically Populated) -->
            <div id="printHubModalContent" class="p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200">
            </div>
          </div>
        </div>

        <!-- Modal Viewer for Lesson Plan -->
        <div id="lessonPlanModal" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm hidden flex items-center justify-center p-3 md:p-6 overflow-y-auto">"""

if modal_target in code:
    code = code.replace(modal_target, modal_hub_code, 1)
    print("3. Print Hub modal markup added.")
else:
    print("WARNING: Modal target not found!")

# 4. Enhance renderPlansList to include contextual Print & Save PDF action bar
list_target = """      container.innerHTML = filtered.map(p => {"""

list_replacement = """      const chapters = this.getGradeChapters();
      const currentChapterObj = chapters.find(c => c.code === this.activeChapter);

      // Contextual Action Bar for printing / saving current view
      let contextualActionBar = '';
      if (this.activeChapter !== 'all') {
        contextualActionBar = `
          <div class="card-soft p-4 bg-gradient-to-r from-purple-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-800 dark:to-slate-800 border-purple-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm font-black shadow-sm">
                📘
              </div>
              <div>
                <div class="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase">
                  កំពុងមើល៖ ${unitLabel}ជ្រើសរើស
                </div>
                <div class="font-extrabold text-xs text-slate-900 dark:text-white">
                  ${currentChapterObj ? currentChapterObj.title : this.activeChapter} (សរុប ${toKhmerNum(filtered.length)} ម៉ោងបង្រៀន)
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="window.lessonPlansManager.executePrint('single', '${this.activeChapter}')"
                class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព${unitLabel}នេះ (${toKhmerNum(filtered.length)} ម៉ោង)</span>
              </button>
              <button onclick="window.lessonPlansManager.executeMergedPdf('single', '${this.activeChapter}')"
                class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <i class="fa-solid fa-file-arrow-down"></i> <span>Save PDF ${unitLabel}នេះ</span>
              </button>
              <button onclick="window.lessonPlansManager.openPrintHub('multiple')"
                class="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-700 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-slate-600 font-bold text-xs flex items-center gap-1.5 transition">
                <i class="fa-solid fa-layer-group"></i> <span>ជ្រើសច្រើន${unitLabel}</span>
              </button>
            </div>
          </div>
        `;
      } else {
        contextualActionBar = `
          <div class="card-soft p-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-indigo-50/80 dark:from-slate-800 dark:to-slate-800 border-emerald-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-sm">
                🎓
              </div>
              <div>
                <div class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                  កំពុងមើល៖ គ្រប់${unitLabel}នៃ ${currentGrade}
                </div>
                <div class="font-extrabold text-xs text-slate-900 dark:text-white">
                  សរុប ${toKhmerNum(chapters.length)} ${unitLabel} (${toKhmerNum(filtered.length)} ម៉ោងបង្រៀន / កិច្ចតែងការ)
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="window.lessonPlansManager.openPrintHub('single')"
                class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <span>📘 ម្តង ១ ${unitLabel}</span>
              </button>
              <button onclick="window.lessonPlansManager.openPrintHub('multiple')"
                class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <span>📑 លើសពី ១ ${unitLabel}</span>
              </button>
              <button onclick="window.lessonPlansManager.executePrint('grade')"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព${currentGrade} ទាំងមូល (${toKhmerNum(filtered.length)} ម៉ោង)</span>
              </button>
              <button onclick="window.lessonPlansManager.executeMergedPdf('grade')"
                class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                <i class="fa-solid fa-file-arrow-down"></i> <span>Save PDF ថ្នាក់ទាំងមូល</span>
              </button>
            </div>
          </div>
        `;
      }

      const cardsHtml = filtered.map(p => {"""

if list_target in code:
    code = code.replace(list_target, list_replacement, 1)
    # Also update container.innerHTML assignment at end of renderPlansList
    end_map_target = """).join('');
    }"""
    end_map_replacement = """).join('');
      container.innerHTML = contextualActionBar + cardsHtml;
    }"""
    code = code.replace(end_map_target, end_map_replacement, 1)
    print("4. Contextual print action bar integrated into renderPlansList.")
else:
    print("WARNING: renderPlansList target not found!")

# 5. Append new helper methods, printPlans, downloadMergedPdf, generatePrintableHtml, etc.
end_target = """    printCurrentPlan() {
      const p = this.currentModalPlan;
      if (!p) return;
      window.print();
    }
  }"""

new_methods_code = """    printCurrentPlan() {
      const p = this.currentModalPlan;
      if (!p) return;
      this.printPlans([p], p.lesson_title);
    }

    getGradeChapters() {
      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      const gradePlans = this.plans.filter(p => p.grade === currentGrade);
      const chapterMap = {};
      gradePlans.forEach(p => {
        if (!chapterMap[p.chapter_code]) {
          chapterMap[p.chapter_code] = {
            code: p.chapter_code,
            title: p.chapter,
            count: 0,
            plans: []
          };
        }
        chapterMap[p.chapter_code].count++;
        chapterMap[p.chapter_code].plans.push(p);
      });
      return Object.values(chapterMap);
    }

    openPrintHub(tab = 'single', initialChapter = null) {
      this.printHubActiveTab = tab;
      const chapters = this.getGradeChapters();
      if (initialChapter) {
        this.printHubSelectedSingleChapter = initialChapter;
      } else if (this.activeChapter && this.activeChapter !== 'all') {
        this.printHubSelectedSingleChapter = this.activeChapter;
      } else if (chapters.length > 0) {
        this.printHubSelectedSingleChapter = chapters[0].code;
      }

      if (this.printHubSelectedChapters.size === 0) {
        chapters.forEach(ch => this.printHubSelectedChapters.add(ch.code));
      }

      this.renderPrintHubModal();
      const modal = document.getElementById('printLessonPlansModal');
      if (modal) modal.classList.remove('hidden');
    }

    closePrintHub() {
      const modal = document.getElementById('printLessonPlansModal');
      if (modal) modal.classList.add('hidden');
    }

    setPrintHubTab(tabName) {
      this.printHubActiveTab = tabName;
      this.renderPrintHubModal();
    }

    onPrintHubSingleChapterChange(code) {
      this.printHubSelectedSingleChapter = code;
      this.renderPrintHubModal();
    }

    togglePrintHubChapter(code) {
      if (this.printHubSelectedChapters.has(code)) {
        this.printHubSelectedChapters.delete(code);
      } else {
        this.printHubSelectedChapters.add(code);
      }
      this.renderPrintHubModal();
    }

    selectAllPrintHubChapters() {
      const chapters = this.getGradeChapters();
      chapters.forEach(ch => this.printHubSelectedChapters.add(ch.code));
      this.renderPrintHubModal();
    }

    deselectAllPrintHubChapters() {
      this.printHubSelectedChapters.clear();
      this.renderPrintHubModal();
    }

    getPlansForScope(scope, targetCode = null) {
      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      if (scope === 'modal') {
        return this.currentModalPlan ? [this.currentModalPlan] : [];
      }
      if (scope === 'single') {
        const code = targetCode || this.printHubSelectedSingleChapter;
        return this.plans.filter(p => p.grade === currentGrade && p.chapter_code === code);
      }
      if (scope === 'multiple') {
        return this.plans.filter(p => p.grade === currentGrade && this.printHubSelectedChapters.has(p.chapter_code));
      }
      if (scope === 'grade') {
        return this.plans.filter(p => p.grade === currentGrade);
      }
      return [];
    }

    executePrint(scope, targetCode = null) {
      const plans = this.getPlansForScope(scope, targetCode);
      if (!plans || plans.length === 0) {
        alert('សូមជ្រើសរើសមេរៀនយ៉ាងហោចណាស់ ១!');
        return;
      }
      let title = `កិច្ចតែងការ_${this.selectedGrade}`;
      if (scope === 'single') {
        title += `_${plans[0].chapter}`;
      } else if (scope === 'multiple') {
        title += `_ជ្រើសរើស_${toKhmerNum(plans.length)}ម៉ោង`;
      } else if (scope === 'grade') {
        title += `_ពេញលេញ_${toKhmerNum(plans.length)}ម៉ោង`;
      }
      this.printPlans(plans, title);
    }

    executeMergedPdf(scope, targetCode = null) {
      const plans = this.getPlansForScope(scope, targetCode);
      if (!plans || plans.length === 0) {
        alert('សូមជ្រើសរើសមេរៀនយ៉ាងហោចណាស់ ១!');
        return;
      }
      let filename = `កិច្ចតែងការ_${this.selectedGrade.replace(/\\s+/g, '')}`;
      if (scope === 'single') {
        const chClean = plans[0].chapter.replace(/[^a-zA-Z0-9\\u1780-\\u17D2]/g, '_').replace(/_+/g, '_').substring(0, 45);
        filename += `_${chClean}_(${toKhmerNum(plans.length)}ម៉ោង)`;
      } else if (scope === 'multiple') {
        filename += `_មេរៀនជ្រើសរើស_${toKhmerNum(plans.length)}ម៉ោង`;
      } else {
        filename += `_ពេញលេញ_${toKhmerNum(plans.length)}ម៉ោង`;
      }
      if (this.savedClass) {
        const classClean = this.savedClass.replace(/[^a-zA-Z0-9\\u1780-\\u17D2]/g, '_');
        filename += `_${classClean}`;
      }
      filename += '.pdf';
      this.downloadMergedPdf(plans, filename);
    }

    generatePrintableHtml(plans) {
      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      const isGrade8 = currentGrade === 'ថ្នាក់ទី ៨';
      const unitLabel = isGrade8 ? 'មេរៀន' : 'ជំពូក';

      return plans.map(p => {
        const teacherTitle = (p.teacher && p.teacher.includes('សុភារី')) ? 'អ្នកគ្រូ' : 'លោកគ្រូ';
        const knowledgeItems = (p.objectives && p.objectives.knowledge && p.objectives.knowledge.length > 0)
          ? p.objectives.knowledge
          : [`កំណត់ និងយល់ច្បាស់ពីខ្លឹមសារមេរៀន ${p.lesson_title} តាមការណែនាំរបស់គ្រូ។`];
        const skillItems = (p.objectives && p.objectives.skills && p.objectives.skills.length > 0)
          ? p.objectives.skills
          : [`អនុវត្តដោះស្រាយលំហាត់ និងសកម្មភាពរៀនសូត្របានត្រឹមត្រូវ និងទាន់ពេលវេលា។`];
        const attitudeText = (p.objectives && p.objectives.attitude) || 'បណ្តុះស្មារតីស្រឡាញ់មុខវិជ្ជាគណិតវិទ្យា ភាពហ្មត់ចត់ និងការចូលរួមយ៉ាងសកម្មក្នុងថ្នាក់រៀន។';
        const teacherMat = (p.materials && p.materials.teacher) || 'សៀវភៅពុម្ព, ស្លាយបង្រៀន, បន្ទាត់, រង្វង់ត្រីកោណមាត្រ/ឧបករណ៍បង្រៀន';
        const studentMat = (p.materials && p.materials.student) || 'សៀវភៅសិក្សាគោល, សៀវភៅសរសេរ, ប៊ិច, បន្ទាត់';
        const methodText = p.methods || 'វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered Approach) និង 5E';

        return `
          <div class="lesson-plan-print-page">
            <!-- Official Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">
              <div style="text-align:center; min-width: 220px;">
                <div style="font-size: 13px; font-weight: bold; color: #1e293b;">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
                <div style="font-size: 14px; font-weight: 800; color: #4338ca;">វិទ្យាល័យព្រះយុគន្ធរ</div>
                <div style="font-size: 11px; font-weight: bold; color: #6d28d9;">សាលារៀនជំនាន់ថ្មី (NGS)</div>
              </div>
              <div style="text-align:center; min-width: 240px;">
                <div style="font-size: 14px; font-weight: 800; color: #0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
                <div style="font-size: 13px; font-weight: bold; color: #0f172a;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                <div style="letter-spacing: 5px; font-size: 11px; color: #64748b; margin-top: 2px;">*** ៚ ៚ ៚ ***</div>
              </div>
            </div>

            <!-- Title Banner -->
            <div style="text-align:center; margin: 8px 0 12px 0; background-color: #f8fafc; border: 1.5px solid #4338ca; border-radius: 8px; padding: 7px 12px;">
              <h2 style="font-size: 16px; font-weight: 800; margin: 0; color: #1e1b4b;">
                កិច្ចតែងការបង្រៀនគណិតវិទ្យា (${p.grade})
              </h2>
              <div style="font-size: 12px; font-weight: 700; color: #4f46e5; margin-top: 2px;">
                ស្តង់ដារគុណវុឌ្ឍិ ៥ ជំហានបង្រៀន NGS (ពិន្ទុ ៥០/៥០) · ម៉ោងទី ${toKhmerNum(p.ch_lesson_num)}
              </div>
            </div>

            <!-- Document Matrix -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px;">
              <tr>
                <td style="border: 1px solid #64748b; padding: 5px 8px; width: 50%; background: #f8fafc;">
                  <strong>${unitLabel}៖</strong> <span style="font-weight: 700; color: #4338ca;">${p.chapter}</span>
                </td>
                <td style="border: 1px solid #64748b; padding: 5px 8px; width: 50%;">
                  <strong>កាលបរិច្ឆេទបង្រៀន៖</strong> <span style="font-weight: 700; color: #0f172a;">${p.date_khmer}</span>
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #64748b; padding: 5px 8px; background: #f8fafc;">
                  <strong>ចំណងជើងមេរៀន៖</strong> <span style="font-weight: 800; color: #0f172a;">${p.lesson_title}</span>
                </td>
                <td style="border: 1px solid #64748b; padding: 5px 8px;">
                  <strong>ថ្នាក់បង្រៀន៖</strong> <span style="font-weight: 800; color: #4338ca;">ថ្នាក់ទី ${p.class_name}</span>
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #64748b; padding: 5px 8px; background: #f8fafc;">
                  <strong>ខ្លឹមសារមេរៀន៖</strong> ${p.topic}
                </td>
                <td style="border: 1px solid #64748b; padding: 5px 8px;">
                  <strong>រយៈពេលបង្រៀន៖</strong> ${p.duration}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="border: 1px solid #64748b; padding: 5px 8px; background: #fdf4ff;">
                  <strong>គ្រូបង្រៀនទទួលបន្ទុក៖</strong> <span style="font-weight: 800; color: #6b21a8;">${teacherTitle} ${p.teacher}</span> (វិទ្យាល័យព្រះយុគន្ធរ NGS)
                </td>
              </tr>
            </table>

            <!-- I. Objectives -->
            <div style="margin-bottom: 9px;">
              <div style="font-size: 11.5px; font-weight: 800; color: #1e1b4b; background: #e0e7ff; padding: 3px 8px; border-radius: 4px; margin-bottom: 5px;">
                I. វត្ថុបំណងមេរៀន (Lesson Objectives)
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; font-size: 10px;">
                <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                  <strong style="color: #4338ca; display: block; margin-bottom: 2px;">🧠 វិជ្ជាសម្បទា (Knowledge)៖</strong>
                  <ul style="margin: 0; padding-left: 14px;">
                    ${knowledgeItems.map(k => `<li>${k}</li>`).join('')}
                  </ul>
                </div>
                <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                  <strong style="color: #0369a1; display: block; margin-bottom: 2px;">🛠️ បំណិនសម្បទា (Skills)៖</strong>
                  <ul style="margin: 0; padding-left: 14px;">
                    ${skillItems.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
                <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                  <strong style="color: #15803d; display: block; margin-bottom: 2px;">🌟 ឥរិយាបថសម្បទា (Attitude)៖</strong>
                  <p style="margin: 0;">${attitudeText}</p>
                </div>
              </div>
            </div>

            <!-- II & III. Materials & Methods -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 9px; font-size: 10px;">
              <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                <div style="font-weight: 800; color: #1e1b4b; margin-bottom: 2px;">II. សម្ភារឧបទេស (Teaching Materials)</div>
                <div style="margin-bottom: 2px;">• <strong>គ្រូ៖</strong> ${teacherMat}</div>
                <div>• <strong>សិស្ស៖</strong> ${studentMat}</div>
              </div>
              <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #fafafa;">
                <div style="font-weight: 800; color: #1e1b4b; margin-bottom: 2px;">III. វិធីសាស្ត្របង្រៀន (Teaching Methods)</div>
                <div>${methodText}</div>
              </div>
            </div>

            <!-- IV. 5-Step Process Table -->
            <div style="margin-bottom: 10px;">
              <div style="font-size: 11.5px; font-weight: 800; color: #1e1b4b; background: #e0e7ff; padding: 3px 8px; border-radius: 4px; margin-bottom: 5px;">
                IV. ដំណើរការបង្រៀន និងរៀន ៥ ជំហាន (5-Step Teaching Process)
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="border: 1px solid #64748b; padding: 4px 6px; width: 18%; text-align: center;">ជំហាន</th>
                    <th style="border: 1px solid #64748b; padding: 4px 6px; width: 12%; text-align: center;">រយៈពេល</th>
                    <th style="border: 1px solid #64748b; padding: 4px 6px; width: 70%; text-align: left;">សកម្មភាពបង្រៀន និងរៀន</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #4338ca;">ជំហានទី ១</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">២-៣ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>រដ្ឋបាលថ្នាក់៖</strong> ${p.steps.step1}</td>
                  </tr>
                  <tr style="background: #fbfbfe;">
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #0284c7;">ជំហានទី ២</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">៣-៥ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>រំឭកមេរៀនចាស់៖</strong> ${p.steps.step2}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #059669;">ជំហានទី ៣</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">៣៥-៦៥ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>មេរៀនថ្មី៖</strong> ${p.steps.step3}</td>
                  </tr>
                  <tr style="background: #fbfbfe;">
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #d97706;">ជំហានទី ៤</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">៥-៨ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>ពង្រឹងចំណេះដឹង៖</strong> ${p.steps.step4}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; font-weight: 700; color: #b45309;">ជំហានទី ៥</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px; text-align: center; font-weight: 600;">២-៣ នាទី</td>
                    <td style="border: 1px solid #64748b; padding: 5px 6px;"><strong>បណ្តាំផ្ញើ & កិច្ចការផ្ទះ៖</strong> ${p.steps.step5}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- V. Signatures -->
            <div style="margin-top: 12px; padding-top: 6px;">
              <div style="text-align: right; font-size: 10.5px; font-weight: 700; color: #334155; margin-bottom: 6px;">
                រាជធានីភ្នំពេញ, ${p.date_khmer}
              </div>
              <table style="width: 100%; border: none !important; border-collapse: collapse; font-size: 10.5px; text-align: center;">
                <tr style="border: none !important;">
                  <td style="border: none !important; width: 33%; vertical-align: top;">
                    <div style="font-weight: 800; color: #0f172a;">បានឃើញ និងពិនិត្យ</div>
                    <div style="color: #64748b; font-size: 9.5px; font-weight: 700;">ប្រធានក្រុមបច្ចេកទេស</div>
                    <div style="height: 44px;"></div>
                    <div style="color: #94a3b8; font-size: 9.5px;">[ ហត្ថលេខា ]</div>
                  </td>
                  <td style="border: none !important; width: 34%; vertical-align: top;">
                    <div style="font-weight: 800; color: #0f172a;">បានឃើញ និងឯកភាព</div>
                    <div style="color: #64748b; font-size: 9.5px; font-weight: 700;">នាយករងទទួលបន្ទុក NGS</div>
                    <div style="height: 44px;"></div>
                    <div style="color: #94a3b8; font-size: 9.5px;">[ ហត្ថលេខា ]</div>
                  </td>
                  <td style="border: none !important; width: 33%; vertical-align: top;">
                    <div style="font-weight: 800; color: #0f172a;">គ្រូបង្រៀនគណិតវិទ្យា</div>
                    <div style="color: #4338ca; font-size: 9.5px; font-weight: 700;">វិទ្យាល័យព្រះយុគន្ធរ NGS</div>
                    <div style="height: 44px;"></div>
                    <div style="font-weight: 800; color: #4338ca; font-size: 11px;">${teacherTitle} ${p.teacher}</div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        `;
      }).join('');
    }

    printPlans(plans, title) {
      if (!plans || plans.length === 0) return;
      const printArea = document.getElementById('printableLessonPlansArea');
      if (!printArea) {
        console.error('Printable area element #printableLessonPlansArea not found!');
        return;
      }

      printArea.innerHTML = this.generatePrintableHtml(plans);
      document.body.classList.add('printing-lesson-plans');

      const cleanup = () => {
        document.body.classList.remove('printing-lesson-plans');
        printArea.innerHTML = '';
        window.removeEventListener('afterprint', cleanup);
      };

      window.addEventListener('afterprint', cleanup);
      setTimeout(() => {
        window.print();
        setTimeout(cleanup, 2500);
      }, 100);
    }

    async downloadMergedPdf(plans, filename) {
      if (!plans || plans.length === 0) return;
      if (typeof PDFLib === 'undefined') {
        alert('PDFLib មិនទាន់ត្រូវបាន Load រួចរាល់ឡើយ។ សូមប្រើមុខងារ Print / Save as PDF ជំនួសវិញ!');
        this.printPlans(plans, filename);
        return;
      }

      const progressToast = (msg, type = 'info') => {
        if (window.showToast) window.showToast(msg, type);
      };

      progressToast(`កំពុងបញ្ចូលឯកសារ PDF ចំនួន ${toKhmerNum(plans.length)} កិច្ចតែងការ...`);

      try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        let successfulCount = 0;

        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          try {
            const res = await fetch(plan.pdf_file);
            if (!res.ok) {
              console.warn(`Could not load ${plan.pdf_file} (${res.status})`);
              continue;
            }
            const pdfBytes = await res.arrayBuffer();
            const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });

            const pages = doc.getPages();
            if (pages.length > 0) {
              const page = pages[plan.cover_page_index || 0];
              const pageH = page.getHeight();
              const y_top = plan.box_y0 || 172.0;
              const box_h = 24.0;
              const y_bottom = pageH - y_top - box_h;

              // Date stamp
              const dateCanvas = document.createElement('canvas');
              dateCanvas.width = 900;
              dateCanvas.height = 70;
              const ctx = dateCanvas.getContext('2d');
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, dateCanvas.width, dateCanvas.height);
              ctx.fillStyle = '#000000';
              ctx.font = 'bold 36px "Khmer OS Siemreap", "Noto Sans Khmer", "Khmer OS", sans-serif';
              ctx.fillText(':   ' + plan.date_khmer, 10, 50);

              const datePngUrl = dateCanvas.toDataURL('image/png');
              const datePngBytes = await fetch(datePngUrl).then(r => r.arrayBuffer());
              const dateImg = await doc.embedPng(datePngBytes);

              page.drawRectangle({
                x: 130.92,
                y: y_bottom,
                width: 320,
                height: box_h,
                color: PDFLib.rgb(1, 1, 1),
              });
              page.drawImage(dateImg, {
                x: 130.92,
                y: y_bottom,
                width: 286.0,
                height: box_h,
              });

              // Class stamp
              if (plan.class_name) {
                const classCanvas = document.createElement('canvas');
                classCanvas.width = 400;
                classCanvas.height = 80;
                const cctx = classCanvas.getContext('2d');
                cctx.fillStyle = '#ffffff';
                cctx.fillRect(0, 0, classCanvas.width, classCanvas.height);
                cctx.fillStyle = '#000000';
                cctx.font = 'bold 34px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
                cctx.fillText(':   ' + plan.class_name, 10, 55);

                const classPngUrl = classCanvas.toDataURL('image/png');
                const classPngBytes = await fetch(classPngUrl).then(r => r.arrayBuffer());
                const classImg = await doc.embedPng(classPngBytes);

                const class_y_top = plan.class_y0 || 77.9;
                const class_y_bottom = pageH - class_y_top - 18.0;

                page.drawRectangle({
                  x: 226,
                  y: class_y_bottom,
                  width: 120,
                  height: 18.0,
                  color: PDFLib.rgb(1, 1, 1),
                });
                page.drawImage(classImg, {
                  x: 226,
                  y: class_y_bottom,
                  width: 100.0,
                  height: 18.0,
                });
              }
            }

            const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
            copiedPages.forEach(p => mergedPdf.addPage(p));
            successfulCount++;
          } catch (docErr) {
            console.warn(`Error processing ${plan.pdf_file}:`, docErr);
          }
        }

        if (successfulCount === 0) {
          progressToast('មិនអាចទាញយក PDF ដើមបានទេ។ កំពុងបើកមុខងារ Print / Save as PDF ជំនួសវិញ...', 'warning');
          this.printPlans(plans, filename);
          return;
        }

        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        progressToast(`ទាញយកបានជោគជ័យចំនួន ${toKhmerNum(successfulCount)} កិច្ចតែងការ! 🎉`, 'success');
      } catch (err) {
        console.error('Merged PDF generation error:', err);
        progressToast('មានបញ្ហាក្នុងការ Save PDF បញ្ចូលគ្នា។ កំពុងបើកមុខងារ Print ជំនួសវិញ...', 'warning');
        this.printPlans(plans, filename);
      }
    }

    renderPrintHubModal() {
      const modal = document.getElementById('printLessonPlansModal');
      if (!modal) return;

      const currentGrade = this.selectedGrade || 'ថ្នាក់ទី ៨';
      const isGrade8 = currentGrade === 'ថ្នាក់ទី ៨';
      const unitLabel = isGrade8 ? 'មេរៀន' : 'ជំពូក';
      const chapters = this.getGradeChapters();
      const allGradePlans = this.plans.filter(p => p.grade === currentGrade);

      const singleChapter = chapters.find(c => c.code === this.printHubSelectedSingleChapter) || chapters[0];
      const singlePlans = singleChapter ? singleChapter.plans : [];

      const selectedMultiChapters = chapters.filter(c => this.printHubSelectedChapters.has(c.code));
      const multiPlansCount = selectedMultiChapters.reduce((acc, c) => acc + c.count, 0);

      const activeTab = this.printHubActiveTab;

      const container = document.getElementById('printHubModalContent');
      if (!container) return;

      container.innerHTML = `
        <!-- Tabs Navigation -->
        <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <button onclick="window.lessonPlansManager.setPrintHubTab('single')"
            class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'single'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100'
            }">
            <span>📘 ម្តង ១ ${unitLabel}</span>
          </button>

          <button onclick="window.lessonPlansManager.setPrintHubTab('multiple')"
            class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'multiple'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100'
            }">
            <span>📑 លើសពី ១ ${unitLabel}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'multiple' ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-600'}">
              ${toKhmerNum(selectedMultiChapters.length)}
            </span>
          </button>

          <button onclick="window.lessonPlansManager.setPrintHubTab('grade')"
            class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'grade'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100'
            }">
            <span>🎓 ១ កម្រិតថ្នាក់ទាំងមូល</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'grade' ? 'bg-white/30 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'}">
              ${toKhmerNum(allGradePlans.length)}
            </span>
          </button>
        </div>

        <!-- Tab 1: Single Lesson -->
        ${activeTab === 'single' ? `
          <div class="space-y-4 pt-1 animate-in fade-in duration-200">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ជ្រើសរើស${unitLabel}ដែលត្រូវបោះពុម្ព ឬ Save PDF ៖
              </label>
              <select onchange="window.lessonPlansManager.onPrintHubSingleChapterChange(this.value)"
                class="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
                ${chapters.map(c => `
                  <option value="${c.code}" ${singleChapter && singleChapter.code === c.code ? 'selected' : ''}>
                    ${c.title} (${toKhmerNum(c.count)} ម៉ោងបង្រៀន)
                  </option>
                `).join('')}
              </select>
            </div>

            ${singleChapter ? `
              <!-- Preview Card -->
              <div class="card-soft p-4 bg-purple-50/70 dark:bg-slate-700/60 border border-purple-200 dark:border-slate-600 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                      ${currentGrade}
                    </span>
                    <h4 class="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                      ${singleChapter.title}
                    </h4>
                  </div>
                  <div class="text-right">
                    <span class="text-xl font-black text-purple-700 dark:text-purple-300">${toKhmerNum(singlePlans.length)}</span>
                    <span class="text-[11px] text-slate-500 block">កិច្ចតែងការ / ម៉ោង</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-purple-200/60 dark:border-slate-600">
                  <div>
                    <span class="text-slate-500 text-[11px] block">ថ្នាក់បង្រៀន៖</span>
                    <strong class="text-purple-700 dark:text-purple-300">${singlePlans[0]?.class_name || this.savedClass}</strong>
                  </div>
                  <div>
                    <span class="text-slate-500 text-[11px] block">គ្រូបង្រៀន៖</span>
                    <strong class="text-slate-800 dark:text-slate-200">${singlePlans[0]?.teacher || this.savedTeacher}</strong>
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <span class="text-slate-500 text-[11px] block">កាលបរិច្ឆេទដំបូង៖</span>
                    <strong class="text-slate-800 dark:text-slate-200">${singlePlans[0]?.date_khmer || 'តាមកាលវិភាគ'}</strong>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button onclick="window.lessonPlansManager.executePrint('single')"
                  class="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition">
                  <i class="fa-solid fa-print text-sm"></i>
                  <span>បោះពុម្ព${unitLabel}នេះ (${toKhmerNum(singlePlans.length)} ម៉ោង)</span>
                </button>
                <button onclick="window.lessonPlansManager.executeMergedPdf('single')"
                  class="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition">
                  <i class="fa-solid fa-file-arrow-down text-sm"></i>
                  <span>ទាញយក PDF បញ្ចូលគ្នា (Merged PDF)</span>
                </button>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Tab 2: Multiple Lessons -->
        ${activeTab === 'multiple' ? `
          <div class="space-y-4 pt-1 animate-in fade-in duration-200">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
                ជ្រើសរើស${unitLabel}ដែលចង់បញ្ចូលគ្នា ៖
              </span>
              <div class="flex items-center gap-2">
                <button onclick="window.lessonPlansManager.selectAllPrintHubChapters()"
                  class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-slate-700 text-purple-700 dark:text-purple-300 hover:bg-purple-200 font-bold text-[11px] transition">
                  ✓ ជ្រើសរើសទាំងអស់
                </button>
                <button onclick="window.lessonPlansManager.deselectAllPrintHubChapters()"
                  class="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 font-bold text-[11px] transition">
                  ✗ ដោះការជ្រើសរើស
                </button>
              </div>
            </div>

            <!-- Chapters Checkbox Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[42vh] overflow-y-auto pr-1">
              ${chapters.map(c => {
                const isChecked = this.printHubSelectedChapters.has(c.code);
                return `
                  <div onclick="window.lessonPlansManager.togglePrintHubChapter('${c.code}')"
                    class="p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-2.5 ${
                      isChecked
                        ? 'bg-purple-50/90 dark:bg-purple-900/30 border-purple-400 dark:border-purple-600 shadow-sm'
                        : 'bg-white dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }">
                    <div class="flex items-center gap-3">
                      <div class="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-purple-600 text-white' : 'border border-slate-300 dark:border-slate-500 text-transparent'
                      }">
                        ✓
                      </div>
                      <div>
                        <div class="font-extrabold text-xs text-slate-800 dark:text-white">
                          ${c.title}
                        </div>
                        <div class="text-[10px] text-slate-500 dark:text-slate-400">
                          ${toKhmerNum(c.count)} ម៉ោងបង្រៀន
                        </div>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isChecked ? 'bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200' : 'bg-slate-100 text-slate-400'}">
                      ${toKhmerNum(c.count)} ម៉ោង
                    </span>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Selection Summary & Actions -->
            <div class="p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-700/60 border border-indigo-200 dark:border-slate-600 flex items-center justify-between text-xs">
              <span>សរុបបានជ្រើសរើស៖ <strong class="text-indigo-700 dark:text-indigo-300 font-extrabold">${toKhmerNum(selectedMultiChapters.length)}</strong> ${unitLabel}</span>
              <span class="font-black text-indigo-700 dark:text-indigo-300 text-sm">${toKhmerNum(multiPlansCount)} ម៉ោងបង្រៀន</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button onclick="window.lessonPlansManager.executePrint('multiple')"
                class="py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
                ${multiPlansCount === 0 ? 'disabled opacity-50' : ''}>
                <i class="fa-solid fa-print text-sm"></i>
                <span>បោះពុម្ពមេរៀនដែលបានជ្រើស (${toKhmerNum(multiPlansCount)} ម៉ោង)</span>
              </button>
              <button onclick="window.lessonPlansManager.executeMergedPdf('multiple')"
                class="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition"
                ${multiPlansCount === 0 ? 'disabled opacity-50' : ''}>
                <i class="fa-solid fa-file-arrow-down text-sm"></i>
                <span>ទាញយក PDF បញ្ចូលគ្នា (${toKhmerNum(multiPlansCount)} ម៉ោង)</span>
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Full Grade Level -->
        ${activeTab === 'grade' ? `
          <div class="space-y-4 pt-1 animate-in fade-in duration-200">
            <!-- Full Grade Hero Card -->
            <div class="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white shadow-lg space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black uppercase tracking-wider text-emerald-200">
                  កញ្ចប់កិច្ចតែងការពេញលេញប្រចាំឆ្នាំ
                </span>
                <span class="text-2xl font-black text-amber-300">
                  ${toKhmerNum(allGradePlans.length)} ម៉ោង
                </span>
              </div>
              <h3 class="text-lg md:text-xl font-extrabold">
                កិច្ចតែងការបង្រៀនគណិតវិទ្យា${currentGrade} ទាំងមូល
              </h3>
              <p class="text-xs text-emerald-100 leading-relaxed">
                រួមបញ្ចូលគ្រប់មេរៀនទាំង <strong>${toKhmerNum(chapters.length)} ${unitLabel}</strong> (សរុប <strong>${toKhmerNum(allGradePlans.length)} ម៉ោងបង្រៀន</strong>) តាមស្តង់ដារ ៥ ជំហាន NGS ដោយ <strong>${this.savedTeacher.includes('សុភារី') ? 'អ្នកគ្រូ ថោង សុភារី' : 'លោកគ្រូ នួន បូណង'}</strong> សម្រាប់ថ្នាក់ <strong>${this.savedClass}</strong>។
              </p>
            </div>

            <!-- Grade Info Metrics -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div class="card-soft p-3 text-center bg-slate-50 dark:bg-slate-700/50">
                <span class="text-slate-400 text-[10px] block">ចំនួន${unitLabel}សរុប</span>
                <strong class="text-emerald-700 dark:text-emerald-300 text-base">${toKhmerNum(chapters.length)} ${unitLabel}</strong>
              </div>
              <div class="card-soft p-3 text-center bg-slate-50 dark:bg-slate-700/50">
                <span class="text-slate-400 text-[10px] block">ចំនួនម៉ោងបង្រៀន</span>
                <strong class="text-purple-700 dark:text-purple-300 text-base">${toKhmerNum(allGradePlans.length)} ម៉ោង</strong>
              </div>
              <div class="card-soft p-3 text-center bg-slate-50 dark:bg-slate-700/50">
                <span class="text-slate-400 text-[10px] block">ថ្នាក់បង្រៀន</span>
                <strong class="text-slate-800 dark:text-slate-200 text-xs">${this.savedClass}</strong>
              </div>
              <div class="card-soft p-3 text-center bg-slate-50 dark:bg-slate-700/50">
                <span class="text-slate-400 text-[10px] block">គ្រូបង្រៀន</span>
                <strong class="text-slate-800 dark:text-slate-200 text-xs">${this.savedTeacher}</strong>
              </div>
            </div>

            <!-- Big Action Buttons -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button onclick="window.lessonPlansManager.executePrint('grade')"
                class="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition">
                <i class="fa-solid fa-print text-sm"></i>
                <span>បោះពុម្ព${currentGrade} ទាំងមូល (${toKhmerNum(allGradePlans.length)} ម៉ោង)</span>
              </button>
              <button onclick="window.lessonPlansManager.executeMergedPdf('grade')"
                class="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition">
                <i class="fa-solid fa-file-arrow-down text-sm"></i>
                <span>ទាញយក PDF ${currentGrade} ទាំងមូល (Merged All)</span>
              </button>
            </div>
          </div>
        ` : ''}
      `;
    }
  }"""

# Normalize line endings
code_norm = code.replace('\r\n', '\n')
end_target_norm = end_target.replace('\r\n', '\n')
new_methods_code_norm = new_methods_code.replace('\r\n', '\n')

if end_target_norm in code_norm:
    code_norm = code_norm.replace(end_target_norm, new_methods_code_norm, 1)
    print("5. New Print Hub methods appended successfully.")
else:
    print("WARNING: end_target not found in code_norm!")

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(code_norm)

print("Done updating js/lesson-plans.js!")

