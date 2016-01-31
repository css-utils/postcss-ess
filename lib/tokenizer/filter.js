var consume = require('./consumer');
var utils = require('./utils');

var blacklist = {
  active: true,
  any: true,
  checked: true,
  'default': true,
  dir: true,
  disabled: true,
  empty: true,
  enabled: true,
  first: true,
  'first-child': true,
  'first-of-type': true,
  fullscreen: true,
  focus: true,
  hover: true,
  indeterminate: true,
  'in-range': true,
  invalid: true,
  lang: true,
  'last-child': true,
  'last-of-type': true,
  left: true,
  link: true,
  not: true,
  'nth-child': true,
  'nth-last-child': true,
  'nth-last-of-type': true,
  'nth-of-type': true,
  'only-child': true,
  'only-of-type': true,
  optional: true,
  'out-of-range': true,
  'read-only': true,
  'read-write': true,
  required: true,
  right: true,
  root: true,
  scope: true,
  target: true,
  valid: true,
  visited: true
};

module.exports = function handleFilter(token, state) {
  var prev = state.seek(-1);
  var next = state.seek(1);

  if (prev && (prev[0] != 'space' || prev[1].charAt(0) != '\n')) return state.tokens.push(token);
  if (!next || next[0] == ':' || next[0] != 'word' || blacklist[next[1]]) return state.tokens.push(token);

  var buffer = consume(state);
  var range = buffer.range();

  state.tokens.push(['filter', buffer, token[2], token[3], range[2], range[3]]);
};
