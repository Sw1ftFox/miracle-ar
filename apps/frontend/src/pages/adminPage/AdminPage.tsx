import { useState } from "react";
import styles from "./adminPage.module.css";
import Section from "./section/Section";
import { sectionData } from "./section/sectionData";
import {
  FileTypes,
  isSectionType,
  type SectionType,
} from "@features/modelManagment/types";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@app/store";
import { downloadDefaultMarker } from "@features/modelManagment/modelsSlice";

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>(
    FileTypes.MODELS
  );
  const dispatch = useDispatch<AppDispatch>();

  const changeSelectedSection = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.id;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isSectionType(id) && setSelectedSection(id);
  };

  const handleDownloadDefaultMarker = () => {
    dispatch(downloadDefaultMarker());
  };

  return (
    <div className={styles.adminPage}>
      <h1>Панель администратора</h1>
      <div
        className={styles.headerActions}
      >
        <a href="/models" className={styles.return__btn}>
          ← Вернуться в меню
        </a>
        <button
          className={styles.download__btn}
          onClick={handleDownloadDefaultMarker}
        >
          Скачать маркер по умолчанию
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.tabs} onClick={changeSelectedSection}>
          {sectionData.map((section) => {
            return (
              <button
                id={section.name}
                className={`${styles.tab__btn} ${
                  selectedSection === section.name ? styles.active : ""
                }`}
              >
                {section.buttonText}
              </button>
            );
          })}
        </div>

        {sectionData.map((section) => {
          if (section.name === selectedSection) {
            return (
              <Section
                styles={styles}
                type={section.type}
                title={section.title}
                id={section.id}
                inputType={section.inputType}
                accept={section.accept}
                required={section.required}
                submitText={section.submitText}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default AdminPage;
