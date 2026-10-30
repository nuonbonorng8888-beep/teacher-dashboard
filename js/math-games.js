/**
 * NGS Interactive Math Games Engine (សាលារៀនជំនាន់ថ្មី - វិទ្យាល័យព្រះយុគន្ធរ)
 * Standardized Educational Math Games with Full Curriculum Integration (5,470 Questions)
 * Filterable by Grade (7, 8, 9, 10, 11, 12) and Lesson / Topic
 * Specially Crafted for Teacher Nuon Bonorng (Bonorng11)
 */

class MathGamesEngine {
  constructor() {
    this.audioCtx = null;
    this.selectedGrade = 'all';
    this.selectedLesson = 'all';

    // Blitz State
    this.blitzDuration = 15;
    this.blitzScore = 0;
    this.blitzStreak = 0;
    this.blitzTimer = null;
    this.blitzTimeLeft = 15;
    this.blitzPaused = false;
    this.currentBlitzQ = null;

    // Formula Match State
    this.matchPairsCount = 6;
    this.matchDuration = 0; // 0 = free
    this.matchTimer = null;
    this.matchTimeLeft = 0;
    this.matchMoves = 0;
    this.matchMatchedCount = 0;

    // Team Battle State
    this.battleTargetScore = 50;
    this.battleTurnDuration = 30; // 0 = free
    this.battleTimer = null;
    this.battleTimeLeft = 30;
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';
    this.currentBattleQ = null;

    // Millionaire State
    this.millionaireLevel = 1;
    this.millionaireDuration = 0; // 0 = free
    this.millionaireTimer = null;
    this.millionaireTimeLeft = 0;
    this.currentMillionaireQ = null;
    this.lifeline5050Used = false;
    this.lifelineStudentUsed = false;
    this.lifelineHintUsed = false;

    // Space Defender State
    this.defenderDuration = 30;
    this.defenderCustomLives = 3;
    this.defenderScore = 0;
    this.defenderLives = 3;
    this.defenderTimer = null;
    this.defenderTimeRemainingMs = 30000;
    this.defenderPaused = false;
    this.currentDefenderQ = null;

    // Comprehensive Grade-Specific Formula Packs (100% Unique Left & Right)
    this.formulaPacks = {
      lowerSecondary: [
        { id: 'm_1', left: "(a + b)^2", right: "a^2 + 2ab + b^2" },
        { id: 'm_2', left: "(a - b)^2", right: "a^2 - 2ab + b^2" },
        { id: 'm_3', left: "a^2 - b^2", right: "(a - b)(a + b)" },
        { id: 'm_4', left: "a^m \\cdot a^n", right: "a^{m+n}" },
        { id: 'm_5', left: "\\frac{a^m}{a^n}", right: "a^{m-n}" },
        { id: 'm_6', left: "(a^m)^n", right: "a^{m \\cdot n}" },
        { id: 'm_7', left: "a^{-n}", right: "\\frac{1}{a^n}" },
        { id: 'm_8', left: "c^2 \\text{ (ពីតាក័រ)}", right: "a^2 + b^2" },
        { id: 'm_9', left: "S_\\triangle", right: "\\frac{1}{2} b \\cdot h" },
        { id: 'm_10', left: "S_\\circ", right: "\\pi R^2" },
        { id: 'm_11', left: "P_\\circ", right: "2\\pi R" },
        { id: 'm_12', left: "\\Delta", right: "b^2 - 4ac" }
      ],
      upperSecondary: [
        { id: 'u_1', left: "\\sin^2(x) + \\cos^2(x)", right: "1" },
        { id: 'u_2', left: "\\tan(x)", right: "\\frac{\\sin(x)}{\\cos(x)}" },
        { id: 'u_3', left: "\\cos(2x)", right: "\\cos^2(x) - \\sin^2(x)" },
        { id: 'u_4', left: "(x^n)'", right: "n \\cdot x^{n-1}" },
        { id: 'u_5', left: "(\\sin x)'", right: "\\cos(x)" },
        { id: 'u_6', left: "(\\cos x)'", right: "-\\sin(x)" },
        { id: 'u_7', left: "(e^x)'", right: "e^x" },
        { id: 'u_8', left: "(\\ln x)'", right: "\\frac{1}{x}" },
        { id: 'u_9', left: "i^2", right: "-1" },
        { id: 'u_10', left: "\\int 2x\\,dx", right: "x^2 + C" },
        { id: 'u_11', left: "\\int e^x\\,dx", right: "e^x + C" },
        { id: 'u_12', left: "\\int \\frac{1}{x}\\,dx", right: "\\ln|x| + C" },
        { id: 'u_13', left: "\\lim_{x \\to 0} \\frac{\\sin x}{x}", right: "1" },
        { id: 'u_14', left: "\\ln(a \\cdot b)", right: "\\ln(a) + \\ln(b)" },
        { id: 'u_15', left: "u_n \\text{ (នព្វន្ត)}", right: "u_1 + (n-1)d" }
      ]
    };

    // Fallback starter questions
    this.fallbackQuestions = [
      {
        g: "ថ្នាក់ទី ១០",
        l: "ត្រីកោណមាត្រ",
        p: "រូបមន្តគ្រឹះ",
        q: "តម្លៃនៃកន្សោមត្រីកោណមាត្រ $ \\sin^2(\\theta) + \\cos^2(\\theta) $ ស្មើនឹង៖",
        o: ["$ 0 $", "$ 1 $", "$ 2 $", "$ -1 $"],
        a: 1,
        e: "រូបមន្តគ្រឹះត្រីកោណមាត្រ $\\sin^2(\\theta) + \\cos^2(\\theta) = 1$ ចំពោះគ្រប់មុំ $\\theta$ ។"
      },
      {
        g: "ថ្នាក់ទី ១០",
        l: "ពិជគណិត",
        p: "សមីការដឺក្រេទី២",
        q: "ដោះស្រាយសមីការដឺក្រេទីពីរ $ x^2 - 9 = 0 $ គេបាន $ x $ ស្មើនឹង៖",
        o: ["$ x = 3 $", "$ x = -3 $", "$ x = \\pm 3 $", "$ x = 9 $"],
        a: 2,
        e: "$x^2 = 9 \\iff x = \\pm \\sqrt{9} = \\pm 3$"
      },
      {
        g: "ថ្នាក់ទី ១១",
        l: "លីមីត",
        p: "លីមីតត្រីកោណមាត្រ",
        q: "គណនាលីមីត $ \\lim_{x \\to 0} \\frac{\\sin(x)}{x} $ ស្មើនឹង៖",
        o: ["$ 0 $", "$ 1 $", "$ +\\infty $", "មិនកំណត់"],
        a: 1,
        e: "តាមទ្រឹស្តីបទលីមីតត្រីកោណមាត្រគ្រឹះ $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$ ។"
      },
      {
        g: "ថ្នាក់ទី ១២",
        l: "ដេរីវេ",
        p: "ដេរីវេនៃអនុគមន៍ស្វ័យគុណ",
        q: "គណនាដេរីវេនៃអនុគមន៍ $ f(x) = x^3 $ គេបាន $ f'(x) $ ស្មើនឹង៖",
        o: ["$ 3x $", "$ 3x^2 $", "$ x^2 $", "$ 3x^3 $"],
        a: 1,
        e: "រូបមន្តដេរីវេ $(x^n)' = n x^{n-1} \\implies (x^3)' = 3x^2$ ។"
      },
      {
        g: "ថ្នាក់ទី ១២",
        l: "អាំងតេក្រាល",
        p: "អាំងតេក្រាលមិនកំណត់",
        q: "គណនាអាំងតេក្រាលមិនកំណត់ $ \\int 2x\\,dx $ ស្មើនឹង៖",
        o: ["$ x^2 + C $", "$ 2x^2 + C $", "$ x + C $", "$ 2 + C $"],
        a: 0,
        e: "$\\int 2x\\,dx = 2 \\cdot \\frac{x^2}{2} + C = x^2 + C$"
      }
    ];
  }

  /* ================== QUESTIONS FILTER CONTROLLER ================== */
  getFilteredQuestions() {
    if (!window.MATH_DATABASE || !window.MATH_DATABASE.questions || window.MATH_DATABASE.questions.length === 0) {
      return this.fallbackQuestions;
    }
    let list = window.MATH_DATABASE.questions;
    if (this.selectedGrade && this.selectedGrade !== 'all') {
      list = list.filter(q => q.g === this.selectedGrade);
    }
    if (this.selectedLesson && this.selectedLesson !== 'all') {
      list = list.filter(q => q.l === this.selectedLesson);
    }
    return list.length > 0 ? list : this.fallbackQuestions;
  }

  updateLessonDropdown() {
    const lessonSelect = document.getElementById('filterGameLesson');
    if (!lessonSelect) return;

    if (!window.MATH_DATABASE || !window.MATH_DATABASE.grades) {
      lessonSelect.innerHTML = `<option value="all">📚 គ្រប់មេរៀនទាំងអស់</option>`;
      return;
    }

    let lessons = [];
    if (this.selectedGrade === 'all') {
      const allLessons = new Set();
      Object.values(window.MATH_DATABASE.grades).forEach(arr => arr.forEach(l => allLessons.add(l)));
      lessons = Array.from(allLessons).sort();
    } else {
      lessons = window.MATH_DATABASE.grades[this.selectedGrade] || [];
    }

    lessonSelect.innerHTML = `<option value="all">📚 គ្រប់មេរៀនទាំងអស់ (${lessons.length} មេរៀន)</option>` +
      lessons.map(l => `<option value="${l}">${l}</option>`).join('');

    this.selectedLesson = 'all';
    this.updateQuestionCountBadge();
  }

  updateQuestionCountBadge() {
    const badge = document.getElementById('filterQuestionCountBadge');
    if (badge) {
      const questions = this.getFilteredQuestions();
      badge.textContent = `🎯 មាន ${questions.length} សំណួរ`;
    }
  }

  /* ================== LATEX & AUDIO HELPERS ================== */
  formatMath(text) {
    if (!text) return '';
    if (typeof katex === 'undefined') return text;

    // Render explicit $...$
    if (text.includes('$')) {
      return text.replace(/\$([^\$]+)\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula.trim(), { throwOnError: false, displayMode: false });
        } catch (e) {
          return formula;
        }
      });
    }

    // Auto-detect math formulas or LaTeX commands without $
    const hasMathMacro = /\\(frac|lim|sqrt|sin|cos|tan|log|ln|int|pm|times|div|le|ge|neq|alpha|beta|theta|pi|infty|vec|sum|to)/.test(text);
    if (hasMathMacro) {
      try {
        return katex.renderToString(text.trim(), { throwOnError: false, displayMode: false });
      } catch (e) {}
    }

    return text;
  }

  renderLatex(formula, displayMode = false) {
    if (!formula) return '';
    if (typeof katex === 'undefined') return formula;
    const cleanFormula = formula.replace(/^\$|\$$/g, '').trim();
    try {
      return katex.renderToString(cleanFormula, { throwOnError: false, displayMode: displayMode });
    } catch (e) {
      return formula;
    }
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15) {
    try {
      this.initAudio();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playCorrectSound() {
    this.playTone(523.25, 'triangle', 0.1);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.15), 100);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25), 200);
  }

  playWrongSound() {
    this.playTone(220, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.3), 150);
  }

  playVictoryFanfare() {
    const melody = [523, 659, 784, 1046, 784, 1046];
    melody.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2), idx * 120);
    });
    if (typeof confetti === 'function') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  }

  /* ================== NAVIGATION & GAME SWITCHER ================== */
  switchGameMode(mode) {
    this.clearAllTimers();

    document.querySelectorAll('.game-mode-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.game-tab-btn').forEach(btn => {
      btn.classList.remove('bg-purple-600', 'text-white', 'shadow');
      btn.classList.add('text-slate-700', 'dark:text-slate-300');
    });

    const activeBtn = document.getElementById(`tabBtn-${mode}`);
    if (activeBtn) {
      activeBtn.classList.add('bg-purple-600', 'text-white', 'shadow');
      activeBtn.classList.remove('text-slate-700', 'dark:text-slate-300');
    }

    const panel = document.getElementById(`panel-${mode}`);
    if (panel) panel.classList.remove('hidden');

    // Standard behavior: show Start screen for selected game
    if (mode === 'blitz') this.showBlitzStart();
    else if (mode === 'match') this.showMatchStart();
    else if (mode === 'battle') this.showBattleStart();
    else if (mode === 'millionaire') this.showMillionaireStart();
    else if (mode === 'defender') this.showDefenderStart();
  }

  clearAllTimers() {
    clearInterval(this.blitzTimer);
    clearInterval(this.matchTimer);
    clearInterval(this.battleTimer);
    clearInterval(this.millionaireTimer);
    clearInterval(this.defenderTimer);
  }

  /* ================== GAME 1: MATH SPEED BLITZ ================== */
  showBlitzStart() {
    clearInterval(this.blitzTimer);
    this.blitzPaused = false;
    const startView = document.getElementById('blitzStartView');
    const gameView = document.getElementById('blitzGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
  }

  initBlitzControls() {
    document.querySelectorAll('.blitz-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.blitz-time-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-blitz-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-blitz-time-btn');

        const sec = parseInt(btn.dataset.seconds, 10);
        this.blitzDuration = sec;
        const input = document.getElementById('blitzCustomTimeInput');
        if (input) input.value = sec;
        const badge = document.getElementById('blitzSelectedTimeBadge');
        if (badge) badge.textContent = sec >= 60 ? `${sec / 60} នាទី (${sec} វិនាទី)` : `${sec} វិនាទី`;
      });
    });

    const input = document.getElementById('blitzCustomTimeInput');
    if (input) {
      input.addEventListener('input', (e) => {
        let sec = parseInt(e.target.value, 10);
        if (isNaN(sec) || sec < 5) sec = 5;
        if (sec > 300) sec = 300;
        this.blitzDuration = sec;

        document.querySelectorAll('.blitz-time-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-blitz-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });

        const badge = document.getElementById('blitzSelectedTimeBadge');
        if (badge) badge.textContent = sec >= 60 ? `${Math.floor(sec/60)} នាទី ${sec%60 > 0 ? (sec%60)+' វិ.' : ''}` : `${sec} វិនាទី`;
      });
    }
  }

  toggleBlitzPause() {
    this.blitzPaused = !this.blitzPaused;
    const btn = document.getElementById('btnPauseBlitz');
    if (this.blitzPaused) {
      if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i> <span>បន្ត</span>`;
    } else {
      if (btn) btn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;
    }
  }

  startBlitzGame() {
    const input = document.getElementById('blitzCustomTimeInput');
    if (input && input.value) {
      const parsed = parseInt(input.value, 10);
      if (!isNaN(parsed) && parsed >= 5) this.blitzDuration = parsed;
    }
    const startView = document.getElementById('blitzStartView');
    const gameView = document.getElementById('blitzGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.blitzScore = 0;
    this.blitzStreak = 0;
    this.blitzPaused = false;
    this.updateBlitzUI();
    this.nextBlitzQuestion();
  }

  nextBlitzQuestion() {
    clearInterval(this.blitzTimer);
    this.blitzTimeLeft = this.blitzDuration;
    this.blitzPaused = false;
    const pauseBtn = document.getElementById('btnPauseBlitz');
    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;

    const feedbackBox = document.getElementById('blitzFeedbackBox');
    if (feedbackBox) feedbackBox.classList.add('hidden');

    const pool = this.getFilteredQuestions();
    const randomIndex = Math.floor(Math.random() * pool.length);
    this.currentBlitzQ = pool[randomIndex];

    const questionEl = document.getElementById('blitzQuestionText');
    const topicEl = document.getElementById('blitzTopic');
    const gradeEl = document.getElementById('blitzGrade');
    const optionsContainer = document.getElementById('blitzOptionsContainer');
    const timerBar = document.getElementById('blitzTimerBar');
    const timeDisplay = document.getElementById('blitzTimerText');

    if (questionEl) questionEl.innerHTML = this.formatMath(this.currentBlitzQ.q);
    if (topicEl) topicEl.textContent = this.currentBlitzQ.p || this.currentBlitzQ.l || 'មេរៀនគណិត';
    if (gradeEl) gradeEl.textContent = this.currentBlitzQ.g;
    if (timeDisplay) timeDisplay.textContent = `${this.blitzTimeLeft}s`;
    if (timerBar) {
      timerBar.style.width = '100%';
      timerBar.className = 'h-full bg-purple-600 rounded-full transition-all duration-1000';
    }

    if (optionsContainer) {
      optionsContainer.innerHTML = this.currentBlitzQ.o.map((opt, idx) => `
        <button class="blitz-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700 font-bold text-base md:text-xl text-slate-800 dark:text-white transition transform active:scale-95 shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="katex-content flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.blitz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx, 10);
          this.handleBlitzAnswer(selected, btn);
        });
      });
    }

    this.blitzTimer = setInterval(() => {
      if (this.blitzPaused) return;

      this.blitzTimeLeft--;
      if (timeDisplay) timeDisplay.textContent = `${this.blitzTimeLeft}s`;
      if (timerBar) {
        const pct = (this.blitzTimeLeft / this.blitzDuration) * 100;
        timerBar.style.width = `${Math.max(0, pct)}%`;
        timerBar.className = pct < 30 ? "h-full bg-red-500 rounded-full transition-all duration-1000" : "h-full bg-purple-600 rounded-full transition-all duration-1000";
      }

      if (this.blitzTimeLeft <= 0) {
        clearInterval(this.blitzTimer);
        this.playWrongSound();
        this.blitzStreak = 0;
        this.updateBlitzUI();
        this.showBlitzFeedback(false, `អស់ពេលហើយ! ចម្លើយត្រឹមត្រូវគឺ៖ ${this.formatMath(this.currentBlitzQ.o[this.currentBlitzQ.a])}`);
      }
    }, 1000);
  }

  handleBlitzAnswer(selectedIdx, clickedBtn) {
    clearInterval(this.blitzTimer);
    const isCorrect = selectedIdx === this.currentBlitzQ.a;
    document.querySelectorAll('.blitz-opt-btn').forEach(btn => btn.disabled = true);

    if (isCorrect) {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
      this.playCorrectSound();
      this.blitzScore += 10 + (this.blitzStreak * 2);
      this.blitzStreak++;
      if (this.blitzStreak >= 3 && typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      this.updateBlitzUI();
      setTimeout(() => this.nextBlitzQuestion(), 1000);
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();
      this.blitzStreak = 0;
      this.updateBlitzUI();
      this.showBlitzFeedback(false, `មិនត្រឹមត្រូវទេ! ចម្លើយត្រឹមត្រូវគឺ៖ ${this.formatMath(this.currentBlitzQ.o[this.currentBlitzQ.a])}`);
    }
  }

  showBlitzFeedback(correct, msg) {
    const feedbackBox = document.getElementById('blitzFeedbackBox');
    if (!feedbackBox) return;
    feedbackBox.innerHTML = `
      <div class="p-5 rounded-2xl ${correct ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border-2 border-red-200 dark:border-red-800'} border text-center font-bold text-sm shadow-sm">
        ${correct ? `
          <div class="w-16 h-16 mx-auto mb-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-4xl shadow-sm animate-bounce">
            🥳
          </div>
          <p class="text-xs text-emerald-600 dark:text-emerald-300 mb-1 font-bold">អស្ចារ្យណាស់! ឆ្លើយត្រឹមត្រូវ!</p>
        ` : `
          <div class="w-16 h-16 mx-auto mb-2 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-4xl shadow-sm animate-bounce">
            😭
          </div>
          <p class="text-xs text-red-600 dark:text-red-400 mb-1 font-bold">អូយ! ពិបាកចិត្តណាស់... ឆ្លើយខុសហើយ!</p>
        `}
        <div class="mt-2 text-slate-800 dark:text-slate-200">${msg}</div>
        <button id="btnBlitzNext" class="mt-3 block mx-auto px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition">
          សំណួរបន្ទាប់ ➔
        </button>
      </div>
    `;
    feedbackBox.classList.remove('hidden');
    document.getElementById('btnBlitzNext').addEventListener('click', () => {
      feedbackBox.classList.add('hidden');
      this.nextBlitzQuestion();
    });
  }

  updateBlitzUI() {
    const scoreEl = document.getElementById('blitzScoreText');
    const streakEl = document.getElementById('blitzStreakText');
    if (scoreEl) scoreEl.textContent = this.blitzScore;
    if (streakEl) streakEl.textContent = this.blitzStreak;
  }

  /* ================== GAME 2: FORMULA MEMORY MATCH ================== */
  showMatchStart() {
    clearInterval(this.matchTimer);
    const startView = document.getElementById('matchStartView');
    const gameView = document.getElementById('matchGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
  }

  initMatchControls() {
    // Grid Size Preset buttons
    document.querySelectorAll('.match-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.match-size-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-size-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-size-btn');

        this.matchPairsCount = parseInt(btn.dataset.pairs, 10);
      });
    });

    // Timer challenge buttons
    document.querySelectorAll('.match-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.match-time-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-time-btn');

        this.matchDuration = parseInt(btn.dataset.time, 10);
      });
    });
  }

  getFormulaPackForCurrentGrade() {
    const isLower = ['ថ្នាក់ទី ៧', 'ថ្នាក់ទី ៨', 'ថ្នាក់ទី ៩'].includes(this.selectedGrade);
    const pack = isLower ? this.formulaPacks.lowerSecondary : this.formulaPacks.upperSecondary;
    return [...pack];
  }

  startMatchGame() {
    const startView = document.getElementById('matchStartView');
    const gameView = document.getElementById('matchGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.matchMoves = 0;
    this.matchMatchedCount = 0;
    this.updateMatchStatsUI();
    this.initFormulaMatch();

    // Handle timer
    clearInterval(this.matchTimer);
    const timerContainer = document.getElementById('matchTimerContainer');
    const timerText = document.getElementById('matchTimerText');

    if (this.matchDuration > 0) {
      if (timerContainer) timerContainer.classList.remove('hidden');
      this.matchTimeLeft = this.matchDuration;
      if (timerText) timerText.textContent = `${this.matchTimeLeft}s`;

      this.matchTimer = setInterval(() => {
        this.matchTimeLeft--;
        if (timerText) timerText.textContent = `${this.matchTimeLeft}s`;

        if (this.matchTimeLeft <= 0) {
          clearInterval(this.matchTimer);
          this.playWrongSound();
          window.showStandardDialog({
            title: '😭 អូយ! អស់ពេលហើយ... ពិបាកចិត្តណាស់!',
            html: `
              <div class="py-2 text-center">
                <div class="w-20 h-20 mx-auto mb-3 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-5xl animate-bounce">
                  😭
                </div>
                <p class="text-xs text-slate-500 mb-2">ពេលវេលាកំណត់បានបញ្ចប់ហើយ!</p>
                <div class="text-sm font-bold text-slate-700 dark:text-slate-200">
                  ផ្គូផ្គងបាន៖ <strong class="text-purple-600">${this.matchMatchedCount}</strong> នៃ <strong>${this.matchPairsCount}</strong> គូ
                </div>
              </div>
            `,
            icon: 'error',
            confirmText: '🔄 សាកល្បងម្ដងទៀត',
            onConfirm: () => this.startMatchGame()
          });
        }
      }, 1000);
    } else {
      if (timerContainer) timerContainer.classList.add('hidden');
    }
  }

  updateMatchStatsUI() {
    const movesEl = document.getElementById('matchMovesText');
    const pairsEl = document.getElementById('matchPairsText');
    const badgeEl = document.getElementById('matchGradeBadge');

    if (movesEl) movesEl.textContent = this.matchMoves;
    if (pairsEl) pairsEl.textContent = `${this.matchMatchedCount}/${this.matchPairsCount}`;
    if (badgeEl) {
      badgeEl.textContent = this.selectedGrade === 'all' ? 'គ្រប់កម្រិតថ្នាក់' : this.selectedGrade;
    }
  }

  initFormulaMatch() {
    const container = document.getElementById('formulaMatchGrid');
    if (!container) return;

    const pack = this.getFormulaPackForCurrentGrade();
    pack.sort(() => Math.random() - 0.5);

    // Pick pairs ensuring 100% unique left and right values
    const selected = [];
    const usedLefts = new Set();
    const usedRights = new Set();

    for (const p of pack) {
      if (!usedLefts.has(p.left) && !usedRights.has(p.right)) {
        selected.push(p);
        usedLefts.add(p.left);
        usedRights.add(p.right);
        if (selected.length === this.matchPairsCount) break;
      }
    }

    let cards = [];
    selected.forEach(p => {
      cards.push({ id: p.id, latex: p.left, type: 'left', target: p.right });
      cards.push({ id: p.id, latex: p.right, type: 'right', target: p.left });
    });

    cards.sort(() => Math.random() - 0.5);

    container.innerHTML = cards.map((c, idx) => {
      const renderedLatex = this.renderLatex(c.latex, true);
      return `
        <div class="match-card group relative h-32 cursor-pointer rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-200 select-none overflow-hidden" 
             data-id="${c.id}" 
             data-type="${c.type}"
             data-val="${encodeURIComponent(c.latex)}" 
             data-target="${encodeURIComponent(c.target)}"
             data-idx="${idx}">
          <div class="card-front absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex flex-col items-center justify-center text-white transition-all">
            <span class="text-3xl font-extrabold filter drop-shadow">❓</span>
            <span class="text-[11px] font-bold text-purple-200 mt-1 uppercase tracking-wider font-battambang">រូបមន្ត</span>
          </div>
          <div class="card-back absolute inset-0 hidden bg-white dark:bg-slate-800 flex items-center justify-center p-3 text-center text-purple-950 dark:text-purple-100 font-extrabold text-base md:text-lg">
            <div class="latex-wrapper transform scale-110">${renderedLatex}</div>
          </div>
        </div>
      `;
    }).join('');

    let firstCard = null;
    let lockBoard = false;

    document.querySelectorAll('.match-card').forEach(card => {
      card.addEventListener('click', () => {
        if (lockBoard || card === firstCard || card.classList.contains('matched')) return;

        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        front.classList.add('hidden');
        back.classList.remove('hidden');
        card.classList.add('ring-4', 'ring-purple-400');
        this.playTone(440, 'sine', 0.08);

        if (!firstCard) {
          firstCard = card;
        } else {
          lockBoard = true;
          this.matchMoves++;
          this.updateMatchStatsUI();

          const isMatch = (firstCard.dataset.id === card.dataset.id) || 
                          (firstCard.dataset.target && firstCard.dataset.target === card.dataset.val) ||
                          (card.dataset.target && card.dataset.target === firstCard.dataset.val);

          if (isMatch) {
            this.playCorrectSound();
            [firstCard, card].forEach(c => {
              c.classList.remove('ring-4', 'ring-purple-400', 'border-purple-200', 'dark:border-purple-800');
              c.classList.add('matched', 'border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/60');
              c.querySelector('.card-back').classList.add('bg-emerald-50', 'dark:bg-emerald-950/60', 'text-emerald-800', 'dark:text-emerald-200');
            });

            firstCard = null;
            lockBoard = false;
            this.matchMatchedCount++;
            this.updateMatchStatsUI();

            if (this.matchMatchedCount === this.matchPairsCount) {
              clearInterval(this.matchTimer);
              this.playVictoryFanfare();
              setTimeout(() => {
                window.showStandardDialog({
                  title: '🎉 អបអរសាទរ! ផ្គូផ្គងបានជោគជ័យ!',
                  html: `
                    <div class="py-2 text-center">
                      <div class="text-5xl mb-2">⭐⭐⭐</div>
                      <p class="text-sm font-bold text-emerald-700 dark:text-emerald-400">សិស្សានុសិស្សបានផ្គូផ្គងរូបមន្តគណិតវិទ្យាបានត្រឹមត្រូវទាំងអស់!</p>
                      <div class="my-3 p-3 rounded-2xl bg-purple-50 dark:bg-slate-700 text-xs text-purple-900 dark:text-purple-200 font-bold">
                        <div>ចំនួនបើកសរុប៖ <strong>${this.matchMoves}</strong> ដង</div>
                        ${this.matchDuration > 0 ? `<div>ពេលនៅសល់៖ <strong>${this.matchTimeLeft} វិ.</strong></div>` : ''}
                      </div>
                      <p class="text-xs text-slate-500">ស្ទាត់ជំនាញ និងយល់ដឹងច្បាស់លាស់ពីរូបមន្តគណិតវិទ្យា NGS ✨</p>
                    </div>
                  `,
                  icon: 'success',
                  confirmText: '🔄 លេងវគ្គថ្មី',
                  onConfirm: () => this.startMatchGame()
                });
              }, 400);
            }
          } else {
            this.playWrongSound();
            [firstCard, card].forEach(c => c.classList.add('ring-4', 'ring-red-400'));
            setTimeout(() => {
              [firstCard, card].forEach(c => {
                c.classList.remove('ring-4', 'ring-red-400', 'ring-purple-400');
                c.querySelector('.card-front').classList.remove('hidden');
                c.querySelector('.card-back').classList.add('hidden');
              });
              firstCard = null;
              lockBoard = false;
            }, 900);
          }
        }
      });
    });
  }

  /* ================== GAME 3: TEAM BATTLE (RED VS BLUE) ================== */
  showBattleStart() {
    clearInterval(this.battleTimer);
    const startView = document.getElementById('battleStartView');
    const gameView = document.getElementById('battleGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
  }

  initBattleControls() {
    // Target score presets
    document.querySelectorAll('.battle-target-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.battle-target-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-battle-target-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-battle-target-btn');

        this.battleTargetScore = parseInt(btn.dataset.target, 10);
      });
    });

    // Time per turn presets
    document.querySelectorAll('.battle-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.battle-time-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-battle-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-battle-time-btn');

        this.battleTurnDuration = parseInt(btn.dataset.seconds, 10);
      });
    });
  }

  startBattleGame() {
    const startView = document.getElementById('battleStartView');
    const gameView = document.getElementById('battleGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';

    const targetEl = document.getElementById('battleTargetDisplay');
    if (targetEl) targetEl.textContent = `${this.battleTargetScore} ពិន្ទុ`;

    this.updateBattleUI();
    this.nextBattleQuestion();
  }

  updateBattleUI() {
    const aScore = document.getElementById('battleScoreTeamA');
    const bScore = document.getElementById('battleScoreTeamB');
    const turnEl = document.getElementById('battleActiveTurn');
    const boxA = document.getElementById('battleTeamABox');
    const boxB = document.getElementById('battleTeamBBox');

    if (aScore) aScore.textContent = this.teamAScore;
    if (bScore) bScore.textContent = this.teamBScore;

    if (turnEl) {
      turnEl.innerHTML = this.activeTeam === 'A' ? 
        `<span class="px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-xs shadow-sm ring-2 ring-red-400 animate-pulse">វេនក្រុមទី ១ (ក្រុមក្រហម) 🔴</span>` :
        `<span class="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs shadow-sm ring-2 ring-blue-400 animate-pulse">វេនក្រុមទី ២ (ក្រុមខៀវ) 🔵</span>`;
    }

    if (boxA && boxB) {
      if (this.activeTeam === 'A') {
        boxA.classList.add('ring-4', 'ring-red-400', 'scale-105');
        boxB.classList.remove('ring-4', 'ring-blue-400', 'scale-105');
      } else {
        boxB.classList.add('ring-4', 'ring-blue-400', 'scale-105');
        boxA.classList.remove('ring-4', 'ring-red-400', 'scale-105');
      }
    }
  }

  nextBattleQuestion() {
    clearInterval(this.battleTimer);
    const pool = this.getFilteredQuestions();
    const randomIndex = Math.floor(Math.random() * pool.length);
    const q = pool[randomIndex];
    this.currentBattleQ = q;

    const qEl = document.getElementById('battleQuestionText');
    const optContainer = document.getElementById('battleOptionsContainer');

    if (qEl) qEl.innerHTML = this.formatMath(q.q);

    // Setup turn timer
    const timerWrapper = document.getElementById('battleTimerWrapper');
    const timerText = document.getElementById('battleTimerText');
    const timerBar = document.getElementById('battleTimerBar');

    if (this.battleTurnDuration > 0) {
      if (timerWrapper) timerWrapper.classList.remove('hidden');
      this.battleTimeLeft = this.battleTurnDuration;
      if (timerText) timerText.textContent = `${this.battleTimeLeft}s`;
      if (timerBar) {
        timerBar.style.width = '100%';
        timerBar.className = this.activeTeam === 'A' ? 'h-full bg-red-500 rounded-full transition-all duration-1000' : 'h-full bg-blue-500 rounded-full transition-all duration-1000';
      }

      this.battleTimer = setInterval(() => {
        this.battleTimeLeft--;
        if (timerText) timerText.textContent = `${this.battleTimeLeft}s`;
        if (timerBar) {
          const pct = (this.battleTimeLeft / this.battleTurnDuration) * 100;
          timerBar.style.width = `${Math.max(0, pct)}%`;
        }

        if (this.battleTimeLeft <= 0) {
          clearInterval(this.battleTimer);
          this.handleBattleTimeout();
        }
      }, 1000);
    } else {
      if (timerWrapper) timerWrapper.classList.add('hidden');
    }

    if (optContainer) {
      optContainer.innerHTML = q.o.map((opt, idx) => `
        <button class="battle-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 font-bold text-base md:text-xl text-slate-800 dark:text-white transition shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.battle-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx, 10);
          this.handleBattleAnswer(selected, btn);
        });
      });
    }
  }

  handleBattleAnswer(selectedIdx, clickedBtn) {
    clearInterval(this.battleTimer);
    document.querySelectorAll('.battle-opt-btn').forEach(btn => btn.disabled = true);

    const isCorrect = selectedIdx === this.currentBattleQ.a;
    const currentTeamName = this.activeTeam === 'A' ? 'ក្រុមទី ១ (ក្រុមក្រហម 🔴)' : 'ក្រុមទី ២ (ក្រុមខៀវ 🔵)';
    const nextTeamName = this.activeTeam === 'A' ? 'ក្រុមទី ២ (ក្រុមខៀវ 🔵)' : 'ក្រុមទី ១ (ក្រុមក្រហម 🔴)';

    if (isCorrect) {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
      this.playCorrectSound();

      if (this.activeTeam === 'A') this.teamAScore += 10;
      else this.teamBScore += 10;

      if (typeof confetti === 'function') confetti({ particleCount: 70, spread: 80 });
      this.updateBattleUI();

      // Check for winning score
      const currentScore = this.activeTeam === 'A' ? this.teamAScore : this.teamBScore;
      if (currentScore >= this.battleTargetScore) {
        this.playVictoryFanfare();
        setTimeout(() => {
          window.showStandardDialog({
            title: '🏆 អបអរសាទរជើងឯក!',
            html: `
              <div class="py-2 text-center">
                <div class="text-6xl mb-2 animate-bounce">🏆</div>
                <h3 class="text-lg font-black ${this.activeTeam === 'A' ? 'text-red-600' : 'text-blue-600'} mb-2">
                  ${currentTeamName} បានទទួលជ័យជម្នះ!
                </h3>
                <p class="text-xs text-slate-500 mb-3">បានសម្រេចពិន្ទុគោលដៅ ${this.battleTargetScore} ពិន្ទុមុនគេ!</p>
                <div class="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700 text-xs font-bold">
                  <div>ក្រុមក្រហម៖ <strong class="text-red-600 text-sm">${this.teamAScore}</strong> ពិន្ទុ</div>
                  <div>ក្រុមខៀវ៖ <strong class="text-blue-600 text-sm">${this.teamBScore}</strong> ពិន្ទុ</div>
                </div>
              </div>
            `,
            icon: 'success',
            confirmText: '🔄 ប្រកួតឡើងវិញ',
            onConfirm: () => this.startBattleGame()
          });
        }, 500);
        return;
      }

      this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
      this.updateBattleUI();
      setTimeout(() => this.nextBattleQuestion(), 1100);
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();

      // Highlight correct option
      document.querySelectorAll('.battle-opt-btn').forEach(b => {
        if (parseInt(b.dataset.idx, 10) === this.currentBattleQ.a) {
          b.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
        }
      });

      const correctText = this.formatMath(this.currentBattleQ.o[this.currentBattleQ.a]);
      const expText = this.currentBattleQ.e ? this.formatMath(this.currentBattleQ.e) : '';

      setTimeout(() => {
        window.showStandardDialog({
          title: '😭 អូយ! ឆ្លើយខុសហើយ... ពិបាកចិត្តណាស់!',
          html: `
            <div class="py-2 text-center">
              <div class="w-20 h-20 mx-auto mb-2 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-5xl animate-bounce">
                😭
              </div>
              <h4 class="text-sm font-bold text-red-600 mb-1">${currentTeamName} ឆ្លើយមិនត្រឹមត្រូវទេ!</h4>
              <div class="p-3 my-2 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-left">
                <div>✅ ចម្លើយត្រឹមត្រូវគឺ៖ <strong class="text-emerald-600 text-sm">${correctText}</strong></div>
                ${expText ? `<div class="mt-1.5 pt-1.5 border-t border-red-200/60 text-slate-600 dark:text-slate-300 text-[11px]">${expText}</div>` : ''}
              </div>
              <p class="text-xs text-purple-600 font-bold mt-2">វេនបន្ទាប់៖ ${nextTeamName}</p>
            </div>
          `,
          icon: 'error',
          confirmText: '👉 បន្តទៅវេនបន្ទាប់',
          onConfirm: () => {
            this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
            this.updateBattleUI();
            this.nextBattleQuestion();
          }
        });
      }, 500);
    }
  }

  handleBattleTimeout() {
    this.playWrongSound();
    const currentTeamName = this.activeTeam === 'A' ? 'ក្រុមទី ១ (ក្រុមក្រហម 🔴)' : 'ក្រុមទី ២ (ក្រុមខៀវ 🔵)';
    const nextTeamName = this.activeTeam === 'A' ? 'ក្រុមទី ២ (ក្រុមខៀវ 🔵)' : 'ក្រុមទី ១ (ក្រុមក្រហម 🔴)';
    const correctText = this.formatMath(this.currentBattleQ.o[this.currentBattleQ.a]);

    window.showStandardDialog({
      title: '😭 អូយ! អស់ពេលហើយ... ពិបាកចិត្តណាស់!',
      html: `
        <div class="py-2 text-center">
          <div class="w-20 h-20 mx-auto mb-2 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-5xl animate-bounce">
            😭
          </div>
          <h4 class="text-sm font-bold text-red-600 mb-1">${currentTeamName} បានអស់ពេលហើយ!</h4>
          <p class="text-xs text-slate-500 mb-2">ចម្លើយត្រឹមត្រូវគឺ៖ <strong class="text-emerald-600">${correctText}</strong></p>
          <p class="text-xs text-purple-600 font-bold">វេនបន្ទាប់៖ ${nextTeamName}</p>
        </div>
      `,
      icon: 'error',
      confirmText: '👉 ផ្ទេរវេនទៅក្រុមបន្ទាប់',
      onConfirm: () => {
        this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
        this.updateBattleUI();
        this.nextBattleQuestion();
      }
    });
  }

  /* ================== GAME 4: MATH MILLIONAIRE (សេដ្ឋីគណិតវិទ្យា) ================== */
  showMillionaireStart() {
    clearInterval(this.millionaireTimer);
    const startView = document.getElementById('millionaireStartView');
    const gameView = document.getElementById('millionaireGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
  }

  initMillionaireControls() {
    document.querySelectorAll('.millionaire-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.millionaire-time-btn').forEach(b => {
          b.classList.remove('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-millionaire-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-millionaire-time-btn');

        this.millionaireDuration = parseInt(btn.dataset.seconds, 10);
      });
    });
  }

  startMillionaireGame() {
    const startView = document.getElementById('millionaireStartView');
    const gameView = document.getElementById('millionaireGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.millionaireLevel = 1;
    this.lifeline5050Used = false;
    this.lifelineStudentUsed = false;
    this.lifelineHintUsed = false;
    this.renderMillionaireLadder();
    this.resetMillionaireLifelines();
    this.nextMillionaireQuestion();
  }

  renderMillionaireLadder() {
    const ladderContainer = document.getElementById('millionaireLadder');
    if (!ladderContainer) return;

    const levels = [
      { lvl: 10, pts: "១០ ពិន្ទុ (ជើងឯក 🏆)" },
      { lvl: 9, pts: "៩ ពិន្ទុ" },
      { lvl: 8, pts: "៨ ពិន្ទុ" },
      { lvl: 7, pts: "៧ ពិន្ទុ" },
      { lvl: 6, pts: "៦ ពិន្ទុ" },
      { lvl: 5, pts: "៥ ពិន្ទុ (សុវត្ថិភាព 🛡️)" },
      { lvl: 4, pts: "៤ ពិន្ទុ" },
      { lvl: 3, pts: "៣ ពិន្ទុ" },
      { lvl: 2, pts: "២ ពិន្ទុ" },
      { lvl: 1, pts: "១ ពិន្ទុ" }
    ];

    ladderContainer.innerHTML = levels.map(item => `
      <div id="millionaire-step-${item.lvl}" class="p-2 rounded-xl text-xs font-bold flex items-center justify-between border transition ${
        this.millionaireLevel === item.lvl ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-md scale-105' :
        this.millionaireLevel > item.lvl ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300' :
        'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
      }">
        <span>កម្រិត ${item.lvl}</span>
        <span>${item.pts}</span>
      </div>
    `).join('');
  }

  resetMillionaireLifelines() {
    const btn5050 = document.getElementById('btnLife5050');
    const btnStudent = document.getElementById('btnLifeStudent');
    const btnHint = document.getElementById('btnLifeHint');

    if (btn5050) { btn5050.disabled = false; btn5050.classList.remove('opacity-40', 'line-through'); }
    if (btnStudent) { btnStudent.disabled = false; btnStudent.classList.remove('opacity-40', 'line-through'); }
    if (btnHint) { btnHint.disabled = false; btnHint.classList.remove('opacity-40', 'line-through'); }
  }

  nextMillionaireQuestion() {
    const pool = this.getFilteredQuestions();
    const randomIndex = Math.floor(Math.random() * pool.length);
    this.currentMillionaireQ = pool[randomIndex];

    this.renderMillionaireLadder();

    const qEl = document.getElementById('millionaireQuestionText');
    const optContainer = document.getElementById('millionaireOptionsContainer');
    const lvlText = document.getElementById('millionaireCurrentLvlText');

    if (lvlText) lvlText.textContent = `សំណួរទី ${this.millionaireLevel} (ប្រជែងយក ${this.millionaireLevel} ពិន្ទុ)`;
    if (qEl) qEl.innerHTML = this.formatMath(this.currentMillionaireQ.q);

    if (optContainer) {
      optContainer.innerHTML = this.currentMillionaireQ.o.map((opt, idx) => `
        <button class="millionaire-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 font-bold text-base md:text-xl text-slate-800 dark:text-white transition shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="katex-content flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.millionaire-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx, 10);
          this.handleMillionaireAnswer(selected, btn);
        });
      });
    }
  }

  handleMillionaireAnswer(selectedIdx, clickedBtn) {
    document.querySelectorAll('.millionaire-opt-btn').forEach(btn => btn.disabled = true);
    const isCorrect = selectedIdx === this.currentMillionaireQ.a;

    if (isCorrect) {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
      this.playCorrectSound();

      if (this.millionaireLevel === 10) {
        this.playVictoryFanfare();
        setTimeout(() => {
          window.showStandardDialog({
            title: '🏆 អស្ចារ្យណាស់!',
            html: `
              <div class="py-2 text-center">
                <div class="text-6xl mb-2 animate-bounce">🥇</div>
                <p class="text-base font-extrabold text-amber-600 dark:text-amber-400">អ្នកបានឆ្លើយត្រូវគ្រប់ ១០ សំណួរ!</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">ក្លាយជាជើងឯកគណិតវិទ្យា NGS ថ្នាក់ជាតិ 🥇</p>
              </div>
            `,
            icon: 'success',
            confirmText: '🎉 អស្ចារ្យ! លេងម្ដងទៀត',
            onConfirm: () => this.startMillionaireGame()
          });
        }, 500);
      } else {
        this.millionaireLevel++;
        setTimeout(() => this.nextMillionaireQuestion(), 1100);
      }
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();
      const finalPts = this.millionaireLevel >= 5 ? 5 : 0;
      setTimeout(() => {
        window.showStandardDialog({
          title: '😭 អូយ! ពិបាកចិត្តណាស់... ឆ្លើយខុសហើយ!',
          html: `
            <div class="py-2 text-center">
              <div class="w-24 h-24 mx-auto mb-3 bg-red-50 dark:bg-red-950/50 rounded-full border-2 border-red-200 dark:border-red-800 flex items-center justify-center shadow-inner relative animate-bounce">
                <span class="text-6xl">😭</span>
                <span class="absolute -bottom-1 -right-1 text-2xl">💔</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">កុំទាន់អស់សង្ឃឹម សាកល្បងម្ដងទៀតណា៎!</p>
              <div class="p-3.5 my-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 text-left">
                <span class="font-bold">ចម្លើយត្រឹមត្រូវគឺ៖</span> ${this.formatMath(this.currentMillionaireQ.o[this.currentMillionaireQ.a])}
              </div>
              <div class="text-center font-bold text-sm text-slate-700 dark:text-slate-200 mt-2">
                ពិន្ទុដែលទទួលបាន៖ <span class="text-purple-600 font-extrabold text-xl">${finalPts}</span> ពិន្ទុ ${finalPts === 5 ? '(កម្រិតសុវត្ថិភាព 🛡️)' : ''}
              </div>
            </div>
          `,
          icon: 'error',
          confirmText: '🔄 សាកល្បងម្ដងទៀត',
          onConfirm: () => this.startMillionaireGame()
        });
      }, 700);
    }
  }

  walkAwayMillionaire() {
    const currentPts = this.millionaireLevel - 1;
    window.showStandardDialog({
      title: '🚪 ឈប់លេង និងយកពិន្ទុបច្ចុប្បន្ន?',
      html: `
        <div class="py-2 text-center">
          <p class="text-xs text-slate-500 mb-2">លោកគ្រូ/សិស្សានុសិស្សជ្រើសរើសរក្សាទុកពិន្ទុបច្ចុប្បន្ន៖</p>
          <div class="text-2xl font-black text-amber-500 my-2">${currentPts} ពិន្ទុ</div>
          <p class="text-[11px] text-slate-400">ពិន្ទុនេះនឹងត្រូវបានកត់ត្រាទុកយ៉ាងមានសុវត្ថិភាព!</p>
        </div>
      `,
      icon: 'question',
      showCancel: true,
      cancelText: 'បន្តប្រជែងទៀត',
      confirmText: 'យកពិន្ទុ និងបញ្ចប់',
      onConfirm: () => {
        window.showToast(`✅ បានបញ្ចប់ការប្រកួតជាមួយ ${currentPts} ពិន្ទុ!`);
        this.showMillionaireStart();
      }
    });
  }

  useLifeline5050() {
    if (this.lifeline5050Used || !this.currentMillionaireQ) return;
    this.lifeline5050Used = true;
    const btn = document.getElementById('btnLife5050');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-40', 'line-through'); }

    const correctIdx = this.currentMillionaireQ.a;
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
    wrongIndices.sort(() => Math.random() - 0.5);
    const toRemove = wrongIndices.slice(0, 2);

    document.querySelectorAll('.millionaire-opt-btn').forEach(b => {
      const idx = parseInt(b.dataset.idx, 10);
      if (toRemove.includes(idx)) {
        b.style.visibility = 'hidden';
      }
    });
    this.playTone(350, 'sine', 0.1);
  }

  useLifelineStudent() {
    if (this.lifelineStudentUsed) return;
    this.lifelineStudentUsed = true;
    const btn = document.getElementById('btnLifeStudent');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-40', 'line-through'); }

    const students = (window.appStore && window.appStore.data && window.appStore.data.students) || [];
    const studentName = students.length > 0 ? students[Math.floor(Math.random() * students.length)].name : 'មិត្តរួមថ្នាក់';

    this.playTone(600, 'triangle', 0.2);
    window.showStandardDialog({
      title: '👥 ជំនួយពីមិត្តរួមថ្នាក់',
      html: `
        <div class="py-3 text-center">
          <p class="text-xs text-slate-500 mb-2 font-medium">សិស្សដែលត្រូវបានជ្រើសរើសឱ្យជួយឆ្លើយគឺ៖</p>
          <div class="inline-block px-5 py-2.5 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 font-extrabold text-xl shadow-sm">
            👨‍🎓 ${studentName}
          </div>
        </div>
      `,
      icon: 'info',
      confirmText: 'យល់ព្រម'
    });
  }

  useLifelineHint() {
    if (this.lifelineHintUsed || !this.currentMillionaireQ) return;
    this.lifelineHintUsed = true;
    const btn = document.getElementById('btnLifeHint');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-40', 'line-through'); }

    const exp = this.currentMillionaireQ.e || "សូមពិនិត្យមើលរូបមន្តគន្លឹះនៃមេរៀននេះ!";
    this.playTone(550, 'sine', 0.15);
    window.showStandardDialog({
      title: '💡 គន្លឹះដោះស្រាយ & រូបមន្ត',
      html: `
        <div class="py-2 text-left">
          <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            ${this.formatMath(exp)}
          </div>
        </div>
      `,
      icon: 'info',
      confirmText: 'យល់ព្រម'
    });
  }

  /* ================== GAME 5: SPACE MATH DEFENDER (បាញ់កម្ទេចអាចម៍ផ្កាយ) ================== */
  showDefenderStart() {
    clearInterval(this.defenderTimer);
    this.defenderPaused = false;
    const startView = document.getElementById('defenderStartView');
    const gameView = document.getElementById('defenderGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
    this.updateActiveTopicLabels();
  }

  initDefenderControls() {
    // Time preset buttons
    document.querySelectorAll('.defender-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.defender-time-btn').forEach(b => {
          b.classList.remove('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-defender-time-btn');
          b.classList.add('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        });
        btn.classList.remove('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        btn.classList.add('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-defender-time-btn');

        const sec = parseInt(btn.dataset.seconds, 10);
        this.defenderDuration = sec;
        const input = document.getElementById('defenderCustomTimeInput');
        if (input) input.value = sec;
        const badge = document.getElementById('defenderSelectedTimeBadge');
        if (badge) {
          if (sec >= 60) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            badge.textContent = `${m} នាទី ${s > 0 ? s + ' វិនាទី' : ''}`;
          } else {
            badge.textContent = `${sec} វិនាទី`;
          }
        }
      });
    });

    // Custom time input
    const input = document.getElementById('defenderCustomTimeInput');
    if (input) {
      input.addEventListener('input', (e) => {
        let sec = parseInt(e.target.value, 10);
        if (isNaN(sec) || sec < 5) sec = 5;
        if (sec > 600) sec = 600;
        this.defenderDuration = sec;

        document.querySelectorAll('.defender-time-btn').forEach(b => {
          b.classList.remove('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-defender-time-btn');
          b.classList.add('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        });

        const badge = document.getElementById('defenderSelectedTimeBadge');
        if (badge) {
          if (sec >= 60) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            badge.textContent = `${m} នាទី ${s > 0 ? s + ' វិនាទី' : ''}`;
          } else {
            badge.textContent = `${sec} វិនាទី`;
          }
        }
      });
    }

    // Lives buttons
    document.querySelectorAll('.defender-lives-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.defender-lives-btn').forEach(b => {
          b.classList.remove('bg-red-600', 'border-red-400', 'text-white', 'active-defender-lives-btn');
          b.classList.add('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        });
        btn.classList.remove('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        btn.classList.add('bg-red-600', 'border-red-400', 'text-white', 'active-defender-lives-btn');

        this.defenderCustomLives = parseInt(btn.dataset.lives, 10);
      });
    });

    this.updateActiveTopicLabels();
  }

  updateActiveTopicLabels() {
    const lbl = document.getElementById('defenderActiveTopicLabel');
    if (lbl) {
      const gText = this.selectedGrade === 'all' ? 'គ្រប់កម្រិតថ្នាក់ (៧ ដល់ ១២)' : this.selectedGrade;
      const lText = this.selectedLesson === 'all' ? 'គ្រប់មេរៀនទាំងអស់' : this.selectedLesson;
      lbl.textContent = `${gText} • ${lText}`;
    }
  }

  toggleDefenderPause() {
    this.defenderPaused = !this.defenderPaused;
    const overlay = document.getElementById('defenderPauseOverlay');
    const btn = document.getElementById('btnPauseDefender');

    if (this.defenderPaused) {
      if (overlay) overlay.classList.remove('hidden');
      if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i> <span>បន្ត</span>`;
    } else {
      if (overlay) overlay.classList.add('hidden');
      if (btn) btn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;
    }
  }

  startDefenderGame() {
    const input = document.getElementById('defenderCustomTimeInput');
    if (input && input.value) {
      const parsed = parseInt(input.value, 10);
      if (!isNaN(parsed) && parsed >= 5) this.defenderDuration = parsed;
    }

    const startView = document.getElementById('defenderStartView');
    const gameView = document.getElementById('defenderGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.defenderScore = 0;
    this.defenderLives = this.defenderCustomLives;
    this.defenderPaused = false;
    const overlay = document.getElementById('defenderPauseOverlay');
    if (overlay) overlay.classList.add('hidden');
    const pauseBtn = document.getElementById('btnPauseDefender');
    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;

    const sub = document.getElementById('defenderGameLessonSub');
    if (sub) {
      const gText = this.selectedGrade === 'all' ? 'គ្រប់ថ្នាក់' : this.selectedGrade;
      const lText = this.selectedLesson === 'all' ? 'គ្រប់មេរៀន' : this.selectedLesson;
      sub.textContent = `${gText} • ${lText}`;
    }

    this.updateDefenderUI();
    this.nextDefenderWave();
  }

  updateDefenderUI() {
    const scoreEl = document.getElementById('defenderScoreText');
    const livesEl = document.getElementById('defenderLivesText');
    if (scoreEl) scoreEl.textContent = this.defenderScore;
    if (livesEl) {
      if (this.defenderLives >= 900) {
        livesEl.textContent = '🛡️ សេរី';
      } else {
        livesEl.textContent = '❤️'.repeat(Math.max(0, this.defenderLives));
      }
    }
  }

  updateDefenderTimerDisplay() {
    const totalMs = this.defenderDuration * 1000;
    const remainMs = Math.max(0, this.defenderTimeRemainingMs);
    const secRemain = Math.ceil(remainMs / 1000);

    const timeTextEl = document.getElementById('defenderTimeLeftText');
    if (timeTextEl) {
      if (secRemain >= 60) {
        const m = Math.floor(secRemain / 60);
        const s = secRemain % 60;
        timeTextEl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
      } else {
        timeTextEl.textContent = `${secRemain}s`;
      }

      if (secRemain <= 5) {
        timeTextEl.className = "font-mono text-xl font-black text-red-400 animate-pulse";
      } else if (secRemain <= 10) {
        timeTextEl.className = "font-mono text-xl font-black text-amber-400";
      } else {
        timeTextEl.className = "font-mono text-xl font-black text-emerald-400";
      }
    }

    const timerBar = document.getElementById('defenderTimerProgress');
    if (timerBar) {
      const pct = (remainMs / totalMs) * 100;
      timerBar.style.width = `${pct}%`;
      if (pct < 20) {
        timerBar.className = "h-full bg-red-500 rounded-full transition-all duration-100";
      } else if (pct < 50) {
        timerBar.className = "h-full bg-amber-400 rounded-full transition-all duration-100";
      } else {
        timerBar.className = "h-full bg-emerald-400 rounded-full transition-all duration-100";
      }
    }
  }

  nextDefenderWave() {
    clearInterval(this.defenderTimer);
    this.defenderPaused = false;
    const overlay = document.getElementById('defenderPauseOverlay');
    if (overlay) overlay.classList.add('hidden');
    const pauseBtn = document.getElementById('btnPauseDefender');
    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;

    const pool = this.getFilteredQuestions();
    this.currentDefenderQ = pool[Math.floor(Math.random() * pool.length)];

    const meteorEl = document.getElementById('defenderMeteor');
    const qTextEl = document.getElementById('defenderQuestionContent');
    const optionsGrid = document.getElementById('defenderOptionsGrid');

    if (qTextEl) qTextEl.innerHTML = this.formatMath(this.currentDefenderQ.q);

    this.defenderTimeRemainingMs = this.defenderDuration * 1000;
    if (meteorEl) {
      meteorEl.style.top = '8%';
      meteorEl.classList.remove('opacity-0', 'scale-0');
    }

    this.updateDefenderTimerDisplay();

    if (optionsGrid) {
      optionsGrid.innerHTML = this.currentDefenderQ.o.map((opt, idx) => `
        <button class="defender-opt-btn p-4 rounded-2xl bg-indigo-900/80 hover:bg-purple-600 border-2 border-indigo-500 text-white font-bold text-base md:text-xl transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95" data-idx="${idx}">
          <span class="w-8 h-8 rounded-xl bg-purple-500/50 text-white font-extrabold flex items-center justify-center text-sm shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.defender-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx, 10);
          this.handleDefenderShot(selected);
        });
      });
    }

    this.runDefenderTimer();
  }

  runDefenderTimer() {
    clearInterval(this.defenderTimer);
    const totalMs = this.defenderDuration * 1000;
    const meteorEl = document.getElementById('defenderMeteor');

    this.defenderTimer = setInterval(() => {
      if (this.defenderPaused) return;

      this.defenderTimeRemainingMs -= 100;
      if (this.defenderTimeRemainingMs < 0) this.defenderTimeRemainingMs = 0;

      const elapsedRatio = 1 - (this.defenderTimeRemainingMs / totalMs);
      if (meteorEl) {
        meteorEl.style.top = `${8 + (elapsedRatio * 68)}%`;
      }

      this.updateDefenderTimerDisplay();

      if (this.defenderTimeRemainingMs <= 0) {
        clearInterval(this.defenderTimer);
        this.handleDefenderTimeout();
      }
    }, 100);
  }

  handleDefenderTimeout() {
    this.playWrongSound();
    if (this.defenderLives < 900) {
      this.defenderLives--;
    }
    this.updateDefenderUI();

    const isGameOver = this.defenderLives <= 0;
    const correctText = this.currentDefenderQ ? this.formatMath(this.currentDefenderQ.o[this.currentDefenderQ.a]) : '';
    const expText = this.currentDefenderQ && this.currentDefenderQ.e ? this.formatMath(this.currentDefenderQ.e) : '';

    window.showStandardDialog({
      title: isGameOver ? '💥 ហ្គេមចប់ហើយ! ពិបាកចិត្តណាស់...' : '😭 អូយ! អស់ពេលហើយ... ពិបាកចិត្តណាស់!',
      html: `
        <div class="py-2 text-center">
          <div class="w-24 h-24 mx-auto mb-3 bg-red-50 dark:bg-red-950/50 rounded-full border-2 border-red-300 dark:border-red-800 flex items-center justify-center shadow-inner relative animate-bounce">
            <span class="text-6xl">😭</span>
            <span class="absolute -bottom-1 -right-1 text-2xl">💔</span>
          </div>
          <h4 class="text-base font-extrabold text-red-600 dark:text-red-400 mb-1">
            ${isGameOver ? 'អាចម៍ផ្កាយបានធ្លាក់មកដល់ដី! ខែលការពារអស់ហើយ!' : 'អាចម៍ផ្កាយធ្លាក់ដល់ដី! បាត់បង់ ១ ជីវិត'}
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
            ${isGameOver ? 'កុំទាន់អស់សង្ឃឹម សាកល្បងម្ដងទៀតណា៎!' : (this.defenderLives >= 900 ? 'របៀបហ្វឹកហាត់សេរី' : `នៅសល់ខែលការពារ៖ ${'❤️'.repeat(Math.max(0, this.defenderLives))}`)}
          </p>

          <div class="p-3.5 my-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 text-left">
            <div class="font-bold mb-1">✅ ចម្លើយត្រឹមត្រូវគឺ៖ <span class="text-sm font-extrabold text-emerald-600">${correctText}</span></div>
            ${expText ? `<div class="mt-1.5 pt-1.5 border-t border-red-200/60 dark:border-red-800/60 text-[11px] text-slate-600 dark:text-slate-300">${expText}</div>` : ''}
          </div>

          <div class="text-center font-bold text-sm text-slate-700 dark:text-slate-200">
            ${isGameOver ? `ពិន្ទុសរុប៖ <span class="text-amber-500 font-black text-xl">${this.defenderScore}</span> ពិន្ទុ` : `ពិន្ទុបច្ចុប្បន្ន៖ <span class="text-purple-600 font-black">${this.defenderScore}</span>`}
          </div>
        </div>
      `,
      icon: 'error',
      confirmText: isGameOver ? '🔄 ចាប់ផ្ដើមលេងម្ដងទៀត' : '👉 បន្តសំណួរបន្ទាប់',
      onConfirm: () => {
        if (isGameOver) {
          this.startDefenderGame();
        } else {
          this.nextDefenderWave();
        }
      }
    });
  }

  handleDefenderShot(selectedIdx) {
    clearInterval(this.defenderTimer);
    const isCorrect = selectedIdx === this.currentDefenderQ.a;

    if (isCorrect) {
      this.playTone(880, 'square', 0.1);
      setTimeout(() => this.playTone(1200, 'square', 0.2), 80);
      this.defenderScore += 15;
      this.updateDefenderUI();

      const meteorEl = document.getElementById('defenderMeteor');
      if (meteorEl) {
        meteorEl.classList.add('scale-0', 'opacity-0');
      }

      if (typeof confetti === 'function') {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.4 } });
      }

      setTimeout(() => this.nextDefenderWave(), 800);
    } else {
      this.playWrongSound();
      if (this.defenderLives < 900) {
        this.defenderLives--;
      }
      this.updateDefenderUI();

      const isGameOver = this.defenderLives <= 0;
      const correctText = this.currentDefenderQ ? this.formatMath(this.currentDefenderQ.o[this.currentDefenderQ.a]) : '';
      const expText = this.currentDefenderQ && this.currentDefenderQ.e ? this.formatMath(this.currentDefenderQ.e) : '';

      window.showStandardDialog({
        title: isGameOver ? '💥 ហ្គេមចប់ហើយ! ពិបាកចិត្តណាស់...' : '😭 អូយ! ឆ្លើយខុសហើយ... ពិបាកចិត្តណាស់!',
        html: `
          <div class="py-2 text-center">
            <div class="w-24 h-24 mx-auto mb-3 bg-red-50 dark:bg-red-950/50 rounded-full border-2 border-red-300 dark:border-red-800 flex items-center justify-center shadow-inner relative animate-bounce">
              <span class="text-6xl">😭</span>
              <span class="absolute -bottom-1 -right-1 text-2xl">💔</span>
            </div>
            
            <h4 class="text-base font-extrabold text-red-600 dark:text-red-400 mb-1">
              ${isGameOver ? 'បាញ់ខុស! ខែលការពារត្រូវបានកម្ទេចអស់ហើយ!' : 'ឆ្លើយខុសហើយ! បាត់បង់ ១ ជីវិត'}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
              ${isGameOver ? 'កុំទាន់អស់សង្ឃឹម សាកល្បងម្ដងទៀតណា៎!' : (this.defenderLives >= 900 ? 'របៀបហ្វឹកហាត់សេរី' : `នៅសល់ខែលការពារ៖ ${'❤️'.repeat(Math.max(0, this.defenderLives))}`)}
            </p>

            <div class="p-3.5 my-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 text-left">
              <div class="font-bold mb-1">✅ ចម្លើយត្រឹមត្រូវគឺ៖ <span class="text-sm font-extrabold text-emerald-600">${correctText}</span></div>
              ${expText ? `<div class="mt-1.5 pt-1.5 border-t border-red-200/60 dark:border-red-800/60 text-[11px] text-slate-600 dark:text-slate-300">${expText}</div>` : ''}
            </div>

            <div class="text-center font-bold text-sm text-slate-700 dark:text-slate-200">
              ${isGameOver ? `ពិន្ទុសរុប៖ <span class="text-amber-500 font-black text-xl">${this.defenderScore}</span> ពិន្ទុ` : `ពិន្ទុបច្ចុប្បន្ន៖ <span class="text-purple-600 font-black">${this.defenderScore}</span>`}
            </div>
          </div>
        `,
        icon: 'error',
        confirmText: isGameOver ? '🔄 ចាប់ផ្ដើមលេងម្ដងទៀត' : '👉 បន្តសំណួរបន្ទាប់',
        onConfirm: () => {
          if (isGameOver) {
            this.startDefenderGame();
          } else {
            this.nextDefenderWave();
          }
        }
      });
    }
  }
}

window.mathGames = new MathGamesEngine();

// Auto-initialize filters and game controls when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const gradeSelect = document.getElementById('filterGameGrade');
  const lessonSelect = document.getElementById('filterGameLesson');

  if (gradeSelect) {
    gradeSelect.addEventListener('change', (e) => {
      window.mathGames.selectedGrade = e.target.value;
      window.mathGames.updateLessonDropdown();
      window.mathGames.updateQuestionCountBadge();
    });
  }

  if (lessonSelect) {
    lessonSelect.addEventListener('change', (e) => {
      window.mathGames.selectedLesson = e.target.value;
      window.mathGames.updateQuestionCountBadge();
    });
  }

  // Initialize interactive game controls for all 5 modes
  window.mathGames.initBlitzControls();
  window.mathGames.initMatchControls();
  window.mathGames.initBattleControls();
  window.mathGames.initMillionaireControls();
  window.mathGames.initDefenderControls();

  // Populate initial dropdowns
  window.mathGames.updateLessonDropdown();
  window.mathGames.updateQuestionCountBadge();
});
