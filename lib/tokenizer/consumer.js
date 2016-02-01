var utils = require('./utils');

module.exports = function(tokenizer, singleLine) {
  var buffer = new Chunk();
  consumeLine(tokenizer, buffer, onEqual.bind(null, buffer), onIndent.bind(null, buffer), onDedent.bind(null, buffer), singleLine);
  return buffer;
};

function consumeLine(tokenizer, buffer, onEqual, onIndent, onDedent, singleLine) {
  while(true) {
    var token = tokenizer.inc();
    if (!token) return buffer;

    if (token[0] === 'space' && token[1].charAt(0) === '\n') {
      if (singleLine) return buffer.push(token);
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
      while (utils.peek(tokenizer.indents) > initial) {
        tokenizer.indents.pop();
      }
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
  var tokens = this.tokens = [];
  this.push = tokens.push.bind(tokens);
  this.unshift = tokens.unshift.bind(tokens);
}
Chunk.prototype = {
  toString: function() {
    return this.tokens.map(function(token) {
      return token[1];
    }).join('');
  },
  range: function() {
    var first = utils.findNextSignificant(this) || [];
    var last = utils.findPrevSignificant(this) || [];
    return [first[2], first[3], last[4] || last[2], last[5] || last[3]];
  }
};
