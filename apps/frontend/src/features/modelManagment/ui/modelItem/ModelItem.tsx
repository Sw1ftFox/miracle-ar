import Button from "@shared/ui/button/Button";
import type { ModelType } from "../../types";
import styles from "./modelItem.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE } from "@/api/config";

type Props = {
  model: ModelType;
};

const removeFileExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, "");
};

const ModelItem = ({ model }: Props) => {
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

  if (model) {
    const displayName = removeFileExtension(model.name);
    return (
      <div className={styles.model__card}>
        <div className={styles.image__container}>
          <img
            src={`${API_BASE}${model.previewUrl}`}
            alt={displayName}
            className={styles.model__image}
          />
        </div>
        <div className={styles.model__content}>
          <h3 className={styles.model__title}>{displayName}</h3>
          <p className={styles.model__description}>{displayText}</p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                color: "#673ab7",
                background: "none",
                padding: "4px 8px",
              }}
            >
              {isExpanded ? "Скрыть подробности" : "Показать полностью"}
            </button>
          )}
        </div>
        <div className={styles.btns}>
          <Button
            onClick={() => handleNavigate(displayName)}
            className={styles.view__btn}
            dataAttribute={model}
            content="Просмотр в AR"
          />
          <Button
            onClick={() => handleNavigate(displayName, true)}
            className={styles.preview__btn}
            dataAttribute={model}
            content="Предпросмотр"
          />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.model__card}>
      <div className={styles.image__container}>
        <div className={styles.no__image}>Картинка отсутствует</div>
      </div>
      <div className={styles.model__content}>
        <p className={styles.no__description}>Описание отсутствует</p>
        <p className={styles.pattern__warning}>⚠ Паттерн отсутствует</p>
        <Button
          className={styles.view__btn}
          dataAttribute={model}
          content="Просмотр в AR"
        />
      </div>
    </div>
  );
};

export default ModelItem;
