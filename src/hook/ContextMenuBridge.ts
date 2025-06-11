import { createBridge } from "../render/Comp/ContextMenu/src/lib";

export interface ContextMenuTriggerData {
  handleEdit: () => void;
  setDeletePop: (value: React.SetStateAction<boolean>) => void;
}

export const ContextMenuBridge = createBridge<ContextMenuTriggerData>({
  handleEdit: () => {},
  setDeletePop: () => {},
});
