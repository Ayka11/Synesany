import { useState } from "react";
import useUser from "@/utils/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MessageSquare,
  Send,
  ChevronLeft,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function SupportPage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const { data: tickets = [] } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const res = await fetch("/api/tickets");
      return res.json();
    },
  });

  const createTicket = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify({ subject, initialMessage: message }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Ticket created!");
      setSubject("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="flex h-screen bg-[#0a0a0c]">
      {/* SIDEBAR */}
      <div className="w-80 border-r border-white/5 bg-white/5 p-6 overflow-y-auto">
        <div
          className="mb-8 flex items-center gap-2 text-xl font-bold text-white"
          style={{ fontFamily: "Instrument Serif, serif" }}
        >
          <Sparkles className="text-purple-500" /> Support
        </div>

        <button
          onClick={() => setSelectedTicketId(null)}
          className="mb-6 w-full rounded-xl bg-purple-600 p-3 text-sm font-bold text-white hover:bg-purple-500 transition-all"
        >
          New Ticket
        </button>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2">
            History
          </label>
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`w-full rounded-xl p-4 text-left transition-all ${
                selectedTicketId === ticket.id
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="font-medium text-white line-clamp-1">
                {ticket.subject}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-white/40">
                <Clock size={10} />{" "}
                {new Date(ticket.created_at).toLocaleDateString()}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-bold uppercase ${
                    ticket.status === "open"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <main className="flex flex-1 flex-col relative">
        <header className="flex h-16 items-center border-b border-white/5 bg-white/5 px-8">
          <a href="/" className="mr-4 text-white/40 hover:text-white">
            <ChevronLeft size={24} />
          </a>
          <h2 className="text-lg font-bold text-white">
            {selectedTicket ? selectedTicket.subject : "Contact Support"}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {selectedTicket ? (
            <div className="mx-auto max-w-2xl space-y-6">
              {selectedTicket.messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-4 ${
                      m.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    <div className="text-sm">{m.text}</div>
                    <div className="mt-2 text-[10px] opacity-40">
                      {new Date(m.date).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 text-center">
                <CheckCircle2
                  size={32}
                  className="mx-auto mb-3 text-white/20"
                />
                <p className="text-sm text-white/40">
                  Our team usually responds within 2-4 hours.
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-lg space-y-8 py-20">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-600/20 text-purple-500">
                  <MessageSquare size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  How can we help?
                </h3>
                <p className="mt-2 text-white/40">
                  Describe your issue or request and we'll get back to you soon.
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-purple-500 transition-all"
                />
                <textarea
                  placeholder="Your message..."
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-purple-500 transition-all"
                />
                <button
                  disabled={createTicket.isLoading || !subject || !message}
                  onClick={() => createTicket.mutate()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-bold text-black hover:bg-white/90 active:scale-95 transition-all disabled:opacity-20"
                >
                  <Send size={18} /> Send Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
