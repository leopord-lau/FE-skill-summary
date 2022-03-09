## 数组扁平化
Array的方法flat很多浏览器还未能实现，而且浏览器支持的flat方法不能处理嵌套的数组。写一个flat方法，实现扁平化嵌套数组。

```js
// 最简单的方案
Array.prototype.flat = function (arr) {
  return arr
    .toString()
    .split(',')
    .map((item) => +item);
};

Array.prototype.flat = function (arr) {
  return arr.reduce((prev, item) => {
    return prev.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

```

## 数组去重

对于去除1次以上的重复item，可以使用`Set`。
```js
function delRepeat(arr) {
  return Array.from(new Set(arr));
}
```

但是去除2次以上就不能用`set`了。
```js
// 已知数组
var arr = [1,1,1,1,1,1,1,3,3,3,3,3,5,5];

// 方法一
function delRepeat(arr) {
  arr = arr.sort();
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == arr[i + 2]) {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
}

// 方法二
function delRepeat(arr) {
  var newArr = [];
  var obj = {};
  arr.map((item) => {
    if (obj[item]) {
      obj[item] += 1;
    } else {
      obj[item] = 1;
    }
    obj[item] <= 2 ? newArr.push(item) : '';
  });
  return newArr;
}

```


## 选择排序

首先在未排序的数列中找到最小(or最大)元素，然后将其存放到数列的起始位置；接着，再从剩余未排序的元素中继续寻找最小(or最大)元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

```js
function selectionSort(array) {
  const length = array.length;
  let minIndex, temp;

  for (let i = 0; i < length - 1; i++) {
    minIndex = i;
    // 从i后边开始找到最小的数的索引，然后交换
    for (let j = i + 1; j < length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    temp = array[i];
    array[i] = array[minIndex];
    array[minIndex] = temp;
  }
  return array;
}
```