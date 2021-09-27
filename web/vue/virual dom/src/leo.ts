import { Llement, Props } from "./llement";

export interface Leo {
  $createElement: (tagName: string, props: Props, children: Array<Llement | string>) => Llement;
}

export class Leo{}

Leo.prototype.$createElement = (tagName: string, props: Props, children: Array<Llement | string>): Llement => {
  return new Llement(tagName, props, children);
}
