import { useEffect, useState } from "react";

interface ARSceneProps {
  modelUrl: string | undefined;
  markerPatternUrl?: string;
}

const ARScene: React.FC<ARSceneProps> = ({ modelUrl, markerPatternUrl }) => {
  const [modelScale, setModelScale] = useState(1);

  const increaseScale = () => {
    const newScale = Math.min(modelScale + 0.1, 6);
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
    const preventAFrameMargin = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            if (
              document.body.style.marginTop &&
              document.body.style.marginTop !== "0px"
            ) {
              console.log(
                "Prevented A-Frame margin:",
                document.body.style.marginTop
              );
              document.body.style.marginTop = "";
            }
          }
        });
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["style"],
      });

      return () => observer.disconnect();
    };

    preventAFrameMargin();
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
              max="6"
              step="0.1"
              value={modelScale}
              onChange={(e) => setModelScale(parseFloat(e.target.value))}
              style={{ width: "100%", marginTop: "5px" }}
            />
          </label>
        </div>
      </div>
      <a-scene
        embedded
        arjs="sourceType: webcam; patternRatio: 0.75; debugUIEnabled: false; trackingMethod: best;"
        sound
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true;"
        cursor="rayOrigin: mouse"
        raycaster="objects: .clickable"
      >
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
              //           events="model-loaded: function(e) {
              //   const box = new THREE.Box3().setFromObject(this.object3D);
              //   const height = box.max.y - box.min.y;
              //   this.setAttribute('position', {y: height/2, x: 0, z: 0});
              // }"
              // rotation="-90 0 0"
              // scale="0.5 0.5 0.5"
              // position="0 0 -1.7"
              // scale="0.8 0.8 0.8"
              // rotation="0 0 0"
              // arjs-rotation-control="enabled: true; minY: -5; maxY: 5;"
            />
          </a-marker>
        ) : (
          ""
          // <a-marker preset="hiro">
          //   <a-entity
          //     gltf-model={modelUrl}
          //     position="0 1 -1.7"
          //     scale="0.8 0.8 0.8"
          //     rotation="0 0 0"
          //     arjs-rotation-control="enabled: true; minY: -5; maxY: 5;"
          //   />
          // </a-marker>
        )}
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
