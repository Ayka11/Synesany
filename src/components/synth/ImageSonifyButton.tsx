import React, { useRef, useState } from "react";
import { useAppContext } from '@/contexts/AppContext';

// Simple RGB to frequency mapping (demo)
function rgbToFrequency(r: number, g: number, b: number) {
  // Map hue to 220–880 Hz (A3–A5)
  const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180 / Math.PI;
  const normHue = ((hue + 360) % 360) / 360;
  return 220 + normHue * 660;
}

// Average color from image data
function getAverageColor(data: Uint8ClampedArray) {
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  return [r / count, g / count, b / count];
}


const ImageSonifyButton: React.FC = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgData, setImgData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // Track all active nodes for stopping
  const activeNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode; pan?: StereoPannerNode }[]>([]);
  const { sonificationMode, canvasRef } = useAppContext();

  // Resume AudioContext on user interaction
  const resumeAudio = async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new window.AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
  };

  // Stop all active sounds
  const stopSonification = () => {
    activeNodesRef.current.forEach(({ osc, gain, pan }) => {
      try { osc.stop(); } catch {}
      try { osc.disconnect(); } catch {}
      try { gain.disconnect(); } catch {}
      try { pan?.disconnect(); } catch {}
    });
    activeNodesRef.current = [];
    setIsPlaying(false);
  };

  // Load image and extract pixel data
  const handleFile = (file: File) => {
    setLoading(true);
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      setImgUrl(e.target?.result as string);
    };
    img.onload = () => {
      // Draw image on main canvas
      const mainCanvas = canvasRef?.current;
      if (mainCanvas) {
        const ctx = mainCanvas.getContext("2d");
        if (ctx) {
          // Fit image to canvas, preserve aspect ratio
          const scale = Math.min(mainCanvas.width / img.width, mainCanvas.height / img.height, 1);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const offsetX = (mainCanvas.width - drawW) / 2;
          const offsetY = (mainCanvas.height - drawH) / 2;
          ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        }
      }
      // Also extract pixel data for sonification
      const tempCanvas = document.createElement("canvas");
      const maxW = 128;
      const scale = Math.min(1, maxW / img.width);
      tempCanvas.width = img.width * scale;
      tempCanvas.height = img.height * scale;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return setLoading(false);
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      setImgData(imageData);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Sonification logic for each mode
  const playSonification = async () => {
    await resumeAudio();
    if (!imgData || !audioCtxRef.current) return;
    setIsPlaying(true);
    const audioCtx = audioCtxRef.current;
    stopSonification(); // Clear any previous playback

    if (sonificationMode === 'simple') {
      // Average color → single sustained tone with ADSR
      const [r, g, b] = getAverageColor(imgData.data);
      const baseFreq = rgbToFrequency(r, g, b);
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = baseFreq;
      osc.connect(gain).connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      const duration = 5; // 5 seconds
      gain.gain.setValueAtTime(0, now); // Start silent
      gain.gain.linearRampToValueAtTime(0.3, now + 0.1); // Attack
      gain.gain.linearRampToValueAtTime(0.2, now + 0.3); // Decay
      gain.gain.setValueAtTime(0.2, now + duration - 0.5); // Sustain
      gain.gain.linearRampToValueAtTime(0, now + duration); // Release

      osc.start(now);
      osc.stop(now + duration);
      osc.onended = () => {
        gain.disconnect();
        setIsPlaying(false);
      };
      activeNodesRef.current.push({ osc, gain });

    } else if (sonificationMode === 'timeline') {
      // Scan columns left-to-right, play sequence of notes with ADSR
      const { width, height, data } = imgData;
      let colNotes: [number, number, number][] = [];
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, count = 0;
        for (let y = 0; y < height; y++) {
          const idx = (y * width + x) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
        colNotes.push([r / count, g / count, b / count]);
      }
      let t = audioCtx.currentTime;
      const noteDur = Math.max(0.1, 4 / colNotes.length); // Slower for better listening
      colNotes.forEach(([r, g, b], i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = rgbToFrequency(r, g, b);
        osc.connect(gain).connect(audioCtx.destination);

        const noteStart = t + i * noteDur;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.05); // Attack
        gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.15); // Decay
        gain.gain.setValueAtTime(0.15, noteStart + noteDur - 0.1); // Sustain
        gain.gain.linearRampToValueAtTime(0, noteStart + noteDur); // Release

        osc.start(noteStart);
        osc.stop(noteStart + noteDur);
        osc.onended = () => gain.disconnect();
        activeNodesRef.current.push({ osc, gain });
      });
      // Set playing false after full duration
      setTimeout(() => setIsPlaying(false), colNotes.length * noteDur * 1000);

    } else if (sonificationMode === 'colorfield') {
      // Divide into grid (e.g. 4x4), play sustained tones with pan based on x, pitch shift on y
      const { width, height, data } = imgData;
      const gridSize = 4;
      const duration = 6; // 6 seconds per tone
      const now = audioCtx.currentTime;

      for (let gy = 0; gy < gridSize; gy++) {
        for (let gx = 0; gx < gridSize; gx++) {
          // Average color in grid cell
          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          const cellW = Math.floor(width / gridSize);
          const cellH = Math.floor(height / gridSize);
          for (let y = gy * cellH; y < (gy + 1) * cellH; y++) {
            for (let x = gx * cellW; x < (gx + 1) * cellW; x++) {
              const idx = (y * width + x) * 4;
              rSum += data[idx];
              gSum += data[idx + 1];
              bSum += data[idx + 2];
              count++;
            }
          }
          const r = rSum / count;
          const g = gSum / count;
          const b = bSum / count;

          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const pan = audioCtx.createStereoPanner();
          osc.type = "triangle"; // Softer for spatial
          osc.frequency.value = rgbToFrequency(r, g, b) * (1 + (gy / gridSize - 0.5) * 0.5); // y = slight pitch shift
          pan.pan.value = (gx / (gridSize - 1)) * 2 - 1; // x = left-right pan
          gain.gain.value = 0.1 + (r + g + b) / (3 * 255) * 0.15;

          osc.connect(gain).connect(pan).connect(audioCtx.destination);

          // ADSR for each tone
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.3); // Attack
          gain.gain.linearRampToValueAtTime(0.15, now + 0.8); // Decay
          gain.gain.setValueAtTime(0.15, now + duration - 1); // Sustain
          gain.gain.linearRampToValueAtTime(0, now + duration); // Release

          osc.start(now);
          osc.stop(now + duration);
          osc.onended = () => {
            gain.disconnect();
            pan.disconnect();
          };
          activeNodesRef.current.push({ osc, gain, pan });
        }
      }
      setTimeout(() => setIsPlaying(false), duration * 1000);

    } else if (sonificationMode === 'harmonic') {
      // Build chords from color clusters (e.g. average + variations from quadrants)
      const { width, height, data } = imgData;
      const quadrants = [
        { x: 0, y: 0, w: width / 2, h: height / 2 },
        { x: width / 2, y: 0, w: width / 2, h: height / 2 },
        { x: 0, y: height / 2, w: width / 2, h: height / 2 },
        { x: width / 2, y: height / 2, w: width / 2, h: height / 2 },
      ];

      const chordColors: [number, number, number][] = [];
      quadrants.forEach(q => {
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let y = Math.floor(q.y); y < Math.floor(q.y + q.h); y++) {
          for (let x = Math.floor(q.x); x < Math.floor(q.x + q.w); x++) {
            const idx = (y * width + x) * 4;
            rSum += data[idx];
            gSum += data[idx + 1];
            bSum += data[idx + 2];
            count++;
          }
        }
        chordColors.push([rSum / count, gSum / count, bSum / count]);
      });

      const now = audioCtx.currentTime;
      const duration = 6; // 6 seconds
      const ratios = [1, 1.25, 1.5, 2]; // Root, major third-ish, fifth, octave

      chordColors.forEach(([r, g, b], i) => {
        const baseFreq = rgbToFrequency(r, g, b);
        ratios.forEach((ratio, j) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sawtooth"; // Richer for harmonics
          osc.frequency.value = baseFreq * ratio;
          gain.gain.value = 0.08 / ratios.length;

          osc.connect(gain).connect(audioCtx.destination);

          // ADSR
          gain.gain.setValueAtTime(0, now + j * 0.1); // Slight stagger
          gain.gain.linearRampToValueAtTime(0.15, now + j * 0.1 + 0.2); // Attack
          gain.gain.linearRampToValueAtTime(0.1, now + j * 0.1 + 0.5); // Decay
          gain.gain.setValueAtTime(0.1, now + duration - 1); // Sustain
          gain.gain.linearRampToValueAtTime(0, now + duration); // Release

          osc.start(now + j * 0.1);
          osc.stop(now + duration);
          osc.onended = () => gain.disconnect();
          activeNodesRef.current.push({ osc, gain });
        });
      });
      setTimeout(() => setIsPlaying(false), duration * 1000);
    }
  };

  return (
    <div style={{ display: "inline-block", marginLeft: 12 }}>
      {!imgUrl && (
        <label
          style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "#eee",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 500,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Loading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            style={{ display: "none" }}
            disabled={loading}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
      {imgUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <button
            className={
              `px-4 py-2 rounded-lg font-semibold mt-2 transition-colors ` +
              (isPlaying
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 cursor-pointer')
            }
            onClick={isPlaying ? stopSonification : playSonification}
            disabled={isPlaying && activeNodesRef.current.length === 0}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSonifyButton;
