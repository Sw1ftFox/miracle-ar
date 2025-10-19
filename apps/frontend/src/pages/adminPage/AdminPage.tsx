import styles from "./adminPage.module.css";

const AdminPage = () => {
  return (
    <div>
      <h1>Панель администратора</h1>
      <a href="/models" className={styles.btn}>
        ← Вернуться в меню
      </a>

      <div className={styles.section}>
        <div className={styles.tabs}>
          <button
            id="models-tab"
            className={`${styles.tab__btn} ${styles.active}`}
          >
            Модели
          </button>
          <button id="sounds-tab" className={styles.tab__btn}>
            Звук
          </button>
          <button id="images-tab" className={styles.tab__btn}>
            Картинки
          </button>
          <button id="descriptions-tab" className={styles.tab__btn}>
            Описания
          </button>
          <button id="patterns-tab" className={styles.tab__btn}>
            Паттерны
          </button>
        </div>

        <div id="models-section">
          <h2>3D Модели</h2>
          <div id="model-list" className={styles.file__list}></div>
        </div>

        <div id="sounds-section" style={{ display: "none" }}>
          <h2>Звуковые файлы</h2>
          <div id="sound-list" className={styles.file__list}></div>
        </div>

        <div id="images-section" style={{ display: "none" }}>
          <h2>Графические файлы</h2>
          <div id="image-list" className={styles.file__list}></div>
        </div>

        <div id="descriptions-section" style={{ display: "none" }}>
          <h2>Описания</h2>
          <div id="description-list" className={styles.file__list}></div>
        </div>

        <div id="patterns-section" style={{ display: "none" }}>
          <h2>Паттерны AR</h2>
          <div id="pattern-list" className={styles.file__list}></div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Загрузить новую модель</h2>
        <form id="upload-model-form">
          <input
            type="file"
            id="model-file"
            className={styles.upload__btn}
            accept=".glb"
            required
          />
          <button type="submit" className={styles.btn}>
            Загрузить модель
          </button>
        </form>
        <div id="model-upload-status"></div>
      </div>

      <div className={styles.section}>
        <h2>Загрузить звук для модели</h2>
        <form id="upload-sound-form">
          <input
            type="file"
            id="sound-file"
            className={styles.upload__btn}
            accept=".mp3,.wav"
            required
          />
          <button type="submit" className={styles.btn}>
            Загрузить звук
          </button>
        </form>
        <div id="sound-upload-status"></div>
      </div>

      <div className={styles.section}>
        <h2>Загрузить картинку для модели</h2>
        <form id="upload-image-form">
          <input
            type="file"
            id="image-file"
            className={styles.upload__btn}
            accept=".png,.jpg,.jpeg"
            required
          />
          <button type="submit" className={styles.btn}>
            Загрузить картинку
          </button>
        </form>
        <div id="image-upload-status"></div>
      </div>

      <div className={styles.section}>
        <h2>Загрузить описание для модели</h2>
        <form id="upload-description-form">
          <input
            type="file"
            id="description-file"
            className={styles.upload__btn}
            accept=".txt"
            required
          />
          <button type="submit" className={styles.btn}>
            Загрузить описание
          </button>
        </form>
        <div id="description-upload-status"></div>
      </div>

      <div className={styles.section}>
        <h2>Загрузить паттерн для модели</h2>
        <form id="upload-pattern-form">
          <input
            type="file"
            id="pattern-file"
            className={styles.upload__btn}
            accept=".patt"
            required
          />
          <button type="submit" className={styles.btn}>
            Загрузить паттерн
          </button>
        </form>
        <div id="pattern-upload-status"></div>
      </div>
    </div>
  );
};

export default AdminPage;
