// Right-hand-rule quarter turns matching the Dart impl:
// rotateX: (x, y, z) -> (x, -z,  y)
// rotateY: (x, y, z) -> (z,  y, -x)
// rotateZ: (x, y, z) -> (-y, x,  z)

export const Face = Object.freeze({ U: 'U', D: 'D', L: 'L', R: 'R', F: 'F', B: 'B' });

export function rotateX({ x, y, z }) { return { x, y: -z, z:  y }; }
export function rotateY({ x, y, z }) { return { x:  z, y, z: -x }; }
export function rotateZ({ x, y, z }) { return { x: -y, y:  x, z }; }

function mod4(q) { return ((q % 4) + 4) % 4; }

function selectForFace(pos, face) {
  switch (face) {
    case Face.U: return pos.z ===  1;
    case Face.D: return pos.z === -1;
    case Face.R: return pos.x ===  1;
    case Face.L: return pos.x === -1;
    case Face.F: return pos.y ===  1;
    case Face.B: return pos.y === -1;
    default:     return false;
  }
}

function rotorForFace(face) {
  switch (face) {
    case Face.U:
    case Face.D:
      return rotateZ;
    case Face.R:
    case Face.L:
      return rotateX;
    case Face.F:
    case Face.B:
      return rotateY;
  }
}

// Apply one face move to an array of {id, pos:{x,y,z}}
export function applyFaceMove(cubes, { face, quarterTurns }) {
  const t = mod4(quarterTurns);
  if (t === 0) return cubes;

  const rot = rotorForFace(face);
  return cubes.map(c => {
    if (!selectForFace(c.pos, face)) return c;
    let p = c.pos;
    for (let i = 0; i < t; i++) p = rot(p);
    return { ...c, pos: p };
  });
}

// Convenience: apply a sequence [{face, quarterTurns}, ...]
export function applyMoves(cubes, seq) {
  return seq.reduce((acc, m) => applyFaceMove(acc, m), cubes);
}
