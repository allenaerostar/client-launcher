import React, { useEffect } from 'react';
import logo from '../../assets/small_logo.png';
import { NavLink, Link } from 'react-router-dom';
import { patcherActions, userActions } from '_actions';
import { connect } from 'react-redux';

const ipc = window.require('electron').ipcRenderer;

const Header = props => {

  useEffect(() => {
    if(!props.patch.reqInitialCheck){
      ipc.on('fm-up-to-date', () => {
        props.toggleIsLatestVersion(false);
        props.gameClientStarted();
      });
      ipc.on('fm-download-start', () => {
        props.setPatching();
      });
      ipc.on('fm-download-status-update', (e, update) => {
        props.setUpdateStatus(update);
      });
      ipc.on('start-game-client-success', () => {
        props.gameClientExit();
      });
      ipc.on('start-game-client-fail', () => {
        props.gameClientExit();
      });
      ipc.on('http-logout-success', () => {
        props.logoutSuccess();
      });
      ipc.on('http-logout-fail', () => {
        props.logoutFailed();
      });


      return () => {
        ipc.removeAllListeners('fm-up-to-date');
        ipc.removeAllListeners('fm-download-start');
        ipc.removeAllListeners('fm-download-status-update');
        ipc.removeAllListeners('start-game-client-success');
        ipc.removeAllListeners('start-game-client-fail');
        ipc.removeAllListeners('http-logout-success');
        ipc.removeAllListeners('http-logout-fail');
      }
    }
  }, []);

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
