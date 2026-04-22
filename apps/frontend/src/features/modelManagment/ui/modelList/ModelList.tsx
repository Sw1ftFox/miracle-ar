import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@app/store";
import { useEffect } from "react";
import { fetchModels } from "../../modelsSlice";
import { ModelItem } from "../..";
import type { ModelState } from "../../modelTypes";
import { Col, Grid, Row } from "antd";
import { SkeletonModelItem } from "@/shared/ui/SkeletonModelItem/SkeletonModelItem";

const { useBreakpoint } = Grid;

export const ModelList = () => {
  const { models, isLoading } = useSelector<RootState, ModelState>(
    (state) => state.modelsReducer,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchModels());
  }, []);

  const screens = useBreakpoint();

  const loading = isLoading
    ? new Array(3).fill("").map(() => <SkeletonModelItem />)
    : null;

  const content = !isLoading
    ? models.map((model) => <ModelItem key={model.id} model={model} />)
    : null;

  return (
    <Row
      justify="center"
      style={{
        margin: screens.xs ? "15px 0" : "25px 0",
      }}
    >
      <Col
        span={24}
        style={{
          display: "grid",
          gap: screens.xs ? 20 : 30,
        }}
      >
        {loading}
        {content}
      </Col>
    </Row>
  );
};
