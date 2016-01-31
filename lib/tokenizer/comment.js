var consume = require('./consumer');
var utils = require('./utils');

module.exports = function handleComment(token, tokenizer) {
  var chunk = consume(tokenizer);
  var comment = '/*' + chunk.toString() + '*/';
  var range = chunk.range();

  tokenizer.push(['comment', comment, token[2], token[3], range[2], range[3]], ['space', '\n']);
};
