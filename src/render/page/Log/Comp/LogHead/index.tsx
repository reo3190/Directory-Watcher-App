import React, { FC, useEffect, useState, useRef } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { useNavigate } from "react-router-dom";
import SettingPop from "./setting";

import { LogHeadCSS } from "../../../../_css/Log/index.css";
const { SettingPopCSS } = LogHeadCSS;
import { WatchersCSS } from "../../../../_css/Top/index.css";
import clsx from "clsx";
import { IoIosArrowBack, IoMdSettings } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsSignStopFill } from "react-icons/bs";

interface Props {
  watcher: Watcher;
  handleMute: (e: boolean) => void;
}

const LogHead: FC<Props> = ({ watcher, handleMute }) => {
  const { unregisterWatch } = useDataContext();

  const [pop, setPop] = useState<boolean>(false);
  const [gage, setGage] = useState<number>(0);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

  const handleOnDown = (e: React.MouseEvent) => {
    if (e.button != 0) return;
    if (!interval.current) {
      interval.current = setInterval(() => {
        setGage((pre) => (pre += 1));
      }, 10);
    }
  };

  const handleOnUp = (e: React.MouseEvent) => {
    if (e.button != 0) return;
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
      setGage(0);
    }
  };

  const handleRemove = () => {
    unregisterWatch(watcher);
    navigate("/");
  };

  return (
    <>
      <div className={LogHeadCSS.head}>
        <div
          className={clsx(LogHeadCSS.headInner, pop && LogHeadCSS.innerOpen)}
        >
          {watcher.mute && (
            <div className={WatchersCSS.stopOver}>
              <div className={WatchersCSS.stopBack}></div>
              <div className={WatchersCSS.stopText}>
                <BsSignStopFill size={"4rem"} />
              </div>
            </div>
          )}
          <div className={LogHeadCSS.headButton} onClick={() => handleBack()}>
            <IoIosArrowBack size={"1.5rem"} />
          </div>
          <div className={LogHeadCSS.info}>
            <div className={LogHeadCSS.name}>{watcher.name}</div>
            <div className={LogHeadCSS.path}>{watcher.path}</div>
          </div>
          <div
            ref={ref}
            className={clsx(
              LogHeadCSS.headButton,
              LogHeadCSS.setting,
              pop && LogHeadCSS.onPop
            )}
            onClick={() => setPop((pre) => !pre)}
          >
            <IoMdSettings size={"1.5rem"} />
          </div>
          <SettingPop
            watcher={watcher}
            handleMute={handleMute}
            pop={pop}
            setPop={setPop}
            buttonRef={ref}
          />
        </div>
      </div>
    </>
  );
};

export default LogHead;
