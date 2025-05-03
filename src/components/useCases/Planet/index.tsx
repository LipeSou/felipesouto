import { useFrame } from "@react-three/fiber";
import Ecliptic from "../Ecliptic";
import React from "react";

function Planet({
  planet: { color, xRadius, zRadius, size, speed, offset, rotationSpeed },
}) {
  const planetRef = React.useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const x = xRadius * Math.sin(t);
    const z = zRadius * Math.cos(t);
    planetRef.current.position.x = x;
    planetRef.current.position.z = z;
    planetRef.current.rotation.y += rotationSpeed;
  });
  return (
    <>
      <mesh ref={planetRef} position={[xRadius, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Ecliptic xRadius={xRadius} zRadius={zRadius} />
    </>
  );
}
export default Planet;
