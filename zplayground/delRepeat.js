var arr = [1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 5, 5];

function delRepeat(arr) {
  return Array.from(new Set(arr));
}

// 去除2次以上

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
