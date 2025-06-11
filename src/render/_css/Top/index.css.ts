import { style } from "@vanilla-extract/css";
import * as parts from "../Comp/parts.css";
import { vars } from "../Comp/_theme.css";

export const TopCSS = {
  wrapper: style({
    width: "100vw",
    height: "100vh",
    // overflow: "hidden",
    overflowY: "auto",
  }),
  AddWatch: style({
    width: "100%",
    height: "50px",
  }),
};

const SelectCSS = {
  wrapper: style([
    parts.size("100%", 50),
    parts.flexCenter,
    {
      position: "relative",
    },
  ]),
  select: style([
    parts.size("100%", 45),
    parts.inputFrame,
    {
      display: "flex",
      gap: 10,
      alignItems: "center",
    },
  ]),
  dropdown: style([
    parts.size("100%", 250),
    {
      background: vars.color.white,
      overflowY: "scroll",
      position: "absolute",
      top: 50,
      left: 0,
      zIndex: 5,
      border: "solid 1px",
      borderColor: vars.color.gray3,
      boxShadow: "2px 2px 8px 0px rgba(0, 0, 0, 0.5)",
    },
  ]),
  option: style([
    {
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: 5,

      ":hover": {
        background: vars.color.gray3,
      },
    },
  ]),
  img: style([parts.iconSize(30), {}]),
};
const MessageTempCSS = {
  wrapper: style([
    parts.size("100%", "fit-content"),
    {
      minHeight: 150,
      maxHeight: 240,
      border: "solid 1px",
      borderColor: vars.color.gray3,
      borderRadius: 10,
      padding: 5,
      lineHeight: "1.2rem",
    },
  ]),
  input: style([
    parts.size("100%", "auto"),
    parts.inputFrame,
    {
      resize: "none",
      minHeight: "5rem",
      maxHeight: "12rem",
    },
  ]),
};
const PopupCSS = {
  wrapper: style([
    parts.size(400, "fit-content"),
    parts.flexCenter,
    {
      minHeight: 550,
      // background: vars.color.white,
      color: vars.color.black,
      transition: "transform .2s",
    },
  ]),
  head: style([
    {
      width: "100%",
      height: "30px",
      background: vars.color.white,
    },
  ]),
  body: style([
    parts.flexCenter,
    parts.size("100%", "100%"),
    {
      background: vars.color.white,
      display: "flex",
      flexDirection: "column",
      borderRadius: "10px",
      position: "relative",
      gap: 10,
      padding: 20,
    },
  ]),
  contents: style([
    parts.size("100%", "fit-content"),
    {
      display: "flex",
      flexDirection: "column",
      gap: 5,
    },
  ]),
  label: style([
    {
      display: "flex",
    },
  ]),
  labelAlert: style([
    {
      color: vars.color.red,
      margin: "0 0 0 auto",
    },
  ]),
  input: style([
    parts.size("100%", "3rem"),
    parts.inputFrame,
    {
      // fontSize: "1.2rem",
    },
  ]),
  rowContents: style([
    parts.size("100%", "fit-content"),
    { display: "flex", flexDirection: "row", alignItems: "center", gap: 10 },
  ]),
  dropmenu: style([parts.size(30, 30), parts.inputFrame, parts.flexCenter, {}]),
  button: style([
    parts.size(80, 30),
    parts.flexCenter,
    {
      border: "solid 1px",
      borderColor: vars.color.gray1,
      borderRadius: 5,

      ":hover": {
        background: vars.color.gray1,
        color: vars.color.white,
      },
    },
  ]),
  close: style([
    parts.flexCenter,
    {
      position: "absolute",
      top: "-10px",
      right: "-10px",
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      border: "solid 5px",
      borderColor: vars.color.black,
      background: vars.color.white,
    },
  ]),
  show: style([
    {
      transform: "scale(1)",
    },
  ]),
  hide: style([
    {
      transform: "scale(.9)",
    },
  ]),
  SelectCSS,
  MessageTempCSS,
};

export const AddWatchCSS = {
  wrapper: style([
    parts.flexCenter,
    {
      width: "100%",
      height: "50px",
      overflow: "visible",
      // display: "flex",
      // justifyContent: "center",
    },
  ]),
  button: style([
    parts.flexCenter,
    {
      width: "80%",
      height: "30px",
      color: vars.color.white,
      border: "1px dashed",
      borderColor: vars.color.white,
      margin: "20px",
      transition: "height .5s",
      // zIndex: "5",

      ":hover": {
        background: vars.color.white,
        color: vars.color.black,
        border: "none",
      },
    },
  ]),
  Popup: style([parts.PopBack, {}]),
  showPopup: style([
    {
      opacity: 1,
      pointerEvents: "all",
    },
  ]),
  hidePopup: style([
    {
      opacity: 0,
      pointerEvents: "none",
    },
  ]),

  PopupCSS,
};

export const WatchersCSS = {
  wrapper: style([
    parts.size("100%", "fit-content"),
    {
      // padding: 10,
      marginTop: 10,
      marginBottom: 50,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 15,
    },
  ]),
  card: style([
    parts.size("80%", "fit-content"),
    {
      position: "relative",
      background: vars.color.black2,
      padding: 15,
      display: "flex",
      borderRadius: 5,
      ":hover": {
        background: vars.color.gray1,
      },
    },
  ]),
  name: style([
    {
      fontSize: "1.2rem",
    },
  ]),
  path: style([{}]),
  room: style([
    {
      margin: "0 0 0 auto",
    },
  ]),
  icon: style([parts.iconSize(30), {}]),
  stopOver: style([
    parts.size("100%", "100%"),
    {
      position: "absolute",
      top: 0,
      left: 0,
      overflow: "hidden",
      pointerEvents: "none",
    },
  ]),
  stopText: style([
    parts.size("fit-content", "fit-content"),
    {
      position: "absolute",
      top: 0,
      left: 0,
      whiteSpace: "nowrap",
      fontSize: "3rem",
      // margin: "20px 0 0 285px",
      marginTop: 20,
      marginLeft: 285,
      color: vars.color.white,
      transform: "rotate(10deg)",
      opacity: 0.8,
    },
  ]),
  stopBack: style([
    parts.size("100%", "100%"),
    {
      position: "absolute",
      top: 0,
      left: 0,
      background: vars.color.black,
      opacity: 0.5,
    },
  ]),
};
