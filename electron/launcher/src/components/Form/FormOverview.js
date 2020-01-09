import React from 'react';

const FormOverview = ({ inputs, files }) => {
  
  const displayFileMetaData = () => {
    if(files) {
      return <>
        <h2>Submitted Files</h2>
        {
          files.map((fileData) => (
            <div className="border-top">
              <h4><b>File:</b> {fileData.file.name}</h4>
              <h4><b>Path:</b> {fileData.path}</h4>
            </div> 
          ))
        }
      </>
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <h1>Overview</h1>
        {
          inputs ?
          Object.keys(inputs).map((input,index) => (
              <div key="index">
                <h2>{input}</h2>
                <h4>{inputs[input]}</h4>
              </div>
          ))
          : null
        }
        {
          displayFileMetaData()
        }
      </div>
    </div>
  );
}

export default FormOverview;