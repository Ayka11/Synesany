
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Play, Download, Loader2, Crown, Image, FileAudio,
  Palette, Paintbrush, Music, Sparkles, Save, X,
  Volume2, VolumeX, Circle, Square, Star, PenTool,
  Pencil, Highlighter
} from 'lucide-react';

import { DEFAULT_COLORS, PIANO_KEYS, BrushType, InstrumentType } from '@/data/pianoKeys';

import ImageSonifyButton from './ImageSonifyButton';

import ColorWheelPicker from '../ui/ColorWheelPicker';


const BottomBar: React.FC = () => {
  const {
    isGenerating, generateProgress, generateSoundscape,
    dailyCount, dailyLimit, strokes,
    mobilePanel, setMobilePanel,
    currentColor, setCurrentColor,
    brushType, setBrushType, brushSize, setBrushSize,
    volume, setVolume, muted, setMuted,
    instrument, setInstrument,
    canvasRef, saveCurrentDrawing,
  } = useAppContext();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [exportOpen, setExportOpen] = React.useState(false);
  const [saveModalOpen, setSaveModalOpen] = React.useState(false);
  const [saveName, setSaveName] = React.useState('');

  const handleExport = (format: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `synesthetica-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      // Gated by subscription
      alert('MP3 and WAV export requires Pro subscription');
    }
    setExportOpen(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !saveName.trim()) return;
    const thumbnail = canvas.toDataURL('image/png', 0.3);
    saveCurrentDrawing(saveName.trim(), thumbnail);
    setSaveName('');
    setSaveModalOpen(false);
  };

  const BRUSHES: { type: BrushType; icon: React.ReactNode; key: string }[] = [
    { type: 'round', icon: <Circle className="w-5 h-5" />, key: 'brush.round' },
    { type: 'square', icon: <Square className="w-5 h-5" />, key: 'brush.square' },
    { type: 'spray', icon: <Sparkles className="w-5 h-5" />, key: 'brush.spray' },
    { type: 'star', icon: <Star className="w-5 h-5" />, key: 'brush.star' },
    { type: 'calligraphy', icon: <PenTool className="w-5 h-5" />, key: 'brush.calligraphy' },
    { type: 'pencil', icon: <Pencil className="w-5 h-5" />, key: 'brush.pencil' },
    { type: 'marker', icon: <Highlighter className="w-5 h-5" />, key: 'brush.marker' },
  ];

  const INSTRUMENTS: { type: InstrumentType; key: string }[] = [
    { type: 'bell', key: 'instrument.bell' },
    { type: 'guitar', key: 'instrument.guitar' },
    { type: 'bass', key: 'instrument.bass' },
    { type: 'piano', key: 'instrument.piano' },
    { type: 'violin', key: 'instrument.violin' },
  ];

  return (
    <>
      {/* Mobile bottom sheet */}
      {isMobile && mobilePanel && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobilePanel(null)} />
          <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl max-h-[60vh] overflow-y-auto p-4 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm capitalize">{mobilePanel}</h3>
              <button onClick={() => setMobilePanel(null)} className="p-1 rounded-lg hover:bg-accent">
                <X className="w-5 h-5" />
              </button>
            </div>

            {mobilePanel === 'colors' && (
              <div className="space-y-3 border-2 border-dashed border-red-500 relative">
                {/* DEBUG: Mobile Palette Rendered */}
                <div style={{position:'absolute',top:0,left:0,right:0,zIndex:1000,background:'#fff3',color:'#b00',fontWeight:'bold',textAlign:'center',fontSize:12}}>
                  DEBUG: Palette UI visible (isMobile: {String(isMobile)}, mobilePanel: {String(mobilePanel)})
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border-2 border-border" style={{ backgroundColor: currentColor }} />
                </div>
                <div>
                  {/* Modern Color Wheel Picker */}
                  <ColorWheelPicker currentColor={currentColor} onColorChange={setCurrentColor} />
                </div>
                <div className="grid grid-cols-10 gap-1.5">
                  {DEFAULT_COLORS.map(c => (
                    <button key={c} onClick={() => setCurrentColor(c)}
                      className={`aspect-square rounded-lg border ${currentColor === c ? 'ring-2 ring-primary scale-110' : 'border-border/30'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="grid grid-cols-11 gap-0.5">
                  {PIANO_KEYS.slice(39, 63).map(k => (
                    <button key={k.note} onClick={() => setCurrentColor(k.color)}
                      title={k.note}
                      className="aspect-square rounded-sm hover:scale-125 transition-transform"
                      style={{ backgroundColor: k.color }} />
                  ))}
                </div>
                {/* DEBUG: Show color array lengths */}
                <div style={{fontSize:10, color:'#b00', marginTop:4}}>
                  DEFAULT_COLORS: {DEFAULT_COLORS.length}, PIANO_KEYS: {PIANO_KEYS.length}
                </div>
              </div>
            )}

            {mobilePanel === 'brushes' && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {BRUSHES.map(b => (
                    <button key={b.type} onClick={() => setBrushType(b.type)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                        brushType === b.type ? 'bg-primary/15 text-primary ring-1 ring-primary/30' : 'hover:bg-accent text-muted-foreground'
                      }`}>
                      {b.icon}
                      <span className="text-[10px]">{t(b.key)}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{t('brush.size')}</span>
                  <input type="range" min="1" max="50" value={brushSize}
                    onChange={e => setBrushSize(parseInt(e.target.value))}
                    className="flex-1 h-1.5 accent-primary" />
                  <span className="text-xs font-mono w-6">{brushSize}</span>
                </div>
              </div>
            )}

            {mobilePanel === 'sound' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMuted(!muted)}
                    className="p-2 rounded-lg hover:bg-accent">
                    {muted ? <VolumeX className="w-5 h-5 text-destructive" /> : <Volume2 className="w-5 h-5 text-primary" />}
                  </button>
                  <input type="range" min="0" max="1" step="0.01"
                    value={muted ? 0 : volume}
                    onChange={e => { setVolume(parseFloat(e.target.value)); if (parseFloat(e.target.value) > 0 && muted) setMuted(false); }}
                    className="flex-1 h-1.5 accent-primary" />
                  <span className="text-xs font-mono">{Math.round(volume * 100)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 relative">
                  {INSTRUMENTS.map(inst => (
                    <button key={inst.type} onClick={() => setInstrument(inst.type)}
                      className={`text-xs py-2 px-3 rounded-xl transition-all ${
                        instrument === inst.type ? 'bg-primary/15 text-primary font-medium' : 'hover:bg-accent text-muted-foreground'
                      }`}
                      title={
                        inst.type === 'piano' ? 'Melodic, harmonic, expressive (all modes)' :
                        inst.type === 'violin' ? 'Expressive, emotional, sustained (Harmonic, Timeline, Colorfield)' :
                        inst.type === 'bell' ? 'Bright, sparkling accents (Simple, Timeline)' :
                        inst.type === 'guitar' ? 'Plucked, rhythmic, melodic (Simple, Timeline)' :
                        inst.type === 'bass' ? 'Deep foundations, bold outlines (all modes)' :
                        ''
                      }
                    >
                      {t(inst.key)}
                    </button>
                  ))}
                  <div className="absolute top-full mt-2 left-0 w-full z-40">
                    <div className="bg-popover border border-border rounded-xl shadow-xl p-3 text-xs text-muted-foreground">
                      <div className="font-semibold text-primary mb-1">Live/Acoustic Instrument Suggestions</div>
                      <ul className="mb-2 list-disc pl-4">
                        <li><b>Piano:</b> Melodic, harmonic, expressive (all modes)</li>
                        <li><b>Strings:</b> Rich, emotional layers (Harmonic, Timeline, Colorfield)</li>
                        <li><b>Guitar:</b> Plucked, rhythmic, melodic (Simple, Timeline)</li>
                        <li><b>Bell/Mallet:</b> Bright, sparkling accents (Simple, Timeline)</li>
                        <li><b>Woodwinds:</b> Airy, lyrical textures (Colorfield, Harmonic)</li>
                        <li><b>Brass:</b> Warm, majestic tones (Harmonic, Colorfield)</li>
                        <li><b>Synth Pads:</b> Gentle ambient backgrounds (Colorfield, Harmonic)</li>
                      </ul>
                      <div className="text-[10px] text-muted-foreground">Try layering instruments and matching modes for cinematic, expressive results.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSaveModalOpen(false)} />
          <div className="relative bg-background border border-border rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-3">Save Drawing</h3>
            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Drawing name..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm mb-4"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <div className="flex gap-2">
              <button onClick={() => setSaveModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors">
                Cancel
              </button>
              <button onClick={handleSave}
                disabled={!saveName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-border/30 bg-background/80 backdrop-blur-xl px-3 py-2">
        {/* Mobile nav icons */}
        {isMobile && (
          <div className="flex items-center justify-around mb-2 pb-2 border-b border-border/20">
            <button onClick={() => setMobilePanel('colors')}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-accent transition-colors">
              <Palette className="w-5 h-5 text-pink-500" />
              <span className="text-[9px]">{t('mobile.colors')}</span>
            </button>
            <button onClick={() => setMobilePanel('brushes')}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-accent transition-colors">
              <Paintbrush className="w-5 h-5 text-blue-500" />
              <span className="text-[9px]">{t('mobile.brushes')}</span>
            </button>
            <button onClick={() => setMobilePanel('sound')}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-accent transition-colors">
              <Music className="w-5 h-5 text-green-500" />
              <span className="text-[9px]">{t('mobile.sound')}</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 justify-between">
          {/* Daily counter */}
          <div className="flex items-center gap-2">
            {/* Sonify Image Upload Button */}
            <ImageSonifyButton />
            <div className="text-[10px] text-muted-foreground">
              <span className="font-mono font-bold text-foreground">{dailyCount}</span>
              <span>/{dailyLimit} {t('daily.limit')}</span>
            </div>
            {dailyCount >= dailyLimit && (
              <button className="flex items-center gap-1 text-[10px] text-amber-500 font-medium hover:underline">
                <Crown className="w-3 h-3" /> {t('daily.upgrade')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Save button */}
            <button
              onClick={() => setSaveModalOpen(true)}
              disabled={strokes.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-accent transition-colors disabled:opacity-30"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Export dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                disabled={strokes.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-accent transition-colors disabled:opacity-30"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('tool.export')}</span>
              </button>
              {exportOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setExportOpen(false)} />
                  <div className="absolute bottom-full mb-2 right-0 bg-popover border border-border rounded-xl shadow-xl z-40 py-1 min-w-[160px]">
                    <button onClick={() => handleExport('png')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors">
                      <Image className="w-3.5 h-3.5" /> PNG Image
                    </button>
                    <button onClick={() => handleExport('mp3')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors text-muted-foreground">
                      <FileAudio className="w-3.5 h-3.5" /> MP3 Audio
                      <Crown className="w-3 h-3 text-amber-500 ml-auto" />
                    </button>
                    <button onClick={() => handleExport('wav')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors text-muted-foreground">
                      <FileAudio className="w-3.5 h-3.5" /> WAV Audio
                      <Crown className="w-3 h-3 text-amber-500 ml-auto" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Generate button */}
            <button
              onClick={generateSoundscape}
              disabled={isGenerating || strokes.length === 0 || dailyCount >= dailyLimit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('tool.generating')} {Math.round(generateProgress * 100)}%</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{t('tool.generate')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomBar;