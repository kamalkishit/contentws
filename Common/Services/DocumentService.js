'use strict';

var Q = require('q');

var models = require('./../models/models');
var databaseService = require('./DatabaseService');

var Like = models.getLikeModel();
var Dislike = models.getDislikeModel();

exports.like = function(userId, contentId) {

	var deferred = Q.defer();

	if (!userId) {
		deferred.reject('userId is null');
		return deferred.promise;
	}

	if (!contentId) {
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	databaseService.findOne(Like, { userid: userId, contentid: contentId})
		.then(function(result) {

				deferred.reject('already liked');	
		}, function(err) {

			var like = new Like({
				userid: userId,
				contentid: contentId
			});

			like.save(function(error) {

				if (error) {
					deferred.reject(new Error(error));			
				} else {
					deferred.resolve('successfully liked');
				}
			});	
		}); 

	return deferred.promise;	
};

exports.unlike = function(userId, contentId) {

	var deferred = Q.defer();

	if (!userId) {
		deferred.reject('userId is null');
		return deferred.promise;
	}

	if (!contentId) {
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	databaseService.findOne(Like, { userid: userId, contentid: contentId})
		.then(function(result) {

			result.remove(function(err) {

				if (err) {
					deferred.reject('can not dislike');
				} else {
					deferred.resolve('disliked successfully');
				}
			})	
		}, function(err) {

			deferred.reject('can not dislike as not a liked object');				
		}); 

	return deferred.promise;	
};

exports.incrementLikeCount = function(contentId) {

	var deferred = Q.defer();

	if (!contentid) {
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	return deferred.promise;
};

exports.decrementLikeCount = function(contentId) {

	var deferred = Q.defer();

	if (!contentid) {
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	return deferred.promise;
};

exports.dislike = function(userId, contentId) {

	var deferred = Q.defer();

	if (!userId) {
		deferred.reject('userId is null');
		return deferred.promise;
	}

	if (!contentId) {
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	databaseService.findOne(Dislike, { userid: userId, contentid: contentId})
		.then(function(result) {

				deferred.reject('already disliked');	
		}, function(err) {

			var dislike = new Dislike({
				userid: userId,
				contentid: contentId
			});

			dislike.save(function(error) {

				if (error) {
					deferred.reject(new Error(error));			
				} else {
					deferred.resolve('successfully disliked');
				}
			});	
		}); 

	return deferred.promise;	
};


exports.undislike = function(contentId) {

	var deferred = Q.defer();

	if (!contentid) {
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	return deferred.promise;	
};

exports.incrementDislikeCount = function(contentId) {

	var deferred = Q.defer();

	if (!contentid) {
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	return deferred.promise;	
};

exports.decrementDislikeCount = function(contentId) {

	var deferred = Q.defer();

	if (!contentid) {
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	return deferred.promise;	

};

exports.incrementViewCount = function() {

}