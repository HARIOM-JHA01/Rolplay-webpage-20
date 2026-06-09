import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ── Field component — reusable styled input / textarea ─────── */
function Field({ id, label, error, children }) {
  return (
    <div className="group/field flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase transition-colors group-focus-within/field:text-[#C0392B]"
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-[11px] text-red-400 font-mono"
          >
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white " +
  "placeholder:text-zinc-600 focus:outline-none focus:border-[#C0392B]/60 focus:bg-white/6 " +
  "focus:shadow-[0_0_0_3px_rgba(192,57,43,0.12)] transition-all duration-200 " +
  "autofill:bg-transparent";

/* ── Validation helpers ───────────────────────────────────────── */
function validate(fields) {
  const errs = {};
  if (!fields.name.trim())             errs.name    = "Name is required";
  if (!fields.email.trim())            errs.email   = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
                                       errs.email   = "Enter a valid email";
  if (!fields.message.trim())          errs.message = "Please tell us about your team";
  return errs;
}

/* ── Main export ─────────────────────────────────────────────── */
export default function ContactForm({ variant = "compact" }) {
  const { t } = useTranslation();

  const [fields, setFields] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [touched, setTouched] = useState({});

  const set = (k) => (e) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (touched[k]) {
      const errs = validate({ ...fields, [k]: e.target.value });
      setErrors((prev) => ({ ...prev, [k]: errs[k] }));
    }
  };

  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    const errs = validate(fields);
    setErrors((prev) => ({ ...prev, [k]: errs[k] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus("loading");
    try {
      // Simulated submission — replace with HubSpot API call when portal is configured
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setFields({ name: "", email: "", company: "", message: "" });
      setTouched({});
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  /* ── Compact (hero bar) variant ───────────────────────────── */
  if (variant === "compact") {
    return (
      <form
        onSubmit={submit}
        className="glass rounded-full p-1.5 flex items-center gap-2 max-w-xl"
        data-testid="contact-form-compact"
      >
        <input
          id="compact-name"
          type="text"
          value={fields.name}
          onChange={set("name")}
          placeholder="Your name"
          aria-label="Your name"
          className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          data-testid="contact-name-input"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-medium px-6 py-3 flex items-center gap-2 shadow-[0_0_24px_rgba(192,57,43,0.4)] transition-all disabled:opacity-60"
          data-testid="contact-submit-btn"
        >
          {status === "loading"
            ? <><Loader2 size={14} className="animate-spin" /> {t("contact.sending")}</>
            : <>{t("contact.send")} <ArrowRight size={14} /></>}
        </motion.button>
      </form>
    );
  }

  /* ── Full variant ─────────────────────────────────────────── */
  return (
    <form onSubmit={submit} className="space-y-5 w-full" data-testid="contact-form-full" noValidate>

      {/* Success state */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex items-start gap-4 p-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/8"
            role="alert"
            aria-live="polite"
          >
            <CheckCircle2 size={22} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">Message sent!</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                We'll get back to you at <span className="text-white">{fields.email || "your inbox"}</span> within 24 hours.
              </p>
            </div>
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex items-center gap-3 p-4 rounded-2xl border border-red-500/25 bg-red-500/8"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">Something went wrong. Please try again or email us directly.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-5">
        <Field id="full-name" label="Full name *" error={errors.name}>
          <input
            id="full-name"
            type="text"
            value={fields.name}
            onChange={set("name")}
            onBlur={blur("name")}
            placeholder="Jane Smith"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "full-name-err" : undefined}
            className={`${inputClass} ${errors.name ? "border-red-500/50 focus:border-red-500/70 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : ""}`}
            data-testid="contact-full-name-input"
          />
        </Field>

        <Field id="full-email" label="Work email *" error={errors.email}>
          <input
            id="full-email"
            type="email"
            value={fields.email}
            onChange={set("email")}
            onBlur={blur("email")}
            placeholder="jane@company.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            className={`${inputClass} ${errors.email ? "border-red-500/50 focus:border-red-500/70 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : ""}`}
            data-testid="contact-full-email-input"
          />
        </Field>
      </div>

      <Field id="company-name" label="Company">
        <input
          id="company-name"
          type="text"
          value={fields.company}
          onChange={set("company")}
          placeholder="Acme Corp (optional)"
          className={inputClass}
          data-testid="contact-full-company-input"
        />
      </Field>

      <Field id="message" label="How can we help? *" error={errors.message}>
        <textarea
          id="message"
          value={fields.message}
          onChange={set("message")}
          onBlur={blur("message")}
          rows={5}
          placeholder="Tell us about your team's training goals, size, and what you're looking to achieve…"
          aria-required="true"
          aria-invalid={!!errors.message}
          className={`${inputClass} resize-none leading-relaxed ${errors.message ? "border-red-500/50 focus:border-red-500/70" : ""}`}
          data-testid="contact-full-message-input"
        />
      </Field>

      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-[11px] text-zinc-600 font-mono">
          * Required fields
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-[#C0392B] hover:bg-[#E74C3C] text-white text-sm font-semibold px-8 py-3.5 flex items-center gap-2.5 shadow-[0_0_30px_rgba(192,57,43,0.45)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          data-testid="contact-full-submit-btn"
        >
          {status === "loading"
            ? <><Loader2 size={15} className="animate-spin" /> {t("contact.sending")}</>
            : <>{t("contact.send")} <ArrowRight size={15} /></>}
        </motion.button>
      </div>
    </form>
  );
}
