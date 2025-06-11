import { Routes, Route } from "react-router-dom";
import { DataProvider } from "../hook/UpdateContext";
import { ShortcutProvider } from "../ctx/ShortCut";
import Top from "./page/Top";
import { Router } from "./Router";

export const App = () => {
  return (
    <>
      <DataProvider>
        <ShortcutProvider>
          <Router />
        </ShortcutProvider>
      </DataProvider>
    </>
  );
};
