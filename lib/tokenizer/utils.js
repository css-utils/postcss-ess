exports.indentLength = function(token) {
  return (token[1].match(/^\n+(\s+)?/)[1] || '').length
};

exports.peek = function(arr) {
  return arr[arr.length - 1] || 0;
};

exports.findNextSignificant = function(state, i) {
  var tokens = state.inputTokens || state.tokens;
  i = typeof i == 'undefined' ? 0 : i;
  for (var token; i < tokens.length; i++) {
    token = tokens[i];
    if (!token) return null;
    if (token[0] != 'space') return token;
  };
  return null;
};

exports.findPrevSignificant = function(state, i) {
  var tokens = state.inputTokens || state.tokens;
  i = typeof i == 'undefined' ? tokens.length - 1 : i;
  for (var token; i >= 0; i--) {
    token = tokens[i];
    if (!token) return null;
    if (token[0] != 'space') return token;
  };
  return null;
};

exports.ws = function(length) {
  return (new Array(length + 1)).join(' ');
};

exports.handleNewline = function(token, state, onEqual, onIndent, onDedent) {
  var length = exports.indentLength(token);
  var prev = state.prev;
  var next = state.next;

  var indent = exports.peek(state.indents);
  if (length == indent) return onEqual(token, state);

  if (length > indent) {
    state.indents.push(length);
    return onIndent(token, state);
  }

  // This is not a significant line
  if (!next || next[0] == 'space') return state.tokens.push(token);

  return exports.dedent(state, prev, length, onDedent);
}

exports.dedent = function(state, prev, length, onDedent) {
  if (state.indents.length == 0) return;
  length = length || 0;
  var indent = state.indents.pop();
  if (length >= indent) return state.indents.push(indent);

  onDedent(state);
  exports.dedent(state, prev, length, onDedent);
};
