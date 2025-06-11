import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { AppSub } from "./App";

createRoot(document.getElementById("root-sub") as Element).render(
  <HashRouter>
    <AppSub />
  </HashRouter>
);
