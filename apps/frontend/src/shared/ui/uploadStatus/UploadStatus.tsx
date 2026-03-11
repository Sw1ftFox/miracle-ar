import { type CSSProperties } from "react";
import cls from "./UploadStatus.module.css";

type PropsType = {
  style: CSSProperties;
  text: string | undefined;
};

const UploadStatus = ({ style, text }: PropsType) => {
  return <div style={style} className={cls.UploadStatus}>{text}</div>;
};

export default UploadStatus;
