'use strict';

var logger = require('./../../../../Common/Services/Logger');

var filename = 'URLGenerator'

exports.getUniqueURL = function(input) {

	var promise = new Promise(function(resolve, reject) {

		if (!input) {
			logger.error(filename, 'getUniqueURL:' + 'input string is null');
			reject(new Error('input string is null'));
		}

		var subStrs = input.split(' ');

		var urlString = subStrs[0];

		for (var i = 1; i < subStrs.length; i++) {
			urlString = urlString + '-' + subStrs[i];
		}

		logger.info(filename, 'getUniqueURL:' + urlString);
		resolve(urlString);
	});
};

