var consume = require('./consumer');
var utils = require('./utils');

module.exports = function handleCode(token, tokenizer) {
  var prev = tokenizer.seek(-1);

  var chunk = consume(tokenizer);
  var range = chunk.range();
  // TODO we probably don't want to always append a ;
  tokenizer.push(['code-buffered', chunk, token[2], token[3], range[2], range[3]], [';', ';', token[2], token[3]]);
};
