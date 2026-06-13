import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

function formatDate(iso, locale) {
  if (!iso) return '';
  const lang = locale?.startsWith('es') ? 'es-MX' : 'en-US';
  return new Date(iso).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function RelatedArticles({ articles }) {
  const { t, i18n } = useTranslation();

  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/[0.06]" data-testid="related-articles">
      <h2 className="text-lg font-semibold text-white mb-6">{t("blog.relatedArticles")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/blog/${article.slug}`}
            className="group p-4 rounded-xl bg-[#111115] border border-white/[0.06] hover:border-[#C0392B]/40 transition-all duration-200"
          >
            {(article.tags || []).slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block mr-1.5 mb-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20"
              >
                {tag}
              </span>
            ))}
            <p className="text-sm font-medium text-white line-clamp-2 mb-2 group-hover:text-[#E74C3C] transition-colors">
              {article.title}
            </p>
            <span className="flex items-center gap-1 text-[11px] text-[#52525B] font-mono">
              <Calendar size={11} />
              {formatDate(article.createdAt, i18n.language)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
