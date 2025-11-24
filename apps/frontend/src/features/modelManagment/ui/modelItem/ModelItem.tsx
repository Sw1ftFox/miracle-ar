import Button from "@shared/ui/button/Button";
import type { ModelType } from "../../types";
import styles from "./modelItem.module.css";

type Props = {
  model: ModelType;
};

const removeFileExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, "");
};

const ModelItem = ({ model }: Props) => {
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
          <p className={styles.model__description}>{model.description}</p>
          <p className={styles.pattern__info}></p>
          <Button
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
