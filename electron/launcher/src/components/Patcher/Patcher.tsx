import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { patcherActions } from '_actions';
import ProgressBar from 'components/Patcher/ProgressBar';

const Patcher = props => {
  const [updatePercentage, setUpdatePercentage] = useState(0);
  
  // When patcher mounts, start downloading files
  useEffect(() => {
    props.downloadFiles();
    // eslint-disable-next-line
  },[])

  useEffect(() => {
    setUpdatePercentage((props.patch.updateProgress.totalProgress/props.patch.updateProgress.totalSize)*100);
    // eslint-disable-next-line
  }, [props.patch.updateProgress.totalProgress])

  useEffect(() => {
    if (props.patch.updateProgress.status === 'download complete') {
      // eslint-disable-next-line
      props.checkForUpdate();
    }
    // eslint-disable-next-line
  }, [props.patch.updateProgress.status])

  return (
      <div className="patcher">
        {/* <h3>Update Available? {String(!props.patch.isLatest)}</h3>
        <button type="submit" onClick={props.checkForUpdate}>Check for update</button>
        <button type="submit" onClick={props.downloadFiles}>Download Files</button>
        <p>STATUS: {props.patch.updateProgress.status}</p> 
        <p>CURRENTLY DOWNLOADING: {props.patch.updateProgress.currentFile}</p> 
        <p>CURRENT FILE PROGRESS: {props.patch.updateProgress.currentFileProgress}/{props.patch.updateProgress.currentFileSize}</p>
        <p>TOTAL PROGRESS: {props.patch.updateProgress.totalProgress}/{props.patch.updateProgress.totalSize}</p> 
        <p>RETRY AT: {props.patch.updateProgress.retryTime}</p> */}
        <h3>Patching...</h3>
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