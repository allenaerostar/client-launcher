import React from 'react';
import { NavLink } from 'react-router-dom';

const SubHeader = ({ routes }) => {
  
  return (
    <header className="sub-header">
      <nav>
        {
          routes.map((route, i) => (
            <NavLink
              key={i}
              to={route.path}
              className="sub-header__link"
              activeClassName="sub-header__link--active"
              exact={route.isExact}
            >
              {route.text}
            </NavLink>
          ))
        }
      </nav>
    </header>
  );
}

export default SubHeader;
