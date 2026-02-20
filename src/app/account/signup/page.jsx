import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Sparkles, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c] p-6 selection:bg-purple-500/30">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-600/20">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "Instrument Serif, serif" }}
          >
            Get Started
          </h1>
          <p className="mt-2 text-white/40">
            Join a community of artists and sound designers.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">
              Email Address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <div className="text-sm font-medium text-red-400">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 font-bold text-white hover:scale-[1.02] active:scale-95 transition-all"
          >
            {loading ? (
              "Creating account..."
            ) : (
              <>
                Create Account{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/40">
          Already have an account?{" "}
          <a
            href="/account/signin"
            className="font-bold text-white hover:text-purple-400 transition-colors"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
