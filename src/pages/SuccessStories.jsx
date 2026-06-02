import { motion } from "framer-motion";
import { Building2, Pill, Landmark, Wifi, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import GlassCard from "@/components/GlassCard";
import { PrimaryCTA } from "@/components/CTAButton";

const STORY_META = [
  { rank: "4th", icon: Building2, accent: "rgba(192, 57, 43, 0.5)" },
  { rank: "2nd", icon: Pill, accent: "rgba(192, 57, 43, 0.5)" },
  { rank: "1st", icon: Landmark, accent: "rgba(192, 57, 43, 0.5)" },
  { rank: "3rd", icon: Wifi, accent: "rgba(192, 57, 43, 0.5)" },
  { rank: "5th", icon: ShieldCheck, accent: "rgba(192, 57, 43, 0.5)" },
];

export default function SuccessStories() {
  const { t } = useTranslation();
  const stories = t("storiesPage.stories", { returnObjects: true });

  return (
    <PageShell testid="success-stories-page">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden" data-testid="stories-hero">
        <NeuralNetwork className="opacity-40" />
        <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(192,57,43,0.22), transparent 60%)" }} />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
              <span className="w-10 h-px bg-[#C0392B]" />
              {t("storiesPage.overline")}
            </div>
            <h1 className="font-display text-[clamp(2.8rem,8vw,8rem)] leading-[0.9]" data-testid="stories-headline">
              <span className="text-[#C0392B] text-glow-red">{t("storiesPage.heroTitle1")}</span>
              {t("storiesPage.heroTitle2")}
            </h1>
            <p className="mt-8 text-zinc-300 text-base md:text-lg max-w-2xl leading-relaxed">
              {t("storiesPage.heroBody")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* STORIES */}
      {Array.isArray(stories) && stories.map((s, idx) => {
        const meta = STORY_META[idx] || STORY_META[0];
        const Icon = meta.icon;
        const reverse = idx % 2 === 1;
        return (
          <section
            key={idx}
            className="relative py-28 lg:py-40 border-t border-white/5 overflow-hidden"
            data-testid={`story-${idx}`}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background: `radial-gradient(ellipse at ${reverse ? "20%" : "80%"} 50%, ${meta.accent}, transparent 50%)`,
              }}
            />
            <NeuralNetwork className="opacity-25" density={0.00007} />

            <div className={`relative max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
              {/* MASSIVE RANK */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 relative flex items-center justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl"
                    style={{ background: "radial-gradient(circle, rgba(192,57,43,0.4), transparent 70%)" }} />
                  <div
                    className="relative font-display select-none leading-none"
                    style={{
                      fontSize: "clamp(11rem, 22vw, 22rem)",
                      background: "linear-gradient(180deg, #ffffff 0%, #C0392B 50%, #5e1a14 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 35px rgba(192,57,43,0.4))",
                    }}
                    data-testid={`story-rank-${idx}`}
                  >
                    {meta.rank}
                  </div>
                  <div className="absolute -bottom-2 left-0 right-0 text-center font-mono text-[10px] tracking-[0.4em] text-zinc-500 uppercase">
                    {t("storiesPage.largestGlobally")}
                  </div>
                </div>
              </motion.div>

              {/* DESCRIPTION */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="lg:col-span-7"
              >
                <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-[#C0392B] uppercase mb-5">
                  <Icon size={14} />
                  {t("storiesPage.caseLabel")} 0{idx + 1} · {s.industry}
                </div>
                <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">{s.headline}</h2>
                <p className="text-zinc-400 mt-6 leading-relaxed text-base md:text-lg max-w-2xl">{s.body}</p>

                <div className="mt-10 grid grid-cols-3 gap-3">
                  {Array.isArray(s.metrics) && s.metrics.map((m) => (
                    <GlassCard key={m.k} tilt={false} className="p-5">
                      <div className="font-display text-2xl md:text-3xl text-white">{m.v}</div>
                      <div className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase mt-2">{m.k}</div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="relative py-32 border-t border-white/5" data-testid="stories-cta-section">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <GlassCard tilt={false} className="p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase mb-3">
                {t("storiesPage.readyToBegin")}
              </div>
              <h3 className="font-display text-3xl md:text-5xl leading-tight max-w-2xl">
                {(() => {
                  const full = t("storiesPage.ctaTitle");
                  const red = t("storiesPage.ctaTitleRed");
                  const idx2 = full.indexOf(red);
                  if (idx2 === -1) return <span>{full}</span>;
                  return (
                    <>
                      {full.substring(0, idx2)}
                      <span className="text-[#C0392B]">{red}</span>
                    </>
                  );
                })()}
              </h3>
            </div>
            <PrimaryCTA href="https://calendly.com/viridiana-flores-audioweb/30min" external testid="stories-cta">
              {t("storiesPage.scheduleDemo")} <ArrowRight size={14} />
            </PrimaryCTA>
          </GlassCard>
        </div>
      </section>
    </PageShell>
  );
}
