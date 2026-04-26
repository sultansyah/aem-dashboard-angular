import { app, BrowserWindow } from 'electron';
import { join } from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (!app.isPackaged) {
        mainWindow.loadURL('http://localhost:4200');
    } else {
        mainWindow.loadFile(join(__dirname, '../dist/aem-dashboard-angular/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    })
})