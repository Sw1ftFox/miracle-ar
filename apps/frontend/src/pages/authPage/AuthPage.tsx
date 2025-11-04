import Button from "@shared/ui/button/Button";
import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@app/store";
import password from "@assets/icons/password.svg";
import styles from "./authPage.module.css";
import { loginAdmin } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [passwordInput, setPasswordInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
    </div>
  );
};

export default AuthPage;
