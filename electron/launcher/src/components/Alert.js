import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { alertActions } from '_actions';

const Alert = props => {
  const { alert, clearAlert } = props;

  useEffect(() => {
    setTimeout(clearAlert, 5000);
  },[alert.message, clearAlert])

  if (!alert.message) return null;

  return (
      <div className={`alert alert-${alert.type}`} role="alert">
        { alert.message }
        <button type="button" className="close" aria-label="Close" onClick={clearAlert}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
  );
}

const mapStateToProps = (state) => {
  
  return {
    alert: state.alert
  };
}

export default connect(mapStateToProps, alertActions)(Alert);