import { Flex } from "antd";
import styles from "./BaseLayout.module.css";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <Flex
      align="center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 20,
      }}
    >
      <div className={styles.base__container}>{children}</div>
    </Flex>
  );
};
