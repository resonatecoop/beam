// Module to control the application lifecycle and the native browser window.
const {
  app,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  protocol,
  shell,
} = require("electron");
const path = require("path");

const TOGGLE_DARK_MODE = "dark-mode:toggle";
const USE_SYSTEM_DARK_MODE = "dark-mode:system";
// const logger = (contents, log) => {
//   contents.executeJavaScript(`
//     console.warn('${JSON.stringify(log)}');
//   `);
// };

const fileUrl = require("url").format({
  protocol: "file",
  slashes: true,
  pathname: require("path").join(__dirname, "index.html"),
});

const appURL = app.isPackaged ? fileUrl : "http://localhost:8080";

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    autoHideMenuBar: true,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "icons/256x256.png"),
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // Dark mode
  ipcMain.removeHandler(TOGGLE_DARK_MODE);
  ipcMain.handle(TOGGLE_DARK_MODE, () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    } else {
      nativeTheme.themeSource = "dark";
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.removeHandler(USE_SYSTEM_DARK_MODE);
  ipcMain.handle(USE_SYSTEM_DARK_MODE, () => {
    nativeTheme.themeSource = "system";
  });
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();
  app.setAppLogsPath();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("web-contents-created", (event, contents) => {
  // doing this because electron breaks when reloading a page
  // https://github.com/electron/electron/issues/14978
  contents.on(
    "did-fail-load",
    async (event, errorCode, errorDescription, validatedUrl) => {
      const parsedUrl = new URL(validatedUrl);
      const search = parsedUrl.search;
      await contents.loadURL(appURL);
      contents.executeJavaScript(`
        AppHistory.navigate("${search}");
      `);
    }
  );

  // If your app has no need to navigate or only needs to navigate to known pages,
  // it is a good idea to limit navigation outright to that known scope,
  // disallowing any other kinds of navigation.
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (["https:", "http:", "mailto:"].includes(parsedUrl.protocol)) {
      if (parsedUrl.hostname !== "id.resonate.coop") {
        event.preventDefault();

        shell.openExternal(navigationUrl);
      }
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
