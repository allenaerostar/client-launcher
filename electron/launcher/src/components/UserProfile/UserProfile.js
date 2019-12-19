import React from 'react';

import { connect } from 'react-redux';

import avatarPlaceholder from 'assets/avatar-placeholder.png';

const UserProfile = props => {
  return (
    <div className="hero-card col-9">
      <img src={avatarPlaceholder} alt="profile" className="img-fluid profile__picture"/>
      <h1 className="profile__username">
        {props.auth.user.username ? props.auth.user.username : "Placeholder"}
      </h1>
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(UserProfile);
