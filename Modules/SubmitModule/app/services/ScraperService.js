'use strict';

var openGraph = require('open-graph');

var logger = require('./../../../../Common/Services/Logger');

var filename = 'ScraperService';

exports.scrape = function(url) {

	var promise = new Promise(function(resolve, reject) {

		logger.debug(filename, 'scrape:' + 'start');
		logger.debug(filename, 'scrape:url->' + url);

		if (!url) {
			logger.error(filename, 'scrape:' + 'URL is null');
			reject(new Error('URL is null'));
		}

		var options = { 'url': url, timeout: 5000 };

		openGraph(url, function(err, scrapedData) {

			if (err) {
				logger.error(filename, 'scrape:' + err);
				reject(new Error(err));
			} else if (scrapedData && scrapedData.title && scrapedData.description && scrapedData.image && scrapedData.image.url) {
				logger.debug(filename, 'scrape:scrapedData->' + scrapedData);
				logger.info(filename, 'scrape:', 'scraped page successfully');		
				resolve(scrapedData);
			} else {
				console.log(scrapedData);
				logger.error(filename, 'scrape:' + 'not able to scrape content properly');
				reject(new Error('not able to scrape content properly'));
			}				
		}); 
	});

	return promise;
};