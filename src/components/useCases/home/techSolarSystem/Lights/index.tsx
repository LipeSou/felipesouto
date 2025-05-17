function Lights() {
  return (
    <>
      <ambientLight intensity={0.95} />
      <pointLight
        position={[0, 0, 0]}
        intensity={15}
        distance={100}
        decay={1}
      />
    </>
  );
}

export default Lights;
