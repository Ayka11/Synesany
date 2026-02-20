import { BRUSHES } from "@/constants/brushes";
import { Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState } from "react";
import { UpgradeModal } from "@/components/UpgradeModal";

export function BrushSelector({ brushType, onBrushTypeChange }) {
  const { canUseBrush, proBrushes } = useSubscription();
  const [upgradeModal, setUpgradeModal] = useState({ isOpen: false, type: 'brush' });

  const handleBrushClick = (key) => {
    if (canUseBrush(key)) {
      onBrushTypeChange(key);
    } else {
      setUpgradeModal({ isOpen: true, type: 'brush' });
    }
  };

  const isProBrush = (key) => proBrushes.includes(key);

  return (
    <>
      <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-2xl shadow-2xl">
        {Object.entries(BRUSHES).map(([key, { icon: Icon, label }]) => {
          const isLocked = !canUseBrush(key);
          const isPro = isProBrush(key);
          
          return (
            <div key={key} className="relative">
              <button
                onClick={() => handleBrushClick(key)}
                disabled={isLocked}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all relative ${
                  brushType === key
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40"
                    : isLocked
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
                title={isLocked ? `${label} (Pro only)` : label}
              >
                <Icon size={20} />
                {isPro && (
                  <div className="absolute -top-1 -right-1">
                    <Lock className="w-3 h-3 text-yellow-400" />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ isOpen: false, type: 'brush' })}
        type={upgradeModal.type}
      />
    </>
  );
}
