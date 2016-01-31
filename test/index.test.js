var read = require('fs').readFileSync;
var readDir = require('fs').readdirSync;
var postcss = require('postcss');
var ess = require('..');

var root = __dirname + '/cases';
describe('app', function() {
  readDir(root).forEach(function(file) {
    it('should support ' + file, function(done) {
      var contents = read(root + '/' + file, 'utf8');
      postcss().process(contents, {syntax: ess}).then(function(result) {
        console.log(result.css);
        done();
      }).catch(function(err) {
        var e = new Error(err.name);
        e.stack = err.stack
        done(e);
      });
    });
  });
});
