import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FormStepNavigator from 'components/Form/FormStepNavigator';
import FormBuilder from 'components/Form/FormBuilder';
import FormOverview from 'components/Form/FormOverview';

import Uploader from 'components/Uploader/Uploader';


// {
//   version: 'v1.1',
//     root: 'C:\Nexon',
//       files: [
//         'C:\Nexon\Map.wz',
//         'C:\Nexon\Character.wz'
//       ]
// }

// const { remote } = window.require('electron')

const UploaderContainer = props => {
  const [inputs, setInputs] = useState({});
  const [files, setFiles] = useState([]);
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

  const handleSubmit = () => {

    // dispatch action
  }
  
  const setNextStep = () => {
    setCurrentStep(currentStep+1);
  };

  const setPrevStep = () => {
    setCurrentStep(currentStep-1);
  };

  /**
   * Stores array of files as an entry for input state
   * @param {array} acceptedFiles - Array of files
   * NOTE: the path in the actual file is not the path we will be using
   */
  const uploadFiles = acceptedFiles => {
    const newFiles = acceptedFiles.map(file => ({
      file: file,
      path: ''
    }));

    setFiles(prevState => ([
      ...prevState,
     ...newFiles
    ]));
  }

  const changeFileInfo = index => e => {
    const name = e.target.name;
    const value = e.target.value;
    const oldFile = files[index].file;
    let updatedFiles = [...files];

    // files are read only, and we cannot directly modify them
    if (name === "name") {
      let updatedFile = new File([oldFile], value, { type: oldFile.type});
      updatedFiles[index].file = updatedFile;
    } else if (name === "path") {
      updatedFiles[index].path = value;
    }
    
    setFiles(updatedFiles);
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return <Uploader uploadFiles={uploadFiles} changeFileInfo={changeFileInfo} files={files}/>
      case 2:
        return <FormOverview inputs={inputs} />
      default:
        return <Uploader />
    }
  };
  
  return (
    <div className="container">
      <FormStepNavigator
        steps={steps}
        changeStep={setCurrentStep}
        currentStep={currentStep}
      />
      <section className="hero-card">
        <form onSubmit={handleSubmit}>
          {
            renderFormContent()
          }
        </form>
      </section>
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(UploaderContainer);