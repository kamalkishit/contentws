'use strict';

var databaseService = require('./../../../../Common/Services/DatabaseService');
var uniqueIdGenerator = require('./../../../../Common/Services/UniqueIdGenerator');
var logger = require('./../../../../Common/Services/Logger');

var urlValidatorService = require('./UrlValidatorService');
var scraperService = require('./ScraperService');
var imageService = require('./ImageService');
var contentCreationService = require('./ContentCreationService');

var filename = 'URLInserterService';
var documentId;

var scrapedContent = {};

exports.insertURL = function(contentURL, contentCategory) {

	var promise = new Promise(function(resolve, reject) {

		if (!contentURL) {
			logger.error(filename, 'insertURL:' + 'contentURL is null');
			reject(new Error('contentURL is null'));
		}

		if (!contentCategory) {
			logger.error(filename, 'insertURL:' + 'contentCategory is null');
			reject(new Error('contentCategory is null'));
		}

		documentId = uniqueIdGenerator.getUniqueId();

		urlValidatorService.validateURL(contentURL)
			.then(function(success) {
				logger.info(filename, 'insertURL:' + 'URL validated');
				return scraperService.scrape(contentURL);
			}, function(err) {
				logger.error(filename, 'insertURL:' + err);
				return reject(new Error(err));
			})

			.then(function(scrapedData) {
				scrapedContent = scrapedData;
				logger.info(filename, 'insertURL:' + 'content scraped successfully');
				return imageService.downloadImage(scrapedContent.image.url, documentId);
			}, function(err) {
				logger.error(filename, 'insertURL:' + err);
				return reject(new Error(err));
			})

			.then(function(success) {
				logger.info(filename, 'insertURL:' + 'image downloaded successfully');
				return contentCreationService.createDocument(scrapedContent, contentCategory, documentId);			
			}, function(err) {
				logger.error(filename, 'insertURL:' + err);
				return reject(new Error(err));
			})

			.then(function(contentDocument) {
				logger.info(filename, 'insertURL:' + 'contentDocument created successfully')
				return databaseService.save(contentDocument)
			}, function(err) {
				logger.error(filename,'insertURL:' + err);
				return reject(new Error(err));			
			})

			.then(function(success) {
				logger.info(filename, 'insertURL:' + 'content saved successfully');
				return resolve(success);
			}, function(err) {
				logger.error(filename, 'insertURL:' + err);
				return reject(new Error(err));			
			});
	});

	return promise;		
};