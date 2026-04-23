import { useState, type Dispatch, type SetStateAction } from "react";
import styles from "./ControlsPanel.module.css";
import { Button, Flex } from "antd";
import { FullscreenExitOutlined } from "@ant-design/icons";

interface ControlsPanelProps {
  decreaseScale: () => void;
  increaseScale: () => void;
  resetScale: () => void;
  setModelScale: Dispatch<SetStateAction<number>>;
  modelScale: number;
  sendScaleToIframe?: (scale: number) => void;
}

export const ControlsPanel = ({
  decreaseScale,
  increaseScale,
  resetScale,
  setModelScale,
  modelScale,
  sendScaleToIframe,
}: ControlsPanelProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const content = isOpen ? (
    <>
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
              if (sendScaleToIframe) {
                sendScaleToIframe(newScale);
              }
            }}
            className={styles.sliderInput}
          />
        </label>
      </div>
    </>
  ) : null;
  return (
    <div className={styles.controlsPanel} style={{ zIndex: 10 }}>
      <h4 className={styles.panelTitle}>
        {isOpen ? (
          <Flex align="center" justify="space-between">
            Масштаб модели
            <Button
              color="default"
              variant="text"
              onClick={() => setIsOpen(false)}
            >
              <FullscreenExitOutlined />
            </Button>
          </Flex>
        ) : (
          <Flex justify="center">
            <Button
              color="default"
              variant="text"
              onClick={() => setIsOpen(true)}
              style={{
                fontWeight: 600,
              }}
            >
              Открыть панель
            </Button>
          </Flex>
        )}
      </h4>

      {content}
    </div>
  );
};
