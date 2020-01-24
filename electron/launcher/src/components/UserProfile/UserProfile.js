import React from 'react';
import { userActions } from '_actions';
import { Route, Switch } from 'react-router-dom';
import SubHeader from 'components/SubHeader/SubHeader';
import UserInfo from 'components/UserProfile/UserInfo';
import Alert from 'components/Alert';
import ChangePassword from 'components/UserProfile/ChangePassword';
import { connect } from 'react-redux';

// Container component for holding user functionality 
const UserProfile = props => {

  const nestedRoutes = [
    {
      path: '/profile',
      text: 'PROFILE',
      isExact: true
    },
    {
      path: `${props.match.url}/change-password`,
      text: 'CHANGE PASSWORD',
      isExact: false
    },
  ]
  return (
    <section className="container">
      <div className="row">
        <SubHeader routes={nestedRoutes} />
      </div>
      <div className="row">
        <div className="hero-card col-9">
          <Alert />
          <Switch>
            <Route path={`${props.match.url}/change-password`} component={ChangePassword} />
            <Route path="/profile" component={UserInfo} exact/>
          </Switch>
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(UserProfile);
