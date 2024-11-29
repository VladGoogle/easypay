import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.css'

const Stepper = ({ steps, currentStep }) => {
    return (
      <div className="stepper">
        <div className="stepper-lines">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Черточка перед точкой */}
              {index !== 0 && (
                <div
                  className={`line ${
                    currentStep > index ? 'active-line' : 'inactive-line'
                  }`}
                />
              )}
              {/* Точка для текущего шага */}
              <div
                className={`dot ${
                  currentStep >= index ? 'active-dot' : 'inactive-dot'
                }`}
              />
            </React.Fragment>
          ))}
        </div>
        <div className="stepper-titles">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-title ${currentStep >= index ? 'active-title' : ''}`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Stepper;