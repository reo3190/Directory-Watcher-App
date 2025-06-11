import React, { useEffect, useState, useRef } from "react";
import { useDataContext } from "../../../hook/UpdateContext";
import { useNavigate } from "react-router-dom";
import ChatSpace from "./Comp/ChatSpace";
import LogHead from "./Comp/LogHead";

import { LogCSS } from "../../_css/Log/index.css";

const Log = () => {
  const { currWatcher, setCurrWatcher, setWatchers, unregisterWatch } =
    useDataContext();

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

  if (!currWatcher)
    return (
      <>
        <div onClick={() => handleBack()}>back</div>
      </>
    );

  const handleMute = async (e: boolean) => {
    if (e != currWatcher.mute) {
      const res = await window.electron.ToggleMute(currWatcher);
      setWatchers(res);
      setCurrWatcher(res);
    }
  };

  return (
    <>
      <div className={LogCSS.wrapper}>
        <LogHead watcher={currWatcher} handleMute={handleMute} />
        <ChatSpace watcher={currWatcher} />
        {/* <button onClick={() => handleRemove()}>Remove</button> */}
      </div>
    </>
  );
};

export default Log;
