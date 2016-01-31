exports.indentLength = function(token) {
  return (token[1].match(/^\n+(\s+)?/)[1] || '').length
};

exports.peek = function(arr) {
  return arr[arr.length - 1] || 0;
};

exports.findNextSignificant = function(tokenizer, i) {
  var tokens = tokenizer.inputTokens || tokenizer.tokens;
  i = typeof i == 'undefined' ? 0 : i;
  for (var token; i < tokens.length; i++) {
    token = tokens[i];
    if (!token) return null;
    if (token[0] !== 'space') return token;
  };
  return null;
};

exports.findPrevSignificant = function(tokenizer, i) {
  var tokens = tokenizer.inputTokens || tokenizer.tokens;
  i = typeof i == 'undefined' ? tokens.length - 1 : i;
  for (var token; i >= 0; i--) {
    token = tokens[i];
    if (!token) return null;
    if (token[0] !== 'space') return token;
  };
  return null;
};

exports.ws = function(length) {
  return (new Array(length + 1)).join(' ');
};

exports.handleNewline = function(token, tokenizer, onEqual, onIndent, onDedent) {
  var length = exports.indentLength(token);
  var prev = tokenizer.prev;
  var next = tokenizer.next;

  var indent = exports.peek(tokenizer.indents);
  if (length === indent) return onEqual(token, tokenizer);

  if (length > indent) {
    tokenizer.indents.push(length);
    return onIndent(token, tokenizer);
  }

  // This is not a significant line
  if (!next || next[0] === 'space') return tokenizer.push(token);

  return exports.dedent(tokenizer, prev, length, onDedent);
}

exports.dedent = function(tokenizer, prev, length, onDedent) {
  if (tokenizer.indents.length == 0) return;
  length = length || 0;
  var indent = tokenizer.indents.pop();
  if (length >= indent) return tokenizer.indents.push(indent);

  onDedent(tokenizer);
  exports.dedent(tokenizer, prev, length, onDedent);
};
