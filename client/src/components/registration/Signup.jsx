import React from "react";
import { useState } from "react";
import "./style.css";
import { NavLink } from "react-router-dom";
import eyeicon from "../../img/eye-icon.svg";
import eyeiconhidden from "../../img/eye-icon-hidden.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Схема валидации
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  surname: yup
    .string()
    .min(2, "Surname must be at least 2 characters")
    .required("Surname is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must include an uppercase letter")
    .matches(/[0-9]/, "Password must include a number")
    .required("Password is required"),
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  phonenumber: yup
    .string()
    .matches(/^\+?[0-9\s-]+$/, "Phone number is invalid")
    .required("Phone number is required"),
});

const Signup = () => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="form__signup">
      <h2 className="registr__title">Welcome aboard!</h2>
      <span className="registr__subtitle">
        Already have an account?{" "}
        <NavLink className="registr__subtitile-link" to="/authorization">
          Sign in now
        </NavLink>
      </span>
      <fieldset className="form__signup-fieldset">
        <ul className="form__signup-input--list">
          <li className="form__signup-input--item">
            <label htmlFor="email" className="form__signup-input--label">
              Email
            </label>
            <input
              placeholder="johnjohnson@gmail.com"
              type="email"
              id="email"
              className="form__signup-input"
              {...register("email")}
            />
            <p className="error-message">{errors.email?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="name" className="form__signup-input--label">
              Name
            </label>
            <input
              placeholder="John"
              type="text"
              id="name"
              className="form__signup-input"
              {...register("name")}
            />
            <p className="error-message">{errors.name?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="surname" className="form__signup-input--label">
              Surname
            </label>
            <input
              placeholder="Johnson"
              type="text"
              id="surname"
              className="form__signup-input"
              {...register("surname")}
            />
            <p className="error-message">{errors.surname?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="password" className="form__signup-input--label">
              Password
            </label>
            <div className="password__field--box">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="Qwerty789"
                className="form__signup-input password__field"
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
          <li className="form__signup-input--item">
            <label htmlFor="country" className="form__signup-input--label">
              Country
            </label>
            <input
              placeholder="Germany"
              type="text"
              id="country"
              className="form__signup-input"
              {...register("country")}
            />
            <p className="error-message">{errors.country?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="city" className="form__signup-input--label">
              City
            </label>
            <input
              placeholder="Berlin"
              type="text"
              id="city"
              className="form__signup-input"
              {...register("city")}
            />
            <p className="error-message">{errors.city?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="phonenumber" className="form__signup-input--label">
              Phone number
            </label>
            <input
              placeholder="+49 155 232 5434"
              type="tel"
              id="phonenumber"
              className="form__signup-input"
              {...register("phonenumber")}
            />
            <p className="error-message">{errors.phonenumber?.message}</p>
          </li>
        </ul>
        <button type="submit" className="form__signup-submit--button">
          Sign Up
        </button>
      </fieldset>
    </form>
  );
};

export default Signup;
