import type { ModelType } from "@/features/modelManagment/modelTypes";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ARViewerPageHTML.module.css";
import { API_BASE } from "@/app/api/config";
import { PageLoader } from "@/shared/ui/pageLoader/PageLoader";
import { useModelScale } from "@/shared/hooks/useModelScale";
import { ControlsPanel } from "@/shared/ui/ControlsPanel/ControlsPanel";
import { Button } from "antd";

export const ARViewerPageHTML = () => {
  const { modelName } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [soundData, setSoundData] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "modelLoaded") {
        setIsLoading(false);
      }
      if (event.data?.type === "modelError") {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => setInstructionsVisible(false), 5000);
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (modelName) {
      setIsLoading(true);
      fetch(`${API_BASE}/api/models/${modelName}/info`)
        .then((res) => res.json())
        .then(setCurrentModel)
        .catch((err: Error) => {
          setIsError(true);
          setErrorMessage(err.message);
        });
    }
  }, [modelName]);

  useEffect(() => {
    if (!currentModel?.soundUrl) return;
    fetch(`${API_BASE}${currentModel.soundUrl}`)
      .then((res) => res.ok)
      .then((status) => {
        if (status) {
          audioRef.current = new Audio(`${API_BASE}${currentModel.soundUrl}`!);
          audioRef.current.loop = true;
          audioRef.current.preload = "auto";
        }
        setSoundData(status);
      })
      .catch((err) => {
        setSoundData(false);
        console.error(err);
      });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentModel]);

  const sendScaleToIframe = (scale: number) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "setScale", scale },
        "*",
      );
    }
  };

  const {
    decreaseScale,
    increaseScale,
    modelScale,
    resetScale,
    setModelScale,
  } = useModelScale(sendScaleToIframe);

  const iframeUrl =
    currentModel?.modelUrl && currentModel?.patternUrl
      ? `/ar-scene.html?model=${encodeURIComponent(currentModel.modelUrl)}
        &marker=${encodeURIComponent(currentModel.patternUrl)}
        &apiBase=${encodeURIComponent(API_BASE)}`
      : "";

  const handleIframeLoad = () => {
    sendScaleToIframe(modelScale);
  };

  return (
    <div className={styles.container}>
      {isError ? (
        <div style={{ color: "red", fontWeight: "500" }}>{errorMessage}</div>
      ) : null}
      {iframeUrl && (
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          onLoad={handleIframeLoad}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            zIndex: 1,
          }}
          title="AR Scene"
          allow="camera; microphone; autoplay; encrypted-media"
        />
      )}
      {isLoading ? <PageLoader /> : null}

      <ControlsPanel
        decreaseScale={decreaseScale}
        increaseScale={increaseScale}
        resetScale={resetScale}
        setModelScale={setModelScale}
        modelScale={modelScale}
        sendScaleToIframe={sendScaleToIframe}
      />

      {soundData && (
        <div className={styles.soundControls} style={{ zIndex: 10 }}>
          <button
            onClick={() => audioRef.current?.play()}
            className={styles.soundButton}
          >
            ▶ Включить звук
          </button>
          <button
            onClick={() => audioRef.current?.pause()}
            className={`${styles.soundButton} ${styles.soundButtonPause}`}
          >
            ⏸ Выключить звук
          </button>
        </div>
      )}

      <div className={styles.backButtonContainer}>
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

      {instructionsVisible && (
        <div className={styles.instruction} style={{ zIndex: 10 }}>
          <p>1. Разрешите доступ к камере</p>
          <p>2. Наведите камеру на маркер</p>
        </div>
      )}
    </div>
  );
};

export default ARViewerPageHTML;
