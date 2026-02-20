import { X, Zap, Lock, Music, Download, Cloud, Star } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

export function UpgradeModal({ isOpen, onClose, type = 'submission' }) {
  const { upgradeToPro, dailySubmissions, dailyLimit } = useSubscription();

  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case 'submission':
        return {
          title: 'Daily Submission Limit Reached',
          description: `You've used ${dailySubmissions} of ${dailyLimit === Infinity ? 'unlimited' : dailyLimit} submissions today.`,
          message: 'Upgrade to Pro for unlimited submissions and unlock your creative potential!'
        };
      case 'brush':
        return {
          title: 'Pro Brush Locked',
          description: 'This brush is available for Pro users only.',
          message: 'Unlock all brush types including Star, Triangle, Cross, Sawtooth, and Spray brushes.'
        };
      case 'export':
        return {
          title: 'Premium Export Feature',
          description: 'High-fidelity WAV and MIDI export are Pro features.',
          message: 'Get professional-quality audio exports with WAV and MIDI formats.'
        };
      default:
        return {
          title: 'Upgrade to Pro',
          description: 'Unlock premium features',
          message: 'Get unlimited submissions, all brushes, and premium export options.'
        };
    }
  };

  const { title, description, message } = getModalContent();

  const proFeatures = [
    { icon: Zap, text: 'Unlimited submissions' },
    { icon: Music, text: 'All brush types' },
    { icon: Download, text: 'WAV & MIDI export' },
    { icon: Cloud, text: '1GB Cloud storage' },
  ];

  const handleUpgrade = () => {
    upgradeToPro();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-[#0a0a0c] via-[#111115] to-[#0a0a0c] border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-600/20 rounded-full blur-2xl" />
        
        <div className="relative p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-gray-300 mb-4">{description}</p>
            <p className="text-gray-400 text-sm">{message}</p>
          </div>

          {/* Pro Features */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">Pro Features</span>
            </div>
            <div className="space-y-3">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <feature.icon className="w-2.5 h-2.5 text-green-400" />
                  </div>
                  <span className="text-gray-200 text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                $9.99
              </span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-gray-500 text-sm">Cancel anytime</p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/40"
            >
              Upgrade to Pro
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors border border-white/20"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              🔒 Secure payment • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
