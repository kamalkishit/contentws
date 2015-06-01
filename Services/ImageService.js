var fs = require('fs');
var request = require('request');
var Q = require('q');

// imageURI : input image URL
exports.downloadImage = function(imageURI) {

	var deferred = Q.defer();

	if (!imageURI) {
		//console.log('ImageURI is null');
		deferred.reject(new Error('ImageURI is null'));
		return deferred.promise;
	}

	request.get({
		url: imageURI, encoding: 'binary'
		},function(error, response, body) {
			if (!error) {
				fs.writeFile(__dirname + '/public/static/images' + encodeURIComponent(imageURI), body, 'binary', function(err) {
					if (err) {
						deferred.reject('not able to save file');
					} else {
						deferred.resolve('file downloaded successfully');
					}
				});
			} else {
				deferred.reject('not able to download file');
				return deferred.promise;
			}
		});

	return deferred.promise;
};