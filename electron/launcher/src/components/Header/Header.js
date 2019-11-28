import React from 'react';
import logo from '../../assets/dietstory_logo.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Header = props => {
  return (
        <header>
          <nav>
            <Link to="/">
              <img src={logo} alt="dietstory logo"/>
            </Link>
          </nav>
        </header>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(Header);
