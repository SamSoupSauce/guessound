class SoundEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.masterGain = null;
    this.activeLoopTimer = null;
    this.activeAudioElement = null;
    this.isMuted = false;
    this.isPlayingQuestion = false;
    this.currentPreset = null;
    this.freqData = new Uint8Array(64);
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx({ latencyHint: 'interactive' });
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Global Android Chrome / Mobile Safari Touch Audio Unlocker
    const unlock = () => {
      if (this.ctx) {
        if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') {
          this.ctx.resume().catch(() => {});
        }
        try {
          const buffer = this.ctx.createBuffer(1, 1, 22050);
          const source = this.ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(this.ctx.destination);
          source.start(0);
        } catch {}
      }
      ['touchstart', 'touchend', 'pointerdown', 'click'].forEach((evt) => {
        window.removeEventListener(evt, unlock);
        document.removeEventListener(evt, unlock);
      });
    };

    ['touchstart', 'touchend', 'pointerdown', 'click'].forEach((evt) => {
      window.addEventListener(evt, unlock, { once: true, passive: true });
      document.addEventListener(evt, unlock, { once: true, passive: true });
    });
  }

  resume() {
    if (this.ctx && (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted')) {
      this.ctx.resume().catch(() => {});
    }
  }

  getFrequencyData() {
    if (!this.analyser) {
      return this.freqData;
    }
    this.analyser.getByteFrequencyData(this.freqData);
    return this.freqData;
  }

  getAverageVolume() {
    if (!this.analyser) return 0;
    this.analyser.getByteFrequencyData(this.freqData);
    let sum = 0;
    for (let i = 0; i < this.freqData.length; i++) {
      sum += this.freqData[i];
    }
    return sum / this.freqData.length / 255;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.7,
        this.ctx.currentTime
      );
    }
    if (this.activeAudioElement) {
      this.activeAudioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }

  stopQuestionAudio() {
    this.isPlayingQuestion = false;
    if (this.activeLoopTimer) {
      clearInterval(this.activeLoopTimer);
      this.activeLoopTimer = null;
    }
    if (this.activeAudioElement) {
      this.activeAudioElement.pause();
      this.activeAudioElement.currentTime = 0;
      this.activeAudioElement = null;
    }
  }

  playSoundForQuestion(question) {
    if (!question) return;
    this.stopQuestionAudio();

    if (question.audioUrl && question.audioUrl.trim().length > 0) {
      this.playAudioUrl(question.audioUrl);
    } else {
      this.playPreset(question.synthPreset || 'panting_groan');
    }
  }

  playAudioUrl(url) {
    this.init();
    this.resume();
    this.stopQuestionAudio();
    this.isPlayingQuestion = true;

    try {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = url;
      audio.loop = true;
      audio.muted = this.isMuted;

      try {
        const source = this.ctx.createMediaElementSource(audio);
        source.connect(this.masterGain);
      } catch (e) {
        // Source already exists or CORS
      }

      this.activeAudioElement = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio URL playback failed, falling back to synthesizer:', err);
          this.playPreset('panting_groan');
        });
      }
    } catch (err) {
      console.warn('Failed to load audio URL:', err);
      this.playPreset('panting_groan');
    }
  }

  playPreset(presetKey) {
    this.init();
    this.resume();
    this.stopQuestionAudio();
    this.isPlayingQuestion = true;
    this.currentPreset = presetKey;

    const trigger = () => {
      if (!this.isPlayingQuestion) return;
      this._synthesize(presetKey);
    };

    trigger();
    const intervalMap = {
      panting_groan: 1600,
      flip_flops: 700,
      stubbed_toe: 2200,
      squeaky_duck: 900,
      bacon_sizzle: 200,
      massage_gun: 150,
      bike_pump: 1200,
      band_snap: 1800,
      mac_cheese: 600,
      dog_taps: 800,
      laser_pew: 600,
      chainsaw_rev: 400,
      soda_pop: 1400,
      cat_angry_hiss: 1200,
      heavy_thud: 1500,
      woodpecker_peck: 700,
      water_splash: 1100,
    };

    const interval = intervalMap[presetKey] || 1200;
    this.activeLoopTimer = setInterval(trigger, interval);
  }

  _synthesize(preset) {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    switch (preset) {
      case 'panting_groan': {
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.exponentialRampToValueAtTime(1400, t + 0.2);
        filter.Q.value = 3.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);

        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, t + 0.3);
        osc.frequency.exponentialRampToValueAtTime(75, t + 0.8);

        const vFilter = this.ctx.createBiquadFilter();
        vFilter.type = 'lowpass';
        vFilter.frequency.setValueAtTime(500, t + 0.3);

        const vGain = this.ctx.createGain();
        vGain.gain.setValueAtTime(0.001, t + 0.3);
        vGain.gain.linearRampToValueAtTime(0.3, t + 0.4);
        vGain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

        osc.connect(vFilter);
        vFilter.connect(vGain);
        vGain.connect(this.masterGain);
        osc.start(t + 0.3);
        osc.stop(t + 0.9);
        break;
      }

      case 'flip_flops': {
        for (let step = 0; step < 2; step++) {
          const delay = step * 0.22;
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, t + delay);
          osc.frequency.exponentialRampToValueAtTime(80, t + delay + 0.08);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.6, t + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.09);

          const squeak = this.ctx.createOscillator();
          squeak.type = 'triangle';
          squeak.frequency.setValueAtTime(1800, t + delay + 0.02);
          squeak.frequency.exponentialRampToValueAtTime(800, t + delay + 0.07);

          const sqGain = this.ctx.createGain();
          sqGain.gain.setValueAtTime(0.25, t + delay + 0.02);
          sqGain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.07);

          osc.connect(gain);
          gain.connect(this.masterGain);
          squeak.connect(sqGain);
          sqGain.connect(this.masterGain);

          osc.start(t + delay);
          osc.stop(t + delay + 0.1);
          squeak.start(t + delay + 0.02);
          squeak.stop(t + delay + 0.08);
        }
        break;
      }

      case 'stubbed_toe': {
        const thud = this.ctx.createOscillator();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(160, t);
        thud.frequency.exponentialRampToValueAtTime(30, t + 0.15);

        const thudGain = this.ctx.createGain();
        thudGain.gain.setValueAtTime(0.8, t);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        thud.connect(thudGain);
        thudGain.connect(this.masterGain);
        thud.start(t);
        thud.stop(t + 0.2);

        const scream = this.ctx.createOscillator();
        scream.type = 'sawtooth';
        scream.frequency.setValueAtTime(220, t + 0.08);
        scream.frequency.exponentialRampToValueAtTime(480, t + 0.3);
        scream.frequency.exponentialRampToValueAtTime(140, t + 0.9);

        const sFilter = this.ctx.createBiquadFilter();
        sFilter.type = 'bandpass';
        sFilter.frequency.setValueAtTime(1200, t);
        sFilter.Q.value = 2.5;

        const sGain = this.ctx.createGain();
        sGain.gain.setValueAtTime(0.001, t + 0.08);
        sGain.gain.linearRampToValueAtTime(0.5, t + 0.2);
        sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

        scream.connect(sFilter);
        sFilter.connect(sGain);
        sGain.connect(this.masterGain);
        scream.start(t + 0.08);
        scream.stop(t + 1.0);
        break;
      }

      case 'squeaky_duck': {
        const sq1 = this.ctx.createOscillator();
        sq1.type = 'sine';
        sq1.frequency.setValueAtTime(1100, t);
        sq1.frequency.exponentialRampToValueAtTime(2400, t + 0.1);
        sq1.frequency.exponentialRampToValueAtTime(1600, t + 0.22);

        const g1 = this.ctx.createGain();
        g1.gain.setValueAtTime(0.4, t);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        sq1.connect(g1);
        g1.connect(this.masterGain);
        sq1.start(t);
        sq1.stop(t + 0.26);
        break;
      }

      case 'bacon_sizzle': {
        const len = this.ctx.sampleRate * 0.18;
        const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * (Math.random() > 0.85 ? 1.5 : 0.4);
        }

        const src = this.ctx.createBufferSource();
        src.buffer = b;

        const filt = this.ctx.createBiquadFilter();
        filt.type = 'highpass';
        filt.frequency.value = 2200;

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.35, t);
        g.gain.linearRampToValueAtTime(0.001, t + 0.18);

        src.connect(filt);
        filt.connect(g);
        g.connect(this.masterGain);
        src.start(t);
        break;
      }

      case 'massage_gun': {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(52, t);

        const sub = this.ctx.createOscillator();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(26, t);

        const filt = this.ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.value = 350;

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.5, t);
        g.gain.linearRampToValueAtTime(0.001, t + 0.14);

        osc.connect(filt);
        sub.connect(filt);
        filt.connect(g);
        g.connect(this.masterGain);

        osc.start(t);
        sub.start(t);
        osc.stop(t + 0.14);
        sub.stop(t + 0.14);
        break;
      }

      case 'bike_pump': {
        const len = this.ctx.sampleRate * 0.35;
        const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < len; i++) {
          d[i] = Math.random() * 2 - 1;
        }

        const src = this.ctx.createBufferSource();
        src.buffer = b;

        const filt = this.ctx.createBiquadFilter();
        filt.type = 'bandpass';
        filt.frequency.setValueAtTime(400, t);
        filt.frequency.exponentialRampToValueAtTime(1800, t + 0.3);
        filt.Q.value = 4.0;

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.05, t);
        g.gain.linearRampToValueAtTime(0.45, t + 0.25);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        src.connect(filt);
        filt.connect(g);
        g.connect(this.masterGain);
        src.start(t);
        break;
      }

      case 'band_snap': {
        const stretch = this.ctx.createOscillator();
        stretch.type = 'sine';
        stretch.frequency.setValueAtTime(300, t);
        stretch.frequency.exponentialRampToValueAtTime(900, t + 0.4);

        const sGain = this.ctx.createGain();
        sGain.gain.setValueAtTime(0.1, t);
        sGain.gain.linearRampToValueAtTime(0.3, t + 0.38);
        sGain.gain.setValueAtTime(0.001, t + 0.4);

        stretch.connect(sGain);
        sGain.connect(this.masterGain);
        stretch.start(t);
        stretch.stop(t + 0.4);

        const snap = this.ctx.createOscillator();
        snap.type = 'square';
        snap.frequency.setValueAtTime(1200, t + 0.4);
        snap.frequency.exponentialRampToValueAtTime(60, t + 0.55);

        const snapGain = this.ctx.createGain();
        snapGain.gain.setValueAtTime(0.8, t + 0.4);
        snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        snap.connect(snapGain);
        snapGain.connect(this.masterGain);
        snap.start(t + 0.4);
        snap.stop(t + 0.6);
        break;
      }

      case 'mac_cheese': {
        for (let i = 0; i < 3; i++) {
          const dTime = t + i * 0.12;
          const osc = this.ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(200 + Math.random() * 200, dTime);
          osc.frequency.exponentialRampToValueAtTime(80, dTime + 0.08);

          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.4, dTime);
          g.gain.exponentialRampToValueAtTime(0.001, dTime + 0.09);

          osc.connect(g);
          g.connect(this.masterGain);
          osc.start(dTime);
          osc.stop(dTime + 0.1);
        }
        break;
      }

      case 'dog_taps': {
        for (let i = 0; i < 4; i++) {
          const dTime = t + i * 0.14;
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1600 + (i % 2) * 400, dTime);
          osc.frequency.exponentialRampToValueAtTime(300, dTime + 0.04);

          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.35, dTime);
          g.gain.exponentialRampToValueAtTime(0.001, dTime + 0.045);

          osc.connect(g);
          g.connect(this.masterGain);
          osc.start(dTime);
          osc.stop(dTime + 0.05);
        }
        break;
      }

      case 'laser_pew': {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1800, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.5, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.22);
        break;
      }

      case 'chainsaw_rev': {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.linearRampToValueAtTime(240, t + 0.15);
        osc.frequency.linearRampToValueAtTime(140, t + 0.35);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.4, t);
        g.gain.linearRampToValueAtTime(0.001, t + 0.38);

        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.4);
        break;
      }

      case 'soda_pop': {
        // Sharp pop
        const pop = this.ctx.createOscillator();
        pop.type = 'square';
        pop.frequency.setValueAtTime(800, t);
        pop.frequency.exponentialRampToValueAtTime(90, t + 0.05);

        const pGain = this.ctx.createGain();
        pGain.gain.setValueAtTime(0.7, t);
        pGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        pop.connect(pGain);
        pGain.connect(this.masterGain);
        pop.start(t);
        pop.stop(t + 0.07);

        // Hiss & fizz
        const len = this.ctx.sampleRate * 0.6;
        const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < len; i++) {
          d[i] = Math.random() * 2 - 1;
        }

        const src = this.ctx.createBufferSource();
        src.buffer = b;

        const filt = this.ctx.createBiquadFilter();
        filt.type = 'highpass';
        filt.frequency.value = 3500;

        const fGain = this.ctx.createGain();
        fGain.gain.setValueAtTime(0.01, t + 0.04);
        fGain.gain.linearRampToValueAtTime(0.35, t + 0.1);
        fGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        src.connect(filt);
        filt.connect(fGain);
        fGain.connect(this.masterGain);
        src.start(t + 0.04);
        break;
      }

      case 'cat_angry_hiss': {
        const len = this.ctx.sampleRate * 0.4;
        const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < len; i++) {
          d[i] = Math.random() * 2 - 1;
        }

        const src = this.ctx.createBufferSource();
        src.buffer = b;

        const filt = this.ctx.createBiquadFilter();
        filt.type = 'bandpass';
        filt.frequency.setValueAtTime(1800, t);
        filt.frequency.exponentialRampToValueAtTime(2600, t + 0.2);
        filt.Q.value = 5.0;

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.05, t);
        g.gain.linearRampToValueAtTime(0.4, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        src.connect(filt);
        filt.connect(g);
        g.connect(this.masterGain);
        src.start(t);
        break;
      }

      case 'heavy_thud': {
        const thud = this.ctx.createOscillator();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(110, t);
        thud.frequency.exponentialRampToValueAtTime(32, t + 0.25);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.85, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        thud.connect(g);
        g.connect(this.masterGain);
        thud.start(t);
        thud.stop(t + 0.32);
        break;
      }

      case 'woodpecker_peck': {
        for (let i = 0; i < 6; i++) {
          const dt = t + i * 0.055;
          const osc = this.ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1400, dt);
          osc.frequency.exponentialRampToValueAtTime(400, dt + 0.02);

          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.4, dt);
          g.gain.exponentialRampToValueAtTime(0.001, dt + 0.025);

          osc.connect(g);
          g.connect(this.masterGain);
          osc.start(dt);
          osc.stop(dt + 0.03);
        }
        break;
      }

      case 'water_splash': {
        const len = this.ctx.sampleRate * 0.5;
        const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < len; i++) {
          d[i] = Math.random() * 2 - 1;
        }

        const src = this.ctx.createBufferSource();
        src.buffer = b;

        const filt = this.ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.setValueAtTime(800, t);
        filt.frequency.exponentialRampToValueAtTime(2400, t + 0.15);
        filt.frequency.exponentialRampToValueAtTime(400, t + 0.45);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.01, t);
        g.gain.linearRampToValueAtTime(0.5, t + 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        src.connect(filt);
        filt.connect(g);
        g.connect(this.masterGain);
        src.start(t);
        break;
      }

      default: {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.3);
      }
    }
  }

  playCorrect() {
    this.init();
    this.resume();
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.07);

      gain.gain.setValueAtTime(0.3, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.26);
    });
  }

  playWrong() {
    this.init();
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(110, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  playClick() {
    this.init();
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.03);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  playShatter() {
    this.init();
    this.resume();
    const t = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2000 + i * 500, t + i * 0.02);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.3 + i * 0.05);

      gain.gain.setValueAtTime(0.2, t + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35 + i * 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * 0.02);
      osc.stop(t + 0.4 + i * 0.05);
    }
  }

  playSteamRelease() {
    this.init();
    this.resume();
    const t = this.ctx.currentTime;
    const len = this.ctx.sampleRate * 0.6;
    const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = Math.random() * 2 - 1;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = b;

    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.setValueAtTime(3200, t);
    filt.frequency.exponentialRampToValueAtTime(800, t + 0.55);
    filt.Q.setValueAtTime(3.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.58);

    src.connect(filt);
    filt.connect(gain);
    gain.connect(this.masterGain);
    src.start(t);
  }

  playGearSpin() {
    this.init();
    this.resume();
    const t = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200 + (i % 2) * 400, t + i * 0.04);

      gain.gain.setValueAtTime(0.12, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.035);
    }
  }

  playTimerTick() {
    this.init();
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1600, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  playVictoryFanfare() {
    this.init();
    this.resume();
    const t = this.ctx.currentTime;
    // 1920s Triumphant Brass Chord Progression: C4 -> E4 -> G4 -> C5 (sustained)
    const chordNotes = [
      { f: 523.25, time: 0 },
      { f: 659.25, time: 0.1 },
      { f: 783.99, time: 0.2 },
      { f: 1046.5, time: 0.3 },
      { f: 1318.51, time: 0.45 },
    ];

    chordNotes.forEach(({ f, time }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t + time);

      const filt = this.ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(2000, t + time);
      filt.frequency.exponentialRampToValueAtTime(4500, t + time + 0.1);

      gain.gain.setValueAtTime(0.01, t + time);
      gain.gain.linearRampToValueAtTime(0.35, t + time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + 0.7);

      osc.connect(filt);
      filt.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + time);
      osc.stop(t + time + 0.75);
    });
  }
}

export const soundEngine = new SoundEngine();
