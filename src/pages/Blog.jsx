import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import PageShell from "@/components/PageShell";
import NeuralNetwork from "@/components/NeuralNetwork";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogSearchBar from "@/components/blog/BlogSearchBar";
import BlogTagFilter from "@/components/blog/BlogTagFilter";
import BlogPagination from "@/components/blog/BlogPagination";
import NewsletterForm from "@/components/blog/NewsletterForm";

const API_URL = process.env.REACT_APP_API_URL || '';

export default function Blog() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const tagFilter = searchParams.get("tags") || "";

  useEffect(() => {
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (tagFilter) params.tags = tagFilter;

    setLoading(true);
    Promise.all([
      axios.get(`${API_URL}/api/blogs`, { params }),
      axios.get(`${API_URL}/api/blogs/tags`),
    ])
      .then(([blogsRes, tagsRes]) => {
        setBlogs(blogsRes.data.data || []);
        setPagination(blogsRes.data.pagination || {});
        setTags(tagsRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, tagFilter]);

  return (
    <PageShell testid="blog-page">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <NeuralNetwork />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] tracking-[0.25em] text-[#C0392B] uppercase mb-4"
          >
            {t("blog.overline")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            {t("blog.heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#A1A1AA] max-w-lg mx-auto text-lg leading-relaxed"
          >
            {t("blog.heroBody")}
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <BlogSearchBar />
        </div>
        <BlogTagFilter tags={tags} />
      </section>

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#111115] border border-white/[0.06] rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <BlogGrid blogs={blogs} />
        )}
      </section>

      {/* Pagination */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-20">
        <BlogPagination currentPage={pagination.page} totalPages={pagination.totalPages} />
      </section>

      {/* Newsletter */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-24">
        <div className="bg-[#111115] border border-white/[0.06] rounded-2xl p-8 md:p-12 text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#C0392B] uppercase mb-3">{t("blog.newsletterLabel")}</p>
          <h2 className="text-2xl font-bold text-white mb-2">{t("blog.newsletterTitle")}</h2>
          <p className="text-[#A1A1AA] text-sm mb-6 max-w-sm mx-auto">{t("blog.newsletterBody")}</p>
          <div className="flex justify-center">
            <NewsletterForm source="blog" className="w-full max-w-sm" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
