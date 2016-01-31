var comment = require('./comment');
var sws = require('./sws');
var filter = require('./filter');
var code = require('./code');
var utils = require('./utils');

var types = {
  space: sws,
  ':': filter
};

var words = {
  '//': comment,
  '//-': comment,
  '-': code,
  '=': code,
};

exports = module.exports = function(token, tokenizer) {
  var type = token[0];
  return (
    types[type] ||
    (type === 'word' && words[token[1]]) ||
    defaultHandler
  )(token, tokenizer);
};

exports.end = function(tokenizer) {
  sws.end(tokenizer);
};

function defaultHandler(token, tokenizer) {
  tokenizer.push(token);
};
