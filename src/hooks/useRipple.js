import { useCallback } from "react";

/**
 * Returns an onClick handler that spawns a CSS ripple at the click point.
 * Pass the returned handler to any element's onClick.
 * The ripple element is pointer-events:none and self-destructs after animation.
 */
export function useRipple(color = "rgba(192,57,43,0.35)") {
  return useCallback(
    (e) => {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        left:${x}px;
        top:${y}px;
        border-radius:50%;
        background:${color};
        pointer-events:none;
        transform:scale(0);
        animation:rolplay-ripple 600ms ease-out forwards;
      `;

      // Ensure parent can clip
      const prevPosition = target.style.position;
      const prevOverflow = target.style.overflow;
      if (getComputedStyle(target).position === "static") {
        target.style.position = "relative";
      }
      target.style.overflow = "hidden";

      target.appendChild(ripple);

      ripple.addEventListener("animationend", () => {
        ripple.remove();
        // Restore only if we changed them
        if (!prevPosition) target.style.position = "";
        if (!prevOverflow) target.style.overflow = "";
      });
    },
    [color]
  );
}
