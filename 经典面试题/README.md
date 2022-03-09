# 面试题整理

## 1、手写Promise
```js
function MyPromise(callback) {
  const pending = "pending";
  const fullfilled = "fullfilled";
  const rejected = "reject";

  this.state = pending;

  this.value = null;

  this.reason = null;

  this.fullfilledCallback = [];
  this.rejectedCallback = [];

  this.resolve = (data) => {
    setTimeout(() => {
      if (this.state == pending) {
        this.state = fullfilled;
        this.value = data;
        this.fullfilledCallback.map((fn) => fn(this.value));
      }
    });
  };

  this.reject = (reason) => {
    setTimeout(() => {
      if (this.state == pending) {
        this.state = rejected;
        this.value = reason;
        this.rejectedCallback.map((fn) => fn(this.value));
      }
    });
  };

  this.then = function (successFn, errorFn) {
    successFn && this.fullfilledCallback.push(successFn);
    errorFn && this.rejectedCallback.push(errorFn);
    return this;
  };

  this.catch = function (errorFn) {
    errorFn && this.rejectedCallback.push(errorFn);
  };

  callback(this.resolve, this.reject);
}
```

## 2、数组柯里化
```js
// 实现
sum(1,3).sumOf()  // 4
sum(1,3)(2,4).sumOf() // 10
```

```js
function sum () {
    var arr = [].slice.apply(arguments);
    const fn = function() {
        arr = arr.concat([].slice.apply(arguments));
        return fn;
    }
    fn.sumOf = function() {
        return arr.reduce((total, val) => total +val, 0)
    }
    return fn;
}
```

## 3、数组扁平化
```js
let list = [1, 5, [9, 8], [2, [1, [9,[[12, 12]]]]], 7];
// 第一种方法：
console.log(list.toString().split(','));

// 第二种方法：
function flatten(list) {
    return list.reduce((prev, item) => {
        return prev.concat(Array.isArray(item) ? flatten(item) : item);
    }, [])
}
```

## 4、数组去重(两次以上去重)
```js
// 已知数组
var arr = [1,1,1,1,1,1,1,3,3,3,3,3,5,5];

// 方法一
function delRepeat(arr){
    arr = arr.sort();
    for(let i=0;i<arr.length;i++){
        if(arr[i] == arr[i+2]){
            arr.splice(i,1);
            i--;
        }
    }
    return arr;
}

// 方法二
function delRepeat(arr){
    var newArr = [];
    var obj = {};
    arr.map(item=>{
        if(obj[item]){
            obj[item] +=1 ;
        }else{
            obj[item] = 1;
        }
        obj[item]<=2?newArr.push(item):''
    })
    return newArr;
}
```

## 5、爬楼梯
```js
/*
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
思路：
f(1) : 1
f(2) : 11 , 2
f(3) : 12, 111, 21
f(4) : 121, 1111, 211, 112, 22
f(n) = f(n-1) + f(n-2)
*/
function fn(n) {
    if (n == 1) return 1;
    if (n == 2) return 2;
    return fn(n - 1) + fn(n - 2);
}
```

