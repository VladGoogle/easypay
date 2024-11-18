import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import "./style.css";
import logo from "../../img/logo.svg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Объект для хранения стилей в зависимости от пути
  const pageHeaderStyles = {
    "/": "header--home",
    "/accounts": "header--accounts",
    "/services": "header--services",
    "/about": "header--about",
    "/contact": "header--contact",
  };

  const headerClass = pageHeaderStyles[location.pathname] || "";

  return (
    <header
      className={`header ${isScrolled ? "header--scrolled" : ""} ${headerClass}`}
    >
      <div className="header__left">
        <NavLink to="/" className="header__logo-link">
          <img src={logo} alt="logo" className="header__logo" />
        </NavLink>
      </div>
      <div className="header__middle">
        <ul className="header__navbar">
          <li className="header__navbar-item">
            <NavLink to="/">HOME</NavLink>
          </li>
          <li className="header__navbar-item">
            <NavLink to="/accounts">CARDS</NavLink>
          </li>
          <li className="header__navbar-item">
            <NavLink to="/services">SERVICES</NavLink>
          </li>
          <li className="header__navbar-item">
            <NavLink to="/about">ABOUT US</NavLink>
          </li>
          <li className="header__navbar-item">
            <NavLink to="/contact">CONTACT</NavLink>
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