import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });
  return (
    <motion.div
      data-testid="scroll-progress"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#C0392B] z-[100] origin-left shadow-[0_0_12px_rgba(192,57,43,0.7)]"
    />
  );
}
