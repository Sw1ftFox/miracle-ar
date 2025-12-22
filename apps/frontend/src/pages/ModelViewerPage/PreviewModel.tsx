import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

interface PreviewModelProps {
  modelUrl: string | undefined;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  autoRotate?: boolean;
}

const PreviewModel = ({
  modelUrl,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  autoRotate = true,
}: PreviewModelProps) => {
  const modelRef = useRef<Group>(null);

  const { scene } = useGLTF(modelUrl || "", true);

  useFrame((_, delta) => {
    if (modelRef.current && autoRotate) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group
      ref={modelRef}
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
    >
      {scene ? <primitive object={scene} /> : null}
    </group>
  );
};

export default PreviewModel;
