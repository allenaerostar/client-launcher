import React from 'react';

const FormOverview = ({ inputs }) => {

  const displayFileMetaData = (input) => {
    input.files.map((file) => (
      <>
        <h4>File: {file.name}</h4>
        <h4>Path: {file.path}</h4>
      </>
    ));
  }

  return (
    <div>
      {
        inputs.map((input) => (
          'files' in input ?
            displayFileMetaData(input)
          :
            <>
              <h3>{input.name}</h3>
              <p>{input.value}</p>
            </>
        ))
      }
    </div>
  );
}

export default FormOverview;