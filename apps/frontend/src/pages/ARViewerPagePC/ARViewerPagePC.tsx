import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ARModel from "@features/AREngine/ARModel";

const ARViewerPagePC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#1a1a1a",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50, // Угол обзора камеры
          near: 0.1, // Ближняя плоскость отсечения
          far: 1000, // Дальняя плоскость отсечения
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
          <ARModel
            modelUrl="/api/files/models/Полонский.glb"
            position={[0, -1, 0]}
            scale={1}
            autoRotate={true}
          />
        </Suspense>
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          background: "rgba(0,0,0,0.7)",
          padding: "10px 20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h3>Тест компонента ARModel</h3>
        <p>Если видите вращающуюся 3D модель - компонент работает!</p>
      </div>
    </div>
  );
};

export default ARViewerPagePC;
