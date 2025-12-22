import { Canvas } from "@react-three/fiber";
import PreviewModel from "@pages/ModelViewerPage/PreviewModel";
import { Suspense } from "react";

type ModelCanvasType = {
  modelUrl: string | undefined;
  modelScale: number;
};

const ModelCanvas = ({ modelUrl, modelScale }: ModelCanvasType) => {
  return (
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

      {/*
          Suspense для асинхронной загрузки модели
          fallback={null} значит ничего не показываем во время загрузки
        */}
      <Suspense fallback={null}>
        <PreviewModel
          modelUrl={modelUrl}
          position={[0, -1.3, 0]}
          scale={modelScale}
          autoRotate={true}
        />
      </Suspense>
    </Canvas>
  );
};

export default ModelCanvas;
