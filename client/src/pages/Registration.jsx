import React, { useState } from "react";
import Signup from "../components/registration/Signup";
import Signup2 from "../components/registration/Signup2";
import Notification from "../components/notification/Notification";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [addressId, setAddressId] = useState(null);
  const [notification, setNotification] = useState({
    visible: false,
    text: "",
  });

  const handleStep1Complete = (addressId) => {
    setAddressId(addressId);
    setCurrentStep(2);
  };

  const handleStep2Complete = () => {
    setNotification({
      visible: true,
      text: "Congratulations! Registration completed successfully. Please enter your data on the login page",
    });
  };

  const handleNavigation = (path) => {
    setNotification({ visible: false, text: "" }); // Скрываем уведомление
    navigate(path); // Перенаправляем на указанный путь
  };

  return (
    <section className="registr">
      {notification.visible && (
        <Notification
          text={notification.text}
          onNavigate={handleNavigation} // Передаём обработчик навигации
        />
      )}
      {!notification.visible && (
        <>
          {currentStep === 1 && <Signup onComplete={handleStep1Complete} />}
          {currentStep === 2 && addressId && (
            <Signup2 addressId={addressId} onComplete={handleStep2Complete} />
          )}
        </>
      )}
    </section>
  );
};

export default Registration;
