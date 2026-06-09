import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MicOff, X, PhoneOff } from "lucide-react";
import { useConversation } from "@11labs/react";
import { useTranslation } from "react-i18next";

/* ── Custom AI voice waveform icon ───────────────────────── */
const WaveformIcon = ({ size = 26, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* 5 bars — outer short, inner tall, center tallest */}
    <rect x="1"  y="9"  width="2.8" height="6"  rx="1.4" fill="currentColor" />
    <rect x="5.3" y="5" width="2.8" height="14" rx="1.4" fill="currentColor" />
    <rect x="9.6" y="1" width="2.8" height="22" rx="1.4" fill="currentColor" />
    <rect x="13.9" y="5" width="2.8" height="14" rx="1.4" fill="currentColor" />
    <rect x="18.2" y="9" width="2.8" height="6"  rx="1.4" fill="currentColor" />
  </svg>
);

const AGENT_ID = process.env.REACT_APP_ELEVENLABS_AGENT_ID || "";

function VoicePanel({ onClose }) {
  const { t, i18n } = useTranslation();
  const conversation = useConversation({
    onError: (err) => console.error("ElevenLabs:", err),
  });

  const { status, isSpeaking } = conversation;
  const isConnected  = status === "connected";
  const isConnecting = status === "connecting";

  // Detect active language: "es" → Spanish, anything else → English
  const voiceLang = i18n.language?.startsWith("es") ? "es" : "en";

  const handleStart = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Attempt to pass the language override (requires the ElevenLabs agent to have
      // multilingual mode enabled in the ElevenLabs dashboard).
      // If the override causes a rejection, fall back to the agent's default language.
      try {
        await conversation.startSession({
          agentId: AGENT_ID,
          overrides: {
            agent: { language: voiceLang },
          },
        });
      } catch {
        await conversation.startSession({ agentId: AGENT_ID });
      }
    } catch (err) {
      console.error("Mic / session error:", err);
    }
  }, [conversation, voiceLang]);

  const handleStop = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleClose = useCallback(async () => {
    if (isConnected || isConnecting) await conversation.endSession();
    onClose();
  }, [conversation, isConnected, isConnecting, onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 right-6 z-50 w-[300px] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
        data-testid="elevenlabs-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <img src="/logo.png" alt="RolPlay" className="h-7 w-auto" />
            <div className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase mt-1">
              {t("voice.title")}
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full grid place-items-center text-zinc-400 hover:text-zinc-900 hover:bg-gray-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Voice UI */}
        <div className="flex flex-col items-center gap-6 py-10 px-6">

          {/* Animated orb */}
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* Outer pulse rings when connected */}
            {isConnected && (
              <>
                <motion.div
                  className="absolute w-24 h-24 rounded-full border border-[#C0392B]/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-24 h-24 rounded-full border border-[#C0392B]/20"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
              </>
            )}

            {/* Core orb */}
            <motion.div
              animate={
                isConnected && isSpeaking
                  ? { scale: [1, 1.12, 1], boxShadow: ["0 0 30px rgba(192,57,43,0.5)", "0 0 60px rgba(192,57,43,0.8)", "0 0 30px rgba(192,57,43,0.5)"] }
                  : {}
              }
              transition={{ duration: 0.7, repeat: Infinity }}
              className={`relative w-20 h-20 rounded-full grid place-items-center transition-colors duration-500 ${
                isConnected
                  ? "bg-[#C0392B]"
                  : "bg-gray-100 border border-gray-200"
              }`}
              style={isConnected ? { boxShadow: "0 0 30px rgba(192,57,43,0.5)" } : {}}
            >
              {isConnecting ? (
                <div className="w-6 h-6 border-2 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
              ) : isConnected ? (
                isSpeaking
                  ? <WaveformIcon size={28} className="text-white" />
                  : <MicOff size={28} className="text-white/70" />
              ) : (
                <WaveformIcon size={28} className="text-zinc-500" />
              )}
            </motion.div>
          </div>

          {/* Status label */}
          <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase text-center min-h-[16px]">
            {isConnecting && t("voice.connecting")}
            {isConnected && (isSpeaking ? t("voice.agentSpeaking") : t("voice.listening"))}
            {!isConnected && !isConnecting && t("voice.tapToStart")}
          </div>

          {/* Action button */}
          {isConnected || isConnecting ? (
            <button
              onClick={handleStop}
              disabled={isConnecting}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-gray-100 border border-gray-200 text-zinc-700 text-sm font-semibold hover:bg-red-50 hover:border-[#C0392B]/40 hover:text-[#C0392B] transition-all disabled:opacity-50"
            >
              <PhoneOff size={15} />
              {t("voice.endCall")}
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#C0392B] text-white text-sm font-semibold hover:bg-[#E74C3C] transition-colors shadow-[0_0_24px_rgba(192,57,43,0.4)]"
            >
              <WaveformIcon size={15} className="text-white" />
              {t("voice.startConversation")}
            </button>
          )}

          <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
            {t("voice.micNote")}
          </p>
        </div>
      </motion.div>
    </>
  );
}

export default function ElevenLabsWidget() {
  const [open, setOpen] = useState(false);

  if (!AGENT_ID) return null;

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.4, type: "spring", stiffness: 200 }}
        onClick={() => setOpen(true)}
        aria-label="Open AI voice assistant"
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-[#C0392B] text-white grid place-items-center shadow-[0_0_30px_rgba(192,57,43,0.6)] hover:bg-[#E74C3C] transition-colors"
        data-testid="elevenlabs-fab"
      >
        <WaveformIcon size={22} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {open && <VoicePanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
