import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormStepNavigator from 'components/Form/FormStepNavigator';
import FormBuilder from 'components/Form/FormBuilder';
import FormOverview from 'components/Form/FormOverview';

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

  const formFields = [
    {
      name: 'patch-version',
      label: 'Patch Version',
      type: 'text',
      required: true
    },
    {
      name: 'patch-notes',
      label: 'Patch Notes',
      type: 'textarea',
      required: false
    }
  ];
  
  const setNextStep = () => {
    setCurrentStep(currentStep+1);
  };

  const setPrevStep = () => {
    setCurrentStep(currentStep-1);
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return <div>test</div>
      case 2:
        return <></>
      case 3:
        return <FormOverview inputs={inputs}/>
      default:
        break;
    }
  };
  return (
    <div>
      <FormStepNavigator
        steps={steps}
        changeStep={setCurrentStep}
        currentStep={currentStep}
      />
      <form>
        {
          renderFormContent
        }
      </form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(Uploader);