require('app-module-path').addPath(__dirname); // <-- MUST BE FIRST LINE TO ENABLE ABSOLUTE PATH
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require("electron-is-dev");
const path = require("path");
const initialize = require("helpers/on-app-load").load;

// SCRIPTS WHEN APPLICATION STARTS UP
initialize();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1008, 
        height: 578,
        minWidth:1008,
        minHeight: 578,
        // frame: false, 
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(isDev? "http://localhost:3000": `file://${path.join(__dirname, "../build/index.html")}`);
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.once('ready-to-show', () => {mainWindow.show()});
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {if (process.platform !== "darwin") {app.quit();}});
app.on("activate", () => {if (mainWindow === null) {createWindow();}});

// IPC LISTENERS
require('ipc-listeners/user-login');
require('ipc-listeners/user-logout');
require('ipc-listeners/user-registration');
require('ipc-listeners/file-manager');