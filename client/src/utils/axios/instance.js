import axios from "axios";
import BASE_URLS from "./config";

const AxiosInstance = (baseURL, accessToken, refreshToken, setToken, logout) => {
  const instance = axios.create({
    baseURL, 
    timeout: 5000,
  });

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Access Token is missing in request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log("Response error:", error.response); // Логируем ошибку в случае 401

      if (error.response?.status === 401 && refreshToken) {
        try {
          const response = await axios.post(`${BASE_URLS.LOCAL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken: newAccessToken } = response.data;
          setToken({ accessToken: newAccessToken, refreshToken });
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
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
