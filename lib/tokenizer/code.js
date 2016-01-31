var consume = require('./consumer');
var utils = require('./utils');

module.exports = function handleCode(token, state) {
  var buffer = consume(state);
  var type = token[1] == '-' ? 'unbuffered' : 'buffered';
  var range = buffer.range();
  state.tokens.push(['code-' + type, buffer, token[2], token[3], range[2], range[3]]);
};
