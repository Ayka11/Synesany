# Synesthetica: Creative Interactive Immersive Music App

## Overview

**Synesthetica** is a creative, interactive, and immersive web application that transforms colors and drawings into music. Designed for both beginners and advanced users, it offers a unique blend of visual art and audio synthesis, allowing users to paint, select colors, and instantly hear their creations as musical notes or soundscapes.

---

## Features

### 🎨 Drawing & Brushes
- **Drawing Canvas:** Draw freely with your mouse or touch, creating colorful strokes that are instantly sonified.
- **Brush Types:**
  - **Round**: Smooth, circular brush for general drawing.
  - **Square**: Hard-edged, square brush for geometric effects.
  - **Spray**: Simulates spray paint for textured lines.
  - **Star**: Paints with star-shaped marks.
  - **Calligraphy**: Slanted, expressive strokes for calligraphic art.
  - **Pencil**: Thin, precise lines for sketching.
  - **Marker**: Bold, highlighter-style strokes.
- **Brush Size:** Adjustable from fine to broad for detailed or expressive work.

### 🌈 Color Selection & Palettes
- **Modern Color Wheel Picker:** Select any hue, saturation, and lightness. Preview the sound of each color before applying.
- **Default Palette:** Quick access to a curated set of vibrant colors.
- **Piano Palette:** 88-key rainbow palette, each color mapped to a real piano note.
- **Custom Palettes:** Easily add or modify palettes for personalized workflows.

### 🎵 Audio Engine & Instruments
- **Real-Time Sonification:** Every stroke or color selection produces a musical note or sound.
- **Instruments:**
  - **Piano:** Realistic, multi-partial synthesis for authentic piano timbre.
  - **Flute:** Smooth, airy tones.
  - **Bell:** Bright, resonant metallic sounds.
  - **Guitar:** Plucked string synthesis.
  - **Bass:** Deep, rounded bass notes.
- **Instrument Switching:** Instantly change the instrument for different sonic textures.
- **Volume & Mute Controls:** Fine-tune or silence the audio output.

### 🔊 Sonification Modes
- **Direct Mapping:** Each color directly maps to a musical note based on its hue/lightness.
- **Piano Key Mapping:** Colors are mapped to the nearest real piano key using the 88-key palette.
- **Custom Modes:** (If enabled) Experiment with alternative mappings or scales.

### 🛠️ Advanced Audio Features
- **Frequency Calculation:** Robust color-to-frequency mapping using HSL/HEX/RGB normalization.
- **Note Preview:** Preview the note/frequency of any color before applying.
- **Partial Tuning:** Piano synthesis uses tuned partials for realism.
- **Soundscape Generation:** Generate full musical soundscapes from your drawings.
- **Export:** Save your artwork as PNG, or (Pro) export as MP3/WAV audio.

- **ADSR Envelope** is one of the most important concepts in sound synthesis and music production when you want to shape how a synthesizer (or any sound-generating instrument) behaves over time.

It stands for four stages that control the **amplitude (volume)** of a note from the moment you press a key until long after you release it.

### The four stages explained visually and practically

| Stage      | Full name     | What it controls                              | Typical musical feel / examples                              | Slider range (common)     | Typical musical values          |
|------------|---------------|-----------------------------------------------|--------------------------------------------------------------
| **A**      | Attack        | How quickly the sound reaches full volume after you press the key | Fast attack = piano / plucked string / clicky sound<br>Slow attack = pad, string swell, soft brass | 0 ms – 5–10 seconds       | 5–50 ms (percussive)<br>300–2000 ms (pads) |
| **D**      | Decay         | How quickly the sound drops from peak to the sustain level (after attack finishes) | Short decay = sharp, punchy<br>Long decay = blooming, resonant | 0 ms – 5–10 seconds       | 50–300 ms (most instruments)<br>1–4 s (ambient) |
| **S**      | Sustain       | The volume level that is held **while the key is still pressed** (after decay) | 0% = no hold (like a plucked string dies away)<br>100% = organ / continuous drone | 0 – 100 %                 | 0–30% plucked sounds<br>70–100% organ/strings/pads |
| **R**      | Release       | How long the sound takes to fade away **after you release the key** | Short release = tight, staccato<br>Long release = lingering tail, reverb-like | 0 ms – 10–20 seconds      | 50–300 ms (natural)<br>1–8 s (ambient pads) |

### Classic real-world examples

| Sound type              | Attack   | Decay    | Sustain | Release    | Why it feels that way                              |
|-------------------------|----------|----------|---------|------------|-----------------------------------------------------|
| Acoustic piano          | very fast (~5–20 ms) | medium (~200–500 ms) | very low (~10–30%) | medium-short (~200–800 ms) | quick hammer hit → string rings → dies naturally   |
| Plucked guitar / harp   | fast     | medium   | ~0%     | medium     | string is plucked once → rings out → fades         |
| Organ / continuous pad  | medium-slow | long   | 100%    | long       | sound stays full while key held, lingers after     |
| Aggressive synth lead   | very fast | short   | high    | short      | punchy, immediate, cuts off sharply                |
| Ambient evolving pad    | very slow (1–4 s) | long   | 70–100% | very long (4–12 s) | swells in slowly, holds forever, dreamy tail       |
| 808 kick / punchy bass  | instant  | very short | low     | very short | boom → quick decay, no tail                        |

### How the sliders usually look in apps / synths

```
Attack     [slider]  ← 0 ms .................................... 5 s →
Decay      [slider]  ← 0 ms .................................... 5 s →
Sustain    [slider]  ← 0%  ──────────────────────────────── 100%
Release    [slider]  ← 0 ms .................................... 10 s →
```

### Quick cheat-sheet for beginners

Want this sound? → Try roughly these settings:

- **Piano / bell / plucked** → A: short, D: medium, S: low, R: medium-short
- **String / brass stab**     → A: short-medium, D: short-medium, S: medium, R: short
- **Pad / drone**             → A: long, D: long, S: high, R: long
- **Punchy bass / kick**      → A: 0–5 ms, D: 50–300 ms, S: 0–20%, R: 50–200 ms
- **Sci-fi whoosh / riser**   → A: very long, D: very long, S: high, R: medium-long



### 💡 For Beginners
- **Simple UI:** Intuitive controls for drawing, color selection, and playback.
- **Live Feedback:** Immediate audio response to every action.
- **Tooltips & Labels:** Helpful hints and labels throughout the interface.

### 🚀 For Advanced Users
- **Custom Palettes & Brushes:** Expand the palette or create new brush types.
- **Instrument & Sonification Customization:** Tweak instrument parameters or add new sonification modes.
- **Audio Engine Extensibility:** Modify or extend the audio synthesis engine for experimental sounds.
- **Export & Share:** Save and share your creations in image or audio formats.

---

## Main Functions & Usage

### Drawing & Painting
- Select a brush and color, then draw on the canvas. Each stroke is sonified in real time.
- Adjust brush size for detail or expression.

### Color Selection
- Use the color wheel for full-spectrum selection, or pick from palettes.
- Preview the sound of a color before applying.

### Audio & Instruments
- Switch instruments to change the sound character.
- Adjust volume or mute as needed.
- Use the soundscape generator to turn your drawing into a musical piece.

### Sonification Modes
- Choose how colors map to notes: direct, piano, or custom.

### Exporting
- Save your artwork as PNG.
- (Pro) Export your music as MP3 or WAV.

---

## File & Function Reference

- **src/components/ui/ColorWheelPicker.tsx**: Modern color picker with sound preview.
- **src/lib/audioEngine.ts**: Core audio synthesis and instrument logic.
- **src/data/pianoKeys.ts**: Piano key, frequency, and color mappings.
- **src/contexts/AppContext.tsx**: Global state for color, brush, instrument, etc.
- **src/components/synth/BottomBar.tsx**: Main UI for color, brush, and sound controls.
- **src/utils/colorUtils.ts**: Color conversion and mapping utilities.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app:**
   ```bash
   npm run dev
   ```
3. **Open in browser:**
   Visit the provided localhost URL.

---

## Tips
- Try different brushes and instruments for unique effects.
- Use the color wheel to explore the full spectrum of musical notes.
- Experiment with sonification modes for creative results.
- Save and share your favorite creations!

---

## Credits
- Built with React, TypeScript, Vite, Tailwind CSS, and the Web Audio API.
- Icons by Lucide.

---

Enjoy creating music with color!
