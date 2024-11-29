import React from 'react';
import Hero from '../components/hero/Hero';
import HomeMain from '../components/homeMain/HomeMain';

const Home = () => {
  return (
    <main>
      <div className="hero-container">
        <Hero />
      </div>
    <HomeMain />
    </main>
  );
}

export default Home;