var tokenize = require('postcss/lib/tokenize');
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

module.exports = function(input) {
  var state = {
    inputTokens: tokenize(input),
    tokens: [],
    pos: -1,
    indents: [],
    prev: null,
    next: null,
    inc: function(amount) {
      var pos = state.pos += (amount || 1);
      state.prev = utils.findPrevSignificant(state, pos);
      state.next = utils.findNextSignificant(state, pos);
      state.done = state.inputTokens.length - 1 == pos;
      return state.inputTokens[pos];
    },
    seek: function(amount) {
      return state.inputTokens[state.pos + amount];
    }
  };

  var token = state.inc();
  while (state.pos < state.inputTokens.length) {
    getFn(token)(token, state);
    token = state.inc();
  }

  return state.tokens;
};

function getFn(token) {
  return types[token[0]] || (token[0] == 'word' && words[token[1]]) || function(token, state) {
    state.tokens.push(token);
  };
}
