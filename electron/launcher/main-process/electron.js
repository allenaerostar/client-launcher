require('app-module-path').addPath(__dirname); // <-- MUST BE FIRST LINE TO ENABLE ABSOLUTE PATH
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require("electron-is-dev");
const path = require("path");
const onAppLoad = require("helpers/on-app-load");

// SETTING DIETSTORY GAME INSTALLATION PATH
if(process.platform === 'win32'){
    // WINDOWS  ---  C:\Users\<Username>\AppData\Local\Dietstory\Game
    global.gameInstallationPath = path.join(app.getPath('appData'), '../Local', app.name, 'Game');
}
else{
    // MAC OS   ---  ~/Library/Application Support/Dietstory/Game
    // LINUX    ---  ~/.config/Dietstory/Game
    global.gameInstallationPath = path.join(app.getPath('userData'), 'Game');
}

// SCRIPTS WHEN APPLICATION STARTS UP
onAppLoad.load();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1000, 
        height: 600,
        minWidth:1000,
        minHeight: 600,
        show: false,
        webPreferences: { nodeIntegration: true }
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