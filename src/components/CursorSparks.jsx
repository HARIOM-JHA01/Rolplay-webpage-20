import { useEffect } from "react";

/**
 * Global cursor spark effect — spawns glowing red particles on every click.
 * Uses the Web Animations API (no extra dependencies).
 * Renders nothing to the DOM itself; particles are appended/removed dynamically.
 */
const COLORS = ["#C0392B", "#E74C3C", "#FF6B5B", "#ff4433"];

export default function CursorSparks() {
  useEffect(() => {
    const spawn = (e) => {
      const count = 10;

      for (let i = 0; i < count; i++) {
        const spark = document.createElement("span");

        const size = 3 + Math.random() * 6;
        // Spread angle slightly randomised so it never looks mechanical
        const angle =
          (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const dist = 20 + Math.random() * 55;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const dur = 380 + Math.random() * 280;

        Object.assign(spark.style, {
          position:      "fixed",
          left:          `${e.clientX}px`,
          top:           `${e.clientY}px`,
          width:         `${size}px`,
          height:        `${size}px`,
          borderRadius:  "50%",
          background:    color,
          pointerEvents: "none",
          zIndex:        "99999",
          // Start centred on the cursor
          transform:     "translate(-50%, -50%)",
          boxShadow:     `0 0 ${size * 2.5}px ${color}99`,
          willChange:    "transform, opacity",
        });

        document.body.appendChild(spark);

        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        const anim = spark.animate(
          [
            {
              transform: "translate(-50%, -50%) scale(1)",
              opacity: 1,
            },
            {
              transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`,
              opacity: 0,
            },
          ],
          {
            duration: dur,
            easing:   "cubic-bezier(0.25, 0, 0.1, 1)",
            fill:     "forwards",
          }
        );

        anim.onfinish = () => spark.remove();
      }

      // Central flash ring
      const ring = document.createElement("span");
      Object.assign(ring.style, {
        position:      "fixed",
        left:          `${e.clientX}px`,
        top:           `${e.clientY}px`,
        width:         "6px",
        height:        "6px",
        borderRadius:  "50%",
        border:        "1.5px solid #C0392B",
        pointerEvents: "none",
        zIndex:        "99999",
        transform:     "translate(-50%, -50%)",
        willChange:    "transform, opacity",
      });
      document.body.appendChild(ring);

      ring.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 0.9 },
          { transform: "translate(-50%, -50%) scale(8)", opacity: 0 },
        ],
        { duration: 500, easing: "ease-out", fill: "forwards" }
      ).onfinish = () => ring.remove();
    };

    document.addEventListener("click", spawn);
    return () => document.removeEventListener("click", spawn);
  }, []);

  return null;
}
