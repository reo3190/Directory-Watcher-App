import { style } from "@vanilla-extract/css";
import * as parts from "../Comp/parts.css";
import { vars } from "../Comp/_theme.css";

export const LogCSS = {
  wrapper: style([
    parts.size("100%", "100vh"),
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  ]),
};

const EditAreaCSS = {
  textarea: style([
    parts.inputFrame,
    {
      resize: "none",
    },
  ]),
  side: style([
    parts.size("100%", "fit-content"),
    {
      display: "flex",
      justifyContent: "end",
      gap: 8,
      // margin: "0 0 0 auto",
    },
  ]),
  check: style([
    {
      color: vars.color.green,
    },
  ]),
  close: style([
    {
      color: vars.color.red,
    },
  ]),
};

const DeletePopCSS = {
  PopBack: style([parts.PopBack, {}]),
  Pop: style([
    parts.size("90%", "fit-content"),
    parts.flexCenter,
    {
      background: vars.color.white,
      color: vars.color.black,
      flexDirection: "column",
      gap: 10,
      borderRadius: 5,
      borderTop: "solid 8px",
      borderColor: vars.color.red,
    },
  ]),
  PopText: style([
    {
      display: "flex",
      alignItems: "center",
      gap: 5,
      margin: 10,
    },
  ]),
  PopIcon: style([
    {
      color: vars.color.red,
    },
  ]),
  PopMessage: style([
    parts.size("95%", "fit-content"),
    {
      whiteSpace: "pre-line",
      padding: "20px 10px",
      border: "solid 1px",
      borderColor: vars.color.gray3,
    },
  ]),
  PopForm: style([
    {
      display: "flex",
      gap: 30,
      margin: 10,
    },
  ]),
  PopButtonRed: style([
    parts.size(80, 30),
    parts.flexCenter,
    {
      border: "solid 1px",
      borderColor: vars.color.red,
      color: vars.color.white,
      background: vars.color.red,
      borderRadius: 5,
      ":hover": {
        background: vars.color.white,
        borderColor: vars.color.red,
        color: vars.color.red,
      },
    },
  ]),
  PopButtonGray: style([
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
};

export const ChatBlockCSS = {
  wrapper: style([
    parts.size("100%", "100%"),
    {
      padding: "15px 20px",
    },
  ]),
  block: style([
    parts.size("100%", "fit-content"),
    {
      minHeight: 90,
      padding: 10,
      display: "flex",
      flexDirection: "column",
      gap: 5,
      position: "relative",
      background: vars.color.gray1,
      borderRadius: "10px 10px 10px 0px",
      ":after": {
        content: "",
        display: "inline-block",
        position: "absolute",
        bottom: -8,
        left: 0,
        border: "8px solid transparent",
        borderRight: "18px solid",
        borderRightColor: vars.color.gray1,
        // -webkit-transform: rotate(35deg);
        transform: "rotate(-180deg)",
      },
    },
  ]),
  onEdit: style([
    {
      background: `${vars.color.gray2} !important`,
      ":after": {
        borderRightColor: `${vars.color.gray2} !important`,
      },
    },
  ]),
  onDelete: style([
    {
      minHeight: 0,
    },
  ]),
  time: style([
    parts.size("100%", "fit-content"),
    {
      display: "flex",
      justifyContent: "flex-end",
      fontSize: "0.9rem",
    },
  ]),
  massage: style([
    parts.size("100%", "fit-content"),
    {
      whiteSpace: "pre-line",
      padding: 5,
      lineHeight: "1.2rem",
    },
  ]),
  deleted: style([{}]),

  EditAreaCSS,
  DeletePopCSS,
};

export const ChatSpaceCSS = {
  icon: style([parts.iconSize(30), {}]),
  chatHead: style([
    parts.size("100%", 40),
    {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 20px",
    },
  ]),
  chatHeadBack: style([
    parts.size("calc(100% - 10px)", 60),
    {
      position: "fixed",
      top: 80,
      left: 0,
      backgroundImage: `linear-gradient(180deg,${vars.color.black}, ${vars.color.black} 60%, rgba(0,0,0,0) 100%)`,
      zIndex: 5,
    },
  ]),
  chat: style([
    parts.size("100vw", "100%"),
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // justifyContent: "flex-end",
      padding: 10,
      overflowY: "auto",
      paddingTop: 140,
      gap: 10,
    },
  ]),
  day: style([
    parts.size("100%", "fit-content"),
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  ]),
  date: style([
    parts.flexCenter,
    {
      position: "sticky",
      top: 0,
      zIndex: 3,
      padding: 5,
      background: "#00000055",

      backdropFilter: "blur(1px)",
      borderRadius: 5,
    },
  ]),
};

const SettingPopCSS = {
  Pop: style([
    parts.size(170, 150),
    parts.flexCenter,
    {
      position: "absolute",
      top: 65,
      right: -10,
      background: vars.color.white,
      color: vars.color.black,
      flexDirection: "column",
      // gap: 10,
      borderRadius: 5,
      // borderTop: "solid 8px",
      // borderColor: "blue",
    },
  ]),
  content: style([
    {
      display: "flex",
      gap: 10,
      alignItems: "center",
    },
  ]),
  label: style([
    {
      margin: 9,
    },
  ]),
  depth: style([parts.size(50, 25), parts.flexCenter, { margin: 9 }]),
  mute: {
    toggle: style([
      parts.size(50, 25),
      {
        position: "relative",
        display: "inline-block",
        margin: 9,
      },
    ]),
    slider: style([
      {
        position: "absolute",
        cursor: "pointer",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: vars.color.gray3,
        transition: ".4s cubic-bezier(0,1,0.5,1)",
        borderRadius: 4,
        ":before": {
          position: "absolute",
          content: "",
          height: 17,
          width: 17,
          left: 4,
          bottom: 4,
          background: vars.color.white,
          transition: ".4s cubic-bezier(0,1,0.5,1)",
          borderRadius: 3,
        },
      },
    ]),
    onSlider: style([
      {
        background: vars.color.green,
        ":before": {
          transform: "translateX(25px)",
        },
      },
    ]),
    input: style([
      parts.size(0, 0),
      {
        opacity: 0,
      },
    ]),
  },
  delete: style([
    parts.size(50, 25),
    parts.flexCenter,
    {
      margin: 9,
      border: "solid 1px",
      borderColor: vars.color.red,
      background: vars.color.red,
      borderRadius: 5,
      color: vars.color.white,
      ":hover": {
        background: vars.color.white,
        // color: vars.color.white,
        color: vars.color.red,

        // borderColor: vars.color.white,
      },
    },
  ]),
  deleteIcon: style([
    {
      // color: vars.color.red,
      // filter: "invert(100%) grayscale(100%) contrast(100)",
    },
  ]),
};

export const LogHeadCSS = {
  head: style([
    parts.size("calc(100% - 10px)", 80),
    {
      position: "absolute",
      top: 0,
      left: 0,
      padding: 10,
      paddingLeft: 20,

      zIndex: 6,
      background: vars.color.black,
    },
  ]),
  headInner: style([
    parts.size("100%", 60),
    {
      position: "relative",
      minHeight: 60,
      display: "flex",
      // flexDirection: "column",
      alignItems: "center",
      gap: 10,
      padding: 10,

      background: vars.color.black2,
      borderRadius: 10,

      transition: "height .3s",
    },
  ]),
  innerOpen: style([parts.size("100%", 60)]),
  headButton: style([
    parts.size(40, 40),
    parts.flexCenter,
    {
      cursor: "pointer",
      borderRadius: "50%",
      ":hover": {
        background: vars.color.gray1,
      },
    },
  ]),
  info: style([
    {
      display: "flex",
      flexDirection: "column",
      gap: 5,
    },
  ]),
  name: style([{ fontSize: "1.2rem" }]),
  path: style([{}]),
  setting: style([
    {
      margin: "0 0 0 auto",
      transition: "transform .2s cubic-bezier(0,1,0.5,1)",
    },
  ]),
  onPop: style([
    {
      transform: "rotate(-30deg)",
    },
  ]),

  SettingPopCSS,
};
