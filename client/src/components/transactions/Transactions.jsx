import React from "react";
import "./style.css";

const transaction = [
    {
      status: "Done",
      date: "06/06/2024",
      recipient: "PayPal",
      before: "163.30 EUR",
      after: "166.70 EUR",
      amount: "+3.40 EUR",
    },
    {
      status: "Done",
      date: "04/06/2024",
      recipient: "PayPal",
      before: "140.00 EUR",
      after: "163.30 EUR",
      amount: "+23.30 EUR",
    },
    {
      status: "Pending",
      date: "22/05/2024",
      recipient: "Katerina Mihovska",
      before: "4 122.21 GBP",
      after: "4 434.86 GBP",
      amount: "+312.65 GBP",
    },
    {
      status: "Failed",
      date: "15/05/2024",
      recipient: "DB GmbH",
      before: "4 165.20 GBP",
      after: "4 122.21 GBP",
      amount: "-42.99 GBP",
    },
    {
      status: "Done",
      date: "13/05/2024",
      recipient: "Ivan Makovenko",
      before: "4 000.00 GBP",
      after: "4 165.20 GBP",
      amount: "+165.20 GBP",
    },
    {
      status: "Done",
      date: "13/05/2024",
      recipient: "Ivan Makovenko",
      before: "4 000.00 GBP",
      after: "4 165.20 GBP",
      amount: "+165.20 GBP",
    },
    {
      status: "Done",
      date: "13/05/2024",
      recipient: "Ivan Makovenko",
      before: "4 000.00 GBP",
      after: "4 165.20 GBP",
      amount: "+165.20 GBP",
    },
    {
      status: "Done",
      date: "13/05/2024",
      recipient: "Ivan Makovenko",
      before: "4 000.00 GBP",
      after: "4 165.20 GBP",
      amount: "+165.20 GBP",
    },
    {
      status: "Done",
      date: "13/05/2024",
      recipient: "Ivan Makovenko",
      before: "4 000.00 GBP",
      after: "4 165.20 GBP",
      amount: "+165.20 GBP",
    },
    {
      status: "Done",
      date: "13/05/2024",
      recipient: "Ivan Makovenko",
      before: "4 000.00 GBP",
      after: "4 165.20 GBP",
      amount: "+165.20 GBP",
    },
    {
      status: "Done",
      date: "13/05/2024",
      recipient: "Ivan Makovenko",
      before: "4 000.00 GBP",
      after: "4 165.20 GBP",
      amount: "+165.20 GBP",
    },
  ];

const Transactions = () => {
  return (
    <section className="accounts__transactions">
      <h4 className="accounts__transaction--title accounts_title">
        My Last Transactions
      </h4>
      <table className="accounts__transaction-table">
        <thead>
          <tr>
            <th className="account__transactions-table--title">Status</th>
            <th className="account__transactions-table--title">Date</th>
            <th className="account__transactions-table--title">Recipient</th>
            <th className="account__transactions-table--title">Before</th>
            <th className="account__transactions-table--title account__transactions-after">After</th>
            <th className="account__transactions-table--title account__transactions-amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transaction.map((transaction, index) => (
            <tr key={index}>
              <td className="account__transactions-status--container">{transaction.status}</td>
              <td className="account__transactions-date--container">{transaction.date}</td>
              <td className="account__transactions-recipient--container">{transaction.recipient}</td>
              <td className="account__transactions-before--container">{transaction.before}</td>
              <td className="account__transactions-after--container">{transaction.after}</td>
              <td className="account__transactions-amount--container">{transaction.amount}</td>
              <td className="account__transactions-action--container">
                <button
                  className="accounts__transaction-action"
                >
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Transactions;