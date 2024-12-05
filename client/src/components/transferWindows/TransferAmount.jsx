import React, { useState } from "react";
import Select from "react-select";
import "./style.css";
import inputarrow from "../../img/inputarrow.svg";
import usd from "../../img/flags/USAFlagCircle.svg";
import gbp from "../../img/flags/United-Kingdom.svg";
import eur from "../../img/flags/circle-flags_eu.svg";
import inputLogoEUR from "../../img/inputlogos/inputlogoeur.svg";
import inputLogoUSD from "../../img/inputlogos/inputlogousd.svg";
import inputLogoGBP from "../../img/inputlogos/inputlogogbp.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const CurrencyOption = ({ flag, code }) => (
  <div className="currency-option">
    <span className="currency-option__flag">{flag}</span>
    <span className="currency-option__code">{code}</span>
  </div>
);

// Схема валидации с помощью yup
const schema = yup.object().shape({
  sendingAmount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount to send is required"),
  receivingAmount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount to receive is required"),
  transactionType: yup.string().required("transaction type is required"),
});

const onSubmit = (data) => {
  console.log("Form Data: ", data);
  alert("Form submitted successfully!");
};

const options = [
  {
    value: "USD",
    label: (
      <CurrencyOption flag={<img src={usd} alt="USD Flag" />} code="USD" />
    ),
    flag: <img src={usd} alt="USD Flag" className="currency-button__flag" />,
  },
  {
    value: "EUR",
    label: (
      <CurrencyOption flag={<img src={eur} alt="EUR Flag" />} code="EUR" />
    ),
    flag: <img src={eur} alt="EUR Flag" className="currency-button__flag" />,
  },
  {
    value: "GBP",
    label: (
      <CurrencyOption flag={<img src={gbp} alt="GBP Flag" />} code="GBP" />
    ),
    flag: <img src={gbp} alt="GBP Flag" className="currency-button__flag" />,
  },
];

const transactionOptions = [
  {
    value: "euro-payment",
    label: (
      <div className="transaction-option">
        <img
          src={inputLogoEUR}
          alt="BasedBank Icon"
          className="transaction-option__icon"
        />
        EUR-Balance BasedBank 
      </div>
    ),
  },
  {
    value: "dolar-payment",
    label: (
      <div className="transaction-option">
        <img
          src={inputLogoUSD}
          alt="BasedBank Icon"
          className="transaction-option__icon"
        />
        USD-Balance BasedBank 
      </div>
    ),
  },
  {
    value: "frank-payment",
    label: (
      <div className="transaction-option">
        <img
          src={inputLogoGBP}
          alt="BasedBank Icon"
          className="transaction-option__icon"
        />
        GBP-Balance BasedBank 
      </div>
    ),
  },
];

const transactionCustomStyles = {
  control: (base, state) => ({
    ...base,
    border: "none",
    backgroundColor: "transparent",
    boxShadow: state.isFocused ? 'none' : base.boxShadow,
    cursor: "pointer"
  }),
  container: (base) => ({
    ...base,
    width: "100%",
  }),
  indicatorSeparator: () => ({
    display: "none", // Убираем разделитель индикатора
  }),
};

const TransferAmount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedOption1, setSelectedOption1] = useState(options[1]);
  const [selectedOption2, setSelectedOption2] = useState(options[0]);
  const [transactionType, setTransactionType] = useState(transactionOptions[0]);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      padding: "0",
      border: "none",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      fontWeight: "500",
      boxShadow: state.isFocused ? "none" : base.boxShadow,
      borderColor: state.isFocused ? "transparent" : base.borderColor,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form__amount">
      <h2 className="auth__title">Write an amount</h2>
      <fieldset className="form__amount-fieldset">
        <ul className="form__amount-input--list">
          <li className="form__amount-input--item">
            <label htmlFor="sending" className="form__amount-input--label">
              You are sending
            </label>
            <div className="amount__input--container">
              <input
                id="sending"
                type="number"
                placeholder="0.00"
                className="amount__input"
                {...register("sendingAmount")}
              />
              <Select
                value={selectedOption1}
                onChange={setSelectedOption1}
                options={options}
                isSearchable={false}
                styles={customStyles}
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
            <p className="error-message">{errors.sendingAmount?.message}</p>
            <p className="error-message">{errors.sendingCurrency?.message}</p>
          </li>
          <li className="form__amount-input--item">
            <label htmlFor="receiving" className="form__amount-input--label">
              Recipient will receive
            </label>
            <div className="amount__input--container">
              <input
                id="receiving"
                type="number"
                placeholder="0.00"
                className="amount__input"
                {...register("receivingAmount")}
              />
              <Select
                value={selectedOption2}
                onChange={setSelectedOption2}
                options={options}
                isSearchable={false}
                styles={customStyles}
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
            <p className="error-message">{errors.receivingAmount?.message}</p>
            <p className="error-message">{errors.receivingCurrency?.message}</p>
          </li>
          <li className="form__amount-input--item">
            <label
              htmlFor="transactiontype"
              className="form__amount-input--label"
            >
              Type of transaction
            </label>
            <div className="amount__input-transaction--container">
              <Select
                styles={transactionCustomStyles}
                value={transactionType}
                onChange={(selectedOption) => setTransactionType(selectedOption)}
                options={transactionOptions}
                isSearchable={false}
                components={{
                  DropdownIndicator: () => (
                    <img
                      src={inputarrow}
                      alt="Arrow"
                      className="custom-select__arrow"
                    />
                  ),
                }}
              />
            </div>
            <p className="error-message">{errors.transactionType?.message}</p>
          </li>
        </ul>
      </fieldset>
      <button className="form__amount-submit--button">Continue</button>
    </form>
  );
};

export default TransferAmount;
