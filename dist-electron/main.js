"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    if (!electron_1.app.isPackaged) {
        mainWindow.loadURL('http://localhost:4200');
    }
    else {
        mainWindow.loadFile((0, path_1.join)(__dirname, '../dist/aem-dashboard-angular/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            electron_1.app.quit();
    });
});
