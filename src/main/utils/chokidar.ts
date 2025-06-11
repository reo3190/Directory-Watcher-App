import chokidar, { FSWatcher, ChokidarOptions } from "chokidar";
import { EventEmitter } from "events";
import {
  regsterWatch,
  unregsterWatch,
  getAllWatchs,
  saveLog,
  editLog,
  deleteLog,
  getLogs,
  deleteAllLogs,
  ToggleMute,
} from "./db";
import { BrowserWindow } from "electron";
import ChatManager from "./chat";
import { isErr } from "../../hook/api";

interface currTimeoutState {
  files: string[];
  timeout: NodeJS.Timeout;
}

class WatcherManager extends EventEmitter {
  public mainWindow: BrowserWindow | null;
  private watchers: Map<string, FSWatcher>;
  private defaultOptions: ChokidarOptions;
  private chatManager: ChatManager;
  private schedule: Map<string, currTimeoutState>;
  private interval: number = 10000;

  constructor(options = {}) {
    super();
    this.mainWindow = null;
    this.watchers = new Map(); // path -> chokidar watcher
    this.schedule = new Map();
    this.defaultOptions = {
      persistent: true,
      ignored: /[\/\\]\./,
      ignoreInitial: true,
      depth: 1,
      ...options,
    };
    this.chatManager = new ChatManager();

    this.__init__();
  }

  __init__() {
    const watcher_db = this.GetWatchers();
    watcher_db.forEach((e) => {
      this.addWatch(e);
    });
  }

  _updateLogs(info: Watcher) {
    if (this.mainWindow) {
      const updateInfo = getLogs(info);
      this.mainWindow.webContents.send("update-logs", updateInfo);
    }
  }

  async _addEvent(info: Watcher, file: string) {
    const msg = `[ADD] ${file} in ${info.path}`;
    console.log(msg);
    this.__scheduleChat(info, file);
  }

  __scheduleChat = (info: Watcher, file: string) => {
    const state = this.schedule.get(info.name);

    if (state) {
      clearTimeout(state.timeout);
    }

    const newFiles: string[] = [...(state?.files || []), file];

    const newTimeout = setTimeout(async () => {
      this.__sendChat(info, newFiles);
    }, this.interval);

    const newState: currTimeoutState = {
      files: newFiles,
      timeout: newTimeout,
    };

    this.schedule.set(info.name, newState);
  };

  async __sendChat(info: Watcher, files: string[]) {
    const res = await this.chatManager.sendChat(
      info.room?.id || "353654438",
      info.msgTemplate,
      files
    );
    if (isErr(res)) return;
    console.log(res);
    saveLog(info, res.msg, res.id);
    this._updateLogs(info);
  }

  _changeEvent(info: Watcher, file: string) {
    console.log(`[CHANGE] ${file} in ${info.path}`);
    // saveLog(info, `[CHANGE] ${file} in ${info.path}`, "change");
  }

  _unlinkEvent(info: Watcher, file: string) {
    console.log(`[UNLINK] ${file} in ${info.path}`);
    // saveLog(info, `[UNLINK] ${file} in ${info.path}`, "unlink");
  }

  _errorEvent(info: Watcher, err: any) {
    console.error(`[ERROR] ${info.path}`, err);
    // saveLog(info, `[ERROR] ${info.path}`, "error");
  }

  _openWatch(info: Watcher) {
    // if (this.watchers.has(path)) {
    //   console.warn(`[WatcherManager] Already watching: ${path}`);
    //   return;
    // }

    const opt: ChokidarOptions = { ...this.defaultOptions, depth: info.depth };
    const watcher = chokidar.watch(info.path, opt);

    watcher
      .on("add", (file) => this._addEvent(info, file))
      .on("change", (file) => this._changeEvent(info, file))
      .on("unlink", (file) => this._unlinkEvent(info, file))
      .on("error", (error) => this._errorEvent(info, error))
      .on("addDir", (dir) => this._addEvent(info, dir))
      .on("unlinkDir", (dir) => this._unlinkEvent(info, dir));

    this.watchers.set(info.name, watcher);
    console.log(`[WatcherManager] Started watching: ${info.name}`);
  }

  _closeWatch(name: string) {
    const watcher = this.watchers.get(name);
    if (!watcher) {
      console.warn(`[WatcherManager] Not watching: ${name}`);
      return;
    }

    watcher.close().then(() => {
      this.watchers.delete(name);
      console.log(`[WatcherManager] Stopped watching: ${name}`);
    });
  }

  addWatch(info: Watcher) {
    this._openWatch(info);
    regsterWatch(info);
    // saveLog(info, `Start Watch ${info.path}`, "register");
  }

  removeWatch(info: Watcher) {
    this._closeWatch(info.name);
    unregsterWatch(info);
    deleteAllLogs(info);
  }

  closeAll() {
    const closePromises = [];
    for (const [path, watcher] of this.watchers.entries()) {
      closePromises.push(watcher.close());
      console.log(`[WatcherManager] Closing watcher: ${path}`);
    }

    this.watchers.clear();
    return Promise.all(closePromises);
  }

  toggleMute(info: Watcher): Watcher {
    const bef = info.mute;
    const aft: Watcher = { ...info, mute: !bef };
    if (aft.mute) {
      this._closeWatch(aft.name);
    } else {
      this._openWatch(aft);
    }
    ToggleMute(aft);
    return aft;
  }

  async editMessage(info: Watcher, log: LogEntry): Promise<LogEntry | Err> {
    const res = await this.chatManager.editChat(
      // info.roomID,
      "353654438",
      log.id,
      log.message
    );
    if (isErr(res)) return res;
    const updateLog = editLog(log);
    this._updateLogs(info);
    return updateLog;
  }

  async deleteMessage(info: Watcher, log: LogEntry): Promise<LogEntry | Err> {
    const res = await this.chatManager.deleteChat(
      // info.roomID,
      "353654438",
      log.id
    );
    if (isErr(res)) return res;
    const updateLog = deleteLog(log);
    this._updateLogs(info);
    return updateLog;
  }

  GetWatchers(): Watcher[] {
    return getAllWatchs();
  }

  async GetRooms(): Promise<Room[] | Err> {
    return await this.chatManager.getRooms();
  }
}

export default WatcherManager;
