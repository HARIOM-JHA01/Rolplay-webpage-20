import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import GlassCard from "@/components/GlassCard";
import SectionHeader from "@/components/SectionHeader";
import { PrimaryCTA } from "@/components/CTAButton";

const MEDAL_IMAGES = [
  { src: "/medal3.jpg", glowColor: "rgba(240,200,40,0.35)", year: "2026" },
  { src: "/medal1.jpg", glowColor: "rgba(192,57,43,0.35)", year: "2025" },
  { src: "/medal2.jpg", glowColor: "rgba(0,180,220,0.25)", year: "2024" },
];

export default function Achievements() {
  const { t } = useTranslation();
  const awards = t("achievementsPage.awards", { returnObjects: true });

  return (
    <PageShell testid="achievements-page">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden" data-testid="achievements-hero">
        <NeuralNetwork className="opacity-35" density={0.0001} />
        <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(192,57,43,0.22), transparent 60%)" }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
              <span className="w-10 h-px bg-[#C0392B]" />
              {t("achievementsPage.overline")}
            </div>
            <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.88] tracking-tighter" data-testid="achievements-headline">
              {t("achievementsPage.heroTitle")}
              <span className="text-[#C0392B] text-glow-red">{t("achievementsPage.heroTitleRed")}</span>
            </h1>
            <p className="mt-8 text-zinc-300 text-lg md:text-xl max-w-3xl leading-relaxed">
              {t("achievementsPage.heroBody")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* AWARDS */}
      <section className="relative py-24 border-t border-white/5" data-testid="achievements-awards">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(awards) && awards.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                data-testid={`award-card-${i}`}
              >
                <GlassCard className="p-10 h-full relative">
                  <div className="absolute top-6 right-6 font-display text-7xl text-white/5">
                    {MEDAL_IMAGES[i]?.year}
                  </div>
                  <div className="flex justify-center mb-8">
                    <img
                      src={MEDAL_IMAGES[i]?.src}
                      alt={a.badge}
                      loading="lazy"
                      className="w-52 h-52 object-contain hover:scale-105 transition-transform duration-300"
                      style={{ filter: `drop-shadow(0 0 24px ${MEDAL_IMAGES[i]?.glowColor})` }}
                    />
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase mb-3">{a.badge}</div>
                  <h3 className="font-display text-2xl md:text-3xl leading-tight mb-4">{a.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{a.body}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOGNITION QUOTE */}
      <section className="relative py-32 border-y border-white/5 overflow-hidden" data-testid="achievements-quote">
        <NeuralNetwork className="opacity-25" />
        <div className="relative max-w-[1100px] mx-auto px-6 lg:px-10 text-center">
          <Sparkles size={28} className="text-[#C0392B] mx-auto mb-6" />
          <p className="font-display text-2xl md:text-4xl leading-tight">
            {t("achievementsPage.quoteText")}
          </p>
        </div>
      </section>

      {/* VIDEO EMBED */}
      <section className="relative py-32" data-testid="achievements-video-section">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <SectionHeader
            overline={t("achievementsPage.caseFilmOverline")}
            title={t("achievementsPage.caseFilmTitle")}
            redWord={t("achievementsPage.caseFilmTitleRed")}
            align="center"
          />
          <div className="mt-14">
            <GlassCard className="aspect-video group cursor-pointer" data-testid="achievements-video">
              <NeuralNetwork className="opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#0A0A0E]/90" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <motion.div whileHover={{ scale: 1.12 }} className="w-24 h-24 rounded-full bg-[#C0392B] grid place-items-center shadow-[0_0_60px_rgba(192,57,43,0.7)] mx-auto">
                    <Play size={32} fill="white" className="ml-1" />
                  </motion.div>
                  <div className="font-display text-3xl md:text-4xl mt-6">{t("achievementsPage.videoTitle")}</div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mt-2">{t("achievementsPage.videoDuration")}</div>
                </div>
              </div>
            </GlassCard>
          </div>
          <div className="mt-12 text-center">
            <PrimaryCTA href="/contact" testid="achievements-cta">{t("achievementsPage.ctaText")}</PrimaryCTA>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
