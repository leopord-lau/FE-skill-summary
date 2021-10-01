/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/diff.js":
/*!*********************!*\
  !*** ./src/diff.js ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nexports.__esModule = true;\r\nvar types_1 = __webpack_require__(/*! ./types */ \"./src/types.js\");\r\n// 新旧节点差异比较（文本、属性、子节点）\r\nfunction diff(oldNode, newNode) {\r\n    var index = 0;\r\n    // 用于存储差异节点\r\n    var difference = {};\r\n    // 深度遍历\r\n    dsfWalk(oldNode, newNode, index, difference);\r\n    return difference;\r\n}\r\n// 深度遍历\r\nfunction dsfWalk(oldNode, newNode, index, difference) {\r\n    // 用于暂时存储差异节点(标记差异类型（文本内容差异，属性差异，节点顺序差异）)\r\n    var diffList = [];\r\n    if ((typeof oldNode === \"string\") && (typeof newNode === \"string\")) {\r\n        // 替换文本\r\n        if (newNode !== oldNode) {\r\n            diffList.push({ type: types_1.domPatch.TEXT, content: newNode });\r\n        }\r\n    }\r\n    else if (newNode !== null && oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {\r\n        // 节点相同，比较标签内的属性\r\n        var diffProps = getDiffProps(oldNode, newNode);\r\n        if (diffProps) {\r\n            diffList.push({ type: types_1.domPatch.PROPS, props: diffProps });\r\n        }\r\n        // 子节点比较\r\n        if (!isIgnoreChildren(newNode)) {\r\n            diffChildren(oldNode.children, newNode.children, index, difference, diffList);\r\n        }\r\n    }\r\n    else if (newNode !== null) {\r\n        diffList.push({ type: types_1.domPatch.REPLACE, node: newNode });\r\n    }\r\n    // 记录当前节点的所有差异\r\n    if (diffList.length) {\r\n        difference[index] = diffList;\r\n    }\r\n}\r\nfunction diffChildren(oldChildList, newChildList, index, difference, diffList) {\r\n    var diffMap = getDiffList(oldChildList, newChildList, \"key\");\r\n    newChildList = diffMap.children;\r\n    if (diffMap.moveList.length) {\r\n        var reorderPatch = { type: types_1.domPatch.REORDER, moves: diffMap.moveList };\r\n        diffList.push(reorderPatch);\r\n    }\r\n    var leftNode;\r\n    var currentNodeIndex = index;\r\n    oldChildList.forEach(function (child, i) {\r\n        var newChild = newChildList[i];\r\n        currentNodeIndex = (leftNode && leftNode.child_num) ? currentNodeIndex + leftNode.child_num + 1 : currentNodeIndex + 1;\r\n        dsfWalk(child, newChild, currentNodeIndex, difference);\r\n        leftNode = child;\r\n    });\r\n}\r\n// 新旧节点子节点对比\r\nfunction getDiffList(oldChildList, newChildList, key) {\r\n    var oldMap = markKeyIndexAndFree(oldChildList, key);\r\n    var newMap = markKeyIndexAndFree(newChildList, key);\r\n    // 获取带有key值的节点索引\r\n    var oldKeyIndex = oldMap.keyIndex;\r\n    var newKeyIndex = newMap.keyIndex;\r\n    var i = 0;\r\n    var item;\r\n    var itemKey;\r\n    // 新旧节点差异patch数组\r\n    var children = [];\r\n    // 无key值节点游标\r\n    var freeIndex = 0;\r\n    // 获取新节点中不带key值的所有节点\r\n    var newFree = newMap.free;\r\n    var moveList = [];\r\n    // 循环遍历旧节点\r\n    while (i < oldChildList.length) {\r\n        item = oldChildList[i];\r\n        itemKey = getItemKey(item, key);\r\n        // 旧节点中存在key值\r\n        if (itemKey) {\r\n            // 新节点中不存在这个key，说明被删除了\r\n            if (!newKeyIndex.hasOwnProperty(itemKey)) {\r\n                // null 代表删除\r\n                children.push(null);\r\n                // 新节点中存在key\r\n                // todo 当新节点只是在旧节点中添加了几个节点呢？怎么保证顺序？\r\n            }\r\n            else {\r\n                // 新节点中存在带有这个key的节点，获取这个节点的索引\r\n                var newItemIndex = newKeyIndex[itemKey];\r\n                // TODO 为什么顺序是根据旧节点？\r\n                children.push(newChildList[newItemIndex]);\r\n            }\r\n            // 旧节点不存在key，根据旧节点的个数将新节点逐个添加到数组中，当新节点个数比旧节点多时就会有部分节点未添加到数组中\r\n            // TODO 顺序是不是不对\r\n        }\r\n        else {\r\n            var freeItem = newFree[freeIndex++];\r\n            console.log(freeItem);\r\n            if (freeItem) {\r\n                children.push(freeItem);\r\n            }\r\n            else {\r\n                children.push(null);\r\n            }\r\n        }\r\n        i++;\r\n    }\r\n    var copyList = children.slice(0);\r\n    // 重置\r\n    i = 0;\r\n    // 获取旧节点需要移除的节点数组\r\n    while (i < copyList.length) {\r\n        if (copyList[i] === null) {\r\n            _remove(i);\r\n            _removeCopy(i);\r\n        }\r\n        else {\r\n            i++;\r\n        }\r\n    }\r\n    // 游标，一个用于新节点的子节点，另一个用于旧节点跟新节点对比后获取的节点列表\r\n    var j = i = 0;\r\n    while (i < newChildList.length) {\r\n        item = newChildList[i];\r\n        itemKey = getItemKey(item, key);\r\n        var copyItem = copyList[j];\r\n        var copyItemKey = getItemKey(copyItem, key);\r\n        if (copyItem) {\r\n            if (itemKey === copyItemKey) {\r\n                j++;\r\n            }\r\n            else {\r\n                // 旧节点中不存在，就直接插入(不存在对应的key，也直接添加)\r\n                if (!oldKeyIndex.hasOwnProperty(itemKey)) {\r\n                    _insert(i, item);\r\n                }\r\n                else {\r\n                    var nextItemKey = getItemKey(copyItemKey[j + 1], key);\r\n                    if (nextItemKey === itemKey) {\r\n                        _remove(i);\r\n                        _removeCopy(j);\r\n                        j++;\r\n                    }\r\n                    else {\r\n                        _insert(i, item);\r\n                    }\r\n                }\r\n            }\r\n        }\r\n        else {\r\n            _insert(i, item);\r\n        }\r\n        i++;\r\n    }\r\n    var left = copyList.length - j;\r\n    while (j++ < copyList.length) {\r\n        left--;\r\n        _remove(left + i);\r\n    }\r\n    function _remove(index) {\r\n        moveList.push({ index: index, type: types_1.domPatch.REMOVE });\r\n    }\r\n    function _removeCopy(index) {\r\n        copyList.splice(index, 1);\r\n    }\r\n    function _insert(index, item) {\r\n        moveList.push({ index: index, item: item, type: types_1.domPatch.ADD });\r\n    }\r\n    return {\r\n        moveList: moveList,\r\n        children: children\r\n    };\r\n}\r\n// 返回带有一个有key标识的节点索引跟无key标识的节点数组对象\r\nfunction markKeyIndexAndFree(list, key) {\r\n    // 保存带key的节点的索引\r\n    var keyIndex = {};\r\n    // 保存不带key的节点数组\r\n    var free = [];\r\n    for (var i = 0, len = list.length; i < len; i++) {\r\n        var item = list[i];\r\n        var itemKey = getItemKey(item, key);\r\n        if (itemKey) {\r\n            // todo 如果key相同怎么处理\r\n            keyIndex[itemKey] = i;\r\n        }\r\n        else {\r\n            free.push(item);\r\n        }\r\n    }\r\n    return {\r\n        keyIndex: keyIndex,\r\n        free: free\r\n    };\r\n}\r\n// 获取虚拟节点中的key\r\nfunction getItemKey(item, key) {\r\n    if (!item || !key)\r\n        return void 0;\r\n    return typeof key === \"string\"\r\n        ? item[key]\r\n        : key(item);\r\n}\r\n// 获取新节点中新增或与旧节点不同的属性\r\nfunction getDiffProps(oldNode, newNode) {\r\n    // 记录不同属性的数量\r\n    var count = 0;\r\n    // 旧节点所有属性\r\n    var oldProps = oldNode.props;\r\n    // 新节点所有属性\r\n    var newProps = newNode.props;\r\n    // 保存新旧节点中不同的属性\r\n    var diffProps = {};\r\n    var key;\r\n    // 遍历旧节点中的所有属性，判断新旧节点中属性情况\r\n    for (key in oldProps) {\r\n        if (newProps[key] !== oldProps[key]) {\r\n            count++;\r\n            diffProps[key] = newProps[key];\r\n        }\r\n    }\r\n    // 新增属性\r\n    for (key in newProps) {\r\n        if (!oldProps.hasOwnProperty(key)) {\r\n            count++;\r\n            diffProps[key] = newProps[key];\r\n        }\r\n    }\r\n    if (count === 0) {\r\n        return null;\r\n    }\r\n    return diffProps;\r\n}\r\nfunction isIgnoreChildren(node) {\r\n    return (node.props && node.props.hasOwnProperty(\"ignore\"));\r\n}\r\nexports.default = diff;\r\n\n\n//# sourceURL=webpack:///./src/diff.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nexports.__esModule = true;\r\nvar leo_1 = __webpack_require__(/*! ./leo */ \"./src/leo.js\");\r\nObject.defineProperty(window, \"vdom\", {\r\n    value: new leo_1.Leo()\r\n});\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/leo.js":
/*!********************!*\
  !*** ./src/leo.js ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nexports.__esModule = true;\r\nvar diff_1 = __webpack_require__(/*! ./diff */ \"./src/diff.js\");\r\nvar llement_1 = __webpack_require__(/*! ./llement */ \"./src/llement.js\");\r\nvar patch_1 = __webpack_require__(/*! ./patch */ \"./src/patch.js\");\r\nvar Leo = /** @class */ (function () {\r\n    function Leo() {\r\n    }\r\n    return Leo;\r\n}());\r\nexports.Leo = Leo;\r\nLeo.prototype.$createElement = function (tagName, props, children) {\r\n    return new llement_1.Llement(tagName, props, children);\r\n};\r\nLeo.prototype._diff = diff_1[\"default\"];\r\nLeo.prototype._patch = patch_1[\"default\"];\r\n\n\n//# sourceURL=webpack:///./src/leo.js?");

/***/ }),

/***/ "./src/llement.js":
/*!************************!*\
  !*** ./src/llement.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nexports.__esModule = true;\r\nvar Llement = /** @class */ (function () {\r\n    function Llement(tagName, props, children) {\r\n        this.tagName = tagName;\r\n        this.props = props;\r\n        this.children = children;\r\n        if (props.key) {\r\n            this.key = props.key;\r\n        }\r\n        var child_num = 0;\r\n        children.forEach(function (child, index) {\r\n            if (child instanceof Llement) {\r\n                child_num += child.child_num;\r\n            }\r\n            child_num++;\r\n        });\r\n        this.child_num = child_num;\r\n    }\r\n    return Llement;\r\n}());\r\nexports.Llement = Llement;\r\nLlement.prototype._render = function () {\r\n    var el = document.createElement(this.tagName);\r\n    var props = this.props;\r\n    for (var name_1 in props) {\r\n        var value = props[name_1];\r\n        el.setAttribute(name_1, value);\r\n    }\r\n    var children = this.children;\r\n    children.forEach(function (child) {\r\n        var child_el = (child instanceof Llement) ? child._render() : document.createTextNode(child);\r\n        el.appendChild(child_el);\r\n    });\r\n    return el;\r\n};\r\n\n\n//# sourceURL=webpack:///./src/llement.js?");

/***/ }),

/***/ "./src/patch.js":
/*!**********************!*\
  !*** ./src/patch.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nexports.__esModule = true;\r\nvar types_1 = __webpack_require__(/*! ./types */ \"./src/types.js\");\r\nfunction patch(node, patches) {\r\n    var walker = { index: types_1.domPatch.REPLACE };\r\n    dsfWalk(node, walker, patches);\r\n}\r\nfunction dsfWalk(node, walker, patches) {\r\n    // 获取patch数组\r\n    var currentPatches = patches[walker.index];\r\n    var len = node.childNodes ? node.childNodes.length : 0;\r\n    for (var i = 0; i < len; i++) {\r\n        var child = node.childNodes[i];\r\n        walker.index++;\r\n        dsfWalk(child, walker, patches);\r\n    }\r\n    if (currentPatches) {\r\n        startPatches(node, currentPatches);\r\n    }\r\n}\r\nfunction startPatches(node, currentPatches) {\r\n    currentPatches.forEach(function (currentPatch) {\r\n        switch (currentPatch.type) {\r\n            case types_1.domPatch.REPLACE:\r\n                var newNode = (typeof currentPatch.node === 'string') ? document.createTextNode(currentPatch.node) : currentPatch.node._render();\r\n                node.parentNode.replaceChild(newNode, node);\r\n                break;\r\n            case types_1.domPatch.REORDER:\r\n                reorderChildren(node, currentPatch.moves);\r\n                break;\r\n            case types_1.domPatch.PROPS:\r\n                setProps(node, currentPatch.props);\r\n                break;\r\n            case types_1.domPatch.TEXT:\r\n                node.textContent = currentPatch.content;\r\n                break;\r\n            default:\r\n                throw new Error('Unknown patch type ' + currentPatch.type);\r\n        }\r\n    });\r\n}\r\nfunction reorderChildren(node, moveList) {\r\n    var staticNodeList = Array.prototype.slice.call(node.childNodes);\r\n    console.log(staticNodeList);\r\n    var keyMap = {};\r\n    staticNodeList.forEach(function (node) {\r\n        // 元素节点\r\n        if (node.nodeType === 1) {\r\n            var key = node.getAttribute('key');\r\n            if (key) {\r\n                keyMap[key] = node;\r\n            }\r\n        }\r\n    });\r\n    moveList.forEach(function (move) {\r\n        var i = move.index;\r\n        // 移除节点\r\n        if (move.type === types_1.domPatch.REMOVE) {\r\n            console.log('hihihihihihi');\r\n            console.log(staticNodeList[i]);\r\n            console.log(node.childNodes[i]);\r\n            if (staticNodeList[i] === node.childNodes[i]) {\r\n                console.log('remove this');\r\n                node.removeChild(node.childNodes[i]);\r\n            }\r\n            staticNodeList.splice(i, 1);\r\n        }\r\n        else if (move.type === types_1.domPatch.ADD) {\r\n            var newNode = keyMap[move.item.key]\r\n                ? keyMap[move.item.key].cloneNode(true)\r\n                : typeof move.item === 'string'\r\n                    ? document.createTextNode(move.item)\r\n                    : move.item._render();\r\n            staticNodeList.splice(i, 0, newNode);\r\n            node.insertBefore(newNode, node.childNodes[i] || null);\r\n        }\r\n    });\r\n}\r\nfunction setProps(node, props) {\r\n    var key;\r\n    for (key in props) {\r\n        if (props[key]) {\r\n            var value = props[key];\r\n            setAttr(node, key, value);\r\n        }\r\n        else {\r\n            node.removeAttribute(key);\r\n        }\r\n    }\r\n}\r\nfunction setAttr(node, key, value) {\r\n    switch (key) {\r\n        case \"style\":\r\n            node.style.cssText = value;\r\n            break;\r\n        case \"value\":\r\n            var tagName = node.tagName || '';\r\n            tagName = tagName.toLowerCase();\r\n            if (tagName === 'input' || tagName === 'textarea') {\r\n                node.nodeValue = value;\r\n            }\r\n            else {\r\n                node.setAttribute(key, value);\r\n            }\r\n            break;\r\n        default:\r\n            node.setAttribute(key, value);\r\n            break;\r\n    }\r\n}\r\nexports.default = patch;\r\n\n\n//# sourceURL=webpack:///./src/patch.js?");

/***/ }),

/***/ "./src/types.js":
/*!**********************!*\
  !*** ./src/types.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nexports.__esModule = true;\r\nexports.domPatch = {\r\n    REPLACE: 0,\r\n    REORDER: 1,\r\n    PROPS: 2,\r\n    TEXT: 3,\r\n    REMOVE: 4,\r\n    ADD: 5\r\n};\r\n\n\n//# sourceURL=webpack:///./src/types.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;