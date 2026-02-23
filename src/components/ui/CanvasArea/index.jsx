import React from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SonificationModePanel } from '@/components/ui/SonificationModePanel';
import { CanvasStatusPanel } from '@/components/ui/CanvasStatusPanel';
import { TimeScale } from '@/components/ui/TimeScale';
import { FloatingControls } from '@/components/ui/FloatingControls';

export function CanvasArea({
  canvasRef,
  onColorSelect,
  onBrushSelect,
  onInstrumentSelect,
  onSoundToggle,
  onVolumeChange,
  isGenerating,
  sonificationMode,
  currentColor,
  selectedBrush,
  brushSize,
  soundEnabled,
  volume,
  currentTime,
  visualZoom,
  duration,
  onTimeSeek,
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-5xl aspect-[4/3]">
        {/* Floating Status Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-6 right-6 z-30"
        >
          <CanvasStatusPanel
            width={1200}
            height={900}
            currentColor={currentColor}
            selectedBrush={selectedBrush}
            brushSize={brushSize}
            soundEnabled={soundEnabled}
            sonificationMode={sonificationMode}
          />
        </motion.div>

        {/* Sonification Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
        >
          <SonificationModePanel
            sonificationMode={sonificationMode}
            onSonificationModeChange={onColorSelect} // Using color select as mode change for now
            className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-full px-6 py-2 shadow-xl"
          />
        </motion.div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl border border-gray-300"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
              `,
              backgroundSize: '60px 60px',
            }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full bg-transparent"
            />
          </div>
        </div>

        {/* TimeScale - Only show for advanced modes */}
        {sonificationMode !== 'simple' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20"
          >
            <TimeScale
              sonificationMode={sonificationMode}
              duration={duration}
              currentTime={currentTime}
              visualZoom={visualZoom}
              onSeek={onTimeSeek}
              className="w-full max-w-5xl"
            />
          </motion.div>
        )}

        {/* Floating Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
        >
          <FloatingControls
            isGenerating={isGenerating}
            onGenerate={() => console.log('Generate soundscape')}
            onClearCanvas={() => console.log('Clear canvas')}
            onUndo={() => console.log('Undo')}
            onRedo={() => console.log('Redo')}
            onExport={(format) => console.log(`Export as ${format}`)}
          />
        </motion.div>
      </div>
    </div>
  );
}
