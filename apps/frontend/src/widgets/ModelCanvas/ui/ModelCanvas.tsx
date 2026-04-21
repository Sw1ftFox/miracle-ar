import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PageLoader } from "@/shared/ui/PageLoader/PageLoader";
import { PreviewModel } from "@/widgets/PreviewModel";

type ModelCanvasType = {
  modelUrl: string | undefined;
  modelScale: number;
};

export const ModelCanvas = ({ modelUrl, modelScale }: ModelCanvasType) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50, // Угол обзора камеры
          near: 0.1, // Ближняя плоскость отсечения
          far: 1000, // Дальняя плоскость отсечения
        }}
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          antialias: true,
        }}
      >
        {/* 
          Освещение сцены - обязательно для видимости моделей 
          AmbientLight - рассеянный свет со всех сторон
          DirectionalLight - направленный свет (как солнце)
        */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <PreviewModel
          modelUrl={modelUrl}
          position={[0, -1.3, 0]}
          scale={modelScale}
          autoRotate={true}
        />
      </Canvas>
    </Suspense>
  );
};
