# Synesthetica: Creative Interactive Immersive Music App

**Synesthetica** is a next-generation web app that transforms your drawings and colors into expressive music. Paint, select colors, and instantly hear your art as musical notes, soundscapes, or harmonies. Designed for both beginners and advanced users, Synesthetica blends visual creativity with real-time audio synthesis.

---

## 🚀 Key Features

<<<<<<< HEAD
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

---

## 🆕 Image Sonification Feature

- **Upload Image to Canvas:** Instantly upload a JPG, PNG, or GIF and see it rendered directly on the main drawing canvas.
- **Sonify Any Image:** Click the same button to generate a soundscape from the uploaded image, using the currently selected sonification mode:
  - **Simple:** Average color → single expressive tone
  - **Timeline:** Left-to-right scan → sequence of notes
  - **Colorfield:** 2D grid → spatial, ambient tones (with panning)
  - **Harmonic:** Color clusters/quadrants → layered chords
- **Play/Stop Toggle:** Use the button to start or stop playback. Button disables during playback for smooth UX.
- **No Server Required:** All processing and audio synthesis happens in the browser.

---

## 🖥️ Usage

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

## 📝 Tips & Creative Ideas
- Try different brushes and instruments for unique effects.
- Use the color wheel for microtonal or experimental music.
- Switch sonification modes to explore new musical mappings.
- Save and share your favorite creations!

---

## 🛠️ File Reference
- `src/components/ui/ColorWheelPicker.tsx`: Modern color picker with sound preview.
- `src/lib/audioEngine.ts`: Core audio synthesis and instrument logic.
- `src/data/pianoKeys.ts`: Piano key, frequency, and color mappings.
- `src/contexts/AppContext.tsx`: Global state for color, brush, instrument, etc.
- `src/components/synth/BottomBar.tsx`: Main UI for color, brush, and sound controls.
- `src/utils/colorUtils.ts`: Color conversion and mapping utilities.

---

## 🏆 Credits
- Built with React, TypeScript, Vite, Tailwind CSS, and the Web Audio API.
- Icons by Lucide.

---

## Recent Updates
- Visual time axis and mode overlay for all sonification modes.
- Improved instrument list and piano sound.
- Palette and color wheel mapping clarified.
- Bug fixes for blank page, duration, and instrument selection.
