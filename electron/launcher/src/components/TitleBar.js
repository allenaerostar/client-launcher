import React from 'react';
import closeIcon from 'assets/icons/close_icon.svg';
import minimizeIcon from 'assets/icons/minimize_icon.svg';

const { remote } = window.require('electron')

const TitleBar = props => {

  const minimizeWindow = () => {
    remote.getCurrentWindow().minimize();
  }

  const closeWindow = () => {
    // props.logout(props.auth.user)
    remote.getCurrentWindow().close();
  }

  return (
    <div className="title-bar">
      <button onClick={minimizeWindow}>
        <img src={minimizeIcon} alt="minimize launcher" />
      </button>
      <button onClick={closeWindow}>
        <img src={closeIcon} alt="close launcher" />
      </button>
    </div>
  );
}

export default TitleBar;