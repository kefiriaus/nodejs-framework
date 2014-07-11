require('mootools');

var ServerController = new Class({
    Extends: require('../models/expressModel'),
    initialize: function(options) {
        this.parent(options);
    },
    route: function(url) {
        var _this = this;
        _this.app.route(url)
            .all(function(req, res, next) {
                next();
            })
            .get(function(req, res, next) {
                _this.url(req);
                _this.app.set('views', _this.views); console.log(_this.views);
                _this.app.use(_this.express.static(_this.public));

                _this.errors();

                _this.render( res , {} );
            })
        return this;
    },
    error: function(err, req, res, next) {
        var bErr = false;
        var status = '';
        var message = '';
        var params = '';

        if (err == '404') {
            bErr = true;
            status = err;
            message = 'Not found URL: ' + req.url;
            params = { status : err, message : message };
        } else if (err instanceof Object || err == '500') {
            bErr = true;
            status = err.status || 500;
            message = 'Internal error(' + res.statusCode + '): ' + err.message;

            var r = new RegExp('"' + err.view.root + '"');
            message = message.replace(r, '');

            params = { status : res.statusCode, message : message };
        }

        if (bErr) {
            this.page = 'error';
            res.status(status);
            this.log.error(message);
            this.render(res, params);
        } else {
            next();
        }
    },
    errors: function() {
        var _this = this;
        _this.app.use(function(req, res, next){
            _this.error('404', req, res, next);
        });
        _this.app.use(function(err, req, res, next) {
            _this.error(err, req, res, next);
        });
    },
    render: function(res, params) {
        res.render(this.page, params);
    }
})

module.exports = ServerController;