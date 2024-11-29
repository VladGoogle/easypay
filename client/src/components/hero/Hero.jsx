import React from "react";
import "./style.css";
import smallLogo from "../../img/small_logo.svg";
import chip from "../../img/chip.svg";
import topLeftarrow from "../../img/arrowtopleft.svg";
import topRightarrow from "../../img/arrowtopright.svg";
import bottomLeftarrow from "../../img/arrowbottomleft.svg";
import shareArrow from "../../img/sharearrow.svg";

const Hero = () => {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero__top">
          <h1 className="hero__title">
            BasedBank - based choice! Make your transactions the fastest
          </h1>
        </div>
        <div className="hero__card">
          <div className="hero__card-left">
            <div className="hero__card-left-top">
              <p className="hero__card-left-top--text hero__card-left-text">
                Any currencies of your choice
              </p>
              <img
                src={topLeftarrow}
                alt="arrow"
                className="hero__card-arrow--topleft"
              />
            </div>
            <div className="hero__card-left-bottom">
              <img
                src={bottomLeftarrow}
                alt="arrow"
                className="hero__card-arrow--bottomleft"
              />
              <p className="hero__card-left-bottom--text hero__card-left-text">
                Transactions all over the world
              </p>
            </div>
          </div>
          <div className="hero__card-center">
            <div className="hero__card-center-top">
              <div className="hero__card-top-amount">
                <span className="hero__card-amount-subtext">
                  Available on Card
                </span>
                <p className="hero__card-amount-text">500 EUR</p>
              </div>
              <img
                src={smallLogo}
                alt="small logo"
                className="
                hero__card-logo--small"
              />
            </div>
            <div className="hero__card-center-bottom">
              <p className="hero__card-number">DE 12 1006 43454 32234323</p>
              <img src={chip} alt="card chip" className="card__chip" />
            </div>
          </div>
          <div className="hero__card-right">
            <img
              src={topRightarrow}
              alt="arrow"
              className="hero__card-arrow--topright"
            />
            <p className="hero__card-right-text">
              We guarantee safety for your money
            </p>
          </div>
        </div>
        <div className="hero__bottom">
          <p className="hero__bottom-text">
            BasedBank offers some of the best conditions on the market for
            transactions between accounts, both within and outside the system,
            with maximum speed and security for you and your money
          </p>
          <div className="hero__bottom-buttons">
            <button className="hero__bottom-button hero__bottom-button--apply">
              Apply now
            </button>
            <button className="hero__bottom-button hero__bottom-button--learn">
              Learn more <img src={shareArrow} alt="arrow" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
