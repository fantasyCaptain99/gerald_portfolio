"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Deterministic helpers                                               */
/* ------------------------------------------------------------------ */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const COLORS = {
  grass: new THREE.Color("#2f8f78"),
  grassDark: new THREE.Color("#24705f"),
  rock: new THREE.Color("#2a3352"),
  rockDark: new THREE.Color("#1b2138"),
  leaf: new THREE.Color("#46c79f"),
  leaf2: new THREE.Color("#2fa186"),
  trunk: new THREE.Color("#6b4b3a"),
  stone: new THREE.Color("#c9d3e6"),
  roof: new THREE.Color("#ff52b8"),
  crystal: new THREE.Color("#79E8D0"),
  water: new THREE.Color("#8fdcff"),
  accent: new THREE.Color("#8E9EFF"),
};

/** Pointer state shared via ref (window-level so the whole hero is reactive). */
type PointerRef = React.RefObject<{ x: number; y: number }>;

/* ------------------------------------------------------------------ */
/* Island                                                              */
/* ------------------------------------------------------------------ */
function useIslandAssets() {
  const assets = useMemo(() => {
    // Grass top: low-poly disc with slight height noise
    const top = new THREE.CylinderGeometry(2.6, 2.45, 0.42, 9, 2);
    const tp = top.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < tp.count; i++) {
      const y = tp.getY(i);
      if (y > 0.1) tp.setY(i, y + (rand(i * 3.1) - 0.5) * 0.12);
    }
    top.computeVertexNormals();

    // Rock underside: inverted jittered cone
    const rock = new THREE.ConeGeometry(2.45, 3.1, 9, 4);
    rock.rotateX(Math.PI);
    rock.translate(0, -1.75, 0);
    const rp = rock.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < rp.count; i++) {
      const x = rp.getX(i);
      const z = rp.getZ(i);
      const y = rp.getY(i);
      const k = 0.22 * (1 - Math.abs(y + 1.75) / 1.8);
      rp.setXYZ(i, x + (rand(i) - 0.5) * k * 2.2, y + (rand(i + 9) - 0.5) * 0.25, z + (rand(i + 17) - 0.5) * k * 2.2);
    }
    rock.computeVertexNormals();

    const cone = new THREE.ConeGeometry(0.42, 0.9, 6);
    const trunk = new THREE.CylinderGeometry(0.07, 0.09, 0.35, 5);
    const towerBody = new THREE.CylinderGeometry(0.34, 0.42, 1.5, 8);
    const towerRoof = new THREE.ConeGeometry(0.55, 0.7, 8);
    const crenel = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const crystal = new THREE.OctahedronGeometry(0.34, 0);
    const pedestal = new THREE.CylinderGeometry(0.32, 0.42, 0.22, 6);
    const pebble = new THREE.DodecahedronGeometry(0.5, 0);
    const orb = new THREE.SphereGeometry(0.06, 10, 10);
    const ring = new THREE.TorusGeometry(0.62, 0.012, 6, 64);
    const flag = new THREE.PlaneGeometry(0.42, 0.24, 6, 1);

    const flat = (color: THREE.Color, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.05, ...extra });

    const mats = {
      grass: flat(COLORS.grass),
      rock: flat(COLORS.rock, { roughness: 0.95 }),
      leaf: flat(COLORS.leaf),
      leaf2: flat(COLORS.leaf2),
      trunk: flat(COLORS.trunk),
      stone: flat(COLORS.stone, { roughness: 0.7 }),
      roof: flat(COLORS.roof, { emissive: COLORS.roof, emissiveIntensity: 0.15 }),
      window: new THREE.MeshBasicMaterial({ color: "#ffd88a" }),
      crystal: new THREE.MeshStandardMaterial({
        color: COLORS.crystal,
        emissive: COLORS.crystal,
        emissiveIntensity: 1.4,
        flatShading: true,
        roughness: 0.2,
        metalness: 0.1,
      }),
      orb: new THREE.MeshBasicMaterial({ color: COLORS.crystal }),
      orbB: new THREE.MeshBasicMaterial({ color: COLORS.roof }),
      ring: new THREE.MeshBasicMaterial({ color: COLORS.crystal, transparent: true, opacity: 0.45 }),
      flag: new THREE.MeshStandardMaterial({ color: COLORS.roof, side: THREE.DoubleSide, flatShading: true }),
    };
    const geos = { top, rock, cone, trunk, towerBody, towerRoof, crenel, crystal, pedestal, pebble, orb, ring, flag };
    return { geos, mats };
  }, []);

  useEffect(
    () => () => {
      Object.values(assets.geos).forEach((g) => g.dispose());
      Object.values(assets.mats).forEach((m) => m.dispose());
    },
    [assets],
  );
  return assets;
}

const TREES: [number, number, number][] = [
  [-1.6, 0.5, 1.1],
  [-1.9, -0.4, 0.85],
  [-1.1, -1.3, 1],
  [-0.4, 1.7, 0.8],
  [1.4, 1.35, 0.9],
  [1.95, 0.35, 0.75],
  [0.6, -1.8, 0.85],
  [-0.9, 1.05, 0.7],
];

function Island({ pointer, reduced, quality }: { pointer: PointerRef; reduced: boolean; quality: "high" | "low" }) {
  const { geos, mats } = useIslandAssets();
  const root = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const orbits = useRef<THREE.Group>(null);
  const flag = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const pulseT = useRef(10);
  const start = useRef<number | null>(null);
  const flagBase = useMemo(() => Float32Array.from((geos.flag.attributes.position as THREE.BufferAttribute).array), [geos]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    // Intro: rise + settle over ~2.2s (easeOutExpo)
    const p = reduced ? 1 : Math.min(1, (t - start.current) / 2.2);
    const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);

    const g = root.current;
    if (g) {
      const bob = reduced ? 0 : Math.sin(t * 0.8) * 0.08;
      g.position.y = -2.6 * (1 - ease) + bob;
      g.scale.setScalar(0.82 + 0.18 * ease);
      const targetY = (reduced ? 0 : t * 0.06) + pointer.current.x * 0.45;
      const targetX = 0.1 + pointer.current.y * 0.12;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY - 0.4 * (1 - ease), 3, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    }

    const speed = hovered.current ? 2.6 : 0.8;
    if (crystal.current) {
      crystal.current.rotation.y += delta * speed;
      crystal.current.position.y = 1.15 + Math.sin(t * 1.6) * 0.08;
      const target = hovered.current ? 2.6 : 1.4;
      mats.crystal.emissiveIntensity = THREE.MathUtils.damp(mats.crystal.emissiveIntensity, target, 6, delta);
    }
    if (ring.current) {
      ring.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.7) * 0.25;
      ring.current.rotation.z += delta * 0.6;
    }
    if (light.current) light.current.intensity = 6 + Math.sin(t * 2) * 1.5 + (hovered.current ? 6 : 0);
    if (orbits.current) orbits.current.rotation.y -= delta * 0.35;

    // Waving flag (vertex animation)
    if (flag.current && quality === "high" && !reduced) {
      const pos = flag.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const bx = flagBase[i * 3];
        const k = (bx + 0.21) / 0.42;
        pos.setZ(i, Math.sin(t * 5 + bx * 12) * 0.05 * k);
      }
      pos.needsUpdate = true;
    }

    // Click pulse ring
    if (pulse.current) {
      pulseT.current += delta;
      const k = Math.min(1, pulseT.current / 1.1);
      pulse.current.visible = k < 1;
      pulse.current.scale.setScalar(0.4 + k * 4);
      (pulse.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - k);
    }
  });

  return (
    <group ref={root} position={[0, -2.6, 0]}>
      <mesh geometry={geos.top} material={mats.grass} receiveShadow castShadow />
      <mesh geometry={geos.rock} material={mats.rock} castShadow />

      {/* trees */}
      {TREES.map(([x, z, s], i) => (
        <group key={i} position={[x, 0.2, z]} scale={s} rotation={[0, rand(i) * 6, 0]}>
          <mesh geometry={geos.trunk} material={mats.trunk} position={[0, 0.17, 0]} castShadow />
          <mesh geometry={geos.cone} material={i % 2 ? mats.leaf : mats.leaf2} position={[0, 0.7, 0]} castShadow />
          <mesh
            geometry={geos.cone}
            material={i % 2 ? mats.leaf2 : mats.leaf}
            position={[0, 1.08, 0]}
            scale={0.72}
            castShadow
          />
        </group>
      ))}

      {/* watchtower */}
      <group position={[1.15, 0.2, -0.75]}>
        <mesh geometry={geos.towerBody} material={mats.stone} position={[0, 0.75, 0]} castShadow receiveShadow />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              geometry={geos.crenel}
              material={mats.stone}
              position={[Math.cos(a) * 0.36, 1.55, Math.sin(a) * 0.36]}
              castShadow
            />
          );
        })}
        <mesh geometry={geos.towerRoof} material={mats.roof} position={[0, 1.95, 0]} castShadow />
        <mesh position={[0, 0.95, 0.36]} material={mats.window}>
          <planeGeometry args={[0.12, 0.2]} />
        </mesh>
        <mesh position={[0.2, 2.3, 0]} geometry={geos.trunk} material={mats.trunk} scale={[0.5, 1.4, 0.5]} />
        <mesh ref={flag} geometry={geos.flag} material={mats.flag} position={[0.42, 2.42, 0]} />
      </group>

      {/* crystal shrine — interactive */}
      <group position={[-0.35, 0.2, 0.15]}>
        <mesh geometry={geos.pedestal} material={mats.stone} position={[0, 0.11, 0]} castShadow receiveShadow />
        <mesh
          ref={crystal}
          geometry={geos.crystal}
          material={mats.crystal}
          position={[0, 1.15, 0]}
          scale={[1, 1.5, 1]}
          onPointerOver={(e) => {
            e.stopPropagation();
            hovered.current = true;
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            hovered.current = false;
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            e.stopPropagation();
            pulseT.current = 0;
          }}
        />
        <mesh ref={ring} geometry={geos.ring} material={mats.ring} position={[0, 1.15, 0]} />
        <mesh ref={pulse} position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.55, 0.6, 48]} />
          <meshBasicMaterial color={COLORS.crystal} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <pointLight ref={light} color={COLORS.crystal} intensity={6} distance={5} decay={2} position={[0, 1.2, 0]} />
      </group>

      {/* orbiting lights — echoes the reference hero's orbiting glow dots */}
      <group ref={orbits} position={[0, 0.6, 0]}>
        {Array.from({ length: 4 }).map((_, i) => {
          const a = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={i}
              geometry={geos.orb}
              material={i % 2 ? mats.orbB : mats.orb}
              position={[Math.cos(a) * 3.4, Math.sin(a * 2) * 0.5, Math.sin(a) * 3.4]}
            />
          );
        })}
      </group>

      <Waterfall reduced={reduced} count={quality === "high" ? 160 : 60} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Waterfall particles spilling from the island edge                   */
/* ------------------------------------------------------------------ */
function Waterfall({ reduced, count }: { reduced: boolean; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat, vel } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 2.2 + rand(i) * 0.25;
      pos[i * 3 + 1] = 0.15 - rand(i + 3) * 4;
      pos[i * 3 + 2] = 0.9 + (rand(i + 7) - 0.5) * 0.35;
      vel[i] = 0.9 + rand(i + 11) * 0.8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: COLORS.water,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geo, mat, vel };
  }, [count]);

  useEffect(() => () => {
    geo.dispose();
    mat.dispose();
  }, [geo, mat]);

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const d = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1;
      arr[iy] -= vel[i] * d * 2.2;
      arr[i * 3] += d * 0.12; // slight outward drift
      if (arr[iy] < -3.8) {
        arr[iy] = 0.15;
        arr[i * 3] = 2.2 + rand(i + arr[iy]) * 0.2;
      }
    }
    pos.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ------------------------------------------------------------------ */
/* Floating debris islets                                              */
/* ------------------------------------------------------------------ */
function Debris({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { geo, mat, top } = useMemo(
    () => ({
      geo: new THREE.DodecahedronGeometry(0.5, 0),
      mat: new THREE.MeshStandardMaterial({ color: COLORS.rockDark, flatShading: true, roughness: 1 }),
      top: new THREE.MeshStandardMaterial({ color: COLORS.grassDark, flatShading: true }),
    }),
    [],
  );
  useEffect(() => () => {
    geo.dispose();
    mat.dispose();
    top.dispose();
  }, [geo, mat, top]);

  const items: [number, number, number, number][] = [
    [-4.4, 0.6, -1.5, 0.55],
    [4.6, 1.3, -2.2, 0.42],
    [-3.6, -1.4, 0.8, 0.32],
    [3.8, -1.2, 1.2, 0.3],
  ];
  useFrame((state) => {
    if (reduced || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((c, i) => {
      c.position.y = items[i][1] + Math.sin(t * 0.9 + i * 1.7) * 0.18;
      c.rotation.y = t * 0.15 * (i % 2 ? 1 : -1);
    });
  });
  return (
    <group ref={group}>
      {items.map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={s}>
          <mesh geometry={geo} material={mat} scale={[1, 1.3, 1]} />
          <mesh geometry={geo} material={top} position={[0, 0.5, 0]} scale={[1.05, 0.25, 1.05]} />
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Atmospheric dust                                                    */
/* ------------------------------------------------------------------ */
function Dust({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + rand(i) * 7;
      const a = rand(i + 5) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (rand(i + 9) - 0.5) * 7;
      pos[i * 3 + 2] = Math.sin(a) * r - 2;
      const c = rand(i + 2) > 0.8 ? COLORS.roof : rand(i + 4) > 0.5 ? COLORS.crystal : COLORS.accent;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    return { geo, mat };
  }, [count]);
  useEffect(() => () => {
    geo.dispose();
    mat.dispose();
  }, [geo, mat]);

  useFrame((state, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ------------------------------------------------------------------ */
/* Camera rig — subtle parallax toward the pointer                     */
/* ------------------------------------------------------------------ */
function CameraRig({ pointer, reduced }: { pointer: PointerRef; reduced: boolean }) {
  const { camera, size } = useThree();
  const base = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(0, 0.45, 0), []);
  useFrame((_, delta) => {
    // Pull back on narrow (portrait) screens so the island fits.
    const aspect = size.width / Math.max(1, size.height);
    const dist = aspect < 1 ? 13.5 : aspect < 1.6 ? 11 : 10;
    base.set(0, 2.3, dist);
    const px = reduced ? 0 : pointer.current.x * 0.9;
    const py = reduced ? 0 : pointer.current.y * 0.45;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, base.x + px, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, base.y + py, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, base.z, 2.5, delta);
    camera.lookAt(look);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Scene root                                                          */
/* ------------------------------------------------------------------ */
export default function HeroScene({
  active,
  reduced,
  mobile,
  onFail,
}: {
  active: boolean;
  reduced: boolean;
  mobile: boolean;
  onFail: () => void;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const [dprMax, setDprMax] = useState(mobile ? 1.5 : 2);
  const quality: "high" | "low" = mobile ? "low" : "high";

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <Canvas
      shadows={quality === "high" ? "percentage" : false}
      dpr={[1, dprMax]}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      camera={{ position: [0, 2.3, 10], fov: 34, near: 0.1, far: 60 }}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail();
        });
      }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDprMax(1)} onIncline={() => setDprMax(mobile ? 1.5 : 2)} />
      <fog attach="fog" args={["#0a0b12", 9, 22]} />
      <hemisphereLight args={["#8E9EFF", "#0a1020", 0.75]} />
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={2.4}
        color="#ffe9cf"
        castShadow={quality === "high"}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-6, 2, -4]} intensity={1.2} color="#ff52b8" />
      <CameraRig pointer={pointer} reduced={reduced} />
      <Island pointer={pointer} reduced={reduced} quality={quality} />
      <Debris reduced={reduced} />
      <Dust count={quality === "high" ? 520 : 160} reduced={reduced} />
    </Canvas>
  );
}
