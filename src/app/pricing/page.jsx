import { useState } from "react";
import useUser from "@/utils/useUser";
import { Check, Sparkles, Music, Waves, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useSubscription, SubscriptionProvider } from "@/contexts/SubscriptionContext";

function PricingPageContent() {
  const { data: user, refetch } = useUser();
  const { userTier, upgradeToPro, dailySubmissions, dailyLimit } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleUpgradeToPro = async () => {
    setLoading(true);
    try {
      // Use our context upgrade function
      upgradeToPro();
      toast.success("Welcome to Synesthetica Pro!");
      refetch();
    } catch (err) {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with synesthetic art",
      features: [
        "15 daily submissions",
        "All basic brushes",
        "Standard MP3 downloads",
        "Local-only storage",
      ],
      button: userTier === "free" ? "Current Plan" : "Get Started",
      current: userTier === "free",
      color: "bg-white/5",
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/mo",
      description: "Unlock your creative potential with premium features",
      features: [
        "Unlimited submissions",
        "All brush types (Star, Triangle, etc.)",
        "High-Fidelity WAV downloads",
        "MIDI Export",
        "1GB Cloud Gallery",
        "Priority support",
      ],
      button: userTier === "pro" ? "Current Plan" : "Upgrade to Pro",
      current: userTier === "pro",
      color: "bg-gradient-to-br from-purple-600/20 to-pink-600/20",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-purple-500/30">
      <header className="flex h-16 items-center border-b border-white/5 bg-white/5 px-8 backdrop-blur-xl">
        <a
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
          style={{ fontFamily: "Instrument Serif, serif" }}
        >
          <Sparkles className="text-purple-500" /> Synesthetica
        </a>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1
          className="mb-4 text-5xl font-bold text-white md:text-6xl"
          style={{ fontFamily: "Instrument Serif, serif" }}
        >
          Choose your <em className="italic">resonance</em>
        </h1>
        <p className="mb-16 text-lg text-white/40">
          Unlock the full potential of synesthetic creation.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-[40px] border border-white/10 p-10 text-left transition-all hover:border-white/20 ${tier.color}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 right-10 rounded-full bg-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-xl">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-white/40">{tier.period}</span>
                  )}
                </div>
                <p className="mt-4 text-white/60">{tier.description}</p>
              </div>

              <div className="mb-10 flex-1 space-y-4">
                {tier.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-white/80"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                      <Check size={12} className="text-white" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                disabled={tier.current || loading}
                onClick={tier.name === "Pro" ? handleUpgradeToPro : undefined}
                className={`w-full rounded-2xl py-4 font-bold transition-all active:scale-95 ${
                  tier.current
                    ? "bg-white/5 text-white/40 cursor-default"
                    : tier.name === "Pro"
                      ? "bg-white text-black hover:bg-white/90 shadow-xl shadow-purple-500/20"
                      : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {loading && tier.name === "Pro" ? "Upgrading..." : (tier.current ? "Current Plan" : tier.button)}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 text-left md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-purple-400">
              <Music size={24} />
            </div>
            <h4 className="text-lg font-bold text-white">Lossless Export</h4>
            <p className="text-sm leading-relaxed text-white/40">
              Pro users can export drawings as high-fidelity 44.1kHz WAV files
              for use in professional DAW software.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-blue-400">
              <Waves size={24} />
            </div>
            <h4 className="text-lg font-bold text-white">MIDI Timelines</h4>
            <p className="text-sm leading-relaxed text-white/40">
              Convert your visual compositions into MIDI note data, mapping
              colors to scales and velocities automatically.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-green-400">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-lg font-bold text-white">Private Storage</h4>
            <p className="text-sm leading-relaxed text-white/40">
              Keep your experiments to yourself with unlimited private cloud
              saves and version history for all your projects.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-20 text-center">
        <p className="text-sm text-white/20">
          © 2026 Synesthetica. Master your senses.
        </p>
      </footer>
    </div>
  );
}

export default function PricingPage() {
  return (
    <SubscriptionProvider>
      <PricingPageContent />
    </SubscriptionProvider>
  );
}
