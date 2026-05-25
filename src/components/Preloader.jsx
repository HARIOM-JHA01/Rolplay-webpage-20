import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onLoad = () => setVisible(false);
    if (document.readyState === "complete") {
      // Already loaded — dismiss after brief frame
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-[#0A0A0E] flex items-center justify-center"
          aria-hidden="true"
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(192,57,43,0.18), transparent 60%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-8">
            {/* Logo mark */}
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 8px rgba(192,57,43,0.4))",
                  "drop-shadow(0 0 20px rgba(192,57,43,0.8))",
                  "drop-shadow(0 0 8px rgba(192,57,43,0.4))",
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 40 40" className="w-14 h-14">
                <g stroke="#C0392B" strokeWidth="1" fill="none" opacity="0.95">
                  <circle cx="20" cy="6" r="2.4" fill="#C0392B" />
                  <circle cx="6" cy="14" r="2" fill="#C0392B" />
                  <circle cx="34" cy="14" r="2" fill="#C0392B" />
                  <circle cx="10" cy="30" r="2" fill="#fff" />
                  <circle cx="30" cy="30" r="2" fill="#fff" />
                  <circle cx="20" cy="22" r="2.6" fill="#C0392B" />
                  <line x1="20" y1="6" x2="6" y2="14" />
                  <line x1="20" y1="6" x2="34" y2="14" />
                  <line x1="6" y1="14" x2="20" y2="22" />
                  <line x1="34" y1="14" x2="20" y2="22" />
                  <line x1="20" y1="22" x2="10" y2="30" />
                  <line x1="20" y1="22" x2="30" y2="30" />
                  <line x1="10" y1="30" x2="30" y2="30" strokeOpacity="0.3" />
                </g>
              </svg>
            </motion.div>

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-display text-3xl tracking-tight"
            >
              <span className="text-[#C0392B]">Rol</span>
              <span className="text-white">Play</span>
            </motion.div>

            {/* Scanning line */}
            <motion.div
              className="w-24 h-px overflow-hidden rounded-full bg-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-[#C0392B] rounded-full"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
