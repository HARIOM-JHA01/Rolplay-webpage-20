import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppOrb() {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="https://wa.me/15797986707?text=Como%20funciona%20Rolplay?"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-testid="whatsapp-orb"
    >
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden md:block px-3 py-2 text-xs font-mono tracking-wider glass rounded-full text-white whitespace-nowrap"
          >
            CHAT ON WHATSAPP
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full grid place-items-center text-white animate-pulse-green"
        style={{
          background: "linear-gradient(135deg, #25D366, #128C7E)",
        }}
      >
        <MessageCircle size={22} fill="white" strokeWidth={1.5} />
      </motion.span>
    </a>
  );
}
