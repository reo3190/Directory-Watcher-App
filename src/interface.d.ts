import { type } from "os";
import React, { RefObject } from "react";

export interface IElectronAPI {
  GetWatchers: () => Promise<Watcher[]>;
  AddWatch: (info: Watcher) => Promise<Succ>;
  RemoveWatch: (info: Watcher) => Promise<Succ>;
  ToggleMute: (info: Watcher) => Promise<Watcher>;
  GetPaths: () => Promise<string[]>;
  GetLogs: (info: Watcher) => Promise<Watcher>;
  EditLog: (info: Watcher, log: LogEntry) => Promise<LogEntry | Err>;
  DeleteLog: (info: Watcher, log: LogEntry) => Promise<LogEntry | Err>;
  GetRooms: () => Promise<Room[] | Err>;
  ExistPath: (path: string) => Promise<boolean>;
  onUpdateLogs: (callback: (info: Watcher) => void) => () => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }

  type CacheMode = "add" | "get" | "remove" | "clear";

  type OpenFileFolderType = "openFile" | "openDirectory";

  type Watcher = {
    name: string;
    path: string;
    room: Room | null;
    msgTemplate: string;
    mute: boolean;
    depth: number;
    log: LogEntry[];
  };

  type Room = {
    name: string;
    id: string;
    icon: string;
  };

  type LogType =
    | "add"
    | "change"
    | "unlink"
    | "error"
    | "register"
    | "unregister"
    | "mute";

  interface LogEntry {
    timestamp: string;
    message: string;
    id: string;
    state: "none" | "edit" | "delete";
  }

  type Keybind = {
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    key: KeyboardEvent["key"];
  };

  type KeybindProps = {
    keybind: string;
    onKeyDown?: (event: KeyboardEvent) => void;
    targetRef?: RefObject<HTMLElement>;
  };

  type ShortCuts = Record<string, Keybind>;

  interface Succ {
    success: string;
  }

  interface Err {
    error: string;
    errorcode: string;
  }
}

export {};
