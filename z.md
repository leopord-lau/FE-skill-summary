## 实现map方法

### 1. 使用循环实现
```js
Array.prototype.myMap = function (fn, context) {
  let array = Array.prototype.slice.call(this);
  let mappedArr = [];
  for (let i = 0; i < array.length; i++) {
    if (!array.hasOwnProperty(i)) continue;

    mappedArr[i] = fn.call(context, array[i], i, this);
  }
  return mappedArr;
};
```

### 2. 使用`reduce`实现

```js
Array.prototype.myMap = function (fn, context) {
  let array = Array.prototype.slice.call(this);
  return array.reduce((pre, cur, index) => {
    return [...pre, fn.call(context, cur, index, this)];
  }, []);
};
```

## 实现`filter`方法

### 1. 使用循环

