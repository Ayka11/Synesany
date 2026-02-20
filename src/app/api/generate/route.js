/**
 * Basic WAV generation helper
 */
function createWavBuffer(sampleRate, samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
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
  buffer.writeUInt32LE(samples.length * 2, 40);

  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(sample * 32767, 44 + i * 2);
  }

  return buffer;
}

/**
 * Basic MIDI generation helper (single track)
 */
function createMidiBuffer(notes) {
  const writeVlq = (value) => {
    let v = Math.max(0, value | 0);
    const bytes = [v & 0x7f];
    v >>= 7;
    while (v > 0) {
      bytes.unshift((v & 0x7f) | 0x80);
      v >>= 7;
    }
    return bytes;
  };

  // Simple MIDI file structure: MThd + MTrk
  const header = Buffer.from([
    0x4d,
    0x54,
    0x68,
    0x64, // MThd
    0x00,
    0x00,
    0x00,
    0x06, // length
    0x00,
    0x00, // format 0
    0x00,
    0x01, // 1 track
    0x01,
    0xe0, // 480 ticks per quarter note
  ]);

  const trackEvents = [];

  trackEvents.push(
    0x00,
    0xff,
    0x51,
    0x03,
    0x07,
    0xa1,
    0x20,
  );

  // Simple conversion: each note is 480 ticks
  notes.forEach((note) => {
    // Note On
    trackEvents.push(0x00); // delta time
    trackEvents.push(0x90, note.pitch, note.velocity);
    // Note Off
    trackEvents.push(...writeVlq(480));
    trackEvents.push(0x80, note.pitch, 0x00);
  });

  // End of track
  trackEvents.push(0x00, 0xff, 0x2f, 0x00);

  const trackData = Buffer.from(trackEvents);
  const trackHeader = Buffer.alloc(8);
  trackHeader.write("MTrk", 0);
  trackHeader.writeUInt32BE(trackData.length, 4);

  return Buffer.concat([header, trackHeader, trackData]);
}

export async function POST(req) {
  try {
    const { imageData, width, height, isPro } = await req.json();

    if (!Array.isArray(imageData)) {
      return Response.json({ error: 'Invalid imageData' }, { status: 400 });
    }
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return Response.json({ error: 'Invalid dimensions' }, { status: 400 });
    }

    const maxPixels = 1024 * 1024;
    if (width * height > maxPixels) {
      return Response.json({ error: 'Image too large' }, { status: 413 });
    }

    if (imageData.length < width * height * 4) {
      return Response.json({ error: 'Incomplete imageData' }, { status: 400 });
    }

    const sampleRate = 44100;
    const durationPerColumn = 0.05;
    const totalSamples = Math.floor(width * durationPerColumn * sampleRate);
    const audioSamples = new Float32Array(totalSamples);
    const midiNotes = [];

  // RGB -> Freq mapping (Logarithmic A0-C8)
  const getFreq = (r, g, b) => {
    const intensity = (r + g + b) / 3;
    if (intensity < 10) return null;
    // Map 0-255 to 27.5 - 4186 Hz
    return 27.5 * Math.pow(2, (intensity / 255) * 7.25); // ~7.25 octaves
  };

    for (let x = 0; x < width; x++) {
      const columnFrequencies = [];
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * 4;
        const r = imageData[idx];
        const g = imageData[idx + 1];
        const b = imageData[idx + 2];
        const a = imageData[idx + 3];
        if (a > 10) {
          const freq = getFreq(r, g, b);
          if (freq) columnFrequencies.push({ freq, size: (r + g + b) / 3 });
        }
      }

    // Synthesize column
    const startIdx = Math.floor(x * durationPerColumn * sampleRate);
    const endIdx = Math.min(
      totalSamples,
      Math.floor((x + 1) * durationPerColumn * sampleRate),
    );

    for (let i = startIdx; i < endIdx; i++) {
      let sample = 0;
      columnFrequencies.forEach((item) => {
        const t = i / sampleRate;
        sample +=
          Math.sin(2 * Math.PI * item.freq * t) * (item.size / 255) * 0.1;
      });
      audioSamples[i] = sample;
    }

      if (isPro && columnFrequencies.length > 0) {
        const best = columnFrequencies.reduce((prev, current) =>
          prev.size > current.size ? prev : current,
        );
        const midiPitch = Math.round(12 * Math.log2(best.freq / 440) + 69);
        midiNotes.push({
          pitch: Math.max(0, Math.min(127, midiPitch)),
          velocity: Math.floor((best.size / 255) * 127),
        });
      }
    }

    const wavBuffer = createWavBuffer(sampleRate, audioSamples);
    const response = {
      audio: wavBuffer.toString('base64'),
    };

    if (isPro) {
      const midiBuffer = createMidiBuffer(midiNotes);
      response.midi = midiBuffer.toString('base64');
    }

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: 'Failed to generate sound' }, { status: 500 });
  }
}
