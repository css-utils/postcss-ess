var consume = require('./consumer');
var utils = require('./utils');

module.exports = function handleComment(token, state) {
  var prev = state.prev;
  var next = state.next || [];

  var buffer = consume(state);
  var comment = '/* ' + buffer.toString().trim() + ' */';
  var range = buffer.range();

  state.tokens.push(['comment', comment, token[2], token[3], range[2], range[3]], ['space', '\n']);
};
