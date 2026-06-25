import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import NeuralNetwork from "@/components/NeuralNetwork";
import SectionHeader from "@/components/SectionHeader";

const API_URL = process.env.REACT_APP_API_URL || "";

export default function SubscribeForm() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | duplicate | error
  const [error, setError] = useState("");

  const validate = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(email)) {
      setError(t("subscribe.emailInvalid"));
      return;
    }
    setError("");
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          locale: i18n.language?.split("-")[0] || "en",
          source: "homepage",
        }),
      });
      if (res.status === 409) {
        setStatus("duplicate");
        setError(t("subscribe.alreadySubscribed"));
        return;
      }
      if (!res.ok) throw new Error("subscribe_failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError(t("subscribe.error"));
    }
  };

  return (
    <section className="relative py-32 overflow-hidden border-y border-white/5" data-testid="subscribe-section">
      <NeuralNetwork className="opacity-20" density={0.00006} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(192,57,43,0.18), transparent 55%)",
        }}
      />

      <div className="relative max-w-[800px] mx-auto px-6 lg:px-10 text-center">
        <SectionHeader
          overline={t("subscribe.overline")}
          title={t("subscribe.title", { highlight: t("subscribe.highlight") })}
          redWord={t("subscribe.highlight")}
          body={t("subscribe.body")}
          align="center"
        />

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-10 flex flex-col items-center gap-3"
            >
              <CheckCircle size={40} className="text-[#C0392B]" strokeWidth={1.5} />
              <p className="text-white font-display text-2xl">{t("subscribe.success")}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto"
              noValidate
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("subscribe.placeholder")}
                  aria-label="Email address"
                  disabled={status === "loading"}
                  className={`w-full h-12 px-4 rounded-xl bg-white/5 border text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#C0392B]/60 transition-colors ${
                    error ? "border-red-500/60" : "border-white/10"
                  }`}
                />
                {error && (
                  <p className="absolute -bottom-5 left-0 text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle size={10} /> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="h-12 px-6 rounded-xl bg-[#C0392B] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#E74C3C] transition-colors disabled:opacity-60 whitespace-nowrap shadow-[0_0_20px_rgba(192,57,43,0.4)]"
              >
                {status === "loading" ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <>
                    {t("subscribe.cta")}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-8 font-mono text-[10px] tracking-[0.2em] text-zinc-600 uppercase">
          {t("subscribe.privacy")}
        </p>
      </div>
    </section>
  );
}
