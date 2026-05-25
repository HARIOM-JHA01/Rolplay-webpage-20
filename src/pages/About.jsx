import { motion } from "framer-motion";
import { MapPin, Building2, Globe, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import GlassCard from "@/components/GlassCard";
import SectionHeader from "@/components/SectionHeader";
import { PrimaryCTA } from "@/components/CTAButton";
import VideoPlayer from "@/components/VideoPlayer";

const locationCoords = [
  { city: "Toronto", country: "Canada", x: 38, y: 28 },
  { city: "Monterrey", country: "Mexico", x: 30, y: 48 },
  { city: "Ciudad de México", country: "Mexico", x: 32, y: 56 },
];

function GlobeViz() {
  return (
    <div className="relative aspect-square w-full max-w-[460px] mx-auto" data-testid="about-globe">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-[#C0392B]/30"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute inset-3 rounded-full border border-[#C0392B]/20"
      />
      <svg viewBox="0 0 200 200" className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)]">
        <defs>
          <radialGradient id="globeFill" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#1a1a26" />
            <stop offset="60%" stopColor="#0a0a14" />
            <stop offset="100%" stopColor="#050508" />
          </radialGradient>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="rgba(192,57,43,0)" />
            <stop offset="100%" stopColor="rgba(192,57,43,0.25)" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill="url(#globeFill)" stroke="rgba(192,57,43,0.35)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="92" fill="url(#globeGlow)" />
        {[30, 60, 100, 140, 170].map((y, i) => {
          const dy = Math.abs(y - 100);
          const w = Math.sqrt(92 * 92 - dy * dy);
          return (
            <line key={i} x1={100 - w} x2={100 + w} y1={y} y2={y}
              stroke="rgba(192,57,43,0.25)" strokeWidth="0.5" />
          );
        })}
        {[-60, -30, 0, 30, 60].map((deg) => (
          <ellipse
            key={deg}
            cx="100" cy="100"
            rx={Math.abs(92 * Math.cos((deg * Math.PI) / 180))}
            ry="92"
            fill="none"
            stroke="rgba(192,57,43,0.18)"
            strokeWidth="0.4"
          />
        ))}
        <line x1="8" x2="192" y1="100" y2="100" stroke="rgba(192,57,43,0.5)" strokeWidth="0.6" />
      </svg>
      {locationCoords.map((l, i) => (
        <motion.div
          key={l.city}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + i * 0.2, type: "spring", stiffness: 180 }}
          className="absolute z-10"
          style={{ left: `${l.x}%`, top: `${l.y}%` }}
        >
          <div className="relative">
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C0392B]/40"
              style={{ width: 22, height: 22, animation: "pulse-red 2s ease-in-out infinite" }}
            />
            <span className="relative block w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C0392B] shadow-[0_0_15px_rgba(192,57,43,0.9)]" />
            <div className="absolute left-3 top-0 ml-1 whitespace-nowrap font-mono text-[10px] tracking-[0.2em] text-white uppercase glass rounded-full px-2.5 py-1">
              {l.city}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();

  return (
    <PageShell testid="about-page">
      {/* HERO */}
      <section className="relative min-h-[60vh] overflow-hidden flex items-center" data-testid="about-hero">
        <NeuralNetwork className="opacity-40" density={0.00009} />
        <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(192,57,43,0.18), transparent 60%)" }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
              <span className="w-10 h-px bg-[#C0392B]" />
              {t("about.overline")} · EST. 2002
            </div>
            <h1 className="font-display text-[clamp(3rem,8.5vw,8rem)] leading-[0.9] tracking-tighter" data-testid="about-headline">
              {t("about.title").split("RolPlay").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>{part}<span className="text-[#C0392B] text-glow-red">RolPlay</span></span>
                ) : <span key={i}>{part}</span>
              )}
            </h1>
            <p className="mt-8 text-zinc-300 text-lg md:text-xl max-w-3xl leading-relaxed">
              {t("about.body")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="relative py-24" data-testid="about-info-cards">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <GlassCard className="p-10 h-full">
              <Globe size={28} className="text-[#C0392B] mb-6" />
              <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mb-3">// EXPANSION</div>
              <h3 className="font-display text-3xl md:text-4xl leading-tight mb-4">
                From Mexico to <span className="text-[#C0392B]">Toronto</span>.
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                What began in 2002 as a Mexican innovation has grown into a North-American operation, with expansion into Toronto, Canada, serving teams across the continent.
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
            <GlassCard className="p-10 h-full">
              <Building2 size={28} className="text-[#C0392B] mb-6" />
              <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mb-3">// CLIENTS</div>
              <h3 className="font-display text-3xl md:text-4xl leading-tight mb-4">
                Trusted by <span className="text-[#C0392B]">world-class</span> corporates.
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Our solutions support some of the largest companies on the planet — across pharmaceuticals, energy, retail and finance — with measurable training outcomes.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative py-32 border-t border-white/5 overflow-hidden" data-testid="about-mission">
        <NeuralNetwork className="opacity-20" density={0.00006} />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <SectionHeader
              overline="OUR REASON FOR BEING"
              title={t("about.mission")}
              redWord="Mission"
              body={t("about.missionText")}
            />
            <div className="mt-8">
              <PrimaryCTA href="/contact" testid="about-mission-cta">{t("common.contactUs")}</PrimaryCTA>
            </div>
          </div>
          <div className="lg:col-span-6">
            <VideoPlayer
              iframeSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title={t("about.mission")}
            />
          </div>
        </div>
      </section>

      {/* GLOBE */}
      <section className="relative py-32 border-t border-white/5 overflow-hidden" data-testid="about-globe-section">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ background: "radial-gradient(ellipse at center, rgba(192,57,43,0.15), transparent 60%)" }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              overline="OUR FOOTPRINT"
              title="Three offices. One vision."
              redWord="One vision."
              body="From Toronto to Mexico City, our teams partner with leading companies to redefine how sales is taught, practiced and measured."
            />
            <div className="mt-8 space-y-3">
              {locationCoords.map((l) => (
                <div key={l.city} className="flex items-center gap-4 glass rounded-2xl px-5 py-4">
                  <MapPin size={18} className="text-[#C0392B]" />
                  <div>
                    <div className="font-display text-xl">{l.city}</div>
                    <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">{l.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <GlobeViz />
        </div>
      </section>
    </PageShell>
  );
}
