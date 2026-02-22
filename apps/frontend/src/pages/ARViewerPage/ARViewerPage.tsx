import type { ModelType } from "@features/modelManagment/types";
import ARScene from "@pages/ARViewerPage/ARScene";
import Link from "@shared/ui/link/Link";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ARViewerPage.module.css";
import { API_BASE } from "@/api/config";

const ARViewerPage = () => {
  const { modelName } = useParams();
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => setInstructionsVisible(false), 5000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (modelName) {
      fetch(`${API_BASE}/api/models/${modelName}/info`)
        .then((res) => res.json())
        .then(setCurrentModel)
        .catch((err) => console.error(err));
    }
  }, [modelName]);

  const modelUrl = currentModel?.modelUrl;
  const markerPatternUrl = currentModel?.patternUrl;
  const soundUrl = currentModel?.soundUrl;

  useEffect(() => {
    const forceHideScroll = () => {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    };

    forceHideScroll();

    const scrollCheckInterval = setInterval(forceHideScroll, 1000);

    return () => {
      clearInterval(scrollCheckInterval);
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    };
  }, []);

  useEffect(() => {
    const stopCamera = () => {
      const streams = document.querySelectorAll("video, audio");
      streams.forEach((media) => {
        if (
          media instanceof HTMLVideoElement ||
          media instanceof HTMLAudioElement
        ) {
          media.pause();
          if (media.srcObject) {
            const stream = media.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            media.srcObject = null;
          }
        }
      });
    };

    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={styles.container}>
      <ARScene
        modelUrl={modelUrl}
        markerPatternUrl={markerPatternUrl}
        soundUrl={soundUrl}
      />
      <div className={styles.backButtonContainer}>
        <Link content="Вернуться в меню" link="/models" />
      </div>
      {instructionsVisible && (
        <div className={styles.instruction}>
          <p>1. Разрешите доступ к камере</p>
          <p>2. Наведите камеру на маркер</p>
        </div>
      )}
    </div>
  );
};

export default ARViewerPage;
