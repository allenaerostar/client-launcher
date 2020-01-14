import history from '_helpers/history';
import * as actionTypes from '_constants/uploader.types';

const ipc = window.require('electron').ipcRenderer;

const uploadFiles = input => {
  return (dispatch) => {
    ipc.send('upload-patch-files', input);
    console.log(input)
  }
}




export const uploaderActions = {
  uploadFiles
};