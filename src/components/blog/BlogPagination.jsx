import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogPagination({ currentPage, totalPages }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = buildPageList(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5" data-testid="blog-pagination">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.08] text-[#A1A1AA] hover:border-[#C0392B]/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label={t("blog.prevPage")}
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-[#52525B] text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`w-8 h-8 rounded-full text-sm font-mono transition-all ${
              p === currentPage
                ? "bg-[#C0392B] border border-[#C0392B] text-white"
                : "border border-white/[0.08] text-[#A1A1AA] hover:border-[#C0392B]/50 hover:text-white"
            }`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.08] text-[#A1A1AA] hover:border-[#C0392B]/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label={t("blog.nextPage")}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

function buildPageList(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}
