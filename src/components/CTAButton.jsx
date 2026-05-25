import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function PrimaryCTA({ children, href, onClick, icon = true, external = false, testid }) {
  const Tag = href ? "a" : "button";
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
      <Tag
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-testid={testid}
        className="group relative inline-flex items-center gap-2 rounded-full bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-semibold px-7 py-3.5 transition-all duration-500 shadow-[0_0_24px_rgba(192,57,43,0.45)] hover:shadow-[0_0_50px_rgba(192,57,43,0.7)]"
      >
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 60%)" }}
        />
        <span className="relative">{children}</span>
        {icon && <ArrowRight size={15} className="relative transition-transform group-hover:translate-x-1" />}
      </Tag>
    </motion.div>
  );
}

export function GhostCTA({ children, href, onClick, external = false, testid }) {
  const Tag = href ? "a" : "button";
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
      <Tag
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-testid={testid}
        className="group inline-flex items-center gap-2 rounded-full glass text-white text-sm font-semibold px-7 py-3.5 transition-all duration-500 hover:border-[#C0392B]/50 hover:shadow-[0_0_30px_rgba(192,57,43,0.25)]"
      >
        <span>{children}</span>
        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Tag>
    </motion.div>
  );
}
