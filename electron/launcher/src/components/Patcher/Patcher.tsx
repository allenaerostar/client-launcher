import React from 'react';
import { connect } from 'react-redux';
import { patcherActions } from '_actions';

import ProgressBar from 'components/Patcher/ProgressBar';

const Patcher = props => {
  const updatePercentage = props.patch.updateProgress.totalProgress/props.patch.updateProgress.totalSize;
  return (
      <div className="patcher">
        <h3>Update Available? {String(!props.patch.isLatest)}</h3>
        <button type="submit" onClick={props.checkForUpdate}>Check for update</button>
        <button type="submit" onClick={props.downloadFiles}>Download Files</button>
        <p>STATUS: {props.patch.updateProgress.status}</p> 
        <p>CURRENTLY DOWNLOADING: {props.patch.updateProgress.currentFile}</p> 
        <p>CURRENT FILE PROGRESS: {props.patch.updateProgress.currentFileProgress}/{props.patch.updateProgress.currentFileSize}</p>
        <p>TOTAL PROGRESS: {props.patch.updateProgress.totalProgress}/{props.patch.updateProgress.totalSize}</p> 
        <p>RETRY AT: {props.patch.updateProgress.retryTime}</p>
        {
          !isNaN(updatePercentage) ?
          <ProgressBar percentage={updatePercentage}/>
          : null
        }
      </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, patcherActions)(Patcher);