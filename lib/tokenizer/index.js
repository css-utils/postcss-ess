var tokenize = require('postcss/lib/tokenize');
var handle = require('./handlers');
var utils = require('./utils');

module.exports = ESSTokenizer;

function ESSTokenizer(input) {
  this.inputTokens = tokenize(input);
  this.tokens = [];
  this.push = this.tokens.push.bind(this.tokens);
  this.pos = -1;
  this.indents = [];
  lazyDefine(this, 'prev', utils.findPrevSignificant);
  lazyDefine(this, 'next', utils.findNextSignificant);
}

ESSTokenizer.prototype.loop = function() {
  var token = this.inc();
  while (this.more) {
    handle(token, this);
    token = this.inc();
  }
  return this.tokens;
};

ESSTokenizer.prototype.inc = function(offset) {
  var pos = this.pos += (offset || 1);
  this.prev = this.next = pos;
  var inputTokens = this.inputTokens;
  var length = inputTokens.length;
  this.more = pos < length;
  this.done = length - 1 == pos;
  return this.current = inputTokens[pos];
};

ESSTokenizer.prototype.seek = function(offset) {
  return this.inputTokens[this.pos + offset];
};

ESSTokenizer.prototype.findPrevSignificant = function(pos) {
  return utils.findPrevSignificant(this, pos);
};

ESSTokenizer.prototype.findNextSignificant = function(pos) {
  return utils.findNextSignificant(this, pos);
};

ESSTokenizer.prototype.indent = function() {
  return utils.ws(utils.peek(this.indents));
};

function lazyDefine(tokenizer, name, lookup) {
  var cached = '_' + name;
  Object.defineProperty(tokenizer, name, {
    get: function() {
      var value = tokenizer[cached];
      if (typeof value === 'number') value = tokenizer[cached] = lookup(tokenizer, value);
      return value;
    },
    set: function(value) {
      tokenizer[cached] = value;
    }
  });
}
