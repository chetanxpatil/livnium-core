import React, { useMemo, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** -------- math / helpers -------- */
const K = window.livnium.equilibriumConstant();
const facesForVec = ({ x, y, z }) => (x !== 0) + (y !== 0) + (z !== 0);
const l1 = ({ x, y, z }) => Math.abs(x) + Math.abs(y) + Math.abs(z);

function applyMove(cubelets, token) {
  const face = token[0];
  const turns = token.endsWith("2") ? 2 : token.endsWith("'") ? -1 : 1;
  const perm = window.livnium.permutationFor({ face, quarterTurns: turns });
  const next = new Array(perm.length);
  for (let i = 0; i < perm.length; i++) {
    next[perm[i]] = { ...cubelets[i], pos: cubelets[perm[i]].pos };
  }
  return next;
}

const parseSequence = (seq) =>
  seq.trim().replace(/,/g, " ").split(/\s+/).filter(Boolean);

const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;
const colorByExposure = (pos) =>
  [ "#9ca3af", "#4ade80", "#60a5fa", "#f472b6" ][facesForVec(pos)] ?? "#fff";

function couplerMagnitude(pos, alpha = 1, tau0 = 1) {
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

/** -------- 3D primitives (no drei) -------- */
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

function Cubelet({ pos, mode, alpha, tau0, hidden }) {
  const spacing = 1.1, size = 0.9;
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

/** -------- lightweight runtime tests -------- */
function runSanityTests() {
  console.assert(
    JSON.stringify(parseSequence("U R F' U2")) === JSON.stringify(["U", "R", "F'", "U2"]),
    "parseSequence failed"
  );
  console.assert(
    JSON.stringify(parseSequence("U,R,F2")) === JSON.stringify(["U", "R", "F2"]),
    "parseSequence commas failed"
  );
  const base = [];
  for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) for (let z=-1;z<=1;z++)
    base.push({ id: base.length, pos: { x, y, z } });
  const after = applyMove(applyMove(base, "U2"), "U2");
  const ok = base.every((c,i)=> (c.pos.z!==1) ? JSON.stringify(c.pos)===JSON.stringify(after[i].pos) : true);
  console.assert(ok, "U2 twice should be no-op off z=1 layer");
  const mags = {1:[],2:[],3:[]};
  for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) for (let z=-1;z<=1;z++) {
    const L = Math.abs(x)+Math.abs(y)+Math.abs(z);
    if (L===0) continue;
    mags[L].push(couplerMagnitude({x,y,z},1,1));
  }
  const avg = (xs)=>xs.reduce((a,b)=>a+b,0)/xs.length;
  const l1a=avg(mags[1]), l2a=avg(mags[2]), l3a=avg(mags[3]);
  console.assert(l1a>=l2a && l2a>=l3a, "Coupler monotonicity failed");
  console.assert(couplerMagnitude({x:0,y:0,z:0},1,1)===0, "Core magnitude must be 0");
  let c0=0,c1=0,c2=0,c3=0;
  for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) for (let z=-1;z<=1;z++) {
    const f = facesForVec({x,y,z});
    if (f===0) c0++; else if (f===1) c1++; else if (f===2) c2++; else if (f===3) c3++;
  }
  console.assert(c0===1 && c1===6 && c2===12 && c3===8, "Exposure class counts invalid");
}

/** -------- App -------- */
function Livnium3D() {
  useEffect(() => { runSanityTests(); }, []);

  const initial = useMemo(() => {
    const list = []; let id=0;
    for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) for (let z=-1;z<=1;z++)
      list.push({ id: id++, pos: { x, y, z } });
    return list;
  }, []);

  const [cubes, setCubes] = useState(initial);
  const [mode, setMode] = useState("exposure");
  const [alpha, setAlpha] = useState(1);
  const [tau0, setTau0] = useState(1);
  const [seq, setSeq] = useState("");
  const [drop, setDrop] = useState("none");
  const [slice, setSlice] = useState(0);

  const btn = "px-3 py-1 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition text-sm";
  const label = "text-xs uppercase tracking-wide text-white/70";

  const doMove = (tok) => setCubes((cs)=>applyMove(cs,tok));
  const doSequence = () => setCubes((cs)=>parseSequence(seq).reduce((acc,t)=>applyMove(acc,t), cs));
  const reset = () => setCubes(initial);

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr] bg-neutral-950 text-white">
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className={label}>Color</span>
          <button className={`${btn} ${mode==="exposure"?"ring-2 ring-orange-400":""}`} onClick={()=>setMode("exposure")}>Exposure</button>
          <button className={`${btn} ${mode==="coupler"?"ring-2 ring-orange-400":""}`} onClick={()=>setMode("coupler")}>Coupler Heat</button>
        </div>

        {mode==="coupler" && (
          <div className="flex items-center gap-2 ml-4">
            <span className={label}>alpha</span>
            <input type="range" min={0} max={3} step={0.1} value={alpha} onChange={(e)=>setAlpha(parseFloat(e.target.value))} />
            <span className="tabular-nums">{alpha.toFixed(1)}</span>
            <span className={label}>tau0</span>
            <input type="range" min={0.1} max={2} step={0.1} value={tau0} onChange={(e)=>setTau0(parseFloat(e.target.value))} />
            <span className="tabular-nums">{tau0.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 ml-4">
          <span className={label}>Drop Axis</span>
          {["none","x","y","z"].map(k=>(
            <button key={k} className={`${btn} ${drop===k?"ring-2 ring-sky-400":""}`} onClick={()=>setDrop(k)}>
              {k==="none"?"None":k.toUpperCase()}
            </button>
          ))}
          {drop!=="none" && (
            <div className="flex items-center gap-2 ml-2">
              <span className={label}>Slice</span>
              {[-1,0,1].map(s=>(
                <button key={s} className={`${btn} ${slice===s?"ring-2 ring-sky-400":""}`} onClick={()=>setSlice(s)}>{s}</button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className={label}>Moves</span>
          {["U","D","L","R","F","B","U'","R'","F'","U2","R2","F2"].map(m=>(
            <button key={m} className={btn} onClick={()=>doMove(m)}>{m}</button>
          ))}
          <button className={`${btn} ml-2`} onClick={reset}>Reset</button>
        </div>

        <div className="flex items-center gap-2 ml-4 grow">
          <span className={label}>Sequence</span>
          <input className="flex-1 px-3 py-1 rounded-xl bg-white/5 border border-white/20 outline-none"
                 placeholder="e.g. U R F' U2" value={seq} onChange={(e)=>setSeq(e.target.value)} />
          <button className={btn} onClick={doSequence}>Run</button>
        </div>
      </div>

      <div className="relative h-[calc(100vh-56px)]">
        <Canvas camera={{ position: [5, 5, 6], fov: 45 }}>
          <Scene cubes={cubes} mode={mode} alpha={alpha} tau0={tau0} drop={drop} slice={slice} />
        </Canvas>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Livnium3D />);
