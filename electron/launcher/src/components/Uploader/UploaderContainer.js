import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { uploaderActions } from '_actions';

import FormStepNavigator from 'components/Form/FormStepNavigator';
import FormStepButtons from 'components/Form/FormStepButtons';
import FormOverview from 'components/Form/FormOverview';
import UploadStatus from 'components/Uploader/UploadStatus';

import Uploader from 'components/Uploader/Uploader';

const ipc = window.require('electron').ipcRenderer;

const UploaderContainer = props => {

  useEffect(() => {
    if (props.uploader.futureVersions.length === 0){
      ipc.send('get-future-versions');
    }
  }, []);

  useEffect(() => {
    ipc.on('get-future-versions-response', (e, res) => {
      props.setFutureVersions(res.future_versions);
    });
    ipc.on('upload-patch-files-status', (e, status) => {
      props.setStatus(status);
    });
    ipc.on('upload-patch-files-result', (e, result) => {
      //props.setResult(result);
      console.log(result)
    })

    return () => {
      ipc.removeAllListeners('get-future-versions-response');
      ipc.removeAllListeners('upload-patch-files-status');
      ipc.removeAllListeners('upload-patch-files-result');
    }
  }, [])

  const [inputs, setInputs] = useState({newVersion: true});
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [versionInputClass, setVersionInputClass] = useState({
    default: "form-control col-md-2 offset-md-2",
    invalid: "form-control col-md-2 offset-md-2 is-invalid",
    current: "form-control col-md-2 offset-md-2"
  })

  const steps = [
    {
      name: "Upload Files"
    },
    {
      name: "Overview",
    },
    {
      name: "Summary"
    }
  ];

  const handleSubmit = () => {
    props.uploadFiles({
      ...inputs,
      files
    });
  }
  
  /**
   * Stores array of files as an entry for input state
   * @param {array} acceptedFiles - Array of files
   * NOTE: the path in the actual file is not the path we will be using
   */
  const uploadFiles = acceptedFiles => {
    // create newFiles object from uploaded files
    const newFiles = acceptedFiles.map(currentFile => ({
      remote_path: currentFile.name,
      file: {
        name: currentFile.name,
        local_path: currentFile.path
      }
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

    if(name === 'version'){
      let existingVersions = new Map();
      let regex = /(\d+\.\d+)/g;
      let match = value.match(regex);

      props.uploader.futureVersions.map(futureVersion => {
        let str = `${futureVersion.major_ver}.${futureVersion.minor_ver}`
        existingVersions.set(str, null);
      })

      // BAD FORMAT
      if(match === null || existingVersions.has(match[0])){
        setVersionInputClass(versionInputClass => ({...versionInputClass, current: versionInputClass.invalid}));
      }
      else{
        setVersionInputClass(versionInputClass => ({...versionInputClass, current: versionInputClass.default}));
      }
    }
  }

  const handleSelectChange = e => {
    const value = e.target.value;
    if (value === 'new'){
      setInputs(inputs => ({...inputs, newVersion: true, version: ""}));
    }
    else{
      setInputs(inputs => ({...inputs, newVersion: false, version: value}));
    }
  }

  const changeFileInfo = index => e => {
    const name = e.target.name;
    const value = e.target.value;
    const oldFile = files[index].file;
    let updatedFiles = [...files];

    // files are read only, and we cannot directly modify them
    if (name === "name") {
      let updatedFile = {
        local_path: oldFile.local_path,
        name: value
      }
      updatedFiles[index].file = updatedFile;
    } 
    else if (name === "path") {
      updatedFiles[index].remote_path = value.replace('<root>/', '');
    }
    
    setFiles(updatedFiles);
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return <>
          <h1>Upload Files</h1>
          <div className="row uploader-ver-input">
            <select className="form-control col-3" onChange={handleSelectChange}>
              <option selected value="new">New Version</option>
              {props.uploader.futureVersions.map(futureVersion => {
                let versionString = `v${futureVersion.major_ver}.${futureVersion.minor_ver}`;
                let versionValue = `${futureVersion.major_ver}.${futureVersion.minor_ver}`;

                return (<option value={versionValue}>{versionString}</option>)
              })}
            </select>
            {(inputs.newVersion)? 
              (<input
                type="text"
                name="version"
                placeholder="x.y"
                onChange={handleChange}
                className={versionInputClass.current}
                required
              >
              </input>)
              : null
            }
            {(inputs.newVersion)? 
              (<input 
                type="datetime-local" 
                className="form-control col-md-5"
                name="liveByDate"
                onChange={handleChange}
                >
                </input>)
              : null
            }
          </div>
          <Uploader uploadFiles={uploadFiles} changeFileInfo={changeFileInfo} files={files}/>
          <FormStepButtons currentStep={currentStep} setCurrentStep={setCurrentStep} totalSteps={steps.length}/>
        </>
      case 2:
        return <> 
          <FormOverview inputs={inputs} files={files} />
          <FormStepButtons currentStep={currentStep} setCurrentStep={setCurrentStep} handleSubmit={handleSubmit} totalSteps={steps.length} />
        </>
      case 3:
        return <>
          {/* {(props.uploader.isUploading)?
            <UploadStatus status={props.uploader.status} />
            :
            <UploadResult result={props.uploader.uploadResults} />
          } */}
          <UploadStatus status={props.uploader.status} />
        </>
      default:
        return <Uploader uploadFiles={uploadFiles} changeFileInfo={changeFileInfo} files={files}/>
    }
  };
  
  return (
    <div className="container">
      {/*<FormStepNavigator
        steps={steps}
        changeStep={setCurrentStep}
        currentStep={currentStep}
      />*/}
      <section className="hero-card">
        <form>
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

export default connect(mapStateToProps, uploaderActions)(UploaderContainer);