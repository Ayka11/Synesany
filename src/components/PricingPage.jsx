import { useState } from 'react';
import { Check, Lock, Zap, Cloud, Download, Music } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function PricingPage() {
  const { userTier, upgradeToPro } = useSubscription();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      tier: 'free',
      description: 'Perfect for getting started with synesthetic art',
      features: [
        { text: '15 daily submissions', included: true },
        { text: 'All basic brushes', included: true },
        { text: 'Standard MP3 downloads', included: true },
        { text: 'Local-only storage', included: true },
        { text: 'Star brush', included: false, icon: Lock },
        { text: 'Triangle brush', included: false, icon: Lock },
        { text: 'Cross brush', included: false, icon: Lock },
        { text: 'Sawtooth brush', included: false, icon: Lock },
        { text: 'High-Fidelity WAV downloads', included: false, icon: Lock },
        { text: 'MIDI Export', included: false, icon: Lock },
        { text: '1GB Cloud Gallery', included: false, icon: Lock },
      ],
      cta: userTier === 'free' ? 'Current Plan' : 'Get Started',
      ctaAction: () => {},
      popular: false
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? '$9.99' : '$99.90',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      tier: 'pro',
      description: 'Unlock your creative potential with premium features',
      features: [
        { text: 'Unlimited submissions', included: true, icon: Zap },
        { text: 'All brush types', included: true, icon: Music },
        { text: 'High-Fidelity WAV downloads', included: true, icon: Download },
        { text: 'MIDI Export', included: true, icon: Download },
        { text: '1GB Cloud Gallery', included: true, icon: Cloud },
        { text: 'Priority support', included: true },
        { text: 'Early access to new features', included: true },
      ],
      cta: userTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      ctaAction: userTier === 'pro' ? () => {} : upgradeToPro,
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#111115] to-[#0a0a0c] text-white">
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Choose Your Creative Journey
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock the full potential of synesthetic art creation with our premium features
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly (Save 17%)
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-3xl border backdrop-blur-2xl transition-all hover:scale-105 ${
                  plan.popular
                    ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20 shadow-2xl shadow-purple-600/20'
                    : 'border-white/10 bg-black/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-400">{plan.period}</span>
                    </div>
                    <p className="text-gray-300">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included ? 'bg-green-500/20' : 'bg-gray-600/20'
                        }`}>
                          {feature.included ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            feature.icon && <feature.icon className="w-3 h-3 text-gray-500" />
                          )}
                        </div>
                        <span className={`${
                          feature.included ? 'text-gray-200' : 'text-gray-500'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={plan.ctaAction}
                    disabled={plan.cta === 'Current Plan'}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                      plan.cta === 'Current Plan'
                        ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-600/40'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-3">Can I change my plan anytime?</h3>
                <p className="text-gray-300">
                  Yes! You can upgrade to Pro at any time. Downgrades will take effect at the next billing cycle.
                </p>
              </div>
              
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-3">What happens to my drawings if I downgrade?</h3>
                <p className="text-gray-300">
                  Your drawings are always safe. Free users keep all their work, but Pro features like cloud storage and advanced brushes will be locked until you upgrade again.
                </p>
              </div>
              
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-3">Is there a free trial for Pro?</h3>
                <p className="text-gray-300">
                  Yes! New users get a 7-day free trial of all Pro features. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
