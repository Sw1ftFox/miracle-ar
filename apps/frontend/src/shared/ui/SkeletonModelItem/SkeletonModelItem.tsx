import { Col, Grid, Row, Skeleton } from "antd";

const { useBreakpoint } = Grid;

export const SkeletonModelItem = () => {
  const screens = useBreakpoint();

  return (
    <Row
      justify="space-between"
      style={{
        backgroundColor: "#a3a3a32c",
        borderRadius: 20,
        padding: 30,
      }}
    >
      <Col
        xs={24}
        md={12}
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: screens.md ? 0 : 20,
        }}
        order={screens.md ? 2 : 1}
      >
        <Skeleton.Image
          active
          style={{
            width: "10rem",
            height: "10rem",
            borderRadius: 10,
          }}
        />
      </Col>
      <Col
        xs={24}
        md={12}
        style={{
          display: "grid",
          gap: 10,
        }}
        order={screens.md ? 1 : 2}
      >
        <Skeleton.Input
          active
          size="small"
          block={true}
          style={{
            width: "30%",
          }}
        />
        <Skeleton.Input
          active
          size="small"
          block={true}
          style={{
            marginTop: 20,
            width: "80%",
          }}
        />
        <Skeleton.Input active size="small" block={true} />
        <Skeleton.Input active size="small" block={true} />
      </Col>
    </Row>
  );
};
