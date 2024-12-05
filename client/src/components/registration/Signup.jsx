import React, { useState } from "react";
import "./style.css";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AxiosInstance from "../../utils/axios/instance";
import * as yup from "yup";
import { toast } from "react-toastify";

// Схема валидации
const schema = yup.object().shape({
  city: yup.string().trim().required("City is required"),
  district: yup.string().trim().required("District is required"),
  firstStreetLine: yup.string().trim().required("Address is required"),
  postCode: yup
    .string()
    .typeError("Index must be a number")
    .required("Index is required"),
});

const Signup = ({ onComplete }) => {
  const [loading, setLoading] = useState(false); // Индикатор загрузки
  const instance = AxiosInstance();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setLoading(true); // Включаем загрузку
    try {
      const modifiedData = {
        ...data,
        countryId: "01937e4a-07f4-7770-ac79-bf26a9bb9db6", // Временный идентификатор
      };
      const response = await instance.post("/addresses", modifiedData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const addressId = response.data.id;
        toast.success("Step 1 completed successfully!");
        onComplete(addressId);
      } else {
        toast.error("Failed to submit the form.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
    } finally {
      setLoading(false); // Выключаем загрузку
    }
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
            <label htmlFor="district" className="form__signup-input--label">
              District
            </label>
            <input
              name="district"
              placeholder="North Rhine-Westphalia"
              type="text"
              id="district"
              className={`form__signup-input ${errors.district ? "input-error" : ""}`}
              autoComplete="address-level1"
              {...register("district")}
            />
            <p aria-live="polite" className="error-message">{errors.district?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="city" className="form__signup-input--label">
              City
            </label>
            <input
              placeholder="Cologne"
              type="text"
              id="city"
              className={`form__signup-input ${errors.city ? "input-error" : ""}`}
              {...register("city")}
            />
            <p aria-live="polite" className="error-message">{errors.city?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="address" className="form__signup-input--label">
              Address
            </label>
            <input
              placeholder="Bertha-Sander-Straße"
              type="text"
              id="address"
              className={`form__signup-input ${errors.address ? "input-error" : ""}`}
              {...register("firstStreetLine")}
            />
            <p aria-live="polite" className="error-message">{errors.address?.message}</p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="index" className="form__signup-input--label">
              Index
            </label>
            <input
              placeholder="50829"
              type="number"
              id="index"
              className={`form__signup-input ${errors.postCode ? "input-error" : ""}`}
              {...register("postCode")}
              autoComplete="postal-code"
            />
            <p aria-live="polite" className="error-message">{errors.postCode?.message}</p>
          </li>
        </ul>
        <button type="submit" className="form__signup-submit--button">
          Continue
        </button>
      </fieldset>
    </form>
  );
};

export default Signup;
