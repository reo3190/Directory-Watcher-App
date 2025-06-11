import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  webUtils,
} from "electron";

export type Channels = "ipc-example";

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  GetWatchers: async (): Promise<Watcher[]> => {
    const response = await ipcRenderer.invoke("get-watchers");
    return response;
  },
  AddWatch: async (info: Watcher): Promise<Succ> => {
    const response = await ipcRenderer.invoke("add-watch", info);
    return response;
  },
  RemoveWatch: async (info: Watcher): Promise<Succ> => {
    const response = await ipcRenderer.invoke("remove-watch", info);
    return response;
  },
  ToggleMute: async (info: Watcher): Promise<Watcher> => {
    const response = await ipcRenderer.invoke("toggle-mute", info);
    return response;
  },
  GetPaths: async (): Promise<string[]> => {
    const response = await ipcRenderer.invoke("get-paths");
    return response;
  },
  GetLogs: async (info: Watcher): Promise<Watcher> => {
    const response = await ipcRenderer.invoke("get-logs", info);
    return response;
  },
  EditLog: async (info: Watcher, log: LogEntry): Promise<LogEntry | Err> => {
    const response = await ipcRenderer.invoke("edit-log", info, log);
    return response;
  },
  DeleteLog: async (info: Watcher, log: LogEntry): Promise<LogEntry | Err> => {
    const response = await ipcRenderer.invoke("delete-log", info, log);
    return response;
  },
  GetRooms: async (): Promise<Room[] | Err> => {
    const response = await ipcRenderer.invoke("get-rooms");
    return response;
  },
  ExistPath: async (path: string): Promise<boolean> => {
    const response = await ipcRenderer.invoke("exist-path", path);
    return response;
  },
  onUpdateLogs: (callback: (info: Watcher) => () => void) => {
    const listener = (_: IpcRendererEvent, info: Watcher) => callback(info);
    ipcRenderer.on("update-logs", listener);

    return () => {
      ipcRenderer.removeListener("update-logs", listener);
    };
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
