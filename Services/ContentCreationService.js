var Q = require('q');
var models = require('./../Models/models');

exports.createDocument = function(scrapedData, contentCategory) {

	var deferred = Q.defer();

	if (!scrapedData) {
		console.log('scrapedData is null');
		deferred.reject(new Error('scrapedData is null'));
		return deferred.promise;
	}

	var contentDocument = new models.Content({
		contentURL: scrapedData.data.ogUrl,
		ogTitle: scrapedData.data.ogTitle,
		ogDescription: scrapedData.data.ogDescription,
		ogImageURL: scrapedData.data.ogImage.url,
		imageURL: encodeURIComponent(scrapedData.data.ogImage.url),
		category: contentCategory
	});

	deferred.resolve(contentDocument);
	return deferred.promise;
};