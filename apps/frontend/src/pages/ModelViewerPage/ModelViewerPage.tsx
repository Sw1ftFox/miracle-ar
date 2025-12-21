import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import PreviewModel from "@pages/ModelViewerPage/PreviewModel";
import type { ModelType } from "@features/modelManagment/types";
import Link from "@shared/ui/link/Link";
import { useParams } from "react-router-dom";

const ModelViewerPage = () => {
  const { modelName } = useParams();
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);
  const [modelScale, setModelScale] = useState(1);

  useEffect(() => {
    if (modelName) {
      fetch(`/api/models/${modelName}/info`)
        .then((res) => res.json())
        .then(setCurrentModel)
        .catch((err) => console.error(err));
    }
  }, [modelName]);

  const modelUrl = currentModel?.modelUrl;

  const increaseScale = () => {
    const newScale = Math.min(modelScale + 0.1, 10);
    setModelScale(newScale);
  };

  const decreaseScale = () => {
    const newScale = Math.max(modelScale - 0.1, 0.1);
    setModelScale(newScale);
  };

  const resetScale = () => {
    setModelScale(1);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#1a1a1a",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          background: "rgba(255,255,255,0.9)",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          minWidth: "200px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Масштаб модели</h4>

        <div style={{ marginBottom: "10px", color: "#333" }}>
          <strong>Текущий: {modelScale.toFixed(1)}x</strong>
        </div>

        <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
          <button
            onClick={decreaseScale}
            style={{
              flex: 1,
              padding: "8px",
              background: "#ff4757",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            -
          </button>
          <button
            onClick={increaseScale}
            style={{
              flex: 1,
              padding: "8px",
              background: "#2ed573",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            +
          </button>
          <button
            onClick={resetScale}
            style={{
              flex: 1,
              padding: "8px",
              background: "#3742fa",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Сброс
          </button>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "12px", color: "#666" }}>
            Точная настройка:
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={modelScale}
              onChange={(e) => setModelScale(parseFloat(e.target.value))}
              style={{ width: "100%", marginTop: "5px" }}
            />
          </label>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <Link content="Вернуться в меню" link="/models" />
      </div>

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
          <PreviewModel
            modelUrl={modelUrl}
            position={[0, -1.3, 0]}
            scale={modelScale}
            autoRotate={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewerPage;
