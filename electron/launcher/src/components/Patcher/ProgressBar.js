import React from 'react';
import { connect } from 'react-redux';
import { patcherActions } from '_actions';

const ProgressBar = props => {

  return (
      <div className="progress">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
          role="progressbar"
          style={{ width: `${props.percentage}%` }}>
            {
              props.percentage === 100 ?
                "Ready to Play!"
              : props.percentage.toFixed(1) + "%"
            }
        </div>
      </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, patcherActions)(ProgressBar);