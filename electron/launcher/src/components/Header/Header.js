import React from 'react';
import logo from '../../assets/small_logo.png';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Header = props => {
  return (
        <header className="main-header">
          <nav>
            <Link to="/">
              <img src={logo} alt="dietstory logo"/>
            </Link>
            <button className="btn btn-outline-success play-button">
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
            <NavLink to="/admin"
              className="main-header__link"
              activeClassName="main-header__link--active"
            >
              ADMIN
            </NavLink>
          </nav>
        </header>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(Header);
