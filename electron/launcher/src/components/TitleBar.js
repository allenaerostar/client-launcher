import React, { useEffect ,useState} from 'react';
import closeIcon from 'assets/icons/close_icon.svg';
import minimizeIcon from 'assets/icons/minimize_icon.svg';

const { electron } = window.require('electron')

const TitleBar = props => {
  const [ window, setWindow ] = useState();
  
  useEffect(() => {
    setWindow(electron.BrowserWindow.getFocusedWindow());
  }, []);

  const minimizeWindow = () => {
    window.minimize();
    // remote.getCurrentWindow().minimize();
  }

  const closeWindow = () => {
    electron.app.quit();
    // props.logout(props.auth.user)
    // window.close();
    // remote.getCurrentWindow().close();
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