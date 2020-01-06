import React, { useState, useEffect } from 'react';

const FileInputs = props => {
  return (
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
  );
}

export default FileInputs;