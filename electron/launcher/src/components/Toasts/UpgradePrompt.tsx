import React from 'react';
import { toast } from 'react-toastify';
const ipc = window.require('electron').ipcRenderer;

function UpgradePrompt() {
  const dismiss = () => {
    toast.dismiss();
  }

  const upgrade = () => {
    ipc.send('launcher-update-install');
  }

  return (
    <div>
      <p>Launcher upgrade available. Would you like to install now?</p>
      <div style={divStyle}>
        <button style={buttonStyle} onClick={upgrade}>Install Now</button> <button style={buttonStyle} onClick={dismiss}>Later</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: "none !important",
  border: "none",
  textDecoration: "underline",
  color: "white",
  backgroundColor: "#F7943A"
};

const divStyle = {
  display: "flex",
  justifyContent: "space-between"
};

export default UpgradePrompt;