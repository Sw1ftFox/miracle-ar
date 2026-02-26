import { useEffect, useState } from "react";
import type { AppState } from "@features/modelManagment/types";
import Link from "@shared/ui/link/Link";
import { useParams } from "react-router-dom";
import ErrorBoundary from "@shared/ui/errorBoundary/ErrorBoundary";
import ModelCanvas from "./ModelCanvas";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { fetchCurrentModel } from "@features/modelManagment/modelsSlice";
import styles from "./ModelViewerPage.module.css";
import { API_BASE } from "@/api/config";

const ModelViewerPage = () => {
  const { modelName } = useParams();
  const [modelScale, setModelScale] = useState(1);

  const { currentModel, isLoading, isError } = useSelector<RootState, AppState>(
    (state) => state.modelsReducer,
  );
  const dispatch = useDispatch<AppDispatch>();
  const fullModelUrl = currentModel?.modelUrl
    ? `${API_BASE}${currentModel.modelUrl}`
    : undefined;

  useEffect(() => {
    dispatch(fetchCurrentModel(modelName || ""));
  }, [modelName]);

  const increaseScale = () => {
    const newScale = Math.min(modelScale + 0.03, 10);
    setModelScale(newScale);
  };

  const decreaseScale = () => {
    const newScale = Math.max(modelScale - 0.03, 0.01);
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
    <div className={styles.container}>
      <div className={styles.controlsPanel}>
        <h4 className={styles.panelTitle}>Масштаб модели</h4>

        <div className={styles.scaleDisplay}>
          <strong>Текущий: {modelScale.toFixed(2)}x</strong>
        </div>

        <div className={styles.buttonGroup}>
          <button
            onClick={decreaseScale}
            className={`${styles.controlButton} ${styles.buttonDecrease}`}
          >
            -
          </button>
          <button
            onClick={increaseScale}
            className={`${styles.controlButton} ${styles.buttonIncrease}`}
          >
            +
          </button>
          <button
            onClick={resetScale}
            className={`${styles.controlButton} ${styles.buttonReset}`}
          >
            Сброс
          </button>
        </div>

        <div>
          <label className={styles.sliderLabel}>
            Точная настройка:
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.03"
              value={modelScale}
              onChange={(e) => setModelScale(parseFloat(e.target.value))}
              className={styles.sliderInput}
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
          modelUrl={fullModelUrl}
          modelScale={modelScale}
        ></ModelCanvas>
      </ErrorBoundary>
    </div>
  );
};

export default ModelViewerPage;
