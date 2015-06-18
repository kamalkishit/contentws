'use strict';

var models = require('./../../../../Common/Models/models');
var databaseService = require('./../../../../Common/Services/DatabaseService');
var redisService = require('./../../../../Common/Services/RedisService');
var logger = require('./../../../../Common/Services/Logger');

var filename = 'LikeDislikeService';

var Like = models.getLikeModel();
var Dislike = models.getDislikeModel();
var Content = models.getContentModel();

exports.like = function(userId, contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'like:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		if (!contentId) {
			logger.error(filename, 'like:' + 'contentId is null');
		}

		databaseService.findOne(Like, { userid: userId, contentid: contentId})
			.then(function(result) {
					
				logger.error(filename, 'like:' + 'already liked');
				reject('already liked');
			}, function(err) {

				var like = new Like({
					userid: userId,
					contentid: contentId
				});

				like.save(function(error) {

					if (error) {
						logger.error(filename, 'like:' + error);
						reject(new Error(error));		
					} else {
						logger.info(filename, 'like:' + 'successfully liked');
						redisService.hset(userId + ':' + 'likes' , contentId, true);
						resolve('successfully liked');
					}
				});
			});
	});

	return promise;		
};

exports.unlike = function(userId, contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'unlike:' + 'userId is null');
			reject('userId is null');
		}

		if (!contentId) {
			logger.error(filename, 'unlike:' + 'contentId is null');
			reject('contentId is null');
		}

		databaseService.findOne(Like, { userid: userId, contentid: contentId})
			.then(function(result) {

				result.remove(function(err) {

					if (err) {
						logger.error(filename, 'unlike:' + err);
						reject(new Error(err));					
					} else {
						logger.info(filename, 'unlike:' + 'unliked successfully');
						redisService.hdel(userId + ':' + 'likes' , contentId);
						resolve('unliked successfully');
					}
				});
			}, function(err) {

				logger.error(filename, 'unlike:' + err);
				reject('can not unlike as not a liked content');				
			});
	});

	return promise;
};

exports.incrementLikeCount = function(contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!contentid) {
			logger.error(filename, 'incrementLikeCount:' + 'contentId is null');
			reject('contentId is null');
		}

		databaseService.findOneAndUpdate(Content, { contentId: contentId }, { $inc: { likes: 1 }})
			.then(function(success) {

				logger.info(filename, 'incrementLikeCount:' + 'like count incremented');
				resolve('like count incremented');
			}, function(err) {

				logger.info(filename, 'incrementLikeCount:' + err);
				reject('incrementLikeCount failed');
			});
	});

};

exports.decrementLikeCount = function(contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!contentid) {
			logger.error(filename, 'decrementLikeCount:' + 'contentId is null');
			reject('contentId is null');
		}

		databaseService.findOneAndUpdate(Content, { contentId: contentId }, { $inc: { likes: -1 }})
			.then(function(success) {

				logger.info(filename, 'decrementLikeCount:' + 'like count decremented');
				resolve('like count decremented');
			}, function(err) {

				logger.error(filename, 'decrementLikeCount:' + err);
				reject(new Error('decrementLikeCount failed'));
			});
	});

	return promise;
};

exports.dislike = function(userId, contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'dislike:' + 'userId is null');
			reject(new Error('userId is null'));
		}

		if (!contentId) {
			logger.error(filename, 'dislike:' + 'contentId is null');
			reject('contentId is null');
		}

		databaseService.findOne(Dislike, { userid: userId, contentid: contentId})
			.then(function(result) {

				logger.error(filename, 'dislike:' + 'already disliked');
				reject('already disliked');		
			}, function(err) {

				var dislike = new Dislike({
					userid: userId,
					contentid: contentId
				});

				dislike.save(function(error) {

					if (error) {
						logger.error(filename, 'dislike:' + error);
						reject(new Error(error));			
					} else {
						logger.info(filename, 'dislike:' + 'successfully disliked');
						redisService.hset(userId + ':' + 'dislikes', contentId, true);
						resolve('successfully disliked');	
					}
				});	
			});	
	});

	return promise;	
};


exports.undislike = function(userId, contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!userId) {
			logger.error(filename, 'undislike:' + 'userId is null');
			reject('userId is null');
		}

		if (!contentId) {
			logger.error(filename, 'undislike:' + 'contentId is null');
			deferred.reject('contentId is null');
		}

		return databaseService.findOne(Dislike, { userid: userId, contentid: contentId})
			.then(function(result) {

				result.remove(function(err) {

					if (err) {
						logger.error(filename, 'undislike:' + err);
						reject(new Error(err));
					} else {
						logger.info(filename, 'undislike:' + 'undisliked successfully');
						redisService.hdel(userId + ':' + 'dislikes', contentId);
						resolve('undisliked successfully');
					}
				});
			
			}, function(err) {

				logger.error(filename, 'undislike:' + err);
				reject(new Error('can not dislike, as not a liked object'));
			}); 
	});

	return promise;		
};

exports.incrementDislikeCount = function(contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!contentid) {
			logger.error(filename, 'incrementDislikeCount:' + 'contentId is null');
			reject('contentId is null');
		}

		databaseService.findOneAndUpdate(Content, { contentId: contentId }, { $inc: { dislikes: 1 }})
			.then(function(success) {

				logger.error(filename, 'incrementDislikeCount:' + 'dislike count incremented');
				resolve('dislike count incremented');
			}, function(err) {

				logger.error(filename, 'incrementDislikeCount:' + err);
				reject(new Error('incrementDislikeCount failed'));
			});	
	});

	return promise;
};

exports.decrementDislikeCount = function(contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!contentid) {
			logger.error(filename, 'decrementDislikeCount:' + 'contentId is null');
			reject(new Error('contentId is null'));
		}

		databaseService.findOneAndUpdate(Content, { contentId: contentId }, { $inc: { dislikes: -1 }})
			.then(function(success) {

				logger.info(filename, 'decrementDislikeCount:' + 'dislike count decremented');
				resolve('dislike count decremented');
			}, function(err) {

				logger.error(filename, 'decrementDislikeCount:' + err);
				reject(new Error('decrementDislikeCount failed'));
			});		
	});

	return promise;
};

exports.incrementViewCount = function(contentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!contentid) {
			logger.error(filename, 'incrementViewCount:' + 'contentId is null');
			reject('contentId is null');
		}

		databaseService.findOneAndUpdate(Content, { contentId: contentId }, { $inc: { viewCount: 1 }})
			.then(function(success) {

				logger.info(filename, 'incrementViewCount:' + 'viewCount incremented');
				deferred.resolve('viewCount incremented');
			}, function(err) {

				logger.error(filename, 'incrementViewCount:' + err);
				deferred.reject(new Error('incrementViewCount failed'));
			});
	});

	return promise;	
};