import { useQuery } from "@tanstack/react-query";
import useUser from "@/utils/useUser";
import {
  Sparkles,
  Grid,
  Clock,
  Play,
  Download,
  Trash2,
  Plus,
  ChevronLeft,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { useSubscription, SubscriptionProvider } from "@/contexts/SubscriptionContext";

function DashboardPageContent() {
  const { data: user } = useUser();
  const { userTier } = useSubscription();
  const [activeView, setActiveView] = useState("experiments"); // 'experiments' or 'upload'
  const [deletingId, setDeletingId] = useState(null);
  const {
    data: drawings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["drawings"],
    queryFn: async () => {
      const res = await fetch("/api/drawings");
      return res.json();
    },
  });

  const handleDelete = async (drawing) => {
    if (!confirm(`Delete "${drawing.title}"? This cannot be undone.`)) return;
    setDeletingId(drawing.id);
    try {
      const res = await fetch(`/api/drawings/${drawing.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Drawing deleted");
      refetch();
    } catch {
      toast.error("Could not delete drawing");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0c] text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-purple-500/30">
      <header className="flex h-16 items-center border-b border-white/5 bg-white/5 px-8 backdrop-blur-xl">
        <a
          href="/"
          className="mr-6 text-white/40 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </a>
        <div
          className="flex items-center gap-2 text-xl font-bold text-white"
          style={{ fontFamily: "Instrument Serif, serif" }}
        >
          <Sparkles className="text-purple-500" /> Dashboard
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-12">
        {/* View Toggle Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setActiveView("experiments")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === "experiments"
                  ? "bg-purple-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Grid size={16} />
              My Experiments
            </button>
            <button
              onClick={() => setActiveView("upload")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === "upload"
                  ? "bg-indigo-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <ImageIcon size={16} />
              Upload & Sonify
            </button>
          </div>
        </div>

        {/* Experiments View */}
        {activeView === "experiments" && (
          <>
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h1
                  className="text-4xl font-bold text-white"
                  style={{ fontFamily: "Instrument Serif, serif" }}
                >
                  My <em className="italic">Experiments</em>
                </h1>
                <p className="mt-2 text-white/40">
                  You have created {drawings.length} soundscapes.
                </p>
              </div>
              <a
                href="/"
                className="flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 font-bold text-white hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
              >
                <Plus size={20} /> New Drawing
              </a>
            </div>

            {drawings.length === 0 ? (
              <div className="rounded-[40px] border border-dashed border-white/10 py-32 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-white/20">
                  <Grid size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white">No drawings yet</h2>
                <p className="mt-2 text-white/40">
                  Your visual compositions will appear here.
                </p>
                <a
                  href="/"
                  className="mt-8 inline-block font-bold text-purple-400 hover:text-purple-300"
                >
                  Start your first composition →
                </a>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {drawings.map((drawing) => (
                  <div
                    key={drawing.id}
                    className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-black">
                      <img
                        src={drawing.image_url}
                        alt={drawing.title}
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <div className="mt-4">
                      <h3 className="font-bold text-white">{drawing.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                        <Clock size={12} />{" "}
                        {new Date(drawing.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                      <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                        <Play size={20} />
                      </button>
                      <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all">
                        <Download size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(drawing)}
                        disabled={deletingId === drawing.id}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/80 text-white hover:bg-red-500 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Upload & Sonify View */}
        {activeView === "upload" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 text-right text-sm text-white/30">
              {userTier === "pro" ? (
                <span className="text-purple-400">Pro Account</span>
              ) : (
                <span>Free Account • Limited uploads per day</span>
              )}
            </div>

            <ImageUpload
              onGenerateSound={(audioData) => {
                console.log("Generated audio:", audioData);
                toast.success("Audio generated successfully!");
              }}
              brushType="sine"
              sonificationMode="timeline"
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SubscriptionProvider>
      <DashboardPageContent />
    </SubscriptionProvider>
  );
}
