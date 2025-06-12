import React, { FC, useEffect, useState } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { getTimeText } from "../../../../../hook/api";
import EditArea from "./EditArea";
import DeletePop from "./DeletePop";
import { ContextMenuTriggerArea } from "../../../../Comp/ContextMenu/src/lib";
import { ContextMenuBridge } from "../../../../../hook/ContextMenuBridge";
import ChatContextMenu from "../../../../Comp/ContextMenu";
import "../../../../Comp/ContextMenu/src/ContextMenu.css";

import { ChatBlockCSS } from "../../../../_css/Log/index.css";
import clsx from "clsx";
import { MdError } from "react-icons/md";
import { MdOutlineErrorOutline } from "react-icons/md";

interface Props {
  log: LogEntry;
  time: string;
}

const ChatBlock: FC<Props> = ({ log, time }) => {
  const { currWatcher } = useDataContext();

  const [edit, setEdit] = useState<boolean>(false);
  const [editLog, setEditLog] = useState<LogEntry | null>(null);
  const [deletePop, setDeletePop] = useState<boolean>(false);

  // const time = getTimeText(log.timestamp);
  const msg = log.state != "delete" ? log.message : "**Deleted**";

  const handleEdit = () => {
    setEdit(true);
    setEditLog(log);
  };

  const handleDeletePop = () => {
    if (log.state != "delete") {
      setDeletePop(true);
    }
  };

  return (
    <>
      <div className={ChatBlockCSS.wrapper}>
        {edit && editLog ? (
          <div className={clsx(ChatBlockCSS.block, ChatBlockCSS.onEdit)}>
            <EditArea log={editLog} setShowTextBox={setEdit} />
          </div>
        ) : log.state == "delete" ? (
          <div className={clsx(ChatBlockCSS.block, ChatBlockCSS.onDelete)}>
            <div className={ChatBlockCSS.deleted}>**Deleted**</div>
          </div>
        ) : (
          <>
            <ContextMenuTriggerArea
              bridge={ContextMenuBridge}
              className={ChatBlockCSS.block}
              data={{
                handleEdit,
                handleDeletePop,
              }}
            >
              <div className={ChatBlockCSS.massage}>{msg}</div>
              <div className={ChatBlockCSS.time}>{time}</div>
            </ContextMenuTriggerArea>
          </>
        )}
      </div>

      {deletePop && (
        <DeletePop log={log} pop={deletePop} setDeletePop={setDeletePop} />
      )}

      <ChatContextMenu />
    </>
  );
};

export default ChatBlock;
