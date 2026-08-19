import { soundPackManager } from '../data/soundPackManager.js';
import { soundEngine } from './soundEngine.js';
import { convertFileToBase64, convertAudioUrlToBase64 } from './base64Audio.js';
import { googleAuth } from '../auth/googleAuth.js';
import { ThemeSceneEngine } from '../three/themeSceneEngine.js';
import { GlbManager } from '../three/glbManager.js';
import confetti from 'canvas-confetti';

export const MAX_PACK_BYTES = 100 * 1024 * 1024; // 100 Megabytes

export class SoundPackWizard {
  constructor() {
    this.packData = {
      name: '',
      description: '',
      author: 'Captain Clockwork',
      timerSeconds: 15,
      icon: '📦',
      totalQuestions: 5,
      currentQuestionIndex: 0,
      questions: [],
    };
    this.currentBase64Audio = null;
    this.currentBase64Glb = null;
    this.onPackSavedCallback = null;
    this.onPlayTestCallback = null;
    this.onInspect3DCallback = null;
  }

  init({ onPackSaved, onPlayTest, onInspect3D }) {
    this.onPackSavedCallback = onPackSaved;
    this.onPlayTestCallback = onPlayTest;
    this.onInspect3DCallback = onInspect3D;
    this._bindElements();
    this._setupStage1();
    this._setupStage2();
    this._setupStage3();
    this.reset();
  }

  _bindElements() {
    // Stepper indicators
    this.step1Ind = document.getElementById('wiz-step-1-ind');
    this.step2Ind = document.getElementById('wiz-step-2-ind');
    this.step3Ind = document.getElementById('wiz-step-3-ind');

    // Stages
    this.stage1 = document.getElementById('wiz-stage-pack-info');
    this.stage2 = document.getElementById('wiz-stage-question-builder');
    this.stage3 = document.getElementById('wiz-stage-review');

    // Size Budget Meters
    this.sizeMeterVal = document.getElementById('size-meter-val');
    this.sizeMeterFill = document.getElementById('size-meter-fill');
    this.sizeMeterValReview = document.getElementById('size-meter-val-review');
    this.sizeMeterFillReview = document.getElementById('size-meter-fill-review');

    // Stage 1 fields
    this.inputPackName = document.getElementById('wiz-pack-name');
    this.inputPackDesc = document.getElementById('wiz-pack-desc');
    this.inputPackAuthor = document.getElementById('wiz-pack-author');
    this.inputPackTimer = document.getElementById('wiz-pack-timer');
    this.inputPackIcon = document.getElementById('wiz-pack-icon');
    this.inputNRiddleCount = document.getElementById('wiz-n-riddle-count');
    this.btnStepperMinus = document.getElementById('btn-stepper-minus');
    this.btnStepperPlus = document.getElementById('btn-stepper-plus');
    this.btnGotoQuestions = document.getElementById('btn-wiz-goto-questions');

    // Stage 2 fields
    this.qIndexPill = document.getElementById('wiz-q-index-pill');
    this.qStatus = document.getElementById('wiz-q-completion-status');
    this.qPillsContainer = document.getElementById('wiz-q-pills-container');
    this.btnAddRiddleStepper = document.getElementById('btn-wiz-add-riddle-stepper');
    this.btnDeleteRiddle = document.getElementById('btn-wiz-delete-riddle');

    this.inputQTitle = document.getElementById('wiz-q-title');
    this.inputQCategory = document.getElementById('wiz-q-category');
    this.inputQHint = document.getElementById('wiz-q-hint');
    this.selectQScene = document.getElementById('wiz-q-scene');
    this.inputQGlbFile = document.getElementById('wiz-q-glb-file');
    this.badgeQGlb = document.getElementById('wiz-q-glb-badge');
    this.btnBakeGlb = document.getElementById('btn-wiz-bake-glb');
    this.inputQSceneScript = document.getElementById('wiz-q-scene-script');
    this.selectQScriptPreset = document.getElementById('wiz-q-script-preset');
    this.selectQSynth = document.getElementById('wiz-q-synth');
    this.inputQAudioFile = document.getElementById('wiz-q-audio-file');
    this.inputQAudioUrl = document.getElementById('wiz-q-audio-url');
    this.badgeQBase64 = document.getElementById('wiz-q-base64-badge');
    this.btnTestAudio = document.getElementById('btn-wiz-test-audio');

    this.inputOpt0 = document.getElementById('wiz-opt-0');
    this.inputOpt1 = document.getElementById('wiz-opt-1');
    this.inputOpt2 = document.getElementById('wiz-opt-2');
    this.inputOpt3 = document.getElementById('wiz-opt-3');

    this.inputRevTitle = document.getElementById('wiz-rev-title');
    this.inputRevDesc = document.getElementById('wiz-rev-desc');
    this.inputRevFact = document.getElementById('wiz-rev-fact');

    this.btnPrevQuestion = document.getElementById('btn-wiz-prev-question');
    this.btnBackToInfo = document.getElementById('btn-wiz-back-to-info');
    this.btnAddNewRiddle = document.getElementById('btn-wiz-add-new-riddle');
    this.btnNextQuestion = document.getElementById('btn-wiz-next-question');
    this.btnNextLabel = document.getElementById('btn-wiz-next-label');

    // Stage 3 fields
    this.reviewIcon = document.getElementById('wiz-review-icon');
    this.reviewName = document.getElementById('wiz-review-name');
    this.reviewMeta = document.getElementById('wiz-review-meta');
    this.reviewList = document.getElementById('wiz-review-list');
    this.btnReviewBack = document.getElementById('btn-wiz-review-back');
    this.btnExportJson = document.getElementById('btn-wiz-export-json');
    this.btnSaveActivate = document.getElementById('btn-wiz-save-activate');
    this.btnPlayTestNow = document.getElementById('btn-wiz-play-test-now');
  }

  reset() {
    const user = googleAuth.getUser();
    this.packData = {
      name: '',
      description: '',
      author: user?.name || 'Captain Clockwork',
      timerSeconds: 15,
      icon: '📦',
      totalQuestions: 5,
      currentQuestionIndex: 0,
      questions: [],
    };
    this.currentBase64Audio = null;

    if (this.inputPackAuthor) this.inputPackAuthor.value = this.packData.author;
    if (this.inputPackTimer) this.inputPackTimer.value = 15;
    if (this.inputPackName) this.inputPackName.value = '';
    if (this.inputPackDesc) this.inputPackDesc.value = '';
    if (this.inputRiddleCount) this.inputRiddleCount.value = 5;

    this._initQuestionsArray(5);
    this.updateSizeBudgetUI();
    this.goToStage(1);
  }

  _initQuestionsArray(count) {
    count = Math.max(1, count);
    this.packData.totalQuestions = count;
    this.packData.questions = [];

    const defaultScenes = [
      'pool_flamingo',
      'sizzling_bacon',
      'mac_and_cheese',
      'soda_can',
      'laser_blaster',
      'dog_tippytaps',
      'chainsaw_engine',
      'flip_flops',
      'stubbed_toe',
      'squeaky_dog',
      'bike_pump',
      'massage_gun',
      'kettlebell_thud',
      'cat_hiss',
    ];
    const defaultSynths = [
      'panting_groan',
      'bacon_sizzle',
      'mac_cheese',
      'soda_pop',
      'laser_pew',
      'dog_taps',
      'chainsaw_rev',
      'flip_flops',
      'stubbed_toe',
      'squeaky_duck',
      'bike_pump',
      'massage_gun',
      'heavy_thud',
      'cat_angry_hiss',
    ];

    for (let i = 0; i < count; i++) {
      this.packData.questions.push(this._createEmptyQuestion(i, defaultScenes[i % defaultScenes.length], defaultSynths[i % defaultSynths.length]));
    }
  }

  _createEmptyQuestion(index, scene = 'pool_flamingo', synth = 'panting_groan') {
    return {
      id: `wiz_q_${Date.now()}_${index}`,
      title: '',
      category: 'workoutVsDaily',
      soundHint: '',
      sceneGlb: null,
      sceneModel: scene,
      sceneScript: null,
      synthPreset: synth,
      audioUrl: null,
      audioSizeBytes: 0,
      timerSeconds: this.packData.timerSeconds || 15,
      options: ['', '', '', ''],
      correctIndex: 0,
      revealTitle: '',
      revealExplanation: '',
      funFact: '',
      isCompleted: false,
    };
  }

  calculateTotalPackBytes() {
    let bytes = 0;
    // Basic pack metadata size
    bytes += (this.packData.name?.length || 0) * 2;
    bytes += (this.packData.description?.length || 0) * 2;

    this.packData.questions.forEach((q) => {
      if (q.audioUrl && typeof q.audioUrl === 'string') {
        bytes += q.audioUrl.length; // Base64 character bytes
      }
      if (q.sceneGlb && typeof q.sceneGlb === 'string') {
        bytes += q.sceneGlb.length; // Base64 GLB character bytes
      }
      bytes += (q.title?.length || 0) * 2;
      bytes += (q.soundHint?.length || 0) * 2;
      bytes += (q.revealTitle?.length || 0) * 2;
      bytes += (q.revealExplanation?.length || 0) * 2;
      bytes += (q.funFact?.length || 0) * 2;
      if (Array.isArray(q.options)) {
        q.options.forEach((opt) => (bytes += (opt?.length || 0) * 2));
      }
    });

    return bytes;
  }

  updateSizeBudgetUI() {
    const totalBytes = this.calculateTotalPackBytes();
    const mbUsed = (totalBytes / (1024 * 1024)).toFixed(2);
    const pct = Math.min(100, (totalBytes / MAX_PACK_BYTES) * 100);

    // Only display memory warning meter if pack size is exceeded or near 100 MB capacity
    const meter = document.getElementById('pack-size-budget-meter');
    if (meter) {
      if (totalBytes > MAX_PACK_BYTES || pct > 90) {
        meter.style.display = 'block';
        if (this.sizeMeterVal) {
          this.sizeMeterVal.textContent = totalBytes > MAX_PACK_BYTES ? `⚠️ Exceeded: ${mbUsed} MB / 100 MB` : `⚠️ High Memory: ${mbUsed} MB (${pct.toFixed(0)}%)`;
          this.sizeMeterVal.style.color = '#ff3366';
        }
      } else {
        meter.style.display = 'none';
      }
    }

    if (this.sizeMeterFill) {
      this.sizeMeterFill.style.width = `${pct}%`;
      this.sizeMeterFill.style.background = pct > 90 ? 'linear-gradient(90deg, #ff9900, #ff3366)' : 'linear-gradient(90deg, #00ff88, var(--primary))';
    }
  }

  _setupStage1() {
    // Icon picker
    if (this.iconPicker) {
      this.iconPicker.querySelectorAll('.icon-pick-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.iconPicker.querySelectorAll('.icon-pick-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.packData.icon = btn.dataset.icon || '📦';
          soundEngine.playClick();
        });
      });
    }

    // Number of riddles stepper input
    if (this.btnCountDec) {
      this.btnCountDec.addEventListener('click', () => {
        const val = Math.max(1, (parseInt(this.inputRiddleCount.value, 10) || 5) - 1);
        this.inputRiddleCount.value = val;
        this._initQuestionsArray(val);
        soundEngine.playClick();
      });
    }

    if (this.btnCountInc) {
      this.btnCountInc.addEventListener('click', () => {
        const val = Math.min(100, (parseInt(this.inputRiddleCount.value, 10) || 5) + 1);
        this.inputRiddleCount.value = val;
        this._initQuestionsArray(val);
        soundEngine.playClick();
      });
    }

    if (this.inputRiddleCount) {
      this.inputRiddleCount.addEventListener('change', () => {
        let val = parseInt(this.inputRiddleCount.value, 10) || 5;
        val = Math.max(1, Math.min(100, val));
        this.inputRiddleCount.value = val;
        this._initQuestionsArray(val);
      });
    }

    // Riddle count presets
    if (this.countPresets) {
      this.countPresets.querySelectorAll('.q-count-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          this.countPresets.querySelectorAll('.q-count-chip').forEach((c) => c.classList.remove('active'));
          chip.classList.add('active');
          const count = parseInt(chip.dataset.count, 10) || 5;
          if (this.inputRiddleCount) this.inputRiddleCount.value = count;
          this._initQuestionsArray(count);
          soundEngine.playClick();
        });
      });
    }

    // Proceed to Step 2
    if (this.btnGotoQuestions) {
      this.btnGotoQuestions.addEventListener('click', () => {
        const name = this.inputPackName.value.trim();
        if (!name) {
          alert('Please enter a Sound Pack Name.');
          this.inputPackName.focus();
          return;
        }

        const count = parseInt(this.inputRiddleCount?.value, 10) || 5;
        if (this.packData.questions.length !== count) {
          this._initQuestionsArray(count);
        }

        this.packData.name = name;
        this.packData.description = this.inputPackDesc.value.trim() || 'Custom Steampunk Sound Pack';
        this.packData.author = this.inputPackAuthor.value.trim() || 'Sound Master';
        this.packData.timerSeconds = parseInt(this.inputPackTimer.value, 10) || 15;

        this.packData.currentQuestionIndex = 0;
        this.loadQuestion(0);
        this.goToStage(2);
        soundEngine.playClick();
      });
    }
  }

  _setupStage2() {
    // Base64 File Upload with 100MB Limit
    if (this.inputQAudioFile) {
      this.inputQAudioFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 100MB File Limit Validation
        if (file.size > MAX_PACK_BYTES) {
          alert(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 100 MB maximum pack limit!`);
          this.inputQAudioFile.value = '';
          return;
        }

        const currentTotal = this.calculateTotalPackBytes();
        const existingAudioBytes = this.packData.questions[this.packData.currentQuestionIndex]?.audioUrl?.length || 0;
        const estimatedNewTotal = currentTotal - existingAudioBytes + file.size * 1.37; // Base64 factor

        if (estimatedNewTotal > MAX_PACK_BYTES) {
          alert(`Adding this ${(file.size / (1024 * 1024)).toFixed(1)} MB file would exceed the 100 MB total pack budget!`);
          this.inputQAudioFile.value = '';
          return;
        }

        try {
          this.badgeQBase64.style.display = 'inline-flex';
          this.badgeQBase64.textContent = '⏳ Encoding File to Base64...';
          this.currentBase64Audio = await convertFileToBase64(file);
          this.badgeQBase64.textContent = `⚡ ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB Base64)`;

          // Save immediately to question
          this.packData.questions[this.packData.currentQuestionIndex].audioUrl = this.currentBase64Audio;
          this.packData.questions[this.packData.currentQuestionIndex].audioSizeBytes = file.size;
          this.updateSizeBudgetUI();
          soundEngine.playClick();
        } catch (err) {
          alert('Audio file read failed: ' + err.message);
          this.badgeQBase64.style.display = 'none';
        }
      });
    }

    // Base64 Audio Link Input with Budget Limit
    if (this.inputQAudioUrl) {
      this.inputQAudioUrl.addEventListener('change', async () => {
        const url = this.inputQAudioUrl.value.trim();
        if (!url) {
          if (!this.inputQAudioFile?.files?.length) {
            this.currentBase64Audio = null;
            this.packData.questions[this.packData.currentQuestionIndex].audioUrl = null;
            this.updateSizeBudgetUI();
          }
          return;
        }
        try {
          this.badgeQBase64.style.display = 'inline-flex';
          this.badgeQBase64.textContent = '⏳ Fetching & Encoding URL...';
          const b64 = await convertAudioUrlToBase64(url);

          if (this.calculateTotalPackBytes() + b64.length > MAX_PACK_BYTES) {
            alert('Encoded audio exceeds the 100 MB pack limit!');
            this.inputQAudioUrl.value = '';
            this.badgeQBase64.style.display = 'none';
            return;
          }

          this.currentBase64Audio = b64;
          this.badgeQBase64.textContent = `⚡ Web Audio Base64 (${(b64.length / (1024 * 1024)).toFixed(2)} MB)`;
          this.packData.questions[this.packData.currentQuestionIndex].audioUrl = b64;
          this.updateSizeBudgetUI();
        } catch (err) {
          this.badgeQBase64.style.display = 'none';
        }
      });
    }

    // Test sound preview
    if (this.btnTestAudio) {
      this.btnTestAudio.addEventListener('click', () => {
        const q = this._readCurrentForm();
        soundEngine.playSoundForQuestion(q);
      });
    }

    // Dynamic Add Riddle Stepper Buttons
    const handleAddRiddle = () => {
      this._saveCurrentForm();
      const newIdx = this.packData.questions.length;
      this.packData.questions.push(this._createEmptyQuestion(newIdx));
      this.packData.totalQuestions = this.packData.questions.length;
      if (this.inputRiddleCount) this.inputRiddleCount.value = this.packData.totalQuestions;
      this.loadQuestion(newIdx);
      this.updateSizeBudgetUI();
      soundEngine.playCorrect();
    };

    if (this.btnAddRiddleStepper) this.btnAddRiddleStepper.addEventListener('click', handleAddRiddle);
    if (this.btnAddNewRiddle) this.btnAddNewRiddle.addEventListener('click', handleAddRiddle);

    // Delete Riddle Button
    if (this.btnDeleteRiddle) {
      this.btnDeleteRiddle.addEventListener('click', () => {
        if (this.packData.questions.length <= 1) {
          alert('A pack must contain at least 1 sound riddle.');
          return;
        }
        if (confirm(`Delete Riddle #${this.packData.currentQuestionIndex + 1}?`)) {
          this.packData.questions.splice(this.packData.currentQuestionIndex, 1);
          this.packData.totalQuestions = this.packData.questions.length;
          if (this.inputRiddleCount) this.inputRiddleCount.value = this.packData.totalQuestions;
          const nextIdx = Math.min(this.packData.currentQuestionIndex, this.packData.questions.length - 1);
          this.loadQuestion(nextIdx);
          this.updateSizeBudgetUI();
          soundEngine.playClick();
        }
      });
    }

    // GLB 3D Binary File Upload with Budget Limit
    if (this.inputQGlbFile) {
      this.inputQGlbFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > MAX_PACK_BYTES) {
          alert(`GLB file size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 100 MB maximum pack limit!`);
          this.inputQGlbFile.value = '';
          return;
        }

        try {
          if (this.badgeQGlb) {
            this.badgeQGlb.style.display = 'inline-flex';
            this.badgeQGlb.textContent = '⏳ Encoding GLB Binary...';
          }
          const b64Glb = await GlbManager.readFileToGlbBase64(file);
          this.currentBase64Glb = b64Glb;
          this.packData.questions[this.packData.currentQuestionIndex].sceneGlb = b64Glb;
          if (this.badgeQGlb) {
            const mb = (file.size / (1024 * 1024)).toFixed(2);
            this.badgeQGlb.textContent = `📦 ${file.name} (${mb} MB GLB)`;
          }
          this.updateSizeBudgetUI();
          soundEngine.playClick();
        } catch (err) {
          alert('GLB load failed: ' + err.message);
          if (this.badgeQGlb) this.badgeQGlb.style.display = 'none';
        }
      });
    }

    // Bake Current Procedural / Scripted 3D Scene into Portable GLB Binary
    if (this.btnBakeGlb) {
      this.btnBakeGlb.addEventListener('click', async () => {
        this._saveCurrentForm();
        const currentQ = this.packData.questions[this.packData.currentQuestionIndex];
        if (!currentQ) return;
        try {
          if (this.badgeQGlb) {
            this.badgeQGlb.style.display = 'inline-flex';
            this.badgeQGlb.textContent = '⏳ Baking 3D to GLB Binary...';
          }
          const bakedGlb = await ThemeSceneEngine.exportQuestionToGlb(currentQ);
          this.currentBase64Glb = bakedGlb;
          currentQ.sceneGlb = bakedGlb;
          if (this.badgeQGlb) {
            const kb = (bakedGlb.length / 1024).toFixed(0);
            this.badgeQGlb.textContent = `📦 Baked GLB (${kb} KB)`;
          }
          this.updateSizeBudgetUI();
          soundEngine.playCorrect();
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (err) {
          alert('Bake GLB failed: ' + err.message);
          if (this.badgeQGlb) this.badgeQGlb.style.display = 'none';
        }
      });
    }

    // Custom 3D JavaScript Scene Script Preset Selector
    if (this.selectQScriptPreset && this.inputQSceneScript) {
      this.selectQScriptPreset.addEventListener('change', () => {
        const val = this.selectQScriptPreset.value;
        if (val) {
          this.inputQSceneScript.value = ThemeSceneEngine.getScriptTemplate(val);
        }
      });
    }

    // Trigger Live 3D Scene Update & Inspect
    const btnTrigger3D = document.getElementById('btn-wiz-trigger-3d-update');
    if (btnTrigger3D) {
      btnTrigger3D.addEventListener('click', () => {
        this._saveCurrentForm();
        const currentQ = this.packData.questions[this.packData.currentQuestionIndex];
        if (currentQ && this.onInspect3DCallback) {
          this.onInspect3DCallback(currentQ, this.packData);
          soundEngine.playClick();
        }
      });
    }

    // Previous Question Button
    if (this.btnPrevQuestion) {
      this.btnPrevQuestion.addEventListener('click', () => {
        this._saveCurrentForm();
        if (this.packData.currentQuestionIndex > 0) {
          this.loadQuestion(this.packData.currentQuestionIndex - 1);
          soundEngine.playClick();
        }
      });
    }

    // Back to Info Button
    if (this.btnBackToInfo) {
      this.btnBackToInfo.addEventListener('click', () => {
        this._saveCurrentForm();
        this.goToStage(1);
        soundEngine.playClick();
      });
    }

    // Next Question Button
    if (this.btnNextQuestion) {
      this.btnNextQuestion.addEventListener('click', () => {
        if (!this._validateCurrentForm()) return;
        this._saveCurrentForm();

        const nextIdx = this.packData.currentQuestionIndex + 1;
        if (nextIdx < this.packData.totalQuestions) {
          this.loadQuestion(nextIdx);
          soundEngine.playClick();
        } else {
          // Finished all questions -> Proceed to Review
          this.renderReviewStage();
          this.goToStage(3);
          soundEngine.playCorrect();
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        }
      });
    }
  }

  _setupStage3() {
    if (this.btnReviewBack) {
      this.btnReviewBack.addEventListener('click', () => {
        this.goToStage(2);
        this.loadQuestion(this.packData.totalQuestions - 1);
        soundEngine.playClick();
      });
    }

    if (this.btnExportJson) {
      this.btnExportJson.addEventListener('click', () => {
        const pack = this._buildFinalPackObject();
        const jsonStr = JSON.stringify(pack, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sound_pack_${pack.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        navigator.clipboard?.writeText(jsonStr);
        alert(`Pack "${pack.name}" exported and downloaded as JSON!`);
      });
    }

    if (this.btnSaveActivate) {
      this.btnSaveActivate.addEventListener('click', () => {
        const pack = this._buildFinalPackObject();
        try {
          const created = soundPackManager.createCustomPack(pack);
          soundEngine.playVictoryFanfare();
          confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
          alert(`🎉 Sound Pack "${created.name}" (${created.sounds.length} Riddles) created and set as active pack!`);
          if (this.onPackSavedCallback) this.onPackSavedCallback(created);
        } catch (err) {
          alert('Save error: ' + err.message);
        }
      });
    }

    if (this.btnPlayTestNow) {
      this.btnPlayTestNow.addEventListener('click', () => {
        const pack = this._buildFinalPackObject();
        try {
          soundPackManager.createCustomPack(pack);
          if (this.onPlayTestCallback) this.onPlayTestCallback(pack);
        } catch (err) {
          alert('Launch error: ' + err.message);
        }
      });
    }
  }

  goToStage(stageNum) {
    if (this.stage1) this.stage1.style.display = stageNum === 1 ? 'block' : 'none';
    if (this.stage2) this.stage2.style.display = stageNum === 2 ? 'block' : 'none';
    if (this.stage3) this.stage3.style.display = stageNum === 3 ? 'block' : 'none';

    if (this.step1Ind) {
      this.step1Ind.className = `wizard-step-item ${stageNum === 1 ? 'active' : stageNum > 1 ? 'completed' : ''}`;
    }
    if (this.step2Ind) {
      this.step2Ind.className = `wizard-step-item ${stageNum === 2 ? 'active' : stageNum > 2 ? 'completed' : ''}`;
    }
    if (this.step3Ind) {
      this.step3Ind.className = `wizard-step-item ${stageNum === 3 ? 'active' : ''}`;
    }

    this.updateSizeBudgetUI();
  }

  loadQuestion(index) {
    this.packData.currentQuestionIndex = index;
    const q = this.packData.questions[index];
    if (!q) return;

    if (this.qIndexPill) {
      this.qIndexPill.textContent = `RIDDLE ${index + 1} OF ${this.packData.totalQuestions}`;
    }
    if (this.qStatus) {
      this.qStatus.textContent = q.isCompleted ? 'Completed ✅' : 'In Progress ✏️';
      this.qStatus.style.color = q.isCompleted ? '#00ff88' : 'var(--text-muted)';
    }

    this.renderQuestionPills();

    // Populate form fields
    this.inputQTitle.value = q.title || `Sound Riddle #${index + 1}`;
    this.inputQCategory.value = q.category || 'workoutVsDaily';
    this.inputQHint.value = q.soundHint || '';
    this.selectQScene.value = q.sceneModel || 'pool_flamingo';
    if (this.inputQSceneScript) {
      this.inputQSceneScript.value = q.sceneScript || '';
    }
    if (this.selectQScriptPreset) {
      this.selectQScriptPreset.value = '';
    }
    this.selectQSynth.value = q.synthPreset || 'panting_groan';
    this.inputQAudioUrl.value = typeof q.audioUrl === 'string' && !q.audioUrl.startsWith('data:audio/') ? q.audioUrl : '';

    this.currentBase64Audio = q.audioUrl || null;
    if (this.badgeQBase64) {
      if (this.currentBase64Audio && this.currentBase64Audio.startsWith('data:audio/')) {
        const mb = (this.currentBase64Audio.length / (1024 * 1024)).toFixed(2);
        this.badgeQBase64.style.display = 'inline-flex';
        this.badgeQBase64.textContent = `⚡ Base64 Audio Encoded (${mb} MB)`;
      } else {
        this.badgeQBase64.style.display = 'none';
      }
    }

    this.currentBase64Glb = q.sceneGlb || null;
    if (this.badgeQGlb) {
      if (this.currentBase64Glb && this.currentBase64Glb.length > 50) {
        const kb = (this.currentBase64Glb.length / 1024).toFixed(0);
        this.badgeQGlb.style.display = 'inline-flex';
        this.badgeQGlb.textContent = `📦 Binary GLB Attached (${kb} KB)`;
      } else {
        this.badgeQGlb.style.display = 'none';
      }
    }

    this.inputOpt0.value = q.options[0] || '';
    this.inputOpt1.value = q.options[1] || '';
    this.inputOpt2.value = q.options[2] || '';
    this.inputOpt3.value = q.options[3] || '';

    const radios = document.querySelectorAll('input[name="wiz-correct"]');
    if (radios.length > 0) {
      radios.forEach((r, idx) => {
        r.checked = idx === (q.correctIndex || 0);
      });
    }

    this.inputRevTitle.value = q.revealTitle || '';
    this.inputRevDesc.value = q.revealExplanation || '';
    this.inputRevFact.value = q.funFact || '';

    // Buttons
    if (this.btnPrevQuestion) {
      this.btnPrevQuestion.disabled = index === 0;
      this.btnPrevQuestion.style.opacity = index === 0 ? '0.4' : '1';
    }
    if (this.btnNextLabel) {
      this.btnNextLabel.textContent = index === this.packData.totalQuestions - 1 ? 'Review & Save Pack 🎉' : 'Next Riddle ➡️';
    }

    this.updateSizeBudgetUI();
  }

  renderQuestionPills() {
    if (!this.qPillsContainer) return;
    this.qPillsContainer.innerHTML = '';

    for (let i = 0; i < this.packData.totalQuestions; i++) {
      const q = this.packData.questions[i];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `wiz-q-pill-btn ${i === this.packData.currentQuestionIndex ? 'active' : ''} ${q?.isCompleted ? 'completed' : ''}`;
      btn.textContent = `${i + 1}`;
      btn.title = `Jump to Riddle ${i + 1}`;

      btn.addEventListener('click', () => {
        this._saveCurrentForm();
        this.loadQuestion(i);
        soundEngine.playClick();
      });

      this.qPillsContainer.appendChild(btn);
    }
  }

  _readCurrentForm() {
    const correctVal = parseInt(document.querySelector('input[name="wiz-correct"]:checked')?.value || '0', 10);
    const audioUrlVal = this.inputQAudioUrl.value.trim();
    const finalAudio = this.currentBase64Audio || (audioUrlVal.length > 0 ? audioUrlVal : null);
    const existingGlb = this.packData.questions[this.packData.currentQuestionIndex]?.sceneGlb || null;
    const finalGlb = this.currentBase64Glb || existingGlb;

    return {
      id: this.packData.questions[this.packData.currentQuestionIndex]?.id || `wiz_q_${Date.now()}`,
      title: this.inputQTitle.value.trim() || `Sound Riddle #${this.packData.currentQuestionIndex + 1}`,
      category: this.inputQCategory.value,
      soundHint: this.inputQHint.value.trim() || 'Listen closely to the audio...',
      sceneGlb: finalGlb,
      sceneModel: this.selectQScene.value,
      sceneScript: this.inputQSceneScript ? this.inputQSceneScript.value.trim() || null : null,
      synthPreset: this.selectQSynth.value,
      audioUrl: finalAudio,
      audioSizeBytes: finalAudio?.length || 0,
      timerSeconds: this.packData.timerSeconds || 15,
      options: [
        this.inputOpt0.value.trim() || 'Option A',
        this.inputOpt1.value.trim() || 'Option B',
        this.inputOpt2.value.trim() || 'Option C',
        this.inputOpt3.value.trim() || 'Option D',
      ],
      correctIndex: correctVal,
      revealTitle: this.inputRevTitle.value.trim() || this.inputQTitle.value.trim(),
      revealExplanation: this.inputRevDesc.value.trim() || 'No explanation provided.',
      funFact: this.inputRevFact.value.trim() || 'Foley sound trivia.',
      difficulty: 2,
      isCompleted: true,
    };
  }

  _saveCurrentForm() {
    const q = this._readCurrentForm();
    this.packData.questions[this.packData.currentQuestionIndex] = q;
    this.updateSizeBudgetUI();
  }

  _validateCurrentForm() {
    if (!this.inputQTitle.value.trim()) {
      alert('Please provide a Sound Riddle Title.');
      this.inputQTitle.focus();
      return false;
    }
    if (!this.inputOpt0.value.trim() || !this.inputOpt1.value.trim()) {
      alert('Please fill out at least Option A and Option B.');
      this.inputOpt0.focus();
      return false;
    }
    return true;
  }

  renderReviewStage() {
    if (this.reviewIcon) this.reviewIcon.textContent = this.packData.icon || '📦';
    if (this.reviewName) this.reviewName.textContent = this.packData.name;
    if (this.reviewMeta) {
      this.reviewMeta.textContent = `By ${this.packData.author} • ${this.packData.totalQuestions} Sound Riddles • ${this.packData.timerSeconds}s Timers`;
    }

    this.updateSizeBudgetUI();

    if (this.reviewList) {
      this.reviewList.innerHTML = '';
      this.packData.questions.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = 'wiz-review-card';
        card.innerHTML = `
          <div>
            <div class="wiz-review-q-title">#${idx + 1}: ${q.title}</div>
            <div class="wiz-review-q-meta">Answer: ${q.options[q.correctIndex]} • ${q.audioUrl ? '⚡ Base64 Audio' : `🎹 Synth: ${q.synthPreset}`} • 3D: ${q.sceneScript ? 'Custom 3D JS' : q.sceneModel}</div>
          </div>
          <button type="button" class="btn-secondary-compact btn-play-review" data-idx="${idx}">🔊 Test</button>
        `;

        const playBtn = card.querySelector('.btn-play-review');
        playBtn.addEventListener('click', () => {
          soundEngine.playSoundForQuestion(q);
        });

        this.reviewList.appendChild(card);
      });
    }
  }

  _buildFinalPackObject() {
    return {
      name: this.packData.name,
      description: this.packData.description,
      author: this.packData.author,
      version: '1.0.0',
      icon: this.packData.icon,
      timerSeconds: this.packData.timerSeconds,
      sounds: this.packData.questions.map((q, idx) => ({
        id: `custom_${Date.now()}_${idx}`,
        title: q.title,
        soundHint: q.soundHint,
        category: q.category,
        synthPreset: q.synthPreset,
        audioUrl: q.audioUrl,
        timerSeconds: q.timerSeconds || this.packData.timerSeconds,
        options: q.options,
        correctIndex: q.correctIndex,
        revealTitle: q.revealTitle,
        revealExplanation: q.revealExplanation,
        funFact: q.funFact,
        sceneModel: q.sceneModel,
        sceneScript: q.sceneScript || null,
        difficulty: 2,
      })),
    };
  }
}

export const soundPackWizard = new SoundPackWizard();
