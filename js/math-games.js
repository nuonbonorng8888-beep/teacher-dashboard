/**
 * NGS Interactive Math Games Engine
 * Developed for Teacher Nuon Bonorng (Bonorng11)
 */

class MathGamesEngine {
  constructor() {
    this.audioCtx = null;
    this.currentGame = null;
    this.score = 0;
    this.streak = 0;
    this.timer = null;
    this.timeLeft = 15;
    this.currentQuestion = null;
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';

    // Rich Question Bank for High School Math (Grades 10, 11, 12 NGS)
    this.questions = [
      // ត្រីកោណមាត្រ & អនុគមន៍
      {
        q: "តម្លៃនៃ sin²(θ) + cos²(θ) ស្មើនឹងប៉ុន្មាន?",
        options: ["0", "1", "2", "-1"],
        answer: 1,
        topic: "ត្រីកោណមាត្រ",
        grade: "ថ្នាក់ទី 10-12"
      },
      {
        q: "តម្លៃនៃ tan(45°) ឬ tan(π/4) ស្មើនឹងប៉ុន្មាន?",
        options: ["1/2", "√2/2", "1", "√3"],
        answer: 2,
        topic: "ត្រីកោណមាត្រ",
        grade: "ថ្នាក់ទី 10-12"
      },
      {
        q: "រូបមន្ត cos(2a) ស្មើនឹងកន្សោមមួយណា?",
        options: ["cos²(a) - sin²(a)", "2cos(a)sin(a)", "1 + sin²(a)", "2sin²(a) - 1"],
        answer: 0,
        topic: "ត្រីកោណមាត្រ",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "តម្លៃនៃ sin(90°) ឬ sin(π/2) ស្មើនឹងប៉ុន្មាន?",
        options: ["0", "1", "-1", "1/2"],
        answer: 1,
        topic: "ត្រីកោណមាត្រ",
        grade: "ថ្នាក់ទី 10"
      },

      // ពិជគណិត & សមីការ
      {
        q: "ដោះស្រាយសមីការ៖ x² - 9 = 0 ។ តម្លៃ x គឺ៖",
        options: ["x = 3", "x = -3", "x = ±3", "x = 9"],
        answer: 2,
        topic: "ពិជគណិត",
        grade: "ថ្នាក់ទី 10"
      },
      {
        q: "កន្សោមពន្លាតនៃ (a + b)² គឺ៖",
        options: ["a² + b²", "a² + 2ab + b²", "a² - 2ab + b²", "a² + ab + b²"],
        answer: 1,
        topic: "រូបមន្តពន្លាត",
        grade: "ថ្នាក់ទី 10"
      },
      {
        q: "កន្សោម (a - b)(a + b) ស្មើនឹង៖",
        options: ["a² - b²", "a² + b²", "(a - b)²", "2a - 2b"],
        answer: 0,
        topic: "រូបមន្តពន្លាត",
        grade: "ថ្នាក់ទី 10"
      },
      {
        q: "ផលបូកឫសនៃសមីការ ax² + bx + c = 0 (ទ្រឹស្តីបទវ្យែត) គឺ៖",
        options: ["S = b/a", "S = -b/a", "S = c/a", "S = -c/a"],
        answer: 1,
        topic: "ពិជគណិត",
        grade: "ថ្នាក់ទី 10-11"
      },

      // ដេរីវេ & លីមីត (ថ្នាក់ទី១១-១២)
      {
        q: "ដេរីវេនៃអនុគមន៍ f(x) = x³ គឺ៖",
        options: ["3x", "3x²", "x²", "3x³"],
        answer: 1,
        topic: "ដេរីវេ",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "ដេរីវេនៃ f(x) = sin(x) គឺ៖",
        options: ["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"],
        answer: 1,
        topic: "ដេរីវេ",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "លីមីត lim (x → 0) នៃ [sin(x) / x] ស្មើនឹង៖",
        options: ["0", "1", "+∞", "មិនកំណត់"],
        answer: 1,
        topic: "លីមីត",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "អាំងតេក្រាល ∫ 2x dx ស្មើនឹង៖",
        options: ["x² + C", "2x² + C", "x + C", "2 + C"],
        answer: 0,
        topic: "អាំងតេក្រាល",
        grade: "ថ្នាក់ទី 12"
      },
      {
        q: "ដេរីវេនៃអនុគមន៍អិចស្បូណង់ស្យែល f(x) = eˣ គឺ៖",
        options: ["xeˣ⁻¹", "eˣ", "ln(x)", "1/x"],
        answer: 1,
        topic: "ដេរីវេ",
        grade: "ថ្នាក់ទី 12"
      },
      {
        q: "តម្លៃនៃ log₁₀(100) ស្មើនឹង៖",
        options: ["10", "1", "2", "100"],
        answer: 2,
        topic: "លោការីត",
        grade: "ថ្នាក់ទី 11-12"
      },
      {
        q: "ក្នុងចំនួនកុំផ្លិច z = a + bi តម្លៃ i² ស្មើនឹង៖",
        options: ["1", "-1", "0", "√(-1)"],
        answer: 1,
        topic: "ចំនួនកុំផ្លិច",
        grade: "ថ្នាក់ទី 12"
      }
    ];

    // Formula pairs for Memory Match Game
    this.formulaPairs = [
      { id: 1, left: "sin²(x) + cos²(x)", right: "1" },
      { id: 2, left: "(a + b)²", right: "a² + 2ab + b²" },
      { id: 3, left: "a² - b²", right: "(a - b)(a + b)" },
      { id: 4, left: "tan(x)", right: "sin(x) / cos(x)" },
      { id: 5, left: "d/dx [xⁿ]", right: "n·xⁿ⁻¹" },
      { id: 6, left: "lim(x→0) sin(x)/x", right: "1" },
      { id: 7, left: "i² (កុំផ្លិច)", right: "-1" },
      { id: 8, left: "log(a·b)", right: "log(a) + log(b)" }
    ];
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
    this.playTone(523.25, 'triangle', 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.15), 100); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25), 200); // G5
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

  /* ================== GAME 1: MATH SPEED BLITZ ================== */
  startBlitzGame() {
    this.score = 0;
    this.streak = 0;
    this.updateBlitzUI();
    this.nextBlitzQuestion();
  }

  nextBlitzQuestion() {
    clearInterval(this.timer);
    this.timeLeft = 15;
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    this.currentQuestion = this.questions[randomIndex];

    const questionEl = document.getElementById('blitzQuestionText');
    const topicEl = document.getElementById('blitzTopic');
    const gradeEl = document.getElementById('blitzGrade');
    const optionsContainer = document.getElementById('blitzOptionsContainer');
    const timerBar = document.getElementById('blitzTimerBar');

    if (questionEl) questionEl.textContent = this.currentQuestion.q;
    if (topicEl) topicEl.textContent = this.currentQuestion.topic;
    if (gradeEl) gradeEl.textContent = this.currentQuestion.grade;

    if (optionsContainer) {
      optionsContainer.innerHTML = this.currentQuestion.options.map((opt, idx) => `
        <button class="blitz-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700 font-bold text-base md:text-lg text-slate-800 dark:text-white transition transform active:scale-95 shadow-sm text-center" data-idx="${idx}">
          <span class="inline-block w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 mr-2 text-sm leading-8 font-extrabold">${String.fromCharCode(65 + idx)}</span>
          ${opt}
        </button>
      `).join('');

      document.querySelectorAll('.blitz-opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const selected = parseInt(btn.dataset.idx);
          this.handleBlitzAnswer(selected, btn);
        });
      });
    }

    // Countdown Timer Bar
    this.timer = setInterval(() => {
      this.timeLeft--;
      const timeDisplay = document.getElementById('blitzTimerText');
      if (timeDisplay) timeDisplay.textContent = `${this.timeLeft}s`;
      if (timerBar) {
        const pct = (this.timeLeft / 15) * 100;
        timerBar.style.width = `${pct}%`;
        if (pct < 30) {
          timerBar.className = "h-full bg-red-500 rounded-full transition-all duration-1000";
        } else {
          timerBar.className = "h-full bg-purple-600 rounded-full transition-all duration-1000";
        }
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.playWrongSound();
        this.streak = 0;
        this.updateBlitzUI();
        this.showBlitzFeedback(false, "អស់ពេលហើយ! ចម្លើយត្រឹមត្រូវគឺ៖ " + this.currentQuestion.options[this.currentQuestion.answer]);
      }
    }, 1000);
  }

  handleBlitzAnswer(selectedIdx, clickedBtn) {
    clearInterval(this.timer);
    const isCorrect = selectedIdx === this.currentQuestion.answer;

    document.querySelectorAll('.blitz-opt-btn').forEach(btn => btn.disabled = true);

    if (isCorrect) {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
      this.playCorrectSound();
      this.score += 10 + (this.streak * 2);
      this.streak++;
      if (this.streak >= 3 && typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      this.updateBlitzUI();
      setTimeout(() => this.nextBlitzQuestion(), 1200);
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();
      this.streak = 0;
      this.updateBlitzUI();
      this.showBlitzFeedback(false, "មិនត្រឹមត្រូវទេ! ចម្លើយគឺ៖ " + this.currentQuestion.options[this.currentQuestion.answer]);
    }
  }

  showBlitzFeedback(correct, msg) {
    const feedbackBox = document.getElementById('blitzFeedbackBox');
    if (!feedbackBox) return;
    feedbackBox.innerHTML = `
      <div class="p-4 rounded-2xl ${correct ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} border text-center font-bold text-sm">
        ${msg}
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
    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = this.streak;
  }

  /* ================== GAME 2: FORMULA MEMORY MATCH ================== */
  initFormulaMatch() {
    const container = document.getElementById('formulaMatchGrid');
    if (!container) return;

    // Pick 6 pairs (12 cards)
    const selected = this.formulaPairs.slice(0, 6);
    let cards = [];
    selected.forEach(p => {
      cards.push({ id: p.id, text: p.left, type: 'left' });
      cards.push({ id: p.id, text: p.right, type: 'right' });
    });

    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);

    container.innerHTML = cards.map((c, idx) => `
      <div class="match-card relative h-28 cursor-pointer rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center p-3 text-center font-bold text-sm md:text-base shadow-md hover:scale-105 transition transform select-none" data-id="${c.id}" data-idx="${idx}">
        <span class="card-front text-2xl font-extrabold">❓</span>
        <span class="card-back hidden p-2 font-mono leading-tight">${c.text}</span>
      </div>
    `).join('');

    let firstSelected = null;
    let lockBoard = false;
    let matchedCount = 0;

    document.querySelectorAll('.match-card').forEach(card => {
      card.addEventListener('click', () => {
        if (lockBoard || card === firstSelected || card.classList.contains('matched')) return;

        // Flip open
        card.querySelector('.card-front').classList.add('hidden');
        card.querySelector('.card-back').classList.remove('hidden');
        card.classList.remove('from-purple-500', 'to-indigo-600');
        card.classList.add('bg-white', 'text-purple-900', 'border-2', 'border-purple-500');
        this.playTone(440, 'sine', 0.08);

        if (!firstSelected) {
          firstSelected = card;
        } else {
          // Compare
          lockBoard = true;
          const match = firstSelected.dataset.id === card.dataset.id;
          if (match) {
            this.playCorrectSound();
            firstSelected.classList.add('matched', 'bg-green-100', 'border-green-500', 'text-green-800');
            card.classList.add('matched', 'bg-green-100', 'border-green-500', 'text-green-800');
            firstSelected = null;
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
            setTimeout(() => {
              // Flip back
              [firstSelected, card].forEach(c => {
                c.querySelector('.card-front').classList.remove('hidden');
                c.querySelector('.card-back').classList.add('hidden');
                c.classList.remove('bg-white', 'text-purple-900', 'border-2', 'border-purple-500');
                c.classList.add('from-purple-500', 'to-indigo-600');
              });
              firstSelected = null;
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
      if (this.activeTeam === 'A') {
        turnEl.innerHTML = `<span class="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold">វេនក្រុមទី ១ (ក្រុមក្រហម) 🔴</span>`;
      } else {
        turnEl.innerHTML = `<span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">វេនក្រុមទី ២ (ក្រុមខៀវ) 🔵</span>`;
      }
    }
  }

  nextBattleQuestion() {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    const q = this.questions[randomIndex];

    const qEl = document.getElementById('battleQuestionText');
    const optContainer = document.getElementById('battleOptionsContainer');

    if (qEl) qEl.textContent = q.q;
    if (optContainer) {
      optContainer.innerHTML = q.options.map((opt, idx) => `
        <button class="battle-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 font-bold text-base md:text-lg text-slate-800 dark:text-white transition shadow-sm text-center" data-idx="${idx}">
          <span class="inline-block w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 mr-2 text-sm leading-8 font-extrabold">${String.fromCharCode(65 + idx)}</span>
          ${opt}
        </button>
      `).join('');

      document.querySelectorAll('.battle-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx);
          if (selected === q.answer) {
            this.playCorrectSound();
            if (this.activeTeam === 'A') {
              this.teamAScore += 10;
            } else {
              this.teamBScore += 10;
            }
            if (typeof confetti === 'function') confetti({ particleCount: 60, spread: 70 });
          } else {
            this.playWrongSound();
          }

          // Switch team
          this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
          this.updateBattleUI();
          setTimeout(() => this.nextBattleQuestion(), 1000);
        });
      });
    }
  }
}

window.mathGames = new MathGamesEngine();
