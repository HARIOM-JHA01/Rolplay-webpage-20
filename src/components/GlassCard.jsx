import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Glass card with subtle 3D tilt on mouse move.
 */
export default function GlassCard({ children, className = "", tilt = true, ...rest }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18 });
  const sy = useSpring(y, { stiffness: 150, damping: 18 });
  const rotX = useTransform(sy, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotY = useTransform(sx, [-0.5, 0.5], ["-6deg", "6deg"]);

  const onMove = (e) => {
    if (!tilt) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={tilt ? { rotateX: rotX, rotateY: rotY, transformPerspective: 1200 } : undefined}
      className={`relative glass rounded-2xl overflow-hidden transition-[border-color,box-shadow] duration-500 hover:border-[#C0392B]/40 hover:shadow-[0_0_50px_-15px_rgba(192,57,43,0.5)] ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
