import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Calendar, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import GlassCard from "@/components/GlassCard";
import ContactForm from "@/components/ContactForm";
import { PrimaryCTA, GhostCTA } from "@/components/CTAButton";
import { toast } from "sonner";

const offices = [
  { city: "Toronto", country: "Canadá", coords: "43.65°N / 79.38°W" },
  { city: "Monterrey", country: "México", coords: "25.67°N / 100.31°W" },
  { city: "Ciudad de México", country: "México", coords: "19.43°N / 99.13°W" },
];

function CopyField({ value, label, testid }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <button
      onClick={onCopy}
      className="group glass rounded-2xl p-6 w-full text-left flex items-center gap-4 hover:border-[#C0392B]/40 transition-all duration-500"
      data-testid={testid}
    >
      <div className="w-12 h-12 rounded-xl bg-[#C0392B]/10 grid place-items-center text-[#C0392B] group-hover:bg-[#C0392B] group-hover:text-white transition-all">
        {label === "Email" ? <Mail size={18} /> : <Phone size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">{label}</div>
        <div className="text-white text-base md:text-lg font-medium truncate">{value}</div>
      </div>
      <div className="text-zinc-500 group-hover:text-[#C0392B] transition-colors">
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </div>
    </button>
  );
}

export default function Contact() {
  const { t } = useTranslation();
  return (
    <PageShell testid="contact-page">
      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden" data-testid="contact-hero">
        <NeuralNetwork className="opacity-40" />
        <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(192,57,43,0.22), transparent 60%)" }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-24 pb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
              <span className="w-10 h-px bg-[#C0392B]" />
              {t("contact.overline")}
            </div>
            <h1 className="font-display text-[clamp(2.8rem,8vw,8rem)] leading-[0.9]" data-testid="contact-headline">
              <span className="text-[#C0392B] text-glow-red">{t("contact.title")}</span>
            </h1>
            <p className="mt-8 text-zinc-300 text-lg md:text-xl max-w-2xl leading-relaxed">
              {t("contact.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryCTA href="https://calendly.com/viridiana-flores-audioweb/30min" external testid="contact-calendly-cta">
                <Calendar size={14} /> Book a Call
              </PrimaryCTA>
              <GhostCTA href="https://wa.me/15797986707?text=Como%20funciona%20Rolplay?" external testid="contact-whatsapp-cta">
                Chat on WhatsApp
              </GhostCTA>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO + FORM */}
      <section className="relative py-24 border-t border-white/5" data-testid="contact-main-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <div className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase mb-2">// DIRECT LINES</div>
            <CopyField label="Email" value="info@rolplay.ai" testid="contact-email-copy" />
            <CopyField label="Phone" value="+52 (55) 5093 7376" testid="contact-phone-copy" />

            <div className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase mt-8 mb-3">// SOCIAL</div>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61582917112897" target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl glass grid place-items-center hover:border-[#C0392B]/40 hover:text-[#C0392B] transition-all" data-testid="contact-facebook">
                <Facebook size={16} />
              </a>
              <a href="https://www.linkedin.com/company/rolplaymx/posts/?feedView=all" target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl glass grid place-items-center hover:border-[#C0392B]/40 hover:text-[#C0392B] transition-all" data-testid="contact-linkedin">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <GlassCard tilt={false} className="p-8 md:p-10">
              <div className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase mb-2">// SEND US A MESSAGE</div>
              <h3 className="font-display text-3xl md:text-4xl mb-6">Tell us about your team.</h3>
              <ContactForm variant="full" />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="relative py-24 border-t border-white/5 overflow-hidden" data-testid="contact-offices-section">
        <NeuralNetwork className="opacity-25" density={0.00007} />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
            <span className="w-10 h-px bg-[#C0392B]" />
            OFFICES
          </div>
          <h2 className="font-display text-3xl md:text-5xl leading-[1.05] max-w-3xl">
            Three cities. <span className="text-[#C0392B]">One team.</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {offices.map((o, i) => (
              <motion.div
                key={o.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                data-testid={`office-card-${o.city.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <GlassCard className="p-7 h-full">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="relative w-3 h-3">
                      <span className="absolute inset-0 rounded-full bg-[#C0392B]" style={{ animation: "pulse-red 2s ease-in-out infinite" }} />
                      <span className="relative block w-3 h-3 rounded-full bg-[#C0392B] shadow-[0_0_10px_rgba(192,57,43,0.8)]" />
                    </div>
                    <MapPin size={14} className="text-[#C0392B]" />
                  </div>
                  <div className="font-display text-2xl md:text-3xl">
                    <span className="text-[#C0392B]">{o.city}</span>
                  </div>
                  <div className="text-zinc-400 mt-1">{o.country}</div>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-600 mt-5">{o.coords}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
