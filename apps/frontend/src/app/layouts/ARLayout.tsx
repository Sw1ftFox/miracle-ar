import styles from "./ARLayout.module.css"

interface ARLayoutProps {
  children: React.ReactNode;
}

const ARLayout: React.FC<ARLayoutProps> = ({ children }) => {
  return (
    <div className={styles.ar__layout}>
      {children}
    </div>
  );
};

export default ARLayout;