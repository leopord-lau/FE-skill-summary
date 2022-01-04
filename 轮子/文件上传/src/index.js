// 图片宽高限制
let IMG_WIDTH_LIMIT;
let IMG_HEIGHT_LIMIT;

function isImage(file) {
  return this.isGif(file) && this.isPng(file) && this.isJpg(file)
  // 在图片16进制中，固定位置的几个数据是固定的（图片格式，图片宽高），判断真假（用户通过直接修改后缀.jpg这种）图片
}

async function isGif(file) {
  const ret = await blobToString(file.slice(0, 6)) // 将Blob格式转换成string形式进行16进制的匹配
  const isgif = (ret === '47 49 46 38 39 61') || (ret === '47 49 46 38 37 61'); // 数据位置及数值固定，只需要进行匹配就可以判断是否是gif文件
  if (isgif) {
    const { w, h } = await getRectByOffset(file, [6, 8], [8, 10], true) // 计算图片宽高
    if (w > IMG_WIDTH_LIMIT || h > IMG_HEIGHT_LIMIT) { // 可以设置上传的图片规格
      // 不满足条件
      return false
    }
  }
  return isgif;
}

async function isPngisPng(file) { // 同理
  const ret = await blobToString(file.slice(0, 8));
  const ispng = ret === '89 50 4E 47 0D 0A 1A 0A';
  if (ispng) {
    const { w, h } = await getRectByOffset(file, [18, 20], [22, 24]); 
    if (w > IMG_WIDTH_LIMIT || h > IMG_HEIGHT_LIMIT) {
      // 不满足条件
      return false;
    }
  }
  return ispng;
}


async function isJpg(file) { // 同理
  // jpg开头两个是 FF D8
  // 结尾两个是 FF D9
  const len = file.size;
  const start = await this.blobToString(file.slice(0, 2));
  const tail = await this.blobToString(file.slice(-2, len));
  const isjpg = start === 'FF D8' && tail === 'FF D9'
  if (isjpg) {
    const heightStart = parseInt('A3', 16);
    const widthStart = parseInt('A5', 16);
    const { w, h } = await getRectByOffset(file, [widthStart, widthStart + 2], [heightStart, heightStart + 2]);
    if (w > IMG_WIDTH_LIMIT || h > IMG_HEIGHT_LIMIT) {
      // 不满足条件
      return false;
    }
  }
  return isjpg;
}

function blobToString(blob) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function() {
      const ret = reader.result.split('')
      .map(v => v.charCodeAt()) // 循环返回指定位置的字符的 Unicode 编码
      .map(v => v.toString(16).toUpperCase()) // 返回十六进制格式
      .map(v => v.padStart(2, '0')) // 给空的那个填充 00 ，防止空缺
      .join(' '); // 每个子节之间空格隔开
      resolve(ret);
    }
    reader.readAsBinaryString(blob); // 调用之后触发onload事件
    
  })
}

async function getRectByOffset(file, widthOffset, heightOffset, reverse) {
  let width = await blobToString(file.slice(...widthOffset))
  let height = await blobToString(file.slice(...heightOffset))

  if (reverse) {
    // 比如gif 的宽，6和7 是反着排的 大小端存储
    // 比如6位是89，7位是02， gif就是 0289 而不是8920的值 切分后翻转一下
    width = [width.slice(3, 5), width.slice(0, 2)].join(' ')
    height = [height.slice(3, 5), height.slice(0, 2)].join(' ')
  }
  const w = parseInt(width.replace(' ', ''), 16)
  const h = parseInt(height.replace(' ', ''), 16)
  return { w, h }
}