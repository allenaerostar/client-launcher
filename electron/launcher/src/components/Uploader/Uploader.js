import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormStepNavigator from 'components/FormStepNavigator';
import FormBuilder from 'components/FormBuilder';

const Uploader = props => {
  const [inputs, setInputs] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      name: "Upload Files"
    },
    {
      name: "Patch Information"
    },
    {
      name: "Overview",
    }
  ];
  
  const setNextStep = () => {
    setCurrentStep(currentStep+1);
  }

  const setPrevStep = () => {
    setCurrentStep(currentStep-1);
  }
  return (
    <div>
      <FormStepNavigator
        steps={steps}
        changeStep={setCurrentStep}
        currentStep={currentStep}
      />
      {currentStep}
      <form>
        {/* Special Uploader */}
        {/* Form Builder */}
        {/* Overview */}
      </form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(Uploader);