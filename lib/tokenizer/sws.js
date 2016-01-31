var isValidProp = require('css-props');
var utils = require('./utils');

exports = module.exports = function handleWhitespace(token, state) {
  if (token[1].charAt(0) != '\n') return handleSpace(token, state);
  utils.handleNewline(token, state, onEqual, onIndent, onDedent);
  if (state.done) {
    var prev = utils.findPrevSignificant(state);
    utils.dedent(state, prev, 0, onDedent);
  }
};

var semicolonBlacklist = {
  ';': true,
  '}': true,
  'comment': true
};

function onEqual(token, state) {
  var prev = state.prev;
  var next = state.next;

  if (prev && !semicolonBlacklist[prev[0]] && next && next[0] !== 'comment') {
    state.tokens.push([';', ';', prev[4] || prev[2], prev[5] || prev[3]]);
  }
  return state.tokens.push(token);
}

var indentBlacklist = {
  ';': true,
  '{': true
};

function onIndent(token, state) {
  var prev = state.prev;

  if (prev && !indentBlacklist[prev[0]]) state.tokens.push(['{', '{', prev[4] || prev[2], prev[5] || prev[3]]);
  return state.tokens.push(token);
}

function onDedent(state) {
  var prev = state.prev;
  var next = state.next;

  state.tokens.push(['space', '\n' + utils.ws(utils.peek(state.indents))]);
  if (!next || next[0] != '}') state.tokens.push(['}', '}', prev[4] || prev[2], prev[5] || prev[3]]);
}

function handleSpace(token, state) {
  var prev = state.prev;
  var next = state.next;
  if (next && next[0] !== '{' && prev && prev[0] == 'word' && isValidProp(prev[1])) state.tokens.push([':', ':', prev[4], prev[5]]);
  state.tokens.push(token);
}
