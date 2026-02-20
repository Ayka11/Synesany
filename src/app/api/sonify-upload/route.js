import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

// Helper function to map RGB to frequency
function rgbToFrequency(r, g, b) {
  // Map RGB brightness to frequency range (200-1200 Hz)
  const brightness = (r + g + b) / 3;
  return 200 + (brightness / 255) * 1000;
}

// Helper function to map RGB to MIDI note
function rgbToMidiNote(r, g, b) {
  const frequency = rgbToFrequency(r, g, b);
  // Convert frequency to MIDI note (A4 = 440Hz = MIDI note 69)
  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

// Generate audio data for timeline mode
async function generateTimelineAudio(imageBuffer, brushType = 'sine') {
  // For now, we'll use a simplified approach since we don't have Sharp
  // In a real implementation, you'd install and use Sharp for image processing
  
  // Create a simple frequency array based on image data
  const frequencies = [];
  const sampleRate = 44100;
  const duration = 8; // 8 seconds
  const audioData = new Float32Array(sampleRate * duration);
  
  // Generate some sample frequencies based on image data
  // This is a placeholder - in real implementation, you'd process the actual image
  for (let i = 0; i < 50; i++) {
    frequencies.push(200 + Math.random() * 1000);
  }
  
  // Generate timeline audio
  const columns = frequencies.length;
  const columnDuration = duration / columns;
  
  for (let col = 0; col < columns; col++) {
    const frequency = frequencies[col];
    const startTime = col * columnDuration;
    const endTime = (col + 1) * columnDuration;
    
    // Generate sine wave for this frequency
    for (let t = Math.floor(startTime * sampleRate); t < Math.floor(endTime * sampleRate); t++) {
      const time = t / sampleRate;
      const phase = 2 * Math.PI * frequency * time;
      
      // Apply envelope (fade in/out)
      const envelope = Math.min(1, (time - startTime) * 4) * Math.min(1, (endTime - time) * 4);
      
      // Different waveforms based on brush type
      let sample = 0;
      switch (brushType) {
        case 'square':
          sample = Math.sign(Math.sin(phase)) * 0.3;
          break;
        case 'sawtooth':
          sample = ((phase / (2 * Math.PI)) % 1 - 0.5) * 0.3;
          break;
        case 'triangle':
          sample = (2 * Math.asin(Math.sin(phase)) / Math.PI) * 0.3;
          break;
        default: // sine
          sample = Math.sin(phase) * 0.3;
      }
      
      audioData[t] += sample * envelope * 0.5;
    }
  }
  
  return { audioData, duration };
}

// Generate audio data for simple mode
async function generateSimpleAudio(imageBuffer, brushType = 'sine') {
  const sampleRate = 44100;
  const duration = 10; // 10 seconds
  const audioData = new Float32Array(sampleRate * duration);
  
  // Generate frequency progression based on brightness
  for (let i = 0; i < 100; i++) {
    const brightness = Math.random(); // Placeholder - would use actual image data
    const frequency = 200 + brightness * 1000; // 200-1200 Hz
    const startTime = (i / 100) * duration;
    const endTime = ((i + 1) / 100) * duration;
    
    for (let t = Math.floor(startTime * sampleRate); t < Math.floor(endTime * sampleRate); t++) {
      const time = t / sampleRate;
      const phase = 2 * Math.PI * frequency * time;
      
      let sample = 0;
      switch (brushType) {
        case 'square':
          sample = Math.sign(Math.sin(phase)) * 0.3;
          break;
        case 'sawtooth':
          sample = ((phase / (2 * Math.PI)) % 1 - 0.5) * 0.3;
          break;
        case 'triangle':
          sample = (2 * Math.asin(Math.sin(phase)) / Math.PI) * 0.3;
          break;
        default: // sine
          sample = Math.sin(phase) * 0.3;
      }
      
      const envelope = Math.min(1, (time - startTime) * 4) * Math.min(1, (endTime - time) * 4);
      audioData[t] += sample * envelope * 0.5;
    }
  }
  
  return { audioData, duration };
}

// Generate audio data for harmonic mode
async function generateHarmonicAudio(imageBuffer, brushType = 'sine') {
  const sampleRate = 44100;
  const duration = 12; // 12 seconds for richer harmonic experience
  const audioData = new Float32Array(sampleRate * duration);
  
  // Generate harmonic progressions
  for (let i = 0; i < 80; i++) {
    const baseFreq = 220 + Math.random() * 440; // A3 to A5 range
    const startTime = (i / 80) * duration;
    const endTime = ((i + 1) / 80) * duration;
    
    for (let t = Math.floor(startTime * sampleRate); t < Math.floor(endTime * sampleRate); t++) {
      const time = t / sampleRate;
      const phase = 2 * Math.PI * baseFreq * time;
      
      // Generate harmonics
      let sample = 0;
      switch (brushType) {
        case 'piano':
          sample = Math.sin(phase) * 0.2 + 
                   Math.sin(phase * 2) * 0.1 + 
                   Math.sin(phase * 3) * 0.05;
          break;
        case 'guitar':
          sample = Math.sin(phase) * 0.25 + 
                   Math.sin(phase * 2.5) * 0.08 + 
                   Math.sin(phase * 4) * 0.04;
          break;
        case 'violin':
          sample = Math.sin(phase) * 0.18 + 
                   Math.sin(phase * 2.2) * 0.12 + 
                   Math.sin(phase * 3.3) * 0.06;
          break;
        default:
          sample = Math.sin(phase) * 0.2 + 
                   Math.sin(phase * 2) * 0.1;
      }
      
      const envelope = Math.min(1, (time - startTime) * 2) * Math.min(1, (endTime - time) * 2);
      audioData[t] += sample * envelope * 0.4;
    }
  }
  
  return { audioData, duration };
}

// Generate audio data for color field mode (enhanced version)
async function generateColorFieldAudio(imageBuffer, brushType = 'sine') {
  const sampleRate = 44100;
  const duration = 15; // 15 seconds for richer color field experience
  const audioData = new Float32Array(sampleRate * duration);
  
  // For now, we'll use a more sophisticated approach with multiple layers
  // In a real implementation, you'd process the actual image
  
  // Generate frequency clusters based on color harmonies
  const frequencyLayers = [
    // Layer 1: Bass frequencies (warm colors)
    { frequencies: [220, 246, 261, 293], amplitudes: [0.3, 0.25, 0.2, 0.15], envelope: 'slow' },
    // Layer 2: Mid frequencies (neutral colors)  
    { frequencies: [330, 349, 392, 440], amplitudes: [0.2, 0.25, 0.3, 0.25], envelope: 'medium' },
    // Layer 3: High frequencies (cool colors)
    { frequencies: [494, 523, 587, 659], amplitudes: [0.15, 0.2, 0.25, 0.3], envelope: 'fast' },
    // Layer 4: Harmonic overtones (bright accents)
    { frequencies: [784, 880, 988, 1047], amplitudes: [0.1, 0.15, 0.1, 0.05], envelope: 'bright' }
  ];
  
  // Generate layered harmonic texture
  frequencyLayers.forEach((layer, layerIndex) => {
    layer.frequencies.forEach((frequency, freqIndex) => {
      const amplitude = layer.amplitudes[freqIndex];
      const startTime = layerIndex * 0.5; // Stagger layer starts
      
      for (let t = Math.floor(startTime * sampleRate); t < Math.floor(duration * sampleRate); t++) {
        const time = t / sampleRate;
        const phase = 2 * Math.PI * frequency * time;
        
        // Dynamic envelope based on layer type
        let envelope = 1;
        switch (layer.envelope) {
          case 'slow':
            envelope = Math.min(1, (time - startTime) * 0.3) * Math.max(0, 1 - (time - (duration - 3)) * 0.3);
            break;
          case 'medium':
            envelope = Math.min(1, (time - startTime) * 0.5) * Math.max(0, 1 - (time - (duration - 2)) * 0.5);
            break;
          case 'fast':
            envelope = Math.min(1, (time - startTime) * 0.8) * Math.max(0, 1 - (time - (duration - 1)) * 0.8);
            break;
          case 'bright':
            envelope = Math.sin(time * 0.1) * 0.5 + 0.5; // Pulsing effect
            break;
        }
        
        // Generate waveform with harmonics
        let sample = 0;
        const baseFreq = frequency;
        const harmonic2 = baseFreq * 2;
        const harmonic3 = baseFreq * 3;
        
        switch (brushType) {
          case 'square':
            sample = Math.sign(Math.sin(phase)) * 0.2;
            break;
          case 'sawtooth':
            sample = ((phase / (2 * Math.PI)) % 1 - 0.5) * 0.2;
            break;
          case 'triangle':
            sample = (2 * Math.asin(Math.sin(phase)) / Math.PI) * 0.2;
            break;
          case 'star': // Additive harmonics
            sample = Math.sin(phase) * 0.15 + Math.sin(harmonic2 * time * 2 * Math.PI) * 0.05;
            break;
          case 'cross': // Detuned beating
            sample = Math.sin(phase) * 0.1 + Math.sin((frequency + 20) * time * 2 * Math.PI) * 0.05;
            break;
          case 'spray': // Frequency modulation
            const lfo = Math.sin(time * 5) * 40; // 5Hz LFO modulating ±40Hz
            sample = Math.sin((frequency + lfo) * time * 2 * Math.PI) * 0.15;
            break;
          default: // sine
            sample = Math.sin(phase) * 0.2;
        }
        
        audioData[t] += sample * envelope * amplitude * 0.4; // Reduce overall volume for layering
      }
    });
  });
  
  return { audioData, duration };
}

// Convert Float32Array to WAV buffer
function audioDataToWAV(audioData, sampleRate) {
  const length = audioData.length;
  const buffer = Buffer.alloc(44 + length * 2);
  
  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + length * 2, 4);
  buffer.write("WAVE", 8);
  
  // fmt chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size
  buffer.writeUInt16LE(1, 20); // audio format (PCM)
  buffer.writeUInt16LE(1, 22); // num channels
  buffer.writeUInt32LE(sampleRate, 24); // sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  
  // data chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(length * 2, 40);
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, audioData[i]));
    buffer.writeInt16LE(sample * 0x7FFF, offset);
    offset += 2;
  }
  
  return buffer;
}

// Generate unique ID
function generateId() {
  return randomBytes(16).toString('hex');
}

export async function POST({ request }) {
  const [{ auth }, { default: sql }] = await Promise.all([
    import('../../../auth.js'),
    import('../utils/sql.js'),
  ]);
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const mode = formData.get('mode') || 'timeline';
    const brushType = formData.get('brushType') || 'sine';
    
    if (!imageFile) {
      return Response.json({ error: 'No image file provided' }, { status: 400 });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 });
    }
    
    // Validate file size (max 8MB)
    if (imageFile.size > 8 * 1024 * 1024) {
      return Response.json({ error: 'File too large (max 8MB)' }, { status: 400 });
    }
    
    // Convert file to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Generate audio based on mode
    let audioResult;
    if (mode === 'simple') {
      audioResult = await generateSimpleAudio(imageBuffer, brushType);
    } else if (mode === 'timeline') {
      audioResult = await generateTimelineAudio(imageBuffer, brushType);
    } else if (mode === 'colorfield') {
      audioResult = await generateColorFieldAudio(imageBuffer, brushType);
    } else if (mode === 'harmonic') {
      audioResult = await generateHarmonicAudio(imageBuffer, brushType);
    } else {
      return Response.json({ error: 'Invalid mode. Supported modes: simple, timeline, colorfield, harmonic' }, { status: 400 });
    }
    
    // Convert to WAV
    const wavBuffer = audioDataToWAV(audioResult.audioData, 44100);
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'uploads', 'audio');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save audio file locally
    const audioId = generateId();
    const filename = `${audioId}.wav`;
    const audioPath = join(uploadDir, filename);
    
    // Write file synchronously
    require('fs').writeFileSync(audioPath, wavBuffer);
    
    const result = {
      url: `/uploads/audio/${filename}`,
      duration: audioResult.duration,
      mode: mode
    };
    
    return Response.json(result);
    
  } catch (error) {
    console.error('Sonification error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
