import { useState } from "react";
import styles from "./adminPage.module.css";
import Section from "./section/Section";
import { sectionData } from "./section/sectionData";

type SectionType = "models" | "sounds" | "images" | "descriptions" | "patterns";

function isValidSection(
  value: string
): value is "models" | "sounds" | "images" | "descriptions" | "patterns" {
  return ["models", "sounds", "images", "descriptions", "patterns"].includes(
    value
  );
}

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>("models");

  const changeSelectedSection = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.id;
    if (isValidSection(id)) {
      setSelectedSection(id);
    }
  };

  return (
    <div>
      <h1>Панель администратора</h1>
      <a href="/models" className={styles.return__btn}>
        ← Вернуться в меню
      </a>

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
                title={section.title}
                id={section.id}
                type={section.type}
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
