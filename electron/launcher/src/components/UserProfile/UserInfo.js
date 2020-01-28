import React from 'react';
import { connect } from 'react-redux';
import SelfSupport from 'components/SelfSupport/SelfSupport';
import avatarPlaceholder from 'assets/avatar-placeholder.png';

const UserInfo = props => {

  return (
    <>
      <img src={avatarPlaceholder} alt="profile" className="img-fluid profile__picture" />
      <h1 className="profile__username">
        {props.auth.user.username ? props.auth.user.username : "Placeholder"}
      </h1>
      <SelfSupport />
    </>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(UserInfo);
