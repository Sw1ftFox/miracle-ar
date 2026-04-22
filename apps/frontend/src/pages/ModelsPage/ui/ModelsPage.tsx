import { ModelList } from "@/features/modelManagment";
import Link from "@shared/ui/link/Link";

export const ModelsPage = () => {
  return (
    <div>
      <h1>AR</h1>
      <ModelList />
      <Link content="Панель администратора" link="/auth" />
    </div>
  );
};

export default ModelsPage;
