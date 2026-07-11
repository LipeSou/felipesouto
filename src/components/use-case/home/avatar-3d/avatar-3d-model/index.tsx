"use client";

import React, { useEffect, useRef } from "react";
import { useFrame, useGraph } from "@react-three/fiber";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { MathUtils, Object3D, type Object3DEventMap } from "three";
import { useTransform, type MotionValue } from "framer-motion";

interface Avatar3DProps {
  [key: string]: unknown;
  animation: string;
  progress: MotionValue<number>;
}

export default function Avatar3DModel(props: Avatar3DProps) {
  const { animation, progress } = props;
  const group = useRef<Object3D<Object3DEventMap> | null>(null);
  const { scene } = useGLTF("/models/684a2a502f4b144e19983160.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGraph(clone) as any;

  const { animations: StandingGreeting } = useFBX(
    "/animations/StandingGreeting.fbx"
  );
  const { animations: FallingIdle } = useFBX("/animations/FallingIdle.fbx");
  const { animations: HappyIdle } = useFBX("/animations/HappyIdle.fbx");

  StandingGreeting[0].name = "StandingGreeting";
  FallingIdle[0].name = "FallingIdle";
  HappyIdle[0].name = "HappyIdle";

  const { actions } = useAnimations(
    [StandingGreeting[0], FallingIdle[0], HappyIdle[0]],
    group
  );

  // Sobe um pouco no início da queda, flutua durante o trânsito e
  // afunda levemente na aterrissagem antes de assentar no chão.
  const yOffset = useTransform(
    progress,
    [0, 0.15, 0.75, 0.85, 1],
    [0, 0.35, 0.35, -0.12, 0]
  );
  const xOffset = useTransform(progress, [0.15, 0.45, 0.8], [0, -0.25, 0]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.y = MathUtils.damp(
      group.current.position.y,
      yOffset.get(),
      6,
      delta
    );
    group.current.position.x = MathUtils.damp(
      group.current.position.x,
      xOffset.get(),
      6,
      delta
    );
  });

  useEffect(() => {
    const action = actions[animation];
    if (!action) return;
    const fade = animation === "HappyIdle" ? 0.25 : 0.3;
    action.reset().fadeIn(fade).play();
    return () => {
      action.fadeOut(fade);
    };
  }, [actions, animation]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={clone} scale={1} position={[0, -1, 0]} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/684a2a502f4b144e19983160.glb");
