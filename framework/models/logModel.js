require('mootools');

var LogModel = new Class({
	//Extends: require('./configModel'),
	initialize: function(options) {
		//this.parent(options);
		var winston = require('winston');
	        var path = options.module.filename.split('/').slice(-2).join('/');
		var config = options.config.get('log');

        	this.log = new winston.Logger({
                	transports: [
                        	new winston.transports.Console({
                                	colorize:       true,
                                	level:          config['level'],
                                	label:          path
                        	}),
                        	new winston.transports.File({
                               		filename:       config['file'],
                                	maxsize:        config['maxsize'],
                                	maxFiles:       config['maxfiles']
                        	})
                	]
        	});
	}
})

module.exports = LogModel;
/*
var config = require('./configModel'),
	winston = require('winston');

function Logger(module) {
	var path = module.filename.split('/').slice(-2).join('/');

	return new winston.Logger({
		transports: [
			new winston.transports.Console({
				colorize:	true,
				level:		config.get('log:level'),
				label:		path
			}),
			new winston.transports.File({
				filename:	config.get('log:file'),
				maxsize:	config.get('log:maxsize'),
				maxFiles:	config.get('log:maxfiles')
			})
		]
	});
}

module.exports = Logger;
*/
