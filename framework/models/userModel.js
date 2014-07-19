/*
 *	User MongoDb
 */
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	validator = require('validator');

mongoose.model('User', {
	properties: {
		'email': {
			type: String,
			unique: true,
			required: true
		},
		'password': {
			type: String,
			required: true
		},
		'salt': {
			type: String,
			required: true
		},
		'created': {
			type: Date,
			default: Date.now
		}
	},

	indexes: [{email: 1}],

	getters: {
		id: function() {
			return this._id.toHexString();
		},

		password: function() {
			return this._password;
		}
	},

	setters: {
		password: function(password) {
			this._password = password;
			this.salt = this.makeSalt();
			this.password = this.encryptPassword(password);
		}
	},

	methods: {
		authenticate: function(plainText) {
			return this.encryptPassword(plainText) === this.password;
		},

		makeSalt: function() {
			return crypto.randomBytes(128).toString('base64');
		},

		encryptPassword: function(password) {
			return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
		},

		isValid: function() {
			return validator.isEmail(this.email) && validator.isLength(this.password, 6);
		},

		save: function(okFn, failFn) {
			if(this.isValid()) {
				this.__super__(okFn);
			} else {
				failFn();
			}
		}
	}
});

module.exports = function(db) {
	return db.model('User');
}
