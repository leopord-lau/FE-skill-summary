import { Leo } from "./leo";

Object.defineProperty(window, "vdom", {
  value: new Leo()
})