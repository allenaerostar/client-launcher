import React from 'react';

const FormStepNavigator = ({ steps, changeStep, currentStep }) => {
  return (
    <div className="form-step-navigator">
      {
        steps.map((step,index) => (
          <button
            key={index}
            onClick={() => changeStep(index+1)}
            className={"form-step " + (currentStep === (index+1) ? "active" : "")}
          >
            {index+1}. {step.name}
          </button>
        ))
      }
    </div>
  );
}

export default FormStepNavigator;