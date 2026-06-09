import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, MessageSquare, Target, ShieldCheck, Trophy, BarChart3, Plus, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import { PrimaryCTA, GhostCTA } from "@/components/CTAButton";
import SectionHeader from "@/components/SectionHeader";

const PILLAR_ICONS = [Zap, MessageSquare, Target, ShieldCheck, Trophy, BarChart3];

export default function Benefits() {
  const [open, setOpen] = useState(0);
  const { t } = useTranslation();
  const pillars = t("benefitsPage.pillars", { returnObjects: true });

  return (
    <PageShell testid="benefits-page">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden" data-testid="benefits-hero">
        <NeuralNetwork className="opacity-40" />
        <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(192,57,43,0.25), transparent 55%)" }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="lg:col-span-7">
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
              <span className="w-10 h-px bg-[#C0392B]" />
              {t("benefits.overline")}
            </div>
            <h1 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95]" data-testid="benefits-headline">
              {(() => {
                const full = t("benefitsPage.heroHeadline");
                const red = t("benefitsPage.heroHeadlineRed");
                const idx = full.indexOf(red);
                if (idx === -1) return <span>{full}</span>;
                return (
                  <>
                    {full.substring(0, idx)}
                    <span className="text-[#C0392B] text-glow-red">{red}</span>
                  </>
                );
              })()}
            </h1>
            <p className="mt-8 text-zinc-300 text-base md:text-lg max-w-2xl leading-relaxed">
              {t("benefitsPage.heroBody")}
            </p>
            <div className="mt-8">
              <PrimaryCTA href="https://rolplayadmin.com/rolplayca-demo/access.php?lang=en_US" external testid="benefits-demo-cta">
                {t("benefitsPage.heroDemoCta")}
              </PrimaryCTA>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl glass-strong p-8 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase">
                    {t("benefitsPage.corePrinciple")}
                  </div>
                  <p className="font-display text-2xl md:text-3xl mt-4 leading-tight">
                    {t("benefitsPage.failPrivate")} <span className="text-[#C0392B]">{t("benefitsPage.failPrivateRed")}</span>
                  </p>
                </div>
                <div className="space-y-2 font-mono text-[11px] text-zinc-500 tracking-widest">
                  <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" /> {t("benefitsPage.noJudgement")}</div>
                  <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" /> {t("benefitsPage.objective100")}</div>
                  <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" /> {t("benefitsPage.unlimitedReps")}</div>
                </div>
              </div>
              <div className="absolute -inset-4 rounded-3xl border border-[#C0392B]/20" style={{ animation: "pulse-red 4s ease-in-out infinite" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* KEY MESSAGE */}
      <section className="relative py-24 border-y border-white/5" data-testid="benefits-key-message">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 text-center">
          <p className="font-display text-2xl md:text-4xl leading-tight">
            {t("benefitsPage.keyMessage1")}
            <span className="text-[#C0392B]">{t("benefitsPage.keyMessageRed1")}</span>
            {t("benefitsPage.keyMessage2")}
            <span className="text-[#C0392B]">{t("benefitsPage.keyMessageRed2")}</span>
            {t("benefitsPage.keyMessage3")}
          </p>
        </div>
      </section>

      {/* ACCORDION */}
      <section className="relative py-32" data-testid="benefits-accordion-section">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <SectionHeader
            overline={t("benefitsPage.pillarsOverline")}
            title={t("benefitsPage.pillarsTitle")}
            redWord={t("benefitsPage.pillarsTitleRed")}
          />
          <div className="mt-14 space-y-3">
            {Array.isArray(pillars) && pillars.map((b, i) => {
              const Icon = PILLAR_ICONS[i] || Zap;
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-500 ${
                    isOpen ? "border-[#C0392B]/50 shadow-[0_0_30px_-10px_rgba(192,57,43,0.3)]" : "border-gray-200"
                  }`}
                  data-testid={`benefit-${i}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center gap-6 p-7 text-left"
                    data-testid={`benefit-toggle-${i}`}
                  >
                    <div className={`w-12 h-12 rounded-xl grid place-items-center transition-all duration-500 ${isOpen ? "bg-[#C0392B] text-white" : "bg-[#C0392B]/10 text-[#C0392B]"}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] tracking-[0.25em] text-[#C0392B] uppercase">
                        {t("benefitsPage.pillarLabel")} 0{i + 1}
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl mt-1 leading-tight text-gray-900">{b.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{b.summary}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full grid place-items-center border ${isOpen ? "border-[#C0392B] text-[#C0392B]" : "border-gray-300 text-gray-600"}`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-7 pb-8 pl-[5.5rem]">
                          <div
                            className="relative rounded-xl p-6 border border-[#C0392B]/20 bg-gray-50"
                          >
                            <p className="text-gray-700 leading-relaxed">{b.body}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GOLDEN BOLD STATEMENT */}
      <section className="relative py-32 overflow-hidden border-t border-white/5" data-testid="benefits-bold-statement">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 20% 30%, rgba(217,164,67,0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(192,57,43,0.18), transparent 50%), #050508",
          }}
        />
        {[...Array(40)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: Math.random() * 600, x: Math.random() * 100 + "vw", opacity: 0 }}
            animate={{ y: [Math.random() * 600, Math.random() * 600 - 200], opacity: [0, 0.7, 0] }}
            transition={{ duration: 6 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "#C0392B" : "#D9A443",
              boxShadow: `0 0 8px ${i % 3 === 0 ? "rgba(192,57,43,0.7)" : "rgba(217,164,67,0.7)"}`,
            }}
          />
        ))}

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.95]"
          >
            {t("benefitsPage.practicePrivate")}<br />
            <span className="text-[#C0392B] text-glow-red">{t("benefitsPage.practicePrivateRed")}</span>
          </motion.h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <PrimaryCTA href="https://calendly.com/viridiana-flores-audioweb/30min" external testid="benefits-bold-cta">
              {t("benefitsPage.bookCall")}
            </PrimaryCTA>
            <GhostCTA href="/success-stories" testid="benefits-stories-cta">{t("benefitsPage.seeResults")}</GhostCTA>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
