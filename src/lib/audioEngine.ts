import { InstrumentType, SonificationMode } from '@/data/pianoKeys';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private activeOscillators: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();
  private _volume: number = 0.5;
  private _muted: boolean = false;
  private _instrument: InstrumentType = 'sine';
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

  private colorToFrequency(hex: string): number {
    const { r, g, b } = this.hexToRgb(hex);
    const brightness = (r + g + b) / (3 * 255);
    return 200 + brightness * 600; // 200-800 Hz
  }

  private getOscType(): OscillatorType {
    if (this._instrument === 'piano') return 'triangle';
    return this._instrument as OscillatorType;
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

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = this.getOscType();
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Piano-like envelope
    if (this._instrument === 'piano') {
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    } else {
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.02);
    }

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);
    osc.start(ctx.currentTime);

    this.activeOscillators.set(noteId, { osc, gain: noteGain });

    // Auto-cleanup after 2 seconds
    setTimeout(() => this.stopNote(noteId), 2000);

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
            try { entry.osc.stop(); } catch {}
            try { entry.osc.disconnect(); } catch {}
            try { entry.gain.disconnect(); } catch {}
          }, 100);
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
