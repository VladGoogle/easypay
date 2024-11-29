import React, { useState } from "react";
import Select from "react-select";
import "./style.css";
import arrow from "../../img/arrowexchange.svg";
import inputarrow from "../../img/inputarrow.svg";
import usd from "../../img/flags/USAFlagCircle.svg";
import gbp from "../../img/flags/United-Kingdom.svg";
import eur from "../../img/flags/circle-flags_eu.svg";

const CurrencyOption = ({ flag, code }) => (
  <div className="currency-option">
    <span className="currency-option__flag">{flag}</span>
    <span className="currency-option__code">{code}</span>
  </div>
);

const options = [
  {
    value: "USD",
    label: <CurrencyOption flag={<img src={usd} alt="USD Flag" />} code="USD" />,
    flag: <img src={usd} alt="USD Flag" className="currency-button__flag" />,
  },
  {
    value: "EUR",
    label: <CurrencyOption flag={<img src={eur} alt="EUR Flag" />} code="EUR" />,
    flag: <img src={eur} alt="EUR Flag" className="currency-button__flag" />,
  },
  {
    value: "GBP",
    label: <CurrencyOption flag={<img src={gbp} alt="GBP Flag" />} code="GBP" />,
    flag: <img src={gbp} alt="GBP Flag" className="currency-button__flag" />,
  },
];

const Exchange = () => {
  const [selectedOption1, setSelectedOption1] = useState(options[1]);
  const [selectedOption2, setSelectedOption2] = useState(options[0]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      padding: '0',
      border: 'none',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      fontWeight: '500',
      boxShadow: state.isFocused ? 'none' : base.boxShadow,
      borderColor: state.isFocused ? 'transparent' : base.borderColor,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    
  };

  return (
    <section className="exchange__calc">
      <div className="exchange__top">
        <div className="exchange__top-left">
          <h4 className="exchange-calc--title accounts_title">
            Exchange Rates
          </h4>
        </div>
        <div className="exchange__top-right">
          <img src={arrow} alt="" className="exchange__icon" />
          <span className="exchange__top--date">16.10.2024</span>
        </div>
      </div>
      <div className="exchange__inputs">
        <div className="exchange__input--container">
          <input
            type="number"
            placeholder="0.00"
            className="exchange__input"
          />
          <Select
            value={selectedOption1}
            onChange={setSelectedOption1}
            options={options}
            isSearchable={false}
            styles={customStyles} // Используем customStyles
            components={{
              DropdownIndicator: () => (
                <img
                  src={inputarrow}
                  alt="Arrow"
                  className="currency-select__arrow"
                />
              ),
            }}
          />
        </div>
        <div className="exchange__input--container">
          <input
            type="number"
            placeholder="0.00"
            className="exchange__input"
          />
          <Select
            value={selectedOption2}
            onChange={setSelectedOption2}
            options={options}
            isSearchable={false}
            styles={customStyles} // Используем customStyles
            components={{
              DropdownIndicator: () => (
                <img
                  src={inputarrow}
                  alt="Arrow"
                  className="currency-select__arrow"
                />
              ),
            }}
          />
        </div>
      </div>
      <div className="exchange__tax">
        <span className="exchange__tax--title">Including fees</span>
        <span className="exchange__tax--amount">6.60 EUR</span>
      </div>
      <button className="exchange__button">Check</button>
    </section>
  );
};

export default Exchange;