var Q = require('q');
var urlValidatorService = require('./UrlValidatorService');
var scraperService = require('./ScraperService');
var imageService = require('./ImageService');
var databaseService = require('./DatabaseService');
var contentCreationService = require('./ContentCreationService');

var scrapedContent = {};

exports.insertURL = function(contentURL, contentCategory) {

	var deferred = Q.defer();

	if (!contentURL) {
		deferred.reject(new Error('ContentURL is null'));
		return deferred.promise;
	}

	if (!contentCategory) {
		deferred.reject(new Error('ContentCategory is null'));
		return deferred.promise;
	}

	urlValidatorService.validateURL(contentURL)
		.then(function(success) {
			console.log('URL validated');
			return scraperService.scrape(contentURL);
		}, function(err) {
			deferred.reject(new Error(err));
			console.log(err);
		})

		.then(function(scrapedData) {
			scrapedContent = scrapedData;
			console.log('content scraped successfully');
			return imageService.downloadImage(scrapedContent.data.ogImage.url);
		}, function(err) {
			console.log(err);
			deferred.reject(new Error(err));
		})

		.then(function(success) {
			console.log('image downloaded successfully');
			return contentCreationService.createDocument(scrapedContent, contentCategory);			
		}, function(err) {
			console.log(err);
			deferred.reject(new Error(err));
		})

		.then(function(contentDocument) {
			console.log('contentDocument created successfully')
			return databaseService.save(contentDocument);
		}, function(err) {
			console.log(err);
			deferred.reject(new Error(err));			
		})

		.then(function(success) {
			console.log('content saved successfully');
			deferred.resolve(success);
		}, function(err) {
			console.log(err);
			deferred.reject(new Error(err));			
		});

		return deferred.promise;
};