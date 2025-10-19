import ModelItem from "../modelItem/ModelItem";
import styles from "./modelList.module.css";

const ModelList = () => {
  return (
    <div className={styles.models__gallery}>
      <ModelItem />
      <ModelItem />
      <ModelItem />
    </div>
  );
};

export default ModelList;
