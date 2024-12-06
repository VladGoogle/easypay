import axios from "axios";
import { useContext } from "react";
import { TokenContext } from "../../TokenContext";

const AxiosInstance = () => {
  const { accessToken, refreshToken, setToken, logout } = useContext(TokenContext);

  const instance = axios.create({
    baseURL: `http://${process.env.BE_HOST}:${process.env.BE_PORT}/api/v1`,
    timeout: 5000,
  });

  // Добавляем токен в запросы
  instance.interceptors.request.use(
    async (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Обрабатываем ответы и ошибки
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const response = await axios.post("http://localhost:3001/api/v1/auth/refresh", {
            refreshToken, // Изменено на camelCase
          });
  
          const { accessToken } = response.data; // Изменено на camelCase
          setToken({ accessToken, refreshToken }); // Передаем обновленный токен
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );

  return instance;
};

export default AxiosInstance;