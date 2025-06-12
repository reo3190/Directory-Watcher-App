import { createBridge } from "../render/Comp/ContextMenu/src/lib";

export interface ContextMenuTriggerData {
  handleEdit: () => void;
  handleDeletePop: () => void;
}

export const ContextMenuBridge = createBridge<ContextMenuTriggerData>({
  handleEdit: () => {},
  handleDeletePop: () => {},
});
