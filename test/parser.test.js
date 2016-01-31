var should = require('should');
var cases = require('postcss-parser-tests');
var parse = require('..').parse;

describe('parser', function() {
  cases.each(function (name, css, ideal) {
    it('parses ' + name, function () {
      var root = parse(css, { from: name });
      var json = cases.jsonify(root);
      json.should.eql(ideal);
    });
  });
})
