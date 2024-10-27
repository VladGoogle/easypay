import React from "react";
import "./style.css";
import cards from "../../img/banner1.svg";
import savings from "../../img/savings.png";
import shareArrow from "../../img/sharearrow.svg";
import check from "../../img/check.svg";
import linkArrow from "../../img/linkarrow.svg";

const HomeMain = () => {
  return (
    <div className="home__main">
      <div className="container">
        <section className="home__banner-membership">
          <div className="home__banner-membership--text">
            <span className="home__banner-membership--subtitle">
              EXPLORE THE APP
            </span>
            <h1 className="home__banner-membership--title">
              Free All-In-One Membership
            </h1>
            <ul className="home__banner-membership--list">
              <li className="home__banner-membership-list--item">
                <img
                  src={check}
                  alt="check"
                  className="home__banner-membership-list--icon"
                />
                Create unlimited amount of bank accounts
              </li>
              <li className="home__banner-membership-list--item">
                <img
                  src={check}
                  alt="check"
                  className="home__banner-membership-list--icon"
                />
                Make transactions with the most popular currencies
              </li>
              <li className="home__banner-membership-list--item">
                <img
                  src={check}
                  alt="check"
                  className="home__banner-membership-list--icon"
                />
                Have unlimited access to all functions
              </li>
              <li className="home__banner-membership-list--item">
                <img
                  src={check}
                  alt="check"
                  className="home__banner-membership-list--icon"
                />
                Enjoy the incredible speed of the transfers
              </li>
            </ul>
          </div>
          <img
            src={cards}
            alt="cards"
            className="home__banner-membership--image"
          />
        </section>
        <section className="home__banner-savings">
          <img
            src={savings}
            alt="savings"
            className="home__banner-savings--img"
          />
          <div className="home__banner-savings--text">
            <span className="home__banner-savings--subtitle">
              EXPLORE THE APP
            </span>
            <h1 className="home__banner-savings--title">
              Send savings internationally
            </h1>
            <p className="home__banner-savings--subtext">
              The fastest and most secure transactions abroad and back.
              Incredibly favorable exchange rates for the most popular
              currencies like USD, EUR, and GBP.
            </p>
            <button className="home__banner-savings--button">
              Learn more <img src={shareArrow} alt="arrow" />
            </button>
          </div>
        </section>
        <section className="hero__banner-features">
          <div className="hero__banner-features--text">
            <span className="hero__banner-features--subtitle">
              EXPLORE THE APP
            </span>
            <h1 className="hero__banner-features--title">
              Experience the wealth of features in our banking web application
            </h1>
          </div>
          <ul className="hero__banner-features--list">
            <li className="hero__banner-features--item hero__banner-features-item--cashback">
              <div className="hero__banner-features-item--bottom">
                <p className="hero__banner-features-item-bottom--text">
                  Explore Cashback
                </p>
                <img
                  src={linkArrow}
                  alt="arrow icon"
                  className="hero__banner-features-item-bottom--icon"
                />
              </div>
            </li>
            <li className="hero__banner-features--item hero__banner-features-item--safety">
              <div className="hero__banner-features-item--bottom">
                <p className="hero__banner-features-item-bottom--text">
                  Our Safety
                </p>
                <img
                  src={linkArrow}
                  alt="arrow icon"
                  className="hero__banner-features-item-bottom--icon"
                />
              </div>
            </li>
            <li className="hero__banner-features--item hero__banner-features-item--atm">
              <div className="hero__banner-features-item--bottom">
                <p className="hero__banner-features-item-bottom--text">
                  Find ATM
                </p>
                <img
                  src={linkArrow}
                  alt="arrow icon"
                  className="hero__banner-features-item-bottom--icon"
                />
              </div>
            </li>
            <li className="hero__banner-features--item hero__banner-features-item--chat">
              <div className="hero__banner-features-item--bottom">
                <p className="hero__banner-features-item-bottom--text">
                  Chat with us
                </p>
                <img
                  src={linkArrow}
                  alt="arrow icon"
                  className="hero__banner-features-item-bottom--icon"
                />
              </div>
            </li>
          </ul>
        </section>
        <section className="newsletter">
          <h1 className="newsletter__title">Subscribe to our newsletter</h1>
          <p className="newsletter__text">
            Subscribe to our newsletter to keep up to date with all the latest
            important news!
          </p>
          <div className="newsletter__input--box">
            <input
              type="email"
              name="Email"
              id="email"
              placeholder="Enter your email address"
              className="newsletter__input"
            />
            <button className="newsletter__input--button">Start</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeMain;
