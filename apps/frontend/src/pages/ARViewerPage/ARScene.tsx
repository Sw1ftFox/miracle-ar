import { useEffect, useRef, useState } from "react";
import styles from "./ARScene.module.css";

interface ARSceneProps {
  modelUrl: string | undefined;
  markerPatternUrl?: string;
  soundUrl?: string;
}

const ARScene: React.FC<ARSceneProps> = ({
  modelUrl,
  markerPatternUrl,
  soundUrl,
}) => {
  const [modelScale, setModelScale] = useState(1);
  const [soundData, setSoundData] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    if (!soundUrl) return;
    fetch(soundUrl)
      .then((res) => res.ok)
      .then((status) => {
        if (status) {
          audioRef.current = new Audio(soundUrl);
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
  }, [soundUrl]);

  return (
    <div className={styles.sceneContainer}>
      <div className={styles.controlsPanel}>
        <h4 className={styles.panelTitle}>Масштаб модели</h4>

        <div className={styles.scaleDisplay}>
          <strong>Текущий: {modelScale.toFixed(1)}x</strong>
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
              min="0.1"
              max="10"
              step="0.1"
              value={modelScale}
              onChange={(e) => setModelScale(parseFloat(e.target.value))}
              className={styles.sliderInput}
            />
          </label>
        </div>
      </div>

      {soundData && (
        <div className={styles.soundControls}>
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

      <a-scene
        embedded
        arjs="sourceType: webcam; patternRatio: 0.75; debugUIEnabled: false; trackingMethod: best;"
        sound
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true;"
        cursor="rayOrigin: mouse"
        raycaster="objects: .clickable"
      >
        {/* {soundData && (
          <a-assets>
            <audio id="model-sound" src={soundUrl} preload="auto"></audio>
          </a-assets>
        )} */}
        {markerPatternUrl ? (
          <a-marker
            type="pattern"
            url={markerPatternUrl}
            smooth
            smoothCount="10"
            smoothTolerance="0.01"
          >
            <a-entity
              gltf-model={modelUrl}
              animation-mixer="clip: *"
              sound-handler
              gltf-model-loaded="events: model-loaded;"
              scale={`${modelScale} ${modelScale} ${modelScale}`}
            />
          </a-marker>
        ) : (
          ""
        )}
        {/* {soundData && (
          <a-entity sound="src: #model-sound; autoplay: false; loop: true; volume: 0.5;" />
        )} */}
        <a-camera
          position="0 0 0"
          look-controls="enabled: false"
          wasd-controls="enabled: false"
        ></a-camera>
      </a-scene>
    </div>
  );
};

export default ARScene;
