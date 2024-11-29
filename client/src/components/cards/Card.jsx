import React from 'react'
import './style.css'
import logo from "../../img/cardlogo.svg"
import chip from "../../img/smallchip.svg"

const Card = () => {
  return (
    <div className="card">
        <div className="card__top">
            <div className="card__top-price">
                <span className="card__top-price--subtitle">
                Available on Card
                </span>
                <p className="card__top-price--text">
                400.00 EUR
                </p>
            </div>
            <img src={logo} alt="logo" className="logo" />
        </div>
        <div className="card__bottom">
            <p className="card__iban">
            **** 1818
            </p>
            <img src={chip} alt="chip" className="card__chip" />
        </div>
    </div>
  )
}

export default Card