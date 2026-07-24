import { motion } from "framer-motion";
import { Brain, Target, ShieldCheck, Eye, BookOpen, Phone, BarChart3, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "@/components/GlassCard";
import NeuralNetwork from "@/components/NeuralNetwork";
import SectionHeader from "@/components/SectionHeader";
import VideoPlayer from "@/components/VideoPlayer";

const VIDEO_MAP = {
  "Master Coach": { en: "/videos/master-coach-en.mp4", es: "/videos/master-coach-es.mp4" },
  "Practice Simulator": { en: "/videos/simulator-en.mp4", es: "/videos/simulator-es.mp4" },
  "Second Brain": { en: "/videos/second-brain-es.mp4", es: "/videos/second-brain-es.mp4" },
  "CallMentorAI": { en: "/videos/master-coach-en.mp4", es: "/videos/master-coach-es.mp4" },
  "Rolplay Analytics": { en: "/videos/rolplay-sense-es.mp4", es: "/videos/rolplay-sense-es.mp4" },
};

function getVideoSrc(productName, lang) {
  const videos = VIDEO_MAP[productName];
  if (!videos) return null;
  return videos[lang] || videos.es;
}

const ICONS = [Brain, Target, ShieldCheck, Eye, BookOpen, Phone, BarChart3];

function ProductCard({ product, index, total, lang }) {
  const Icon = ICONS[index] || Brain;
  const videoSrc = getVideoSrc(product.name, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`product-card-${index}`}
      className={
        // Center last card when total is odd
        total % 2 !== 0 && index === total - 1
          ? "md:col-start-2 lg:col-start-auto"
          : ""
      }
    >
      <GlassCard className="p-6 group cursor-pointer h-full hover:border-[#C0392B]/30 transition-all duration-500">
        <div className="aspect-[4/3] rounded-xl relative overflow-hidden mb-6 border border-white/5">
          {videoSrc ? (
            <VideoPlayer
              src={videoSrc}
              title={product.name}
              aspectRatio="aspect-[4/3]"
              className="absolute inset-0"
            />
          ) : (
            <>
              <NeuralNetwork className="opacity-40" density={0.0002} />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0E]/40 via-transparent to-[#0A0A0E]/80" />
              <div className="absolute inset-0 grid place-items-center">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-12 h-12 rounded-full bg-[#C0392B]/90 grid place-items-center shadow-[0_0_24px_rgba(192,57,43,0.6)]"
                >
                  <Play size={15} fill="white" className="ml-0.5" />
                </motion.div>
              </div>
            </>
          )}

          {/* Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 glass rounded-full px-2.5 py-1 z-10">
            <Icon size={10} className="text-[#C0392B]" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/80">{product.tag}</span>
          </div>

          {/* Bullet pills */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
            {product.bullets.map((b) => (
              <span
                key={b}
                className="glass rounded-full px-2 py-0.5 font-mono text-[9px] tracking-widest text-white/70"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">
          PRODUCT 0{index + 1}
        </div>
        <h3 className="font-display text-2xl md:text-3xl mt-1 leading-none relative">
          <span className="relative">
            {product.name}
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#C0392B] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </span>
        </h3>
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{product.desc}</p>
      </GlassCard>
    </motion.div>
  );
}

export default function ProductShowcase() {
  const { t, i18n } = useTranslation();
  const items = t("products.items", { returnObjects: true });
  const lang = i18n.language?.startsWith("es") ? "es" : "en";

  return (
    <section className="relative py-32" data-testid="products-section">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          overline={t("products.overline")}
          title={t("products.title")}
          redWord={t("products.redWord")}
          body={t("products.body")}
        />

        {Array.isArray(items) && (
          <>
            {/* Desktop: 4 + 3 */}
            <div className="hidden lg:grid grid-cols-4 gap-6 mt-16">
              {items.slice(0, 4).map((p, i) => (
                <ProductCard key={i} product={p} index={i} total={4} lang={lang} />
              ))}
            </div>
            <div className="hidden lg:grid grid-cols-3 gap-6 mt-6 max-w-[calc(75%+1.5rem)] mx-auto">
              {items.slice(4).map((p, i) => (
                <ProductCard key={i + 4} product={p} index={i + 4} total={3} lang={lang} />
              ))}
            </div>

            {/* Tablet: 2 col grid */}
            <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 mt-16">
              {items.map((p, i) => (
                <ProductCard key={i} product={p} index={i} total={items.length} lang={lang} />
              ))}
            </div>

            {/* Mobile: horizontal carousel */}
            <div className="md:hidden mt-12 -mx-6 px-6 overflow-x-auto scrollbar-thin pb-4">
              <div className="flex gap-4" style={{ width: `${items.length * 280}px` }}>
                {items.map((p, i) => (
                  <div key={i} style={{ width: 260, flexShrink: 0 }}>
                    <ProductCard product={p} index={i} total={items.length} lang={lang} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
