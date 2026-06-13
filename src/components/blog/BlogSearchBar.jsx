import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";

export default function BlogSearchBar() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");
  const debounceRef = useRef(null);

  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  const commit = (val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) {
        next.set("search", val);
      } else {
        next.delete("search");
      }
      next.set("page", "1");
      return next;
    });
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => commit(val), 300);
  };

  const clear = () => {
    setValue("");
    commit("");
  };

  return (
    <div className="relative w-full max-w-md">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={t("blog.searchPlaceholder")}
        className="w-full bg-[#111115] border border-white/[0.08] rounded-full pl-9 pr-9 py-2.5 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#C0392B]/50 transition-colors"
        data-testid="blog-search-input"
      />
      {value && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white transition-colors"
          aria-label={t("common.back")}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
