import React from 'react';

const sizeFormatter = size => {
  if(size >= 1024 && size < 1048576){
    return `${(size/Math.pow(1024, 1)).toFixed(2)}KB`;
  }
  else if(size >= 1048576 && size < 1073741824){
    return `${(size/Math.pow(1024, 2)).toFixed(2)}MB`;
  }
  else if(size >= 1073741824 && size < 1099511627776){   // !!!!
    return `${(size/Math.pow(1024, 3)).toFixed(2)}GB`;
  }
  else{
    return size;
  }
}

const UploadStatus = ({ status }) => {
  return (
    <div className="container upload">
      <div className="row">
        <h5 className="col-2">Status:</h5>
        <h5 className="col-10">{status.message}</h5>
      </div>
      <div className="row">
        <h6 className="col-2">File:</h6>
        <h6 className="col-10">{status.filename}</h6>
      </div>
      <div className="row">
        <h6 className="col-2">Path:</h6>
        <h6 className="col-10">{status.local_path}</h6>
      </div>
      <div className="row">
        <h6 className="col-2">Progress:</h6>
        <h6 className="col-10">{(100*(status.uploadedSize/status.size)).toFixed(2)}% ({sizeFormatter(status.uploadedSize)} of {sizeFormatter(status.size)})</h6>
      </div>
    </div>
  );
}

export default UploadStatus;