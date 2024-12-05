import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../TokenContext";
import { toast } from "react-toastify";

const Unauthorized = ({ children }) => {
  const { accessToken, logout } = useContext(TokenContext);
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);  // Флаг для контроля уведомлений

  useEffect(() => {
    if (!accessToken && !hasNotified) {
      toast.error("You must log in first");
      setHasNotified(true);  // Устанавливаем флаг, что уведомление показано
       // Показ уведомления
      logout();  // Выход из сессии
      setRedirecting(true); // Устанавливаем флаг редиректа
      navigate("/", { replace: true });  // Редирект на главную страницу
    }
  }, [accessToken, logout, navigate, hasNotified]); // Добавляем hasNotified как зависимость

  if (!accessToken || redirecting) {
    return null;  // Не показываем компонент, пока идет редирект
  }

  return children;  // Если токен есть, рендерим детей
};

export default Unauthorized;