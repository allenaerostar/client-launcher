import React, { useState } from 'react';
import { connect } from 'react-redux';

const Uploader = props => {
  const [inputs, setInputs] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      {/* <FormStepNavigator /> */}
      test
      <form>
        {/* Special Uploader */}
        {/*  */}
        {/* Overview */}
      </form>
    </>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(Uploader);