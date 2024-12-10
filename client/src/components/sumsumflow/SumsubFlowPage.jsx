import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SumSubWebSDK from "../../utils/sumsub/SumSubWebSDK";
import { fetchSumsubAccessToken } from "../../utils/sumsub/sumsubService";
import { toast } from "react-toastify";

const SumsubFlowPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [applicantId, setApplicantId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeKYC = async () => {
      try {
        const { accessToken, applicantId } = await fetchSumsubAccessToken();
        setAccessToken(accessToken);
        setApplicantId(applicantId); // Сохраняем applicantId
      } catch (error) {
        console.error("Failed to fetch Sumsub access token:", error);
        toast.error("Failed to initiate verification. Please try again.");
        navigate("/");
      }
    };

    initializeKYC();
  }, [navigate]);

  if (!accessToken || !applicantId) {
    return <div className="loading-indicator">Loading SumSub verification...</div>;
  }

  return <SumSubWebSDK accessToken={accessToken} applicantId={applicantId} />;
};

export default SumsubFlowPage;
