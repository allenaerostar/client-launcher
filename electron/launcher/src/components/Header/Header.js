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
              activeClassName="main-header__link--active"
            >
              HOME
            </NavLink>
            <NavLink to="/" className="main-header__link">
              PROFILE
            </NavLink>
            <NavLink to="/" className="main-header__link">
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
