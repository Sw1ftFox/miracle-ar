import { useDispatch, useSelector } from "react-redux";
import ModelItem from "../modelItem/ModelItem";
import styles from "./modelList.module.css";
import { type AppDispatch, type RootState } from "@app/store";
import type { AppState } from "../../types";
import { useEffect } from "react";
import { fetchModels } from "../../modelsSlice";

const ModelList = () => {
  const { models, isLoading } = useSelector<RootState, AppState>(
    (state) => state.modelsReducer
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchModels());
  }, []);

  return (
    <div className={styles.models__gallery}>
      {isLoading ? (
        <div style={{ color: "black", textAlign: "center" }}>Загрузка...</div>
      ) : (
        models.map((model) => <ModelItem key={model.id} model={model} />)
      )}
    </div>
  );
};

export default ModelList;
