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
        userId: action.payload.userId,
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
  applicantStatus: localStorage.getItem("applicant_status") || null,
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

  const setToken = ({ accessToken, refreshToken }) => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.id;
      const applicantStatus = decodedToken.applicantStatus || null;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("applicant_status", applicantStatus);
      dispatch({ type: "SET_TOKEN", payload: { accessToken, refreshToken, userId, applicantStatus } });
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };

  const logout = () => {
    console.log("Logging out and removing tokens from localStorage");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("applicant_status");
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
