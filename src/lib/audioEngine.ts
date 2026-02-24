import { InstrumentType, SonificationMode } from '@/data/pianoKeys';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private activeOscillators: Map<string, { sources: AudioNode[]; gain: GainNode }> = new Map();
  private reverb?: ConvolverNode;
  private _volume: number = 0.5;
  private _muted: boolean = false;
  private _instrument: InstrumentType = 'violin';
  private _mode: SonificationMode = 'simple';

  get volume() { return this._volume; }
  get muted() { return this._muted; }
  get instrument() { return this._instrument; }
  get mode() { return this._mode; }

  private ensureContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this._muted ? 0 : this._volume;
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    // create a small reverb if not present
    if (!this.reverb && this.ctx) {
      const convolver = this.ctx.createConvolver();
      const length = this.ctx.sampleRate * 1.2; // 1.2s impulse
      const ir = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = ir.getChannelData(ch);
        for (let i = 0; i < length; i++) {
          // exponentially decaying noise
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
        }
      }
      convolver.buffer = ir;
      this.reverb = convolver;
      // connect reverb to master with a wet gain node on demand per note
    }
    return this.ctx;
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.gainNode && !this._muted) {
      this.gainNode.gain.setTargetAtTime(this._volume, this.ctx!.currentTime, 0.01);
    }
  }

  setMuted(m: boolean) {
    this._muted = m;
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(m ? 0 : this._volume, this.ctx!.currentTime, 0.01);
    }
  }

  setInstrument(i: InstrumentType) {
    this._instrument = i;
  }

  setMode(m: SonificationMode) {
    this._mode = m;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 128, g: 128, b: 128 };
  }

  private normalizeColor(input: string): string {
    // Remove whitespace, lowercase, convert rgb() to hex if needed
    if (!input) return '';
    let c = input.trim().toLowerCase();
    // If already hex
    if (c.startsWith('#')) return c;
    // If rgb(...), allow for spaces or no spaces
    const rgbMatch = c.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return (
        '#' +
        [r, g, b]
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('')
      );
    }
    // Remove all whitespace for fallback matching
    return c.replace(/\s+/g, '');
  }

  private colorToFrequency(colorInput: string): number {
    try {
      const { PIANO_KEYS } = require('@/data/pianoKeys');
      const inputNorm = this.normalizeColor(colorInput);
      let match = PIANO_KEYS.find((k: any) => {
        // Normalize both hex and rgb for each key
        const hexNorm = this.normalizeColor(k.hex);
        const colorNorm = this.normalizeColor(k.color);
        return inputNorm === hexNorm || inputNorm === colorNorm;
      });
      if (match && typeof match.freq === 'number') {
        return match.freq;
      }
    } catch {}
    // fallback: use brightness mapping
    const { r, g, b } = this.hexToRgb(colorInput);
    const brightness = (r + g + b) / (3 * 255);
    return 200 + brightness * 600; // 200-800 Hz
  }

  private getOscType(): OscillatorType {
    // Map named instruments to basic OscillatorType for fallback usages
    switch (this._instrument) {
      case 'violin': return 'sawtooth';
      case 'guitar': return 'sawtooth';
      case 'bass': return 'square';
      case 'bell': return 'sine';
      case 'piano': return 'triangle';
      default: return 'sine';
    }
  }

  playNote(color: string, x: number, y: number, canvasWidth: number, canvasHeight: number, id?: string) {
    if (this._muted) return;
    const ctx = this.ensureContext();
    if (!this.gainNode) return;

    const baseFreq = this.colorToFrequency(color);
    let freq = baseFreq;

    // Mode-based modulation
    switch (this._mode) {
      case 'simple':
        freq = baseFreq;
        break;
      case 'timeline':
        freq = baseFreq * (0.8 + (x / canvasWidth) * 0.4);
        break;
      case 'colorfield': {
        const { r, g, b } = this.hexToRgb(color);
        const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);
        freq = 300 + ((hue + Math.PI) / (2 * Math.PI)) * 500;
        break;
      }
      case 'harmonic': {
        const harmonic = 1 + Math.floor((y / canvasHeight) * 4);
        freq = baseFreq * harmonic;
        break;
      }
    }

    // X-position panning effect via frequency modulation
    const xMod = (x / canvasWidth) * 0.1;
    freq *= (1 + xMod);

    // Clamp frequency
    freq = Math.max(80, Math.min(4000, freq));

    const noteId = id || `note-${Date.now()}-${Math.random()}`;

    // Stop previous note with same id
    this.stopNote(noteId);

    const noteGain = ctx.createGain();
    noteGain.connect(this.gainNode);

    const sources: AudioNode[] = [];

    const now = ctx.currentTime;

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    switch (this._instrument) {
      case 'violin': {
        // Violin-like: sawtooth oscillator + gentle vibrato + subtle highpass filter
        const oscMain = ctx.createOscillator();
        oscMain.type = 'sawtooth';
        oscMain.frequency.setValueAtTime(freq, now);

        // Vibrato LFO
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(6, now);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(2.5, now); // frequency modulation depth (Hz)
        lfo.connect(lfoGain);
        lfoGain.connect(oscMain.frequency);
        lfo.start(now);
        sources.push(oscMain, lfo, lfoGain);

        // Gentle highpass filter to brighten sound
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 200;
        oscMain.connect(hp);
        hp.connect(noteGain);
        sources.push(hp);

        // Envelope
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.65, now + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.05, now + 1.0);

        oscMain.connect(noteGain);
        oscMain.start(now);
        break;
      }
      case 'guitar': {
        // Guitar-like pluck (simple Karplus-Strong-ish using looping noise buffer)
        const period = Math.max(2, Math.floor(ctx.sampleRate / freq));
        const buffer = ctx.createBuffer(1, period, ctx.sampleRate);
        const bufData = buffer.getChannelData(0);
        for (let i = 0; i < period; i++) bufData[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        // Add a lowpass to simulate string damping
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = Math.max(1200, freq * 2);
        src.connect(lp);
        lp.connect(noteGain);

        // Add a feedback delay for a more guitar-like ambience
        const delay = ctx.createDelay();
        delay.delayTime.value = 0.18;
        const fb = ctx.createGain();
        fb.gain.value = 0.32;
        const wet = ctx.createGain();
        wet.gain.value = 0.12;
        lp.connect(delay);
        delay.connect(fb);
        fb.connect(delay);
        delay.connect(wet);
        wet.connect(noteGain);
        sources.push(delay, fb, wet, lp);

        // Envelope (pluck)
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(1.0, now + 0.001);
        noteGain.gain.exponentialRampToValueAtTime(0.02, now + 2.0);

        src.start(now);
        sources.push(src);
        break;
      }
      case 'bass': {
        // Bass: square + sub-oscillator + low-pass
        const oscMain = ctx.createOscillator();
        oscMain.type = 'square';
        oscMain.frequency.setValueAtTime(freq, now);

        // two detuned sub-oscillators for a fatter bass
        const oscSub = ctx.createOscillator();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(clamp(freq / 2 * 0.995, 20, 2000), now);
        const oscSub2 = ctx.createOscillator();
        oscSub2.type = 'sine';
        oscSub2.frequency.setValueAtTime(clamp(freq / 2 * 1.005, 20, 2000), now);

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = Math.max(150, freq * 1.5);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.8, now);

        oscMain.connect(lp);
        oscSub.connect(subGain);
        oscSub2.connect(subGain);
        subGain.connect(lp);
        lp.connect(noteGain);

        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.9, now + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.03, now + 2.4);

        oscMain.start(now);
        oscSub.start(now);
        oscSub2.start(now);
        sources.push(oscMain, oscSub, oscSub2);
        break;
      }
      case 'bell': {
        // Bell: multiple detuned partials with long decay
        const partials = [1, 2.01, 3.03, 4.2];
        const gains = [1.0, 0.6, 0.35, 0.18];
        for (let i = 0; i < partials.length; i++) {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq * partials[i], now);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(gains[i] * 0.6, now + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, now + 4.0);
          o.connect(g);
          g.connect(noteGain);
          o.start(now);
          sources.push(o, g);
        }
        // overall gain envelope handled by partials
        break;
      }
      case 'piano': {
        // Piano: main tone plus inharmonic partials for realism
        // Fundamental
        const main = ctx.createOscillator();
        main.type = 'triangle';
        main.frequency.setValueAtTime(freq, now);

        // Slightly inharmonic partials (real piano strings are not perfect multiples)
        const partialRatios = [2.01, 3.98, 5.03]; // Slightly off integer multiples
        const partialGains = [0.28, 0.13, 0.07];
        const partials: OscillatorNode[] = [];
        const partialGainsNodes: GainNode[] = [];
        partialRatios.forEach((ratio, i) => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          // Add a tiny detune for realism
          osc.frequency.setValueAtTime(freq * ratio * (1 + (Math.random() - 0.5) * 0.002), now);
          const g = ctx.createGain();
          g.gain.setValueAtTime(partialGains[i], now);
          osc.connect(g);
          g.connect(noteGain);
          osc.start(now);
          partials.push(osc);
          partialGainsNodes.push(g);
        });

        // Short noise for hammer attack
        const nb = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
        const nd = nb.getChannelData(0);
        for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * (1 - i / nd.length);
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = nb;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 800;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.8, now);
        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(noteGain);
        if (this.reverb) {
          const wet = ctx.createGain();
          wet.gain.value = 0.28;
          noiseGain.connect(this.reverb);
          this.reverb.connect(wet);
          wet.connect(this.gainNode!);
          sources.push(wet);
        }

        // Envelope
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(1.0, now + 0.001);
        noteGain.gain.exponentialRampToValueAtTime(0.005, now + 2.4);

        main.connect(noteGain);
        main.start(now);
        noiseSrc.start(now);
        sources.push(main, noiseSrc, noiseFilter, noiseGain);
        partials.forEach((osc, i) => {
          sources.push(osc, partialGainsNodes[i]);
        });
        break;
      }
      default: {
        // fallback simple oscillator
        const osc = ctx.createOscillator();
        osc.type = this.getOscType();
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(noteGain);
        osc.start(now);
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.6, now + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        sources.push(osc);
        break;
      }
    }

    this.activeOscillators.set(noteId, { sources, gain: noteGain });

    // Auto-cleanup timing per instrument
    let timeoutMs = 3000;
    if (this._instrument === 'piano') timeoutMs = 8000;
    if (this._instrument === 'bell') timeoutMs = 6000;
    if (this._instrument === 'guitar') timeoutMs = 5000;
    if (this._instrument === 'bass') timeoutMs = 5000;

    setTimeout(() => this.stopNote(noteId), timeoutMs);

    return noteId;
  }

  stopNote(id: string) {
    const entry = this.activeOscillators.get(id);
    if (entry) {
      try {
        const ctx = this.ctx;
        if (ctx) {
          entry.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
          setTimeout(() => {
            try {
              entry.sources.forEach(s => {
                try { (s as any).stop(); } catch {}
                try { (s as any).disconnect(); } catch {}
              });
            } catch {}
            try { entry.gain.disconnect(); } catch {}
          }, 200);
        }
      } catch {}
      this.activeOscillators.delete(id);
    }
  }

  stopAll() {
    this.activeOscillators.forEach((_, id) => this.stopNote(id));
  }

  async generateSoundscape(
    strokes: Array<{ points: { x: number; y: number }[]; color: string }>,
    canvasWidth: number,
    canvasHeight: number,
    onProgress?: (p: number) => void
  ): Promise<void> {
    const ctx = this.ensureContext();
    if (!ctx || !this.gainNode) return;

    const totalPoints = strokes.reduce((sum, s) => sum + s.points.length, 0);
    let processed = 0;

    for (const stroke of strokes) {
      for (let i = 0; i < stroke.points.length; i += 3) {
        const p = stroke.points[i];
        const freq = this.colorToFrequency(stroke.color);
        const xMod = (p.x / canvasWidth) * 0.1;
        const finalFreq = Math.max(80, Math.min(4000, freq * (1 + xMod)));

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = this.getOscType();
        const startTime = ctx.currentTime + (processed / totalPoints) * 3;

        osc.frequency.setValueAtTime(finalFreq, startTime);
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);
        osc.start(startTime);
        osc.stop(startTime + 0.2);

        processed += 3;
        if (onProgress) onProgress(Math.min(1, processed / totalPoints));
      }
      await new Promise(r => setTimeout(r, 10));
    }
  }

  dispose() {
    this.stopAll();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
    this.ctx = null;
    this.gainNode = null;
  }
}

export const audioEngine = new AudioEngine();

// Expose a small test helper for manual testing from the browser console.
(AudioEngine.prototype as any).playTestSequence = function(canvasWidth = 800, canvasHeight = 600) {
  // Play a short sequence of notes across instrument types for quick audition.
  const engine: AudioEngine = this;
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
  const instrs: InstrumentType[] = ['violin','guitar','bass','bell','piano'];
  let t = 0;
  instrs.forEach((ins, i) => {
    setTimeout(() => {
      engine.setInstrument(ins);
      const color = colors[i % colors.length];
      engine.playNote(color, canvasWidth * 0.5, canvasHeight * (0.2 + i * 0.15), canvasWidth, canvasHeight, `test-${i}`);
    }, t);
    t += 600;
  });
};
