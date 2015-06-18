'use strict';

var request = require('request');

var config = require('./../../../../Common/Config/config');
var logger = require('./../../../../Common/Services/Logger');

var filename = 'URLValidatorService'

exports.validateURL = function(url) {

	var promise = new Promise(function(resolve, reject) {

		if (!url) {
			logger.error(filename, 'validateURL:' + 'url is null');
			reject(new Error('url is null'));
		}

		request(url, function(error, response, body) {

			if (!error && response.statusCode == config.httpSuccess) {
				logger.info(filename, 'validateURL:' + 'url is valid')
				resolve('url is valid');
			} else {
				logger.error(filename, 'validateURL:' + 'url is invalid');
				reject('url is invalid');
			}
		});
	});

	return promise;
};

