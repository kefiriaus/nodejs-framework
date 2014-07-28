//var express = require('express'),
//	app = express(),
var	swig = require('swig'),
	fs = require('fs'),
	mongoose = require('mongoose').Mongoose,
	mongoStore = require('connect-mongodb');

var config = require('./framework/models/configModel'),
	express = new (require('./framework/models/expressModel'))(),
//	app = express(),	
	dirs = require('./framework/models/serverModel').Dirs,
	listen = require('./framework/models/serverModel').Listen,
	log = require('./framework/models/logModel')(module),
	error = require('./framework/controllers/errorController');

app.engine('html', swig.renderFile);

/*
 * View engine
 */
app.set('view engine', 'html');
app.set('views', config.get('framework:docroot') + config.get('framework:views'));

/*
 * View cache
 */

app.set('view cache', false);
swig.setDefaults({cache: false});

/*
 * Use Session
 */
//app.use(express.cookieDecoder());
//app.use(express.session());

/*
 * Public dir
 */
//app.use(app.router);
app.use(express.static(config.get('framework:docroot') + config.get('framework:public')));

/*
 * Routing with error checking
 */
app.route(/^(\/([^\/]+))?/)
.all(function(req, res, next) {
	next();
})
.get(function(req, res, next) {
	var where = dirs(req);
	var file = where.file;
	var controller = where.controller;

	// Set current app views dir
	app.set('views', where.views);
	
	// Set current app public dir
	app.use(express.static(where.pub));
        
	//res.render( file, {}, function(err, html) {

		app.use(function(req, res, next){
			error(req, res, '404', log, next);
			return;
		});

		app.use(function(err, req, res, next){
			error(req, res, err, log, next);
			return;
		});

		res.render( file , {} );
	//});
})

listen(app);

//app.get(/^(\/(?:(?!css\/).)[^\/]+)?/, function(req, res){
/*app.get(/^(\/([^\/]+))?/, function(req, res){
	var file = req.params[0] ? req.params[0] : 'index';
	var tmpController = config.get('application:controllers') + file + 'Controller';

	fs.exists(__dirname + tmpController + '.js', function(exists){
		if(exists) {
			var controller = require('.' + tmpController);
		}
		else {
			var controller = {};
		}

		res.render( file, {}, function(err, html) {

			app.use(function(req, res, next){
        			error(req, res, '404', log, next);
        			return;
			});

			app.use(function(err, req, res, next){
        			error(req, res, err, log, next);
        			return;
			});
		
			res.render( file , {} );
		});
	});
});*/
/*
var a = config.get('apps')['wna.today'];
fs.stat(a['port'], function(err) {
	if (!err) { fs.unlinkSync( a['port'] ); }
	app.listen(a['port'], function() {
    		fs.chmodSync( a['port'], '777');
		log.info(a['server'] + ' started on port ' + a['port']);
  	});
});*/
