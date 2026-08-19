export function generateNTeamColors(n = 2) {
  const baseHue = Math.floor(Math.random() * 360);
  const colors = [];

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (kVal) => {
      const k = (kVal + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const step = 360 / Math.max(1, n);
  for (let i = 0; i < n; i++) {
    const hue = Math.floor((baseHue + step * i) % 360);
    colors.push(hslToHex(hue, 95, 55));
  }

  return colors;
}

export function generateContrastingTeamColors() {
  const colors = generateNTeamColors(2);
  return { color1: colors[0], color2: colors[1] };
}

export class GameSession {
  constructor(questions, mode = 'classic', teamList = []) {
    this.questions = questions;
    this.mode = mode;
    this.currentIndex = 0;
    this.selectedOptionIndex = null;
    this.isRevealed = false;

    // Standardize input teams (supports array of names or objects, or default 2 teams)
    let rawTeams = [];
    if (Array.isArray(teamList) && teamList.length >= 2) {
      rawTeams = teamList;
    } else if (teamList && (teamList.team1 || teamList.team2)) {
      rawTeams = [teamList.team1 || 'Team Brass ⚙️', teamList.team2 || 'Team Steam ⚡'];
    } else {
      rawTeams = ['Team Brass ⚙️', 'Team Steam ⚡'];
    }

    const n = rawTeams.length;
    const colors = generateNTeamColors(n);

    this.teams = rawTeams.map((t, idx) => {
      const name = typeof t === 'string' ? t : (t.name || `Team ${idx + 1}`);
      const avatar = typeof t === 'object' ? t.avatar : null;
      return {
        id: idx,
        name: name,
        color: (typeof t === 'object' && t.color) ? t.color : colors[idx],
        avatar: avatar,
        score: 0,
        streak: 0,
        maxStreak: 0,
        correctCount: 0,
      };
    });

    this.activeTeamIndex = 0;

    // 3 Sequential Broadcasts before choosing
    this.maxListensPerQuestion = 3;
    this.currentListenStage = 1;
    this.isListeningPhase = true; // Options hidden during 3 sound plays
    this.isChoosingPhase = false; // Options visible, timer running

    this.timeRemaining = this.getInitialRoundTime();
    this.hintUsed = false;
    this.eliminatedIndices = new Set();
    this.history = [];
  }

  get activeTeam() {
    return this.teams[this.activeTeamIndex];
  }

  get currentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  get totalQuestions() {
    return this.questions.length;
  }

  get isGameOver() {
    return this.currentIndex >= this.questions.length;
  }

  getInitialRoundTime() {
    if (!this.currentQuestion) return 15;
    const packTimer = this.currentQuestion.timerSeconds || 15;
    if (this.mode === 'speedrun') return Math.max(6, Math.floor(packTimer * 0.65));
    if (this.mode === 'zen') return 0;
    return packTimer;
  }

  get comboMultiplier() {
    const streak = this.activeTeam.streak;
    if (streak >= 5) return 3.0;
    if (streak >= 3) return 2.0;
    if (streak >= 1) return 1.5;
    return 1.0;
  }

  setListenStage(stage) {
    this.currentListenStage = stage;
    if (stage >= this.maxListensPerQuestion) {
      this.unlockChoosingPhase();
    }
  }

  unlockChoosingPhase() {
    this.isListeningPhase = false;
    this.isChoosingPhase = true;
    this.timeRemaining = this.getInitialRoundTime();
  }

  decrementTimer(delta) {
    if (!this.isChoosingPhase || this.isRevealed || this.isGameOver || this.mode === 'zen') return false;

    this.timeRemaining = Math.max(0, this.timeRemaining - delta);
    if (this.timeRemaining <= 0) {
      this.submitAnswer(-1); // Timer Expired
      return true;
    }
    return false;
  }

  use5050Hint() {
    if (this.hintUsed || this.isRevealed || !this.currentQuestion) return [];
    this.hintUsed = true;

    const correct = this.currentQuestion.correctIndex;
    const wrong = [0, 1, 2, 3].filter((i) => i !== correct);
    wrong.sort(() => Math.random() - 0.5);

    const eliminated = wrong.slice(0, 2);
    eliminated.forEach((idx) => this.eliminatedIndices.add(idx));
    return eliminated;
  }

  submitAnswer(optionIndex) {
    if (this.isRevealed || !this.currentQuestion) return false;

    this.selectedOptionIndex = optionIndex;
    this.isRevealed = true;
    this.isListeningPhase = false;
    this.isChoosingPhase = false;

    const isCorrect = optionIndex === this.currentQuestion.correctIndex;
    let points = 0;
    const team = this.activeTeam;

    if (isCorrect) {
      team.streak++;
      team.correctCount++;
      if (team.streak > team.maxStreak) team.maxStreak = team.streak;

      const speedBonus = Math.floor(this.timeRemaining * 12);
      const basePoints = 100 * (this.currentQuestion.difficulty || 1);
      const modeBonus = this.mode === 'speedrun' ? 2.0 : 1.0;

      points = Math.floor((basePoints + speedBonus) * this.comboMultiplier * modeBonus);
      team.score += points;
    } else {
      team.streak = 0;
    }

    const roundDuration = this.getInitialRoundTime();
    this.history.push({
      roundNumber: this.currentIndex + 1,
      teamId: team.id,
      teamName: team.name,
      teamColor: team.color,
      question: this.currentQuestion,
      selectedIndex: optionIndex,
      isCorrect,
      pointsEarned: points,
      timeTaken: roundDuration - this.timeRemaining,
    });

    return isCorrect;
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length) {
      this.currentIndex++;
      // Round-Robin Turn Rotation for N Teams
      this.activeTeamIndex = (this.activeTeamIndex + 1) % this.teams.length;

      this.selectedOptionIndex = null;
      this.isRevealed = false;
      this.currentListenStage = 1;
      this.isListeningPhase = true;
      this.isChoosingPhase = false;
      this.timeRemaining = this.getInitialRoundTime();
      this.hintUsed = false;
      this.eliminatedIndices.clear();
    }
  }

  getLeaderboard() {
    return [...this.teams].sort((a, b) => b.score - a.score || b.correctCount - a.correctCount);
  }

  getWinner() {
    const sorted = this.getLeaderboard();
    const leader = sorted[0];
    const runnerUp = sorted[1];
    const isTie = sorted.length > 1 && leader.score === runnerUp.score;

    return {
      winner: isTie ? null : leader,
      loser: sorted[sorted.length - 1],
      leaderboard: sorted,
      isTie,
    };
  }
}
