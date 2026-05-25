import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const ConversationWidget = lazy(() =>
  import("@11labs/react").then((mod) => ({ default: mod.useConversation ? ElevenLabsInner : ElevenLabsInner }))
);

// Inner component that uses the hook — only rendered after lazy load
function ElevenLabsInner({ onClose }) {
  // Agent ID should be set via env var: REACT_APP_ELEVENLABS_AGENT_ID
  const agentId = process.env.REACT_APP_ELEVENLABS_AGENT_ID || "";

  if (!agentId) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-400 text-sm">
          ElevenLabs agent not configured.
          <br />
          Set <code className="text-[#C0392B]">REACT_APP_ELEVENLABS_AGENT_ID</code> in your environment.
        </p>
      </div>
    );
  }

  return (
    <elevenlabs-convai agent-id={agentId} style={{ width: "100%", height: "100%" }} />
  );
}

export default function ElevenLabsWidget() {
  const [open, setOpen] = useState(false);

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

              {/* Widget area */}
              <div className="flex-1 overflow-hidden">
                <Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <ElevenLabsInner onClose={() => setOpen(false)} />
                </Suspense>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
