import React from "react";
import { useState } from "react";
import "./style.css";
import { NavLink } from "react-router-dom";
import eyeicon from "../../img/eye-icon.svg";
import eyeiconhidden from "../../img/eye-icon-hidden.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AxiosInstance from "../../utils/axios/instance"
import * as yup from "yup";
import { toast } from "react-toastify";

// Схема валидации
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  firstName: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  lastName: yup
    .string()
    .min(2, "Surname must be at least 2 characters")
    .required("Surname is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must include an uppercase letter")
    .matches(/[0-9]/, "Password must include a number")
    .required("Password is required"),
  phone: yup
    .string()
    .matches(/^\+?[0-9\s-]+$/, "Phone number is invalid")
    .required("Phone number is required"),
});

const Signup2 = ({ addressId, onComplete }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const instance = AxiosInstance();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const modifiedData = { ...data, addressId: String(addressId) };
      console.log("Data being sent to /users endpoint:", modifiedData);
      const response = await instance.post("/users", modifiedData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Success! User created");        
        onComplete(); // Переключение на следующий шаг
      } else {
        toast.error("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response) {
        console.error("Server response:", error.response);
        toast.error("User with this email or phone number already exist");
      } else {
        toast.error("Network error or server is unavailable.");
      }
      
    }
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
            <p aria-live="polite" className="error-message">{errors.email?.message}</p>
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
              {...register("firstName")}
            />
            <p aria-live="polite" className="error-message">{errors.firstName?.message}</p>
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
              {...register("lastName")}
            />
            <p aria-live="polite" className="error-message">{errors.lastName?.message}</p>
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
            <p aria-live="polite" className="error-message">{errors.password?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="phonenumber" className="form__signup-input--label">
              Phone number
            </label>
            <input
              placeholder="+(4) 176 324 44 954"
              type="tel"
              id="phonenumber"
              className="form__signup-input"
              {...register("phone")}
            />
            <p aria-live="polite" className="error-message">{errors.phone?.message}</p>
          </li>
        </ul>
        <button type="submit" className="form__signup-submit--button">
          Sign Up
        </button>
      </fieldset>
    </form>
  );
};

export default Signup2;
