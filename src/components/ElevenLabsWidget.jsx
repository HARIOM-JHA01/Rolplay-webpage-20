import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const agentId = process.env.REACT_APP_ELEVENLABS_AGENT_ID || "";

export default function ElevenLabsWidget() {
  const [open, setOpen] = useState(false);

  // Don't render the FAB at all if no agent is configured
  if (!agentId) return null;

  return (
    <>
      {/* FAB trigger */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.4, type: "spring", stiffness: 200 }}
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-[#C0392B] text-white grid place-items-center shadow-[0_0_30px_rgba(192,57,43,0.6)] hover:bg-[#E74C3C] transition-colors"
        data-testid="elevenlabs-fab"
      >
        <MessageCircle size={22} />
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-6 right-6 z-50 w-[360px] h-[520px] glass-strong rounded-2xl border border-[#C0392B]/30 flex flex-col overflow-hidden"
              data-testid="elevenlabs-panel"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div>
                  <div className="font-display text-lg">
                    <span className="text-[#C0392B]">Rol</span>Play AI
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">
                    Ask me anything
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full grid place-items-center text-zinc-400 hover:text-white hover:bg-white/10 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* ElevenLabs web component */}
              <div className="flex-1 overflow-hidden">
                <elevenlabs-convai
                  agent-id={agentId}
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
