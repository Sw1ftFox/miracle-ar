import { useState } from "react";
import styles from "./AdminPage.module.css";
import { sectionData } from "@/widgets/Section/sectionData";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@app/store";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/authSlice";
import { Section } from "@/widgets/Section";
import {
  FileTypes,
  isSectionType,
  type SectionType,
} from "@/features/filesManagment/fileTypes";
import { downloadDefaultMarker } from "@/features/filesManagment/filesSlice";
import { Button, Grid } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ModelAdminList } from "@/widgets/ModelAdminList";
import { CategoryAdminList } from "@/widgets/CategoryAdminList";
import { useAuth } from "@/shared/hooks/useAuth";

const { useBreakpoint } = Grid;

export const AdminPage = () => {
  const { role } = useAuth();
  const isAdmin = role === "ROLE_ADMIN";

  const filteredSections = sectionData.filter((section) => {
    if (section.type === "categories" && !isAdmin) return false;
    return true;
  });

  const navigate = useNavigate();

  const screens = useBreakpoint();
  const [selectedSection, setSelectedSection] = useState<SectionType>(
    FileTypes.MODELS,
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
      <div className={styles.headerActions}>
        <Button
          variant="outlined"
          color="purple"
          style={{
            fontWeight: 600,
            padding: 18,
            borderRadius: 12,
            fontSize: screens.xs ? "0.8rem" : "",
          }}
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
        >
          <ArrowLeftOutlined /> Вернуться в меню
        </Button>
        <Button
          variant="solid"
          color="purple"
          style={{
            fontWeight: 600,
            padding: 18,
            borderRadius: 12,
            textWrap: "auto",
            fontSize: screens.xs ? "0.8rem" : "",
          }}
          onClick={handleDownloadDefaultMarker}
        >
          Скачать маркер по умолчанию
        </Button>
      </div>

      <div className={styles.section}>
        <div className={styles.tabs} onClick={changeSelectedSection}>
          {filteredSections.map((section) => {
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

        {filteredSections.map((section) => {
          if (section.name === selectedSection) {
            if (section.type === "models") {
              return <ModelAdminList key={section.name} />;
            }
            if (section.type === "categories") {
              return <CategoryAdminList key={section.name} />;
            }
            return (
              <Section
                key={section.name}
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
          return null;
        })}
      </div>
    </div>
  );
};

export default AdminPage;
