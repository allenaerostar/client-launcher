import React from 'react';
import { userActions } from '_actions';
import { Route, Switch } from 'react-router-dom';
import SubHeader from 'components/SubHeader/SubHeader';
import UserInfo from 'components/UserProfile/UserInfo';
import FormBuilder from 'components/Form/FormBuilder';
import { connect } from 'react-redux';

const UserProfile = props => {

  const formFields = [
    {
      name: 'old_password',
      label: 'Current password',
      type: 'password',
      required: true
    },
    {
      name: 'new_password1',
      label: 'New password',
      type: 'password',
      required: true
    },
    {
      name: 'new_password2',
      label: 'Confirm new password',
      type: 'password',
      required: true
    }
  ];

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
          <Switch>
            <Route path={`${props.match.url}/change-password`} component={() =>
              <>
                <h1>Change Password</h1>
                <FormBuilder
                  formFields={formFields}
                  submitFunction={props.changePassword}
                  errorMessageGenerator={false}
                  submitText={"Change Password"}
                /> 
              </>}
            />
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
