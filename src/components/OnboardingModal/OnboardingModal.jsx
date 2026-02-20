import { Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function OnboardingModal({ show, onDismiss }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-md rounded-[32px] border border-white/10 bg-gradient-to-b from-[#1a1a1e] to-[#0a0a0c] p-8 shadow-2xl shadow-purple-500/10"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-600 shadow-xl shadow-purple-600/30">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2
              className="mb-2 text-3xl font-bold text-white"
              style={{ fontFamily: "Instrument Serif, serif" }}
            >
              Welcome to Synesthetica
            </h2>
            <p className="mb-8 text-white/60 leading-relaxed">
              Experience the sound of color. Every stroke you draw produces a
              unique audio tone. When you're finished, generate a complete
              soundscape from your artwork.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Draw using different brushes for unique waveforms",
                "Change colors to shift the harmonic landscape",
                "Canvas position maps to frequency and panning",
                "Export your art as high-quality WAV or MIDI files",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <div className="h-5 w-5 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <ChevronRight size={12} className="text-purple-400" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
            <button
              onClick={onDismiss}
              className="w-full rounded-2xl bg-white py-4 font-bold text-black hover:bg-white/90 transition-all active:scale-95"
            >
              Start Creating
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
