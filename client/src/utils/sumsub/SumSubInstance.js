import axios from "axios";

// Функция для создания axios-инстанса с переданным accessToken
const SumSubInstance = (accessToken) => {
  const instance = axios.create({
    baseURL: "https://api.sumsub.com",
    timeout: 5000,
    headers: {
      "X-App-Token": process.env.REACT_APP_SUMSUB_APP_TOKEN, // Используем переменную из .env
    },
  });

  // Добавляем токен авторизации в каждый запрос
  instance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

export default SumSubInstance;