import React from 'react'
import './style.css'
import wallet from "../../img/wallet.svg"

const Spendings = () => {
  return (
    <section className="spendings">
        <h4 className="spendings--title accounts_title">
        Spendings this month
        </h4>
        <div className="spendings__main">
            <img src={wallet} alt="wallet icon" className="spendings__main--icon" />
            <p className="spendings__main--amount">
            $ 16,232.00
            </p>
        </div>
        <a className="spendings__link">
        See More
        </a>
    </section>
  )
}

export default Spendings