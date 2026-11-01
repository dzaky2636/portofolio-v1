"use client";

import { useState, useEffect } from "react";

export default function InteractiveBackground() {
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#F4F3ED]">
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "multiply", opacity: 0.08 }}
        aria-hidden="true"
      >
        <filter id="weirdcore-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#weirdcore-noise)" />
      </svg>

      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <pattern
            id="weirdcore-drafting-grid"
            x="10"
            y="10"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path d="M200 0H0V200" stroke="#0C0C0C" strokeOpacity="0.08" fill="none" />
            <path d="M92 100H108M100 92V108" stroke="#0C0C0C" strokeOpacity="0.2" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#weirdcore-drafting-grid)" />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0C0C0C 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          WebkitMaskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.25) 100%)`,
          maskImage: `radial-gradient(circle 350px at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.25) 100%)`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}
