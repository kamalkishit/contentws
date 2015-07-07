'use strict';

var logger = require('./Logger');
var redisService = require('./RedisService');

var filename = 'UserDataService';

var likes = function(userId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'likes:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		redisService.hgetall(userId + ':likes')
			.then(function(keys) {
				console.log('success');
				resolve(keys);
			}, function(err) {
				console.log(err);
				resolve({});
			});
	});

	return promise;
};

var dislikes = function(userId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'dislikes:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		redisService.hgetall(userId + ':dislikes')
			.then(function(keys) {
				resolve(keys);
			}, function(err) {
				resolve({});
			});
	});

	return promise;
};

var bookmarks = function(userId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'bookmarks:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		redisService.hgetall(userId + ':bookmarks')
			.then(function(keys) {
				resolve(keys);
			}, function(err) {
				resolve({});
			});
	});

	return promise;
};

var getUserData = function(userId) {

	var userData = {};

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'getUserData:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		likes(userId)
			.then(function(likes) {
				userData.likes = likes;
				return dislikes(userId);
			}, function(err) {
				userData.likes = {};
				return dislikes(userId);
			})

			.then(function(dislikes) {
				userData.dislikes = dislikes;
				return bookmarks(userId);
			}, function(err) {
				userData.dislikes = {};
				return bookmarks(userId);
			})

			.then(function(bookmarks) {
				userData.bookmarks = bookmarks;
				return resolve(userData);
			}, function(err) {
				userData.bookmarks = {};
				return resolve(userData);
			});
	});

	return promise;
};

module.exports = {
	likes: likes,
	dislikes: dislikes,
	bookmarks: bookmarks,
	getUserData: getUserData
};



