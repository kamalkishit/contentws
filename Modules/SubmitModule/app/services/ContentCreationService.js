'use strict';

var Q = require('q');
var path = require('path');

var models = require('./../../../../Common/Models/models');
var logger = require('./../../../../Common/Services/Logger');

var filename = 'ContentCreationService';

var Content = models.getContentModel();

exports.createDocument = function(scrapedData, contentCategory, documentId) {

	var promise = new Promise(function(resolve, reject) {

		if (!scrapedData) {
			logger.error(filename, 'createDocument:' + 'scrapedData is null');
			reject(new Error('scrapedData is null'));
		}

		if (!contentCategory) {
			logger.error(filename, 'createDocument:' + 'contentCategory is null');
			reject(new Error('contentCategory is null'));
		}

		console.log(scrapedData);

		if (!documentId) {
			logger.error(filename, 'createDocument:' + 'documentId is null');
			reject(new Error('documentId is null'));
		}

		var contentDocument = new Content({
			contentId: documentId,
			contentURL: scrapedData.url,
			ogTitle: scrapedData.title,
			ogDescription: scrapedData.description,
			ogSiteName: scrapedData.site_name,
			ogImageURL: scrapedData.image.url,
			imageURL: documentId + path.extname(scrapedData.image.url),
			category: contentCategory
		});

		resolve(contentDocument);
	});

	return promise;
};