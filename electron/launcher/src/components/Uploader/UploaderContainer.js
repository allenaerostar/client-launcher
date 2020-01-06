import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

import FormStepNavigator from 'components/Form/FormStepNavigator';
import FormBuilder from 'components/Form/FormBuilder';
import FormOverview from 'components/Form/FormOverview';

import upload_icon from 'assets/icons/upload_icon.svg'

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

  const handleChange = index => e => {
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
        return <div>test</div>
      case 2:
        return <div>test2</div>
      case 3:
        return <FormOverview inputs={inputs} />
      default:
        return <div>test</div>
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
        {/* {
          renderFormContent()
        } */}
        <h1>Upload Files</h1>
        <div className="row">
          <div className="col-12">
            <Dropzone onDrop={acceptedFiles => uploadFiles(acceptedFiles)} >
              {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <img src={upload_icon} alt="cloud with arrow"/>
                    <h2>Drag and drop or click here to upload files</h2>
                  </div>
              )}
            </Dropzone>
          </div>
        </div>
        { 
          files ?
          <div className="row">
            <div className="col-12">
              {
                files.map((item, index) => (
                  <div className="row" key={index}>
                    <div className="col-6">
                      <input
                        type="text"
                        name="name"
                        value={item.file.name}
                        placeholder="File Name"
                        onChange={handleChange(index)}
                        className="form-control"
                      >
                      </input>
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        name="path"
                        value={item.path}
                        placeholder="Relative Path"
                        onChange={handleChange(index)}
                        className="form-control"
                      >
                      </input>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          : null
        }
      </section>
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(UploaderContainer);