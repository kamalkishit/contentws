'use strict';

var databaseService = require('cws-database-service');
var uniqueIdGenerator = require('cws-unique-id-generator');
var models = require('cws-models');
var User = models.getUserModel();

var jsonWebToken = require('jsonwebtoken');

// like, bookmark, updateUser, signup, login
exports.signup = function(emailId, password) {
	console.log(emailId);
	var promise = new Promise(function(resolve, reject) {
		if (!emailId) {
			logger.error(filename, 'signup:' + 'emailId is null');
			reject({ error: new Error('emailId is null') });
		}

		if (!password) {
			logger.error(filename, 'signup:' + 'password is null');
			reject({ error: new Error('password is null') });
		}

		var user = new User({
			userId: uniqueIdGenerator.getUniqueId(),
			emailId: emailId,
			password: password
		});

		databaseService.save(user)
			.then(function(success) {
				resolve({ success: 'user ' + emailId + ' created succefully' });
			}, function(err) {
				console.log(err)
				reject({ error: new Error(err) });
			});
	});

	return promise;
};

exports.login = function(emailId, password) {
	var promise = new Promise(function(resolve, reject) {
		if (!emailId) {
			logger.error(filename, 'login:' + 'emailId is null');
			reject({ error: new Error('emailId is null') });
		}

		if (!password) {
			logger.error(filename, 'login:' + 'password is null');
			reject({ error: new Error('password is null') });
		}

		databaseService.findOne(User, { 'emailId': emailId })
			.then(function(user) {
				if (user.password == password) {
					var token = jsonWebToken.sign(user, config.secretKey, {
          				expiresInMinutes: 1440 // expires in 24 hours
        			});
					logger.info(filename, 'login:' + 'User validated');
					resolve({ success: 'User validated', 
						userId: user.userId,
						token: token 
					});
				} else {
					logger.error(filename, 'login:' + 'password is invalid');
					reject({ error: new Error('password is invalid') });
				}
			}, function(err) {
				logger.error(filename, 'login:' + err);
				reject({ error: err });
			});			
	});

	return promise;
};

var updateUser = function(userId, updatedData) {

};

exports.likeContent = function(userId, contentId) {
	var promise = new Promise(function(resolve, reject) {
		if (!userId) {
			reject({ error: new Error('userId is null') });
		}

		if (!contentId) {
			reject({ error: new Error('contentId is null') });
		}

		var searchQuery = { userId: userId, likes: { $ne: contentId }};
		var updateQuery = { $push: { likes: contentId }};

		ContentModel.update(searchQuery, updateQuery, function(err, content) {
			if (err) {
				reject(err);
			} else {
				resolve(content);
			}
		});
	});

	return promise;
};

exports.unlikeContent = function(userId, contentId) {
	var promise = new Promise(function(resolve, reject) {
		if (!userId) {
			reject({ error: new Error('userId is null') });
		}

		if (!contentId) {
			reject({ error: new Error('contentId is null') });
		}

		var searchQuery = { userId: userId, likes: contentId };
		var updateQuery = { $pull: { likes: contentId }};

		ContentModel.update(searchQuery, updateQuery, function(err, content) {
			if (err) {
				reject(err);
			} else {
				resolve(content);
			}
		});
	});

	return promise;
};

exports.bookmarkContent = function(userId, contentId) {
	var promise = new Promise(function(resolve, reject) {
		if (!userId) {
			reject({ error: new Error('userId is null') });
		}

		if (!contentId) {
			reject({ error: new Error('contentId is null') });
		}

		var searchQuery = { userId: userId, bookmarks: { $ne: contentId }};
		var updateQuery = { $push: { bookmarks: contentId }};

		ContentModel.update(searchQuery, updateQuery, function(err, content) {
			if (err) {
				reject(err);
			} else {
				resolve(content);
			}
		});
	});

	return promise;
};

exports.unbookmarkContent = function(userId, contentId) {
	var promise = new Promise(function(resolve, reject) {
		if (!userId) {
			reject({ error: new Error('userId is null') });
		}

		if (!contentId) {
			reject({ error: new Error('contentId is null') });
		}

		var searchQuery = { userId: userId, bookmarks: contentId };
		var updateQuery = { $pull: { bookmarks: contentId }};

		ContentModel.update(searchQuery, updateQuery, function(err, content) {
			if (err) {
				reject(err);
			} else {
				resolve(content);
			}
		});
	});

	return promise;
};

var login = function(email, password) {
	var promise = new Promise(function(resolve, reject) {
		if (!email) {
			reject({ error: new Error('email is null') });
		}

		if (!password) {
			reject({ error: new Error('password is null') });
		}

		databaseService.findOne(User, { 'emailId': emailId })
			.then(function(user) {
				if (user.password == password) {
					var token = jsonWebToken.sign(user, config.secretKey);
					resolve({ success: 'user ' + email + ' validated successfully',
							user: user, token: token });
				} else {
					reject({ error: new Error('password is invalid') });
				}
			}, function(err) {
				reject({ error: new Error(err) });
			});
	});
};

var deleteUser = function(userId) {
	var promise = new Promise(function(resolve, reject) {
		if (!userId) {
			reject(new Error('userId is null'));
		}

		// delete user
	});
};
