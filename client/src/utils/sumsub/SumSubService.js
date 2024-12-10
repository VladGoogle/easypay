import BASE_URLS from "../axios/config";
import AxiosInstance from "../axios/instance"; // Ваш AxiosInstance

export const fetchSumsubAccessToken = async (accessToken) => {
  const APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
  const instance = AxiosInstance(BASE_URLS.LOCAL); // Для локальных запросов
  const sumsubInstance = AxiosInstance(BASE_URLS.SUMSUB);

  try {
    // Step 1: Initialize KYC (используем instance для локального запроса)
    const startResponse = await instance.get("/sumsub/start-kyc", {
      headers: {
        "x-app-token": APP_TOKEN,
        Authorization: `Bearer ${accessToken}`,  // Отправляем токен в заголовке Authorization
      },
    });

    const { externalUserId, inspectionId, review } = startResponse.data;

    // Step 2: Create Applicant (используем sumsubInstance для запросов к SumSub)
    await sumsubInstance.post(
      "/resources/applicants", // Запрос к API SumSub
      { externalUserId, inspectionId },
      {
        params: { levelName: review.levelName }, // Передаем levelName
        headers: {
          "x-app-token": APP_TOKEN,
          Authorization: `Bearer ${accessToken}`, // Отправляем токен
        },
      }
    );

    // Step 3: Fetch Access Token (используем sumsubInstance для запросов к SumSub)
    const tokenResponse = await sumsubInstance.post(
      "/resources/accessTokens", // Запрос к API SumSub
      {},
      {
        params: { userId: externalUserId, levelName: review.levelName },
        headers: {
          "x-app-token": APP_TOKEN,
        },
      }
    );

    return tokenResponse.data.token;
  } catch (error) {
    if (error.response?.status === 500) {
      // В случае ошибки 500, которая указывает на то, что процесс уже в обработке, выбрасываем специфическую ошибку
      throw new Error("KYC process already in progress");
    } else {
      console.error("Error fetching Sumsub access token:", error);
      throw error; // Пробрасываем другие ошибки
    }
  }
};
