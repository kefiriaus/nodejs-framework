var fs = require('fs');
var config = require('./configModel'),
	log = require('./logModel')(module);

/*
 *	Get Server app dirs
 */
function Dirs(req) {
	var host  = req.get('host').replace(/^www\./, '');
	var file = req.params[0] ? req.params[0] : 'index';
	var server = config.get('apps:' + host + ':server');
	var docroot = config.get('framework:docroot');
	
	var app = config.get('framework:apps') + server;

	var mDir = config.get('framework:models');
	var vDir = config.get('framework:views');
	var cDir = config.get('framework:controllers');
	var pDir = config.get('framework:public'); 

	var views = docroot + app + vDir;
	var pub = docroot + app + pDir;

	var model = mDir + file + 'Model';
	var controller = cDir + file + 'Controller';

	model = fs.existsSync(docroot + app + model + '.js') ? require(app + model) : (fs.existsSync(docroot + model + '.js') ? require(model) : false);
	controller = fs.existsSync(docroot + app + controller + '.js') ? require(app + controller) : (fs.existsSync(docroot + controller + '.js') ? require(controller) : false);

	return dirs =  {
		"host" : host,
		"file" : file,
		"views" : views,
		"pub" : pub, 
		"model" : model,
		"controller" : controller
	}
}
module.exports.Dirs = Dirs;

/*
 *	Listen sockets for all apps
 */
function Listen(app) {
	var apps = config.get('apps');
	for(var a in apps) {
		if(apps.hasOwnProperty(a)) {
			fs.stat(apps[a]['port'], function(err) {
        			if (!err) { fs.unlinkSync( apps[a]['port'] ); }
				app.listen(apps[a]['port'], function() {
			        	fs.chmodSync( apps[a]['port'], '777');
			              	log.info(a + ' started on port ' + apps[a]['port']);
        			});
			});
		}
	}
}
module.exports.Listen = Listen;
