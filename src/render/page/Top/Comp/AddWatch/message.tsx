import React, { useEffect, useState, useRef, FC } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { isErr } from "../../../../../hook/api";

import { AddWatchCSS } from "../../../../_css/Top/index.css";
const { MessageTempCSS } = AddWatchCSS.PopupCSS;

interface Props {
  Watch: Watcher;
  setWatch: React.Dispatch<React.SetStateAction<Watcher>>;
}

const MessageTemp: FC<Props> = ({ Watch, setWatch }) => {
  return (
    <>
      <div className={MessageTempCSS.wrapper}>
        <textarea
          className={MessageTempCSS.input}
          spellCheck="false"
          placeholder="Message Template"
          value={Watch.msgTemplate}
          onChange={(e) =>
            setWatch((pre) => ({ ...pre, msgTemplate: e.target.value }))
          }
        />
        <div>
          {Watch.path ? <>■ {Watch.path}</> : <>■ path\to\target\directory</>}
        </div>
        <div>
          ・追加ファイル_1
          <br />
          ・追加ファイル_2
        </div>
      </div>
    </>
  );
};

export default MessageTemp;
