import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import GlassCard from "@/components/GlassCard";
import SectionHeader from "@/components/SectionHeader";
import { PrimaryCTA } from "@/components/CTAButton";
import VideoPlayer from "@/components/VideoPlayer";


function TimelineSlider({ items = [] }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
    trackRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Scroll arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full glass grid place-items-center text-zinc-400 hover:text-white border border-white/10 hover:border-[#C0392B]/40 transition-all"
        >
          ‹
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full glass grid place-items-center text-zinc-400 hover:text-white border border-white/10 hover:border-[#C0392B]/40 transition-all"
        >
          ›
        </button>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        className="overflow-x-auto scrollbar-none cursor-grab select-none pb-6"
        style={{ WebkitOverflowScrolling: "touch" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="flex gap-0 relative" style={{ width: `${items.length * 220}px` }}>
          {/* Connecting line */}
          <div className="absolute top-[28px] left-10 right-10 h-px bg-[#C0392B]/25 pointer-events-none" />

          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="flex flex-col items-center"
              style={{ width: 220, flexShrink: 0, paddingLeft: 12, paddingRight: 12 }}
            >
              {/* Dot */}
              <div className="relative z-10 w-4 h-4 rounded-full bg-[#C0392B] border-2 border-[#C0392B]/50 shadow-[0_0_10px_rgba(192,57,43,0.6)] mb-4" />

              {/* Card */}
              <div className="bg-white rounded-xl p-4 w-full flex-1 min-h-[130px] border border-gray-200 hover:border-[#C0392B]/40 transition-all duration-300">
                <div className="font-display text-2xl text-[#C0392B] mb-2">{item.year}</div>
                <p className="text-xs text-gray-700 leading-relaxed">{item.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const timelineItems = t("about.timelineItems", { returnObjects: true });

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
              {t("about.overline")} · {t("about.estBadge")}
            </div>
            <h1 className="font-display text-[clamp(3rem,8.5vw,8rem)] leading-[0.9] tracking-tighter" data-testid="about-headline">
              {t("about.title").split("RolPlay").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>{part}<span className="text-[#C0392B] text-glow-red" translate="no">RolPlay</span></span>
                ) : <span key={i}>{part}</span>
              )}
            </h1>
            <p className="mt-8 text-zinc-300 text-lg md:text-xl max-w-3xl leading-relaxed">
              {t("about.body").split("RolPlay").reduce((nodes, part, i) =>
                i === 0 ? [part] : [...nodes, <span key={i} translate="no">RolPlay</span>, part], [])}
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
              <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mb-3">{t("about.expansionOverline")}</div>
              <h3 className="font-display text-3xl md:text-4xl leading-tight mb-4">
                {(() => {
                  const full = t("about.expansionTitle");
                  const red = t("about.expansionTitleRed");
                  const idx = full.indexOf(red);
                  if (idx === -1) return <span>{full}</span>;
                  return (
                    <>
                      {full.substring(0, idx)}
                      <span className="text-[#C0392B]">{red}</span>
                      {full.substring(idx + red.length)}
                    </>
                  );
                })()}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{t("about.expansionBody")}</p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
            <GlassCard className="p-10 h-full">
              <Building2 size={28} className="text-[#C0392B] mb-6" />
              <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mb-3">{t("about.clientsOverline")}</div>
              <h3 className="font-display text-3xl md:text-4xl leading-tight mb-4">
                {(() => {
                  const full = t("about.clientsTitle");
                  const red = t("about.clientsTitleRed");
                  const idx = full.indexOf(red);
                  if (idx === -1) return <span>{full}</span>;
                  return (
                    <>
                      {full.substring(0, idx)}
                      <span className="text-[#C0392B]">{red}</span>
                      {full.substring(idx + red.length)}
                    </>
                  );
                })()}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{t("about.clientsBody")}</p>
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
              overline={t("about.missionOverline")}
              title={t("about.mission")}
              redWord={t("about.missionRedWord")}
              body={t("about.missionText")}
            />
            <div className="mt-8">
              <PrimaryCTA href="/contact" testid="about-mission-cta">{t("common.contactUs")}</PrimaryCTA>
            </div>
          </div>
          <div className="lg:col-span-6">
            <VideoPlayer
              src="/about-mission.mp4"
              title={t("about.mission")}
            />
          </div>
        </div>
      </section>

      {/* FLASHCARDS */}
      <section className="relative py-24 border-t border-white/5" data-testid="about-flashcards">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="bg-white rounded-2xl p-10 h-full border border-gray-200 hover:border-[#C0392B]/40 hover:shadow-[0_0_40px_-12px_rgba(192,57,43,0.3)] transition-all duration-300">
              <div className="font-display text-2xl md:text-3xl leading-tight mb-4 font-bold text-gray-900">
                {t("about.flashcard1Title")} <span className="text-[#C0392B]">{t("about.flashcard1TitleMain")}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.flashcard1Body")}
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
            <div className="bg-white rounded-2xl p-10 h-full border border-gray-200 hover:border-[#C0392B]/40 hover:shadow-[0_0_40px_-12px_rgba(192,57,43,0.3)] transition-all duration-300">
              <div className="font-display text-2xl md:text-3xl leading-tight mb-4 font-bold text-gray-900">
                {t("about.flashcard2Title")} <span className="text-[#C0392B]">{t("about.flashcard2TitleMain")}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.flashcard2Body")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative py-24 border-t border-white/5 overflow-hidden" data-testid="about-timeline">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-3">
              {t("about.timelineOverline")}
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-white">
              {t("about.timelineTitle")}
            </h2>
          </div>
          <TimelineSlider items={Array.isArray(timelineItems) ? timelineItems : []} />
        </div>
      </section>
    </PageShell>
  );
}
