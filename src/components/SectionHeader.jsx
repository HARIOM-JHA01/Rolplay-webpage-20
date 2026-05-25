import { motion } from "framer-motion";

export default function SectionHeader({ overline, title, redWord, body, align = "left" }) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  let titleNode = title;
  if (redWord && typeof title === "string") {
    const parts = title.split(redWord);
    titleNode = (
      <>
        {parts[0]}
        <span className="text-[#C0392B] text-glow-red">{redWord}</span>
        {parts[1]}
      </>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-3xl ${alignCls}`}
    >
      {overline && (
        <div className="font-mono text-[11px] tracking-[0.25em] text-[#C0392B] uppercase mb-5 flex items-center gap-3">
          <span className="w-8 h-px bg-[#C0392B]" />
          {overline}
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95] mb-5">
        {titleNode}
      </h2>
      {body && <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">{body}</p>}
    </motion.div>
  );
}
