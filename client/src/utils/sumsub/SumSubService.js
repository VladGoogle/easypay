import SumSubInstance from "./SumSubInstance";

// Функция для создания заявителя
export const createApplicant = async ({ userId, levelName, accessToken }) => {
  try {
    const response = await SumSubInstance(accessToken).post("/resources/applicants", {
      externalUserId: userId,
      levelName,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка создания заявителя SumSub:", error);
    throw error;
  }
};

// Функция для получения токена доступа
export const getAccessTokenForApplicant = async (applicantId, accessToken) => {
  try {
    const response = await SumSubInstance(accessToken).post(`/resources/accessTokens`, {
      applicantId,
    });
    return response.data.token;
  } catch (error) {
    console.error("Ошибка получения токена доступа SumSub:", error);
    throw error;
  }
};