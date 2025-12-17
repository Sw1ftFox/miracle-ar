import { ModelList } from "@features/modelManagment/ui";
import Link from "@shared/ui/link/Link";

const ModelsPage = () => {
  return (
    <div>
      <h1>AR</h1>
      <ModelList />
      <Link content="Панель администратора" link="/auth" />
    </div>
  );
};

export default ModelsPage;
