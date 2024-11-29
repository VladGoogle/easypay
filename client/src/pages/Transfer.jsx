import React from 'react';
import { Outlet } from 'react-router-dom';
import Stepper from '../components/stepper/Stepper';

const Transfer = () => {
  // Массив шагов для степпера
  const steps = [
    { label: 'Amount', path: '/transfer/transferamount' },
    { label: 'Credentials', path: '/transfer/transfercredentials' },
    { label: 'Review', path: '/transfer/transferreview' },
    { label: 'Success', path: '/transfer/transfersuccess' },
  ];

  // Получение текущего шага на основе маршрута
  const currentPath = window.location.pathname;
  const currentStep = steps.findIndex(step => currentPath.includes(step.path));

  return (
    <section className="transfer">
      {/* Степпер */}
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Отображение содержимого текущего шага */}
      <Outlet />
    </section>
  );
};

export default Transfer;