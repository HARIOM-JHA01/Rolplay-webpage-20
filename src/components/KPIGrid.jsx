import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/SectionHeader";
import NeuralNetwork from "@/components/NeuralNetwork";

function useCountUp(target, duration = 1800, inView) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-expo
      const eased = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return count;
}

function KPIStat({ value, prefix, suffix, label, delay }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const count = useCountUp(value, 2000, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const display =
    value >= 1000
      ? count >= 1000
        ? `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 0)}K`
        : count.toString()
      : count.toString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-8 text-center hover:border-[#C0392B]/30 transition-all duration-500 group"
    >
      <div
        className="font-display text-6xl md:text-7xl leading-none text-white group-hover:text-[#C0392B] transition-colors duration-500"
        aria-label={`${prefix}${value}${suffix}`}
      >
        <span className="text-[#C0392B]">{prefix}</span>
        {display}
        <span className="text-[#C0392B]">{suffix}</span>
      </div>
      <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mt-3">
        {label}
      </div>
    </motion.div>
  );
}

export default function KPIGrid() {
  const { t } = useTranslation();
  const stats = t("kpi.stats", { returnObjects: true });

  return (
    <section className="relative py-32 overflow-hidden" data-testid="kpi-section">
      <NeuralNetwork className="opacity-20" density={0.00006} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(192,57,43,0.12), transparent 55%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          overline={t("kpi.overline")}
          title={t("kpi.title", { highlight: t("kpi.highlight") })}
          redWord={t("kpi.highlight")}
          body={t("kpi.body")}
          align="center"
        />

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.isArray(stats) &&
            stats.map((stat, i) => (
              <KPIStat
                key={i}
                value={stat.value}
                prefix={stat.prefix ?? ""}
                suffix={stat.suffix}
                label={stat.label}
                delay={i * 0.1}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
