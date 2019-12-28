import React, { useEffect } from 'react';
import logo from '../../assets/small_logo.png';
import { NavLink, Link } from 'react-router-dom';
import { patcherActions, userActions } from '_actions';
import { connect } from 'react-redux';

const Header = props => {

  const handleButtonClick = () => {
    if(!props.patch.isGameClientRunning){
      props.startGameClient();
    }
  };

  const logout = () => {
    props.logout(props.auth.user);
  }

  return (
    <header className="main-header">
      <nav>
        <Link to="/">
          <img src={logo} alt="dietstory logo"/>
        </Link>
        <button
          className={"btn btn-success play-button " + (props.patch.playButtonLock ? "disabled" : '')}
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
        <button
          onClick={logout}
          className="btn btn-warning"
        >
          LOGOUT
        </button>
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
    startGameClient: () => dispatch(patcherActions.startGameClient()),
    logout: () => dispatch(userActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
