import React, { useEffect, useRef } from "react";
import snsWebSdk from "@sumsub/websdk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/instance";
import BASE_URLS from "../axios/config";

const SumSubWebSDK = ({ accessToken, applicantId }) => {
  const containerRef = useRef();
  const navigate = useNavigate();

  // Экземпляр для локальных запросов
  const localInstance = AxiosInstance(BASE_URLS.LOCAL, accessToken);
  // Экземпляр для запросов к SumSub
  const sumsubInstance = AxiosInstance(BASE_URLS.SUMSUB, accessToken);

  useEffect(() => {
    if (!accessToken || !applicantId) {
      toast.error("Invalid access token or applicant ID.");
      navigate("/");
      return;
    }

    const sdk = snsWebSdk({
      container: containerRef.current,
      accessToken,
      lang: "en",
      onMessage: (type, payload) => {
        console.log(`SumSub message: ${type}`, payload);
        if (type === "onError") {
          toast.error("An error occurred during verification.");
        }
      },
      onError: (error) => {
        console.error("SumSub error:", error);
        toast.error("Verification failed. Please try again.");
      },
    });

    sdk
      .launch()
      .on("complete", async () => {
        console.log("Verification complete");

        try {
          // Локальный запрос для проверки статуса
          const statusResponse = await localInstance.get(`/resources/applicants/${applicantId}/status`, {
            headers: {
              "x-app-token": process.env.SUMSUB_APP_TOKEN,
            },
          });

          // Если статус "approved"
          if (statusResponse.data.status === "approved") {
            toast.success("Verification successful! Redirecting...");
            navigate("/");
          } else {
            toast.error("Verification failed. Please try again.");
          }
        } catch (error) {
          console.error("Error checking applicant status:", error);
          toast.error("Failed to update verification status.");
        }
      });

    return () => sdk.destroy();
  }, [accessToken, applicantId, navigate, localInstance]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default SumSubWebSDK;
