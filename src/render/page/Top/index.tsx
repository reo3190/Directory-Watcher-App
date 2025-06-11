import React, { useEffect, useState } from "react";
import { useDataContext } from "../../../hook/UpdateContext";
import Watchers from "./Comp/Watchers";
import AddWatch from "./Comp/AddWatch";

import { TopCSS } from "../../_css/Top/index.css";

const Top = () => {
  return (
    <div className={TopCSS.wrapper}>
      <div className={TopCSS.AddWatch}>
        <AddWatch />
      </div>

      <Watchers />
    </div>
  );
};

export default Top;
