import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../TokenContext";
import { toast } from "react-toastify";

const Authorized = ({ children }) => {
  const { accessToken } = useContext(TokenContext);
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (accessToken && !redirecting) {
      // Если токен присутствует, перенаправляем на главную страницу
      toast.error("You are already logged in!");  // Показываем уведомление
      setRedirecting(true);
      navigate("/", { replace: true });  // Перенаправляем на главную страницу
    }
  }, [accessToken, navigate, redirecting]);

  // Если токен присутствует или идет редирект, не показываем компонент
  if (accessToken || redirecting) {
    return null;
  }

  return children; // Показываем детей, если токен отсутствует
};

export default Authorized;
