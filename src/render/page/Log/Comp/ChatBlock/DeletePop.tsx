import React, { FC, useEffect, useState, useRef } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { getTimeText } from "../../../../../hook/api";
import EditArea from "./EditArea";
import { ContextMenuTriggerArea } from "../../../../Comp/ContextMenu/src/lib";
import { ContextMenuBridge } from "../../../../../hook/ContextMenuBridge";
import ChatContextMenu from "../../../../Comp/ContextMenu";
import "../../../../Comp/ContextMenu/src/ContextMenu.css";

import { ChatBlockCSS } from "../../../../_css/Log/index.css";
const { DeletePopCSS } = ChatBlockCSS;
import clsx from "clsx";
import { MdError } from "react-icons/md";
import { MdOutlineErrorOutline } from "react-icons/md";
import { vars } from "../../../../_css/Comp/_theme.css";

interface Props {
  log: LogEntry;
  pop: boolean;
  setDeletePop: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeletePop: FC<Props> = ({ log, pop, setDeletePop }) => {
  const { currWatcher } = useDataContext();
  const [gage, setGage] = useState<number>(0);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const msg = log.state != "delete" ? log.message : "**Deleted**";

  const handleDelete = async () => {
    if (!currWatcher) return;
    await window.electron.DeleteLog(currWatcher, log);
    setDeletePop(false);
  };

  const handleOnDown = (e: React.MouseEvent) => {
    if (e.button != 0) return;
    if (!interval.current) {
      interval.current = setInterval(() => {
        setGage((pre) => {
          if (pre > 100) {
            handleDelete();
            return 100;
          } else {
            return (pre += 1);
          }
        });
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

  return (
    <>
      <div className={DeletePopCSS.PopBack}>
        <div className={DeletePopCSS.Pop}>
          <div className={DeletePopCSS.PopText}>
            <MdOutlineErrorOutline
              className={DeletePopCSS.PopIcon}
              size={"2rem"}
            />
            以下のチャットを削除しますか?
          </div>
          <div className={DeletePopCSS.PopMessage}>{msg}</div>
          <div className={DeletePopCSS.PopForm}>
            <button
              className={DeletePopCSS.PopButtonGray}
              onClick={() => setDeletePop(false)}
            >
              Cancel
            </button>
            <button
              className={DeletePopCSS.PopButtonRed}
              // onClick={() => handleDelete()}
              onMouseDown={(e) => handleOnDown(e)}
              onMouseUp={(e) => handleOnUp(e)}
              onMouseLeave={(e) => handleOnUp(e)}
              style={{
                backgroundImage: `linear-gradient(90deg, ${vars.color.red} 0% ${gage}%, #00000000 0% 100%)`,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePop;
