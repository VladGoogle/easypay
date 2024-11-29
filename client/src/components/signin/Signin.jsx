import React from "react";
import { useState} from 'react';
import { NavLink } from "react-router-dom";
import "./style.css";
import eyeicon from "../../img/eye-icon.svg";
import eyeiconhidden from "../../img/eye-icon-hidden.svg";
import googleicon from "../../img/Google.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Схема валидации
const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must include an uppercase letter")
      .matches(/[0-9]/, "Password must include a number")
      .required("Password is required"),
  });

const Signin = () => {
    
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });
    
      const onSubmit = (data) => {
        console.log("Form Data: ", data);
        alert("Form submitted successfully!");
      };

      const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
      };
    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form__signin">
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
        <div class="line"></div>
        <span className="form__signin-divider--text">OR</span>
        <div class="line"></div>
      </div>
      <button className="form__signin-googlesubmit--button">
        <img
          src={googleicon}
          alt="google icon"
          className="googlesubmit--icon"
        />
        Sign in with Google
      </button>
    </form>
  );
};

export default Signin;
