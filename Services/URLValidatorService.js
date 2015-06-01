// Not working properly

var request = require('request');
var Q = require('q');

exports.validateURL = function(url) {

	console.log(url);

	var deferred = Q.defer();

	if (!url) {
		//console.log('url is null');
		deferred.reject(new Error('URL is null'));
		return deferred.promise;
	}

	request(url, function(error, response, body) {

		if (!error && response.statusCode == 200) {
			deferred.resolve('URL is valid');
		} else {
			deferred.reject(new Error('URL is invalid'));
		}
	})

	return deferred.promise;
};