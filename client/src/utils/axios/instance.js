import axios from "axios";
import { useContext } from "react";
import { TokenContext } from "../../TokenContext";

const AxiosInstance = () => {
  const { token } = useContext(TokenContext);

  const instance = axios.create({
    baseURL: 'http://127.0.0.1:3001',
    timeout: 1000,
    headers: {
      'X-Custom-Header': 'foobar',
      'Authorization': `Bearer ${token}`
    }
  });

  return instance;
};

export default AxiosInstance;