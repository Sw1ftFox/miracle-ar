import classNames from "classnames";
import cls from "./Loader.module.css";

interface LoaderProps {
  className?: string;
}

export const Loader = ({ className }: LoaderProps) => (
    <div className={classNames(cls.Loader, `${className}`)} />
);
