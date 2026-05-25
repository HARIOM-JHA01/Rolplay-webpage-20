import { motion } from "framer-motion";
import { Building2, Pill, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import GlassCard from "@/components/GlassCard";
import { PrimaryCTA } from "@/components/CTAButton";

const stories = [
  {
    rank: "4th",
    industry: "ENERGY",
    icon: Building2,
    headline: "The 4th largest oil company in the world.",
    body: "A global energy leader engaged Rolplay to standardize commercial dialogue across regions and equip thousands of representatives with simulator-driven practice. The result: consistent messaging, higher customer confidence, and a measurable lift in sales close-rates.",
    metrics: [
      { k: "REGIONS COVERED", v: "26" },
      { k: "REPS TRAINED", v: "12k+" },
      { k: "TIME TO COMPETENCY", v: "-38%" },
    ],
    accent: "rgba(192, 57, 43, 0.5)",
  },
  {
    rank: "2nd",
    industry: "PHARMACEUTICAL",
    icon: Pill,
    headline: "The 2nd largest pharmaceutical company in the world.",
    body: "We sought to standardize sales processes and the messaging created by the training department through a virtual platform that allowed representatives to practice methodology, dialogues, and selling skills…",
    metrics: [
      { k: "MARKETS", v: "41" },
      { k: "PLAYBOOKS", v: "180+" },
      { k: "REP CONFIDENCE", v: "+44%" },
    ],
    accent: "rgba(192, 57, 43, 0.5)",
  },
];

export default function SuccessStories() {
  const { t } = useTranslation();
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
              SELECTED CASE STUDIES · CONFIDENTIAL
            </div>
            <h1 className="font-display text-[clamp(2.8rem,8vw,8rem)] leading-[0.9]" data-testid="stories-headline">
              <span className="text-[#C0392B] text-glow-red">Success</span> Stories.
            </h1>
            <p className="mt-8 text-zinc-300 text-base md:text-lg max-w-2xl leading-relaxed">
              For confidentiality, our clients are identified only by their global ranking. The results, however, speak for themselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STORIES */}
      {stories.map((s, idx) => {
        const Icon = s.icon;
        const reverse = idx % 2 === 1;
        return (
          <section
            key={s.rank}
            className="relative py-28 lg:py-40 border-t border-white/5 overflow-hidden"
            data-testid={`story-${idx}`}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background: `radial-gradient(ellipse at ${reverse ? "20%" : "80%"} 50%, ${s.accent}, transparent 50%)`,
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
                    {s.rank}
                  </div>
                  <div className="absolute -bottom-2 left-0 right-0 text-center font-mono text-[10px] tracking-[0.4em] text-zinc-500 uppercase">
                    LARGEST GLOBALLY
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
                  CASE 0{idx + 1} · {s.industry}
                </div>
                <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">{s.headline}</h2>
                <p className="text-zinc-400 mt-6 leading-relaxed text-base md:text-lg max-w-2xl">{s.body}</p>

                <div className="mt-10 grid grid-cols-3 gap-3">
                  {s.metrics.map((m) => (
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
              <div className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase mb-3">// READY TO BEGIN</div>
              <h3 className="font-display text-3xl md:text-5xl leading-tight max-w-2xl">
                Make your team the next <span className="text-[#C0392B]">success story.</span>
              </h3>
            </div>
            <PrimaryCTA href="https://calendly.com/viridiana-flores-audioweb/30min" external testid="stories-cta">
              Schedule a Demo <ArrowRight size={14} />
            </PrimaryCTA>
          </GlassCard>
        </div>
      </section>
    </PageShell>
  );
}
