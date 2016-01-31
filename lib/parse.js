var Input = require('postcss/lib/input');

var Parser = require('./parser');

module.exports = function(ess, opts) {
  var input = new Input(ess, opts);

  var parser = new Parser(input);

  parser.tokenize();
  parser.loop();

  return parser.root;
};
