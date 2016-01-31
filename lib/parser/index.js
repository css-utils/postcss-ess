var Parser = require('postcss/lib/parser');
var _super = Parser.prototype;
var tokenize = require('../tokenize');

var Code = require('./code');

module.exports = ESSParser;

function ESSParser() {
  Parser.apply(this, arguments);
}
ESSParser.prototype = Object.create(_super);

ESSParser.prototype.tokenize = function() {
  this.tokens = tokenize(this.input);
};

ESSParser.prototype.loop = function() {
  var token;
  while ( this.pos < this.tokens.length ) {
    token = this.tokens[this.pos];

    switch ( token[0] ) {
    case 'word':
    case ':':
      this.word();
      break;

    case '}':
      this.end(token);
      break;

    case 'comment':
      this.comment(token);
      break;

    case 'at-word':
      this.atrule(token);
      break;

    case '{':
      this.emptyRule(token);
      break;

    // case 'code-buffered':
    // case 'code-unbuffered':
    //   this.code(token);
    //   break;

    case ';':
    case 'space':
      this.spaces += token[1];
      break;

    default:
      console.log('UNHANDLED TOKEN', token);
      break;
    }

    this.pos += 1;
  }
  this.endFile();
};

ESSParser.prototype.code = function(token) {
  var node = new Code();
  this.init(node, token[2], token[3]);
  node.source.end = {line: token[4], column: token[5]};

  node.text = '';
  node.raws.left = '';
  node.raws.right = '';

  node.content = token[1];
  node.buffered = token[0] == 'code-buffered';
}
