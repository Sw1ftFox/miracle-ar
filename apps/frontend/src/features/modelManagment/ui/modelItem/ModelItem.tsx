import Button from "@shared/ui/button/Button";
import type { ModelType } from "../../types";
import styles from "./modelItem.module.css";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/app/store";
import { setCurrentModel } from "../../modelsSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Props = {
  model: ModelType;
};

const removeFileExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, "");
};

const ModelItem = ({ model }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const shouldTruncate = model.description
    ? model.description?.length > 150
    : false;
  const displayText = isExpanded
    ? model.description
    : `${model.description?.substring(0, 150)}${shouldTruncate ? "..." : ""}`;

  const handleNavigate = (displayName: string) => {
    dispatch(setCurrentModel(model));

    navigate(`/models/${displayName}`);
  };

  if (model) {
    const displayName = removeFileExtension(model.name);
    return (
      <div className={styles.model__card}>
        <div className={styles.image__container}>
          <img
            src={model.previewUrl}
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
          <p className={styles.pattern__info}></p>
          <Button
            onClick={() => handleNavigate(displayName)}
            className={styles.view__btn}
            dataAttribute={model}
            content="Просмотр в AR"
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
