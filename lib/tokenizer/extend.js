var consume = require('./consumer');

module.exports = function(token, tokenizer) {
  var prev = tokenizer.seek(-1);

  if (prev && (prev[0] !== 'space' || prev[1].charAt(0) !== '\n')) return tokenizer.push(token);

  var chunk = consume(tokenizer, true);
  chunk.unshift(token);
  var range = chunk.range();
  tokenizer.push(['extend', chunk, range[0], range[1], range[2], range[3]]);
};
