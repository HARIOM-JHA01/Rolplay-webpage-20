import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import ContactForm from "@/components/ContactForm";

function LightBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 0.5, 0], scaleY: [0, 1, 1] }}
          transition={{ duration: 5, delay: i * 0.6, repeat: Infinity, repeatDelay: 3 }}
          className="absolute top-0 origin-top"
          style={{
            left: `${10 + i * 13}%`,
            width: 2,
            height: "100%",
            background: "linear-gradient(180deg, transparent, rgba(192,57,43,0.7) 30%, rgba(192,57,43,0.5) 60%, transparent)",
            filter: "blur(1px)",
            transform: `rotate(${(i - 3) * 4}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function FAQs() {
  const [open, setOpen] = useState(0);
  const { t } = useTranslation();
  const faqs = t("faqs.items", { returnObjects: true });

  return (
    <PageShell testid="faqs-page">
      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden" data-testid="faqs-hero">
        <NeuralNetwork className="opacity-30" />
        <LightBeams />
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(192,57,43,0.3), transparent 50%)" }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-24 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 inline-flex items-center gap-3 mx-auto">
              <span className="w-10 h-px bg-[#C0392B]" />
              {t("faqs.overline")}
              <span className="w-10 h-px bg-[#C0392B]" />
            </div>
            <h1 className="font-display text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.92] max-w-4xl mx-auto" data-testid="faqs-headline">
              {t("faqs.title").split(" ").map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="text-[#C0392B] text-glow-red">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>
            <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">{t("faqs.body")}</p>
          </motion.div>
        </div>
      </section>

      {/* ACCORDION */}
      <section className="relative py-24" data-testid="faqs-accordion-section">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="space-y-1">
            {Array.isArray(faqs) && faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className={`relative border-b border-white/5 transition-all duration-500 ${isOpen ? "" : "hover:border-white/15"}`}
                  data-testid={`faq-${i}`}
                >
                  {isOpen && (
                    <motion.span
                      layoutId="faq-indicator"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C0392B] shadow-[0_0_15px_rgba(192,57,43,0.7)]"
                    />
                  )}
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center gap-6 py-6 px-6 text-left group"
                    data-testid={`faq-toggle-${i}`}
                  >
                    <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-600 w-8">0{i + 1}</div>
                    <div className="flex-1">
                      <h3 className={`font-display text-xl md:text-2xl leading-snug transition-colors ${isOpen ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                        {f.q}
                      </h3>
                    </div>
                    <div className={`w-9 h-9 rounded-full grid place-items-center border transition-all duration-300 ${isOpen ? "border-[#C0392B] text-[#C0392B] bg-[#C0392B]/10" : "border-white/15 text-white/70"}`}>
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
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
                        <div className="pl-[3.5rem] pr-16 pb-7">
                          <p className="text-zinc-400 leading-relaxed text-base">{f.a}</p>
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

      {/* CONTACT */}
      <section className="relative py-24 border-t border-white/5 overflow-hidden" data-testid="faqs-contact-section">
        <NeuralNetwork className="opacity-25" density={0.00006} />
        <div className="relative max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
                <span className="w-10 h-px bg-[#C0392B]" />
                STILL CURIOUS?
              </div>
              <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">
                Ask us <span className="text-[#C0392B]">anything.</span>
              </h2>
              <p className="text-zinc-400 mt-5 max-w-md">We answer every question, usually the same business day.</p>
            </div>
            <div className="lg:col-span-7">
              <div className="glass rounded-3xl p-8">
                <ContactForm variant="full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
