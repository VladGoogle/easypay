import React from "react";
import Balance from "../components/balance/Balance";
import Cards from "../components/cards/Cards";
import Transactions from "../components/transactions/Transactions";
import Exchange from "../components/exchange/Exchange";
import Spendings from "../components/spendings/Spendings";

const Accounts = () => {
  return (
    <main className="accounts">
      <div className="container">
        <div className="accounts__divider">
          <div className="accounts__left">
            <Balance />
            <Cards />
          </div>
          <div className="accounts__right">
            <Exchange />
            <Spendings />
          </div>
        </div>
        <Transactions />
      </div>
    </main>
  );
};

export default Accounts;
