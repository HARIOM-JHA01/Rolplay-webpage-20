import { motion } from "framer-motion";

export default function PageShell({ children, testid }) {
  return (
    <motion.main
      data-testid={testid}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative pt-[72px]"
    >
      {children}
    </motion.main>
  );
}
