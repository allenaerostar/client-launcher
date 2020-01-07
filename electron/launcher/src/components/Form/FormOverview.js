import React from 'react';

const FormOverview = ({ inputs, files }) => {
  console.log(inputs);
  const displayFileMetaData = () => {
    files.map((fileData) => (
      <>
        <h4>File: {fileData.file.name}</h4>
        <h4>Path: {fileData.path}</h4>
      </>
    ));
  }

  return (
    <div className="row">
      <div className="col-12">
      {inputs ?
        inputs.map((input) => (
            <>
              <h3>{input.name}</h3>
              <p>{input.value}</p>
            </>
        ))
        : null
      }
        <button type="submit" className="btn btn-success btn-block">Submit</button>
      </div>
    </div>
  );
}

export default FormOverview;