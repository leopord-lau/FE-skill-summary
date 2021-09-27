import { Llement } from "./llement";

function diff(oldNode: Llement, newNode: Llement): object {
  let index: number = 0;
  // 用于存储差异节点
  let difference: object = {};
  dsfWalk(oldNode, newNode, index, difference);
  return difference;
}

function dsfWalk(oldNode: Llement, newNode: Llement, index: number, difference: object): void {
  // 用于暂时存储差异节点(标记差异类型（文本内容差异，属性差异，节点顺序差异）)
  const diffList: Array<object> = [];
  if((typeof oldNode === "string") && (typeof newNode === "string")) {
    if(newNode !== oldNode) {
      diffList.push({ type: 'text', content: newNode });
    }
  } else if(newNode !== null && oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    // 节点相同，比较标签内的属性
    let diffProps: object | null = getDiffProps(oldNode, newNode);
    if(diffProps) {
      diffList.push({ type: "props", props: diffProps });
    }

    if(!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        difference,
        diffList
      )
    }
  }
}

function diffChildren(oldChildList: Array<Llement | string>, newChildList: Array<Llement| string> , index: number, difference: object, diffList: Array<object>): void {
  let diffMap: diffMap = getDiffList(oldChildList, newChildList, "key");
}

type moveMap = Object & {
  index: number,
  type: number,
  item?: Llement | string
}

type diffMap = Object & {
  moveList: Array<moveMap>,
  children: Array<Llement | string | null>
}

// 新旧节点子节点对比
function getDiffList(oldChildList: Array<Llement | string>, newChildList: Array<Llement | string>, key: string): diffMap {
  let oldMap: KeyIndexAndFree = makeKeyIndexAndFree(oldChildList, key);
  let newMap: KeyIndexAndFree = makeKeyIndexAndFree(newChildList, key);

  // 获取带有key值的所以节点
  let oldKeyIndex: object = oldMap.keyIndex;
  let newKeyIndex: object = newMap.keyIndex;

  let i: number = 0;
  let item: Llement | string;
  let itemKey: string | Function;
  let children: Array<Llement | string | null>;
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
        children.push(null);
      // 新节点中存在key
      // todo 当新节点只是在旧节点中添加了几个节点呢？怎么保证顺序？
      } else {
        let newItemIndex: number = newKeyIndex[itemKey];
        children.push(newChildList[newItemIndex]);
      }
    // 旧节点不存在key，
    // TODO 顺序是不是不对
    } else {
      let freeItem: Llement | string = newFree[freeIndex++];
      children.push(freeItem || null);
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
        // 旧节点中不存在，就直接插入
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
    moveList.push({index: index, type: 0});
  }
  function _removeCopy(index: number): void {
    copyList.splice(index, 1);
  }
  function _insert(index: number, item: Llement | string): void {
    moveList.push({index: index, item: item, type: 1});
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

// 将有key标识的节点跟无key标识的节点数组并返回一个对象
function makeKeyIndexAndFree(list: Array<Llement | string> | string, key: string): KeyIndexAndFree {
  let keyIndex: object = {};
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

function getDiffProps(oldNode: Llement, newNode: Llement): object {
  // 记录不同属性的数量
  let count: number = 0;
  let oldProps: object = oldNode.props;
  let newProps: object = newNode.props;
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

