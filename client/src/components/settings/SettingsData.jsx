import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AxiosInstance from "../../utils/axios/instance";
import { toast } from "react-toastify";
import { TokenContext } from "../../TokenContext";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email address"),
  firstName: yup.string().min(2, "Name must be at least 2 characters"),
  lastName: yup.string().min(2, "Surname must be at least 2 characters"),
  phone: yup.string().matches(/^\+?[0-9\s-]+$/, "Phone number is invalid"),
});

const SettingsData = () => {
  const [isEditable, setIsEditable] = useState(false); // Состояние редактирования
  const instance = AxiosInstance();
  const { logout, userId } = useContext(TokenContext); // Получаем userId из контекста
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Используем setValue для установки значений в поля формы
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Запрос на получение данных пользователя
    const fetchUserData = async () => {
      try {
        const response = await instance.get(`/users/${userId}`);
        if (response.status >= 200 && response.status < 300) {
          const { firstName, lastName, email, phone } = response.data;
          // Заполняем поля формы полученными данными
          setValue("firstName", firstName);
          setValue("lastName", lastName);
          // setValue("email", email);
          // setValue("phone", phone);
        }
      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, instance, setValue]);

  const toggleEdit = () => setIsEditable((prev) => !prev); // Переключение состояния

  const handleLogout = () => {
    logout(); // Вызов функции logout из контекста
    navigate("/");
    toast.info("You have been logged out.");
  };

  const onSubmit = async (data) => {
    try {
      const response = await instance.patch(`/users/${userId}`, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Success! Data has been changed");
        setIsEditable(false); // Отключить редактирование после успешного сохранения
      } else {
        toast.error("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response) {
        console.error("Server response:", error.response);
        toast.error("Network error or server is unavailable.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="personal__data">
      <div className="personal__data-top">
        <h3 className="personal__data-title">Personal Data</h3>
        <span
          type="button"
          className="personal__data-change--button"
          onClick={toggleEdit}
        >
          {isEditable ? "Cancel" : "Change data"}
        </span>
      </div>
      <div className="personal__data-inputs">
        <div className="personal__data-inputs-top">
          <div className="personal__data-input-box">
            <label htmlFor="name" className="personal__data-inputs--label">
              Name according to the passport
            </label>
            <input
              name="firstName"
              placeholder="John"
              type="text"
              id="name"
              className={`personal__data-input ${
                errors.firstName ? "input-error" : ""
              }`}
              {...register("firstName")}
              disabled={!isEditable} // Заблокировать поле, если редактирование отключено
            />
            <p className="error-message">{errors.firstName?.message}</p>
          </div>
          <div className="personal__data-input-box">
            <label htmlFor="surname" className="personal__data-inputs--label">
              Surname according to passport
            </label>
            <input
              name="lastName"
              placeholder="Doe"
              type="text"
              id="surname"
              className={`personal__data-input ${
                errors.lastName ? "input-error" : ""
              }`}
              {...register("lastName")}
              disabled={!isEditable}
            />
            <p className="error-message">{errors.lastName?.message}</p>
          </div>
        </div>
        <div className="personal__data-inputs-bottom">
          <div className="personal__data-input-box">
            <label htmlFor="email" className="personal__data-inputs--label">
              Email
            </label>
            <input
              name="email"
              placeholder="johndoe@gmail.com"
              type="email"
              id="email"
              className={`personal__data-input ${
                errors.email ? "input-error" : ""
              }`}
              {...register("email")}
              disabled={!isEditable}
            />
            <p className="error-message">{errors.email?.message}</p>
          </div>
          <div className="personal__data-input-box">
            <label htmlFor="phone" className="personal__data-inputs--label">
              Phone number
            </label>
            <input
              name="phone"
              placeholder="+(4) 176 324 44 954"
              type="tel"
              id="phone"
              className={`personal__data-input ${
                errors.phone ? "input-error" : ""
              }`}
              {...register("phone")}
              disabled={!isEditable}
            />
            <p className="error-message">{errors.phone?.message}</p>
          </div>
        </div>
      </div>
      <div className="personal__data-save--container">
        {isEditable && ( // Отображать кнопку сохранения только при редактировании
          <button type="submit" className="personal__data-save--button">
            SAVE
          </button>
        )}
        <button
          type="button"
          className="personal__data-logout--button"
          onClick={handleLogout} // Вызов функции logout
        >
          LOGOUT
        </button>
      </div>
    </form>
  );
};

export default SettingsData;
