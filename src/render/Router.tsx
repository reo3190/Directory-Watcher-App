import "./_sass/main.scss";
import "./_css/Comp/_global.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Top from "./page/Top";
import Log from "./page/Log";

import { useDataContext } from "../hook/UpdateContext";
import { isErr } from "../hook/api";
import { GiReturnArrow } from "react-icons/gi";

export const Router = () => {
  const { setWatchers, setChatRooms } = useDataContext();

  useEffect(() => {
    const getRooms = async () => {
      const res = await window.electron.GetRooms();
      if (isErr(res)) return;
      setChatRooms(res);
    };
    getRooms();

    const getWatchers = async () => {
      const res = await window.electron.GetWatchers();
      res.forEach((e) => {
        setWatchers(e);
      });
    };
    getWatchers();
  }, []);

  return (
    <>
      <Routes>
        <Route path={`/`} element={<Top />} />
        <Route path={`/log`} element={<Log />} />
      </Routes>
    </>
  );
};
