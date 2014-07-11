require('mootools');

var rsServer  = require('./framework/controllers/expressController');
var server = new rsServer( { "module" : module } )
.conf()
.route(/^(\/([^\/]+))?/)
.listen();
