"use client";

import { useEffect, useState } from "react";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export default function HeroShader() {
  const [isActive, setIsActive] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);
    const updateVisibility = () => setIsActive(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return (
    <div className="hero-shader" aria-hidden="true">
      <ShaderGradientCanvas pixelDensity={0.85} fov={45} lazyLoad>
        <ShaderGradient
          animate={isActive && !reduceMotion ? "on" : "off"}
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
