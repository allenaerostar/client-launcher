import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { patcherActions } from '_actions';
import ProgressBar from 'components/Patcher/ProgressBar';

const Patcher = props => {
  const [updatePercentage, setUpdatePercentage] = useState(0);

  useEffect(() => {
    setUpdatePercentage((props.patch.updateProgress.totalProgress/props.patch.updateProgress.totalSize)*100);
    // eslint-disable-next-line
  }, [props.patch.updateProgress]);

  return (
      <div className="patcher">
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