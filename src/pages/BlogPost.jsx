import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

import PageShell from "@/components/PageShell";
import BlogPostContent from "@/components/blog/BlogPostContent";
import RelatedArticles from "@/components/blog/RelatedArticles";
import NewsletterForm from "@/components/blog/NewsletterForm";

const API_URL = process.env.REACT_APP_API_URL || '';

export default function BlogPost() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/blogs/${slug}`)
      .then((res) => {
        setBlog(res.data.data);
        axios.post(`${API_URL}/api/blogs/${slug}/view`).catch(() => {});
        return axios.get(`${API_URL}/api/blogs/${slug}/related`);
      })
      .then((res) => {
        setRelated(res.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          navigate("/blog", { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | RolPlay Blog`;
    }
    return () => { document.title = "RolPlay"; };
  }, [blog]);

  if (loading) {
    return (
      <PageShell testid="blog-post-page">
        <div className="max-w-3xl mx-auto px-6 py-32 space-y-4">
          <div className="h-8 bg-[#111115] rounded-full animate-pulse w-2/3" />
          <div className="h-5 bg-[#111115] rounded-full animate-pulse w-1/2" />
          <div className="h-64 bg-[#111115] rounded-2xl animate-pulse mt-8" />
        </div>
      </PageShell>
    );
  }

  if (!blog) return null;

  return (
    <PageShell testid="blog-post-page">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-24">
        <BlogPostContent blog={blog} />
        <RelatedArticles articles={related} />

        {/* Newsletter CTA */}
        <section className="mt-16 pt-12 border-t border-white/[0.06]">
          <div className="max-w-md">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#C0392B] uppercase mb-2">{t("blog.newsletterLabel")}</p>
            <h3 className="text-lg font-semibold text-white mb-2">{t("blog.enjoyedPost")}</h3>
            <p className="text-sm text-[#A1A1AA] mb-4">{t("blog.getArticles")}</p>
            <NewsletterForm source="blog" />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
