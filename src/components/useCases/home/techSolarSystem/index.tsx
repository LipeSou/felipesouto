import { Canvas } from "@react-three/fiber";
import Sun from "./Sun";
import Planet from "./Planet";
import Lights from "./Lights";
import { OrbitControls } from "@react-three/drei";

export interface PlanetType {
  id: number;
  color: string;
  xRadius: number;
  zRadius: number;
  size: number;
  speed: number;
  offset: number;
  rotationSpeed: number;
}

function TechSolarSystem() {
  const random = (a: number, b: number) => a + Math.random() * b;

  // const names = ["react", "vue", "typescript", "node", "next", "tailwind"];
  const colors = [
    "#61DAFB",
    "#42B883",
    "#3178C6",
    "#339933",
    "#000000",
    "#06B6D4",
  ];

  const planetData: PlanetType[] = [];
  const totalPlanets = 6;
  for (let index = 0; index < totalPlanets; index++) {
    planetData.push({
      id: index,
      color: colors[index],
      xRadius: (index + 1.5) * 4,
      zRadius: (index + 1.5) * 2,
      size: random(0.5, 1),
      speed: random(0.2, 0.01),
      offset: random(0, Math.PI * 2),
      rotationSpeed: random(0.01, 0.03),
    });
  }

  return (
    <Canvas camera={{ position: [0, 20, 25], fov: 50 }}>
      <OrbitControls enableZoom={true} />
      <Sun />
      {planetData.map((planet) => (
        <Planet planet={planet} key={planet.id} />
      ))}
      <Lights />
    </Canvas>
  );
}

export default TechSolarSystem;
