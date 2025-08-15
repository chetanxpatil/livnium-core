import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export function NameSprite({
  pos,
  cubeSize = 0.9,
  margin = 0.18,
  scale = 0.6,
  textForSide,
  depsKey = '',
}) {
  const makeSprite = (text) => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.font = 'bold 80px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(scale, scale, scale);
    sprite.frustumCulled = false;
    return { sprite, material, texture };
  };

  const safeTextForSide = (axis, sign) =>
    typeof textForSide === 'function' ? textForSide(axis, sign) : '';

  const sides = useMemo(() => {
    const arr = [];
    if (pos.x !== 0) arr.push({ axis: 'x', sign: Math.sign(pos.x) });
    if (pos.y !== 0) arr.push({ axis: 'y', sign: Math.sign(pos.y) });
    if (pos.z !== 0) arr.push({ axis: 'z', sign: Math.sign(pos.z) });
    return arr.map(({ axis, sign }) => ({
      axis,
      sign,
      ...makeSprite(safeTextForSide(axis, sign) || ''),
    }));
  }, [pos.x, pos.y, pos.z, scale, depsKey]);

  useEffect(() => {
    const d = cubeSize / 2 + margin + 0.001;
    for (const s of sides) {
      s.sprite.position.set(
        s.axis === 'x' ? s.sign * d : 0,
        s.axis === 'y' ? s.sign * d : 0,
        s.axis === 'z' ? s.sign * d : 0,
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
