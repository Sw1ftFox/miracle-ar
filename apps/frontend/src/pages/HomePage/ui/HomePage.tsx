import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  type CategoryType,
} from "@/features/categories/categoriesSlice";
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Alert,
  Layout,
  Button,
  Space,
  Grid,
} from "antd";
import { useNavigate } from "react-router-dom";
import { ExperimentOutlined } from "@ant-design/icons";
import styles from "./HomePage.module.css";
import type { AppDispatch, RootState } from "@/app/store";

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { categories, isLoading } = useSelector(
    (state: RootState) => state.categoriesReducer,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories())
      .unwrap()
      .catch((err) => setError(err.message || "Ошибка загрузки категорий"));
  }, [dispatch]);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logoArea}>
            <ExperimentOutlined className={styles.logoIcon} />
            <Title level={screens.xs ? 3 : 1} className={styles.logoText}>
              Miracle AR
            </Title>
          </div>
          <div className={styles.headerRight}>
            <Space size="middle">
              <Button
                color="purple"
                variant="outlined"
                onClick={() => navigate("/auth")}
                style={{ fontWeight: 500 }}
              >
                Админ-панель
              </Button>
            </Space>
          </div>
        </div>
        <div className={styles.hero}>
          <Title level={2} className={styles.heroTitle}>
            Платформа для просмотра 3D-моделей в дополненной реальности
          </Title>
          <Paragraph className={styles.heroSubtitle}>
            Выберите категорию, чтобы начать
          </Paragraph>
        </div>
      </Header>

      <Content className={styles.content}>
        <Title level={2} className={styles.sectionTitle}>
          Категории моделей
        </Title>
        {isLoading && (
          <Spin
            size="large"
            className={styles.spinner}
            style={{ margin: "0 auto", width: "100%" }}
          />
        )}
        {error && <Alert title={error} type="error" showIcon />}
        {!isLoading && !error && (
          <Row gutter={[24, 24]} justify="center">
            {categories.map((cat: CategoryType) => (
              <Col key={cat.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className={styles.categoryCard}
                  onClick={() => handleCategoryClick(cat.id)}
                  cover={<div className={styles.cardImage}>📦</div>}
                >
                  <Card.Meta
                    title={cat.name}
                    description={cat.description || "Нет описания"}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>

      <Footer className={styles.footer}>
        Miracle AR © {new Date().getFullYear()} — Все права защищены
      </Footer>
    </Layout>
  );
};
