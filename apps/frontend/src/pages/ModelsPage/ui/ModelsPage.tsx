import { ModelList } from "@/features/modelManagment";
import { Button } from "antd";
import { Link } from "react-router-dom";

export const ModelsPage = () => {
  return (
    <div>
      <h1>AR</h1>
      <ModelList />
      <Link to={"/auth"}>
        <Button
          variant="solid"
          color="purple"
          style={{
            fontWeight: 600,
            padding: 18,
            borderRadius: 12,
          }}
        >
          Панель администратора
        </Button>
      </Link>
    </div>
  );
};

export default ModelsPage;
