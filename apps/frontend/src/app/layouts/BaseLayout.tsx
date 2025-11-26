import styles from "./BaseLayout.module.css"

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className={styles.base__layout}>
      <div className={styles.base__container}>
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;