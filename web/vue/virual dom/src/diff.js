"use strict";
exports.__esModule = true;
var types_1 = require("./types");
// 新旧节点差异比较（文本、属性、子节点）
function diff(oldNode, newNode) {
    var index = 0;
    // 用于存储差异节点
    var difference = {};
    // 深度遍历
    dsfWalk(oldNode, newNode, index, difference);
    return difference;
}
// 深度遍历
function dsfWalk(oldNode, newNode, index, difference) {
    // 用于暂时存储差异节点(标记差异类型（文本内容差异，属性差异，节点顺序差异）)
    var diffList = [];
    if ((typeof oldNode === "string") && (typeof newNode === "string")) {
        // 替换文本
        if (newNode !== oldNode) {
            diffList.push({ type: types_1.domPatch.TEXT, content: newNode });
        }
    }
    else if (newNode !== null && oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
        // 节点相同，比较标签内的属性
        var diffProps = getDiffProps(oldNode, newNode);
        if (diffProps) {
            diffList.push({ type: types_1.domPatch.PROPS, props: diffProps });
        }
        // 子节点比较
        if (!isIgnoreChildren(newNode)) {
            diffChildren(oldNode.children, newNode.children, index, difference, diffList);
        }
    }
    else if (newNode !== null) {
        diffList.push({ type: types_1.domPatch.REPLACE, node: newNode });
    }
    // 记录当前节点的所有差异
    if (diffList.length) {
        difference[index] = diffList;
    }
}
function diffChildren(oldChildList, newChildList, index, difference, diffList) {
    var diffMap = getDiffList(oldChildList, newChildList, "key");
    newChildList = diffMap.children;
    if (diffMap.moveList.length) {
        var reorderPatch = { type: types_1.domPatch.REORDER, moves: diffMap.moveList };
        diffList.push(reorderPatch);
    }
    var leftNode;
    var currentNodeIndex = index;
    oldChildList.forEach(function (child, i) {
        var newChild = newChildList[i];
        currentNodeIndex = (leftNode && leftNode.child_num) ? currentNodeIndex + leftNode.child_num + 1 : currentNodeIndex + 1;
        dsfWalk(child, newChild, currentNodeIndex, difference);
        leftNode = child;
    });
}
// 新旧节点子节点对比
function getDiffList(oldChildList, newChildList, key) {
    var oldMap = markKeyIndexAndFree(oldChildList, key);
    var newMap = markKeyIndexAndFree(newChildList, key);
    // 获取带有key值的节点索引
    var oldKeyIndex = oldMap.keyIndex;
    var newKeyIndex = newMap.keyIndex;
    var i = 0;
    var item;
    var itemKey;
    // 新旧节点差异patch数组
    var children = [];
    // 无key值节点游标
    var freeIndex = 0;
    // 获取新节点中不带key值的所有节点
    var newFree = newMap.free;
    var moveList = [];
    // 循环遍历旧节点
    while (i < oldChildList.length) {
        item = oldChildList[i];
        itemKey = getItemKey(item, key);
        // 旧节点中存在key值
        if (itemKey) {
            // 新节点中不存在这个key，说明被删除了
            if (!newKeyIndex.hasOwnProperty(itemKey)) {
                // null 代表删除
                children.push(null);
                // 新节点中存在key
                // todo 当新节点只是在旧节点中添加了几个节点呢？怎么保证顺序？
            }
            else {
                // 新节点中存在带有这个key的节点，获取这个节点的索引
                var newItemIndex = newKeyIndex[itemKey];
                // TODO 为什么顺序是根据旧节点？
                children.push(newChildList[newItemIndex]);
            }
            // 旧节点不存在key，根据旧节点的个数将新节点逐个添加到数组中，当新节点个数比旧节点多时就会有部分节点未添加到数组中
            // TODO 顺序是不是不对
        }
        else {
            var freeItem = newFree[freeIndex++];
            console.log(freeItem);
            if (freeItem) {
                children.push(freeItem);
            }
            else {
                children.push(null);
            }
        }
        i++;
    }
    var copyList = children.slice(0);
    // 重置
    i = 0;
    // 获取旧节点需要移除的节点数组
    while (i < copyList.length) {
        if (copyList[i] === null) {
            _remove(i);
            _removeCopy(i);
        }
        else {
            i++;
        }
    }
    // 游标，一个用于新节点的子节点，另一个用于旧节点跟新节点对比后获取的节点列表
    var j = i = 0;
    while (i < newChildList.length) {
        item = newChildList[i];
        itemKey = getItemKey(item, key);
        var copyItem = copyList[j];
        var copyItemKey = getItemKey(copyItem, key);
        if (copyItem) {
            if (itemKey === copyItemKey) {
                j++;
            }
            else {
                // 旧节点中不存在，就直接插入(不存在对应的key，也直接添加)
                if (!oldKeyIndex.hasOwnProperty(itemKey)) {
                    _insert(i, item);
                }
                else {
                    var nextItemKey = getItemKey(copyItemKey[j + 1], key);
                    if (nextItemKey === itemKey) {
                        _remove(i);
                        _removeCopy(j);
                        j++;
                    }
                    else {
                        _insert(i, item);
                    }
                }
            }
        }
        else {
            _insert(i, item);
        }
        i++;
    }
    var left = copyList.length - j;
    while (j++ < copyList.length) {
        left--;
        _remove(left + i);
    }
    function _remove(index) {
        moveList.push({ index: index, type: types_1.domPatch.REMOVE });
    }
    function _removeCopy(index) {
        copyList.splice(index, 1);
    }
    function _insert(index, item) {
        moveList.push({ index: index, item: item, type: types_1.domPatch.ADD });
    }
    return {
        moveList: moveList,
        children: children
    };
}
// 返回带有一个有key标识的节点索引跟无key标识的节点数组对象
function markKeyIndexAndFree(list, key) {
    // 保存带key的节点的索引
    var keyIndex = {};
    // 保存不带key的节点数组
    var free = [];
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var itemKey = getItemKey(item, key);
        if (itemKey) {
            // todo 如果key相同怎么处理
            keyIndex[itemKey] = i;
        }
        else {
            free.push(item);
        }
    }
    return {
        keyIndex: keyIndex,
        free: free
    };
}
// 获取虚拟节点中的key
function getItemKey(item, key) {
    if (!item || !key)
        return void 0;
    return typeof key === "string"
        ? item[key]
        : key(item);
}
// 获取新节点中新增或与旧节点不同的属性
function getDiffProps(oldNode, newNode) {
    // 记录不同属性的数量
    var count = 0;
    // 旧节点所有属性
    var oldProps = oldNode.props;
    // 新节点所有属性
    var newProps = newNode.props;
    // 保存新旧节点中不同的属性
    var diffProps = {};
    var key;
    // 遍历旧节点中的所有属性，判断新旧节点中属性情况
    for (key in oldProps) {
        if (newProps[key] !== oldProps[key]) {
            count++;
            diffProps[key] = newProps[key];
        }
    }
    // 新增属性
    for (key in newProps) {
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            diffProps[key] = newProps[key];
        }
    }
    if (count === 0) {
        return null;
    }
    return diffProps;
}
function isIgnoreChildren(node) {
    return (node.props && node.props.hasOwnProperty("ignore"));
}
exports["default"] = diff;
