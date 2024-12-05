import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../img/scene.json";
import "./style.css";

const Loader = () => {
  return (
    <div className="overlay">
      <div className="loader-container">
        <Lottie animationData={loadingAnimation} loop autoplay />
      </div>
    </div>
  );
};

export default Loader;