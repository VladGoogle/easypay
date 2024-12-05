import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./style.css";
import eyeicon from "../../img/eye-icon.svg";
import eyeiconhidden from "../../img/eye-icon-hidden.svg";
import googleicon from "../../img/Google.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AxiosInstance from "../../utils/axios/instance";
import { toast } from "react-toastify";
import { TokenContext } from "../../TokenContext";
import Loader from "../loader/Loader";

// Схема валидации
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .lowercase()
    .trim()
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be at most 255 characters")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(/[A-Z]/, "Password must include an uppercase letter")
    .matches(/[0-9]/, "Password must include a number")
    .required("Password is required"),
});

const Signin = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(TokenContext);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const instance = AxiosInstance();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Функция для логина через ваш сервер
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await instance.post("/auth/login", data);
      if (response.status >= 200 && response.status < 300) {
        const { accessToken, refreshToken } = response.data;
        setToken({ accessToken, refreshToken });
        toast.success("Success! You have been logged in.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для логина через Firebase
  const handleFirebaseLogin = async (email, password) => {
    const API_KEY = "AIzaSyBB7yUkArlhhPCwZFdasDZvdXzK-4D_m_Q";
    const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${API_KEY}`;

    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });

      const data = await response.json();
      if (response.ok) {
        const { idToken, refreshToken } = data;
        setToken({ accessToken: idToken, refreshToken });
        toast.success("Logged in with Firebase.");
        navigate("/");
      } else {
        toast.error(data.error.message || "Firebase login failed.");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form__signin">
      {isLoading && <Loader />}
      <h2 className="auth__title">Welcome back!</h2>
      <span className="auth__subtitle">
        First time here?{" "}
        <NavLink className="auth__subtitile-link" to="/registration">
          Sign up now
        </NavLink>
      </span>
      <fieldset className="form__signin-fieldset">
        <ul className="form__signin-input--list">
          <li className="form__signin-input--item">
            <label htmlFor="email" className="form__signin-input--label">
              Email
            </label>
            <input
              placeholder="johnjohnson@gmail.com"
              type="email"
              id="email"
              className="form__signin-input"
              {...register("email")}
            />
            <p className="error-message">{errors.email?.message}</p>
          </li>
          <li className="form__signin-input--item">
            <label htmlFor="password" className="form__signin-input--label">
              Password
            </label>
            <div className="password__field--box">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="Qwerty789"
                className="form__signin-input password__field"
                {...register("password")}
              />
              <button
                onClick={togglePasswordVisibility}
                type="button"
                className="toggle-password"
              >
                {isPasswordVisible ? (
                  <img src={eyeicon} alt="password" className="eye-icon" />
                ) : (
                  <img
                    src={eyeiconhidden}
                    alt="password"
                    className="eye-icon"
                  />
                )}
              </button>
            </div>
            <p className="error-message">{errors.password?.message}</p>
          </li>
        </ul>
        <div className="form__signin-input-remember--container">
          <input
            type="checkbox"
            id="remember"
            className="form__signin-input-remember"
          />
          <label
            htmlFor="remember"
            className="form__signin-input-remember--label"
          >
            Remember me
          </label>
        </div>
      </fieldset>
      <button className="form__signin-submit--button">Sign In</button>
      <div className="form__signin-divider">
        <div className="line"></div>
        <span className="form__signin-divider--text">OR</span>
        <div className="line"></div>
      </div>
      <button
        type="button"
        className="form__signin-googlesubmit--button"
        onClick={handleSubmit(({ email, password }) =>
          handleFirebaseLogin(email, password)
        )}
      >
        <img src={googleicon} alt="google icon" className="googlesubmit--icon" />
        Sign in with Firebase
      </button>
    </form>
  );
};

export default Signin;
