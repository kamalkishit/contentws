var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });

var logger = require('cws-logger');

var filename = 'ImageConversionService';
var imageWidth = 480;
var imageHeight = 270;

exports.getImageSize = function(imageFileName) {

	var promise = new Promise(function(resolve, reject) {

		if (!imageFileName) {
			logger.error(filename, 'getImageSize:' + 'imageFileName is null');
			reject(new Error('imageFileName is null'));
		}

		gm(imageFileName).size(function(err, size) {

			if (err) {
				logger.error(filename, 'getImageSize:' + err);
				reject(new Error(err));
			} else {
				resolve({ width: size.width, height: size.height });
			}
		});
	});

	return promise;
};

exports.resizeImage = function(imageFileName) {

	var promise = new Promise(function(resolve, reject) {

		if (!imageFileName) {
			logger.error(filename, 'resizeImage:' + 'imageFileName is null');
			reject(new Error('imageFileName is null'));
		}

		gm(imageFileName).resize(imageWidth, imageHeight, '!').write(imageFileName, function(err) {

			if (err) {
				logger.error(filename, 'resizeImage:' + err);
				reject(new Error(err));
			} else {
				resolve('done');
			}
		});
	});

	return promise;	
};
