import React, { FC, useEffect, useState } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";

import { ChatBlockCSS } from "../../../../_css/Log/index.css";
import clsx from "clsx";
const { EditAreaCSS } = ChatBlockCSS;

import { IoIosClose, IoIosCheckmark } from "react-icons/io";
import { FaCheck, FaXmark } from "react-icons/fa6";

interface Props {
  log: LogEntry;
  setShowTextBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditArea: FC<Props> = ({ log, setShowTextBox }) => {
  const { currWatcher } = useDataContext();

  const [editLog, setEditLog] = useState<LogEntry>(log);

  const handleApply = async () => {
    setShowTextBox(false);
    if (!currWatcher) return;
    const res = await window.electron.EditLog(currWatcher, editLog);
  };

  return (
    <>
      <>
        <textarea
          className={clsx(ChatBlockCSS.massage, EditAreaCSS.textarea)}
          value={editLog.message}
          onChange={(e) =>
            setEditLog((pre) => ({ ...pre, message: e.target.value }))
          }
        />
        <div className={EditAreaCSS.side}>
          <button onClick={() => setShowTextBox(false)}>
            <FaXmark className={EditAreaCSS.close} size={"1.5rem"} />
          </button>
          <button onClick={() => handleApply()}>
            <FaCheck className={EditAreaCSS.check} size={"1.5rem"} />
          </button>
        </div>
      </>
    </>
  );
};

export default EditArea;
