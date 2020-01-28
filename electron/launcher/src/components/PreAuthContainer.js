import React from 'react';
import logo from 'assets/dietstory_logo.png';
import Alert from 'components/Alert';

// A wrapper component for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PreAuthContainer = ({ children }) => {
  return (
    <div className="row no-gutters">
      <section className="hero-image col-8">
        <img src={logo} className="img-fluid" width="228" height="96" alt="dietstory" />
      </section>
      <section className="col-4 form__container">
        <Alert />
        { children }
      </section>
    </div>
  );
}

export default PreAuthContainer;