import React, { useState, useEffect, useContext } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import "./style.css";
import logo from "../../img/logo.svg";
import { TokenContext } from "../../TokenContext";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
import { ReactComponent as CustomArrow } from "../../img/inputarrowdropdown.svg";

const Header = () => {
  const { accessToken, logout } = useContext(TokenContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAuthenticated = Boolean(accessToken);
  const navigate = useNavigate();


  // Эффект для отслеживания прокрутки
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


  // Стиль для заголовка в зависимости от пути
  const pageHeaderStyles = {
    "/": "header--home",
    "/accounts": "header--accounts",
    "/services": "header--services",
    "/about": "header--about",
    "/contact": "header--contact",
    "/authorization": "header--authorization",
  };
  const headerClass = pageHeaderStyles[location.pathname] || "";

  return (
    <header className={`header ${isScrolled ? "header--scrolled" : ""} ${headerClass}`}>
      <div className="header__left">
        <NavLink to="/" className="header__logo-link">
          <img src={logo} alt="logo" className="header__logo" />
        </NavLink>
      </div>
      <nav className="header__navbar">
        <ul className="header__navbar-list">
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
            <NavLink to="/aboutus">ABOUT US</NavLink>
          </li>
          <li className="header__navbar-item">
            <NavLink to="/contactus">CONTACT</NavLink>
          </li>
        </ul>
      </nav>
      <div className="header__right">
        {isAuthenticated ? (
          <NavLink to="/settings">
              Settings
          </NavLink>
        ) : (
          <NavLink to="/authorization">
            <button className="header__btn">SIGN IN</button>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
