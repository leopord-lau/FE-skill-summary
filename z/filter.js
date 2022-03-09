Array.prototype.filter = function (fn, context) {
  let array = Array.prototype.slice.call(this);
  let filteredArr = [];
  for (let i = 0; i < array.length; i++) {
    if (!array.hasOwnProperty(i)) continue;

    fn.call(context, array[i], i, this) && filteredArr.push(array[i]);
  }
  return filteredArr;
};
