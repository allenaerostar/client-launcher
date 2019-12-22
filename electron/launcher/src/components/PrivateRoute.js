import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// A wrapper component for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={ ( props ) => isAuthenticated ? (
          <Component {...props}/>
        ) : <Redirect to="/login" />
      }
    />
  );
}

export default PrivateRoute;