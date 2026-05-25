import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ContactForm({ variant = "compact" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("Message sent · We'll be in touch shortly", {
      description: "info@rolplay.ai",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  if (variant === "compact") {
    return (
      <form
        onSubmit={submit}
        className="glass rounded-full p-1.5 flex items-center gap-2 max-w-xl"
        data-testid="contact-form-compact"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Your name"
          className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          data-testid="contact-name-input"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-medium px-6 py-3 flex items-center gap-2 shadow-[0_0_24px_rgba(192,57,43,0.4)] transition-all"
          data-testid="contact-submit-btn"
        >
          {loading ? "Sending…" : "Send"} <ArrowRight size={14} />
        </motion.button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 w-full" data-testid="contact-form-full">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="mt-2 w-full bg-transparent border-b border-white/10 focus:border-[#C0392B] py-3 text-base text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
            data-testid="contact-full-name-input"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-2 w-full bg-transparent border-b border-white/10 focus:border-[#C0392B] py-3 text-base text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
            data-testid="contact-full-email-input"
          />
        </div>
      </div>
      <div>
        <label className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Question</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Tell us about your team's training goals…"
          className="mt-2 w-full bg-transparent border-b border-white/10 focus:border-[#C0392B] py-3 text-base text-white placeholder:text-zinc-600 focus:outline-none resize-none transition-colors"
          data-testid="contact-full-message-input"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-semibold px-8 py-4 flex items-center gap-2 shadow-[0_0_30px_rgba(192,57,43,0.5)]"
        data-testid="contact-full-submit-btn"
      >
        {loading ? "Sending…" : "Send"} <ArrowRight size={14} />
      </motion.button>
    </form>
  );
}
