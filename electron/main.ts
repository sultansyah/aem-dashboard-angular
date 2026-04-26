import { app, BrowserWindow, Menu } from 'electron';
import { join } from 'path';
import { pathToFileURL } from 'url';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
    if (app.isPackaged) {
        Menu.setApplicationMenu(null);
    }

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

    if (app.isPackaged) {
        const indexPath = join(__dirname, '../dist/aem-dashboard-angular/index.html');
        const indexUrl = pathToFileURL(indexPath).toString();

        mainWindow.loadURL(`${indexUrl}#/login`);

        mainWindow.webContents.on('before-input-event', (event, input) => {
            const key = input.key.toLowerCase();
            const isReloadShortcut =
                input.key === 'F5' ||
                (key === 'r' && (input.control || input.meta));

            const isDevToolsShortcut =
                input.key === 'F12' ||
                (key === 'i' && input.control && input.shift) ||
                (key === 'i' && input.meta && input.alt);

            if (isReloadShortcut || isDevToolsShortcut) {
                event.preventDefault();
            }
        });

        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow?.webContents.closeDevTools();
        });
    } else {
        mainWindow.loadURL('http://localhost:4200');
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
