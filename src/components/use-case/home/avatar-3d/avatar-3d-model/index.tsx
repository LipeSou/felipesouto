"use client";

import React, { useEffect, useRef } from "react";
import { useFrame, useGraph } from "@react-three/fiber";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import {
  Color,
  Euler,
  MathUtils,
  Object3D,
  Quaternion,
  Vector3,
  type Object3DEventMap,
  type PointLight,
  type SkinnedMesh,
} from "three";
import { useTransform, type MotionValue } from "framer-motion";

interface Avatar3DProps {
  [key: string]: unknown;
  animation: string;
  progress: MotionValue<number>;
  focusColor: string | null;
  lookX: MotionValue<number>;
  lookY: MotionValue<number>;
  speaking: MotionValue<number>;
}

const DEFAULT_CAMERA = new Vector3(0, 2, 5);
const ORIGIN = new Vector3(0, 0, 0);

// Rotação extra aplicada por cima da animação. O mixer só reescreve o
// osso quando o valor do clip muda, então desfazemos o offset anterior
// antes de aplicar o novo para ele nunca acumular.
type BoneOffset = { base: Quaternion; applied: Quaternion };
const makeBoneOffset = (): BoneOffset => ({
  base: new Quaternion(),
  applied: new Quaternion(),
});

function applyBoneOffset(bone: Object3D, state: BoneOffset, offset: Quaternion) {
  if (bone.quaternion.equals(state.applied)) {
    bone.quaternion.copy(state.base);
  } else {
    state.base.copy(bone.quaternion);
  }
  bone.quaternion.multiply(offset);
  state.applied.copy(bone.quaternion);
}

function setMorph(mesh: SkinnedMesh | undefined, name: string, value: number) {
  const index = mesh?.morphTargetDictionary?.[name];
  if (mesh?.morphTargetInfluences && index !== undefined) {
    mesh.morphTargetInfluences[index] = value;
  }
}

export default function Avatar3DModel(props: Avatar3DProps) {
  const { animation, progress, focusColor, lookX, lookY, speaking } = props;
  const group = useRef<Object3D<Object3DEventMap> | null>(null);
  const light = useRef<PointLight>(null);
  const rig = useRef({
    focus: 0,
    lookX: 0,
    lookY: 0,
    mouth: 0,
    hasHead: false,
    head: new Vector3(),
    headNow: new Vector3(),
    cameraTo: new Vector3(),
    target: new Vector3(),
    targetTo: new Vector3(),
    color: new Color("#ffffff"),
    euler: new Euler(),
    headOffset: new Quaternion(),
    neckOffset: new Quaternion(),
    headState: makeBoneOffset(),
    neckState: makeBoneOffset(),
  });
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

  // Registrado depois do useAnimations: roda após o mixer em cada frame,
  // então o que é escrito nos ossos aqui vale por cima do clip.
  useFrame((state, delta) => {
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

    const r = rig.current;
    const head = nodes.Head as Object3D | undefined;
    const neck = nodes.Neck as Object3D | undefined;

    // Olhar: a cabeça (e um pouco o pescoço) acompanha o cursor.
    r.lookX = MathUtils.damp(r.lookX, lookX.get(), 5, delta);
    r.lookY = MathUtils.damp(r.lookY, lookY.get(), 5, delta);
    if (head) {
      r.headOffset.setFromEuler(r.euler.set(r.lookY * 0.26, r.lookX * 0.5, 0));
      applyBoneOffset(head, r.headState, r.headOffset);
    }
    if (neck) {
      r.neckOffset.setFromEuler(r.euler.set(r.lookY * 0.1, r.lookX * 0.2, 0));
      applyBoneOffset(neck, r.neckState, r.neckOffset);
    }

    // Foco: a câmera vai da posição normal até um close no rosto.
    r.focus = MathUtils.damp(r.focus, focusColor ? 1 : 0, 3, delta);
    const t = MathUtils.smootherstep(r.focus, 0, 1);

    if (head) {
      head.updateWorldMatrix(true, false);
      head.getWorldPosition(r.headNow);
      if (!r.hasHead) {
        r.head.copy(r.headNow);
        r.hasHead = true;
      }
      // Segue a cabeça com atraso: o rosto fica enquadrado sem "travar"
      // o balanço da animação idle.
      r.head.x = MathUtils.damp(r.head.x, r.headNow.x, 4, delta);
      r.head.y = MathUtils.damp(r.head.y, r.headNow.y, 4, delta);
      r.head.z = MathUtils.damp(r.head.z, r.headNow.z, 4, delta);

      const aspect = state.size.width / state.size.height;
      // Canvas largo (mobile): câmera mais longe e mirando acima do rosto,
      // para ele ficar na metade de baixo do quadro e o texto caber em cima.
      const wide = aspect > 0.75;
      const distance = wide ? 1.5 : MathUtils.clamp(0.9 / aspect, 1, 2.6);
      const lift = wide ? 0.27 : 0.09;
      r.targetTo.set(r.head.x, r.head.y + lift, r.head.z);
      r.cameraTo.set(r.head.x - 0.12, r.head.y + lift + 0.02, r.head.z + distance);

      state.camera.position.lerpVectors(DEFAULT_CAMERA, r.cameraTo, t);
      r.target.lerpVectors(ORIGIN, r.targetTo, t);
      state.camera.lookAt(r.target);

      // O "planeta" ilumina o rosto com a cor da tech.
      if (light.current) {
        if (focusColor) r.color.set(focusColor);
        light.current.color.lerp(r.color, 1 - Math.exp(-6 * delta));
        light.current.intensity = t * 8;
        light.current.position.set(
          r.head.x - 1,
          r.head.y + 0.15,
          r.head.z + 0.7
        );
      }
    }

    // Boca mexe enquanto o texto do detalhe é digitado.
    const time = state.clock.elapsedTime;
    const mouthTarget =
      speaking.get() > 0
        ? 0.1 +
          0.3 * Math.abs(Math.sin(time * 11)) * (0.6 + 0.4 * Math.sin(time * 3.7))
        : 0;
    r.mouth = MathUtils.damp(r.mouth, mouthTarget, 14, delta);
    setMorph(nodes.Wolf3D_Head, "mouthOpen", r.mouth);
    setMorph(nodes.Wolf3D_Teeth, "mouthOpen", r.mouth);
    setMorph(nodes.Wolf3D_Head, "mouthSmile", t * 0.3);
    setMorph(nodes.Wolf3D_Teeth, "mouthSmile", t * 0.3);
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
    <>
    <pointLight ref={light} intensity={0} distance={6} decay={2} />
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
    </>
  );
}

useGLTF.preload("/models/684a2a502f4b144e19983160.glb");
