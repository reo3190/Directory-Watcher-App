import React, { useEffect, useState } from "react";
import { ContextMenu, useContextMenu, ContextMenuOption } from "./src/lib";
import { ContextMenuBridge } from "../../../hook/ContextMenuBridge";

import { MdEdit, MdDelete } from "react-icons/md";

function ChatContextMenu() {
  const { handleEdit, setDeletePop } = useContextMenu(ContextMenuBridge);

  return (
    <>
      <ContextMenu dark={true} bridge={ContextMenuBridge}>
        <>
          <ContextMenuOption onClick={() => handleEdit()}>
            <MdEdit size={"1.5rem"} /> 編集
          </ContextMenuOption>
          <ContextMenuOption onClick={() => setDeletePop(true)}>
            <MdDelete size={"1.5rem"} /> 削除
          </ContextMenuOption>
        </>
      </ContextMenu>
    </>
  );
}

export default ChatContextMenu;
