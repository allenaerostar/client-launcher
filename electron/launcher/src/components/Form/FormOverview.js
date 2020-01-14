import React from 'react';

const FormOverview = ({ inputs, files }) => {
  
  const displayFileMetaData = () => {
    if(files) {
      return <>
        <br></br>
        <h3>Submitted Files</h3>
        {
          files.map((fileData) => (
            <div className="border-top">
              <h6><b>Filename:</b> {fileData.file.name}</h6>
              <h6><b>S3 Path:</b> {"<root>/" +fileData.remote_path}</h6>
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
                <h3>{input}: {inputs[input]}</h3>
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