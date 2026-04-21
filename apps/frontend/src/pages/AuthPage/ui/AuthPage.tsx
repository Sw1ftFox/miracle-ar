import Button from "@shared/ui/button/Button";
import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@app/store";
import password from "@assets/icons/password.svg";
import styles from "./authPage.module.css";
import { loginAdmin } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "@/shared/ui/PageLoader/PageLoader";
import type { AuthType } from "@/features/auth/types";

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
      <form
        onSubmit={handleSubmit}
        className={`${styles.auth__form} ${styles.form}`}
      >
        <label className={styles.form__label} htmlFor="password">
          <img className={styles.form__img} src={password} alt="" />
          <input
            className={styles.form__input}
            id="password"
            name="password"
            type="password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
            placeholder="Введите пароль"
            required
          />
        </label>
        <Button
          type="submit"
          className={styles.form__submit}
          content="Подтвердить"
        />
      </form>
      {isError ? (
        <div style={{ color: "red", fontWeight: "500" }}>{errorMessage}</div>
      ) : null}
    </div>
  );
};
