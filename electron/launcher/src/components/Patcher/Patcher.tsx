import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { patcherActions } from '_actions';

import ProgressBar from 'components/Patcher/ProgressBar';

const Patcher = props => {

  return (
      <div className="patcher">
        {/* {/* <h1>HI THIS IS PATCHER</h1> */}
        <h3>Update Available? {String(!props.patch.isLatest)}</h3>
        {/* <button type="submit" onClick={props.checkForUpdate}>Check for update</button> */}
        <ProgressBar percentage={"75"}/>
      </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, patcherActions)(Patcher);