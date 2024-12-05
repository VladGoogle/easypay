import React, { useState } from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AxiosInstance from "../../utils/axios/instance";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  // country: yup.string().trim().required("Country is required"),
  city: yup.string().trim(),
  district: yup.string().trim(),
  firstStreetLine: yup.string().trim(),
  postCode: yup
    .string()
    .typeError("Index must be a number"),
});

const SettingsAddress = () => {
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
        toast.success("Success! address has been changed");
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
    <form onSubmit={handleSubmit(onSubmit)} className="personal__address">
      <div className="personal__address-top">
        <h3 className="personal__address-title">Address</h3>
        <span
          type="button"
          className="personal__address-change--button"
          onClick={toggleEdit}
        >
          {isEditable ? "Cancel" : "Change address"}
        </span>
      </div>
      <div className="personal__address-inputs">
        <div className="personal__address-inputs-top">
          <div className="personal__address-input-box">
            <label htmlFor="name" className="personal__address-inputs--label">
              Name according to the passport
            </label>
            <input
              name="text"
              placeholder="John"
              type="text"
              id="name"
              className={`personal__address-input ${
                errors.firstName ? "input-error" : ""
              }`}
              {...register("firstName")}
              disabled={!isEditable} // Заблокировать поле, если редактирование отключено
            />
            <p className="error-message">{errors.firstName?.message}</p>
          </div>
          <div className="personal__address-input-box">
            <label
              htmlFor="surname"
              className="personal__address-inputs--label"
            >
              Surname according to passport
            </label>
            <input
              name="surname"
              placeholder="Doe"
              type="text"
              id="surname"
              className={`personal__address-input ${
                errors.lastName ? "input-error" : ""
              }`}
              {...register("lastName")}
              disabled={!isEditable}
            />
            <p className="error-message">{errors.lastName?.message}</p>
          </div>
        </div>
        <div className="personal__address-inputs-bottom">
          <div className="personal__address-input-box">
            <label htmlFor="email" className="personal__address-inputs--label">
              Email
            </label>
            <input
              name="email"
              placeholder="johndoe@gmail.com"
              type="email"
              id="email"
              className={`personal__address-input ${
                errors.email ? "input-error" : ""
              }`}
              {...register("email")}
              disabled={!isEditable}
            />
            <p className="error-message">{errors.email?.message}</p>
          </div>
          <div className="personal__address-input-box">
            <label htmlFor="phone" className="personal__address-inputs--label">
              Phone number
            </label>
            <input
              name="phone"
              placeholder="+(4) 176 324 44 954"
              type="tel"
              id="phone"
              className={`personal__address-input ${
                errors.phone ? "input-error" : ""
              }`}
              {...register("phone")}
              disabled={!isEditable}
            />
            <p className="error-message">{errors.phone?.message}</p>
          </div>
        </div>
      </div>
      {isEditable && ( // Отображать кнопку сохранения только при редактировании
        <div className="personal__address-save--container">
          <button type="submit" className="personal__address-save--button">
            SAVE
          </button>
        </div>
      )}
    </form>
  );
};

export default SettingsAddress;
