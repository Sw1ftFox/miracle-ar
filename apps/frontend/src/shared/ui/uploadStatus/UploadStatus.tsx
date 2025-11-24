import { type CSSProperties } from "react";

type PropsType = {
  style: CSSProperties;
  text: string | undefined;
};

const UploadStatus = ({ style, text }: PropsType) => {
  return <div style={style}>{text}</div>;
};

export default UploadStatus;
