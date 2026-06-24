import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Loader2 } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_URL = process.env.REACT_APP_API_URL || '';

function formatDate(iso, locale) {
  if (!iso) return '';
  const lang = locale?.startsWith('es') ? 'es-MX' : 'en-US';
  return new Date(iso).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' });
}

function Avatar({ name }) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[#C0392B]/15 border border-[#C0392B]/20 flex items-center justify-center shrink-0">
      <span className="font-mono text-[10px] text-[#C0392B]">{initials}</span>
    </div>
  );
}

export default function CommentsSection({ slug }) {
  const { t, i18n } = useTranslation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState({ name: "", email: "", body: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs/${slug}/comments`)
      .then(res => setComments(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const validate = () => {
    const errs = {};
    if (!fields.name.trim()) errs.name = t("blog.commentNameRequired");
    if (!fields.body.trim()) errs.body = t("blog.commentBodyRequired");
    return errs;
  };

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      const { data } = await axios.post(`${API_URL}/api/blogs/${slug}/comments`, {
        name: fields.name,
        email: fields.email || undefined,
        body: fields.body,
      });
      setComments(prev => [...prev, data.data]);
      setFields({ name: "", email: "", body: "" });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-[#0A0A0E] px-4 py-3 text-sm text-white " +
    "placeholder:text-[#3F3F46] focus:outline-none focus:border-[#C0392B]/50 transition-all duration-200";

  return (
    <section className="mt-16 pt-12 border-t border-white/[0.06]" data-testid="comments-section">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-8">
        <MessageSquare size={18} className="text-[#C0392B]" />
        {t("blog.comments")}
        {comments.length > 0 && (
          <span className="font-mono text-[11px] text-[#52525B] ml-1">({comments.length})</span>
        )}
      </h2>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4 mb-12">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-[#111115] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[#52525B] mb-12">{t("blog.noComments")}</p>
      ) : (
        <div className="space-y-6 mb-12">
          {comments.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex gap-3"
            >
              <Avatar name={c.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{c.name}</span>
                  <span className="font-mono text-[10px] text-[#52525B]">
                    {formatDate(c.createdAt, i18n.language)}
                  </span>
                </div>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">{c.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <div className="bg-[#111115] border border-white/[0.06] rounded-2xl p-6 md:p-8">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#C0392B] uppercase mb-5">
          {t("blog.leaveComment")}
        </p>

        <AnimatePresence>
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-sm text-emerald-400 mb-4"
            >
              {t("blog.commentSuccess")}
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-sm text-red-400 mb-4"
            >
              {t("blog.commentError")}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={fields.name}
                onChange={set("name")}
                placeholder={t("blog.commentName")}
                className={`${inputClass} ${errors.name ? "border-red-500/50" : ""}`}
                data-testid="comment-name"
              />
              {errors.name && (
                <p className="text-[11px] text-red-400 mt-1 font-mono">{errors.name}</p>
              )}
            </div>
            <input
              type="email"
              value={fields.email}
              onChange={set("email")}
              placeholder={t("blog.commentEmail")}
              className={inputClass}
              data-testid="comment-email"
            />
          </div>
          <div>
            <textarea
              value={fields.body}
              onChange={set("body")}
              rows={4}
              placeholder={t("blog.commentBody")}
              className={`${inputClass} resize-none leading-relaxed ${errors.body ? "border-red-500/50" : ""}`}
              data-testid="comment-body"
            />
            {errors.body && (
              <p className="text-[11px] text-red-400 mt-1 font-mono">{errors.body}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-[#C0392B] hover:bg-[#E74C3C] text-white text-sm font-semibold px-6 py-3 flex items-center gap-2 transition-all disabled:opacity-60"
              data-testid="comment-submit"
            >
              {status === "loading"
                ? <><Loader2 size={14} className="animate-spin" /> {t("blog.commentSubmitting")}</>
                : t("blog.commentSubmit")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
