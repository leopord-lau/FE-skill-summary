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
