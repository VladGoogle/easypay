import React from 'react';
import Hero from '../components/hero/Hero';
import HomeMain from '../components/homeMain/HomeMain';

const Home = () => {
  return (
    <>
      <div className="hero-container">
        <Hero />
      </div>
    <HomeMain />
    </>
  );
}

export default Home;