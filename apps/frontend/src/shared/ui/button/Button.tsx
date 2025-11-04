import type { ModelType } from "@features/modelManagment/types";

type PropsType = {
  className?: string;
  dataAttribute?: ModelType;
  content?: string;
  type?: "button" | "submit" | "reset" | undefined;
};

const Button = ({
  className = "",
  dataAttribute,
  content = "",
  type = "button",
}: PropsType) => {
  return (
    <button type={type} className={className} data-model={dataAttribute}>
      {content}
    </button>
  );
};

export default Button;
