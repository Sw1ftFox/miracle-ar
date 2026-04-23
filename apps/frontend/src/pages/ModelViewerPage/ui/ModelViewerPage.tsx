import { useEffect } from "react";
import Link from "@shared/ui/link/Link";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { fetchCurrentModel } from "@features/modelManagment/modelsSlice";
import styles from "./ModelViewerPage.module.css";
import { API_BASE } from "@/app/api/config";
import ErrorBoundary from "@/app/providers/ErrorBoundary/ErrorBoundary";
import { ModelCanvas } from "@/widgets/ModelCanvas";
import type { ModelState } from "@/features/modelManagment/modelTypes";
import { useModelScale } from "@/shared/hooks/useModelScale";
import { ControlsPanel } from "@/shared/ui/ControlsPanel/ControlsPanel";

export const ModelViewerPage = () => {
  const { modelName } = useParams();

  const {
    decreaseScale,
    increaseScale,
    modelScale,
    resetScale,
    setModelScale,
  } = useModelScale();

  const { currentModel, isError } = useSelector<RootState, ModelState>(
    (state) => state.modelsReducer,
  );
  const dispatch = useDispatch<AppDispatch>();
  const fullModelUrl = currentModel?.modelUrl
    ? `${API_BASE}${currentModel.modelUrl}`
    : undefined;

  useEffect(() => {
    dispatch(fetchCurrentModel(modelName || ""));
  }, [modelName]);

  if (isError) {
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
      <ControlsPanel
        decreaseScale={decreaseScale}
        increaseScale={increaseScale}
        resetScale={resetScale}
        setModelScale={setModelScale}
        modelScale={modelScale}
      />

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
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
