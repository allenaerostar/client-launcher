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
    <div className="offset-6 col-6">
      {
        // Create a previous step button if not on the first step
        currentStep !== 1 ?
          <button
            type="button"
            className="btn btn-primary"
            onClick={setPrevStep}
          >
            PREVIOUS
        </button>
          : null
      }
      {
        // Create submit button if on final step on form
        currentStep === totalSteps ?
          <button
            type="submit"
            className="btn btn-success"
          >
            SUBMIT
          </button>
          :
          <button
            type="button"
            className="btn btn-success"
            onClick={setNextStep}
          >
            NEXT
          </button>
      }
    </div>
  );
}

FormStepButtons.propTypes = {
  currentStep: PropTypes.number,
  setCurrentStep: PropTypes.func,
  totalSteps: PropTypes.number
}

export default FormStepButtons;