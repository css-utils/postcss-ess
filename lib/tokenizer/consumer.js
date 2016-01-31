var utils = require('./utils');

module.exports = function(state) {
  var buffer = new Chunk();
  return consumeLine(state, buffer, onEqual.bind(null, buffer), onIndent.bind(null, buffer), onDedent.bind(null, buffer));
};

function consumeLine(state, buffer, onEqual, onIndent, onDedent) {
  while(true) {
    var token = state.inc();
    if (!token) return buffer;
    if (token[0] == 'space' && token[1].charAt(0) == '\n') {
      state.inc(-1);
      return consumeBlock(state, buffer, utils.peek(state.indents), onEqual, onIndent, onDedent);
    }

    buffer.push(token);
  }
}

function consumeBlock(state, buffer, initial, onEqual, onIndent, onDedent) {
  do {
    var token = state.inc();
    if (!token) return buffer;
    if (token[0] == 'space' && token[1].charAt(0) == '\n') utils.handleNewline(token, state, onEqual, onIndent, onDedent);
    else buffer.push(token)
  } while(utils.peek(state.indents) > initial);
  return buffer;
}

function onEqual(buffer, token, state) {
  return buffer.push(token);
}

function onIndent(buffer, token, state) {
  return buffer.push(token);
}

function onDedent(buffer, state) {
  // noop
}

function Chunk() {
  this.tokens = [];
}
Chunk.prototype = {
  push: function() {
    this.tokens.push.apply(this.tokens, arguments);
    return this;
  },
  toString: function() {
    return this.tokens.map(function(token) {
      return token[1];
    }).join('');
  },
  range: function() {
    var first = utils.findNextSignificant(this);
    var last = utils.findPrevSignificant(this);
    return [first[2], first[3], last[4] || last[2], last[5] || last[3]];
  }
};
