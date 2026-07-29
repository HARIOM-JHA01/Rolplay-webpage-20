import { motion } from "framer-motion";
import { Brain, Target, ShieldCheck, Eye, BookOpen, Phone, BarChart3, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "@/components/GlassCard";
import NeuralNetwork from "@/components/NeuralNetwork";
import SectionHeader from "@/components/SectionHeader";
import VideoPlayer from "@/components/VideoPlayer";

// Keyed by the product's `id` in the locale files, never by `name` — names are
// translated, so name keys silently lose their assets in every other language.
const VIDEO_MAP = {
  "master-coach": { en: "/videos/master-coach-en.mp4", es: "/videos/master-coach-es.mp4" },
  "practice-simulator": { en: "/videos/simulator-en.mp4", es: "/videos/simulator-es.mp4" },
  "rolplay-sense": { en: "/videos/rolplay-sense-es.mp4", es: "/videos/rolplay-sense-es.mp4" },
  "second-brain": { en: "/videos/second-brain-es.mp4", es: "/videos/second-brain-es.mp4" },
  "callmentorai": { en: "/videos/callmentorai-es.mp4", es: "/videos/callmentorai-es.mp4" },
};

const POSTER_MAP = {
  "master-coach": { en: "/videos/posters/master-coach-en.jpg", es: "/videos/posters/master-coach-es.jpg" },
  "practice-simulator": { en: "/videos/posters/simulator-en.jpg", es: "/videos/posters/simulator-es.jpg" },
  "rolplay-sense": { en: "/videos/posters/rolplay-sense-es.jpg", es: "/videos/posters/rolplay-sense-es.jpg" },
  "second-brain": { en: "/videos/posters/second-brain-es.jpg", es: "/videos/posters/second-brain-es.jpg" },
  "callmentorai": { en: "/videos/posters/callmentorai-es.jpg", es: "/videos/posters/callmentorai-es.jpg" },
};

function getVideoSrc(productId, lang) {
  const videos = VIDEO_MAP[productId];
  if (!videos) return null;
  return videos[lang] || videos.es;
}

function getPosterSrc(productId, lang) {
  const posters = POSTER_MAP[productId];
  if (!posters) return null;
  return posters[lang] || posters.es;
}

const ICONS = [Brain, Target, ShieldCheck, Eye, BookOpen, Phone, BarChart3];

function ProductRow({ product, index, lang }) {
  const Icon = ICONS[index] || Brain;
  const videoSrc = getVideoSrc(product.id, lang);
  const posterSrc = getPosterSrc(product.id, lang);
  const reversed = index % 2 !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`product-card-${index}`}
      className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-14 lg:gap-20`}
    >
      {/* Media */}
      <div className="w-full md:w-1/2">
        <div className="aspect-[4/3] rounded-2xl relative overflow-hidden border border-white/5 group">
          {videoSrc ? (
            <VideoPlayer
              src={videoSrc}
              poster={posterSrc}
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
      </div>

      {/* Text */}
      <div className="w-full md:w-1/2">
        <GlassCard className="p-8 md:p-10 group cursor-pointer hover:border-[#C0392B]/30 transition-all duration-500">
          <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">
            PRODUCT 0{index + 1}
          </div>
          <h3 className="font-display text-3xl md:text-4xl mt-2 leading-none relative inline-block">
            <span className="relative">
              {product.name}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#C0392B] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </span>
          </h3>
          <p className="text-base text-zinc-400 mt-4 leading-relaxed">{product.desc}</p>
        </GlassCard>
      </div>
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
          <div className="flex flex-col gap-16 md:gap-24 mt-16">
            {items.map((p, i) => (
              <ProductRow key={i} product={p} index={i} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
