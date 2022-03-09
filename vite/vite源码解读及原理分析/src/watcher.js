const chokidar = require('chokidar');
const path = require('path');

const watcher = chokidar.watch(path.resolve(process.cwd()), {
  ignored: ['**/node_modules/**'],
});

watcher.on('change', (file) => {
  console.log(`file: ${file} has been changed`);
});

watcher.on('add', (file) => {
  console.log(`file: ${file} has been added`);
});

watcher.on('unlink', (file) => {
  console.log(`file: ${file} has been removed`);
});

module.exports = {
  watcher,
};
