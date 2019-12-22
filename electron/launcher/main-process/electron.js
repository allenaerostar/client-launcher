require('app-module-path').addPath(__dirname); // <-- MUST BE FIRST LINE TO ENABLE ABSOLUTE PATH
const electron = require("electron");
const app = electron.app;
const { autoUpdater } = require('electron-updater');
const BrowserWindow = electron.BrowserWindow;
const isDev = require("electron-is-dev");
const path = require("path");
const initialize = require("helpers/on-app-load").load;
const ipc = electron.ipcMain;

const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

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
    mainWindow.loadURL(isDev? "http://localhost:3000": `file://${path.join(__dirname, "../index.html")}`);
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.once('ready-to-show', () => {mainWindow.show()});
}

app.on("ready", () => {
    createWindow();

    // CHECKS FOR UPDATE AFTER LAUNCH
    autoUpdater.checkForUpdates();

    // CHECKS FOR UPDATE EVERY 2 HOURS
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 72000000);
});
app.on("window-all-closed", () => {if (process.platform !== "darwin") {app.quit();}});
app.on("activate", () => {if (mainWindow === null) {createWindow();}});

// IPC LISTENERS
require('ipc-listeners/user-login');
require('ipc-listeners/user-logout');
require('ipc-listeners/user-registration');
require('ipc-listeners/file-manager');

// ONCE UPDATE IS DOWNLOADED, NOTIFY USER
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('launcher-update-ready');
})

// USER CLICKED THE BUTTON TO INSTALL UPDATE IMMEDIATELY, INSTALL AND RESTART
ipc.on('launcher-update-install', e => {
    autoUpdater.quitAndInstall();
});