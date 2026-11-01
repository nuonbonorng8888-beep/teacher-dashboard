/**
 * teaching-slides.js
 * Interactive Teaching Slides Presentation & PowerPoint Manager
 * Preah Yukunthor High School • New Generation School (NGS)
 * Teacher: Nuon Bonorng
 */

(function () {
  'use strict';

  class TeachingSlidesManager {
    constructor() {
      this.lessons = window.NGS_TEACHING_SLIDES_DATA || [];
      this.activeChapter = 'all';
      this.searchQuery = '';
      this.currentLesson = null;
      this.currentSlideIndex = 0;
      this.selectedMcqChoices = {}; // key: `lessonId_mcqIndex` -> choiceIndex
      this.revealedMcqs = {};        // key: `lessonId_mcqIndex` -> boolean
      this.keyboardBound = false;
    }

    init() {
      this.bindGlobalKeyboard();
      this.render();
    }

    bindGlobalKeyboard() {
      if (this.keyboardBound) return;
      this.keyboardBound = true;
      window.addEventListener('keydown', (e) => {
        const modal = document.getElementById('slidePresenterModal');
        if (!modal || modal.classList.contains('hidden')) return;

        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          this.nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.prevSlide();
        } else if (e.key === 'Escape') {
          this.closePresenter();
        } else if (e.key === 'f' || e.key === 'F') {
          this.toggleFullScreen();
        }
      });
    }

    filterByChapter(ch) {
      this.activeChapter = ch;
      this.render();
    }

    setSearch(query) {
      this.searchQuery = (query || '').toLowerCase().trim();
      this.render();
    }

    getFilteredLessons() {
      return this.lessons.filter(l => {
        const matchCh = (this.activeChapter === 'all' || l.chapter_num === parseInt(this.activeChapter, 10));
        if (!matchCh) return false;
        if (!this.searchQuery) return true;
        const target = `${l.chapter_title} ${l.lesson_title} ${l.subtitle}`.toLowerCase();
        return target.includes(this.searchQuery);
      });
    }

    render() {
      const root = document.getElementById('teachingSlidesRoot');
      if (!root) return;

      const filtered = this.getFilteredLessons();
      const totalSlidesCount = this.lessons.length * 13;

      root.innerHTML = `
        <!-- Header Banner -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-10 -top-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <img src="images/yukunthor-logo.jpg" alt="Preah Yukunthor Logo" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-amber-400/80 shadow-md bg-white p-1 object-contain flex-shrink-0">
              <div>
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 font-battambang">NGS Official Slides</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-900/80 text-indigo-200 border border-indigo-700/60">ថ្នាក់ទី ១២ • គណិតវិទ្យា</span>
                </div>
                <h1 class="text-xl sm:text-2xl font-black font-suwannaphum tracking-wide text-white">ស្លាយបង្រៀនគណិតវិទ្យា NGS ថ្នាក់ទី ១២</h1>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី • បង្រៀនដោយលោកគ្រូ <strong>នួន បូណង</strong></p>
              </div>
            </div>

            <!-- Stats Pills -->
            <div class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
              <div class="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-center flex-1 sm:flex-none">
                <div class="text-lg font-black text-amber-400">${this.lessons.length}</div>
                <div class="text-[10px] text-slate-300 font-bold">មេរៀនពេញលេញ</div>
              </div>
              <div class="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-center flex-1 sm:flex-none">
                <div class="text-lg font-black text-emerald-400">${totalSlidesCount}</div>
                <div class="text-[10px] text-slate-300 font-bold">ស្លាយសរុប (16:9)</div>
              </div>
              <div class="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-center flex-1 sm:flex-none">
                <div class="text-lg font-black text-cyan-400">${this.lessons.length * 3}</div>
                <div class="text-[10px] text-slate-300 font-bold">MCQ អន្តរកម្ម</div>
              </div>
              <div class="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-center flex-1 sm:flex-none">
                <div class="text-lg font-black text-purple-300">${this.lessons.length * 3}</div>
                <div class="text-[10px] text-slate-300 font-bold">សន្លឹកកិច្ចការក្រុម</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button onclick="window.teachingSlidesManager.filterByChapter('all')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${this.activeChapter === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
              ទាំងអស់ (${this.lessons.length})
            </button>
            <button onclick="window.teachingSlidesManager.filterByChapter(1)"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${this.activeChapter === 1 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
              ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច (3)
            </button>
            <button onclick="window.teachingSlidesManager.filterByChapter(2)"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${this.activeChapter === 2 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
              ជំពូកទី ២ ៖ លីមីតនៃអនុគមន៍ (2)
            </button>
            <button onclick="window.teachingSlidesManager.filterByChapter(3)"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${this.activeChapter === 3 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
              ជំពូកទី ៣ ៖ ដេរីវេនៃអនុគមន៍ (2)
            </button>
          </div>

          <div class="relative sm:w-64">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input type="text" placeholder="ស្វែងរកមេរៀន ឬរូបមន្ត..." value="${this.searchQuery}"
              oninput="window.teachingSlidesManager.setSearch(this.value)"
              class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500">
          </div>
        </div>

        <!-- Lesson Slides Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          ${filtered.map(l => this.renderLessonCard(l)).join('')}
        </div>

        ${filtered.length === 0 ? `
          <div class="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <i class="fa-solid fa-folder-open text-4xl text-slate-300 mb-3"></i>
            <p class="text-sm font-bold text-slate-600 dark:text-slate-400">មិនមានមេរៀនដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ</p>
          </div>
        ` : ''}

        <!-- Presenter Modal Container -->
        <div id="slidePresenterModal" class="hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4">
          <!-- Dynamically filled when opened -->
        </div>

        <!-- Student Worksheet Modal Container -->
        <div id="slideWorksheetModal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <!-- Dynamically filled when opened -->
        </div>
      `;
    }

    renderLessonCard(lesson) {
      const chColor = lesson.chapter_num === 1 ? 'indigo' : (lesson.chapter_num === 2 ? 'cyan' : 'emerald');
      const pptxPath = `slides/${encodeURIComponent(lesson.filename)}`;

      return `
        <div class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <!-- Top Card Banner -->
          <div class="p-5 pb-4 border-b border-slate-100 dark:border-slate-700/60">
            <div class="flex items-start justify-between gap-3 mb-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-${chColor}-50 dark:bg-${chColor}-900/40 text-${chColor}-700 dark:text-${chColor}-300 border border-${chColor}-200 dark:border-${chColor}-800">
                <i class="fa-solid fa-bookmark"></i> ${lesson.chapter_title}
              </span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                ⏱️ ${lesson.duration}
              </span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-suwannaphum leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
              ${lesson.lesson_title}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              ${lesson.subtitle}
            </p>

            <!-- Feature Pills -->
            <div class="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold">
              <span class="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/60">
                🎯 វត្ថុបំណង ៣
              </span>
              <span class="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60">
                💡 លំហាត់គំរូ ${lesson.examples.length}
              </span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                ❓ MCQ ${lesson.mcqs.length} សំណួរ
              </span>
              <span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60">
                👥 សន្លឹកកិច្ចការ ៣ ក្រុម
              </span>
              <span class="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200/60">
                📊 សេចក្តីសង្ខេប
              </span>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="p-4 bg-slate-50/70 dark:bg-slate-800/80 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-700/60">
            <!-- Left: Present Slides Button -->
            <button onclick="window.teachingSlidesManager.openPresenter('${lesson.id}')"
              class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center gap-2 transition">
              <i class="fa-solid fa-play"></i> ចាក់ស្លាយបង្រៀន (Present)
            </button>

            <!-- Right Buttons: Download PPTX & Worksheet -->
            <div class="flex items-center gap-1.5">
              <a href="${pptxPath}" download="${lesson.filename}"
                class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                title="ទាញយកឯកសារ Microsoft PowerPoint (.pptx)">
                <i class="fa-solid fa-file-powerpoint"></i> PPTX
              </a>
              <button onclick="window.teachingSlidesManager.openWorksheet('${lesson.id}')"
                class="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 active:scale-95 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
                title="មើល និងបោះពុម្ពសន្លឹកកិច្ចការសិស្ស">
                <i class="fa-solid fa-file-lines"></i> សន្លឹកកិច្ចការ
              </button>
            </div>
          </div>
        </div>
      `;
    }

    openPresenter(lessonId, slideIndex = 0) {
      const lesson = this.lessons.find(l => l.id === lessonId);
      if (!lesson) return;

      this.currentLesson = lesson;
      this.currentSlideIndex = slideIndex;

      const modal = document.getElementById('slidePresenterModal');
      if (!modal) return;

      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      this.renderPresenterStage();
    }

    closePresenter() {
      const modal = document.getElementById('slidePresenterModal');
      if (modal) {
        modal.classList.add('hidden');
      }
      document.body.classList.remove('overflow-hidden');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }

    toggleFullScreen() {
      const stage = document.getElementById('slideStageContainer');
      if (!stage) return;
      if (!document.fullscreenElement) {
        stage.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    nextSlide() {
      if (!this.currentLesson) return;
      const total = 13;
      if (this.currentSlideIndex < total - 1) {
        this.currentSlideIndex++;
        this.renderPresenterStage();
      }
    }

    prevSlide() {
      if (!this.currentLesson) return;
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
        this.renderPresenterStage();
      }
    }

    goToSlide(idx) {
      if (!this.currentLesson) return;
      if (idx >= 0 && idx < 13) {
        this.currentSlideIndex = idx;
        this.renderPresenterStage();
      }
    }

    selectMcqChoice(mcqKey, choiceIdx) {
      this.selectedMcqChoices[mcqKey] = choiceIdx;
      this.renderPresenterStage();
    }

    revealMcqAnswer(mcqKey) {
      this.revealedMcqs[mcqKey] = true;
      this.renderPresenterStage();
    }

    renderPresenterStage() {
      const modal = document.getElementById('slidePresenterModal');
      if (!modal || !this.currentLesson) return;

      const l = this.currentLesson;
      const idx = this.currentSlideIndex;
      const total = 13;
      const pptxPath = `slides/${encodeURIComponent(l.filename)}`;

      modal.innerHTML = `
        <div id="slideStageContainer" class="w-full max-w-6xl h-full max-h-[92vh] flex flex-col bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/80">
          <!-- Presenter Top Bar -->
          <div class="px-4 py-2.5 bg-slate-950 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
            <div class="flex items-center gap-3">
              <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-7 h-7 rounded-lg border border-amber-400 object-contain bg-white">
              <span class="font-bold text-white font-suwannaphum truncate max-w-xs sm:max-w-md">
                ${l.chapter_title} • ${l.lesson_title}
              </span>
            </div>

            <!-- Center Slide Indicator -->
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-bold border border-slate-700">
                ស្លាយទី ${idx + 1} / ${total}
              </span>
            </div>

            <!-- Right Controls -->
            <div class="flex items-center gap-2">
              <a href="${pptxPath}" download="${l.filename}" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5" title="ទាញយក PowerPoint (.pptx)">
                <i class="fa-solid fa-download"></i> PPTX
              </a>
              <button onclick="window.teachingSlidesManager.toggleFullScreen()" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition" title="ពេញអេក្រង់ (F)">
                <i class="fa-solid fa-expand"></i>
              </button>
              <button onclick="window.teachingSlidesManager.closePresenter()" class="p-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-700 text-rose-200 hover:text-white transition" title="បិទ (Esc)">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Slide Content Area (16:9 canvas) -->
          <div class="flex-1 bg-white dark:bg-slate-900 overflow-y-auto relative p-6 sm:p-8 flex flex-col justify-between">
            ${this.renderSlideContent(l, idx)}
          </div>

          <!-- Presenter Bottom Navigation Bar -->
          <div class="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
            <!-- Prev Button -->
            <button onclick="window.teachingSlidesManager.prevSlide()" ${idx === 0 ? 'disabled' : ''}
              class="px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${idx === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95'}">
              <i class="fa-solid fa-chevron-left"></i> ថយក្រោយ
            </button>

            <!-- Slide Dots / Thumbnails -->
            <div class="flex items-center gap-1 overflow-x-auto max-w-md py-1 scrollbar-none">
              ${Array.from({ length: total }).map((_, i) => `
                <button onclick="window.teachingSlidesManager.goToSlide(${i})"
                  class="w-6 h-6 rounded-lg text-[10px] font-bold transition ${i === idx ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}">
                  ${i + 1}
                </button>
              `).join('')}
            </div>

            <!-- Next Button -->
            <button onclick="window.teachingSlidesManager.nextSlide()" ${idx === total - 1 ? 'disabled' : ''}
              class="px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${idx === total - 1 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95'}">
              បន្ទាប់ <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      `;
    }

    renderSlideContent(lesson, slideIdx) {
      // 0: Cover
      // 1: Objectives
      // 2: Recall
      // 3: Concept 1
      // 4: Example 1
      // 5: Concept 2
      // 6: Example 2
      // 7: MCQ 1
      // 8: MCQ 2
      // 9: MCQ 3
      // 10: Worksheet
      // 11: Summary
      // 12: Homework & Closing

      switch (slideIdx) {
        case 0:
          return this.slideCover(lesson);
        case 1:
          return this.slideObjectives(lesson);
        case 2:
          return this.slideRecall(lesson);
        case 3:
          return this.slideConcept(lesson, 0);
        case 4:
          return this.slideExample(lesson, 0);
        case 5:
          return this.slideConcept(lesson, 1);
        case 6:
          return this.slideExample(lesson, 1);
        case 7:
          return this.slideMcq(lesson, 0);
        case 8:
          return this.slideMcq(lesson, 1);
        case 9:
          return this.slideMcq(lesson, 2);
        case 10:
          return this.slideWorksheet(lesson);
        case 11:
          return this.slideSummary(lesson);
        case 12:
          return this.slideHomework(lesson);
        default:
          return `<div class="p-8 text-center text-slate-400">ស្លាយមិនមានទិន្នន័យ</div>`;
      }
    }

    slideCover(lesson) {
      return `
        <div class="h-full flex flex-col justify-between py-2">
          <!-- Top Row -->
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div class="flex items-center gap-3">
              <img src="images/yukunthor-logo.jpg" alt="Logo" class="w-12 h-12 rounded-xl border border-amber-400 bg-white p-0.5 object-contain">
              <div>
                <div class="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                <div class="text-xs font-black text-slate-800 dark:text-slate-200">វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី (NGS)</div>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
              គណិតវិទ្យា ថ្នាក់ទី ១២
            </span>
          </div>

          <!-- Middle Split: Profile on Left, Big Title on Right -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-center">
            <!-- Left Profile Card -->
            <div class="md:col-span-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/60 p-4 rounded-2xl border-2 border-amber-400/60 shadow-lg text-center flex flex-col items-center">
              <img src="images/teacher-profile.jpg" alt="Teacher Profile" class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-white dark:border-slate-700 shadow-md object-cover mb-3">
              <h4 class="text-base font-black text-slate-900 dark:text-white font-suwannaphum">លោកគ្រូ នួន បូណង</h4>
              <p class="text-xs text-purple-700 dark:text-purple-300 font-bold mt-0.5">គ្រូបង្រៀនគណិតវិទ្យា ថ្នាក់ទី ១២</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">វិទ្យាល័យព្រះយុគន្ធរ • NGS</p>
            </div>

            <!-- Right Title Card -->
            <div class="md:col-span-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-8 rounded-2xl text-white shadow-xl border border-indigo-700/60">
              <div class="inline-block px-3 py-1 rounded-lg text-xs font-black bg-amber-400 text-slate-950 mb-3 font-battambang">
                ${lesson.chapter_title}
              </div>
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black font-suwannaphum leading-tight text-white mb-3">
                ${lesson.lesson_title}
              </h2>
              <p class="text-sm text-indigo-200 leading-relaxed">
                ${lesson.subtitle}
              </p>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>✨ ឯកសារស្លាយបង្រៀនស្ដង់ដារ NGS • ឆ្នាំសិក្សា ២០២៦-២០២៧</span>
            <span>⏱️ រយៈពេល៖ ${lesson.duration}</span>
          </div>
        </div>
      `;
    }

    slideObjectives(lesson) {
      const obj = lesson.objectives;
      return `
        <div class="h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
              <i class="fa-solid fa-bullseye"></i> គោលបំណងនៃការរៀន
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-suwannaphum">
              វត្ថុបំណងនៃមេរៀន (Lesson Objectives)
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">បន្ទាប់ពីសិក្សាមេរៀននេះចប់ សិស្សានុសិស្សនឹងទទួលបានសមត្ថភាពសំខាន់ៗ ៣ យ៉ាង៖</p>
          </div>

          <!-- 3 Objective Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
            <!-- Knowledge Card -->
            <div class="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl p-5 border-2 border-emerald-500/80 shadow-sm flex flex-col">
              <div class="flex items-center gap-2.5 pb-2.5 mb-3 border-b border-emerald-200 dark:border-emerald-800">
                <span class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">១</span>
                <h3 class="text-sm font-bold text-emerald-900 dark:text-emerald-200 font-suwannaphum">ចំណេះដឹង (Knowledge)</h3>
              </div>
              <ul class="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                ${obj.knowledge.map(k => `<li>• ${k}</li>`).join('')}
              </ul>
            </div>

            <!-- Skills Card -->
            <div class="bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl p-5 border-2 border-blue-500/80 shadow-sm flex flex-col">
              <div class="flex items-center gap-2.5 pb-2.5 mb-3 border-b border-blue-200 dark:border-blue-800">
                <span class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">២</span>
                <h3 class="text-sm font-bold text-blue-900 dark:text-blue-200 font-suwannaphum">បំណិន (Skills)</h3>
              </div>
              <ul class="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                ${obj.skills.map(s => `<li>• ${s}</li>`).join('')}
              </ul>
            </div>

            <!-- Attitude Card -->
            <div class="bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl p-5 border-2 border-rose-500/80 shadow-sm flex flex-col">
              <div class="flex items-center gap-2.5 pb-2.5 mb-3 border-b border-rose-200 dark:border-rose-800">
                <span class="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm">៣</span>
                <h3 class="text-sm font-bold text-rose-900 dark:text-rose-200 font-suwannaphum">ឥរិយាបថ (Attitude)</h3>
              </div>
              <ul class="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                ${obj.attitude.map(a => `<li>• ${a}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 font-bold flex items-center gap-2">
            <i class="fa-solid fa-lightbulb text-amber-500"></i>
            <span>គោលដៅចម្បង៖ សិស្សយល់ច្បាស់ពីទ្រឹស្តី អនុវត្តលំហាត់គំរូ និងសហការដោះស្រាយលំហាត់ជាក្រុមប្រកបដោយទំនុកចិត្ត។</span>
          </div>
        </div>
      `;
    }

    slideRecall(lesson) {
      const cards = lesson.recall.cards;
      return `
        <div class="h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
              <i class="fa-solid fa-rotate-left"></i> មូលដ្ឋានគ្រឹះ
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-suwannaphum">
              រំឭកមេរៀនចាស់ & គំនិតគ្រឹះ (Prerequisite Review)
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
            ${cards.map(c => `
              <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white font-suwannaphum pb-2 mb-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <i class="fa-solid fa-check-circle text-amber-500"></i> ${c.title}
                </h4>
                <ul class="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
                  ${c.lines.map(l => `<li>${l}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>

          <div class="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-bold">
            💡 គន្លឹះ៖ ការក្តាប់ចំណុចគ្រឹះទាំងនេះបានរឹងមាំ នឹងជួយឱ្យអ្នកយល់មេរៀនថ្មីបានយ៉ាងរហ័ស និងមិនមានការភ័ន្តច្រឡំឡើយ។
          </div>
        </div>
      `;
    }

    slideConcept(lesson, cIdx) {
      const c = lesson.concepts[cIdx] || lesson.concepts[0];
      return `
        <div class="h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
              <i class="fa-solid fa-book-open"></i> ${c.part}
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-suwannaphum">
              ${c.title}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch">
            <!-- Theory Points (Left) -->
            <div class="lg:col-span-7 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
              <ul class="space-y-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                ${c.points.map(p => `
                  <li class="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                    ${p}
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Formula Highlight Box (Right) -->
            <div class="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl border-2 border-indigo-500 shadow-xl flex flex-col justify-between">
              <div class="pb-2 border-b border-indigo-700/80 mb-3 flex items-center justify-between">
                <span class="text-xs font-black text-amber-400 uppercase tracking-wider">📌 រូបមន្តគន្លឹះសំខាន់</span>
                <i class="fa-solid fa-star text-amber-400"></i>
              </div>
              <div class="space-y-3 my-auto">
                ${c.formulas.map(f => `
                  <div class="p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-center font-mono text-sm sm:text-base font-bold text-amber-300">
                    ${f}
                  </div>
                `).join('')}
              </div>
              <div class="pt-2 text-[11px] text-indigo-300 text-center">
                ទន្ទេញ និងអនុវត្តរូបមន្តទាំងនេះឱ្យបានស្ទាត់ជំនាញ
              </div>
            </div>
          </div>

          <div class="text-xs text-slate-500 flex items-center justify-between">
            <span>វិទ្យាល័យព្រះយុគន្ធរ NGS • លោកគ្រូ នួន បូណង</span>
            <span>ស្លាយពន្យល់ទ្រឹស្តី</span>
          </div>
        </div>
      `;
    }

    slideExample(lesson, exIdx) {
      const ex = lesson.examples[exIdx] || lesson.examples[0];
      return `
        <div class="h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <i class="fa-solid fa-laptop-code"></i> លំហាត់គំរូ
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-suwannaphum">
              ${ex.title}
            </h2>
          </div>

          <!-- Problem Statement Box -->
          <div class="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-xs sm:text-sm text-blue-950 dark:text-blue-100 font-bold whitespace-pre-line">
            ${ex.problem}
          </div>

          <!-- Solution & Tip Split -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto">
            <!-- Solution Steps (Left 8 cols) -->
            <div class="lg:col-span-8 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h4 class="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-suwannaphum pb-1 mb-2 border-b border-slate-100 dark:border-slate-700">
                ✍️ ដំណោះស្រាយលម្អិត៖
              </h4>
              <div class="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
                ${ex.solution_steps.map(s => `<div>${s}</div>`).join('')}
              </div>
            </div>

            <!-- Tips Card (Right 4 cols) -->
            <div class="lg:col-span-4 bg-amber-50/70 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-300 dark:border-amber-800 flex flex-col justify-between">
              <div>
                <h4 class="text-xs font-bold text-amber-900 dark:text-amber-200 font-suwannaphum pb-1 mb-2 border-b border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                  <i class="fa-solid fa-lightbulb text-amber-500"></i> គន្លឹះដោះស្រាយ
                </h4>
                <ul class="space-y-2 text-xs text-amber-900 dark:text-amber-300">
                  ${ex.tips.map(t => `<li>• ${t}</li>`).join('')}
                </ul>
              </div>
              <div class="mt-3 p-2 bg-amber-100/70 dark:bg-amber-900/50 rounded-lg text-[10px] text-amber-950 dark:text-amber-200 text-center font-bold">
                ⚠️ ចំណាំ៖ ពិនិត្យសញ្ញា និងលក្ខខណ្ឌមុនសន្និដ្ឋាន
              </div>
            </div>
          </div>

          <div class="text-xs text-slate-500 flex items-center justify-between">
            <span>អនុវត្តតាមជំហានដើម្បីទទួលបានពិន្ទុពេញលេញ</span>
            <span>ជំហានដោះស្រាយស្ដង់ដារ</span>
          </div>
        </div>
      `;
    }

    slideMcq(lesson, mcqIdx) {
      const mcq = lesson.mcqs[mcqIdx] || lesson.mcqs[0];
      const mcqKey = `${lesson.id}_${mcqIdx}`;
      const selectedIdx = this.selectedMcqChoices[mcqKey];
      const isRevealed = this.revealedMcqs[mcqKey] || (selectedIdx !== undefined);
      const isCorrect = selectedIdx === mcq.correct_index;

      return `
        <div class="h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
                <i class="fa-solid fa-circle-question"></i> ពង្រឹងការយល់ដឹង
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-800">
                MCQ ${mcqIdx + 1} នៃ ${lesson.mcqs.length}
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-suwannaphum">
              សំណួរពហុជ្រើសរើសទី ${mcqIdx + 1}
            </h2>
          </div>

          <!-- Question Card -->
          <div class="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border-2 border-purple-300 dark:border-purple-700 shadow-sm text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ❓ ${mcq.question}
          </div>

          <!-- 4 Choices Grid (2x2) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto">
            ${mcq.choices.map((c, i) => {
              const letter = ['(ក)', '(ខ)', '(គ)', '(ឃ)'][i];
              let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50/50';
              if (selectedIdx !== undefined) {
                if (i === mcq.correct_index) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-400';
                } else if (i === selectedIdx) {
                  btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-400';
                }
              }

              return `
                <button onclick="window.teachingSlidesManager.selectMcqChoice('${mcqKey}', ${i})"
                  class="p-4 rounded-xl border-2 text-left font-bold text-xs sm:text-sm flex items-center justify-between transition active:scale-98 shadow-sm ${btnStyle}">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-purple-700 dark:text-purple-300">
                      ${letter}
                    </span>
                    <span>${c}</span>
                  </div>
                  ${selectedIdx !== undefined && i === mcq.correct_index ? '<i class="fa-solid fa-check text-emerald-600 text-base"></i>' : ''}
                  ${selectedIdx === i && i !== mcq.correct_index ? '<i class="fa-solid fa-xmark text-rose-600 text-base"></i>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Answer & Explanation Reveal -->
          ${isRevealed ? `
            <div class="p-4 rounded-xl ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800' : 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800'} text-xs">
              <div class="font-bold flex items-center gap-2 mb-1 ${isCorrect ? 'text-emerald-800 dark:text-emerald-200' : 'text-purple-800 dark:text-purple-200'}">
                <i class="fa-solid fa-circle-check"></i>
                <span>ចម្លើយត្រឹមត្រូវគឺ៖ <strong>${['(ក)', '(ខ)', '(គ)', '(ឃ)'][mcq.correct_index]}  ${mcq.choices[mcq.correct_index]}</strong></span>
              </div>
              <div class="text-slate-600 dark:text-slate-400 font-mono">
                💡 ការពន្យល់៖ ${mcq.explanation}
              </div>
            </div>
          ` : `
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400">💡 ចុចលើជម្រើសចម្លើយដើម្បីផ្ទៀងផ្ទាត់ ឬចុចប៊ូតុងបង្ហាញចម្លើយ</span>
              <button onclick="window.teachingSlidesManager.revealMcqAnswer('${mcqKey}')"
                class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-purple-700 dark:text-purple-300 font-bold text-xs transition">
                👁️ បង្ហាញចម្លើយ
              </button>
            </div>
          `}
        </div>
      `;
    }

    slideWorksheet(lesson) {
      const ws = lesson.worksheet;
      return `
        <div class="h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                <i class="fa-solid fa-users"></i> ការអនុវត្តជាក់ស្តែង
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-800">
                ⏱️ ១០ នាទី • ១០ ពិន្ទុ
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-suwannaphum">
              សន្លឹកកិច្ចការសិស្ស & ការពិភាក្សាជាក្រុម (Student Worksheet)
            </h2>
          </div>

          <!-- 3 Group Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
            ${ws.groups.map((g, i) => {
              const borderCols = ['border-blue-500', 'border-emerald-500', 'border-purple-500'];
              const bgCols = ['bg-blue-50 dark:bg-blue-950/30', 'bg-emerald-50 dark:bg-emerald-950/30', 'bg-purple-50 dark:bg-purple-950/30'];
              return `
                <div class="rounded-2xl p-5 border-2 ${borderCols[i % 3]} ${bgCols[i % 3]} shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white font-suwannaphum pb-2 mb-3 border-b border-slate-200 dark:border-slate-700">
                      ${g.name}
                    </h3>
                    <ul class="space-y-2 text-xs text-slate-800 dark:text-slate-200 font-mono">
                      ${g.tasks.map((t, tidx) => `<li>${tidx + 1}. ${t}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="mt-4 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500 text-center font-bold">
                    សរសេរដំណោះស្រាយលើក្តារឆ្នួនក្រុម
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs text-blue-950 dark:text-blue-200">
            <span>🤝 <strong>ការវាយតម្លៃ៖</strong> ភាពត្រឹមត្រូវនៃលទ្ធផល (៦ពិន្ទុ) + កិច្ចសហការ និងបទបង្ហាញ (៤ពិន្ទុ)</span>
            <button onclick="window.teachingSlidesManager.openWorksheet('${lesson.id}')"
              class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition">
              🖨️ បោះពុម្ពសន្លឹកកិច្ចការ A4
            </button>
          </div>
        </div>
      `;
    }

    slideSummary(lesson) {
      const rows = lesson.summary.rows;
      return `
        <div class="h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
              <i class="fa-solid fa-list-check"></i> សង្ខេបមេរៀន
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-suwannaphum">
              សេចក្តីសង្ខេប & តារាងរូបមន្តគន្លឹះ (Summary Cheat Sheet)
            </h2>
          </div>

          <!-- Table Container -->
          <div class="my-auto overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <table class="w-full text-left text-xs">
              <thead class="bg-indigo-950 text-white font-suwannaphum">
                <tr>
                  <th class="p-3 w-12 text-center">ល.រ</th>
                  <th class="p-3 w-48">ទម្រង់ / ចំណងជើង</th>
                  <th class="p-3">រូបមន្តគន្លឹះ / លក្ខណៈ</th>
                  <th class="p-3 w-48">ចំណាំ / អត្ថន័យ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                ${rows.map((r, i) => `
                  <tr class="${i % 2 === 0 ? 'bg-slate-50/60 dark:bg-slate-800/60' : ''} hover:bg-purple-50/50 dark:hover:bg-slate-700/50">
                    <td class="p-3 text-center font-bold text-slate-500">${i + 1}</td>
                    <td class="p-3 font-bold text-slate-900 dark:text-white font-suwannaphum">${r.topic}</td>
                    <td class="p-3 font-mono font-bold text-indigo-700 dark:text-indigo-300">${r.formula}</td>
                    <td class="p-3 text-slate-600 dark:text-slate-400">${r.note}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-center">
            📌 ចម្លងតារាងរូបមន្តនេះចូលក្នុងសៀវភៅកំណត់ត្រារបស់អ្នកសម្រាប់រំលឹកមុនការប្រឡង
          </div>
        </div>
      `;
    }

    slideHomework(lesson) {
      const hw = lesson.homework;
      return `
        <div class="h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
              <i class="fa-solid fa-house"></i> កិច្ចការបន្ត
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-suwannaphum">
              កិច្ចការផ្ទះ & សូមអរគុណ! (Homework & Closing)
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-stretch">
            <!-- Homework Box (Left) -->
            <div class="md:col-span-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 p-5 rounded-2xl border-2 border-amber-400/80 shadow-md flex flex-col justify-between">
              <div>
                <h3 class="text-base font-black text-amber-950 dark:text-amber-200 font-suwannaphum pb-2 mb-3 border-b border-amber-300 dark:border-amber-800 flex items-center gap-2">
                  <i class="fa-solid fa-book text-amber-600"></i> កិច្ចការផ្ទះត្រូវអនុវត្ត
                </h3>
                <ul class="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  ${hw.tasks.map(t => `<li class="flex items-start gap-2"><span class="text-amber-600 font-bold">•</span><span>${t}</span></li>`).join('')}
                </ul>
              </div>
              <div class="mt-4 p-2.5 bg-amber-200/60 dark:bg-amber-900/40 rounded-xl text-xs font-bold text-amber-950 dark:text-amber-200 text-center">
                ⏰ កាលបរិច្ឆេទប្រគល់៖ ម៉ោងសិក្សាបន្ទាប់
              </div>
            </div>

            <!-- Thank You & Contact Box (Right) -->
            <div class="md:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-700/60 shadow-xl flex flex-col items-center justify-center text-center">
              <img src="images/teacher-profile.jpg" alt="Profile" class="w-20 h-20 rounded-2xl border-2 border-amber-400 shadow-md object-cover mb-3">
              <h3 class="text-lg font-black font-suwannaphum text-amber-400 mb-1">
                សូមអរគុណសម្រាប់ការយកចិត្តទុកដាក់!
              </h3>
              <p class="text-xs text-indigo-200 mb-3">
                លោកគ្រូ <strong>នួន បូណង</strong> • វិទ្យាល័យព្រះយុគន្ធរ NGS
              </p>
              <div class="p-2.5 bg-white/10 rounded-xl text-xs text-slate-300 font-mono w-full max-w-xs border border-white/10">
                Telegram: @MathNGS_Yukunthor
              </div>
            </div>
          </div>

          <div class="text-xs text-slate-400 text-center">
            វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី • គណិតវិទ្យា ថ្នាក់ទី ១២
          </div>
        </div>
      `;
    }

    openWorksheet(lessonId) {
      const lesson = this.lessons.find(l => l.id === lessonId);
      if (!lesson) return;

      const modal = document.getElementById('slideWorksheetModal');
      if (!modal) return;

      modal.classList.remove('hidden');
      modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 dark:border-slate-700">
          <!-- Top bar -->
          <div class="px-5 py-3 bg-slate-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-print text-amber-400"></i>
              <span class="font-bold text-sm font-suwannaphum">សន្លឹកកិច្ចការសិស្ស — ${lesson.lesson_title}</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.print()" class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition">
                🖨️ បោះពុម្ព (Print)
              </button>
              <button onclick="document.getElementById('slideWorksheetModal').classList.add('hidden')" class="p-1 rounded-lg text-slate-400 hover:text-white">
                <i class="fa-solid fa-xmark text-base"></i>
              </button>
            </div>
          </div>

          <!-- Printable Sheet Content -->
          <div class="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 font-battambang bg-white">
            <!-- Official Header -->
            <div class="text-center border-b pb-4">
              <div class="text-xs font-bold text-slate-600">ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div class="text-sm font-black text-slate-900 font-suwannaphum mt-1">វិទ្យាល័យព្រះយុគន្ធរ • សាលារៀនជំនាន់ថ្មី (NGS)</div>
              <div class="text-xs text-slate-500">មុខវិជ្ជា៖ គណិតវិទ្យា ថ្នាក់ទី ១២ • ឆ្នាំសិក្សា ២០២៦-២០២៧</div>
              <h2 class="text-lg font-black text-slate-900 font-suwannaphum mt-3 underline decoration-purple-500">
                សន្លឹកកិច្ចការសិស្ស — ${lesson.lesson_title}
              </h2>
            </div>

            <!-- Student Info Fields -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div><strong>ឈ្មោះសិស្ស៖</strong> ........................</div>
              <div><strong>ថ្នាក់ទី៖</strong> ១២..........</div>
              <div><strong>ក្រុមទី៖</strong> ........................</div>
              <div><strong>ពិន្ទុ៖</strong> ......... / ១០</div>
            </div>

            <!-- 3 Group Tasks -->
            <div class="space-y-4">
              ${lesson.worksheet.groups.map((g, idx) => `
                <div class="p-4 rounded-xl border border-slate-300">
                  <h4 class="font-bold text-sm font-suwannaphum text-slate-900 mb-2">${g.name}</h4>
                  <ul class="space-y-1.5 text-xs font-mono text-slate-800 mb-4">
                    ${g.tasks.map((t, tidx) => `<li>${tidx + 1}. ${t}</li>`).join('')}
                  </ul>
                  <div class="border-t border-dashed border-slate-300 pt-2 text-[11px] text-slate-400">
                    ចម្លើយ ឬដំណោះស្រាយ៖
                    <div class="h-16"></div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Signature footer -->
            <div class="flex justify-between text-xs pt-4 border-t text-slate-600">
              <div class="text-center">
                បានឃើញ និងឯកភាព<br><strong>ប្រធានក្រុម</strong>
              </div>
              <div class="text-center">
                រាជធានីភ្នំពេញ ថ្ងៃទី ២៩ ខែ តុលា ឆ្នាំ ២០២៦<br><strong>គ្រូបង្រៀន៖ នួន បូណង</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Instantiate globally
  window.teachingSlidesManager = new TeachingSlidesManager();

  // Auto-init on DOMContentLoaded or immediate
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.teachingSlidesManager.init());
  } else {
    window.teachingSlidesManager.init();
  }
})();
