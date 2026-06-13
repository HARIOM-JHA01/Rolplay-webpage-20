import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Mail } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || '';

export default function NewsletterForm({ source = "blog", className = "" }) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | duplicate | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await axios.post(`${API_URL}/api/subscribe`, {
        email: email.trim().toLowerCase(),
        locale: i18n.language?.split('-')[0] || 'en',
        source,
      });
      setStatus("success");
    } catch (err) {
      if (err.response?.status === 409) {
        setStatus("duplicate");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    }
  };

  if (status === "success") {
    return (
      <div className={`flex items-center gap-3 ${className}`} data-testid="newsletter-success">
        <div className="w-8 h-8 rounded-full bg-[#C0392B]/20 flex items-center justify-center flex-shrink-0">
          <Mail size={14} className="text-[#C0392B]" />
        </div>
        <p className="text-sm text-[#A1A1AA]">{t("blog.subscribedSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`relative flex gap-2 ${className}`} data-testid="newsletter-form">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("blog.subscribePlaceholder")}
        disabled={status === "loading"}
        className="flex-1 min-w-0 bg-[#111115] border border-white/[0.08] rounded-full px-4 py-2.5 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#C0392B]/50 disabled:opacity-50 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#C0392B] text-white hover:bg-[#E74C3C] disabled:opacity-50 transition-colors flex-shrink-0"
      >
        {status === "loading" ? "…" : t("blog.subscribeCta")}
      </button>
      {(status === "duplicate" || status === "error") && (
        <p className="absolute -bottom-5 left-0 text-xs text-[#C0392B]">
          {status === "duplicate" ? t("blog.alreadySubscribed") : t("blog.subscribeError")}
        </p>
      )}
    </form>
  );
}
