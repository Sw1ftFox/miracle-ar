import { useDispatch, useSelector } from "react-redux";
import styles from "./modelList.module.css";
import { type AppDispatch, type RootState } from "@app/store";
import type { AppState } from "../../types";
import { useEffect } from "react";
import { fetchModels } from "../../modelsSlice";
import { PageLoader } from "@/shared/ui/pageLoader/PageLoader";
import { ModelItem } from "..";

export const ModelList = () => {
  const { models, isLoading } = useSelector<RootState, AppState>(
    (state) => state.modelsReducer,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchModels());
  }, []);

  return (
    <div className={styles.models__gallery}>
      {isLoading ? (
        <PageLoader />
      ) : (
        models.map((model) => <ModelItem key={model.id} model={model} />)
      )}
    </div>
  );
};
