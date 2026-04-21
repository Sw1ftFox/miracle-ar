import classNames from "classnames";
import { Loader } from "../Loader/Loader";
import cls from "./PageLoader.module.css";

interface PageLoaderProps {
  className?: string;
}

export const PageLoader = ({ className }: PageLoaderProps) => (
  <div className={classNames(cls.PageLoader, `${className}`)}>
    <Loader />
  </div>
);
