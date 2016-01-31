var consume = require('./consumer');
var utils = require('./utils');

module.exports = function handleCode(token, tokenizer) {
  var chunk = consume(tokenizer);
  var type = token[1] == '-' ? 'unbuffered' : 'buffered';
  var range = chunk.range();
  tokenizer.push(['code-' + type, chunk, token[2], token[3], range[2], range[3]]);
};
