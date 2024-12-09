import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AxiosInstance from "../../utils/axios/instance";
import * as yup from "yup";
import { toast } from "react-toastify";
import Select from "react-select"; // Импортируем react-select
import BASE_URLS from "../../utils/axios/config";

// Схема валидации
const schema = yup.object().shape({
  city: yup.string().trim().required("City is required"),
  district: yup.string().trim().required("District is required"),
  firstStreetLine: yup.string().trim().required("Address is required"),
  postCode: yup
    .string()
    .typeError("Index must be a number")
    .required("Index is required"),
  countryId: yup.string().required("Country is required"),
});

const Signup = ({ onComplete }) => {
  const [loading, setLoading] = useState(false); // Индикатор загрузки
  const [countries, setCountries] = useState([]); // Список стран
  const [selectedCountry, setSelectedCountry] = useState(null); // Выбранная страна
  const instance = AxiosInstance(BASE_URLS.LOCAL);
  const customStyles = {
    container: (base) => ({
      ...base,
      width: "100%",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0
    }),
    menu: (base) => ({
      ...base,
      padding: 0,
      margin: 0,
      width: "95%"
    }),
    control: (base, state) => ({
      ...base,
      width: "100%",
      padding: "0",
      border: "none",
      background: "#D4DDE4",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      fontWeight: "400",
      boxShadow: state.isFocused ? "none" : base.boxShadow,
      borderColor: state.isFocused ? "transparent" : base.borderColor,
      margin: 0, // Убираем отступы для контейнера
      padding: 0, // Убираем внутренние отступы
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // Загрузка списка стран
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await instance.get("/countries");
        const countriesData = response.data.data; // Извлекаем массив стран
        setCountries(countriesData); // Устанавливаем в состояние
      } catch (error) {
        toast.error("Failed to load countries.");
      }
    };
    fetchCountries();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true); // Включаем загрузку
    try {
      // Включаем countryId в данные перед отправкой
      const modifiedData = {
        ...data,
        countryId: selectedCountry ? selectedCountry.value : "", // Используем value из выбранной страны
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

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption); // Обновляем выбранную страну
    setValue("countryId", selectedOption ? selectedOption.value : ""); // Обновляем значение countryId в форме
  };

  // Формируем данные для react-select
  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: country.name,
  }));

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
            <label htmlFor="country" className="form__signup-input--label">
              Country
            </label>
            <Select
              id="country"
              styles={customStyles}
              options={countryOptions} // Передаем список стран
              value={selectedCountry} // Передаем выбранную страну
              onChange={handleCountryChange} // Обрабатываем изменение
              className={`form__signup-input--select form__signup-input ${errors.countryId ? "input-error" : ""}`}
            />
            <p aria-live="polite" className="error-message">
              {errors.countryId?.message}
            </p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="district" className="form__signup-input--label">
              District
            </label>
            <input
              name="district"
              placeholder="North Rhine-Westphalia"
              type="text"
              id="district"
              className={`form__signup-input ${
                errors.district ? "input-error" : ""
              }`}
              autoComplete="address-level1"
              {...register("district")}
            />
            <p aria-live="polite" className="error-message">
              {errors.district?.message}
            </p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="city" className="form__signup-input--label">
              City
            </label>
            <input
              placeholder="Cologne"
              type="text"
              id="city"
              className={`form__signup-input ${
                errors.city ? "input-error" : ""
              }`}
              {...register("city")}
            />
            <p aria-live="polite" className="error-message">
              {errors.city?.message}
            </p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="address" className="form__signup-input--label">
              Street
            </label>
            <input
              placeholder="Bertha-Sander-Straße"
              type="text"
              id="address"
              className={`form__signup-input ${
                errors.firstStreetLine ? "input-error" : ""
              }`}
              {...register("firstStreetLine")}
            />
            <p aria-live="polite" className="error-message">
              {errors.firstStreetLine?.message}
            </p>
          </li>
          <li className="form__signup-input--item">
            <label htmlFor="index" className="form__signup-input--label">
              Index
            </label>
            <input
              placeholder="50829"
              type="number"
              id="index"
              className={`form__signup-input ${
                errors.postCode ? "input-error" : ""
              }`}
              {...register("postCode")}
              autoComplete="postal-code"
            />
            <p aria-live="polite" className="error-message">
              {errors.postCode?.message}
            </p>
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
