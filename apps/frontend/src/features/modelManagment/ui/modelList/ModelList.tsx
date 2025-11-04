import { useDispatch, useSelector } from "react-redux";
import ModelItem from "../modelItem/ModelItem";
import styles from "./modelList.module.css";
import { type AppDispatch, type RootState } from "@app/store";
import type { ModelType } from "../../types";
import { useEffect } from "react";
import { fetchModels } from "../../modelsSlice";

const ModelList = () => {
  const models = useSelector<RootState, ModelType[]>(
    (state) => state.modelsReducer.models
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchModels());
  }, []);

  return (
    <div className={styles.models__gallery}>
      {models.map((model) => (
        <ModelItem key={model.id} model={model} />
      ))}
    </div>
  );
};

export default ModelList;
