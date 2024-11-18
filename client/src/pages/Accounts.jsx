import React from "react";
import Balance from "../components/balance/Balance";
import Cards from "../components/cards/Cards";

const Accounts = () => {
  return (
    <div className="accounts">
      <div className="container">
        <div className="accounts__divider">
          <div className="accounts__left">
            <Balance />
            <Cards />
            <section className="accounts__left-transactions">
                <h4 className="accounts__left-transaction--title accounts_title">
                My Last Transactions
                </h4>
            </section>
          </div>
          <div className="accounts__right">
            <section className="accounts__right-exchange-calc">
                <h4 className="accounts__right-exchange-calc--title accounts_title">
                Exchange Rates
                </h4>
            </section>
            <section className="accounts__right-spendings">
                <h4 className="accounts__right-spendings--title accounts_title">
                Spendings this month
                </h4>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
