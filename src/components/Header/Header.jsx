import { Sparkles, Save, Volume2, VolumeX, LayoutDashboard, CreditCard, HelpCircle } from "lucide-react";

export function Header({
  user,
  isSaving,
  onSave,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-white/5 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
          <Sparkles size={18} className="text-white" />
        </div>
        <h1
          className="text-xl font-bold tracking-tight text-white"
          style={{ fontFamily: "Instrument Serif, serif" }}
        >
          Synesthetica
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onSave}
          disabled={isSaving || !user}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20"
        >
          <Save size={14} /> {isSaving ? "Saving..." : "Save Draft"}
        </button>

        <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 px-3">
          <Volume2 size={16} className="text-white/40" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
            className="w-20 accent-purple-500"
          />
          <button onClick={onToggleMute} className="ml-2 hover:text-purple-400">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Navigation Menu */}
        <div className="flex items-center gap-2">
          <a
            href="/dashboard"
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="Dashboard"
          >
            <LayoutDashboard size={18} />
          </a>
          <a
            href="/pricing"
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="Pricing"
          >
            <CreditCard size={18} />
          </a>
          <a
            href="/support"
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="Support"
          >
            <HelpCircle size={18} />
          </a>
        </div>

        {user ? (
          <a
            href="/account"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Account
          </a>
        ) : (
          <a
            href="/account/signin"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Sign In
          </a>
        )}
      </div>
    </header>
  );
}
