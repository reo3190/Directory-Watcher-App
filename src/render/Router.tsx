import "./_sass/main.scss";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Top from "./page/Top";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path={`/`} element={<Top />} />
      </Routes>
    </>
  );
};
