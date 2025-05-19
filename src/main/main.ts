import path from "path";
import fs from "fs";
import { BrowserWindow, app, ipcMain, Menu, dialog, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { isErr } from "../hook/api";
import os from "os";
// const tempName = "_video-preview-app-";
// const temp = fs.mkdtempSync(`${os.tmpdir()}/${tempName}`);

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

let mWindow: BrowserWindow | null = null;
app.whenReady().then(async () => {
  // アプリの起動イベント発火で BrowserWindow インスタンスを作成
  const mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mWindow = mainWindow;

  mainWindow.setAspectRatio(1.5);

  if (isDebug) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.on("resize", () => {
    const size = mainWindow.getBounds();
    mainWindow.webContents.send("window-resize", size);
  });

  ipcMain.handle("get-window-size", async (_): Promise<Electron.Rectangle> => {
    const res = mainWindow.getBounds();
    return res;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  // const menu = Menu.buildFromTemplate([...fileMenu, ...template, ...helpMenu]);
  // Menu.setApplicationMenu(menu);

  mainWindow.on("close", async (e) => {
    e.preventDefault(); // 一旦閉じるのをキャンセル[]

    // if (canClose) {
    mainWindow.destroy(); // 強制的に閉じる
    // }
  });

  // レンダラープロセスをロード
  mainWindow.loadFile("dist/index.html");

  autoUpdater.checkForUpdatesAndNotify();
});

app.on("will-quit", async () => {
  try {
    // if (fs.existsSync(temp)) {
    //   fs.rmSync(temp, { recursive: true, force: true });
    //   console.log(`Temporary directory ${temp} deleted successfully.`);
    // }
    // fs.readdirSync(os.tmpdir()).forEach((file) => {
    //   const filePath = path.join(os.tmpdir(), file);
    //   if (file.startsWith(tempName) && fs.statSync(filePath).isDirectory()) {
    //     fs.rmSync(filePath, { recursive: true, force: true });
    //   }
    // });
  } catch (err) {
    // console.error(`Failed to delete temporary directory ${temp}:`, err);
  }
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once("window-all-closed", () => app.quit());

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

//  /$$$$$$$$ /$$$$$$$   /$$$$$$
// |__  $$__/| $$__  $$ /$$___ $$
//    | $$   | $$  | $$| $$   \_/
//    | $$   | $$$$$$$/| $$
//    | $$   | $$____/ | $$
//    | $$   | $$      | $$   /$$
//  /$$$$$$$$| $$      |  $$$$$$/
//  \_______/\__/       \______/
