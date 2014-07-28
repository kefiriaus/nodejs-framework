require('mootools');

var MainModel = new Class({
	initialize: function(options) {
		var rsConfig = require('./configModel');
		this.config = options.config = new rsConfig(options).config;

		var rsLog = require('./logModel');
		this.log = new rsLog(options).log;
	}
})

module.exports = MainModel;
