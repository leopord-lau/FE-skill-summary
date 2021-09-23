export interface Llement extends Array<any> {
  tagName: string;
  props: Props;
  key: string,
  child_num: number,
  children: Llement | string;
  _render: () => Element;
}

export interface Props {
  key: string
}

export class Llement {
  constructor(tagName: string, props: Props, children: Llement | string) {
    this.tagName = tagName;
    this.props = props;
    this.children = children;
    if(props.key) {
      this.key = props.key;
    }
    let child_num: number = 0;
    (<Llement>children).forEach(function(child: Llement, index: number) {
      if(child instanceof Llement) {
        child_num += child.child_num;
      }
      child_num++;
    });
    this.child_num = child_num;
  }
}

Llement.prototype._render = function () {
  let el: Element = document.createElement(this.tagName);
  let props: Props = this.props;
  for(let name in props) {
    let value: string = props[name];
    el.setAttribute(name, value);
  }

  let children: Llement | string = this.children;
  (<Llement>children).forEach(function(child: Llement | string) {
    let child_el: Element | Text = (child instanceof Llement) ? child._render() : document.createTextNode(child);
    el.appendChild(child_el);
  })
  return el;
}