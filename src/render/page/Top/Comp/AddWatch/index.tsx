import React, { useEffect, useState } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import Popup from "./popup";
import clsx from "clsx";
import { AddWatchCSS } from "../../../../_css/Top/index.css";

const AddWatch = () => {
  const [popup, setPopup] = useState<boolean>(false);

  return (
    <>
      <div className={AddWatchCSS.wrapper}>
        <div
          className={clsx(AddWatchCSS.button)}
          onClick={() => !popup && setPopup(true)}
        >
          ADD
        </div>
      </div>
      <div
        className={clsx(
          AddWatchCSS.Popup,
          popup ? AddWatchCSS.showPopup : AddWatchCSS.hidePopup
        )}
      >
        <Popup pop={popup} setPopup={setPopup} />
      </div>
    </>
  );
};

export default AddWatch;
