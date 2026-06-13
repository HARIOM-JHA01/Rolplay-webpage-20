import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BlogTagFilter({ tags }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tags") || "";

  const select = (tag) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (activeTag === tag) {
        next.delete("tags");
      } else {
        next.set("tags", tag);
      }
      next.set("page", "1");
      return next;
    });
  };

  const clearAll = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("tags");
      next.set("page", "1");
      return next;
    });
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" data-testid="blog-tag-filter">
      <button
        onClick={clearAll}
        className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all duration-200 ${
          !activeTag
            ? "bg-[#C0392B] border-[#C0392B] text-white"
            : "bg-transparent border-white/[0.10] text-[#A1A1AA] hover:border-[#C0392B]/50 hover:text-white"
        }`}
        data-testid="blog-tag-all"
      >
        {t("blog.tagAll")}
      </button>
      {tags.map(({ tag, count }) => (
        <button
          key={tag}
          onClick={() => select(tag)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all duration-200 ${
            activeTag === tag
              ? "bg-[#C0392B] border-[#C0392B] text-white"
              : "bg-transparent border-white/[0.10] text-[#A1A1AA] hover:border-[#C0392B]/50 hover:text-white"
          }`}
          data-testid={`blog-tag-${tag}`}
        >
          {tag}
          <span className="ml-1.5 opacity-50">{count}</span>
        </button>
      ))}
    </div>
  );
}
