import type { ModelType } from "@features/modelManagment/types";
import ARScene from "@pages/ARViewerPage/ARScene";
import Link from "@shared/ui/link/Link";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ARViewerPage = () => {
  const { modelName } = useParams();
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);

  useEffect(() => {
    if (modelName) {
      fetch(`/api/models/${modelName}/info`)
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
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ARScene
        modelUrl={modelUrl}
        markerPatternUrl={markerPatternUrl}
        soundUrl={soundUrl}
      />
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
      </div>
    </div>
  );
};

export default ARViewerPage;
