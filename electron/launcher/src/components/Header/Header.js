import React from 'react';
import logo from '../../assets/small_logo.png';
import { NavLink, Link } from 'react-router-dom';
import { clientActions } from '_actions';
import { patcherActions } from '_actions';
import { connect } from 'react-redux';

const Header = props => {
  console.log(props);
  const handleButtonClick = () => {
    // button is diabled while patching
    if (props.patch.updateProgress.status !== 'downloading') {
      props.checkForUpdate();
      if (props.patch.isLatest) {
        props.startGameClient();
      }
    }
  };

  return (
    <header className="main-header">
      <nav>
        <Link to="/">
          <img src={logo} alt="dietstory logo"/>
        </Link>
        <button
          className={"btn btn-success play-button " + (props.patch.updateProgress.status === 'downloading' ? "disabled" : '')}
          onClick={handleButtonClick}
        >
          PLAY
        </button>
        <NavLink
          to="/"
          className="main-header__link"
          activeClassName="main-header__link--active"
          exact
        >
          HOME
        </NavLink>
        <NavLink to="/profile"
          className="main-header__link"
          activeClassName="main-header__link--active"
        >
          PROFILE
        </NavLink>
        {
          props.auth.user.isAdmin ?
          <NavLink to="/admin"
            className="main-header__link"
            activeClassName="main-header__link--active"
          >
            ADMIN
          </NavLink>
           : null
        }
      </nav>
    </header>
  );
}

const mapStateToProps = (state) => {
  return state;
}
const mapDispatchToProps = (dispatch) => {
  return {
    startGameClient: clientActions.startGameClient,
    checkForUpdate: patcherActions.checkForUpdate
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
