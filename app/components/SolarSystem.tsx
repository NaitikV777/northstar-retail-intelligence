"use client";

/* eslint react/no-unknown-property: "off" -- Three.js scene elements use renderer-specific properties, not HTML attributes. */

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide, type Group } from "three";

const planets = [
  { name: "Sales", color: "#ffd097", radius: 1.25, size: 0.12, speed: 0.22, phase: 0.4 },
  { name: "Inventory", color: "#62e1cc", radius: 1.85, size: 0.2, speed: 0.16, phase: 2.8 },
  { name: "Products", color: "#819bff", radius: 2.5, size: 0.17, speed: 0.12, phase: 4.5 },
  { name: "Suppliers", color: "#deb9ff", radius: 3.15, size: 0.29, speed: 0.09, phase: 0.8 },
  { name: "Orders", color: "#ff96ac", radius: 3.85, size: 0.16, speed: 0.07, phase: 3.3 },
  { name: "Insights", color: "#62c9ff", radius: 4.5, size: 0.22, speed: 0.05, phase: 5.7 },
];

function Planet({ planet, moving }: { planet: typeof planets[number]; moving: boolean }) {
  const orbit = useRef<Group>(null);
  useFrame((_, delta) => {
    if (moving && orbit.current) orbit.current.rotation.y += Math.min(delta, 0.05) * planet.speed;
  });
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planet.radius - 0.006, planet.radius + 0.006, 160]} />
      <meshBasicMaterial color={planet.color} transparent opacity={0.22} side={DoubleSide} depthWrite={false} />
    </mesh>
    <group ref={orbit} rotation={[0, planet.phase, 0]}>
      <group position={[planet.radius, 0, 0]}>
        <mesh><sphereGeometry args={[planet.size, 32, 24]} /><meshStandardMaterial color={planet.color} roughness={0.48} metalness={0.16} emissive={planet.color} emissiveIntensity={0.12} /></mesh>
        {planet.name === "Suppliers" && <mesh rotation={[1.1, 0.3, 0.2]}>
          <ringGeometry args={[planet.size * 1.4, planet.size * 2.05, 80]} />
          <meshStandardMaterial color="#d6c5ed" transparent opacity={0.65} side={DoubleSide} />
        </mesh>}
      </group>
    </group>
  </group>;
}

function SystemScene({ moving }: { moving: boolean }) {
  return <>
    <ambientLight intensity={0.65} />
    <pointLight position={[0, 0.5, 0]} color="#ffdfb0" intensity={24} decay={1.4} />
    <directionalLight position={[3, 6, 5]} color="#aaa5ff" intensity={1.7} />
    <group rotation={[0.15, 0, -0.12]}>
      <mesh><sphereGeometry args={[0.62, 48, 32]} /><meshStandardMaterial color="#fff0c2" emissive="#ffb443" emissiveIntensity={2.2} toneMapped={false} /></mesh>
      {[0.73, 0.88, 1.02].map((radius, index) => <mesh key={radius}>
        <sphereGeometry args={[radius, 32, 24]} />
        <meshBasicMaterial color="#ffb952" transparent opacity={0.075 / (index + 1)} blending={AdditiveBlending} depthWrite={false} />
      </mesh>)}
      {planets.map(planet => <Planet key={planet.name} planet={planet} moving={moving} />)}
    </group>
  </>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p className="solar-fallback">One connected system.<br />Every part in balance.</p> : this.props.children;
  }
}

export default function SolarSystem() {
  const container = useRef<HTMLElement>(null);
  const [moving, setMoving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = container.current;
      if (!element) return;
      setMounted(true);
      const rect = element.getBoundingClientRect();
      const start = Math.max(0, rect.top + window.scrollY - window.innerHeight * 0.18);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(rect.height * 0.85, 1)));
      element.style.opacity = String(1 - progress * progress * (3 - 2 * progress));
      setMoving(!media.matches && !document.hidden && progress < 1 && rect.top < window.innerHeight);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    media.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  return <figure className="solar-system" ref={container} aria-label="A solar system representing a connected retail business">
    <div className="solar-heading"><span>NORTHSTAR AT THE CENTER</span><strong>Every part. One orbit.</strong></div>
    <div className="solar-canvas" aria-hidden="true"><SceneBoundary>
      {mounted && <Canvas camera={{ position: [0, 7.2, 8.5], fov: 52 }} dpr={[1, 1.5]} frameloop={moving ? "always" : "demand"} gl={{ alpha: true, antialias: true }} fallback={<p className="solar-fallback">One connected system.</p>}>
        <SystemScene moving={moving} />
      </Canvas>}
    </SceneBoundary></div>
    <figcaption><div className="solar-legend">{planets.map(planet => <span key={planet.name}><i style={{ background: planet.color }} />{planet.name}</span>)}</div><p>A shared rhythm for every part of your store.</p></figcaption>
  </figure>;
}
