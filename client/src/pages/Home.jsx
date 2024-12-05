import React, { useState, useEffect } from "react";
import Hero from "../components/hero/Hero";
import HomeMain from "../components/homeMain/HomeMain";
import Loader from "../components/loader/Loader";


const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Симуляция загрузки данных
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {isLoading && <Loader />} {/* Показать Loader поверх страницы */}
      <div className="hero-container">
        <Hero />
      </div>
      <HomeMain />
    </main>
  );
};

export default Home;