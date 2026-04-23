import { useState } from "react";

export const useModelScale = (sendScaleToIframe?: (scale: number) => void) => {
  const [modelScale, setModelScale] = useState(1);

  const increaseScale = () => {
    const newScale = Math.min(modelScale + 0.03, 10);
    setModelScale(newScale);
    if (sendScaleToIframe) {
      sendScaleToIframe(newScale);
    }
  };

  const decreaseScale = () => {
    const newScale = Math.max(modelScale - 0.03, 0.01);
    setModelScale(newScale);
    if (sendScaleToIframe) {
      sendScaleToIframe(newScale);
    }
  };

  const resetScale = () => {
    setModelScale(1);
    if (sendScaleToIframe) {
      sendScaleToIframe(1);
    }
  };

  return {
    modelScale,
    increaseScale,
    decreaseScale,
    resetScale,
    setModelScale,
  };
};
