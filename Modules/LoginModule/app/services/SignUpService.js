'use strict';

var databaseService = require('./../../../../Common/Services/DatabaseService');
var logger = require('./../../../../Common/Services/Logger');
var models = require('./../../../../Common/Models/models');
var uniqueIdGenerator = require('./../../../../Common/Services/UniqueIdGenerator');

var filename = 'SignUpService';

var User = models.getUserModel();

exports.signup = function(username, password) {

	var promise = new Promise(function(resolve, reject) {

		if (!username) {
			logger.error(filename, 'signup:' + 'username is null');
			reject(new Error('username is null'));
		}

		if (!password) {
			logger.error(filename, 'signup:' + 'password is null');
			reject(new Error('password is null'));
		}

		var user = new User({
			userId: uniqueIdGenerator.getUniqueId(),
			username: username,
			password: password
		});

		databaseService.save(user)
			.then(function(success) {

				logger.info(filename, 'signup:' + 'user created successfully');
				logger.debug(filename, 'signup:' + success);
				resolve('user created succefully');
			}, function(err) {

				logger.error(filename, 'signup:' + err);
				reject(new Error(err));
			});
	});

	return promise;
};