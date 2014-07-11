require('mootools');

var rsServer  = require('./framework/models/expressModel');
var server = new rsServer( { "module" : module } )
.conf()
.route(/^(\/([^\/]+))?/)
.listen();
