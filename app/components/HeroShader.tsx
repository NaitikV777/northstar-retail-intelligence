"use client";

import { useEffect, useRef, useState } from "react";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export default function HeroShader() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.05 });
    if (shellRef.current) observer.observe(shellRef.current);

    return () => {
      media.removeEventListener("change", updateMotion);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="hero-shader" ref={shellRef} aria-hidden="true">
      <ShaderGradientCanvas pixelDensity={0.85} fov={45} lazyLoad>
        <ShaderGradient
          animate={isVisible && !reduceMotion ? "on" : "off"}
          type="waterPlane"
          color1="#1a103c"
          color2="#7559ff"
          color3="#34d8c7"
          uSpeed={0.16}
          uStrength={2.8}
          uDensity={1.15}
          uFrequency={4.2}
          grain="on"
          grainBlending={0.12}
          brightness={1.05}
          cDistance={3.5}
          cPolarAngle={90}
          cAzimuthAngle={180}
          cameraZoom={1}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
