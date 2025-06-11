import { style } from "@vanilla-extract/css";
import { vars } from "./_theme.css";

export const flexCenter = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const inputFrame = style([
  {
    border: "solid 1px",
    borderColor: vars.color.gray3,
    borderRadius: 5,
    padding: 5,
  },
]);

export const PopBack = style([
  flexCenter,
  {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    top: "0",
    left: "0",
    backdropFilter: "blur(5px)",
    zIndex: 10,
  },
]);

export const size = (w: string | number, h: string | number) =>
  style([
    {
      width: w,
      height: h,
    },
  ]);

export const iconSize = (w: string | number) =>
  style([
    {
      width: w,
      height: w,
      borderRadius: "50%",
    },
  ]);
