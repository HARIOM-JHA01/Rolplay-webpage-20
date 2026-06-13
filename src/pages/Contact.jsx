import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Calendar, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import ContactForm from "@/components/ContactForm";
import { PrimaryCTA } from "@/components/CTAButton";
import { toast } from "sonner";

const offices = [
  { city: "Toronto",        country: "Canada",  coords: "43.65°N / 79.38°W" },
  { city: "Monterrey",      country: "México",  coords: "25.67°N / 100.31°W" },
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
      className="group w-full text-left flex items-center gap-4 bg-[#111115] border border-white/[0.06] hover:border-[#C0392B]/40 rounded-2xl p-5 transition-all duration-300 hover:bg-[#16161C]"
      data-testid={testid}
    >
      <div className="w-11 h-11 rounded-xl bg-[#C0392B]/10 grid place-items-center text-[#C0392B] group-hover:bg-[#C0392B] group-hover:text-white transition-all duration-300 flex-shrink-0">
        {label === "Email" ? <Mail size={17} /> : <Phone size={17} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] tracking-[0.25em] text-[#52525B] uppercase mb-0.5">{label}</div>
        <div className="text-white text-sm font-medium truncate">{value}</div>
      </div>
      <div className="text-[#52525B] group-hover:text-[#C0392B] transition-colors flex-shrink-0">
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </div>
    </button>
  );
}

function SocialLink({ href, icon: Icon, label, testid }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-testid={testid}
      className="w-11 h-11 rounded-xl bg-[#111115] border border-white/[0.06] grid place-items-center text-[#71717A] hover:border-[#C0392B]/40 hover:text-[#C0392B] hover:bg-[#16161C] transition-all duration-300"
    >
      <Icon size={16} />
    </a>
  );
}

export default function Contact() {
  const { t } = useTranslation();

  return (
    <PageShell testid="contact-page">

      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-[#050508]" data-testid="contact-hero">
        <NeuralNetwork className="opacity-40" />
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(192,57,43,0.18), transparent 60%)" }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
              <span className="w-10 h-px bg-[#C0392B]" />
              {t("contact.overline")}
            </div>
            <h1 className="font-display text-[clamp(2.8rem,8vw,8rem)] leading-[0.9] text-[#C0392B] text-glow-red" data-testid="contact-headline">
              {t("contact.title")}
            </h1>
            <p className="mt-8 text-[#A1A1AA] text-lg md:text-xl max-w-2xl leading-relaxed">
              {t("contact.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryCTA href="https://calendly.com/viridiana-flores-audioweb/30min" external testid="contact-calendly-cta">
                <Calendar size={14} /> {t("contact.bookCall")}
              </PrimaryCTA>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT INFO + FORM ── */}
      <section className="relative bg-[#070709]" data-testid="contact-main-section">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(192,57,43,0.06), transparent 55%)" }} />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left — contact details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-2">
                <span className="w-6 h-px bg-[#C0392B]" />
                {t("contact.directLines")}
              </p>
              <div className="space-y-3">
                <CopyField label="Email" value="info@rolplay.ai" testid="contact-email-copy" />
                <CopyField label="Phone" value="+52 55 1800 6006" testid="contact-phone-copy" />
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#C0392B] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-[#C0392B]" />
                {t("contact.social")}
              </p>
              <div className="flex items-center gap-3">
                <SocialLink
                  href="https://www.facebook.com/profile.php?id=61582917112897"
                  icon={Facebook} label="Facebook" testid="contact-facebook"
                />
                <SocialLink
                  href="https://www.linkedin.com/company/rolplaymx/posts/?feedView=all"
                  icon={Linkedin} label="LinkedIn" testid="contact-linkedin"
                />
              </div>
            </div>

            {/* Decorative divider stat */}
            <div className="pt-6 border-t border-white/[0.05]">
              <p className="font-mono text-[10px] tracking-[0.25em] text-[#52525B] uppercase mb-4">
                {t("contact.sendMessage")}
              </p>
              <p className="text-[#71717A] text-sm leading-relaxed">
                {t("contact.tellUsTitle")}
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0D0D12] border border-white/[0.06] rounded-3xl p-8 md:p-10">
              <ContactForm variant="full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFICES ── */}
      <section className="relative bg-[#050508] border-t border-white/[0.04] overflow-hidden" data-testid="contact-offices-section">
        <NeuralNetwork className="opacity-20" density={0.00007} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(192,57,43,0.08), transparent 60%)" }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-24">
          <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
            <span className="w-10 h-px bg-[#C0392B]" />
            {t("contact.offices")}
          </div>
          <h2 className="font-display text-3xl md:text-5xl leading-[1.05] max-w-3xl text-white">
            {t("contact.threeCities")}{" "}
            <span className="text-[#C0392B]">{t("contact.oneTeam")}</span>
          </h2>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {offices.map((o, i) => (
              <motion.div
                key={o.city}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                data-testid={`office-card-${o.city.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="group relative bg-[#0D0D12] border border-white/[0.06] rounded-2xl p-7 h-full hover:border-[#C0392B]/30 hover:bg-[#111115] transition-all duration-300">
                  {/* subtle red glow on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(192,57,43,0.07), transparent 70%)" }} />

                  <div className="relative flex items-center gap-2 mb-6">
                    <div className="relative w-2.5 h-2.5">
                      <span className="absolute inset-0 rounded-full bg-[#C0392B] opacity-60" style={{ animation: "pulse-red 2s ease-in-out infinite" }} />
                      <span className="relative block w-2.5 h-2.5 rounded-full bg-[#C0392B]" />
                    </div>
                    <MapPin size={13} className="text-[#C0392B]" />
                  </div>
                  <div className="relative font-display text-2xl md:text-3xl text-white mb-1">
                    <span className="text-[#C0392B]">{o.city}</span>
                  </div>
                  <div className="relative text-[#71717A] text-sm mb-6">{o.country}</div>
                  <div className="relative font-mono text-[10px] tracking-[0.2em] text-[#3F3F46] pt-4 border-t border-white/[0.04]">
                    {o.coords}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </PageShell>
  );
}
