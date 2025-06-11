import React, { useEffect, useState, FC, useMemo, memo } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { isErr } from "../../../../../hook/api";
import SelectRoom from "./select";
import MessageTemp from "./message";

import { AddWatchCSS } from "../../../../_css/Top/index.css";
const { PopupCSS } = AddWatchCSS;
import clsx from "clsx";

import { FaCheck, FaXmark } from "react-icons/fa6";

interface Props {
  pop: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const temp: Watcher = {
  name: "",
  path: "",
  room: null,
  msgTemplate: "",
  mute: false,
  depth: 0,
  log: [],
};

const Popup: FC<Props> = ({ pop, setPopup }) => {
  const { watchers, chatRooms, registerWatch } = useDataContext();

  const [newWatch, setNewWatch] = useState<Watcher>(temp);
  const [alertName, setAlertName] = useState<string>("");
  const [alertPath, setAlertPath] = useState<string>("");
  const [alertRoom, setAlertRoom] = useState<string>("");

  const checkName = (name: string): boolean => {
    const ret = watchers.some((e) => e.name == name);
    return ret;
  };

  const checkPath = async (path: string): Promise<boolean> => {
    const ret = await window.electron.ExistPath(path);
    return !ret;
  };

  const checkStr = (str: string): boolean => {
    const ret = str.trim().length === 0;
    return ret;
  };

  const handleApply = async () => {
    const name1 = checkName(newWatch.name);
    const name2 = checkStr(newWatch.name);
    const path1 = checkStr(newWatch.path);
    const path2 = await checkPath(newWatch.path);
    const room = !newWatch.room;

    if (name1) {
      setAlertName("※既に同名の監視があります。");
    } else if (name2) {
      setAlertName("※入力されていません。");
    } else {
      setAlertName("");
    }
    if (path1) {
      setAlertPath("※入力されていません。");
    } else if (path2) {
      setAlertPath("※パスが存在しません。");
    } else {
      setAlertPath("");
    }
    if (room) {
      setAlertRoom("※選択されていません。");
    } else {
      setAlertRoom("");
    }

    if (name1 || name2 || path1 || path2 || room) return;

    registerWatch(newWatch);
    setPopup(false);
    setNewWatch(temp);
  };

  return (
    <div
      className={clsx(PopupCSS.wrapper, pop ? PopupCSS.show : PopupCSS.hide)}
    >
      {/* <div className={PopupCSS.head}>New Watch Setting</div> */}
      <div className={PopupCSS.body}>
        {/* <div className={PopupCSS.inner}> */}
        <button
          className={PopupCSS.close}
          onClick={() => {
            setPopup(false);
            setAlertName("");
            setAlertPath("");
            setAlertRoom("");
          }}
        >
          <FaXmark size={"1.4rem"} />
        </button>
        <div className={PopupCSS.contents}>
          <div className={PopupCSS.label}>
            <div>・タイトル</div>
            <div className={PopupCSS.labelAlert}>{alertName}</div>
          </div>
          <input
            className={PopupCSS.input}
            type="text"
            placeholder="name..."
            value={newWatch.name}
            onChange={(e) =>
              setNewWatch((pre) => ({ ...pre, name: e.target.value }))
            }
          />
        </div>
        <div className={PopupCSS.contents}>
          <div className={PopupCSS.label}>
            <div>・監視パス</div>
            <div className={PopupCSS.labelAlert}>{alertPath}</div>
          </div>
          <input
            className={PopupCSS.input}
            type="text"
            placeholder="path..."
            value={newWatch.path}
            onChange={(e) =>
              setNewWatch((pre) => ({ ...pre, path: e.target.value }))
            }
          />
        </div>
        <div className={PopupCSS.rowContents}>
          <div className={PopupCSS.label}>
            <div>・階層</div>
          </div>
          <select
            className={PopupCSS.dropmenu}
            value={newWatch.depth.toString()}
            onChange={(e) =>
              setNewWatch((pre) => ({ ...pre, depth: Number(e.target.value) }))
            }
          >
            <option value="0">0</option>
            <option value="1">1</option>
          </select>
        </div>
        <div className={PopupCSS.contents}>
          <div className={PopupCSS.label}>
            <div>・通知先</div>
            <div className={PopupCSS.labelAlert}>{alertRoom}</div>
          </div>
          <SelectRoom
            rooms={chatRooms}
            selected={newWatch.room}
            setWatch={setNewWatch}
          />
        </div>
        <div className={PopupCSS.contents}>
          <div>・メッセージ</div>
          <MessageTemp Watch={newWatch} setWatch={setNewWatch} />
        </div>
        <button className={PopupCSS.button} onClick={() => handleApply()}>
          追加
        </button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Popup;
