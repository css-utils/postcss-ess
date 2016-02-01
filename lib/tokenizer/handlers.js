var block = require('./block');
var buffered = require('./buffered-code');
var comment = require('./comment');
var control = require('./control-flow');
var extend = require('./extend');
var filter = require('./filter');
var fn = require('./function');
var import_export = require('./import_export');
var sws = require('./sws');
var unbuffered = require('./unbuffered-code');
var utils = require('./utils');
var _var = require('./var');
var _yield = require('./yield');

var types = {
  space: sws,
  ':': filter
};

var words = {
  '-': unbuffered,
  '=': buffered,
  '//': comment,
  '//-': comment,
  '%': extend,
  'block': block,
  'each': control,
  'else': control,
  'elseif': control,
  'export': import_export,
  'for': control,
  'function': fn,
  'if': control,
  'import': import_export,
  'var': _var,
  'yield': _yield
};

exports = module.exports = function(token, tokenizer) {
  var type = token[0];
  return (
    types[type] ||
    (type === 'word' && (words[token[1]] || words[token[1].charAt(0)])) ||
    defaultHandler
  )(token, tokenizer);
};

exports.end = function(tokenizer) {
  sws.end(tokenizer);
};

function defaultHandler(token, tokenizer) {
  tokenizer.push(token);
};
