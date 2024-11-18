import React from "react";
import "./style.css";

const Balance = () => {
  return (
    <section className="accounts__left-balance">
      <div className="accounts__left-balance-top">
        <h4 className="accounts__left-balance--title accounts_title">
          Total Balance
        </h4>
        <span className="accounts__left-balance--subtitle">
          On all accounts
        </span>
      </div>
      <div className="account__left-balance--amount">
        <h3 className="account__left-balance--euro">400.00 EUR</h3>
        <h3 className="account__left-balance--usd">122.00 USD</h3>
        <h3 className="account__left-balance--gbp">60.00 GBP</h3>
      </div>
    </section>
  );
};

export default Balance;
