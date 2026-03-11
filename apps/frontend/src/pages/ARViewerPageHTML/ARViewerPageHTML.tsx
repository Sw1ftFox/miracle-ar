import type { ModelType } from "@features/modelManagment/types";
import Link from "@shared/ui/link/Link";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./ARViewerPageHTML.module.css";
import { API_BASE } from "@/api/config";

const ARViewerPageHTML = () => {
  const { modelName } = useParams();
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [modelScale, setModelScale] = useState(1);
  const [soundData, setSoundData] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Инструкции исчезают через 5 секунд
  useEffect(() => {
    const timerId = setTimeout(() => setInstructionsVisible(false), 5000);
    return () => clearTimeout(timerId);
  }, []);

  // Загрузка модели по имени
  useEffect(() => {
    if (modelName) {
      fetch(`${API_BASE}/api/models/${modelName}/info`)
        .then((res) => res.json())
        .then(setCurrentModel)
        .catch((err) => console.error(err));
    }
  }, [modelName]);

  // Загрузка звука
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

  // Функции масштабирования
  const increaseScale = () => {
    const newScale = Math.min(modelScale + 0.03, 10);
    setModelScale(newScale);
    sendScaleToIframe(newScale);
  };

  const decreaseScale = () => {
    const newScale = Math.max(modelScale - 0.03, 0.01);
    setModelScale(newScale);
    sendScaleToIframe(newScale);
  };

  const resetScale = () => {
    setModelScale(1);
    sendScaleToIframe(1);
  };

  // Отправка масштаба в iframe
  const sendScaleToIframe = (scale: number) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "setScale", scale },
        "*",
      );
    }
  };

  // Формируем URL для iframe
  const iframeUrl =
    currentModel?.modelUrl && currentModel?.patternUrl
      ? `/ar-scene.html?model=${encodeURIComponent(currentModel.modelUrl)}&marker=${encodeURIComponent(currentModel.patternUrl)}&apiBase=${encodeURIComponent(API_BASE)}`
      : "";

  const handleIframeLoad = () => {
    // Отправляем начальный масштаб после загрузки iframe
    sendScaleToIframe(modelScale);
  };

  return (
    <div className={styles.container}>
      {/* iframe с AR-сценой на заднем плане */}
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

      {/* Элементы управления поверх iframe */}
      <div className={styles.controlsPanel} style={{ zIndex: 10 }}>
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
              onChange={(e) => {
                const newScale = parseFloat(e.target.value);
                setModelScale(newScale);
                sendScaleToIframe(newScale);
              }}
              className={styles.sliderInput}
            />
          </label>
        </div>
      </div>

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

      <div className={styles.backButtonContainer} style={{ zIndex: 10 }}>
        <Link content="Вернуться в меню" link="/models" />
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
