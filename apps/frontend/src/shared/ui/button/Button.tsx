import type { ModelType } from "@features/modelManagment/types";

type PropsType = {
  onClick?: () => void;
  className?: string;
  dataAttribute?: ModelType;
  content?: string;
  type?: "button" | "submit" | "reset" | undefined;
};

const Button = ({
  onClick,
  className = "",
  dataAttribute,
  content = "",
  type = "button",
}: PropsType) => {
  return (
    <button onClick={onClick} type={type} className={className} data-model={dataAttribute}>
      {content}
    </button>
  );
};

export default Button;
