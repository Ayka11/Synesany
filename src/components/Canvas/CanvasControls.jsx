import { Download, Settings2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState } from "react";
import { UpgradeModal } from "@/components/UpgradeModal";

export function CanvasControls({ isGenerating, onGenerate }) {
  const { canSubmitDrawing, incrementDailySubmissions, dailySubmissions, dailyLimit, getExportOptions, userTier } = useSubscription();
  const [upgradeModal, setUpgradeModal] = useState({ isOpen: false, type: 'submission' });
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleGenerate = () => {
    if (!canSubmitDrawing()) {
      setUpgradeModal({ isOpen: true, type: 'submission' });
      return;
    }
    
    incrementDailySubmissions();
    onGenerate();
  };

  const handleExport = (format) => {
    if (!getExportOptions().includes(format)) {
      setUpgradeModal({ isOpen: true, type: 'export' });
      return;
    }
    
    // Export logic would go here
    console.log(`Exporting as ${format}`);
    setShowExportOptions(false);
  };

  const exportOptions = getExportOptions();

  return (
    <>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-3xl border border-white/10 bg-black/60 p-4 px-8 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !canSubmitDrawing()}
            className={`flex items-center gap-2 rounded-2xl px-8 py-4 font-bold transition-all ${
              isGenerating || !canSubmitDrawing()
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 active:scale-95"
            }`}
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                >
                  <Settings2 size={20} />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Download size={20} />
                {canSubmitDrawing() ? 'Generate Soundscape' : 'Limit Reached'}
              </>
            )}
          </button>

          {/* Submission Counter */}
          <div className="flex flex-col gap-1 px-4 border-l border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Daily Submissions
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">
                {dailySubmissions}/{dailyLimit === Infinity ? '∞' : dailyLimit}
              </span>
              {!canSubmitDrawing() && (
                <Lock className="w-3 h-3 text-yellow-400" />
              )}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="flex flex-col gap-1 px-4 border-l border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Export
          </span>
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white/80 transition-colors"
            >
              <Download size={14} />
              {exportOptions.length} formats
            </button>
            
            {showExportOptions && (
              <div className="absolute bottom-full mb-2 left-0 bg-black/90 border border-white/10 rounded-xl p-2 backdrop-blur-xl min-w-[120px]">
                {['mp3', 'wav', 'midi'].map((format) => {
                  const isAvailable = exportOptions.includes(format);
                  return (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      disabled={!isAvailable}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        isAvailable
                          ? 'text-white/80 hover:bg-white/10'
                          : 'text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {format.toUpperCase()}
                      {!isAvailable && <Lock className="w-3 h-3 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ isOpen: false, type: upgradeModal.type })}
        type={upgradeModal.type}
      />
    </>
  );
}
