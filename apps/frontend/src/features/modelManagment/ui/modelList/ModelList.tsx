import ModelItem from "../modelItem/ModelItem";
import type { ModelType } from "../../types";
import styles from "./modelList.module.css";

const mockModels: ModelType[] = [
  {
    id: "polonsky",
    name: "Полонский",
    previewUrl: "/mock-images/polonsky.jpg",
    description: "3D модель персонажа",
    isCurrent: true,
  },
];

const ModelList = () => {
  return (
    <div className={styles.models__gallery}>
      {mockModels.map((model) => (
        <ModelItem model={model} />
      ))}
    </div>
  );
};

export default ModelList;
