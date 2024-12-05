import React, { useState } from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AxiosInstance from "../../utils/axios/instance";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, 'Password must be at most 20 characters')
    .matches(/[A-Z]/, "Password must include an uppercase letter")
    .matches(/[0-9]/, "Password must include a number")
    .required("Password is required"),
    currentPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, 'Password must be at most 20 characters')
    .matches(/[A-Z]/, "Password must include an uppercase letter")
    .matches(/[0-9]/, "Password must include a number")
    .required("Password is required"),
});

const SettingsPassword = () => {
  const [isEditable, setIsEditable] = useState(false); // Состояние редактирования
  const instance = AxiosInstance();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toggleEdit = () => setIsEditable((prev) => !prev); // Переключение состояния

  const onSubmit = async (data) => {
    try {
      const response = await instance.post("/users", data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Success! password has been changed");
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
    <form onSubmit={handleSubmit(onSubmit)} className="personal__password">
      <div className="personal__password-top">
        <h3 className="personal__password-title">Password</h3>
        <span
          type="button"
          className="personal__password-change--button"
          onClick={toggleEdit}
        >
          {isEditable ? "Cancel" : "Change password"}
        </span>
      </div>
      <div className="personal__password-inputs">
        <div className="personal__password-inputs-top">
          <div className="personal__password-input-box">
            <label htmlFor="password" className="personal__password-inputs--label">
              Current password
            </label>
            <input
              name="password"
              placeholder="Qwerty987."
              type="text"
              id="password"
              className={`personal__password-input ${
                errors.firstName ? "input-error" : ""
              }`}
              {...register("currentPassword")}
              disabled={!isEditable} // Заблокировать поле, если редактирование отключено
            />
            <p className="error-message">{errors.currentPassword?.message}</p>
          </div>
          <div className="personal__password-input-box">
            <label htmlFor="password" className="personal__password-inputs--label">
              New password
            </label>
            <input
              name="password"
              placeholder="Qwerty789."
              type="text"
              id="password"
              className={`personal__password-input ${
                errors.lastName ? "input-error" : ""
              }`}
              {...register("password")}
              disabled={!isEditable}
            />
            <p className="error-message">{errors.newPassword?.message}</p>
          </div>
        </div>
      </div>
      {isEditable && ( // Отображать кнопку сохранения только при редактировании
        <div className="personal__password-save--container">
          <button type="submit" className="personal__password-save--button">
            SAVE
          </button>
        </div>
      )}
    </form>
  );
};

export default SettingsPassword;
