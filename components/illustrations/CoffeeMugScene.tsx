"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface CoffeeMugSceneProps {
  readonly className?: string;
}

// Brand tokens (app/globals.css) — kept as plain hex since three.js
// materials can't read CSS custom properties directly. NAVY is
// deliberately brighter than the site's --color-primary (#0f172a): that
// hex is fine as a flat CSS swatch, but under real-time PBR lighting a
// base color that dark reads as near-black, not navy — see the screenshot
// bug this is fixing.
const NAVY = "#1e3a6b";
const GOLD = "#f4b942";
const COFFEE = "#2b1810";
const CREMA = "#c9a26a";

/**
 * Draws the "PT" monogram onto an offscreen canvas at runtime, so the
 * scene doesn't need to ship an extra image asset. This is a stylised
 * approximation of the uploaded artwork (bold "P" + "T"), not a pixel copy.
 * Swap this out for `useTexture("/images/tp-logo.png")` from drei if you
 * have the real vector logo and want an exact match.
 */
// function useLogoTexture() {
//   const [texture, setTexture] = React.useState<THREE.CanvasTexture | null>(
//     null,
//   );

//   React.useEffect(() => {
//     const canvas = document.createElement("canvas");
//     canvas.width = 512;
//     canvas.height = 512;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     ctx.clearRect(0, 0, 512, 512);
//     ctx.fillStyle = GOLD;
//     ctx.font = "900 260px system-ui, sans-serif";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     // Wide spacing so the two glyphs never touch — they were overlapping
//     // into an unreadable blob at the old 175/340 positions.
//     ctx.fillText("P", 150, 270);
//     ctx.fillText("T", 362, 270);

//     const tex = new THREE.CanvasTexture(canvas);
//     tex.colorSpace = THREE.SRGBColorSpace;
//     tex.needsUpdate = true;
//     setTexture(tex);

//     return () => tex.dispose();
//   }, []);

//   return texture;
// }

import { useTexture } from "@react-three/drei";

function useLogoTexture() {
  // Configure the texture in `onLoad` rather than an effect: the value comes
  // back from drei's cache, so mutating it after render is both a lint error
  // (`react-hooks/immutability`) and a race with the first frame.
  //
  // Deliberately no `dispose()` on unmount either — `useTexture` caches by
  // URL and hands the same instance to every consumer, so disposing it here
  // would blank the logo for any later mount (navigate away and back).
  return useTexture("/logo.png", (texture) => {
    const map = Array.isArray(texture) ? texture[0] : texture;
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
  });
}

/** Soft radial-gradient sprite used for the steam wisps. */
function useSteamTexture() {
  // Built with `useMemo`, not state-in-an-effect: this is a pure computation
  // from no inputs, so there is nothing to synchronise with and the old
  // effect just forced a second render (`react-hooks/set-state-in-effect`).
  //
  // `document` is safe to touch here because the whole scene is loaded with
  // `dynamic(..., { ssr: false })` from HeroSection, so this only ever runs
  // in the browser.
  const texture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,0.55)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.18)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // This texture is created here rather than shared from a cache, so this
  // component owns it and must release its GPU memory on unmount.
  React.useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  return texture;
}

const STEAM_COUNT = 5;

function Steam({ reduced }: { reduced: boolean }) {
  const texture = useSteamTexture();
  const refs = React.useRef<(THREE.Sprite | null)[]>([]);
  const phases = React.useMemo(
    () =>
      Array.from(
        { length: STEAM_COUNT },
        (_, i) => (i / STEAM_COUNT) * Math.PI * 2,
      ),
    [],
  );

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((sprite, i) => {
      if (!sprite) return;
      const phase = phases[i];
      const progress = (t * 0.35 + phase / (Math.PI * 2)) % 1;
      sprite.position.y = 0.75 + progress * 1.5;
      sprite.position.x = Math.sin(t * 0.8 + phase) * 0.12;
      sprite.position.z = Math.cos(t * 0.6 + phase) * 0.08;
      const fade = Math.sin(progress * Math.PI);
      const material = sprite.material as THREE.SpriteMaterial;
      material.opacity = fade * 0.5;
      const scale = 0.5 + progress * 0.6;
      sprite.scale.set(scale, scale, 1);
    });
  });

  if (!texture) return null;

  return (
    <group>
      {phases.map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[0, 0.75 + (i / STEAM_COUNT) * 1.5, 0]}
        >
          <spriteMaterial
            map={texture}
            transparent
            opacity={reduced ? 0.12 : 0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

function Mug({ reduced }: { reduced: boolean }) {
  const groupRef = React.useRef<THREE.Group>(null);
  const logoTexture = useLogoTexture();

  useFrame(({ pointer }) => {
    const group = groupRef.current;
    if (!group || reduced) return;
    const targetY = pointer.x * 0.35;
    const targetX = -pointer.y * 0.15;
    group.rotation.y += (targetY - group.rotation.y) * 0.05;
    group.rotation.x += (targetX - group.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]} rotation={[0.1, -0.4, 0]}>
      {/* Body wall — open top and bottom, so the coffee disc and the
          bottom cap can be dropped in as separate flat pieces. */}
      <mesh castShadow>
        <cylinderGeometry args={[1, 0.86, 1.7, 48, 1, true]} />
        <meshPhysicalMaterial
          color={NAVY}
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
        {logoTexture ? (
          // A plain plane sitting just proud of the surface, instead of
          // drei's <Decal>. Decal auto-computes its own rotation from the
          // nearest surface normal, which on a curved cylinder landed the
          // logo rotated/warped unpredictably. A flat plane with an
          // explicit (identity) rotation is boring but reliable — the
          // camera is close to front-on here, so the lack of curvature
          // wrap isn't noticeable.
          <mesh position={[0, -0.05, 0.99]}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshBasicMaterial
              map={logoTexture}
              transparent
              alphaTest={0.4}
              depthWrite
              polygonOffset
              polygonOffsetFactor={-4}
            />
          </mesh>
        ) : null}
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.86, 48]} />
        <meshPhysicalMaterial
          color={NAVY}
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Foot ring — small raised base most ceramic mugs actually have,
          instead of the body wall meeting the bottom cap as a hard edge. */}
      <mesh position={[0, -0.83, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.025, 12, 40]} />
        <meshPhysicalMaterial
          color={NAVY}
          roughness={0.3}
          metalness={0.05}
          clearcoat={0.5}
          clearcoatRoughness={0.25}
        />
      </mesh>

      {/* Rim lip */}
      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.035, 16, 48]} />
        <meshPhysicalMaterial
          color={NAVY}
          roughness={0.2}
          metalness={0.05}
          clearcoat={0.7}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Coffee surface */}
      <mesh position={[0, 0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 48]} />
        <meshPhysicalMaterial
          color={COFFEE}
          roughness={0.3}
          metalness={0.1}
          clearcoat={0.4}
        />
      </mesh>

      {/* Crema ring — thin lighter-toned ring at the coffee's edge, like
          the highlight visible in the reference photo. */}
      <mesh position={[0, 0.782, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.88, 0.94, 48]} />
        <meshBasicMaterial color={CREMA} transparent opacity={0.55} />
      </mesh>

      {/* Handle — rotated around Z, not Y. Rotating a torus around Y
          reorients its whole ring into a plane with no X variation, so it
          can never actually reach the surface no matter where it's
          positioned (that was the floating-handle bug). Rotating around Z
          instead just spins the open ends of the "C" to face the mug,
          keeping the ring's natural bulge-in-X shape. Position is nudged
          slightly further in than the tangent point so the tips overlap
          into the wall — a small intentional overlap reads as "attached";
          an exact tangent risks a visible hairline gap. */}
      <mesh position={[1.1, 0.05, 0]} rotation={[0, 0, (-3 * Math.PI) / 4]}>
        <torusGeometry args={[0.42, 0.11, 16, 32, Math.PI * 1.5]} />
        <meshPhysicalMaterial
          color={NAVY}
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      <Steam reduced={reduced} />
    </group>
  );
}

function Saucer() {
  return (
    <group position={[0, -1.65, 0]} scale={0.7}>
      <mesh receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 0.12, 48]} />
        <meshPhysicalMaterial
          color={NAVY}
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.045, 16, 48]} />
        <meshPhysicalMaterial
          color={NAVY}
          roughness={0.2}
          metalness={0.05}
          clearcoat={0.7}
          clearcoatRoughness={0.15}
        />
      </mesh>
      {/* Cheap fake contact shadow instead of a real shadow map, so the
          scene stays light on lower-end devices. */}
      <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Scene() {
  const reduced = Boolean(useReducedMotion());
  // Built from primitives in the three package itself — no network
  // fetch, unlike drei's HDR presets (which failed to load for you,
  // likely a CDN reachability issue rather than anything wrong with the
  // scene setup). Same PMREM-reflection technique, just generated
  // on-device instead of downloaded.
  const roomEnvironment = React.useMemo(() => new RoomEnvironment(), []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={1.6} />
      <directionalLight position={[-3, 1, -2]} intensity={0.5} />
      <pointLight position={[-2.5, 1, -1.5]} intensity={1.1} color={GOLD} />
      <pointLight position={[2.5, 0.5, -2]} intensity={0.6} color="#7dd3fc" />
      <Environment environmentIntensity={0.6}>
        <primitive object={roomEnvironment} />
      </Environment>
      <Float
        enabled={!reduced}
        speed={1.4}
        rotationIntensity={0.15}
        floatIntensity={0.6}
      >
        <Mug reduced={reduced} />
      </Float>
      <Saucer />
    </>
  );
}

/**
 * Interactive three.js hero centerpiece: a navy-and-gold ceramic mug with
 * a "PT" decal and drifting steam, replacing the flat SVG RobotMascot.
 * Rotates gently toward the pointer and idles with a soft float — both
 * disabled under prefers-reduced-motion, where it renders as a still
 * scene instead. Mounted client-only via `next/dynamic` (see
 * HeroSection.tsx) since three.js touches the DOM/WebGL at module load.
 */
function CoffeeMugScene({ className }: CoffeeMugSceneProps) {
  return (
    <div className={cn("relative aspect-square", className)}>
      <Canvas
        flat
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 7.2], fov: 36 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export { CoffeeMugScene };
