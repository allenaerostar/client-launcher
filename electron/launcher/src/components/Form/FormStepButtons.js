import React from 'react';
import PropTypes from 'prop-types';

const FormStepButtons = ({ currentStep, setCurrentStep, totalSteps}) => {

  const setNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const setPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    // <div className="offset-6 col-6">
      <div className="row mt-4">
        <div className="offset-6 col-3">
          {
            // Create a previous step button if not on the first step
            currentStep !== 1 ?
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={setPrevStep}
              >
                PREVIOUS
            </button>
              : null
          }
        </div>
        <div className={currentStep === 1 ? "col-3 offset-9" : "col-3" }>
          {
            // Create submit button if on final step on form
            currentStep === totalSteps ?
              <button
                type="submit"
                className="btn btn-success btn-block"
              >
                SUBMIT
              </button>
              :
              <button
                type="button"
                className="btn btn-success btn-block"
                onClick={setNextStep}
              >
                NEXT
              </button>
          }
        </div>
      </div>
  );
}

FormStepButtons.propTypes = {
  currentStep: PropTypes.number,
  setCurrentStep: PropTypes.func,
  totalSteps: PropTypes.number
}

export default FormStepButtons;