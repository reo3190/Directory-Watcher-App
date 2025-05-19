import React, { useEffect, useState } from "react";
import { ContextMenu, useContextMenu, ContextMenuOption } from "./src/lib";
import { ContextMenuBridge } from "../../../hook/ContextMenuBridge";

function VideoContextMenu() {
  return (
    <>
      <ContextMenu dark={true} bridge={ContextMenuBridge}>
        <>
          <ContextMenuOption onClick={() => {}}>aaa</ContextMenuOption>
          <ContextMenuOption onClick={() => {}}>bbb</ContextMenuOption>
        </>
      </ContextMenu>
    </>
  );
}

export default VideoContextMenu;
