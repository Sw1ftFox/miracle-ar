import { NavLink } from "react-router-dom";
import styles from "./link.module.css";

type PropsType = {
  content: string;
  link: string;
  style?: React.CSSProperties;
};

const Link = ({ content = "", link = "/", style }: PropsType) => {
  return (
    <NavLink style={style} className={styles.link} end to={link}>
      {content}
    </NavLink>
  );
};

export default Link;
