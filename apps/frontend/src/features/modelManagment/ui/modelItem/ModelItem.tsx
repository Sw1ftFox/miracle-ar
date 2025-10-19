import styles from "./modelItem.module.css"

const ModelItem = () => {
  return (
    <div className={styles.model__card}>
      <div className={styles.image__container}>
        <img
          src="/api/files/images/${image}"
          alt="${modelName}"
          className={styles.model__image}
        />
        <div className={styles.no__image}>Картинка отсутствует</div>
      </div>
      <div className={styles.model__content}>
        <h3 className={styles.model__title}>modelName</h3>
        <p className={styles.model__description}>description.content</p>
        <p className={styles.no__description}>Описание отсутствует</p>
        <p className={styles.pattern__info}></p>
        <p className={styles.pattern__warning}>⚠ Паттерн отсутствует</p>
        <button className={styles.view__btn} data-model="${model}">
          Просмотр в AR
        </button>
      </div>
    </div>
  );
};

export default ModelItem;
