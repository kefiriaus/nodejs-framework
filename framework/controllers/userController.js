/*
 *	User Controller
 */
function User(db, where, req, res, next) {
	var user = require(where.model)(db);

	function auth(res) {
		res.render('auth', { locals: { user: new user() } });
	}

	if(req.session.user_id) {
		user.findById(req.session.user_id, function(user) {
			if (user) {
		        	req.currentUser = user;
        			next();
      			} else {
				auth(res);
      			}
    		});
  	} else {
		auth(res);
	}
}

module.exports = User;
