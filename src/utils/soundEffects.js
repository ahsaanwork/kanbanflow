// Web Audio API Synthesizer with customizable sound presets per action
// Zero latency, zero external asset dependencies, works completely offline.

export const SOUND_OPTIONS = {
  grab: [
    { id: "soft-pop", label: "Soft Pop (Default)" },
    { id: "bubble", label: "Bubble Lift" },
    { id: "wood-knock", label: "Wood Knock" },
    { id: "snappy-tap", label: "Snappy Tap" },
    { id: "none", label: "Mute" },
  ],
  drag: [
    { id: "subtle-felt", label: "Subtle Felt (Default)" },
    { id: "light-tick", label: "Light Tick" },
    { id: "soft-breeze", label: "Soft Breeze" },
    { id: "none", label: "Mute" },
  ],
  release: [
    { id: "cushioned-thud", label: "Cushioned Thud (Default)" },
    { id: "snap-click", label: "Snap Click" },
    { id: "soft-plop", label: "Soft Plop" },
    { id: "none", label: "Mute" },
  ],
  done: [
    { id: "harmonic-chime", label: "Harmonic Chime (Default)" },
    { id: "harp-sparkle", label: "Harp Sparkle" },
    { id: "success-ding", label: "Success Ding" },
    { id: "victory-fanfare", label: "Victory Fanfare" },
    { id: "none", label: "Mute" },
  ],
  add: [
    { id: "cheerful-pop", label: "Cheerful Pop (Default)" },
    { id: "ascending-tone", label: "Ascending Tone" },
    { id: "bright-ding", label: "Bright Ding" },
    { id: "none", label: "Mute" },
  ],
  delete: [
    { id: "soft-swoosh", label: "Soft Swoosh (Default)" },
    { id: "paper-crumble", label: "Paper Crumble" },
    { id: "low-thump", label: "Low Thump" },
    { id: "none", label: "Mute" },
  ],
};

const DEFAULT_CONFIG = {
  grab: "soft-pop",
  drag: "subtle-felt",
  release: "cushioned-thud",
  done: "harmonic-chime",
  add: "cheerful-pop",
  delete: "soft-swoosh",
  volume: 0.3,
  muted: false,
};

class SoundEffectsManager {
  constructor() {
    this.ctx = null;
    this.config = { ...DEFAULT_CONFIG };

    this.loadConfig();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem("puffyflow_sound_config");
      if (saved) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  saveConfig() {
    try {
      localStorage.setItem("puffyflow_sound_config", JSON.stringify(this.config));
    } catch {
      // Ignore
    }
  }

  initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  getConfig() {
    return { ...this.config };
  }

  isMuted() {
    return this.config.muted;
  }

  setMuted(muted) {
    this.config.muted = muted;
    this.saveConfig();
  }

  toggleMute() {
    this.setMuted(!this.config.muted);
    return this.config.muted;
  }

  setVolume(vol) {
    this.config.volume = Math.max(0, Math.min(1, vol));
    this.saveConfig();
  }

  getVolume() {
    return this.config.volume;
  }

  setActionSound(action, soundId) {
    if (this.config[action] !== undefined) {
      this.config[action] = soundId;
      this.saveConfig();
    }
  }

  resetDefaults() {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
    return this.config;
  }

  /**
   * Universal audio synthesizer trigger
   */
  playSound(action, soundOverride = null) {
    const soundId = soundOverride || this.config[action];
    if (this.config.muted && !soundOverride) return;
    if (soundId === "none") return;

    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const vol = this.config.volume;

    try {
      switch (soundId) {
        // --- GRAB / HOLD PRESETS ---
        case "soft-pop": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
          gain.gain.setValueAtTime(vol * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.13);
          break;
        }
        case "bubble": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(560, now + 0.09);
          gain.gain.setValueAtTime(vol * 0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
        case "wood-knock": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
          gain.gain.setValueAtTime(vol * 0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }
        case "snappy-tap": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
          gain.gain.setValueAtTime(vol * 0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }

        // --- DRAG / HOVER PRESETS ---
        case "subtle-felt": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);
          gain.gain.setValueAtTime(vol * 0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }
        case "light-tick": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(580, now);
          gain.gain.setValueAtTime(vol * 0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
        }
        case "soft-breeze": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.linearRampToValueAtTime(300, now + 0.04);
          gain.gain.setValueAtTime(vol * 0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        // --- RELEASE / DROP PRESETS ---
        case "cushioned-thud": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(75, now + 0.09);
          gain.gain.setValueAtTime(vol * 0.75, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }
        case "snap-click": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);
          gain.gain.setValueAtTime(vol * 0.65, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }
        case "soft-plop": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
          gain.gain.setValueAtTime(vol * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.11);
          break;
        }

        // --- DONE / COMPLETE PRESETS ---
        case "harmonic-chime": {
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const noteStart = now + idx * 0.06;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(vol * (0.35 + idx * 0.07), noteStart);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.42);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.45);
          });
          break;
        }
        case "harp-sparkle": {
          const notes = [392.0, 523.25, 659.25, 783.99, 987.77];
          notes.forEach((freq, idx) => {
            const noteStart = now + idx * 0.045;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(vol * 0.3, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.38);
          });
          break;
        }
        case "success-ding": {
          const notes = [659.25, 1318.5]; // E5 then E6
          notes.forEach((freq, idx) => {
            const noteStart = now + idx * 0.08;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(vol * 0.45, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.52);
          });
          break;
        }
        case "victory-fanfare": {
          const chords = [
            { f: 523.25, t: 0 },
            { f: 659.25, t: 0.07 },
            { f: 783.99, t: 0.14 },
            { f: 1046.5, t: 0.22 },
          ];
          chords.forEach(({ f, t }) => {
            const noteStart = now + t;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(f, noteStart);
            gain.gain.setValueAtTime(vol * 0.4, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.52);
          });
          break;
        }

        // --- ADD TASK PRESETS ---
        case "cheerful-pop": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
          gain.gain.setValueAtTime(vol * 0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.11);
          break;
        }
        case "ascending-tone": {
          [440, 660].forEach((freq, idx) => {
            const noteStart = now + idx * 0.06;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(vol * 0.4, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.13);
          });
          break;
        }
        case "bright-ding": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, now);
          gain.gain.setValueAtTime(vol * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.24);
          break;
        }

        // --- DELETE TASK PRESETS ---
        case "soft-swoosh": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
          gain.gain.setValueAtTime(vol * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
        case "paper-crumble": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
          gain.gain.setValueAtTime(vol * 0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.11);
          break;
        }
        case "low-thump": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
          gain.gain.setValueAtTime(vol * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.13);
          break;
        }

        default:
          break;
      }
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  // Convenience methods using current chosen presets
  playGrab() {
    this.playSound("grab");
  }

  playDragHover() {
    this.playSound("drag");
  }

  playRelease() {
    this.playSound("release");
  }

  playDone() {
    this.playSound("done");
  }

  playAdd() {
    this.playSound("add");
  }

  playDelete() {
    this.playSound("delete");
  }

  playClick() {
    if (this.config.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
      gain.gain.setValueAtTime(this.config.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const sounds = new SoundEffectsManager();
