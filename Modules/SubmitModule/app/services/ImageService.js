'use strict';

var fs = require('fs');
var request = require('request');
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });

var logger = require('./../../../../Common/Services/Logger');
var config = require('./../../../../Common/Config/config');

var imageWidth = 480;
var imageHeight = 270;

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

		var uri;

		if (Array.isArray(imageURI)) {
			uri = imageURI[0];
		} else {
			uri = imageURI;
		}

		console.log(uri)

		request.get({
			url: uri, encoding: 'binary'
		}, function(error, response, body) {

			if (!error) {
				fs.writeFile(config.imageDir + imageFileName + path.extname(imageURI), body, 'binary', function(err) {
					if (err) {
						logger.error(filename, 'downloadImage:' + err);
						reject(new Error('not able to save file'));
					} else {
						gm(config.imageDir + imageFileName + path.extname(imageURI))
							.resize(imageWidth, imageHeight, '!').write(config.imageDir + imageFileName + path.extname(imageURI), 
								function(err) { 

									if (err) {
										logger.error(filename, err);
									} else {
										logger.info(filename, 'successfully converted');
									}
								});
							
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