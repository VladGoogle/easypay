import React, { createContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const TokenContext = createContext();

const tokenReducer = (state, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      return { 
        ...state, 
        accessToken: action.payload.accessToken, 
        refreshToken: action.payload.refreshToken,
        userId: action.payload.userId
      };
    case "LOGOUT":
      return { ...state, accessToken: "", refreshToken: "", userId: "" };
    default:
      return state;
  }
};

const initialState = {
  accessToken: localStorage.getItem("access_token") || "",
  refreshToken: localStorage.getItem("refresh_token") || "",
  userId: localStorage.getItem("user_id") || "", 
};

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

const TokenProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tokenReducer, initialState);

  // Функция для установки токена и извлечения userId
  const setToken = ({ accessToken, refreshToken }) => {
    try {
      const decodedToken = jwtDecode(accessToken); // Декодируем токен только один раз
      const userId = decodedToken.id; // Извлекаем id из токена
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_id", userId); // Сохраняем userId в localStorage
      dispatch({ type: "SET_TOKEN", payload: { accessToken, refreshToken, userId } }); // Обновляем состояние
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id"); // Удаляем userId из localStorage
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    if (state.accessToken && isTokenExpired(state.accessToken)) {
      logout();
    }
  }, [state.accessToken, state.userId]);

  return (
    <TokenContext.Provider value={{ ...state, setToken, logout }}>
      {children}
    </TokenContext.Provider>
  );
};

export { TokenProvider, TokenContext };
