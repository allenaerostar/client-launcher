import React, { useEffect ,useState} from 'react';
import closeIcon from 'assets/icons/close_icon.svg';
import minimizeIcon from 'assets/icons/minimize_icon.svg';

const { remote } = window.require('electron')

const TitleBar = props => {
  const [ window, setWindow ] = useState();
  
  useEffect(() => {
    setWindow(remote.getCurrentWindow());
  }, []);

  const minimizeWindow = () => {
    window.minimize();
  }

  const closeWindow = () => {
    // props.logout(props.auth.user)
    window.close();
  }

  return (
    <div className="title-bar">
      <div className="title-bar__controls">
        <button onClick={minimizeWindow} type="button">
          <img src={minimizeIcon} alt="minimize launcher" />
        </button>
        <button onClick={closeWindow} type="button">
          <img src={closeIcon} alt="close launcher" />
        </button>
      </div>
    </div>
  );
}

export default TitleBar;