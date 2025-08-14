import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
} from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";
import {
  Canvas,
  useThree,
  useFrame,
} from "https://esm.sh/@react-three/fiber@9?deps=three@0.179.1,react@18,react-dom@18";
import * as THREE from "https://esm.sh/three@0.179.1";
import { OrbitControls as ThreeOrbitControls } from "https://esm.sh/three@0.179.1/examples/jsm/controls/OrbitControls.js";

/**
 * Livnium 3D Visualizer — React + Three.js
 *
 * FIX for runtime error: "TypeError: Cannot read properties of undefined (reading 'source')".
 * Root cause: OrbitControls was being instantiated before React Three Fiber's WebGL
 * renderer or camera were fully ready in this environment. We now guard initialization
 * of controls until both `camera` and `gl.domElement` exist, and we handle lifecycle
 * cleanly to avoid double-instantiation under StrictMode.
 *
 * Also kept previous fixes:
 * - No @react-three/drei (to avoid `import.meta`/ESM expectations in some CDNs)
 * - Axes via Three's AxesHelper primitive
 * - Edges via EdgesGeometry + LineSegments
 *
 * Features:
 * - 3×3×3 lattice (−1..1)^3 as 27 cubelets
 * - Color modes: Exposure class or Coupler heat (K/faces / L^alpha)
 * - Face moves: U, D, L, R, F, B with modifiers (', 2)
 * - Sequence runner: parse tokens like "U R F' U2"
 * - Drop-axis filter to show slices
 */

// ---------- math / helpers -------------------------------------------------
const K = 10.125; // equilibrium constant

function facesForVec({ x, y, z }) {
  return (x !== 0 ? 1 : 0) + (y !== 0 ? 1 : 0) + (z !== 0 ? 1 : 0);
}
function l1({ x, y, z }) {
  return Math.abs(x) + Math.abs(y) + Math.abs(z);
}

function rotX90({ x, y, z }) {
  return { x, y: -z, z: y };
}
function rotY90({ x, y, z }) {
  return { x: z, y, z: -x };
}
function rotZ90({ x, y, z }) {
  return { x: -y, y: x, z };
}
function rotateNTimes(v, fn, n) {
  let p = { ...v };
  const t = ((n % 4) + 4) % 4;
  for (let i = 0; i < t; i++) p = fn(p);
  return p;
}

// Moves: which layer to rotate and around which axis
const Moves = {
  U: { select: (v) => v.z === 1, axis: "z" },
  D: { select: (v) => v.z === -1, axis: "z" },
  R: { select: (v) => v.x === 1, axis: "x" },
  L: { select: (v) => v.x === -1, axis: "x" },
  F: { select: (v) => v.y === 1, axis: "y" },
  B: { select: (v) => v.y === -1, axis: "y" },
};

function applyMove(cubelets, token) {
  // token examples: "U", "R'", "F2"
  const face = token[0];
  if (!Moves[face]) return cubelets;
  let turns = 1;
  if (token.endsWith("2")) turns = 2;
  else if (token.endsWith("'")) turns = 3; // -90° == +270°

  const { select, axis } = Moves[face];
  return cubelets.map((c) => {
    if (!select(c.pos)) return c;
    let fn = axis === "x" ? rotX90 : axis === "y" ? rotY90 : rotZ90;
    return { ...c, pos: rotateNTimes(c.pos, fn, turns) };
  });
}

function parseSequence(seq) {
  // split by spaces, tolerate commas
  return seq
    .trim()
    .replace(/,/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Color utilities
function hsl(h, s, l) {
  return `hsl(${h} ${s}% ${l}%)`;
}

function colorByExposure(pos) {
  const f = facesForVec(pos);
  switch (f) {
    case 0:
      return "#9ca3af"; // core (gray)
    case 1:
      return "#4ade80"; // center (green)
    case 2:
      return "#60a5fa"; // edge (blue)
    case 3:
      return "#f472b6"; // corner (pink)
    default:
      return "#ffffff";
  }
}

function couplerMagnitude(pos, alpha = 1, tau0 = 1) {
  const faces = facesForVec(pos);
  if (faces <= 0) return 0; // core excluded
  const L = l1(pos);
  const base = K / faces;
  const loss = Math.pow(L, alpha);
  return (tau0 * base) / (loss === 0 ? 1 : loss);
}

function colorByCoupler(pos, alpha, tau0) {
  // Map magnitude to hue (blue→green→yellow→orange)
  const c = couplerMagnitude(pos, alpha, tau0); // ~[0..10.125]
  const t = Math.min(c / K, 1); // 0..1
  const hue = 220 - 160 * t; // 220→60
  const light = 40 + 20 * t;
  return hsl(hue, 80, light);
}

// ---------- 3D primitives (no drei) ---------------------------------------
function Axes({ size = 4 }) {
  const axes = useMemo(() => new THREE.AxesHelper(size), [size]);
  return <primitive object={axes} />;
}

function Controls({ enablePan = true, enableZoom = true, enableRotate = true }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef(null);

  useEffect(() => {
    let controls = null;
    try {
      if (!camera || !gl || !gl.domElement) return undefined; // guard: wait until ready
      // Some environments attach the canvas later; defer one frame to be safe
      let raf = requestAnimationFrame(() => {
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
    } catch (e) {
      console.error("Controls effect error:", e);
      return () => {};
    }
  }, [camera, gl, enablePan, enableZoom, enableRotate]);

  useFrame(() => {
    if (controlsRef.current) controlsRef.current.update();
  });
  return null;
}

// A cube with an outline made via EdgesGeometry (replacement for drei <Edges/>)
function Cubelet({ pos, mode, alpha, tau0, hidden }) {
  const spacing = 1.1;
  const size = 0.9;
  const color = useMemo(
    () => (mode === "exposure" ? colorByExposure(pos) : colorByCoupler(pos, alpha, tau0)),
    [pos, mode, alpha, tau0]
  );

  const boxGeo = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(boxGeo, 15), [boxGeo]);
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#000000" }), []);

  if (hidden) return null;

  return (
    <group position={[pos.x * spacing, pos.y * spacing, pos.z * spacing]}>
      <mesh geometry={boxGeo}>
        <meshStandardMaterial color={color} />
      </mesh>
      <lineSegments geometry={edgeGeo} material={edgeMat} />
    </group>
  );
}


function Scene({ cubes, mode, alpha, tau0, drop, slice }) {
  // drop: 'none' | 'x' | 'y' | 'z'; slice: -1|0|1 (only used when drop != none)
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 10]} intensity={0.9} />
      <Axes size={4} />

      {cubes.map((c) => {
        let hidden = false;
        if (drop !== "none") {
          if (drop === "x") hidden = c.pos.x !== slice;
          if (drop === "y") hidden = c.pos.y !== slice;
          if (drop === "z") hidden = c.pos.z !== slice;
        }
        return (
          <Cubelet key={c.id} pos={c.pos} mode={mode} alpha={alpha} tau0={tau0} hidden={hidden} />
        );
      })}

      <Controls enablePan enableZoom enableRotate />
    </>
  );
}

// ---------- Runtime sanity checks (lightweight "tests") -------------------
function runSanityTests() {
  // 1) parseSequence basics
  console.assert(
    JSON.stringify(parseSequence("U R F' U2")) === JSON.stringify(["U", "R", "F'", "U2"]),
    "parseSequence failed"
  );
  console.assert(
    JSON.stringify(parseSequence("U,R,F2")) === JSON.stringify(["U", "R", "F2"]),
    "parseSequence commas failed"
  );

  // 2) Rotation identity: apply U2 twice on z=1 layer should be no-op for positions outside layer
  const base = [];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) base.push({ id: base.length, pos: { x, y, z } });
  const after = applyMove(applyMove(base, "U2"), "U2");
  const unchangedOffLayer = base.every((c, i) =>
    c.pos.z !== 1 ? JSON.stringify(c.pos) === JSON.stringify(after[i].pos) : true
  );
  console.assert(unchangedOffLayer, "Off-layer points must remain unchanged after U layer rotations");

  // 3) Coupler monotonicity by L1 shell (alpha=1)
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

  // 4) Faces class counts invariant in {-1,0,1}^3
  let c0 = 0, c1 = 0, c2 = 0, c3 = 0;
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const f = facesForVec({ x, y, z });
        if (f === 0) c0++;
        else if (f === 1) c1++;
        else if (f === 2) c2++;
        else if (f === 3) c3++;
      }
  console.assert(c0 === 1 && c1 === 6 && c2 === 12 && c3 === 8, "Exposure class counts invalid");
}

// ---------- UI wrapper -----------------------------------------------------
export default function Livnium3D() {
  useEffect(() => {
    runSanityTests();
  }, []);

  const initial = useMemo(() => {
    const list = [];
    let id = 0;
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) list.push({ id: id++, pos: { x, y, z } });
    return list;
  }, []);

  const [cubes, setCubes] = useState(initial);
  const [mode, setMode] = useState("exposure"); // 'exposure' | 'coupler'
  const [alpha, setAlpha] = useState(1);
  const [tau0, setTau0] = useState(1);
  const [seq, setSeq] = useState("");
  const [drop, setDrop] = useState("none"); // none|x|y|z
  const [slice, setSlice] = useState(0); // -1|0|1

  function doMove(tok) {
    setCubes((cs) => applyMove(cs, tok));
  }
  function doSequence() {
    const toks = parseSequence(seq);
    setCubes((cs) => toks.reduce((acc, t) => applyMove(acc, t), cs));
  }
  function reset() {
    setCubes(initial);
  }

  const btn =
    "px-3 py-1 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition text-sm";
  const label = "text-xs uppercase tracking-wide text-white/70";

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr] bg-neutral-950 text-white">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className={label}>Color</span>
          <button
            className={`${btn} ${mode === "exposure" ? "ring-2 ring-orange-400" : ""}`}
            onClick={() => setMode("exposure")}
          >
            Exposure
          </button>
          <button
            className={`${btn} ${mode === "coupler" ? "ring-2 ring-orange-400" : ""}`}
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
          {[
            ["none", "None"],
            ["x", "X"],
            ["y", "Y"],
            ["z", "Z"],
          ].map(([k, label]) => (
            <button
              key={k}
              className={`${btn} ${drop === k ? "ring-2 ring-sky-400" : ""}`}
              onClick={() => setDrop(k)}
            >
              {label}
            </button>
          ))}
          {drop !== "none" && (
            <div className="flex items-center gap-2 ml-2">
              <span className={label}>Slice</span>
              {[-1, 0, 1].map((s) => (
                <button
                  key={s}
                  className={`${btn} ${slice === s ? "ring-2 ring-sky-400" : ""}`}
                  onClick={() => setSlice(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className={label}>Moves</span>
          {[
            "U",
            "D",
            "L",
            "R",
            "F",
            "B",
            "U'",
            "R'",
            "F'",
            "U2",
            "R2",
            "F2",
          ].map((m) => (
            <button key={m} className={btn} onClick={() => doMove(m)}>
              {m}
            </button>
          ))}
          <button className={`${btn} ml-2`} onClick={reset}>
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2 ml-4 grow">
          <span className={label}>Sequence</span>
          <input
            className="flex-1 px-3 py-1 rounded-xl bg-white/5 border border-white/20 outline-none"
            placeholder="e.g. U R F' U2"
            value={seq}
            onChange={(e) => setSeq(e.target.value)}
          />
          <button className={btn} onClick={doSequence}>
            Run
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <Canvas camera={{ position: [5, 5, 6], fov: 45 }}>
          <Scene
            cubes={cubes}
            mode={mode}
            alpha={alpha}
            tau0={tau0}
            drop={drop}
            slice={slice}
          />
        </Canvas>
      </div>
    </div>
  );
}

// Mount React application
const root = createRoot(document.getElementById("root"));
root.render(<Livnium3D />);
