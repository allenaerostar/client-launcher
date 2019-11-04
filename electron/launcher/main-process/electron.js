const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require("path");
const isDev = require("electron-is-dev");

const netHandler = require('./http-handler');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1000, 
        height: 600,
        minWidth:1000,
        minHeight: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(isDev? "http://localhost:3000": `file://${path.join(__dirname, "../build/index.html")}`);
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.on("ready-to-show", () => {mainWindow.show});
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {if (process.platform !== "darwin") {app.quit();}});
app.on("activate", () => {if (mainWindow === null) {createWindow();}});


ipc.on('http-registration-req', (e, user) => {
    netHandler.registerUser(user).then((response) => {
            e.reply('http-registration-res', response);
        }).catch((error) => {
            e.reply('http-registration-res', error)
        });
});



ipc.on('echo-message', (event, message) => {
    console.log(message);
});