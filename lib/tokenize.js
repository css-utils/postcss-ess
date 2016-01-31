var Tokenizer = require('./tokenizer');

module.exports = function(input) {
  var tokenizer = new Tokenizer(input);
  return tokenizer.loop();
};
