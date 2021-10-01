import { Llement } from "./llement"
import {  domPatch, moveMap } from "./types";

type walkerType = Object & {
  index: number;
}

function patch(node: Node, patches: object): void {
  let walker: walkerType = { index: domPatch.REPLACE };
  dsfWalk(node, walker, patches);
}

function dsfWalk(node: Node, walker: walkerType, patches: object): void {
  // 获取patch数组
  const currentPatches: Array<moveMap> = patches[walker.index];
  const len: number = node.childNodes ? node.childNodes.length : 0;

  for(let i: number = 0; i < len; i++) {
    let child: Node= node.childNodes[i];
    walker.index++;
    dsfWalk(child, walker, patches);
  }

  if(currentPatches) {
    startPatches(node, currentPatches);
  }
}

function startPatches(node: Node, currentPatches: Array<moveMap>): void {
  currentPatches.forEach(currentPatch => {
    switch (currentPatch.type) {
      case domPatch.REPLACE:
        const newNode = (typeof currentPatch.node === 'string') ? document.createTextNode(currentPatch.node) : currentPatch.node._render();
        node.parentNode.replaceChild(newNode, node);
        break;
      case domPatch.REORDER:
        reorderChildren(node, currentPatch.moves);
        break;
      case domPatch.PROPS:
        setProps(node, currentPatch.props);
        break;
      case domPatch.TEXT:
        node.textContent = currentPatch.content
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}

function reorderChildren(node: Node, moveList: Array<moveMap>): void {
  let staticNodeList: Array<any> = Array.prototype.slice.call(node.childNodes);
  let keyMap: object = {};

  staticNodeList.forEach(node => {
    // 元素节点
    if(node.nodeType === 1) {
      const key: string = (<Element>node).getAttribute('key');
      if(key) {
        keyMap[key] = node;
      }
    }
  })

  moveList.forEach(move => {
    const i: number = move.index;
    // 移除节点
    if(move.type === domPatch.REMOVE) {
      if(staticNodeList[i] === node.childNodes[i]) {
        node.removeChild(node.childNodes[i]);
      }
      staticNodeList.splice(i, 1);
    } else if(move.type === domPatch.ADD) {
      const newNode: Node = keyMap[(<Llement>move.item).key]
        ? keyMap[(<Llement>move.item).key].cloneNode(true)
        : typeof (<string>move.item) === 'string'
          ? document.createTextNode(<string>move.item)
          : (<Llement>move.item)._render();
      
      staticNodeList.splice(i, 0, newNode);
      node.insertBefore(newNode, node.childNodes[i] || null);
    }
  })
}

function setProps(node: Node, props: object): void {
  let key: string;
  for (key in props) {
    if(props[key]) {
     let value: string = props[key];
     setAttr(node, key, value);
    } else {
      (<Element>node).removeAttribute(key);
    }
  }
}

function setAttr(node: Node, key: string, value: string): void {
  switch (key) {
    case "style":
      (<HTMLBaseElement>node).style.cssText = value;
      break;
    case "value":
      let tagName: string = (<Element>node).tagName || '';
      tagName = tagName.toLowerCase();
      if(tagName === 'input' || tagName === 'textarea') {
        (<Element>node).nodeValue = value;
      } else {
        (<Element>node).setAttribute(key, value);
      }
      break;
    default: 
      (<Element>node).setAttribute(key, value);
      break;
  }
}

export default patch;