import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Spin,
  Alert,
  Typography,
  Input,
  Row,
  Col,
  FloatButton,
} from "antd";
import {
  ArrowLeftOutlined,
  CloseCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import type { AppDispatch, RootState } from "@/app/store";
import { fetchModelsByCategory } from "@/features/modelManagment/modelsSlice";
import { fetchCategories } from "@/features/categories/categoriesSlice";
import { ModelItem } from "@/widgets/modelItem";

const { Title } = Typography;

export const CategoryModelsPage = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { models, isLoading, errorMessage } = useSelector(
    (state: RootState) => state.modelsReducer,
  );
  const { categories } = useSelector(
    (state: RootState) => state.categoriesReducer,
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchModelsByCategory(Number(categoryId)));
    }
  }, [categoryId, dispatch]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const currentCategory = categories.find((c) => c.id === Number(categoryId));
  const categoryName = currentCategory?.name || "Категория";

  const filteredModels = models.filter((model) =>
    (model.displayName || model.fileName)
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  const loader = isLoading ? (
    <Spin
      size="large"
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  ) : null;

  const error = errorMessage ? (
    <Alert title={errorMessage} type="error" showIcon />
  ) : null;

  const content =
    !isLoading && !errorMessage ? (
      <Row justify="center">
        <Col span={24} style={{ display: "grid", gap: "30px" }}>
          {filteredModels.length === 0 ? (
            <Alert
              title="В этой категории пока нет моделей"
              type="info"
              showIcon
            />
          ) : (
            filteredModels.map((model) => (
              <ModelItem key={model.id} model={model} />
            ))
          )}
        </Col>
      </Row>
    ) : null;

  return (
    <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          size="large"
        >
          На главную
        </Button>
        <Input
          placeholder="Поиск модели по названию..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear={{
            clearIcon: (
              <CloseCircleFilled
                style={{
                  color: "#c6bbff",
                  fontSize: "16px",
                }}
              />
            ),
          }}
        />
      </div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Категория "{categoryName}"
      </Title>
      {loader}
      {error}
      {content}
      <FloatButton.BackTop />
    </div>
  );
};
