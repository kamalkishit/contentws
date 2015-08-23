'use strict';

var databaseService = require('cws-database-service');
var models = require('cws-models');
var urlInserterService = require('cws-url-inserter-service');

var ContentModel = models.getContentModel();

exports.insertContent = function(userId, url, category) {
	var promise = new Promise(function(resolve, reject) {
		if (!userId) {
			reject({ error: new Error('userId is null') });
		}

		if (!url) {
			reject({ error: new Error('url is null') });
		}

		if (!category) {
			reject({ error: new Error('category is null' )});
		}

		urlInserterService.insertURL(userId, url, category)
			.then(function(success) {
				console.log('insert success');
			}, function(err) {
				console.log('insert failure');
			});
	});

	return promise;
};

exports.createPaper = function(contentIds) {
	var promise = new Promise(function(resolve, reject) {
		if (!contentIds) {
			reject({ error: new Error('contentIds is null') });
		}

		var contentIdsArray = contentIds.split(',');
		for (var i = 0; i < contentIdsArray.length; i++) {
			contentIdsArray[i] = contentIdsArray[i].trim();
		}

		console.log(contentIdsArray);
	});

	return promise;
};

exports.getPaper = function() {
	return databaseService.find(ContentModel);
}

exports.incrementViewCount = function(contentId) {
	var promise = new Promise(function(resolve, reject) {
		if (!contentId) {
			reject({ error: new Error('contentId is null') });
		}

		var searchQuery = { contentId: contentId };
		var updateQuery = { $inc: { viewCount: 1 }};

		ContentModel.update(searchQuery, updateQuery, function(err, content) {
			if (err) {
				reject({ error : err });
			} else {
				resolve({ success: content });
			}
		});
	});

	return promise;
}

exports.likeContent = function(userId, contentId) {
	var promise = new Promise(function(resolve, reject) {
		if (!userId) {
			reject({ error: new Error('userId is null') });
		}

		if (!contentId) {
			reject({ error: new Error('contentId is null') });
		}

		var searchQuery = { contentId: contentId };
		var updateQuery = { $inc: { likesCount: 1 }};

		ContentModel.update(searchQuery, updateQuery, function(err, content) {
			if (err) {
				reject({ error : err });
			} else {
				resolve({ success: content });
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

		var searchQuery = { contentId: contentId };
		var updateQuery = { $inc: { likesCount: -1 }};

		ContentModel.update(searchQuery, updateQuery, function(err, content) {
			if (err) {
				reject({ error: err });
			} else {
				resolve({ success: content });
			}
		});
	});

	return promise;
};

exports.getContents = function(lastCreatedDate) {
	if (!lastCreatedDate) {
		return databaseService.find(ContentModel);
	} else {
		return databaseService.findAfterCreated(ContentModel, lastCreatedDate);
	}
};

exports.refreshContents = function(startCreatedDate) {
	return databaseService.findBeforeCreated(ContentModel, startCreatedDate);
}

exports.search = function(searchStr) {
	var promise = new Promise(function(resolve, reject) {
		if (!searchStr) {
			reject({ error: new Error('searchStr is null') });
		}

		ContentModel.find({ $text: { $search: searchStr }}, { score: { $meta: 'textScore' }}).sort({ score: { $meta: 'textScore' }})
			.exec(function(err, contents) {
				if (err) {
					reject({ error: new Error(err) });
				} else {
					resolve({ success: 'success', 
						contents: contents 
					});
				}
			});
	});

	return promise;
};