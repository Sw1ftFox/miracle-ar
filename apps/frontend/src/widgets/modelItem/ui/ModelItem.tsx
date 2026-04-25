import type { ModelType } from "../../../features/modelManagment/modelTypes";
import styles from "./modelItem.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE } from "@/app/api/config";
import alt_image from "@/shared/assets/images/alt_image.png";
import { removeFileExtension } from "@/shared/utils/removeFileExtension";
import { Button } from "antd";
import { VideoPlayer } from "@/shared/ui/VideoPlayer/VideoPlayer";

type Props = {
  model: ModelType;
};

export const ModelItem = ({ model }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = model.description
    ? model.description?.length > 150
    : false;
  const displayText = isExpanded
    ? model.description
    : `${model.description?.substring(0, 150)}${shouldTruncate ? "..." : ""}`;

  const navigate = useNavigate();
  const handleNavigate = (displayName: string, preview?: boolean) => {
    if (!preview) {
      navigate(`/models/${displayName}`);
    } else {
      navigate(`/models/preview/${displayName}`);
    }
  };

  let content = null;
  if (model) {
    const displayName = removeFileExtension(model.name);
    content = (
      <div className={styles.model__card}>
        <div className={styles.image__container}>
          {model.videoUrl ? (
            <VideoPlayer
              videoUrl={model.videoUrl}
              imageUrl={model.previewUrl}
              altImage={alt_image}
              altText={displayName}
              className={styles.model__image}
            />
          ) : (
            <img
              src={
                model.previewUrl ? `${API_BASE}${model.previewUrl}` : alt_image
              }
              alt={displayName}
              className={styles.model__image}
            />
          )}
        </div>
        <div className={styles.model__content}>
          <h3 className={styles.model__title}>{displayName}</h3>
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
            onClick={() => handleNavigate(displayName)}
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
            onClick={() => handleNavigate(displayName, true)}
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
