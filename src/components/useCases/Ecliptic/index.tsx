import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

interface EclipticProps {
  xRadius?: number;
  zRadius?: number;
}

function Ecliptic({ xRadius = 1, zRadius = 1 }: EclipticProps) {
  const points = useMemo(() => {
    const p: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      const x = (xRadius ?? 1) * Math.cos(angle);
      const z = (zRadius ?? 1) * Math.sin(angle);
      p.push(new THREE.Vector3(x, 0, z));
    }
    return p;
  }, [xRadius, zRadius]);

  return (
    <>
      <Line points={points} color="#BFBBDA" lineWidth={1.5} dashed={false} />
    </>
  );
}

export default Ecliptic;
