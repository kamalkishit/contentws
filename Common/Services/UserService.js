'use strict';

var logger = require('./Logger');
var redisService = require('./RedisService');

exports.getLikesData = function(userId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'getLikesData:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		redisService.hkeys(userId + ':likes')
			.then(function(keys) {
				console.log('success');
				resolve(keys);
			}, function(err) {
				console.log(err);
				resolve(null);
			});
	});

	return promise;
};

exports.getDislikesData = function(userId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'getLikesData:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		redisService.hkeys(userId + ':dislikes')
			.then(function(keys) {
				resolve(keys);
			}, function(err) {
				resolve(null);
			});
	});

	return promise;
};

var getBookmarksData = function(userId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'getLikesData:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		redisService.hkeys(userId + ':bookmarks')
			.then(function(keys) {
				resolve(keys);
			}, function(err) {
				resolve(null);
			});
	});

	return promise;
};

var getUserData = function(userId) {


};



