import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@app/store";
import styles from "./AuthPage.module.css";
import { loginAdmin } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "@/shared/ui/pageLoader/PageLoader";
import type { AuthType } from "@/features/auth/authTypes";
import { Button, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

export const AuthPage = () => {
  const [passwordInput, setPasswordInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useSelector<RootState, AuthType>(
    (state) => state.authReducer,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginAdmin(passwordInput))
      .unwrap()
      .then(() => {
        navigate("/admin");
      })
      .catch((error) => {
        console.error(`Ошибка входа: ${error}`);
      })
      .finally(() => {
        setPasswordInput("");
      });
  };

  return (
    <div className={styles.auth}>
      <h1>Страница входа в панель администратора</h1>
      {isLoading ? <PageLoader /> : null}
      <form onSubmit={handleSubmit} className={`${styles.auth__form} `}>
        <label className={styles.form__label} htmlFor="password">
          <LockOutlined
            style={{
              color: "grey",
              fontSize: "1.3rem",
            }}
          />
          <Input.Password
            id="password"
            name="password"
            type="password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
            placeholder="Введите пароль"
            required
            style={{
              fontSize: "1rem",
            }}
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
      {isError ? (
        <div style={{ color: "red", fontWeight: "500" }}>{errorMessage}</div>
      ) : null}
    </div>
  );
};
