import React from "react";
import "./style.css";
import icon from "../../img/icon_check.svg";

const Notification = ({ text, onNavigate }) => {
    return (
      <div className="notification">
        <img src={icon} alt="Notification Icon" className="notification__icon" />
        <p className="notification__text">{text}</p>
        <div className="notification__buttons">
          <button
            type="button"
            className="notification__buttons-home"
            onClick={() => onNavigate("/authorization")} // Перенаправление на главную
          >
            Log in
          </button>
        </div>
      </div>
    );
  };

export default Notification;