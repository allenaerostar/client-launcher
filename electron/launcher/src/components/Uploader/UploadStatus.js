import React from 'react';

const UploadStatus = ({ status }) => {
  return (
    <div className="row">
      <div className="col-12">
        <h3>Status: {status.message}</h3>
        <h5>File: {status.filename}</h5>
        <h6>Path: {status.local_path}</h6>
        <h6>Progress: {(100*(status.uploadedSize/status.size)).toFixed(2)}%</h6>
      </div>
    </div>
  );
}

export default UploadStatus;