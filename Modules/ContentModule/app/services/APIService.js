'use strict';

var models = require('cws-models');
var config = require('cws-config');
var dbSetupService = require('cws-dbsetup-service');
var redisService = require('cws-redis-service');
var logger = require('cws-logger');
var databaseService = require('cws-database-service');

var Content = models.getContentModel();

var filename = 'APIService';

exports.find = function(startIndex, limit) {
	var promise = new Promise(function(resolve, reject) {
		databaseService.find(Content, startIndex, limit)
			.then(function(contents) {
					logger.info(filename, 'find:' + 'success');
					resolve(contents);
				}
			, function(err) {
				console.log(err);
			});
	});

	return promise;
};

exports.findLastCreated = function(lastCreatedTime, startIndex, limit) {
	var promise = new Promise(function(resolve, reject) {
		databaseService.findLastCreated(Content, lastCreatedTime, startIndex, limit)
			.then(function(contents) {
				resolve(contents);
			}, function (err) {
				console.log(err);
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
