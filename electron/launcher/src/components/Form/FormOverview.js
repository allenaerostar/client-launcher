import React from 'react';

const FormOverview = ({ inputs, files }) => {
  const displayFileMetaData = () => {
    if(files) {
      files.map((fileData) => (
        <>
          <h4>File: {fileData.file.name}</h4>
          <h4>Path: {fileData.path}</h4>
        </>
      ));
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
              <h3>{input}</h3>
              <p>{inputs[input]}</p>
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