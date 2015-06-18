'use strict';

var models = require('./../../../../Common/Models/models');
var config = require('./../../../../Common/Config/config');
var dbSetupService = require('./../../../../Common/Services/DBSetupService');
var redisService = require('./../../../../Common/Services/RedisService');
var logger = require('./../../../../Common/Services/Logger');

var Content = models.getContentModel();

var filename = 'APIService';

exports.find = function(startIndex, limit) {

	var promise = new Promise(function(resolve, reject) {

		Content.find().skip(startIndex).limit(limit)
			.exec(function(err, contents) {

				if (err) {
					logger.error(filename, 'find:' + err);
					reject(new Error(err));
				} else {
					logger.info(filename, 'find:' + 'success');

					for (var i = 0; i < contents.length; i++) {
						redisService.hget('abc' + ':' + 'likes' , contents[i].contentId)
							.then(function(success) {

								console.log(success);
								contents[i].isLiked = success;
							});


						redisService.hget('abc' + ':' + 'dislikes' , contents[i].contentId)
							.then(function(success) {

								contents[i].isDisliked = success;
							});				
					}

					console.log(contents);
					resolve(contents);
				}
			});
	});

	return promise;
};
/*
exports.findOne = function(contentId) {

	var deferred = Q.defer();

	if (!id) {
		logger.error(filename, 'contentId is null');
		deferred.reject('contentId is null');
		return deferred.promise;
	}

	Content.findOne().exec(function(err, content) {

		if (err) {
			deferred.reject(new Error(err));
		} else {
			deferred.resolve(content);
		}
	});

	return deferred.promise;
};

exports.search = function(query) {

	var deferred = Q.defer();

	if (!query) {
		deferred.reject(new Error('query string is null'));
		return deferred.promise;
	}

	console.log(query);

	Content.search({query_string: { query: query }}, function(err, contents) {
		if (err) {
			console.log(err);
			deferred.reject(new Error(err));
		} else {
			var results = [];

			for (var i = 0; i < contents.hits.hits.length; i++) {
				results.push(contents.hits.hits[i]._source);
			}
			deferred.resolve(results);			
		} 
	});

	return deferred.promise;
};*/
