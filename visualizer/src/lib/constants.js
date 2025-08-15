export const K = globalThis?.livnium?.equilibriumConstant?.() ?? 10.125;

export const FACE_LETTERS = {
  "z+1": [
    ["w", "o", "s"],
    ["m", "e", "k"],
    ["y", "q", "u"],
  ],
  "z-1": [
    ["x", "p", "t"],
    ["n", "f", "l"],
    ["z", "r", "v"],
  ],
  "x-1": [
    ["w", "i", "x"],
    ["m", "b", "n"],
    ["y", "j", "z"],
  ],
  "x+1": [
    ["s", "g", "t"],
    ["k", "a", "l"],
    ["u", "h", "v"],
  ],
  "y+1": [
    ["x", "p", "t"],
    ["i", "c", "g"],
    ["w", "o", "s"],
  ],
  "y-1": [
    ["z", "r", "v"],
    ["j", "d", "h"],
    ["y", "q", "u"],
  ],
};
