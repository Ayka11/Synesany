import { useState, useRef, useEffect, useCallback } from "react";

export const useAudioEngine = () => {
  const audioCtx = useRef(null);
  const masterGain = useRef(null);
  const compressor = useRef(null);
  const isMuted = useRef(false);
  const periodicWaves = useRef({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      // Check if Web Audio API is supported
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.error('Web Audio API is not supported in this browser');
        return;
      }
      
      // Create audio context with user gesture requirement
      const ctx = new AudioContext();
      
      // Handle suspended state (requires user interaction)
      if (ctx.state === 'suspended') {
        console.log('Audio context suspended, waiting for user interaction...');
        // Create a resume function that can be called on user interaction
        const resumeAudio = () => {
          ctx.resume().then(() => {
            console.log('Audio context resumed successfully');
          }).catch(err => {
            console.error('Error resuming audio context:', err);
          });
        };
        
        // Add click listener to resume audio on first user interaction
        const resumeHandler = () => {
          resumeAudio();
          document.removeEventListener('click', resumeHandler);
          document.removeEventListener('touchstart', resumeHandler);
        };
        
        document.addEventListener('click', resumeHandler, { once: true });
        document.addEventListener('touchstart', resumeHandler, { once: true });
      }
      
      audioCtx.current = ctx;
      masterGain.current = ctx.createGain();
      compressor.current = ctx.createDynamicsCompressor();

      masterGain.current.connect(compressor.current);
      compressor.current.connect(ctx.destination);

      masterGain.current.gain.value = 0.5;
      
      console.log('Audio context created successfully:', ctx.state);
      
      // Create custom periodic waves for instruments
      // Piano: bright with moderate harmonics
      const pianoReal = new Float32Array([
        0, 1.0, 0.4, 0.25, 0.15, 0.08, 0.04, 0.02,
      ]);
      const pianoImag = new Float32Array(pianoReal.length).fill(0);
      periodicWaves.current.piano = ctx.createPeriodicWave(
        pianoReal,
        pianoImag,
        { disableNormalization: true },
      );
      
      // Guitar: rich harmonics
      const guitarReal = new Float32Array([
        0, 1.0, 0.6, 0.35, 0.22, 0.14, 0.09, 0.05,
      ]);
      const guitarImag = new Float32Array(guitarReal.length).fill(0);
      periodicWaves.current.guitar = ctx.createPeriodicWave(
        guitarReal,
        guitarImag,
      );
      
      // Strings: softer, more harmonics
      const stringsReal = new Float32Array([
        0, 0.8, 0.5, 0.3, 0.2, 0.12, 0.08, 0.05, 0.03,
      ]);
      const stringsImag = new Float32Array(stringsReal.length).fill(0);
      periodicWaves.current.strings = ctx.createPeriodicWave(
        stringsReal,
        stringsImag,
      );
      
      // Bell: emphasize higher harmonics
      const bellReal = new Float32Array([
        0, 0.5, 1.0, 0.8, 0.4, 0.6, 0.3, 0.2, 0.15,
      ]);
      const bellImag = new Float32Array(bellReal.length).fill(0);
      periodicWaves.current.bell = ctx.createPeriodicWave(
        bellReal,
        bellImag,
      );
      
    } catch (error) {
      console.error('Error initializing audio engine:', error);
    }
  }, []);

  const playTone = useCallback(
    (freq, instrumentType, duration = 0.1, x = 0.5, envelope = {}) => {
      if (!audioCtx.current || isMuted.current) {
        console.log('Audio context not available or muted');
        return;
      }
      
      if (audioCtx.current.state === "suspended") {
        console.log('Resuming suspended audio context');
        audioCtx.current.resume().catch(err => {
          console.error('Error resuming audio context:', err);
        });
      }

      try {
        const osc = audioCtx.current.createOscillator();
        const g = audioCtx.current.createGain();
        const panner = audioCtx.current.createStereoPanner();

        osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);

        // Set waveform based on instrument
        if (["sine", "triangle", "sawtooth", "square"].includes(instrumentType)) {
          osc.type = instrumentType;
        } else if (periodicWaves.current[instrumentType]) {
          osc.setPeriodicWave(periodicWaves.current[instrumentType]);
        } else {
          osc.type = "sine"; // fallback
        }

        panner.pan.setValueAtTime(x * 2 - 1, audioCtx.current.currentTime);

        // ADSR Envelope Shaping
        const {
          attack = 0.02,
          decay = 0.1,
          sustain = 0.7,
          release = 0.15,
        } = envelope;
        const peakVolume = 0.2;
        const sustainVolume = peakVolume * sustain; // sustain is 0-1 multiplier
        const now = audioCtx.current.currentTime;

        g.gain.setValueAtTime(0, now);
        // Attack: ramp to peak volume
        g.gain.linearRampToValueAtTime(peakVolume, now + attack);
        // Decay: exponential ramp to sustain level
        g.gain.exponentialRampToValueAtTime(
          Math.max(sustainVolume, 0.001), // Prevent zero for exponential ramp
          now + attack + decay,
        );
        // Release: fade to silence
        g.gain.exponentialRampToValueAtTime(
          0.0001,
          now + attack + decay + release,
        );

        osc.connect(g);
        g.connect(panner);
        panner.connect(masterGain.current);

        osc.start();
        osc.stop(now + duration + 0.1); // Add small buffer
      } catch (error) {
        console.error('Error in playTone:', error);
      }
    },
    [audioCtx, isMuted, periodicWaves],
  );

  const setVolume = (v) => {
    if (masterGain.current) masterGain.current.gain.value = v;
  };

  const toggleMute = () => {
    isMuted.current = !isMuted.current;
    return isMuted.current;
  };

  return { playTone, setVolume, toggleMute, audioCtx };
};
