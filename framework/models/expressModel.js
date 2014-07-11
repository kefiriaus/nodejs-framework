require('mootools');

var ServerModel = new Class({
	Extends: require('./mainModel'),
	//Implements: require('./logModel'),
	initialize: function(options) {
		this.parent(options);
		//this.config = require('./configModel');
		//this.log = require('./logModel')(module);
		this.fs = require('fs');
		this.express = require('express');
		this.app = this.express();
		this.swig = require('swig');

		this.framework = this.config.get('framework');
		this.docroot = this.framework['docroot'];
		this.models = this.docroot + this.framework['models'];
		this.controllers = this.docroot + this.framework['controllers'];
		this.views = this.docroot + this.framework['views'];
		this.public = this.docroot + this.framework['public'];
		this.apps = this.docroot + this.framework['apps'];

		this.applications = this.config.get('apps');

		this.host = '';
		this.port = '';
		this.server = '';
		this.page = '';

		this.application = '';
		
		this.model = '';
		this.controller = '';
	},
	conf: function() {
		this.app.engine('html', this.swig.renderFile);
		this.app.set('view engine', 'html');
		this.app.set('views', this.views);
		this.app.set('view cache', false);
		this.swig.setDefaults({cache: false});
		//this.app.use(express.cookieDecoder());
		//this.app.use(express.session());
		return this;
	},
	url: function(req) {
		this.host = req.get('host').replace(/^www\./, '');
		this.port = this.applications[this.host]['port'];
		this.server = this.applications[this.host]['server'];
		this.page = req.params[0] ? req.params[0] : 'index';

		this.models = this.folder(this.framework['models']);
		this.controllers = this.folder(this.framework['controllers']);
        this.views = this.folder(this.framework['views']);
        this.public = this.folder(this.framework['public']);

		this.model = this.file(this.models + this.page + 'Model');
		this.controller = this.file(this.controllers + this.page + 'Controller');
	},
	folder: function(dir) {
		this.application = this.apps + this.server;

		return this.application + dir;
	},
	file: function(file) {
		var obj = false;
		file = file + '.js';
		if (this.fs.existsSync(this.application + file)) {
			obj = require(this.application + file);
		} else if (this.fs.existsSync(this.docroot + file)) {
			obj = require(this.docroot + file);
		}
		return obj;
	},
	listen: function() {
		var _this = this;
        	for(var a in _this.applications) {
                if(_this.applications.hasOwnProperty(a)) {
                    _this.port = _this.applications[a]['port'];
                    _this.fs.stat(_this.port, function(err) {
                        if (!err) { _this.fs.unlinkSync( _this.port ); }
                        _this.app.listen(_this.port, function() {
                            _this.fs.chmodSync( _this.port, '777');
                            _this.log.info(a + ' started on port ' + _this.port);
                        });
                    });
                }
        	}
	}
})

module.exports = ServerModel;
