'use strict';

var fs = require('fs');
var request = require('request');
var path = require('path');

var logger = require('./../../../../Common/Services/Logger');

var filename = 'ImageService';

// imageURI : input image URL
exports.downloadImage = function(imageURI, imageFileName) {

	logger.debug(filename, 'downloadImage:imageURI->' + imageURI);

	var promise = new Promise(function(resolve, reject) {

		if (!imageURI) {
			logger.error(filename, 'downloadImage:' + 'imageURI is null');
			reject(new Error('imageURI is null'));
		}

		if (!imageFileName) {
			logger.error(filename, 'downloadImage:' + 'imageFileName is null')
			reject(new Error('imageFileName is null'));
		}

		request.get({
			url: imageURI, encoding: 'binary'
		}, function(error, response, body) {

			if (!error) {
				fs.writeFile(__dirname + '/../../public/static/images/' + imageFileName + path.extname(imageURI), body, 'binary', function(err) {
					if (err) {
						logger.error(filename, 'downloadImage:' + err);
						reject(new Error('not able to save file'));
					} else {
						logger.info(filename, 'downloadImage:' + 'file downloaded successfully');
						resolve(new Error('file downloaded successfully'));
					}
				});
			} else {
				logger.error(filename, 'downloadImage:' + 'not able to download file');
				reject(new Error('not able to download file'));
			}
		});
	});

	return promise;
};