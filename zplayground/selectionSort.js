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
