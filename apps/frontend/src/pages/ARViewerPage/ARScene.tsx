import { useEffect, useRef, useState } from "react";

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
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
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

      {soundData && (
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={() => audioRef.current?.play()}
            style={{
              width: "20%",
              color: "white",
            }}
          >
            ▶ Включить звук
          </button>
          <button
            onClick={() => audioRef.current?.pause()}
            style={{
              width: "20%",
              background: "white",
              color: "#5e35b1",
            }}
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
