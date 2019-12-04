import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { patcherActions } from '_actions';

const Patcher = props => {

  return (
    <>
      <div>
        <h1>HI THIS IS PATCHER</h1>
        <h3>Update Available? {String(!props.patch.isLatest)}</h3>
        <button type="submit" onClick={props.checkForUpdate}>Check for update</button>
        <button type="submit" onClick={props.downloadFiles}>Download Files</button>
      </div>
    </>
  );
}





const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, patcherActions)(Patcher);