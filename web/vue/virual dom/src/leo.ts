import { Llement, Props } from "./llement.ts";

export interface Leo {
  $createElement: (tagName: string, props: Props, children: Llement | string) => Llement;
}

export class Leo{}

Leo.prototype.$createElement = (tagName: string, props: Props, children: Llement | string): Llement => {
  return new Llement(tagName, props, children);
}
