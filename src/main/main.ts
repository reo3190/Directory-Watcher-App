import path from "path";
import fs from "fs";
import {
  BrowserWindow,
  app,
  ipcMain,
  Menu,
  dialog,
  shell,
  Tray,
} from "electron";
import { autoUpdater } from "electron-updater";
import { isErr } from "../hook/api";
import os from "os";
import WatcherManager from "./utils/chokidar";
const manager = new WatcherManager();
import { getLogs, getAllPaths } from "./utils/db";
import { dbPath } from "./utils/db";

//  /$$   /$$  /$$$$$$  /$$$$$$$$ /$$   /$$
// | $$$ /$$$ /$$__  $$|__  $$__/| $$$ | $$
// | $$$$$$$$| $$  | $$   | $$   | $$$$| $$
// | $$ $$ $$| $$$$$$$$   | $$   | $$ $$ $$
// | $$\_/ $$| $$__  $$   | $$   | $$  $$$$
// | $$  | $$| $$  | $$   | $$   | $$\  $$$
// | $$  | $$| $$  | $$ /$$$$$$$$| $$ \  $$
// \__/  \__/\__/  \__/ \_______/\__/  \__/

autoUpdater.autoInstallOnAppQuit = false;

app.setAboutPanelOptions({
  applicationName: "[SBL]Directory Watcher App", // アプリ名
  applicationVersion: app.getVersion(), // アプリのバージョン
  iconPath: "assets/icon.ico",
});

const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (!app.requestSingleInstanceLock()) {
  console.error("Another instance is running.");
  app.exit(0);
}

function registerAutoStart() {
  const startupFolder = path.join(
    process.env.APPDATA!,
    "Microsoft\\Windows\\Start Menu\\Programs\\Startup"
  );

  const exePath = process.execPath;
  const shortcutPath = path.join(startupFolder, "MyApp.lnk");

  if (fs.existsSync(shortcutPath)) {
    fs.unlinkSync(shortcutPath);
  }

  const res = shell.writeShortcutLink(shortcutPath, "create", {
    target: exePath,
    args: "--startup",
  });

  console.log(res);
  console.log(exePath);
  console.log(shortcutPath);
}

const helpMenu = [
  {
    label: "情報",
    submenu: [
      {
        label: "仕様書",
        click() {
          shell.openExternal(
            "https://docs.google.com/document/d/1M2QV_xfB-wpsNe2h_0o6gHzjUY6QpPBv1gcEFwSBgyI/edit?usp=sharing"
          );
        },
      },
      {
        label: "リリースノート",
        click() {
          shell.openExternal("https://example.com/");
        },
      },
      {
        label: `v ${app.getVersion()}`,
        enabled: false,
      },
      // {
      //   label: `->${dbPath}`,
      //   enabled: false,
      // },
    ],
  },
];

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    minWidth: 450,
    // resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setAspectRatio(0.6);

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.loadFile("dist/index.html");

  const menu = Menu.buildFromTemplate([...helpMenu]);
  Menu.setApplicationMenu(menu);

  return mainWindow;
}

app.whenReady().then(async () => {
  const basePath = app.isPackaged
    ? path.join(process.resourcesPath)
    : path.join(__dirname);
  const iconPath = path.join(basePath, "assets", "icon.ico");
  const tray = new Tray(iconPath);
  const trayMenu = Menu.buildFromTemplate([
    {
      label: "アプリを表示",
      click: () => {
        if (!mainWindow) {
          createMainWindow();
        } else {
          mainWindow.show();
          autoUpdater.checkForUpdatesAndNotify();
        }
      },
    },
    {
      label: "アプリを終了",
      click: (): void => {
        tray.destroy();
        app.quit();
        app.exit(0);
      },
    },
  ]);
  tray.setContextMenu(trayMenu);
  tray.on("click", () => {
    if (!mainWindow) {
      createMainWindow();
    } else {
      mainWindow.show();
      autoUpdater.checkForUpdatesAndNotify();
    }
  });

  registerAutoStart();
  // createStartWindow();

  const isStartup = process.argv.includes("--startup");
  if (!isStartup) {
    const win = createMainWindow();
    manager.mainWindow = win;
    if (isDebug) win.webContents.openDevTools({ mode: "detach" });
  }
});

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    mainWindow.focus();
  }
});

// // すべてのウィンドウが閉じられたらアプリを終了する
// app.once("window-all-closed", () => app.quit());

// ダウンロード完了後、アップデートのインストール
autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Ready",
      message:
        "最新のバージョンがダウンロードされました。アプリを再起動しますか？",
      buttons: ["今すぐ再起動", "後で"],
    })
    .then((result) => {
      if (result.response === 0) {
        try {
          autoUpdater.quitAndInstall();
        } catch (error) {
          dialog.showMessageBox({
            type: "info",
            title: "Update Available",
            message: error as string,
          });
        }
      }
    });
});

//  /$$     /$$  /$$$$$$  /$$$$$$$$$$  /$$$$$$  /$$   /$$
// | $$    | $$ /$$__  $$|___  $$___/ /$$___ $$| $$  | $$
// | $$ /$$| $$| $$  | $$    | $$    | $$   \_/| $$  | $$
// | $$/$$$$ $$| $$$$$$$$    | $$    | $$      | $$#$$$$$
// | $$$$  $$$$| $$__  $$    | $$    | $$      | $$__  $$
// | $$$/\  $$$| $$  | $$    | $$    | $$   /$$| $$  | $$
// | $$/  \  $$| $$  | $$    | $$    |  $$$$$$/| $$  | $$
// \__/    \__/\__/  \__/    \__/     \______/ \__/  \__/

//  /$$$$$$$$ /$$$$$$$   /$$$$$$
// |__  $$__/| $$__  $$ /$$___ $$
//    | $$   | $$  | $$| $$   \_/
//    | $$   | $$$$$$$/| $$
//    | $$   | $$____/ | $$
//    | $$   | $$      | $$   /$$
//  /$$$$$$$$| $$      |  $$$$$$/
//  \_______/\__/       \______/

ipcMain.handle("get-watchers", (_): Watcher[] => {
  return manager.GetWatchers();
});

ipcMain.handle("add-watch", (_, info: Watcher): Succ => {
  manager.addWatch(info);
  return { success: "" };
});

ipcMain.handle("remove-watch", (_, info: Watcher): Succ => {
  manager.removeWatch(info);
  return { success: "" };
});

ipcMain.handle("toggle-mute", (_, info: Watcher): Watcher => {
  const ret = manager.toggleMute(info);
  return ret;
});

ipcMain.handle("get-paths", (_): string[] => {
  return getAllPaths();
});

ipcMain.handle("get-logs", (_, info: Watcher): Watcher => {
  return getLogs(info);
});

ipcMain.handle(
  "edit-log",
  async (_, info: Watcher, log: LogEntry): Promise<LogEntry | Err> => {
    return await manager.editMessage(info, log);
  }
);

ipcMain.handle(
  "delete-log",
  async (_, info: Watcher, log: LogEntry): Promise<LogEntry | Err> => {
    return await manager.deleteMessage(info, log);
  }
);

ipcMain.handle("get-rooms", async (_): Promise<Room[] | Err> => {
  return await manager.GetRooms();
});

ipcMain.handle("exist-path", async (_, path: string): Promise<boolean> => {
  return fs.existsSync(path);
});
