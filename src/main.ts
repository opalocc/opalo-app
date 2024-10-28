import { app, BrowserWindow, shell } from 'electron';
import path, { basename, dirname, resolve } from 'path';
import { updateElectronApp } from 'update-electron-app';
import hasSquirrelStartupEvents from 'electron-squirrel-startup';
import { Express, Request, Response, static as staticExpress } from 'express';

updateElectronApp();

if (hasSquirrelStartupEvents) {
  app.quit();
}

let updateExePath;
const appFolder = dirname(process.execPath);
const exeName = basename(process.execPath);
if (process.platform === 'win32') {
  app.setAppUserModelId(app.name);
  updateExePath = resolve(appFolder, '..', 'Update.exe');
}

app.setLoginItemSettings({
  path: updateExePath,
  args: ['--processStart', `"${exeName}"`, '--process-start-args', `"--hidden"`],
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    const app: Express = express();

    const port = 3200;

    app.use('/assets', staticExpress(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/assets`)));

    app.get('*', function (req: Request, res: Response) {
      res.sendFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/`));
    });

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
    mainWindow.loadURL(`http://localhost:${port}`);
    //mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://accounts.google.com/')) return { action: 'allow' };
    if (url.startsWith('http') || url.startsWith('https')) shell.openExternal(url);
    return { action: 'deny' };
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
