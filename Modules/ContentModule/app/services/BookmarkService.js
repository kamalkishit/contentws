'use strict';

var models = require('./../../../../Common/Models/models');
var databaseService = require('./../../../../Common/Services/DatabaseService');
var redisService = require('./../../../../Common/Services/RedisService');
var logger = require('./../../../../Common/Services/Logger');

var filename = 'BookmarkService';

var Bookmark = models.getBookmarkModel();

exports.bookmark = function(userId, contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'bookmark:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		if (!contentId) {
			logger.error(filename, 'bookmark:' + 'contentId is null');
		}

		databaseService.findOne(Bookmark, { userid: userId, contentid: contentId })
			.then(function(result) {
					
				logger.error(filename, 'bookmark:' + 'already bookmarked');
				reject('already bookmarked');
			}, function(err) {

				var bookmark = new Bookmark({
					userId: userId,
					contentId: contentId
				});

				bookmark.save(function(error) {

					if (error) {
						logger.error(filename, 'bookmark:' + error);
						reject(new Error(error));		
					} else {
						logger.info(filename, 'bookmark:' + 'successfully bookmarked');
						redisService.hset(userId + ':' + 'bookmarks' , contentId, true);
						resolve('successfully bookmarked');
					}
				});
			});
	});

	return promise;
};

exports.unbookmark = function(userId, contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'unbookmark:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		if (!contentId) {
			logger.error(filename, 'unbookmark:' + 'contentId is null');
		}

		databaseService.findOne(Bookmark, { userid: userId, contentid: contentId })
			.then(function(result) {

				result.remove(function(err) {

					if (err) {
						logger.error(filename, 'unbookmark:' + err);
						reject(new Error(err));					
					} else {
						logger.info(filename, 'unbookmark:' + 'unbookmarked successfully');
						redisService.hdel(userId + ':' + 'bookmarks' , contentId);
						resolve('unbookmarked successfully');
					}
				});
			}, function(err) {

				logger.error(filename, 'unbookmark:' + err);
				reject('can not unbookmark as not a bookmarked content');				
			});
	});

	return promise;
};