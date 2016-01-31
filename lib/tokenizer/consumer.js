var utils = require('./utils');

module.exports = function(tokenizer) {
  var buffer = new Chunk();
  return consumeLine(tokenizer, buffer, onEqual.bind(null, buffer), onIndent.bind(null, buffer), onDedent.bind(null, buffer));
};

function consumeLine(tokenizer, buffer, onEqual, onIndent, onDedent) {
  while(true) {
    var token = tokenizer.inc();
    if (!token) return buffer;
    if (token[0] === 'space' && token[1].charAt(0) === '\n') {
      tokenizer.inc(-1);
      return consumeBlock(tokenizer, buffer, utils.peek(tokenizer.indents), onEqual, onIndent, onDedent);
    }

    buffer.push(token);
  }
}

function consumeBlock(tokenizer, buffer, initial, onEqual, onIndent, onDedent) {
  do {
    var token = tokenizer.inc();
    if (!token) {
      tokenizer.indents = [];
      return buffer;
    }
    if (token[0] === 'space' && token[1].charAt(0) === '\n') utils.handleNewline(token, tokenizer, onEqual, onIndent, onDedent);
    else buffer.push(token)
  } while(utils.peek(tokenizer.indents) > initial);
  return buffer;
}

function onEqual(buffer, token, tokenizer) {
  return buffer.push(token);
}

function onIndent(buffer, token, tokenizer) {
  return buffer.push(token);
}

function onDedent(buffer, tokenizer) {
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
