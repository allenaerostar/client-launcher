import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormStepNavigator from 'components/Form/FormStepNavigator';
import FormStepButtons from 'components/Form/FormStepButtons';
import FormOverview from 'components/Form/FormOverview';

import Uploader from 'components/Uploader/Uploader';

const UploaderContainer = props => {
  const [inputs, setInputs] = useState({});
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      name: "Upload Files"
    },
    {
      name: "Overview",
    }
  ];

  const handleSubmit = () => {

    // dispatch action
    /* props.xxx({
      ...inputs,
      files
    })*/
  }
  
  /**
   * Stores array of files as an entry for input state
   * @param {array} acceptedFiles - Array of files
   * NOTE: the path in the actual file is not the path we will be using
   */
  const uploadFiles = acceptedFiles => {
    // create newFiles object from uploaded files
    const newFiles = acceptedFiles.map(file => ({
      file: file,
      path: '/'
    }));
    // store uploaded files in state
    setFiles(prevState => ([
      ...prevState,
     ...newFiles
    ]));

    window.scrollTo(0, document.body.scrollHeight);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs(inputs => ({
      ...inputs, [name]: value
    }));
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
        return <>
            <h1>Upload Files</h1>
            <input
              type="text"
              name="patch-version"
              placeholder="Patch Version"
              onChange={handleChange}
              className="form-control col-4 mt-4"
              required
            >
            </input>
            <Uploader uploadFiles={uploadFiles} changeFileInfo={changeFileInfo} files={files}/>
            <FormStepButtons currentStep={currentStep} setCurrentStep={setCurrentStep} totalSteps={steps.length}/>
          </>
      case 2:
        return <> 
          <FormOverview inputs={inputs} files={files} />
          <FormStepButtons currentStep={currentStep} setCurrentStep={setCurrentStep} totalSteps={steps.length} />
          </>
      default:
        return <Uploader uploadFiles={uploadFiles} changeFileInfo={changeFileInfo} files={files}/>
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