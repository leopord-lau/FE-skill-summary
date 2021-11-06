const program = require('commander');

program.version('0.0.1');

program.option('-d, --debug', 'my debug', '123');

program.parse(process.argv);

// console.info('debug: ', program.debug);
console.info(program.parse(process.argv));
process.exitCode = 1;
