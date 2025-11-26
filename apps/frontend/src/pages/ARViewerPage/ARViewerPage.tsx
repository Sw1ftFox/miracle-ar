import { type RootState } from "@/app/store";
import type { ModelType } from "@/features/modelManagment/types";
import ARScene from "@features/AREngine/ARScene";
import { useSelector } from "react-redux";
import Link from "@shared/ui/link/Link";

const ARViewerPage = () => {
  const currentModel = useSelector<RootState, ModelType | null>((state) => {
    return state.modelsReducer.currentModel;
  });

  const modelUrl = currentModel?.modelUrl;
  const markerPatternUrl = currentModel?.patternUrl;

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <ARScene modelUrl={modelUrl} markerPatternUrl={markerPatternUrl} />
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <Link
          content="Вернуться в меню"
          link="/models"
        />
      </div>

      {/* Инструкция для тестирования */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          zIndex: 1000,
          maxWidth: "90%",
        }}
      >
        <p>1. Разрешите доступ к камере</p>
        <p>2. Наведите камеру на маркер</p>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
          <p>Модель: {modelUrl}</p>
          <p>Маркер: {markerPatternUrl}</p>
        </div>
      </div>
    </div>
  );
};

export default ARViewerPage;
