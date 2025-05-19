import React, { RefObject } from "react";

export interface IElectronAPI {}

declare global {
  interface Window {
    electron: IElectronAPI;
  }

  type CacheMode = "add" | "get" | "remove" | "clear";

  type OpenFileFolderType = "openFile" | "openDirectory";

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
