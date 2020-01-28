import React from 'react';
import { connect } from 'react-redux'

const Spinner = props => {
  const { isFetching } = props;
  return (
    <>
      { isFetching ?  
        <div className="spinner-container">
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div> : null
      }
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.loading.isFetching
  };
}

export default connect(mapStateToProps)(Spinner);