var Tokenizer = require('./tokenizer');

module.exports = function(input) {
  var tokenizer = new Tokenizer(input);
  var tokens = tokenizer.loop();
  return tokens;
};
