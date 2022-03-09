Array.prototype.myMap = function (fn, context) {
  let array = Array.prototype.slice.call(this);
  let mappedArr = Array();
  console.log(array);
  console.log(mappedArr);
  for (let i = 0; i < array.length; i++) {
    if (!array.hasOwnProperty(i)) continue;

    mappedArr[i] = fn.call(context, array[i], i, this);
  }
  return mappedArr;
};

Array.prototype.myMap = function (fn, context) {
  let array = Array.prototype.slice.call(this);
  return array.reduce((pre, cur, index) => {
    return [...pre, fn.call(context, cur, index, this)];
  }, []);
};
