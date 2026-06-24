import { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_URL = process.env.REACT_APP_API_URL || '';

function hasLiked(slug) {
  try { return localStorage.getItem(`liked_${slug}`) === "1"; } catch { return false; }
}

function setLiked(slug) {
  try { localStorage.setItem(`liked_${slug}`, "1"); } catch { /* noop */ }
}

export default function LikeButton({ slug, initialLikes = 0, onClick }) {
  const { t } = useTranslation();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLikedState] = useState(() => hasLiked(slug));
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked || loading) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/blogs/${slug}/like`);
      setLikes(data.likes);
      setLikedState(true);
      setLiked(slug);
      onClick?.();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={liked || loading}
      aria-label={liked ? t("blog.liked") : t("blog.like")}
      className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors duration-200 ${
        liked
          ? "text-[#C0392B]"
          : "text-[#71717A] hover:text-[#C0392B]"
      } disabled:cursor-default`}
      data-testid={`like-btn-${slug}`}
    >
      <Heart
        size={13}
        className={liked ? "fill-[#C0392B] text-[#C0392B]" : ""}
      />
      <span>{likes}</span>
    </button>
  );
}
