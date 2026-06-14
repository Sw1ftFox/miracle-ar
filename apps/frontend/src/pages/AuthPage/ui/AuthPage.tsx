import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@app/store";
import styles from "./AuthPage.module.css";
import { loginWithJWT } from "@/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { PageLoader } from "@/shared/ui/pageLoader/PageLoader";
import type { AuthType } from "@/features/auth/authTypes";
import { Button, Grid, Input } from "antd";
import {
  ArrowLeftOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

export const AuthPage = () => {
  const screens = useBreakpoint();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useSelector<RootState, AuthType>(
    (state) => state.authReducer,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginWithJWT({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/admin");
      })
      .catch((error) => {
        console.error(`Ошибка входа: ${error}`);
      })
      .finally(() => {
        setEmail("");
        setPassword("");
      });
  };

  return (
    <div className={styles.auth}>
      <h1>Страница входа в панель администратора</h1>
      {isLoading ? <PageLoader /> : null}
      <form onSubmit={handleSubmit} className={styles.auth__form}>
        <label className={styles.form__label} htmlFor="email">
          <MailOutlined style={{ color: "grey", fontSize: "1.3rem" }} />
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            required
            style={{ fontSize: "1rem" }}
          />
        </label>
        <label className={styles.form__label} htmlFor="password">
          <LockOutlined style={{ color: "grey", fontSize: "1.3rem" }} />
          <Input.Password
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
            style={{ fontSize: "1rem" }}
          />
        </label>
        <Button
          htmlType="submit"
          variant="solid"
          color="purple"
          style={{
            width: "100%",
            padding: "1.2rem 1.5rem",
            borderRadius: 16,
            fontSize: "1rem",
            fontWeight: 600,
            marginTop: "2rem",
            boxShadow: "0 4px 15px rgba(94, 53, 177, 0.3)",
            letterSpacing: 0.5,
          }}
        >
          Подтвердить
        </Button>
      </form>
      <Link
        to={"/"}
        style={{ width: "100%", display: "flex", justifyContent: "start" }}
      >
        <Button
          variant="outlined"
          color="purple"
          style={{
            fontWeight: 600,
            padding: 18,
            borderRadius: 12,
            fontSize: screens.xs ? "0.8rem" : "",
            marginTop: "40px",
          }}
        >
          <ArrowLeftOutlined /> Вернуться в меню
        </Button>
      </Link>
      {isError && (
        <div style={{ color: "red", fontWeight: "500", marginTop: "1rem" }}>
          {errorMessage || "Неверный email или пароль"}
        </div>
      )}
    </div>
  );
};
