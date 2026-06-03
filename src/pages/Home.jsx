import { motion } from "framer-motion";
import { Award, Sparkles, Zap, ShieldCheck, Globe, BarChart3, Mail, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import AnimatedCounter from "@/components/AnimatedCounter";
import GlassCard from "@/components/GlassCard";
import { PrimaryCTA, GhostCTA } from "@/components/CTAButton";
import SectionHeader from "@/components/SectionHeader";
import VideoPlayer from "@/components/VideoPlayer";
import ProductShowcase from "@/components/ProductShowcase";
import KPIGrid from "@/components/KPIGrid";
import GlobeSection from "@/components/GlobeSection";
import SubscribeForm from "@/components/SubscribeForm";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const FEATURE_ICONS = [Zap, ShieldCheck, Globe, BarChart3];

function HubSpotForm() {
  return (
    <div
      className="hs-form-frame w-full"
      data-region="na1"
      data-form-id="b4846450-db95-479c-91bd-72e1123d4d9f"
      data-portal-id="23702020"
    />
  );
}

export default function Home() {
  const { t } = useTranslation();

  const heroWords = t("hero.headline", { returnObjects: true });
  const whyFeatures = t("why.features", { returnObjects: true });

  return (
    <PageShell testid="home-page">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] overflow-hidden" data-testid="hero-section">
        <NeuralNetwork className="opacity-60" />
        <div className="absolute inset-0 grid-overlay opacity-[0.35] pointer-events-none" />
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none opacity-30"
          style={{ background: "radial-gradient(circle, rgba(192,57,43,0.7), transparent 60%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, rgba(192,57,43,0.6), transparent 60%)" }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-32 pb-12 flex flex-col justify-between min-h-[100svh]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-7 flex items-center gap-3"
            data-testid="hero-overline"
          >
            <span className="w-10 h-px bg-[#C0392B]" />
            {t("hero.overline")}
          </motion.div>

          <div className="flex-1 flex flex-col justify-center">
            <h1
              className="font-display text-[clamp(2.2rem,6.5vw,6.5rem)] leading-[0.92] tracking-tighter max-w-6xl"
              data-testid="hero-headline"
            >
              {Array.isArray(heroWords) &&
                heroWords.map((w, i) => {
                  const redIndices = [3, 4];
                  const isRed = redIndices.includes(i);
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.35 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className={`inline-block mr-[0.22em] ${isRed ? "text-[#C0392B] text-glow-red" : "text-white"}`}
                    >
                      {w}
                    </motion.span>
                  );
                })}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
              className="mt-8 max-w-xl text-zinc-400 text-base md:text-lg leading-relaxed"
            >
              {t("hero.subtext")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-3 [&>*]:min-h-[44px]"
            >
              <PrimaryCTA
                href="https://calendly.com/viridiana-flores-audioweb/30min"
                external
                testid="hero-contact-cta"
              >
                {t("hero.contactCta")}
              </PrimaryCTA>
              <GhostCTA
                href="https://rolplayadmin.com/rolplayca-demo/access.php?lang=en_US"
                external
                testid="hero-demo-cta"
              >
                {t("hero.demoCta")}
              </GhostCTA>
            </motion.div>
          </div>

          {/* Stats strip — 100+ clients, 100,000+ users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-20 pt-10 border-t border-white/5 flex flex-wrap items-end justify-between gap-6"
          >
            <div className="flex flex-wrap items-end gap-10">
              <div data-testid="hero-stat-clients">
                <AnimatedCounter value={100} suffix="+" className="font-display text-5xl md:text-6xl text-white" />
                <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mt-1">
                  {t("hero.statClients")}
                </div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div data-testid="hero-stat-users">
                <AnimatedCounter value={100000} suffix="+" className="font-display text-5xl md:text-6xl text-white" />
                <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mt-1">
                  {t("hero.statUsers")}
                </div>
              </div>
            </div>
            <div
              className="glass rounded-full pl-2 pr-5 py-2 flex items-center gap-3 group hover:border-[#C0392B]/40 transition-all"
              data-testid="hero-award-badge"
            >
              <span className="w-9 h-9 rounded-full grid place-items-center bg-[#C0392B] text-white">
                <Award size={16} />
              </span>
              <div>
                <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase leading-tight">
                  {t("hero.awardLine1")}
                </div>
                <div className="text-white text-sm font-semibold leading-tight">{t("hero.awardLine2")}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 top-0 h-px overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C0392B] to-transparent"
            style={{ animation: "scan-line 6s ease-in-out infinite" }}
          />
        </div>
      </section>

      {/* ── MEET ROLPLAY ──────────────────────────────────── */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden" data-testid="meet-rolplay-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <SectionHeader
              overline={t("meet.overline")}
              title={t("meet.title")}
              redWord="Rol"
              body={t("meet.body")}
            />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PrimaryCTA href="/about" testid="meet-about-cta">
                {t("meet.aboutCta")}
              </PrimaryCTA>
              <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">
                {t("meet.badge")}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <VideoPlayer
              src="/meet-rolplay.mp4"
              title={t("meet.title")}
              className="shadow-[0_0_60px_rgba(0,0,0,0.6)]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 hidden md:flex items-center gap-3"
            >
              <Sparkles size={18} className="text-[#C0392B]" />
              <div>
                <div className="text-xs font-medium text-white">{t("meet.recognitionTitle")}</div>
                <div className="text-[10px] text-zinc-500 font-mono tracking-widest">{t("meet.recognitionSub")}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AWARDS ────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-[#050508]" data-testid="awards-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-4">
            {t("awards.overline")}
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-white mb-10">
            {t("awards.title")}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-3"
            >
              <img
                src="/medal1.jpg"
                alt={t("awards.badge1")}
                loading="lazy"
                className="w-64 h-64 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_30px_rgba(192,57,43,0.3)]"
              />
              <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                {t("awards.badge1")}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="flex flex-col items-center gap-3"
            >
              <img
                src="/medal2.jpg"
                alt={t("awards.badge2")}
                loading="lazy"
                className="w-64 h-64 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_30px_rgba(0,180,220,0.2)]"
              />
              <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                {t("awards.badge2")}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY TAGLINE ────────────────────────────── */}
      <section
        className="relative py-16 md:py-24 border-y border-white/5 overflow-hidden"
        data-testid="technology-section"
      >
        <NeuralNetwork className="opacity-30" density={0.00007} />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-4">
            {t("technology.overline")}
          </div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] max-w-5xl mx-auto">
            {(() => {
              const full = t("technology.headline", { highlight: t("technology.highlight") });
              const highlight = t("technology.highlight");
              const parts = full.split(highlight);
              return parts.map((part, i) =>
                i < parts.length - 1 ? (
                  <span key={i}>
                    {part}
                    <span className="text-[#C0392B] text-glow-red">{highlight}</span>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              );
            })()}
          </h2>
        </div>
      </section>

      {/* ── 7-TOOL PRODUCT SHOWCASE ───────────────────────── */}
      <ProductShowcase />

      {/* ── WHY TRAIN WITH AI ─────────────────────────────── */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden" data-testid="why-section">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(192,57,43,0.4), transparent 50%)" }}
        />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-6">
            <SectionHeader
              overline={t("why.overline")}
              title={t("why.title")}
              redWord="AI"
              body={t("why.body")}
            />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PrimaryCTA
                href="https://calendly.com/viridiana-flores-audioweb/30min"
                external
                testid="why-contact-cta"
              >
                {t("why.contactCta")}
              </PrimaryCTA>
              <div className="flex items-center gap-2 text-zinc-500">
                <a
                  href="https://www.linkedin.com/company/rolplaymx/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full glass grid place-items-center hover:text-[#C0392B] hover:border-[#C0392B]/40 transition-all"
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href="mailto:info@rolplay.ai"
                  aria-label="Email"
                  className="w-9 h-9 rounded-full glass grid place-items-center hover:text-[#C0392B] hover:border-[#C0392B]/40 transition-all"
                >
                  <Mail size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {Array.isArray(whyFeatures) &&
              whyFeatures.map((f, i) => {
                const Icon = FEATURE_ICONS[i] || Zap;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className={`glass rounded-2xl p-5 hover:border-[#C0392B]/30 transition-all duration-500 ${i % 2 === 1 ? "translate-y-6" : ""}`}
                    data-testid={`why-feature-${i}`}
                  >
                    <Icon size={20} className="text-[#C0392B] mb-4" />
                    <div className="font-display text-lg leading-tight mb-2">{f.title}</div>
                    <div className="text-xs text-zinc-500 leading-relaxed">{f.body}</div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── KPI GRID ──────────────────────────────────────── */}
      <KPIGrid />

      {/* ── TESTIMONIALS CAROUSEL ─────────────────────────── */}
      <TestimonialsCarousel />

      {/* ── STAT CALLOUT ──────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden" data-testid="stat-callout">
        <NeuralNetwork className="opacity-25" density={0.00006} />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
          <GlassCard
            tilt={false}
            className="p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div>
              <div
                className="font-display text-7xl md:text-9xl text-[#C0392B] text-glow-red leading-none"
                data-testid="callout-stat"
              >
                <AnimatedCounter value={5} prefix="+" suffix="%" />
              </div>
            </div>
            <div className="flex-1 max-w-xl">
              <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mb-3">
                {t("edge.overline")}
              </div>
              <h3 className="font-display text-3xl md:text-4xl leading-tight">
                {t("edge.titleMain")}<span className="text-[#C0392B]">{t("edge.titleRed")}</span>
              </h3>
              <p className="text-zinc-400 mt-4 text-sm md:text-base">{t("edge.body")}</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── GLOBE ─────────────────────────────────────────── */}
      <GlobeSection />

      {/* ── EMAIL SUBSCRIBE ───────────────────────────────── */}
      <SubscribeForm />

      {/* ── CONTACT ───────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 lg:py-32" id="contact" data-testid="home-contact-section">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 text-center">
          <SectionHeader
            overline={t("contact.overline")}
            title={t("contact.title")}
            body={t("contact.body")}
            align="center"
          />
          <div className="mt-12">
            <HubSpotForm />
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <a
              href={`mailto:${t("contact.email")}`}
              className="text-zinc-300 hover:text-[#C0392B] transition"
              data-testid="home-contact-email"
            >
              {t("contact.email")}
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href="tel:+525518006006"
              className="text-zinc-300 hover:text-[#C0392B] transition"
              data-testid="home-contact-phone"
            >
              {t("contact.phone")}
            </a>
            <span className="text-zinc-700">·</span>
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase">
              {t("contact.locations")}
            </span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
