import React from 'react';

import { connect } from 'react-redux';

const UserProfile = props => {
  return (
    <div>
      <h1>{props.auth.user.username}</h1>
    
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(UserProfile);
