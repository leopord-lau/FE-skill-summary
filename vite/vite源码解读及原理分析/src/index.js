const path = require('path');
const fs = require('fs');
const file = path.resolve(process.cwd(), 'watcher.js');

function isFileReadable(file) {
  try {
    fs.accessSync(file, fs.constants.F_OK);
    console.log(fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

console.log(isFileReadable(file));
