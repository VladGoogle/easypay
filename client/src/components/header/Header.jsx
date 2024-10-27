import React, { useState, useEffect } from "react";
import "./style.css";
import logo from "../../img/logo.svg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Порог прокрутки, после которого меняется прозрачность
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="header__left">
        <a href="#" className="header__logo-link">
          <img src={logo} alt="logo" className="header__logo" />
        </a>
      </div>
      <div className="header__middle">
        <ul className="header__navbar">
          <li className="header__navbar-item">
            <a href="#">HOME</a>
          </li>
          <li className="header__navbar-item">
            <a href="#">CARDS</a>
          </li>
          <li className="header__navbar-item">
            <a href="#">SERVICES</a>
          </li>
          <li className="header__navbar-item">
            <a href="#">ABOUT US</a>
          </li>
          <li className="header__navbar-item">
            <a href="#">CONTACT</a>
          </li>
        </ul>
      </div>
      <div className="header__right">
        <button className="header__btn">SIGN IN</button>
      </div>
    </header>
  );
};

export default Header;
