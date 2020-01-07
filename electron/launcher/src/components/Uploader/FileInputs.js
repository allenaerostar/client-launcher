import React, { useState, useEffect } from 'react';

// When wake up, connect components and fix props
const FileInputs = ({ handleChange, fileData, index}) => {
  return (
    <div className="row file-inputs">
      <div className="col-6">
        <input
          type="text"
          name="name"
          value={fileData.file.name}
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
          value={fileData.path}
          placeholder="Relative Path"
          onChange={handleChange(index)}
          className="form-control"
        >
        </input>
      </div>
    </div>
  );
}

export default FileInputs;