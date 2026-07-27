import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

/**
 * Reusable, lazy-loaded, IntersectionObserver-aware video wrapper.
 *
 * Props:
 *  src        – URL of self-hosted video (mp4)
 *  iframeSrc  – URL for iframe embed (YouTube / Vimeo / etc.)
 *  poster     – poster image URL
 *  title      – accessible title
 *  aspectRatio – Tailwind aspect class, default "aspect-video"
 *  autoplay   – muted autoplay when in viewport (default false for iframes)
 *  className  – additional wrapper classes
 */
export default function VideoPlayer({
  src,
  iframeSrc,
  poster,
  title = "Video",
  aspectRatio = "aspect-video",
  autoplay = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  // IntersectionObserver — lazy load + pause when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Autoplay native video when in view — only auto-play, don't force-restart if user paused
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoplay) return;
    if (inView && !playing) {
      video.play().catch(() => {});
    } else if (!inView) {
      video.pause();
    }
  }, [inView, autoplay, playing]);

  // For iframe embeds, only render the iframe after click (save bandwidth)
  const [iframeActive, setIframeActive] = useState(false);

  if (iframeSrc) {
    return (
      <div
        ref={containerRef}
        className={`relative ${aspectRatio} w-full overflow-hidden rounded-2xl bg-[#0A0A0E] ${className}`}
      >
        {!iframeActive && (
          <>
            {poster && (
              <img
                src={poster}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E]/80 to-transparent" />
            <button
              onClick={() => setIframeActive(true)}
              aria-label={`Play ${title}`}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
            >
              <span className="w-20 h-20 rounded-full bg-[#C0392B] grid place-items-center shadow-[0_0_40px_rgba(192,57,43,0.6)] group-hover:scale-110 transition-transform duration-300">
                <Play size={28} fill="white" className="ml-1" />
              </span>
              {title && (
                <span className="font-mono text-[11px] tracking-[0.2em] text-white/70 uppercase">
                  {title}
                </span>
              )}
            </button>
          </>
        )}
        {iframeActive && inView && (
          <iframe
            src={`${iframeSrc}${iframeSrc.includes("?") ? "&" : "?"}autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
    );
  }

  // Native <video> path
  return (
    <div
      ref={containerRef}
      className={`relative ${aspectRatio} w-full overflow-hidden rounded-2xl bg-[#0A0A0E] ${className}`}
    >
      {inView ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={autoplay}
          playsInline
          loop={autoplay}
          controls={!autoplay}
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) {
              v.muted = false;
              v.play();
            } else {
              v.pause();
            }
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : (
        poster && (
          <img
            src={poster}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )
      )}
      {!autoplay && !playing && (
        <button
          onClick={() => {
            const v = videoRef.current;
            if (v) {
              v.muted = false;
              v.play();
            }
          }}
          aria-label={`Play ${title}`}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <span className="w-20 h-20 rounded-full bg-[#C0392B] grid place-items-center shadow-[0_0_40px_rgba(192,57,43,0.6)] group-hover:scale-110 transition-transform duration-300">
            <Play size={28} fill="white" className="ml-1" />
          </span>
        </button>
      )}
    </div>
  );
}
