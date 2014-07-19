function error(req, res, err, log, next) {
	if (err == '404') {
		res.status(err);
		var message = 'Not found URL: ' + req.url;

		log.debug(message);
		res.render('error', { status : err, message : message });
	} else if (err instanceof Object || err == '500') {
		res.status(err.status || 500);
		var message = 'Internal error(' + res.statusCode + '): ' + err.message;
		var r = new RegExp('"' + err.view.root + '"');
		message = message.replace(r, '');

		log.error(message);
		res.render('error', { status : res.statusCode, message : message });
	} else {
		next();
	}
}

module.exports = error;
