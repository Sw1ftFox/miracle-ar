import { useEffect, useState } from "react";
import type { AppState } from "@features/modelManagment/types";
import Link from "@shared/ui/link/Link";
import { useParams } from "react-router-dom";
import ErrorBoundary from "@shared/ui/errorBoundary/ErrorBoundary";
import ModelCanvas from "./ModelCanvas";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { fetchCurrentModel } from "@features/modelManagment/modelsSlice";

const ModelViewerPage = () => {
  const { modelName } = useParams();
  const [modelScale, setModelScale] = useState(1);
  const [canvasKey, setCanvasKey] = useState(0);

  const { currentModel, isLoading, isError } = useSelector<RootState, AppState>(
    (state) => state.modelsReducer
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentModel(modelName || ""));
    setCanvasKey((prev) => prev + 1);
  }, [modelName]);

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

  if (isLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div>Загрузка модели...</div>
      </div>
    );
  }

  if (isError || !currentModel) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Ошибка загрузки модели</h2>
        <Link
          content="Вернуться в меню"
          link="/models"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "white",
            color: "#1a1a1a",
            borderRadius: "4px",
          }}
        />
      </div>
    );
  }

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

      <ErrorBoundary>
        <ModelCanvas
          modelUrl={currentModel?.modelUrl}
          modelScale={modelScale}
        ></ModelCanvas>
      </ErrorBoundary>
    </div>
  );
};

export default ModelViewerPage;
