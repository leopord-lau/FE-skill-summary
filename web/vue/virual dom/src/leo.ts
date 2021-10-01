import diff from "./diff";
import { Llement} from "./llement";
import patch from "./patch";
import { Props } from "./types";

export interface Leo {
  $createElement: (tagName: string, props: Props, children: Array<Llement | string>) => Llement;
  _diff: (oldNode: Llement, newNode: Llement) => object;
  _patch: (node: Node, patches: object) => void;
}

export class Leo{
}

Leo.prototype.$createElement = (tagName: string, props: Props, children: Array<Llement | string>): Llement => {
  return new Llement(tagName, props, children);
}

Leo.prototype._diff = diff;

Leo.prototype._patch = patch;