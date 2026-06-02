import type { ModelType } from "../../../features/modelManagment/modelTypes";
import styles from "./modelItem.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { API_BASE } from "@/app/api/config";
import alt_image from "@/shared/assets/images/alt_image.png";
import { Button } from "antd";
import { VideoPlayer } from "@/shared/ui/VideoPlayer/VideoPlayer";

type Props = {
  model: ModelType;
};

export const ModelItem = ({ model }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const shouldTruncate = useMemo(
    () => (model.description ? model.description.length > 150 : false),
    [model.description],
  );

  const displayText = useMemo(() => {
    if (!model.description) return "";
    if (isExpanded) return model.description;
    return `${model.description.substring(0, 150)}${shouldTruncate ? "..." : ""}`;
  }, [model.description, isExpanded, shouldTruncate]);

  const handleNavigate = (fileName: string, preview?: boolean) => {
    if (!preview) {
      navigate(`/models/${fileName}`, { state: { from: location.pathname } });
    } else {
      navigate(`/models/preview/${fileName}`, {
        state: { from: location.pathname },
      });
    }
  };

  let content = null;
  if (model) {
    content = (
      <div className={styles.model__card}>
        <div className={styles.image__container}>
          {model.videoUrl ? (
            <VideoPlayer
              videoUrl={model.videoUrl}
              imageUrl={model.previewUrl}
              altImage={alt_image}
              altText={model.displayName || model.fileName}
              className={styles.model__image}
            />
          ) : (
            <img
              src={
                model.previewUrl ? `${API_BASE}${model.previewUrl}` : alt_image
              }
              alt={model.displayName || model.fileName}
              className={styles.model__image}
            />
          )}
        </div>
        <div className={styles.model__content}>
          <h3 className={styles.model__title}>
            {model.displayName || model.fileName}
          </h3>
          <p className={styles.model__description}>{displayText}</p>
          {shouldTruncate && (
            <Button
              color="purple"
              variant="outlined"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                color: "#673ab7",
                background: "none",
                padding: "4px 8px",
              }}
            >
              {isExpanded ? "Скрыть подробности" : "Показать полностью"}
            </Button>
          )}
        </div>
        <div className={styles.btns}>
          <Button
            color="purple"
            variant="solid"
            onClick={() => handleNavigate(model.fileName)}
            data-model={model}
            style={{
              padding: 20,
              fontWeight: 500,
              borderRadius: 12,
            }}
          >
            Просмотр в AR
          </Button>
          <Button
            color="purple"
            variant="outlined"
            onClick={() => handleNavigate(model.fileName, true)}
            data-model={model}
            style={{
              padding: 20,
              fontWeight: 500,
              borderRadius: 12,
            }}
          >
            Предпросмотр
          </Button>
        </div>
      </div>
    );
  }

  return <>{content}</>;
};
