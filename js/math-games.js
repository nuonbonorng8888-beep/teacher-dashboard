/**
 * NGS Interactive Math Games Engine with Curriculum Database (5,470 Questions)
 * Filterable by Grade (7, 8, 9, 10, 11, 12) and Lesson / Topic
 * Specially Crafted for Teacher Nuon Bonorng (Bonorng11)
 */

class MathGamesEngine {
  constructor() {
    this.audioCtx = null;
    this.selectedGrade = 'all';
    this.selectedLesson = 'all';
    
    // Blitz State
    this.blitzScore = 0;
    this.blitzStreak = 0;
    this.blitzTimer = null;
    this.blitzTimeLeft = 15;
    this.currentBlitzQ = null;

    // Team Battle State
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';
    this.currentBattleQ = null;

    // Millionaire State
    this.millionaireLevel = 1;
    this.currentMillionaireQ = null;
    this.lifeline5050Used = false;
    this.lifelineStudentUsed = false;
    this.lifelineHintUsed = false;

    // Space Defender State
    this.defenderScore = 0;
    this.defenderLives = 3;
    this.defenderSpeed = 20; // seconds to drop
    this.defenderTimer = null;
    this.currentDefenderQ = null;
    this.defenderProgress = 0;

    // Fallback core formula pairs for Memory Match (Guaranteed 100% Unique)
    this.formulaPairs = [
      { id: 1, left: "\\sin^2(x) + \\cos^2(x)", right: "1" },
      { id: 2, left: "(a + b)^2", right: "a^2 + 2ab + b^2" },
      { id: 3, left: "a^2 - b^2", right: "(a - b)(a + b)" },
      { id: 4, left: "\\tan(x)", right: "\\frac{\\sin(x)}{\\cos(x)}" },
      { id: 5, left: "\\frac{d}{dx}[x^n]", right: "n \\cdot x^{n-1}" },
      { id: 6, left: "\\frac{d}{dx}[\\sin(x)]", right: "\\cos(x)" },
      { id: 7, left: "i^2", right: "-1" },
      { id: 8, left: "\\log(a \\cdot b)", right: "\\log(a) + \\log(b)" },
      { id: 9, left: "\\int 2x\\,dx", right: "x^2 + C" },
      { id: 10, left: "\\cos(2x)", right: "\\cos^2(x) - \\sin^2(x)" },
      { id: 11, left: "\\lim_{x \\to +\\infty} \\frac{1}{x}", right: "0" },
      { id: 12, left: "\\frac{d}{dx}[e^x]", right: "e^x" }
    ];

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
      lessonSelect.innerHTML = `<option value="all">គ្រប់មេរៀនទាំងអស់</option>`;
      return;
    }

    let lessons = [];
    if (this.selectedGrade === 'all') {
      // Collect all lessons across all grades
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
    if (!badge) return;
    const questions = this.getFilteredQuestions();
    badge.textContent = `🎯 មាន ${questions.length} សំណួរ`;
  }

  /* ================== LATEX & AUDIO HELPERS ================== */
  formatMath(text) {
    if (!text) return '';
    if (typeof katex === 'undefined') return text;
    return text.replace(/\$([^\$]+)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { throwOnError: false, displayMode: false });
      } catch (e) {
        return formula;
      }
    });
  }

  renderLatex(formula, displayMode = false) {
    if (!formula) return '';
    if (typeof katex === 'undefined') return formula;
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: displayMode });
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

    if (mode === 'blitz') this.startBlitzGame();
    else if (mode === 'match') this.initFormulaMatch();
    else if (mode === 'battle') this.initTeamBattle();
    else if (mode === 'millionaire') this.startMillionaireGame();
    else if (mode === 'defender') this.startDefenderGame();
  }

  /* ================== GAME 1: MATH SPEED BLITZ ================== */
  startBlitzGame() {
    this.blitzScore = 0;
    this.blitzStreak = 0;
    this.updateBlitzUI();
    this.nextBlitzQuestion();
  }

  nextBlitzQuestion() {
    clearInterval(this.blitzTimer);
    this.blitzTimeLeft = 15;
    const pool = this.getFilteredQuestions();
    const randomIndex = Math.floor(Math.random() * pool.length);
    this.currentBlitzQ = pool[randomIndex];

    const questionEl = document.getElementById('blitzQuestionText');
    const topicEl = document.getElementById('blitzTopic');
    const gradeEl = document.getElementById('blitzGrade');
    const optionsContainer = document.getElementById('blitzOptionsContainer');
    const timerBar = document.getElementById('blitzTimerBar');

    if (questionEl) questionEl.innerHTML = this.formatMath(this.currentBlitzQ.q);
    if (topicEl) topicEl.textContent = this.currentBlitzQ.p || this.currentBlitzQ.l || 'មេរៀនគណិត';
    if (gradeEl) gradeEl.textContent = this.currentBlitzQ.g;

    if (optionsContainer) {
      optionsContainer.innerHTML = this.currentBlitzQ.o.map((opt, idx) => `
        <button class="blitz-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700 font-bold text-base md:text-xl text-slate-800 dark:text-white transition transform active:scale-95 shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="katex-content flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.blitz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx);
          this.handleBlitzAnswer(selected, btn);
        });
      });
    }

    this.blitzTimer = setInterval(() => {
      this.blitzTimeLeft--;
      const timeDisplay = document.getElementById('blitzTimerText');
      if (timeDisplay) timeDisplay.textContent = `${this.blitzTimeLeft}s`;
      if (timerBar) {
        const pct = (this.blitzTimeLeft / 15) * 100;
        timerBar.style.width = `${pct}%`;
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
      setTimeout(() => this.nextBlitzQuestion(), 1200);
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
      <div class="p-4 rounded-2xl ${correct ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} border text-center font-bold text-sm">
        <div>${msg}</div>
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
  initFormulaMatch() {
    const container = document.getElementById('formulaMatchGrid');
    if (!container) return;

    const shuffledPairs = [...this.formulaPairs].sort(() => Math.random() - 0.5);
    const selected = [];
    const usedRights = new Set();
    const usedLefts = new Set();

    for (const p of shuffledPairs) {
      if (!usedRights.has(p.right) && !usedLefts.has(p.left)) {
        selected.push(p);
        usedRights.add(p.right);
        usedLefts.add(p.left);
        if (selected.length === 6) break;
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
    let matchedCount = 0;

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
            matchedCount++;

            if (matchedCount === 6) {
              this.playVictoryFanfare();
              setTimeout(() => {
                alert('🎉 អបអរសាទរ! សិស្សានុសិស្សបានផ្គូផ្គងរូបមន្តគណិតវិទ្យាបានត្រឹមត្រូវទាំងអស់!');
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
            }, 1000);
          }
        }
      });
    });
  }

  /* ================== GAME 3: TEAM BATTLE (RED VS BLUE) ================== */
  initTeamBattle() {
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';
    this.updateBattleUI();
    this.nextBattleQuestion();
  }

  updateBattleUI() {
    const aScore = document.getElementById('battleScoreTeamA');
    const bScore = document.getElementById('battleScoreTeamB');
    const turnEl = document.getElementById('battleActiveTurn');

    if (aScore) aScore.textContent = this.teamAScore;
    if (bScore) bScore.textContent = this.teamBScore;
    if (turnEl) {
      turnEl.innerHTML = this.activeTeam === 'A' ? 
        `<span class="px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-xs shadow-sm">វេនក្រុមទី ១ (ក្រុមក្រហម) 🔴</span>` :
        `<span class="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs shadow-sm">វេនក្រុមទី ២ (ក្រុមខៀវ) 🔵</span>`;
    }
  }

  nextBattleQuestion() {
    const pool = this.getFilteredQuestions();
    const randomIndex = Math.floor(Math.random() * pool.length);
    const q = pool[randomIndex];
    this.currentBattleQ = q;

    const qEl = document.getElementById('battleQuestionText');
    const optContainer = document.getElementById('battleOptionsContainer');

    if (qEl) qEl.innerHTML = this.formatMath(q.q);

    if (optContainer) {
      optContainer.innerHTML = q.o.map((opt, idx) => `
        <button class="battle-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 font-bold text-base md:text-xl text-slate-800 dark:text-white transition shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.battle-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx);
          if (selected === q.a) {
            this.playCorrectSound();
            if (this.activeTeam === 'A') this.teamAScore += 10;
            else this.teamBScore += 10;
            if (typeof confetti === 'function') confetti({ particleCount: 60, spread: 70 });
          } else {
            this.playWrongSound();
          }

          this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
          this.updateBattleUI();
          setTimeout(() => this.nextBattleQuestion(), 1000);
        });
      });
    }
  }

  /* ================== GAME 4: MATH MILLIONAIRE (សេដ្ឋីគណិតវិទ្យា) ================== */
  startMillionaireGame() {
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
    if (btnHint) { btnHint.disabled = false; btnHint.classList.remove('opacity-40', 'line-hint'); }
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
          const selected = parseInt(btn.dataset.idx);
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
          alert('🏆 អស្ចារ្យណាស់! អ្នកបានឆ្លើយត្រូវគ្រប់ ១០ សំណួរ ក្លាយជាជើងឯកគណិតវិទ្យា NGS!');
        }, 500);
      } else {
        this.millionaireLevel++;
        setTimeout(() => this.nextMillionaireQuestion(), 1300);
      }
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();
      setTimeout(() => {
        alert(`❌ ចម្លើយមិនត្រឹមត្រូវទេ! ចម្លើយត្រឹមត្រូវគឺ៖ ${this.currentMillionaireQ.o[this.currentMillionaireQ.a]}\n\nអ្នកទទួលបានពិន្ទុ៖ ${this.millionaireLevel >= 5 ? 5 : 0} ពិន្ទុ`);
        this.startMillionaireGame();
      }, 1000);
    }
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
      const idx = parseInt(b.dataset.idx);
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

    // Pick random student from roster
    const students = (window.appStore && window.appStore.data && window.appStore.data.students) || [];
    const studentName = students.length > 0 ? students[Math.floor(Math.random() * students.length)].name : 'មិត្តរួមថ្នាក់';

    const hint = `👥 សិស្សដែលត្រូវបានជ្រើសរើសឱ្យជួយឆ្លើយគឺ៖ «${studentName}»`;
    alert(hint);
    this.playTone(600, 'triangle', 0.2);
  }

  useLifelineHint() {
    if (this.lifelineHintUsed || !this.currentMillionaireQ) return;
    this.lifelineHintUsed = true;
    const btn = document.getElementById('btnLifeHint');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-40', 'line-through'); }

    const exp = this.currentMillionaireQ.e || "សូមពិនិត្យមើលរូបមន្តគន្លឹះនៃមេរៀននេះ!";
    alert(`💡 គន្លឹះដោះស្រាយ៖\n${exp}`);
    this.playTone(550, 'sine', 0.15);
  }

  /* ================== GAME 5: SPACE MATH DEFENDER (បាញ់កម្ទេចអាចម៍ផ្កាយ) ================== */
  startDefenderGame() {
    this.defenderScore = 0;
    this.defenderLives = 3;
    this.updateDefenderUI();
    this.nextDefenderWave();
  }

  updateDefenderUI() {
    const scoreEl = document.getElementById('defenderScoreText');
    const livesEl = document.getElementById('defenderLivesText');
    if (scoreEl) scoreEl.textContent = this.defenderScore;
    if (livesEl) livesEl.textContent = '❤️'.repeat(this.defenderLives);
  }

  nextDefenderWave() {
    clearInterval(this.defenderTimer);
    const pool = this.getFilteredQuestions();
    this.currentDefenderQ = pool[Math.floor(Math.random() * pool.length)];

    const meteorEl = document.getElementById('defenderMeteor');
    const qTextEl = document.getElementById('defenderQuestionContent');
    const optionsGrid = document.getElementById('defenderOptionsGrid');

    if (qTextEl) qTextEl.innerHTML = this.formatMath(this.currentDefenderQ.q);

    this.defenderProgress = 0;
    if (meteorEl) {
      meteorEl.style.top = '10%';
      meteorEl.classList.remove('opacity-0', 'scale-0');
    }

    if (optionsGrid) {
      optionsGrid.innerHTML = this.currentDefenderQ.o.map((opt, idx) => `
        <button class="defender-opt-btn p-4 rounded-2xl bg-indigo-900/80 hover:bg-purple-600 border-2 border-indigo-500 text-white font-bold text-base md:text-xl transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95" data-idx="${idx}">
          <span class="w-8 h-8 rounded-xl bg-purple-500/50 text-white font-extrabold flex items-center justify-center text-sm shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.defender-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx);
          this.handleDefenderShot(selected);
        });
      });
    }

    // Meteor Descent Animation
    this.defenderTimer = setInterval(() => {
      this.defenderProgress += 2;
      if (meteorEl) {
        meteorEl.style.top = `${10 + (this.defenderProgress * 0.7)}%`;
      }

      if (this.defenderProgress >= 100) {
        clearInterval(this.defenderTimer);
        this.playWrongSound();
        this.defenderLives--;
        this.updateDefenderUI();

        if (this.defenderLives <= 0) {
          alert(`💥 កម្ទេចខែលការពារអស់ហើយ! ពិន្ទុសរុបរបស់អ្នកគឺ៖ ${this.defenderScore}`);
          this.startDefenderGame();
        } else {
          setTimeout(() => this.nextDefenderWave(), 800);
        }
      }
    }, 200);
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
      this.defenderLives--;
      this.updateDefenderUI();

      if (this.defenderLives <= 0) {
        alert(`💥 ហ្គេមត្រូវបានបញ្ចប់! ពិន្ទុសរុប៖ ${this.defenderScore}`);
        this.startDefenderGame();
      } else {
        setTimeout(() => this.nextDefenderWave(), 800);
      }
    }
  }
}

window.mathGames = new MathGamesEngine();

// Auto-initialize filters when DOM is ready
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

  // Populate initial dropdowns
  window.mathGames.updateLessonDropdown();
  window.mathGames.updateQuestionCountBadge();
});
