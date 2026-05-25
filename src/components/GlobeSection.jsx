import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/SectionHeader";
import { MapPin } from "lucide-react";

const GlobeGL = lazy(() => import("react-globe.gl"));

const LOCATIONS = [
  {
    lat: 43.6532,
    lng: -79.3832,
    labelKey: "globe.toronto",
    altitude: 0.06,
    color: "#C0392B",
  },
  {
    lat: 19.4326,
    lng: -99.1332,
    labelKey: "globe.mexicoCity",
    altitude: 0.06,
    color: "#E74C3C",
  },
];

function GlobeFallback({ t }) {
  return (
    <div className="w-full aspect-square max-w-sm mx-auto flex flex-col items-center justify-center gap-6">
      <div className="w-48 h-48 rounded-full border border-[#C0392B]/30 flex items-center justify-center relative">
        <div className="w-32 h-32 rounded-full border border-[#C0392B]/20 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[#C0392B] shadow-[0_0_16px_rgba(192,57,43,0.8)]" />
        </div>
        {LOCATIONS.map((loc) => (
          <div
            key={loc.labelKey}
            className="absolute flex flex-col items-center gap-1"
            style={{
              top: loc.lat > 30 ? "20%" : "60%",
              left: loc.lng < -90 ? "30%" : "45%",
            }}
          >
            <MapPin size={14} style={{ color: loc.color }} />
            <span className="text-[9px] font-mono text-white/60 whitespace-nowrap">
              {t(loc.labelKey)}
            </span>
          </div>
        ))}
      </div>
      {LOCATIONS.map((loc) => (
        <div key={loc.labelKey} className="flex items-center gap-2">
          <MapPin size={12} style={{ color: loc.color }} />
          <span className="text-xs text-zinc-400">{t(loc.labelKey)}</span>
        </div>
      ))}
    </div>
  );
}

export default function GlobeSection() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dims, setDims] = useState({ w: 520, h: 520 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setDims({ w, h: w });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const points = LOCATIONS.map((loc) => ({
    lat: loc.lat,
    lng: loc.lng,
    altitude: loc.altitude,
    color: loc.color,
    label: t(loc.labelKey),
  }));

  return (
    <section className="relative py-32 overflow-hidden" data-testid="globe-section">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(192,57,43,0.12), transparent 55%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <SectionHeader
            overline={t("globe.overline")}
            title={t("globe.title", { highlight: t("globe.highlight") })}
            redWord={t("globe.highlight")}
            body={t("globe.body")}
          />
          <div className="mt-8 space-y-3">
            {LOCATIONS.map((loc) => (
              <motion.div
                key={loc.labelKey}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <span
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                  style={{ background: loc.color, color: loc.color }}
                />
                <span className="text-sm text-zinc-300">{t(loc.labelKey)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div
          ref={containerRef}
          className="lg:col-span-7 flex items-center justify-center"
        >
          {isMobile ? (
            <GlobeFallback t={t} />
          ) : (
            <div className="w-full max-w-[520px] aspect-square">
              {inView && (
                <Suspense
                  fallback={
                    <div className="w-full h-full rounded-full bg-white/5 animate-pulse" />
                  }
                >
                  <GlobeGL
                    width={dims.w || 520}
                    height={dims.h || 520}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    atmosphereColor="#C0392B"
                    atmosphereAltitude={0.15}
                    pointsData={points}
                    pointLat="lat"
                    pointLng="lng"
                    pointAltitude="altitude"
                    pointColor="color"
                    pointRadius={0.6}
                    pointLabel="label"
                    pointsMerge={false}
                    autoRotate
                    autoRotateSpeed={0.6}
                    enablePointerInteraction
                  />
                </Suspense>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
