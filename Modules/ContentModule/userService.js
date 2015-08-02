'use strict';

var User = models.getNewUserModel();

var createUser = function(email, password) {
	var promise = new Promise(function(resolve, reject) {
		if (!email) {
			reject({ error: new Error('email is null') });
		}

		if (!password) {
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
				reject({ error: new Error(err) });
			});
	});
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
