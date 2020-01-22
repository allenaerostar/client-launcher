import React from 'react';

const UploadResult = ({ results, returnBtn, newVersion, version}) => {
  const generateTableRows = () => {
    return <> 
      {
        results.failed.map(result => (
          <tr className="table-danger">
            <td>{result.name}</td>
            <td>/{result.remote_path}</td>
            <td>Failed</td>
          </tr>
        ))
      }
      {
        results.success.map(result => (
          <tr className="table-success">
            <td>{result.name}</td>
            <td>/{result.remote_path}</td>
            <td>Success</td>
          </tr>
        ))
      }
    </>
  }

  return (
    <div className="container upload">

      <div className="row mb-2">
        <h1>Transaction Summary</h1>
      </div>

      <div className="row mb-3">
        <h5>{(newVersion)? `New future patch version created: `:`Existing future patch version (files overwritten): `}</h5>
        <h5><b>{`v${version}`}</b></h5>
      </div>

      <div className="row">
        <table className="table table-hover table-sm">
          <thead>
            <tr>
              <th>File</th>
              <th>Remote Path</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {generateTableRows()}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col-3 offset-9">
          <button className="btn btn-success btn-block" onClick={returnBtn}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default UploadResult;