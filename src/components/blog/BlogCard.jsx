import { Link } from "react-router-dom";
import { Eye, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function stripHtml(html) {
  return html ? html.replace(/<[^>]+>/g, '') : '';
}

function formatDate(iso, locale) {
  if (!iso) return '';
  const lang = locale?.startsWith('es') ? 'es-MX' : 'en-US';
  return new Date(iso).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function BlogCard({ blog }) {
  const { t, i18n } = useTranslation();
  const displayTags = (blog.tags || []).slice(0, 3);
  const summary = stripHtml(blog.summary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        to={`/blog/${blog.slug}`}
        className="group block bg-[#111115] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#C0392B]/40 transition-all duration-300 hover:shadow-[0_0_24px_rgba(192,57,43,0.12)]"
        data-testid={`blog-card-${blog.slug}`}
      >
        {/* Cover image */}
        <div className="aspect-video overflow-hidden bg-[#0A0A0E]">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#C0392B]/10 flex items-center justify-center">
                <Tag size={24} className="text-[#C0392B]/40" />
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Tags */}
          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {displayTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-[#E74C3C] transition-colors duration-200">
            {blog.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-[#A1A1AA] line-clamp-3 mb-4 leading-relaxed">
            {summary}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[11px] text-[#71717A] font-mono">
            <span>{formatDate(blog.createdAt, i18n.language)}</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {blog.readingTime} {t("blog.minRead")}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {blog.views ?? 0}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
