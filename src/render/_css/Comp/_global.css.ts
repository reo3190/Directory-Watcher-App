import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./_theme.css";

globalStyle("html", {
  fontSize: 12,
});

globalStyle("body", {
  overflow: "hidden",
  background: vars.color.black,
  color: vars.color.white,
});
