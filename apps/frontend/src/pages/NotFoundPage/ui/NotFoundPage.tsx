import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Извините, страница не найдена."
      extra={
        <Button type="primary" onClick={handleGoHome}>
          На главную
        </Button>
      }
    />
  );
};
