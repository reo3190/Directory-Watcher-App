import React, { FC, useEffect, useState, useRef } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { getTimeText } from "../../../../../hook/api";
import ChatBlock from "../ChatBlock";

import { ChatSpaceCSS } from "../../../../_css/Log/index.css";

interface Props {
  watcher: Watcher;
}

const ChatSpace: FC<Props> = ({ watcher }) => {
  const { setCurrWatcher, setWatchers } = useDataContext();

  const logs = [...watcher.log]
    .reverse()
    .reduce((acc: Record<string, LogEntry[]>, log) => {
      const time = getTimeText(log.timestamp);
      acc[time[0]] = acc[time[0]] || [];
      acc[time[0]].push(log);
      return acc;
    }, {});
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }

    const updateLogs = (info: Watcher) => {
      if (info.name == watcher.name) {
        setWatchers(info);
        setCurrWatcher(info);
      }
    };
    const removeLister = window.electron.onUpdateLogs(updateLogs);

    return () => {
      removeLister();
    };
  }, []);

  return (
    <>
      <div className={ChatSpaceCSS.chatHeadBack}>
        <div className={ChatSpaceCSS.chatHead}>
          <img className={ChatSpaceCSS.icon} src={watcher.room?.icon} />
          <div>{watcher.room?.name}</div>
        </div>
      </div>
      <div className={ChatSpaceCSS.chat} ref={ref}>
        {Object.entries(logs).map(([date, msgs]) => (
          <div key={date} className={ChatSpaceCSS.day}>
            <div className={ChatSpaceCSS.date}>{date}</div>
            {msgs.map((e, i) => {
              const time = getTimeText(e.timestamp);
              return (
                <React.Fragment key={e.timestamp + i}>
                  <ChatBlock log={e} time={time[1]} />
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatSpace;
