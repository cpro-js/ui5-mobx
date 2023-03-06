require('ts-node').register({
  compilerOptions: {
    module: 'commonjs'
  }
});

module.exports = require('./karma.conf.ts');
