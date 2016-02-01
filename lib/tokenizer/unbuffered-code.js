var consume = require('./consumer');
var utils = require('./utils');

module.exports = function handleCode(token, tokenizer) {
  var prev = tokenizer.seek(-1);

  if (prev && (prev[0] !== 'space' || prev[1].charAt(0) !== '\n')) return tokenizer.push(token);

  var chunk = consume(tokenizer);
  var range = chunk.range();
  tokenizer.push(['code-unbuffered', chunk, token[2], token[3], range[2], range[3]]);
};
