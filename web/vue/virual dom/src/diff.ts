import { Llement } from "./llement";
import { domPatch } from "./patch";
import { moveMap, diffMap } from "./types";


// 新旧节点差异比较（文本、属性、子节点）
function diff(oldNode: Llement, newNode: Llement): object {
  let index: number = 0;
  // 用于存储差异节点
  let difference: object = {};
  // 深度遍历
  dsfWalk(oldNode, newNode, index, difference);
  return difference;
}

// 深度遍历
function dsfWalk(oldNode: Llement | string, newNode: Llement | string, index: number, difference: object): void {
  // 用于暂时存储差异节点(标记差异类型（文本内容差异，属性差异，节点顺序差异）)
  const diffList: Array<moveMap> = [];
  if((typeof oldNode === "string") && (typeof newNode === "string")) {
    // 替换文本
    if(newNode !== oldNode) {
      diffList.push({ type: domPatch.TEXT, content: newNode });
    }
  
  } else if(newNode !== null && (<Llement>oldNode).tagName === (<Llement>newNode).tagName && (<Llement>oldNode).key === (<Llement>newNode).key) {
    // 节点相同，比较标签内的属性
    let diffProps: object | null = getDiffProps(<Llement>oldNode, <Llement>newNode);
    if(diffProps) {
      diffList.push({ type: domPatch.PROPS, props: diffProps });
    }

    // 子节点比较
    if(!isIgnoreChildren(<Llement>newNode)) {
      diffChildren(
        (<Llement>oldNode).children,
        (<Llement>newNode).children,
        index,
        difference,
        diffList
      )
    }
  } else if(newNode !== null) {
    diffList.push({type: domPatch.REPLACE, node: <Llement>newNode});
  }

  // 记录当前节点的所有差异
  if(diffList.length) {
    difference[index] = diffList;
  }
}

function diffChildren(oldChildList: Array<Llement | string>, newChildList: Array<Llement| string> , index: number, difference: object, diffList: Array<moveMap>): void {
  let diffMap: diffMap = getDiffList(oldChildList, newChildList, "key");
  newChildList = diffMap.children;
  
  if(diffMap.moveList.length) {
    let reorderPatch: moveMap = { type: domPatch.REORDER, moves: diffMap.moveList };
    diffList.push(reorderPatch);
  }

  let leftNode: Llement | string;
  let currentNodeIndex: number = index;

  oldChildList.forEach((child, i) => {
    let newChild: Llement | string = newChildList[i];
    currentNodeIndex = (leftNode && (<Llement>leftNode).child_num) ? currentNodeIndex + (<Llement>leftNode).child_num + 1 : currentNodeIndex + 1;
    dsfWalk(child, newChild, currentNodeIndex, difference);
    leftNode = child;
  })

}

// 新旧节点子节点对比
function getDiffList(oldChildList: Array<Llement | string>, newChildList: Array<Llement | string>, key: string): diffMap {
  let oldMap: KeyIndexAndFree = markKeyIndexAndFree(oldChildList, key);
  let newMap: KeyIndexAndFree = markKeyIndexAndFree(newChildList, key);

  // 获取带有key值的节点索引
  let oldKeyIndex: object = oldMap.keyIndex;
  let newKeyIndex: object = newMap.keyIndex;

  let i: number = 0;
  let item: Llement | string;
  let itemKey: string | Function;
  // 新旧节点差异patch数组
  let children: Array<Llement | string | null> = [];
  
  // 无key值节点游标
  let freeIndex: number = 0;
  // 获取新节点中不带key值的所有节点
  let newFree: Array<Llement | string> = newMap.free;
  let moveList:Array<moveMap> = [];
  
  // 循环遍历旧节点
  while(i < oldChildList.length) {
    item = oldChildList[i];
    itemKey = getItemKey(item, key);
    // 旧节点中存在key值
    if(itemKey) {
      // 新节点中不存在这个key，说明被删除了
      if(!newKeyIndex.hasOwnProperty(itemKey)) {
        // null 代表删除
        children.push(null);
      // 新节点中存在key
      // todo 当新节点只是在旧节点中添加了几个节点呢？怎么保证顺序？
      } else {
        // 新节点中存在带有这个key的节点，获取这个节点的索引
        let newItemIndex: number = newKeyIndex[itemKey];
        // TODO 为什么顺序是根据旧节点？
        children.push(newChildList[newItemIndex]);
      }
    // 旧节点不存在key，根据旧节点的个数将新节点逐个添加到数组中，当新节点个数比旧节点多时就会有部分节点未添加到数组中
    // TODO 顺序是不是不对
    } else {
      let freeItem: Llement | string = newFree[freeIndex++];
      console.log(freeItem);
      if(freeItem) {
        children.push(freeItem);
      } else {
        children.push(null);
      }
    }
    i++;
  }

  let copyList: Array<Llement | string | null> = children.slice(0);
  // 重置
  i = 0;
  // 获取旧节点需要移除的节点数组
  while(i < copyList.length) {
    if(copyList[i] === null) {
      _remove(i);
      _removeCopy(i);
    } else {
      i++;
    }
  }

  // 游标，一个用于新节点的子节点，另一个用于旧节点跟新节点对比后获取的节点列表
  let j: number = i = 0;

  while(i < newChildList.length) {
    item = newChildList[i];
    itemKey = getItemKey(item, key);

    let copyItem: Llement | string = copyList[j];
    let copyItemKey: string = getItemKey(copyItem, key);

    if(copyItem) {
      if(itemKey === copyItemKey) {
        j++;
      } else {
        // 旧节点中不存在，就直接插入(不存在对应的key，也直接添加)
        if(!oldKeyIndex.hasOwnProperty(itemKey)) {
          _insert(i, item);
        } else {
          let nextItemKey: string = getItemKey(copyItemKey[j + 1], key);
          if(nextItemKey === itemKey) {
            _remove(i);
            _removeCopy(j);
            j++;
          } else {
            _insert(i, item);
          }
        }
      }
    } else {
      _insert(i, item);
    }
    i++;
  }

  let left: number = copyList.length - j;
  while(j++ < copyList.length) {
    left--;
    _remove(left + i);
  }


  function _remove(index: number): void {
    moveList.push({index: index, type: domPatch.REMOVE});
  }
  function _removeCopy(index: number): void {
    copyList.splice(index, 1);
  }
  function _insert(index: number, item: Llement | string): void {
    moveList.push({index: index, item: item, type: domPatch.ADD});
  }
  
  return {
    moveList: moveList,
    children: children
  }
}






type KeyIndexAndFree = Object & {
  keyIndex: object,
  free: Array<Llement | string>
}

// 返回带有一个有key标识的节点索引跟无key标识的节点数组对象
function markKeyIndexAndFree(list: Array<Llement | string> | string, key: string): KeyIndexAndFree {
  // 保存带key的节点的索引
  let keyIndex: object = {};
  // 保存不带key的节点数组
  let free: Array<Llement| string> = [];

  for(let i: number = 0, len: number = list.length; i < len; i++) {
    let item: Llement | string = list[i];
    let itemKey: string | undefined = getItemKey(item, key);
    if(itemKey) {
      // todo 如果key相同怎么处理
      keyIndex[itemKey] = i;
    } else {
      free.push(item);
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

// 获取虚拟节点中的key
function getItemKey(item: Llement | string, key: string | Function): string | undefined {
  if(!item || !key) return void 0;
  return typeof key === "string"
    ? item[key]
    : key(item)
}

// 获取新节点中新增或与旧节点不同的属性
function getDiffProps(oldNode: Llement, newNode: Llement): object {
  // 记录不同属性的数量
  let count: number = 0;
  // 旧节点所有属性
  let oldProps: object = oldNode.props;
  // 新节点所有属性
  let newProps: object = newNode.props;
  // 保存新旧节点中不同的属性
  let diffProps: object = {};
  let key: string;

  // 遍历旧节点中的所有属性，判断新旧节点中属性情况
  for(key in oldProps) {
    if(newProps[key] !== oldProps[key]) {
      count++;
      diffProps[key] = newProps[key];
    }
  }

  // 新增属性
  for(key in newProps) {
    if(!oldProps.hasOwnProperty(key)) {
      count++;
      diffProps[key] = newProps[key];
    }
  }

  if(count === 0) {
    return null;
  }
  return diffProps;
}


function isIgnoreChildren(node: Llement): boolean {
  return (node.props && node.props.hasOwnProperty("ignore"));
}


export default diff;