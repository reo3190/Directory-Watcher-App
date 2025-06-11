import React, { useEffect, useState } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { useNavigate } from "react-router-dom";

import { WatchersCSS } from "../../../../_css/Top/index.css";
import { BsSignStopFill } from "react-icons/bs";

const Watchers = () => {
  const { watchers, setWatchers, setCurrWatcher } = useDataContext();

  const getLogs = async (watcher: Watcher) => {
    const res = await window.electron.GetLogs(watcher);
    setWatchers(res);
    setCurrWatcher(res);
  };

  const navigate = useNavigate();
  const handleWatch = async (i: number) => {
    await getLogs(watchers[i]);
    navigate("/log");
  };

  return (
    <div className={WatchersCSS.wrapper}>
      {watchers.map((e, i) => {
        return (
          <div
            key={e.name + i}
            className={WatchersCSS.card}
            onClick={() => handleWatch(i)}
          >
            {e.mute && (
              <div className={WatchersCSS.stopOver}>
                <div className={WatchersCSS.stopBack}></div>
                <div className={WatchersCSS.stopText}>
                  <BsSignStopFill size={"4rem"} />
                </div>
              </div>
            )}
            <div>
              <div className={WatchersCSS.name}>{e.name}</div>
              <div className={WatchersCSS.path}>{e.path}</div>
            </div>
            <div className={WatchersCSS.room}>
              {/* <div>{e.room?.name}</div> */}
              <img className={WatchersCSS.icon} src={e.room?.icon} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Watchers;
