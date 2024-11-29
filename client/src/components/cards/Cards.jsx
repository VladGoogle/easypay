import React from "react";
import "./style.css";
import copy from "../../img/copy.svg";
import invoice from "../../img/invoice.svg";
import Card from "./Card";
import { NavLink } from "react-router-dom";

const Cards = () => {
  return (
    <section className="accounts__left-cards">
      <div className="accounte-left-cards-top">
        <h4 className="accounts__left-cards--title accounts_title">My Cards</h4>
        <span className="accounts__left-cards--subtitle">3 Cards</span>
      </div>
      <div className="accounts__left-cards-center">
        <ul className="accounts__left-cards--list">
          <li className="account__left-cards--item">
            <Card />
          </li>
        </ul>
      </div>
      <div className="accounts__left-cards-bottom">
        <div className="accounts__left-cards-bottom--top">
          <div className="accounts__left-cards-bottom-number--box">
            <p className="accounts__left-cards-bottom-number--text">
              Account Number: DKKF332KMVM5432CVXC
            </p>
            <img
              src={copy}
              alt="copy"
              className="accounts__left-cards-bottom-number--icon"
            />
          </div>
          <div className="accounts__left-cards-bottom-invoices">
            <a className="accounts__left-cards-bottom-invoices--text">
              Download invoices
            </a>
            <img
              src={invoice}
              alt="invoices"
              className="accounts__left-cards-bottom-invoices--image"
            />
          </div>
        </div>
        <div className="accounts__left-cards-bottom--bottom">
          <ul className="accounts__left-cards-bottom--list">
            <li className="accounts__left-cards-bottom--item">
              <button className="accounts__left-cards-bottom--button accounts__left-cards-bottom--button-details">
                Show card details
              </button>
            </li>
            <li className="accounts__left-cards-bottom--item">
              <NavLink to="/transfer/transferamount">
                {" "}
                <button className="accounts__left-cards-bottom--button accounts__left-cards-bottom--button-transfer">
                  Transfer
                </button>
              </NavLink>
            </li>
            <li className="accounts__left-cards-bottom--item">
              <button className="accounts__left-cards-bottom--button accounts__left-cards-bottom--button-deposit">
                Deposit
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Cards;
