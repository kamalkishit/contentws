var Q = require('q');
var openGraphScraper = require('open-graph-scraper');

exports.scrape = function(url) {

	var deferred = Q.defer();

	var options = { 'url':url, 'timeout':'5000' };

	if (!url) {
		deferred.reject(new Error('URL is null'));
		return deferred.promise;
	}

	openGraphScraper(options, function(err, scrapedData) {

		if (err) {
			//console.log('error:' + err);
			deferred.reject(new Error(err));
		} else if (!scrapedData.data.ogTitle || !scrapedData.data.ogDescription || !scrapedData.data.ogImage || !scrapedData.data.ogImage.url) {
			//console.log('error:' + 'not able to scrape content properly');
			deferred.reject(new Error('not able to scrape content properly'));
		} else {
			//console.log(scrapedData);
			deferred.resolve(scrapedData);
		}
	});

	return deferred.promise;
};
