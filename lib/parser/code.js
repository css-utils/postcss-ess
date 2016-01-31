var Node = require('postcss/lib/node');

module.exports = ESSCode;

function ESSCode() {
  Node.apply(this, arguments);
}
ESSCode.prototype = Object.create(Node.prototype);

ESSCode.type = 'code';
