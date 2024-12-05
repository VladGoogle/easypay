import React, { useState, useEffect } from "react";
import { createApplicant, getAccessTokenForApplicant } from "../../utils/sumsub/SumSubService";

const SumSubFlow = ({ applicantId }) => {
    const [accessToken, setAccessToken] = useState("");
  
    useEffect(() => {
      const fetchAccessToken = async () => {
        try {
          const token = await getAccessTokenForApplicant(applicantId);
          setAccessToken(token);
          console.log("Access Token for Sumsub Flow:", token);
        } catch (error) {
          console.error("Ошибка получения токена для Sumsub Flow:", error);
        }
      };
  
      fetchAccessToken();
    }, [applicantId]);
  
    return (
      <div>
        <h2>Процесс верификации через Sumsub</h2>
        {accessToken ? (
          <div>
            <p>Токен доступа: {accessToken}</p>
            {/* Здесь можно добавить логику для отображения или использования токена */}
          </div>
        ) : (
          <p>Загружаем информацию для верификации...</p>
        )}
      </div>
    );
  };
  
  export default SumSubFlow;