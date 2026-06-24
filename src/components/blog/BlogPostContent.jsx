import { Eye, Clock, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./blog-content.css";
import ShareBar from "./ShareBar";
import LikeButton from "./LikeButton";

function formatDate(iso, locale) {
  if (!iso) return '';
  const lang = locale?.startsWith('es') ? 'es-MX' : 'en-US';
  return new Date(iso).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPostContent({ blog }) {
  const { t, i18n } = useTranslation();
  const showUpdated = blog.updatedAt && blog.updatedAt !== blog.createdAt;

  return (
    <article className="max-w-3xl mx-auto" data-testid="blog-post-content">
      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-mono tracking-wide bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
        {blog.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-[#71717A] font-mono mb-8 pb-8 border-b border-white/[0.06]">
        <span className="flex items-center gap-1.5">
          <Calendar size={13} />
          {formatDate(blog.createdAt, i18n.language)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} />
          {blog.readingTime} {t("blog.minRead")}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={13} />
          {blog.views ?? 0} {t("blog.views")}
        </span>
      </div>

      {/* Cover image */}
      {blog.coverImage && (
        <div className="mb-10 rounded-2xl overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full object-cover max-h-[480px]"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Last updated */}
      {showUpdated && (
        <p className="mt-12 text-xs text-[#52525B] font-mono">
          {t("blog.lastUpdated")} {formatDate(blog.updatedAt, i18n.language)}
        </p>
      )}

      {/* Share + Like bar */}
      <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ShareBar title={blog.title} slug={blog.slug} />
        <LikeButton slug={blog.slug} initialLikes={blog.likes ?? 0} />
      </div>
    </article>
  );
}
