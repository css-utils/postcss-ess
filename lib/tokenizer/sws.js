var isValidProp = require('css-props');
var utils = require('./utils');

exports = module.exports = function handleWhitespace(token, tokenizer) {
  if (token[1].charAt(0) !== '\n') return handleSpace(token, tokenizer);
  utils.handleNewline(token, tokenizer, onEqual, onIndent, onDedent);
};

exports.end = function(tokenizer) {
  utils.dedent(tokenizer, tokenizer.prev, 0, onDedent);
};

var semicolonBlacklist = {
  ';': true,
  '}': true,
  'comment': true
};

function onEqual(token, tokenizer) {
  var prev = tokenizer.prev;
  var next = tokenizer.next;

  if (prev && !semicolonBlacklist[prev[0]] && next && next[0] !== 'comment') {
    tokenizer.push([';', ';', prev[4] || prev[2], prev[5] || prev[3]]);
  }
  return tokenizer.push(token);
}

var indentBlacklist = {
  ';': true,
  '{': true
};

function onIndent(token, tokenizer) {
  var prev = tokenizer.prev;

  if (prev && !indentBlacklist[prev[0]]) {
    tokenizer.push(['{', '{', prev[4] || prev[2], prev[5] || prev[3]]);
  }
  return tokenizer.push(token);
}

function onDedent(tokenizer) {
  var next = tokenizer.next;

  tokenizer.push(['space', '\n' + tokenizer.indent()]);

  if (!next || next[0] !== '}') {
    var prev = tokenizer.prev;
    tokenizer.push(['}', '}', prev[4] || prev[2], prev[5] || prev[3]]);
  }
}

function handleSpace(token, tokenizer) {
  var prev = tokenizer.prev;
  var next = tokenizer.next;
  if (next && next[0] !== '{' && prev && prev[0] === 'word' && isValidProp(prev[1])) {
    tokenizer.push([':', ':', prev[4], prev[5]]);
  }
  tokenizer.push(token);
}
