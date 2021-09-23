import { Leo } from "./leo.ts";

Object.defineProperty(window, "vdom", {
  value: new Leo()
})