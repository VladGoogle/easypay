import React from "react";
import "./style.css";
import logo from "../../img/footer_logo.svg";
import telegram from "../../img/telegram.svg";
import instagram from "../../img/instagram.svg";
import facebook from "../../img/facebook.svg";
import twitter from "../../img/twitter.svg";

const Footer = () => {
  return (
    <footer className="footer">
    <div className="container">
      <div className="footer_banner">
        <div className="footer__top">
          <div className="footer__top-left">
            <img src={logo} alt="logo" className="footer__top--logo" />
            <p className="footer__top-left--text">
              Make your financial part of life more safe and easy.
            </p>
          </div>
          <div className="footer__top-right">
            <div className="footer__top-right-list--container">
            <p className="footer__top-right-title--left">Contact Us</p>
            <ul className="footer__top-right-list--left">
              <li className="footer__top-right-item--left">+1(254)02406331</li>
              <li className="footer__top-right-item--left">
                basedbank@gmail.com
              </li>
              <li className="footer__top-right-item--left">Jukovskogo 66</li>
            </ul>
            </div>
            <div className="footer__top-right-list--container">
            <p className="footer__top-right-title--middle">Help</p>
            <ul className="footer__top-right-list--middle">
              <li className="footer__top-right-item--middle">
                FAQ Privacy Policy
              </li>
              <li className="footer__top-right-item--middle">
                Security Instructions
              </li>
            </ul>
            </div>
            <div className="footer__top-right-list--container">
            <p className="footer__top-right-title--right">Company</p>
            <ul className="footer__top-right-list--right">
              <li className="footer__top-right-item--right">Services Pricing</li>
              <li className="footer__top-right-item--right">About Us Careers</li>
              <li className="footer__top-right-item--right">Guarantees</li>
            </ul>
          </div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <p className="footer__bottom-left--copyright">
              © BasedBank 2024 license from 10.10.2024.
            </p>
          </div>
          <div className="footer__bottom-right">
            <button className="footer__bottom-right--button telegram__button">
              <img
                src={telegram}
                alt="telegram"
                className="footer__bottom-right--icon"
              />
              Telegram
            </button>
            <button className="footer__bottom-right--button instagram__button">
              <img
                src={instagram}
                alt="instagram"
                className="footer__bottom-right--icon"
              />
              Instagram
            </button>
            <button className="footer__bottom-right--button">
              <img
                src={facebook}
                alt="facebook" 
                className="footer__bottom-right--icon"
              />
              Facebook
            </button>
            <button className="footer__bottom-right--button ">
              <img
                src={twitter}
                alt="twitter"
                className="footer__bottom-right--icon"
              />
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
    </footer>
  );
};

export default Footer;
