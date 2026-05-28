import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const AUTOPLAY_INTERVAL = 4000;

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const pointerStartX = useRef(null);

  const { t: tr } = useTranslation();
  const items = tr("testimonials.items", { returnObjects: true });
  const itemCount = Array.isArray(items) ? items.length : 1;

  const go = useCallback(
    (next) => {
      const clamped = ((next % itemCount) + itemCount) % itemCount;
      setDirection(clamped > index ? 1 : -1);
      setIndex(clamped);
    },
    [index, itemCount]
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % itemCount);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [itemCount]);

  // Restart timer on manual nav
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % itemCount);
    }, AUTOPLAY_INTERVAL);
  }, [itemCount]);

  const handlePrev = () => { prev(); resetTimer(); };
  const handleNext = () => { next(); resetTimer(); };

  // Pointer/touch swipe
  const handlePointerDown = (e) => { pointerStartX.current = e.clientX; };
  const handlePointerUp = (e) => {
    if (pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? handleNext() : handlePrev();
    }
    pointerStartX.current = null;
  };

  // Keyboard nav
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  const testimonial = Array.isArray(items) ? items[index] : {};

  return (
    <section
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
      data-testid="testimonials-carousel"
      aria-label="Client testimonials"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(192,57,43,0.35), transparent 60%)",
        }}
      />

      <div className="relative max-w-[900px] mx-auto px-6 lg:px-10">
        {/* Overline */}
        <div className="text-center mb-10">
          <div className="font-mono text-[11px] tracking-[0.3em] text-[#C0392B] uppercase mb-3">
            {tr("testimonials.overline")}
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-white">
            {tr("testimonials.title")}
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="relative select-none cursor-grab active:cursor-grabbing"
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Quote mark */}
              <div
                className="font-display text-[6rem] leading-none text-[#C0392B] opacity-30 -mb-6 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <blockquote className="glass rounded-2xl p-8 md:p-12">
                <p className="font-display text-xl md:text-2xl lg:text-3xl leading-snug text-white break-words">
                  {testimonial.quote}
                </p>
                <footer className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{testimonial.author}</div>
                    <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase mt-0.5">
                      {testimonial.company}
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full border border-[#C0392B]/40 font-mono text-[10px] tracking-[0.2em] text-[#C0392B] uppercase">
                    {testimonial.region}
                  </div>
                </footer>
              </blockquote>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
              {Array.from({ length: itemCount }).map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1} of ${itemCount}`}
                  onClick={() => { go(i); resetTimer(); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 h-2 bg-[#C0392B]"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full glass grid place-items-center text-zinc-400 hover:text-white hover:border-[#C0392B]/40 transition-all min-h-[44px] min-w-[44px]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full glass grid place-items-center text-zinc-400 hover:text-white hover:border-[#C0392B]/40 transition-all min-h-[44px] min-w-[44px]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
