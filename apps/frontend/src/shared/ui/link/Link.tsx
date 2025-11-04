import { NavLink } from "react-router-dom";
import styles from "./link.module.css";

type PropsType = {
  content: string;
  link: string;
};

const Link = ({ content = "", link = "/" }: PropsType) => {
  return (
    <NavLink className={styles.link} end to={link}>
      {content}
    </NavLink>
  );
};

export default Link;
