import React from 'react';

const FormStepNavigator = ({ steps, changeStep, currentStep }) => {
  return (
    <div className="form-step-navigator">
      {
        steps.map((step,index) => (
          <button
            onClick={() => changeStep(index+1)}
            className={currentStep === (index+1) ? "activeStep" : "inactiveStep" }
          >
            {index+1}. {step.name}
          </button>
        ))
      }
    </div>
  );
}

export default FormStepNavigator;