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
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(isDev? "http://localhost:3000": `file://${path.join(__dirname, "../build/index.html")}`);
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {if (process.platform !== "darwin") {app.quit();}});
app.on("activate", () => {if (mainWindow === null) {createWindow();}});







// REGISTRATION
ipc.on('http-registration', (e, user) => {
    netHandler.registerUser(user).then(response => {
        e.reply('http-registration-success', response);
    }).catch(error => {
        e.reply('http-registration-fail', error);
    });
});

// VERIFYING EMAIL ADDRESS
ipc.on('http-verify-email', (e, postData) => {
    netHandler.verifyAccount(postData).then(response => {
        e.reply('http-verify-email-success', response);
    }).catch(error => {
        e.reply('http-verify-email-fail', error);
    });
});

// LOGIN W/ USERNAME & PASSWORD
ipc.on('http-login-credentials', (e, cred) => {
    netHandler.loginCredentials(cred).then(response => {
        e.reply('http-login-credentials-success', response);
    }).catch(error => {
        e.reply('http-login-credentials-fail', error);
    });
});


// LOGOUT
ipc.on('http-logout', (e, cred) => {
    netHandler.logoutUser(cred).then(response => {
        e.reply('http-logout-success', response);
    }).catch(error => {
        e.reply('http-logout-fail', error);
    });
});