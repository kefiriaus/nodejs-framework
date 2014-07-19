require('mootools');

var ConfigModel = new Class({
	initialize: function(options) {
		this.config = require('nconf');
		this.config.argv()
        	.env()
        	.file({ file : './framework/configs/config.json' });
	}
})

/*
var nconf = require('nconf');

nconf.argv()
	.env()
	.file({ file : './framework/configs/config.json' });
*/
module.exports = ConfigModel;
