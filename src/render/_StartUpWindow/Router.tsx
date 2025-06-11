import "../_sass/main.scss";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Startup from "./page/Top";

export const RouterSub = () => {
  return (
    <>
      <Routes>
        <Route path={`/`} element={<Startup />} />
      </Routes>
    </>
  );
};
