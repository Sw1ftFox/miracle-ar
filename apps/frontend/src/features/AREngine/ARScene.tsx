import { useEffect, useState } from "react";

interface ARSceneProps {
  modelUrl: string | undefined;
  markerPatternUrl?: string;
}

const ARScene: React.FC<ARSceneProps> = ({ modelUrl, markerPatternUrl }) => {
  const [debugInfo, setDebugInfo] = useState({
    markerFound: false,
    modelLoaded: false,
    patternLoaded: false,
  });

  useEffect(() => {
    console.log("🔧 Debug - Model URL:", modelUrl);
    console.log("🔧 Debug - Marker Pattern URL:", markerPatternUrl);

    // Проверяем загрузку паттерна
    if (markerPatternUrl) {
      fetch(markerPatternUrl)
        .then((response) => {
          console.log("🔧 Pattern fetch status:", response.status);
          return response.text();
        })
        .then((data) => {
          console.log(
            "🔧 Pattern content (first 100 chars):",
            data.substring(0, 100)
          );
          setDebugInfo((prev) => ({ ...prev, patternLoaded: true }));
        })
        .catch((error) => {
          console.error("🔧 Pattern load error:", error);
        });
    }

    const scene = document.querySelector("a-scene");
    if (scene) {
      scene.addEventListener("loaded", () => {
        console.log("✅ A-Frame scene loaded");
      });

      // Слушаем события маркера
      scene.addEventListener("markerFound", (event) => {
        console.log("🎯 Marker found!", event.target);
        setDebugInfo((prev) => ({ ...prev, markerFound: true }));
      });

      scene.addEventListener("markerLost", (event) => {
        console.log("❌ Marker lost", event.target);
        setDebugInfo((prev) => ({ ...prev, markerFound: false }));
      });

      // Слушаем события загрузки модели
      scene.addEventListener("model-loaded", () => {
        console.log("✅ Model loaded successfully!");
        setDebugInfo((prev) => ({ ...prev, modelLoaded: true }));
      });
    }
  }, [modelUrl, markerPatternUrl]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <a-scene
        embedded
        arjs="patternRatio: 0.75; sourceType: webcam; debugUIEnabled: true;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true;"
        sound
      >
        {markerPatternUrl ? (
          <a-marker type="pattern" url={markerPatternUrl}>
            <a-entity
              gltf-model={`url(${modelUrl})`}
              position="0 0 0"
              scale="0.5 0.5 0.5"
              rotation="0 0 0"
              animation-mixer="clip: *"
            />
          </a-marker>
        ) : (
          <a-marker preset="hiro">
            <a-entity
              gltf-model={`url(${modelUrl})`}
              position="0 0 0"
              scale="0.5 0.5 0.5"
              rotation="0 0 0"
            />
          </a-marker>
        )}

        <a-entity camera></a-entity>
      </a-scene>

      {/* Отладочная информация */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "15px",
          borderRadius: "10px",
          fontSize: "14px",
          zIndex: 1000,
          minWidth: "250px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#4dabf7" }}>
          🔧 Отладка AR
        </h4>
        <div style={{ marginBottom: "5px" }}>
          📍 Маркер:{" "}
          <span
            style={{ color: debugInfo.markerFound ? "#4CAF50" : "#ff6b6b" }}
          >
            {debugInfo.markerFound ? "Найден" : "Не найден"}
          </span>
        </div>
        <div style={{ marginBottom: "5px" }}>
          🎯 Паттерн:{" "}
          <span
            style={{ color: debugInfo.patternLoaded ? "#4CAF50" : "#ff6b6b" }}
          >
            {debugInfo.patternLoaded ? "Загружен" : "Загрузка..."}
          </span>
        </div>
        <div style={{ marginBottom: "5px" }}>
          🎨 Модель:{" "}
          <span
            style={{ color: debugInfo.modelLoaded ? "#4CAF50" : "#ff6b6b" }}
          >
            {debugInfo.modelLoaded ? "Загружена" : "Загрузка..."}
          </span>
        </div>
        {debugInfo.markerFound && !debugInfo.modelLoaded && (
          <div style={{ color: "#ff9800", fontSize: "12px", marginTop: "8px" }}>
            ⚠️ Маркер найден, но модель не загружается
          </div>
        )}
      </div>
    </div>
  );
};

export default ARScene;
