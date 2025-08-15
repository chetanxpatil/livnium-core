import React, { useMemo, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** --------------------------------------------------------------
 *  Livnium Visualizer — simplified
 *  - No moves/sequence/animation logic
 *  - Label Mode: XYZ coords or your Face letters
 *  - Exposure/Coupler coloring, Drop-axis slicing
 *  - Stable hooks (no early returns) + shared geometries
 * -------------------------------------------------------------- */

/** ---------- helpers ---------- */
const exposureCount = ({ x, y, z }) => (x !== 0) + (y !== 0) + (z !== 0);
const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;

const colorByExposure = (pos) =>
  ["#9ca3af", "#4ade80", "#60a5fa", "#f472b6"][exposureCount(pos)] ?? "#fff";

const K =
  typeof window !== "undefined" &&
  window.livnium &&
  typeof window.livnium.equilibriumConstant === "function"
    ? window.livnium.equilibriumConstant()
    : 10.125; // fallback

function couplerMagnitude(pos, alpha = 1, tau0 = 1) {
  if (!window.livnium) return 0;
  const params = window.livnium.makeCouplerParams(tau0, alpha);
  return window.livnium.couplingAt(pos.x, pos.y, pos.z, params);
}

function colorByCoupler(pos, alpha, tau0) {
  const c = couplerMagnitude(pos, alpha, tau0);
  const t = Math.min(c / K, 1);
  const hue = 220 - 160 * t;
  const light = 40 + 20 * t;
  return hsl(hue, 80, light);
}

// ---------------- Face-letter maps (per outward face sticker) ----------------
// Rows: top->bottom, Cols: left->right (viewed from outside the face)
const FACE_LETTERS = {
  "z+1": [
    ["w", "o", "s"],
    ["m", "e", "k"],
    ["y", "q", "u"],
  ], // Up (Z=+1)
  "z-1": [
    ["x", "p", "t"],
    ["n", "f", "l"],
    ["z", "r", "v"],
  ], // Down (Z=-1)
  "x-1": [
    ["w", "i", "x"],
    ["m", "b", "n"],
    ["y", "j", "z"],
  ], // Left (X=-1)
  "x+1": [
    ["s", "g", "t"],
    ["k", "a", "l"],
    ["u", "h", "v"],
  ], // Right (X=+1)
  "y+1": [
    ["x", "p", "t"],
    ["i", "c", "g"],
    ["w", "o", "s"],
  ], // Front (Y=+1)
  "y-1": [
    ["z", "r", "v"],
    ["j", "d", "h"],
    ["y", "q", "u"],
  ], // Back (Y=-1)
};

function faceLetterFor(pos, axis, sign) {
  if (axis === "z") {
    const key = `z${sign > 0 ? "+1" : "-1"}`;
    const grid = FACE_LETTERS[key];
    const row = pos.y === 1 ? 0 : pos.y === 0 ? 1 : 2; // y: +1 top
    const col = pos.x === -1 ? 0 : pos.x === 0 ? 1 : 2; // x: -1 left
    return grid[row][col];
  }
  if (axis === "x") {
    const key = `x${sign > 0 ? "+1" : "-1"}`;
    const grid = FACE_LETTERS[key];
    const row = pos.y === 1 ? 0 : pos.y === 0 ? 1 : 2; // y: +1 top
    const col = pos.z === 1 ? 0 : pos.z === 0 ? 1 : 2; // z: +1 left
    return grid[row][col];
  }
  // axis === 'y'
  const key = `y${sign > 0 ? "+1" : "-1"}`;
  const grid = FACE_LETTERS[key];
  const row = pos.z === 1 ? 0 : pos.z === 0 ? 1 : 2; // z: +1 top
  const col = pos.x === -1 ? 0 : pos.x === 0 ? 1 : 2; // x: -1 left
  return grid[row][col];
}

/** ---------- axes & controls (no drei) ---------- */
function Axes({ size = 4 }) {
  const axes = useMemo(() => new THREE.AxesHelper(size), [size]);
  return <primitive object={axes} />;
}

function Controls({ enablePan = true, enableZoom = true, enableRotate = true }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef(null);

  useEffect(() => {
    let controls = null;
    let raf = 0;
    if (!camera || !gl || !gl.domElement) return;

    raf = requestAnimationFrame(() => {
      try {
        controls = new ThreeOrbitControls(camera, gl.domElement);
        controls.enablePan = enablePan;
        controls.enableZoom = enableZoom;
        controls.enableRotate = enableRotate;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controlsRef.current = controls;
      } catch (e) {
        console.error("OrbitControls init failed:", e);
      }
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (controls) controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl, enablePan, enableZoom, enableRotate]);

  useFrame(() => controlsRef.current?.update());
  return null;
}

/** ---------- Label sprites: per outward face; occluded by cubes ---------- */
function NameSprite({
  pos, // {x,y,z} in {-1,0,1}
  cubeSize = 0.9,
  margin = 0.18,
  scale = 0.6,
  textForSide, // (axis: 'x'|'y'|'z', sign: -1|+1) => string
  depsKey = "", // bump to rebuild when content changes
}) {
  const makeSprite = (text) => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    ctx.font =
      "bold 80px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true, // occluded by cubes
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(scale, scale, scale);
    sprite.frustumCulled = false;
    return { sprite, material, texture };
  };

  const safeTextForSide = (axis, sign) =>
    typeof textForSide === "function" ? textForSide(axis, sign) : "";

  // outward faces only (centers→0, edges→2, corners→3)
  const sides = useMemo(() => {
    const arr = [];
    if (pos.x !== 0) arr.push({ axis: "x", sign: Math.sign(pos.x) });
    if (pos.y !== 0) arr.push({ axis: "y", sign: Math.sign(pos.y) });
    if (pos.z !== 0) arr.push({ axis: "z", sign: Math.sign(pos.z) });
    return arr.map(({ axis, sign }) => ({
      axis,
      sign,
      ...makeSprite(safeTextForSide(axis, sign) || ""),
    }));
  }, [pos.x, pos.y, pos.z, scale, depsKey]);

  useEffect(() => {
    const d = cubeSize / 2 + margin + 0.001; // avoid z-fighting
    for (const s of sides) {
      s.sprite.position.set(
        s.axis === "x" ? s.sign * d : 0,
        s.axis === "y" ? s.sign * d : 0,
        s.axis === "z" ? s.sign * d : 0
      );
    }
    return () => {
      for (const s of sides) {
        s.material.dispose();
        s.texture.dispose();
      }
    };
  }, [sides, cubeSize, margin]);

  return (
    <group>
      {sides.map((s, i) => (
        <primitive key={`${s.axis}${s.sign}${i}`} object={s.sprite} />
      ))}
    </group>
  );
}

/** ---------- Cubelet ---------- */
function Cubelet({
  pos,
  labelMode,
  showNames,
  mode,
  alpha,
  tau0,
  hidden,
  shared,
}) {
  const spacing = 1.1;
  const size = 0.9;

  const color = useMemo(
    () =>
      mode === "exposure"
        ? colorByExposure(pos)
        : colorByCoupler(pos, alpha, tau0),
    [pos, mode, alpha, tau0]
  );

  // Label providers
  const xyzLabel = `${pos.x},${pos.y},${pos.z}`;
  const textForSide = useMemo(() => {
    if (labelMode === "face") {
      return (axis, sign) => faceLetterFor(pos, axis, sign);
    }
    return () => xyzLabel; // same on all outward faces
  }, [labelMode, pos.x, pos.y, pos.z, xyzLabel]);

  return (
    <group
      visible={!hidden}
      position={[pos.x * spacing, pos.y * spacing, pos.z * spacing]}
    >
      <mesh geometry={shared.boxGeo}>
        <meshStandardMaterial color={color} />
      </mesh>
      <lineSegments geometry={shared.edgeGeo} material={shared.edgeMat} />
      {showNames ? (
        <NameSprite
          pos={pos}
          cubeSize={size}
          textForSide={textForSide}
          depsKey={labelMode}
        />
      ) : null}
    </group>
  );
}

/** ---------- Scene (no animation) ---------- */
function Scene({
  cubes,
  mode,
  alpha,
  tau0,
  drop,
  slice,
  showNames,
  labelMode,
}) {
  // shared geometry & material
  const shared = useMemo(() => {
    const size = 0.9;
    const boxGeo = new THREE.BoxGeometry(size, size, size);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo, 15);
    const edgeMat = new THREE.LineBasicMaterial({ color: "#000000" });
    return { boxGeo, edgeGeo, edgeMat };
  }, []);

  const renderCubelet = (c) => {
    let hidden = false;
    if (drop !== "none") {
      if (drop === "x") hidden = c.pos.x !== slice;
      if (drop === "y") hidden = c.pos.y !== slice;
      if (drop === "z") hidden = c.pos.z !== slice;
    }
    return (
      <Cubelet
        key={c.id}
        pos={c.pos}
        labelMode={labelMode}
        showNames={showNames}
        mode={mode}
        alpha={alpha}
        tau0={tau0}
        hidden={hidden}
        shared={shared}
      />
    );
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 10]} intensity={0.9} />
      <Axes size={4} />
      {cubes.map(renderCubelet)}
      <Controls enablePan enableZoom enableRotate />
    </>
  );
}

/** ---------- lightweight runtime tests (no moves) ---------- */
function runSanityTests() {
  // exposure class counts in a 3x3x3 with core included
  let c0 = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0;
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const f = exposureCount({ x, y, z });
        if (f === 0) c0++;
        else if (f === 1) c1++;
        else if (f === 2) c2++;
        else if (f === 3) c3++;
      }
  console.assert(
    c0 === 1 && c1 === 6 && c2 === 12 && c3 === 8,
    "Exposure class counts invalid"
  );

  if (window.livnium) {
    // Coupler monotonicity (avg by L1 shell)
    const mags = { 1: [], 2: [], 3: [] };
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          const L = Math.abs(x) + Math.abs(y) + Math.abs(z);
          if (L === 0) continue;
          mags[L].push(couplerMagnitude({ x, y, z }, 1, 1));
        }
    const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const l1a = avg(mags[1]),
      l2a = avg(mags[2]),
      l3a = avg(mags[3]);
    console.assert(l1a >= l2a && l2a >= l3a, "Coupler monotonicity failed");
    console.assert(
      couplerMagnitude({ x: 0, y: 0, z: 0 }, 1, 1) === 0,
      "Core magnitude must be 0"
    );
  }
}

/** ---------- App ---------- */
function Livnium3D() {
  useEffect(() => {
    runSanityTests();
  }, []);

  const cubes = useMemo(() => {
    const list = [];
    let id = 0;
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++)
          list.push({ id: id++, pos: { x, y, z } });
    return list;
  }, []);

  const [mode, setMode] = useState("exposure");
  const [alpha, setAlpha] = useState(1);
  const [tau0, setTau0] = useState(1);
  const [drop, setDrop] = useState("none");
  const [slice, setSlice] = useState(0);
  const [showNames, setShowNames] = useState(false);
  const [labelMode, setLabelMode] = useState("xyz"); // 'xyz' | 'face'

  const reset = () => {
    setMode("exposure");
    setAlpha(1);
    setTau0(1);
    setDrop("none");
    setSlice(0);
    setShowNames(false);
    setLabelMode("xyz");
  };

  const btn =
    "px-3 py-1 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition text-sm";
  const label = "text-xs uppercase tracking-wide text-white/70";

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr] bg-neutral-950 text-white">
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className={label}>Color</span>
          <button
            className={`${btn} ${
              mode === "exposure" ? "ring-2 ring-orange-400" : ""
            }`}
            onClick={() => setMode("exposure")}
          >
            Exposure
          </button>
          <button
            className={`${btn} ${
              mode === "coupler" ? "ring-2 ring-orange-400" : ""
            }`}
            onClick={() => setMode("coupler")}
          >
            Coupler Heat
          </button>
        </div>

        {mode === "coupler" && (
          <div className="flex items-center gap-2 ml-4">
            <span className={label}>alpha</span>
            <input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
            />
            <span className="tabular-nums">{alpha.toFixed(1)}</span>
            <span className={label}>tau0</span>
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.1}
              value={tau0}
              onChange={(e) => setTau0(parseFloat(e.target.value))}
            />
            <span className="tabular-nums">{tau0.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 ml-4">
          <span className={label}>Drop Axis</span>
          {["none", "x", "y", "z"].map((k) => (
            <button
              key={k}
              className={`${btn} ${drop === k ? "ring-2 ring-sky-400" : ""}`}
              onClick={() => setDrop(k)}
            >
              {k === "none" ? "None" : k.toUpperCase()}
            </button>
          ))}
          {drop !== "none" && (
            <div className="flex items-center gap-2 ml-2">
              <span className={label}>Slice</span>
              {[-1, 0, 1].map((s) => (
                <button
                  key={s}
                  className={`${btn} ${
                    slice === s ? "ring-2 ring-sky-400" : ""
                  }`}
                  onClick={() => setSlice(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 ml-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showNames}
              onChange={(e) => setShowNames(e.target.checked)}
            />
            <span className={label}>Show Labels</span>
          </label>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className={label}>Label Mode</span>
          <button
            className={`${btn} ${
              labelMode === "xyz" ? "ring-2 ring-violet-400" : ""
            }`}
            onClick={() => setLabelMode("xyz")}
          >
            XYZ
          </button>
          <button
            className={`${btn} ${
              labelMode === "face" ? "ring-2 ring-violet-400" : ""
            }`}
            onClick={() => setLabelMode("face")}
          >
            Face letters
          </button>
        </div>

        <button className={`${btn} ml-2`} onClick={reset}>
          Reset
        </button>
      </div>

      <div className="relative h-[calc(100vh-56px)]">
        <Canvas camera={{ position: [5, 5, 6], fov: 45 }}>
          <Scene
            cubes={cubes}
            mode={mode}
            alpha={alpha}
            tau0={tau0}
            drop={drop}
            slice={slice}
            showNames={showNames}
            labelMode={labelMode}
          />
        </Canvas>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Livnium3D />);
