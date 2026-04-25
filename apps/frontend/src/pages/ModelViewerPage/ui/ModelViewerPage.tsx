import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
import { Button } from "antd";

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
        <Link to={"/models"}>
          <Button
            variant="solid"
            color="purple"
            style={{
              fontWeight: 600,
              padding: 18,
              borderRadius: 12,
            }}
          >
            Вернуться в меню
          </Button>
        </Link>
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
        <Link to={"/models"}>
          <Button
            variant="solid"
            color="purple"
            style={{
              fontWeight: 600,
              padding: 18,
              borderRadius: 12,
            }}
          >
            Вернуться в меню
          </Button>
        </Link>
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
