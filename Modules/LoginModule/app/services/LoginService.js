'use strict';

var databaseService = require('./../../../../Common/Services/DatabaseService');
var logger = require('./../../../../Common/Services/Logger');
var models = require('./../../../../Common/Models/models');

var filename = 'LoginService';

var User = models.getUserModel();

exports.login = function(username, password) {

	var promise = new Promise(function(resolve, reject) {

		if (!username) {
			logger.error(filename, 'login:' + 'username is null');
			reject(new Error('username is null'));
		}

		if (!password) {
			logger.error(filename, 'login:' + 'password is null');
			reject(new Error('password is null'));
		}

		databaseService.findOne(User, { 'username': username })
			.then(function(user) {

				if (user.password == password) {
					logger.info(filename, 'login:' + 'User validated');
					resolve('User validated');
				} else {
					logger.error(filename, 'login:' + 'password is invalid');
					reject(new Error('password is invalid'));
				}
			}, function(err) {

				logger.error(filename, 'login:' + err);
				reject(err);
			});			
	});

	return promise;
};
